import { downgradeToAJSService } from 'ib-web-commons/utils';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { BookingSalesforceRxProxy } from '@shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingErrorHandlerService } from '@shared/http-services/error/ib-booking-error-handler.service';
import { EnrolMemberRequestV02 } from '@src/app/core/models/ib-booking-passenger-info/components/ib-booking-register-form-model';

@Injectable({ providedIn: 'root' })
export class IbShortRegisterService {
    constructor (
        private BookingSalesforceRxProxy: BookingSalesforceRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    public enrolMember = (memberData: EnrolMemberRequestV02): Promise<any> => {
        const url = BookingAppConstants.DEFAULT_ENDPOINTS.ENROL_MEMBER_V2;
        return lastValueFrom(this.BookingSalesforceRxProxy.post(url, memberData)
            .pipe(this.IbBookingErrorHandlerService.handleErrorOperator()));
    };
}
downgradeToAJSService('IbShortRegisterService', IbShortRegisterService, 'ib-booking-services-module');