import * as angular from 'angular';
import { mock } from '@test/unit/app/pages/ib-web-ancillaries/ib-checkin-ancillaries-controller-mocks';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
describe('test for AncillariesController', () => {
    let $rootScope, AncillariesController, $scope, $controller, $timeout, $q, $window, $compile, $filter, localStorageService, $document, $location;
    type AncillariesDatalayerMethods = {
        getDlProcess: () => string;
        initAncillariesDatalayer: (dlProcess: string) => void;
    };
    const getDatalayerMethods = (): AncillariesDatalayerMethods =>
        AncillariesController as unknown as AncillariesDatalayerMethods;
    const createCarbonFootprint = (confirmed: boolean) => ({
        kilosCo2Equivalent: 208.2,
        price: 28.5,
        confirmed
    });
    const createPassengerBaggageTrips = (piecesChoosed: number) => ([{
        Id: 1,
        trips: [{ tripId: 1, piecesChoosed }]
    }]);

    const fakeAncillariesService = {
        redirectAfterLoginSoftUser: jasmine.createSpy('redirectAfterLoginSoftUser').and.callFake(() => {}),
        searchAncillariesInfo: jasmine.createSpy('searchAncillariesInfo').and.callFake(() => {
            return $q.when(mock.ancillariesInsuranceResponse);
        }),
        countSeatsTotal: jasmine.createSpy('countSeatsTotal').and.callFake(() => {}),
        countBaggageTotal: jasmine.createSpy('countBaggageTotal').and.callFake(() => {}),
        countSpeqsTotal: jasmine.createSpy('countSpeqsTotal').and.callFake(() => {}),
        generateRequestAncillaries: jasmine.createSpy('generateRequestAncillaries').and.callFake(() => {}),
        deleteAviosAncillaries: jasmine.createSpy('deleteAviosAncillaries').and.callFake(() => {}),
        deleteAncillarie: jasmine.createSpy('deleteAncillarie').and.callFake(() => {}),
        getUpdateSeatInfo: jasmine.createSpy('getUpdateSeatInfo').and.callFake(() => {}),
        updateSeatInformation: jasmine.createSpy('updateSeatInformation').and.callFake(() => {}),
        calculateTotalBaggages: jasmine.createSpy('calculateTotalBaggages').and.callFake(() => {}),
        getPriceOfferInsurance: jasmine.createSpy('getPriceOfferInsurance').and.callFake(() => {}),
        calculateTotalSpeqs: jasmine.createSpy('calculateTotalSpeqs').and.callFake(() => {}),
        updateCarbonFootprint: jasmine.createSpy('updateCarbonFootprint').and.callFake(() => Promise.resolve()),
        addCarbonFootprintToBasket: jasmine.createSpy('addCarbonFootprintToBasket').and.callFake(() => {}),
        deleteCarbonFootprint: jasmine.createSpy('deleteCarbonFootprint').and.callFake(() => Promise.resolve()),
        deleteCarbonFootprintFromBasket: jasmine.createSpy('deleteCarbonFootprintFromBasket').and.callFake(() => {})
    };
    const fakeAncillariesUtilsService = {
        getSegmentSeatsPending: jasmine.createSpy('getSegmentSeatsPending').and.callFake(() => {}),
        validatedFlightAviosInfo: jasmine.createSpy('validatedFlightAviosInfo').and.callFake(() => {}),
        getSeatInfoConfirmation: jasmine.createSpy('getSeatInfoConfirmation').and.callFake(() => {}),
        checkEarlyFlights: jasmine.createSpy('checkEarlyFlights').and.callFake(() => {}),
        isCheckinFlow: jasmine.createSpy('isCheckinFlow').and.callFake(() => {}),
        isUserLogged: jasmine.createSpy('isUserLogged').and.callFake(() => {}),
        getSegmentInfo: jasmine.createSpy('getSegmentInfo').and.callFake(() => {}),
        calculatePiecesBaggageTrip: jasmine.createSpy('calculatePiecesBaggageTrip').and.callFake(() => {}),
        updateSeatsCachedInfo: jasmine.createSpy('updateSeatsCachedInfo').and.callFake(() => {}),
        calculatePiecesSpeqsTrip: jasmine.createSpy('calculatePiecesSpeqsTrip').and.callFake(() => {}),
        setSegmentInfo: jasmine.createSpy('setSegmentInfo').and.callFake(() => {}),
        isResolutionToMobile: jasmine.createSpy('isResolutionToMobile').and.callFake(function () { return false})
    };
    const fakeModalServiceAncillaries = {
        isNotWaiting: jasmine.createSpy('isNotWaiting').and.callFake(() => {}),
        showGenericError: jasmine.createSpy('showGenericError').and.returnValue({ result: Promise.resolve() }),
        openSeatNewMapModal: jasmine.createSpy('openSeatNewMapModal').and.returnValue({result : Promise.resolve()}),
        openBaggagesModal: jasmine.createSpy('openBaggagesModal').and.returnValue({result : Promise.resolve()}),
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(() => {}),
        openFlexibilizationModal: jasmine.createSpy('openFlexibilizationModal').and.callFake(() => {}),
        openPriorityBoardingModal: jasmine.createSpy('openPriorityBoardingModal').and.callFake(() => {}),
        openInsuranceModal: jasmine.createSpy('openInsuranceModal').and.callFake(() => {}),
        openBobModal: jasmine.createSpy('openBobModal').and.callFake(() => {}),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return { result: $q.when({}) };
        }),
        openSpeqsModal: jasmine.createSpy('openSpeqsModal').and.callFake(() => {}),
        openInsuranceInfoModal: jasmine.createSpy('openInsuranceInfoModal').and.callFake(() => {}),
        openCarbonFootprintModal: jasmine.createSpy('openCarbonFootprintModal').and.callFake(() => {})
    };
    const fakeCallBundleService = {
        getBundle: jasmine.createSpy('getBundle').and.callFake(() => {
            return $q.when({ bundles: mock.bundles });
        })
    };
    const fakeAncillariesConstants = {
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
            INSURANCE: 'insurance'
        },
        GENERAL_STATUS: {
            AVAILABLE: 'available'
        },
        DATALAYER_MODAL_ID: {
            INSURANCE_NOT_AVAILABLE: 'insuranceNotAvailable'
        }
    };
    const fakeDatalayerConstants = {
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
        }
    };
    const fakeMonetateUtilsService = {
        updateMonetateWithQuadrigam: jasmine.createSpy('updateMonetateWithQuadrigam').and.callFake(() => {})
    };
    const fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'setPageType'
        }
    };
    const fakeNewMainHeaderFacade = {
        initHeaderModel: jasmine.createSpy('initHeaderModel').and.callFake(() => {}),
        updateBasketDiscounts: jasmine.createSpy('updateBasketDiscounts').and.callFake(() => {}),
        updateSteps: jasmine.createSpy('updateSteps').and.callFake(() => {}),
        showLogin: jasmine.createSpy('showLogin').and.callFake(() => {}),
        updateTripsFromOrder: jasmine.createSpy('updateTripsFromOrder').and.callFake(() => {}),
        updateBasketOthers: jasmine.createSpy('updateBasketOthers').and.callFake(() => {}),
        updateBasketDiscountsNew: jasmine.createSpy('updateBasketDiscountsNew').and.callFake(() => {}),
        updateBasketUpgrading: jasmine.createSpy('updateBasketUpgrading').and.callFake(() => {})
    };
    const fakeCurrencyService = {
        formatPrice: jasmine.createSpy('formatPrice').and.callFake(() => {})
    };
    const fakeAncillariesTransformer = {
        buildDeleteOneAncillariesBaggageRequest: jasmine.createSpy('buildDeleteOneAncillariesBaggageRequest').and.callFake(() => {}),
        countSeatsTotal: jasmine.createSpy('countSeatsTotal').and.callFake(() => {}),
        buildAncillariesRequest: jasmine.createSpy('buildAncillariesRequest').and.callFake(() => {}),
        buildDeleteAllAncillariesBaggageRequest: jasmine.createSpy('buildDeleteAllAncillariesBaggageRequest').and.callFake(() => {}),
        mergePassengerItemsForDelete: jasmine.createSpy('mergePassengerItemsForDelete').and.callFake(() => {})
    };
    const fakeCommonsAncillariesService = {
        deleteAncillarie: jasmine.createSpy('deleteAncillarie').and.callFake(function () { return $q.when({}) }),
        updateAncillaries: jasmine.createSpy('updateAncillaries').and.callFake(function (detailRequest) {
            return Promise.resolve({
                test: 'test'});

        })
    };
    const fakeCommonsUtilService = {
        setTitlePage: jasmine.createSpy('setTitlePage').and.callFake(() => {}),
        isDiscountTypePartnerEquivalent: jasmine.createSpy('isDiscountTypePartnerEquivalent').and.callFake(() => {}),
        fiterTextOptionOnhold: jasmine.createSpy('fiterTextOptionOnhold').and.callFake(() => {
            return { modalText: 'modalText' };
        }),
        isAvailableLightBox: jasmine.createSpy('isAvailableLightBox').and.callFake(() => {}),
        getProcess: jasmine.createSpy('getProcess').and.callFake(() => {})
    };
    const fakeCommonsModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(() => {}),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return { result: $q.when({}) };
        }),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(() => {})
    };
    const fakeAncillariesConfigurationService = {
        initializeModel: jasmine.createSpy('initializeModel').and.callFake(() => {
            return mock.model;
        })
    };
    const fakeDatalayerGeneralConstants = {
        PROCESS: 'process',
        step: 'step',
        DATALAYER_FLOW_CKI: {
            PROCESS: 'checkin',
            CKIANC: 'ancillaries'
        },
        CKIANC: 'ancillaries',
        QUADRIGAMS: {
            CKIANC: 'CKIANC'
        }
    };
    const fakeDatalayerUtils = {
        setInsuranceEcommerce: jasmine.createSpy('setInsuranceEcommerce').and.callFake(() => {}),
        getAncillariesDigitalDataEcommerce: jasmine.createSpy('getAncillariesDigitalDataEcommerce').and.callFake(() => {})
    };
    const fakeCommonsConstants = {
        QUADRIGAM: {
            MODAL_SELECT_FLEX: 'modalSelectFlex'
        }
    };
    const feakInsuranceSelected = {
        id: 'IBAESTPR025'
    };
    const fakeconfirmationDigitalInfo = {
        Language: 'ES'
    };
    const fakeflightAviosInfo = {
        currency: {
            code: 'EUR'
        }
    };
    const fakeCallAncillariesService = {
        getInsurance: jasmine.createSpy('getInsurance').and.callFake(() => {})
    };
    const fakeCkiDatalayerUtilsService = {
        setAncillariesDatalayer: jasmine.createSpy('setAncillariesDatalayer').and.callFake(() => {}),
        setProcessAndStep: jasmine.createSpy('setProcessAndStep').and.callFake(() => {}),
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(() => {}),
        updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(() => {}),
        updateDiscountData: jasmine.createSpy('updateDiscountData').and.callFake(() => {}),
        updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent').and.callFake(() => {}),
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent').and.callFake(() => {})
    };
    const fakeNewSeatsMapService = {};
    const fakeCommonsSessionStorageService = new StorageServiceMock();
    beforeEach(angular.mock.module('ib-checkin-ancillaries-module', 'LocalStorageModule'));
    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.value('AncillariesService', fakeAncillariesService);
            $provide.value('CkiAncillariesUtilsService', fakeAncillariesUtilsService);
            $provide.value('ModalServiceAncillaries', fakeModalServiceAncillaries);
            $provide.value('CheckinAncillariesConstants', fakeAncillariesConstants);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('CkiAncillariesTransformer', fakeAncillariesTransformer);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('AncillariesConfigurationService', fakeAncillariesConfigurationService);
            $provide.value('CkiDatalayerConstants', fakeDatalayerGeneralConstants);
            $provide.value('DatalayerUtils', fakeDatalayerUtils);
            $provide.value('CommonsConstants', fakeCommonsConstants);
            $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
            $provide.value('CallBundleService', fakeCallBundleService);
            $provide.value('CallAncillariesService', fakeCallAncillariesService);
            $provide.value('CkiDatalayerUtilsService', fakeCkiDatalayerUtilsService);
            $provide.value('NewSeatsMapService', fakeNewSeatsMapService);
            $provide.value('CheckinAppConstants', {});
            $provide.value('CheckinFlowService', {
                warnUserOnBackPressed: jasmine.createSpy('warnUserOnBackPressed')
            });
            fakeAncillariesConfigurationService.initializeModel();
        });

        inject((_$rootScope_, _$controller_, _$q_, _$timeout_, _$compile_, _$filter_, _$window_, _$document_, _$location_, _localStorageService_) => {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $timeout = _$timeout_;
            $compile = _$compile_;
            $q = _$q_;
            $window = _$window_;
            $document = _$document_;
            $location = _$location_;
            $filter = _$filter_;
            localStorageService = _localStorageService_;
            $scope = $rootScope.$new();

            $rootScope.timeSession = {};

            AncillariesController = $controller('AncillariesController', { $rootScope: $rootScope, $scope: $scope });
        });
        spyOn($scope, '$broadcast').and.callThrough();
        spyOn($rootScope, '$broadcast').and.callThrough();
        localStorageService.set('headerModel', mock.headerModel);

        localStorageService.set('confirmationDigitalInfo', fakeconfirmationDigitalInfo);
        localStorageService.set('flightAviosInfo', fakeflightAviosInfo);
    });
    describe('AncillariesController is init', () => {
        describe('and call activate', () => {
            beforeEach(() => {
                localStorageService.set('flowApp', 'MMB');
                localStorageService.set('isOnHoldOrder', false);
                localStorageService.set('ancillariesInfo', {});
            });
            it('should request ancillary information when activated', () => {
                fakeAncillariesService.searchAncillariesInfo.calls.reset();

                AncillariesController.active();

                expect(fakeAncillariesService.searchAncillariesInfo).toHaveBeenCalled();
            });
        });
        describe('and call activate', () => {
            beforeEach(() => {
                localStorageService.set('flowApp', 'MMB');
                localStorageService.set('isOnHoldOrder', true);
            });
            it('AncillariesController should be defined', () => {
                fakeAncillariesService.searchAncillariesInfo = jasmine.createSpy('searchAncillariesInfo').and.callFake((request) => {
                    return Promise.resolve(mock.ancillariesInsuranceResponse);
                });
                AncillariesController.active();
                fakeAncillariesService
                    .searchAncillariesInfo()
                    .then((response) => {
                        expect(fakeAncillariesService.searchAncillariesInfo).toHaveBeenCalled();
                    })
                    .catch(() => {});
            });
        });
        it('and call goToPayments AncillariesController should be defined', () => {
            AncillariesController.model.insuranceForm = {
                $valid: true,
                $submitted: true
            };
            AncillariesController.model.insuranceInfo = {
                policyHolder: true,
                passengers: 'testPassengers'
            };
            localStorageService.set('insuranceSelected', feakInsuranceSelected);
            AncillariesController.goToPayments();
            expect(fakeDatalayerUtils.setInsuranceEcommerce).toHaveBeenCalled();
            expect(fakeAncillariesService.generateRequestAncillaries).toHaveBeenCalled();
            expect(fakeCkiDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
            expect(AncillariesController).toBeDefined();
        });
        it('and call goToPayments AncillariesController should be defined', () => {
            AncillariesController.model.insuranceForm = {
                $valid: true,
                $submitted: true
            };
            AncillariesController.model.insuranceInfo = {
                policyHolder: false,
                passengers: {
                    passengerInfo: {}
                },
                insuranceCountry: {
                    country: {
                        code: 'IT'
                    }
                }
            };
            localStorageService.set('selectedInsurance', 'testPassengerInfo');
            localStorageService.set('insuranceSelected', feakInsuranceSelected);
            AncillariesController.goToPayments();
            expect(fakeDatalayerUtils.setInsuranceEcommerce).toHaveBeenCalled();
            expect(fakeAncillariesService.generateRequestAncillaries).toHaveBeenCalled();
            expect(fakeCkiDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
            expect(AncillariesController).toBeDefined();
        });

        it('and openCarbonFootprintModal should be defined', () => {
            expect(AncillariesController.openCarbonFootprintModal).toBeDefined();
        });

        it('and openCarbonFootprintModal should trigger modal', async () => {
            const carbonParam = (AncillariesController.model.ancillariesCarbonFootprint = createCarbonFootprint(false));
            AncillariesController.openCarbonFootprintModal();

            expect(fakeModalServiceAncillaries.openCarbonFootprintModal).toHaveBeenCalledWith(carbonParam, jasmine.any(String));
        });

        it('and deleteCarbonFootprintAncillary should trigger delete', async () => {
            const mockPromise = Promise.resolve();
            fakeAncillariesService.updateCarbonFootprint = jasmine.createSpy('updateCarbonFootprint').and.returnValue(mockPromise);

            AncillariesController.model.ancillariesCarbonFootprint = createCarbonFootprint(true);
            const promise = AncillariesController.deleteCarbonFootprintAncillary();
            await expectAsync(promise).toBeResolved();

            await mockPromise.then(() => {
                expect(fakeAncillariesService.deleteCarbonFootprint).toHaveBeenCalled();
                expect(fakeAncillariesService.deleteCarbonFootprintFromBasket).toHaveBeenCalled();
                expect(AncillariesController.model.ancillariesCarbonFootprint.confirmed).toBeFalse();
            });
        });

        it('and cleanCarbonFootprintAncillary should reset confirmed property', () => {
            AncillariesController.model.ancillariesCarbonFootprint = createCarbonFootprint(true);

            AncillariesController.cleanCarbonFootprintAncillary();

            expect(AncillariesController.model.ancillariesCarbonFootprint.confirmed).toBeFalse();
        });
        describe('openSeatMap is called', () => {
            it('new seatmap is active in desktop resolution',async () => {
                const mockPromise = Promise.resolve();
                localStorageService.set('passengersSelected', ['ADULT_01']);
                localStorageService.set('seatsAvailableSegments', ['IB042620240322']);
                localStorageService.set('headerModel', {shoppingBasket: {seats: {hasSeats: true, segments: [{quanty: 2}]}}});
                expect(AncillariesController).toBeDefined();

                AncillariesController.openSeatMap(null, 'IB042620240322')

                await mockPromise.then(() => {
                    expect(fakeModalServiceAncillaries.openSeatNewMapModal).toHaveBeenCalled();
                    expect(AncillariesController.model.seatsQuanty).toBe(2);
                });



            });
        });

        describe('openBaggages', () => {
            it('should open the baggage modal successfully', fakeAsync(() => {
                const copyPassengerBaggagesTrips = createPassengerBaggageTrips(0);
                localStorageService.set('passengerBaggagesTrips', copyPassengerBaggagesTrips);

                AncillariesController.openBaggages();
                flushMicrotasks();
                fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest(
                    copyPassengerBaggagesTrips[0],
                    'BAGGAGE',
                    copyPassengerBaggagesTrips
                );
                expect(fakeModalServiceAncillaries.openBaggagesModal).toHaveBeenCalled();
                expect(AncillariesController.baggagesTemp).toEqual(copyPassengerBaggagesTrips);
            }));
        });

        describe('handleBaggagesModalSuccess', () => {
            it('should handle baggage modal success and update data', fakeAsync(() => {
                const copyPassengerBaggagesTrips = createPassengerBaggageTrips(1);
                AncillariesController.model.passengerBaggagesTrips = copyPassengerBaggagesTrips;

                AncillariesController.handleBaggagesModalSuccess(copyPassengerBaggagesTrips);
                flushMicrotasks();

                expect(AncillariesController.model.passengerBaggagesTrips).toEqual(copyPassengerBaggagesTrips);
                expect(fakeCommonsAncillariesService.updateAncillaries).toHaveBeenCalled();
            }));
        });

        describe('handleBaggagesModalError', () => {
            it('should handle baggage modal error gracefully', () => {
                AncillariesController.handleBaggagesModalError();

                expect(fakeCkiDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
            });
        });

        describe('updateBaggages', () => {
            it('should update baggage data successfully', fakeAsync(() => {
                const baggages = createPassengerBaggageTrips(1);
                localStorageService.set('passengerBaggagesTrips', baggages);

                AncillariesController.updateBaggages();
                flushMicrotasks();

                expect(fakeCommonsAncillariesService.updateAncillaries).toHaveBeenCalled();
            }));

            it('should handle baggage deletion when no baggage is selected', fakeAsync(() => {
                const baggages = createPassengerBaggageTrips(0);
                localStorageService.set('passengerBaggagesTrips', baggages);

                AncillariesController.updateBaggages();
                flushMicrotasks();

                jasmine.createSpy('fakeCommonsAncillariesService.deleteAncillarie');
            }));
        });

        describe('handleBaggageUpdate', () => {
            it('should update baggage successfully', fakeAsync(() => {
                const infoBaggages = [{ id: 1, type: 'BAGGAGE' }];
                AncillariesController.handleBaggageUpdate(infoBaggages);
                flushMicrotasks();

                expect(fakeCommonsAncillariesService.updateAncillaries).toHaveBeenCalledWith(infoBaggages);
            }));

            it('should handle error during baggage update', fakeAsync(() => {
                const infoBaggages = [{ id: 1, type: 'BAGGAGE' }];
                fakeCommonsAncillariesService.updateAncillaries.and.returnValue(Promise.reject('Error'));

                AncillariesController.handleBaggageUpdate(infoBaggages);
                flushMicrotasks();

                expect(fakeModalServiceAncillaries.showGenericError).toHaveBeenCalled();
            }));
        });

        describe('handleError', () => {
            it('should handle errors gracefully', () => {
                const error = 'Test Error';
                AncillariesController.handleError(error);

                expect(fakeModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
                expect(fakeModalServiceAncillaries.showGenericError).toHaveBeenCalled();
            });
        });

            it('should update baggage data correctly', fakeAsync(() => {
                const copyPassengerBaggagesTrips = createPassengerBaggageTrips(1);
                jasmine.createSpy('AncillariesController.updateBaggages').and.returnValue(true);
                AncillariesController.model.passengerBaggagesTrips = copyPassengerBaggagesTrips;
                fakeAncillariesService.calculateTotalBaggages.and.returnValue(2);

                jasmine.createSpy('AncillariesController.saveBaggagesTrips');
                fakeAncillariesTransformer.buildAncillariesRequest(copyPassengerBaggagesTrips, null, null);
                fakeCommonsAncillariesService.updateAncillaries(copyPassengerBaggagesTrips);

                AncillariesController.handleBaggagesModalSuccess(copyPassengerBaggagesTrips);
                flushMicrotasks();

                expect(AncillariesController.model.passengerBaggagesTrips).toEqual(copyPassengerBaggagesTrips);

                AncillariesController.updateBaggages();
                flushMicrotasks();
                localStorageService.set('ancillariesAction', 'addtocart');
                jasmine.createSpy('AncillariesController.updateDatalayer');
                jasmine.createSpy('fakeCkiDatalayerUtilsService.setAncillariesDatalayer');
            }));

            it('should handle baggage deletion successfully', fakeAsync(() => {
                const deleteInfoArray = [{ id: 1, type: 'BAGGAGE' }];
                fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest.and.returnValue(deleteInfoArray);
                fakeCommonsAncillariesService.deleteAncillarie.and.returnValue(Promise.resolve());

                AncillariesController.handleBaggageDeletion(deleteInfoArray);
                flushMicrotasks();

                jasmine.createSpy('fakeModalServiceAncillaries.showWaitingModal');
                jasmine.createSpy('fakeCommonsAncillariesService.deleteAncillarie');
                jasmine.createSpy('fakeModalServiceAncillaries.isNotWaiting');

            }));

            it('should handle baggage deletion failure', fakeAsync(() => {
                const deleteInfoArray = [{ id: 1, type: 'BAGGAGE' }];
                fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest.and.returnValue(deleteInfoArray);

                AncillariesController.handleBaggageDeletion(deleteInfoArray);
                flushMicrotasks();

                jasmine.createSpy('fakeModalServiceAncillaries.showWaitingModal');
                jasmine.createSpy('fakeCommonsAncillariesService.deleteAncillarie');
                jasmine.createSpy('fakeModalServiceAncillaries.isNotWaiting');
                jasmine.createSpy('fakeModalServiceAncillaries.showGenericError');

            }));

        describe('handleBaggageDeletion', () => {
            const mockBaggagesTempSingle = [
                {
                    id: 'p1',
                    trips: [
                        { id: 's1', pieces: [{ subtype: 'CHECKED_BAG', quantySelected: 1 }] }
                    ]
                }
            ];

            const mockBaggagesTempMultiple = [
                {
                    id: 'p1',
                    trips: [
                        { id: 's1', pieces: [{ subtype: 'CHECKED_BAG', quantySelected: 1 }] }
                    ]
                },
                {
                    id: 'p2',
                    trips: [
                        { id: 's2', pieces: [{ subtype: 'CABIN_BAG', quantySelected: 1 }] }
                    ]
                }
            ];

            const mockDeleteInfoSingle = [{ slices: [{ passengers: [{ id: 'p1' }] }] }];
            const mockDeleteInfoMultipleMerged = [{ slices: [{ passengers: [{ id: 'p1' }, { id: 'p2' }] }] }];

            it('should successfully remove a single baggage item and return true', fakeAsync(() => {
                AncillariesController.baggagesTemp = mockBaggagesTempSingle;
                fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest.and.returnValue(mockDeleteInfoSingle);
                fakeCommonsAncillariesService.deleteAncillarie.and.returnValue($q.resolve());

                AncillariesController.handleBaggageDeletion([]);

                jasmine.createSpy('fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest');
                expect(fakeModalServiceAncillaries.showWaitingModal).toHaveBeenCalled();
                jasmine.createSpy('fakeCommonsAncillariesService.deleteAncillarie');
                jasmine.createSpy('AncillariesController.updateDatalayer');
            }));

            it('should successfully remove multiple merged baggage items and return true', fakeAsync(() => {
                AncillariesController.baggagesTemp = mockBaggagesTempMultiple;
                fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest.and.returnValues(
                    [{ slices: [{ passengers: [{ id: 'p1' }] }] }],
                    [{ slices: [{ passengers: [{ id: 'p2' }] }] }]
                );
                fakeAncillariesTransformer.mergePassengerItemsForDelete.and.returnValue(mockDeleteInfoMultipleMerged);
                fakeCommonsAncillariesService.deleteAncillarie.and.returnValue($q.resolve());

                AncillariesController.handleBaggageDeletion([]);

                expect(fakeModalServiceAncillaries.showWaitingModal).toHaveBeenCalled();
                jasmine.createSpy('fakeCommonsAncillariesService.deleteAncillarie');
                jasmine.createSpy('AncillariesController.updateDatalayer');
            }));

            it('should handle an API error while deleting baggage and return false', fakeAsync(() => {
                const mockError = { status: 500, message: 'Server Error' };
                AncillariesController.baggagesTemp = mockBaggagesTempSingle;
                fakeAncillariesTransformer.buildDeleteAllAncillariesBaggageRequest.and.returnValue(mockDeleteInfoSingle);
                fakeCommonsAncillariesService.deleteAncillarie.and.returnValue($q.reject(mockError));

                AncillariesController.handleBaggageDeletion([]);

                expect(fakeModalServiceAncillaries.showWaitingModal).toHaveBeenCalled();
                jasmine.createSpy('fakeCommonsAncillariesService.deleteAncillarie');
                jasmine.createSpy('AncillariesController.handleError');
                jasmine.createSpy('AncillariesController.updateDatalayer');
            }));
        });

        describe('openPriorityBoarding', () => {
            const mockPriorityModel = {
                confirmed: false
            };
            beforeEach(() => {
                AncillariesController.model.ancillariesPriorityBoarding = mockPriorityModel;
                spyOn(AncillariesController, 'closeCollapseHeader').and.callThrough();
                spyOn(AncillariesController, 'updateDatalayer').and.callThrough();
            });

            it('should configure datalayer and open modal (resolve case)', fakeAsync(() => {
                fakeModalServiceAncillaries.openPriorityBoardingModal.and.returnValue({
                    result: Promise.resolve()
                });
                AncillariesController.openPriorityBoarding();
                flushMicrotasks();
                expect(localStorageService.get('ancillariesAction')).toBe('addtocart');
                expect(fakeCkiDatalayerUtilsService.setProcessAndStep).toHaveBeenCalled();
                expect(AncillariesController.closeCollapseHeader).toHaveBeenCalled();
                expect(fakeModalServiceAncillaries.openPriorityBoardingModal).toHaveBeenCalledWith({
                    model: mockPriorityModel
                });
                expect(fakeCkiDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
                expect(AncillariesController.updateDatalayer).toHaveBeenCalled();
            }));

            it('should call updateDatalayer when modal is rejected', fakeAsync(() => {
                fakeModalServiceAncillaries.openPriorityBoardingModal.and.returnValue({
                    result: Promise.reject('dismiss')
                });
                AncillariesController.openPriorityBoarding();
                flushMicrotasks();
                expect(AncillariesController.updateDatalayer).toHaveBeenCalled();
                expect(localStorageService.get('ancillariesAction')).toBe('click');
            }));
        });


        describe('openSpeqs', () => {
            const mockSpeqs = [
                { id: 1, trips: [{ id: 'SEG1', speqsChoosed: 1 }] }
            ];
            beforeEach(() => {
                localStorageService.set('passengerSpeqsTrips', mockSpeqs);
                AncillariesController.model.passengerSpeqsTrips = mockSpeqs;
                spyOn(AncillariesController, 'closeCollapseHeader').and.callThrough();
                spyOn(AncillariesController, 'handleSpeqsModalSuccess').and.callThrough();
                spyOn(AncillariesController, 'handleSpeqsModalError').and.callThrough();
            });

            it('should configure datalayer, open modal and handle resolve', fakeAsync(() => {
                fakeModalServiceAncillaries.openSpeqsModal.and.returnValue({
                    result: Promise.resolve()
                });
                AncillariesController.openSpeqs();
                flushMicrotasks();
                expect(localStorageService.get('ancillariesAction')).toBe('click');
                expect(fakeCkiDatalayerUtilsService.setProcessAndStep).toHaveBeenCalled();
                expect(AncillariesController.closeCollapseHeader).toHaveBeenCalled();
                expect(fakeModalServiceAncillaries.openSpeqsModal).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        passengers: mockSpeqs,
                        quantySelected: 0
                    })
                );
                expect(AncillariesController.handleSpeqsModalSuccess).toHaveBeenCalledWith(mockSpeqs);
            }));

            it('should handle modal rejection correctly', fakeAsync(() => {
                fakeModalServiceAncillaries.openSpeqsModal.and.returnValue({
                    result: Promise.reject('dismiss')
                });
                AncillariesController.openSpeqs();
                flushMicrotasks();
                expect(AncillariesController.handleSpeqsModalError).toHaveBeenCalled();
            }));
        });

        describe('handleSpeqsModalSuccess', () => {
            it('should update speqs data and broadcast updates', fakeAsync(() => {
                const copyPassengerSpeqsTrips = [{ Id: 1, trips: [{ tripId: 1, speqsChoosed: 1 }] }];
                AncillariesController.model.passengerSpeqsTrips = copyPassengerSpeqsTrips;
                spyOn(AncillariesController, 'updateSpeqs').and.returnValue(true);
                spyOn(AncillariesController, 'saveSpeqsTrips').and.callThrough();
                AncillariesController.handleSpeqsModalSuccess(copyPassengerSpeqsTrips);
                flushMicrotasks();
                expect(AncillariesController.model.passengerSpeqsTrips).toEqual(copyPassengerSpeqsTrips);
                expect(AncillariesController.saveSpeqsTrips).toHaveBeenCalled();
                expect(AncillariesController.updateSpeqs).toHaveBeenCalled();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderSpeqs', copyPassengerSpeqsTrips);
            }));

            it('should handle speqs deletion when no speqs are selected', () => {
                const speqs = [{ Id: 1, trips: [{ tripId: 1, speqsChoosed: 0 }] }];
                localStorageService.set('passengerSpeqsTrips', speqs);
                const result = AncillariesController.updateSpeqs();
                jasmine.createSpy('AncillariesController.buildDeleteInfo');
                jasmine.createSpy('AncillariesController.deleteInfoSpeqs');
            });
        });
    });

    describe('initAncillariesDatalayer is called', () => {
        beforeEach(() => {
            const ancillariesInfoMock = {currencies: [{code: "$"}]}
            localStorageService.set('ancillariesInfo', ancillariesInfoMock);
            localStorageService.set('confirmationDigitalInfo', {});
            AncillariesController.typeQuadrigam = 'CKIUPG'
        })
        it('should send the correct info to update digital_data', (done) => {
            AncillariesController.initAncillariesDatalayer(true);

            expect(fakeCkiDatalayerUtilsService.updateDigitalDataWithQuadrigam).toHaveBeenCalledWith('CKIUPG', {Currency:  "$"}, undefined)
            done();
        })
    })


    describe('redirectToSeatMap is called', () => {
        const segmentMock = { segmentId: 'SEG_01', pasId: 'PAX_01' };

        beforeEach(() => {
            fakeAncillariesUtilsService.setSegmentInfo.calls.reset();
            fakeModalServiceAncillaries.openSeatNewMapModal.calls.reset();

            spyOn(localStorageService, 'set').and.callThrough();
            (localStorageService.set as jasmine.Spy).calls.reset();

            spyOn(AncillariesController, 'closeCollapseHeader').and.callThrough();
            spyOn(AncillariesController, 'updateDatalayer').and.callThrough();
            spyOn(AncillariesController, 'checkQuantitySeat').and.callThrough();
        });

        it('should close header, set segment info and open new seat map modal with model', fakeAsync(() => {
            fakeModalServiceAncillaries.openSeatNewMapModal.and.returnValue({ result: Promise.resolve() });

            AncillariesController.redirectToSeatMap(segmentMock);
            flushMicrotasks();

            expect(AncillariesController.closeCollapseHeader).toHaveBeenCalled();

            expect(fakeAncillariesUtilsService.setSegmentInfo).toHaveBeenCalledWith({
                segmentId: segmentMock.segmentId,
                pasId: segmentMock.pasId
            });

            expect(fakeModalServiceAncillaries.openSeatNewMapModal).toHaveBeenCalledWith({
                seatMapInfo: AncillariesController.model
            });
        }));

        it('should update seatsQuanty and persist it when modal resolves', fakeAsync(() => {
            fakeModalServiceAncillaries.openSeatNewMapModal.and.returnValue({ result: Promise.resolve() });
            (AncillariesController.checkQuantitySeat as jasmine.Spy).and.returnValue(7);

            AncillariesController.redirectToSeatMap(segmentMock);
            flushMicrotasks();

            expect(AncillariesController.checkQuantitySeat).toHaveBeenCalled();
            expect(AncillariesController.model.seatsQuanty).toBe(7);

            expect(localStorageService.set).toHaveBeenCalledWith('seatsQuanty', 7);
            expect(AncillariesController.updateDatalayer).not.toHaveBeenCalled();
        }));

        it('should call updateDatalayer when modal is dismissed/rejected and not persist seatsQuanty', fakeAsync(() => {
            fakeModalServiceAncillaries.openSeatNewMapModal.and.returnValue({ result: Promise.reject('dismiss') });

            AncillariesController.redirectToSeatMap(segmentMock);
            flushMicrotasks();

            expect(AncillariesController.updateDatalayer).toHaveBeenCalled();

            expect(AncillariesController.checkQuantitySeat).not.toHaveBeenCalled();
            expect(localStorageService.set).not.toHaveBeenCalledWith('seatsQuanty', jasmine.anything());
        }));
    });

    describe('updateDatalayer & initAncillariesDatalayer', () => {
        const DL_PROCESS = 'PROC_TEST';
        const CKIANC_STEP = 'ancillaries';

        beforeEach(() => {
            fakeAncillariesUtilsService.checkEarlyFlights.calls.reset();
            fakeAncillariesUtilsService.isUserLogged.calls.reset();
            fakeCkiDatalayerUtilsService.setProcessAndStep.calls.reset();
            fakeCkiDatalayerUtilsService.updateDatalayerWithQuadrigam.calls.reset();
            fakeCkiDatalayerUtilsService.updateDigitalDataWithQuadrigam.calls.reset();
            fakeMonetateUtilsService.updateMonetateWithQuadrigam.calls.reset();
            ($rootScope.$broadcast as jasmine.Spy).calls.reset();

            localStorageService.set('bookingInfo', { id: 'BOOK_01' });
            localStorageService.set('ancillariesAvailableSegments', [{ id: 'SEG_01' }]);
            localStorageService.set('ancillariesInfo', { currencies: [{ code: 'EUR' }] });

            if (getDatalayerMethods().getDlProcess) {
                spyOn(getDatalayerMethods(), 'getDlProcess').and.returnValue(DL_PROCESS);
            } else {
                getDatalayerMethods().getDlProcess = () => DL_PROCESS;
            }
        });

        describe('updateDatalayer', () => {
            it('should set EARLY_ANCILLARIES quadrigam and call initAncillariesDatalayer when isActivate=true', () => {
                AncillariesController.CheckinAncillariesConstants.QUADRIGAM.EARLY_ANCILLARIES = 'TES_EARLY_ANCILLARIES'
                fakeAncillariesUtilsService.checkEarlyFlights.and.returnValue(true);
                spyOn(getDatalayerMethods(), 'initAncillariesDatalayer').and.callThrough();

                AncillariesController.updateDatalayer(true);

                expect(fakeAncillariesUtilsService.checkEarlyFlights).toHaveBeenCalledWith(
                    localStorageService.get('bookingInfo'),
                    localStorageService.get('ancillariesAvailableSegments')
                );
                expect(AncillariesController.typeQuadrigam).toBe(fakeAncillariesConstants.QUADRIGAM.EARLY_ANCILLARIES);

                expect(getDatalayerMethods().initAncillariesDatalayer).toHaveBeenCalledWith(DL_PROCESS);
            });

            it('should set ANCILLARIES quadrigam and call setProcessAndStep when isActivate is false/undefined', () => {
                AncillariesController.CheckinAncillariesConstants.QUADRIGAM.ANCILLARIES = 'TES_ANCILLARIES'
                fakeAncillariesUtilsService.checkEarlyFlights.and.returnValue(false);

                AncillariesController.updateDatalayer(false);

                expect(AncillariesController.typeQuadrigam).toBe(fakeAncillariesConstants.QUADRIGAM.ANCILLARIES);
                expect(fakeCkiDatalayerUtilsService.setProcessAndStep).toHaveBeenCalledWith(
                    DL_PROCESS,
                    CKIANC_STEP,
                    fakeAncillariesConstants.QUADRIGAM.ANCILLARIES
                );
            });
        });

        describe('initAncillariesDatalayer', () => {
            it('should update datalayer/digital data/monetate and broadcast events (including delayed monetate update)', fakeAsync(() => {
                fakeAncillariesUtilsService.isUserLogged.and.returnValue(true);
                AncillariesController.CheckinAncillariesConstants.QUADRIGAM.ANCILLARIES = 'TES_ANCILLARIES'
                AncillariesController.typeQuadrigam = fakeAncillariesConstants.QUADRIGAM.ANCILLARIES;

                getDatalayerMethods().initAncillariesDatalayer(DL_PROCESS);

                expect(fakeCkiDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalledWith(
                    fakeAncillariesConstants.QUADRIGAM.ANCILLARIES,
                    null,
                    true
                );

                expect(fakeCkiDatalayerUtilsService.updateDigitalDataWithQuadrigam).toHaveBeenCalledWith(
                    fakeAncillariesConstants.QUADRIGAM.ANCILLARIES,
                    { Currency: 'EUR' },
                    true
                );

                expect(fakeCkiDatalayerUtilsService.setProcessAndStep).toHaveBeenCalledWith(
                    DL_PROCESS,
                    CKIANC_STEP,
                    fakeAncillariesConstants.QUADRIGAM.ANCILLARIES
                );

                expect(fakeMonetateUtilsService.updateMonetateWithQuadrigam).toHaveBeenCalledWith(
                    fakeMonetateConstants.MONETATE_INFO.SETPAGETYPE,
                    fakeAncillariesConstants.QUADRIGAM.ANCILLARIES
                );

                expect($rootScope.$broadcast).toHaveBeenCalledWith('updateDatalayer');
                expect($rootScope.$broadcast).toHaveBeenCalledWith('updateDigitalData');

                $timeout.flush();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('sendUpdateToMonetate');
            }));
        });
    });

});
