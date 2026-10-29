import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFilesPage } from './dashboard-files.page';

describe('DashboardFilesPage', () => {
    let component: DashboardFilesPage;
    let fixture: ComponentFixture<DashboardFilesPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardFilesPage],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardFilesPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
