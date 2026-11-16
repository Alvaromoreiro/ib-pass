import angular from "angular";

@Component('ib-MmB-invoice-tab-module', 'ibMmbInvoiceTab', {
    controllerAs: 'invoiceTabCtrl',
    bindings: {
        model: '='
    },
    templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
        return MmBAppConstants.templatesRoute + 'ib-MmB-invoice-tab-view.html';
    }]
}, ['localStorageService', '$filter', 'MmBAppConstants', '$rootScope', '$window', '$translate', 'MmBCurrencyService', 'InvoiceListService'],
[])
export class ibMmbInvoiceTabComponent {
    model;
    listInvoices = [];
    noItemsRequestInvoice: boolean = false;
    listInvoicesSelected = [];
    showOkConfirmation: boolean = false;
    stateIssuedLiteral = null;
    stateRequestedLiteral = null;
    stateNotAvailableLiteral = null;
    checkRequestInvoice: boolean;
    showInvoiceData: boolean;
    visibleForm: boolean;
    errorInvoiceList: boolean = false;
    noItemsForInvoices: string[] = ['specialNeed'];

    constructor (
        private localStorageService,
        private $filter,
        private MmBAppConstants,
        private $rootScope,
        private $window,
        private $translate,
        private MmBCurrencyService,
        private InvoiceListService
    ) {

    }

    $onInit = () => {
        !this.localStorageService.get('invoiceList') ? this.getInvoicesInfo() : this.callTranslate();
    }

    callTranslate = (): void => {
        this.$translate.onReady()
        .then(() => {
            this.stateIssuedLiteral = this.$filter('translate')('MMB_INVOICES_TABLE_STATE1');
            this.stateRequestedLiteral = this.$filter('translate')('MMB_INVOICES_TABLE_STATE2');
            this.stateNotAvailableLiteral = this.$filter('translate')('MMB_INVOICES_TABLE_STATE3');
        })
        .then(() => {
            this.getInvoiceData();
            this.informationIsMobile();
        });
    }

    getInvoicesInfo = (): void => {
        this.model.showSpinner = true;
        this.InvoiceListService.getInvoiceList()
        .then((invoiceData) => {
            this.model.showSpinner = false;
            invoiceData && invoiceData.length > 0 ? this.localStorageService.set('invoiceList', invoiceData) : this.errorInvoiceList = true;
            this.callTranslate();
        })
        .catch((error) => {
            this.model.showSpinner = false;
            this.errorInvoiceList = true;
        });
    }

    getInvoiceData = () => {
        this.listInvoices = [];
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const orderItems = bookingInfo.order?.orderItems.filter(item => !this.noItemsForInvoices.includes(item.type));
        const orderSlices = bookingInfo.order?.slices;
        let arrOrderSlices = [];
        orderSlices.forEach(slice => arrOrderSlices.push(slice.sliceId));
        const invoiceList = this.localStorageService.get('invoiceList');
        const tickets = bookingInfo.tickets;

        invoiceList.forEach(item => {
            const  orderItemId = this.getOrderItemId(tickets,item);
            const  orderItem = this.getOrderItem(orderItems,orderItemId);
            let itemData = {
                id: orderItemId,
                checked: false,
                route: item.extraTicketData?.route ? item.extraTicketData.route : '',
                concept: this.getConcept(orderItem, item),
                price: item.extraTicketData?.invoiceAmount?.amount ? this.getCurrency(item.extraTicketData.invoiceAmount.amount) : '',
                ticketNumber: item.ticket.ticketNumber,
                state: this.getNewRequestStateLiteral(item.ticket.ticketNumber) ? this.getNewRequestStateLiteral(item.ticket.ticketNumber) : item.invoicesPriceDetailDataWebList && item.invoicesPriceDetailDataWebList[0]?.concept === 'EMISION' ? this.stateIssuedLiteral : null,
                billingData: item.billingData ? item.billingData : null,
                shippingData: item.shippingData ? item.shippingData : null,
                stateRequested: this.getNewRequestState(item)
            };
            this.listInvoices.push(itemData);
        });
        this.localStorageService.set('listInvoices', this.listInvoices);
        this.getCheckRequestInvoices();
        this.localStorageService.remove('newRequestInvoicesFailure')
    };

