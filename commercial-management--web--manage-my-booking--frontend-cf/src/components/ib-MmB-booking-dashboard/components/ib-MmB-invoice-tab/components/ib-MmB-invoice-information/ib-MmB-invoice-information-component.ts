import * as angular from 'angular';
import { MmBAppConstants } from '../../../../../../ib-MmB-constants';
import { MmBUtilService } from '../../../../../services/Utils/ib-MmB-utils';
import { MmBDatalayerUtilsService } from '../../../../../services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service'
import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';


@Component('ib-MmB-invoice-information-module', 'ibMmbInvoiceInformation', {
    controllerAs: 'ibMmbInvoiceInformationCtrl',
    bindings: {
        showInvoiceData: '=',
        selectableList: '=',
        checkRequestInvoice: '=',
        visibleForm: '=',
        showConfirmation: '=',
        invoiceDetail: '=',
        listInvoicesSelected: '=',
        getInvoiceData: '=',
        listInvoices: '='
    },
    templateUrl: ['MmBAppConstants', (MmBAppConstants: MmBAppConstants):string => MmBAppConstants.templatesRoute + 'ib-MmB-invoice-information-view.html']
}, ['$rootScope','localStorageService','MmBAppConstants','GetStatesListService','GetCountriesListService','MmBModalService','MmBDatalayerUtilsService','MmBUtilService'],[])
export class ibMmbInvoiceInformationComponent implements ng.IController {
    showInvoiceData: boolean;
    checkRequestInvoice: boolean;
    visibleForm: boolean;
    selectableList: boolean;
    showConfirmation: boolean;
    invoiceDetail:any;
    listInvoices:any;
    getInvoiceData: any;
    invoiceInformationForm:any;
    validationError:boolean = false;
    listInvoicesSelected: [];
    provinceTypes:[] = [];
    countryTypes:[] = [];
    model:any = {};
    radioSelected:string = '';
    showProvincesInput:boolean = false;
    showProvincesSelect:boolean = false;
    showCountrySelect:boolean = true;
    issuerCountry:string = '';
    statesLiteral: string;
    constructor (
        private $rootScope: CommonsRootScope,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBAppConstants: MmBAppConstants,
        private GetStatesListService: GetStatesListService,
        private GetCountriesListService: GetCountriesListService,
        private MmBModalService,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private MmBUtilService: MmBUtilService
    ) {}


    // informationIsMobile = informationIsMobile;

    $onInit = () => {
        this.radioSelected = this.MmBAppConstants.INVOICE_DATA_TYPE.PARTICULAR;
        this.getInvoiceInfo();
    }

    getInvoiceInfo = () => {
        this.getCountrys();
        const dataPassengers:any = this.localStorageService.get('passengers') ? this.localStorageService.get('passengers') : {};
        const customerData:any = this.MmBUtilService.isUserLogged() ? JSON.parse(sessionStorage.getItem('customerData')) : {};

        this.model.billingData = {
            name: this.getName(customerData, dataPassengers),
            surname: this.getSurname(customerData, dataPassengers),
            businessName: null,
            identityInformation: customerData?.documentId,
            address: customerData?.address,
            floor: null,
            city: null,
            postalCode: customerData?.postalCode,
            country: null,
            province: null,
        };
        this.model.shippingData = {
            email: dataPassengers[0]?.contactInfo?.email ? dataPassengers[0]?.contactInfo?.email : customerData?.email ? customerData?.email : null,
        };
    }

    getName = (customerData:any, dataPassengers:any) => {
        if (this.MmBUtilService.isUserLogged() && customerData?.name) {
            return customerData.name;
        } else if (dataPassengers[0]?.externalPersonalInfo?.name) {
            return dataPassengers[0].externalPersonalInfo.name;
        } else if (dataPassengers[0]?.personalInfo?.name) {
            return dataPassengers[0].personalInfo.name;
        }
        return null;
    }

    getSurname = (customerData, dataPassengers) => {
        let result = null;
        if (this.MmBUtilService.isUserLogged() && customerData?.surname) {
            result = customerData.surname;
        } else if (dataPassengers[0]?.externalPersonalInfo?.firstSurname) {
            result = dataPassengers[0].externalPersonalInfo.firstSurname;
        } else if (dataPassengers[0]?.personalInfo?.surname) {
            result = dataPassengers[0].personalInfo.surname;
        }
        return result;
    }

    updateInvoiceInfo = () => {
        this.invoiceInformationForm.$submitted = true;
        this.validationError = false;
        if (this.invoiceInformationForm.$valid) {
            this.showConfirmation = true;
            this.invoiceDetail = this.model;
            this.setDigitalData(this.MmBAppConstants.QUADRIGAM.INVOICE_SUMMARY);
        } else {
            this.validationError = true;
        }
    }

    setDigitalData = (quadrigam) => {
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
        
    }

    close = () => {
        if (window.innerWidth < 768) {
            //mobile
            this.showInvoiceData = false;
            this.checkRequestInvoice = true;
            this.visibleForm = false;
            this.selectableList = true;
            this.resetCheckedInvoiceItems();
            this.listInvoices = this.getNotEmitedListInvoices();
        } else  {
            //desktop
            this.showInvoiceData = false;
            this.checkRequestInvoice = false;
            this.selectableList = false;
            this.visibleForm = false;
            this.getInvoiceData();
        }
    }

    resetCheckedInvoiceItems = () => {
        this.listInvoicesSelected = [];
        this.listInvoices.forEach((item: { checked: boolean; }) => item.checked = false);
    }

    getNotEmitedListInvoices = () => {
        return this.listInvoices.filter((item: { billingData: null; }) => item.billingData === null);
    }

    getCountrys = () => {
        this.GetCountriesListService.getCountriesList().then((item:any)=>{
            this.countryTypes = item;
        });
    }

    getProvinceByCountry = (itemSelected:any) => {
        this.issuerCountry = itemSelected;
        this.model.billingData.province = null;
        this.statesLiteral = itemSelected === 'ES' ? 'PROVINCE_FIELD' : this.MmBAppConstants.COUNTRIES_FOR_STATES_LITERAL.indexOf(itemSelected) !== -1 ? 'STATE_FIELD' : 'REGION';
        this.GetStatesListService.getStatesList(itemSelected).then(
            (item:[])=>{
                if (item.length > 0) {
                    this.showProvincesSelect = true;
                    this.showProvincesInput = false;
                } else {
                    this.showProvincesSelect = false;
                    this.showProvincesInput = true;
                }

                this.provinceTypes = item;
                return;
        }).catch((error:any) => {
            this.showProvincesSelect = false;
            this.showProvincesInput = true;
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
        });
    }

    getIsoCode = (id: any) => {
        const countryTypes:any = this.localStorageService.get('countriesList') ? this.localStorageService.get('countriesList') : [];
        const country =  countryTypes.find((country: { code: any; }) => country.code = id);
        return country.isoCode;
    }
}

