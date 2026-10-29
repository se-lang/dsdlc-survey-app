/* eslint-disable */
import * as GeneratedHelpers from '../generated-helpers/helpers.js';
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
    [_ in K]?: never;
};
export type Incremental<T> =
    | T
    | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export const scalarTypePolicies = {};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    /** Date (isoformat) */
    Date: { input: string; output: string };
    /** Date with time (isoformat) */
    DateTime: { input: string; output: string };
    /** Decimal (fixed-point) */
    Decimal: { input: string; output: string };
    Duration: { input: string | number; output: string };
    /** The QuestionnaireFormControlValue scalar represents a value of a form control.The type of value depends on the type of form control. */
    QuestionnaireFormControlValue: { input: unknown; output: string | number | boolean | null };
    /** Represents NULL values */
    Void: { input: null; output: null };
};

export type ActivateZofarGuestSessionPayload = AnonymousUser | OperationInfo;

export type AnonymousUser = BaseUser &
    Node & {
        __typename: 'AnonymousUser';
        guestHasAccount: Scalars['Boolean']['output'];
        hasGuestSession: Scalars['Boolean']['output'];
        /** The Globally Unique ID of this object */
        id: Scalars['ID']['output'];
        isAuthenticated: Scalars['Boolean']['output'];
    };

export type BaseUser = {
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
    isAuthenticated: Scalars['Boolean']['output'];
};

export type ConfirmEmailSuccessResult = {
    __typename: 'ConfirmEmailSuccessResult';
    activated: Scalars['Boolean']['output'];
};

export type EmailValidator = QnrQuestionValidator & {
    __typename: 'EmailValidator';
    errorMessage: Scalars['String']['output'];
};

export type File = {
    __typename: 'File';
    name: Scalars['String']['output'];
    url: Scalars['String']['output'];
};

export type LoginPayload = OperationInfo | User;

export type MarkZofarGapHiddenPayload = OperationInfo | ZfPage;

export type MaxDateValidator = QnrQuestionValidator & {
    __typename: 'MaxDateValidator';
    errorMessage: Scalars['String']['output'];
    maxValue: Scalars['Date']['output'];
};

export type MaxTextLengthValidator = QnrQuestionValidator & {
    __typename: 'MaxTextLengthValidator';
    errorMessage: Scalars['String']['output'];
    maxLength: Scalars['Int']['output'];
};

export type MaxValueValidator = QnrQuestionValidator & {
    __typename: 'MaxValueValidator';
    errorMessage: Scalars['String']['output'];
    maxValue: Scalars['Decimal']['output'];
};

export type MinDateValidator = QnrQuestionValidator & {
    __typename: 'MinDateValidator';
    errorMessage: Scalars['String']['output'];
    minValue: Scalars['Date']['output'];
};

export type MinValueValidator = QnrQuestionValidator & {
    __typename: 'MinValueValidator';
    errorMessage: Scalars['String']['output'];
    minValue: Scalars['Decimal']['output'];
};

export type Mutation = {
    __typename: 'Mutation';
    activateZofarGuestSession: ActivateZofarGuestSessionPayload;
    addParadata: Maybe<OperationInfo>;
    confirmEmail: OperationInfoConfirmEmailSuccessResult;
    forgotPassword: Maybe<Scalars['Void']['output']>;
    login: LoginPayload;
    logout: AnonymousUser;
    markZofarGapHidden: MarkZofarGapHiddenPayload;
    refreshQuestionnaireStatus: Array<QuestionnaireStatus>;
    registerWebPush: WebPushDevice;
    removeZofarEpisode: RemoveZofarEpisodePayload;
    resendAccountActivation: Maybe<Scalars['Void']['output']>;
    resetPassword: Maybe<OperationInfo>;
    saveZofarEpisode: SaveZofarEpisodePayload;
    setQuestionnaireNewsSeen: SetQuestionnaireNewsSeenPayload;
    triggerUserEmailChange: Maybe<OperationInfo>;
    unregisterWebPush: Maybe<Scalars['Void']['output']>;
    updateUser: UpdateUserPayload;
    updateUserEmail: Maybe<OperationInfo>;
    updateZofarToken: UpdateZofarTokenPayload;
    zofarBack: ZofarBackPayload;
    zofarNavigateToEpisodeDetails: ZofarNavigateToEpisodeDetailsPayload;
    zofarRegister: Maybe<OperationInfo>;
    zofarSubmit: ZofarSubmitPayload;
};

export type MutationActivateZofarGuestSessionArgs = {
    data: ZfGuestSessionInput;
};

export type MutationAddParadataArgs = {
    data: Array<ParadataInput>;
};

export type MutationConfirmEmailArgs = {
    token: Scalars['String']['input'];
    uid: Scalars['String']['input'];
};

export type MutationForgotPasswordArgs = {
    email: Scalars['String']['input'];
};

export type MutationLoginArgs = {
    password: Scalars['String']['input'];
    username: Scalars['String']['input'];
};

export type MutationMarkZofarGapHiddenArgs = {
    data: ZfHideGapInput;
};

export type MutationRefreshQuestionnaireStatusArgs = {
    statusIds: Array<Scalars['ID']['input']>;
};

export type MutationRegisterWebPushArgs = {
    input: RegisterWebPushInput;
};

export type MutationRemoveZofarEpisodeArgs = {
    data: ZfRemoveEpisodeInput;
};

export type MutationResendAccountActivationArgs = {
    data: ResendAccountActivationInput;
};

export type MutationResetPasswordArgs = {
    input: ResetPasswordInput;
};

export type MutationSaveZofarEpisodeArgs = {
    continueToDetails?: Scalars['Boolean']['input'];
    data: ZfSaveEpisodeInput;
};

export type MutationSetQuestionnaireNewsSeenArgs = {
    newsId: Scalars['ID']['input'];
    seen?: Scalars['Boolean']['input'];
};

export type MutationUnregisterWebPushArgs = {
    input: UnregisterWebPushInput;
};

export type MutationUpdateUserArgs = {
    data: UpdateUser;
};

export type MutationUpdateUserEmailArgs = {
    newEmail: Scalars['String']['input'];
    token: Scalars['String']['input'];
    uid: Scalars['String']['input'];
};

export type MutationUpdateZofarTokenArgs = {
    data: ZofarTokenUpdate;
};

export type MutationZofarBackArgs = {
    questionnaireId: Scalars['ID']['input'];
};

export type MutationZofarNavigateToEpisodeDetailsArgs = {
    data: ZfNavigateToEpisodeDetailsInput;
};

export type MutationZofarRegisterArgs = {
    data: ZofarCreateUser;
};

export type MutationZofarSubmitArgs = {
    data: ZfFormSubmit;
};

/** An object with a Globally Unique ID */
export type Node = {
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
};

export type OffsetPaginationInfo = {
    __typename: 'OffsetPaginationInfo';
    limit: Maybe<Scalars['Int']['output']>;
    offset: Scalars['Int']['output'];
};

export type OffsetPaginationInput = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: Scalars['Int']['input'];
};

export type OperationInfo = {
    __typename: 'OperationInfo';
    /** List of messages returned by the operation. */
    messages: Array<OperationMessage>;
};

export type OperationInfoConfirmEmailSuccessResult = ConfirmEmailSuccessResult | OperationInfo;

export type OperationMessage = {
    __typename: 'OperationMessage';
    /** The error code, or `null` if no error code was set. */
    code: Maybe<Scalars['String']['output']>;
    /** The field that caused the error, or `null` if it isn't associated with any particular field. */
    field: Maybe<Scalars['String']['output']>;
    /** The kind of this message. */
    kind: OperationMessageKind;
    /** The error message. */
    message: Scalars['String']['output'];
};

export type OperationMessageKind = 'ERROR' | 'INFO' | 'PERMISSION' | 'VALIDATION' | 'WARNING';

export type Ordering =
    | 'ASC'
    | 'ASC_NULLS_FIRST'
    | 'ASC_NULLS_LAST'
    | 'DESC'
    | 'DESC_NULLS_FIRST'
    | 'DESC_NULLS_LAST';

export type ParadataInput = {
    questionnaireId?: InputMaybe<Scalars['ID']['input']>;
    timeAgo: Scalars['Duration']['input'];
    value: ParadataValue;
};

export type ParadataValue =
    | {
          focus: Scalars['Boolean']['input'];
          orientation?: never;
          userAgent?: never;
          windowSize?: never;
      }
    | { focus?: never; orientation: ScreenOrientation; userAgent?: never; windowSize?: never }
    | {
          focus?: never;
          orientation?: never;
          userAgent: Scalars['String']['input'];
          windowSize?: never;
      }
    | {
          focus?: never;
          orientation?: never;
          userAgent?: never;
          windowSize: ParadataWindowSizeValue;
      };

export type ParadataWindowSizeValue = {
    height: Scalars['Int']['input'];
    width: Scalars['Int']['input'];
};

export type QnrAutocompleteList = {
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
    items: Array<QnrAutocompleteListItem>;
};

export type QnrAutocompleteListItem = {
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
    label: Scalars['String']['output'];
    value: Scalars['String']['output'];
};

export type QnrChoiceMatrixQuestionCategoryElement = {
    childrenIds: Array<Scalars['String']['output']>;
    customLabelElementId: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    types: Array<QnrElementType>;
    unitLabel: Maybe<Scalars['String']['output']>;
};

