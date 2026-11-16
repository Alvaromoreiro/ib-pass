export const bookingUrlParams = { 'searchOrigin': 'PAHMPA', 'market': 'ES', 'lenguage': 'es', 'arrival': 'MAD', 'destination': 'BCN', 'beginDay': null, 'beginMonth': null, 'beginYear': null, 'endDay': null, 'endMonth': null, 'endYear': null, 'tripType': '2', 'senior': null, 'adult': 1, 'young': null, 'teenager': null, 'child': null, 'infant': null, 'beginFareType': 'E', 'endFareType': 'E', 'payWithAvios': null, 'checkAvios': null, 'checkPoints': null, 'pointsPay': null, 'originDestinations': [{ 'destination': 'BCN', 'origin': 'MAD' }] };

export const originDest = { 'originCity': { 'code': 'MAD', 'description': 'Madrid' }, 'destinationCity': { 'code': 'BCN', 'description': 'Barcelona' }, 'dates': { 'outboundFlight': null, 'formatedOutboundFlight': null, 'returnFlight': null, 'formatedReturnFlight': null }, 'passengers': 1, 'numAdults': 1, 'numChilds': 0, 'numInfant': 0, 'numSeniors': 0, 'numTeenager': 0, 'numYoung': 0, 'tripType': '2' };

