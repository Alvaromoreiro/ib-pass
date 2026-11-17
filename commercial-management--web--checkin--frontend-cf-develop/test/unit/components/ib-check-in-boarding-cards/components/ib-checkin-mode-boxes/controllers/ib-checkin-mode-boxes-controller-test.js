//PARA BORRAR (componente eliminado)
describe('IbCheckInModeBoxesController test', function () {

    var scope, controller;
    var fakeBoardingCardsConstants = { 'CHANNELS_NAMES': { 'SMS': 'SMS', 'EMAIL': 'EMAIL' } };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-checkin-mode-boxes-module', function ($provide) {
            $provide.value('BoardingCardsConstants', fakeBoardingCardsConstants);
        });
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            spyOn(scope, '$emit');
            controller = $controller('IbCheckInModeBoxesController', {
                '$scope': scope,
                'BoardingCardsConstants': fakeBoardingCardsConstants,
            });
            scope.$digest();
        });
    });

    describe('when oneModeChecked is called', function () {
        it('showInputsEvent should be called if type === "EMAIL" || type === "SMS"', function (done) {
            controller.oneModeChecked([{ 'isSelected': true }], 0, 'SMS', true);
            expect(scope.$emit).toHaveBeenCalledWith('showInputsEvent', true, 'SMS');
            done();
        });
    });

    describe('when oneModeChecked is called', function () {
        it('no mode is selected', function (done) {
            controller.oneModeChecked([{ 'isSelected': false }], 0, 'EMAIL', true);
            expect(scope.$emit).toHaveBeenCalledWith('atLeastOneItemEvent');
            done();
        });
    });

});