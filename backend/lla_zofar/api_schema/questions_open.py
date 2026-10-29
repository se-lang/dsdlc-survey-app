import abc
import datetime
from abc import ABC
from decimal import Decimal
from functools import cached_property
from typing import Literal, Iterable, Any, Annotated

from pydantic import BaseModel, Field, Discriminator

from lla_zofar.api_schema.autofill import AutofillReference
from lla_zofar.api_schema.base import (
    ZfElement,
    ZfParentElement,
    required_child,
    ZfGqlVisibility,
)
from lla_zofar.api_schema.month_values import deserialize_month_date, ZfMonthDateFormat
from lla_zofar.api_schema.specials import ZfHtmlEntities
from lla_zofar.zofar_form_field_ref import ZofarFormFieldRefData, ZofarFormFieldRefType


class ZfOpenOptionValidationRules(BaseModel):
    length_max: int | None = Field(validation_alias='lengthMax', default=None)
    pattern: str | None = None


class ZfOpenOptionValidationRulesMinMax[T](ZfOpenOptionValidationRules):
    range_max: T | None = Field(validation_alias='rangeMax', default=None)
    range_min: T | None = Field(validation_alias='rangeMin', default=None)


class ZfOpenOptionValidationBase(BaseModel):
    type: Literal['text', 'number', 'grade', 'email', 'nonumber', 'month']
    message: str
    rules: ZfOpenOptionValidationRules = ZfOpenOptionValidationRules()


class ZfOpenOptionValidationMonth(ZfOpenOptionValidationBase):
    type: Literal['month']
    rules: ZfOpenOptionValidationRulesMinMax[datetime.datetime] = (
        ZfOpenOptionValidationRulesMinMax()
    )


class ZfOpenOptionValidationNumeric(ZfOpenOptionValidationBase):
    type: Literal['number', 'grade']
    rules: ZfOpenOptionValidationRulesMinMax[Decimal] = (
        ZfOpenOptionValidationRulesMinMax()
    )


class ZfOpenOptionValidationSimple(ZfOpenOptionValidationBase):
    type: Literal['text', 'email', 'nonumber']


ZfOpenOptionValidation = Annotated[
    ZfOpenOptionValidationMonth
    | ZfOpenOptionValidationNumeric
    | ZfOpenOptionValidationSimple,
    Discriminator(discriminator='type'),
]


class ZfOpenOption(ZfElement):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.answer.options.OpenOption'
    ]
    autofill: AutofillReference | None = None
    validation: ZfOpenOptionValidation | None = None
    placeholder: str | None = Field(validation_alias='infield', default=None)
    prefix: list[ZfHtmlEntities] | None = None
    postfix: list[ZfHtmlEntities] | None = None
    value: str | None = None
    view_date_: ZfMonthDateFormat = Field(validation_alias='viewDate', default=None)

    def form_field_references(self) -> Iterable[ZofarFormFieldRefData]:
        if self.validation is not None and self.validation.type == 'month':
            type_ = ZofarFormFieldRefType.OPEN_MONTH_YEAR
        else:
            type_ = ZofarFormFieldRefType.PLAIN

        return (
            ZofarFormFieldRefData(
                element_id=self.id,
                type=type_,
            ),
        )


class ZfOpenQuestionResponseDomain(ZfParentElement):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.answer.responseDomain.OpenResponseDomain'
    ]

    required_option = required_child(ZfOpenOption)

    def graphql_visibility(self) -> ZfGqlVisibility:
        return ZfGqlVisibility.HIDDEN

    @cached_property
    def open_option(self) -> ZfOpenOption:
        return next(iter(self.find_children(ZfOpenOption)))


class ZfOpenQuestionBase(ZfParentElement, ABC):
    @property
    @abc.abstractmethod
    def label(self) -> str: ...
    @property
    @abc.abstractmethod
    def prefix(self) -> str | None: ...
    @property
    @abc.abstractmethod
    def postfix(self) -> str | None: ...
    @property
    @abc.abstractmethod
    def placeholder(self) -> str | None: ...
    @property
    @abc.abstractmethod
    def validation(self) -> ZfOpenOptionValidation | None: ...
    @property
    @abc.abstractmethod
    def autofill(self) -> AutofillReference | None: ...
    @property
    @abc.abstractmethod
    def view_date(self) -> datetime.date | None: ...

    @property
    @abc.abstractmethod
    def form_control_id(self) -> str: ...


