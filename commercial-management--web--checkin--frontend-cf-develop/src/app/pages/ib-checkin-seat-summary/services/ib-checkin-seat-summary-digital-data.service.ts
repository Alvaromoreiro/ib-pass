import { Inject, Injectable } from '@angular/core';
import { CKISeatSummaryEventsEnum } from '@src/app/core/constants/ib-checkin-seat-summary-constants';

import { DigitalDataQuadrigam } from '@src/app/core/constants/ib-digital-data-constants';
import { EventType } from '@src/app/core/models/generic-models/ib-digital-data.models';
import { CkiDatalayerConstants } from '@src/app/shared/services/ib-datalayer/ib-cki-datalayer-constants';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { AJSDigitalDataService, AJSDigitalDataServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-digital-data-service-bridge.service';

@Injectable({ providedIn: 'root' })
export class IbCheckinSeatSummaryDigitalDataService {
    constructor (
        @Inject(AJSDigitalDataService) private DigitalDataService: AJSDigitalDataServiceType,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType
    ) { }

    public emitViewEvent = (): void => {
        this.DigitalDataService.emitViewEvent();
    };

    public setSeatSummaryDigitalData = (): void => {
        this.DatalayerUtilsService.setTrackingCode(DigitalDataQuadrigam.SEAT_SUMMARY);
    };

    public handleEventsSeatSummary (eventLabel?: string) {
        const event: EventType = CkiDatalayerConstants.SEAT_SUMMARY.AUDIENCE_STATE;
        const finalEventLabel = eventLabel ?? event.eventLabel;

        this.DatalayerUtilsService.updateDatalayerEvent(event.eventCategory, event.eventAction, finalEventLabel, event.eventName);
    }

    handleButtonEvents (eventType: CKISeatSummaryEventsEnum) {
        const event: EventType = CkiDatalayerConstants.SEAT_SUMMARY[eventType];
        const { eventAction, eventCategory, eventLabel, eventName } = event;

        this.DatalayerUtilsService.updateDatalayerEvent(eventCategory, eventAction, eventLabel, eventName);
    }
}
