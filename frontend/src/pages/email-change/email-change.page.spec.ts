import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailChangePage } from './email-change.page';

describe('ConfirmEmailChangePage', () => {
    let component: EmailChangePage;
    let fixture: ComponentFixture<EmailChangePage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmailChangePage],
        }).compileComponents();

        fixture = TestBed.createComponent(EmailChangePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
