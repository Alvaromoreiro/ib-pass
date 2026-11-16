import { Component, Inject, OnDestroy, OnInit, Output, EventEmitter } from "@angular/core";
import { AJSRootScope, CommonsCookiesService, CommonsSessionStorageService, downgradeToAJSComponent } from "ib-web-commons/utils";
import { AJSMmBDatalayerUtilsService, AJSMmBDatalayerUtilsServiceType } from "../../../services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service";
import { MMBDatalayerConstants } from "../../../services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { AlertUpgradingAvios, AlertUpgradingAviosProps, AlertUpgradingBids, AlertUpgradingBidsProps, LoadingOverlay, LoadingOverlayProps } from 'commercial-management--digital--web-components-design--library';
import { IbMmbPaymentFormService } from "./services/ib-Mmb-payment-form.service";
import { AJSMmbModalService, MmbModalServiceType } from '@src/components/ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service';
import { ReplaySubject, Subject, takeUntil } from "rxjs";
import { IbMmbPaymentComponentService } from "./services/ib-Mmb-payment.service";
import { ElementType } from "react";
import { CommercialData } from "@src/app/core/models/commercial-data-model/commercial-data-model";
import { IbMmbSummaryService } from "./components/ib-mmb-summary/services/ib-Mmb-summary.service";
import { HeaderModelLocalstorage, ShoppingBasket } from "@src/app/core/models/header-model/header.model";
import { Router } from "@angular/router";
import { MmBRouterConstants } from 'src/components/routing/ib-MmB-router-constants';
import { VoucherValidatedEvent } from "../../models/ib-Mmb-voucher-model";
import { PriceSubscriptionModel } from "../../models/ib-Mmb-payments-component-model";
import { OnErrorEvent, OnSuccessEvent } from "../../models/ib-Mmb-payments-model";
import { OnErrorEventStatus } from "../../enums/ib-Mmb-payments-enum";
import { MmBDigitalDataService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-digital-data-service";
import { AJSMmBDigitalDataService } from "@src/components/services/ib-MmB-datalayer/services/ib-mmb-digital-data-bridge.service";
import { ReactComponentData } from "@src/app/core/models/generic-models";
import { TranslateService } from "@ngx-translate/core";
import { IssueOrderInfoTransformerService } from "./services/ib-Mmb-issue-order-info-transformer.service";

@Component({
    selector: 'ib-mmb-payment',
    templateUrl: './ib-MmB-payment-view.component.html',
    styleUrls: ['./ib-MmB-payment.component.scss'],
    providers: [
        IbMmbPaymentComponentService
    ]
})
export class IbMmbPaymentComponent implements OnInit, OnDestroy {
    private pmtContext: string;
    @Output() public returnToOld = new EventEmitter();
    public readonly PAYMENT_COMP_BLOCK_ID = 'payments-components';
    private PaymentWebComponent;
    public flowId: string = this.CommonsSessionStorageService.get('flowId');

    private pmtPriceUpdateStm = new ReplaySubject<PriceSubscriptionModel>(1);
    private pmtPaymentUpdateStm = new ReplaySubject(1);
    // private pmtErrorUpdateStm = new ReplaySubject(1);
    private unsuscribeUpdatesStm = new Subject<void>();

    public showLoadingOverlay: boolean = false;
    public loadingDsComponent: ReactComponentData<LoadingOverlayProps> = {
        component: LoadingOverlay,
        props: {} as LoadingOverlayProps
    };
    private pmtLoadingProps: LoadingOverlayProps = {
        title: this.TranslateService.instant('WAIT_A_MOMENT_PLEASE'),
        subtitles: [ this.TranslateService.instant('WAIT_A_MOMENT_RECALCULATE_MMB'), this.TranslateService.instant('WAIT_A_MOMENT_ALMOST_FINISH_MMB') ],
        isOpen: false,
        textTransition: 8000
    };

    private pmtLoadingPayProps: LoadingOverlayProps = {
        title: this.TranslateService.instant('WAIT_A_MOMENT_PLEASE'),
        subtitles: [ this.TranslateService.instant('WAITING_LOADING_PAYMENTS_CARDS_TITLE')],
        isOpen: false,
        textTransition: 0
    };

    AlertUpgradingAvios: ElementType = AlertUpgradingAvios;
    AlertUpgradingAviosProps: AlertUpgradingAviosProps = {
        type: 'alert_warning'
    };

    AlertUpgradingBids: ElementType = AlertUpgradingBids;
    AlertUpgradingBidsProps: AlertUpgradingBidsProps = {
        type: 'alert_info'
    };

    model: any = {
        noPaymentSummary: false
    };
    flowApp: string;
    totalAviosAmount: number;
    numberFreeUpgrade: boolean;
    allowedCashAndAviosWithVoucher: boolean;
    actualStepFlow: string;
    showPmtComponent: boolean;
    private pmtModelInfo = {
        quadrigams: {
            payments: MmBAppConstants.QUADRIGAM.NEW_PAYMENT_PAGE_MMBVC,
            confirmation: MmBAppConstants.QUADRIGAM.NEW_PAYMENT_CONFIRMATION_MMBVC
        }
    };


    constructor(
        @Inject(AJSMmbModalService) private MmbModalService: MmbModalServiceType,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(AJSMmBDatalayerUtilsService) private MmBDatalayerUtilsService: AJSMmBDatalayerUtilsServiceType,
        @Inject(AJSMmBDigitalDataService) private DigitalDataService: MmBDigitalDataService,
        private CommonsCookiesService: CommonsCookiesService,
        private IbMmbPaymentFormService: IbMmbPaymentFormService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbMmbPaymentComponentService: IbMmbPaymentComponentService,
        private IbMmbSummaryService: IbMmbSummaryService,
        private issueOrderInfoTransformer: IssueOrderInfoTransformerService,
        private router: Router,
        private TranslateService: TranslateService
    ) {
        this.flowApp = this.CommonsSessionStorageService.get<string>('flowApp');
        this.totalAviosAmount = this.CommonsSessionStorageService.get<number>('totalAviosAmount');
        this.numberFreeUpgrade = this.CommonsSessionStorageService.get<boolean>('numberFreeUpgrade');
        this.allowedCashAndAviosWithVoucher = this.CommonsSessionStorageService.get<CommercialData>('commercialData')?.marketFlags?.allowedCashAndAviosWithVoucher;
        this.$rootScope.$on('basketUpdateCommonHeader', (event) => this.updatePaymentComponentFromHeader());
    }

    async ngOnInit (): Promise<void> {
        this.showPmtComponent = true;
        this.loadingDsComponent.props = { ...this.pmtLoadingProps };
        //Show header
        this.$rootScope.showHeaders = true;
        this.toggleLoadingOverlay(true);
        this.setDigitalData(MmBAppConstants.QUADRIGAM.NEW_PAYMENT_PAGE_ANC);
        this.setAddPaymentInfo();

        // Check if should fallback to legacy payment component (e.g., for 0€ payments)
        if (this.flowApp === 'MMBVC' && this.handleLegacyFallback()) return;

        this.initPaymentForm().then(
            () => {
                this.MmbModalService.finishWaiting();
            }, (error) => {
                window.console.error(error);
                this.MmbModalService.finishWaiting();
                this.returnToOld.emit();
            }
        );
        this.pmtPaymentUpdateStm.pipe(takeUntil(this.unsuscribeUpdatesStm)).subscribe((data) => { this.checkPaymentUpdate(data);});
        this.pmtPriceUpdateStm.pipe(takeUntil(this.unsuscribeUpdatesStm)).subscribe((data) => { this.checkPriceUpdate(data);});
        this.$rootScope.$broadcast('closeCollapseHeader');
    }

    private setDigitalData = (quadrigam) => {
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
    }

    private setAddPaymentInfo = (): void => {
        const addToCart: any = this.CommonsSessionStorageService.get('addToCart');
        if (addToCart) this.DigitalDataService.addDigitalDataEcommerceEvent(addToCart.ecommerce, 'add_payment_info');
    }

    private updatePaymentInfo = (paymentInfo: PriceSubscriptionModel): void => {
        const shoppingBasket: ShoppingBasket = this.CommonsSessionStorageService.get<HeaderModelLocalstorage>('headerModel')?.headerModel?.shoppingBasket;
        const currencyObj: any = shoppingBasket?.currency;
        const issueOrderInfo = {
            data: {
                currencies: [currencyObj],
                total: shoppingBasket?.total?.original,
                contextMetadata: { currencies: [currencyObj] },
            }
        };
        this.CommonsSessionStorageService.set('issueOrderInfo', issueOrderInfo);
        const [discount] = paymentInfo.discounts;
        if (discount) {
            const isAvios = discount.rewardCode === 'AVIOS';
            const discountType = isAvios ? 'AVIOS' : 'VOUCHER';

            const paymentsInfo = {
                appliedDiscounts: {
                    status: true,
                    types: {
                        [discountType]: true
                    }
                }
            };
            const voucherInfo = {
                voucherId: discount.id,
                amount: discount.total,
                rewardCode: discount.rewardCode
            };
            this.CommonsSessionStorageService.set('paymentsInfo', paymentsInfo);
            this.CommonsSessionStorageService.set('voucherInfo', voucherInfo);
        } else {
            this.CommonsSessionStorageService.remove('paymentsInfo');
            this.CommonsSessionStorageService.remove('voucherInfo');
        }
    }


    private updateBasketInfo(paymentInfo: PriceSubscriptionModel): void {
        const { headerModel: { shoppingBasket: newBasket } } = this.CommonsSessionStorageService.get<any>('headerModel');
        const [discount] = paymentInfo.discounts;
        const currentTotalDcc: string = newBasket.total?.totalDcc;

        const totalObj = {
            totalPrice: paymentInfo.total,
            original: paymentInfo.total,
            formatted: this.IbMmbPaymentFormService.getPriceFormatted(paymentInfo.total)
        };

        if (currentTotalDcc) {
            totalObj['totalDcc'] = currentTotalDcc;
        }

        if (discount) {
            const { total, type } = discount;
            const discountFormatted = this.IbMmbPaymentFormService.getPriceFormatted(total);
            const typeDescription = this.TranslateService.instant('BONUS_CARD_GIFT_TEXT');

            Object.assign(newBasket.discountsModel, {
                hasDiscounts: true,
                total,
                totalFormated: discountFormatted,
                discounts: {
                    [type]: { discountFormatted, discount: total, description: null, type: typeDescription }
                }
            });

            Object.assign(newBasket.total, totalObj);
        } else {
            Object.assign(newBasket, {
                discountsModel: { hasDiscounts: false, discounts: [] },
                total: totalObj
            });
        }

        this.$rootScope.$broadcast('updateMmbHeaderBasket', newBasket);
    }

    private initPaymentForm = async (): Promise<void> => {
        try {
            const redirectContext = this.CommonsSessionStorageService.get<{ contextId: string, status: string }>(MmBAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
            const accessIbisToken =  this.CommonsSessionStorageService.get<string>('loggedToken') ?? this.CommonsSessionStorageService.get<string>('anonymousToken');
            const salesforceToken =  this.CommonsCookiesService.get<string>('IBERIACOM_SSO_ACCESS_SALESFORCE');
            const flowApp =  this.CommonsSessionStorageService.get<string>('flowApp');
            this.pmtContext =  redirectContext?.contextId ? redirectContext.contextId : await this.IbMmbPaymentComponentService.getPaymentContextId(flowApp);

            this.showPmtComponent = true;
            this.toggleLoadingOverlay(true);

            return this.IbMmbPaymentFormService.getNewPaymentComponent({
                target: `#${this.PAYMENT_COMP_BLOCK_ID}`,
                contextId: this.pmtContext,
                onPaymentSuccess: this.onPaymentSuccess,
                onError: this.onPaymentFailure,
                auth: {
                    token: accessIbisToken,
                    additionalTokens: salesforceToken ?[{
                        key:'X-Salesforce-Token',
                        value: salesforceToken
                    }]: []
                }
            }).then((PaymentWebComponent) => {
                this.MmbModalService.finishWaiting();
                this.toggleLoadingOverlay(false);
                PaymentWebComponent.subscribe('price', (priceUpdate) => {this.pmtPriceUpdateStm.next(priceUpdate);});
                PaymentWebComponent.subscribe('payment', (paymentUpdate) => {this.pmtPaymentUpdateStm.next(paymentUpdate);});
                // PaymentWebComponent.subscribe('error', (errorUpdate) => {this.pmtErrorUpdateStm.next(errorUpdate);});
            });
        } catch (exception) {
            this.toggleLoadingOverlay( false );
            this.returnToOld.emit();
        } finally {
            const redirectContext = this.CommonsSessionStorageService.get<{ contextId: string, status: string }>(MmBAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
            if (redirectContext?.status === MmBAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT_STATUS_END) {
                this.CommonsSessionStorageService.remove(MmBAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
            }
        }

    };

    
    private onPaymentSuccess = (event: OnSuccessEvent): void => { 
        const { methodType, details }: OnSuccessEvent = event;
        const digital_data = {};
        digital_data[MMBDatalayerConstants.DatalayerGeneralConstants.PAYMENT_METHOD] = 
            (details !== null && methodType === 'CREDIT_CARD') ? details.creditCardType : methodType;
        this.MmBDatalayerUtilsService.addDigitalDataInfo(digital_data);
        
        try {
            const flowApp = this.flowApp;
            if (flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
                const transformedData = this.issueOrderInfoTransformer.transformForVoluntaryChangeConfirmation(event);
                const issueOrderInfo = {
                    data: transformedData,
                    code: 200
                };
                this.$rootScope.$broadcast('confirmationMMBVCEvent');
                this.CommonsSessionStorageService.set('pmtModelInfo', this.pmtModelInfo);
                this.CommonsSessionStorageService.set('issueOrderInfo', issueOrderInfo);
                const confirmationDatalayerInfo = this.CommonsSessionStorageService.get('confirmationDatalayerInfo') || {};
                this.CommonsSessionStorageService.set('confirmationDatalayerCallBack', confirmationDatalayerInfo);
            } else {
                this.router.navigateByUrl(MmBRouterConstants.PAGES_URL.NEW_MMB_PAYMENTS_CONFIRM);
            }
        } catch (error) {
            window.console.error('Error processing payment success:', error);
        } finally {
            this.toggleLoadingOverlay(false);
        }
    };

    private onPaymentFailure = async (event: OnErrorEvent): Promise<void> => {
        const {status}: OnErrorEvent = event?.status ? event : {status: undefined};
        switch (status) {
            case OnErrorEventStatus.UNAUTHORIZED : await this.initPaymentForm(); break;
            case OnErrorEventStatus.EXCEED_ATTEMPS : this.router.navigateByUrl(MmBAppConstants.PAGES_URL.SEARCH); break;
            case OnErrorEventStatus.DENIED_FRAUD : this.router.navigateByUrl(MmBAppConstants.PAGES_URL.SEARCH); break;
            default: this.returnToOld.emit(); break;
        }

    };

    private updatePaymentComponentFromHeader = (): void => {
        if(this.hasAncillaries()) {
            this.initPaymentForm();
            this.IbMmbSummaryService.getSummaryInfo();
        } else {
            this.router.navigateByUrl(MmBRouterConstants.PAGES_URL.MMB_DASHBOARD);
        }
    };

    private hasAncillaries = (): boolean => {
        const shoppingBasket: ShoppingBasket = this.CommonsSessionStorageService.get<HeaderModelLocalstorage>('headerModel')?.headerModel?.shoppingBasket;
        return this.hasBaggage(shoppingBasket)
        || this.hasSeats(shoppingBasket)
        || this.hasInsurance(shoppingBasket)
        || this.hasPriorityBoarding(shoppingBasket)
        || this.hasSpeqs(shoppingBasket)
    };

    private hasBaggage = (shoppingBasket) => {
        return (shoppingBasket?.baggages?.hasBaggage);
    };
    private hasSeats = (shoppingBasket) => {
        return (shoppingBasket?.seats?.hasSeats);
    };
    private hasInsurance = (shoppingBasket) => {
        return (shoppingBasket?.insurance?.hasInsurance);
    };
    private hasPriorityBoarding = (shoppingBasket) => {
        return (shoppingBasket?.priorityBoarding?.hasPriorityBoarding);
    };
    private hasSpeqs = (shoppingBasket) => {
        return (shoppingBasket?.speqs?.hasSpeqs);
    };


    public onVoucherValidated = async (data: VoucherValidatedEvent): Promise<void> => {
        this.toggleLoadingOverlay(true);
        let voucherDiscount = data.order?.voucherDiscount ?? null;
        let digital_data = {};
        if ( !voucherDiscount ) {
            this.MmBDatalayerUtilsService.removeDigitalDataObjects([MMBDatalayerConstants.DatalayerGeneralConstants.VOUCHER_DISCOUNT]);
            digital_data[ MMBDatalayerConstants.DatalayerGeneralConstants.VOUCHER_USED ] = MMBDatalayerConstants.DIGITAL_DATA_VALUES.NO;
        } else {
            digital_data[ MMBDatalayerConstants.DatalayerGeneralConstants.VOUCHER_DISCOUNT ] = voucherDiscount.amount;
            digital_data[ MMBDatalayerConstants.DatalayerGeneralConstants.VOUCHER_USED ] = MMBDatalayerConstants.DIGITAL_DATA_VALUES.YES;
        }
        this.MmBDatalayerUtilsService.addDigitalDataInfo( digital_data );

        await this.initPaymentForm();
    };

    private checkPaymentUpdate = (data): void => {
        const {status} = data?.status ? data: {status: undefined};
        window.scrollTo(0, 0);
        this.toggleLoadingOverlay(true, 'PAY');
        if(status === 'REDIRECTION') {
            const confirmationDatalayerInfoCallback = this.CommonsSessionStorageService.get('confirmationDatalayerInfo') || {};
            this.CommonsSessionStorageService.set('confirmationDatalayerCallBack', confirmationDatalayerInfoCallback);
            this.CommonsSessionStorageService.set(MmBAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT, { contextId: this.pmtContext, status: MmBAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT_STATUS_INIT });
        } else if (status === 'ERROR') {
            this.toggleLoadingOverlay(false);
        } else {
            this.CommonsSessionStorageService.remove(MmBAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
        }
    };

    private checkPriceUpdate = (data: PriceSubscriptionModel): void => {
        const digital_data = {};
        digital_data[MMBDatalayerConstants.DATALAYER_MMB_INFO.TOTAL_PRICE] = data.total;
        this.MmBDatalayerUtilsService.addDigitalDataInfo(digital_data);
        this.IbMmbPaymentFormService.updatePrice(data);
        this.IbMmbPaymentFormService.updateDCCInHeaderModel(data);
        this.updatePaymentInfo(data);

        if (!this.isVoluntaryChangeFlow()) {
            this.updateBasketInfo(data);
        }
    };

    ngOnDestroy (): void {
        this.unsuscribeUpdatesStm.next();
        this.unsuscribeUpdatesStm.complete();
    };

    private toggleLoadingOverlay = ( isOpen: boolean, type?: 'DEFAULT'|'PAY'   ) => {
        this.showLoadingOverlay = isOpen;
        let props: LoadingOverlayProps = this.loadingDsComponent.props;
        switch(type){
            case 'PAY': props = this.pmtLoadingPayProps; break;
            default: props = this.pmtLoadingProps;
    }
        this.loadingDsComponent.props = { ...props, isOpen };
    };

    private handleLegacyFallback = (): boolean => {
        if (!this.shouldUseLegacyForFreePayment()) {
            return false;
        }
        this.toggleLoadingOverlay(false);
        this.MmbModalService.finishWaiting();
        this.returnToOld.emit();
        return true;
    };

    private shouldUseLegacyForFreePayment = (): boolean => {
        const fareData = this.CommonsSessionStorageService.get<any>('fareData');
        const total = fareData?.compensationInfo?.totalCost;
        
        return total === 0 || total === null || total === undefined;
    };

    private isVoluntaryChangeFlow(): boolean {
        const flowApp = this.flowApp || this.CommonsSessionStorageService.get<string>('flowApp');
        return flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE 
            || flowApp === 'MMBUNIF';
    }
}

downgradeToAJSComponent('ibMmbPayment', {
    component: IbMmbPaymentComponent
}, 'ib-MmB-payment-module');
