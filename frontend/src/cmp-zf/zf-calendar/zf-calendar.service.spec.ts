import { TestBed } from '@angular/core/testing';

import { ZfCalendarService } from './zf-calendar.service';

describe('ZfCalendarService', () => {
    let service: ZfCalendarService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ZfCalendarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
