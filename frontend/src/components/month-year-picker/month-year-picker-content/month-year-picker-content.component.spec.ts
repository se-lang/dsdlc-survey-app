import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthYearPickerContentComponent } from './month-year-picker-content.component';

describe('MonthYearPickerContentComponent', () => {
    let component: MonthYearPickerContentComponent;
    let fixture: ComponentFixture<MonthYearPickerContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MonthYearPickerContentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MonthYearPickerContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
