import angular from "angular";
import { AdditionalService } from './models/additional-service-model';
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

@Component('ib-MmB-passengers-data-module', 'ibMmbPassengersDataComponent', {
    controllerAs: 'passDataCtrl',
    bindings: {
        model: '=',
        index: '<',
        apis: '<',
        passengers: '=',
        flags: '='
    },
    templateUrl: ['MmBAppConstants', (MmBAppConstants: MmBAppConstants) => {
        return MmBAppConstants.templatesRoute + 'ib-MmB-passengers-data-view.html';
    }]
}, ['MmBModalService', '$scope', 'localStorageService', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'CommonsUtilService'],
[])
export class ibMmbPassengersDataComponent implements angular.IController {
    model: any;
    index: any;
    apis: any;
    passengers: any;
    flags: any;

    constructor (
        private MmBModalService,
        private $scope,
        private localStorageService,
        private MmBDatalayerUtilsService,
        private MmBAppConstants: MmBAppConstants,
        private CommonsUtilService
    ) {
        this.$scope.$on('updateInfoSpecialNeedAccept', this.updateInfoSpecialNeedAccept);
        this.$scope.$on('updatePersonalInfo', this.updatePersonalInfoEvent);
    }

    $onInit = () => {
        this.infoSpecialNeed();
        if(!this.model.additionalServices) this.initAdditionalServices();
    };

    /**
     * Show update personal info event
     */
    updatePersonalInfoEvent = (e, data, model, allModifiedPersonalInfo) => {
        let nameComplete = '', newFlags: any = [];
        data.data.passengers.forEach(passenger => {
            if (passenger.passengerId === e.currentScope.passDataCtrl.model.passengerId) {
                e.currentScope.passDataCtrl.model.personalInfo.name = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.name : passenger.personalInfo.firstName;
                e.currentScope.passDataCtrl.model.personalInfo.surname = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.firstSurname : passenger.personalInfo.firstSurname;
                e.currentScope.passDataCtrl.model.personalInfo.birthDate = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.birthDate : (passenger.personalInfo.birthDate ? passenger.personalInfo.birthDate : null);
            };
        });

        //RESET MODIFIED FLAG
        e.currentScope.passDataCtrl.model.modifiedPersonalInfo = false;

        //OLD PASSENGERS MODIFIED
        allModifiedPersonalInfo.forEach(element =>{
            nameComplete = e.currentScope.passDataCtrl.model.personalInfo.name + e.currentScope.passDataCtrl.model.personalInfo.surname;
            if (element.modifiedPersonalInfo === true && element.name === nameComplete) {
                e.currentScope.passDataCtrl.model.modifiedPersonalInfo = true;
            }
        });
        //ACTUAL PASSENGER MODIFIED
        if (e.currentScope.passDataCtrl.model.passengerId === model.passengerId) {
            e.currentScope.passDataCtrl.model.modifiedPersonalInfo = true;
        }


        if (model.oldPassengerId && model.oldPassengerId !== model.passengerId) {
            let newArray, indexOld = 0, indexNew = 0, oldElement, auxPassengersId = [];
            indexOld = e.currentScope.passDataCtrl.flags.allFlags.map(item => item.passengerId).indexOf(model.oldPassengerId);
            indexNew = e.currentScope.passDataCtrl.flags.allFlags.map(item => item.passengerId).indexOf(model.passengerId);
            oldElement = e.currentScope.passDataCtrl.flags.allFlags[indexOld];

            if (indexNew > indexOld) {
                newArray = e.currentScope.passDataCtrl.flags.allFlags.slice(indexOld, indexNew + 1);
                newArray.forEach(item => {
                    auxPassengersId.push(item.passengerId);
                });
                newArray.shift();
                newArray.push(oldElement);
                newArray.forEach((item,index) => {
                    item.passengerId = auxPassengersId[index];
                });

                e.currentScope.passDataCtrl.flags.allFlags.splice(indexOld, newArray.length, ...newArray);

            } else {
                newArray = e.currentScope.passDataCtrl.flags.allFlags.slice(indexNew, indexOld + 1);
                newArray.forEach(item => {
                    auxPassengersId.push(item.passengerId);
                });
                newArray.pop();
                newArray.unshift(oldElement);
                newArray.forEach((item,index) => {
                    item.passengerId = auxPassengersId[index];
                });

                e.currentScope.passDataCtrl.flags.allFlags.splice(indexNew, newArray.length, ...newArray);
            }

            model.oldPassengerId = null;

        }
        newFlags.flags = {};
        e.currentScope.passDataCtrl.flags.allFlags.forEach(item=>{
            if (item.passengerId === e.currentScope.passDataCtrl.model.passengerId){
                item.flags.forEach((f) => {
                    newFlags.flags[f.type] = f.enabled;
                });
                e.currentScope.passDataCtrl.model.showUpdatePersonalInfo = newFlags.flags.PASSENGER_NAME_CORRECTION;
            }
        });
    }

    /**
     * Show change personal info
     */
    changePersonalInfo = (index) => {
        let commercialData = this.localStorageService.get('commercialData');
        this.model.personalInfoEdit = {name: '', surname: ''};
        this.model.personalInfoEdit.name = this.model.personalInfo.name.trim().replace(/\s+$/, '');
        this.model.personalInfoEdit.surname = this.model.personalInfo.surname.trim().replace(/\s+$/, '');
        this.model.index = index;
        this.model.type = 'personalInfo';
        this.model.originalPersonalInfo = {...this.model.personalInfo};
        this.model.market = commercialData.market;
        this.model.desactiveLastSurname = true;
        this.model.title = this.model.market.code === 'ES' ? 'MMB_PASSENGERS_PERSONAL_DATA_MODAL_TITLE_ES' : 'MMB_PASSENGERS_PERSONAL_DATA_MODAL_TITLE';
        this.MmBModalService.showPassengerModal(false, 'ib-modal-passengers-update-personal-info.html', this.model, 'ib-modals ib-modals--right fade').result.then(angular.noop, angular.noop);
    }

