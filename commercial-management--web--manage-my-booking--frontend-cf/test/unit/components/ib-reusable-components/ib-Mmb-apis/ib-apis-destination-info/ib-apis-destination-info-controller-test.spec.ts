describe('ApisDestinationInfoController test', function () {
    var controller, $scope, $rootScope;

    beforeEach(function () {
        angular.mock.module('ib-apis-destination-info-module', function () {});
        inject(function (_$rootScope_, $controller) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('ApisDestinationInfoController', {
                $scope: $scope
            });
        });
    });

    describe('init component', function () {
        it('its create correctly', function () {
            controller.$onInit();
            expect(controller.$onInit).toBeDefined();
        });
    });
    describe('when checkIsInfant() function is called', function () {
        it('and isInfant == true', function () {
            controller.isInfant = true;
            controller.destinationData = {
                'address': 'Calle Test',
                'inTransit' : {inTransit : true},
            };
            controller.relatedAdultData = {
                'destinationAddress': {
                  'address': 'Calle Test',
                  'inTransit' : {inTransit : true},
                }
            };
            controller.$onInit();

            expect(controller.isInfant).toEqual(true);
            expect(controller.destinationData.address).toEqual(controller.relatedAdultData.destinationAddress.address);
            expect(controller.destinationData.inTransit ).toEqual({inTransit : true});
        });
    });
});
