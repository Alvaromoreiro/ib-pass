describe('MmbManageInvoiceInfoController test', () => {
    var controller, $scope, $rootScope, localStorage;


    var fakeBookingInfo = {
        'order': {
            'slices': [
                {
                    'segments': [
                        {
                            'arrivalCity': {
                                'description': 'test'
                            }
                        },
                        {
                            'arrivalCity': {
                                'description': 'test'
                            }
                        }
                    ]
                },
                {
                    'segments': [
                        {
                            'arrivalCity': {
                                'description': 'test'
                            }
                        },
                        {
                            'arrivalCity': {
                                'description': 'test'
                            }
                        }
                    ]
                }
            ]
        },
        'contextMetadata': {
            'currencies': '€'
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

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerWithTaxs: jasmine.createSpy(),
    };

    var fakeMmBModalService = {
        showGenericModal : jasmine.createSpy('showGenericModal').and.callFake(function () {
            return {
                'result': {
                    'then': () => {}
                }
            };
        }),
        showWaitingModal:jasmine.createSpy(),
        finishWaiting:jasmine.createSpy(),
    };

    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return ('');
        };
        switch (filter) {
            case 'translate':
                filterFunc = function () {
                    return 'Translated Text';
                };
                break;
            case 'LinksFilter':
                filterFunc = function () {
                    return 'Linked Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var fakeMmBAppConstants = {
        LONG_COINS_MARKETS: 'test',
        PETS_STATUS: {
            PENDING_PAYMENT: "PENDING_PAYMENT"
        }
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-manage-invoice-info-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('$filter', $filterFake);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
        });
        inject(function (_$rootScope_, $controller, _localStorageService_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            localStorage.set('bookingInfo', fakeBookingInfo);
            controller = $controller('MmbManageInvoiceInfoController', {
                $scope: $scope,
                $rootScope: $rootScope,
            });
            controller.model = {
                    'total': 30,
                    'tax': 50,
                    'seatsPricesByType': [
                        {
                            'baseTotal': 30
                        }
                    ]
                }

            controller.baggages = {
                baggageInfo: [
                    {
                        segments: [
                            {
                                sliceBaggage: {
                                    passBaggages: [
                                        {
                                            hold: {
                                                units: 20
                                            },
                                            extraHold: 30,
                                            totalHold: 40
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        });
    });

    describe('when activate is called', function () {
        it('and default case', function (done) {
            controller.$onInit();
            done();
        });
    });

    describe('when cleanTax is called', function () {
        it('and return result default', function (done) {
            expect(controller.cleanTax('')).toBeUndefined();
            done();
        });
        it('and return result', function (done) {
            var val = '€';
            var result = val.replace('€', '').replace(/\s/g, '');
            expect(controller.cleanTax(val)).toEqual(result);
            done();
        });
    });

    describe('when calcTotalTax is called', function () {
        beforeEach(() => {
            inject(() => {
                controller.model = {
                    finalPrices: {
                        tax: 20,
                        fare: 30,
                        totalPaid: 40
                    }
                }
            });
        });
        it('and finalPrices.tax exist', function (done) {
            controller.$onInit();
            expect(controller.taxNumber).toEqual(controller.model.finalPrices.tax);
            done();
        });
    });
    describe('when call checkPetc', function () {
        it('and model.petc dont exist', function (done) {
            controller.$onInit();
            expect(controller.showPetc).toEqual(false);
            done();
        });
        it('and model.petc is pending payment', function (done) {
            controller.model.petc = [{
                type: "petc",
                emd: "PENDING_PAYMENT"
            }]
            controller.$onInit();
            expect(controller.showPetc).toEqual(false);
            done();
        });
        it('and model.petc is paid and available', function (done) {
            controller.model.petc = [{
                type: "petc",
                emd: "120283802"
            }]
            controller.$onInit();
            expect(controller.showPetc).toEqual(true);
            done();
        });
    });
});
