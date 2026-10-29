import os
from pathlib import Path

from django.templatetags.static import static
from import_export.formats.base_formats import XLSX, XLS, JSON, CSV

from lebenslaeufe_app.lla_config import load_lla_config

BASE_DIR = Path(__file__).resolve().parent.parent


LLA_CONFIG = load_lla_config()
DEBUG = LLA_CONFIG.debug_mode
SECRET_KEY = LLA_CONFIG.secret_key

INSTALLED_APPS = [
    'modeltranslation',
    'lebenslaeufe_app',
    # 'unfold.apps.BasicAppConfig',
    # 'unfold.contrib.filters',
    # 'unfold.contrib.forms',
    # 'unfold.contrib.inlines',
    # 'unfold.contrib.import_export',
    'lebenslaeufe_app.admin_config.CustomAdminAppConfig',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.postgres',
    'debug_toolbar',
    'import_export',
    'import_export_extensions',
    'strawberry_django',
    'lla_auth',
    'post_office',
    'django_celery_beat',
    'django_jsonform',
    'lebenslaeufe_app.push_notifications_config.PushNotificationsAppConfig',
    'lla_translations',
    'lla_push',
    'lla_questionnaire',
    'lla_paradata',
    'lla_zofar',
    'django_cleanup.apps.CleanupConfig',
]

MIDDLEWARE = [
    'strawberry_django.middlewares.debug_toolbar.DebugToolbarMiddleware',
    'lebenslaeufe_app.first_install.LlaFirstSetupMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'lebenslaeufe_app.urls'
WSGI_APPLICATION = 'lebenslaeufe_app.wsgi.application'

DATABASES = LLA_CONFIG.db.get_database_config()
CACHES = {
    'default': LLA_CONFIG.redis.get_redis_config(),
}
STORAGES = {
    'default': LLA_CONFIG.storage.get_storage_config(),
    'staticfiles': {
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage',
    },
}

CSRF_TRUSTED_ORIGINS = LLA_CONFIG.network.get_csrf_trusted_origins()
ALLOWED_HOSTS = LLA_CONFIG.network.get_allowed_hosts()
IPWARE_META_PRECEDENCE_ORDER = LLA_CONFIG.network.get_ipware_meta_precedence_order()

PASSWORD_RESET_TIMEOUT = LLA_CONFIG.auth.reset_password_email_lifetime.total_seconds()

RATELIMIT_ENABLE = LLA_CONFIG.network.rate_limiting

INTERNAL_IPS = ['127.0.0.1']

IMPORT_EXPORT_TMP_STORAGE_CLASS = 'import_export.tmp_storages.CacheStorage'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        }
    },
    'loggers': {
        'django.server': {
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'level': 'INFO',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG' if LLA_CONFIG.log_sql else 'ERROR',
            'propagate': False,
        },
        'push_response': {
            'level': 'ERROR',
            'propagate': False,
        },
        'lla_zofar': {
            'level': 'DEBUG',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

SILENCED_SYSTEM_CHECKS = [
    # We have a unique constraint, just in a way that Django cannot detect
    'auth.W004',
]


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'lla_auth.User'
# We use AllowAllUsersModelBackend so that we can distinguish between "invalid login" and
# "inactive user". inactive users are rejected outside the auth backend.
AUTHENTICATION_BACKENDS = ('django.contrib.auth.backends.AllowAllUsersModelBackend',)

# Session configuration
SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'
if LLA_CONFIG.auth.session_cookie_lifetime == 'browser_session':
    SESSION_EXPIRE_AT_BROWSER_CLOSE = True
else:
    SESSION_COOKIE_AGE = LLA_CONFIG.auth.session_cookie_lifetime.total_seconds()

# Internationalization
LANGUAGE_CODE = 'de-de'
LANGUAGES = [
    ('de', 'Deutsch'),
    ('en', 'English'),
]
TIME_ZONE = 'Europe/Berlin'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'static'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Strawberry configuration
STRAWBERRY_DJANGO = {
    'MAP_AUTO_ID_AS_GLOBAL_ID': True,
    'MUTATIONS_DEFAULT_HANDLE_ERRORS': True,
}

# Celery configuration
CELERY_TIMEZONE = TIME_ZONE
CELERY_ACCEPT_CONTENT = ('pickle',)
CELERY_TASK_SERIALIZER = 'pickle'
CELERY_RESULT_SERIALIZER = 'pickle'
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True
CELERY_BROKER_URL = LLA_CONFIG.redis.full_dsn.encoded_string()
CELERY_RESULT_BACKEND = LLA_CONFIG.redis.full_dsn.encoded_string()
CELERY_RESULT_BACKEND_TRANSPORT_OPTIONS = {
    'global_keyprefix': f'{LLA_CONFIG.redis.key_prefix or ""}cel_'
}
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# Email configuration
EMAIL_BACKEND = 'post_office.EmailBackend'
POST_OFFICE = {
    'CELERY_ENABLED': True,
}
EMAIL_HOST, EMAIL_PORT = LLA_CONFIG.email.get_host_and_port()
EMAIL_HOST_USER = LLA_CONFIG.email.username
EMAIL_HOST_PASSWORD = LLA_CONFIG.email.password
EMAIL_USE_TLS = LLA_CONFIG.email.security == 'explicit_tls'
EMAIL_USE_SSL = LLA_CONFIG.email.security == 'implicit_tls'
DEFAULT_FROM_EMAIL = LLA_CONFIG.email.source_email


PUSH_NOTIFICATIONS_SETTINGS = {
    'UNIQUE_REG_ID': True,
    'WP_PRIVATE_KEY': os.getenv(
        'DJANGO_WP_PRIVATE_KEY', str(BASE_DIR / 'push_private_key.pem')
    ),
    'WP_CLAIMS': {'sub': 'mailto:weiland@dezign.de'},
}

UNFOLD = {
    'SHOW_LANGUAGES': True,
    'SITE_URL': None,
    'SITE_TITLE': 'DSDLC App',
    'SITE_HEADER': 'DSDLC App',
    'STYLES': [lambda request: static('lebenslaeufe_app/admin/admin_custom.css')],
}

IMPORT_EXPORT_FORMATS = [XLSX, XLS, CSV, JSON]
