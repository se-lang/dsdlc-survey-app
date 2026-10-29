import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnrPageContentsComponent } from './qnr-page-contents.component';

describe('QnrPageContentsComponent', () => {
    let component: QnrPageContentsComponent;
    let fixture: ComponentFixture<QnrPageContentsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QnrPageContentsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QnrPageContentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
