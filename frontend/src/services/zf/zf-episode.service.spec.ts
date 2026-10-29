import { TestBed } from '@angular/core/testing';

import { ZfEpisodeService } from './zf-episode.service';

describe('EpisodesService', () => {
    let service: ZfEpisodeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ZfEpisodeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
