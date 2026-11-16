export const selectedSliceMock: AvailabilityTransformerModel.SelectedSlice = {
    "available": true,
    "destinationCountry": 'ES',
    "originCountry": 'ES',
    "selectedSliceIndex": 0,
    "selectedSlicesLength": 0,
    "cabin": "E",
    "originDestinationId": "ODI_0",
    "origin": "MAD",
    "destination": "MAH",
    "info": {
        "sliceId": 32,
        "arrivalDateTime": "2023-09-23 08:15",
        "departureDateTime": "2023-09-23 06:50",
        "segments": [
            {
                "segmentId": "IB381620230923",
                "departureDateTime": "2023-09-23 06:50",
                "arrivalDateTime": "2023-09-23 08:15",
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
                    "code": "MAH",
                    "name": "MENORCA",
                    "terminal": "",
                    "city": {
                        "code": "MAH",
                        "description": "Menorca",
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
                        "code": "I2",
                        "name": "Iberia Express"
                    },
                    "marketingFlightNumber": "3816",
                    "operationalFlightNumber": "3816",
                    "operationalDisclosure": "I2",
                    "aircraft": {
                        "code": "32Q",
                        "description": "Airbus A321neo"
                    }
                },
                "overnight": false,
                "waitingTime": 0,
                "duration": 85,
                "delayInformation": null,
                "stop": null,
                "durationParsed": "1h 25min.",
                "isMoreThan2h": false,
                "waitingTimeParsed": "",
                "departureDateTimeParsed": "06:50",
                "departureDateParsed": {
                    "weekDay": "WEEKDAY_SATURDAY",
                    "hour": 2,
                    "minutes": 0,
                    "day": 23,
                    "monthNumber": 9,
                    "month": "MONTH_SEPTEMBER",
                    "year": 2023,
                    "formatedDate": "2023-09-23 06:50"
                },
                "arrivalDateTimeParsed": "08:15",
                "companyURL": "/aerolineas/logo_pos_I2.svg",
                "warnings": [],
                "scaleWaitingTime": {
                    isImportant: false,
                    code: '',
                    message: '',
                    show: false
                },
                "airportChange": {
                    isImportant: false,
                    code: '',
                    message: '',
                    show: false
                },
                "terminalChange": {
                    isImportant: false,
                    code: '',
                    message: '',
                    show: false
                },
                nightFlight: {
                    isOverNight: false,
                    code: "",
                    message: ""
                }
            }
        ],
        "duration": 85,
        "cashAvios": true,
        "flightOfTheHouse": true,
        "overnight": false,
        "stopsNumber": 0,
        "bestPrice": false,
        "cabins": {
            "E": {
                "bestPrice": 48.21,
                "bestPriceDiscount": null,
                "expensivePrice": 78.21,
                "expensivePriceDiscount": 0,
                "expensivePriceDiscountShown": null,
                "bestPriceDiscountShown": null,
                "bestPriceShown": "48€",
                "expensivePriceShown": "78€",
                "cabinDescription": "Turista",
                "cabinAvailable": true,
                "isCabinCompatible": true,
                "fareFamilies": [
                    {
                        "cabinType": "E",
                        "cabinDescription": "Turista",
                        "commercialCode": "TBAESEU",
                        "commercialName": "Básica",
                        "commercialNameES": "Básica",
                        "priority": 900,
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
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 0,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 1,
                                "previewStatus": true
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 2,
                                "previewStatus": true
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
                                    "conditionStatus": false,
                                    "observationCode": "1"
                                },
                                "key": 3,
                                "previewStatus": true
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
                                    "observationCode": "2"
                                },
                                "key": 4,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 5,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 6,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 7,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 9,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 10,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 11,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 12,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 13,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 25,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 27,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 28,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 29,
                                "previewStatus": false
                            }
                        ],
                        "observations": [
                            {
                                "observationCode": 1,
                                "observationText": ''
                            },
                            {
                                "observationCode": 2,
                                "observationText": ''
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
                            "FASTTRACK"
                        ],
                        "isCompatibleFare": true,
                        "farePrice": 48.21,
                        "fareDiscountPriceToCalculate": 0,
                        "farePriceToCalculate": 48.21,
                        "farePriceShown": "48€",
                        "fareOutTax": 29,
                        "fareDiscountPriceShown": null,
                        "fareCurrency": "EUR",
                        "remainingSeats": 9,
                        "offers": [
                            {
                                "offerId": "IBb8d4bb78b25f48b0ab67459ccf9065f9OP",
                                "offerItems": [
                                    {
                                        "offerItemId": "IBb8d4bb78b25f48b0ab67459ccf9065f9OP_01",
                                        "price": {
                                            "fare": 204,
                                            "tax": 27.63,
                                            "total": 231.63,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "passengerIds": [
                                            "ADULT_01"
                                        ],
                                        "privateFareInformation": null
                                    }
                                ],
                                "originDestinations": [
                                    {
                                        "priceDiscountApplied": false,
                                        "adultPriceDiscountData": {
                                            "totalOriginal": 0
                                        },
                                        "totalPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "adultPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "perPassengerPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "originDestinationId": "ODI_0",
                                        "applicableSlices": [
                                            {
                                                "sliceId": 0,
                                                "remainingSeats": 9,
                                                "segments": [
                                                    {
                                                        "segmentId": "IB381620230923",
                                                        "fareFamily": "TBAESEU",
                                                        "bookingCode": null,
                                                        "bookingClass": "ECONOMY",
                                                        "rbd": "O",
                                                        "remainingSeats": 9,
                                                        "fareBasis": "ODNNB2",
                                                        "extendedFareCode": "ODNNB2",
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
                                "timeLimits": new Date("2023-09-20T09:01:54.709Z"),
                                "paymentTimeLimit": null,
                                "specialDiscountsApplied": [],
                                "providerOfferId": "OFE_f7a391f0-ef58-4231-9fe2-0bb950431eb3_411",
                                "privateFare": false,
                                "offerType": "",
                                "flightModificationOnDemand": false,
                                "discountsApplied": null,
                                "excludePenalties": false,
                                "price": {
                                    "fare": 29,
                                    "tax": 19.21,
                                    "total": 48.21,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "oBdiscount": false,
                        "includedPriceDiscount": false
                    },
                    {
                        "cabinType": "E",
                        "cabinDescription": "Turista",
                        "commercialCode": "YROSP2",
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
                                    "message": "Incluida 1 pieza hasta 10 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                                    "code": "CA_EQP_MANO_10KG",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 0,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 1,
                                "previewStatus": true
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 2,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 3,
                                "previewStatus": true
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
                                    "observationCode": "1"
                                },
                                "key": 4,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 5,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 6,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 7,
                                "previewStatus": true
                            },
                            {
                                "code": "CAMBIO",
                                "name": "Cambios",
                                "text": "Permitido con coste, no permitido en caso de no-show.",
                                "units": 45,
                                "extendedInfo": {
                                    "title": "Cambio de vuelo con coste, salvo excepciones",
                                    "message": "Permitido con penalización de 45 EUR. No permitido en caso de no presentarse al vuelo (no-show).",
                                    "code": "CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 9,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 10,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 11,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 12,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 13,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 25,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 27,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 28,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 29,
                                "previewStatus": false
                            }
                        ],
                        "observations": [
                            {
                                "observationCode": 1,
                                "observationText": ''
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
                            "FASTTRACK"
                        ],
                        "isCompatibleFare": true,
                        "farePrice": 62.21,
                        "fareDiscountPriceToCalculate": 0,
                        "farePriceToCalculate": 62.21,
                        "farePriceShown": "62€",
                        "fareOutTax": 43,
                        "fareDiscountPriceShown": null,
                        "fareCurrency": "EUR",
                        "remainingSeats": 9,
                        "offers": [
                            {
                                "offerId": "IB1bd85dbb83534023bb154cc9dec0275fOP",
                                "offerItems": [
                                    {
                                        "offerItemId": "IB1bd85dbb83534023bb154cc9dec0275fOP_01",
                                        "price": {
                                            "fare": 218,
                                            "tax": 27.63,
                                            "total": 245.63,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "passengerIds": [
                                            "ADULT_01"
                                        ],
                                        "privateFareInformation": null
                                    }
                                ],
                                "originDestinations": [
                                    {
                                        "priceDiscountApplied": false,
                                        "adultPriceDiscountData": {
                                            "totalOriginal": 0
                                        },
                                        "totalPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "adultPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "perPassengerPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "originDestinationId": "ODI_0",
                                        "applicableSlices": [
                                            {
                                                "sliceId": 0,
                                                "remainingSeats": 9,
                                                "segments": [
                                                    {
                                                        "segmentId": "IB381620230923",
                                                        "fareFamily": "TBAESEU",
                                                        "bookingCode": null,
                                                        "bookingClass": "ECONOMY",
                                                        "rbd": "O",
                                                        "remainingSeats": 9,
                                                        "fareBasis": "ODNNB2",
                                                        "extendedFareCode": "ODNNB2",
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
                                "timeLimits": new Date("2023-09-20T09:13:33.112"),
                                "paymentTimeLimit": null,
                                "specialDiscountsApplied": [],
                                "providerOfferId": "OFE_f7a391f0-ef58-4231-9fe2-0bb950431eb3_419",
                                "privateFare": false,
                                "offerType": "",
                                "flightModificationOnDemand": false,
                                "discountsApplied": null,
                                "excludePenalties": false,
                                "price": {
                                    "fare": 43,
                                    "tax": 19.21,
                                    "total": 62.21,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "oBdiscount": false,
                        "includedPriceDiscount": false
                    },
                    {
                        "cabinType": "E",
                        "cabinDescription": "Turista",
                        "commercialCode": "COTCLESEU",
                        "commercialName": "Confort",
                        "commercialNameES": "Confort",
                        "priority": 600,
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
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 0,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 1,
                                "previewStatus": true
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 2,
                                "previewStatus": true
                            },
                            {
                                "code": "ASIENTO",
                                "name": "Selección de asiento",
                                "text": "Incluida.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Selección de asiento incluida",
                                    "message": "Incluida.",
                                    "code": "CA_Asiento_Gratuito_No_Destacado",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 3,
                                "previewStatus": true
                            },
                            {
                                "code": "ASIENTOXL",
                                "name": "Asiento espacio extra",
                                "text": "Incluido.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Asiento espacio extra incluido",
                                    "message": "Incluido.",
                                    "code": "CA_Asiento_XL_Incluido",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 4,
                                "previewStatus": true
                            },
                            {
                                "code": "ASIENTODELANTERO",
                                "name": "Asiento delantero",
                                "text": "Incluido.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Asiento delantero incluido",
                                    "message": "Incluido. (En vuelos operados por Iberia, Iberia Express y Air Nostrum).",
                                    "code": "CA_Asiento_Delantero_incluido_OFF",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 5,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 6,
                                "previewStatus": true
                            },
                            {
                                "code": "EMBARQUE",
                                "name": "Prioridad de Embarque",
                                "text": "Incluido (Grupo 2).",
                                "units": 2,
                                "extendedInfo": {
                                    "title": "Embarque prioritario Grupo 2",
                                    "message": "Incluido (Grupo 2). (En vuelos operados por Iberia, Iberia Express y Air Nostrum).",
                                    "code": "CA_Embarque_Prioritario_grupo_2",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 7,
                                "previewStatus": true
                            },
                            {
                                "code": "CAMBIO",
                                "name": "Cambios",
                                "text": "Primer cambio gratis, resto de cambios con coste. Ver excepciones.",
                                "units": 45,
                                "extendedInfo": {
                                    "title": "Primer cambio de vuelo gratis",
                                    "message": "Primer cambio permitido en cualquier momento, sin penalización. Siguientes cambios permitidos, con penalización de 45 EUR. Cambios no permitidos en caso de no presentarse al vuelo (no show).",
                                    "code": "CA_1 PERM SIG CON PENALTY_45EUR_NO_SHOW_NO_PERMITID",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 9,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 10,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 11,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 12,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 13,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 25,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 27,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 28,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 29,
                                "previewStatus": false
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
                            "FASTTRACK"
                        ],
                        "isCompatibleFare": true,
                        "farePrice": 78.21,
                        "fareDiscountPriceToCalculate": 0,
                        "farePriceToCalculate": 78.21,
                        "farePriceShown": "78€",
                        "fareOutTax": 59,
                        "fareDiscountPriceShown": null,
                        "fareCurrency": "EUR",
                        "remainingSeats": 9,
                        "offers": [
                            {
                                "offerId": "IB833644ae36d04030b034937b80b6f1a0OP",
                                "offerItems": [
                                    {
                                        "offerItemId": "IB833644ae36d04030b034937b80b6f1a0OP_01",
                                        "price": {
                                            "fare": 234,
                                            "tax": 27.63,
                                            "total": 261.63,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "passengerIds": [
                                            "ADULT_01"
                                        ],
                                        "privateFareInformation": null
                                    }
                                ],
                                "originDestinations": [
                                    {
                                        "priceDiscountApplied": false,
                                        "adultPriceDiscountData": {
                                            "totalOriginal": 0
                                        },
                                        "totalPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "adultPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "perPassengerPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "originDestinationId": "ODI_0",
                                        "applicableSlices": [
                                            {
                                                "sliceId": 0,
                                                "remainingSeats": 9,
                                                "segments": [
                                                    {
                                                        "segmentId": "IB381620230923",
                                                        "fareFamily": "TBAESEU",
                                                        "bookingCode": null,
                                                        "bookingClass": "ECONOMY",
                                                        "rbd": "O",
                                                        "remainingSeats": 9,
                                                        "fareBasis": "ODNNB2",
                                                        "extendedFareCode": "ODNNB2",
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
                                "timeLimits": new Date("2023-09-20T09:13:33.112"),
                                "paymentTimeLimit": null,
                                "specialDiscountsApplied": [],
                                "providerOfferId": "OFE_f7a391f0-ef58-4231-9fe2-0bb950431eb3_407",
                                "privateFare": false,
                                "offerType": "",
                                "flightModificationOnDemand": false,
                                "discountsApplied": null,
                                "excludePenalties": false,
                                "price": {
                                    "fare": 59,
                                    "tax": 19.21,
                                    "total": 78.21,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "oBdiscount": false,
                        "includedPriceDiscount": false
                    }
                ],
                "bestCabinsPrice": false
            },
            "B": {
                "bestPrice": 162.21,
                "bestPriceDiscount": null,
                "expensivePrice": 287.21,
                "expensivePriceDiscount": 0,
                "expensivePriceDiscountShown": null,
                "bestPriceDiscountShown": null,
                "bestPriceShown": "162€",
                "expensivePriceShown": "287€",
                "cabinDescription": "Business Class",
                "cabinAvailable": true,
                "isCabinCompatible": true,
                "fareFamilies": [
                    {
                        "cabinType": "B",
                        "cabinDescription": "Business Class",
                        "commercialCode": "BUSOPTMH",
                        "commercialName": "Business Óptima",
                        "commercialNameES": "Business Óptima",
                        "priority": 200,
                        "conditions": [
                            {
                                "code": "EQMANO",
                                "name": "Equipaje de mano",
                                "text": "Incluida 1 pieza hasta 14 kg (56x40x25cm).",
                                "units": 1,
                                "extendedInfo": {
                                    "title": "Equipaje de mano: 1 pieza",
                                    "message": "Incluida 1 pieza hasta 14 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                                    "code": "CA_EQP_MANO_BUSINESS_CM_RADIO",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 0,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 1,
                                "previewStatus": true
                            },
                            {
                                "code": "COMIDA",
                                "name": "Comida",
                                "text": "Incluida.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Comida incluida",
                                    "message": "Incluida.",
                                    "code": "Comida_incluida",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 2,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 3,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 4,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 5,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 6,
                                "previewStatus": true
                            },
                            {
                                "code": "EMBARQUE",
                                "name": "Prioridad de Embarque",
                                "text": "Incluido (Grupo 1).",
                                "units": 1,
                                "extendedInfo": {
                                    "title": "Embarque prioritario Grupo 1",
                                    "message": "Incluido (Grupo 1).",
                                    "code": "CA_Embarque_Prioritario_grupo_1",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 7,
                                "previewStatus": true
                            },
                            {
                                "code": "CAMBIO",
                                "name": "Cambios",
                                "text": "Permitido con coste, no permitido en caso de no-show.",
                                "units": 60,
                                "extendedInfo": {
                                    "title": "Cambio de vuelo con coste, salvo excepciones",
                                    "message": "Permitido con penalización de 60 EUR. No permitido en caso de no presentarse al vuelo (no-show).",
                                    "code": "CA_CAMBIO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 9,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 10,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 11,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 12,
                                "previewStatus": true
                            },
                            {
                                "code": "CABINA",
                                "name": "Cabina",
                                "text": "Business.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Cabina Business",
                                    "message": "Business.",
                                    "code": "CA_Cabina_Busines",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 13,
                                "previewStatus": false
                            },
                            {
                                "code": "SALAVIP",
                                "name": "Acceso a salas VIP",
                                "text": "Acceso incluido.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Acceso a Sala Vip no incluido",
                                    "message": "Acceso incluido.",
                                    "code": "Acceso a salas VIP permitido",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 25,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 27,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 28,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 29,
                                "previewStatus": false
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
                            "FASTTRACK"
                        ],
                        "isCompatibleFare": true,
                        "farePrice": 162.21,
                        "fareDiscountPriceToCalculate": 0,
                        "farePriceToCalculate": 162.21,
                        "farePriceShown": "162€",
                        "fareOutTax": 143,
                        "fareDiscountPriceShown": null,
                        "fareCurrency": "EUR",
                        "remainingSeats": 5,
                        "offers": [
                            {
                                "offerId": "IB539f85fe9db54efe87aefbbe6778bbabOP",
                                "offerItems": [
                                    {
                                        "offerItemId": "IB539f85fe9db54efe87aefbbe6778bbabOP_01",
                                        "price": {
                                            "fare": 318,
                                            "tax": 27.63,
                                            "total": 345.63,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "passengerIds": [
                                            "ADULT_01"
                                        ],
                                        "privateFareInformation": null
                                    }
                                ],
                                "originDestinations": [
                                    {
                                        "priceDiscountApplied": false,
                                        "adultPriceDiscountData": {
                                            "totalOriginal": 0
                                        },
                                        "totalPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "adultPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "perPassengerPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "originDestinationId": "ODI_0",
                                        "applicableSlices": [
                                            {
                                                "sliceId": 0,
                                                "remainingSeats": 9,
                                                "segments": [
                                                    {
                                                        "segmentId": "IB381620230923",
                                                        "fareFamily": "TBAESEU",
                                                        "bookingCode": null,
                                                        "bookingClass": "ECONOMY",
                                                        "rbd": "O",
                                                        "remainingSeats": 9,
                                                        "fareBasis": "ODNNB2",
                                                        "extendedFareCode": "ODNNB2",
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
                                "timeLimits": new Date("2023-09-20T09:13:33.112"),
                                "paymentTimeLimit": null,
                                "specialDiscountsApplied": [],
                                "providerOfferId": "OFE_f7a391f0-ef58-4231-9fe2-0bb950431eb3_403",
                                "privateFare": false,
                                "offerType": "",
                                "flightModificationOnDemand": false,
                                "discountsApplied": null,
                                "excludePenalties": false,
                                "price": {
                                    "fare": 143,
                                    "tax": 19.21,
                                    "total": 162.21,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "oBdiscount": false,
                        "includedPriceDiscount": false
                    },
                    {
                        "cabinType": "B",
                        "cabinDescription": "Business Class",
                        "commercialCode": "BUSCOMMH",
                        "commercialName": "Business Confort",
                        "commercialNameES": "Business Confort",
                        "priority": 150,
                        "conditions": [
                            {
                                "code": "EQMANO",
                                "name": "Equipaje de mano",
                                "text": "Incluida 1 pieza hasta 14 kg (56x40x25cm).",
                                "units": 1,
                                "extendedInfo": {
                                    "title": "Equipaje de mano: 1 pieza",
                                    "message": "Incluida 1 pieza hasta 14 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                                    "code": "CA_EQP_MANO_BUSINESS_CM_RADIO",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 0,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 1,
                                "previewStatus": true
                            },
                            {
                                "code": "COMIDA",
                                "name": "Comida",
                                "text": "Incluida.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Comida incluida",
                                    "message": "Incluida.",
                                    "code": "Comida_incluida",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 2,
                                "previewStatus": true
                            },
                            {
                                "code": "ASIENTO",
                                "name": "Selección de asiento",
                                "text": "Incluida.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Selección de asiento incluida",
                                    "message": "Incluida.",
                                    "code": "CA_Asiento_Gratuito_No_Destacado",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 3,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 4,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 5,
                                "previewStatus": true
                            },
                            {
                                "code": "ASIENTOPREFERENTE",
                                "name": "Asiento preferente",
                                "text": "Incluido.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Asiento preferente incluido",
                                    "message": "Incluido.",
                                    "code": "CA_Asiento_Preferente_Incluido",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 6,
                                "previewStatus": true
                            },
                            {
                                "code": "EMBARQUE",
                                "name": "Prioridad de Embarque",
                                "text": "Incluido (Grupo 1).",
                                "units": 1,
                                "extendedInfo": {
                                    "title": "Embarque prioritario Grupo 1",
                                    "message": "Incluido (Grupo 1).",
                                    "code": "CA_Embarque_Prioritario_grupo_1",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 7,
                                "previewStatus": true
                            },
                            {
                                "code": "CAMBIO",
                                "name": "Cambios",
                                "text": "Primer cambio gratis, resto de cambios con coste. Ver excepciones.",
                                "units": 60,
                                "extendedInfo": {
                                    "title": "Primer cambio de vuelo gratis",
                                    "message": "Primer cambio permitido en cualquier momento, sin penalización. Siguientes cambios permitidos, con penalización de 60 EUR. Cambios no permitidos en caso de no presentarse al vuelo (no show).",
                                    "code": "CA_1 PERM SIG CON PENALTY_60EUR_NO_SHOW_NO_PERMITID",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 9,
                                "previewStatus": true
                            },
                            {
                                "code": "REEMBOLSO",
                                "name": "Reembolso (por sentido)",
                                "text": "Permitido con coste, no permitido en caso de no-show.",
                                "units": 90,
                                "extendedInfo": {
                                    "title": "Reembolso con coste, salvo excepciones",
                                    "message": "Permitido en cualquier momento con penalización de 90 EUR. No permitido en caso de no presentarse al vuelo (no-show).",
                                    "code": "CA_REEMBOLSO CON PENALTY_90EUR_NO_SHOW_NO_PERMITIDO",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 10,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 11,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 12,
                                "previewStatus": true
                            },
                            {
                                "code": "CABINA",
                                "name": "Cabina",
                                "text": "Business.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Cabina Business",
                                    "message": "Business.",
                                    "code": "CA_Cabina_Busines",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 13,
                                "previewStatus": false
                            },
                            {
                                "code": "SALAVIP",
                                "name": "Acceso a salas VIP",
                                "text": "Acceso incluido.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Acceso a Sala Vip no incluido",
                                    "message": "Acceso incluido.",
                                    "code": "Acceso a salas VIP permitido",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 25,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 27,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 28,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 29,
                                "previewStatus": false
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
                            "FASTTRACK"
                        ],
                        "isCompatibleFare": true,
                        "farePrice": 212.21,
                        "fareDiscountPriceToCalculate": 0,
                        "farePriceToCalculate": 212.21,
                        "farePriceShown": "212€",
                        "fareOutTax": 193,
                        "fareDiscountPriceShown": null,
                        "fareCurrency": "EUR",
                        "remainingSeats": 5,
                        "offers": [
                            {
                                "offerId": "IBaf68077f8f3840a78e824d5fdd94255dOP",
                                "offerItems": [
                                    {
                                        "offerItemId": "IBaf68077f8f3840a78e824d5fdd94255dOP_01",
                                        "price": {
                                            "fare": 368,
                                            "tax": 27.63,
                                            "total": 395.63,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "passengerIds": [
                                            "ADULT_01"
                                        ],
                                        "privateFareInformation": null
                                    }
                                ],
                                "originDestinations": [
                                    {
                                        "priceDiscountApplied": false,
                                        "adultPriceDiscountData": {
                                            "totalOriginal": 0
                                        },
                                        "totalPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "adultPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "perPassengerPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "originDestinationId": "ODI_0",
                                        "applicableSlices": [
                                            {
                                                "sliceId": 0,
                                                "remainingSeats": 9,
                                                "segments": [
                                                    {
                                                        "segmentId": "IB381620230923",
                                                        "fareFamily": "TBAESEU",
                                                        "bookingCode": null,
                                                        "bookingClass": "ECONOMY",
                                                        "rbd": "O",
                                                        "remainingSeats": 9,
                                                        "fareBasis": "ODNNB2",
                                                        "extendedFareCode": "ODNNB2",
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
                                "timeLimits": new Date("2023-09-20T09:13:33.112"),
                                "paymentTimeLimit": null,
                                "specialDiscountsApplied": [],
                                "providerOfferId": "OFE_f7a391f0-ef58-4231-9fe2-0bb950431eb3_399",
                                "privateFare": false,
                                "offerType": "",
                                "flightModificationOnDemand": false,
                                "discountsApplied": null,
                                "excludePenalties": false,
                                "price": {
                                    "fare": 193,
                                    "tax": 19.21,
                                    "total": 212.21,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "oBdiscount": false,
                        "includedPriceDiscount": false
                    },
                    {
                        "cabinType": "B",
                        "cabinDescription": "Business Class",
                        "commercialCode": "BFLROES",
                        "commercialName": "Business Flexible",
                        "commercialNameES": "Business Flexible",
                        "priority": 100,
                        "conditions": [
                            {
                                "code": "EQMANO",
                                "name": "Equipaje de mano",
                                "text": "Incluida 1 pieza hasta 14 kg (56x40x25cm).",
                                "units": 1,
                                "extendedInfo": {
                                    "title": "Equipaje de mano: 1 pieza",
                                    "message": "Incluida 1 pieza hasta 14 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
                                    "code": "CA_EQP_MANO_BUSINESS_CM_RADIO",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 0,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 1,
                                "previewStatus": true
                            },
                            {
                                "code": "COMIDA",
                                "name": "Comida",
                                "text": "Incluida.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Comida incluida",
                                    "message": "Incluida.",
                                    "code": "Comida_incluida",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 2,
                                "previewStatus": true
                            },
                            {
                                "code": "ASIENTO",
                                "name": "Selección de asiento",
                                "text": "Incluida.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Selección de asiento incluida",
                                    "message": "Incluida.",
                                    "code": "CA_Asiento_Gratuito_No_Destacado",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 3,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 4,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 5,
                                "previewStatus": true
                            },
                            {
                                "code": "ASIENTOPREFERENTE",
                                "name": "Asiento preferente",
                                "text": "Incluido.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Asiento preferente incluido",
                                    "message": "Incluido.",
                                    "code": "CA_Asiento_Preferente_Incluido",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 6,
                                "previewStatus": true
                            },
                            {
                                "code": "EMBARQUE",
                                "name": "Prioridad de Embarque",
                                "text": "Incluido (Grupo 1).",
                                "units": 1,
                                "extendedInfo": {
                                    "title": "Embarque prioritario Grupo 1",
                                    "message": "Incluido (Grupo 1).",
                                    "code": "CA_Embarque_Prioritario_grupo_1",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 7,
                                "previewStatus": true
                            },
                            {
                                "code": "CAMBIO",
                                "name": "Cambios",
                                "text": "Permitido sin coste, salvo excepciones.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Cambio de vuelo sin coste, salvo excepciones",
                                    "message": "Permitido sin penalización. No permitido en caso de no presentarse al vuelo (no show).",
                                    "code": "CA_CAMBIOS PERMITIDOS_NO_SHOW_NO PERMITIDO",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 9,
                                "previewStatus": true
                            },
                            {
                                "code": "REEMBOLSO",
                                "name": "Reembolso (por sentido)",
                                "text": "Permitido sin coste. No permitido en caso de no-show.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Reembolso sin coste, salvo excepciones",
                                    "message": "Permitido sin penalización. No permitido en caso de no presentarse al vuelo (no-show).",
                                    "code": "CA_REEMBOLSO SIEMPRE_NO_SHOW_NO PERMITIDO",
                                    "conditionStatus": true,
                                    "observationCode": null
                                },
                                "key": 10,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 11,
                                "previewStatus": true
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
                                    "observationCode": null
                                },
                                "key": 12,
                                "previewStatus": true
                            },
                            {
                                "code": "CABINA",
                                "name": "Cabina",
                                "text": "Business.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Cabina Business",
                                    "message": "Business.",
                                    "code": "CA_Cabina_Busines",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 13,
                                "previewStatus": false
                            },
                            {
                                "code": "SALAVIP",
                                "name": "Acceso a salas VIP",
                                "text": "Acceso incluido.",
                                "units": null,
                                "extendedInfo": {
                                    "title": "Acceso a Sala Vip no incluido",
                                    "message": "Acceso incluido.",
                                    "code": "Acceso a salas VIP permitido",
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 25,
                                "previewStatus": false
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
                                    "observationCode": null
                                },
                                "key": 27,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 28,
                                "previewStatus": false
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
                                    "conditionStatus": false,
                                    "observationCode": null
                                },
                                "key": 29,
                                "previewStatus": false
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
                            "FASTTRACK"
                        ],
                        "isCompatibleFare": true,
                        "farePrice": 287.21,
                        "fareDiscountPriceToCalculate": 0,
                        "farePriceToCalculate": 287.21,
                        "farePriceShown": "287€",
                        "fareOutTax": 268,
                        "fareDiscountPriceShown": null,
                        "fareCurrency": "EUR",
                        "remainingSeats": 5,
                        "offers": [
                            {
                                "offerId": "IB4808ca5760c8465f8974d102601462a4OP",
                                "offerItems": [
                                    {
                                        "offerItemId": "IB4808ca5760c8465f8974d102601462a4OP_01",
                                        "price": {
                                            "fare": 443,
                                            "tax": 27.63,
                                            "total": 470.63,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "passengerIds": [
                                            "ADULT_01"
                                        ],
                                        "privateFareInformation": null
                                    }
                                ],
                                "originDestinations": [
                                    {
                                        "priceDiscountApplied": false,
                                        "adultPriceDiscountData": {
                                            "totalOriginal": 0
                                        },
                                        "totalPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "adultPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "perPassengerPrice": {
                                            "fare": 29,
                                            "tax": 19.21,
                                            "total": 48.21,
                                            "currency": "EUR",
                                            "ticketingFee": 0
                                        },
                                        "originDestinationId": "ODI_0",
                                        "applicableSlices": [
                                            {
                                                "sliceId": 0,
                                                "remainingSeats": 9,
                                                "segments": [
                                                    {
                                                        "segmentId": "IB381620230923",
                                                        "fareFamily": "TBAESEU",
                                                        "bookingCode": null,
                                                        "bookingClass": "ECONOMY",
                                                        "rbd": "O",
                                                        "remainingSeats": 9,
                                                        "fareBasis": "ODNNB2",
                                                        "extendedFareCode": "ODNNB2",
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
                                "timeLimits": new Date("2023-09-20T09:13:33.112"),
                                "paymentTimeLimit": null,
                                "specialDiscountsApplied": [],
                                "providerOfferId": "OFE_f7a391f0-ef58-4231-9fe2-0bb950431eb3_395",
                                "privateFare": false,
                                "offerType": "",
                                "flightModificationOnDemand": false,
                                "discountsApplied": null,
                                "excludePenalties": false,
                                "price": {
                                    "fare": 268,
                                    "tax": 19.21,
                                    "total": 287.21,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                }
                            }
                        ],
                        "oBdiscount": false,
                        "includedPriceDiscount": false
                    }
                ],
                "bestCabinsPrice": false
            }
        },
        "cabinsLength": 2,
        "showFares": true,
        "slicePrice": 48.21,
        "slicePriceShown": "48€",
        "sliceCurrency": "EUR",
        "durationParsed": "1h 25min.",
        "departureDateTimeParsed": "06:50",
        "departureDateParsed": {
            "weekDay": "WEEKDAY_SATURDAY",
            "hour": 2,
            "minutes": 0,
            "day": 23,
            "monthNumber": 9,
            "month": "MONTH_SEPTEMBER",
            "year": 2023,
            "formatedDate": "2023-09-23 06:50"
        },
        "arrivalDateTimeParsed": "08:15",
        "daysOfTravel": 0,
        "allOperatedBy": [
            "Iberia Express"
        ],
        "technicalStop": 0,
        "sliceURL": "/aerolineas/logo_pos_I2.svg",
        "maxSlicePrice": 162.21,
        "showedCabin": "E",
        "selectedFareFamily": {
            "cabinType": "E",
            "cabinDescription": "Turista",
            "commercialCode": "TBAESEU",
            "commercialName": "Básica",
            "commercialNameES": "Básica",
            "priority": 900,
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
                        "conditionStatus": true,
                        "observationCode": null
                    },
                    "key": 0,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 1,
                    "previewStatus": true
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
                        "conditionStatus": false,
                        "observationCode": null
                    },
                    "key": 2,
                    "previewStatus": true
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
                        "conditionStatus": false,
                        "observationCode": "1"
                    },
                    "key": 3,
                    "previewStatus": true
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
                        "observationCode": "2"
                    },
                    "key": 4,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 5,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 6,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 7,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 9,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 10,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 11,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 12,
                    "previewStatus": true
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
                        "observationCode": null
                    },
                    "key": 13,
                    "previewStatus": false
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
                        "observationCode": null
                    },
                    "key": 25,
                    "previewStatus": false
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
                        "observationCode": null
                    },
                    "key": 27,
                    "previewStatus": false
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
                        "conditionStatus": false,
                        "observationCode": null
                    },
                    "key": 28,
                    "previewStatus": false
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
                        "conditionStatus": false,
                        "observationCode": null
                    },
                    "key": 29,
                    "previewStatus": false
                }
            ],
            "observations": [
                {
                    "observationCode": 1,
                    "observationText": ''
                },
                {
                    "observationCode": 2,
                    "observationText": ''
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
                "FASTTRACK"
            ],
            "isCompatibleFare": true,
            "farePrice": 48.21,
            "fareDiscountPriceToCalculate": 0,
            "farePriceToCalculate": 48.21,
            "farePriceShown": "48€",
            "fareOutTax": 29,
            "fareDiscountPriceShown": null,
            "fareCurrency": "EUR",
            "remainingSeats": 9,
            "offers": [
                {
                    "offerId": "IBb8d4bb78b25f48b0ab67459ccf9065f9OP",
                    "offerItems": [
                        {
                            "offerItemId": "IBb8d4bb78b25f48b0ab67459ccf9065f9OP_01",
                            "price": {
                                "fare": 204,
                                "tax": 27.63,
                                "total": 231.63,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "passengerIds": [
                                "ADULT_01"
                            ],
                            "privateFareInformation": null
                        }
                    ],
                    "originDestinations": [
                        {
                            "priceDiscountApplied": false,
                            "adultPriceDiscountData": {
                                "totalOriginal": 0
                            },
                            "totalPrice": {
                                "fare": 29,
                                "tax": 19.21,
                                "total": 48.21,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "adultPrice": {
                                "fare": 29,
                                "tax": 19.21,
                                "total": 48.21,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "perPassengerPrice": {
                                "fare": 29,
                                "tax": 19.21,
                                "total": 48.21,
                                "currency": "EUR",
                                "ticketingFee": 0
                            },
                            "originDestinationId": "ODI_0",
                            "applicableSlices": [
                                {
                                    "sliceId": 0,
                                    "remainingSeats": 9,
                                    "segments": [
                                        {
                                            "segmentId": "IB381620230923",
                                            "fareFamily": "TBAESEU",
                                            "bookingCode": null,
                                            "bookingClass": "ECONOMY",
                                            "rbd": "O",
                                            "remainingSeats": 9,
                                            "fareBasis": "ODNNB2",
                                            "extendedFareCode": "ODNNB2",
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
                    "timeLimits": new Date("2023-09-20T09:13:33.112"),
                    "paymentTimeLimit": null,
                    "specialDiscountsApplied": [],
                    "providerOfferId": "OFE_f7a391f0-ef58-4231-9fe2-0bb950431eb3_411",
                    "privateFare": false,
                    "offerType": "",
                    "flightModificationOnDemand": false,
                    "discountsApplied": null,
                    "excludePenalties": false,
                    "price": {
                        "fare": 29,
                        "tax": 19.21,
                        "total": 48.21,
                        "currency": "EUR",
                        "ticketingFee": 0
                    }
                }
            ],
            "oBdiscount": false,
            "includedPriceDiscount": false
        }
    },
    "articleOffset": 211,
    "transformOffset": 0,
    "heightHeadingFlight": 0
};
