import * as angular from 'angular';
import dayjs from 'dayjs';
import isoWeekday from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeekday);

namespace ImportOrderDataClass {

    export class SegmentAVModel implements SliceData.Segment {
        type: string;
        mmbAllowed: boolean;
        ckiStatus: SliceData.CkiStatus;
        noShow: boolean;
        flyNow: boolean;
        flown: boolean;
        departure: SliceData.Airport;
        arrival: SliceData.Airport;
        departureCity: SliceData.City;
        arrivalCity: SliceData.City;
        flight: SliceData.Flight;
        cabin: SliceData.Cabin;
        overnight: boolean;
        id: string;
        duration: number;
        waitingTime: number;
        operatorLocator?: null;
        stop?: null;
        departureDateTime: string;
        departureUtcDateTime: string;
        arrivalDateTime: string;
        arrivalUtcDateTime: string;
        status: SliceData.SegmentStatus;
        warnings: SliceData.IWarning[];
        //Own properties
        departureDateParsed: SegmentData.IModelDateParsed;
        arrivalDateParsed: SegmentData.IModelDateParsed;
        companyURL: string;
        departureDateTimeParsed: string;
        arrivalDateTimeParsed: string;
        durationParsed: string;//getParsedDate del duration
        fareFamilyConditions: SegmentData.IModelFareFamily[];
        segmentId: string;
        sliceId: string;
        waitingTimeParsed: string;

        constructor () {
        }

        setParsedFamilyCondition = (fareFamily: FareData.FareFamily[]) => {
            //cabin.fareFamily contra commercialCode del bookingInfo
            this.fareFamilyConditions = [];
            fareFamily.filter((fare) => {
                return fare.commercialCode === this.cabin.fareFamily;
            }).map((fare) => {
                fare.conditions.map((condition: FareData.FareCondition) => {
                    const parsed: SegmentData.IModelFareFamily = {
                        cabin: fare.commercialName,
                        cabinType: fare.cabinType,
                        code: condition.code,
                        name: condition.name,
                        title: condition.extendedInfo.title,
                        message: condition.extendedInfo.message,
                        units: condition.units
                    };
                    this.fareFamilyConditions.push(parsed);
                });
            });
        };

        setSliceId = (sliceId: string) => {
            this.sliceId = sliceId;
        };

        static getParsedDate = (date: string): SegmentData.IModelDateParsed => {
            const parsed: SegmentData.IModelDateParsed = {
                dateTime: date.indexOf(' ') !== -1 ? date.split(' ')[1] : '',
                weekDay: dayjs(date).isoWeekday().toString(),
                day: dayjs(date).date(),
                monthNumber: dayjs(date).month(),
                month: dayjs(date).month().toString(),
                year: dayjs(date).year(),
                originalDate: dayjs(date).format(),
                formatedDate: dayjs(date).format()
            };
            return parsed;
        };

    }
}
angular.module('ib-MmB-app').constant('ImportOrderDataClass', ImportOrderDataClass);
export type ImportOrderDataClass = typeof ImportOrderDataClass;
