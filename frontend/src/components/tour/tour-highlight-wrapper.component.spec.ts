import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourHighlightWrapperComponent } from './tour-highlight-wrapper.component';

describe('TourHighlightWrapperComponent', () => {
    let component: TourHighlightWrapperComponent;
    let fixture: ComponentFixture<TourHighlightWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TourHighlightWrapperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TourHighlightWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
