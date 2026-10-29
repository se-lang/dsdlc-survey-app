import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthYearPickerButtonComponent } from './month-year-picker-button.component';

describe('MonthYearPickerButtonComponent', () => {
    let component: MonthYearPickerButtonComponent;
    let fixture: ComponentFixture<MonthYearPickerButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MonthYearPickerButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MonthYearPickerButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
