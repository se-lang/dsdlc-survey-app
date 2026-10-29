import abc
from enum import Enum
from functools import cached_property
from typing import Literal, Any
from uuid import UUID, uuid5
from django.utils.html import strip_tags

from pydantic import model_validator, model_serializer
from pydantic_core.core_schema import ValidationInfo

from lla_zofar.api_schema.base import ZfElement
from lla_zofar.api_schema.specials import (
    ZfDoubleEncodedHtml,
    ZfDoubleEncodedHtmlToPlaintext,
)

ZfTextElementType = Literal[
    'de.his.zofar.presentation.surveyengine.ui.components.text.UICommonText',
    'de.his.zofar.presentation.surveyengine.ui.components.text.UIParagraphText',
    'de.his.zofar.presentation.surveyengine.ui.components.text.UIIntroductionText',
    'de.his.zofar.presentation.surveyengine.ui.components.text.UIInstructionText',
    'de.his.zofar.presentation.surveyengine.ui.components.text.UIResponseOptionText',
    'de.his.zofar.presentation.surveyengine.ui.components.text.UIQuestionText',
    'de.his.zofar.presentation.surveyengine.ui.components.display.UIDisplayText',
]


ZF_PLAIN_TEXT_ID_NS = UUID('dc37b67d-47da-4486-a4bc-3c30bcb9c3ca')


class ZfTextElementKind(Enum):
    GENERIC = 'generic'
    GENERIC_NO_SPACE = 'generic_no_space'
    QUESTION = 'question'
    INTRODUCTION = 'introduction'


class ZfTextElementBase(ZfElement, abc.ABC):
    @property
    @abc.abstractmethod
    def plain_text(self) -> str: ...
    @property
    @abc.abstractmethod
    def kind(self) -> ZfTextElementKind: ...


class ZfTextElementStandalone(ZfTextElementBase):
    """
    Zofar includes plain strings sometimes, we deserialize them into instances of this class.
    """

    type: Literal['__fake__plain_text__'] = '__fake__plain_text__'
    content: ZfDoubleEncodedHtml

    @model_validator(mode='before')
    @classmethod
    def transform_to_model(cls, data: Any, info: ValidationInfo) -> Any:
        if isinstance(data, str):
            value = f'{info.field_name or "_"}__{data}'
            return {'id': str(uuid5(ZF_PLAIN_TEXT_ID_NS, value)), 'content': data}
        else:
            return data

    @model_serializer
    def serialize(self) -> str:
        return self.content

    @property
    def plain_text(self) -> str:
        return strip_tags(self.content)

    @property
    def kind(self) -> ZfTextElementKind:
        return ZfTextElementKind.GENERIC


class ZfTextElement(ZfTextElementBase):
    type: ZfTextElementType
    content: list[ZfDoubleEncodedHtml]

    @cached_property
    def kind(self) -> ZfTextElementKind:
        match self.type:
            case 'de.his.zofar.presentation.surveyengine.ui.components.text.UIQuestionText':
                return ZfTextElementKind.QUESTION
            case 'de.his.zofar.presentation.surveyengine.ui.components.text.UIIntroductionText':
                return ZfTextElementKind.INTRODUCTION
            case (
                'de.his.zofar.presentation.surveyengine.ui.components.text.UICommonText'
            ):
                return ZfTextElementKind.GENERIC_NO_SPACE
            case _:
                return ZfTextElementKind.GENERIC

    @cached_property
    def plain_text(self) -> str:
        return ''.join(strip_tags(v) for v in self.content)


class ZfTitleTextElement(ZfElement):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.text.UITitleText'
    ]
    content: list[ZfDoubleEncodedHtmlToPlaintext]


def discriminate_plain_text(data: Any) -> Literal['plain_text', 'other']:
    if isinstance(data, str):
        return 'plain_text'
    else:
        return 'other'
