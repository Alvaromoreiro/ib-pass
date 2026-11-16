import angular from "angular";
import { MatchingDocumentModel } from "../view-model/ib-MmB-booking-dashboard-model";
import { TravelDocumentsModel } from "@src/app/core/models/travel-documents/travel-documents-model";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { BookingDashboardService } from "./ib-MmB-booking-dashboard-service";

@Service(
    'ib-MmB-booking-dashboard-module',
    ['$rootScope','localStorageService', 'BookingDashboardConstants', 'BookingSearchService', '$window', 'IbCPermanentUserService', 
        'MmBDatalayerUtilsService', 'MmBModalService', 'BookingDashboardService', 'BookingDashboardSharedUtilsService', '$location', 'MmBAppConstants', 
        'IbMmbTravelDocumentsService', 'CommonsUtilService', 'RedirectionService', '$filter', 'NewMainHeaderFacade',
    ],
    [])
export class BookingDashboardUtilsService {
    constructor(
        private $rootScope: any,
        private localStorageService,
        private BookingDashboardConstants,
        private BookingSearchService,
        private $window,
        private IbCPermanentUserService,
        private MmBDatalayerUtilsService,
        private MmBModalService,
        private BookingDashboardService: BookingDashboardService,
        private BookingDashboardSharedUtilsService,
        private $location,
        private MmBAppConstants,
        private IbMmbTravelDocumentsService,
        private CommonsUtilService,
        private RedirectionService,
        private $filter,
        private NewMainHeaderFacade
    ) {
        
    }

    model;
    lastSavedApis;
    bookingInfo;
    isSkeleton;
    $onInit

