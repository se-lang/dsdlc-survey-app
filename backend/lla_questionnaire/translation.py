from modeltranslation.decorators import register
from modeltranslation.translator import TranslationOptions

from lla_questionnaire.models import QuestionnaireFile


@register(QuestionnaireFile)
class QuestionnaireFileTranslationOptions(TranslationOptions):
    fields = ('title', 'description')
