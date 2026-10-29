import dataclasses
import datetime
import logging
from enum import Enum
from typing import TYPE_CHECKING
from urllib.parse import urljoin

import requests
from pydantic import ValidationError
from requests import RequestException

from lla_zofar.api_schema.status import ZfTokenStatusResponse

if TYPE_CHECKING:
    from lla_zofar.models import ZofarPersonQuestionnaire


class QuestionnaireCompletionStatus(Enum):
    NEW = 'NEW'
    STARTED = 'STARTED'
    FINISHED = 'FINISHED'


@dataclasses.dataclass
class QuestionnaireState:
    completion_state: QuestionnaireCompletionStatus = QuestionnaireCompletionStatus.NEW
    first_visit: datetime.datetime | None = None
    last_visit: datetime.datetime | None = None


logger = logging.getLogger(__name__)


def get_zofar_questionnaire_state(pq: 'ZofarPersonQuestionnaire') -> QuestionnaireState:
    try:
        response = requests.get(
            urljoin(pq.questionnaire.zofar_url, 'special/status.html'),
            params={
                'zofar_token': pq.token,
                'zofar_fingerprint': pq.questionnaire.zofar_fingerprint,
            },
        )
        response.raise_for_status()
    except RequestException as e:
        logger.error(
            'Failed to fetch ZofarPersonQuestionnaire %s status',
            pq.id,
            e,
        )
        return QuestionnaireState()

    try:
        parsed_response = ZfTokenStatusResponse.model_validate_json(response.text)
    except ValidationError as e:
        logger.error(
            'Failed to fetch ZofarPersonQuestionnaire %s status',
            pq.id,
            e,
        )
        return QuestionnaireState()
    data = parsed_response.content_structure.response
    return QuestionnaireState(
        completion_state=QuestionnaireCompletionStatus(data.state.value),
        first_visit=data.first_visit,
        last_visit=data.last_visit,
    )