export type QnrChoiceMatrixQuestionElement = {
    categoryIds: Array<Scalars['String']['output']>;
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrChoiceOptionElement = {
    attachedOpenQuestionIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    labelPosition: QnrLabelPosition;
    types: Array<QnrElementType>;
};

export type QnrChoiceQuestionElement = {
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    types: Array<QnrElementType>;
};

export type QnrContainerElement = {
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrDifferentialQuestionElement = {
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    partIds: Array<Scalars['String']['output']>;
    types: Array<QnrElementType>;
};

export type QnrDifferentialQuestionPartElement = {
    childrenIds: Array<Scalars['String']['output']>;
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    types: Array<QnrElementType>;
};

export type QnrDoubleMatrixQuestionCategoryElement = {
    childrenIds: Array<Scalars['String']['output']>;
    customLabelElementId: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    types: Array<QnrElementType>;
    unitLabel: Maybe<Scalars['String']['output']>;
};

export type QnrDoubleMatrixQuestionElement = {
    categoryIds: Array<Scalars['String']['output']>;
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrDoubleMatrixQuestionPartElement = {
    childrenIds: Array<Scalars['String']['output']>;
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    title: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrElementType =
    | 'QnrChoiceMatrixQuestionCategoryElement'
    | 'QnrChoiceMatrixQuestionElement'
    | 'QnrChoiceOptionElement'
    | 'QnrChoiceQuestionElement'
    | 'QnrContainerElement'
    | 'QnrDifferentialQuestionElement'
    | 'QnrDifferentialQuestionPartElement'
    | 'QnrDoubleMatrixQuestionCategoryElement'
    | 'QnrDoubleMatrixQuestionElement'
    | 'QnrDoubleMatrixQuestionPartElement'
    | 'QnrFormControlElement'
    | 'QnrHtmlSectionElement'
    | 'QnrLabeledElement'
    | 'QnrMatrixQuestionBaseElement'
    | 'QnrMatrixQuestionCategoryElement'
    | 'QnrMultipleChoiceMatrixQuestionCategoryElement'
    | 'QnrMultipleChoiceMatrixQuestionElement'
    | 'QnrMultipleChoiceOptionElement'
    | 'QnrMultipleChoiceQuestionElement'
    | 'QnrOpenMatrixQuestionCategoryElement'
    | 'QnrOpenMatrixQuestionElement'
    | 'QnrOpenQuestionElement'
    | 'QnrParentElement'
    | 'QnrPlainTextSectionElement'
    | 'QnrSingleChoiceMatrixQuestionCategoryElement'
    | 'QnrSingleChoiceMatrixQuestionElement'
    | 'QnrSingleChoiceOptionElement'
    | 'QnrSingleChoiceQuestionElement'
    | 'ZfChoiceMatrixQuestionCategoryElement'
    | 'ZfChoiceOptionBaseElement'
    | 'ZfContainerElement'
    | 'ZfDifferentialQuestionElement'
    | 'ZfDifferentialQuestionPartElement'
    | 'ZfDoubleMatrixQuestionCategoryElement'
    | 'ZfDoubleMatrixQuestionElement'
    | 'ZfDoubleMatrixQuestionPartElement'
    | 'ZfElement'
    | 'ZfEpisodesBase'
    | 'ZfEpisodesCalendarElement'
    | 'ZfEpisodesTableElement'
    | 'ZfFormControlElement'
    | 'ZfHtmlSectionElement'
    | 'ZfMatrixQuestionCategoryElement'
    | 'ZfMultipleChoiceMatrixQuestionCategoryElement'
    | 'ZfMultipleChoiceMatrixQuestionElement'
    | 'ZfMultipleChoiceOptionElement'
    | 'ZfMultipleChoiceQuestionElement'
    | 'ZfOpenMatrixQuestionCategoryElement'
    | 'ZfOpenMatrixQuestionElement'
    | 'ZfOpenQuestionElement'
    | 'ZfParentElement'
    | 'ZfSingleChoiceMatrixQuestionCategoryElement'
    | 'ZfSingleChoiceMatrixQuestionElement'
    | 'ZfSingleChoiceOptionElement'
    | 'ZfSingleChoiceQuestionBaseElement'
    | 'ZfSingleChoiceQuestionElement'
    | 'ZfUnknownElement'
    | 'ZfUnmappedElement';

export type QnrFormControlElement = {
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrHasElementChildren = {
    childrenIds: Array<Scalars['String']['output']>;
};

export type QnrHtmlSectionElement = {
    html: Scalars['String']['output'];
    id: Scalars['String']['output'];
    kind: QnrTextSectionKind;
    types: Array<QnrElementType>;
};

export type QnrLabelPosition = 'left' | 'right';

export type QnrLabeledElement = {
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrMatrixQuestionBaseElement = {
    categoryIds: Array<Scalars['String']['output']>;
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrMatrixQuestionCategoryElement = {
    childrenIds: Array<Scalars['String']['output']>;
    customLabelElementId: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    types: Array<QnrElementType>;
    unitLabel: Maybe<Scalars['String']['output']>;
};

export type QnrMultipleChoiceMatrixQuestionCategoryElement = {
    childrenIds: Array<Scalars['String']['output']>;
    customLabelElementId: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    types: Array<QnrElementType>;
    unitLabel: Maybe<Scalars['String']['output']>;
};

export type QnrMultipleChoiceMatrixQuestionElement = {
    categoryIds: Array<Scalars['String']['output']>;
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrMultipleChoiceOptionElement = {
    attachedOpenQuestionIds: Array<Scalars['String']['output']>;
    exclusive: Scalars['Boolean']['output'];
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    labelPosition: QnrLabelPosition;
    types: Array<QnrElementType>;
};

export type QnrMultipleChoiceQuestionElement = {
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    types: Array<QnrElementType>;
};

export type QnrOpenMatrixQuestionCategoryElement = {
    childrenIds: Array<Scalars['String']['output']>;
    customLabelElementId: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    types: Array<QnrElementType>;
    unitLabel: Maybe<Scalars['String']['output']>;
};

export type QnrOpenMatrixQuestionElement = {
    categoryIds: Array<Scalars['String']['output']>;
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrOpenQuestionElement = {
    autocomplete: Maybe<QnrAutocompleteList>;
    childrenIds: Array<Scalars['String']['output']>;
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    initialDate: Maybe<Scalars['Date']['output']>;
    inputType: QnrOpenQuestionInputType;
    label: Scalars['String']['output'];
    placeholder: Maybe<Scalars['String']['output']>;
    postfix: Maybe<Scalars['String']['output']>;
    prefix: Maybe<Scalars['String']['output']>;
    types: Array<QnrElementType>;
    validators: Array<QnrQuestionValidator>;
};

export type QnrOpenQuestionInputType = 'DECIMAL' | 'EMAIL' | 'INTEGER' | 'TEXT' | 'YEAR_MONTH';

export type QnrParentElement = {
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrPlainTextSectionElement = {
    id: Scalars['String']['output'];
    text: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrQuestionValidator = {
    errorMessage: Scalars['String']['output'];
};

export type QnrSingleChoiceMatrixQuestionCategoryElement = {
    childrenIds: Array<Scalars['String']['output']>;
    customLabelElementId: Maybe<Scalars['String']['output']>;
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    style: QnrSingleChoiceQuestionStyle;
    types: Array<QnrElementType>;
    unitLabel: Maybe<Scalars['String']['output']>;
};

export type QnrSingleChoiceMatrixQuestionElement = {
    categoryIds: Array<Scalars['String']['output']>;
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QnrSingleChoiceOptionElement = {
    attachedOpenQuestionIds: Array<Scalars['String']['output']>;
    formValue: Scalars['String']['output'];
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    labelPosition: QnrLabelPosition;
    types: Array<QnrElementType>;
};

export type QnrSingleChoiceQuestionElement = {
    childrenIds: Array<Scalars['String']['output']>;
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    style: QnrSingleChoiceQuestionStyle;
    types: Array<QnrElementType>;
};

export type QnrSingleChoiceQuestionStyle = 'RADIO' | 'SELECT';

export type QnrTextSectionKind = 'GENERIC' | 'GENERIC_NO_SPACE' | 'INTRODUCTION' | 'QUESTION';

export type Query = {
    __typename: 'Query';
    node: Maybe<Node>;
    nodes: Array<Maybe<Node>>;
    questionnaire: Maybe<Questionnaire>;
    questionnaireFiles: Array<QuestionnaireFile>;
    questionnaireNews: Array<QuestionnaireNews>;
    questionnaires: QuestionnaireOffsetPaginated;
    user: BaseUser;
    zofarLookupExternalQuestionnaireId: Maybe<Scalars['ID']['output']>;
    zofarToken: Maybe<ZofarToken>;
};

export type QueryNodeArgs = {
    id: Scalars['ID']['input'];
};

export type QueryNodesArgs = {
    ids: Array<Scalars['ID']['input']>;
};

export type QueryQuestionnaireArgs = {
    id: Scalars['ID']['input'];
};

export type QueryQuestionnaireFilesArgs = {
    filters: InputMaybe<QuestionnaireFileFilter>;
    pagination: InputMaybe<OffsetPaginationInput>;
};

export type QueryQuestionnaireNewsArgs = {
    filters: InputMaybe<QuestionnaireNewsFilter>;
    ordering?: Array<QuestionnaireNewsOrder>;
};

export type QueryQuestionnairesArgs = {
    pagination: InputMaybe<OffsetPaginationInput>;
};

export type QueryZofarLookupExternalQuestionnaireIdArgs = {
    externalId: Scalars['String']['input'];
};

export type QueryZofarTokenArgs = {
    token?: InputMaybe<Scalars['String']['input']>;
};

export type Questionnaire = {
    currentPage: QuestionnairePage;
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    status: QuestionnaireStatus;
};

export type QuestionnaireCompletionState = 'FINISHED' | 'NEW' | 'STARTED';

export type QuestionnaireElement = {
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type QuestionnaireFile = Node & {
    __typename: 'QuestionnaireFile';
    description: Scalars['String']['output'];
    file: File;
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
    title: Scalars['String']['output'];
    type: QuestionnaireFileType;
};

export type QuestionnaireFileFilter = {
    AND?: InputMaybe<QuestionnaireFileFilter>;
    DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
    NOT?: InputMaybe<QuestionnaireFileFilter>;
    OR?: InputMaybe<QuestionnaireFileFilter>;
    type?: InputMaybe<QuestionnaireFileType>;
};

export type QuestionnaireFileType = 'FILE' | 'PRIVACY';

export type QuestionnaireFormValue = {
    __typename: 'QuestionnaireFormValue';
    formControlId: Scalars['String']['output'];
    value: Maybe<Scalars['QuestionnaireFormControlValue']['output']>;
};

export type QuestionnaireNews = Node & {
    __typename: 'QuestionnaireNews';
    content: Scalars['String']['output'];
    date: Scalars['DateTime']['output'];
    description: Scalars['String']['output'];
    expired: Scalars['Boolean']['output'];
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
    seen: Scalars['Boolean']['output'];
    title: Scalars['String']['output'];
};

export type QuestionnaireNewsFilter = {
    AND?: InputMaybe<QuestionnaireNewsFilter>;
    DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
    NOT?: InputMaybe<QuestionnaireNewsFilter>;
    OR?: InputMaybe<QuestionnaireNewsFilter>;
    expired?: InputMaybe<Scalars['Boolean']['input']>;
    seen?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuestionnaireNewsOrder =
    | { date: Ordering; title?: never }
    | { date?: never; title: Ordering };

export type QuestionnaireOffsetPaginated = {
    __typename: 'QuestionnaireOffsetPaginated';
    pageInfo: OffsetPaginationInfo;
    /** List of paginated results. */
    results: Array<Questionnaire>;
    /** Total count of existing results. */
    totalCount: Scalars['Int']['output'];
};

export type QuestionnairePage = {
    allElements: Array<QuestionnaireElement>;
    buttons: Array<QuestionnairePageButton>;
    childrenIds: Array<Scalars['String']['output']>;
    formValues: Array<QuestionnaireFormValue>;
    headerIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    layout: QuestionnairePageLayout;
    version: Scalars['Int']['output'];
};

export type QuestionnairePageButton = {
    __typename: 'QuestionnairePageButton';
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    type: QuestionnairePageButtonType;
};

export type QuestionnairePageButtonType = 'BACK' | 'CUSTOM' | 'FINISH' | 'NEXT';

export type QuestionnairePageLayout = {
    dummy: Scalars['Boolean']['output'];
};

export type QuestionnairePageLayoutBoxed = QuestionnairePageLayout & {
    __typename: 'QuestionnairePageLayoutBoxed';
    dummy: Scalars['Boolean']['output'];
    title: Scalars['String']['output'];
};

export type QuestionnairePageLayoutFull = QuestionnairePageLayout & {
    __typename: 'QuestionnairePageLayoutFull';
    dummy: Scalars['Boolean']['output'];
};

export type QuestionnaireStatus = {
    completionState: QuestionnaireCompletionState;
    firstVisit: Maybe<Scalars['DateTime']['output']>;
    hidden: Scalars['Boolean']['output'];
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
    lastVisit: Maybe<Scalars['DateTime']['output']>;
};

export type RegisterWebPushInput = {
    auth: Scalars['String']['input'];
    endpoint: Scalars['String']['input'];
    p256dh: Scalars['String']['input'];
};

export type RemoveZofarEpisodePayload = OperationInfo | ZfPage;

export type ResendAccountActivationInput =
    | { email: Scalars['String']['input']; tokenUid?: never }
    | { email?: never; tokenUid: Scalars['String']['input'] };

export type ResetPasswordInput = {
    newPassword: Scalars['String']['input'];
    token: Scalars['String']['input'];
    uid: Scalars['String']['input'];
};

export type SaveZofarEpisodePayload = OperationInfo | ZfPage;

export type ScreenOrientation = 'LANDSCAPE' | 'PORTRAIT';

export type SetQuestionnaireNewsSeenPayload = OperationInfo | QuestionnaireNews;

export type TextPatternValidator = QnrQuestionValidator & {
    __typename: 'TextPatternValidator';
    errorMessage: Scalars['String']['output'];
    flags: Scalars['String']['output'];
    pattern: Scalars['String']['output'];
};

export type UnregisterWebPushInput = {
    endpoint?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUser = {
    city?: InputMaybe<Scalars['String']['input']>;
    country?: InputMaybe<Scalars['String']['input']>;
    dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
    firstName?: InputMaybe<Scalars['String']['input']>;
    lastName?: InputMaybe<Scalars['String']['input']>;
    password?: InputMaybe<Scalars['String']['input']>;
    phone?: InputMaybe<Scalars['String']['input']>;
    street?: InputMaybe<Scalars['String']['input']>;
    zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserPayload = OperationInfo | User;

export type UpdateZofarTokenPayload = OperationInfo | ZofarToken;

export type User = BaseUser &
    Node & {
        __typename: 'User';
        city: Scalars['String']['output'];
        country: Scalars['String']['output'];
        dateOfBirth: Maybe<Scalars['Date']['output']>;
        email: Scalars['String']['output'];
        firstName: Scalars['String']['output'];
        /** The Globally Unique ID of this object */
        id: Scalars['ID']['output'];
        isAuthenticated: Scalars['Boolean']['output'];
        lastName: Scalars['String']['output'];
        phone: Scalars['String']['output'];
        street: Scalars['String']['output'];
        zipCode: Scalars['String']['output'];
    };

export type WebPushDevice = Node & {
    __typename: 'WebPushDevice';
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
};

export type ZfAutocompleteList = Node &
    QnrAutocompleteList & {
        __typename: 'ZfAutocompleteList';
        /** The Globally Unique ID of this object */
        id: Scalars['ID']['output'];
        items: Array<ZfAutocompleteListItem>;
    };

export type ZfAutocompleteListItem = Node &
    QnrAutocompleteListItem & {
        __typename: 'ZfAutocompleteListItem';
        /** The Globally Unique ID of this object */
        id: Scalars['ID']['output'];
        label: Scalars['String']['output'];
        value: Scalars['String']['output'];
    };

export type ZfChoiceMatrixQuestionCategoryElement = {
    children: Array<QuestionnaireElement>;
    childrenIds: Array<Scalars['String']['output']>;
    customLabelElementId: Maybe<Scalars['String']['output']>;
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    types: Array<QnrElementType>;
    unitLabel: Maybe<Scalars['String']['output']>;
};

export type ZfChoiceOptionBaseElement = {
    attachedOpenQuestionIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    labelPosition: QnrLabelPosition;
    types: Array<QnrElementType>;
};

export type ZfContainerElement = QnrContainerElement &
    QnrHasElementChildren &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfContainerElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfDifferentialQuestionElement = QnrDifferentialQuestionElement &
    QnrHasElementChildren &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfDifferentialQuestionElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        partIds: Array<Scalars['String']['output']>;
        types: Array<QnrElementType>;
    };

export type ZfDifferentialQuestionPartElement = QnrDifferentialQuestionPartElement &
    QnrFormControlElement &
    QnrHasElementChildren &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfDifferentialQuestionPartElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        formControlId: Scalars['String']['output'];
        id: Scalars['String']['output'];
        optionIds: Array<Scalars['String']['output']>;
        types: Array<QnrElementType>;
    };

export type ZfDoubleMatrixQuestionCategoryElement = QnrDoubleMatrixQuestionCategoryElement &
    QnrHasElementChildren &
    QnrMatrixQuestionCategoryElement &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfMatrixQuestionCategoryElement &
    ZfParentElement & {
        __typename: 'ZfDoubleMatrixQuestionCategoryElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        customLabelElementId: Maybe<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        label: Scalars['String']['output'];
        types: Array<QnrElementType>;
        unitLabel: Maybe<Scalars['String']['output']>;
    };

export type ZfDoubleMatrixQuestionElement = QnrDoubleMatrixQuestionElement &
    QnrHasElementChildren &
    QnrMatrixQuestionBaseElement &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfDoubleMatrixQuestionElement';
        categoryIds: Array<Scalars['String']['output']>;
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        titleLeft: Scalars['String']['output'];
        titleRight: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfDoubleMatrixQuestionPartElement = QnrDoubleMatrixQuestionPartElement &
    QnrFormControlElement &
    QnrHasElementChildren &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfDoubleMatrixQuestionPartElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        formControlId: Scalars['String']['output'];
        id: Scalars['String']['output'];
        title: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfElement = {
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type ZfEpisodeBoxedLayout = QuestionnairePageLayout & {
    __typename: 'ZfEpisodeBoxedLayout';
    dummy: Scalars['Boolean']['output'];
    episode: ZfEpisodeEntry;
};

export type ZfEpisodeCategory = {
    __typename: 'ZfEpisodeCategory';
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    sortIndex: Scalars['Int']['output'];
    typeIds: Array<Scalars['String']['output']>;
    types: Array<ZfEpisodeType>;
};

export type ZfEpisodeEntry = {
    __typename: 'ZfEpisodeEntry';
    allowEditDialog: Scalars['Boolean']['output'];
    badge: Maybe<Scalars['String']['output']>;
    endDate: Scalars['Date']['output'];
    episodeTypeId: Scalars['String']['output'];
    event: Scalars['Boolean']['output'];
    flags: Array<ZfEpisodeFlags>;
    gap: Scalars['Boolean']['output'];
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    startDate: Scalars['Date']['output'];
    state: ZfEpisodeState;
};

export type ZfEpisodeFlags = 'AFTER_END' | 'BEFORE_START';

export type ZfEpisodeState = 'done' | 'new' | 'updated';

export type ZfEpisodeType = {
    __typename: 'ZfEpisodeType';
    allowEvents: Scalars['Boolean']['output'];
    category: ZfEpisodeCategory;
    description: Scalars['String']['output'];
    hasDetailQuestions: Scalars['Boolean']['output'];
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
};

export type ZfEpisodesBase = {
    afterEndFieldLabel: Scalars['String']['output'];
    beforeStartFieldLabel: Scalars['String']['output'];
    cancelBtnLabel: Scalars['String']['output'];
    endFieldLabel: Scalars['String']['output'];
    entries: Array<ZfEpisodeEntry>;
    episodeCategories: Array<ZfEpisodeCategory>;
    episodeTypes: Array<ZfEpisodeType>;
    id: Scalars['String']['output'];
    maxDate: Scalars['Date']['output'];
    minDate: Scalars['Date']['output'];
    nameFieldLabel: Scalars['String']['output'];
    saveBtnLabel: Scalars['String']['output'];
    startFieldLabel: Scalars['String']['output'];
    typeFieldLabel: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type ZfEpisodesCalendarElement = QuestionnaireElement &
    ZfElement &
    ZfEpisodesBase & {
        __typename: 'ZfEpisodesCalendarElement';
        afterEndFieldLabel: Scalars['String']['output'];
        beforeStartFieldLabel: Scalars['String']['output'];
        cancelBtnLabel: Scalars['String']['output'];
        endFieldLabel: Scalars['String']['output'];
        entries: Array<ZfEpisodeEntry>;
        episodeCategories: Array<ZfEpisodeCategory>;
        episodeTypes: Array<ZfEpisodeType>;
        id: Scalars['String']['output'];
        maxDate: Scalars['Date']['output'];
        minDate: Scalars['Date']['output'];
        nameFieldLabel: Scalars['String']['output'];
        saveBtnLabel: Scalars['String']['output'];
        startFieldLabel: Scalars['String']['output'];
        typeFieldLabel: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfEpisodesTableElement = QuestionnaireElement &
    ZfElement &
    ZfEpisodesBase & {
        __typename: 'ZfEpisodesTableElement';
        afterEndFieldLabel: Scalars['String']['output'];
        beforeStartFieldLabel: Scalars['String']['output'];
        cancelBtnLabel: Scalars['String']['output'];
        endFieldLabel: Scalars['String']['output'];
        entries: Array<ZfEpisodeEntry>;
        episodeCategories: Array<ZfEpisodeCategory>;
        episodeTypes: Array<ZfEpisodeType>;
        id: Scalars['String']['output'];
        maxDate: Scalars['Date']['output'];
        minDate: Scalars['Date']['output'];
        nameFieldLabel: Scalars['String']['output'];
        saveBtnLabel: Scalars['String']['output'];
        startFieldLabel: Scalars['String']['output'];
        typeFieldLabel: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfFormControlElement = {
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type ZfFormSubmit = {
    formValues: Array<ZfFormSubmitItem>;
    questionnaireId: Scalars['ID']['input'];
    version: Scalars['Int']['input'];
};

export type ZfFormSubmitItem = {
    id: Scalars['String']['input'];
    value?: InputMaybe<Scalars['QuestionnaireFormControlValue']['input']>;
};

export type ZfGuestSessionInput = {
    token: Scalars['String']['input'];
};

export type ZfHideGapInput = {
    id: Scalars['String']['input'];
    questionnaireId: Scalars['ID']['input'];
    version: Scalars['Int']['input'];
};

export type ZfHtmlSectionElement = QnrHtmlSectionElement &
    QuestionnaireElement &
    ZfElement & {
        __typename: 'ZfHtmlSectionElement';
        html: Scalars['String']['output'];
        id: Scalars['String']['output'];
        kind: QnrTextSectionKind;
        types: Array<QnrElementType>;
    };

export type ZfMatrixQuestionCategoryElement = {
    children: Array<QuestionnaireElement>;
    childrenIds: Array<Scalars['String']['output']>;
    customLabelElementId: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    types: Array<QnrElementType>;
    unitLabel: Maybe<Scalars['String']['output']>;
};

export type ZfMultipleChoiceMatrixQuestionCategoryElement = QnrChoiceMatrixQuestionCategoryElement &
    QnrHasElementChildren &
    QnrMatrixQuestionCategoryElement &
    QnrMultipleChoiceMatrixQuestionCategoryElement &
    QnrParentElement &
    QuestionnaireElement &
    ZfChoiceMatrixQuestionCategoryElement &
    ZfElement &
    ZfMatrixQuestionCategoryElement &
    ZfParentElement & {
        __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        customLabelElementId: Maybe<Scalars['String']['output']>;
        formControlId: Scalars['String']['output'];
        id: Scalars['String']['output'];
        label: Scalars['String']['output'];
        optionIds: Array<Scalars['String']['output']>;
        types: Array<QnrElementType>;
        unitLabel: Maybe<Scalars['String']['output']>;
    };

export type ZfMultipleChoiceMatrixQuestionElement = QnrChoiceMatrixQuestionElement &
    QnrHasElementChildren &
    QnrMatrixQuestionBaseElement &
    QnrMultipleChoiceMatrixQuestionElement &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfMultipleChoiceMatrixQuestionElement';
        categoryIds: Array<Scalars['String']['output']>;
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfMultipleChoiceOptionElement = QnrChoiceOptionElement &
    QnrFormControlElement &
    QnrLabeledElement &
    QnrMultipleChoiceOptionElement &
    QuestionnaireElement &
    ZfChoiceOptionBaseElement &
    ZfElement &
    ZfFormControlElement & {
        __typename: 'ZfMultipleChoiceOptionElement';
        attachedOpenQuestionIds: Array<Scalars['String']['output']>;
        exclusive: Scalars['Boolean']['output'];
        formControlId: Scalars['String']['output'];
        id: Scalars['String']['output'];
        label: Scalars['String']['output'];
        labelPosition: QnrLabelPosition;
        types: Array<QnrElementType>;
    };

export type ZfMultipleChoiceQuestionElement = QnrChoiceQuestionElement &
    QnrHasElementChildren &
    QnrMultipleChoiceQuestionElement &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfMultipleChoiceQuestionElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        optionIds: Array<Scalars['String']['output']>;
        types: Array<QnrElementType>;
    };

export type ZfNavigateToEpisodeDetailsInput = {
    episodeId: Scalars['String']['input'];
    questionnaireId: Scalars['ID']['input'];
};

export type ZfOpenMatrixQuestionCategoryElement = QnrHasElementChildren &
    QnrMatrixQuestionCategoryElement &
    QnrOpenMatrixQuestionCategoryElement &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfMatrixQuestionCategoryElement &
    ZfParentElement & {
        __typename: 'ZfOpenMatrixQuestionCategoryElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        customLabelElementId: Maybe<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        label: Scalars['String']['output'];
        types: Array<QnrElementType>;
        unitLabel: Maybe<Scalars['String']['output']>;
    };

export type ZfOpenMatrixQuestionElement = QnrHasElementChildren &
    QnrMatrixQuestionBaseElement &
    QnrOpenMatrixQuestionElement &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfOpenMatrixQuestionElement';
        categoryIds: Array<Scalars['String']['output']>;
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfOpenQuestionElement = QnrFormControlElement &
    QnrHasElementChildren &
    QnrLabeledElement &
    QnrOpenQuestionElement &
    QnrParentElement &
    QuestionnaireElement &
    ZfElement &
    ZfFormControlElement &
    ZfParentElement & {
        __typename: 'ZfOpenQuestionElement';
        autocomplete: Maybe<ZfAutocompleteList>;
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        formControlId: Scalars['String']['output'];
        id: Scalars['String']['output'];
        initialDate: Maybe<Scalars['Date']['output']>;
        inputType: QnrOpenQuestionInputType;
        label: Scalars['String']['output'];
        placeholder: Maybe<Scalars['String']['output']>;
        postfix: Maybe<Scalars['String']['output']>;
        prefix: Maybe<Scalars['String']['output']>;
        types: Array<QnrElementType>;
        validators: Array<QnrQuestionValidator>;
    };

export type ZfPage = QnrHasElementChildren &
    QuestionnairePage & {
        __typename: 'ZfPage';
        allElements: Array<QuestionnaireElement>;
        buttons: Array<QuestionnairePageButton>;
        childrenIds: Array<Scalars['String']['output']>;
        formValues: Array<QuestionnaireFormValue>;
        headerIds: Array<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        layout: QuestionnairePageLayout;
        version: Scalars['Int']['output'];
    };

export type ZfParentElement = {
    children: Array<QuestionnaireElement>;
    childrenIds: Array<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    types: Array<QnrElementType>;
};

export type ZfQuestionnaire = Node &
    Questionnaire & {
        __typename: 'ZfQuestionnaire';
        currentPage: ZfPage;
        /** The Globally Unique ID of this object */
        id: Scalars['ID']['output'];
        name: Scalars['String']['output'];
        status: ZfQuestionnaireStatus;
    };

export type ZfQuestionnaireOffsetPaginated = {
    __typename: 'ZfQuestionnaireOffsetPaginated';
    pageInfo: OffsetPaginationInfo;
    /** List of paginated results. */
    results: Array<ZfQuestionnaire>;
    /** Total count of existing results. */
    totalCount: Scalars['Int']['output'];
};

export type ZfQuestionnaireStatus = Node &
    QuestionnaireStatus & {
        __typename: 'ZfQuestionnaireStatus';
        completionState: QuestionnaireCompletionState;
        firstVisit: Maybe<Scalars['DateTime']['output']>;
        hidden: Scalars['Boolean']['output'];
        /** The Globally Unique ID of this object */
        id: Scalars['ID']['output'];
        lastVisit: Maybe<Scalars['DateTime']['output']>;
    };

export type ZfRemoveEpisodeInput = {
    id: Scalars['String']['input'];
    questionnaireId: Scalars['ID']['input'];
    version: Scalars['Int']['input'];
};

export type ZfSaveEpisodeInput = {
    badge?: InputMaybe<Scalars['String']['input']>;
    calendarZoom?: InputMaybe<Scalars['Int']['input']>;
    end?: InputMaybe<Scalars['Date']['input']>;
    event: Scalars['Boolean']['input'];
    existingId?: InputMaybe<Scalars['String']['input']>;
    name: Scalars['String']['input'];
    questionnaireId: Scalars['ID']['input'];
    start?: InputMaybe<Scalars['Date']['input']>;
    type: Scalars['String']['input'];
    version: Scalars['Int']['input'];
};

export type ZfSingleChoiceMatrixQuestionCategoryElement = QnrChoiceMatrixQuestionCategoryElement &
    QnrFormControlElement &
    QnrHasElementChildren &
    QnrMatrixQuestionCategoryElement &
    QnrParentElement &
    QnrSingleChoiceMatrixQuestionCategoryElement &
    QuestionnaireElement &
    ZfChoiceMatrixQuestionCategoryElement &
    ZfElement &
    ZfMatrixQuestionCategoryElement &
    ZfParentElement & {
        __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        customLabelElementId: Maybe<Scalars['String']['output']>;
        formControlId: Scalars['String']['output'];
        id: Scalars['String']['output'];
        label: Scalars['String']['output'];
        optionIds: Array<Scalars['String']['output']>;
        style: QnrSingleChoiceQuestionStyle;
        types: Array<QnrElementType>;
        unitLabel: Maybe<Scalars['String']['output']>;
    };

export type ZfSingleChoiceMatrixQuestionElement = QnrChoiceMatrixQuestionElement &
    QnrHasElementChildren &
    QnrMatrixQuestionBaseElement &
    QnrParentElement &
    QnrSingleChoiceMatrixQuestionElement &
    QuestionnaireElement &
    ZfElement &
    ZfParentElement & {
        __typename: 'ZfSingleChoiceMatrixQuestionElement';
        categoryIds: Array<Scalars['String']['output']>;
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        id: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfSingleChoiceOptionElement = QnrChoiceOptionElement &
    QnrLabeledElement &
    QnrSingleChoiceOptionElement &
    QuestionnaireElement &
    ZfChoiceOptionBaseElement &
    ZfElement & {
        __typename: 'ZfSingleChoiceOptionElement';
        attachedOpenQuestionIds: Array<Scalars['String']['output']>;
        formValue: Scalars['String']['output'];
        id: Scalars['String']['output'];
        label: Scalars['String']['output'];
        labelPosition: QnrLabelPosition;
        types: Array<QnrElementType>;
    };

export type ZfSingleChoiceQuestionBaseElement = {
    children: Array<QuestionnaireElement>;
    childrenIds: Array<Scalars['String']['output']>;
    formControlId: Scalars['String']['output'];
    id: Scalars['String']['output'];
    optionIds: Array<Scalars['String']['output']>;
    style: QnrSingleChoiceQuestionStyle;
    types: Array<QnrElementType>;
};

export type ZfSingleChoiceQuestionElement = QnrChoiceQuestionElement &
    QnrFormControlElement &
    QnrHasElementChildren &
    QnrParentElement &
    QnrSingleChoiceQuestionElement &
    QuestionnaireElement &
    ZfElement &
    ZfFormControlElement &
    ZfParentElement &
    ZfSingleChoiceQuestionBaseElement & {
        __typename: 'ZfSingleChoiceQuestionElement';
        children: Array<QuestionnaireElement>;
        childrenIds: Array<Scalars['String']['output']>;
        formControlId: Scalars['String']['output'];
        id: Scalars['String']['output'];
        optionIds: Array<Scalars['String']['output']>;
        style: QnrSingleChoiceQuestionStyle;
        types: Array<QnrElementType>;
    };

export type ZfUnknownElement = QnrPlainTextSectionElement &
    QuestionnaireElement &
    ZfElement & {
        __typename: 'ZfUnknownElement';
        id: Scalars['String']['output'];
        text: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZfUnmappedElement = QnrPlainTextSectionElement &
    QuestionnaireElement &
    ZfElement & {
        __typename: 'ZfUnmappedElement';
        id: Scalars['String']['output'];
        text: Scalars['String']['output'];
        types: Array<QnrElementType>;
    };

export type ZofarBackPayload = OperationInfo | ZfPage;

export type ZofarCreateUser = {
    city?: InputMaybe<Scalars['String']['input']>;
    country?: InputMaybe<Scalars['String']['input']>;
    dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
    email: Scalars['String']['input'];
    firstName?: InputMaybe<Scalars['String']['input']>;
    lastName?: InputMaybe<Scalars['String']['input']>;
    password: Scalars['String']['input'];
    phone?: InputMaybe<Scalars['String']['input']>;
    street?: InputMaybe<Scalars['String']['input']>;
    token: Scalars['String']['input'];
    zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type ZofarNavigateToEpisodeDetailsPayload = OperationInfo | ZfPage;

export type ZofarSubmitPayload = OperationInfo | ZfPage;

export type ZofarToken = Node & {
    __typename: 'ZofarToken';
    accountState: ZofarTokenAccountState;
    hasSeenTour: Scalars['Boolean']['output'];
    /** The Globally Unique ID of this object */
    id: Scalars['ID']['output'];
    token: Scalars['String']['output'];
};

export type ZofarTokenAccountState = 'ACCOUNT' | 'NO_ACCOUNT';

export type ZofarTokenUpdate = {
    markTourSeen?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QnrDifferentialQuestionElementFragment = {
    __typename: 'ZfDifferentialQuestionElement';
    partIds: Array<string>;
} & QnrParentElement_ZfDifferentialQuestionElement_Fragment;

export type QnrDifferentialQuestionPartElementFragment = {
    __typename: 'ZfDifferentialQuestionPartElement';
    optionIds: Array<string>;
} & QnrParentElement_ZfDifferentialQuestionPartElement_Fragment &
    QnrFormControlElement_ZfDifferentialQuestionPartElement_Fragment;

export type QuestionnaireFileFragment = {
    __typename: 'QuestionnaireFile';
    id: string;
    title: string;
    description: string;
    type: QuestionnaireFileType;
    file: { __typename: 'File'; url: string; name: string };
};

export type QuestionnaireFilesQueryVariables = Exact<{
    filters?: InputMaybe<QuestionnaireFileFilter>;
    pagination?: InputMaybe<OffsetPaginationInput>;
}>;

export type QuestionnaireFilesQuery = {
    __typename: 'Query';
    questionnaireFiles: Array<{ __typename: 'QuestionnaireFile' } & QuestionnaireFileFragment>;
};

type QnrMatrixQuestionCategoryElement_ZfDoubleMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionCategoryElement';
    label: string;
    unitLabel: string | null;
    customLabelElementId: string | null;
} & QnrElementBase_ZfDoubleMatrixQuestionCategoryElement_Fragment &
    QnrParentElement_ZfDoubleMatrixQuestionCategoryElement_Fragment;

type QnrMatrixQuestionCategoryElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
    label: string;
    unitLabel: string | null;
    customLabelElementId: string | null;
} & QnrElementBase_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrParentElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment;

type QnrMatrixQuestionCategoryElement_ZfOpenMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionCategoryElement';
    label: string;
    unitLabel: string | null;
    customLabelElementId: string | null;
} & QnrElementBase_ZfOpenMatrixQuestionCategoryElement_Fragment &
    QnrParentElement_ZfOpenMatrixQuestionCategoryElement_Fragment;

type QnrMatrixQuestionCategoryElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
    label: string;
    unitLabel: string | null;
    customLabelElementId: string | null;
} & QnrElementBase_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrParentElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment;

export type QnrMatrixQuestionCategoryElementFragment =
    | QnrMatrixQuestionCategoryElement_ZfDoubleMatrixQuestionCategoryElement_Fragment
    | QnrMatrixQuestionCategoryElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrMatrixQuestionCategoryElement_ZfOpenMatrixQuestionCategoryElement_Fragment
    | QnrMatrixQuestionCategoryElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment;

type QnrMatrixQuestionElement_ZfDoubleMatrixQuestionElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionElement';
    categoryIds: Array<string>;
} & QnrElementBase_ZfDoubleMatrixQuestionElement_Fragment &
    QnrParentElement_ZfDoubleMatrixQuestionElement_Fragment;

type QnrMatrixQuestionElement_ZfMultipleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionElement';
    categoryIds: Array<string>;
} & QnrElementBase_ZfMultipleChoiceMatrixQuestionElement_Fragment &
    QnrParentElement_ZfMultipleChoiceMatrixQuestionElement_Fragment;

type QnrMatrixQuestionElement_ZfOpenMatrixQuestionElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionElement';
    categoryIds: Array<string>;
} & QnrElementBase_ZfOpenMatrixQuestionElement_Fragment &
    QnrParentElement_ZfOpenMatrixQuestionElement_Fragment;

type QnrMatrixQuestionElement_ZfSingleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionElement';
    categoryIds: Array<string>;
} & QnrElementBase_ZfSingleChoiceMatrixQuestionElement_Fragment &
    QnrParentElement_ZfSingleChoiceMatrixQuestionElement_Fragment;

export type QnrMatrixQuestionElementFragment =
    | QnrMatrixQuestionElement_ZfDoubleMatrixQuestionElement_Fragment
    | QnrMatrixQuestionElement_ZfMultipleChoiceMatrixQuestionElement_Fragment
    | QnrMatrixQuestionElement_ZfOpenMatrixQuestionElement_Fragment
    | QnrMatrixQuestionElement_ZfSingleChoiceMatrixQuestionElement_Fragment;

type QnrChoiceMatrixQuestionCategoryElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment =
    {
        __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
    } & QnrMatrixQuestionCategoryElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment;

type QnrChoiceMatrixQuestionCategoryElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
} & QnrMatrixQuestionCategoryElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment;

export type QnrChoiceMatrixQuestionCategoryElementFragment =
    | QnrChoiceMatrixQuestionCategoryElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrChoiceMatrixQuestionCategoryElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment;

type QnrChoiceMatrixQuestionElement_ZfMultipleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionElement';
} & QnrMatrixQuestionElement_ZfMultipleChoiceMatrixQuestionElement_Fragment;

type QnrChoiceMatrixQuestionElement_ZfSingleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionElement';
} & QnrMatrixQuestionElement_ZfSingleChoiceMatrixQuestionElement_Fragment;

export type QnrChoiceMatrixQuestionElementFragment =
    | QnrChoiceMatrixQuestionElement_ZfMultipleChoiceMatrixQuestionElement_Fragment
    | QnrChoiceMatrixQuestionElement_ZfSingleChoiceMatrixQuestionElement_Fragment;

export type QnrSingleChoiceMatrixQuestionCategoryElementFragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
    style: QnrSingleChoiceQuestionStyle;
    optionIds: Array<string>;
} & QnrFormControlElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrChoiceMatrixQuestionCategoryElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment;

export type QnrSingleChoiceMatrixQuestionElementFragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionElement';
} & QnrChoiceMatrixQuestionElement_ZfSingleChoiceMatrixQuestionElement_Fragment;

export type QnrMultipleChoiceMatrixQuestionCategoryElementFragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
} & QnrChoiceMatrixQuestionCategoryElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment;

export type QnrMultipleChoiceMatrixQuestionElementFragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionElement';
} & QnrChoiceMatrixQuestionElement_ZfMultipleChoiceMatrixQuestionElement_Fragment;

export type QnrDoubleMatrixQuestionCategoryElementFragment = {
    __typename: 'ZfDoubleMatrixQuestionCategoryElement';
} & QnrParentElement_ZfDoubleMatrixQuestionCategoryElement_Fragment &
    QnrMatrixQuestionCategoryElement_ZfDoubleMatrixQuestionCategoryElement_Fragment;

export type QnrDoubleMatrixQuestionPartElementFragment = {
    __typename: 'ZfDoubleMatrixQuestionPartElement';
    title: string;
} & QnrParentElement_ZfDoubleMatrixQuestionPartElement_Fragment &
    QnrFormControlElement_ZfDoubleMatrixQuestionPartElement_Fragment;

export type QnrDoubleMatrixQuestionElementFragment = {
    __typename: 'ZfDoubleMatrixQuestionElement';
} & QnrMatrixQuestionElement_ZfDoubleMatrixQuestionElement_Fragment;

export type QuestionnaireNewsDetailFragment = {
    __typename: 'QuestionnaireNews';
    id: string;
    title: string;
    description: string;
    content: string;
    date: string;
    seen: boolean;
    expired: boolean;
};

export type QuestionnaireNewsBaseFragment = {
    __typename: 'QuestionnaireNews';
    id: string;
    title: string;
    description: string;
    date: string;
    seen: boolean;
    expired: boolean;
};

export type QuestionnaireNewsQueryVariables = Exact<{
    filters: InputMaybe<QuestionnaireNewsFilter>;
    ordering: Array<QuestionnaireNewsOrder> | QuestionnaireNewsOrder;
}>;

export type QuestionnaireNewsQuery = {
    __typename: 'Query';
    questionnaireNews: Array<{ __typename: 'QuestionnaireNews' } & QuestionnaireNewsBaseFragment>;
};

export type QuestionnaireNewsNodeQueryVariables = Exact<{
    nodeId: Scalars['ID']['input'];
}>;

export type QuestionnaireNewsNodeQuery = {
    __typename: 'Query';
    node:
        | { __typename: 'AnonymousUser' }
        | { __typename: 'QuestionnaireFile' }
        | ({ __typename: 'QuestionnaireNews' } & QuestionnaireNewsDetailFragment)
        | { __typename: 'User' }
        | { __typename: 'WebPushDevice' }
        | { __typename: 'ZfAutocompleteList' }
        | { __typename: 'ZfAutocompleteListItem' }
        | { __typename: 'ZfQuestionnaire' }
        | { __typename: 'ZfQuestionnaireStatus' }
        | { __typename: 'ZofarToken' }
        | null;
};

export type SetQuestionnaireNewsSeenMutationVariables = Exact<{
    newsId: Scalars['ID']['input'];
}>;

export type SetQuestionnaireNewsSeenMutation = {
    __typename: 'Mutation';
    setQuestionnaireNewsSeen:
        | {
              __typename: 'OperationInfo';
              messages: Array<{
                  __typename: 'OperationMessage';
                  kind: OperationMessageKind;
                  message: string;
                  field: string | null;
                  code: string | null;
              }>;
          }
        | { __typename: 'QuestionnaireNews'; id: string; seen: boolean };
};

export type OperationMessageFragment = {
    __typename: 'OperationMessage';
    code: string | null;
    field: string | null;
    kind: OperationMessageKind;
    message: string;
};

export type OperationInfoFragment = {
    __typename: 'OperationInfo';
    messages: Array<{ __typename: 'OperationMessage' } & OperationMessageFragment>;
};

export type StoreParadataMutationVariables = Exact<{
    data: Array<ParadataInput> | ParadataInput;
}>;

export type StoreParadataMutation = {
    __typename: 'Mutation';
    addParadata: ({ __typename: 'OperationInfo' } & OperationInfoFragment) | null;
};

export type WebPushDeviceFragment = { __typename: 'WebPushDevice'; id: string };

export type RegisterPushNotificationsMutationVariables = Exact<{
    input: RegisterWebPushInput;
}>;

export type RegisterPushNotificationsMutation = {
    __typename: 'Mutation';
    registerWebPush: { __typename: 'WebPushDevice' } & WebPushDeviceFragment;
};

export type UnregisterPushNotificationsMutationVariables = Exact<{
    input: UnregisterWebPushInput;
}>;

export type UnregisterPushNotificationsMutation = {
    __typename: 'Mutation';
    unregisterWebPush: null | null;
};

type QnrElementBase_ZfContainerElement_Fragment = {
    __typename: 'ZfContainerElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfDifferentialQuestionElement_Fragment = {
    __typename: 'ZfDifferentialQuestionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfDifferentialQuestionPartElement_Fragment = {
    __typename: 'ZfDifferentialQuestionPartElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfDoubleMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionCategoryElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfDoubleMatrixQuestionElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfDoubleMatrixQuestionPartElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionPartElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfEpisodesCalendarElement_Fragment = {
    __typename: 'ZfEpisodesCalendarElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfEpisodesTableElement_Fragment = {
    __typename: 'ZfEpisodesTableElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfHtmlSectionElement_Fragment = {
    __typename: 'ZfHtmlSectionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfMultipleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfMultipleChoiceOptionElement_Fragment = {
    __typename: 'ZfMultipleChoiceOptionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfMultipleChoiceQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceQuestionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfOpenMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionCategoryElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfOpenMatrixQuestionElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfOpenQuestionElement_Fragment = {
    __typename: 'ZfOpenQuestionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfSingleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfSingleChoiceOptionElement_Fragment = {
    __typename: 'ZfSingleChoiceOptionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfSingleChoiceQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceQuestionElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfUnknownElement_Fragment = {
    __typename: 'ZfUnknownElement';
    id: string;
    types: Array<QnrElementType>;
};

type QnrElementBase_ZfUnmappedElement_Fragment = {
    __typename: 'ZfUnmappedElement';
    id: string;
    types: Array<QnrElementType>;
};

export type QnrElementBaseFragment =
    | QnrElementBase_ZfContainerElement_Fragment
    | QnrElementBase_ZfDifferentialQuestionElement_Fragment
    | QnrElementBase_ZfDifferentialQuestionPartElement_Fragment
    | QnrElementBase_ZfDoubleMatrixQuestionCategoryElement_Fragment
    | QnrElementBase_ZfDoubleMatrixQuestionElement_Fragment
    | QnrElementBase_ZfDoubleMatrixQuestionPartElement_Fragment
    | QnrElementBase_ZfEpisodesCalendarElement_Fragment
    | QnrElementBase_ZfEpisodesTableElement_Fragment
    | QnrElementBase_ZfHtmlSectionElement_Fragment
    | QnrElementBase_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrElementBase_ZfMultipleChoiceMatrixQuestionElement_Fragment
    | QnrElementBase_ZfMultipleChoiceOptionElement_Fragment
    | QnrElementBase_ZfMultipleChoiceQuestionElement_Fragment
    | QnrElementBase_ZfOpenMatrixQuestionCategoryElement_Fragment
    | QnrElementBase_ZfOpenMatrixQuestionElement_Fragment
    | QnrElementBase_ZfOpenQuestionElement_Fragment
    | QnrElementBase_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrElementBase_ZfSingleChoiceMatrixQuestionElement_Fragment
    | QnrElementBase_ZfSingleChoiceOptionElement_Fragment
    | QnrElementBase_ZfSingleChoiceQuestionElement_Fragment
    | QnrElementBase_ZfUnknownElement_Fragment
    | QnrElementBase_ZfUnmappedElement_Fragment;

type QnrParentElement_ZfContainerElement_Fragment = {
    __typename: 'ZfContainerElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfDifferentialQuestionElement_Fragment = {
    __typename: 'ZfDifferentialQuestionElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfDifferentialQuestionPartElement_Fragment = {
    __typename: 'ZfDifferentialQuestionPartElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfDoubleMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionCategoryElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfDoubleMatrixQuestionElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfDoubleMatrixQuestionPartElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionPartElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfMultipleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfMultipleChoiceQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceQuestionElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfOpenMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionCategoryElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfOpenMatrixQuestionElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfOpenQuestionElement_Fragment = {
    __typename: 'ZfOpenQuestionElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfSingleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionElement';
    childrenIds: Array<string>;
};

type QnrParentElement_ZfSingleChoiceQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceQuestionElement';
    childrenIds: Array<string>;
};

export type QnrParentElementFragment =
    | QnrParentElement_ZfContainerElement_Fragment
    | QnrParentElement_ZfDifferentialQuestionElement_Fragment
    | QnrParentElement_ZfDifferentialQuestionPartElement_Fragment
    | QnrParentElement_ZfDoubleMatrixQuestionCategoryElement_Fragment
    | QnrParentElement_ZfDoubleMatrixQuestionElement_Fragment
    | QnrParentElement_ZfDoubleMatrixQuestionPartElement_Fragment
    | QnrParentElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrParentElement_ZfMultipleChoiceMatrixQuestionElement_Fragment
    | QnrParentElement_ZfMultipleChoiceQuestionElement_Fragment
    | QnrParentElement_ZfOpenMatrixQuestionCategoryElement_Fragment
    | QnrParentElement_ZfOpenMatrixQuestionElement_Fragment
    | QnrParentElement_ZfOpenQuestionElement_Fragment
    | QnrParentElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrParentElement_ZfSingleChoiceMatrixQuestionElement_Fragment
    | QnrParentElement_ZfSingleChoiceQuestionElement_Fragment;

type QnrTextElement_ZfUnknownElement_Fragment = { __typename: 'ZfUnknownElement'; text: string };

type QnrTextElement_ZfUnmappedElement_Fragment = { __typename: 'ZfUnmappedElement'; text: string };

export type QnrTextElementFragment =
    | QnrTextElement_ZfUnknownElement_Fragment
    | QnrTextElement_ZfUnmappedElement_Fragment;

export type QnrHtmlElementFragment = {
    __typename: 'ZfHtmlSectionElement';
    html: string;
    kind: QnrTextSectionKind;
};

type QnrFormControlElement_ZfDifferentialQuestionPartElement_Fragment = {
    __typename: 'ZfDifferentialQuestionPartElement';
    types: Array<QnrElementType>;
    formControlId: string;
};

type QnrFormControlElement_ZfDoubleMatrixQuestionPartElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionPartElement';
    types: Array<QnrElementType>;
    formControlId: string;
};

type QnrFormControlElement_ZfMultipleChoiceOptionElement_Fragment = {
    __typename: 'ZfMultipleChoiceOptionElement';
    types: Array<QnrElementType>;
    formControlId: string;
};

type QnrFormControlElement_ZfOpenQuestionElement_Fragment = {
    __typename: 'ZfOpenQuestionElement';
    types: Array<QnrElementType>;
    formControlId: string;
};

type QnrFormControlElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
    types: Array<QnrElementType>;
    formControlId: string;
};

type QnrFormControlElement_ZfSingleChoiceQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceQuestionElement';
    types: Array<QnrElementType>;
    formControlId: string;
};

export type QnrFormControlElementFragment =
    | QnrFormControlElement_ZfDifferentialQuestionPartElement_Fragment
    | QnrFormControlElement_ZfDoubleMatrixQuestionPartElement_Fragment
    | QnrFormControlElement_ZfMultipleChoiceOptionElement_Fragment
    | QnrFormControlElement_ZfOpenQuestionElement_Fragment
    | QnrFormControlElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrFormControlElement_ZfSingleChoiceQuestionElement_Fragment;

export type AutocompleteItemFragment = {
    __typename: 'ZfAutocompleteListItem';
    id: string;
    label: string;
    value: string;
};

export type AutocompleteListFragment = {
    __typename: 'ZfAutocompleteList';
    id: string;
    items: Array<{ __typename: 'ZfAutocompleteListItem' } & AutocompleteItemFragment>;
};

type QuestionValidator_EmailValidator_Fragment = {
    __typename: 'EmailValidator';
    errorMessage: string;
};

type QuestionValidator_MaxDateValidator_Fragment = {
    __typename: 'MaxDateValidator';
    errorMessage: string;
    maxDate: string;
};

type QuestionValidator_MaxTextLengthValidator_Fragment = {
    __typename: 'MaxTextLengthValidator';
    maxLength: number;
    errorMessage: string;
};

type QuestionValidator_MaxValueValidator_Fragment = {
    __typename: 'MaxValueValidator';
    maxValue: string;
    errorMessage: string;
};

type QuestionValidator_MinDateValidator_Fragment = {
    __typename: 'MinDateValidator';
    errorMessage: string;
    minDate: string;
};

type QuestionValidator_MinValueValidator_Fragment = {
    __typename: 'MinValueValidator';
    minValue: string;
    errorMessage: string;
};

type QuestionValidator_TextPatternValidator_Fragment = {
    __typename: 'TextPatternValidator';
    pattern: string;
    flags: string;
    errorMessage: string;
};

export type QuestionValidatorFragment =
    | QuestionValidator_EmailValidator_Fragment
    | QuestionValidator_MaxDateValidator_Fragment
    | QuestionValidator_MaxTextLengthValidator_Fragment
    | QuestionValidator_MaxValueValidator_Fragment
    | QuestionValidator_MinDateValidator_Fragment
    | QuestionValidator_MinValueValidator_Fragment
    | QuestionValidator_TextPatternValidator_Fragment;

export type QnrOpenQuestionElementFragment = {
    __typename: 'ZfOpenQuestionElement';
    inputType: QnrOpenQuestionInputType;
    placeholder: string | null;
    prefix: string | null;
    postfix: string | null;
    label: string;
    initialDate: string | null;
    autocomplete: ({ __typename: 'ZfAutocompleteList' } & AutocompleteListFragment) | null;
    validators: Array<
        | ({ __typename: 'EmailValidator' } & QuestionValidator_EmailValidator_Fragment)
        | ({ __typename: 'MaxDateValidator' } & QuestionValidator_MaxDateValidator_Fragment)
        | ({
              __typename: 'MaxTextLengthValidator';
          } & QuestionValidator_MaxTextLengthValidator_Fragment)
        | ({ __typename: 'MaxValueValidator' } & QuestionValidator_MaxValueValidator_Fragment)
        | ({ __typename: 'MinDateValidator' } & QuestionValidator_MinDateValidator_Fragment)
        | ({ __typename: 'MinValueValidator' } & QuestionValidator_MinValueValidator_Fragment)
        | ({ __typename: 'TextPatternValidator' } & QuestionValidator_TextPatternValidator_Fragment)
    >;
} & QnrElementBase_ZfOpenQuestionElement_Fragment &
    QnrParentElement_ZfOpenQuestionElement_Fragment &
    QnrFormControlElement_ZfOpenQuestionElement_Fragment;

type QnrBaseChoiceOptionElement_ZfMultipleChoiceOptionElement_Fragment = {
    __typename: 'ZfMultipleChoiceOptionElement';
    label: string;
    labelPosition: QnrLabelPosition;
    attachedOpenQuestionIds: Array<string>;
} & QnrElementBase_ZfMultipleChoiceOptionElement_Fragment &
    QnrFormControlElement_ZfMultipleChoiceOptionElement_Fragment;

type QnrBaseChoiceOptionElement_ZfSingleChoiceOptionElement_Fragment = {
    __typename: 'ZfSingleChoiceOptionElement';
    label: string;
    labelPosition: QnrLabelPosition;
    attachedOpenQuestionIds: Array<string>;
} & QnrElementBase_ZfSingleChoiceOptionElement_Fragment;

export type QnrBaseChoiceOptionElementFragment =
    | QnrBaseChoiceOptionElement_ZfMultipleChoiceOptionElement_Fragment
    | QnrBaseChoiceOptionElement_ZfSingleChoiceOptionElement_Fragment;

type QnrBaseChoiceQuestionElement_ZfMultipleChoiceQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceQuestionElement';
    optionIds: Array<string>;
} & QnrElementBase_ZfMultipleChoiceQuestionElement_Fragment &
    QnrParentElement_ZfMultipleChoiceQuestionElement_Fragment;

type QnrBaseChoiceQuestionElement_ZfSingleChoiceQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceQuestionElement';
    optionIds: Array<string>;
} & QnrElementBase_ZfSingleChoiceQuestionElement_Fragment &
    QnrParentElement_ZfSingleChoiceQuestionElement_Fragment &
    QnrFormControlElement_ZfSingleChoiceQuestionElement_Fragment;

export type QnrBaseChoiceQuestionElementFragment =
    | QnrBaseChoiceQuestionElement_ZfMultipleChoiceQuestionElement_Fragment
    | QnrBaseChoiceQuestionElement_ZfSingleChoiceQuestionElement_Fragment;

export type QnrMultipleChoiceOptionElementFragment = {
    __typename: 'ZfMultipleChoiceOptionElement';
    exclusive: boolean;
} & QnrBaseChoiceOptionElement_ZfMultipleChoiceOptionElement_Fragment;

export type QnrMultipleChoiceQuestionElementFragment = {
    __typename: 'ZfMultipleChoiceQuestionElement';
} & QnrBaseChoiceQuestionElement_ZfMultipleChoiceQuestionElement_Fragment;

export type QnrSingleChoiceOptionElementFragment = {
    __typename: 'ZfSingleChoiceOptionElement';
    formValue: string;
} & QnrBaseChoiceOptionElement_ZfSingleChoiceOptionElement_Fragment;

export type QnrSingleChoiceQuestionElementFragment = {
    __typename: 'ZfSingleChoiceQuestionElement';
    style: QnrSingleChoiceQuestionStyle;
} & QnrBaseChoiceQuestionElement_ZfSingleChoiceQuestionElement_Fragment;

type QnrElement_ZfContainerElement_Fragment = {
    __typename: 'ZfContainerElement';
} & QnrElementBase_ZfContainerElement_Fragment &
    QnrParentElement_ZfContainerElement_Fragment;

type QnrElement_ZfDifferentialQuestionElement_Fragment = {
    __typename: 'ZfDifferentialQuestionElement';
} & QnrElementBase_ZfDifferentialQuestionElement_Fragment &
    QnrParentElement_ZfDifferentialQuestionElement_Fragment &
    QnrDifferentialQuestionElementFragment;

type QnrElement_ZfDifferentialQuestionPartElement_Fragment = {
    __typename: 'ZfDifferentialQuestionPartElement';
} & QnrElementBase_ZfDifferentialQuestionPartElement_Fragment &
    QnrParentElement_ZfDifferentialQuestionPartElement_Fragment &
    QnrFormControlElement_ZfDifferentialQuestionPartElement_Fragment &
    QnrDifferentialQuestionPartElementFragment;

type QnrElement_ZfDoubleMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionCategoryElement';
} & QnrElementBase_ZfDoubleMatrixQuestionCategoryElement_Fragment &
    QnrParentElement_ZfDoubleMatrixQuestionCategoryElement_Fragment &
    QnrMatrixQuestionCategoryElement_ZfDoubleMatrixQuestionCategoryElement_Fragment &
    QnrDoubleMatrixQuestionCategoryElementFragment;

