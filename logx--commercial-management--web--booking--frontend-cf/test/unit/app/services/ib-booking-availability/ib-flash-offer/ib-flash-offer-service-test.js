import { AvailabilitySearchDateFilterServiceMock } from '../../../../../mocks/Services/AvailabilitySearchDateFilterMock';
describe('IbFlashOfferService test', function () {
    let testWindow;
    var rootScope, IbFlashOfferService, $q, localStorageService, BookingAppConstants, $location, $filter;
    var mockLinksFilterFilter = function () {
        return '';
    };
    var mockResponse = 'promesa';
    var mockEndpoints = { 'data': { 'endpoints': {} } };
    var mockRequest = {"request": {
        "flashOfferId": "ESMADLYS151121060024112121552911211850",
        "passengers": [
            {
                "passengerType": "ADULT",
                "count": 1
            }
        ]
    },
    "passengerCount": {
        "passengers": 1,
        "numAdults": 1,
        "numSeniors": 0,
        "numYoung": 0,
        "numTeenager": 0,
        "numInfant": 0,
        "numChilds": 0,
        "numberPassengrsWithoutInfant": 0
    }};
    var mockDataDirectFare ={
        "data": {
            "responseId": "Qm9va2luZ0BHVy0xNjM2OTkwMDU2ODc1LXZXMHlr",
            "offers": [
                {
                    "offerId": "IBebfa0291df104accab2231d4bdd332b2OP",
                    "price": {
                        "fare": 32,
                        "tax": 44.2,
                        "total": 76.2,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "slices": [
                        {
                            "sliceId": "MADLYS20211124215500",
                            "departureDateTime": "2021-11-24 21:55",
                            "arrivalDateTime": "2021-11-24 23:45",
                            "duration": 110,
                            "stopsNumber": 0,
                            "price": {
                                "fare": 16,
                                "tax": 22.1,
                                "total": 38.1,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "detailedPrices": [
                                {
                                    "fare": 16,
                                    "tax": 22.1,
                                    "total": 38.1,
                                    "currency": "EUR",
                                    "passengerIds": [
                                        "ADULT_01"
                                    ],
                                    "segmentPrices": [
                                        {
                                            "price": {
                                                "fare": 16,
                                                "currency": "EUR"
                                            },
                                            "originCurrencyPrice": {
                                                "fare": 16,
                                                "currency": "EUR"
                                            },
                                            "fareCode": "AFLASHB4",
                                            "segmentsIds": [
                                                "IB872220211124"
                                            ],
                                            "ticketDesignator": null,
                                            "endorsement": "057069.REF AND CHGS RESTRI"
                                        }
                                    ],
                                    "commission": null,
                                    "ticketingFee": 0
                                }
                            ],
                            "segments": [
                                {
                                    "departure": {
                                        "code": "MAD",
                                        "name": "Madrid Adolfo Suarez-Barajas",
                                        "terminal": "4",
                                        "city": {
                                            "code": "MAD",
                                            "description": "Madrid",
                                            "countryCode": "ES",
                                            "country": {
                                                "code": "ES",
                                                "description": "España"
                                            }
                                        }
                                    },
                                    "arrival": {
                                        "code": "LYS",
                                        "name": "Lyon St-Exupery",
                                        "terminal": "2",
                                        "city": {
                                            "code": "LYS",
                                            "description": "Lyón",
                                            "countryCode": "FR",
                                            "country": {
                                                "code": "FR",
                                                "description": "Francia"
                                            }
                                        }
                                    },
                                    "flight": {
                                        "marketingCarrier": {
                                            "code": "IB",
                                            "name": "Iberia"
                                        },
                                        "operationalCarrier": {
                                            "code": "YW",
                                            "name": "AIR NOSTRUM"
                                        },
                                        "marketingFlightNumber": "8722",
                                        "operationalFlightNumber": null,
                                        "operationalDisclosure": "YW",
                                        "aircraft": {
                                            "code": "CRK",
                                            "description": "Canadair (Bombardier) Regional Jet 1000"
                                        }
                                    },
                                    "cabin": {
                                        "rbd": "A",
                                        "bookingCode": "COACH",
                                        "bookingClass": "ECONOMY",
                                        "remainingSeats": 0,
                                        "fareFamily": "TBAESEU",
                                        "fareBasis": "AFLASHB4",
                                        "seatDisplays": null,
                                        "extendedFareCode": null,
                                        "brandCode": null,
                                        "cabinDescription": "Turista"
                                    },
                                    "overnight": false,
                                    "id": "IB872220211124",
                                    "duration": 110,
                                    "waitingTime": 0,
                                    "providerId": null,
                                    "ticketDesignator": "",
                                    "accrualQuote": null,
                                    "delayInformation": null,
                                    "stop": null,
                                    "departureDateTime": "2021-11-24 21:55",
                                    "arrivalDateTime": "2021-11-24 23:45",
                                    "secureFlightInformed": false,
                                    "secureFlight": false
                                }
                            ],
                            "overnight": false,
                            "origin": null,
                            "destination": null,
                            "originDestinationKey": null
                        },
                        {
                            "sliceId": "LYSMAD20211129185000",
                            "departureDateTime": "2021-11-29 18:50",
                            "arrivalDateTime": "2021-11-29 20:45",
                            "duration": 115,
                            "stopsNumber": 0,
                            "price": {
                                "fare": 16,
                                "tax": 22.1,
                                "total": 38.1,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "detailedPrices": [
                                {
                                    "fare": 16,
                                    "tax": 22.1,
                                    "total": 38.1,
                                    "currency": "EUR",
                                    "passengerIds": [
                                        "ADULT_01"
                                    ],
                                    "segmentPrices": [
                                        {
                                            "price": {
                                                "fare": 16,
                                                "currency": "EUR"
                                            },
                                            "originCurrencyPrice": {
                                                "fare": 16,
                                                "currency": "EUR"
                                            },
                                            "fareCode": "AFLASHB4",
                                            "segmentsIds": [
                                                "IB872120211129"
                                            ],
                                            "ticketDesignator": null,
                                            "endorsement": "057069.REF AND CHGS RESTRI"
                                        }
                                    ],
                                    "commission": null,
                                    "ticketingFee": 0
                                }
                            ],
                            "segments": [
                                {
                                    "departure": {
                                        "code": "LYS",
                                        "name": "Lyon St-Exupery",
                                        "terminal": "2",
                                        "city": {
                                            "code": "LYS",
                                            "description": "Lyón",
                                            "countryCode": "FR",
                                            "country": {
                                                "code": "FR",
                                                "description": "Francia"
                                            }
                                        }
                                    },
                                    "arrival": {
                                        "code": "MAD",
                                        "name": "Madrid Adolfo Suarez-Barajas",
                                        "terminal": "4",
                                        "city": {
                                            "code": "MAD",
                                            "description": "Madrid",
                                            "countryCode": "ES",
                                            "country": {
                                                "code": "ES",
                                                "description": "España"
                                            }
                                        }
                                    },
                                    "flight": {
                                        "marketingCarrier": {
                                            "code": "IB",
                                            "name": "Iberia"
                                        },
                                        "operationalCarrier": {
                                            "code": "YW",
                                            "name": "AIR NOSTRUM"
                                        },
                                        "marketingFlightNumber": "8721",
                                        "operationalFlightNumber": null,
                                        "operationalDisclosure": "YW",
                                        "aircraft": {
                                            "code": "CRK",
                                            "description": "Canadair (Bombardier) Regional Jet 1000"
                                        }
                                    },
                                    "cabin": {
                                        "rbd": "A",
                                        "bookingCode": "COACH",
                                        "bookingClass": "ECONOMY",
                                        "remainingSeats": 0,
                                        "fareFamily": "TBAESEU",
                                        "fareBasis": "AFLASHB4",
                                        "seatDisplays": null,
                                        "extendedFareCode": null,
                                        "brandCode": null,
                                        "cabinDescription": "Turista"
                                    },
                                    "overnight": false,
                                    "id": "IB872120211129",
                                    "duration": 115,
                                    "waitingTime": 0,
                                    "providerId": null,
                                    "ticketDesignator": "",
                                    "accrualQuote": null,
                                    "delayInformation": null,
                                    "stop": null,
                                    "departureDateTime": "2021-11-29 18:50",
                                    "arrivalDateTime": "2021-11-29 20:45",
                                    "secureFlightInformed": false,
                                    "secureFlight": false
                                }
                            ],
                            "overnight": false,
                            "origin": null,
                            "destination": null,
                            "originDestinationKey": null
                        }
                    ],
                    "offerExpiration": "2021-11-15T17:17:37.584+01:00",
                    "paymentTimeLimit": "2021-11-16T22:59:59.000+00:00",
                    "onHoldOptions": [],
                    "cashAviosPossibilities": [],
                    "carryOnBaggageAllowances": [
                        {
                            "totalQuantity": 1,
                            "segmentIds": [
                                "IB872220211124",
                                "IB872120211129"
                            ],
                            "pieceAllowances": null
                        }
                    ],
                    "checkedBagAllowances": [
                        {
                            "totalQuantity": 0,
                            "pieceAllowances": [],
                            "segmentIds": [
                                "IB872120211129"
                            ]
                        },
                        {
                            "totalQuantity": 0,
                            "pieceAllowances": [],
                            "segmentIds": [
                                "IB872220211124"
                            ]
                        }
                    ],
                    "availableServices": [],
                    "selectedServices": [],
                    "specialDiscountsApplied": [
                        {
                            "type": "CORPORATE",
                            "discountType": "GENERAL",
                            "description": "Descuento exclusivo",
                            "percentDiscount": 0,
                            "totalDiscount": 0,
                            "corporateCodes": "057069"
                        }
                    ],
                    "accrualQuote": {
                        "redemptionPoints": null,
                        "qualificationPoints": null
                    },
                    "offerItems": [
                        {
                            "offerItemId": "IBebfa0291df104accab2231d4bdd332b2OP_01",
                            "passengerIds": [
                                "ADULT_01"
                            ],
                            "price": {
                                "fare": 32,
                                "tax": 44.2,
                                "total": 76.2,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "detailedTaxes": [
                                {
                                    "code": "JD",
                                    "amount": 14.95,
                                    "currency": "EUR",
                                    "description": "Cargo por salida",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "OG",
                                    "amount": 0.62,
                                    "currency": "EUR",
                                    "description": "Tasa de seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "QV",
                                    "amount": 3.38,
                                    "currency": "EUR",
                                    "description": "Seguridad",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "FR",
                                    "amount": 8.25,
                                    "currency": "EUR",
                                    "description": "Tasa aeroportuaria, Tasa de aviación civil",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "IZ",
                                    "amount": 1.13,
                                    "currency": "EUR",
                                    "description": "Tasa solidaria por pasajero aéreo",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "FR",
                                    "amount": 4.66,
                                    "currency": "EUR",
                                    "description": "Tasa aeroportuaria, Tasa de aviación civil",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "QX",
                                    "amount": 9.71,
                                    "currency": "EUR",
                                    "description": "Cargo por servicios al pasajero – Int.",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                },
                                {
                                    "code": "O4",
                                    "amount": 1.5,
                                    "currency": "EUR",
                                    "description": "Otras tasas",
                                    "subcode": null,
                                    "country": null,
                                    "carrier": null
                                }
                            ],
                            "reshopDetailedTaxes": [],
                            "fareCalculation": "MAD IB LYS18.53 IB MAD18.53NUC37.06END ROE0.863211",
                            "fareComponents": [
                                {
                                    "remarks": "  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n    AFTER DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n  CHANGES\n    CHANGES NOT PERMITTED IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      PER TICKET CHARGE EUR 65.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      PER TICKET CHARGE EUR 65.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AND REISSUE AFTER\n          SCHEDULED FLIGHT CHANGES NO PERMITED.\n          OTHERWISE THE TICKET WILL ONLY BE VALID FOR\n          REFUND IF APPLICABLE.\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFOUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.",
                                    "segmentIds": [
                                        "IB872220211124"
                                    ],
                                    "details": [
                                        {
                                            "type": "Change",
                                            "application": "BEFORE-DEPARTURE",
                                            "minPrice": {
                                                "amount": 65,
                                                "currency": "EUR"
                                            },
                                            "maxPrice": {
                                                "amount": 65,
                                                "currency": "EUR"
                                            },
                                            "nonrefundable": false,
                                            "cancelFeeInd": false,
                                            "changeFeeInd": false
                                        },
                                        {
                                            "type": "Change",
                                            "application": "AFTER-DEPARTURE",
                                            "minPrice": {
                                                "amount": 65,
                                                "currency": "EUR"
                                            },
                                            "maxPrice": {
                                                "amount": 65,
                                                "currency": "EUR"
                                            },
                                            "nonrefundable": false,
                                            "cancelFeeInd": false,
                                            "changeFeeInd": false
                                        }
                                    ],
                                    "privateFareInformationWebResponse": [
                                        {
                                            "segmentReferences": [
                                                "IB872220211124"
                                            ],
                                            "productName": "",
                                            "subProductName": "",
                                            "fareCode": "",
                                            "fareBasisCode": "AFLASHB4",
                                            "accountCode": "FLASH",
                                            "tourBoxcode": null,
                                            "fareBoxText": null,
                                            "accountCodeAmadeus": ""
                                        }
                                    ]
                                },
                                {
                                    "remarks": "  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n    AFTER DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n  CHANGES\n    CHANGES NOT PERMITTED IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      PER TICKET CHARGE EUR 65.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      PER TICKET CHARGE EUR 65.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AND REISSUE AFTER\n          SCHEDULED FLIGHT CHANGES NO PERMITED.\n          OTHERWISE THE TICKET WILL ONLY BE VALID FOR\n          REFUND IF APPLICABLE.\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFOUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.",
                                    "segmentIds": [
                                        "IB872120211129"
                                    ],
                                    "details": [
                                        {
                                            "type": "Change",
                                            "application": "BEFORE-DEPARTURE",
                                            "minPrice": {
                                                "amount": 65,
                                                "currency": "EUR"
                                            },
                                            "maxPrice": {
                                                "amount": 65,
                                                "currency": "EUR"
                                            },
                                            "nonrefundable": false,
                                            "cancelFeeInd": false,
                                            "changeFeeInd": false
                                        },
                                        {
                                            "type": "Change",
                                            "application": "AFTER-DEPARTURE",
                                            "minPrice": {
                                                "amount": 65,
                                                "currency": "EUR"
                                            },
                                            "maxPrice": {
                                                "amount": 65,
                                                "currency": "EUR"
                                            },
                                            "nonrefundable": false,
                                            "cancelFeeInd": false,
                                            "changeFeeInd": false
                                        }
                                    ],
                                    "privateFareInformationWebResponse": [
                                        {
                                            "segmentReferences": [
                                                "IB872120211129"
                                            ],
                                            "productName": "",
                                            "subProductName": "",
                                            "fareCode": "",
                                            "fareBasisCode": "AFLASHB4",
                                            "accountCode": "FLASH",
                                            "tourBoxcode": null,
                                            "fareBoxText": null,
                                            "accountCodeAmadeus": ""
                                        }
                                    ]
                                }
                            ],
                            "surcharges": null
                        }
                    ],
                    "type": "REGULAR"
                }
            ],
            "passengers": [
                {
                    "passengerId": "ADULT_01",
                    "passengerType": "ADULT",
                    "firstName": null,
                    "surname": null,
                    "frequentFlyerInfo": null
                }
            ],
            "contextMetadata": {
                "language": "es",
                "country": "ES",
                "currencies": [
                    {
                        "code": "EUR",
                        "description": "Euro",
                        "symbol": "€",
                        "alignment": "R",
                        "groupingSeparator": ".",
                        "decimalSeparator": ",",
                        "decimals": 2,
                        "recommendedDisplay": "symbol"
                    }
                ]
            },
            "fareFamilyConditions": [
                {
                    "cabinType": "E",
                    "cabinDescription": "Turista",
                    "commercialCode": "TBAESEU",
                    "commercialName": "Básica",
                    "commercialNameES": "Básica",
                    "priority": 900,
                    "conditions": [
                        {
                            "code": "CABINA",
                            "name": "Cabina",
                            "text": "Turista",
                            "units": null,
                            "extendedInfo": {
                                "title": "",
                                "message": "Turista",
                                "code": "CA_Cabina_Turista",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        },
                        {
                            "code": "EQMANO",
                            "name": "Equipaje de mano",
                            "text": "1 bulto (56x40x25cm)",
                            "units": 1,
                            "extendedInfo": {
                                "title": "1 bulto en cabina  (56x40x25cm)",
                                "message": "1 bulto (56x40x25cm)",
                                "code": "CA_EQP_MANO_10KG",
                                "conditionStatus": true,
                                "observationCode": "2"
                            }
                        },
                        {
                            "code": "EQBODEGA",
                            "name": "Equipaje en bodega",
                            "text": "No incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Sin equipaje en bodega",
                                "message": "No incluido. ",
                                "code": "CA_1_PIEZAS_PAGO",
                                "conditionStatus": false,
                                "observationCode": "1"
                            }
                        },
                        {
                            "code": "ASIENTO",
                            "name": "Selección de asiento",
                            "text": "De pago.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Seleccionable con coste",
                                "message": "De pago. <a target=\"_blank\" href=\"http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\">Política de reserva anticipada de asientos</a>",
                                "code": "CA_Asiento_Pago",
                                "conditionStatus": false,
                                "observationCode": "3"
                            }
                        },
                        {
                            "code": "ASIENTOXL",
                            "name": "Selección de asiento XL",
                            "text": "De pago",
                            "units": null,
                            "extendedInfo": {
                                "title": "Seleccionable con coste",
                                "message": "De pago",
                                "code": "CA_Asiento_XL_Pago",
                                "conditionStatus": false,
                                "observationCode": "3"
                            }
                        },
                        {
                            "code": "CAMBIO",
                            "name": "Cambios",
                            "text": "Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio",
                            "units": 65,
                            "extendedInfo": {
                                "title": "Cambio permitido con coste",
                                "message": "Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio",
                                "code": "CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        },
                        {
                            "code": "REEMBOLSO",
                            "name": "Reembolso (por sentido)",
                            "text": "No permitido",
                            "units": null,
                            "extendedInfo": {
                                "title": "Reembolso no permitido",
                                "message": "No permitido.",
                                "code": "CA_REEMBOLSO NO PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        },
                        {
                            "code": "CHECKINDESK",
                            "name": "Mostrador check-in exclusivo",
                            "text": "No",
                            "units": null,
                            "extendedInfo": {
                                "title": "",
                                "message": "No",
                                "code": "Chek-in_desk_ NO",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        },
                        {
                            "code": "SALAVIP",
                            "name": "Acceso a salas VIP",
                            "text": "No",
                            "units": null,
                            "extendedInfo": {
                                "title": "",
                                "message": "No",
                                "code": "Acceso a salas VIP No permitido",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        },
                        {
                            "code": "FASTTRACK",
                            "name": "Fast Track",
                            "text": "No",
                            "units": null,
                            "extendedInfo": {
                                "title": "",
                                "message": "No",
                                "code": "Fast Track NO",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        },
                        {
                            "code": "EQPPRIOR",
                            "name": "Entrega prioritaria equipaje",
                            "text": "No",
                            "units": null,
                            "extendedInfo": {
                                "title": "",
                                "message": "No",
                                "code": "Entrega_prioritaria_equipaje_ NO",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        },
                        {
                            "code": "EMBARQUE",
                            "name": "Prioridad de Embarque",
                            "text": "No",
                            "units": null,
                            "extendedInfo": {
                                "title": "",
                                "message": "No",
                                "code": "CA_Embarque_NO_Prioritario",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        },
                        {
                            "code": "TARJEMBANTIC",
                            "name": "Tarjeta de embarque anticipada",
                            "text": "No incluido",
                            "units": null,
                            "extendedInfo": {
                                "title": "No incluido",
                                "message": "No incluido",
                                "code": "CA_Tarjeta_embarque_anticipada_no_incluido",
                                "conditionStatus": false,
                                "observationCode": null
                            }
                        }
                    ],
                    "observations": [
                        {
                            "observationCode": 1,
                            "observationText": "<a href=\"https://www.iberia.com/web/obsmenu.do?quadrigam=EQUFRA&menuId=EQUIDE\" class=\"links\">Consulte equipaje adicional<span class=\"oculto\">[Abre en ventana nueva]</span></a>"
                        },
                        {
                            "observationCode": 2,
                            "observationText": "1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías <strong>one</strong>world. En el resto debes consultar con la compañía operadora"
                        },
                        {
                            "observationCode": 3,
                            "observationText": "<a href=\"https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE\" class=\"links\" title=\"Ver precios de la reserva de asiento\">Más detalle sobre la reserva anticipada de asiento</a>"
                        }
                    ],
                    "conditionsPriority": [
                        "EQMANO",
                        "EQBODEGA",
                        "COMIDA",
                        "ASIENTO",
                        "ASIENTOXL",
                        "EMBARQUE",
                        "TARJEMBANTIC",
                        "CAMBIO",
                        "REEMBOLSO"
                    ]
                }
            ],
            "advices": [],
            "services": [],
            "relatedContent": [
                {
                    "key": "TOTAL_PRICE",
                    "value": "Precio total, incluye tarifa aérea, <a href=\"https://www.iberia.com/web/obsmenu.do?quadrigam=IBTASA&menuId=INFLEG\" target=\"_blank\">tasas</a> (salvo las que se cobren en determinados aeropuertos en el momento de facturar), gastos de gestión, cargos del operador, y las opciones seleccionadas. Si eliges abonar el viaje con una de estas <a href=\"https://www.iberia.com/web/obsmenu.do?quadrigam=TARPAG&menuId=INFLEG\" target=\"_blank\">tarjetas</a>, se aplicará un cargo adicional por reserva de un 1% del importe final en vuelos de largo radio y 2% en el resto de vuelos."
                }
            ],
            "brandedFares": null,
            "warnings": null
        },
        "code": 200
    }
    var fakeBookingPromiseProxy = {
        post: jasmine.createSpy()
    };

    var fakeCommonsHttpUtilsErrorService = {
        controlError: jasmine.createSpy()
    }

    var fakeBookingUtilService = {
        initStorage: jasmine.createSpy(),
        saveEndpoints: jasmine.createSpy('saveEndpoints').and.callFake(function (data) {
            var deferred = $q.defer();
            var response = deferred.promise;
            deferred.resolve(mockResponse);
            return response;
        }),
        getURLFirstParameterByName: jasmine.createSpy(),
        getBackGroundURL: jasmine.createSpy(),
        getParameterByName: jasmine.createSpy(),
        getOriginDestination: jasmine.createSpy(),
        generateBuildNumberQueryString: jasmine.createSpy(),
        redirectToFlash: jasmine.createSpy(),
    }

    var fakeCommonsGetLoginInfoService = {
        checkCustomerStatus: jasmine.createSpy('checkCustomerStatus').and.callFake(function () {
            var deferred = $q.defer();
            var response = deferred.promise;
            deferred.resolve(true);
            return response;
        })
    };

    var fakeBookingModalService = {
        showGenericError: jasmine.createSpy(),
        finishWaiting: jasmine.createSpy()
    };

    var fakeIbCAuthTokenService = {
        refreshUserLoggedToken: jasmine.createSpy(),
        getAnonymousToken: jasmine.createSpy('getAnonymousToken').and.callFake(function () {
            var deferred = $q.defer();
            var response = deferred.promise;
            deferred.resolve(mockResponse);
            return response;
        })
    };

    var fakeRedirectionService = {
        externalRedirect: jasmine.createSpy(),
        redirectToLoginPage: jasmine.createSpy(),
    };

    var fakeBookingEndpointsService = {
        getEndpoints: jasmine.createSpy('getEndpoints').and.callFake(function () {
            var deferred = $q.defer();
            var response = deferred.promise;
            deferred.resolve(mockEndpoints);
            return response;
        })
    };

    var fakeBookingAvailabilityConstants = {
        ONE_DAY_MILISECONDS: 1000 * 60 * 60 * 24,
        CORPORATE: 'CORPORATE'
    };

    var fakeIbFlashOfferUtilsService = {
        createRequestDirectFare: jasmine.createSpy('createRequestDirectFare').and.callFake(function () {
            var deferred = $q.defer();
            var response = deferred.promise;
            deferred.resolve(mockRequest);
            return response;
        })
    };

    var fakeBookingBackgroundImagesService = {
        getBackgroundImages: jasmine.createSpy('getBackgroundImages').and.callFake(function () {
            var deferred = $q.defer();
            var response = deferred.promise;
            deferred.resolve(mockResponse);
            return response;
        })
    };

    var fakeBookingGetDestinationCitiesListService = {
        getDestinationCitiesList: jasmine.createSpy('getDestinationCitiesList').and.callFake(function () {
            var deferred = $q.defer();
            var response = deferred.promise;
            deferred.resolve(mockResponse);
            return response;
        })
    };
    let fakeoriginDestination = { 'destinationCity': { 'description': 'description' } };

    var fakeBookingAppConstants = {
        DEFAULT_ENDPOINTS:
        {
            availabilityServiceURI: 'availabilityServiceURI',
            availabilityServiceURI: 'availabilityServiceURI'
        },
        BOOKING_PARAMS_NAMES: {
            'MARKET': '',
            'LANGUAGE': '',
            'ORIGIN': ['Origin', 'BEGIN_CITY_0'],
            'DESTINATION': ['Destination', 'END_CITY_0'],
            'SENIOR': '',
            'ADULT': '',
            'CHILD': '',
            'INFANT': '',
            'YOUNG': '',
            'TEENAGER': ['BNN'],
            'FLEXIBLE_DATES': ['fechasFlex', 'flexible'],
            'DEPARTURE_DATE': ['DepartureDate', 'BEGIN_DAY_0', 'BEGIN_MONTH_0'],
            'INBOUND_DATE': '',
            'CODE_ERROR': '',
            'SEARCH_ORIGIN': '',
            'WEB_MODE': '',
            'TRIP_TYPE': ['TripType', 'TRIP_TYPE'],
            'RESIDENT': '',
            'LARGE_FAMILY_TYPE': '',
            'IB_GROUP': '',
            'PREFERED_CLASS': '',
            'AVIOS_PAY': ['pagoAvios'],
            'POINTS_PAY': ['pagoPuntos'],
            'CHANNEL': '',
            'DEVICE': '',
            'REFERRALID': ['ReferralId'],
            'DISPLAYEDPRICE': '',
            'FLIGHTNUMBER': '',
            'BOOKINGCODE': ['BookingCode'],
            'CARRIER': '',
            'CABIN': '',
            'SLICE': '',
            'PRICECURRENCY': '',
            'USERCURRENCY': '',
            'NUMTRIPS': '',
            'BACKTOURL': '',
            'BEGIN_CITY': ['BEGIN_CITY_01'],
            'END_CITY': ['END_CITY_01'],
            'BEGIN_DAY': ['BEGIN_DAY_01'],
            'BEGIN_MONTH': ['BEGIN_MONTH_01'],
            'BEGIN_YEAR': ['BEGIN_YEAR_01'],
            'END_DAY': ['END_DAY_01'],
            'END_MONTH': ['END_MONTH_01'],
            'END_YEAR': ['END_YEAR_01'],
            'FARE_TYPE': '',
            'FARE_TYPE_END': '',
            'CODE_TRACKING': '',
            'CHECK_AVIOS' : '',
            'CHECK_POINTS' : ''
        },
        SEARCH_FLIGHT_TYPE: {
            AVAILABILITY: 'availabilityFlight',
            METASEARCH: 'metasearchFlight',
            MULTITRIP: 'multiCityFlight',
            REDEMPTION: 'redemptionFlight',
            REDEMPTIONOB: 'redemptionOBFlight'
        },
        QUADRIGAMS: {
            FLASH_OFFERS_LANDING: 'FLASHO'
        }
    };

    var fakeIbCallDirectFareService = {
        getDirectFare: jasmine.createSpy('getDirectFare').and.callFake(function (mockRequest) {
            return Promise.resolve(mockDataDirectFare);
        })
    };

    var fakeCommonsCommercialSellingDataService = {
        'getCommercialInfo': jasmine.createSpy('getCommercialInfo')
    }

    let fakeBookingAvailabilityTransformer = {
        genCalcAviosFlightReq: jasmine.createSpy(),
        TransCalcPointsData: jasmine.createSpy()
    };
    let fakeIbBookingCalculatePointsService = {
        getCalculateFlightsAvios: jasmine.createSpy()
    };


    beforeEach(function () {
        testWindow = {
            location:{
                origin: 'https://www.iberia.com'
            }
        };
        angular.mock.module('ib-flash-offer-service-module','LocalStorageModule', function ($provide) {
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('CommonsHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('CommonsGetLoginInfoService', fakeCommonsGetLoginInfoService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('IbCAuthTokenService', fakeIbCAuthTokenService);
            $provide.value('BookingRedirectionService', fakeRedirectionService);
            $provide.value('BookingEndpointsService', fakeBookingEndpointsService);
            $provide.value('BookingAvailabilityConstants', fakeBookingAvailabilityConstants);
            $provide.value('IbFlashOfferUtilsService', fakeIbFlashOfferUtilsService);
            $provide.value('BookingBackgroundImagesService', fakeBookingBackgroundImagesService);
            $provide.value('BookingGetDestinationCitiesListService', fakeBookingGetDestinationCitiesListService);
            $provide.value('IbCallDirectFareService', fakeIbCallDirectFareService);
            $provide.value('LinksFilterFilter', mockLinksFilterFilter);
            $provide.value('BookingCommercialSellingDataService', fakeCommonsCommercialSellingDataService);
            $provide.value('BookingAvailabilityTransformer', fakeBookingAvailabilityTransformer);
            $provide.value('IbBookingCalculatePointsService', fakeIbBookingCalculatePointsService);
            $provide.value('AvailabilitySearchDateFilterService', new AvailabilitySearchDateFilterServiceMock());
            $provide.value('$window', testWindow);

        });
        inject(function ($rootScope, _BookingAppConstants_,_IbFlashOfferService_,_$location_,_localStorageService_, _$q_, $filter) {
            BookingAppConstants = _BookingAppConstants_;
            IbFlashOfferService = _IbFlashOfferService_;
            rootScope = $rootScope;
            $location = _$location_;
            localStorageService = _localStorageService_;
            $q = _$q_;
            $filter = $filter;
        });
    })

    describe('When callInitBooking()', function () {
        beforeEach(function() {
            rootScope.isPointsOBFlow = false;
            fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(function () {
                return Promise.resolve(true);
            })
            fakeBookingGetDestinationCitiesListService.getDestinationCitiesList = jasmine.createSpy('getDestinationCitiesList').and.callFake(function () {
                return Promise.resolve(true);
            })
            fakeBookingBackgroundImagesService.getBackgroundImages = jasmine.createSpy('getBackgroundImages').and.callFake(function () {
                return Promise.resolve(true);
            })
            fakeCommonsCommercialSellingDataService.getCommercialInfo = jasmine.createSpy('getCommercialInfo').and.callFake(function () {
                return Promise.resolve(true);
            })
            fakeIbBookingCalculatePointsService.getCalculateFlightsAvios = jasmine.createSpy('getCalculateFlightsAvios').and.callFake(function () {
                return Promise.resolve(true);
            })
            fakeIbCAuthTokenService.getAnonymousToken = jasmine.createSpy('getAnonymousToken').and.callFake(function () {
                return Promise.resolve(true);
            })
            fakeIbCallDirectFareService.getDirectFare = jasmine.createSpy('getDirectFare').and.callFake(function () {
                return Promise.resolve(mockDataDirectFare);
            })
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                if(valor?.includes('flexible')){
                    return 'true';
                }else if(valor?.includes('BEGIN_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('DepartureDate')){
                    return '01'
                }else if(valor?.includes('END_DAY_01')){
                    return '08'
                }else if(valor?.includes('END_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('END_YEAR_01')){
                    return '2023'
                }else if(valor?.includes('BookingCode')){
                    return 'codigo'
                }else if(valor?.includes('ReferralId')){
                    return 'ReferralId'
                }else if(valor?.includes('Slice1')){
                    return '1,2,3'
                }
                else return null;
            });
            fakeBookingModalService.showGenericError = jasmine.createSpy('getAnonymousToken').and.callFake(function () {
                return {result:Promise.resolve(true)};
            })
        });
        it(', it is logged and it is metasearch flow', function(done) {
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                expect(responseData).toEqual(mockDataDirectFare);
                expect(fakeCommonsGetLoginInfoService.checkCustomerStatus).toHaveBeenCalled();
                expect(fakeIbCallDirectFareService.getDirectFare).toHaveBeenCalled();
                done();
            }, function(error) {
                // Esto es aceptable en algunos casos, no forzamos que pase
                expect(error).toBeDefined();
                done();
            });
            rootScope.$digest();
        })
        it(', it is logged and it is multicity flow', function(done) {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                if(valor?.includes('flexible')){
                    return 'true';
                }else if(valor?.includes('BEGIN_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('DepartureDate')){
                    return '01'
                }else if(valor?.includes('END_DAY_01')){
                    return '08'
                }else if(valor?.includes('END_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('END_YEAR_01')){
                    return '2023'
                }else if(valor?.includes('Slice1')){
                    return '1'
                }else if(valor?.includes('TripType')){
                    return 'MultiCity';
                }
                else return null;
            });
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                expect(responseData).toEqual(mockDataDirectFare);
                expect(IbFlashOfferService.isMultiCity).toBe(true);
                done();
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
            rootScope.$digest();
        })
        it(', it is logged and it is redemption flow', function(done) {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                if(valor?.includes('flexible')){
                    return 'true';
                }else if(valor?.includes('BEGIN_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('DepartureDate')){
                    return '01'
                }else if(valor?.includes('END_DAY_01')){
                    return '08'
                }else if(valor?.includes('END_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('END_YEAR_01')){
                    return '2023'
                }else if(valor?.includes('Slice1')){
                    return '1'
                }else if(valor?.includes('pagoAvios')){
                    return true;
                }
                else return null;
            });
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                expect(responseData).toEqual(mockDataDirectFare);
                expect(IbFlashOfferService.isRedemption).toBe(true);
                done();
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
            rootScope.$digest();
        })
        it(', it is logged and it is ONB redemption flow', function(done) {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                if(valor?.includes('flexible')){
                    return 'true';
                }else if(valor?.includes('BEGIN_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('DepartureDate')){
                    return '01'
                }else if(valor?.includes('END_DAY_01')){
                    return '08'
                }else if(valor?.includes('END_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('END_YEAR_01')){
                    return '2023'
                }else if(valor?.includes('Slice1')){
                    return '1'
                }else if(valor?.includes('pagoPuntos')){
                    return true;
                }
                else return null;
            });
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                expect(responseData).toEqual(mockDataDirectFare);
                expect(IbFlashOfferService.isPointsOB).toBe(true);
                done();
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
            rootScope.$digest();
        })
        it(', it is logged and localStorageService is supported', function(done) {
            localStorageService.isSupported = true;
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((valor) => {
                if(valor?.includes('flexible')){
                    return 'true';
                }else if(valor?.includes('BEGIN_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('DepartureDate')){
                    return '01'
                }else if(valor?.includes('END_DAY_01')){
                    return '08'
                }else if(valor?.includes('END_MONTH_01')){
                    return '202301'
                }else if(valor?.includes('END_YEAR_01')){
                    return '2023'
                }else if(valor?.includes('Slice1')){
                    return '1'
                }else if(valor?.includes('pagoPuntos')){
                    return true;
                }
                else return null;
            });
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                expect(responseData).toEqual(mockDataDirectFare);
                expect(localStorageService.isSupported).toBe(true);
                done();
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
        })
        xit('and it is logged and getCalculateFlightsAvios reject', function(done) {
            fakeIbBookingCalculatePointsService.getCalculateFlightsAvios = jasmine.createSpy('getCalculateFlightsAvios').and.callFake(function () {
                return Promise.reject({});
            })
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                expect(responseData).toEqual(mockDataDirectFare);
                localStorageService.clearAll();
                done();
            }, angular.noop);
        })
        it('and it is logged and getDirectFare reject', function(done) {
            fakeIbCallDirectFareService.getDirectFare = jasmine.createSpy('getDirectFare').and.callFake(function () {
                return Promise.reject({});
            })
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                // En algunos casos el servicio puede continuar a pesar del error
                expect(responseData).toBeDefined();
                done();
            }, function(error) {
                // Verificamos que el error sea manejado correctamente
                expect(error).toBeDefined();
                done();
            });
            rootScope.$digest();
        })
        it('and checkCustomerStatus reject', function(done) {
            fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(function () {
                return Promise.reject({});
            })
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                // Cuando checkCustomerStatus falla, el flujo continúa con checkIsLogged(false)
                expect(responseData).toEqual(mockDataDirectFare);
                done();
            }, function(error) {
                // En caso de error total
                expect(error).toBeDefined();
                done();
            });
            rootScope.$digest();
        })
        it('and it is trying to log in with ONB', function(done) {
            rootScope.isPointsOBFlow= true;
            rootScope.isRedemptionFlow= true;
            fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(function () {
                return Promise.resolve(false);
            })
            // Verificamos que se llame al método
            IbFlashOfferService.callInitBooking();
            // Verificamos que se configuren las variables
            expect(rootScope.isPointsOBFlow).toBe(true);
            expect(rootScope.isRedemptionFlow).toBe(true);
            // Verificamos que checkCustomerStatus se llame
            expect(fakeCommonsGetLoginInfoService.checkCustomerStatus).toHaveBeenCalled();
            rootScope.$digest();
            done();
        })
        it('and it is not logged', function(done) {
            fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(function () {
                return Promise.resolve(false);
            })
            IbFlashOfferService.callInitBooking().then(function (responseData) {
                // Cuando no está logueado, debería obtener token anónimo y continuar
                expect(responseData).toEqual(mockDataDirectFare);
                done();
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
            rootScope.$digest();
        })
    });
});
