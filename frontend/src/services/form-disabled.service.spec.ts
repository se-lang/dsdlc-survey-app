import { TestBed } from '@angular/core/testing';

import { FormDisabledService } from './form-disabled.service';

describe('FormDisabledService', () => {
    let service: FormDisabledService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormDisabledService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
