import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnrPageComponent } from './qnr-page.component';

describe('QnrPageComponent', () => {
    let component: QnrPageComponent;
    let fixture: ComponentFixture<QnrPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QnrPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QnrPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
