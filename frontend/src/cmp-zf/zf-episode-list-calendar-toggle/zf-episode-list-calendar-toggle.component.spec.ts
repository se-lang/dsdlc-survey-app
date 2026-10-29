import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfEpisodeListCalendarToggleComponent } from './zf-episode-list-calendar-toggle.component';

describe('ZfEpisodeListCalendarToggleComponent', () => {
    let component: ZfEpisodeListCalendarToggleComponent;
    let fixture: ComponentFixture<ZfEpisodeListCalendarToggleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfEpisodeListCalendarToggleComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfEpisodeListCalendarToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
