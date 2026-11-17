import * as angular from 'angular';
import {
    createDeferredQPromise,
    createLegacyHttpServiceMocks
} from '@test-helpers/legacy-http-service-mocks';

const httpMocks = createLegacyHttpServiceMocks({ sessionEndpoint: 'endpoint' });
describe('GetBiometricCardPassengerAssociationService', function () {

    let GetBiometricCardPassengerAssociationService, rootScope, timeout, httpServicesConstants, scope;

    let fakeGetBiometricCardPassengerAssociationProxy = { 
        'getBiometricCardPassenegerAssociation': jasmine.createSpy()
    };
    let fakeConfig = { 'DEFAULT_ENDPOINTS': { 'GetBiometricCardPassengerAssociationServiceURI': 'GetBiometricCardPassengerAssociationServiceURI' }, 'numAttemps': 1, 'timeWait': 100, 'GetBiometricCardPassengerAssociationServiceURI': 'GetBiometricCardPassengerAssociationServiceURI' };
    const fakeIbSessionConfigService = httpMocks.sessionConfigService;

    const fakeDatalayerUtilsService = httpMocks.datalayerUtilsService;

    let fakeTranslateFilter = function (input) {
        let ob = {
            'translate': function (input) {
                return input;
            }
        }
        return ob;
    };

    const fakeCommonsGenericProxy = httpMocks.proxy;
    const fakeCommonsHttpUtilsErrorService = httpMocks.errorService;

    const configureProxyResponse = (settlement: 'resolve' | 'reject', value: unknown) => {
        inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric.and.returnValue(createDeferredQPromise($q, settlement, value));
        });
    };

    const expectResolvedProxyRequest = (invokeRequest: () => angular.IPromise<unknown>) => {
        let response: unknown;
        configureProxyResponse('resolve', 'data');
        invokeRequest().then((data) => {
            response = data;
        }, angular.noop);
        rootScope.$digest();

        expect(response).toEqual('data');
        expect(fakeCommonsGenericProxy.postGeneric).toHaveBeenCalled();
    };

    const expectProxyErrorHandled = (error: unknown, invokeRequest: () => angular.IPromise<unknown>) => {
        configureProxyResponse('reject', error);
        invokeRequest().then(angular.noop, angular.noop);
        rootScope.$digest();
        expect(fakeCommonsHttpUtilsErrorService.controlError).toHaveBeenCalled();
    };
    
    beforeEach(function () {
        angular.mock.module('ib-http-services-module', function ($provide) {
            $provide.value('GetBiometricCardPassengerAssociationProxy', fakeGetBiometricCardPassengerAssociationProxy);
            $provide.value('CheckinAppConstants', fakeConfig);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
        });

        inject(function ($rootScope, _GetBiometricCardPassengerAssociationService_, $timeout, _HttpServicesConstants_) {
            GetBiometricCardPassengerAssociationService = _GetBiometricCardPassengerAssociationService_;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            timeout = $timeout;
            httpServicesConstants = _HttpServicesConstants_;
        });
    });

    describe('test for GetBiometricCardPassengerAssociationService', function() {
        it('GetBiometricCardPassengerAssociationService should be defined', function(done) {
            expect(GetBiometricCardPassengerAssociationService).toBeDefined();
            done();
        });
    });

    describe('When getBiometricCardPassengerData() is called', function () {
        it('and resolves the promise', function () {
            expectResolvedProxyRequest(() => GetBiometricCardPassengerAssociationService.getBiometricCardPassengerData({}));
        });

        describe('and reject promise', function () {
            it('fakeCommonsGenericProxy should reject promise with error 400', function () {
                const mockError = {
                    'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] }
                };
                expectProxyErrorHandled(mockError, () => GetBiometricCardPassengerAssociationService.getBiometricCardPassengerData({}));
            });

            it('fakeCommonsGenericProxy should reject promise with error 500', function () {
                const mockError = {
                    'errorCode': 500 
                };
                expectProxyErrorHandled(mockError, () => GetBiometricCardPassengerAssociationService.getBiometricCardPassengerData(1));
            });

            it('fakeCommonsGenericProxy should reject promise with error 409', function () {
                const mockError = {
                    'errorCode': 409, 'data': { 'errors': [{ 'reason': 'error' }] }
                };
                expectProxyErrorHandled(mockError, () => GetBiometricCardPassengerAssociationService.getBiometricCardPassengerData(1));
            });
        });
    });

    describe('When associateBoardingCardsOrchestrator() is called and promise is resolved', function () {
        it('and resolves the promise', function () {
            expectResolvedProxyRequest(() => GetBiometricCardPassengerAssociationService.associateBoardingCardsOrchestrator({}));
        });
    });
    describe('When associateBoardingCardsOrchestrator() is called and promise is rejected', function () {
        it('fakeCommonsGenericProxy should reject promise with error 400', function () {
            const mockError = {
                'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] }
            };
            expectProxyErrorHandled(
                mockError,
                () => GetBiometricCardPassengerAssociationService.associateBoardingCardsOrchestrator({})
            );
        });
    });
});