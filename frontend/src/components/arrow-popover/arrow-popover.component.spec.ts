import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowPopoverComponent } from './arrow-popover.component';

describe('ArrowPopoverComponent', () => {
    let component: ArrowPopoverComponent;
    let fixture: ComponentFixture<ArrowPopoverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArrowPopoverComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArrowPopoverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
