import angular from "angular";

describe('ibMmbBookingDashboardSharedUtilsService test ', () => {

    let service, $rootScope, localStorageGetSpy, $q, localStorageService;

    const mockBidsUpgradingInfo = {
        "bidsSegments": [
            {
                "id": "IB044820240523",
                "availableCabins": [
                    {
                        "cabinType": "BUSINESS",
                        "minimumAllowedBid": 52,
                        "maximumExpectedBid": 195,
                        "avios": 0,
                        "free": 0,
                        "status": "OPEN",
                        "amountPax": 0,
                        "maxFraud": 3000
                    }
                ]
            }
        ],
        "ancillariesTrips": [
            {
                "id": "IB044820240523",
                "currentCabin": "Turista"
            }
        ]
    };
    
    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(() => { }),
        'updateLoggedDatalayer': jasmine.createSpy('updateLoggedDatalayer').and.callFake(() => { }),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(() => { }),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy(),
        'updateDatalayerViewEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerForAncillaries':jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy(),
        'updateDigitalDataForAncillaries': jasmine.createSpy(),
        'setAncillariesDatalayer': jasmine.createSpy(),
        'addDigitalDataInfo': jasmine.createSpy()
    };

    let fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(() => {
            return true;
        }),
        'getInfoHeader': jasmine.createSpy('getInfoHeader').and.callFake(() => {
            return true;
        }),
        'getURLFirstParameterByName': jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
            return {};
        }),
        'updateDinamicPricingDatalayer': jasmine.createSpy('updateDinamicPricingDatalayer').and.callFake(() => {
            return {};
        }),
        'generateAncillariesHeaderInfo': jasmine.createSpy('generateAncillariesHeaderInfo').and.callFake(() => {
            return {
                seats: [{
                    segments: [{
                        quanty: 2
                    }],
                    hasSeats: true,
                    total: {
                        total: 2
                    }
                }]
            };
        }),
        'transformSisterCitiesModel': jasmine.createSpy('transformSisterCitiesModel').and.callFake(() => {
            return {};
        }),
        'closeBasketHeader': jasmine.createSpy('closeBasketHeader').and.callFake(() => {
            return {};
        }),
        'checkFailedPendingPayments': jasmine.createSpy('checkFailedPendingPayments').and.callFake(() => {
            return {};
        }),
        'refreshToken': jasmine.createSpy('refreshToken').and.callFake(() => {
            return {};
        }),
        'newTransformSisterCitiesModel': jasmine.createSpy('newTransformSisterCitiesModel').and.callFake(() => {
            return {};
        }),
        'generateFlexAndDisruptedFlightsDatalayerInfo': jasmine.createSpy('generateFlexAndDisruptedFlightsDatalayerInfo').and.callFake(() => {
            return {};
        }),
        'getParameterByName': jasmine.createSpy('getParameterByName').and.callFake(() => {
            return {};
        }),
    };

    let fakeBookingDashboardModel = require('@test/mocks/storage/booking-dashboard-model-mock.json');
    fakeBookingDashboardModel.initializeModel = () => {};
    
    let fakeModalServiceAncillaries = {
        'isNotWaiting': jasmine.createSpy('isNotWaiting').and.callFake(() => { }),
        'showGenericError': jasmine.createSpy(),
        'openBidsModal': jasmine.createSpy('openBidsModal').and.callFake(() => {
             return {
                'result': $q.when()
            };
        }),
        'openCarbonFootprintModal': jasmine.createSpy('openCarbonFootprintModal').and.callFake(() => { }),
        'openBaggagesModal': jasmine.createSpy('openBaggagesModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openSpeqsModal': jasmine.createSpy('openSpeqsModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openPriorityBoardingModal': jasmine.createSpy('openPriorityBoardingModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openInsuranceModal': jasmine.createSpy('openInsuranceModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openSpecialMealsModal': jasmine.createSpy('openSpecialMealsModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'openActivitiesModal': jasmine.createSpy('openActivitiesModal').and.callFake(() => { }),
        'openActivitiesModifyModal': jasmine.createSpy('openActivitiesModifyModal').and.callFake(() => { }),
        'openTransfersModifyModal': jasmine.createSpy('openTransfersModifyModal').and.callFake(() => { }),
        'openTransfersModal': jasmine.createSpy('openTransfersModal').and.callFake(() => { }),
        'showWaitingModal': jasmine.createSpy('showWaitingModal').and.callFake(() => { }),
        'openInsuranceMMBAllianzFusionModal': jasmine.createSpy('openInsuranceMMBAllianzFusionModal').and.callFake(() => {
            return {
                'result': $q.when()
            };
        }),
        'showUpgradeModalFlow': jasmine.createSpy('showUpgradeModalFlow').and.callFake(() => {
            return {
                'result': $q.when()
            };
         }),
    };

    let fakeIbCPermanentUserService = {
        'isAfterLoginPermanentUser': jasmine.createSpy('isAfterLoginPermanentUser'),
        'removeParamsAfterLogin': jasmine.createSpy('removeParamsAfterLogin'),
        'checkPermanentUserFlow': jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'isAfterLoginBidsPermanentUser': jasmine.createSpy('isAfterLoginBidsPermanentUser').and.callFake(() => {
            return false;
        })

    };

    let fakeCommonsUserUtilsService = {'isSoftUser': jasmine.createSpy().and.returnValue( ()=>{return true} )};

    let fakeModelAncillariesInfo = {
        ancillariesAvailable: ['BAGGAGE', 'SPECIAL_EQUIPMENT' ],
        ancillariesTripsBaggages: {},
        ancillariesTripsSpeqs: {},
        ancillariesCarbonFootprint: {
            kilosCo2Equivalent: 5
        },
        bidsUpgradingInfo: {
            openBids: false,
            bidsAvailable: false
        },
        aviosUpgradingInfo: {
            aviosBidAvailable: false,
            waitingListAvailable: true
        },
        insuranceInfo: {
            insuranceCountry: {
                country: {
                    description: 'testOld'
                }
            },
            passengers: [{
                document: 'test',
                birthDate: 'test'
            }]
        },
        priorityBoardingInfo: {
            confirmed: true
        },
        ancillaries: [
            {
                type: 'THIRD_PARTY_COMPANIES',
                status: {
                    code: 'AVAILABLE'
                }
            }
        ],
        specialMealsInfo: {
            activeSegment: 'test',
            specialMealNumSelected: {}
        },
        ancillariesInsurance:[{
            descriptionCoverages: 'test',
            name: 'test',
            price: 0,
            originalPrice: 0,
            consent: true,
            code:'es',
            id:0

        }],
        insurance: '',
        selectedInsurance: true,
        seatsQuanty: 0,
        speqsQuanty: 1,
        passengerSpeqsTrips: [{
            trips: [{
                id: 0,
                pieces: [{
                    subtype: 'test',
                    quantySelected: 1
                }],
                speqsChoosed: 1
            }]
        }],
        baggagesQuanty: 1,
        passengerBaggagesTrips: [{
            trips: [{
                id: 0,
                pieces: [{
                    subtype: 'test',
                    quantySelected: 1
                }],
                piecesChoosed: 1
            }]
        }],
        preorderAncillarieInfo: {
            info: "test"
        }
    };
   
    let fakeocLazyLoad = {
        'load': jasmine.createSpy(),
    };

    let fakeModel = {
        passengerId: "ADULT_01",
        modifiedPersonalInfo: false,
        personalInfo: { name: 'testname', surname: 'test', birthDate: '' },
        showUpdatePersonalInfo: '',
        managementModel: {
            managePassengers: [{
                passengerId: 'ADULT_01',
                personalInfo: {
                    name: 'testname',
                    surname: 'test',
                    birthDate: ''
                },
                modifiedPersonalInfo: false
            }]
        },
        summaryModel: {
            infoAncillaries: {
                seat: {}
            }
        },
        ancillariesInfo: {
            ancillariesTransfersGlobick: {},
            ancillariesActivitiesGlobick: {},
            insuranceInfo: {
                insuranceCountry: ''
            }
        },
        tabs: {
            management: { name: 'management' },
            customize: { name: 'customize' },
            complete: { name: 'complete' },
            stopover: { name: 'stopover' },
            flights: { name: 'flights' },
            changeFlights: { name: 'changeFlights', isSubtab: true },
            simulatorChangeFlights: { name: 'simulatorChangeFlights' },
            refunds: { name: 'refunds' },
            passengers: { name: 'passengers' },
            documents: { name: 'documents' },
            invoices: { name: 'invoices' }
        }
    };

    let fakeConfirmationDigitalInfo = {
        UserLevel: true,
    };

    const setupProviders = ($provide) => {
        $provide.value('MmBUtilService', fakeMmBUtilService);
        $provide.value('ModalServiceAncillaries', fakeModalServiceAncillaries);
        $provide.value('$ocLazyLoad', fakeocLazyLoad);
        $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
        $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
        $provide.value('IbCPermanentUserService', fakeIbCPermanentUserService);
    };

    const setupSpiesAndMocks = (_localStorageService_) => {
        localStorageService = _localStorageService_;
        // Clear localStorage before each test
        if (typeof localStorageService.clear === 'function') {
            localStorageService.clear();
        } else if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
        }
        localStorageGetSpy = spyOn(localStorageService, 'get');
        spyOn(localStorageService, 'set');
    };

    beforeEach(() => {
        angular.mock.module(
            'ib-MmB-booking-dashboard-module',
            'LocalStorageModule',
            'ib-MmB-services-module',
            setupProviders
        );

        inject((_$rootScope_, _BookingDashboardSharedUtilsService_, _localStorageService_, _$q_) => {
            $rootScope = _$rootScope_;
            service = _BookingDashboardSharedUtilsService_;
            $q = _$q_;
            setupSpiesAndMocks(_localStorageService_);
        });

        service.model = fakeModel;
        localStorageGetSpy.withArgs('confirmationDigitalInfo').and.returnValue(fakeConfirmationDigitalInfo);
        localStorageGetSpy.withArgs('flowUpgradeMMB').and.returnValue('aviosFlow');

        $rootScope.$digest();
    });

    describe('when activate() is called', () => {
        it('ibMmbBookingDashboardComponent should be defined', (done) => {
            expect(service).toBeDefined();
            done();
        });
    });

    describe('when handleUpgradeFlow() is called', () => {
        let sameCase = (done) => {
            service.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            service.model.ancillariesInfo.bidsUpgradingInfo.bidsAvailable = true;

            let fakeExpected = {
                aviosBidAvailable: false,
                waitingListAvailable: true
            };

            service.handleUpgradeFlow();
            $rootScope.$digest();
            expect(service.model.ancillariesInfo.aviosUpgradingInfo).toEqual(fakeExpected);
            done();
        };
        it('and ShowUpgradeModal return true and resolve showUpgradeModalFlow', (done) => {
            fakeModalServiceAncillaries.showUpgradeModalFlow = jasmine.createSpy('showUpgradeModalFlow').and.callFake(() => {
                return {
                    'result': $q.when()
                };
            });
            sameCase(done);
        });

        it('and ShowUpgradeModal return true and reject showUpgradeModalFlow', (done) => {
            fakeModalServiceAncillaries.showUpgradeModalFlow = jasmine.createSpy('showUpgradeModalFlow').and.callFake(() => {
                return {
                    'result': $q.reject({})
                };
            });
            sameCase(done);
        });

        it('and ShowUpgradeModal return false', (done) => {
            fakeModalServiceAncillaries.openBidsModal = jasmine.createSpy('openBidsModal').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });
            service.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            service.model.ancillariesInfo.bidsUpgradingInfo.bidsAvailable = false;
            service.model.ancillariesInfo.aviosUpgradingInfo = false;
            service.handleUpgradeFlow();
            $rootScope.$digest();
            expect(service.model.ancillariesInfo.aviosUpgradingInfo).toEqual({});
            done();
        });
    });

    describe('when openUpgradeModal () is called', () => {
        beforeEach(() => {
            service.model.ancillariesInfo = {...fakeModelAncillariesInfo};
        });
        it('is Permanent User should set aviosBidAvailable to false', (done) => {
            service.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            const aviosUpgradingInfo = service.model.ancillariesInfo.aviosUpgradingInfo;
            fakeIbCPermanentUserService.isAfterLoginPermanentUser.and.returnValue(true);
            fakeIbCPermanentUserService.checkPermanentUserFlow = jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
                return Promise.resolve({});
            });
            service.openUpgradeModal();
            expect(aviosUpgradingInfo.aviosBidAvailable).toBe(false);
            done();
        });

        it('case aviosFlow should openBidsModal', (done) => {
            service.model.ancillariesInfo = {...fakeModelAncillariesInfo};
            localStorageGetSpy.withArgs('flowUpgradeMMB').and.returnValue('aviosFlow');
            const checkFlow = localStorageService.get('flowUpgradeMMB');
            fakeIbCPermanentUserService.checkPermanentUserFlow = jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
                return Promise.resolve({});
            });
            fakeIbCPermanentUserService.checkPermanentUserFlow('upgradingAvios').then((response) => {
                expect(fakeModalServiceAncillaries.openBidsModal).toBeDefined();
            });
            service.openUpgradeModal();
            expect(checkFlow).toBe('aviosFlow');
            done();
        });
        it('case aviosBidFlow should openBidsModal', (done) => {
            localStorageGetSpy.withArgs('flowUpgradeMMB').and.returnValue('aviosBidFlow');
            const checkFlow = localStorageService.get('flowUpgradeMMB');
            fakeIbCPermanentUserService.checkPermanentUserFlow = jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
                return Promise.resolve({});
            });
            service.openUpgradeModal();
            expect(checkFlow).toBe('aviosBidFlow');
            done();
        });
        it('case bidFlow should openBidsModal', (done) => {
            service.model.ancillariesInfo = {
                bidsUpgradingInfo: mockBidsUpgradingInfo,
                aviosUpgradingInfo: mockBidsUpgradingInfo
            };
            localStorageGetSpy.withArgs('flowUpgradeMMB').and.returnValue('bidFlow');
            const checkFlow = localStorageService.get('flowUpgradeMMB');
            fakeIbCPermanentUserService.checkPermanentUserFlow = jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
                return Promise.resolve({});
            });
            fakeIbCPermanentUserService.checkPermanentUserFlow('upgradingBids').then((response) => {
                expect(fakeModalServiceAncillaries.openBidsModal).toBeDefined();
            });
            service.openUpgradeModal();
            expect(checkFlow).toBe('bidFlow');
            done();
        });
        it('case waitingList should openBidsModal', (done) => {
            localStorageGetSpy.withArgs('flowUpgradeMMB').and.returnValue('waitingList');
            const checkFlow = localStorageService.get('flowUpgradeMMB');
            fakeIbCPermanentUserService.checkPermanentUserFlow = jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
                return Promise.resolve({});
            });
            fakeIbCPermanentUserService.checkPermanentUserFlow('upgradingBids').then((response) => {
                expect(fakeModalServiceAncillaries.openBidsModal).toBeDefined();
            });
            service.openUpgradeModal();
            expect(checkFlow).toBe('waitingList');
            done();
        });
    });

    
    describe('When openUpgradeModal is called', () => {
        beforeEach(() => {
            fakeIbCPermanentUserService.checkPermanentUserFlow.calls.reset();
            fakeModalServiceAncillaries.openBidsModal.calls.reset();
        })

        it('should call checkPermanentUserFlow with upgradingAvios argument if flow === aviosFlow',(done) => {
            fakeIbCPermanentUserService.checkPermanentUserFlow.and.returnValue(Promise.resolve());
            fakeModalServiceAncillaries.openBidsModal = jasmine.createSpy('openBidsModal').and.callFake(() => {
                return {
                    'result': $q.reject({})
                };
            });

            const upgradeFlow = 'aviosFlow';

            service.openUpgradeModal(upgradeFlow);
            $rootScope.$digest();

            expect(fakeIbCPermanentUserService.checkPermanentUserFlow).toHaveBeenCalledWith('upgradingAvios');
            done();
        });

        it('should call checkPermanentUserFlow with upgradingBidsAvios argument if flow === aviosBidFlow', (done) => {
            fakeIbCPermanentUserService.checkPermanentUserFlow.and.returnValue(Promise.reject());

            const upgradeFlow = 'aviosBidFlow';

            service.openUpgradeModal(upgradeFlow);
            $rootScope.$digest();
            
            expect(fakeIbCPermanentUserService.checkPermanentUserFlow).toHaveBeenCalledWith('upgradingBidsAvios');
            done();
        });

        it('should call checkPermanentUserFlow with upgradingBids argument if flow === bidFlow', (done) => {
            fakeIbCPermanentUserService.checkPermanentUserFlow.and.returnValue(Promise.resolve());
            fakeModalServiceAncillaries.openBidsModal = jasmine.createSpy('openBidsModal').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });

            service.model.ancillariesInfo = {
                bidsUpgradingInfo: mockBidsUpgradingInfo,
                aviosUpgradingInfo: mockBidsUpgradingInfo
            };

            const upgradeFlow = 'bidFlow';

            service.openUpgradeModal(upgradeFlow);
            $rootScope.$digest();

            expect(fakeIbCPermanentUserService.checkPermanentUserFlow).toHaveBeenCalledWith('upgradingBids');
            done();
        });

        it('should call checkPermanentUserFlow with upgradingAvios argument if flow === waitingList', (done) => {
            fakeIbCPermanentUserService.checkPermanentUserFlow.and.returnValue(Promise.resolve());
            fakeModalServiceAncillaries.openBidsModal = jasmine.createSpy('openBidsModal').and.callFake(() => {
                return {
                    'result': $q.when({})
                };
            });
            service.model.ancillariesInfo = {
                bidsUpgradingInfo: mockBidsUpgradingInfo,
                aviosUpgradingInfo: mockBidsUpgradingInfo
            };

            const upgradeFlow = 'waitingList';

            service.openUpgradeModal(upgradeFlow);
            $rootScope.$digest();

            expect(fakeIbCPermanentUserService.checkPermanentUserFlow).toHaveBeenCalledWith('upgradingAvios');
            done();
        });
    });
});
