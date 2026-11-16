describe('PassengerManagementController test', function () {
    var scope, controller;

    var controllerDependencies = {
        '$scope': {},
        'localStorageService': {},
        '$timeout': {}
    };

    var ctrlBinds = {
        'pasMngModel': {},
        'optInfoModel': {}
    };

    beforeEach(function () {
        angular.mock.module('ib-passenger-management-module', 'LocalStorageModule');

        inject(function ($componentController, $rootScope, _localStorageService_, $timeout) {
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.localStorageService = _localStorageService_;
            controllerDependencies.$timeout = $timeout;
            controller = $componentController('ibPassengerManagement', controllerDependencies, ctrlBinds);
            // controllerDependencies.$scope.$apply();
            controller.$onInit();
            $timeout.flush();
        });
    });

    it('When activate() is called, bokingCode should be specia and showCopyOfTickets should be true', function (done) {
        expect(controller.dataContact.passengerId).toEqual('CONTACT');
        done();
    });

    it('When modifyPassengerInfo() is called, should emit event', function (done) {
        var passengers = { 'passengerId': '1' };
        scope.$on('modifyPassenger', function (event, passenger, index) {
            expect(passenger).toEqual(passengers);
            expect(index).toEqual(1);
            done();
        })
        controller.modifyPassengerInfo(passengers, 1);
    });

});
