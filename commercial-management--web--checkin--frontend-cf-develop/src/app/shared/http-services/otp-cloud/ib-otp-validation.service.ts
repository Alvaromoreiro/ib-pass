import { Inject, Injectable } from '@angular/core';
import { AJSRootScope } from 'ib-web-commons/utils';
import { IbCBaseRestService } from 'ib-web-commons/proxies';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError } from 'rxjs';
import { OtpError, OtpRequest, OtpResponse } from 'src/app/core/models/ib-pmt-voucher-otp-models';
import { CheckinAncillariesConstants } from '@src/app/core/constants/ib-ancillaries-constants';


interface OtpRequestParams {
    otpCode: string, sessionToken: string
}
@Injectable({providedIn: 'root'})
export class OtpValidationService {
    constructor (
        private proxy: IbCBaseRestService,
        @Inject(AJSRootScope) private $rootScope: any
    ){}
    private call = ({otpCode, sessionToken}: OtpRequestParams) => {
        const endpoint = this.$rootScope.otpServicesURI + CheckinAncillariesConstants.DEFAULT_ENDPOINTS.OTP_VALIDATE;
        const requestData: OtpRequest = {
            'data': {
                'otpCode': otpCode
            }
        };
        const observableServiceCall = this.proxy.post<OtpResponse|OtpError>(endpoint,
            requestData
            , {headers:   {
                'session_token': sessionToken,
                'Referrer-Policy': 'strict-origin'
            }});
        return observableServiceCall.pipe(
            catchError((resp:HttpErrorResponse) => {
                throw resp.error.metadata.errors[0];
            }));
    };
    
    public validate (otpParams: OtpRequestParams) : Promise<any> {
        return firstValueFrom(this.call(otpParams));
    }
    


}