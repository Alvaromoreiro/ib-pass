import angular from 'angular';
import { fakeData1, fakeData2, fakeData3, fakeData4, fakeData5, fakeCopy1, fakeCopy2, fakeCopy3, fakeCopy4, fakeCopy5, fakeCopyRemove, fakeExpected1, fakeExpected2 } from '../mocks/ib-MmB-simulator-booking-availability-transformer-filter.mock';
describe('SimulatorBookingAvailabilityTransformerFilter test', () => {

    let SimulatorBookingAvailabilityTransformerFilter;

    beforeEach(() => {
        angular.mock.module('ib-MmB-simulator-booking-availability-module', () => {});
        inject((_SimulatorBookingAvailabilityTransformerFilter_) => {
            SimulatorBookingAvailabilityTransformerFilter = _SimulatorBookingAvailabilityTransformerFilter_;
        });
    });

    describe('when applyFilter()', () => {

        it('With params data and copy', () => {
            let fakeData = angular.copy(fakeData1);
            let fakeCopy = angular.copy(fakeCopy1);
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual([]);
        });
        it('With params data and copy2', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual([]);
        });
        it('With params data and copy 3', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            fakeData.filter.cabin = null;
            fakeData.filter.scale = [];
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual([]);
        });
        it('With params data and copy 4', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            fakeData.filter.cabin = null;
            fakeData.filter.scale = [];
            fakeData.filter.company = null;
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual([]);
        });
        it('With params data and copy 5', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            fakeData.filter.cabin = null;
            fakeData.filter.scale = [];
            fakeData.filter.company = null;
            fakeData.filter.rangeHoursArrival = null;
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual([]);
        });
        it('With params data and copy 6', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            fakeData.filter.cabin = null;
            fakeData.filter.scale = [];
            fakeData.filter.company = null;
            fakeData.filter.rangeHoursArrival = null;
            fakeData.filter.rangeHoursDeparture = null;
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual(fakeExpected1);
        });

        it('With params data and copy 7', () => {
            let fakeData = angular.copy(fakeData3);
            let fakeCopy = angular.copy(fakeCopy3);
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual([]);
        });
        it('With params data and copy 8 remove', () => {
            let fakeData = angular.copy(fakeData3);
            let fakeCopy = angular.copy(fakeCopyRemove);
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual([]);
        });

        it('With params data and copy 9 rangeprice', () => {
            let fakeData = angular.copy(fakeData4);
            let fakeCopy = angular.copy(fakeCopy4);
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual(fakeExpected2);
        });
        it('With params data and copy 9 rangeprice', () => {
            let fakeData = angular.copy(fakeData5);
            let fakeCopy = angular.copy(fakeCopy5);
            let result = SimulatorBookingAvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
            expect(result).toEqual(fakeExpected2);
        });
    });
});
