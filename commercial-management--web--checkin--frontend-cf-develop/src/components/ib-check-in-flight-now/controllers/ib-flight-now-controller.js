(function () {
    'use strict';
    /**
     * @Controller
     * @name FlightNowController
     * @desc Controller for IBFNPA view
     */
    angular
        .module('ib-flight-now-module')
        .controller('FlightNowController', FlightNowController);

    FlightNowController.$inject = ['$rootScope', '$scope', '$timeout', '$location', '$filter', 'localStorageService', '$cookies', 'FlightNowService', 'FlightNowModel', 'CheckinAppConstants', '$window', 'ModalService', 'CkiDatalayerUtilsService', 'CkiDatalayerConstants', 'MonetateUtilsService', 'MonetateConstants', 'CkiDataLayerService', 'IbUtilsService', 'IbSessionConfigService', 'CheckinFlowService'];
    function FlightNowController ($rootScope, $scope, $timeout, $location, $filter, localStorageService, $cookies, FlightNowService, FlightNowModel, CheckinAppConstants, $window, ModalService, CkiDatalayerUtilsService, CkiDatalayerConstants, MonetateUtilsService, MonetateConstants, CkiDataLayerService, IbUtilsService, IbSessionConfigService, CheckinFlowService) {
        const vm = this;
        vm.model = FlightNowModel;

        vm.goToGdr = goToGdr;

        activate();

        $scope.$on('selectSegment', callUpdateServices);

        ///////////////////////

        function activate () {
            vm.model.initializeModel();
            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.FLY_NOW);
            localStorageService.set('nextStepAllowed', true);
            CheckinFlowService.warnUserOnBackPressed();
            FlightNowService.getAvailabilityFlightNow().then((flightNowTransformedData) => {
                const quadrigam = CheckinAppConstants.QUADRIGAM.FLY_NOW;
                const departureAirport = flightNowTransformedData.departureCodeAirport;
                const arrivalAirport = flightNowTransformedData.arrivalCodeAirport;
                const totalAvailability = flightNowTransformedData.originDestinations[0].slices.length;
                vm.model.flightInfo = flightNowTransformedData;
                /* INIT DELETE GA4 MIGRATION*/
                const extendedDatalayerInfo = {};
                extendedDatalayerInfo[CkiDatalayerConstants.DATALAYER_INFO.DEPARTURE_AIRPORT] = departureAirport;
                extendedDatalayerInfo[CkiDatalayerConstants.DATALAYER_INFO.ARRIVAL_AIRPORT] = arrivalAirport;
                extendedDatalayerInfo[CkiDatalayerConstants.DATALAYER_INFO.TOTAL_AVAILABILITY] = totalAvailability;
                CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, extendedDatalayerInfo, IbSessionConfigService.isUserLogged());
                CkiDatalayerUtilsService.sendDatalayerEvent(CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FIN DELETE GA4 MIGRATION*/
                const extendedDigitalDataInfo = {};
                CkiDataLayerService.setProcessAndStep(quadrigam);
                CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigam, extendedDigitalDataInfo, IbSessionConfigService.isUserLogged());
                CkiDatalayerUtilsService.updateDatalayerViewEvent();

                MonetateUtilsService.updateMonetateWithQuadrigam(MonetateConstants.MONETATE_INFO.SETPAGETYPE, CheckinAppConstants.QUADRIGAM.FLY_NOW);
                $timeout(() => {
                    $rootScope.$broadcast('updateDatalayer');
                    $rootScope.$broadcast('sendUpdateToMonetate');
                });
            });
        }

        function callUpdateServices (event, slice) {
            localStorageService.set('newSelectedSegment', slice);
            $location.path('/ibfncopa');
        }

        function goToGdr () {
            ModalService.isWaiting();
            $cookies.putObject(CheckinAppConstants.COOKIES.GDR_PA_INFO, { flowId: localStorageService.get('flowId'), fromStep: '/ibfnpa' }, { path: '/' });
            $window.location.href = $filter('LinksFilter')('MANAGE_MY_BOOKING_LINK', CheckinAppConstants.lang) + '#!/chktrp?pnr=' + localStorageService.get('PNR') + '&surname=' + localStorageService.get('checkinSurname')
                + '&segmentId=' + localStorageService.get('selectedBlockPa').id + '&isAirShuttle=true' + '&step=' + CheckinAppConstants.STEPS.GDR_CHANGE_FLIGHT;
        }
    }
})();
