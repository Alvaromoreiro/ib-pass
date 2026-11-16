import angular from "angular";
import { BookingDashboardService } from "@src/components/ib-MmB-booking-dashboard/services/ib-MmB-booking-dashboard-service";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service";
import { MmBUtilService } from "@src/components/services/Utils/ib-MmB-utils";
import { MmBUtilsSharedService } from "@src/components/services/Utils/ib-MmB-utils-shared-service";
@Controller('ib-MmB-modal-module',
    ['$uibModalInstance', 'object', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'MmBUtilsSharedService', 'BookingDashboardService', '$timeout', '$rootScope', 'localStorageService', '$filter', '$scope', '$translate', 'CommonsUserUtilsService','CommonsUtilService'],
    [])
export class MmBPassengerModalController{

    constructor(
        private $uibModalInstance,
        private object: any,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private MmBAppConstants: MmBAppConstants,
        private MmBUtilsSharedService: MmBUtilsSharedService,
        private BookingDashboardService: BookingDashboardService,
        private $timeout,
        private $rootScope, 
        private localStorageService, 
        private $filter, 
        private $scope: angular.IScope, 
        private $translate, 
        private CommonsUserUtilsService,
        private CommonsUtilService: CommonsUtilService
    ) {
        this.$scope.$on('$destroy', this.resetOriginalSpecialNeeds);
        this.close = this.closeModal;
    }

    model = this.object;
    modelOld = this.object;
    specialNeedsChange = false;
    disableUpdatePersonaInfoAction = true;
    modalSpecialNeedsForm;
    showError;
    submitted;
    contactForm;
    tempFrequentFlyerInfo;
    hasEquals;
    modalContactForm;
    close;
    

    /**
     * Initialize modal controller
     */
    $onInit = () => {
        this.initCommonFields();
        if (this.model.type === 'contactInfo') {
            this.initContactInfoFields();
        }
        if (this.model.type === 'personalInfo') {
            this.initPersonalInfoFields();
        }
        if (this.hasSpecialGuideDogStatus()) {
            this.initGuideDogMessages();
        }
    };

    private initCommonFields = () => {
        this.model.submitted = false;
        this.model.showError = false;
        this.model.showOk = false;
        this.model.showErrorForm = false;
        this.model.passengersModelCopy = angular.copy(this.model.serviceData);
        this.model.showPatternError = false;
        this.modelOld = angular.copy(this.model.specialNeeds);
        this.model.prefixesList = this.localStorageService.get('phoneCodeList');
    };

    private initContactInfoFields = () => {
        this.initEmailField();
        this.initPhoneField();
        this.initPhoneDetailsField();
        this.initCountryCodeField();
        this.initEmailRepeatField();
    };

    private initEmailField = () => {
        this.model.email = (this.model?.contactInfo?.email) ? this.model.contactInfo.email : '';
    };

    private initPhoneField = () => {
        const countryCode = this.getPhoneCountryCode();
        const number = this.getPhoneNumber();
        this.model.phone = (countryCode || number) ? (countryCode + number) : '';
    };

    private getPhoneCountryCode = () => {
        return this.model?.contactInfo?.phoneDetails?.countryCode || '';
    };

    private getPhoneNumber = () => {
        return this.model?.contactInfo?.phoneDetails?.number || '';
    };

    private initPhoneDetailsField = () => {
        this.initPhoneDetailsObject();
        this.initPhoneDetailsCountryCode();
        this.initPhoneDetailsNumber();
    };

    private initPhoneDetailsObject = () => {
        this.model.phoneDetails = (this.model?.contactInfo?.phoneDetails) ?? {};
    };

    private initPhoneDetailsCountryCode = () => {
        this.model.phoneDetails.countryCode = this.model?.contactInfo?.phoneDetails?.countryCode
            ? this.model.contactInfo.phoneDetails.countryCode
            : this.MmBUtilsSharedService.getPrefixFromMarket().code;
    };

    private initPhoneDetailsNumber = () => {
        this.model.phoneDetails.number = this.model?.contactInfo?.phoneDetails?.number
            ? this.model.contactInfo.phoneDetails.number
            : '';
    };

    private initCountryCodeField = () => {
        this.model.countryCode = (this.model?.contactInfo?.countryCode)
            ? this.model.contactInfo.countryCode
            : this.MmBUtilsSharedService.getPrefixFromMarket().code;
    };

    private initEmailRepeatField = () => {
        this.model.emailRepeat = '';
    };

