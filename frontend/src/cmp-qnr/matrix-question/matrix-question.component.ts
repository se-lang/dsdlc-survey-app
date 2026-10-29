import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    input,
    viewChild,
} from '@angular/core';
import { QnrMatrixQuestionElementFragment } from '../../generated/graphql';
import { QnrElementChildrenComponent } from '../../qnr-render/qnr-element-children/qnr-element-children.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { defer, Subject } from 'rxjs';
import { IconDirective } from '../../components/icon/icon.directive';
import { i18nCompute } from '../../services/i18n/i18n.utils';
import { QnrElementComponent } from '../../qnr-render/qnr-element/qnr-element.component';
import {
    OPEN_QUESTION_CONTEXT,
    OpenQuestionContext,
} from '../open-question/open-question.component';
import { QuestionnaireContext } from '../../services/qnr/questionnaire-service-interface';

@Component({
    selector: 'lla-matrix-question',
    imports: [QnrElementChildrenComponent, IconDirective, QnrElementComponent],
    templateUrl: './matrix-question.component.html',
    styleUrl: './matrix-question.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: OPEN_QUESTION_CONTEXT,
            useValue: {
                style: 'basic',
            } satisfies OpenQuestionContext,
        },
    ],
    host: {
        '[class.is-double-matrix]': 'isDoubleMatrix()',
    },
})
export class MatrixQuestionComponent {
    readonly element = input.required<QnrMatrixQuestionElementFragment>();
    readonly context = input.required<QuestionnaireContext>();
    protected readonly swiperElement = viewChild.required<ElementRef<HTMLElement>>('swiper');
    protected readonly swiperPagination =
        viewChild.required<ElementRef<HTMLElement>>('swiperPagination');

    protected readonly isDoubleMatrix = computed(() => {
        return this.element().types.includes('QnrDoubleMatrixQuestionElement');
    });

    #autoSlideNext = new Subject<void>();

    constructor() {
        const numberFormatter = i18nCompute((t) => {
            return new Intl.NumberFormat(t.getActiveLang());
        });

        const loadedSwiperBundle = toSignal(defer(() => import('../../util/swiper-bundle')));
        afterRenderEffect((onCleanup) => {
            const bundle = loadedSwiperBundle();
            if (bundle != null) {
                const swiperElement = this.swiperElement().nativeElement;
                const paginationElement = this.swiperPagination().nativeElement;
                const nf = numberFormatter();
                const { Swiper, Navigation, Pagination } = bundle;
                const swiper = new Swiper(swiperElement, {
                    modules: [Navigation, Pagination],
                    loop: true,
                    navigation: {
                        prevEl: swiperElement.querySelector<HTMLElement>('.prev-btn'),
                        nextEl: swiperElement.querySelector<HTMLElement>('.next-btn'),
                    },
                    pagination: {
                        el: paginationElement,
                        clickable: true,
                        bulletClass: 'pagination-item',
                        bulletActiveClass: 'pagination-item--active',
                        renderBullet: (index, className) => {
                            const formattedNumber = nf.format(index + 1);
                            return `<button type="button" class="${className}" data-text="${formattedNumber}"><span>${formattedNumber}</span></button>`;
                        },
                    },
                });

                const sub = this.#autoSlideNext.subscribe(() => {
                    if (swiper.realIndex !== swiper.slides.length - 1) {
                        swiper.slideNext();
                    }
                });
                onCleanup(() => sub.unsubscribe());
                onCleanup(() => swiper.destroy());
            }
        });
    }

    autoSlideNext() {
        this.#autoSlideNext.next();
    }
}
