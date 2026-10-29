import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxedLayout } from './boxed.layout';

describe('BoxedLayout', () => {
    let component: BoxedLayout;
    let fixture: ComponentFixture<BoxedLayout>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BoxedLayout],
        }).compileComponents();

        fixture = TestBed.createComponent(BoxedLayout);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
