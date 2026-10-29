import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFallbackComponent } from './popover-fallback.component';

describe('PopoverFallbackComponent', () => {
    let component: PopoverFallbackComponent;
    let fixture: ComponentFixture<PopoverFallbackComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopoverFallbackComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PopoverFallbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
