export const sliceDetailsModelMock:AvailabilityTransformerModel.Slice = {
    "sliceId": 0,
    "arrivalDateTime": "2024-06-21 13:40",
    "departureDateTime": "2024-06-20 16:10",
    "segments": [
        {
            "segmentId": "IB790320240620",
            "departureDateTime": "2024-06-20 16:10",
            "arrivalDateTime": "2024-06-20 23:55",
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
                "code": "DOH",
                "name": "INTERNATIONAL",
                "terminal": "",
                "city": {
                    "code": "DOH",
                    "description": "Doha",
                    "countryCode": "QA",
                    "country": {
                        "code": "QA",
                        "description": "Qatar"
                    }
                }
            },
            "flight": {
                "marketingCarrier": {
                    "code": "IB",
                    "name": "Iberia"
                },
                "operationalCarrier": {
                    "code": "QR",
                    "name": "Qatar Airways"
                },
                "marketingFlightNumber": "7903",
                "operationalFlightNumber": "0150",
                "operationalDisclosure": "QR",
                "aircraft": {
                    "code": "77W",
                    "description": "Boeing 777-300ER"
                }
            },
            "overnight": false,
            "waitingTime": 0,
            "duration": 405,
            "delayInformation": null,
            "stop": null,
            "durationParsed": "6h 45min.",
            "isMoreThan2h": false,
            "waitingTimeParsed": "",
            "departureDateTimeParsed": "16:10",
            "departureDateParsed": {
                "weekDay": "WEEKDAY_THURSDAY",
                "hour": 2,
                "minutes": 0,
                "day": 20,
                "monthNumber": 6,
                "month": "MONTH_JUNE",
                "year": 2024,
                "formatedDate": "2024-06-20 16:10"
            },
            "arrivalDateParsed": {
                "weekDay": "WEEKDAY_THURSDAY",
                "hour": 2,
                "minutes": 0,
                "day": 20,
                "monthNumber": 6,
                "month": "MONTH_JUNE",
                "year": 2024,
                "formatedDate": "2024-06-20 23:55"
            },
            "arrivalDateTimeParsed": "23:55",
            "companyURL": "/aerolineas/logo_pos_QR.svg",
            "companyURLMin": "/aerolineas/logo_min_QR.svg",
            "warnings": [],
            "terminalChange": {
                "isImportant": false,
                "code": "",
                "message": "",
                "show": false
            },
            "airportChange": {
                "isImportant": false,
                "code": "",
                "message": "",
                "show": false
            },
            "scaleWaitingTime": {
                "isImportant": false,
                "code": "",
                "message": "",
                "show": false
            },
            "nightFlight": {
                "code": "",
                "message": "",
                "isOverNight": false
            }
        },
        {
            "segmentId": "IB797220240621",
            "departureDateTime": "2024-06-21 01:45",
            "arrivalDateTime": "2024-06-21 13:40",
            "departure": {
                "code": "DOH",
                "name": "INTERNATIONAL",
                "terminal": "",
                "city": {
                    "code": "DOH",
                    "description": "Doha",
                    "countryCode": "QA",
                    "country": {
                        "code": "QA",
                        "description": "Qatar"
                    }
                }
            },
            "arrival": {
                "code": "SGN",
                "name": "TAN SON NHAT INTL",
                "terminal": "2",
                "city": {
                    "code": "SGN",
                    "description": "Ho Chi Minh City",
                    "countryCode": "VN",
                    "country": {
                        "code": "VN",
                        "description": "Vietnam"
                    }
                }
            },
            "flight": {
                "marketingCarrier": {
                    "code": "IB",
                    "name": "Iberia"
                },
                "operationalCarrier": {
                    "code": "QR",
                    "name": "Qatar Airways"
                },
                "marketingFlightNumber": "7972",
                "operationalFlightNumber": "0970",
                "operationalDisclosure": "QR",
                "aircraft": {
                    "code": "77W",
                    "description": "Boeing 777-300ER"
                }
            },
            "overnight": false,
            "waitingTime": 110,
            "duration": 475,
            "delayInformation": null,
            "stop": null,
            "durationParsed": "7h 55min.",
            "isMoreThan2h": false,
            "waitingTimeParsed": "1h 50min.",
            "departureDateTimeParsed": "01:45",
            "departureDateParsed": {
                "weekDay": "WEEKDAY_FRYDAY",
                "hour": 2,
                "minutes": 0,
                "day": 21,
                "monthNumber": 6,
                "month": "MONTH_JUNE",
                "year": 2024,
                "formatedDate": "2024-06-21 01:45"
            },
            "arrivalDateParsed": {
                "weekDay": "WEEKDAY_FRYDAY",
                "hour": 2,
                "minutes": 0,
                "day": 21,
                "monthNumber": 6,
                "month": "MONTH_JUNE",
                "year": 2024,
                "formatedDate": "2024-06-21 13:40"
            },
            "arrivalDateTimeParsed": "13:40",
            "companyURL": "/aerolineas/logo_pos_QR.svg",
            "companyURLMin": "/aerolineas/logo_min_QR.svg",
            "warnings": [],
            "terminalChange": {
                "isImportant": false,
                "code": "",
                "message": "",
                "show": false
            },
            "airportChange": {
                "isImportant": false,
                "code": "",
                "message": "",
                "show": false
            },
            "scaleWaitingTime": {
                "isImportant": false,
                "code": "",
                "message": "",
                "show": true,
                "isLong": false
            },
            "nightFlight": {
                "code": "",
                "message": "",
                "isOverNight": false
            }
        }
    ],
    "duration": 1080,
    "cashAvios": false,
    "flightOfTheHouse": false,
    "overnight": true,
    "stopsNumber": 1,
    "bestPrice": false,
    "cabins": {
        "E": {
            "bestPrice": 580.44,
            "bestPriceDiscount": null,
            "expensivePrice": 580.44,
            "expensivePriceDiscount": null,
            "expensivePriceDiscountShown": null,
            "bestPriceDiscountShown": null,
            "bestPriceShown": "580€",
            "expensivePriceShown": "580€",
            "cabinDescription": "Turista",
            "cabinAvailable": true,
            "isCabinCompatible": true,
            "fareFamilies": [
                {
                    "cabinType": "E",
                    "cabinDescription": "Turista",
                    "commercialCode": "OPTLH",
                    "commercialName": "Óptima",
                    "commercialNameES": "Óptima",
                    "priority": 700,
                    "conditions": [
                        {
                            "code": "EQMANO",
                            "name": "Equipaje de mano",
                            "text": "Incluida 1 pieza hasta 10 kg (56x40x25cm).",
                            "units": 1,
                            "extendedInfo": {
                                "title": "Equipaje de mano: 1 pieza",
                                "message": "Incluida 1 pieza hasta 10 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo. ",
                                "code": "CA_EQP_MANO_10KG",
                                "conditionStatus": true,
                                "observationCode": null
                            },
                            "key": 0,
                            "previewStatus": true,
                        },
                        {
                            "code": "EQBODEGA",
                            "name": "Equipaje en bodega",
                            "text": "Incluida 1 pieza hasta 23 kg y 158 cm.",
                            "units": 1,
                            "extendedInfo": {
                                "title": "Equipaje facturable: 1 pieza",
                                "message": "Incluida 1 pieza hasta 23 kg y 158 cm.",
                                "code": "CA_1_PIEZAS",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 1,
                            "previewStatus": true,
                        },
                        {
                            "code": "COMIDA",
                            "name": "Comida",
                            "text": "Incluida.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Comida incluida",
                                "message": "Incluida. ",
                                "code": "Comida_incluida",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 2,
                            "previewStatus": true,
                        },
                        {
                            "code": "ASIENTO",
                            "name": "Selección de asiento",
                            "text": "Gratuita desde 24h antes del vuelo.",
                            "units": 24,
                            "extendedInfo": {
                                "title": "Selección de asiento 24h antes del vuelo",
                                "message": "Gratuita desde 24h antes del vuelo.",
                                "code": "CA_Asiento_Gratis_24_horas",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 3,
                            "previewStatus": true,
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
                                "conditionStatus": false,
                                "observationCode": "1",
                            },
                            "key": 4,
                            "previewStatus": true,
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
                            },
                            "key": 5,
                            "previewStatus": true,
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
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 6,
                            "previewStatus": true,
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
                            },
                            "key": 7,
                            "previewStatus": true,
                        },
                        {
                            "code": "CAMBIO",
                            "name": "Cambios",
                            "text": "Permitido con coste, no permitido en caso de no-show.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Cambio de vuelo con coste, salvo excepciones",
                                "message": "Permitido en cualquier momento con penalización de 150 EUR/ 190 USD. No permitido en caso de no presentarse al vuelo (no-show).",
                                "code": "CA_CAMBIO CON PENALTY_150€/190USD_NO_SHOW_NO_PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 9,
                            "previewStatus": true,
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
                            },
                            "key": 10,
                            "previewStatus": true,
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
                            },
                            "key": 11,
                            "previewStatus": true,
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
                            },
                            "key": 12,
                            "previewStatus": true,
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
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 14,
                            "previewStatus": false,
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
                            },
                            "key": 26,
                            "previewStatus": false,
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
                            },
                            "key": 28,
                            "previewStatus": false,
                        },
                        {
                            "code": "AVIO",
                            "name": "AVIOS",
                            "text": "Incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Obtén Avios con tu compra",
                                "message": "Incluido.  ",
                                "code": "AVIOS incluido",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 29,
                            "previewStatus": false,
                        },
                        {
                            "code": "WIFI",
                            "name": "WiFi",
                            "text": "Disponible con coste, según el tipo de avión.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Wifi con coste",
                                "message": "Disponible con coste, según el tipo de avión. ",
                                "code": "Wifi pago",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 30,
                            "previewStatus": false,
                        }
                    ],
                    "observations": [
                        {
                            "observationCode": 1,
                            "observationText": ""
                        }
                    ],
                    "conditionsPriority": [
                        "EQMANO",
                        "EQBODEGA",
                        "COMIDA",
                        "ASIENTO",
                        "ASIENTOXL",
                        "ASIENTODELANTERO",
                        "ASIENTOPREFERENTE",
                        "EMBARQUE",
                        "TARJEMBANTIC",
                        "CAMBIO",
                        "REEMBOLSO",
                        "CHECKINDESK",
                        "FASTTRACK",
                        "AEROPUERTO"
                    ],
                    "isCompatibleFare": true,
                    "farePrice": 580.44,
                    "fareDiscountPriceToCalculate": 0,
                    "farePriceToCalculate": 580.44,
                    "farePriceShown": "580€",
                    "fareOutTax": 371,
                    "fareDiscountPriceShown": null,
                    "fareCurrency": "EUR",
                    "remainingSeats": 5,
                    "offers": [
                        {
                            "offerId": "IB579fc7fd95e6437d96565d253fce6da3OP",
                            "offerItems": [
                                {
                                    "offerItemId": "IB579fc7fd95e6437d96565d253fce6da3OP_01",
                                    "price": {
                                        "fare": 1589,
                                        "tax": 414.93,
                                        "total": 2003.93,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "passengerIds": [
                                        "ADULT_01"
                                    ],
                                    "privateFareInformation": null,
                                    "detailedTaxes": null
                                }
                            ],
                            "originDestinations": [
                                {
                                    "priceDiscountApplied": false,
                                    "adultPriceDiscountData":{
                                        "totalOriginal":null
                                    },
                                    "totalPrice": {
                                        "fare": 371,
                                        "tax": 209.44,
                                        "total": 580.44,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "adultPrice": {
                                        "fare": 371,
                                        "tax": 209.44,
                                        "total": 580.44,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "perPassengerPrice": {
                                        "fare": 371,
                                        "tax": 209.44,
                                        "total": 580.44,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "originDestinationId": "ODI_0",
                                    "applicableSlices": [
                                        {
                                            "sliceId": 0,
                                            "remainingSeats": 5,
                                            "segments": [
                                                {
                                                    "segmentId": "IB790320240620",
                                                    "fareFamily": "OPTLH",
                                                    "bookingCode": null,
                                                    "bookingClass": "ECONOMY",
                                                    "rbd": "N",
                                                    "remainingSeats": 5,
                                                    "fareBasis": "NDL3XNM6",
                                                    "extendedFareCode": "NDL3XNM6",
                                                    "brandCode": null,
                                                    "checkedBaggageAllowanceKeys": [],
                                                    "carryOnBaggageAllowanceKeys": [],
                                                    "seatDisplays": null,
                                                    "cabinDescription": ""
                                                },
                                                {
                                                    "segmentId": "IB797220240621",
                                                    "fareFamily": "OPTLH",
                                                    "bookingCode": null,
                                                    "bookingClass": "ECONOMY",
                                                    "rbd": "N",
                                                    "remainingSeats": 5,
                                                    "fareBasis": "NDL3XNM6",
                                                    "extendedFareCode": "NDL3XNM6",
                                                    "brandCode": null,
                                                    "checkedBaggageAllowanceKeys": [],
                                                    "carryOnBaggageAllowanceKeys": [],
                                                    "seatDisplays": null,
                                                    "cabinDescription": ""
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "timeLimits": new Date("2024-05-03T07:35:22.746"),
                            "paymentTimeLimit": null,
                            "specialDiscountsApplied": [],
                            "providerOfferId": "OFE_1c5c4738-d3bf-4b4a-91c2-760fa0982644_29",
                            "privateFare": false,
                            "offerType": "",
                            "flightModificationOnDemand": false,
                            "discountsApplied": null,
                            "excludePenalties": false,
                            "price": {
                                "fare": 371,
                                "tax": 209.44,
                                "total": 580.44,
                                "currency": "EUR",
                                "ticketingFee": 0
                            }
                        }
                    ],
                    "oBdiscount": false,
                    "includedPriceDiscount": false
                }
            ],
            "bestCabinsPrice": false,
            "type": "E",
        },
        "B": {
            "bestPrice": 3085.44,
            "bestPriceDiscount": null,
            "expensivePrice": 3085.44,
            "expensivePriceDiscount": null,
            "expensivePriceDiscountShown": null,
            "bestPriceDiscountShown": null,
            "bestPriceShown": "3.085€",
            "expensivePriceShown": "3.085€",
            "cabinDescription": "Business Class",
            "cabinAvailable": true,
            "isCabinCompatible": true,
            "fareFamilies": [
                {
                    "cabinType": "B",
                    "cabinDescription": "Business Class",
                    "commercialCode": "BUSOPTLH",
                    "commercialName": "Business Óptima",
                    "commercialNameES": "Business Óptima",
                    "priority": 200,
                    "conditions": [
                        {
                            "code": "EQMANO",
                            "name": "Equipaje de mano",
                            "text": "Incluidas 2 piezas de hasta 14 kg (56x40x25cm).",
                            "units": 2,
                            "extendedInfo": {
                                "title": "Equipaje de mano: 2 piezas",
                                "message": "Incluidas 2 piezas de hasta 14 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo. ",
                                "code": "CA_EQP_MANO_BUSINESS",
                                "conditionStatus": true,
                                "observationCode": null
                            },
                            "key": 0,
                            "previewStatus": true,
                        },
                        {
                            "code": "EQBODEGA",
                            "name": "Equipaje en bodega",
                            "text": "Incluidas 2 piezas hasta 23 kg y 158 cm, cada una.",
                            "units": 2,
                            "extendedInfo": {
                                "title": "Equipaje facturable: 2 piezas",
                                "message": "Incluidas 2 piezas hasta 23 kg y 158 cm, cada una.",
                                "code": "CA_2_PIEZAS",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 1,
                            "previewStatus": true,
                        },
                        {
                            "code": "COMIDA",
                            "name": "Comida",
                            "text": "Incluida.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Comida incluida",
                                "message": "Incluida. ",
                                "code": "Comida_incluida",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 2,
                            "previewStatus": true,
                        },
                        {
                            "code": "ASIENTO",
                            "name": "Selección de asiento",
                            "text": "Gratuita desde 24h antes del vuelo.",
                            "units": 24,
                            "extendedInfo": {
                                "title": "Selección de asiento 24h antes del vuelo",
                                "message": "Gratuita desde 24h antes del vuelo.",
                                "code": "CA_Asiento_Gratis_24_horas",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 3,
                            "previewStatus": true,
                        },
                        {
                            "code": "ASIENTOXL",
                            "name": "Asiento espacio extra",
                            "text": "No aplica.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Asiento espacio extra no aplica",
                                "message": "No aplica.",
                                "code": "CA_Asiento_XL_No_Aplica",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 4,
                            "previewStatus": true,
                        },
                        {
                            "code": "ASIENTODELANTERO",
                            "name": "Asiento delantero",
                            "text": "No aplica.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Asiento delantero no aplica",
                                "message": "No aplica.",
                                "code": "CA_Asiento_Delantero_NO_aplcia",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 5,
                            "previewStatus": true,
                        },
                        {
                            "code": "ASIENTOPREFERENTE",
                            "name": "Asiento preferente",
                            "text": "Con coste.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Asiento preferente con coste",
                                "message": "Con coste.",
                                "code": "CA_Asiento_Preferente_Pago",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 6,
                            "previewStatus": true,
                        },
                        {
                            "code": "EMBARQUE",
                            "name": "Prioridad de Embarque",
                            "text": "Incluido (Grupo 1).",
                            "units": 1,
                            "extendedInfo": {
                                "title": "Embarque prioritario Grupo 1 ",
                                "message": "Incluido (Grupo 1).",
                                "code": "CA_Embarque_Prioritario_grupo_1",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 7,
                            "previewStatus": true,
                        },
                        {
                            "code": "CAMBIO",
                            "name": "Cambios",
                            "text": "Permitido con coste, no permitido en caso de no-show.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Cambio de vuelo con coste, salvo excepciones",
                                "message": "Permitido en cualquier momento con penalización de 200 EUR/ 250 USD. No permitido en caso de no presentarse al vuelo (no-show).",
                                "code": "CA_CAMBIO CON PENALTY_200€/250USD_NO_SHOW_NO_PERMITIDO",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 9,
                            "previewStatus": true,
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
                            },
                            "key": 10,
                            "previewStatus": true,
                        },
                        {
                            "code": "CHECKINDESK",
                            "name": "Mostrador check-in exclusivo",
                            "text": "Incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Mostrador Check-in exclusivo incluido",
                                "message": "Incluido.",
                                "code": "Chek-in_desk_ SI",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 11,
                            "previewStatus": true,
                        },
                        {
                            "code": "FASTTRACK",
                            "name": "Fast Track",
                            "text": "Incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Fast Track incluido",
                                "message": "Incluido.",
                                "code": "Fast Track SI",
                                "conditionStatus": true,
                                "observationCode": null,
                            },
                            "key": 12,
                            "previewStatus": true,
                        },
                        {
                            "code": "CABINA",
                            "name": "Cabina",
                            "text": "Business.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Cabina Business ",
                                "message": "Business.",
                                "code": "CA_Cabina_Busines",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 14,
                            "previewStatus": false,
                        },
                        {
                            "code": "SALAVIP",
                            "name": "Acceso a salas VIP",
                            "text": "Acceso incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Acceso a Sala Vip incluido",
                                "message": "Acceso incluido. ",
                                "code": "Acceso a salas VIP permitido",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 26,
                            "previewStatus": false,
                        },
                        {
                            "code": "EQPPRIOR",
                            "name": "Entrega prioritaria equipaje",
                            "text": "Incluida.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Entrega rápida de equipaje incluida",
                                "message": "Incluida.",
                                "code": "Entrega_prioritaria_equipaje_ SI",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 28,
                            "previewStatus": false,
                        },
                        {
                            "code": "AVIO",
                            "name": "AVIOS",
                            "text": "Incluido.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Obtén Avios con tu compra",
                                "message": "Incluido.  ",
                                "code": "AVIOS incluido",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 29,
                            "previewStatus": false,
                        },
                        {
                            "code": "WIFI",
                            "name": "WiFi",
                            "text": "Disponible con coste, según el tipo de avión.",
                            "units": null,
                            "extendedInfo": {
                                "title": "Wifi con coste",
                                "message": "Disponible con coste, según el tipo de avión. ",
                                "code": "Wifi pago",
                                "conditionStatus": false,
                                "observationCode": null,
                            },
                            "key": 30,
                            "previewStatus": false,
                        }
                    ],
                    "observations": [],
                    "conditionsPriority": [
                        "EQMANO",
                        "EQBODEGA",
                        "COMIDA",
                        "ASIENTO",
                        "ASIENTOXL",
                        "ASIENTODELANTERO",
                        "ASIENTOPREFERENTE",
                        "EMBARQUE",
                        "TARJEMBANTIC",
                        "CAMBIO",
                        "REEMBOLSO",
                        "CHECKINDESK",
                        "FASTTRACK",
                        "AEROPUERTO"
                    ],
                    "isCompatibleFare": true,
                    "farePrice": 3085.44,
                    "fareDiscountPriceToCalculate": 0,
                    "farePriceToCalculate": 3085.44,
                    "farePriceShown": "3.085€",
                    "fareOutTax": 2476,
                    "fareDiscountPriceShown": null,
                    "fareCurrency": "EUR",
                    "remainingSeats": 5,
                    "offers": [
                        {
                            "offerId": "IBbd6a0ec2db454a4bb24f17eaf0868e16OP",
                            "offerItems": [
                                {
                                    "offerItemId": "IBbd6a0ec2db454a4bb24f17eaf0868e16OP_01",
                                    "price": {
                                        "fare": 3694,
                                        "tax": 814.93,
                                        "total": 4508.93,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "passengerIds": [
                                        "ADULT_01"
                                    ],
                                    "privateFareInformation": null,
                                    "detailedTaxes": null
                                }
                            ],
                            "originDestinations": [
                                {
                                    "priceDiscountApplied": false,
                                    "adultPriceDiscountData":{
                                        "totalOriginal":null
                                    },
                                    "totalPrice": {
                                        "fare": 2476,
                                        "tax": 609.44,
                                        "total": 3085.44,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "adultPrice": {
                                        "fare": 2476,
                                        "tax": 609.44,
                                        "total": 3085.44,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "perPassengerPrice": {
                                        "fare": 2476,
                                        "tax": 609.44,
                                        "total": 3085.44,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "originDestinationId": "ODI_0",
                                    "applicableSlices": [
                                        {
                                            "sliceId": 0,
                                            "remainingSeats": 5,
                                            "segments": [
                                                {
                                                    "segmentId": "IB790320240620",
                                                    "fareFamily": "BUSOPTLH",
                                                    "bookingCode": null,
                                                    "bookingClass": "BUSINESS",
                                                    "rbd": "C",
                                                    "remainingSeats": 5,
                                                    "fareBasis": "CDN0XNM6",
                                                    "extendedFareCode": "CDN0XNM6",
                                                    "brandCode": null,
                                                    "checkedBaggageAllowanceKeys": [],
                                                    "carryOnBaggageAllowanceKeys": [],
                                                    "seatDisplays": null,
                                                    "cabinDescription": ""
                                                },
                                                {
                                                    "segmentId": "IB797220240621",
                                                    "fareFamily": "BUSOPTLH",
                                                    "bookingCode": null,
                                                    "bookingClass": "BUSINESS",
                                                    "rbd": "C",
                                                    "remainingSeats": 5,
                                                    "fareBasis": "CDN0XNM6",
                                                    "extendedFareCode": "CDN0XNM6",
                                                    "brandCode": null,
                                                    "checkedBaggageAllowanceKeys": [],
                                                    "carryOnBaggageAllowanceKeys": [],

                                                    "seatDisplays": null,
                                                    "cabinDescription": ""
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "timeLimits": new Date("2024-05-03T07:35:22.746"),
                            "paymentTimeLimit": null,
                            "specialDiscountsApplied": [],
                            "providerOfferId": "OFE_1c5c4738-d3bf-4b4a-91c2-760fa0982644_27",
                            "privateFare": false,
                            "offerType": "",
                            "flightModificationOnDemand": false,
                            "discountsApplied": null,
                            "excludePenalties": false,
                            "price": {
                                "fare": 2476,
                                "tax": 609.44,
                                "total": 3085.44,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                        }
                    ],
                    "oBdiscount": false,
                    "includedPriceDiscount": false
                }
            ],
            "bestCabinsPrice": false,
            "type": "B",
        }
    },
    "cabinsLength": 2,
    "showFares": false,
    "slicePrice": 580.44,
    "slicePriceShown": "580€",
    "sliceCurrency": "EUR",
    "durationParsed": "18h ",
    "departureDateTimeParsed": "16:10",
    "departureDateParsed": {
        "weekDay": "WEEKDAY_THURSDAY",
        "hour": 2,
        "minutes": 0,
        "day": 20,
        "monthNumber": 6,
        "month": "MONTH_JUNE",
        "year": 2024,
        "formatedDate": "2024-06-20 16:10"
    },
    "arrivalDateParsed": {
        "weekDay": "WEEKDAY_FRYDAY",
        "hour": 2,
        "minutes": 0,
        "day": 21,
        "monthNumber": 6,
        "month": "MONTH_JUNE",
        "year": 2024,
        "formatedDate": "2024-06-21 13:40"
    },
    "arrivalDateTimeParsed": "13:40",
    "daysOfTravel": 1,
    "allOperatedBy": [
        "Qatar Airways",
        "Qatar Airways"
    ],
    "allOperatedByCodes": [
        "QR",
        "QR"
    ],
    "technicalStop": 0,
    "sliceURL": "/aerolineas/logo_pos_QR.svg",
    "sliceURLMin": "/aerolineas/logo_min_QR.svg",
    "maxSlicePrice": 3085.44,
    "sliceSelectedDiscount": false,
    "sliceSelectedDiscountImage": null,
    "slicePromotionImage": null,
    "showedCabin":null
}
