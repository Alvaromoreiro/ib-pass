describe('OrderSummaryAncillariesController test', function () {

    var controller, $controller, $rootScope, $scope;

    beforeEach(function(){
        angular.mock.module('ib-order-summary-ancillaries-module', function($provide){
        });
        inject(function(_$controller_, _$rootScope_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('OrderSummaryAncillariesController');
        });
        $rootScope.$digest();
    });

    describe('when OrderSummaryAncillariesController is init', function(){
        it('OrderSummaryAncillariesController to have been defined', function(done){
            controller.$onInit();
            expect(controller).toBeDefined();
            done();
        });
    });
});
