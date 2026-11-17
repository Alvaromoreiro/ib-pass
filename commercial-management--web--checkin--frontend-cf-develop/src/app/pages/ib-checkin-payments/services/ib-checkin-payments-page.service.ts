import { Injectable } from '@angular/core';
import { CheckinNewPaymentAvailableService } from '../../../shared/http-services/pmt-ppm/ib-new-payment-available.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { CommonsSessionStorageService, CommonsBrowserStorageService } from 'ib-web-commons/utils';

@Injectable()
export class IbCheckinPaymentsPageService {
    constructor (
        private CheckinNewPaymentAvailableService: CheckinNewPaymentAvailableService,
        private sessionStorageService: CommonsSessionStorageService,
        private browserStorageService: CommonsBrowserStorageService
    ) {}

    public checkPaymentsViewType = async () :Promise<'NEW' | 'OLD' | 'EMPTY'> => {
        const storedView =  this.sessionStorageService.get<keyof typeof CheckinAppConstants.PMT_VIEW>(CheckinAppConstants.STORAGE_KEYS.PMT_VIEW_TYPE);
        const forcedView: 'OLD' | 'NEW' | 'CHECK' =  this.browserStorageService.get<'OLD' | 'NEW' | 'CHECK'>('ib-check-in-app.forcePaymentType' ) ?? null;
        if (forcedView !== 'CHECK') {
            return forcedView;
        }
        if (forcedView === null) {
            return CheckinAppConstants.PMT_VIEW.OLD;
        }
        if (storedView) {
            return storedView;
        }
        const view: 'OLD' | 'NEW' = await this.callPaymentsViewTypeService();
        this.sessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.PMT_VIEW_TYPE, view);
        return view;
    };

    private callPaymentsViewTypeService = async (): Promise<'OLD' | 'NEW'> => {
        try {
            const data = await this.CheckinNewPaymentAvailableService.callPromised();
            return (data.available ? CheckinAppConstants.PMT_VIEW.NEW : CheckinAppConstants.PMT_VIEW.OLD);
        } catch {
            return CheckinAppConstants.PMT_VIEW.OLD;
        }
    };
}
