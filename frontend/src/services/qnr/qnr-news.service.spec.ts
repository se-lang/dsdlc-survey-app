import { TestBed } from '@angular/core/testing';

import { QnrNewsService } from './qnr-news.service';

describe('GlobalLoadingService', () => {
    let service: QnrNewsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(QnrNewsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
