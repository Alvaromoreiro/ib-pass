describe('IbFlexibilizationAvailabilityService Test', () => {
    let $q, IbFlexAvailabilityService, $rootScope, localStorageService;
    let fakeCallAvailabilityflexibleService = {
        'getAvailabilityFlexible' : jasmine.createSpy('getAvailabilityFlexible').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({
                model:{
                    order:{
                        status:true
                    }
                }
            });

            return deferred.promise;
        })
    };
    let fakeIbFlexAvailabilityTransformer = {
        'getTransformedAvailabilityData': jasmine.createSpy(),
        'getAvailabilityRequest': jasmine.createSpy('getAvailabilityFlexible').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({
                model:{
                    order:{
                        status:true
                    }
                }
            });

            return deferred.promise;
        })
    };
    let fakeCallRibbonflexibleService = {
        'getRibbonFlexible' : jasmine.createSpy('getRibbonFlexible').and.callFake(() => {
            var deferred = $q.defer();
            deferred.resolve({
                model:{
                    order:{
                        status:true
                    }
                }
            });

            return deferred.promise;
        })
    };
    let fakeResponseAvailabilityDataResponse = {
        availabilityDataResponse: {
            'flowId': 'TWFuYWdlTXlCb29raW5nQElCNjU3MjBjZjQ3ZWM4NDJlZDhlN2E1YmRkZmRkMzZhOGM%3D',
            'availabilities': [
                {
                    offers: [
                        {
                            offerId: 'IB2a8d74ae02c4416c916ffe165d5e8fabOP',
                            timeLimits: null,
                            providerOfferId: '5dsrlIhz071OGalzrQJ3tO001',
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
    };
    let fakeSisterCitisModel = {
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
    };
    let fakeDateSelected = '2020-06-16T22:00:00.000Z';
    let fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCOTk5Nzc5ZWVjNTk3NGI2N2E0ZWQyZGIyOTBjOGRjNzM%3D';
    beforeEach(() =>{
        angular.mock.module('ib-flexibilization-availability-module', 'LocalStorageModule', ($provide) => {
            $provide.value('CallAvailabilityflexibleService', fakeCallAvailabilityflexibleService);
            $provide.value('IbFlexAvailabilityTransformer', fakeIbFlexAvailabilityTransformer);
            $provide.value('CallRibbonflexibleService', fakeCallRibbonflexibleService);
        });

        inject((_IbFlexAvailabilityService_, _$q_, _$rootScope_, _localStorageService_) => {
            IbFlexAvailabilityService = _IbFlexAvailabilityService_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            localStorageService = _localStorageService_
        })
        $rootScope.$digest();
    });

    describe('test for IbFlexAvailabilityService', () => {
        it('IbFlexAvailabilityService should be defined', (done) => {
            expect(IbFlexAvailabilityService).toBeDefined();
            done();
        });

    });

    describe('when availabilityInit is called', () =>{
        it('IbFlexAvailabilityService should be defined', (done) => {
            let availabilityFlexData = localStorageService.get('availabilityFlexData');
            IbFlexAvailabilityService.availabilityInit(fakeResponseAvailabilityDataResponse,fakeSisterCitisModel);
            expect(availabilityFlexData).toBeDefined();
            done();
        });
    });

    describe('when callAvailabilityNewDate is called', () =>{
        it('CallAvailabilityflexibleService.getAvailabilityFlexible should be called and resolve ', (done) => {
            inject(($q) => {
                fakeCallAvailabilityflexibleService.getAvailabilityFlexible = jasmine.createSpy('getAvailabilityFlexible').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve({});
                    return deferred.promise;
                });
            });
            IbFlexAvailabilityService.callAvailabilityNewDate(fakeFlowId,fakeDateSelected,fakeSisterCitisModel)
                .then(() =>{
                    expect(fakeCallAvailabilityflexibleService.getAvailabilityFlexible).toHaveBeenCalled();
                    done();
                },
                () => {});

            $rootScope.$digest();
        });
        it('CallAvailabilityflexibleService.getAvailabilityFlexible should be called and reject', (done) => {
            inject(($q) => {
                fakeCallAvailabilityflexibleService.getAvailabilityFlexible = jasmine.createSpy('getAvailabilityFlexible').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({});
                    return deferred.promise;
                })
            });
            IbFlexAvailabilityService.callAvailabilityNewDate(fakeFlowId,fakeDateSelected,fakeSisterCitisModel)
                .then(() => {},
                () => {
                    expect(fakeCallAvailabilityflexibleService.getAvailabilityFlexible).toHaveBeenCalled();
                    done();
                });

            $rootScope.$digest();
        });
    });


    describe('when callRibbonMoreDates is called', () =>{
        it('CallRibbonflexibleService.getRibbonFlexible should be called and resolve', (done) => {
            inject(() => {
                fakeCallRibbonflexibleService.getRibbonFlexible = jasmine.createSpy('getAvailabilityFlexible').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve({});
                    return deferred.promise;
                })
            });
            IbFlexAvailabilityService.callRibbonMoreDates(fakeFlowId,fakeDateSelected,fakeSisterCitisModel)
                .then(() =>{
                    expect(fakeCallRibbonflexibleService.getRibbonFlexible).toHaveBeenCalled();
                    done();
                },
                () => {})
            $rootScope.$digest();
        });

        it('CallRibbonflexibleService.getRibbonFlexible should be called and reject', (done) => {
            inject(() => {
                fakeCallRibbonflexibleService.getRibbonFlexible = jasmine.createSpy('getAvailabilityFlexible').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.reject({});
                    return deferred.promise;
                })
            });
            IbFlexAvailabilityService.callRibbonMoreDates(fakeFlowId,fakeDateSelected,fakeSisterCitisModel)
                .then(() =>{},
                ()=> {
                    expect(fakeCallRibbonflexibleService.getRibbonFlexible).toHaveBeenCalled();
                    done();
                })
            $rootScope.$digest();
        });
    });
});
