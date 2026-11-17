describe('NewLinksFilter', function () {

    var newLinksFilter, localStorageService, config;

    const fakeCheckinAppConstants = {
        market: 'ES'
    };

    const fakelocalStorageService = {
        get: jasmine.createSpy('get')
    };

    beforeEach(angular.mock.module('ib-filter-module', ($provide) => {
        $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
        $provide.value('localStorageService', fakelocalStorageService);
    }));

    beforeEach(inject(function (_CheckinAppConstants_, $window, _localStorageService_) {
        config = _CheckinAppConstants_;
        localStorageService = _localStorageService_;
        $window.innerWidth = null;
    }));

    describe('when LinksFilter is called', function () {
        beforeEach(inject(function ($filter) {
            newLinksFilter = $filter('NewLinksFilter', {});

        }));

        it('should be able to return url', inject(function ($rootScope, $window) {
            const linkId = 'IB_RECOVER_PASSWORD_LINK';
            fakelocalStorageService.get.and.returnValue({});

            const result = newLinksFilter(linkId);

            expect(result).toBe('/' + linkId);

        }));
    });

});