class ZfAttachedOpenQuestion(ZfOpenQuestionBase):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.answer.options.UIAttachedOpenQuestion',
    ]

    prefix_: list[ZfHtmlEntities] | None = Field(
        validation_alias='prefix', default=None
    )
    postfix_: list[ZfHtmlEntities] | None = Field(
        validation_alias='postfix', default=None
    )
    value: str | None = Field(default=None)
    placeholder_: str | None = Field(validation_alias='infield', default=None)
    validation_: ZfOpenOptionValidation | None = Field(alias='validation', default=None)
    view_date_: ZfMonthDateFormat = Field(validation_alias='viewDate', default=None)

    @property
    def validation(self):
        return self.validation_

    @property
    def label(self) -> str:
        return ''.join(self.prefix_) if self.prefix_ else ''

    @property
    def prefix(self) -> str | None:
        return None

    @property
    def postfix(self) -> str | None:
        return ''.join(self.postfix_) if self.postfix_ else ''

    @property
    def placeholder(self) -> str | None:
        return self.placeholder_

    @property
    def autofill(self) -> ZfOpenOptionValidation | None:
        return None

    @property
    def view_date(self) -> datetime.date | None:
        return self.view_date_

    @property
    def form_control_id(self) -> str:
        return self.id

    def graphql_form_values(self) -> Iterable[tuple[str, Any]]:
        if (validation := self.validation) is not None and validation.type == 'month':
            date_value = deserialize_month_date(self.value)
            value = date_value.isoformat() if date_value else None
        else:
            value = self.value
        yield self.form_control_id, value

    def form_field_references(self) -> Iterable[ZofarFormFieldRefData]:
        if self.validation is not None and self.validation.type == 'month':
            type_ = ZofarFormFieldRefType.OPEN_MONTH_YEAR
        else:
            type_ = ZofarFormFieldRefType.PLAIN

        return (
            ZofarFormFieldRefData(
                element_id=self.id,
                type=type_,
            ),
        )


class ZfOpenQuestionFromOpenOptionBase(ZfOpenQuestionBase, abc.ABC):
    @property
    @abc.abstractmethod
    def open_option(self) -> ZfOpenOption | None: ...

    @property
    def form_control_id(self) -> str:
        return self.open_option.id

    @property
    def prefix(self) -> str | None:
        return None

    @property
    def label(self) -> str:
        return (
            ''.join(open_option.prefix)
            if (open_option := self.open_option) is not None and open_option.prefix
            else ''
        )

    @property
    def postfix(self) -> str | None:
        return (
            ''.join(open_option.postfix)
            if (open_option := self.open_option) is not None and open_option.postfix
            else None
        )

    @property
    def placeholder(self) -> str | None:
        return (
            open_option.placeholder
            if (open_option := self.open_option) is not None
            else None
        )

    @property
    def validation(self) -> ZfOpenOptionValidation | None:
        return (
            open_option.validation
            if (open_option := self.open_option) is not None
            else None
        )

    @property
    def autofill(self) -> ZfOpenOptionValidation | None:
        return (
            open_option.autofill
            if (open_option := self.open_option) is not None
            else None
        )

    @property
    def view_date(self) -> datetime.date | None:
        return self.open_option.view_date_

    def graphql_form_values(self) -> Iterable[tuple[str, Any]]:
        if (validation := self.validation) is not None and validation.type == 'month':
            date_value = deserialize_month_date(self.open_option.value)
            value = date_value.isoformat() if date_value else None
        else:
            value = self.open_option.value
        yield self.form_control_id, value


class ZfOpenQuestion(ZfOpenQuestionFromOpenOptionBase):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.question.atomic.UIOpenQuestion',
    ]

    @cached_property
    def response_domain(self) -> ZfOpenQuestionResponseDomain | None:
        return next(iter(self.find_children(ZfOpenQuestionResponseDomain)), None)

    @property
    def open_option(self) -> ZfOpenOption | None:
        response_domain = self.response_domain
        return response_domain.open_option if response_domain is not None else None

    @cached_property
    def episode_details_option_id(self) -> str | None:
        match self:
            case ZfOpenQuestion(
                id='form:calendar:episodedetails',
                children=[
                    ZfOpenQuestionResponseDomain(
                        children=[
                            ZfOpenOption(
                                id=str() as option_id,
                            )
                        ]
                    )
                ],
            ):
                return option_id
            case _:
                return None

    @cached_property
    def app_account_id_question_id(self) -> str | None:
        match self:
            case ZfOpenQuestion(
                id=str() as question_id,
                children=[
                    ZfOpenQuestionResponseDomain(
                        children=[
                            ZfOpenOption(
                                id=str() as option_id,
                                post=True,
                            )
                        ]
                    )
                ],
            ) if question_id.endswith('appAccountID'):
                return option_id
            case _:
                return None

    def graphql_visibility(self) -> ZfGqlVisibility:
        if (
            self.episode_details_option_id is not None
            or self.app_account_id_question_id is not None
        ):
            return ZfGqlVisibility.HIDDEN
        else:
            return super().graphql_visibility()
