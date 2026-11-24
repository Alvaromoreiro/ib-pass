import angular from 'angular';
import {
    CheckDonationParams,
    DonationPaymentMethodUpdateParams,
    DonationPriceChangeParams,
    IbPmtFeeHost,
    UpdateFeeContext
} from '../models/ib-pmt-update-fee.model';
import {
    addDonationAmountToDatalayer,
    findDonationOrderFeeIndex,
    findOrderFeeIndexes,
    getLastStoredDonationOption,
    resolvePreviousDonationAmount,
    getStoredCreditCardFee,
    hasOrderBasketDiscounts,
    isCardCleared,
    resolveDonationChangeTotalPrice,
    resolveOriginalOBPriceAfterCardFee,
    resolvePaymentMethodTotalWithCardFee,
    resolvePaymentMethodTotalWithoutCardFee,
    resolveTotalPrice,
    shouldAddCreditCardFee,
    shouldApplyDonationToPaymentMethod,
    subtractDonationAmountFromDatalayer
} from './ib-pmt-credit-card-fee.utils';

export class IbPmtCreditCardFeeService {
    constructor (
        private localStorageService,
        private CurrencyService,
        private NewMainHeaderFacade,
        private PmtUtilsTransformers,
        private PmtUtilsService,
        private PmtConstants,
        private PmtDatalayerConstants,
        private DataLayerService,
        private $filter
    ) {}

    updateFee (host: IbPmtFeeHost, selectedCard): void {
        const oldFee = getStoredCreditCardFee(this.localStorageService.get('creditCardFee'));
        if (isCardCleared(selectedCard)) {
            this.removeCreditCardFeeFromTotal(host, oldFee);
            return;
        }

        const feeContext = this.buildUpdateFeeContext(host, selectedCard, oldFee);
        this.prepareNewCardSelection(host, selectedCard);
        this.syncCreditCardFeeOrderFees(host, feeContext);
        this.syncDonationOrderFeesFromCardUpdate(host, feeContext);
        this.removeStaleCreditCardFee(host, feeContext);
        this.applyCardFeeToTotalPrice(host, feeContext);
        this.publishFeeUpdate(host, feeContext);
    }

    checkDonation (host: IbPmtFeeHost, params: CheckDonationParams): void {
        const { status, option, donationInfo, newsletter, donationForm } = params;
        const datalayerGeneral = this.DataLayerService.getDatalayerGeneral();
        const lastDonation = getLastStoredDonationOption(this.localStorageService.get('donation'));
        const donationOrderFeeIndex = findDonationOrderFeeIndex(host.model.summaryInfo.orderFees);
        const hasBasketDiscountsApplied = hasOrderBasketDiscounts(this.localStorageService.get('createOrderData'));

        host.setDonationEnabled(status);
        this.syncDonationStorageAndOrderFees(host, {
            status,
            option,
            donationInfo,
            newsletter,
            donationForm,
            datalayerGeneral,
            lastDonation,
            donationOrderFeeIndex
        });

        host.model.paymentInfo.paymentMethods.forEach((paymentMethod, paymentMethodIndex) => {
            if (!shouldApplyDonationToPaymentMethod(
                paymentMethod,
                option,
                status,
                this.PmtUtilsService.checkAvailableDonation.bind(this.PmtUtilsService),
                donationInfo
            )) return;

            this.applyDonationToPaymentMethod(host, {
                paymentMethodIndex,
                status,
                option,
                donationInfo,
                newsletter,
                donationForm,
                hasBasketDiscountsApplied
            });
            host.updateTotalFees();
        });
    }

    private buildUpdateFeeContext (host: IbPmtFeeHost, selectedCard, oldFee: number | null): UpdateFeeContext {
        return {
            selectedCard,
            oldFee,
            orderFeeIndexes: findOrderFeeIndexes(host.model.summaryInfo.orderFees),
            hasBasketDiscountsApplied: hasOrderBasketDiscounts(this.localStorageService.get('createOrderData')),
            headerModelData: this.localStorageService.get('headerModel')
        };
    }

