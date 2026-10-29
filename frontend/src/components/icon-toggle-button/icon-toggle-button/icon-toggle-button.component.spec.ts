import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconToggleButtonComponent } from './icon-toggle-button.component';

describe('IconToggleButtonComponent', () => {
    let component: IconToggleButtonComponent;
    let fixture: ComponentFixture<IconToggleButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IconToggleButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(IconToggleButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
