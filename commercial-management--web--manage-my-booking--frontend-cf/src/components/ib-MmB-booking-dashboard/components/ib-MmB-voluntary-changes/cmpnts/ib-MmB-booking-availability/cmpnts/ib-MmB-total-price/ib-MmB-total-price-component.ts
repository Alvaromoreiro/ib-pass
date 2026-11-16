import { MmBModalService } from "@src/components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service";
import angular from "angular";

@Component(
    'ib-MmB-total-price-module',
    'ibMmbTotalPrice',
    {
        controllerAs: 'tPCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-total-price-view.html';
        }],
        bindings: {
            model: '<',
            onAccept: '&'
        }
    },
    ['$scope', '$sce', 'CurrencyService', '$filter', 'MmBModalService'],
[])
export class TotalPriceController {
    
    constructor(
        private $scope,
        private $sce,
        private CurrencyService: CurrencyService,
        private $filter,
        private MmBModalService: MmBModalService) {
            this.$scope.$on('changeOnTotalPrice', this.changeOnTotalPrice);
        }

    model;
    onAccept;
    conditions = null;
    price = '0';
    labelButton = '';
    label = '';
    currency;

    /**
     * This function is initialized and formats some data of the model that
     * is used in the view.
     */
    $onInit = () => {
        if (this.model) {
            if (this.model.relatedContent && this.model.relatedContent.length > 0) {
                this.conditions = this.$sce.trustAsHtml(this.model.relatedContent[0].value);
            }
            this.changeOnTotalPrice();
        }
    }

    changeOnTotalPrice = () => {
        if (!this.currency && this.model && this.model.contextMetadata && this.model.contextMetadata.currencies && this.model.contextMetadata.currencies.length > 0) {
            this.currency = this.CurrencyService.getCurrencyObject(this.model.contextMetadata.currencies[0]);
        }
        if (this.model && angular.isDefined(this.model.totalPrice)) {
            if (this.model.totalPrice >= 0) {
                this.price = this.CurrencyService.formatPrice(this.currency, this.model.totalPrice, true);
                this.label = this.$filter('translate')('MMB_VC_LABEL_TOTAL_PRICE_TO_PAY');
            } else {
                this.price = this.CurrencyService.formatPrice(this.currency, Math.abs(this.model.totalPrice), true);
                this.label = this.$filter('translate')('MMB_VC_LABEL_TOTAL_PRICE_REPAY_WITH_VOUCHER');
            }
        } else {
            this.price = this.CurrencyService.formatPrice(this.currency, 0, true);
            this.label = this.$filter('translate')('MMB_VC_LABEL_TOTAL_PRICE_TO_PAY');
        }
        this.labelButton = this.$filter('translate')('MMB_VC_MODAL_CONTINUE');
    }

    /**
     * This function sends the flight change confirmation to its parent component.
     */
    accept = () => {
        this.MmBModalService.showWaitingModal(null, null, null, null);
        this.onAccept({ message: 'Accept' });
    }
}