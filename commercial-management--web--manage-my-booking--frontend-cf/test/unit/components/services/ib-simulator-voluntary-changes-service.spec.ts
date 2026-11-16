describe('SimulatorVoluntaryChangesService Test', () => {
    let SimulatorVoluntaryChangesService, localStorageService, rootScope;

    const fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError')
    };

    const fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy('postGeneric')
    };

    const fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal'),
        finishWaiting: jasmine.createSpy('finishWaiting')
    };

    const fakeMmBAppConstants = {
        simulatorReshopAvailabilityURI: '/simulator'
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });

        inject(($rootScope, _SimulatorVoluntaryChangesService_, _localStorageService_) => {
            SimulatorVoluntaryChangesService = _SimulatorVoluntaryChangesService_;
            localStorageService = _localStorageService_;
            spyOn(localStorageService, 'set');

            fakeMmBModalService.showWaitingModal.calls.reset();
            fakeMmBModalService.finishWaiting.calls.reset();
            fakeCommonsNewHttpUtilsErrorService.controlError.calls.reset();

            rootScope = $rootScope;
        });
    });

    it('should show modal, save vcAvailability and resolve when data is valid', (done) => {
        inject(($q) => {
        const response = {
            data: {
                responseId: '1',
                contextMetadata: {},
                originDestinations: [],
                fareFamilyConditions: [{}],
                offers: new Array(1500)
            }
        };

        fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
            const d = $q.defer();
            d.resolve(response);
            return d.promise;
        });

            SimulatorVoluntaryChangesService.getAvailability({ req: true }, false).then(data => {
                expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
                expect(localStorageService.set).toHaveBeenCalled();
                expect(data.fareFamilyConditions.length).toBe(1);
                done();
            });

            rootScope.$digest();
        });
    });

    it('should reuse previous requestAvailability when data is not provided', inject(($q) => {
        const response = {
            data: {
                fareFamilyConditions: [{}]
            }
        };

        fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
            const d = $q.defer();
            d.resolve(response);
            return d.promise;
        });

        const initialRequest = { previous: true };

        // Primera llamada: inicializa requestAvailability
        SimulatorVoluntaryChangesService.getAvailability(initialRequest, false);
        rootScope.$digest();

        // Segunda llamada: data = undefined → usa el valor previo
        SimulatorVoluntaryChangesService.getAvailability(undefined, false);
        rootScope.$digest();

        expect(fakeCommonsGenericProxy.postGeneric.calls.mostRecent().args[1])
            .toEqual(initialRequest);
    }));

    it('should NOT show modal when update is true', inject(($q) => {
        const response = {
            data: {
                fareFamilyConditions: [{}]
            }
        };

        fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
            const d = $q.defer();
            d.resolve(response);
            return d.promise;
        });

        SimulatorVoluntaryChangesService.getAvailability({}, true);
        rootScope.$digest();

        expect(fakeMmBModalService.showWaitingModal).not.toHaveBeenCalled();
    }));

    it('should trigger noFares error branch when fareFamilyConditions is empty', inject(($q) => {
        const response = {
            data: {
                fareFamilyConditions: []
            }
        };

        fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
            const d = $q.defer();
            d.resolve(response);
            return d.promise;
        });

        SimulatorVoluntaryChangesService.getAvailability({}, false);
        rootScope.$digest();

        expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalled();
        expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
    }));

    it('should execute error callback when proxy rejects', inject(($q) => {
        const error = { status: 500 };

        fakeCommonsGenericProxy.postGeneric.and.callFake(() => {
            const d = $q.defer();
            d.reject(error);
            return d.promise;
        });

        SimulatorVoluntaryChangesService.getAvailability({}, false);
        rootScope.$digest();

        expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalled();
        expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
    }));

    describe('getModelFlighVC', () => {
        it('should return "outbound" when only one flight is checked', () => {
            const data: any = {
                flights: {
                    0: {
                        checked: true,
                        departureDateParsed: {
                            originalDate: '2026-01-10'
                        }
                    }
                }
            };

            const result = SimulatorVoluntaryChangesService.getModelFlighVC(
                data,
                [0],
                1
            );

            expect(result).toBe('outbound');
            expect(data.flights[0].changeNewDate).toBeDefined();
            expect(data.flights[0].parseNewDate).toBeDefined();
        });

        it('should return "twice" when two flights are checked', () => {
            const data: any = {
                flights: {
                    0: {
                        checked: true,
                        departureDateParsed: {
                            originalDate: '2026-01-10'
                        }
                    },
                    1: {
                        checked: true,
                        departureDateParsed: {
                            originalDate: '2026-01-20'
                        }
                    }
                }
            };

            const result = SimulatorVoluntaryChangesService.getModelFlighVC(
                data,
                [0, 1],
                2
            );

            expect(result).toBe('twice');
            expect(data.flights[1].changeNewDate).toBeDefined();
            expect(data.flights[1].parseNewDate).toBeDefined();
        });

        it('should return "return" when only return flight is checked', () => {
            const data: any = {
                flights: {
                    0: {
                        checked: false,
                        departureDateParsed: {
                            originalDate: '2026-01-10'
                        }
                    },
                    1: {
                        checked: true,
                        departureDateParsed: {
                            originalDate: '2026-01-20'
                        }
                    }
                }
            };

            const result = SimulatorVoluntaryChangesService.getModelFlighVC(
                data,
                [0, 1],
                2
            );

            expect(result).toBe('return');
        });
    });
});
