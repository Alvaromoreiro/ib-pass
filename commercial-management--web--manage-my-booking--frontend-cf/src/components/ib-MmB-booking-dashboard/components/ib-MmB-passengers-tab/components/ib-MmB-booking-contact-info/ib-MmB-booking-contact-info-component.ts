
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service";
import angular from 'angular';
import { MmBModalService } from "@src/components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service";
import { MmBUtilsSharedService } from "@src/components/services/Utils/ib-MmB-utils-shared-service";

@Component('ib-MmB-booking-contact-info-module', 'ibMmbBookingContactInfoComponent', {
    controllerAs: 'contactInfoCtrl',
    bindings: {
        model: '=',
    },
    templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
        return MmBAppConstants.templatesRoute + 'ib-MmB-booking-contact-info-view.html';
    }]
}, ['$scope','MmBModalService', '$rootScope', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'MmBUtilsSharedService', 'localStorageService', 'CommonsUtilService'], [])
export class ibMmbBookingContactInfoComponent implements angular.IController {
    dataAux:any;
    model:any;
    emergencyName:string;
    emergencyCountryCode:string;
    emergencyCode:string;
    emergencyPhone:string;
    emergencyPhoneDetails:any;
    email:string;
    phone:string;
    phoneDetails:any;
    onBusinessInfo:number;
    addDataCommonsEmergencyContact: any;A

    constructor(
        private $scope,
        private MmBModalService: MmBModalService,
        private $rootScope: any,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private MmBAppConstants: MmBAppConstants,
        private MmBUtilsSharedService: MmBUtilsSharedService,
        private localStorageService: any,
        private CommonsUtilService: CommonsUtilService) {
            this.addDataCommonsEmergencyContact = this.$rootScope.$on('confirmEmergencyContact', this.confirmEmergencyContact);
            this.$scope.$on('$destroy', this.addDataCommonsEmergencyContact);
        }
    /**
     * Initialize modal controller
     */
    $onInit = () => {
        const prefix = this.MmBUtilsSharedService.getPrefixFromMarket();
        if (this.model.data.contactData.emergencyContactInfo) {
            this.emergencyName = this.model?.data?.contactData?.emergencyContactInfo?.name ?? '';
            this.emergencyCountryCode = this.model?.data?.contactData?.emergencyContactInfo?.countryCode ?? '';
            this.emergencyCode = this.model?.data?.contactData?.emergencyContactInfo?.code ?? '';
            this.emergencyPhone = this.model?.data?.contactData?.emergencyContactInfo?.phone ?? '';
            this.emergencyPhoneDetails = angular.isObject(this.model?.data?.contactData?.emergencyContactInfo?.phoneDetails) ? this.model.data.contactData.emergencyContactInfo.phoneDetails :  {countryCode: '', number: ''};
            this.emergencyPhoneDetails.countryCode = !angular.isUndefined(this.model?.data?.contactData?.emergencyContactInfo?.phoneDetails?.countryCode);
            this.emergencyPhoneDetails.number = this.model?.data?.contactData?.emergencyContactInfo?.phoneDetails?.number ?? '';
        }

        if (this.model.data.contactData.primaryContactInfo) {
            this.email = this.model?.data?.contactData?.primaryContactInfo?.email ?? '';
            this.phone = this.model?.data?.contactData?.primaryContactInfo?.phoneDetails?.number ?? '';
            this.phoneDetails = this.model?.data?.contactData?.primaryContactInfo?.phoneDetails ?? {};
            this.phoneDetails.countryCode = this.model?.data?.contactData?.primaryContactInfo?.phoneDetails?.countryCode ?? prefix?.code;
            this.phoneDetails.number = this.model?.data?.contactData?.primaryContactInfo?.phoneDetails?.number ?? '';
        }

        if (this.model.data.contactData.onBusinessInfo) {
            this.onBusinessInfo = this.model.data.contactData.onBusinessInfo && this.model.data.contactData.onBusinessInfo.type === 'OB' && this.model.data.contactData.onBusinessInfo.number ? this.model.data.contactData.onBusinessInfo.number : null;
        }
        this.onBusinessInfo = this.model.data.contactData.onBusinessInfo && this.model.data.contactData.onBusinessInfo.type === 'OB' && this.model.data.contactData.onBusinessInfo.number ? this.model.data.contactData.onBusinessInfo.number : null;
    };

