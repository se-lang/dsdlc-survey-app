/* eslint-disable */
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type AnonymousUserKeySpecifier = (
    | 'guestHasAccount'
    | 'hasGuestSession'
    | 'id'
    | 'isAuthenticated'
    | AnonymousUserKeySpecifier
)[];
export type AnonymousUserFieldPolicy = {
    guestHasAccount?: FieldPolicy<any> | FieldReadFunction<any>;
    hasGuestSession?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    isAuthenticated?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type BaseUserKeySpecifier = ('id' | 'isAuthenticated' | BaseUserKeySpecifier)[];
export type BaseUserFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    isAuthenticated?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ConfirmEmailSuccessResultKeySpecifier = (
    | 'activated'
    | ConfirmEmailSuccessResultKeySpecifier
)[];
export type ConfirmEmailSuccessResultFieldPolicy = {
    activated?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type EmailValidatorKeySpecifier = ('errorMessage' | EmailValidatorKeySpecifier)[];
export type EmailValidatorFieldPolicy = {
    errorMessage?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type FileKeySpecifier = ('name' | 'url' | FileKeySpecifier)[];
export type FileFieldPolicy = {
    name?: FieldPolicy<any> | FieldReadFunction<any>;
    url?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MaxDateValidatorKeySpecifier = (
    | 'errorMessage'
    | 'maxValue'
    | MaxDateValidatorKeySpecifier
)[];
export type MaxDateValidatorFieldPolicy = {
    errorMessage?: FieldPolicy<any> | FieldReadFunction<any>;
    maxValue?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MaxTextLengthValidatorKeySpecifier = (
    | 'errorMessage'
    | 'maxLength'
    | MaxTextLengthValidatorKeySpecifier
)[];
export type MaxTextLengthValidatorFieldPolicy = {
    errorMessage?: FieldPolicy<any> | FieldReadFunction<any>;
    maxLength?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MaxValueValidatorKeySpecifier = (
    | 'errorMessage'
    | 'maxValue'
    | MaxValueValidatorKeySpecifier
)[];
export type MaxValueValidatorFieldPolicy = {
    errorMessage?: FieldPolicy<any> | FieldReadFunction<any>;
    maxValue?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MinDateValidatorKeySpecifier = (
    | 'errorMessage'
    | 'minValue'
    | MinDateValidatorKeySpecifier
)[];
export type MinDateValidatorFieldPolicy = {
    errorMessage?: FieldPolicy<any> | FieldReadFunction<any>;
    minValue?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MinValueValidatorKeySpecifier = (
    | 'errorMessage'
    | 'minValue'
    | MinValueValidatorKeySpecifier
)[];
export type MinValueValidatorFieldPolicy = {
    errorMessage?: FieldPolicy<any> | FieldReadFunction<any>;
    minValue?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MutationKeySpecifier = (
    | 'activateZofarGuestSession'
    | 'addParadata'
    | 'confirmEmail'
    | 'forgotPassword'
    | 'login'
    | 'logout'
    | 'markZofarGapHidden'
    | 'refreshQuestionnaireStatus'
    | 'registerWebPush'
    | 'removeZofarEpisode'
    | 'resendAccountActivation'
    | 'resetPassword'
    | 'saveZofarEpisode'
    | 'setQuestionnaireNewsSeen'
    | 'triggerUserEmailChange'
    | 'unregisterWebPush'
    | 'updateUser'
    | 'updateUserEmail'
    | 'updateZofarToken'
    | 'zofarBack'
    | 'zofarNavigateToEpisodeDetails'
    | 'zofarRegister'
    | 'zofarSubmit'
    | MutationKeySpecifier
)[];
export type MutationFieldPolicy = {
    activateZofarGuestSession?: FieldPolicy<any> | FieldReadFunction<any>;
    addParadata?: FieldPolicy<any> | FieldReadFunction<any>;
    confirmEmail?: FieldPolicy<any> | FieldReadFunction<any>;
    forgotPassword?: FieldPolicy<any> | FieldReadFunction<any>;
    login?: FieldPolicy<any> | FieldReadFunction<any>;
    logout?: FieldPolicy<any> | FieldReadFunction<any>;
    markZofarGapHidden?: FieldPolicy<any> | FieldReadFunction<any>;
    refreshQuestionnaireStatus?: FieldPolicy<any> | FieldReadFunction<any>;
    registerWebPush?: FieldPolicy<any> | FieldReadFunction<any>;
    removeZofarEpisode?: FieldPolicy<any> | FieldReadFunction<any>;
    resendAccountActivation?: FieldPolicy<any> | FieldReadFunction<any>;
    resetPassword?: FieldPolicy<any> | FieldReadFunction<any>;
    saveZofarEpisode?: FieldPolicy<any> | FieldReadFunction<any>;
    setQuestionnaireNewsSeen?: FieldPolicy<any> | FieldReadFunction<any>;
    triggerUserEmailChange?: FieldPolicy<any> | FieldReadFunction<any>;
    unregisterWebPush?: FieldPolicy<any> | FieldReadFunction<any>;
    updateUser?: FieldPolicy<any> | FieldReadFunction<any>;
    updateUserEmail?: FieldPolicy<any> | FieldReadFunction<any>;
    updateZofarToken?: FieldPolicy<any> | FieldReadFunction<any>;
    zofarBack?: FieldPolicy<any> | FieldReadFunction<any>;
    zofarNavigateToEpisodeDetails?: FieldPolicy<any> | FieldReadFunction<any>;
    zofarRegister?: FieldPolicy<any> | FieldReadFunction<any>;
    zofarSubmit?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type NodeKeySpecifier = ('id' | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OffsetPaginationInfoKeySpecifier = (
    | 'limit'
    | 'offset'
    | OffsetPaginationInfoKeySpecifier
)[];
export type OffsetPaginationInfoFieldPolicy = {
    limit?: FieldPolicy<any> | FieldReadFunction<any>;
    offset?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OperationInfoKeySpecifier = ('messages' | OperationInfoKeySpecifier)[];
export type OperationInfoFieldPolicy = {
    messages?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type OperationMessageKeySpecifier = (
    | 'code'
    | 'field'
    | 'kind'
    | 'message'
    | OperationMessageKeySpecifier
)[];
export type OperationMessageFieldPolicy = {
    code?: FieldPolicy<any> | FieldReadFunction<any>;
    field?: FieldPolicy<any> | FieldReadFunction<any>;
    kind?: FieldPolicy<any> | FieldReadFunction<any>;
    message?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrAutocompleteListKeySpecifier = ('id' | 'items' | QnrAutocompleteListKeySpecifier)[];
export type QnrAutocompleteListFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    items?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrAutocompleteListItemKeySpecifier = (
    | 'id'
    | 'label'
    | 'value'
    | QnrAutocompleteListItemKeySpecifier
)[];
export type QnrAutocompleteListItemFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    value?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrChoiceMatrixQuestionCategoryElementKeySpecifier = (
    | 'childrenIds'
    | 'customLabelElementId'
    | 'id'
    | 'label'
    | 'optionIds'
    | 'types'
    | 'unitLabel'
    | QnrChoiceMatrixQuestionCategoryElementKeySpecifier
)[];
export type QnrChoiceMatrixQuestionCategoryElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrChoiceMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'childrenIds'
    | 'id'
    | 'types'
    | QnrChoiceMatrixQuestionElementKeySpecifier
)[];
export type QnrChoiceMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrChoiceOptionElementKeySpecifier = (
    | 'attachedOpenQuestionIds'
    | 'id'
    | 'label'
    | 'labelPosition'
    | 'types'
    | QnrChoiceOptionElementKeySpecifier
)[];
export type QnrChoiceOptionElementFieldPolicy = {
    attachedOpenQuestionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    labelPosition?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrChoiceQuestionElementKeySpecifier = (
    | 'childrenIds'
    | 'id'
    | 'optionIds'
    | 'types'
    | QnrChoiceQuestionElementKeySpecifier
)[];
export type QnrChoiceQuestionElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrContainerElementKeySpecifier = (
    | 'childrenIds'
    | 'id'
    | 'types'
    | QnrContainerElementKeySpecifier
)[];
export type QnrContainerElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrDifferentialQuestionElementKeySpecifier = (
    | 'childrenIds'
    | 'id'
    | 'partIds'
    | 'types'
    | QnrDifferentialQuestionElementKeySpecifier
)[];
export type QnrDifferentialQuestionElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    partIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrDifferentialQuestionPartElementKeySpecifier = (
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'optionIds'
    | 'types'
    | QnrDifferentialQuestionPartElementKeySpecifier
)[];
export type QnrDifferentialQuestionPartElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrDoubleMatrixQuestionCategoryElementKeySpecifier = (
    | 'childrenIds'
    | 'customLabelElementId'
    | 'id'
    | 'label'
    | 'types'
    | 'unitLabel'
    | QnrDoubleMatrixQuestionCategoryElementKeySpecifier
)[];
export type QnrDoubleMatrixQuestionCategoryElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrDoubleMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'childrenIds'
    | 'id'
    | 'types'
    | QnrDoubleMatrixQuestionElementKeySpecifier
)[];
export type QnrDoubleMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrDoubleMatrixQuestionPartElementKeySpecifier = (
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'title'
    | 'types'
    | QnrDoubleMatrixQuestionPartElementKeySpecifier
)[];
export type QnrDoubleMatrixQuestionPartElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrFormControlElementKeySpecifier = (
    | 'formControlId'
    | 'id'
    | 'types'
    | QnrFormControlElementKeySpecifier
)[];
export type QnrFormControlElementFieldPolicy = {
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrHasElementChildrenKeySpecifier = (
    | 'childrenIds'
    | QnrHasElementChildrenKeySpecifier
)[];
export type QnrHasElementChildrenFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrHtmlSectionElementKeySpecifier = (
    | 'html'
    | 'id'
    | 'kind'
    | 'types'
    | QnrHtmlSectionElementKeySpecifier
)[];
export type QnrHtmlSectionElementFieldPolicy = {
    html?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    kind?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrLabeledElementKeySpecifier = (
    | 'id'
    | 'label'
    | 'types'
    | QnrLabeledElementKeySpecifier
)[];
export type QnrLabeledElementFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrMatrixQuestionBaseElementKeySpecifier = (
    | 'categoryIds'
    | 'childrenIds'
    | 'id'
    | 'types'
    | QnrMatrixQuestionBaseElementKeySpecifier
)[];
export type QnrMatrixQuestionBaseElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrMatrixQuestionCategoryElementKeySpecifier = (
    | 'childrenIds'
    | 'customLabelElementId'
    | 'id'
    | 'label'
    | 'types'
    | 'unitLabel'
    | QnrMatrixQuestionCategoryElementKeySpecifier
)[];
export type QnrMatrixQuestionCategoryElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrMultipleChoiceMatrixQuestionCategoryElementKeySpecifier = (
    | 'childrenIds'
    | 'customLabelElementId'
    | 'id'
    | 'label'
    | 'optionIds'
    | 'types'
    | 'unitLabel'
    | QnrMultipleChoiceMatrixQuestionCategoryElementKeySpecifier
)[];
export type QnrMultipleChoiceMatrixQuestionCategoryElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrMultipleChoiceMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'childrenIds'
    | 'id'
    | 'types'
    | QnrMultipleChoiceMatrixQuestionElementKeySpecifier
)[];
export type QnrMultipleChoiceMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrMultipleChoiceOptionElementKeySpecifier = (
    | 'attachedOpenQuestionIds'
    | 'exclusive'
    | 'formControlId'
    | 'id'
    | 'label'
    | 'labelPosition'
    | 'types'
    | QnrMultipleChoiceOptionElementKeySpecifier
)[];
export type QnrMultipleChoiceOptionElementFieldPolicy = {
    attachedOpenQuestionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    exclusive?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    labelPosition?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrMultipleChoiceQuestionElementKeySpecifier = (
    | 'childrenIds'
    | 'id'
    | 'optionIds'
    | 'types'
    | QnrMultipleChoiceQuestionElementKeySpecifier
)[];
export type QnrMultipleChoiceQuestionElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrOpenMatrixQuestionCategoryElementKeySpecifier = (
    | 'childrenIds'
    | 'customLabelElementId'
    | 'id'
    | 'label'
    | 'types'
    | 'unitLabel'
    | QnrOpenMatrixQuestionCategoryElementKeySpecifier
)[];
export type QnrOpenMatrixQuestionCategoryElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrOpenMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'childrenIds'
    | 'id'
    | 'types'
    | QnrOpenMatrixQuestionElementKeySpecifier
)[];
export type QnrOpenMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrOpenQuestionElementKeySpecifier = (
    | 'autocomplete'
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'initialDate'
    | 'inputType'
    | 'label'
    | 'placeholder'
    | 'postfix'
    | 'prefix'
    | 'types'
    | 'validators'
    | QnrOpenQuestionElementKeySpecifier
)[];
export type QnrOpenQuestionElementFieldPolicy = {
    autocomplete?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    initialDate?: FieldPolicy<any> | FieldReadFunction<any>;
    inputType?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    placeholder?: FieldPolicy<any> | FieldReadFunction<any>;
    postfix?: FieldPolicy<any> | FieldReadFunction<any>;
    prefix?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    validators?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrParentElementKeySpecifier = (
    | 'childrenIds'
    | 'id'
    | 'types'
    | QnrParentElementKeySpecifier
)[];
export type QnrParentElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrPlainTextSectionElementKeySpecifier = (
    | 'id'
    | 'text'
    | 'types'
    | QnrPlainTextSectionElementKeySpecifier
)[];
export type QnrPlainTextSectionElementFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    text?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrQuestionValidatorKeySpecifier = (
    | 'errorMessage'
    | QnrQuestionValidatorKeySpecifier
)[];
export type QnrQuestionValidatorFieldPolicy = {
    errorMessage?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrSingleChoiceMatrixQuestionCategoryElementKeySpecifier = (
    | 'childrenIds'
    | 'customLabelElementId'
    | 'formControlId'
    | 'id'
    | 'label'
    | 'optionIds'
    | 'style'
    | 'types'
    | 'unitLabel'
    | QnrSingleChoiceMatrixQuestionCategoryElementKeySpecifier
)[];
export type QnrSingleChoiceMatrixQuestionCategoryElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    style?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrSingleChoiceMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'childrenIds'
    | 'id'
    | 'types'
    | QnrSingleChoiceMatrixQuestionElementKeySpecifier
)[];
export type QnrSingleChoiceMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrSingleChoiceOptionElementKeySpecifier = (
    | 'attachedOpenQuestionIds'
    | 'formValue'
    | 'id'
    | 'label'
    | 'labelPosition'
    | 'types'
    | QnrSingleChoiceOptionElementKeySpecifier
)[];
export type QnrSingleChoiceOptionElementFieldPolicy = {
    attachedOpenQuestionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formValue?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    labelPosition?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QnrSingleChoiceQuestionElementKeySpecifier = (
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'optionIds'
    | 'style'
    | 'types'
    | QnrSingleChoiceQuestionElementKeySpecifier
)[];
export type QnrSingleChoiceQuestionElementFieldPolicy = {
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    style?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QueryKeySpecifier = (
    | 'node'
    | 'nodes'
    | 'questionnaire'
    | 'questionnaireFiles'
    | 'questionnaireNews'
    | 'questionnaires'
    | 'user'
    | 'zofarLookupExternalQuestionnaireId'
    | 'zofarToken'
    | QueryKeySpecifier
)[];
export type QueryFieldPolicy = {
    node?: FieldPolicy<any> | FieldReadFunction<any>;
    nodes?: FieldPolicy<any> | FieldReadFunction<any>;
    questionnaire?: FieldPolicy<any> | FieldReadFunction<any>;
    questionnaireFiles?: FieldPolicy<any> | FieldReadFunction<any>;
    questionnaireNews?: FieldPolicy<any> | FieldReadFunction<any>;
    questionnaires?: FieldPolicy<any> | FieldReadFunction<any>;
    user?: FieldPolicy<any> | FieldReadFunction<any>;
    zofarLookupExternalQuestionnaireId?: FieldPolicy<any> | FieldReadFunction<any>;
    zofarToken?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnaireKeySpecifier = (
    | 'currentPage'
    | 'id'
    | 'name'
    | 'status'
    | QuestionnaireKeySpecifier
)[];
export type QuestionnaireFieldPolicy = {
    currentPage?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    name?: FieldPolicy<any> | FieldReadFunction<any>;
    status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnaireElementKeySpecifier = (
    | 'id'
    | 'types'
    | QuestionnaireElementKeySpecifier
)[];
export type QuestionnaireElementFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnaireFileKeySpecifier = (
    | 'description'
    | 'file'
    | 'id'
    | 'title'
    | 'type'
    | QuestionnaireFileKeySpecifier
)[];
export type QuestionnaireFileFieldPolicy = {
    description?: FieldPolicy<any> | FieldReadFunction<any>;
    file?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnaireFormValueKeySpecifier = (
    | 'formControlId'
    | 'value'
    | QuestionnaireFormValueKeySpecifier
)[];
export type QuestionnaireFormValueFieldPolicy = {
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    value?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnaireNewsKeySpecifier = (
    | 'content'
    | 'date'
    | 'description'
    | 'expired'
    | 'id'
    | 'seen'
    | 'title'
    | QuestionnaireNewsKeySpecifier
)[];
export type QuestionnaireNewsFieldPolicy = {
    content?: FieldPolicy<any> | FieldReadFunction<any>;
    date?: FieldPolicy<any> | FieldReadFunction<any>;
    description?: FieldPolicy<any> | FieldReadFunction<any>;
    expired?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    seen?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnaireOffsetPaginatedKeySpecifier = (
    | 'pageInfo'
    | 'results'
    | 'totalCount'
    | QuestionnaireOffsetPaginatedKeySpecifier
)[];
export type QuestionnaireOffsetPaginatedFieldPolicy = {
    pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
    results?: FieldPolicy<any> | FieldReadFunction<any>;
    totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnairePageKeySpecifier = (
    | 'allElements'
    | 'buttons'
    | 'childrenIds'
    | 'formValues'
    | 'headerIds'
    | 'id'
    | 'layout'
    | 'version'
    | QuestionnairePageKeySpecifier
)[];
export type QuestionnairePageFieldPolicy = {
    allElements?: FieldPolicy<any> | FieldReadFunction<any>;
    buttons?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formValues?: FieldPolicy<any> | FieldReadFunction<any>;
    headerIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    layout?: FieldPolicy<any> | FieldReadFunction<any>;
    version?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnairePageButtonKeySpecifier = (
    | 'id'
    | 'label'
    | 'type'
    | QuestionnairePageButtonKeySpecifier
)[];
export type QuestionnairePageButtonFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnairePageLayoutKeySpecifier = ('dummy' | QuestionnairePageLayoutKeySpecifier)[];
export type QuestionnairePageLayoutFieldPolicy = {
    dummy?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnairePageLayoutBoxedKeySpecifier = (
    | 'dummy'
    | 'title'
    | QuestionnairePageLayoutBoxedKeySpecifier
)[];
export type QuestionnairePageLayoutBoxedFieldPolicy = {
    dummy?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnairePageLayoutFullKeySpecifier = (
    | 'dummy'
    | QuestionnairePageLayoutFullKeySpecifier
)[];
export type QuestionnairePageLayoutFullFieldPolicy = {
    dummy?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuestionnaireStatusKeySpecifier = (
    | 'completionState'
    | 'firstVisit'
    | 'hidden'
    | 'id'
    | 'lastVisit'
    | QuestionnaireStatusKeySpecifier
)[];
export type QuestionnaireStatusFieldPolicy = {
    completionState?: FieldPolicy<any> | FieldReadFunction<any>;
    firstVisit?: FieldPolicy<any> | FieldReadFunction<any>;
    hidden?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    lastVisit?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type TextPatternValidatorKeySpecifier = (
    | 'errorMessage'
    | 'flags'
    | 'pattern'
    | TextPatternValidatorKeySpecifier
)[];
export type TextPatternValidatorFieldPolicy = {
    errorMessage?: FieldPolicy<any> | FieldReadFunction<any>;
    flags?: FieldPolicy<any> | FieldReadFunction<any>;
    pattern?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UserKeySpecifier = (
    | 'city'
    | 'country'
    | 'dateOfBirth'
    | 'email'
    | 'firstName'
    | 'id'
    | 'isAuthenticated'
    | 'lastName'
    | 'phone'
    | 'street'
    | 'zipCode'
    | UserKeySpecifier
)[];
export type UserFieldPolicy = {
    city?: FieldPolicy<any> | FieldReadFunction<any>;
    country?: FieldPolicy<any> | FieldReadFunction<any>;
    dateOfBirth?: FieldPolicy<any> | FieldReadFunction<any>;
    email?: FieldPolicy<any> | FieldReadFunction<any>;
    firstName?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    isAuthenticated?: FieldPolicy<any> | FieldReadFunction<any>;
    lastName?: FieldPolicy<any> | FieldReadFunction<any>;
    phone?: FieldPolicy<any> | FieldReadFunction<any>;
    street?: FieldPolicy<any> | FieldReadFunction<any>;
    zipCode?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type WebPushDeviceKeySpecifier = ('id' | WebPushDeviceKeySpecifier)[];
export type WebPushDeviceFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfAutocompleteListKeySpecifier = ('id' | 'items' | ZfAutocompleteListKeySpecifier)[];
export type ZfAutocompleteListFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    items?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfAutocompleteListItemKeySpecifier = (
    | 'id'
    | 'label'
    | 'value'
    | ZfAutocompleteListItemKeySpecifier
)[];
export type ZfAutocompleteListItemFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    value?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfChoiceMatrixQuestionCategoryElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'customLabelElementId'
    | 'formControlId'
    | 'id'
    | 'label'
    | 'optionIds'
    | 'types'
    | 'unitLabel'
    | ZfChoiceMatrixQuestionCategoryElementKeySpecifier
)[];
export type ZfChoiceMatrixQuestionCategoryElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfChoiceOptionBaseElementKeySpecifier = (
    | 'attachedOpenQuestionIds'
    | 'id'
    | 'label'
    | 'labelPosition'
    | 'types'
    | ZfChoiceOptionBaseElementKeySpecifier
)[];
export type ZfChoiceOptionBaseElementFieldPolicy = {
    attachedOpenQuestionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    labelPosition?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfContainerElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'id'
    | 'types'
    | ZfContainerElementKeySpecifier
)[];
export type ZfContainerElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfDifferentialQuestionElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'id'
    | 'partIds'
    | 'types'
    | ZfDifferentialQuestionElementKeySpecifier
)[];
export type ZfDifferentialQuestionElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    partIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfDifferentialQuestionPartElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'optionIds'
    | 'types'
    | ZfDifferentialQuestionPartElementKeySpecifier
)[];
export type ZfDifferentialQuestionPartElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfDoubleMatrixQuestionCategoryElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'customLabelElementId'
    | 'id'
    | 'label'
    | 'types'
    | 'unitLabel'
    | ZfDoubleMatrixQuestionCategoryElementKeySpecifier
)[];
export type ZfDoubleMatrixQuestionCategoryElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfDoubleMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'children'
    | 'childrenIds'
    | 'id'
    | 'titleLeft'
    | 'titleRight'
    | 'types'
    | ZfDoubleMatrixQuestionElementKeySpecifier
)[];
export type ZfDoubleMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    titleLeft?: FieldPolicy<any> | FieldReadFunction<any>;
    titleRight?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfDoubleMatrixQuestionPartElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'title'
    | 'types'
    | ZfDoubleMatrixQuestionPartElementKeySpecifier
)[];
export type ZfDoubleMatrixQuestionPartElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfElementKeySpecifier = ('id' | 'types' | ZfElementKeySpecifier)[];
export type ZfElementFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfEpisodeBoxedLayoutKeySpecifier = (
    | 'dummy'
    | 'episode'
    | ZfEpisodeBoxedLayoutKeySpecifier
)[];
export type ZfEpisodeBoxedLayoutFieldPolicy = {
    dummy?: FieldPolicy<any> | FieldReadFunction<any>;
    episode?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfEpisodeCategoryKeySpecifier = (
    | 'id'
    | 'label'
    | 'sortIndex'
    | 'typeIds'
    | 'types'
    | ZfEpisodeCategoryKeySpecifier
)[];
export type ZfEpisodeCategoryFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    sortIndex?: FieldPolicy<any> | FieldReadFunction<any>;
    typeIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfEpisodeEntryKeySpecifier = (
    | 'allowEditDialog'
    | 'badge'
    | 'endDate'
    | 'episodeTypeId'
    | 'event'
    | 'flags'
    | 'gap'
    | 'id'
    | 'label'
    | 'startDate'
    | 'state'
    | ZfEpisodeEntryKeySpecifier
)[];
export type ZfEpisodeEntryFieldPolicy = {
    allowEditDialog?: FieldPolicy<any> | FieldReadFunction<any>;
    badge?: FieldPolicy<any> | FieldReadFunction<any>;
    endDate?: FieldPolicy<any> | FieldReadFunction<any>;
    episodeTypeId?: FieldPolicy<any> | FieldReadFunction<any>;
    event?: FieldPolicy<any> | FieldReadFunction<any>;
    flags?: FieldPolicy<any> | FieldReadFunction<any>;
    gap?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    startDate?: FieldPolicy<any> | FieldReadFunction<any>;
    state?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfEpisodeTypeKeySpecifier = (
    | 'allowEvents'
    | 'category'
    | 'description'
    | 'hasDetailQuestions'
    | 'id'
    | 'label'
    | ZfEpisodeTypeKeySpecifier
)[];
export type ZfEpisodeTypeFieldPolicy = {
    allowEvents?: FieldPolicy<any> | FieldReadFunction<any>;
    category?: FieldPolicy<any> | FieldReadFunction<any>;
    description?: FieldPolicy<any> | FieldReadFunction<any>;
    hasDetailQuestions?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfEpisodesBaseKeySpecifier = (
    | 'afterEndFieldLabel'
    | 'beforeStartFieldLabel'
    | 'cancelBtnLabel'
    | 'endFieldLabel'
    | 'entries'
    | 'episodeCategories'
    | 'episodeTypes'
    | 'id'
    | 'maxDate'
    | 'minDate'
    | 'nameFieldLabel'
    | 'saveBtnLabel'
    | 'startFieldLabel'
    | 'typeFieldLabel'
    | 'types'
    | ZfEpisodesBaseKeySpecifier
)[];
export type ZfEpisodesBaseFieldPolicy = {
    afterEndFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    beforeStartFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    cancelBtnLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    endFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    entries?: FieldPolicy<any> | FieldReadFunction<any>;
    episodeCategories?: FieldPolicy<any> | FieldReadFunction<any>;
    episodeTypes?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    maxDate?: FieldPolicy<any> | FieldReadFunction<any>;
    minDate?: FieldPolicy<any> | FieldReadFunction<any>;
    nameFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    saveBtnLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    startFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    typeFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfEpisodesCalendarElementKeySpecifier = (
    | 'afterEndFieldLabel'
    | 'beforeStartFieldLabel'
    | 'cancelBtnLabel'
    | 'endFieldLabel'
    | 'entries'
    | 'episodeCategories'
    | 'episodeTypes'
    | 'id'
    | 'maxDate'
    | 'minDate'
    | 'nameFieldLabel'
    | 'saveBtnLabel'
    | 'startFieldLabel'
    | 'typeFieldLabel'
    | 'types'
    | ZfEpisodesCalendarElementKeySpecifier
)[];
export type ZfEpisodesCalendarElementFieldPolicy = {
    afterEndFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    beforeStartFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    cancelBtnLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    endFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    entries?: FieldPolicy<any> | FieldReadFunction<any>;
    episodeCategories?: FieldPolicy<any> | FieldReadFunction<any>;
    episodeTypes?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    maxDate?: FieldPolicy<any> | FieldReadFunction<any>;
    minDate?: FieldPolicy<any> | FieldReadFunction<any>;
    nameFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    saveBtnLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    startFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    typeFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfEpisodesTableElementKeySpecifier = (
    | 'afterEndFieldLabel'
    | 'beforeStartFieldLabel'
    | 'cancelBtnLabel'
    | 'endFieldLabel'
    | 'entries'
    | 'episodeCategories'
    | 'episodeTypes'
    | 'id'
    | 'maxDate'
    | 'minDate'
    | 'nameFieldLabel'
    | 'saveBtnLabel'
    | 'startFieldLabel'
    | 'typeFieldLabel'
    | 'types'
    | ZfEpisodesTableElementKeySpecifier
)[];
export type ZfEpisodesTableElementFieldPolicy = {
    afterEndFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    beforeStartFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    cancelBtnLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    endFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    entries?: FieldPolicy<any> | FieldReadFunction<any>;
    episodeCategories?: FieldPolicy<any> | FieldReadFunction<any>;
    episodeTypes?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    maxDate?: FieldPolicy<any> | FieldReadFunction<any>;
    minDate?: FieldPolicy<any> | FieldReadFunction<any>;
    nameFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    saveBtnLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    startFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    typeFieldLabel?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfFormControlElementKeySpecifier = (
    | 'formControlId'
    | 'id'
    | 'types'
    | ZfFormControlElementKeySpecifier
)[];
export type ZfFormControlElementFieldPolicy = {
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfHtmlSectionElementKeySpecifier = (
    | 'html'
    | 'id'
    | 'kind'
    | 'types'
    | ZfHtmlSectionElementKeySpecifier
)[];
export type ZfHtmlSectionElementFieldPolicy = {
    html?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    kind?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfMatrixQuestionCategoryElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'customLabelElementId'
    | 'id'
    | 'label'
    | 'types'
    | 'unitLabel'
    | ZfMatrixQuestionCategoryElementKeySpecifier
)[];
export type ZfMatrixQuestionCategoryElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfMultipleChoiceMatrixQuestionCategoryElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'customLabelElementId'
    | 'formControlId'
    | 'id'
    | 'label'
    | 'optionIds'
    | 'types'
    | 'unitLabel'
    | ZfMultipleChoiceMatrixQuestionCategoryElementKeySpecifier
)[];
export type ZfMultipleChoiceMatrixQuestionCategoryElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfMultipleChoiceMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'children'
    | 'childrenIds'
    | 'id'
    | 'types'
    | ZfMultipleChoiceMatrixQuestionElementKeySpecifier
)[];
export type ZfMultipleChoiceMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfMultipleChoiceOptionElementKeySpecifier = (
    | 'attachedOpenQuestionIds'
    | 'exclusive'
    | 'formControlId'
    | 'id'
    | 'label'
    | 'labelPosition'
    | 'types'
    | ZfMultipleChoiceOptionElementKeySpecifier
)[];
export type ZfMultipleChoiceOptionElementFieldPolicy = {
    attachedOpenQuestionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    exclusive?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    labelPosition?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfMultipleChoiceQuestionElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'id'
    | 'optionIds'
    | 'types'
    | ZfMultipleChoiceQuestionElementKeySpecifier
)[];
export type ZfMultipleChoiceQuestionElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfOpenMatrixQuestionCategoryElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'customLabelElementId'
    | 'id'
    | 'label'
    | 'types'
    | 'unitLabel'
    | ZfOpenMatrixQuestionCategoryElementKeySpecifier
)[];
export type ZfOpenMatrixQuestionCategoryElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfOpenMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'children'
    | 'childrenIds'
    | 'id'
    | 'types'
    | ZfOpenMatrixQuestionElementKeySpecifier
)[];
export type ZfOpenMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfOpenQuestionElementKeySpecifier = (
    | 'autocomplete'
    | 'children'
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'initialDate'
    | 'inputType'
    | 'label'
    | 'placeholder'
    | 'postfix'
    | 'prefix'
    | 'types'
    | 'validators'
    | ZfOpenQuestionElementKeySpecifier
)[];
export type ZfOpenQuestionElementFieldPolicy = {
    autocomplete?: FieldPolicy<any> | FieldReadFunction<any>;
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    initialDate?: FieldPolicy<any> | FieldReadFunction<any>;
    inputType?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    placeholder?: FieldPolicy<any> | FieldReadFunction<any>;
    postfix?: FieldPolicy<any> | FieldReadFunction<any>;
    prefix?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    validators?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfPageKeySpecifier = (
    | 'allElements'
    | 'buttons'
    | 'childrenIds'
    | 'formValues'
    | 'headerIds'
    | 'id'
    | 'layout'
    | 'version'
    | ZfPageKeySpecifier
)[];
export type ZfPageFieldPolicy = {
    allElements?: FieldPolicy<any> | FieldReadFunction<any>;
    buttons?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formValues?: FieldPolicy<any> | FieldReadFunction<any>;
    headerIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    layout?: FieldPolicy<any> | FieldReadFunction<any>;
    version?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfParentElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'id'
    | 'types'
    | ZfParentElementKeySpecifier
)[];
export type ZfParentElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfQuestionnaireKeySpecifier = (
    | 'currentPage'
    | 'id'
    | 'name'
    | 'status'
    | ZfQuestionnaireKeySpecifier
)[];
export type ZfQuestionnaireFieldPolicy = {
    currentPage?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    name?: FieldPolicy<any> | FieldReadFunction<any>;
    status?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfQuestionnaireOffsetPaginatedKeySpecifier = (
    | 'pageInfo'
    | 'results'
    | 'totalCount'
    | ZfQuestionnaireOffsetPaginatedKeySpecifier
)[];
export type ZfQuestionnaireOffsetPaginatedFieldPolicy = {
    pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
    results?: FieldPolicy<any> | FieldReadFunction<any>;
    totalCount?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfQuestionnaireStatusKeySpecifier = (
    | 'completionState'
    | 'firstVisit'
    | 'hidden'
    | 'id'
    | 'lastVisit'
    | ZfQuestionnaireStatusKeySpecifier
)[];
export type ZfQuestionnaireStatusFieldPolicy = {
    completionState?: FieldPolicy<any> | FieldReadFunction<any>;
    firstVisit?: FieldPolicy<any> | FieldReadFunction<any>;
    hidden?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    lastVisit?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfSingleChoiceMatrixQuestionCategoryElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'customLabelElementId'
    | 'formControlId'
    | 'id'
    | 'label'
    | 'optionIds'
    | 'style'
    | 'types'
    | 'unitLabel'
    | ZfSingleChoiceMatrixQuestionCategoryElementKeySpecifier
)[];
export type ZfSingleChoiceMatrixQuestionCategoryElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    customLabelElementId?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    style?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
    unitLabel?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfSingleChoiceMatrixQuestionElementKeySpecifier = (
    | 'categoryIds'
    | 'children'
    | 'childrenIds'
    | 'id'
    | 'types'
    | ZfSingleChoiceMatrixQuestionElementKeySpecifier
)[];
export type ZfSingleChoiceMatrixQuestionElementFieldPolicy = {
    categoryIds?: FieldPolicy<any> | FieldReadFunction<any>;
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfSingleChoiceOptionElementKeySpecifier = (
    | 'attachedOpenQuestionIds'
    | 'formValue'
    | 'id'
    | 'label'
    | 'labelPosition'
    | 'types'
    | ZfSingleChoiceOptionElementKeySpecifier
)[];
export type ZfSingleChoiceOptionElementFieldPolicy = {
    attachedOpenQuestionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formValue?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    label?: FieldPolicy<any> | FieldReadFunction<any>;
    labelPosition?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfSingleChoiceQuestionBaseElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'optionIds'
    | 'style'
    | 'types'
    | ZfSingleChoiceQuestionBaseElementKeySpecifier
)[];
export type ZfSingleChoiceQuestionBaseElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    style?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfSingleChoiceQuestionElementKeySpecifier = (
    | 'children'
    | 'childrenIds'
    | 'formControlId'
    | 'id'
    | 'optionIds'
    | 'style'
    | 'types'
    | ZfSingleChoiceQuestionElementKeySpecifier
)[];
export type ZfSingleChoiceQuestionElementFieldPolicy = {
    children?: FieldPolicy<any> | FieldReadFunction<any>;
    childrenIds?: FieldPolicy<any> | FieldReadFunction<any>;
    formControlId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    optionIds?: FieldPolicy<any> | FieldReadFunction<any>;
    style?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfUnknownElementKeySpecifier = (
    | 'id'
    | 'text'
    | 'types'
    | ZfUnknownElementKeySpecifier
)[];
export type ZfUnknownElementFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    text?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZfUnmappedElementKeySpecifier = (
    | 'id'
    | 'text'
    | 'types'
    | ZfUnmappedElementKeySpecifier
)[];
export type ZfUnmappedElementFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    text?: FieldPolicy<any> | FieldReadFunction<any>;
    types?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ZofarTokenKeySpecifier = (
    | 'accountState'
    | 'hasSeenTour'
    | 'id'
    | 'token'
    | ZofarTokenKeySpecifier
)[];
export type ZofarTokenFieldPolicy = {
    accountState?: FieldPolicy<any> | FieldReadFunction<any>;
    hasSeenTour?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    token?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StrictTypedTypePolicies = {
    AnonymousUser?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | AnonymousUserKeySpecifier
            | (() => undefined | AnonymousUserKeySpecifier);
        fields?: AnonymousUserFieldPolicy;
    };
    BaseUser?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | BaseUserKeySpecifier | (() => undefined | BaseUserKeySpecifier);
        fields?: BaseUserFieldPolicy;
    };
    ConfirmEmailSuccessResult?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ConfirmEmailSuccessResultKeySpecifier
            | (() => undefined | ConfirmEmailSuccessResultKeySpecifier);
        fields?: ConfirmEmailSuccessResultFieldPolicy;
    };
    EmailValidator?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | EmailValidatorKeySpecifier
            | (() => undefined | EmailValidatorKeySpecifier);
        fields?: EmailValidatorFieldPolicy;
    };
    File?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier);
        fields?: FileFieldPolicy;
    };
    MaxDateValidator?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | MaxDateValidatorKeySpecifier
            | (() => undefined | MaxDateValidatorKeySpecifier);
        fields?: MaxDateValidatorFieldPolicy;
    };
    MaxTextLengthValidator?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | MaxTextLengthValidatorKeySpecifier
            | (() => undefined | MaxTextLengthValidatorKeySpecifier);
        fields?: MaxTextLengthValidatorFieldPolicy;
    };
    MaxValueValidator?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | MaxValueValidatorKeySpecifier
            | (() => undefined | MaxValueValidatorKeySpecifier);
        fields?: MaxValueValidatorFieldPolicy;
    };
    MinDateValidator?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | MinDateValidatorKeySpecifier
            | (() => undefined | MinDateValidatorKeySpecifier);
        fields?: MinDateValidatorFieldPolicy;
    };
    MinValueValidator?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | MinValueValidatorKeySpecifier
            | (() => undefined | MinValueValidatorKeySpecifier);
        fields?: MinValueValidatorFieldPolicy;
    };
    Mutation?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier);
        fields?: MutationFieldPolicy;
    };
    Node?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier);
        fields?: NodeFieldPolicy;
    };
    OffsetPaginationInfo?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | OffsetPaginationInfoKeySpecifier
            | (() => undefined | OffsetPaginationInfoKeySpecifier);
        fields?: OffsetPaginationInfoFieldPolicy;
    };
    OperationInfo?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | OperationInfoKeySpecifier
            | (() => undefined | OperationInfoKeySpecifier);
        fields?: OperationInfoFieldPolicy;
    };
    OperationMessage?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | OperationMessageKeySpecifier
            | (() => undefined | OperationMessageKeySpecifier);
        fields?: OperationMessageFieldPolicy;
    };
    QnrAutocompleteList?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrAutocompleteListKeySpecifier
            | (() => undefined | QnrAutocompleteListKeySpecifier);
        fields?: QnrAutocompleteListFieldPolicy;
    };
    QnrAutocompleteListItem?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrAutocompleteListItemKeySpecifier
            | (() => undefined | QnrAutocompleteListItemKeySpecifier);
        fields?: QnrAutocompleteListItemFieldPolicy;
    };
    QnrChoiceMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrChoiceMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | QnrChoiceMatrixQuestionCategoryElementKeySpecifier);
        fields?: QnrChoiceMatrixQuestionCategoryElementFieldPolicy;
    };
    QnrChoiceMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrChoiceMatrixQuestionElementKeySpecifier
            | (() => undefined | QnrChoiceMatrixQuestionElementKeySpecifier);
        fields?: QnrChoiceMatrixQuestionElementFieldPolicy;
    };
    QnrChoiceOptionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrChoiceOptionElementKeySpecifier
            | (() => undefined | QnrChoiceOptionElementKeySpecifier);
        fields?: QnrChoiceOptionElementFieldPolicy;
    };
    QnrChoiceQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrChoiceQuestionElementKeySpecifier
            | (() => undefined | QnrChoiceQuestionElementKeySpecifier);
        fields?: QnrChoiceQuestionElementFieldPolicy;
    };
    QnrContainerElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrContainerElementKeySpecifier
            | (() => undefined | QnrContainerElementKeySpecifier);
        fields?: QnrContainerElementFieldPolicy;
    };
    QnrDifferentialQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrDifferentialQuestionElementKeySpecifier
            | (() => undefined | QnrDifferentialQuestionElementKeySpecifier);
        fields?: QnrDifferentialQuestionElementFieldPolicy;
    };
    QnrDifferentialQuestionPartElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrDifferentialQuestionPartElementKeySpecifier
            | (() => undefined | QnrDifferentialQuestionPartElementKeySpecifier);
        fields?: QnrDifferentialQuestionPartElementFieldPolicy;
    };
    QnrDoubleMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrDoubleMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | QnrDoubleMatrixQuestionCategoryElementKeySpecifier);
        fields?: QnrDoubleMatrixQuestionCategoryElementFieldPolicy;
    };
    QnrDoubleMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrDoubleMatrixQuestionElementKeySpecifier
            | (() => undefined | QnrDoubleMatrixQuestionElementKeySpecifier);
        fields?: QnrDoubleMatrixQuestionElementFieldPolicy;
    };
    QnrDoubleMatrixQuestionPartElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrDoubleMatrixQuestionPartElementKeySpecifier
            | (() => undefined | QnrDoubleMatrixQuestionPartElementKeySpecifier);
        fields?: QnrDoubleMatrixQuestionPartElementFieldPolicy;
    };
    QnrFormControlElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrFormControlElementKeySpecifier
            | (() => undefined | QnrFormControlElementKeySpecifier);
        fields?: QnrFormControlElementFieldPolicy;
    };
    QnrHasElementChildren?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrHasElementChildrenKeySpecifier
            | (() => undefined | QnrHasElementChildrenKeySpecifier);
        fields?: QnrHasElementChildrenFieldPolicy;
    };
    QnrHtmlSectionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrHtmlSectionElementKeySpecifier
            | (() => undefined | QnrHtmlSectionElementKeySpecifier);
        fields?: QnrHtmlSectionElementFieldPolicy;
    };
    QnrLabeledElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrLabeledElementKeySpecifier
            | (() => undefined | QnrLabeledElementKeySpecifier);
        fields?: QnrLabeledElementFieldPolicy;
    };
    QnrMatrixQuestionBaseElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrMatrixQuestionBaseElementKeySpecifier
            | (() => undefined | QnrMatrixQuestionBaseElementKeySpecifier);
        fields?: QnrMatrixQuestionBaseElementFieldPolicy;
    };
    QnrMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | QnrMatrixQuestionCategoryElementKeySpecifier);
        fields?: QnrMatrixQuestionCategoryElementFieldPolicy;
    };
    QnrMultipleChoiceMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrMultipleChoiceMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | QnrMultipleChoiceMatrixQuestionCategoryElementKeySpecifier);
        fields?: QnrMultipleChoiceMatrixQuestionCategoryElementFieldPolicy;
    };
    QnrMultipleChoiceMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrMultipleChoiceMatrixQuestionElementKeySpecifier
            | (() => undefined | QnrMultipleChoiceMatrixQuestionElementKeySpecifier);
        fields?: QnrMultipleChoiceMatrixQuestionElementFieldPolicy;
    };
    QnrMultipleChoiceOptionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrMultipleChoiceOptionElementKeySpecifier
            | (() => undefined | QnrMultipleChoiceOptionElementKeySpecifier);
        fields?: QnrMultipleChoiceOptionElementFieldPolicy;
    };
    QnrMultipleChoiceQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrMultipleChoiceQuestionElementKeySpecifier
            | (() => undefined | QnrMultipleChoiceQuestionElementKeySpecifier);
        fields?: QnrMultipleChoiceQuestionElementFieldPolicy;
    };
    QnrOpenMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrOpenMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | QnrOpenMatrixQuestionCategoryElementKeySpecifier);
        fields?: QnrOpenMatrixQuestionCategoryElementFieldPolicy;
    };
    QnrOpenMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrOpenMatrixQuestionElementKeySpecifier
            | (() => undefined | QnrOpenMatrixQuestionElementKeySpecifier);
        fields?: QnrOpenMatrixQuestionElementFieldPolicy;
    };
    QnrOpenQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrOpenQuestionElementKeySpecifier
            | (() => undefined | QnrOpenQuestionElementKeySpecifier);
        fields?: QnrOpenQuestionElementFieldPolicy;
    };
    QnrParentElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrParentElementKeySpecifier
            | (() => undefined | QnrParentElementKeySpecifier);
        fields?: QnrParentElementFieldPolicy;
    };
    QnrPlainTextSectionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrPlainTextSectionElementKeySpecifier
            | (() => undefined | QnrPlainTextSectionElementKeySpecifier);
        fields?: QnrPlainTextSectionElementFieldPolicy;
    };
    QnrQuestionValidator?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrQuestionValidatorKeySpecifier
            | (() => undefined | QnrQuestionValidatorKeySpecifier);
        fields?: QnrQuestionValidatorFieldPolicy;
    };
    QnrSingleChoiceMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrSingleChoiceMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | QnrSingleChoiceMatrixQuestionCategoryElementKeySpecifier);
        fields?: QnrSingleChoiceMatrixQuestionCategoryElementFieldPolicy;
    };
    QnrSingleChoiceMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrSingleChoiceMatrixQuestionElementKeySpecifier
            | (() => undefined | QnrSingleChoiceMatrixQuestionElementKeySpecifier);
        fields?: QnrSingleChoiceMatrixQuestionElementFieldPolicy;
    };
    QnrSingleChoiceOptionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrSingleChoiceOptionElementKeySpecifier
            | (() => undefined | QnrSingleChoiceOptionElementKeySpecifier);
        fields?: QnrSingleChoiceOptionElementFieldPolicy;
    };
    QnrSingleChoiceQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QnrSingleChoiceQuestionElementKeySpecifier
            | (() => undefined | QnrSingleChoiceQuestionElementKeySpecifier);
        fields?: QnrSingleChoiceQuestionElementFieldPolicy;
    };
    Query?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier);
        fields?: QueryFieldPolicy;
    };
    Questionnaire?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnaireKeySpecifier
            | (() => undefined | QuestionnaireKeySpecifier);
        fields?: QuestionnaireFieldPolicy;
    };
    QuestionnaireElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnaireElementKeySpecifier
            | (() => undefined | QuestionnaireElementKeySpecifier);
        fields?: QuestionnaireElementFieldPolicy;
    };
    QuestionnaireFile?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnaireFileKeySpecifier
            | (() => undefined | QuestionnaireFileKeySpecifier);
        fields?: QuestionnaireFileFieldPolicy;
    };
    QuestionnaireFormValue?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnaireFormValueKeySpecifier
            | (() => undefined | QuestionnaireFormValueKeySpecifier);
        fields?: QuestionnaireFormValueFieldPolicy;
    };
    QuestionnaireNews?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnaireNewsKeySpecifier
            | (() => undefined | QuestionnaireNewsKeySpecifier);
        fields?: QuestionnaireNewsFieldPolicy;
    };
    QuestionnaireOffsetPaginated?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnaireOffsetPaginatedKeySpecifier
            | (() => undefined | QuestionnaireOffsetPaginatedKeySpecifier);
        fields?: QuestionnaireOffsetPaginatedFieldPolicy;
    };
    QuestionnairePage?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnairePageKeySpecifier
            | (() => undefined | QuestionnairePageKeySpecifier);
        fields?: QuestionnairePageFieldPolicy;
    };
    QuestionnairePageButton?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnairePageButtonKeySpecifier
            | (() => undefined | QuestionnairePageButtonKeySpecifier);
        fields?: QuestionnairePageButtonFieldPolicy;
    };
    QuestionnairePageLayout?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnairePageLayoutKeySpecifier
            | (() => undefined | QuestionnairePageLayoutKeySpecifier);
        fields?: QuestionnairePageLayoutFieldPolicy;
    };
    QuestionnairePageLayoutBoxed?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnairePageLayoutBoxedKeySpecifier
            | (() => undefined | QuestionnairePageLayoutBoxedKeySpecifier);
        fields?: QuestionnairePageLayoutBoxedFieldPolicy;
    };
    QuestionnairePageLayoutFull?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnairePageLayoutFullKeySpecifier
            | (() => undefined | QuestionnairePageLayoutFullKeySpecifier);
        fields?: QuestionnairePageLayoutFullFieldPolicy;
    };
    QuestionnaireStatus?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | QuestionnaireStatusKeySpecifier
            | (() => undefined | QuestionnaireStatusKeySpecifier);
        fields?: QuestionnaireStatusFieldPolicy;
    };
    TextPatternValidator?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | TextPatternValidatorKeySpecifier
            | (() => undefined | TextPatternValidatorKeySpecifier);
        fields?: TextPatternValidatorFieldPolicy;
    };
    User?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier);
        fields?: UserFieldPolicy;
    };
    WebPushDevice?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | WebPushDeviceKeySpecifier
            | (() => undefined | WebPushDeviceKeySpecifier);
        fields?: WebPushDeviceFieldPolicy;
    };
    ZfAutocompleteList?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfAutocompleteListKeySpecifier
            | (() => undefined | ZfAutocompleteListKeySpecifier);
        fields?: ZfAutocompleteListFieldPolicy;
    };
    ZfAutocompleteListItem?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfAutocompleteListItemKeySpecifier
            | (() => undefined | ZfAutocompleteListItemKeySpecifier);
        fields?: ZfAutocompleteListItemFieldPolicy;
    };
    ZfChoiceMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfChoiceMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | ZfChoiceMatrixQuestionCategoryElementKeySpecifier);
        fields?: ZfChoiceMatrixQuestionCategoryElementFieldPolicy;
    };
    ZfChoiceOptionBaseElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfChoiceOptionBaseElementKeySpecifier
            | (() => undefined | ZfChoiceOptionBaseElementKeySpecifier);
        fields?: ZfChoiceOptionBaseElementFieldPolicy;
    };
    ZfContainerElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfContainerElementKeySpecifier
            | (() => undefined | ZfContainerElementKeySpecifier);
        fields?: ZfContainerElementFieldPolicy;
    };
    ZfDifferentialQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfDifferentialQuestionElementKeySpecifier
            | (() => undefined | ZfDifferentialQuestionElementKeySpecifier);
        fields?: ZfDifferentialQuestionElementFieldPolicy;
    };
    ZfDifferentialQuestionPartElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfDifferentialQuestionPartElementKeySpecifier
            | (() => undefined | ZfDifferentialQuestionPartElementKeySpecifier);
        fields?: ZfDifferentialQuestionPartElementFieldPolicy;
    };
    ZfDoubleMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfDoubleMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | ZfDoubleMatrixQuestionCategoryElementKeySpecifier);
        fields?: ZfDoubleMatrixQuestionCategoryElementFieldPolicy;
    };
    ZfDoubleMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfDoubleMatrixQuestionElementKeySpecifier
            | (() => undefined | ZfDoubleMatrixQuestionElementKeySpecifier);
        fields?: ZfDoubleMatrixQuestionElementFieldPolicy;
    };
    ZfDoubleMatrixQuestionPartElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfDoubleMatrixQuestionPartElementKeySpecifier
            | (() => undefined | ZfDoubleMatrixQuestionPartElementKeySpecifier);
        fields?: ZfDoubleMatrixQuestionPartElementFieldPolicy;
    };
    ZfElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | ZfElementKeySpecifier | (() => undefined | ZfElementKeySpecifier);
        fields?: ZfElementFieldPolicy;
    };
    ZfEpisodeBoxedLayout?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfEpisodeBoxedLayoutKeySpecifier
            | (() => undefined | ZfEpisodeBoxedLayoutKeySpecifier);
        fields?: ZfEpisodeBoxedLayoutFieldPolicy;
    };
    ZfEpisodeCategory?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfEpisodeCategoryKeySpecifier
            | (() => undefined | ZfEpisodeCategoryKeySpecifier);
        fields?: ZfEpisodeCategoryFieldPolicy;
    };
    ZfEpisodeEntry?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfEpisodeEntryKeySpecifier
            | (() => undefined | ZfEpisodeEntryKeySpecifier);
        fields?: ZfEpisodeEntryFieldPolicy;
    };
    ZfEpisodeType?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfEpisodeTypeKeySpecifier
            | (() => undefined | ZfEpisodeTypeKeySpecifier);
        fields?: ZfEpisodeTypeFieldPolicy;
    };
    ZfEpisodesBase?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfEpisodesBaseKeySpecifier
            | (() => undefined | ZfEpisodesBaseKeySpecifier);
        fields?: ZfEpisodesBaseFieldPolicy;
    };
    ZfEpisodesCalendarElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfEpisodesCalendarElementKeySpecifier
            | (() => undefined | ZfEpisodesCalendarElementKeySpecifier);
        fields?: ZfEpisodesCalendarElementFieldPolicy;
    };
    ZfEpisodesTableElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfEpisodesTableElementKeySpecifier
            | (() => undefined | ZfEpisodesTableElementKeySpecifier);
        fields?: ZfEpisodesTableElementFieldPolicy;
    };
    ZfFormControlElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfFormControlElementKeySpecifier
            | (() => undefined | ZfFormControlElementKeySpecifier);
        fields?: ZfFormControlElementFieldPolicy;
    };
    ZfHtmlSectionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfHtmlSectionElementKeySpecifier
            | (() => undefined | ZfHtmlSectionElementKeySpecifier);
        fields?: ZfHtmlSectionElementFieldPolicy;
    };
    ZfMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | ZfMatrixQuestionCategoryElementKeySpecifier);
        fields?: ZfMatrixQuestionCategoryElementFieldPolicy;
    };
    ZfMultipleChoiceMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfMultipleChoiceMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | ZfMultipleChoiceMatrixQuestionCategoryElementKeySpecifier);
        fields?: ZfMultipleChoiceMatrixQuestionCategoryElementFieldPolicy;
    };
    ZfMultipleChoiceMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfMultipleChoiceMatrixQuestionElementKeySpecifier
            | (() => undefined | ZfMultipleChoiceMatrixQuestionElementKeySpecifier);
        fields?: ZfMultipleChoiceMatrixQuestionElementFieldPolicy;
    };
    ZfMultipleChoiceOptionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfMultipleChoiceOptionElementKeySpecifier
            | (() => undefined | ZfMultipleChoiceOptionElementKeySpecifier);
        fields?: ZfMultipleChoiceOptionElementFieldPolicy;
    };
    ZfMultipleChoiceQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfMultipleChoiceQuestionElementKeySpecifier
            | (() => undefined | ZfMultipleChoiceQuestionElementKeySpecifier);
        fields?: ZfMultipleChoiceQuestionElementFieldPolicy;
    };
    ZfOpenMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfOpenMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | ZfOpenMatrixQuestionCategoryElementKeySpecifier);
        fields?: ZfOpenMatrixQuestionCategoryElementFieldPolicy;
    };
    ZfOpenMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfOpenMatrixQuestionElementKeySpecifier
            | (() => undefined | ZfOpenMatrixQuestionElementKeySpecifier);
        fields?: ZfOpenMatrixQuestionElementFieldPolicy;
    };
    ZfOpenQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfOpenQuestionElementKeySpecifier
            | (() => undefined | ZfOpenQuestionElementKeySpecifier);
        fields?: ZfOpenQuestionElementFieldPolicy;
    };
    ZfPage?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | ZfPageKeySpecifier | (() => undefined | ZfPageKeySpecifier);
        fields?: ZfPageFieldPolicy;
    };
    ZfParentElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfParentElementKeySpecifier
            | (() => undefined | ZfParentElementKeySpecifier);
        fields?: ZfParentElementFieldPolicy;
    };
    ZfQuestionnaire?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfQuestionnaireKeySpecifier
            | (() => undefined | ZfQuestionnaireKeySpecifier);
        fields?: ZfQuestionnaireFieldPolicy;
    };
    ZfQuestionnaireOffsetPaginated?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfQuestionnaireOffsetPaginatedKeySpecifier
            | (() => undefined | ZfQuestionnaireOffsetPaginatedKeySpecifier);
        fields?: ZfQuestionnaireOffsetPaginatedFieldPolicy;
    };
    ZfQuestionnaireStatus?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfQuestionnaireStatusKeySpecifier
            | (() => undefined | ZfQuestionnaireStatusKeySpecifier);
        fields?: ZfQuestionnaireStatusFieldPolicy;
    };
    ZfSingleChoiceMatrixQuestionCategoryElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfSingleChoiceMatrixQuestionCategoryElementKeySpecifier
            | (() => undefined | ZfSingleChoiceMatrixQuestionCategoryElementKeySpecifier);
        fields?: ZfSingleChoiceMatrixQuestionCategoryElementFieldPolicy;
    };
    ZfSingleChoiceMatrixQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfSingleChoiceMatrixQuestionElementKeySpecifier
            | (() => undefined | ZfSingleChoiceMatrixQuestionElementKeySpecifier);
        fields?: ZfSingleChoiceMatrixQuestionElementFieldPolicy;
    };
    ZfSingleChoiceOptionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfSingleChoiceOptionElementKeySpecifier
            | (() => undefined | ZfSingleChoiceOptionElementKeySpecifier);
        fields?: ZfSingleChoiceOptionElementFieldPolicy;
    };
    ZfSingleChoiceQuestionBaseElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfSingleChoiceQuestionBaseElementKeySpecifier
            | (() => undefined | ZfSingleChoiceQuestionBaseElementKeySpecifier);
        fields?: ZfSingleChoiceQuestionBaseElementFieldPolicy;
    };
    ZfSingleChoiceQuestionElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfSingleChoiceQuestionElementKeySpecifier
            | (() => undefined | ZfSingleChoiceQuestionElementKeySpecifier);
        fields?: ZfSingleChoiceQuestionElementFieldPolicy;
    };
    ZfUnknownElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfUnknownElementKeySpecifier
            | (() => undefined | ZfUnknownElementKeySpecifier);
        fields?: ZfUnknownElementFieldPolicy;
    };
    ZfUnmappedElement?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?:
            | false
            | ZfUnmappedElementKeySpecifier
            | (() => undefined | ZfUnmappedElementKeySpecifier);
        fields?: ZfUnmappedElementFieldPolicy;
    };
    ZofarToken?: Omit<TypePolicy, 'fields' | 'keyFields'> & {
        keyFields?: false | ZofarTokenKeySpecifier | (() => undefined | ZofarTokenKeySpecifier);
        fields?: ZofarTokenFieldPolicy;
    };
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;
