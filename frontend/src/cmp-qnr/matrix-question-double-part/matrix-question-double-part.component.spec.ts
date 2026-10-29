import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixQuestionDoublePartComponent } from './matrix-question-double-part.component';

describe('MatrixQuestionDoublePartComponent', () => {
    let component: MatrixQuestionDoublePartComponent;
    let fixture: ComponentFixture<MatrixQuestionDoublePartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatrixQuestionDoublePartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MatrixQuestionDoublePartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
