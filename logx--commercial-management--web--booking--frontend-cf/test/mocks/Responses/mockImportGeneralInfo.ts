import dayjs from 'dayjs';

export const mockGeneralInfo = {
    notConfirmable: false,
    pnr: 'J6W8H',
    origin: {
        code: 'MAD',
        name: 'ADOLFO SUAREZ BARAJAS',
        terminal: '4',
        city: {
            code: 'MAD',
            description: 'Madrid',
            countryCode: 'ES',
            country: {
                code: 'ES',
                description: 'Spain'
            }
        }
    },
    destination: {
        code: 'BIO',
        name: 'BILBAO AIRPORT',
        terminal: null,
        city: {
            code: 'BIO',
            description: 'Bilbao',
            countryCode: 'ES',
            country: {
                code: 'ES',
                description: 'Spain'
            }
        }
    },
    departureTime: {
        date: '2025-06-19',
        time: '15:50'
    },
    returnFlight: null,
    tripType: 1,
    flightRatio: 'Corto Radio',
    passengersNumber: 1,
    currency: {
        suffixSymbol: true,
        decimalSeparator: '.',
        numberDecimals: 2,
        groupingSeparator: ',',
        currencySymbol: '€',
        description: 'Euro'
    },
    relatedContent: {
        'CONFIRM_ONHOLD_CONDITIONS': {}
    },
    backgroundImageUrl: 'https://preb.iberia.es/wcs/imagenes/destinos/calculadoraAvios/BIO_2000_834.jpg',
    primaryContactInfo: {
        email: 'TEST@GMAIL.COM',
        phone: '345555555555555555'
    },
    passengerPrices: {
        ADULT: {
            fare: 80,
            formattedFare: '80.00€',
            formattedInTax: '20.37€',
            breakdownTaxes: [
                {
                    code: 'OG',
                    amount: '0.69€',
                    currency: 'EUR',
                    description: 'Security Tax',
                    subcode: '001',
                    country: 'ES',
                    carrier: null
                },
                {
                    code: 'QV',
                    amount: '4.09€',
                    currency: 'EUR',
                    description: 'Security',
                    subcode: '003',
                    country: 'ES',
                    carrier: null
                },
                {
                    code: 'JD',
                    amount: '15.59€',
                    currency: 'EUR',
                    description: 'Departure Charge',
                    subcode: '003',
                    country: 'ES',
                    carrier: null
                }
            ],
            tax: 20.37,
            numberOfPassengers: 1,
            totalTax: 0,
            formattedTotalTax: '0€'
        }
    },
    cashAviosPossibilities: [
        {
            totalDiscount: 10,
            currency: 'EUR',
            aviosRequired: 1852,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 10,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ],
            currencySymbol: '€',
            formatedTotalDiscount: '10€',
            formatedAviosRequired: '1,852'
        },
        {
            totalDiscount: 28.61,
            currency: 'EUR',
            aviosRequired: 5298,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 28.61,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ],
            currencySymbol: '€',
            formatedTotalDiscount: '29€',
            formatedAviosRequired: '5,298'
        },
        {
            totalDiscount: 47.68,
            currency: 'EUR',
            aviosRequired: 8830,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 47.68,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ],
            currencySymbol: '€',
            formatedTotalDiscount: '48€',
            formatedAviosRequired: '8,830'
        },
        {
            totalDiscount: 76.3,
            currency: 'EUR',
            aviosRequired: 14130,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 76.3,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ],
            currencySymbol: '€',
            formatedTotalDiscount: '76€',
            formatedAviosRequired: '14,130'
        },
        {
            totalDiscount: 95.37,
            currency: 'EUR',
            aviosRequired: 17661,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 95.37,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ],
            currencySymbol: '€',
            formatedTotalDiscount: '95€',
            formatedAviosRequired: '17,661'
        }
    ],
    passengerInfo: {
        ADULT_01: {
            type: 'ADULT',
            name: 'test',
            surname: 'test',
            loyaltyCard: 'PASSENGER_INFO_NO_LOYALTY_CARD',
            specialNeedFound: false,
            specialNeeds: [
                {
                    departureCity: {
                        code: 'MAD',
                        name: 'ADOLFO SUAREZ BARAJAS',
                        terminal: '4',
                        city: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    arrivalCity: {
                        code: 'BIO',
                        name: 'BILBAO AIRPORT',
                        terminal: null,
                        city: {
                            code: 'BIO',
                            description: 'Bilbao',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    specialNeeds: [],
                    showSpecialNeed: false
                }
            ]
        }
    },
    flightInfo: {
        MADBIO20250619155000: {
            departureCity: {
                code: 'MAD',
                name: 'ADOLFO SUAREZ BARAJAS',
                terminal: '4',
                city: {
                    code: 'MAD',
                    description: 'Madrid',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'Spain'
                    }
                }
            },
            arrivalCity: {
                code: 'BIO',
                name: 'BILBAO AIRPORT',
                terminal: null,
                city: {
                    code: 'BIO',
                    description: 'Bilbao',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'Spain'
                    }
                }
            },
            segments: [
                {
                    departureCity: {
                        code: 'MAD',
                        name: 'ADOLFO SUAREZ BARAJAS',
                        terminal: '4',
                        city: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    arrivalCity: {
                        code: 'BIO',
                        name: 'BILBAO AIRPORT',
                        terminal: null,
                        city: {
                            code: 'BIO',
                            description: 'Bilbao',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    departureDateParsed: {
                        dateTime: '15:50',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 19,
                        monthNumber: 6,
                        month: 'MONTH_JUNE',
                        year: 2025,
                        originalDate: '2025-06-19T15:50:00+02:00',
                        formatedDate: '19/06/2025'
                    },
                    companyURL: {
                        logo:'/aerolineas/logo_pos_IB.svg',
                        logoMin: null
                    },
                    overnight: false,
                    departureDateTimeParsed: '15:50',
                    arrivalDateTimeParsed: '16:55',
                    departure: {
                        code: 'MAD',
                        name: 'ADOLFO SUAREZ BARAJAS',
                        terminal: '4',
                        city: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    arrival: {
                        code: 'BIO',
                        name: 'BILBAO AIRPORT',
                        terminal: null,
                        city: {
                            code: 'BIO',
                            description: 'Bilbao',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    flight: {
                        marketingCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        opertionalCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        marketingFlightNumber: '0435',
                        operationalFlightNumber: '0435',
                        operationalDisclosure: 'IB',
                        aircraft: {
                            code: '320',
                            description: 'Airbus A320'
                        }
                    },
                    durationParsed: '01h 5min.',
                    arrive: true,
                    cabin: {
                        rbd: 'N',
                        description: 'Economy',
                        remainingSeats: 0,
                        fareFamily: 'TBAESEU',
                        code: 'R',
                        type: 'ECONOMY',
                        brandCode: '',
                        bookingClass: 'ECONOMY'
                    },
                    fareFamilyConditions: [
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'EQMANO',
                            name: 'Hand baggage',
                            title: 'Hand luggage: 1 item',
                            message: '1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator.',
                            units: 1
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'EQBODEGA',
                            name: 'Baggage in hold',
                            title: 'Checked baggage not included',
                            message: 'With a fee.',
                            units: null
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'COMIDA',
                            name: 'Meal',
                            title: 'Meal not included',
                            message: 'With a fee.',
                            units: null
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'ASIENTO',
                            name: 'Seat  selection',
                            title: 'Seat selection with a fee',
                            message: 'With a fee.',
                            units: null
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'CAMBIO',
                            name: 'Change',
                            title: 'Flight change with a fee',
                            message: 'Allowed with a fee of EUR 65. Not allowed for no-shows.',
                            units: 65
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'REEMBOLSO',
                            name: 'Refund (in each direction)',
                            title: 'Not allowed',
                            message: 'Not allowed.',
                            units: null
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'FASTLANE',
                            name: 'Fast Lane',
                            title: 'Fast Lane not included',
                            message: 'Not included.',
                            units: null
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'AVIO',
                            name: 'AVIOS',
                            title: 'Avios awarded with purchase',
                            message: 'Included.',
                            units: null
                        }
                    ]
                }
            ],
            departureDateParsed: {
                dateTime: '15:50',
                weekDay: 'WEEKDAY_THURSDAY',
                day: 19,
                monthNumber: 6,
                month: 'MONTH_JUNE',
                year: 2025,
                originalDate: '2025-06-19T15:50:00+02:00',
                formatedDate: '19/06/2025'
            },
            arrive: true
        }
    },
    orderItemsId: [
        'IBebde5fd01eb44bc59a8ae13af50733d4OP_01'
    ],
    orderPrice: {
        fare: 80,
        tax: 20.37,
        total: 100.37,
        currency: 'EUR',
        ticketingFee: 0
    },
    voucherDiscount: null,
    flightType: 'availabilityFlight',
    remainingTime: dayjs().add(4317, 'minute').format(),
    price: {
        original: 100.37,
        formatted: '100.37€',
        perPassenger: '95.37€'
    },
    paidDeposit: {
        priceFormat: '-5.00€',
        price: 5
    },
    originalPrice: '95.37€',
    warnings: {
        CODE_ERR:{
            description:'Warning de prueba',
            code:'321423'
        }
    }
};
