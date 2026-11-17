import * as angular from 'angular';
describe('GetSummaryTripService', function () {

    let GetSummaryTripService, rootScope, localStorageService, filter, timeout, httpServicesConstants;

    let fakeCommonsGenericProxy = { 
        'getGeneric': jasmine.createSpy()
    };
    let fakeCommonsHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error, attempts, callback, defer) {
            defer.reject(error);
        })
    };
    let fakeConfig = { 'DEFAULT_ENDPOINTS': { 'GetSummaryTripServiceURI': 'GetSummaryTripServiceURI' }, 'numAttemps': 1, 'timeWait': 100, 'GetSummaryTripServiceURI': 'GetSummaryTripServiceURI' };
    let fakeIbSessionConfigService = {
        'getEndpoint': jasmine.createSpy('getEndpoint').and.callFake(function () {
            return 'endpoint'
        })
    };

    let fakeDatalayerUtilsService = {'sendDatalayerErrorEvent':jasmine.createSpy()};

    let fakeTranslateFilter = function (input) {
        let ob = {
            'translate': function (input) {
                return input;
            }
        }
        return ob;
    };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-http-services-module', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('CheckinAppConstants', fakeConfig);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
        });

        inject(function ($rootScope, _GetSummaryTripService_, $timeout, _localStorageService_, _HttpServicesConstants_) {
            GetSummaryTripService = _GetSummaryTripService_;
            rootScope = $rootScope;
            timeout = $timeout;
            localStorageService = _localStorageService_;
            httpServicesConstants = _HttpServicesConstants_;
        });
    });

    describe('When getSummaryTripInformation() is called', function () {
        it('and resolve promise', function (done) {
            inject(function ($q) {
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                    let defer = $q.defer();
                    defer.resolve('data')
                    return defer.promise;
                });
            });

            localStorageService.set('flowId', 'idcheckin');
            GetSummaryTripService.getSummaryTripInformation().then(function (response) {
                expect(response).toEqual('data');
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and not have checkinId,should reject promise', function (done) {
            localStorageService.clearAll();
            GetSummaryTripService.getSummaryTripInformation().then(angular.noop, function (response) {
                expect(response.errorCode).toEqual('IB_00002');
                done();
            });
            timeout.flush();
        });

        describe('and reject promise', function () {
            it('should propagate a 401 error through the error handler', function (done) {
                let mockError = { 'errorCode': 401, 'message': 'error' };
                inject(function ($q) {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.reject(mockError)
                        return defer.promise;
                    });
                });
                localStorageService.set('flowId', 'idcheckin');
                GetSummaryTripService.getSummaryTripInformation().then(angular.noop, function (error) {
                    expect(error.errorCode).toEqual(401);
                    done();
                });
                rootScope.$digest();
            });

            it('and have checkinId, fakegetSummaryProxy should reject promise with erro 408', function (done) {
                let mockError = {
                    'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] }
                };
                httpServicesConstants.NUM_ATTEMPS = 1;
                httpServicesConstants.TIME_WAIT = 1;

                inject(function ($q) {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.reject(mockError);
                        return defer.promise;
                    });
                });

                localStorageService.set('flowId', 'flowId');
                GetSummaryTripService.getSummaryTripInformation().then(angular.noop, function (response) {
                    expect(response.errorCode).toEqual(408);
                    done();
                }, angular.noop);
                rootScope.$digest();
            });
        });
    });
});