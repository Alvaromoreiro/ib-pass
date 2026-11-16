describe('ibMmbChangeFlightsTabComponent test', () => {

    var controller, $scope,$rootScope, localStorage, $q, $injector;
    var fakeBookingDashboardConstants = {
        TABS:{
            management: { name: 'management', isSubtab: false },
        }
    };

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy(),
        addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo') 
    };
    var fakeMmBAppConstants = {
        TOGGLE: {
            isActiveDeinvoicing: true
        },
        QUADRIGAM: {
            STOP_OVER: 'STOP_OVER',
            COMPLETE_TRAVEL: 'COMPLETE_TRAVEL',
            FLEXIBILIZATION_SEARCH_ONE_WAY: 'FLEXIBILIZATION_SEARCH_ONE_WAY',
            CHANGE_FLIGHTS_SARCH_ONE_WAY: 'CHANGE_FLIGHTS_SARCH_ONE_WAY',
            FLEXIBILIZATION_SEARCH_WITH_RETURN: 'FLEXIBILIZATION_SEARCH_WITH_RETURN',
            CHANGE_FLIGHTS_SEARCH_WITH_RETURN: 'CHANGE_FLIGHTS_SEARCH_WITH_RETURN',
            MANAGE_RESERV: 'MANAGE_RESERV'
        },
        PNR_EMITION_CHANNEL: {
            FLEX_FLIGHT_DIRECT: [
                'IBCOM',
                'CALL_CENTER',
                'NDC_DIRECT'
            ],
            FLEX_FLIGHT_INDIRECT: [
                'NDC_INDIRECT',
                'OTHER',
            ],
        },
        ORDER_ITEMS_TYPE_TO_AVOID: ['baggage', 'specialEquipment', 'flexibilityOnDemand', 'priorityBoarding'],
        COMMON_LABELS: {
            CHANNEL: {
                IBCOM: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_DIRECT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_INDIRECT: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                CALL_CENTER: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                OTHER: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                DEFAULT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                }


            }
        },
        WCS: {
            'PHONE_TYPES': {
                'SALES': 'RESERVAS',
                'IBHOLIDAYS': 'ATTBAH'
            }
        }
    };
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            VIEW: 'VIEW'
        },
        DIGITAL_DATA_PROCESS: {
            ATCFCNA: 'test',
            CVFFOW: 'test',
            ATCFOW: 'test',
            CVFFRT: 'test'
        },
        DIGITAL_DATA_STEP: {
            ATCFCNA: 'test',
            CVFFOW: 'test',
            ATCFOW: 'test',
            CVFFRT: 'test'
        }
    };
    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(() => {
            return true;
        }),
        orderItemContained : jasmine.createSpy('orderItemContained').and.callFake(() => {
            return true;
        })
    };
    var fakeWindow = {
        'open': function(){

        }
    }
    var fakeMmBModalService = {
        showGenericModal : jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': {
                    'then': () => {}
                }
            };
        }),
        showWaitingModal:jasmine.createSpy(),
        finishWaiting:jasmine.createSpy(),
        showEmptyBasketModal: jasmine.createSpy('showEmptyBasketModal').and.callFake(() => {
            return {
                'result': $q.when({})
            };
        })
    };

    var fakeBookingInfo = {
        "flowId":"TWFuYWdlTXlCb29raW5nQElCNmU1NzgyZjg1ODVhNDIzM2EwZDJkOTdiZDkxODFjOTg%3D",
        "order":{
        "orderId":"Qm9va2luZ0BJQmY5M2ZkMzA5ZmQ5ZTRjNTVhMjdiMWQ3YzA4OTgzZjA1T1A%3D",
        "status":"ISSUED",
        "bookingReferences":[
            {
                "provider":"IB",
                "reference":"K5X6T"
            }
        ],
        "orderItems":[
            {
                "type":"flight",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_01",
                "bookingReferences":[
                    {
                    "provider":"IB",
                    "reference":"K5X6T"
                    }
                ],
                "price":{
                    "fare":114,
                    "tax":98.02,
                    "total":212.02,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceIds":[
                    "MADFCO20210315090500",
                    "FCOMAD20210322121500"
                ],
                "passengerPrices":[
                    {
                    "fareCalculation":"MAD IB ROM28.29IB MAD40.33NUC68.62END ROE0.830521",
                    "passengerId":"ADULT_01",
                    "price":{
                        "fare":57,
                        "tax":49.01,
                        "total":106.01,
                        "currency":"EUR",
                        "ticketingFee":0
                    },
                    "segmentPrices":[
                        {
                            "price":null,
                            "fareCode":"ADNNANB4",
                            "segmentsIds":[
                                "IB323020210315"
                            ],
                            "ticketDesignator":"",
                            "penalties":[

                            ]
                        },
                        {
                            "price":null,
                            "fareCode":"OWNNANB4",
                            "segmentsIds":[
                                "IB323120210322"
                            ],
                            "ticketDesignator":"",
                            "penalties":[

                            ]
                        }
                    ],
                    "taxes":[
                        {
                            "code":"JD",
                            "amount":14.95,
                            "currency":"EUR",
                            "description":"Cargo por salida"
                        },
                        {
                            "code":"OG",
                            "amount":0.62,
                            "currency":"EUR",
                            "description":"Tasa de seguridad"
                        },
                        {
                            "code":"QV",
                            "amount":3.38,
                            "currency":"EUR",
                            "description":"Seguridad"
                        },
                        {
                            "code":"EX",
                            "amount":2.32,
                            "currency":"EUR",
                            "description":"Cargo por seguridad del equipaje"
                        },
                        {
                            "code":"HB",
                            "amount":7.5,
                            "currency":"EUR",
                            "description":"Tasa municipal"
                        },
                        {
                            "code":"IT",
                            "amount":15.99,
                            "currency":"EUR",
                            "description":"Tasa de embarque"
                        },
                        {
                            "code":"MJ",
                            "amount":1.05,
                            "currency":"EUR",
                            "description":"Cargo por servicio al pasajero"
                        },
                        {
                            "code":"VT",
                            "amount":3.2,
                            "currency":"EUR",
                            "description":"Cargo por seguridad"
                        }
                    ],
                    "orderItemPaymentInfos":[

                    ]
                    },
                    {
                    "fareCalculation":"MAD IB ROM28.29IB MAD40.33NUC68.62END ROE0.830521",
                    "passengerId":"ADULT_02",
                    "price":{
                        "fare":57,
                        "tax":49.01,
                        "total":106.01,
                        "currency":"EUR",
                        "ticketingFee":0
                    },
                    "segmentPrices":[
                        {
                            "price":null,
                            "fareCode":"ADNNANB4",
                            "segmentsIds":[
                                "IB323020210315"
                            ],
                            "ticketDesignator":"",
                            "penalties":[

                            ]
                        },
                        {
                            "price":null,
                            "fareCode":"OWNNANB4",
                            "segmentsIds":[
                                "IB323120210322"
                            ],
                            "ticketDesignator":"",
                            "penalties":[

                            ]
                        }
                    ],
                    "taxes":[
                        {
                            "code":"JD",
                            "amount":14.95,
                            "currency":"EUR",
                            "description":"Cargo por salida"
                        },
                        {
                            "code":"OG",
                            "amount":0.62,
                            "currency":"EUR",
                            "description":"Tasa de seguridad"
                        },
                        {
                            "code":"QV",
                            "amount":3.38,
                            "currency":"EUR",
                            "description":"Seguridad"
                        },
                        {
                            "code":"EX",
                            "amount":2.32,
                            "currency":"EUR",
                            "description":"Cargo por seguridad del equipaje"
                        },
                        {
                            "code":"HB",
                            "amount":7.5,
                            "currency":"EUR",
                            "description":"Tasa municipal"
                        },
                        {
                            "code":"IT",
                            "amount":15.99,
                            "currency":"EUR",
                            "description":"Tasa de embarque"
                        },
                        {
                            "code":"MJ",
                            "amount":1.05,
                            "currency":"EUR",
                            "description":"Cargo por servicio al pasajero"
                        },
                        {
                            "code":"VT",
                            "amount":3.2,
                            "currency":"EUR",
                            "description":"Cargo por seguridad"
                        }
                    ],
                    "orderItemPaymentInfos":[

                    ]
                    }
                ]
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_02",
                "price":{
                    "fare":120,
                    "tax":0,
                    "total":120,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"FCOMAD20210322121500",
                "passengerId":"ADULT_02",
                "amount":1,
                "emd":"0755569497597",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_32"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_03",
                "price":{
                    "fare":100,
                    "tax":0,
                    "total":100,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"FCOMAD20210322121500",
                "passengerId":"ADULT_02",
                "amount":1,
                "emd":"0755569497596",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_32"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_04",
                "price":{
                    "fare":30,
                    "tax":0,
                    "total":30,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"FCOMAD20210322121500",
                "passengerId":"ADULT_02",
                "amount":1,
                "emd":"0755569497595",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_23"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_05",
                "price":{
                    "fare":25,
                    "tax":0,
                    "total":25,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"FCOMAD20210322121500",
                "passengerId":"ADULT_02",
                "amount":1,
                "emd":"0755569497594",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_23"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_06",
                "price":{
                    "fare":120,
                    "tax":0,
                    "total":120,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"MADFCO20210315090500",
                "passengerId":"ADULT_01",
                "amount":1,
                "emd":"0755569497593",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_32"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_07",
                "price":{
                    "fare":100,
                    "tax":0,
                    "total":100,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"MADFCO20210315090500",
                "passengerId":"ADULT_01",
                "amount":1,
                "emd":"0755569497592",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_32"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_08",
                "price":{
                    "fare":120,
                    "tax":0,
                    "total":120,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"MADFCO20210315090500",
                "passengerId":"ADULT_02",
                "amount":1,
                "emd":"0755569497591",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_32"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_09",
                "price":{
                    "fare":100,
                    "tax":0,
                    "total":100,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"MADFCO20210315090500",
                "passengerId":"ADULT_02",
                "amount":1,
                "emd":"0755569497590",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_32"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_10",
                "price":{
                    "fare":30,
                    "tax":0,
                    "total":30,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"MADFCO20210315090500",
                "passengerId":"ADULT_02",
                "amount":1,
                "emd":"0755569497589",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_23"
            },
            {
                "type":"baggage",
                "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_11",
                "price":{
                    "fare":25,
                    "tax":0,
                    "total":25,
                    "currency":"EUR",
                    "ticketingFee":0
                },
                "sliceId":"MADFCO20210315090500",
                "passengerId":"ADULT_02",
                "amount":1,
                "emd":"0755569497588",
                "orderItemPaymentInfos":[

                ],
                "subtype":"BAGGAGE_23"
            }
        ],
        "slices":[
            {
                "sliceId":"MADFCO20210315090500",
                "type":"REGULAR",
                "departureDateTime":"2021-03-15 09:05",
                "arrivalDateTime":"2021-03-15 11:35",
                "duration":150,
                "stopsNumber":0,
                "detailedPrices":[
                    {
                    "fare":0,
                    "currency":null,
                    "passengerIds":[
                        "ADULT_01",
                        "ADULT_02"
                    ],
                    "segmentPrices":[

                    ]
                    }
                ],
                "segments":[
                    {
                    "type":"CONFIRMED",
                    "mmbAllowed":true,
                    "ckiStatus":{
                        "code":"CHECKABLE",
                        "message":null
                    },
                    "noShow":false,
                    "flyNow":false,
                    "flown":false,
                    "departure":{
                        "code":"MAD",
                        "name":"BARAJAS",
                        "terminal":"4",
                        "city":{
                            "code":"MAD",
                            "description":"Madrid",
                            "countryCode":"ES",
                            "country":{
                                "code":"ES",
                                "description":"España"
                            }
                        }
                    },
                    "arrival":{
                        "code":"FCO",
                        "name":"FIUMICINO",
                        "terminal":"3",
                        "city":{
                            "code":"ROM",
                            "description":"Roma",
                            "countryCode":"IT",
                            "country":{
                                "code":"IT",
                                "description":"Italia"
                            }
                        }
                    },
                    "departureCity":{
                        "code":"MAD",
                        "description":"Madrid",
                        "countryCode":"ES",
                        "timeZone":"Europe/Madrid"
                    },
                    "arrivalCity":{
                        "code":"ROM",
                        "description":"Roma",
                        "countryCode":"IT",
                        "timeZone":"Europe/Rome"
                    },
                    "flight":{
                        "marketingCarrier":{
                            "code":"IB",
                            "name":"Iberia"
                        },
                        "operationalCarrier":{
                            "code":"IB",
                            "name":"Iberia"
                        },
                        "marketingFlightNumber":"3230",
                        "operationalFlightNumber":"3230",
                        "operationalDisclosure":"IB",
                        "aircraft":{
                            "code":"320",
                            "description":"Airbus A320"
                        }
                    },
                    "cabin":{
                        "rbd":"A",
                        "description":"",
                        "remainingSeats":9,
                        "fareFamily":"TBAESEU",
                        "code":"R",
                        "type":"ECONOMY",
                        "bookingClass":"ECONOMY"
                    },
                    "overnight":false,
                    "id":"IB323020210315",
                    "duration":150,
                    "waitingTime":0,
                    "operatorLocator":null,
                    "stop":null,
                    "departureDateTime":"2021-03-15 09:05",
                    "departureUtcDateTime":"2021-03-15T08:05:00.000",
                    "arrivalDateTime":"2021-03-15 11:35",
                    "arrivalUtcDateTime":"2021-03-15T10:35:00.000",
                    "status":{
                        "code":"HK",
                        "description":"Confirmado"
                    }
                    }
                ],
                "overnight":false,
                "passengerFlags":[
                    {
                    "passengerId":"ADULT_01",
                    "flags":[
                        {
                            "type":"FLIGHT_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"FLIGHT_REFUND",
                            "enabled":false
                        },
                        {
                            "type":"FREQUENT_FLYER_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"SPECIAL_NEEDS_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"CONTACT_DATA_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"EMERGENCY_CONTACT_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"PASSENGER_NAME_CORRECTION",
                            "enabled":false
                        },
                        {
                            "type":"ANCILLARIES",
                            "enabled":true
                        },
                        {
                            "type":"FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_MODIFICATION_FLEXIBLE",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_DISRUPTION_SEARCH",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_MODIFICATION_ON_DEMAND",
                            "enabled":false
                        }
                    ]
                    },
                    {
                    "passengerId":"ADULT_02",
                    "flags":[
                        {
                            "type":"FLIGHT_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"FLIGHT_REFUND",
                            "enabled":false
                        },
                        {
                            "type":"FREQUENT_FLYER_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"SPECIAL_NEEDS_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"CONTACT_DATA_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"EMERGENCY_CONTACT_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"PASSENGER_NAME_CORRECTION",
                            "enabled":false
                        },
                        {
                            "type":"ANCILLARIES",
                            "enabled":true
                        },
                        {
                            "type":"FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_MODIFICATION_FLEXIBLE",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_DISRUPTION_SEARCH",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_MODIFICATION_ON_DEMAND",
                            "enabled":false
                        }
                    ]
                    }
                ]
            },
            {
                "sliceId":"FCOMAD20210322121500",
                "type":"REGULAR",
                "departureDateTime":"2021-03-22 12:15",
                "arrivalDateTime":"2021-03-22 14:55",
                "duration":160,
                "stopsNumber":0,
                "detailedPrices":[
                    {
                    "fare":0,
                    "currency":null,
                    "passengerIds":[
                        "ADULT_01",
                        "ADULT_02"
                    ],
                    "segmentPrices":[

                    ]
                    }
                ],
                "segments":[
                    {
                    "type":"CONFIRMED",
                    "mmbAllowed":true,
                    "ckiStatus":{
                        "code":"CHECKABLE",
                        "message":null
                    },
                    "noShow":false,
                    "flyNow":false,
                    "flown":false,
                    "departure":{
                        "code":"FCO",
                        "name":"FIUMICINO",
                        "terminal":"3",
                        "city":{
                            "code":"ROM",
                            "description":"Roma",
                            "countryCode":"IT",
                            "country":{
                                "code":"IT",
                                "description":"Italia"
                            }
                        }
                    },
                    "arrival":{
                        "code":"MAD",
                        "name":"BARAJAS",
                        "terminal":"4",
                        "city":{
                            "code":"MAD",
                            "description":"Madrid",
                            "countryCode":"ES",
                            "country":{
                                "code":"ES",
                                "description":"España"
                            }
                        }
                    },
                    "departureCity":{
                        "code":"ROM",
                        "description":"Roma",
                        "countryCode":"IT",
                        "timeZone":"Europe/Rome"
                    },
                    "arrivalCity":{
                        "code":"MAD",
                        "description":"Madrid",
                        "countryCode":"ES",
                        "timeZone":"Europe/Madrid"
                    },
                    "flight":{
                        "marketingCarrier":{
                            "code":"IB",
                            "name":"Iberia"
                        },
                        "operationalCarrier":{
                            "code":"IB",
                            "name":"Iberia"
                        },
                        "marketingFlightNumber":"3231",
                        "operationalFlightNumber":"3231",
                        "operationalDisclosure":"IB",
                        "aircraft":{
                            "code":"320",
                            "description":"Airbus A320"
                        }
                    },
                    "cabin":{
                        "rbd":"O",
                        "description":"",
                        "remainingSeats":2,
                        "fareFamily":"TBAESEU",
                        "code":"R",
                        "type":"ECONOMY",
                        "bookingClass":"ECONOMY"
                    },
                    "overnight":false,
                    "id":"IB323120210322",
                    "duration":160,
                    "waitingTime":0,
                    "operatorLocator":null,
                    "stop":null,
                    "departureDateTime":"2021-03-22 12:15",
                    "departureUtcDateTime":"2021-03-22T11:15:00.000",
                    "arrivalDateTime":"2021-03-22 14:55",
                    "arrivalUtcDateTime":"2021-03-22T13:55:00.000",
                    "status":{
                        "code":"HK",
                        "description":"Confirmado"
                    }
                    }
                ],
                "overnight":false,
                "passengerFlags":[
                    {
                    "passengerId":"ADULT_01",
                    "flags":[
                        {
                            "type":"FLIGHT_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"FLIGHT_REFUND",
                            "enabled":false
                        },
                        {
                            "type":"FREQUENT_FLYER_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"SPECIAL_NEEDS_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"CONTACT_DATA_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"EMERGENCY_CONTACT_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"PASSENGER_NAME_CORRECTION",
                            "enabled":false
                        },
                        {
                            "type":"ANCILLARIES",
                            "enabled":true
                        },
                        {
                            "type":"FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_MODIFICATION_FLEXIBLE",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_DISRUPTION_SEARCH",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_MODIFICATION_ON_DEMAND",
                            "enabled":false
                        }
                    ]
                    },
                    {
                    "passengerId":"ADULT_02",
                    "flags":[
                        {
                            "type":"FLIGHT_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"FLIGHT_REFUND",
                            "enabled":false
                        },
                        {
                            "type":"FREQUENT_FLYER_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"SPECIAL_NEEDS_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"CONTACT_DATA_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"EMERGENCY_CONTACT_MODIFICATION",
                            "enabled":true
                        },
                        {
                            "type":"PASSENGER_NAME_CORRECTION",
                            "enabled":false
                        },
                        {
                            "type":"ANCILLARIES",
                            "enabled":true
                        },
                        {
                            "type":"FLIGHT_DISRUPTION_SEARCH_FLEXIBLE",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_MODIFICATION_FLEXIBLE",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_DISRUPTION_SEARCH",
                            "enabled":false
                        },
                        {
                            "type":"FLIGHT_MODIFICATION_ON_DEMAND",
                            "enabled":false
                        }
                    ]
                    }
                ]
            }
        ],
        "price":{
            "fare":884,
            "tax":98.02,
            "total":982.02,
            "currency":"EUR",
            "ticketingFee":0
        },
        "primaryContactInfo":{
            "phone":"346545643433",
            "email":"MARIALUISA.RAMOS@PANEL.ES",
            "phoneType":"MOBILE",
            "confirmationMailOption":null
        },
        "optionalInformation":[

        ],
        "cashAviosPossibilities":[

        ],
        "specialDiscounts":[

        ],
        "checkedBagAllowances":[
            {
                "type":"PIECE",
                "segmentIds":[
                    "IB323020210315",
                    "IB323120210322"
                ],
                "totalQuantity":0
            }
        ],
        "accrualQuote":{
            "redemptionPoints":418,
            "qualificationPoints":80
        },
        "aviosRedeemed":null,
        "pointsRedeemed":null
        },
        "passengers":[
        {
            "passengerType":"ADULT",
            "personalInfo":{
                "name":"ADULTA",
                "surname":"DOS",
                "birthDate":null
            },
            "passengerId":"ADULT_01",
            "relatedPassengerId":"",
            "ckiStatus":null,
            "optionalInformation":[

            ],
            "residenceAccreditationStatus":null,
            "resiberPassengerId":"1"
        },
        {
            "passengerType":"ADULT",
            "personalInfo":{
                "name":"ADULTO",
                "surname":"UNO",
                "birthDate":null
            },
            "passengerId":"ADULT_02",
            "contactInfo":{
                "phone":"346545643433",
                "email":"marialuisa.ramos@panel.es",
                "phoneType":"MOBILE",
                "confirmationMailOption":null
            },
            "relatedPassengerId":"",
            "ckiStatus":null,
            "optionalInformation":[

            ],
            "residenceAccreditationStatus":null,
            "resiberPassengerId":"2"
        }
        ],
        "tickets":[
        {
            "ticketNumbers":[
                "0752393604487"
            ],
            "type":"ET",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_01",
            "passengerId":"ADULT_01",
            "issueDateTime":"2021-03-01 12:59",
            "fareCalculation":"MAD IB ROM28.29IB MAD40.33NUC68.62END ROE0.830521",
            "taxes":[
                {
                    "code":"JD",
                    "amount":14.95,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"OG",
                    "amount":0.62,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"QV",
                    "amount":3.38,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"EX",
                    "amount":2.32,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"HB",
                    "amount":7.5,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"IT",
                    "amount":15.99,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"MJ",
                    "amount":1.05,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"VT",
                    "amount":3.2,
                    "currency":"EUR",
                    "description":""
                }
            ],
            "coupons":[
                {
                    "arrival":"FCO",
                    "departure":"MAD",
                    "departureDate":"2021-03-15T09:05:00.000",
                    "status":"OPEN FOR USE",
                    "fareBasis":"ADNNANB4",
                    "carrier":"IB",
                    "flightNumber":"3230",
                    "flightStatus":"OK",
                    "operatingCarrier":null,
                    "bookingCode":"A",
                    "designator":"",
                    "couponNumber":"1",
                    "remark":null,
                    "baggageDetail":{
                    "freeAllowance":0,
                    "quantityCode":"PC",
                    "unitQualifier":"PC"
                    }
                },
                {
                    "arrival":"MAD",
                    "departure":"FCO",
                    "departureDate":"2021-03-22T12:15:00.000",
                    "status":"OPEN FOR USE",
                    "fareBasis":"OWNNANB4",
                    "carrier":"IB",
                    "flightNumber":"3231",
                    "flightStatus":"OK",
                    "operatingCarrier":null,
                    "bookingCode":"O",
                    "designator":"",
                    "couponNumber":"2",
                    "remark":null,
                    "baggageDetail":{
                    "freeAllowance":0,
                    "quantityCode":"PC",
                    "unitQualifier":"PC"
                    }
                }
            ],
            "iataCode":"78496445",
            "issueCity":"MAD",
            "passengerType":"ADULT",
            "paymentInfo":{
                "type":"CREDIT_CARD",
                "amount":106.01
            },
            "emdsList":[
                {
                    "emdNumber":"0755569497593",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"1",
                        "documentNumber":"0752393604487",
                        "serviceCode":"C0FM",
                        "serviceDescription":"BAGGAGE UP TO 32KGS",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-15T09:05:00.000",
                        "value":{
                            "fare":120,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                },
                {
                    "emdNumber":"0755569497592",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"1",
                        "documentNumber":"0752393604487",
                        "serviceCode":"C0FM",
                        "serviceDescription":"BAGGAGE UP TO 32KGS",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-15T09:05:00.000",
                        "value":{
                            "fare":100,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                }
            ],
            "creditCardFeePrice":null,
            "taxedPrice":{
                "fare":57,
                "tax":49.01,
                "total":106.01,
                "currency":"EUR",
                "ticketingFee":0
            }
        },
        {
            "ticketNumbers":[
                "0752393604486"
            ],
            "type":"ET",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_01",
            "passengerId":"ADULT_02",
            "issueDateTime":"2021-03-01 12:59",
            "fareCalculation":"MAD IB ROM28.29IB MAD40.33NUC68.62END ROE0.830521",
            "taxes":[
                {
                    "code":"JD",
                    "amount":14.95,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"OG",
                    "amount":0.62,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"QV",
                    "amount":3.38,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"EX",
                    "amount":2.32,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"HB",
                    "amount":7.5,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"IT",
                    "amount":15.99,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"MJ",
                    "amount":1.05,
                    "currency":"EUR",
                    "description":""
                },
                {
                    "code":"VT",
                    "amount":3.2,
                    "currency":"EUR",
                    "description":""
                }
            ],
            "coupons":[
                {
                    "arrival":"FCO",
                    "departure":"MAD",
                    "departureDate":"2021-03-15T09:05:00.000",
                    "status":"OPEN FOR USE",
                    "fareBasis":"ADNNANB4",
                    "carrier":"IB",
                    "flightNumber":"3230",
                    "flightStatus":"OK",
                    "operatingCarrier":null,
                    "bookingCode":"A",
                    "designator":"",
                    "couponNumber":"1",
                    "remark":null,
                    "baggageDetail":{
                    "freeAllowance":0,
                    "quantityCode":"PC",
                    "unitQualifier":"PC"
                    }
                },
                {
                    "arrival":"MAD",
                    "departure":"FCO",
                    "departureDate":"2021-03-22T12:15:00.000",
                    "status":"OPEN FOR USE",
                    "fareBasis":"OWNNANB4",
                    "carrier":"IB",
                    "flightNumber":"3231",
                    "flightStatus":"OK",
                    "operatingCarrier":null,
                    "bookingCode":"O",
                    "designator":"",
                    "couponNumber":"2",
                    "remark":null,
                    "baggageDetail":{
                    "freeAllowance":0,
                    "quantityCode":"PC",
                    "unitQualifier":"PC"
                    }
                }
            ],
            "iataCode":"78496445",
            "issueCity":"MAD",
            "passengerType":"ADULT",
            "paymentInfo":{
                "type":"CREDIT_CARD",
                "amount":106.01
            },
            "emdsList":[
                {
                    "emdNumber":"0755569497591",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"1",
                        "documentNumber":"0752393604486",
                        "serviceCode":"C0FM",
                        "serviceDescription":"BAGGAGE UP TO 32KGS",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-15T09:05:00.000",
                        "value":{
                            "fare":120,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                },
                {
                    "emdNumber":"0755569497590",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"1",
                        "documentNumber":"0752393604486",
                        "serviceCode":"C0FM",
                        "serviceDescription":"BAGGAGE UP TO 32KGS",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-15T09:05:00.000",
                        "value":{
                            "fare":100,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                },
                {
                    "emdNumber":"0755569497589",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"1",
                        "documentNumber":"0752393604486",
                        "serviceCode":"C0GO",
                        "serviceDescription":"EXTRA PIECE",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-15T09:05:00.000",
                        "value":{
                            "fare":30,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                },
                {
                    "emdNumber":"0755569497588",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"1",
                        "documentNumber":"0752393604486",
                        "serviceCode":"C0GO",
                        "serviceDescription":"EXTRA PIECE",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-15T09:05:00.000",
                        "value":{
                            "fare":25,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                },
                {
                    "emdNumber":"0755569497597",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"2",
                        "documentNumber":"0752393604486",
                        "serviceCode":"C0FM",
                        "serviceDescription":"BAGGAGE UP TO 32KGS",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-22T12:15:00.000",
                        "value":{
                            "fare":120,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                },
                {
                    "emdNumber":"0755569497596",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"2",
                        "documentNumber":"0752393604486",
                        "serviceCode":"C0FM",
                        "serviceDescription":"BAGGAGE UP TO 32KGS",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-22T12:15:00.000",
                        "value":{
                            "fare":100,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                },
                {
                    "emdNumber":"0755569497595",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"2",
                        "documentNumber":"0752393604486",
                        "serviceCode":"C0GO",
                        "serviceDescription":"EXTRA PIECE",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-22T12:15:00.000",
                        "value":{
                            "fare":30,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                },
                {
                    "emdNumber":"0755569497594",
                    "issueDateTime":"2021-03-01T13:01:00.000",
                    "description":"1PC",
                    "emdDefinition":"EMD-A (Associated)",
                    "mumberOfBooklets":"1",
                    "code":"J",
                    "tableName":"1001 (Document/ Message Name, coded)",
                    "couponsInfoEMDsWebResponse":[
                    {
                        "couponNumberEMD":"1",
                        "couponNumberTKT":"2",
                        "documentNumber":"0752393604486",
                        "serviceCode":"C0GO",
                        "serviceDescription":"EXTRA PIECE",
                        "associated":true,
                        "status":"OPEN FOR USE",
                        "dateOfService":"2021-03-22T12:15:00.000",
                        "value":{
                            "fare":25,
                            "tax":null,
                            "total":null,
                            "currency":"EUR",
                            "ticketingFee":0
                        }
                    }
                    ]
                }
            ],
            "creditCardFeePrice":null,
            "taxedPrice":{
                "fare":57,
                "tax":49.01,
                "total":106.01,
                "currency":"EUR",
                "ticketingFee":0
            }
        },
        {
            "ticketNumbers":[
                "0755569497597"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_02",
            "passengerId":"ADULT_02",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497596"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_03",
            "passengerId":"ADULT_02",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497595"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_04",
            "passengerId":"ADULT_02",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497594"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_05",
            "passengerId":"ADULT_02",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497593"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_06",
            "passengerId":"ADULT_01",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497592"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_07",
            "passengerId":"ADULT_01",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497591"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_08",
            "passengerId":"ADULT_02",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497590"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_09",
            "passengerId":"ADULT_02",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497589"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_10",
            "passengerId":"ADULT_02",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        },
        {
            "ticketNumbers":[
                "0755569497588"
            ],
            "type":"EMD",
            "orderItemId":"IBf93fd309fd9e4c55a27b1d7c08983f05OP_11",
            "passengerId":"ADULT_02",
            "issueDateTime":null,
            "fareCalculation":null,
            "taxes":[

            ],
            "coupons":[
                {
                    "arrival":null,
                    "departure":null,
                    "departureDate":null,
                    "status":"OPEN FOR USE",
                    "fareBasis":null,
                    "carrier":null,
                    "flightNumber":null,
                    "flightStatus":null,
                    "operatingCarrier":null,
                    "bookingCode":null,
                    "designator":null,
                    "couponNumber":null,
                    "remark":null,
                    "baggageDetail":null
                }
            ],
            "iataCode":null,
            "issueCity":null,
            "passengerType":null,
            "paymentInfo":null,
            "emdsList":[

            ],
            "creditCardFeePrice":null,
            "taxedPrice":null
        }
        ],
        "paymentItems":[
        {
            "type":"IBERIA_PAY",
            "tokenizedCardNumber":null,
            "maskedCardNumber":null,
            "authorization":"J0SBA4",
            "subtotal":212.02,
            "totalFee":0,
            "total":212.02,
            "unityFee":0,
            "currency":"EUR"
        }
        ],
        "contextMetadata":{
        "language":"es",
        "country":"ES",
        "currencies":[
            {
                "code":"EUR",
                "description":"Euro",
                "symbol":"€",
                "alignment":"R",
                "groupingSeparator":".",
                "decimalSeparator":",",
                "decimals":2,
                "recommendedDisplay":"symbol"
            }
        ]
        },
        "fareFamilyConditions":[
        {
            "cabinType":"E",
            "cabinDescription":"Turista",
            "commercialCode":"TBAESEU",
            "commercialName":"Básica",
            "commercialNameES":"Básica",
            "priority":0,
            "conditions":[
                {
                    "code":"EQMANO",
                    "name":"Equipaje de mano",
                    "text":"1 bulto (56x40x25cm)",
                    "units":1,
                    "extendedInfo":{
                    "title":"1 bulto en cabina  (56x40x25cm)",
                    "message":"1 bulto (56x40x25cm)",
                    "code":"CA_EQP_MANO_10KG",
                    "conditionStatus":true
                    }
                },
                {
                    "code":"EQBODEGA",
                    "name":"Equipaje en bodega",
                    "text":"No incluido.",
                    "units":null,
                    "extendedInfo":{
                    "title":"Sin equipaje en bodega",
                    "message":"No incluido. ",
                    "code":"CA_1_PIEZAS_PAGO",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"ASIENTO",
                    "name":"Selección de asiento",
                    "text":"De pago.",
                    "units":null,
                    "extendedInfo":{
                    "title":"Seleccionable con coste",
                    "message":"De pago. <a target=\"_blank\" href=\"http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es\">Política de reserva anticipada de asientos</a>",
                    "code":"CA_Asiento_Pago",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"CAMBIO",
                    "name":"Cambios",
                    "text":"Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio",
                    "units":65,
                    "extendedInfo":{
                    "title":"Cambio permitido con coste",
                    "message":"Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio",
                    "code":"CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"REEMBOLSO",
                    "name":"Reembolso (por sentido)",
                    "text":"No permitido",
                    "units":null,
                    "extendedInfo":{
                    "title":"Reembolso no permitido",
                    "message":"No permitido.",
                    "code":"CA_REEMBOLSO NO PERMITIDO",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"TARJEMBANTIC",
                    "name":"Tarjeta de embarque anticipada",
                    "text":"No incluido",
                    "units":null,
                    "extendedInfo":{
                    "title":"No incluido",
                    "message":"No incluido",
                    "code":"CA_Tarjeta_embarque_anticipada_no_incluido",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"EMBARQUE",
                    "name":"Prioridad de Embarque",
                    "text":"No",
                    "units":null,
                    "extendedInfo":{
                    "title":"",
                    "message":"No",
                    "code":"CA_Embarque_NO_Prioritario",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"SALAVIP",
                    "name":"Acceso a salas VIP",
                    "text":"No",
                    "units":null,
                    "extendedInfo":{
                    "title":"",
                    "message":"No",
                    "code":"Acceso a salas VIP No permitido",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"CABINA",
                    "name":"Cabina",
                    "text":"Turista",
                    "units":null,
                    "extendedInfo":{
                    "title":"",
                    "message":"Turista",
                    "code":"CA_Cabina_Turista",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"CHECKINDESK",
                    "name":"Mostrador check-in exclusivo",
                    "text":"No",
                    "units":null,
                    "extendedInfo":{
                    "title":"",
                    "message":"No",
                    "code":"Chek-in_desk_ NO",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"ASIENTOXL",
                    "name":"Selección de asiento XL",
                    "text":"De pago",
                    "units":null,
                    "extendedInfo":{
                    "title":"Seleccionable con coste",
                    "message":"De pago",
                    "code":"CA_Asiento_XL_Pago",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"FASTTRACK",
                    "name":"Fast Track",
                    "text":"No",
                    "units":null,
                    "extendedInfo":{
                    "title":"",
                    "message":"No",
                    "code":"Fast Track NO",
                    "conditionStatus":false
                    }
                },
                {
                    "code":"EQPPRIOR",
                    "name":"Entrega prioritaria equipaje",
                    "text":"No",
                    "units":null,
                    "extendedInfo":{
                    "title":"",
                    "message":"No",
                    "code":"Entrega_prioritaria_equipaje_ NO",
                    "conditionStatus":false
                    }
                }
            ],
            "conditionsPriority":[
                "EQMANO",
                "EQBODEGA",
                "ASIENTO",
                "CAMBIO",
                "REEMBOLSO"
            ]
        }
        ],
        "channel":"IBCOM",
        "onHoldInformation":null,
        "relatedContent":[

        ],
        "qualifiers":[

        ],
        "reportingWeb":{
        "device":"DMRC",
        "idColective":"",
        "officeIata":"MADIB08AB",
        "iata":"I",
        "product":"1"
        },
        "flexibilizationCapabilitiesInformation":null,
        "genericDisruptionCapabilitiesInformation":null,
        "upgInformation":{
        "url":null,
        "flightsInformation":null,
        "bidable":false
        },
        "orderFlags":[
        {
            "type":"PRINT_ITINERARY",
            "enabled":true
        },
        {
            "type":"ON_BUSINESS_MODIFICATION",
            "enabled":true
        },
        {
            "type":"VOUCHER_REFUND",
            "enabled":false
        },
        {
            "type":"CASH_REFUND",
            "enabled":false
        },
        {
            "type":"ALLOWED_REFUND_CASH",
            "enabled":false
        },
        {
            "type":"ALLOWED_REFUND_VOUCHER",
            "enabled":false
        },
        {
            "type":"ALLOWED_INVOLUNTARY_FLIGHT_CHANGE",
            "enabled":false
        },
        {
            "type":"VOUCHER_REFUND_ON_DEMAND",
            "enabled":false
        },
        {
            "type":"VOUCHER_REFUND_RESTRICTION",
            "enabled":false
        },
        {
            "type":"ALLOWED_VOUCHER_COMPENSATION",
            "enabled":true
        },
        {
            "type":"ALLOWED_SISTER_CITIES",
            "enabled":true
        }
        ],
        "isAirShuttle":false,
        "isOnHold":false,
    };
    var fakeReshopConditions = {
        "voluntaryChanges": {
            "flowType": "VOLUNTARY_CHANGE",
            "enabled": true,
            "slices": [{
                'sliceId': 'MADFCO20210315090500',
                "enabled": true,
            },{
                'sliceId': 'FCOMAD20210322121500',
                "enabled": true,
            }],
            "reservationFailedConditions": [
                {
                    "code": "REDEMPTION_RESERVE_AVIOS",
                    "reason": "Lo sentimos: las reservas pagadas con Avios no permiten realizar ningún cambio online. Si necesitas más información, contacta con nuestro Centro de Atención al Cliente llamando al 901 11 15 00."
                }
            ],
            "warnings": []
        },
        "involuntaryChanges": {
            "flowType": "INVOLUNTARY",
            "enabled": false,
            "slices": [],
            "reservationFailedConditions": [],
            "warnings": []
        },
        "callcenterInfo": {
            "flowType": "CALL_CENTER",
            "enabled": true,
            "slices": [],
            "reservationFailedConditions": [],
            "warnings": []
        }
    }
    var fakePhoneList = {"RESERVAS":{'prefix':'(+34)','telephone':'901 111 500','text':'Reservas y Venta:','prefixAlt':'','telephoneAlt':'','textAlt':'','timeText':'24h'}};
    var fakeFlightsInfo = {
        'noIberiaFlag': false,
        'flights': {
            'MADFCO20210315090500': {
                'departureCity': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'arrivalCity': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'departureCountry': 'ES',
                'arrivalCountry': 'IT',
                'segments': [
                    {
                        'departureCity': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrivalCity': {
                            'code': 'FCO',
                            'name': 'FIUMICINO',
                            'terminal': '3',
                            'city': {
                                'code': 'ROM',
                                'description': 'Roma',
                                'countryCode': 'IT',
                                'country': {
                                    'code': 'IT',
                                    'description': 'Italia'
                                }
                            }
                        },
                        'departureDateParsed': {
                            'dateTime': '09:05',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 15,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2021,
                            'originalDate': '2021-03-15T09:05:00+01:00',
                            'formatedDate': '15/03/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '11:35',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 15,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2021,
                            'originalDate': '2021-03-15T11:35:00+01:00',
                            'formatedDate': '15/03/2021'
                        },
                        'companyURL': '/aerolineas/logo_pos_IB.svg',
                        'overnight': false,
                        'departureDateTimeParsed': '09:05',
                        'arrivalDateTimeParsed': '11:35',
                        'departure': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrival': {
                            'code': 'FCO',
                            'name': 'FIUMICINO',
                            'terminal': '3',
                            'city': {
                                'code': 'ROM',
                                'description': 'Roma',
                                'countryCode': 'IT',
                                'country': {
                                    'code': 'IT',
                                    'description': 'Italia'
                                }
                            }
                        },
                        'flight': {
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'operationalCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'marketingFlightNumber': '3230',
                            'operationalFlightNumber': '3230',
                            'operationalDisclosure': 'IB',
                            'aircraft': {
                                'code': '320',
                                'description': 'Airbus A320'
                            }
                        },
                        'durationParsed': '02h 30min.',
                        'fareFamilyConditions': [
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQMANO',
                                'name': 'Equipaje de mano',
                                'title': '1 bulto en cabina  (56x40x25cm)',
                                'message': '1 bulto (56x40x25cm)',
                                'units': 1,
                                '$$hashKey': 'object:137'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQBODEGA',
                                'name': 'Equipaje en bodega',
                                'title': 'Sin equipaje en bodega',
                                'message': 'No incluido. ',
                                'units': null,
                                '$$hashKey': 'object:138'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'ASIENTO',
                                'name': 'Selección de asiento',
                                'title': 'Seleccionable con coste',
                                'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                                'units': null,
                                '$$hashKey': 'object:139'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CAMBIO',
                                'name': 'Cambios',
                                'title': 'Cambio permitido con coste',
                                'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                'units': 65,
                                '$$hashKey': 'object:140'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'REEMBOLSO',
                                'name': 'Reembolso (por sentido)',
                                'title': 'Reembolso no permitido',
                                'message': 'No permitido.',
                                'units': null,
                                '$$hashKey': 'object:141'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'TARJEMBANTIC',
                                'name': 'Tarjeta de embarque anticipada',
                                'title': 'No incluido',
                                'message': 'No incluido',
                                'units': null,
                                '$$hashKey': 'object:142'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EMBARQUE',
                                'name': 'Prioridad de Embarque',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:143'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'SALAVIP',
                                'name': 'Acceso a salas VIP',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:144'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CABINA',
                                'name': 'Cabina',
                                'title': '',
                                'message': 'Turista',
                                'units': null,
                                '$$hashKey': 'object:145'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CHECKINDESK',
                                'name': 'Mostrador check-in exclusivo',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:146'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'ASIENTOXL',
                                'name': 'Selección de asiento XL',
                                'title': 'Seleccionable con coste',
                                'message': 'De pago',
                                'units': null,
                                '$$hashKey': 'object:147'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'FASTTRACK',
                                'name': 'Fast Track',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:148'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQPPRIOR',
                                'name': 'Entrega prioritaria equipaje',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:149'
                            }
                        ],
                        'segmentId': 'IB323020210315',
                        'sliceId': 'MADFCO20210315090500',
                        'status': {
                            'code': 'HK',
                            'description': 'Confirmado'
                        },
                        'cabin': {
                            'rbd': 'A',
                            'description': '',
                            'remainingSeats': 9,
                            'fareFamily': 'TBAESEU',
                            'code': 'R',
                            'type': 'ECONOMY',
                            'bookingClass': 'ECONOMY'
                        },
                        'flown': false,
                        'warnings': {},
                        'stop': null
                    }
                ],
                'departureDateParsed': {
                    'dateTime': '09:05',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 15,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-15T09:05:00+01:00',
                    'formatedDate': '15/03/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '11:35',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 15,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-15T11:35:00+01:00',
                    'formatedDate': '15/03/2021'
                },
                'durationParsed': '02h 30min.',
                'stopsNumber': 0,
                'daysToGo': 3,
                'checked': false,
                'parseNewDateSelected': null
            },
            'FCOMAD20210322121500': {
                'departureCity': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'arrivalCity': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'departureCountry': 'IT',
                'arrivalCountry': 'ES',
                'segments': [
                    {
                        'departureCity': {
                            'code': 'FCO',
                            'name': 'FIUMICINO',
                            'terminal': '3',
                            'city': {
                                'code': 'ROM',
                                'description': 'Roma',
                                'countryCode': 'IT',
                                'country': {
                                    'code': 'IT',
                                    'description': 'Italia'
                                }
                            }
                        },
                        'arrivalCity': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'departureDateParsed': {
                            'dateTime': '12:15',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 22,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2021,
                            'originalDate': '2021-03-22T12:15:00+01:00',
                            'formatedDate': '22/03/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '14:55',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 22,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2021,
                            'originalDate': '2021-03-22T14:55:00+01:00',
                            'formatedDate': '22/03/2021'
                        },
                        'companyURL': '/aerolineas/logo_pos_IB.svg',
                        'overnight': false,
                        'departureDateTimeParsed': '12:15',
                        'arrivalDateTimeParsed': '14:55',
                        'departure': {
                            'code': 'FCO',
                            'name': 'FIUMICINO',
                            'terminal': '3',
                            'city': {
                                'code': 'ROM',
                                'description': 'Roma',
                                'countryCode': 'IT',
                                'country': {
                                    'code': 'IT',
                                    'description': 'Italia'
                                }
                            }
                        },
                        'arrival': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'flight': {
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'operationalCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'marketingFlightNumber': '3231',
                            'operationalFlightNumber': '3231',
                            'operationalDisclosure': 'IB',
                            'aircraft': {
                                'code': '320',
                                'description': 'Airbus A320'
                            }
                        },
                        'durationParsed': '02h 40min.',
                        'fareFamilyConditions': [
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQMANO',
                                'name': 'Equipaje de mano',
                                'title': '1 bulto en cabina  (56x40x25cm)',
                                'message': '1 bulto (56x40x25cm)',
                                'units': 1,
                                '$$hashKey': 'object:167'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQBODEGA',
                                'name': 'Equipaje en bodega',
                                'title': 'Sin equipaje en bodega',
                                'message': 'No incluido. ',
                                'units': null,
                                '$$hashKey': 'object:168'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'ASIENTO',
                                'name': 'Selección de asiento',
                                'title': 'Seleccionable con coste',
                                'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                                'units': null,
                                '$$hashKey': 'object:169'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CAMBIO',
                                'name': 'Cambios',
                                'title': 'Cambio permitido con coste',
                                'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                'units': 65,
                                '$$hashKey': 'object:170'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'REEMBOLSO',
                                'name': 'Reembolso (por sentido)',
                                'title': 'Reembolso no permitido',
                                'message': 'No permitido.',
                                'units': null,
                                '$$hashKey': 'object:171'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'TARJEMBANTIC',
                                'name': 'Tarjeta de embarque anticipada',
                                'title': 'No incluido',
                                'message': 'No incluido',
                                'units': null,
                                '$$hashKey': 'object:172'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EMBARQUE',
                                'name': 'Prioridad de Embarque',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:173'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'SALAVIP',
                                'name': 'Acceso a salas VIP',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:174'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CABINA',
                                'name': 'Cabina',
                                'title': '',
                                'message': 'Turista',
                                'units': null,
                                '$$hashKey': 'object:175'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CHECKINDESK',
                                'name': 'Mostrador check-in exclusivo',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:176'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'ASIENTOXL',
                                'name': 'Selección de asiento XL',
                                'title': 'Seleccionable con coste',
                                'message': 'De pago',
                                'units': null,
                                '$$hashKey': 'object:177'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'FASTTRACK',
                                'name': 'Fast Track',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:178'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQPPRIOR',
                                'name': 'Entrega prioritaria equipaje',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:179'
                            }
                        ],
                        'segmentId': 'IB323120210322',
                        'sliceId': 'FCOMAD20210322121500',
                        'status': {
                            'code': 'HK',
                            'description': 'Confirmado'
                        },
                        'cabin': {
                            'rbd': 'O',
                            'description': '',
                            'remainingSeats': 2,
                            'fareFamily': 'TBAESEU',
                            'code': 'R',
                            'type': 'ECONOMY',
                            'bookingClass': 'ECONOMY'
                        },
                        'flown': false,
                        'warnings': {},
                        'stop': null
                    }
                ],
                'departureDateParsed': {
                    'dateTime': '12:15',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 22,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-22T12:15:00+01:00',
                    'formatedDate': '22/03/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '14:55',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 22,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-22T14:55:00+01:00',
                    'formatedDate': '22/03/2021'
                },
                'durationParsed': '02h 40min.',
                'stopsNumber': 0,
                'daysToGo': 10,
                'checked': false,
                'parseNewDateSelected': null
            }
        },
        'allSegments': {
            'IB323020210315': {
                'departureCity': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'arrivalCity': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'departureDateParsed': {
                    'dateTime': '09:05',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 15,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-15T09:05:00+01:00',
                    'formatedDate': '15/03/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '11:35',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 15,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-15T11:35:00+01:00',
                    'formatedDate': '15/03/2021'
                },
                'companyURL': '/aerolineas/logo_pos_IB.svg',
                'overnight': false,
                'departureDateTimeParsed': '09:05',
                'arrivalDateTimeParsed': '11:35',
                'departure': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'arrival': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'flight': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'marketingFlightNumber': '3230',
                    'operationalFlightNumber': '3230',
                    'operationalDisclosure': 'IB',
                    'aircraft': {
                        'code': '320',
                        'description': 'Airbus A320'
                    }
                },
                'durationParsed': '02h 30min.',
                'fareFamilyConditions': [
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQMANO',
                        'name': 'Equipaje de mano',
                        'title': '1 bulto en cabina  (56x40x25cm)',
                        'message': '1 bulto (56x40x25cm)',
                        'units': 1,
                        '$$hashKey': 'object:137'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQBODEGA',
                        'name': 'Equipaje en bodega',
                        'title': 'Sin equipaje en bodega',
                        'message': 'No incluido. ',
                        'units': null,
                        '$$hashKey': 'object:138'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'ASIENTO',
                        'name': 'Selección de asiento',
                        'title': 'Seleccionable con coste',
                        'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                        'units': null,
                        '$$hashKey': 'object:139'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CAMBIO',
                        'name': 'Cambios',
                        'title': 'Cambio permitido con coste',
                        'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        'units': 65,
                        '$$hashKey': 'object:140'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'REEMBOLSO',
                        'name': 'Reembolso (por sentido)',
                        'title': 'Reembolso no permitido',
                        'message': 'No permitido.',
                        'units': null,
                        '$$hashKey': 'object:141'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'TARJEMBANTIC',
                        'name': 'Tarjeta de embarque anticipada',
                        'title': 'No incluido',
                        'message': 'No incluido',
                        'units': null,
                        '$$hashKey': 'object:142'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EMBARQUE',
                        'name': 'Prioridad de Embarque',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:143'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'SALAVIP',
                        'name': 'Acceso a salas VIP',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:144'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CABINA',
                        'name': 'Cabina',
                        'title': '',
                        'message': 'Turista',
                        'units': null,
                        '$$hashKey': 'object:145'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CHECKINDESK',
                        'name': 'Mostrador check-in exclusivo',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:146'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'ASIENTOXL',
                        'name': 'Selección de asiento XL',
                        'title': 'Seleccionable con coste',
                        'message': 'De pago',
                        'units': null,
                        '$$hashKey': 'object:147'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'FASTTRACK',
                        'name': 'Fast Track',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:148'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQPPRIOR',
                        'name': 'Entrega prioritaria equipaje',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:149'
                    }
                ],
                'segmentId': 'IB323020210315',
                'sliceId': 'MADFCO20210315090500',
                'status': {
                    'code': 'HK',
                    'description': 'Confirmado'
                },
                'cabin': {
                    'rbd': 'A',
                    'description': '',
                    'remainingSeats': 9,
                    'fareFamily': 'TBAESEU',
                    'code': 'R',
                    'type': 'ECONOMY',
                    'bookingClass': 'ECONOMY'
                },
                'flown': false,
                'warnings': {},
                'stop': null
            },
            'IB323120210322': {
                'departureCity': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'arrivalCity': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'departureDateParsed': {
                    'dateTime': '12:15',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 22,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-22T12:15:00+01:00',
                    'formatedDate': '22/03/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '14:55',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 22,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-22T14:55:00+01:00',
                    'formatedDate': '22/03/2021'
                },
                'companyURL': '/aerolineas/logo_pos_IB.svg',
                'overnight': false,
                'departureDateTimeParsed': '12:15',
                'arrivalDateTimeParsed': '14:55',
                'departure': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'arrival': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'flight': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'marketingFlightNumber': '3231',
                    'operationalFlightNumber': '3231',
                    'operationalDisclosure': 'IB',
                    'aircraft': {
                        'code': '320',
                        'description': 'Airbus A320'
                    }
                },
                'durationParsed': '02h 40min.',
                'fareFamilyConditions': [
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQMANO',
                        'name': 'Equipaje de mano',
                        'title': '1 bulto en cabina  (56x40x25cm)',
                        'message': '1 bulto (56x40x25cm)',
                        'units': 1,
                        '$$hashKey': 'object:167'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQBODEGA',
                        'name': 'Equipaje en bodega',
                        'title': 'Sin equipaje en bodega',
                        'message': 'No incluido. ',
                        'units': null,
                        '$$hashKey': 'object:168'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'ASIENTO',
                        'name': 'Selección de asiento',
                        'title': 'Seleccionable con coste',
                        'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                        'units': null,
                        '$$hashKey': 'object:169'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CAMBIO',
                        'name': 'Cambios',
                        'title': 'Cambio permitido con coste',
                        'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        'units': 65,
                        '$$hashKey': 'object:170'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'REEMBOLSO',
                        'name': 'Reembolso (por sentido)',
                        'title': 'Reembolso no permitido',
                        'message': 'No permitido.',
                        'units': null,
                        '$$hashKey': 'object:171'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'TARJEMBANTIC',
                        'name': 'Tarjeta de embarque anticipada',
                        'title': 'No incluido',
                        'message': 'No incluido',
                        'units': null,
                        '$$hashKey': 'object:172'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EMBARQUE',
                        'name': 'Prioridad de Embarque',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:173'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'SALAVIP',
                        'name': 'Acceso a salas VIP',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:174'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CABINA',
                        'name': 'Cabina',
                        'title': '',
                        'message': 'Turista',
                        'units': null,
                        '$$hashKey': 'object:175'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CHECKINDESK',
                        'name': 'Mostrador check-in exclusivo',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:176'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'ASIENTOXL',
                        'name': 'Selección de asiento XL',
                        'title': 'Seleccionable con coste',
                        'message': 'De pago',
                        'units': null,
                        '$$hashKey': 'object:177'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'FASTTRACK',
                        'name': 'Fast Track',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:178'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQPPRIOR',
                        'name': 'Entrega prioritaria equipaje',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:179'
                    }
                ],
                'segmentId': 'IB323120210322',
                'sliceId': 'FCOMAD20210322121500',
                'status': {
                    'code': 'HK',
                    'description': 'Confirmado'
                },
                'cabin': {
                    'rbd': 'O',
                    'description': '',
                    'remainingSeats': 2,
                    'fareFamily': 'TBAESEU',
                    'code': 'R',
                    'type': 'ECONOMY',
                    'bookingClass': 'ECONOMY'
                },
                'flown': false,
                'warnings': {},
                'stop': null
            }
        }
    };

    var fakeFlightsInfoOnlyOneFlights = {
        'noIberiaFlag': false,
        'flights': {
            'MADFCO20210315090500': {
                'departureCity': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'arrivalCity': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'departureCountry': 'ES',
                'arrivalCountry': 'IT',
                'segments': [
                    {
                        'departureCity': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrivalCity': {
                            'code': 'FCO',
                            'name': 'FIUMICINO',
                            'terminal': '3',
                            'city': {
                                'code': 'ROM',
                                'description': 'Roma',
                                'countryCode': 'IT',
                                'country': {
                                    'code': 'IT',
                                    'description': 'Italia'
                                }
                            }
                        },
                        'departureDateParsed': {
                            'dateTime': '09:05',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 15,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2021,
                            'originalDate': '2021-03-15T09:05:00+01:00',
                            'formatedDate': '15/03/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '11:35',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 15,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2021,
                            'originalDate': '2021-03-15T11:35:00+01:00',
                            'formatedDate': '15/03/2021'
                        },
                        'companyURL': '/aerolineas/logo_pos_IB.svg',
                        'overnight': false,
                        'departureDateTimeParsed': '09:05',
                        'arrivalDateTimeParsed': '11:35',
                        'departure': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrival': {
                            'code': 'FCO',
                            'name': 'FIUMICINO',
                            'terminal': '3',
                            'city': {
                                'code': 'ROM',
                                'description': 'Roma',
                                'countryCode': 'IT',
                                'country': {
                                    'code': 'IT',
                                    'description': 'Italia'
                                }
                            }
                        },
                        'flight': {
                            'marketingCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'operationalCarrier': {
                                'code': 'IB',
                                'name': 'Iberia'
                            },
                            'marketingFlightNumber': '3230',
                            'operationalFlightNumber': '3230',
                            'operationalDisclosure': 'IB',
                            'aircraft': {
                                'code': '320',
                                'description': 'Airbus A320'
                            }
                        },
                        'durationParsed': '02h 30min.',
                        'fareFamilyConditions': [
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQMANO',
                                'name': 'Equipaje de mano',
                                'title': '1 bulto en cabina  (56x40x25cm)',
                                'message': '1 bulto (56x40x25cm)',
                                'units': 1,
                                '$$hashKey': 'object:137'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQBODEGA',
                                'name': 'Equipaje en bodega',
                                'title': 'Sin equipaje en bodega',
                                'message': 'No incluido. ',
                                'units': null,
                                '$$hashKey': 'object:138'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'ASIENTO',
                                'name': 'Selección de asiento',
                                'title': 'Seleccionable con coste',
                                'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                                'units': null,
                                '$$hashKey': 'object:139'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CAMBIO',
                                'name': 'Cambios',
                                'title': 'Cambio permitido con coste',
                                'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                                'units': 65,
                                '$$hashKey': 'object:140'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'REEMBOLSO',
                                'name': 'Reembolso (por sentido)',
                                'title': 'Reembolso no permitido',
                                'message': 'No permitido.',
                                'units': null,
                                '$$hashKey': 'object:141'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'TARJEMBANTIC',
                                'name': 'Tarjeta de embarque anticipada',
                                'title': 'No incluido',
                                'message': 'No incluido',
                                'units': null,
                                '$$hashKey': 'object:142'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EMBARQUE',
                                'name': 'Prioridad de Embarque',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:143'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'SALAVIP',
                                'name': 'Acceso a salas VIP',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:144'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CABINA',
                                'name': 'Cabina',
                                'title': '',
                                'message': 'Turista',
                                'units': null,
                                '$$hashKey': 'object:145'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'CHECKINDESK',
                                'name': 'Mostrador check-in exclusivo',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:146'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'ASIENTOXL',
                                'name': 'Selección de asiento XL',
                                'title': 'Seleccionable con coste',
                                'message': 'De pago',
                                'units': null,
                                '$$hashKey': 'object:147'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'FASTTRACK',
                                'name': 'Fast Track',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:148'
                            },
                            {
                                'cabin': 'Básica',
                                'cabinType': 'E',
                                'code': 'EQPPRIOR',
                                'name': 'Entrega prioritaria equipaje',
                                'title': '',
                                'message': 'No',
                                'units': null,
                                '$$hashKey': 'object:149'
                            }
                        ],
                        'segmentId': 'IB323020210315',
                        'sliceId': 'MADFCO20210315090500',
                        'status': {
                            'code': 'HK',
                            'description': 'Confirmado'
                        },
                        'cabin': {
                            'rbd': 'A',
                            'description': '',
                            'remainingSeats': 9,
                            'fareFamily': 'TBAESEU',
                            'code': 'R',
                            'type': 'ECONOMY',
                            'bookingClass': 'ECONOMY'
                        },
                        'flown': false,
                        'warnings': {},
                        'stop': null
                    }
                ],
                'departureDateParsed': {
                    'dateTime': '09:05',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 15,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-15T09:05:00+01:00',
                    'formatedDate': '15/03/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '11:35',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 15,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-15T11:35:00+01:00',
                    'formatedDate': '15/03/2021'
                },
                'durationParsed': '02h 30min.',
                'stopsNumber': 0,
                'daysToGo': 3,
                'checked': true,
                'parseNewDateSelected': null
            }
        },
        'allSegments': {
            'IB323020210315': {
                'departureCity': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'arrivalCity': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'departureDateParsed': {
                    'dateTime': '09:05',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 15,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-15T09:05:00+01:00',
                    'formatedDate': '15/03/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '11:35',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 15,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-15T11:35:00+01:00',
                    'formatedDate': '15/03/2021'
                },
                'companyURL': '/aerolineas/logo_pos_IB.svg',
                'overnight': false,
                'departureDateTimeParsed': '09:05',
                'arrivalDateTimeParsed': '11:35',
                'departure': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'arrival': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'flight': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'marketingFlightNumber': '3230',
                    'operationalFlightNumber': '3230',
                    'operationalDisclosure': 'IB',
                    'aircraft': {
                        'code': '320',
                        'description': 'Airbus A320'
                    }
                },
                'durationParsed': '02h 30min.',
                'fareFamilyConditions': [
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQMANO',
                        'name': 'Equipaje de mano',
                        'title': '1 bulto en cabina  (56x40x25cm)',
                        'message': '1 bulto (56x40x25cm)',
                        'units': 1,
                        '$$hashKey': 'object:137'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQBODEGA',
                        'name': 'Equipaje en bodega',
                        'title': 'Sin equipaje en bodega',
                        'message': 'No incluido. ',
                        'units': null,
                        '$$hashKey': 'object:138'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'ASIENTO',
                        'name': 'Selección de asiento',
                        'title': 'Seleccionable con coste',
                        'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                        'units': null,
                        '$$hashKey': 'object:139'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CAMBIO',
                        'name': 'Cambios',
                        'title': 'Cambio permitido con coste',
                        'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        'units': 65,
                        '$$hashKey': 'object:140'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'REEMBOLSO',
                        'name': 'Reembolso (por sentido)',
                        'title': 'Reembolso no permitido',
                        'message': 'No permitido.',
                        'units': null,
                        '$$hashKey': 'object:141'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'TARJEMBANTIC',
                        'name': 'Tarjeta de embarque anticipada',
                        'title': 'No incluido',
                        'message': 'No incluido',
                        'units': null,
                        '$$hashKey': 'object:142'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EMBARQUE',
                        'name': 'Prioridad de Embarque',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:143'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'SALAVIP',
                        'name': 'Acceso a salas VIP',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:144'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CABINA',
                        'name': 'Cabina',
                        'title': '',
                        'message': 'Turista',
                        'units': null,
                        '$$hashKey': 'object:145'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CHECKINDESK',
                        'name': 'Mostrador check-in exclusivo',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:146'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'ASIENTOXL',
                        'name': 'Selección de asiento XL',
                        'title': 'Seleccionable con coste',
                        'message': 'De pago',
                        'units': null,
                        '$$hashKey': 'object:147'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'FASTTRACK',
                        'name': 'Fast Track',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:148'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQPPRIOR',
                        'name': 'Entrega prioritaria equipaje',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:149'
                    }
                ],
                'segmentId': 'IB323020210315',
                'sliceId': 'MADFCO20210315090500',
                'status': {
                    'code': 'HK',
                    'description': 'Confirmado'
                },
                'cabin': {
                    'rbd': 'A',
                    'description': '',
                    'remainingSeats': 9,
                    'fareFamily': 'TBAESEU',
                    'code': 'R',
                    'type': 'ECONOMY',
                    'bookingClass': 'ECONOMY'
                },
                'flown': false,
                'warnings': {},
                'stop': null
            },
            'IB323120210322': {
                'departureCity': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'arrivalCity': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'departureDateParsed': {
                    'dateTime': '12:15',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 22,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-22T12:15:00+01:00',
                    'formatedDate': '22/03/2021'
                },
                'arrivalDateParsed': {
                    'dateTime': '14:55',
                    'weekDay': 'WEEKDAY_MONDAY',
                    'day': 22,
                    'monthNumber': 3,
                    'month': 'MONTH_MARCH',
                    'year': 2021,
                    'originalDate': '2021-03-22T14:55:00+01:00',
                    'formatedDate': '22/03/2021'
                },
                'companyURL': '/aerolineas/logo_pos_IB.svg',
                'overnight': false,
                'departureDateTimeParsed': '12:15',
                'arrivalDateTimeParsed': '14:55',
                'departure': {
                    'code': 'FCO',
                    'name': 'FIUMICINO',
                    'terminal': '3',
                    'city': {
                        'code': 'ROM',
                        'description': 'Roma',
                        'countryCode': 'IT',
                        'country': {
                            'code': 'IT',
                            'description': 'Italia'
                        }
                    }
                },
                'arrival': {
                    'code': 'MAD',
                    'name': 'BARAJAS',
                    'terminal': '4',
                    'city': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'country': {
                            'code': 'ES',
                            'description': 'España'
                        }
                    }
                },
                'flight': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'marketingFlightNumber': '3231',
                    'operationalFlightNumber': '3231',
                    'operationalDisclosure': 'IB',
                    'aircraft': {
                        'code': '320',
                        'description': 'Airbus A320'
                    }
                },
                'durationParsed': '02h 40min.',
                'fareFamilyConditions': [
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQMANO',
                        'name': 'Equipaje de mano',
                        'title': '1 bulto en cabina  (56x40x25cm)',
                        'message': '1 bulto (56x40x25cm)',
                        'units': 1,
                        '$$hashKey': 'object:167'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQBODEGA',
                        'name': 'Equipaje en bodega',
                        'title': 'Sin equipaje en bodega',
                        'message': 'No incluido. ',
                        'units': null,
                        '$$hashKey': 'object:168'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'ASIENTO',
                        'name': 'Selección de asiento',
                        'title': 'Seleccionable con coste',
                        'message': 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                        'units': null,
                        '$$hashKey': 'object:169'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CAMBIO',
                        'name': 'Cambios',
                        'title': 'Cambio permitido con coste',
                        'message': 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        'units': 65,
                        '$$hashKey': 'object:170'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'REEMBOLSO',
                        'name': 'Reembolso (por sentido)',
                        'title': 'Reembolso no permitido',
                        'message': 'No permitido.',
                        'units': null,
                        '$$hashKey': 'object:171'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'TARJEMBANTIC',
                        'name': 'Tarjeta de embarque anticipada',
                        'title': 'No incluido',
                        'message': 'No incluido',
                        'units': null,
                        '$$hashKey': 'object:172'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EMBARQUE',
                        'name': 'Prioridad de Embarque',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:173'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'SALAVIP',
                        'name': 'Acceso a salas VIP',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:174'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CABINA',
                        'name': 'Cabina',
                        'title': '',
                        'message': 'Turista',
                        'units': null,
                        '$$hashKey': 'object:175'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'CHECKINDESK',
                        'name': 'Mostrador check-in exclusivo',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:176'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'ASIENTOXL',
                        'name': 'Selección de asiento XL',
                        'title': 'Seleccionable con coste',
                        'message': 'De pago',
                        'units': null,
                        '$$hashKey': 'object:177'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'FASTTRACK',
                        'name': 'Fast Track',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:178'
                    },
                    {
                        'cabin': 'Básica',
                        'cabinType': 'E',
                        'code': 'EQPPRIOR',
                        'name': 'Entrega prioritaria equipaje',
                        'title': '',
                        'message': 'No',
                        'units': null,
                        '$$hashKey': 'object:179'
                    }
                ],
                'segmentId': 'IB323120210322',
                'sliceId': 'FCOMAD20210322121500',
                'status': {
                    'code': 'HK',
                    'description': 'Confirmado'
                },
                'cabin': {
                    'rbd': 'O',
                    'description': '',
                    'remainingSeats': 2,
                    'fareFamily': 'TBAESEU',
                    'code': 'R',
                    'type': 'ECONOMY',
                    'bookingClass': 'ECONOMY'
                },
                'flown': false,
                'warnings': {},
                'stop': null
            }
        }
    };

    var fakeFlags = {
        'showRefundLink': false,
        'showChangeFlightLink': true,
        'showChangeFlightDeepLink': false,
        'showFlexibilizationChangeSection': false,
        'showVoluntaryChangeFlightSection': true,
        'showRefundCashSection': false,
        'showRefundVoucherSection': false,
        'refundVoucherSection80': false,
        'showModalRefound48hs': false,
        'showLinkToRubiQ': false,
        'showFlexibilizationExceptionalMsg': false,
        'hideCashRefundSection': true,
        'allowedRefundVoucher': false,
        'enableExternalRefundLink': false,
        'showContactCenterText': false,
        'showOnlyVoucherRefundText': false,
        'cashPartialRefund': false,
        'slicesWithFlexibilization': {},
        'slicesWithChangeFlight': {
            'MADFCO20210315090500': true,
            'FCOMAD20210322121500': true
        },
        'sisterCitiesData': {
            'hasSistercitiesPossibility': false,
            'allowedSlices': []
        },
        'showMonetateAlertCFPhone': false,
        'allowedInvoluntaryFlightChange': false,
        'hideChangeFlightMenuOption': false,
        'dateLimit': {
            'channel': 'IBCOM'
        },
        'verifyDate': ''

    }
    var fakeFlagsFlex = {
        'showRefundLink': false,
        'showChangeFlightLink': true,
        'showChangeFlightDeepLink': false,
        'showFlexibilizationChangeSection': false,
        'showVoluntaryChangeFlightSection': true,
        'showRefundCashSection': false,
        'showRefundVoucherSection': false,
        'refundVoucherSection80': false,
        'showModalRefound48hs': false,
        'showLinkToRubiQ': false,
        'showFlexibilizationExceptionalMsg': false,
        'hideCashRefundSection': true,
        'allowedRefundVoucher': false,
        'enableExternalRefundLink': false,
        'showContactCenterText': false,
        'showOnlyVoucherRefundText': false,
        'cashPartialRefund': false,
        'slicesWithFlexibilization': [
            'MADFCO20210315090500',
        ],
        'slicesWithChangeFlight': {
            'MADFCO20210315090500': true,
            'FCOMAD20210322121500': true
        },
        'sisterCitiesData': {
            'hasSistercitiesPossibility': false,
            'allowedSlices': []
        },
        'showMonetateAlertCFPhone': false,
        'allowedInvoluntaryFlightChange': false,
        'hideChangeFlightMenuOption': false
    }

    var fakeNewSisterCitiesModel = {
        'MADFCO20210315090500': {
            origin: {
                originSisterCities: [{code: 'MAD'}]
            },
            destination: {
                destinationSisterCities: 'Bilbao'
            },
            originSisterCitiesNum: null,
            destinationSisterCitiesNum: null,
        },
        'FCOMAD20210322121500': {
            origin: {
                originSisterCities: [{code: 'FCO'}]
            },
            destination: {
                destinationSisterCities: 'Bilbao'
            },
            originSisterCitiesNum: null,
            destinationSisterCitiesNum: null,
        },
        disruptedSlices: ['MADFCO20210315090500', 'FCOMAD20210322121500'],
        referenceSliceId: 'MADFCO20210315090500'
    }
    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = () => {
            return '';
        };
        switch (filter) {
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
    var fakeChangleFlightsService = {
        'getDisruptionPeriods': jasmine.createSpy()
    };
    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    }
    var fakeVoluntaryChangesLogService = {
        getVoluntaryChangesLog : jasmine.createSpy()
    }


    var flightsAvailableCheck = { number: 2, slices: [ 'MADFCO20210315090500', 'FCOMAD20210322121500' ] };
    var fakeDisruptionPeriodsInfo = {test1:'test', test2: 'test'};

    let fakeCommonsAncillariesService = {};
    var fakeBookingDashboardService = {
        'initializeDashboard': jasmine.createSpy()
    };

    let fakeHeaderModel = {
        headerModel: {
            shoppingBasket: {
                total: {
                    original: 30
                },
                totalPrice: 0
            }
        }
    };

    let fakeMmBDeinvoicingUtils = {
        getDataModalDeinvoicing: jasmine.createSpy(),
        checkSpecificWarningCheckOut: jasmine.createSpy(),
        checkWarningCheckOut: jasmine.createSpy(),
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-change-flights-tab-module', 'LocalStorageModule', ($provide) => {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('$filter', $filterFake);
            $provide.value('ChangleFlightsService', fakeChangleFlightsService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('VoluntaryChangesLogService', fakeVoluntaryChangesLogService);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('BookingDashboardService', fakeBookingDashboardService);
            $provide.value('MmBDeinvoicingUtils', fakeMmBDeinvoicingUtils);
        });

        inject((_$rootScope_, _$componentController_, _localStorageService_, _$injector_) => {
            $rootScope= _$rootScope_;
            $scope = _$rootScope_.$new();
            $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            $q = $injector.get('$q');
            localStorage = _localStorageService_;
            localStorage.set('bookingInfo', fakeBookingInfo);
            localStorage.set('phonesList', fakePhoneList);
            localStorage.set('reshopConditions', fakeReshopConditions);
            localStorage.set('headerModel', fakeHeaderModel);
            controller = _$componentController_('ibMmbChangeFlightsTabComponent', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });


    describe('when activate is called', () => {
        it('and phoneList is null', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlags;
            controller.$onInit();
            controller.phonesList = null;
            expect(controller.phonesList).toEqual(null);
            done();
        });
        it('and check normal', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlags;
            controller.$onInit();
            expect(controller.flightsAvailable).toEqual(flightsAvailableCheck);
            done();
        });
        it('and have flights with Flex', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlagsFlex;
            controller.$onInit();
            expect(controller.flightsAvailable).toEqual(flightsAvailableCheck);
            done();
        });
        it('and have flag hideChangeFlightMenuOption true', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlagsFlex;
            controller.flags.hideChangeFlightMenuOption = true;
            controller.$onInit();
            expect(controller.flags.showVoluntaryChangeFlightSection).toBe(false);
            expect(controller.flags.showFlexibilizationChangeSection).toBe(false);
            expect(controller.flags.hideChangeFlightMenuOption).toBe(true);

            done();
        });
        it('and have flag hideChangeFlightMenuOption is false and showFlexibilizationChangeSection true', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlagsFlex;
            controller.flags.hideChangeFlightMenuOption = false;
            controller.flags.showFlexibilizationChangeSection = true;
            controller.model = {};
            controller.model.disruptionPeriodsData = localStorage.set('disruptionPeriodsInfo', fakeDisruptionPeriodsInfo);
            controller.$onInit();
            expect(controller.model.disruptionPeriodsData).toBeDefined();
            expect(controller.flags.showFlexibilizationChangeSection).toBe(true);
            done();
        });
        it('and disruptionPeriodsData is undefined', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlagsFlex;
            controller.flags.hideChangeFlightMenuOption = false;
            controller.flags.showFlexibilizationChangeSection = true;
            fakeHeaderModel.headerModel.shoppingBasket.total.original = 30;
            localStorage.set('headerModel', fakeHeaderModel);
            controller.$onInit();
            controller.model = {};
            $rootScope.$digest();
            expect(controller.model.disruptionPeriodsData).toBeUndefined();
            done();
        });

        xit('and flexibilizationCapabilitiesInformation is true', (done) => {
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlagsFlex;
            controller.flags.hideChangeFlightMenuOption = false;
            fakeBookingInfo.flexibilizationCapabilitiesInformation = true;
            fakeHeaderModel.headerModel.shoppingBasket.total.original = 0;
            localStorage.set('headerModel', fakeHeaderModel);
            controller.$onInit();
            $rootScope.$digest();
            expect(controller.bookingInfo.flexibilizationCapabilitiesInformation).toBe(true);
            done();
        });
    });

    describe('when Function of controller is called', () => {
        describe('when initializeData is called', () => {
            it('And flightsAvailable is 1', (done) => {
                controller.flightsInfo = fakeFlightsInfo;
                controller.flags = fakeFlags;
                localStorage.set('reshopConditions', {
                    "voluntaryChanges": {
                        "flowType": "VOLUNTARY_CHANGE",
                        "enabled": false,
                        "slices": [{
                            'sliceId': 'MADFCO20210315090500',
                            "enabled": true,
                        },{
                            'sliceId': 'FCOMAD20210322121500',
                            "enabled": true,
                        }],
                        "reservationFailedConditions": [
                            {
                                "code": "REDEMPTION_RESERVE_AVIOS",
                                "reason": "Lo sentimos: las reservas pagadas con Avios no permiten realizar ningún cambio online. Si necesitas más información, contacta con nuestro Centro de Atención al Cliente llamando al 901 11 15 00."
                            }
                        ],
                        "warnings": []
                    },
                    "involuntaryChanges": {
                        "flowType": "INVOLUNTARY",
                        "enabled": true,
                        "slices": [{
                            'sliceId': 'MADFCO20210315090500',
                            "enabled": true,
                        }],
                        "reservationFailedConditions": [],
                        "warnings": []
                    },
                    'callcenterInfo': {
                        "enabled": true
                    }
                });
                controller.$onInit();
                expect(controller.flightsAvailable.number).toEqual(1);
                done();
            });

            it('And numberFlights is 1', (done) => {
                controller.flightsInfo = fakeFlightsInfoOnlyOneFlights;
                controller.flags = fakeFlags;
                controller.flags.showFlexibilizationChangeSection = true;
                controller.numberFlights = 1;
                controller.$onInit();
                expect(controller.numberFlights).toEqual(1);
                done();
            });
        });
        describe('when getPhone is called', () => {
            it('And defined and case default', (done) => {
                controller.phonesList = fakePhoneList;
                expect(controller.getPhone()).toBeDefined();
                expect(controller.getPhone()).toEqual(controller.phonesList.RESERVAS.prefix + ' ' + controller.phonesList.RESERVAS.telephone);
                done();
            });
        });

        describe('when checkMessageFlight is called', () => {
            it('And flightsMenssage is defined and true', (done) => {
                controller.flightsMenssage = [{sliceId: 'MADFCO20210315090500'}];
                expect(controller.checkMessageFlight(fakeFlightsInfo.flights['MADFCO20210315090500'].segments[0].sliceId)).toBeDefined();
                expect(controller.checkMessageFlight(fakeFlightsInfo.flights['MADFCO20210315090500'].segments[0].sliceId)).toBe(true);
                done();
            });
            it('And flightsMenssage is false', (done) => {
                controller.flightsMenssage = undefined;
                expect(controller.checkMessageFlight([])).toBe(false);
                done();
            });
        });

        describe('when getMessageFlight  is called', () => {
            it('And default case is true', (done) => {
                controller.flightsMenssage = [{sliceId: 'MADFCO20210315090500', message: 'test'}];
                expect(controller.getMessageFlight(fakeFlightsInfo.flights['MADFCO20210315090500'].segments[0].sliceId)).toBeDefined();
                expect(controller.getMessageFlight(fakeFlightsInfo.flights['MADFCO20210315090500'].segments[0].sliceId)).toEqual('test');
                done();
            });
        });

        describe('when isRedemptionMessage is called', () => {
            it('And code is AVIOS and isRedemption is true', (done) => {
                controller.isRedemptionMessage('REDEMPTION_RESERVE_AVIOS');
                expect(controller.isRedemption).toEqual(true);
                done();
            });
            it('And code is POINTS and isRedemption is true', (done) => {
                controller.isRedemptionMessage('REDEMPTION_RESERVE_POINTS');
                expect(controller.isRedemption).toEqual(true);
                done();
            });
        });

        describe('when getMessageSlide is called', () => {
            it('And case default', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = '';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_1');
                done();
            });
            it('And case 1', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'EMDS_NOT_ALLOWED';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_1');
                done();
            });
            it('And case 2', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'GROUP_PNR';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_2');
                done();
            });
            it('And case 3', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'ORDER_LOCATOR_NOT_OK';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_3');
                done();
            });
            it('And case 4', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'FORM_OF_PAYMENT_NOT_OK';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_4');
                done();
            });
            it('And case 5', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'NO_PAYMENT_INFO_AGENCIES';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_5');
                done();
            });
            it('And case 6', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'SLICE_NEAR_TO_TAKEOFF';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_6');
                done();
            });
            it('And case 7', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'SEGMENT_STATUS_NOT_OK';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_7');
                done();
            });
            it('And case 8', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'SLICE_WITH_FLOWN_SEGMENTS';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_8');
                done();
            });
            it('And case 9', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'UNNACOMPANIED_MINORS_NOT_ALLOWED';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('MMB_DEEPLINK_ERROR_MODAL_TITLE');
                done();
            });
            it('And case 10', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'ANCILLARIES_NOT_FOUND';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_11');
                done();
            });
            it('And case 11', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'SLICE_AIRSHUTTLE_CKI_MANAGEMENT';
                expect(controller.getMessageSlide(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_TITLE_12');
                done();
            });
        });
        describe('when getMessageSlideDescription is called', () => {

            it('And case default', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = '';
                expect(controller.getMessageSlideDescription(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_SUBTITLE_1');
                done();
            });
            it('And case 1', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'EMDS_NOT_ALLOWED';
                expect(controller.getMessageSlideDescription(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_SUBTITLE_1');
                done();
            });
            it('And case 2', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'ORDER_LOCATOR_NOT_OK';
                expect(controller.getMessageSlideDescription(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_SUBTITLE_2');
                done();
            });
            it('And case 3', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'FORM_OF_PAYMENT_NOT_OK';
                expect(controller.getMessageSlideDescription(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_SUBTITLE_3');
                done();
            });
            it('And case 4', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'NO_PAYMENT_INFO_AGENCIES';
                expect(controller.getMessageSlideDescription(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_SUBTITLE_4');
                done();
            });
            it('And case 5', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'SLICE_NEAR_TO_TAKEOFF';
                expect(controller.getMessageSlideDescription(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_SUBTITLE_5');
                done();
            });
            it('And case 7', (done) => {
                controller.phonesList = fakePhoneList;
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'UNNACOMPANIED_MINORS_NOT_ALLOWED';
                expect(controller.getMessageSlideDescription(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('');
                done();
            });
            it('And case 8', (done) => {
                fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code = 'ANCILLARIES_NOT_FOUND';
                expect(controller.getMessageSlideDescription(fakeReshopConditions.voluntaryChanges.reservationFailedConditions[0].code)).toEqual('FLIGHT_CHANGE_ERROR_SUBTITLE_6');
                done();
            });
        });

        describe('when getConditionText is called', () => {
            it('And Message have value', (done) => {
                var condition = {message:'hacer test es bueno'};
                var message = controller.getConditionText(condition);

                expect(message).toEqual(condition.message);
                done();
            });
            it('And Message doesnt exist', (done) => {
                var condition = {};
                var message = controller.getConditionText(condition);

                expect(message).toEqual('');
                done();
            });
        });

        describe('when openFareModal is called', () => {
            it('And open modal', (done) => {
                var fareFamilyInfo = {};
                controller.openFareModal(fareFamilyInfo);
                done();
            });
        });

        describe('when changeCheck is called', () => {
            it('And check if flightSelected', (done) => {
                controller.flightsInfo = fakeFlightsInfo;
                controller.newSisterCities = fakeNewSisterCitiesModel;
                var flightSelected = {checked:true};
                controller.changeCheck(0,flightSelected);
                done();
            });
            it('And check if newSisterCities', (done) => {
                controller.flightsInfo = fakeFlightsInfo;
                controller.newSisterCities = fakeNewSisterCitiesModel;
                var flightSelected = {checked:true};
                controller.flightsInfo.flights['MADFCO20210315090500'].checked = true;
                controller.changeCheck(0,flightSelected);
                done();
            });
            it('And check else', (done) => {
                var flightSelected = {checked:false};
                controller.newSisterCities = fakeNewSisterCitiesModel;
                controller.flightsInfo = fakeFlightsInfo;
                controller.flightsInfo.flights['MADFCO20210315090500'].checked = false;
                controller.flightsInfo.flights['FCOMAD20210322121500'].checked = true;
                controller.changeCheck(0,flightSelected);
                done();
            });
        });

        describe('when addQuadrigam is called', () => {
            it('', (done) => {
                controller.addQuadrigam();
                done();
            });
        });

        describe('when processRebookFailed is called', () => {
            it('', (done) => {
                controller.processRebookFailed();
                done();
            });
        });
    });


    describe('when getIsEmptyBasket is called', () => {
        it('and isEmptyBasket is true', (done) => {
            fakeHeaderModel.headerModel.shoppingBasket.total.original = 30;
            localStorage.set('headerModel', fakeHeaderModel);
            controller.getIsEmptyBasket();
            $rootScope.$digest();
            expect(controller.isEmptyBasket).toBe(false);
            done();
        });
        it('and isEmptyBasket is false', (done) => {
            fakeHeaderModel.headerModel.shoppingBasket.total.original = 0;
            localStorage.set('headerModel', fakeHeaderModel);
            controller.getIsEmptyBasket();
            $rootScope.$digest();
            expect(controller.isEmptyBasket).toBe(true);
            done();
        });
    });

    describe('when deleteBasket is called', () => {
        it('and showEmptyBasketModal is resolve and call isEmptyBasket', (done) => {
            fakeMmBModalService.showEmptyBasketModal = jasmine.createSpy('showEmptyBasketModal').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });
            fakeHeaderModel.headerModel.shoppingBasket.total.original = 30;
            localStorage.set('headerModel', fakeHeaderModel)
            controller.deleteBasket();
            $rootScope.$digest();
            expect(controller.isEmptyBasket).toBe(false);
            done();
        });
    });
    describe('addProcessStartToDigitalData', () => {
        beforeEach(() => {
            fakeDatalayerUtilsService.addDigitalDataInfo.calls.reset();
            $rootScope.appLang = 'es';
            $rootScope.appMarket = 'ES';
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlags;
            controller.$rootScope = $rootScope;
        });

        it('Calling addDigitalDataInfo with correctly formatted ProcessStart', (done) => {
            controller.addProcessStartToDigitalData();
            expect(fakeDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalledWith({
                ProcessStart: 'es/ES/MANAGE_RESERV'
            });
            expect(fakeDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalledTimes(1);
            done();
        });

        it('Handle different language and market values', (done) => {
            $rootScope.appLang = 'en';
            $rootScope.appMarket = 'UK';
            controller.addProcessStartToDigitalData();
            expect(fakeDatalayerUtilsService.addDigitalDataInfo).toHaveBeenCalledWith({
                ProcessStart: 'en/UK/MANAGE_RESERV'
            });
            done();
        });
    });

    describe('$onInit - Verify the execution addProcessStartToDigitalData', () => {
        beforeEach(() => {
            $rootScope.appLang = 'es';
            $rootScope.appMarket = 'ES';
            controller.flightsInfo = fakeFlightsInfo;
            controller.flags = fakeFlags;
            controller.newSisterCities = null;
            spyOn(controller, 'addProcessStartToDigitalData').and.callThrough();
        });

        it('Call addProcessStartToDigitalData during $onInit', (done) => {
            controller.$onInit();
            expect(controller.addProcessStartToDigitalData).toHaveBeenCalled();
            expect(controller.addProcessStartToDigitalData).toHaveBeenCalledTimes(1);
            done();
        });
    });


});
