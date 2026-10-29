import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfEpisodeDialogComponent } from './zf-episode-dialog.component';

describe('ZfEpisodeDialogComponent', () => {
    let component: ZfEpisodeDialogComponent;
    let fixture: ComponentFixture<ZfEpisodeDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfEpisodeDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfEpisodeDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
