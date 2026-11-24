describe('PMT transformer test', () => {

    let PmtTransformer, rootScope, returnedValue, localStorageService;

    const fakeAppConstants = {
        QUADRIGAMS: {
            PAYMENTS_PCC: 'IBPCC',
            PAYMENTS_REJECTED: 'IBREJC',
            PAYMENTS_DENIED: 'IBCCDN',
            PAYMENTS_CANCELLED: 'IBCNCL',
            FLIGHT_CONFIRMATION: 'TCFREV',
            SEARCH: 'CHKTRP',
            LOGGED_SEARCH: 'MYTRPS',
            TRIP_DETAILS: 'IBMTDT',
            CHANGE_FLIGHT: 'TCADVS',
            CHANGE_FLIGHT_DISPO: 'TCFLPA',
            ORDER_TICKETS: 'IBENIT',
            SPECIAL_NEEDS: 'MOPMR',
            SPECIAL_NEEDS_CONFIRMED: 'MOPMRCF',
            PASSENGER_INFO: 'MOINFO',
            ON_HOLD_CONF: 'OHMTDT',
            ON_HOLD_CONF_ON_BUSINESS: 'CIPOHMTDT',
            ON_HOLD_CONF_RESIDENTS: 'OHSARA',
            ON_HOLD_CONF_LOGIN: 'OHLOIN',
            ON_HOLD_CONF_PAYMENT: 'OHINFO',
            ON_HOLD_CONF_PAYMENT_ON_BUSINESS: 'CIPOHINFO',
            ON_HOLD_CONF_PAYMENT_WAIT: 'OHWAIT',
            ON_HOLD_CONF_PAYMENT_FRAUD: 'OHPCC',
            ON_HOLD_CONF_CONFIRMATION: 'RTBKCF',
            ON_HOLD_CONF_CONFIRMATION_ON_BUSINESS: 'CIPRTBKCF',
            ON_HOLD_CONF_CANCEL_ORDER_MODAL: 'CNCLOH',
            ON_HOLD_CONF_CANCEL_ORDER_MODAL_ON_BUSINESS: 'CIPCNCLOH',
            ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION: 'CNCLIT',
            ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION_ON_BUSINESS: 'CIPCNCLIT',
            BKI_REDENTION_PAYMENT: 'IPPURC',
            BKI_REDENTION_CONFIRMATION: 'IPBKCF',
            BKI_PAYMENT: 'IBPURC',
            BKI_CONFIRMATION: 'IBBKCF',
            MMB_ANCILLARIES_PAYMENT: 'MOPURC',
            MMB_ANCILLARIES_SEATS_PAYMENT: 'STPURC',
            MMB_ANCILLARIES_BAGGAGES_PAYMENT: 'MOPBAG',
            MMB_ANCILLARIES_UPG_PAYMENT: 'SUPURC',
            MMB_ANCILLARIES_MEALS_PAYMENT: 'MEALPURC',
            MMB_ANCILLARIES_CONFIRMATION: 'MOBKCF',
            MMB_ANCILLARIES_SEATS_CONFIRMATION: 'STBKCF',
            MMB_ANCILLARIES_BAGGAGES_CONFIRMATION: 'MOCBAG',
            MMB_ANCILLARIES_UPG_CONFIRMATION: 'SUCONF',
            MMB_ANCILLARIES_MEALS_CONFIRMATION: 'MEALCF',
            BKIOH_PAYMENT: 'ONHOLD',
            BKIOH_CONFIRMATION: 'OHBKCF',
            CKI_CONFIRMATION: 'IBCKICF',
            CKI_PAYMENT: 'IBCKIPURC',
            HMAD_PAYMENTS: 'HMPURC',
            HMAD_BK_ERROR: 'HMUNKN',
            HMAD_PAYMENTS_PCC: 'HMPCC',
            HMAD_CONFIRMATION_COMMUNICATION_LOST: 'HMBKER',
            HMAD_PAYMENTS_DENIED: 'HMCCDN',
            HMAD_PAYMENTS_REJECTED: 'HMREJC',
            HMAD_CONFIRMATION: 'HMBKCF',
            MULTI_PAYMENTS: 'MTPURC',
            MULTI_BK_ERROR: 'MTUNKN',
            MULTI_PAYMENTS_PCC: 'MTPCC',
            MULTI_CONFIRMATION_COMMUNICATION_LOST: 'MTBKER',
            MULTI_PAYMENTS_DENIED: 'MTCCDN',
            MULTI_PAYMENTS_REJECTED: 'MTREJC',
            MULTI_CONFIRMATION: 'MTBKCF'
        },
        APP_TYPES: {
            BOOKING: 'BBKI',
            MANAGEMYBOOKING: 'MMB',
            MANAGEMYBOOKING_ONHOLD: 'MMBOH',
            MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
            ONHOLD: 'BBKIOH',
            CHECKIN: 'CKI'
        }
    };

    const fakeCreateOrder = {
        order: {
            orderId: 'Qm9va2luZ0BJQjg4Yjc2OTFhZDNmMTRiOWY4NjM3NTQ5ZWJjZTA3NDAxT1A%3D',
            bookingReferences: [
                {
                    provider: '1A',
                    reference: 'N7FBV2'
                }
            ],
            orderItems: [
                {
                    type: 'flight',
                    orderItemId: 'IB88b7691ad3f14b9f8637549ebce07401OP_01',
                    bookingReferences: [
                        {
                            provider: '1A',
                            reference: 'N7FBV2'
                        }
                    ],
                    price: {
                        fare: 161,
                        tax: 50.73,
                        total: 211.73,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    sliceIds: [
                        'MADFCO20191211085000',
                        'FCOMAD20200121074000'
                    ],
                    passengerPrices: [
                        {
                            fareCalculation: '11DEC19MAD IB ROM14.52IB MAD164.85NUC179.37END ROE0.894724',
                            passengerId: 'ADULT_01',
                            price: {
                                fare: 161,
                                tax: 50.73,
                                total: 211.73,
                                currency: 'EUR',
                                ticketingFee: 0
                            },
                            segmentPrices: [
                                {
                                    price: {
                                        fare: 80.5,
                                        currency: 'EUR'
                                    },
                                    fareCode: 'A2IBWBB4',
                                    segmentsIds: [
                                        'IB323020191211'
                                    ],
                                    ticketDesignator: ''
                                },
                                {
                                    price: {
                                        fare: 80.5,
                                        currency: 'EUR'
                                    },
                                    fareCode: 'IDN4AQS4',
                                    segmentsIds: [
                                        'IB323920200121'
                                    ],
                                    ticketDesignator: ''
                                }
                            ],
                            taxes: [
                                {
                                    code: 'JDAE',
                                    amount: 15.4,
                                    currency: 'EUR',
                                    description: 'Tasa de salida - Aeropuertos españoles/AENA'
                                },
                                {
                                    code: 'OGCO',
                                    amount: 0.61,
                                    currency: 'EUR',
                                    description: 'Tasa de seguridad'
                                },
                                {
                                    code: 'QVDP',
                                    amount: 3.5,
                                    currency: 'EUR',
                                    description: 'Seguridad'
                                },
                                {
                                    code: 'EXAE',
                                    amount: 2.46,
                                    currency: 'EUR',
                                    description: 'Cargo por seguridad del equipaje – Italia'
                                },
                                {
                                    code: 'HBCO',
                                    amount: 7.5,
                                    currency: 'EUR',
                                    description: 'Tasa municipal – Italia'
                                },
                                {
                                    code: 'ITEB',
                                    amount: 17.1,
                                    currency: 'EUR',
                                    description: 'Tasa de embarque – Italia'
                                },
                                {
                                    code: 'MJAD',
                                    amount: 0.96,
                                    currency: 'EUR',
                                    description: 'Cargo por servicio al pasajero de Italia - Italia'
                                },
                                {
                                    code: 'VTSE',
                                    amount: 3.2,
                                    currency: 'EUR',
                                    description: 'Cargo por seguridad - Italia'
                                }
                            ]
                        }
                    ]
                }
            ],
            slices: [
                {
                    sliceId: 'MADFCO20191211085000',
                    departureDateTime: '2019-12-11 08:50',
                    arrivalDateTime: '2019-12-11 11:20',
                    duration: 150,
                    stopsNumber: 0,
                    price: {
                        fare: 80.5,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 80.5,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                {
                                    price: {
                                        fare: 80.5,
                                        currency: 'EUR'
                                    },
                                    fareCode: 'A2IBWBB4',
                                    segmentsIds: [
                                        'IB323020191211'
                                    ],
                                    ticketDesignator: ''
                                }
                            ]
                        }
                    ],
                    segments: [
                        {
                            departure: {
                                code: 'MAD',
                                name: 'Madrid',
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
                                code: 'FCO',
                                name: 'Roma-Fiumicino',
                                terminal: '3',
                                city: {
                                    code: 'ROM',
                                    description: 'Roma',
                                    countryCode: 'IT',
                                    country: {
                                        code: 'IT',
                                        description: 'Italia'
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
                                marketingFlightNumber: '3230',
                                operationalFlightNumber: null,
                                operationalDisclosure: 'IB',
                                aircraft: {
                                    code: '32A',
                                    description: 'Airbus A320'
                                }
                            },
                            cabin: {
                                rbd: 'A',
                                bookingCode: 'R',
                                bookingClass: 'ECONOMY',
                                remainingSeats: 9,
                                fareFamily: 'TBAESEU',
                                seatDisplays: null,
                                cabinDescription: ''
                            },
                            overnight: false,
                            id: 'IB323020191211',
                            duration: 150,
                            waitingTime: 0,
                            providerId: null,
                            ticketDesignator: '',
                            departureDateTime: '2019-12-11 08:50',
                            arrivalDateTime: '2019-12-11 11:20'
                        }
                    ],
                    overnight: false
                },
                {
                    sliceId: 'FCOMAD20200121074000',
                    departureDateTime: '2020-01-21 07:40',
                    arrivalDateTime: '2020-01-21 10:15',
                    duration: 155,
                    stopsNumber: 0,
                    price: {
                        fare: 80.5,
                        currency: 'EUR'
                    },
                    detailedPrices: [
                        {
                            fare: 80.5,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                {
                                    price: {
                                        fare: 80.5,
                                        currency: 'EUR'
                                    },
                                    fareCode: 'IDN4AQS4',
                                    segmentsIds: [
                                        'IB323920200121'
                                    ],
                                    ticketDesignator: ''
                                }
                            ]
                        }
                    ],
                    segments: [
                        {
                            departure: {
                                code: 'FCO',
                                name: 'Roma-Fiumicino',
                                terminal: '3',
                                city: {
                                    code: 'ROM',
                                    description: 'Roma',
                                    countryCode: 'IT',
                                    country: {
                                        code: 'IT',
                                        description: 'Italia'
                                    }
                                }
                            },
                            arrival: {
                                code: 'MAD',
                                name: 'Madrid',
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
                            flight: {
                                marketingCarrier: {
                                    code: 'IB',
                                    name: 'Iberia'
                                },
                                operationalCarrier: {
                                    code: 'IB',
                                    name: 'Iberia'
                                },
                                marketingFlightNumber: '3239',
                                operationalFlightNumber: null,
                                operationalDisclosure: 'IB',
                                aircraft: {
                                    code: '32A',
                                    description: 'Airbus A320'
                                }
                            },
                            cabin: {
                                rbd: 'I',
                                bookingCode: 'B',
                                bookingClass: 'BUSINESS',
                                remainingSeats: 5,
                                fareFamily: 'BREESES',
                                seatDisplays: null,
                                cabinDescription: ''
                            },
                            overnight: false,
                            id: 'IB323920200121',
                            duration: 155,
                            waitingTime: 0,
                            providerId: null,
                            ticketDesignator: '',
                            departureDateTime: '2020-01-21 07:40',
                            arrivalDateTime: '2020-01-21 10:15'
                        }
                    ],
                    overnight: false
                }
            ],
            price: {
                fare: 161,
                tax: 50.73,
                total: 211.73,
                currency: 'EUR',
                ticketingFee: 0
            },
            primaryContactInfo: {
                phone: '34625999180',
                email: 'accept@accept.com',
                phoneType: 'MOBILE'
            },
            timeLimit: '2019-12-09T23:59:59.000+01:00',
            privateFareImformations: [

            ],
            commissions: [

            ],
            apisRequired: false,
            specialDiscounts: [

            ],
            extSenderReference: null,
            bookingOffice: 'MAD175'
        },
        passengers: [
            {
                passengerType: 'ADULT',
                personalInfo: {
                    firstName: 'HanSolo',
                    firstSurname: 'Test',
                    lastSurname: null,
                    birthDate: null,
                    surnameSuffix: null
                },
                passengerId: 'ADULT_01',
                idInfo: null,
                contactInfo: null,
                residenceAccreditationStatus: null,
                documentInfos: null,
                redressInfo: null,
                emergencyContactInfo: null
            }
        ],
        tickets: [

        ],
        warnings: [

        ],
        paymentsInfo: [

        ],
        contextMetadata: {
            language: 'es',
            country: 'ES',
            currencies: [
                {
                    code: 'EUR',
                    description: 'Euro',
                    symbol: '€',
                    alignment: 'R',
                    groupingSeparator: '.',
                    decimalSeparator: ',',
                    decimals: 2,
                    recommendedDisplay: 'symbol'
                }
            ]
        },
        feeInformations: [

        ],
        errorsWithAdditionalInfo: null,
        identificator: null
    };

    const fakeUtilsService ={

    }
    const fakeCurrencyService ={

    }

    beforeEach(() => {
        angular.mock.module('ib-pmt-module', 'LocalStorageModule', ($provide) => {
            $provide.value('PmtConstants', fakeAppConstants);
            $provide.value('PmtUtilsService', fakeUtilsService);
            $provide.value('CurrencyService', fakeCurrencyService);

        });

        inject((_PmtTransformer_, $rootScope, _localStorageService_) => {
            rootScope = $rootScope;
            rootScope.appMarket = 'ES';

            PmtTransformer = _PmtTransformer_;
            localStorageService = _localStorageService_;

            localStorageService.set('flowApp', 'BBKI');
            localStorageService.set('createOrderData', fakeCreateOrder);

        });
    });

    describe('When getPaymentsModel is called and is bkki flow', () => {

        it('is bkki flow', (done) => {
            returnedValue = PmtTransformer.getPaymentsModel();

            localStorageService.remove('isHMAD');
            localStorageService.remove('multiCitySearch');

            expect(returnedValue.ident).toEqual(fakeCreateOrder.order.orderId);
            expect(returnedValue.issueCountry).toEqual('ES');

            done();
        });

        it('is bkki flow and dont have market', (done) => {
            rootScope.appMarket = undefined;
            returnedValue = PmtTransformer.getPaymentsModel();

            expect(returnedValue.ident).toEqual(fakeCreateOrder.order.orderId);
            expect(returnedValue.issueCountry).toBe(null);

            done();
        });

        it('is redepmtion flow ', (done) => {
            rootScope.isRedemptionFlow = true;
            returnedValue = PmtTransformer.getPaymentsModel();

            expect(returnedValue.ident).toEqual(fakeCreateOrder.order.orderId);
            expect(returnedValue.issueCountry).toEqual('ES');
            done();
        });

        it('is isHMAD flow ', (done) => {
            localStorageService.set('isHMAD', true);
            returnedValue = PmtTransformer.getPaymentsModel();

            expect(returnedValue.ident).toEqual(fakeCreateOrder.order.orderId);
            expect(returnedValue.issueCountry).toEqual('ES');
            done();
        });

        it('is multiCitySearch flow ', (done) => {
            localStorageService.remove('isHMAD');
            localStorageService.set('multiCitySearch', true);
            returnedValue = PmtTransformer.getPaymentsModel();

            expect(returnedValue.ident).toEqual(fakeCreateOrder.order.orderId);
            expect(returnedValue.issueCountry).toEqual('ES');
            done();
        });

        it('and dont have flow app', (done) => {
            localStorageService.remove('flowApp');
            returnedValue = PmtTransformer.getPaymentsModel();
            expect(returnedValue.originFlow).toBe(null);
            done();
        });

        it('is BBKIOH flow', (done) => {
            localStorageService.set('flowApp', 'BBKIOH');
            localStorageService.remove('isHMAD');
            localStorageService.remove('multiCitySearch');

            returnedValue = PmtTransformer.getPaymentsModel();

            expect(returnedValue.ident).toEqual(fakeCreateOrder.order.orderId);
            expect(returnedValue.issueCountry).toEqual('ES');

            done();
        });

    });
});