import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuestionnairesPage } from './dashboard-questionnaires.page';

describe('DashboardQuestionnairesPage', () => {
    let component: DashboardQuestionnairesPage;
    let fixture: ComponentFixture<DashboardQuestionnairesPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardQuestionnairesPage],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardQuestionnairesPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
