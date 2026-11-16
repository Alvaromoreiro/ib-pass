import { Inject, Injectable } from '@angular/core';
import { MmbHttpUtilsService } from '@src/components/services/Utils/ib-Mmb-http-utils.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AJSCommonsGenericProxyService, AJSCommonsGenericProxyServiceType } from '../../../../services/http/commons-proxy-bridge.service';

@Injectable()
export class IbMmbPaymentComponentService {
    constructor(
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private MmbHttpUtilsService: MmbHttpUtilsService,
        @Inject(AJSCommonsGenericProxyService) private CommonsGenericProxyService: AJSCommonsGenericProxyServiceType
    ) { }

    public getPaymentContextId = async (flowApp: string): Promise<string> => {
        await this.MmbHttpUtilsService.refreshToken();
        const flowId: string = this.CommonsSessionStorageService.get('flowId');
        try {
            if (flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
                return await this.getVcPaymentContext(flowId);
            }
            return await this.getAncillariesPaymentContext(flowId);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[IbMmbPaymentComponentService] contextId error', { flowApp, flowId, error });
            throw error; 
        }
    };

    private getVcPaymentContext = async (flowId: string): Promise<string> => {
        const { getPaymentContextURI } = MmBAppConstants.DEFAULT_ENDPOINTS;
        const endpoint = getPaymentContextURI.replace('{{flowId}}', flowId);
        const resp = await this.CommonsGenericProxyService.getGeneric(endpoint);
        return resp?.data?.contextId;
    };

    private getAncillariesPaymentContext = async (flowId: string): Promise<string> => {
        const { getPaymentContextAncillariesURI } = MmBAppConstants.DEFAULT_ENDPOINTS;
        const endpoint = getPaymentContextAncillariesURI.replace('{{flowId}}', flowId);
        const resp = await this.CommonsGenericProxyService.postGeneric(endpoint, {
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
        return resp?.data?.contextId;
    };
}
