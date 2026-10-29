import { ComponentFixture, TestBed } from '@angular/core/testing';

import DashboardArchivePage from './dashboard-news-detail.page';

describe('DashboardFilesPage', () => {
    let component: DashboardArchivePage;
    let fixture: ComponentFixture<DashboardArchivePage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardArchivePage],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardArchivePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
