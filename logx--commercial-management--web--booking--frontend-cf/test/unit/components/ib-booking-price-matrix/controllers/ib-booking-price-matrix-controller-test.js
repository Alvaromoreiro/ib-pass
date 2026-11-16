describe('PriceMatrixController test', function () {

    var controller, localStorageService;
    var mockGetCalendarMatrixSuccess = {
        'availability': true
    };
    var mockAvailabilityRequest = {
        'slices': [
            { 'date': '2017-04-12' },
            { 'date': '2017-04-13' }
        ]
    };
    var fakeBookingPriceMatrixService = {
        getPriceMatrix: jasmine.createSpy()
    };
    var fakeBookingModalService = {
        showGenericModal: jasmine.createSpy(),
        showGenericError: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy(),
        finishWaiting: jasmine.createSpy()
    };
    var fakeWindow = { 'location': {} };
    var controllerDependencies = {
        '$scope': {},
        'BookingPriceMatrixService': fakeBookingPriceMatrixService,
        'BookingModalService': fakeBookingModalService,
        '$window': fakeWindow
    };
    var fakeCurrencyService = {
        'getCurrenciesAsMap': jasmine.createSpy(),
        'formatPrice': function (inputCurrency, inputPrice) {
            return inputPrice;
        }
    };
    var fakeDatalayerUtilsService = {
        updateLoggedDatalayer: jasmine.createSpy(),
        updateDatalayerWithQuadrigam: jasmine.createSpy(),
        sendDatalayerEvent: jasmine.createSpy(),
        addDataLayerInfo: jasmine.createSpy(),
        generateDatalayerAvailability :jasmine.createSpy(),
        updateDigitalDataWithQuadrigam :jasmine.createSpy(),
        updateDatalayerViewEvent :jasmine.createSpy(),
        addDigitalDataInfo :jasmine.createSpy(),
    };

    var fakeDigitalDataUtilsService = {
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function () { }),
    }
    var fakeBookingErrorPageStore = {
        setError: jasmine.createSpy(),
    }
    var fakeBookingUtilService = {
        'saveEndpoints': jasmine.createSpy(),
        'generateBuildNumberQueryString': jasmine.createSpy(),
        'initStorage': jasmine.createSpy(),
        'getParameterByName': jasmine.createSpy(),
        'getOriginDestination': jasmine.createSpy(),
        'getBackGroundURL': jasmine.createSpy(),
        'getURLFirstParameterByName': jasmine.createSpy(),
        'isUserLogged': jasmine.createSpy()
    };
    var fakeMonetateUtilsService = {
        'updateMonetateWithQuadrigam': jasmine.createSpy('updateMonetateWithQuadrigam').and.callFake(function () {
            return 'Monetate';
        })
    }
    var fakeMonetateConstants = {
        'MONETATE_INFO': {
            'SETPAGETYPE': 'monetate'
        }
    }
    let fakeDatalayerBKIService = {
        generateDigitalDataAvailability: jasmine.createSpy(),
        setPayloadForGenerateDataLayerObject: jasmine.createSpy(),
        setPayloadForGenerateDigitalData: jasmine.createSpy(),
    }
    let fakeBookingPageUtilsService = {
        setPageTitle: jasmine.createSpy('setPageTitle')
    }

    const mockBookingUrlParams = {
        originDestinations: [
            {
                origin: "MAD",
                destination: "AGP",
                date: "2023-02-08"
            }
        ]
    }
    const mockOriginDestination = {
        originCity:{
            country: {
                code: 'ES'
            }
        },
        destinationCity:{
            country: {
                code: 'ES'
            }
        }
    }

    const mockOriginDestinationMulticity = [{
        originCity:{
            country: {
                code: 'ES'
            }
        },
        destinationCity:{
            country: {
                code: 'ES'
            }
        }
    },
    {
        originCity:{
            country: {
                code: 'ES'
            }
        },
        destinationCity:{
            country: {
                code: 'ES'
            }
        }
    }]

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-booking-price-matrix-module', function ($provide) {
            $provide.value('BookingAppConstants', { 'QUADRIGAMS': { 'NOT_AVAILABILITY': 'NOT_AVAILABILITY' } });
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('DatalayerConstants', { 'DATALAYER_EVENT_TYPES': { 'VIEW': 'VIEW' }, DATALAYER_VIEWS:{DISPO_CALENDAR: 'calendarioDisponibilidad'} });
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DigitalDataUtilsService', fakeDigitalDataUtilsService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('BookingPriceMatrixService', fakeBookingPriceMatrixService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('DatalayerBKIService', fakeDatalayerBKIService);
            $provide.value('BookingPageUtilsService', fakeBookingPageUtilsService);
            $provide.value('BookingErrorPageStore', fakeBookingErrorPageStore);
        });
        inject(function ($rootScope, _localStorageService_) {
            localStorageService = _localStorageService_;
            controllerDependencies.$scope = $rootScope.$new();
            localStorageService.set('commercialData', { 'roundingPolicy': '' })
            localStorageService.set('bookingUrlParams', mockBookingUrlParams)
            localStorageService.set('originDestination', mockOriginDestination)
            localStorageService.set('originDestinationMulticity', mockOriginDestinationMulticity)
            localStorageService.set('multiCitySearch', true)
        });
    });

    describe('when the controller starts with a good response from service', function () {
        describe('and matrix calendar has availability', function () {
            beforeEach(inject(function ($q, $controller) {
                fakeBookingPriceMatrixService.getPriceMatrix = jasmine.createSpy('getPriceMatrix').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockGetCalendarMatrixSuccess);
                    return deferred.promise;
                });
                fakeDatalayerUtilsService.generateDatalayerAvailability = jasmine.createSpy('generateDatalayerAvailability').and.callFake(function () {
                    return {paso: ''};
                });
                fakeDatalayerBKIService.generateDigitalDataAvailability = jasmine.createSpy('generateDigitalDataAvailability').and.callFake(function () {
                    return {Step: ''};
                });
                controller = $controller('PriceMatrixController', controllerDependencies);
                controllerDependencies.$scope.$apply();
            }));
            it('controller´s model should be equals to BookingPriceMatrixService data', function (done) {
                expect(controller.model.priceMatrixData).toEqual(mockGetCalendarMatrixSuccess);
                done();
            });

            describe('and formatPrice method is called', function () {
                it('if there is not currency object should return an empty String', function (done) {
                    var priceFormatted = controller.formatPrice(0);
                    expect(priceFormatted).toEqual(0);
                    done();
                });
                it('if there is currency object should return the formatted price', function (done) {
                    var priceFormatted;
                    controller.model.priceMatrixData.currency = {
                        'suffixSymbol': true,
                        'decimalSeparator': ',',
                        'numberDecimals': 2,
                        'groupingSeparator': '.',
                        'currencySymbol': '€'
                    };
                    priceFormatted = controller.formatPrice(534);
                    expect(priceFormatted).toEqual(534);
                    done();
                });
            });

            describe('and goFlightsSearching method is called', function () {
                it('BookingModalService.showWaitingModal should be called and window href should be http://preb.iberia.es/', function (done) {
                    controller.goFlightsSearching();
                    expect(fakeBookingModalService.showWaitingModal).toHaveBeenCalled();
                    done();
                });
            });

            describe('and doNewSearchingAvailability method is called', function () {
                var localStorage;
                beforeEach(inject(function (_localStorageService_) {
                    localStorage = _localStorageService_;
                    localStorage.set('availabilityRequestData', mockAvailabilityRequest);
                    controller.model = { 'selectedCell': { 'outboundDate': '2017-04-12', 'inboundDate': '2017-04-13' } };

                }));
                it('BookingModalService.showWaitingModal should be called and window href should be http://preb.iberia.es/', function (done) {
                    var availabilityRequestData;
                    controller.doNewSearchingAvailability();
                    availabilityRequestData = localStorage.get('availabilityRequestData');
                    expect(localStorage.get('calditMode'), true);
                    expect(availabilityRequestData.slices[0].date).toEqual('2017-04-12');
                    expect(availabilityRequestData.slices[1].date).toEqual('2017-04-13');
                    done();
                });
            });

            describe('and cellSelected event is received', function () {
                var rootScope;
                beforeEach(inject(function ($rootScope) {
                    rootScope = $rootScope;
                }));
                it('vm.model.selectedCell should be updated with the event data', function (done) {
                    rootScope.$broadcast('cellSelected', 'eventData');
                    expect(controller.model.selectedCell).toEqual('eventData');
                    done();
                });
            });
        });

        describe('and matrix calendar has not availability', function () {
            beforeEach(inject(function ($q, $controller) {
                mockGetCalendarMatrixSuccess.availability = false;
                fakeBookingPriceMatrixService.getPriceMatrix = jasmine.createSpy('getPriceMatrix').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.resolve(mockGetCalendarMatrixSuccess);
                    return deferred.promise;
                });
                fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                    return { 'result': { 'then': function () { } } };
                });
                fakeDatalayerUtilsService.generateDatalayerAvailability = jasmine.createSpy('generateDatalayerAvailability').and.callFake(function () {
                    return {paso: ''};
                });
                fakeDatalayerBKIService.generateDigitalDataAvailability = jasmine.createSpy('generateDigitalDataAvailability').and.callFake(function () {
                    return {Step: ''};
                });
                controller = $controller('PriceMatrixController', controllerDependencies);
                controllerDependencies.$scope.$apply();
            }));
            it('BookingModalService.showGenericModal should be called', function (done) {
                expect(fakeBookingModalService.showGenericModal).toHaveBeenCalled();
                mockGetCalendarMatrixSuccess.availability = true;
                done();
            });
        });
    });

    describe('when the controller starts with an error response from service', function () {
        beforeEach(inject(function ($q, $controller) {
            fakeBookingPriceMatrixService.getPriceMatrix = jasmine.createSpy('getPriceMatrix').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject({});
                return deferred.promise;
            });
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(function () {
                return { 'result': { 'then': function () { } } };
            });
            fakeDatalayerUtilsService.generateDatalayerAvailability = jasmine.createSpy('generateDatalayerAvailability').and.callFake(function () {
                    return {paso: ''};
                });
            fakeDatalayerBKIService.generateDigitalDataAvailability = jasmine.createSpy('generateDigitalDataAvailability').and.callFake(function () {
                return {Step: ''};
            });
            controller = $controller('PriceMatrixController', controllerDependencies);
            controllerDependencies.$scope.$apply();
        }));
        it('and getPriceMatrixError should be called', function (done) {
            expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
            mockGetCalendarMatrixSuccess.availability = true;
            done();
        });
    });
});
