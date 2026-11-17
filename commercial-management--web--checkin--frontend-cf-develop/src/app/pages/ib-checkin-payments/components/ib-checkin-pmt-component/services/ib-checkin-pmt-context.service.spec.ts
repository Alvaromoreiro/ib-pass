import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { AJSCommonsGenericProxyServiceType } from '@src/app/shared/services/ib-proxy/commons-proxy-bridge.service';
import { IbCheckInHttpUtilsService } from '@src/app/shared/services/ib-utils/ib-check-in-http-utils.service';
import { IbCheckinPmtContextService } from './ib-checkin-pmt-context.service';

describe('IbCheckinPmtContextService', () => {
    let service: IbCheckinPmtContextService;
    let httpUtilsService: jasmine.SpyObj<IbCheckInHttpUtilsService>;
    let proxyService: jasmine.SpyObj<AJSCommonsGenericProxyServiceType>;

    beforeEach(() => {
        httpUtilsService = jasmine.createSpyObj<IbCheckInHttpUtilsService>('IbCheckInHttpUtilsService', ['refreshToken']);
        proxyService = jasmine.createSpyObj<AJSCommonsGenericProxyServiceType>('CommonsGenericProxyService', ['postGeneric']);
        service = new IbCheckinPmtContextService(httpUtilsService, proxyService);
    });

    describe('getPaymentContextId', () => {
        it('should refresh the token, request the payment context, and return its context ID', async () => {
            const flowId = 'flow-123';
            const contextId = 'context-456';
            const requestPayload = {
                redirection: {
                    success: { url: 'string', data: 'string', method: 'string' },
                    failure: { url: 'string', data: 'string', method: 'string' }
                }
            };
            proxyService.postGeneric.and.resolveTo({ data: { contextId } });

            const result = await service.getPaymentContextId(flowId);

            expect(httpUtilsService.refreshToken).toHaveBeenCalledTimes(1);
            expect(proxyService.postGeneric).toHaveBeenCalledOnceWith(
                CheckinAppConstants.DEFAULT_ENDPOINTS.getPaymentContextURI.replace('{{flowId}}', flowId),
                requestPayload
            );
            expect(result).toBe(contextId);
        });

        it('should not request the payment context when token refresh fails', async () => {
            const refreshError = new Error('Token refresh failed');
            httpUtilsService.refreshToken.and.rejectWith(refreshError);

            await expectAsync(service.getPaymentContextId('flow-123')).toBeRejectedWith(refreshError);

            expect(proxyService.postGeneric).not.toHaveBeenCalled();
        });

        it('should propagate errors from the payment context request', async () => {
            const requestError = new Error('Payment context request failed');
            proxyService.postGeneric.and.rejectWith(requestError);

            await expectAsync(service.getPaymentContextId('flow-123')).toBeRejectedWith(requestError);

            expect(httpUtilsService.refreshToken).toHaveBeenCalledTimes(1);
        });
    });
});