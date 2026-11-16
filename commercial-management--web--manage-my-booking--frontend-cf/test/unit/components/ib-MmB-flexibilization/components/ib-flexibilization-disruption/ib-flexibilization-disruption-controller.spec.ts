describe('IbFlexibilizationDisruptionController test', function () {
    let $controller, $rootScope, $scope, IbFlexibilizationDisruptionController;
    beforeEach(function(){
        angular.mock.module('ib-flexibilization-disruption-module', function($provide){
        });
        inject(function(_$controller_, _$rootScope_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            IbFlexibilizationDisruptionController = $controller('IbFlexibilizationDisruptionController');
        });
        $rootScope.$digest();
    });

    describe('when IbFlexibilizationDisruptionController is init', function(){
        it('IbFlexibilizationDisruptionController to have been defined', function(done){
            IbFlexibilizationDisruptionController.$onInit();
            expect(IbFlexibilizationDisruptionController).toBeDefined();
            done();
        });
    });
});
