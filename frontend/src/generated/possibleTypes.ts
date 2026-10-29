/* eslint-disable */

export type PossibleTypesResultData = {
    possibleTypes: {
        ActivateZofarGuestSessionPayload: ['AnonymousUser', 'OperationInfo'];
        BaseUser: ['AnonymousUser', 'User'];
        LoginPayload: ['OperationInfo', 'User'];
        MarkZofarGapHiddenPayload: ['OperationInfo', 'ZfPage'];
        Node: [
            'AnonymousUser',
            'QuestionnaireFile',
            'QuestionnaireNews',
            'User',
            'WebPushDevice',
            'ZfAutocompleteList',
            'ZfAutocompleteListItem',
            'ZfQuestionnaire',
            'ZfQuestionnaireStatus',
            'ZofarToken',
        ];
        OperationInfoConfirmEmailSuccessResult: ['ConfirmEmailSuccessResult', 'OperationInfo'];
        QnrAutocompleteList: ['ZfAutocompleteList'];
        QnrAutocompleteListItem: ['ZfAutocompleteListItem'];
        QnrChoiceMatrixQuestionCategoryElement: [
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ];
        QnrChoiceMatrixQuestionElement: [
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfSingleChoiceMatrixQuestionElement',
        ];
        QnrChoiceOptionElement: ['ZfMultipleChoiceOptionElement', 'ZfSingleChoiceOptionElement'];
        QnrChoiceQuestionElement: [
            'ZfMultipleChoiceQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ];
        QnrContainerElement: ['ZfContainerElement'];
        QnrDifferentialQuestionElement: ['ZfDifferentialQuestionElement'];
        QnrDifferentialQuestionPartElement: ['ZfDifferentialQuestionPartElement'];
        QnrDoubleMatrixQuestionCategoryElement: ['ZfDoubleMatrixQuestionCategoryElement'];
        QnrDoubleMatrixQuestionElement: ['ZfDoubleMatrixQuestionElement'];
        QnrDoubleMatrixQuestionPartElement: ['ZfDoubleMatrixQuestionPartElement'];
        QnrFormControlElement: [
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfMultipleChoiceOptionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceQuestionElement',
        ];
        QnrHasElementChildren: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfPage',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ];
        QnrHtmlSectionElement: ['ZfHtmlSectionElement'];
        QnrLabeledElement: [
            'ZfMultipleChoiceOptionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceOptionElement',
        ];
        QnrMatrixQuestionBaseElement: [
            'ZfDoubleMatrixQuestionElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfOpenMatrixQuestionElement',
            'ZfSingleChoiceMatrixQuestionElement',
        ];
        QnrMatrixQuestionCategoryElement: [
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ];
        QnrMultipleChoiceMatrixQuestionCategoryElement: [
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
        ];
        QnrMultipleChoiceMatrixQuestionElement: ['ZfMultipleChoiceMatrixQuestionElement'];
        QnrMultipleChoiceOptionElement: ['ZfMultipleChoiceOptionElement'];
        QnrMultipleChoiceQuestionElement: ['ZfMultipleChoiceQuestionElement'];
        QnrOpenMatrixQuestionCategoryElement: ['ZfOpenMatrixQuestionCategoryElement'];
        QnrOpenMatrixQuestionElement: ['ZfOpenMatrixQuestionElement'];
        QnrOpenQuestionElement: ['ZfOpenQuestionElement'];
        QnrParentElement: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ];
        QnrPlainTextSectionElement: ['ZfUnknownElement', 'ZfUnmappedElement'];
        QnrQuestionValidator: [
            'EmailValidator',
            'MaxDateValidator',
            'MaxTextLengthValidator',
            'MaxValueValidator',
            'MinDateValidator',
            'MinValueValidator',
            'TextPatternValidator',
        ];
        QnrSingleChoiceMatrixQuestionCategoryElement: [
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ];
        QnrSingleChoiceMatrixQuestionElement: ['ZfSingleChoiceMatrixQuestionElement'];
        QnrSingleChoiceOptionElement: ['ZfSingleChoiceOptionElement'];
        QnrSingleChoiceQuestionElement: ['ZfSingleChoiceQuestionElement'];
        Questionnaire: ['ZfQuestionnaire'];
        QuestionnaireElement: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfEpisodesCalendarElement',
            'ZfEpisodesTableElement',
            'ZfHtmlSectionElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceOptionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceOptionElement',
            'ZfSingleChoiceQuestionElement',
            'ZfUnknownElement',
            'ZfUnmappedElement',
        ];
        QuestionnairePage: ['ZfPage'];
        QuestionnairePageLayout: [
            'QuestionnairePageLayoutBoxed',
            'QuestionnairePageLayoutFull',
            'ZfEpisodeBoxedLayout',
        ];
        QuestionnaireStatus: ['ZfQuestionnaireStatus'];
        RemoveZofarEpisodePayload: ['OperationInfo', 'ZfPage'];
        SaveZofarEpisodePayload: ['OperationInfo', 'ZfPage'];
        SetQuestionnaireNewsSeenPayload: ['OperationInfo', 'QuestionnaireNews'];
        UpdateUserPayload: ['OperationInfo', 'User'];
        UpdateZofarTokenPayload: ['OperationInfo', 'ZofarToken'];
        ZfChoiceMatrixQuestionCategoryElement: [
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ];
        ZfChoiceOptionBaseElement: ['ZfMultipleChoiceOptionElement', 'ZfSingleChoiceOptionElement'];
        ZfElement: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfEpisodesCalendarElement',
            'ZfEpisodesTableElement',
            'ZfHtmlSectionElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceOptionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceOptionElement',
            'ZfSingleChoiceQuestionElement',
            'ZfUnknownElement',
            'ZfUnmappedElement',
        ];
        ZfEpisodesBase: ['ZfEpisodesCalendarElement', 'ZfEpisodesTableElement'];
        ZfFormControlElement: [
            'ZfMultipleChoiceOptionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ];
        ZfMatrixQuestionCategoryElement: [
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ];
        ZfParentElement: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ];
        ZfSingleChoiceQuestionBaseElement: ['ZfSingleChoiceQuestionElement'];
        ZofarBackPayload: ['OperationInfo', 'ZfPage'];
        ZofarNavigateToEpisodeDetailsPayload: ['OperationInfo', 'ZfPage'];
        ZofarSubmitPayload: ['OperationInfo', 'ZfPage'];
    };
};
const result: PossibleTypesResultData = {
    possibleTypes: {
        ActivateZofarGuestSessionPayload: ['AnonymousUser', 'OperationInfo'],
        BaseUser: ['AnonymousUser', 'User'],
        LoginPayload: ['OperationInfo', 'User'],
        MarkZofarGapHiddenPayload: ['OperationInfo', 'ZfPage'],
        Node: [
            'AnonymousUser',
            'QuestionnaireFile',
            'QuestionnaireNews',
            'User',
            'WebPushDevice',
            'ZfAutocompleteList',
            'ZfAutocompleteListItem',
            'ZfQuestionnaire',
            'ZfQuestionnaireStatus',
            'ZofarToken',
        ],
        OperationInfoConfirmEmailSuccessResult: ['ConfirmEmailSuccessResult', 'OperationInfo'],
        QnrAutocompleteList: ['ZfAutocompleteList'],
        QnrAutocompleteListItem: ['ZfAutocompleteListItem'],
        QnrChoiceMatrixQuestionCategoryElement: [
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ],
        QnrChoiceMatrixQuestionElement: [
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfSingleChoiceMatrixQuestionElement',
        ],
        QnrChoiceOptionElement: ['ZfMultipleChoiceOptionElement', 'ZfSingleChoiceOptionElement'],
        QnrChoiceQuestionElement: [
            'ZfMultipleChoiceQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ],
        QnrContainerElement: ['ZfContainerElement'],
        QnrDifferentialQuestionElement: ['ZfDifferentialQuestionElement'],
        QnrDifferentialQuestionPartElement: ['ZfDifferentialQuestionPartElement'],
        QnrDoubleMatrixQuestionCategoryElement: ['ZfDoubleMatrixQuestionCategoryElement'],
        QnrDoubleMatrixQuestionElement: ['ZfDoubleMatrixQuestionElement'],
        QnrDoubleMatrixQuestionPartElement: ['ZfDoubleMatrixQuestionPartElement'],
        QnrFormControlElement: [
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfMultipleChoiceOptionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceQuestionElement',
        ],
        QnrHasElementChildren: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfPage',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ],
        QnrHtmlSectionElement: ['ZfHtmlSectionElement'],
        QnrLabeledElement: [
            'ZfMultipleChoiceOptionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceOptionElement',
        ],
        QnrMatrixQuestionBaseElement: [
            'ZfDoubleMatrixQuestionElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfOpenMatrixQuestionElement',
            'ZfSingleChoiceMatrixQuestionElement',
        ],
        QnrMatrixQuestionCategoryElement: [
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ],
        QnrMultipleChoiceMatrixQuestionCategoryElement: [
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
        ],
        QnrMultipleChoiceMatrixQuestionElement: ['ZfMultipleChoiceMatrixQuestionElement'],
        QnrMultipleChoiceOptionElement: ['ZfMultipleChoiceOptionElement'],
        QnrMultipleChoiceQuestionElement: ['ZfMultipleChoiceQuestionElement'],
        QnrOpenMatrixQuestionCategoryElement: ['ZfOpenMatrixQuestionCategoryElement'],
        QnrOpenMatrixQuestionElement: ['ZfOpenMatrixQuestionElement'],
        QnrOpenQuestionElement: ['ZfOpenQuestionElement'],
        QnrParentElement: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ],
        QnrPlainTextSectionElement: ['ZfUnknownElement', 'ZfUnmappedElement'],
        QnrQuestionValidator: [
            'EmailValidator',
            'MaxDateValidator',
            'MaxTextLengthValidator',
            'MaxValueValidator',
            'MinDateValidator',
            'MinValueValidator',
            'TextPatternValidator',
        ],
        QnrSingleChoiceMatrixQuestionCategoryElement: [
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ],
        QnrSingleChoiceMatrixQuestionElement: ['ZfSingleChoiceMatrixQuestionElement'],
        QnrSingleChoiceOptionElement: ['ZfSingleChoiceOptionElement'],
        QnrSingleChoiceQuestionElement: ['ZfSingleChoiceQuestionElement'],
        Questionnaire: ['ZfQuestionnaire'],
        QuestionnaireElement: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfEpisodesCalendarElement',
            'ZfEpisodesTableElement',
            'ZfHtmlSectionElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceOptionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceOptionElement',
            'ZfSingleChoiceQuestionElement',
            'ZfUnknownElement',
            'ZfUnmappedElement',
        ],
        QuestionnairePage: ['ZfPage'],
        QuestionnairePageLayout: [
            'QuestionnairePageLayoutBoxed',
            'QuestionnairePageLayoutFull',
            'ZfEpisodeBoxedLayout',
        ],
        QuestionnaireStatus: ['ZfQuestionnaireStatus'],
        RemoveZofarEpisodePayload: ['OperationInfo', 'ZfPage'],
        SaveZofarEpisodePayload: ['OperationInfo', 'ZfPage'],
        SetQuestionnaireNewsSeenPayload: ['OperationInfo', 'QuestionnaireNews'],
        UpdateUserPayload: ['OperationInfo', 'User'],
        UpdateZofarTokenPayload: ['OperationInfo', 'ZofarToken'],
        ZfChoiceMatrixQuestionCategoryElement: [
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ],
        ZfChoiceOptionBaseElement: ['ZfMultipleChoiceOptionElement', 'ZfSingleChoiceOptionElement'],
        ZfElement: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfEpisodesCalendarElement',
            'ZfEpisodesTableElement',
            'ZfHtmlSectionElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceOptionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceOptionElement',
            'ZfSingleChoiceQuestionElement',
            'ZfUnknownElement',
            'ZfUnmappedElement',
        ],
        ZfEpisodesBase: ['ZfEpisodesCalendarElement', 'ZfEpisodesTableElement'],
        ZfFormControlElement: [
            'ZfMultipleChoiceOptionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ],
        ZfMatrixQuestionCategoryElement: [
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
        ],
        ZfParentElement: [
            'ZfContainerElement',
            'ZfDifferentialQuestionElement',
            'ZfDifferentialQuestionPartElement',
            'ZfDoubleMatrixQuestionCategoryElement',
            'ZfDoubleMatrixQuestionElement',
            'ZfDoubleMatrixQuestionPartElement',
            'ZfMultipleChoiceMatrixQuestionCategoryElement',
            'ZfMultipleChoiceMatrixQuestionElement',
            'ZfMultipleChoiceQuestionElement',
            'ZfOpenMatrixQuestionCategoryElement',
            'ZfOpenMatrixQuestionElement',
            'ZfOpenQuestionElement',
            'ZfSingleChoiceMatrixQuestionCategoryElement',
            'ZfSingleChoiceMatrixQuestionElement',
            'ZfSingleChoiceQuestionElement',
        ],
        ZfSingleChoiceQuestionBaseElement: ['ZfSingleChoiceQuestionElement'],
        ZofarBackPayload: ['OperationInfo', 'ZfPage'],
        ZofarNavigateToEpisodeDetailsPayload: ['OperationInfo', 'ZfPage'],
        ZofarSubmitPayload: ['OperationInfo', 'ZfPage'],
    },
};
export default result;
