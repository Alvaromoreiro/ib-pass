import { Component, Inject, OnInit } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';

import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { IbCheckinSeatSummaryService } from './services/ib-checkin-seat-summary.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { IbCheckinSeatSummaryDigitalDataService } from './services/ib-checkin-seat-summary-digital-data.service';
import { AJSModalService, AJSModalServiceType } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { CKISeatSummaryEventsEnum } from '@src/app/core/constants/ib-checkin-seat-summary-constants';
import { CheckinFlowService } from '@src/app/shared/services/checkin-flow.service';

@Component({
    selector: 'ib-checkin-seat-summary',
    templateUrl: './ib-checkin-seat-summary-page.component.html',
    styleUrls: ['./ib-checkin-seat-summary-page.scss']
})

export class IbCheckinSeatSummaryPageComponent implements OnInit {  
    showSeatSummaryPage: boolean = true;
    segmentsSummary: CkiSeatSummary.ISegment[] = [];
    goToAncillariesAvailable: boolean = false;

    constructor (
        private sessionStorageService: CommonsSessionStorageService,
        private IbCheckinRedirectionUtilsService: IbCheckinRedirectionUtilsService,
        private IbCheckinSeatSummaryService: IbCheckinSeatSummaryService,
        private IbCheckinSeatSummaryDigitalDataService: IbCheckinSeatSummaryDigitalDataService,
        @Inject(AJSModalService) private ModalService: AJSModalServiceType,
        private checkinFlowService: CheckinFlowService
    ) {}

    ngOnInit (): void {
        this.sessionStorageService.set('actualStepFlow', 'ckiacpt');
        this.warnUserOnBackPressed();

        this.segmentsSummary = this.IbCheckinSeatSummaryService.getSegmentsInformation();

        this.ModalService.isNotWaiting();

        this.goToAncillariesAvailable = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.ANCILLARIES_INFO) ? true : false;

        this.IbCheckinSeatSummaryDigitalDataService.setSeatSummaryDigitalData();
        this.sessionStorageService.remove('showSeatMap');
        this.IbCheckinSeatSummaryDigitalDataService.emitViewEvent();
    }

    goTo (quadrigam: CkiSeatSummary.GoToPageType) {
        const eventType = CKISeatSummaryEventsEnum.ADD_EXTRAS;
        const goToQuadrigam: CkiSeatSummary.GoToPageType = this.goToAncillariesAvailable ? quadrigam : 'ibecbp';

        this.IbCheckinSeatSummaryDigitalDataService.handleButtonEvents(eventType);
        this.sessionStorageService.set('nextStepAllowed', false);
        this.IbCheckinRedirectionUtilsService.path(`/${goToQuadrigam}`);
    }

    warnUserOnBackPressed () {
        this.sessionStorageService.set('nextStepAllowed', true);
        this.checkinFlowService.warnUserOnBackPressed();
    }
}

downgradeToAJSComponent(
    'ibCheckinSeatSummary',
    {
        component: IbCheckinSeatSummaryPageComponent
    },
    'ib-checkin-seat-summary-page-module',
    []
);
