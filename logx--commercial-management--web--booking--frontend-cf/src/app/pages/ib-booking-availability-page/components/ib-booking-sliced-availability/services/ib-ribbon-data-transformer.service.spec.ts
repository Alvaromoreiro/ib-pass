import { TestBed } from '@angular/core/testing';
import { RibbonDataTransformer } from './ib-ribbon-data-transformer.service';
import { AJSIbBookingAvailabilityUtilsService } from '@src/app/shared/services/ib-booking-availability/ib-booking-availability-utils.service.bridge';
import { AJSIbOriginDestinationInfoUtilsService } from '@src/app/shared/services/ib-booking-availability/upgraded/ib-origin-destination-info-utils-service-bridge.service';

describe('RibbonDataTransformer', () => {
    let service: RibbonDataTransformer;

    const minDate = new Date('2024-01-10');
    const maxDate = new Date('2024-01-25');
    const fakeSlidesDataResponse = { slides: [], currentInitialSlide: 0, selectedSlide: 0, currentSlides: [] };
    const mockCurrency = { currencySymbol: '€' } as AvailabilityTransformerModel.Currency;
    const mockCalendarInfo = {
        calendarRibbon: {
            outBoundRow: { cells: [{ serviceDate: '2024-01-15', price: 100 }] },
            inBoundRow: { cells: [{ serviceDate: '2024-01-22', price: 120 }] }
        }
    } as unknown as AvailabilityTransformerModel.CalendarInfo;

    const fakeAvailabilityUtils = {
        getOriginDestinationLimitDates: jasmine.createSpy('getOriginDestinationLimitDates').and.returnValue({ minDate, maxDate })
    };
    const fakeOriginDestinationInfoUtils = {
        getSlidesData: jasmine.createSpy('getSlidesData').and.returnValue(fakeSlidesDataResponse)
    };

    beforeEach(() => {
        fakeAvailabilityUtils.getOriginDestinationLimitDates.calls.reset();
        fakeOriginDestinationInfoUtils.getSlidesData.calls.reset();
        TestBed.configureTestingModule({
            providers: [
                RibbonDataTransformer,
                { provide: AJSIbBookingAvailabilityUtilsService, useValue: fakeAvailabilityUtils },
                { provide: AJSIbOriginDestinationInfoUtilsService, useValue: fakeOriginDestinationInfoUtils }
            ]
        });
        service = TestBed.inject(RibbonDataTransformer);
    });

    describe('transformSlicedRibbonState', () => {
        it('should return slidesData and originCalendarInfo combining outbound and inbound cells', () => {
            const result = service.transformSlicedRibbonState(mockCalendarInfo, 0, mockCurrency);

            expect(result.slidesData).toEqual(fakeSlidesDataResponse as any);
            expect(result.originCalendarInfo.length).toEqual(2);
            expect(fakeAvailabilityUtils.getOriginDestinationLimitDates).toHaveBeenCalledWith(0);
            expect(fakeOriginDestinationInfoUtils.getSlidesData).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    originCalendarData: mockCalendarInfo.calendarRibbon.outBoundRow.cells,
                    minDate,
                    maxDate,
                    originDestinationIndex: 0
                }),
                mockCurrency
            );
        });

        it('should use inbound cells when index is 1', () => {
            service.transformSlicedRibbonState(mockCalendarInfo, 1, mockCurrency);

            expect(fakeAvailabilityUtils.getOriginDestinationLimitDates).toHaveBeenCalledWith(1);
            expect(fakeOriginDestinationInfoUtils.getSlidesData).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    originCalendarData: mockCalendarInfo.calendarRibbon.inBoundRow.cells,
                    originDestinationIndex: 1
                }),
                mockCurrency
            );
        });

        it('should return empty originCalendarInfo when ribbon cells are null', () => {
            const emptyCalendarInfo = {
                calendarRibbon: { outBoundRow: null, inBoundRow: null }
            } as unknown as AvailabilityTransformerModel.CalendarInfo;

            const result = service.transformSlicedRibbonState(emptyCalendarInfo, 0, mockCurrency);

            expect(result.originCalendarInfo.length).toEqual(0);
        });
    });
});
