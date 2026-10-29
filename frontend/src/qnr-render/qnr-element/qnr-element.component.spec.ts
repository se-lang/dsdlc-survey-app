import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnrElementComponent } from './qnr-element.component';

describe('QnrElementComponent', () => {
    let component: QnrElementComponent;
    let fixture: ComponentFixture<QnrElementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QnrElementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QnrElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
