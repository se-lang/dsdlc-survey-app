import { TestBed } from '@angular/core/testing';

import { BrowserParadataService } from './browser-paradata.service';

describe('BrowserParadataService', () => {
    let service: BrowserParadataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BrowserParadataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