export const shuttleExampleModel = {
    'fareShuttleModel': {
        'passengerInfo': {
            'adults': 1,
            'childs': 0,
            'infants': 0
        },
        'slices': [
            {
                'originCity': 'Madrid',
                'originCityCode': 'MAD',
                'destinationCityCode': 'BCN',
                'destinationCity': 'Barcelona',
                'cabin': 'Economy',
                'flights': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'marketingFlightNumber': 'OPEN',
                    'operationalFlightNumber': 'OPEN',
                    'operationalDisclosure': 'IB',
                    'aircraft': null
                },
                'segmentsTotal': 1,
                'segments': [
                    {
                        'departure': {
                            'code': 'MAD',
                            'name': 'Madrid Adolfo Suarez-Barajas',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'Spain'
                                }
                            }
                        },
                        'arrival': {
                            'code': 'BCN',
                            'name': 'Barcelona',
                            'terminal': '1',
                            'city': {
                                'code': 'BCN',
                                'description': 'Barcelona',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'Spain'
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
                            'marketingFlightNumber': 'OPEN',
                            'operationalFlightNumber': 'OPEN',
                            'operationalDisclosure': 'IB',
                            'aircraft': null
                        },
                        'cabin': {
                            'rbd': 'Y',
                            'bookingCode': null,
                            'bookingClass': 'TOURIST',
                            'remainingSeats': 0,
                            'fareFamily': 'YPA',
                            'fareBasis': 'YDRT',
                            'seatDisplays': null,
                            'extendedFareCode': '',
                            'ticketDesignator': '',
                            'brandCode': '',
                            'cabinDescription': 'Economy'
                        },
                        'overnight': false,
                        'id': 'Gn5TPbXQsoRFoWOp',
                        'duration': null,
                        'waitingTime': 0,
                        'providerId': '',
                        'ticketDesignator': '',
                        'accrualQuote': null,
                        'delayInformation': null,
                        'stop': null,
                        'departureDateTime': null,
                        'arrivalDateTime': null,
                        'secureFlightInformed': false,
                        'secureFlight': false
                    }
                ]
            },
            {
                'originCity': 'Barcelona',
                'originCityCode': 'BCN',
                'destinationCityCode': 'MAD',
                'destinationCity': 'Madrid',
                'cabin': 'Economy',
                'flights': {
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'operationalCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'marketingFlightNumber': 'OPEN',
                    'operationalFlightNumber': 'OPEN',
                    'operationalDisclosure': 'IB',
                    'aircraft': null
                },
                'segmentsTotal': 1,
                'segments': [
                    {
                        'departure': {
                            'code': 'BCN',
                            'name': 'Barcelona',
                            'terminal': '1',
                            'city': {
                                'code': 'BCN',
                                'description': 'Barcelona',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'Spain'
                                }
                            }
                        },
                        'arrival': {
                            'code': 'MAD',
                            'name': 'Madrid Adolfo Suarez-Barajas',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'Spain'
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
                            'marketingFlightNumber': 'OPEN',
                            'operationalFlightNumber': 'OPEN',
                            'operationalDisclosure': 'IB',
                            'aircraft': null
                        },
                        'cabin': {
                            'rbd': 'Y',
                            'bookingCode': null,
                            'bookingClass': 'TOURIST',
                            'remainingSeats': 0,
                            'fareFamily': 'YPA',
                            'fareBasis': 'YDRT',
                            'seatDisplays': null,
                            'extendedFareCode': '',
                            'ticketDesignator': '',
                            'brandCode': '',
                            'cabinDescription': 'Economy'
                        },
                        'overnight': false,
                        'id': 'GwIHffWIaCr5w-KE',
                        'duration': null,
                        'waitingTime': 0,
                        'providerId': '',
                        'ticketDesignator': '',
                        'accrualQuote': null,
                        'delayInformation': null,
                        'stop': null,
                        'departureDateTime': null,
                        'arrivalDateTime': null,
                        'secureFlightInformed': false,
                        'secureFlight': false
                    }
                ]
            }
        ],
        'priceInfo': {
            'fare': 330,
            'tax': 36.29,
            'total': 366.29,
            'currency': 'Avios',
            'ticketingFee': 0,
            'totalFare': 330,
            'totalCurrency': '366.29€',
            'totalFormatter': 366.29,
            'offerItems': [
                {
                    'offerItemId': 'IB6e0f0b82b9c448d487b65ba2e66ab390OP_01',
                    'passengerIds': [
                        'ADULT_01'
                    ],
                    'price': {
                        'fare': 330,
                        'tax': 36.29,
                        'total': 366.29,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'originCurrencyPrice': null,
                    'detailedTaxes': [
                        {
                            'code': 'QV',
                            'amount': 6.62,
                            'currency': 'EUR',
                            'description': 'Security',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 1.38,
                            'currency': 'EUR',
                            'description': 'Security Tax',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'JD',
                            'amount': 28.29,
                            'currency': 'EUR',
                            'description': 'Departure Charge',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'reshopDetailedTaxes': [],
                    'fareComponents': [],
                    'surcharges': null
                }
            ],
            'aviosToEarn': null,
            'elitePointsToEarn': null,
            'text': 'Total price, includes air fare, <a href="../es/taxes-and-government-fees/" target="_blank">taxes</a> (except those charged at certain airports at the time of check-in), handling fees, operator charges and selected options. Click <a href="../es/service-fees/" target="_blank">here</a> to check for any management fees for changes and refunds.'
        },
        'fareFamilyConditions': [
            {
                'cabinType': 'E',
                'cabinDescription': 'Economy',
                'commercialCode': 'YPA',
                'commercialName': 'Economy Air Shuttle',
                'commercialNameES': 'Turista Puente Aéreo',
                'priority': 500,
                'conditions': [
                    {
                        'code': 'CABINA',
                        'name': ' Cabin',
                        'text': 'Economy.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Economy Cabin',
                            'message': 'Economy.',
                            'code': 'CA_Cabina_Turista',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'Economy'
                        }
                    },
                    {
                        'code': 'EQMANO',
                        'name': 'Hand baggage',
                        'text': '1 item max. 10 kg (56x40x25cm) included.',
                        'units': 1,
                        'extendedInfo': {
                            'title': 'Hand luggage: 1 item',
                            'message': '1 personal accessory and 1 item max. 10 kg (56x40x25cm) included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator. ',
                            'code': 'CA_EQP_MANO_10KG',
                            'conditionStatus': true,
                            'observationCode': '1',
                            'mobileMessage': '1 piece (56x40x25cm)'
                        }
                    },
                    {
                        'code': 'EQBODEGA',
                        'name': 'Baggage in hold',
                        'text': '1 item max. 23 kg and 158 cm included.',
                        'units': 1,
                        'extendedInfo': {
                            'title': 'Checked baggage: 1 item',
                            'message': '1 item max. 23 kg and 158 cm included.',
                            'code': 'CA_1_PIEZAS',
                            'conditionStatus': true,
                            'observationCode': '2',
                            'mobileMessage': '1 piece included'
                        }
                    },
                    {
                        'code': 'COMIDA',
                        'name': 'Meal',
                        'text': 'With a fee.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Meal not included ',
                            'message': 'With a fee.',
                            'code': 'Comida_no_incluida',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'Not included'
                        }
                    },
                    {
                        'code': 'ASIENTO',
                        'name': 'Seat  selection',
                        'text': 'Included.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Seat selection included',
                            'message': 'Included. ',
                            'code': 'CA_Asiento_Gratuito_No_Destacado',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'Included'
                        }
                    },
                    {
                        'code': 'ASIENTODELANTERO',
                        'name': 'Front seat',
                        'text': 'Included.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Front seat included',
                            'message': 'Included. ',
                            'code': 'CA_Asiento_Delantero_incluido_OFF',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'Included'
                        }
                    },
                    {
                        'code': 'ASIENTOXL',
                        'name': 'Selection of an XL seat',
                        'text': 'Included.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'XL seat included',
                            'message': 'Included. ',
                            'code': 'CA_Asiento_XL_Incluido',
                            'conditionStatus': true,
                            'observationCode': null,
                            'mobileMessage': 'Included'
                        }
                    },
                    {
                        'code': 'EMBARQUE',
                        'name': 'Priority Boarding ',
                        'text': 'Included (Group 2).',
                        'units': 2,
                        'extendedInfo': {
                            'title': 'Group 2 priority boarding',
                            'message': 'Included (Group 2).',
                            'code': 'CA_Embarque_Prioritario_grupo_2',
                            'conditionStatus': true,
                            'observationCode': null,
                            'mobileMessage': 'Yes, group 2'
                        }
                    },
                    {
                        'code': 'CAMBIO',
                        'name': 'Change',
                        'text': 'Allowed at any time.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Flight change allowed',
                            'message': 'Allowed at any time.',
                            'code': 'CA_CAMBIO SIEMPRE',
                            'conditionStatus': true,
                            'observationCode': null,
                            'mobileMessage': 'Allowed at any time.'
                        }
                    },
                    {
                        'code': 'REEMBOLSO',
                        'name': 'refund (in each direction)',
                        'text': 'Allowed at any time.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Refund allowed',
                            'message': 'Allowed at any time.',
                            'code': 'CA_REEMBOLSO SIEMPRE',
                            'conditionStatus': true,
                            'observationCode': null,
                            'mobileMessage': 'Permitted at any time'
                        }
                    },
                    {
                        'code': 'TARJEMBANTIC',
                        'name': 'Early check-in',
                        'text': 'Included.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Early boarding pass included',
                            'message': 'Included. ',
                            'code': 'CA_Tarjeta_embarque_anticipada_incluido',
                            'conditionStatus': true,
                            'observationCode': null,
                            'mobileMessage': 'Included'
                        }
                    },
                    {
                        'code': 'CHECKINDESK',
                        'name': 'Exclusive check-in counter',
                        'text': 'Not included.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Exclusive check-in desk not included',
                            'message': 'Not included.',
                            'code': 'Chek-in_desk_ NO',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'No'
                        }
                    },
                    {
                        'code': 'SALAVIP',
                        'name': 'Access to VIP lounges',
                        'text': 'Access not included.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Access to VIP Lounge not included',
                            'message': 'Access not included.',
                            'code': 'Acceso a salas VIP No permitido',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'No'
                        }
                    },
                    {
                        'code': 'FASTTRACK',
                        'name': 'Fast Track',
                        'text': 'Not included.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Fast Track not included',
                            'message': 'Not included.',
                            'code': 'Fast Track NO',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'No'
                        }
                    },
                    {
                        'code': 'EQPPRIOR',
                        'name': 'Priority baggage delivery',
                        'text': 'With a fee.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Fast bag drop not included',
                            'message': 'With a fee.',
                            'code': 'Entrega_prioritaria_equipaje_ NO',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'No'
                        }
                    },
                    {
                        'code': 'AVIO',
                        'name': 'AVIOS',
                        'text': 'Included.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Avios awarded with purchase',
                            'message': 'Included.  ',
                            'code': 'AVIOS incluido',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'Yes'
                        }
                    },
                    {
                        'code': 'WIFI',
                        'name': 'WiFi',
                        'text': 'Available with a fee, depending on aircraft type.',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Wi-Fi with a fee',
                            'message': 'Available with a fee, depending on aircraft type. ',
                            'code': 'Wifi pago',
                            'conditionStatus': false,
                            'observationCode': null,
                            'mobileMessage': 'For a fee'
                        }
                    }
                ],
                'observations': [
                    {
                        'observationCode': 1,
                        'observationText': '1 piece (56x40x25cm/ 14kg Business Class / 10kg Economy)+ personal belonging. Valid for flights operated by <b>one</b>world companies, for others please consult the operator\n<br/>'
                    },
                    {
                        'observationCode': 2,
                        'observationText': 'One piece. Max: 23 kg / 158 cm'
                    }
                ],
                'conditionsPriority': [
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'ASIENTOXL',
                    'ASIENTODELANTERO',
                    'EMBARQUE',
                    'TARJEMBANTIC',
                    'CAMBIO',
                    'REEMBOLSO',
                    'CHECKINDESK',
                    'FASTTRACK'
                ]
            }
        ],
        'marketCode': 'ES',
        'offers': [
            {
                'offerId': 'IB6e0f0b82b9c448d487b65ba2e66ab390OP',
                'price': {
                    'fare': 330,
                    'tax': 36.29,
                    'total': 366.29,
                    'currency': 'Avios',
                    'ticketingFee': 0,
                    'totalFare': 330,
                    'totalCurrency': '366.29€',
                    'totalFormatter': 366.29,
                    'offerItems': [
                        {
                            'offerItemId': 'IB6e0f0b82b9c448d487b65ba2e66ab390OP_01',
                            'passengerIds': [
                                'ADULT_01'
                            ],
                            'price': {
                                'fare': 330,
                                'tax': 36.29,
                                'total': 366.29,
                                'currency': 'EUR',
                                'ticketingFee': 0
                            },
                            'originCurrencyPrice': null,
                            'detailedTaxes': [
                                {
                                    'code': 'QV',
                                    'amount': 6.62,
                                    'currency': 'EUR',
                                    'description': 'Security',
                                    'subcode': null,
                                    'country': null,
                                    'carrier': null
                                },
                                {
                                    'code': 'OG',
                                    'amount': 1.38,
                                    'currency': 'EUR',
                                    'description': 'Security Tax',
                                    'subcode': null,
                                    'country': null,
                                    'carrier': null
                                },
                                {
                                    'code': 'JD',
                                    'amount': 28.29,
                                    'currency': 'EUR',
                                    'description': 'Departure Charge',
                                    'subcode': null,
                                    'country': null,
                                    'carrier': null
                                }
                            ],
                            'reshopDetailedTaxes': [],
                            'fareComponents': [],
                            'surcharges': null
                        }
                    ],
                    'aviosToEarn': null,
                    'elitePointsToEarn': null,
                    'text': 'Total price, includes air fare, <a href="../es/taxes-and-government-fees/" target="_blank">taxes</a> (except those charged at certain airports at the time of check-in), handling fees, operator charges and selected options. Click <a href="../es/service-fees/" target="_blank">here</a> to check for any management fees for changes and refunds.'
                },
                'slices': [
                    {
                        'sliceId': '1MADBCN',
                        'departureDateTime': null,
                        'arrivalDateTime': null,
                        'duration': null,
                        'stopsNumber': 0,
                        'price': {
                            'fare': 165,
                            'tax': 18.63,
                            'total': 183.63,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedPrices': [
                            {
                                'fare': 165,
                                'tax': 18.63,
                                'total': 183.63,
                                'currency': 'EUR',
                                'passengerIds': [
                                    'ADULT_01'
                                ],
                                'segmentPrices': null,
                                'commission': null,
                                'ticketingFee': 0
                            }
                        ],
                        'segments': [
                            {
                                'departure': {
                                    'code': 'MAD',
                                    'name': 'Madrid Adolfo Suarez-Barajas',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'Spain'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'BCN',
                                    'name': 'Barcelona',
                                    'terminal': '1',
                                    'city': {
                                        'code': 'BCN',
                                        'description': 'Barcelona',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'Spain'
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
                                    'marketingFlightNumber': 'OPEN',
                                    'operationalFlightNumber': 'OPEN',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': null
                                },
                                'cabin': {
                                    'rbd': 'Y',
                                    'bookingCode': null,
                                    'bookingClass': 'TOURIST',
                                    'remainingSeats': 0,
                                    'fareFamily': 'YPA',
                                    'fareBasis': 'YDRT',
                                    'seatDisplays': null,
                                    'extendedFareCode': '',
                                    'ticketDesignator': '',
                                    'brandCode': '',
                                    'cabinDescription': 'Economy'
                                },
                                'overnight': false,
                                'id': 'Gn5TPbXQsoRFoWOp',
                                'duration': null,
                                'waitingTime': 0,
                                'providerId': '',
                                'ticketDesignator': '',
                                'accrualQuote': null,
                                'delayInformation': null,
                                'stop': null,
                                'departureDateTime': null,
                                'arrivalDateTime': null,
                                'secureFlightInformed': false,
                                'secureFlight': false
                            }
                        ],
                        'overnight': false,
                        'origin': null,
                        'destination': null,
                        'originDestinationKey': null
                    },
                    {
                        'sliceId': '2BCNMAD',
                        'departureDateTime': null,
                        'arrivalDateTime': null,
                        'duration': null,
                        'stopsNumber': 0,
                        'price': {
                            'fare': 165,
                            'tax': 17.66,
                            'total': 182.66,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedPrices': [
                            {
                                'fare': 165,
                                'tax': 17.66,
                                'total': 182.66,
                                'currency': 'EUR',
                                'passengerIds': [
                                    'ADULT_01'
                                ],
                                'segmentPrices': null,
                                'commission': null,
                                'ticketingFee': 0
                            }
                        ],
                        'segments': [
                            {
                                'departure': {
                                    'code': 'BCN',
                                    'name': 'Barcelona',
                                    'terminal': '1',
                                    'city': {
                                        'code': 'BCN',
                                        'description': 'Barcelona',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'Spain'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'MAD',
                                    'name': 'Madrid Adolfo Suarez-Barajas',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'Spain'
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
                                    'marketingFlightNumber': 'OPEN',
                                    'operationalFlightNumber': 'OPEN',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': null
                                },
                                'cabin': {
                                    'rbd': 'Y',
                                    'bookingCode': null,
                                    'bookingClass': 'TOURIST',
                                    'remainingSeats': 0,
                                    'fareFamily': 'YPA',
                                    'fareBasis': 'YDRT',
                                    'seatDisplays': null,
                                    'extendedFareCode': '',
                                    'ticketDesignator': '',
                                    'brandCode': '',
                                    'cabinDescription': 'Economy'
                                },
                                'overnight': false,
                                'id': 'GwIHffWIaCr5w-KE',
                                'duration': null,
                                'waitingTime': 0,
                                'providerId': '',
                                'ticketDesignator': '',
                                'accrualQuote': null,
                                'delayInformation': null,
                                'stop': null,
                                'departureDateTime': null,
                                'arrivalDateTime': null,
                                'secureFlightInformed': false,
                                'secureFlight': false
                            }
                        ],
                        'overnight': false,
                        'origin': null,
                        'destination': null,
                        'originDestinationKey': null
                    }
                ],
                'offerExpiration': '2023-02-13T17:27:29.533+01:00',
                'onHoldOptions': [],
                'cashAviosPossibilities': [
                    {
                        'totalDiscount': 10,
                        'currency': 'EUR',
                        'aviosRequired': 1852,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 10,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    },
                    {
                        'totalDiscount': 109.89,
                        'currency': 'EUR',
                        'aviosRequired': 20350,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 109.89,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    },
                    {
                        'totalDiscount': 183.14,
                        'currency': 'EUR',
                        'aviosRequired': 33915,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 183.14,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    },
                    {
                        'totalDiscount': 293.03,
                        'currency': 'EUR',
                        'aviosRequired': 54265,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 293.03,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    },
                    {
                        'totalDiscount': 366.28999999999996,
                        'currency': 'EUR',
                        'aviosRequired': 67831,
                        'offerAvailable': false,
                        'perPassengerDiscounts': [
                            {
                                'discount': 366.28999999999996,
                                'passengerType': 'ADT',
                                'numberOfPassengers': 1
                            }
                        ]
                    }
                ],
                'carryOnBaggageAllowances': [
                    {
                        'totalQuantity': 2,
                        'segmentIds': [
                            'Gn5TPbXQsoRFoWOp',
                            'GwIHffWIaCr5w-KE'
                        ],
                        'pieceAllowances': null
                    }
                ],
                'checkedBagAllowances': [
                    {
                        'totalQuantity': 1,
                        'pieceAllowances': [
                            {
                                'totalQuantity': 1,
                                'commercialName': 'BAG UP TO 23 KG AND 158 LCM',
                                'descriptions': [],
                                'type': 'PIECE',
                                'subcode': null
                            }
                        ],
                        'segmentIds': [
                            'Gn5TPbXQsoRFoWOp',
                            'GwIHffWIaCr5w-KE'
                        ]
                    }
                ],
                'availableServices': [],
                'selectedServices': [],
                'specialDiscountsApplied': [],
                'accrualQuote': {
                    'redemptionPoints': null,
                    'qualificationPoints': null
                },
                'offerItems': [
                    {
                        'offerItemId': 'IB6e0f0b82b9c448d487b65ba2e66ab390OP_01',
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'price': {
                            'fare': 330,
                            'tax': 36.29,
                            'total': 366.29,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'originCurrencyPrice': null,
                        'detailedTaxes': [
                            {
                                'code': 'QV',
                                'amount': 6.62,
                                'currency': 'EUR',
                                'description': 'Security',
                                'subcode': null,
                                'country': null,
                                'carrier': null
                            },
                            {
                                'code': 'OG',
                                'amount': 1.38,
                                'currency': 'EUR',
                                'description': 'Security Tax',
                                'subcode': null,
                                'country': null,
                                'carrier': null
                            },
                            {
                                'code': 'JD',
                                'amount': 28.29,
                                'currency': 'EUR',
                                'description': 'Departure Charge',
                                'subcode': null,
                                'country': null,
                                'carrier': null
                            }
                        ],
                        'reshopDetailedTaxes': [],
                        'fareComponents': [],
                        'surcharges': null
                    }
                ],
                'type': 'SHUTTLE',
                'flightRatio': null,
                'isUpsellingOffer': false
            }
        ],
        'currencies': [
            {
                'code': 'EUR',
                'description': 'Euro',
                'symbol': '€',
                'alignment': 'R',
                'groupingSeparator': ',',
                'decimalSeparator': '.',
                'decimals': 2,
                'recommendedDisplay': 'symbol'
            }
        ]
    },
    'fareData': {
        'fareRate': [],
        'totalPrice': {},
        'withoutAviosMoney': true,
        'coupons': null
    }
};
export const shuttleDigitalDataInitial = {

    'UserSegment': '2',
    'SearchCity': 'BCN',
    'SearchDest': 'BCN',
    'SearchDestName': 'Barcelona',
    'SearchCountry': 'ES',
    'SearchOrigin': 'MAD',
    'SearchOriginName': 'Madrid',
    'AdvancePurchase': 'IBOPEN',
    'LengthStay': 'IBOPEN',
    'PaxAdult': '1',
    'PaxTotal': 1,
    'ProcessStart': 'es/ES/PAHMPA',
    'FlightType': 'RT',
    'SearchOD': 'MAD,BCN',
    'SearchCountries': 'ES-ES',
    'FlightHaul': 'Corto Radio',
    'SearchType': 'Tarifa mas economica',
    'Process': 'puente aéreo',
    'Step': 'disponibilidad'
};
export const shuttleDatalayerInitial = {
    'segmento': '2',
    'SearchCity': 'BCN',
    'SearchDest': 'BCN',
    'SearchDestName': 'Barcelona',
    'fecha': 'IBOPEN-IBOPEN',
    'SearchCountry': 'ES',
    'SearchOrigin': 'MAD',
    'SearchOriginName': 'Madrid',
    'antelacionCompra': 'IBOPEN',
    'estanciaDestino': 'IBOPEN',
    'numeroAdultos': '1',
    'numeroPax': 1,
    'origenBusqueda': 'es/ES/PAHMPA',
    'tipoVuelo': 'RT',
    'trayectoBuscado': 'MAD,BCN',
    'trayectoPais': 'ES-ES',
    'flightRatio': 'Corto Radio',
    'rutaIda': 'MAD,BCN',
    'rutaVuelta': 'BCN,MAD',
    'tipoBusqueda': 'tarifaMasEconomica',
    'proceso': 'puente aéreo',
    'paso': 'disponibilidad'

};