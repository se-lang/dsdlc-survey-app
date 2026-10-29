import { Provider } from '@angular/core';
import { HtmlComponent } from './html/html.component';
import { TextComponent } from './text/text.component';
import { ContainerComponent } from './container/container.component';
import { provideQnrComponent } from '../services/qnr/qnr-components';
import { ChoiceQuestionComponent } from './choice-question/choice-question.component';
import { ChoiceOptionComponent } from './choice-option/choice-option.component';
import { OpenQuestionComponent } from './open-question/open-question.component';
import { MatrixQuestionComponent } from './matrix-question/matrix-question.component';
import { MatrixQuestionCategoryComponent } from './matrix-question-category/matrix-question-category.component';
import { MatrixQuestionDoublePartComponent } from './matrix-question-double-part/matrix-question-double-part.component';
import { DifferentialQuestionComponent } from './differential-question/differential-question.component';
import { DifferentialQuestionPartComponent } from './differential-question-part/differential-question-part.component';

/**
 * Provide registrations for all the core questionnaire components.
 */
export function provideCoreQnrComponents(): Provider {
    return [
        provideQnrComponent('QnrHtmlSectionElement', HtmlComponent),
        provideQnrComponent('QnrPlainTextSectionElement', TextComponent),
        provideQnrComponent('QnrContainerElement', ContainerComponent),

        provideQnrComponent(
            'QnrMultipleChoiceQuestionElement',
            'QnrSingleChoiceQuestionElement',
            ChoiceQuestionComponent,
        ),
        provideQnrComponent(
            'QnrMultipleChoiceOptionElement',
            'QnrSingleChoiceOptionElement',
            ChoiceOptionComponent,
        ),

        provideQnrComponent('QnrOpenQuestionElement', OpenQuestionComponent),

        provideQnrComponent('QnrMatrixQuestionBaseElement', MatrixQuestionComponent),
        provideQnrComponent('QnrMatrixQuestionCategoryElement', MatrixQuestionCategoryComponent),
        provideQnrComponent(
            'QnrDoubleMatrixQuestionPartElement',
            MatrixQuestionDoublePartComponent,
        ),

        provideQnrComponent('QnrDifferentialQuestionElement', DifferentialQuestionComponent),
        provideQnrComponent(
            'QnrDifferentialQuestionPartElement',
            DifferentialQuestionPartComponent,
        ),
    ] satisfies Provider[];
}
