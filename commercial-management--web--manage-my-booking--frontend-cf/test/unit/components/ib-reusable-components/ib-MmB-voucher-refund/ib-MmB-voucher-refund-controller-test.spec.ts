'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-MmB-voucher-refund-module - controllers', function() {
    var controller, $controller, $rootScope, $scope, localStorage;

    var fakeMmBModalService = {
        'showFullModal': jasmine.createSpy()
    };

    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc: any = function () {
            return [];
        };
        switch (filter) {
            case 'DateFormatFilter':
                filterFunc = function () {
                    return '01/01/2021';
                };
                break;
            case 'translate':
                filterFunc = () => {
                    return 'Translated Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var fakeReturnGenerateFlagsMenu = {
        "showRefundLink": true,
        "showChangeFlightLink": true,
        "showChangeFlightDeepLink": false,
        "showFlexibilizationChangeSection": true,
        "showVoluntaryChangeFlightSection": false,
        "showRefundCashSection": false,
        "showRefundVoucherSection": true,
        "refundVoucherSection80": false,
        "showModalRefound48hs": false,
        "showLinkToRubiQ": true,
        "showFlexibilizationExceptionalMsg": false,
        "hideCashRefundSection": true,
        "allowedRefundVoucher": true,
        "enableExternalRefundLink": false,
        "showContactCenterText": false,
        "showOnlyVoucherRefundText": true,
        "cashPartialRefund": false,
        "importOrderFromDeepLink": false,
        "slicesWithFlexibilization": {
            "MADBIO20210529074000": true,
            "BIOMAD20210618092500": true
        },
        "slicesWithChangeFlight": {},
        "sisterCitiesData": {
            "hasSistercitiesPossibility": true,
            "allowedSlices": [
                {
                    "sliceId": "MADBIO20210529074000",
                    "type": "REGULAR",
                    "departureDateTime": "2021-05-29 07:40",
                    "arrivalDateTime": "2021-05-29 08:40",
                    "duration": 60,
                    "stopsNumber": 0,
                    "price": {
                        "fare": 75,
                        "currency": "EUR"
                    },
                    "detailedPrices": [
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_02"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "CHILD_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": "CH",
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        }
                    ],
                    "segments": [
                        {
                            "type": "CONFIRMED",
                            "mmbAllowed": true,
                            "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                            },
                            "noShow": false,
                            "flyNow": false,
                            "flown": false,
                            "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
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
                                "code": "BIO",
                                "name": "AIRPORT",
                                "terminal": null,
                                "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "arrivalCity": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "flight": {
                                "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "marketingFlightNumber": "0448",
                                "operationalFlightNumber": "",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                    "code": "320",
                                    "description": "Airbus A320"
                                }
                            },
                            "cabin": {
                                "rbd": "A",
                                "description": "Turista",
                                "remainingSeats": null,
                                "fareFamily": "TBAESES",
                                "code": "R",
                                "type": "ECONOMY",
                                "bookingClass": "ECONOMY"
                            },
                            "overnight": false,
                            "id": "IB044820210529",
                            "duration": 60,
                            "waitingTime": 0,
                            "operatorLocator": null,
                            "stop": null,
                            "departureDateTime": "2021-05-29 07:40",
                            "departureUtcDateTime": "2021-05-29T05:40:00.000",
                            "arrivalDateTime": "2021-05-29 08:40",
                            "arrivalUtcDateTime": "2021-05-29T06:40:00.000",
                            "status": {
                                "code": "HK",
                                "description": "Confirmado"
                            }
                        }
                    ],
                    "overnight": false,
                    "passengerFlags": [
                        {
                            "passengerId": "ADULT_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_02",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "CHILD_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "sliceId": "MADBIO20210529074000",
                    "type": "REGULAR",
                    "departureDateTime": "2021-05-29 07:40",
                    "arrivalDateTime": "2021-05-29 08:40",
                    "duration": 60,
                    "stopsNumber": 0,
                    "price": {
                        "fare": 75,
                        "currency": "EUR"
                    },
                    "detailedPrices": [
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_02"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "CHILD_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": "CH",
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        }
                    ],
                    "segments": [
                        {
                            "type": "CONFIRMED",
                            "mmbAllowed": true,
                            "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                            },
                            "noShow": false,
                            "flyNow": false,
                            "flown": false,
                            "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
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
                                "code": "BIO",
                                "name": "AIRPORT",
                                "terminal": null,
                                "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "arrivalCity": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "flight": {
                                "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "marketingFlightNumber": "0448",
                                "operationalFlightNumber": "",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                    "code": "320",
                                    "description": "Airbus A320"
                                }
                            },
                            "cabin": {
                                "rbd": "A",
                                "description": "Turista",
                                "remainingSeats": null,
                                "fareFamily": "TBAESES",
                                "code": "R",
                                "type": "ECONOMY",
                                "bookingClass": "ECONOMY"
                            },
                            "overnight": false,
                            "id": "IB044820210529",
                            "duration": 60,
                            "waitingTime": 0,
                            "operatorLocator": null,
                            "stop": null,
                            "departureDateTime": "2021-05-29 07:40",
                            "departureUtcDateTime": "2021-05-29T05:40:00.000",
                            "arrivalDateTime": "2021-05-29 08:40",
                            "arrivalUtcDateTime": "2021-05-29T06:40:00.000",
                            "status": {
                                "code": "HK",
                                "description": "Confirmado"
                            }
                        }
                    ],
                    "overnight": false,
                    "passengerFlags": [
                        {
                            "passengerId": "ADULT_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_02",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "CHILD_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "sliceId": "MADBIO20210529074000",
                    "type": "REGULAR",
                    "departureDateTime": "2021-05-29 07:40",
                    "arrivalDateTime": "2021-05-29 08:40",
                    "duration": 60,
                    "stopsNumber": 0,
                    "price": {
                        "fare": 75,
                        "currency": "EUR"
                    },
                    "detailedPrices": [
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_02"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "CHILD_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": "CH",
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB044820210529"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        }
                    ],
                    "segments": [
                        {
                            "type": "CONFIRMED",
                            "mmbAllowed": true,
                            "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                            },
                            "noShow": false,
                            "flyNow": false,
                            "flown": false,
                            "departure": {
                                "code": "MAD",
                                "name": "BARAJAS",
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
                                "code": "BIO",
                                "name": "AIRPORT",
                                "terminal": null,
                                "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "departureCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "arrivalCity": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "flight": {
                                "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "marketingFlightNumber": "0448",
                                "operationalFlightNumber": "",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                    "code": "320",
                                    "description": "Airbus A320"
                                }
                            },
                            "cabin": {
                                "rbd": "A",
                                "description": "Turista",
                                "remainingSeats": null,
                                "fareFamily": "TBAESES",
                                "code": "R",
                                "type": "ECONOMY",
                                "bookingClass": "ECONOMY"
                            },
                            "overnight": false,
                            "id": "IB044820210529",
                            "duration": 60,
                            "waitingTime": 0,
                            "operatorLocator": null,
                            "stop": null,
                            "departureDateTime": "2021-05-29 07:40",
                            "departureUtcDateTime": "2021-05-29T05:40:00.000",
                            "arrivalDateTime": "2021-05-29 08:40",
                            "arrivalUtcDateTime": "2021-05-29T06:40:00.000",
                            "status": {
                                "code": "HK",
                                "description": "Confirmado"
                            }
                        }
                    ],
                    "overnight": false,
                    "passengerFlags": [
                        {
                            "passengerId": "ADULT_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_02",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "CHILD_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "sliceId": "BIOMAD20210618092500",
                    "type": "REGULAR",
                    "departureDateTime": "2021-06-18 09:25",
                    "arrivalDateTime": "2021-06-18 10:35",
                    "duration": 70,
                    "stopsNumber": 0,
                    "price": {
                        "fare": 75,
                        "currency": "EUR"
                    },
                    "detailedPrices": [
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_02"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "CHILD_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": "CH",
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        }
                    ],
                    "segments": [
                        {
                            "type": "CONFIRMED",
                            "mmbAllowed": true,
                            "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                            },
                            "noShow": false,
                            "flyNow": false,
                            "flown": false,
                            "departure": {
                                "code": "BIO",
                                "name": "AIRPORT",
                                "terminal": null,
                                "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
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
                            "departureCity": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "flight": {
                                "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "marketingFlightNumber": "0423",
                                "operationalFlightNumber": "",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                    "code": "32A",
                                    "description": "Airbus A320"
                                }
                            },
                            "cabin": {
                                "rbd": "A",
                                "description": "Turista",
                                "remainingSeats": null,
                                "fareFamily": "TBAESES",
                                "code": "R",
                                "type": "ECONOMY",
                                "bookingClass": "ECONOMY"
                            },
                            "overnight": false,
                            "id": "IB042320210618",
                            "duration": 70,
                            "waitingTime": 0,
                            "operatorLocator": null,
                            "stop": null,
                            "departureDateTime": "2021-06-18 09:25",
                            "departureUtcDateTime": "2021-06-18T07:25:00.000",
                            "arrivalDateTime": "2021-06-18 10:35",
                            "arrivalUtcDateTime": "2021-06-18T08:35:00.000",
                            "status": {
                                "code": "HK",
                                "description": "Confirmado"
                            }
                        }
                    ],
                    "overnight": false,
                    "passengerFlags": [
                        {
                            "passengerId": "ADULT_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_02",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "CHILD_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "sliceId": "BIOMAD20210618092500",
                    "type": "REGULAR",
                    "departureDateTime": "2021-06-18 09:25",
                    "arrivalDateTime": "2021-06-18 10:35",
                    "duration": 70,
                    "stopsNumber": 0,
                    "price": {
                        "fare": 75,
                        "currency": "EUR"
                    },
                    "detailedPrices": [
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_02"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "CHILD_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": "CH",
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        }
                    ],
                    "segments": [
                        {
                            "type": "CONFIRMED",
                            "mmbAllowed": true,
                            "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                            },
                            "noShow": false,
                            "flyNow": false,
                            "flown": false,
                            "departure": {
                                "code": "BIO",
                                "name": "AIRPORT",
                                "terminal": null,
                                "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
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
                            "departureCity": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "flight": {
                                "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "marketingFlightNumber": "0423",
                                "operationalFlightNumber": "",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                    "code": "32A",
                                    "description": "Airbus A320"
                                }
                            },
                            "cabin": {
                                "rbd": "A",
                                "description": "Turista",
                                "remainingSeats": null,
                                "fareFamily": "TBAESES",
                                "code": "R",
                                "type": "ECONOMY",
                                "bookingClass": "ECONOMY"
                            },
                            "overnight": false,
                            "id": "IB042320210618",
                            "duration": 70,
                            "waitingTime": 0,
                            "operatorLocator": null,
                            "stop": null,
                            "departureDateTime": "2021-06-18 09:25",
                            "departureUtcDateTime": "2021-06-18T07:25:00.000",
                            "arrivalDateTime": "2021-06-18 10:35",
                            "arrivalUtcDateTime": "2021-06-18T08:35:00.000",
                            "status": {
                                "code": "HK",
                                "description": "Confirmado"
                            }
                        }
                    ],
                    "overnight": false,
                    "passengerFlags": [
                        {
                            "passengerId": "ADULT_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_02",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "CHILD_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "sliceId": "BIOMAD20210618092500",
                    "type": "REGULAR",
                    "departureDateTime": "2021-06-18 09:25",
                    "arrivalDateTime": "2021-06-18 10:35",
                    "duration": 70,
                    "stopsNumber": 0,
                    "price": {
                        "fare": 75,
                        "currency": "EUR"
                    },
                    "detailedPrices": [
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_02"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "CHILD_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": "CH",
                                    "penalties": []
                                }
                            ]
                        },
                        {
                            "fare": 25,
                            "currency": "EUR",
                            "passengerIds": [
                                "ADULT_01"
                            ],
                            "segmentPrices": [
                                {
                                    "price": {
                                        "fare": 25,
                                        "currency": "EUR"
                                    },
                                    "fareCode": "ADNNB4",
                                    "segmentsIds": [
                                        "IB042320210618"
                                    ],
                                    "ticketDesignator": null,
                                    "penalties": []
                                }
                            ]
                        }
                    ],
                    "segments": [
                        {
                            "type": "CONFIRMED",
                            "mmbAllowed": true,
                            "ckiStatus": {
                                "code": "CHECKABLE",
                                "message": null
                            },
                            "noShow": false,
                            "flyNow": false,
                            "flown": false,
                            "departure": {
                                "code": "BIO",
                                "name": "AIRPORT",
                                "terminal": null,
                                "city": {
                                    "code": "BIO",
                                    "description": "Bilbao",
                                    "countryCode": "ES",
                                    "country": {
                                        "code": "ES",
                                        "description": "España"
                                    }
                                }
                            },
                            "arrival": {
                                "code": "MAD",
                                "name": "BARAJAS",
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
                            "departureCity": {
                                "code": "BIO",
                                "description": "Bilbao",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "arrivalCity": {
                                "code": "MAD",
                                "description": "Madrid",
                                "countryCode": "ES",
                                "timeZone": "Europe/Madrid"
                            },
                            "flight": {
                                "marketingCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "operationalCarrier": {
                                    "code": "IB",
                                    "name": "Iberia"
                                },
                                "marketingFlightNumber": "0423",
                                "operationalFlightNumber": "",
                                "operationalDisclosure": "IB",
                                "aircraft": {
                                    "code": "32A",
                                    "description": "Airbus A320"
                                }
                            },
                            "cabin": {
                                "rbd": "A",
                                "description": "Turista",
                                "remainingSeats": null,
                                "fareFamily": "TBAESES",
                                "code": "R",
                                "type": "ECONOMY",
                                "bookingClass": "ECONOMY"
                            },
                            "overnight": false,
                            "id": "IB042320210618",
                            "duration": 70,
                            "waitingTime": 0,
                            "operatorLocator": null,
                            "stop": null,
                            "departureDateTime": "2021-06-18 09:25",
                            "departureUtcDateTime": "2021-06-18T07:25:00.000",
                            "arrivalDateTime": "2021-06-18 10:35",
                            "arrivalUtcDateTime": "2021-06-18T08:35:00.000",
                            "status": {
                                "code": "HK",
                                "description": "Confirmado"
                            }
                        }
                    ],
                    "overnight": false,
                    "passengerFlags": [
                        {
                            "passengerId": "ADULT_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "ADULT_02",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        },
                        {
                            "passengerId": "CHILD_01",
                            "flags": [
                                {
                                    "type": "FLIGHT_MODIFICATION",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_REFUND",
                                    "enabled": false
                                },
                                {
                                    "type": "FREQUENT_FLYER_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "SPECIAL_NEEDS_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "CONTACT_DATA_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "EMERGENCY_CONTACT_MODIFICATION",
                                    "enabled": true
                                },
                                {
                                    "type": "PASSENGER_NAME_CORRECTION",
                                    "enabled": false
                                },
                                {
                                    "type": "ANCILLARIES",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                                    "enabled": false
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                                    "enabled": true
                                },
                                {
                                    "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                                    "enabled": false
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "showMonetateAlertCFPhone": true,
        "allowedInvoluntaryFlightChange": true,
        "hideChangeFlightMenuOption": false,
        "showVoluntaryFlexibleFlightChange": false,
        "flightModificationActive": false,
        "flexibleFlight": false,
        "displayCCPhone": false
    };

    var fakeIbFlagsTransformer = {
        'generateFlagsMenu': jasmine.createSpy('generateFlagsMenu').and.callFake(function () {
            return fakeReturnGenerateFlagsMenu;
        })
    };

    var fakePhoneList = {
        RESERVAS: { 'prefix': '(+34)', 'telephone': '901 111 500', 'text': 'Reservas y Venta:', 'prefixAlt': '', 'telephoneAlt': '', 'textAlt': '', 'timeText': '24h' }
    };

    var fakeVoucherList = [
        {
            'validityDate' : '10-10-2022',
            'flightDateLimit': '10-11-2022'
        },
        {
            'validityDate' : '10-10-2023',
            'flightDateLimit': '10-11-2023'
        }
    ];

    var fakeBookingInfo = {
        "flowId": "TWFuYWdlTXlCb29raW5nQElCZGU5ZTRiYjIwYjI3NDYzMWI2M2EwYjc5OTE4NmUyOGU=",
        "order": {
          "orderId": "Qm9va2luZ0BJQjY3NWJkNWEzZjQzZDQ2NzA5MGVjODZmYTBjOGIxMzgzT1A=",
          "status": "ISSUED",
          "clientLocator": "NMTZC",
          "bookingReferences": [
            {
              "provider": "IB",
              "reference": "NMTZC"
            }
          ],
          "orderItems": [
            {
              "type": "flight",
              "orderItemId": "IB675bd5a3f43d467090ec86fa0c8b1383OP_01",
              "bookingReferences": [
                {
                  "provider": "IB",
                  "reference": "NMTZC"
                }
              ],
              "price": {
                "fare": 345,
                "tax": 179.79,
                "total": 524.79,
                "currency": "EUR",
                "ticketingFee": 0
              },
              "sliceIds": [
                "MADLHR20231130065000",
                "LHRMAD20231203062000"
              ],
              "passengerPrices": [
                {
                  "fareCalculation": "MAD IB LON98.39IB MAD22.10NUC120.49END ROE0.950225",
                  "passengerId": "ADULT_01",
                  "price": {
                    "fare": 115,
                    "tax": 59.93,
                    "total": 174.93,
                    "currency": "EUR",
                    "ticketingFee": 0
                  },
                  "segmentPrices": [
                    {
                      "price": null,
                      "fareCode": "VZNNANB6",
                      "segmentsIds": [
                        "IB317020231130"
                      ],
                      "ticketDesignator": "",
                      "penalties": [],
                      "penaltyFlags": null
                    },
                    {
                      "price": null,
                      "fareCode": "OENNANB6",
                      "segmentsIds": [
                        "IB745820231203"
                      ],
                      "ticketDesignator": "",
                      "penalties": [],
                      "penaltyFlags": null
                    }
                  ],
                  "taxes": [
                    {
                      "code": "QV",
                      "amount": 3.27,
                      "currency": "EUR",
                      "description": "Seguridad",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "OG",
                      "amount": 0.63,
                      "currency": "EUR",
                      "description": "Tasa de seguridad",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "JD",
                      "amount": 14.48,
                      "currency": "EUR",
                      "description": "Cargo por salida",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "GB",
                      "amount": 14.93,
                      "currency": "EUR",
                      "description": "Impuesto sobre los pasajeros aéreos (APD)",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "UB",
                      "amount": 26.62,
                      "currency": "EUR",
                      "description": "Cargo por servicio al pasajero",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    }
                  ],
                  "orderItemPaymentInfos": []
                },
                {
                  "fareCalculation": "MAD IB LON98.39IB MAD22.10NUC120.49END ROE0.950225",
                  "passengerId": "ADULT_02",
                  "price": {
                    "fare": 115,
                    "tax": 59.93,
                    "total": 174.93,
                    "currency": "EUR",
                    "ticketingFee": 0
                  },
                  "segmentPrices": [
                    {
                      "price": null,
                      "fareCode": "VZNNANB6",
                      "segmentsIds": [
                        "IB317020231130"
                      ],
                      "ticketDesignator": "",
                      "penalties": [],
                      "penaltyFlags": null
                    },
                    {
                      "price": null,
                      "fareCode": "OENNANB6",
                      "segmentsIds": [
                        "IB745820231203"
                      ],
                      "ticketDesignator": "",
                      "penalties": [],
                      "penaltyFlags": null
                    }
                  ],
                  "taxes": [
                    {
                      "code": "QV",
                      "amount": 3.27,
                      "currency": "EUR",
                      "description": "Seguridad",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "OG",
                      "amount": 0.63,
                      "currency": "EUR",
                      "description": "Tasa de seguridad",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "JD",
                      "amount": 14.48,
                      "currency": "EUR",
                      "description": "Cargo por salida",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "GB",
                      "amount": 14.93,
                      "currency": "EUR",
                      "description": "Impuesto sobre los pasajeros aéreos (APD)",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "UB",
                      "amount": 26.62,
                      "currency": "EUR",
                      "description": "Cargo por servicio al pasajero",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    }
                  ],
                  "orderItemPaymentInfos": []
                },
                {
                  "fareCalculation": "MAD IB LON98.39IB MAD22.10NUC120.49END ROE0.950225",
                  "passengerId": "ADULT_03",
                  "price": {
                    "fare": 115,
                    "tax": 59.93,
                    "total": 174.93,
                    "currency": "EUR",
                    "ticketingFee": 0
                  },
                  "segmentPrices": [
                    {
                      "price": null,
                      "fareCode": "VZNNANB6",
                      "segmentsIds": [
                        "IB317020231130"
                      ],
                      "ticketDesignator": "",
                      "penalties": [],
                      "penaltyFlags": null
                    },
                    {
                      "price": null,
                      "fareCode": "OENNANB6",
                      "segmentsIds": [
                        "IB745820231203"
                      ],
                      "ticketDesignator": "",
                      "penalties": [],
                      "penaltyFlags": null
                    }
                  ],
                  "taxes": [
                    {
                      "code": "QV",
                      "amount": 3.27,
                      "currency": "EUR",
                      "description": "Seguridad",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "OG",
                      "amount": 0.63,
                      "currency": "EUR",
                      "description": "Tasa de seguridad",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "JD",
                      "amount": 14.48,
                      "currency": "EUR",
                      "description": "Cargo por salida",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "GB",
                      "amount": 14.93,
                      "currency": "EUR",
                      "description": "Impuesto sobre los pasajeros aéreos (APD)",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    },
                    {
                      "code": "UB",
                      "amount": 26.62,
                      "currency": "EUR",
                      "description": "Cargo por servicio al pasajero",
                      "subcode": null,
                      "country": null,
                      "carrier": null
                    }
                  ],
                  "orderItemPaymentInfos": []
                }
              ]
            }
          ],
          "slices": [
            {
              "sliceId": "MADLHR20231130065000",
              "type": "REGULAR",
              "departureDateTime": "2023-11-30 06:50",
              "arrivalDateTime": "2023-11-30 08:25",
              "duration": 155,
              "stopsNumber": 0,
              "detailedPrices": [
                {
                  "fare": 0,
                  "currency": null,
                  "passengerIds": [
                    "ADULT_01",
                    "ADULT_02",
                    "ADULT_03"
                  ],
                  "segmentPrices": []
                }
              ],
              "segments": [
                {
                  "type": "CONFIRMED",
                  "mmbAllowed": true,
                  "ckiStatus": {
                    "code": "CHECKABLE",
                    "message": null
                  },
                  "noShow": false,
                  "flyNow": false,
                  "flown": false,
                  "departure": {
                    "code": "MAD",
                    "name": "BARAJAS",
                    "terminal": "4S",
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
                    "code": "LHR",
                    "name": "HEATHROW",
                    "terminal": "5",
                    "city": {
                      "code": "LON",
                      "description": "Londres",
                      "countryCode": "GB",
                      "country": {
                        "code": "GB",
                        "description": "Reino Unido"
                      }
                    }
                  },
                  "departureCity": {
                    "code": "MAD",
                    "description": "Madrid",
                    "countryCode": "ES",
                    "timeZone": "Europe/Madrid"
                  },
                  "arrivalCity": {
                    "code": "LON",
                    "description": "Londres",
                    "countryCode": "GB",
                    "timeZone": "Europe/London"
                  },
                  "flight": {
                    "marketingCarrier": {
                      "code": "IB",
                      "name": "Iberia"
                    },
                    "operationalCarrier": {
                      "code": "IB",
                      "name": "Iberia"
                    },
                    "marketingFlightNumber": "3170",
                    "operationalFlightNumber": "3170",
                    "operationalDisclosure": "IB",
                    "aircraft": {
                      "code": "320",
                      "description": "Airbus A320"
                    }
                  },
                  "cabin": {
                    "rbd": "V",
                    "description": "",
                    "remainingSeats": 0,
                    "fareFamily": "TBAESEU",
                    "code": "R",
                    "type": "ECONOMY",
                    "bookingClass": "ECONOMY"
                  },
                  "overnight": false,
                  "id": "IB317020231130",
                  "duration": 155,
                  "waitingTime": 0,
                  "operatorLocator": null,
                  "stop": null,
                  "departureDateTime": "2023-11-30 06:50",
                  "departureUtcDateTime": "2023-11-30T05:50:00.000",
                  "arrivalDateTime": "2023-11-30 08:25",
                  "arrivalUtcDateTime": "2023-11-30T08:25:00.000",
                  "status": {
                    "code": "HK",
                    "description": "Confirmado"
                  }
                }
              ],
              "overnight": false,
              "passengerFlags": [
                {
                  "passengerId": "ADULT_01",
                  "flags": [
                    {
                      "type": "FLIGHT_REFUND",
                      "enabled": true
                    },
                    {
                      "type": "FREQUENT_FLYER_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "SPECIAL_NEEDS_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "CONTACT_DATA_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "EMERGENCY_CONTACT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "PASSENGER_NAME_CORRECTION",
                      "enabled": false
                    },
                    {
                      "type": "ANCILLARIES",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                      "enabled": false
                    }
                  ]
                },
                {
                  "passengerId": "ADULT_02",
                  "flags": [
                    {
                      "type": "FLIGHT_REFUND",
                      "enabled": true
                    },
                    {
                      "type": "FREQUENT_FLYER_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "SPECIAL_NEEDS_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "CONTACT_DATA_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "EMERGENCY_CONTACT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "PASSENGER_NAME_CORRECTION",
                      "enabled": false
                    },
                    {
                      "type": "ANCILLARIES",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                      "enabled": false
                    }
                  ]
                },
                {
                  "passengerId": "ADULT_03",
                  "flags": [
                    {
                      "type": "FLIGHT_REFUND",
                      "enabled": true
                    },
                    {
                      "type": "FREQUENT_FLYER_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "SPECIAL_NEEDS_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "CONTACT_DATA_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "EMERGENCY_CONTACT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "PASSENGER_NAME_CORRECTION",
                      "enabled": false
                    },
                    {
                      "type": "ANCILLARIES",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                      "enabled": false
                    }
                  ]
                }
              ]
            },
            {
              "sliceId": "LHRMAD20231203062000",
              "type": "REGULAR",
              "departureDateTime": "2023-12-03 06:20",
              "arrivalDateTime": "2023-12-03 09:55",
              "duration": 155,
              "stopsNumber": 0,
              "detailedPrices": [
                {
                  "fare": 0,
                  "currency": null,
                  "passengerIds": [
                    "ADULT_01",
                    "ADULT_02",
                    "ADULT_03"
                  ],
                  "segmentPrices": []
                }
              ],
              "segments": [
                {
                  "type": "CONFIRMED",
                  "mmbAllowed": true,
                  "ckiStatus": {
                    "code": "CHECKABLE",
                    "message": null
                  },
                  "noShow": false,
                  "flyNow": false,
                  "flown": false,
                  "departure": {
                    "code": "LHR",
                    "name": "HEATHROW",
                    "terminal": "5",
                    "city": {
                      "code": "LON",
                      "description": "Londres",
                      "countryCode": "GB",
                      "country": {
                        "code": "GB",
                        "description": "Reino Unido"
                      }
                    }
                  },
                  "arrival": {
                    "code": "MAD",
                    "name": "BARAJAS",
                    "terminal": "4S",
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
                  "departureCity": {
                    "code": "LON",
                    "description": "Londres",
                    "countryCode": "GB",
                    "timeZone": "Europe/London"
                  },
                  "arrivalCity": {
                    "code": "MAD",
                    "description": "Madrid",
                    "countryCode": "ES",
                    "timeZone": "Europe/Madrid"
                  },
                  "flight": {
                    "marketingCarrier": {
                      "code": "IB",
                      "name": "Iberia"
                    },
                    "operationalCarrier": {
                      "code": "BA",
                      "name": "British Airways"
                    },
                    "marketingFlightNumber": "7458",
                    "operationalFlightNumber": "0456",
                    "operationalDisclosure": "BA",
                    "aircraft": {
                      "code": "320",
                      "description": "Airbus A320"
                    }
                  },
                  "cabin": {
                    "rbd": "O",
                    "description": "",
                    "remainingSeats": 0,
                    "fareFamily": "TBAESEU",
                    "code": "R",
                    "type": "ECONOMY",
                    "bookingClass": "ECONOMY"
                  },
                  "overnight": false,
                  "id": "IB745820231203",
                  "duration": 155,
                  "waitingTime": 0,
                  "operatorLocator": null,
                  "stop": null,
                  "departureDateTime": "2023-12-03 06:20",
                  "departureUtcDateTime": "2023-12-03T06:20:00.000",
                  "arrivalDateTime": "2023-12-03 09:55",
                  "arrivalUtcDateTime": "2023-12-03T08:55:00.000",
                  "status": {
                    "code": "HK",
                    "description": "Confirmado"
                  }
                }
              ],
              "overnight": false,
              "passengerFlags": [
                {
                  "passengerId": "ADULT_01",
                  "flags": [
                    {
                      "type": "FLIGHT_REFUND",
                      "enabled": true
                    },
                    {
                      "type": "FREQUENT_FLYER_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "SPECIAL_NEEDS_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "CONTACT_DATA_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "EMERGENCY_CONTACT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "PASSENGER_NAME_CORRECTION",
                      "enabled": false
                    },
                    {
                      "type": "ANCILLARIES",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                      "enabled": false
                    }
                  ]
                },
                {
                  "passengerId": "ADULT_02",
                  "flags": [
                    {
                      "type": "FLIGHT_REFUND",
                      "enabled": true
                    },
                    {
                      "type": "FREQUENT_FLYER_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "SPECIAL_NEEDS_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "CONTACT_DATA_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "EMERGENCY_CONTACT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "PASSENGER_NAME_CORRECTION",
                      "enabled": false
                    },
                    {
                      "type": "ANCILLARIES",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                      "enabled": false
                    }
                  ]
                },
                {
                  "passengerId": "ADULT_03",
                  "flags": [
                    {
                      "type": "FLIGHT_REFUND",
                      "enabled": true
                    },
                    {
                      "type": "FREQUENT_FLYER_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "SPECIAL_NEEDS_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "CONTACT_DATA_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "EMERGENCY_CONTACT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "PASSENGER_NAME_CORRECTION",
                      "enabled": false
                    },
                    {
                      "type": "ANCILLARIES",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_MODIFICATION",
                      "enabled": true
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_FLEXIBLE",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_DISRUPTION_SEARCH",
                      "enabled": false
                    },
                    {
                      "type": "FLIGHT_MODIFICATION_ON_DEMAND",
                      "enabled": false
                    }
                  ]
                }
              ]
            }
          ],
          "price": {
            "fare": 345,
            "tax": 179.79,
            "total": 524.79,
            "currency": "EUR",
            "ticketingFee": 0
          },
          "primaryContactInfo": {
            "phone": "34687788989",
            "phoneDetails": {
              "number": "687788989",
              "countryCode": "34"
            },
            "email": "AAA@GMAIL.COM",
            "phoneType": "MOBILE",
            "confirmationMailOption": null,
            "refundEmail": "AAA@GMAIL.COM",
            "language": null
          },
          "optionalInformation": [],
          "cashAviosPossibilities": [],
          "specialDiscounts": [],
          "checkedBagAllowances": [
            {
              "type": "PIECE",
              "segmentIds": [
                "IB317020231130",
                "IB745820231203"
              ],
              "totalQuantity": 0
            }
          ],
          "accrualQuote": null,
          "bookingCreationDates": [
            {
              "creationDate": "2023-11-06",
              "provider": "IB"
            }
          ],
          "sender": null,
          "officeIata": "7849644",
          "availableForCheckin": false,
          "earlyCheckinDone": false,
          "aviosRedeemed": null,
          "pointsRedeemed": null
        },
        "passengers": [
          {
            "passengerType": "ADULT",
            "personalInfo": {
              "name": "AAA",
              "surname": "AAA",
              "birthDate": null
            },
            "passengerId": "ADULT_01",
            "contactInfo": {
              "phone": "34687788989",
              "phoneDetails": {
                "number": "687788989",
                "countryCode": "34"
              },
              "email": "aaa@gmail.com",
              "phoneType": "MOBILE",
              "confirmationMailOption": null,
              "refundEmail": null,
              "language": "es"
            },
            "relatedPassengerId": "",
            "ckiStatus": null,
            "optionalInformation": [],
            "residenceAccreditationStatus": null,
            "resiberPassengerId": "1",
            "securityInformation": {
              "relatedContent": [
                {
                  "key": "APIS_DOCUMENT_INFO",
                  "value": "Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online"
                },
                {
                  "key": "APIS_STATUS_INFO",
                  "value": "Completar"
                }
              ]
            },
            "externalPersonalInfo": {
              "name": "aaa",
              "firstSurname": "aaa",
              "lastSurname": ""
            }
          },
          {
            "passengerType": "ADULT",
            "personalInfo": {
              "name": "BBB",
              "surname": "BBB",
              "birthDate": null
            },
            "passengerId": "ADULT_02",
            "contactInfo": {
              "phone": "34687788989",
              "phoneDetails": {
                "number": "687788989",
                "countryCode": "34"
              },
              "email": "bbb@gmail.com",
              "phoneType": "MOBILE",
              "confirmationMailOption": null,
              "refundEmail": null,
              "language": null
            },
            "relatedPassengerId": "",
            "ckiStatus": null,
            "optionalInformation": [],
            "residenceAccreditationStatus": null,
            "resiberPassengerId": "2",
            "securityInformation": {
              "relatedContent": [
                {
                  "key": "APIS_DOCUMENT_INFO",
                  "value": "Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online"
                },
                {
                  "key": "APIS_STATUS_INFO",
                  "value": "Completar"
                }
              ]
            },
            "externalPersonalInfo": {
              "name": "bbb",
              "firstSurname": "bbb",
              "lastSurname": ""
            }
          },
          {
            "passengerType": "ADULT",
            "personalInfo": {
              "name": "CCC",
              "surname": "CCC",
              "birthDate": null
            },
            "passengerId": "ADULT_03",
            "contactInfo": {
              "phone": "34659405595",
              "phoneDetails": {
                "number": "659405595",
                "countryCode": "34"
              },
              "email": "ccc@gmail.com",
              "phoneType": "MOBILE",
              "confirmationMailOption": null,
              "refundEmail": null,
              "language": null
            },
            "relatedPassengerId": "",
            "ckiStatus": null,
            "optionalInformation": [],
            "residenceAccreditationStatus": null,
            "resiberPassengerId": "3",
            "securityInformation": {
              "relatedContent": [
                {
                  "key": "APIS_DOCUMENT_INFO",
                  "value": "Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online"
                },
                {
                  "key": "APIS_STATUS_INFO",
                  "value": "Completar"
                }
              ]
            },
            "externalPersonalInfo": {
              "name": "ccc",
              "firstSurname": "ccc",
              "lastSurname": ""
            }
          }
        ],
        "tickets": [
          {
            "ticketNumbers": [
              "0751419201606"
            ],
            "type": "ET",
            "orderItemId": "IB675bd5a3f43d467090ec86fa0c8b1383OP_01",
            "passengerId": "ADULT_01",
            "issueDateTime": "2023-11-06 13:41",
            "fareCalculation": "MAD IB LON98.39IB MAD22.10NUC120.49END ROE0.950225",
            "taxes": [
              {
                "code": "QV",
                "amount": 3.27,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "OG",
                "amount": 0.63,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "JD",
                "amount": 14.48,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "GB",
                "amount": 14.93,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "UB",
                "amount": 26.62,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              }
            ],
            "coupons": [
              {
                "arrival": "LHR",
                "departure": "MAD",
                "departureDate": "2023-11-30T06:50:00.000",
                "status": "OPEN FOR USE",
                "fareBasis": "VZNNANB6",
                "carrier": "IB",
                "flightNumber": "3170",
                "flightStatus": "OK",
                "operatingCarrier": null,
                "bookingCode": "V",
                "designator": "",
                "couponNumber": "1",
                "remark": null,
                "baggageDetail": {
                  "freeAllowance": 0,
                  "quantityCode": "PC",
                  "unitQualifier": "PC"
                },
                "disruptedRefundable": false
              },
              {
                "arrival": "MAD",
                "departure": "LHR",
                "departureDate": "2023-12-03T06:20:00.000",
                "status": "AIRP.CONTROL",
                "fareBasis": "OENNANB6",
                "carrier": "IB",
                "flightNumber": "7458",
                "flightStatus": "OK",
                "operatingCarrier": "BA",
                "bookingCode": "O",
                "designator": "",
                "couponNumber": "2",
                "remark": null,
                "baggageDetail": {
                  "freeAllowance": 0,
                  "quantityCode": "PC",
                  "unitQualifier": "PC"
                },
                "disruptedRefundable": false
              }
            ],
            "iataCode": "78496445",
            "issueCity": "MAD",
            "passengerType": "ADULT",
            "paymentInfo": {
              "type": "CREDIT_CARD",
              "amount": 174.93
            },
            "emdsList": [],
            "creditCardFeePrice": null,
            "conjunctionTickets": null,
            "reissueHistory": [],
            "taxedPrice": {
              "fare": 115,
              "tax": 59.93,
              "total": 174.93,
              "currency": "EUR",
              "ticketingFee": 0
            }
          },
          {
            "ticketNumbers": [
              "0751419201607"
            ],
            "type": "ET",
            "orderItemId": "IB675bd5a3f43d467090ec86fa0c8b1383OP_01",
            "passengerId": "ADULT_02",
            "issueDateTime": "2023-11-06 13:41",
            "fareCalculation": "MAD IB LON98.39IB MAD22.10NUC120.49END ROE0.950225",
            "taxes": [
              {
                "code": "QV",
                "amount": 3.27,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "OG",
                "amount": 0.63,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "JD",
                "amount": 14.48,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "GB",
                "amount": 14.93,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "UB",
                "amount": 26.62,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              }
            ],
            "coupons": [
              {
                "arrival": "LHR",
                "departure": "MAD",
                "departureDate": "2023-11-30T06:50:00.000",
                "status": "OPEN FOR USE",
                "fareBasis": "VZNNANB6",
                "carrier": "IB",
                "flightNumber": "3170",
                "flightStatus": "OK",
                "operatingCarrier": null,
                "bookingCode": "V",
                "designator": "",
                "couponNumber": "1",
                "remark": null,
                "baggageDetail": {
                  "freeAllowance": 0,
                  "quantityCode": "PC",
                  "unitQualifier": "PC"
                },
                "disruptedRefundable": false
              },
              {
                "arrival": "MAD",
                "departure": "LHR",
                "departureDate": "2023-12-03T06:20:00.000",
                "status": "AIRP.CONTROL",
                "fareBasis": "OENNANB6",
                "carrier": "IB",
                "flightNumber": "7458",
                "flightStatus": "OK",
                "operatingCarrier": "BA",
                "bookingCode": "O",
                "designator": "",
                "couponNumber": "2",
                "remark": null,
                "baggageDetail": {
                  "freeAllowance": 0,
                  "quantityCode": "PC",
                  "unitQualifier": "PC"
                },
                "disruptedRefundable": false
              }
            ],
            "iataCode": "78496445",
            "issueCity": "MAD",
            "passengerType": "ADULT",
            "paymentInfo": {
              "type": "CREDIT_CARD",
              "amount": 174.93
            },
            "emdsList": [],
            "creditCardFeePrice": null,
            "conjunctionTickets": null,
            "reissueHistory": [],
            "taxedPrice": {
              "fare": 115,
              "tax": 59.93,
              "total": 174.93,
              "currency": "EUR",
              "ticketingFee": 0
            }
          },
          {
            "ticketNumbers": [
              "0751419201608"
            ],
            "type": "ET",
            "orderItemId": "IB675bd5a3f43d467090ec86fa0c8b1383OP_01",
            "passengerId": "ADULT_03",
            "issueDateTime": "2023-11-06 13:41",
            "fareCalculation": "MAD IB LON98.39IB MAD22.10NUC120.49END ROE0.950225",
            "taxes": [
              {
                "code": "QV",
                "amount": 3.27,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "OG",
                "amount": 0.63,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "JD",
                "amount": 14.48,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "GB",
                "amount": 14.93,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              },
              {
                "code": "UB",
                "amount": 26.62,
                "currency": "EUR",
                "description": "",
                "subcode": null,
                "country": null,
                "carrier": null
              }
            ],
            "coupons": [
              {
                "arrival": "LHR",
                "departure": "MAD",
                "departureDate": "2023-11-30T06:50:00.000",
                "status": "OPEN FOR USE",
                "fareBasis": "VZNNANB6",
                "carrier": "IB",
                "flightNumber": "3170",
                "flightStatus": "OK",
                "operatingCarrier": null,
                "bookingCode": "V",
                "designator": "",
                "couponNumber": "1",
                "remark": null,
                "baggageDetail": {
                  "freeAllowance": 0,
                  "quantityCode": "PC",
                  "unitQualifier": "PC"
                },
                "disruptedRefundable": false
              },
              {
                "arrival": "MAD",
                "departure": "LHR",
                "departureDate": "2023-12-03T06:20:00.000",
                "status": "AIRP.CONTROL",
                "fareBasis": "OENNANB6",
                "carrier": "IB",
                "flightNumber": "7458",
                "flightStatus": "OK",
                "operatingCarrier": "BA",
                "bookingCode": "O",
                "designator": "",
                "couponNumber": "2",
                "remark": null,
                "baggageDetail": {
                  "freeAllowance": 0,
                  "quantityCode": "PC",
                  "unitQualifier": "PC"
                },
                "disruptedRefundable": false
              }
            ],
            "iataCode": "78496445",
            "issueCity": "MAD",
            "passengerType": "ADULT",
            "paymentInfo": {
              "type": "CREDIT_CARD",
              "amount": 174.93
            },
            "emdsList": [],
            "creditCardFeePrice": null,
            "conjunctionTickets": null,
            "reissueHistory": [],
            "taxedPrice": {
              "fare": 115,
              "tax": 59.93,
              "total": 174.93,
              "currency": "EUR",
              "ticketingFee": 0
            }
          }
        ],
        "paymentItems": [
          {
            "type": "IBERIA_PAY",
            "tokenizedCardNumber": null,
            "maskedCardNumber": null,
            "authorization": "J003C8",
            "subtotal": 524.79,
            "totalFee": 0,
            "total": 524.79,
            "unityFee": 0,
            "currency": "EUR",
            "cofInclusion": false,
            "dccApplied": null
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
            "priority": 0,
            "conditions": [
              {
                "code": "EQMANO",
                "name": "Equipaje de mano",
                "text": "Incluida 1 pieza hasta 10 kg (56x40x25cm).",
                "units": 1,
                "extendedInfo": {
                  "title": "Equipaje de mano: 1 pieza",
                  "message": "Incluida 1 pieza hasta 10 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                  "code": "CA_EQP_MANO_10KG",
                  "conditionStatus": true
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
                  "conditionStatus": false
                }
              },
              {
                "code": "COMIDA",
                "name": "Comida",
                "text": "Con coste.",
                "units": null,
                "extendedInfo": {
                  "title": "Comida no incluida",
                  "message": "Con coste.",
                  "code": "Comida_no_incluida",
                  "conditionStatus": false
                }
              },
              {
                "code": "ASIENTO",
                "name": "Selección de asiento",
                "text": "Con coste.",
                "units": null,
                "extendedInfo": {
                  "title": "Selección de asiento con coste",
                  "message": "Con coste.",
                  "code": "CA_Asiento_Pago",
                  "conditionStatus": false
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
                  "conditionStatus": false
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
                  "conditionStatus": false
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
                  "conditionStatus": false
                }
              },
              {
                "code": "ASIENTOXL",
                "name": "Asiento espacio extra",
                "text": "Con coste.",
                "units": null,
                "extendedInfo": {
                  "title": "Asiento espacio extra con coste",
                  "message": "Con coste.",
                  "code": "CA_Asiento_XL_Pago",
                  "conditionStatus": false
                }
              },
              {
                "code": "AVIO",
                "name": "AVIOS",
                "text": "Incluido.",
                "units": null,
                "extendedInfo": {
                  "title": "Obtén Avios con tu compra",
                  "message": "Incluido.",
                  "code": "AVIOS incluido",
                  "conditionStatus": false
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
                  "conditionStatus": false
                }
              },
              {
                "code": "CABINA",
                "name": "Cabina",
                "text": "Turista.",
                "units": null,
                "extendedInfo": {
                  "title": "Cabina Turista",
                  "message": "Turista.",
                  "code": "CA_Cabina_Turista",
                  "conditionStatus": false
                }
              },
              {
                "code": "WIFI",
                "name": "WiFi",
                "text": "Disponible con coste, según el tipo de avión.",
                "units": null,
                "extendedInfo": {
                  "title": "Wifi con coste",
                  "message": "Disponible con coste, según el tipo de avión.",
                  "code": "Wifi pago",
                  "conditionStatus": false
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
                  "conditionStatus": false
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
                  "conditionStatus": false
                }
              },
              {
                "code": "ASIENTOPREFERENTE",
                "name": "Asiento preferente",
                "text": "No aplica.",
                "units": null,
                "extendedInfo": {
                  "title": "Asiento preferente no aplica",
                  "message": "No aplica.",
                  "code": "CA_Asiento_Preferente_NO_aplica",
                  "conditionStatus": false
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
                  "conditionStatus": false
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
                  "conditionStatus": false
                }
              }
            ],
            "conditionsPriority": [
              "EQMANO",
              "EQBODEGA",
              "COMIDA",
              "ASIENTO",
              "CAMBIO",
              "REEMBOLSO"
            ]
          }
        ],
        "channel": "IBCOM",
        "onHoldInformation": null,
        "relatedContent": [
          {
            "key": "APIS_DOCUMENT_INFO",
            "value": "Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online"
          }
        ],
        "qualifiers": [],
        "reportingWeb": {
          "device": "DMRC",
          "idColective": "",
          "officeIata": "MADIB08AB",
          "iata": "I",
          "product": "1"
        },
        "flexibilizationCapabilitiesInformation": null,
        "genericDisruptionCapabilitiesInformation": null,
        "upgInformation": {
          "url": null,
          "flightsInformation": null,
          "bidable": false
        },
        "orderFlags": [
          {
            "type": "PRINT_ITINERARY",
            "enabled": true
          },
          {
            "type": "ON_BUSINESS_MODIFICATION",
            "enabled": true
          },
          {
            "type": "ALLOWED_INVOICE_MANAGEMENT",
            "enabled": true
          },
          {
            "type": "VOUCHER_REFUND",
            "enabled": false
          },
          {
            "type": "CASH_REFUND",
            "enabled": false
          },
          {
            "type": "ALLOWED_REFUND_CASH",
            "enabled": false
          },
          {
            "type": "ALLOWED_REFUND_VOUCHER",
            "enabled": false
          },
          {
            "type": "ALLOWED_INVOLUNTARY_FLIGHT_CHANGE",
            "enabled": false
          },
          {
            "type": "ALLOWED_ACCEPT_CHANGES",
            "enabled": false
          },
          {
            "type": "VOUCHER_REFUND_ON_DEMAND",
            "enabled": false
          },
          {
            "type": "VOUCHER_REFUND_RESTRICTION",
            "enabled": false
          },
          {
            "type": "ALLOWED_VOUCHER_COMPENSATION",
            "enabled": true
          }
        ],
        "isAirShuttle": false,
        "isOnHold": false
    };

    var fakeOpenVoucherRefundModal = true;

    beforeEach(function() {
        angular.mock.module('ib-MmB-voucher-refund-module' ,'LocalStorageModule', function($provide){
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('$filter', $filterFake);
            $provide.value('IbFlagsTransformer', fakeIbFlagsTransformer);
        });
        inject(function(_$controller_, _$rootScope_, _localStorageService_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            localStorage.set('phonesList', fakePhoneList);
            localStorage.set('voucherList', fakeVoucherList);
            localStorage.set('bookingInfo', fakeBookingInfo);
            localStorage.set('openVoucherRefundModal', fakeOpenVoucherRefundModal);
            controller = $controller('VoucherRefundController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    it('VoucherRefundController should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('test for VoucherRefundController.$onInit', function() {
        controller.contactData = {};
        controller.isDisruption = true;
        controller.$onInit();
        expect(controller.$onInit).toBeDefined();
        expect(controller.openVoucherRefundModal).toBe(true);
    });
});
