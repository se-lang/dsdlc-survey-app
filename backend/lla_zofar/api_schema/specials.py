import datetime
import html
from typing import Annotated, Any

import lxml.html.html5parser
from lxml import etree
from pydantic import BeforeValidator, TypeAdapter, AwareDatetime, PlainSerializer

zofar_html_parser = lxml.html.html5parser.HTMLParser(namespaceHTMLElements=False)


ZfSpecialNullToNone = Annotated[
    str | None, BeforeValidator(lambda v: None if v == 'NULL' else v)
]


def _transform_special_null(v: Any) -> None:
    if v is None or v == 'NULL':
        return None
    else:
        raise ValueError('NULL expected.')


ZfSpecialNull = Annotated[None, BeforeValidator(_transform_special_null)]

ZfHtmlEntities = Annotated[
    str, BeforeValidator(lambda v: html.unescape(v) if isinstance(v, str) else v)
]


_datetime_type_adapter: TypeAdapter[datetime.datetime] = TypeAdapter(AwareDatetime)


_episode_date_fake_time = datetime.time(1, 0, 0, 0)


def _parse_episode_date(value: Any):
    if isinstance(value, datetime.date):
        return value
    parsed_datetime = _datetime_type_adapter.validate_python(value).astimezone(
        datetime.timezone.utc
    )
    # TODO: Turn this check back on
    # if parsed_datetime.time() != _episode_date_fake_time:
    #     raise ValueError('Expected episode datetime in UTC to be 1am')
    return parsed_datetime.date()


def _serialize_episode_date(value: datetime.date) -> str:
    d = datetime.datetime.combine(
        value,
        _episode_date_fake_time,
    )
    # Zofar requires this strict format, not a normal ISO timestamp
    return d.strftime('%Y-%m-%dT%H:%M:%S.000Z')


ZfEpisodeDate = Annotated[
    Annotated[datetime.date, PlainSerializer(_serialize_episode_date)],
    BeforeValidator(_parse_episode_date),
]
"""
A date used in episode data.
"""


def _validate_double_html(value: Any) -> Any:
    if not isinstance(value, str):
        return value
    html_text = html.unescape(value)
    fragments = lxml.html.html5parser.fragments_fromstring(
        html_text, parser=zofar_html_parser
    )
    return ''.join(
        f if isinstance(f, str) else lxml.html.tostring(f, encoding='unicode')
        for f in fragments
    )


ZfDoubleEncodedHtml = Annotated[str, BeforeValidator(_validate_double_html)]
"""
A special kind of string that contains HTML-encoded HTML,
e.g. ``&lt;p&gt;Lorem Ipsum&lt;/p&gt;``.

It will be deserialized into properly formatted HTML.
"""


def _validate_html_to_plaintext(value: Any) -> Any:
    if not isinstance(value, str):
        return value
    html_text = html.unescape(value)
    fragments = lxml.html.html5parser.fragments_fromstring(
        html_text, parser=zofar_html_parser
    )
    return ''.join(
        f if isinstance(f, str) else etree.tostring(f, encoding=str, method='text')
        for f in fragments
    )


ZfDoubleEncodedHtmlToPlaintext = Annotated[
    str, BeforeValidator(_validate_html_to_plaintext)
]
"""
Like ``ZfDoubleEncodedHtml``, but will turn the HTML into plain text.
"""
