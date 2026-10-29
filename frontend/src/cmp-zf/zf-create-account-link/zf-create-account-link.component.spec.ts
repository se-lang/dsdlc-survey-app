import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfCreateAccountLinkComponent } from './zf-create-account-link.component';

describe('ZfCreateAccountLinkComponent', () => {
    let component: ZfCreateAccountLinkComponent;
    let fixture: ComponentFixture<ZfCreateAccountLinkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfCreateAccountLinkComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfCreateAccountLinkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
