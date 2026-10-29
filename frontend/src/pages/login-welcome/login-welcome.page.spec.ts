import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWelcomePage } from './login-welcome.page';

describe('LoginWelcomePage', () => {
    let component: LoginWelcomePage;
    let fixture: ComponentFixture<LoginWelcomePage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginWelcomePage],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginWelcomePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
