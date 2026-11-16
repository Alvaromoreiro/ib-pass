describe('AncillariesController test', function () {

    var $controller, $rootScope, $scope, controller;

    beforeEach(function(){
        angular.mock.module('ib-ancillaries-module', function() {});
        inject(function(_$controller_, _$rootScope_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            controller = _$controller_('AncillariesController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
        $rootScope.$digest();
    });

    describe('when AncillariesController is init', function(){
        it('AncillariesController have to be defined', function(done){
            expect(controller).toBeDefined();
            done();
        });
    });
});
