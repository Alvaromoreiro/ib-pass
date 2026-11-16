export const mock = {
    model: {
        'ancillariesTrips': [],
        'seatsAvailable': true,
        'insuranceForm': null,
        'baggageAvailable': true,
        'selectedInsurance': {
            passengerInfo: {}
        },
        'baggagesQuanty': null,
        'seatsQuanty': null,
        'currency': null,
        'infoHeader': null,
        'isAllowed': false,
        'isShowedModal': false,
        'totalPayment': 0,
        'baggageAvailablePrice': 0,
        'showInsuranceBox': false,
        'bobAvailable': false,
        'bobInfo': {},
        'speqsQuanty': 0,
        'ancillariesAvailable': null,
        'ancillariesInsurance': null,
        'insuranceAvailable': null,
        'ancillariesFlexibilization': null,
        'ancillariesCarbonFootprint': null,
        'insuranceInfo': null,
        'pendingSeats': null,
        'passengerBaggagesTrips': null,
        'isCurrencyLong': null,
        'speqsAvailablePrice': null,
        'passengerSpeqsTrips': null,
        'showBannerConfort': null,
        'ancillariesPreorder': null,
        'ancillariesPriorityBoarding': null,
        'upgrading': null,
        'flags': null,
        'newSelectedIndurancePerCountry': null,
        'pricesProvider': '',
        bundles: null
    },
    ancillariesInsuranceResponse:{
        'ancillariesAvailable': [
            'FLEXIBILITY_ON_DEMAND',
            'PRIORITY_BOARDING',
            'BAGGAGE',
            'INSURANCE',
            'SEAT',
            'SPECIAL_EQUIPMENT',
            'CO2_FOOTPRINT'
        ],
        'ancillariesTrips': [],
        'seatsAvailable': {
            'status': true,
            'priceFrom': '3€'
        },
        'baggageAvailable': true,
        'seatsQuanty': 0,
        'ancillariesInsurance': [
            {
                'provider': 'ALLIANZ',
                'id': 'IBAESTPR025',
                'name': 'Seguro de Anulación',
                'originalPrice': 6.17,
                'price': '6,17€',
                'originalPricePerPerson': 6.17,
                'pricePerPerson': '6,17€',
                'passengerInfo': [
                    {
                        'passengerType': 'ADULT',
                        'personalInfo': {
                            'name': 'pepe',
                            'surname': 'perez',
                            'lastSurname': '',
                            'infant': null
                        },
                        'passengerId': 'ADULT_01',
                        'seat': null,
                        'resiberId': '1'
                    }
                ],
                'termsAndConditionsDocumentURI': 'https://partner.magroup-webservice.com/IBA/ES/ES/IBA_ES_es_TCs_IBAESTPR025.pdf',
                'descriptionCoverages': [
                    {
                        'title': 'Anulación',
                        'description': '¡Protege tu viaje! Te devolvemos hasta 4.000 euros por persona si tienes que anular tu viaje por alguno de los motivos cubiertos por el seguro: hospitalización, accidente corporal grave o fallecimiento del asegurado o de sus familiares, despido laboral, incorporación a un nuevo puesto de trabajo, y otros que puedes consultar en las condiciones generales.'
                    }
                ],
                'addOns': [],
                'consent': 'Mediante la selección de este seguro:\nConfirmo que he leído el Documento de Información Previa, que acepto las Condiciones Generales del seguro así como la información sobre protección de datos, que me ha sido facilitado en formato digital.\nConfirmo que he verificado que el producto elegido se adapta a mis necesidades\nConfirmo que tengo mi residencia en España',
                'compliance': null,
                'issueCountry': 'ES'
            }
        ],
        'insuranceAvailable': true,
        'flexibilizationInfo': {
            'currency': 'EUR',
            'info': [
                {
                    'description': 'Primer cambio de vuelo gratuito',
                    'total': 5,
                    'passengerPrices': [
                        {
                            'id': 'ADULT_01',
                            'amount': 5
                        }
                    ],
                    'status': {
                        'code': 'AVAILABLE',
                        'reason': null
                    },
                    'subtype': 'FLIGHT_CHANGE',
                    'priceFormatted': '5,00€'
                },
                {
                    'description': 'Reembolso en bono',
                    'total': 11,
                    'passengerPrices': [
                        {
                            'id': 'ADULT_01',
                            'amount': 11
                        }
                    ],
                    'status': {
                        'code': 'AVAILABLE',
                        'reason': null
                    },
                    'percentage': 80,
                    'subtype': 'VOUCHER_REFUND',
                    'priceFormatted': '11,00€'
                },
                {
                    'description': 'Pack Flexibilidad',
                    'total': 13,
                    'passengerPrices': [
                        {
                            'id': 'ADULT_01',
                            'amount': 13
                        }
                    ],
                    'status': {
                        'code': 'AVAILABLE',
                        'reason': null
                    },
                    'percentage': 80,
                    'discount': 15,
                    'subtype': 'FLEXIBILITY_PACK',
                    'priceFormatted': '13,00€'
                }
            ],
            'priceFrom': 5,
            'cardPriceFormatted': '5€',
            'status': {
                'code': 'AVAILABLE',
                'reason': null
            },
            'type': 'FLEXIBILITY_ON_DEMAND',
            'name': 'requestFlex',
            'cardCols': 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6',
            'cardType': 'ib-box-card--type-3',
            'cardImg': {
                'src': 'ancillaries_nuevas/flexibilidad.svg',
                'text': 'ANCILLARIES_FLEXIBILITY_CARDIMG_TEXT'
            },
            'cardTitle': 'ANCILLARIES_FLEXIBILITY_CARDTITLE',
            'cardText': 'ANCILLARIES_FLEXIBILITY_CARDTEXT',
            'cardSubtext': 'ANCILLARIES_FLEXIBILITY_CARDSUBTEXT',
            'cardSubtextSelect': 'ANCILLARIES_FLEXIBILITY_CARDSUBTEXT_SELECT',
            'cardButton': {
                'text': 'BUTTON_ADD_TEXT',
                'altText': 'MODAL_BUTTON_MODIFY_TEXT'
            },
            'confirmed': false,
            'selectedFlex': null,
            'modal': {
                'template': 'ib-onrequest-flexibilization.html',
                'classes': 'ib-modals ib-modals--full-mobile ib-modals--no-padding ib-modals--right fade'
            },
            'datalayer': 'elegir flexilidad a la carta'
        },
        'insuranceInfo': {
            'countriesList': [
                {
                    'country': {
                        'code': 'DE',
                        'description': 'Alemania'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'BE',
                        'description': 'Bélgica'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'PT',
                        'description': 'Portugal'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'CH',
                        'description': 'Suiza'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'DK',
                        'description': 'Dinamarca'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'MX',
                        'description': 'México'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'GR',
                        'description': 'Grecia'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'IT',
                        'description': 'Italia'
                    },
                    'passengerRequiredFields': [
                        {
                            'passengerType': 'ADULT',
                            'requiredFieldsGroups': [
                                {
                                    'requiredFields': [
                                        {
                                            'requiredField': 'DOCUMENT_ID',
                                            'pattern': '[a-zA-Z]{6}\\d{2}[a-zA-Z]\\d{2}[a-zA-Z]\\d{3}[a-zA-Z]'
                                        },
                                        {
                                            'requiredField': 'BIRTH_DATE',
                                            'pattern': null
                                        },
                                        {
                                            'requiredField': 'POLICY_HOLDER',
                                            'pattern': null
                                        }
                                    ]
                                }
                            ],
                            'requiredForAll': false
                        }
                    ]
                },
                {
                    'country': {
                        'code': 'FR',
                        'description': 'Francia'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'ES',
                        'description': 'España'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'SE',
                        'description': 'Suecia'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'CZ',
                        'description': 'República Checa'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'IE',
                        'description': 'Irlanda'
                    },
                    'passengerRequiredFields': []
                },
                {
                    'country': {
                        'code': 'NL',
                        'description': 'Holanda'
                    },
                    'passengerRequiredFields': []
                }
            ]},
        'insuranceCountry': {
            'country': {
                'code': 'ES',
                'description': 'España'
            },
            'passengerRequiredFields': []
        },
        'id': 'IBAESTPR025',
        'price': '6,17€',
        'priceZero': '0€',
        'originalPrice': 6.17,
        'passengers': [
            {
                'passengerType': 'ADULT',
                'personalInfo': {
                    'name': 'pepe',
                    'surname': 'perez',
                    'lastSurname': '',
                    'infant': null
                },
                'passengerId': 'ADULT_01',
                'seat': null,
                'resiberId': '1'
            }
        ],
        'conditionsUri': 'https://partner.magroup-webservice.com/IBA/ES/ES/IBA_ES_es_TCs_IBAESTPR025.pdf',
        'isModalLoading': false,
        'countryInsurance': 'España',
        'insurancePatterns': {
            'IT': '[a-zA-Z]{6}\\d{2}[a-zA-Z]\\d{2}[a-zA-Z]\\d{3}[a-zA-Z]'
        },
        'consent': 'Mediante la selección de este seguro:\nConfirmo que he leído el Documento de Información Previa, que acepto las Condiciones Generales del seguro así como la información sobre protección de datos, que me ha sido facilitado en formato digital.\nConfirmo que he verificado que el producto elegido se adapta a mis necesidades\nConfirmo que tengo mi residencia en España',
        'issueCountry': 'ES',
        'oldInsuranceCountry': {
            'country': {
                'code': 'ES',
                'description': 'España'
            },
            'passengerRequiredFields': []
        },
        'pendingSeats': false,
        'passengerBaggagesTrips': [
            {
                'id': 'ADULT_01',
                'trips': [
                    {
                        'id': 'MADBIO20230329062000',
                        'pieces': [
                            {
                                'subtype': 'BAGGAGE_15',
                                'description': '15Kg',
                                'extraPieces': null,
                                'reasonForIssuance': {
                                    'code': 'C',
                                    'subcode': '0LM'
                                },
                                'franchisePieces': 0,
                                'purchasedPieces': 0,
                                'maxAdditionalSubtypePieces': 9,
                                'availablePriceRanges': [
                                    {
                                        'amount': 13,
                                        'airportAmount': 13,
                                        'from': 1,
                                        'to': 9
                                    }
                                ],
                                'status': {
                                    'code': 'AVAILABLE',
                                    'reason': null
                                },
                                'quantySelected': 0
                            },
                            {
                                'subtype': 'BAGGAGE_23',
                                'description': '23Kg',
                                'extraPieces': null,
                                'reasonForIssuance': {
                                    'code': 'C',
                                    'subcode': '0GO'
                                },
                                'franchisePieces': 0,
                                'purchasedPieces': 0,
                                'maxAdditionalSubtypePieces': 9,
                                'availablePriceRanges': [
                                    {
                                        'amount': 18,
                                        'airportAmount': 18,
                                        'from': 1,
                                        'to': 1
                                    },
                                    {
                                        'amount': 28,
                                        'airportAmount': 28,
                                        'from': 2,
                                        'to': 9
                                    }
                                ],
                                'status': {
                                    'code': 'AVAILABLE',
                                    'reason': null
                                },
                                'quantySelected': 0
                            },
                            {
                                'subtype': 'BAGGAGE_32',
                                'description': '32Kg',
                                'extraPieces': null,
                                'reasonForIssuance': {
                                    'code': 'C',
                                    'subcode': '0FM'
                                },
                                'franchisePieces': 0,
                                'purchasedPieces': 0,
                                'maxAdditionalSubtypePieces': 9,
                                'availablePriceRanges': [
                                    {
                                        'amount': 35,
                                        'airportAmount': 35,
                                        'from': 1,
                                        'to': 9
                                    }
                                ],
                                'status': {
                                    'code': 'AVAILABLE',
                                    'reason': null
                                },
                                'quantySelected': 0
                            }
                        ],
                        'maxAdditionalPieces': 9,
                        'piecesChoosed': 0,
                        'totalPrice': 0,
                        'totalBaggages': 0,
                        'departure': {
                            'code': 'MAD',
                            'description': 'Madrid',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
                            }
                        },
                        'arrival': {
                            'code': 'BIO',
                            'description': 'Bilbao',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
                            }
                        },
                        'text': null
                    }
                ],
                'info': {
                    'name': 'pepe',
                    'surname': 'perez',
                    'infant': null
                }
            }
        ],
        'currency': {
            'suffixSymbol': true,
            'decimalSeparator': ',',
            'numberDecimals': 2,
            'groupingSeparator': '.',
            'currencySymbol': '€',
            'description': 'Euro'
        },
        'isCurrencyLong': false,
        'baggageAvailablePrice': {
            'priceFrom': '13€'
        },
        'bobAvailable': false,
        'bobInfo': {
            'slices': [],
            'priceFrom': '',
            'additionalBagsPrice': ''
        },
        'ancillariesCarbonFootprint': {
            'priceFrom': '280.2€',
            'price': 280.2,
            'kilosCo2Equivalent': 20.2,
            'kilosCo2EquivalentFormatted': '20,2',
            'confirmed': false
        },
        'speqsAvailablePrice': {
            'priceFrom': '35€'
        },
        'ancillariesSpeqs': [
            {
                'id': 'ADULT_01',
                'trips': [
                    {
                        'id': 'MADBIO20230329062000',
                        'pieces': [
                            {
                                'subtype': 'BICYCLE',
                                'description': 'Bicicletas',
                                'extraPieces': null,
                                'reasonForIssuance': {
                                    'code': 'C',
                                    'subcode': '0EC'
                                },
                                'franchisePieces': 0,
                                'purchasedPieces': 0,
                                'maxAdditionalSubtypePieces': 3,
                                'availablePriceRanges': [
                                    {
                                        'amount': 40,
                                        'airportAmount': 40,
                                        'from': 1,
                                        'to': 3,
                                        'amountPrice': '40€'
                                    }
                                ],
                                'status': {
                                    'code': 'AVAILABLE',
                                    'reason': null
                                },
                                'quantySelected': 0
                            },
                            {
                                'subtype': 'GOLF_EQUIPMENT',
                                'description': 'Equipo de golf',
                                'extraPieces': null,
                                'reasonForIssuance': {
                                    'code': 'C',
                                    'subcode': '0D4'
                                },
                                'franchisePieces': 0,
                                'purchasedPieces': 0,
                                'maxAdditionalSubtypePieces': 3,
                                'availablePriceRanges': [
                                    {
                                        'amount': 35,
                                        'airportAmount': 35,
                                        'from': 1,
                                        'to': 3,
                                        'amountPrice': '35€'
                                    }
                                ],
                                'status': {
                                    'code': 'AVAILABLE',
                                    'reason': null
                                },
                                'quantySelected': 0
                            },
                            {
                                'subtype': 'SKI_SNOW',
                                'description': 'Esquí/Tabla de snowboard',
                                'extraPieces': null,
                                'reasonForIssuance': {
                                    'code': 'C',
                                    'subcode': '0DD'
                                },
                                'franchisePieces': 0,
                                'purchasedPieces': 0,
                                'maxAdditionalSubtypePieces': 3,
                                'availablePriceRanges': [
                                    {
                                        'amount': 35,
                                        'airportAmount': 35,
                                        'from': 1,
                                        'to': 3,
                                        'amountPrice': '35€'
                                    }
                                ],
                                'status': {
                                    'code': 'AVAILABLE',
                                    'reason': null
                                },
                                'quantySelected': 0
                            }
                        ],
                        'maxAdditionalPieces': 3,
                        'speqsChoosed': 0,
                        'totalPrice': 0,
                        'departure': {
                            'code': 'MAD',
                            'description': 'Madrid',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
                            }
                        },
                        'arrival': {
                            'code': 'BIO',
                            'description': 'Bilbao',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
                            }
                        },
                        'text': null
                    }
                ],
                'info': {
                    'name': 'pepe',
                    'surname': 'perez',
                    'infant': null
                }
            }
        ],
        'preorderAncillarieInfo': {},
        'priorityBoardingInfo': {
            'currency': 'EUR',
            'info': [
                {
                    'id': 'ADULT_01',
                    'trips': [
                        {
                            'id': 'IB043220230329',
                            'amount': 6,
                            'tripPrice': '6,00€',
                            'checkedTrip': false,
                            'onlySliceInfo': true,
                            'status': 'AVAILABLE',
                            'departure': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            },
                            'arrival': {
                                'code': 'BIO',
                                'description': 'Bilbao',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        }
                    ],
                    'passengerType': 'ADULT',
                    'info': {
                        'name': 'pepe',
                        'surname': 'perez',
                        'infant': null
                    }
                }
            ],
            'priceFrom': 6,
            'cardPriceFormatted': '6€',
            'status': {
                'code': 'AVAILABLE',
                'reason': null
            },
            'type': 'PRIORITY_BOARDING',
            'name': 'priorityBoarding',
            'cardCols': 'col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6',
            'cardType': 'ib-box-card--type-3',
            'cardImg': {
                'src': 'ancillaries_nuevas/prioridad-de-embarque.svg',
                'text': 'PRIORITY_BOARDING_TITLE'
            },
            'cardTitle': 'PRIORITY_BOARDING_TITLE',
            'cardText': 'ANCILLARIES_PRIORITY_BOARDING_CARDTEXT',
            'cardSubtext': '',
            'cardSubtextSelect': 'ANCILLARIES_PRIORITY_BOARDING_CARDSUBTEXT_SELECT',
            'cardButton': {
                'text': 'BUTTON_ADD_TEXT',
                'altText': 'MODAL_BUTTON_MODIFY_TEXT'
            },
            'confirmed': false,
            'selectedPriorityBoarding': null,
            'modal': {
                'template': 'ib-modal-priority-boarding.html',
                'classes': 'ib-modals ib-modals--full-mobile ib-modals--no-padding ib-modals--right fade'
            },
            'datalayer': 'elegir priority boarding'
        },
        'flags': {
            'showBannerConfort': false,
            'showBannerResident': false
        }

    },
    headerModel: {
        'headerModel': {
            'flightType': 'availabilityFlight',
            'redemption': false,
            'trips': [
                {
                    'originCode': 'MAD',
                    'originCity': 'Madrid',
                    'destinyCode': 'SVQ',
                    'destinyCity': 'Sevilla',
                    'dateFlight': '19/04/2023',
                    'returnFlight': null,
                    'passengers': 1,
                    'tripType': '1'
                }
            ],
            'passengers': {
                'numberPassengers': 1,
                'numAdults': 1,
                'numSeniors': 0,
                'numYouth': 0,
                'numTeenager': 0,
                'numChilds': 0,
                'numInfants': 0
            },
            'shoppingBasket': {
                'baggages': {
                    'segments': [],
                    'hasBaggage': false
                },
                'seats': {
                    'segments': [],
                    'hasSeats': false
                },
                'insurance': {
                    'info': null,
                    'hasInsurance': false
                },
                'flexibilization': {
                    'info': null,
                    'hasFlexibilization': false
                },
                'upgrading': {
                    'segments': [],
                    'hasUpgrading': false
                },
                'speqs': {
                    'segments': [],
                    'hasSpeqs': false
                },
                'priorityBoarding': {
                    'info': null,
                    'hasPriorityBoarding': false
                },
                'carbonFootprint': {
                    'kilosCo2Equivalent': 0,
                    'price': 0,
                    'hasCarbonFootprint': false
                },
                'globickTransfers':{
                    'hasTransfersGlobick': false
                },
                'discountsModel': {
                    'hasDiscounts': false,
                    'total': 0,
                    'discounts': {},
                    'totalFormated': '0€'
                },
                'othersModel': {
                    'hasElements': true,
                    'others': [],
                    'total': {
                        'total': 0,
                        'totalFormatted': '0€'
                    }
                },
                'segmentsInfo': [
                    {
                        'id': 'IB395420230419',
                        'origin': {
                            'description': 'Madrid',
                            'code': 'MAD'
                        },
                        'destination': {
                            'description': 'Sevilla',
                            'code': 'SVQ'
                        }
                    }
                ],
                'showBasket': true,
                'currency': {
                    'suffixSymbol': true,
                    'decimalSeparator': ',',
                    'numberDecimals': 2,
                    'groupingSeparator': '.',
                    'currencySymbol': '€',
                    'description': 'Euro'
                },
                'total': {
                    'totalPrice': 32.22,
                    'formatted': '32,22€',
                    'original': 32.22
                },
                'trips': {
                    'trips': [
                        {
                            'scales': false,
                            'segments': [
                                {
                                    'origin': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    },
                                    'destination': {
                                        'code': 'SVQ',
                                        'description': 'Sevilla',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    },
                                    'date': 'Miércoles 19 abr. 2023 / 07:30',
                                    'segments': [
                                        {
                                            'origin': {
                                                'code': 'MAD',
                                                'description': 'Madrid',
                                                'countryCode': 'ES',
                                                'country': {
                                                    'code': 'ES',
                                                    'description': 'España'
                                                }
                                            },
                                            'destination': {
                                                'code': 'SVQ',
                                                'description': 'Sevilla',
                                                'countryCode': 'ES',
                                                'country': {
                                                    'code': 'ES',
                                                    'description': 'España'
                                                }
                                            },
                                            'date': 'miércoles 19 abr. 2023 / 07:30'
                                        }
                                    ]
                                }
                            ],
                            'passengers': [
                                {
                                    'quantity': 1,
                                    'type': 'ADULT',
                                    'description': 'Adulto',
                                    'perPassengerPrice': '12,00€',
                                    'taxes': '20,22€',
                                    'namesList': [
                                        'pepe perez '
                                    ]
                                }
                            ]
                        }
                    ],
                    'total': {
                        'totalPrice': 32.22,
                        'formatted': '32,22€',
                        'original': 32.22
                    }
                }
            },
            'advancedSearch': false,
            'showModalBackHome': true,
            'currency': {
                'suffixSymbol': true,
                'decimalSeparator': ',',
                'numberDecimals': 2,
                'groupingSeparator': '.',
                'currencySymbol': '€',
                'description': 'Euro'
            },
            'showAdvancedSearch': true,
            'avancedSearch': true,
            'steps': {
                'position': 3,
                'totalSteps': 5
            }
        },
        'greyBarModel': {
            'login': {},
            'loggedData': {},
            'userLogged': false,
            'isONB': false,
            'isLogged': false,
            'show': false
        },
        'stepsModel': {
            'steps': [
                {
                    'index': 1,
                    'position': 'availability',
                    'text': 'HEADER_STEPS_FLIGHT_SELECT'
                },
                {
                    'index': 2,
                    'position': 'ibairp',
                    'text': 'HEADER_STEPS_PASSENGER_DATA'
                },
                {
                    'index': 3,
                    'position': 'ibcmtv',
                    'text': 'HEADER_STEPS_CUSTOM_COMPLETE'
                },
                {
                    'index': 4,
                    'position': 'ibpurc',
                    'text': 'HEADER_STEPS_PAYMENT'
                },
                {
                    'index': 5,
                    'position': 'confirmation',
                    'text': 'HEADER_STEPS_CONFIRMATION'
                }
            ],
            'position': 'ibcmtv'
        }
    },


    bundles: [
        {
            'id': '1',
            'name': 'PACK AHORRO',
            'priority': 1,
            'priceItems': 18.51,
            'priceItemsDiscount': 16.67,
            'priceItemsBenefit': 1.83,
            'priceItemsAll': 34.01,
            'priceItemsAllDiscount': 9.69,
            'priceItemsAllBenefit': 3.36,
            'items': [
                {
                    'type': 'BAGGAGE',
                    'subtype': 'BAGGAGE_15',
                    'discount': 10,
                    'quantity': 2,
                    'priceItem': 15.50,
                    'priceItemDiscount': 13.96,
                    'priceItemBenefit': 1.53,
                    'priceItemAll': 31.0,
                    'priceItemAllDiscount': 6.98,
                    'priceItemAllBenefit': 3.06
                },
                {
                    'type': 'FLEXIBILITY_ON_DEMAND',
                    'subtype': 'VOUCHER_REFUND',
                    'discount': 10,
                    'quantity': 1,
                    'priceItem': 3.01,
                    'priceItemDiscount': 2.71,
                    'priceItemBenefit': 0.29,
                    'priceItemAll': 3.01,
                    'priceItemAllDiscount': 2.71,
                    'priceItemAllBenefit': 0.29
                }
            ]
        }
    ]



};
