import { TestBed } from '@angular/core/testing';

import { ParadataService } from './paradata.service';

describe('ParadataService', () => {
    let service: ParadataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ParadataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