    private prepareNewCardSelection (host: IbPmtFeeHost, selectedCard): void {
        if (selectedCard.cardTypeId !== 'newCard') return;
        host.model.paymentInfo.selectedPaymentInfo.selectedCard = null;
    }

    private syncCreditCardFeeOrderFees (host: IbPmtFeeHost, feeContext: UpdateFeeContext): void {
        const { selectedCard, orderFeeIndexes } = feeContext;
        if (orderFeeIndexes.hasCreditCardFee) {
            this.updateExistingCreditCardFee(host, selectedCard, orderFeeIndexes.creditCardFeeIndex);
            return;
        }
        if (!shouldAddCreditCardFee(selectedCard)) return;
        this.addCreditCardFeeToOrderFees(host, selectedCard);
    }

    private updateExistingCreditCardFee (host: IbPmtFeeHost, selectedCard, creditCardFeeIndex: number): void {
        const creditCardFee = host.model.summaryInfo.orderFees[creditCardFeeIndex];
        creditCardFee.fee = selectedCard.parsedFee ?? null;
        creditCardFee.totalFee = selectedCard.totalFee ?? null;
        this.localStorageService.set('creditCardFee', creditCardFee);
        this.NewMainHeaderFacade.updateBasketOthers('CARD', selectedCard);
    }

    private addCreditCardFeeToOrderFees (host: IbPmtFeeHost, selectedCard): void {
        if (angular.isUndefined(host.model.summaryInfo.orderFees)) {
            host.model.summaryInfo.orderFees = [];
        }
        const creditCardFee = {
            code: this.PmtConstants.ORDER_ITEMS_TYPES.CREDIT_CARD_FEE,
            description: 'SUMMARY_OTHER_FEES_CREDIT_CARD',
            fee: selectedCard.parsedFee,
            totalFee: selectedCard.totalFee
        };
        host.model.summaryInfo.orderFees.push(creditCardFee);
        this.localStorageService.set('creditCardFee', creditCardFee);
        this.NewMainHeaderFacade.updateBasketOthers('CARD', selectedCard);
    }

    private syncDonationOrderFeesFromCardUpdate (host: IbPmtFeeHost, feeContext: UpdateFeeContext): void {
        if (!host.model.donationsInfo) return;

        const tab = host.model.selectedData.selectedTab;
        const paymentMethod = host.model.paymentInfo.paymentMethods[tab];
        host.model.donationsInfo = this.PmtUtilsTransformers.generateDonationsInfo(
            host.model.donationsInfo,
            host.model.paymentInfo.currency,
            paymentMethod
        );
        if (feeContext.orderFeeIndexes.hasDonation && !host.model.donationsInfo[0].available) {
            this.removeDonationFromOrderFees(feeContext.orderFeeIndexes.donationIndex, host);
            return;
        }
        if (feeContext.orderFeeIndexes.hasDonation || !paymentMethod.selectedDonation) return;
        this.addDonationToOrderFees(host, paymentMethod.selectedDonation);
    }

    private removeDonationFromOrderFees (donationIndex: number, host: IbPmtFeeHost): void {
        host.model.summaryInfo.orderFees.splice(donationIndex, 1);
        this.NewMainHeaderFacade.updateBasketOthers('DONATION');
    }

    private formatDonationSummaryFee (host: IbPmtFeeHost, amount: number): string {
        return this.CurrencyService.formatPrice(host.model.paymentInfo.currency, amount, true);
    }

    private addDonationToOrderFees (host: IbPmtFeeHost, selectedDonation): void {
        const donationFee = {
            code: this.PmtConstants.ORDER_ITEMS_TYPES.DONATION,
            description: selectedDonation.partner,
            fee: this.formatDonationSummaryFee(host, selectedDonation.option.option),
            totalFee: selectedDonation.option.option
        };
        host.model.summaryInfo.orderFees.push(donationFee);
        this.NewMainHeaderFacade.updateBasketOthers('DONATION', donationFee);
    }

