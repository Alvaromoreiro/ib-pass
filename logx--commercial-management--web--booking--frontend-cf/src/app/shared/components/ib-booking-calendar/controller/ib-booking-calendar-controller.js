import { DatalayerConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
(function () {


    angular
        .module('ib-booking-calendar-module')
        .controller('BookingCalendarController', BookingCalendarController);

    BookingCalendarController.$inject = ['BookingCalendarService', '$scope', '$rootScope','BookingModalService','DatalayerUtilsService'];


    function BookingCalendarController (BookingCalendarService, $scope, $rootScope, BookingModalService, DatalayerUtilsService) {
        const vm = this;

        $scope.$on('calendarChangeMonth', changeMonth);

        vm.$onInit = activate;
        /**
         *  Init the component when the modal is open, calling to the service for obtain the calendar model to show in the view,
         *  In case of error close the calendar modal and open the error modal
         */
        function activate () {
            vm.loadingGrid = true;
            BookingCalendarService.initRedemptionCalendar(vm.currentOriginDestinationIndex).then(calendarInitSuccess, calendarInitError);
            function calendarInitSuccess (data) {
                const datalayerObject ={};
                datalayerObject[DatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY]= DatalayerConstants.DATALAYER_VALUES.CALENDAR;
                datalayerObject[DatalayerConstants.DATALAYER_INFO.EVENT_ACTION]= DatalayerConstants.DATALAYER_EVENT_TYPES.CLICK;
                datalayerObject[DatalayerConstants.DATALAYER_INFO.EVENT_LABEL]= vm.originDestinations.origin+vm.originDestinations.destination+'-';
                datalayerObject[DatalayerConstants.DATALAYER_INFO.EVENT_LABEL] += vm.currentOriginDestinationIndex===0? DatalayerConstants.DATALAYER_VALUES.OUTBOUND:DatalayerConstants.DATALAYER_VALUES.INBOUND;
                vm.model = data;
                vm.model.actualSlice = { sliderModel: data.sliderModel, slice: data.slice, matrixModel: data.dates[data.monthIndex] };
                vm.loadingGrid = false;
                DatalayerUtilsService.addDataLayerInfo(datalayerObject);
                DatalayerUtilsService.updateDatalayerInteractionEvent();
            }

            function calendarInitError (error) {
                vm.loadingGrid = false;
                BookingModalService.closeAllCurrentModals();
                $rootScope.$emit('calendarGridServiceError', error);
            }
        }

        /**
         *  Change the month to show in the calendar
         * @param {*} event
         * @param {*} index Indicates the index of the month in the dates array
         */
        function changeMonth (event, index) {
            vm.model.actualSlice.matrixModel = vm.model.dates[index];
            vm.model.monthIndex = index;
        }
    }

})();
