describe('LinksFilter test', function () {

    var dataTest, linksFilter, localStorageService, config;

    const fakeCheckinAppConstants = {
        lang: 'es',
        market: 'ES',
    }

    const fakelocalStorageService = {
        get: jasmine.createSpy('get')
    };

    beforeEach(angular.mock.module('ib-filter-module', ($provide) => {
        $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
        $provide.value('localStorageService', fakelocalStorageService);
    }));

    beforeEach(inject(function (_CheckinAppConstants_, _localStorageService_) {
        config = _CheckinAppConstants_;
        localStorageService = _localStorageService_;
    }));

    describe('when LinksFilter is called', function () {
        beforeEach(inject(function ($filter) {
            linksFilter = $filter('LinksFilter', {});
        }));

        it('should be able to return url', inject(function ($rootScope, $window) {
            dataTest = 'IBCOSE_MOD_INFOCK_LINK_PIN';
            expect(linksFilter(dataTest, 'ja')).toBe($window.location.origin + '/es/iberiaplus/recover-password/');
        }));
    });

    describe('when LinksFilter is called with IBCOCF&IBECCF_LINK_RENT identifier', function () {
        beforeEach(inject(function ($filter) {
            linksFilter = $filter('LinksFilter', {});
            dataTest = 'IBCOCF&IBECCF_LINK_RENT';
        }));

        it('and language is "es" should return IBCOCF&IBECCF_LINK_RENT_ES link', inject(function ($rootScope) {
            expect(linksFilter(dataTest, 'es')).toBe('http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/home');
        }));

        it('and language is "pt" should return IBCOCF&IBECCF_LINK_RENT_PT link', inject(function ($rootScope) {
            expect(linksFilter(dataTest, 'pt')).toBe('http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/pt+home_');
        }));

        it('and language is not "es" or "pt" should return IBCOCF&IBECCF_LINK_RENT_EN link', inject(function ($rootScope) {
            expect(linksFilter(dataTest, 'zh')).toBe('http://production.rent-at-avis.com/avisonline/es/avis_iberia.nsf/c/gb+home');
        }));
    });
});