    private removeStaleCreditCardFee (host: IbPmtFeeHost, feeContext: UpdateFeeContext): void {
        const { selectedCard, orderFeeIndexes } = feeContext;
        if (selectedCard.totalFee || !orderFeeIndexes.hasCreditCardFee) return;

        this.NewMainHeaderFacade.updateBasketOthers('CARD');
        host.model.summaryInfo.orderFees.splice(orderFeeIndexes.creditCardFeeIndex, 1);
        this.localStorageService.remove('creditCardFee');
    }

    private applyCardFeeToTotalPrice (host: IbPmtFeeHost, feeContext: UpdateFeeContext): void {
        if (this.hasAviosDiscountApplied(host)) {
            this.applyAviosCardFeeToPrice(host, feeContext.selectedCard, feeContext.oldFee);
            return;
        }
        this.applyStandardCardFeeToPrice(host, feeContext.selectedCard, feeContext.oldFee);
    }

    private hasAviosDiscountApplied (host: IbPmtFeeHost): boolean {
        return Boolean(
            host.model.paymentInfo.appliedDiscounts?.status &&
            host.model.paymentInfo.appliedDiscounts?.types?.[this.PmtConstants.DISCOUNT_TYPES.AVIOS]
        );
    }

    private applyAviosCardFeeToPrice (host: IbPmtFeeHost, selectedCard, oldFee: number | null): void {
        const tab = host.model.selectedData.selectedTab;
        const paymentMethod = host.model.paymentInfo.paymentMethods[tab];
        const donationAmount = paymentMethod.selectedDonation?.option?.option ?? 0;
        const originalTotal = host.model.paymentInfo.originalPaymentMethods[tab].total;
        const aviosDiscount = this.getAviosDiscountAmount(host);
        const baseTotal = resolvePaymentMethodTotalWithoutCardFee({
            originalTotal,
            donationAmount,
            aviosDiscount
        });

        paymentMethod.total = baseTotal;
        paymentMethod.totalPriceInfo = this.CurrencyService.formatPrice(
            host.model.paymentInfo.currency,
            paymentMethod.total,
            true
        );

        if (!host.model.paymentInfo.price) {
            host.model.paymentInfo.price = {
                totalPrice: baseTotal + (selectedCard.totalFee ?? 0),
                formattedTotalPrice: '',
                textTotalPrice: this.$filter('translate')('SUMMARY_TOTAL'),
                showTotalPrice: true
            };
        } else {
            host.model.paymentInfo.price.totalPrice = baseTotal + (selectedCard.totalFee ?? 0);
        }

        if (oldFee) {
            host.setOriginalOBPrice(host.getOriginalOBPrice() - oldFee);
        }
        if (this.localStorageService.get('creditCardFee')) {
            host.setOriginalOBPrice(host.getOriginalOBPrice() + (selectedCard.totalFee ?? 0));
        }
    }

    private applyStandardCardFeeToPrice (host: IbPmtFeeHost, selectedCard, oldFee: number | null): void {
        const tab = host.model.selectedData.selectedTab;
        const paymentMethod = host.model.paymentInfo.paymentMethods[tab];
        const donationAmount = paymentMethod.selectedDonation?.option?.option ?? 0;
        const originalTotal = host.model.paymentInfo.originalPaymentMethods[tab].total;
        host.model.paymentInfo.price.totalPrice = resolveTotalPrice({
            selectedCard,
            paymentMethod,
            originalTotal,
            cardFee: selectedCard.totalFee ?? 0,
            donationAmount
        });
        host.setOriginalOBPrice(resolveOriginalOBPriceAfterCardFee(
            host.getOriginalOBPrice(),
            oldFee,
            selectedCard.totalFee,
            Boolean(this.localStorageService.get('creditCardFee'))
        ));
    }

