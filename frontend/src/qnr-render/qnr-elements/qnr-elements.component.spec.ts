import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnrElementsComponent } from './qnr-elements.component';

describe('QnrElementsComponent', () => {
    let component: QnrElementsComponent;
    let fixture: ComponentFixture<QnrElementsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QnrElementsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QnrElementsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
