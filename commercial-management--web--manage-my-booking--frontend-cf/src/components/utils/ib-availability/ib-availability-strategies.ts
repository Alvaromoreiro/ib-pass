import * as angular from 'angular';
import dayjs from 'dayjs';

export namespace Availability {


    /**
     * Temporal types to break through
     */
    type dateOption = {
        minDate: Date,
        initDate: Date,
        maxDate: Date,
        dateDisabled: boolean,
        showWeeks:boolean
    };
    /**
     * Basic Strategy interface
     */
    export interface AvailabilityStrat {
        initializeDateOptions(index:number, departureDate:string, opositeDepartureDate:string, isDateDisabled:boolean, optionalEnabled:boolean, maxRange:number):dateOption;
        updateDateOptionOnChange(dateOpt:dateOption, newDateSelected:Date, index:number, maxFlexConst:string, initDate:Date):dateOption;
        getDateOption(isDeparture:boolean, currentInitDate:Date, oppositeDate:Date, maxRange:number, optExist:boolean, optionalEnabled:boolean):dateOption;
        getAvailability():AvailabilityClass.Service;
    }

    namespace AvailabilityClass {

        export enum Service {
            UNIFIED_TYPE,
            DISRUPTION_TYPE,
            VOLUNTARY_CHANGE,
            ANCILLARY_TYPE,
            FARE_DIFF_TYPE
        }
        export class DefaultStrategy implements AvailabilityStrat {
            constructor () {

            }
            initializeDateOptions = (index:number, departureDate:string, opositeDepartureDate:string, isDateDisabled:boolean, optionalEnabled:boolean, maxRange:number):dateOption => {
                let defaultDateOpt:dateOption= {
                    minDate: new Date(),
                    initDate: new Date(departureDate),
                    maxDate: new Date(departureDate),
                    dateDisabled: isDateDisabled,
                    showWeeks: false
                };
                defaultDateOpt.maxDate = new Date(defaultDateOpt.maxDate.getFullYear() + 1, defaultDateOpt.maxDate.getMonth(), defaultDateOpt.maxDate.getDay());
                if(index === 1 && opositeDepartureDate) {
                    defaultDateOpt.minDate = new Date(opositeDepartureDate);
                }
                if(index === 0 && opositeDepartureDate) {
                    defaultDateOpt.maxDate = optionalEnabled ? new Date(opositeDepartureDate) : defaultDateOpt.maxDate;
                }
                return defaultDateOpt;
            };
            updateDateOptionOnChange = (dateOpt:dateOption, newDateSelected:Date, index:number, maxFlexConst:string, initDate:Date):  dateOption => {
                let defaultDateOpt:dateOption = dateOpt;
                if(index === 0) {
                    defaultDateOpt.minDate = newDateSelected;
                    defaultDateOpt.initDate = initDate;
                }else {
                    defaultDateOpt.maxDate = new Date(maxFlexConst);
                }
                return defaultDateOpt;
            };

            getDateOption = (isDeparture:boolean, currentInitDate:Date, oppositeDate:Date, maxRange:number, optExist:boolean, optionalEnabled:boolean) => {
                let defaultDateOpt:dateOption = {
                    minDate: new Date(),
                    initDate: new Date(currentInitDate),
                    maxDate: new Date(currentInitDate),
                    dateDisabled: false,
                    showWeeks: false
                };

                defaultDateOpt = this.checkDepartureDate(isDeparture, defaultDateOpt, oppositeDate, maxRange);
             
                if(defaultDateOpt.minDate < new Date()) {
                    defaultDateOpt.minDate = new Date();
                }
                return defaultDateOpt;
            };

            checkDepartureDate = (isDeparture:boolean, defaultDateOpt:dateOption, oppositeDate:Date, maxRange:number):dateOption => {
                defaultDateOpt.maxDate = new Date(dayjs(defaultDateOpt.initDate).add(maxRange, 'days').toString());
                defaultDateOpt.minDate = new Date(dayjs(defaultDateOpt.initDate).subtract(maxRange, 'days').toString());
                if(isDeparture) {
                    this.checkMaxdate(defaultDateOpt, oppositeDate);
                }else {
                    if (oppositeDate && oppositeDate > defaultDateOpt.minDate) {
                        defaultDateOpt.minDate = oppositeDate;
                    }
                }
                return defaultDateOpt;
            }

            checkMaxdate = (defaultDateOpt:dateOption, oppositeDate:Date) => {
                if(oppositeDate && oppositeDate < defaultDateOpt.maxDate) {
                    defaultDateOpt.maxDate = oppositeDate;
                }
            }

