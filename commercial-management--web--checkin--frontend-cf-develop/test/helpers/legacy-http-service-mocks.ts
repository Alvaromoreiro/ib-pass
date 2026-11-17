import * as angular from 'angular';

export interface LegacyHttpServiceMockOptions {
    sessionEndpoint?: string;
}

export const createLegacyHttpServiceMocks = (options: LegacyHttpServiceMockOptions = {}) => {
    const sessionConfigService = {
        getEndpoint: jasmine.createSpy('getEndpoint')
    };

    if (options.sessionEndpoint) {
        sessionConfigService.getEndpoint.and.returnValue(options.sessionEndpoint);
    }

    return {
        proxy: {
            putGeneric: jasmine.createSpy('putGeneric'),
            getGeneric: jasmine.createSpy('getGeneric'),
            deleteGeneric: jasmine.createSpy('deleteGeneric'),
            postGeneric: jasmine.createSpy('postGeneric')
        },
        errorService: {
            controlError: jasmine.createSpy('controlError')
        },
        httpServicesConstants: {
            URI: { DEFAULT_ENDPOINTS: 'aaaa' }
        },
        sessionConfigService,
        datalayerUtilsService: {
            sendDatalayerErrorEvent: jasmine.createSpy('sendDatalayerErrorEvent'),
            sendDigitalDataErrorEvent: jasmine.createSpy('sendDigitalDataErrorEvent')
        },
        filter: jasmine.createSpy('$filter').and.callFake((filterName: string) => {
            if (filterName === 'translate' || filterName === 'literalFormatter') {
                return (label: string) => label;
            }
            return () => [];
        })
    };
};

export const createDeferredQPromise = (
    $q: ng.IQService,
    settlement: 'resolve' | 'reject',
    value: unknown
): angular.IPromise<unknown> => {
    const deferred = $q.defer<unknown>();
    if (settlement === 'resolve') {
        deferred.resolve(value);
    } else {
        deferred.reject(value);
    }
    return deferred.promise;
};

export const configureFirstRetryErrorHandler = (controlError: jasmine.Spy): void => {
    controlError.and.callFake((_error: unknown, attempt: number, callback: () => void) => {
        if (attempt === 0) {
            callback();
        }
        return attempt;
    });
};