(function () {
    angular.module('ib-booking-segment-info-module').controller('BookingSegmentInfoController', BookingSegmentInfoController);

    BookingSegmentInfoController.$inject = ['$scope', '$rootScope', 'DatalayerBKIService'];
    function BookingSegmentInfoController($scope, $rootScope, DatalayerBKIService) {
        const vm = this;
        vm.sendSelectedSegment = sendSelectedSegment;
        vm.openDetailsInfo = openDetailsInfo;
        vm.newFare = $rootScope.newFare;
        vm.$onInit = activate;

        ////////////////

        function activate() {
            vm.selectedCabin = '';
        }

        /**
         *
         * @param {*} element
         * @param {*} cabin
         */
        function sendSelectedSegment(element, cabin) {
            const article = angular.element(element.offsetParent);
            const heightHeadingFlight = angular.element('.ib-table-flight-cabins')?.find('[data-flight-heading]')[0]?.offsetTop || 0;
            let articleOffset = article[0].offsetTop;
            const transformOffset = heightHeadingFlight;
            vm.segmentInfoModel.showedCabin = cabin;
            vm.sliceInfoModel.showedCabin = cabin;
            vm.segmentInfoModel.selectedCabin = cabin;
            vm.sliceInfoModel.selectedCabin = cabin;
            if (vm.sliceIndex > 3) {
                const offsetLength =
                    vm.currentOriginDestinationIndex < vm.selectedSlicesLength - 1 ? vm.selectedSlicesLength - 1 : vm.currentOriginDestinationIndex;
                articleOffset = (offsetLength + 1) * 530;
            }
            const selectedSlice = {
                selectedSliceIndex: vm.sliceIndex,
                selectedSlicesLength: vm.selectedSlicesLength,
                selectedSegment: {
                    selectedSegmentIndex: vm.segmentIndex,
                    cabin: cabin,
                    info: vm.segmentInfoModel
                },
                articleOffset: articleOffset,
                cabin: cabin,
                destination: vm.destination ? vm.destination : vm.sliceInfoModel.destination,
                heightHeadingFlight: heightHeadingFlight,
                info: vm.sliceInfoModel.info ? vm.sliceInfoModel.info : vm.sliceInfoModel,
                origin: vm.origin ? vm.origin : vm.sliceInfoModel.origin,
                originDestinationId: vm.originDestinationId ? vm.originDestinationId : vm.sliceInfoModel.originDestinationId,
                transformOffset: transformOffset,
            };
            DatalayerBKIService.getDigitalDataEcommerce([selectedSlice], 'view_item_list');
            if (!vm.segmentInfoModel.showFares) {
                $scope.$emit('selectedRedemptionSliceEvent', selectedSlice, true);
            }
        }

        function openDetailsInfo() {
            $scope.$emit('showDetailsInfo', true);
        }
    }
})();
