export const ancillariesInfo = {
    "ancillaries": [
        {
            "flexibilityAncillaries": [
                {
                    "description": "Primer cambio de vuelo gratuito",
                    "total": 6,
                    "passengerPrices": [
                        {
                            "id": "ADULT_01",
                            "amount": 6
                        }
                    ],
                    "status": {
                        "code": "AVAILABLE",
                        "reason": null
                    },
                    "subtype": "FLIGHT_CHANGE"
                },
                {
                    "description": "Reembolso en bono",
                    "total": 17,
                    "passengerPrices": [
                        {
                            "id": "ADULT_01",
                            "amount": 17
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
                    "description": "Pack Flexibilidad",
                    "total": 19,
                    "passengerPrices": [
                        {
                            "id": "ADULT_01",
                            "amount": 19
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
            "priceFrom": 6,
            "type": "FLEXIBILITY_ON_DEMAND"
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
                "code": "NOT_AVAILABLE",
                "reason": "CAR_AVAIL_ERR_0001"
            },
            "currency": null,
            "providers": [],
            "type": "VEHICLE_RENTAL",
            "pickUp": null,
            "dropOff": null
        },
        {
            "status": {
                "code": "AVAILABLE",
                "reason": null
            },
            "currency": "EUR",
            "segments": [
                {
                    "id": "IB044820240918",
                    "passengers": [
                        {
                            "id": "ADULT_01",
                            "amount": 5,
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
            "priceFrom": 5,
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
                    "id": "IB044820240918",
                    "passengers": [
                        "ADULT_01"
                    ],
                    "segmentPassengers": [
                        {
                            "passengerId": "ADULT_01",
                            "priceFrom": 0
                        }
                    ],
                    "specialMeals": []
                }
            ],
            "specialMeals": [
                {
                    "code": "BBML",
                    "name": "Comida para bebés",
                    "description": "Comida para bebés"
                }
            ],
            "type": "SPECIAL_MEALS"
        },
        {
            "status": {
                "code": "AVAILABLE",
                "reason": null
            },
            "price": 162.3,
            "kilosCo2Equivalent": 47.06,
            "type": "CO2_FOOTPRINT"
        },
        {
            "status": {
                "code": "AVAILABLE",
                "reason": null
            },
            "externalUrl": "https://www.iberia.com/es/es/bagonboard/?field1=H752G&field2=PEREZ&utm_source=iberia&utm_medium=referral&utm_content=standard_all-languages_all-routes_semistatic-landing_ad1&utm_campaign=airline_homebagdrop_na_iberia-pilot-3_mar19",
            "type": "BOB"
        },
        {
            "status": {
                "code": "AVAILABLE",
                "reason": null
            },
            "externalUrl": "http://iberia.tgw-test.com",
            "type": "WINE_CLUB"
        },
        {
            "status": {
                "code": "AVAILABLE",
                "reason": null
            },
            "currency": "EUR",
            "products": [
                {
                    "externalCode": "IBAESCAN",
                    "individualPrices": [
                        {
                            "adminFee": 0,
                            "price": 9.02,
                            "passengerId": "ADULT_01"
                        }
                    ],
                    "pricingModelCode": "IBAESCAN",
                    "productCode": "IBAESCAN",
                    "productName": "Cancellation Standard",
                    "productSpecificMessages": [
                        {
                            "type": "DisplayProductName",
                            "text": "Seguro de Anulación de Viaje",
                            "uri": null
                        }
                    ],
                    "totalPrice": 9.02
                },
                {
                    "externalCode": "No Product",
                    "individualPrices": null,
                    "pricingModelCode": "NoProduct",
                    "productCode": "NoProduct",
                    "productName": "No Product",
                    "productSpecificMessages": null,
                    "totalPrice": 0
                },
                {
                    "externalCode": "IBAESCOMPST",
                    "individualPrices": [
                        {
                            "adminFee": 0,
                            "price": 9.68,
                            "passengerId": "ADULT_01"
                        }
                    ],
                    "pricingModelCode": "IBAESCOMPST",
                    "productCode": "IBAESCOMPST",
                    "productName": "Comprehensive Standard",
                    "productSpecificMessages": [
                        {
                            "type": "DisplayProductName",
                            "text": "Seguro de Anulación y Asistencia en Viaje",
                            "uri": null
                        }
                    ],
                    "totalPrice": 9.68
                }
            ],
            "locations": [
                
            ],
            "countriesRequiredInfo": [
               
            ],
            "type": "ALLIANZ_FUSION"
        },
        {
            "status": {
                "code": "AVAILABLE",
                "reason": null
            },
            "currency": null,
            "subTypes": [
                
            ],
            "type": "GLOBICK"
        },
        {
            "status": {
                "code": "AVAILABLE",
                "reason": null
            },
            "currency": "EUR",
            "segments": [
                {
                    "id": "IB044820240918",
                    "passengers": [
                        {
                            "id": "ADULT_01",
                            "priceFrom": 4
                        }
                    ],
                    "pricesProvider": "IBDP",
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
            "onHold": {
                "enabled": true,
                "utcTimeLimit": "2024-07-31 08:21"
            },
            "type": "SEAT"
        },
        {
            "slices": [
                {
                    "passengers": [
                        {
                            
                            "pieces": [
                                {
                                    "subtype": "BAGGAGE_15",
                                    "description": "15Kg",
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
                                            "amount": 13,
                                            "airportAmount": 13,
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
                                    "description": "23Kg",
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
                                            "amount": 18,
                                            "airportAmount": 18,
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
                                    "subtype": "BAGGAGE_32",
                                    "description": "32Kg",
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
                                            "amount": 26,
                                            "airportAmount": 26,
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
                }
            ],
            "priceFrom": 13,
            "onHold": {
                "enabled": true,
                "utcTimeLimit": "2024-07-30 10:21"
            },
            "type": "BAGGAGE"
        },
        {
            "slices": [
                {  
                    "passengers": [
                        {
                            
                            "pieces": [
                                {
                                    "subtype": "BICYCLE",
                                    "description": "Bicicletas",
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
                                    "subtype": "FISHING_EQUIPMENT",
                                    "description": "Equipo de pesca",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0D6"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 3,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 35,
                                            "airportAmount": 35,
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
                                    "description": "Equipo de golf",
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
                                            "amount": 35,
                                            "airportAmount": 35,
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
                                    "subtype": "SCUBA_DIVING",
                                    "description": "Submarinismo",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0EE"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 3,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 35,
                                            "airportAmount": 35,
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
                                    "subtype": "SKI_SNOW",
                                    "description": "Esquí/Tabla de snowboard",
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
                                            "amount": 35,
                                            "airportAmount": 35,
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
                                    "subtype": "SURFBOARD",
                                    "description": "Tabla de Surf",
                                    "extraPieces": null,
                                    "reasonForIssuance": {
                                        "code": "C",
                                        "subcode": "0D8"
                                    },
                                    "franchisePieces": 0,
                                    "purchasedPieces": 0,
                                    "maxAdditionalSubtypePieces": 1,
                                    "availablePriceRanges": [
                                        {
                                            "amount": 45,
                                            "airportAmount": 45,
                                            "from": 1,
                                            "to": 1
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
                }
            ],
            "priceFrom": 35,
            "type": "SPECIAL_EQUIPMENT"
        }
    ]
}
export const selectedTripInfo = [
    {
        "selectedSliceIndex": 0,
        "selectedSlicesLength": 0,
        "cabin": "E",
        "originDestinationId": "ODI_0",
        "origin": "MAD",
        "destination": "BIO",
        "info": {
            "sliceId": "0",
            "arrivalDateTime": "2024-09-18 08:30",
            "departureDateTime": "2024-09-18 07:25",
            "segments": [
                {
                    "segmentId": "IB044820240918",
                    "departureDateTime": "2024-09-18 07:25",
                    "arrivalDateTime": "2024-09-18 08:30",
                    "departure": {
                        "code": "MAD",
                        "name": "ADOLFO SUAREZ BARAJAS",
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
                        "name": "BILBAO AIRPORT",
                        "terminal": "",
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
                        "operationalFlightNumber": "0448",
                        "operationalDisclosure": "IB",
                        "aircraft": {
                            "code": "321",
                            "description": "Airbus A321"
                        }
                    },
                    
                }
            ],
           
            "cabins": {
                "E": {
                    "bestPrice": 48.67,
                    "bestPriceDisscount": null,
                    "expensivePrice": 85.67,
                    "expensivePriceDisscount": 0,
                    "expensivePriceDisscountShown": null,
                    "bestPriceDisscountShown": null,
                    "bestPriceShown": "49€",
                    "expensivePriceShown": "86€",
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
                                        "observationCode": null,
                                        "mobileMessage": "1 bulto (56x40x25cm)"
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
                                        "observationCode": null,
                                        "mobileMessage": "No incluido"
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
                                        "observationCode": null,
                                        "mobileMessage": "No incluido"
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
                                        "observationCode": "1",
                                        "mobileMessage": "De pago"
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
                                        "observationCode": "2",
                                        "mobileMessage": "De pago"
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
                                        "observationCode": null,
                                        "mobileMessage": "De pago"
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
                                        "observationCode": null,
                                        "mobileMessage": "No aplica"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "Permitido con coste, no permitido en caso de no-show."
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
                                        "observationCode": null,
                                        "mobileMessage": "No permitido"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "Turista"
                                    },
                                    "key": 14,
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
                                    },
                                    "key": 26,
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
                                    },
                                    "key": 28,
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
                                        "observationCode": null,
                                        "mobileMessage": "Si"
                                    },
                                    "key": 29,
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
                                        "observationCode": null,
                                        "mobileMessage": "De pago"
                                    },
                                    "key": 30,
                                    "previewStatus": false
                                }
                            ],
                            "observations": [
                                {
                                    "observationCode": 1,
                                    "observationText": {}
                                },
                                {
                                    "observationCode": 2,
                                    "observationText": {}
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
                            "farePrice": 48.67,
                            "fareDisscountPriceToCalculate": 0,
                            "farePriceToCalculate": 48.67,
                            "farePriceShown": "49€",
                            "fareOutTax": 28,
                            "fareDisscountPriceShown": null,
                            "fareCurrency": "EUR",
                            "remainingSeats": 9,
                            "offers": [
                                {
                                    "offerId": "IB9e50dd7b7b4e428cbeab5b73d42c8551OP",
                                    "offerItems": [
                                        {
                                            "offerItemId": "IB9e50dd7b7b4e428cbeab5b73d42c8551OP_01",
                                            "price": {
                                                "fare": 28,
                                                "tax": 20.67,
                                                "total": 48.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "passengerIds": [
                                                "ADULT_01"
                                            ],
                                            "privateFareInformation": null,
                                            "reshopDifferential": null,
                                            "surcharges": null,
                                            "fareComponents": [],
                                            "detailedTaxes": null,
                                            "fareCalculation": null
                                        }
                                    ],
                                    "originDestinations": [
                                        {
                                            "priceDiscountApplied": false,
                                            "totalPrice": {
                                                "fare": 28,
                                                "tax": 20.67,
                                                "total": 48.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "adultPrice": {
                                                "fare": 28,
                                                "tax": 20.67,
                                                "total": 48.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "perPassengerPrice": {
                                                "fare": 28,
                                                "tax": 20.67,
                                                "total": 48.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "originDestinationId": "ODI_0",
                                            "applicableSlices": [
                                                {
                                                    "sliceId": "0",
                                                    "remainingSeats": 9,
                                                    "segments": [
                                                        {
                                                            "segmentId": "IB044820240918",
                                                            "fareFamily": "TBAESEU",
                                                            "bookingCode": null,
                                                            "bookingClass": "ECONOMY",
                                                            "rbd": "A",
                                                            "remainingSeats": 9,
                                                            "fareBasis": "ADNOB4",
                                                            "extendedFareCode": "ADNOB4",
                                                            "brandCode": null,
                                                            "checkedBaggageAllowanceKeys": [],
                                                            "carryOnBaggageAllowanceKeys": [],
                                                            "ticketDesignator": null,
                                                            "seatDisplays": null,
                                                            "cabinDescription": ""
                                                        }
                                                    ]
                                                },
                                                {
                                                    "sliceId": "3",
                                                    "remainingSeats": 9,
                                                    "segments": [
                                                        {
                                                            "segmentId": "IB044220240918",
                                                            "fareFamily": "TBAESEU",
                                                            "bookingCode": null,
                                                            "bookingClass": "ECONOMY",
                                                            "rbd": "A",
                                                            "remainingSeats": 9,
                                                            "fareBasis": "ADNOB4",
                                                            "extendedFareCode": "ADNOB4",
                                                            "brandCode": null,
                                                            "checkedBaggageAllowanceKeys": [],
                                                            "carryOnBaggageAllowanceKeys": [],
                                                            "ticketDesignator": null,
                                                            "seatDisplays": null,
                                                            "cabinDescription": ""
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "timeLimits": "2024-07-30T06:23:49.774",
                                    "paymentTimeLimit": null,
                                    "specialDiscountsApplied": [],
                                    "providerOfferId": "OFE_de6c6f0b-f0a8-4976-a53b-c7c8f64c4924_4",
                                    "privateFare": false,
                                    "offerType": "",
                                    "flightModificationOnDemand": false,
                                    "discountsApplied": null,
                                    "excludePenalties": false,
                                    "offerHash": "",
                                    "price": {
                                        "fare": 28,
                                        "tax": 20.67,
                                        "total": 48.67,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "priceGuaranteeTimeLimit": null
                                }
                            ],
                            "oBdiscount": false,
                            "includedPriceDiscount": false
                        }
                    ],
                    "bestCabinsPrice": true
                }
            },
            "cabinsLength": 2,
            "cabinsMobile": [
                {
                    "bestPrice": 48.67,
                    "bestPriceDisscount": null,
                    "expensivePrice": 85.67,
                    "expensivePriceDisscount": 0,
                    "expensivePriceDisscountShown": null,
                    "bestPriceDisscountShown": null,
                    "bestPriceShown": "49€",
                    "expensivePriceShown": "86€",
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
                                        "observationCode": null,
                                        "mobileMessage": "1 bulto (56x40x25cm)"
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
                                        "observationCode": null,
                                        "mobileMessage": "No incluido"
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
                                        "observationCode": null,
                                        "mobileMessage": "No incluido"
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
                                        "observationCode": "1",
                                        "mobileMessage": "De pago"
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
                                        "observationCode": "2",
                                        "mobileMessage": "De pago"
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
                                        "observationCode": null,
                                        "mobileMessage": "De pago"
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
                                        "observationCode": null,
                                        "mobileMessage": "No aplica"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "Permitido con coste, no permitido en caso de no-show."
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
                                        "observationCode": null,
                                        "mobileMessage": "No permitido"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "Turista"
                                    },
                                    "key": 14,
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
                                    },
                                    "key": 26,
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
                                    },
                                    "key": 28,
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
                                        "observationCode": null,
                                        "mobileMessage": "Si"
                                    },
                                    "key": 29,
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
                                        "observationCode": null,
                                        "mobileMessage": "De pago"
                                    },
                                    "key": 30,
                                    "previewStatus": false
                                }
                            ],
                            "observations": [
                                {
                                    "observationCode": 1,
                                    "observationText": {}
                                },
                                {
                                    "observationCode": 2,
                                    "observationText": {}
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
                            "farePrice": 48.67,
                            "fareDisscountPriceToCalculate": 0,
                            "farePriceToCalculate": 48.67,
                            "farePriceShown": "49€",
                            "fareOutTax": 28,
                            "fareDisscountPriceShown": null,
                            "fareCurrency": "EUR",
                            "remainingSeats": 9,
                            "offers": [
                                {
                                    "offerId": "IB9e50dd7b7b4e428cbeab5b73d42c8551OP",
                                    "offerItems": [
                                        {
                                            "offerItemId": "IB9e50dd7b7b4e428cbeab5b73d42c8551OP_01",
                                            "price": {
                                                "fare": 28,
                                                "tax": 20.67,
                                                "total": 48.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "passengerIds": [
                                                "ADULT_01"
                                            ],
                                            "privateFareInformation": null,
                                            "reshopDifferential": null,
                                            "surcharges": null,
                                            "fareComponents": [],
                                            "detailedTaxes": null,
                                            "fareCalculation": null
                                        }
                                    ],
                                    "originDestinations": [
                                        {
                                            "priceDiscountApplied": false,
                                            "totalPrice": {
                                                "fare": 28,
                                                "tax": 20.67,
                                                "total": 48.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "adultPrice": {
                                                "fare": 28,
                                                "tax": 20.67,
                                                "total": 48.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "perPassengerPrice": {
                                                "fare": 28,
                                                "tax": 20.67,
                                                "total": 48.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "originDestinationId": "ODI_0",
                                            "applicableSlices": [
                                                {
                                                    "sliceId": "0",
                                                    "remainingSeats": 9,
                                                    "segments": [
                                                        {
                                                            "segmentId": "IB044820240918",
                                                            "fareFamily": "TBAESEU",
                                                            "bookingCode": null,
                                                            "bookingClass": "ECONOMY",
                                                            "rbd": "A",
                                                            "remainingSeats": 9,
                                                            "fareBasis": "ADNOB4",
                                                            "extendedFareCode": "ADNOB4",
                                                            "brandCode": null,
                                                            "checkedBaggageAllowanceKeys": [],
                                                            "carryOnBaggageAllowanceKeys": [],
                                                            "ticketDesignator": null,
                                                            "seatDisplays": null,
                                                            "cabinDescription": ""
                                                        }
                                                    ]
                                                },
                                                {
                                                    "sliceId": "3",
                                                    "remainingSeats": 9,
                                                    "segments": [
                                                        {
                                                            "segmentId": "IB044220240918",
                                                            "fareFamily": "TBAESEU",
                                                            "bookingCode": null,
                                                            "bookingClass": "ECONOMY",
                                                            "rbd": "A",
                                                            "remainingSeats": 9,
                                                            "fareBasis": "ADNOB4",
                                                            "extendedFareCode": "ADNOB4",
                                                            "brandCode": null,
                                                            "checkedBaggageAllowanceKeys": [],
                                                            "carryOnBaggageAllowanceKeys": [],
                                                            "ticketDesignator": null,
                                                            "seatDisplays": null,
                                                            "cabinDescription": ""
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "timeLimits": "2024-07-30T06:23:49.774",
                                    "paymentTimeLimit": null,
                                    "specialDiscountsApplied": [],
                                    "providerOfferId": "OFE_de6c6f0b-f0a8-4976-a53b-c7c8f64c4924_4",
                                    "privateFare": false,
                                    "offerType": "",
                                    "flightModificationOnDemand": false,
                                    "discountsApplied": null,
                                    "excludePenalties": false,
                                    "offerHash": "",
                                    "price": {
                                        "fare": 28,
                                        "tax": 20.67,
                                        "total": 48.67,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "priceGuaranteeTimeLimit": null
                                }
                            ],
                            "oBdiscount": false,
                            "includedPriceDiscount": false
                        },
                        {
                            "cabinType": "E",
                            "cabinDescription": "Turista",
                            "commercialCode": "TCLESEU",
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
                                        "observationCode": null,
                                        "mobileMessage": "1 bulto (56x40x25cm)"
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
                                        "observationCode": null,
                                        "mobileMessage": "1 pieza"
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
                                        "observationCode": null,
                                        "mobileMessage": "No incluido"
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
                                        "observationCode": null,
                                        "mobileMessage": "Gratuita desde 24 horas antes del vuelo"
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
                                        "observationCode": "1",
                                        "mobileMessage": "De pago"
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
                                        "observationCode": null,
                                        "mobileMessage": "De pago"
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
                                        "observationCode": null,
                                        "mobileMessage": "No aplica"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "Permitido con coste, no permitido en caso de no-show."
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
                                        "observationCode": null,
                                        "mobileMessage": "No permitido"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "Turista"
                                    },
                                    "key": 14,
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
                                    },
                                    "key": 26,
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
                                    },
                                    "key": 28,
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
                                        "observationCode": null,
                                        "mobileMessage": "Si"
                                    },
                                    "key": 29,
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
                                        "observationCode": null,
                                        "mobileMessage": "De pago"
                                    },
                                    "key": 30,
                                    "previewStatus": false
                                }
                            ],
                            "observations": [
                                {
                                    "observationCode": 1,
                                    "observationText": {}
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
                            "farePrice": 63.67,
                            "fareDisscountPriceToCalculate": 0,
                            "farePriceToCalculate": 63.67,
                            "farePriceShown": "64€",
                            "fareOutTax": 43,
                            "fareDisscountPriceShown": null,
                            "fareCurrency": "EUR",
                            "remainingSeats": 9,
                            "offers": [
                                {
                                    "offerId": "IB93d4d2ca8a444d2ab7727816580f62baOP",
                                    "offerItems": [
                                        {
                                            "offerItemId": "IB93d4d2ca8a444d2ab7727816580f62baOP_01",
                                            "price": {
                                                "fare": 43,
                                                "tax": 20.67,
                                                "total": 63.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "passengerIds": [
                                                "ADULT_01"
                                            ],
                                            "privateFareInformation": null,
                                            "reshopDifferential": null,
                                            "surcharges": null,
                                            "fareComponents": [],
                                            "detailedTaxes": null,
                                            "fareCalculation": null
                                        }
                                    ],
                                    "originDestinations": [
                                        {
                                            "priceDiscountApplied": false,
                                            "totalPrice": {
                                                "fare": 43,
                                                "tax": 20.67,
                                                "total": 63.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "adultPrice": {
                                                "fare": 43,
                                                "tax": 20.67,
                                                "total": 63.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "perPassengerPrice": {
                                                "fare": 43,
                                                "tax": 20.67,
                                                "total": 63.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "originDestinationId": "ODI_0",
                                            "applicableSlices": [
                                                {
                                                    "sliceId": "0",
                                                    "remainingSeats": 9,
                                                    "segments": [
                                                        {
                                                            "segmentId": "IB044820240918",
                                                            "fareFamily": "TCLESEU",
                                                            "bookingCode": null,
                                                            "bookingClass": "ECONOMY",
                                                            "rbd": "A",
                                                            "remainingSeats": 9,
                                                            "fareBasis": "ADNOM4",
                                                            "extendedFareCode": "ADNOM4",
                                                            "brandCode": null,
                                                            "checkedBaggageAllowanceKeys": [],
                                                            "carryOnBaggageAllowanceKeys": [],
                                                            "ticketDesignator": null,
                                                            "seatDisplays": null,
                                                            "cabinDescription": ""
                                                        }
                                                    ]
                                                },
                                                {
                                                    "sliceId": "3",
                                                    "remainingSeats": 9,
                                                    "segments": [
                                                        {
                                                            "segmentId": "IB044220240918",
                                                            "fareFamily": "TCLESEU",
                                                            "bookingCode": null,
                                                            "bookingClass": "ECONOMY",
                                                            "rbd": "A",
                                                            "remainingSeats": 9,
                                                            "fareBasis": "ADNOM4",
                                                            "extendedFareCode": "ADNOM4",
                                                            "brandCode": null,
                                                            "checkedBaggageAllowanceKeys": [],
                                                            "carryOnBaggageAllowanceKeys": [],
                                                            "ticketDesignator": null,
                                                            "seatDisplays": null,
                                                            "cabinDescription": ""
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "timeLimits": "2024-07-30T06:23:49.774",
                                    "paymentTimeLimit": null,
                                    "specialDiscountsApplied": [],
                                    "providerOfferId": "OFE_de6c6f0b-f0a8-4976-a53b-c7c8f64c4924_5",
                                    "privateFare": false,
                                    "offerType": "",
                                    "flightModificationOnDemand": false,
                                    "discountsApplied": null,
                                    "excludePenalties": false,
                                    "offerHash": "",
                                    "price": {
                                        "fare": 43,
                                        "tax": 20.67,
                                        "total": 63.67,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "priceGuaranteeTimeLimit": null
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
                                        "observationCode": null,
                                        "mobileMessage": "1 bulto (56x40x25cm)"
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
                                        "observationCode": null,
                                        "mobileMessage": "1 pieza"
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
                                        "observationCode": null,
                                        "mobileMessage": "No incluido"
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
                                        "observationCode": null,
                                        "mobileMessage": "Incluido"
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
                                        "observationCode": null,
                                        "mobileMessage": "Incluido"
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
                                        "observationCode": null,
                                        "mobileMessage": "Incluido"
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
                                        "observationCode": null,
                                        "mobileMessage": "No aplica"
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
                                        "observationCode": null,
                                        "mobileMessage": "Sí, grupo 2"
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
                                        "observationCode": null,
                                        "mobileMessage": "Primer cambio gratis, resto de cambios con coste. Ver excepciones."
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
                                        "observationCode": null,
                                        "mobileMessage": "No permitido"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
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
                                        "observationCode": null,
                                        "mobileMessage": "Turista"
                                    },
                                    "key": 14,
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
                                    },
                                    "key": 26,
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
                                        "observationCode": null,
                                        "mobileMessage": "No"
                                    },
                                    "key": 28,
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
                                        "observationCode": null,
                                        "mobileMessage": "Si"
                                    },
                                    "key": 29,
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
                                        "observationCode": null,
                                        "mobileMessage": "De pago"
                                    },
                                    "key": 30,
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
                                "FASTTRACK",
                                "AEROPUERTO"
                            ],
                            "isCompatibleFare": true,
                            "farePrice": 85.67,
                            "fareDisscountPriceToCalculate": 0,
                            "farePriceToCalculate": 85.67,
                            "farePriceShown": "86€",
                            "fareOutTax": 65,
                            "fareDisscountPriceShown": null,
                            "fareCurrency": "EUR",
                            "remainingSeats": 9,
                            "offers": [
                                {
                                    "offerId": "IBb1548d9dd27b4fe78907b6fa81da6513OP",
                                    "offerItems": [
                                        {
                                            "offerItemId": "IBb1548d9dd27b4fe78907b6fa81da6513OP_01",
                                            "price": {
                                                "fare": 65,
                                                "tax": 20.67,
                                                "total": 85.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "passengerIds": [
                                                "ADULT_01"
                                            ],
                                            "privateFareInformation": null,
                                            "reshopDifferential": null,
                                            "surcharges": null,
                                            "fareComponents": [],
                                            "detailedTaxes": null,
                                            "fareCalculation": null
                                        }
                                    ],
                                    "originDestinations": [
                                        {
                                            "priceDiscountApplied": false,
                                            "totalPrice": {
                                                "fare": 65,
                                                "tax": 20.67,
                                                "total": 85.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "adultPrice": {
                                                "fare": 65,
                                                "tax": 20.67,
                                                "total": 85.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "perPassengerPrice": {
                                                "fare": 65,
                                                "tax": 20.67,
                                                "total": 85.67,
                                                "currency": "EUR",
                                                "ticketingFee": 0
                                            },
                                            "originDestinationId": "ODI_0",
                                            "applicableSlices": [
                                                {
                                                    "sliceId": "0",
                                                    "remainingSeats": 9,
                                                    "segments": [
                                                        {
                                                            "segmentId": "IB044820240918",
                                                            "fareFamily": "COTCLESEU",
                                                            "bookingCode": null,
                                                            "bookingClass": "ECONOMY",
                                                            "rbd": "A",
                                                            "remainingSeats": 9,
                                                            "fareBasis": "ADNOU4",
                                                            "extendedFareCode": "ADNOU4",
                                                            "brandCode": null,
                                                            "checkedBaggageAllowanceKeys": [],
                                                            "carryOnBaggageAllowanceKeys": [],
                                                            "ticketDesignator": null,
                                                            "seatDisplays": null,
                                                            "cabinDescription": ""
                                                        }
                                                    ]
                                                },
                                                {
                                                    "sliceId": "3",
                                                    "remainingSeats": 9,
                                                    "segments": [
                                                        {
                                                            "segmentId": "IB044220240918",
                                                            "fareFamily": "COTCLESEU",
                                                            "bookingCode": null,
                                                            "bookingClass": "ECONOMY",
                                                            "rbd": "A",
                                                            "remainingSeats": 9,
                                                            "fareBasis": "ADNOU4",
                                                            "extendedFareCode": "ADNOU4",
                                                            "brandCode": null,
                                                            "checkedBaggageAllowanceKeys": [],
                                                            "carryOnBaggageAllowanceKeys": [],
                                                            "ticketDesignator": null,
                                                            "seatDisplays": null,
                                                            "cabinDescription": ""
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ],
                                    "timeLimits": "2024-07-30T06:23:49.774",
                                    "paymentTimeLimit": null,
                                    "specialDiscountsApplied": [],
                                    "providerOfferId": "OFE_de6c6f0b-f0a8-4976-a53b-c7c8f64c4924_3",
                                    "privateFare": false,
                                    "offerType": "",
                                    "flightModificationOnDemand": false,
                                    "discountsApplied": null,
                                    "excludePenalties": false,
                                    "offerHash": "",
                                    "price": {
                                        "fare": 65,
                                        "tax": 20.67,
                                        "total": 85.67,
                                        "currency": "EUR",
                                        "ticketingFee": 0
                                    },
                                    "priceGuaranteeTimeLimit": null
                                }
                            ],
                            "oBdiscount": false,
                            "includedPriceDiscount": false
                        }
                    ],
                    "type": "E",
                    "cabinMobileStyleClass": "",
                    "collapsed": true,
                    "bestCabinsPrice": true
                }
            ],
            "cabinsMobileLength": 2,
            "showFares": true,
            "slicePrice": 48.67,
            "slicePriceShown": "49€",
            "sliceCurrency": "EUR",
            "durationParsed": "1h 5min.",
            "departureDateTimeParsed": "07:25",
            "departureDateParsed": {
                "dateTime": "07:25",
                "weekDay": "WEEKDAY_WEDNESDAY",
                "hour": 2,
                "minutes": 0,
                "day": 18,
                "monthNumber": 9,
                "month": "MONTH_SEPTEMBER",
                "year": 2024,
                "formatedDate": "2024-09-18 07:25"
            },
            "arrivalDateParsed": {
                "dateTime": "08:30",
                "weekDay": "WEEKDAY_WEDNESDAY",
                "hour": 2,
                "minutes": 0,
                "day": 18,
                "monthNumber": 9,
                "month": "MONTH_SEPTEMBER",
                "year": 2024,
                "formatedDate": "2024-09-18 08:30"
            },
            "arrivalDateTimeParsed": "08:30",
            "daysOfTravel": 0,
            "allOperatedBy": [
                "Iberia"
            ],
            "allOperatedByCodes": [
                "IB"
            ],
            "technicalStop": 0,
            "sliceURL": "/aerolineas/logo_pos_IB.svg",
            "sliceURLMin": "/aerolineas/logo_min_IB.svg",
            "maxSlicePrice": 166.67,
            "sliceSelectedDiscount": false,
            "sliceSelectedDiscountImage": null,
            "slicePromotionImage": null,
            "$$hashKey": "object:1412",
            "showedCabin": "E",
            "selectedCabin": "E",
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
                            "observationCode": null,
                            "mobileMessage": "1 bulto (56x40x25cm)"
                        },
                        "key": 0,
                        "previewStatus": true
                    }
                    
                ],
                "observations": [
                    {
                        "observationCode": 1,
                        "observationText": {}
                    }
                ],
                "conditionsPriority": [
                    "EQMANO"
                ],
                
                "offers": [
                    {
                        "offerId": "IB9e50dd7b7b4e428cbeab5b73d42c8551OP",
                        "offerItems": [
                            {
                                "offerItemId": "IB9e50dd7b7b4e428cbeab5b73d42c8551OP_01",
                                "price": {
                                    "fare": 28,
                                    "tax": 20.67,
                                    "total": 48.67,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                },
                                "passengerIds": [
                                    "ADULT_01"
                                ],
                                "privateFareInformation": null,
                                "reshopDifferential": null,
                                "surcharges": null,
                                "fareComponents": [],
                                "detailedTaxes": null,
                                "fareCalculation": null
                            }
                        ],
                        "originDestinations": [
                            {
                                "priceDiscountApplied": false,
                                "totalPrice": {
                                    "fare": 28,
                                    "tax": 20.67,
                                    "total": 48.67,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                },
                                "adultPrice": {
                                    "fare": 28,
                                    "tax": 20.67,
                                    "total": 48.67,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                },
                                "perPassengerPrice": {
                                    "fare": 28,
                                    "tax": 20.67,
                                    "total": 48.67,
                                    "currency": "EUR",
                                    "ticketingFee": 0
                                },
                                "originDestinationId": "ODI_0",
                                "applicableSlices": [
                                    {
                                        "sliceId": "0",
                                        "remainingSeats": 9,
                                        "segments": [
                                            {
                                                "segmentId": "IB044820240918",
                                                "fareFamily": "TBAESEU",
                                                "bookingCode": null,
                                                "bookingClass": "ECONOMY",
                                                "rbd": "A",
                                                "remainingSeats": 9,
                                                "fareBasis": "ADNOB4",
                                                "extendedFareCode": "ADNOB4",
                                                "brandCode": null,
                                                "checkedBaggageAllowanceKeys": [],
                                                "carryOnBaggageAllowanceKeys": [],
                                                "ticketDesignator": null,
                                                "seatDisplays": null,
                                                "cabinDescription": ""
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        
                        "price": {
                            "fare": 28,
                            "tax": 20.67,
                            "total": 48.67,
                            "currency": "EUR",
                            "ticketingFee": 0
                        },
                        "priceGuaranteeTimeLimit": null
                    }
                ],
                "oBdiscount": false,
                "includedPriceDiscount": false
            }
        },
        "articleOffset": 212,
        "transformOffset": 0,
        "heightHeadingFlight": 0,
        "destinationCountry": "ES",
        "originCountry": "ES"
    }
]
export const confirmationDatalayerInfo = {
    "idioma": "es",
    "mercado": "ES",
    "versionWeb": "angularjs",
    "modeWeb": "desktop",
    "SearchCity": "BIO",
    "SearchOrigin": "MAD",
    "SearchDest": "BIO",
    "SearchCountry": "ES",
    "antelacionCompra": "50",
    "fecha": "18/09/2024-",
    "trayectoBuscado": "MAD,BIO",
    "trayectoPais": "ES-ES",
    "tipoBusqueda": "tarifaMasEconomica",
    "flightRatio": "Corto Radio",
    "proceso": "booking slice by slice",
    "paso": "ancillaries",
    "origenBusqueda": "es/ES/IBHMPA",
    "numeroPax": "1",
    "SearchOriginName": "Madrid",
    "SearchDestName": "Bilbao",
    "estanciaDestino": "0",
    "tipoVuelo": "OW",
    "resultadosIda": "5",
    "rutaIda": "MAD,BIO",
    "numeroAdultos": "1",
    "quadrigam": "MOSEAT",
    "codigoSeguimiento": "es/ES/MOSEAT",
    "EstadoUsuario": "no_logado",
    "descuentosAplicados": "",
    "precioPax": "48.67",
    "tarifaBarata": "SI",
    "recoveryLink": "https://pree.iberia.es/flights/?market=ES&language=es&bookingMarket=ES&ADT=1&CHD=0&INF=0&YTH=0&YCD=0&BNN=0&familianumerosa=&DisplayedPrice=48.67&DisplayedPriceCurrency=EUR&TripType=OneWay&Slice1=1&Cabin1=ECONOMY&FareCode1=ADNOB4&BookingCode1=A&Carrier1=IB&DepartureDate1=2024-09-18&Origin1=MAD&Destination1=BIO&FlightNumber1=0448&ReferralId=shoppingCartRecovery",
    "cabinas": "IDA:ECONOMY",
    "ffida": "Basica",
    "ffvuelta": "",
    "escalas": "IDA:0",
    "horarioVuelo": "IDA:07:25",
    "trayectoAeropuerto": "MAD-BIO",
    "operadoraVuelo": "IB",
    "Identifier": "IB0448",
    "nombreTarifas": "IDA:TBAESEU",
    "titularIberiaPlus": "NO",
    "claseReserva": "E",
    "moneda": "EUR",
    "precioTotal": 48.67,
    "precioTotalSinTasas": 28,
    "precioTasas": 20.67,
    "slice1Origin": "MAD",
    "slice1Destination": "BIO",
    "slice1Cabin": "ECONOMY",
    "slice1FareRegistration": "TBAESEU",
    "slice1Stops": 0,
    "slice1Date": "18/09/2024",
    "slice1Hour": "07:25",
    "slice1Route": "MAD-BIO",
    "slice1Haul": "Corto Radio",
    "slice1FareFamilyName": "Basica",
    "hashEBKI": "af73bf4542e213a973a72f8ba5d1d5141b6470c33dc31e68b08a44ffc25f7598",
    "hashEID": "",
    "provider": "IB",
    "reference": "H742V",
    "eventCategory": "elegir equipaje",
    "eventAction": "click",
    "eventLabel": "anadir",
    "dynamic_pricing_seat": "NO"
}
export const seatMap = {
    "aircraft": {
        "model": "321",
        "showRealSeatMap": true
    },
    "seatPriceInfo": {
        "currency": {
            "code": "EUR",
            "description": "Euro",
            "symbol": "€",
            "alignment": "R",
            "groupingSeparator": ".",
            "decimalSeparator": ",",
            "decimals": 2,
            "recommendedDisplay": "symbol"
        },
        "legendPrices": [
            {
                "type": "NORMAL",
                "from": 5,
                "to": 5
            }
        ],
        "seatPrices": [
            {
                "amount": 12,
                "type": "COMFORT_SEAT",
                "seatPriceCode": 4
            },
            {
                "amount": 8,
                "type": "UPFRONT",
                "seatPriceCode": 5
            },
            {
                "amount": 8,
                "type": "UPFRONT",
                "seatPriceCode": 6
            },
            {
                "amount": 5,
                "type": "NORMAL",
                "seatPriceCode": 7
            },
            {
                "amount": 0,
                "type": "NORMAL",
                "seatPriceCode": 3
            },
            {
                "amount": 14,
                "type": "EMERGENCY",
                "seatPriceCode": 8
            },
            {
                "amount": 12,
                "type": "COMFORT_SEAT",
                "seatPriceCode": 9
            },
            {
                "amount": 0,
                "type": "FREE",
                "seatPriceCode": 1
            },
            {
                "amount": 3,
                "type": "PROMO",
                "seatPriceCode": 10
            }
        ]
    },
    "warningMessages": [
        {
            "applyingFeatures": [
                "EMERGENCY_EXIT"
            ],
            "discardingFeatures": [],
            "passengers": [
                "ADULT_01"
            ],
            "type": "DISCLAIMER",
            "message": "Si ocupas este asiento deberás:<ul><li>Colaborar con la tripulación si hay que evacuar el avión.</li><li>Poder abrir la salida de emergencia y ayudar a los pasajeros.</li><li>Poder escuchar y comprender instrucciones verbales de la tripulación.</li><li>Poder comprender instrucciones impresas.</li></ul>Seleccionar este asiento implica aceptar estas condiciones."
        },
        {
            "applyingFeatures": [
                "RESTRICTED_MOBILITY"
            ],
            "discardingFeatures": [],
            "passengers": [
                "ADULT_01"
            ],
            "type": "INFORMATION",
            "message": "Este asiento se reserva para pasajeros con movilidad reducida. Puede ser que se te requiera cambiar de lugar."
        }
    ],
    "cabins": [
        {
            "cabinClass": {
                "code": "J",
                "type": "BUSINESS",
                "description": "Business"
            },
            "columns": [
                {
                    "name": "A",
                    "type": "SEAT"
                }
            ],
            "map": [
                [
                    {
                        "row": "1",
                        "column": "A",
                        "type": "SEAT",
                        "occupation": "FREE",
                        "features": [
                            "UPFRONT",
                            "WINDOW"
                        ],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "CH",
                                "description": "CH"
                            }
                        ],
                        "description": null
                    },
                    {
                        "row": "1",
                        "column": "B",
                        "type": "GAP",
                        "occupation": null,
                        "features": [],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "8",
                                "description": "8"
                            }
                        ],
                        "description": null
                    },
                    {
                        "row": "1",
                        "column": "C",
                        "type": "SEAT",
                        "occupation": "FREE",
                        "features": [
                            "UPFRONT",
                            "AISLE"
                        ],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "CH",
                                "description": "CH"
                            }
                        ],
                        "description": null
                    },
                    {
                        "row": "1",
                        "column": " ",
                        "type": "GAP",
                        "occupation": null,
                        "features": [],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [],
                        "description": null
                    },
                    {
                        "row": "1",
                        "column": " ",
                        "type": "GAP",
                        "occupation": null,
                        "features": [],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [],
                        "description": null
                    },
                    {
                        "row": "1",
                        "column": "D",
                        "type": "SEAT",
                        "occupation": "FREE",
                        "features": [
                            "UPFRONT",
                            "AISLE"
                        ],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "CH",
                                "description": "CH"
                            }
                        ],
                        "description": null
                    },
                    {
                        "row": "1",
                        "column": "E",
                        "type": "GAP",
                        "occupation": null,
                        "features": [],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "8",
                                "description": "8"
                            }
                        ],
                        "description": null
                    },
                    {
                        "row": "1",
                        "column": "F",
                        "type": "SEAT",
                        "occupation": "FREE",
                        "features": [
                            "UPFRONT",
                            "WINDOW"
                        ],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "CH",
                                "description": "CH"
                            }
                        ],
                        "description": null
                    }
                ],
                [
                    {
                        "row": "2",
                        "column": "A",
                        "type": "SEAT",
                        "occupation": "FREE",
                        "features": [
                            "EXTRA_SIZE",
                            "WINDOW"
                        ],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "CH",
                                "description": "CH"
                            }
                        ],
                        "description": null
                    }
                ],
                [
                    {
                        "row": "3",
                        "column": "A",
                        "type": "SEAT",
                        "occupation": "FREE",
                        "features": [
                            "EXTRA_SIZE",
                            "WINDOW"
                        ],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "CH",
                                "description": "CH"
                            },
                            {
                                "code": "L",
                                "description": "L"
                            },
                            {
                                "code": "W",
                                "description": "W"
                            }
                        ],
                        "description": null
                    }
                ],
                [
                    {
                        "row": "4",
                        "column": "A",
                        "type": "SEAT",
                        "occupation": "FREE",
                        "features": [
                            "EXTRA_SIZE",
                            "WINDOW"
                        ],
                        "passengerPrices": [],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "CH",
                                "description": "CH"
                            },
                            {
                                "code": "L",
                                "description": "L"
                            },
                            {
                                "code": "W",
                                "description": "W"
                            }
                        ],
                        "description": null
                    }
                ]
            ],
            "enabled": false,
            "zones": [
                {
                    "rowInitial": 1,
                    "rowFinal": 4,
                    "passengerPrices": []
                }
            ],
            "layoutSeat3D": "321"
        },
        {
            "cabinClass": {
                "code": "Y",
                "type": "ECONOMY",
                "description": "Turista"
            },
            "columns": [
                {
                    "name": "A",
                    "type": "SEAT"
                }
            ],
            "map": [
                [
                    {
                        "row": "5",
                        "column": "A",
                        "type": "SEAT",
                        "occupation": "OCCUPIED",
                        "features": [
                            "EXTRA_SIZE",
                            "WINDOW"
                        ],
                        "passengerPrices": [
                            {
                                "id": "ADULT_01",
                                "seatPriceCode": 4
                            }
                        ],
                        "passengersAllowed": [],
                        "padisFeatures": [
                            {
                                "code": "CH",
                                "description": "CH"
                            },
                            {
                                "code": "L ",
                                "description": "L "
                            },
                            {
                                "code": "Z ",
                                "description": "Z "
                            },
                            {
                                "code": "W ",
                                "description": "W "
                            }
                        ],
                        "description": null
                    }
                ]
            ],
            "enabled": true,
            "zones": [
                {
                    "rowInitial": 5,
                    "rowFinal": 11,
                    "passengerPrices": [
                        {
                            "id": "ADULT_01",
                            "priceMin": 8,
                            "priceMax": 14
                        }
                    ]
                }
            ],
            "layoutSeat3D": "321-eco"
        }
    ],
    "segmentId": "IB044820240918",
    "haul": "DO",
    "layoutTour3D": "321",
    "operatingCompany": "IB",
    "pricesProvider": "DYNAMIC",
    "allCabinsAvailable": true
}
export const digitalDataEcommerceSeatPropMock = {
    "items": [
        {
            "item_name": "seat",
            "price": 12,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "comfort_seat",
            "quantity": 1
        },
        {
            "item_name": "seat",
            "price": 8,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "upfront",
            "quantity": 1
        },
        {
            "item_name": "seat",
            "price": 8,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "upfront",
            "quantity": 1
        },
        {
            "item_name": "seat",
            "price": 5,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "normal",
            "quantity": 1
        },
        {
            "item_name": "seat",
            "price": 0,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "normal",
            "quantity": 1
        },
        {
            "item_name": "seat",
            "price": 14,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "emergency",
            "quantity": 1
        },
        {
            "item_name": "seat",
            "price": 12,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "comfort_seat",
            "quantity": 1
        },
        {
            "item_name": "seat",
            "price": 0,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "free",
            "quantity": 1
        },
        {
            "item_name": "seat",
            "price": 3,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "",
            'item_category3': undefined,
            'item_id': undefined,
            "item_variant": "promo",
            "quantity": 1
        }
    ]
}
export const digitalDataEcommerceBagaggePropMock = 
{
    "items": [
        {
            "item_name": "baggage",
            "price": 13,
            "item_brand": "iberia",
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_category": "compra directa",
            "item_variant": "15kilos",
            "quantity": 1
        },
        {
            "item_name": "baggage",
            "price": 13,
            "item_brand": "iberia",
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_category": "compra directa",
            "item_variant": "15kilos",
            "quantity": 1
        },
        {
            "item_name": "baggage",
            "price": 13,
            "item_brand": "iberia",
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_category": "compra directa",
            "item_variant": "15kilos",
            "quantity": 1
        }
    ]
}
export const digitalDataEcommerceFlexPropMock = {
    "items": [
        {            
            item_brand:"iberia",
            item_category:"compra directa",
            item_category2:"all",
            item_category3:"all",
            item_id:undefined,
            item_name:"flexible_ticket",
            item_variant:"primer cambio de vuelo gratuito",
            price:6,
        },
        {
            item_brand:"iberia",
            item_category:"compra directa",
            item_category2:"all",
            item_category3:"all",
            item_id:undefined,
            item_name:"flexible_ticket",
            item_variant:"primer cambio de vuelo gratuito",
            price:6,
        },
        {
            item_brand:"iberia",
            item_category:"compra directa",
            item_category2:"all",
            item_category3:"all",
            item_id:undefined,
            item_name:"flexible_ticket",
            item_variant:"primer cambio de vuelo gratuito",
            price:6,
        }
    ]
}
export const digitalDataEcommercePriorityPropMock = {
    "items": [
        {
            "item_name": "priority boarding",
            "price": 5,
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_variant": ""
        }
    ]
}
export const digitalDataEcommerceSpeqsPropMock = {
    "items": [
        {
            "item_name": "special baggage",
            "price": 40,
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_variant": "bike",
            "quantity": 1
        },
        {
            "item_name": "special baggage",
            "price": 35,
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_variant": "fishing",
            "quantity": 1
        },
        {
            "item_name": "special baggage",
            "price": 35,
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_variant": "golf",
            "quantity": 1
        },
        {
            "item_name": "special baggage",
            "price": 35,
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_variant": "scuba",
            "quantity": 1
        },
        {
            "item_name": "special baggage",
            "price": 35,
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_variant": "ski",
            "quantity": 1
        },
        {
            "item_name": "special baggage",
            "price": 45,
            item_category2:undefined,
            item_category3:undefined,
            item_id:undefined,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_variant": "surf",
            "quantity": 1
        }
    ]
}
  
export const eventPropMock = 'view_item_list';

export const setSpeqsEventCartItemsToAdd =  {
    "items": [
        {
            "item_name": "special baggage",
            "price": 40,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "MAD-BIO",
            "item_category3": 1,
            "item_variant": "bike",
            "quantity": 1
        },
        {
            "item_name": "special baggage",
            "price": 45,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "MAD-BIO",
            "item_category3": 1,
            "item_variant": "surf",
            "quantity": 1
        },
        {
            "item_name": "special baggage",
            "price": 35,
            "item_brand": "iberia",
            "item_category": "compra directa",
            "item_category2": "MAD-BIO",
            "item_category3": 1,
            "item_variant": "ski",
            "quantity": 1
        }
    ]
  }
  export const setSpeqsEventCartModel = {
    "passengers": [
        {
            "trips": [
                {
                    "pieces": [
                        {
                            "subtype": "BICYCLE",
                            "description": "Bicicletas",
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
                                    "amount": 40,
                                    "airportAmount": 40,
                                    "from": 1,
                                    "to": 3,
                                    "amountPrice": "40 €"
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "quantySelected": 1,
                            "order": 1,
                            "$$hashKey": "object:1225"
                        },
                        {
                            "subtype": "SURFBOARD",
                            "description": "Tabla de Surf",
                            "extraPieces": null,
                            "reasonForIssuance": {
                                "code": "C",
                                "subcode": "0D8"
                            },
                            "franchisePieces": 0,
                            "purchasedPieces": 0,
                            "maxAdditionalSubtypePieces": 1,
                            "availablePriceRanges": [
                                {
                                    "amount": 45,
                                    "airportAmount": 45,
                                    "from": 1,
                                    "to": 1,
                                    "amountPrice": "45      €"
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "quantySelected": 1,
                            "order": 2,
                            "$$hashKey": "object:1226"
                        },
                        {
                            "subtype": "SKI_SNOW",
                            "description": "Equipaje de esquí",
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
                                    "amount": 35,
                                    "airportAmount": 35,
                                    "from": 1,
                                    "to": 3,
                                    "amountPrice": "35     €"
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "quantySelected": 1,
                            "order": 3,
                            "$$hashKey": "object:1227"
                        },
                        {
                            "subtype": "GOLF_EQUIPMENT",
                            "description": "Equipo de golf",
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
                                    "amount": 35,
                                    "airportAmount": 35,
                                    "from": 1,
                                    "to": 3,
                                    "amountPrice": "35   €"
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "quantySelected": 0,
                            "order": 4,
                            "$$hashKey": "object:1228"
                        },
                        {
                            "subtype": "FISHING_EQUIPMENT",
                            "description": "Equipo de pesca",
                            "extraPieces": null,
                            "reasonForIssuance": {
                                "code": "C",
                                "subcode": "0D6"
                            },
                            "franchisePieces": 0,
                            "purchasedPieces": 0,
                            "maxAdditionalSubtypePieces": 3,
                            "availablePriceRanges": [
                                {
                                    "amount": 35,
                                    "airportAmount": 35,
                                    "from": 1,
                                    "to": 3,
                                    "amountPrice": "35  €"
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "quantySelected": 0,
                            "order": 5,
                            "$$hashKey": "object:1229"
                        },
                        {
                            "subtype": "SCUBA_DIVING",
                            "description": "Submarinismo",
                            "extraPieces": null,
                            "reasonForIssuance": {
                                "code": "C",
                                "subcode": "0EE"
                            },
                            "franchisePieces": 0,
                            "purchasedPieces": 0,
                            "maxAdditionalSubtypePieces": 3,
                            "availablePriceRanges": [
                                {
                                    "amount": 35,
                                    "airportAmount": 35,
                                    "from": 1,
                                    "to": 3,
                                    "amountPrice": "35    €"
                                }
                            ],
                            "status": {
                                "code": "AVAILABLE",
                                "reason": null
                            },
                            "quantySelected": 0,
                            "order": 6,
                            "$$hashKey": "object:1230"
                        }
                    ],
                    "departure": {
                        "code": "MAD",
                        "description": "Madrid",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        }
                    },
                    "arrival": {
                        "code": "BIO",
                        "description": "Bilbao",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        }
                    },
                    
                }
            ]
        }
    ]
  }