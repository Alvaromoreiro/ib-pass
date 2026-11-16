describe('NotAvailabilityService test', function () {
    var NotAvaibilityService, rootScope;

    var fakeCurrentModel = {
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

    var fakeLetMeKnowService = {
        'sendAlert': jasmine.createSpy('sendAlert').and.callFake(function () {
            return 'sendtest';
        })
    };

    beforeEach(function () {

        angular.mock.module('ib-not-avaibility-module', function ($provide) {
            $provide.value('LetMeKnowService', fakeLetMeKnowService);
        });

        inject(function (_NotAvaibilityService_, $rootScope) {

            NotAvaibilityService = _NotAvaibilityService_;
            rootScope = $rootScope;
        });

    });
    describe('When sendAlertLetMeKnow is called', function () {
        it('its defined', function (done) {
            expect(NotAvaibilityService).toBeDefined();
            done();
        });
   
    
        it('its defined', function (done) {
            expect(NotAvaibilityService.sendAlert).toHaveBeenCalled;
            done();
        });
        
        it('and sendAlertLetMeKnow resolve promise', function (done) {
            var copyFakeCurrentModel;
            inject(function ($q) {
                fakeLetMeKnowService.sendAlert = jasmine.createSpy('sendAlert').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve( 'data' );
                    return defer.promise;
                });
            });
            copyFakeCurrentModel = angular.copy(fakeCurrentModel);

            fakeLetMeKnowService.sendAlert(copyFakeCurrentModel).then(function (request) {
                expect(request).toEqual('data');
                done();
            });
            rootScope.$digest();
        });
        
    });
});