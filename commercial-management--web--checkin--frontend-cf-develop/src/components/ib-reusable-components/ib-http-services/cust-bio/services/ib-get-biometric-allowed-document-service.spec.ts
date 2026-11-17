import * as angular from 'angular';

interface GetBiometricAllowedDataServiceInstance {
    getBiometricalAllowedDocuments(): angular.IPromise<unknown>;
}

describe('GetBiometricAllowedDataService', () => {
    let service: GetBiometricAllowedDataServiceInstance;
    let q: ng.IQService;
    let rootScope: ng.IRootScopeService;
    let sessionConfigService: { getEndpoint: jasmine.Spy };
    let genericProxy: { getGeneric: jasmine.Spy };
    let datalayerUtilsService: { sendDatalayerErrorEvent: jasmine.Spy; sendDigitalDataErrorEvent: jasmine.Spy };
    let httpUtilsErrorService: { controlError: jasmine.Spy };

    beforeEach(() => {
        sessionConfigService = {
            getEndpoint: jasmine.createSpy('getEndpoint')
        };
        genericProxy = {
            getGeneric: jasmine.createSpy('getGeneric')
        };
        datalayerUtilsService = {
            sendDatalayerErrorEvent: jasmine.createSpy('sendDatalayerErrorEvent'),
            sendDigitalDataErrorEvent: jasmine.createSpy('sendDigitalDataErrorEvent')
        };
        httpUtilsErrorService = {
            controlError: jasmine.createSpy('controlError')
        };

        angular.mock.module('ib-http-services-module', ($provide: ng.auto.IProvideService) => {
            $provide.constant('HttpServicesConstants', {
                URI: {
                    getBiometricalAllowedDocuments: '/allowed-documents',
                    DEFAULT_ENDPOINTS: {
                        getBiometricalAllowedDocuments: '/default/allowed-documents'
                    }
                }
            });
            $provide.value('IbSessionConfigService', sessionConfigService);
            $provide.value('CkiDatalayerUtilsService', datalayerUtilsService);
            $provide.value('CommonsGenericProxy', genericProxy);
            $provide.value('CommonsHttpUtilsErrorService', httpUtilsErrorService);
        });

        angular.mock.inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService, _GetBiometricAllowedDataService_: GetBiometricAllowedDataServiceInstance) => {
            q = _$q_;
            rootScope = _$rootScope_;
            service = _GetBiometricAllowedDataService_;
        });
    });

    it('uses the default endpoint when no session endpoint is configured', () => {
        let result: unknown;
        sessionConfigService.getEndpoint.and.returnValue(undefined);
        genericProxy.getGeneric.and.returnValue(q.when('allowed documents'));

        service.getBiometricalAllowedDocuments().then((response: unknown) => {
            result = response;
        });
        rootScope.$digest();

        expect(sessionConfigService.getEndpoint).toHaveBeenCalledWith('cust-bio-rs');
        expect(genericProxy.getGeneric).toHaveBeenCalledWith('/default/allowed-documents');
        expect(result).toBe('allowed documents');
    });

    it('appends the route to the configured session endpoint', () => {
        sessionConfigService.getEndpoint.and.returnValue('/cust-bio');
        genericProxy.getGeneric.and.returnValue(q.when('allowed documents'));

        service.getBiometricalAllowedDocuments();
        rootScope.$digest();

        expect(genericProxy.getGeneric).toHaveBeenCalledWith('/cust-bio/allowed-documents');
    });

    it('delegates request errors to the HTTP error service', () => {
        const error = { status: 500 };
        sessionConfigService.getEndpoint.and.returnValue('/cust-bio');
        genericProxy.getGeneric.and.returnValue(q.reject(error));

        service.getBiometricalAllowedDocuments();
        rootScope.$digest();

        expect(datalayerUtilsService.sendDatalayerErrorEvent).toHaveBeenCalledWith(error);
        expect(datalayerUtilsService.sendDigitalDataErrorEvent).toHaveBeenCalledWith(error);
        expect(httpUtilsErrorService.controlError).toHaveBeenCalledWith(
            error,
            0,
            jasmine.any(Function),
            jasmine.any(Object)
        );
    });
});