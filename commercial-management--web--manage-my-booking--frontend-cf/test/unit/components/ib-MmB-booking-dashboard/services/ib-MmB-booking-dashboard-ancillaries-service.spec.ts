import angular from "angular";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";

describe('ibMmbBookingDashboardAncillariesService test ', () => {

    let BookingDashboardAncillariesService, $rootScope, $scope, localStorageGetSpy, $timeout, $cookies, $q, localStorageService;

    let fakeNewMainHeaderFacade = {
        'initHeader': jasmine.createSpy('initHeader').and.callFake(() => {
            return {
                onLogin: () => { },
                onError: () => { }
            }
        }),
        'updateBasketDiscounts': jasmine.createSpy('initHeader').and.callFake(() => { }),
        'updateBasketPriority': jasmine.createSpy(),
        'updateHeader': jasmine.createSpy('updateHeader').and.callFake(() => { }),
        'updatePendingPaymentItems': jasmine.createSpy(),
    };

    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
        ANCILLARIES_TYPES: {
            BAGGAGE: 'BAGGAGE',
            SEAT: 'SEAT',
            INSURANCE: 'INSURANCE',
            VEHICLE_RENTAL: 'VEHICLE_RENTAL',
            UPGRADING: 'UPGRADING',
            SPEQS: 'SPECIAL_EQUIPMENT',
            SPECIAL_MEALS: 'SPECIAL_MEALS',
            UPGRADING_BID: 'UPGRADING_BID',
            UPGRADING_AVIOS: 'UPGRADING_AVIOS',
            UPGRADING_AVIOS_BID: 'UPGRADING_AVIOS_BID',
            FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
            PREORDER: 'PREORDER',
            PRIORITY_BOARDING: 'PRIORITY_BOARDING',
            INTEGRATED_BOB: 'INTEGRATED_BOB',
            BOB: 'BOB'
        },
        PAGES_URL: {
            SEARCH: 'test',
            PAYMENTS: 'test'
        },
        TITLES_APP: {
            MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC'
        },
        QUADRIGAM: {
            MANAGE_RESERV: 'test',
            MODAL_SELECT_UPGRADING: true,
            EARLY_ANCILLARIES: 'test',
            ANCILLARIES: 'ANCILLARIES',
            CUSTOMIZE_YOUR_TRAVEL: 'test'
        },
        PASSENGER_TYPE: {
            INFANT: 'INFANT'
        },
        SPECIAL_NEEDS: {
            SVAN_STATUS: {
                HK: { code: 'HK', description: 'SPECIAL_NEED_STATUS_HK' },
                KK: { code: 'KK', description: 'SPECIAL_NEED_STATUS_HK' },
                UC: { code: 'UC', description: 'SPECIAL_NEED_STATUS_XX' },
                UN: { code: 'UN', description: 'SPECIAL_NEED_STATUS_XX' },
                DEFAULT: { code: '', description: 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS' }
            },
            CODE: {
                BLND: 'BLND',
                DEAF: 'DEAF',
                SVAN: 'SVAN',
                DPNA: 'DPNA',
                WHEEL_CHAIR: ['WCHR', 'WCHS', 'WCHC']
            },
            TEXT: {
                GUIDE_DOG: 'GUIDE DOG',
                NOT_GUIDE_DOG: 'NOT GUIDE DOG'
            }
        },
        PAYMENT_STATUS: {
            PENDING_PAYMENT: 'PENDING_PAYMENT'
        },
        SECURITY_AND_TRAVEL_DOCUMENTS_MANDATORY: {
            DNI: ['DNI'],
            PSPT: ['PASSPORT']
        },
        DISRUPTION_SEATS: {
            CANCELLED_SEATS: 'CANCELLED_SEATS',
            PROVIDER_IB: 'IB'
        }
    };
    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(() => { }),
        'updateLoggedDatalayer': jasmine.createSpy('updateLoggedDatalayer').and.callFake(() => { }),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(() => { }),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy(),
        'updateDatalayerViewEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerForAncillaries': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy(),
        'updateDigitalDataForAncillaries': jasmine.createSpy(),
        'setAncillariesDatalayer': jasmine.createSpy(),
        'addDigitalDataInfo': jasmine.createSpy()
    };

    let fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'setPageType',
        },
    };

    let fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(() => {
            return true;
        }),
        'getInfoHeader': jasmine.createSpy('getInfoHeader').and.callFake(() => {
            return true;
        }),
        'getURLFirstParameterByName': jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
            return {};
        }),
        'updateDinamicPricingDatalayer': jasmine.createSpy('updateDinamicPricingDatalayer').and.callFake(() => {
            return {};
        }),
        'generateAncillariesHeaderInfo': jasmine.createSpy('generateAncillariesHeaderInfo').and.callFake(() => {
            return {
                seats: [{
                    segments: [{
                        quanty: 2
                    }],
                    hasSeats: true,
                    total: {
                        total: 2
                    }
                }]
            };
        }),
        'transformSisterCitiesModel': jasmine.createSpy('transformSisterCitiesModel').and.callFake(() => {
            return {};
        }),
        'closeBasketHeader': jasmine.createSpy('closeBasketHeader').and.callFake(() => {
            return {};
        }),
        'refreshToken': jasmine.createSpy('refreshToken').and.callFake(() => {
            return {};
        }),
        'newTransformSisterCitiesModel': jasmine.createSpy('newTransformSisterCitiesModel').and.callFake(() => {
            return {};
        }),
        'generateFlexAndDisruptedFlightsDatalayerInfo': jasmine.createSpy('generateFlexAndDisruptedFlightsDatalayerInfo').and.callFake(() => {
            return {};
        }),
        'getParameterByName': jasmine.createSpy('getParameterByName').and.callFake(() => {
            return {};
        }),
    };

    let fakeMmBModalService = {
        'finishWaiting': jasmine.createSpy('finishWaiting').and.callFake(() => { }),
        'showFlightReminderModal': jasmine.createSpy('showFlightReminderModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showGenericError': jasmine.createSpy('showGenericError').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showWaitingModal': jasmine.createSpy('showWaitingModal').and.callFake(() => { }),
        'closeAllCurrentModals': jasmine.createSpy('closeAllCurrentModals').and.callFake(() => { }),
        'callApisService': jasmine.createSpy('callApisService').and.callFake(() => { }),
        'showVoluntaryChangeModal': jasmine.createSpy('showVoluntaryChangeModal').and.callFake(() => { }),
        'showGenericInfoModal': jasmine.createSpy('showGenericInfoModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showPassengerModal': jasmine.createSpy('showPassengerModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        })
    };
    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy('setTitlePage').and.callFake(() => {
            return 'TITULO'
        }),
        'getUserTypeByToken': jasmine.createSpy('getUserTypeByToken').and.callFake(() => {
            return 'test'
        }),
    };
    let fakeBookingDashboardModel = require('@test/mocks/storage/booking-dashboard-model-mock.json');
    fakeBookingDashboardModel.initializeModel = () => { };

    let fakeAncillariesTransformer = {
        'buildAncillariesRequest': jasmine.createSpy('buildAncillariesRequest').and.callFake(() => {
            return {};
        }),
        'buildDeleteAllAncillariesBaggageRequest': jasmine.createSpy('buildAncillariesRequest').and.callFake(() => {
            return [{ test: 'test' }];
        }),
        'mergePassengerItemsForDelete': jasmine.createSpy('buildAncillariesRequest').and.callFake(() => {
            return {};
        }),
    };
    let fakeNewSeatsMapService = {
        'setSlicesSeatmapInfo': jasmine.createSpy('setSlicesSeatmapInfo').and.callFake(() => {
            return {};
        }),
        'updateNewSeatmapDeleteSeat': jasmine.createSpy('updateNewSeatmapDeleteSeat').and.callFake(() => {
            return {};
        }),
    };

    let fakeBookingDashboardService = {
        'model': {ancillariesInfo: {}},
        'initializeDashboard': jasmine.createSpy(),
        'updateDataContactInfo': jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'updatePassengerSpecialNeeds': jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'updateApisInfo': jasmine.createSpy('updateApisInfo').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'updateAncillariesInfo': jasmine.createSpy('updateAncillariesInfo').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'updateAncillarieSummary': jasmine.createSpy('updateAncillarieSummary').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'recoverDashboardDataAfterLogin': jasmine.createSpy('recoverDashboardDataAfterLogin').and.callFake(() => {
            return {
                model: {
                    ancillariesInfo: {
                        bidsUpgradingInfo: {
                            aviosBidAvailable: false
                        }
                    }
                }
            };
        }),
        'callApisService': jasmine.createSpy('callApisService').and.callFake(() => { }),
        'getContactData': jasmine.createSpy('getContactData').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({ email: 'otro@test.com' });
            return deferred.promise;
        }),
        'updateContactDetails': jasmine.createSpy('updateContactDetails').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        deleteAllSeats: jasmine.createSpy(),
        getTravelPreferences: jasmine.createSpy('getTravelPreferences').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        updateTravelPreferences: jasmine.createSpy('updateTravelPreferences').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        getPersonalData: jasmine.createSpy('getPersonalData').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({ gender: 'test' });
            return deferred.promise;
        }),
        updatePersonalData: jasmine.createSpy('updatePersonalData').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({ gender: 'other' });
            return deferred.promise;
        }),
    };

    let fakeMmBAncillariesUtilsService = {
        setSegmentInfo: jasmine.createSpy(),
        getSeatInfoConfirmation: jasmine.createSpy(),
        removeSeatInfoConfirmation: jasmine.createSpy(),
        calculatePiecesSpeqsTrip: jasmine.createSpy(),
        calculatePiecesBaggageTrip: jasmine.createSpy(),
        updateSegmentSeatCachedInfo: jasmine.createSpy(),
        isResolutionToMobile: jasmine.createSpy(),
        checkEarlyFlights: jasmine.createSpy(),
        checkFailedPendingPayments: jasmine.createSpy('checkFailedPendingPayments').and.callFake(() => {
            return {};
        })
    };
    let fakeAncillariesService = {
        'calculateTotalBaggages': jasmine.createSpy('calculateTotalBaggages').and.callFake(() => {
            return {};
        }),
        'deleteCarbonFootprint': jasmine.createSpy('deleteCarbonFootprint').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'deleteCarbonFootprintFromBasket': jasmine.createSpy('deleteCarbonFootprintFromBasket').and.callFake(() => { }),
        'deleteAviosAncillaries': jasmine.createSpy('deleteAviosAncillaries').and.callFake(() => { }),
        'countSpeqsTotal': jasmine.createSpy('countSpeqsTotal').and.callFake(() => { }),
        'countBaggageTotal': jasmine.createSpy('countBaggageTotal').and.callFake(() => { }),
        'countSeatsTotal': jasmine.createSpy('countSeatsTotal').and.callFake(() => {
            return 0;
        }),
        'getUpdateSeatInfo': jasmine.createSpy('getUpdateSeatInfo').and.callFake(() => { }),
        'getPriceOfferInsurance': jasmine.createSpy('getPriceOfferInsurance').and.callFake(() => { return { currencyPrice: '€', originalPrice: 0 } }),
        'calculateTotalSpeqs': jasmine.createSpy('calculateTotalBaggages').and.callFake(() => {
            return {};
        }),
        'calculateTotalSeats': jasmine.createSpy('calculateTotalBaggages').and.callFake(() => {
            return {};
        }),
        'deleteAncillaryUpgBids': jasmine.createSpy('deleteAncillaryUpgBids').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'closeAncillaryModal': jasmine.createSpy('closeAncillaryModal').and.callFake(() => { }),
    };
    let fakeModalServiceAncillaries = {
        'isNotWaiting': jasmine.createSpy('isNotWaiting').and.callFake(() => { }),
        'showGenericError': jasmine.createSpy(),
        'openBidsModal': jasmine.createSpy('openBidsModal').and.callFake(() => {
            return new Promise((resolve, reject) => {
                resolve('prueba')
            })
        }),
        'openCarbonFootprintModal': jasmine.createSpy('openCarbonFootprintModal').and.callFake(() => { }),
        'openBaggagesModal': jasmine.createSpy('openBaggagesModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openSpeqsModal': jasmine.createSpy('openSpeqsModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openPriorityBoardingModal': jasmine.createSpy('openPriorityBoardingModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openInsuranceModal': jasmine.createSpy('openInsuranceModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openSpecialMealsModal': jasmine.createSpy('openSpecialMealsModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openActivitiesModal': jasmine.createSpy('openActivitiesModal').and.callFake(() => { }),
        'openActivitiesModifyModal': jasmine.createSpy('openActivitiesModifyModal').and.callFake(() => { }),
        'openTransfersModifyModal': jasmine.createSpy('openTransfersModifyModal').and.callFake(() => { }),
        'openTransfersModal': jasmine.createSpy('openTransfersModal').and.callFake(() => { }),
        'showWaitingModal': jasmine.createSpy('showWaitingModal').and.callFake(() => { }),
        'openInsuranceMMBAllianzFusionModal': jasmine.createSpy('openInsuranceMMBAllianzFusionModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openSeatNewMapModal': jasmine.createSpy('openSeatNewMapModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
    };
    let fakeAncillariesConstants = {
        TYPE_ANCILLARIE: {
            SEAT: 'SEAT',
            BAGGAGE: 'BAGGAGE',
            SPEQS: 'SPEQS',
            PRIORITY_BOARDING: 'PRIORITY_BOARDING',
            INSURANCE: 'INSURANCE',
            UPGRADING_BID: 'UPGRADING_BID',
            GLOBICK: 'GLOBICK'
        },
        GENERAL_STATUS: {
            AVAILABLE: 'AVAILABLE'
        },
        DATALAYER_MODAL_ID: {
            INSURANCE_NOT_AVAILABLE: 'test',
            PENDING_PEYMENTS: 'PENDING_PEYMENTS',
        }
    };

    let fakeRetrieveOrderService = {
        retrieveOrderByCheckinId: jasmine.createSpy('retrieveOrderByCheckinId').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        })
    };

    let fakeCommonsAncillariesService = {
        getAncillaries: jasmine.createSpy('getAncillaries').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve('test');
            return deferred.promise;
        }),
        deleteAncillarie: jasmine.createSpy('deleteAncillarie').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve('test');
            return deferred.promise;
        }),
        deleteAllAncillaries: jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({ failedToDelete: [] });
            return deferred.promise;
        }),
        updateAncillaries: jasmine.createSpy('updateAncillaries').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve('test');
            return deferred.promise;
        })
    };
    let fakeUpdateSeatChangeNotificationService = {
        'callUpdateSeatChangeNotification': jasmine.createSpy('callUpdateSeatChangeNotification').and.callFake(() => {
            return {
                'then': () => { }
            };
        })
    };

    let fakeBookingDashboardConstants = {
        TABS: {
            management: 'management',
            complete: 'complete',
            customize: 'customize',
            refunds: 'refunds',
            changeFlights: 'changeFlights',
            simulatorChangeFlights: 'simulatorChangeFlights',
        },
        ANCILLARIES_TYPE: {
            THIRD_PARTY_COMPANIES: 'test'
        },
        ANCILLARIES_STATUS: {
            AVAILABLE: 'AVAILABLE'
        },
        BOX_LINKS_TYPES: {
            CHECK_IN: 'checkIn',
            EMERGENCY_CONTACT: 'emergencyContact',
            SEATS_AUCTION: 'seatsAuction',
            FLIGHT_REMINDER: 'flightReminder',
            BIDABLE: 'BIDABLE'
        },
        SAVE_MODAL_LITERALS: true,
        SAVE_ACCEPT_LITERALS: true,
        SAVE_ERROR_LITERALS: true
    };

    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();

    let fakeIbMmbManageCarbonFootprintInfoService = {
        openTab: jasmine.createSpy(),
        $openTabObser: {
            subscribe: jasmine.createSpy('subscribe')
        }
    };

    let fakeAncillariesInfo = {
        ancillaries: [
            {
                type: 'THIRD_PARTY_COMPANIES',
                status: {
                    code: 'AVAILABLE'
                }
            }
        ],
        insuranceInfo: {
            insuranceCountry: {},
            passengers: []
        },
        priorityBoardingInfo: {
            confirmed: true
        }
    };

    let fakeModelAncillariesInfo = {
        ancillariesAvailable: ['BAGGAGE', 'SPECIAL_EQUIPMENT'],
        ancillariesTripsBaggages: {},
        ancillariesTripsSpeqs: {},
        ancillariesCarbonFootprint: {
            kilosCo2Equivalent: 5
        },
        bidsUpgradingInfo: {
            openBids: false
        },
        aviosUpgradingInfo: {
            aviosBidAvailable: false
        },
        insuranceInfo: {
            insuranceCountry: {
                country: {
                    description: 'testOld'
                }
            },
            passengers: [{
                document: 'test',
                birthDate: 'test'
            }]
        },
        priorityBoardingInfo: {
            confirmed: true
        },
        ancillaries: [
            {
                type: 'THIRD_PARTY_COMPANIES',
                status: {
                    code: 'AVAILABLE'
                }
            }
        ],
        specialMealsInfo: {
            activeSegment: 'test',
            specialMealNumSelected: {}
        },
        ancillariesInsurance: [{
            descriptionCoverages: 'test',
            name: 'test',
            price: 0,
            originalPrice: 0,
            consent: true,
            code: 'es',
            id: 0

        }],
        insurance: '',
        selectedInsurance: true,
        seatsQuanty: 0,
        speqsQuanty: 1,
        passengerSpeqsTrips: [{
            trips: [{
                id: 0,
                pieces: [{
                    subtype: 'test',
                    quantySelected: 1
                }],
                speqsChoosed: 1
            }]
        }],
        baggagesQuanty: 1,
        passengerBaggagesTrips: [{
            trips: [{
                id: 0,
                pieces: [{
                    subtype: 'test',
                    quantySelected: 1
                }],
                piecesChoosed: 1
            }]
        }],
        preorderAncillarieInfo: {
            info: "test"
        }
    };

    let fakeModelManagementModel = {
        co2FootprintInfo: {},
        flights: [],
        manageSeats: {
            flights: []
        },
        orderItems: {
            seat: ''
        }
    };

    let fakeModelYourFlightsModel = {
        allSegments: {}
    };

    let fakeMonetateUtilsService = {
        'updateMonetateWithQuadrigam': jasmine.createSpy(),
    };

    let fakeBookingDashboardUtilsService = {
        logged: jasmine.createSpy(),
        initFacadeHeader: jasmine.createSpy(),
        reloadImportOrder: jasmine.createSpy(),
        returnOriginalData: jasmine.createSpy(),
        updateSpecialMeals: jasmine.createSpy(),
        updateModelFf: jasmine.createSpy(),
        checkSpecialNeedsEvent: jasmine.createSpy(),
    };

    let fakeBookingDashboardSharedUtilsService = {
        closeCollapseHeader: jasmine.createSpy(),
        handleUpgradeFlow: jasmine.createSpy(),
    };

    let fakeBaggagesTrips = {};

    let fakeModel = {
        passengerId: "ADULT_01",
        modifiedPersonalInfo: false,
        personalInfo: { name: 'testname', surname: 'test', birthDate: '' },
        showUpdatePersonalInfo: '',
        managementModel: {
            managePassengers: [{
                passengerId: 'ADULT_01',
                personalInfo: {
                    name: 'testname',
                    surname: 'test',
                    birthDate: ''
                },
                modifiedPersonalInfo: false
            }]
        },
        summaryModel: {
            infoAncillaries: {
                seat: {}
            }
        },
        ancillariesInfo: {
            ancillariesTransfersGlobick: {},
            ancillariesActivitiesGlobick: {},
            insuranceInfo: {
                insuranceCountry: ''
            }
        },
        tabs: {
            management: { name: 'management' },
            customize: { name: 'customize' },
            complete: { name: 'complete' },
            flights: { name: 'flights' },
            changeFlights: { name: 'changeFlights', isSubtab: true },
            simulatorChangeFlights: { name: 'simulatorChangeFlights' },
            refunds: { name: 'refunds' },
            passengers: { name: 'passengers' },
            documents: { name: 'documents' },
            invoices: { name: 'invoices' }
        }
    };

    let fakeBookingInfo = {
        order: {
            orderItems : [
                { 
                    type: 'seat',
                    emd: 'PENDING_PAYMENT',
                    segmentId: '0',
                    selected: true,
                    passengerId: 'ADULT_01'
                }
            ]
        }
    };

    let fakeHeaderModel = {
        shoppingBasket: {
            baggages: {
                amount: '30'
            }
        },
        headerModel: {
            shoppingBasket: {
                speqs: {
                    hasSpeqs: true,
                    segments: [{
                        speqs: [{
                            quanty: 1
                        }]
                    }]
                },
                priorityBoarding: {
                    hasPriorityBoarding: true
                },
                total: {
                    original: '50'
                }
            }
        },
        basket: {
            seats: [{}]
        }
    };

    let fakeNewHeaderModel = { 
        shoppingBasket: { seats: { segments: [{ seats: ['1A'] }] } } 
    };

    const normalizeUpdateSeatFlights = (data) => {
        return data.map(seg => ({
            segmentId: seg.segmentId,
            seats: Array.isArray(seg.seats) ? seg.seats : []
        }));
    };

    let fakeUpdateSeatFlights = [
        {
            segmentId: '0',
            seats: [ { rowCurrent: '1', columnCurrent: 'A', id: 'ADULT_01' } ]
        },
        {
            segmentId: '1',
            seats: []
        }
    ];

    // ─── Shared helpers ───────────────────────────────────────────────────────────

    const ModalServiceAncillariesShowGenericErrorResolve = () => {
        fakeModalServiceAncillaries.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => ({
            'result': $q.when()
        }));
    };

    const updateAncillariesResolve = () => {
        fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve('test');
            return deferred.promise;
        });
    };

    const makePassengerBaggagesTrips = (piecesCount: number) => [{
        trips: [{
            id: 0,
            pieces: [{ subtype: 'test', quantySelected: piecesCount }],
            piecesChoosed: piecesCount
        }]
    }];

    const makePassengerSpeqsTrips = (piecesCount: number) => [{
        trips: [{
            id: 0,
            pieces: [{ subtype: 'test', quantySelected: piecesCount }],
            speqsChoosed: piecesCount
        }]
    }];

    /**
     * Generates the four canonical tests for updateBaggages / updateSpeqs, which
     * share the same resolve / reject / empty-resolve / empty-reject structure.
     */
    const testUpdateAncillaryItems = (config: {
        methodName: string;
        localStorageKey: string;
        tempProp: string;
        quantityProp: string;
        makeTrips: (count: number) => any[];
    }) => {
        describe(`when ${config.methodName} function called`, () => {
            it(`should ${config.methodName} and updateAncillaries resolve`, (done) => {
                spyOn(fakeModalServiceAncillaries, 'isNotWaiting');
                fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('test');
                    return deferred.promise;
                });
                localStorageGetSpy.withArgs(config.localStorageKey).and.returnValue(config.makeTrips(1));
                BookingDashboardAncillariesService[config.methodName]();
                $rootScope.$digest();
                expect(fakeModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
                done();
            });

            it(`should ${config.methodName} and updateAncillaries reject`, (done) => {
                ModalServiceAncillariesShowGenericErrorResolve();
                fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                });
                localStorageGetSpy.withArgs(config.localStorageKey).and.returnValue(config.makeTrips(1));
                BookingDashboardAncillariesService[config.methodName]();
                $rootScope.$digest();
                expect(BookingDashboardAncillariesService.model.ancillariesInfo[config.quantityProp]).toEqual(0);
                done();
            });

            it(`should ${config.methodName} with no items and deleteAncillaries resolve`, (done) => {
                ModalServiceAncillariesShowGenericErrorResolve();
                updateAncillariesResolve();
                localStorageGetSpy.withArgs(config.localStorageKey).and.returnValue(config.makeTrips(0));
                BookingDashboardAncillariesService[config.tempProp] = localStorageService.get(config.localStorageKey);
                BookingDashboardAncillariesService[config.methodName]();
                $rootScope.$digest();
                expect(fakeModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
                done();
            });

            it(`should ${config.methodName} with no items and deleteAncillaries reject`, (done) => {
                ModalServiceAncillariesShowGenericErrorResolve();
                fakeCommonsAncillariesService.deleteAncillarie = jasmine.createSpy('deleteAncillarie').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                });
                localStorageGetSpy.withArgs(config.localStorageKey).and.returnValue(config.makeTrips(0));
                BookingDashboardAncillariesService[config.tempProp] = localStorageService.get(config.localStorageKey);
                BookingDashboardAncillariesService[config.methodName]();
                $rootScope.$digest();
                expect(fakeModalServiceAncillaries.showGenericError).toHaveBeenCalled();
                done();
            });
        });
    };

    /**
     * Generates the resolve / dismiss tests that verify closeAncillaryModal(true)
     * is called after an ancillary modal closes, regardless of outcome.
     */
    const testModalCloseAncillaryBehavior = (config: {
        label: string;
        modalSpy: string;
        openMethod: string;
        setupFn?: () => void;
        includeDismissTest?: boolean;
    }) => {
        describe(config.label, () => {
            beforeEach(() => {
                fakeAncillariesService.closeAncillaryModal = jasmine.createSpy('closeAncillaryModal').and.callFake(() => {});
                BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
                if (config.setupFn) config.setupFn();
            });

            it('should call closeAncillaryModal with true when modal resolves (then)', (done) => {
                fakeModalServiceAncillaries[config.modalSpy] = jasmine.createSpy(config.modalSpy).and.callFake(() => ({
                    result: $q.when()
                }));
                BookingDashboardAncillariesService[config.openMethod]();
                $rootScope.$digest();
                expect(fakeAncillariesService.closeAncillaryModal).toHaveBeenCalledWith(true);
                done();
            });

            if (config.includeDismissTest !== false) {
                it('should call closeAncillaryModal with true when modal is dismissed (rejection handler)', (done) => {
                    fakeModalServiceAncillaries[config.modalSpy] = jasmine.createSpy(config.modalSpy).and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject();
                        return { result: deferred.promise };
                    });
                    BookingDashboardAncillariesService[config.openMethod]();
                    $rootScope.$digest();
                    expect(fakeAncillariesService.closeAncillaryModal).toHaveBeenCalledWith(true);
                    done();
                });
            }
        });
    };

    // ─── DI setup ─────────────────────────────────────────────────────────────────

    const setupProviders = ($provide) => {
        $provide.value('MmBUtilService', fakeMmBUtilService);
        $provide.value('ModalServiceAncillaries', fakeModalServiceAncillaries);
        $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
        $provide.value('AncillariesConstants', fakeAncillariesConstants);
        $provide.value('MmBAncillariesUtilsService', fakeMmBAncillariesUtilsService);
        $provide.value('CommonsUtilService', fakeCommonsUtilService);
        $provide.value('MmBAppConstants', fakeMmBAppConstants);
        $provide.value('BookingDashboardService', fakeBookingDashboardService);
        $provide.value('BookingDashboardUtilsService', fakeBookingDashboardUtilsService);
        $provide.value('BookingDashboardSharedUtilsService', fakeBookingDashboardSharedUtilsService);
        $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
        $provide.value('UpdateSeatChangeNotificationService', fakeUpdateSeatChangeNotificationService);
        $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
        $provide.value('RetrieveOrderService', fakeRetrieveOrderService);
        $provide.value('AncillariesService', fakeAncillariesService);
        $provide.value('AncillariesTransformer', fakeAncillariesTransformer);
        $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
        $provide.value('MmBModalService', fakeMmBModalService);
        $provide.value('$filter', filterFake);
        $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
        $provide.value('MonetateConstants', fakeMonetateConstants);
        $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
        $provide.value('NewSeatsMapService', fakeNewSeatsMapService);
        $provide.value('IbMmbManageCarbonFootprintInfoService', fakeIbMmbManageCarbonFootprintInfoService);
    };

    const setupSpiesAndMocks = (_localStorageService_, _sessionStorage, _cookies) => {
        localStorageService = _localStorageService_;
        if (typeof localStorageService.clear === 'function') {
            localStorageService.clear();
        } else if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
        }
        localStorageGetSpy = spyOn(localStorageService, 'get');
        spyOn(localStorageService, 'set');
        spyOn(sessionStorage, 'setItem');
        _cookies.put('userLogged', true);
    };

    beforeEach(() => {
        angular.mock.module(
            'ib-MmB-booking-dashboard-module',
            'LocalStorageModule',
            'ib-MmB-services-module',
            'ib-MmB-filters-module',
            'ib-ancillaries-modal-module',
            'ngCookies',
            setupProviders
        );

        inject((_$rootScope_, _BookingDashboardAncillariesService_, _localStorageService_, _$q_, _$timeout_, _$cookies_) => {
            $rootScope = _$rootScope_;
            BookingDashboardAncillariesService = _BookingDashboardAncillariesService_;
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            $q = _$q_;
            $cookies = _$cookies_;
            setupSpiesAndMocks(_localStorageService_, sessionStorage, $cookies);

            $scope.$apply();
        });

        BookingDashboardAncillariesService.model = fakeModel;
        BookingDashboardAncillariesService.baggagesTrips = fakeBaggagesTrips;
        BookingDashboardAncillariesService.headerModel = fakeHeaderModel;
        BookingDashboardAncillariesService.headerModelLocal = fakeHeaderModel;
        BookingDashboardAncillariesService.newHeaderModel = fakeNewHeaderModel;

        localStorageGetSpy.withArgs('bookingInfo').and.returnValue(fakeBookingInfo);
        localStorageGetSpy.withArgs('seatsAvailableSegments').and.returnValue([{}]);
        localStorageGetSpy.withArgs('passengerSpeqsTrips').and.returnValue({});
        localStorageGetSpy.withArgs('ancillariesAvailablePassengers').and.returnValue({});
        localStorageGetSpy.withArgs('passengerBaggagesTrips').and.returnValue({});
        localStorageGetSpy.withArgs('pmtMthdsBidsTransformed').and.returnValue({});
        localStorageGetSpy.withArgs('prioritySegmentPutRequest').and.returnValue({});
        localStorageGetSpy.withArgs('flowId').and.returnValue('MMB');
        localStorageGetSpy.withArgs('confirmationDigitalInfo').and.returnValue({});
        localStorageGetSpy.withArgs('confirmationDatalayerInfo').and.returnValue({});
        localStorageGetSpy.withArgs('ancillariesPutAfterUpgBids').and.returnValue({});
        localStorageGetSpy.withArgs('headerModel').and.returnValue(fakeHeaderModel);
        localStorageGetSpy.withArgs('updateSeatFlights').and.returnValue(normalizeUpdateSeatFlights(fakeUpdateSeatFlights));
        localStorageGetSpy.withArgs('ancillariesAvailableSegments').and.returnValue({});
        localStorageGetSpy.withArgs('seatsSelectedInfoData').and.returnValue({ '0': { passengersInfo: [{ id: 0, currentSeat: { cabinIndex: 1 } }], passengers: [{ id: 0, seat: { row: '', column: '' } }] } });
        localStorageGetSpy.withArgs('seatInfoConfirmation').and.returnValue(null);
        localStorageGetSpy.withArgs('modifyFFOrSpecialNeed').and.returnValue(true);
        localStorageGetSpy.withArgs('selectedPriorityBoarding').and.returnValue({});
        localStorageGetSpy.withArgs('disruptionSeatChangeCapabilities').and.returnValue({message: {showInPageDetailTrip: true}});
        localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue({
            currencies: [{ code: 'EUR' }]
        });
        $rootScope.$digest();
    });

    // ─── Tests ────────────────────────────────────────────────────────────────────

    describe('when activate() is called', () => {
        it('ibMmbBookingDashboardService should be defined', (done) => {
            expect(BookingDashboardAncillariesService).toBeDefined();
            done();
        });
    });

    describe('when refreshAncillaries() is called', () => {
        beforeEach(()=> {
            fakeBookingDashboardService.updateAncillarieSummary = jasmine.createSpy('updateAncillarieSummary').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject('KO');
                return deferred.promise;
            });
        });
        it('refreshAncillaries is rejected', (done) => {
            spyOn(Promise,'reject')
            BookingDashboardAncillariesService.refreshAncillaries();
            $rootScope.$digest();
            expect(Promise.reject).toHaveBeenCalledWith('KO');
            done();
        });
        afterEach(()=> {
            fakeBookingDashboardService.updateAncillarieSummary = jasmine.createSpy('updateAncillarieSummary').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
        })
    });

    describe('when openSpecialMealModal() is called', () => {
        it('openSpecialMealModal should be defined', (done) => {
            spyOn(fakeDatalayerUtilsService, 'updateDatalayerInfo');
            BookingDashboardAncillariesService.model.ancillariesInfo = {
                specialMealsInfo: {
                    isGastronomicProposal : false,
                    gastronomicProposalSegmentId: 'testId'
                }
            };
            BookingDashboardAncillariesService.openSpecialMealModal(null, 'testId');
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
    });

    describe('when handleDashboardAncillariesInfo() is called', () => {
        const sameCase = (done) => {
            BookingDashboardAncillariesService.headerModelLocal = {...fakeHeaderModel};
            BookingDashboardAncillariesService.model.ancillariesInfo = {
                specialMealsInfo: {},
                priorityBoardingInfo: {
                    confirmed: true
                }
            };
            BookingDashboardAncillariesService.handleDashboardAncillariesInfo();
            $rootScope.$digest();
            expect(BookingDashboardAncillariesService.model.ancillariesInfo.baggagesQuanty).toEqual(BookingDashboardAncillariesService.headerModelLocal.shoppingBasket.baggages.amount);
            done();
        };
        beforeEach(inject(()=>{
            fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve('test');
                return deferred.promise;
            });
        }));
        it('handleDashboardAncillariesInfo should be defined and priorityBoarding', (done) => {
            sameCase(done);
        });

        it('handleDashboardAncillariesInfo should be defined and pmtMthdsBidsTransformed false', (done) => {
            localStorageGetSpy.withArgs('pmtMthdsBidsTransformed').and.returnValue(null);
            sameCase(done);
        });

        it('handleDashboardAncillariesInfo should be defined', (done) => {
            spyOn(fakeAncillariesService, 'calculateTotalBaggages')
            BookingDashboardAncillariesService.headerModelLocal = {};
            BookingDashboardAncillariesService.handleDashboardAncillariesInfo();
            expect(fakeAncillariesService.calculateTotalBaggages).toHaveBeenCalled();
            $rootScope.$digest();
            done();
        });

        afterEach(()=>{
            BookingDashboardAncillariesService.headerModelLocal = fakeHeaderModel;
            localStorageGetSpy.withArgs('pmtMthdsBidsTransformed').and.returnValue({});
        });
    });

    describe('when handleDashboardAncillariesInfo() 2 is called', () => {
        beforeEach(inject(()=>{
            ModalServiceAncillariesShowGenericErrorResolve();
            fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({});
                return deferred.promise;
            });
        }));

        it('handleDashboardAncillariesInfo updateAncillaries reject', (done) => {
            spyOn(fakeNewMainHeaderFacade,'updateBasketPriority');
            localStorageGetSpy.withArgs('pmtMthdsBidsTransformed').and.returnValue(null);
            BookingDashboardAncillariesService.headerModelLocal = fakeHeaderModel;
            BookingDashboardAncillariesService.model.ancillariesInfo.priorityBoardingInfo = {
                confirmed: true
            };
            BookingDashboardAncillariesService.handleDashboardAncillariesInfo();
            $rootScope.$digest();
            expect(fakeNewMainHeaderFacade.updateBasketPriority).toHaveBeenCalled();
            done();
        });

        it('handleDashboardAncillariesInfo updateAncillaries reject and pmtMthdsBidsTransformed and ancillariesPutAfterUpgBids true', (done) => {
            fakeMmBModalService.showGenericInfoModal = jasmine.createSpy('showGenericInfoModal').and.callFake(() => {
                return {
                    'result': $q.when()
                };
            });
            spyOn(fakeMmBModalService,'showGenericInfoModal');
            localStorageGetSpy.withArgs('ancillariesPutAfterUpgBids').and.returnValue(true);
            localStorageGetSpy.withArgs('pmtMthdsBidsTransformed').and.returnValue(true);
            BookingDashboardAncillariesService.headerModelLocal = fakeHeaderModel;
            BookingDashboardAncillariesService.model.ancillariesInfo.priorityBoardingInfo = {
                confirmed: true
            };
            BookingDashboardAncillariesService.handleDashboardAncillariesInfo();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericInfoModal).toHaveBeenCalled();
            done();
        });
    });

    describe('when updateDataInsurance event called', () => {
        beforeEach(() => {
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.model.ancillariesInfoOld = { insuranceInfo: { insuranceCountry: { country: { description: 'testOld' } } } };
        });

        it('should updateDataInsurance function called', (done) => {
            BookingDashboardAncillariesService.model.ancillariesInfo = {};
            BookingDashboardAncillariesService.model.ancillariesInfoOld = {};

            BookingDashboardAncillariesService.updateDataInsurance();
            $rootScope.$digest();
            expect(BookingDashboardAncillariesService.model.ancillariesInfo).toEqual(BookingDashboardAncillariesService.model.ancillariesInfoOld);
            done();
        });
    });

    describe('when openCarbonFootprintModal function is called', () => {
        it('call openCarbonFootprintModal', (done) => {
            const carbonParam = {
                kilosCo2Equivalent: 23.4,
                price: 1.75
            };
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.model.ancillariesInfo.ancillariesCarbonFootprint = carbonParam;

            BookingDashboardAncillariesService.openCarbonFootprintModal();

            expect(fakeModalServiceAncillaries.openCarbonFootprintModal).toHaveBeenCalledWith(carbonParam);
            done();
        })
    });

    describe('when carbon footprint delete events are triggered', () => {
        it('should call deleteCarbonFootprintAncillary', () => {
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.model.ancillariesInfo.ancillariesCarbonFootprint = {
                kilosCo2Equivalent: 23.4,
                price: 1.75,
                confirmed: true
            };

            BookingDashboardAncillariesService.deleteCarbonFootprintAncillary();

            $scope.$digest();

            expect(BookingDashboardAncillariesService.model.ancillariesInfo.ancillariesCarbonFootprint.confirmed).toBe(false);
            expect(fakeAncillariesService.deleteCarbonFootprint).toHaveBeenCalled();
            expect(fakeAncillariesService.deleteCarbonFootprintFromBasket).toHaveBeenCalled();
        });

        it('should call cleanCarbonFootprintAncillary', () => {
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.model.ancillariesInfo.ancillariesCarbonFootprint = {
                kilosCo2Equivalent: 23.4,
                price: 1.75,
                confirmed: true
            };

            BookingDashboardAncillariesService.cleanCarbonFootprintAncillary();

            expect(BookingDashboardAncillariesService.model.ancillariesInfo.ancillariesCarbonFootprint.confirmed).toBe(false);
        });
    });

    describe('when checkAncillariesDeppLink function is called', () => {
        let fakeAncillariesInfoAll = { ...fakeAncillariesInfo };
        let cases = [
            {type: 'SEAT', param: 'seat'},
            {type: 'BAGGAGE', param: 'baggage'},
            {type: 'SPEQS', param: 'speq'},
            {type: 'PRIORITY_BOARDING', param: 'priority'},
            {type: 'INSURANCE', param: 'insurance'},
            {type: 'GLOBICK', param: 'transfer'},
            {type: 'GLOBICK', param: 'activity'},
            {type: 'UPGRADING_BID', param: 'bid'}
        ]
        cases.forEach((object) => {
            it(`call checkAncillariesDeppLink and return cases ${object.type}`, (done) => {
                fakeAncillariesInfoAll.ancillaries = [
                    {
                        type: object.type,
                        status: {
                            code: 'AVAILABLE'
                        }
                    }
                ];
            
                if (object.type === 'BAGGAGE') {
                    fakeModalServiceAncillaries.openBaggagesModal = jasmine.createSpy('openBaggagesModal').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                    localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(fakeAncillariesInfoAll);
                    localStorageGetSpy.withArgs('passengerBaggagesTrips').and.returnValue(
                        [{
                            trips: [{
                                id: 0,
                                pieces: [{
                                    subtype: 'test',
                                    quantySelected: 1
                                }],
                                piecesChoosed: 1
                            }]
                        }]
                    );
                }
                else if (object.type === 'INSURANCE') {
                    fakeModalServiceAncillaries.openInsuranceModal = jasmine.createSpy('openInsuranceModal').and.callFake((response) => {
                        return { result: $q.when() };
                    });
                    fakeAncillariesInfoAll.insuranceInfo = {
                        insuranceCountry: { country: { description: '' } },
                        passengers: [{ document: 'test', birthDate: 'test' }]
                    };
                    localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(fakeAncillariesInfoAll);
                    BookingDashboardAncillariesService.model.ancillariesInfo.insuranceInfo = { insuranceCountry: {} };
                } 
                else if (object.type === 'GLOBICK'){
                    localStorageGetSpy.withArgs('urlBidFlow').and.returnValue(false);
                    localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(fakeAncillariesInfoAll);
                } else if (object.type === 'UPGRADING_BID') {
                    (fakeAncillariesInfoAll as any).bidsUpgradingInfo = { bidsAvailable: false };
                    (fakeAncillariesInfoAll as any).aviosUpgradingInfo = { aviosBidAvailable: false };
                     BookingDashboardAncillariesService.model.ancillariesInfo = {
                        ...fakeAncillariesInfoAll,
                        bidsUpgradingInfo: { bidsAvailable: false },
                        aviosUpgradingInfo: { aviosBidAvailable: false }
                    };

                    localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(fakeAncillariesInfoAll);
                    localStorageGetSpy.withArgs('urlBidFlow').and.returnValue(false);
                       
                }
                else {
                    localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(fakeAncillariesInfoAll);
                };
                
                fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake((param) => {
                    return param === object.param;
                });
                fakeBookingDashboardService.initializeDashboard = jasmine.createSpy('initializeDashboard').and.callFake((response) => {
                    let deferred = $q.defer();
                    deferred.resolve({
                    model: {
                        ancillariesInfo: fakeAncillariesInfoAll
                    }
                });
                    return deferred.promise;
                });

                fakeAncillariesService.calculateTotalSeats = jasmine.createSpy('calculateTotalSeats').and.callFake(() => {
                    return 1;
                });

                BookingDashboardAncillariesService.checkAncillariesDeppLink();
                $rootScope.$digest();
                expect(fakeMmBUtilService.getParameterByName).toHaveBeenCalledWith(object.param);
                done();
            });
        });

        it(`call checkAncillariesDeppLink and OTHER return empty`, (done) => {
            localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(null);
            BookingDashboardAncillariesService.checkAncillariesDeppLink();
            $rootScope.$digest();
            expect(localStorageService.get('ancillariesInfo')).toEqual(null);
            done();
        });
    });

    describe('when insuranceAllianzFusionModal function is called', () => {
        it('call insuranceAllianzFusionModal', (done) => {
            let fakeAncillariesInfoInsurance = { ...fakeAncillariesInfo };
            fakeAncillariesInfoInsurance.ancillaries = [
                {
                    type: 'INSURANCE',
                    status: {
                        code: 'AVAILABLE'
                    }
                }
            ];
            fakeAncillariesInfoInsurance.insuranceInfo = {
                insuranceCountry: { country: { description: '' } },
                passengers: [{ document: 'test', birthDate: 'test' }]
            };
            localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(fakeAncillariesInfoInsurance);
            fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake((param) => {
                return param === 'insurance';
            });
            fakeBookingDashboardService.initializeDashboard = jasmine.createSpy('initializeDashboard').and.callFake((response) => {
                let deferred = $q.defer();
                deferred.resolve({
                    model: {
                        ancillariesInfo: fakeAncillariesInfoInsurance
                    }
                });
                return deferred.promise;
            });
            fakeModalServiceAncillaries.openInsuranceMMBAllianzFusionModal = jasmine.createSpy('openInsuranceMMBAllianzFusionModal').and.callFake((response) => {
                return { result: $q.when() };
            });

            BookingDashboardAncillariesService.model.ancillariesInfo = fakeAncillariesInfoInsurance;

            BookingDashboardAncillariesService.openInsuranceAllianzFusionModal();
            $rootScope.$digest();
            expect(fakeModalServiceAncillaries.openInsuranceMMBAllianzFusionModal).toHaveBeenCalled();
            done();
        });
    });

    describe('when specialMealsNavigation event called', () => {
        it('should specialMealsNavigation and openSpecialMealsModal called', (done) => {
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.model.ancillariesInfo.specialMealsInfo = { activeSegment: '' };
            BookingDashboardAncillariesService.specialMealsNavigation(null, 'test');
            $rootScope.$digest();
            expect(BookingDashboardAncillariesService.model.ancillariesInfo.specialMealsInfo.activeSegment).toEqual('test');
            done();
        });
    });

    describe('when updateSeatsClose event called', () => {
        it('should updateSeatsClose and updateSeatsClose function called', (done) => {
            spyOn(localStorageService, 'remove')
            BookingDashboardAncillariesService.updateSeatsClose('test');
            $rootScope.$digest();
            expect(localStorageService.remove).toHaveBeenCalledWith('updateSeatFlights')
            done();
        });
    });

    describe('when updateSeatsAccept event called', () => {
        const sameCase = (done) => {
            BookingDashboardAncillariesService.model.managementModel = { ...fakeModelManagementModel };
            BookingDashboardAncillariesService.model.yourFlightsModel = { ...fakeModelYourFlightsModel };
            BookingDashboardAncillariesService.model.managementModel = {
                flights: [{
                    segmentId: '0',
                    seats: [{ id: 0, rowCurrent: '1', columnCurrent: 'A' }]
                }],
                manageSeats: {
                    flights: [{
                        segmentId: '0',
                        seats: [{ id: 0, rowCurrent: '1', columnCurrent: 'A' }]
                    }],
                },
                orderItems: {
                    seat: ''
                }
            };
            BookingDashboardAncillariesService.model.summaryModel = {
                infoAncillaries: {
                    seat: ''
                }
            };
            BookingDashboardAncillariesService.model.yourFlightsModel.allSegments = [
                {
                    seats: [{ id: 0, rowCurrent: '1', columnCurrent: 'A' }]
                }
            ];
            
            BookingDashboardAncillariesService.updateSeatsAccept();
            $rootScope.$digest();
            done();
        };
        it('should updateSeatsAccept and updateSeatsAccept function called', (done) => {
            localStorageGetSpy.withArgs('updateSeatFlights').and.returnValue(fakeUpdateSeatFlights);
            sameCase(done);
        });
        it('should updateSeatsAccept with updateSeatFlights false to return [] called', (done) => {
            localStorageGetSpy.withArgs('updateSeatFlights').and.returnValue(false);
            sameCase(done);
        });
        afterEach(()=>{
            localStorageGetSpy.withArgs('updateSeatFlights').and.returnValue(fakeUpdateSeatFlights);
        });
    });

    describe('when updateHeaderSeats event called', () => {       
        const sameCase = (number) => {
            let data = {
                segmentId: '0', 
                passengersInfo: [{
                    currentSeat: { row: '1', column: 'A' },
                    initialSeat: { row: '2', column: 'A' },
                    seatPrice: number,
                    id: 0,
                    name: 'test test'
                }]
            };
            BookingDashboardAncillariesService.updateHeaderSeats(null, data);
            $rootScope.$digest(); 
        };
        it('should updateHeaderSeats function called', (done) => {
            localStorageGetSpy.withArgs('seatsSelectedInfoData').and.returnValue({ '0': { passengersInfo: [{ id: 0, currentSeat: { cabinIndex: 1 } }] } });
            sameCase(0);
            expect(localStorageService.get('seatsSelectedInfoData')).toEqual({ 0: { segmentId: '0', passengersInfo: [{ id: 0, currentSeat:{ row: '1', column: 'A'}, initialSeat: { row: '2', column: 'A' }, seatPrice: 0, name: 'test test'}] } });
            done();
        });
        it('should updateHeaderSeats and seatsSelectedInfoData not defined', (done) => {
            localStorageGetSpy.withArgs('seatsSelectedInfoData').and.returnValue(false);
            sameCase(5);
            expect(localStorageService.get('seatsSelectedInfoData')).toEqual(false);
            done();
        });

        afterEach(()=> {
            localStorageGetSpy.withArgs('seatsSelectedInfoData').and.returnValue({ '0': { passengersInfo: [{ id: 0, currentSeat: { cabinIndex: 1 } }] } });
        });
    });

    const testCustomizeTabNavigation = (event, args) => {
        it(`active customize page to emit ${event}`, (done) => {
            BookingDashboardAncillariesService.model.activeTab = {};
            BookingDashboardAncillariesService[event](null, args);
            $rootScope.$digest();
            expect(BookingDashboardAncillariesService.model.activeTab.name).toEqual('customize');
            done();
        });
    }

    describe('events navigation to customize', () => {
        const navigationEvents = [
            { event: 'speqsNavigation', args: undefined },
            { event: 'ancillariesBaggageNavigation', args: undefined },
            { event: 'ancillariesSeatsNavigation', args: { segmentId: 0 } },
            { event: 'goToCustomize', args: undefined }
        ];
        navigationEvents.forEach(({ event, args }) => {
            testCustomizeTabNavigation(event, args);
        });
    });

    const testDeleteAncillaryEvent = (event, setup) => {
        it(`debe ejecutar correctamente el evento ${event}`, (done) => {
            BookingDashboardAncillariesService[event](null, 0, setup);
            $rootScope.$digest();
            done();
        });
    };

    describe('delete events to ancillaries', () => {
        let addAncillariesInfo = () => {
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
        };
        testDeleteAncillaryEvent('deleteSpeqs', () => {
            addAncillariesInfo();
            BookingDashboardAncillariesService.model.ancillariesInfo.speqsQuanty = 1;
            BookingDashboardAncillariesService.model.ancillariesInfo.passengerSpeqsTrips = [{
                trips: [{
                    id: 0,
                    pieces: [{
                        subtype: 'test',
                        quantySelected: 1
                    }],
                    speqsChoosed: 1
                }]
            }];
        });
        testDeleteAncillaryEvent('deleteBaggages', () => {
            addAncillariesInfo();
            BookingDashboardAncillariesService.model.ancillariesInfo.baggagesQuanty = 1;
            BookingDashboardAncillariesService.model.ancillariesInfo.passengerBaggagesTrips = [{
                trips: [{
                    id: 0,
                    pieces: [{
                        subtype: 'test',
                        quantySelected: 1
                    }],
                    piecesChoosed: 1
                }]
            }];
        });
    });

    describe('when deleteSeats event called', () => {
        it('should deleteSeats and deleteSeats function called', (done) => {
            let seatsDeleted = { seats: [{ segments: [{ id: '0', passengers: [{ id: 0 }], passengerIds: ['0'] }], type: 'SEAT' }], amount: 1 };
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.model.managementModel = { ...fakeModelManagementModel };
            BookingDashboardAncillariesService.model.yourFlightsModel = { ...fakeModelYourFlightsModel };

            BookingDashboardAncillariesService.model.ancillariesInfo.seatsQuanty = 1;
            BookingDashboardAncillariesService.model.managementModel.flights = [{
                segmentId: '0',
                segmentStatus: ''
            }];
            BookingDashboardAncillariesService.model.managementModel.manageSeats.flights = [{
                segmentId: '0',
                segmentStatus: ''
            }];
            BookingDashboardAncillariesService.model.yourFlightsModel.allSegments = {
                '0': {
                    segmentId: '0',
                    segmentStatus: ''
                }
            };
            fakeAncillariesService.countSeatsTotal = jasmine.createSpy('countSeatsTotal').and.callFake(() => {
                return 0;
            });

            BookingDashboardAncillariesService.deleteSeats(null, seatsDeleted);
            $rootScope.$digest();
            expect(BookingDashboardAncillariesService.model.ancillariesInfo.seatsQuanty).toEqual(0);
            done();
        });
    });

    describe('when deleteInsurance event called', () => {
        it('should deleteInsurance and deleteInsurance function called', (done) => {
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.model.ancillariesInfo.insurance = '';
            BookingDashboardAncillariesService.model.ancillariesInfo.selectedInsurance = '';

            BookingDashboardAncillariesService.deleteInsurance();
            $rootScope.$digest();
            expect(BookingDashboardAncillariesService.model.ancillariesInfo.insurance).toEqual(null);
            done();
        });
    });

    describe('when deleteAllPendingAncillaries event called', () => {
        let sameCase = (done, object) => {
            spyOn(fakeBookingDashboardService,'deleteAllSeats');
            fakeCommonsAncillariesService.deleteAllAncillaries = jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve(object);
                return deferred.promise;
            })
            BookingDashboardAncillariesService.deleteAllPendingAncillaries();
            $rootScope.$digest();
            expect(fakeBookingDashboardService.deleteAllSeats).toHaveBeenCalled();
            done();
        };
        it('should deleteAllPendingAncillaries and deleteAllPendingAncillaries function called and failedToDelete obj === 0', (done) => {
            sameCase(done, { failedToDelete: [] }); 
        });
        it('should deleteAllPendingAncillaries and deleteAllPendingAncillaries function called and failedToDelete obj > 0', (done) => {
            sameCase(done, { failedToDelete: [{ test: 'test' }] });
        });
        it('should deleteAllPendingAncillaries and deleteAllPendingAncillaries function called and reject promise', (done) => {
            spyOn(fakeMmBModalService,'finishWaiting');
            fakeCommonsAncillariesService.deleteAllAncillaries = jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });
            fakeMmBModalService.showGenericInfoModal = jasmine.createSpy('showGenericInfoModal').and.callFake(() => {
                return {
                    'result': $q.when()
                };
            });
            BookingDashboardAncillariesService.deleteAllPendingAncillaries();
            $rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
    });

    describe('when modifySeatMap event called', () => {
        it('should modifySeatMap and modifySeatMap function called', (done) => {
            spyOn(fakeMmBAncillariesUtilsService,'setSegmentInfo');
            fakeUpdateSeatChangeNotificationService.callUpdateSeatChangeNotification = jasmine.createSpy('callUpdateSeatChangeNotification').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve('test');
                return deferred.promise;
            });
            fakeModalServiceAncillaries.openSeatNewMapModal = jasmine.createSpy('openSeatNewMapModal').and.callFake(() => {
                return {
                    'result': $q.when()
                };
            });
            
            BookingDashboardAncillariesService.model.seatChangeConditions = {};
            BookingDashboardAncillariesService.modifySeatMap();
            $rootScope.$digest();
            expect(fakeMmBAncillariesUtilsService.setSegmentInfo).toHaveBeenCalled();
            done();
        });
        it('should modifySeatMap and modifySeatMap function called', (done) => {
            spyOn(fakeMmBAncillariesUtilsService,'setSegmentInfo');
            fakeUpdateSeatChangeNotificationService.callUpdateSeatChangeNotification = jasmine.createSpy('callUpdateSeatChangeNotification').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve('test');
                return deferred.promise;
            });
            fakeModalServiceAncillaries.openSeatNewMapModal = jasmine.createSpy('openSeatNewMapModal').and.callFake(() => {
                return {
                    'result': $q.when()
                };
            });
            fakeRetrieveOrderService.retrieveOrderByCheckinId = jasmine.createSpy('retrieveOrderByCheckinId').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({});
                return deferred.promise;
            });
            fakeAncillariesService.calculateTotalSeats = jasmine.createSpy('calculateTotalSeats').and.callFake(() => {
                return 1;
            });
            BookingDashboardAncillariesService.model.seatChangeConditions = {};
            BookingDashboardAncillariesService.modifySeatMap();
            $rootScope.$digest();
            expect(fakeMmBAncillariesUtilsService.setSegmentInfo).toHaveBeenCalled();
            done();
        });
        afterEach(()=> {
            fakeRetrieveOrderService.retrieveOrderByCheckinId = jasmine.createSpy('retrieveOrderByCheckinId').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve('test');
                return deferred.promise;
            });
            fakeAncillariesService.calculateTotalSeats = jasmine.createSpy('calculateTotalSeats').and.callFake(() => {
                return 0;
            });
        });
    });

    describe('when changesInHeaderModel event called', () => {
        it('should changesInHeaderModel and changesInHeaderModel function called', (done) => {
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.changesInHeaderModel();
            $rootScope.$digest();
            expect(BookingDashboardAncillariesService.model.ancillariesInfo.seatsQuanty).toEqual(1);
            done();
        });
    });

    describe('when cleanPriorityBoarding event called', () => {
        it('should cleanPriorityBoarding and cleanPriorityBoarding function called', (done) => {
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.cleanPriorityBoarding();
            $rootScope.$digest();
            expect(BookingDashboardAncillariesService.model.ancillariesInfo.priorityBoardingInfo.confirmed).toEqual(false);
            done();
        });
    });

    // ─── updateBaggages & updateSpeqs (shared pattern) ────────────────────────────

    testUpdateAncillaryItems({
        methodName: 'updateBaggages',
        localStorageKey: 'passengerBaggagesTrips',
        tempProp: 'baggagesTemp',
        quantityProp: 'baggagesQuanty',
        makeTrips: makePassengerBaggagesTrips
    });

    describe('when updateBaggages function called 2', () => {
        it('should handleUpdateAncillariesBaggages and pmtMthdsBidsTransformed null', (done) => {
            ModalServiceAncillariesShowGenericErrorResolve();
            fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject({});
                return deferred.promise;
            });
            let fakePassengerBaggagesTrips = makePassengerBaggagesTrips(1);
             
            localStorageGetSpy.withArgs('pmtMthdsBidsTransformed').and.returnValue(null);
            localStorageGetSpy.withArgs('passengerBaggagesTrips').and.returnValue(fakePassengerBaggagesTrips);
            BookingDashboardAncillariesService.headerModelLocal = {...fakeHeaderModel};
            BookingDashboardAncillariesService.model.ancillariesInfo = {
                specialMealsInfo: {},
                passengerBaggagesTrips: fakePassengerBaggagesTrips
            };
            BookingDashboardAncillariesService.updateBaggages();
            $rootScope.$digest();
            done();
        });
    });

    testUpdateAncillaryItems({
        methodName: 'updateSpeqs',
        localStorageKey: 'passengerSpeqsTrips',
        tempProp: 'speqsTemp',
        quantityProp: 'speqsQuanty',
        makeTrips: makePassengerSpeqsTrips
    });

    // ─── checkPendingPayments ──────────────────────────────────────────────────────

    describe('when checkPendingPayments function called', () => {
        it('should checkPendingPayments ', (done) => {
            spyOn(fakeMmBModalService, 'showGenericModal');
            BookingDashboardAncillariesService.checkPendingPayments();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
        it('should checkPendingPayments OrderItems empty', (done) => {
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue({ order: {} });
            BookingDashboardAncillariesService.checkPendingPayments();
            expect(localStorageService.get('bookingInfo')).toEqual({ order: {} });
            done();
        });
        it('should checkPendingPayments TotalOriginal empty', (done) => {
            localStorageGetSpy.withArgs('headerModel').and.returnValue({});
            BookingDashboardAncillariesService.checkPendingPayments();
            expect(localStorageService.get('headerModel')).toEqual({});
            done();
        });
        afterEach(()=>{
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue(fakeBookingInfo);
        });
    });

    describe('when openActivitiesModifyModal function called', () => {
        it('should openActivitiesModifyModal ', (done) => {
            spyOn(fakeModalServiceAncillaries, 'openActivitiesModifyModal');
            BookingDashboardAncillariesService.openActivitiesModifyModal();
            $rootScope.$digest();
            expect(fakeModalServiceAncillaries.openActivitiesModifyModal).toHaveBeenCalled();
            done();
        });
    });

    describe('when openTransfersModifyModal function called', () => {
        it('should openTransfersModifyModal', (done) => {
            spyOn(fakeModalServiceAncillaries, 'openTransfersModifyModal');
            BookingDashboardAncillariesService.openTransfersModifyModal();
            $rootScope.$digest();
            expect(fakeModalServiceAncillaries.openTransfersModifyModal).toHaveBeenCalled();
            done();
        });
    });

    describe('when openTransfersModal function called', () => {
        it('should openTransfersModal ', (done) => {
            spyOn(fakeModalServiceAncillaries, 'openTransfersModal');
            BookingDashboardAncillariesService.openTransfersModal();
            $rootScope.$digest();
            expect(fakeModalServiceAncillaries.openTransfersModal).toHaveBeenCalled();
            done();
        });
    });

    describe('when deleteGlobickActivities function called', () => {
        it('should deleteGlobickActivities ', (done) => {
            spyOn($rootScope, '$broadcast')
            BookingDashboardAncillariesService.deleteGlobickActivities();
            $rootScope.$digest();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('setDisconfirmedActivities');
            done();
        });
    });

    describe('when deleteGlobickTransfers function called', () => {
        it('should deleteGlobickTransfers ', (done) => {
            spyOn($rootScope, '$broadcast')
            BookingDashboardAncillariesService.deleteGlobickTransfers();
            $rootScope.$digest();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('setDisconfirmed');
            done();
        });
    });

    describe('when customizeFlight function called', () => {
        it('should customizeFlight and modifyFFOrSpecialNeed is false', (done) => {
            localStorageGetSpy.withArgs('modifyFFOrSpecialNeed').and.returnValue(false);
            BookingDashboardAncillariesService.customizeFlight();
            $rootScope.$digest();
            expect(localStorageService.get('modifyFFOrSpecialNeed')).toEqual(false);
            done();
        });
        it('should customizeFlight modifyFFOrSpecialNeed is true', (done) => {
            BookingDashboardAncillariesService.customizeFlight();
            $rootScope.$digest();
            expect(localStorageService.get('modifyFFOrSpecialNeed')).toEqual(true);
            done();
        });
        afterEach(()=>{
            localStorageGetSpy.withArgs('modifyFFOrSpecialNeed').and.returnValue(true);
        });
    });

    describe('when customizeFlight function called', () => {
        it('should customizeFlight and updateAncillariesInfo is reject', (done) => {
            spyOn(fakeMmBModalService, 'showGenericError')
            fakeBookingDashboardService.updateAncillariesInfo = jasmine.createSpy('updateAncillariesInfo').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject('test');
                return deferred.promise;
            });
            BookingDashboardAncillariesService.customizeFlight();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
        afterEach(() => {
            fakeBookingDashboardService.updateAncillariesInfo = jasmine.createSpy('updateAncillariesInfo').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve('test');
                return deferred.promise;
            });
        });
    });
     
    describe('when customizeFlight function called', () => {
        it('should customizeFlight and getAncillaries is reject', (done) => {
            spyOn(fakeMmBModalService, 'showGenericError')
            fakeCommonsAncillariesService.getAncillaries = jasmine.createSpy('getAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject('test');
                return deferred.promise;
            });
            BookingDashboardAncillariesService.customizeFlight();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
        afterEach(()=>{
            fakeCommonsAncillariesService.getAncillaries = jasmine.createSpy('getAncillaries').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve('test');
                return deferred.promise;
            });
        });
    });

    describe('when handleAlreadyLoadedTimeout function called', () => {
        it('should handleAlreadyLoadedTimeout', (done) => {
            spyOn(fakeNewMainHeaderFacade, 'updatePendingPaymentItems')
            BookingDashboardAncillariesService.headerModel.basket.seats = [{}];
            BookingDashboardAncillariesService.headerModel.headerModel.shoppingBasket.total.original = 0;
            BookingDashboardAncillariesService.handleAlreadyLoadedTimeout();
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeNewMainHeaderFacade.updatePendingPaymentItems).toHaveBeenCalled();
            done();
        });
        it('should handleAlreadyLoadedTimeout and total original > 0', (done) => {
            spyOn(localStorageService, 'set')
            BookingDashboardAncillariesService.headerModel.basket.seats = [{}];
            BookingDashboardAncillariesService.headerModel.headerModel.shoppingBasket.total.original = 50;
            BookingDashboardAncillariesService.handleAlreadyLoadedTimeout();
            $timeout.flush();
            $rootScope.$digest();
            const calls = (localStorageService.set as any).calls.allArgs();
            const hasAlreadyLoaded = calls.some((args: any[]) => Array.isArray(args) && args[0] === 'alreadyLoaded');
            expect(hasAlreadyLoaded).toBe(true);
            done();
        });
        it('should set paymentPassenger and freePassenger on pending seats', (done) => {
            const mockSeat = { passengers: [{ id: 'ADULT_01', amount: 20 }] };
            BookingDashboardAncillariesService.headerModel.basket.seats = [{ seats: [mockSeat] }];
            BookingDashboardAncillariesService.headerModel.headerModel.shoppingBasket.total.original = 0;
            BookingDashboardAncillariesService.handleAlreadyLoadedTimeout();
            $timeout.flush();
            $rootScope.$digest();
            expect(mockSeat['paymentPassenger']).toEqual(mockSeat.passengers);
            expect(mockSeat['freePassenger']).toEqual([]);
            done();
        });
        afterEach(()=>{
            BookingDashboardAncillariesService.headerModel.headerModel.shoppingBasket.total.original = 50;
        })
    });

    // ─── Seat map ─────────────────────────────────────────────────────────────────

    describe('[Selección de asientos] when openSeatMap resolves and retrieveOrderSucces is called', () => {
        beforeEach(() => {
            fakeModalServiceAncillaries.openSeatNewMapModal = jasmine.createSpy('openSeatNewMapModal').and.callFake(() => {
                return { result: $q.when() };
            });
            fakeRetrieveOrderService.retrieveOrderByCheckinId = jasmine.createSpy('retrieveOrderByCheckinId').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve({ order: { orderItems: [] } });
                return deferred.promise;
            });
            BookingDashboardAncillariesService.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
            BookingDashboardAncillariesService.model.seatChangeConditions = false;
        });

        it('should call MmBDatalayerUtilsService.setAncillariesDatalayer when retrieveOrderSucces is triggered', (done) => {
            fakeAncillariesService.closeAncillaryModal = jasmine.createSpy('closeAncillaryModal').and.callFake(() => {});

            BookingDashboardAncillariesService.openSeatMap(null, null);
            $rootScope.$digest();

            expect(fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
            done();
        });

        it('should call AncillariesService.closeAncillaryModal with false when retrieveOrderSucces is triggered', (done) => {
            fakeAncillariesService.closeAncillaryModal = jasmine.createSpy('closeAncillaryModal').and.callFake(() => {});

            BookingDashboardAncillariesService.openSeatMap(null, null);
            $rootScope.$digest();

            expect(fakeAncillariesService.closeAncillaryModal).toHaveBeenCalledWith(true);
            done();
        });

        afterEach(() => {
            fakeRetrieveOrderService.retrieveOrderByCheckinId = jasmine.createSpy('retrieveOrderByCheckinId').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
        });
    });

    // ─── Modal close behaviour (shared pattern) ────────────────────────────────────

    testModalCloseAncillaryBehavior({
        label: '[Maletas] when openBaggages modal resolves',
        modalSpy: 'openBaggagesModal',
        openMethod: 'openBaggages',
        setupFn: () => {
            localStorageGetSpy.withArgs('passengerBaggagesTrips').and.returnValue(fakeModelAncillariesInfo.passengerBaggagesTrips);
        }
    });

    testModalCloseAncillaryBehavior({
        label: '[Equipajes Especiales] when openSpeqs modal resolves',
        modalSpy: 'openSpeqsModal',
        openMethod: 'openSpeqs',
        setupFn: () => {
            localStorageGetSpy.withArgs('passengerSpeqsTrips').and.returnValue(fakeModelAncillariesInfo.passengerSpeqsTrips);
        },
        includeDismissTest: false
    });

    testModalCloseAncillaryBehavior({
        label: '[Priority Boarding] when openPriorityBoarding modal resolves or is dismissed',
        modalSpy: 'openPriorityBoardingModal',
        openMethod: 'openPriorityBoarding'
    });

    // ─── updateDatalayer ──────────────────────────────────────────────────────────

    describe('when updateDatalayer function called', () => {
        const setupUpdateDatalayerMocks = (ancillariesInfoMock: any) => {
            const confirmationDigitalInfoMock: { Currency?: string | null } = {};
            fakeDatalayerUtilsService.updateDigitalDataWithQuadrigam.calls.reset();
            fakeDatalayerUtilsService.updateDatalayerWithQuadrigam.calls.reset();
            localStorageGetSpy.withArgs('confirmationDigitalInfo').and.returnValue(confirmationDigitalInfoMock);
            localStorageGetSpy.withArgs('confirmationDatalayerInfo').and.returnValue({});
            localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(ancillariesInfoMock);
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue(fakeBookingInfo);
            localStorageGetSpy.withArgs('ancillariesAvailableSegments').and.returnValue({});
            return confirmationDigitalInfoMock;
        };
    
        const expectCurrencyAfterUpdateDatalayer = (
            ancillariesInfoMock: any,
            expectedCurrency: string | null
        ) => {
            const confirmationDigitalInfoMock = setupUpdateDatalayerMocks(ancillariesInfoMock);
            BookingDashboardAncillariesService['updateDatalayer']();
            expect(confirmationDigitalInfoMock.Currency).toBe(expectedCurrency);
            expect(fakeDatalayerUtilsService.updateDigitalDataWithQuadrigam).toHaveBeenCalledWith(
                fakeMmBAppConstants.QUADRIGAM.CUSTOMIZE_YOUR_TRAVEL,
                confirmationDigitalInfoMock,
                true
            );
        };
    
        [
            {
                description: 'from ancillariesInfo.currencies[0].code',
                ancillariesInfo: { currencies: [{ code: 'EUR' }] },
                expectedCurrency: 'EUR'
            },
            {
                description: 'to null when ancillariesInfo has no currencies',
                ancillariesInfo: {},
                expectedCurrency: null
            },
            {
                description: 'to null when ancillariesInfo is not available',
                ancillariesInfo: null,
                expectedCurrency: null
            },
            {
                description: 'to null when currencies array is empty',
                ancillariesInfo: { currencies: [] },
                expectedCurrency: null
            }
        ].forEach(({ description, ancillariesInfo, expectedCurrency }) => {
            it(`should set Currency ${description}`, () => {
                expectCurrencyAfterUpdateDatalayer(ancillariesInfo, expectedCurrency);
            });
        });
    });

    describe('clearSeatsSelectedInfoData', () => {
        const segmentId = 'SEG_01';

        const makeSeatsLocalStorage = () => ({
            [segmentId]: {
                passengersInfo: [
                    { id: 'PAX_01', currentSeat: { row: '5', column: 'A', cabinIndex: 2, rowIndex: 3, columnIndex: 0, seatTypeDescription: 'Window', seatType: 'W' } },
                    { id: 'PAX_02', currentSeat: { row: '5', column: 'B', cabinIndex: 2, rowIndex: 3, columnIndex: 1, seatTypeDescription: 'Middle', seatType: 'M' } }
                ],
                passengers: [
                    { id: 'PAX_01', seat: { row: '5', column: 'A' }, passengerInfo: { currentSeat: { row: '5', column: 'A' } } },
                    { id: 'PAX_02', seat: { row: '5', column: 'B' }, passengerInfo: { currentSeat: { row: '5', column: 'B' } } }
                ]
            }
        });

        const makeSegmentDeleted = (passengerIds: string[]) => ({
            id: segmentId,
            passengers: passengerIds.map(id => ({ id }))
        });

        beforeEach(() => {
            localStorageGetSpy.withArgs('seatsSelectedInfoData').and.callFake(() => makeSeatsLocalStorage());
        });

        it('should clear row and column in passengers[].seat for deleted passenger', () => {
            const segmentDeleted = makeSegmentDeleted(['PAX_01']);

            (BookingDashboardAncillariesService as any).clearSeatsSelectedInfoData(segmentDeleted);

            const written = (localStorageService.set as jasmine.Spy).calls.mostRecent().args;
            const updatedPassenger = written[1][segmentId].passengers[0];
            expect(updatedPassenger.seat.row).toBe('');
            expect(updatedPassenger.seat.column).toBe('');
        });

        it('should clear row and column in passengers[].passengerInfo.currentSeat for deleted passenger', () => {
            const segmentDeleted = makeSegmentDeleted(['PAX_01']);

            (BookingDashboardAncillariesService as any).clearSeatsSelectedInfoData(segmentDeleted);

            const written = (localStorageService.set as jasmine.Spy).calls.mostRecent().args;
            const currentSeat = written[1][segmentId].passengers[0].passengerInfo.currentSeat;
            expect(currentSeat.row).toBe('');
            expect(currentSeat.column).toBe('');
        });

        it('should clear row and column in passengersInfo[].currentSeat preserving cabinIndex for deleted passenger', () => {
            const segmentDeleted = makeSegmentDeleted(['PAX_01']);

            (BookingDashboardAncillariesService as any).clearSeatsSelectedInfoData(segmentDeleted);

            const written = (localStorageService.set as jasmine.Spy).calls.mostRecent().args;
            const currentSeat = written[1][segmentId].passengersInfo[0].currentSeat;
            expect(currentSeat.row).toBe('');
            expect(currentSeat.column).toBe('');
            expect(currentSeat.cabinIndex).toBe(2);
        });

        it('should NOT modify data for passengers not in the deleted list', () => {
            const segmentDeleted = makeSegmentDeleted(['PAX_01']);

            (BookingDashboardAncillariesService as any).clearSeatsSelectedInfoData(segmentDeleted);

            const written = (localStorageService.set as jasmine.Spy).calls.mostRecent().args;
            const untouchedPassenger = written[1][segmentId].passengers[1];
            expect(untouchedPassenger.seat.row).toBe('5');
            expect(untouchedPassenger.seat.column).toBe('B');
        });

        it('should NOT call localStorageService.set when hasSeatsLocalStorage returns false', () => {
            localStorageGetSpy.withArgs('seatsSelectedInfoData').and.returnValue({});
            const segmentDeleted = makeSegmentDeleted(['PAX_01']);
            const setCallsBefore = (localStorageService.set as jasmine.Spy).calls.count();

            (BookingDashboardAncillariesService as any).clearSeatsSelectedInfoData(segmentDeleted);

            expect((localStorageService.set as jasmine.Spy).calls.count()).toBe(setCallsBefore);
        });
    });
});
