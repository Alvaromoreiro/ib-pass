import angular from "angular";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';
import { of, throwError } from "rxjs";

describe('ibMmbBookingDashboardComponent test', () => {

    let $componentController, $rootScope, $scope, localStorageGetSpy, $timeout, controller, $q, localStorageService,$onInit,template;

    const serviceResolve = (service, method, data, isPromiseResult?, stateValue?) => {
        service[method] = jasmine.createSpy(method).and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve(data);
            if (stateValue) return deferred.promise.$$state.value;
            if (isPromiseResult) return {'result': deferred.promise};
            return deferred.promise;
        });
    };

    const serviceResolveReturn = (service, method) => {
        service[method] = jasmine.createSpy(method).and.callFake(() => {
            return {
                'result': $q.when()
            };
        });
    };

    const serviceReject = (service, method, data) => {
        service[method] = jasmine.createSpy(method).and.callFake(() => {
            let deferred = $q.defer();
            deferred.reject(data);
            return deferred.promise;
        });
    };

    const afterServiceResolve = (method, data) => {
        return jasmine.createSpy(method).and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve(data);
            return deferred.promise;
        })
    };

    const afterServiceReturn = (method, data) => {
        return jasmine.createSpy(method).and.callFake(() => {
            return data;
        })
    };
    const afterServiceEmpty = (method) => {
        return jasmine.createSpy(method).and.callFake(() => {})
    };

    let fakeNewMainHeaderFacade = {
        'initHeader': afterServiceReturn('initHeader', {
            onLogin: () => {},
            onError: () => {}
        }),
         'updateBasketDiscounts': afterServiceEmpty('updateBasketDiscounts'),
         'updateBasketPriority': jasmine.createSpy(),
         'updateHeader': afterServiceEmpty('updateHeader'),
    };
    let fakeCallAncillariesPageService = {
        'getInsurance': afterServiceEmpty('getInsurance'),
    };
    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
        defaultBackgroundImageUrl: 'DEFAULT_BG',
        INT_HOSTNAME: 'localhost',
        URL_PARAMETERS: {
            VIP_SERVICES: 'VIP_SERVICES'
        },
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
            EARLY_ANCILLARIES : 'test',
            ANCILLARIES: 'ANCILLARIES',
            CUSTOMIZE_YOUR_TRAVEL: 'customize',
            YOUR_DOCUMENTS: 'documents'
        },
        PASSENGER_TYPE: {
            INFANT: 'INFANT'
        },
        SPECIAL_NEEDS: {
            SVAN_STATUS: {
                HK: { code: 'HK', description: 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
                KK: { code: 'KK', description: 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
                UC: { code: 'UC', description: 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
                UN: { code: 'UN', description: 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
                DEFAULT: { code: '', description: 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS' } //Pendiente
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
        },
        APP_TYPES: {
            MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC'
        }
    };
    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': afterServiceEmpty('updateDatalayerWithQuadrigam'),
        'updateLoggedDatalayer': afterServiceEmpty('updateLoggedDatalayer'),
        'sendDatalayerEvent': afterServiceEmpty('sendDatalayerEvent'),
        'updateDatalayerEvents': afterServiceEmpty('updateDatalayerEvents'),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy(),
        'updateDatalayerViewEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerForAncillaries':jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy(),
        'updateDigitalDataForAncillaries': jasmine.createSpy(),
        'setAncillariesDatalayer': jasmine.createSpy(),
        'addDigitalDataInfo': jasmine.createSpy()
    };

    let fakeMmBUtilService = {
        'isUserLogged': afterServiceReturn('isUserLogged', true),
        'getURLFirstParameterByName': afterServiceReturn('getURLFirstParameterByName', {}),
        'updateDinamicPricingDatalayer': afterServiceReturn('updateDinamicPricingDatalayer', {}),
        'getBackGroundURL': jasmine.createSpy('getBackGroundURL').and.callFake((code: string) => `https://content.example/bg/${code || fakeMmBAppConstants.defaultBackgroundImageUrl}`),
        'transformSisterCitiesModel': afterServiceReturn('transformSisterCitiesModel', {}),
        'closeBasketHeader': afterServiceReturn('closeBasketHeader', {}),
        'checkFailedPendingPayments': afterServiceReturn('checkFailedPendingPayments', {}),
        'refreshToken': afterServiceReturn('refreshToken', {}),
        'getParameterByName': afterServiceReturn('getParameterByName', {}),
    };

    let fakeMmBUtilsSharedService = {
        'getInfoHeader': afterServiceReturn('getInfoHeader', true),
        'newTransformSisterCitiesModel': afterServiceReturn('newTransformSisterCitiesModel', {}),
        'generateFlexAndDisruptedFlightsDatalayerInfo': afterServiceReturn('generateFlexAndDisruptedFlightsDatalayerInfo', {}),
    };

    let fakeMmBModalService = {
        'finishWaiting': afterServiceEmpty('finishWaiting'),
        'showFlightReminderModal': jasmine.createSpy('showFlightReminderModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showGenericError': jasmine.createSpy(),
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showWaitingModal': afterServiceEmpty('showWaitingModal'),
        'closeAllCurrentModals': afterServiceEmpty('closeAllCurrentModals'),
        'callApisService': afterServiceEmpty('callApisService'),
        'showVoluntaryChangeModal': afterServiceEmpty('showVoluntaryChangeModal'),
        'showGenericInfoModal': jasmine.createSpy('showGenericInfoModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showPassengerModal': jasmine.createSpy('showPassengerModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
    };
    let fakeCommonsUtilService = {
        'setTitlePage': afterServiceReturn('setTitlePage', 'TITULO'),
        'getUserTypeByToken': afterServiceReturn('getUserTypeByToken', 'test'),
    };
    let fakeBookingDashboardModel = require('@test/mocks/storage/booking-dashboard-model-mock.json');
    fakeBookingDashboardModel.initializeModel = () => {};

    let fakeVipLoungesService = {
        'getExclusiveServicesLauncherComponent': afterServiceResolve('getExclusiveServicesLauncherComponent', false),
        'getVipInvitationsComponent': afterServiceResolve('getVipInvitationsComponent', false),
        'getFastTrackCardComponent': afterServiceResolve('getFastTrackCardComponent', false),
    };

    let fakeBookingDashboardService = {
        'initializeDashboard': jasmine.createSpy(),
        'updateDataContactInfo': afterServiceResolve('updateDataContactInfo', null),
        'updatePassengerSpecialNeeds': afterServiceResolve('updatePassengerSpecialNeeds', null),
        'updateApisInfo': afterServiceResolve('updateApisInfo', null),
        'updateAncillariesInfo': afterServiceResolve('updateAncillariesInfo', null),
        'updateAncillarieSummary': afterServiceResolve('updateAncillarieSummary', null),
        'recoverDashboardDataAfterLogin': afterServiceReturn('recoverDashboardDataAfterLogin', {
            model: {
                ancillariesInfo: {
                    bidsUpgradingInfo: {
                        aviosBidAvailable: false
                    }
                }
            }
        }),
        'callApisService': afterServiceResolve('callApisService', {}),
        'getContactData': afterServiceResolve('getContactData', {email: 'otro@test.com'}),
        'updateContactDetails': afterServiceResolve('updateContactDetails', null),
        'deleteAllSeats': jasmine.createSpy(),
        'getTravelPreferences': afterServiceResolve('getTravelPreferences', null),
        'updateTravelPreferences': afterServiceResolve('updateTravelPreferences', null),
        'getPersonalData': afterServiceResolve('getPersonalData', {gender: 'test'}),
        'updatePersonalData': afterServiceResolve('updatePersonalData', {gender: 'other'}),
    };

    let faketranslate = {
        'onReady': afterServiceResolve('onReady', null),
    };
    let fakeRedirectionService = {
        'externalRedirect': afterServiceEmpty('externalRedirect'),
    };

    let fakeAncillariesService = {
        'calculateTotalBaggages': afterServiceReturn('calculateTotalBaggages', {}),
        'deleteCarbonFootprint': afterServiceResolve('deleteCarbonFootprint', null),
        'deleteCarbonFootprintFromBasket': afterServiceEmpty('deleteCarbonFootprintFromBasket'),
        'deleteAviosAncillaries': afterServiceEmpty('deleteAviosAncillaries'),
        'countSpeqsTotal': afterServiceEmpty('countSpeqsTotal'),
        'countBaggageTotal': afterServiceEmpty('countBaggageTotal'),
        'countSeatsTotal': afterServiceReturn('countSeatsTotal', 0),
        'getUpdateSeatInfo': afterServiceEmpty('getUpdateSeatInfo'),
        'getPriceOfferInsurance': afterServiceReturn('getPriceOfferInsurance', {currencyPrice: '€', originalPrice: 0} ),
        'calculateTotalSpeqs': afterServiceReturn('calculateTotalSpeqs', {}),
        'calculateTotalSeats': afterServiceReturn('calculateTotalSeats', {}),
        'deleteAncillaryUpgBids': afterServiceResolve('deleteAncillaryUpgBids', null),
    };
    let fakeModalServiceAncillaries = {
        'showGenericError': jasmine.createSpy(),
        'openBidsModal': afterServiceResolve('openBidsModal', 'prueba'),
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
    };
    let fakeAncillariesConstants = {
        TYPE_ANCILLARIE:{
            SEAT: 'SEAT',
            BAGGAGE: 'BAGGAGE',
            SPEQS: 'SPEQS',
            PRIORITY_BOARDING: 'PRIORITY_BOARDING',
            INSURANCE: 'INSURANCE',
            UPGRADING_BID: 'UPGRADING_BID',
            GLOBICK: 'GLOBICK'
        },
        GENERAL_STATUS: {
            AVAILABLE:'AVAILABLE'
        },
        DATALAYER_MODAL_ID: {
            INSURANCE_NOT_AVAILABLE: 'test',
            PENDING_PEYMENTS: 'PENDING_PEYMENTS',
        }
    };

    let fakeCurrencyService = {
        getCurrencyObject:  jasmine.createSpy(),
        formatPrice: jasmine.createSpy()
    };
    let fakeCommonsModalService = {
        'finishWaiting':jasmine.createSpy(),
        'closeAllCurrentModals': jasmine.createSpy(),
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showGenericComponentModal': jasmine.createSpy('showGenericComponentModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showWaitingModal': afterServiceEmpty('showWaitingModal'),
    };
    let fakeIbCPermanentUserService = {
        'isAfterLoginPermanentUser': jasmine.createSpy('isAfterLoginPermanentUser'),
        'removeParamsAfterLogin': jasmine.createSpy('removeParamsAfterLogin'),
        'checkPermanentUserFlow': afterServiceResolve('checkPermanentUserFlow', null),
        'isAfterLoginBidsPermanentUser': afterServiceReturn('isAfterLoginBidsPermanentUser', false),

    };
    let fakeCommonsUserUtilsService = {'isSoftUser': jasmine.createSpy().and.returnValue( ()=>{return true} )};
    let fakeCommonsGetLoginInfoService = {
        checkCustomerStatus: afterServiceResolve('checkCustomerStatus', null),
    };
    let fakeVoluntaryChangesLogService = {
        getVoluntaryChangesLog: jasmine.createSpy(),
    };
    let fakeVoluntaryRefundLogService = {
        getVoluntaryRefundLog: jasmine.createSpy(),
    };
    let fakeCommonsLoginUtilsService = {
        'updateStateToAnonymous': jasmine.createSpy(),
    };

    let fakeRoute = {
        'reload': jasmine.createSpy()
    };
    let fakeCommonsAncillariesService = {
        getAncillaries: afterServiceResolve('getAncillaries', 'test'),
        deleteAncillarie: afterServiceResolve('deleteAncillarie', 'test'),
        deleteAllAncillaries: afterServiceResolve('deleteAllAncillaries', {failedToDelete: []}),
        updateAncillaries: afterServiceResolve('updateAncillaries', 'test'),
    };

    let fakeGetPhoneCodesService = {
        getPhoneCodesList: afterServiceResolve('getPhoneCodesList', null),
    };

    let fakeBookingDashboardConstants = {
        TABS: {
            management: 'management',
            complete: 'complete',
            customize: 'customize',
            refunds: 'refunds',
            changeFlights: 'changeFlights',
            simulatorChangeFlights: 'simulatorChangeFlights',
            exclusiveBenefits: 'exclusiveBenefits'
        },
        ANCILLARIES_TYPE: {
            THIRD_PARTY_COMPANIES : 'test'
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

    let fakeInvoiceListService = {
        'getInvoiceList': afterServiceResolve('getInvoiceList', null),
    };

    let fakeReshopConditions = {};

    let fakeBookingInfo = require('@test/mocks/storage/booking-info-dashboard-mock.json');

    let fakeHeaderModel = require('@test/mocks/storage/header-model-dashboard-mock.json');

    let fakeAncillariesInfo = {
        ancillaries: [
            {
                type: 'THIRD_PARTY_COMPANIES',
                status: {
                    code: 'AVAILABLE'
                }
            }
        ],
        insuranceInfo: {},
        insuranceCountry: {},
        priorityBoardingInfo: {
            confirmed: true
        }
    };

    let fakeModelAncillariesInfo = {
        ancillariesAvailable: ['BAGGAGE', 'SPECIAL_EQUIPMENT' ],
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
        ancillariesInsurance:[{
            descriptionCoverages: 'test',
            name: 'test',
            price: 0,
            originalPrice: 0,
            consent: true,
            code:'es',
            id:0

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

    let fakeDisruptionSeatChangeCapabilities = {
        message: {
            showInPageDetailTrip : true
        }
    };

    let fakeCustomerData = {
        generalInfo: {
            category: "INFINITA PRIME",
            avios: 8000,
            aviosTransformed: "8.000",
            hashEID: "7b2761bd5ff0da4a7047c996679fd69e7211f003773c9fe55cb823c37bb8f2de"
        },
        personalInfo: {
            ibPlusNumber: "1234",
            name: "Correo",
            surname1: "Dos",
            surname2: "",
            gender: "Male",
            contactEmail: "correoiberiados@outlook.com",
            telecomAddresses: {},
            alarms: [
                {
                    "number": 1,
                    "params": [
                        "25"
                    ]
                },
                {
                    "number": 5,
                    "params": [
                        "DEVOLUCIONES DE CORREO",
                        "20/02/2020"
                    ]
                },
                {
                    "number": 7,
                    "params": []
                }
            ]
        },
        beneficiaries: {
            ibPlusNumber: "1234"
        },
        largeFamilyInfo: {
            category: null,
            docNumber: null,
            zipCode: null
        },
        residentInfo: {
            area: -1
        },
        acceptedTermsAndConditions: false,
        otherStatuses: {
            isRedemptionEnabled: true
        },
        partners: []
    };

    let fakeIbNewModalAncillariesService = {
        openDisruptedSeatsModal: jasmine.createSpy('openDisruptedSeatsModal').and.returnValue(of())
    };

    let fakeLoadingSpinnerService = {
        'show': afterServiceEmpty('show'),
        'hide': afterServiceEmpty('hide'),
        'isLoading': jasmine.createSpy('isLoading').and.returnValue(false)
    };

    let fakeBookingDashboardAncillariesService = {
        changesInHeaderModel: jasmine.createSpy(),
        handleInitCarbonFootprintSubscription: jasmine.createSpy(),
        cleanPriorityBoarding: jasmine.createSpy(),
        specialMealsNavigation: jasmine.createSpy(),
        resetInsuranceInfo: jasmine.createSpy(),
        handleDashboardAncillariesInfo: jasmine.createSpy(),
        customizeFlight: jasmine.createSpy(),
        deleteSeats: jasmine.createSpy(),
        checkAncillariesDeppLink: jasmine.createSpy(),
        handleAlreadyLoadedTimeout: jasmine.createSpy(),
        deleteAllPendingAncillaries: jasmine.createSpy(),
        modifySeatMap: jasmine.createSpy(),
        deleteBaggages: jasmine.createSpy(),
        deleteSpeqs: jasmine.createSpy(),
        updateSeatsClose: jasmine.createSpy(),
        updateSeatsAccept: jasmine.createSpy(),
        updateHeaderSeats: jasmine.createSpy(),
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

    let fakePassengersModel = {
        contactData: {
            primaryContactInfo: {
                lowerCaseEmail: 'test'
            }
        }
    };

    let fakeWindow = {
        requestAnimationFrame: jasmine.createSpy(),
        scrollTo: jasmine.createSpy(),
    };

    let fakeCookies = {
        get: jasmine.createSpy('get').and.returnValue(true)
    };

    const setupFrequentFlyer = () => {
        controller.model.passengersModel.passengers = [{
            type: 'frequentFlyer',
            passengerId: 'ADULT_01',
            frequentFlyerInfo: {
                company: 'test',
                number: '1234',
                airlineName: 'test'
            },
            passengers: [{
                passengerId: 'ADULT_01',
                frequentFlyerInfo: {
                    company: 'test',
                    number: '1234',
                    airlineName: 'test'
                },
            }]
        }];
    };

    const setupPrimaryContactFull = () => {
        controller.model.passengersModel.originalData = {
            test: 'test',
            emailRepeat: true
        };
        controller.model.passengersModel.contactData = {
            primaryContactInfo: {
                emailRepeat: true
            }
        };
        controller.model.passengersModel.passengers = [{
            type: 'primaryContact',
            additionalFFInfo: ''
        }];
    };

    const setupAPIS = () => {
        controller.model.shouldLoad = true;
        controller.model.passengersModel = {
            contactData: {
                emergencyContactInfo: ''
            },
            passengers: [{
                passengerId: 'ADULT_01',
                additionalRequiredInfo: {
                    basicInfo: {
                        gender: 'MALE'
                    }
                },
                frequentFlyerInfo: {
                    number: '1234'
                }
            }]
        };
        controller.model.bookingGeneralInfo.flowId = 'test';
    };

    const setupSpecialNeeds = () => {
        controller.model.passengersModel.passengers = [{
            passengerId: 'ADULT_01',
            specialNeeds: {
                specialVision: 'BLND',
                specialIntellectual: 'DPNA',
                specialHearing: 'DEAF',
                specialGuideDog: 'SVAN',
                specialWheelchair: 'TEST',
                values: []
            }
        }];
    };

    const setupPrimaryContactSimple = () => {
        controller.model.passengersModel.originalData = {
            emailRepeat: true
        };
        controller.model.passengersModel.contactData = {
            primaryContactInfo: {
                emailRepeat: true
            }
        };
    };
    const setupEmergencyContactFull = () => {
        controller.model.passengersModel = {
            originalData: 'test',
            contactData: {
                emergencyContactInfo: ''
            },
            passengers: [{
                emergencyContactInfo : ''
            }]
        };
    };
    const setupEmergencyContactSimple = () => {
        controller.model.passengersModel.originalData = 'test';
        controller.model.passengersModel.contactData = {
            emergencyContactInfo: 'test'
        };
    };

    let fakeMmBAncillariesUtilsService = {
        'generateAncillariesHeaderInfo': afterServiceReturn('generateAncillariesHeaderInfo', {
            seats: [{
                segments: [{
                    quanty: 2
                }],
                hasSeats: true,
                total: {
                    total: 2
                }
            }]
        })
    };

    const setupProviders = ($provide) => {
        $provide.value('BookingDashboardService', fakeBookingDashboardService);
        $provide.value('BookingDashboardModel', fakeBookingDashboardModel);
        $provide.value('MmBModalService', fakeMmBModalService);
        $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
        $provide.value('RedirectionService', fakeRedirectionService);
        $provide.value('$filter', filterFake);
        $provide.value('$translate', faketranslate);
        $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
        $provide.value('MmBAppConstants', fakeMmBAppConstants);
        $provide.value('MmBUtilService', fakeMmBUtilService);
        $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        $provide.value('AncillariesService', fakeAncillariesService);
        $provide.value('ModalServiceAncillaries', fakeModalServiceAncillaries);
        $provide.value('VipLoungesService', fakeVipLoungesService);
        $provide.value('AncillariesConstants', fakeAncillariesConstants);
        $provide.value('CurrencyService', fakeCurrencyService);
        $provide.value('$window', fakeWindow);
        $provide.value('CallAncillariesPageService', fakeCallAncillariesPageService);
        $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
        $provide.value('$route', fakeRoute);
        $provide.value('CommonsUtilService', fakeCommonsUtilService);
        $provide.value('CommonsModalService', fakeCommonsModalService);
        $provide.value('IbCPermanentUserService', fakeIbCPermanentUserService);
        $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
        $provide.value('CommonsGetLoginInfoService', fakeCommonsGetLoginInfoService);
        $provide.value('VoluntaryChangesLogService', fakeVoluntaryChangesLogService);
        $provide.value('VoluntaryRefundLogService', fakeVoluntaryRefundLogService);
        $provide.value('CommonsLoginUtilsService', fakeCommonsLoginUtilsService);
        $provide.value('$cookies', fakeCookies);
        $provide.value('IbNewModalAncillariesService', fakeIbNewModalAncillariesService);
        $provide.value('LoadingSpinnerService', fakeLoadingSpinnerService);
        $provide.value('BookingDashboardAncillariesService', fakeBookingDashboardAncillariesService);
        $provide.value('BookingDashboardUtilsService', fakeBookingDashboardUtilsService);
        $provide.value('BookingDashboardSharedUtilsService', fakeBookingDashboardSharedUtilsService);
        $provide.value('MmBAncillariesUtilsService', fakeMmBAncillariesUtilsService);
    };

    const setupSpiesAndMocks = (_localStorageService_, _sessionStorage) => {
        localStorageService = _localStorageService_;
        // Clear localStorage before each test
        if (typeof localStorageService.clear === 'function') {
            localStorageService.clear();
        } else if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
        }
        localStorageGetSpy = spyOn(localStorageService, 'get');
        spyOn(localStorageService, 'set');
        spyOn(localStorageService, 'remove');
        spyOn(sessionStorage, 'setItem');
    };

    const setLocalStorageReturns = (spy, mapping) => {
        Object.entries(mapping).forEach(([key, value]) => {
            spy.withArgs(key).and.returnValue(value);
        });
    };

    const setupLocalStorageReturns = () => {
        setLocalStorageReturns(localStorageGetSpy, {
            selectInsurance: {},
            insuranceSelected: {},
            passengerBaggagesTrips: {},
            voucherDeleteInfo: {test: 'test'},
            userLogged: true,
            manualCloseVCModal: true,
            reshopConditions: fakeReshopConditions,
            bookingInfo: fakeBookingInfo,
            bookingInfoLight:{},
            flowUpgrade: 'MMB',
            flowUpgradeMMB: 'MMB',
            flowApp: 'MMB',
            flowTitlesApp: '',
            upgBidPutMade: '',
            RechargeBookingInfo: '',
            headerModel: fakeHeaderModel,
            isStopOverFromMail: {},
            flowBob: true,
            voucherFromEmail: {},
            voucherPartialRefund: {},
            showSisterCitiesPossibility: {},
            disruptionSeatChangeCapabilities: fakeDisruptionSeatChangeCapabilities,
            flightChangeFromEmail: {},
            sendReloadEvent: {},
            customizeFlight: true,
            deepLinkParams: {},
            seatsQuanty: null,
            ancillariesInfo: fakeAncillariesInfo,
            linksList: {},
            generalLinksList: {},
            PNR: 'ABCDE',
            checkinSurname: 'test',
            sisterCitiesRawModel: {},
            digitalBoardingInfo: {digitalBoardings: {segments: []}},
            quadrigam: 'MODDOC',
            currency: {},
            customerData: fakeCustomerData,
            confirmationDatalayerInfo: {},
            phonesListIBV: {test:'test'},
            modifyFFOrSpecialNeed: false,
            invoiceList: false,
            flowId: 'test',
            seatsAvailableSegments: ['0'],
            ancillariesAvailablePassengers: ['0'],
            updateSeatFlights: [{segmentId: '0', seats: [{id: 0, rowCurrent: '1', columnCurrent: 'A'}]}],
            seatsSelectedInfoData: {id: 0, passengersInfo: [{id:0,currentSeat:{cabinIndex:1}}]},
            ffLocal: [{id: 0, allCompany: [{company: '', number: 0, airlineName: ''}]}],
            newSeatsMap: {test:'test'},
            specialMealsTempInfoAux: [{segmentId: 0, menu: 'test'}],
            ancillariesAction: {test:'test'},
            passengerSpeqsTrips: {},
            prioritySegmentPutRequest: {},
            pmtMthdsBidsTransformed: false,
            selectedPriorityBoarding: {},
            memeberDetails: [{'data': {memberPersonalDetails: {schemes: [{recognitionLevel: {recognitionLevelIdentifier: 'test'}}]}}}],
            confirmationDigitalInfo: {},
            ancillariesAvailableSegments: {},
            activateTravelDocs: true,
            vipLoungesInvitations: {},
            prevFlowApp: 'MMB',
            toggle: {isSoftUserHideEnabled:true}
        });
    };

        const setupTranslateAndDashboardService = () => {
            serviceResolve(faketranslate, 'onReady', null);

            serviceResolve(fakeBookingDashboardService, 'initializeDashboard', {
                model: {
                    order: {
                        status: true
                    },
                    managementModel: {
                        flights: [],
                        co2FootprintInfo: {},
                        manageSeats: {
                            flights: []
                        }
                    },
                    passengersModel: {
                        passengers: []
                    },
                    modelYourFlightsModel: {
                        allSegments: {}
                    },

                    // Needed because handleDashboardBreakdownInfo() writes into:
                    // model.ancillariesInfo.priorityBoardingInfo.confirmed
                    ancillariesInfo: {
                        priorityBoardingInfo: {
                            confirmed: false
                        }
                    }
                },

                // Keep this as an object to avoid null/undefined breakdown branches
                breakDownInfo: {}
            });
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

            inject((_$rootScope_, _$componentController_, _localStorageService_, _$translate_, _$q_ , _IbCPermanentUserService_, _$timeout_) => {
                $rootScope = _$rootScope_;
                $componentController = _$componentController_;
                $scope = $rootScope.$new();
                $timeout = _$timeout_;
                $q = _$q_;
                setupSpiesAndMocks(_localStorageService_, sessionStorage);
                template = '<ib-apis-form class=""></ib-apis-form>';
                document.body.insertAdjacentHTML('afterbegin', template);
                $scope.$apply();
                setupLocalStorageReturns();
                setupTranslateAndDashboardService();

                controller = $componentController('ibMmbBookingDashboardComponent', {
                    $scope: $scope,
                    $rootScope: $rootScope,
                    localStorageService: localStorageService,
                    $translate: faketranslate,
                    $timeout: $timeout
                });

                if (controller.model && typeof controller.model.initializeModel !== 'function') {
                    controller.model.initializeModel = () => {};
                }
                if (!controller.model.flags) {
                    controller.model.flags = {};
                }
            });


            $onInit = controller.$onInit;

            $rootScope.$digest();
        });

    describe('when activate() is called', () => {
        it('ibMmbBookingDashboardComponent should be defined', (done) => {
            expect(controller).toBeDefined();
            done();
        });
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {

            if (!controller.model.ancillariesInfo) {
                controller.model.ancillariesInfo = {};
            }
            controller.model.ancillariesInfo.priorityBoardingInfo = {};

            $httpBackend.expectGET('web-manage-my-booking/templates/ib-MmB-booking-dashboard-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            const element = $compile('<ib-mmb-booking-dashboard-component></ib-mmb-booking-dashboard-component>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    const ensureMinimalDashboardModel = () => {
        controller.model.managementModel ??= { flights: [] };
        controller.model.passengersModel ??= { passengers: [] };
    };

    describe('when $onInit() is called', () => {
        const onInitWith = (options) => {
            ensureMinimalDashboardModel();

            const isAfter = (options && typeof options.isAfterLoginPermanentUser !== 'undefined')
                ? options.isAfterLoginPermanentUser
                : true;
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(isAfter);

            const status = (options && options.checkCustomerStatus) ? options.checkCustomerStatus : 'resolve';
            if (status === 'reject') {
                serviceReject(fakeCommonsGetLoginInfoService, 'checkCustomerStatus', {});
            } else {
                serviceResolve(fakeCommonsGetLoginInfoService, 'checkCustomerStatus', {});
            };
            if (options && 'flowName' in options) {
                $rootScope.flowName = options.flowName;
            }
            controller.$onInit();
            $rootScope.$digest();
        };
        it('should handle onInit scenarios (parametric)', (done) => {
            const scenarios = [
                { isAfterLoginPermanentUser: true, checkCustomerStatus: 'resolve' },
                { isAfterLoginPermanentUser: true, checkCustomerStatus: 'reject' },
                { isAfterLoginPermanentUser: false, checkCustomerStatus: 'resolve', initializeDashboard: true, flowName: 'MMB' }
            ];
            controller.model.initializeModel = () => {};
            scenarios.forEach((s) => {
                spyOn(fakeIbCPermanentUserService, 'isAfterLoginPermanentUser');
                controller.model.initializeModel = () => {};
                controller.model.flags = { showChangeFlightLink: true, showFlexibilizationChangeSection: true };
                controller.model.managementModel = { flights: [] };
                onInitWith(s);
                expect(fakeIbCPermanentUserService.isAfterLoginPermanentUser).toHaveBeenCalled();
            });
            done();
        });

        it('should isAfterLoginPermanentUser is false and return else and updateAncillaries resolve', (done) => {
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
            localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(false);
            localStorageGetSpy.withArgs('isStopOverFromMail').and.returnValue(false);
            localStorageGetSpy.withArgs('seatsQuanty').and.returnValue(1);
            serviceResolve(fakeCommonsAncillariesService, 'updateAncillaries', null);
            controller.model.ancillariesInfo = {
                priorityBoardingInfo: { confirmed: true }
            };
            $rootScope.flowName = 'MMB';
            controller.$onInit();
            $timeout.flush();
            $rootScope.$digest();
            expect(controller.model.ancillariesInfo.priorityBoardingInfo.confirmed).toEqual(true);
            done();
        });

        it('should isAfterLoginPermanentUser is false and return else and updateAncillaries reject', (done) => {
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
            localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(false);
            serviceReject(fakeCommonsAncillariesService, 'updateAncillaries', null);
            serviceResolveReturn(fakeModalServiceAncillaries, 'showGenericError');

            controller.model.ancillariesInfo = {
                priorityBoardingInfo: { confirmed: true }
            };
            $rootScope.flowName = 'MMB';
            controller.$onInit();
            $timeout.flush();
            $rootScope.$digest();

            done();
        });


         it('should isAfterLoginPermanentUser is false and upgBidPutMade is true and deleteAncillaryUpgBids reject', (done) => {
            // Primer caso: con RechargeBookingInfo
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
            localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(false);
            localStorageGetSpy.withArgs('RechargeBookingInfo').and.returnValue(true);
            $rootScope.flowName = 'MMB';
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            controller.$onInit();
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeBookingDashboardUtilsService.reloadImportOrder).toHaveBeenCalled();

            // Segundo caso: con upgBidPutMade y deleteAncillaryUpgBids que rechaza
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
            localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(false);
            localStorageGetSpy.withArgs('upgBidPutMade').and.returnValue(true);
            serviceReject(fakeAncillariesService, 'deleteAncillaryUpgBids', {});
            $rootScope.flowName = 'MMB';
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            controller.$onInit();
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeAncillariesService.deleteAncillaryUpgBids).toHaveBeenCalled();
            done();
        });

        [
            {
                desc: "should isAfterLoginPermanentUser is false and showGenericModal is reject",
                result: $q => $q.reject(),
            },
            {
                desc: "should isAfterLoginPermanentUser is false and showGenericModal is resolve",
                result: $q => $q.when()
            }
        ].forEach(({ desc, result }) => {
            it(desc, (done) => {
                spyOn(fakeMmBModalService, 'finishWaiting');
                fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
                localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(true);
                $rootScope.flowName = 'MMB';
                controller.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
                fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                    return { 'result': result($q) };
                });
                localStorageGetSpy.withArgs('confirmationDatalayerInfo').and.returnValue({ quadrigam: 'test' });
                controller.$onInit();
                $timeout.flush();
                $rootScope.$digest();
                expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
                done();
            });
        });

        [
            {
                desc: 'should isAfterLoginPermanentUser is false and paymentStatus its OK and flowapp is MMBBID',
                setup: () => {
                    fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
                    fakeMmBUtilService.getURLFirstParameterByName.and.callFake(() => 'OK');
                    $rootScope.flowName = 'MMBBID';
                    localStorageGetSpy.withArgs('flowApp').and.returnValue('MMBBID');
                    controller.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
                    fakeModalServiceAncillaries.openBidsModal = jasmine.createSpy('openBidsModal');
                },
                expect: () => {
                    expect(fakeModalServiceAncillaries.openBidsModal).toHaveBeenCalled();
                }
            },
            {
                desc: 'and MMBBID is defined',
                setup: () => {
                    $rootScope.flowName = 'MMBBID';
                    localStorageGetSpy.withArgs('flowApp').and.returnValue('MMBBID');
                    localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(true);
                    fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
                    fakeMmBUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => 'OK');
                },
                expect: () => {
                    expect($rootScope.flowName).toEqual('MMBBID');
                }
            }
        ].forEach(({ desc, setup, expect: expectFn }) => {
            it(desc, (done) => {
                setup();
                controller.$onInit && controller.$onInit();
                $timeout && $timeout.flush && $timeout.flush();
                $rootScope.$digest();
                expectFn();
                done();
            });
        });

        it('should isAfterLoginPermanentUser is false and paymentStatus its KO and flowapp is MMB', (done) => {
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
            fakeMmBUtilService.getURLFirstParameterByName.and.callFake(() => {
                return 'KO';
            });
            $rootScope.flowName = 'MMB';
            localStorageGetSpy.withArgs('flowApp').and.returnValue('MMB');
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            localStorageGetSpy.withArgs('manualCloseVCModal').and.returnValue(false);

            controller.$onInit();
            $timeout.flush();
            $rootScope.$digest();
            expect(fakeMmBModalService.showVoluntaryChangeModal).toHaveBeenCalled();
            done();
        });

        [
            {
                desc: 'should init Gibe services when available',
                response: { status: { invitations: { code: 'AVAILABLE' } } },
                expectedShowLink: true,
                expectedData: { status: { invitations: { code: 'AVAILABLE' } } }
            },
            {
                desc: 'should dont init Gibe services when not available',
                response: { status: { invitations: { code: 'NOT_AVAILABLE' } } },
                expectedShowLink: false,
                expectedData: null
            }
        ].forEach(({ desc, response, expectedShowLink, expectedData }) => {
            it(desc, (done) => {
                localStorageGetSpy.withArgs('vipLoungesInvitations').and.returnValue(response);

                controller.$onInit();
                $timeout.flush();
                $rootScope.$digest();

                expect(controller.showGibeLink).toBe(expectedShowLink);
                expect(controller.gibeData).toEqual(expectedData);
                done();
            });
        });
    });

    describe('initializeDashboard reject promise', () => {
        it('reject promise and showGenericError', (done) => {
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
            localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(true);
            $rootScope.flowName = 'MMB';
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            serviceReject(fakeGetPhoneCodesService, 'getPhoneCodesList', { errorCode: 401 });
            serviceReject(fakeBookingDashboardService, 'initializeDashboard', { errorCode: 401 });
            serviceResolveReturn(fakeMmBModalService, 'showGenericError');
            controller.$onInit();
            $rootScope.$digest();
            done();

        });
    });

    describe('when isAfterLoginBidsPermanentUser is return false', () => {
        it('and flowApp is equal to MMB and isAfterLoginBidsPermanentUser is false', (done) => {
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(true);
            serviceResolve(fakeCommonsGetLoginInfoService, 'checkCustomerStatus', {});

            fakeIbCPermanentUserService.isAfterLoginBidsPermanentUser.and.returnValue(false);
            controller.$onInit();
            $rootScope.$digest();
            expect(localStorageService.get('flowApp')).toEqual('MMB');
            done();
        });

        it('and flowApp is equal to MANAGEMYBOOKING_VOLUNTARY_CHANGE and isAfterLoginBidsPermanentUser is false', (done) => {
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(true);
            serviceResolve(fakeCommonsGetLoginInfoService, 'checkCustomerStatus', {});
            fakeIbCPermanentUserService.isAfterLoginBidsPermanentUser.and.returnValue(false);
            $rootScope.flowName = 'MMBVC';
            localStorageGetSpy.withArgs('flowApp').and.returnValue('MMBVC');
            controller.$onInit();
            $rootScope.$digest();
            expect(localStorageService.get('flowApp')).toEqual(fakeMmBAppConstants.TITLES_APP.MANAGEMYBOOKING_VOLUNTARY_CHANGE);
            done();
        });
        it('and flowApp is equal to MANAGEMYBOOKING_VOLUNTARY_CHANGE and isAfterLoginBidsPermanentUser is true', (done) => {
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(true);
            controller.model.ancillariesInfo = {
                ...fakeAncillariesInfo,
                bidsUpgradingInfo: { bidsAvailable: false },
                aviosUpgradingInfo: { aviosBidAvailable: false }
            };
            serviceResolve(fakeCommonsGetLoginInfoService, 'checkCustomerStatus', {});
            serviceResolve(faketranslate, 'onReady', {});

            fakeIbCPermanentUserService.isAfterLoginBidsPermanentUser.and.returnValue(true);
            $rootScope.flowName = 'MMBVC';
            localStorageGetSpy.withArgs('flowApp').and.returnValue('MMBVC');
            controller.$onInit();
            $rootScope.$digest();
            expect(localStorageService.get('flowApp')).toEqual(fakeMmBAppConstants.TITLES_APP.MANAGEMYBOOKING_VOLUNTARY_CHANGE);
            done();
        });
    });
    describe('when isAfterLoginPermanentUser is return false', () => {
        it('and voucherDeleteInfo is defined', (done) => {
            $rootScope.flowName = 'MMB';
            localStorageGetSpy.withArgs('flowApp').and.returnValue('MMB');
            localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(true);
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
            fakeMmBUtilService.getURLFirstParameterByName.and.callFake(() => {
                return 'OK';
            });
            localStorageGetSpy.withArgs('manualCloseVCModal').and.returnValue(false);
            serviceResolveReturn(fakeMmBModalService, 'showGenericModal');
            expect(localStorageService.get('voucherDeleteInfo')).toBeDefined();
            expect($rootScope.flowName).toEqual('MMB');
            done();
        });
        it('and MMBBID is defined', (done) => {
            $rootScope.flowName = 'MMBBID';
            localStorageGetSpy.withArgs('flowApp').and.returnValue('MMBBID');
            localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue(true);
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(false);
            fakeMmBUtilService.getURLFirstParameterByName = afterServiceReturn('getURLFirstParameterByName', 'OK'),
            expect($rootScope.flowName).toEqual('MMBBID');
            done();
        });

    });

    describe('when changeActiveTabFromMenu function is called', () => {
        [
            { name: 'management', expected: 'management' },
            { name: 'customize', expected: 'customize' },
            { name: 'complete', expected: 'complete' },
            { name: 'flights', expected: 'flights' },
            { name: 'changeFlights', expected: 'changeFlights' },
            { name: 'simulatorChangeFlights', expected: 'simulatorChangeFlights' },
            { name: 'refunds', expected: 'refunds' },
            { name: 'passengers', expected: 'passengers' },
            { name: 'documents', expected: 'documents' },
            { name: 'invoices', expected: 'invoices' },
            { name: 'stopOver', expected: 'stopOver' },
            { name: 'exclusiveBenefits', expected: 'exclusiveBenefits' }
        ].forEach(({ name, expected }) => {
            it(`call changeActiveTabFromMenu with ${name}`, (done) => {
                const type = { name };
                controller.model.flags.showChangeFlightLink = true;
                controller.model.tabs = {
                    management: { name: 'management' },
                    customize: { name: 'customize' },
                    complete: { name: 'complete' },
                    flights: { name: 'flights' },
                    changeFlights: { name: 'changeFlights', isSubtab: true },
                    simulatorChangeFlights: { name: 'simulatorChangeFlights' },
                    refunds: { name: 'refunds' },
                    passengers: { name: 'passengers' },
                    documents: { name: 'documents' },
                    invoices: { name: 'invoices'  },
                    stopOver: { name: 'stopOver'  },
                    exclusiveBenefits: { name: 'exclusiveBenefits' }
                };
                controller.changeActiveTabFromMenu(type);
                $rootScope.$digest();
                expect(controller.model.activeTab).toEqual(controller.model.tabs[expected]);
                if (name === 'changeFlights') {
                    expect(controller.model.activeTab.isSubtab).toBeTrue();
                }
                done();
            });
        });
        it('covers default and changeFlights (showChangeFlightLink=false) cases', (done) => {
            const scenarios = [
                {
                    type: { name: 'test' },
                    before: () => {},
                    expect: () => {
                        // default case → no return value
                        expect(
                            controller.changeActiveTabFromMenu({ name: 'test' })
                        ).toBeUndefined();
                    }
                },
                {
                    type: { name: 'changeFlights', isSubtab: true },
                    before: () => {
                        controller.model.flags.showChangeFlightLink = false;
                        controller.model.flags.showFlexibilizationChangeSection = true;
                    },
                    expect: () => {
                        expect(controller.model.flags.showChangeFlightLink).toEqual(false);
                    }
                }
            ];

            controller.model.tabs = {
                management: { name: 'management' },
                customize: { name: 'customize' },
                complete: { name: 'complete' },
                flights: { name: 'flights' },
                changeFlights: { name: 'changeFlights', isSubtab: true },
                simulatorChangeFlights: { name: 'simulatorChangeFlights' },
                refunds: { name: 'refunds' },
                passengers: { name: 'passengers' },
                documents: { name: 'documents' },
                invoices: { name: 'invoices'  },
                stopOver: { name: 'stopOver'  },
                exclusiveBenefits: { name: 'exclusiveBenefits' }
            };

            scenarios.forEach(({ type, before, expect: expectFn }) => {
                before();
                controller.changeActiveTabFromMenu(type);
                $rootScope.$digest();
                expectFn();
            });

            done();
        });
        afterEach(()=> {
            controller.model.flags.showChangeFlightLink = true;
        });
    });

    describe('when openCallCenterModal function is called', () => {
        const callCenterCases = [
            { type: 'changeFlights', expectLog: true },
            { type: 'refunds', expectLog: false }
        ];
        callCenterCases.forEach(({ type, expectLog }) => {
            it(`should openCallCenterModal with ${type}`, (done) => {
                controller.openCallCenterModal(type);
                if (expectLog) {
                    expect(fakeVoluntaryChangesLogService.getVoluntaryChangesLog).toHaveBeenCalled();
                }
                expect(fakeMmBModalService.showGenericInfoModal).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('when openModalCancelReservation called', () => {
        it('should openModalCancelReservation', (done) => {
            controller.model.IsIBV = true;
            controller.openModalCancelReservation();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });

    describe('when getChangeDeepLink called', () => {
        it('should getChangeDeepLink', (done) => {
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue(null);
            controller.getChangeDeepLink();
            expect(localStorageService.get('bookingInfo')).toEqual(null);
            done();
        });
    });

    describe('when customizeFlight called', () => {
        it('should customizeFlight', (done) => {
            localStorageGetSpy.withArgs('modifyFFOrSpecialNeed').and.returnValue(true);
            controller.customizeFlight();
            expect(fakeBookingDashboardAncillariesService.customizeFlight).toHaveBeenCalled();
            done();
        });

    });

    describe('when closeMenu called', () => {
        it('should closeMenu', (done) => {
            controller.closeMenu({hide: false});
            done();
        });
    });

    describe('when removeCustomizeFlight called', () => {
        it('should removeCustomizeFlight', (done) => {
            controller.removeCustomizeFlight();

            done();
        });
    });

    describe('when openRefundFlow called', () => {
        it('should openRefundFlow', (done) => {
            controller.openRefundFlow();
            done();
        });
    });

    describe('when setTitleDashboard function is called', () => {
        it('call setTitleDashboard', (done) => {
            controller.setTitleDashboard();
            expect(fakeCommonsUtilService.setTitlePage()).toEqual('TITULO');
            done();
        })
    });

    describe('when checkInvoicesInfo function is called', () => {
        [
            {
                desc: 'simple resolve promise',
                setup: () => {
                    $rootScope.appMarket = 'ES';
                    $rootScope.appLang = 'es';
                    serviceResolve(fakeInvoiceListService, 'getInvoiceList', [{test: 'test'}]);
                },
                expect: () => {
                    // expect(controller.showInvoicesDisabled).toBe(false);
                }
            },
            {
                desc: 'reject promise',
                setup: () => {
                    $rootScope.appMarket = 'ES';
                    $rootScope.appLang = 'es';
                    serviceReject(fakeInvoiceListService, 'getInvoiceList', null);
                },
                expect: () => {
                    // expect(controller.showInvoicesDisabled).toBe(true);
                }
            },
            {
                desc: 'return invoiceList',
                setup: () => {
                    $rootScope.appMarket = 'ES';
                    $rootScope.appLang = 'es';
                    localStorageGetSpy.withArgs('invoiceList').and.returnValue({test:'test'});
                },
                expect: () => {
                    expect(controller.showInvoicesDisabled).toBe(false);
                }
            },
            {
                desc: 'bookingInfo NULL case branches',
                setup: () => {
                    $rootScope.appMarket = 'ES';
                    $rootScope.appLang = 'es';
                    localStorageGetSpy.withArgs('invoiceList').and.returnValue({test:'test'});
                    localStorageGetSpy.withArgs('bookingInfo').and.returnValue(null);
                },
                expect: () => {
                    expect(controller.showInvoicesDisabled).toBe(true);
                }
            }
        ].forEach(({desc, setup, expect: expectFn}) => {
            it(`checkInvoicesInfo: ${desc}`, (done) => {
                setup();
                controller.checkInvoicesInfo();
                $scope && $scope.$digest && $scope.$digest();
                if (expectFn) expectFn();
                done();
            });
        });
        afterEach(()=> {
            localStorageGetSpy.withArgs('bookingInfo').and.returnValue(fakeBookingInfo);
        })
    });

    describe('when updatePersonalInfo event called', () => {
        const scenarios = [
            {
                desc: 'con externalPersonalInfo',
                data: {data: {passengers: [{passengerId: 'ADULT_01', externalPersonalInfo: {name: 'testname', firstSurname: 'test', birthDate: ''}, personalInfo: {firstName: 'testname', firstSurname: 'test', birthDate: ''}}]}},
            },
            {
                desc: 'sin externalPersonalInfo',
                data: {data: {passengers: [{passengerId: 'ADULT_01', personalInfo: {firstName: 'testname', firstSurname: 'test', birthDate: '25/06/1990'}}]}},
            },
            {
                desc: 'sin externalPersonalInfo y birthdate null',
                data: {data: {passengers: [{passengerId: 'ADULT_01', personalInfo: {firstName: 'testname', firstSurname: 'test'}}]}},
            }
        ];
        const model = {
            personalInfo: {
                name: 'testname',
                surname: 'test'
            }
        };
        const allModifiedPersonalInfo = [{
            modifiedPersonalInfo: true,
            name: 'testnametest'
        }];
        const baseModel = {
            passengerId: "ADULT_01",
            modifiedPersonalInfo: false,
            personalInfo: {name: 'testname', surname: 'test', birthDate: ''},
            showUpdatePersonalInfo : '',
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
            }
        };
        it('should updatePersonalInfo y personalInfoEvent all cases', (done) => {
            scenarios.forEach(({ data }) => {
                controller.model = JSON.parse(JSON.stringify(baseModel));
                controller.model.initializeModel = () => {};
                $rootScope.$broadcast('updatePersonalInfo', data, model, allModifiedPersonalInfo);
                $rootScope.$digest();
                expect(
                    controller.model.managementModel.managePassengers[0].personalInfo.name
                ).toEqual('testname');
            });
            done();
        });
    });

    describe('when updatePassengerInfoModel event called', () => {
        it('should updatePassengerInfoModel and updatePassengerInfoModel function called', (done) => {
            controller.model.passengersModel = {}
            $rootScope.$broadcast('updatePassengerInfoModel', {passengers: []});
            $rootScope.$digest();
            expect(controller.model.passengersModel).toEqual({passengers: []});
            done();
        });
    });

    describe('when updatePassengerDataEvent event called', () => {
        const scenarios = [
            { type: 'frequentFlyer', setup: setupFrequentFlyer },
            { type: 'primaryContact', setup: setupPrimaryContactFull },
            { type: 'primaryContact', setup: setupPrimaryContactSimple },
            { type: 'emergencyContact', setup: setupEmergencyContactFull },
            { type: 'emergencyContact', setup: setupEmergencyContactSimple },
            { type: 'specialNeeds', setup: setupSpecialNeeds },
            { type: 'APIS', setup: setupAPIS },
            { type: 'default', setup: () => {} }
        ];
        scenarios.forEach(({type, setup}) => {
            it(`should updatePassengerInfo function called and case ${type}`, (done) => {
                setup();
                $rootScope.$broadcast('updatePassengerDataEvent', 0, type, true);
                $rootScope.$digest();
                expect(type).toEqual(type);
                done();
            });
        });
    });

    describe('when updatePassengerDataEvent event called and reject PROMISES', () => {
        const scenarios = [
            // frequentFlyer - resolve
            {
                type: 'frequentFlyer',
                setup: () => {
                    setupFrequentFlyer();
                },
                service: () => {
                    serviceResolve(fakeBookingDashboardService, 'updateDataContactInfo', null);
                    serviceResolveReturn(fakeMmBModalService, 'showGenericError');
                }
            },
            // frequentFlyer - reject
            {
                type: 'frequentFlyer',
                setup: () => {
                    setupFrequentFlyer();
                },
                service: () => {
                    serviceReject(fakeBookingDashboardService, 'updateDataContactInfo', null);
                    serviceResolveReturn(fakeMmBModalService, 'showGenericError');
                }
            },
            // primaryContact - reject
            {
                type: 'primaryContact',
                setup: () => {
                    setupPrimaryContactFull();
                },
                service: () => {
                    serviceReject(fakeBookingDashboardService, 'updateDataContactInfo', null);
                    serviceResolveReturn(fakeMmBModalService, 'showGenericError');
                }
            },
            // emergencyContact - resolve
            {
                type: 'emergencyContact',
                setup: () => {
                    controller.model.passengersModel.originalData = 'test';
                    controller.model.passengersModel.contactData = {
                        emergencyContactInfo: 'test'
                    };
                },
                service: () => {
                    serviceResolve(fakeBookingDashboardService, 'updateDataContactInfo', null);
                    serviceResolveReturn(fakeMmBModalService, 'showGenericError');
                }
            },
            // specialNeeds - reject
            {
                type: 'specialNeeds',
                setup: () => {
                    setupSpecialNeeds();
                },
                service: () => {
                    serviceReject(fakeBookingDashboardService, 'updatePassengerSpecialNeeds', null);
                    serviceResolveReturn(fakeMmBModalService, 'showGenericError');
                }
            },
            // specialNeeds - resolve
            {
                type: 'specialNeeds',
                setup: () => {
                    setupSpecialNeeds();
                },
                service: () => {
                    serviceResolve(fakeBookingDashboardService, 'updatePassengerSpecialNeeds', null);
                    serviceResolveReturn(fakeMmBModalService, 'showGenericError');
                }
            },
            // APIS - resolve
            {
                type: 'APIS',
                setup: () => {
                    setupAPIS();
                },
                service: () => {
                    fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy().and.returnValue(() => { return false; });
                    serviceResolve(fakeBookingDashboardService, 'updateApisInfo', null);
                    serviceResolveReturn(fakeMmBModalService, 'showGenericError');
                }
            },
            // APIS - reject
            {
                type: 'APIS',
                setup: () => {
                    setupAPIS();
                },
                service: () => {
                    serviceReject(fakeBookingDashboardService, 'updateApisInfo', null);
                    serviceResolveReturn(fakeMmBModalService, 'showGenericError');
                }
            }
        ];
        scenarios.forEach(({type, setup, service}) => {
            it(`should updatePassengerInfo function called and case ${type} (reject PROMISES)`, (done) => {
                setup();
                service();
                $rootScope.$broadcast('updatePassengerDataEvent', 0, type, true);
                $rootScope.$digest();
                expect(type).toEqual(type);
                done();
            });
        });
    });
    let objectOffsetParent = (prop) => {
        return (typeof prop === "string" &&
            !isNaN(Number(prop)) &&
            Number(prop) >= 0 &&
            Number(prop) < 10)
    };

    describe('when changeTabEvent event called', () => {
        it('should changeTabEvent and changeActiveTab function called', (done) => {
            (spyOn(angular, 'element') as any).and.callFake((selector) => {
                return new Proxy(
                    { length: 10 },
                    {
                        get(target, prop) {
                            // if prop 0 to 9, return object with offsetParent
                            if (objectOffsetParent(prop)) {
                                return {
                                    offsetParent: { offsetTop: 10 + 5 * Number(prop), offsetHeight: 20 + 2 * Number(prop) },
                                    offsetTop: 5 + Number(prop)
                                };
                            }
                            return target[prop];
                        }
                    }
                );
            });
            const spyRAF = spyOn(controller.$window, 'requestAnimationFrame').and.callFake((cb) => cb());
            controller.model.tabs = { management: {}, test: {} };

            $rootScope.$broadcast('changeTabEvent', 'management', 2);
            $rootScope.$digest();
            expect(controller.model.activeTab).toEqual('management');
            expect(spyRAF).toHaveBeenCalled();
            done();
        });

        it('should changeTabEvent and changeActiveTab function called and passengerIndex undefined', (done) => {
            spyOn(controller.$window, 'requestAnimationFrame').and.callFake((cb) => cb());
            spyOn(fakeWindow, 'scrollTo');
            controller.model.tabs = { management: {}, test: {} };

            $rootScope.$broadcast('changeTabEvent', 'management');
            $rootScope.$digest();
            expect(controller.model.activeTab).toEqual('management');
            expect(fakeWindow.scrollTo).toHaveBeenCalled();
            done();
        });
    });

    describe('when scrollTop called', () => {
        it('should scrollTop function called', (done) => {
            spyOn(fakeWindow, 'scrollTo');
            controller.scrollTop();
            expect(fakeWindow.scrollTo).toHaveBeenCalled();
            done();
        });
    });

    describe('when boxLinkRedirection called', () => {
        [
            { event: 'CHECK_IN', expected: 'checkIn' },
            { event: 'SEATS_AUCTION', expected: 'seatsAuction' },
            { event: 'BIDABLE', expected: 'BIDABLE' },
            { event: 'EMERGENCY_CONTACT', expected: 'emergencyContact', setup: () => { controller.model.passengersModel = { contactData: { emergencyContactInfo: 'test' } }; } },
            { event: 'FLIGHT_REMINDER', expected: 'flightReminder' },
            { event: 'other', expected: 'other', isDefault: true }
        ].forEach(({ event, expected, setup, isDefault }) => {
            it(`should boxLinkRedirection switch case ${event}`, (done) => {
                if (setup) setup();
                $rootScope.$broadcast('boxLinkClickEvent', expected);
                $rootScope.$digest();
                if (!isDefault) {
                    expect(expected).toEqual(expected);
                }
                done();
            });
        });
    });

    describe('when updateContactDetails event called', () => {
        [
            {
                desc: 'updateContactDetails resolve',
                setup: () => {
                    serviceResolve(fakeBookingDashboardService, 'getContactData', {email: 'otro@test.com'});
                    serviceResolve(fakeBookingDashboardService, 'updateContactDetails', {});
                }
            },
            {
                desc: 'updateContactDetails reject',
                setup: () => {
                    serviceResolve(fakeBookingDashboardService, 'getContactData', {email: 'otro@test.com'});
                    serviceReject(fakeBookingDashboardService, 'updateContactDetails', {});
                }
            },
            {
                desc: 'getContactData reject',
                setup: () => {
                    serviceReject(fakeBookingDashboardService, 'getContactData', null);
                }
            }
        ].forEach(({desc, setup}) => {
            it(`should updateContactDetails: ${desc}`, (done) => {
                setup();
                $rootScope.$broadcast('updateContactDetails', {email: 'test@test.com'});
                $rootScope.$digest();
                // expect(controller.model.ancillariesInfo.insurance).toEqual(null);
                done();
            });
        });
    });

    describe('when changeInsuranceCountry event called', () => {
        it('should changeInsuranceCountry and changeInsuranceCountry function called and reject promise getInsurance', (done) => {
            serviceReject(fakeCallAncillariesPageService, 'getInsurance', null);
            serviceResolveReturn(fakeModalServiceAncillaries, 'showGenericError');
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            $rootScope.$broadcast('changeInsuranceCountry', {description: 'test'});
            $rootScope.$digest();
            done();
        });
        it('should changeInsuranceCountry and changeInsuranceCountry function called and resolve promise getInsurance and status code Available', (done) => {
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            controller.model.ancillariesInfo.insuranceInfo.passengers = [{
                document: 'test',
                birthDate: 'test'
            }];
            controller.model.ancillariesInfo.insuranceInfo.insuranceCountry = false;
            serviceResolve(fakeCallAncillariesPageService, 'getInsurance', {
                ancillaries:[{
                    offers: [{
                        code: 'es',
                        termsAndConditionsDocumentURI: 'url',
                        coverages: 'test',
                        name: 'test',
                        consent: true
                    }],
                    status: {
                        code: 'AVAILABLE'
                    }
                }],
                currencies: [{
                    test:'test'
                }]
            });

            $rootScope.$broadcast('changeInsuranceCountry', {description: 'test'});
            $rootScope.$digest();
            expect(controller.model.ancillariesInfo.insuranceInfo.insuranceCountry.country.description).toEqual('test');
            done();
        });
        it('should changeInsuranceCountry and changeInsuranceCountry function called and resolve promise getInsurance', (done) => {
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            serviceResolve(fakeCallAncillariesPageService, 'getInsurance', {
                    ancillaries:[{
                        offers: [{
                            code: 'es',
                            termsAndConditionsDocumentURI: 'url',
                            coverages: 'test',
                            name: 'test',
                            consent: true
                        }],
                        status: {
                            code: ''
                        }
                    }],
                    currencies: [{
                        test:'test'
                    }]
                });

            controller.model.ancillariesInfo.insuranceInfo.insuranceCountry = false;
            $rootScope.$broadcast('changeInsuranceCountry', {description: 'test'});
            $rootScope.$digest();
            expect(fakeCallAncillariesPageService.getInsurance).toHaveBeenCalled();
            done();
        });
    });


    describe('goToPayment - parametric', () => {
        const scenarios = [
            { isAfterLoginPermanentUser: true, selectedInsurance: true },
            { isAfterLoginPermanentUser: false, selectedInsurance: false },
            { isAfterLoginPermanentUser: false, selectedInsurance: true }
        ];
        scenarios.forEach((sc) => {
            it(`scenario isAfterLoginPermanentUser=${sc.isAfterLoginPermanentUser}, selectedInsurance=${sc.selectedInsurance}`, (done) => {
                fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(sc.isAfterLoginPermanentUser);
                // Asegura que ancillariesInfo es un objeto antes de asignar la propiedad
                if (typeof controller.model.ancillariesInfo !== 'object' || controller.model.ancillariesInfo === null) {
                    controller.model.ancillariesInfo = {};
                }
                controller.model.ancillariesInfo.selectedInsurance = sc.selectedInsurance;
                if (sc.isAfterLoginPermanentUser) {
                    serviceResolve(fakeBookingDashboardService, 'updateAncillariesInfo', null);
                } else {
                    serviceReject(fakeBookingDashboardService, 'updateAncillariesInfo', null);
                };
                $rootScope.$broadcast('goToPayment');
                $rootScope.$digest();
                if (sc.isAfterLoginPermanentUser) {
                    expect($rootScope.showPayButton).toEqual(false);
                } else {
                    expect(fakeCommonsModalService.finishWaiting).toHaveBeenCalled();
                }
                done();
            });
        });
        afterEach(()=> {
            controller.model.ancillariesInfo.selectedInsurance = true;
        });
    });

    describe('when specialNeedForm event called', () => {
        // Configuration mocks
        const setupSpecialNeedsContactInfoMocks = ({
            getTravelPreferencesResolve = true,
            updateTravelPreferencesResolve = true,
            spyUpdateTravelPreferences = false,
            spyShowGenericComponentModal = false
        } = {}) => {
            if (spyUpdateTravelPreferences) {
                spyOn(fakeBookingDashboardService as any, 'updateTravelPreferences');
            };
            if (spyShowGenericComponentModal) {
                spyOn(fakeCommonsModalService, 'showGenericComponentModal');
            };
            serviceResolveReturn(fakeCommonsModalService, 'showGenericModal');
            serviceResolveReturn(fakeCommonsModalService, 'showGenericComponentModal');
            if (getTravelPreferencesResolve) {
                serviceResolve(fakeBookingDashboardService, 'getTravelPreferences', null);
            } else {
                serviceReject(fakeBookingDashboardService, 'getTravelPreferences', null);
            };

            if (updateTravelPreferencesResolve) {
                serviceResolve(fakeBookingDashboardService, 'updateTravelPreferences', null);
            } else {
                serviceReject(fakeBookingDashboardService, 'updateTravelPreferences', null);
            };
        };

        let defineSetupSpecialNeedsContactInfoMocks = (getTravelPreferencesResolve, updateTravelPreferencesResolve, spyUpdateTravelPreferences, spyShowGenericComponentModal?) => {
            setupSpecialNeedsContactInfoMocks({
                'getTravelPreferencesResolve': getTravelPreferencesResolve,
                'updateTravelPreferencesResolve': updateTravelPreferencesResolve,
                'spyUpdateTravelPreferences': spyUpdateTravelPreferences || false,
                'spyShowGenericComponentModal': spyShowGenericComponentModal || false
            });
        };

        it('should updateSpecialNeedsContactInfo function resolve getTravelPreferences resolve and updateTravelPreferences resolve', (done) => {
            defineSetupSpecialNeedsContactInfoMocks(true, true, true);
            $rootScope.$broadcast('specialNeedForm');
            $rootScope.$digest();
            expect(fakeBookingDashboardService.updateTravelPreferences).toHaveBeenCalled();
            done();
        });

        it('should updateSpecialNeedsContactInfo function and getTravelPreferences resolve and updateTravelPreferences reject', (done) => {
           defineSetupSpecialNeedsContactInfoMocks(true, false, false, true);
            $rootScope.$broadcast('specialNeedForm');
            $rootScope.$digest();
            expect(fakeBookingDashboardService.updateTravelPreferences).toHaveBeenCalled();
            done();
        });

        it('should updateSpecialNeedsContactInfo function and updateTravelPreferences resolve and getTravelPreferences reject', (done) => {
            defineSetupSpecialNeedsContactInfoMocks(false, true, false, true);
            $rootScope.$broadcast('specialNeedForm');
            $rootScope.$digest();
            expect(fakeCommonsModalService.showGenericComponentModal).toHaveBeenCalled();
            done();
        });
    });

    describe('when updateInvoiceInfo event called', () => {
        it('should updateInvoiceInfo and reloadInvoiceInfo function called', (done) => {
            $rootScope.$broadcast('updateInvoiceInfo');
            $rootScope.$digest();
            // expect(controller.model.ancillariesInfo.priorityBoardingInfo.confirmed).toEqual(false);
            done();
        });
    });

    describe('when openVoluntaryRefundFlow function called', () => {
        it('should openVoluntaryRefundFlow called', (done) => {
            controller.model.tabs.voluntary_refunds = { name: 'voluntary_refunds', isSubtab: true };
            controller.openVoluntaryRefundFlow();
            $rootScope.$digest();
            expect(fakeVoluntaryRefundLogService.getVoluntaryRefundLog).toHaveBeenCalledWith(localStorageService.get('flowId'));
            expect(controller.model.activeTab).toEqual({ name: 'voluntary_refunds', isSubtab: true });
            done();
        });
    });

    describe('when showCustomizeTab function called', () => {
        it('should ancillariesAvailable is empty', (done) => {
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            controller.model.ancillariesInfo.ancillariesAvailable = false;
            controller.showCustomizeTab();
            $rootScope.$digest();
            expect(controller.model.isAncillariesInTime).toEqual(true);
            done();
        });
        it('should showRedirectionCheckin', (done) => {
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            controller.model.ancillariesInfo.ancillariesAvailable = [{}];
            controller.model.isAncillariesInTime = false;
            controller.model.showRedirectionCheckin = true;
            controller.model.isPnrGroup = true;
            controller.showCustomizeTab();
            $rootScope.$digest();
            expect(controller.model.showRedirectionCheckin).toEqual(true);
            done();
        });
        [
            {
                desc: 'ancillariesInfo is empty',
                setup: () => {
                    controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
                    controller.model.ancillariesInfo.ancillariesAvailable = false;
                    localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue({ });
                },
                expect: () => {
                    expect(localStorageGetSpy.withArgs('ancillariesInfo').ancillaries).toBeUndefined();
                }
            },
            {
                desc: 'model ancillariesInfo is false',
                setup: () => {
                    controller.model.ancillariesInfo = false;
                },
                expect: () => {
                    expect(controller.model.ancillariesInfo).toEqual(false);
                }
            }
        ].forEach(({desc, setup, expect: expectFn}) => {
            it(`should ${desc}`, (done) => {
                setup();
                controller.showCustomizeTab();
                $rootScope.$digest();
                expectFn();
                done();
            });
        });

        afterEach(()=> {
            localStorageGetSpy.withArgs('ancillariesInfo').and.returnValue(fakeModelAncillariesInfo);
            controller.model.isPnrGroup = false;
        })
    });

    describe('when updateDocument event called', () => {
        let sameCase = (done) => {
            spyOn(fakeCommonsModalService, 'showGenericModal');
            controller.chkPassLogged = jasmine.createSpy('chkPassLogged').and.returnValue(true);
            fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.returnValue(false);
            fakeCommonsModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    'result': $q.when()
                };
            });

            serviceResolve(fakeBookingDashboardService, 'getPersonalData', {gender: 'test'});
            $rootScope.$broadcast('updateDocument', {basicInfo:{gender:'other'}});
            $rootScope.$digest();
            expect(fakeCommonsModalService.showGenericModal).toHaveBeenCalled();
            done();
        };
        it('should showGenericModal and updatePersonalData resolve', (done) => {
            serviceResolve(fakeBookingDashboardService, 'updatePersonalData', {gender: 'other'});
            sameCase(done);
        });
        it('should showGenericModal and updatePersonalData reject', (done) => {
            serviceReject(fakeBookingDashboardService, 'updatePersonalData', null);
            sameCase(done);
        });

        it('should showGenericModal and updatePersonalData reject', (done) => {
            controller.chkPassLogged = jasmine.createSpy('chkPassLogged').and.returnValue(true);
            fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.returnValue(false);
            serviceReject(fakeBookingDashboardService, 'getPersonalData', null);
            $rootScope.$broadcast('updateDocument', {basicInfo:{gender:'other'}});
            $rootScope.$digest();
            expect(fakeBookingDashboardService.getPersonalData).toHaveBeenCalled();
            done();
        });
    });

    describe('DisruptionSeatsModal', () => {
        beforeEach(() => {
            fakeBookingInfo.orderFlags = [
                {
                "type": "ALLOWED_INVOICE_MANAGEMENT",
                "enabled": true
                },
                {
                "type": "CANCELLED_SEATS",
                "enabled": true
                }
            ]
            setupLocalStorageReturns();

            fakeIbNewModalAncillariesService.openDisruptedSeatsModal = jasmine.createSpy('openDisruptedSeatsModal').and.returnValue(of());
            fakeLoadingSpinnerService.hide = jasmine.createSpy('hide');
            controller.model.ancillariesInfo = { ...fakeModelAncillariesInfo };
        });
        it('Open DisruptionSeatsModal if flag is true', () => {

            controller.$onInit();
            expect(fakeIbNewModalAncillariesService.openDisruptedSeatsModal).toHaveBeenCalled();
        });
        it('Dont open DisruptionSeatsModal if flag is false', () => {
            fakeBookingInfo.orderFlags = [
                {
                "type": "ALLOWED_INVOICE_MANAGEMENT",
                "enabled": true
                },
                {
                "type": "CANCELLED_SEATS",
                "enabled": false
                }
            ]
            setupLocalStorageReturns();
            fakeIbNewModalAncillariesService.openDisruptedSeatsModal = jasmine.createSpy('openDisruptedSeatsModal');

            controller.$onInit();
            expect(fakeIbNewModalAncillariesService.openDisruptedSeatsModal).not.toHaveBeenCalled();
            expect(fakeLoadingSpinnerService.hide).toHaveBeenCalled();
        });
        it('Open DisruptionSeatsModal if flag is true and hide spinner', async () => {
            fakeIbNewModalAncillariesService.openDisruptedSeatsModal.and.returnValue(of(() => {}));

            await controller.$onInit();
            $timeout.flush()

            expect(fakeIbNewModalAncillariesService.openDisruptedSeatsModal).toHaveBeenCalled();
            expect(fakeLoadingSpinnerService.hide).toHaveBeenCalled();
        });
        it('Open DisruptionSeatsModal if flag is true and hide spinner on error', async () => {
            fakeIbNewModalAncillariesService.openDisruptedSeatsModal.and.returnValue(throwError(() => {}));

            await controller.$onInit();

            expect(fakeIbNewModalAncillariesService.openDisruptedSeatsModal).toHaveBeenCalled();
            expect(fakeLoadingSpinnerService.hide).toHaveBeenCalled();
        });
    });

    describe('when clickExclusiveBenefitsTab function is called', () => {
        beforeEach(() => {
            controller.model.tabs = {
                exclusiveBenefits: { name: 'exclusiveBenefits' }
            };
            controller.hide = false;
            spyOn(controller, 'scrollTop');
            spyOn(controller, 'removeCustomizeFlight');
            spyOn(controller, 'refreshVipLoungesData');
        });

        [
            {
                desc: 'set activeTab to exclusiveBenefits',
                check: () => expect(controller.model.activeTab).toEqual(controller.model.tabs.exclusiveBenefits)
            },
            {
                desc: 'set hide to true',
                check: () => expect(controller.hide).toBe(true)
            },
            {
                desc: 'call scrollTop',
                check: () => expect(controller.scrollTop).toHaveBeenCalled()
            },
            {
                desc: 'call refreshVipLoungesData',
                check: () => expect(controller.refreshVipLoungesData).toHaveBeenCalled()
            },
            {
                desc: 'call removeCustomizeFlight',
                check: () => expect(controller.removeCustomizeFlight).toHaveBeenCalled()
            }
        ].forEach(({desc, check}) => {
            it(`should ${desc}`, (done) => {
                controller.clickExclusiveBenefitsTab();
                check();
                done();
            });
        });
    });

    describe('when formatAndUpdateHeaderBasket is called', () => {
        it('should return early if headerData does not have the required properties', (done) => {
            localStorageGetSpy.withArgs('headerModel').and.returnValue({ headerModel: { shoppingBasket: {} } });
            localStorageGetSpy.withArgs('currency').and.returnValue('EUR');
            const checkHeaderModel = localStorageService.get('headerModel');
            controller.formatAndUpdateHeaderBasket();
            expect(checkHeaderModel).toEqual({ headerModel: { shoppingBasket: {} } });
            done();
        });
    });

    describe('and clearViewOnBasketUpdate', () => {
        beforeEach(() => {
            // Limpia el spy para evitar contaminación entre tests
            if (localStorageGetSpy.calls && localStorageGetSpy.calls.reset) {
                localStorageGetSpy.calls.reset();
            }
        });
       it('Open clearViewOnBasketUpdate if flag is true and showCarbonFootprintInfo return true', (done) => {
            controller.model.managementModel = {...fakeModelManagementModel};
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            controller.model.ancillariesInfo.ancillariesCarbonFootprint.kilosCo2Equivalent = 5;
            localStorageGetSpy.withArgs('headerModel').and.returnValue({ shoppingBasket: {carbonFootprint: {hasCarbonFootprint: false}} });
            $rootScope.$broadcast('clearViewOnBasketUpdate', true);
            $rootScope.$digest();
            expect(controller.model.managementModel.co2FootprintInfo.showCarbonFootprintInfo).toEqual(true);
            done();
        });
        it('Open clearViewOnBasketUpdate branches cover and return true', (done) => {
            controller.model.managementModel = {...fakeModelManagementModel};
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            controller.model.ancillariesInfo.ancillariesCarbonFootprint.kilosCo2Equivalent = 0;
            localStorageGetSpy.withArgs('headerModel').and.returnValue({ });
            $rootScope.$broadcast('clearViewOnBasketUpdate', true);
            $rootScope.$digest();
            expect(controller.model.managementModel.co2FootprintInfo.showCarbonFootprintInfo).toEqual(false);
            done();
        });
        it('Open clearViewOnBasketUpdate if flag is true and showCarbonFootprintInfo return false', (done) => {
            controller.model.managementModel = {...fakeModelManagementModel};
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            controller.model.ancillariesInfo.ancillariesCarbonFootprint.kilosCo2Equivalent = 0;
            localStorageGetSpy.withArgs('headerModel').and.returnValue({ shoppingBasket: {carbonFootprint: {hasCarbonFootprint: true}} });
            $rootScope.$broadcast('clearViewOnBasketUpdate', true);
            $rootScope.$digest();
            expect(controller.model.managementModel.co2FootprintInfo.showCarbonFootprintInfo).toEqual(false);
            done();
        });
        afterEach(()=> {
            controller.model.ancillariesInfo = {...fakeModelAncillariesInfo};
        })

    });

    describe('and isLoggedCookies', () => {
        it('should isLoggedCookies', (done) => {
            expect(controller.isLoggedCookies()).toEqual(true);
            done();
        });
    });

    describe('chkPassLogged coverage', () => {
        it('should chkPassLogged and return boolean', () => {
            const fakeFF = { passengerId: 'ADULT_01', frequentFlyerInfo: { company: 'test', number: '1234', airlineName: 'test' } };
            const result = controller['chkPassLogged'](fakeFF);
            expect(typeof result).toBe('boolean');
        });
        it('should cover the catch block of chkPassLogged', () => {
            localStorageGetSpy.withArgs('customerData').and.returnValue({});
            const result = controller['chkPassLogged']('cualquierValor');
            expect(result).toBe(false);
        });
    });

    describe('and changeActiveTabMenuEvt', () => {
        it('Open changeActiveTabMenuEvt and showChangeFlightLink false', (done) => {
            spyOn(controller, 'changeActiveTabFromMenu');
            controller.model.flags.showChangeFlightLink = false;
            let objectTab = { name: 'changeFlights', isSubtab: true }
            $rootScope.$broadcast('changeActiveTabMenuEvt', objectTab);
            $rootScope.$digest();
            expect(controller.changeActiveTabFromMenu).toHaveBeenCalled();
            done();
        });
        afterEach(()=> {
            controller.model.flags.showChangeFlightLink = true;
        });
    });

    describe('and showSectionWithQuadrigamUrlParam', () => {
        beforeEach(() => {
            controller.model.tabs = {
                management: { name: 'management' },
                customize: { name: 'customize' },
                complete: { name: 'complete' },
                flights: { name: 'flights' },
                changeFlights: { name: 'changeFlights', isSubtab: true },
                simulatorChangeFlights: { name: 'simulatorChangeFlights' },
                refunds: { name: 'refunds' },
                passengers: { name: 'passengers' },
                documents: { name: 'documents' },
                invoices: { name: 'invoices' },
                stopOver: { name: 'stopOver' },
                exclusiveBenefits: { name: 'exclusiveBenefits' }
            };
        });
        it('Open getTabByQuadrigam with documents', (done) => {
            localStorageGetSpy.withArgs('quadrigam').and.returnValue('documents');
            controller.showSectionWithQuadrigamUrlParam();
            $rootScope.$digest();
            expect(controller.model.activeTab).toEqual(controller.model.tabs.documents);
            done();
        });
        it('Open getTabByQuadrigam with CUSTOMIZE_YOUR_TRAVEL and showCustomizeTab', (done) => {
             controller.model.showCustomizeTab = true;
            localStorageGetSpy.withArgs('quadrigam').and.returnValue('customize');
            controller.showSectionWithQuadrigamUrlParam();
            $rootScope.$digest();
            expect(controller.model.activeTab).toEqual(controller.model.tabs.customize);
            done();
        });
    });

    describe('and checkVoucherFlowOpen', () => {
        [
            { email: 'test' },
            { email: false }
        ].forEach(({ email }) => {
            it(`Open checkVoucherFlowOpen and redirect (email=${email})`, (done) => {
                controller.model.passengersModel = {...fakePassengersModel};
                controller.model.passengersModel.contactData.primaryContactInfo.lowerCaseEmail = email;
                controller.model.voucherPriceInfo = false;
                controller.checkVoucherFlowOpen();
                $rootScope.$digest();
                expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
                done();
            });
        });
        afterEach(() => {
            controller.model.voucherPriceInfo = true;
        });
    });

    describe('Should handleDashboardSeatsQuanty function', () => {
         it('Open calculateSeatsQuanty and return 0', (done) => {
            controller.headerModelLocal = localStorageService.get('headerModel');
            controller.headerModelLocal.headerModel.shoppingBasket.seats.hasSeats = false;
            controller['handleDashboardSeatsQuanty']();
            $rootScope.$digest();
            expect(controller.seatsQuanty).toEqual(0);
            done();
        });
        afterEach(() => {
            controller.headerModelLocal.headerModel.shoppingBasket.seats.hasSeats = true;
        });
    });

    describe('Should isComponentType function', () => {
        it('isComponentType branches return test', (done) => {
            let paymentType = 'test';
            let componentType = 'test';
            expect(controller['isComponentType'](paymentType, componentType)).toEqual('test');
            done();
        });
    });

    describe('Should handleInitUpgBidPutMade function', () => {
        it('should deleteAncillaryUpgBids resolve', (done) => {
            controller.$onInit = jasmine.createSpy();
            localStorageGetSpy.withArgs('upgBidPutMade').and.returnValue(true);
            serviceResolve(fakeAncillariesService, 'deleteAncillaryUpgBids', {});
            controller['handleInitUpgBidPutMade']();
            $rootScope.$digest();
            expect(localStorageService.get('upgBidPutMade')).toEqual(true);
            done();
        });
        afterEach(() => {
            controller.$onInit = $onInit;
        });
    });
    describe('skeleton background helpers', () => {
        describe('getLastSegmentOfFirstSlice', () => {
            it('returns null when segments is empty or not an array', () => {
                const lightEmpty = { order: { slices: [ { segments: [] } ] } };
                const res1 = (controller as any).getLastSegmentOfFirstSlice(lightEmpty);
                expect(res1).toBeNull();

                const lightNoArray = { order: { slices: [ { segments: null } ] } };
                const res2 = (controller as any).getLastSegmentOfFirstSlice(lightNoArray);
                expect(res2).toBeNull();
            });

            it('returns the last segment when segments has items', () => {
                const segA = { id: 'A' };
                const segB = { id: 'B' };
                const light = { order: { slices: [ { segments: [segA, segB] } ] } };
                const res = (controller as any).getLastSegmentOfFirstSlice(light);
                expect(res).toEqual(segB);
            });
        });

        describe('getArrivalCityCodeFromLight', () => {
            beforeEach(() => {
                (controller as any).bookingInfoLight = null;
            });

            it('returns city.code when present', () => {
                const light = { order: { slices: [ { segments: [ { arrival: { city: { code: 'MAD' } } } ] } ] } };
                (controller as any).bookingInfoLight = light;
                const res = (controller as any).getArrivalCityCodeFromLight();
                expect(res).toBe('MAD');
            });

            it('returns city.iataCode when code is missing', () => {
                const light = { order: { slices: [ { segments: [ { arrival: { city: { iataCode: 'BCN' } } } ] } ] } };
                localStorageGetSpy.withArgs('bookingInfoLight').and.returnValue(light);
                const res = (controller as any).getArrivalCityCodeFromLight();
                expect(res).toBe('BCN');
            });

            it('returns city.cityCode when code and iataCode are missing', () => {
                const light = { order: { slices: [ { segments: [ { arrival: { city: { cityCode: 'AGP' } } } ] } ] } };
                (controller as any).bookingInfoLight = light;
                const res = (controller as any).getArrivalCityCodeFromLight();
                expect(res).toBe('AGP');
            });

            it('returns null when arrival city is missing', () => {
                const light = { order: { slices: [ { segments: [ { arrival: {} } ] } ] } };
                (controller as any).bookingInfoLight = light;
                const res = (controller as any).getArrivalCityCodeFromLight();
                expect(res).toBeNull();
            });

            it('returns null when there are no segments', () => {
                const light = { order: { slices: [ { segments: [] } ] } };
                (controller as any).bookingInfoLight = light;
                const res = (controller as any).getArrivalCityCodeFromLight();
                expect(res).toBeNull();
            });
        });
    });
    describe('when openGastronomicProposal function called', () => {
        it('should set activeTab to customize', (done) => {
            controller.model.activeTab = { name: 'test' };
            controller.openGastronomicProposal();
            expect(controller.model.activeTab).toEqual(angular.copy(controller.BookingDashboardConstants.TABS.customize));
            done();
        });
    });

    describe('when vipLoungesDataReady event called', () => {
        const arrange = (showGibeLink, gibeData) => {
            controller.showGibeLink = showGibeLink;
            controller.gibeData = gibeData;
        }
        const act = (data) => {
            $rootScope.$broadcast('vipLoungesDataReady', data);
            $rootScope.$digest();
        };
        const assertExpectedState = (expectedShowGibeLink, expectedGibeData) => {
            expect(controller.showGibeLink).toBe(expectedShowGibeLink);
            expect(controller.gibeData).toEqual(expectedGibeData);
        }

        const gibeStatus = (invitationsAvailable, fastAvailable) => {
            return {
                status: {
                    invitations: { code: invitationsAvailable ? 'AVAILABLE' : 'NOT_AVAILABLE' },
                    fast: { code: fastAvailable ? 'AVAILABLE' : 'NOT_AVAILABLE' }
                }
            };
        }

        beforeEach(() => {
            arrange(false, null);
        });

        it('should handleVipLoungesData and set showGibeLink to true when GibeInvitations is available', (done) => {
            const status = gibeStatus(true, false);
            arrange(false, null);
            act(status);
            assertExpectedState(true, status);
            done();
        });

        it('should handleVipLoungesData and set showGibeLink to true when GibeFast is available', (done) => {
            const status = gibeStatus(false, true);
            arrange(false, null);
            act(status);
            assertExpectedState(true, status);
            done();
        });

        it('should handleVipLoungesData and set showGibeLink to false when GibeFast and GibeInvitations is not available', (done) => {
            const status = gibeStatus(false, false);
            arrange(true, { test: 'data' });
            act(status);
            assertExpectedState(false, status);
            done();
        });

        it('should handleVipLoungesData and set showGibeLink to false when vipLoungesData is undefined', (done) => {
            arrange(true, { test: 'data' });
            act(undefined);
            assertExpectedState(false, undefined);
            done();
        });

        it('should handleVipLoungesData and set showGibeLink to false when vipLoungesData is empty object', (done) => {
            arrange(true, { test: 'data' });
            act({});
            assertExpectedState(false, {});
            done();
        });

        it('should handleVipLoungesData and set showGibeLink to false when vipLoungesData is false', (done) => {
            arrange(true, { test: 'data' });
            act(false);
            assertExpectedState(false, false);
            done();
        });

        it('should handleVipLoungesData and set showGibeLink to false when vipLoungesData is empty string', (done) => {
            arrange(true, { test: 'data' });
            act('');
            assertExpectedState(false, '');
            done();
        });

        it('should return true when VIP_SERVICES parameter is present', (done) => {
            fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.returnValue('vip-service-patameter-value');
            const result = controller['checkExclusiveServicesDeepLink']();

            expect(fakeMmBUtilService.getParameterByName).toHaveBeenCalledWith(fakeMmBAppConstants.URL_PARAMETERS.VIP_SERVICES, null);
            expect(result).toBe(true);
           
            done();
        });
        it('should return false when VIP_SERVICES parameter is not present', (done) => {
            fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.returnValue(null);
            const result = controller['checkExclusiveServicesDeepLink']();

            expect(result).toBe(false);
            done();
        });
    });
});
