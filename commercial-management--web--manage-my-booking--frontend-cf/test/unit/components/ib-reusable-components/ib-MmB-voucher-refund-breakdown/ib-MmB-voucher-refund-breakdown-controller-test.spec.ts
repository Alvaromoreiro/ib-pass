describe('test for VoucherRefundBreakdownController', function() {

    var controller, $controller;

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    };

    beforeEach(function() {
        angular.mock.module('ib-MmB-voucher-refund-breakdown-module', function ($provide) {
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
        });
        inject(function(_$controller_, _$injector_) {
            $controller = _$controller_;
            controller = $controller('VoucherRefundBreakdownController');
        });
    });

    it('VoucherRefundBreakdownController should be defined', function() {
        controller.$onInit();
        expect(controller).toBeDefined();
    });
});