    private publishFeeUpdate (host: IbPmtFeeHost, feeContext: UpdateFeeContext): void {
        host.model.paymentInfo.price.formattedTotalPrice = this.CurrencyService.formatPrice(
            host.model.paymentInfo.currency,
            host.model.paymentInfo.price.totalPrice,
            true
        );
        host.setNoDiscountOBPrice(this.CurrencyService.formatPrice(
            host.model.paymentInfo.currency,
            host.getOriginalOBPrice(),
            true
        ));
        host.setAppliedCCFee(true);
        this.syncHeaderBasketTotal(feeContext.hasBasketDiscountsApplied, feeContext.headerModelData, host);
        host.updateTotalFees();
    }

    private removeCreditCardFeeFromTotal (host: IbPmtFeeHost, oldFee: number | null): void {
        const tab = host.model.selectedData.selectedTab;
        const paymentMethod = host.model.paymentInfo.paymentMethods[tab];
        const originalTotal = host.model.paymentInfo.originalPaymentMethods[tab].total;
        const donationAmount = paymentMethod.selectedDonation?.option?.option ?? 0;
        const hasAvios = this.hasAviosDiscountApplied(host);
        const aviosDiscount = hasAvios ? this.getAviosDiscountAmount(host) : 0;
        const headerModelData = this.localStorageService.get('headerModel');
        const hasBasketDiscountsApplied = hasOrderBasketDiscounts(this.localStorageService.get('createOrderData'));

        this.purgeCreditCardFeeFromOrderFees(host);

        paymentMethod.total = resolvePaymentMethodTotalWithoutCardFee({
            originalTotal,
            donationAmount,
            aviosDiscount
        });
        paymentMethod.totalPriceInfo = this.CurrencyService.formatPrice(
            host.model.paymentInfo.currency,
            paymentMethod.total,
            true
        );

        if (host.model.paymentInfo.price) {
            host.model.paymentInfo.price.totalPrice = paymentMethod.total;
            host.model.paymentInfo.price.formattedTotalPrice = this.CurrencyService.formatPrice(
                host.model.paymentInfo.currency,
                paymentMethod.total,
                true
            );
        }

        if (oldFee) host.setOriginalOBPrice(host.getOriginalOBPrice() - oldFee);
        host.setAppliedCCFee(false);
        this.syncHeaderBasketTotal(hasBasketDiscountsApplied, headerModelData, host);
        host.updateTotalFees();
    }

    private purgeCreditCardFeeFromOrderFees (host: IbPmtFeeHost): void {
        if (!host.model.summaryInfo.orderFees?.length) {
            this.localStorageService.remove('creditCardFee');
            this.NewMainHeaderFacade.updateBasketOthers('CARD');
            return;
        }

        for (let i = host.model.summaryInfo.orderFees.length - 1; i >= 0; i--) {
            if (host.model.summaryInfo.orderFees[i].code !== this.PmtConstants.ORDER_ITEMS_TYPES.CREDIT_CARD_FEE) continue;
            host.model.summaryInfo.orderFees.splice(i, 1);
        }
        this.localStorageService.remove('creditCardFee');
        this.NewMainHeaderFacade.updateBasketOthers('CARD');
    }

    private syncHeaderBasketTotal (hasBasketDiscountsApplied: boolean, headerModelData: any, host: IbPmtFeeHost): void {
        if (!hasBasketDiscountsApplied || !headerModelData) return;
        headerModelData.headerModel.shoppingBasket.total.totalPrice = host.model.paymentInfo.price.totalPrice;
        headerModelData.headerModel.shoppingBasket.total.formatted = host.model.paymentInfo.price.formattedTotalPrice;
        this.NewMainHeaderFacade.updateHeaderModel(headerModelData);
    }

