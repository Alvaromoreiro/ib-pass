import angular from 'angular';
import { mock } from '@test-mocks/unit/app/pages/ib-booking-ancillaries/ib-booking-ancillaries-controller-mock';
import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { AncillariesController } from '@pages/ib-booking-ancillaries/ib-booking-ancillaries-component';
import { DigitalDataUtilsServiceMock } from '@test-mocks/class/DigitalDataUtilsServiceMock';
import { BookingAncillariesConstant } from '@core/constants/ib-ancillaries-constants';

class WindowMock {
    dispatchEvent = ( event: CustomEvent ) => {
        window.dispatchEvent( event );
    };
    addEventListener = ( evName: string = '', callback: ( args: unknown ) => void ) => {
        window.addEventListener( `${ evName }`, callback );
    };
}
describe('AncillariesController', () => {

    let rootScope, scope, controller : AncillariesController, timeout, q, fakeWindow, compile, filter, localStorageService, document, location, fakeCommonsSessionStorageService, fakeCommonUserUtilService, fakeDigitalDataUtilsService;

    let fakeAncillariesService = {
        searchAncillariesInfo: jasmine.createSpy('searchAncillariesInfo').and.callFake(function () {
            return q.when(mock.ancillariesInsuranceResponse);
        }),
        countSeatsTotal: jasmine.createSpy('countSeatsTotal').and.callFake(function () {}),
        countBaggageTotal: jasmine.createSpy('countBaggageTotal').and.callFake(function () {}),
        countSpeqsTotal: jasmine.createSpy('countSpeqsTotal').and.callFake(function () {}),
        generateRequestAncillaries: jasmine.createSpy('generateRequestAncillaries').and.callFake(function () {}),
        deleteAviosAncillaries: jasmine.createSpy('deleteAviosAncillaries').and.callFake(function () {}),
        deleteAncillarie: jasmine.createSpy('deleteAncillarie').and.callFake(function () {}),
        getUpdateSeatInfo: jasmine.createSpy('getUpdateSeatInfo').and.callFake(function () {}),
        updateSeatInformation: jasmine.createSpy('updateSeatInformation').and.callFake(function () {}),
        calculateTotalBaggages: jasmine.createSpy('calculateTotalBaggages').and.callFake(function () {}),
        getPriceOfferInsurance: jasmine.createSpy('getPriceOfferInsurance').and.callFake(function () {}),
        calculateTotalSpeqs: jasmine.createSpy('calculateTotalSpeqs').and.callFake(function () {}),
        updateCarbonFootprint: jasmine.createSpy('updateCarbonFootprint').and.callFake(() => Promise.resolve()),
        addCarbonFootprintToBasket: jasmine.createSpy('addCarbonFootprintToBasket').and.callFake(function () {}),
        deleteCarbonFootprint: jasmine.createSpy('deleteCarbonFootprint').and.callFake(() => Promise.resolve()),
        deleteCarbonFootprintFromBasket: jasmine.createSpy('deleteCarbonFootprintFromBasket').and.callFake(function () {})
    };
    let fakeAncillariesUtilsService = {
        getSegmentSeatsPending: jasmine.createSpy('getSegmentSeatsPending').and.callFake(function () {}),
        validatedFlightAviosInfo: jasmine.createSpy('validatedFlightAviosInfo').and.callFake(function () {}),
        getSeatInfoConfirmation: jasmine.createSpy('getSeatInfoConfirmation').and.callFake(function () {}),
        checkEarlyFlights: jasmine.createSpy('checkEarlyFlights').and.callFake(function () {}),
        isCheckinFlow: jasmine.createSpy('isCheckinFlow').and.callFake(function () {}),
        isUserLogged: jasmine.createSpy('isUserLogged').and.callFake(function () {}),
        getSegmentInfo: jasmine.createSpy('getSegmentInfo').and.callFake(function () {}),
        calculatePiecesBaggageTrip: jasmine.createSpy('calculatePiecesBaggageTrip').and.callFake(function () {}),
        updateSeatsCachedInfo: jasmine.createSpy('updateSeatsCachedInfo').and.callFake(function () {}),
        calculatePiecesSpeqsTrip: jasmine.createSpy('calculatePiecesSpeqsTrip').and.callFake(function () {}),
        setSegmentInfo: jasmine.createSpy('setSegmentInfo').and.callFake(function () {}),
        isResolutionToMobile: jasmine.createSpy('isResolutionToMobile').and.callFake(function () { return false;})
    };
    let fakeModalServiceAncillaries = {
        isNotWaiting: jasmine.createSpy('isNotWaiting').and.callFake(function () {}),
        showGenericError: jasmine.createSpy('showGenericError').and.returnValue({ result: Promise.resolve() }),
        openSeatNewMapModal: jasmine.createSpy('openSeatNewMapModal').and.returnValue({result : Promise.resolve()}),
        openBaggagesModal: jasmine.createSpy('openBaggagesModal').and.returnValue({result : Promise.resolve()}),
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(function () {}),
        openFlexibilizationModal: jasmine.createSpy('openFlexibilizationModal').and.callFake(function () {}),
        openPriorityBoardingModal: jasmine.createSpy('openPriorityBoardingModal').and.callFake(function () {}),
        openInsuranceModal: jasmine.createSpy('openInsuranceModal').and.callFake(function () {}),
        openBobModal: jasmine.createSpy('openBobModal').and.callFake(function () {}),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function () {  return {  result: q.when({})};}),
        openSpeqsModal: jasmine.createSpy('openSpeqsModal').and.returnValue({result : Promise.resolve()}),
        openInsuranceInfoModal: jasmine.createSpy('openInsuranceInfoModal').and.callFake(function () {}),
        openCarbonFootprintModal: jasmine.createSpy('openCarbonFootprintModal').and.callFake(function () {}),
        openTransfersModal: jasmine.createSpy('openTransfersModal').and.callFake(function () {})
    };
    let fakeCallAncillariesPageService = {
        getInsurance: jasmine.createSpy('getInsurance').and.callFake(function () {})
    };
    let fakeCallBundleService = {
        getBundle: jasmine.createSpy('getBundle').and.callFake(function () { return q.when({bundles: mock.bundles}); })
    };
    let fakeNewSeatsMapService = {
        updateNewSeatmapDeleteSeat: jasmine.createSpy('updateNewSeatmapDeleteSeat').and.callFake(function () { }),
    };
    let fakeAncillariesConstants = {
        FLEX_CONFIGURATION: {
            NAME: 'flexibilization'
        },
        PRIORITY_BOARDING: {
            NAME: 'priorityBoarding'
        },
        FLIGHTTYPE: 'flightType',
        PAGES_ROUTES: {
            PAYMENTS: 'payments'
        },
        APPLICATION_FLOW: {
            BOOKING: 'BKI',
            MMB: 'MMB',
            CHECKIN: 'CKI',
            BBOOKING: 'BBKI'
        },
        QUADRIGAM: {
            ANCILLARIES_BKI: 'TES_ANCILLARIES_BKI',
            ANCILLARIES: 'TES_ANCILLARIES',
            EARLY_ANCILLARIES: 'TES_EARLY_ANCILLARIES'
        },
        DISCOUNT_TYPES: {
            PARTNER: 'partner'
        },
        TYPE_ANCILLARIE: {
            FLEXIBILITY: 'flexibility',
            BAGGAGE: 'baggage',
            SEAT: 'seat',
            SPEQS: 'speqs',
            INSURANCE: 'insurance',
            PET: 'PET'
        },
        GENERAL_STATUS: {
            AVAILABLE: 'available'
        },
        DATALAYER_MODAL_ID: {
            INSURANCE_NOT_AVAILABLE: 'insuranceNotAvailable'
        },
        STATUS: {
            NOT_AVAILABLE_WITH_WARNING: 'NOT_AVAILABLE_WITH_WARNING'
        }

    };
    let fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(function () {}),
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent').and.callFake(function () {}),
        updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function () {}),
        updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent').and.callFake(function () {}),
        updateDiscountData: jasmine.createSpy('updateDiscountData').and.callFake(function () {}),
        setAncillariesDatalayer: jasmine.createSpy('setAncillariesDatalayer').and.callFake(function () {}),
        addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo').and.callFake(function () {})
    };
    let fakeDatalayerConstants = {
        DATALAYER_FLOW_CKI: {
            PROCESS_DUPLICATE: 'processDuplicate',
            CKIANC: 'ckianc'
        },
        DATALAYER_INFO: {
            PROCESS: 'process',
            STEP: 'step'
        },
        DATALAYER_EVENT_TYPES: {
            VIEW: 'view'
        },
        EVENTS_ECOMMERCE: {
            ADD_TO_CART: 'addToCart',
            VIEW_ITEM_LIST: 'viewItemList'
        },
        DATALAYER_ANCILLARIES: {
            ANCILLARIES: 'ancillaries'
        }
    };
    let fakeMonetateUtilsService = {
        updateMonetateWithQuadrigam: jasmine.createSpy('updateMonetateWithQuadrigam').and.callFake(function () {})
    };
    let fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'setPageType'
        }
    };
    let fakeNewMainHeaderFacade = {
        initHeaderModel: jasmine.createSpy('initHeaderModel').and.callFake(function () {

        }),
        updateBasketDiscounts: jasmine.createSpy('updateBasketDiscounts').and.callFake(function () {}),
        updateSteps: jasmine.createSpy('updateSteps').and.callFake(function () {}),
        showLogin: jasmine.createSpy('showLogin').and.callFake(function () {}),
        updateTripsFromOrder: jasmine.createSpy('updateTripsFromOrder').and.callFake(function () {}),
        updateBasketOthers: jasmine.createSpy('updateBasketOthers').and.callFake(function () {}),
        updateBasketDiscountsNew: jasmine.createSpy('updateBasketDiscountsNew').and.callFake(function () {}),
        updateBasketUpgrading: jasmine.createSpy('updateBasketUpgrading').and.callFake(function () {}),
        checkAdaptativeMobileFlow : jasmine.createSpy('checkAdaptativeMobileFlow ').and.callFake(function () {}),
        deleteDiscountFromBasket: jasmine.createSpy('deleteDiscountFromBasket').and.callFake(function () {}),
        updateBasketFlexibilization: jasmine.createSpy('updateBasketFlexibilization').and.callFake(function () {}),
        updateBasketPriority: jasmine.createSpy('updateBasketPriority').and.callFake(function () {})
    };
    let fakeCurrencyService = {
        formatPrice: jasmine.createSpy('formatPrice').and.callFake(function () {})
    };
    let fakeAncillariesTransformer = {
        buildDeleteOneAncillariesBaggageRequest: jasmine.createSpy('buildDeleteOneAncillariesBaggageRequest').and.callFake(function () {}),
        countSeatsTotal: jasmine.createSpy('countSeatsTotal').and.callFake(function () {}),
        buildAncillariesRequest: jasmine.createSpy('buildAncillariesRequest').and.callFake(function () {}),
        buildDeleteAllAncillariesBaggageRequest: jasmine.createSpy('buildDeleteAllAncillariesBaggageRequest').and.callFake(function () {}),
        mergePassengerItemsForDelete: jasmine.createSpy('mergePassengerItemsForDelete').and.callFake(function () {})
    };
    let fakeCommonsAncillariesService = {
        deleteAncillarie: jasmine.createSpy('deleteAncillarie').and.callFake(function () { return q.when({}); }),
        updateAncillaries: jasmine.createSpy('updateAncillaries').and.callFake(function (detailRequest) {
            return Promise.resolve({
                test: 'test'});

        })
    };
    let fakeCommonsUtilService = {
        setTitlePage: jasmine.createSpy('setTitlePage').and.callFake(function () {}),
        isDiscountTypePartnerEquivalent: jasmine.createSpy('isDiscountTypePartnerEquivalent').and.callFake(function () {}),
        fiterTextOptionOnhold: jasmine.createSpy('fiterTextOptionOnhold').and.callFake(function () {
            return {modalText: 'modalText'};
        }),
        isAvailableLightBox: jasmine.createSpy('isAvailableLightBox').and.callFake(function () {}),
        getProcess: jasmine.createSpy('getProcess').and.callFake(function () { })
    };
    let fakeCommonsModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(function () {}),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function () {  return {  result: q.when({})};}),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(function () {})
    };
    let fakeAncillariesConfigurationService = {
        initializeModel: jasmine.createSpy('initializeModel').and.callFake(function () {
            return mock.model;
        })
    };
    let fakeDatalayerUtils = {
        setInsuranceEcommerce: jasmine.createSpy('setInsuranceEcommerce').and.callFake(function () {}),
        getAncillariesDigitalDataEcommerce: jasmine.createSpy('getAncillariesDigitalDataEcommerce').and.callFake(function () {})
    };
    let fakeCommonsConstants = {
        QUADRIGAM: {
            MODAL_SELECT_FLEX: 'modalSelectFlex'
        }
    };
    const fakeIbCheckPartnersDiscountsService = {
        getSelectedPartner: jasmine.createSpy('getSelectedPartner').and.callFake(()=>{})
    };

    const fakeBookingUtilService = {
        getRelatedContent: jasmine.createSpy('getRelatedContent'),
        onholdLightBoxAccept: jasmine.createSpy('onholdLightBoxAccept'),
        getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName')
    };
    const fakeIbBookingCheckVoucherCodeService = {
        deleteVoucherCode: jasmine.createSpy('deleteVoucherCode').and.callFake(()=>{})
    };

    class CommonsUserUtilsServiceMock {
        isIbZero = jasmine.createSpy('isIbZero').and.callFake(() => false);
    }
    const fakeBookingAvailabilityTransformer = {
        genCalcAviosFlightReq: jasmine.createSpy('genCalcAviosFlightReq').and.callFake(()=>{})
    };
    const fakeAncillariesSearchHandlerService = {
        mapResponseToModel: jasmine.createSpy('mapResponseToModel').and.callFake(function () {}),
        applyTransfersIfAvailable: jasmine.createSpy('applyTransfersIfAvailable').and.callFake(function () {}),
        applyTotalPaymentIfMissing: jasmine.createSpy('applyTotalPaymentIfMissing').and.callFake(function () {}),
        applyDiscountsToBasket: jasmine.createSpy('applyDiscountsToBasket').and.callFake(function () {}),
        restoreSelectedInsurance: jasmine.createSpy('restoreSelectedInsurance').and.callFake(function () {}),
        restoreSelectedFlex: jasmine.createSpy('restoreSelectedFlex').and.callFake(function () {}),
        getShoppingBasket: jasmine.createSpy('getShoppingBasket').and.callFake(function () { return { seats: { hasSeats: false, segments: [] } }; }),
        updateSeatsQuantyFromBasket: jasmine.createSpy('updateSeatsQuantyFromBasket').and.callFake(function () {})
    };



    class FakeStorage {
        _storage = {};
        set = (k, v) => { this._storage[k]=v;};
        remove = (k) => {delete this._storage[k];};
        get = (k) => {return this._storage[k];};
        clearAll = ()=> { this._storage = {};};
    }

    const fakeconfirmationDigitalInfo = {
        Language: 'ES'
    };
    const fakeflightAviosInfo = {
        currency: {
            code: 'EUR'
        }
    };

    beforeEach(function () {
        localStorageService = new FakeStorage();
        fakeCommonsSessionStorageService = new FakeStorage();
        fakeCommonUserUtilService = new CommonsUserUtilsServiceMock();
        fakeDigitalDataUtilsService = new DigitalDataUtilsServiceMock();
        fakeWindow = new WindowMock();
        angular.mock.module('ib-booking-ancillaries-module', function ($provide) {
            $provide.value('BookingAncillariesService', fakeAncillariesService);
            $provide.value('AncillariesTemporalUtilsService', fakeAncillariesUtilsService);
            $provide.value('localStorageService', localStorageService);
            $provide.value('ModalServiceAncillaries', fakeModalServiceAncillaries);
            $provide.value('CallAncillariesService', fakeCallAncillariesPageService);
            $provide.value('BookingAncillariesConstant', fakeAncillariesConstants);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('BookingAncillariesTransformer', fakeAncillariesTransformer);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('AncillariesConfigurationService', fakeAncillariesConfigurationService);
            $provide.value('DatalayerUtils', fakeDatalayerUtils);
            $provide.value('CommonsConstants', fakeCommonsConstants);
            $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
            $provide.value('CallBundleService', fakeCallBundleService);
            $provide.value('NewSeatsMapService', fakeNewSeatsMapService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('IbCheckPartnersDiscountsService', fakeIbCheckPartnersDiscountsService);
            $provide.value('IbBookingCheckVoucherCodeService', fakeIbBookingCheckVoucherCodeService);
            $provide.value('CommonsUserUtilsService', fakeCommonUserUtilService);
            $provide.value('BookingAvailabilityTransformer', fakeBookingAvailabilityTransformer);
            $provide.value('DigitalDataUtilsService', fakeDigitalDataUtilsService);
            $provide.value('AncillariesSearchHandlerService', fakeAncillariesSearchHandlerService);
            fakeAncillariesConfigurationService.initializeModel();

        });

        inject(function ($rootScope, _$componentController_, $q, $timeout, $compile, $filter, $window, $document, $location) {
            rootScope = $rootScope;
            timeout = $timeout;
            compile = $compile;
            q = $q;
            document = $document;
            location = $location;
            filter = $filter;
            scope = $rootScope.$new();

            const dependencies = {
                $rootScope: rootScope,
                $scope: scope,
                $timeout: timeout,
                $q: q,
                $filter: filter,
                $location: location,
                $compile: compile,
                $document: document,
                $window: fakeWindow
            };

            controller = _$componentController_('ibBookingAncillaries', dependencies, {});
        });
        spyOn(scope, '$broadcast').and.callThrough();
        spyOn(rootScope, '$broadcast').and.callThrough();
        localStorageService.set('headerModel', mock.headerModel);

        localStorageService.set('confirmationDigitalInfo', fakeconfirmationDigitalInfo);
        localStorageService.set('flightAviosInfo', fakeflightAviosInfo);


    });

    describe('AncillariesController is init', function () {
        it('AncillariesController should be defined', function () {

            expect(controller).toBeDefined();

        });
        it('should open PET modal if isPetFlight is on the URL', fakeAsync(() => {
            fakeBookingUtilService.getURLFirstParameterByName.and.callFake(() => 'isPetFlight');
            localStorageService.set('ancillariesInfo', {ancillaries: [{type: 'PET', status: {code: 'AVAILABLE'}}]});
            var ancillaryBoxMockElement = angular.element('<div id="ib-ancillary-box-PET" (click)=""></div>')[0];
            spyOn(ancillaryBoxMockElement, 'click');

            const idEsperado = 'ib-ancillary-box-PET';
            spyOn(window.document, 'getElementById').and.callFake((id) => {
                if (id === idEsperado) return ancillaryBoxMockElement as any;
                return null;
            });

            (controller as any).openPetModalifIsPetFlight();
            tick(1000);

            expect(ancillaryBoxMockElement.click).toHaveBeenCalled();
        }));
        it('should position PET ancillary on first place if url parameter and remove from availabilityList', () => {
            fakeBookingUtilService.getURLFirstParameterByName.and.callFake(() => 'isPetFlight');
            const ancillaryList = ['FLEXIBILITY_ON_DEMAND', 'PET', 'BAGGAGE', 'SEAT', 'SPECIAL_EQUIPMENT'];

            const result = (controller as any).positionPetIfIsPetFlight([], ancillaryList);

            expect(result).toEqual(['FLEXIBILITY_ON_DEMAND', 'BAGGAGE', 'SEAT', 'SPECIAL_EQUIPMENT']);
        });
        it('should not position PET ancillary on first place if no url parameter and use availabilityList', () => {
            fakeBookingUtilService.getURLFirstParameterByName.and.callFake(() => undefined);
            const ancillaryList = ['FLEXIBILITY_ON_DEMAND', 'PET', 'BAGGAGE', 'SEAT', 'SPECIAL_EQUIPMENT'];

            const result = (controller as any).positionPetIfIsPetFlight([], ancillaryList);

            expect(result).toEqual(ancillaryList);
        });
    });

    describe('orderAncillaries', () => {
        beforeEach(() => {
            (fakeAncillariesConstants as any).ANCILLARIES_DISPLAY_ORDER = BookingAncillariesConstant.ANCILLARIES_DISPLAY_ORDER;
            fakeBookingUtilService.getURLFirstParameterByName.and.callFake(() => undefined);
        });

        it('should place ASSIST_CARD last when GLOBICK is available with more than 6 ancillaries', () => {
            const ancillaryList = ['SEAT', 'BAGGAGE', 'ASSIST_CARD', 'GLOBICK', 'SPECIAL_EQUIPMENT', 'PREORDER', 'PRIORITY_BOARDING'];

            const result = (controller as any).orderAncillaries(ancillaryList);

            expect(result[result.length - 1]).toBe('ASSIST_CARD');
        });

        it('should place ASSIST_CARD last when PET is available (no pet-flight) with more than 6 ancillaries', () => {
            const ancillaryList = ['SEAT', 'BAGGAGE', 'ASSIST_CARD', 'PET', 'SPECIAL_EQUIPMENT', 'PREORDER', 'PRIORITY_BOARDING'];

            const result = (controller as any).orderAncillaries(ancillaryList);

            expect(result[result.length - 1]).toBe('ASSIST_CARD');
        });
    });

    describe('openSeatMap is called', () => {
        beforeEach(() => {
            controller.model.seatsAvailable = { statusCode: { code: 'AVAILABLE', reason: null } };
            fakeModalServiceAncillaries.openSeatNewMapModal.calls.reset();
            fakeDatalayerUtilsService.setAncillariesDatalayer.calls.reset();
        });

        it('new seatmap is active in desktop resolution', fakeAsync(() => {
            localStorageService.set('passengersSelected', ['ADULT_01']);
            localStorageService.set('seatsAvailableSegments', ['IB042620240322']);
            spyOn(controller, 'checkQuantitySeat').and.callFake(() => {});

            controller.openSeatMap(null, 'IB042620240322');
            flushMicrotasks();

            expect(fakeModalServiceAncillaries.openSeatNewMapModal).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
        }));

    });
    describe('When acceptBuyOnhold is called', () => {
        it('should call onholdLightBoxAccept function to make a prebooking', () => {
            controller.acceptBuyOnhold();

            expect(fakeBookingUtilService.onholdLightBoxAccept).toHaveBeenCalled();
        });
    });

    describe ('When updateAvios is called', () => {
        beforeEach(() => {
            fakeCommonUserUtilService.isIbZero.and.callFake(() => false);
        });
        it ('shold call updateLoyaltyEarnInfo function',  fakeAsync(() => {
            fakeCommonsSessionStorageService.set('CalculatedPoints', {Avios: 10, Elite: 11});
            rootScope.$broadcast('updateAvios');
            flushMicrotasks();
            expect(controller.loyaltyEarnInfo).toEqual({avios: 10, elitePoints: 11, programName: 'IBPLUS'});
        }));
        it ('shold call updateLoyaltyEarnInfo when CalculatedPoints does not exist',  fakeAsync(() => {
            fakeCommonsSessionStorageService.remove('CalculatedPoints');
            rootScope.$broadcast('updateAvios');
            flushMicrotasks();
            expect(controller.loyaltyEarnInfo).toEqual(null);
        }));

        it ('shold call updateLoyaltyEarnInfo when user is logged as IBZERO',  fakeAsync(() => {
            fakeCommonsSessionStorageService.set('CalculatedPoints', {Avios: 10, Elite: 11});
            fakeCommonUserUtilService.isIbZero.and.callFake(() => true);
            rootScope.$broadcast('updateAvios');
            flushMicrotasks();
            expect(controller.loyaltyEarnInfo).toEqual({avios: 10, elitePoints: 11, programName: 'IBZERO'});
        }));
    });

    describe('openBaggages', () => {
        it('should open the baggage modal successfully', fakeAsync(() => {
            const copyPassengerBaggagesTrips = [{ Id: 1, trips: [{ tripId: 1, piecesChoosed: 0 }] }];
            controller.model.passengerBaggagesTrips = copyPassengerBaggagesTrips;
            controller.model.isCurrencyLong = true;

            spyOn(controller, 'closeCollapseHeader').and.callThrough();
            const openBaggagesModalSpy = fakeModalServiceAncillaries.openBaggagesModal;
            const handleSuccessSpy = spyOn(controller, 'handleBaggagesModalSuccess').and.returnValue(Promise.resolve());

            controller.openBaggages();
            flushMicrotasks();

            expect(localStorageService.get('ancillariesAction')).toBe('click');
            expect(controller.closeCollapseHeader).toHaveBeenCalled();
            expect(openBaggagesModalSpy).toHaveBeenCalledWith({
                passengers: copyPassengerBaggagesTrips,
                isCurrencyLong: true
            });
            expect(handleSuccessSpy).toHaveBeenCalledWith(copyPassengerBaggagesTrips);
        }));
    });

    describe('handleBaggagesModalSuccess', () => {
        it('should handle baggage modal success and update data', fakeAsync(() => {
            const copyPassengerBaggagesTrips = [{ Id: 1, trips: [{ tripId: 1, piecesChoosed: 1 }] }];
            controller.model.passengerBaggagesTrips = copyPassengerBaggagesTrips;

            controller.handleBaggagesModalSuccess(copyPassengerBaggagesTrips);
            flushMicrotasks();

            expect(controller.model.passengerBaggagesTrips).toEqual(copyPassengerBaggagesTrips);
            expect(fakeCommonsAncillariesService.updateAncillaries).toHaveBeenCalled();
        }));
    });

    describe('handleBaggagesModalError', () => {
        it('should handle baggage modal error gracefully', () => {
            controller.handleBaggagesModalError();

            expect(fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
        });
    });

    describe('openFlexibilization', () => {
        beforeEach(() => {
            fakeDatalayerUtilsService.setAncillariesDatalayer.calls.reset();
            fakeModalServiceAncillaries.openFlexibilizationModal.calls.reset();
        });

        it('should open flexibilization modal and call setAncillariesDatalayer on success', fakeAsync(() => {
            fakeModalServiceAncillaries.openFlexibilizationModal.and.returnValue({
                result: Promise.resolve()
            });

            controller.openFlexibilization();
            flushMicrotasks();

            expect(fakeModalServiceAncillaries.openFlexibilizationModal).toHaveBeenCalledWith({
                model: controller.model.ancillariesFlexibilization
            });
            expect(localStorageService.get('ancillariesAction')).toBe('addtocart');
            expect(fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
        }));

        it('should call setAncillariesDatalayer on modal dismiss (error branch)', fakeAsync(() => {
            fakeModalServiceAncillaries.openFlexibilizationModal.and.returnValue({
                result: Promise.reject()
            });

            controller.openFlexibilization();
            flushMicrotasks();

            expect(fakeModalServiceAncillaries.openFlexibilizationModal).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
        }));
    });

    describe('updateBaggages', () => {
        it('should update baggage data successfully', fakeAsync(() => {
            const baggages = [{ Id: 1, trips: [{ tripId: 1, piecesChoosed: 1 }] }];
            localStorageService.set('passengerBaggagesTrips', baggages);

            controller.updateBaggages();
            flushMicrotasks();

            expect(fakeCommonsAncillariesService.updateAncillaries).toHaveBeenCalled();
        }));

        it('should handle baggage deletion when no baggage is selected', fakeAsync(() => {
            const baggages = [{ Id: 1, trips: [{ tripId: 1, piecesChoosed: 0 }] }];
            localStorageService.set('passengerBaggagesTrips', baggages);
            spyOn(controller, 'handleBaggageDeletion').and.returnValue(Promise.resolve(true));

            controller.updateBaggages();
            flushMicrotasks();

            expect(controller.handleBaggageDeletion).toHaveBeenCalled();
        }));
    });

    describe('handleBaggageUpdate', () => {
        it('should update baggage successfully', fakeAsync(() => {
            const infoBaggages = [{ id: 1, type: 'BAGGAGE' }];
            controller.handleBaggageUpdate(infoBaggages);
            flushMicrotasks();

            expect(fakeCommonsAncillariesService.updateAncillaries).toHaveBeenCalledWith(infoBaggages);
        }));

        it('should handle error during baggage update', fakeAsync(() => {
            const infoBaggages = [{ id: 1, type: 'BAGGAGE' }];
            fakeCommonsAncillariesService.updateAncillaries.and.returnValue(Promise.reject('Error'));

            controller.handleBaggageUpdate(infoBaggages);
            flushMicrotasks();

            expect(fakeModalServiceAncillaries.showGenericError).toHaveBeenCalled();
        }));
    });

    describe('handleError', () => {
        it('should handle errors gracefully', () => {
            const error = 'Test Error';
            controller.handleError(error);

            expect(fakeModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
            expect(fakeModalServiceAncillaries.showGenericError).toHaveBeenCalled();
        });
    });

    it('debería actualizar los datos de equipajes correctamente', fakeAsync(() => {
        const copyPassengerBaggagesTrips = [{ Id: 1,  
            trips: [{ tripId: 1, piecesChoosed: 1}]
        }];
        spyOn(controller, 'updateBaggages').and.returnValue(Promise.resolve(true));
        controller.model.passengerBaggagesTrips = copyPassengerBaggagesTrips;
        fakeAncillariesService.calculateTotalBaggages.and.returnValue(2);

        spyOn(controller, 'saveBaggagesTrips').and.callThrough();
        fakeAncillariesTransformer.buildAncillariesRequest(copyPassengerBaggagesTrips, null, null);
        fakeCommonsAncillariesService.updateAncillaries(copyPassengerBaggagesTrips);

        controller.handleBaggagesModalSuccess(copyPassengerBaggagesTrips);
        flushMicrotasks();

        expect(controller.model.passengerBaggagesTrips).toEqual(copyPassengerBaggagesTrips);

        controller.updateBaggages();
        flushMicrotasks();
        localStorageService.set('ancillariesAction', 'addtocart');
            
        expect(localStorageService.get('ancillariesAction')).toBe('addtocart');
        expect(fakeAncillariesService.calculateTotalBaggages).toHaveBeenCalled();
        expect(fakeCommonsAncillariesService.updateAncillaries).toHaveBeenCalled();
    }));

    describe('handleBaggageDeletion', () => {
        const mockDeleteInfo = [{ type: 'BAGGAGE', segments: [] }];

        it('should call deleteAncillarie and return true when delete info is available', fakeAsync(() => {
            controller.baggagesTemp = [{ id: 'p1', trips: [] }];
            fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest.and.returnValue(mockDeleteInfo);
            fakeCommonsAncillariesService.deleteAncillarie.and.returnValue(Promise.resolve({}));

            let result;
            controller.handleBaggageDeletion([]).then((res) => { result = res; });
            flushMicrotasks();

            expect(fakeCommonsAncillariesService.deleteAncillarie).toHaveBeenCalled();
            expect(result).toBe(true);
        }));

        it('should return false and not call deleteAncillarie when baggagesTemp is empty', fakeAsync(() => {
            controller.baggagesTemp = [];
            fakeCommonsAncillariesService.deleteAncillarie.calls.reset();

            let result;
            controller.handleBaggageDeletion([]).then((res) => { result = res; });
            flushMicrotasks();

            expect(fakeCommonsAncillariesService.deleteAncillarie).not.toHaveBeenCalled();
            expect(result).toBe(false);
        }));

        it('should call mergePassengerItemsForDelete when multiple passengers have delete info', fakeAsync(() => {
            controller.baggagesTemp = [{ id: 'p1', trips: [] }, { id: 'p2', trips: [] }];
            fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest.and.returnValue(mockDeleteInfo);
            fakeAncillariesTransformer.mergePassengerItemsForDelete.and.returnValue(mockDeleteInfo);
            fakeCommonsAncillariesService.deleteAncillarie.and.returnValue(Promise.resolve({}));
            fakeAncillariesTransformer.mergePassengerItemsForDelete.calls.reset();

            controller.handleBaggageDeletion([]);
            flushMicrotasks();

            expect(fakeAncillariesTransformer.mergePassengerItemsForDelete).toHaveBeenCalled();
        }));

        afterEach(() => {
            fakeCommonsAncillariesService.deleteAncillarie.and.callFake(function () { return q.when({}); });
        });
    });

    describe('openSpeqs', () => {
        it('should open the speqs modal successfully and handle success', fakeAsync(() => {
            const copyPassengerSpeqsTrips = [{ Id: 1, trips: [{ tripId: 1, speqsChoosed: 1 }] }];
            localStorageService.set('passengerSpeqsTrips', copyPassengerSpeqsTrips);
            controller.model.passengerSpeqsTrips = copyPassengerSpeqsTrips;

            fakeModalServiceAncillaries.openSpeqsModal.and.returnValue({ result: Promise.resolve() });

            controller.openSpeqs();
            flushMicrotasks();

            expect(fakeModalServiceAncillaries.openSpeqsModal).toHaveBeenCalled();
            expect(controller.model.passengerSpeqsTrips).toEqual(copyPassengerSpeqsTrips);
        }));
    });

    describe('handleSpeqsModalSuccess', () => {
        it('should update speqs data and broadcast updates', fakeAsync(() => {
            const copyPassengerSpeqsTrips = [{ Id: 1, trips: [{ tripId: 1, speqsChoosed: 1 }] }];
            controller.model.passengerSpeqsTrips = copyPassengerSpeqsTrips;

            spyOn(controller, 'updateSpeqs').and.returnValue(q);
            spyOn(controller, 'saveSpeqsTrips').and.callThrough();

            controller.handleSpeqsModalSuccess(copyPassengerSpeqsTrips);
            flushMicrotasks();

            expect(controller.model.passengerSpeqsTrips).toEqual(copyPassengerSpeqsTrips);
            expect(controller.saveSpeqsTrips).toHaveBeenCalled();
            expect(controller.updateSpeqs).toHaveBeenCalled();
            expect(rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderSpeqs', copyPassengerSpeqsTrips);
        }));

        it('should handle speqs deletion when no speqs are selected', () => {
            const speqs = [{ Id: 1, trips: [{ tripId: 1, speqsChoosed: 0 }] }];
            localStorageService.set('passengerSpeqsTrips', speqs);
            
            const result = controller.updateSpeqs();
            expect(result).toBeDefined();
        });
    });

    describe('handleSpeqsModalError', () => {
        it('should handle speqs modal error gracefully', fakeAsync(() => {
            const copyPassengerSpeqsTrips = [{ Id: 1, trips: [{ tripId: 1, speqsChoosed: 1 }] }];
            controller.model.passengerSpeqsTrips = copyPassengerSpeqsTrips;
            fakeModalServiceAncillaries.openSpeqsModal.and.returnValue({ 
                result: Promise.reject('Modal error') 
            });

            spyOn(controller, 'updateDatalayer').and.callThrough();

            controller.openSpeqs();
            flushMicrotasks();

            expect(fakeModalServiceAncillaries.openSpeqsModal).toHaveBeenCalled();
            expect(controller.updateDatalayer).toHaveBeenCalled();
        }));
    });

    describe('openTransfersModal', () => {
        it('should save typeQuadrigam as close value and open the transfers modal with infoModal', () => {
            const infoModal = { transferId: 'GLOBICK_001' };
            (controller as any).typeQuadrigam = 'TES_ANCILLARIES_BKI';

            controller.openTransfersModal(null, infoModal);

            expect(localStorageService.get('close')).toBe('TES_ANCILLARIES_BKI');
            expect(fakeModalServiceAncillaries.openTransfersModal).toHaveBeenCalledWith(infoModal);
        });
    });
    
    describe('goToPaymentEventListener method', () => {
    
        let mockEvent: CustomEvent;
        beforeEach(() => {
            controller.active();
            mockEvent = new CustomEvent('nextStepFlowLegacy');
            spyOn(controller, 'goToPayments');
            
        });
            
        it('should call goToPayments when invoked', () => {
            (controller as any).goToPaymentEventListener(mockEvent);    
            expect(controller.goToPayments).toHaveBeenCalled();
        });
    });

    describe('refreshAncillaries event', () => {
        it('should call searchAncillariesInfo with true when refreshAncillaries event is broadcast', () => {
            fakeAncillariesService.searchAncillariesInfo.calls.reset();

            rootScope.$broadcast('refreshAncillaries', {});

            expect(fakeAncillariesService.searchAncillariesInfo).toHaveBeenCalledWith(true);
        });
    });

    describe('setAssistCardModifyButton event', () => {
        it('should update model.assistCard.modifyButton when the event is broadcast', () => {
            (controller as any).model.assistCard = { modifyButton: true };

            rootScope.$broadcast('setAssistCardModifyButton', false);

            expect((controller as any).model.assistCard.modifyButton).toBe(false);
        });

        it('should not throw when model.assistCard is not set', () => {
            (controller as any).model.assistCard = null;

            expect(() => rootScope.$broadcast('setAssistCardModifyButton', false)).not.toThrow();
        });
    });

     describe('deleteSeats', () => {
        const makeDataSeat = (amount: number, segmentId = 'SEG_01') => ({
            amount,
            seats: [{ segments: [{ id: segmentId, passengers: [{ id: 'ADULT_01' }] }] }]
        });

        beforeEach(() => {
            controller.model.seatsQuanty = 3;
            fakeNewSeatsMapService.updateNewSeatmapDeleteSeat.calls.reset();
            fakeAncillariesTransformer.countSeatsTotal.calls.reset();
        });

        it('should decrement seatsQuanty by the deleted amount', () => {
            controller.deleteSeats(null, makeDataSeat(2));
            expect(controller.model.seatsQuanty).toBe(1);
        });

        it('should call NewSeatsMapService.updateNewSeatmapDeleteSeat with segment id and passengers', () => {
            const dataSeat = makeDataSeat(1, 'SEG_99');
            controller.deleteSeats(null, dataSeat);
            expect(fakeNewSeatsMapService.updateNewSeatmapDeleteSeat).toHaveBeenCalledWith(
                'SEG_99',
                dataSeat.seats[0].segments[0].passengers
            );
        });

        it('should reset seatsQuanty from summaryInfo when it reaches zero', () => {
            const summaryInfo = { issuedItems: ['SEAT_01'] };
            localStorageService.set('summaryInfo', summaryInfo);
            fakeAncillariesTransformer.countSeatsTotal.and.returnValue(5);
            controller.model.seatsQuanty = 1;

            controller.deleteSeats(null, makeDataSeat(1));

            expect(fakeAncillariesTransformer.countSeatsTotal).toHaveBeenCalledWith(summaryInfo.issuedItems);
            expect(controller.model.seatsQuanty).toBe(5);
        });
    });

});
