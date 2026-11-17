import { TestBed } from '@angular/core/testing';
import { IbCheckinSeatSummaryDigitalDataService } from './ib-checkin-seat-summary-digital-data.service';
import { AJSDigitalDataService, AJSDigitalDataServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-digital-data-service-bridge.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { DigitalDataQuadrigam } from '@src/app/core/constants/ib-digital-data-constants';
import { EventType } from '@src/app/core/models/generic-models/ib-digital-data.models';
import { CkiDatalayerConstants } from '@src/app/shared/services/ib-datalayer/ib-cki-datalayer-constants';
import { CKISeatSummaryEventsEnum } from '@src/app/core/constants/ib-checkin-seat-summary-constants';

describe('IbCheckinSeatSummaryDigitalDataService', () => {
    let service: IbCheckinSeatSummaryDigitalDataService;
    let mockDigitalDataService: jasmine.SpyObj<AJSDigitalDataServiceType>;
    let mockDatalayerUtilsService: jasmine.SpyObj<AJSDatalayerUtilsServiceType>;

    beforeEach(() => {
        mockDigitalDataService = jasmine.createSpyObj('DigitalDataService', ['emitViewEvent']);
        mockDatalayerUtilsService = jasmine.createSpyObj('DatalayerUtilsService', ['setTrackingCode', 'updateDatalayerEvent']);

        TestBed.configureTestingModule({
            providers: [
                IbCheckinSeatSummaryDigitalDataService,
                { provide: AJSDigitalDataService, useValue: mockDigitalDataService },
                { provide: AJSDatalayerUtilsService, useValue: mockDatalayerUtilsService }
            ]
        });

        service = TestBed.inject(IbCheckinSeatSummaryDigitalDataService);
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });
    });

    describe('emitViewEvent', () => {
        it('should call digital data emitViewEvent', () => {
            service.emitViewEvent();

            expect(mockDigitalDataService.emitViewEvent).toHaveBeenCalled();
        });
    });

    describe('setSeatSummaryDigitalData', () => {
        it('should call setTrackingCode with the correct quadrigam', () => {
            service.setSeatSummaryDigitalData();

            expect(mockDatalayerUtilsService.setTrackingCode).toHaveBeenCalledWith(DigitalDataQuadrigam.SEAT_SUMMARY)
        });
    });

    describe('handleEventsSeatSummary', () => {
        it('update datalayer event with the correct event information', () => {
            const expectedEvent: EventType = CkiDatalayerConstants.SEAT_SUMMARY.AUDIENCE_STATE;
            const eventLabel = 'Audiencia OK';

            service.handleEventsSeatSummary(eventLabel);

            expect(mockDatalayerUtilsService.updateDatalayerEvent).toHaveBeenCalledWith(expectedEvent.eventCategory, expectedEvent.eventAction, eventLabel, expectedEvent.eventName);
        });

        it('update datalayer event with the default event information if not have param', () => {
            const expectedEvent: EventType = CkiDatalayerConstants.SEAT_SUMMARY.AUDIENCE_STATE;

            service.handleEventsSeatSummary();

            expect(mockDatalayerUtilsService.updateDatalayerEvent).toHaveBeenCalledWith(expectedEvent.eventCategory, expectedEvent.eventAction, expectedEvent.eventLabel, expectedEvent.eventName);
        });
    });

    describe('handleButtonEvents', () => {
        it('should update datalayer with the correct event from params', () => {
            const eventType = CKISeatSummaryEventsEnum.ADD_EXTRAS;
            const { eventAction, eventCategory, eventLabel, eventName } = CkiDatalayerConstants.SEAT_SUMMARY[eventType];

            service.handleButtonEvents(eventType);

            expect(mockDatalayerUtilsService.updateDatalayerEvent).toHaveBeenCalledWith(eventCategory, eventAction, eventLabel, eventName);
        });
    });
});