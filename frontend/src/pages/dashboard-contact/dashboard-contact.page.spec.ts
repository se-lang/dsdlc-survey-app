import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContactPage } from './dashboard-contact.page';

describe('DashboardContactPage', () => {
    let component: DashboardContactPage;
    let fixture: ComponentFixture<DashboardContactPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardContactPage],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardContactPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
