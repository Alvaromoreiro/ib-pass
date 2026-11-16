describe('IbFlexAvailabilityTransformer Test', () => {
    let $rootScope, $scope, IbFlexAvailabilityTransformer;
    let fakeMmBUtilService = {
        'getRelatedContent': jasmine.createSpy(),
        'getCompanyLogo': jasmine.createSpy()
    }
    let fakeMmBAppConstants = {
        'WARNING_MESSAGES': {
            'OVERNIGHT_WARNING': 'SSE_AVM_20003',
            'TERMINAL_CHANGE_WARNING': 'SSE_AVM_20002',
            'AIRPORT_CHANGE_WARNING': 'SSE_AVM_20001',
            'LONG_WAITING_WARNING': 'SSE_AVM_20004',
            'MISSCONNECTION_FLEX_WARNING': 'SSE_ORM_20014'
        },
    }
    let fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCOTk5Nzc5ZWVjNTk3NGI2N2E0ZWQyZGIyOTBjOGRjNzM%3D';
    let fakeSisterCitisModel = {
        "origin": {
            'originSisterCities': {
                'madrid': {
                    'isSelected': true,
                    'code': 'MAD'

                },
                'barcelona': {
                    'isSelected': true,
                    'code': 'BCN'

                }
            },
            'sisterCitiesModel': {
                'origin': {
                    'originSisterCities': {
                        'madrid': {
                            'isSelected': true,
                        },
                        'barcelona': {
                            'isSelected': true,
                        }
                    }
                },
                'destination': {
                    'destinationSisterCities': {
                        'Bilbao': {
                            'isSelected': true,
                            'code': 'BIO'

                        }
                    }
                }
            }
        },
        'destination': {
            'destinationSisterCities': {
                'Bilbao': {
                    'isSelected': true,
                    'code': 'BIO'

                }
            }
        },
        "cities": [
            {
                "code": "LGC",
                "description": "LGC",
                "sisterCities": []
            },
            {
                "code": "EAS",
                "description": "San Sebastian",
                "sisterCities": [
                    {
                        "code": "BIO",
                        "description": "Bilbao",
                        "timezone": "Europe/Madrid",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        },
                        "latitude": 43.3,
                        "longitude": -2.916666
                    },
                    {
                        "code": "PNA",
                        "description": "Pamplona",
                        "timezone": "Europe/Madrid",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        },
                        "latitude": 42.766666,
                        "longitude": -1.641666
                    },
                    {
                        "code": "RJL",
                        "description": "Logroño",
                        "timezone": "Europe/Madrid",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        },
                        "latitude": 42.456944,
                        "longitude": -2.323611
                    },
                    {
                        "code": "SDR",
                        "description": "Santander",
                        "timezone": "Europe/Madrid",
                        "country": {
                            "code": "ES",
                            "description": "España"
                        },
                        "latitude": 43.433333,
                        "longitude": -3.816666
                    }
                ]
            }
        ]
    }
    let fakeResponseAvailabilityDataResponse = {
        offerTranformed: {
            sliceId: 'IB029832903',
        },
        offers: [
            {
                offerItems: [{
                    offerItemId: 'IB2a8d74ae02c4416c916ffe165d5e8fabOP',
                    passengerIds: 'AAAAAAAAAAAAAAAAAA',
                    privateFareInformation: 'AAAAAAAAAAAAAAAAAA',
                }],
                offerId: 'IB2a8d74ae02c4416c916ffe165d5e8fabOP',
                timeLimits: null,
                providerOfferId: '5dsrlIhz071OGalzrQJ3tO001',
                privateFare: false,
                offerType: '',
                price: null,
                originDestinations: [
                    {
                        applicableSlices: [
                            {
                                sliceId: 'IB029832903',
                            }
                        ],
                        originDestinationId: 'OD1',
                        origin: 'BIO',
                        destination: 'MAD',
                        originCity: {
                            code: 'BIO',
                            description: 'Bilbao'
                        },
                        destinationCity: {
                            code: 'MAD',
                            description: 'Madrid'
                        },
                        slices: [
                            {
                                departureDateTime: '2020-08-09',
                                arrivalDateTime: '2020-08-10',
                                sliceId: 'IB029832903',
                                duration: '200',
                                overnight: false,
                                stopsNumber: '12',
                                segments: [
                                    {
                                        departureDateTime: '2020-08-09',
                                        arrivalDateTime: '2020-08-10',
                                        sliceId: 'IB029832903',
                                        duration: '200',
                                        overnight: false,
                                        stopsNumber: '12',
                                        departure: {
                                            city: {
                                                name: 'MADRID',
                                                code: 'MAD'
                                            },
                                            name: 'MADRID',
                                            code: 'MAD'
                                        },
                                        arrival: {
                                            city: {
                                                name: 'BILBAO',
                                                code: 'BIO'
                                            },
                                            name: 'BILBAO',
                                            code: 'BIO'
                                        },
                                        flight: {
                                            marketingCarrier: {
                                                code: 'IB2309'
                                            },
                                            aircraft: {
                                                description: 'AB009'
                                            },
                                            operationalCarrier: {
                                                name: 'ASAS'
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                offerId: 'IB7d6095d2634041e79ff221a952f1ed9eOP',
                timeLimits: null,
                providerOfferId: '5dsrlIhz071OGalzrQJ3tO002',
                privateFare: false,
                offerType: '',
                price: null,
                originDestinations: [
                    {
                        applicableSlices: [

                        ],
                        originDestinationId: 'OD1',
                        origin: 'BIO',
                        destination: 'MAD',
                        originCity: {
                            code: 'BIO',
                            description: 'Bilbao'
                        },
                        destinationCity: {
                            code: 'MAD',
                            description: 'Madrid'
                        },
                        slices: [
                            {
                                departureDateTime: '2020-08-09',
                                arrivalDateTime: '2020-08-10',
                                sliceId: 'IB029832903',
                                duration: '200',
                                overnight: false,
                                stopsNumber: '12',
                                segments: [
                                    {
                                        departureDateTime: '2020-08-09',
                                        arrivalDateTime: '2020-08-10',
                                        sliceId: 'IB029832903',
                                        duration: '200',
                                        overnight: false,
                                        stopsNumber: '12',
                                        departure: {
                                            city: {
                                                name: 'MADRID',
                                                code: 'MAD'
                                            },
                                            name: 'MADRID',
                                            code: 'MAD'
                                        },
                                        arrival: {
                                            city: {
                                                name: 'BILBAO',
                                                code: 'BIO'
                                            },
                                            name: 'BILBAO',
                                            code: 'BIO'
                                        },
                                        flight: {
                                            marketingCarrier: {
                                                code: 'IB2309'
                                            },
                                            aircraft: {
                                                description: 'AB009'
                                            },
                                            operationalCarrier: {
                                                name: 'ASAS'
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        availabilityDataResponse: {
            'flowId': 'TWFuYWdlTXlCb29raW5nQElCNjU3MjBjZjQ3ZWM4NDJlZDhlN2E1YmRkZmRkMzZhOGM%3D',
            'availabilities': [
                {
                    offers: [
                        {
                            offerItems: [{
                                offerItemId: 'IB2a8d74ae02c4416c916ffe165d5e8fabOP',
                                passengerIds: 'AAAAAAAAAAAAAAAAAA',
                                privateFareInformation: 'AAAAAAAAAAAAAAAAAA',
                            }],
                            offerId: 'IB2a8d74ae02c4416c916ffe165d5e8fabOP',
                            timeLimits: null,
                            providerOfferId: '5dsrlIhz071OGalzrQJ3tO001',
                            privateFare: false,
                            offerType: '',
                            price: null,
                            originDestinations: [
                                {
                                    applicableSlices: [
                                        {
                                            sliceId: 'IB029832903',
                                        }
                                    ],
                                    originDestinationId: 'OD1',
                                    origin: 'BIO',
                                    destination: 'MAD',
                                    originCity: {
                                        code: 'BIO',
                                        description: 'Bilbao'
                                    },
                                    destinationCity: {
                                        code: 'MAD',
                                        description: 'Madrid'
                                    },
                                    slices: [
                                        {
                                            departureDateTime: '2020-08-09',
                                            arrivalDateTime: '2020-08-10',
                                            sliceId: 'IB029832903',
                                            duration: '200',
                                            overnight: false,
                                            stopsNumber: '12',
                                            segments: [
                                                {
                                                    departureDateTime: '2020-08-09',
                                                    arrivalDateTime: '2020-08-10',
                                                    sliceId: 'IB029832903',
                                                    duration: '200',
                                                    overnight: false,
                                                    stopsNumber: '12',
                                                    departure: {
                                                        city: {
                                                            name: 'MADRID',
                                                            code: 'MAD'
                                                        },
                                                        name: 'MADRID',
                                                        code: 'MAD'
                                                    },
                                                    arrival: {
                                                        city: {
                                                            name: 'BILBAO',
                                                            code: 'BIO'
                                                        },
                                                        name: 'BILBAO',
                                                        code: 'BIO'
                                                    },
                                                    flight: {
                                                        marketingCarrier: {
                                                            code: 'IB2309'
                                                        },
                                                        aircraft: {
                                                            description: 'AB009'
                                                        },
                                                        operationalCarrier: {
                                                            name: 'ASAS'
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            offerId: 'IB7d6095d2634041e79ff221a952f1ed9eOP',
                            timeLimits: null,
                            providerOfferId: '5dsrlIhz071OGalzrQJ3tO002',
                            privateFare: false,
                            offerType: '',
                            price: null,
                            originDestinations: [
                                {
                                    applicableSlices: [

                                    ],
                                    originDestinationId: 'OD1',
                                    origin: 'BIO',
                                    destination: 'MAD',
                                    originCity: {
                                        code: 'BIO',
                                        description: 'Bilbao'
                                    },
                                    destinationCity: {
                                        code: 'MAD',
                                        description: 'Madrid'
                                    },
                                    slices: [
                                        {
                                            departureDateTime: '2020-08-09',
                                            arrivalDateTime: '2020-08-10',
                                            sliceId: 'IB029832903',
                                            duration: '200',
                                            overnight: false,
                                            stopsNumber: '12',
                                            segments: [
                                                {
                                                    departureDateTime: '2020-08-09',
                                                    arrivalDateTime: '2020-08-10',
                                                    sliceId: 'IB029832903',
                                                    duration: '200',
                                                    overnight: false,
                                                    stopsNumber: '12',
                                                    departure: {
                                                        city: {
                                                            name: 'MADRID',
                                                            code: 'MAD'
                                                        },
                                                        name: 'MADRID',
                                                        code: 'MAD'
                                                    },
                                                    arrival: {
                                                        city: {
                                                            name: 'BILBAO',
                                                            code: 'BIO'
                                                        },
                                                        name: 'BILBAO',
                                                        code: 'BIO'
                                                    },
                                                    flight: {
                                                        marketingCarrier: {
                                                            code: 'IB2309'
                                                        },
                                                        aircraft: {
                                                            description: 'AB009'
                                                        },
                                                        operationalCarrier: {
                                                            name: 'ASAS'
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    originDestinations: [
                        {
                            originDestinationId: 'OD1',
                            origin: 'BIO',
                            destination: 'MAD',
                            originCity: {
                                code: 'BIO',
                                description: 'Bilbao'
                            },
                            destinationCity: {
                                code: 'MAD',
                                description: 'Madrid'
                            },
                            slices: [
                                {
                                    departureDateTime: '2020-08-09',
                                    arrivalDateTime: '2020-08-10',
                                    sliceId: 'IB029832903',
                                    duration: '200',
                                    overnight: false,
                                    stopsNumber: '12',
                                    segments: [
                                        {
                                            departureDateTime: '2020-08-09',
                                            arrivalDateTime: '2020-08-10',
                                            sliceId: 'IB029832903',
                                            duration: '200',
                                            overnight: false,
                                            stopsNumber: '12',
                                            departure: {
                                                city: {
                                                    name: 'MADRID',
                                                    code: 'MAD'
                                                },
                                                name: 'MADRID',
                                                code: 'MAD'
                                            },
                                            arrival: {
                                                city: {
                                                    name: 'BILBAO',
                                                    code: 'BIO'
                                                },
                                                name: 'BILBAO',
                                                code: 'BIO'
                                            },
                                            flight: {
                                                marketingCarrier: {
                                                    code: 'IB2309'
                                                },
                                                aircraft: {
                                                    description: 'AB009'
                                                },
                                                operationalCarrier: {
                                                    name: 'ASAS'
                                                }
                                            },
                                            warnings: [
                                                {code: 'SSE_AVM_20003', description: 'test'},
                                                {code: 'SSE_AVM_20002', description: 'test'},
                                                // {code: 'SSE_AVM_20001', description: 'test'},
                                                // {code: 'SSE_AVM_20004', description: 'test'},
                                                {code: 'SSE_ORM_20014', description: 'test'}
                                            ],
                                            waitingTime: '50',
                                            stop: {
                                                city: {
                                                    code: 'MAD',
                                                    description:'Madrid',
                                                    duration: '20'
                                                }
                                            }
                                        },
                                        {
                                            departureDateTime: '2020-08-09',
                                            arrivalDateTime: '2020-08-10',
                                            sliceId: 'IB029832903',
                                            duration: '200',
                                            overnight: false,
                                            stopsNumber: '12',
                                            departure: {
                                                city: {
                                                    name: 'MADRID',
                                                    code: 'MAD'
                                                },
                                                name: 'MADRID',
                                                code: 'MAD'
                                            },
                                            arrival: {
                                                city: {
                                                    name: 'BILBAO',
                                                    code: 'BIO'
                                                },
                                                name: 'BILBAO',
                                                code: 'BIO'
                                            },
                                            flight: {
                                                marketingCarrier: {
                                                    code: 'IB2309'
                                                },
                                                aircraft: {
                                                    description: 'AB009'
                                                },
                                                operationalCarrier: {
                                                    name: 'ASAS'
                                                }
                                            },
                                            warnings: [
                                                {code: 'SSE_AVM_20003', description: 'test'},
                                                {code: 'SSE_AVM_20002', description: 'test'},
                                                {code: 'SSE_AVM_20001', description: 'test'},
                                                {code: 'SSE_AVM_20004', description: 'test'},
                                                {code: 'SSE_ORM_20014', description: 'test'}
                                            ],
                                            waitingTime: '50',
                                            stop: {
                                                city: {
                                                    code: 'MAD',
                                                    description:'Madrid',
                                                    duration: '20'
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    passengers: [
                        {
                            passengerId: 'ADULT_01',
                            passengerType: 'ADULT',
                            firstName: null,
                            surname: null,
                            frequentFlyerInfo: null
                        }
                    ],
                    responseId: 'Qm9va2luZ0BHVy0xNTg4NjU3MDgzODQ5LVRITldiOWI0NGQ2MTcxYmU3NGQxNGE5ZmZlMjA2YTFkZTE1NjY%3D',
                    fareFamilyConditions: [],
                    contextMetadata: {
                        language: 'es',
                        country: 'FI',
                        currencies: []
                    },
                    uniqueProductSuproductPairs: [],
                    relatedContent: [],
                    specialDiscountsPossibilities: null,
                    sliceId: 'BIOMAD20200514175000'
                }
            ],
            'relatedContent': [
                {
                    key: 'termsAndConditions',
                    value: 'He leído y acepto los <a href=\'https://www.iberia.com/web/obsmenu.do?quadrigam=CONDIC&menuId=INFLEG\' target=\'_blank\'>términos y condiciones</a> generales de compra  y las <a href=\' https://www.iberia.com/web/obsmenu.do?quadrigam=CONBIL&menuId=INFLEG\' target=\'_blank\'>condiciones de contrato</a>'
                }
            ]
        }
    }

    let fakeFormat = function (dateIn) { };

    let fakeNewSisterCitiesModel = {
        'BIOMAD20210625092500': {
            origin: {
                originOrderCities: [{ code: 'MAD', description: 'Madrid' }],
                originSisterCities: [{ code: 'MAD', description: 'Madrid', isSelected: true }]
            },
            destination: {
                destinationOrderCities: 'Bilbao',
                destinationSisterCities: [{ code: 'BIO', description: 'Bilbao', isSelected: true }],
            },
            originSisterCitiesNum: null,
            destinationSisterCitiesNum: null,
        },
        referenceSliceId: "BIOMAD20210625092500",
        sisterCitiesOptionChecked: false
    }
    let fakeDateSelected = [{
        date: {

            format: fakeFormat,
            date: new Date('2022/06/13')

        },
        date1: {
            format: fakeFormat,
            date: new Date('2022/06/13')
        }
    },
    {
        date: {

            format: fakeFormat,
            date: new Date('2022/06/13')

        },
        date1: {
            format: fakeFormat,
            date: new Date('2022/06/13')
        }
    }];

    beforeEach(() => {
        angular.mock.module('ib-flexibilization-availability-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_$rootScope_, _IbFlexAvailabilityTransformer_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            IbFlexAvailabilityTransformer = _IbFlexAvailabilityTransformer_;
        });
        $rootScope.$digest();
    });
    describe('when getAvailabilityRequest is called', () => {
        it('IbFlexAvailabilityTransformer should be defined', () => {
            let result = IbFlexAvailabilityTransformer.getAvailabilityRequest(fakeFlowId, fakeDateSelected, fakeNewSisterCitiesModel);
            expect(result.slices.length).toEqual(2);
            expect(IbFlexAvailabilityTransformer).toBeDefined();
        });

    });
    describe('when getTransformedAvailabilityData is called ', () => {
        it('getTransformedAvailabilityData should be defined', () => {
            let response = IbFlexAvailabilityTransformer.getTransformedAvailabilityData(fakeResponseAvailabilityDataResponse, fakeNewSisterCitiesModel);
            let fakeshowAvailability = true;
            IbFlexAvailabilityTransformer.getTransformedAvailabilityData(fakeResponseAvailabilityDataResponse, fakeNewSisterCitiesModel);
            expect(response.showAvailability).toBe(fakeshowAvailability);
        });
        it('and sisterCitiesModel sisterCitiesOptionChecked true', () => {
            let copyfakeNewSisterCitiesModel = {...fakeNewSisterCitiesModel};
            copyfakeNewSisterCitiesModel.sisterCitiesOptionChecked = true;
            let response = IbFlexAvailabilityTransformer.getTransformedAvailabilityData(fakeResponseAvailabilityDataResponse, copyfakeNewSisterCitiesModel);
            let fakeshowAvailability = true;
            expect(response.showAvailability).toBe(fakeshowAvailability);
        });
    });
});
