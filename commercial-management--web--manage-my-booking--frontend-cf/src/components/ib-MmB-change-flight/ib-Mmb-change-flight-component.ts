import angular from "angular";
import { MmBDatalayerUtilsService } from "../services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service";
import { MMBDatalayerConstants } from "../services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBModalService } from "../ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service";
import { ChangeFlightService } from "./services/ib-Mmb-change-flight-service";

@Component(
    'ib-Mmb-change-flight-module',
    'ibChangeFlightComponent',
    {
        controllerAs: 'changeCtrl',
        templateUrl: ['MmBAppConstants', 'MmBRouterConstants', (MmBAppConstants, MmBRouterConstants) => {
            return MmBAppConstants.templatesRoute + MmBRouterConstants.changeFlightViewRoute;
        }]
    },
    ['$scope', 'ChangeFlightService', 'ChangeFlightModel', 'MmBModalService', '$location', 'localStorageService', 'MmBAppConstants', 'MmBDatalayerUtilsService'],
[])
export class ibChangeFlightComponent {

    constructor(
        private $scope,
        private ChangeFlightService: ChangeFlightService,
        private ChangeFlightModel,
        private MmBModalService: MmBModalService,
        private $location,
        private localStorageService,
        private MmBAppConstants: MmBAppConstants,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService) {
            this.$scope.$on('daySelectedInfo', this.searchAvailavility);
            this.$scope.$on('sliceSelected', this.selectSlice);
            this.$scope.$on('changeZoneList', this.changeZoneList);
        }

    model = this.ChangeFlightModel;
    showSegmentDetails: boolean;
    showFlightSearchEngine: boolean;
    showFlightSearchDetails: boolean;
    showChangeFlightAvailability: boolean;

    $onInit = () => {
        var extendedDatalayerInfo = {};
        var modelInitialized = this.ChangeFlightService.initializeModelInfo();
        var quadrigam = this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHT;
        this.model.initializeModel();
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.DEPARTURE_AIRPORT] = modelInitialized.selectedSegmentInfo.departure.code;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ARRIVAL_AIRPORT] = modelInitialized.selectedSegmentInfo.arrival.code;
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
        this.model.selectedSegmentInfo = modelInitialized.selectedSegmentInfo;
        this.model.timeZonesList = modelInitialized.timeZonesList;
        this.model.searchEngineModel = modelInitialized.searchEngineModel;
        this.checkHasAvailability(null);
        this.MmBModalService.finishWaiting();
    }

    /**
     * Recieves the selected date anf time zone to call availability
     * @param {Object} event the received event
     * @param {Object} eventData the event data
     */
    searchAvailavility = (event, eventData) => {
        this.MmBModalService.showWaitingModal(null, null, null, null);
        this.model.searchEngineModel.selectedDate = eventData.selectedDay;
        this.model.searchEngineModel.selectedTimeZone = eventData.selectedTimeZone;
        this.ChangeFlightService.getFlightAvailability(this.model).then((availabilityData: any) => {
            var extendedDatalayerInfo = {};
            var quadrigam = this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHT_DISPO;
            this.MmBModalService.finishWaiting();
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.TOTAL_AVAILABILITY] = availabilityData.slices.length;
            this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
            this.checkHasAvailability(true);
            this.model.availabilityInfo = availabilityData;
            this.model.availabilityInfo.selectedFilter = eventData.selectedTimeZone && eventData.selectedTimeZone.id || '';
            this.$scope.$broadcast('reloadAvailability');
        }, (error) => {
            this.MmBModalService.finishWaiting();
            this.MmBModalService.showGenericError(error, false, false).result.then(angular.noop, angular.noop);
        });
    }


    /**
     *  Check if the day selected and day original of segment are equals and check hour for change
     *  time zones
     * @param {Object} evt  Event
     * @param {Date} daySelected Day selected on date picker  on search-engine
     */
    changeZoneList = (evt, daySelected) => {
        this.model.timeZonesList = this.ChangeFlightService.getTimeZoneList(daySelected);
        this.model.searchEngineModel.timeZoneSelected = this.model.timeZonesList[0];
    }


    /**
     * Recieves the selected slice and sets it into session storage going on to flight confirmation page
     * @param {Object} event the received event
     * @param {Object} eventData the event data
     */
    selectSlice = (event, eventData) => {
        this.localStorageService.set('newSelectedSegment', eventData);
        this.$location.path(this.MmBAppConstants.PAGES_URL.FLIGHT_CONFIRMATION);
    }

    checkHasAvailability = (has) => {
        if (has !== undefined && has !== null) {
            this.model.hasAvailability = has;
        }

        this.showSegmentDetails = (!this.model.hasAvailability && angular.isObject(this.model.selectedSegmentInfo));
        this.showFlightSearchEngine = (!this.model.hasAvailability && angular.isObject(this.model.timeZonesList) && angular.isObject(this.model.searchEngineModel));
        this.showFlightSearchDetails = (this.model.hasAvailability && angular.isObject(this.model.timeZonesList) && angular.isObject(this.model.searchEngineModel));
        this.showChangeFlightAvailability = (this.model.hasAvailability && angular.isObject(this.model.availabilityInfo));
    }
}