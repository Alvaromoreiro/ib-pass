import * as angular from 'angular';
import {
    configureFirstRetryErrorHandler,
    createDeferredQPromise,
    createLegacyHttpServiceMocks
} from '@test-helpers/legacy-http-service-mocks';

const httpMocks = createLegacyHttpServiceMocks();
describe('ChangeOrderSliceService', function () {
    let ChangeOrderSliceService, rootScope, localStorageService, timeout;

    const fakeCommonsGenericProxy = httpMocks.proxy;
    const fakeCommonsHttpUtilsErrorService = httpMocks.errorService;
    const fakeHttpServicesConstants = httpMocks.httpServicesConstants;
    const fakeIbSessionConfigService = httpMocks.sessionConfigService;
    const fakeDatalayerUtilsService = httpMocks.datalayerUtilsService;
    const $fakeFilter = httpMocks.filter;

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-http-services-module', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('HttpServicesConstants', fakeHttpServicesConstants);
            $provide.value('$filter', $fakeFilter);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);

        });

        inject(function ($rootScope, _ChangeOrderSliceService_, $timeout, _localStorageService_) {
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            ChangeOrderSliceService = _ChangeOrderSliceService_;
            timeout = $timeout;
        });
    });


    describe('When changeOrderSlice() is called', function () {
        it('and resolve promise without endpoint', function (done) {
            inject(function ($q) {
                fakeCommonsGenericProxy.putGeneric.and.returnValue(createDeferredQPromise($q, 'resolve', 'data'));
            });

            localStorageService.set('flowId', 'idcheckin');
            ChangeOrderSliceService.changeOrderSlice().then(function (response) {
                expect(response).toEqual('data');
            }, angular.noop);
            rootScope.$digest();
            done();
        });
        it('and resolve promise with endpoint', function (done) {
            inject(function ($q) {
                fakeCommonsGenericProxy.putGeneric.and.returnValue(createDeferredQPromise($q, 'resolve', 'data'));
                fakeIbSessionConfigService.getEndpoint = jasmine.createSpy('getEndpoint').and.returnValue('endointUrl');
            });

            localStorageService.set('flowId', 'idcheckin');
            ChangeOrderSliceService.changeOrderSlice().then(function (response) {
                expect(response).toEqual('data');
            }, angular.noop);
            rootScope.$digest();
            done();
        });

        describe('and reject promise', function () {
            it('with error 401 should call to refreshToken', function (done) {
                let mockError = { 'errorCode': 401, 'message': 'error' };
                inject(function ($q) {
                    fakeCommonsGenericProxy.putGeneric.and.returnValue(createDeferredQPromise($q, 'reject', mockError));
                    configureFirstRetryErrorHandler(fakeCommonsHttpUtilsErrorService.controlError);
                });
                localStorageService.set('flowId', 'idcheckin');
                ChangeOrderSliceService.changeOrderSlice().then(angular.noop, function (error) {
                    expect(error.errorCode).toEqual(400);
                });
                rootScope.$digest();
                expect(fakeCommonsHttpUtilsErrorService.controlError).toHaveBeenCalled();
                done();
            });
        });
    });
});
