import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourNavigationComponent } from './tour-navigation.component';

describe('TourNavigationComponent', () => {
    let component: TourNavigationComponent;
    let fixture: ComponentFixture<TourNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TourNavigationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TourNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
