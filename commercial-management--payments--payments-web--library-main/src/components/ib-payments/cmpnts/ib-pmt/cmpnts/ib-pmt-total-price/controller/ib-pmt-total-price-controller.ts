import angular from 'angular';
import { IbPriceDetailModalService } from '../../../../../../../app/feature/components/ib-pmt-price-details-modal/services/ib-price-detail-modal.service';
import { HeaderDataType } from '../../../../../../../../src/app/core/models/ib-booking-header-model';

@Controller('ib-pmt-total-price-module',
    ['$scope',
        '$sce',
        'localStorageService',
        'PmtConstants',
        'PmtModalService',
        '$rootScope',
        '$templateCache',
        'ButtonFactoryService',
        'RedirectionService',
        '$filter',
        'ibPmtTelephoneService',
        'UpgradingUtilService',
        'CurrencyService',
        'DccService',
        'CommonsUserUtilsService',
        'IbCModalService',
        'DatalayerUtilsService',
        'IbPriceDetailModalService'
    ], [])
class PmtTotalPriceController {
    public dccPrice: DccModel.DccConvertedPrice;
    public changeFlightAvios;
    public currency;
    public totalAviosAmount;
    public numberFreeUpgrade;
    public confirmationDigitalInfo;
    public totalAviosAmountFormatted;
    public tierIB;
    public summaryText;
    public onHoldInfo;
    public flowApp;
    public totalPriceText;
    public showExternalButton;
    public button;
    public priceInfo;
    public somethingToPay;
    public co2MarkInfo;
    public containerForm;
    public selectedPayment;
    public taxInfo;
    public userLogged;
    public LOGIN_ONB;
    public APP_TYPES;
    public getMarketOBPoints;
    public CalculatedPoints;
    public isIbZero: boolean;
    public shouldShowPriceDetailsCTA: boolean;
    private headerModel: HeaderDataType;

    constructor (
        private $scope,
        private $sce,
        private localStorageService,
        private PmtConstants,
        private PmtModalService,
        private $rootScope,
        private $templateCache,
        private ButtonFactoryService,
        private RedirectionService,
        private $filter,
        private ibPmtTelephoneService,
        private UpgradingUtilService,
        private CurrencyService,
        private DccService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private IbCModalService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private IbPriceDetailModalService: IbPriceDetailModalService
    ) {}

    activate () {
        this.LOGIN_ONB = this.PmtConstants.LOGIN_ONB;
        this.APP_TYPES = this.PmtConstants.APP_TYPES;
        this.getMarketOBPoints = this.localStorageService.get('getMarketOBPoints') || null;
        this.CalculatedPoints = this.localStorageService.get('CalculatedPoints');
        this.userLogged = this.localStorageService.get('userLogged');
        this.changeFlightAvios = this.localStorageService.get('changeFlightAvios');
        this.flowApp = this.localStorageService.get('flowApp');
        this.totalAviosAmount = this.localStorageService.get('totalAviosAmount');
        this.numberFreeUpgrade = this.localStorageService.get('numberFreeUpgrade');
        this.confirmationDigitalInfo = this.localStorageService.get('confirmationDigitalInfo');
        this.headerModel = this.localStorageService.get('headerModel');

        this.setValuesInLoyaltyUpgradeFlow(this.userLogged, this.headerModel);


        if (!this.$templateCache.get('totalPriceTextHtml') && this.totalPriceText) {
            this.$templateCache.put('totalPriceTextHtml', this.totalPriceText.toString());
        }
        this.isIbZero = this.CommonsUserUtilsService.isIbZero();
        this.shouldShowPriceDetailsCTA = this.IbPriceDetailModalService.shouldShowCTA(this.flowApp);

    }


    $onChanges = () => {
        if (!this.$templateCache.get('totalPriceTextHtml') && this.totalPriceText) {
            this.$templateCache.put('totalPriceTextHtml', this.totalPriceText.toString());
        }
        switch (this.showExternalButton) {
                case 'BIZUM':
                    this.button = this.ButtonFactoryService.generateBizumButton();
                    break;
                case 'NEMURU':
                    this.button = this.ButtonFactoryService.generateNemuruButton();
                    break;
                case 'MERCADO_PAGO':
                    this.button = this.ButtonFactoryService.generateMercadoPagoButton();
                    break;
                default:
                    this.button = this.ButtonFactoryService.generateDefaultButton(this.onHoldInfo, this.somethingToPay,  this.$rootScope.isMobile?.general);
                    break;
        }
        this.summaryText = this.UpgradingUtilService.getSummaryText(
            this.totalAviosAmountFormatted,
            this.totalAviosAmount,
            this.numberFreeUpgrade
        );
    };

    openModalLinks (modalTemplate) {
        this.$scope.$emit('openModalCo2InfoEvent', modalTemplate, this.co2MarkInfo);
    }

