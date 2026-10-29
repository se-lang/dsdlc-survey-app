import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnrNavigationComponent } from './qnr-navigation.component';

describe('QnrNavigationComponent', () => {
    let component: QnrNavigationComponent;
    let fixture: ComponentFixture<QnrNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QnrNavigationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QnrNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
