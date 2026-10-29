from django.dispatch import Signal


init_questionnaire_elements = Signal()
questionnaire_elements_initialized = False
questionnaire_element_subclasses = set[type]()
"""
All subclasses of QuestionnaireElement. It will be populated fully after init_questionnaire_elements
has been sent, which signals any questionnaire system app to evaluate its subclasses.
"""


def send_init_questionnaire_elements_if_necessary():
    global questionnaire_elements_initialized

    if not questionnaire_elements_initialized:
        init_questionnaire_elements.send(None)
        questionnaire_elements_initialized = True
