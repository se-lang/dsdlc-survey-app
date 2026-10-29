import { TestBed } from '@angular/core/testing';

import { ZfEpisodeTableService } from './zf-episode-table.service';

describe('ZfEpisodeTableService', () => {
    let service: ZfEpisodeTableService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ZfEpisodeTableService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
