import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfEpisodeTableComponent } from './zf-episode-table.component';

describe('ZfEpisodeTableComponent', () => {
    let component: ZfEpisodeTableComponent;
    let fixture: ComponentFixture<ZfEpisodeTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfEpisodeTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfEpisodeTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
