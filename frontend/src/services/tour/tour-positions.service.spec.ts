import { TestBed } from '@angular/core/testing';

import { TourPositionsService } from './tour-positions.service';

describe('TourPositionsService', () => {
    let service: TourPositionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TourPositionsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
