namespace AvailabilityData {
    namespace AvailabilityDataClass {
        export class flight implements IFlight {
            arrivalCity: SliceData.Airport;
            arrivalCountry: string;
            arrivalDateParsed: dateParsed;
            changeNewDate: Date;
            checked: boolean;
            dateOptions: dateOptions;
            daysToGo: number;
            departureCity: SliceData.Airport;
            departureCountry: string;
            departureDateParsed: dateParsed;
            durationParsed: string;
            newDateSelected: Date;
            parseNewDate: parseNewDate;
            parseNewDateSelected: parseNewDate;
            segments: SegmentData.ISegmentAVModel[];
            stopsNumber: number;
            originalSliceId:string;
            sliceType: sliceRole;

            /**
             * Propagates to the dateOption object the date update event
             * @param date The date updated
             */
            dateUpdateEvent = (date:Date) => {
                this.dateOptions.dateUpdateEvent(this.sliceType, date);
            };

            /**
             * Propagates to the dateOption object the checkbox event
             * @param date The date updated(Nullable)
             */
            checkUpdateEvent = (date?:Date) => {
                this.dateOptions.dateUpdateEvent(this.sliceType, date);
            };

            setSliceType = (index:number) => {
                if (index === 0) {
                    this.sliceType = sliceRole.DEPARTURE_SLICE;
                }else{
                    this.sliceType = sliceRole.RETURN_SLICE;
                }
            };
            static getTimeParsed = (duration:number):string => {
                let durationFormatted:string = '', hours:number = 0, minutes:number = 0;
                if (duration > 0) {
                    hours = Math.floor(duration / 60);
                    minutes = duration % 60;
                    const hoursFormatted = hours < 10 ? ('0' + hours) : hours;
                    durationFormatted = (hours > 0 ? (hoursFormatted + 'h ') : '') + (minutes > 0 ? (minutes + 'min.') : '');
                }
                return durationFormatted;
            };
        }

        export enum sliceRole {
            DEPARTURE_SLICE,
            RETURN_SLICE
        }

        export class parseNewDate implements IParseNewDate {
            day: number;
            month: string;
            weekDay: string;
            year: number;
            constructor (date:Date) {
                this.day = date.getDate();
                this.month = date.toLocaleDateString().split('/')[1];
                this.weekDay = '';
                this.year = date.getFullYear();
            }
        }

        export class dateOptions implements IDateOptions {
            maxDate: Date;
            minDate: Date;
            maxMode: string;
            showWeeks: boolean;
            dateDisabled:boolean;
            static defaultMinValue:Date = new Date();
            static defaultMaxValue:Date = new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDay());

            /**
             * Constructor, sets default vaules for generic calendar
             */
            constructor () {
                this.setMinDate(dateOptions.defaultMinValue);
                this.setMaxDate(dateOptions.defaultMaxValue);
                this.maxMode = 'day';
                this.showWeeks = false;
                this.dateDisabled = false;
            }

            /**
             * Updates the min-max date limits when the checkbox is updated
             * @param selfRole Indicates if this object belong to a deparure or return slice
             * @param date Date to update with this object
             */
            dateCheckUpdateEvent (selfRole:sliceRole, date?:Date) {
                if (date) {
                    this.dateUpdateEvent(selfRole, date);
                }else{
                    this.dateUpdateEvent(selfRole, this.updateLimit(selfRole).defaultDate);
                }
            }

            /**
             * Updates the min-max date limits when a date update is triggered
             * @param selfRole Indicates if this object belong to a deparure or return slice
             * @param date Date to update with this object
             */
            dateUpdateEvent = (selfRole:sliceRole, date:Date) => {
                this.updateLimit(selfRole).func(date);
            };

            //TODO Revisar la posibilidad de usar constantes
            //TODO Cada caso debe contener toda la información necesaria para actualizar la clase completa
            private updateLimit = (selfRole:sliceRole):{func:any, defaultDate:Date} => {
                let updateAgent:any, defDate:Date;
                switch (selfRole) {
                        case sliceRole.DEPARTURE_SLICE:
                            updateAgent = this.setMaxDate;
                            defDate = dateOptions.defaultMaxValue;
                            break;
                        case sliceRole.RETURN_SLICE:
                            updateAgent = this.setMinDate;
                            defDate = dateOptions.defaultMinValue;
                            break;
                        default:
                            updateAgent = this.setMaxDate;
                            defDate = dateOptions.defaultMaxValue;
                            break;
                }
                return {func:updateAgent, defaultDate:defDate};
            };

            /**
             * Setter minDate attribute
             */
            setMinDate (date:Date) {
                this.minDate = date;
            }

            /**
             * Setter maxDate attribute
             */
            setMaxDate (date:Date) {
                this.maxDate = date;
            }
        }

        export class modelRibbonSegment implements IModelRibbonSegment {
            arrival: SliceData.Airport;
            arrivalCity: SliceData.Airport;
            arrivalDateParsed: slideDate;
            arrivalDateTimeParsed: string;
            cabin: SliceData.Cabin;
            companyURL: string;
            departure: SliceData.Airport;
            departureCity: SliceData.Airport;
            departureDateParsed: slideDate;
            departureDateTimeParsed: string;
            durationParsed: string;
            fareFamilyConditions: FareData.FareFamily;
            flight: SliceData.Flight;
            flown: boolean;
            overnight: boolean;
            segmentId: string;
            sliceId: string;
            status: codeDescr;
            stop: any;
            waitingTimeParsed: any;
            warnings: codeDescr[];
        }
    }
    angular.module('ib-MmB-app').constant('AvailabilityDataClass', AvailabilityDataClass);
    export type AvailabilityDataClass = typeof AvailabilityDataClass;
}