            getAvailability = (): Service => {
                return Service.DISRUPTION_TYPE;
            };
        }

        export class VoluntaryStrategy implements AvailabilityStrat {
            initializeDateOptions (index: number, departureDate: string, opositeDepartureDate: string, isDateDisabled: boolean, optionalEnabled: boolean, maxRange:number): dateOption {
                throw new Error('Method not implemented.');
            }
            updateDateOptionOnChange (dateOpt: dateOption, newDateSelected: Date, index: number, maxFlexConst: string, initDate: Date): dateOption {
                throw new Error('Method not implemented.');
            }
            getAvailability (): Service {
                return Service.VOLUNTARY_CHANGE;
            }
            getDateOption = (isDeparture:boolean, currentInitDate:Date, oppositeDate:Date, maxRange:number, optExist:boolean, optionalEnabled:boolean) => {
                throw new Error('Method not implemented.');
            };

        }

        export class UnifiedStrategy implements AvailabilityStrat {
            constructor () {
            }
            initializeDateOptions = (index:number, departureDate:string, opositeDepartureDate:string, isDateDisabled:boolean, optionalEnabled:boolean, maxRange:number):dateOption => {
                let defaultDateOpt:dateOption= {
                    minDate: new Date(),
                    initDate: new Date(departureDate),
                    maxDate: new Date(departureDate),
                    dateDisabled: isDateDisabled,
                    showWeeks: false
                };

                defaultDateOpt.maxDate = new Date(dayjs(defaultDateOpt.initDate).add(maxRange, 'day').toString());
                defaultDateOpt.minDate = new Date(dayjs(defaultDateOpt.initDate).subtract(maxRange, 'day').toString());
                if(index === 1 && opositeDepartureDate && new Date(opositeDepartureDate) > defaultDateOpt.minDate) {
                    defaultDateOpt.minDate = optionalEnabled ? new Date(opositeDepartureDate): defaultDateOpt.minDate;
                }
                if(index === 0 && opositeDepartureDate) {
                    defaultDateOpt.maxDate = new Date(opositeDepartureDate);
                }
                if(defaultDateOpt.minDate < new Date()) {
                    defaultDateOpt.minDate = new Date();
                }

                return defaultDateOpt;
            };

            getDateOption = (isDeparture:boolean, currentInitDate:Date, oppositeDate:Date, maxRange:number, optExist:boolean, optionalEnabled:boolean) => {
                let defaultDateOpt:dateOption = {
                    minDate: new Date(),
                    initDate: new Date(currentInitDate),
                    maxDate: new Date(currentInitDate),
                    dateDisabled: false,
                    showWeeks: false
                };
                if(isDeparture) {
                    defaultDateOpt.maxDate = new Date(dayjs(defaultDateOpt.initDate).add(maxRange, 'days').toString());
                    defaultDateOpt.minDate = new Date(dayjs(defaultDateOpt.initDate).subtract(maxRange, 'days').toString());
                    if (oppositeDate && oppositeDate < defaultDateOpt.maxDate) {
                        defaultDateOpt.maxDate = oppositeDate;
                    }
                }else {
                    defaultDateOpt.maxDate = new Date(dayjs(defaultDateOpt.initDate).add(maxRange, 'days').toString());
                    defaultDateOpt.minDate = new Date(dayjs(defaultDateOpt.initDate).subtract(maxRange, 'days').toString());
                    if (oppositeDate && oppositeDate > defaultDateOpt.minDate) {
                        defaultDateOpt.minDate = oppositeDate;
                    }
                }
                if(defaultDateOpt.minDate < new Date()) {
                    defaultDateOpt.minDate = new Date();
                }
                return defaultDateOpt;
            };
            updateDateOptionOnChange = (dateOpt:dateOption, newDateSelected:Date, index:number, maxFlexConst:string, initDate:Date): dateOption => {
                let defaultDateOpt:dateOption = dateOpt;
                if(index === 0) {
                    defaultDateOpt.minDate = newDateSelected;
                    defaultDateOpt.initDate = initDate;
                    Object.assign(defaultDateOpt.initDate || {}, initDate);
                }else {
                    defaultDateOpt.maxDate = new Date(defaultDateOpt.maxDate.getFullYear() + 1, defaultDateOpt.maxDate.getMonth(), defaultDateOpt.maxDate.getDay());
                }
                return defaultDateOpt;
            };
            getAvailability = () : Service => {
                return Service.UNIFIED_TYPE;
            };
        }
    }
    angular.module('ib-MmB-app').constant('AvailabilityClass', AvailabilityClass);
    export type AvailabilityClass = typeof AvailabilityClass;
}
