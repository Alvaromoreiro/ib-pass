import { Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { MmbNewPaymentAvailableService } from './ib-new-payment-available.service';
import { PaymentViewType } from '../enums/ib-Mmb-payments-enum';

@Injectable()
export class IbMmbPaymentsPageService {
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private MmbNewPaymentAvailableService: MmbNewPaymentAvailableService
    ) {}

    public checkPaymentsViewType = async (flowApp: string) :Promise<string> => {
        const type: string  = await this.callPaymentsViewTypeService(flowApp);
        this.CommonsSessionStorageService.set(MmBAppConstants.STORAGE_KEYS.PAYMENTS_VIEWTYPE, type);
        return type;
    };

    private callPaymentsViewTypeService = (flowApp: string) : Promise <string>  => {
        return this.MmbNewPaymentAvailableService.callPromised()
            .then (
                (data) => {
                    return (data.available? PaymentViewType.NEW : (flowApp === 'MMBVC' ? PaymentViewType.OLDVC : PaymentViewType.OLD));
                }
            ).catch(() => PaymentViewType.OLD);
    };
}
