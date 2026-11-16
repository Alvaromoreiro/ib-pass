
import { IbMmbUmnrUtilsService } from "@src/components/ib-MmB-umnr-passengers/services/ib-Mmb-umnr-utils.service";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service";
import angular from 'angular';

@Component('ib-MmB-passengers-tab-module', 'ibMmbPassengersTabComponent', {
    controllerAs: 'passTabCtrl',
    bindings: {
        model: '=',
        apis: '<',
        bid: '='
    },
    templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
        return MmBAppConstants.templatesRoute + 'ib-MmB-passengers-tab-view.html';
    }]
}, ['$scope','BookingDashboardConstants', '$rootScope', 'MmBAppConstants', 'MmBDatalayerUtilsService', 'localStorageService', 'CommonsUtilService', 'IbMmbUmnrUtilsService'],
[])
export class ibMmbPassengersTabComponent implements angular.IController{
    changeContactEvent;
    addDataCommonsEmergencyContact;
    customerData:any;
    seatsAuctionData = {
        colSize: '',
        boxSize: '',
        icon: '',
        linkId: '',
        text: {}
    };
    emergencyContactData = {};
    hide:boolean = false;
    channel = this.localStorageService.get('pnrChannel');
    model: any;
    apis: any;
    bid: any;
    isActiveUmnr: boolean = false;

    constructor(
        private $scope,
        private BookingDashboardConstants,
        private $rootScope: any,
        private MmBAppConstants: MmBAppConstants,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsUtilService: CommonsUtilService,
        private IbMmbUmnrUtilsService: IbMmbUmnrUtilsService
    ) {
        this.changeContactEvent = $rootScope.$on('changeContactInfo', this.changeContactInfo);
        this.addDataCommonsEmergencyContact = this.$rootScope.$on('confirmEmergencyContact', this.confirmEmergencyContact);
        this.$scope.$on('$destroy', this.addDataCommonsEmergencyContact);
        this.$rootScope.$on('changePersonalInfo', this.changePersonalInfo);
        this.isActiveUmnr = this.IbMmbUmnrUtilsService.isActiveUMNR();
    }
    /**
     * Initialize modal controller
     */
    $onInit = () => {
        this.seatsAuctionData = {
            colSize: !this.hide ? this.BookingDashboardConstants.BOX_COL_SIZES.LARGE: this.BookingDashboardConstants.BOX_COL_SIZES.LARGE,
            boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
            icon: this.BookingDashboardConstants.BOX_LINK_ICONS.AUCTION,
            linkId: this.BookingDashboardConstants.BOX_LINKS_TYPES.SEATS_AUCTION,
            text: {
                title: 'MODULES_LINK_SEAT_AUCTION_TEXT',
                subtitle: 'MODULES_LINK_GET_BETTER_SEAT_TEXT',
                accessibilityText: 'MODULES_LINK_GET_BETTER_SEAT_TEXT'
            }
        };
        this.emergencyContactData = {
            colSize: this.bid.bidable ? this.BookingDashboardConstants.BOX_COL_SIZES.LARGE: this.BookingDashboardConstants.BOX_COL_SIZES.LARGE,
            boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
            icon: this.BookingDashboardConstants.BOX_LINK_ICONS.MESSAGES,
            linkId: this.BookingDashboardConstants.BOX_LINKS_TYPES.EMERGENCY_CONTACT,
            flags: this.model.orders.some((item) => item.flag.enabled === true),
            text: {
                title: 'MODULES_LINK_EMERGENCY_CONTACT_TEXT',
                subtitle: 'MODULES_LINK_ADD_FOR_POSSIBLE_UNEXPECTED_TEXT',
                accessibilityText: 'MODULES_LINK_ADD_FOR_POSSIBLE_UNEXPECTED_TEXT'
            }
        };
        this.CommonsUtilService.setTitlePage('MMB_TITLE_PASSENGER_DATA');

        this.customerData = this.localStorageService.get('customerData') || {};
        this.MmBDatalayerUtilsService.updateLoggedDatalayer(this.customerData.generalInfo);
        this.MmBDatalayerUtilsService.updateLoggedDigitalData(this.customerData.generalInfo);
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MODPAX, MMBDatalayerConstants.DIGITAL_DATA_STEP.MODPAX, this.MmBAppConstants.QUADRIGAM.PASSENGER_DATA);
    };

    changeContactInfo = (event, contactInfo, index) => {
        event.preventDefault();
        this.model.passengers[index].contactInfo = contactInfo;
    }

    changePersonalInfo = (event, personalInfo, index) => {
        this.model.passengers[index].personalInfo = personalInfo;
    }

    confirmEmergencyContact = ($event, message) => {
        if ($event.name === 'confirmEmergencyContact') {
            if (message.name.length > 0 || message.phone.length > 0) {
                this.seatsAuctionData.colSize = this.BookingDashboardConstants.BOX_COL_SIZES.LARGE;
                this.hide = true;
            } else {
                this.seatsAuctionData.colSize = this.BookingDashboardConstants.BOX_COL_SIZES.LARGE;
            }
        }
    }
}

