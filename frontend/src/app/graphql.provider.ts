import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { inject, Provider } from '@angular/core';
import { type ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import type { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types';
import possibleTypesData, { PossibleTypesResultData } from '../generated/possibleTypes';
import { StrictTypedTypePolicies } from '../generated/apollo-helpers';

export function provideGraphql(): Provider {
    return provideApollo((): ApolloClientOptions<NormalizedCacheObject> => {
        const httpLink = inject(HttpLink);
        return {
            link: httpLink.create({
                uri: '/api/graphql/',
                withCredentials: true,
            }),
            cache: new InMemoryCache({
                possibleTypes: {
                    ...possibleTypesData.possibleTypes,
                    QuestionnaireElement: [
                        ...possibleTypesData.possibleTypes.QuestionnaireElement,
                        '^Qnr.+Element$',
                        '^Zf.+Element$',
                    ],
                    ZfElement: [...possibleTypesData.possibleTypes.ZfElement, '^Zf.+Element$'],
                } satisfies Record<keyof PossibleTypesResultData['possibleTypes'], string[]>,
                typePolicies: {
                    ZfEpisodesCalendarElement: {
                        fields: {
                            entries: {
                                merge: false,
                            },
                        },
                    },
                    ZfEpisodesTableElement: {
                        fields: {
                            entries: {
                                merge: false,
                            },
                        },
                    },
                    ZfPage: {
                        fields: {
                            allElements: {
                                merge: false,
                            },
                            formValues: {
                                merge: false,
                            },
                        },
                    },
                } satisfies StrictTypedTypePolicies,
            }),
        };
    });
}
