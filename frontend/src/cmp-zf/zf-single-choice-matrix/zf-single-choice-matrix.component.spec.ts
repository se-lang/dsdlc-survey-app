import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfSingleChoiceMatrixComponent } from './zf-single-choice-matrix.component';

describe('ZfSingleChoiceMatrixComponent', () => {
    let component: ZfSingleChoiceMatrixComponent;
    let fixture: ComponentFixture<ZfSingleChoiceMatrixComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfSingleChoiceMatrixComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfSingleChoiceMatrixComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
