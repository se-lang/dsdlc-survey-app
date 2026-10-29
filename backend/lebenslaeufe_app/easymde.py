from typing import Any

from django.forms import Widget


class EasyMDEWidget(Widget):
    template_name = 'lebenslaeufe_app/forms/easymde.html'

    def __init__(self, attrs: dict[str, Any] | None = None) -> None:
        super().__init__(
            attrs={
                **(attrs or {}),
                'class': ' '.join(
                    [
                        'max-w-4xl',
                        attrs.get('class', '') if attrs else '',
                    ]
                ),
            }
        )

    class Media:
        css = {
            'all': (
                'lebenslaeufe_app/admin/easymde.min.css',
                'lebenslaeufe_app/admin/easymde-dark.css',
            )
        }
        js = ('lebenslaeufe_app/admin/easymde.min.js',)
