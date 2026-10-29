import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebPushSettingsPage } from './web-push-settings.page';

describe('WebPushSettingsPage', () => {
    let component: WebPushSettingsPage;
    let fixture: ComponentFixture<WebPushSettingsPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WebPushSettingsPage],
        }).compileComponents();

        fixture = TestBed.createComponent(WebPushSettingsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
