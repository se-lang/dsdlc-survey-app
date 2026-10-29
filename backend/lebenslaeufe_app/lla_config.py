import datetime
import inspect
import os
import re
from collections.abc import Iterable
from functools import cached_property
from pathlib import Path
from typing import Any, Collection, Literal
from urllib.parse import urlunparse

import email_validator
from django.conf.urls.static import static
from django.core.exceptions import ImproperlyConfigured
from django.core.management import ManagementUtility
from pydantic import (
    BaseModel,
    conlist,
    HttpUrl,
    PostgresDsn,
    field_validator,
    model_validator,
    RedisDsn,
    NameEmail,
    Field,
    ConfigDict,
)
from pydantic_file_secrets import FileSecretsSettingsSource, SettingsConfigDict
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    TomlConfigSettingsSource,
    JsonConfigSettingsSource,
    YamlConfigSettingsSource,
)

base_dir = Path(__file__).resolve().parent.parent


def _get_config_file_settings() -> SettingsConfigDict:
    config_file_formats = ('toml', 'yaml', 'json')
    config_file = os.getenv('LLA_CONFIG_FILE', base_dir / 'lla.config.toml')
    config_file_format = os.getenv('LLA_CONFIG_FILE_TYPE')
    if not config_file_format:
        _, config_file_format = os.path.splitext(config_file)
        config_file_format = config_file_format.lstrip('.')
    if config_file_format not in config_file_formats:
        raise ImproperlyConfigured(
            f'Config file format must be one of {config_file_formats}, not {config_file_format}.'
            f'Set LLA_CONFIG_FILE_TYPE or apply proper file extension.'
        )
    return SettingsConfigDict(
        **{f'{config_file_format}_file': config_file},
        yaml_file_encoding='utf-8',
        json_file_encoding='utf-8',
    )


class LlaAuthConfig(BaseModel):
    activate_user_email_lifetime: datetime.timedelta = datetime.timedelta(days=3)
    inactive_user_lifetime: datetime.timedelta = datetime.timedelta(days=7)
    reset_password_email_lifetime: datetime.timedelta = datetime.timedelta(days=3)
    change_email_token_lifetime: datetime.timedelta = datetime.timedelta(days=1)
    session_cookie_lifetime: Literal['browser_session'] | datetime.timedelta = (
        datetime.timedelta(hours=2)
    )
    login_enabled: bool = True
    registration_enabled: bool = True


class LLaNetworkConfig(BaseModel):
    allowed_urls: conlist(HttpUrl, min_length=1)
    frontend_url: HttpUrl
    client_ip_source: str | list[str] | None = None
    proxy_count: int | None = None
    # TODO: More granular config for this!
    rate_limiting: bool = True

    def _all_urls(self) -> Iterable[HttpUrl]:
        yield from self.allowed_urls
        yield self.frontend_url

    @classmethod
    def _url_to_trusted_origins(cls, url: HttpUrl) -> Iterable[str]:
        scheme: str = url.scheme
        port: int | None = url.port
        if (
            scheme == 'http'
            and port == 80
            or scheme == 'https'
            and port == 443
            or not port
        ):
            yield urlunparse((scheme, url.host, '', '', '', ''))
        if port:
            yield urlunparse((scheme, f'{url.host}:{port}', '', '', '', ''))

    def get_csrf_trusted_origins(self) -> list[str]:
        return [
            origin
            for url in self._all_urls()
            for origin in self._url_to_trusted_origins(url)
        ]

    def get_allowed_hosts(self) -> list[str]:
        return [url.host for url in self._all_urls()]

    def get_ipware_meta_precedence_order(self) -> Collection[str] | None:
        match self.client_ip_source:
            case str() as single_value:
                return (single_value,)
            case list() as multi_value:
                return multi_value
            case None:
                return None
            case _:
                raise AssertionError()


class LlaRedisConfig(BaseModel):
    dsn: RedisDsn
    database: int | None = None
    username: str | None = None
    password: str | None = None
    key_prefix: str | None = None

    @cached_property
    def full_dsn(self) -> RedisDsn:
        return RedisDsn.build(
            scheme=self.dsn.scheme,
            username=self.username or self.dsn.username,
            password=self.password or self.dsn.password,
            host=self.dsn.host,
            port=self.dsn.port,
            path=str(self.database) if self.database is not None else self.dsn.path,
            query=self.dsn.query,
            fragment=self.dsn.fragment,
        )

    def get_redis_config(self) -> dict:
        cache_config = {
            'BACKEND': 'django.core.cache.backends.redis.RedisCache',
            'LOCATION': self.full_dsn.encoded_string(),
        }
        if self.key_prefix:
            cache_config['KEY_PREFIX'] = self.key_prefix

        return cache_config


class LlaEmailConfig(BaseModel):
    host: str = Field(pattern=re.compile(r'^.+(?:\:\d+)?$'))
    username: str
    password: str
    security: Literal['implicit_tls', 'explicit_tls', 'plaintext']
    source_email: NameEmail

    def get_host_and_port(self) -> tuple[str, int]:
        spl = self.host.rsplit(':', 1)
        match spl:
            case [host, port]:
                return host, int(port)
            case [host]:
                match self.security:
                    case 'implicit_tls':
                        return host, 465
                    case 'explicit_tls':
                        return host, 587
                    case _:
                        return host, 25
            case _:
                raise AssertionError()


