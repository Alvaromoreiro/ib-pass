import angular from 'angular';
import { MmBDatalayerUtilsServiceMock } from '@test/mocks/services/MmBDatalayerUtilsServiceMock';
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';

describe('ibMmbBookingAvailability test', () => {

    let $componentController, $rootScope, $scope, controller, expectData, $q, localStorage, fakeDatalayerUtilsService;

    let fakeNewSisterCitiesModel = {
        'MADFCO20210315090500': {
            origin: {
                originSisterCities: [{code: 'MAD'}],
                originOrderCities: {description: 'MAD'},
            },
            destination: {
                destinationSisterCities: 'Bilbao',
                destinationOrderCities: {description: 'MAD'},
            },
            originSisterCitiesNum: null,
            destinationSisterCitiesNum: null,
            index: 0
        },
        'FCOMAD20210322121500': {
            origin: {
                originSisterCities: [{code: 'FCO'}],
                originOrderCities: {description: 'MAD'},
            },
            destination: {
                destinationSisterCities: 'Bilbao',
                destinationOrderCities: {description: 'MAD'},
            },
            originSisterCitiesNum: null,
            destinationSisterCitiesNum: null,
            index: 1
        },
        disruptedSlices: ['MADFCO20210315090500', 'FCOMAD20210322121500'],
        referenceSliceId: "MADBIO20210731173500"
    };
    let fakeMmBModalService = {
        'finishWaiting' : jasmine.createSpy(),
        'showGenericError': jasmine.createSpy('showGenericError').and.callFake(() => {
            return {
                result: $q.when({})
            };
        }),
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                result: $q.when({})
            };
        }),
    };
    let fakeVoluntaryChangesTransformer = {
        'getDataAvailabilityTransformed' : jasmine.createSpy('getDataAvailabilityTransformed').and.callFake(() => {
            return 'test';
        }),
        'getDataAvailabilityTransformedReturns' : jasmine.createSpy('getDataAvailabilityTransformedReturns').and.callFake(() => {
            return 'test';
        }),
        'changeFlightsData' : jasmine.createSpy('changeFlightsData').and.callFake( () => {
            return 'test'
        }),
        'searchFlights' : jasmine.createSpy('searchFlights').and.callFake( () => {}),

    };

    let fakeVoluntaryChangesService = {
        'getAvailability': jasmine.createSpy()
    };

    let fakeAvailabilityTransformer = {
        'init' : jasmine.createSpy('init').and.callFake(() => {
            return [{visibility : true}];
        }),
        'getTotalPrice' : jasmine.createSpy('getTotalPrice').and.callFake(() => {
            return 'test';
        }),
        'getInfo' : jasmine.createSpy('getInfo').and.callFake(() => {
            return 'test';
        }),
        'getSegments' : jasmine.createSpy('getSegments').and.callFake(() => {
            return 'test';
        }),
        'getModelfilter' : jasmine.createSpy('getModelfilter').and.callFake(() => {
            return 'test';
        }),
        'getOrderSlices' : jasmine.createSpy('getOrderSlices').and.callFake(() => {
            return 'test';
        }),
        'generateDataLayerAvailability' : jasmine.createSpy('generateDataLayerAvailability').and.callFake(() => {
            return ['test'];
        }),
        'getElementsOfDataLayer' : jasmine.createSpy('getElementsOfDataLayer').and.callFake(() => {
            return ['test'];
        }),
        'resetData' : jasmine.createSpy('resetData').and.callFake(() => {}),
        'generateQuadrigam': jasmine.createSpy('generateQuadrigam').and.callFake( () => {
            return 'QUADRIGAM'
        })
    };

    let model = {
        modelRibbon : {},
        selectedSlide : [
            {
                date : {
                    serviceDate : '2019-06-12'
                }
            },
            {
                date : {
                    serviceDate : '2019-07-12'
                }
            }
        ],
        originDestinations : [
            {
                originCity: {
                    description: 'test1'
                },
                destinationCity : {
                    description: 'test2'
                }
            },{
                originCity: {
                    description: 'test3'
                },
                destinationCity : {
                    description: 'test4'
                }
        }],
        selectedSlice: [
            {
                'date': {
                    'serviceDate': '2019-09-04',
                    'slidePosition': 5,
                    'date': {
                        'dateTime': '',
                        'weekDay': 'WEEKDAY_WEDNESDAY',
                        'day': 4,
                        'monthNumber': 9,
                        'month': 'MONTH_SEPTEMBER',
                        'year': 2019,
                        'originalDate': '2019-09-04T00:00:00+02:00',
                        'formatedDate': '04/09/2019'
                    },
                    'state': 'AVAILABLE'
                },
                'index': 'OD1'
            },
        ],
        responseId: 'test',
        relatedContent: [{
            key: 'NEGATIVE_PRICE_NOT_SHOW'
        }]
    };

    let fakeMmBUtilService = {
        'getFormatedDate': jasmine.createSpy('getFormatedDate').and.callFake(() => {}),
        'isUserLogged' : jasmine.createSpy('isUserLogged').and.callFake(() => {}),
    };
    let fakeMmBUtilsSharedService = {
        'updateQuadrigam': jasmine.createSpy('isUserLogged').and.callFake(() => {}),
        'getProcessByStatus':  jasmine.createSpy('getProcessByStatus').and.callFake(() => {
            return 'test'
        }),
        'updateSisterCitiesModel': jasmine.createSpy('updateSisterCitiesModel').and.callFake(() => {}),
    };

    let fakeEventInfo = {
        'serviceDate': '2019-09-07',
        'slidePosition': 8,
        'date': {
            'dateTime': '',
            'weekDay': 'WEEKDAY_SATURDAY',
            'day': 7,
            'monthNumber': 9,
            'month': 'MONTH_SEPTEMBER',
            'year': 2019,
            'originalDate': '2019-09-07T00:00:00+02:00',
            'formatedDate': '07/09/2019'
        },
        'state': 'AVAILABLE'
    };

    const fakeflights = require('./mocks/ib-MmB-booking-availability-flights-mock.json');
    const fakeflightsUpper = require('./mocks/ib-MmB-booking-availability-flightsUpper-mock.json');
    const fakeflightsBottom = require('./mocks/ib-MmB-booking-availability-flightsBottom-mock.json');
    const fakeorigindestination = require('./mocks/ib-MmB-booking-availability-originDestination-mock.json');
    const fakeorigindestinationUpper = require('./mocks/ib-MmB-booking-availability-originDestinationUpper-mock.json');
    const fakeorigindestinationBottom = require('./mocks/ib-MmB-booking-availability-originDestinationBottom-mock.json');

    let fakeEventInfoUpper = {
        'serviceDate': '2019-09-10',
        'slidePosition': 9,
        'date': {
            'dateTime': '',
            'weekDay': 'WEEKDAY_TUESDAY',
            'day': 10,
            'monthNumber': 9,
            'month': 'MONTH_SEPTEMBER',
            'year': 2019,
            'originalDate': '2019-09-10T00:00:00+02:00',
            'formatedDate': '10/09/2019'
        },
        'state': 'AVAILABLE'
    };

    let fakeEventInfoBottom = {
        'serviceDate': '2019-09-02',
        'slidePosition': 3,
        'date': {
            'dateTime': '',
            'weekDay': 'WEEKDAY_MONDAY',
            'day': 2,
            'monthNumber': 9,
            'month': 'MONTH_SEPTEMBER',
            'year': 2019,
            'originalDate': '2019-09-02T00:00:00+02:00',
            'formatedDate': '02/09/2019'
        },
        'state': 'AVAILABLE'
    };

    let fakeFareReshopService = {
        'getFareReshop' : jasmine.createSpy()
    };

    let faketranslate = {

        'onReady': jasmine.createSpy().and.returnValue(new Promise(resolve => resolve(true))),
        'storageKey': jasmine.createSpy('storageKey').and.callFake(() => { }),
        'storage': jasmine.createSpy('storage').and.callFake(() => { }),
        'preferredLanguage': jasmine.createSpy('preferredLanguage').and.callFake(() => { }),
        'use': jasmine.createSpy('use').and.callFake(() => { })
    };

    let fakeAvailabilityTransformerFilter  = {
        'applyFilter' : jasmine.createSpy('applyFilter').and.callFake(() => {
            return 'test'
        })
    };

    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
        'QUADRIGAM' : {
            CHANGE_FLIGHTS_AVAILABILITY : 'test',
            CHANGE_FLIGHTS_AVAILABILITY_MESSAGE: 'test',
            CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN: 'test',
            CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN_ONE_CHOOSE: 'test',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_RETURN: 'test',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE: 'test',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_WAY: 'test',
            AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'CITOAV',
            AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPTAV',
            AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPAAV',
            SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'test',
            SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'test',
            SELECTION_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'test',
            CHANGE_FLIGHTS_AVAILABILITY_ERROR_MODAL: 'test',
            CHANGE_FLIGHTS_AVAILABILITY_ONE_WAY: 'test'
        },
        'PNR_EMITION_CHANNEL' : {
            'FLEX_FLIGHT_DIRECT': ['IBCOM', 'CALL_CENTER', 'NDC_DIRECT']
        },
        APP_TYPES: {
            MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC'
        }
    };

    let fakeDatalayerConstants = {
        'DATALAYER_EVENT_TYPES' : {
            'VIEW' : ''
        }
    };

    let fakeVCAvailability = {
        'responseId': 'responseIDMock'
    };
    let fakeFareOrquestator = {
        'callFare' : jasmine.createSpy('callFare').and.returnValue(Promise.resolve('test')),
    };
    let fakeAvailabilityOrchestrator = {
        'getAvailabilityRequest' : jasmine.createSpy('getAvailabilityRequest'),
        'availability' : jasmine.createSpy('availability').and.callFake(() => {
            return {
                'result': {
                    'then': () => {}
                }
            };
        })
    };
    let fakeBookingInfo = {
        'channel' : 'prueba',
        'order' : {
            'status': 'UNCONFIRMED_CHANGES'
        }
    };
    const fakeBookingInfoUNTK = {
        'channel' : 'prueba',
        'order' : {
            'status': 'ACCEPT_CHANGES_PENDING',
            'slices': [
                {segments: [{status: {code: 'TK'}}]},
            ]
        }
    };
    const fakeBookingInfoUNTKPT = {
        'channel' : 'prueba',
        'order' : {
            'status': 'ACCEPT_CHANGES_PENDING',
            'slices': [
                {segments: [{status: {code: 'UN'}}]},
                {segments: [{status: {code: 'TK'}}]}
            ]
        }
    };

    let fakeDisruptionUtilService = {
        'quadrigamByTypeFlow':  jasmine.createSpy(),
    };

    class UnifiedStrategy {
        constructor() {}
        getAvailability() {}
    };

    class VoluntaryStrategy {
        constructor() {}
        getAvailability() {}
    };

    let fakeAvailabilityClass = {
        DefaultStrategy: jasmine.createSpy(),
        UnifiedStrategy: UnifiedStrategy,
        VoluntaryStrategy: VoluntaryStrategy,
        getAvailability: jasmine.createSpy('getAvailability')
    };

    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    };

    let fakeFareClass = {
        FareDefaultStrategy: jasmine.createSpy().and.returnValue({
            getFare : jasmine.createSpy()
        }),
        FareUnifiedStrategy: jasmine.createSpy().and.returnValue({
            getFare : jasmine.createSpy()
        }),
    };

    let fakeDisruptionDashboardConstants = {
        'QUADRIGAM_BY_DISRUPTION_FLOW': {
            'ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION': 'ALT_TOTAL_WITH_FLEX',
            'ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION': 'ALT_PARC_WITH_FLEX'
        }
    };

    let fakeBreakdownInfo = {
        issuedItems: [{
            subtype: 'FLEXIBILITY_PACK'
        }]
    };

    let fakeMmBDataLayerService = {
        getDigitalDataEcommerce: jasmine.createSpy(),
        createSelectItemEvent: jasmine.createSpy(),
        createAddToCartItemEvent: jasmine.createSpy(),
    };

    beforeEach(() => {
        fakeDatalayerUtilsService = new MmBDatalayerUtilsServiceMock();
        angular.mock.module('ib-MmB-booking-availability-module','ib-MmB-filters-module','LocalStorageModule', ($provide) => {
            $provide.value('$filter', filterFake);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('VoluntaryChangesTransformer', fakeVoluntaryChangesTransformer);
            $provide.value('VoluntaryChangesService', fakeVoluntaryChangesService);
            $provide.value('AvailabilityTransformer', fakeAvailabilityTransformer);
            $provide.value('FareReshopService', fakeFareReshopService);
            $provide.value('$translate', faketranslate);
            $provide.value('AvailabilityTransformerFilter', fakeAvailabilityTransformerFilter);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('FareOrquestator', fakeFareOrquestator);
            $provide.value('AvailabilityOrchestrator', fakeAvailabilityOrchestrator);
            $provide.value('AvailabilityClass', fakeAvailabilityClass);
            $provide.value('FareClass', fakeFareClass);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DisruptionDashboardConstants', fakeDisruptionDashboardConstants);
            $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
            $provide.value('MmBDataLayerService', fakeMmBDataLayerService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });

        inject((_$rootScope_, _$componentController_,_localStorageService_,_$filter_,_$q_) => {
            $rootScope = _$rootScope_;
            $componentController = _$componentController_;
            $scope = $rootScope.$new();
            $q = _$q_;
            localStorage = _localStorageService_;

            controller = $componentController('ibMmbBookingAvailability', {
                $scope: $scope,
                $rootScope: $rootScope,
            });
        });
        localStorage.set('bookingInfo', fakeBookingInfo);
        localStorage.set('vcAvailability',fakeVCAvailability);
        localStorage.set('breakdownInfo', false);
        localStorage.set('phonesList', {RESERVAS: {prefix:'+34', telephone: '123456789'}});
        $rootScope.$digest();
    });

    const serviceResolve = (service, method, data) => {
        service[method] = jasmine.createSpy(method).and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve(data);
            return deferred.promise;
        });
    };

    const serviceReject = (service, method, data) => {
        service[method] = jasmine.createSpy(method).and.callFake(() => {
            let deferred = $q.defer();
            deferred.reject(data);
            return deferred.promise;
        });
    };  

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-MmB-booking-availability-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            scope.model = {...model};
            const element = $compile('<ib-MmB-booking-availability model="model"></ib-MmB-booking-availability>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('when $onInit() is called', () => {
        const setModelCase = () => {
        controller.model = {...model};
        controller.model.originDestinations = [
            {
                originCity: {
                    description: 'test1'
                },
                destinationCity : {
                    description: 'test2'
                }
            },{
                originCity: {
                    description: 'test3'
                },
                destinationCity : {
                    description: 'test4'
                }
        }];
    };
        let sameExpect = () => {
            expect(controller.slices.flightsOutward).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableOutbound).toEqual(true);
            expect(controller.indexRibbonReturn).toEqual(1);
            expect(controller.showCalendar).toEqual(true);
            expect(controller.showLoading).toEqual(false);
            expect(controller.slices.flightsReturns).toEqual([]);
            expect(controller.titleOutwardOrigin).toEqual('test1');
            expect(controller.titleOutwardDestiny).toEqual('test2');
            expect(controller.modelTotalPrice).toEqual('test');
        };
        it('and modeflight is not equal to outbound or twice and isUnifiedFlow true and unifiedOptionalData is false', () => {
            setModelCase();
            localStorage.set('isUnifiedFlow', true);
            localStorage.set('unifiedOptionalData', false);
            controller.model.modeFlight = 'other';
            localStorage.set('breakdownInfo', fakeBreakdownInfo);
            controller.$onInit();
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableReturn).toEqual(true);
            expect(controller.modeFlightReturn).toEqual(true);
            expect(controller.indexRibbonReturn).toEqual(0);
            expect(controller.showCalendar).toEqual(true);
            expect(controller.showLoading).toEqual(false);
            expect(controller.slices.flightsOutward).toEqual([]);
            expect(controller.titleOutwardOrigin).toEqual('test1');
            expect(controller.titleOutwardDestiny).toEqual('test2');
            expect(controller.modelTotalPrice).toEqual('test');
        });
        it('and modeflight is not equal to outbound or twice and isUnifiedFlow true and unifiedOptionalData is true', () => {
            setModelCase();
            localStorage.set('isUnifiedFlow', true);
            localStorage.set('unifiedOptionalData', {enabled: true});
            controller.model.modeFlight = 'return';
            localStorage.set('breakdownInfo', fakeBreakdownInfo);
            controller.$onInit();

            expect(controller.indexRibbonReturn).toEqual(1);

        });

        it('and modeflight is not equal to outbound or twice and isUnifiedFlow false', () => {
            setModelCase();
            localStorage.set('isUnifiedFlow', false);
            controller.model.modeFlight = 'return';
            localStorage.set('breakdownInfo', fakeBreakdownInfo);
            controller.$onInit();

            // expect(controller.indexRibbonReturn).toEqual(1);

        });

        it('Should set corretly values of model and modeflight is equal to outbound and originDestination 2 item', () => {
            setModelCase();
            controller.model.modeFlight = 'outbound';
            controller.$onInit();
            sameExpect();
            expect(controller.titleReturnOrigin).toEqual('test3');
            expect(controller.titleReturnDestiny).toEqual('test4');
        });

        it('Should set corretly values of model and modeflight is equal to outbound and originDestination 1 item', () => {
            controller.model = {...model};
            controller.model.originDestinations.pop();
            controller.model.modeFlight = 'outbound';
            controller.$onInit();
            sameExpect();
        });
        xit('Should set corretly values of model and modeflight is equal to return and originDestination 1 item', () => {
            controller.model = {...model};
            controller.model.originDestinations.pop();
            controller.model.modeFlight = 'return';
            controller.$onInit();
            localStorage.set('isUnifiedFlow', true);

            // expect(controller.slices.flightsOutward).toEqual([{ visibility: true }]);
        });

        it('Should set corretly values of model and modelempty and outbound', () => {
            controller.model = {...model};
            controller.model.modeFlight = 'outbound';
            controller.model.modelempty = true;
            controller.$onInit();
            expect(controller.indexRibbonReturn).toEqual(1);
        });

        it('Should set corretly values of model and modelempty and return', () => {
            controller.model = {...model};
            controller.model.modeFlight = 'return';
            controller.model.modelempty = true;
            controller.$onInit();
            expect(controller.indexRibbonReturn).toEqual(0);
        });
    });

    describe('when removeStateFlight() is called', () => {
        it('if modeFlight is twice and typeflight distint of outbound should set corretly values of model', () => {
            controller.model = {...model};
            controller.modeFlight = 'twice'
            controller.removeStateFlight();
            expect(controller.buttonCloseStateFlight).toEqual(true);
            expect(controller.stateFlight).toEqual(false);
            expect(controller.stateFlightEndAnimation).toEqual(false);
            expect(controller.showDetails).toEqual(false);
            expect(controller.returnFlightSelectedInfo).toEqual(null);
            expect(controller.returnFlightSelected).toEqual(false);
            expect(controller.totalPriceDone).toEqual(false);
            expect(controller.cabinSelectedIndexReturn).toEqual(null);
        });

        it('if modeFlight is twice and typeflight is equal to outbound and oldOfferOutboundSelected is true should set corretly values of model', () => {
            controller.model = {...model};
            controller.modeFlight = 'twice'
            controller.oldOfferOutboundSelected = 'test';
            controller.cabinSelectedIndexOutbound = 0;
            controller.fareSelectedIndexOutbound = 0;
            controller.slices = {flightsReturns: ''};
            controller.outboundFlightSelectedInfo = {};
            controller.outboundFlightSelectedInfo.cabins = [{fareFamilies: [{priceShown: ''}]}];
            controller.removeStateFlight('outbound');
            expect(controller.oldOfferOutboundSelected).toEqual(null);
            expect(controller.outboundFlightSelectedInfo).toEqual(null);
            expect(controller.outboundFlightSelected).toEqual(false);
            expect(controller.offertOutboundSelected).toEqual(null);
            expect(controller.slices.flightsReturns).toEqual(null);
            expect(controller.totalPriceDone).toEqual(false);
            expect(controller.cabinSelectedIndexOutbound).toEqual(null);
        });

        it('if modeFlight is outbound should set corretly values of model', () => {
            controller.modeFlight = 'outbound';
            controller.removeStateFlight();
            expect(controller.outboundFlightSelectedInfo).toEqual(null);
            expect(controller.outboundFlightSelected).toEqual(false);
            expect(controller.totalPriceDone).toEqual(false);
            expect(controller.cabinSelectedIndexOutbound).toEqual(null);
        });


        it('if modeFlight is return should set corretly values of model', () => {
            controller.modeFlight = 'return';
            controller.removeStateFlight();
            expect(controller.returnFlightSelectedInfo).toEqual(null);
            expect(controller.returnFlightSelected).toEqual(false);
            expect(controller.totalPriceDone).toEqual(false);
            expect(controller.cabinSelectedIndexReturn).toEqual(null);
        });
    });


    describe('when open() is called', () => {
        const sameDataModel = (type) => {
            controller.model = {...model};
            controller.modelTotalPrice = {};
            controller.modelTotalPrice = {totalPrice : 300};
            controller.selectedSlide = [
                {
                    date : {
                        serviceDate : '2019-07-12'
                    }
                }
            ];
            controller.slices = {};
            controller.sliceSelectedIndexOutbound = 0;
            controller.cabinSelectedIndexOutbound = 0;
            
            if (type === 'outbound') {
                controller.slices = {flightsOutward: []};
                controller.slices.flightsOutward[0] = sameCabins;
            } else if (type === 'return') {
                controller.slices = {flightsReturns: []};
                controller.slices.flightsReturns[0] = sameCabins;
            };
            
            controller.modeFlight = type;
            controller.open(0,0,'');
        };
        const sameCabins = {
            cabins: [
                {
                    fareFamilies: [
                        {
                            offers:[
                                {
                                    price: {
                                        total: 1
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        it('if modelFlight is twice and typeFlight is outbound and outboundFlightSelected is true should set corretly values of model', () => {
            controller.model = {...model};
            controller.selectedSlide = {...model.selectedSlide};
            controller.slices = {};
            controller.slices.flightsOutward = ['test1','test2'];
            controller.slices.flightsReturns = ['test3','test4'];
            controller.modeFlight = 'twice';
            controller.outboundFlightSelected = true;
            controller.open(1,1,'outbound');
            expect(controller.totalPriceDone).toEqual(false);
            expect(controller.cabinSelectedIndexOutbound).toEqual(1);
        });

        it('if modelFlight is twice and typeFlight is distints of outbound and returnFlightSelected is true should set corretly values of model (one selectedSlide)', () => {
            controller.model = {...model};
            controller.selectedSlide = [
                {
                    date : {
                        serviceDate : '2019-07-12'
                    }
                }
            ];
            controller.returnFlightSelected = true;
            controller.slices = {};
            controller.slices.flightsOutward = ['test1','test2'];
            controller.slices.flightsReturns = ['test3','test4'];
            controller.modeFlight = 'twice';
            controller.open(1,1,'');
            expect(controller.cabinSelectedIndexReturn).toEqual(1);
        });

        it('if modelFlight is outbound should set corretly values of model', () => {
            sameDataModel('outbound');
            expect(controller.cabinSelectedIndexOutbound).toEqual(0);
            expect(controller.priceOfferSelected).toEqual(1);
            expect(controller.cabinSelectedIndexOutbound).toEqual(0);
            expect(controller.totalPriceDone).toEqual(true);
        });

        it('if modelFlight is return should set corretly values of model', () => {
            sameDataModel('return');
            expect(controller.cabinSelectedIndexReturn).toEqual(0);
            expect(controller.priceOfferSelected).toEqual(1);
            expect(controller.cabinSelectedIndexReturn).toEqual(0);
            expect(controller.totalPriceDone).toEqual(true);
        });
    });

    describe('when updateFareSelected() is called', () => {
        const sameCabinsArray = [
            {cabins: [
                {fareFamilies : [{
                    priceShown : '10',
                    offers : [
                        {
                            price: {
                                total: 1
                            }
                        }
                    ]
                }
                ]}
            ]}
        ];
        const sameCabins = {
            cabins: [
                {fareFamilies : [{
                    priceShown : '10',
                    offers : [{
                        price : {
                            total : 1
                        }
                    }]
                }
                ]}
            ]};
        const sameCase = (mode, type) => {
            controller.bookingInfo = {...fakeBookingInfo};
            controller.model = {...model};
            controller.modeFlight = mode;
            controller.slices = {};
            if (mode === 'return') {
                controller.sliceSelectedIndexReturn = 0;
                controller.cabinSelectedIndexReturn = 0;
                controller.fareSelectedIndexReturn = 0;
                controller.slices.flightsReturns = sameCabinsArray;
            } else if (mode === 'outbound') {
                controller.sliceSelectedIndexOutbound = 0;
                controller.cabinSelectedIndexOutbound = 0;
                controller.fareSelectedIndexOutbound = 0;
                controller.slices.flightsOutward = sameCabinsArray;
            } else if (mode === 'twice') {
                controller.slices.flightsReturns = sameCabinsArray;
                controller.outboundFlightSelectedInfo = sameCabins;
                controller.sliceSelectedIndexReturn = 0;
                controller.cabinSelectedIndexReturn = 0;
                controller.cabinSelectedIndexOutbound = 0;
                controller.fareSelectedIndexOutbound = 0;
            };
            controller.modelTotalPrice = {};
            $rootScope.$broadcast('updateFareSelected',{
                selectedFare : 0,
                typeFlight: type
            });
        };
        it('If modeFlight is twice and info.typeFlight is different of outbound should set corretly values of model', () => {
            sameCase('twice', '');
            expect(controller.fareSelectedIndexReturn).toEqual(0);
            expect(controller.priceOfferSelected).toEqual(1);
            expect(controller.priceOfferSelectedFormated).toEqual('10');
            expect(controller.oldOfferOutboundSelected).toEqual('10');
            expect(controller.modelTotalPrice.totalPrice).toEqual(1);
            expect(controller.totalPriceDone).toEqual(true);
        });
        it('If modeFlight is twice and info.typeFlight is outbound should set corretly values of model', () => {
            sameCase('twice', 'outbound');
            expect(controller.fareSelectedIndexOutbound).toEqual(0);
            expect(controller.offertOutboundSelected).toEqual({
                price : {
                    total : 1
                }
            });
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableReturn).toEqual(true);
            expect(controller.returnFlightSelected).toEqual(false);
            expect(controller.totalPriceDone).toEqual(false);
        });

        it('If modeFlight is outbound should set corretly values of model', () => {
            sameCase('outbound', 'outbound');
            expect(controller.fareSelectedIndexOutbound).toEqual(0);
            expect(controller.priceOfferSelected).toEqual(1);
            expect(controller.modelTotalPrice.totalPrice).toEqual(1);
            expect(controller.totalPriceDone).toEqual(true);
        });

        it('If modeFlight is return should set corretly values of model', () => {
            sameCase('return', 'outbound');
            expect(controller.fareSelectedIndexReturn).toEqual(0);
            expect(controller.priceOfferSelected).toEqual(1);
            expect(controller.modelTotalPrice.totalPrice).toEqual(1);
            expect(controller.totalPriceDone).toEqual(true);
        });
    });

    describe('when getInfo() is called', () => {
        it('should return corretly values', () => {
            expectData = controller.getInfo('slice');
            expect(expectData).toEqual('test');
        });
    });

    describe('when getSegments() is called', () => {
        it('should return corretly values', () => {
            expectData = controller.getSegments('segments');
            expect(expectData).toEqual('test');
        });
    });

    describe('when deployFareContainer() is called', () => {
        it('should set correct values', () => {
            $rootScope.$broadcast('deployFare',{offerIndex : 1});
            expect(controller.selectedItem).toEqual(1);
        });
    });

    let sameCaseCabins = [
        {cabins: [
            {fareFamilies : [{
                priceShown : '10',
                offers : [{
                    price : {
                        total : 1
                    }
                }]
            }
            ]}
        ]}
    ];

    describe('when typeFilter() is called with typeflights with value outbound', () => {
        it('should set correct values', () => {
            controller.slices = {};
            controller.slices.flightsOutward = sameCaseCabins;
            $rootScope.$broadcast('typeFilterAvailability',{typeFlight : 'outbound'});
            expect(controller.slices.flightsOutward).toEqual('test');
        });
    });

    describe('when typeFilter() is called with typeflights with value distint of outbound', () => {
        it('should set correct values', () => {
            controller.slices = {};
            controller.slices.flightsReturns = sameCaseCabins;
            $rootScope.$broadcast('typeFilterAvailability',{typeFlight : ''});
            expect(controller.slices.flightsReturns).toEqual('test');
        });
    });

    describe('when changeSelectedSlide()', () => {
        let sameFlightReturns =  [
            {cabins: [
                {fareFamilies : [{
                    priceShown : '10',
                    offers : [{
                        price : {
                            total : 1
                        }
                    }]
                }
                ]}
            ]}
        ];

        const sameCaseReject = (internalErrorCode, isChannelDirect) => {
            serviceReject(fakeAvailabilityOrchestrator, 'availability', {message: 'message error '+ internalErrorCode, internalErrorCode: internalErrorCode });
            let phoneCallCenter = controller.getPhoneCallCenter();
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.model.originDestinations = [{loadingAvailability : false},{loadingAvailability : false}];
            controller.channelDirect = isChannelDirect;
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected','', '');
            $rootScope.$digest();
            expect(phoneCallCenter).toEqual('+34 123456789');
        };

        const sameCaseResolve = (mode, originDestinations, someEvent) => {
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = [{test: 'test'}]
            controller.modeFlight = mode;
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.slices = {};
            controller.model.originDestinations = originDestinations;
            controller.slices.flightsReturns = sameFlightReturns;
            spyOn($scope, '$emit');
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected', someEvent, 'OD1');
            $rootScope.$digest();
        };
        it('should set correct values when with index OD1 and getAvailability resolve', () => {
            inject(() =>  {
                serviceResolve(fakeAvailabilityOrchestrator, 'availability', 'test');
            });
            sameCaseResolve('', [{loadingAvailability : 'false'}], '');
            
            expect(controller.showLoading).toEqual(false);
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(0);
            expect(controller.model.originDestinations[0]).toEqual({ loadingAvailability: true, test: 'test' });
            expect($scope.$emit).toHaveBeenCalledWith('changeDataAvailability', {data: 'test', modeFlight: '' });
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD2');

        });

        it('should set correct values when with index OD1 and getAvailability resolve and model is undefined', () => {
            inject(() =>  {
                serviceResolve(fakeAvailabilityOrchestrator, 'availability', 'test');
            });
            controller.flights = [{test: 'test'}]
            controller.modeFlight = '';
            controller.model = undefined;
            controller.slices = {};
            controller.slices.flightsReturns = sameFlightReturns;
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected','', 'OD1');
            $rootScope.$digest();
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD2');
        });

        it('should set correct values when with index OD1 and getAvailability resolve and modeFlight equal to twice and with changeBottomLimit', () => {
            inject(() =>  {
                serviceResolve(fakeAvailabilityOrchestrator, 'availability', 'test');
            });
            sameCaseResolve('twice', fakeorigindestination, fakeEventInfo);
            
            expect(controller.showLoading).toEqual(false);
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(0);
            expect($scope.$emit).toHaveBeenCalledWith('changeDataAvailability', {data: 'test', modeFlight: 'twice' });
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD2');
        });

        it('should set correct values when with index OD1 and getAvailability resolve and modeFlight equal to twice and with changeBottomLimit and date to change is lower than selected', () => {
            inject(() =>  {
                serviceResolve(fakeAvailabilityOrchestrator, 'availability', 'test');
            });
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = fakeflightsBottom
            controller.modeFlight = 'twice';
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.slices = {};
            controller.model.originDestinations = fakeorigindestinationBottom;
            controller.slices.flightsReturns = sameFlightReturns;
            spyOn($scope, '$emit');
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected', fakeEventInfoBottom , 'OD1');
            $rootScope.$digest();
            expect(controller.showLoading).toEqual(false);
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(0);
            expect($scope.$emit).toHaveBeenCalledWith('changeDataAvailability', {data: 'test', modeFlight: 'twice' });
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD2');
        });

        it('should set correct values when with index OD1 and getAvailability resolve and modeFlight equal to twice and with changeUpperLimit', () => {
            inject(($q) =>  {
                serviceResolve(fakeAvailabilityOrchestrator, 'availability', 'test');
                fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                    return {
                        'result': $q.when({})
                    };
                });
            });
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = fakeflightsUpper;
            controller.modeFlight = 'twice';
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 1;
            controller.slices = {};
            controller.model.originDestinations = fakeorigindestinationUpper.originDestinations;
            controller.slices.flightsReturns = sameFlightReturns;
            spyOn($scope, '$emit');
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected', fakeEventInfoUpper , 'OD2');
            $rootScope.$digest();
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(1);
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD1');
        });

        it('should set correct values when with index OD1 and getAvailability reject', () => {
            inject(() =>  {
                serviceReject(fakeAvailabilityOrchestrator, 'availability', {message: 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NEW_SEARCH'});
            });
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = [{test: 'test'}]
            controller.modeFlight = '';
            controller.offersAvailableOutbound = false;
            controller.selectedSlide = [{index : 'OD1'},{date : ''}];
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.slices = {};
            controller.model.originDestinations = [{loadingAvailability : 'false'}];
            controller.slices.flightsReturns = sameFlightReturns;
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected','', 'OD1');
            $rootScope.$digest();
            expect(controller.showLoading).toEqual(false);
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(0);
            expect(controller.model.originDestinations[0]).toEqual({ loadingAvailability: true, test: 'test' });
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD2');
            expect(controller.offersAvailableOutbound).toEqual(false);

        });

        it('should set correct values when with index OD2 and getAvailability reject', () => {
            inject(() =>  {
                serviceReject(fakeAvailabilityOrchestrator, 'availability', {message: 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NEW_SEARCH'});
            });
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = [{test: 'test'}]
            controller.modeFlight = '';
            controller.offersAvailableOutbound = false;
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.slices = {};
            controller.model.originDestinations = [{loadingAvailability : 'false'},{loadingAvailability : 'false'}];
            controller.slices.flightsReturns = sameFlightReturns;
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected','', 'OD2');
            $rootScope.$digest();
            expect(controller.showLoading).toEqual(false);
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(1);
            expect(controller.model.originDestinations[0]).toEqual({ loadingAvailability: 'false', test: 'test' });
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD1');
            expect(controller.offersAvailableOutbound).toEqual(false);
        });

        it('should set correct values when without index and getAvailability reject', () => {
            inject(() =>  {
                serviceReject(fakeAvailabilityOrchestrator, 'availability', {message: 'message error'});
            });
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = [{test: 'test'}]
            controller.modeFlight = '';
            controller.offersAvailableOutbound = false;
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.selectedSlide = [{index : 'OD2'},{date : ''}];
            controller.slices = {};
            controller.model.originDestinations = [{loadingAvailability : false},{loadingAvailability : false}];
            controller.slices.flightsReturns = sameFlightReturns;
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected','', '');
            $rootScope.$digest();
            expect(controller.showLoading).toEqual(false);
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(0);
            expect(controller.model.originDestinations[0]).toEqual({ loadingAvailability: true, test: 'test' });
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', undefined);
            expect(controller.offersAvailableOutbound).toEqual(false);

        });

        it('should set correct values when without index and getAvailability reject, channelDirect true and internalErrorCode is SSE_AVM_18012', () => {
            sameCaseReject('SSE_AVM_18012', true);
        });

        it('should set correct values when without index and getAvailability reject, channelDirect false and internalErrorCode is SSE_AVM_18012', () => {
            sameCaseReject('SSE_AVM_18012', false);
        });

        it('should set correct values when without index and getAvailability reject, channelDirect false and internalErrorCode is SSE_AVM_18011', () => {
            sameCaseReject('SSE_AVM_18011', false);
        });
    });

    describe('when updateAvailability is called', () => {
        let sameCaseReturn = (isUnifiedFlow, offerType) => {
            localStorage.set('isUnifiedFlow', isUnifiedFlow);
            localStorage.set('unifiedOfferType', offerType);
            controller.bookingInfo = {...fakeBookingInfo};
            controller.modeFlight = 'return';
            controller.slices = {flightsOutward: {}, flightsReturns: {visibility: true}};
            $rootScope.$broadcast('updateAvailability',{});
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableReturn).toEqual(true);
        };
        it('should set correct values when modeFlights is distints of return', () => {
            controller.bookingInfo = {...fakeBookingInfo};
            controller.modeFlight = '';
            controller.slices= {flightsOutward: {
                visibility: true
            }};
            $rootScope.$broadcast('updateAvailability',{});
            expect(controller.slices.flightsOutward).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableOutbound).toEqual(true);
        });
        it('should set correct values when modeFlights is distints of return and offertOutboundSelected', () => {
            controller.bookingInfo = {...fakeBookingInfo};
            controller.modeFlight = '';
            controller.offertOutboundSelected = true;
            controller.slices= {flightsOutward: {}};
            $rootScope.$broadcast('updateAvailability',{});
            expect(controller.slices.flightsOutward).toEqual([{ visibility: true }]);
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableOutbound).toEqual(true);
            expect(controller.offersAvailableReturn).toEqual(true);
        });
        it('should set correct values when modeFlights is return isUnifiedFlow false', () => {
            sameCaseReturn(false, null);
        });
        it('should set correct values when modeFlights is return isUnifiedFlow true and VOLUNTARY_CHANGE', () => {
            sameCaseReturn(true,'VOLUNTARY_CHANGE');
        });
        it('should set correct values when modeFlights is return isUnifiedFlow true and INVOLUNTARY_CHANGE', () => {
            sameCaseReturn(true,'INVOLUNTARY_CHANGE');
        });
    });

    describe('when resetFilter is called', () => {
        it('When typeflight is outbound should restore copy of flight outward', () => {
            controller.copyFlightOutward = 'test'
            controller.slices = {};
            controller.slices.flightsOutward = {}
            $rootScope.$broadcast('resetFilterDataModal','outbound');
            expect(controller.slices.flightsOutward).toEqual('test');
        });
        it('When typeflight is distint of outbound should restore copy of flight return', () => {
            controller.copyFlightReturn = 'test'
            controller.slices = {};
            controller.slices.flightsReturns = {}
            $rootScope.$broadcast('resetFilterDataModal','return');
            expect(controller.slices.flightsReturns).toEqual('test');
        });
    });

    describe('when captureFilterData is called', () => {
        let sameCase = (type, firstTime) => {
            if (type === 'outbound') {
                controller.copyFlightOutward = 'test';
                controller.slices = {};
                controller.slices.flightsOutward = 'test';
                controller.entryFiltersFirstTimeOutBound = firstTime; 
            } else if (type === 'return') {
                controller.copyFlightReturn = 'test';
                controller.slices = {};
                controller.slices.flightsReturns = 'test';
                controller.entryFiltersFirstTimeReturn = firstTime;
            };

            $rootScope.$broadcast('filterDataModal',{typeFlight : type});
        };
        it('When typeflight is outbound and entryFiltersFirstTimeOutBound is true should update copy of flight outward', () => {
            sameCase('outbound', true);
            expect(controller.copyFlightOutward).toEqual('test');
            expect(controller.entryFiltersFirstTimeOutBound).toEqual(false);
            expect(controller.slices.flightsOutward).toEqual('test');
        });
        it('When typeflight is outbound and entryFiltersFirstTimeOutBound is false should update copy of flight outward', () => {
            sameCase('outbound', false);
            expect(controller.copyFlightOutward).toEqual('test');
            expect(controller.slices.flightsOutward).toEqual('test');
        });
        it('When typeflight is distint of outbound and entryFiltersFirstTimeOutBound is true should update copy of flight return', () => {
            sameCase('return', true);
            expect(controller.copyFlightReturn).toEqual('test');
            expect(controller.entryFiltersFirstTimeReturn).toEqual(false);
            expect(controller.slices.flightsReturns).toEqual('test');
        });
        it('When typeflight is outbound and entryFiltersFirstTimeOutBound is false should update copy of flight return', () => {
            sameCase('return', false);
            expect(controller.copyFlightReturn).toEqual('test');
            expect(controller.slices.flightsReturns).toEqual('test');
        });
    });

    describe('when isShowLikToRubiQ is called', () => {
        it('When isShowLikToRubiQ', () => {
            localStorage.set('showLinkToRubiQ','test');
            let isShowLikToRubiQ = controller.isShowLikToRubiQ();
            expect(isShowLikToRubiQ).toEqual('test');
        });
    });

    describe('when updateOriginDestinyTitles is called', () => {
        it('When updateOriginDestinyTitles', () => {
            controller.outboundFlightSelectedInfo = {
                segments: [{
                    departurePlaceName: 'Madrid'
                }]
            };
            controller.returnFlightSelectedInfo = {
                segments: [{
                    departurePlaceName: 'Bilbao'
                }]
            };
            controller.outboundFlightSelected = true;
            controller.updateOriginDestinyTitles();
            expect(controller.titleOutwardOrigin).toEqual('Madrid');
            expect(controller.titleReturnOrigin).toEqual('Bilbao');
        });
    });

    describe('when generateQuadrigam is called', () => { 
        let sameSelectedSlice = {
            'date': {
                'serviceDate': '2019-09-04',
                'slidePosition': 5,
                'date': {
                    'dateTime': '',
                    'weekDay': 'WEEKDAY_WEDNESDAY',
                    'day': 4,
                    'monthNumber': 9,
                    'month': 'MONTH_SEPTEMBER',
                    'year': 2019,
                    'originalDate': '2019-09-04T00:00:00+02:00',
                    'formatedDate': '04/09/2019'
                },
                'state': 'AVAILABLE'
            },
            'index': 'OD1'
        };
        let sameOriginDestination = [
            {
                originCity: {
                    description: 'test1'
                },
                destinationCity : {
                    description: 'test2'
                }
            }
        ];

        let sameCaseDisruption = (isDisruptionFlow, typeDisruptionFlow, numberSlices, numOriginDestinations) => {
            let sameSelectedSliceArray = [], sameOriginDestinationArray = [];
            let fakeModel = {...model};
            let generateQuadrigam;
            controller.model = {...model};
            $rootScope.isDisruptionFlow = isDisruptionFlow;
            localStorage.set('typeDisruptionFlow', typeDisruptionFlow);

            for(let i = 0; i < numberSlices; i++) {
                sameSelectedSliceArray.push(sameSelectedSlice);
            };
            for(let i = 0; i < numOriginDestinations; i++) {
                sameOriginDestinationArray.push(sameOriginDestination);
            };
            fakeModel.selectedSlice = sameSelectedSliceArray;
            fakeModel.originDestinations = sameOriginDestinationArray;
            controller.model.selectedSlice = sameSelectedSliceArray;
            controller.model.originDestinations = sameOriginDestinationArray;

            generateQuadrigam = controller.generateQuadrigam(fakeflights, fakeModel);
            return generateQuadrigam;
        };

        it('When isDisruptionFlow is false and typeDisruptionFlow is null slices > 1', () => {
            let generateQuadrigam = sameCaseDisruption(false, false, 2, 2);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN);
        });

        it('When isDisruptionFlow is true and typeDisruptionFlow is null slices > 1', () => {
            let generateQuadrigam = sameCaseDisruption(true, false, 2, 2);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN);
        });
        it('When isDisruptionFlow is true and typeDisruptionFlow is null and slices = 1', () => {
            let generateQuadrigam = sameCaseDisruption(true, false, 1, 2);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_AVAILABILITY_ONE_WAY);
            $rootScope.$digest();
        });
        it('When isDisruptionFlow is true and typeDisruptionFlow is null and slices = 1', () => {
            let generateQuadrigam = sameCaseDisruption(true, false, 1, 1);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_AVAILABILITY_ONE_WAY);
            $rootScope.$digest();
        });
        it('When isDisruptionFlow is true and typeDisruptionFlow is null Partial Flex', () => {
            let generateQuadrigam = sameCaseDisruption(true, false, 1, 2);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE);
        });

        it('When typeDisruptionFlow is true and typeDisruptionFlow with total flex', () => {
            let generateQuadrigam = sameCaseDisruption(true, fakeDisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION, 2, 2);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN_ONE_CHOOSE);
        });

        it('When typeDisruptionFlow is true and typeDisruptionFlow with partial flex', () => {
            let generateQuadrigam = sameCaseDisruption(true, fakeDisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION, 2, 2);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_AVAILABILITY_WITH_RETURN_ONE_CHOOSE);
        });

        it('When isDisruptionFlow and typeDisruptionFlow is true and Total Flex UNTK slices > 1', () => {
            localStorage.set('bookingInfo', fakeBookingInfoUNTK);
            const generateQuadrigam = sameCaseDisruption(true, true, 2, 2);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL);
        });

        it('When isDisruptionFlow and typeDisruptionFlow is true and Parcial Flex UNTK slices > 1', () => {
            localStorage.set('bookingInfo', fakeBookingInfoUNTKPT);
            const generateQuadrigam = sameCaseDisruption(true, true, 2, 2);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL);
        });

        it('When isDisruptionFlow and typeDisruptionFlow is true and Flex UNTK slices > 1 OriginDestinations = 1', () => {
            localStorage.set('bookingInfo', fakeBookingInfoUNTK);
            const generateQuadrigam = sameCaseDisruption(true, true, 2, 1);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL);
        });

        it('When isDisruptionFlow and typeDisruptionFlow with partial flex and Flex UNTK slices > 1 OriginDestinations = 1', () => {
            localStorage.set('bookingInfo', fakeBookingInfoUNTK);
            const generateQuadrigam = sameCaseDisruption(true, fakeDisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION, 2, 1);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.AVAILABILITY_ONE_SELECT_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL);
        });
    });

    describe('when acceptAvailability is called', () => {
        const sameCabinsArray = [{
            cabins: [
                {
                    fareFamilies: [
                        {
                            offers:[
                                {
                                    offerId: 'test',
                                    price: {
                                        total: 1
                                    },
                                    offerItems: [{
                                        offerItemId: 'test'
                                    }],
                                    originDestinations: [{
                                        originDestinationId: 'test',
                                        applicableSlices: [{
                                            sliceId: 'test'
                                        }]
                                    }]
                                }
                            ]
                        }
                    ]
                }
            ]
        }];
        const sameCallFare = () => {
            fakeFareOrquestator.callFare = jasmine.createSpy('callFare').and.callFake(() => {
                return function() {
                    let deferred = $q.defer();
                    deferred.resolve({offers: [{offerId: 0, cashAviosPossibilities:{}}]});
                    return deferred.promise;
                };
            });
        };
        const sameCaseReturnAndTwice = () => {
            controller.model = {...model};
            controller.sliceSelectedIndexReturn = 0;
            controller.cabinSelectedIndexReturn = 0;
            controller.fareSelectedIndexReturn = 0;
            controller.slices = {flightsReturns: []};
            controller.slices.flightsReturns = sameCabinsArray;
            controller.acceptAvailability();
            $rootScope.$digest();
            expect(fakeMmBDataLayerService.createAddToCartItemEvent).toHaveBeenCalled();
        }
        it('When modeFlight is twice', (done) => {
            sameCallFare();
            
            controller.modeFlight = 'twice';
            sameCaseReturnAndTwice();
            done();
        });
        it('When modeFlight is outbound', (done) => {
            sameCallFare();
            controller.model = {...model};
            controller.modeFlight = 'outbound';
            controller.sliceSelectedIndexOutbound = 0;
            controller.cabinSelectedIndexOutbound = 0;
            controller.fareSelectedIndexOutbound = 0;
            controller.slices = {flightsOutward: []};
            controller.slices.flightsOutward = sameCabinsArray;
            controller.acceptAvailability();
            expect(fakeMmBDataLayerService.createAddToCartItemEvent).toHaveBeenCalled();
            done();
        });
        it('When modeFlight is return', (done) => {
            sameCallFare();
            controller.modeFlight = 'return';
            sameCaseReturnAndTwice();
            done();
        });

        it('When fareSuccess is called', (done) => {
            spyOn($rootScope, '$broadcast');
            controller.fareSuccess({fareFamilyConditions: true, offers: [{offerId: '0', cashAviosPossibilities: true}]});
            expect($rootScope.$broadcast).toHaveBeenCalledWith('toSummaryView', true)
            done();
        });

        it('When fareError is called', (done) => {
            spyOn(fakeMmBModalService, 'showGenericError');
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });
            controller.fareError('error');
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
    });

    describe('when openSisterCity is called', () => {
        const sameSelectedSlice = [
            {
                'date': {
                    'serviceDate': '2019-09-04',
                    'slidePosition': 5,
                    'date': {
                        'dateTime': '',
                        'weekDay': 'WEEKDAY_WEDNESDAY',
                        'day': 4,
                        'monthNumber': 9,
                        'month': 'MONTH_SEPTEMBER',
                        'year': 2019,
                        'originalDate': '2019-09-04T00:00:00+02:00',
                        'formatedDate': '04/09/2019'
                    },
                    'state': 'AVAILABLE'
                },
                'index': 'OD1'
            },
            {
                'date': {
                    'serviceDate': '2019-09-04',
                    'slidePosition': 5,
                    'date': {
                        'dateTime': '',
                        'weekDay': 'WEEKDAY_WEDNESDAY',
                        'day': 4,
                        'monthNumber': 9,
                        'month': 'MONTH_SEPTEMBER',
                        'year': 2019,
                        'originalDate': '2019-09-04T00:00:00+02:00',
                        'formatedDate': '04/09/2019'
                    },
                    'state': 'AVAILABLE'
                },
                'index': 'OD1'
            },
        ];

        const sameSisterInfo = [
            {
                origin: 'test',
                destination: 'test'
            },
            {
                origin: 'test',
                destination: 'test'
            }
        ];
        it('When openSisterCity and index 0', (done) => {
            spyOn(fakeMmBModalService, 'showGenericModal');
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });
            serviceResolve(fakeAvailabilityOrchestrator, 'availability', 'test');
            localStorage.set('isUnifiedFlow', true);
            controller.sisterInfo = sameSisterInfo;
            controller.newSisterCities = fakeNewSisterCitiesModel;
            controller.model = {...model};
            controller.model.selectedSlice = sameSelectedSlice;
            controller.openSisterCity(0);
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
        it('When openSisterCity and index 1', (done) => {
            spyOn(fakeMmBModalService, 'showGenericModal');
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });
            serviceResolve(fakeAvailabilityOrchestrator, 'availability', 'test');
            localStorage.set('isUnifiedFlow', true);
            localStorage.set('unifiedOfferType', 'test2');
            controller.sisterInfo = sameSisterInfo;
            controller.newSisterCities = fakeNewSisterCitiesModel;
            controller.model = {...model};
            controller.model.selectedSlice = sameSelectedSlice;
            controller.model.originDestinations = [
                {
                    originCity: {
                        description: 'test1'
                    },
                    destinationCity : {
                        description: 'test2'
                    },
                    loadingAvailability: false
                },
                {
                    originCity: {
                        description: 'test1'
                    },
                    destinationCity : {
                        description: 'test2'
                    },
                    loadingAvailability: false
            }];
            controller.openSisterCity(1);
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });
});
