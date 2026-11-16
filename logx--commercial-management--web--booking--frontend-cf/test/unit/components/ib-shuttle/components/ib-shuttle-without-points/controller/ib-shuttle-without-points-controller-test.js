describe('IbShuttleWithoutPointsController test', function () {

    var $controller, $rootScope, $scope, controller, localStorageService;

    beforeEach(function () {
        angular.mock.module('ib-shuttle-without-points-module', 'LocalStorageModule', function ($provide) {           
            $provide.value('BookingAppConstants',{'BOOKING_PARAMS_NAMES' : {'CHECK_AVIOS': true}});
        });
        inject(function (_$controller_, _$rootScope_, _localStorageService_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            controller = $controller('IbShuttleWithoutPointsController', { $scope: $scope, $rootScope: $rootScope, localStorageService: localStorageService });
        });
    });

    describe('when goToShuttleOpen() is called', function () {

        it('Should emit event change to obtention', function () {
            spyOn($rootScope, '$broadcast');
            controller.goToShuttleOpen();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('changeToObtentionONB' );
        });
    });
});