    private syncDonationStorageAndOrderFees (host: IbPmtFeeHost, params): void {
        if (params.status) {
            this.enableDonationStorage(host, params);
            return;
        }
        if (params.donationOrderFeeIndex < 0) return;
        this.disableDonationStorage(host, params);
    }

    private enableDonationStorage (host: IbPmtFeeHost, params): void {
        const { option, donationInfo, newsletter, donationForm, datalayerGeneral, lastDonation, donationOrderFeeIndex } = params;
        this.localStorageService.set('donation', {
            option,
            partner: donationInfo.partner,
            newsletter,
            donationInfo,
            form: donationForm
        });
        if (donationOrderFeeIndex < 0) {
            this.pushDonationOrderFee(host, donationInfo.partner, option);
        }
        if (donationOrderFeeIndex >= 0) {
            this.replaceDonationOrderFee(host, donationOrderFeeIndex, donationInfo.partner, option, datalayerGeneral, lastDonation);
        }
        addDonationAmountToDatalayer(datalayerGeneral, this.PmtDatalayerConstants, option.option);
    }

    private disableDonationStorage (host: IbPmtFeeHost, params): void {
        subtractDonationAmountFromDatalayer(
            params.datalayerGeneral,
            this.PmtDatalayerConstants,
            resolvePreviousDonationAmount(
                params.lastDonation,
                host.model.summaryInfo.orderFees,
                params.donationOrderFeeIndex
            )
        );
        this.localStorageService.remove('donation');
        this.NewMainHeaderFacade.updateBasketOthers('DONATION');
        host.model.summaryInfo.orderFees.splice(params.donationOrderFeeIndex, 1);
    }

    private pushDonationOrderFee (host: IbPmtFeeHost, partner: string, option): void {
        if (!host.model.summaryInfo.orderFees) {
            host.model.summaryInfo.orderFees = [];
        }
        const formattedDonationFee = this.formatDonationSummaryFee(host, option.option);
        host.model.summaryInfo.orderFees.push({
            code: this.PmtConstants.ORDER_ITEMS_TYPES.DONATION,
            description: partner,
            fee: formattedDonationFee,
            totalFee: option.option
        });
        this.NewMainHeaderFacade.updateBasketOthers('DONATION', {
            code: this.PmtConstants.ORDER_ITEMS_TYPES.DONATION,
            description: partner,
            total: option.option,
            totalFormatted: formattedDonationFee
        });
    }

    private replaceDonationOrderFee (host: IbPmtFeeHost, donationOrderFeeIndex, partner, option, datalayerGeneral, lastDonation): void {
        subtractDonationAmountFromDatalayer(
            datalayerGeneral,
            this.PmtDatalayerConstants,
            resolvePreviousDonationAmount(lastDonation, host.model.summaryInfo.orderFees, donationOrderFeeIndex)
        );
        const formattedDonationFee = this.formatDonationSummaryFee(host, option.option);
        host.model.summaryInfo.orderFees[donationOrderFeeIndex].fee = formattedDonationFee;
        host.model.summaryInfo.orderFees[donationOrderFeeIndex].totalFee = option.option;
        this.NewMainHeaderFacade.updateBasketOthers('DONATION', {
            code: this.PmtConstants.ORDER_ITEMS_TYPES.DONATION,
            description: partner,
            total: option.option,
            totalFormatted: formattedDonationFee
        });
    }

    private getAviosDiscountAmount (host: IbPmtFeeHost): number {
        if (!this.hasAviosDiscountApplied(host)) return 0;
        return parseFloat(
            host.model.paymentInfo.appliedDiscounts.types[this.PmtConstants.DISCOUNT_TYPES.AVIOS]?.originalDiscount
        ) || 0;
    }

