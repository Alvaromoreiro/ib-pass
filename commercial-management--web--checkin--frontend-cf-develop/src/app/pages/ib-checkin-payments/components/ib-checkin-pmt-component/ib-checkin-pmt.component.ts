import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import { VoucherValidatedEvent } from '@src/app/core/models/ib-checkin-payments/ib-checkin-voucher-model';
import { AJSCheckinModalService, CheckinModalServiceType } from '@src/app/shared/services/ib-modal/ib-checkin-modal-service-bridge.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { AJSRootScope, CommonsCookiesService, CommonsSessionStorageService, CommonsBrowserStorageService } from 'ib-web-commons/utils';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { IbCheckinPmtContextService } from './services/ib-checkin-pmt-context.service';
import { IbCheckInPmtFormService } from './services/ib-checkin-pmt-form.service';
import { IbCheckinPmtDigitalDataService } from './services/ib-checkin-pmt-digital-data.service';
import { DigitalDataConstants } from '@src/app/core/constants/ib-digital-data-constants';
import { OnErrorEvent, OnErrorEventStatus, OnPaymentSuccessEvent } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-model';
import { LoadingOverlayProps } from 'commercial-management--digital--web-components-design--library';

@Component({
    selector: 'ib-checkin-pmt',
    templateUrl: 'ib-checkin-pmt.component.html',
    styleUrls: ['./ib-checkin-pmt.component.scss']
})
export class IbCheckinPmtComponent implements OnInit, OnDestroy, AfterViewInit {
    private pmtContext: string;
    @Output() public returnToOld = new EventEmitter();
    public flowId: string = this.CommonsSessionStorageService.get('flowId');
    public readonly PAYMENT_COMP_BLOCK_ID = 'payments-components';
    /**
     *  Stream subject to get the last update for any of the events provided by payment form.
     *  These streams will inmediately respond with the lastest value emitted through the channel.
     */
    pmtPriceUpdateStm = new ReplaySubject<PriceSubscriptionModel>(1);
    pmtPaymentUpdateStm = new ReplaySubject(1);
    // Subject to force unsuscribe in order to avoid memory leaks
    unsuscribeUpdatesStm = new Subject<void>();
    initTimeout: NodeJS.Timeout;
    endTimeout: NodeJS.Timeout;
    public loadingModalProps: LoadingOverlayProps = {
        isOpen: false,
        textTransition: undefined,
        subtitles: undefined,
        title: undefined
    };

    showVoucher: boolean = false;

    constructor (
        @Inject(AJSCheckinModalService) private CheckinModalService: CheckinModalServiceType,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private IbCheckinPmtDigitalDataService: IbCheckinPmtDigitalDataService,
        private CommonsCookiesService: CommonsCookiesService,
        private IbCheckinPmtFormService: IbCheckInPmtFormService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BrowserStorageService: CommonsBrowserStorageService,
        private IbPaymentContextService: IbCheckinPmtContextService,
        private IbCheckinRedirectionUtilsService: IbCheckinRedirectionUtilsService,
        private TranslateService: TranslateService
    ){
    }
    async ngOnInit (): Promise<void> {
        this.$rootScope.$broadcast('loadingVoucherBasket', true);
        const basketUpdateCommonHeader = this.$rootScope.$on('basketUpdateCommonHeader', async (event) => {
            window.console.log('event', event);
            await this.handleBasketInfoChange();

        });
        this.$rootScope.$on('$destroy', basketUpdateCommonHeader);
        this.$rootScope.showHeaders = true;
        this.IbCheckinPmtDigitalDataService.setPaymentsDigitalData();
        this.initPaymentForm().then(
            () => {
                this.CheckinModalService.finishWaiting();
            }, (error) => {
                window.console.error(error);
                this.CheckinModalService.finishWaiting();
            }
        );
        /** TEMPORAL SUBS EXAMPLES:
         *  All new subcriptions to the subject must be done using takeUntil(this.unsuscribeUpdatesStm) to force the unsubscription
         *  when this subject notifies anything.
         *  Another correct way to use this subjects is subscribing to it with firstValueFrom which unsuscribes once one value is retrieved
        */
        this.pmtPaymentUpdateStm.pipe(takeUntil(this.unsuscribeUpdatesStm)).subscribe((data) => {
            this.checkPaymentUpdate(data);
            this.$rootScope.$broadcast('loadingVoucherBasket', false);
        });
        this.pmtPriceUpdateStm.pipe(takeUntil(this.unsuscribeUpdatesStm)).subscribe((data) => {
            this.checkPriceUpdate(data);
            this.$rootScope.$broadcast('loadingVoucherBasket', false);
        });
    }

