describe('test for RefundInformationController', function() {
    var controller, localStorageService, $controller;

    var fakeOrderFlags = [
        {
            type: 'FLAG_1',
            enabled: false
        }
    ];

    var fakeRefundFees = 'test1';

    beforeEach(function(){
        angular.mock.module('ib-MmB-refund-information-module', 'LocalStorageModule', function(){ });
        inject(function(_$controller_, _localStorageService_){
            $controller = _$controller_;
            localStorageService = _localStorageService_;
            localStorageService.set('orderFlags', fakeOrderFlags);
            localStorageService.set('refundFees', fakeRefundFees);
            controller = $controller('RefundInformationController', { });
        });
    });

    describe('when refoundInformationController is init', function() {
        it('Properties should be defined', function() {
            controller.$onInit();
            expect(controller.flags).toEqual(fakeOrderFlags);
        });
    });
});