    private applyDonationToPaymentMethod (host: IbPmtFeeHost, params: DonationPaymentMethodUpdateParams): void {
        if (this.hasAviosDiscountApplied(host)) {
            this.applyAviosDonationToPaymentMethod(host, params);
        } else {
            this.applyStandardDonationToPaymentMethod(host, params);
        }
        this.syncHeaderBasketTotal(params.hasBasketDiscountsApplied, this.localStorageService.get('headerModel'), host);
    }

    private setPaymentMethodDonation (host: IbPmtFeeHost, paymentMethodIndex: number, status: boolean, option, donationInfo, newsletter, donationForm): void {
        const paymentMethod = host.model.paymentInfo.paymentMethods[paymentMethodIndex];
        if (status) {
            paymentMethod.selectedDonation = { option, partner: donationInfo.partner, newsletter, donationInfo, form: donationForm };
            return;
        }
        paymentMethod.selectedDonation = null;
    }

    private applyAviosDonationToPaymentMethod (host: IbPmtFeeHost, params: DonationPaymentMethodUpdateParams): void {
        const { paymentMethodIndex, status, option } = params;
        const paymentMethod = host.model.paymentInfo.paymentMethods[paymentMethodIndex];
        const aviosDiscount = this.getAviosDiscountAmount(host);
        const originalTotal = host.model.paymentInfo.originalPaymentMethods[paymentMethodIndex].total;

        this.setPaymentMethodDonation(host, paymentMethodIndex, status, option, params.donationInfo, params.newsletter, params.donationForm);
        const donationAmount = status ? option.option : 0;
        paymentMethod.total = originalTotal - aviosDiscount + donationAmount;
        paymentMethod.totalPriceInfo = this.CurrencyService.formatPrice(host.model.paymentInfo.currency, paymentMethod.total, true);
        this.publishDonationPriceChange(host, {
            paymentMethodIndex,
            totalPrice: this.resolveDonationChangeTotalPriceForIndex(host, paymentMethodIndex),
            status,
            option,
            withFormattedOldPrice: true
        });
    }

    private applyStandardDonationToPaymentMethod (host: IbPmtFeeHost, params: DonationPaymentMethodUpdateParams): void {
        const { paymentMethodIndex, status, option } = params;
        const paymentMethod = host.model.paymentInfo.paymentMethods[paymentMethodIndex];
        const selectedCard = host.model.paymentInfo.selectedPaymentInfo?.selectedCard;
        const cardFee = selectedCard?.totalFee > 0 ? selectedCard.totalFee : 0;

        this.setPaymentMethodDonation(host, paymentMethodIndex, status, option, params.donationInfo, params.newsletter, params.donationForm);
        paymentMethod.total = resolvePaymentMethodTotalWithCardFee({
            originalTotal: host.model.paymentInfo.originalPaymentMethods[paymentMethodIndex].total,
            donationAmount: option.option,
            status,
            cardFee,
            hasSelectedCard: Boolean(selectedCard)
        });
        paymentMethod.totalPriceInfo = this.CurrencyService.formatPrice(host.model.paymentInfo.currency, paymentMethod.total, true);
        this.publishDonationPriceChange(host, {
            paymentMethodIndex,
            totalPrice: this.resolveDonationChangeTotalPriceForIndex(host, paymentMethodIndex),
            status,
            option,
            withFormattedOldPrice: false
        });
        this.applyVoucherOldPriceIfNeeded(host, paymentMethodIndex, status, option);
    }

    private resolveDonationChangeTotalPriceForIndex (host: IbPmtFeeHost, paymentMethodIndex: number): number {
        const paymentMethod = host.model.paymentInfo.paymentMethods[paymentMethodIndex];
        const originalTotal = host.model.paymentInfo.originalPaymentMethods[paymentMethodIndex].total;
        const selectedCard = host.model.paymentInfo.selectedPaymentInfo?.selectedCard;
        const cardFee = Number(selectedCard?.totalFee) || 0;
        const donationAmount = paymentMethod.selectedDonation?.option?.option ?? 0;
        const totalPrice = resolveDonationChangeTotalPrice({
            paymentMethod,
            originalTotal,
            selectedCard,
            cardFee,
            donationAmount
        });
        if (selectedCard) selectedCard.totalToPay = totalPrice;
        return totalPrice;
    }

