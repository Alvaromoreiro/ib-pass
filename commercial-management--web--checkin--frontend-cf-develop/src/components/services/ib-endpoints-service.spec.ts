import * as angular from 'angular';
import { EndpointsService } from './ib-endpoints-service';

describe('EndpointsService', () => {
    let service: EndpointsService;
    let q: ng.IQService;
    let rootScope: ng.IRootScopeService;
    let genericProxy: jasmine.SpyObj<CommonsGenericProxy>;
    let httpUtilsErrorService: jasmine.SpyObj<CommonsHttpUtilsErrorService>;

    beforeEach(() => {
        genericProxy = jasmine.createSpyObj<CommonsGenericProxy>('CommonsGenericProxy', ['getGeneric']);
        httpUtilsErrorService = jasmine.createSpyObj<CommonsHttpUtilsErrorService>('CommonsHttpUtilsErrorService', ['controlError']);
        const ibUtilsService = {
            getMetaTagValueByName: jasmine.createSpy('getMetaTagValueByName').and.returnValue('build-1')
        };
        const datalayerUtilsService = {
            sendDatalayerErrorEvent: jasmine.createSpy('sendDatalayerErrorEvent'),
            sendDigitalDataErrorEvent: jasmine.createSpy('sendDigitalDataErrorEvent')
        };

        angular.mock.module('ib-checkin-services-module', ($provide: ng.auto.IProvideService) => {
            $provide.value('CheckinAppConstants', { endpointsServiceURI: '/endpoints/' });
            $provide.value('IbUtilsService', ibUtilsService);
            $provide.value('CkiDatalayerUtilsService', datalayerUtilsService);
            $provide.value('CommonsGenericProxy', genericProxy);
            $provide.value('CommonsHttpUtilsErrorService', httpUtilsErrorService);
        });

        angular.mock.inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService, _EndpointsService_: EndpointsService) => {
            q = _$q_;
            rootScope = _$rootScope_;
            service = _EndpointsService_;
        });
    });

    it('returns the endpoint response', () => {
        let result: unknown;
        genericProxy.getGeneric.and.returnValue(q.when('endpoint data'));

        service.getEndpoints().then((response: unknown) => {
            result = response;
        });
        rootScope.$digest();

        expect(genericProxy.getGeneric).toHaveBeenCalledWith('/endpoints/build-1');
        expect(result).toBe('endpoint data');
    });

    it('delegates request errors to the HTTP error service', () => {
        const error = { errorCode: 401 };
        genericProxy.getGeneric.and.returnValue(q.reject(error));

        service.getEndpoints();
        rootScope.$digest();

        expect(httpUtilsErrorService.controlError).toHaveBeenCalledWith(
            error,
            0,
            jasmine.any(Function),
            jasmine.any(Object)
        );
    });
});