import * as angular from 'angular';
import { MmBDatalayerUtilsService } from '../../../../../services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service'
import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';

@Component('ib-MmB-invoice-list-module', 'ibMmbInvoiceList', {
    controllerAs: 'invoiceListCtrl',
    bindings: {
        model: '=',
        selectableList: '=',
        noItemsRequestInvoice: '<',
        listInvoices: '<',
        checkRequestInvoice: '=',
        visibleForm: '=',
        showInvoiceData: '=',
        listInvoicesSelected: '=',
        showOkConfirmation: '=',
        showPartialErrorConfirmation: '=',
        getInvoiceData: '='
    },
    templateUrl: ['MmBAppConstants', ( MmBAppConstants: MmBAppConstants ): string => MmBAppConstants.templatesRoute + 'ib-MmB-invoice-list-view.html']
}, ['$translate', '$filter', 'MmBModalService', 'localStorageService', 'MmBAppConstants', 'MmBDatalayerUtilsService'], [])
export class ibMmbInvoiceListComponent implements ng.IController {
    selectableList: boolean;
    noItemsRequestInvoice: boolean;
    listInvoices: any[];
    checkRequestInvoice: boolean;
    visibleForm: boolean;
    showInvoiceData: boolean;
    listInvoicesSelected: any[];
    showOkConfirmation: boolean;
    showPartialErrorConfirmation: boolean;
    getInvoiceData: any;

    checkAll: boolean;
    requestInvoiceSingular: string = '';
    requestInvoicePlural: string = '';
    literalRequestInvoice: string = '';

    constructor (
        private $translate: any,
        private $filter: any,
        private MmBModalService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBAppConstants: MmBAppConstants,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
    ) {
        this.checkAll = false;
        this.visibleForm = false;
    }

    $onInit = (): any => {
        this.$translate.onReady()
            .then(() => {
                this.requestInvoiceSingular = this.$filter('translate')('MMB_INVOICES_CTA_LINK_SINGULAR');
                this.requestInvoicePlural = this.$filter('translate')('MMB_INVOICES_CTA_LINK');
            })
            .then(() => {
                this.checkNumberInvoices();
            });
        if (!this.showOkConfirmation && !this.showPartialErrorConfirmation) {
            this.setDigitalData(this.MmBAppConstants.QUADRIGAM.INVOICE_LIST);
        }
    };

    setDigitalData = (quadrigam) => {
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);

    }

    addRemoveInvoiceItem = (invoice) => {
        if (invoice.checked) {
            const invoiceToAdd = this.listInvoices.find(item => item.ticketNumber === invoice.ticketNumber);
            this.listInvoicesSelected.push(invoiceToAdd);
            if (this.listInvoices.length === this.listInvoicesSelected.length) this.checkAll = true;
        } else {
            this.listInvoicesSelected = this.listInvoicesSelected.filter(item => item.ticketNumber !== invoice.ticketNumber);
            this.checkAll = false;
        }
    }

    addAllInvoiceItem = () => {
        this.listInvoicesSelected = [];
        if (this.checkAll) {
            if (this.listInvoices.length > 0) {
                this.listInvoices.forEach(invoice => {
                    invoice.checked = true;
                    this.listInvoicesSelected.push(invoice);
                });
            }
        } else {
            if (this.listInvoices.length > 0) {
                this.listInvoices.forEach(invoice => {
                    invoice.checked = false;
                });
            }
        }
    }

    consult = (invoice) => {
        const dataAux = { invoiceDetail: invoice };
        this.MmBModalService.showInvoiceRequestModal(true, 'ib-MmB-modal-invoice-request.html', dataAux, 'ib-modals ib-modals--md fade').result.then(angular.noop, angular.noop);
    }

    requestInvoices = () => {
        this.listInvoicesSelected = [];
        this.showOkConfirmation = false;
        this.listInvoices = this.getNotEmitedListInvoices();
        this.checkRequestInvoice = true;
        this.selectableList = true;
        if (window.innerWidth < 768) {
            //mobile
            this.visibleForm = false;
            this.setDigitalData(this.MmBAppConstants.QUADRIGAM.INVOICE_SELECTION_MOBILE);
        } else  {
            //desktop
            this.visibleForm = true;
            this.setDigitalData(this.MmBAppConstants.QUADRIGAM.INVOICE_SELECTION);
        }
    }

    getNotEmitedListInvoices = () => {
        const updatedListInvoices: any[] = this.localStorageService.get('listInvoices');
        return updatedListInvoices?.filter(item => item.billingData === null) || [];
    }

    completeInvoiceData = () => {
        this.showInvoiceData = true;
        this.checkRequestInvoice = true;
        this.visibleForm = true;
    }

    closeCompleteInvoiceData = () => {
        this.showInvoiceData = false;
        this.selectableList = false;
        this.visibleForm = false;
        this.checkRequestInvoice = false;
        this.getInvoiceData();
    }

    checkNumberInvoices() {
        const listInvoicesNotEmited = this.getNotEmitedListInvoices();
        listInvoicesNotEmited.length > 1 ? this.literalRequestInvoice = this.requestInvoicePlural : this.literalRequestInvoice = this.requestInvoiceSingular;
    }
}
