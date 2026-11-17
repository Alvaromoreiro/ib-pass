import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';
import { CloseSessionService } from './ib-close-session-service';

describe('CloseSessionService', () => {
    let service: CloseSessionService;
    let commonsKeepAliveService: jasmine.SpyObj<CommonsKeepAliveService>;
    let sessionConfigService: jasmine.SpyObj<IbSessionConfigService>;

    beforeEach(() => {
        commonsKeepAliveService = jasmine.createSpyObj<CommonsKeepAliveService>('CommonsKeepAliveService', ['closeSession']);
        sessionConfigService = jasmine.createSpyObj<IbSessionConfigService>('IbSessionConfigService', ['getFlowId']);
        service = new CloseSessionService(commonsKeepAliveService, sessionConfigService);
    });

    it('closes the session when a flow ID is available', () => {
        sessionConfigService.getFlowId.and.returnValue('flow-id');

        service.closeSession();

        expect(commonsKeepAliveService.closeSession).toHaveBeenCalledWith('flow-id', true);
    });

    it('does not close the session when no flow ID is available', () => {
        sessionConfigService.getFlowId.and.returnValue(undefined);

        service.closeSession();

        expect(commonsKeepAliveService.closeSession).not.toHaveBeenCalled();
    });
});
