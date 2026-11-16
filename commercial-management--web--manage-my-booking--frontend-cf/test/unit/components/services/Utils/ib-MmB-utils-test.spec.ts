import { StorageServiceMock } from '@test/unit/utils/StorageServiceMock';
import angular from 'angular';

describe('MmBUtilService Test', () => {
    let rootScope, MmBUtilService, localStorageService, window, $sce, cookies, filter, CommonsSessionStorageService;
    let data = {fareFamily: 'test'};
    let returnedInfo;
    const fakeSessionStorage: StorageServiceMock = new StorageServiceMock();
    let fakeSegment = {
        'id': '1',
        'type': 'CONFIRMED',
        'flown': false,
        'ckiStatus': {
            'code': 'UNCHECKABLE',
            'message': 'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.'
        },
        'departureDateTime': '2017-06-12 17:30',
        'transformedDepartureDate': {
            'dateTime': '17:30',
            'weekDay': 'WEEKDAY_MONDAY',
            'day': 12,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': '2017-06-12T15:30:00.000Z'
        },
        'transformedArrivalDate': {
            'dateTime': '18:45',
            'weekDay': 'WEEKDAY_MONDAY',
            'day': 12,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': '2017-06-12T16:45:00.000Z'
        },
        'segment': {
            'companyURL': '../../content-mmb/iconos/aerolineas/logo_pos_IB.svg',
            'companyDisabledURL': '../../content-mmb/iconos/aerolineas/logo_desact_IB.svg'
        },
        'cabinClass': {
            'rbd': 'Y',
            'bookingClass': 'ECONOMY',
            'description': 'Turista',
            'remainingSeats': 0,
            'fareFamily': 'TFLESEU'
        },
        'sliceId': 'SHUTTLE_01',
        'flight': {
            'marketingCarrier': { 'code': 'VY', 'name': 'vueling' },
            'operationalCarrier': { 'code': 'VY', 'name': 'vueling' },
            'marketingFlightNumber': '22',
            'operationalFlightNumber': '22'
        }
    };

    let fakeFareFamily = [
        {
            'cabinType': 'E',
            'cabinDescription': 'Turista',
            'commercialCode': 'TFLESEU',
            'commercialName': 'Flexible',
            'commercialNameES': 'Flexible',
            'priority': 500,
            'conditions': [
                {
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'text': '1 bulto',
                    'extendedInfo': {
                        'title': '1 bulto en cabina',
                        'message': '<a href=\'http://prea.iberia.es/web/product.do?cntCat=Productos/EQUIMA&cntId=EQUIMA&popup=true&AAA=true&market=ES&language=es\'>1 bulto/ 56x45x25cm</a>',
                        'conditionStatus': true
                    }
                }
            ]
        }, {
            'cabinType': 'E',
            'cabinDescription': 'Turista',
            'commercialCode': 'test',
            'commercialName': 'Flexible',
            'commercialNameES': 'Flexible',
            'priority': 500,
            'conditions': [
                {
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'text': '1 bulto',
                    'extendedInfo': {
                        'title': '1 bulto en cabina',
                        'message': '<a href=\'http://prea.iberia.es/web/product.do?cntCat=Productos/EQUIMA&cntId=EQUIMA&popup=true&AAA=true&market=ES&language=es\'>1 bulto/ 56x45x25cm</a>',
                        'conditionStatus': true
                    }
                }
            ]
        }

    ];

    let fakeFareFamilyConditions = {
        'TFLESEU': {
            'cabinType': 'E',
            'cabinDescription': 'Turista',
            'commercialCode': 'TFLESEU',
            'commercialName': 'Flexible',
            'commercialNameES': 'Flexible',
            'priority': 500,
            'conditions': [
                {
                    'code': 'EQMANO',
                    'name': 'Equipaje de mano',
                    'text': '1 bulto',
                    'extendedInfo': {
                        'title': '1 bulto en cabina',
                        'message': '<a href=\'http://prea.iberia.es/web/product.do?cntCat=Productos/EQUIMA&cntId=EQUIMA&popup=true&AAA=true&market=ES&language=es\'>1 bulto/ 56x45x25cm</a>',
                        'conditionStatus': true
                    }
                }
            ]
        }
    };
    let mockOrderItemSummaryModel = [
        {
            'type': 'flight',
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'bookingReferences': [
                {
                    'provider': 'IB',
                    'reference': 'KZHD4'
                }
            ],
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'sliceIds': [
                'BIOMAD20210625092500'
            ],
            'passengerPrices': [
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                },
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                }
            ]
        }
    ];

    let mockOrderItemSummaryModelBaggage = [
        {
            'type': 'flight',
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'bookingReferences': [
                {
                    'provider': 'IB',
                    'reference': 'KZHD4'
                }
            ],
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'sliceIds': [
                'BIOMAD20210625092500'
            ],
            'passengerPrices': [
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                }
            ]
        },
        {
            'type': 'baggage',
            'amount' : 33,
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'sliceId': 'BIOMAD20210625092500',
        },
        {
            'type': 'baggage',
            'amount' : 33,
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'sliceId': 'BIOMAD20210625092500',
        },
        {
            'type': 'baggage',
            'amount' : 33,
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'sliceId': 'BIOMAD20210625092500',
        }
    ];

    let mockOrderItemSummaryModelSeat = [
        {
            'type': 'flight',
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'bookingReferences': [
                {
                    'provider': 'IB',
                    'reference': 'KZHD4'
                }
            ],
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'sliceIds': [
                'BIOMAD20210625092500'
            ],
            'passengerPrices': [
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                }
            ]
        },
        {
            'type': 'seat',
            'segmentId' :'IB042320210625',
            'price': {
                'fare': 10
            }
        },
        {
            'type': 'seat',
            'segmentId' :'IB042320210625',
            'price': {
                'fare': 10
            }
        },
        {
            'type': 'seat',
            'segmentId' :'IB042320210625',
            'price': {
                'fare': 10
            }
        },
    ];
    let mockOrderItemSummaryModelWithPiorityBoarding = [
        {
            'type': 'flight',
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'bookingReferences': [
                {
                    'provider': 'IB',
                    'reference': 'KZHD4'
                }
            ],
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'sliceIds': [
                'BIOMAD20210625092500'
            ],
            'passengerPrices': [
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                }
            ]
        },
        {
            'type':'priorityboarding',
            'segmentId' :'IB042320210625',
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
        },
        {
            'type':'priorityboarding',
            'segmentId' :'IB042320210625',
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
        }
    ];
    let mockOrderItemSummaryModelWithFlexibility = [
        {
            'type': 'flight',
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'bookingReferences': [
                {
                    'provider': 'IB',
                    'reference': 'KZHD4'
                }
            ],
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'sliceIds': [
                'BIOMAD20210625092500'
            ],
            'passengerPrices': [
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                }
            ]
        },
        {
            'type': 'flexibilityondemand',
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'subtype': 'IDK'
        },
    ];
    let mockOrderItemSummaryModelWithBaggage = [
        {
            'type': 'flight',
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'bookingReferences': [
                {
                    'provider': 'IB',
                    'reference': 'KZHD4'
                }
            ],
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'sliceIds': [
                'BIOMAD20210625092500'
            ],
            'passengerPrices': [
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                }
            ]
        },
        {
            'type': 'baggage',
            'amount' : 33,
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'sliceId': 'BIOMAD20210625092500',
        },
        {
            'type': 'baggage',
            'amount' : 33,
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'sliceId': 'BIOMAD20210625092500',
        },
        {
            'type': 'baggage',
            'amount' : 33,
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'sliceId': 'BIOMAD20210625092500',
        },
    ];
    let mockOrderItemSummaryModelWithSpecialEquipment = [
        {
            'type': 'flight',
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'bookingReferences': [
                {
                    'provider': 'IB',
                    'reference': 'KZHD4'
                }
            ],
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'sliceIds': [
                'BIOMAD20210625092500'
            ],
            'passengerPrices': [
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                }
            ]
        },
        {
            'type': 'specialequipment',
            'sliceId': 'BIOMAD20210625092500',
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            }
        },
        {
            'type': 'specialequipment',
            'sliceId': 'BIOMAD20210625092500',
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            }
        },
    ];
    let mockOrderItemSummaryModelWithSeat = [
        {
            'type': 'flight',
            'orderItemId': 'IBc46f896e8208485b90b519af5561e8d5OP_01',
            'bookingReferences': [
                {
                    'provider': 'IB',
                    'reference': 'KZHD4'
                }
            ],
            'price': {
                'fare': 33,
                'tax': 10.71,
                'total': 43.71,
                'currency': 'EUR',
                'ticketingFee': 0
            },
            'sliceIds': [
                'BIOMAD20210625092500'
            ],
            'passengerPrices': [
                {
                    'fareCalculation': 'BIO IB MAD33.00EUR33.00END',
                    'passengerId': 'ADULT_01',
                    'price': {
                        'fare': 33,
                        'tax': 10.71,
                        'total': 43.71,
                        'currency': 'EUR',
                        'ticketingFee': 0
                    },
                    'segmentPrices': [
                        {
                            'price': null,
                            'fareCode': 'ADNOB4',
                            'segmentsIds': [
                                'IB042320210625'
                            ],
                            'ticketDesignator': '',
                            'penalties': []
                        }
                    ],
                    'taxes': [
                        {
                            'code': 'JD',
                            'amount': 6.31,
                            'currency': 'EUR',
                            'description': 'Cargo por salida',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'OG',
                            'amount': 0.68,
                            'currency': 'EUR',
                            'description': 'Tasa de seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        },
                        {
                            'code': 'QV',
                            'amount': 3.72,
                            'currency': 'EUR',
                            'description': 'Seguridad',
                            'subcode': null,
                            'country': null,
                            'carrier': null
                        }
                    ],
                    'orderItemPaymentInfos': []
                }
            ]
        },
        {
            'type': 'seat',
            'segmentId' :'IB042320210625',
            'price': {
                'fare': 10
            }
        },
        {
            'type': 'seat',
            'segmentId' :'IB042320210625',
            'price': {
                'fare': 10
            }
        },
    ];
    let mockSliceModelSummaryModel = [
        {
            'sliceId': 'BIOMAD20210625092500',
            'type': 'REGULAR',
            'departureDateTime': '2021-06-25 09:25',
            'arrivalDateTime': '2021-06-25 10:35',
            'duration': 70,
            'stopsNumber': 0,
            'detailedPrices': [
                {
                    'fare': 0,
                    'currency': null,
                    'passengerIds': [
                        'ADULT_01'
                    ],
                    'segmentPrices': []
                }
            ],
            'segments': [
                {
                    'type': 'CONFIRMED',
                    'mmbAllowed': true,
                    'ckiStatus': {
                        'code': 'CHECKABLE',
                        'message': null
                    },
                    'noShow': false,
                    'flyNow': false,
                    'flown': false,
                    'departure': {
                        'code': 'BIO',
                        'name': 'AIRPORT',
                        'terminal': null,
                        'city': {
                            'code': 'BIO',
                            'description': 'Bilbao',
                            'countryCode': 'ES',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
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
                    'departureCity': {
                        'code': 'BIO',
                        'description': 'Bilbao',
                        'countryCode': 'ES',
                        'timeZone': 'Europe/Madrid'
                    },
                    'arrivalCity': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'timeZone': 'Europe/Madrid'
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
                        'marketingFlightNumber': '0423',
                        'operationalFlightNumber': '0423',
                        'operationalDisclosure': 'IB',
                        'aircraft': {
                            'code': '32A',
                            'description': 'Airbus A320'
                        }
                    },
                    'cabin': {
                        'rbd': 'A',
                        'description': '',
                        'remainingSeats': 0,
                        'fareFamily': 'TBAESES',
                        'code': 'R',
                        'type': 'ECONOMY',
                        'bookingClass': 'ECONOMY'
                    },
                    'overnight': false,
                    'id': 'IB042320210625',
                    'duration': 70,
                    'waitingTime': 0,
                    'operatorLocator': null,
                    'stop': null,
                    'departureDateTime': '2021-06-25 09:25',
                    'departureUtcDateTime': '2021-06-25T07:25:00.000',
                    'arrivalDateTime': '2021-06-25 10:35',
                    'arrivalUtcDateTime': '2021-06-25T08:35:00.000',
                    'status': {
                        'code': 'HK',
                        'description': 'Confirmado'
                    }
                }
            ],
            'overnight': false,
            'ancillaries' :[
                {
                    'type' : 'BGA',
                    'unitaryPrice' : 1,
                    'price' : 33,
                    'amount': '',
                    'priceTotalFormatted' : ''
                }
            ]
        },
        {
            'sliceId': 'BIOMAD20210625092501',
            'type': 'REGULAR',
            'departureDateTime': '2021-06-25 09:25',
            'arrivalDateTime': '2021-06-25 10:35',
            'duration': 70,
            'stopsNumber': 0,
            'detailedPrices': [
                {
                    'fare': 0,
                    'currency': null,
                    'passengerIds': [
                        'ADULT_01'
                    ],
                    'segmentPrices': []
                }
            ],
            'segments': [
                {
                    'type': 'CONFIRMED',
                    'mmbAllowed': true,
                    'ckiStatus': {
                        'code': 'CHECKABLE',
                        'message': null
                    },
                    'noShow': false,
                    'flyNow': false,
                    'flown': false,
                    'departure': {
                        'code': 'BIO',
                        'name': 'AIRPORT',
                        'terminal': null,
                        'city': {
                            'code': 'BIO',
                            'description': 'Bilbao',
                            'countryCode': 'ES',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
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
                    'departureCity': {
                        'code': 'BIO',
                        'description': 'Bilbao',
                        'countryCode': 'ES',
                        'timeZone': 'Europe/Madrid'
                    },
                    'arrivalCity': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'timeZone': 'Europe/Madrid'
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
                        'marketingFlightNumber': '0423',
                        'operationalFlightNumber': '0423',
                        'operationalDisclosure': 'IB',
                        'aircraft': {
                            'code': '32A',
                            'description': 'Airbus A320'
                        }
                    },
                    'cabin': {
                        'rbd': 'A',
                        'description': '',
                        'remainingSeats': 0,
                        'fareFamily': 'TBAESES',
                        'code': 'R',
                        'type': 'ECONOMY',
                        'bookingClass': 'ECONOMY'
                    },
                    'overnight': false,
                    'id': 'IB042320210625',
                    'duration': 70,
                    'waitingTime': 0,
                    'operatorLocator': null,
                    'stop': null,
                    'departureDateTime': '2021-06-25 09:25',
                    'departureUtcDateTime': '2021-06-25T07:25:00.000',
                    'arrivalDateTime': '2021-06-25 10:35',
                    'arrivalUtcDateTime': '2021-06-25T08:35:00.000',
                    'status': {
                        'code': 'HK',
                        'description': 'Confirmado'
                    }
                }
            ],
            'overnight': false,
            'ancillaries' :[
                {
                    'type' : 'BGA',
                    'unitaryPrice' : 1,
                    'price' : 33,
                    'amount': '',
                    'priceTotalFormatted' : ''
                }
            ]
        }
    ];
    let mockIsVoucher = [
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
    ];
    let mockSliceModel = [
        {
            'sliceId': 'BIOMAD20210625092500',
            'type': 'REGULAR',
            'departureDateTime': '2021-06-25 09:25',
            'arrivalDateTime': '2021-06-25 10:35',
            'duration': 70,
            'stopsNumber': 0,
            'detailedPrices': [
                {
                    'fare': 0,
                    'currency': null,
                    'passengerIds': [
                        'ADULT_01'
                    ],
                    'segmentPrices': []
                }
            ],
            'segments': [
                {
                    'type': 'CONFIRMED',
                    'mmbAllowed': true,
                    'ckiStatus': {
                        'code': 'CHECKABLE',
                        'message': null
                    },
                    'noShow': false,
                    'flyNow': false,
                    'flown': false,
                    'departure': {
                        'code': 'BIO',
                        'name': 'AIRPORT',
                        'terminal': null,
                        'city': {
                            'code': 'BIO',
                            'description': 'Bilbao',
                            'countryCode': 'ES',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
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
                    'departureCity': {
                        'code': 'BIO',
                        'description': 'Bilbao',
                        'countryCode': 'ES',
                        'timeZone': 'Europe/Madrid'
                    },
                    'arrivalCity': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'timeZone': 'Europe/Madrid'
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
                        'marketingFlightNumber': '0423',
                        'operationalFlightNumber': '0423',
                        'operationalDisclosure': 'IB',
                        'aircraft': {
                            'code': '32A',
                            'description': 'Airbus A320'
                        }
                    },
                    'cabin': {
                        'rbd': 'A',
                        'description': '',
                        'remainingSeats': 0,
                        'fareFamily': 'TBAESES',
                        'code': 'R',
                        'type': 'ECONOMY',
                        'bookingClass': 'ECONOMY'
                    },
                    'overnight': false,
                    'id': 'IB042320210625',
                    'duration': 70,
                    'waitingTime': 0,
                    'operatorLocator': null,
                    'stop': null,
                    'departureDateTime': '2021-06-25 09:25',
                    'departureUtcDateTime': '2021-06-25T07:25:00.000',
                    'arrivalDateTime': '2021-06-25 10:35',
                    'arrivalUtcDateTime': '2021-06-25T08:35:00.000',
                    'status': {
                        'code': 'HK',
                        'description': 'Confirmado'
                    }
                }
            ],
            'overnight': false,
            'ancillaries' :[
                {
                    'type' : 'BGA',
                    'unitaryPrice' : 1,
                    'price' : 33,
                    'amount': '',
                    'priceTotalFormatted' : ''
                }
            ]
        },
        {
            'sliceId': 'BIOMAD20210625092500',
            'type': 'REGULAR',
            'departureDateTime': '2021-06-25 09:25',
            'arrivalDateTime': '2021-06-25 10:35',
            'duration': 70,
            'stopsNumber': 0,
            'detailedPrices': [
                {
                    'fare': 0,
                    'currency': null,
                    'passengerIds': [
                        'ADULT_01'
                    ],
                    'segmentPrices': []
                }
            ],
            'segments': [
                {
                    'type': 'CONFIRMED',
                    'mmbAllowed': true,
                    'ckiStatus': {
                        'code': 'CHECKABLE',
                        'message': null
                    },
                    'noShow': false,
                    'flyNow': false,
                    'flown': false,
                    'departure': {
                        'code': 'BIO',
                        'name': 'AIRPORT',
                        'terminal': null,
                        'city': {
                            'code': 'BIO',
                            'description': 'Bilbao',
                            'countryCode': 'ES',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
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
                    'departureCity': {
                        'code': 'BIO',
                        'description': 'Bilbao',
                        'countryCode': 'ES',
                        'timeZone': 'Europe/Madrid'
                    },
                    'arrivalCity': {
                        'code': 'MAD',
                        'description': 'Madrid',
                        'countryCode': 'ES',
                        'timeZone': 'Europe/Madrid'
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
                        'marketingFlightNumber': '0423',
                        'operationalFlightNumber': '0423',
                        'operationalDisclosure': 'IB',
                        'aircraft': {
                            'code': '32A',
                            'description': 'Airbus A320'
                        }
                    },
                    'cabin': {
                        'rbd': 'A',
                        'description': '',
                        'remainingSeats': 0,
                        'fareFamily': 'TBAESES',
                        'code': 'R',
                        'type': 'ECONOMY',
                        'bookingClass': 'ECONOMY'
                    },
                    'overnight': false,
                    'id': 'IB042320210625',
                    'duration': 70,
                    'waitingTime': 0,
                    'operatorLocator': null,
                    'stop': null,
                    'departureDateTime': '2021-06-25 09:25',
                    'departureUtcDateTime': '2021-06-25T07:25:00.000',
                    'arrivalDateTime': '2021-06-25 10:35',
                    'arrivalUtcDateTime': '2021-06-25T08:35:00.000',
                    'status': {
                        'code': 'HK',
                        'description': 'Confirmado'
                    }
                }
            ],
            'overnight': false,
            'ancillaries' :[
                {
                    'type' : 'BGA',
                    'unitaryPrice' : 1,
                    'price' : 33,
                    'amount': '',
                    'priceTotalFormatted' : ''
                }
            ]
        }
    ];

    let fakeMmBTokenService = {
        refreshUserLoggedToken: jasmine.createSpy(),
        getAnonymousToken: jasmine.createSpy()
    };

    let fakeMmBModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return { result: { then: angular.noop } };
        })
    };

    let formatDate = [
        {
            'code': 'es',
            'dateFormat': {
                'fullDate': 'EEEE, D "de" MMMM "de" Y',
                'longDate': 'D "de" MMMM "de" Y',
                'medium': 'D MMM Y H:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'H:mm:ss',
                'short': 'D/M/YY H:mm',
                'shortDate': 'D/M/YY',
                'shortTime': 'H:mm'
            }
        }
    ];

    let fakeDatalayerConstants = {
        DATALAYER_MODAL_ID: { 'FARE_CONDITIONS': 'FARE_CONDITIONS' },
        DATALAYER_VALUES: {
            'MULTIPLE_TRIP':'MULTIPLE_TRIP',
            'RETURN_TRIP':'RETURN_TRIP',
            'ONE_WAY_TRIP': 'ONE_WAY_TRIP'
        },
        DIGITAL_DATA_PROCESS: {
            test: 'test'
        },
        DIGITAL_DATA_STEP: {
            test: 'test'
        },
        QUADRIGAMS: {
            'MMB_SESSION_EXPIRED': 'MMBEXP'
        },
        MMB_UN_UNTK_PROCESSES: {
            UN: 'UN',
            UNTK: 'UNTK'
        }
    };
    let fakeDateFormatFilter = function (inputDate) {
        return inputDate;
    };

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
        'addDataLayerInfo': jasmine.createSpy('addDataLayerInfo').and.callFake(angular.noop),
        'updateDatalayerForFlexFlights': jasmine.createSpy(),
        'updateDigitalDataForFlexFlights': jasmine.createSpy(),
        'addDigitalDataInfo': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy(),
        'updateSlicesDatalayerForFlexFlights': jasmine.createSpy(),
    };

    let MockMmBAppConstants = {
        'iconsRoute': 'iconRoute',
        'airlinesLogoBaseRoute': 'airLogoRoute',
        'defaultAirlineLogo': 'defaulturl',
        'FORMAT_DATE': formatDate,
        'COOKIES': {
            'DYNAMIC_PRICING': true
        },
        'PASSENGER_TYPE': {
            'SENIOR': 'SENIOR',
            'ADULT': 'ADULT',
            'YOUTH': 'YOUTH',
            'TEENAGER': 'YOUNG',
            'YOUNG_ADULT': 'YOUNG_ADULT',
            'CHILD': 'CHILD',
            'INFANT': 'INFANT'
        },
        'ANCILLARIES_IMPORT_ORDER_TYPE': {
            'BAGGAGE' : 'BGA'
        },
        'ANCILLARIES_TYPES': {
            'BAGGAGE': 'BAGGAGE',
            'SEAT': 'SEAT',
            'INSURANCE': 'INSURANCE',
            'VEHICLE_RENTAL': 'VEHICLE_RENTAL',
            'UPGRADING': 'UPGRADING',
            'SPEQS': 'SPECIAL_EQUIPMENT',
            'SPECIAL_MEALS': 'SPECIAL_MEALS',
            'UPGRADING_BID': 'UPGRADING_BID'
        },
        'SEAT_FEATURE': {
            'EMERGENCY_EXIT': 'EMERGENCY_EXIT',
            'EXTRA_SIZE': 'EXTRA_SIZE',
            'EMERGENCY_WINDOW': 'WINDOW',
            'WING': 'WING',
            'SCREEN': 'ENTERTAINMENT_SCREEN',
            'NON_RECLINING': 'NON_RECLINING',
            'INFANT': 'PASSENGER_WITH_INFANT',
            'MOBILITY': 'RESTRICTED_MOBILITY',
            'WC': 'WC',
            'GALLEY': 'GALLEY',
            'PROMO': 'PROMO',
            'UPFRONT': 'UPFRONT',
            'AISLE': 'AISLE'
        },
        'ACCOUNT_TYPES': {
            'REWARD': 'R',
            'LOAN': 'L'
        },
        'DESTINATION_IMAGE_SIZE': {
            'desktop': '1024',
            'tablet': '768',
            'mobile': '320'
        },
        'ORDER_STATUS_VALUES': {
            'CANCELATION_FLAG': 'UNCONFIRMED_CHANGES',
            'CANCELATION_REACOM_FLAG': 'ACCEPT_CHANGES_PENDING'
        },
        'QUADRIGAM': {
            'SEARCH': 'CHKTRP',
            'LOGGED_SEARCH': 'MYTRPS',
        },
        'OH_FLIGHT_TYPES' : {
            'MULTITRIP': 'multiCityFlight'
        },
        'PAYMENT_TYPES': {
            CREDIT_CARD: 'CREDIT_CARD',
            AVIOS: 'AVIOS',
            VOUCHER: 'VOUCHER'
        },
        'UN_UNTK_QUADRIGAMS': ['test']
    };

    let mockTranslateFilter = function (value) {
        switch (value) {
            case 'CKIANCSEATS_SEAT_EMERGENCY_XL':
                return 'CKIANCSEATS_SEAT_EMERGENCY_XL';
            case 'SEATS_EXTRA_SIZE_SEAT':
                return 'SEATS_EXTRA_SIZE_SEAT';
            case 'SEATS_SEAT_PROMO':
                return 'SEATS_SEAT_PROMO';
            case 'CKIANCSEATS_SEAT_INFANT':
                return 'CKIANCSEATS_SEAT_INFANT';
            case 'CKIANCSEATS_SEAT_HANDICAP':
                return 'CKIANCSEATS_SEAT_HANDICAP';
            case 'CKIANCSEATS_SEAT_UPFRONT':
                return 'CKIANCSEATS_SEAT_UPFRONT';
            case 'MMB_FLIGHT_CHANGE_CONTRACTION_TO_1':
                return 'hasta';
            case 'MMB_FLIGHT_CHANGE_CONTRACTION_FROM_1':
                return 'desde';
            case 'MMB_FLIGHT_CHANGE_CONTRACTION_TO_3':
                return 'hasta'
            case 'MMB_FLIGHT_CHANGE_BLACKOU_ZH_AND_JP_TAG':
                return 'hastaCH';
            default:
                return 'PRUEBA_MOCK'
                break;
        }

    };
    let fakeTranslate = {
        'use': jasmine.createSpy()
    };
    cookies = {
        'get': jasmine.createSpy('get').and.callFake(() => {
            return true;
        })
    };

    let fakeCurrencyService = {
        'formatPrice': jasmine.createSpy('formatPrice').and.returnValue('10€'),
        'getCurrencyObject': jasmine.createSpy('getCurrencyObject').and.callFake(() => {
            return { 'code': 'EUR', 'numberDecimals': 2, 'aviosTransformed': '100' }
        }),
        'formatAvios': jasmine.createSpy('formatAvios'),
        'getCurrenciesAsMap': jasmine.createSpy('getCurrenciesAsMap').and.returnValue({description: 'EUR'}),
    };

    let fakeDatalayerUniqueKeysService = {
        clear: jasmine.createSpy()
    };

    let fakeBookingInfo = {
        order: {
            status: 'ENABLED',
            slices:[{
                segments:[{
                    cabin:{
                        fareFamily:'Turista',
                        bookingClass: 'Standard'
                    },
                    flight:{
                        operationalDisclosure:'IB',
                        operationalFlightNumber:'0256',
                        marketingFlightNumber:'0256'
                    },
                    departure:{
                        city:{
                            code:'MAD'
                        }
                    },
                    arrival:{
                        city:{
                            code:'BCN'
                        }
                    }
                }],
                departureDateTime:'2024-03-06 14:55',
                arrivalDateTime: '2024-04-10 18:35'
            }]
        }
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', 'ib-MmB-filters-module', 'ngCookies', function ($provide) {
            $provide.value('IbCAuthTokenService', fakeMmBTokenService);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('MmBAppConstants', MockMmBAppConstants);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('DateFormatFilter', fakeDateFormatFilter);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('translateFilter', mockTranslateFilter);
            $provide.value('$translate', fakeTranslate);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('DatalayerUniqueKeysService', fakeDatalayerUniqueKeysService);
        });
        inject(($window, $rootScope, _MmBUtilService_, _localStorageService_, _$sce_, _$cookies_, _$filter_, _CommonsSessionStorageService_) => {
            MmBUtilService = _MmBUtilService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            CommonsSessionStorageService = _CommonsSessionStorageService_;
            window = $window;
            $sce = _$sce_;
            cookies = _$cookies_;
            filter = _$filter_;

            fakeSessionStorage.set('bookingInfo',fakeBookingInfo)
            fakeSessionStorage.set('fareFamilyConditionsInfo',[fakeFareFamilyConditions])
            fakeSessionStorage.set('userLogged',true)
        });
        rootScope.appLang = 'es';
        rootScope.appMarket = 'ES';
    });
    describe('when refreshToken  resolves the promise', () => {
        beforeEach(inject(function ($q) {
            fakeMmBTokenService.getAnonymousToken = jasmine.createSpy('getAnonymousToken').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
        }));

        it('userLogged is true and refreshUserLoggedToken resolve promise ', (done) => {
            inject(function ($q) {
                fakeMmBTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve('true');
                    return deferred.promise;
                });
            });


            // localStorageService.set('userLogged', true);
            fakeSessionStorage.set('userLogged', true);

            MmBUtilService.refreshToken().then(function (responseData) {
                expect(fakeMmBTokenService.refreshUserLoggedToken).toHaveBeenCalled();

            }, angular.noop);
            rootScope.$digest();
            done();
        });

        it('userLogged is true and refreshUserLoggedToken reject promise ', (done) => {
            inject(function ($q) {
                fakeMmBTokenService.refreshUserLoggedToken = jasmine.createSpy('refreshUserLoggedToken').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject('true');
                    return deferred.promise;
                });
            });

            fakeSessionStorage.set('userLogged', true);
            MmBUtilService.refreshToken().then(function (responseData) {
                expect(fakeMmBTokenService.refreshUserLoggedToken).toHaveBeenCalled();
                // expect(localStorageService.get('userLogged')).toBe(false);

            }, angular.noop);
            rootScope.$digest();
            done();
        });


        it('userLogged is false', (done) => {
            fakeSessionStorage.set('userLogged', false);
            MmBUtilService.refreshToken().then(function (responseData) {
                expect(fakeMmBTokenService.getAnonymousToken).toHaveBeenCalled();

            }, angular.noop);
            rootScope.$digest();
            done();
        });
    });

    //getInfoHeader
    describe('When isMobile() is called', () => {
        it('and isMobile', (done) => {
            let result = MmBUtilService.isMobile();
            expect(result.header).toBeDefined();
            done();
        });
    });


    describe('When isUserLogged() is called', () => {
        it('Should userLogged is null', (done) => {
            fakeSessionStorage.set('userLogged',null);
            let returnedInfo = MmBUtilService.isUserLogged();
            expect(returnedInfo).toBe(null);
            done();
        });
        it('Should userLogged is true', (done) => {
            fakeSessionStorage.set('userLogged',true);
            let returnedInfo = MmBUtilService.isUserLogged();
            expect(returnedInfo).toBe(true);
            done();
        });
    });

    describe('When getDateFormatted() is called', () => {
        it('It return formatted date', (done) => {
            returnedInfo = MmBUtilService.getDateFormatted(10, 1, 2017);
            expect(returnedInfo).toEqual('2017-01-10');
            done();
        });
    });

    describe('when deviceType is a mobile ', () => {
        it(' deviceType should be equals to mobile', (done) => {
            let returnDeviceType;
            fakeSessionStorage.set('channel','mobi');
            returnDeviceType = MmBUtilService.getDeviceType();
            expect(returnDeviceType).toBe('mobile');
            done();
            rootScope.$digest();
        });
        it('deviceType should be equals to desktop', (done) => {
            let returnDeviceType;
            fakeSessionStorage.set('channel','desktop');
            window.innerWidth = 1026;
            returnDeviceType = MmBUtilService.getDeviceType();
            expect(returnDeviceType).toBe('desktop');
            done();
            rootScope.$digest();
        });
        it('deviceType should be equals to tablet', (done) => {
            let returnDeviceType;
            fakeSessionStorage.set('channel','tablet');
            window.innerWidth = 500;
            returnDeviceType = MmBUtilService.getDeviceType();
            expect(returnDeviceType).toBe('tablet');
            done();
            rootScope.$digest();
        });
        it('deviceType should be equals to mobile', (done) => {
            let returnDeviceType;
            fakeSessionStorage.set('channel','mobile');
            window.innerWidth = 400;
            returnDeviceType = MmBUtilService.getDeviceType();
            expect(returnDeviceType).toBe('mobile');
            done();
            rootScope.$digest();
        });
    });

    describe('when the service remove the localstrorage', () => {
        it('all localstrorage variables should be inicializated and userLogged is false', (done) => {
            fakeSessionStorage.set('userLogged','null');
            MmBUtilService.initStorage();
            rootScope.$digest();
            done();
        });
        it('all localstrorage variables should be inicializated', (done) => {
            MmBUtilService.initStorage();
            rootScope.$digest();
            done();
        });
        it('should call removeAncillariesUpgradeKeys removing upgrade keys', (done) => {
            fakeSessionStorage.set('flowUpgrade','aviosFlow');
            MmBUtilService.initStorage();
            rootScope.$digest();
            expect(fakeSessionStorage.get('flowUpgrade')).toBe(null);
            done();
        });
    });

    describe('when the service return a DateFormmated ', () => {
        it('day and a month should be between 0-9', (done) => {
            let day, month, year, returnDate;
            day = 2;
            month = 3;
            year = 2017;
            returnDate = MmBUtilService.getDateFormatted(day, month, year);
            expect(returnDate).toBe('2017-03-02');
            done();
            rootScope.$digest();
        });
        it('day and a month shouldn`t be between 0-9', (done) => {
            let day, month, year, returnDate;
            day = 12;
            month = 17;
            year = 2017;
            returnDate = MmBUtilService.getDateFormatted(day, month, year);
            expect(returnDate).toBe('2017-17-12');
            done();
            rootScope.$digest();
        });
    });

    describe('When getParameterByName is called', () => {
        it('When the service calls getParameterByName, url should be exists', (done) => {
            let name, url, response;
            name = 'test';
            url = 'localhost:8080/index.html?test=hola&test2=adios&test3=bien';
            response = MmBUtilService.getParameterByName(name, url);
            expect(response).toBe('hola');
            done();
            rootScope.$digest();
        });

        it('When the service calls getParameterByName without 3 parameters, url should be exists', (done) => {
            let name, url, response;
            name = 'test';
            url = 'localhost:8080/index.html?test';
            response = MmBUtilService.getParameterByName(name, url);
            expect(response).toBe(null);
            rootScope.$digest();
            done();
        });
    });

    describe('When getCompanyLogo() is called', () => {
        it('and companyCode exits,should return airLineLogo', (done) => {
            inject(()=>{
                fakeSessionStorage.set('airlinesLogoList',[{ 'iataCompanyCode': 'AA', 'url': 'URI', 'url_dis': 'URIDIS' }]);
            });

            let returnedInfo = MmBUtilService.getCompanyLogo('AA');
            expect(returnedInfo.companyURL).toEqual('iconRouteairLogoRouteURI');
            done();
        });

        it('and companyCode not exits,should return generic airLineLogo', (done) => {
            let returnedInfo = MmBUtilService.getCompanyLogo(null);
            expect(returnedInfo.companyURL).toEqual('iconRouteairLogoRoutelogo_pos_generico.svg');
            done();
        });
    });

    describe('When getBasicSegmentInformation is called', () => {
        it('should return segment object formed', (done) => {
            let returnedInfo;
            returnedInfo = MmBUtilService.getBasicSegmentInformation(fakeSegment, 'SHUTTLE_01');
            expect(returnedInfo.type).toEqual('CONFIRMED');
            expect(returnedInfo.sliceId).toEqual('SHUTTLE_01');
            done();
        });
    });

    describe('When setFareFamilyConditions() is called', () => {
        it('and fareFamily exists, should return data conditions', (done) => {
            fakeSessionStorage.set('fareFamilyConditions', fakeFareFamilyConditions);
            returnedInfo = MmBUtilService.setFareFamilyConditions(fakeFareFamily);
            expect(returnedInfo['TFLESEU'].commercialCode).toEqual('TFLESEU');
            done();
        });

        it('and fareFamily not exists, should return data conditions', (done) => {
            fakeSessionStorage.set('fareFamilyConditions', fakeFareFamilyConditions);
            returnedInfo = MmBUtilService.setFareFamilyConditions(fakeFareFamily);
            expect(returnedInfo['test'].commercialCode).toEqual('test');
            done();
        });
    });

    describe('openFareFamilyConditionsModal() is called', () => {
        it('the showGenericModal should be open', (done) => {
            fakeSessionStorage.set('fareFamilyConditions', fakeFareFamilyConditions);
            MmBUtilService.openFareFamilyConditionsModal({}, data);
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        })
    });

    describe('When getOldManageAppErrorMessage() is called', () => {
        it(' should return message', (done) => {
            let returnedInfo, errorCode = '001';
            returnedInfo = MmBUtilService.getOldManageAppErrorMessage(errorCode);
            expect(returnedInfo).toEqual('ERROR_OLD_MMB_001');
            done();
        });
    });

    describe('When getRelatedContent() is called', () => {
        it('Should return tranformer related content', (done) => {
            let relatedContent = [{
                'key': 'APIS_DOCUMENT_INFO',
                'value': 'Es necesario que proporciones la información de los pasajeros por anticipado para que puedan volar. Si quieres ahorrar tiempo en el aeropuerto, facilítanos ahora esta información online.'
            },
            {
                'key': 'ESTA_DOCUMENT_INFO',
                'value': 'Description text for ESTA_DOCUMENT_INFO'
            }
            ];
            let result = {
                'APIS_DOCUMENT_INFO': $sce.trustAsHtml('Es necesario que proporciones la información de los pasajeros por anticipado para que puedan volar. Si quieres ahorrar tiempo en el aeropuerto, facilítanos ahora esta información online.'),
                'ESTA_DOCUMENT_INFO': $sce.trustAsHtml('Description text for ESTA_DOCUMENT_INFO')
            }
            returnedInfo = MmBUtilService.getRelatedContent(relatedContent);
            expect(angular.toJson(returnedInfo)).toEqual(angular.toJson(result));
            done();
        });
    });

    describe('When getCompanyURL() is called', () => {
        it('should return default url', (done) => {
            inject(()=>{
                fakeSessionStorage.set('airlinesLogoList', null);
            });
            returnedInfo = MmBUtilService.getCompanyURL('AA');
            expect(returnedInfo).toEqual('airLogoRoutedefaulturl');
            done();
        });
        it('should return company url', (done) => {
            inject(()=>{
                fakeSessionStorage.set('airlinesLogoList', [{ 'iataCompanyCode': 'AA', 'url': 'URI', 'url_dis': 'URIDIS' }]);
            });

            returnedInfo = MmBUtilService.getCompanyURL('AA');
            expect(returnedInfo).toEqual('airLogoRouteURI');
            done();
        });
    });

    describe('When getURLFirstParameterByName() is called', () => {
        it(' should return first param found in the array', (done) => {
            let paramsName = ['test', 'name'];
            let returnedInfo = MmBUtilService.getURLFirstParameterByName(paramsName);
            expect(returnedInfo).toEqual(null);
            done();
        });
        it(' should return first param found in the array', (done) => {
            let paramsName = 'test';
            let returnedInfo = MmBUtilService.getURLFirstParameterByName(paramsName);
            expect(returnedInfo).toEqual(null);
            done();
        });
    });

    describe('When getEndpoint() is called', () => {
        it('should return endpoint', (done) => {
            let key = 0;
            returnedInfo = MmBUtilService.getEndpoint(key);
            expect(returnedInfo).toBeUndefined();
            done();
        });
    });

    describe('When updateDinamicPricingDatalayer', () => {
        it('Should update datalayer info calling to addDatalayerInfo()', (done) => {
            MmBUtilService.updateDinamicPricingDatalayer();
            expect(fakeDatalayerUtilsService.addDataLayerInfo).toHaveBeenCalled();
            done();
        });
    });

    // describe('When transformCustomerData() is called', () => {
    //     beforeEach(inject(function (localStorageService) {
    //         let mockCommercialInfo = {
    //             'currency': {
    //                 'groupingSeparator': ','
    //             }
    //         }
    //         localStorageService.set('commercialInfo', mockCommercialInfo);
    //     }));
    //     it('Should return aviosTransformed format data', (done) => {
    //         let response, mockCustomerDataInfo = [
    //             {
    //                 'generalInfo': { 'avios': 100 },
    //                 'memberIdentifier': { 'identifier': 'ID' },
    //                 'person': {
    //                     'personName': { 'firstName': '', 'familyName': '' },
    //                     'gender': '',
    //                     'emailAddress': ''
    //                 }
    //             },
    //             {
    //                 'accounts': [
    //                     {
    //                         'outstandingLoan': { amount: 100 },
    //                         'balance': { amount: 100 },
    //                         'accountType': 'R'
    //                     },
    //                 ]
    //             },
    //             { 'schemes': [{ 'recognitionLevel': { 'recognitionLevelIdentifier': { 'identifier': 'ID' } } }] }
    //         ];
    //         response = MmBUtilService.transformCustomerData(mockCustomerDataInfo);
    //         expect(response.generalInfo.avios).toEqual(100);
    //         done();
    //     })
    // });

    describe('Whn getElementsByProperty() is called', () => {
        it('When canBeRepeat is true should return at object with type like key and array inside', (done) => {
            let mockArray = [{ type: 'flight', orderItemId: 'IBc3c172aaf7c945a685dbbc21b26f278fOP_01' }], response;
            response = MmBUtilService.getElementsByProperty(mockArray, 'type', true);
            expect(response).toEqual({ 'flight': [{ 'type': 'flight', 'orderItemId': 'IBc3c172aaf7c945a685dbbc21b26f278fOP_01' }] });
            done();
        });
        it('When canBeRepeat is false, should return at objet with type like key', (done) => {
            let mockArray = [{ type: 'flight', orderItemId: 'IBc3c172aaf7c945a685dbbc21b26f278fOP_01' }], response;
            response = MmBUtilService.getElementsByProperty(mockArray, 'type', false);
            expect(response).toEqual({ 'flight': { 'type': 'flight', orderItemId: 'IBc3c172aaf7c945a685dbbc21b26f278fOP_01' } });
            done();
        });
    });

    describe('When generateVoucherSummaryModel() is called', () => {
        beforeEach(inject(() => {
            fakeSessionStorage.set('voucherCurrenciesList', []);
        }));
        it('Should update the datalayer data', (done) => {
            let response;
            response = MmBUtilService.generateVoucherSummaryModel(mockOrderItemSummaryModel, mockSliceModelSummaryModel, mockIsVoucher, false);
            expect(response.hasBaggage).toEqual(false);
            expect(response.hasSeat).toEqual(false);
            expect(response.totalPrice).toEqual({ totalPriceFormmated: '10€', total: 43.71 });
            done();
        });

        it('With seat, Should update the datalayer data', (done) => {
            let response;
            response = MmBUtilService.generateVoucherSummaryModel(mockOrderItemSummaryModelSeat, mockSliceModelSummaryModel, mockIsVoucher, false);
            expect(response.hasBaggage).toEqual(false);
            expect(response.hasSeat).toEqual(true);
            expect(response.totalPrice.totalPriceFormmated).toEqual('10€');
            done();
        });

        it('with baggage, Should update the datalayer data', (done) => {
            let response;
            response = MmBUtilService.generateVoucherSummaryModel(mockOrderItemSummaryModelBaggage, mockSliceModelSummaryModel, mockIsVoucher, false);
            expect(response.hasBaggage).toEqual(true);
            expect(response.hasSeat).toEqual(false);
            expect(response.totalPrice.totalPriceFormmated).toEqual('10€');
            done();
        });

    });

    describe('When generateSummaryModel() is called', () => {
        beforeEach(()=> {
            fakeSessionStorage.set('voucherCurrenciesList', [{code:'EUR'}]);
        });
        it('Should return the summary Model', (done) => {
            let response;
            response = MmBUtilService.generateSummaryModel(mockOrderItemSummaryModel, mockSliceModel, mockIsVoucher, true);
            expect(response.hasBaggage).toBe(false)
            expect(response.totalPassengers).toEqual(2)
            expect(response.totalPrice).toEqual({ 'totalPriceFormmated': '', 'total': 0 })
            done();
        });

        it('Should flag hasBaggage as true', (done) => {
            let response;
            response = MmBUtilService.generateSummaryModel(mockOrderItemSummaryModelWithBaggage, mockSliceModelSummaryModel, mockIsVoucher, false);
            expect(response.hasBaggage).toEqual(true);
            done();
        });
        it('Should flag hasSeat as true', (done) => {
            let response;
            response = MmBUtilService.generateSummaryModel(mockOrderItemSummaryModelWithSeat, mockSliceModelSummaryModel, mockIsVoucher, false);
            expect(response.hasSeat).toEqual(true);
            done();
        });
        it('Should flag hasSpeqs as true', (done) => {
            let response;
            response = MmBUtilService.generateSummaryModel(mockOrderItemSummaryModelWithSpecialEquipment, mockSliceModelSummaryModel, mockIsVoucher, false);
            expect(response.hasSpeqs).toEqual(true);
            done();
        });
        it('Should flag hasFlex as true', (done) => {
            let response;
            response = MmBUtilService.generateSummaryModel(mockOrderItemSummaryModelWithFlexibility, mockSliceModelSummaryModel, mockIsVoucher, false);
            expect(response.hasFlex).toEqual(true);
            done();
        });
        it('Should flag hasPriorityBoarding as true', (done) => {
            let response;
            response = MmBUtilService.generateSummaryModel(mockOrderItemSummaryModelWithPiorityBoarding, mockSliceModelSummaryModel, mockIsVoucher, false);
            expect(response.hasPriorityBoarding).toEqual(true);
            done();
        });
        afterEach(()=> {
            fakeSessionStorage.set('voucherCurrenciesList', []);
        })
    });

    describe('When removeAllParams() is called', () => {
        it('Should return the data withouth symbol ? ', (done) => {
            let response = '', windowUrl = window.location.href;
            response = MmBUtilService.removeAllParams();
            expect(response).toEqual(windowUrl.substring(0, windowUrl.length - 1));
            done();
        });
    });
    describe('When formatDisruptionAndFlexibilizationDates() is called', () => {
        it('Should return the dates when the type is BLACKOUT', (done) => {
            let type = 'BLACKOUT', dates = [{dateTo:'01/02/2028', dateFrom:'01/02/2003'},{dateTo:'01/02/2028', dateFrom:'01/02/2003'}, {}], result;
            result = MmBUtilService.formatDisruptionAndFlexibilizationDates(dates, type);
            expect(result).not.toBe(null);
            done();
        });
        it('Should return the dates when the type is ALLOWED_PERIODS', (done) => {
            let type = 'ALLOWED_PERIODS', dates = [{dateTo:'01/02/2023', dateFrom:'01/02/2003'}, {}], result;
            result = MmBUtilService.formatDisruptionAndFlexibilizationDates(dates, type);
            expect(result).not.toBe(null);
            done();
        });
        it('Should return the dates when the type is FLEXIBILIZATION_RANGE', (done) => {
            let type = 'FLEXIBILIZATION_RANGE', dates = {'since' : '1', 'limit': '3'}, result;
            result = MmBUtilService.formatDisruptionAndFlexibilizationDates(dates, type);
            expect(result).not.toBe(null);
            done();
        });
    });

    describe('When getBackGroundURL() is called', () => {
        it('Should return desktop', (done) => {
            window.innerWidth = 1280;
            const response = MmBUtilService.getBackGroundURL('test_');
            let origin = window.location.origin;
            expect(response).toEqual(origin + '/wcs/imagenes/destinos/calculadoraAvios/TEST_1024');
            done();
        });
        it('Should return tablet', (done) => {
            window.innerWidth = 768;
            const response = MmBUtilService.getBackGroundURL('test_');
            let origin = window.location.origin;
            expect(response).toEqual(origin + '/wcs/imagenes/destinos/calculadoraAvios/TEST_768');
            done();
        });
        it('Should return mobile', (done) => {
            window.innerWidth = 320;
            const response = MmBUtilService.getBackGroundURL('test_');
            let origin = window.location.origin;
            rootScope.$digest();
            expect(response).toEqual(origin + '/wcs/imagenes/destinos/calculadoraAvios/TEST_320');
            done();
        });

        it('Should return defaultCase', (done) => {
            window.innerWidth = 1024;
            const response = MmBUtilService.getBackGroundURL('test_');
            let origin = window.location.origin;
            rootScope.$digest();
            expect(response).toEqual(origin + '/wcs/imagenes/destinos/calculadoraAvios/TEST_1024');
            done();
        });
    });

    describe('When orderItemContained () is called', () => {
        it('Should return value', (done) => {
            let response = MmBUtilService.orderItemContained({}, [{test: 'test'}]);
            expect(response).toEqual(false);
            done();
        });
    });
     
});
