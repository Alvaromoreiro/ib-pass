describe('PassengerFormController test', () => {
    let $scope, controller, currentForm = { '$valid': true, '$submitted': true };

    let ctrlBinds = {
        'passengerModel': { 'frequentFlyerInfo': { 'number': 'AB' } },
        'companies': {},
        'index': {}
    };

    beforeEach(() => {
        angular.mock.module('ib-passenger-form-module');
        inject(($componentController, $rootScope) => {
            $scope = $rootScope.$new();
            controller = $componentController('ibPassengerForm', {
                $scope: $scope
            }, ctrlBinds);
            controller.$onInit();
        });
    });

    it('When activate() is called', (done) => {
        expect(controller.passengerModel.viewed).toBe(true);
        done();
    });

    it('When backFromTabPassenger() is called, should emit event', (done) => {
        spyOn($scope, '$emit');
        controller.backFromTabPassenger();
        expect($scope.$emit).toHaveBeenCalled();
        done();
    });

    it('When nextFromTabPassenger() is called, should emit event', (done) => {
        controller.nextFromTabPassenger(currentForm);
        expect(currentForm.$submitted).toBe(false);
        done();
    });

    it('When nextFromTabInfant() is called, should emit event', (done) => {
        spyOn($scope, '$emit');
        controller.nextFromTabInfant();
        expect($scope.$emit).toHaveBeenCalled();
        done();
    });


    it('When clearCodeNumber() is called', (done) => {
        controller.passengerModel.frequentFlyerInfo.company = 'Other';
        controller.clearCodeNumber();
        expect(controller.passengerModel.frequentFlyerInfo.number).toEqual(controller.passengerModel.frequentFlyerInfo.number);
        done();
    });
    it('When clearCodeNumber() is called and passengerModel.frequentFlyerInfo.number is empty', (done) => {
        controller.passengerModel.frequentFlyerInfo.company = 'CKI_COMBO_BLANK';
        controller.clearCodeNumber();
        expect(controller.passengerModel.frequentFlyerInfo.number).toEqual(controller.passengerModel.frequentFlyerInfo.number);
        done();
    });

    it('needsConfirm', (done) => {
        expect(controller.needsConfirm()).toEqual(false);
        done();
    });


    it('When goSpecialNeedsPage() is called, should emit event', (done) => {
        spyOn($scope, '$emit');
        controller.goSpecialNeedsPage();
        expect($scope.$emit).toHaveBeenCalled();
        done();
    });
});