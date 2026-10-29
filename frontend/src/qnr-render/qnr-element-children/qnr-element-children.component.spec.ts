import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnrElementChildrenComponent } from './qnr-element-children.component';

describe('QnrElementChildrenComponent', () => {
    let component: QnrElementChildrenComponent;
    let fixture: ComponentFixture<QnrElementChildrenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QnrElementChildrenComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QnrElementChildrenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
