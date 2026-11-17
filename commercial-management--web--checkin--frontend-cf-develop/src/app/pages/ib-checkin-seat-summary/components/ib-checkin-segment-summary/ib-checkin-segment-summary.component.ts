import { Component, Input } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';

import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { IbCheckinSeatSummaryDigitalDataService } from '../../services/ib-checkin-seat-summary-digital-data.service';
import { CKISeatSummaryEventsEnum } from '@src/app/core/constants/ib-checkin-seat-summary-constants';

@Component({
    selector: 'ib-checkin-segment-summary',
    templateUrl: './ib-checkin-segment-summary.component.html',
    styleUrls: ['./ib-checkin-segment-summary.scss']
})
export class IbCheckinSegmentSummaryComponent {
    @Input() segmentInfo: CkiSeatSummary.ISegment;

    constructor (
        private IbCheckinRedirectionUtilsService: IbCheckinRedirectionUtilsService,
        private sessionStorageService: CommonsSessionStorageService,
        private IbCheckinSeatSummaryDigitalDataService: IbCheckinSeatSummaryDigitalDataService
    ) {}

    changeSeats () {
        this.sessionStorageService.set('showSeatMap', true);
        this.sessionStorageService.set('seatMapSegment', { segmentId: this.segmentInfo.id, pasId: this.segmentInfo.passengers[0].id });

        this.sessionStorageService.set('nextStepAllowed', false);
        this.IbCheckinSeatSummaryDigitalDataService.handleButtonEvents(CKISeatSummaryEventsEnum.CHANGE_SEATS);
        this.IbCheckinRedirectionUtilsService.path('/ckianc');
    }
}

downgradeToAJSComponent(
    'ibCheckinSegmentSummary',
    {
        component: IbCheckinSegmentSummaryComponent
    },
    'ib-checkin-seat-summary-page-module',
    []
);
