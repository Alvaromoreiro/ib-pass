import { Component, Inject, OnInit } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import {
    AJSCheckinModalService,
    CheckinModalServiceType
} from '../../shared/services/ib-modal/ib-checkin-modal-service-bridge.service';
import { IbCheckinPaymentsPageService } from './services/ib-checkin-payments-page.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';

@Component({
    selector: 'ib-checkin-payments',
    templateUrl: './ib-checkin-payments-page.component.html',
    styleUrls: ['./ib-checkin-payments-page.component.scss'],
    providers: [
        IbCheckinPaymentsPageService
    ]
})

export class IbCheckinPaymentsPageComponent implements OnInit {
    public componentType: 'OLD' | 'NEW' | 'EMPTY';
    constructor (
        @Inject(AJSCheckinModalService) private CheckinModalService: CheckinModalServiceType,
        private IbCheckinPaymentsPageService:IbCheckinPaymentsPageService,
        private sessionStorageService: CommonsSessionStorageService
    ) {}

    async ngOnInit () {
        this.componentType = CheckinAppConstants.PMT_VIEW.EMPTY;
        this.CheckinModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        this.sessionStorageService.set('actualStepFlow', 'ibpurc');
        this.componentType = await this.IbCheckinPaymentsPageService.checkPaymentsViewType();
    }

    public forceOld (){
        this.sessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.PMT_VIEW_TYPE, CheckinAppConstants.PMT_VIEW.OLD);
        this.componentType = CheckinAppConstants.PMT_VIEW.OLD;
    }
}

downgradeToAJSComponent(
    'ibCheckinPayments',
    {
        component: IbCheckinPaymentsPageComponent,
        inputs: [],
        outputs: []
    },
    'ib-checkin-payments-page-module',
    []
);
