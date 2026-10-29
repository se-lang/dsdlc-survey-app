import datetime

import strawberry
import strawberry_django
from strawberry.relay import GlobalID

from lebenslaeufe_app.graphql_helpers import DjangoInfo, get_gql_uuid
from lla_paradata.models import ParadataEvent, paradata_event
from lla_paradata.registry import PARADATA_EVENT_REACHED_END_PAGE
from lla_questionnaire.graphql_types.form_control import QuestionnaireFormControlValue
from lla_zofar.graphql_types.questionnaire import ZfQuestionnaireGql
from lla_zofar.graphql_types.page import ZfPageType
from lla_zofar.models import ActiveZofarState, ZofarState
from lla_zofar.paradata import (
    ZOFAR_EPISODE_PARADATA,
    ZofarEpisodeEvent,
    ZofarEpisodeEventType,
)


@strawberry.input
class ZfFormSubmitItem:
    id: str
    value: QuestionnaireFormControlValue | None


@strawberry.input
class ZfFormSubmit:
    questionnaire_id: GlobalID
    version: int
    form_values: list[ZfFormSubmitItem]


@strawberry.input
class ZfSaveEpisodeInput:
    questionnaire_id: GlobalID
    existing_id: str | None = None
    version: int
    name: str
    type: str
    start: datetime.date | None
    end: datetime.date | None
    event: bool
    badge: str | None
    calendar_zoom: int | None  # For paradata


@strawberry.input
class ZfNavigateToEpisodeDetailsInput:
    questionnaire_id: GlobalID
    episode_id: str


@strawberry.input
class ZfRemoveEpisodeInput:
    questionnaire_id: GlobalID
    version: int
    id: str


@strawberry.input
class ZfHideGapInput:
    questionnaire_id: GlobalID
    version: int
    id: str


@strawberry.type
class SubmitMutations:
    @strawberry_django.mutation()
    @staticmethod
    def zofar_submit(info: DjangoInfo, data: ZfFormSubmit) -> ZfPageType:
        raw_data = {item.id: item.value for item in data.form_values}
        state: ActiveZofarState
        with ZofarState.objects.activate(
            request=info.context.request,
            person_questionnaire_id=get_gql_uuid(
                data.questionnaire_id, ZfQuestionnaireGql
            ),
        ) as state:
            new_page = state.submit(raw_data, expected_version=data.version)
            if new_page.is_final_page(state):
                paradata_event(
                    person_id=state.state.person_questionnaire.person_id,
                    questionnaire_id=state.state.person_questionnaire.questionnaire_id,
                    key=PARADATA_EVENT_REACHED_END_PAGE,
                )
            return ZfPageType(zofar_state=state, zf_page=new_page)

    @strawberry_django.mutation()
    @staticmethod
    def save_zofar_episode(
        info: DjangoInfo, data: ZfSaveEpisodeInput, continue_to_details: bool = False
    ) -> ZfPageType:
        with ZofarState.objects.activate(
            request=info.context.request,
            person_questionnaire_id=get_gql_uuid(
                data.questionnaire_id, ZfQuestionnaireGql
            ),
        ) as state:
            zofar_page, episode_id = state.save_episode(data)
            ParadataEvent.objects.create(
                person_id=state.state.person_questionnaire.person_id,
                active_questionnaire_id=state.state.person_questionnaire.questionnaire_id,
                key=ZOFAR_EPISODE_PARADATA,
                value=ZofarEpisodeEvent(
                    episode_id=episode_id,
                    type=ZofarEpisodeEventType.EDIT
                    if data.existing_id is not None
                    else ZofarEpisodeEventType.CREATE,
                    calendar_zoom=data.calendar_zoom,
                ).model_dump(mode='json'),
            )
            if continue_to_details:
                zofar_page = state.navigate_episode_details(episode_id)
            return ZfPageType(zofar_state=state, zf_page=zofar_page)

    @strawberry_django.mutation()
    @staticmethod
    def zofar_navigate_to_episode_details(
        info: DjangoInfo, data: ZfNavigateToEpisodeDetailsInput
    ) -> ZfPageType:
        with ZofarState.objects.activate(
            request=info.context.request,
            person_questionnaire_id=get_gql_uuid(
                data.questionnaire_id, ZfQuestionnaireGql
            ),
        ) as state:
            zofar_page = state.navigate_episode_details(data.episode_id)
            return ZfPageType(zofar_state=state, zf_page=zofar_page)

    @strawberry_django.mutation()
    @staticmethod
    def remove_zofar_episode(
        info: DjangoInfo, data: ZfRemoveEpisodeInput
    ) -> ZfPageType:
        with ZofarState.objects.activate(
            request=info.context.request,
            person_questionnaire_id=get_gql_uuid(
                data.questionnaire_id, ZfQuestionnaireGql
            ),
        ) as state:
            zofar_page = state.remove_episode(data)
        return ZfPageType(zofar_state=state, zf_page=zofar_page)

    @strawberry_django.mutation()
    @staticmethod
    def mark_zofar_gap_hidden(info: DjangoInfo, data: ZfHideGapInput) -> ZfPageType:
        with ZofarState.objects.activate(
            request=info.context.request,
            person_questionnaire_id=get_gql_uuid(
                data.questionnaire_id, ZfQuestionnaireGql
            ),
        ) as state:
            zofar_page = state.hide_gap(data)
        return ZfPageType(zofar_state=state, zf_page=zofar_page)

    @strawberry_django.mutation()
    @staticmethod
    def zofar_back(info: DjangoInfo, questionnaire_id: GlobalID) -> ZfPageType:
        with ZofarState.objects.activate(
            request=info.context.request,
            person_questionnaire_id=get_gql_uuid(questionnaire_id, ZfQuestionnaireGql),
        ) as state:
            zofar_page = state.navigate_back()
            return ZfPageType(zofar_state=state, zf_page=zofar_page)
