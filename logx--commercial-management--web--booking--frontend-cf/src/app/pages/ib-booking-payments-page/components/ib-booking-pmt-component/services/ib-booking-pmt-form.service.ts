import { Inject, Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import {  PaymentWebComponent } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import { IbPaymentContextService, GetContextIdParams, GetContextResponse } from '@src/app/shared/http-services/sse-orm/ib-payment-context.service';
import { AJSBookingHttpUtilsServiceLegacy } from '@src/app/shared/services/ib-utils/ib-booking-http-utils-bridge.service';

@Injectable({providedIn: 'root'})
export class IbBookingPmtFormService {
    private PaymentWebComponentClass = null;
    private readonly INDEX_URL = `${BookingAppConstants.paymentsComponentURI}index.esm.js`;
    private readonly COMPONENT_ESM  = `${BookingAppConstants.paymentsComponentURI}payment-component.esm.js`;
    constructor (
        private IbPaymentContextService: IbPaymentContextService,
        @Inject(AJSBookingHttpUtilsServiceLegacy) private BookingHttpUtilsService
    ) {}
    private importWebComponent = async () => {
        const [PaymentWebComponentModule] = await Promise.all(
            [
                import(/* webpackIgnore: true */ this.INDEX_URL),
                import(/* webpackIgnore: true */ this.COMPONENT_ESM)
            ]
        );
        this.PaymentWebComponentClass = PaymentWebComponentModule.PaymentWebComponent;
        return this.PaymentWebComponentClass;
    };

    public getNewPaymentComponent = async () => {
        if (this.PaymentWebComponentClass === null) {
            await this.importWebComponent();
        }
        return new this.PaymentWebComponentClass () as PaymentWebComponent;
    };

    public getPaymentContext = async (paymentContextInput: GetContextIdParams): Promise<GetContextResponse> => {
        await this.BookingHttpUtilsService.refreshToken();
        return this.IbPaymentContextService.getPaymentContextId(paymentContextInput);
    };


}
