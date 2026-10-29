import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZofarFromExternalPage } from './zofar-from-external.page';

describe('ZofarFromExternalPage', () => {
    let component: ZofarFromExternalPage;
    let fixture: ComponentFixture<ZofarFromExternalPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZofarFromExternalPage],
        }).compileComponents();

        fixture = TestBed.createComponent(ZofarFromExternalPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
