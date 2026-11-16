import angular from 'angular';
import { SimulatorAvailabilityTransformerMock } from '@test/mocks/class/SimulatorAvailabilityTransformerMock';
import { SimulatorBookingAvailabilityTransformerMock } from '@test/mocks/class/SimulatorBookingAvailabilityTransformerMock';
import { MmbModalServiceMock } from '@test/mocks/services/MmbModalServiceMock';
import { MmBUtilsSharedServiceMock } from '@test/mocks/services/MmBUtilsSharedServiceMock';
import { MmBDatalayerUtilsServiceMock } from '@test/mocks/services/MmBDatalayerUtilsServiceMock';
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';
import { EventInfoMock, EventInfoUpperMock, EventInfoBottomMock } from './mocks/ib-MmB-simulator-booking-availability-events-info.mock';
import { modelMock, originDestinationsMock1, originDestinationsMock2, selectedSliceMock1, selectedSliceMock2, selectedSliceMock3,selectedSliceMock4, flightsOutwardMock0, flightsOutwardMock1, flightsOutwardMock2, flightsOutwardMock3, flightsReturnsMock0, flightsReturnsMock1, flightsReturnsMock2, sisterInfoMock1, outboundFlightSelectedInfoMock1} from './mocks/ib-MmB-simulator-booking-availability-models.mock';