    getNewRequestState = (itemEach) => {
        let stateRequested = '';
        const newRequestInvoices = this.localStorageService.get('newRequestInvoices');
        const newRequestInvoicesFailure = this.localStorageService.get('newRequestInvoicesFailure');
        if (itemEach.invoicesPriceDetailDataWebList && itemEach.invoicesPriceDetailDataWebList[0]?.concept === 'EMISION'){
            stateRequested = this.MmBAppConstants.INVOICE_STATES.ISSUED;
        }
        if (newRequestInvoices) {
            newRequestInvoices.filter(item => {
                if (item === itemEach.ticket.ticketNumber) {
                    stateRequested = this.MmBAppConstants.INVOICE_STATES.REQUESTED;
                }
            });
        }
        if (newRequestInvoicesFailure) {
            newRequestInvoicesFailure.filter(item => {
                if (item === itemEach.ticket.ticketNumber) {
                    stateRequested = this.MmBAppConstants.INVOICE_STATES.NOT_AVAILABLE;
                }
            });
        }
        return stateRequested;
    }

    getNewRequestStateLiteral = (ticketNumber) => {
        let stateRequested = false;
        const newRequestInvoices = this.localStorageService.get('newRequestInvoices');
        const newRequestInvoicesFailure = this.localStorageService.get('newRequestInvoicesFailure');
        if (newRequestInvoices) {
            newRequestInvoices.filter(item => {
                if (item === ticketNumber) {
                    stateRequested = this.stateRequestedLiteral;
                }
            });
        }
        if (newRequestInvoicesFailure) {
            newRequestInvoicesFailure.filter(item => {
                if (item === ticketNumber) {
                    stateRequested = this.stateNotAvailableLiteral;
                }
            });
        }
        return stateRequested;
    }

    private conceptHandlers = {
        'flight': (orderItem, item) => this.getFlightDescription(orderItem) + this.getNameSurname(item),
        'seat': (orderItem) => this.$filter('translate')('CHECK_LIST_SEAT_SELECTION_TEXT') + ' ' + this.getDataSeat(orderItem),
        'baggage': (orderItem) => this.$filter('translate')('EXTRA_BAGGAGE') + ', ' + this.getDataBaggage(orderItem) + ' Kg.',
        'specialEquipment': (orderItem) => this.$filter('translate')('ANCILLARIES_SPEQS_TITLE_TEXT') + ', ' + this.getDataSubType(orderItem.subtype),
        'flexibilityOnDemand': (orderItem, item) => this.$filter('translate')('ANCILLARIES_FLEXIBILITY_TITLE') + ' - ' + this.getNameSurname(item),
        'priorityBoarding': (orderItem, item) => this.$filter('translate')(this.MmBAppConstants.ANCILLARIES_LITERALS_INVOICES.PRIORITY_BOARDING) + ' - ' + this.getNameSurname(item),
        'petc': () => this.$filter('translate')('MMB_PETC_PET')
    };

    getConcept = (orderItem, item) => {
        if (!orderItem) {
            return ' - ';
        }

        const handler = this.conceptHandlers[orderItem.type];
        return handler ? handler(orderItem, item) : ' - ';
    }

    getNameSurname = (item) => {
        let nameSurname = this.getNameSurnameFromImportOrder(item);
        return nameSurname === '' ? item.ticket.name + ' ' + item.ticket.surname : nameSurname;
    }

