import datetime
import logging
from typing import Annotated

from pydantic import BeforeValidator

_zofar_month_names = (
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
)


logger = logging.getLogger(__name__)


def serialize_month_date(date: datetime.date) -> str:
    return f'{_zofar_month_names[date.month - 1]} {date.year}'


def deserialize_month_date(value: str | None) -> datetime.date | None:
    if not value or value == 'null' or not isinstance(value, str):
        return None
    split = value.split(' ', maxsplit=1)
    if len(split) != 2:
        logger.warning('Could not parse month date, invalid split count. %s', value)
        return None
    try:
        month_index = _zofar_month_names.index(split[0])
        year = int(split[1])
        return datetime.date(year, month_index + 1, 1)
    except ValueError:
        logger.exception('Could not parse month date, %s', value)
        return None


ZfMonthDateFormat = Annotated[
    datetime.date | None, BeforeValidator(deserialize_month_date)
]
