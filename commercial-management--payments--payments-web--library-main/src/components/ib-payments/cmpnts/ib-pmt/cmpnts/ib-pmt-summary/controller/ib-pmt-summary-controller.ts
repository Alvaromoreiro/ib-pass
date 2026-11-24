import angular from 'angular';
import { IbPriceDetailModalService } from '../../../../../../../app/feature/components/ib-pmt-price-details-modal/services/ib-price-detail-modal.service';

@Controller('ib-pmt-summary-module',
    ['$scope',
        '$rootScope',
        'PmtConstants',
        'localStorageService',
        'CurrencyService',
        'CommonsUtilService',
        'UpgradingUtilService',
        'DccService',
        '$window',
        'IbCModalService',
        'DatalayerUtilsService',
        'IbPriceDetailModalService'
    ], [])
class PmtSummaryController {
    public LOGIN_ONB;
    public dccPrice;
    public flowApp;
    public isLogged;
    public numeroAvios;
    public issueData;
    public currency;
    public totalAviosAmount;
    public numberFreeUpgrade;
    public confirmationDigitalInfo;
    public totalAviosAmountFormatted;
    public tierIB;
    public isMMBBID_AVIOS;
    public bidsAvailable;
    public discountsAppliedIssue;
    public membershipData;
    public oBDiscountInfo;
    public summaryText;
    public onHoldInfo;
    public actualStepFlow;
    public summaryInfo;
    public shouldShowPriceDetailsCTA;

    constructor (
        private $scope,
        private $rootScope,
        private PmtConstants,
        private localStorageService,
        private CurrencyService,
        private CommonsUtilService,
        private UpgradingUtilService,
        private DccService,
        private $window: ng.IWindowService,
        private IbCModalService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private IbPriceDetailModalService: IbPriceDetailModalService 
    ) {}

    activate = () => {
        this.flowApp = this.localStorageService.get('flowApp') || null;
        this.isLogged = this.localStorageService.get('userLogged');
        this.numeroAvios = this.localStorageService.get('numeroAvios');
        this.issueData = this.localStorageService.get('fullIssuedPaiment');
        this.currency = this.localStorageService.get('currency');
        this.totalAviosAmount = this.localStorageService.get('totalAviosAmount');
        this.actualStepFlow = this.localStorageService.get('actualStepFlow');
        this.numberFreeUpgrade = this.localStorageService.get('numberFreeUpgrade');
        this.confirmationDigitalInfo = this.localStorageService.get('confirmationDigitalInfo');
        this.totalAviosAmountFormatted = this.localStorageService.get('totalAviosAmountFormatted');
        this.shouldShowPriceDetailsCTA = this.IbPriceDetailModalService.shouldShowCTA(this.flowApp);
        if (this.flowApp === this.PmtConstants.APP_TYPES.CHECKIN && this.summaryInfo.ancillaries.globick && this.localStorageService.get('redirectLinkMail')){
            this.localStorageService.remove('redirectLinkMail');
            const mnttLog2GTM = this.$window.mnttLog2GTM  ?? function () {};
            mnttLog2GTM('ATQ-16834: Compra de traslados desde URL de Salesforce', 'Compra traslados');
        }
        if (this.flowApp === this.PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS && this.confirmationDigitalInfo?.UserLevel) {
            this.tierIB = this.confirmationDigitalInfo?.UserLevel.replace(/(\w)(\w*)/g, (g0, g1, g2) => {
                return g1.toUpperCase() + g2.toLowerCase();
            });
        }
        this.isMMBBID_AVIOS = this.localStorageService.get('UPG_BIDS_AVIOS');
        this.bidsAvailable = this.localStorageService.get('upgradingBidsInfo')?.bidsAvailable;
        if (
            this.issueData &&
                this.issueData.data &&
                this.issueData.data.order &&
                this.issueData.data.order.discountsApplied &&
                this.issueData.data.order.discountsApplied.totalDiscount
        ) {
            this.discountsAppliedIssue = Object.assign({}, this.issueData.data.order.discountsApplied);
            angular.forEach(this.discountsAppliedIssue.discounts, (discount) => {
                if (discount.totalDiscount && this.currency) {
                    discount.totalDiscountFormatted = this.CurrencyService.formatPrice(
                        this.currency,
                        discount.totalDiscount,
                        true
                    );
                }
            });
            if (
                this.issueData.data.order.voucherDiscount &&
                    this.issueData.data.order.voucherDiscount.amount &&
                    !this.CommonsUtilService.isDiscountTypePartnerEquivalent(this.issueData.data.order.voucherDiscount.type) &&
                    this.issueData.data.order.voucherDiscount.type !== this.PmtConstants.DISCOUNT_TYPES.PARTNER
            ) {
                this.discountsAppliedIssue.totalDiscount += this.issueData.data.order.voucherDiscount.amount;
            }
            if (this.currency) {
                this.discountsAppliedIssue.totalFormatted = this.CurrencyService.formatPrice(
                    this.currency,
                    -this.discountsAppliedIssue.totalDiscount,
                    true
                );
            }
        }
        if (this.isLogged === this.PmtConstants.LOGIN_ONB) {
            this.membershipData = this.localStorageService.get('membershipData');
            if (this.localStorageService.get('oBDiscountType') === false) {
                this.oBDiscountInfo = this.localStorageService.get('oBDiscountInfo');
            }
        }
        this.summaryText = this.UpgradingUtilService.getSummaryTextByBid(
            this.onHoldInfo,
            this.isMMBBID_AVIOS,
            this.bidsAvailable,
            this.totalAviosAmountFormatted,
            this.totalAviosAmount,
            this.numberFreeUpgrade
        );
        this.issueData?.data?.paymentItems?.filter(items => {
            if (items.dccApplied?.price.fare) {
                this.dccPrice = {
                    totalPrice: this.CurrencyService.formatPrice(
                        this.CurrencyService.getCurrencyObject(
                            items.dccApplied?.price?.currency),
                        items.dccApplied?.price?.fare,
                        true)
                };
            }
        });
    };

    $onChanges = () => {
        this.summaryText = this.UpgradingUtilService.getSummaryTextByBid(
            this.onHoldInfo,
            this.isMMBBID_AVIOS,
            this.bidsAvailable,
            this.totalAviosAmountFormatted,
            this.totalAviosAmount,
            this.numberFreeUpgrade
        );
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
    
    $onInit = this.activate();
}
