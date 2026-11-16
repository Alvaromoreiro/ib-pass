describe('MmBLanguageAndMarketService test', function () {

    var MmBLanguageAndMarketService, testCookies, $window;

    var fakeMmBUtilService = { 'getParameterByName': jasmine.createSpy() };
    var fakeMmBAppConstants = {
        'availableLanguages': ['en', 'es', 'ls', 'zh', 'ca', 'de', 'fr', 'it', 'pt', 'ja', 'nl', 'ru'],
        'defaultLang': 'es',
        'defaultMarket': 'ES',
        'COOKIES': {
            'PERSONALIZATION': 'IBERIACOM_PERSONALIZATION',
            'DEFAULT_EXPIRY_TIME': 3650,
            'DEFAULT_PATH': '/'
        },
        'nameParameters': { 'lang': 'language', 'market': 'market' },
    };

    beforeEach(function () {
        angular.mock.module('ngCookies', 'ib-MmB-services-module', function ($provide) {
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });

        inject(function (_MmBLanguageAndMarketService_, _$cookies_, _$window_) {
            MmBLanguageAndMarketService = _MmBLanguageAndMarketService_;
            testCookies = _$cookies_;
            $window = _$window_;
        });
    });

    describe('when init is called', function () {

        it('and language and market is in url as parameter and language exists in MmBAppConstants.availableLanguages, MmBAppConstants.lang and MmBAppConstants.market should be url parameter', function (done) {
            fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake(function (name) {
                return name === fakeMmBAppConstants.nameParameters.lang ? 'ja' : name === fakeMmBAppConstants.nameParameters.market ? 'JP' : name;
            });
            MmBLanguageAndMarketService.init();
            expect(fakeMmBAppConstants.nameParameters.lang = 'ja');
            expect(fakeMmBAppConstants.nameParameters.market = 'JP');
            testCookies.remove(fakeMmBAppConstants.COOKIES.PERSONALIZATION);
            done();
        });

        it('and language and market is in url as parameter and language does not exist in MmBAppConstants.availableLanguages, MmBAppConstants.lang should be default and MmBAppConstants.market should url param', function (done) {
            fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake(function (name) {
                return name === fakeMmBAppConstants.nameParameters.lang ? 'xx' : name === fakeMmBAppConstants.nameParameters.market ? 'MX' : name;
            });
            MmBLanguageAndMarketService.init();
            expect(fakeMmBAppConstants.nameParameters.lang = fakeMmBAppConstants.defaultLang);
            expect(fakeMmBAppConstants.nameParameters.market = 'MX');
            testCookies.remove(fakeMmBAppConstants.COOKIES.PERSONALIZATION);
            done();
        });

        it('and language and market is not in url as parameter and is in cookie and language exists in MmBAppConstants.availableLanguages, MmBAppConstants.lang and MmBAppConstants.market should be cookie data', function (done) {
            testCookies.put(fakeMmBAppConstants.COOKIES.PERSONALIZATION, 'PE|PE|it| | |PE|');
            fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake(function (name) {
                return null;
            });
            MmBLanguageAndMarketService.init();
            expect(fakeMmBAppConstants.nameParameters.lang = 'it');
            expect(fakeMmBAppConstants.nameParameters.market = 'PE');
            testCookies.remove(fakeMmBAppConstants.COOKIES.PERSONALIZATION);
            done();
        });

        it('and language and market is not in url or cookie, MmBAppConstants.lang must be browser language and MmBAppConstants.market should be default', function (done) {
            var browserLanguage;
            inject(function ($window) {
                browserLanguage = $window.navigator.language || $window.navigator.browserLanguage;
                browserLanguage = browserLanguage && browserLanguage.split('-')[0];
            });
            fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake(function (name) {
                return null;
            });
            MmBLanguageAndMarketService.init();
            expect(fakeMmBAppConstants.nameParameters.lang = browserLanguage);
            expect(fakeMmBAppConstants.nameParameters.market = fakeMmBAppConstants.defaultMarket);
            testCookies.remove(fakeMmBAppConstants.COOKIES.PERSONALIZATION);
            done();
        });
    });
});
