from pathlib import PurePosixPath
from typing import Collection
from urllib.parse import urljoin, urlparse

from pydantic_core.core_schema import ValidationInfo

from lla_zofar.api_schema.context import ZofarValidationContext

ZOFAR_LOGIN_PATH = 'special/login.html'
ZOFAR_FINAL_PAGE_PATHS = ('end.html', 'lv_end.html')


def zofar_url(base: str, path: str) -> str:
    return urljoin(base, path)


def validate_zofar_url(url: str, info: ValidationInfo) -> str:
    base_url = ZofarValidationContext.get(info).zofar_state.base_url
    url = urljoin(base_url, url)
    if not is_zofar_url(base_url, url):
        raise ValueError(f'Invalid Zofar URL: {url}')
    return url


def zofar_url_path(base: str, url: str) -> str:
    parts = urlparse(url)
    parsed_base = urlparse(base)
    if parts.scheme != parsed_base.scheme or parts.netloc != parsed_base.netloc:
        raise ValueError(f'Invalid Zofar URL: {url}')
    try:
        relative = PurePosixPath(parts.path).relative_to(parsed_base.path)
        return str(relative)
    except ValueError as e:
        raise ValueError(f'Invalid Zofar URL: {url}') from e


def is_zofar_url(
    base: str, url: str, path: str | Collection[str] | None = None
) -> bool:
    try:
        relative = zofar_url_path(base, url)
        match path:
            case None:
                return True
            case str():
                return str(relative) == path
            case _:
                str_rel = str(relative)
                return str_rel in path
    except ValueError:
        return False


def is_zofar_login_url(base, url: str) -> bool:
    return is_zofar_url(base, url, ZOFAR_LOGIN_PATH)


def is_zofar_final_page_url(base, url: str) -> bool:
    return is_zofar_url(base, url, ZOFAR_FINAL_PAGE_PATHS)
