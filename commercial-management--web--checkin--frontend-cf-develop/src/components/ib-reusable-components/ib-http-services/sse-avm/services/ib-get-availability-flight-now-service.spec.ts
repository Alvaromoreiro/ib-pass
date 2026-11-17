import * as angular from 'angular';
describe('GetAvailabilityFlightNowService', function () {

    let GetAvailabilityFlightNowService, rootScope, localStorageService, filter, timeout, httpServicesConstants;

    let fakeAvailabilityFlightNowProxy = {
        postGeneric: jasmine.createSpy()
    };
    let fakeConfig = { 'DEFAULT_ENDPOINTS': { 'GetavailabilityFlightNowURI': 'GetavailabilityFlightNowURI' }, 'numAttemps': 1, 'timeWait': 100, 'GetavailabilityFlightNowURI': 'GetavailabilityFlightNowURI' };
    let fakeIbSessionConfigService = {
        'getEndpoint': jasmine.createSpy('getEndpoint').and.callFake(function () {
            return 'endpoint'
        })
    };

    let fakeDatalayerUtilsService = {
        'sendDatalayerErrorEvent':jasmine.createSpy(),
        'sendDigitalDataErrorEvent':jasmine.createSpy()
    };

    let fakeTranslateFilter = function (input) {
        let ob = {
            'translate': function (input) {
                return input;
            }
        }
        return ob;
    };
    let fakeCommonsHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };
    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-http-services-module', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeAvailabilityFlightNowProxy);
            $provide.value('CheckinAppConstants', fakeConfig);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CommonsHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
        });

        inject(function ($rootScope, _GetAvailabilityFlightNowService_, $timeout, _localStorageService_, _HttpServicesConstants_) {
            GetAvailabilityFlightNowService = _GetAvailabilityFlightNowService_;
            rootScope = $rootScope;
            timeout = $timeout;
            localStorageService = _localStorageService_;
            httpServicesConstants = _HttpServicesConstants_;
        });
    });

    describe('When getAvailabilityFlightNow() is called', function () {
        it('and resolve promise', function (done) {
            inject(function ($q) {
                fakeAvailabilityFlightNowProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                    let defer = $q.defer();
                    defer.resolve('data')
                    return defer.promise;
                });
            });

            localStorageService.set('flowId', 'idcheckin');
            GetAvailabilityFlightNowService.getAvailabilityFlightNow().then(function (response) {
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        describe('and reject promise', function () {
            it('with error 401 should call to refreshToken', function (done) {
                let mockError = { 'errorCode': 401, 'message': 'error' };
                inject(function ($q) {
                    fakeAvailabilityFlightNowProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.reject(mockError)
                        return defer.promise;
                    });
                });
                localStorageService.set('flowId', 'idcheckin');
                GetAvailabilityFlightNowService.getAvailabilityFlightNow(1).then(angular.noop, function (error) {
                    expect(error.errorCode).toEqual(400);
                });
                rootScope.$digest();
                done();
            });

            it('and have checkinId, fakeAvailabilityFlightNowProxy should reject promise with erro 408', function (done) {
                let mockError = {
                    'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] }
                };
                httpServicesConstants.NUM_ATTEMPS = 1;
                httpServicesConstants.TIME_WAIT = 1;

                inject(function ($q) {
                    fakeAvailabilityFlightNowProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.reject(mockError);
                        return defer.promise;
                    });
                });

                localStorageService.set('flowId', 'flowId');
                GetAvailabilityFlightNowService.getAvailabilityFlightNow(1).then(angular.noop, function (response) {
                    expect(response.errorCode).toEqual(408);
                }, angular.noop);
                rootScope.$digest();
                timeout.flush();
                done();
            });
        });
    });
});
