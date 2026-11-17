import { Inject, Injectable } from '@angular/core';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { AJSCommonsGenericProxyService, AJSCommonsGenericProxyServiceType } from '@src/app/shared/services/ib-proxy/commons-proxy-bridge.service';

@Injectable({
    providedIn: 'root'
})
export class IbCheckinVoucherService {
    constructor (
        @Inject(AJSCommonsGenericProxyService) private commonsGenericProxyService: AJSCommonsGenericProxyServiceType
    ) {}

    public async checkVoucherCode (voucherCode: string, flowId: string, contactData): Promise<any> {
        const url = this.constructUrl('checkVoucherCodeServiceURI', 'checkVoucherCodeServiceParamsURI', voucherCode, flowId);
        const [filteredContactData] = contactData.filter(data => data.disruptionContact?.email != undefined);
        const email = filteredContactData?.disruptionContact?.email ?? 'email@email.com';
        return this.commonsGenericProxyService.postGeneric(url, {email: email});
    }

    public deleteVoucherCode (voucherCode: string, flowId: string): angular.IPromise<CommonsServiceTypes.CommonsProxyResponse | CommonsServiceTypes.CommonsErrorProxyResponse> {
        const url = this.constructUrl('checkVoucherCodeServiceURI', 'deleteVoucherCodeServiceParamsURI', voucherCode, flowId);
        return this.commonsGenericProxyService.deleteGeneric(url);
    }

    public async validateVoucherCodeOtp (flowId, voucherCode, otpSessionId, contactData): Promise<any> {
        const url = this.constructUrl('checkVoucherCodeServiceURI', 'checkPostVoucherCodeParamsURI', voucherCode, flowId, otpSessionId);
        return this.commonsGenericProxyService.postGeneric(url, {email: contactData[0].disruptionContact?.email});
    }

    private constructUrl (endpointKey: string, paramsKey: string, voucherCode: string, flowId: string, otpSessionId?: string): string {
        const endpointUrl = CheckinAppConstants.DEFAULT_ENDPOINTS[endpointKey];
        const params = CheckinAppConstants.PARAMS[paramsKey]
            .replace('{flowId}', flowId)
            .replace('{voucherCode}', voucherCode)
            .replace('{otpSessionId}', otpSessionId);
        return `${endpointUrl}${params}`;
    }
}
