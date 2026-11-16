describe('IbFlexibilizationTotalController test', function () {
    let $controller, $rootScope, $scope, IbFlexibilizationTotalController;
    beforeEach(function(){
        angular.mock.module('ib-flexibilization-total-module', function($provide){
        });
        inject(function(_$controller_, _$rootScope_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            IbFlexibilizationTotalController = $controller('IbFlexibilizationTotalController');
        });
        $rootScope.$digest();
    });

    describe('when IbFlexibilizationTotalController is init', function(){
        it('IbFlexibilizationTotalController to have been defined', function(done){
            IbFlexibilizationTotalController.$onInit();
            expect(IbFlexibilizationTotalController).toBeDefined();
            done();
        });
    });
});