    getNameSurnameFromImportOrder = (item) => {
        let nameSurname = '';
        const bookingInfo = this.localStorageService.get('bookingInfo');
        bookingInfo?.passengers.forEach(passenger => {
            if(passenger?.personalInfo?.name === item.ticket.name
                && passenger?.personalInfo?.surname === item.ticket.surname
                && passenger?.externalPersonalInfo) {
                    nameSurname = passenger?.externalPersonalInfo?.name + ' ' + passenger?.externalPersonalInfo?.firstSurname + ' ' + passenger?.externalPersonalInfo?.lastSurname;
            }
        })
        return nameSurname;
    }

    getDataBaggage = (item) => {
        const typeBaggage = item.subtype.split("_");
        return typeBaggage[1];
    }

    getDataSeat = (item) => {
        let dataSeats = [];
        let infoSeats = '';
        const features = item.features;
        features.forEach(item => {
            dataSeats.push(this.getDataFeatureSeat(item));
        });
        dataSeats.length > 1 ? infoSeats = dataSeats.join(', ') : infoSeats = dataSeats.toString();
        return infoSeats;
    }

    getDataFeatureSeat = (type) => {
        switch (type) {
            case this.MmBAppConstants.SEAT_FEATURE.EMERGENCY_EXIT: return this.$filter('translate')('CKIANCSEATS_MODAL_EMERGENCY_TITLE');
            case this.MmBAppConstants.SEAT_FEATURE.EXTRA_SIZE: return this.$filter('translate')('SEATS_EXTRA_SIZE_SEAT');
            case this.MmBAppConstants.SEAT_FEATURE.WINDOW: return this.$filter('translate')('WINDOW');
            case this.MmBAppConstants.SEAT_FEATURE.WING: return 'WING';
            case this.MmBAppConstants.SEAT_FEATURE.SCREEN: return this.$filter('translate')('ENTERTAINMENT_SCREEN_SEAT');
            case this.MmBAppConstants.SEAT_FEATURE.NON_RECLINING: return this.$filter('translate')('NON_RECLINING_SEAT');
            case this.MmBAppConstants.SEAT_FEATURE.INFANT: return this.$filter('translate')('PASSENGER_WITH_INFANT_TYPE_SEAT');
            case this.MmBAppConstants.SEAT_FEATURE.MOBILITY: return this.$filter('translate')('RESTRICTED_MOBILITY_TYPE_SEAT');
            case this.MmBAppConstants.SEAT_FEATURE.WC: return this.$filter('translate')('CKIANCSEATS_WC_ZONE');
            case this.MmBAppConstants.SEAT_FEATURE.GALLEY: return this.$filter('translate')('GALLEY');//meter "SEATS_GALLEY_SEAT"
            case this.MmBAppConstants.SEAT_FEATURE.PROMO: return this.$filter('translate')('PROMO_TYPE_SEAT');
            case this.MmBAppConstants.SEAT_FEATURE.UPFRONT: return this.$filter('translate')('UPFRONT_SEAT');
            case this.MmBAppConstants.SEAT_FEATURE.AISLE: return this.$filter('translate')('AISLE_SEAT');
            default: return '';
        }
    }

    getFlightDescription = (data) => {
        return data.sliceIds.length > 1 ?  this.$filter('translate')('MMB_VC_FLIGHTS') + ' - ' : this.$filter('translate')('MMB_VC_IB_VACIONES_FLIGHT') + ' - ';
    }

    getOrderItemId = (tickets, ticket) => {
        let itemId = null;
        tickets.forEach(item =>{
            const ticketNumbers = item.ticketNumbers;
            ticketNumbers.forEach(item2 => {
                if(ticket.ticket.ticketNumber  === item2){
                    itemId = item.orderItemId;
                }
            });
            });
            return itemId !== null && itemId.length > 0 ? itemId : null;
    }

    getOrderItem = (orderItems, itemId) => {
        let orderItem = null;
        orderItem = orderItems.find(item =>item.orderItemId === itemId);
        return orderItem ? orderItem : null;
    }

