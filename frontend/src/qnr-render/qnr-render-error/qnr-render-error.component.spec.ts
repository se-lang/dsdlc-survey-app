import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnrRenderErrorComponent } from './qnr-render-error.component';

describe('QnrRenderErrorComponent', () => {
    let component: QnrRenderErrorComponent;
    let fixture: ComponentFixture<QnrRenderErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QnrRenderErrorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QnrRenderErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
