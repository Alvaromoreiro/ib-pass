describe('FareReshopService Test', () => {
    let FareReshopService, rootScope, q, localStorageService;

    let fakeFareReshopProxy = { postGeneric: jasmine.createSpy() };

    let fakeMmBModalService = {
        showGenericModal: jasmine.createSpy(),
        showGenericError: jasmine.createSpy(),
        finishWaiting: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy()
    };

    let fakeMmBAppConstants: any = {};
    let fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error: any) {
            return error;
        })
    };

    let fakeibCCalculatePointsService = {
        getCalculateAviosSummary: jasmine.createSpy('getCalculateAviosSummary')
    };

    let fakeFlightAviosInfo = {
        passengers: [{ id: 'ADULT_01', memberIdentifier: '123' }]
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeFareReshopProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('ibCCalculatePointsService', fakeibCCalculatePointsService);
        });

        inject(function ($rootScope, _FareReshopService_, $q, _localStorageService_) {
            FareReshopService = _FareReshopService_;
            rootScope = $rootScope;
            q = $q;
            localStorageService = _localStorageService_;
            localStorageService.set('flightAviosInfo', fakeFlightAviosInfo);
        });
    });

    describe('when getFareReshop() covers maps, elses and error path', () => {

        beforeEach(() => {
            spyOn(localStorageService, 'set');
            fakeMmBAppConstants.AVAILABLE_COMMERCIAL_CODES = ['ECONOMY'];

            fakeFareReshopProxy.postGeneric.and.callFake(() => {
                let deferred = q.defer();
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
                        passengers: [{ passengerId: 'ADULT_01' }]
                    }
                });
                return deferred.promise;
            });

            fakeibCCalculatePointsService.getCalculateAviosSummary.and.callFake(() => {
                let deferred = q.defer();
                deferred.resolve({
                    totalMonetaryAmount: [
                        { currency: { code: 'AVIOS' }, amount: 300 },
                        { currency: { code: 'TIER_POINTS' }, amount: 20 }
                    ]
                });
                return deferred.promise;
            });
        });

        it('should execute maps and store flight avios info', () => {
            FareReshopService.getFareReshop({});

            rootScope.$digest();
            rootScope.$digest();
            rootScope.$digest();

            expect(localStorageService.set).toHaveBeenCalledWith(
                'flightAviosInfo',
                jasmine.any(Object)
            );
        });

        it('should execute else branches and fallbacks', () => {
            fakeMmBAppConstants.AVAILABLE_COMMERCIAL_CODES = ['BUSINESS'];

            fakeFareReshopProxy.postGeneric.and.callFake(() => {
                let deferred = q.defer();
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
                        passengers: [{ passengerId: 'ADULT_01' }]
                    }
                });
                return deferred.promise;
            });

            fakeibCCalculatePointsService.getCalculateAviosSummary.and.callFake(() => {
                let deferred = q.defer();
                deferred.resolve({
                    totalMonetaryAmount: []
                });
                return deferred.promise;
            });

            FareReshopService.getFareReshop({});

            rootScope.$digest();
            rootScope.$digest();
            rootScope.$digest();

            expect(localStorageService.set).toHaveBeenCalled();
        });

        it('should handle error path and call controlError', () => {
            let mockError = { errorCode: 500 };

            fakeFareReshopProxy.postGeneric.and.callFake(() => {
                let deferred = q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });

            FareReshopService.getFareReshop({}).then(
                angular.noop,
                angular.noop
            );

            rootScope.$digest();

            expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
                mockError,
                jasmine.any(Function)
            );
        });
    });
});
