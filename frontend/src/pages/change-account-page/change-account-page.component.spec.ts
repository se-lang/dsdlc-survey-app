import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAccountPageComponent } from './change-account-page.component';

describe('ChangeAccountPageComponent', () => {
    let component: ChangeAccountPageComponent;
    let fixture: ComponentFixture<ChangeAccountPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangeAccountPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChangeAccountPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
