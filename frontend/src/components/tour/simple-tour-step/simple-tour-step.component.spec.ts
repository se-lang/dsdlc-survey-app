import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTourStepComponent } from './simple-tour-step.component';

describe('SimpleTourStepComponent', () => {
    let component: SimpleTourStepComponent;
    let fixture: ComponentFixture<SimpleTourStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SimpleTourStepComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SimpleTourStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
