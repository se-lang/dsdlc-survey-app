import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativePopoverContentComponent } from './native-popover-content.component';

describe('NativePopoverContentComponent', () => {
    let component: NativePopoverContentComponent;
    let fixture: ComponentFixture<NativePopoverContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NativePopoverContentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NativePopoverContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
