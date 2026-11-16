(function () {


    angular
        .module('ib-booking-segment-details-info-module')
        .controller('BookingSegmentDetailsInfoController', BookingSegmentDetailsInfoController);

    BookingSegmentDetailsInfoController.$inject = ['$scope'];
    function BookingSegmentDetailsInfoController ($scope) {
        const vm = this;
        vm.closeDetailsInfo = closeDetailsInfo;

        ////////////////

        function closeDetailsInfo () {
            $scope.$emit('showDetailsInfo', false);
        }


    }
})();