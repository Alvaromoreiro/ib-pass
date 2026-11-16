'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-Mmb-voucher-refund-confirmation-module - controllers', function() {
    var controller, $controller, $rootScope, $scope;

    var fakeMmBAppConstants = {
        QUADRIGAM:  {
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX: 'RVDCFP',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX: 'RVFCFP',
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX: 'RVDCFM',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX: 'RVFCFM'
        }
    };

    let fakeMmBUtilsSharedService = {
        updateQuadrigam: jasmine.createSpy()
    };

    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };

    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'view',
            'LINK': 'link',
            'CLICK': 'click'
        },
        DIGITAL_DATA_PROCESS: {
            RVDCFP: 'reembolso disrupcion',
            RVFCFP: 'reembolso flexibilizacion bono',
            RVDCFM: 'reembolso disrupcion',
            RVFCFM: 'reembolso flexibilizacion bono'
        },
        DIGITAL_DATA_STEP : {
            RVDCFP: 'confirmacion bono',
            RVFCFP: 'confirmacion',
            RVDCFM: 'confirmacion bono',
            RVFCFM: 'confirmacion'
        }
    };

    var fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy(),
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy(),
    };

    beforeEach(function() {
        angular.mock.module('ib-MmB-services-module', 'ib-Mmb-voucher-refund-confirmation-module', 'LocalStorageModule', function($provide){
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
        });
        inject(function(_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                return {
                    'result': {
                        'then': function () {}
                    }
                };
            });
            controller = $controller('VoucherRefundConfirmationController', { });
        });
    });

    it('VoucherRefundConfirmationController should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('hasMoreThanOneVouchers is false, isDisruption false', function() {
        controller.voucherData = {
            hasMoreThanOneVouchers: false
        };
        controller.isDisruption = false;
        controller.$onInit();
        expect(controller.$onInit).toBeDefined();
    });

    it('hasMoreThanOneVouchers is false, isDisruption true', function() {
        controller.voucherData = {
            hasMoreThanOneVouchers: false
        };
        controller.isDisruption = true;
        controller.$onInit();
        expect(controller.$onInit).toBeDefined();
    });

    it('hasMoreThanOneVouchers is true, isDisruption false', function() {
        controller.voucherData = {
            hasMoreThanOneVouchers: true
        };
        controller.isDisruption = false;
        controller.$onInit();
        expect(controller.$onInit).toBeDefined();
    });

    it('hasMoreThanOneVouchers is true, isDisruption true', function() {
        controller.voucherData = {
            hasMoreThanOneVouchers: true
        };
        controller.isDisruption = true;
        controller.$onInit();
        expect(controller.$onInit).toBeDefined();
     });

    it('test for VoucherRefundConfirmationController.openVoucherModal', function() {
        controller.openVoucherModal();
        expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
    });
});
