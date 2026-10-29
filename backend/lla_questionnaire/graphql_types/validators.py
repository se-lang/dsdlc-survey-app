import datetime
from decimal import Decimal

import strawberry


@strawberry.interface
class QnrQuestionValidator:
    error_message: str


@strawberry.type
class MinValueValidator(QnrQuestionValidator):
    min_value: Decimal


@strawberry.type
class MaxValueValidator(QnrQuestionValidator):
    max_value: Decimal


@strawberry.type
class MinDateValidator(QnrQuestionValidator):
    min_value: datetime.date


@strawberry.type
class MaxDateValidator(QnrQuestionValidator):
    max_value: datetime.date


@strawberry.type
class MaxTextLengthValidator(QnrQuestionValidator):
    max_length: int


@strawberry.type
class TextPatternValidator(QnrQuestionValidator):
    pattern: str
    flags: str = ''


@strawberry.type
class EmailValidator(QnrQuestionValidator):
    pass
