describe('ApisBasicInfoController test', function () {
    var controller, $scope, $rootScope;

    beforeEach(function () {
        angular.mock.module('ib-apis-basic-info-module', function () {});
        inject(function (_$rootScope_, $controller) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('ApisBasicInfoController', {
                $scope: $scope
            });
        });
    });

    describe('init component', function () {
        it('set pasBasicData info if passenger is infant and have relatedAdultData.infData', function () {
            controller.relatedAdultData = { 'infData': 'spain' }
            controller.$onInit();
            expect(controller.pasBasicData).toBe('spain');
        });
    });
});
