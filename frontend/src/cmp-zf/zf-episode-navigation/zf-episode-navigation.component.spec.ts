import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZfEpisodeNavigationComponent } from './zf-episode-navigation.component';

describe('ZfEpisodeNavigationComponent', () => {
    let component: ZfEpisodeNavigationComponent;
    let fixture: ComponentFixture<ZfEpisodeNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZfEpisodeNavigationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZfEpisodeNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
