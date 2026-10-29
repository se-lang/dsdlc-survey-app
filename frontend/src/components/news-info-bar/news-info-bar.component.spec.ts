import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsInfoBarComponent } from './news-info-bar.component';

describe('MobileSidebarComponent', () => {
    let component: NewsInfoBarComponent;
    let fixture: ComponentFixture<NewsInfoBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NewsInfoBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewsInfoBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
