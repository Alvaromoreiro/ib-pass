describe('checkInConfirmationController Test', () => {

    let checkInConfirmationController, $q;

    const bindings = {};

    const fake$rootScope = {
        appMarket: 'ES',
        '$new': jasmine.createSpy().and.callFake(()=>{return null;}),
        '$broadcast': jasmine.createSpy().and.callFake(()=>{})
    };

    const controllerDependencies = {
        '$scope': {} as any,
        '$rootScope': fake$rootScope,
        '$element': { addClass: jasmine.createSpy('addClass') }
    };

    const fakeLocalStorageService = {
        get: jasmine.createSpy().and.callFake(() => {return null;}),
        set: jasmine.createSpy().and.callFake(()=>{})
    };

    const fakePmtConstants = {
        ANCILLARIES_TYPES: {
            CO2_FOOTPRINT: 'CO2_FOOTPRINT'
        }
    };

    const fakeCurrencyService = {

    };

    const fakeGetAirlinesService = {

    };

    const fakeCloseSessionService = {

    };

    const fakePmtAssFassAncillariesService = {

    };

    const fakeCommonsGenericProxy = {

    };

    const fakeCommonsNewHttpUtilsErrorService = {

    };

    const fakeDatalayerUtilsService = {

    };

    const fakePmtDatalayerConstants = {

    };

    const fakeDeviceDetector = {

    };

    const fakeSearchFlightsPassengersService = {

    };

    const fakePmtGetCachedInformationService = {

    };

    const fakeMonetateUtilsService = {

    };

    const fakePmtRedirectionService = {

    };

    const fakePmtModalService = {
        showWaitingModal: jasmine.createSpy().and.callFake(()=>{}),
        finishWaiting: jasmine.createSpy().and.callFake(()=>{}),
        closeAllCurrentModals: jasmine.createSpy().and.callFake(()=>{})
    };

    const fakePmtUtilsService = {
        isObject: jasmine.createSpy().and.callFake(()=>false)
    };

    const fakeCommonsUtilService = {

    };

    const fakePmtUtilsTransformers = {

    };

    const fakeDatalayerConstants = {

    };

    const fakeDatalayerGeneralConstants = {

    };

    const fakeDigitalDataService = {

    };

    const fakeDatalayerEcommerceUtilsService = {
        setAddPurchase: jasmine.createSpy().and.callFake(()=>{})
    };

    const fakeConfirmationService = {
        searchConfirmationInfo: jasmine.createSpy().and.callFake(() => {
            const deferred = $q.defer();
            const response = deferred.promise;
            deferred.resolve({
                confirmInfo: {
                    boardingCards: [
                        {
                            departure: {
                                airport: {
                                    code: 'MAD'
                                }
                            },
                            arrival: {
                                airport: {
                                    code: 'BCN'
                                }
                            },
                            cabinClass: 'economy',
                            passengers: [
                                {
                                    name: 'John'
                                }
                            ]
                        }
                    ]  
                },
                co2Info: {
                    price: 1.08,
                    priceFormatted: '1.08€',
                    kilosCo2Equivalent: 50.8,
                    kilosCo2EquivalentFormatted: '50,8'
                },
                rightPanelInfo: {
                    fastTrackSegments: [],
                    vipSegments: []
                }
            });
            return response;
        })
    };

    beforeEach(() => {
        angular.mock.module('ib-check-in-confirmation-module', ($provide) => {
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('GetAirlinesService', fakeGetAirlinesService);
            $provide.value('CloseSessionService', fakeCloseSessionService);
            $provide.value('PmtAssFassAncillariesService', fakePmtAssFassAncillariesService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('PmtDatalayerConstants', fakePmtDatalayerConstants);
            $provide.value('deviceDetector', fakeDeviceDetector);
            $provide.value('SearchFlightsPassengersService', fakeSearchFlightsPassengersService);
            $provide.value('PmtGetCachedInformationService', fakePmtGetCachedInformationService);
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('pmtRedirectionService', fakePmtRedirectionService);
            $provide.value('PmtModalService', fakePmtModalService);
            $provide.value('PmtUtilsService', fakePmtUtilsService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('PmtUtilsTransformers', fakePmtUtilsTransformers);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('DatalayerGeneralConstants', fakeDatalayerGeneralConstants);
            $provide.value('DigitalDataService', fakeDigitalDataService);
            $provide.value('DatalayerEcommerceUtilsService', fakeDatalayerEcommerceUtilsService);
            $provide.value('ConfirmationService', fakeConfirmationService);
        });
        inject((_$rootScope_, _$componentController_, _$q_) => {
            controllerDependencies.$scope = _$rootScope_.$new();
            checkInConfirmationController = _$componentController_('ibCheckInConfirmation', controllerDependencies, bindings);
            controllerDependencies.$scope.$apply();
            $q = _$q_;
        });
    });

    xdescribe('checkInConfirmationController is initialized', () => {

        it('should be defined', () => {
            expect(checkInConfirmationController).toBeDefined();
        });
    });

    xdescribe('checkInConfirmationController should init', () => {

        it('should populate co2 info', () => {
            checkInConfirmationController.$onInit();

            controllerDependencies.$scope.$digest();

            expect(checkInConfirmationController.model.co2Info).toEqual({
                kilosCo2Equivalent: 50.8,
                kilosCo2EquivalentFormatted: '50,8',
                price: 1.08,
                priceFormatted: '1.08€'
            });
        });

        it('should populate co2InfoBannerModel', () => {
            checkInConfirmationController.$onInit();

            controllerDependencies.$scope.$digest();

            expect(checkInConfirmationController.co2InfoBannerModel).toEqual({
                name: 'John',
                kilosCo2eFormatted: '50,8',
                priceFormatted: '1.08€',
                flight: {
                    numPax: 1,
                    segments: [
                        {
                            from: 'MAD',
                            to: 'BCN',
                            cabin: 'economy'
                        }
                    ]
                }
            });
        });

        it('should show carbon footprint banner', () => {
            checkInConfirmationController.$onInit();

            controllerDependencies.$scope.$digest();

            expect(checkInConfirmationController.showCarbonFootprintBanner).toBe(true);
        });
    }); 

    xdescribe('checkInConfirmationController displayCarbonFootprintBanner', () => {

        beforeEach(() => {
            checkInConfirmationController.model.co2Info = {
                kilosCo2e: 50.2,
                kilosCo2eFormatted: '50,2',
                price: '1,02€',
                hasCarbonFootprint: true
            };
            checkInConfirmationController.model.confirmInfo.boardingCards = [{
                passengers: [{
                    name: 'John'
                }],
                departure: {
                    airport: {
                        code: 'MAD'
                    }
                },
                arrival: {
                    airport: {
                        code: 'OVD'
                    }
                },
                cabinClass: 'ECONOMY'
            }];
        });

        afterEach(() => {
            checkInConfirmationController.model.co2Info = null;
            checkInConfirmationController.model.confirmInfo = null;
            fakeLocalStorageService.get = jasmine.createSpy().and.callFake(()=>{return null;});
        });

        it('should not show banner if purchased in CKI flow', () => {
            checkInConfirmationController.model.carbonFootprint = {
                hasCarbonFootprint: true,
                total: 1.02,
                totalFormatted: '1,02€',
                kilosCo2Equivalent: 50.2,
                kilosCo2EquivalentFormatted: '50,2'            
            };
            
            checkInConfirmationController.displayCarbonFootprintBanner();

            expect(checkInConfirmationController.showCarbonFootprintBanner).toBeFalse();
        });

        it('should not show banner if already purchased', () => {
            checkInConfirmationController.model.carbonFootprint = {
                hasCarbonFootprint: false
            };

            fakeLocalStorageService.get = jasmine.createSpy().and.callFake((key: string) => {
                if (key === 'summaryInfo') {
                    return {
                        issuedItems: [{
                            type: 'CO2_FOOTPRINT',
                            orderId: 'orderId'
                        }]
                    };
                }

                return null;
            });

            checkInConfirmationController.displayCarbonFootprintBanner();

            expect(checkInConfirmationController.showCarbonFootprintBanner).toBeFalse();
        });

        it('should show banner if not already purchased', () => {
            checkInConfirmationController.model.carbonFootprint = {
                hasCarbonFootprint: false
            };

            checkInConfirmationController.displayCarbonFootprintBanner();

            expect(checkInConfirmationController.showCarbonFootprintBanner).toBeTrue();
        });

        it('should not show banner if co2Info is null', () => {
            checkInConfirmationController.model.co2Info = null;

            checkInConfirmationController.displayCarbonFootprintBanner();

            expect(checkInConfirmationController.showCarbonFootprintBanner).toBeFalse();
        });
    });
});