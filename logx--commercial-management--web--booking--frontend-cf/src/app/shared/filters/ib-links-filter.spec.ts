describe('LinksFilter test', function () {

    var LinksFilter;
    var fakeWindows = {
        'location': { 'origin': 'iberia.com' }
    };
    var fakeBookingAppConstants = { 'market': 'ES' };
    var fakeLocalStorageService = {
        'get': jasmine.createSpy('get').and.callFake(function (id) {
            return { 'test': { 'needsOrigin': true, 'needsMarket': true, 'uri': '/uriTest' } };
        }),
    };

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module', function ($provide) {
            $provide.value('$window', fakeWindows);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('localStorageService', fakeLocalStorageService);
        });
        inject(function ($filter) {
            LinksFilter = $filter('LinksFilter', {});
        });
    });
    describe('when getLink is called', function () {
        it('when id exists in linksList', function (done) {
            var id = 'test';
            expect(LinksFilter(id)).toEqual('iberia.com/es/uriTest');
            done();
        });
    });
});