describe('ibMmbSimulatorBookingAvailability test', () => {
    let $componentController, $rootScope, $scope, controller, expectData, $q, localStorage, fakeMmBModalService, fakeMmBUtilsSharedService, fakeSimulatorAvailabilityTransformer, fakeSimulatorBookingAvailabilityTransformer, fakeDatalayerUtilsService;
    let fakeNewSisterCitiesModel = require('./mocks/ib-MmB-simulator-booking-availability-new-sister-cities-model-mock.json');
    let model = angular.copy(modelMock);
    let fakeEventInfo = angular.copy(EventInfoMock);
    const fakeflights = require('./mocks/ib-MmB-simulator-booking-availability-flights-mock.json');
    const fakeflightsUpper = require('./mocks/ib-MmB-simulator-booking-availability-flightsUpper-mock.json');
    const fakeflightsBottom = require('./mocks/ib-MmB-simulator-booking-availability-flightsBottom-mock.json');
    const fakeorigindestination = require('./mocks/ib-MmB-simulator-booking-availability-originDestination-mock.json');
    const fakeorigindestinationUpper = require('./mocks/ib-MmB-simulator-booking-availability-originDestinationUpper-mock.json');
    const fakeorigindestinationBottom = require('./mocks/ib-MmB-simulator-booking-availability-originDestinationBottom-mock.json');
    let fakeEventInfoUpper = angular.copy(EventInfoUpperMock);
    let fakeEventInfoBottom = angular.copy(EventInfoBottomMock);
    let fakeSimulatorBookingAvailabilityTransformerFilter  = {
        'applyFilter' : jasmine.createSpy('applyFilter').and.returnValue([{visibility : true}]),
    };
    let fakeMmBAppConstants = {
        'QUADRIGAM' : {
            SIMULATOR_AVAILABILITY_ONEWAY: 'STCPOW',
            SIMULATOR_AVAILABILITY_ROUNDTRIP: 'STCPRT',
            SIMULATOR_ERROR_RIBBON: 'STCERR',
        },
        'PNR_EMITION_CHANNEL' : {
            'FLEX_FLIGHT_DIRECT': ['IBCOM', 'CALL_CENTER', 'NDC_DIRECT']
        }
    };
    let fakeVCAvailability = {
        'responseId': 'responseIDMock'
    };
    let fakeSimulatorFareOrquestator = {
        'callFare' : jasmine.createSpy('callFare').and.returnValue(Promise.resolve('mockedValue'))
    };
    let fakeSimulatorAvailabilityOrchestrator = {
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
    }
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
        createSelectItemEvent: jasmine.createSpy()
    };

    let fakeBookingAvailabilityConstants = {
        daysAfter: 2,
        ONE_DAY_MILISECONDS: 3600*24,
        SLICK_STATUS: {
            LOADING: 'LOADING',
            DISABLED: 'DISABLED'
        }
    };

    const commonsServicesAction = () => {
        fakeSimulatorAvailabilityOrchestrator.availability = jasmine.createSpy('availability').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve('test');
            return deferred.promise;
        });
        fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': $q.when({})
            };
        });
    }

    beforeEach(() => {
        fakeSimulatorAvailabilityTransformer = new SimulatorAvailabilityTransformerMock();
        fakeSimulatorBookingAvailabilityTransformer = new SimulatorBookingAvailabilityTransformerMock();
        fakeMmBModalService = new MmbModalServiceMock();
        fakeMmBUtilsSharedService = new MmBUtilsSharedServiceMock();
        fakeDatalayerUtilsService = new MmBDatalayerUtilsServiceMock();

        angular.mock.module('ib-MmB-simulator-booking-availability-module','ib-MmB-filters-module','LocalStorageModule', ($provide) => {
            $provide.value('SimulatorBookingAvailabilityTransformer', fakeSimulatorBookingAvailabilityTransformer);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('SimulatorBookingAvailabilityTransformerFilter', fakeSimulatorBookingAvailabilityTransformerFilter);
            $provide.value('$filter', filterFake);
            $provide.value('SimulatorAvailabilityTransformer', fakeSimulatorAvailabilityTransformer);
            $provide.value('BookingAvailabilityConstants', fakeBookingAvailabilityConstants);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('SimulatorFareOrquestator', fakeSimulatorFareOrquestator);
            $provide.value('SimulatorAvailabilityOrchestrator', fakeSimulatorAvailabilityOrchestrator);
            $provide.value('AvailabilityClass', fakeAvailabilityClass);
            $provide.value('FareClass', fakeFareClass);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DisruptionDashboardConstants', fakeDisruptionDashboardConstants);
            $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
            $provide.value('MmBDataLayerService', fakeMmBDataLayerService);
        });

        inject((_$rootScope_, _$componentController_,_localStorageService_,_$filter_,_$q_) => {
            $rootScope = _$rootScope_;
            $componentController = _$componentController_;
            $scope = $rootScope.$new();
            $q = _$q_;
            localStorage = _localStorageService_;

            controller = $componentController('ibMmbSimulatorBookingAvailability', {
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

    describe('when $onInit() is called', () => {
         const expectCommonsAssertions = () =>{
            expect(controller.slices.flightsOutward).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableOutbound).toEqual(true);
            expect(controller.indexRibbonReturn).toEqual(1);
            expect(controller.showCalendar).toEqual(true);
            expect(controller.showLoading).toEqual(false);
            expect(controller.slices.flightsReturns).toEqual([]);
            expect(controller.titleOutwardOrigin).toEqual('test1');
            expect(controller.titleOutwardDestiny).toEqual('test2');
            expect(controller.modelTotalPrice).toEqual('test');
        }
        beforeEach(()=> {
            controller.model = {...model};
            controller.model.originDestinations = [...originDestinationsMock2];
        });

        it('and modeflight is not equal to outbound or twice and isUnifiedFlow true and unifiedOptionalData is false', () => {
            controller.model = {...model};
            controller.model.originDestinations = [...originDestinationsMock2]
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
            expect(controller.titleReturnOrigin).toEqual('test3');
            expect(controller.titleReturnDestiny).toEqual('test4');
            expect(controller.modelTotalPrice).toEqual('test');
        });
        it('and modeflight is not equal to outbound or twice and isUnifiedFlow true and unifiedOptionalData is true', () => {
            localStorage.set('isUnifiedFlow', true);
            localStorage.set('unifiedOptionalData', {enabled: true});
            controller.model.modeFlight = 'return';
            localStorage.set('breakdownInfo', fakeBreakdownInfo);
            controller.$onInit();
            expect(controller.indexRibbonReturn).toEqual(1);
        });
        it('and modeflight is not equal to outbound or twice and isUnifiedFlow false', () => {
            localStorage.set('isUnifiedFlow', false);
            controller.model.modeFlight = 'return';
            localStorage.set('breakdownInfo', fakeBreakdownInfo);
            controller.$onInit();
            // expect(controller.indexRibbonReturn).toEqual(1);
        });
        it('Should set corretly values of model and modeflight is equal to outbound and originDestination 2 item', () => {
            controller.model.modeFlight = 'outbound';
            controller.$onInit();
            expectCommonsAssertions();
            expect(controller.titleReturnOrigin).toEqual('test3');
            expect(controller.titleReturnDestiny).toEqual('test4');
        });
        it('Should set corretly values of model and modeflight is equal to outbound and originDestination 1 item', () => {
            controller.model.originDestinations.pop();
            controller.model.modeFlight = 'outbound';
            controller.$onInit();
            expectCommonsAssertions();
        });
        xit('Should set corretly values of model and modeflight is equal to return and originDestination 1 item', () => {
            controller.model.originDestinations.pop();
            controller.model.modeFlight = 'return';
            controller.$onInit();
            localStorage.set('isUnifiedFlow', true);
            expect(controller.offersAvailableOutbound).toEqual(true);
            expect(controller.modelTotalPrice).toEqual('test');
        });
        it('Should set corretly values of model and modelempty and outbound', () => {
            controller.model.modeFlight = 'outbound';
            controller.model.modelempty = true;
            controller.$onInit();
            expect(controller.indexRibbonReturn).toEqual(1);
        });
        it('Should set corretly values of model and modelempty and return', () => {
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
        const expectedCommonsAssertions = () => {
            expect(controller.priceOfferSelected).toEqual(1);
            expect(controller.totalPriceDone).toEqual(true);
        };
        beforeEach(()=> {
            controller.model = {...model};
            controller.slices = {};
            controller.modelTotalPrice = {};
            controller.modelTotalPrice = {totalPrice : 300};
            controller.selectedSlide = [
                {
                    date : {
                        serviceDate : '2019-07-12'
                    }
                }
            ];
            controller.cabinSelectedIndexOutbound = 0;
            controller.fareSelectedIndexOutbound = 0;
        });
        it('if modelFlight is twice and typeFlight is outbound and outboundFlightSelected is true should set corretly values of model', () => {
            controller.selectedSlide = {...model.selectedSlide};
            controller.slices.flightsOutward = ['test1','test2'];
            controller.slices.flightsReturns = ['test3','test4'];
            controller.modeFlight = 'twice';
            controller.outboundFlightSelected = true;
            controller.open(1,1,'outbound');
            expect(controller.totalPriceDone).toEqual(false);
            expect(controller.cabinSelectedIndexOutbound).toEqual(1);
        });
        it('if modelFlight is twice and typeFlight is distints of outbound and returnFlightSelected is true should set corretly values of model (one selectedSlide)', () => {
            controller.returnFlightSelected = true;
            controller.slices.flightsOutward = ['test1','test2'];
            controller.slices.flightsReturns = ['test3','test4'];
            controller.modeFlight = 'twice';
            controller.open(1,1,'');
            expect(controller.cabinSelectedIndexReturn).toEqual(1);
        });
        it('if modelFlight is outbound should set corretly values of model', () => {
            controller.slices = {flightsOutward: []};
            controller.slices.flightsOutward[0] = angular.copy(flightsOutwardMock0);
            controller.modeFlight = 'outbound';
            controller.open(0,0,'');
            expect(controller.cabinSelectedIndexOutbound).toEqual(0);
            expect(controller.cabinSelectedIndexOutbound).toEqual(0);
            expectedCommonsAssertions();
            
        });
        it('if modelFlight is return should set corretly values of model', () => {
            controller.slices = {flightsReturns: []};
            controller.slices.flightsReturns[0] = angular.copy(flightsReturnsMock0);
            controller.modeFlight = 'return';
            controller.open(0,0,'');
            expect(controller.cabinSelectedIndexReturn).toEqual(0);
            expect(controller.cabinSelectedIndexReturn).toEqual(0);
            expectedCommonsAssertions();
        });
    });

    describe('when updateFareSelected() is called', () => {
        const commonsCases = () => {
            controller.modeFlight = 'twice';
            controller.slices.flightsReturns = [...flightsReturnsMock2];
            controller.outboundFlightSelectedInfo = {...outboundFlightSelectedInfoMock1}
            controller.sliceSelectedIndexReturn = 0;
            controller.cabinSelectedIndexReturn = 0;
        };
        const broadcastAction = () => {
            $rootScope.$broadcast('updateFareSelected',{
                selectedFare : 0,
                typeFlight: 'outbound'
            });
        }
        const expectedCommonsAssertion = () => {
            expect(controller.priceOfferSelected).toEqual(1);
            expect(controller.modelTotalPrice.totalPrice).toEqual(1);
            expect(controller.totalPriceDone).toEqual(true);
        };
        beforeEach(()=> {
            controller.model = {...model};
            controller.bookingInfo = {...fakeBookingInfo};
            controller.slices = {};
            controller.modelTotalPrice = {};
            controller.cabinSelectedIndexOutbound = 0;
            controller.fareSelectedIndexOutbound = 0;
        });
        it('If modeFlight is twice and info.typeFlight is different of outbound should set corretly values of model', () => {
            commonsCases();
            $rootScope.$broadcast('updateFareSelected',{
                selectedFare : 0,
                typeFlight: ''
            });
            expect(controller.fareSelectedIndexReturn).toEqual(0);
            expect(controller.priceOfferSelected).toEqual(1);
            expect(controller.priceOfferSelectedFormated).toEqual('1�');
            expect(controller.oldOfferOutboundSelected).toEqual('1�');
            expect(controller.modelTotalPrice.totalPrice).toEqual(1);
            expect(controller.totalPriceDone).toEqual(true);
        });
        it('If modeFlight is twice and info.typeFlight is outbound should set corretly values of model', () => {
            commonsCases();
            broadcastAction();
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
            controller.modeFlight = 'outbound';
            controller.sliceSelectedIndexOutbound = 0;
            controller.modelTotalPrice.totalPrice = 0;
            controller.slices.flightsOutward = angular.copy(flightsOutwardMock1);
            broadcastAction();
            expect(controller.fareSelectedIndexOutbound).toEqual(0);
            expectedCommonsAssertion();
        });
        it('If modeFlight is return should set corretly values of model', () => {
            controller.modeFlight = 'return';
            controller.sliceSelectedIndexReturn = 0;
            controller.cabinSelectedIndexReturn = 0;
            controller.fareSelectedIndexReturn = 0;
            controller.modelTotalPrice.totalPrice = 0;
            controller.slices.flightsReturns = [...flightsReturnsMock2];
            broadcastAction();
            expect(controller.fareSelectedIndexReturn).toEqual(0);
            expectedCommonsAssertion();
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

    describe('when typeFilter() is called with typeflights with value outbound', () => {
        it('should set correct values', () => {
            controller.slices = {};
            controller.slices.flightsOutward = angular.copy(flightsOutwardMock2);
            $rootScope.$broadcast('typeFilterAvailability',{typeFlight : 'outbound'});
            expect(controller.slices.flightsOutward).toEqual('test');
        });
    });

    describe('when typeFilter() is called with typeflights with value distint of outbound', () => {
        it('should set correct values', () => {
            controller.slices = {};
            controller.slices.flightsReturns = [...flightsReturnsMock2];
            $rootScope.$broadcast('typeFilterAvailability',{typeFlight : ''});
            expect(controller.slices.flightsReturns).toEqual('test');
        });
    });

    describe('when changeSelectedSlide()', () => {
        const commonsServicesCalled = ($q) => {
            fakeSimulatorAvailabilityOrchestrator.availability = jasmine.createSpy('availability').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({message: 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NEW_SEARCH'});
                return deferred.promise;
            });
        };
        const expectedCommonsAssertions = () => {
            expect(controller.showLoading).toEqual(false);
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(0);
            expect($scope.$emit).toHaveBeenCalledWith('changeDataAvailability', {data: 'test', modeFlight: 'twice' , penalty: undefined});
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD2');
        };
        beforeEach(()=> {
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });
            commonsServicesAction();
        });
        it('should set correct values when with index OD1 and getAvailability resolve', () => {
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = [{test: 'test'}]
            controller.modeFlight = '';
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.slices = {};
            controller.model.originDestinations = [{loadingAvailability : 'false'}];
            controller.slices.flightsReturns = [...flightsReturnsMock2];
            spyOn($scope, '$emit');
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected','', 'OD1');
            $rootScope.$digest();
            expect(controller.showLoading).toEqual(false);
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(0);
            expect($scope.$emit).toHaveBeenCalledWith('changeDataAvailability', {data: 'test', modeFlight: '' , penalty: undefined});
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD2');
            expect(controller.model.originDestinations[0]).toEqual({ loadingAvailability: true, test: 'test' });
        });
        it('should set correct values when with index OD1 and getAvailability resolve and model is undefined', () => {
            controller.flights = [{test: 'test'}]
            controller.modeFlight = '';
            controller.model = undefined;
            controller.slices = {};
            controller.slices.flightsReturns = [...flightsReturnsMock2];
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected','', 'OD1');
            $rootScope.$digest();
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD2');
        });
        it('should set correct values when with index OD1 and getAvailability resolve and modeFlight equal to twice and with changeBottomLimit', () => {
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = fakeflights
            controller.modeFlight = 'twice';
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.slices = {};
            controller.model.originDestinations = fakeorigindestination;
            controller.slices.flightsReturns = [...flightsReturnsMock2];
            spyOn($scope, '$emit');
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected', fakeEventInfo , 'OD1');
            $rootScope.$digest();
            expectedCommonsAssertions();
        });
        it('should set correct values when with index OD1 and getAvailability resolve and modeFlight equal to twice and with changeBottomLimit and date to change is lower than selected', () => {
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = fakeflightsBottom
            controller.modeFlight = 'twice';
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.slices = {};
            controller.model.originDestinations = fakeorigindestinationBottom;
            controller.slices.flightsReturns = [...flightsReturnsMock2]
            spyOn($scope, '$emit');
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected', fakeEventInfoBottom , 'OD1');
            $rootScope.$digest();
            expectedCommonsAssertions();
        });
        it('should set correct values when with index OD1 and getAvailability resolve and modeFlight equal to twice and with changeUpperLimit', () => {
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = fakeflightsUpper;
            controller.modeFlight = 'twice';
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 1;
            controller.slices = {};
            controller.model.originDestinations = fakeorigindestinationUpper.originDestinations;
            controller.slices.flightsReturns = [...flightsReturnsMock2]
            spyOn($scope, '$emit');
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected', fakeEventInfoUpper , 'OD2');
            $rootScope.$digest();
            expect(controller.dates).toEqual('test');
            expect(controller.model.currentOriginDestinationIndex).toEqual(1);
            expect($scope.$broadcast).toHaveBeenCalledWith('changeCurrentSelectedIndex', 'OD1');

        });
        it('should set correct values when with index OD1 and getAvailability reject', () => {
            inject(($q) =>  {
                commonsServicesCalled($q);
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
            controller.slices.flightsReturns = [...flightsReturnsMock2]
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
            inject(($q) =>  {
                commonsServicesCalled($q);
            });
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = [{test: 'test'}]
            controller.modeFlight = '';
            controller.offersAvailableOutbound = false;
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.slices = {};
            controller.model.originDestinations = [{loadingAvailability : 'false'},{loadingAvailability : 'false'}];
            controller.slices.flightsReturns = [...flightsReturnsMock2]
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
            inject(($q) =>  {
                commonsServicesCalled($q);
            });
            controller.bookingInfo = {...fakeBookingInfo};
            controller.flights = [{test: 'test'}]
            controller.modeFlight = '';
            controller.offersAvailableOutbound = false;
            controller.model = {};
            controller.model.currentOriginDestinationIndex = 0;
            controller.selectedSlide = [{index : 'OD2'},{date : ''}];
            controller.slices = {};
            controller.model.originDestinations = [{loadingAvailability : 'false'},{loadingAvailability : 'false'}];
            controller.slices.flightsReturns = [...flightsReturnsMock2]
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
        it('should set correct values when without index and getAvailability reject and internalErrorCode is SSE_AVM_18012', () => {
            fakeSimulatorAvailabilityOrchestrator.availability = jasmine.createSpy('availability').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({message: 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NEW_SEARCH', internalErrorCode: 'SSE_AVM_18012' });
                return deferred.promise;
            });
            let phoneCallCenter = controller.getPhoneCallCenter();
            controller.channelDirect = true;
            spyOn($scope, '$broadcast');
            $rootScope.$broadcast('slideSelected','', '');
            $rootScope.$digest();
            expect(phoneCallCenter).toEqual('+34 123456789');
        });
    });


    describe('when updateAvailability is called', () => {
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
            localStorage.set('isUnifiedFlow', false);
            controller.bookingInfo = {...fakeBookingInfo};
            controller.modeFlight = 'return';
            controller.slices = {flightsOutward: {}, flightsReturns: {visibility: true}};
            $rootScope.$broadcast('updateAvailability',{});
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableReturn).toEqual(true);
        });
        it('should set correct values when modeFlights is return isUnifiedFlow true and VOLUNTARY_CHANGE', () => {
            localStorage.set('isUnifiedFlow', true);
            localStorage.set('unifiedOfferType', 'VOLUNTARY_CHANGE');
            controller.bookingInfo = {...fakeBookingInfo};
            controller.modeFlight = 'return';
            controller.slices = {flightsOutward: {}, flightsReturns: {visibility: true}};
            $rootScope.$broadcast('updateAvailability',{});
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableReturn).toEqual(true);
        });
        it('should set correct values when modeFlights is return isUnifiedFlow true and INVOLUNTARY_CHANGE', () => {
            localStorage.set('isUnifiedFlow', true);
            localStorage.set('unifiedOfferType', 'INVOLUNTARY_CHANGE');
            controller.bookingInfo = {...fakeBookingInfo};
            controller.modeFlight = 'return';
            controller.slices = {flightsOutward: {}, flightsReturns: {visibility: true}};
            $rootScope.$broadcast('updateAvailability',{});
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
            expect(controller.offersAvailableReturn).toEqual(true);
        });
    });

    describe('when acceptAvailability', () => {
        beforeEach(() => {
            controller.model = {};
            controller.model.originDestinations = [
                {originDestinationId : 'OD1'},
                {originDestinationId : 'OD2'}
            ]
            controller.sliceSelectedIndexOutbound = 0;
            controller.sliceSelectedIndexReturn = 0;
            controller.cabinSelectedIndexOutbound = 0;
            controller.cabinSelectedIndexReturn = 0;
            controller.fareSelectedIndexOutbound = 0;
            controller.fareSelectedIndexReturn = 0;
            controller.slices = {};
            controller.slices.flightsOutward = angular.copy(flightsOutwardMock3);
            controller.slices.flightsReturns = angular.copy(flightsReturnsMock1);

        });

        xit('When modeFlights is twice  and FareReshopService resolve, should save info in LocalStorageCorrectly', (done) => {
            controller.modeFlight = 'twice';
            localStorage.set('isUnifiedFlow', true);
            controller.acceptAvailability();
            $rootScope.$digest();
            // expect(localStorage.get('fareData')).toEqual({ offers: [{ offerItems: [ { offerItemId: '1' } ], cashAviosPossibilities: {  } }], fareFamilyConditions: {  }});
            // expect(localStorage.get('fareFamilyConditionsInfo')).toEqual({});
            // expect(localStorage.get('cashAviosPossibilities')).toEqual({});
            done();
        });

        xit('When modeFlights is outbound and FareReshopService resolve, should save info in LocalStorageCorrectly', () => {
            controller.modeFlight = 'outbound';
            localStorage.set('isUnifiedFlow', false);
            controller.acceptAvailability();
            $rootScope.$digest();
            expect(localStorage.get('fareData')).toEqual({ offers: [{ offerItems: [ { offerItemId: '1' } ], cashAviosPossibilities: {  } }], fareFamilyConditions: {  }});
            expect(localStorage.get('fareFamilyConditionsInfo')).toEqual({});
            expect(localStorage.get('cashAviosPossibilities')).toEqual({});
        });

        xit('When modeFlights is return and FareReshopService resolve, should save info in LocalStorageCorrectly', () => {
            controller.modeFlight = 'return';
            controller.acceptAvailability();
            $rootScope.$digest();
            expect(localStorage.get('fareData')).toEqual({ offers: [{ offerItems: [ { offerItemId: '1' } ], cashAviosPossibilities: {  } }], fareFamilyConditions: {  }});
            expect(localStorage.get('fareFamilyConditionsInfo')).toEqual({});
            expect(localStorage.get('cashAviosPossibilities')).toEqual({});
        });

        xit('When modeFlights is twice and FareReshopService reject, should save info in LocalStorageCorrectly', () => {
            controller.modeFlight = 'twice';
            controller.acceptAvailability();
            $rootScope.$digest();
            // expect(fakeFareReshopService.getFareReshop).toHaveBeenCalled();
        });
    });

    describe('when resetFilter is called', () => {
        it('When typeflight is outbound should restore copy of flight outward', () => {
            controller.slices = {};
            controller.slices.flightsOutward = {}
            $rootScope.$broadcast('resetFilterDataModal','outbound');
            expect(controller.slices.flightsOutward).toEqual({});
        });
        it('When typeflight is distint of outbound should restore copy of flight return', () => {
            controller.slices = {};
            controller.slices.flightsReturns = {}
            $rootScope.$broadcast('resetFilterDataModal','return');
            expect(controller.slices.flightsReturns).toEqual({});
        });
    });

    describe('when captureFilterData is called', () => {
        beforeEach(() => {
            controller.copyFlightOutward  = 'test';
            controller.copyFlightReturn = 'test';
            controller.slices = {};
            controller.slices.flightsOutward = 'test';
            controller.slices.flightsReturns = 'test';
        });
        it('When typeflight is outbound and entryFiltersFirstTimeOutBound is true should update copy of flight outward', () => {
            controller.entryFiltersFirstTimeOutBound = true;
            $rootScope.$broadcast('filterDataModal',{typeFlight : 'outbound'});
            expect(controller.copyFlightOutward).toEqual('test');
            expect(controller.entryFiltersFirstTimeOutBound).toEqual(false);
            expect(controller.slices.flightsOutward).toEqual([{ visibility: true }]);
        });
        it('When typeflight is outbound and entryFiltersFirstTimeOutBound is false should update copy of flight outward', () => {
            controller.entryFiltersFirstTimeOutBound = false;
            $rootScope.$broadcast('filterDataModal',{typeFlight : 'outbound'});
            expect(controller.copyFlightOutward).toEqual('test');
            expect(controller.slices.flightsOutward).toEqual([{ visibility: true }]);
        });
        it('When typeflight is distint of outbound and entryFiltersFirstTimeOutBound is true should update copy of flight return', () => {            
            controller.entryFiltersFirstTimeReturn = true;
            $rootScope.$broadcast('filterDataModal',{typeFlight : 'return'});
            expect(controller.copyFlightReturn).toEqual('test');
            expect(controller.entryFiltersFirstTimeReturn).toEqual(false);
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
        });
        it('When typeflight is outbound and entryFiltersFirstTimeOutBound is false should update copy of flight return', () => {
            controller.entryFiltersFirstTimeReturn = false;
            $rootScope.$broadcast('filterDataModal',{typeFlight : 'return'});
            expect(controller.copyFlightReturn).toEqual('test');
            expect(controller.slices.flightsReturns).toEqual([{ visibility: true }]);
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
        it('When slices > 1', () => {
            let fakeModel = {...model};
            let generateQuadrigam;
            fakeModel.selectedSlice = [...selectedSliceMock1];

            generateQuadrigam = controller.generateQuadrigam(fakeflights, fakeModel);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.SIMULATOR_AVAILABILITY_ROUNDTRIP);
        });
        it('When slices = 1', () => {
            let fakeModel = {...model};
            let generateQuadrigam;

            fakeModel.selectedSlice = [...selectedSliceMock2];
            fakeModel.originDestinations = [
                {
                    originCity: {
                        description: 'test1'
                    },
                    destinationCity : {
                        description: 'test2'
                    }
                }
            ];
            generateQuadrigam = controller.generateQuadrigam(fakeflights, fakeModel);
            expect(generateQuadrigam).toEqual(fakeMmBAppConstants.QUADRIGAM.SIMULATOR_AVAILABILITY_ONEWAY);
            $rootScope.$digest();
        });
    });

    describe('when openSisterCity is called', () => {
       beforeEach(() => {
            commonsServicesAction();
            spyOn(fakeMmBModalService, 'showGenericModal');
            localStorage.set('isUnifiedFlow', true);
            controller.sisterInfo = [...sisterInfoMock1];
            controller.newSisterCities = fakeNewSisterCitiesModel;
            controller.model = {...model};
       });
        it('When openSisterCity and index 0', (done) => {
            controller.model.selectedSlice = angular.copy(selectedSliceMock3);
            controller.openSisterCity(0);
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
        it('When asdopenSisterCity and index 1', (done) => {
            localStorage.set('unifiedOfferType', 'test2');
            controller.model.selectedSlice = [...selectedSliceMock4];
            controller.model.originDestinations = [...originDestinationsMock1];
            controller.openSisterCity(1);
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });

});
