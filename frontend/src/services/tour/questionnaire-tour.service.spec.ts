import { TestBed } from '@angular/core/testing';

import { QuestionnaireTourService } from './questionnaire-tour.service';

describe('QuestionnaireTourService', () => {
    let service: QuestionnaireTourService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(QuestionnaireTourService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
