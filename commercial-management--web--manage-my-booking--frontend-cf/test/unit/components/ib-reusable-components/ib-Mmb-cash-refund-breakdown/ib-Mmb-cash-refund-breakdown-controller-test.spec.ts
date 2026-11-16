describe('CashRefundBreakdownController test', function () {

    var controller, $scope, $rootScope, $controller;

    beforeEach(function(){
        angular.mock.module('ib-MmB-cash-refund-breakdown-module', function($provide){
        });
        inject(function(_$controller_, _$rootScope_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('CashRefundBreakdownController');
        });
        $rootScope.$digest();
    });

    describe('when CashRefundBreakdownController is init', function(){
        it('CashRefundBreakdownController to have been defined', function(done){
            controller.$onInit();
            expect(controller).toBeDefined();
            done();
        });
    });
});
