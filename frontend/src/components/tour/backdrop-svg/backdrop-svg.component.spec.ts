import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdropSvgComponent } from './backdrop-svg.component';

describe('BackdropSvgComponent', () => {
    let component: BackdropSvgComponent;
    let fixture: ComponentFixture<BackdropSvgComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BackdropSvgComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BackdropSvgComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
