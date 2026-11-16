import { Inject, Injectable } from '@angular/core';
import { AJSIbBookingAvailabilityUtilsService, AJSIbBookingAvailabilityUtilsServiceType } from '@src/app/shared/services/ib-booking-availability/ib-booking-availability-utils.service.bridge';
import { AJSIbOriginDestinationInfoUtilsService, AJSIbOriginDestinationInfoUtilsServiceType } from '@src/app/shared/services/ib-booking-availability/upgraded/ib-origin-destination-info-utils-service-bridge.service';

@Injectable({
    providedIn: 'root'
})
export class RibbonDataTransformer {
    constructor (
        @Inject(AJSIbBookingAvailabilityUtilsService) private availabilityUtilsBridge: AJSIbBookingAvailabilityUtilsServiceType,
        @Inject(AJSIbOriginDestinationInfoUtilsService) private originDestinationInfoUtilsBridge: AJSIbOriginDestinationInfoUtilsServiceType
    ) {
    }

    private getOutboundCells = (calendarInfo: AvailabilityTransformerModel.CalendarInfo) => {
        return calendarInfo?.calendarRibbon?.outBoundRow?.cells || null;
    };

    private getInboundCells = (calendarInfo: AvailabilityTransformerModel.CalendarInfo) => {
        return calendarInfo?.calendarRibbon?.inBoundRow?.cells || null;
    };

    private getRibbonCellsByIndex = (calendarInfo: AvailabilityTransformerModel.CalendarInfo, index: number) => {
        return index > 0 ? this.getInboundCells(calendarInfo) || this.getOutboundCells(calendarInfo) : this.getOutboundCells(calendarInfo);
    };

    private appendCellsIfPresent = (originCalendarInfo: AvailabilityTransformerModel.Cell[], cells): void => {
        if (cells) {
            originCalendarInfo.push(cells);
        }
    };

    private transformRibbonData = (calendarInfo: AvailabilityTransformerModel.CalendarInfo, index: number): AvailabilityTransformerModel.CalendarData => {
        const cells = this.getRibbonCellsByIndex(calendarInfo, index);
        const limitDates = this.availabilityUtilsBridge.getOriginDestinationLimitDates(index);
        return {
            originCalendarData: cells as unknown as AvailabilityTransformerModel.Cell[],
            minDate: limitDates.minDate,
            maxDate: limitDates.maxDate,
            originDestinationIndex: index
        };
    };

    private transformRibbonSlides = (
        calendarInfo: AvailabilityTransformerModel.CalendarInfo,
        index: number,
        currency: AvailabilityTransformerModel.Currency
    ): AvailabilityTransformerModel.SlidesDataResponse => {
        const transformedRibbonData = this.transformRibbonData(calendarInfo, index);
        return this.originDestinationInfoUtilsBridge.getSlidesData(transformedRibbonData, currency);
    };

    /**
     * Builds sliced ribbon view-model in one pass.
     * @param {CalendarInfo} calendarInfo - The calendar data received from the ribbon service
     * @param {number} index - The origin destination index (0 for outbound, 1 for inbound)
     * @param {Currency} currency - The selected origin destination currency
     * @returns {{ slidesData: SlidesDataResponse, originCalendarInfo: Cell[] }}
     */
    public transformSlicedRibbonState = (
        calendarInfo: AvailabilityTransformerModel.CalendarInfo,
        index: number,
        currency: AvailabilityTransformerModel.Currency
    ): { slidesData: AvailabilityTransformerModel.SlidesDataResponse; originCalendarInfo: AvailabilityTransformerModel.Cell[] } => {
        return {
            slidesData: this.transformRibbonSlides(calendarInfo, index, currency),
            originCalendarInfo: this.getOriginCalendarInfo(calendarInfo)
        };
    };

    private getOriginCalendarInfo = (calendarInfo: AvailabilityTransformerModel.CalendarInfo): AvailabilityTransformerModel.Cell[] => {
        const originCalendarInfo: AvailabilityTransformerModel.Cell[] = [];

        this.appendCellsIfPresent(originCalendarInfo, this.getOutboundCells(calendarInfo));
        this.appendCellsIfPresent(originCalendarInfo, this.getInboundCells(calendarInfo));
        return originCalendarInfo;
    };
}