    private initPersonalInfoFields = () => {
        const quadrigam = this.MmBAppConstants.QUADRIGAM.MODAL_CORRECTION_NAME;
        this.MmBDatalayerUtilsService.updateDatalayerInfo(
            MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam],
            MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam],
            quadrigam
        );
    };

    private initGuideDogMessages = () => {
        this.$translate.onReady().then(() => {
            this.$translate.use(this.$rootScope.appLang);
            const tagsInfo = {
                link: {
                    tag: 'a',
                    href: this.$filter('LinksFilter')('SPECIAL_NEED_DOG_GUIDE_INFO'),
                    target: '_blank',
                    title: this.$filter('translate')('IB_PASSENGER_SPE_NEEDS_CHECK_SPECIAL_GUIDE_DOG_INFO_MESSAGE_LINK'),
                    class: 'ib-link ib-link--underline'
                }
            };

            if (
                this.model.specialNeeds.specialGuideDogStatus === this.MmBAppConstants.SPECIAL_NEEDS.SVAN_STATUS.HK.code ||
                this.model.specialNeeds.specialGuideDogStatus === this.MmBAppConstants.SPECIAL_NEEDS.SVAN_STATUS.KK.code
            ) {
                this.model.messageGuideDogApprove = this.$filter('literalFormatter')(
                    this.$filter('translate')('IB_PASSENGER_SPE_NEEDS_CHECK_SPECIAL_GUIDE_DOG_INFO_MESSAGE_APPROVED'),
                    tagsInfo
                );
                this.model.messageGuideDogDenied = this.$filter('literalFormatter')(
                    this.$filter('translate')('IB_PASSENGER_SPE_NEEDS_CHECK_SPECIAL_GUIDE_DOG_INFO_MESSAGE_DENIED'),
                    tagsInfo
                );
            }
        });
    };

    private hasSpecialGuideDogStatus = () => {
        return (angular.isObject(this.model.specialNeeds) && angular.isString(this.model.specialNeeds.specialGuideDogStatus) && this.model.specialNeeds.specialGuideDogStatus !== this.MmBAppConstants.SPECIAL_NEEDS.SVAN_STATUS.DEFAULT.code);
    };

    /**
     * Selected option
     */
    checked = (index) => {
        if (this.isSpecialWheelchair()) {
            this.modalSpecialNeedsForm['check_chair'].$setValidity('wheelChairValidation', true);
        }
        this.$rootScope.$emit('checkSpecialNeedsEvent', index);
    };

    private isSpecialWheelchair = () => {
        return (angular.isObject(this.model.specialNeeds) && (!this.model.specialNeeds.specialWheelchair || (this.model.specialNeeds.specialWheelchair && this.model.specialNeeds.specialWheelchairValue)));
    }

    /**
     * Closes the modal dismissing its instance
     */
    private closeModal = () => {
        if (angular.isDefined(this.showError) && angular.isDefined(this.submitted)) {
            this.showError = false;
            this.submitted = false;
        }

        if (this.model.type === 'specialNeeds') {
            this.model.specialNeeds = this.model.originalSpecialNeeds;
        }

        this.$uibModalInstance.close();
    };

    updateEmergencyContactInfo = (currentForm) => {
        const type = 'emergencyContact';
        currentForm.$submitted = true;
        this.model.submitted = true;
        this.model.showError = false;
        this.model.showOk = false;
        this.model.showErrorForm = false;
        this.model.errorMsg = undefined;

        if (currentForm.$valid) {
            this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_EMERGENCY_CONTACT');
            this.MmBDatalayerUtilsService.updateDatalayerInfo(
                MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOCEME,
                MMBDatalayerConstants.DIGITAL_DATA_STEP.MOCEME,
                this.MmBAppConstants.QUADRIGAM.CONFIRM_EMERGENCY_CONTACT
            );
            if (!angular.equals(this.model.originalData, this.model.data)) {
                this.prepareEmergencyContactData();
                this.BookingDashboardService.updateDataContactInfo(
                    this.model.serviceData.flowId,
                    this.model.passengersModelCopy,
                    type
                ).then(
                    () => this.handleEmergencyContactSuccess(),
                    (error) => this.handleEmergencyContactError(error)
                );
            } else {
                this.model.showError = false;
                this.model.showOk = true;
                this.closeMessageWithTimeout(true);
            }
        } else {
            this.model.submitted = false;
            this.model.showOk = false;
            this.closeMessageWithTimeout(false);
        }
    };

    private prepareEmergencyContactData = () => {
        if (this.contactForm?.NAME_PREFIX?.$viewValue?.countryCode) {
            this.model.data.countryCode = this.contactForm.NAME_PREFIX.$viewValue.countryCode;
        }
        if (Array.isArray(this.model?.passengersModelCopy?.passengers)) {
            this.model.passengersModelCopy.passengers.forEach((passenger) => {
                passenger.emergencyContactInfo = this.model.data;
            });
        }
    };

    private handleEmergencyContactSuccess = () => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        this.model.showError = false;
        this.model.showOk = true;
        this.localStorageService.set('savedChangeSuccess', true);
        this.localStorageService.set('savedPasSuccess', true);
        if (this.model.passengersModelCopy.passengers) {
            bookingInfo.passengers = this.model.passengersModelCopy.passengers;
        }
        bookingInfo.passengers[0].emergencyContactInfo = this.model.data;
        this.localStorageService.set('bookingInfo', bookingInfo);
        this.$rootScope.$emit('confirmEmergencyContact', bookingInfo.passengers[0].emergencyContactInfo);
        this.closeMessageWithTimeout(true);
    };

    private handleEmergencyContactError = (error) => {
        if (error.messageList && error.messageList.length > 0) {
            this.model.errorMsg = error.messageList[0].message;
        } else {
            this.model.errorMsg = this.$filter('translate')('MMB_PASSENGER_MODAL_ALERT_SUBTITLE_ERROR');
        }
        this.model.showError = true;
        this.model.showOk = false;
        this.closeMessageWithTimeout(false);
    };

    updateDataContact = (currentForm) => {
        currentForm.$submitted = true;
        this.model.submitted = true;
        this.model.showError = false;
        this.model.showOk = false;
        this.model.showErrorForm = false;
        this.model.errorMsg = undefined;

        const { valueChanged, modelCopy } = this.prepareContactData();

        if (currentForm.$valid) {
            if (!angular.equals(this.model.contactInfo, valueChanged)) {
                const flowId = this.localStorageService.get('flowId');
                if (this.hasLogged(valueChanged)) {
                    this.$rootScope.$broadcast('updateContactDetails', valueChanged);
                }
                this.BookingDashboardService.updateDataContactInfo(flowId, modelCopy, this.model.type).then(
                    () => this.handleContactSuccess(modelCopy, valueChanged),
                    (error) => this.handleContactError(error)
                );
            } else {
                this.model.submitted = false;
                this.model.showOk = false;
                this.model.showErrorForm = true;
                this.closeMessageWithTimeout(false);
            }
        } else {
            this.model.submitted = false;
            this.model.showOk = false;
            this.model.errorMsg = this.$filter('translate')('MMB_PASSENGER_MODAL_ALERT_SUBTITLE_ERROR');
            this.closeMessageWithTimeout(false);
        }
    };

    private prepareContactData = () => {
        const ibPlusNumber = this.getIbPlusNumber();
        const valueChanged = this.buildValueChanged(ibPlusNumber);
        let modelCopy = angular.copy(this.model);
        modelCopy.contactInfo = valueChanged;
        return { valueChanged, modelCopy };
    };

    private getIbPlusNumber = () => {
        const custData = this.localStorageService.get('customerData');
        return custData?.personalInfo?.ibPlusNumber ? custData.personalInfo.ibPlusNumber : null;
    };

    private buildValueChanged = (ibPlusNumber) => {
        return {
            'phone': this.getChangedPhone(),
            'phoneDetails': this.model?.phoneDetails,
            'email': this.model?.email,
            'phoneType': 'MOBILE',
            'idIbplus': ibPlusNumber,
            'countryCode': this.model?.countryCode,
            'language': this.getChangedLanguage()
        };
    };

    private getChangedPhone = () => {
        return (this.model?.phoneDetails) ? (this.model?.phoneDetails?.countryCode + this.model?.phoneDetails?.number) : this.model?.phone;
    };

    private getChangedLanguage = () => {
        const prefixMarket = this.MmBUtilsSharedService.getPrefixFromMarket();
        return this.model?.contactInfo?.language ? this.model.contactInfo.language : prefixMarket.code;
    };

    private handleContactSuccess = (modelCopy, valueChanged) => {
        this.$rootScope.$broadcast('changeContactInfo', modelCopy.contactInfo, this.model.index);
        this.model.showError = false;
        this.model.showOk = true;
        let bookingInfo: any = this.localStorageService.get('bookingInfo');
        bookingInfo.passengers[this.model.index].contactInfo = valueChanged;
        this.localStorageService.set('bookingInfo', bookingInfo);
        this.closeMessageWithTimeout(true);
    };

    private handleContactError = (error) => {
        this.model.showError = true;
        this.model.showOk = false;
        if (error.messageList && error.messageList.length > 0) {
            this.model.errorMsg = error.messageList[0].message;
        } else {
            this.model.errorMsg = this.$filter('translate')('MMB_PASSENGER_MODAL_ALERT_SUBTITLE_ERROR');
        }
        this.closeMessageWithTimeout(false);
    };

    private hasLogged = (valueChanged) => {
        return (this.localStorageService.get('userLogged') && !this.CommonsUserUtilsService.isSoftUser() && this.chkPassLogged(valueChanged.idIbplus));
    };

    updatePersonalInfo = (currentForm) => {
        currentForm.$submitted = true;
        this.model.submitted = true;
        this.model.showError = false;
        this.model.showOk = false;
        this.model.showErrorForm = false;
        this.model.errorTitle = undefined;
        this.model.errorMsg = undefined;

        const {
            modelCopy,
            modelCopyService,
            valuePersonalInfoChanged
        } = this.preparePersonalInfoModels();

        if (currentForm.$valid) {
            // Si el usuario no cambia y pulsa botón Aceptar
            if (this.model.personalInfo.name.trim().replace(/\s+$/, '') + this.model.personalInfo.surname.trim().replace(/\s+$/, '') !== valuePersonalInfoChanged.name + valuePersonalInfoChanged.surname) {
                const flowId = this.localStorageService.get('flowId');
                this.BookingDashboardService.updateDataPersonalInfo(flowId, modelCopyService, this.model.type).then(
                    (data: any) => this.handlePersonalInfoSuccess(data, modelCopy),
                    (error) => this.handlePersonalInfoError(error)
                );
            } else {
                this.closeMessageWithTimeout(true);
            }
        } else {
            this.model.submitted = false;
            this.model.showOk = false;
            this.model.errorMsg = this.$filter('translate')('MMB_PASSENGER_MODAL_ALERT_SUBTITLE_ERROR');
            this.closeMessageWithTimeout(false);
        };
    };

    private preparePersonalInfoModels = () => {
        const prefixMarket = this.getPrefixMarket();
        const valueExternalPersonalInfoChanged = this.buildValueExternalPersonalInfoChanged();
        const valuePersonalInfoChanged = this.buildValuePersonalInfoChanged();
        const valueService = this.buildValueService(prefixMarket);
        let modelCopy: any = angular.copy(this.model);
        modelCopy.personalInfo = valuePersonalInfoChanged;
        modelCopy.externalPersonalInfo = valueExternalPersonalInfoChanged;
        let modelCopyService = {
            personalInfo: valueService,
            passengerId: this.model.passengerId
        };
        return { modelCopy, modelCopyService, valuePersonalInfoChanged };
    };

    private getPrefixMarket = () => {
        return this.MmBUtilsSharedService.getPrefixFromMarket();
    };

    private buildValueExternalPersonalInfoChanged = () => {
        return {
            'name': (this.model?.personalInfoEdit?.name),
            'firstSurname': (this.model?.personalInfoEdit?.surname),
            'lastsurname': null
        };
    };

    private buildValuePersonalInfoChanged = () => {
        return {
            'name': this.getPersonalInfoName(),
            'surname': this.getPersonalInfoSurname(),
            'birthDate': this.getPersonalInfoBirthDate()
        };
    };

    private getPersonalInfoName = () => {
        return this.model?.personalInfoEdit?.name;
    };

    private getPersonalInfoSurname = () => {
        return this.model?.personalInfoEdit?.surname;
    };

    private getPersonalInfoBirthDate = () => {
        return null;
    };

    private buildValueService = (prefixMarket) => {
        const valueService = {
            'contactInfo': this.getServiceContactInfo(),
            'firstName': this.getServiceFirstName(),
            'firstSurname': this.getServiceFirstSurname(),
            'lastSurname': this.getServiceLastSurname(prefixMarket),
            'birthDate': this.getServiceBirthDate()
        };
        return valueService;
    };

    private getServiceContactInfo = () => {
        return {
            'email': null,
            'phone': null
        };
    };

    private getServiceFirstName = () => {
        return this.model?.personalInfoEdit?.name;
    };

    private getServiceFirstSurname = () => {
        return this.model?.personalInfoEdit?.surname;
    };

    private getServiceLastSurname = (prefixMarket) => {
        if (prefixMarket.countryCode === 'ES' && !this.model.desactiveLastSurname) {
            return this.model?.personalInfoEdit?.lastSurname;
        }
        return null;
    };

    private getServiceBirthDate = () => {
        return null;
    };

    private handlePersonalInfoSuccess = (data, modelCopy) => {
        let allModifiedPersonalInfo = [], elementModified: any = {}, nameComplete = '';
        let passengersLocalStorage: any = this.localStorageService.get('passengers') ? this.localStorageService.get('passengers') : [];
        let bookingInfo: any = this.localStorageService.get('bookingInfo');
        let quadrigam = this.MmBAppConstants.QUADRIGAM.MODAL_CORRECTION_NAME_CONFIRMATION;
        this.model.showError = false;
        this.model.showOk = true;

        this.MmBDatalayerUtilsService.updateDatalayerInfo(
            MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam],
            MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam],
            quadrigam
        );

        bookingInfo.passengers.map(passenger => {
            let nameReceiveImport = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.name : passenger.personalInfo.name;
            let surnameReceiveImport = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.firstSurname : passenger.personalInfo.surname;
            elementModified = {};
            elementModified.name = nameReceiveImport + surnameReceiveImport;
            elementModified.modifiedPersonalInfo = passenger.modifiedPersonalInfo ? passenger.modifiedPersonalInfo : null;
            allModifiedPersonalInfo.push(elementModified);
        });

        this.handleDataPassengers(bookingInfo, data, modelCopy, passengersLocalStorage);
        this.handleActualPassenger(bookingInfo, modelCopy, allModifiedPersonalInfo, nameComplete);
        

        this.localStorageService.set('bookingInfo', bookingInfo);
        this.$rootScope.$broadcast('updatePersonalInfo', data, modelCopy, allModifiedPersonalInfo);
        this.closeMessageWithTimeout(true);
    };

    private handleActualPassenger = (bookingInfo, modelCopy, allModifiedPersonalInfo, nameComplete) => {
        bookingInfo.passengers.map(passenger => {
            if (modelCopy.oldPassengerId !== modelCopy.passengerId) {
                passenger.modifiedPersonalInfo = false;
                this.updateOldPassengersModifiedFlag(passenger, allModifiedPersonalInfo, nameComplete);
            };
            this.updateActualPassengerModifiedFlag(passenger, modelCopy);
        });
    };

    private updateOldPassengersModifiedFlag = (passenger, allModifiedPersonalInfo, nameComplete) => {
        allModifiedPersonalInfo.forEach(element => {
            nameComplete = passenger.externalPersonalInfo
                ? passenger.externalPersonalInfo.name + passenger.externalPersonalInfo.firstSurname
                : passenger.personalInfo.name + passenger.personalInfo.surname;
            if (element.modifiedPersonalInfo === true && element.name === nameComplete) {
                passenger.modifiedPersonalInfo = true;
            }
        });
    };

    private updateActualPassengerModifiedFlag = (passenger, modelCopy) => {
        if (modelCopy.externalPersonalInfo && passenger.externalPersonalInfo) {
            this.compareAndUpdateActualExternalPersonalInfo(passenger, modelCopy);
        } else {
            this.compareAndUpdateActualPersonalInfo(passenger, modelCopy);
        }
    };

    private compareAndUpdateActualExternalPersonalInfo = (passenger, modelCopy) => {
        if (
            modelCopy.externalPersonalInfo.name === passenger.externalPersonalInfo.name &&
            modelCopy.externalPersonalInfo.firstSurname === passenger.externalPersonalInfo.firstSurname
        ) {
            passenger.modifiedPersonalInfo = true;
        }
    };

    private compareAndUpdateActualPersonalInfo = (passenger, modelCopy) => {
        if (
            modelCopy.personalInfo.name === passenger.personalInfo.name &&
            modelCopy.personalInfo.surname === passenger.personalInfo.surname
        ) {
            passenger.modifiedPersonalInfo = true;
        }
    };

    private handleDataPassengers = (bookingInfo, data, modelCopy, passengersLocalStorage) => {
        data.data.passengers.forEach(dataPassenger => {
            this.updatePassengerIds(modelCopy, dataPassenger);
            this.updateBookingInfoPassengers(bookingInfo, dataPassenger);
            this.updatePassengersLocalStorage(passengersLocalStorage, dataPassenger);
        });
    };

    private updatePassengerIds = (modelCopy, dataPassenger) => {
        if (dataPassenger.externalPersonalInfo) {
            this.compareAndUpdateExternalPersonalInfo(modelCopy, dataPassenger);
        } else {
            this.compareAndUpdatePersonalInfo(modelCopy, dataPassenger);
        };
    };

    private compareAndUpdateExternalPersonalInfo = (modelCopy, dataPassenger) => {
        if (modelCopy.externalPersonalInfo.name === dataPassenger.externalPersonalInfo.name && modelCopy.externalPersonalInfo.firstSurname === dataPassenger.externalPersonalInfo.firstSurname) {
            modelCopy.oldPassengerId = modelCopy.passengerId;
            modelCopy.passengerId = dataPassenger.passengerId;
        };
    };

    private compareAndUpdatePersonalInfo = (modelCopy, dataPassenger) => {
        if (modelCopy.personalInfo.name === dataPassenger.personalInfo.firstName && modelCopy.personalInfo.surname === dataPassenger.personalInfo.firstSurname) {
            modelCopy.oldPassengerId = modelCopy.passengerId;
            modelCopy.passengerId = dataPassenger.passengerId;
        };
    };

    private updateBookingInfoPassengers = (bookingInfo, dataPassenger) => {
        bookingInfo.passengers.map(passenger => {
            if (dataPassenger.passengerId === passenger.passengerId) {
                if (dataPassenger.externalPersonalInfo) {
                    passenger.externalPersonalInfo.name = dataPassenger.externalPersonalInfo.name;
                    passenger.externalPersonalInfo.firstSurname = dataPassenger.externalPersonalInfo.firstSurname;
                    passenger.externalPersonalInfo.lastSurname = dataPassenger.externalPersonalInfo.lastSurname ? dataPassenger.externalPersonalInfo.lastSurname : '';
                    passenger.externalPersonalInfo.birthDate = dataPassenger.externalPersonalInfo
                        ? (dataPassenger.externalPersonalInfo.birthDate ? dataPassenger.externalPersonalInfo.birthDate : null)
                        : (dataPassenger.personalInfo.birthDate ? dataPassenger.personalInfo.birthDate : null);
                }
                passenger.personalInfo.name = dataPassenger.personalInfo.firstName;
                passenger.personalInfo.surname = dataPassenger.personalInfo.firstSurname;
                passenger.personalInfo.birthDate = dataPassenger.personalInfo.birthDate ? dataPassenger.personalInfo.birthDate : null;
            }
        });
    };

    private updatePassengersLocalStorage = (passengersLocalStorage, dataPassenger) => {
        if (passengersLocalStorage.length > 0) {
            passengersLocalStorage.map(passenger => {
                if (dataPassenger.passengerId === passenger.passengerId) {
                    this.updateExternalPersonalInfo(passenger, dataPassenger);
                    this.updatePersonalInfoInLocalStorage(passenger, dataPassenger);
                }
            });
        }
    };

    private updateExternalPersonalInfo = (passenger, dataPassenger) => {
        if (dataPassenger.externalPersonalInfo) {
            passenger.externalPersonalInfo.name = dataPassenger.externalPersonalInfo.name;
            passenger.externalPersonalInfo.firstSurname = dataPassenger.externalPersonalInfo.firstSurname;
            passenger.externalPersonalInfo.lastSurname = dataPassenger.externalPersonalInfo.lastSurname ? dataPassenger.externalPersonalInfo.lastSurname : '';
            passenger.externalPersonalInfo.birthDate = dataPassenger.externalPersonalInfo
                ? (dataPassenger.externalPersonalInfo.birthDate ? dataPassenger.externalPersonalInfo.birthDate : null)
                : (dataPassenger.personalInfo.birthDate ? dataPassenger.personalInfo.birthDate : null);
        }
    };

    private updatePersonalInfoInLocalStorage = (passenger, dataPassenger) => {
        passenger.personalInfo.name = dataPassenger.personalInfo.firstName;
        passenger.personalInfo.surname = dataPassenger.personalInfo.firstSurname;
        passenger.personalInfo.birthDate = dataPassenger.personalInfo.birthDate ? dataPassenger.personalInfo.birthDate : null;
    };

    private handlePersonalInfoError = (error) => {
        let quadrigam;
        this.model.showError = true;
        this.model.showOk = false;
        this.model.errorCode = error.errorCode;
        this.model.internalErrorCode = error.internalErrorCode;
        if (error.errorCode === 412 && error.internalErrorCode === this.MmBAppConstants.WARNING_MESSAGES.CORRECTION_NAME_NOT_PERMITED) {
            let message = error?.message.split('/');
            this.model.errorTitle = message[0] ? message[0] : this.$filter('translate')('MMB_PASSENGERS_PERSONAL_DATA_MODAL_NOT_REALICED');
            this.model.errorMsg = message[1] ? message[1] : this.$filter('translate')('MMB_PASSENGERS_PERSONAL_DATA_MODAL_NOT_INCLUIDED');
            quadrigam = this.MmBAppConstants.QUADRIGAM.MODAL_CORRECTION_NAME_ERROR;
        } else {
            this.model.errorTitle = this.$filter('translate')('MMB_PASSENGERS_PERSONAL_DATA_MODAL_ERROR_CORRECTED');
            this.model.errorMsg = this.$filter('translate')('MMB_PASSENGERS_PERSONAL_DATA_MODAL_ERROR_TRY_AGAIN');
            quadrigam = this.MmBAppConstants.QUADRIGAM.MODAL_CORRECTION_NAME_ERROR_SERVICE;
        }
        this.MmBDatalayerUtilsService.updateDatalayerInfo(
            MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam],
            MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam],
            quadrigam
        );
        this.closeMessageWithTimeout(false);
    };

    chkPassLogged = (passengerFF) => {
        try {
            const custData = this.localStorageService.get('customerData');
            return passengerFF === custData.personalInfo.ibPlusNumber;
        } catch (error) {
            return false;
        }
    };

    /**
     * Validates the form and then emits an event or scroll to the element with errors
     * @param {*} currentForm form that has been completed
     * @param {*} index Identificator of the passenger in passengersModel
     * @param {*} type type of data that has been provided
     */
    updateFrequentFlyerContactInfo = (currentForm, index, type) => {
        const flowId = this.localStorageService.get('flowId');
        this.resetFrequentFlyerFormState();

        if (currentForm.$valid && type === 'frequentFlyer') {
            currentForm.$submitted = true;
            this.model.submitted = true;
            if (this.tempFrequentFlyerInfo.company === 'IB') {
                this.handleIbCompanyFrequentFlyer(flowId, index, type);
            } else {
                this.handleOtherCompanyFrequentFlyer(flowId, index, type);
            }
        } else {
            this.handleFrequentFlyerFormInvalid();
        }
    }

    private resetFrequentFlyerFormState = () => {
        this.model.showError = false;
        this.model.showOk = false;
        this.model.showErrorForm = false;
        this.model.showPatternError = false;
    };

    private handleIbCompanyFrequentFlyer = (flowId, index, type) => {
        if (this.tempFrequentFlyerInfo.number.length > 4 && this.tempFrequentFlyerInfo.number.length <= 14) {
            this.model.frequentFlyerInfo = this.tempFrequentFlyerInfo;
            this.updateDataContactInfo(flowId, this.model, index, type);
        } else {
            this.setFrequentFlyerErrorState(true);
        }
    };

    private handleOtherCompanyFrequentFlyer = (flowId, index, type) => {
        if (this.tempFrequentFlyerInfo.number.length <= 20) {
            this.model.frequentFlyerInfo = this.tempFrequentFlyerInfo;
            this.updateDataContactInfo(flowId, this.model, index, type);
        } else {
            this.setFrequentFlyerErrorState(false);
        }
    };

    private setFrequentFlyerErrorState = (isIbCompany) => {
        this.model.showError = true;
        this.model.showOk = false;
        this.model.submitted = false;
        this.model.showErrorForm = true;
        this.model.showPatternError = isIbCompany;
        this.closeMessageWithTimeout(true);
    };

    private handleFrequentFlyerFormInvalid = () => {
        this.model.submitted = false;
        this.model.showErrorForm = true;
        this.model.showOk = false;
        this.model.errorMsg = this.$filter('translate')('MMB_PASSENGER_MODAL_ALERT_SUBTITLE_ERROR');
        this.closeMessageWithTimeout(false);
    };

    private updateDataContactInfo = (flowId, data, index, type) => {
        this.BookingDashboardService.updateDataContactInfo(flowId, data, type).then(() => {
            var ffLocal;
            var ffLocalAux;
            var bookingInfo;
            var x;
            this.model.showError = false;
            this.model.showOk = true;
            this.localStorageService.set('savedPasSuccess', true);
            this.localStorageService.set('savedChangeSuccess', true);
            this.localStorageService.set('modifyFFOrSpecialNeed', true);
            bookingInfo = this.localStorageService.get('bookingInfo');
            ffLocal = this.localStorageService.get('ffLocal');
            ffLocal = ffLocal ? ffLocal : [];

            for (x = 0; x < ffLocal.length; x++) {
                if (ffLocal[x].id === data.passengerId) {
                    ffLocal[x].allCompany.push({
                        company: data.frequentFlyerInfo.company,
                        number: data.frequentFlyerInfo.number
                    });
                    // this.getNameCompany(data);
                    ffLocalAux = ffLocal[x].allCompany;
                }
            }

            ffLocalAux = this.getNameCompany(ffLocalAux, data);

            bookingInfo.passengers[index].additionalFFInfo = ffLocalAux;
            this.localStorageService.set('bookingInfo', bookingInfo);
            this.localStorageService.set('ffLocal', ffLocal);
            this.$rootScope.$emit('updateModelFf', ffLocalAux, index);
            this.CommonsUtilService.setTitlePage('MMB_TITLE_FRECUENT_PASSENGERS_ADD');
            this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOCFFL, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOCFFL, this.MmBAppConstants.QUADRIGAM.CONFIRM_FF);
            this.closeMessageWithTimeout(true);
        }, (error) => {
            if (error.messageList && error.messageList.length > 0) {
                this.model.errorMsg = error.messageList[0].message;
            } else if (error.message) {
                this.model.errorMsg = error.message;
            } else {
                this.model.errorMsg = this.$filter('translate')('MMB_PASSENGER_MODAL_ALERT_SUBTITLE_ERROR');
            }
            this.model.showError = true;
            this.model.showOk = false;
            this.closeMessageWithTimeout(false);
        });
    }

    private getNameCompany = (ffLocalAux, data) => {
        var x, y;
        for (x = 0; x < ffLocalAux.length; x++) {
            for (y = 0; y < data.frequentFlyersCompanies.length; y++) {
                if (ffLocalAux[x].company === data.frequentFlyersCompanies[y].iataCompanyCode) {
                    ffLocalAux[x].airlineName = data.frequentFlyersCompanies[y].airlineName;
                }
            }
        }
        return ffLocalAux;
    };

    updateSpecialNeedsContactInfo = (currentForm) => {
        const flowId = this.localStorageService.get('flowId');
        // let isIncludeWheelChair = this.hasIncludeWheelChair();

        currentForm.$submitted = true;
        this.model.submitted = true;
        this.model.showError = false;
        this.model.showOk = false;
        this.model.showErrorForm = false;

        this.model.specialNeeds.values = this.buildSpecialNeedsArray();
        if (this.modelOld) {
            this.modelOld.values = this.eliminateValues(this.modelOld);
        }

        if (this.hasCompareAndLogin()) {
            this.$rootScope.$broadcast('specialNeedForm', currentForm);
        }
        this.BookingDashboardService.updatePassengerSpecialNeeds(flowId, this.model).then(
            (data) => this.handleSpecialNeedsSuccess(data),
            (error) => this.handleSpecialNeedsError(error)
        );
    };

    // private hasIncludeWheelChair = () => {
    //     const codes = this.MmBAppConstants.SPECIAL_NEEDS.CODE;
    //     let isIncludeWheelChair = false;
    //     if (angular.isObject(this.model.specialNeeds)) {
    //         for (let i = 0; i < codes.WHEEL_CHAIR.length; i++) {
    //             const codeWheelChair = codes.WHEEL_CHAIR[i];
    //             if (this.model.specialNeeds.specialWheelchairValue === codeWheelChair) {
    //                 isIncludeWheelChair = true;
    //             }
    //         }
    //     };
    //     return isIncludeWheelChair;
    // };

    private buildSpecialNeedsArray = () => {
        const arraySpecialNeeds = [];
        const codes = this.MmBAppConstants.SPECIAL_NEEDS.CODE;
        
        if (this.model.specialNeeds.specialVision) {
            arraySpecialNeeds.push({ 'serviceCode': codes.BLND });
        }
        if (this.model.specialNeeds.specialIntellectual) {
            arraySpecialNeeds.push({ 'serviceCode': codes.DPNA });
        }
        if (this.model.specialNeeds.specialHearing) {
            arraySpecialNeeds.push({ 'serviceCode': codes.DEAF });
        }
        if (this.model.specialNeeds.specialGuideDog) {
            arraySpecialNeeds.push({ 'serviceCode': codes.SVAN });
        }
        if (this.model.specialNeeds.specialWheelchair && this.model.specialNeeds.specialWheelchairValue !== '') {
            arraySpecialNeeds.push({ 'serviceCode': this.model.specialNeeds.specialWheelchairValue });
        }
        return arraySpecialNeeds;
    };

    private handleSpecialNeedsSuccess = (data) => {
        this.model.showError = false;
        this.model.showOk = true;
        this.specialNeedsChange = true;
        this.localStorageService.set('savedPasSuccess', true);
        this.localStorageService.set('savedChangeSuccess', true);
        this.localStorageService.set('modifyFFOrSpecialNeed', true);
        this.updateStatusSpecialNeeds(data);
        this.closeMessageWithTimeout(true);
    };

    private handleSpecialNeedsError = (error) => {
        if (error.messageList && error.messageList.length > 0) {
            this.model.errorMsg = error.messageList[0].message;
        } else if (error.message) {
            this.model.errorMsg = error.message;
        } else {
            this.model.errorMsg = this.$filter('translate')('MMB_PASSENGER_MODAL_ALERT_SUBTITLE_ERROR');
        }
        this.model.showError = true;
        this.model.showOk = false;
        this.closeMessageWithTimeout(false);
    };

    private hasCompareAndLogin = ():boolean => {
        const custData = this.localStorageService.get('customerData');
        let ibPlusNumber = custData?.personalInfo?.ibPlusNumber ? custData.personalInfo.ibPlusNumber : null;
        let isEqual = this.compareObj(this.model.specialNeeds, this.modelOld);

        return (!isEqual && this.chkPassLogged(ibPlusNumber) && !this.CommonsUserUtilsService.isIbZero() && !this.CommonsUserUtilsService.isSoftUser());
    };

    updateStatusSpecialNeeds = (response) => {
        const passengersID = this.localStorageService.get('specialNeedsPassengersEdit');
        if (passengersID?.length > 0 && response?.order?.orderItems) {
            this.hasExistSpecialNeed(response, passengersID);
        };
    };

    private hasExistSpecialNeed = (response, passengersID) => {
        let arrPassengerId = null, arrTypes = null, groupTypes = null;
        let existSpecialNeed = this.groupByKey(response.order.orderItems, 'type');
        if (existSpecialNeed !== null && angular.isDefined(existSpecialNeed.specialNeed)) {
            arrPassengerId = this.groupByKey(response.order.orderItems, 'passengerId');
            arrTypes = this.groupByKey(arrPassengerId[passengersID], 'type');
            groupTypes = this.groupByKey(arrTypes['specialNeed'], 'serviceCode');

            for (let i = 0; i < this.model.specialNeeds.values.length; i++) {
                const value = this.model.specialNeeds.values[i];
                const status = this.getStatusForServiceCode(value.serviceCode, groupTypes);
                if (status !== undefined) {
                    value['status'] = status;
                }
            }
        };
    };

    private getStatusForServiceCode = (serviceCode, groupTypes) => {
        const codes = this.MmBAppConstants.SPECIAL_NEEDS.CODE;
        if (codes.WHEEL_CHAIR) {
            this.groupTypesWheelChair(codes, serviceCode, groupTypes);
        }
        const otherCodes = [codes.SVAN, codes.DEAF, codes.BLND, codes.DPNA];
        for (let i = 0; i < otherCodes.length; i++) {
            if (this.hasOtherTypes(otherCodes, groupTypes, serviceCode, i)) {
                return groupTypes[otherCodes[i]][0].status;
            }
        }
        return undefined;
    };

    private hasOtherTypes = (otherCodes, groupTypes, serviceCode, i) => {
        return (groupTypes[otherCodes[i]] && groupTypes[otherCodes[i]].length > 0 && serviceCode === otherCodes[i]);
    };

    private groupTypesWheelChair = (codes, serviceCode, groupTypes) => {
        for (let i = 0; i < codes.WHEEL_CHAIR.length; i++) {
            if (this.hasWeelChair(codes, groupTypes, serviceCode, i)) {
                return groupTypes[codes.WHEEL_CHAIR[i]][0].status;
            }
        }
    };

    private hasWeelChair = (codes, groupTypes, serviceCode, i) => {
        return (groupTypes[codes.WHEEL_CHAIR[i]] && groupTypes[codes.WHEEL_CHAIR[i]].length > 0 && serviceCode === codes.WHEEL_CHAIR[i]);
    };

    private closeMessageWithTimeout = (closeModal) => {
        this.$timeout(() => {
            if (this.model.showError) {
                this.model.showErrorForm = true;
            }
            this.model.submitted = false;
            this.model.showError = false;
            this.model.showOk = false;
            if (closeModal) {
                this.$uibModalInstance.close();
            }
        }, 3000);
    };

    areEmailsEquals = () => {
        var contactEmail = this.model.email || '';
        var repeatedEmail = this.model.emailRepeat || '';
        this.hasEquals = contactEmail.toLowerCase() === repeatedEmail.toLowerCase();
        if (angular.isDefined(this.modalContactForm)) {
            this.modalContactForm.emailRepeat.$setValidity('emailsNotEqual', this.hasEquals);
        }
    };

    resetOriginalSpecialNeeds = () => {
        if (!this.specialNeedsChange) {
            this.model.specialNeeds = this.model.originalSpecialNeeds;
        }
    };

    checkStatusSVAN = (status) => {
        if (status === 'UC' || status === 'UN') {
            return 'denied';
        } else if (status === 'HK' || status === 'KK') {
            return 'approved';
        } else if (status === 'HN') {
            return 'pending';
        } else {
            return false;
        }
    };

    private compareObj = (obj1, obj2) => {
        let obj1String = JSON.stringify(obj1);
        let obj2String = JSON.stringify(obj2);

        return obj1String === obj2String;
    }

    private eliminateValues = (objt) => {
        let objTemp = [];
        if (objt) {
            for (let index = 0; index < objt.values.length; index++) {
                objTemp.push({ 'serviceCode': objt.values[index].serviceCode });
            }
            return objt.values = objTemp;
        } else {
            return objt;
        }
    };

    checkPersonalInfoChanges = () => {
        this.hasEquals = true;
        let originalName = this.model.personalInfo.name;
        let updatedName = this.model.personalInfoEdit.name;
        let originalSurname = this.model.personalInfo.surname;
        let updatedSurname = this.model.personalInfoEdit.surname;
        let originalNameNoSpaces = originalName.trim().replace(/\s+$/, '');
        let updatedNameNoSpaces = updatedName.trim().replace(/\s+$/, '');
        let originalSurnameNoSpaces = originalSurname.trim().replace(/\s+$/, '');
        let updatedSurnameNoSpaces = updatedSurname.trim().replace(/\s+$/, '');
        if (originalNameNoSpaces === updatedNameNoSpaces && originalSurnameNoSpaces === updatedSurnameNoSpaces) {
            this.disableUpdatePersonaInfoAction = true;
        } else {
            this.disableUpdatePersonaInfoAction = false;
        }
    };

    private groupByKey = (array, key) => {
        if (!Array.isArray(array)) {
            return {};
        }
        return array.reduce((reduceValue, x) => {
            (reduceValue[x[key]] = reduceValue[x[key]] || []).push(x);
            return reduceValue;
        }, {});
    };
};
