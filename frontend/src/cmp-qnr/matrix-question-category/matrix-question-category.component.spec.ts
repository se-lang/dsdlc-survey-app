import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixQuestionCategoryComponent } from './matrix-question-category.component';

describe('MatrixQuestionCategoryComponent', () => {
    let component: MatrixQuestionCategoryComponent;
    let fixture: ComponentFixture<MatrixQuestionCategoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatrixQuestionCategoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MatrixQuestionCategoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
