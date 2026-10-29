import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfCalendarViewModeSelectorComponent } from './zf-calendar-view-mode-selector.component';

describe('ZfCalendarViewModeSelectorComponent', () => {
    let component: ZfCalendarViewModeSelectorComponent;
    let fixture: ComponentFixture<ZfCalendarViewModeSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfCalendarViewModeSelectorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfCalendarViewModeSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
