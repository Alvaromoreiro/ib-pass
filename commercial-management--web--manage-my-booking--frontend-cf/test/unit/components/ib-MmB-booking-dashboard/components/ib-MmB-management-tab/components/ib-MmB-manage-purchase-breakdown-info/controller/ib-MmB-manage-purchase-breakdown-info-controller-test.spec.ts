describe('MmBManagePurchaseBreakdownInfoController test', () => {
    var controller, $scope, localStorageService, $rootScope, $controller, CurrencyService;

    var whatPassenger = {}

    var $filterFake = jasmine.createSpy('$filter').and.callFake((filter) => {
        var filterFunc = () => {
            return ('');
        };
        switch (filter) {
            case 'translate':
                filterFunc = () => {
                    return 'Translated Text';
                };
                break;
            case 'LinksFilter':
                filterFunc = () => {
                    return 'Linked Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var fakeBookingInfo1 = {
        order: {
            bookingReferences: [{
                reference: 'V6X6LR',
                provider: 'IB'
            }]
        }
    };
    var fakeBookingInfo2 = {
        order: {
            bookingReferences: [{
                reference: 'V6X6LR',
                provider: '1A'
            }]
        }
    };

    var fakeCurrencyService = {
        'getCurrencyObject': jasmine.createSpy('getCurrencyObject'),
        'formatPrice': jasmine.createSpy('formatPrice').and.callFake(() => { return '/^\s+|\s+$/gm' }),
        'formatAvios': jasmine.createSpy('formatAvios'),
        'getCurrenciesAsMap': () => {
            return {};
        }
    };

    var fakeMmBAppConstants = {
        IBERIA_HOLIDAYS: {
            'MMB_IB_VACIONES_TYPE_PACKAGE': 'flight+hotel',
            'MMB_IB_VACIONES_TYPE_PACKAGE_HOTEL': 'hotel',
            'MMB_IB_VACIONES_TYPE_PACKAGE_VEHICLE': 'vehicle',
            'MMB_IB_VACIONES_TYPE_PACKAGE_FLIGHT_ITINERARY': 'flightItinerary',
            'MMB_IB_VACIONES_TYPE_LINK_AVIS': '../../iberia-web-content/iconos/IB_Vacaciones/AVIS_RED@2x.svg',
            'MMB_IB_VACIONES_TYPE_LINK_BUDGET': '../../iberia-web-content/iconos/IB_Vacaciones/Budget_logo.svg',
            'MMB_IB_VACIONES_TYPE_COMPANY_CAR_AVIS': 'ZI',
            'MMB_IB_VACIONES_TYPE_COMPANY_CAR_BUDGET': 'ZD',
            'MMB_IB_VACIONES_TYPE_NEGATIVE': ' - ',
            'MMB_IB_VACIONES_TYPE_SPACE': ' '
        }
    }

    var fakeMmBModalService = { showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => { }) }

    var fakeMmBPurchaseBreakdownInfoModel = {
        packagedProduct: [
            {
                payment: {
                    pending: {
                        symbolBreakdown: ',',
                        total: 100
                    },
                    payments: [
                        {
                            additionalPayment: true,
                            total: 70.3
                        },
                        {
                            additionalPayment: true,
                            total: 70
                        }
                    ]
                },
                totalPrice: {
                    total: 50,
                    currency: 'EUR'
                },
                packagePrice: {
                    total: 20,
                },
                products: [{
                    type: 'flightItinerary',
                    packaged: true,
                    price: {
                        total: 200
                    }
                }]
            }, {
                payment: {
                    pending: {
                        symbolBreakdown: ',',
                        total: 100.3
                    },
                    payments: [
                        {
                            additionalPayment: false,
                            total: 70.3
                        },
                        {
                            additionalPayment: false,
                            total: 70
                        }
                    ]
                },
                totalPrice: {
                    total: 50,
                    currency: 'EUR'
                },
                products: [{
                    type: 'hotel',
                    packaged: true,
                    price: {
                        total: 200
                    }
                }]
            }, {
                payment: {
                    pending: {
                        symbolBreakdown: ',',
                        total: 100.3
                    },
                    payments: [
                        {
                            additionalPayment: false,
                            total: 70.3
                        },
                        {
                            additionalPayment: false,
                            total: 70
                        }
                    ]
                },
                totalPrice: {
                    total: 50.1,
                    currency: 'EUR'
                },
                products: [{
                    type: 'hotel',
                    packaged: true,
                    price: {
                        total: 200
                    }
                }]
            },{
                payment: {
                    pending: {
                        symbolBreakdown: ',',
                        total: 100
                    },
                    fees: [
                        {
                            code: 'CC',
                            amount: 10
                        },
                        {
                            code: 'CC',
                            amount: 0
                        }, {
                            code: 'OB',
                            amount: 10
                        },
                        {
                            code: 'OB',
                            amount: 0
                        },
                        {
                            code: 'AA',
                            amount: 10
                        },
                        {
                            code: 'AA',
                            amount: 0
                        }
                    ],
                    payments: [
                        {
                            additionalPayment: false,
                            total: 70
                        }
                    ]
                },
                totalPrice: {
                    total: 50,
                    currency: 'EUR'
                },
                products: [{
                    type: 'hotel',
                    packaged: true,
                    price: {
                        total: 200
                    }
                }]
            },{
                payment: {
                    pending: {
                        symbolBreakdown: ',',
                        total: 100
                    },
                    payments: [
                        {
                            additionalPayment: true,
                            total: 70.3
                        },
                        {
                            additionalPayment: true,
                            total: 70
                        }
                    ]
                },
                totalPrice: {
                    total: 50,
                    currency: 'EUR'
                },
                packagePrice: {
                    total: 'TESTS',
                },
                products: [{
                    type: 'hotel',
                    packaged: true,
                    price: {
                        total: 200
                    }
                }]
            },{
                payment: {
                    pending: {
                        symbolBreakdown: ',',
                        total: 'nan'
                    },
                    fees: [
                        {
                            code: 'CC',
                            amount: 'Nan'
                        },{
                            code: 'OB',
                            amount: 'Nan'
                        },{
                            code: 'TT',
                            amount: 'Nan'
                        },
                    ],
                    payments: [
                        {
                            additionalPayment: true,
                            total: 'NaN'
                        },
                        {
                            additionalPayment: true,
                            total: 70
                        },
                        {
                            additionalPayment: false,
                            total: 'NaN'
                        },
                    ]
                },
                totalPrice: {
                    total: 'NaN',
                    currency: 'EUR'
                },
                products: [{
                    type: 'hotel',
                    packaged: true,
                    price: {
                        total: 200
                    }
                }]
            }
        ],
        hotel:[
            {
                name:'TestName',
                packaged :false,
                price: {
                    total:50
                }
            },{
                name:'TestName',
                packaged :false,
                price: {
                    total:'NAN'
                }
            },
        ],
        vehicle:[
            {
                groupCode:'AA',
                groupName:'TEST',
                packaged :false,
                price: {
                    total:50
                },
                provider:{
                    name:'test'
                }
            },{
                groupCode:'AA',
                groupName:'TEST',
                packaged :false,
                price: {
                    total:'NAN'
                },provider:{
                    name:'test'
                }
            },
        ],
        flightItinerary: [
            {
                packaged: true
            },
            {
                packaged: true
            }
        ],
        experience: [
            {
                price: {
                    total: 200
                }
            }
        ],
        transfer : [
            {
                price: {
                    total: 200
                }
            }
        ]
    }
    beforeEach(() => {
        angular.mock.module('ib-MmB-manage-purchase-breakdown-info-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$filter', $filterFake);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBModalService', fakeMmBModalService)
        });
        inject((_$rootScope_, _CurrencyService_, _localStorageService_, _$controller_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            CurrencyService = _CurrencyService_;
            localStorageService.set('bookingInfo', fakeBookingInfo1);
            localStorageService.set('PNR', 'V6X6LR');
            localStorageService.set('checkinSurname', 'test');
            $rootScope.appMarket = 'ES';
            $rootScope.appLang = 'ES';
            controller = $controller('MmBManagePurchaseBreakdownInfoController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });

        controller.model = fakeMmBPurchaseBreakdownInfoModel;

    });

    describe('when the component is created', () => {

        it('Should set popoverHolidays correctly', (done) => {
            expect(controller.popoverHolidays[1].path).toEqual(null);
            done();
        });
    });
    describe('when the component is created and provider 1A', () =>{
        beforeEach(() => {
            $scope = $rootScope.$new();
            localStorageService.set('bookingInfo', fakeBookingInfo2);
            localStorageService.set('PNR', 'V6X6LR');
            localStorageService.set('checkinSurname', 'test');
            $rootScope.appMarket = 'ES';
            $rootScope.appLang = 'ES';
            controller = $controller('MmBManagePurchaseBreakdownInfoController', {
                $scope: $scope,
                $rootScope: $rootScope
            });


        });
        it ('Should set popoverHolidays correctly', (done) => {
            expect(controller.popoverHolidays[1].path).toEqual(null);
            done();
        });
    })

    describe('when activate() function is called', () => {

        it('Should set yourPurchase correctly)', (done) => {
            expect(controller.yourPurchase).toEqual(whatPassenger);
            done();
        });

        it('Should be called', (done) => {
            controller.$onInit();
            done();
        });

    });
    describe('when activate() is called with flightItinerary is false', () => {
        beforeEach(() => {
            inject(() => {
                var fakeMmBPurchaseBreakdownInfoModel2 = {
                    packagedProduct: [
                        {
                            payment: {
                                pending: {
                                    symbolBreakdown: ',',
                                    total: 100
                                },
                                payments: [
                                    {
                                        additionalPayment: true,
                                        total: 70.3
                                    },
                                    {
                                        additionalPayment: true,
                                        total: 70
                                    }
                                ]
                            },
                            totalPrice: {
                                total: 50,
                                currency: 'EUR'
                            },
                            products: [{
                                type: 'flightItinerary',
                                packaged: true,
                                price: {
                                    total: 200
                                }
                            }]
                        },
                    ],
                    vehicle:[
                        {
                            groupCode:'AA',
                            groupName:'TEST',
                            packaged :false,
                            price: {
                                total:50
                            },
                            provider:{
                                name:'test'
                            }
                        },{
                            groupCode:'AA',
                            groupName:'TEST',
                            packaged :false,
                            price: {
                                total:300
                            },provider:{
                                name:'test'
                            }
                        },
                    ],
                    flightItinerary: [
                        {
                            packaged: true
                        },
                        {
                            packaged: true
                        }
                    ],
                }
                controller.model = fakeMmBPurchaseBreakdownInfoModel2;
            });

        });
        it('Should general flightItinerary is false', (done) => {
            controller.$onInit();
            expect(controller.yourPurchase.symbol).toEqual(controller.model.packagedProduct[0].payment.pending.symbolBreakdown)
            done();
        });

    });


});