type QnrElement_ZfDoubleMatrixQuestionElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionElement';
} & QnrElementBase_ZfDoubleMatrixQuestionElement_Fragment &
    QnrParentElement_ZfDoubleMatrixQuestionElement_Fragment &
    QnrMatrixQuestionElement_ZfDoubleMatrixQuestionElement_Fragment &
    QnrDoubleMatrixQuestionElementFragment;

type QnrElement_ZfDoubleMatrixQuestionPartElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionPartElement';
} & QnrElementBase_ZfDoubleMatrixQuestionPartElement_Fragment &
    QnrParentElement_ZfDoubleMatrixQuestionPartElement_Fragment &
    QnrFormControlElement_ZfDoubleMatrixQuestionPartElement_Fragment &
    QnrDoubleMatrixQuestionPartElementFragment;

type QnrElement_ZfEpisodesCalendarElement_Fragment = {
    __typename: 'ZfEpisodesCalendarElement';
} & QnrElementBase_ZfEpisodesCalendarElement_Fragment;

type QnrElement_ZfEpisodesTableElement_Fragment = {
    __typename: 'ZfEpisodesTableElement';
} & QnrElementBase_ZfEpisodesTableElement_Fragment;

type QnrElement_ZfHtmlSectionElement_Fragment = {
    __typename: 'ZfHtmlSectionElement';
} & QnrElementBase_ZfHtmlSectionElement_Fragment &
    QnrHtmlElementFragment;

type QnrElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
} & QnrElementBase_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrParentElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrMatrixQuestionCategoryElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrChoiceMatrixQuestionCategoryElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrMultipleChoiceMatrixQuestionCategoryElementFragment;

type QnrElement_ZfMultipleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionElement';
} & QnrElementBase_ZfMultipleChoiceMatrixQuestionElement_Fragment &
    QnrParentElement_ZfMultipleChoiceMatrixQuestionElement_Fragment &
    QnrMatrixQuestionElement_ZfMultipleChoiceMatrixQuestionElement_Fragment &
    QnrMultipleChoiceMatrixQuestionElementFragment;

type QnrElement_ZfMultipleChoiceOptionElement_Fragment = {
    __typename: 'ZfMultipleChoiceOptionElement';
} & QnrElementBase_ZfMultipleChoiceOptionElement_Fragment &
    QnrFormControlElement_ZfMultipleChoiceOptionElement_Fragment &
    QnrMultipleChoiceOptionElementFragment;

type QnrElement_ZfMultipleChoiceQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceQuestionElement';
} & QnrElementBase_ZfMultipleChoiceQuestionElement_Fragment &
    QnrParentElement_ZfMultipleChoiceQuestionElement_Fragment &
    QnrMultipleChoiceQuestionElementFragment;

