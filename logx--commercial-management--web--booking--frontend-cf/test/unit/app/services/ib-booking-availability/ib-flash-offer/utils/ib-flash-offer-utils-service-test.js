describe('IbFlashOfferUtilsService test', function () {

    var rootScope, IbFlashOfferUtilsService;
    var mockResponseRequestDirectFare = {
        request: {
            flashOfferId: 'ESMADLYS151121060024112121552911211850',
            passengers: [
                {
                    passengerType: 'ADULT',
                    count: 1
                },
                { passengerType: 'CHILD', count: 1 },
                { passengerType: 'INFANT', count: 1 },
                { passengerType: 'YOUTH', count: 1 },
                { passengerType: 'YOUNG', count: 1 }
            ],
            specialDiscounts :[]
        },
        passengerCount:{
            passengers: 5,
            numAdults: 1,
            numSeniors: 0,
            numYoung: 1,
            numTeenager: 1,
            numInfant: 1,
            numChilds: 1,
            numberPassengrsWithoutInfant: 4
        }
    };
    var mockOffer = [
        {
            offerId: 'IB5e358108ce2c41caaf19ed9a3aa1c3d8OP',
            price: {
                fare: 32,
                tax: 44.2,
                total: 76.2,
                currency: 'EUR',
                ticketingFee: 0
            },
            slices: [
                {
                    sliceId: 'MADLYS20211124215500',
                    departureDateTime: '2021-11-24 21:55',
                    arrivalDateTime: '2021-11-24 23:45',
                    duration: 110,
                    stopsNumber: 0,
                    price: {
                        fare: 16,
                        tax: 22.1,
                        total: 38.1,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    detailedPrices: [
                        {
                            fare: 16,
                            tax: 22.1,
                            total: 38.1,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                {
                                    price: {
                                        fare: 16,
                                        currency: 'EUR'
                                    },
                                    originCurrencyPrice: {
                                        fare: 16,
                                        currency: 'EUR'
                                    },
                                    fareCode: 'AFLASHB4',
                                    segmentsIds: [
                                        'IB872220211124'
                                    ],
                                    ticketDesignator: null,
                                    endorsement: '057069.REF AND CHGS RESTRI'
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
                                code: 'LYS',
                                name: 'Lyon St-Exupery',
                                terminal: '2',
                                city: {
                                    code: 'LYS',
                                    description: 'Lyón',
                                    countryCode: 'FR',
                                    country: {
                                        code: 'FR',
                                        description: 'Francia'
                                    }
                                }
                            },
                            flight: {
                                marketingCarrier: {
                                    code: 'IB',
                                    name: 'Iberia'
                                },
                                operationalCarrier: {
                                    code: 'YW',
                                    name: 'AIR NOSTRUM'
                                },
                                marketingFlightNumber: '8722',
                                operationalFlightNumber: null,
                                operationalDisclosure: 'YW',
                                aircraft: {
                                    code: 'CRK',
                                    description: 'Canadair (Bombardier) Regional Jet 1000'
                                }
                            },
                            cabin: {
                                rbd: 'A',
                                bookingCode: 'COACH',
                                bookingClass: 'ECONOMY',
                                remainingSeats: 0,
                                fareFamily: 'TBAESEU',
                                fareBasis: 'AFLASHB4',
                                seatDisplays: null,
                                extendedFareCode: null,
                                brandCode: null,
                                cabinDescription: 'Turista'
                            },
                            overnight: false,
                            id: 'IB872220211124',
                            duration: 110,
                            waitingTime: 0,
                            providerId: null,
                            ticketDesignator: '',
                            accrualQuote: null,
                            delayInformation: null,
                            stop: null,
                            departureDateTime: '2021-11-24 21:55',
                            arrivalDateTime: '2021-11-24 23:45',
                            secureFlightInformed: false,
                            secureFlight: false
                        }
                    ],
                    overnight: false,
                    origin: null,
                    destination: null,
                    originDestinationKey: null
                },
                {
                    sliceId: 'LYSMAD20211129185000',
                    departureDateTime: '2021-11-29 18:50',
                    arrivalDateTime: '2021-11-29 20:45',
                    duration: 115,
                    stopsNumber: 0,
                    price: {
                        fare: 16,
                        tax: 22.1,
                        total: 38.1,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    detailedPrices: [
                        {
                            fare: 16,
                            tax: 22.1,
                            total: 38.1,
                            currency: 'EUR',
                            passengerIds: [
                                'ADULT_01'
                            ],
                            segmentPrices: [
                                {
                                    price: {
                                        fare: 16,
                                        currency: 'EUR'
                                    },
                                    originCurrencyPrice: {
                                        fare: 16,
                                        currency: 'EUR'
                                    },
                                    fareCode: 'AFLASHB4',
                                    segmentsIds: [
                                        'IB872120211129'
                                    ],
                                    ticketDesignator: null,
                                    endorsement: '057069.REF AND CHGS RESTRI'
                                }
                            ],
                            commission: null,
                            ticketingFee: 0
                        }
                    ],
                    segments: [
                        {
                            departure: {
                                code: 'LYS',
                                name: 'Lyon St-Exupery',
                                terminal: '2',
                                city: {
                                    code: 'LYS',
                                    description: 'Lyón',
                                    countryCode: 'FR',
                                    country: {
                                        code: 'FR',
                                        description: 'Francia'
                                    }
                                }
                            },
                            arrival: {
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
                            flight: {
                                marketingCarrier: {
                                    code: 'IB',
                                    name: 'Iberia'
                                },
                                operationalCarrier: {
                                    code: 'YW',
                                    name: 'AIR NOSTRUM'
                                },
                                marketingFlightNumber: '8721',
                                operationalFlightNumber: null,
                                operationalDisclosure: 'YW',
                                aircraft: {
                                    code: 'CRK',
                                    description: 'Canadair (Bombardier) Regional Jet 1000'
                                }
                            },
                            cabin: {
                                rbd: 'A',
                                bookingCode: 'COACH',
                                bookingClass: 'ECONOMY',
                                remainingSeats: 0,
                                fareFamily: 'TBAESEU',
                                fareBasis: 'AFLASHB4',
                                seatDisplays: null,
                                extendedFareCode: null,
                                brandCode: null,
                                cabinDescription: 'Turista'
                            },
                            overnight: false,
                            id: 'IB872120211129',
                            duration: 115,
                            waitingTime: 0,
                            providerId: null,
                            ticketDesignator: '',
                            accrualQuote: null,
                            delayInformation: null,
                            stop: null,
                            departureDateTime: '2021-11-29 18:50',
                            arrivalDateTime: '2021-11-29 20:45',
                            secureFlightInformed: false,
                            secureFlight: false
                        }
                    ],
                    overnight: false,
                    origin: null,
                    destination: null,
                    originDestinationKey: null
                }
            ],
            offerExpiration: '2021-11-15T15:42:32.703+01:00',
            paymentTimeLimit: '2021-11-16T22:59:59.000+00:00',
            onHoldOptions: [],
            cashAviosPossibilities: [],
            carryOnBaggageAllowances: [
                {
                    totalQuantity: 1,
                    segmentIds: [
                        'IB872220211124',
                        'IB872120211129'
                    ],
                    pieceAllowances: null
                }
            ],
            checkedBagAllowances: [
                {
                    totalQuantity: 0,
                    pieceAllowances: [],
                    segmentIds: [
                        'IB872120211129'
                    ]
                },
                {
                    totalQuantity: 0,
                    pieceAllowances: [],
                    segmentIds: [
                        'IB872220211124'
                    ]
                }
            ],
            availableServices: [],
            selectedServices: [],
            specialDiscountsApplied: [
                {
                    type: 'CORPORATE',
                    discountType: 'GENERAL',
                    description: 'Descuento exclusivo',
                    percentDiscount: 0,
                    totalDiscount: 0,
                    corporateCodes: '057069'
                }
            ],
            accrualQuote: {
                redemptionPoints: null,
                qualificationPoints: null
            },
            offerItems: [
                {
                    offerItemId: 'IB5e358108ce2c41caaf19ed9a3aa1c3d8OP_01',
                    passengerIds: [
                        'ADULT_01'
                    ],
                    price: {
                        fare: 32,
                        tax: 44.2,
                        total: 76.2,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    detailedTaxes: [
                        {
                            code: 'JD',
                            amount: 14.95,
                            currency: 'EUR',
                            description: 'Cargo por salida',
                            subcode: null,
                            country: null,
                            carrier: null
                        },
                        {
                            code: 'OG',
                            amount: 0.62,
                            currency: 'EUR',
                            description: 'Tasa de seguridad',
                            subcode: null,
                            country: null,
                            carrier: null
                        },
                        {
                            code: 'QV',
                            amount: 3.38,
                            currency: 'EUR',
                            description: 'Seguridad',
                            subcode: null,
                            country: null,
                            carrier: null
                        },
                        {
                            code: 'FR',
                            amount: 8.25,
                            currency: 'EUR',
                            description: 'Tasa aeroportuaria, Tasa de aviación civil',
                            subcode: null,
                            country: null,
                            carrier: null
                        },
                        {
                            code: 'IZ',
                            amount: 1.13,
                            currency: 'EUR',
                            description: 'Tasa solidaria por pasajero aéreo',
                            subcode: null,
                            country: null,
                            carrier: null
                        },
                        {
                            code: 'FR',
                            amount: 4.66,
                            currency: 'EUR',
                            description: 'Tasa aeroportuaria, Tasa de aviación civil',
                            subcode: null,
                            country: null,
                            carrier: null
                        },
                        {
                            code: 'QX',
                            amount: 9.71,
                            currency: 'EUR',
                            description: 'Cargo por servicios al pasajero – Int.',
                            subcode: null,
                            country: null,
                            carrier: null
                        },
                        {
                            code: 'O4',
                            amount: 1.5,
                            currency: 'EUR',
                            description: 'Otras tasas',
                            subcode: null,
                            country: null,
                            carrier: null
                        }
                    ],
                    reshopDetailedTaxes: [],
                    fareCalculation: 'MAD IB LYS18.53 IB MAD18.53NUC37.06END ROE0.863211',
                    fareComponents: [
                        {
                            remarks: '  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n    AFTER DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n  CHANGES\n    CHANGES NOT PERMITTED IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      PER TICKET CHARGE EUR 65.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      PER TICKET CHARGE EUR 65.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AND REISSUE AFTER\n          SCHEDULED FLIGHT CHANGES NO PERMITED.\n          OTHERWISE THE TICKET WILL ONLY BE VALID FOR\n          REFUND IF APPLICABLE.\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFOUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                            segmentIds: [
                                'IB872220211124'
                            ],
                            details: [
                                {
                                    type: 'Change',
                                    application: 'BEFORE-DEPARTURE',
                                    minPrice: {
                                        amount: 65,
                                        currency: 'EUR'
                                    },
                                    maxPrice: {
                                        amount: 65,
                                        currency: 'EUR'
                                    },
                                    nonrefundable: false,
                                    cancelFeeInd: false,
                                    changeFeeInd: false
                                },
                                {
                                    type: 'Change',
                                    application: 'AFTER-DEPARTURE',
                                    minPrice: {
                                        amount: 65,
                                        currency: 'EUR'
                                    },
                                    maxPrice: {
                                        amount: 65,
                                        currency: 'EUR'
                                    },
                                    nonrefundable: false,
                                    cancelFeeInd: false,
                                    changeFeeInd: false
                                }
                            ],
                            privateFareInformationWebResponse: [
                                {
                                    segmentReferences: [
                                        'IB872220211124'
                                    ],
                                    productName: '',
                                    subProductName: '',
                                    fareCode: '',
                                    fareBasisCode: 'AFLASHB4',
                                    accountCode: 'FLASH',
                                    tourBoxcode: null,
                                    fareBoxText: null,
                                    accountCodeAmadeus: ''
                                }
                            ]
                        },
                        {
                            remarks: '  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n    AFTER DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n  CHANGES\n    CHANGES NOT PERMITTED IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      PER TICKET CHARGE EUR 65.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      PER TICKET CHARGE EUR 65.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AND REISSUE AFTER\n          SCHEDULED FLIGHT CHANGES NO PERMITED.\n          OTHERWISE THE TICKET WILL ONLY BE VALID FOR\n          REFUND IF APPLICABLE.\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFOUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                            segmentIds: [
                                'IB872120211129'
                            ],
                            details: [
                                {
                                    type: 'Change',
                                    application: 'BEFORE-DEPARTURE',
                                    minPrice: {
                                        amount: 65,
                                        currency: 'EUR'
                                    },
                                    maxPrice: {
                                        amount: 65,
                                        currency: 'EUR'
                                    },
                                    nonrefundable: false,
                                    cancelFeeInd: false,
                                    changeFeeInd: false
                                },
                                {
                                    type: 'Change',
                                    application: 'AFTER-DEPARTURE',
                                    minPrice: {
                                        amount: 65,
                                        currency: 'EUR'
                                    },
                                    maxPrice: {
                                        amount: 65,
                                        currency: 'EUR'
                                    },
                                    nonrefundable: false,
                                    cancelFeeInd: false,
                                    changeFeeInd: false
                                }
                            ],
                            privateFareInformationWebResponse: [
                                {
                                    segmentReferences: [
                                        'IB872120211129'
                                    ],
                                    productName: '',
                                    subProductName: '',
                                    fareCode: '',
                                    fareBasisCode: 'AFLASHB4',
                                    accountCode: 'FLASH',
                                    tourBoxcode: null,
                                    fareBoxText: null,
                                    accountCodeAmadeus: ''
                                }
                            ]
                        }
                    ],
                    surcharges: null
                }
            ],
            type: 'REGULAR'
        }
    ];
    var fakeBookingUtilService = {
        getURLFirstParameterByName: function (parameter) {
           var value = '';
            switch (parameter){
                case 'flashOfferId':
                   value = 'ESMADLYS151121060024112121552911211850';
                   break;
                case 'ADT':
                    value = '1';
                    break;
                case 'CHD':
                    value = '1';
                    break;
                case 'INF':
                    value = '1';
                    break;
                case 'BNN':
                    value = '1';
                    break;
                case 'YTH':
                    value = '1';
                    break;
           }
           return value;
        },
    };
    var mockResponseNewHeaderData = {
        dates: {
            outboundFlight: '2021-11-24 21:55',
            formatedOutboundFlight: '24/11/2021',
            returnFlight: '2021-11-29 18:50',
            formatedReturnFlight: '29/11/2021'
        },
        originCity: {
            code: 'MAD',
            description: 'Madrid',
            timezone: '',
            country: {
                code: 'ES',
                description: 'España'
            }
        },
        destinationCity: {
            code: 'LYS',
            description: 'Lyón',
            timezone: '',
            country: {
                code: 'FR',
                description: 'Francia'
            }
        }
    };
    var mockSlices = [
        {
            sliceId: 'MADLYS20211124215500',
            departureDateTime: '2021-11-24 21:55',
            arrivalDateTime: '2021-11-24 23:45',
            duration: 110,
            stopsNumber: 0,
            price: {
                fare: 16,
                tax: 22.1,
                total: 38.1,
                currency: 'EUR',
                ticketingFee: 0
            },
            detailedPrices: [
                {
                    fare: 16,
                    tax: 22.1,
                    total: 38.1,
                    currency: 'EUR',
                    passengerIds: [
                        'ADULT_01'
                    ],
                    segmentPrices: [
                        {
                            price: {
                                fare: 16,
                                currency: 'EUR'
                            },
                            originCurrencyPrice: {
                                fare: 16,
                                currency: 'EUR'
                            },
                            fareCode: 'AFLASHB4',
                            segmentsIds: [
                                'IB872220211124'
                            ],
                            ticketDesignator: null,
                            endorsement: '057069.REF AND CHGS RESTRI'
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
                        code: 'LYS',
                        name: 'Lyon St-Exupery',
                        terminal: '2',
                        city: {
                            code: 'LYS',
                            description: 'Lyón',
                            countryCode: 'FR',
                            country: {
                                code: 'FR',
                                description: 'Francia'
                            }
                        }
                    },
                    flight: {
                        marketingCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        operationalCarrier: {
                            code: 'YW',
                            name: 'AIR NOSTRUM'
                        },
                        marketingFlightNumber: '8722',
                        operationalFlightNumber: null,
                        operationalDisclosure: 'YW',
                        aircraft: {
                            code: 'CRK',
                            description: 'Canadair (Bombardier) Regional Jet 1000'
                        }
                    },
                    cabin: {
                        rbd: 'A',
                        bookingCode: 'COACH',
                        bookingClass: 'ECONOMY',
                        remainingSeats: 0,
                        fareFamily: 'TBAESEU',
                        fareBasis: 'AFLASHB4',
                        seatDisplays: null,
                        extendedFareCode: null,
                        brandCode: null,
                        cabinDescription: 'Turista'
                    },
                    overnight: false,
                    id: 'IB872220211124',
                    duration: 110,
                    waitingTime: 0,
                    providerId: null,
                    ticketDesignator: '',
                    accrualQuote: null,
                    delayInformation: null,
                    stop: null,
                    departureDateTime: '2021-11-24 21:55',
                    arrivalDateTime: '2021-11-24 23:45',
                    secureFlightInformed: false,
                    secureFlight: false
                }
            ],
            overnight: false,
            origin: null,
            destination: null,
            originDestinationKey: null
        },
        {
            sliceId: 'LYSMAD20211129185000',
            departureDateTime: '2021-11-29 18:50',
            arrivalDateTime: '2021-11-29 20:45',
            duration: 115,
            stopsNumber: 0,
            price: {
                fare: 16,
                tax: 22.1,
                total: 38.1,
                currency: 'EUR',
                ticketingFee: 0
            },
            detailedPrices: [
                {
                    fare: 16,
                    tax: 22.1,
                    total: 38.1,
                    currency: 'EUR',
                    passengerIds: [
                        'ADULT_01'
                    ],
                    segmentPrices: [
                        {
                            price: {
                                fare: 16,
                                currency: 'EUR'
                            },
                            originCurrencyPrice: {
                                fare: 16,
                                currency: 'EUR'
                            },
                            fareCode: 'AFLASHB4',
                            segmentsIds: [
                                'IB872120211129'
                            ],
                            ticketDesignator: null,
                            endorsement: '057069.REF AND CHGS RESTRI'
                        }
                    ],
                    commission: null,
                    ticketingFee: 0
                }
            ],
            segments: [
                {
                    departure: {
                        code: 'LYS',
                        name: 'Lyon St-Exupery',
                        terminal: '2',
                        city: {
                            code: 'LYS',
                            description: 'Lyón',
                            countryCode: 'FR',
                            country: {
                                code: 'FR',
                                description: 'Francia'
                            }
                        }
                    },
                    arrival: {
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
                    flight: {
                        marketingCarrier: {
                            code: 'IB',
                            name: 'Iberia'
                        },
                        operationalCarrier: {
                            code: 'YW',
                            name: 'AIR NOSTRUM'
                        },
                        marketingFlightNumber: '8721',
                        operationalFlightNumber: null,
                        operationalDisclosure: 'YW',
                        aircraft: {
                            code: 'CRK',
                            description: 'Canadair (Bombardier) Regional Jet 1000'
                        }
                    },
                    cabin: {
                        rbd: 'A',
                        bookingCode: 'COACH',
                        bookingClass: 'ECONOMY',
                        remainingSeats: 0,
                        fareFamily: 'TBAESEU',
                        fareBasis: 'AFLASHB4',
                        seatDisplays: null,
                        extendedFareCode: null,
                        brandCode: null,
                        cabinDescription: 'Turista'
                    },
                    overnight: false,
                    id: 'IB872120211129',
                    duration: 115,
                    waitingTime: 0,
                    providerId: null,
                    ticketDesignator: '',
                    accrualQuote: null,
                    delayInformation: null,
                    stop: null,
                    departureDateTime: '2021-11-29 18:50',
                    arrivalDateTime: '2021-11-29 20:45',
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
    var mockResponseCreateModeltoHeader = {
        availabilityData: {
            originDestinations: [
                {
                    origin: {
                        code: 'MAD',
                        description: 'Madrid',
                        timezone: '',
                        country: {
                            code: 'ES',
                            description: 'España'
                        }
                    },
                    destination: {
                        code: 'LYS',
                        description: 'Lyón',
                        timezone: '',
                        country: {
                            code: 'FR',
                            description: 'Francia'
                        }
                    },
                    date: '24/11/2021',
                    destinationCity: {
                        code: 'LYS',
                        description: 'Lyón',
                        timezone: '',
                        country: {
                            code: 'FR',
                            description: 'Francia'
                        }
                    },
                    originCity: {
                        code: 'MAD',
                        description: 'Madrid',
                        timezone: '',
                        country: {
                            code: 'ES',
                            description: 'España'
                        }
                    }
                },
                {
                    origin: {
                        code: 'LYS',
                        description: 'Lyón',
                        timezone: '',
                        country: {
                            code: 'FR',
                            description: 'Francia'
                        }
                    },
                    destination: {
                        code: 'MAD',
                        description: 'Madrid',
                        timezone: '',
                        country: {
                            code: 'ES',
                            description: 'España'
                        }
                    },
                    date: '29/11/2021',
                    destinationCity: {
                        code: 'MAD',
                        description: 'Madrid',
                        timezone: '',
                        country: {
                            code: 'ES',
                            description: 'España'
                        }
                    },
                    originCity: {
                        code: 'LYS',
                        description: 'Lyón',
                        timezone: '',
                        country: {
                            code: 'FR',
                            description: 'Francia'
                        }
                    }
                }
            ]
        },
        selectedSlices: [
            {
                info: {
                    departureDateTime: '2021-11-24 21:55',
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
                                code: 'LYS',
                                name: 'Lyon St-Exupery',
                                terminal: '2',
                                city: {
                                    code: 'LYS',
                                    description: 'Lyón',
                                    countryCode: 'FR',
                                    country: {
                                        code: 'FR',
                                        description: 'Francia'
                                    }
                                }
                            },
                            flight: {
                                marketingCarrier: {
                                    code: 'IB',
                                    name: 'Iberia'
                                },
                                operationalCarrier: {
                                    code: 'YW',
                                    name: 'AIR NOSTRUM'
                                },
                                marketingFlightNumber: '8722',
                                operationalFlightNumber: null,
                                operationalDisclosure: 'YW',
                                aircraft: {
                                    code: 'CRK',
                                    description: 'Canadair (Bombardier) Regional Jet 1000'
                                }
                            },
                            cabin: {
                                rbd: 'A',
                                bookingCode: 'COACH',
                                bookingClass: 'ECONOMY',
                                remainingSeats: 0,
                                fareFamily: 'TBAESEU',
                                fareBasis: 'AFLASHB4',
                                seatDisplays: null,
                                extendedFareCode: null,
                                brandCode: null,
                                cabinDescription: 'Turista'
                            },
                            overnight: false,
                            id: 'IB872220211124',
                            duration: 110,
                            waitingTime: 0,
                            providerId: null,
                            ticketDesignator: '',
                            accrualQuote: null,
                            delayInformation: null,
                            stop: null,
                            departureDateTime: '2021-11-24 21:55',
                            arrivalDateTime: '2021-11-24 23:45',
                            secureFlightInformed: false,
                            secureFlight: false
                        }
                    ]
                },
                destination: 'LYS'
            },
            {
                info: {
                    departureDateTime: '2021-11-29 18:50',
                    segments: [
                        {
                            departure: {
                                code: 'LYS',
                                name: 'Lyon St-Exupery',
                                terminal: '2',
                                city: {
                                    code: 'LYS',
                                    description: 'Lyón',
                                    countryCode: 'FR',
                                    country: {
                                        code: 'FR',
                                        description: 'Francia'
                                    }
                                }
                            },
                            arrival: {
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
                            flight: {
                                marketingCarrier: {
                                    code: 'IB',
                                    name: 'Iberia'
                                },
                                operationalCarrier: {
                                    code: 'YW',
                                    name: 'AIR NOSTRUM'
                                },
                                marketingFlightNumber: '8721',
                                operationalFlightNumber: null,
                                operationalDisclosure: 'YW',
                                aircraft: {
                                    code: 'CRK',
                                    description: 'Canadair (Bombardier) Regional Jet 1000'
                                }
                            },
                            cabin: {
                                rbd: 'A',
                                bookingCode: 'COACH',
                                bookingClass: 'ECONOMY',
                                remainingSeats: 0,
                                fareFamily: 'TBAESEU',
                                fareBasis: 'AFLASHB4',
                                seatDisplays: null,
                                extendedFareCode: null,
                                brandCode: null,
                                cabinDescription: 'Turista'
                            },
                            overnight: false,
                            id: 'IB872120211129',
                            duration: 115,
                            waitingTime: 0,
                            providerId: null,
                            ticketDesignator: '',
                            accrualQuote: null,
                            delayInformation: null,
                            stop: null,
                            departureDateTime: '2021-11-29 18:50',
                            arrivalDateTime: '2021-11-29 20:45',
                            secureFlightInformed: false,
                            secureFlight: false
                        }
                    ]
                },
                destination: 'MAD'
            }
        ]
    };
    var mockPassenger = [
        {
            passengerType: 'ADULT',
            count: 1
        }
    ];
    var mockOriginDestination = [
        {
            origin: {
                code: 'MAD',
                description: 'Madrid',
                timezone: '',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            },
            destination: {
                code: 'LYS',
                description: 'Lyón',
                timezone: '',
                country: {
                    code: 'FR',
                    description: 'Francia'
                }
            },
            date: '24/11/2021',
            destinationCity: {
                code: 'LYS',
                description: 'Lyón',
                timezone: '',
                country: {
                    code: 'FR',
                    description: 'Francia'
                }
            },
            originCity: {
                code: 'MAD',
                description: 'Madrid',
                timezone: '',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        {
            origin: {
                code: 'LYS',
                description: 'Lyón',
                timezone: '',
                country: {
                    code: 'FR',
                    description: 'Francia'
                }
            },
            destination: {
                code: 'MAD',
                description: 'Madrid',
                timezone: '',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            },
            date: '29/11/2021',
            destinationCity: {
                code: 'MAD',
                description: 'Madrid',
                timezone: '',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            },
            originCity: {
                code: 'LYS',
                description: 'Lyón',
                timezone: '',
                country: {
                    code: 'FR',
                    description: 'Francia'
                }
            }
        }
    ];
    var fakeBookingAvailabilityConstants = {
        PASSENGER_ID:{
            ADT: 'ADT',
            CHD: 'CHD',
            INF: 'INF',
            BNN: 'BNN',
            YTH: 'YTH'
        }
    };
    var fakeCommonsConstants = {
        PASSENGER_TYPES: {
            DEFAULT: 'DEFAULT',
            SENIOR: 'SENIOR',
            ADULT: 'ADULT',
            YOUTH: 'YOUTH',
            YOUNG: 'YOUNG',
            CHILD: 'CHILD',
            INFANT: 'INFANT',
            SPECIAL_NEEDS: 'SPECIAL_NEEDS'
        },
        DISCOUNT_TYPE: {
            RESIDENT: 'RES',
            LARGE_FAMILY: 'LGF',
            DUMBO: 'DUMBO',
            PLUTO: 'PLUTO',
            PARTNER: 'PARTNER',
            DYNAMIC_PRICING: 'DYNAMIC_PRICING',
            CORPORATE: 'CORPORATE'
        },
        RESIDENT_CODE: {
            CANARIAS: 'RC',
            BALEARES: 'BP',
            MELILLA: 'RM',
            CEUTA: 'BC'
        },
        RESIDENT_DISCOUNT_TYPE: {
            CANARIAS: 'CANARIAS',
            BALEARES: 'BALEARES',
            MELILLA: 'MELILLA',
            CEUTA: 'CEUTA'
        },
        LARGE_FAMILY_CODE: {
            GENERAL: 'F1',
            SPECIAL: 'F2'
        },
        LARGE_FAMILY_TYPE: {
            GENERAL: 'GENERAL',
            SPECIAL: 'SPECIAL'
        }
    };
    var fakeBookingAppConstants = {
        market: 'es'
    }

    var fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-flash-offer-service-module', 'ib-booking-filters-module','ib-commons-filters-module', function ($provide) {
            $provide.value('BookingAvailabilityConstants', fakeBookingAvailabilityConstants);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('CommonsConstants', fakeCommonsConstants);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingRedirectionService', fakeRedirectionService);
        });
        inject(function ($rootScope,_IbFlashOfferUtilsService_, $filter, _localStorageService_) {
            IbFlashOfferUtilsService = _IbFlashOfferUtilsService_;
            rootScope = $rootScope;
        });
    })

    describe('When createRequestDirectFare is called', ()=>{
        it('it is not resident and family',  () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((parameter)=>{
                var value = '';
                switch (parameter){
                    case 'flashOfferId':
                    value = 'ESMADLYS151121060024112121552911211850';
                    break;
                    case 'ADT':
                        value = '1';
                        break;
                    case 'CHD':
                        value = '1';
                        break;
                    case 'INF':
                        value = '1';
                        break;
                    case 'BNN':
                        value = '1';
                        break;
                    case 'YTH':
                        value = '1';
                        break;
                    case 'residentCode':
                        value = null;
                        break;
                    case 'familianumerosa':
                        value = null;
                        break;
                }
                return value;
            })
            var respose = IbFlashOfferUtilsService.createRequestDirectFare();
            expect(respose.request).toEqual(mockResponseRequestDirectFare.request);
            expect(respose.passengerCount).toEqual(mockResponseRequestDirectFare.passengerCount);
        });
        it('it is Canary resident and it is general large family',  () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((parameter)=>{
                var value = '';
                switch (parameter){
                    case 'flashOfferId':
                    value = 'ESMADLYS151121060024112121552911211850';
                    break;
                    case 'ADT':
                        value = '1';
                        break;
                    case 'CHD':
                        value = '1';
                        break;
                    case 'INF':
                        value = '1';
                        break;
                    case 'BNN':
                        value = '1';
                        break;
                    case 'YTH':
                        value = '1';
                        break;
                    case 'residentCode':
                        value = 'RC';
                        break;
                    case 'familianumerosa':
                        value = 'F1';
                        break;
                }
                return value;
            })
            var respose = IbFlashOfferUtilsService.createRequestDirectFare();
            expect(respose.request.specialDiscounts).toEqual([{type:'RES',discountType:'CANARIAS'},{type:'LGF',discountType:'GENERAL'}]);
        });
        it('it is Balearic resident and it is special large family',  () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((parameter)=>{
                var value = '';
                switch (parameter){
                    case 'flashOfferId':
                    value = 'ESMADLYS151121060024112121552911211850';
                    break;
                    case 'ADT':
                        value = '1';
                        break;
                    case 'CHD':
                        value = '1';
                        break;
                    case 'INF':
                        value = '1';
                        break;
                    case 'BNN':
                        value = '1';
                        break;
                    case 'YTH':
                        value = '1';
                        break;
                    case 'residentCode':
                        value = 'BP';
                        break;
                    case 'familianumerosa':
                        value = 'F2';
                        break;
                }
                return value;
            })
            var respose = IbFlashOfferUtilsService.createRequestDirectFare();
            expect(respose.request.specialDiscounts).toEqual([{type:'RES',discountType:'BALEARES'},{type:'LGF',discountType:'SPECIAL'}]);
        });
        it('it is Melilla resident and it is special large family',  () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((parameter)=>{
                var value = '';
                switch (parameter){
                    case 'flashOfferId':
                    value = 'ESMADLYS151121060024112121552911211850';
                    break;
                    case 'ADT':
                        value = '1';
                        break;
                    case 'CHD':
                        value = '1';
                        break;
                    case 'INF':
                        value = '1';
                        break;
                    case 'BNN':
                        value = '1';
                        break;
                    case 'YTH':
                        value = '1';
                        break;
                    case 'residentCode':
                        value = 'RM';
                        break;
                    case 'familianumerosa':
                        value = 'F2';
                        break;
                }
                return value;
            })
            var respose = IbFlashOfferUtilsService.createRequestDirectFare();
            expect(respose.request.specialDiscounts).toEqual([{type:'RES',discountType:'MELILLA'},{type:'LGF',discountType:'SPECIAL'}]);
        });
        it('it is Ceuta resident and it is special large family',  () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((parameter)=>{
                var value = '';
                switch (parameter){
                    case 'flashOfferId':
                    value = 'ESMADLYS151121060024112121552911211850';
                    break;
                    case 'ADT':
                        value = '1';
                        break;
                    case 'CHD':
                        value = '1';
                        break;
                    case 'INF':
                        value = '1';
                        break;
                    case 'BNN':
                        value = '1';
                        break;
                    case 'YTH':
                        value = '1';
                        break;
                    case 'residentCode':
                        value = 'BC';
                        break;
                    case 'familianumerosa':
                        value = 'F2';
                        break;
                }
                return value;
            })
            var respose = IbFlashOfferUtilsService.createRequestDirectFare();
            expect(respose.request.specialDiscounts).toEqual([{type:'RES',discountType:'CEUTA'},{type:'LGF',discountType:'SPECIAL'}]);
        });
    })

    describe('When functions is called', function () {

        it('Test createNewHeaderData', function (done) {
            var respose = IbFlashOfferUtilsService.createNewHeaderData(mockOffer);
            expect(respose.dates.outboundFlight).toEqual(mockResponseNewHeaderData.dates.outboundFlight);
            expect(respose.dates.returnFlight).toEqual(mockResponseNewHeaderData.dates.returnFlight);
            expect(respose.originCity).toEqual(mockResponseNewHeaderData.originCity);
            expect(respose.destinationCity).toEqual(mockResponseNewHeaderData.destinationCity);
            done();
            rootScope.$digest();
        });

        it('Test createModelToHeader', function (done) {
            var respose = IbFlashOfferUtilsService.createModelToHeader(mockSlices);
            expect(respose.availabilityData.originDestinations[0].origin.code).toEqual(mockResponseCreateModeltoHeader.availabilityData.originDestinations[0].origin.code);
            expect(respose.selectedSlices).toEqual(mockResponseCreateModeltoHeader.selectedSlices);
            done();
            rootScope.$digest();
        });

        it('Test generateNewrequestDataDirectFare', function (done) {
            IbFlashOfferUtilsService.generateNewrequestDataDirectFare(mockPassenger, mockOriginDestination);
            done();
            rootScope.$digest();
        });

        it('Test createModelToSelectedTripInfo', () => {
            const mockSlices = [{
                segments:[{
                    departure:{
                        city:{
                            code:'MAD'
                        }
                    },
                    arrival: {
                        city:{
                            code:'BCN'
                        }
                    }
                }],
                price:{
                    total: 50
                }
            }];
            const mockFareFamilies = [{
                cabinDescription: 'E',
                commercialCode: 'Turista',
                cabinType: 'E',
                farePriceToCalculate: 5
            }];
            const mockResponse= [{ origin: 'MAD', destination: 'BCN', info: { segments: [{ departure:{ city:{ code: 'MAD' }}, arrival: { city:{ code: 'BCN' } } } ], slicePrice: 50, selectedFareFamily: { cabinDescription: 'E', commercialCode: 'Turista' }, cabins:{ E:{ fareFamilies: [{ cabinDescription: 'E', commercialCode: 'Turista', cabinType: 'E', farePriceToCalculate: 50 } ] } } }, cabin: 'E' } ]
            const response = IbFlashOfferUtilsService.createModelToSelectedTripInfo(mockSlices, mockFareFamilies);
            expect(response[0].origin).toEqual('MAD');
            expect(response[0].destination).toEqual('BCN');
            expect(response).toEqual(mockResponse);
        });
    })

});
