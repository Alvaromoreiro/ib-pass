describe('FlightNowService ', function () {

    var FlightNowService, localStorageService, timeout, rootScope;
    var mockError = {
        'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] }
    };
    var mockResponse = 'response';

    var mockFilter = function (input) {
        var ob = {
            'translate': function (input) {
                return input;
            }
        }
        return ob;
    };

    var fakeModalService = {
        isWaiting: jasmine.createSpy('isWaiting').and.callFake(angular.noop),
        isNotWaiting: jasmine.createSpy('isNotWaiting').and.callFake(angular.noop),
        setErrorMessage: jasmine.createSpy(),
        setErrorCode: jasmine.createSpy(),
        isError: jasmine.createSpy('isError').and.callFake(function () {
            return { 'result': { 'then': angular.noop } };
        })
    };
    var fakeGetAvailabilityFlightNowService = { 'getAvailabilityFlightNow': jasmine.createSpy() };
    var fakeFlightNowTransformer = {
        'transformFlightNowInfo': jasmine.createSpy('transformFlightNowInfo').and.callFake(function () {
            return mockResponse;
        }),
        'createFlyNowRequest': jasmine.createSpy('createFlyNowRequest').and.callFake(function () {
            return mockResponse;
        })
    };

    var fakeGetAirlinesService = { 'getAirlines': jasmine.createSpy() };


    beforeEach(function () {
        angular.mock.module('ib-flight-now-module', 'LocalStorageModule', function ($provide) {
            $provide.value('ModalService', fakeModalService);
            $provide.value('GetAvailabilityFlightNowService', fakeGetAvailabilityFlightNowService);
            $provide.value('FlightNowTransformer', fakeFlightNowTransformer);
            $provide.value('GetAirlinesService', fakeGetAirlinesService);
        });
        inject(function (_FlightNowService_, _localStorageService_, $rootScope) {
            FlightNowService = _FlightNowService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        })
    })


    describe('When getAvailabilityFlightNow is called', function () {
        it('and resolve promise, should return data', function (done) {
            inject(function ($q) {
                fakeGetAvailabilityFlightNowService.getAvailabilityFlightNow = jasmine.createSpy('getAvailabilityFlightNow').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });

                fakeGetAirlinesService.getAirlines = jasmine.createSpy('getAirlines').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            localStorageService.set('selectedBlockPa', 'data'), localStorageService.set('flowId', 'data')
            FlightNowService.getAvailabilityFlightNow().then(function (response) {
                expect(response).toEqual(mockResponse);
                done();
            }, angular.noop);
            rootScope.$digest();
        });
        it('and resolve promise, should return data', function (done) {
            inject(function ($q) {
                fakeGetAvailabilityFlightNowService.getAvailabilityFlightNow = jasmine.createSpy('getAvailabilityFlightNow').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                

            });
            localStorageService.set('selectedBlockPa', 'data'), localStorageService.set('flowId', 'data')
            FlightNowService.getAvailabilityFlightNow().then(angular.noop, function (error) {
                expect(fakeModalService.isNotWaiting).toHaveBeenCalled();
                expect(error).toEqual(mockError);
                done();
            });
            rootScope.$digest();
        });
    });
});


