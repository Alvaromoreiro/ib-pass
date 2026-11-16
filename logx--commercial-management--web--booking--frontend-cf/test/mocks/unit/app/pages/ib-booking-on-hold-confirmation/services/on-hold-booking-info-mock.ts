import { OHImportResponse } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import { GeneralInfo } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';
import dayjs from 'dayjs';

export const bookingInfoMock = {
    generalInfo: {
        flightInfo: {
            MADLHR20250613075000: {
                arrivalCity: {
                    city: {
                        code: 'LON',
                        country: {
                            code: 'GB',
                            description: 'United Kingdom'
                        },
                        description: 'London'
                    },
                    code: 'LHR',
                    name: 'HEATHROW',
                    terminal: '5'
                },
                arrive: true,
                departureCity: {
                    city: {
                        code: 'MAD',
                        country: {
                            code: 'ES',
                            description: 'Spain'
                        },
                        description: 'Madrid'
                    },
                    code: 'MAD',
                    name: 'ADOLFO SUAREZ BARAJAS',
                    terminal: '4S'
                },
                departureDateParsed: {
                    dateTime: '07:50',
                    day: 13,
                    formatedDate: '13/06/2025',
                    month: 'MONTH_JUNE',
                    monthNumber: 6,
                    originalDate: '2025-06-13T07:50:00+02:00',
                    weekDay: 'WEEKDAY_FRIDAY',
                    year: 2025
                },
                segments: [
                    {
                        $$hashKey: 'object:78',
                        arrival: {
                            city: {
                                code: 'LON',
                                country: {
                                    code: 'GB',
                                    description: 'United Kingdom'
                                },
                                description: 'London'
                            },
                            code: 'LHR',
                            name: 'HEATHROW',
                            terminal: '5'
                        },
                        arrivalCity: {
                            city: {
                                code: 'LON',
                                country: {
                                    code: 'GB',
                                    description: 'United Kingdom'
                                },
                                description: 'London'
                            },
                            code: 'LHR',
                            name: 'HEATHROW',
                            terminal: '5'
                        },
                        arrivalDateTimeParsed: '09:15',
                        arrive: true,
                        cabin: {
                            bookingClass: 'BUSINESS',
                            brandCode: '',
                            code: 'B',
                            description: 'Business',
                            fareFamily: 'BREESES',
                            rbd: 'I',
                            remainingSeats: 0,
                            type: 'BUSINESS'
                        },
                        companyURL: '/aerolineas/logo_pos_IB.svg',
                        departure: {
                            city: {
                                code: 'MAD',
                                country: {
                                    code: 'ES',
                                    description: 'Spain'
                                },
                                description: 'Madrid'
                            },
                            code: 'MAD',
                            name: 'ADOLFO SUAREZ BARAJAS',
                            terminal: '4S'
                        },
                        departureCity: {
                            city: {
                                code: 'MAD',
                                country: {
                                    code: 'ES',
                                    description: 'Spain'
                                },
                                description: 'Madrid'
                            },
                            code: 'MAD',
                            name: 'ADOLFO SUAREZ BARAJAS',
                            terminal: '4S'
                        },
                        departureDateParsed: {
                            dateTime: '07:50',
                            day: 13,
                            formatedDate: '13/06/2025',
                            month: 'MONTH_JUNE',
                            monthNumber: 6,
                            originalDate: '2025-06-13T07:50:00+02:00',
                            weekDay: 'WEEKDAY_FRIDAY',
                            year: 2025
                        },
                        departureDateTimeParsed: '07:50',
                        durationParsed: '02h 25min.',
                        fareFamilyConditions: [
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'EQMANO',
                                message: '1 item max. 14 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator.',
                                name: 'Hand baggage',
                                title: 'Hand luggage: 1 item',
                                units: 1
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'EQBODEGA',
                                message: '2 items max. 23 kg and 158 cm each included.',
                                name: 'Baggage in hold',
                                title: 'Checked baggage: 2 items',
                                units: 2
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'COMIDA',
                                message: 'Included.',
                                name: 'Meal',
                                title: 'Meal included',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'ASIENTO',
                                message: 'Free from 24 hrs before flight.',
                                name: 'Seat selection',
                                title: 'Seat selection 24 hrs before flight',
                                units: 24
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'CAMBIO',
                                message: 'Allowed with a fee of EUR 60. Not allowed for no-shows.',
                                name: 'Change',
                                title: 'Flight change with a fee, with some exceptions',
                                units: 60
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'REEMBOLSO',
                                message: 'Allowed at any time with a fee of EUR 90. Not allowed for no-shows.',
                                name: 'Refund (in each direction)',
                                title: 'Refund allowed with a fee, with some exceptions',
                                units: 90
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'EQPPRIOR',
                                message: 'Included.',
                                name: 'Priority baggage delivery',
                                title: 'Fast bag drop included',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'ASIENTODELANTERO',
                                message: 'Not applicable.',
                                name: 'Front seat',
                                title: 'Front seat not applicable',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'CHECKINDESK',
                                message: 'Included.',
                                name: 'Exclusive check-in counter',
                                title: 'Exclusive check-in desk included',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'FASTLANE',
                                message: 'Not included.',
                                name: 'Fast Lane',
                                title: 'Fast Lane not included',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'CABINA',
                                message: 'Business.',
                                name: 'Cabin',
                                title: 'Business Cabin',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'AVIO',
                                message: 'Included.',
                                name: 'AVIOS',
                                title: 'Avios awarded with purchase',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'FASTTRACK',
                                message: 'Included.',
                                name: 'Fast Track',
                                title: 'Fast Track included.',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'ASIENTOXL',
                                message: 'Not applicable.',
                                name: 'Extra legroom seat',
                                title: 'Extra legroom seat not applicable',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'ASIENTOPREFERENTE',
                                message: 'With a fee.',
                                name: 'Preferred seat',
                                title: 'Preferred seat with a fee',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'EMBARQUE',
                                message: 'Included (Group 1).',
                                name: 'Priority Boarding.',
                                title: 'Group 1 priority boarding',
                                units: 1
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'WIFI',
                                message: 'Available with a fee, depending on aircraft type.',
                                name: 'WiFi',
                                title: 'Wi-Fi with a fee',
                                units: null
                            },
                            {
                                cabin: 'Business Promotional',
                                cabinType: 'B',
                                code: 'SALAVIP',
                                message: 'Access included.',
                                name: 'Access to VIP lounges',
                                title: 'Access to VIP Lounge included',
                                units: null
                            }
                        ],
                        flight: {
                            aircraft: {
                                code: '320',
                                description: 'Airbus A320'
                            },
                            marketingCarrier: {
                                code: 'IB',
                                name: 'Iberia'
                            },
                            marketingFlightNumber: '0713',
                            operationalCarrier: {
                                code: 'IB',
                                name: 'Iberia'
                            },
                            operationalDisclosure: 'IB',
                            operationalFlightNumber: '0713'
                        },
                        overnight: false
                    }
                ]
            },
            BCNMAD20250404091500: {
                test: true
            }
        },
        returnFlight: {
            date: 'Jan 1st, 1970'
        },
        passengersNumber: 1,
        flightType: 'availabilityFlight',
        tripType: 1,
        cashAviosPossibilities: 'cashAviosPossibilities'
    }
};

