import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
import { UrlUtilsServiceMock } from '../../../../mocks/Services/UrlUtilsServiceMock';
import { DigitalDataUtilsServiceMock } from '../../../../mocks/class/DigitalDataUtilsServiceMock';
import { fakeAsync, flush } from '@angular/core/testing';
describe('BookingUtilService Test', () => {
    let rootScope, bookingUtilsService, localStorageService, dateFormatFilter, filter;
    const fakeIbCAuthTokenService = {
        refreshUserLoggedToken: jasmine.createSpy(),
        getAnonymousToken: jasmine.createSpy()
    };
    const membershipData = {
        clid: 'OB23609425',
        parentClpNumber: null,
        companyInfo: {
            companyName: 'Pruebas JIP',
            companyIdType: 'NIF',
            companyId: '22222222A',
            industrySector: '34',
            marketSegment: null,
            address: {
                addressLine1: 'Menorca 3',
                addressLine2: null,
                addressLine3: null,
                country: 'ES',
                state: 'M',
                zipCode: '28029',
                city: 'Madrid'
            },
            contactInfo: {
                email: 'niit.fdelmoral@iberia.es',
                secondaryEmail: null,
                internationalDiallingCode: '+34',
                phoneNumber: '987654231'
            }
        },
        infoDetailMember: {
            memberStatus: 'A',
            blackListedInformation: false,
            corporateDealInformation: false,
            incompleteData: false,
            underAudit: false,
            companyIdValidatedFlag: false,
            additionalDocumentApproved: true,
            additionalDocumentationNeeded: true,
            manualValidationCompleted: true,
            duplicateAccount: false,
            travelAgent: false
        },
        tierStatus: {
            status: 'On1',
            expirationDate: null
        },
        memberBalance: 3577624,
        programBaseCurrency: 'EUR',
        termsAndConditionAcceptanceDate: '2019-05-31T11:41:16.000',
        affiliatedSchemaOperator: 'IB',
        enrollmentInfo: {
            source: null,
            channel: 'W',
            date: '2019-05-31T00:00:00.000',
            salesmanCode: null,
            refferedByClpNumber: null
        },
        estimatedTotalAnnualAirSpend: {
            amount: 0,
            currency: 'EUR'
        },
        numberOfTravelers: '0',
        mainTravelDestinations: null,
        travelPolicy: 'NP',
        bookingBehaviour: '000',
        amountOfTravel: '1',
        iberiaCard: {
            cardFlag: false,
            cardStartDate: null,
            cardEndDate: null
        },
        userInfo: {
            login: 'segundo',
            firstName: 'Segundo',
            lastName: 'Usuario',
            secondLastName: null,
            role: {
                code: 'I_COMP_ADM',
                description: 'HEADER.RB.tabMenuCIP.role.I_COMP_ADM'
            },
            email: 'jose.irigaray@niit-tech.com',
            phones: [
                {
                    type: 'HOME',
                    internationDiallingCode: '+34',
                    number: '2315478',
                    extentionNumber: null
                }
            ],
            status: 'A',
            preferredLanguage: 'SPA',
            jobTitle: null,
            title: 'BARONESS',
            joinDate: '2019-05-31T00:00:00.000',
            travelAgentSpecificData: null,
            permissionToDiscount: true,
            thirdPartyPrivilege: true,
            redemptionPermission: true,
            userSpecific: {
                marketingPermission: {
                    schemeOperator: false,
                    thirdParty: false,
                    channel: {
                        sms: false,
                        phone: false,
                        email: false,
                        postal: false
                    }
                },
                otherLoyalty: null,
                socialNetwork: null,
                identificationDocumentType: null,
                identificationDocumentId: null,
                businessUnitId: 0
            }
        },
        pointsTransformed: 3577624,
        employees: []
    };
    const fakeBookingModalService = {
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {
            return { result: { then: function () { } } };
        }),
        finishWaiting: jasmine.createSpy()
    };
    const fakeDatalayerConstants = {
        DATALAYER_MODAL_ID: { FARE_CONDITIONS: 'FARE_CONDITIONS' }
    };
    const fakeBookingChangeOnHoldOrderService = {
        changeOnHoldOrder: jasmine.createSpy('changeOnHoldOrder')
    };
    const fakeNewMainHeaderFacade = {
        updateHeaderModelOnHold: jasmine.createSpy('updateHeaderModelOnHold'),
        updateHeaderModel: jasmine.createSpy('updateHeaderModel'),
        updateSteps: jasmine.createSpy('updateSteps'),
        deleteDiscountBasket: jasmine.createSpy('deleteDiscountBasket')
    };
    const fakeDigitalDataViewCounterService = {
        restartUnderConditions: jasmine.createSpy('restartUnderConditions')
    };
    const fakeRedirectionService = {
        externalRedirect: jasmine.createSpy('externalRedirect')
    };
    const fakeDataLayerService = {
        addDataLayerGeneralInfo: jasmine.createSpy('addDataLayerGeneralInfo')
    };
    const fakeIbCheckPartnersDiscountsService = {
        getSelectedPartner: jasmine.createSpy('getSelectedPartner')
    };
    const fakeDigitalDataService = {
        addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo')
    };
    const fakeDatalayerUniqueKeysService = {
        clear: jasmine.createSpy()
    };
    const mockDestinationCities = [{ code: 'BCN' }, { code: 'MAD' }];
    const fakeSessionStorage = new StorageServiceMock();
    const fakebookingUrlParams = { modeWeb: null, searchOrigin: null, tripType: '1', senior: 1, adult: 1, young: 1, teenager: 1, child: 1, infant: 1, resident: null, largeFamilyType: null, flexDates: 'true', preferredCabin: 'R', payWithAvios: null, payWithPoints: null, ibGroup: null, referralId: null, displayedPrice: null, slices: [], userCurrency: null, priceCurrency: null, numTrips: null, originDestinations: [{ origin: 'MAD', destination: 'VLC', date: '2021-06-08' }], bookingCode1: null, backToUrl: null, codeTracking: null, travelAgent: null, fromMarket: null, fromLanguage: null, preferredCabin: 'R' };
    const mockReturnCalendarRequest = {
        marketCode: 'ES',
        passengers: [{ count: 1, passengerType: 'ADULT' }],
        slices: [{ daysAfter: 3, daysBefore: 3 }]
    };
    const mockSelectedSlices = require('../../../../mocks/Responses/SelectedSlices-mock.json');
    const mockAvSelectedOffer = require('../../../../mocks/Responses/AvSelectedOffer-mock.json');
    const fakeWindow = {
        location: {
            href: 'www.prueba.com/?flashOffer=true#!/availability',
            origin: 'www.prueba.com'
        },
        innerWidth: 0,
        document: {
            getElementsByName: () => [{ content: '' }]
        }
    };
    let fakeUrlUtilsService = new UrlUtilsServiceMock();
    const fakeDigitalDataUtilsService = new DigitalDataUtilsServiceMock();



    const fakeBookingAppConstants = BookingAppConstants;
    const mockBackgroundImagesList = [
        {
            code: 'BCN',
            extension: '.jpg',
            url: 'barcelona/disponibilidad_barcelona_'
        },
        {
            code: 'LON',
            extension: '.jpg',
            url: 'londres/disponibilidad_londres_'
        },
        {
            code: 'MAD',
            extension: '.jpg',
            url: 'madrid/disponibilidad_madrid_'
        },
        {
            code: 'AGP',
            extension: '.jpg',
            url: 'malaga/disponibilidad_malaga_'
        },
        {
            code: 'PMI',
            extension: '.jpg',
            url: 'mallorca/disponibilidad_mallorca_'
        },
        {
            code: 'NYC',
            extension: '.jpg',
            url: 'NY/disponibilidad_NY_'
        },
        {
            code: 'PAR',
            extension: '.jpg',
            url: 'paris/disponibilidad_paris_'
        },
        {
            code: 'TCI',
            extension: '.jpg',
            url: 'tenerife/disponibilidad_tenerife_'
        },
        {
            code: 'ROM',
            extension: '.jpg',
            url: 'roma/disponibilidad_roma_'
        }
    ];
    const mockServiceData = [
        {
            sliceId: 'MADBIO20230209194500',
            departureDateTime: '2023-02-09 19:45',
            arrivalDateTime: '2023-02-09 20:50',
            duration: 65,
            stopsNumber: 0,
            price: {
                fare: 55,
                tax: 20.22,
                total: 75.22,
                currency: 'EUR',
                ticketingFee: 0
            },
            detailedPrices: [
                {
                    fare: 55,
                    tax: 20.22,
                    total: 75.22,
                    currency: 'EUR',
                    passengerIds: [
                        'ADULT_01'
                    ],
                    segmentPrices: [
                        {
                            price: {
                                fare: 55,
                                currency: 'EUR'
                            },
                            originCurrencyPrice: {
                                fare: 54.88,
                                currency: 'EUR'
                            },
                            fareCode: 'QDNOB4LJ',
                            segmentsIds: [
                                'IB044020230209'
                            ],
                            ticketDesignator: null,
                            endorsement: '660964 AND CHANGS RESTRI'
                        }
                    ],
                    commission: null,
                    ticketingFee: 0
                }
            ],
            segments: [
                {
                    departure: {
                        code: 'MAD',
                        name: 'Madrid Adolfo Suarez-Barajas',
                        terminal: '4',
                        city: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    arrival: {
                        code: 'BIO',
                        name: 'Bilbao',
                        terminal: null,
                        city: {
                            code: 'BIO',
                            description: 'Bilbao',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    flight: {
                        marketingCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        operationalCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        marketingFlightNumber: '440',
                        operationalFlightNumber: '440',
                        operationalDisclosure: 'IB',
                        aircraft: {
                            code: '32A',
                            description: 'Airbus A320 (Sharklets)'
                        }
                    },
                    cabin: {
                        rbd: 'Q',
                        bookingCode: 'COACH',
                        bookingClass: 'ECONOMY',
                        remainingSeats: 1,
                        fareFamily: 'TBAESEU',
                        fareBasis: 'QDNOB4LJ',
                        seatDisplays: null,
                        extendedFareCode: null,
                        ticketDesignator: '',
                        brandCode: null,
                        cabinDescription: 'Turista'
                    },
                    overnight: false,
                    id: 'IB044020230209',
                    duration: 65,
                    waitingTime: 0,
                    providerId: null,
                    ticketDesignator: '',
                    accrualQuote: null,
                    delayInformation: null,
                    stop: null,
                    departureDateTime: '2023-02-09 19:45',
                    arrivalDateTime: '2023-02-09 20:50',
                    secureFlightInformed: false,
                    secureFlight: false
                }
            ],
            overnight: false,
            origin: null,
            destination: null,
            originDestinationKey: null
        }
    ];
    const mockServiceDataPassengersBreakDown = {
        order: {
            orderItems: [
                {
                    type: 'flight',
                    passengerPrices: [
                        {
                            price: {
                                fare: 40,
                                tax: 1,
                                currency: 'EUR'
                            },
                            taxes: 1,
                            passengerId: '12332_01'
                        }

                    ]
                }
            ]
        },
        passengers: [
            {
                personalInfo: {
                    firstName: 'Prueba',
                    firstSurname: 'Pruebas',
                    lastSurname: 'Dos'
                },
                passengerId: '12332_01'
            }
        ],
        contextMetadata: {
            currencies: [
                {
                    code: 'EUR',
                    symbol: '€'
                }
            ]
        },
        offers: [
            {
                offerItems: [
                    {
                        passengerIds: '12332_01',
                        price: {
                            fare: 40,
                            tax: 1,
                            currency: 'EUR'
                        },
                        detailedTaxes: []
                    }
                ]
            }
        ]
    };
    const mockResponseGetPassengersBreakdown = {
        generalData: {
            0: [
                {
                    number: 1,
                    totalTax: 1,
                    totalTaxWithDiscount: 1,
                    totalTaxWithoutDiscount: 1,
                    currency: '€',
                    breakdownTaxes: [],
                    fare: 40,
                    fareWithoutDiscount: 40,
                    fareWithDiscount: 40,
                    parsedFare: [],
                    parsedFareWithDiscount: [],
                    parsedFareWithoutDiscount: [],
                    parsedTotalTax: [],
                    parsedTotalTaxWithDiscount: [],
                    parsedTotalTaxWithoutDiscount: []
                }
            ],
            1: [
                {
                    number: 2,
                    totalTax: 2,
                    totalTaxWithDiscount: 1,
                    totalTaxWithoutDiscount: 1,
                    currency: '€',
                    breakdownTaxes: [],
                    fare: 40,
                    fareWithoutDiscount: 40,
                    fareWithDiscount: 40,
                    parsedFare: [],
                    parsedFareWithDiscount: [],
                    parsedFareWithoutDiscount: [],
                    parsedTotalTax: [],
                    parsedTotalTaxWithDiscount: [],
                    parsedTotalTaxWithoutDiscount: []
                }
            ],
            2: [
                {
                    number: 2,
                    totalTax: 2,
                    totalTaxWithDiscount: 1,
                    totalTaxWithoutDiscount: 1,
                    currency: '€',
                    breakdownTaxes: [],
                    fare: 40,
                    fareWithoutDiscount: 40,
                    fareWithDiscount: 40,
                    parsedFare: [],
                    parsedFareWithDiscount: [],
                    parsedFareWithoutDiscount: [],
                    parsedTotalTax: [],
                    parsedTotalTaxWithDiscount: [],
                    parsedTotalTaxWithoutDiscount: []
                }
            ],
            3: [
                {
                    number: 2,
                    totalTax: 2,
                    totalTaxWithDiscount: 1,
                    totalTaxWithoutDiscount: 1,
                    currency: '€',
                    breakdownTaxes: [],
                    fare: 40,
                    fareWithoutDiscount: 40,
                    fareWithDiscount: 40,
                    parsedFare: [],
                    parsedFareWithDiscount: [],
                    parsedFareWithoutDiscount: [],
                    parsedTotalTax: [],
                    parsedTotalTaxWithDiscount: [],
                    parsedTotalTaxWithoutDiscount: []
                }
            ],
            '': [
                {
                    number: 1,
                    totalTax: 1,
                    totalTaxWithDiscount: 1,
                    totalTaxWithoutDiscount: 1,
                    currency: '€',
                    breakdownTaxes: [],
                    fare: 40,
                    fareWithoutDiscount: 40,
                    fareWithDiscount: 40,
                    parsedFare: [],
                    parsedFareWithDiscount: [],
                    parsedFareWithoutDiscount: [],
                    parsedTotalTax: [],
                    parsedTotalTaxWithDiscount: [],
                    parsedTotalTaxWithoutDiscount: []
                }
            ]
        }
    };
    const mockResponsePassengersBreakdown = { personalData: [Object({ name: 'Prueba Pruebas Dos', surname: 'Pruebas', specialNeeds: undefined })], generalData: Object({ 12332: [Object({ number: 1, fare: 40, totalTax: 1, currency: '€', breakdownTaxes: [], parsedFare: [], parsedTotalTax: [] })] }) };
    const fakeFilter = jasmine.createSpy('$filter').and.callFake((filterK) => {
        const filters = {
            translate: function () {
                return 'Translated Text';
            },
            DateFormatFilter: function () {
                return 'date';
            },
            date: function () {
                return 'Mar 10, 2020';
            },
            LinksFilter: function (key) {
                return `link|${key}`;
            },
            default: function (data) {
                return [];
            }

        };

        return filters[filterK] ?? filters.default;
    });
    const mockResponseTripsBreakdown = [
        {
            idTrip: 'MADBIO20230209194500',
            stopsNumber: 0,
            fare: {
                fareDetails: {}
            },
            segments: [
                {
                    idSegment: 'IB044020230209',
                    departure: {
                        code: 'MAD',
                        name: 'Madrid Adolfo Suarez-Barajas',
                        terminal: '4',
                        city: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    departureDate: 'date',
                    arrival: {
                        code: 'BIO',
                        name: 'Bilbao',
                        terminal: null,
                        city: {
                            code: 'BIO',
                            description: 'Bilbao',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    arrivalDate: 'date',
                    flightNumber: '440',
                    operatedBy: 'Iberia',
                    aircraftType: 'Airbus A320 (Sharklets)',
                    duration: [],
                    waitingTime: 0,
                    waitingParsedTime: [],
                    cabin: 'Turista',
                    operationalDisclosure: 'IB',
                    marketingCarrier: {
                        code: 'IB',
                        name: 'Iberia'
                    },
                    displayMarketingFlightNumber: '440'
                }
            ]
        }
    ];
    const mockHeaderModel = {
        headerModel: {
            flightType: 'availabilityFlight',
            redemption: false,
            trips: [
                {
                    originCode: 'MAD',
                    originCity: 'Madrid',
                    destinyCode: 'BIO',
                    destinyCity: 'Bilbao',
                    dateFlight: '09/02/2023',
                    returnFlight: null,
                    passengers: 1,
                    tripType: '1'
                }
            ],
            passengers: {
                numberPassengers: 1,
                numAdults: 1,
                numSeniors: 0,
                numYouth: 0,
                numTeenager: 0,
                numChilds: 0,
                numInfants: 0
            },
            shoppingBasket: {
                baggages: {
                    segments: [

                    ],
                    hasBaggage: false
                },
                seats: {
                    segments: [

                    ],
                    hasSeats: false
                },
                insurance: {
                    info: null,
                    hasInsurance: false
                },
                flexibilization: {
                    info: null,
                    hasFlexibilization: false
                },
                upgrading: {
                    segments: [

                    ],
                    hasUpgrading: false
                },
                speqs: {
                    segments: [

                    ],
                    hasSpeqs: false
                },
                priorityBoarding: {
                    info: null,
                    hasPriorityBoarding: false
                },
                discountsModel: {
                    hasDiscounts: true,
                    total: 0.9,
                    discounts: {
                        DYNAMIC_PRICING: {
                            type: 'DYNAMIC_PRICING',
                            description: 'Promoción especial',
                            percentDiscount: 2,
                            totalDiscount: 0.9,
                            dynamicDiscountRuleId: 'DynamicDiscount',
                            accountCode: 'Q002',
                            originalDiscount: 0.9,
                            discount: '0,90€',
                            discountFormatted: '0,90€'
                        }
                    },
                    totalFormated: '-0,90€'
                },
                othersModel: {
                    hasElements: true,
                    others: [

                    ],
                    total: {
                        total: 0,
                        totalFormatted: '0€'
                    }
                },
                segmentsInfo: [
                    {
                        id: 'IB044820230209',
                        origin: {
                            description: 'Madrid',
                            code: 'MAD'
                        },
                        destination: {
                            description: 'Bilbao',
                            code: 'BIO'
                        }
                    },
                    {
                        id: 'IB044820230209',
                        origin: {
                            description: 'Madrid',
                            code: 'MAD'
                        },
                        destination: {
                            description: 'Bilbao',
                            code: 'BIO'
                        }
                    },
                    {
                        id: 'IB043820230209',
                        origin: {
                            description: 'Madrid',
                            code: 'MAD'
                        },
                        destination: {
                            description: 'Bilbao',
                            code: 'BIO'
                        }
                    },
                    {
                        id: 'IB044820230209',
                        origin: {
                            description: 'Madrid',
                            code: 'MAD'
                        },
                        destination: {
                            description: 'Bilbao',
                            code: 'BIO'
                        }
                    }
                ],
                showBasket: true,
                currency: {
                    suffixSymbol: true,
                    decimalSeparator: ',',
                    numberDecimals: 2,
                    groupingSeparator: '.',
                    currencySymbol: '€',
                    description: 'Euro'
                },
                total: {
                    formatted: '5,00€',
                    original: 64.22,
                    total: 64.22,
                    totalPrice: 5
                },
                trips: {
                    trips: [
                        {
                            scales: false,
                            segments: [
                                {
                                    origin: {
                                        code: 'MAD',
                                        description: 'Madrid',
                                        countryCode: 'ES',
                                        country: {
                                            code: 'ES',
                                            description: 'España'
                                        }
                                    },
                                    destination: {
                                        code: 'BIO',
                                        description: 'Bilbao',
                                        countryCode: 'ES',
                                        country: {
                                            code: 'ES',
                                            description: 'España'
                                        }
                                    },
                                    date: 'Jueves 09 feb. 2023 / 07:25',
                                    segments: [
                                        {
                                            origin: {
                                                code: 'MAD',
                                                description: 'Madrid',
                                                countryCode: 'ES',
                                                country: {
                                                    code: 'ES',
                                                    description: 'España'
                                                }
                                            },
                                            destination: {
                                                code: 'BIO',
                                                description: 'Bilbao',
                                                countryCode: 'ES',
                                                country: {
                                                    code: 'ES',
                                                    description: 'España'
                                                }
                                            },
                                            date: 'jueves 09 feb. 2023 / 07:25'
                                        }
                                    ]
                                }
                            ],
                            passengers: [
                                {
                                    quantity: 1,
                                    type: 'ADULT',
                                    description: 'Adulto',
                                    perPassengerPrice: '44,90€',
                                    taxes: '20,22€',
                                    namesList: [
                                        'test test'
                                    ]
                                }
                            ]
                        }
                    ],
                    total: {
                        totalPrice: 65.12,
                        formatted: '65,12€',
                        original: 65.12
                    }
                }
            },
            advancedSearch: false,
            showModalBackHome: true,
            currency: {
                suffixSymbol: true,
                decimalSeparator: ',',
                numberDecimals: 2,
                groupingSeparator: '.',
                currencySymbol: '€',
                description: 'Euro'
            },
            showAdvancedSearch: true,
            avancedSearch: true,
            steps: {
                position: 5,
                totalSteps: 5
            }
        },
        greyBarModel: {
            login: {

            },
            loggedData: {

            },
            userLogged: false,
            isONB: false,
            isLogged: false,
            show: false
        },
        stepsModel: {
            steps: [
                {
                    index: 1,
                    position: 'availability',
                    text: 'HEADER_STEPS_FLIGHT_SELECT'
                },
                {
                    index: 2,
                    position: 'ibairp',
                    text: 'HEADER_STEPS_PASSENGER_DATA'
                },
                {
                    index: 3,
                    position: 'ibcmtv',
                    text: 'HEADER_STEPS_CUSTOM_COMPLETE'
                },
                {
                    index: 4,
                    position: 'ibpurc',
                    text: 'HEADER_STEPS_PAYMENT'
                },
                {
                    index: 5,
                    position: 'confirmation',
                    text: 'HEADER_STEPS_CONFIRMATION'
                }
            ],
            position: 'confirmation'
        }
    };
    beforeEach(() => {
        fakeUrlUtilsService = new UrlUtilsServiceMock();
        angular.mock.module('LocalStorageModule', 'ib-booking-services-module', 'ib-commons-utils-module', ($provide) => {
            $provide.value('IbCAuthTokenService', fakeIbCAuthTokenService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('BookingChangeOnHoldOrderService', fakeBookingChangeOnHoldOrderService);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('BookingRedirectionService', fakeRedirectionService);
            $provide.value('DataLayerService', fakeDataLayerService);
            $provide.value('DigitalDataService', fakeDigitalDataService);
            $provide.value('DatalayerUniqueKeysService', fakeDatalayerUniqueKeysService);
            $provide.value('$window', fakeWindow);
            $provide.value('$filter', fakeFilter);
            $provide.value('IbCheckPartnersDiscountsService', fakeIbCheckPartnersDiscountsService);
            $provide.value('DigitalDataViewCounterService', fakeDigitalDataViewCounterService);
            $provide.value('UrlUtilsService', fakeUrlUtilsService);
            $provide.value('DigitalDataUtilsService', fakeDigitalDataUtilsService);
        });
        inject(($rootScope, $injector, _BookingUtilService_, _IbCAuthTokenService_, _localStorageService_, $filter) => {
            bookingUtilsService = _BookingUtilService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            window.navigation= {activation:{from:{url: ''}}};
            // filter = $filter;
        });
    });
    describe('when refreshToken resolves the promise', () => {
        beforeEach(inject(($q) => {
            fakeIbCAuthTokenService.getAnonymousToken = jasmine.createSpy('getAnonymousToken').and.callFake(() => {
                const deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            fakeIbCAuthTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(() => {
                const deferred = $q.defer();
                deferred.resolve('true');
                return deferred.promise;
            });
        }));
        it('When getOriginDestination() is called', (done) => {
            let originDestination, originDestinations = [];
            originDestinations.push({ date: '2017-07-19', destination: 'MAD', origin: 'MAD' });
            fakeSessionStorage.set('destinationCitiesList', [{ code: 'MAD', country: { code: 'ES', description: 'España' }, description: 'A coruña', timezone: 'Europe/Madrid' }]);
            originDestination = bookingUtilsService.getOriginDestination(originDestinations);
            expect(originDestination.originCity.code).toEqual('MAD');
            expect(originDestination.destinationCity.code).toEqual('MAD');
            done();
            rootScope.$digest();
        });
    });

    describe('when the service remove the localstorage', () => {
        it(' and have calditMode in localstorage, should remove availabilityRequestData in localstorage', (done) => {
            localStorageService.remove('calditMode');

            bookingUtilsService.initStorage();
            done();
            rootScope.$digest();
        });
        it('all localstorage variables should be inicializated', (done) => {
            bookingUtilsService.initStorage();
            expect(fakeDatalayerUniqueKeysService.clear).toHaveBeenCalled();
            done();
            rootScope.$digest();
        });
    });
    describe('when the service calls generateAvailabilityRequestData', () => {
        beforeEach(() => {
            fakeIbCheckPartnersDiscountsService.getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.callFake(() => {
                return null;
            });
            fakeSessionStorage.set('membershipData', membershipData);
        });
        it('is petFlight ', (done) => {
            fakeWindow.location.href = 'www.prueba.com/?isPetFlight=true#!/availability';
            fakeUrlUtilsService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.returnValue('true');
            const mockObject = { originDestinations: null, preferredCabin: 'R', adult: null, infantLap: null, child: null };
            fakeSessionStorage.set('bookingUrlParams', mockObject);
            const response = bookingUtilsService.generateAvailabilityRequestData()  ;
            expect(response.isPetFlight).toEqual(true);
            done();
            rootScope.$digest();
        });
        it('and bookingUrlParams doesn´t have any parameters ', (done) => {
            let response;
            const mockObject = { originDestinations: null, preferredCabin: 'R', adult: null, infantLap: null, child: null };
            fakeSessionStorage.set('bookingUrlParams', mockObject);
            response = bookingUtilsService.generateAvailabilityRequestData();
            expect(response.slices).toEqual(null);
            done();
            rootScope.$digest();
        });
        it('and bookingUrlParams doesn´t have any parameters ', (done) => {
            let response;
            const mockObject = { originDestinations: 'Madrid-Lisboa', preferredCabin: 'R', adult: '1', infantLap: 'INFANT', child: 'CHILD' };
            fakeSessionStorage.set('bookingUrlParams', mockObject);
            response = bookingUtilsService.generateAvailabilityRequestData();
            expect(response.slices).toEqual('Madrid-Lisboa');
            expect(response.preferredCabin).toEqual('ECONOMY');
            done();
            rootScope.$digest();
        });
        it('and bookingUrlParams doesn´t have any parameters ', (done) => {
            let response;
            const mockObject = { originDestinations: 'Madrid-Lisboa', preferredCabin: 'B', child: '1' };
            fakeSessionStorage.set('bookingUrlParams', mockObject);
            response = bookingUtilsService.generateAvailabilityRequestData();
            expect(response.slices).toEqual('Madrid-Lisboa');
            expect(response.preferredCabin).toEqual('BUSINESS');
            done();
            rootScope.$digest();
        });
        it('and bookingUrlParams doesn´t have any parameters ', (done) => {
            let response;
            const mockObject = { originDestinations: 'Madrid-Lisboa', preferredCabin: 'preferredCabin', infantLap: '1' };
            fakeSessionStorage.set('bookingUrlParams', mockObject);
            response = bookingUtilsService.generateAvailabilityRequestData();
            expect(response.slices).toEqual('Madrid-Lisboa');
            expect(response.preferredCabin).toEqual('ECONOMY');
            done();
            rootScope.$digest();
        });
    });
    describe('when the service calls getCompanyURL', () => {
        it(' and airlinesLogoList  exists ', (done) => {
            let mockCompanyUrl;
            const companyCode = 500;
            const mockObject = [
                {
                    iataCompanyCode: 500,
                    url: 'http://url.com'
                },
                {
                    iataCompanyCode: 500,
                    url: 'http://url.com'
                }
            ];
            fakeSessionStorage.set('airlinesLogoList', mockObject);
            mockCompanyUrl = bookingUtilsService.getCompanyURL(companyCode);
            expect(mockCompanyUrl.logo).toEqual(fakeBookingAppConstants.airlinesLogoBaseRoute + mockObject[0].url);
            done();
            rootScope.$digest();
        });
        it(' and airlinesLogoList doen´t  exists ', (done) => {
            let mockCompanyUrl;
            const companyCode = 500;
            fakeSessionStorage.remove('airlinesLogoList');
            mockCompanyUrl = bookingUtilsService.getCompanyURL(companyCode);
            expect(mockCompanyUrl.logo).toEqual(fakeBookingAppConstants.airlinesLogoBaseRoute + fakeBookingAppConstants.defaultAirlineLogo);
            done();
            rootScope.$digest();
        });
    });
    describe('when the service calls BookingAppConstants.airlinesLogoBaseRoute + airlinesLogo[i].url', () => {
        it(' url should be exists', (done) => {
            const mockObject = [
                {
                    passengerId: 500
                },
                {
                    passengerId: 500
                }
            ];
            let mockPassengersId;
            mockPassengersId = bookingUtilsService.getPassengersId(mockObject);
            expect(mockPassengersId).toBe('?passengerId=500&passengerId=500');
            done();
            rootScope.$digest();
        });
        it(' url should be exists', (done) => {
            let mockPassengersId;
            mockPassengersId = bookingUtilsService.getPassengersId();
            expect(mockPassengersId).toBe('');
            done();
            rootScope.$digest();
        });
    });
    describe('when the service calls getCommercialsellingDataByMarket', () => {
        it('and commercialData[j].market.code === BookingAppConstants.market', (done) => {
            let response;
            const mockCommercialData = [{ market: { code: 'ES' } }];
            response = bookingUtilsService.getCommercialsellingDataByMarket(mockCommercialData);
            expect(response).toBe(mockCommercialData[0]);
            done();
            rootScope.$digest();
        });
    });
    describe('when the service calls getCommercialsellingDataByMarket', () => {
        it(' and endpoints should be key: host+basepath', (done) => {
            let response;
            const mockEndpointsData = [{ key: 'key', host: 'host', basepath: 'basepath' }];
            bookingUtilsService.saveEndpoints(mockEndpointsData);
            response = fakeSessionStorage.get('endpoints');
            expect(response).toEqual({ key: 'hostundefined' });
            done();
            rootScope.$digest();
        });
    });
    describe('when the service calls getPassengersBreakdownInfo', () => {
        it(' and endpoints should be key: host+basepath', (done) => {
            let response;
            const mockServiceData = {
                order: {
                    orderItems: [{
                        passengerPrices: [{
                            price: {
                                tax: 'tax',
                                fare: 'fare',
                                currency: 'currency'
                            },
                            taxes: [{ taxes: 'precios' }],
                            passengerId: 'Id_500'
                        }]
                    }]
                },
                offers: [],
                contextMetadata: { currencies: [{ code: 3 }] }
            };
            const currency = 'moneda';
            response = bookingUtilsService.getPassengersBreakdownInfo(mockServiceData, currency);
            expect(response).toEqual({ generalData: {} });
            done();
            rootScope.$digest();
        });
    });
    describe('When the service calls getTypeOfPassenger', () => {
        describe('and type of passenger is infant', () => {
            describe('and is INFANT in the returnFlight too', () => {
                it('should return type INFANT', (done) => {
                    let response, mockOriginDestination = { dates: { outboundFlight: '2020-03-09', returnFlight: '2020-03-15' } };
                    fakeSessionStorage.set('originDestination', mockOriginDestination);
                    response = bookingUtilsService.getTypeOfPassenger('2018-03-16');
                    expect(response).toBe('INFANT');
                    done();
                });
            });
        });
        describe('and type of passenger is child', () => {
            describe('and is CHILD in the returnFlight', () => {
                it('should return type CHILD', (done) => {
                    let response, mockOriginDestination = { dates: { outboundFlight: '2020-03-09', returnFlight: '2020-03-15' } };
                    fakeSessionStorage.set('originDestination', mockOriginDestination);
                    response = bookingUtilsService.getTypeOfPassenger('2018-03-15');
                    expect(response).toBe('CHILD');
                    done();
                });
            });
            describe('and is CHILD in the outboundFlight', () => {
                it('should return type CHILD', (done) => {
                    let response, mockOriginDestination = { dates: { outboundFlight: '2020-03-09' } };
                    fakeSessionStorage.set('originDestination', mockOriginDestination);
                    response = bookingUtilsService.getTypeOfPassenger('2018-03-09');
                    expect(response).toBe('CHILD');
                    done();
                });
            });
        });
        describe('and type of passenger is senior', () => {
            it('should return type SENIOR', (done) => {
                let response, mockOriginDestination = { dates: { outboundFlight: '2020-03-09' } };
                fakeSessionStorage.set('originDestination', mockOriginDestination);
                response = bookingUtilsService.getTypeOfPassenger('1955-03-09');
                expect(response).toBe('SENIOR');
                done();
            });
        });
        describe('and type of passenger is adult', () => {
            it('should return type ADULT', (done) => {
                let response, mockOriginDestination = { dates: { outboundFlight: '2020-03-09' } };
                fakeSessionStorage.set('originDestination', mockOriginDestination);
                response = bookingUtilsService.getTypeOfPassenger('1990-03-09');
                expect(response).toBe('ADULT');
                done();
            });
        });
    });
    describe('When the service calls isUserLogged', () => {
        it('should return that the user is logged', (done) => {
            let response;
            fakeSessionStorage.set('userLogged', true);
            response = bookingUtilsService.isUserLogged();
            expect(response).toBeTruthy();
            done();
        });
    });
    describe('When the service calls getRelatedContent', () => {
        describe('and relatedContent exist', () => {
            it('should return relatedContent data', (done) => {
                const content = [{ key: 0, value: 'content' }];
                bookingUtilsService.getRelatedContent(content);
                done();
            });
        });
        describe('and relatedContent doesnt exist', () => {
            it('should return null', (done) => {
                bookingUtilsService.getRelatedContent();
                done();
            });
        });
    });
    describe('When the service calls getFormatedDate', () => {
        describe('and exist language and commercialData', () => {
            it('should return formatedDate short', (done) => {
                let response;
                rootScope.appLang = 'ES';
                localStorageService.set('commercialData', {
                    languages: [{
                        code: 'es', dateFormat: {
                            long: 'd\' de \'MMMM\' de \'yyyy',
                            medium: 'dd-MMM-yyyy',
                            short: 'd/MM/yy'
                        }
                    }]
                });
                response = bookingUtilsService.getFormatedDate('2020-03-10', 'YYYY-MM-DD');
                expect(response.formatedDate).toBe('Mar 10, 2020');
                done();
            });
        });
        describe('and exist language and commercialData', () => {
            it('should return formatedDate short', (done) => {
                let response;
                rootScope.appLang = 'IT';
                localStorageService.set('commercialData', {
                    languages: [{
                        code: 'es', dateFormat: {
                            long: 'd\' de \'MMMM\' de \'yyyy',
                            medium: 'dd-MMM-yyyy',
                            short: 'd/MM/yy'
                        }
                    }]
                });
                response = bookingUtilsService.getFormatedDate('2020-03-10', 'YYYY-MM-DD');
                expect(response.formatedDate).toBe('Mar 10, 2020');
                done();
            });
        });
        describe('and doesnt exist language and commercialData', () => {
            it('should return formatedDate by filter date', (done) => {
                let response;
                response = bookingUtilsService.getFormatedDate('2020-03-10', 'YYYY-MM-DD');
                expect(response.formatedDate).toBe('Mar 10, 2020');
                done();
            });
        });

    });
    describe('When the service calls getSliceDetailsById', () => {
        describe('and sliceId is the same', () => {
            it('should return sliceInfo', (done) => {
                let response;
                response = bookingUtilsService.getSliceDetailsById(0, [{ sliceId: 0, segments: [{ departure: 'MAD', arrival: 'BCN' }] }]);
                expect(response.origin).toBe('MAD');
                expect(response.arrival).toBe('BCN');
                done();
            });
        });
        describe('and sliceId isnt the same', () => {
            it('should return sliceInfo', (done) => {
                bookingUtilsService.getSliceDetailsById(0, [{ sliceId: 1, segments: [{ departure: 'MAD', arrival: 'BCN' }] }]);
                done();
            });
        });
    });
    describe('When the service calls getStatusResident', () => {
        describe('if booking app constants and booking url params exists:', () => {
            it('should return true', (done) => {
                const mockbookparams = { resident: true };
                fakeSessionStorage.set('bookingUrlParams', mockbookparams);
                bookingUtilsService.getStatusResident();
                done();
            });
        });
        describe('if booking app constants and booking url params does not exists:', () => {
            it('should return', (done) => {
                fakeSessionStorage.set('bookingUrlParams', 'bookingUrlParams');
                bookingUtilsService.getStatusResident();
                done();
            });
        });
    });


    describe('When the service calls fillZipCodeByState', () => {
        it('should return fillZipCodeByStateInfo data', (done) => {
            let response;
            response = bookingUtilsService.fillZipCodeByState({ normalizedCode: [{ code: 'ES' }], code: 'es' }, 28035);
            expect(response.checker).toBeFalsy();
            done();
        });
    });
    describe('When the service calls getNewAvailabilityRequest', () => {
        describe('user logged as ONB', () => {
            describe('and doesnt exist discount', () => {
                describe('and exist segments', () => {
                    it('should return newRequestData', (done) => {
                        let response;
                        rootScope.isLogged = 'ONB';
                        response = bookingUtilsService.getNewAvailabilityRequest({ marketCode: 'ES', passengers: 1, slices: [{ segments: [{ cabin: 'Turista' }], origin: 'DMK', destination: 'MAD' }] });
                        expect(response.preferredCabin).toBe('Turista');
                        done();
                    });
                });
                describe('and doesnt exist segments', () => {
                    it('should return newRequestData', (done) => {
                        let response;
                        rootScope.isLogged = 'ONB';
                        response = bookingUtilsService.getNewAvailabilityRequest({ marketCode: 'ES', passengers: 2, preferredCabin: 'Business', slices: [{}] });
                        expect(response.preferredCabin).toBe('Business');
                        done();
                    });
                });
            });
            describe('and exist discount', () => {
                it('should return newRequestData', (done) => {
                    let response;
                    rootScope.isLogged = 'ONB';
                    localStorageService.set('oBDiscountType', true);
                    response = bookingUtilsService.getNewAvailabilityRequest({ marketCode: 'ES', passengers: 1, slices: [{ preferredCabin: 'Business' }] });
                    expect(response.specificFare).toBeTruthy();
                    done();
                });
            });
        });
        describe('user logged as IB+', () => {
            it('should return newRequestData', (done) => {
                rootScope.isLogged = 'IB+';
                localStorageService.set('oBDiscountType', true);
                bookingUtilsService.getNewAvailabilityRequest({ marketCode: 'ES', passengers: 1, slices: [{ preferredcabin: 'Business' }] });
                done();
            });
        });
    });
    describe('getOriginDestination is called', () => {
        it('and there is senior, young, teenager, adult, child and infant', fakeAsync(() => {
            const mockOriginDestination = [
                {
                    origin: 'MAD',
                    destination: 'BIO',
                    date: '2023-01-13'
                },
                {
                    origin: 'BIO',
                    destination: 'PAR',
                    date: '2023-01-14'
                }
            ];
            const passengers = [
                {
                    passengerType: 'SENIOR',
                    count: 1
                },
                {
                    passengerType: 'ADULT',
                    count: 1
                },
                {
                    passengerType: 'YOUTH',
                    count: 1
                },
                {
                    passengerType: 'TEENAGER',
                    count: 1
                },
                {
                    passengerType: 'CHILD',
                    count: 1
                },
                {
                    passengerType: 'INFANT',
                    count: 1
                }
            ];
            fakeSessionStorage.remove('destinationCitiesList');
            fakeSessionStorage.set('searchFlightType', 'availabilityFlight');
            fakeSessionStorage.set('destinationCitiesList', [{ code: 'MAD', country: { code: 'ES', description: 'España' }, description: 'A coruña', timezone: 'Europe/Madrid' }]);
            fakeWindow.innerWidth = 600;
            const returnData = bookingUtilsService.getOriginDestination(mockOriginDestination, passengers);
            expect(returnData).toEqual({
                originCity: { code: 'MAD', country: Object({ code: 'ES', description: 'España' }), description: 'A coruña', timezone: 'Europe/Madrid' },
                destinationCity: null, dates: { outboundFlight: '2023-01-13', formatedOutboundFlight: new Date(new Date('2023-01-13').setHours(0,0,0,0)), returnFlight: '2023-01-14', formatedReturnFlight: new Date(new Date('2023-01-14').setHours(0,0,0,0)) }, passengers: 6, numAdults: 1, numSeniors: 1, numYoung: 1, numTeenager: 1, numInfant: 1, numChilds: 1, numberPassengrsWithoutInfant: 5
            });

        }));
    });
    describe('generateAvailabilityRequestData is called', () => {
        beforeEach(() => {
            fakeWindow.location.href = 'www.prueba.com/?flashOffer=true#!/availability';
            fakeIbCheckPartnersDiscountsService.getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.callFake(() => {
                return null;
            });
            fakeSessionStorage.set('membershipData', membershipData);
        });
        it('', (done) => {
            fakeSessionStorage.set('bookingUrlParams', fakebookingUrlParams);
            const returnData = bookingUtilsService.generateAvailabilityRequestData();
            expect(returnData).toEqual({
                isPetFlight: false,
                slices: [
                    { origin: 'MAD', destination: 'VLC', date: '2021-06-08' }],
                passengers: [
                    { passengerType: 'SENIOR', count: 1 },
                    { passengerType: 'ADULT', count: 1 },
                    { passengerType: 'YOUTH', count: 1 },
                    { passengerType: 'YOUNG_ADULT', count: 1 },
                    { passengerType: 'CHILD', count: 1 },
                    { passengerType: 'INFANT', count: 1 }
                ], marketCode: 'ES', preferredCabin: 'ECONOMY'
            });
            done();
        });
    });
    describe('generateCalendarRequestData is called', () => {
        beforeEach(() => {
            fakeIbCheckPartnersDiscountsService.getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.callFake(() => {
                return null;
            });
        });
        it('', () => {
            fakeSessionStorage.remove('newAvailabilityRequestData');
            fakeSessionStorage.set('bookingUrlParams', fakebookingUrlParams);
            fakeSessionStorage.set('availabilityRequestData', { marketCode: 'ES', passengers: [{ count: 1, passengerType: 'ADULT' }], slices: [{ daysAfter: 0, daysBefore: 0 }] });
            const returnData = bookingUtilsService.generateCalendarRequestData(3, 3, 0, 0);
            expect(returnData).toEqual(mockReturnCalendarRequest);

        });
    });
    describe('generateOBPointsRequestData is called', () => {
        it('', () => {
            const responseGenerateOB = {
                discountUsed: false,
                currency: 'EUR',
                segments: [
                    {
                        origin: 'MAD',
                        destination: 'BIO',
                        cabinClass: 'ECONOMY',
                        rbd: 'Q',
                        marketingFlightNumber: '0448',
                        marketingPartnerCode: 'IB',
                        operationalPartnerCode: 'IB',
                        aircraftOwner: 'IB',
                        bookingDate: dayjs().format('YYYY-MM-DD'),
                        departureDate: '2023-02-08',
                        arrivalDate: '2023-02-08'
                    }
                ],
                passengers: [
                    {
                        passengerType: 'ADULT',
                        totalFare: 43.12,
                        taxesFeesAndCharges: 20.22,
                        gasFee: '0'
                    }
                ]
            };
            fakeSessionStorage.set('avSelectedOffer', mockAvSelectedOffer);
            const returnData = bookingUtilsService.generateOBPointsRequestData(mockSelectedSlices);
            expect(returnData).toEqual(responseGenerateOB);
        });
    });
    describe('getURLFirstParameterByName is called', () => {
        it('', () => {
            bookingUtilsService.getURLFirstParameterByName('test');
            expect(fakeUrlUtilsService.getURLFirstParameterByName).toHaveBeenCalledWith('test');
        });
    });
    describe('removeParam is called', () => {
        it('', () => {
            const returnData = bookingUtilsService.removeParam('flashOffer');
            expect(returnData).toBeDefined();
        });
    });
    describe('getBackGroundURL is called', () => {
        it('', () => {
            fakeWindow.innerWidth = 1025;
            fakeSessionStorage.set('backgroundImagesList', mockBackgroundImagesList);
            const returnData = bookingUtilsService.getBackGroundURL('MAD');
            expect(returnData).toEqual('/background/madrid/disponibilidad_madrid_2000.jpg');
        });
    });
    describe('getTripsBreakdownInfo is called', () => {
        it('', () => {
            fakeSessionStorage.set('fareData', {
                fareFamilyConditions: [
                    {
                        cabinDescription: 'Turista',
                        cabinType: 'E',
                        commercialCode: 'EUAJFLE',
                        commercialName: 'Flexible',
                        commercialNameES: 'Flexible',
                        conditions: [{ code: 'EQMANO', name: 'Equipaje de mano', text: '1 bulto', units: 1 }]
                    }
                ]
            });
            const returnData = bookingUtilsService.getTripsBreakdownInfo(mockServiceData);
            expect(returnData).toEqual(mockResponseTripsBreakdown);
        });
    });
    describe('getPassengersBreakdownInfo is called', () => {
        it('', () => {
            fakeSessionStorage.set('passengersSpecialNeeds', []);
            const returnData = bookingUtilsService.getPassengersBreakdownInfo(mockServiceDataPassengersBreakDown, 'EUR');
            expect(returnData).toEqual(mockResponseGetPassengersBreakdown);
        });
    });
    describe('backToMain is called', () => {
        beforeEach(() => {
            fakeSessionStorage.clearAll();
            rootScope.isRedemptionFlow = false;

        });
        it('back to home and redirect to cug', () => {
            const urlParams = JSON.parse(JSON.stringify(fakebookingUrlParams));
            urlParams.backToUrl = '/back';
            fakeSessionStorage.set('bookingUrlParams', urlParams);
            bookingUtilsService.backToMain(true);
            expect(fakeWindow.location.href).toEqual('www.prueba.com/back');
        });
        it('back to home when redirected market', () => {
            const urlParams = JSON.parse(JSON.stringify(fakebookingUrlParams));
            urlParams.fromMarket = 'ES';
            urlParams.fromLanguage = 'es';
            fakeSessionStorage.set('bookingUrlParams', urlParams);
            bookingUtilsService.backToMain(true);
            expect(fakeWindow.location.href).toEqual('www.prueba.com/es/es/');
        });
        it('back to home', () => {
            fakeSessionStorage.set('bookingUrlParams', fakebookingUrlParams);
            bookingUtilsService.backToMain(true);
            expect(fakeWindow.location.href).toEqual('www.prueba.com');
        });
        it('back to home false and back to cug', () => {
            const urlParams = JSON.parse(JSON.stringify(fakebookingUrlParams));
            urlParams.backToUrl = '/back';
            fakeSessionStorage.set('bookingUrlParams', urlParams);
            bookingUtilsService.backToMain(false);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith('www.prueba.com/back');
        });
        it('back to home false and is redemption Onbusiness', () => {
            rootScope.isRedemptionFlow = true;
            rootScope.isPointsOBFlow = true;
            bookingUtilsService.backToMain(false);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith('link|IBERIA_NEW_ONB_REDEMPTION_SEARCH_ENGINE');
        });
        it('back to home false and is ibplus redemption', () => {
            rootScope.isRedemptionFlow = true;
            rootScope.isPointsOBFlow = false;
            bookingUtilsService.backToMain(false);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith('link|IBERIA_NEW_REDEMPTION_SEARCH_ENGINE');
        });
        it('back to home false and is multisearch', () => {
            fakeSessionStorage.set('multiCitySearch', true);
            fakeSessionStorage.set('searchFlightType', 'multiCityFlight');
            fakeSessionStorage.set('isHMAD', false);
            bookingUtilsService.backToMain(false);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith('link|IBERIA_MULTIPLE_TRACKS_SEARCH_ENGINE');
        });
        it('back to home false and is hmad', () => {
            fakeSessionStorage.set('multiCitySearch', true);
            fakeSessionStorage.set('searchFlightType', 'multiCityFlight');
            fakeSessionStorage.set('isHMAD', true);
            bookingUtilsService.backToMain(false);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith('link|IBERIA_STOPOVER_MADRID_SEARCH_ENGINE');
        });
    });
    describe('onholdLightBoxAccept is called', () => {
        beforeEach(() => {
            fakeBookingChangeOnHoldOrderService.changeOnHoldOrder = jasmine.createSpy('changeOnHoldOrder').and.callFake(() => {
                return Promise.resolve({});
            });
            fakeNewMainHeaderFacade.updateHeaderModelOnHold = jasmine.createSpy('updateHeaderModelOnHold').and.callFake(() => {
                return { shoppingBasket: { total: { original: '', formatted: '' }, segmentsInfo: '', trips: '' } };
            });
            fakeSessionStorage.set('flowId', 'BKI');
            fakeSessionStorage.set('actualStepFlow', 'BKI');
            fakeSessionStorage.set('headerModel', mockHeaderModel);
        });
        it('', (done) => {
            bookingUtilsService.onholdLightBoxAccept();
            expect(fakeSessionStorage.get('flowId')).toBe('BKI');
            done();
        });
    });
    describe('setSelectedTripInfoinStorage', () => {
        it('Format and set in sessionStorage', () => {
            bookingUtilsService.setSelectedTripInfoinStorage(mockSelectedSlices);
            const result = fakeSessionStorage.get('selectedTripInfo');
            expect(result).toBeDefined();
            expect(result[0].info.cabins.E.fareFamilies[0].offers).toBeUndefined();
        });
    });
    describe('getEndpoint is called', () => {
        it('it will return the following endpoint', () => {
            fakeSessionStorage.set('endpoints', { prueba: {}, test: 1 });
            const result = bookingUtilsService.getEndpoint('prueba');
            expect(result).toEqual({});
        });
    });
    describe('generateBuildNumberQueryString is called', () => {
        it('it will return the meta tag value', () => {
            fakeSessionStorage.set('endpoints', { prueba: {}, test: 1 });
            const result = bookingUtilsService.generateBuildNumberQueryString();
            expect(result).toEqual('');
        });
    });
    describe('getNumberTypePas is called', () => {
        beforeEach(() => {
            fakeSessionStorage.remove('bookingUrlParams');
            fakeSessionStorage.set('bookingUrlParams', { adult: 2, child: 1, infant: 1 });
        });
        it('it will return the number of passengers', () => {
            const result = bookingUtilsService.getNumberTypePas();
            expect(result).toEqual({ ADULT: 2, CHILD: 1, INFANT: 1 });
        });
    });
    describe('checkCreditCardExpiryDate is called', () => {
        beforeEach(() => {
        });
        it('it will return the number of passengers', () => {
            const result = bookingUtilsService.checkCreditCardExpiryDate('0940');
            expect(result).toEqual(false);
        });
    });
    describe('getCreditCardIcon is called', () => {
        beforeEach(() => {
        });
        it('it will return the number of passengers', () => {
            const result = bookingUtilsService.getCreditCardIcon('VI', [{ cardTypeId: 'VI', name: 'Visa' }]);
            expect(result).toEqual('/iberia-web-content/iconos/payment/Visa');
        });
    });
    describe('fillMemberIdentifierWithZeros is called', () => {
        beforeEach(() => {
        });
        it('it will return the member identifier filled with zeros', () => {
            const result = bookingUtilsService.fillMemberIdentifierWithZeros('26565');
            expect(result).toEqual('00000000026565');
        });
    });
    describe('trunkateMaxLength is called', () => {
        beforeEach(() => {
        });
        it('and it is resident, it will return truncate lastName due to max length property', () => {
            const result = bookingUtilsService.trunkateMaxLength(true, { surname: 'Perez', lastSurname: 'García' });
            expect(result).toEqual({ surname: 'Perez', lastSurname: 'García' });
        });
        it('and it is not resident, it will return truncate lastName due to max length property', () => {
            const result = bookingUtilsService.trunkateMaxLength(false, { surname: 'Perez', lastSurname: 'García' });
            expect(result).toEqual({ surname: 'Perez', lastSurname: 'García' });
        });
    });

    describe('setSegmentOfSelectedTrip', () => {
        it('should store an array of normalized segment arrays in sessionStorage', () => {
            const trips = [{info: {segments: [{ id: 'S1', foo: 123 },{ segmentId: 'S2', bar: 456 }]}}];

            bookingUtilsService.setSegmentOfSelectedTrip(trips);

            const stored = fakeSessionStorage.get('selectedTripSegments');

            expect(stored).toEqual([
                [
                    { id: 'S1', foo: 123, segmentId: 'S1' },
                    { segmentId: 'S2', bar: 456 }
                ]
            ]);
        });

    });

    describe('redirectToFlash is called', () => {
        beforeEach(() => {
            rootScope.appLang = 'es';
            rootScope.appMarket = 'ES';
        });
        it('should redirect to Flash Offer app', () => {
            bookingUtilsService.redirectToFlash();
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalledWith('www.prueba.com/es/es/flash-offers/#!/FLASHO');
        });
    });

    describe('addPriceParametersInDigitalInfo is called', () => {
        beforeEach(() => {
        });
        it('should add price attributes to datalayer', () => {
            bookingUtilsService.addPriceParametersInDigitalInfo('€', 12, 10);
            expect(fakeDigitalDataService.addDigitalDataInfo).toHaveBeenCalledWith(10);
        });
    });
    describe('addflightHaulInDigitalInfo is called', () => {
        beforeEach(() => {
        });
        it('should add flight haul attribute to datalayer', () => {
            bookingUtilsService.addflightHaulInDigitalInfo('Corto Radio');
            expect(fakeDigitalDataService.addDigitalDataInfo).toHaveBeenCalledWith('Corto Radio');
        });
    });
    describe('checkUserMustFlyFromFare is called', () => {
        beforeEach(() => {
            fakeSessionStorage.set('fareData', { offers: [{ discountsApplied: { discounts: [{ type: 'PARTNER', userMustFly: true }] } }] });
        });
        it('and it has discounts, should check if user is able to fly', () => {
            const returnValue = bookingUtilsService.checkUserMustFlyFromFare({ userMustFly: true });
            expect(returnValue).toEqual(true);
        });
        it('and it hasnt discounts, should check if user is able to fly', () => {
            fakeSessionStorage.set('fareData', { offers: [{ discountsApplied: {} }] });
            const returnValue = bookingUtilsService.checkUserMustFlyFromFare({ userMustFly: true });
            expect(returnValue).toEqual(false);
        });
    });
    describe('getOriginDestination is called', () => {
        it('and there is no passengers defined', fakeAsync(() => {
            bookingUtilsService.getOriginDestination = jasmine.createSpy('getOriginDestination').and.callFake(() => {
                return {
                    originCity: { code: 'MAD', country: Object({ code: 'ES', description: 'España' }), description: 'A coruña', timezone: 'Europe/Madrid' },
                    destinationCity: null, dates: { outboundFlight: '2023-01-13', formatedOutboundFlight: new Date(new Date('2023-01-13').setHours(0,0,0,0)), returnFlight: '2023-01-14', formatedReturnFlight: new Date(new Date('2023-01-14').setHours(0,0,0,0)) }, passengers: 1, numAdults: 1, numSeniors: 0, numYoung: 0, numTeenager: 0, numInfant: 0, numChilds: 0, numberPassengrsWithoutInfant: 1
                };
            });
            const mockOriginDestination = [
                {
                    origin: 'MAD',
                    destination: 'BIO',
                    date: '2023-01-13'
                },
                {
                    origin: 'BIO',
                    destination: 'PAR',
                    date: '2023-01-14'
                }
            ];
            fakeSessionStorage.remove('destinationCitiesList');
            fakeSessionStorage.set('searchFlightType', 'availabilityFlight');
            fakeSessionStorage.set('destinationCitiesList', [{ code: 'MAD', country: { code: 'ES', description: 'España' }, description: 'A coruña', timezone: 'Europe/Madrid' }]);
            fakeWindow.innerWidth = 600;
            const returnData = bookingUtilsService.getOriginDestination(mockOriginDestination, []);
            flush();
            expect(returnData).toEqual({
                originCity: { code: 'MAD', country: Object({ code: 'ES', description: 'España' }), description: 'A coruña', timezone: 'Europe/Madrid' },
                destinationCity: null, dates: { outboundFlight: '2023-01-13', formatedOutboundFlight: new Date(new Date('2023-01-13').setHours(0,0,0,0)), returnFlight: '2023-01-14', formatedReturnFlight: new Date(new Date('2023-01-14').setHours(0,0,0,0)) }, passengers: 1, numAdults: 1, numSeniors: 0, numYoung: 0, numTeenager: 0, numInfant: 0, numChilds: 0, numberPassengrsWithoutInfant: 1
            });

        }));
    });
});