    private publishDonationPriceChange (host: IbPmtFeeHost, params: DonationPriceChangeParams): void {
        const formattedOldPriceInfo = params.withFormattedOldPrice
            ? this.resolveDonationFormattedOldPriceInfo(host, params.paymentMethodIndex, params.status, params.option)
            : undefined;

        if (host.model.paymentInfo.price) {
            host.model.paymentInfo.price.totalPrice = params.totalPrice;
            host.model.paymentInfo.price.formattedTotalPrice = this.CurrencyService.formatPrice(
                host.model.paymentInfo.currency,
                params.totalPrice,
                true
            );
            if (params.withFormattedOldPrice) {
                host.model.paymentInfo.price.formattedOldPriceInfo = formattedOldPriceInfo;
            }
            return;
        }

        host.model.paymentInfo.price = {
            totalPrice: params.totalPrice,
            formattedTotalPrice: this.CurrencyService.formatPrice(host.model.paymentInfo.currency, params.totalPrice, true),
            formattedOldPriceInfo,
            textTotalPrice: this.$filter('translate')('SUMMARY_TOTAL'),
            showTotalPrice: true
        };
    }

    private applyVoucherOldPriceIfNeeded (host: IbPmtFeeHost, paymentMethodIndex: number, status: boolean, option): void {
        if (!host.model.paymentInfo.appliedDiscounts?.types[this.PmtConstants.DISCOUNT_TYPES.VOUCHER]) return;
        if (!host.model.paymentInfo.price) return;

        host.model.paymentInfo.price.formattedOldPriceInfo =
            this.resolveDonationFormattedOldPriceInfo(host, paymentMethodIndex, status, option);
    }

    private getVoucherOriginalDiscount (host: IbPmtFeeHost): number {
        const voucher = host.model.paymentInfo.appliedDiscounts?.types[this.PmtConstants.DISCOUNT_TYPES.VOUCHER];
        return voucher ? voucher.originalDiscount : 0;
    }

    private resolveDonationFormattedOldPriceInfo (host: IbPmtFeeHost, paymentMethodIndex: number, status: boolean, option): string {
        const paymentMethod = host.model.paymentInfo.paymentMethods[paymentMethodIndex];
        const originalTotal = host.model.paymentInfo.originalPaymentMethods[paymentMethodIndex].total;
        const voucherDiscount = this.getVoucherOriginalDiscount(host);

        if (status) {
            return this.CurrencyService.formatPrice(
                host.model.paymentInfo.currency,
                originalTotal + option.option + voucherDiscount,
                true
            );
        }
        if (voucherDiscount) return paymentMethod.oldPriceInfo;
        return this.CurrencyService.formatPrice(host.model.paymentInfo.currency, originalTotal, true);
    }
}

angular.module('ib-pmt-module').service('IbPmtCreditCardFeeService', [
    'localStorageService',
    'CurrencyService',
    'NewMainHeaderFacade',
    'PmtUtilsTransformers',
    'PmtUtilsService',
    'PmtConstants',
    'PmtDatalayerConstants',
    'DataLayerService',
    '$filter',
    function (
        localStorageService,
        CurrencyService,
        NewMainHeaderFacade,
        PmtUtilsTransformers,
        PmtUtilsService,
        PmtConstants,
        PmtDatalayerConstants,
        DataLayerService,
        $filter
    ) {
        return new IbPmtCreditCardFeeService(
            localStorageService,
            CurrencyService,
            NewMainHeaderFacade,
            PmtUtilsTransformers,
            PmtUtilsService,
            PmtConstants,
            PmtDatalayerConstants,
            DataLayerService,
            $filter
        );
    }
]);
