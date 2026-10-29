export interface FrontendConfig {
    /**
     * The maximum number of options in a choice questions for which we still use
     * buttons instead of radio buttons.
     */
    choiceQuestionButtonLimit: number;
}

export const frontendConfig: FrontendConfig = {
    choiceQuestionButtonLimit: 3,
};
