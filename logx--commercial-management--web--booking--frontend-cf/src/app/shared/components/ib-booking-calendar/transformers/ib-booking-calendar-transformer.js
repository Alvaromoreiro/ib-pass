import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter);
(function () {


    angular
        .module('ib-booking-calendar-module')
        .factory('BookingCalendarTransformer', BookingCalendarTransformer);

    BookingCalendarTransformer.$inject = ['CurrencyService', 'localStorageService'];
    function BookingCalendarTransformer (CurrencyService, localStorageService) {

        const self = {
            getRedemptionCalendarModel: getRedemptionCalendarModel
        };

        return self;

        /**
         *  Returns the model for the calendar component using the calendar web-service response
         * @param {*} calendarResponse the response for calendar web-service
         * @param {*} currentOriginDestinationIndex Indentify the different slice in the flight
         */
        function getRedemptionCalendarModel (calendarResponse, currentOriginDestinationIndex) {
            let i = 0, sliderModel = [], firstDate, initFlightDay, lastFlightDay, endMonth,availabilityResponse, lastAvaibleDay, day, minAvios = Number.MAX_VALUE, week = [], month = [],
                calendarModel = {
                    contextMetadata: calendarResponse.contextMetadata,
                    dates: [],
                    slice: calendarResponse.outbound.slice
                };
            availabilityResponse = localStorageService.get('availabilityRequestData');
            lastAvaibleDay = dayjs();
            lastAvaibleDay = lastAvaibleDay.add(localStorageService.get('commercialData').maxSearchTime,'day');
            initFlightDay = dayjs(availabilityResponse.slices[0].date);
            firstDate = dayjs(calendarResponse.outbound.availabilityCalendar[0].date);
            lastFlightDay = availabilityResponse.slices.length>1 ?dayjs(availabilityResponse.slices[availabilityResponse.slices.length - 1].date): undefined;

            if (!firstDate.isSame(dayjs(firstDate.format('YYYY-MM-DD')).startOf('month'))) {
                completeMonth(firstDate);
            }
            for (i = 0; i < calendarResponse.outbound.availabilityCalendar.length; ++i) {
                createBound(calendarResponse.outbound, calendarModel);
            }
            sliderModel[0].firstItem = true;
            sliderModel[sliderModel.length - 1].lastItem = true;
            calendarModel.sliderModel = sliderModel;

            return calendarModel;

            function createBound (actualSlice, transformedSlice) {
                let actualFlight = dayjs(actualSlice.availabilityCalendar[i].date), isFirstDate = dayjs(actualFlight).isSame(initFlightDay) || dayjs(actualFlight).isSame(lastFlightDay), transformedMonth;
                day = {};
                day = {
                    flightDate: angular.copy(actualFlight),
                    flightDateNumber: actualFlight.format('DD'),
                    price: actualSlice.availabilityCalendar[i].avios != null ? CurrencyService.formatAvios(localStorageService.get('commercialData').currency.groupingSeparator, actualSlice.availabilityCalendar[i].avios) : undefined,
                    available: !((currentOriginDestinationIndex === 1 && actualFlight.isBefore(initFlightDay)) || (currentOriginDestinationIndex === 0 && lastFlightDay && actualFlight.isAfter(lastFlightDay)) || actualFlight.isSameOrAfter(lastAvaibleDay) ||actualSlice.availabilityCalendar[i].lock),
                    firstDate: isFirstDate,
                    monthName: actualFlight.isSame((dayjs(actualFlight).startOf('month'))) ? actualFlight.format('MMMM') : undefined,
                    serviceDate: actualFlight.format('YYYY-MM-DD')
                };
                week[day.flightDate.day() !== 0 ? day.flightDate.day() - 1 : 6] = angular.copy(day);
                if(actualFlight.isSame((dayjs(actualFlight).endOf('month')).format('YYYY-MM-DD'))) {
                    endMonth=true;
                    transformedMonth = month[2][0].flightDate.format('MMM');
                    transformedMonth = transformedMonth.substring(0, 1).toUpperCase() + transformedMonth.substring(1);
                    sliderModel.push({ minAvios: minAvios === Number.MAX_VALUE ? null : CurrencyService.formatAvios(localStorageService.get('commercialData').currency.groupingSeparator, minAvios), monthPosition: sliderModel.length, transformedMonth: transformedMonth, transformedYear: month[2][0].flightDate.format('YYYY') });
                    minAvios = Number.MAX_VALUE;
                }
                if (!week[0]) {
                    reFillkWeek(week, day.flightDate);
                }
                if (minAvios > actualSlice.availabilityCalendar[i].avios && actualSlice.availabilityCalendar[i].avios !== null) {
                    minAvios = actualSlice.availabilityCalendar[i].avios;
                }
                if (week.length === 7 || i + 1 === actualSlice.availabilityCalendar.length) {
                    month.push(week);
                    if (endMonth) {
                        transformedSlice.dates.push(angular.copy(month));
                        if (initFlightDay.month() === week[0].flightDate.month() && !currentOriginDestinationIndex) {
                            calendarModel.monthIndex = sliderModel.length - 1;
                            calendarModel.dates[calendarModel.monthIndex].flightDay = initFlightDay.day();
                        } else {
                            if (lastFlightDay && lastFlightDay.month() === week[0].flightDate.month()) {
                                calendarModel.dates[calendarModel.dates.length - 1].flightDay = lastFlightDay.day();
                                if (currentOriginDestinationIndex === 1)
                                    calendarModel.monthIndex = sliderModel.length - 1;
                            }
                        }
                        month = [];
                        endMonth=false;
                        if (i + 1 !== actualSlice.availabilityCalendar.length && week[0].flightDate.month() !== week[6].flightDate.month())
                            month.push(week);
                    }
                    week = [];
                }
            }

            function reFillkWeek (actualWeek, actualDate, available) {
                let k = 0, nextDay = dayjs(actualDate), startDay = actualDate.day() !== 0 ? actualDate.day() : 7, actualDay;
                for (k = 0; k < startDay - 1; ++k) {
                    actualDay = dayjs(nextDay.subtract((startDay - 1 - k), 'd').format('YYYY-MM-DD'));
                    actualWeek[k] = {
                        flightDate: angular.copy(actualDay),
                        flightDateNumber: actualDay.format('DD'),
                        available: !!available,
                        monthName: actualDay.isSame((dayjs(actualDay).startOf('month'))) ? actualDay.format('MMMM') : undefined,
                        firstDate: dayjs(actualDay).isSame(initFlightDay),
                        serviceDate: nextDay.subtract(startDay - 1 - k).format('YYYY-MM-DD')
                    };
                    nextDay = dayjs(actualDate);
                }
            }

            function completeMonth (firstDate) {
                let weekNumber = Math.round(firstDate.date() / 7) || 1, z = 0, lastDay = dayjs(firstDate), daysToSunday = firstDate.day() !== 0 ? 7 - (7 - firstDate.day()) : 7;

                lastDay = dayjs(firstDate.subtract(daysToSunday, 'd').format('YYYY-MM-DD'));
                for (z = weekNumber; z >= 1; --z) {
                    reFillkWeek(week, lastDay, false);
                    if (lastDay.day() === 0) {
                        week[6] = {
                            flightDate: angular.copy(lastDay),
                            flightDateNumber: lastDay.format('DD'),
                            available: false,
                            monthName: lastDay.isSame((dayjs(lastDay).startOf('month'))) ? lastDay.format('MMMM') : undefined,
                            firstDate: dayjs(lastDay).isSame(initFlightDay)
                        };
                        month[z - 1] = week;
                    }
                    lastDay = dayjs(lastDay.subtract(7, 'd').format('YYYY-MM-DD'));
                    week = [];
                }
            }
        }
    }
})();
