import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfEpisodeTableSortHeaderComponent } from './zf-episode-table-sort-header.component';

describe('ZfEpisodeTableSortHeaderComponent', () => {
    let component: ZfEpisodeTableSortHeaderComponent;
    let fixture: ComponentFixture<ZfEpisodeTableSortHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfEpisodeTableSortHeaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfEpisodeTableSortHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
