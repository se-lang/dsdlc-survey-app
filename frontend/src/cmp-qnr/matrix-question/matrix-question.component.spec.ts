import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixQuestionComponent } from './matrix-question.component';

describe('MatrixQuestionComponent', () => {
    let component: MatrixQuestionComponent;
    let fixture: ComponentFixture<MatrixQuestionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatrixQuestionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MatrixQuestionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
