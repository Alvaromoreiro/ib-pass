import angular from "angular";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';

describe('ibMmbBookingDashboardUtilsService test ', () => {

    let BookingDashboardUtilsService, $rootScope, localStorageGetSpy, $q, localStorageService;
    let fakeBookingSearchService = {
        'searchFlightsPassengersEvent': jasmine.createSpy('searchFlightsPassengersEvent').and.callFake(() => { }),
    };

    let fakeNewMainHeaderFacade = {
        'initHeader': jasmine.createSpy('initHeader').and.callFake(() => {
            return {
                onLogin: () => {},
                onError: () => {}
            }
         }),
         'updateBasketDiscounts': jasmine.createSpy('initHeader').and.callFake(() => {}),
         'updateBasketPriority': jasmine.createSpy(),
         'updateHeader': jasmine.createSpy('updateHeader').and.callFake(() => {}),
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
            EARLY_ANCILLARIES : 'test',
            ANCILLARIES: 'ANCILLARIES',
            CUSTOMIZE_YOUR_TRAVEL: 'test'
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
        }
    };

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(() => { }),
        'updateLoggedDatalayer': jasmine.createSpy('updateLoggedDatalayer').and.callFake(() => { }),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(() => { }),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy(),
        'updateDatalayerViewEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerForAncillaries':jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy(),
        'updateDigitalDataForAncillaries': jasmine.createSpy(),
        'setAncillariesDatalayer': jasmine.createSpy(),
        'addDigitalDataInfo': jasmine.createSpy()
    };


    let fakeMmBModalService = {
        'finishWaiting': jasmine.createSpy('finishWaiting').and.callFake(() => { }),
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
    fakeBookingDashboardModel.initializeModel = () => {};

    let fakeBookingDashboardService = {
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
            return {model: {
                ancillariesInfo: {
                    bidsUpgradingInfo: {
                        aviosBidAvailable: false
                    }
                }
            }};
        }),
        'callApisService': jasmine.createSpy('callApisService').and.callFake(() => { }),
        'getContactData': jasmine.createSpy('getContactData').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({email: 'otro@test.com'});
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
            deferred.resolve({gender: 'test'});
            return deferred.promise;
        }),
        updatePersonalData: jasmine.createSpy('updatePersonalData').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({gender: 'other'});
            return deferred.promise;
        }),
    };

    let fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy('externalRedirect').and.callFake(() => { })
    };

    let fakeIbCPermanentUserService = {
        'isAfterLoginPermanentUser': jasmine.createSpy('isAfterLoginPermanentUser'),
        'removeParamsAfterLogin': jasmine.createSpy('removeParamsAfterLogin'),
        'checkPermanentUserFlow': jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'isAfterLoginBidsPermanentUser': jasmine.createSpy('isAfterLoginBidsPermanentUser').and.callFake(() => {
            return false;
        })

    };

    let fakeCommonsUserUtilsService = {'isSoftUser': jasmine.createSpy().and.returnValue( ()=>{return true} )};

    let fakeBookingDashboardConstants = {
        TABS: {
            management: 'management',
            complete: 'complete',
            customize: 'customize',
            refunds: 'refunds',
            changeFlights: 'changeFlights',
            simulatorChangeFlights: 'simulatorChangeFlights',
        },
        BOX_LINKS_TYPES: {
            CHECK_IN: 'checkIn',
            EMERGENCY_CONTACT: 'emergencyContact',
            SEATS_AUCTION: 'seatsAuction',
            FLIGHT_REMINDER: 'flightReminder',
            BIDABLE: 'BIDABLE'
        },
    };

    let fakeBookingInfo = require('@test/mocks/storage/booking-info-dashboard-mock.json');

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

    let fakeIbMmbTravelDocumentsService = {
        getTravelDocuments: jasmine.createSpy('updateMenusSelected').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve(fakeTravelDocuments);
            return deferred.promise;
         })
    };

    let fakePassengerApisInfo = {
        existInfant: true,
        mandatoryDocuments: {
            nationality: "",
            isMandatory: true,
            documents: [
                {
                    type: {
                        code: "PSPT",
                        description: "Pasaporte"
                    },
                    requiredFields: [
                        "EXPIRY_DOC",
                        "CNTRY_DOC",
                        "NUM_DOC"
                    ],
                    requiredFieldsOptions: null,
                    isSaved: false,
                    $$hashKey: "object:1022"
                },
                {
                    type: {
                        code: "DNI",
                        description: "Documento Nacional de Identidad"
                    },
                    requiredFields: [
                        "NUM_DOC",
                        "EXPIRY_DOC",
                        "CNTRY_DOC"
                    ],
                    requiredFieldsOptions: [],
                    issuerCountry: "",
                    isSaved: false,
                    $$hashKey: "object:1023"
                },{
                    type: {
                        code: null,
                        description: "Other test"
                    },
                    requiredFields: [
                        "NUM_DOC",
                        "EXPIRY_DOC",
                        "CNTRY_DOC"
                    ],
                    requiredFieldsOptions: [],
                    issuerCountry: "",
                    isSaved: false,
                    $$hashKey: "object:1023"
                }
            ],
            selectedDoc: null,
        },
        basicInfo: {gender: 'Other'}
    };

    let fakeTravelDocuments = {
        code: 200,
        data: {
            meta: {
                "timestamp": "2024-11-13T16:30:17.910Z",
                "additional_info": "GET /v1/travel-documents"
            },
            documents: [
                {
                    "document_type": "DNI",
                    "document_number": "90425350E",
                    "expiry_date": '2031-07-05',
                    "country": "JP",
                    "id": "gpDkANzeks9TvnqziZ"
                },
                {
                    "document_type": "PASSPORT",
                    "document_number": "41001063453455E",
                    "expiry_date": '2031-07-05',
                    "country": "ES",
                    "id": "xek159a1Ue37FLjrFb"
                },
                {
                    "document_type": "OTHER",
                    "document_number": "41001063453455E",
                    "expiry_date": {},
                    "country": "ES",
                    "id": "xek159a1Ue37FLjrFb"
                }
            ]
        }
    };

    let fakeWindow = {
        open: () => {},
        location: {
            origin: 'test'
        },
        scrollTo: jasmine.createSpy(),
    };

    let fakeBookingDashboardSharedUtilsService = {
        closeCollapseHeader: jasmine.createSpy(),
        handleUpgradeFlow: jasmine.createSpy(),
    };

    let fakeLocation = {
        'path': jasmine.createSpy()
    };

    let fakeModel = {
        passengersModel: {
            contactData: {
                emergencyContactInfo: '',
                primaryContactInfo: {
                    lowerCaseEmail: 'test'
                }
            },
            passengers: [{
                additionalRequiredInfo: {existInfant: true, basicInfo: {gender: 'Other'} },passengerType: 'ADULT', passengerId: 'ADULT_01', frequentFlyerInfo: {
                    company: 'test',
                    number: '1234',
                    airlineName: 'test'
                }},
            ],
            frequentFlyerInfo: {
                company: 'test',
                number: '1234',
                airlineName: 'test'
            }
        },
        bookingGeneralInfo: {
            flowId: 'test'
        }
    };

    const setupProviders = ($provide) => {
        $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
        $provide.value('BookingSearchService', fakeBookingSearchService);
        $provide.value("$window", fakeWindow);
        $provide.value('IbCPermanentUserService', fakeIbCPermanentUserService);
        $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
        $provide.value('MmBModalService', fakeMmBModalService);
        $provide.value('BookingDashboardService', fakeBookingDashboardService);
        $provide.value('BookingDashboardSharedUtilsService', fakeBookingDashboardSharedUtilsService);
        $provide.value('$location', fakeLocation);
        $provide.value('MmBAppConstants', fakeMmBAppConstants);
        $provide.value('IbMmbTravelDocumentsService', fakeIbMmbTravelDocumentsService);
        $provide.value('CommonsUtilService', fakeCommonsUtilService);
        $provide.value('RedirectionService', fakeRedirectionService);
        $provide.value('$filter', filterFake);
        $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
    };

    const setupSpiesAndMocks = (_localStorageService_) => {
        localStorageService = _localStorageService_;
        // Clear localStorage before each test
        if (typeof localStorageService.clear === 'function') {
            localStorageService.clear();
        } else if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
        }
        localStorageGetSpy = spyOn(localStorageService, 'get');
        spyOn(localStorageService, 'set');
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

        inject((_$rootScope_, _BookingDashboardUtilsService_, _localStorageService_, _$q_ , _IbCPermanentUserService_, _$timeout_,  _$cookies_) => {
            $rootScope = _$rootScope_;
            BookingDashboardUtilsService = _BookingDashboardUtilsService_;
            $q = _$q_;
            setupSpiesAndMocks(_localStorageService_);

            
        });

        BookingDashboardUtilsService.model = fakeModel;
        BookingDashboardUtilsService.lastSavedApis = [];
        BookingDashboardUtilsService.lastSavedApis[0] = fakeModel.passengersModel.passengers[0].additionalRequiredInfo;
        fakeBookingInfo.passengers = [
            {
                "passengerType":"ADULT",
                "personalInfo":{
                    "name":"ADULTO",
                    "surname":"UNO",
                    "birthDate": null
                },
                "passengerId":"ADULT_01",
                "contactInfo":{
                    "phone":"346545643433",
                    "email":"marialuisa.ramos@panel.es",
                    "phoneType":"MOBILE",
                    "confirmationMailOption": null
                },
                "relatedPassengerId":"",
                "ckiStatus": null,
                "optionalInformation":[

                ],
                "residenceAccreditationStatus": null,
                "resiberPassengerId":"1",
                "frequentFlyerInfo": {
                    "number": '1234'
                }
            }
        ];
        BookingDashboardUtilsService.bookingInfo = fakeBookingInfo;

        localStorageGetSpy.withArgs('bookingInfo').and.returnValue(fakeBookingInfo);
        localStorageGetSpy.withArgs('specialMealsTempInfoAux').and.returnValue([{segmentId: 0, menu: 'test'}]);
        localStorageGetSpy.withArgs('activateTravelDocs').and.returnValue([{}]);
        localStorageGetSpy.withArgs('userLogged').and.returnValue(true);
        localStorageGetSpy.withArgs('PNR').and.returnValue('AAFFSS');
        localStorageGetSpy.withArgs('checkinSurname').and.returnValue('test');
        localStorageGetSpy.withArgs('customerData').and.returnValue({personalInfo: {ibPlusNumber:'1234'}});
        localStorageGetSpy.withArgs('ffLocal').and.returnValue([{id: 'ADULT_01', allCompany: []}]);
        localStorageGetSpy.withArgs('currency').and.returnValue('EUR');
        localStorageGetSpy.withArgs('membershipData').and.returnValue(null);
        localStorageGetSpy.withArgs('headerModel').and.returnValue({headerModel:{shoppingBasket: {discountsModel: {hasDiscounts: true, discounts: {VOUCHER: {}}}}}});
        localStorageGetSpy.withArgs('voucherDeleteInfo').and.returnValue({});
        

        $rootScope.$digest();
    });

    describe('when activate() is called', () => {
        it('ibMmbBookingDashboardComponent should be defined', (done) => {
            expect(BookingDashboardUtilsService).toBeDefined();
            done();
        });
    });

    describe('when boxLinkRedirection called', () => {
        beforeEach(()=>{
            BookingDashboardUtilsService.model.passengersModel.contactData = {emergencyContactInfo: ''}; 
        })
        const BoxLinkRedirectionCases = [
            { event: 'CHECK_IN', linkId: 'checkIn' },
            { event: 'SEATS_AUCTION', linkId: 'seatsAuction' },
            { event: 'BIDABLE', linkId: 'BIDABLE' },
            { event: 'EMERGENCY_CONTACT', linkId: 'emergencyContact' },
            { event: 'FLIGHT_REMINDER', linkId: 'flightReminder' }
        ];
        BoxLinkRedirectionCases.forEach(({ event, linkId },index) => {
             it(`should boxLinkRedirection swith case ${event}`, (done) => {
                BookingDashboardUtilsService.boxLinkRedirection(event, linkId);
                $rootScope.$digest();
                expect(BoxLinkRedirectionCases[index].linkId).toEqual(linkId);
                done();
            });
        });
        it('should boxLinkRedirection swith case default', (done) => {
            BookingDashboardUtilsService.boxLinkRedirection(null, 'other');
            $rootScope.$digest();
            done();
        });
    });

    describe('when checkSpecialNeeds called', () => {
        it('and checkSpecialNeeds function called', (done) => {
            BookingDashboardUtilsService.model.passengersModel.passengers = [{specialNeeds: {specialVision: true, specialIntellectual: true, specialHearing: true, specialWheelchair: true}}];
            BookingDashboardUtilsService.checkSpecialNeeds(null, 0);
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.passengersModel.passengers[0].specialNeeds.specialVision).toEqual(true);
            done();
        });
    });

    describe('when updatePassengerDataEvent event called', () => {
        let cases = [
            {type: 'frequentFlyer', case: 'frequentFlyerCase1'},
            {type: 'primaryContact', case: 'primaryContactCase1'},
            {type: 'primaryContact', case: 'primaryContactCase2'},
            {type: 'emergencyContact', case: 'emergencyContactCase1'},
            {type: 'emergencyContact', case: 'emergencyContactCase2'},
            {type: 'specialNeeds', case: 'specialNeedsCase1'},
            {type: 'APIS', case: 'APISCase1'},
            {type: 'default', case: 'default'},
            {type: 'frequentFlyer', case: 'frequentFlyerCase1Reject'},
            {type: 'frequentFlyer', case: 'frequentFlyerCase2Reject'},
            {type: 'APIS', case: 'APISCase1Reject'},
            {type: 'primaryContact', case: 'primaryContactCase1Reject'},
            {type: 'emergencyContact', case: 'emergencyContactCase1Reject'},
            {type: 'specialNeeds', case: 'specialNeedsCase1Reject'},
            {type: 'specialNeeds', case: 'specialNeedsCase2Reject'},
            {type: 'APIS', case: 'APISCase2Reject'},
            {type: 'APIS', case: 'APISCase3Reject'},
        ];

        cases.forEach((caseType) => {
            it(`should updatePassengerInfo function called and case ${caseType.type}`, (done) => {
                let type = caseType.type;

                if (caseType.case === 'frequentFlyerCase1') {
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        type: 'frequentFlyer',
                        passengerId: 'ADULT_01',
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }];

                } else if (caseType.case ==='primaryContactCase1') {
                    BookingDashboardUtilsService.model.passengersModel.originalData = {
                        test: 'test',
                        emailRepeat: true
                    };
                    BookingDashboardUtilsService.model.passengersModel.contactData = {
                        primaryContactInfo: {
                            emailRepeat: true
                        },
                        emergencyContactInfo: ''
                    };
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        type: 'primaryContact',
                        additionalFFInfo: ''
                    }];
                } else if (caseType.case ==='primaryContactCase2') {
                     BookingDashboardUtilsService.model.passengersModel.originalData = {
                        emailRepeat: true
                    };
                    BookingDashboardUtilsService.model.passengersModel.contactData = {
                        primaryContactInfo: {
                            emailRepeat: true
                        },
                        emergencyContactInfo: ''
                    };
                } else if (caseType.case ==='emergencyContactCase1') {
                    BookingDashboardUtilsService.model.passengersModel = {
                        originalData: 'test',
                        contactData: {
                            emergencyContactInfo: ''
                        },
                        passengers: [{
                            emergencyContactInfo : '',
                            frequentFlyerInfo: {
                                company: 'test',
                                number: '1234',
                                airlineName: 'test'
                            }
                        }],
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    };
                } else if (caseType.case ==='emergencyContactCase2') {
                    BookingDashboardUtilsService.model.passengersModel.originalData = '';
                    BookingDashboardUtilsService.model.passengersModel.contactData = {
                        emergencyContactInfo: ''
                    };
                } else if (caseType.case ==='specialNeedsCase1') {
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        passengerId: 'ADULT_01',
                        specialNeeds: {
                            specialVision: 'BLND',
                            specialIntellectual: 'DPNA',
                            specialHearing: 'DEAF',
                            specialGuideDog: 'SVAN',
                            specialWheelchair: 'TEST',
                            values: []
                        },
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }];
                } else if (caseType.case ==='APISCase1') {
                    BookingDashboardUtilsService.model.shouldLoad = true;
                    BookingDashboardUtilsService.model.passengersModel = {
                        passengerId: 'ADULT_01',
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
                                company: 'test',
                                number: '1234',
                                airlineName: 'test'
                            }
                        }],
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    };
                    BookingDashboardUtilsService.model.bookingGeneralInfo.flowId = 'test';
                } else if (caseType.case ==='frequentFlyerCase1Reject') {
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        type: 'frequentFlyer',
                        passengerId: 'ADULT_01',
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }];
                    fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                } else if (caseType.case ==='frequentFlyerCase2Reject') {
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        type: 'frequentFlyer',
                        passengerId: 'ADULT_01',
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }];
                    fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                } else if (caseType.case ==='APISCase1Reject') {
                    BookingDashboardUtilsService.model.passengersModel.contactData = {
                        emergencyContactInfo: ''
                    }
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        type: 'frequentFlyer',
                        passengerId: 'ADULT_01',
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }];
                    fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                } else if (caseType.case ==='primaryContactCase1Reject') {
                    BookingDashboardUtilsService.model.passengersModel.originalData = {
                        test: 'test',
                        emailRepeat: true
                    };
                    BookingDashboardUtilsService.model.passengersModel.contactData = {
                        primaryContactInfo: {
                            emailRepeat: true
                        },
                        emergencyContactInfo: ''
                    };
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        type: 'primaryContact',
                        additionalFFInfo: ''
                    }];
                    fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                } else if (caseType.case ==='emergencyContactCase1Reject') {
                    BookingDashboardUtilsService.model.passengersModel.originalData = 'test';
                    BookingDashboardUtilsService.model.passengersModel.contactData = {
                        emergencyContactInfo: ''
                    }
                    fakeBookingDashboardService.updateDataContactInfo = jasmine.createSpy('updateDataContactInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                } else if (caseType.case ==='specialNeedsCase1Reject') {
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        passengerId: 'ADULT_01',
                        specialNeeds: {
                            specialVision: 'BLND',
                            specialIntellectual: 'DPNA',
                            specialHearing: 'DEAF',
                            specialGuideDog: 'SVAN',
                            specialWheelchair: 'TEST',
                            values: []
                        },
                        type: 'specialNeeds',
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }];
                    fakeBookingDashboardService.updatePassengerSpecialNeeds = jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                } else if (caseType.case ==='specialNeedsCase2Reject') {
                    BookingDashboardUtilsService.model.passengersModel.passengers = [{
                        passengerId: 'ADULT_01',
                        specialNeeds: {
                            specialVision: 'BLND',
                            specialIntellectual: 'DPNA',
                            specialHearing: 'DEAF',
                            specialGuideDog: 'SVAN',
                            specialWheelchair: 'TEST',
                            values: []
                        },
                        type: 'specialNeeds',
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }];
                    fakeBookingDashboardService.updatePassengerSpecialNeeds = jasmine.createSpy('updatePassengerSpecialNeeds').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                } else if (caseType.case ==='APISCase2Reject') {
                    BookingDashboardUtilsService.model.shouldLoad = true;
                    BookingDashboardUtilsService.model.passengersModel = {
                        passengerId: 'ADULT_01',
                        contactData: {
                            emergencyContactInfo: ''
                        },
                        passengers: [{
                            passengerId: 'ADULT_01',
                            additionalRequiredInfo: {
                                basicInfo: {
                                    gender: 'testother'
                                },
                            },
                            frequentFlyerInfo: {
                                company: 'test',
                                number: '1234',
                                airlineName: 'test'
                            }
                        }],
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }
                    fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy().and.returnValue( ()=>{return false;});
                    fakeBookingDashboardService.updateApisInfo = jasmine.createSpy('updateApisInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                    BookingDashboardUtilsService.model.bookingGeneralInfo.flowId = 'test';
                } else if (caseType.case ==='APISCase3Reject') {
                    BookingDashboardUtilsService.model.shouldLoad = true;
                    BookingDashboardUtilsService.model.passengersModel = {
                        passengerId: 'ADULT_01',
                        contactData: {
                            emergencyContactInfo: ''
                        },
                        passengers: [{
                            passengerId: 'ADULT_01',
                            additionalRequiredInfo: {
                                basicInfo: {
                                    gender: 'testother'
                                },
                            },
                            frequentFlyerInfo: {
                                company: 'test',
                                number: '1234',
                                airlineName: 'test'
                            }
                        }],
                        frequentFlyerInfo: {
                            company: 'test',
                            number: '1234',
                            airlineName: 'test'
                        }
                    }
                    fakeBookingDashboardService.updateApisInfo = jasmine.createSpy('updateApisInfo').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject();
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('updatePassengershowGenericErrorSpecialNeeds').and.callFake(() => {
                        return {
                            'result': $q.when()
                        };
                    });
                    BookingDashboardUtilsService.model.bookingGeneralInfo.flowId = 'test';
                }
                BookingDashboardUtilsService.updatePassengerInfo(null, 0, type, true);
                $rootScope.$digest();
                expect(type).toEqual(caseType.type);
                done();
            });
        });
        
    });

    describe('when updatePassengerDataEvent event called without FFlocal', () => {
        it('should updatePassengerInfo function called and FFlocal empty', (done) => {
            localStorageGetSpy.withArgs('ffLocal').and.returnValue(null);
            let type = 'frequentFlyer';
            BookingDashboardUtilsService.model.passengersModel.passengers = [{
                type: 'frequentFlyer',
                passengerId: 'ADULT_01',
                frequentFlyerInfo: {
                    company: 'test',
                    number: '1234',
                    airlineName: 'test'
                }
            }];
            BookingDashboardUtilsService.updatePassengerInfo(null, 0, type, true);
            $rootScope.$digest();
            expect(type).toEqual('frequentFlyer');
            done();
        });
        afterEach(()=>{
            localStorageGetSpy.withArgs('ffLocal').and.returnValue([{id: 'ADULT_01', allCompany: []}]);
        })
    });

    describe('when getApisData function called and resolve', () => {
        beforeEach(inject(() => {
            let copyfakePassengerApisInfo = {...fakePassengerApisInfo};
            copyfakePassengerApisInfo.mandatoryDocuments.selectedDoc = null;
            fakeBookingDashboardService.callApisService = jasmine.createSpy('callApisService').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve({passengerApisInfo: copyfakePassengerApisInfo, additionalInfo: 'test'});
                return deferred.promise;
            });
        }));
        it('and ADULT resolve promise', (done) => {
            BookingDashboardUtilsService.model.passengersModel.passengers = [{additionalRequiredInfo: {existInfant: true, basicInfo: {gender: 'Other'} },passengerType: 'ADULT', passengerId: 'ADULT_01', frequentFlyerInfo: {
                company: 'test',
                number: '1234',
                airlineName: 'test'
            }}];
            fakeTravelDocuments.data.documents[1].expiry_date = {};
            BookingDashboardUtilsService.lastSavedApis = [];
            BookingDashboardUtilsService.getApisData(null, {index: 0});
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.passengersModel.passengers[0].additionalRequiredInfo).toEqual(fakePassengerApisInfo);
            done();
        });
        it('and ADULT resolve promise DNI selected document', (done) => {
            BookingDashboardUtilsService.model.passengersModel.passengers = [{additionalRequiredInfo: {existInfant: true, basicInfo: {gender: 'Other'} },passengerType: 'ADULT', passengerId: 'ADULT_01', frequentFlyerInfo: {
                company: 'test',
                number: '1234',
                airlineName: 'test'
            }}];
            fakeTravelDocuments.data.documents[1].expiry_date = '2031-07-05';
            BookingDashboardUtilsService.lastSavedApis = [];
            BookingDashboardUtilsService.getApisData(null, {index: 0});
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.passengersModel.passengers[0].additionalRequiredInfo).toEqual(fakePassengerApisInfo);
            done();
        });
        it('and ADULT resolve promise without additionalRequiredInfo', (done) => {
            BookingDashboardUtilsService.model.passengersModel.passengers = [{additionalRequiredInfo: {}, passengerType: 'ADULT', passengerId: 'ADULT_01', frequentFlyerInfo: {
                company: 'test',
                number: '1234',
                airlineName: 'test'
            }}];
            fakeTravelDocuments.data.documents[1].expiry_date = null;
            BookingDashboardUtilsService.lastSavedApis = [];
            BookingDashboardUtilsService.getApisData(null, {index: 0});
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.passengersModel.passengers[0].additionalRequiredInfo).toEqual(fakePassengerApisInfo);
            done();
        });
        afterEach(()=>{
            fakeTravelDocuments.data.documents[1].expiry_date = '2031-07-05';
        })
    }); 

    describe('when getApisData function called and resolve without passengerId', () => {
        beforeEach(inject(() => {
            fakeBookingDashboardService.callApisService = jasmine.createSpy('callApisService').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve({passengerApisInfo: fakePassengerApisInfo, additionalInfo: 'test'});
                return deferred.promise;
            });
        }));
        it('and ADULT resolve promise without passengerId', (done) => {
            delete fakeBookingInfo.passengers[0].passengerId;
            BookingDashboardUtilsService.model.passengersModel.passengers = [{additionalRequiredInfo: {existInfant: true, basicInfo: {gender: 'Other'} },passengerType: 'ADULT', passengerId: 'ADULT_01', frequentFlyerInfo: {
                    company: 'test',
                    number: '1234',
                    airlineName: 'test'
                }}];
            BookingDashboardUtilsService.lastSavedApis = [];
            BookingDashboardUtilsService.getApisData(null, {index: 0});
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.passengersModel.passengers[0].additionalRequiredInfo).toEqual(fakePassengerApisInfo);
            done();
        });
        afterEach(()=> {
            fakeBookingInfo.passengers[0].passengerId = 'ADULT_01';
        });
    });
    
    describe('when getApisData function called and reject', () => {
        beforeEach(inject(() => {
            fakeBookingDashboardService.callApisService = jasmine.createSpy('callApisService').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });
        }));
        it('and INFANT reject promise with relatedPassengerId', (done) => {
            BookingDashboardUtilsService.model.passengersModel.passengers = [{additionalRequiredInfo: {existInfant: true },personalInfo:{name: 'test', surname: 'test'}, passengerType: 'INFANT', relatedPassengerId: 'ADULT_01', passengerId: 'INFANT_01'}];      
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                return {
                    'result': $q.when()
                };
            });
            BookingDashboardUtilsService.getApisData(null, {index: 0});
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.passengersModel.passengers[0].additionalRequiredInfo).toEqual({existInfant: true});
            done();
        });
        it('and INFANT reject promise', (done) => {
            BookingDashboardUtilsService.model.passengersModel.passengers = [{additionalRequiredInfo: {existInfant: true },personalInfo:{name: 'test', surname: 'test'}, passengerType: 'INFANT', relatedPassenger: 'test test', passengerId: 'INFANT_01'}];      
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                return {
                    'result': $q.when()
                };
            });
            BookingDashboardUtilsService.getApisData(null, {index: 0});
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.passengersModel.passengers[0].additionalRequiredInfo).toEqual({existInfant: true});
            done();
        });
    });

    

    describe('when reloadImportOrder function called', () => {
        it('and resolve', (done) => {
            spyOn(fakeBookingSearchService, 'searchFlightsPassengersEvent')
            BookingDashboardUtilsService.reloadImportOrder();
            expect(fakeBookingSearchService.searchFlightsPassengersEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('when updateModelFf event called', () => {
        it('should updateModelFf and updateModelFf function called', (done) => {
            BookingDashboardUtilsService.model.passengersModel = {
                passengers: [{
                    additionalFFInfo: '',
                    frequentFlyerInfo: {
                        company: 'test',
                        number: '1234',
                        airlineName: 'test'
                    }
                }],
                frequentFlyerInfo: {
                    company: 'test',
                    number: '1234',
                    airlineName: 'test'
                }
            };
            BookingDashboardUtilsService.updateModelFf(null, 'test', 0);
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.passengersModel.passengers[0].additionalFFInfo).toEqual('test');
            done();
        });
    });

    describe('when updateSpecialMeals event called', () => {
        it('should updateSpecialMeals and updateSpecialMeals function called', (done) => {
            BookingDashboardUtilsService.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            BookingDashboardUtilsService.model.ancillariesInfo.specialMealsInfo.specialMealNumSelected = {}
            BookingDashboardUtilsService.model.managementMeals = {
                segments: [{
                    id_segment: 0,
                    passengers: []
                }],
                specialMealNumSelected: {}
            }

            BookingDashboardUtilsService.updateSpecialMeals(null, 'test');
            $rootScope.$digest();
            expect(BookingDashboardUtilsService.model.managementMeals.segments[0].numSpecialMeals).toEqual(1);
            done();
        });
    });

    describe('when updateSpecialMeals event called', () => {
        it('should updateSpecialMeals and updateSpecialMeals function called', (done) => {
            localStorageGetSpy.withArgs('customerData').and.returnValue(null);
            spyOn(fakeNewMainHeaderFacade, 'initHeader')
            BookingDashboardUtilsService.initFacadeHeader();
            $rootScope.$digest();
            expect(fakeNewMainHeaderFacade.initHeader).toHaveBeenCalled();
            done();
        });
        afterEach(()=> {
            localStorageGetSpy.withArgs('customerData').and.returnValue({personalInfo: {ibPlusNumber:'1234'}});
        })
    });
    
    describe('when returnOriginalData event called', () => {
        it('should returnOriginalData function called and case APIS ', (done) => {
            let type = 'APIS';
            BookingDashboardUtilsService.lastSavedApis[0] = fakeModel.passengersModel.passengers[0].additionalRequiredInfo;
            BookingDashboardUtilsService.returnOriginalData (null, type, 0);
            $rootScope.$digest();
            expect(type).toEqual('APIS');
            done();
        });
    });
});