type QnrElement_ZfOpenMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionCategoryElement';
} & QnrElementBase_ZfOpenMatrixQuestionCategoryElement_Fragment &
    QnrParentElement_ZfOpenMatrixQuestionCategoryElement_Fragment &
    QnrMatrixQuestionCategoryElement_ZfOpenMatrixQuestionCategoryElement_Fragment;

type QnrElement_ZfOpenMatrixQuestionElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionElement';
} & QnrElementBase_ZfOpenMatrixQuestionElement_Fragment &
    QnrParentElement_ZfOpenMatrixQuestionElement_Fragment &
    QnrMatrixQuestionElement_ZfOpenMatrixQuestionElement_Fragment;

type QnrElement_ZfOpenQuestionElement_Fragment = {
    __typename: 'ZfOpenQuestionElement';
} & QnrElementBase_ZfOpenQuestionElement_Fragment &
    QnrParentElement_ZfOpenQuestionElement_Fragment &
    QnrFormControlElement_ZfOpenQuestionElement_Fragment &
    QnrOpenQuestionElementFragment;

type QnrElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
} & QnrElementBase_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrParentElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrFormControlElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrMatrixQuestionCategoryElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrChoiceMatrixQuestionCategoryElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment &
    QnrSingleChoiceMatrixQuestionCategoryElementFragment;

type QnrElement_ZfSingleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionElement';
} & QnrElementBase_ZfSingleChoiceMatrixQuestionElement_Fragment &
    QnrParentElement_ZfSingleChoiceMatrixQuestionElement_Fragment &
    QnrMatrixQuestionElement_ZfSingleChoiceMatrixQuestionElement_Fragment &
    QnrSingleChoiceMatrixQuestionElementFragment;

type QnrElement_ZfSingleChoiceOptionElement_Fragment = {
    __typename: 'ZfSingleChoiceOptionElement';
} & QnrElementBase_ZfSingleChoiceOptionElement_Fragment &
    QnrSingleChoiceOptionElementFragment;

type QnrElement_ZfSingleChoiceQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceQuestionElement';
} & QnrElementBase_ZfSingleChoiceQuestionElement_Fragment &
    QnrParentElement_ZfSingleChoiceQuestionElement_Fragment &
    QnrFormControlElement_ZfSingleChoiceQuestionElement_Fragment &
    QnrSingleChoiceQuestionElementFragment;

type QnrElement_ZfUnknownElement_Fragment = {
    __typename: 'ZfUnknownElement';
} & QnrElementBase_ZfUnknownElement_Fragment &
    QnrTextElement_ZfUnknownElement_Fragment;

type QnrElement_ZfUnmappedElement_Fragment = {
    __typename: 'ZfUnmappedElement';
} & QnrElementBase_ZfUnmappedElement_Fragment &
    QnrTextElement_ZfUnmappedElement_Fragment;

export type QnrElementFragment =
    | QnrElement_ZfContainerElement_Fragment
    | QnrElement_ZfDifferentialQuestionElement_Fragment
    | QnrElement_ZfDifferentialQuestionPartElement_Fragment
    | QnrElement_ZfDoubleMatrixQuestionCategoryElement_Fragment
    | QnrElement_ZfDoubleMatrixQuestionElement_Fragment
    | QnrElement_ZfDoubleMatrixQuestionPartElement_Fragment
    | QnrElement_ZfEpisodesCalendarElement_Fragment
    | QnrElement_ZfEpisodesTableElement_Fragment
    | QnrElement_ZfHtmlSectionElement_Fragment
    | QnrElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrElement_ZfMultipleChoiceMatrixQuestionElement_Fragment
    | QnrElement_ZfMultipleChoiceOptionElement_Fragment
    | QnrElement_ZfMultipleChoiceQuestionElement_Fragment
    | QnrElement_ZfOpenMatrixQuestionCategoryElement_Fragment
    | QnrElement_ZfOpenMatrixQuestionElement_Fragment
    | QnrElement_ZfOpenQuestionElement_Fragment
    | QnrElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment
    | QnrElement_ZfSingleChoiceMatrixQuestionElement_Fragment
    | QnrElement_ZfSingleChoiceOptionElement_Fragment
    | QnrElement_ZfSingleChoiceQuestionElement_Fragment
    | QnrElement_ZfUnknownElement_Fragment
    | QnrElement_ZfUnmappedElement_Fragment;

type AnyQnrElement_ZfContainerElement_Fragment = {
    __typename: 'ZfContainerElement';
} & QnrElement_ZfContainerElement_Fragment &
    ZfElement_ZfContainerElement_Fragment;

type AnyQnrElement_ZfDifferentialQuestionElement_Fragment = {
    __typename: 'ZfDifferentialQuestionElement';
} & QnrElement_ZfDifferentialQuestionElement_Fragment &
    ZfElement_ZfDifferentialQuestionElement_Fragment;

type AnyQnrElement_ZfDifferentialQuestionPartElement_Fragment = {
    __typename: 'ZfDifferentialQuestionPartElement';
} & QnrElement_ZfDifferentialQuestionPartElement_Fragment &
    ZfElement_ZfDifferentialQuestionPartElement_Fragment;

type AnyQnrElement_ZfDoubleMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionCategoryElement';
} & QnrElement_ZfDoubleMatrixQuestionCategoryElement_Fragment &
    ZfElement_ZfDoubleMatrixQuestionCategoryElement_Fragment;

type AnyQnrElement_ZfDoubleMatrixQuestionElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionElement';
} & QnrElement_ZfDoubleMatrixQuestionElement_Fragment &
    ZfElement_ZfDoubleMatrixQuestionElement_Fragment;

type AnyQnrElement_ZfDoubleMatrixQuestionPartElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionPartElement';
} & QnrElement_ZfDoubleMatrixQuestionPartElement_Fragment &
    ZfElement_ZfDoubleMatrixQuestionPartElement_Fragment;

type AnyQnrElement_ZfEpisodesCalendarElement_Fragment = {
    __typename: 'ZfEpisodesCalendarElement';
} & QnrElement_ZfEpisodesCalendarElement_Fragment &
    ZfElement_ZfEpisodesCalendarElement_Fragment;

type AnyQnrElement_ZfEpisodesTableElement_Fragment = {
    __typename: 'ZfEpisodesTableElement';
} & QnrElement_ZfEpisodesTableElement_Fragment &
    ZfElement_ZfEpisodesTableElement_Fragment;

type AnyQnrElement_ZfHtmlSectionElement_Fragment = {
    __typename: 'ZfHtmlSectionElement';
} & QnrElement_ZfHtmlSectionElement_Fragment &
    ZfElement_ZfHtmlSectionElement_Fragment;

type AnyQnrElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
} & QnrElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment &
    ZfElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment;

type AnyQnrElement_ZfMultipleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionElement';
} & QnrElement_ZfMultipleChoiceMatrixQuestionElement_Fragment &
    ZfElement_ZfMultipleChoiceMatrixQuestionElement_Fragment;

type AnyQnrElement_ZfMultipleChoiceOptionElement_Fragment = {
    __typename: 'ZfMultipleChoiceOptionElement';
} & QnrElement_ZfMultipleChoiceOptionElement_Fragment &
    ZfElement_ZfMultipleChoiceOptionElement_Fragment;

type AnyQnrElement_ZfMultipleChoiceQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceQuestionElement';
} & QnrElement_ZfMultipleChoiceQuestionElement_Fragment &
    ZfElement_ZfMultipleChoiceQuestionElement_Fragment;

type AnyQnrElement_ZfOpenMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionCategoryElement';
} & QnrElement_ZfOpenMatrixQuestionCategoryElement_Fragment &
    ZfElement_ZfOpenMatrixQuestionCategoryElement_Fragment;

type AnyQnrElement_ZfOpenMatrixQuestionElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionElement';
} & QnrElement_ZfOpenMatrixQuestionElement_Fragment &
    ZfElement_ZfOpenMatrixQuestionElement_Fragment;

type AnyQnrElement_ZfOpenQuestionElement_Fragment = {
    __typename: 'ZfOpenQuestionElement';
} & QnrElement_ZfOpenQuestionElement_Fragment &
    ZfElement_ZfOpenQuestionElement_Fragment;

type AnyQnrElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
} & QnrElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment &
    ZfElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment;

type AnyQnrElement_ZfSingleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionElement';
} & QnrElement_ZfSingleChoiceMatrixQuestionElement_Fragment &
    ZfElement_ZfSingleChoiceMatrixQuestionElement_Fragment;

type AnyQnrElement_ZfSingleChoiceOptionElement_Fragment = {
    __typename: 'ZfSingleChoiceOptionElement';
} & QnrElement_ZfSingleChoiceOptionElement_Fragment &
    ZfElement_ZfSingleChoiceOptionElement_Fragment;

type AnyQnrElement_ZfSingleChoiceQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceQuestionElement';
} & QnrElement_ZfSingleChoiceQuestionElement_Fragment &
    ZfElement_ZfSingleChoiceQuestionElement_Fragment;

type AnyQnrElement_ZfUnknownElement_Fragment = {
    __typename: 'ZfUnknownElement';
} & QnrElement_ZfUnknownElement_Fragment &
    ZfElement_ZfUnknownElement_Fragment;

type AnyQnrElement_ZfUnmappedElement_Fragment = {
    __typename: 'ZfUnmappedElement';
} & QnrElement_ZfUnmappedElement_Fragment &
    ZfElement_ZfUnmappedElement_Fragment;

export type AnyQnrElementFragment =
    | AnyQnrElement_ZfContainerElement_Fragment
    | AnyQnrElement_ZfDifferentialQuestionElement_Fragment
    | AnyQnrElement_ZfDifferentialQuestionPartElement_Fragment
    | AnyQnrElement_ZfDoubleMatrixQuestionCategoryElement_Fragment
    | AnyQnrElement_ZfDoubleMatrixQuestionElement_Fragment
    | AnyQnrElement_ZfDoubleMatrixQuestionPartElement_Fragment
    | AnyQnrElement_ZfEpisodesCalendarElement_Fragment
    | AnyQnrElement_ZfEpisodesTableElement_Fragment
    | AnyQnrElement_ZfHtmlSectionElement_Fragment
    | AnyQnrElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment
    | AnyQnrElement_ZfMultipleChoiceMatrixQuestionElement_Fragment
    | AnyQnrElement_ZfMultipleChoiceOptionElement_Fragment
    | AnyQnrElement_ZfMultipleChoiceQuestionElement_Fragment
    | AnyQnrElement_ZfOpenMatrixQuestionCategoryElement_Fragment
    | AnyQnrElement_ZfOpenMatrixQuestionElement_Fragment
    | AnyQnrElement_ZfOpenQuestionElement_Fragment
    | AnyQnrElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment
    | AnyQnrElement_ZfSingleChoiceMatrixQuestionElement_Fragment
    | AnyQnrElement_ZfSingleChoiceOptionElement_Fragment
    | AnyQnrElement_ZfSingleChoiceQuestionElement_Fragment
    | AnyQnrElement_ZfUnknownElement_Fragment
    | AnyQnrElement_ZfUnmappedElement_Fragment;

export type QuestionnairePageButtonFragment = {
    __typename: 'QuestionnairePageButton';
    id: string;
    label: string;
    type: QuestionnairePageButtonType;
};

type QnrPageLayout_QuestionnairePageLayoutBoxed_Fragment = {
    __typename: 'QuestionnairePageLayoutBoxed';
    title: string;
};

type QnrPageLayout_QuestionnairePageLayoutFull_Fragment = {
    __typename: 'QuestionnairePageLayoutFull';
};

type QnrPageLayout_ZfEpisodeBoxedLayout_Fragment = {
    __typename: 'ZfEpisodeBoxedLayout';
    episode: { __typename: 'ZfEpisodeEntry' } & ZfEpisodeEntryFragment;
};

export type QnrPageLayoutFragment =
    | QnrPageLayout_QuestionnairePageLayoutBoxed_Fragment
    | QnrPageLayout_QuestionnairePageLayoutFull_Fragment
    | QnrPageLayout_ZfEpisodeBoxedLayout_Fragment;

export type QnrFormValueFragment = {
    __typename: 'QuestionnaireFormValue';
    formControlId: string;
    value: string | number | boolean | null | null;
};

