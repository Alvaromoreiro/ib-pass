const timeLimitOH = new Date();
timeLimitOH.setHours(timeLimitOH.getHours()+72)

export const importResponse = {
    "flowId": "TWFuYWdlTXlCb29raW5nQElCZTUwOWY2MWY0YzA3NDRhYWIwZTJjODQyZTcxNWJkMTY=",
    "order": {
        "orderId": "Qm9va2luZ0BJQmFiMzRiNGYzMDI4YjQzM2Q5NzhiZjI0MjgzNTc5YTc1T1A=",
        "status": "ON_HOLD_CONFIRMABLE",
        "clientLocator": "L5L0T",
        "bookingReferences": [
            {
                "provider": "IB",
                "reference": "L5L0T"
            }
        ],
        "orderItems": [
            {
                "type": "flight",
                "orderItemId": "IBab34b4f3028b433d978bf24283579a75OP_01",
                "bookingReferences": [
                    {
                        "provider": "IB",
                        "reference": "L5L0T"
                    }
                ],
                "price": {
                    "fare": 188,
                    "tax": 40.27,
                    "total": 228.27,
                    "currency": "EUR",
                    "ticketingFee": 0
                },
                "sliceIds": [
                    "MADBCN20250217123000",
                    "BCNMAD20250220080000"
                ],
                "passengerPrices": [
                    {
                        "fareCalculation": "MAD IB BCN23.00IB MAD165.00EUR188.00END",
                        "passengerId": "ADULT_01",
                        "price": {
                            "fare": 188,
                            "tax": 40.27,
                            "total": 228.27,
                            "currency": "EUR",
                            "ticketingFee": 0
                        },
                        "segmentPrices": [
                            {
                                "price": {
                                    "fare": 23,
                                    "currency": "EUR"
                                },
                                "fareCode": "QZNNB4",
                                "segmentsIds": [
                                    "IB041320250217"
                                ],
                                "ticketDesignator": null,
                                "penalties": [],
                                "penaltyFlags": null
                            },
                            {
                                "price": {
                                    "fare": 165,
                                    "currency": "EUR"
                                },
                                "fareCode": "YDRT",
                                "segmentsIds": [
                                    "IB042820250220"
                                ],
                                "ticketDesignator": null,
                                "penalties": [],
                                "penaltyFlags": null
                            }
                        ],
                        "taxes": [
                            {
                                "code": "QV",
                                "amount": 3.89,
                                "currency": "EUR",
                                "description": "Seguridad",
                                "subcode": null,
                                "country": null,
                                "carrier": null
                            },
                            {
                                "code": "OG",
                                "amount": 0.69,
                                "currency": "EUR",
                                "description": "Tasa de seguridad",
                                "subcode": null,
                                "country": null,
                                "carrier": null
                            },
                            {
                                "code": "JD",
                                "amount": 16.08,
                                "currency": "EUR",
                                "description": "Cargo por salida",
                                "subcode": null,
                                "country": null,
                                "carrier": null
                            },
                            {
                                "code": "QV",
                                "amount": 3.89,
                                "currency": "EUR",
                                "description": "Seguridad",
                                "subcode": null,
                                "country": null,
                                "carrier": null
                            },
                            {
                                "code": "OG",
                                "amount": 0.69,
                                "currency": "EUR",
                                "description": "Tasa de seguridad",
                                "subcode": null,
                                "country": null,
                                "carrier": null
                            },
                            {
                                "code": "JD",
                                "amount": 15.03,
                                "currency": "EUR",
                                "description": "Cargo por salida",
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
                "sliceId": "MADBCN20250217123000",
                "type": "REGULAR",
                "departureDateTime": "2025-02-17 12:30",
                "arrivalDateTime": "2025-02-17 13:50",
                "duration": 80,
                "stopsNumber": 0,
                "detailedPrices": [
                    {
                        "fare": 23,
                        "currency": "EUR",
                        "passengerIds": [
                            "ADULT_01"
                        ],
                        "segmentPrices": [
                            {
                                "price": {
                                    "fare": 23,
                                    "currency": "EUR"
                                },
                                "fareCode": "QZNNB4",
                                "segmentsIds": [
                                    "IB041320250217"
                                ],
                                "ticketDesignator": null,
                                "penalties": [],
                                "penaltyFlags": null
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
                            "code": "BCN",
                            "name": "AIRPORT",
                            "terminal": "1",
                            "city": {
                                "code": "BCN",
                                "description": "Barcelona",
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
                            "code": "BCN",
                            "description": "Barcelona",
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
                            "marketingFlightNumber": "0413",
                            "operationalFlightNumber": "0413",
                            "operationalDisclosure": "IB",
                            "aircraft": {
                                "code": "320",
                                "description": "Airbus A320"
                            }
                        },
                        "cabin": {
                            "rbd": "Q",
                            "description": "",
                            "remainingSeats": 0,
                            "fareFamily": "YR2PA",
                            "code": "R",
                            "type": "ECONOMY",
                            "bookingClass": "ECONOMY"
                        },
                        "overnight": false,
                        "id": "IB041320250217",
                        "duration": 80,
                        "waitingTime": 0,
                        "operatorLocator": null,
                        "stop": null,
                        "departureDateTime": "2025-02-17 12:30",
                        "departureUtcDateTime": "2025-02-17T11:30:00.000",
                        "arrivalDateTime": "2025-02-17 13:50",
                        "arrivalUtcDateTime": "2025-02-17T12:50:00.000",
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
                                "type": "FLIGHT_MODIFICATION",
                                "enabled": false
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
                "sliceId": "BCNMAD20250220080000",
                "type": "REGULAR",
                "departureDateTime": "2025-02-20 08:00",
                "arrivalDateTime": "2025-02-20 09:25",
                "duration": 85,
                "stopsNumber": 0,
                "detailedPrices": [
                    {
                        "fare": 165,
                        "currency": "EUR",
                        "passengerIds": [
                            "ADULT_01"
                        ],
                        "segmentPrices": [
                            {
                                "price": {
                                    "fare": 165,
                                    "currency": "EUR"
                                },
                                "fareCode": "YDRT",
                                "segmentsIds": [
                                    "IB042820250220"
                                ],
                                "ticketDesignator": null,
                                "penalties": [],
                                "penaltyFlags": null
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
                            "code": "BCN",
                            "name": "AIRPORT",
                            "terminal": "1",
                            "city": {
                                "code": "BCN",
                                "description": "Barcelona",
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
                            "code": "BCN",
                            "description": "Barcelona",
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
                            "marketingFlightNumber": "0428",
                            "operationalFlightNumber": "0428",
                            "operationalDisclosure": "IB",
                            "aircraft": {
                                "code": "320",
                                "description": "Airbus A320"
                            }
                        },
                        "cabin": {
                            "rbd": "Y",
                            "description": "",
                            "remainingSeats": 0,
                            "fareFamily": "YPA",
                            "code": "R",
                            "type": "ECONOMY",
                            "bookingClass": "ECONOMY"
                        },
                        "overnight": false,
                        "id": "IB042820250220",
                        "duration": 85,
                        "waitingTime": 0,
                        "operatorLocator": null,
                        "stop": null,
                        "departureDateTime": "2025-02-20 08:00",
                        "departureUtcDateTime": "2025-02-20T07:00:00.000",
                        "arrivalDateTime": "2025-02-20 09:25",
                        "arrivalUtcDateTime": "2025-02-20T08:25:00.000",
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
                                "type": "FLIGHT_MODIFICATION",
                                "enabled": false
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
            "fare": 188,
            "tax": 40.27,
            "total": 228.27,
            "currency": "EUR",
            "ticketingFee": 0
        },
        "primaryContactInfo": {
            "phone": "3412345678",
            "phoneDetails": {
                "number": "12345678",
                "countryCode": "34"
            },
            "email": "BABEL.DCEREZO@IBERIA.ES",
            "phoneType": "MOBILE",
            "confirmationMailOption": null,
            "refundEmail": "BABEL.DCEREZO@IBERIA.ES",
            "language": null
        },
        "optionalInformation": [],
        "cashAviosPossibilities": [
            {
                "totalDiscount": 10,
                "currency": "EUR",
                "aviosRequired": 1852,
                "offerAvailable": false,
                "perPassengerDiscounts": [
                    {
                        "discount": 10,
                        "passengerType": "ADT",
                        "numberOfPassengers": 1
                    }
                ]
            },
            {
                "totalDiscount": 66.98,
                "currency": "EUR",
                "aviosRequired": 12404,
                "offerAvailable": false,
                "perPassengerDiscounts": [
                    {
                        "discount": 66.98,
                        "passengerType": "ADT",
                        "numberOfPassengers": 1
                    }
                ]
            },
            {
                "totalDiscount": 111.64,
                "currency": "EUR",
                "aviosRequired": 20674,
                "offerAvailable": false,
                "perPassengerDiscounts": [
                    {
                        "discount": 111.64,
                        "passengerType": "ADT",
                        "numberOfPassengers": 1
                    }
                ]
            },
            {
                "totalDiscount": 178.62,
                "currency": "EUR",
                "aviosRequired": 33078,
                "offerAvailable": false,
                "perPassengerDiscounts": [
                    {
                        "discount": 178.62,
                        "passengerType": "ADT",
                        "numberOfPassengers": 1
                    }
                ]
            },
            {
                "totalDiscount": 223.27,
                "currency": "EUR",
                "aviosRequired": 41346,
                "offerAvailable": false,
                "perPassengerDiscounts": [
                    {
                        "discount": 223.26999999999998,
                        "passengerType": "ADT",
                        "numberOfPassengers": 1
                    }
                ]
            }
        ],
        "specialDiscounts": [],
        "checkedBagAllowances": [
            {
                "type": "PIECE",
                "segmentIds": [
                    "IB041320250217",
                    "IB042820250220"
                ],
                "totalQuantity": 0
            }
        ],
        "accrualQuote": null,
        "bookingCreationDates": [
            {
                "creationDate": "2024-02-26",
                "provider": "IB"
            }
        ],
        "sender": null,
        "officeIata": "7849644",
        "availableForCheckin": false,
        "earlyCheckinDone": false,
        "changeSegmentsByAmadeus": false,
        "orderType": "PURE_IB",
        "flightRatio": "Corto Radio",
        "aviosRedeemed": null,
        "pointsRedeemed": null
    },
    "passengers": [
        {
            "passengerType": "ADULT",
            "personalInfo": {
                "name": "KEN",
                "surname": "MILES",
                "birthDate": null
            },
            "passengerId": "ADULT_01",
            "contactInfo": {
                "phone": "3412345678",
                "phoneDetails": {
                    "number": "12345678",
                    "countryCode": "34"
                },
                "email": "babel.dcerezo@iberia.es",
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
                "relatedContent": null
            },
            "externalPersonalInfo": {
                "name": "ken",
                "firstSurname": "Miles",
                "lastSurname": ""
            }
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
            "commercialCode": "YR2PA",
            "commercialName": "Básica",
            "commercialNameES": "Básica",
            "priority": 0,
            "conditions": [
                {
                    "code": "EQMANO",
                    "name": "Equipaje de mano",
                    "text": "1 bulto (56x40x25cm)",
                    "units": 1,
                    "extendedInfo": {
                        "title": "1 bulto en cabina  (56x40x25cm)",
                        "message": "1 bulto (56x40x25cm)",
                        "code": "CA_EQP_MANO_10KG",
                        "conditionStatus": true
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
                        "conditionStatus": false
                    }
                },
                {
                    "code": "COMIDA",
                    "name": "Comida",
                    "text": "",
                    "units": null,
                    "extendedInfo": {
                        "title": null,
                        "message": null,
                        "code": null,
                        "conditionStatus": true
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
                        "conditionStatus": false
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
                        "conditionStatus": false
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
                        "conditionStatus": false
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
                        "conditionStatus": false
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
                        "conditionStatus": false
                    }
                },
                {
                    "code": "AVIO",
                    "name": "AVIOS",
                    "text": "Si",
                    "units": null,
                    "extendedInfo": {
                        "title": "Avios incluido",
                        "message": "Si",
                        "code": "AVIOS incluido",
                        "conditionStatus": false
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
                        "conditionStatus": false
                    }
                },
                {
                    "code": "CABINA",
                    "name": "Cabina",
                    "text": "Turista",
                    "units": null,
                    "extendedInfo": {
                        "title": "",
                        "message": "Turista",
                        "code": "CA_Cabina_Turista",
                        "conditionStatus": false
                    }
                },
                {
                    "code": "WIFI",
                    "name": "WiFi",
                    "text": "De pago",
                    "units": null,
                    "extendedInfo": {
                        "title": "Seleccionable con coste",
                        "message": "De pago. ",
                        "code": "Wifi pago",
                        "conditionStatus": false
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
                        "conditionStatus": false
                    }
                },
                {
                    "code": "ASIENTODELANTERO",
                    "name": "Asiento Delantero",
                    "text": "De pago",
                    "units": null,
                    "extendedInfo": {
                        "title": "Seleccionable con coste",
                        "message": "De pago",
                        "code": "CA_Asiento_Delantero_pago",
                        "conditionStatus": false
                    }
                },
                {
                    "code": "ASIENTOPREFERENTE",
                    "name": "Asiento preferente",
                    "text": "",
                    "units": null,
                    "extendedInfo": {
                        "title": null,
                        "message": null,
                        "code": null,
                        "conditionStatus": true
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
                        "conditionStatus": false
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
        },
        {
            "cabinType": "E",
            "cabinDescription": "Turista",
            "commercialCode": "YPA",
            "commercialName": "Turista Puente Aéreo",
            "commercialNameES": "Turista Puente Aéreo",
            "priority": 0,
            "conditions": [
                {
                    "code": "EQMANO",
                    "name": "Equipaje de mano",
                    "text": "1 bulto (56x40x25cm)",
                    "units": 1,
                    "extendedInfo": {
                        "title": "1 bulto en cabina  (56x40x25cm)",
                        "message": "1 bulto (56x40x25cm)",
                        "code": "CA_EQP_MANO_10KG",
                        "conditionStatus": true
                    }
                },
                {
                    "code": "EQBODEGA",
                    "name": "Equipaje en bodega",
                    "text": "1 pieza",
                    "units": 1,
                    "extendedInfo": {
                        "title": "1 equipaje en bodega",
                        "message": "Incluido: 1 pieza",
                        "code": "CA_1_PIEZAS",
                        "conditionStatus": true
                    }
                },
                {
                    "code": "COMIDA",
                    "name": "Comida",
                    "text": "",
                    "units": null,
                    "extendedInfo": {
                        "title": null,
                        "message": null,
                        "code": null,
                        "conditionStatus": true
                    }
                },
                {
                    "code": "ASIENTO",
                    "name": "Selección de asiento",
                    "text": "Incluido",
                    "units": null,
                    "extendedInfo": {
                        "title": "Con selección de asiento",
                        "message": "Incluido",
                        "code": "CA_Asiento_Gratuito_No_Destacado",
                        "conditionStatus": false
                    }
                },
                {
                    "code": "CAMBIO",
                    "name": "Cambios",
                    "text": "Permitidos en cualquier momento",
                    "units": null,
                    "extendedInfo": {
                        "title": "Cambio permitido",
                        "message": "Permitidos en cualquier momento",
                        "code": "CA_CAMBIO SIEMPRE",
                        "conditionStatus": true
                    }
                },
                {
                    "code": "REEMBOLSO",
                    "name": "Reembolso (por sentido)",
                    "text": "Permitido en cualquier momento",
                    "units": null,
                    "extendedInfo": {
                        "title": "Reembolso permitido",
                        "message": "Reembolso permitido en cualquier momento.",
                        "code": "CA_REEMBOLSO SIEMPRE",
                        "conditionStatus": true
                    }
                },
                {
                    "code": "ASIENTOXL",
                    "name": "Selección de asiento XL",
                    "text": "Incluido",
                    "units": null,
                    "extendedInfo": {
                        "title": "Con selección de asiento",
                        "message": "Incluido",
                        "code": "CA_Asiento_XL_Incluido",
                        "conditionStatus": true
                    }
                },
                {
                    "code": "AVIO",
                    "name": "AVIOS",
                    "text": "Si",
                    "units": null,
                    "extendedInfo": {
                        "title": "Avios incluido",
                        "message": "Si",
                        "code": "AVIOS incluido",
                        "conditionStatus": false
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
                        "conditionStatus": false
                    }
                },
                {
                    "code": "WIFI",
                    "name": "WiFi",
                    "text": "De pago",
                    "units": null,
                    "extendedInfo": {
                        "title": "Seleccionable con coste",
                        "message": "De pago. ",
                        "code": "Wifi pago",
                        "conditionStatus": false
                    }
                },
                {
                    "code": "CABINA",
                    "name": "Cabina",
                    "text": "Turista",
                    "units": null,
                    "extendedInfo": {
                        "title": "",
                        "message": "Turista",
                        "code": "CA_Cabina_Turista",
                        "conditionStatus": false
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
                        "conditionStatus": false
                    }
                },
                {
                    "code": "EMBARQUE",
                    "name": "Prioridad de Embarque",
                    "text": "Sí, grupo 2",
                    "units": 2,
                    "extendedInfo": {
                        "title": "",
                        "message": "Sí, grupo 2",
                        "code": "CA_Embarque_Prioritario_grupo_2",
                        "conditionStatus": true
                    }
                },
                {
                    "code": "ASIENTOPREFERENTE",
                    "name": "Asiento preferente",
                    "text": "",
                    "units": null,
                    "extendedInfo": {
                        "title": null,
                        "message": null,
                        "code": null,
                        "conditionStatus": true
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
                        "conditionStatus": false
                    }
                },
                {
                    "code": "ASIENTODELANTERO",
                    "name": "Asiento Delantero",
                    "text": "Incluido",
                    "units": null,
                    "extendedInfo": {
                        "title": "Con selección de asiento",
                        "message": "Incluido",
                        "code": "CA_Asiento_Delantero_incluido_OFF",
                        "conditionStatus": false
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
    "onHoldInformation": {
        "timeLimits": timeLimitOH.toISOString(),
        "referenceTimeLimit": timeLimitOH.toISOString(),
        "referenceCity": {
            "code": "MAD",
            "description": "Madrid",
            "countryCode": "ES"
        },
        "paidDeposit": {
            "fare": 5,
            "currency": "EUR"
        },
        "remainingTime": 4317
    },
    "relatedContent": [
        {
            "key": "CONFIRM_ONHOLD_CONDITIONS",
            "value": "Precio total, incluye tarifa aérea, <a href=\"../es/impuestos-y-tasas-gubernamentales/\" target=\"_blank\">tasas</a> (salvo las que se cobren en determinados aeropuertos en el momento de facturar), gastos de gestión, cargos del operador, y las opciones seleccionadas. Consulta <a href=\"../es/gastos-de-gestion/\" target=\"_blank\">aquí</a> posibles gastos de gestión para cambios y reembolsos."
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
            "enabled": false
        },
        {
            "type": "ON_BUSINESS_MODIFICATION",
            "enabled": false
        },
        {
            "type": "ALLOWED_INVOICE_MANAGEMENT",
            "enabled": false
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
            "type": "ALLOWED_VOLUNTARY_REFUND_CASH",
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
    ]
}