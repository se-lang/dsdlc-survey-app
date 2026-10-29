import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferentialQuestionPartComponent } from './differential-question-part.component';

describe('DifferentialQuestionPartComponent', () => {
    let component: DifferentialQuestionPartComponent;
    let fixture: ComponentFixture<DifferentialQuestionPartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DifferentialQuestionPartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DifferentialQuestionPartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