export type QnrPageFragment = {
    __typename: 'ZfPage';
    id: string;
    version: number;
    childrenIds: Array<string>;
    headerIds: Array<string>;
    layout:
        | ({
              __typename: 'QuestionnairePageLayoutBoxed';
          } & QnrPageLayout_QuestionnairePageLayoutBoxed_Fragment)
        | ({
              __typename: 'QuestionnairePageLayoutFull';
          } & QnrPageLayout_QuestionnairePageLayoutFull_Fragment)
        | ({ __typename: 'ZfEpisodeBoxedLayout' } & QnrPageLayout_ZfEpisodeBoxedLayout_Fragment);
    allElements: Array<
        | ({ __typename: 'ZfContainerElement' } & AnyQnrElement_ZfContainerElement_Fragment)
        | ({
              __typename: 'ZfDifferentialQuestionElement';
          } & AnyQnrElement_ZfDifferentialQuestionElement_Fragment)
        | ({
              __typename: 'ZfDifferentialQuestionPartElement';
          } & AnyQnrElement_ZfDifferentialQuestionPartElement_Fragment)
        | ({
              __typename: 'ZfDoubleMatrixQuestionCategoryElement';
          } & AnyQnrElement_ZfDoubleMatrixQuestionCategoryElement_Fragment)
        | ({
              __typename: 'ZfDoubleMatrixQuestionElement';
          } & AnyQnrElement_ZfDoubleMatrixQuestionElement_Fragment)
        | ({
              __typename: 'ZfDoubleMatrixQuestionPartElement';
          } & AnyQnrElement_ZfDoubleMatrixQuestionPartElement_Fragment)
        | ({
              __typename: 'ZfEpisodesCalendarElement';
          } & AnyQnrElement_ZfEpisodesCalendarElement_Fragment)
        | ({ __typename: 'ZfEpisodesTableElement' } & AnyQnrElement_ZfEpisodesTableElement_Fragment)
        | ({ __typename: 'ZfHtmlSectionElement' } & AnyQnrElement_ZfHtmlSectionElement_Fragment)
        | ({
              __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
          } & AnyQnrElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment)
        | ({
              __typename: 'ZfMultipleChoiceMatrixQuestionElement';
          } & AnyQnrElement_ZfMultipleChoiceMatrixQuestionElement_Fragment)
        | ({
              __typename: 'ZfMultipleChoiceOptionElement';
          } & AnyQnrElement_ZfMultipleChoiceOptionElement_Fragment)
        | ({
              __typename: 'ZfMultipleChoiceQuestionElement';
          } & AnyQnrElement_ZfMultipleChoiceQuestionElement_Fragment)
        | ({
              __typename: 'ZfOpenMatrixQuestionCategoryElement';
          } & AnyQnrElement_ZfOpenMatrixQuestionCategoryElement_Fragment)
        | ({
              __typename: 'ZfOpenMatrixQuestionElement';
          } & AnyQnrElement_ZfOpenMatrixQuestionElement_Fragment)
        | ({ __typename: 'ZfOpenQuestionElement' } & AnyQnrElement_ZfOpenQuestionElement_Fragment)
        | ({
              __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
          } & AnyQnrElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment)
        | ({
              __typename: 'ZfSingleChoiceMatrixQuestionElement';
          } & AnyQnrElement_ZfSingleChoiceMatrixQuestionElement_Fragment)
        | ({
              __typename: 'ZfSingleChoiceOptionElement';
          } & AnyQnrElement_ZfSingleChoiceOptionElement_Fragment)
        | ({
              __typename: 'ZfSingleChoiceQuestionElement';
          } & AnyQnrElement_ZfSingleChoiceQuestionElement_Fragment)
        | ({ __typename: 'ZfUnknownElement' } & AnyQnrElement_ZfUnknownElement_Fragment)
        | ({ __typename: 'ZfUnmappedElement' } & AnyQnrElement_ZfUnmappedElement_Fragment)
    >;
    buttons: Array<{ __typename: 'QuestionnairePageButton' } & QuestionnairePageButtonFragment>;
    formValues: Array<{ __typename: 'QuestionnaireFormValue' } & QnrFormValueFragment>;
};

export type QuestionnaireStatusFragment = {
    __typename: 'ZfQuestionnaireStatus';
    id: string;
    completionState: QuestionnaireCompletionState;
    lastVisit: string | null;
    hidden: boolean;
};

export type QuestionnaireFragment = {
    __typename: 'ZfQuestionnaire';
    id: string;
    name: string;
    status: { __typename: 'ZfQuestionnaireStatus' } & QuestionnaireStatusFragment;
};

export type CurrentQuestionnairePageFragment = {
    __typename: 'ZfQuestionnaire';
    id: string;
    currentPage: { __typename: 'ZfPage' } & QnrPageFragment;
    status: { __typename: 'ZfQuestionnaireStatus' } & QuestionnaireStatusFragment;
};

export type QuestionnairesQueryVariables = Exact<{ [key: string]: never }>;

export type QuestionnairesQuery = {
    __typename: 'Query';
    questionnaires: {
        __typename: 'QuestionnaireOffsetPaginated';
        results: Array<{ __typename: 'ZfQuestionnaire' } & QuestionnaireFragment>;
    };
};

export type CurrentQuestionnairePageQueryVariables = Exact<{
    questionnaireId: Scalars['ID']['input'];
}>;

export type CurrentQuestionnairePageQuery = {
    __typename: 'Query';
    questionnaire: ({ __typename: 'ZfQuestionnaire' } & CurrentQuestionnairePageFragment) | null;
};

export type RefreshQuestionnaireStatusMutationVariables = Exact<{
    statusIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;

export type RefreshQuestionnaireStatusMutation = {
    __typename: 'Mutation';
    refreshQuestionnaireStatus: Array<
        { __typename: 'ZfQuestionnaireStatus' } & QuestionnaireStatusFragment
    >;
};

type CurrentUser_AnonymousUser_Fragment = {
    __typename: 'AnonymousUser';
    hasGuestSession: boolean;
    guestHasAccount: boolean;
    id: string;
    isAuthenticated: boolean;
};

type CurrentUser_User_Fragment = {
    __typename: 'User';
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    zipCode: string;
    city: string;
    country: string;
    dateOfBirth: string | null;
    phone: string;
    id: string;
    isAuthenticated: boolean;
};

export type CurrentUserFragment = CurrentUser_AnonymousUser_Fragment | CurrentUser_User_Fragment;

export type UserQueryVariables = Exact<{ [key: string]: never }>;

export type UserQuery = {
    __typename: 'Query';
    user:
        | ({ __typename: 'AnonymousUser' } & CurrentUser_AnonymousUser_Fragment)
        | ({ __typename: 'User' } & CurrentUser_User_Fragment);
};

export type LoginMutationVariables = Exact<{
    username: Scalars['String']['input'];
    password: Scalars['String']['input'];
}>;

export type LoginMutation = {
    __typename: 'Mutation';
    login:
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment)
        | ({ __typename: 'User' } & CurrentUser_User_Fragment);
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = {
    __typename: 'Mutation';
    logout: { __typename: 'AnonymousUser' } & CurrentUser_AnonymousUser_Fragment;
};

export type ResendActivationEmailMutationVariables = Exact<{
    data: ResendAccountActivationInput;
}>;

export type ResendActivationEmailMutation = {
    __typename: 'Mutation';
    resendAccountActivation: null | null;
};

export type ForgotPasswordMutationVariables = Exact<{
    email: Scalars['String']['input'];
}>;

export type ForgotPasswordMutation = { __typename: 'Mutation'; forgotPassword: null | null };

export type ResetPasswordMutationVariables = Exact<{
    uid: Scalars['String']['input'];
    token: Scalars['String']['input'];
    newPassword: Scalars['String']['input'];
}>;

export type ResetPasswordMutation = {
    __typename: 'Mutation';
    resetPassword: ({ __typename: 'OperationInfo' } & OperationInfoFragment) | null;
};

export type UpdateUserMutationVariables = Exact<{
    data: UpdateUser;
}>;

export type UpdateUserMutation = {
    __typename: 'Mutation';
    updateUser:
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment)
        | ({ __typename: 'User' } & CurrentUser_User_Fragment);
};

export type ConfirmUserAccountMutationVariables = Exact<{
    uid: Scalars['String']['input'];
    token: Scalars['String']['input'];
}>;

export type ConfirmUserAccountMutation = {
    __typename: 'Mutation';
    confirmEmail:
        | { __typename: 'ConfirmEmailSuccessResult'; activated: boolean }
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment);
};

export type TriggerEmailChangeMutationVariables = Exact<{ [key: string]: never }>;

export type TriggerEmailChangeMutation = {
    __typename: 'Mutation';
    triggerUserEmailChange: ({ __typename: 'OperationInfo' } & OperationInfoFragment) | null;
};

export type UpdateUserEmailMutationVariables = Exact<{
    uid: Scalars['String']['input'];
    token: Scalars['String']['input'];
    newEmail: Scalars['String']['input'];
}>;

export type UpdateUserEmailMutation = {
    __typename: 'Mutation';
    updateUserEmail: ({ __typename: 'OperationInfo' } & OperationInfoFragment) | null;
};

export type ZfEpisodeCategoryFragment = {
    __typename: 'ZfEpisodeCategory';
    id: string;
    label: string;
    sortIndex: number;
    typeIds: Array<string>;
};

export type ZfEpisodeTypeFragment = {
    __typename: 'ZfEpisodeType';
    id: string;
    label: string;
    description: string;
    allowEvents: boolean;
    hasDetailQuestions: boolean;
};

export type ZfEpisodeEntryFragment = {
    __typename: 'ZfEpisodeEntry';
    id: string;
    startDate: string;
    endDate: string;
    episodeTypeId: string;
    gap: boolean;
    label: string;
    flags: Array<ZfEpisodeFlags>;
    state: ZfEpisodeState;
    event: boolean;
    badge: string | null;
    allowEditDialog: boolean;
};

type ZfEpisodesBase_ZfEpisodesCalendarElement_Fragment = {
    __typename: 'ZfEpisodesCalendarElement';
    minDate: string;
    maxDate: string;
    startFieldLabel: string;
    endFieldLabel: string;
    beforeStartFieldLabel: string;
    afterEndFieldLabel: string;
    typeFieldLabel: string;
    nameFieldLabel: string;
    saveBtnLabel: string;
    cancelBtnLabel: string;
    episodeCategories: Array<{ __typename: 'ZfEpisodeCategory' } & ZfEpisodeCategoryFragment>;
    episodeTypes: Array<{ __typename: 'ZfEpisodeType' } & ZfEpisodeTypeFragment>;
    entries: Array<{ __typename: 'ZfEpisodeEntry' } & ZfEpisodeEntryFragment>;
} & QnrElementBase_ZfEpisodesCalendarElement_Fragment;

type ZfEpisodesBase_ZfEpisodesTableElement_Fragment = {
    __typename: 'ZfEpisodesTableElement';
    minDate: string;
    maxDate: string;
    startFieldLabel: string;
    endFieldLabel: string;
    beforeStartFieldLabel: string;
    afterEndFieldLabel: string;
    typeFieldLabel: string;
    nameFieldLabel: string;
    saveBtnLabel: string;
    cancelBtnLabel: string;
    episodeCategories: Array<{ __typename: 'ZfEpisodeCategory' } & ZfEpisodeCategoryFragment>;
    episodeTypes: Array<{ __typename: 'ZfEpisodeType' } & ZfEpisodeTypeFragment>;
    entries: Array<{ __typename: 'ZfEpisodeEntry' } & ZfEpisodeEntryFragment>;
} & QnrElementBase_ZfEpisodesTableElement_Fragment;

export type ZfEpisodesBaseFragment =
    | ZfEpisodesBase_ZfEpisodesCalendarElement_Fragment
    | ZfEpisodesBase_ZfEpisodesTableElement_Fragment;

export type ZfEpisodesCalendarFragment = {
    __typename: 'ZfEpisodesCalendarElement';
} & ZfEpisodesBase_ZfEpisodesCalendarElement_Fragment;

export type ZfEpisodesTableFragment = {
    __typename: 'ZfEpisodesTableElement';
} & ZfEpisodesBase_ZfEpisodesTableElement_Fragment;

type ZfElement_ZfContainerElement_Fragment = { __typename: 'ZfContainerElement' };

type ZfElement_ZfDifferentialQuestionElement_Fragment = {
    __typename: 'ZfDifferentialQuestionElement';
};

type ZfElement_ZfDifferentialQuestionPartElement_Fragment = {
    __typename: 'ZfDifferentialQuestionPartElement';
};

type ZfElement_ZfDoubleMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionCategoryElement';
};

type ZfElement_ZfDoubleMatrixQuestionElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionElement';
};

type ZfElement_ZfDoubleMatrixQuestionPartElement_Fragment = {
    __typename: 'ZfDoubleMatrixQuestionPartElement';
};

type ZfElement_ZfEpisodesCalendarElement_Fragment = {
    __typename: 'ZfEpisodesCalendarElement';
} & ZfEpisodesCalendarFragment;

type ZfElement_ZfEpisodesTableElement_Fragment = {
    __typename: 'ZfEpisodesTableElement';
} & ZfEpisodesTableFragment;

type ZfElement_ZfHtmlSectionElement_Fragment = { __typename: 'ZfHtmlSectionElement' };

type ZfElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionCategoryElement';
};

type ZfElement_ZfMultipleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceMatrixQuestionElement';
};

type ZfElement_ZfMultipleChoiceOptionElement_Fragment = {
    __typename: 'ZfMultipleChoiceOptionElement';
};

type ZfElement_ZfMultipleChoiceQuestionElement_Fragment = {
    __typename: 'ZfMultipleChoiceQuestionElement';
};

type ZfElement_ZfOpenMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfOpenMatrixQuestionCategoryElement';
};

type ZfElement_ZfOpenMatrixQuestionElement_Fragment = { __typename: 'ZfOpenMatrixQuestionElement' };

type ZfElement_ZfOpenQuestionElement_Fragment = { __typename: 'ZfOpenQuestionElement' };

type ZfElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionCategoryElement';
};

type ZfElement_ZfSingleChoiceMatrixQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceMatrixQuestionElement';
};

type ZfElement_ZfSingleChoiceOptionElement_Fragment = { __typename: 'ZfSingleChoiceOptionElement' };

type ZfElement_ZfSingleChoiceQuestionElement_Fragment = {
    __typename: 'ZfSingleChoiceQuestionElement';
};

type ZfElement_ZfUnknownElement_Fragment = { __typename: 'ZfUnknownElement' };

type ZfElement_ZfUnmappedElement_Fragment = { __typename: 'ZfUnmappedElement' };

export type ZfElementFragment =
    | ZfElement_ZfContainerElement_Fragment
    | ZfElement_ZfDifferentialQuestionElement_Fragment
    | ZfElement_ZfDifferentialQuestionPartElement_Fragment
    | ZfElement_ZfDoubleMatrixQuestionCategoryElement_Fragment
    | ZfElement_ZfDoubleMatrixQuestionElement_Fragment
    | ZfElement_ZfDoubleMatrixQuestionPartElement_Fragment
    | ZfElement_ZfEpisodesCalendarElement_Fragment
    | ZfElement_ZfEpisodesTableElement_Fragment
    | ZfElement_ZfHtmlSectionElement_Fragment
    | ZfElement_ZfMultipleChoiceMatrixQuestionCategoryElement_Fragment
    | ZfElement_ZfMultipleChoiceMatrixQuestionElement_Fragment
    | ZfElement_ZfMultipleChoiceOptionElement_Fragment
    | ZfElement_ZfMultipleChoiceQuestionElement_Fragment
    | ZfElement_ZfOpenMatrixQuestionCategoryElement_Fragment
    | ZfElement_ZfOpenMatrixQuestionElement_Fragment
    | ZfElement_ZfOpenQuestionElement_Fragment
    | ZfElement_ZfSingleChoiceMatrixQuestionCategoryElement_Fragment
    | ZfElement_ZfSingleChoiceMatrixQuestionElement_Fragment
    | ZfElement_ZfSingleChoiceOptionElement_Fragment
    | ZfElement_ZfSingleChoiceQuestionElement_Fragment
    | ZfElement_ZfUnknownElement_Fragment
    | ZfElement_ZfUnmappedElement_Fragment;

export type SubmitZofarPageMutationVariables = Exact<{
    data: ZfFormSubmit;
}>;

export type SubmitZofarPageMutation = {
    __typename: 'Mutation';
    nextPage:
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment)
        | ({ __typename: 'ZfPage' } & QnrPageFragment);
};

export type ZofarBackMutationVariables = Exact<{
    questionnaireId: Scalars['ID']['input'];
}>;

export type ZofarBackMutation = {
    __typename: 'Mutation';
    nextPage:
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment)
        | ({ __typename: 'ZfPage' } & QnrPageFragment);
};

export type ZofarSaveEpisodeMutationVariables = Exact<{
    data: ZfSaveEpisodeInput;
    continueToDetails: Scalars['Boolean']['input'];
}>;

export type ZofarSaveEpisodeMutation = {
    __typename: 'Mutation';
    nextPage:
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment)
        | ({ __typename: 'ZfPage' } & QnrPageFragment);
};

export type ZofarNavigateToEpisodeMutationVariables = Exact<{
    data: ZfNavigateToEpisodeDetailsInput;
}>;

export type ZofarNavigateToEpisodeMutation = {
    __typename: 'Mutation';
    nextPage:
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment)
        | ({ __typename: 'ZfPage' } & QnrPageFragment);
};

export type ZofarRemoveEpisodeMutationVariables = Exact<{
    data: ZfRemoveEpisodeInput;
}>;

