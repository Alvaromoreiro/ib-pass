import { DatalayerConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
import { DatalayerBKIConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-bki-constants';
import { DatalayerGeneralConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-general-constants';
import { ErrorType } from '@core/store/ib-booking-error-page.store';
(function () {
    angular
        .module('ib-booking-price-matrix-module')
        .controller('PriceMatrixController', PriceMatrixController)
        .component('ibBookingPriceMatrixPage', {
            controller: 'PriceMatrixController',
            controllerAs: 'priceMatrixCtrl',
            bindings: {},
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-price-matrix-view.html';
            }]
        });

    PriceMatrixController.$inject = ['$scope', '$timeout', '$rootScope', '$window', 'localStorageService', 'BookingPriceMatrixService', 'PriceMatrixModel', 'BookingModalService', 'CurrencyService', '$location', 'DatalayerUtilsService', 'BookingUtilService', 'BookingAppConstants', 'MonetateUtilsService', 'DatalayerBKIService', 'BookingPageUtilsService', 'BookingErrorPageStore', 'DigitalDataUtilsService'];
    function PriceMatrixController ($scope, $timeout, $rootScope, $window, localStorageService, BookingPriceMatrixService, PriceMatrixModel, BookingModalService, CurrencyService, $location, DatalayerUtilsService, BookingUtilService, BookingAppConstants, MonetateUtilsService, DatalayerBKIService, BookingPageUtilsService, BookingErrorPageStore, DigitalDataUtilsService) {
        const vm = this;

        vm.model = PriceMatrixModel;

        vm.formatPrice = formatPrice;
        vm.goFlightsSearching = goFlightsSearching;
        vm.doNewSearchingAvailability = doNewSearchingAvailability;
        vm.quadrigam;
        activate();

        $scope.$on('cellSelected', selectedCellEvent);


        ////////////////
        /**
         * Initialize the price matrix controller and its model calling the rest service for price matrix
         */
        function activate () {
            vm.quadrigam = getQuadrigam();
            vm.model.initializeModel();
            BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
            $rootScope.showHeaders= false;
            $rootScope.showMainHeader= false;
            BookingPriceMatrixService.getPriceMatrix().then((data) => {
                BookingPageUtilsService.setPageTitle(getPageTitle());
                generateDigitalDataObject(data);
                BookingModalService.finishWaiting();
                if (data.availability) {
                    vm.model.priceMatrixData = data;
                } else {
                    BookingModalService.showGenericModal(true, 'not-availability-calendar-modal.html', { idModal: 'not-availability-calendar-modal.html' }).result.then(angular.noop, angular.noop);
                }
            }, (error) => {
                getPriceMatrixError(error);
            });
            $timeout(() => {
                $rootScope.$broadcast('sendUpdateToMonetate');
            });
        }

        function getPriceMatrixError (error) {
            BookingErrorPageStore.setError(ErrorType.RIBBON, error);
            BookingModalService.finishWaiting();
            localStorageService.set('availabilityErrror', error);
            $location.path('/ibbkerror');
        }

        function selectedCellEvent (event, data) {
            vm.model.selectedCell = data;
        }

        function formatPrice (price) {
            let currency = null;
            if (vm.model.priceMatrixData && vm.model.priceMatrixData.currency) {
                currency = vm.model.priceMatrixData.currency;
            }
            return CurrencyService.formatPrice(currency, price, false, true);
        }

        function goFlightsSearching () {
            BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
            $window.location.href = $window.location.origin;
        }

        function doNewSearchingAvailability () {
            const newAvailabilityRequestData = localStorageService.get('availabilityRequestData');
            if (newAvailabilityRequestData.slices[0]) {
                newAvailabilityRequestData.slices[0].date = vm.model.selectedCell.outboundDate;
            }
            if (newAvailabilityRequestData.slices[1]) {
                newAvailabilityRequestData.slices[1].date = vm.model.selectedCell.inboundDate;
            }
            localStorageService.set('newAvailabilityRequestData', newAvailabilityRequestData);
            localStorageService.set('calditMode', true);
            $location.path('/availability');
        }

        function generateDigitalDataObject (data) {
            const confirmationDigitalInfo = localStorageService.get('confirmationDigitalInfo');
            let digitalDataObject = {}, setDigitalDataObject = {};
            setDigitalDataObject = {
                originDestinations: DatalayerBKIService.setPayloadForGenerateDigitalData()
            };
            DigitalDataUtilsService.updateDigitalDataWithQuadrigam(vm.quadrigam, confirmationDigitalInfo);
            digitalDataObject = DatalayerBKIService.generateDigitalDataAvailability(setDigitalDataObject);
            digitalDataObject[DatalayerGeneralConstants.STEP] = DatalayerConstants.DATALAYER_VIEWS.DISPO_CALENDAR;
            digitalDataObject[DatalayerBKIConstants.FLIGHT_HAUL] = data?.flightRatio ?? '';
            DatalayerUtilsService.addDigitalDataInfo(digitalDataObject);
            DatalayerUtilsService.updateDatalayerViewEvent();
            MonetateUtilsService.updateMonetateWithQuadrigam(vm.quadrigam);
        }
        function getQuadrigam () {
            const isHMAD = localStorageService.get('isHMAD');
            const isMulticity = localStorageService.get('multiCitySearch');
            if (isHMAD) {
                return BookingAppConstants.QUADRIGAMS.HMAD_NOT_AVAILABILITY;
            }
            if (isMulticity) {
                return BookingAppConstants.QUADRIGAMS.MULTI_NOT_AVAILABILITY;
            }
            return BookingAppConstants.QUADRIGAMS.NOT_AVAILABILITY;

        }
        function getPageTitle() {
            const isHMAD = localStorageService.get('isHMAD');
            const isMulticity = localStorageService.get('multiCitySearch');
            if (isMulticity && !isHMAD) {
                return 'BKI_MT_TITLE_CALDIT';
            }
            return 'BKI_TITLE_CALDIT';
        };
    }
    
})();
