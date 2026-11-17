import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { CheckinAppConstants } from '../../../../../../components/routing/ib-check-in-constants';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { PaymentComponentConfig } from '../../../../../core/models/ib-checkin-payments/ib-checkin-payments-model';
import { PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';

@Injectable({providedIn: 'root'})
export class IbCheckInPmtFormService {
    private paymentWebComponent = null;
    private readonly INDEX_URL = `${CheckinAppConstants.paymentsComponentURI}index.esm.js`;
    private readonly COMPONENT_ESM  = `${CheckinAppConstants.paymentsComponentURI}payment-component.esm.js`;
    public priceUpdateEmitter = new EventEmitter<PriceSubscriptionModel>();
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService
    ) {}
    private importWebComponent = async () => {
        const [PaymentWebComponentModule] = await Promise.all(
            [
                import(/* webpackIgnore: true */ this.INDEX_URL),
                import(/* webpackIgnore: true */ this.COMPONENT_ESM)
            ]
        );
        const {PaymentWebComponent} = PaymentWebComponentModule;
        this.paymentWebComponent = new PaymentWebComponent();
        return this.paymentWebComponent;
    };
    public getNewPaymentComponent = async (componentConfig: PaymentComponentConfig) => {
        if (this.paymentWebComponent === null) {
            await this.importWebComponent();
        }
        await this.paymentWebComponent.init(componentConfig);
        return this.paymentWebComponent;
    };
    public getPriceFormatted = ( price ) => {
        const currency = this.CommonsSessionStorageService.get( 'currency' );
        return this.CurrencyService.formatPrice( currency, price, true, false );
    };
    public updatePrice (data: PriceSubscriptionModel): void {
        this.priceUpdateEmitter.emit(data);
    }
}
