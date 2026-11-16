import { Injectable } from '@angular/core';
import { CommonsBrowserStorageService } from 'ib-web-commons/utils';
import { PaymentViewType, PaymentViewTypeValues } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';
import { BookingNewPaymentAvailableService } from '@src/app/shared/http-services/pmt-ppm/ib-new-payment-available.service';
@Injectable()
export class IbBookingPaymentsPageService {
    constructor (
        private BookingNewPaymentAvailableService: BookingNewPaymentAvailableService,
        private CommonsBrowserStorageService: CommonsBrowserStorageService
    ) {}

    public checkPaymentsViewType = async () :Promise<PaymentViewTypeValues> => {
        const forcePaymentFlag =  this.CommonsBrowserStorageService.get<string>('ib-booking-app.forcePaymentType' ) ?? null;
        // Temporal flag to disable payments view type check
        if(forcePaymentFlag !== 'CHECK') {
            return (forcePaymentFlag === PaymentViewType.NEW? PaymentViewType.NEW: PaymentViewType.OLD);
        } else if (forcePaymentFlag === null) {
            return PaymentViewType.OLD;
        }
        return await this.callPaymentsViewTypeService();
        
    };

    private callPaymentsViewTypeService = () : Promise <keyof typeof PaymentViewType>  => {
        return this.BookingNewPaymentAvailableService.callPromised()
            .then (
                (data) => {
                    return (data.available? PaymentViewType.NEW: PaymentViewType.OLD);
                }
            ).catch(() => PaymentViewType.OLD);
    };
}