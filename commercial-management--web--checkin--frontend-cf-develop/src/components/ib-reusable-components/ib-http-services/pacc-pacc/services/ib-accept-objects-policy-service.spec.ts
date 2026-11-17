import * as angular from 'angular';
describe('AcceptObjectsPolicyService', function () {

    let AcceptObjectsPolicyService, localStorageService, timeout, rootScope;

    let fakeAcceptObjectsPolicyProxy = {
        postGeneric: jasmine.createSpy()
    };
    let fakeCommonsHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error, attempts, callback, defer) {
            defer.reject(error);
        })
    };


    let fakeIbSessionConfigService = {
        'getEndpoint': jasmine.createSpy('getEndpoint').and.callFake(function () {
            return 'endpoint'
        })
    };


    let fakeConfig = { 'DEFAULT_ENDPOINTS': { 'objectPolicyAcceptURI': 'objectPolicyAcceptURI' }, 'numAttemps': 2, 'timeWait': 200 };
    let fakeTranslateFilter = function (input) {
        let ob = {
            'translate': function (input) {
                return input;
            }
        }
        return ob;
    };

    let fakeDatalayerUtilsService = { 'sendDatalayerErrorEvent': jasmine.createSpy() };


    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-http-services-module', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeAcceptObjectsPolicyProxy);
            $provide.value('CommonsHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('CheckinAppConstants', fakeConfig);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
        });
        inject(function ($rootScope, _AcceptObjectsPolicyService_, $timeout, _localStorageService_) {
            AcceptObjectsPolicyService = _AcceptObjectsPolicyService_;
            rootScope = $rootScope;
            timeout = $timeout;
            localStorageService = _localStorageService_;
        });
    });


    describe('When AcceptObjectsPolicyProxy is called', function () {
        it('and resolve promise,should return data', function (done) {
            inject(function ($q) {
                fakeAcceptObjectsPolicyProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                    let defer = $q.defer();
                    defer.resolve('data');
                    return defer.promise;
                });
            });
            localStorageService.set('flowId', 'flowId');
            AcceptObjectsPolicyService.acceptForbiddenObjectsPolicy(1).then(function (response) {
                expect(response).toEqual('data');
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and not have checkinId,should reject promise', function (done) {
            localStorageService.clearAll();
            AcceptObjectsPolicyService.acceptForbiddenObjectsPolicy(1).then(angular.noop, function (response) {
                expect(response.errorCode).toEqual('IB_00002');
                done();
            });
            rootScope.$digest();
        });


        describe('and reject promise', function () {
            function rejectWithError(errorCode: number, done: () => void): void {
                let mockError = { 'errorCode': errorCode, 'message': 'error' };
                inject(function ($q) {
                    fakeAcceptObjectsPolicyProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.reject(mockError)
                        return defer.promise;
                    });
                });
                localStorageService.set('flowId', 'idcheckin');
                AcceptObjectsPolicyService.acceptForbiddenObjectsPolicy(1).then(angular.noop, function (error) {
                    expect(error.errorCode).toEqual(errorCode);
                    done();
                });
                rootScope.$digest();
            }

            it('with error 401 should call to refreshToken', function (done) {
                rejectWithError(401, done);
            });

            it('with error 408', function (done) {
                rejectWithError(408, done);
            });
            it('with error 500', function (done) {
                let mockError = {
                    'data': {
                        'checkinId': 'Q2hlY2tpbkBJTlRFUk5FVF9XRUJfSUJFUklBX2liZXJpYV93ZWJfUDEzMTk3NF8yMi8wNi8yMDIxIDEyOjMwOjUyXzQ5Ml9JQkNPTTA0MW5XRUIwM185MDkwX3Yz',
                        'errors': [
                            {
                                'code': 'PAC_PACC_CC_1005',
                                'reason': 'Ha habido un problema al facturar tu vuelo. Por favor, revisa los vuelos que admiten facturación en este momento, o acude al aeropuerto para obtener tus tarjetas de embarque.',
                                'uuid': null,
                                'timeStamp': '2021-06-10 18:09'
                            }
                        ]
                    },
                    'errorCode': 500
                };

                inject(function ($q) {
                    fakeAcceptObjectsPolicyProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.reject(mockError)
                        return defer.promise;
                    });
                });
                localStorageService.set('flowId', 'idcheckin');
                AcceptObjectsPolicyService.acceptForbiddenObjectsPolicy(1).then(angular.noop, function (error) {
                    expect(error.errorCode).toEqual(500);
                    done();
                });
                rootScope.$digest();

            });
        });
    });



});