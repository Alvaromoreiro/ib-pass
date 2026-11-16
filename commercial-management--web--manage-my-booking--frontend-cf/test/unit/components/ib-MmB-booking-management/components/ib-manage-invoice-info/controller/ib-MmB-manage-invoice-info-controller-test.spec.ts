describe('MmbManageInvoiceInfoController test', function () {
    var controller, $scope, event;


    var fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(function () { }),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(function () { }),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(function () {
            return {
                'result': {
                    'then': function () { }
                }
            };
        }),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function (visible, file, model) {
            return {
                visible: visible,
                file: file,
                model: model
            }
        })
    };

    var mockTranslateFilter = function () { };

    var fakeDatalayerUtilsService = {
        updateDatalayerWithTaxs: function (data) {
            return data
        }
    }

    var fakeCurrencyService = {};

    var fakeMmBAppConstants = {
        'LONG_COINS_MARKETS': ['DZD', 'ARS', 'BRL', 'CLP', 'CNY', 'COP', 'CRC', 'GTQ', 'XAF', 'JPY', 'DIR', 'MXN', 'DOP', 'FCFA']
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-manage-invoice-info-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService)
            $provide.value('translateFilter', mockTranslateFilter);
            $provide.value('LinksFilterFilter', mockTranslateFilter);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
    });

    describe('init component', function () {
        beforeEach(inject(function ($rootScope, $q, MmBDatalayerUtilsService, MmBModalService) {
            $scope = $rootScope.$new();
            MmBDatalayerUtilsService.updateDatalayerWithTaxs({
                noTax: '0',
                totalTax: '0'
            });
        }));
        it('component created', inject(function ($controller) {
            controller = $controller('MmbManageInvoiceInfoController', { '$scope': $scope });
            controller.model = {
                total: '0',
                fare: '0',
                finalPrices: {
                    tax: '0'
                }
            }

            controller.totalTax = '0';
            controller.noTax = '0';
            controller.baggages = {
                baggageInfo: [{
                    segments: [{
                        sliceBaggage: {
                            passBaggages: [{}]
                        }
                    }]
                }],

            }


            controller.$onInit();

            expect(controller).toBeDefined();
        }));
    });
});
