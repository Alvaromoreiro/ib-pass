describe('IbCheckinBiometricBoardingModalMessageController', function () {
    
    var $controller, $rootScope, $scope, controller,$localStorageService,$q,$timeout,$document;


    beforeEach(function () {
        angular.mock.module('ib-checkin-biometric-boarding-success-module', 'LocalStorageModule', function($provide) {
        });
        inject(function (_$controller_, _$rootScope_, _localStorageService_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $localStorageService = _localStorageService_;
            controller = $controller('bioBoardingSuccessController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $localStorageService : $localStorageService
            });
        });
    });

    describe('when $onInit() is called', function () {
        it('The model should be defined' , function() {
            spyOn($scope, '$emit');

            controller.goToConfirmation();
            expect($scope.$emit).toHaveBeenCalledWith('goToConfirmationEvent');
        });        
    });

});