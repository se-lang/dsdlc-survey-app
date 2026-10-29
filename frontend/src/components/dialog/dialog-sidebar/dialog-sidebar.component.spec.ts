import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSidebarComponent } from './dialog-sidebar.component';

describe('DialogSidebarComponent', () => {
    let component: DialogSidebarComponent;
    let fixture: ComponentFixture<DialogSidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DialogSidebarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
