import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerErrorListComponent } from './server-error-list.component';

describe('ServerErrorListComponent', () => {
    let component: ServerErrorListComponent;
    let fixture: ComponentFixture<ServerErrorListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServerErrorListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ServerErrorListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
