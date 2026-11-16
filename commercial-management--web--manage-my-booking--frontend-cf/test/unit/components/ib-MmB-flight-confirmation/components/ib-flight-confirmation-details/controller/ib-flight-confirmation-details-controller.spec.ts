describe('FlightConfirmationDetailsController test', function () {
    var $scope, controller, $rootScope, $controller;



    var ctrlBinds = {
        'confirmDetailsModel': { 'cabinClass': { 'fareFamily': 'test' } },
        'titleFlight': {}
    };

    beforeEach(function () {
        angular.mock.module('ib-flight-confirmation-details-module');
        inject(function (_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $scope = $rootScope.$new();
            controller = $controller('FlightConfirmationDetailsController', {
                $scope: $scope
            }, ctrlBinds);
            
        });
        controller.$onInit();
    });

    it('When openFareConditionsModal() is called, should emits event', function (done) {
        spyOn($scope, '$emit');
        controller.openFareConditionsModal('test', 'test', 'test');
        expect($scope.$emit).toHaveBeenCalledWith('openFareConditionsModal', { 'size': 'test', 'template': 'test', 'animation': 'test', 'isBlocked': false, 'fareFamily': 'test' });
        expect(controller.confirmDetailsModel.cabinClass.fareFamily).toEqual('test');
        done();
    });
});