    getDataSubType = (subtype) => {
        let result;
        switch (subtype) {
            case this.MmBAppConstants.SPEQ_TYPE.SKI_SNOW:
                result = this.$filter('translate')('SPEQS_SKI_SNOW');
                break;
            case this.MmBAppConstants.SPEQ_TYPE.GOLF_EQUIPMENT:
                result =  this.$filter('translate')('SPEQS_GOLF_EQUIPMENT');
                break;
            case this.MmBAppConstants.SPEQ_TYPE.FISHING_EQUIPMENT:
                result =  this.$filter('translate')('SPEQS_FISHING_TITLE');
                break;
            case this.MmBAppConstants.SPEQ_TYPE.SCUBA_DIVING:
                result =  this.$filter('translate')('SPEQS_SCUBA_TITLE');
                break;
            case this.MmBAppConstants.SPEQ_TYPE.SURFBOARD:
                result =  this.$filter('translate')('SPEQS_SURFBOARD_TITLE');
                break;
            case this.MmBAppConstants.SPEQ_TYPE.BICYCLE:
                result =  this.$filter('translate')('SPEQS_BICYCLE');
                break;
            case this.MmBAppConstants.SPEQ_TYPE.SPORTING_FIREARMS:
                result =  'SPORTING_FIREARMS';
                break;
        }

        return result;
    }

    getCurrency = (price) => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const currency = bookingInfo.contextMetadata.currencies[0];
        return " " + bookingInfo?.contextMetadata?.currencies ? this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), price, true, false, false) : '';
    }

    getCheckRequestInvoices = () => {
        const itemsRequestInvoice = this.listInvoices.filter(item =>item.billingData===null);
        this.noItemsRequestInvoice = itemsRequestInvoice.length>0 ? false : true;
    }

    informationIsMobile = () => {
        if (this.$rootScope.isMobile.general){
            if (this.checkRequestInvoice && this.showInvoiceData) {
                this.visibleForm = true;
            } else {
                this.visibleForm = false;
            }
        } else{
            if (this.checkRequestInvoice) {
                this.visibleForm = true;
            } else {
                this.visibleForm = false;
            }
        }
        angular.element(this.$window).on('resize', (item) => {
            if (this.$rootScope.isMobile.general) {
                if (this.checkRequestInvoice && this.showInvoiceData) {
                    this.visibleForm = true;
                } else {
                    this.visibleForm = false;
                }
            } else{
                if (this.checkRequestInvoice) {
                    this.visibleForm = true;
                } else {
                    this.visibleForm = false;
                }
            }
        });
    }

    moreInfo = () => {
        let mainUrl, endPath, url;
        let market = this.$rootScope.appMarket.toLowerCase();
        let language = this.$rootScope.appLang.toLowerCase();
        mainUrl = `https://www.iberia.com/${market}/`;
        endPath = this.getEndPath(language);
        url = mainUrl + endPath;
        this.$window.open(url, '_blank');
    }

    getEndPath = (language) => {
        let endPath;
        switch (language) {
            case 'es':
                endPath = 'preguntas-frecuentes/atencion-clientes/';
                break;
            case 'pt':
                endPath = 'duvidas-mais-habituais/atencao-cliente/';
                break;
            case 'ca':
                endPath = 'preguntes-frequents/atencio-clients/';
                break;
            case 'en':
                endPath = 'faqs/customer-services/';
                break;
            case 'fr':
                endPath = 'questions-frequentes/relation-client/';
                break;
            case 'it':
                endPath = 'domande-frequenti/attenzione-cliente/';
                break;
            case 'nl':
                endPath = 'veelgestelde-vragen/klantenservice/';
                break;
            case 'de':
                endPath = 'die-haufigsten-fragen/kundenservice/';
                break;
            default:
                endPath = 'preguntas-frecuentes/atencion-clientes/';
                break;
        }
        return endPath;
    }
}
