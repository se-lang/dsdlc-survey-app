import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfEpisodePopoverComponent } from './zf-episode-popover.component';

describe('ZfEpisodePopoverComponent', () => {
    let component: ZfEpisodePopoverComponent;
    let fixture: ComponentFixture<ZfEpisodePopoverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfEpisodePopoverComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfEpisodePopoverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
