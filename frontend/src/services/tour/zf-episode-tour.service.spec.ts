import { TestBed } from '@angular/core/testing';

import { ZfEpisodeTourService } from './zf-episode-tour.service';

describe('ZfEpisodeTourService', () => {
    let service: ZfEpisodeTourService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ZfEpisodeTourService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
