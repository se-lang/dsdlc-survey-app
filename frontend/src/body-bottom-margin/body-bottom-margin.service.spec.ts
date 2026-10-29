import { TestBed } from '@angular/core/testing';

import { BodyBottomMarginService } from './body-bottom-margin.service';

describe('BodyBottomMarginService', () => {
    let service: BodyBottomMarginService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BodyBottomMarginService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
