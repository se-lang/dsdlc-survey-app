import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfCalendarComponent } from './zf-calendar.component';

describe('ZfCalendarComponent', () => {
    let component: ZfCalendarComponent;
    let fixture: ComponentFixture<ZfCalendarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfCalendarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfCalendarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
