import { inject, Injectable } from '@angular/core';
import { SetQuestionnaireNewsSeenGQL } from '../../generated/graphql';

@Injectable({
    providedIn: 'root',
})
export class QnrNewsService {
    readonly #newsSeenGql = inject(SetQuestionnaireNewsSeenGQL);

    markAsSeen(newsID: string) {
        this.#newsSeenGql
            .mutate(
                { newsId: newsID },
                {
                    update: (cache) => {
                        cache.evict({ fieldName: 'questionnaireNews' });
                    },
                },
            )
            .subscribe({
                next: (data) => {
                    if (data.errors != null) {
                        console.error('Failed to mark news as seen', data.errors);
                    }
                },
                error: (err) => {
                    console.error('Failed to mark as seen', err);
                },
            });
    }
}
