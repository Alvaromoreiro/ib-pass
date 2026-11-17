describe('CheckBookingStatusService test', function () {

    var CheckBookingStatusService, rootScope;
    var data = 'test';

    var mockAncillaries = {
        'passengers': [{ 'status': { 'code': 'ALLOWED' } }],
        'airShuttleSegments': []
    };


    var fakeConfig = { 'GENERAL_PASSENGERS_STATUS': { 'ALLOWED': 'ALLOWED' } };


    beforeEach(function () {
        angular.mock.module('ib-checkin-services-module', function ($provide) {
            $provide.value('CheckinAppConstants', fakeConfig);
        });
        inject(function ($rootScope, _CheckBookingStatusService_) {
            CheckBookingStatusService = _CheckBookingStatusService_;
            rootScope = $rootScope;
        });
    });


    it('When checkBookingStatus() is called', function (done) {
        var returnedValue = CheckBookingStatusService.checkBookingStatus(mockAncillaries);
        expect(returnedValue).toBe(true);
        done()
    });

});