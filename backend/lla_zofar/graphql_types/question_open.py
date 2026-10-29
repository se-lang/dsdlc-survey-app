import datetime
from typing import cast

import strawberry
import strawberry_django
from django.utils.translation import gettext
from strawberry_django.optimizer import optimize

from lebenslaeufe_app.graphql_helpers import DjangoInfo
from lla_questionnaire.graphql_types.question_open import (
    QnrAutocompleteListItem,
    QnrAutocompleteList,
    QnrOpenQuestionElement,
    QnrOpenQuestionInputType,
)
from lla_questionnaire.graphql_types.validators import (
    QnrQuestionValidator,
    MaxValueValidator,
    MinValueValidator,
    TextPatternValidator,
    MaxTextLengthValidator,
    EmailValidator,
    MaxDateValidator,
    MinDateValidator,
)
from lla_zofar.api_schema.questions_open import ZfOpenQuestionBase
from lla_zofar.graphql_types.base import ZfParentElementGql
from lla_zofar.graphql_types.form_control import ZfFormControlGql
from lla_zofar.models import (
    ZofarAutofillListItem,
    ZofarAutofillList,
    ZofarAutofillListQuerySet,
)


@strawberry_django.type(ZofarAutofillListItem, name='ZfAutocompleteListItem')
class ZfAutocompleteListItemGql(QnrAutocompleteListItem):
    label: str
    value: str


@strawberry_django.type(ZofarAutofillList, name='ZfAutocompleteList')
class ZfAutocompleteListGql(QnrAutocompleteList):
    items: list[ZfAutocompleteListItemGql]


@strawberry.type(name='ZfOpenQuestionElement')
class ZfOpenQuestionGql(
    ZfFormControlGql[ZfOpenQuestionBase],
    ZfParentElementGql[ZfOpenQuestionBase],
    QnrOpenQuestionElement,
):
    @strawberry.field()
    def form_control_id(self) -> str:
        return self.zf_element.form_control_id

    @strawberry.field()
    def placeholder(self) -> str | None:
        return self.zf_element.placeholder

    @strawberry.field()
    def label(self) -> str:
        return self.zf_element.label

    @strawberry.field()
    def prefix(self) -> str | None:
        return None

    @strawberry.field()
    def postfix(self) -> str | None:
        return self.zf_element.postfix

    @strawberry.field()
    def initial_date(self) -> datetime.date | None:
        return self.zf_element.view_date

    @strawberry.field()
    def input_type(self) -> QnrOpenQuestionInputType:
        validation = self.zf_element.validation
        if validation is None:
            return QnrOpenQuestionInputType.TEXT
        match validation.type:
            case 'text' | 'nonumber':
                return QnrOpenQuestionInputType.TEXT
            case 'number':
                return QnrOpenQuestionInputType.DECIMAL
            case 'grade':
                return QnrOpenQuestionInputType.INTEGER
            case 'email':
                return QnrOpenQuestionInputType.EMAIL
            case 'month':
                return QnrOpenQuestionInputType.YEAR_MONTH
            case _:
                return QnrOpenQuestionInputType.TEXT

    @strawberry.field()
    def validators(self) -> list[QnrQuestionValidator]:
        validation = self.zf_element.validation
        if validation is None:
            return []
        validators: list[QnrQuestionValidator] = []

        match validation.type:
            case 'number' | 'grade':
                if validation.rules.range_max is not None:
                    validators.append(
                        MaxValueValidator(
                            error_message=validation.message,
                            max_value=validation.rules.range_max,
                        )
                    )
                if validation.rules.range_min is not None:
                    validators.append(
                        MinValueValidator(
                            error_message=validation.message,
                            min_value=validation.rules.range_min,
                        )
                    )
            case 'month':
                if validation.rules.range_max is not None:
                    validators.append(
                        MaxDateValidator(
                            error_message=validation.message,
                            max_value=validation.rules.range_max.date(),
                        )
                    )
                if validation.rules.range_min is not None:
                    validators.append(
                        MinDateValidator(
                            error_message=validation.message,
                            min_value=validation.rules.range_min.date(),
                        )
                    )
            case 'nonumber':
                validators.append(
                    TextPatternValidator(
                        error_message=gettext(
                            'Bitte geben Sie ausschließlich Buchstaben ein.'
                        ),
                        pattern='^\\p{L}+$',
                        flags='u',
                    )
                )

        if validation.rules.length_max is not None:
            validators.append(
                MaxTextLengthValidator(
                    error_message=validation.message,
                    max_length=validation.rules.length_max,
                )
            )
        if validation.rules.pattern is not None:
            pattern = validation.rules.pattern
            if not pattern.startswith('^'):
                pattern = '^' + pattern
            if not pattern.endswith('$'):
                pattern = pattern + '$'
            validators.append(
                TextPatternValidator(error_message=validation.message, pattern=pattern)
            )

        if validation.type == 'email':
            validators.append(
                EmailValidator(
                    error_message=gettext(
                        'Bitte geben Sie eine gültige E-Mail Adresse ein.'
                    )
                )
            )

        return validators

    @strawberry.field()
    def autocomplete(self, info: DjangoInfo) -> ZfAutocompleteListGql | None:
        autofill = self.zf_element.autofill
        if autofill is None:
            return None

        result = cast(
            ZofarAutofillListQuerySet, optimize(ZofarAutofillList.objects.all(), info)
        ).get_from_reference(autofill)
        return result
