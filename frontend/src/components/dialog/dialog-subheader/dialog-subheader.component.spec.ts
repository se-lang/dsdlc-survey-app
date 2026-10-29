import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubheaderComponent } from './dialog-subheader.component';

describe('DialogSidebarComponent', () => {
    let component: DialogSubheaderComponent;
    let fixture: ComponentFixture<DialogSubheaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DialogSubheaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogSubheaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