    changeContactData = (isEmergencyContactData) => {
        angular.isUndefined(this.model.data.contactData.emergencyContactInfo) ?
            this.model.data.contactData.emergencyContactInfo = { name: '', prefix: '', phone: '', code: ''} :
            this.model.data.contactData.emergencyContactInfo = this.checkEmergencyContactChanges(this.emergencyName, this.emergencyCountryCode, this.emergencyCode, this.emergencyPhone, this.emergencyPhoneDetails, this.model.data.contactData.emergencyContactInfo);
        this.dataAux = {
            originalData: isEmergencyContactData ? angular.copy(this.model.data.contactData.emergencyContactInfo) : angular.copy(this.model.data.contactData.primaryContactInfo),
            title: isEmergencyContactData ? 'MODULES_LINK_EMERGENCY_CONTACT_TEXT' : 'MMB_PASSENGERS_CONTACT_DATA_TEXT',
            subtitle: isEmergencyContactData ? 'MODULES_LINK_EMERGENCY_CONTACT_SUBTITLE' : false,
            isEmergencyContactData: isEmergencyContactData,
            data: isEmergencyContactData ? angular.copy(this.model.data.contactData.emergencyContactInfo) : angular.copy(this.model.data.contactData.primaryContactInfo),
            serviceData: this.model.data,
            type: isEmergencyContactData ? 'emergencyContact' : 'primaryContact',
            prefixesList: this.localStorageService.get('phoneCodeList') || []
        };
        this.model.data.originalData = isEmergencyContactData ? angular.copy(this.model.data.contactData.emergencyContactInfo) : angular.copy(this.model.data.contactData.primaryContactInfo);
        this.model.data.isEmergencyContactData = isEmergencyContactData;

        this.MmBModalService.showPassengerModal(false, 'ib-modal-passengers-emergency-contact.html', this.dataAux, 'ib-modals ib-modals--right fade').result.then(angular.noop, angular.noop);
        if(isEmergencyContactData){
            this.CommonsUtilService.setTitlePage('MODULES_LINK_EMERGENCY_CONTACT_TITLE');
            this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOEMER, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOEMER, this.MmBAppConstants.QUADRIGAM.PASSENGER_FF_ADD);
        };
    }

    confirmEmergencyContact = ($event, message) => {
        if ($event.name === 'confirmEmergencyContact') {
            this.emergencyName = message.name;
            this.emergencyCountryCode = message.countryCode;
            this.emergencyCode = message.code;
            this.emergencyPhone = message.phone;
            this.emergencyPhoneDetails.number = message.phone;
            this.emergencyPhoneDetails.countryCode = message.code;
            this.model.data.contactData.emergencyContactInfo = this.checkEmergencyContactChanges(this.emergencyName, this.emergencyCountryCode, this.emergencyCode, this.emergencyPhone, this.emergencyPhoneDetails, '');
        }
    }

    checkEmergencyContactChanges = (emergencyName, emergencyCountryCode, emergencyCode, emergencyPhone, emergencyPhoneDetails, objEmergencyContactInfo) => {
        let newEmergencyContact = {
            name: emergencyName === objEmergencyContactInfo?.name ? objEmergencyContactInfo.name : emergencyName,
            code:  emergencyCode === objEmergencyContactInfo?.code ? objEmergencyContactInfo.code :  emergencyCode,
            countryCode: emergencyCountryCode === objEmergencyContactInfo?.prefix ? objEmergencyContactInfo.prefix : emergencyCountryCode,
            phone: emergencyPhone === objEmergencyContactInfo?.phone ? objEmergencyContactInfo.phone : emergencyPhone,
            phoneDetails: emergencyPhoneDetails === objEmergencyContactInfo?.phoneDetails ? objEmergencyContactInfo.phoneDetails : emergencyPhoneDetails
        };
        return newEmergencyContact;
    }
}
