describe('test for RefundDoubtsAndRightsController', function() {
    var controller,  $controller, localStorage;

    var fakePhonesList = {
        RESERVAS: {
            telephone: '99999999',
            prefix: '+34'
        }
    };

    beforeEach(function() {
    angular.mock.module('ib-MmB-refund-doubts-and-rights-module' ,'LocalStorageModule', function(){ });
        inject(function(_$controller_, _localStorageService_) {
            $controller = _$controller_;
            localStorage = _localStorageService_;
            localStorage.set('phonesList', fakePhonesList);
            controller = $controller('RefundDoubtsAndRightsController', { });
        });
    });

    it('when $onInit is called should set correct value to properties', function(){
        controller.$onInit();
        expect(controller.phoneNumber).toBe(fakePhonesList.RESERVAS.telephone);
        expect(controller.prefix).toBe(fakePhonesList.RESERVAS.prefix);
    });
});
