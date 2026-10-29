import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailChangeTriggerPage } from './email-change-trigger.page';

describe('EmailChangeTriggerPage', () => {
    let component: EmailChangeTriggerPage;
    let fixture: ComponentFixture<EmailChangeTriggerPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmailChangeTriggerPage],
        }).compileComponents();

        fixture = TestBed.createComponent(EmailChangeTriggerPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
