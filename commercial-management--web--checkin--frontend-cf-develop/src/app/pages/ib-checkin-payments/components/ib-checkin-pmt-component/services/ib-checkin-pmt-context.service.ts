import {  Inject, Injectable } from '@angular/core';
import { AJSCommonsGenericProxyService, AJSCommonsGenericProxyServiceType } from '@src/app/shared/services/ib-proxy/commons-proxy-bridge.service';
import { CheckinAppConstants} from '@src/components/routing/ib-check-in-constants';
import { IbCheckInHttpUtilsService } from '@src/app/shared/services/ib-utils/ib-check-in-http-utils.service';

@Injectable({ providedIn: 'root' })
export class IbCheckinPmtContextService {
    constructor (
        private  IbCheckInHttpUtilsService: IbCheckInHttpUtilsService,
        @Inject(AJSCommonsGenericProxyService) private CommonsGenericProxyService: AJSCommonsGenericProxyServiceType

    ){}
    public getPaymentContextId = async (flowId:string) : Promise<any> => {
        await this.IbCheckInHttpUtilsService.refreshToken();
        const context = await this.CommonsGenericProxyService.postGeneric(CheckinAppConstants.DEFAULT_ENDPOINTS.getPaymentContextURI.replace('{{flowId}}', flowId), {
            'redirection': {
                'success': {
                    'url': 'string',
                    'data': 'string',
                    'method': 'string'
                },
                'failure': {
                    'url': 'string',
                    'data': 'string',
                    'method': 'string'
                }
            }
        });
        return context.data.contextId;
    };
}
