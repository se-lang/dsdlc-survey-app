import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceOptionComponent } from './choice-option.component';

describe('SingleChoiceOptionComponent', () => {
    let component: ChoiceOptionComponent;
    let fixture: ComponentFixture<ChoiceOptionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChoiceOptionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChoiceOptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
