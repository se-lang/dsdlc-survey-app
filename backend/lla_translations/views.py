from django.core.exceptions import BadRequest
from django.http import HttpRequest, HttpResponse
from django.middleware.gzip import re_accepts_gzip
from django.utils.translation import get_language
from django.views import View

from lla_translations.models import Translation


def _accepts_gzip(request: HttpRequest) -> bool:
    ae = request.META.get('HTTP_ACCEPT_ENCODING', '')
    return bool(re_accepts_gzip.search(ae))


class TranslationView(View):
    @staticmethod
    def get(request: HttpRequest, *args, **kwargs) -> HttpResponse:
        language = get_language()
        if not language:
            raise BadRequest('No language selected.')
        if _accepts_gzip(request):
            zipped = Translation.objects.get_all_gzipped_cached(language)
            return HttpResponse(
                content=zipped,
                content_type='application/json',
                headers={
                    'Content-Encoding': 'gzip',
                },
            )
        else:
            json_content = Translation.objects.get_all_json_cached(language)
            return HttpResponse(
                json_content,
                content_type='application/json',
            )