    private sendPay = () => {
        if (this.showExternalButton === 'IDEAL') {
            const configuration = {
                accept: 'PAYMENT_BUTTON_MODAL_EXTERNAL',
                banksSelectOptions: this.$rootScope.production
                    ? this.PmtConstants.IDEAL_BANK_LIST.PRODUCTION
                    : this.PmtConstants.IDEAL_BANK_LIST.TEST,
                subtitle: 'IBPURC_PAYMENTS_ONLINE_BANKING_SELECT_BANK_SUBTITLE',
                title: 'IBPURC_PAYMENTS_ONLINE_BANKING_SELECT_BANK_TITLE'
            };
            this.PmtModalService.showGenericModal(
                false,
                'online-banking-select-modal.html',
                configuration
            ).result.then((selectedBank) => {
                this.selectedPayment.issuerBank = selectedBank.issuer;
                this.$scope.$emit('submitedPaymentEvent', false, false);
            }, angular.noop());
        } else {
            this.$scope.$emit('submitedPaymentEvent', false, false);
        }
    };

    sendPayEvent () {
        const aviosType = this.localStorageService.get('modelPaymentData');
        let payValid = true;
        this.containerForm.$submitted = true;
        this.$rootScope.$broadcast('updateSubmittedTabs');
        this.$rootScope.$broadcast('updateCreditCardError');
        this.ibPmtTelephoneService.submitForm(true);
        payValid = !(this.containerForm.fieldCCIbPayInvalid || this.containerForm.fieldCVVIbPayInvalid);
        this.checkFirstFormElementError();
        if (
            this.containerForm.$valid &&
            payValid &&
            aviosType?.paymentInfo.paymentMethods[0].type !== 'FULL_PAY_AVIOS' &&
            aviosType?.paymentInfo.paymentMethods[0].type !== 'COUPONS'
        ) {
            this.sendPay();
        } else if (this.containerForm.$valid && aviosType.paymentInfo.paymentMethods[0].type === 'FULL_PAY_AVIOS') {
            this.$scope.$emit('submitedPaymentEvent', 'FULL_PAY_AVIOS', false);
        } else if (this.containerForm.$valid && aviosType.paymentInfo.paymentMethods[0].type === 'COUPONS') {
            this.$scope.$emit('submitedPaymentEvent', 'COUPONS', false);
        }
        if (this.containerForm.creditCardInvalid) {
            payValid = false;
        }
    }

    checkFirstFormElementError () {
        const firstInvalid = angular
            .element('html, body')
            .find('form[name="paymentCtrl.paymentsForm"] input.ng-invalid:visible:first');
        const errorIberiaPay = angular.element('html, body').find('#creditCardNumberIbPay');
        const elementFound =
            firstInvalid.length > 0 ? firstInvalid : errorIberiaPay.length > 0 ? errorIberiaPay : null;
        const headerSize = angular.element('html, body').find('[ib-sticky]').outerHeight() + 20;
        if (elementFound) {
            angular.element('html, body').animate({
                scrollTop: elementFound.offset().top - headerSize - 20
            });
        }
    }

    showModalTax () {
        const model = {
            extraInfo:
                this.taxInfo &&
                this.taxInfo.modals &&
                this.taxInfo.modals[0] &&
                this.taxInfo.modals[0].elements &&
                this.taxInfo.modals[0].elements[0] &&
                this.taxInfo.modals[0].elements[0].description
                    ? this.$sce.trustAsHtml(this.taxInfo.modals[0].elements[0].description)
                    : '',
            idModal: '',
            title: 'tax'
        };
        this.PmtModalService.showGenericModal(false, 'ib-modal-extra-info.html', model).result.then(
            angular.noop,
            angular.noop
        );
    }

    goToNemuruConditions () {
        this.RedirectionService.newNavigation(this.$filter('LinksFilter')('NEMURU_CONDITION'));
    }
    
    private preparePriceDetails = () => {
        const fareData = this.localStorageService.get('fareData');
        const priceDetails = fareData?.offers[0]?.discountsApplied?.originalOfferItems ?? fareData?.offers[0]?.offerItems;
        return priceDetails;
    };
    
    public sendAnalyticsEvent = () => {
        this.DatalayerUtilsService.updateDatalayerEvent('modal resumen', 'clic', 'detalle', 'interaccion');
    };

    public openTaxModal = ($event): any => {
        $event?.preventDefault?.();
        $event?.stopPropagation?.();
        this.sendAnalyticsEvent();
        this.IbPriceDetailModalService.openPriceDetailModal();
    };

    private setValuesInLoyaltyUpgradeFlow (isUserLogged: boolean, headerBasket: HeaderDataType) {
        const isONB = headerBasket?.greyBarModel?.isONB;
        const isLoyaltyFlow = isUserLogged && !isONB;

        if (this.flowApp === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS && isLoyaltyFlow ) {
            this.tierIB = this.confirmationDigitalInfo?.UserLevel.replace(/(\w)(\w*)/g, (g0, g1, g2) => {
                return g1.toUpperCase() + g2.toLowerCase();
            });
            if(this.totalAviosAmount !== null) {
                this.setAviosAmount();
            }
        }
    }

    private setAviosAmount () {
        this.currency = this.localStorageService.get('currency');
        const currencySeparator = this.currency?.groupingSeparator ? this.currency.groupingSeparator : '.';
        this.totalAviosAmountFormatted = this.CurrencyService.formatAvios(currencySeparator, this.totalAviosAmount);
        this.localStorageService.set('totalAviosAmountFormatted', this.totalAviosAmountFormatted);
    }

    $onInit = this.activate();
}

export { PmtTotalPriceController };

