describe('SimulaatorFareReshopService Test', () => {
    var mockResponseEmpty = { data: {} };
    var SimulatorFareReshopService, rootScope, q, localStorageService;

    var fakeFareReshopProxy = { postGeneric: jasmine.createSpy() };

    var fakeMmBModalService = {
        showGenericModal: jasmine.createSpy(),
        showGenericError: jasmine.createSpy(),
        finishWaiting: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy()
    };

    var fakeMmBAppConstants: any = {};
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    var fakeibCCalculatePointsService = {
        getCalculateAviosSummary: jasmine.createSpy('getCalculateAviosSummary')
    };

    var fakeFlightAviosInfo = {
        passengers: [
            { id: 'ADULT_01', memberIdentifier: '123' }
        ]
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeFareReshopProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('ibCCalculatePointsService', fakeibCCalculatePointsService);
        });

        inject(($rootScope, _SimulatorFareReshopService_, $q, _localStorageService_) => {
            SimulatorFareReshopService = _SimulatorFareReshopService_;
            rootScope = $rootScope;
            q = $q;
            localStorageService = _localStorageService_;
            localStorageService.set('flightAviosInfo', fakeFlightAviosInfo);
        });
    });

    describe('when getFareReshop() with full structure', () => {
        beforeEach(() => {
            spyOn(localStorageService, 'set');
            fakeMmBAppConstants.AVAILABLE_COMMERCIAL_CODES = ['ECONOMY'];

            fakeFareReshopProxy.postGeneric.and.callFake(() => {
                var deferred = q.defer();
                deferred.resolve({
                    data: {
                        compensationInfo: {
                            fareChanges: [{ totalCost: 100 }]
                        },
                        fareFamilyConditions: [
                            { commercialNameES: 'Economy' }
                        ],
                        offers: [
                            {
                                slices: [
                                    {
                                        sliceId: 'S1',
                                        segments: [
                                            {
                                                id: 'SEG1',
                                                cabin: {
                                                    bookingClass: 'Y',
                                                    rbd: 'Y',
                                                    fareFamily: 'ECONOMY'
                                                },
                                                flight: {
                                                    marketingCarrier: { code: 'IB' },
                                                    operationalCarrier: { code: 'IB' }
                                                },
                                                departure: { code: 'MAD' },
                                                arrival: { code: 'BCN' },
                                                departureDateTime: '2026-01-01 10:00'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        passengers: [
                            { passengerId: 'ADULT_01' }
                        ]
                    }
                });
                return deferred.promise;
            });

            fakeibCCalculatePointsService.getCalculateAviosSummary.and.callFake(() => {
                var deferred = q.defer();
                deferred.resolve({
                    totalMonetaryAmount: [
                        { currency: { code: 'AVIOS' }, amount: 500 },
                        { currency: { code: 'TIER_POINTS' }, amount: 50 }
                    ]
                });
                return deferred.promise;
            });
        });

        it('should cover slices.map and segments.map lines', () => {
            SimulatorFareReshopService.getFareReshop({});

            rootScope.$digest();
            rootScope.$digest();
            rootScope.$digest();

            expect(localStorageService.set).toHaveBeenCalledWith(
                'flightAviosInfo',
                jasmine.any(Object)
            );
        });

        it('should cover else branches inside maps', () => {
            fakeMmBAppConstants.AVAILABLE_COMMERCIAL_CODES = ['BUSINESS']; // ECONOMY no permitido
        });

        it('should cover final fallback elses (fareProduct undefined, avios=0, elite=0, totalCost=false)', () => {
            fakeMmBAppConstants.AVAILABLE_COMMERCIAL_CODES = ['BUSINESS'];

            fakeFareReshopProxy.postGeneric.and.callFake(() => {
                var deferred = q.defer();
                deferred.resolve({
                    data: {
                        compensationInfo: {
                            fareChanges: [{ totalCost: 0 }]
                        },
                        fareFamilyConditions: [],
                        offers: [
                            {
                                slices: [
                                    {
                                        sliceId: 'S1',
                                        segments: [
                                            {
                                                id: 'SEG1',
                                                cabin: {
                                                    bookingClass: 'Y',
                                                    rbd: 'Y',
                                                    fareFamily: 'ECONOMY'
                                                },
                                                flight: {
                                                    marketingCarrier: { code: 'IB' },
                                                    operationalCarrier: { code: 'IB' }
                                                },
                                                departure: { code: 'MAD' },
                                                arrival: { code: 'BCN' },
                                                departureDateTime: '2026-01-01 10:00'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        passengers: [
                            { passengerId: 'ADULT_01' }
                        ]
                    }
                });
                return deferred.promise;
            });

            fakeibCCalculatePointsService.getCalculateAviosSummary.and.callFake(() => {
                var deferred = q.defer();
                deferred.resolve({
                    totalMonetaryAmount: []
                });
                return deferred.promise;
            });

            SimulatorFareReshopService.getFareReshop({});

            rootScope.$digest();
            rootScope.$digest();
            rootScope.$digest();

            expect(localStorageService.set).toHaveBeenCalled();
        });

        it('should handle error path and call controlError', () => {
            const mockError = { errorCode: 500 };

            fakeFareReshopProxy.postGeneric.and.callFake(() => {
                const deferred = q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });

            SimulatorFareReshopService.getFareReshop({}).then(
                () => fail('Promise should not resolve'),
                () => {}
            );

            rootScope.$digest();

            expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
                mockError,
                jasmine.any(Function)
            );
        });
    });
});
