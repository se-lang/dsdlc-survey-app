import dataclasses

from django.db import models


class ZofarFormFieldRefType(models.TextChoices):
    # Take value as-is from frontend
    PLAIN = 'PLAIN'

    # Transform boolean value from frontend into fixed value that Zofar expects
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'

    # Transform ISO date from frontend into Zofar year month format
    OPEN_MONTH_YEAR = 'OPEN_MONTH_YEAR'


@dataclasses.dataclass
class ZofarFormFieldRefData:
    """
    A form field that we discovered from the Zofar questionnaire page.
    They are extracted from the page using ``ZfElement.form_field_references_recursive``
    and stored with the ``ZofarState``. When the frontend submits its form data for the page,
    they can then be used to transform the form data into the format that Zofar expects.
    """

    element_id: str
    type: ZofarFormFieldRefType
    multiple_choice_value: str = ''