    /**
     * Redirects to the corresponding site depending on the Id of the box-link clicked by the user.
     * @param {*event} event triggered when clicking in a box link.
     * @param {*string} linkId  identificator of the link that has been clicked.
     */
    boxLinkRedirection = (event, linkId) => {
        switch (linkId) {
            case this.BookingDashboardConstants.BOX_LINKS_TYPES.CHECK_IN:
                this.RedirectionService.externalRedirect(this.$filter('LinksFilter')('CHECKIN_ONLINE_APP') + '?market=' + this.$rootScope.appMarket + '&language=' + this.$rootScope.appLang + '&surname=' + this.localStorageService.get('checkinSurname') + '&pnr=' + this.localStorageService.get('PNR'));
                break;
            case this.BookingDashboardConstants.BOX_LINKS_TYPES.SEATS_AUCTION:
                this.BookingDashboardSharedUtilsService.handleUpgradeFlow();
                this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.MANAGE_RESERV);
                this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOUPG,MMBDatalayerConstants.DIGITAL_DATA_STEP.MOUPG, this.MmBAppConstants.QUADRIGAM.MODAL_SELECT_UPGRADING);
                break;
            case this.BookingDashboardConstants.BOX_LINKS_TYPES.BIDABLE:
                this.BookingDashboardSharedUtilsService.handleUpgradeFlow();
                this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.MANAGE_RESERV);
                this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOUPG,MMBDatalayerConstants.DIGITAL_DATA_STEP.MOUPG, this.MmBAppConstants.QUADRIGAM.MODAL_SELECT_UPGRADING);
                break;
            case this.BookingDashboardConstants.BOX_LINKS_TYPES.EMERGENCY_CONTACT:
                this.changeContactData();
                break;
            case this.BookingDashboardConstants.BOX_LINKS_TYPES.FLIGHT_REMINDER:
                this.MmBModalService.showFlightReminderModal(false, 'ib-modal-flight-reminder.html', this.model, 'ib-modals ib-modals--right fade').result.then(angular.noop, angular.noop);
                break;
            default:
                angular.noop();
        }
        if (linkId === 'emergencyContact') {
            this.CommonsUtilService.setTitlePage('MODULES_LINK_EMERGENCY_CONTACT_TITLE');
            this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOEMER, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOEMER, this.MmBAppConstants.QUADRIGAM.PASSENGER_FF_ADD);
        };
    };


   /**
    * Show ib-modal-contact-data.html modal
    */
    private changeContactData = () => {
        let dataAux;
        if (angular.isUndefined(this.model.passengersModel.contactData.emergencyContactInfo) || this.model.passengersModel.contactData.emergencyContactInfo === '') {
            this.model.passengersModel.contactData.emergencyContactInfo = { name: '', countryCode: '', phone: '', code: '' } ;
        }; 

        dataAux = {
            originalData: angular.copy(this.model.passengersModel.contactData.emergencyContactInfo),
            title: 'MODULES_LINK_EMERGENCY_CONTACT_TEXT',
            subtitle: 'MODULES_LINK_EMERGENCY_CONTACT_SUBTITLE',
            isEmergencyContactData: true,
            data: this.model.passengersModel.contactData.emergencyContactInfo,
            serviceData: this.model.passengersModel,
            type: 'emergencyContact'
        };
        this.model.passengersModel.originalData = angular.copy(this.model.passengersModel.contactData.emergencyContactInfo);
        this.model.passengersModel.isEmergencyContactData = true;
        this.MmBModalService.showPassengerModal(false, 'ib-modal-passengers-emergency-contact.html', dataAux, 'ib-modals ib-modals--right fade').result.then(angular.noop, angular.noop);
    };

    
        /**
     *
     * @param {*} event
     * @param {*} index
     */
    checkSpecialNeeds = (event, index) => {
        const specialNeeds = this.model.passengersModel.passengers[index].specialNeeds;
        const fields = [
            ['specialVision', 'specialVisionValue'],
            ['specialIntellectual', 'specialIntellectualValue'],
            ['specialHearing', 'specialHearingValue'],
            ['specialWheelchair', 'specialWheelchairValue']
        ];
        fields.forEach(([flag, value]) => {
            if (specialNeeds[flag] && angular.isUndefined(specialNeeds[value])) {
                specialNeeds[value] = '';
            }
        });
    };

    updatePassengerInfo = (event, index, type, infant) => {
        this.localStorageService.set('userType', this.CommonsUtilService.getUserTypeByToken());
        switch (type) {
            case 'frequentFlyer':
                this.handleFrequentFlyer(index, type);
                break;
            case 'primaryContact':
                this.handlePrimaryContact(index, type);
                break;
            case 'emergencyContact':
                this.handleEmergencyContact(index, type);
                break;
            case 'specialNeeds':
                this.updateSpecialNeeds(index);
                break;
            case 'APIS':
                this.handleApis(index);
                break;
            default:
                angular.noop();
        }
    };

    
     /**
     * Receives the event of editing/adding passenger APIs data and call service to get the information. Then adds it to model.
     * @param {*} event event triggered to update passenger APIs
     * @param {*} selectedPass Index of the passenger
     * @param {*} passType Type of the passenger selected
     */
    getApisData = (event, selectedPass) => {
        const passFormData = this.model.passengersModel.passengers[selectedPass.index].additionalRequiredInfo;
        const existInfant = (passFormData?.existInfant) ? passFormData.existInfant : false;
        const passengerId = this.getApisPassengerId(selectedPass.index);
        this.model.submitted = true;
        this.model.showError = false;
        this.model.showOk = false;
        this.model.showErrorForm = false;
        this.model.errorMsg = undefined;
        this.MmBModalService.showWaitingModal();

        this.BookingDashboardService.callApisService(this.model.bookingGeneralInfo.flowId, passengerId).then((apisData:any) => {
            const callTravelDocs:boolean = this.localStorageService.get('activateTravelDocs');
            const isLogged:boolean = this.logged();
            this.MmBModalService.finishWaiting();
            angular.extend(this.model.passengersModel.passengers[selectedPass.index].additionalRequiredInfo, apisData.passengerApisInfo);
            angular.extend(this.model, apisData.additionalInfo);
            this.lastSavedApis[selectedPass.index] = angular.copy(this.model.passengersModel.passengers[selectedPass.index].additionalRequiredInfo);
            this.MmBModalService.showGenericModal(true, 'ib-modal-apis.html', {
                passengers: selectedPass.info,
                passengerApisInfo: passFormData,
                countriesList: this.model.countriesList,
                companiesList: this.model.companiesList,
                statesList: this.model.statesList,
                passIndex: selectedPass.index,
                existInfant: existInfant
            }, 'ib-modals ib-modals--right fade').result.then(
                () => {
                       this.$rootScope.$broadcast('apisFormSaved', { passengerId: passengerId });
                },
                angular.noop
            );

            //1. CHECK IF LOGGED
            if (callTravelDocs && isLogged) {
                this.handleApisTravelDocs(selectedPass, passengerId, apisData);
            }

    
        }, (error) => {
            this.MmBModalService.finishWaiting();
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
        });
    };    

    private handleFrequentFlyer(index, type) {
        this.initChangeOrderContactInfoRequest(
            this.model.bookingGeneralInfo.flowId,
            this.model.passengersModel.passengers[index],
            type,
            index
        );
    };

    private initChangeOrderContactInfoRequest = (flowId, data, type, index) => {
        let x, ffLocal, ffLocalAux, bookingInfoOld;

        this.MmBModalService.showWaitingModal();
        this.BookingDashboardService.updateDataContactInfo(flowId, data, type).then(() => {
            if (type === 'frequentFlyer') {
                this.localStorageService.set('modifyFFOrSpecialNeed', true);
            }
            this.localStorageService.set('savedChangeSuccess', true);
            this.localStorageService.set('savedPasSuccess', true);

            ffLocal = this.localStorageService.get('ffLocal');
            ffLocal = ffLocal ? ffLocal : [];

            for (x = 0; x < ffLocal.length; x++) {
                if (ffLocal[x].id === data.passengerId) {
                    ffLocal[x].allCompany.push({
                        company: data.frequentFlyerInfo.company,
                        number: data.frequentFlyerInfo.number,
                        airlineName: data.frequentFlyerInfo.airlineName
                    });
                    ffLocalAux = ffLocal[x].allCompany;
                }
            }

            bookingInfoOld = this.localStorageService.get('bookingInfo');
            if (data.passengers) {
                bookingInfoOld.passengers = data.passengers;
                this.localStorageService.set('bookingInfo', bookingInfoOld);
            }
            this.MmBModalService.closeAllCurrentModals();
            this.$location.path(this.MmBAppConstants.PAGES_URL.MMB_DASHBOARD);
            this.bookingInfo = this.localStorageService.get('bookingInfo');
            if (type === 'emergencyContact') {
                this.bookingInfo.passengers[0].emergencyContactInfo = data.contactData.emergencyContactInfo;
                this.localStorageService.set('bookingInfo', this.bookingInfo);
                this.$rootScope.$emit('confirmEmergencyContact', this.model.passengersModel.contactData.emergencyContactInfo);
            }

            this.bookingInfo.passengers[index].additionalFFInfo = ffLocalAux;
            this.localStorageService.set('bookingInfo', this.bookingInfo);
            this.localStorageService.set('ffLocal', ffLocal);
            this.model.passengersModel.passengers[index].additionalFFInfo = ffLocalAux;
            this.MmBModalService.finishWaiting();
        }, (error) => {
            this.returnOriginalData(null, type, index);
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            this.MmBModalService.finishWaiting();
        });
    };

    private handlePrimaryContact(index, type) {
        delete this.model.passengersModel.contactData.primaryContactInfo.emailRepeat;
        delete this.model.passengersModel.originalData.emailRepeat;
        if (!angular.equals(this.model.passengersModel.originalData, this.model.passengersModel.contactData.primaryContactInfo)) {
            this.initChangeOrderContactInfoRequest(
                this.model.bookingGeneralInfo.flowId,
                this.model.passengersModel,
                type,
                index
            );
        } else {
            this.$location.path(this.MmBAppConstants.PAGES_URL.MMB_DASHBOARD);
        }
    };

    private handleEmergencyContact(index, type) {
        if (!angular.equals(this.model.passengersModel.originalData, this.model.passengersModel.contactData.emergencyContactInfo)) {
            angular.forEach(this.model.passengersModel.passengers, (passenger) => {
                passenger.emergencyContactInfo = this.model.passengersModel.originalData;
            });
            this.initChangeOrderContactInfoRequest(
                this.model.bookingGeneralInfo.flowId,
                this.model.passengersModel,
                type,
                index
            );
        } else {
            this.$location.path(this.MmBAppConstants.PAGES_URL.MMB_DASHBOARD);
        }
    };

    private handleApis(index) {
        this.model.shouldLoad = true;
        this.$rootScope.$broadcast(
            'updateDocument',
            this.model.passengersModel.passengers[index].additionalRequiredInfo,
            this.model.passengersModel.passengers[index]?.frequentFlyerInfo?.number
        );
        this.BookingDashboardService.updateApisInfo(
            this.model.bookingGeneralInfo.flowId,
            this.model.passengersModel.passengers[index].additionalRequiredInfo,
            this.model.passengersModel.contactData.emergencyContactInfo,
            this.model.passengersModel.passengers
        ).then(() => {
            this.MmBModalService.finishWaiting();
            this.lastSavedApis[index] = angular.copy(this.model.passengersModel.passengers[index].additionalRequiredInfo);
            this.$rootScope.$broadcast('closeMessageWithTimeoutApis', true);
        }, (error) => {
            this.$rootScope.$broadcast('closeMessageWithTimeoutApis', false);
        });
        this.MmBModalService.finishWaiting();
    };

    private updateSpecialNeeds = (index) => {
        const arraySpecialNeeds = [], arraySpecialNeedsAll = [];
        if (this.model.passengersModel.passengers[index].specialNeeds.specialVision) {
            arraySpecialNeeds.push({
                serviceCode: this.MmBAppConstants.SPECIAL_NEEDS.CODE.BLND
            });
        }
        if (this.model.passengersModel.passengers[index].specialNeeds.specialIntellectual) {
            arraySpecialNeeds.push({
                serviceCode: this.MmBAppConstants.SPECIAL_NEEDS.CODE.DPNA
            });
        }
        if (this.model.passengersModel.passengers[index].specialNeeds.specialHearing) {
            arraySpecialNeeds.push({
                serviceCode: this.MmBAppConstants.SPECIAL_NEEDS.CODE.DEAF
            });
        }
        if (this.model.passengersModel.passengers[index].specialNeeds.specialGuideDog) {
            arraySpecialNeeds.push({
                serviceCode: this.MmBAppConstants.SPECIAL_NEEDS.CODE.SVAN
            });
        }
        if (this.model.passengersModel.passengers[index].specialNeeds.specialWheelchair) {
            arraySpecialNeeds.push({
                serviceCode: this.model.passengersModel.passengers[index].specialNeeds.specialWheelchairValue
            });
        }
        this.model.passengersModel.passengers[index].specialNeeds.values = arraySpecialNeeds;
        arraySpecialNeedsAll.push({
            id: this.model.passengersModel.passengers[index].passengerId,
            need: this.model.passengersModel.passengers[index].specialNeeds
        });

        this.MmBModalService.showWaitingModal();
        this.BookingDashboardService.updatePassengerSpecialNeeds(this.model.bookingGeneralInfo.flowId, this.model.passengersModel.passengers).then((data) => {
            this.localStorageService.set('modifyFFOrSpecialNeed', true);
            this.MmBModalService.finishWaiting();
        }, (error) => {
            this.returnOriginalData(null, this.model.passengersModel.passengers[index].type, index);
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            this.MmBModalService.finishWaiting();
        });
    };
 
    returnOriginalData = (event, type, index) => {
        switch (type) {
            case 'primaryContact':
                this.model.passengersModel.contactData.primaryContactInfo = this.model.passengersModel.originalData;
                break;
            case 'frequentFlyer':
                this.model.passengersModel.passengers[index].frequentFlyerInfo = this.model.passengersModel.passengers[index].originalFrequentFlyerInfo;
                break;
            case 'specialNeeds':
                this.model.passengersModel.passengers[index].specialNeeds = this.model.passengersModel.passengers[index].originalSpecialNeeds;
                break;
            case 'APIS':
                this.model.passengersModel.passengers[index].additionalRequiredInfo = angular.copy(this.lastSavedApis[index]);
        }
    };

    getApisPassengerId(index) {
        const passenger = this.model.passengersModel.passengers[index];
        if (passenger.passengerType !== this.MmBAppConstants.PASSENGER_TYPE.INFANT) {
            return passenger.passengerId;
        }
        return passenger.relatedPassengerId
            ? passenger.relatedPassengerId
            : this.searchRelatedPassenger(passenger.relatedPassenger, this.model.passengersModel.passengers);
    };

    private searchRelatedPassenger = (nameRelated, passengers) => {
        let idPassenger = nameRelated;
        for (let i = 0; i < passengers.length; i++) {
            const passenger = passengers[i];
            if (this.hasPersonalInfoNameAndSurname(passenger, nameRelated)) {
                idPassenger = passenger.passengerId;
            };
        }
        return idPassenger;
    };

    private hasPersonalInfoNameAndSurname = (passenger, nameRelated) => {
        return (angular.isDefined(passenger.personalInfo) && angular.isDefined(passenger.personalInfo.name) && angular.isDefined(passenger.personalInfo.surname) && passenger.personalInfo.name + ' ' + passenger.personalInfo.surname == nameRelated);
    };

    private handleApisTravelDocs(selectedPass, passengerId, apisData) {
        const passengerAssociatedId = this.getPassengerAssociatedId(passengerId);
        if (passengerAssociatedId === passengerId) {
            const optionSelected = this.lastSavedApis[selectedPass.index].mandatoryDocuments?.selectedDoc || '';
            const securityDocs = this.lastSavedApis[selectedPass.index].mandatoryDocuments.documents;
            this.IbMmbTravelDocumentsService.getTravelDocuments().then((res:TravelDocumentsModel) => {
                this.updateApisTravelDocsMandatory(apisData, securityDocs, res.data, optionSelected);
            }, angular.noop);
        }
    };

    private getPassengerAssociatedId(passengerId) {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const customerData = this.localStorageService.get('customerData');
        const ibPlusNumber = customerData?.personalInfo?.ibPlusNumber;
        const passengerAssociated = bookingInfo.passengers.filter(passenger => passenger?.frequentFlyerInfo?.number === ibPlusNumber);
        return passengerAssociated[0]?.passengerId || '';
    }

    private updateApisTravelDocsMandatory(apisData, securityDocs, travelDocsData, optionSelected) {
        const document: MatchingDocumentModel = this.matchingTravelDocsMandatory(securityDocs, travelDocsData);
        let date = document.travelDoc.expiry_date;
        apisData.passengerApisInfo.mandatoryDocuments.travelDocuments = travelDocsData.documents;
        if (!optionSelected) {
            apisData.passengerApisInfo.mandatoryDocuments.selectedDoc = this.buildSelectedDoc(document, date);
        }
    };

    private buildSelectedDoc(document: MatchingDocumentModel, date) {
        return {
            type: this.buildDocType(document),
            description: document.mandatoryDoc.type.description,
            number: document.travelDoc.document_number,
            requiredFields: document.mandatoryDoc.requiredFields,
            expiryDate: this.buildExpiryDate(date),
            isSaved: false,
            requiredFieldsOptions: this.buildRequiredFieldsOptions(document),
            issuerCountry: document.travelDoc.country
        };
    };

    private buildDocType(document: MatchingDocumentModel) {
        return {
            code: document.mandatoryDoc.type.code,
            description: document.mandatoryDoc.type.description
        };
    };

    private buildExpiryDate(date) {
        return {
            year: this.getExpiryYear(date),
            month: this.getExpiryMonth(date),
            day: this.getExpiryDay(date)
        };
    };

    private getExpiryYear(date) {
        if (angular.isDefined(date) && date !== null) {
            if (angular.isString(date)) {
                return date.substring(0, 4);
            }
            return date.year || '';
        }
        return '';
    }

    private getExpiryMonth(date) {
        if (angular.isDefined(date) && date !== null) {
            if (angular.isString(date)) {
                return date.substring(5, 7);
            }
            return date.month || '';
        }
        return '';
    }

    private getExpiryDay(date) {
        if (angular.isDefined(date) && date !== null) {
            if (angular.isString(date)) {
                return date.substring(8, 10);
            }
            return date.day || '';
        }
        return '';
    }

    private buildRequiredFieldsOptions(document: MatchingDocumentModel) {
        return document.mandatoryDoc.requiredFieldsOptions || [];
    };

    private matchingTravelDocsMandatory (mandatoryDocs, travelDocuments):MatchingDocumentModel {
        const codeMap = this.MmBAppConstants.SECURITY_AND_TRAVEL_DOCUMENTS_MANDATORY;
        let document:MatchingDocumentModel = {
            mandatoryDoc: {
                type: {
                    code: '',
                    description: ''
                },
                requiredFields: [],
                requiredFieldsOptions: []
            },
            travelDoc: {
                expiry_date: null,
                document_number: null,
                country: null
            }
        };
        mandatoryDocs.forEach((mandatoryDoc, index, array) => {
            const matchingCodes = codeMap[mandatoryDoc.type.code] || [];
            const matchingObject = travelDocuments.documents.find(item => matchingCodes.includes(item.document_type)) || {};
            if (Object.keys(matchingObject).length > 0) {
                document = {mandatoryDoc, travelDoc: matchingObject};
                array.length = 0;
            }
        })

        return document;
    };

    logged = () => {
        return this.localStorageService.get('userLogged');
    };

    /**
     * Call to import-order, ancillaries
     */
    reloadImportOrder = () => {
        this.cleanBasket();
        this.IbCPermanentUserService.removeParamsAfterLogin();
        this.localStorageService.set('flowApp', 'MMB');
        let data, pnrInfo = this.localStorageService.get('PNR'), surnameInfo = this.localStorageService.get('checkinSurname');
        this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.management);
        this.$window.scrollTo(0, 0);
        data = { pnr: pnrInfo, surname: surnameInfo, isAirShuttle: false };
        //this.localStorageService.remove('bookingInfo');
        this.localStorageService.remove('RechargeBookingInfo');
        this.BookingSearchService.searchFlightsPassengersEvent(null, data);
        this.localStorageService.set('sendReloadEvent', true);
    };

    private cleanBasket = () => {
        this.localStorageService.remove('headerModel');
        this.localStorageService.remove('voucherDeleteInfo');
        this.initFacadeHeader();
    };

    updateModelFf = (e, ffLocalAux, index) => {
        this.model.passengersModel.passengers[index].additionalFFInfo = ffLocalAux;
    };

     initFacadeHeader = () => {
        this.NewMainHeaderFacade.initHeader(
            {
                originDestination: null,
                redemption: '',
                flightType: null,
                currency: this.localStorageService.get('currency'),
                showBasket: true,
                showModalBackHome: true
            },
            { hasSteps: false, steps: 'DEFAULT_STEPS', position: 0 },
            {
                onLogin: function () {
                    this.MmBModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                },
                onError: function (error) {
                    this.MmBModalService.finishWaiting();
                },
                afterLogin: this.$onInit,
                userLogged: this.localStorageService.get('userLogged'),
                loggedData: this.localStorageService.get('customerData') || this.localStorageService.get('membershipData') || undefined
            }
        );
    };

    updateSpecialMeals = (evt, data) => {
        const quadrigam = this.MmBAppConstants.QUADRIGAM.ANC_SPECIAL_MEALS_UPDATE;
        const specialMealAux = this.localStorageService.get('specialMealsTempInfoAux');
        this.bookingInfo = this.localStorageService.get('bookingInfo');
        const countSpecialMealAll = this.updateSegmentsSpecialMeals(specialMealAux);
        this.setSpecialMealsTotals(countSpecialMealAll, specialMealAux);
        this.CommonsUtilService.setTitlePage('MMB_TITLE_ANC_SPECIAL_MEALS_UPDATE');
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
    };

    private updateSegmentsSpecialMeals(specialMealAux) {
        let countSpecialMealAll = 0;
        this.model.managementMeals.segments.forEach(segment => {
            let countSpecialMeal = 0;
            segment.passengers = [];
            specialMealAux.forEach(aux => {
                if (segment.id_segment === aux.segmentId) {
                    segment.passengers.push(aux);
                    if (aux.menu !== 'standard') {
                        countSpecialMeal++;
                    }
                }
            });
            segment.numSpecialMeals = countSpecialMeal;
            countSpecialMealAll += countSpecialMeal;
        });
        return countSpecialMealAll;
    };

    private setSpecialMealsTotals(countSpecialMealAll, specialMealAux) {
        this.model.ancillariesInfo.specialMealsInfo.specialMealNumSelected = countSpecialMealAll;
        this.model.managementMeals.specialMealNumSelected = countSpecialMealAll;
        this.localStorageService.set('specialMealsCopy', specialMealAux);
    };
   
};
