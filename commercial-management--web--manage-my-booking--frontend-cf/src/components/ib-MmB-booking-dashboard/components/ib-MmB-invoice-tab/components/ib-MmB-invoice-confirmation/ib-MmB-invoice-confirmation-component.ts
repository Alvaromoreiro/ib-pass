import * as angular from 'angular';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { InvoiceIssueService } from './service/ib-MmB-invoice-issue-service';
import { MmBUtilService } from '@src/components/services/Utils/ib-MmB-utils';
import { MmBDatalayerUtilsService } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service'
import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';


@Component('ib-MmB-invoice-confirmation-module', 'ibMmbInvoiceConfirmation', {
    controllerAs: 'ibMmbInvoiceConfirmationCtrl',
    bindings: {
        invoiceDetail: '=',
        listInvoicesSelected: '=',
        checkRequestInvoice: '=',
        visibleForm: '=',
        showConfirmation: '=',
        showInvoiceData: '=',
        selectableList: '=',
        showOkConfirmation: '=',
        showPartialErrorConfirmation: '=',
        getInvoiceData: '=',
        listInvoices: '='
    },
    templateUrl: ['MmBAppConstants', (MmBAppConstants: MmBAppConstants):string => MmBAppConstants.templatesRoute + 'ib-MmB-invoice-confirmation-view.html']
}, ['$translate','$filter','$rootScope', 'InvoiceIssueService', 'localStorageService', 'MmBAppConstants', 'MmBUtilService','MmBDatalayerUtilsService'],
[])
export class ibMmbInvoiceConfirmationComponent implements ng.IController {
    showErrorConfirmation:boolean = false;
    showSpinner:boolean = false;
    requestInvoiceSingular:boolean = false;
    requestInvoicePlural:boolean = false;
    literalRequestInvoice:boolean = false;
    checkRequestInvoice: boolean = false;
    showConfirmation: boolean = false;
    listInvoices:any;
    listInvoicesSelected:[];
    invoiceDetail:any;
    getInvoiceData:any;
    showInvoiceData: boolean;
    visibleForm: boolean;
    selectableList: boolean;
    showOkConfirmation: boolean;
    showPartialErrorConfirmation: boolean;
    constructor (
        private $translate: any,
        private $filter: any,
        private $rootScope: CommonsRootScope,
        private InvoiceIssueService: InvoiceIssueService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBAppConstants: MmBAppConstants,
        private MmBUtilService: MmBUtilService,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
    ) {}

    activate = ():any => {
        this.$translate.onReady()
            .then(() => {
                this.requestInvoiceSingular = this.$filter('translate')('MMB_INVOICES_CTA_LINK_SINGULAR');
                this.requestInvoicePlural = this.$filter('translate')('MMB_INVOICES_CTA_LINK');
            }).then(() => {
                this.checkNumberInvoicesSelected();
            });
    }

    close = () => {
        this.checkRequestInvoice = true;
        this.showConfirmation = false;
        this.resetCheckedInvoiceItems();
        this.listInvoices = this.getNotEmitedListInvoices();
    }

    resetCheckedInvoiceItems = () => {
        this.listInvoicesSelected = [];
        this.listInvoices.forEach(item => item.checked = false);
    }

    getNotEmitedListInvoices = () => {
        return this.listInvoices.filter(item => item.billingData === null);
    }

