import strawberry
from django.utils.translation import gettext

from lla_questionnaire.graphql_types.element import QuestionnaireElement
from lla_questionnaire.graphql_types.form_control import QuestionnaireFormValue

from lla_questionnaire.graphql_types.page import (
    QuestionnairePageLayout,
    QuestionnairePage,
    QuestionnairePageLayoutFull,
    QuestionnairePageLayoutBoxed,
    QuestionnairePageButton,
    QuestionnairePageButtonType,
)
from lla_zofar.api_schema.episodes import ZfEpisodesBase
from lla_zofar.api_schema.response import ZfApiResponse
from lla_zofar.graphql_types.element import gql_id
from lla_zofar.graphql_types.episodes import ZfEpisodeEntryGql
from lla_zofar.graphql_types.type_map import zf_element_to_gql
from lla_zofar.models import ActiveZofarState
from lla_zofar.zofar_urls import zofar_url_path


@strawberry.type(name='ZfEpisodeBoxedLayout')
class ZfEpisodeBoxedLayoutGql(QuestionnairePageLayout):
    episode: ZfEpisodeEntryGql


@strawberry.type(name='ZfPage')
class ZfPageType(QuestionnairePage):
    zofar_state: strawberry.Private[ActiveZofarState]
    zf_page: strawberry.Private[ZfApiResponse]

    @strawberry.field()
    def id(self) -> str:
        return f'zf_page:{zofar_url_path(self.zofar_state.base_url, self.zf_page.post_data.target)}'

    @strawberry.field()
    def layout(self) -> QuestionnairePageLayout:
        if self.zf_page.content_structure.has_child_recursive(ZfEpisodesBase):
            return QuestionnairePageLayoutFull()
        app_info = self.zf_page.app_info
        if app_info is not None:
            episode_data = app_info.episode_data
            if episode_data is not None:
                return ZfEpisodeBoxedLayoutGql(
                    episode=ZfEpisodeEntryGql(raw_value=episode_data.content[0])
                )
        title_element = self.zf_page.content_structure.title_element
        if title_element:
            title = ''.join(title_element.content)
        else:
            title = ''
        return QuestionnairePageLayoutBoxed(title=title)

    @strawberry.field()
    def version(self) -> int:
        return self.zofar_state.state.version

    @strawberry.field()
    def children_ids(self) -> list[str]:
        return [gql_id(e) for e in self.zf_page.content_structure.graphql_elements()]

    @strawberry.field()
    def header_ids(self) -> list[str]:
        return [gql_id(e) for e in self.zf_page.content_structure.header]

    @strawberry.field()
    def all_elements(self) -> list[QuestionnaireElement]:
        return [
            mapped_element
            for element in self.zf_page.content_structure.graphql_references_recursive()
            if (mapped_element := zf_element_to_gql(element)) is not None
        ]

    @strawberry.field()
    def buttons(self) -> list[QuestionnairePageButton]:
        if self.zf_page.is_final_page(self.zofar_state):
            return [
                QuestionnairePageButton(
                    id=f'{gql_id(self.zf_page.content_structure)}_fake_final_btn',
                    label=gettext('Befragung abschließen'),
                    type=QuestionnairePageButtonType.FINISH,
                )
            ]
        else:
            return [
                QuestionnairePageButton(
                    id=f'{gql_id(self.zf_page.content_structure)}_btn_{button.type}',
                    label=button.label,
                    type=QuestionnairePageButtonType[button.type.name],
                )
                for button in self.zf_page.get_buttons()
                if button.type.name in QuestionnairePageButtonType.__members__
            ]

    @strawberry.field()
    def form_values(self) -> list[QuestionnaireFormValue]:
        return [
            QuestionnaireFormValue(form_control_id=form_control_id, value=form_value)
            for element in self.zf_page.content_structure.graphql_references_recursive()
            for form_control_id, form_value in element.graphql_form_values()
        ]
