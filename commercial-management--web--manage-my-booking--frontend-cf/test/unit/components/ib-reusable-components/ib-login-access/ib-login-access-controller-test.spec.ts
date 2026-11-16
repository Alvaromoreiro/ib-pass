describe('IbLoginAccessOldController test', () => {
    var controller, $scope, $rootScope, localStorage, testCookies;

    const fakeMmBAppConstants = {
        lang: 'es',
        market: 'ES',
        COOKIES: {
            PERSONALIZATION: 'IBERIACOM_PERSONALIZATION',
            LOGGED_TOKEN: 'IBERIACOM_SSO_ACCESS',
            LOGGED_TOKEN_EXPIRATION: 'IBERIACOM_SSO_ACCESS_TO',
            LOGGED_REFRESH_TOKEN: 'IBERIACOM_SSO_REFRESH',
            LOGGED_REFRESH_TOKEN_EXPIRATION: 'IBERIACOM_SSO_REFRESH_TO',
            CHECKIN_ID: 'IBERIACOM_GDR_PA_INFO',
            BOOKING_INFO: 'IBERIACOM_GDR_PA_ACCESS',
            DYNAMIC_PRICING: 'DP',
            AIR_SHUTTLE_ERROR: 'IBERIACOM_GDR_PA_ERROR',
            DEFAULT_EXPIRY_TIME: 1000 * 60 * 60 * 24 * 365 * 10, //ten years
            DEFAULT_PATH: '/',
            OLD_COOKIE: 'JSESSIONID'
        }
    };

    var fakeFormValid = {
        $valid: true
    };

    var fakeFormFailed = {
        $valid: false
    };

    beforeEach(() => {
        angular.mock.module('ib-login-access-old-module', 'LocalStorageModule', 'ngCookies', function ($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(function (_$rootScope_, $controller, _localStorageService_, _$cookies_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            testCookies = _$cookies_;
            controller = $controller('IbLoginAccessOldController', {
                $scope: $scope
            });
        });

        
    });

    describe('init component', () => {
        it('its create correctly', () => {
            expect(controller.$onInit).toBeDefined();
        });
    });

    describe('when activate is called', () => {
        it('its should initialize loginParams correctly and channel MOBI', () => {
            localStorage.set('channel','MOBI');
            controller.$onInit();
            expect(controller.loginParams.language).toBe('es');
            expect(controller.loginParams.market).toBe('ES');
        });
        it('its should initialize loginParams correctly and channel null', () => {
            localStorage.set('channel', null);
            controller.$onInit();
            expect(controller.loginParams.language).toBe('es');
            expect(controller.loginParams.market).toBe('ES');
        });
    });

    describe('when doLogin is called & loginForm is not valid', () => {
        it('its should call event preventDefault ', () => {
            var e = jasmine.createSpyObj('e', ['preventDefault']);
            controller.doLogin(fakeFormFailed, e);
            expect(e.preventDefault).toHaveBeenCalled();
        });
    });

    describe('when doLogin is called & loginForm is valid', () => {
        it('its should emit event showWaitingModal with email', () => {
            spyOn($scope,'$emit');
            var e = jasmine.createSpyObj('e', ['preventDefault']);
            controller.user = '12345';
            controller.doLogin(fakeFormValid, e);
            expect($scope.$emit).toHaveBeenCalledWith('showWaitingModal');
        });
        it('its should emit event showWaitingModal with ffnumber', () => {
            spyOn($scope,'$emit');
            var e = jasmine.createSpyObj('e', ['preventDefault']);
            controller.user = 'User12345';
            controller.doLogin(fakeFormValid, e);
            expect($scope.$emit).toHaveBeenCalledWith('showWaitingModal');
        });
    });
});
