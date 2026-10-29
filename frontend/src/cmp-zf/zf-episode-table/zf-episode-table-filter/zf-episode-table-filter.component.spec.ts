import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfEpisodeTableFilterComponent } from './zf-episode-table-filter.component';

describe('ZfEpisodeTableFilterComponent', () => {
    let component: ZfEpisodeTableFilterComponent;
    let fixture: ComponentFixture<ZfEpisodeTableFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfEpisodeTableFilterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfEpisodeTableFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
