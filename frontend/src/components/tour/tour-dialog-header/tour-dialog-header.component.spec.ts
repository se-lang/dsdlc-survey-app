import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDialogHeaderComponent } from './tour-dialog-header.component';

describe('TourDialogHeaderComponent', () => {
    let component: TourDialogHeaderComponent;
    let fixture: ComponentFixture<TourDialogHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TourDialogHeaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TourDialogHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
