
describe('test for module ib-flexibilization-slice-confirmation-module - controllers', () => {

    beforeEach(() => {
        angular.mock.module('ib-flexibilization-slice-confirmation-module');
        
        angular.mock.module('LocalStorageModule');
    });

    describe('test for IbFlexibilizationSliceConfirmationController', () => {

        var IbFlexibilizationSliceConfirmationController;
        var $controller;
        var $rootScope;
        var $scope;
        var localStorageService;
        var $injector;

        beforeEach(() => {
            inject((_$controller_, _$injector_) => {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce((clone, key) => {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                localStorageService = $injector.get('localStorageService');
                IbFlexibilizationSliceConfirmationController = $controller('IbFlexibilizationSliceConfirmationController', {$scope:$scope, $rootScope:$rootScope, localStorageService:localStorageService});
            });
        });

        it('IbFlexibilizationSliceConfirmationController should be defined', () => {

            expect(IbFlexibilizationSliceConfirmationController).toBeDefined();
        });


        it('test for IbFlexibilizationSliceConfirmationController.$onInit', () => {

            IbFlexibilizationSliceConfirmationController.$onInit();

            expect(IbFlexibilizationSliceConfirmationController.$onInit).toBeDefined();
        });

        it('test for IbFlexibilizationSliceConfirmationController.confirm', () => {

            IbFlexibilizationSliceConfirmationController.checkTermsConditions = true;
            IbFlexibilizationSliceConfirmationController.confirm();

            expect(IbFlexibilizationSliceConfirmationController.confirm).toBeDefined();
        });
    });
});