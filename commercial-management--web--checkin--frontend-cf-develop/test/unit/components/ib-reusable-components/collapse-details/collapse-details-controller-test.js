describe('Collapse details controller test', function () {

    var scope, controller;

    beforeEach(angular.mock.module('ib-collapse-details-module'));

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    beforeEach(inject(function ($controller) {
        controller = $controller('CollapseDetailsController', { $scope: scope });
    }));


    it('should set the scope property isCollapsed to the correct initial value', function () {
        expect(controller.isCollapsed).toBe(false);
    });


    it('should change the scope property isCollapsed', function () {
        controller.toggle();
        expect(controller.isCollapsed).toBe(true);
        controller.toggle();
        expect(controller.isCollapsed).toBe(false);
    });
});