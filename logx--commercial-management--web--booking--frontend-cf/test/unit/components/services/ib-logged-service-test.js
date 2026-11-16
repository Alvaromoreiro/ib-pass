xdescribe('LoggedService test', function () {

    var LoggedService, testCookies, localStorageService, rootScope;

    var fakeBookingModalService = {
        showGenericError: jasmine.createSpy()
    };

    var fakeCustomerDataService = { 'getCustomerData': jasmine.createSpy() };
    var fakeOnBusinessMembershipService = { 'getOnBusinessMembership': jasmine.createSpy() };
    var fakeOnBusinessEmployeesService = { 'getOnBusinessEmployees': jasmine.createSpy() };
    var fakeBookingUtilService = { 'getURLFirstParameterByName': jasmine.createSpy() };
    var fakeBookingTokenService = { 'refreshUserLoggedToken': jasmine.createSpy() };
    var fakeBookingAppConstants = { 'BOOKING_PARAMS_NAMES': {}, 'COOKIES': {} };
    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy()
    };
    // var fakeDatalayerConstants = getJSONFixture('./constants/DatalayerConstants-mock.json');

    var mockJSON = {
        'cookiesSSOInfo': [
            'FakeCookie'
        ]
    };
    var fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ngCookies', 'ib-booking-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('IbCCustomerDataService', fakeCustomerDataService);
            $provide.value('OnBusinessMembershipService', fakeOnBusinessMembershipService);
            $provide.value('OnBusinessEmployeesService', fakeOnBusinessEmployeesService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('BookingTokenService', fakeBookingTokenService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('BookingRedirectionService', fakeRedirectionService);
        });

        inject(function (_LoggedService_, $cookies, _localStorageService_, $rootScope) {
            LoggedService = _LoggedService_;
            testCookies = $cookies;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
        });

        testCookies.remove('IBERIACOM_SSO_ACCESS');
        testCookies.remove('IBERIACOM_SSO_ACCESS_TO');
        testCookies.remove('IBERIACOM_SSO_REFRESH');
        testCookies.remove('IBERIACOM_SSO_REFRESH_TO');
        testCookies.remove('IBERIACOM_SSO_INFO');
        testCookies.remove('IBERIACOM_SSO_ONB_ACCESS');
        testCookies.remove('IBERIACOM_SSO_ONB_ACCESS_TO');
        testCookies.remove('IBERIACOM_SSO_ONB_REFRESH');
        testCookies.remove('IBERIACOM_SSO_ONB_REFRESH_TO');
    });
    
    describe('When checkCustomerStatus() is called', function () {
        it('and don´t have error code and its not logged, should do nothing', function (done) {
            inject(function ($q) {
                fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                    return '';
                });
            });
            LoggedService.checkCustomerStatus();
            expect(localStorageService.get('userLogged')).toBe(false);
            done();
            rootScope.$digest();
        });

        it('and have error code, so calls BookingModalService() and resolves (really rejects the promise)', function (done) {
            inject(function ($q) {
                fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                    return '500';
                });
                fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(function () {
                    return { 'result': { 'then': function () { } } };
                });
            });
            LoggedService.checkCustomerStatus();
            done();
            rootScope.$digest();
        });

        it('and there is not error code and user is logged with SSO Info cookie', function (done) {
            inject(function ($q) {
                fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                    return '';
                });
                fakeCustomerDataService.getCustomerData = jasmine.createSpy('getCustomerData').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            testCookies.put('IBERIACOM_SSO_ACCESS', 'test');
            testCookies.put('IBERIACOM_SSO_ACCESS_TO', '10/07/2090');
            testCookies.put('IBERIACOM_SSO_REFRESH', 'test');
            testCookies.put('IBERIACOM_SSO_REFRESH_TO', '10/07/2090');
            testCookies.put('IBERIACOM_SSO_INFO', '{"loggedBy":"ffnumber"}');
            LoggedService.checkCustomerStatus();
            expect(localStorageService.get('userLogged')).toBe(true);
            done();
            rootScope.$digest();
        });

        it('and there is not error code and user is logged with SSO Info cookie but have to refresh token (and it goes well)', function (done) {
            var mockResponse = {
                'access_token': 'TEST',
                'refresh_token': true
            };
            inject(function ($q) {
                fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                    return '';
                });
                fakeCustomerDataService.getCustomerData = jasmine.createSpy('getCustomerData').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeBookingTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            testCookies.put('IBERIACOM_SSO_ACCESS', 'test');
            testCookies.put('IBERIACOM_SSO_ACCESS_TO', '10/07/2010');
            testCookies.put('IBERIACOM_SSO_REFRESH', 'test');
            testCookies.put('IBERIACOM_SSO_REFRESH_TO', '10/07/2090');
            LoggedService.checkCustomerStatus();
            fakeBookingTokenService.refreshUserLoggedToken().then(function () {
                expect(localStorageService.get('userLogged')).toBe(true);
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and there is not error code and user is logged with SSO Info cookie but have to refresh token (and it goes wrong)', function (done) {
            var mockResponse = {
                'access_token': 'TEST',
                'refresh_token': true
            };
            inject(function ($q) {
                fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                    return '';
                });
                fakeCustomerDataService.getCustomerData = jasmine.createSpy('getCustomerData').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeBookingTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockResponse);
                    return deferred.promise;
                });
            });
            testCookies.put('IBERIACOM_SSO_ACCESS', 'test');
            testCookies.put('IBERIACOM_SSO_ACCESS_TO', '10/07/2010');
            testCookies.put('IBERIACOM_SSO_REFRESH', 'test');
            testCookies.put('IBERIACOM_SSO_REFRESH_TO', '10/07/2090');
            LoggedService.checkCustomerStatus();
            fakeBookingTokenService.refreshUserLoggedToken().then(angular.noop, function () {
                done();
            });
            rootScope.$digest();
        });

        it('and there is not error code and user is logged without SSO Info cookie', function (done) {
            inject(function ($q) {
                fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                    return '';
                });
                fakeCustomerDataService.getCustomerData = jasmine.createSpy('getCustomerData').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            testCookies.put('IBERIACOM_SSO_ACCESS', 'test');
            testCookies.put('IBERIACOM_SSO_ACCESS_TO', '10/07/2090');
            testCookies.put('IBERIACOM_SSO_REFRESH', 'test');
            testCookies.put('IBERIACOM_SSO_REFRESH_TO', '10/07/2090');
            LoggedService.checkCustomerStatus();
            expect(localStorageService.get('userLogged')).toBe(true);
            done();
            rootScope.$digest();
        });

        it('and there is not error code and user is logged ONB without SSO Info cookie', function (done) {
            inject(function ($q) {
                fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                    return '';
                });
                fakeOnBusinessMembershipService.getOnBusinessMembership = jasmine.createSpy('getOnBusinessMembership').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS', 'test');
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS_TO', '10/07/2090');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH', 'test');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH_TO', '10/07/2090');
            LoggedService.checkCustomerStatus();
            expect(localStorageService.get('loggedToken')).toEqual('test');
            done();
            rootScope.$digest();
        });

        it('and there is not error code and user is logged ONB without SSO Info cookie, but have to refresh token', function (done) {
            var mockResponse = 'ONB';
            inject(function ($q) {
                fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(function () {
                    return '';
                });
                fakeBookingTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
                fakeOnBusinessEmployeesService.getOnBusinessEmployees = jasmine.createSpy('getOnBusinessEmployees').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeOnBusinessMembershipService.getOnBusinessMembership = jasmine.createSpy('getOnBusinessMembership').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
            });
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS', 'test');
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS_TO', '10/07/2010');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH', 'test');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH_TO', '10/07/2090');
            LoggedService.checkCustomerStatus();
            fakeBookingTokenService.refreshUserLoggedToken().then(function () {
                expect(localStorageService.get('loggedToken')).toEqual('test');
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });

    //-------------------

    describe('When checkLoginStatus() is called', function () {
        it('and user is NOT logged (not IBPlus and not ONB)', function (done) {
            LoggedService.checkLoginStatus();
            expect(localStorageService.get('userLogged')).toBe(false);
            done();
            rootScope.$digest();
        });

        it('and user is logged IBPlus with access and refresh to cookies active', function (done) {
            testCookies.put('IBERIACOM_SSO_ACCESS', 'test');
            testCookies.put('IBERIACOM_SSO_ACCESS_TO', '10/07/2090');
            testCookies.put('IBERIACOM_SSO_REFRESH', 'test');
            testCookies.put('IBERIACOM_SSO_REFRESH_TO', '10/07/2090');

            LoggedService.checkLoginStatus();
            expect(localStorageService.get('loggedToken')).toEqual('test');
            expect(localStorageService.get('userLogged')).toBe(true);
            done();
            rootScope.$digest();
        });

        it('and user is logged IBPlus with access cookie expired but refresh to cookie active', function (done) {
            var mockResponse = {
                'access_token': 'test',
                'refresh_token': true
            };

            inject(function ($q) {
                fakeBookingTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });

            testCookies.put('IBERIACOM_SSO_ACCESS', 'test');
            testCookies.put('IBERIACOM_SSO_ACCESS_TO', '10/07/2010');
            testCookies.put('IBERIACOM_SSO_REFRESH', 'test');
            testCookies.put('IBERIACOM_SSO_REFRESH_TO', '10/07/2090');

            LoggedService.checkLoginStatus();
            fakeBookingTokenService.refreshUserLoggedToken().then(function () {
                expect(localStorageService.get('loggedToken')).toEqual('test');
                expect(localStorageService.get('userLogged')).toEqual(true);
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and user is logged ONB with access and refresh to cookies active', function (done) {
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS', 'onb');
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS_TO', '10/10/2090');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH', 'onb');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH_TO', '10/10/2090');

            LoggedService.checkLoginStatus();
            expect(localStorageService.get('loggedToken')).toEqual('onb');
            done();
            rootScope.$digest();
        });

        it('and user is logged ONB with access cookie expired and refresh to cookies active', function (done) {
            var mockResponse = {
                'access_token': 'onb',
                'refresh_token': true
            };
            inject(function ($q) {
                fakeBookingTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS', 'onb');
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS_TO', '10/10/2010');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH', 'onb');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH_TO', '10/10/2090');

            LoggedService.checkLoginStatus();
            fakeBookingTokenService.refreshUserLoggedToken().then(function () {
                expect(localStorageService.get('loggedToken')).toEqual('onb');
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and user is logged ONB with access cookie expired and refresh to cookies active', function (done) {
            var mockError = {
                'title': 'err',
                'needsTranslate': true
            }
            inject(function ($q) {
                fakeBookingTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });

            testCookies.put('IBERIACOM_SSO_ONB_ACCESS', 'onb');
            testCookies.put('IBERIACOM_SSO_ONB_ACCESS_TO', '10/10/2010');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH', 'onb');
            testCookies.put('IBERIACOM_SSO_ONB_REFRESH_TO', '10/10/2090');

            LoggedService.checkLoginStatus();

            fakeBookingTokenService.refreshUserLoggedToken().then(angular.noop, function () {
                expect(localStorageService.get('userLogged')).toEqual(false);
                done();
            });

            rootScope.$digest();
        });
    });
});