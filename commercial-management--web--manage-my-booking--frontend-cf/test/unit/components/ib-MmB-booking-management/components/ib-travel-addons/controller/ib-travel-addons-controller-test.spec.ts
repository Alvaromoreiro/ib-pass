
describe('TravelAddonsController test', function () {
    var $scope, $rootScope, controller;

    var controllerDependencies = {
        '$scope': {},
    };
    beforeEach(function () {
        angular.mock.module('ib-travel-addons-module');

        inject(function (_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = _$controller_('TravelAddonsController', { $scope: $scope});
        });
    });

    describe('when activate() is called', function () {

        it('The model variable lengthText should be defined' , function(done) {
            controller.$onInit();
            done();
        });
    });
});
