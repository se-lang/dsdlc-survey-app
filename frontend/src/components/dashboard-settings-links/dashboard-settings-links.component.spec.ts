import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSettingsLinksComponent } from './dashboard-settings-links.component';

describe('DashboardSettingsLinksComponent', () => {
    let component: DashboardSettingsLinksComponent;
    let fixture: ComponentFixture<DashboardSettingsLinksComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardSettingsLinksComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardSettingsLinksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
