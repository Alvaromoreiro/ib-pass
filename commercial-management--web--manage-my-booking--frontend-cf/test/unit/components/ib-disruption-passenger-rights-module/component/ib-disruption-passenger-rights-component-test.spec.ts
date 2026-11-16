describe('ibDisruptionPassengerRights component', function () {
    var $componentController;

    beforeEach(function () {
        angular.mock.module('ib-disruption-passenger-rights-module');
    });

    beforeEach(inject(function (_$componentController_) {
        $componentController = _$componentController_;
    }));

    it('should create component controller', function () {
        var ctrl = $componentController('ibDisruptionPassengerRights', null, {
            onShowPassengerRights: angular.noop
        });

        expect(ctrl).toBeDefined();
        expect(ctrl.onShowPassengerRights).toBeDefined();
    });

    it('should execute onShowPassengerRights callback', function () {
        var onShowPassengerRights = jasmine.createSpy('onShowPassengerRights');
        var ctrl = $componentController('ibDisruptionPassengerRights', null, {
            onShowPassengerRights: onShowPassengerRights
        });

        ctrl.onShowPassengerRights();

        expect(onShowPassengerRights).toHaveBeenCalled();
    });
});