    /**
     * Show ib-modal-passengers-special-assistance.html modal
     * @param {*} index Identificator of the passenger in passengersModel
     */
    addSpecialNeeds = (index) => {
        this.model.index = index;
        this.model.originalSpecialNeeds = angular.copy(this.model.specialNeeds);
        this.model.type = 'specialNeeds';
        this.MmBModalService.showPassengerModal(false, 'ib-modal-passengers-special-assistance.html', this.model, 'ib-modals ib-modals--right fade').result.then(angular.noop, angular.noop);
        this.CommonsUtilService.setTitlePage('MMB_PASSENGERS_SPECIAL_NEEDS_TITLE');
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOPMR, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOPMR, this.MmBAppConstants.QUADRIGAM.SPECIAL_NEEDS_ADD);
    }
    /**
     * Show ib-modal-passengers-ff.html modal
     * @param {*} index Identificator of the passenger in passengersModel
     */
    addFrequentFlyer = (index) => {
        this.model.index = index;
        this.model.type = 'frequentFlyer';
        // this.model.originalFrequentFlyerInfo = angular.copy(this.model.frequentFlyerInfo);
        this.model.arrFrequentFlyerInfo = angular.copy(this.model.additionalFFInfo);
        this.model.frequentFlyersCompanies = this.localStorageService.get('frequentFlyersCompanies');
        this.MmBModalService.showPassengerModal(false, 'ib-modal-passengers-ff.html', this.model, 'ib-modals ib-modals--right fade').result.then(angular.noop, angular.noop);
        this.CommonsUtilService.setTitlePage('MMB_PASSENGERS_FREQUENTLY_PASSENGER_DATA_TITLE');
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOFFLY, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOFFLY, this.MmBAppConstants.QUADRIGAM.FRECUENT_F);
    }

    updateContactInfo = (index) => {
        this.model.index = index;
        this.model.type = 'contactInfo';
        this.MmBModalService.showPassengerModal(false, 'ib-modal-passengers-update-contact-info.html', this.model, 'ib-modals ib-modals--right fade').result.then(angular.noop, angular.noop);
        this.CommonsUtilService.setTitlePage('MODAL_PASSENGER_TITLE');
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOCONT, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOCONT, this.MmBAppConstants.QUADRIGAM.MODAL_ADD_CONTACT);
    };


    /**
     * Emit an event with the index of passenger
     */
    addApisData = () => {
        this.$scope.$emit('fillApisData', {
            index: this.index,
            info: this.passengers,
            type: ''
        });
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOAPIS, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOAPIS, this.MmBAppConstants.QUADRIGAM.ADD_APIS);
    }

    turnLink = (type) => {
        var enable;
        this.flags.allFlags[this.index].flags.forEach(function (element) {
            if (element.type === type) {
                enable = element.enabled;
            }
        });
        return enable;
    }

    infoSpecialNeed = () => {
        const localSpecialNeed = this.localStorageService.get('specialNeed') ? this.localStorageService.get('specialNeed') : [];

        if (localSpecialNeed.length > 0) {
            for (let x = 0; x < localSpecialNeed.length; x++) {
                if (localSpecialNeed[x].id === this.model.passengerId) {
                    this.model.specialNeeds = localSpecialNeed[x].need;
                }
            }
        }
    }

    updateInfoSpecialNeedAccept = (e, data) => {
        if (this.model.specialNeeds !== null) {
            this.model.specialNeeds.values = [];
        }
        data.map((dat) => {
            if (dat.type === 'specialNeed') {
                if (dat.passengerId === this.model.passengerId) {
                    let serviceCode = dat.serviceCode;
                    if (this.model.specialNeeds.values.filter(e => e.serviceCode === serviceCode).length === 0) {
                        this.model.specialNeeds.values.push(dat);
                    }
                }
            }
        });
    }

    private initAdditionalServices = (): void => {
        const bookingInfo: any = this.localStorageService.get('bookingInfo') || {};
        if(!this.model.additionalServices) this.model.additionalServices = [];

        bookingInfo?.order?.orderItems?.forEach(item => {
            if(this.checkPassenger(item?.passengerId) && this.isAdditionalService(item?.serviceCode || '')) {
                this.model.additionalServices.push(this.createAdditionalService(item));
            }
        });
    }

    private createAdditionalService = (item): AdditionalService => {
        let additionalService: AdditionalService = {} as AdditionalService;
        additionalService.serviceCode = item.serviceCode;
        additionalService.status = item?.status?.description;
        return additionalService;
    }

    private checkPassenger = (passengerId: string): boolean => {
        return this.model.passengerId === passengerId;
    }

    private isAdditionalService = (serviceCode): boolean => {
        const arrAdditionalServices = ['AVIH', 'BIKE', 'BSCT', 'BULK', 'CBBG', 'EXST', 'FRAG', 'MAAS', 'MEDA', 'PETC', 'UMNR', 'WEAP', 'TUR'];
        return arrAdditionalServices.includes(serviceCode);
    }
}
