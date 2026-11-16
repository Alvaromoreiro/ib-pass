describe('PassengerDataContactFormController test', () => {
    var $scope, controller, currentForm = { '$valid': true, '$submitted': true };

    var ctrlBinds = {
        'contactFormModel': {},
        'passengersModel': [],
        'originalDataModel': { 'passengersContactInfo': [] },
        'optionalInformation': {}
    };

    beforeEach(() => {
        angular.mock.module('ib-passenger-data-contact-form-module');
        inject(function ($componentController, $rootScope) {
            $scope = $rootScope.$new();
            controller = $componentController('ibPassengerDataContactForm', {
                $scope: $scope
            }, ctrlBinds);
            controller.$onInit();
        });
    });
    describe('When nextFormDataContact is called', () => {
        it('and passengers.length is 1 and data input is diferente, should copy  contactInfo in first pasenger', (done) => {
            inject(()=>{
                controller.passengersModel[0] = { 'contactInfo': 'test' };
                controller.contactFormModel = 'nomodel';
            });
            controller.nextFormDataContact(currentForm);
            $scope.$digest();
            done();
        });
    });
    describe('When nextFormDataContact is called and useForAll', () => {

        it('and useForAll are true, should call function usePassengerDataForAll, should copy info of first passenger on all', (done) => {
            controller.useForAll = true;
            controller.passengersModel[0] = { 'contactInfo': 'testinfo' };
            controller.passengersModel[1] = { 'optionalInformation': { 'contactData': true }, 'contactInfo': '' };
            controller.nextFormDataContact(currentForm);
            expect(controller.passengersModel[1].contactInfo).toEqual('testinfo');
            done();
        });
    });

    it('When backFormDataContact() is called, should emit event', (done) => {
        // $scope.$on('dataContactFormBack', event);
        controller.backFormDataContact();
        done();
    });


    describe('When needsConfirm() is called', () => {
        var returnedInfo;
        it('and data are equals,should return true', (done) => {
            controller.contactFormModel = { 'primaryContactInfo': 'model' }
            returnedInfo = controller.needsConfirm();
            expect(returnedInfo).toBe(true);
            done();

        });

        it('and data are different,should call isPassengerDataOriginal() and return true', (done) => {
            controller.originalDataModel.passengersContactInfo[0] = { 'passengerId': 1, 'contactInfo': 'contact' };
            controller.passengersModel[0] = { 'passengerId': 1, 'contactInfo': 'modify' };
            returnedInfo = controller.needsConfirm();
            expect(returnedInfo).toBe(true);
            done();

        });
    });

    it('When copyDataForAll() is called', (done) => {
        controller.useForAll = true;
        controller.passengersModel[0] = { 'contactInfo': 'test' };
        controller.copyDataForAll();
        $scope.$digest();
        expect(controller.contactFormModel).toEqual('test');
        done();
    });

});
