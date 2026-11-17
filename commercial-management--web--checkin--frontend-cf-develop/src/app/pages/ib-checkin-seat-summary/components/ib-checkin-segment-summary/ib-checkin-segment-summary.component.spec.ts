import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CommonsSessionStorageService
} from 'ib-web-commons/utils';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { IbCheckinSegmentSummaryComponent } from './ib-checkin-segment-summary.component';
import { mockSegmentInfo } from '@test/unit/app/pages/ib-checkin-seat-summary/mocks/seat-summary.mocks';
import { IbCheckinSeatSummaryDigitalDataService } from '@src/app/pages/ib-checkin-seat-summary/services/ib-checkin-seat-summary-digital-data.service';
import { CKISeatSummaryEventsEnum } from '@src/app/core/constants/ib-checkin-seat-summary-constants';

@Pipe({
    name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = 'translate';

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

describe('IbCheckinSegmentSummaryComponent', () => {
    let component: IbCheckinSegmentSummaryComponent;
    let fixture: ComponentFixture<IbCheckinSegmentSummaryComponent>;

    let fakeCommonsSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let fakeIbCheckinRedirectionUtilsService: jasmine.SpyObj<IbCheckinRedirectionUtilsService>;
    let fakeIbCheckinSeatSummaryDigitalDataService: jasmine.SpyObj<IbCheckinSeatSummaryDigitalDataService>;

    beforeEach(async () => {
        fakeCommonsSessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get', 'set', 'remove']);
        fakeIbCheckinRedirectionUtilsService = jasmine.createSpyObj('IbCheckinRedirectionUtilsService', ['path']);
        fakeIbCheckinSeatSummaryDigitalDataService = jasmine.createSpyObj('IbCheckinSeatSummaryDigitalDataService', ['handleButtonEvents']);

        await TestBed.configureTestingModule({
            declarations: [IbCheckinSegmentSummaryComponent, TranslatePipeMock],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: CommonsSessionStorageService,
                    useValue: fakeCommonsSessionStorageService
                },
                {
                    provide: IbCheckinRedirectionUtilsService,
                    useValue: fakeIbCheckinRedirectionUtilsService
                },
                {
                    provide: IbCheckinSeatSummaryDigitalDataService,
                    useValue: fakeIbCheckinSeatSummaryDigitalDataService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinSegmentSummaryComponent);
        component = fixture.componentInstance;

        component.segmentInfo = mockSegmentInfo;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('changeSeats', () => {
        it('should set segment information and showSeatMap in sessionStorage', () => {
            component.changeSeats();

            expect(fakeCommonsSessionStorageService.set).toHaveBeenCalledTimes(3);
            expect(fakeCommonsSessionStorageService.set).toHaveBeenCalledWith('showSeatMap', true);
            expect(fakeCommonsSessionStorageService.set).toHaveBeenCalledWith('seatMapSegment', { segmentId: component.segmentInfo.id, pasId: component.segmentInfo.passengers[0].id });
            expect(fakeCommonsSessionStorageService.set).toHaveBeenCalledWith('nextStepAllowed', false);
        });

        it('should redirect to ckianc page', () => {
            component.changeSeats();

            expect(fakeIbCheckinRedirectionUtilsService.path).toHaveBeenCalledWith('/ckianc');
        });

        it('should set the correct GA4 event', () => {
            component.changeSeats();

            expect(fakeIbCheckinSeatSummaryDigitalDataService.handleButtonEvents).toHaveBeenCalledWith(CKISeatSummaryEventsEnum.CHANGE_SEATS);
        })
    });
});