    ngOnDestroy (): void {
        this.unsuscribeUpdatesStm.next();
        this.unsuscribeUpdatesStm.complete();
        clearTimeout(this.initTimeout);
        clearTimeout(this.endTimeout);
    }

    ngAfterViewInit (): void {
        this.IbCheckinPmtDigitalDataService.emitViewEvent();
    }

    checkPriceUpdate = (data: PriceSubscriptionModel) => {
        window.console.log( 'price', data );
        const digital_data = {};
        digital_data[ DigitalDataConstants.TOTAL_PRICE ] = data.total;
        this.IbCheckinPmtDigitalDataService.addDigitalDataInfo( digital_data );
        this.IbCheckinPmtFormService.updatePrice(data);
        this.updateBasketInfo(data);
    };

    initPaymentForm = async () => {
        try {
            this.$rootScope.$broadcast('loadingVoucherBasket', true);
            const redirectContext = this.CommonsSessionStorageService.get<{ contextId: string, status: string }>(CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
            this.pmtContext = redirectContext?.contextId ? redirectContext.contextId : await this.IbPaymentContextService.getPaymentContextId(this.flowId);
            const accessIbisToken = this.CommonsSessionStorageService.get<string>('loggedToken') ?? this.CommonsSessionStorageService.get<string>('anonymousToken');
            const salesforceToken = this.CommonsCookiesService.get<string>('IBERIACOM_SSO_ACCESS_SALESFORCE');
            window.console.log('CONTEXT ->', this.pmtContext);
            return await this.IbCheckinPmtFormService.getNewPaymentComponent({
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
            }).then((PaymentWebComponent)=> {
                PaymentWebComponent.subscribe('price', (priceUpdate) => {this.pmtPriceUpdateStm.next(priceUpdate);});
                PaymentWebComponent.subscribe('payment', (paymentEventData) => {
                    this.pmtPaymentUpdateStm.next(paymentEventData);
                });
            });
        } catch (exception) {
            this.onContextError(exception);
        } finally {
            const redirectContext = this.CommonsSessionStorageService.get<{ contextId: string, status: string }>(CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
            if (redirectContext?.status === CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT_STATUS_END) {
                this.CommonsSessionStorageService.remove(CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
            }

            this.checkShowVoucher();
        }
    };


    onContextError = (error) => {
        window.console.log(error);
        this.returnToOld.emit();
    };

    onPaymentSuccess = async ( event: OnPaymentSuccessEvent ) => {
        this.IbCheckinPmtDigitalDataService.setDigitalDataPmtType( event );
        this.CommonsSessionStorageService.set('noShowMessageBockBack', true);
        this.loadingModalProps = {
            ...this.loadingModalProps,
            isOpen: true
        };
        const waitingTime = Number(this.BrowserStorageService.get('ib-check-in-app.waitingPaymentRedirection')) || 20000;
        this.endTimeout = setTimeout(() => {
            this.boardingCardsRedirect();
        }, waitingTime);
    };

    onPaymentFailure = async (event: OnErrorEvent) => {
        const {status} = event;
        switch (status) {
                case OnErrorEventStatus.UNAUTHORIZED : await this.initPaymentForm(); break;
                case OnErrorEventStatus.EXCEED_ATTEMPS : this.showErrorModal(); break;
                case OnErrorEventStatus.DENIED_FRAUD : this.showErrorModal(); break;
                default: this.generalErrorCase();
        }
    };

    private showErrorModal = () => {
        this.CheckinModalService.showGenericError({ message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true }, true).result.then(
            ()=>this.IbCheckinRedirectionUtilsService.path(CheckinAppConstants.PAGES_ROUTES.SEARCH_BOOKING),
            ()=>this.IbCheckinRedirectionUtilsService.path(CheckinAppConstants.PAGES_ROUTES.SEARCH_BOOKING)
        );
    };

    private updateBasketInfo (paymentInfo: PriceSubscriptionModel): void {
        const { headerModel: { shoppingBasket: newBasket } } = this.CommonsSessionStorageService.get<any>('headerModel');
        const [discount] = paymentInfo.discounts;

        if (discount) {
            const { total, type } = discount;
            const discountFormatted = this.IbCheckinPmtFormService.getPriceFormatted(total);
            const typeDescription = this.TranslateService.instant('BONUS_CARD_GIFT_TEXT');

            Object.assign(newBasket.discountsModel, {
                hasDiscounts: true,
                total,
                totalFormated: discountFormatted,
                discounts: {
                    [type]: { discountFormatted, discount: total, description: null, type: typeDescription }
                }
            });

            Object.assign(newBasket.total, {
                totalPrice: 0,
                original: paymentInfo.total,
                formatted: this.IbCheckinPmtFormService.getPriceFormatted(paymentInfo.total)
            });
        } else {
            Object.assign(newBasket, {
                discountsModel: { hasDiscounts: false, discounts: [] },
                total: {
                    totalPrice: 0,
                    original: paymentInfo.total,
                    formatted: this.IbCheckinPmtFormService.getPriceFormatted(paymentInfo.total)
                }
            });
        }

        this.$rootScope.$broadcast('totalBasket', newBasket.total.formatted);
        this.$rootScope.$broadcast('updateCkiHeaderBasket', newBasket);
    }

    handleBasketInfoChange = async () => {
        const { ecommerce: { items } } = this.CommonsSessionStorageService.get<any>('addToCart');
        if (items.length === 0) {
            this.boardingCardsRedirect();
            return;
        }
        await this.initPaymentForm();
    };

    public onVoucherValidated = async (data: VoucherValidatedEvent) => {
        this.IbCheckinPmtDigitalDataService.manageDigitalDataVoucher( data.order.voucherDiscount );
        await this.initPaymentForm();
    };

    checkPaymentUpdate = (data) => {
        const {status} = data;
        if(status === 'REDIRECTION') {
            const confirmationDatalayerInfoCallback = this.CommonsSessionStorageService.get('confirmationDatalayerInfo');
            this.CommonsSessionStorageService.set('confirmationDatalayerCallBack', confirmationDatalayerInfoCallback);
            this.CommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT, { contextId: this.pmtContext, status: CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT_STATUS_INIT });
        } else {
            this.CommonsSessionStorageService.remove(CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT);
        }
    };

    boardingCardsRedirect = () => {
        this.IbCheckinRedirectionUtilsService.path( CheckinAppConstants.PAGES_ROUTES.BOARDING_CARDS );
        this.CommonsSessionStorageService.remove( CheckinAppConstants.STORAGE_KEYS.PMT_REDIRECTION_CONTEXT );
    };

    private generalErrorCase =  (): void => {
        this.returnToOld.emit();
    };

    checkShowVoucher = () => {
        const headerModelStorage = this.CommonsSessionStorageService.get<any>('headerModel');

        const validAncilliaries = [
            'insurance',
            'globickTransfers',
            'globickActivities',
            'insuranceAllianzFusionInfo'
        ];

        const listOfAncilliaries = {
            'baggages': 'hasBaggage',
            'seats': 'hasSeats',
            'insurance': 'hasInsurance',
            'flexibilization': 'hasFlexibilization',
            'upgrading': 'hasUpgrading',
            'speqs': 'hasSpeqs',
            'priorityBoarding': 'hasPriorityBoarding',
            'globickTransfers': 'hasTransfersGlobick',
            'globickActivities': 'hasActivitiesGlobick',
            'insuranceAllianzFusionInfo': 'hasInsuranceAllianzFusion',
            'othersModel': 'hasElements'
        };

        const shoppingBasketArr = Object.entries(headerModelStorage?.headerModel?.shoppingBasket || []);
        const listOfAncilliariesKeys = Object.keys(listOfAncilliaries);

        let currentIndex = 0;

        while (currentIndex !== shoppingBasketArr.length) {
            let [key, value] = shoppingBasketArr[currentIndex];
            if (listOfAncilliariesKeys.includes(key)) {
                let ancilliarieKeys = Object.keys(value);
                const isWhileEnded = ancilliarieKeys.some(ancilliarieKey => {
                    if (ancilliarieKey === listOfAncilliaries[key] && value[ancilliarieKey] && !validAncilliaries.includes(key)) {
                        this.showVoucher = true;
                        return true;
                    }
                    return false;
                });

                if (isWhileEnded) break;
            }
            currentIndex++;
        }
    };
}
