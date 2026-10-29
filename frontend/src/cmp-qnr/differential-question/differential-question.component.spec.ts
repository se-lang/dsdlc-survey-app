import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferentialQuestionComponent } from './differential-question.component';

describe('DifferentialQuestionComponent', () => {
    let component: DifferentialQuestionComponent;
    let fixture: ComponentFixture<DifferentialQuestionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DifferentialQuestionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DifferentialQuestionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
