from modeltranslation.decorators import register
from modeltranslation.translator import TranslationOptions

from lla_translations.models import Translation


@register(Translation)
class QuestionnaireFileTranslationOptions(TranslationOptions):
    fields = ('value',)
