describe('ApisFormController test', function () {

    var $controller, $rootScope, $scope, controller;

    beforeEach(function(){
        angular.mock.module('ib-apis-form-module', function() {});
        inject(function(_$controller_, _$rootScope_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            controller = $controller('ApisFormController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
        $rootScope.$digest();
    });

    describe('when isRequiredHomeAddress is called, passengersData.requiredFields is an array and includes HOME_ADDRESS', function(){
        it('isRequiredHomeAddress have to be true', function(done){
            controller.passengersData = {};
            controller.passengersData.requiredFields = ['HOME_ADDRESS', 'TEST'];
            controller.idDocument = 'REQ';
            controller.pasDocsData = {
                documents: [{
                    type: {
                        code: 'DNI'
                    }
                }],
                selectedDoc: {
                    type: {
                        code: 'DNI',
                        description: 'Documento Nacional de identidad'
                    }
                }
            }
            controller.$onInit();
            expect(controller.isRequiredHomeAddress).toBe(true);
            done();
        });
    });

    describe('when isRequiredHomeAddress is called, adultPassengersData.requiredFields is an array and includes HOME_ADDRESS', function(){
        it('isRequiredHomeAddress have to be true', function(done){
            controller.adultPassengersData = {};
            controller.adultPassengersData.requiredFields = ['HOME_ADDRESS', 'TEST'];
            controller.$onInit();
            expect(controller.isRequiredHomeAddress).toBe(true);
            done();
        });
    });
});
