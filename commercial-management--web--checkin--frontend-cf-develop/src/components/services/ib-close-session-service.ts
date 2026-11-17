import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';

@Service('ib-checkin-services-module',
    ['CommonsKeepAliveService', 'IbSessionConfigService'])
export class CloseSessionService {

    constructor (
        private CommonsKeepAliveService: CommonsKeepAliveService,
        private IbSessionConfigService: IbSessionConfigService
    ) {
    }

    closeSession = (): void => {
        const checkinId = this.IbSessionConfigService.getFlowId();

        if (checkinId) {
            this.CommonsKeepAliveService.closeSession(checkinId, true);
        }
    };
}