describe('IbFareShuttleTransformer test', function () {

    var IbFareShuttleTransformer, BookingAppConstants, localStorageService, $rootScope, transform, fareRespondMadBcn3Adultredemptioncopy;

    var fareRespondMadBcn3Adult = {
        'responseId': 'Qm9va2luZ0BHVy0xNTY4Nzk5Mjc5NTU2LXQ1aFg4',
        'offers': [
            {
                'offerId': 'IB6fd3dc34d356442bb24d0d5005d85390OP',
                'price': {
                    'fare': 642,
                    'tax': 64.38,
                    'total': 706.38,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'slices': [
                    {
                        'sliceId': '1MADBCN',
                        'departureDateTime': null,
                        'arrivalDateTime': null,
                        'duration': null,
                        'stopsNumber': 0,
                        'price': {
                            'fare': 642,
                            'tax': 64.38,
                            'total': 706.38,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedPrices': [
                            {
                                'fare': 214,
                                'tax': 21.46,
                                'total': 235.46,
                                'currency': 'EUR',
                                'passengerIds': [
                                    'ADULT_01',
                                    'ADULT_02',
                                    'ADULT_03'
                                ],
                                'segmentPrices': null,
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
                                            'description': 'España'
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
                                    'fareBasis': 'YD',
                                    'seatDisplays': null,
                                    'extendedFareCode': '',
                                    'cabinDescription': 'Turista'
                                },
                                'overnight': false,
                                'id': 'GPYfyCdkjWrzE6Xq',
                                'duration': null,
                                'waitingTime': 0,
                                'providerId': '',
                                'ticketDesignator': '',
                                'accrualQuote': null,
                                'delayInformation': null,
                                'stop': null,
                                'departureDateTime': null,
                                'arrivalDateTime': null
                            }
                        ],
                        'overnight': false
                    }
                ],
                'offerExpiration': '2019-09-18T12:04:40.460+02:00',
                'onHoldOptions': [],
                'cashAviosPossibilities': [],
                'carryOnBaggageAllowances': [
                    {
                        'totalQuantity': 1,
                        'segmentIds': [
                            'GPYfyCdkjWrzE6Xq'
                        ]
                    }
                ],
                'checkedBagAllowances': [
                    {
                        'totalQuantity': 1,
                        'pieceAllowances': [
                            {
                                'totalQuantity': 1,
                                'commercialName': 'UP TO 23 KG AND 158 LCM',
                                'descriptions': [],
                                'type': 'PIECE'
                            }
                        ],
                        'segmentIds': [
                            'GPYfyCdkjWrzE6Xq'
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
                        'offerItemId': 'IB6fd3dc34d356442bb24d0d5005d85390OP_01',
                        'passengerIds': [
                            'ADULT_01',
                            'ADULT_02',
                            'ADULT_03'
                        ],
                        'price': {
                            'fare': 214,
                            'tax': 21.46,
                            'total': 235.46,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedTaxes': [
                            {
                                'code': 'QV',
                                'amount': 3.85,
                                'currency': 'EUR',
                                'description': 'Seguridad'
                            },
                            {
                                'code': 'OG',
                                'amount': 0.67,
                                'currency': 'EUR',
                                'description': 'Tasa de seguridad'
                            },
                            {
                                'code': 'JD',
                                'amount': 16.94,
                                'currency': 'EUR',
                                'description': 'Cargo por salida'
                            }
                        ],
                        'fareCalculation': null,
                        'fareComponents': []
                    }
                ],
                'type': 'SHUTTLE'
            }
        ],
        'passengers': [
            {
                'passengerId': 'ADULT_01',
                'passengerType': 'ADULT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'ADULT_02',
                'passengerType': 'ADULT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'ADULT_03',
                'passengerType': 'ADULT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            }
        ],
        'contextMetadata': {
            'language': 'es',
            'country': 'ES',
            'currencies': [
                {
                    'code': 'EUR',
                    'description': 'Euro',
                    'symbol': '€',
                    'alignment': 'L',
                    'groupingSeparator': '.',
                    'decimalSeparator': ',',
                    'decimals': 2,
                    'recommendedDisplay': 'symbol'
                }
            ]
        },
        'fareFamilyConditions': [
            {
                'cabinType': 'E',
                'cabinDescription': 'Turista',
                'commercialCode': 'YPA',
                'commercialName': 'Turista Puente Aéreo',
                'commercialNameES': 'Turista Puente Aéreo',
                'priority': 500,
                'conditions': [
                    {
                        'code': 'EQMANO',
                        'name': 'Hand baggage',
                        'text': '1 piece',
                        'units': 1,
                        'extendedInfo': {
                            'title': '1 bulto en cabina',
                            'message': '1 bulto/ 56x45x25cm',
                            'code': 'CA_EQP_MANO_10KG',
                            'conditionStatus': true,
                            'observationCode': null
                        }
                    },
                    {
                        'code': 'EQBODEGA',
                        'name': 'Baggage in hold',
                        'text': '1 piece included',
                        'units': 1,
                        'extendedInfo': {
                            'title': '1 equipaje en bodega',
                            'message': 'Incluido: 1 pieza',
                            'code': 'CA_1_PIEZAS',
                            'conditionStatus': true,
                            'observationCode': null
                        }
                    },
                    {
                        'code': 'ASIENTO',
                        'name': 'Seat  selection',
                        'text': 'Included',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Con selección de asiento',
                            'message': 'Incluido',
                            'code': 'CA_Asiento_Gratuito',
                            'conditionStatus': true,
                            'observationCode': null
                        }
                    },
                    {
                        'code': 'CAMBIO',
                        'name': 'Change',
                        'text': 'Permitted at any time',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Cambio permitido',
                            'message': 'Permitidos en cualquier momento',
                            'code': 'CA_CAMBIO SIEMPRE',
                            'conditionStatus': true,
                            'observationCode': null
                        }
                    },
                    {
                        'code': 'REEMBOLSO',
                        'name': 'refund (in each direction)',
                        'text': 'Permitted at any time',
                        'units': null,
                        'extendedInfo': {
                            'title': 'Reembolso permitido',
                            'message': 'Reembolso permitido en cualquier momento.',
                            'code': 'CA_REEMBOLSO SIEMPRE',
                            'conditionStatus': true,
                            'observationCode': null
                        }
                    }
                ],
                'observations': [],
                'conditionsPriority': [
                    'EQMANO',
                    'EQBODEGA',
                    'COMIDA',
                    'ASIENTO',
                    'CAMBIO',
                    'REEMBOLSO'
                ]
            }
        ],
        'advices': [],
        'services': [],
        'relatedContent': [
            {
                'key': 'TOTAL_PRICE',
                'value': 'Precio total, incluye tarifa aérea, <a target=\"_blank\" href=\"http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tasas_gubernamentales&market=FI&language=es\">tasas</a> (salvo las que se cobren en determinados aeropuertos en el momento de facturar), gastos de gestión, cargos del operador, y las opciones seleccionadas. Si eliges abonar el viaje con una de estas <a target=\"_blank\" href=\"http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tarjetas_empresa&market=FI&language=es\">tarjetas</a>, se aplicará un cargo adicional por reserva de un 1% del importe final en vuelos de largo radio y 2% en el resto de vuelos.'
            }
        ]
    }

    var fareRespondMadBcn3Adultredemption = {
        'responseId': 'Qm9va2luZ0BHVy0xNTY4Nzk5Mjc5NTU2LXQ1aFg4',
        'offers': [
            {
                'offerId': 'IB6fd3dc34d356442bb24d0d5005d85390OP',
                'price': {
                    'fare': 642,
                    'tax': 64.38,
                    'total': 706.38,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'slices': [
                    {
                        'sliceId': '1MADBCN',
                        'departureDateTime': null,
                        'arrivalDateTime': null,
                        'duration': null,
                        'stopsNumber': 0,
                        'price': {
                            'fare': 642,
                            'tax': 64.38,
                            'total': 706.38,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedPrices': [
                            {
                                'fare': 214,
                                'tax': 21.46,
                                'total': 235.46,
                                'currency': 'EUR',
                                'passengerIds': [
                                    'ADULT_01',
                                    'ADULT_02',
                                    'ADULT_03'
                                ],
                                'segmentPrices': null,
                                'ticketingFee': 0
                            }
                        ],
                        'overnight': false
                    }
                ],
                'offerExpiration': '2019-09-18T12:04:40.460+02:00',
                'onHoldOptions': [],
                'cashAviosPossibilities': [],
                'carryOnBaggageAllowances': [
                    {
                        'totalQuantity': 1,
                        'segmentIds': [
                            'GPYfyCdkjWrzE6Xq'
                        ]
                    }
                ],
                'checkedBagAllowances': [
                    {
                        'totalQuantity': 1,
                        'pieceAllowances': [
                            {
                                'totalQuantity': 1,
                                'commercialName': 'UP TO 23 KG AND 158 LCM',
                                'descriptions': [],
                                'type': 'PIECE'
                            }
                        ],
                        'segmentIds': [
                            'GPYfyCdkjWrzE6Xq'
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
                        'offerItemId': 'IB6fd3dc34d356442bb24d0d5005d85390OP_01',
                        'passengerIds': [
                            'ADULT_01',
                            'ADULT_02',
                            'ADULT_03'
                        ],
                        'price': {
                            'fare': 214,
                            'tax': 21.46,
                            'total': 235.46,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedTaxes': [
                            {
                                'code': 'QV',
                                'amount': 3.85,
                                'currency': 'EUR',
                                'description': 'Seguridad'
                            },
                            {
                                'code': 'OG',
                                'amount': 0.67,
                                'currency': 'EUR',
                                'description': 'Tasa de seguridad'
                            },
                            {
                                'code': 'JD',
                                'amount': 16.94,
                                'currency': 'EUR',
                                'description': 'Cargo por salida'
                            }
                        ],
                        'fareCalculation': null,
                        'fareComponents': []
                    }
                ],
                'type': 'SHUTTLE',
                'redemptionOptions': [
                    {
                        'eligible': true,
                        'totalCash': {
                            'fare': 10
                        },
                        'totalPoints': {
                            'fare': 10
                        },
                        'totalAvios': {
                            'fare': 10
                        }
                    }, {
                        'eligible': true,
                        'totalCash': {
                            'fare': 10
                        },
                        'totalPoints': {
                            'fare': 10,

                        },
                        'totalAvios': {
                            'fare': 10
                        }
                    }
                ],
                'totalPoints': {
                    'currency': 'POINTS'
                }
            }
        ],
        'passengers': [
            {
                'passengerId': 'ADULT_01',
                'passengerType': 'ADULT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'ADULT_02',
                'passengerType': 'ADULT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'ADULT_03',
                'passengerType': 'ADULT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'CHILD_01',
                'passengerType': 'CHILD',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'INFANT_01',
                'passengerType': 'INFANT',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            },
            {
                'passengerId': 'INFANT_01',
                'passengerType': 'INFANTS',
                'firstName': null,
                'surname': null,
                'frequentFlyerInfo': null
            }
        ],
        'contextMetadata': {
            'language': 'es',
            'country': 'ES',
            'currencies': [
                {
                    'code': 'EUR',
                    'description': 'Euro',
                    'symbol': '€',
                    'alignment': 'L',
                    'groupingSeparator': '.',
                    'decimalSeparator': ',',
                    'decimals': 2,
                    'recommendedDisplay': 'symbol'
                }
            ]
        },
        'advices': [],
        'services': [],
        'relatedContent': [
            {
                'key': 'TOTAL_PRICE',
                'value': 'Precio total, incluye tarifa aérea, <a target=\"_blank\" href=\"http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tasas_gubernamentales&market=FI&language=es\">tasas</a> (salvo las que se cobren en determinados aeropuertos en el momento de facturar), gastos de gestión, cargos del operador, y las opciones seleccionadas. Si eliges abonar el viaje con una de estas <a target=\"_blank\" href=\"http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tarjetas_empresa&market=FI&language=es\">tarjetas</a>, se aplicará un cargo adicional por reserva de un 1% del importe final en vuelos de largo radio y 2% en el resto de vuelos.'
            },
            {
                'key': 'TOTAL_PRICES',
                'value': 'Precio total, incluye tarifa aérea, <a target=\"_blank\" href=\"http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tasas_gubernamentales&market=FI&language=es\">tasas</a> (salvo las que se cobren en determinados aeropuertos en el momento de facturar), gastos de gestión, cargos del operador, y las opciones seleccionadas. Si eliges abonar el viaje con una de estas <a target=\"_blank\" href=\"http://prea.iberia.es/web/product.do?popup=true&AAA=true&modal=true&cntCat=Productos/INFLEG&cntId=tarjetas_empresa&market=FI&language=es\">tarjetas</a>, se aplicará un cargo adicional por reserva de un 1% del importe final en vuelos de largo radio y 2% en el resto de vuelos.'
            }
        ]
    }

    var fakeCurrencyService = {
        'getCurrencyObject': jasmine.createSpy().and.callFake(function () {
            return { alignment: 'R', code: 'EUR', decimalSeparator: ',', decimals: 2, description: 'Euro', groupingSeparator: '.', recommendedDisplay: 'symbol', symbol: '€' }
        }),
        'formatPrice': jasmine.createSpy().and.callFake(function () {
            return '15 €'
        }),
        'formatAvios': jasmine.createSpy().and.callFake(function () {
            return '15 Points'
        })
    };

    var fakefaredata = {
        'contextMetadata': {
            'language': 'es',
            'country': 'ES',
            'currencies': [
                {
                    'code': 'EUR',
                    'description': 'Euro',
                    'symbol': '€',
                    'alignment': 'R',
                    'groupingSeparator': '.',
                    'decimalSeparator': ',',
                    'decimals': 2,
                    'recommendedDisplay': 'symbol'
                }
            ]
        }
    }

    var defaultTransform = {
        'passengerInfo': {
            'adults': 0,
            'childs': 0,
            'infants': 0
        },
        'slices': [],
        'priceInfo': {
            'totalFormatter': '',
            'text': '',
        },
        'fareFamilyConditions': [],
        'marketCode': ''
    };
    var originalData = {
        'offers': [{
            'promotion': false,
            'limitedUseCoupon': false,
            'price': {
                'fare': 100
            },
            'contextMetadata': {
                'language': 'es',
                'country': 'ES',
                'currencies': [
                    {
                        'code': 'EUR',
                        'description': 'Euro',
                        'symbol': '€',
                        'alignment': 'L',
                        'groupingSeparator': '.',
                        'decimalSeparator': ',',
                        'decimals': 2,
                        'recommendedDisplay': 'symbol'
                    }
                ]
            },
        }],
        'passengers': [
            {
                'passengerId': 'INFANT_01',
                'passengerType': 'INFANT',
            },
            {
                'passengerId': 'INFANT_02',
                'passengerType': 'INFANT',
            },
            {
                'passengerId': 'INFANT_03',
                'passengerType': 'INFANT',
            },

        ],
        'slices': [],
        'priceInfo': {
            'totalFormatter': '',
            'text': '',
        },
        'fareFamilyConditions': [],
        'contextMetadata': {
            'language': 'es',
            'country': 'ES',
            'currencies': [
                {
                    'code': 'EUR',
                    'description': 'Euro',
                    'symbol': '€',
                    'alignment': 'L',
                    'groupingSeparator': '.',
                    'decimalSeparator': ',',
                    'decimals': 2,
                    'recommendedDisplay': 'symbol'
                }
            ]
        }
    };

    var fakebookingUrlParams = {
        adult: '1',
        child: '1'
    }
    let mockFareData={
        offers:[
            {
                limitedUseCoupon: true,
                redemptionOptions:[
                    {
                        eligible:true,
                        totalPoints: {
                            fare: 2
                        },
                        totalCash: {
                            fare: 1
                        },
                        optionId: "id",
                        taxes: {
                            price: {
                                fare: 0,
                                tax: 98.78,
                                total: 98.78,
                                currency: 'EUR',
                                ticketingFee: 0
                            },
                            detailedTaxes: [
                                'YRVB',
                                'AYSE',
                                'USAP',
                                'XF'
                            ]
                        }

                    }
                ],
                price:{
                    tax:1
                },
                promotion:{
                    discountedRedemptionOptions:[
                        {
                            eligible:true,
                            discountedPrice:{
                                totalPoints:{
                                    fare: 2
                                },
                                totalCash:{
                                    fare: 1
                                },
                                basePrice:{
                                    totalPoints:{

                                    },
                                    totalCash:{

                                    },
                                }
                            },
                            optionId: "id",
                            offerItems: {},
                            taxes: {
                                price: {
                                    fare: 0,
                                    tax: 98.78,
                                    total: 98.78,
                                    currency: 'EUR',
                                    ticketingFee: 0
                                },
                                detailedTaxes: [
                                    'YRVB',
                                    'AYSE',
                                    'USAP',
                                    'XF'
                                ]
                            }
                        }
                    ]
                },
                limitedUseCoupon: [
                    {
                        couponDetails:[
                            {
                                discount: {},
                                offerList: {}
                            }
                        ],
                        discountedRedemptionOptions:[
                            {
                                basePrice:{
                                    totalPoints:{
                                        fare:2
                                    }
                                },
                                discountedPrice: {
                                    totalPoints:{
                                        fare:1
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    let mockFareData2={
        offers:[
            {
                limitedUseCoupon: true,
                price:{
                    tax:1
                },
                promotion:{
                    discountedRedemptionOptions:[
                        {
                            eligible:true,
                            discountedPrice:{
                                totalPoints:{
                                    fare: 2
                                },
                                totalCash:{
                                    fare: 1
                                },
                                basePrice:{
                                    totalPoints:{

                                    },
                                    totalCash:{

                                    },
                                }
                            },
                            optionId: "id",
                            offerItems: {},
                            basePrice:{
                                totalPoints:{
                                    fare: 2
                                },
                                totalCash:{
                                    fare:1
                                },
                            }
                        }
                    ]
                },
                limitedUseCoupon: [
                    {
                        couponDetails:[
                            {
                                discount: {},
                                offerList: {}
                            }
                        ],
                        discountedRedemptionOptions:[
                            {
                                basePrice:{
                                    totalPoints:{
                                        fare:2
                                    }
                                },
                                discountedPrice: {
                                    totalPoints:{
                                        fare:1
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    let mockCommercialData= {
        currency:{
            groupingSeparator: ""
        }
    };
    const fakeBookingUtilService = {
        setSelectedTripInfoinStorage: jasmine.createSpy('setSelectedTripInfoinStorage')
    }

    beforeEach(function () {
        angular.mock.module('ib-shuttle-module', 'LocalStorageModule', 'ib-commons-utils-module', function ($provide) {
            $provide.value('BookingAppConstants', {
                passengerTypes: {
                    'Default': 'DEFAULT',
                    'senior': 'SENIOR',
                    'adult': 'ADULT',
                    'young': 'YOUTH',
                    'child': 'CHILD',
                    'infant': 'INFANT',
                    'SPECIAL_NEEDS': 'specialNeed'
                }
            });
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('BookingUtilService', fakeBookingUtilService);


        });
        inject(function (_$rootScope_, _BookingAppConstants_, _IbFareShuttleTransformer_, _localStorageService_) {
            $rootScope = _$rootScope_;
            IbFareShuttleTransformer = _IbFareShuttleTransformer_;
            BookingAppConstants = _BookingAppConstants_;
            localStorageService = _localStorageService_;
        });
        fakeBookingUtilService.setSelectedTripInfoinStorage.calls.reset();

    });

    describe('when call to transform with errors', function () {

        it('when responde is null', function (done) {
            var data, transform;
            expect(IbFareShuttleTransformer.transform).toBeDefined();
            transform = IbFareShuttleTransformer.transform(data);
            expect(transform).toEqual(defaultTransform);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).not.toHaveBeenCalled();
            done();
        });

        it('when responde is empty object', function (done) {
            var data = {}, transform;
            expect(IbFareShuttleTransformer.transform).toBeDefined()
            transform = IbFareShuttleTransformer.transform(data);
            expect(transform).toEqual(defaultTransform);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).not.toHaveBeenCalled();
            done();
        });

        xit('when all users is zero', function (done) {
            originalData = {
                'offers': [],
                'passengers': [
                ],
                'slices': [],
                'priceInfo': {
                    'totalFormatter': '',
                    'text': '',
                },
                'fareFamilyConditions': [],
                'contextMetadata': {
                    'language': 'es',
                    'country': 'ES',
                    'currencies': [
                        {
                            'code': 'EUR',
                            'description': 'Euro',
                            'symbol': '€',
                            'alignment': 'R',
                            'groupingSeparator': '.',
                            'decimalSeparator': ',',
                            'decimals': 2,
                            'recommendedDisplay': 'symbol'
                        }
                    ]
                }
            };
            localStorageService.set('fareData', fakefaredata)
            transform = IbFareShuttleTransformer.transform(originalData);
            expect(transform.passengerInfo.adults).toEqual(0);
            expect(transform.passengerInfo.childs).toEqual(0);
            expect(transform.passengerInfo.infants).toEqual(0);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });

        it('when only are infants', function (done) {
            transform = IbFareShuttleTransformer.transform(originalData);
            expect(transform.passengerInfo.adults).toEqual(0);
            expect(transform.passengerInfo.childs).toEqual(0);
            expect(transform.passengerInfo.infants).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });


        it('when data are null', function (done) {
            transform = IbFareShuttleTransformer.transform(originalData);
            expect(transform.passengerInfo.adults).toEqual(0);
            expect(transform.passengerInfo.childs).toEqual(0);
            expect(transform.passengerInfo.infants).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();

            done();
        });

        it('when data is complete', function (done) {
            transform = IbFareShuttleTransformer.transform(fareRespondMadBcn3Adult);
            expect(transform.slices.length).toBeGreaterThan(0);
            expect(transform.priceInfo.totalFormatter).not.toBeNull();
            expect(transform.passengerInfo.adults).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });

        it('when data is complete in flow redemption with iberia plus login', function (done) {
            localStorageService.remove('bookingUrlParams');
            $rootScope.isPointsOBFlow = true;
            localStorageService.set('bookingUrlParams', fakebookingUrlParams);
            transform = IbFareShuttleTransformer.transform(fareRespondMadBcn3Adultredemption);
            expect(transform.slices.length).toEqual(0);
            expect(transform.priceInfo.totalFormatter).not.toBeNull();
            expect(transform.passengerInfo.adults).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });

        it('when data is complete in flow redemption with business plus login ', function (done) {
            localStorageService.remove('bookingUrlParams');
            $rootScope.isPointsOBFlow = false;
            localStorageService.set('bookingUrlParams', fakebookingUrlParams);
            transform = IbFareShuttleTransformer.transform(fareRespondMadBcn3Adultredemption);
            expect(transform.slices.length).toEqual(0);
            expect(transform.priceInfo.totalFormatter).not.toBeNull();
            expect(transform.passengerInfo.adults).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });

        it('when data is complete in flow redemption without bookingUrlParams with iberia plus login', function (done) {
            var copyData = angular.copy(fareRespondMadBcn3Adultredemption);
            $rootScope.isPointsOBFlow = false;
            localStorageService.remove('bookingUrlParams');
            localStorageService.set('bookingUrlParams', {});
            copyData.offers[0].redemptionOptions[0].totalPoints = undefined;
            copyData.offers[0].redemptionOptions[1].totalPoints = undefined;
            transform = IbFareShuttleTransformer.transform(copyData);
            expect(transform.slices.length).toEqual(0);
            expect(transform.priceInfo.totalFormatter).not.toBeNull();
            expect(transform.passengerInfo.adults).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });

        it('when data is complete in flow redemption without bookingUrlParams with business plus login', function (done) {
            $rootScope.isPointsOBFlow = true;
            localStorageService.remove('bookingUrlParams');
            localStorageService.set('bookingUrlParams', {});
            transform = IbFareShuttleTransformer.transform(fareRespondMadBcn3Adultredemption);
            expect(transform.slices.length).toEqual(0);
            expect(transform.priceInfo.totalFormatter).not.toBeNull();
            expect(transform.passengerInfo.adults).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });

        it('when data is complete in flow redemption withou offer redemtion eligible with iberia plus login', function (done) {
            $rootScope.isPointsOBFlow = false;
            localStorageService.remove('bookingUrlParams');
            fareRespondMadBcn3Adultredemptioncopy = angular.copy(fareRespondMadBcn3Adultredemption);
            fareRespondMadBcn3Adultredemptioncopy.offers[0].redemptionOptions[0].eligible = false;
            fareRespondMadBcn3Adultredemptioncopy.offers[0].redemptionOptions[1].eligible = false;
            localStorageService.set('bookingUrlParams', fakebookingUrlParams);
            transform = IbFareShuttleTransformer.transform(fareRespondMadBcn3Adultredemptioncopy);
            expect(transform.slices.length).toEqual(0);
            expect(transform.priceInfo.totalFormatter).not.toBeNull();
            expect(transform.passengerInfo.adults).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });

        it('when data is complete in flow redemption withou offer redemtion eligible with business plus login', function (done) {
            $rootScope.isPointsOBFlow = true;
            localStorageService.remove('bookingUrlParams');
            fareRespondMadBcn3Adultredemptioncopy = angular.copy(fareRespondMadBcn3Adultredemption);
            fareRespondMadBcn3Adultredemptioncopy.offers[0].redemptionOptions[0].eligible = false;
            fareRespondMadBcn3Adultredemptioncopy.offers[0].redemptionOptions[1].eligible = false;
            localStorageService.set('bookingUrlParams', fakebookingUrlParams);
            transform = IbFareShuttleTransformer.transform(fareRespondMadBcn3Adultredemptioncopy);
            expect(transform.slices.length).toEqual(0);
            expect(transform.priceInfo.totalFormatter).not.toBeNull();
            expect(transform.passengerInfo.adults).toEqual(3);
            expect(fakeBookingUtilService.setSelectedTripInfoinStorage).toHaveBeenCalled();
            done();
        });
    });

    describe('when we want to prepare data for booking header', function () {
        it('the localstorage is update', function (done) {
            var mockBookingParamsMADOneWayBusiness2ADT = { tripType: '1', arrival: 'MAD', destination: 'BCN', beginFareType: 'B', adult: 2 };
            var mockData = {
                'slices': [{
                    'originCityCode': 'MAD',
                    'originCity': 'Madrid',
                    'destinationCityCode': 'BCN',
                    'destinationCity': 'Barcelona'
                }],
                'passengerInfo': {
                    'adults': 2,
                    'childs': 1,
                    'infants': 1
                }
            };
            var expectOriginDestination = {
                'originCity':
                {
                    'code': mockData.slices[0].originCityCode,
                    'description': mockData.slices[0].originCity
                },
                'destinationCity': {
                    'code': mockData.slices[0].destinationCityCode,
                    'description': mockData.slices[0].destinationCity,
                },
                'dates': {
                    'outboundFlight': mockBookingParamsMADOneWayBusiness2ADT.beginYear + '-' + mockBookingParamsMADOneWayBusiness2ADT.beginMonth + '-' + mockBookingParamsMADOneWayBusiness2ADT.beginDay,
                    'formatedOutboundFlight': mockBookingParamsMADOneWayBusiness2ADT.beginYear + '-' + mockBookingParamsMADOneWayBusiness2ADT.beginMonth + '-' + mockBookingParamsMADOneWayBusiness2ADT.beginDay + 'T00:00:00.000Z',
                    'returnFlight': mockBookingParamsMADOneWayBusiness2ADT.endYear + '-' + mockBookingParamsMADOneWayBusiness2ADT.endMonth + '-' + mockBookingParamsMADOneWayBusiness2ADT.endDay,
                    'formatedReturnFlight': mockBookingParamsMADOneWayBusiness2ADT.endYear + '-' + mockBookingParamsMADOneWayBusiness2ADT.endMonth + '-' + mockBookingParamsMADOneWayBusiness2ADT.endDay + 'T00:00:00.000Z'
                }, 'passengers': mockData.passengerInfo.adults + mockData.passengerInfo.childs + mockData.passengerInfo.infants
            }
            localStorageService.set('bookingUrlParams', mockBookingParamsMADOneWayBusiness2ADT);
            IbFareShuttleTransformer.processHeaderData(mockData);
            expect(localStorageService.get('originDestination'), expectOriginDestination);
            done();
        });
    });
    xdescribe('when transformRedemptionOffers is called', function () {
        it('and doesnt have promotions', function (done) {
            var mockBookingParamsMADOneWayBusiness2ADT = { tripType: '1', arrival: 'MAD', destination: 'BCN', beginFareType: 'B', adult: 2 };
            localStorageService.set('bookingUrlParams', mockBookingParamsMADOneWayBusiness2ADT);
            localStorageService.set('commercialData', mockCommercialData);
            let returnData = IbFareShuttleTransformer.processOffersItems(mockFareData);
            expect(returnData.fareRate).toEqual([{avios:{fare:2},cash:{fare:1},aviosWithoutDiscount:{fare:2},cashWithoutDiscount:{fare:1},fareCashPerPassenger: 0.5,fareAviosPerPassenger: 1,formatPrice: '15 €',formatAvios: '15 Points',formatAvios: '15 Points',formatOldPrice: '',formatOldAvios: '',eligible: true,selected: true,redemptionOptionId: 'id', offerItems: undefined}]);
            expect(returnData.totalPrice).toEqual({fareCashPerPassenger: 0.5,fareAviosPerPassenger: 1,tax: 1,redemptionOptionId: 'id',price: { totalCash: '15 €', totalAvios: '15 Points' },oldPriceWithoutDiscount: { totalCash: null, totalAvios: null },promotionApplied: false,couponApplied: false});
            expect(returnData.withoutAviosMoney).toEqual(false);
            expect(returnData.coupons).toEqual([{discount:50,offerList:[{basePrice:{totalPoints:{fare:2}},discountedPrice:{totalPoints:{fare:1}}}]}]);
            done();
        });
        it('and have promotions', function (done) {
            var mockBookingParamsMADOneWayBusiness2ADT = { tripType: '1', arrival: 'MAD', destination: 'BCN', beginFareType: 'B', adult: 2 };
            localStorageService.set('bookingUrlParams', mockBookingParamsMADOneWayBusiness2ADT);
            localStorageService.set('commercialData', mockCommercialData);
            let returnData = IbFareShuttleTransformer.processOffersItems(mockFareData2);
            expect(returnData.fareRate).toEqual([{avios:{fare:2},cash:{fare:1},aviosWithoutDiscount:{fare:2},cashWithoutDiscount:{fare:1},fareCashPerPassenger: 0.5,fareAviosPerPassenger: 1,formatPrice: '15 €',formatAvios: '15 Points',formatAvios: '15 Points',formatOldPrice: '15 €',formatOldAvios: '15 Points',eligible: true,selected: true,redemptionOptionId: 'id', offerItems: undefined}]);
            expect(returnData.totalPrice).toEqual({fareCashPerPassenger: 0.5,fareAviosPerPassenger: 1,tax: 1,redemptionOptionId: 'id',price: { totalCash: '15 €', totalAvios: '15 Points' },oldPriceWithoutDiscount: { totalCash: '15 €', totalAvios: '15 Points' },promotionApplied: true,couponApplied: false});
            expect(returnData.withoutAviosMoney).toEqual(false);
            expect(returnData.coupons).toEqual([{discount:50,offerList:[{basePrice:{totalPoints:{fare:2}},discountedPrice:{totalPoints:{fare:1}}}]}]);
            done();
        });
    });
    describe('when transformRedemptionONBOffers is called', function () {
        it('', function (done) {
            var mockBookingParamsMADOneWayBusiness2ADT = { tripType: '1', arrival: 'MAD', destination: 'BCN', beginFareType: 'B', adult: 2 };
            localStorageService.set('bookingUrlParams', mockBookingParamsMADOneWayBusiness2ADT);
            localStorageService.set('commercialData', mockCommercialData);
            let returnData = IbFareShuttleTransformer.transformRedemptionONBOffers(mockFareData);
            expect(returnData.fareRate).toEqual([{ points: { fare: 2 }, cash: { fare: 1 }, fareCashPerPassenger: 0.5, farePointsPerPassenger: 1, formatPrice: '15 €', formatAvios: '15 Points', eligible: true, redemptionOptionId: 'id', selected: true, tax: 98.78, taxPerPassenger: 49.39 }]);
            expect(returnData.totalPrice).toEqual({ fareCashPerPassenger: 0.5, farePointsPerPassenger: 1, tax: 1, taxPerPassenger: 49.39, redemptionOptionId: 'id',price:{ totalCash: '15 €', totalPoints: '15 Points' },totalPoints:2});
            expect(returnData.withoutAviosMoney).toEqual(false);
            expect(returnData.coupons).toEqual([{discount:50,offerList:[{basePrice:{totalPoints:{fare:2}},discountedPrice:{totalPoints:{fare:1}}}]}]);
            done();
        });
    });

});
