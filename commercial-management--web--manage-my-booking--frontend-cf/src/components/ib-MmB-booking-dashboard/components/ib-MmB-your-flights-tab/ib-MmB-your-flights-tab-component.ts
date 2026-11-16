import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import angular from "angular";

@Component(
    'ib-MmB-your-flights-tab-module',
    'ibMmbYourFlightsTabComponent',
    {
        controllerAs: 'flightsTabCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-your-flights-tab-view.html';
        }],
        bindings: {
            model: '='
        }
    },
    ['$scope', 'MmBModalService', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'CommonsUtilService', 'DisruptionUtilService','localStorageService'],
[])
export class ibMmbYourFlightsTabComponent {

    constructor(
        private $scope,
        private MmBModalService,
        private MmBDatalayerUtilsService,
        private MmBAppConstants,
        private CommonsUtilService,
        private DisruptionUtilService,
        private localStorageService
        ) {
        this.$scope.$on('openFareModal', this.openFareWindowModal);
    }

    infoBooking = null;
    delayedFlights = null;
    caseFive = false;

    $onInit = () => {
        this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_MANAGE_FLIGHTS');
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.IBMTFL, MMBDatalayerConstants.DIGITAL_DATA_STEP.IBMTFL,  this.MmBAppConstants.QUADRIGAM.YOUR_FLIGHTS);
        this.infoBooking = this.localStorageService.get('bookingInfo');
        this.delayedFlights = this.DisruptionUtilService.checkDelayedFlights(this.infoBooking?.order?.slices);
        this.caseFive = this.DisruptionUtilService.checkWarning(this.infoBooking?.warnings);
    };

    openFareWindowModal = (event, selectedFareInfo) => {
        angular.extend(selectedFareInfo, { 'idModal': 'ib-compare-fares-modal' });
        this.MmBModalService.showGenericModal(false, 'ib-compare-fares-modal.html', { 'selectedFareInfo': selectedFareInfo }).result.then(angular.noop, angular.noop);
    }
}
