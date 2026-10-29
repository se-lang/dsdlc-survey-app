import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfEpisodeSidebarSortElementComponent } from './zf-episode-sidebar-sort-element.component';

describe('ZfEpisodeTableSortHeaderComponent', () => {
    let component: ZfEpisodeSidebarSortElementComponent;
    let fixture: ComponentFixture<ZfEpisodeSidebarSortElementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfEpisodeSidebarSortElementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfEpisodeSidebarSortElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
