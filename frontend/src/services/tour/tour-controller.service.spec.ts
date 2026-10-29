import { TestBed } from '@angular/core/testing';

import { TourControllerService } from './tour-controller.service';

describe('TourControllerService', () => {
    let service: TourControllerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TourControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
