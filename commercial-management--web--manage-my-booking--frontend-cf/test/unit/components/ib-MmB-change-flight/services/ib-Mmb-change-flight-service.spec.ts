describe('ChangeFlightService Test', function () {

    var rootScope, changeFlightService;
    var data = 'test';
    var mockResponse = { data: 'promesa' };


    var fakeChangeFlightTransformer = {
        'generateInitialModel': jasmine.createSpy('generateInitialModel').and.callFake(function () {
            return 'generateInitialModel';
        }),
        'getTimeZoneList': jasmine.createSpy('getTimeZoneList').and.callFake(function () {
            return 'zoneList';
        }),
        'generateAvailabilityRequest': jasmine.createSpy('generateAvailabilityRequest').and.callFake(function () {
            return 'availabilityRequest';
        }),
        'transformAvailabilityView': jasmine.createSpy('transformAvailabilityView').and.callFake(function () {
            return 'avaiabilityView'
        })
    };

    var fakeShuttleAvailabilityService = { 'getShuttleAvailability': jasmine.createSpy() };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-Mmb-change-flight-module', function ($provide) {
            $provide.value('ChangeFlightTransformer', fakeChangeFlightTransformer);
            $provide.value('ShuttleAvailabilityService', fakeShuttleAvailabilityService);
        });
        inject(function ($rootScope, _ChangeFlightService_) {
            changeFlightService = _ChangeFlightService_;
            rootScope = $rootScope;
        });
    });


    it('When initializeModelInfo() is called return initialModelTransformer', function (done) {
        var returnedInfo = changeFlightService.initializeModelInfo();
        expect(returnedInfo).toEqual('generateInitialModel');
        done();
    });

    it('When getTimeZoneList() is called return TimezoneList', function (done) {
        var returnedInfo = changeFlightService.getTimeZoneList();
        expect(returnedInfo).toEqual('zoneList');
        done();
    });


    describe('When getFlightAvailability() is called', function () {
        it('and resolve promise , should be returned transformed data', function (done) {
            inject(function ($q) {
                fakeShuttleAvailabilityService.getShuttleAvailability = jasmine.createSpy('getShuttleAvailability').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            changeFlightService.getFlightAvailability().then(function (returnedInfo) {
                expect(returnedInfo).toEqual('avaiabilityView')
                done();
            })
            rootScope.$digest();
        });
        it('and reject promise , should be returned nothing', function (done) {
            inject(function ($q) {
                fakeShuttleAvailabilityService.getShuttleAvailability = jasmine.createSpy('getShuttleAvailability').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                });
            });
            changeFlightService.getFlightAvailability().then(angular.noop, function () {
                done();
            })
            rootScope.$digest();
        });
    });
});
