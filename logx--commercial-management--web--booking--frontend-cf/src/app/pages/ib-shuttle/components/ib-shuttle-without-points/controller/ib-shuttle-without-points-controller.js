(function () {


    angular
        .module('ib-shuttle-without-points-module')
        .controller('IbShuttleWithoutPointsController', IbShuttleWithoutPointsController);

    IbShuttleWithoutPointsController.$inject = ['$scope', '$rootScope', '$location', 'BookingAppConstants'];
    function IbShuttleWithoutPointsController ($scope, $rootScope, $location, BookingAppConstants) {
        const vm = this;
        vm.$onInit = activate;
        vm.goToShuttleOpen = goToShuttleOpen;

        function activate () {
        }

        function goToShuttleOpen () {
            $location.search(BookingAppConstants.BOOKING_PARAMS_NAMES.CHECK_POINTS, 0);
            $rootScope.$broadcast('changeToObtentionONB');
        }
    }
})();