export const transformedBookingInfo = {
    originCity: {
        code: 'MAD',
        country: {
            code: 'ES',
            description: 'Spain'
        },
        description: 'Madrid'
    },
    destinationCity: {
        code: 'LON',
        country: {
            code: 'GB',
            description: 'United Kingdom'
        },
        description: 'London'
    },
    dates: {
        outboundFlight:  '2025-06-13T07:50:00+02:00',
        formatedOutboundFlight:  '2025-06-13T07:50:00+02:00',
        returnFlight: 'Jan 1st, 1970',
        formatedReturnFlight: 'Jan 1st, 1970'
    },
    passengers: 1,
    numAdults: 1,
    numChilds: 0,
    numInfant: 0,
    numSeniors: 0,
    numTeenager: 0,
    numYoung: 0,
    tripType: '1'
};

export const onHoldInfoMock= {
    flowId: 'TWFuYWdlTXlCb29raW5nQElCMDgyMDExY2U1ZmI2NGQ3ODkzZDJiYzk0MDA2MmRiMjU=',
    order: {
        orderId: 'Qm9va2luZ0BJQmExYjA0NDZhMzQ0MjRjMjJiZDc5ZTYwNzBlOTZmZWE5T1A=',
        status: 'ON_HOLD_CONFIRMABLE',
        clientLocator: 'J6GV6',
        bookingReferences: [
            {
                provider: 'IB',
                reference: 'J6GV6'
            }
        ],
        orderItems: [
            {
                type: 'flight',
                orderItemId: 'IBa1b0446a34424c22bd79e6070e96fea9OP_01',
                bookingReferences: [
                    {
                        provider: 'IB',
                        reference: 'J6GV6'
                    }
                ],
                price: {
                    fare: 212,
                    tax: 39.73,
                    total: 251.73,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                sliceIds: [
                    'MADBCN20250615112500',
                    'BCNMAD20250629091500'
                ],
                passengerPrices: [
                    {
                        fareCalculation: 'MAD IB BCN165.00IB MAD47.00EUR212.00END',
                        passengerId: 'ADULT_01',
                        price: {
                            fare: 212,
                            tax: 39.73,
                            total: 251.73,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        segmentPrices: [
                            {
                                price: {
                                    fare: 165,
                                    currency: 'EUR'
                                },
                                fareCode: 'RDNNM4',
                                segmentsIds: [
                                    'IB041120250615'
                                ],
                                ticketDesignator: null,
                                penalties: [],
                                penaltyFlags: null
                            },
                            {
                                price: {
                                    fare: 47,
                                    currency: 'EUR'
                                },
                                fareCode: 'SDNNB4',
                                segmentsIds: [
                                    'IB040420250629'
                                ],
                                ticketDesignator: null,
                                penalties: [],
                                penaltyFlags: null
                            }
                        ],
                        taxes: [
                            {
                                code: 'OG|OG',
                                amount: 1.38,
                                currency: 'EUR',
                                description: 'Security Tax',
                                subcode: '001',
                                country: 'ES',
                                carrier: null
                            },
                            {
                                code: 'QV|QV',
                                amount: 8.18,
                                currency: 'EUR',
                                description: 'Security',
                                subcode: '003',
                                country: 'ES',
                                carrier: null
                            },
                            {
                                code: 'JD|JD',
                                amount: 30.17,
                                currency: 'EUR',
                                description: 'Departure Charge',
                                subcode: '003',
                                country: 'ES',
                                carrier: null
                            },

                            {
                                code: 'YQ',
                                amount: 400,
                                currency: 'EUR',
                                description: 'Carrier charges',
                                subcode: 'I',
                                country: 'ES',
                                carrier: null
                            }
                        ],
                        orderItemPaymentInfos: []
                    }
                ]
            },
            {
                type: 'specialNeed',
                orderItemId: 'IBa1b0446a34424c22bd79e6070e96fea9OP_02',
                price: {
                    fare: 0,
                    tax: 0,
                    total: 0,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                serviceCode: 'BLND',
                passengerId: 'ADULT_01',
                sliceId: 'MADBCN20250615112500',
                segmentId: 'IB041120250615',
                name: 'Blind Passenger',
                text: 'BLND',
                description: 'Request Service Animal if travelling with one',
                status: {
                    code: 'HK',
                    description: 'Confirmed'
                },
                onHoldTimeLimit: null
            },
            {
                type: 'specialNeed',
                orderItemId: 'IBa1b0446a34424c22bd79e6070e96fea9OP_03',
                price: {
                    fare: 0,
                    tax: 0,
                    total: 0,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                serviceCode: 'WCHC',
                passengerId: 'ADULT_01',
                sliceId: 'MADBCN20250615112500',
                segmentId: 'IB041120250615',
                name: 'Wheelchair for cabin',
                text: 'WCHC',
                description: 'I can walk and I need assistance to / from my seat on the aircraft',
                status: {
                    code: 'HK',
                    description: 'Confirmed'
                },
                onHoldTimeLimit: null
            }
        ],
        slices: [
            {
                sliceId: 'MADBCN20250615112500',
                type: 'REGULAR',
                departureDateTime: '2025-06-15 11:25',
                arrivalDateTime: '2025-06-15 12:40',
                duration: 75,
                stopsNumber: 0,
                detailedPrices: [
                    {
                        fare: 165,
                        currency: 'EUR',
                        passengerIds: [
                            'ADULT_01'
                        ],
                        segmentPrices: [
                            {
                                price: {
                                    fare: 165,
                                    currency: 'EUR'
                                },
                                fareCode: 'RDNNM4',
                                segmentsIds: [
                                    'IB041120250615'
                                ],
                                ticketDesignator: null,
                                penalties: [],
                                penaltyFlags: null
                            }
                        ]
                    }
                ],
                segments: [
                    {
                        type: 'CONFIRMED',
                        mmbAllowed: true,
                        ckiStatus: {
                            code: 'CHECKABLE',
                            message: null
                        },
                        noShow: false,
                        flyNow: false,
                        flown: false,
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
                            code: 'BCN',
                            name: 'BARCELONA',
                            terminal: '1',
                            city: {
                                code: 'BCN',
                                description: 'Barcelona',
                                countryCode: 'ES',
                                country: {
                                    code: 'ES',
                                    description: 'Spain'
                                }
                            }
                        },
                        departureCity: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            timeZone: 'Europe/Madrid'
                        },
                        arrivalCity: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            timeZone: 'Europe/Madrid'
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
                            marketingFlightNumber: '0411',
                            operationalFlightNumber: '0411',
                            operationalDisclosure: 'IB',
                            aircraft: {
                                code: '32A',
                                description: 'Airbus A320'
                            }
                        },
                        cabin: {
                            rbd: 'R',
                            description: 'Business',
                            remainingSeats: 0,
                            fareFamily: 'BUSOPTMH',
                            code: 'B',
                            type: 'BUSINESS',
                            brandCode: '',
                            bookingClass: 'BUSINESS'
                        },
                        overnight: false,
                        id: 'IB041120250615',
                        duration: 75,
                        waitingTime: 0,
                        operatorLocator: null,
                        stop: null,
                        departureDateTime: '2025-06-15 11:25',
                        departureUtcDateTime: '2025-06-15T09:25:00.000',
                        arrivalDateTime: '2025-06-15 12:40',
                        arrivalUtcDateTime: '2025-06-15T10:40:00.000',
                        status: {
                            code: 'HK',
                            description: 'Confirmed'
                        }
                    }
                ],
                overnight: false,
                passengerFlags: [
                    {
                        passengerId: 'ADULT_01',
                        flags: [
                            {
                                'type': 'FLIGHT_REFUND',
                                enabled: false
                            },
                            {
                                'type': 'FREQUENT_FLYER_MODIFICATION',
                                enabled: true
                            }
                        ]
                    }
                ],
                originDestinationKey: null
            },
            {
                sliceId: 'BCNMAD20250629091500',
                type: 'REGULAR',
                departureDateTime: '2025-06-29 09:15',
                arrivalDateTime: '2025-06-29 10:40',
                duration: 85,
                stopsNumber: 0,
                detailedPrices: [
                    {
                        fare: 47,
                        currency: 'EUR',
                        passengerIds: [
                            'ADULT_01'
                        ],
                        segmentPrices: [
                            {
                                price: {
                                    fare: 47,
                                    currency: 'EUR'
                                },
                                fareCode: 'SDNNB4',
                                segmentsIds: [
                                    'IB040420250629'
                                ],
                                ticketDesignator: null,
                                penalties: [],
                                penaltyFlags: null
                            }
                        ]
                    }
                ],
                segments: [
                    {
                        type: 'CONFIRMED',
                        mmbAllowed: true,
                        ckiStatus: {
                            code: 'CHECKABLE',
                            message: null
                        },
                        noShow: false,
                        flyNow: false,
                        flown: false,
                        departure: {
                            code: 'BCN',
                            name: 'BARCELONA',
                            terminal: '1',
                            city: {
                                code: 'BCN',
                                description: 'Barcelona',
                                countryCode: 'ES',
                                country: {
                                    code: 'ES',
                                    description: 'Spain'
                                }
                            }
                        },
                        arrival: {
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
                        departureCity: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            timeZone: 'Europe/Madrid'
                        },
                        arrivalCity: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            timeZone: 'Europe/Madrid'
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
                            marketingFlightNumber: '0404',
                            operationalFlightNumber: '0404',
                            operationalDisclosure: 'IB',
                            aircraft: {
                                code: '320',
                                description: 'Airbus A320'
                            }
                        },
                        cabin: {
                            rbd: 'S',
                            description: 'Economy',
                            remainingSeats: 0,
                            fareFamily: 'YR2PA',
                            code: 'R',
                            type: 'ECONOMY',
                            brandCode: '',
                            bookingClass: 'ECONOMY'
                        },
                        overnight: false,
                        id: 'IB040420250629',
                        duration: 85,
                        waitingTime: 0,
                        operatorLocator: null,
                        stop: null,
                        departureDateTime: '2025-06-29 09:15',
                        departureUtcDateTime: '2025-06-29T07:15:00.000',
                        arrivalDateTime: '2025-06-29 10:40',
                        arrivalUtcDateTime: '2025-06-29T08:40:00.000',
                        status: {
                            code: 'HK',
                            description: 'Confirmed'
                        }
                    }
                ],
                overnight: false,
                passengerFlags: [
                    {
                        passengerId: 'ADULT_01',
                        flags: [
                            {
                                type: 'FLIGHT_REFUND',
                                enabled: false
                            },
                            {
                                type: 'FREQUENT_FLYER_MODIFICATION',
                                enabled: true
                            }
                        ]
                    }
                ],
                originDestinationKey: null
            }
        ],
        price: {
            fare: 212,
            tax: 39.73,
            total: 251.73,
            currency: 'EUR',
            ticketingFee: 0
        },
        primaryContactInfo: {
            phone: '345555555555555555',
            phoneDetails: {
                number: '5555555555555555',
                countryCode: '34'
            },
            email: 'TEST@GMAIL.COM',
            phoneType: 'MOBILE',
            confirmationMailOption: null,
            refundEmail: 'TEST@GMAIL.COM',
            language: null
        },
        optionalInformation: [],
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
                ]
            },
            {
                totalDiscount: 74.02,
                currency: 'EUR',
                aviosRequired: 13707,
                offerAvailable: false,
                perPassengerDiscounts: [
                    {
                        discount: 74.02,
                        passengerType: 'ADT',
                        numberOfPassengers: 1
                    }
                ]
            }
        ],
        specialDiscounts: [
            {
                type: 'VOUCHER',
                percentDiscount: 5,
                totalDiscount: 5,
                description: '',
                discountFormatted: ''
            }
        ],
        checkedBagAllowances: [
            {
                type: 'PIECE',
                segmentIds: [
                    'IB041120250615',
                    'IB040420250629'
                ],
                totalQuantity: 0
            }
        ],
        accrualQuote: null,
        bookingCreationDates: [
            {
                creationDate: '2025-03-28',
                provider: 'IB'
            }
        ],
        sender: null,
        officeIata: '7849644',
        availableForCheckin: false,
        earlyCheckinDone: false,
        changeSegmentsByAmadeus: false,
        orderType: 'PURE_IB',
        flightRatio: 'Corto Radio',
        referralId: null,
        closedUserGroup: null,
        aviosRedeemed: null,
        pointsRedeemed: null,
        indirectCheckedBagAllowances: [
            {
                baggageAllowanceId: null,
                totalQuantity: 0,
                pieceAllowances: [
                    {
                        totalQuantity: 0,
                        commercialName: null,
                        descriptions: null,
                        type: 'PIECE',
                        subcode: null
                    }
                ],
                segmentIds: [
                    'IB041120250615',
                    'IB040420250629'
                ]
            }
        ],
        voluntaryRefundProcessedDirectlyByCallCenter: false,
        voucherDiscount:{
            amount: 12,
            formattedAmount: '12 €',
            priceWithDiscount: 0,
            type: 'PARTNER',
            totalDiscount: 12,
            percentDiscount: null,
            totalBookingAmountWithDiscountApplied: 0,
            voucherId: 123,
            description: 'Partner voucher discount',
            discountFormatted: '12 €'
        }
    },
    passengers: [
        {
            passengerType: 'ADULT',
            personalInfo: {
                name: 'TEST',
                surname: 'TEST',
                birthDate: null
            },
            passengerId: 'ADULT_01',
            contactInfo: {
                phone: '345555555555555555',
                phoneDetails: {
                    number: '5555555555555555',
                    countryCode: '34'
                },
                email: 'test@gmail.com',
                phoneType: 'MOBILE',
                confirmationMailOption: null,
                refundEmail: null,
                language: 'en'
            },
            relatedPassengerId: '',
            ckiStatus: null,
            optionalInformation: [],
            residenceAccreditationStatus: null,
            resiberPassengerId: '1',
            securityInformation: {
                relatedContent: null
            },
            externalPersonalInfo: {
                name: 'TEST',
                firstSurname: 'TEST',
                lastSurname: ''
            }
        }
    ],
    warnings: [
        {
            code: 'REFUND_NOT_ALLOWED',
            description: 'IsNoShowCompleteReserveRule'
        },
        {
            code: 'PARTIAL_REFUND_NOT_ALLOWED',
            description: 'HasAnyCouponsUsedByReservePartialRule'
        },
        {
            code: 'SSE_MMB_0001',
            description: 'error de prueba'
        }
    ],
    contextMetadata: {
        language: 'en',
        country: 'ES',
        currencies: [
            {
                code: 'EUR',
                description: 'Euro',
                symbol: '€',
                alignment: 'R',
                groupingSeparator: ',',
                decimalSeparator: '.',
                decimals: 2,
                recommendedDisplay: 'symbol'
            }
        ]
    },
    fareFamilyConditions: [
        {
            cabinType: 'B',
            cabinDescription: 'Economy',
            commercialCode: 'YR2PA',
            commercialName: 'Basic',
            commercialNameES: 'Básica',
            priority: 0,
            conditions:  [
                {
                    code: 'EQMANO',
                    name: 'Hand baggage',
                    text: '1 item max. 10 kg (56x40x25cm) included',
                    units: 1,
                    extendedInfo: {
                        title: 'Hand luggage: 1 item',
                        message: '1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Baggage in hold',
                    text: 'With a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Checked baggage not included',
                        message: 'With a fee',
                        code: 'CA_1_PIEZAS_PAGO',
                        conditionStatus: false
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Priority baggage delivery',
                    text: 'With a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Fast bag drop not included',
                        message: 'With a fee',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false
                    }
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'E',
            cabinDescription: 'Economy',
            commercialCode: 'YR2PA',
            commercialName: 'Basic',
            commercialNameES: 'Básica',
            priority: 0,
            conditions: [
                {
                    code: 'EQMANO',
                    name: 'Hand baggage',
                    text: '1 item max. 10 kg (56x40x25cm) included',
                    units: 1,
                    extendedInfo: {
                        title: 'Hand luggage: 1 item',
                        message: '1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Baggage in hold',
                    text: 'With a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Checked baggage not included',
                        message: 'With a fee',
                        code: 'CA_1_PIEZAS_PAGO',
                        conditionStatus: false
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Priority baggage delivery',
                    text: 'With a fee',
                    units: null,
                    extendedInfo: {
                        title: 'Fast bag drop not included',
                        message: 'With a fee',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false
                    }
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'CAMBIO',
                'REEMBOLSO'
            ]
        }
    ],
    channel: 'IBCOM',
    onHoldInformation: {
        timeLimits: '2025-03-31T09:06:19.605+00:00',
        referenceTimeLimit: '2025-03-31T11:06:19.605',
        referenceCity: {
            code: 'MAD',
            description: 'Madrid',
            countryCode: 'ES'
        },
        paidDeposit: {
            fare: 5,
            currency: 'EUR'
        },
        remainingTime: 4316
    },
    relatedContent: [
        {
            key: 'CONFIRM_ONHOLD_CONDITIONS',
            value: 'Total price, includes air fare, <a href=\'http://pree.iberia.es/#MARKETURL/taxes-and-government-fees/\' target=\'_blank\'>taxes</a> (except those charged at certain airports at the time of check-in), handling fees, operator charges and selected options. Click <a href=\'http://pree.iberia.es/#MARKETURL/service-fees/\' target=\'_blank\'>here</a> to check for any management fees for changes and refunds'
        }
    ],
    qualifiers: [],
    reportingWeb: {
        device: 'DMRC',
        idColective: '',
        officeIata: 'MADIB08AB',
        iata: 'I',
        product: '1'
    },
    flexibilizationCapabilitiesInformation: null,
    genericDisruptionCapabilitiesInformation: null,
    upgInformation: {
        url: null,
        flightsInformation: null,
        bidable: false
    },
    orderFlags: [
        {
            type: 'PRINT_ITINERARY',
            enabled: false
        },
        {
            type: 'ON_BUSINESS_MODIFICATION',
            enabled: false
        },
        {
            type: 'ALLOWED_INVOICE_MANAGEMENT',
            enabled: false
        },
        {
            type: 'VOUCHER_REFUND',
            enabled: false
        },
        {
            type: 'CASH_REFUND',
            enabled: false
        },
        {
            type: 'ALLOWED_REFUND_CASH',
            enabled: false
        },
        {
            type: 'ALLOWED_REFUND_VOUCHER',
            enabled: false
        },
        {
            type: 'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE',
            enabled: false
        },
        {
            type: 'ALLOWED_ACCEPT_CHANGES',
            enabled: false
        },
        {
            type: 'ALLOWED_VOLUNTARY_REFUND_CASH',
            enabled: false
        },
        {
            type: 'ALLOWED_VOLUNTARY_PARTIAL_REFUND_CASH',
            enabled: false
        },
        {
            type: 'VOUCHER_REFUND_ON_DEMAND',
            enabled: false
        },
        {
            type: 'VOUCHER_REFUND_RESTRICTION',
            enabled: false
        },
        {
            type: 'ALLOWED_VOUCHER_COMPENSATION',
            enabled: true
        }
    ]
} satisfies OHImportResponse;
export const generalInfoMock= {
    notConfirmable: false,
    pnr: 'J6GV6',
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
        code: 'BCN',
        name: 'BARCELONA',
        terminal: '1',
        city: {
            code: 'BCN',
            description: 'Barcelona',
            countryCode: 'ES',
            country: {
                code: 'ES',
                description: 'Spain'
            }
        }
    },
    departureTime: {
        date: '2025-06-15',
        time: '11:25'
    },
    returnFlight: {
        date: '2025-06-29',
        time: '09:15'
    },
    tripType: 2,
    flightRatio: 'Corto Radio',
    passengersNumber: 1,
    currency: {
        suffixSymbol: false,
        decimalSeparator: '',
        numberDecimals: 0,
        groupingSeparator: '',
        currencySymbol: '€',
        description: '5€'
    },
    primaryContactInfo: {
        email: 'TEST@GMAIL.COM',
        phone: '345555555555555555'
    },
    passengerPrices: {
        'ADULT': {
            fare: 212,
            formattedFare: '212 €',
            formattedInTax: '39.73 €',
            breakdownTaxes: [
                {
                    code: 'OG|OG',
                    amount: '1.38 €',
                    currency: 'EUR',
                    description: 'Security Tax',
                    subcode: '001',
                    country: 'ES',
                    carrier: null
                },
                {
                    code: 'QV|QV',
                    amount: '8.18 €',
                    currency: 'EUR',
                    description: 'Security',
                    subcode: '003',
                    country: 'ES',
                    carrier: null
                },
                {
                    code: 'JD|JD',
                    amount: '30.17 €',
                    currency: 'EUR',
                    description: 'Departure Charge',
                    subcode: '003',
                    country: 'ES',
                    carrier: null
                },
                {
                    code: 'YQ',
                    amount: '400 €',
                    currency: 'EUR',
                    description: 'Carrier charges',
                    subcode: 'I',
                    country: 'ES',
                    carrier: null
                }

            ],
            tax: 39.73,
            numberOfPassengers: 1,
            totalTax: 39.73,
            formattedTotalTax: '39.73 €'
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
            formatedTotalDiscount: '10 €',
            formatedAviosRequired: '1852 Avios'
        },
        {
            totalDiscount: 74.02,
            currency: 'EUR',
            aviosRequired: 13707,
            offerAvailable: false,
            perPassengerDiscounts: [
                {
                    discount: 74.02,
                    passengerType: 'ADT',
                    numberOfPassengers: 1
                }
            ],
            currencySymbol: '€',
            formatedTotalDiscount: '74.02 €',
            formatedAviosRequired: '13707 Avios'
        }
    ],
    passengerInfo: {
        'ADULT_01': {
            type: 'ADULT',
            name: 'TEST',
            surname: 'TEST',
            loyaltyCard: 'PASSENGER_INFO_NO_LOYALTY_CARD',
            specialNeedFound: true,
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
                        code: 'BCN',
                        name: 'BARCELONA',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    specialNeeds: [
                        {
                            serviceCode: 'BLND',
                            text: 'BLND',
                            status: {
                                code: 'HK',
                                description: 'Confirmed'
                            }
                        },
                        {
                            serviceCode: 'WCHC',
                            text: 'WCHC',
                            status: {
                                code: 'HK',
                                description: 'Confirmed'
                            }
                        }
                    ],
                    showSpecialNeed: true
                },
                {
                    departureCity: {
                        code: 'BCN',
                        name: 'BARCELONA',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    arrivalCity: {
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
                    specialNeeds: [],
                    showSpecialNeed: false
                }
            ]
        }
    },
    flightInfo: {
        'MADBCN20250615112500': {
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
                code: 'BCN',
                name: 'BARCELONA',
                terminal: '1',
                city: {
                    code: 'BCN',
                    description: 'Barcelona',
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
                        code: 'BCN',
                        name: 'BARCELONA',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    departureDateParsed: {
                        dateTime: '11:25',
                        weekDay: 'WEEKDAY_SUNDAY',
                        day: 15,
                        monthNumber: 6,
                        month: 'MONTH_JUNE',
                        year: 2025,
                        originalDate: '2025-06-15T11:25:00+02:00',
                        formatedDate: null
                    },
                    overnight: false,
                    departureDateTimeParsed: '11:25',
                    arrivalDateTimeParsed: '12:40',
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
                        code: 'BCN',
                        name: 'BARCELONA',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
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
                        operationalCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        marketingFlightNumber: '0411',
                        operationalFlightNumber: '0411',
                        operationalDisclosure: 'IB',
                        aircraft: {
                            code: '32A',
                            description: 'Airbus A320'
                        }
                    },
                    durationParsed: '01h 15min.',
                    arrive: true,
                    cabin: {
                        rbd: 'R',
                        description: 'Business',
                        remainingSeats: 0,
                        fareFamily: 'BUSOPTMH',
                        code: 'B',
                        type: 'BUSINESS',
                        brandCode: '',
                        bookingClass: 'BUSINESS'
                    },
                    fareFamilyConditions: [],
                    companyURL: {
                        logo:'iconos/logo_IB_pos.svg',
                        logoMin: null
                    }
                }
            ],
            departureDateParsed: {
                dateTime: '11:25',
                weekDay: 'WEEKDAY_SUNDAY',
                day: 15,
                monthNumber: 6,
                month: 'MONTH_JUNE',
                year: 2025,
                originalDate: '2025-06-15T11:25:00+02:00',
                formatedDate: null
            },
            arrive: true
        },
        'BCNMAD20250629091500': {
            departureCity: {
                code: 'BCN',
                name: 'BARCELONA',
                terminal: '1',
                city: {
                    code: 'BCN',
                    description: 'Barcelona',
                    countryCode: 'ES',
                    country: {
                        code: 'ES',
                        description: 'Spain'
                    }
                }
            },
            arrivalCity: {
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
            segments: [
                {
                    departureCity: {
                        code: 'BCN',
                        name: 'BARCELONA',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    arrivalCity: {
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
                    departureDateParsed: {
                        dateTime: '09:15',
                        weekDay: 'WEEKDAY_SUNDAY',
                        day: 29,
                        monthNumber: 6,
                        month: 'MONTH_JUNE',
                        year: 2025,
                        originalDate: '2025-06-29T09:15:00+02:00',
                        formatedDate: null
                    },
                    overnight: false,
                    departureDateTimeParsed: '09:15',
                    arrivalDateTimeParsed: '10:40',
                    departure: {
                        code: 'BCN',
                        name: 'BARCELONA',
                        terminal: '1',
                        city: {
                            code: 'BCN',
                            description: 'Barcelona',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'Spain'
                            }
                        }
                    },
                    arrival: {
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
                    flight: {
                        marketingCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        operationalCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        marketingFlightNumber: '0404',
                        operationalFlightNumber: '0404',
                        operationalDisclosure: 'IB',
                        aircraft: {
                            code: '320',
                            description: 'Airbus A320'
                        }
                    },
                    durationParsed: '01h 25min.',
                    arrive: false,
                    cabin: {
                        rbd: 'S',
                        description: 'Economy',
                        remainingSeats: 0,
                        fareFamily: 'YR2PA',
                        code: 'R',
                        type: 'ECONOMY',
                        brandCode: '',
                        bookingClass: 'ECONOMY'
                    },
                    fareFamilyConditions: [
                        {
                            cabin: 'Basic',
                            cabinType: 'B',
                            code: 'EQMANO',
                            name: 'Hand baggage',
                            title: 'Hand luggage: 1 item',
                            message: '1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator',
                            units: undefined
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'B',
                            code: 'EQBODEGA',
                            name: 'Baggage in hold',
                            title: 'Checked baggage not included',
                            message: 'With a fee',
                            units: null
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'B',
                            code: 'EQPPRIOR',
                            name: 'Priority baggage delivery',
                            title: 'Fast bag drop not included',
                            message: 'With a fee',
                            units: null
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'EQMANO',
                            name: 'Hand baggage',
                            title: 'Hand luggage: 1 item',
                            message: '1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator',
                            units: undefined
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'EQBODEGA',
                            name: 'Baggage in hold',
                            title: 'Checked baggage not included',
                            message: 'With a fee',
                            units: null
                        },
                        {
                            cabin: 'Basic',
                            cabinType: 'E',
                            code: 'EQPPRIOR',
                            name: 'Priority baggage delivery',
                            title: 'Fast bag drop not included',
                            message: 'With a fee',
                            units: null
                        }
                    ],
                    companyURL: {
                        logo:'iconos/logo_IB_pos.svg',
                        logoMin: null
                    }
                }
            ],
            departureDateParsed: {
                dateTime: '09:15',
                weekDay: 'WEEKDAY_SUNDAY',
                day: 29,
                monthNumber: 6,
                month: 'MONTH_JUNE',
                year: 2025,
                originalDate: '2025-06-29T09:15:00+02:00',
                formatedDate: null
            },
            arrive: true
        }
    },
    orderItemsId: [
        'IBa1b0446a34424c22bd79e6070e96fea9OP_01',
        'IBa1b0446a34424c22bd79e6070e96fea9OP_02',
        'IBa1b0446a34424c22bd79e6070e96fea9OP_03'
    ],
    orderPrice: {
        fare: 212,
        tax: 39.73,
        total: 251.73,
        currency: 'EUR',
        ticketingFee: 0
    },
    voucherDiscount: {
        amount: 12,
        formattedAmount: '12 €',
        type: 'PARTNER',
        priceWithDiscount: 0,
        voucherId: 123,
        description: 'Partner voucher discount',
        totalDiscount: 12,
        discountFormatted: '12 €'
    },
    flightType: 'availabilityFlight',
    specialDiscounts: [
        {
            type: 'VOUCHER',
            percentDiscount: 5,
            totalDiscount: 5,
            total: 5, 
            formattedTotalDiscount: '5 €'
        }
    ],
    remainingTime: dayjs().add(4316, 'minute').format(),
    price: {
        original: 251.73,
        formatted: '251.73 €',
        perPassenger: '246.73 €'
    },
    paidDeposit: {
        priceFormat: '-5 €',
        price: 5
    },
    originalPrice: '246.73 €',
    warnings: {
        SSE_MMB_0001: {
            // code: 'SSE_MMB_0001',
            description: 'error de prueba'
        }
    },
    arrivalTime: {
        date: '2025-06-29',
        time: '09:15'
    },
    relatedContent:{
        CONFIRM_ONHOLD_CONDITIONS:{}
    },
    backgroundImageUrl: 'background/MAD.jpg'
};
export const generalInfoOWMock = {
    price:{
        original:'10'
    },
    flightType: 'availabilityFlight',
    origin:{
        code: 'MAD',
        city:{
            countryCode: 'ES',
            code: 'MAD'
        }
    },
    destination:{
        code: 'BCN',
        city:{
            countryCode: 'ES',
            code:'BCN'
        }
    },
    tripType: 1,
    flightInfo:{
        'MADBCN20250206':{
            arrivalCity:{
                code: 'BCN'
            },
            departureCity:{
                code: 'MAD'
            }
        }
    },
    passengersNumber:1,
    orderPrice:{
        total:100,
        tax:10
    }
};
export const generalInfoMultiMock = {
    price:{
        original:'10'
    },
    flightType: 'multiCityFlight',
    origin:{
        code: 'MAD',
        city:{
            countryCode: 'ES'
        }
    },
    destination:{
        code: 'PAR',
        city:{
            countryCode: 'FR'
        }
    },
    tripType: 2,
    flightInfo:{
        'MADBCN20250206':{
            arrivalCity:{
                code: 'BCN'
            },
            departureCity:{
                code: 'MAD'
            }
        },
        'PARBCN20250206':{
            arrivalCity:{
                code: 'PAR'
            },
            departureCity:{
                code: 'BCN'
            }
        }
    },
    passengersNumber:1,
    orderPrice:{
        total:100,
        tax:10
    }
};
export const mockAddToCartRT = {
    items: [
        {
            item_name: 'flight',
            item_id: 'MAD-BCN|BCN-MAD',
            price: 251.73,
            item_brand: 'iberia',
            item_category: 'confirmacion onhold',
            item_category2: 'BCN-MAD',
            item_category3: '2',
            item_variant: 'rt',
            quantity: 1
        }
    ]
};
export const mockAddToCartOW = {
    items: [
        {
            item_name: 'flight',
            item_id: 'MAD-BCN',
            price: '10',
            item_brand: 'iberia',
            item_category: 'confirmacion onhold',
            item_category2: 'MAD-BCN',
            item_category3: '1',
            item_variant: 'ow',
            quantity: 1
        }
    ]
};
export const mockAddToCartMulti = {
    items: [
        {
            item_name: 'flight',
            item_id: 'MAD-BCN|BCN-PAR',
            price: '10',
            item_brand: 'iberia',
            item_category: 'confirmacion onhold',
            item_category2: 'MAD-PAR',
            item_category3: 'all',
            item_variant: 'mt',
            quantity: 1
        }
    ]
};
export const modelMock = {
    generalInfo:generalInfoMock,
    passengers:[
        {
            passengerType:'ADULT'
        },
        {
            passengerType:'SENIOR'
        },
        {
            passengerType:'YOUTH'
        },
        {
            passengerType:'CHILD'
        },
        {
            passengerType:'INFANT'
        }
    ]
};
export const digitalDataMock = {
    Slice0OriginalDate: '10/10/2070',
    Slice1OriginalDate: '10/10/2070',
    OriginalDate: '10/10/2070-10/10/2070',
    LengthStay: 14,
    Slice1Flights: 'IB0411',
    Slice1Operator: 'IB',
    Slice1Cabin: 'BUSINESS',
    Slice1Routing: 'MAD-BCN',
    SearchDest: 'BCN',
    SearchOD: 'MAD-BCN',
    Slice1FareFamily: 'Business Optima',
    Slice2Flights: 'IB0404',
    Slice2Operator: 'IB',
    Slice2Cabin: 'ECONOMY',
    Slice2Routing: 'BCN-MAD',
    Slice2FareFamily: 'Turista Flexible',
    PaxTotal: 5,
    PaxAdult: 1,
    PaxSenior: 1,
    PaxYoung: 1,
    PaxChild: 1,
    PaxInfant: 1,
    FlightType: 'RT',
    FlightStatus: 'ON_HOLD_CONFIRMABLE',
    FlightHaul: 'Corto Radio',
    TotalPrice: 251.73,
    TotalPriceWithoutTaxes: 212,
    TotalTaxes: 39.73,
    Currency: 'EUR',
    Reference: 'J6GV6',
    AirportSeg: 'MAD-BCN',
    SearchCountries: 'ES-ES',
    SearchOrigin: 'MAD',
    OrderId: 'Qm9va2luZ0BJQmExYjA0NDZhMzQ0MjRjMjJiZDc5ZTYwNzBlOTZmZWE5T1A=',
    CashAviosUsed: 'no',
    VoucherUsed: 'no',
    SpecialMeal: false,
    AviosEarned: '10',
    AdvancePurchase: (Math.round((new Date('2025-06-15 11:25').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString(),
    IbplusHolder: 'NO'
};
export const digitalDataOWMock = {
    Slice0OriginalDate: '10/10/2070',
    OriginalDate: '10/10/2070',
    LengthStay: 0,
    Slice1Flights: 'IB0404-IB0403',
    Slice1Operator: 'IB-IB',
    Slice1Cabin: 'BUSINESS-BUSINESS',
    Slice1Routing: 'MAD-BIO-BCN',
    SearchDest: 'BCN',
    SearchOD: 'MAD-BCN',
    Slice1FareFamily: 'Business Optima-Business Optima',
    PaxTotal: 5,
    PaxAdult: 1,
    PaxSenior: 1,
    PaxYoung: 1,
    PaxChild: 1,
    PaxInfant: 1,
    FlightType: 'OW',
    FlightStatus: 'ON_HOLD_CONFIRMABLE',
    FlightHaul: 'Medio radio',
    TotalPrice: 100,
    TotalPriceWithoutTaxes: 90,
    TotalTaxes: 10,
    Currency: 'EUR',
    Reference: 'MFW092',
    AirportSeg: 'MAD-BCN',
    SearchCountries: 'ES-ES',
    SearchOrigin: 'MAD',
    OrderId: 'Qm9va2luZ0BJQmExYjA0NDZhMzQ0MjRjMjJiZDc5ZTYwNzBlOTZmZWE5T1A=',
    CashAviosUsed: 'no',
    VoucherUsed: 'no',
    SpecialMeal: false,
    AviosEarned: '10',
    AdvancePurchase: (Math.round((new Date('2070-06-15 11:25').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString(),
    IbplusHolder: 'NO'
};
export const digitalDataMultiMock = {
    Slice0OriginalDate: '10/10/2070',
    Slice1OriginalDate: '10/10/2070',
    OriginalDate: '10/10/2070-10/10/2070',
    LengthStay: 0,
    Slice1Flights: 'IB0404',
    Slice1Operator: 'IB',
    Slice1Cabin: 'BUSINESS',
    Slice1Routing: 'MAD-BCN',
    SearchDest: 'PAR',
    SearchOD: 'BCN-PAR',
    Slice1FareFamily: 'Business Optima',
    Slice2Flights: 'IB0713',
    Slice2Operator: 'IB',
    Slice2Cabin: 'ECONOMY',
    Slice2Routing: 'BCN-PAR',
    Slice2FareFamily: 'Turista Flexible',
    PaxTotal: 5,
    PaxAdult: 1,
    PaxSenior: 1,
    PaxYoung: 1,
    PaxChild: 1,
    PaxInfant: 1,
    FlightType: 'RT',
    FlightStatus: 'ON_HOLD_CONFIRMABLE',
    FlightHaul: 'Medio radio',
    TotalPrice: 100,
    TotalPriceWithoutTaxes: 90,
    TotalTaxes: 10,
    Currency: 'EUR',
    Reference: 'MFW092',
    AirportSeg: 'MAD-PAR',
    SearchCountries: 'ES-FR',
    SearchOrigin: 'MAD-MAD',
    OrderId: 'Qm9va2luZ0BJQmExYjA0NDZhMzQ0MjRjMjJiZDc5ZTYwNzBlOTZmZWE5T1A=',
    CashAviosUsed: 'no',
    VoucherUsed: 'no',
    SpecialMeal: false,
    AviosEarned: '10',
    AdvancePurchase: (Math.round((new Date('2070-06-15 11:25').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString(),
    IbplusHolder: 'NO'
};

export const bookingInfoMultiMock = {
    order:{
        slices:[{
            segments:[{
                departure:{
                    code:'MAD',
                    city:{
                        code:'MAD'
                    }
                },
                departureCity:{
                    code:'MAD'
                },
                arrivalCity:{
                    code:'BCN'
                },
                arrival:{
                    code:'BCN',
                    city:{
                        code:'BCN'
                    }
                },
                cabin:{
                    bookingClass:'BUSINESS',
                    fareFamily:'BUSOPTMH'
                },
                flight: {
                    operationalDisclosure: 'IB',
                    operationalFlightNumber:'0404'
                }
            }],
            departureDateTime: '2070-06-15 11:25',
            arrivalDateTime: '2070-06-15 12:40'
        }, {
            segments:[{
                departure:{
                    code:'BCN',
                    city:{
                        code:'BCN'
                    }
                },
                departureCity:{
                    code:'MAD'
                },
                arrivalCity:{
                    code:'PAR'
                },
                arrival:{
                    code:'PAR',
                    city:{
                        code:'PAR'
                    }
                },
                cabin:{
                    bookingClass:'ECONOMY',
                    fareFamily:'YR2PA'
                },
                flight: {
                    operationalDisclosure: 'IB',
                    operationalFlightNumber:'0713'
                }
            }],
            departureDateTime: '2070-06-15 11:25',
            arrivalDateTime: '2070-06-15 12:40'
        }],
        bookingReferences:[{
            reference:'MFW092'
        }],
        price:{
            currency:'EUR'
        },
        status:'ON_HOLD_CONFIRMABLE',
        flightRatio:'Medio radio',
        orderId:'Qm9va2luZ0BJQmExYjA0NDZhMzQ0MjRjMjJiZDc5ZTYwNzBlOTZmZWE5T1A='
    }
};
export const bookingInfoOWMock = {
    order:{
        slices:[{
            segments:[{
                departure:{
                    code:'MAD',
                    city:{
                        code:'MAD'
                    }
                },
                departureCity:{
                    code:'MAD'
                },
                arrivalCity:{
                    code:'BIO'
                },
                arrival:{
                    code:'BIO',
                    city:{
                        code:'BIO'
                    }
                },
                cabin:{
                    bookingClass:'BUSINESS',
                    fareFamily:'BUSOPTMH'
                },
                flight: {
                    operationalDisclosure: 'IB',
                    operationalFlightNumber:'0404'
                }
            },
            {
                departure:{
                    code:'BIO',
                    city:{
                        code:'BIO'
                    }
                },
                departureCity:{
                    code:'BIO'
                },
                arrivalCity:{
                    code:'BCN'
                },
                arrival:{
                    code:'BCN',
                    city:{
                        code:'BCN'
                    }
                },
                cabin:{
                    bookingClass:'BUSINESS',
                    fareFamily:'BUSOPTMH'
                },
                flight: {
                    operationalDisclosure: 'IB',
                    marketingFlightNumber: '0403'
                }
            }],
            departureDateTime: '2070-06-15 11:25',
            arrivalDateTime: '2070-06-15 12:40'
        }],
        bookingReferences:[{
            reference:'MFW092'
        }],
        price:{
            currency:'EUR'
        },
        status:'ON_HOLD_CONFIRMABLE',
        flightRatio:'Medio radio',
        orderId:'Qm9va2luZ0BJQmExYjA0NDZhMzQ0MjRjMjJiZDc5ZTYwNzBlOTZmZWE5T1A='
    }
};