class LlaDatabaseConfig(BaseModel):
    dsn: PostgresDsn
    database: str | None = None
    username: str | None = None
    password: str | None = None
    extra_options: dict[str, Any] = dict()

    @model_validator(mode='after')
    def check_db_name(self):
        assert self.dsn.path or self.database, 'database must be provided'
        return self

    @field_validator('dsn')
    @classmethod
    def check_one_host(cls, v: PostgresDsn):
        hosts = v.hosts()
        assert hosts and len(hosts) == 1, 'exactly one host must be given'
        return v

    def get_database_config(self) -> dict:
        db_host = self.dsn.hosts()[0]
        db_options = dict(self.dsn.query_params())
        db_options.setdefault('sslmode', 'prefer')
        return {
            'default': {
                **self.extra_options,
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': self.database or self.dsn.path.lstrip('/'),
                'USER': self.username or db_host.get('username'),
                'PASSWORD': self.password or db_host.get('password'),
                'HOST': db_host.get('host'),
                'PORT': db_host.get('port'),
                'OPTIONS': db_options,
            }
        }


class LlaStorageConfig(BaseModel):
    model_config = ConfigDict(extra='allow')

    type: Literal['local', 's3', 'sftp'] = 'local'

    # these are listed here so they can be picked up by the pydantic settings
    # machinery and can be set by means other than just directly in the config file
    # (e.g. environment variable)
    access_key: str | None = None
    secret_key: str | None = None
    path: str | None = None

    def extra_urls(self) -> list:
        if self.type == 'local':
            return static('/api/media', document_root=str(base_dir / self.path))
        else:
            return []

    def get_storage_config(self) -> dict:
        options = self.model_dump(exclude={'type'}, exclude_unset=True)
        match self.type:
            case 's3':
                return {
                    'BACKEND': 'storages.backends.s3.S3Storage',
                    'OPTIONS': options,
                }
            case 'sftp':
                return {
                    'BACKEND': 'storages.backends.sftpstorage.SFTPStorage',
                    'OPTIONS': options,
                }
            case 'local':
                return {
                    'BACKEND': 'django.core.files.storage.FileSystemStorage',
                    'OPTIONS': {
                        'location': str(base_dir / (self.path or '.media')),
                        'base_url': '/api/media/',
                    },
                }
            case _:
                raise AssertionError()


class LlaZofarConfig(BaseModel):
    hide_completed_questionnaires: bool = Field(default=False)
    events_enabled: bool = Field(default=True)


class LlaConfigPreload(BaseSettings):
    """
    This is a barebones version of LlaConfig, see load_lla_config to see why it is needed.
    """

    debug_mode: bool = False
    development_mode: bool = False

    model_config = SettingsConfigDict(
        env_prefix='LLA_',
        env_nested_delimiter='_',
        env_nested_max_split=1,
        nested_model_default_partial_update=True,
        secrets_dir=os.getenv('LLA_SECRETS_DIR'),
        secrets_prefix='',
        secrets_nested_delimiter='_',
        **_get_config_file_settings(),
        extra='allow',
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return (
            init_settings,
            env_settings,
            FileSecretsSettingsSource(file_secret_settings),
            TomlConfigSettingsSource(settings_cls),
            JsonConfigSettingsSource(settings_cls),
            YamlConfigSettingsSource(settings_cls),
        )


class LlaPushConfig(BaseModel):
    max_attempts: int = 10
    backoff_interval: datetime.timedelta = datetime.timedelta(seconds=1)
    backoff_rate: float = 2.0
    keep_interval: datetime.timedelta = datetime.timedelta(weeks=2)


class LlaConfig(LlaConfigPreload):
    log_sql: bool = False
    secret_key: str
    auth: LlaAuthConfig = LlaAuthConfig()
    network: LLaNetworkConfig
    db: LlaDatabaseConfig
    redis: LlaRedisConfig
    email: LlaEmailConfig
    storage: LlaStorageConfig
    zofar: LlaZofarConfig = LlaZofarConfig()
    push_notifications: LlaPushConfig = LlaPushConfig()

    model_config = SettingsConfigDict(extra='forbid')


def _is_collect_static() -> bool:
    # This is a hack to detect if we're running in "collectstatic" mode
    # In this case we don't have a valid config file, but that is okay, since we're only
    # collecting static files.
    frame = inspect.currentframe().f_back
    while frame:
        if (
            frame.f_code.co_name == 'execute_from_command_line'
            and frame.f_globals['__name__'] == 'django.core.management'
        ):
            for local in frame.f_locals.values():
                if isinstance(local, ManagementUtility):
                    return len(local.argv) >= 2 and local.argv[1] == 'collectstatic'
            break
        frame = frame.f_back
    return False


def load_lla_config() -> LlaConfig:
    """
    Load the main application config file. If Django is running collectstatic, load a dummy
    configuration file instead.
    """
    if _is_collect_static():
        email_validator.TEST_ENVIRONMENT = True

        return LlaConfig(
            debug_mode=False,
            development_mode=False,
            log_sql=False,
            secret_key='__INSECURE_DUMMY__',
            auth=LlaAuthConfig(),
            network=LLaNetworkConfig(
                allowed_urls=[HttpUrl('http://localhost')],
                frontend_url=HttpUrl('http://localhost'),
            ),
            db=LlaDatabaseConfig(
                dsn=PostgresDsn('postgres://localhost/dummy'),
                username='',
                password='',
            ),
            redis=LlaRedisConfig(
                dsn=RedisDsn('redis://localhost'),
            ),
            email=LlaEmailConfig(
                host='localhost',
                username='',
                password='',
                security='plaintext',
                source_email=NameEmail('Dummy', 'dummy@localhost.test'),
            ),
            storage=LlaStorageConfig(),
        )

    # First we need to figure out if "development_mode" is configured. In this case the
    # rest of the config file (mainly email addresses) are validated differently.
    # So, "preload" is used to figure out if development_mode is enabled. If so, we switch the
    # email validator into test mode before loading the main config file.
    preload = LlaConfigPreload()
    if preload.development_mode:
        email_validator.TEST_ENVIRONMENT = True

    return LlaConfig()
