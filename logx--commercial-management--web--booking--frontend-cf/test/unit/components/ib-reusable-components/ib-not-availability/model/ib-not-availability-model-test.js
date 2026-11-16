describe('NotAvaibilityModel Test', function () {
    var model;
    var fakeLetMeKnowRequest = {
        'SaleForceContactId':'0038E00000nfClHQAU',
        'FrequentFlier': '12345678',
        'Email': 'raul.perez@gmail.com',
        'Name': 'RAUL',
        'Surname':'PEREZ LOPEZ',
        'DepartureAirport': 'MAD',
        'ArrivalAirport': 'LGW',
        'Origin': 'Madrid(MAD)',
        'Destination': 'Londres(LON)',
        'TripType': 'RT',
        'OutboundDate': '20-02-2020',
        'InboundDate': '15-03-2020',
        'AdultsPassengers': '2',
        'ChildPassengers': '0',
        'RdmClasses': 'Todas',
        'Timestamp': '2020-02-10.12:30:21.123456',  
        'Languages': 'ES'
    };
    beforeEach(function () {

        angular.mock.module('ib-not-avaibility-module', function () {
        });

        inject(function (_NotAvaibilityModel_) {
            model = _NotAvaibilityModel_;
        });
    });
    describe('When initializeModel is called', function () {
        it('set default data', function (done) {
            model.initializeModel();
            expect(model.letMeKnowRequest).toEqual(fakeLetMeKnowRequest);
            done();
        });
        it('its defined', function (done) {
            expect(model).toBeDefined();
            done();
        });
    });
});