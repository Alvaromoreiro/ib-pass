export const mock = {
    dep: {
        fakeModalServiceAncillaries: {
            isWaiting: jasmine.createSpy('isWaiting').and.callFake(function () { }),
            isNotWaiting: jasmine.createSpy('isNotWaiting').and.callFake(function () { }),
            openAviosAccumulatedModal: jasmine.createSpy('openAviosAccumulatedModal').and.callFake(function () { }),
            setErrorMessage: jasmine.createSpy('setErrorMessage').and.callFake(function () { }),
            setErrorCode: jasmine.createSpy('setErrorCode').and.callFake(function () { }),
            isError: jasmine.createSpy('isError').and.callFake(function () { }),
            openAncillariesErrorModal: jasmine.createSpy('openAncillariesErrorModal').and.callFake(function () { }),
            showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(function () { }),
            showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => { return { result: Promise.resolve() } }),
        },
        fakeDatalayerUtilsService: {
            setAncillariesAction: jasmine.createSpy('setAncillariesAction').and.callFake(function () { }),
            setAncillariesDatalayer: jasmine.createSpy('setAncillariesDatalayer').and.callFake(function () { }),

        },
        fakeAncillariesConstants :{
            APPLICATION_FLOW: {
                MMB: 'MMB',
                CHECKIN: 'CKI',
                BOOKING: 'BKI',
                BBOOKING: 'BBKI'
            },
            TYPE_ANCILLARIE: {
                INSURANCE: 'INSURANCE',
            },
             PAGES_ROUTES: {
                PAYMENTS: '/ibpurc',
            }
        },
        fakeCheckinAncillariesConstants: {
            PAGES_ROUTES: {
                SEARCH_BOOKING: '/ibcose',
                SEARCH_LOGGED_BOOKING: '/ibcose2',
            },
            SeatTypes: {
                seat: 'SEAT',
                gap: 'GAP'
            },
            TYPE_ANCILLARIE: {
                SEAT: 'SEAT',
                SPECIAL_MEALS: 'SPECIAL_MEALS',
            },
            FLIGHT_PASSENGERS_STATUS_LIST: {
                NOT_AVAILABLE: ['UNCHECKABLE'],
            },
        },
        fakeAncillariesUtilsTransformer: {
            getBookingSegmentInformation: jasmine.createSpy('getBookingSegmentInformation').and.callFake(function () {}),
            generateAncillariesHeaderInfo: jasmine.createSpy('generateAncillariesHeaderInfo').and.callFake(function () {})
        },
        fakeIbCAuthTokenService: {
            refreshUserLoggedToken: jasmine.createSpy("refreshUserLoggedTokenSpy"),
            getAnonymousToken: jasmine.createSpy("getAnonymousTokenSpy")
        },
        fakeAncillariesCallPaymentsService: {
            getPayments: jasmine.createSpy('getPayments').and.callFake(function () {})
        },
        fakeAncillariesTransformer: {
            buildAncillariesRequest: jasmine.createSpy('buildAncillariesRequest').and.callFake(function () { return []}),
            generateInfoCommon: jasmine.createSpy('generateInfoCommon').and.callFake(function () { }),
            passengerTransformData: jasmine.createSpy('passengerTransformData').and.callFake(function () { }),
            countSeatsTotal: jasmine.createSpy('countSeatsTotal').and.callFake(function () { }),
            transformAncillariesView:  jasmine.createSpy('transformAncillariesView').and.callFake(function () { }),
            genStructureForAncillaries:  jasmine.createSpy('genStructureForAncillaries').and.callFake(function () { }),
            genAviosPriorityReq:  jasmine.createSpy('genAviosPriorityReq').and.callFake(function () { }),
            genReqAviosAncillariesBaggages:  jasmine.createSpy('genReqAviosAncillariesBaggages').and.callFake(function () { }),
            genAviosSpeqReq:  jasmine.createSpy('genAviosSpeqReq').and.callFake(function () { }),
            'genAviosAncillariesSummaryReq':  jasmine.createSpy('genAviosAncillariesSummaryReq').and.callFake(function () { }),
            genAviosFlexOnDemandReq:  jasmine.createSpy('genAviosFlexOnDemandReq').and.callFake(function () { }),
            genCalAviosFligthReq:  jasmine.createSpy('genCalAviosFligthReq').and.callFake(function () { }),
            transformFromLocalStorage:  jasmine.createSpy('transformFromLocalStorage').and.callFake(function () { }),
            genAviosAncillariesReq: jasmine.createSpy('genAviosAncillariesReq').and.callFake(function () { }),
            transformDeleteResponse: jasmine.createSpy('transformDeleteResponse').and.callFake(function () { }),
            upgradeBidsAviosUpdate: jasmine.createSpy('upgradeBidsAviosUpdate').and.callFake(function () { }),
        },
        fakeAncillariesUtilsService: {
            isCheckinFlow: jasmine.createSpy('isCheckinFlow').and.callFake(function () {}),
        },
        fakeAncillariesSummaryService: {
            getAncillarieSummary: jasmine.createSpy('getAncillarieSummary').and.callFake(function () {}),
        },
        fakeCurrencyService: {
            getCurrencyObject: jasmine.createSpy('getCurrencyObject').and.callFake(function () {}),
        },
        fakeCommonsModalService: {
            finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(function () {}),
            showGenericError: jasmine.createSpy('showGenericError').and.callFake(function () {}),
            closeAllCurrentModals: jasmine.createSpy('closeAllCurrentModals').and.callFake(function () {}),
        },
        fakeAncGetCachedInformationService: {
            getCachedInformation: jasmine.createSpy('getCachedInformation').and.callFake(() => {}),
        },
        fakeCommonsAncillariesService: {
            deleteAncillarie: jasmine.createSpy('deleteAncillarie'),
            showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {}),
            getAncillarieSummary: jasmine.createSpy('getAncillarieSummary').and.callFake(() => {}),
            updateAncillaries: jasmine.createSpy('updateAncillaries').and.callFake(() => {}),
            deleteAllAncillaries: jasmine.createSpy('deleteAllAncillaries').and.callFake(() => {}),
        },
        fakeIbCPermanentUserService: {
            checkPermanentUserFlow: jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {}),
            isAfterLoginPermanentUser: jasmine.createSpy('isAfterLoginPermanentUser').and.callFake(() => {}),
            removeParamsAfterLogin: jasmine.createSpy('removeParamsAfterLogin').and.callFake(() => {}),
        },
        fakeCommonsGetLoginInfoService: {
            checkCustomerStatus: jasmine.createSpy('checkCustomerStatus').and.callFake(() => {}),
        },
        fakeCommonsLoginUtilsService: {
            updateStateToAnonymous: jasmine.createSpy('updateStateToAnonymous').and.callFake(() => {}),
        },
        fakeNewMainHeaderFacade: {
            updateHeaderModel: jasmine.createSpy('updateHeaderModel').and.callFake(() => {}),
        },
        fakeDatalayerMenusService: {
            updateDataLayer: jasmine.createSpy('updateDataLayer').and.callFake(() => {}),
        },
        fakeCallBundleService: {
            putBundle: jasmine.createSpy('putBundle').and.callFake(() => { return { result: Promise.resolve() } }),
        }
    },
    localStorage: {
        headerModel: {
            "headerModel": {
                "flightType": "availabilityFlight",
                "redemption": false,
                "trips": [
                    {
                        "originCode": "MAD",
                        "originCity": "Madrid",
                        "destinyCode": "BIO",
                        "destinyCity": "Bilbao",
                        "dateFlight": "19/04/2023",
                        "returnFlight": "23/04/2023",
                        "passengers": 1,
                        "tripType": "2"
                    }
                ],
                "passengers": {
                    "numberPassengers": 1,
                    "numAdults": 1,
                    "numSeniors": 0,
                    "numYouth": 0,
                    "numTeenager": 0,
                    "numChilds": 0,
                    "numInfants": 0
                },
                "shoppingBasket": {
                    "baggages": {
                        "segments": [
                            {
                                "segmentId": "MADBIO20230419062000",
                                "baggages": [
                                    {
                                        "type": "BAGGAGE_15",
                                        "quanty": 1,
                                        "description": "15kg",
                                        "passengers": [
                                            "ADULT_01"
                                        ],
                                        "total": 13,
                                        "totalFormatted": "13.00€"
                                    }
                                ],
                                "total": 13,
                                "origin": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "country": {
                                        "code": "ES",
                                        "description": "Spain"
                                    }
                                },
                                "destination": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "country": {
                                        "code": "ES",
                                        "description": "Spain"
                                    }
                                }
                            }
                        ],
                        "hasBaggage": true,
                        "total": {
                            "total": 13,
                            "totalFormatted": "13.00€"
                        }
                    },
                    "seats": {
                        "segments": [
                            {
                                "segmentId": "IB043220230419",
                                "isEarly": false,
                                "seats": [
                                    {
                                        "type": "",
                                        "description": "",
                                        "quanty": 1,
                                        "passengers": [
                                            {
                                                "id": "ADULT_01",
                                                "amount": 5,
                                                "amountFormatted": "5.00€"
                                            }
                                        ],
                                        "amount": 5,
                                        "totalFormatted": "5.00€",
                                        "freePassenger": [],
                                        "totalAmountFreePassenger": "0€",
                                        "paymentPassenger": [
                                            {
                                                "id": "ADULT_01",
                                                "amount": 5,
                                                "amountFormatted": "5.00€"
                                            }
                                        ],
                                        "totalAmountPaymentPassenger": "5.00€"
                                    }
                                ],
                                "origin": {
                                    "description": "Madrid",
                                    "code": "MAD"
                                },
                                "destination": {
                                    "description": "Bilbao",
                                    "code": "BIO"
                                },
                                "quanty": 1,
                                "total": 5,
                                "totalFormatted": "5.00€"
                            },
                            {
                                "segmentId": "IB042320230423",
                                "isEarly": false,
                                "seats": [
                                    {
                                        "type": "",
                                        "description": "",
                                        "quanty": 1,
                                        "passengers": [
                                            {
                                                "id": "ADULT_01",
                                                "amount": 7,
                                                "amountFormatted": "7.00€"
                                            }
                                        ],
                                        "amount": 7,
                                        "totalFormatted": "7.00€",
                                        "freePassenger": [],
                                        "totalAmountFreePassenger": "0€",
                                        "paymentPassenger": [
                                            {
                                                "id": "ADULT_01",
                                                "amount": 7,
                                                "amountFormatted": "7.00€"
                                            }
                                        ],
                                        "totalAmountPaymentPassenger": "7.00€"
                                    }
                                ],
                                "origin": {
                                    "description": "Bilbao",
                                    "code": "BIO"
                                },
                                "destination": {
                                    "description": "Madrid",
                                    "code": "MAD"
                                },
                                "quanty": 1,
                                "total": 7,
                                "totalFormatted": "7.00€"
                            }
                        ],
                        "hasSeats": true,
                        "total": {
                            "total": 12,
                            "totalFormatted": "12.00€"
                        }
                    },
                    "insurance": {
                        "info": null,
                        "hasInsurance": false
                    },
                    "flexibilization": {
                        "info": {
                            "type": "ancillarie",
                            "title": "ANCILLARIES_FLEXIBILITY_TITLE",
                            "category": "flexibility",
                            "currency": {
                                "suffixSymbol": true,
                                "decimalSeparator": ".",
                                "numberDecimals": 2,
                                "groupingSeparator": ",",
                                "currencySymbol": "€",
                                "description": "Euro"
                            },
                            "amount": {
                                "title": "ANCILLARIES_FLEXIBILITY_BASKET_AMOUNT",
                                "price": 51,
                                "priceFormatted": "51.00€"
                            },
                            "items": [
                                {
                                    "concepts": [
                                        {
                                            "quantity": 1,
                                            "description": "Flexibility Pack",
                                            "price": 51,
                                            "priceFormatted": "51.00€"
                                        }
                                    ]
                                }
                            ],
                            "delete": [
                                {
                                    "type": "FLEXIBILITY_ON_DEMAND"
                                }
                            ]
                        },
                        "hasFlexibilization": true
                    },
                    "upgrading": {
                        "segments": [],
                        "hasUpgrading": false
                    },
                    "speqs": {
                        "segments": [
                            {
                                "segmentId": "MADBIO20230419062000",
                                "speqs": [
                                    {
                                        "type": "BICYCLE",
                                        "quanty": 1,
                                        "description": "Bicycles",
                                        "passengers": [
                                            "ADULT_01"
                                        ],
                                        "total": 40,
                                        "totalFormatted": "40.00€"
                                    },
                                    {
                                        "type": "SKI_SNOW",
                                        "quanty": 1,
                                        "description": "Skis/Snowboard",
                                        "passengers": [
                                            "ADULT_01"
                                        ],
                                        "total": 35,
                                        "totalFormatted": "35.00€"
                                    }
                                ],
                                "total": 75,
                                "origin": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "country": {
                                        "code": "ES",
                                        "description": "Spain"
                                    }
                                },
                                "destination": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "country": {
                                        "code": "ES",
                                        "description": "Spain"
                                    }
                                }
                            }
                        ],
                        "hasSpeqs": true,
                        "total": {
                            "total": 75,
                            "totalFormatted": "75.00€"
                        }
                    },
                    "priorityBoarding": {
                        "info": {
                            "type": "ancillarie",
                            "title": "Prioridad de embarque",
                            "category": "priority",
                            "currency": {
                                "suffixSymbol": true,
                                "decimalSeparator": ".",
                                "numberDecimals": 2,
                                "groupingSeparator": ",",
                                "currencySymbol": "€",
                                "description": "Euro"
                            },
                            "amount": 6,
                            "items": [],
                            "delete": [
                                {
                                    "type": "PRIORITY_BOARDING"
                                }
                            ],
                            "trips": [
                                {
                                    "id": "IB043220230419",
                                    "arrival": {
                                        "code": "BIO",
                                        "description": "Bilbao",
                                        "countryCode": "ES",
                                        "country": {
                                            "code": "ES",
                                            "description": "Spain"
                                        }
                                    },
                                    "departure": {
                                        "code": "MAD",
                                        "description": "Madrid",
                                        "countryCode": "ES",
                                        "country": {
                                            "code": "ES",
                                            "description": "Spain"
                                        }
                                    },
                                    "amount": 6,
                                    "priceFormatted": "6.00€",
                                    "quantity": 1
                                }
                            ],
                            "priceFormatted": "6.00€"
                        },
                        "hasPriorityBoarding": true
                    },
                    "carbonFootprint": {
                        "info": null,
                        "hasCarbonFootprint": false
                    },
                    "discountsModel": {
                        "hasDiscounts": false,
                        "total": 0,
                        "discounts": {},
                        "totalFormated": "0€"
                    },
                    "othersModel": {
                        "hasElements": false,
                        "others": [],
                        "total": {
                            "total": 0,
                            "totalFormatted": ""
                        }
                    },
                    "segmentsInfo": [
                        {
                            "id": "IB043220230419",
                            "origin": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "destination": {
                                "description": "Bilbao",
                                "code": "BIO"
                            }
                        },
                        {
                            "id": "IB042320230423",
                            "origin": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "destination": {
                                "description": "Madrid",
                                "code": "MAD"
                            }
                        },
                        {
                            "id": "IB043220230419",
                            "origin": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "destination": {
                                "description": "Bilbao",
                                "code": "BIO"
                            }
                        },
                        {
                            "id": "IB044720230423",
                            "origin": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "destination": {
                                "description": "Madrid",
                                "code": "MAD"
                            }
                        },
                        {
                            "id": "IB043220230419",
                            "origin": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "destination": {
                                "description": "Bilbao",
                                "code": "BIO"
                            }
                        },
                        {
                            "id": "IB042320230423",
                            "origin": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "destination": {
                                "description": "Madrid",
                                "code": "MAD"
                            }
                        },
                        {
                            "id": "IB043220230419",
                            "origin": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "destination": {
                                "description": "Bilbao",
                                "code": "BIO"
                            }
                        },
                        {
                            "id": "IB042520230423",
                            "origin": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "destination": {
                                "description": "Madrid",
                                "code": "MAD"
                            }
                        },
                        {
                            "id": "IB043220230419",
                            "origin": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "destination": {
                                "description": "Bilbao",
                                "code": "BIO"
                            }
                        },
                        {
                            "id": "IB042520230423",
                            "origin": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "destination": {
                                "description": "Madrid",
                                "code": "MAD"
                            }
                        },
                        {
                            "id": "IB044820230419",
                            "origin": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "destination": {
                                "description": "Bilbao",
                                "code": "BIO"
                            }
                        },
                        {
                            "id": "IB044720230423",
                            "origin": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "destination": {
                                "description": "Madrid",
                                "code": "MAD"
                            }
                        },
                        {
                            "id": "IB043220230419",
                            "origin": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "destination": {
                                "description": "Bilbao",
                                "code": "BIO"
                            }
                        },
                        {
                            "id": "IB042320230423",
                            "origin": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "destination": {
                                "description": "Madrid",
                                "code": "MAD"
                            }
                        }
                    ],
                    "showBasket": true,
                    "currency": {
                        "suffixSymbol": true,
                        "decimalSeparator": ".",
                        "numberDecimals": 2,
                        "groupingSeparator": ",",
                        "currencySymbol": "€",
                        "description": "Euro"
                    },
                    "total": {
                        "totalPrice": 127.63,
                        "formatted": "284.63€",
                        "original": 284.63
                    },
                    "trips": {
                        "trips": [
                            {
                                "scales": false,
                                "segments": [
                                    {
                                        "origin": {
                                            "code": "MAD",
                                            "description": "Madrid",
                                            "countryCode": "ES",
                                            "country": {
                                                "code": "ES",
                                                "description": "Spain"
                                            }
                                        },
                                        "destination": {
                                            "code": "BIO",
                                            "description": "Bilbao",
                                            "countryCode": "ES",
                                            "country": {
                                                "code": "ES",
                                                "description": "Spain"
                                            }
                                        },
                                        "date": "Wednesday 19 Apr 2023 / 06:20",
                                        "segments": [
                                            {
                                                "origin": {
                                                    "code": "MAD",
                                                    "description": "Madrid",
                                                    "countryCode": "ES",
                                                    "country": {
                                                        "code": "ES",
                                                        "description": "Spain"
                                                    }
                                                },
                                                "destination": {
                                                    "code": "BIO",
                                                    "description": "Bilbao",
                                                    "countryCode": "ES",
                                                    "country": {
                                                        "code": "ES",
                                                        "description": "Spain"
                                                    }
                                                },
                                                "date": "Wednesday 19 Apr 2023 / 06:20"
                                            }
                                        ]
                                    },
                                    {
                                        "origin": {
                                            "code": "BIO",
                                            "description": "Bilbao",
                                            "countryCode": "ES",
                                            "country": {
                                                "code": "ES",
                                                "description": "Spain"
                                            }
                                        },
                                        "destination": {
                                            "code": "MAD",
                                            "description": "Madrid",
                                            "countryCode": "ES",
                                            "country": {
                                                "code": "ES",
                                                "description": "Spain"
                                            }
                                        },
                                        "date": "Sunday 23 Apr 2023 / 09:10",
                                        "segments": [
                                            {
                                                "origin": {
                                                    "code": "BIO",
                                                    "description": "Bilbao",
                                                    "countryCode": "ES",
                                                    "country": {
                                                        "code": "ES",
                                                        "description": "Spain"
                                                    }
                                                },
                                                "destination": {
                                                    "code": "MAD",
                                                    "description": "Madrid",
                                                    "countryCode": "ES",
                                                    "country": {
                                                        "code": "ES",
                                                        "description": "Spain"
                                                    }
                                                },
                                                "date": "Sunday 23 Apr 2023 / 09:10"
                                            }
                                        ]
                                    }
                                ],
                                "passengers": [
                                    {
                                        "quantity": 1,
                                        "type": "ADULT",
                                        "description": "Adult",
                                        "perPassengerPrice": "97.00€",
                                        "taxes": "30.63€",
                                        "namesList": [
                                            "Carlos apellido"
                                        ]
                                    }
                                ]
                            }
                        ],
                        "total": {
                            "totalPrice": 127.63,
                            "formatted": "127.63€",
                            "original": 127.63
                        }
                    }
                },
                "advancedSearch": false,
                "showModalBackHome": true,
                "currency": {
                    "suffixSymbol": true,
                    "decimalSeparator": ".",
                    "numberDecimals": 2,
                    "groupingSeparator": ",",
                    "currencySymbol": "€",
                    "description": "Euro"
                },
                "showAdvancedSearch": true,
                "avancedSearch": true,
                "steps": {
                    "position": 3,
                    "totalSteps": 5
                }
            },
            "greyBarModel": {
                "login": {},
                "loggedData": {},
                "userLogged": false,
                "isONB": false,
                "isLogged": false,
                "show": false
            },
            "stepsModel": {
                "steps": [
                    {
                        "index": 1,
                        "position": "availability",
                        "text": "HEADER_STEPS_FLIGHT_SELECT"
                    },
                    {
                        "index": 2,
                        "position": "ibairp",
                        "text": "HEADER_STEPS_PASSENGER_DATA"
                    },
                    {
                        "index": 3,
                        "position": "ibcmtv",
                        "text": "HEADER_STEPS_CUSTOM_COMPLETE"
                    },
                    {
                        "index": 4,
                        "position": "ibpurc",
                        "text": "HEADER_STEPS_PAYMENT"
                    },
                    {
                        "index": 5,
                        "position": "confirmation",
                        "text": "HEADER_STEPS_CONFIRMATION"
                    }
                ],
                "position": "ibcmtv"
            },
            "shoppingBasket": {
                "baggages": {
                    "segments": [
                        {
                            "segmentId": "MADBIO20230419062000",
                            "baggages": [
                                {
                                    "type": "BAGGAGE_15",
                                    "quanty": 1,
                                    "description": "15kg",
                                    "passengers": [
                                        "ADULT_01"
                                    ],
                                    "total": 13,
                                    "totalFormatted": "13.00€"
                                }
                            ],
                            "total": 13,
                            "origin": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "Spain"
                                }
                            },
                            "destination": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "country": {
                                    "code": "ES",
                                    "description": "Spain"
                                }
                            }
                        }
                    ],
                    "hasBaggage": true,
                    "total": {
                        "total": 13,
                        "totalFormatted": "13.00€"
                    }
                },
                "seats": {
                    "segments": [
                        {
                            "segmentId": "IB043220230419",
                            "isEarly": false,
                            "seats": [
                                {
                                    "type": "",
                                    "description": "",
                                    "quanty": 1,
                                    "passengers": [
                                        {
                                            "id": "ADULT_01",
                                            "amount": 5,
                                            "amountFormatted": "5.00€"
                                        }
                                    ],
                                    "amount": 5,
                                    "totalFormatted": "5.00€",
                                    "freePassenger": [],
                                    "totalAmountFreePassenger": "0€",
                                    "paymentPassenger": [
                                        {
                                            "id": "ADULT_01",
                                            "amount": 5,
                                            "amountFormatted": "5.00€"
                                        }
                                    ],
                                    "totalAmountPaymentPassenger": "5.00€"
                                }
                            ],
                            "origin": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "destination": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "quanty": 1,
                            "total": 5,
                            "totalFormatted": "5.00€"
                        },
                        {
                            "segmentId": "IB042320230423",
                            "isEarly": false,
                            "seats": [
                                {
                                    "type": "",
                                    "description": "",
                                    "quanty": 1,
                                    "passengers": [
                                        {
                                            "id": "ADULT_01",
                                            "amount": 7,
                                            "amountFormatted": "7.00€"
                                        }
                                    ],
                                    "amount": 7,
                                    "totalFormatted": "7.00€",
                                    "freePassenger": [],
                                    "totalAmountFreePassenger": "0€",
                                    "paymentPassenger": [
                                        {
                                            "id": "ADULT_01",
                                            "amount": 7,
                                            "amountFormatted": "7.00€"
                                        }
                                    ],
                                    "totalAmountPaymentPassenger": "7.00€"
                                }
                            ],
                            "origin": {
                                "description": "Bilbao",
                                "code": "BIO"
                            },
                            "destination": {
                                "description": "Madrid",
                                "code": "MAD"
                            },
                            "quanty": 1,
                            "total": 7,
                            "totalFormatted": "7.00€"
                        }
                    ],
                    "hasSeats": true,
                    "total": {
                        "total": 12,
                        "totalFormatted": "12.00€"
                    }
                },
                "insurance": {
                    "info": null,
                    "hasInsurance": false
                },
                "flexibilization": {
                    "info": {
                        "type": "ancillarie",
                        "title": "ANCILLARIES_FLEXIBILITY_TITLE",
                        "category": "flexibility",
                        "currency": {
                            "suffixSymbol": true,
                            "decimalSeparator": ".",
                            "numberDecimals": 2,
                            "groupingSeparator": ",",
                            "currencySymbol": "€",
                            "description": "Euro"
                        },
                        "amount": {
                            "title": "ANCILLARIES_FLEXIBILITY_BASKET_AMOUNT",
                            "price": 51,
                            "priceFormatted": "51.00€"
                        },
                        "items": [
                            {
                                "concepts": [
                                    {
                                        "quantity": 1,
                                        "description": "Flexibility Pack",
                                        "price": 51,
                                        "priceFormatted": "51.00€"
                                    }
                                ]
                            }
                        ],
                        "delete": [
                            {
                                "type": "FLEXIBILITY_ON_DEMAND"
                            }
                        ]
                    },
                    "hasFlexibilization": true
                },
                "upgrading": {
                    "segments": [],
                    "hasUpgrading": false
                },
                "speqs": {
                    "segments": [
                        {
                            "segmentId": "MADBIO20230419062000",
                            "speqs": [
                                {
                                    "type": "BICYCLE",
                                    "quanty": 1,
                                    "description": "Bicycles",
                                    "passengers": [
                                        "ADULT_01"
                                    ],
                                    "total": 40,
                                    "totalFormatted": "40.00€"
                                },
                                {
                                    "type": "SKI_SNOW",
                                    "quanty": 1,
                                    "description": "Skis/Snowboard",
                                    "passengers": [
                                        "ADULT_01"
                                    ],
                                    "total": 35,
                                    "totalFormatted": "35.00€"
                                }
                            ],
                            "total": 75,
                            "origin": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "Spain"
                                }
                            },
                            "destination": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "country": {
                                    "code": "ES",
                                    "description": "Spain"
                                }
                            }
                        }
                    ],
                    "hasSpeqs": true,
                    "total": {
                        "total": 75,
                        "totalFormatted": "75.00€"
                    }
                },
                "priorityBoarding": {
                    "info": {
                        "type": "ancillarie",
                        "title": "Prioridad de embarque",
                        "category": "priority",
                        "currency": {
                            "suffixSymbol": true,
                            "decimalSeparator": ".",
                            "numberDecimals": 2,
                            "groupingSeparator": ",",
                            "currencySymbol": "€",
                            "description": "Euro"
                        },
                        "amount": 6,
                        "items": [],
                        "delete": [
                            {
                                "type": "PRIORITY_BOARDING"
                            }
                        ],
                        "trips": [
                            {
                                "id": "IB043220230419",
                                "arrival": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "Spain"
                                    }
                                },
                                "departure": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "Spain"
                                    }
                                },
                                "amount": 6,
                                "priceFormatted": "6.00€",
                                "quantity": 1
                            }
                        ],
                        "priceFormatted": "6.00€"
                    },
                    "hasPriorityBoarding": true
                },
                "carbonFootprint": {
                    "info": null,
                    "hasCarbonFootprint": false
                },
                "discountsModel": {
                    "hasDiscounts": false,
                    "total": 0,
                    "discounts": {},
                    "totalFormated": "0€"
                },
                "othersModel": {
                    "hasElements": false,
                    "others": [],
                    "total": {
                        "total": 0,
                        "totalFormatted": ""
                    }
                },
                "segmentsInfo": [
                    {
                        "id": "IB043220230419",
                        "origin": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "destination": {
                            "description": "Bilbao",
                            "code": "BIO"
                        }
                    },
                    {
                        "id": "IB042320230423",
                        "origin": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "destination": {
                            "description": "Madrid",
                            "code": "MAD"
                        }
                    },
                    {
                        "id": "IB043220230419",
                        "origin": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "destination": {
                            "description": "Bilbao",
                            "code": "BIO"
                        }
                    },
                    {
                        "id": "IB044720230423",
                        "origin": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "destination": {
                            "description": "Madrid",
                            "code": "MAD"
                        }
                    },
                    {
                        "id": "IB043220230419",
                        "origin": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "destination": {
                            "description": "Bilbao",
                            "code": "BIO"
                        }
                    },
                    {
                        "id": "IB042320230423",
                        "origin": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "destination": {
                            "description": "Madrid",
                            "code": "MAD"
                        }
                    },
                    {
                        "id": "IB043220230419",
                        "origin": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "destination": {
                            "description": "Bilbao",
                            "code": "BIO"
                        }
                    },
                    {
                        "id": "IB042520230423",
                        "origin": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "destination": {
                            "description": "Madrid",
                            "code": "MAD"
                        }
                    },
                    {
                        "id": "IB043220230419",
                        "origin": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "destination": {
                            "description": "Bilbao",
                            "code": "BIO"
                        }
                    },
                    {
                        "id": "IB042520230423",
                        "origin": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "destination": {
                            "description": "Madrid",
                            "code": "MAD"
                        }
                    },
                    {
                        "id": "IB044820230419",
                        "origin": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "destination": {
                            "description": "Bilbao",
                            "code": "BIO"
                        }
                    },
                    {
                        "id": "IB044720230423",
                        "origin": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "destination": {
                            "description": "Madrid",
                            "code": "MAD"
                        }
                    },
                    {
                        "id": "IB043220230419",
                        "origin": {
                            "description": "Madrid",
                            "code": "MAD"
                        },
                        "destination": {
                            "description": "Bilbao",
                            "code": "BIO"
                        }
                    },
                    {
                        "id": "IB042320230423",
                        "origin": {
                            "description": "Bilbao",
                            "code": "BIO"
                        },
                        "destination": {
                            "description": "Madrid",
                            "code": "MAD"
                        }
                    }
                ],
                "showBasket": true,
                "currency": {
                    "suffixSymbol": true,
                    "decimalSeparator": ".",
                    "numberDecimals": 2,
                    "groupingSeparator": ",",
                    "currencySymbol": "€",
                    "description": "Euro"
                },
                "total": {
                    "totalPrice": 127.63,
                    "formatted": "284.63€",
                    "original": 284.63
                },
                "trips": {
                    "trips": [
                        {
                            "scales": false,
                            "segments": [
                                {
                                    "origin": {
                                        "code": "MAD",
                                        "description": "Madrid",
                                        "countryCode": "ES",
                                        "country": {
                                            "code": "ES",
                                            "description": "Spain"
                                        }
                                    },
                                    "destination": {
                                        "code": "BIO",
                                        "description": "Bilbao",
                                        "countryCode": "ES",
                                        "country": {
                                            "code": "ES",
                                            "description": "Spain"
                                        }
                                    },
                                    "date": "Wednesday 19 Apr 2023 / 06:20",
                                    "segments": [
                                        {
                                            "origin": {
                                                "code": "MAD",
                                                "description": "Madrid",
                                                "countryCode": "ES",
                                                "country": {
                                                    "code": "ES",
                                                    "description": "Spain"
                                                }
                                            },
                                            "destination": {
                                                "code": "BIO",
                                                "description": "Bilbao",
                                                "countryCode": "ES",
                                                "country": {
                                                    "code": "ES",
                                                    "description": "Spain"
                                                }
                                            },
                                            "date": "Wednesday 19 Apr 2023 / 06:20"
                                        }
                                    ]
                                },
                                {
                                    "origin": {
                                        "code": "BIO",
                                        "description": "Bilbao",
                                        "countryCode": "ES",
                                        "country": {
                                            "code": "ES",
                                            "description": "Spain"
                                        }
                                    },
                                    "destination": {
                                        "code": "MAD",
                                        "description": "Madrid",
                                        "countryCode": "ES",
                                        "country": {
                                            "code": "ES",
                                            "description": "Spain"
                                        }
                                    },
                                    "date": "Sunday 23 Apr 2023 / 09:10",
                                    "segments": [
                                        {
                                            "origin": {
                                                "code": "BIO",
                                                "description": "Bilbao",
                                                "countryCode": "ES",
                                                "country": {
                                                    "code": "ES",
                                                    "description": "Spain"
                                                }
                                            },
                                            "destination": {
                                                "code": "MAD",
                                                "description": "Madrid",
                                                "countryCode": "ES",
                                                "country": {
                                                    "code": "ES",
                                                    "description": "Spain"
                                                }
                                            },
                                            "date": "Sunday 23 Apr 2023 / 09:10"
                                        }
                                    ]
                                }
                            ],
                            "passengers": [
                                {
                                    "quantity": 1,
                                    "type": "ADULT",
                                    "description": "Adult",
                                    "perPassengerPrice": "97.00€",
                                    "taxes": "30.63€",
                                    "namesList": [
                                        "Carlos apellido"
                                    ]
                                }
                            ]
                        }
                    ],
                    "total": {
                        "totalPrice": 127.63,
                        "formatted": "127.63€",
                        "original": 127.63
                    }
                }
            }
        },
        addToCart: {
            "ecommerce": {
                "items": [
                    {
                        "item_name": "flight",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 32.22,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "MAD-BIO|BIO-MAD",
                        "item_category3": "1",
                        "item_variant": "economy_basica",
                        "quantity": 1
                    },
                    {
                        "item_name": "flight",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 95.41,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "MAD-BIO|BIO-MAD",
                        "item_category3": "2",
                        "item_variant": "economy_basica",
                        "quantity": 1
                    },
                    {
                        "item_name": "baggage",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 13,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "MAD-BIO",
                        "item_category3": "1",
                        "item_variant": "15kg",
                        "quantity": 1
                    },
                    {
                        "item_name": "seat",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 5,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "MAD-BIO",
                        "item_category3": "1",
                        "item_variant": "free",
                        "quantity": 1
                    },
                    {
                        "item_name": "seat",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 7,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "BIO-MAD",
                        "item_category3": "2",
                        "item_variant": "free",
                        "quantity": 1
                    },
                    {
                        "item_name": "flexibilization",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 51,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "all",
                        "item_category3": "all",
                        "item_variant": "flexibility pack",
                        "quantity": 1
                    },
                    {
                        "item_name": "priority boarding",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 6,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "MAD-BIO",
                        "item_category3": "1",
                        "item_variant": "",
                        "quantity": 1
                    },
                    {
                        "item_name": "special baggage",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 40,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "MAD-BIO",
                        "item_category3": "1",
                        "item_variant": "bike",
                        "quantity": 1
                    },
                    {
                        "item_name": "special baggage",
                        "item_id": "MAD-BIO|BIO-MAD",
                        "price": 35,
                        "item_brand": "iberia",
                        "item_category": "compra directa",
                        "item_category2": "MAD-BIO",
                        "item_category3": "1",
                        "item_variant": "ski",
                        "quantity": 1
                    }
                ]
            }
        },
    },
    req: {
        baggagesTrips: 
            [
                {
                    "id": "ADULT_01",
                    "trips": [
                        {
                            "id": "MADAMS20230719084500",
                            "pieces": [
                                {
                                    "subtype": "BAGGAGE_15",
                                    "description": "15kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0LM"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 25,
                                            "airportAmount": 25,
                                            "from": 1,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                },
                                {
                                    "subtype": "BAGGAGE_23",
                                    "description": "23kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0GO"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 32,
                                            "airportAmount": 32,
                                            "from": 1,
                                            "to": 1
                                        },
                                        {
                                            "amount": 37,
                                            "airportAmount": 37,
                                            "from": 2,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                },
                                {
                                    "subtype": "BAGGAGE_32",
                                    "description": "32kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0FM"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 63,
                                            "airportAmount": 63,
                                            "from": 1,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                }
                            ],
                            "maxAdditionalPieces": 9,
                            "piecesChoosed": 0,
                            "totalPrice": 0,
                            "totalBaggages": 0,
                            "departure": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "Spain"
                                }
                            },
                            "arrival": {
                                "code": "AMS",
                                "description": "Amsterdam",
                                "country": {
                                    "code": "NL",
                                    "description": "Netherlands"
                                }
                            },
                            "text": null
                        }
                    ],
                    "info": {
                        "name": "juan",
                        "surname": "longa",
                        "infant": null
                    }
                }
            ],
        speqsTrips: [
            {
                "id": "ADULT_01",
                "trips": [
                    {
                        "id": "MADAMS20230719084500",
                        "pieces": [
                            {
                                "subtype": "SKI_SNOW",
                                "description": "Skis/Snowboard",
                                "extraPieces": null,
                                "reasonForIssuance": {
                                    "code": "C",
                                    "subcode": "0DD"
                                },
                                "franchisePieces": 0,
                                "purchasedPieces": 0,
                                "maxAdditionalSubtypePieces": 3,
                                "availablePriceRanges": [
                                    {
                                        "amount": 40,
                                        "airportAmount": 40,
                                        "from": 1,
                                        "to": 3,
                                        "amountPrice": "40€"
                                    }
                                ],
                                "status": {
                                    "code": "AVAILABLE",
                                    "reason": null
                                },
                                "quantySelected": 0
                            },
                            {
                                "subtype": "GOLF_EQUIPMENT",
                                "description": "Golf equipment",
                                "extraPieces": null,
                                "reasonForIssuance": {
                                    "code": "C",
                                    "subcode": "0D4"
                                },
                                "franchisePieces": 0,
                                "purchasedPieces": 0,
                                "maxAdditionalSubtypePieces": 3,
                                "availablePriceRanges": [
                                    {
                                        "amount": 40,
                                        "airportAmount": 40,
                                        "from": 1,
                                        "to": 3,
                                        "amountPrice": "40€"
                                    }
                                ],
                                "status": {
                                    "code": "AVAILABLE",
                                    "reason": null
                                },
                                "quantySelected": 0
                            },
                            {
                                "subtype": "BICYCLE",
                                "description": "Bicycles",
                                "extraPieces": null,
                                "reasonForIssuance": {
                                    "code": "C",
                                    "subcode": "0EC"
                                },
                                "franchisePieces": 0,
                                "purchasedPieces": 0,
                                "maxAdditionalSubtypePieces": 3,
                                "availablePriceRanges": [
                                    {
                                        "amount": 50,
                                        "airportAmount": 50,
                                        "from": 1,
                                        "to": 3,
                                        "amountPrice": "50€"
                                    }
                                ],
                                "status": {
                                    "code": "AVAILABLE",
                                    "reason": null
                                },
                                "quantySelected": 0
                            }
                        ],
                        "maxAdditionalPieces": 3,
                        "speqsChoosed": 0,
                        "totalPrice": 0,
                        "departure": {
                            "code": "MAD",
                            "description": "Madrid",
                            "country": {
                                "code": "ES",
                                "description": "Spain"
                            }
                        },
                        "arrival": {
                            "code": "AMS",
                            "description": "Amsterdam",
                            "country": {
                                "code": "NL",
                                "description": "Netherlands"
                            }
                        },
                        "text": null
                    }
                ],
                "info": {
                    "name": "juan",
                    "surname": "longa",
                    "infant": null
                }
            }
        ],
        insuranceInfo: [{}],
        bookingInfo: {
            "passengers": [
                {
                    "passengerType": "ADULT",
                    "personalInfo": {
                        "name": "juan",
                        "surname": "longa",
                        "lastSurname": ""
                    },
                    "passengerId": "ADULT_01",
                    "seat": null
                }
            ],
            "order": {
                "orderId": "Qm9va2luZ0BJQmVlYTJiOTc2ZjNmNjQ5MDQ4NWE4YTcyMDYzOTg0YjA2T1A%3D",
                "bookingReferences": [
                    {
                        "provider": "IB",
                        "reference": "K5EMJ"
                    }
                ],
                "orderItems": [
                    {
                        "type": "flight",
                        "orderItemId": "IBeea2b976f3f6490485a8a72063984b06OP_01",
                        "bookingReferences": [
                            {
                                "provider": "IB",
                                "reference": "K5EMJ"
                            }
                        ],
                        "price": {
                            "fare": 63,
                            "tax": 18.38,
                            "total": 81.38,
                            "currency": "EUR",
                            "ticketingFee": 0
                        },
                        "sliceIds": [
                            "MADAMS20230719084500"
                        ],
                        "passengerPrices": [
                            {
                                "fareCalculation": "MAD IB AMS65.96NUC65.96END ROE0.950867",
                                "passengerId": "ADULT_01",
                                "price": {
                                    "fare": 63,
                                    "tax": 18.38,
                                    "total": 81.38,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                },
                                "segmentPrices": [
                                    {
                                        "price": {
                                            "fare": 63,
                                            "currency": "EUR"
                                        },
                                        "fareCode": "NWNNEOB2",
                                        "segmentsIds": [
                                            "IB372220230719"
                                        ],
                                        "ticketDesignator": "XX02",
                                        "penalties": [
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
                                                "nonrefundable": true,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": false,
                                                "isChangeable": false
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
                                                "nonrefundable": true,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": false,
                                                "isChangeable": false
                                            }
                                        ],
                                        "penaltyFlags": null
                                    }
                                ],
                                "taxes": [
                                    {
                                        "code": "JD",
                                        "amount": 14.48,
                                        "currency": "EUR",
                                        "description": "Departure Charge",
                                        "subcode": null,
                                        "country": null,
                                        "carrier": null
                                    },
                                    {
                                        "code": "OG",
                                        "amount": 0.63,
                                        "currency": "EUR",
                                        "description": "Security Tax",
                                        "subcode": null,
                                        "country": null,
                                        "carrier": null
                                    },
                                    {
                                        "code": "QV",
                                        "amount": 3.27,
                                        "currency": "EUR",
                                        "description": "Security",
                                        "subcode": null,
                                        "country": null,
                                        "carrier": null
                                    }
                                ],
                                "passengerDiscount": null
                            }
                        ]
                    }
                ],
                "price": {
                    "fare": 63,
                    "tax": 18.38,
                    "total": 81.38,
                    "currency": "EUR",
                    "ticketingFee": 0
                },
                "bookingOffice": "MAD175",
                "slices": [
                    {
                        "id": "MADAMS20230719084500",
                        "departureDateTime": "2023-07-19 08:45",
                        "arrivalDateTime": "2023-07-19 11:30",
                        "duration": 165,
                        "stopsNumber": 0,
                        "price": {
                            "fare": 63,
                            "currency": "EUR"
                        },
                        "detailedPrices": [
                            {
                                "fare": 63,
                                "currency": "EUR",
                                "passengerIds": [
                                    "ADULT_01"
                                ],
                                "segmentPrices": [
                                    {
                                        "price": {
                                            "fare": 63,
                                            "currency": "EUR"
                                        },
                                        "fareCode": "NWNNEOB2",
                                        "segmentsIds": [
                                            "IB372220230719"
                                        ],
                                        "ticketDesignator": "XX02",
                                        "penalties": [],
                                        "penaltyFlags": null
                                    }
                                ]
                            }
                        ],
                        "overnight": false,
                        "segments": [
                            {
                                "id": "IB372220230719",
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
                                            "description": "Spain"
                                        }
                                    }
                                },
                                "arrival": {
                                    "code": "AMS",
                                    "name": "Amsterdam Schiphol Airport",
                                    "terminal": null,
                                    "city": {
                                        "code": "AMS",
                                        "description": "Amsterdam",
                                        "countryCode": "NL",
                                        "country": {
                                            "code": "NL",
                                            "description": "Netherlands"
                                        }
                                    }
                                },
                                "departureDateTime": "2023-07-19 08:45",
                                "cabin": {
                                    "code": "R",
                                    "type": "ECONOMY",
                                    "description": "Economy",
                                    "fareFamily": "TBAESEU",
                                    "mainClass": "N"
                                },
                                "flight": {
                                    "marketingCarrier": {
                                        "code": "IB",
                                        "name": "Iberia"
                                    },
                                    "operationalCarrier": {
                                        "code": "I2",
                                        "name": "Iberia Express"
                                    },
                                    "marketingFlightNumber": "3722",
                                    "operationalFlightNumber": null,
                                    "operationalDisclosure": "I2",
                                    "aircraft": {
                                        "code": "32A",
                                        "description": "Airbus A320 (Sharklets)"
                                    }
                                },
                                "duration": 165,
                                "waitingTime": 0
                            }
                        ]
                    }
                ],
                "voucherDisscount": null,
                "discountsApplied": {
                    "originalPrice": {
                        "fare": 64.29,
                        "tax": 18.38,
                        "total": 82.67,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "discounts": [
                        {
                            "type": "DYNAMIC_PRICING",
                            "description": "DYNAMIC.PRICING.discount.description",
                            "percentDiscount": 2,
                            "totalDiscount": 1.29,
                            "dynamicDiscountRuleId": "DynamicDiscount",
                            "accountCode": "660964"
                        }
                    ],
                    "originalOrderItems": [
                        {
                            "type": "flight",
                            "orderItemId": "IBeea2b976f3f6490485a8a72063984b06OP_01",
                            "bookingReferences": [
                                {
                                    "provider": "IB",
                                    "reference": "K5EMJ"
                                }
                            ],
                            "price": {
                                "fare": 64.29,
                                "tax": 18.38,
                                "total": 82.67,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "sliceIds": [
                                "MADAMS20230719084500"
                            ],
                            "passengerPrices": [
                                {
                                    "fareCalculation": "MAD IB AMS65.96NUC65.96END ROE0.950867",
                                    "passengerId": "ADULT_01",
                                    "price": {
                                        "fare": 64.29,
                                        "tax": 18.38,
                                        "total": 82.67,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "segmentPrices": [
                                        {
                                            "price": {
                                                "fare": 63,
                                                "currency": "EUR"
                                            },
                                            "fareCode": "NWNNEOB2",
                                            "segmentsIds": [
                                                "IB372220230719"
                                            ],
                                            "ticketDesignator": "XX02",
                                            "penalties": [
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
                                                    "nonrefundable": true,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": false,
                                                    "isChangeable": false
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
                                                    "nonrefundable": true,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": false,
                                                    "isChangeable": false
                                                }
                                            ],
                                            "penaltyFlags": null
                                        }
                                    ],
                                    "taxes": [
                                        {
                                            "code": "JD",
                                            "amount": 14.48,
                                            "currency": "EUR",
                                            "description": "Departure Charge",
                                            "subcode": null,
                                            "country": null,
                                            "carrier": null
                                        },
                                        {
                                            "code": "OG",
                                            "amount": 0.63,
                                            "currency": "EUR",
                                            "description": "Security Tax",
                                            "subcode": null,
                                            "country": null,
                                            "carrier": null
                                        },
                                        {
                                            "code": "QV",
                                            "amount": 3.27,
                                            "currency": "EUR",
                                            "description": "Security",
                                            "subcode": null,
                                            "country": null,
                                            "carrier": null
                                        }
                                    ],
                                    "orderItemPaymentInfos": []
                                }
                            ],
                            "sliceBaggage": [
                                {
                                    "sliceId": "MADAMS20230719084500",
                                    "passengersBaggage": [
                                        {
                                            "passengersId": [
                                                "ADULT_01"
                                            ],
                                            "handBaggageAllowances": [
                                                {
                                                    "baggageConcept": "PIECE",
                                                    "totalQuantity": 2
                                                }
                                            ],
                                            "baggageInHoldAllowances": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "totalDiscount": 1.29
                }
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
                            "text": "Turista.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Cabina Turista",
                                "message": "Turista.",
                                "code": "CA_Cabina_Turista",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Turista"
                            }
                        },
                        {
                            "code": "EQMANO",
                            "name": "Equipaje de mano",
                            "text": "Incluida 1 pieza hasta 10 kg (56x40x25cm).",
                            "units": 1,
                            "extendedInfo": {
                                "title": "Equipaje de mano: 1 pieza",
                                "message": "Incluido 1 accesorio personal y 1 pieza hasta 10 kg (56x40x25cm), en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo. ",
                                "code": "CA_EQP_MANO_10KG",
                                "conditionStatus": true,
                                "observationCode": "2",
                                "mobileMessage": "1 bulto (56x40x25cm)"
                            }
                        },
                        {
                            "code": "EQBODEGA",
                            "name": "Equipaje en bodega",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Equipaje facturable no incluido",
                                "message": "Con coste.",
                                "code": "CA_1_PIEZAS_PAGO",
                                "conditionStatus": false,
                                "observationCode": "1",
                                "mobileMessage": "No incluido"
                            }
                        },
                        {
                            "code": "COMIDA",
                            "name": "Comida",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Comida no incluida ",
                                "message": "Con coste.",
                                "code": "Comida_no_incluida",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No incluido"
                            }
                        },
                        {
                            "code": "ASIENTO",
                            "name": "Selección de asiento",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Selección de asiento con coste",
                                "message": "Con coste. ",
                                "code": "CA_Asiento_Pago",
                                "conditionStatus": false,
                                "observationCode": "3",
                                "mobileMessage": "De pago"
                            }
                        },
                        {
                            "code": "ASIENTODELANTERO",
                            "name": "Asiento delantero",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Asiento delantero con coste",
                                "message": "Con coste.",
                                "code": "CA_Asiento_Delantero_pago",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "De pago"
                            }
                        },
                        {
                            "code": "ASIENTOXL",
                            "name": "Selección de asiento XL",
                            "text": "Con coste, salvo excepciones.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Asiento XL con coste",
                                "message": "Con coste en vuelos operados por Iberia, Iberia Express e Iberia Regional Air Nostrum. Y sin coste en vuelos operados por British Airways.",
                                "code": "CA_Asiento_XL_Pago",
                                "conditionStatus": false,
                                "observationCode": "3",
                                "mobileMessage": "De pago"
                            }
                        },
                        {
                            "code": "EMBARQUE",
                            "name": "Prioridad de Embarque",
                            "text": "No incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Embarque prioritario no incluido",
                                "message": "No incluido.",
                                "code": "CA_Embarque_NO_Prioritario",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "CAMBIO",
                            "name": "Cambios",
                            "text": "Permitido con coste, no permitido en caso de no-show.",
                            "units": 65,
                            "extendedInfo": {
                                "title": "Cambio de vuelo con coste",
                                "message": "Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).",
                                "code": "CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Permitido con coste, no permitido en caso de no-show."
                            }
                        },
                        {
                            "code": "REEMBOLSO",
                            "name": "Reembolso (por sentido)",
                            "text": "No permitido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "No permitido",
                                "message": "No permitido.",
                                "code": "CA_REEMBOLSO NO PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No permitido"
                            }
                        },
                        {
                            "code": "TARJEMBANTIC",
                            "name": "Tarjeta de embarque anticipada",
                            "text": "No incluida.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Tarjeta de embarque anticipada no incluida",
                                "message": "No incluida. ",
                                "code": "CA_Tarjeta_embarque_anticipada_no_incluido",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No incluido"
                            }
                        },
                        {
                            "code": "CHECKINDESK",
                            "name": "Mostrador check-in exclusivo",
                            "text": "No incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Mostrador Check-in exclusivo no incluido",
                                "message": "No incluido.",
                                "code": "Chek-in_desk_ NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "SALAVIP",
                            "name": "Acceso a salas VIP",
                            "text": "Acceso no incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Acceso a Sala Vip no incluido",
                                "message": "Acceso no incluido.",
                                "code": "Acceso a salas VIP No permitido",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "FASTTRACK",
                            "name": "Fast Track",
                            "text": "No incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Fast Track no incluido",
                                "message": "No incluido.",
                                "code": "Fast Track NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "EQPPRIOR",
                            "name": "Entrega prioritaria equipaje",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "No incluye entrega rápida de equipaje",
                                "message": "Con coste.",
                                "code": "Entrega_prioritaria_equipaje_ NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "AVIO",
                            "name": "STANDARD",
                            "text": "Incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Obtén Avios con tu compra",
                                "message": "Incluido.  ",
                                "code": "AVIOS incluido",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Si"
                            }
                        },
                        {
                            "code": "WIFI",
                            "name": "WiFi",
                            "text": "Disponible con coste, según el tipo de avión.",
                            "units": null,
                            "extendedInfo": {
                                "title": "",
                                "message": "",
                                "code": null,
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "WiFi pago"
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
                        "ASIENTODELANTERO",
                        "EMBARQUE",
                        "TARJEMBANTIC",
                        "CAMBIO",
                        "REEMBOLSO",
                        "CHECKINDESK",
                        "FASTTRACK"
                    ]
                }
            ],
            "outwardSegments": [
                {
                    "id": "IB372220230719",
                    "departure": {
                        "date": "2023-07-19 08:45",
                        "airport": {
                            "code": "MAD",
                            "description": "Madrid",
                            "country": {
                                "code": "ES",
                                "description": "Spain"
                            }
                        },
                        "terminal": "4"
                    },
                    "arrival": {
                        "date": "2023-07-19 11:30",
                        "airport": {
                            "code": "AMS",
                            "description": "Amsterdam",
                            "country": {
                                "code": "NL",
                                "description": "Netherlands"
                            }
                        },
                        "terminal": null
                    },
                    "cabinClass": {
                        "code": "R",
                        "type": "ECONOMY",
                        "description": "Economy",
                        "fareFamily": "TBAESEU",
                        "mainClass": "N"
                    },
                    "passengers": [
                        {
                            "passengerType": "ADULT",
                            "personalInfo": {
                                "name": "juan",
                                "surname": "longa",
                                "lastSurname": ""
                            },
                            "passengerId": "ADULT_01",
                            "seat": null
                        }
                    ],
                    "waitingTime": 0
                }
            ],
            "returnSegments": [],
            "airShuttleSegments": []
        },
        ancillariesInfo:{
            "currencies": [
                {
                    "code": "EUR",
                    "description": "Euro",
                    "symbol": "€",
                    "alignment": "R",
                    "groupingSeparator": ",",
                    "decimalSeparator": ".",
                    "decimals": 2,
                    "recommendedDisplay": "symbol"
                }
            ],
            "slices": [
                {
                    "id": "MADAMS20230719084500",
                    "segmentIds": [
                        "IB372220230719"
                    ]
                }
            ],
            "ancillaries": [
                {
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    },
                    "externalUrl": "https://www.iberia.com/es/en/bagonboard/?field1=K5EMJ&field2=LONGA&utm_source=iberia&utm_medium=referral&utm_content=standard_all-languages_all-routes_semistatic-landing_ad1&utm_campaign=airline_homebagdrop_na_iberia-pilot-3_mar19",
                    "type": "BOB"
                },
                {
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    },
                    "currency": "EUR",
                    "flexibilityAncillaries": [
                        {
                            "description": "com.ib.captwo.ass.fass.flexibility.subtype.description.FLIGHT_CHANGE",
                            "total": 10,
                            "passengerPrices": [
                                {
                                    "id": "ADULT_01",
                                    "amount": 10
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "subtype": "FLIGHT_CHANGE"
                        },
                        {
                            "description": "com.ib.captwo.ass.fass.flexibility.subtype.description.VOUCHER_REFUND",
                            "total": 28,
                            "passengerPrices": [
                                {
                                    "id": "ADULT_01",
                                    "amount": 28
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "percentage": 80,
                            "subtype": "VOUCHER_REFUND"
                        },
                        {
                            "description": "com.ib.captwo.ass.fass.flexibility.subtype.description.FLEXIBILITY_PACK",
                            "total": 33,
                            "passengerPrices": [
                                {
                                    "id": "ADULT_01",
                                    "amount": 33
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "percentage": 80,
                            "discount": 15,
                            "subtype": "FLEXIBILITY_PACK"
                        }
                    ],
                    "priceFrom": 10,
                    "type": "FLEXIBILITY_ON_DEMAND"
                },
                {
                    "status": {
                        "code": "NOT_AVAILABLE",
                        "reason": "ASS_FASS_9005"
                    },
                    "currency": "EUR",
                    "provider": "ALLIANZ",
                    "issueCountry": null,
                    "offers": [],
                    "countriesAllowed": [],
                    "type": "INSURANCE"
                },
                {
                    "status": {
                        "code": "NOT_AVAILABLE",
                        "reason": "TPC_AVAIL_ERR_0001"
                    },
                    "thirdPartyCompanies": [],
                    "type": "THIRD_PARTY_COMPANIES"
                },
                {
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    },
                    "currency": "EUR",
                    "providers": [
                        {
                            "provider": "Avis",
                            "availability": [
                                {
                                    "model": {
                                        "code": "MBMR",
                                        "description": "Group A - Toyota Aygo or similar",
                                        "transmissionType": "MANUAL",
                                        "airConditioner": true,
                                        "doorCount": 2,
                                        "pictureURI": "https://www.avisloyalty.eu/assets/fleetlarge/Toyota_Aygo_2019.jpg",
                                        "reservationUrl": "https://www.rentacar-iberia.com/en/?navigateTo=SRP&hire-location=AMS&return-location=AMS&date-from=19/07/2023&date-to=20/07/2023&time-from=1130&time-to=1130&cor=ES&partnerProgram=5"
                                    },
                                    "taxedRate": {
                                        "rate": {
                                            "daily": 135.83,
                                            "total": 135.83
                                        },
                                        "tax": 135.83,
                                        "total": 271.66
                                    }
                                },
                                {
                                    "model": {
                                        "code": "EDMR",
                                        "description": "Group B - Opel Corsa or similar",
                                        "transmissionType": "MANUAL",
                                        "airConditioner": true,
                                        "doorCount": 4,
                                        "pictureURI": null,
                                        "reservationUrl": "https://www.rentacar-iberia.com/en/?navigateTo=SRP&hire-location=AMS&return-location=AMS&date-from=19/07/2023&date-to=20/07/2023&time-from=1130&time-to=1130&cor=ES&partnerProgram=5"
                                    },
                                    "taxedRate": {
                                        "rate": {
                                            "daily": 142.62,
                                            "total": 142.62
                                        },
                                        "tax": 142.62,
                                        "total": 285.24
                                    }
                                }
                            ]
                        },
                        {
                            "provider": "Budget",
                            "availability": [
                                {
                                    "model": {
                                        "code": "MBMR",
                                        "description": "Group A - Kia Picanto or similar",
                                        "transmissionType": "MANUAL",
                                        "airConditioner": true,
                                        "doorCount": 2,
                                        "pictureURI": null,
                                        "reservationUrl": "https://www.rentacar-iberia.com/en/?navigateTo=SRP&hire-location=AMS&return-location=AMS&date-from=19/07/2023&date-to=20/07/2023&time-from=1130&time-to=1130&cor=ES&partnerProgram=5"
                                    },
                                    "taxedRate": {
                                        "rate": {
                                            "daily": 2,
                                            "total": 2
                                        },
                                        "tax": 2,
                                        "total": 4
                                    }
                                }
                            ]
                        }
                    ],
                    "type": "VEHICLE_RENTAL",
                    "pickUp": {
                        "location": {
                            "code": "AMS",
                            "description": "SCHIPHOL AIRPORT"
                        },
                        "dateTime": "2023-07-19 11:30"
                    },
                    "dropOff": {
                        "location": {
                            "code": "AMS",
                            "description": "SCHIPHOL AIRPORT"
                        },
                        "dateTime": "2023-07-20 11:30"
                    }
                },
                {
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    },
                    "currency": "EUR",
                    "segments": [
                        {
                            "id": "IB372220230719",
                            "passengers": [
                                {
                                    "id": "ADULT_01",
                                    "amount": 8,
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    }
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            }
                        }
                    ],
                    "priceFrom": 8,
                    "type": "PRIORITY_BOARDING"
                },
                {
                    "status": {
                        "code": "NOT_AVAILABLE",
                        "reason": null
                    },
                    "currency": "EUR",
                    "segments": [
                        {
                            "status": {
                                "code": "NOT_AVAILABLE",
                                "reason": "SML_AVAIL_ERR_0004"
                            },
                            "id": "IB372220230719",
                            "passengers": [
                                "ADULT_01"
                            ],
                            "segmentPassengers": [
                                {
                                    "passengerId": "ADULT_01",
                                    "priceFrom": 0
                                }
                            ]
                        }
                    ],
                    "specialMeals": [
                        {
                            "code": "BBML",
                            "name": "Baby Meal",
                            "description": "special.meals.ssr.description.BBML"
                        },
                        {
                            "code": "CHML",
                            "name": "Child Meal",
                            "description": "special.meals.ssr.description.CHML"
                        },
                        {
                            "code": "HNML",
                            "name": "Hindu (non vegetarian) Meal specific",
                            "description": "special.meals.ssr.description.HNML"
                        },
                        {
                            "code": "KSML",
                            "name": "Kosher Meal",
                            "description": "special.meals.ssr.description.KSML"
                        },
                        {
                            "code": "MOML",
                            "name": "Moslem Meal",
                            "description": "special.meals.ssr.description.MOML"
                        },
                        {
                            "code": "AVML",
                            "name": "Asiatic Vegetarian Meal",
                            "description": "special.meals.ssr.description.AVML"
                        },
                        {
                            "code": "VGML",
                            "name": "Vegetarian vegan Meal",
                            "description": "special.meals.ssr.description.VGML"
                        },
                        {
                            "code": "DBML",
                            "name": "Diabetic Meal",
                            "description": "special.meals.ssr.description.DBML"
                        },
                        {
                            "code": "GFML",
                            "name": "Gluten intolerant Meal",
                            "description": "special.meals.ssr.description.GFML"
                        },
                        {
                            "code": "LFML",
                            "name": "Low fat Meal",
                            "description": "special.meals.ssr.description.LFML"
                        },
                        {
                            "code": "LCML",
                            "name": "Low calorie Meal",
                            "description": "special.meals.ssr.description.LCML"
                        },
                        {
                            "code": "NLML",
                            "name": "Low lactose Meal",
                            "description": "special.meals.ssr.description.NLML"
                        },
                        {
                            "code": "LSML",
                            "name": "Low salt Meal",
                            "description": "special.meals.ssr.description.LSML"
                        },
                        {
                            "code": "VLML",
                            "name": "Vegetarian lacto-ovo Meal",
                            "description": "special.meals.ssr.description.VLML"
                        }
                    ],
                    "type": "SPECIAL_MEALS"
                },
                {
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    },
                    "currency": "EUR",
                    "segments": [
                        {
                            "id": "IB372220230719",
                            "passengers": [
                                {
                                    "id": "ADULT_01",
                                    "priceFrom": 8
                                }
                            ],
                            "pricesProvider": "TARIFICATOR",
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            }
                        }
                    ],
                    "reasonForIssuance": {
                        "code": "A",
                        "subcode": "0B5"
                    },
                    "type": "SEAT"
                },
                {
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    },
                    "currency": "EUR",
                    "slices": [
                        {
                            "id": "MADAMS20230719084500",
                            "passengers": [
                                {
                                    "id": "ADULT_01",
                                    "maxAdditionalPieces": 9,
                                    "pieces": [
                                        {
                                            "subtype": "BAGGAGE_15",
                                            "description": "com.ib.captwo.ass.fass.baggage.subtype.description.BAGGAGE_15",
                                            "extraPieces": null,
                                            "reasonForIssuance": {
                                                "code": "C",
                                                "subcode": "0LM"
                                            },
                                            "franchisePieces": 0,
                                            "purchasedPieces": 0,
                                            "maxAdditionalSubtypePieces": 9,
                                            "availablePriceRanges": [
                                                {
                                                    "amount": 25,
                                                    "airportAmount": 25,
                                                    "from": 1,
                                                    "to": 9
                                                }
                                            ],
                                            "status": {
                                                "code": "AVAILABLE",
                                                "reason": null
                                            }
                                        },
                                        {
                                            "subtype": "BAGGAGE_23",
                                            "description": "com.ib.captwo.ass.fass.baggage.subtype.description.BAGGAGE_23",
                                            "extraPieces": null,
                                            "reasonForIssuance": {
                                                "code": "C",
                                                "subcode": "0GO"
                                            },
                                            "franchisePieces": 0,
                                            "purchasedPieces": 0,
                                            "maxAdditionalSubtypePieces": 9,
                                            "availablePriceRanges": [
                                                {
                                                    "amount": 32,
                                                    "airportAmount": 32,
                                                    "from": 1,
                                                    "to": 1
                                                },
                                                {
                                                    "amount": 37,
                                                    "airportAmount": 37,
                                                    "from": 2,
                                                    "to": 9
                                                }
                                            ],
                                            "status": {
                                                "code": "AVAILABLE",
                                                "reason": null
                                            }
                                        },
                                        {
                                            "subtype": "BAGGAGE_32",
                                            "description": "com.ib.captwo.ass.fass.baggage.subtype.description.BAGGAGE_32",
                                            "extraPieces": null,
                                            "reasonForIssuance": {
                                                "code": "C",
                                                "subcode": "0FM"
                                            },
                                            "franchisePieces": 0,
                                            "purchasedPieces": 0,
                                            "maxAdditionalSubtypePieces": 9,
                                            "availablePriceRanges": [
                                                {
                                                    "amount": 63,
                                                    "airportAmount": 63,
                                                    "from": 1,
                                                    "to": 9
                                                }
                                            ],
                                            "status": {
                                                "code": "AVAILABLE",
                                                "reason": null
                                            }
                                        }
                                    ]
                                }
                            ],
                            "pricesProvider": "TARIFICATOR",
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            }
                        }
                    ],
                    "priceFrom": 25,
                    "type": "BAGGAGE"
                },
                {
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    },
                    "currency": "EUR",
                    "slices": [
                        {
                            "id": "MADAMS20230719084500",
                            "passengers": [
                                {
                                    "id": "ADULT_01",
                                    "maxAdditionalPieces": 3,
                                    "pieces": [
                                        {
                                            "subtype": "SKI_SNOW",
                                            "description": "com.ib.captwo.ass.fass.baggage.subtype.description.SKI_SNOW",
                                            "extraPieces": null,
                                            "reasonForIssuance": {
                                                "code": "C",
                                                "subcode": "0DD"
                                            },
                                            "franchisePieces": 0,
                                            "purchasedPieces": 0,
                                            "maxAdditionalSubtypePieces": 3,
                                            "availablePriceRanges": [
                                                {
                                                    "amount": 40,
                                                    "airportAmount": 40,
                                                    "from": 1,
                                                    "to": 3
                                                }
                                            ],
                                            "status": {
                                                "code": "AVAILABLE",
                                                "reason": null
                                            }
                                        },
                                        {
                                            "subtype": "GOLF_EQUIPMENT",
                                            "description": "com.ib.captwo.ass.fass.baggage.subtype.description.GOLF_EQUIPMENT",
                                            "extraPieces": null,
                                            "reasonForIssuance": {
                                                "code": "C",
                                                "subcode": "0D4"
                                            },
                                            "franchisePieces": 0,
                                            "purchasedPieces": 0,
                                            "maxAdditionalSubtypePieces": 3,
                                            "availablePriceRanges": [
                                                {
                                                    "amount": 40,
                                                    "airportAmount": 40,
                                                    "from": 1,
                                                    "to": 3
                                                }
                                            ],
                                            "status": {
                                                "code": "AVAILABLE",
                                                "reason": null
                                            }
                                        },
                                        {
                                            "subtype": "BICYCLE",
                                            "description": "com.ib.captwo.ass.fass.baggage.subtype.description.BICYCLE",
                                            "extraPieces": null,
                                            "reasonForIssuance": {
                                                "code": "C",
                                                "subcode": "0EC"
                                            },
                                            "franchisePieces": 0,
                                            "purchasedPieces": 0,
                                            "maxAdditionalSubtypePieces": 3,
                                            "availablePriceRanges": [
                                                {
                                                    "amount": 50,
                                                    "airportAmount": 50,
                                                    "from": 1,
                                                    "to": 3
                                                }
                                            ],
                                            "status": {
                                                "code": "AVAILABLE",
                                                "reason": null
                                            }
                                        }
                                    ]
                                }
                            ],
                            "pricesProvider": "TARIFICATOR",
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            }
                        }
                    ],
                    "priceFrom": 40,
                    "type": "SPECIAL_EQUIPMENT"
                }
            ]
        },
        summaryInfo: {
            "currencies": [
                {
                    "code": "EUR",
                    "description": "Euro",
                    "symbol": "€",
                    "alignment": "R",
                    "groupingSeparator": ",",
                    "decimalSeparator": ".",
                    "decimals": 2,
                    "recommendedDisplay": "symbol"
                }
            ],
            "context": {
                "issueOffice": "MAD175",
                "locator": "K5FCC",
                "paymentMode": "ONLINE",
                "passengers": [
                    {
                        "id": "ADULT_01",
                        "surname": "LONGA",
                        "name": "JUAN",
                        "ticketPrices": [
                            {
                                "currency": "EUR",
                                "tourCode": null,
                                "number": "",
                                "tax": 18.38,
                                "fare": 63,
                                "total": 81.38
                            }
                        ],
                        "birthDate": null,
                        "frequentFlyer": null,
                        "passengerType": "ADULT",
                        "items": [],
                        "title": null,
                        "infant": null,
                        "resiberId": "1"
                    }
                ],
                "checkinFlowMode": "REGULAR",
                "slices": [
                    {
                        "id": "MADAMS20230719084500",
                        "segmentIds": [
                            "IB372220230719"
                        ]
                    }
                ],
                "issueCurrency": "EUR",
                "issueCountry": "ES",
                "segments": [
                    {
                        "departureDate": "2023-07-19 08:45",
                        "arrivalDate": "2023-07-19 11:30",
                        "utcDepartureDate": "2023-07-19 06:45",
                        "utcArrivalDate": "2023-07-19 09:30",
                        "departureAirport": "MAD",
                        "arrivalAirport": "AMS",
                        "operatingFlight": {
                            "flightNumber": "3722",
                            "cabin": {
                                "cabinClass": {
                                    "type": "ECONOMY",
                                    "rbd": "N"
                                },
                                "carrier": "I2"
                            }
                        },
                        "marketingFlight": {
                            "flightNumber": "3722",
                            "cabin": {
                                "cabinClass": {
                                    "type": "ECONOMY",
                                    "rbd": "N"
                                },
                                "carrier": "IB"
                            }
                        },
                        "id": "IB372220230719",
                        "time": "BKI",
                        "passengerCoupons": [
                            {
                                "id": "ADULT_01",
                                "coupon": "",
                                "farebasis": "NWNNEOB2",
                                "numberTicket": "",
                                "ticketDesignator": "XX02",
                                "issueDate": null,
                                "seat": null,
                                "infantCoupon": null,
                                "eligible": true,
                                "franchisePieces": [],
                                "extraPieces": [],
                                "status": {
                                    "message": "CHECKABLE",
                                    "code": "CHECKABLE"
                                }
                            }
                        ],
                        "edifact": false,
                        "pricesProvider": "TARIFICATOR",
                        "flown": false,
                        "haul": "MH",
                        "upgAvios": false
                    }
                ],
                "flownSegments": false,
                "dynamicPricing": true,
                "bookingDate": "2023-01-26 16:39",
                "offer": null
            },
            "freeItems": [],
            "pendingPaymentItems": [],
            "pendingIssuanceItems": [],
            "issuedItems": [],
            "voucherDiscount": null
        },
        currency: {
            "suffixSymbol": true,
            "decimalSeparator": ".",
            "numberDecimals": 2,
            "groupingSeparator": ",",
            "currencySymbol": "€",
            "description": "Euro"
        },
        transformedInfo: {
            "ancillariesAvailable": [
                "FLEXIBILITY_ON_DEMAND",
                "PRIORITY_BOARDING",
                "BAGGAGE"
            ],
            "currency": {
                "suffixSymbol": true,
                "decimalSeparator": ".",
                "numberDecimals": 2,
                "groupingSeparator": ",",
                "currencySymbol": "€",
                "description": "Euro"
            },
            "isCurrencyLong": false,
            "pendingSeats": false,
            "isPaFlow": null,
            "baggageAvailable": true,
            "passengerBaggagesTrips": [
                {
                    "id": "ADULT_01",
                    "trips": [
                        {
                            "id": "MADAMS20230719084500",
                            "pieces": [
                                {
                                    "subtype": "BAGGAGE_15",
                                    "description": "15kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0LM"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 25,
                                            "airportAmount": 25,
                                            "from": 1,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                },
                                {
                                    "subtype": "BAGGAGE_23",
                                    "description": "23kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0GO"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 32,
                                            "airportAmount": 32,
                                            "from": 1,
                                            "to": 1
                                        },
                                        {
                                            "amount": 37,
                                            "airportAmount": 37,
                                            "from": 2,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                },
                                {
                                    "subtype": "BAGGAGE_32",
                                    "description": "32kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0FM"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 55,
                                            "airportAmount": 55,
                                            "from": 1,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                }
                            ],
                            "maxAdditionalPieces": 9,
                            "piecesChoosed": 0,
                            "totalPrice": 0,
                            "totalBaggages": 0,
                            "departure": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "Spain"
                                }
                            },
                            "arrival": {
                                "code": "AMS",
                                "description": "Amsterdam",
                                "country": {
                                    "code": "NL",
                                    "description": "Netherlands"
                                }
                            },
                            "text": null
                        }
                    ],
                    "info": {
                        "name": "juan",
                        "surname": "longa",
                        "infant": null
                    }
                }
            ],
            "baggageAvailablePrice": {
                "priceFrom": "25€"
            },
            "flexibilizationInfo": {
                "currency": "EUR",
                "info": [
                    {
                        "description": "One free flight change",
                        "total": 10,
                        "passengerPrices": [
                            {
                                "id": "ADULT_01",
                                "amount": 10
                            }
                        ],
                        "status": {
                            "code": "AVAILABLE",
                            "reason": null
                        },
                        "subtype": "FLIGHT_CHANGE",
                        "priceFormatted": "10.00€"
                    },
                    {
                        "description": "Refund in the form of a voucher",
                        "total": 28,
                        "passengerPrices": [
                            {
                                "id": "ADULT_01",
                                "amount": 28
                            }
                        ],
                        "status": {
                            "code": "AVAILABLE",
                            "reason": null
                        },
                        "percentage": 80,
                        "subtype": "VOUCHER_REFUND",
                        "priceFormatted": "28.00€"
                    },
                    {
                        "description": "Flexibility Pack",
                        "total": 33,
                        "passengerPrices": [
                            {
                                "id": "ADULT_01",
                                "amount": 33
                            }
                        ],
                        "status": {
                            "code": "AVAILABLE",
                            "reason": null
                        },
                        "percentage": 80,
                        "discount": 15,
                        "subtype": "FLEXIBILITY_PACK",
                        "priceFormatted": "33.00€"
                    }
                ],
                "priceFrom": 10,
                "cardPriceFormatted": "10€",
                "status": {
                    "code": "AVAILABLE",
                    "reason": null
                },
                "type": "FLEXIBILITY_ON_DEMAND",
                "name": "requestFlex",
                "cardCols": "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6",
                "cardType": "ib-box-card--type-3",
                "cardImg": {
                    "src": "ancillaries_nuevas/flexibilidad.svg",
                    "text": "ANCILLARIES_FLEXIBILITY_CARDIMG_TEXT"
                },
                "cardTitle": "ANCILLARIES_FLEXIBILITY_CARDTITLE",
                "cardText": "ANCILLARIES_FLEXIBILITY_CARDTEXT",
                "cardSubtext": "ANCILLARIES_FLEXIBILITY_CARDSUBTEXT",
                "cardSubtextSelect": "ANCILLARIES_FLEXIBILITY_CARDSUBTEXT_SELECT",
                "cardButton": {
                    "text": "BUTTON_ADD_TEXT",
                    "altText": "MODAL_BUTTON_MODIFY_TEXT"
                },
                "confirmed": false,
                "selectedFlex": null,
                "modal": {
                    "template": "ib-onrequest-flexibilization.html",
                    "classes": "ib-modals ib-modals--full-mobile ib-modals--no-padding ib-modals--right fade"
                },
                "datalayer": "elegir flexilidad a la carta"
            },
            "flags": {
                "showBannerConfort": false,
                "showBannerResident": false
            },
            "preorderAncillarieInfo": {},
            "priorityBoardingInfo": {
                "currency": "EUR",
                "info": [
                    {
                        "id": "ADULT_01",
                        "trips": [
                            {
                                "id": "IB372220230719",
                                "amount": 8,
                                "tripPrice": "8.00€",
                                "checkedTrip": false,
                                "onlySliceInfo": true,
                                "status": "AVAILABLE",
                                "departure": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "Spain"
                                    }
                                },
                                "arrival": {
                                    "code": "AMS",
                                    "description": "Amsterdam",
                                    "countryCode": "NL",
                                    "country": {
                                        "code": "NL",
                                        "description": "Netherlands"
                                    }
                                }
                            }
                        ],
                        "passengerType": "ADULT",
                        "info": {
                            "name": "juan",
                            "surname": "longa",
                            "infant": null
                        }
                    }
                ],
                "priceFrom": 8,
                "cardPriceFormatted": "8€",
                "status": {
                    "code": "AVAILABLE",
                    "reason": null
                },
                "type": "PRIORITY_BOARDING",
                "name": "priorityBoarding",
                "cardCols": "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6",
                "cardType": "ib-box-card--type-3",
                "cardImg": {
                    "src": "ancillaries_nuevas/prioridad-de-embarque.svg",
                    "text": "PRIORITY_BOARDING_TITLE"
                },
                "cardTitle": "PRIORITY_BOARDING_TITLE",
                "cardText": "ANCILLARIES_PRIORITY_BOARDING_CARDTEXT",
                "cardSubtext": "",
                "cardSubtextSelect": "ANCILLARIES_PRIORITY_BOARDING_CARDSUBTEXT_SELECT",
                "cardButton": {
                    "text": "BUTTON_ADD_TEXT",
                    "altText": "MODAL_BUTTON_MODIFY_TEXT"
                },
                "confirmed": false,
                "selectedPriorityBoarding": null,
                "modal": {
                    "template": "ib-modal-priority-boarding.html",
                    "classes": "ib-modals ib-modals--full-mobile ib-modals--no-padding ib-modals--right fade"
                },
                "datalayer": "elegir priority boarding"
            },
            "baggagesQuanty": 0
        },
        transformedAncillariesInfo: {
            "ancillariesAvailable": [
                "FLEXIBILITY_ON_DEMAND",
                "PRIORITY_BOARDING",
                "BAGGAGE",
                "SEAT",
                "SPECIAL_EQUIPMENT"
            ],
            "ancillariesTrips": [],
            "ancillariesInsurance": [],
            "insuranceInfo": {
                "countriesList": [],
                "insuranceCountry": null,
                "id": null,
                "price": null,
                "priceZero": null,
                "originalPrice": null,
                "passengers": [
                    {
                        "passengerType": "ADULT",
                        "personalInfo": {
                            "name": "juan",
                            "surname": "longa",
                            "lastSurname": "",
                            "infant": null
                        },
                        "passengerId": "ADULT_01",
                        "seat": null,
                        "resiberId": "1"
                    }
                ],
                "conditionsUri": "",
                "isModalLoading": false,
                "countryInsurance": "",
                "insurancePatterns": {},
                "consent": "",
                "issueCountry": null,
                "oldInsuranceCountry": null
            },
            "seatsAvailable": {
                "status": true,
                "priceFrom": "8€"
            },
            "insuranceAvailable": false,
            "bobAvailable": false,
            "bobInfo": {
                "slices": [],
                "priceFrom": "",
                "additionalBagsPrice": ""
            },
            "currency": {
                "suffixSymbol": true,
                "decimalSeparator": ".",
                "numberDecimals": 2,
                "groupingSeparator": ",",
                "currencySymbol": "€",
                "description": "Euro"
            },
            "ancillariesSpeqs": [
                {
                    "id": "ADULT_01",
                    "trips": [
                        {
                            "id": "MADAMS20230719084500",
                            "pieces": [
                                {
                                    "subtype": "BICYCLE",
                                    "description": "Bicycles",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0EC"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 3,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 50,
                                            "airportAmount": 50,
                                            "from": 1,
                                            "to": 3,
                                            "amountPrice": "50€"
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                },
                                {
                                    "subtype": "GOLF_EQUIPMENT",
                                    "description": "Golf equipment",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0D4"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 3,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 40,
                                            "airportAmount": 40,
                                            "from": 1,
                                            "to": 3,
                                            "amountPrice": "40€"
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                },
                                {
                                    "subtype": "SKI_SNOW",
                                    "description": "Skis/Snowboard",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0DD"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 3,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 40,
                                            "airportAmount": 40,
                                            "from": 1,
                                            "to": 3,
                                            "amountPrice": "40€"
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                }
                            ],
                            "maxAdditionalPieces": 3,
                            "speqsChoosed": 0,
                            "totalPrice": 0,
                            "departure": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "Spain"
                                }
                            },
                            "arrival": {
                                "code": "AMS",
                                "description": "Amsterdam",
                                "country": {
                                    "code": "NL",
                                    "description": "Netherlands"
                                }
                            },
                            "text": null
                        }
                    ],
                    "info": {
                        "name": "juan",
                        "surname": "longa",
                        "infant": null
                    }
                }
            ],
            "speqsAvailablePrice": {
                "priceFrom": "40€"
            },
            "speqsQuanty": 0,
            "ancillariesCarbonFootprint": {
                "price": null,
                "kilosCo2Equivalent": null,
                "priceFrom": null,
                "kilosCo2EquivalentFormatted": ""
            },
            "isCurrencyLong": false,
            "pendingSeats": false,
            "isPaFlow": null,
            "baggageAvailable": true,
            "passengerBaggagesTrips": [
                {
                    "id": "ADULT_01",
                    "trips": [
                        {
                            "id": "MADAMS20230719084500",
                            "pieces": [
                                {
                                    "subtype": "BAGGAGE_15",
                                    "description": "15kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0LM"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 25,
                                            "airportAmount": 25,
                                            "from": 1,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                },
                                {
                                    "subtype": "BAGGAGE_23",
                                    "description": "23kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0GO"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 32,
                                            "airportAmount": 32,
                                            "from": 1,
                                            "to": 1
                                        },
                                        {
                                            "amount": 37,
                                            "airportAmount": 37,
                                            "from": 2,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                },
                                {
                                    "subtype": "BAGGAGE_32",
                                    "description": "32kg",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0FM"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 9,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 55,
                                            "airportAmount": 55,
                                            "from": 1,
                                            "to": 9
                                        }
                                    ],
                                    "status": {
                                        "code": "AVAILABLE",
                                        "reason": null
                                    },
                                    "quantySelected": 0
                                }
                            ],
                            "maxAdditionalPieces": 9,
                            "piecesChoosed": 0,
                            "totalPrice": 0,
                            "totalBaggages": 0,
                            "departure": {
                                "code": "MAD",
                                "description": "Madrid",
                                "country": {
                                    "code": "ES",
                                    "description": "Spain"
                                }
                            },
                            "arrival": {
                                "code": "AMS",
                                "description": "Amsterdam",
                                "country": {
                                    "code": "NL",
                                    "description": "Netherlands"
                                }
                            },
                            "text": null
                        }
                    ],
                    "info": {
                        "name": "juan",
                        "surname": "longa",
                        "infant": null
                    }
                }
            ],
            "baggageAvailablePrice": {
                "priceFrom": "25€"
            },
            "flexibilizationInfo": {
                "currency": "EUR",
                "info": [
                    {
                        "description": "One free flight change",
                        "total": 10,
                        "passengerPrices": [
                            {
                                "id": "ADULT_01",
                                "amount": 10
                            }
                        ],
                        "status": {
                            "code": "AVAILABLE",
                            "reason": null
                        },
                        "subtype": "FLIGHT_CHANGE",
                        "priceFormatted": "10.00€"
                    },
                    {
                        "description": "Refund in the form of a voucher",
                        "total": 28,
                        "passengerPrices": [
                            {
                                "id": "ADULT_01",
                                "amount": 28
                            }
                        ],
                        "status": {
                            "code": "AVAILABLE",
                            "reason": null
                        },
                        "percentage": 80,
                        "subtype": "VOUCHER_REFUND",
                        "priceFormatted": "28.00€"
                    },
                    {
                        "description": "Flexibility Pack",
                        "total": 33,
                        "passengerPrices": [
                            {
                                "id": "ADULT_01",
                                "amount": 33
                            }
                        ],
                        "status": {
                            "code": "AVAILABLE",
                            "reason": null
                        },
                        "percentage": 80,
                        "discount": 15,
                        "subtype": "FLEXIBILITY_PACK",
                        "priceFormatted": "33.00€"
                    }
                ],
                "priceFrom": 10,
                "cardPriceFormatted": "10€",
                "status": {
                    "code": "AVAILABLE",
                    "reason": null
                },
                "type": "FLEXIBILITY_ON_DEMAND",
                "name": "requestFlex",
                "cardCols": "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6",
                "cardType": "ib-box-card--type-3",
                "cardImg": {
                    "src": "ancillaries_nuevas/flexibilidad.svg",
                    "text": "ANCILLARIES_FLEXIBILITY_CARDIMG_TEXT"
                },
                "cardTitle": "ANCILLARIES_FLEXIBILITY_CARDTITLE",
                "cardText": "ANCILLARIES_FLEXIBILITY_CARDTEXT",
                "cardSubtext": "ANCILLARIES_FLEXIBILITY_CARDSUBTEXT",
                "cardSubtextSelect": "ANCILLARIES_FLEXIBILITY_CARDSUBTEXT_SELECT",
                "cardButton": {
                    "text": "BUTTON_ADD_TEXT",
                    "altText": "MODAL_BUTTON_MODIFY_TEXT"
                },
                "confirmed": false,
                "selectedFlex": null,
                "modal": {
                    "template": "ib-onrequest-flexibilization.html",
                    "classes": "ib-modals ib-modals--full-mobile ib-modals--no-padding ib-modals--right fade"
                },
                "datalayer": "elegir flexilidad a la carta"
            },
            "flags": {
                "showBannerConfort": false,
                "showBannerResident": false
            },
            "preorderAncillarieInfo": {},
            "priorityBoardingInfo": {
                "currency": "EUR",
                "info": [
                    {
                        "id": "ADULT_01",
                        "trips": [
                            {
                                "id": "IB372220230719",
                                "amount": 8,
                                "tripPrice": "8.00€",
                                "checkedTrip": false,
                                "onlySliceInfo": true,
                                "status": "AVAILABLE",
                                "departure": {
                                    "code": "MAD",
                                    "description": "Madrid",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "Spain"
                                    }
                                },
                                "arrival": {
                                    "code": "AMS",
                                    "description": "Amsterdam",
                                    "countryCode": "NL",
                                    "country": {
                                        "code": "NL",
                                        "description": "Netherlands"
                                    }
                                }
                            }
                        ],
                        "passengerType": "ADULT",
                        "info": {
                            "name": "juan",
                            "surname": "longa",
                            "infant": null
                        }
                    }
                ],
                "priceFrom": 8,
                "cardPriceFormatted": "8€",
                "status": {
                    "code": "AVAILABLE",
                    "reason": null
                },
                "type": "PRIORITY_BOARDING",
                "name": "priorityBoarding",
                "cardCols": "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6",
                "cardType": "ib-box-card--type-3",
                "cardImg": {
                    "src": "ancillaries_nuevas/prioridad-de-embarque.svg",
                    "text": "PRIORITY_BOARDING_TITLE"
                },
                "cardTitle": "PRIORITY_BOARDING_TITLE",
                "cardText": "ANCILLARIES_PRIORITY_BOARDING_CARDTEXT",
                "cardSubtext": "",
                "cardSubtextSelect": "ANCILLARIES_PRIORITY_BOARDING_CARDSUBTEXT_SELECT",
                "cardButton": {
                    "text": "BUTTON_ADD_TEXT",
                    "altText": "MODAL_BUTTON_MODIFY_TEXT"
                },
                "confirmed": false,
                "selectedPriorityBoarding": null,
                "modal": {
                    "template": "ib-modal-priority-boarding.html",
                    "classes": "ib-modals ib-modals--full-mobile ib-modals--no-padding ib-modals--right fade"
                },
                "datalayer": "elegir priority boarding"
            },
            "baggagesQuanty": 0,
            "seatsQuanty": 0
        },
        cachedDataInfo: {
            "passengers": [
                {
                    "passengerType": "ADULT",
                    "personalInfo": {
                        "name": "juan",
                        "surname": "longa",
                        "lastSurname": "",
                        "infant": null
                    },
                    "passengerId": "ADULT_01",
                    "seat": null,
                    "resiberId": "1"
                }
            ],
            "order": {
                "orderId": "Qm9va2luZ0BJQmJkMWY5ODBkNWNkYjRjOGVhNmRkYjc2NDZkYTczNmRiT1A%3D",
                "bookingReferences": [
                    {
                        "provider": "IB",
                        "reference": "K5FGF"
                    }
                ],
                "orderItems": [
                    {
                        "type": "flight",
                        "orderItemId": "IBbd1f980d5cdb4c8ea6ddb7646da736dbOP_01",
                        "bookingReferences": [
                            {
                                "provider": "IB",
                                "reference": "K5FGF"
                            }
                        ],
                        "price": {
                            "fare": 63,
                            "tax": 18.38,
                            "total": 81.38,
                            "currency": "EUR",
                            "ticketingFee": 0
                        },
                        "sliceIds": [
                            "MADAMS20230719084500"
                        ],
                        "passengerPrices": [
                            {
                                "fareCalculation": "MAD IB AMS65.96NUC65.96END ROE0.950867",
                                "passengerId": "ADULT_01",
                                "price": {
                                    "fare": 63,
                                    "tax": 18.38,
                                    "total": 81.38,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                },
                                "segmentPrices": [
                                    {
                                        "price": {
                                            "fare": 63,
                                            "currency": "EUR"
                                        },
                                        "fareCode": "NWNNEOB2",
                                        "segmentsIds": [
                                            "IB372220230719"
                                        ],
                                        "ticketDesignator": "XX02",
                                        "penalties": [
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
                                                "nonrefundable": true,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": false,
                                                "isChangeable": false
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
                                                "nonrefundable": true,
                                                "cancelFeeInd": false,
                                                "changeFeeInd": false,
                                                "isRefundable": false,
                                                "isChangeable": false
                                            }
                                        ],
                                        "penaltyFlags": null
                                    }
                                ],
                                "taxes": [
                                    {
                                        "code": "JD",
                                        "amount": 14.48,
                                        "currency": "EUR",
                                        "description": "Departure Charge",
                                        "subcode": null,
                                        "country": null,
                                        "carrier": null
                                    },
                                    {
                                        "code": "OG",
                                        "amount": 0.63,
                                        "currency": "EUR",
                                        "description": "Security Tax",
                                        "subcode": null,
                                        "country": null,
                                        "carrier": null
                                    },
                                    {
                                        "code": "QV",
                                        "amount": 3.27,
                                        "currency": "EUR",
                                        "description": "Security",
                                        "subcode": null,
                                        "country": null,
                                        "carrier": null
                                    }
                                ],
                                "passengerDiscount": null
                            }
                        ]
                    }
                ],
                "price": {
                    "fare": 63,
                    "tax": 18.38,
                    "total": 81.38,
                    "currency": "EUR",
                    "ticketingFee": 0
                },
                "bookingOffice": "MAD175",
                "slices": [
                    {
                        "id": "MADAMS20230719084500",
                        "departureDateTime": "2023-07-19 08:45",
                        "arrivalDateTime": "2023-07-19 11:30",
                        "duration": 165,
                        "stopsNumber": 0,
                        "price": {
                            "fare": 63,
                            "currency": "EUR"
                        },
                        "detailedPrices": [
                            {
                                "fare": 63,
                                "currency": "EUR",
                                "passengerIds": [
                                    "ADULT_01"
                                ],
                                "segmentPrices": [
                                    {
                                        "price": {
                                            "fare": 63,
                                            "currency": "EUR"
                                        },
                                        "fareCode": "NWNNEOB2",
                                        "segmentsIds": [
                                            "IB372220230719"
                                        ],
                                        "ticketDesignator": "XX02",
                                        "penalties": [],
                                        "penaltyFlags": null
                                    }
                                ]
                            }
                        ],
                        "overnight": false,
                        "segments": [
                            {
                                "id": "IB372220230719",
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
                                            "description": "Spain"
                                        }
                                    }
                                },
                                "arrival": {
                                    "code": "AMS",
                                    "name": "Amsterdam Schiphol Airport",
                                    "terminal": null,
                                    "city": {
                                        "code": "AMS",
                                        "description": "Amsterdam",
                                        "countryCode": "NL",
                                        "country": {
                                            "code": "NL",
                                            "description": "Netherlands"
                                        }
                                    }
                                },
                                "departureDateTime": "2023-07-19 08:45",
                                "cabin": {
                                    "code": "R",
                                    "type": "ECONOMY",
                                    "description": "Economy",
                                    "fareFamily": "TBAESEU",
                                    "mainClass": "N"
                                },
                                "flight": {
                                    "marketingCarrier": {
                                        "code": "IB",
                                        "name": "Iberia"
                                    },
                                    "operationalCarrier": {
                                        "code": "I2",
                                        "name": "Iberia Express"
                                    },
                                    "marketingFlightNumber": "3722",
                                    "operationalFlightNumber": null,
                                    "operationalDisclosure": "I2",
                                    "aircraft": {
                                        "code": "32A",
                                        "description": "Airbus A320 (Sharklets)"
                                    }
                                },
                                "duration": 165,
                                "waitingTime": 0
                            }
                        ]
                    }
                ],
                "voucherDisscount": null,
                "discountsApplied": {
                    "originalPrice": {
                        "fare": 64.29,
                        "tax": 18.38,
                        "total": 82.67,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "discounts": [
                        {
                            "type": "DYNAMIC_PRICING",
                            "description": "DYNAMIC.PRICING.discount.description",
                            "percentDiscount": 2,
                            "totalDiscount": 1.29,
                            "dynamicDiscountRuleId": "DynamicDiscount",
                            "accountCode": "660964"
                        }
                    ],
                    "originalOrderItems": [
                        {
                            "type": "flight",
                            "orderItemId": "IBbd1f980d5cdb4c8ea6ddb7646da736dbOP_01",
                            "bookingReferences": [
                                {
                                    "provider": "IB",
                                    "reference": "K5FGF"
                                }
                            ],
                            "price": {
                                "fare": 64.29,
                                "tax": 18.38,
                                "total": 82.67,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "sliceIds": [
                                "MADAMS20230719084500"
                            ],
                            "passengerPrices": [
                                {
                                    "fareCalculation": "MAD IB AMS65.96NUC65.96END ROE0.950867",
                                    "passengerId": "ADULT_01",
                                    "price": {
                                        "fare": 64.29,
                                        "tax": 18.38,
                                        "total": 82.67,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "segmentPrices": [
                                        {
                                            "price": {
                                                "fare": 63,
                                                "currency": "EUR"
                                            },
                                            "fareCode": "NWNNEOB2",
                                            "segmentsIds": [
                                                "IB372220230719"
                                            ],
                                            "ticketDesignator": "XX02",
                                            "penalties": [
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
                                                    "nonrefundable": true,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": false,
                                                    "isChangeable": false
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
                                                    "nonrefundable": true,
                                                    "cancelFeeInd": false,
                                                    "changeFeeInd": false,
                                                    "isRefundable": false,
                                                    "isChangeable": false
                                                }
                                            ],
                                            "penaltyFlags": null
                                        }
                                    ],
                                    "taxes": [
                                        {
                                            "code": "JD",
                                            "amount": 14.48,
                                            "currency": "EUR",
                                            "description": "Departure Charge",
                                            "subcode": null,
                                            "country": null,
                                            "carrier": null
                                        },
                                        {
                                            "code": "OG",
                                            "amount": 0.63,
                                            "currency": "EUR",
                                            "description": "Security Tax",
                                            "subcode": null,
                                            "country": null,
                                            "carrier": null
                                        },
                                        {
                                            "code": "QV",
                                            "amount": 3.27,
                                            "currency": "EUR",
                                            "description": "Security",
                                            "subcode": null,
                                            "country": null,
                                            "carrier": null
                                        }
                                    ],
                                    "orderItemPaymentInfos": []
                                }
                            ],
                            "sliceBaggage": [
                                {
                                    "sliceId": "MADAMS20230719084500",
                                    "passengersBaggage": [
                                        {
                                            "passengersId": [
                                                "ADULT_01"
                                            ],
                                            "handBaggageAllowances": [
                                                {
                                                    "baggageConcept": "PIECE",
                                                    "totalQuantity": 2
                                                }
                                            ],
                                            "baggageInHoldAllowances": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "totalDiscount": 1.29
                }
            },
            "fareFamilyConditions": [
                {
                    "cabinType": "E",
                    "cabinDescription": "Economy",
                    "commercialCode": "TBAESEU",
                    "commercialName": "Basic",
                    "commercialNameES": "Básica",
                    "priority": 900,
                    "conditions": [
                        {
                            "code": "CABINA",
                            "name": " Cabin",
                            "text": "Economy.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Economy Cabin",
                                "message": "Economy.",
                                "code": "CA_Cabina_Turista",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Economy"
                            }
                        },
                        {
                            "code": "EQMANO",
                            "name": "Hand baggage",
                            "text": "1 item max. 10 kg (56x40x25cm) included.",
                            "units": 1,
                            "extendedInfo": {
                                "title": "Hand luggage: 1 item",
                                "message": "1 personal accessory and 1 item max. 10 kg (56x40x25cm) included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator. ",
                                "code": "CA_EQP_MANO_10KG",
                                "conditionStatus": true,
                                "observationCode": "2",
                                "mobileMessage": "1 piece (56x40x25cm)"
                            }
                        },
                        {
                            "code": "EQBODEGA",
                            "name": "Baggage in hold",
                            "text": "With a fee.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Checked baggage not included",
                                "message": "With a fee.",
                                "code": "CA_1_PIEZAS_PAGO",
                                "conditionStatus": false,
                                "observationCode": "1",
                                "mobileMessage": "Not included"
                            }
                        },
                        {
                            "code": "COMIDA",
                            "name": "Meal",
                            "text": "With a fee.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Meal not included ",
                                "message": "With a fee.",
                                "code": "Comida_no_incluida",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Not included"
                            }
                        },
                        {
                            "code": "ASIENTO",
                            "name": "Seat  selection",
                            "text": "With a fee.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Seat selection with a fee",
                                "message": "With a fee. ",
                                "code": "CA_Asiento_Pago",
                                "conditionStatus": false,
                                "observationCode": "3",
                                "mobileMessage": "For a fee"
                            }
                        },
                        {
                            "code": "ASIENTODELANTERO",
                            "name": "Front seat",
                            "text": "With a fee.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Front seat with a fee",
                                "message": "With a fee.",
                                "code": "CA_Asiento_Delantero_pago",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Payable"
                            }
                        },
                        {
                            "code": "ASIENTOXL",
                            "name": "Selection of an XL seat",
                            "text": "With a fee, with some exceptions.",
                            "units": null,
                            "extendedInfo": {
                                "title": "XL seat with a fee",
                                "message": "With a fee on flights operated by Iberia, Iberia Express and Iberia Regional Air Nostrum. And without a fee on flights operated by British Airways.",
                                "code": "CA_Asiento_XL_Pago",
                                "conditionStatus": false,
                                "observationCode": "3",
                                "mobileMessage": "Payable"
                            }
                        },
                        {
                            "code": "EMBARQUE",
                            "name": "Priority Boarding ",
                            "text": "Not included.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Priority boarding not included",
                                "message": "Not included.",
                                "code": "CA_Embarque_NO_Prioritario",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "CAMBIO",
                            "name": "Change",
                            "text": "Allowed with a fee; not allowed for no-shows.",
                            "units": 65,
                            "extendedInfo": {
                                "title": "Flight change with a fee",
                                "message": "Allowed with a fee of EUR 65. Not allowed for no-shows.",
                                "code": "CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Allowed with a fee; not allowed for no-shows."
                            }
                        },
                        {
                            "code": "REEMBOLSO",
                            "name": "refund (in each direction)",
                            "text": "Not allowed.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Not allowed",
                                "message": "Not allowed.",
                                "code": "CA_REEMBOLSO NO PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No refunds"
                            }
                        },
                        {
                            "code": "TARJEMBANTIC",
                            "name": "Early check-in",
                            "text": "Not included.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Early boarding pass not included",
                                "message": "Not included. ",
                                "code": "CA_Tarjeta_embarque_anticipada_no_incluido",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Not included"
                            }
                        },
                        {
                            "code": "CHECKINDESK",
                            "name": "Exclusive check-in counter",
                            "text": "Not included.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Exclusive check-in desk not included",
                                "message": "Not included.",
                                "code": "Chek-in_desk_ NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "SALAVIP",
                            "name": "Access to VIP lounges",
                            "text": "Access not included.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Access to VIP Lounge not included",
                                "message": "Access not included.",
                                "code": "Acceso a salas VIP No permitido",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "FASTTRACK",
                            "name": "Fast Track",
                            "text": "Not included.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Fast Track not included",
                                "message": "Not included.",
                                "code": "Fast Track NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "EQPPRIOR",
                            "name": "Priority baggage delivery",
                            "text": "With a fee.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Fast bag drop not included",
                                "message": "With a fee.",
                                "code": "Entrega_prioritaria_equipaje_ NO",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "No"
                            }
                        },
                        {
                            "code": "AVIO",
                            "name": "STANDARD",
                            "text": "Included.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Avios awarded with purchase",
                                "message": "Included.  ",
                                "code": "AVIOS incluido",
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "Yes"
                            }
                        },
                        {
                            "code": "WIFI",
                            "name": "WiFi",
                            "text": "Available with a fee, depending on aircraft type.",
                            "units": null,
                            "extendedInfo": {
                                "title": "",
                                "message": "",
                                "code": null,
                                "conditionStatus": false,
                                "observationCode": null,
                                "mobileMessage": "WiFi pago"
                            }
                        }
                    ],
                    "observations": [
                        {
                            "observationCode": 1,
                            "observationText": " <a href=\"https://www.iberia.com/web/obsmenu.do?quadrigam=EQUFRA&menuId=EQUIDE\" class=\"links\">Consult additional baggage<span class=\"oculto\">[Abre en ventana nueva]</span></a>"
                        },
                        {
                            "observationCode": 2,
                            "observationText": "1 piece (56x40x25cm/ 14kg Business Class / 10kg Economy)+ personal belonging. Valid for flights operated by <b>one</b>world companies, for others please consult the operator\n<br/>"
                        },
                        {
                            "observationCode": 3,
                            "observationText": "<a href=\"https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE\" class=\"links\" title=\"See seat booking prices\">More information about how to pre-book your seat</a>"
                        }
                    ],
                    "conditionsPriority": [
                        "EQMANO",
                        "EQBODEGA",
                        "COMIDA",
                        "ASIENTO",
                        "ASIENTOXL",
                        "ASIENTODELANTERO",
                        "EMBARQUE",
                        "TARJEMBANTIC",
                        "CAMBIO",
                        "REEMBOLSO",
                        "CHECKINDESK",
                        "FASTTRACK"
                    ]
                }
            ],
            "outwardSegments": [
                {
                    "id": "IB372220230719",
                    "departure": {
                        "date": "2023-07-19 08:45",
                        "airport": {
                            "code": "MAD",
                            "description": "Madrid",
                            "country": {
                                "code": "ES",
                                "description": "Spain"
                            }
                        },
                        "terminal": "4"
                    },
                    "arrival": {
                        "date": "2023-07-19 11:30",
                        "airport": {
                            "code": "AMS",
                            "description": "Amsterdam",
                            "country": {
                                "code": "NL",
                                "description": "Netherlands"
                            }
                        },
                        "terminal": null
                    },
                    "cabinClass": {
                        "code": "R",
                        "type": "ECONOMY",
                        "description": "Economy",
                        "fareFamily": "TBAESEU",
                        "mainClass": "N"
                    },
                    "passengers": [
                        {
                            "passengerType": "ADULT",
                            "personalInfo": {
                                "name": "juan",
                                "surname": "longa",
                                "lastSurname": ""
                            },
                            "passengerId": "ADULT_01",
                            "seat": null
                        }
                    ],
                    "waitingTime": 0
                }
            ],
            "returnSegments": [],
            "airShuttleSegments": []
        },
        getReqAviosAncillariesSpeq: {},
        getAviosAncillariesFlex: {
            description: 'Primer cambio de vuelo gratuito',
            total: 5,
            passengerPrices: [
                {
                    id: 'ADULT_01',
                    amount: 5
                }
            ],
            status: {
                code: 'AVAILABLE',
                reason: null
            },
            subtype: 'FLIGHT_CHANGE',
            priceFormatted: '5,00€',
            $$hashKey: 'object:1140'
        },
        manageAviosModal: [
            {
                id: 'ADULT_01',
                ancillaries: [
                    {
                        type: 'BAGGAGE',
                        subType: 'BAGGAGE_23',
                        slices: [
                            {
                                id: 'MADBIO20221113074000',
                                amounts: [
                                    {
                                        fare: 18,
                                        quantity: 1
                                    }
                                ],
                                segments: [
                                    {
                                        id: 'IB044820221113'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        modalObject: {
            aviosAncillariesReq: {
                currency: {
                    code: 'EUR'
                },
                flight: {
                    discounts: [],
                    yq: 0,
                    slices: [
                        {
                            id: 'MADBIO20221113074000',
                            segments: [
                                {
                                    id: 'IB044820221113',
                                    commercialCode: null,
                                    operatingCarrier: {
                                        code: 'IB'
                                    },
                                    marketingCarrier: {
                                        code: 'IB'
                                    },
                                    schedule: {
                                        departureAirportCode: 'MAD',
                                        arrivalAirportCode: 'BIO',
                                        departureDate: '2022-11-13'
                                    },
                                    bookingClass: {
                                        code: 'A'
                                    },
                                    bookingCabin: {
                                        code: 'E'
                                    }
                                }
                            ]
                        }
                    ]
                },
                passengers: [
                    {
                        id: 'ADULT_01',
                        memberIdentifier: null,
                        ancillaries: [
                            {
                                type: 'BAGGAGE',
                                subType: 'BAGGAGE_23',
                                slices: [
                                    {
                                        id: 'MADBIO20221113074000',
                                        amounts: [
                                            {
                                                fare: 18,
                                                quantity: 1
                                            }
                                        ],
                                        segments: [
                                            {
                                                id: 'IB044820221113'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            passenger: {
                passengers: [
                    {
                        passengerType: 'ADULT',
                        personalInfo: {
                            name: 'test',
                            surname: 'test',
                            lastSurname: '',
                            infant: null
                        },
                        passengerId: 'ADULT_01',
                        seat: null,
                        resiberId: '1'
                    }
                ],
                order: {
                    orderId: 'Qm9va2luZ0BJQjIzZTk4NmIwYzgwNTRmNjZhNzkwZThiMTE0MzMyMzZmT1A%3D',
                    bookingReferences: [
                        {
                            provider: 'IB',
                            reference: 'N0MGL'
                        }
                    ],
                    orderItems: [
                        {
                            type: 'flight',
                            orderItemId: 'IB23e986b0c8054f66a790e8b11433236fOP_01',
                            bookingReferences: [
                                {
                                    provider: 'IB',
                                    reference: 'N0MGL'
                                }
                            ],
                            price: {
                                fare: 12,
                                tax: 20.22,
                                total: 32.22,
                                currency: 'EUR',
                                ticketingFee: 0
                            },
                            sliceIds: ['MADBIO20221113074000'],
                            passengerPrices: [
                                {
                                    fareCalculation: '13NOV22MAD IB BIO12.00EUR12.00END',
                                    passengerId: 'ADULT_01',
                                    price: {
                                        fare: 12,
                                        tax: 20.22,
                                        total: 32.22,
                                        currency: 'EUR',
                                        ticketingFee: 0
                                    },
                                    segmentPrices: [
                                        {
                                            price: {
                                                fare: 12,
                                                currency: 'EUR'
                                            },
                                            fareCode: 'ADNOB5',
                                            segmentsIds: ['IB044820221113'],
                                            ticketDesignator: '',
                                            penalties: [],
                                            penaltyFlags: null
                                        }
                                    ],
                                    taxes: [
                                        {
                                            code: 'JDAE',
                                            amount: 15.93,
                                            currency: 'EUR',
                                            description: 'Tasa de salida - Aeropuertos españoles/AENA',
                                            subcode: null,
                                            country: null,
                                            carrier: null
                                        },
                                        {
                                            code: 'OGCO',
                                            amount: 0.69,
                                            currency: 'EUR',
                                            description: 'Tasa de seguridad',
                                            subcode: null,
                                            country: null,
                                            carrier: null
                                        },
                                        {
                                            code: 'QVDP',
                                            amount: 3.6,
                                            currency: 'EUR',
                                            description: 'Seguridad',
                                            subcode: null,
                                            country: null,
                                            carrier: null
                                        }
                                    ],
                                    passengerDiscount: null
                                }
                            ]
                        }
                    ],
                    price: {
                        fare: 12,
                        tax: 20.22,
                        total: 32.22,
                        currency: 'EUR',
                        ticketingFee: 0
                    },
                    bookingOffice: 'MAD175',
                    slices: [
                        {
                            id: 'MADBIO20221113074000',
                            departureDateTime: '2022-11-13 07:40',
                            arrivalDateTime: '2022-11-13 08:40',
                            duration: 60,
                            stopsNumber: 0,
                            price: {
                                fare: 12,
                                currency: 'EUR'
                            },
                            detailedPrices: [
                                {
                                    fare: 12,
                                    currency: 'EUR',
                                    passengerIds: ['ADULT_01'],
                                    segmentPrices: [
                                        {
                                            price: {
                                                fare: 12,
                                                currency: 'EUR'
                                            },
                                            fareCode: 'ADNOB5',
                                            segmentsIds: ['IB044820221113'],
                                            ticketDesignator: '',
                                            penalties: [],
                                            penaltyFlags: null
                                        }
                                    ]
                                }
                            ],
                            overnight: false,
                            segments: [
                                {
                                    id: 'IB044820221113',
                                    departure: {
                                        code: 'MAD',
                                        name: 'BARAJAS',
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
                                        name: 'AIRPORT',
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
                                    departureDateTime: '2022-11-13 07:40',
                                    cabin: {
                                        code: 'R',
                                        type: 'ECONOMY',
                                        description: 'Turista',
                                        fareFamily: 'TBAESES',
                                        mainClass: 'A'
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
                                        marketingFlightNumber: '0448',
                                        operationalFlightNumber: null,
                                        operationalDisclosure: 'IB',
                                        aircraft: {
                                            code: '321',
                                            description: 'Airbus A321'
                                        }
                                    },
                                    duration: 60,
                                    waitingTime: 0
                                }
                            ]
                        }
                    ],
                    voucherDisscount: null
                },
                fareFamilyConditions: [
                    {
                        cabinType: 'E',
                        cabinDescription: 'Turista',
                        commercialCode: 'TBAESES',
                        commercialName: 'Básica',
                        commercialNameES: 'Básica',
                        priority: 900,
                        conditions: [
                            {
                                code: 'CABINA',
                                name: 'Cabina',
                                text: 'Turista',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'Turista',
                                    code: 'CA_Cabina_Turista',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            },
                            {
                                code: 'EQMANO',
                                name: 'Equipaje de mano',
                                text: '1 bulto (56x40x25cm)',
                                units: 1,
                                extendedInfo: {
                                    title: '1 bulto en cabina  (56x40x25cm)',
                                    message: '1 bulto (56x40x25cm).',
                                    code: 'CA_EQP_MANO_10KG',
                                    conditionStatus: true,
                                    observationCode: '2'
                                }
                            },
                            {
                                code: 'EQBODEGA',
                                name: 'Equipaje en bodega',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'Sin equipaje en bodega',
                                    message: 'No incluido',
                                    code: 'CA_1_PIEZAS_PAGO',
                                    conditionStatus: false,
                                    observationCode: '1'
                                }
                            },
                            {
                                code: 'ASIENTO',
                                name: 'Selección de asiento',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message:
                                        'De pago <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                                    code: 'CA_Asiento_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                }
                            },
                            {
                                code: 'ASIENTOXL',
                                name: 'Selección de asiento XL',
                                text: 'De pago',
                                units: null,
                                extendedInfo: {
                                    title: 'Seleccionable con coste',
                                    message: 'De pago',
                                    code: 'CA_Asiento_XL_Pago',
                                    conditionStatus: false,
                                    observationCode: '3'
                                }
                            },
                            {
                                code: 'EMBARQUE',
                                name: 'Prioridad de Embarque',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'CA_Embarque_NO_Prioritario',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            },
                            {
                                code: 'CAMBIO',
                                name: 'Cambios',
                                text: 'Permitido con coste, no permitido en caso de no-show.',
                                units: 65,
                                extendedInfo: {
                                    title: 'Cambio de vuelo con coste',
                                    message:
                                        'Permitido con penalización de 65 EUR. No permitido en caso de no presentarse al vuelo (no-show).',
                                    code: 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            },
                            {
                                code: 'REEMBOLSO',
                                name: 'Reembolso (por sentido)',
                                text: 'No permitido.',
                                units: null,
                                extendedInfo: {
                                    title: 'No permitido',
                                    message: 'No permitido.',
                                    code: 'CA_REEMBOLSO NO PERMITIDO',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            },
                            {
                                code: 'TARJEMBANTIC',
                                name: 'Tarjeta de embarque anticipada',
                                text: 'No incluido',
                                units: null,
                                extendedInfo: {
                                    title: 'No incluido',
                                    message: 'No incluido',
                                    code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            },
                            {
                                code: 'CHECKINDESK',
                                name: 'Mostrador check-in exclusivo',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Chek-in_desk_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            },
                            {
                                code: 'SALAVIP',
                                name: 'Acceso a salas VIP',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Acceso a salas VIP No permitido',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            },
                            {
                                code: 'FASTTRACK',
                                name: 'Fast Track',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Fast Track NO',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            },
                            {
                                code: 'EQPPRIOR',
                                name: 'Entrega prioritaria equipaje',
                                text: 'No',
                                units: null,
                                extendedInfo: {
                                    title: '',
                                    message: 'No',
                                    code: 'Entrega_prioritaria_equipaje_ NO',
                                    conditionStatus: false,
                                    observationCode: null
                                }
                            }
                        ],
                        observations: [
                            {
                                observationCode: 1,
                                observationText:
                                    '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=EQUFRA&menuId=EQUIDE" class="links">Consulte equipaje adicional<span class="oculto">[Abre en ventana nueva]</span></a>'
                            },
                            {
                                observationCode: 2,
                                observationText:
                                    '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías <strong>one</strong>world. En el resto debes consultar con la compañía operadora'
                            },
                            {
                                observationCode: 3,
                                observationText:
                                    '<a href="https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE" class="links" title="Ver precios de la reserva de asiento">Más detalle sobre la reserva anticipada de asiento</a>'
                            }
                        ],
                        conditionsPriority: [
                            'EQMANO',
                            'EQBODEGA',
                            'COMIDA',
                            'ASIENTO',
                            'ASIENTOXL',
                            'ASIENTODELANTERO',
                            'EMBARQUE',
                            'TARJEMBANTIC',
                            'CAMBIO',
                            'REEMBOLSO'
                        ]
                    }
                ],
                outwardSegments: [
                    {
                        id: 'IB044820221113',
                        departure: {
                            date: '2022-11-13 07:40',
                            airport: {
                                code: 'MAD',
                                description: 'Madrid',
                                country: {
                                    code: 'ES',
                                    description: 'España'
                                }
                            },
                            terminal: '4'
                        },
                        arrival: {
                            date: '2022-11-13 08:40',
                            airport: {
                                code: 'BIO',
                                description: 'Bilbao',
                                country: {
                                    code: 'ES',
                                    description: 'España'
                                }
                            },
                            terminal: null
                        },
                        cabinClass: {
                            code: 'R',
                            type: 'ECONOMY',
                            description: 'Turista',
                            fareFamily: 'TBAESES',
                            mainClass: 'A'
                        },
                        passengers: [
                            {
                                passengerType: 'ADULT',
                                personalInfo: {
                                    name: 'test',
                                    surname: 'test',
                                    lastSurname: ''
                                },
                                passengerId: 'ADULT_01',
                                seat: null
                            }
                        ],
                        waitingTime: 0
                    }
                ],
                returnSegments: [],
                airShuttleSegments: []
            }
        }
    },
    resp: {
        getReqAviosAncillariesSpeq: {},
        getAviosAncillariesFlex: [
            {
                id: 'ADULT_01',
                ancillaries: [
                    {
                        type: 'FLEXIBILITY_ON_DEMAND',
                        subType: 'FLIGHT_CHANGE',
                        amounts: [
                            {
                                fare: 5,
                                quantity: 1
                            }
                        ],
                        slices: [
                            {
                                id: 'MADBIO20221113074000',
                                segments: [
                                    {
                                        id: 'IB044820221113'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        reqDatalayer: {
            "items": [
                {
                    "item_name": "baggage",
                    "item_id": "MAD-BIO|BIO-MAD",
                    "price": 13,
                    "item_brand": "iberia",
                    "item_category": "compra directa",
                    "item_category2": "MAD-BIO",
                    "item_category3": "1",
                    "item_variant": "15kg",
                    "quantity": 1
                },
                {
                    "item_name": "seat",
                    "item_id": "MAD-BIO|BIO-MAD",
                    "price": 5,
                    "item_brand": "iberia",
                    "item_category": "compra directa",
                    "item_category2": "MAD-BIO",
                    "item_category3": "1",
                    "item_variant": "free",
                    "quantity": 1
                },
                {
                    "item_name": "seat",
                    "item_id": "MAD-BIO|BIO-MAD",
                    "price": 7,
                    "item_brand": "iberia",
                    "item_category": "compra directa",
                    "item_category2": "BIO-MAD",
                    "item_category3": "2",
                    "item_variant": "free",
                    "quantity": 1
                },
                {
                    "item_name": "flexibilization",
                    "item_id": "MAD-BIO|BIO-MAD",
                    "price": 51,
                    "item_brand": "iberia",
                    "item_category": "compra directa",
                    "item_category2": "all",
                    "item_category3": "all",
                    "item_variant": "flexibility pack",
                    "quantity": 1
                },
                {
                    "item_name": "priority boarding",
                    "item_id": "MAD-BIO|BIO-MAD",
                    "price": 6,
                    "item_brand": "iberia",
                    "item_category": "compra directa",
                    "item_category2": "MAD-BIO",
                    "item_category3": "1",
                    "item_variant": "",
                    "quantity": 1
                },
                {
                    "item_name": "special baggage",
                    "item_id": "MAD-BIO|BIO-MAD",
                    "price": 40,
                    "item_brand": "iberia",
                    "item_category": "compra directa",
                    "item_category2": "MAD-BIO",
                    "item_category3": "1",
                    "item_variant": "bike",
                    "quantity": 1
                },
                {
                    "item_name": "special baggage",
                    "item_id": "MAD-BIO|BIO-MAD",
                    "price": 35,
                    "item_brand": "iberia",
                    "item_category": "compra directa",
                    "item_category2": "MAD-BIO",
                    "item_category3": "1",
                    "item_variant": "ski",
                    "quantity": 1
                }
            ]
        },
    }
};