    requestInvoices = () => {
        this.showSpinner = true;
        let bodyRequestInvoice = {
            invoiceIssueData: [
                {
                    ticketsNumber: this.getTicketsNumber(),
                    shippingData: {
                        language: this.$rootScope.appLang.toUpperCase(),
                        email: this.invoiceDetail.shippingData.email
                    },
                    billingData: {
                        name: this.invoiceDetail.billingData.businessName ? this.invoiceDetail.billingData.businessName : this.invoiceDetail.billingData.name,
                        surname: this.invoiceDetail.billingData.businessName ? null : this.invoiceDetail.billingData.surname,
                        identityInformation: this.invoiceDetail.billingData.identityInformation,
                        address: `${this.invoiceDetail.billingData.address} ${this.invoiceDetail.billingData.floor ? this.invoiceDetail.billingData.floor : ''}`,
                        addressForRequested: this.invoiceDetail.billingData.address,
                        floor: this.invoiceDetail.billingData.floor,
                        postalCode: this.invoiceDetail.billingData.postalCode,
                        city: this.invoiceDetail.billingData.city,
                        province: this.invoiceDetail.billingData.province,
                        country: this.invoiceDetail.billingData.country
                    }
                }
            ]
        };

        const addInvoiceIssueSuccess:any = (data) => {
            const getNewRequestInvoice:any = this.localStorageService.get('newRequestInvoices') ? this.localStorageService.get('newRequestInvoices') : [];
            this.showSpinner = false;
            // CASE  206
            // if (data && data.code === 206) {
                if (data) {
                    let dataResults = data.results ? data.results : data;
                    let newBodyRequestInvoice = bodyRequestInvoice;
                    dataResults.filter(item => {
                        if (item.status === 'SUCCESS') {
                            let arrNewRequestInvoices = [];
                            if (getNewRequestInvoice) {
                                arrNewRequestInvoices = getNewRequestInvoice;
                                if (!getNewRequestInvoice.includes(item.ticketId)) {
                                    arrNewRequestInvoices.push(item.ticketId);
                                    this.localStorageService.set('newRequestInvoices', arrNewRequestInvoices);
                                }
                            } else {
                                arrNewRequestInvoices.push(item.ticketId);
                                this.localStorageService.set('newRequestInvoices', arrNewRequestInvoices);
                            }


                        } else if (item.status === 'FAILURE') {
                            const getNewRequestInvoicesFailure:any = this.localStorageService.get('newRequestInvoicesFailure') ? this.localStorageService.get('newRequestInvoicesFailure') : [];
                            let arrNewRequestInvoicesFailure = [];
                            const index = newBodyRequestInvoice.invoiceIssueData[0].ticketsNumber.indexOf(item.ticketId);
                            if (index > -1) {
                                newBodyRequestInvoice.invoiceIssueData[0].ticketsNumber.splice(index, 1);
                            }
                            if (getNewRequestInvoicesFailure) {
                                arrNewRequestInvoicesFailure = getNewRequestInvoicesFailure;
                                if (!getNewRequestInvoicesFailure.includes(item.ticketId)) {
                                    arrNewRequestInvoicesFailure.push(item.ticketId);
                                    this.localStorageService.set('newRequestInvoicesFailure', arrNewRequestInvoicesFailure);
                                }


                            } else {
                                arrNewRequestInvoicesFailure.push(item.ticketId);
                                this.localStorageService.set('newRequestInvoicesFailure', arrNewRequestInvoicesFailure);
                            }
                        }
                    });

                    this.showErrorConfirmation = false;
                    this.showConfirmation = false;
                    this.showInvoiceData = false;
                    this.checkRequestInvoice = false;
                    this.visibleForm = false;
                    this.selectableList = false;
                    this.showOkConfirmation = false;
                    this.showPartialErrorConfirmation = true;
                    this.reloadInvoiceData(newBodyRequestInvoice);
                    this.setDigitalData(this.MmBAppConstants.QUADRIGAM.INVOICE_ERROR_PARTIAL);
                } else {
                    this.showErrorConfirmation = false;
                    this.showConfirmation = false;
                    this.showInvoiceData = false;
                    this.checkRequestInvoice = false;
                    this.visibleForm = false;
                    this.selectableList = false;
                    this.showOkConfirmation = true;
                    let arrNewRequestInvoices = [];
                    if (getNewRequestInvoice) {
                        arrNewRequestInvoices = getNewRequestInvoice;
                        bodyRequestInvoice.invoiceIssueData[0].ticketsNumber.forEach(item => {
                            if (!getNewRequestInvoice.includes(item)) {
                                arrNewRequestInvoices.push(item);
                                this.localStorageService.set('newRequestInvoices', arrNewRequestInvoices);
                            }
                        });
                    } else {
                        this.localStorageService.set('newRequestInvoices', bodyRequestInvoice.invoiceIssueData[0].ticketsNumber);
                    }
                    this.reloadInvoiceData(bodyRequestInvoice);
                    this.setDigitalData(this.MmBAppConstants.QUADRIGAM.INVOICE_CONFIRMATION);
                }

        }

        const addInvoiceIssueError:any = (error) => {
            this.showSpinner = false;
            this.showErrorConfirmation = true;
            this.setDigitalData(this.MmBAppConstants.QUADRIGAM.INVOICE_ERROR_SUMMARY);
        }

        this.InvoiceIssueService.addInvoiceIssue(bodyRequestInvoice).then(addInvoiceIssueSuccess, addInvoiceIssueError);
    }

    setDigitalData = (quadrigam) => {
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
    }

    getTicketsNumber = () => {
        let arrticketsNumber = [];
        this.listInvoicesSelected.forEach((invoice:any) => {
            arrticketsNumber.push(invoice.ticketNumber);
        });
        return arrticketsNumber;
    }

    reloadInvoiceData = (bodyRequestInvoice) => {
        const invoiceList:[any] = this.localStorageService.get('invoiceList');
        invoiceList.map(invoice => {
            bodyRequestInvoice.invoiceIssueData[0].ticketsNumber.filter(item => {
                if (item === invoice.ticket.ticketNumber) {
                    invoice.billingData = bodyRequestInvoice.invoiceIssueData[0].billingData;
                    invoice.shippingData = bodyRequestInvoice.invoiceIssueData[0].shippingData;
                }
            })
            this.localStorageService.set('invoiceList', invoiceList);
        });
        this.getInvoiceData();
        this.$rootScope.$broadcast('checkNumInvoices');
    };

    checkNumberInvoicesSelected = () => {
        const listInvoicesSelected = this.getTicketsNumber();
        listInvoicesSelected.length > 1 ? this.literalRequestInvoice = this.requestInvoicePlural : this.literalRequestInvoice = this.requestInvoiceSingular;
    }

    $onInit = this.activate();
}

