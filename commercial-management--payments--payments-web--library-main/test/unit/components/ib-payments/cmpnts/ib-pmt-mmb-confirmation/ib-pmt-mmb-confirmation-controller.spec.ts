describe('ConfirmationMMbController Test', () => {

    let ConfirmationMMbController, rootScope;

    const fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy().and.callFake(()=>{}),
        sendDatalayerEvent: jasmine.createSpy().and.callFake(()=>{}),
        updateDigitalDataWithQuadrigam: jasmine.createSpy().and.callFake(() => {}),
        addDataLayerInfo: jasmine.createSpy().and.callFake(() => {}),
        addDigitalDataInfo: jasmine.createSpy().and.callFake(() => {}),
        setProcessAndStep: jasmine.createSpy().and.callFake(() => {})
    };

    function getAddDigitalDataInfoCalls () {
        return (fakeDatalayerUtilsService.addDigitalDataInfo as any).calls.allArgs().map((args) => args[0]);
    }
    const fakeDatalayerEcommerceUtilsService = {
        updateDatalayerInfoPayments: jasmine.createSpy().and.callFake(() => {return {};}),
        addDataLayerEcommerceInfo: jasmine.createSpy().and.callFake(() => {}),
        setAddPurchase: jasmine.createSpy().and.callFake(() => {})
    };
    const fakePmtDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            VIEW: 'view'
        },
        DATALAYER_VALUES: {
            DISRUPTED: 'DISRUPTED',
            FLEXIBLE: 'FLEXIBLE',
            NON_FLEXIBLE: 'NON_FLEXIBLE'
        }
    };
    const fakePmtUtilsService = {
        isUserLogged: jasmine.createSpy().and.returnValue(false)
    };
    const fakePmtConstants = {
        APP_TYPES: {
            MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC',
            MANAGEMYBOOKING_UNIFIED: 'MMBUNIF'
        },
        ORDER_ITEMS_TYPES: {
            CO2_FOOTPRINT: 'co2Footprint'
        },
        QUADRIGAMS: {
            MMB_ANCILLARIES_CONFIRMATION: 'confirmation'
        }
    };
    let bookingInfo: any = {
        order: {
            slices: [],
            status: 'ISSUED'
        }
    };
    let headerModel: any = {
        headerModel: {
            shoppingBasket: {}
        }
    };

    const fakeLocalStorageService = {
        get: jasmine.createSpy().and.callFake((key: string)=>{
            if (key === 'bookingInfo') {
                return bookingInfo;
            } else if (key === 'issueOrderInfo') {
                return {
                    currencies: [
                        {
                            code: 'EUR',
                            description: 'Euro',
                            symbol: '€',
                            alignment: 'R',
                            groupingSeparator: ',',
                            decimalSeparator: '.',
                            decimals: 2,
                            recommendedDisplay: 'symbol'
                        }
                    ],
                    total: 50.2
                };
            } else if (key === 'headerModel') {
                return headerModel;
            } else if (key === 'mmbAncillariesPaymentSummaryModel') {
                return {};
            } else if (key === 'paymentsInfo') {
                return { 
                    appliedDiscounts: {}
                };
            } else if (key === 'pmtModelInfo') {
                return {
                    quadrigams: {
                        confirmation: ''
                    }
                };
            } else if (key === 'breakdownInfo') {
                return {};
            }
            return null;
        }),
        set: jasmine.createSpy().and.callFake(()=>{return null;}),
        remove: jasmine.createSpy('remove')
    };
    const fakeCurrencyService = {
        getCurrencyObject: jasmine.createSpy().and.callFake(() =>{return null;}),
        formatPrice: jasmine.createSpy().and.callFake((price: number) =>{return `${price}€`;})
    };
    const fakePmtDatalayerUtilsService = {};
    const fakeCommonsUtilService = {};
    const fakeDigitalDataService = {
        emitViewEvent: jasmine.createSpy().and.callFake(() => {})
    };
    const fakeDatalayerGeneralConstants = {};
    const fakeDatalayerMMBConstants = {
        DIGITAL_DATA_PROCESS: {
            MOBKCF: ''
        },
        DIGITAL_DATA_STEP: {
            MOBKCF: ''
        }
    };
    const co2Info = {
        kilosCo2Equivalent: 50.2,
        kilosCo2EquivalentFormatted: '50,2',
        price: 1.08,
        priceFormatted: '1.08€'
    };
    const fakePmtMmbConfirmationTransformer = {
        transformInfoConfirmation: jasmine.createSpy().and.callFake(()=>{return {};}),
        transformCO2InfoConfirmation: jasmine.createSpy().and.callFake(()=>{
            return co2Info;
        })
    };

    const fakePmtModalService = {
        showGenericModal: jasmine.createSpy().and.callFake(() => {})
    };
    const fakeibMarketingPermissionService = {
        getMarketingPermissions: jasmine.createSpy().and.callFake(() => {})
    };
    const fakeCommonsUserUtilsService = {
        isIbPlus: jasmine.createSpy().and.callFake(() => {}),
        isUserLoggedONB: jasmine.createSpy().and.callFake(() => {}),
        isUserLogged: jasmine.createSpy('isUserLogged').and.returnValue(true),
        isIbZero: jasmine.createSpy('isIbZero').and.returnValue(false)
    };
    const fakeCommonsCookiesService = {
        getCookie: jasmine.createSpy().and.callFake(() => {}),
        setCookieTime: jasmine.createSpy().and.callFake(() => {})
    };
    const fakeCommonsSessionStorageService = {
        get: jasmine.createSpy().and.callFake(() => {})
    };

    beforeEach(() => {
        angular.mock.module('ib-pmt-mmb-confirmation-module', ($provide) => {
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DatalayerEcommerceUtilsService', fakeDatalayerEcommerceUtilsService);
            $provide.value('PmtDatalayerConstants', fakePmtDatalayerConstants);
            $provide.value('PmtUtilsService', fakePmtUtilsService);
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('PmtDatalayerUtilsService', fakePmtDatalayerUtilsService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DigitalDataService', fakeDigitalDataService);
            $provide.value('DatalayerGeneralConstants', fakeDatalayerGeneralConstants);
            $provide.value('DatalayerMMBConstants', fakeDatalayerMMBConstants);
            $provide.value('PmtMmbConfirmationTransformer', fakePmtMmbConfirmationTransformer);
            $provide.value('PmtModalService', fakePmtModalService);
            $provide.value('ibMarketingPermissionService', fakeibMarketingPermissionService);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('CommonsCookiesService', fakeCommonsCookiesService);
            $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
        });
        inject(($controller, $rootScope) => {
            rootScope = $rootScope.$new();
            rootScope.production = 'false';

            ConfirmationMMbController = $controller('ConfirmationMMbController', {
                $scope:rootScope.$new(),
                $rootScope :rootScope
            }, {});
            
            $rootScope.$apply();
        });
    });

    describe('ConfirmationMMbController is initialized', () => {

        it('should be defined', () => {
            expect(ConfirmationMMbController).toBeDefined();
        });

        it('should call addDigitalDataInfo with Reference', () => {
            const pnr = 'KZ0UI';
            // El mock actual de localStorageService.get no lee lo que se haga con set(),
            // así que forzamos específicamente la respuesta para la key 'PNR'
            (fakeLocalStorageService.get as jasmine.Spy).withArgs('PNR').and.returnValue(pnr);

            recreateController();

            const digitalDataCalls = getAddDigitalDataInfoCalls();
            expect(digitalDataCalls).toContain({ Reference: pnr });
        });

        it('should call addDigitalDataInfo with PNRType NON_FLEXIBLE by default (getPNRType + determinePNRType)', () => {
            const digitalDataCalls = getAddDigitalDataInfoCalls();
            expect(digitalDataCalls).toContain({ PNRType: fakePmtDatalayerConstants.DATALAYER_VALUES.NON_FLEXIBLE });
        });

        it('should call addDigitalDataInfo with PNRType DISRUPTED when booking has generic disruption info', () => {
            bookingInfo.genericDisruptionCapabilitiesInformation = {};
            recreateController();

            const digitalDataCalls = getAddDigitalDataInfoCalls();
            expect(digitalDataCalls).toContain({ PNRType: fakePmtDatalayerConstants.DATALAYER_VALUES.DISRUPTED });

            delete bookingInfo.genericDisruptionCapabilitiesInformation;
        });

        it('should call addDigitalDataInfo with PNRType FLEXIBLE when booking has flexibility info and order is ISSUED', () => {
            bookingInfo.flexibilizationCapabilitiesInformation = {};
            bookingInfo.order.status = 'ISSUED';
            recreateController();

            const digitalDataCalls = getAddDigitalDataInfoCalls();
            expect(digitalDataCalls).toContain({ PNRType: fakePmtDatalayerConstants.DATALAYER_VALUES.FLEXIBLE });

            delete bookingInfo.flexibilizationCapabilitiesInformation;
        });

        it('should call addDigitalDataInfo with PNRType DISRUPTED when booking has flexibility info and order is not ISSUED', () => {
            bookingInfo.flexibilizationCapabilitiesInformation = {};
            bookingInfo.order.status = 'PENDING';
            recreateController();

            const digitalDataCalls = getAddDigitalDataInfoCalls();
            expect(digitalDataCalls).toContain({ PNRType: fakePmtDatalayerConstants.DATALAYER_VALUES.DISRUPTED });

            delete bookingInfo.flexibilizationCapabilitiesInformation;
            bookingInfo.order.status = 'ISSUED';
        });


        it('should read co2Info into model', () => {
            expect(ConfirmationMMbController.model.co2Info).toEqual(co2Info);
            expect(ConfirmationMMbController.showCarbonFootprintBanner).toBe(true);
        });

        it('should create empty co2InfoBannerModel', () => {
            expect(ConfirmationMMbController.co2InfoBannerModel).toEqual({
                name: undefined,
                kilosCo2eFormatted: '50,2',
                priceFormatted: '1.08€',
                flight: {
                    numPax: 0,
                    segments: []
                }
            });
        });

        describe('and has passenger with externalPersonalInfo', () => {
            
            beforeEach(() => {
                bookingInfo.passengers = [
                    {
                        externalPersonalInfo: {
                            name: 'John'
                        }
                    }
                ];

                recreateController();
            });

            it('should load first passenger name from externalPersonalInfo', () => {
                expect(ConfirmationMMbController.firstPassengerName).toBe('John');
            });

            afterEach(() => {
                bookingInfo.passengers = null;
            });
        });

        describe('and has passenger with personalInfo', () => {
            beforeEach(() => {
                bookingInfo.passengers = [
                    {
                        personalInfo: {
                            name: 'MIKE'
                        }
                    }
                ];

                recreateController();
            });

            it('should load first passenger name from personalInfo', () => {
                expect(ConfirmationMMbController.firstPassengerName).toBe('MIKE');
            });

            afterEach(() => {
                bookingInfo.passengers = null;
            });
        });

        describe('and has passengers and segments', () => {
            beforeEach(() => {
                bookingInfo.passengers = [
                    {
                        externalPersonalInfo: {
                            name: 'John'
                        },
                        personalInfo: {
                            name: 'JOHN'
                        }
                    }
                ];
                bookingInfo.order.slices = [
                    {
                        segments: [
                            {
                                departure: {
                                    code: 'MAD'
                                },
                                arrival: {
                                    code: 'BCN'
                                },
                                cabin: {
                                    type: 'economy'
                                }
                            }
                        ]
                    }
                ];
    
                recreateController();
            });

            it('should read co2InfoBannerModel from passengers and segments', () => {
                expect(ConfirmationMMbController.co2InfoBannerModel).toEqual({
                    name: 'John',
                    kilosCo2eFormatted: '50,2',
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

            afterEach(() => {
                bookingInfo.passengers = null;
                bookingInfo.order.slices = [];
            });
        });

        describe('and has carbon footprint on shopping basket', () => {
            beforeEach(() => {
                headerModel.headerModel.shoppingBasket.carbonFootprint = {
                    hasCarbonFootprint: true
                };

                recreateController();
            });

            it('should have showCarbonFootprintBanner set to false', () => {
                expect(ConfirmationMMbController.showCarbonFootprintBanner).toBe(false);
            });

            afterEach(() => {
                headerModel.headerModel.shoppingBasket = {};
            });
        });

        describe('and has already purchased carbon footprint', () => {
            beforeEach(() => {
                bookingInfo.order.orderItems = [
                    {
                        type: 'co2Footprint',
                        orderId: 'orderId'
                    }
                ];

                recreateController();
            });

            it('should have showCarbonFootprintBanner set to false', () => {
                expect(ConfirmationMMbController.showCarbonFootprintBanner).toBeFalse();
            });

            afterEach(() => {
                delete bookingInfo.order.orderItems;
            });
        });

        describe('and has null co2Info', () => {
            beforeEach(() => {
                fakePmtMmbConfirmationTransformer.transformCO2InfoConfirmation = jasmine.createSpy().and.callFake(()=>null);

                recreateController();
            });

            it('should have showCarbonFootprintBanner set to false', () => {
                expect(ConfirmationMMbController.showCarbonFootprintBanner).toBeFalse();
            });

            afterEach(() => {
                fakePmtMmbConfirmationTransformer.transformCO2InfoConfirmation = jasmine.createSpy().and.callFake(()=>co2Info);
            });
        });
    });

    function recreateController () {
        inject(($controller) => {
            ConfirmationMMbController = $controller('ConfirmationMMbController', {
                $scope:rootScope.$new(),
                $rootScope :rootScope
            }, {});
            
            rootScope.$apply();
        });
    }
});