export type ZofarRemoveEpisodeMutation = {
    __typename: 'Mutation';
    nextPage:
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment)
        | ({ __typename: 'ZfPage' } & QnrPageFragment);
};

export type ZofarHideGapMutationVariables = Exact<{
    data: ZfHideGapInput;
}>;

export type ZofarHideGapMutation = {
    __typename: 'Mutation';
    nextPage:
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment)
        | ({ __typename: 'ZfPage' } & QnrPageFragment);
};

export type ZofarGuestSessionMutationVariables = Exact<{
    data: ZfGuestSessionInput;
}>;

export type ZofarGuestSessionMutation = {
    __typename: 'Mutation';
    activateZofarGuestSession:
        | ({ __typename: 'AnonymousUser' } & CurrentUser_AnonymousUser_Fragment)
        | ({ __typename: 'OperationInfo' } & OperationInfoFragment);
};

export type ZofarRegisterMutationVariables = Exact<{
    data: ZofarCreateUser;
}>;

export type ZofarRegisterMutation = {
    __typename: 'Mutation';
    zofarRegister: ({ __typename: 'OperationInfo' } & OperationInfoFragment) | null;
};

export type ZofarTokenAccountStateFragment = {
    __typename: 'ZofarToken';
    id: string;
    accountState: ZofarTokenAccountState;
};

export type ZofarTokenAccountStateQueryVariables = Exact<{
    token: Scalars['String']['input'];
}>;

export type ZofarTokenAccountStateQuery = {
    __typename: 'Query';
    zofarToken: ({ __typename: 'ZofarToken' } & ZofarTokenAccountStateFragment) | null;
};

export type ZofarTokenTourFragment = { __typename: 'ZofarToken'; id: string; hasSeenTour: boolean };

export type ZofarTokenTourStateQueryVariables = Exact<{ [key: string]: never }>;

export type ZofarTokenTourStateQuery = {
    __typename: 'Query';
    zofarToken: ({ __typename: 'ZofarToken' } & ZofarTokenTourFragment) | null;
};

export type MarkTourSeenMutationVariables = Exact<{ [key: string]: never }>;

export type MarkTourSeenMutation = {
    __typename: 'Mutation';
    updateZofarToken:
        | { __typename: 'OperationInfo' }
        | ({ __typename: 'ZofarToken' } & ZofarTokenTourFragment);
};

export type FindQuestionnaireFromExternalQueryVariables = Exact<{
    externalId: Scalars['String']['input'];
}>;

export type FindQuestionnaireFromExternalQuery = {
    __typename: 'Query';
    zofarLookupExternalQuestionnaireId: string | null;
};

