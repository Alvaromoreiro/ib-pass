describe('MmbRebookErrorController Test', () => {

    var $controller, $rootScope, $scope, controller, localStorageService;

    var fakePhonesList = {
        RESERVAS: {
            prefix: '34',
            telephone: '655655654'
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-rebook-error-module', 'LocalStorageModule', ($provide) => {
        });
        inject((_$rootScope_,  _$controller_, _localStorageService_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;
            localStorageService = _localStorageService_;

            localStorageService.set('phonesList', fakePhonesList);
            controller = $controller('MmbRebookErrorController', {
                $scope: $scope,
                $rootScope: $rootScope,
                localStorageService: _localStorageService_
            });
        });
        $rootScope.$digest();
    });

    describe('when activate() is called', () => {
        it('$scope broadcast "setFooterFullWidth"', () => {
            expect(controller).toBeDefined();
        });
    });
});
