import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnrLastUpdateInfoComponent } from './qnr-last-update-info.component';

describe('QnrLastUpdateInfoComponent', () => {
    let component: QnrLastUpdateInfoComponent;
    let fixture: ComponentFixture<QnrLastUpdateInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [QnrLastUpdateInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QnrLastUpdateInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