export const QuestionnaireFileFragmentDoc = gql`
    fragment QuestionnaireFile on QuestionnaireFile {
        id
        title
        description
        file {
            url
            name
        }
        type
    }
`;
export const QuestionnaireNewsDetailFragmentDoc = gql`
    fragment QuestionnaireNewsDetail on QuestionnaireNews {
        id
        title
        description
        content
        date
        seen
        expired
    }
`;
export const QuestionnaireNewsBaseFragmentDoc = gql`
    fragment QuestionnaireNewsBase on QuestionnaireNews {
        id
        title
        description
        date
        seen
        expired
    }
`;
export const OperationMessageFragmentDoc = gql`
    fragment OperationMessage on OperationMessage {
        code
        field
        kind
        message
    }
`;
export const OperationInfoFragmentDoc = gql`
    fragment OperationInfo on OperationInfo {
        messages {
            ...OperationMessage
        }
    }
    ${OperationMessageFragmentDoc}
`;
export const WebPushDeviceFragmentDoc = gql`
    fragment WebPushDevice on WebPushDevice {
        id
    }
`;
export const QuestionnaireStatusFragmentDoc = gql`
    fragment QuestionnaireStatus on QuestionnaireStatus {
        id
        completionState
        lastVisit
        hidden
    }
`;
export const QuestionnaireFragmentDoc = gql`
    fragment Questionnaire on Questionnaire {
        id
        name
        status {
            ...QuestionnaireStatus
        }
    }
    ${QuestionnaireStatusFragmentDoc}
`;
export const ZfEpisodeEntryFragmentDoc = gql`
    fragment ZfEpisodeEntry on ZfEpisodeEntry {
        id
        startDate
        endDate
        episodeTypeId
        gap
        label
        flags
        state
        event
        badge
        allowEditDialog
    }
`;
export const QnrPageLayoutFragmentDoc = gql`
    fragment QnrPageLayout on QuestionnairePageLayout {
        __typename
        ... on QuestionnairePageLayoutBoxed {
            title
        }
        ... on ZfEpisodeBoxedLayout {
            episode {
                ...ZfEpisodeEntry
            }
        }
    }
    ${ZfEpisodeEntryFragmentDoc}
`;
export const QnrElementBaseFragmentDoc = gql`
    fragment QnrElementBase on QuestionnaireElement {
        id
        types
    }
`;
export const QnrParentElementFragmentDoc = gql`
    fragment QnrParentElement on QnrParentElement {
        childrenIds
    }
`;
export const QnrTextElementFragmentDoc = gql`
    fragment QnrTextElement on QnrPlainTextSectionElement {
        text
    }
`;
export const QnrHtmlElementFragmentDoc = gql`
    fragment QnrHtmlElement on QnrHtmlSectionElement {
        html
        kind
    }
`;
export const QnrFormControlElementFragmentDoc = gql`
    fragment QnrFormControlElement on QnrFormControlElement {
        types
        formControlId
    }
`;
export const QnrBaseChoiceQuestionElementFragmentDoc = gql`
    fragment QnrBaseChoiceQuestionElement on QnrChoiceQuestionElement {
        ...QnrElementBase
        ...QnrParentElement
        ...QnrFormControlElement
        optionIds
    }
    ${QnrElementBaseFragmentDoc}
    ${QnrParentElementFragmentDoc}
    ${QnrFormControlElementFragmentDoc}
`;
export const QnrMultipleChoiceQuestionElementFragmentDoc = gql`
    fragment QnrMultipleChoiceQuestionElement on QnrMultipleChoiceQuestionElement {
        ...QnrBaseChoiceQuestionElement
    }
    ${QnrBaseChoiceQuestionElementFragmentDoc}
`;
export const QnrBaseChoiceOptionElementFragmentDoc = gql`
    fragment QnrBaseChoiceOptionElement on QnrChoiceOptionElement {
        ...QnrElementBase
        ...QnrFormControlElement
        label
        labelPosition
        attachedOpenQuestionIds
    }
    ${QnrElementBaseFragmentDoc}
    ${QnrFormControlElementFragmentDoc}
`;
export const QnrMultipleChoiceOptionElementFragmentDoc = gql`
    fragment QnrMultipleChoiceOptionElement on QnrMultipleChoiceOptionElement {
        ...QnrBaseChoiceOptionElement
        exclusive
    }
    ${QnrBaseChoiceOptionElementFragmentDoc}
`;
export const QnrSingleChoiceQuestionElementFragmentDoc = gql`
    fragment QnrSingleChoiceQuestionElement on QnrSingleChoiceQuestionElement {
        ...QnrBaseChoiceQuestionElement
        style
    }
    ${QnrBaseChoiceQuestionElementFragmentDoc}
`;
export const QnrSingleChoiceOptionElementFragmentDoc = gql`
    fragment QnrSingleChoiceOptionElement on QnrSingleChoiceOptionElement {
        ...QnrBaseChoiceOptionElement
        formValue
    }
    ${QnrBaseChoiceOptionElementFragmentDoc}
`;
export const AutocompleteItemFragmentDoc = gql`
    fragment AutocompleteItem on QnrAutocompleteListItem {
        id
        label
        value
    }
`;
export const AutocompleteListFragmentDoc = gql`
    fragment AutocompleteList on QnrAutocompleteList {
        id
        items {
            ...AutocompleteItem
        }
    }
    ${AutocompleteItemFragmentDoc}
`;
export const QuestionValidatorFragmentDoc = gql`
    fragment QuestionValidator on QnrQuestionValidator {
        errorMessage
        __typename
        ... on MinValueValidator {
            minValue
        }
        ... on MaxValueValidator {
            maxValue
        }
        ... on MaxTextLengthValidator {
            maxLength
        }
        ... on TextPatternValidator {
            pattern
            flags
        }
        ... on MinDateValidator {
            minDate: minValue
        }
        ... on MaxDateValidator {
            maxDate: maxValue
        }
    }
`;
export const QnrOpenQuestionElementFragmentDoc = gql`
    fragment QnrOpenQuestionElement on QnrOpenQuestionElement {
        ...QnrElementBase
        ...QnrParentElement
        ...QnrFormControlElement
        autocomplete {
            ...AutocompleteList
        }
        inputType
        validators {
            ...QuestionValidator
        }
        placeholder
        prefix
        postfix
        label
        initialDate
    }
    ${QnrElementBaseFragmentDoc}
    ${QnrParentElementFragmentDoc}
    ${QnrFormControlElementFragmentDoc}
    ${AutocompleteListFragmentDoc}
    ${QuestionValidatorFragmentDoc}
`;
export const QnrMatrixQuestionElementFragmentDoc = gql`
    fragment QnrMatrixQuestionElement on QnrMatrixQuestionBaseElement {
        ...QnrElementBase
        ...QnrParentElement
        categoryIds
    }
    ${QnrElementBaseFragmentDoc}
    ${QnrParentElementFragmentDoc}
`;
export const QnrMatrixQuestionCategoryElementFragmentDoc = gql`
    fragment QnrMatrixQuestionCategoryElement on QnrMatrixQuestionCategoryElement {
        ...QnrElementBase
        ...QnrParentElement
        label
        unitLabel
        customLabelElementId
    }
    ${QnrElementBaseFragmentDoc}
    ${QnrParentElementFragmentDoc}
`;
export const QnrChoiceMatrixQuestionCategoryElementFragmentDoc = gql`
    fragment QnrChoiceMatrixQuestionCategoryElement on QnrChoiceMatrixQuestionCategoryElement {
        ...QnrMatrixQuestionCategoryElement
    }
    ${QnrMatrixQuestionCategoryElementFragmentDoc}
`;
export const QnrChoiceMatrixQuestionElementFragmentDoc = gql`
    fragment QnrChoiceMatrixQuestionElement on QnrChoiceMatrixQuestionElement {
        ...QnrMatrixQuestionElement
    }
    ${QnrMatrixQuestionElementFragmentDoc}
`;
export const QnrSingleChoiceMatrixQuestionElementFragmentDoc = gql`
    fragment QnrSingleChoiceMatrixQuestionElement on QnrSingleChoiceMatrixQuestionElement {
        ...QnrChoiceMatrixQuestionElement
    }
    ${QnrChoiceMatrixQuestionElementFragmentDoc}
`;
export const QnrSingleChoiceMatrixQuestionCategoryElementFragmentDoc = gql`
    fragment QnrSingleChoiceMatrixQuestionCategoryElement on QnrSingleChoiceMatrixQuestionCategoryElement {
        ...QnrFormControlElement
        ...QnrChoiceMatrixQuestionCategoryElement
        style
        optionIds
    }
    ${QnrFormControlElementFragmentDoc}
    ${QnrChoiceMatrixQuestionCategoryElementFragmentDoc}
`;
export const QnrMultipleChoiceMatrixQuestionElementFragmentDoc = gql`
    fragment QnrMultipleChoiceMatrixQuestionElement on QnrMultipleChoiceMatrixQuestionElement {
        ...QnrChoiceMatrixQuestionElement
    }
    ${QnrChoiceMatrixQuestionElementFragmentDoc}
`;
export const QnrMultipleChoiceMatrixQuestionCategoryElementFragmentDoc = gql`
    fragment QnrMultipleChoiceMatrixQuestionCategoryElement on QnrMultipleChoiceMatrixQuestionCategoryElement {
        ...QnrChoiceMatrixQuestionCategoryElement
    }
    ${QnrChoiceMatrixQuestionCategoryElementFragmentDoc}
`;
export const QnrDoubleMatrixQuestionElementFragmentDoc = gql`
    fragment QnrDoubleMatrixQuestionElement on QnrDoubleMatrixQuestionElement {
        ...QnrMatrixQuestionElement
    }
    ${QnrMatrixQuestionElementFragmentDoc}
`;
export const QnrDoubleMatrixQuestionCategoryElementFragmentDoc = gql`
    fragment QnrDoubleMatrixQuestionCategoryElement on QnrDoubleMatrixQuestionCategoryElement {
        ...QnrParentElement
        ...QnrMatrixQuestionCategoryElement
    }
    ${QnrParentElementFragmentDoc}
    ${QnrMatrixQuestionCategoryElementFragmentDoc}
`;
export const QnrDoubleMatrixQuestionPartElementFragmentDoc = gql`
    fragment QnrDoubleMatrixQuestionPartElement on QnrDoubleMatrixQuestionPartElement {
        ...QnrParentElement
        ...QnrFormControlElement
        title
    }
    ${QnrParentElementFragmentDoc}
    ${QnrFormControlElementFragmentDoc}
`;
export const QnrDifferentialQuestionElementFragmentDoc = gql`
    fragment QnrDifferentialQuestionElement on QnrDifferentialQuestionElement {
        ...QnrParentElement
        partIds
    }
    ${QnrParentElementFragmentDoc}
`;
export const QnrDifferentialQuestionPartElementFragmentDoc = gql`
    fragment QnrDifferentialQuestionPartElement on QnrDifferentialQuestionPartElement {
        ...QnrParentElement
        ...QnrFormControlElement
        optionIds
    }
    ${QnrParentElementFragmentDoc}
    ${QnrFormControlElementFragmentDoc}
`;
export const QnrElementFragmentDoc = gql`
    fragment QnrElement on QuestionnaireElement {
        ...QnrElementBase
        ...QnrParentElement
        ...QnrTextElement
        ...QnrHtmlElement
        ...QnrFormControlElement
        ...QnrMultipleChoiceQuestionElement
        ...QnrMultipleChoiceOptionElement
        ...QnrSingleChoiceQuestionElement
        ...QnrSingleChoiceOptionElement
        ...QnrOpenQuestionElement
        ...QnrMatrixQuestionElement
        ...QnrMatrixQuestionCategoryElement
        ...QnrChoiceMatrixQuestionCategoryElement
        ...QnrSingleChoiceMatrixQuestionElement
        ...QnrSingleChoiceMatrixQuestionCategoryElement
        ...QnrMultipleChoiceMatrixQuestionElement
        ...QnrMultipleChoiceMatrixQuestionCategoryElement
        ...QnrDoubleMatrixQuestionElement
        ...QnrDoubleMatrixQuestionCategoryElement
        ...QnrDoubleMatrixQuestionPartElement
        ...QnrDifferentialQuestionElement
        ...QnrDifferentialQuestionPartElement
    }
    ${QnrElementBaseFragmentDoc}
    ${QnrParentElementFragmentDoc}
    ${QnrTextElementFragmentDoc}
    ${QnrHtmlElementFragmentDoc}
    ${QnrFormControlElementFragmentDoc}
    ${QnrMultipleChoiceQuestionElementFragmentDoc}
    ${QnrMultipleChoiceOptionElementFragmentDoc}
    ${QnrSingleChoiceQuestionElementFragmentDoc}
    ${QnrSingleChoiceOptionElementFragmentDoc}
    ${QnrOpenQuestionElementFragmentDoc}
    ${QnrMatrixQuestionElementFragmentDoc}
    ${QnrMatrixQuestionCategoryElementFragmentDoc}
    ${QnrChoiceMatrixQuestionCategoryElementFragmentDoc}
    ${QnrSingleChoiceMatrixQuestionElementFragmentDoc}
    ${QnrSingleChoiceMatrixQuestionCategoryElementFragmentDoc}
    ${QnrMultipleChoiceMatrixQuestionElementFragmentDoc}
    ${QnrMultipleChoiceMatrixQuestionCategoryElementFragmentDoc}
    ${QnrDoubleMatrixQuestionElementFragmentDoc}
    ${QnrDoubleMatrixQuestionCategoryElementFragmentDoc}
    ${QnrDoubleMatrixQuestionPartElementFragmentDoc}
    ${QnrDifferentialQuestionElementFragmentDoc}
    ${QnrDifferentialQuestionPartElementFragmentDoc}
`;
export const ZfEpisodeCategoryFragmentDoc = gql`
    fragment ZfEpisodeCategory on ZfEpisodeCategory {
        id
        label
        sortIndex
        typeIds
    }
`;
export const ZfEpisodeTypeFragmentDoc = gql`
    fragment ZfEpisodeType on ZfEpisodeType {
        id
        label
        description
        allowEvents
        hasDetailQuestions
    }
`;
export const ZfEpisodesBaseFragmentDoc = gql`
    fragment ZfEpisodesBase on ZfEpisodesBase {
        ...QnrElementBase
        episodeCategories {
            ...ZfEpisodeCategory
        }
        episodeTypes {
            ...ZfEpisodeType
        }
        entries {
            ...ZfEpisodeEntry
        }
        minDate
        maxDate
        startFieldLabel
        endFieldLabel
        beforeStartFieldLabel
        afterEndFieldLabel
        typeFieldLabel
        nameFieldLabel
        saveBtnLabel
        cancelBtnLabel
    }
    ${QnrElementBaseFragmentDoc}
    ${ZfEpisodeCategoryFragmentDoc}
    ${ZfEpisodeTypeFragmentDoc}
    ${ZfEpisodeEntryFragmentDoc}
`;
export const ZfEpisodesCalendarFragmentDoc = gql`
    fragment ZfEpisodesCalendar on ZfEpisodesCalendarElement {
        ...ZfEpisodesBase
    }
    ${ZfEpisodesBaseFragmentDoc}
`;
export const ZfEpisodesTableFragmentDoc = gql`
    fragment ZfEpisodesTable on ZfEpisodesTableElement {
        ...ZfEpisodesBase
    }
    ${ZfEpisodesBaseFragmentDoc}
`;
export const ZfElementFragmentDoc = gql`
    fragment ZfElement on ZfElement {
        ...ZfEpisodesCalendar
        ...ZfEpisodesTable
    }
    ${ZfEpisodesCalendarFragmentDoc}
    ${ZfEpisodesTableFragmentDoc}
`;
export const AnyQnrElementFragmentDoc = gql`
    fragment AnyQnrElement on QuestionnaireElement {
        ...QnrElement
        ...ZfElement
    }
    ${QnrElementFragmentDoc}
    ${ZfElementFragmentDoc}
`;
export const QuestionnairePageButtonFragmentDoc = gql`
    fragment QuestionnairePageButton on QuestionnairePageButton {
        id
        label
        type
    }
`;
export const QnrFormValueFragmentDoc = gql`
    fragment QnrFormValue on QuestionnaireFormValue {
        formControlId
        value
    }
`;
export const QnrPageFragmentDoc = gql`
    fragment QnrPage on QuestionnairePage {
        id
        version
        layout {
            ...QnrPageLayout
        }
        allElements {
            ...AnyQnrElement
        }
        childrenIds
        headerIds
        buttons {
            ...QuestionnairePageButton
        }
        formValues {
            ...QnrFormValue
        }
    }
    ${QnrPageLayoutFragmentDoc}
    ${AnyQnrElementFragmentDoc}
    ${QuestionnairePageButtonFragmentDoc}
    ${QnrFormValueFragmentDoc}
`;
export const CurrentQuestionnairePageFragmentDoc = gql`
    fragment CurrentQuestionnairePage on Questionnaire {
        id
        currentPage {
            ...QnrPage
        }
        status {
            ...QuestionnaireStatus
        }
    }
    ${QnrPageFragmentDoc}
    ${QuestionnaireStatusFragmentDoc}
`;
export const CurrentUserFragmentDoc = gql`
    fragment CurrentUser on BaseUser {
        id
        isAuthenticated
        ... on User {
            email
            firstName
            lastName
            street
            zipCode
            city
            country
            dateOfBirth
            phone
        }
        ... on AnonymousUser {
            hasGuestSession
            guestHasAccount
        }
    }
`;
export const ZofarTokenAccountStateFragmentDoc = gql`
    fragment ZofarTokenAccountState on ZofarToken {
        id
        accountState
    }
`;
export const ZofarTokenTourFragmentDoc = gql`
    fragment ZofarTokenTour on ZofarToken {
        id
        hasSeenTour
    }
`;
export const QuestionnaireFilesDocument = gql`
    query questionnaireFiles(
        $filters: QuestionnaireFileFilter = null
        $pagination: OffsetPaginationInput = null
    ) {
        questionnaireFiles(filters: $filters, pagination: $pagination) {
            ...QuestionnaireFile
        }
    }
    ${QuestionnaireFileFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class QuestionnaireFilesGQL extends Apollo.Query<
    QuestionnaireFilesQuery,
    QuestionnaireFilesQueryVariables
> {
    override document = QuestionnaireFilesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const QuestionnaireNewsDocument = gql`
    query QuestionnaireNews(
        $filters: QuestionnaireNewsFilter
        $ordering: [QuestionnaireNewsOrder!]!
    ) {
        questionnaireNews(ordering: $ordering, filters: $filters) {
            ... on QuestionnaireNews {
                ...QuestionnaireNewsBase
            }
        }
    }
    ${QuestionnaireNewsBaseFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class QuestionnaireNewsGQL extends Apollo.Query<
    QuestionnaireNewsQuery,
    QuestionnaireNewsQueryVariables
> {
    override document = QuestionnaireNewsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const QuestionnaireNewsNodeDocument = gql`
    query QuestionnaireNewsNode($nodeId: ID!) {
        node(id: $nodeId) {
            ... on QuestionnaireNews {
                ...QuestionnaireNewsDetail
            }
        }
    }
    ${QuestionnaireNewsDetailFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class QuestionnaireNewsNodeGQL extends Apollo.Query<
    QuestionnaireNewsNodeQuery,
    QuestionnaireNewsNodeQueryVariables
> {
    override document = QuestionnaireNewsNodeDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SetQuestionnaireNewsSeenDocument = gql`
    mutation SetQuestionnaireNewsSeen($newsId: ID!) {
        setQuestionnaireNewsSeen(newsId: $newsId) {
            ... on QuestionnaireNews {
                id
                seen
            }
            ... on OperationInfo {
                messages {
                    kind
                    message
                    field
                    code
                }
            }
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class SetQuestionnaireNewsSeenGQL extends Apollo.Mutation<
    SetQuestionnaireNewsSeenMutation,
    SetQuestionnaireNewsSeenMutationVariables
> {
    override document = SetQuestionnaireNewsSeenDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const StoreParadataDocument = gql`
    mutation storeParadata($data: [ParadataInput!]!) {
        addParadata(data: $data) {
            ...OperationInfo
        }
    }
    ${OperationInfoFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class StoreParadataGQL extends Apollo.Mutation<
    StoreParadataMutation,
    StoreParadataMutationVariables
> {
    override document = StoreParadataDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const RegisterPushNotificationsDocument = gql`
    mutation registerPushNotifications($input: RegisterWebPushInput!) {
        registerWebPush(input: $input) {
            ...WebPushDevice
        }
    }
    ${WebPushDeviceFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class RegisterPushNotificationsGQL extends Apollo.Mutation<
    RegisterPushNotificationsMutation,
    RegisterPushNotificationsMutationVariables
> {
    override document = RegisterPushNotificationsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UnregisterPushNotificationsDocument = gql`
    mutation unregisterPushNotifications($input: UnregisterWebPushInput!) {
        unregisterWebPush(input: $input)
    }
`;

@Injectable({
    providedIn: 'root',
})
export class UnregisterPushNotificationsGQL extends Apollo.Mutation<
    UnregisterPushNotificationsMutation,
    UnregisterPushNotificationsMutationVariables
> {
    override document = UnregisterPushNotificationsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const QuestionnairesDocument = gql`
    query questionnaires {
        questionnaires {
            results {
                ...Questionnaire
            }
        }
    }
    ${QuestionnaireFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class QuestionnairesGQL extends Apollo.Query<
    QuestionnairesQuery,
    QuestionnairesQueryVariables
> {
    override document = QuestionnairesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const CurrentQuestionnairePageDocument = gql`
    query currentQuestionnairePage($questionnaireId: ID!) {
        questionnaire(id: $questionnaireId) {
            ...CurrentQuestionnairePage
        }
    }
    ${CurrentQuestionnairePageFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class CurrentQuestionnairePageGQL extends Apollo.Query<
    CurrentQuestionnairePageQuery,
    CurrentQuestionnairePageQueryVariables
> {
    override document = CurrentQuestionnairePageDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const RefreshQuestionnaireStatusDocument = gql`
    mutation refreshQuestionnaireStatus($statusIds: [ID!]!) {
        refreshQuestionnaireStatus(statusIds: $statusIds) {
            ...QuestionnaireStatus
        }
    }
    ${QuestionnaireStatusFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class RefreshQuestionnaireStatusGQL extends Apollo.Mutation<
    RefreshQuestionnaireStatusMutation,
    RefreshQuestionnaireStatusMutationVariables
> {
    override document = RefreshQuestionnaireStatusDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UserDocument = gql`
    query User {
        user {
            ...CurrentUser
        }
    }
    ${CurrentUserFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class UserGQL extends Apollo.Query<UserQuery, UserQueryVariables> {
    override document = UserDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ...OperationInfo
            ...CurrentUser
        }
    }
    ${OperationInfoFragmentDoc}
    ${CurrentUserFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    override document = LoginDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const LogoutDocument = gql`
    mutation logout {
        logout {
            ...CurrentUser
        }
    }
    ${CurrentUserFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class LogoutGQL extends Apollo.Mutation<LogoutMutation, LogoutMutationVariables> {
    override document = LogoutDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ResendActivationEmailDocument = gql`
    mutation resendActivationEmail($data: ResendAccountActivationInput!) {
        resendAccountActivation(data: $data)
    }
`;

@Injectable({
    providedIn: 'root',
})
export class ResendActivationEmailGQL extends Apollo.Mutation<
    ResendActivationEmailMutation,
    ResendActivationEmailMutationVariables
> {
    override document = ResendActivationEmailDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordGQL extends Apollo.Mutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
> {
    override document = ForgotPasswordDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ResetPasswordDocument = gql`
    mutation resetPassword($uid: String!, $token: String!, $newPassword: String!) {
        resetPassword(input: { uid: $uid, token: $token, newPassword: $newPassword }) {
            ...OperationInfo
        }
    }
    ${OperationInfoFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ResetPasswordGQL extends Apollo.Mutation<
    ResetPasswordMutation,
    ResetPasswordMutationVariables
> {
    override document = ResetPasswordDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UpdateUserDocument = gql`
    mutation updateUser($data: UpdateUser!) {
        updateUser(data: $data) {
            ...OperationInfo
            ...CurrentUser
        }
    }
    ${OperationInfoFragmentDoc}
    ${CurrentUserFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class UpdateUserGQL extends Apollo.Mutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
> {
    override document = UpdateUserDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ConfirmUserAccountDocument = gql`
    mutation confirmUserAccount($uid: String!, $token: String!) {
        confirmEmail(uid: $uid, token: $token) {
            ...OperationInfo
            ... on ConfirmEmailSuccessResult {
                activated
            }
        }
    }
    ${OperationInfoFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ConfirmUserAccountGQL extends Apollo.Mutation<
    ConfirmUserAccountMutation,
    ConfirmUserAccountMutationVariables
> {
    override document = ConfirmUserAccountDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const TriggerEmailChangeDocument = gql`
    mutation triggerEmailChange {
        triggerUserEmailChange {
            ...OperationInfo
        }
    }
    ${OperationInfoFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class TriggerEmailChangeGQL extends Apollo.Mutation<
    TriggerEmailChangeMutation,
    TriggerEmailChangeMutationVariables
> {
    override document = TriggerEmailChangeDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UpdateUserEmailDocument = gql`
    mutation updateUserEmail($uid: String!, $token: String!, $newEmail: String!) {
        updateUserEmail(uid: $uid, token: $token, newEmail: $newEmail) {
            ...OperationInfo
        }
    }
    ${OperationInfoFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class UpdateUserEmailGQL extends Apollo.Mutation<
    UpdateUserEmailMutation,
    UpdateUserEmailMutationVariables
> {
    override document = UpdateUserEmailDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SubmitZofarPageDocument = gql`
    mutation submitZofarPage($data: ZfFormSubmit!) {
        nextPage: zofarSubmit(data: $data) {
            ...OperationInfo
            ...QnrPage
        }
    }
    ${OperationInfoFragmentDoc}
    ${QnrPageFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class SubmitZofarPageGQL extends Apollo.Mutation<
    SubmitZofarPageMutation,
    SubmitZofarPageMutationVariables
> {
    override document = SubmitZofarPageDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarBackDocument = gql`
    mutation zofarBack($questionnaireId: ID!) {
        nextPage: zofarBack(questionnaireId: $questionnaireId) {
            ...OperationInfo
            ...QnrPage
        }
    }
    ${OperationInfoFragmentDoc}
    ${QnrPageFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarBackGQL extends Apollo.Mutation<ZofarBackMutation, ZofarBackMutationVariables> {
    override document = ZofarBackDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarSaveEpisodeDocument = gql`
    mutation zofarSaveEpisode($data: ZfSaveEpisodeInput!, $continueToDetails: Boolean!) {
        nextPage: saveZofarEpisode(data: $data, continueToDetails: $continueToDetails) {
            ...OperationInfo
            ...QnrPage
        }
    }
    ${OperationInfoFragmentDoc}
    ${QnrPageFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarSaveEpisodeGQL extends Apollo.Mutation<
    ZofarSaveEpisodeMutation,
    ZofarSaveEpisodeMutationVariables
> {
    override document = ZofarSaveEpisodeDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarNavigateToEpisodeDocument = gql`
    mutation zofarNavigateToEpisode($data: ZfNavigateToEpisodeDetailsInput!) {
        nextPage: zofarNavigateToEpisodeDetails(data: $data) {
            ...OperationInfo
            ...QnrPage
        }
    }
    ${OperationInfoFragmentDoc}
    ${QnrPageFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarNavigateToEpisodeGQL extends Apollo.Mutation<
    ZofarNavigateToEpisodeMutation,
    ZofarNavigateToEpisodeMutationVariables
> {
    override document = ZofarNavigateToEpisodeDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarRemoveEpisodeDocument = gql`
    mutation zofarRemoveEpisode($data: ZfRemoveEpisodeInput!) {
        nextPage: removeZofarEpisode(data: $data) {
            ...OperationInfo
            ...QnrPage
        }
    }
    ${OperationInfoFragmentDoc}
    ${QnrPageFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarRemoveEpisodeGQL extends Apollo.Mutation<
    ZofarRemoveEpisodeMutation,
    ZofarRemoveEpisodeMutationVariables
> {
    override document = ZofarRemoveEpisodeDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarHideGapDocument = gql`
    mutation zofarHideGap($data: ZfHideGapInput!) {
        nextPage: markZofarGapHidden(data: $data) {
            ...OperationInfo
            ...QnrPage
        }
    }
    ${OperationInfoFragmentDoc}
    ${QnrPageFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarHideGapGQL extends Apollo.Mutation<
    ZofarHideGapMutation,
    ZofarHideGapMutationVariables
> {
    override document = ZofarHideGapDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarGuestSessionDocument = gql`
    mutation zofarGuestSession($data: ZfGuestSessionInput!) {
        activateZofarGuestSession(data: $data) {
            ...OperationInfo
            ...CurrentUser
        }
    }
    ${OperationInfoFragmentDoc}
    ${CurrentUserFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarGuestSessionGQL extends Apollo.Mutation<
    ZofarGuestSessionMutation,
    ZofarGuestSessionMutationVariables
> {
    override document = ZofarGuestSessionDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarRegisterDocument = gql`
    mutation zofarRegister($data: ZofarCreateUser!) {
        zofarRegister(data: $data) {
            ...OperationInfo
        }
    }
    ${OperationInfoFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarRegisterGQL extends Apollo.Mutation<
    ZofarRegisterMutation,
    ZofarRegisterMutationVariables
> {
    override document = ZofarRegisterDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarTokenAccountStateDocument = gql`
    query zofarTokenAccountState($token: String!) {
        zofarToken(token: $token) {
            ...ZofarTokenAccountState
        }
    }
    ${ZofarTokenAccountStateFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarTokenAccountStateGQL extends Apollo.Query<
    ZofarTokenAccountStateQuery,
    ZofarTokenAccountStateQueryVariables
> {
    override document = ZofarTokenAccountStateDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ZofarTokenTourStateDocument = gql`
    query zofarTokenTourState {
        zofarToken {
            ...ZofarTokenTour
        }
    }
    ${ZofarTokenTourFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class ZofarTokenTourStateGQL extends Apollo.Query<
    ZofarTokenTourStateQuery,
    ZofarTokenTourStateQueryVariables
> {
    override document = ZofarTokenTourStateDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const MarkTourSeenDocument = gql`
    mutation markTourSeen {
        updateZofarToken(data: { markTourSeen: true }) {
            ...ZofarTokenTour
        }
    }
    ${ZofarTokenTourFragmentDoc}
`;

@Injectable({
    providedIn: 'root',
})
export class MarkTourSeenGQL extends Apollo.Mutation<
    MarkTourSeenMutation,
    MarkTourSeenMutationVariables
> {
    override document = MarkTourSeenDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const FindQuestionnaireFromExternalDocument = gql`
    query findQuestionnaireFromExternal($externalId: String!) {
        zofarLookupExternalQuestionnaireId(externalId: $externalId)
    }
`;

@Injectable({
    providedIn: 'root',
})
export class FindQuestionnaireFromExternalGQL extends Apollo.Query<
    FindQuestionnaireFromExternalQuery,
    FindQuestionnaireFromExternalQueryVariables
> {
    override document = FindQuestionnaireFromExternalDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
