import { TestBed } from '@angular/core/testing';

import { SettingsLinksService } from './settings-links.service';

describe('SettingsLinksService', () => {
    let service: SettingsLinksService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SettingsLinksService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
