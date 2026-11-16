import angular from "angular";
import dayjs from "dayjs";

describe('IbFlexibilizationSearchController test', () =>  {
    var $q, controller;
    var dataModelRibbon = [
        {
            'index': 'OD1',
            'calendarData': {
                'minDate': '2019-12-12T23:00:00.000Z',
                'maxDate': '2020-12-06T23:00:00.000Z',
                'selectedSlide': 10,
                'currentInitialSlide': 10,
                'currentSlides': [
                    {
                        'serviceDate': '2019-12-17',
                        'slidePosition': 7,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 17,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-17T00:00:00+01:00',
                            'formatedDate': '17/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-18',
                        'slidePosition': 8,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 18,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-18T00:00:00+01:00',
                            'formatedDate': '18/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-19',
                        'slidePosition': 9,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 19,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-19T00:00:00+01:00',
                            'formatedDate': '19/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-20',
                        'slidePosition': 10,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 20,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-20T00:00:00+01:00',
                            'formatedDate': '20/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-21',
                        'slidePosition': 11,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 21,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-21T00:00:00+01:00',
                            'formatedDate': '21/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-22',
                        'slidePosition': 12,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 22,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-22T00:00:00+01:00',
                            'formatedDate': '22/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-23',
                        'slidePosition': 13,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 23,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-23T00:00:00+01:00',
                            'formatedDate': '23/12/2019'
                        },
                        'state': 'AVAILABLE'
                    }
                ],
                'slides': [
                    {
                        'serviceDate': '2019-12-10',
                        'slidePosition': 0,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 10,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-10T00:00:00+01:00',
                            'formatedDate': '10/12/2019'
                        },
                        'state': 'DISABLED',
                        'firstItem': true
                    },
                    {
                        'serviceDate': '2019-12-11',
                        'slidePosition': 1,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 11,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-11T00:00:00+01:00',
                            'formatedDate': '11/12/2019'
                        },
                        'state': 'DISABLED'
                    },
                    {
                        'serviceDate': '2019-12-12',
                        'slidePosition': 2,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 12,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-12T00:00:00+01:00',
                            'formatedDate': '12/12/2019'
                        },
                        'state': 'DISABLED'
                    },
                    {
                        'serviceDate': '2019-12-13',
                        'slidePosition': 3,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 13,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-13T00:00:00+01:00',
                            'formatedDate': '13/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-14',
                        'slidePosition': 4,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 14,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-14T00:00:00+01:00',
                            'formatedDate': '14/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-15',
                        'slidePosition': 5,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 15,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-15T00:00:00+01:00',
                            'formatedDate': '15/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-16',
                        'slidePosition': 6,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 16,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-16T00:00:00+01:00',
                            'formatedDate': '16/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-17',
                        'slidePosition': 7,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 17,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-17T00:00:00+01:00',
                            'formatedDate': '17/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-18',
                        'slidePosition': 8,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 18,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-18T00:00:00+01:00',
                            'formatedDate': '18/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-19',
                        'slidePosition': 9,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 19,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-19T00:00:00+01:00',
                            'formatedDate': '19/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-20',
                        'slidePosition': 10,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 20,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-20T00:00:00+01:00',
                            'formatedDate': '20/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-21',
                        'slidePosition': 11,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 21,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-21T00:00:00+01:00',
                            'formatedDate': '21/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-22',
                        'slidePosition': 12,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 22,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-22T00:00:00+01:00',
                            'formatedDate': '22/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-23',
                        'slidePosition': 13,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 23,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-23T00:00:00+01:00',
                            'formatedDate': '23/12/2019'
                        },
                        'state': 'AVAILABLE'
                    },
                    {
                        'serviceDate': '2019-12-24',
                        'slidePosition': 14,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 24,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-24T00:00:00+01:00',
                            'formatedDate': '24/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-25',
                        'slidePosition': 15,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 25,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-25T00:00:00+01:00',
                            'formatedDate': '25/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-26',
                        'slidePosition': 16,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 26,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-26T00:00:00+01:00',
                            'formatedDate': '26/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-27',
                        'slidePosition': 17,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 27,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-27T00:00:00+01:00',
                            'formatedDate': '27/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-28',
                        'slidePosition': 18,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 28,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-28T00:00:00+01:00',
                            'formatedDate': '28/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-29',
                        'slidePosition': 19,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 29,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-29T00:00:00+01:00',
                            'formatedDate': '29/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-30',
                        'slidePosition': 20,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 30,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-30T00:00:00+01:00',
                            'formatedDate': '30/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2019-12-31',
                        'slidePosition': 21,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 31,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2019,
                            'originalDate': '2019-12-31T00:00:00+01:00',
                            'formatedDate': '31/12/2019'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-01',
                        'slidePosition': 22,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 1,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-01T00:00:00+01:00',
                            'formatedDate': '01/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-02',
                        'slidePosition': 23,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 2,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-02T00:00:00+01:00',
                            'formatedDate': '02/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-03',
                        'slidePosition': 24,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 3,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-03T00:00:00+01:00',
                            'formatedDate': '03/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-04',
                        'slidePosition': 25,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 4,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-04T00:00:00+01:00',
                            'formatedDate': '04/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-05',
                        'slidePosition': 26,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 5,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-05T00:00:00+01:00',
                            'formatedDate': '05/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-06',
                        'slidePosition': 27,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 6,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-06T00:00:00+01:00',
                            'formatedDate': '06/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-07',
                        'slidePosition': 28,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 7,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-07T00:00:00+01:00',
                            'formatedDate': '07/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-08',
                        'slidePosition': 29,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 8,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-08T00:00:00+01:00',
                            'formatedDate': '08/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-09',
                        'slidePosition': 30,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 9,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-09T00:00:00+01:00',
                            'formatedDate': '09/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-10',
                        'slidePosition': 31,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 10,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-10T00:00:00+01:00',
                            'formatedDate': '10/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-11',
                        'slidePosition': 32,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 11,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-11T00:00:00+01:00',
                            'formatedDate': '11/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-12',
                        'slidePosition': 33,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 12,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-12T00:00:00+01:00',
                            'formatedDate': '12/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-13',
                        'slidePosition': 34,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 13,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-13T00:00:00+01:00',
                            'formatedDate': '13/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-14',
                        'slidePosition': 35,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 14,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-14T00:00:00+01:00',
                            'formatedDate': '14/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-15',
                        'slidePosition': 36,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 15,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-15T00:00:00+01:00',
                            'formatedDate': '15/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-16',
                        'slidePosition': 37,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 16,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-16T00:00:00+01:00',
                            'formatedDate': '16/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-17',
                        'slidePosition': 38,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 17,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-17T00:00:00+01:00',
                            'formatedDate': '17/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-18',
                        'slidePosition': 39,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 18,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-18T00:00:00+01:00',
                            'formatedDate': '18/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-19',
                        'slidePosition': 40,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 19,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-19T00:00:00+01:00',
                            'formatedDate': '19/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-20',
                        'slidePosition': 41,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 20,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-20T00:00:00+01:00',
                            'formatedDate': '20/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-21',
                        'slidePosition': 42,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 21,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-21T00:00:00+01:00',
                            'formatedDate': '21/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-22',
                        'slidePosition': 43,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 22,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-22T00:00:00+01:00',
                            'formatedDate': '22/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-23',
                        'slidePosition': 44,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 23,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-23T00:00:00+01:00',
                            'formatedDate': '23/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-24',
                        'slidePosition': 45,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 24,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-24T00:00:00+01:00',
                            'formatedDate': '24/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-25',
                        'slidePosition': 46,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 25,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-25T00:00:00+01:00',
                            'formatedDate': '25/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-26',
                        'slidePosition': 47,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 26,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-26T00:00:00+01:00',
                            'formatedDate': '26/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-27',
                        'slidePosition': 48,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 27,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-27T00:00:00+01:00',
                            'formatedDate': '27/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-28',
                        'slidePosition': 49,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 28,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-28T00:00:00+01:00',
                            'formatedDate': '28/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-29',
                        'slidePosition': 50,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 29,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-29T00:00:00+01:00',
                            'formatedDate': '29/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-30',
                        'slidePosition': 51,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 30,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-30T00:00:00+01:00',
                            'formatedDate': '30/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-01-31',
                        'slidePosition': 52,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 31,
                            'monthNumber': 1,
                            'month': 'MONTH_JANUARY',
                            'year': 2020,
                            'originalDate': '2020-01-31T00:00:00+01:00',
                            'formatedDate': '31/01/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-01',
                        'slidePosition': 53,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 1,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-01T00:00:00+01:00',
                            'formatedDate': '01/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-02',
                        'slidePosition': 54,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 2,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-02T00:00:00+01:00',
                            'formatedDate': '02/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-03',
                        'slidePosition': 55,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 3,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-03T00:00:00+01:00',
                            'formatedDate': '03/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-04',
                        'slidePosition': 56,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 4,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-04T00:00:00+01:00',
                            'formatedDate': '04/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-05',
                        'slidePosition': 57,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 5,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-05T00:00:00+01:00',
                            'formatedDate': '05/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-06',
                        'slidePosition': 58,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 6,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-06T00:00:00+01:00',
                            'formatedDate': '06/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-07',
                        'slidePosition': 59,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 7,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-07T00:00:00+01:00',
                            'formatedDate': '07/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-08',
                        'slidePosition': 60,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 8,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-08T00:00:00+01:00',
                            'formatedDate': '08/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-09',
                        'slidePosition': 61,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 9,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-09T00:00:00+01:00',
                            'formatedDate': '09/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-10',
                        'slidePosition': 62,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 10,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-10T00:00:00+01:00',
                            'formatedDate': '10/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-11',
                        'slidePosition': 63,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 11,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-11T00:00:00+01:00',
                            'formatedDate': '11/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-12',
                        'slidePosition': 64,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 12,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-12T00:00:00+01:00',
                            'formatedDate': '12/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-13',
                        'slidePosition': 65,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 13,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-13T00:00:00+01:00',
                            'formatedDate': '13/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-14',
                        'slidePosition': 66,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 14,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-14T00:00:00+01:00',
                            'formatedDate': '14/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-15',
                        'slidePosition': 67,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 15,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-15T00:00:00+01:00',
                            'formatedDate': '15/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-16',
                        'slidePosition': 68,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 16,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-16T00:00:00+01:00',
                            'formatedDate': '16/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-17',
                        'slidePosition': 69,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 17,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-17T00:00:00+01:00',
                            'formatedDate': '17/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-18',
                        'slidePosition': 70,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 18,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-18T00:00:00+01:00',
                            'formatedDate': '18/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-19',
                        'slidePosition': 71,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 19,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-19T00:00:00+01:00',
                            'formatedDate': '19/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-20',
                        'slidePosition': 72,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 20,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-20T00:00:00+01:00',
                            'formatedDate': '20/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-21',
                        'slidePosition': 73,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 21,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-21T00:00:00+01:00',
                            'formatedDate': '21/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-22',
                        'slidePosition': 74,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 22,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-22T00:00:00+01:00',
                            'formatedDate': '22/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-23',
                        'slidePosition': 75,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 23,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-23T00:00:00+01:00',
                            'formatedDate': '23/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-24',
                        'slidePosition': 76,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 24,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-24T00:00:00+01:00',
                            'formatedDate': '24/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-25',
                        'slidePosition': 77,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 25,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-25T00:00:00+01:00',
                            'formatedDate': '25/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-26',
                        'slidePosition': 78,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 26,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-26T00:00:00+01:00',
                            'formatedDate': '26/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-27',
                        'slidePosition': 79,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 27,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-27T00:00:00+01:00',
                            'formatedDate': '27/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-28',
                        'slidePosition': 80,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 28,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-28T00:00:00+01:00',
                            'formatedDate': '28/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-02-29',
                        'slidePosition': 81,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 29,
                            'monthNumber': 2,
                            'month': 'MONTH_FEBRUARY',
                            'year': 2020,
                            'originalDate': '2020-02-29T00:00:00+01:00',
                            'formatedDate': '29/02/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-01',
                        'slidePosition': 82,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 1,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-01T00:00:00+01:00',
                            'formatedDate': '01/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-02',
                        'slidePosition': 83,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 2,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-02T00:00:00+01:00',
                            'formatedDate': '02/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-03',
                        'slidePosition': 84,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 3,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-03T00:00:00+01:00',
                            'formatedDate': '03/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-04',
                        'slidePosition': 85,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 4,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-04T00:00:00+01:00',
                            'formatedDate': '04/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-05',
                        'slidePosition': 86,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 5,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-05T00:00:00+01:00',
                            'formatedDate': '05/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-06',
                        'slidePosition': 87,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 6,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-06T00:00:00+01:00',
                            'formatedDate': '06/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-07',
                        'slidePosition': 88,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 7,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-07T00:00:00+01:00',
                            'formatedDate': '07/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-08',
                        'slidePosition': 89,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 8,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-08T00:00:00+01:00',
                            'formatedDate': '08/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-09',
                        'slidePosition': 90,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 9,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-09T00:00:00+01:00',
                            'formatedDate': '09/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-10',
                        'slidePosition': 91,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 10,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-10T00:00:00+01:00',
                            'formatedDate': '10/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-11',
                        'slidePosition': 92,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 11,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-11T00:00:00+01:00',
                            'formatedDate': '11/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-12',
                        'slidePosition': 93,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 12,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-12T00:00:00+01:00',
                            'formatedDate': '12/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-13',
                        'slidePosition': 94,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 13,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-13T00:00:00+01:00',
                            'formatedDate': '13/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-14',
                        'slidePosition': 95,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 14,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-14T00:00:00+01:00',
                            'formatedDate': '14/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-15',
                        'slidePosition': 96,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 15,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-15T00:00:00+01:00',
                            'formatedDate': '15/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-16',
                        'slidePosition': 97,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 16,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-16T00:00:00+01:00',
                            'formatedDate': '16/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-17',
                        'slidePosition': 98,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 17,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-17T00:00:00+01:00',
                            'formatedDate': '17/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-18',
                        'slidePosition': 99,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 18,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-18T00:00:00+01:00',
                            'formatedDate': '18/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-19',
                        'slidePosition': 100,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 19,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-19T00:00:00+01:00',
                            'formatedDate': '19/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-20',
                        'slidePosition': 101,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 20,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-20T00:00:00+01:00',
                            'formatedDate': '20/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-21',
                        'slidePosition': 102,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 21,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-21T00:00:00+01:00',
                            'formatedDate': '21/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-22',
                        'slidePosition': 103,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 22,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-22T00:00:00+01:00',
                            'formatedDate': '22/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-23',
                        'slidePosition': 104,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 23,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-23T00:00:00+01:00',
                            'formatedDate': '23/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-24',
                        'slidePosition': 105,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 24,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-24T00:00:00+01:00',
                            'formatedDate': '24/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-25',
                        'slidePosition': 106,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 25,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-25T00:00:00+01:00',
                            'formatedDate': '25/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-26',
                        'slidePosition': 107,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 26,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-26T00:00:00+01:00',
                            'formatedDate': '26/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-27',
                        'slidePosition': 108,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 27,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-27T00:00:00+01:00',
                            'formatedDate': '27/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-28',
                        'slidePosition': 109,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 28,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-28T00:00:00+01:00',
                            'formatedDate': '28/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-29',
                        'slidePosition': 110,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 29,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-29T00:00:00+01:00',
                            'formatedDate': '29/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-30',
                        'slidePosition': 111,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 30,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-30T00:00:00+02:00',
                            'formatedDate': '30/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-03-31',
                        'slidePosition': 112,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 31,
                            'monthNumber': 3,
                            'month': 'MONTH_MARCH',
                            'year': 2020,
                            'originalDate': '2020-03-31T00:00:00+02:00',
                            'formatedDate': '31/03/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-01',
                        'slidePosition': 113,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 1,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-01T00:00:00+02:00',
                            'formatedDate': '01/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-02',
                        'slidePosition': 114,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 2,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-02T00:00:00+02:00',
                            'formatedDate': '02/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-03',
                        'slidePosition': 115,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 3,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-03T00:00:00+02:00',
                            'formatedDate': '03/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-04',
                        'slidePosition': 116,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 4,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-04T00:00:00+02:00',
                            'formatedDate': '04/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-05',
                        'slidePosition': 117,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 5,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-05T00:00:00+02:00',
                            'formatedDate': '05/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-06',
                        'slidePosition': 118,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 6,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-06T00:00:00+02:00',
                            'formatedDate': '06/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-07',
                        'slidePosition': 119,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 7,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-07T00:00:00+02:00',
                            'formatedDate': '07/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-08',
                        'slidePosition': 120,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 8,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-08T00:00:00+02:00',
                            'formatedDate': '08/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-09',
                        'slidePosition': 121,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 9,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-09T00:00:00+02:00',
                            'formatedDate': '09/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-10',
                        'slidePosition': 122,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 10,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-10T00:00:00+02:00',
                            'formatedDate': '10/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-11',
                        'slidePosition': 123,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 11,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-11T00:00:00+02:00',
                            'formatedDate': '11/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-12',
                        'slidePosition': 124,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 12,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-12T00:00:00+02:00',
                            'formatedDate': '12/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-13',
                        'slidePosition': 125,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 13,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-13T00:00:00+02:00',
                            'formatedDate': '13/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-14',
                        'slidePosition': 126,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 14,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-14T00:00:00+02:00',
                            'formatedDate': '14/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-15',
                        'slidePosition': 127,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 15,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-15T00:00:00+02:00',
                            'formatedDate': '15/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-16',
                        'slidePosition': 128,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 16,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-16T00:00:00+02:00',
                            'formatedDate': '16/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-17',
                        'slidePosition': 129,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 17,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-17T00:00:00+02:00',
                            'formatedDate': '17/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-18',
                        'slidePosition': 130,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 18,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-18T00:00:00+02:00',
                            'formatedDate': '18/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-19',
                        'slidePosition': 131,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 19,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-19T00:00:00+02:00',
                            'formatedDate': '19/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-20',
                        'slidePosition': 132,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 20,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-20T00:00:00+02:00',
                            'formatedDate': '20/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-21',
                        'slidePosition': 133,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 21,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-21T00:00:00+02:00',
                            'formatedDate': '21/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-22',
                        'slidePosition': 134,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 22,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-22T00:00:00+02:00',
                            'formatedDate': '22/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-23',
                        'slidePosition': 135,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 23,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-23T00:00:00+02:00',
                            'formatedDate': '23/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-24',
                        'slidePosition': 136,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 24,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-24T00:00:00+02:00',
                            'formatedDate': '24/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-25',
                        'slidePosition': 137,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 25,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-25T00:00:00+02:00',
                            'formatedDate': '25/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-26',
                        'slidePosition': 138,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 26,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-26T00:00:00+02:00',
                            'formatedDate': '26/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-27',
                        'slidePosition': 139,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 27,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-27T00:00:00+02:00',
                            'formatedDate': '27/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-28',
                        'slidePosition': 140,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 28,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-28T00:00:00+02:00',
                            'formatedDate': '28/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-29',
                        'slidePosition': 141,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 29,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-29T00:00:00+02:00',
                            'formatedDate': '29/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-04-30',
                        'slidePosition': 142,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 30,
                            'monthNumber': 4,
                            'month': 'MONTH_APRIL',
                            'year': 2020,
                            'originalDate': '2020-04-30T00:00:00+02:00',
                            'formatedDate': '30/04/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-01',
                        'slidePosition': 143,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 1,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-01T00:00:00+02:00',
                            'formatedDate': '01/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-02',
                        'slidePosition': 144,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 2,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-02T00:00:00+02:00',
                            'formatedDate': '02/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-03',
                        'slidePosition': 145,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 3,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-03T00:00:00+02:00',
                            'formatedDate': '03/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-04',
                        'slidePosition': 146,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 4,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-04T00:00:00+02:00',
                            'formatedDate': '04/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-05',
                        'slidePosition': 147,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 5,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-05T00:00:00+02:00',
                            'formatedDate': '05/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-06',
                        'slidePosition': 148,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 6,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-06T00:00:00+02:00',
                            'formatedDate': '06/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-07',
                        'slidePosition': 149,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 7,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-07T00:00:00+02:00',
                            'formatedDate': '07/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-08',
                        'slidePosition': 150,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 8,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-08T00:00:00+02:00',
                            'formatedDate': '08/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-09',
                        'slidePosition': 151,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 9,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-09T00:00:00+02:00',
                            'formatedDate': '09/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-10',
                        'slidePosition': 152,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 10,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-10T00:00:00+02:00',
                            'formatedDate': '10/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-11',
                        'slidePosition': 153,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 11,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-11T00:00:00+02:00',
                            'formatedDate': '11/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-12',
                        'slidePosition': 154,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 12,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-12T00:00:00+02:00',
                            'formatedDate': '12/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-13',
                        'slidePosition': 155,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 13,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-13T00:00:00+02:00',
                            'formatedDate': '13/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-14',
                        'slidePosition': 156,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 14,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-14T00:00:00+02:00',
                            'formatedDate': '14/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-15',
                        'slidePosition': 157,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 15,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-15T00:00:00+02:00',
                            'formatedDate': '15/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-16',
                        'slidePosition': 158,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 16,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-16T00:00:00+02:00',
                            'formatedDate': '16/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-17',
                        'slidePosition': 159,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 17,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-17T00:00:00+02:00',
                            'formatedDate': '17/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-18',
                        'slidePosition': 160,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 18,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-18T00:00:00+02:00',
                            'formatedDate': '18/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-19',
                        'slidePosition': 161,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 19,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-19T00:00:00+02:00',
                            'formatedDate': '19/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-20',
                        'slidePosition': 162,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 20,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-20T00:00:00+02:00',
                            'formatedDate': '20/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-21',
                        'slidePosition': 163,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 21,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-21T00:00:00+02:00',
                            'formatedDate': '21/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-22',
                        'slidePosition': 164,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 22,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-22T00:00:00+02:00',
                            'formatedDate': '22/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-23',
                        'slidePosition': 165,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 23,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-23T00:00:00+02:00',
                            'formatedDate': '23/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-24',
                        'slidePosition': 166,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 24,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-24T00:00:00+02:00',
                            'formatedDate': '24/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-25',
                        'slidePosition': 167,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 25,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-25T00:00:00+02:00',
                            'formatedDate': '25/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-26',
                        'slidePosition': 168,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 26,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-26T00:00:00+02:00',
                            'formatedDate': '26/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-27',
                        'slidePosition': 169,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 27,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-27T00:00:00+02:00',
                            'formatedDate': '27/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-28',
                        'slidePosition': 170,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 28,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-28T00:00:00+02:00',
                            'formatedDate': '28/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-29',
                        'slidePosition': 171,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 29,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-29T00:00:00+02:00',
                            'formatedDate': '29/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-30',
                        'slidePosition': 172,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 30,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-30T00:00:00+02:00',
                            'formatedDate': '30/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-05-31',
                        'slidePosition': 173,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 31,
                            'monthNumber': 5,
                            'month': 'MONTH_MAY',
                            'year': 2020,
                            'originalDate': '2020-05-31T00:00:00+02:00',
                            'formatedDate': '31/05/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-01',
                        'slidePosition': 174,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 1,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-01T00:00:00+02:00',
                            'formatedDate': '01/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-02',
                        'slidePosition': 175,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 2,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-02T00:00:00+02:00',
                            'formatedDate': '02/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-03',
                        'slidePosition': 176,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 3,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-03T00:00:00+02:00',
                            'formatedDate': '03/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-04',
                        'slidePosition': 177,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 4,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-04T00:00:00+02:00',
                            'formatedDate': '04/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-05',
                        'slidePosition': 178,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 5,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-05T00:00:00+02:00',
                            'formatedDate': '05/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-06',
                        'slidePosition': 179,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 6,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-06T00:00:00+02:00',
                            'formatedDate': '06/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-07',
                        'slidePosition': 180,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 7,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-07T00:00:00+02:00',
                            'formatedDate': '07/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-08',
                        'slidePosition': 181,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 8,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-08T00:00:00+02:00',
                            'formatedDate': '08/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-09',
                        'slidePosition': 182,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 9,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-09T00:00:00+02:00',
                            'formatedDate': '09/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-10',
                        'slidePosition': 183,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 10,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-10T00:00:00+02:00',
                            'formatedDate': '10/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-11',
                        'slidePosition': 184,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 11,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-11T00:00:00+02:00',
                            'formatedDate': '11/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-12',
                        'slidePosition': 185,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 12,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-12T00:00:00+02:00',
                            'formatedDate': '12/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-13',
                        'slidePosition': 186,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 13,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-13T00:00:00+02:00',
                            'formatedDate': '13/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-14',
                        'slidePosition': 187,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 14,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-14T00:00:00+02:00',
                            'formatedDate': '14/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-15',
                        'slidePosition': 188,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-15T00:00:00+02:00',
                            'formatedDate': '15/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-16',
                        'slidePosition': 189,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 16,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-16T00:00:00+02:00',
                            'formatedDate': '16/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-17',
                        'slidePosition': 190,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 17,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-17T00:00:00+02:00',
                            'formatedDate': '17/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-18',
                        'slidePosition': 191,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 18,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-18T00:00:00+02:00',
                            'formatedDate': '18/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-19',
                        'slidePosition': 192,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 19,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-19T00:00:00+02:00',
                            'formatedDate': '19/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-20',
                        'slidePosition': 193,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 20,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-20T00:00:00+02:00',
                            'formatedDate': '20/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-21',
                        'slidePosition': 194,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 21,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-21T00:00:00+02:00',
                            'formatedDate': '21/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-22',
                        'slidePosition': 195,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 22,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-22T00:00:00+02:00',
                            'formatedDate': '22/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-23',
                        'slidePosition': 196,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 23,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-23T00:00:00+02:00',
                            'formatedDate': '23/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-24',
                        'slidePosition': 197,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 24,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-24T00:00:00+02:00',
                            'formatedDate': '24/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-25',
                        'slidePosition': 198,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 25,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-25T00:00:00+02:00',
                            'formatedDate': '25/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-26',
                        'slidePosition': 199,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 26,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-26T00:00:00+02:00',
                            'formatedDate': '26/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-27',
                        'slidePosition': 200,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 27,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-27T00:00:00+02:00',
                            'formatedDate': '27/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-28',
                        'slidePosition': 201,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 28,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-28T00:00:00+02:00',
                            'formatedDate': '28/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-29',
                        'slidePosition': 202,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 29,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-29T00:00:00+02:00',
                            'formatedDate': '29/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-06-30',
                        'slidePosition': 203,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 30,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2020,
                            'originalDate': '2020-06-30T00:00:00+02:00',
                            'formatedDate': '30/06/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-01',
                        'slidePosition': 204,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 1,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-01T00:00:00+02:00',
                            'formatedDate': '01/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-02',
                        'slidePosition': 205,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 2,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-02T00:00:00+02:00',
                            'formatedDate': '02/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-03',
                        'slidePosition': 206,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 3,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-03T00:00:00+02:00',
                            'formatedDate': '03/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-04',
                        'slidePosition': 207,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 4,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-04T00:00:00+02:00',
                            'formatedDate': '04/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-05',
                        'slidePosition': 208,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 5,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-05T00:00:00+02:00',
                            'formatedDate': '05/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-06',
                        'slidePosition': 209,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 6,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-06T00:00:00+02:00',
                            'formatedDate': '06/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-07',
                        'slidePosition': 210,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 7,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-07T00:00:00+02:00',
                            'formatedDate': '07/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-08',
                        'slidePosition': 211,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 8,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-08T00:00:00+02:00',
                            'formatedDate': '08/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-09',
                        'slidePosition': 212,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 9,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-09T00:00:00+02:00',
                            'formatedDate': '09/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-10',
                        'slidePosition': 213,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 10,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-10T00:00:00+02:00',
                            'formatedDate': '10/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-11',
                        'slidePosition': 214,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 11,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-11T00:00:00+02:00',
                            'formatedDate': '11/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-12',
                        'slidePosition': 215,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 12,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-12T00:00:00+02:00',
                            'formatedDate': '12/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-13',
                        'slidePosition': 216,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 13,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-13T00:00:00+02:00',
                            'formatedDate': '13/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-14',
                        'slidePosition': 217,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 14,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-14T00:00:00+02:00',
                            'formatedDate': '14/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-15',
                        'slidePosition': 218,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 15,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-15T00:00:00+02:00',
                            'formatedDate': '15/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-16',
                        'slidePosition': 219,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 16,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-16T00:00:00+02:00',
                            'formatedDate': '16/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-17',
                        'slidePosition': 220,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 17,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-17T00:00:00+02:00',
                            'formatedDate': '17/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-18',
                        'slidePosition': 221,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 18,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-18T00:00:00+02:00',
                            'formatedDate': '18/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-19',
                        'slidePosition': 222,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 19,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-19T00:00:00+02:00',
                            'formatedDate': '19/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-20',
                        'slidePosition': 223,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 20,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-20T00:00:00+02:00',
                            'formatedDate': '20/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-21',
                        'slidePosition': 224,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 21,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-21T00:00:00+02:00',
                            'formatedDate': '21/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-22',
                        'slidePosition': 225,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 22,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-22T00:00:00+02:00',
                            'formatedDate': '22/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-23',
                        'slidePosition': 226,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 23,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-23T00:00:00+02:00',
                            'formatedDate': '23/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-24',
                        'slidePosition': 227,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 24,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-24T00:00:00+02:00',
                            'formatedDate': '24/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-25',
                        'slidePosition': 228,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 25,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-25T00:00:00+02:00',
                            'formatedDate': '25/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-26',
                        'slidePosition': 229,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 26,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-26T00:00:00+02:00',
                            'formatedDate': '26/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-27',
                        'slidePosition': 230,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 27,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-27T00:00:00+02:00',
                            'formatedDate': '27/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-28',
                        'slidePosition': 231,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 28,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-28T00:00:00+02:00',
                            'formatedDate': '28/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-29',
                        'slidePosition': 232,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 29,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-29T00:00:00+02:00',
                            'formatedDate': '29/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-30',
                        'slidePosition': 233,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 30,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-30T00:00:00+02:00',
                            'formatedDate': '30/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-07-31',
                        'slidePosition': 234,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 31,
                            'monthNumber': 7,
                            'month': 'MONTH_JULY',
                            'year': 2020,
                            'originalDate': '2020-07-31T00:00:00+02:00',
                            'formatedDate': '31/07/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-01',
                        'slidePosition': 235,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 1,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-01T00:00:00+02:00',
                            'formatedDate': '01/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-02',
                        'slidePosition': 236,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 2,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-02T00:00:00+02:00',
                            'formatedDate': '02/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-03',
                        'slidePosition': 237,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 3,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-03T00:00:00+02:00',
                            'formatedDate': '03/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-04',
                        'slidePosition': 238,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 4,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-04T00:00:00+02:00',
                            'formatedDate': '04/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-05',
                        'slidePosition': 239,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 5,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-05T00:00:00+02:00',
                            'formatedDate': '05/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-06',
                        'slidePosition': 240,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 6,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-06T00:00:00+02:00',
                            'formatedDate': '06/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-07',
                        'slidePosition': 241,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 7,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-07T00:00:00+02:00',
                            'formatedDate': '07/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-08',
                        'slidePosition': 242,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 8,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-08T00:00:00+02:00',
                            'formatedDate': '08/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-09',
                        'slidePosition': 243,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 9,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-09T00:00:00+02:00',
                            'formatedDate': '09/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-10',
                        'slidePosition': 244,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 10,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-10T00:00:00+02:00',
                            'formatedDate': '10/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-11',
                        'slidePosition': 245,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 11,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-11T00:00:00+02:00',
                            'formatedDate': '11/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-12',
                        'slidePosition': 246,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 12,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-12T00:00:00+02:00',
                            'formatedDate': '12/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-13',
                        'slidePosition': 247,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 13,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-13T00:00:00+02:00',
                            'formatedDate': '13/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-14',
                        'slidePosition': 248,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 14,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-14T00:00:00+02:00',
                            'formatedDate': '14/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-15',
                        'slidePosition': 249,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 15,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-15T00:00:00+02:00',
                            'formatedDate': '15/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-16',
                        'slidePosition': 250,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 16,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-16T00:00:00+02:00',
                            'formatedDate': '16/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-17',
                        'slidePosition': 251,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 17,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-17T00:00:00+02:00',
                            'formatedDate': '17/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-18',
                        'slidePosition': 252,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 18,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-18T00:00:00+02:00',
                            'formatedDate': '18/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-19',
                        'slidePosition': 253,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 19,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-19T00:00:00+02:00',
                            'formatedDate': '19/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-20',
                        'slidePosition': 254,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 20,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-20T00:00:00+02:00',
                            'formatedDate': '20/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-21',
                        'slidePosition': 255,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 21,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-21T00:00:00+02:00',
                            'formatedDate': '21/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-22',
                        'slidePosition': 256,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 22,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-22T00:00:00+02:00',
                            'formatedDate': '22/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-23',
                        'slidePosition': 257,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 23,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-23T00:00:00+02:00',
                            'formatedDate': '23/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-24',
                        'slidePosition': 258,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 24,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-24T00:00:00+02:00',
                            'formatedDate': '24/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-25',
                        'slidePosition': 259,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 25,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-25T00:00:00+02:00',
                            'formatedDate': '25/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-26',
                        'slidePosition': 260,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 26,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-26T00:00:00+02:00',
                            'formatedDate': '26/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-27',
                        'slidePosition': 261,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 27,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-27T00:00:00+02:00',
                            'formatedDate': '27/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-28',
                        'slidePosition': 262,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 28,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-28T00:00:00+02:00',
                            'formatedDate': '28/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-29',
                        'slidePosition': 263,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 29,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-29T00:00:00+02:00',
                            'formatedDate': '29/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-30',
                        'slidePosition': 264,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 30,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-30T00:00:00+02:00',
                            'formatedDate': '30/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-08-31',
                        'slidePosition': 265,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 31,
                            'monthNumber': 8,
                            'month': 'MONTH_AUGUST',
                            'year': 2020,
                            'originalDate': '2020-08-31T00:00:00+02:00',
                            'formatedDate': '31/08/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-01',
                        'slidePosition': 266,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 1,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-01T00:00:00+02:00',
                            'formatedDate': '01/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-02',
                        'slidePosition': 267,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 2,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-02T00:00:00+02:00',
                            'formatedDate': '02/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-03',
                        'slidePosition': 268,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 3,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-03T00:00:00+02:00',
                            'formatedDate': '03/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-04',
                        'slidePosition': 269,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 4,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-04T00:00:00+02:00',
                            'formatedDate': '04/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-05',
                        'slidePosition': 270,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 5,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-05T00:00:00+02:00',
                            'formatedDate': '05/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-06',
                        'slidePosition': 271,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 6,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-06T00:00:00+02:00',
                            'formatedDate': '06/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-07',
                        'slidePosition': 272,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 7,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-07T00:00:00+02:00',
                            'formatedDate': '07/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-08',
                        'slidePosition': 273,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 8,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-08T00:00:00+02:00',
                            'formatedDate': '08/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-09',
                        'slidePosition': 274,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 9,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-09T00:00:00+02:00',
                            'formatedDate': '09/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-10',
                        'slidePosition': 275,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 10,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-10T00:00:00+02:00',
                            'formatedDate': '10/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-11',
                        'slidePosition': 276,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 11,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-11T00:00:00+02:00',
                            'formatedDate': '11/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-12',
                        'slidePosition': 277,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 12,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-12T00:00:00+02:00',
                            'formatedDate': '12/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-13',
                        'slidePosition': 278,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 13,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-13T00:00:00+02:00',
                            'formatedDate': '13/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-14',
                        'slidePosition': 279,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 14,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-14T00:00:00+02:00',
                            'formatedDate': '14/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-15',
                        'slidePosition': 280,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-15T00:00:00+02:00',
                            'formatedDate': '15/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-16',
                        'slidePosition': 281,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 16,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-16T00:00:00+02:00',
                            'formatedDate': '16/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-17',
                        'slidePosition': 282,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 17,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-17T00:00:00+02:00',
                            'formatedDate': '17/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-18',
                        'slidePosition': 283,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 18,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-18T00:00:00+02:00',
                            'formatedDate': '18/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-19',
                        'slidePosition': 284,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 19,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-19T00:00:00+02:00',
                            'formatedDate': '19/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-20',
                        'slidePosition': 285,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 20,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-20T00:00:00+02:00',
                            'formatedDate': '20/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-21',
                        'slidePosition': 286,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 21,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-21T00:00:00+02:00',
                            'formatedDate': '21/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-22',
                        'slidePosition': 287,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 22,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-22T00:00:00+02:00',
                            'formatedDate': '22/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-23',
                        'slidePosition': 288,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 23,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-23T00:00:00+02:00',
                            'formatedDate': '23/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-24',
                        'slidePosition': 289,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 24,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-24T00:00:00+02:00',
                            'formatedDate': '24/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-25',
                        'slidePosition': 290,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 25,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-25T00:00:00+02:00',
                            'formatedDate': '25/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-26',
                        'slidePosition': 291,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 26,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-26T00:00:00+02:00',
                            'formatedDate': '26/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-27',
                        'slidePosition': 292,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 27,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-27T00:00:00+02:00',
                            'formatedDate': '27/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-28',
                        'slidePosition': 293,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 28,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-28T00:00:00+02:00',
                            'formatedDate': '28/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-29',
                        'slidePosition': 294,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 29,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-29T00:00:00+02:00',
                            'formatedDate': '29/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-09-30',
                        'slidePosition': 295,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 30,
                            'monthNumber': 9,
                            'month': 'MONTH_SEPTEMBER',
                            'year': 2020,
                            'originalDate': '2020-09-30T00:00:00+02:00',
                            'formatedDate': '30/09/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-01',
                        'slidePosition': 296,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 1,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-01T00:00:00+02:00',
                            'formatedDate': '01/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-02',
                        'slidePosition': 297,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 2,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-02T00:00:00+02:00',
                            'formatedDate': '02/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-03',
                        'slidePosition': 298,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 3,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-03T00:00:00+02:00',
                            'formatedDate': '03/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-04',
                        'slidePosition': 299,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 4,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-04T00:00:00+02:00',
                            'formatedDate': '04/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-05',
                        'slidePosition': 300,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 5,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-05T00:00:00+02:00',
                            'formatedDate': '05/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-06',
                        'slidePosition': 301,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 6,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-06T00:00:00+02:00',
                            'formatedDate': '06/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-07',
                        'slidePosition': 302,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 7,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-07T00:00:00+02:00',
                            'formatedDate': '07/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-08',
                        'slidePosition': 303,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 8,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-08T00:00:00+02:00',
                            'formatedDate': '08/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-09',
                        'slidePosition': 304,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 9,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-09T00:00:00+02:00',
                            'formatedDate': '09/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-10',
                        'slidePosition': 305,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 10,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-10T00:00:00+02:00',
                            'formatedDate': '10/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-11',
                        'slidePosition': 306,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 11,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-11T00:00:00+02:00',
                            'formatedDate': '11/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-12',
                        'slidePosition': 307,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 12,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-12T00:00:00+02:00',
                            'formatedDate': '12/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-13',
                        'slidePosition': 308,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 13,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-13T00:00:00+02:00',
                            'formatedDate': '13/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-14',
                        'slidePosition': 309,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 14,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-14T00:00:00+02:00',
                            'formatedDate': '14/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-15',
                        'slidePosition': 310,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 15,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-15T00:00:00+02:00',
                            'formatedDate': '15/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-16',
                        'slidePosition': 311,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 16,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-16T00:00:00+02:00',
                            'formatedDate': '16/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-17',
                        'slidePosition': 312,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 17,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-17T00:00:00+02:00',
                            'formatedDate': '17/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-18',
                        'slidePosition': 313,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 18,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-18T00:00:00+02:00',
                            'formatedDate': '18/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-19',
                        'slidePosition': 314,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 19,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-19T00:00:00+02:00',
                            'formatedDate': '19/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-20',
                        'slidePosition': 315,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 20,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-20T00:00:00+02:00',
                            'formatedDate': '20/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-21',
                        'slidePosition': 316,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 21,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-21T00:00:00+02:00',
                            'formatedDate': '21/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-22',
                        'slidePosition': 317,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 22,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-22T00:00:00+02:00',
                            'formatedDate': '22/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-23',
                        'slidePosition': 318,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 23,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-23T00:00:00+02:00',
                            'formatedDate': '23/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-24',
                        'slidePosition': 319,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 24,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-24T00:00:00+02:00',
                            'formatedDate': '24/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-25',
                        'slidePosition': 320,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 25,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-25T00:00:00+02:00',
                            'formatedDate': '25/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-26',
                        'slidePosition': 321,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 26,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-26T00:00:00+01:00',
                            'formatedDate': '26/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-27',
                        'slidePosition': 322,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 27,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-27T00:00:00+01:00',
                            'formatedDate': '27/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-28',
                        'slidePosition': 323,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 28,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-28T00:00:00+01:00',
                            'formatedDate': '28/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-29',
                        'slidePosition': 324,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 29,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-29T00:00:00+01:00',
                            'formatedDate': '29/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-30',
                        'slidePosition': 325,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 30,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-30T00:00:00+01:00',
                            'formatedDate': '30/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-10-31',
                        'slidePosition': 326,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 31,
                            'monthNumber': 10,
                            'month': 'MONTH_OCTOBER',
                            'year': 2020,
                            'originalDate': '2020-10-31T00:00:00+01:00',
                            'formatedDate': '31/10/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-01',
                        'slidePosition': 327,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 1,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-01T00:00:00+01:00',
                            'formatedDate': '01/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-02',
                        'slidePosition': 328,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 2,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-02T00:00:00+01:00',
                            'formatedDate': '02/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-03',
                        'slidePosition': 329,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 3,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-03T00:00:00+01:00',
                            'formatedDate': '03/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-04',
                        'slidePosition': 330,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 4,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-04T00:00:00+01:00',
                            'formatedDate': '04/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-05',
                        'slidePosition': 331,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 5,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-05T00:00:00+01:00',
                            'formatedDate': '05/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-06',
                        'slidePosition': 332,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 6,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-06T00:00:00+01:00',
                            'formatedDate': '06/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-07',
                        'slidePosition': 333,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 7,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-07T00:00:00+01:00',
                            'formatedDate': '07/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-08',
                        'slidePosition': 334,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 8,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-08T00:00:00+01:00',
                            'formatedDate': '08/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-09',
                        'slidePosition': 335,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 9,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-09T00:00:00+01:00',
                            'formatedDate': '09/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-10',
                        'slidePosition': 336,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 10,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-10T00:00:00+01:00',
                            'formatedDate': '10/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-11',
                        'slidePosition': 337,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 11,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-11T00:00:00+01:00',
                            'formatedDate': '11/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-12',
                        'slidePosition': 338,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 12,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-12T00:00:00+01:00',
                            'formatedDate': '12/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-13',
                        'slidePosition': 339,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 13,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-13T00:00:00+01:00',
                            'formatedDate': '13/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-14',
                        'slidePosition': 340,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 14,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-14T00:00:00+01:00',
                            'formatedDate': '14/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-15',
                        'slidePosition': 341,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 15,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-15T00:00:00+01:00',
                            'formatedDate': '15/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-16',
                        'slidePosition': 342,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 16,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-16T00:00:00+01:00',
                            'formatedDate': '16/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-17',
                        'slidePosition': 343,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 17,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-17T00:00:00+01:00',
                            'formatedDate': '17/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-18',
                        'slidePosition': 344,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 18,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-18T00:00:00+01:00',
                            'formatedDate': '18/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-19',
                        'slidePosition': 345,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 19,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-19T00:00:00+01:00',
                            'formatedDate': '19/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-20',
                        'slidePosition': 346,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 20,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-20T00:00:00+01:00',
                            'formatedDate': '20/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-21',
                        'slidePosition': 347,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 21,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-21T00:00:00+01:00',
                            'formatedDate': '21/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-22',
                        'slidePosition': 348,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 22,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-22T00:00:00+01:00',
                            'formatedDate': '22/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-23',
                        'slidePosition': 349,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 23,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-23T00:00:00+01:00',
                            'formatedDate': '23/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-24',
                        'slidePosition': 350,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 24,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-24T00:00:00+01:00',
                            'formatedDate': '24/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-25',
                        'slidePosition': 351,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 25,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-25T00:00:00+01:00',
                            'formatedDate': '25/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-26',
                        'slidePosition': 352,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 26,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-26T00:00:00+01:00',
                            'formatedDate': '26/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-27',
                        'slidePosition': 353,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 27,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-27T00:00:00+01:00',
                            'formatedDate': '27/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-28',
                        'slidePosition': 354,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 28,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-28T00:00:00+01:00',
                            'formatedDate': '28/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-29',
                        'slidePosition': 355,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 29,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-29T00:00:00+01:00',
                            'formatedDate': '29/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-11-30',
                        'slidePosition': 356,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 30,
                            'monthNumber': 11,
                            'month': 'MONTH_NOVEMBER',
                            'year': 2020,
                            'originalDate': '2020-11-30T00:00:00+01:00',
                            'formatedDate': '30/11/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-12-01',
                        'slidePosition': 357,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 1,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-01T00:00:00+01:00',
                            'formatedDate': '01/12/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-12-02',
                        'slidePosition': 358,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 2,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-02T00:00:00+01:00',
                            'formatedDate': '02/12/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-12-03',
                        'slidePosition': 359,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 3,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-03T00:00:00+01:00',
                            'formatedDate': '03/12/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-12-04',
                        'slidePosition': 360,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 4,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-04T00:00:00+01:00',
                            'formatedDate': '04/12/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-12-05',
                        'slidePosition': 361,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SATURDAY',
                            'day': 5,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-05T00:00:00+01:00',
                            'formatedDate': '05/12/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-12-06',
                        'slidePosition': 362,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_SUNDAY',
                            'day': 6,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-06T00:00:00+01:00',
                            'formatedDate': '06/12/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-12-07',
                        'slidePosition': 363,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_MONDAY',
                            'day': 7,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-07T00:00:00+01:00',
                            'formatedDate': '07/12/2020'
                        },
                        'state': 'LOADING'
                    },
                    {
                        'serviceDate': '2020-12-08',
                        'slidePosition': 364,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 8,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-08T00:00:00+01:00',
                            'formatedDate': '08/12/2020'
                        },
                        'state': 'DISABLED'
                    },
                    {
                        'serviceDate': '2020-12-09',
                        'slidePosition': 365,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_WEDNESDAY',
                            'day': 9,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-09T00:00:00+01:00',
                            'formatedDate': '09/12/2020'
                        },
                        'state': 'DISABLED'
                    },
                    {
                        'serviceDate': '2020-12-10',
                        'slidePosition': 366,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_THURSDAY',
                            'day': 10,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-10T00:00:00+01:00',
                            'formatedDate': '10/12/2020'
                        },
                        'state': 'DISABLED'
                    },
                    {
                        'serviceDate': '2020-12-11',
                        'slidePosition': 367,
                        'date': {
                            'dateTime': '',
                            'weekDay': 'WEEKDAY_FRYDAY',
                            'day': 11,
                            'monthNumber': 12,
                            'month': 'MONTH_DECEMBER',
                            'year': 2020,
                            'originalDate': '2020-12-11T00:00:00+01:00',
                            'formatedDate': '11/12/2020'
                        },
                        'state': 'DISABLED',
                        'lastItem': true
                    }
                ]
            },
            'checked': true,
            'initialSlideIndex': 7
        }
    ];

    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy(),

    };

    let fakeMmBUtilsSharedService = {
        'generateRequestFlexibilization': jasmine.createSpy(),
        'updateSisterCitiesModel': jasmine.createSpy(),
        'updateQuadrigam': jasmine.createSpy(),
    };

    var fakeIbFlexibilizationService = {
        'callGetAvailability': jasmine.createSpy('callGetAvailability').and.callFake(() =>  {
            var deferred = $q.defer();
            deferred.resolve({
                model: {
                    order: {
                        status: true
                    }
                }
            });

            return deferred.promise;
        })
    };
    var fakeIbFlexFlexibilizationTransformer = {
        'getModelFlighVC': jasmine.createSpy(),
        'getBuildModelVC': jasmine.createSpy(),
        'generateRequestFlexibilization': jasmine.createSpy('generateRequestFlexibilization').and.callFake(() =>  {
            return { 'prueba': 'prueba' };
        })
    };

    var fakeMmBModalService = {
        'showWaitingModal': jasmine.createSpy(),
        'finishWaiting': jasmine.createSpy(),
        'showVoluntaryChangeModal': jasmine.createSpy(),
        'showFullModal': jasmine.createSpy('showFullModal').and.callFake(() =>  {
            var deferred = $q.defer();
            deferred.resolve(true);
            return { 'result': deferred.promise };
        }),
        'showGenericInfoModal': jasmine.createSpy('showGenericInfoModal').and.callFake(() =>  {
            var deferred = $q.defer();
            deferred.resolve(true);
            return { 'result': deferred.promise };
        }),
        'showGenericError': jasmine.createSpy(),
    };

    var fakeMmBAppConstants = {
        'templatesRoute': 'web-manage-my-booking/templates/',
        'LIMIT_DATE': {
            'FLEXIBILIZATION_CHANGES': '2021, 4, 30'
        },
        QUADRIGAM: {
            FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR: 'CVFERB',
            FLEXIBILIZATION_NOT_AVAILABILITY: 'CVFERR',
            FLEXIBILIZATION_AVAILABILITY_SERVICE_ERROR: 'CVFERD'
        },
        WCS: {
            'PHONE_TYPES': {
                'SALES': 'RESERVAS',
                'IBHOLIDAYS': 'ATTBAH'
            }
        },
        COMMON_LABELS: {
            CHANNEL: {
                IBCOM: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_DIRECT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_INDIRECT: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                CALL_CENTER: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                OTHER: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                DEFAULT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                }


            }
        },
    };

    var fakeVoluntaryChangesTransformer = {
        'searchFlights': jasmine.createSpy(),
        'generateFlightsModelRibbon': jasmine.createSpy('generateFlightsModelRibbon').and.callFake(() =>  {
            return dataModelRibbon;
        })
    };
    var fakeVoluntaryChangesService = {
        'getAvailability': jasmine.createSpy('getAvailability').and.callFake(() =>  {
            var deferred = $q.defer();
            deferred.resolve({
                model: {
                    order: {
                        status: true
                    }
                }
            });

            return deferred.promise;
        })
    };
    var fakeLocalStorageService = {
        'isSupported': false,
        'set': jasmine.createSpy('set').and.callFake(angular.noop),
        'get': jasmine.createSpy('get').and.callFake((id) => {
            var res ={
                'RESERVAS' : {
                    'prefix': '(+34)',
                    'telephone': '901 111 500',
                    'text': 'Reservas y Venta:',
                    'prefixAlt': '',
                    'telephoneAlt': '',
                    'textAlt': '',
                    'timeText': '24h'
                }
            };
            return id === 'phonesList'?res:id;
        }),
        'remove': jasmine.createSpy('remove').and.callFake(angular.noop)
    };
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            VIEW: 'VIEW'
        }
    };
    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    };
    var mockTranslateFilter = (value) => {
        switch (value) {
            default:
                return 'Tenemos problemas con tu petición, por favor, vuelve a intentarlo desde el principio';
        }
    };
    beforeEach(() =>  {
        angular.mock.module('ib-flexibilization-module', 'ib-flexibilization-search-module', 'LocalStorageModule', ($provide) => {
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('IbFlexibilizationService', fakeIbFlexibilizationService);
            $provide.value('IbFlexFlexibilizationTransformer', fakeIbFlexFlexibilizationTransformer);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('VoluntaryChangesTransformer', fakeVoluntaryChangesTransformer);
            $provide.value('VoluntaryChangesService', fakeVoluntaryChangesService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('CommonsUtilService',fakeCommonsUtilService);
            $provide.value('translateFilter', mockTranslateFilter);
        });
    });
    describe('When IbFlexibilizationSearchController is called, activate() function is launched', () =>  {
        var $injector;
        var IbFlexFlexibilizationTransformer;
        var IbFlexibilizationService;
        var MmBDatalayerUtilsService;
        var MmBUtilsSharedService;
        var $controller
        var $rootScope;
        var $scope;
        var MmBModalService;
        var VoluntaryChangesTransformer;

        beforeEach(() =>  {

            inject((_$injector_, _$controller_) => {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce((clone, key) => { clone[key] = _$injector_[key]; return clone }, {});

                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                IbFlexFlexibilizationTransformer = $injector.get('IbFlexFlexibilizationTransformer');
                IbFlexibilizationService = $injector.get('IbFlexibilizationService');
                MmBDatalayerUtilsService = $injector.get('MmBDatalayerUtilsService');
                VoluntaryChangesTransformer = $injector.get('VoluntaryChangesTransformer');
                MmBUtilsSharedService = $injector.get('MmBUtilsSharedService');
                MmBModalService = $injector.get('MmBModalService');
                controller = $controller('IbFlexibilizationSearchController', {
                    $scope: $scope,
                    MmBModalService: MmBModalService,
                    VoluntaryChangesTransformer: VoluntaryChangesTransformer,
                    IbFlexFlexibilizationTransformer: IbFlexFlexibilizationTransformer,
                    IbFlexibilizationService: IbFlexibilizationService,
                    MmBDatalayerUtilsService: MmBDatalayerUtilsService,
                    MmBUtilsSharedService: MmBUtilsSharedService
                });
            });
        });

        it('Should asign data to model', () =>  {
            controller.routeDatepicker = 'web-manage-my-booking/templates/ib-mmb-datepicker.html';
            expect(controller).toBeDefined();
            spyOn(controller, '$onInit');
            controller.$onInit();
            expect(controller.$onInit).toHaveBeenCalledWith();
            expect(controller.routeDatepicker).toBe('web-manage-my-booking/templates/ib-mmb-datepicker.html');
        });

        it('Should modified the model data with new Date ', () =>  {

            controller.flights =
            {
                'MADBIO20211124115500': { 'departureCity': { 'code': 'MAD', 'name': 'BARAJAS', 'terminal': '4', 'city': { 'code': 'MAD', 'description': 'Madrid', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'arrivalCity': { 'code': 'BIO', 'name': 'AIRPORT', 'terminal': null, 'city': { 'code': 'BIO', 'description': 'Bilbao', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'departureCountry': 'ES', 'arrivalCountry': 'ES', 'segments': [{ 'departureCity': { 'code': 'MAD', 'name': 'BARAJAS', 'terminal': '4', 'city': { 'code': 'MAD', 'description': 'Madrid', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'arrivalCity': { 'code': 'BIO', 'name': 'AIRPORT', 'terminal': null, 'city': { 'code': 'BIO', 'description': 'Bilbao', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'departureDateParsed': { 'dateTime': '11:55', 'weekDay': 'WEEKDAY_WEDNESDAY', 'day': 24, 'monthNumber': 11, 'month': 'MONTH_NOVEMBER', 'year': 2021, 'originalDate': '2021-11-24T11:55:00+01:00', 'formatedDate': '11/24/2021' }, 'arrivalDateParsed': { 'dateTime': '13:00', 'weekDay': 'WEEKDAY_WEDNESDAY', 'day': 24, 'monthNumber': 11, 'month': 'MONTH_NOVEMBER', 'year': 2021, 'originalDate': '2021-11-24T13:00:00+01:00', 'formatedDate': '11/24/2021' }, 'companyURL': '/aerolineas/logo_pos_IB.svg', 'overnight': false, 'departureDateTimeParsed': '11:55', 'arrivalDateTimeParsed': '13:00', 'departure': { 'code': 'MAD', 'name': 'BARAJAS', 'terminal': '4', 'city': { 'code': 'MAD', 'description': 'Madrid', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'arrival': { 'code': 'BIO', 'name': 'AIRPORT', 'terminal': null, 'city': { 'code': 'BIO', 'description': 'Bilbao', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'flight': { 'marketingCarrier': { 'code': 'IB', 'name': 'Iberia' }, 'operationalCarrier': { 'code': 'IB', 'name': 'Iberia' }, 'marketingFlightNumber': '0426', 'operationalFlightNumber': '', 'operationalDisclosure': 'IB', 'aircraft': { 'code': '320', 'description': 'Airbus A320' } }, 'durationParsed': '01h 5min.', 'fareFamilyConditions': [{ 'cabin': 'Basic', 'cabinType': 'E', 'code': 'EQMANO', 'name': 'Hand baggage', 'title': '1 piece in the cabin  (56x40x25cm)', 'message': ' 1 piece (56x40x25cm)', 'units': 1, '$$hashKey': 'object:171' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'EQBODEGA', 'name': 'Baggage in hold', 'title': 'Baggage in the hold at a cost', 'message': 'Not included. ', 'units': null, '$$hashKey': 'object:172' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'ASIENTO', 'name': 'Seat  selection', 'title': 'Can be selected for a fee       ', 'message': 'For a fee', 'units': null, '$$hashKey': 'object:173' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'CAMBIO', 'name': 'Change', 'title': 'Change permitted at a cost', 'message': 'Allowed at any time with a penalty of €65, except in the case of not showing up for the flight (no-show), which does not allow change', 'units': 65, '$$hashKey': 'object:174' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'REEMBOLSO', 'name': 'refund (in each direction)', 'title': 'No refunds', 'message': 'No refunds', 'units': null, '$$hashKey': 'object:175' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'TARJEMBANTIC', 'name': 'Early check-in', 'title': 'Not included', 'message': 'Not included', 'units': null, '$$hashKey': 'object:176' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'EMBARQUE', 'name': 'Priority Boarding ', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:177' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'SALAVIP', 'name': 'Access to VIP lounges', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:178' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'CABINA', 'name': ' Cabin', 'title': '', 'message': 'Economy', 'units': null, '$$hashKey': 'object:179' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'CHECKINDESK', 'name': 'Exclusive check-in counter', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:180' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'ASIENTOXL', 'name': 'Selection of an XL seat', 'title': 'Can be selected at a cost         ', 'message': 'Payable', 'units': null, '$$hashKey': 'object:181' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'FASTTRACK', 'name': 'Fast Track', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:182' }, { 'cabin': 'Basic', 'cabinType': 'E', 'code': 'EQPPRIOR', 'name': 'Priority baggage delivery', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:183' }], 'segmentId': 'IB042620211124', 'sliceId': 'MADBIO20211124115500', 'status': { 'code': 'HK', 'description': 'Holding confirmed' }, 'cabin': { 'rbd': 'A', 'description': 'Economy', 'remainingSeats': null, 'fareFamily': 'TBAESES', 'code': 'R', 'type': 'ECONOMY', 'bookingClass': 'ECONOMY' }, 'flown': false, 'warnings': {}, 'stop': null }], 'departureDateParsed': { 'dateTime': '11:55', 'weekDay': 'WEEKDAY_WEDNESDAY', 'day': 24, 'monthNumber': 11, 'month': 'MONTH_NOVEMBER', 'year': 2021, 'originalDate': '2021-11-24T11:55:00+01:00', 'formatedDate': '11/24/2021' }, 'arrivalDateParsed': { 'dateTime': '13:00', 'weekDay': 'WEEKDAY_WEDNESDAY', 'day': 24, 'monthNumber': 11, 'month': 'MONTH_NOVEMBER', 'year': 2021, 'originalDate': '2021-11-24T13:00:00+01:00', 'formatedDate': '11/24/2021' }, 'durationParsed': '01h 5min.', 'stopsNumber': 0, 'daysToGo': 168, 'checked': true, 'parseNewDateSelected': {'year':2033, 'month':10, 'day':1 } }, 'BIOMAD20211127064500': {
                    'departureCity': { 'code': 'BIO', 'name': 'AIRPORT', 'terminal': null, 'city': { 'code': 'BIO', 'description': 'Bilbao', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'arrivalCity': { 'code': 'MAD', 'name': 'BARAJAS', 'terminal': '4', 'city': { 'code': 'MAD', 'description': 'Madrid', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'departureCountry': 'ES', 'arrivalCountry': 'ES', 'segments': [{ 'departureCity': { 'code': 'BIO', 'name': 'AIRPORT', 'terminal': null, 'city': { 'code': 'BIO', 'description': 'Bilbao', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'arrivalCity': { 'code': 'MAD', 'name': 'BARAJAS', 'terminal': '4', 'city': { 'code': 'MAD', 'description': 'Madrid', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'departureDateParsed': { 'dateTime': '06:45', 'weekDay': 'WEEKDAY_SATURDAY', 'day': 27, 'monthNumber': 11, 'month': 'MONTH_NOVEMBER', 'year': 2021, 'originalDate': '2021-11-27T06:45:00+01:00', 'formatedDate': '11/27/2021' }, 'arrivalDateParsed': { 'dateTime': '07:55', 'weekDay': 'WEEKDAY_SATURDAY', 'day': 27, 'monthNumber': 11, 'month': 'MONTH_NOVEMBER', 'year': 2021, 'originalDate': '2021-11-27T07:55:00+01:00', 'formatedDate': '11/27/2021' }, 'companyURL': '/aerolineas/logo_pos_IB.svg', 'overnight': false, 'departureDateTimeParsed': '06:45', 'arrivalDateTimeParsed': '07:55', 'departure': { 'code': 'BIO', 'name': 'AIRPORT', 'terminal': null, 'city': { 'code': 'BIO', 'description': 'Bilbao', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'arrival': { 'code': 'MAD', 'name': 'BARAJAS', 'terminal': '4', 'city': { 'code': 'MAD', 'description': 'Madrid', 'countryCode': 'ES', 'country': { 'code': 'ES', 'description': 'Spain' } } }, 'flight': { 'marketingCarrier': { 'code': 'IB', 'name': 'Iberia' }, 'operationalCarrier': { 'code': 'IB', 'name': 'Iberia' }, 'marketingFlightNumber': '0443', 'operationalFlightNumber': '', 'operationalDisclosure': 'IB', 'aircraft': { 'code': '320', 'description': 'Airbus A320' } }, 'durationParsed': '01h 10min.', 'fareFamilyConditions': [{ 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'EQMANO', 'name': 'Hand baggage', 'title': '1 piece in the cabin  (56x40x25cm)', 'message': ' 1 piece (56x40x25cm)', 'units': 1, '$$hashKey': 'object:203' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'EQBODEGA', 'name': 'Baggage in hold', 'title': '1 piece in the hold', 'message': '1 piece Max: 23 kg and 158 cm. ', 'units': 1, '$$hashKey': 'object:204' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'ASIENTO', 'name': 'Seat  selection', 'title': 'With seat selection', 'message': 'Included', 'units': null, '$$hashKey': 'object:205' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'CAMBIO', 'name': 'Change', 'title': 'First change allowed up to 15 days. Next changes with cost €45. No Show does not allow change', 'message': 'First change: Allowed without penalty up to 15 days before departure. Subsequent changes: Allowed at any time with a penalty of €45, except in the case of no shows, which do not allow any changes', 'units': 45, '$$hashKey': 'object:206' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'REEMBOLSO', 'name': 'refund (in each direction)', 'title': 'Refund of 80% of the fare in the form of a voucher allowed up to 15 days before departure', 'message': 'Refund of 80% of the fare in the form of a voucher allowed up to 15 days before departure', 'units': 80, '$$hashKey': 'object:207' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'ASIENTOXL', 'name': 'Selection of an XL seat', 'title': 'With seat selection', 'message': 'Included', 'units': null, '$$hashKey': 'object:208' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'SALAVIP', 'name': 'Access to VIP lounges', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:209' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'TARJEMBANTIC', 'name': 'Early check-in', 'title': 'With Early check-in', 'message': 'Included', 'units': null, '$$hashKey': 'object:210' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'CABINA', 'name': ' Cabin', 'title': '', 'message': 'Economy', 'units': null, '$$hashKey': 'object:211' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'CHECKINDESK', 'name': 'Exclusive check-in counter', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:212' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'EMBARQUE', 'name': 'Priority Boarding ', 'title': '', 'message': 'Yes, group 2', 'units': 2, '$$hashKey': 'object:213' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'FASTTRACK', 'name': 'Fast Track', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:214' }, { 'cabin': 'Comfort', 'cabinType': 'E', 'code': 'EQPPRIOR', 'name': 'Priority baggage delivery', 'title': '', 'message': 'No', 'units': null, '$$hashKey': 'object:215' }], 'segmentId': 'IB044320211127', 'sliceId': 'BIOMAD20211127064500', 'status': { 'code': 'HK', 'description': 'Holding confirmed' }, 'cabin': { 'rbd': 'A', 'description': 'Economy', 'remainingSeats': null, 'fareFamily': 'COTCLESES', 'code': 'R', 'type': 'ECONOMY', 'bookingClass': 'ECONOMY' }, 'flown': false, 'warnings': {}, 'stop': null }], 'departureDateParsed': { 'dateTime': '06:45', 'weekDay': 'WEEKDAY_SATURDAY', 'day': 27, 'monthNumber': 11, 'month': 'MONTH_NOVEMBER', 'year': 2021, 'originalDate': '2021-11-27T06:45:00+01:00', 'formatedDate': '11/27/2021' }, 'arrivalDateParsed': { 'dateTime': '07:55', 'weekDay': 'WEEKDAY_SATURDAY', 'day': 27, 'monthNumber': 11, 'month': 'MONTH_NOVEMBER', 'year': 2021, 'originalDate': '2021-11-27T07:55:00+01:00', 'formatedDate': '11/27/2021' }, 'durationParsed': '01h 10min.', 'stopsNumber': 0, 'daysToGo': 171, 'checked': false, 'parseNewDateSelected': {'year':2033, 'month':10,'day':9}
                }
            };
            controller.showSisterCitiesCheck = false;
            controller.isVoluntaryFlexible = null;
            controller.blackOutDates = {
                maxDate: '2022-06-08T13:13:10.248Z'
            }
            controller.dateOptions = {
                'showWeeks': false,
                'maxMode': 'day',
                'minDate': '2021-06-08T13:13:20.036Z',
                'maxDate': '2022-06-08T13:13:10.248Z'
            };
            controller.$onInit();
            expect(fakeLocalStorageService.get('showSisterCitiesPossibility')).toEqual('showSisterCitiesPossibility');
            expect(fakeLocalStorageService.get('reshopConditions')).toEqual('reshopConditions');
            expect(controller.changeDate).toBeDefined();
            expect(controller.searchAvailable).toBe(false);
        });

        describe('test for IbFlexibilizationSearchController.searchChangesFlights', () =>  {
            beforeEach(() =>  {
                inject((_$q_) => {
                    var $q = _$q_;
                    controller.sisterCitiesAvailability = {
                        newSisterCities: {
                            sisterCitiesOptionChecked: false
                        }
                    };
                    fakeIbFlexibilizationService.callGetAvailability = jasmine.createSpy('callGetAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve({
                            model: {
                                order: {
                                    status: true
                                }
                            }
                        });

                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() =>  {
                        return {
                            result: $q.when({})
                        };
                    });
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return { 'result': deferred.promise };
                    });
                    fakeVoluntaryChangesService.getAvailability = jasmine.createSpy('getAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve({
                            originDestinations: 'test',
                            modeFlight: {},
                            flightsLength: {}
                        });
                        return deferred.promise;
                    });
                    fakeIbFlexFlexibilizationTransformer.getModelFlighVC = jasmine.createSpy('getModelFlighVC').and.callFake(() =>  {
                        return {test: 'test'}
                    });
                    fakeVoluntaryChangesTransformer.generateFlightsModelRibbon = jasmine.createSpy('generateFlightsModelRibbon').and.callFake(() =>  {
                        return [{calendarData: {selectedSlide: true, slides: [{}]}, index: 0}]
                    });
                })
            });
            it('Should return request data model', () =>  {
                controller.searchAvailable = true;
                controller.sisterCitiesAvailability = {
                    newSisterCities: {
                        disruptedSlices: ['test'],
                        test: {
                            origin: {
                                originSisterCities: [{
                                    isSelected: true
                                }]
                            },
                            destination: {
                                destinationSisterCities: [{
                                    isSelected: true
                                }]
                            }
                        }
                    }
                }
                controller.flags = {
                    showFlexibilizationChangeSection: true,
                    dateLimit : {
                        verifyDate:true,
                        channel :'IBCOM'
                    }
                };
                controller.showSisterCitiesMenu = true;
                controller.searchChangesFlights();
                fakeIbFlexibilizationService.callGetAvailability().then((responseData) => {
                    expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
                    expect(fakeMmBModalService.showFullModal).toHaveBeenCalled();
                }, angular.noop);
                $rootScope.$digest();
            });

            it('Should return request data model (showFlexibilizationChangeSection is false and showVoluntaryChangeFlightSection true) and resolve', () =>  {
                controller.searchAvailable = true;
                controller.flights = {
                    'a': 'testa',
                    'b': 'testb',
                    'c': 'testc'
                };
                controller.flags = {
                    showFlexibilizationChangeSection: false,
                    showVoluntaryChangeFlightSection: true,
                    dateLimit : {
                        verifyDate:true,
                        channel :'IBCOM'
                    }
                };

                controller.searchChangesFlights();
                fakeIbFlexibilizationService.callGetAvailability().then((responseData) => {
                    // expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
                    // expect(fakeMmBModalService.showFullModal).toHaveBeenCalled();
                }, angular.noop);
                $rootScope.$digest();
            });



        });

        describe('test for IbFlexibilizationSearchController.searchChangesFlights and reject getAvailability', () =>  {
            beforeEach(() =>  {
                inject((_$q_) => {
                    var $q = _$q_;
                    controller.sisterCitiesAvailability = {
                        newSisterCities: {
                            sisterCitiesOptionChecked: false
                        }
                    };
                    fakeIbFlexibilizationService.callGetAvailability = jasmine.createSpy('callGetAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve({
                            model: {
                                order: {
                                    status: true
                                }
                            }
                        });

                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() =>  {
                        return {
                            result: $q.when({})
                        };
                    });
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return { 'result': deferred.promise };
                    });
                    fakeVoluntaryChangesService.getAvailability = jasmine.createSpy('getAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.reject({
                            internalErrorCode: 'other'
                        });
                        return deferred.promise;
                    });
                    fakeIbFlexFlexibilizationTransformer.getModelFlighVC = jasmine.createSpy('getModelFlighVC').and.callFake(() =>  {
                        return {test: 'test'}
                    });
                    fakeVoluntaryChangesTransformer.generateFlightsModelRibbon = jasmine.createSpy('generateFlightsModelRibbon').and.callFake(() =>  {
                        return [{calendarData: {selectedSlide: true, slides: [{}]}, index: 0}]
                    });
                })
            });

            it('Should return request data model (showFlexibilizationChangeSection is false and showVoluntaryChangeFlightSection true) and reject', () =>  {
                controller.searchAvailable = true;
                controller.flights = {
                    'a': 'testa',
                    'b': 'testb',
                    'c': 'testc'
                };
                controller.flags = {
                    showFlexibilizationChangeSection: false,
                    showVoluntaryChangeFlightSection: true,
                    dateLimit : {
                        verifyDate:true,
                        channel :'IBCOM'
                    }
                };

                controller.searchChangesFlights();
                fakeIbFlexibilizationService.callGetAvailability().then((responseData) => {
                    // expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
                    // expect(fakeMmBModalService.showFullModal).toHaveBeenCalled();
                }, angular.noop);
                $rootScope.$digest();
            });
        });

        describe('test for IbFlexibilizationSearchController.searchChangesFlights and reject getAvailability and SSE_AVM_13017', () =>  {
            beforeEach(() =>  {
                inject((_$q_) => {
                    var $q = _$q_;
                    controller.sisterCitiesAvailability = {
                        newSisterCities: {
                            sisterCitiesOptionChecked: false
                        }
                    };
                    fakeIbFlexibilizationService.callGetAvailability = jasmine.createSpy('callGetAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve({
                            model: {
                                order: {
                                    status: true
                                }
                            }
                        });

                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() =>  {
                        return {
                            result: $q.when({})
                        };
                    });
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return { 'result': deferred.promise };
                    });
                    fakeVoluntaryChangesService.getAvailability = jasmine.createSpy('getAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.reject({
                            internalErrorCode: 'SSE_AVM_13017'
                        });
                        return deferred.promise;
                    });
                    fakeIbFlexFlexibilizationTransformer.getModelFlighVC = jasmine.createSpy('getModelFlighVC').and.callFake(() =>  {
                        return {test: 'test'}
                    });
                    fakeVoluntaryChangesTransformer.generateFlightsModelRibbon = jasmine.createSpy('generateFlightsModelRibbon').and.callFake(() =>  {
                        return [{calendarData: {selectedSlide: true, slides: [{}]}, index: 0}]
                    });
                })
            });

            it('Should return request data model (showFlexibilizationChangeSection is false and showVoluntaryChangeFlightSection true) and reject 13017', () =>  {
                controller.searchAvailable = true;
                controller.flights = {
                    'a': 'testa',
                    'b': 'testb',
                    'c': 'testc'
                };
                controller.flags = {
                    showFlexibilizationChangeSection: false,
                    showVoluntaryChangeFlightSection: true,
                    dateLimit : {
                        verifyDate:true,
                        channel :'IBCOM'
                    }
                };

                controller.searchChangesFlights();
                fakeIbFlexibilizationService.callGetAvailability().then((responseData) => {
                    // expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
                    // expect(fakeMmBModalService.showFullModal).toHaveBeenCalled();
                }, angular.noop);
                $rootScope.$digest();
            });
        });

        describe('test for IbFlexibilizationSearchController.searchChangesFlights', () =>  {
            beforeEach(() =>  {
                inject((_$q_) => {
                    var $q = _$q_;
                    controller.sisterCitiesAvailability = {
                        newSisterCities: {
                            sisterCitiesOptionChecked: false
                        }
                    };
                    var error = { errorCode: 400, internalErrorCode: 'SSE_AVM_18002' }
                    fakeIbFlexibilizationService.callGetAvailability = jasmine.createSpy('callGetAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.reject(error);
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() =>  {
                        return {
                            result: $q.when({})
                        };
                    });
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return { 'result': deferred.promise };
                    })
                })
            });
            it('and callGetAvailability should return error ', () =>  {
                controller.searchAvailable = true;
                controller.flags = {
                    showFlexibilizationChangeSection: true,
                    dateLimit : {
                        verifyDate:true,
                        channel :'IBCOM'
                    }
                };
                controller.sisterCitiesAvailability = {
                    newSisterCities: {
                        sisterCitiesOptionChecked: true
                    }
                }
                controller.searchChangesFlights();
                fakeIbFlexibilizationService.callGetAvailability().then((responseData) => {
                    expect(responseData.urlLink).toEqual('http://terms-conditions-link');
                }, angular.noop);
                $rootScope.$digest();
            });
        });

        describe('test for IbFlexibilizationSearchController.searchChangesFlights with SSE_AVM_18007', () =>  {
            beforeEach(() =>  {
                inject((_$q_) => {
                    var $q = _$q_;
                    controller.sisterCitiesAvailability = {
                        newSisterCities: {
                            sisterCitiesOptionChecked: false
                        }
                    };
                    var error = { errorCode: 400, internalErrorCode: 'SSE_AVM_18007' }
                    fakeIbFlexibilizationService.callGetAvailability = jasmine.createSpy('callGetAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.reject(error);
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() =>  {
                        return {
                            result: $q.when({})
                        };
                    });
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return { 'result': deferred.promise };
                    })
                })
            });
            it('and callGetAvailability should return error ', () =>  {
                controller.searchAvailable = true;
                controller.flags = {
                    showFlexibilizationChangeSection: true,
                    dateLimit : {
                        verifyDate:true,
                        channel :'IBCOM'
                    }
                };
                controller.sisterCitiesAvailability = {
                    newSisterCities: {
                        sisterCitiesOptionChecked: true
                    }
                }
                controller.searchChangesFlights();
                fakeIbFlexibilizationService.callGetAvailability().then((responseData) => {
                    expect(responseData.urlLink).toEqual('http://terms-conditions-link');
                }, angular.noop);
                $rootScope.$digest();
            });
        });

        describe('test for IbFlexibilizationSearchController.searchChangesFlights', () =>  {
            beforeEach(() =>  {
                inject((_$q_) =>  {
                    var $q = _$q_;
                    controller.sisterCitiesAvailability = {
                        newSisterCities: {
                            sisterCitiesOptionChecked: false
                        }
                    };
                    var error = { errorCode: 404, internalErrorCode: 'SSE_AVM_12001' }
                    fakeIbFlexibilizationService.callGetAvailability = jasmine.createSpy('callGetAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.reject(error);
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() =>  {
                        return {
                            result: $q.when({})
                        };
                    });
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return { 'result': deferred.promise };
                    })
                })
            });
            it('and callGetAvailability should return error 404', () =>  {
                controller.searchAvailable = true;
                controller.flags = {
                    showFlexibilizationChangeSection: true,
                    dateLimit : {
                        verifyDate:true,
                        channel :'IBCOM'
                    }
                }
                controller.searchChangesFlights();
                fakeIbFlexibilizationService.callGetAvailability().then((responseData) =>  {
                    // expect(responseData).toEqual(error);
                }, angular.noop);
                $rootScope.$digest();
            });
        });

        describe('test for IbFlexibilizationSearchController.searchChangesFlights', () =>  {
            beforeEach(() =>  {
                inject((_$q_) =>  {
                    var $q = _$q_;
                    controller.sisterCitiesAvailability = {
                        newSisterCities: {
                            sisterCitiesOptionChecked: false
                        }
                    };
                    var error = { errorCode: 500, internalErrorCode: 'SSE_AVM_12001' }
                    fakeIbFlexibilizationService.callGetAvailability = jasmine.createSpy('callGetAvailability').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.reject(error);
                        return deferred.promise;
                    });
                    fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() =>  {
                        return {
                            result: $q.when({})
                        };
                    });
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(() =>  {
                        var deferred = $q.defer();
                        deferred.resolve(true);
                        return { 'result': deferred.promise };
                    })
                })
            });
            it('and callGetAvailability should return error 500', () =>  {
                controller.searchAvailable = true;
                controller.flags = {
                    showFlexibilizationChangeSection: true,
                    dateLimit : {
                        verifyDate:true,
                        channel :'IBCOM'
                    }
                }
                controller.searchChangesFlights();
                fakeIbFlexibilizationService.callGetAvailability().then((responseData) =>  {
                    // expect(responseData).toEqual(error);
                }, angular.noop);
                $rootScope.$digest();
            });
        });
        describe('when IbFlexibilizationSearchController searchChangesFlights is called', () =>  {
            beforeEach(inject((_localStorageService_, _$q_, _$rootScope_) => {
                $q = _$q_;
                $rootScope = _$rootScope_;
                var fakeBlackOutDates = {
                    'maxDate': '2022-05-23T21:59:00.000Z'
                }
                var fakeFlags = {
                    'showRefundLink': true,
                    'showChangeFlightLink': true,
                    'showChangeFlightDeepLink': false,
                    'showFlexibilizationChangeSection': false,
                    'showVoluntaryChangeFlightSection': true,
                    'showRefundCashSection': false,
                    'showRefundVoucherSection': true,
                    'refundVoucherSection80': false,
                    'showModalRefound48hs': false,
                    'showLinkToRubiQ': true,
                    'showFlexibilizationExceptionalMsg': false,
                    'hideCashRefundSection': true,
                    'allowedRefundVoucher': true,
                    'enableExternalRefundLink': false,
                    'showContactCenterText': false,
                    'showOnlyVoucherRefundText': true,
                    'cashPartialRefund': false,
                    'importOrderFromDeepLink': false,
                    'slicesWithFlexibilization': {
                        'MADBIO20210615074000': true
                    },
                    'slicesWithChangeFlight': {
                        'MADBIO20210615074000': true
                    },
                    'sisterCitiesData': {
                        'hasSistercitiesPossibility': true,
                        'allowedSlices': [
                            {
                                'sliceId': 'MADBIO20210615074000',
                                'type': 'REGULAR',
                                'departureDateTime': '2021-06-15 07:40',
                                'arrivalDateTime': '2021-06-15 08:40',
                                'duration': 60,
                                'stopsNumber': 0,
                                'price': {
                                    'fare': 300,
                                    'currency': 'EUR'
                                },
                                'detailedPrices': [
                                    {
                                        'fare': 300,
                                        'currency': 'EUR',
                                        'passengerIds': [
                                            'ADULT_01'
                                        ],
                                        'segmentPrices': [
                                            {
                                                'price': {
                                                    'fare': 300,
                                                    'currency': 'EUR'
                                                },
                                                'fareCode': 'DD7OS4',
                                                'segmentsIds': [
                                                    'IB044820210615'
                                                ],
                                                'ticketDesignator': null,
                                                'penalties': []
                                            }
                                        ]
                                    }
                                ],
                                'segments': [
                                    {
                                        'type': 'CONFIRMED',
                                        'mmbAllowed': true,
                                        'ckiStatus': {
                                            'code': 'CHECKABLE',
                                            'message': null
                                        },
                                        'noShow': false,
                                        'flyNow': false,
                                        'flown': false,
                                        'departure': {
                                            'code': 'MAD',
                                            'name': 'BARAJAS',
                                            'terminal': '4',
                                            'city': {
                                                'code': 'MAD',
                                                'description': 'Madrid',
                                                'countryCode': 'ES',
                                                'country': {
                                                    'code': 'ES',
                                                    'description': 'España'
                                                }
                                            }
                                        },
                                        'arrival': {
                                            'code': 'BIO',
                                            'name': 'AIRPORT',
                                            'terminal': null,
                                            'city': {
                                                'code': 'BIO',
                                                'description': 'Bilbao',
                                                'countryCode': 'ES',
                                                'country': {
                                                    'code': 'ES',
                                                    'description': 'España'
                                                }
                                            }
                                        },
                                        'departureCity': {
                                            'code': 'MAD',
                                            'description': 'Madrid',
                                            'countryCode': 'ES',
                                            'timeZone': 'Europe/Madrid'
                                        },
                                        'arrivalCity': {
                                            'code': 'BIO',
                                            'description': 'Bilbao',
                                            'countryCode': 'ES',
                                            'timeZone': 'Europe/Madrid'
                                        },
                                        'flight': {
                                            'marketingCarrier': {
                                                'code': 'IB',
                                                'name': 'Iberia'
                                            },
                                            'operationalCarrier': {
                                                'code': 'IB',
                                                'name': 'Iberia'
                                            },
                                            'marketingFlightNumber': '0448',
                                            'operationalFlightNumber': '',
                                            'operationalDisclosure': 'IB',
                                            'aircraft': {
                                                'code': '320',
                                                'description': 'Airbus A320'
                                            }
                                        },
                                        'cabin': {
                                            'rbd': 'D',
                                            'description': 'Business',
                                            'remainingSeats': null,
                                            'fareFamily': 'BFLESES',
                                            'code': 'B',
                                            'type': 'BUSINESS',
                                            'bookingClass': 'BUSINESS'
                                        },
                                        'overnight': false,
                                        'id': 'IB044820210615',
                                        'duration': 60,
                                        'waitingTime': 0,
                                        'operatorLocator': null,
                                        'stop': null,
                                        'departureDateTime': '2021-06-15 07:40',
                                        'departureUtcDateTime': '2021-06-15T05:40:00.000',
                                        'arrivalDateTime': '2021-06-15 08:40',
                                        'arrivalUtcDateTime': '2021-06-15T06:40:00.000',
                                        'status': {
                                            'code': 'HK',
                                            'description': 'Confirmado'
                                        }
                                    }
                                ],
                                'overnight': false,
                                'passengerFlags': [
                                    {
                                        'passengerId': 'ADULT_01',
                                        'flags': [
                                            {
                                                'type': 'FLIGHT_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'FLIGHT_REFUND',
                                                'enabled': false
                                            },
                                            {
                                                'type': 'FREQUENT_FLYER_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'SPECIAL_NEEDS_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'CONTACT_DATA_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'EMERGENCY_CONTACT_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'PASSENGER_NAME_CORRECTION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'ANCILLARIES',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                                'enabled': false
                                            },
                                            {
                                                'type': 'FLIGHT_MODIFICATION_FLEXIBLE',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'FLIGHT_MODIFICATION_ON_DEMAND',
                                                'enabled': false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    'showMonetateAlertCFPhone': true,
                    'allowedInvoluntaryFlightChange': true,
                    'hideChangeFlightMenuOption': false,
                    'showVoluntaryFlexibleFlightChange': true,
                    'flightModificationActive': true,
                    'flexibleFlight': false,
                    'displayCCPhone': false
                }
                controller.blackOutDates = fakeBlackOutDates;
                controller.searchAvailable = true;
                controller.flags = fakeFlags;
                controller.flights = {
                    'MADBIO20210615074000': {
                        'departureCity': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrivalCity': {
                            'code': 'BIO',
                            'name': 'AIRPORT',
                            'terminal': null,
                            'city': {
                                'code': 'BIO',
                                'description': 'Bilbao',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'departureCountry': 'ES',
                        'arrivalCountry': 'ES',
                        'segments': [
                            {
                                'departureCity': {
                                    'code': 'MAD',
                                    'name': 'BARAJAS',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrivalCity': {
                                    'code': 'BIO',
                                    'name': 'AIRPORT',
                                    'terminal': null,
                                    'city': {
                                        'code': 'BIO',
                                        'description': 'Bilbao',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'departureDateParsed': {
                                    'dateTime': '07:40',
                                    'weekDay': 'WEEKDAY_TUESDAY',
                                    'day': 15,
                                    'monthNumber': 6,
                                    'month': 'MONTH_JUNE',
                                    'year': 2021,
                                    'originalDate': '2021-06-15T07:40:00+02:00',
                                    'formatedDate': '15/06/2021'
                                },
                                'arrivalDateParsed': {
                                    'dateTime': '08:40',
                                    'weekDay': 'WEEKDAY_TUESDAY',
                                    'day': 15,
                                    'monthNumber': 6,
                                    'month': 'MONTH_JUNE',
                                    'year': 2021,
                                    'originalDate': '2021-06-15T08:40:00+02:00',
                                    'formatedDate': '15/06/2021'
                                },
                                'companyURL': '/aerolineas/logo_pos_IB.svg',
                                'overnight': false,
                                'departureDateTimeParsed': '07:40',
                                'arrivalDateTimeParsed': '08:40',
                                'departure': {
                                    'code': 'MAD',
                                    'name': 'BARAJAS',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'BIO',
                                    'name': 'AIRPORT',
                                    'terminal': null,
                                    'city': {
                                        'code': 'BIO',
                                        'description': 'Bilbao',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'flight': {
                                    'marketingCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'operationalCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'marketingFlightNumber': '0448',
                                    'operationalFlightNumber': '',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': {
                                        'code': '320',
                                        'description': 'Airbus A320'
                                    }
                                },
                                'durationParsed': '01h ',
                                'fareFamilyConditions': [
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'title': '1 bulto en cabina  (56x40x25cm)',
                                        'message': '1 bulto (56x40x25cm)',
                                        'units': 1,
                                        '$$hashKey': 'object:127'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'title': '2 equipajes en bodega ',
                                        'message': '2 piezas máx 23kg/pieza y 158 cm.  ',
                                        'units': 2,
                                        '$$hashKey': 'object:128'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'ASIENTO',
                                        'name': 'Selección de asiento',
                                        'title': 'Con selección de asiento',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:129'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'title': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                                        'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ',
                                        'units': 50,
                                        '$$hashKey': 'object:130'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'title': 'Reembolso permitido',
                                        'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                                        'units': 75,
                                        '$$hashKey': 'object:131'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQPPRIOR',
                                        'name': 'Entrega prioritaria equipaje',
                                        'title': '',
                                        'message': 'Si',
                                        'units': null,
                                        '$$hashKey': 'object:132'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'FASTTRACK',
                                        'name': 'Fast Track',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:133'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CHECKINDESK',
                                        'name': 'Mostrador check-in exclusivo',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:134'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'TARJEMBANTIC',
                                        'name': 'Tarjeta de embarque anticipada',
                                        'title': 'Con tarjeta de embarque anticipada',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:135'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'SALAVIP',
                                        'name': 'Acceso a salas VIP',
                                        'title': '',
                                        'message': 'Si',
                                        'units': null,
                                        '$$hashKey': 'object:136'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EMBARQUE',
                                        'name': 'Prioridad de Embarque',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:137'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL',
                                        'title': 'Con selección de asiento',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:138'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'title': '',
                                        'message': 'Business',
                                        'units': null,
                                        '$$hashKey': 'object:139'
                                    }
                                ],
                                'segmentId': 'IB044820210615',
                                'sliceId': 'MADBIO20210615074000',
                                'status': {
                                    'code': 'HK',
                                    'description': 'Confirmado'
                                },
                                'cabin': {
                                    'rbd': 'D',
                                    'description': 'Business',
                                    'remainingSeats': null,
                                    'fareFamily': 'BFLESES',
                                    'code': 'B',
                                    'type': 'BUSINESS',
                                    'bookingClass': 'BUSINESS'
                                },
                                'flown': false,
                                'warnings': {},
                                'stop': null
                            }
                        ],
                        'departureDateParsed': {
                            'dateTime': '07:40',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-15T07:40:00+02:00',
                            'formatedDate': '15/06/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '08:40',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-15T08:40:00+02:00',
                            'formatedDate': '15/06/2021'
                        },
                        'durationParsed': '01h ',
                        'stopsNumber': 0,
                        'daysToGo': 14,
                        'checked': true,
                        'parseNewDateSelected': {
                            'year' : 2033,
                            'month' : 10,
                            'day': 1
                        }
                    },
                    'MADBIO20210615074001': {
                        'departureCity': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrivalCity': {
                            'code': 'BIO',
                            'name': 'AIRPORT',
                            'terminal': null,
                            'city': {
                                'code': 'BIO',
                                'description': 'Bilbao',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'departureCountry': 'ES',
                        'arrivalCountry': 'ES',
                        'segments': [
                            {
                                'departureCity': {
                                    'code': 'MAD',
                                    'name': 'BARAJAS',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrivalCity': {
                                    'code': 'BIO',
                                    'name': 'AIRPORT',
                                    'terminal': null,
                                    'city': {
                                        'code': 'BIO',
                                        'description': 'Bilbao',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'departureDateParsed': {
                                    'dateTime': '07:40',
                                    'weekDay': 'WEEKDAY_TUESDAY',
                                    'day': 15,
                                    'monthNumber': 6,
                                    'month': 'MONTH_JUNE',
                                    'year': 2021,
                                    'originalDate': '2021-06-15T07:40:00+02:00',
                                    'formatedDate': '15/06/2021'
                                },
                                'arrivalDateParsed': {
                                    'dateTime': '08:40',
                                    'weekDay': 'WEEKDAY_TUESDAY',
                                    'day': 15,
                                    'monthNumber': 6,
                                    'month': 'MONTH_JUNE',
                                    'year': 2021,
                                    'originalDate': '2021-06-15T08:40:00+02:00',
                                    'formatedDate': '15/06/2021'
                                },
                                'companyURL': '/aerolineas/logo_pos_IB.svg',
                                'overnight': false,
                                'departureDateTimeParsed': '07:40',
                                'arrivalDateTimeParsed': '08:40',
                                'departure': {
                                    'code': 'MAD',
                                    'name': 'BARAJAS',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'BIO',
                                    'name': 'AIRPORT',
                                    'terminal': null,
                                    'city': {
                                        'code': 'BIO',
                                        'description': 'Bilbao',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'flight': {
                                    'marketingCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'operationalCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'marketingFlightNumber': '0448',
                                    'operationalFlightNumber': '',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': {
                                        'code': '320',
                                        'description': 'Airbus A320'
                                    }
                                },
                                'durationParsed': '01h ',
                                'fareFamilyConditions': [
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'title': '1 bulto en cabina  (56x40x25cm)',
                                        'message': '1 bulto (56x40x25cm)',
                                        'units': 1,
                                        '$$hashKey': 'object:127'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'title': '2 equipajes en bodega ',
                                        'message': '2 piezas máx 23kg/pieza y 158 cm.  ',
                                        'units': 2,
                                        '$$hashKey': 'object:128'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'ASIENTO',
                                        'name': 'Selección de asiento',
                                        'title': 'Con selección de asiento',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:129'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'title': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                                        'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ',
                                        'units': 50,
                                        '$$hashKey': 'object:130'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'title': 'Reembolso permitido',
                                        'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                                        'units': 75,
                                        '$$hashKey': 'object:131'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQPPRIOR',
                                        'name': 'Entrega prioritaria equipaje',
                                        'title': '',
                                        'message': 'Si',
                                        'units': null,
                                        '$$hashKey': 'object:132'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'FASTTRACK',
                                        'name': 'Fast Track',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:133'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CHECKINDESK',
                                        'name': 'Mostrador check-in exclusivo',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:134'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'TARJEMBANTIC',
                                        'name': 'Tarjeta de embarque anticipada',
                                        'title': 'Con tarjeta de embarque anticipada',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:135'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'SALAVIP',
                                        'name': 'Acceso a salas VIP',
                                        'title': '',
                                        'message': 'Si',
                                        'units': null,
                                        '$$hashKey': 'object:136'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EMBARQUE',
                                        'name': 'Prioridad de Embarque',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:137'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL',
                                        'title': 'Con selección de asiento',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:138'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'title': '',
                                        'message': 'Business',
                                        'units': null,
                                        '$$hashKey': 'object:139'
                                    }
                                ],
                                'segmentId': 'IB044820210615',
                                'sliceId': 'MADBIO20210615074000',
                                'status': {
                                    'code': 'HK',
                                    'description': 'Confirmado'
                                },
                                'cabin': {
                                    'rbd': 'D',
                                    'description': 'Business',
                                    'remainingSeats': null,
                                    'fareFamily': 'BFLESES',
                                    'code': 'B',
                                    'type': 'BUSINESS',
                                    'bookingClass': 'BUSINESS'
                                },
                                'flown': false,
                                'warnings': {},
                                'stop': null
                            }
                        ],
                        'departureDateParsed': {
                            'dateTime': '07:40',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-15T07:40:00+02:00',
                            'formatedDate': '15/06/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '08:40',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-15T08:40:00+02:00',
                            'formatedDate': '15/06/2021'
                        },
                        'durationParsed': '01h ',
                        'stopsNumber': 0,
                        'daysToGo': 14,
                        'checked': true,
                        'parseNewDateSelected': {
                            'year' : 2033,
                            'month' : 10,
                            'day': 1
                        }
                    }
                };
                controller.showSisterCitiesMenu = true;
            }));
            describe('and showVoluntaryChangeFlightSection is true', () =>  {
                it('IbFlexibilizationSearchController should be defined', (done) =>  {
                    controller.flags = {
                        showFlexibilizationChangeSection: true,
                        dateLimit : {
                            verifyDate:true,
                            channel :'IBCOM'
                        }
                    }
                    controller.flights
                    controller.searchChangesFlights();
                    fakeVoluntaryChangesService.getAvailability().then((data) => {
                        expect(controller).toBeDefined();
                    }, angular.noop);
                    $rootScope.$digest();
                    done();
                });
            });
            describe('changeDate is called', () =>  {
                it('and index should be 0', (done) =>  {
                    var index = 0;
                    controller.slicesId = ['MADBIO20210615074000'];
                    controller.flights[controller.slicesId[0]].newDateSelected = new Date();
                    controller.numberFlights = 1;
                    controller.changeDate(index);
                    $rootScope.$digest();
                    done();
                });
                it('and index should be 0', (done) =>  {
                    var index = 0;
                    controller.slicesId = ['MADBIO20210615074000', 'MADBIO20210615074001'];
                    controller.flights[controller.slicesId[index + 1]].dateOptions = {
                        'showWeeks': false,
                        'maxMode': 'day',
                        'minDate': '2021-06-08T13:13:20.036Z',
                        'maxDate': '2022-06-08T13:13:10.248Z'
                    };
                    controller.flights[controller.slicesId[0]].newDateSelected = new Date();
                    controller.flights[controller.slicesId[index + 1]].newDateSelected = new Date();
                    controller.numberFlights = 2;
                    controller.changeDate(index);
                    $rootScope.$digest();
                    done();
                });
            });

            it('checkFlightChanged is called and indexFlight is 0', (done) =>  {
                var index = 0;
                controller.slicesId = ['MADBIO20210615074000', 'MADBIO20210615074001'];
                controller.flights[controller.slicesId[index + 1]].dateOptions = {
                    'showWeeks': false,
                    'maxMode': 'day',
                    'minDate': '2021-06-08T13:13:20.036Z',
                    'maxDate': '2022-06-08T13:13:10.248Z'
                };
                controller.flights[controller.slicesId[0]].newDateSelected = new Date();
                controller.flights[controller.slicesId[index + 1]].newDateSelected = new Date();
                controller.numberFlights = 2;
                $rootScope.$broadcast('checkFlightChanged', 0);
                done();
            });
            xit('checkFlightChanged is called and indexFlight is 1', (done) =>  {
                var index = 1;
                controller.slicesId = ['MADBIO20210615074000', 'MADBIO20210615074001'];
                controller.flights[controller.slicesId[index - 1]].newDateSelected = dayjs(controller.flights[controller.slicesId[index]].departureDateParsed.originalDate).add(1,'day');
                controller.flights[controller.slicesId[index - 1]].dateOptions = {
                    'showWeeks': false,
                    'maxMode': 'day',
                    'minDate': '2021-06-08T13:13:20.036Z',
                    'maxDate': '2022-06-08T13:13:10.248Z'
                };
                controller.flights[controller.slicesId[0]].newDateSelected = new Date();
                controller.flights[controller.slicesId[index - 1]].newDateSelected = new Date();
                controller.numberFlights = 2;
                $rootScope.$broadcast('checkFlightChanged', 1);
                done();
            });

        });

        describe('when IbFlexibilizationSearchController searchChangesFlights is called', () =>  {
            beforeEach(inject((_localStorageService_, _$q_, _$rootScope_) => {
                $q = _$q_;
                $rootScope = _$rootScope_;
                var error = { errorCode: 400, internalErrorCode: 'SSE_AVM_18002' }
                fakeVoluntaryChangesService.getAvailability = jasmine.createSpy('getAvailability').and.callFake(() =>  {
                    var deferred = $q.defer();
                    deferred.reject(error);
                    return deferred.promise;
                });
                var fakeBlackOutDates = {
                    'maxDate': '2022-05-23T21:59:00.000Z'
                }
                var fakeFlags = {
                    'showRefundLink': true,
                    'showChangeFlightLink': true,
                    'showChangeFlightDeepLink': false,
                    'showFlexibilizationChangeSection': false,
                    'showVoluntaryChangeFlightSection': true,
                    'showRefundCashSection': false,
                    'showRefundVoucherSection': true,
                    'refundVoucherSection80': false,
                    'showModalRefound48hs': false,
                    'showLinkToRubiQ': true,
                    'showFlexibilizationExceptionalMsg': false,
                    'hideCashRefundSection': true,
                    'allowedRefundVoucher': true,
                    'enableExternalRefundLink': false,
                    'showContactCenterText': false,
                    'showOnlyVoucherRefundText': true,
                    'cashPartialRefund': false,
                    'importOrderFromDeepLink': false,
                    'slicesWithFlexibilization': {
                        'MADBIO20210615074000': true
                    },
                    'slicesWithChangeFlight': {
                        'MADBIO20210615074000': true
                    },
                    'sisterCitiesData': {
                        'hasSistercitiesPossibility': true,
                        'allowedSlices': [
                            {
                                'sliceId': 'MADBIO20210615074000',
                                'type': 'REGULAR',
                                'departureDateTime': '2021-06-15 07:40',
                                'arrivalDateTime': '2021-06-15 08:40',
                                'duration': 60,
                                'stopsNumber': 0,
                                'price': {
                                    'fare': 300,
                                    'currency': 'EUR'
                                },
                                'detailedPrices': [
                                    {
                                        'fare': 300,
                                        'currency': 'EUR',
                                        'passengerIds': [
                                            'ADULT_01'
                                        ],
                                        'segmentPrices': [
                                            {
                                                'price': {
                                                    'fare': 300,
                                                    'currency': 'EUR'
                                                },
                                                'fareCode': 'DD7OS4',
                                                'segmentsIds': [
                                                    'IB044820210615'
                                                ],
                                                'ticketDesignator': null,
                                                'penalties': []
                                            }
                                        ]
                                    }
                                ],
                                'segments': [
                                    {
                                        'type': 'CONFIRMED',
                                        'mmbAllowed': true,
                                        'ckiStatus': {
                                            'code': 'CHECKABLE',
                                            'message': null
                                        },
                                        'noShow': false,
                                        'flyNow': false,
                                        'flown': false,
                                        'departure': {
                                            'code': 'MAD',
                                            'name': 'BARAJAS',
                                            'terminal': '4',
                                            'city': {
                                                'code': 'MAD',
                                                'description': 'Madrid',
                                                'countryCode': 'ES',
                                                'country': {
                                                    'code': 'ES',
                                                    'description': 'España'
                                                }
                                            }
                                        },
                                        'arrival': {
                                            'code': 'BIO',
                                            'name': 'AIRPORT',
                                            'terminal': null,
                                            'city': {
                                                'code': 'BIO',
                                                'description': 'Bilbao',
                                                'countryCode': 'ES',
                                                'country': {
                                                    'code': 'ES',
                                                    'description': 'España'
                                                }
                                            }
                                        },
                                        'departureCity': {
                                            'code': 'MAD',
                                            'description': 'Madrid',
                                            'countryCode': 'ES',
                                            'timeZone': 'Europe/Madrid'
                                        },
                                        'arrivalCity': {
                                            'code': 'BIO',
                                            'description': 'Bilbao',
                                            'countryCode': 'ES',
                                            'timeZone': 'Europe/Madrid'
                                        },
                                        'flight': {
                                            'marketingCarrier': {
                                                'code': 'IB',
                                                'name': 'Iberia'
                                            },
                                            'operationalCarrier': {
                                                'code': 'IB',
                                                'name': 'Iberia'
                                            },
                                            'marketingFlightNumber': '0448',
                                            'operationalFlightNumber': '',
                                            'operationalDisclosure': 'IB',
                                            'aircraft': {
                                                'code': '320',
                                                'description': 'Airbus A320'
                                            }
                                        },
                                        'cabin': {
                                            'rbd': 'D',
                                            'description': 'Business',
                                            'remainingSeats': null,
                                            'fareFamily': 'BFLESES',
                                            'code': 'B',
                                            'type': 'BUSINESS',
                                            'bookingClass': 'BUSINESS'
                                        },
                                        'overnight': false,
                                        'id': 'IB044820210615',
                                        'duration': 60,
                                        'waitingTime': 0,
                                        'operatorLocator': null,
                                        'stop': null,
                                        'departureDateTime': '2021-06-15 07:40',
                                        'departureUtcDateTime': '2021-06-15T05:40:00.000',
                                        'arrivalDateTime': '2021-06-15 08:40',
                                        'arrivalUtcDateTime': '2021-06-15T06:40:00.000',
                                        'status': {
                                            'code': 'HK',
                                            'description': 'Confirmado'
                                        }
                                    }
                                ],
                                'overnight': false,
                                'passengerFlags': [
                                    {
                                        'passengerId': 'ADULT_01',
                                        'flags': [
                                            {
                                                'type': 'FLIGHT_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'FLIGHT_REFUND',
                                                'enabled': false
                                            },
                                            {
                                                'type': 'FREQUENT_FLYER_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'SPECIAL_NEEDS_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'CONTACT_DATA_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'EMERGENCY_CONTACT_MODIFICATION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'PASSENGER_NAME_CORRECTION',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'ANCILLARIES',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                                'enabled': false
                                            },
                                            {
                                                'type': 'FLIGHT_MODIFICATION_FLEXIBLE',
                                                'enabled': true
                                            },
                                            {
                                                'type': 'FLIGHT_MODIFICATION_ON_DEMAND',
                                                'enabled': false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    'showMonetateAlertCFPhone': true,
                    'allowedInvoluntaryFlightChange': true,
                    'hideChangeFlightMenuOption': false,
                    'showVoluntaryFlexibleFlightChange': true,
                    'flightModificationActive': true,
                    'flexibleFlight': false,
                    'displayCCPhone': false
                }
                controller.blackOutDates = fakeBlackOutDates;
                controller.searchAvailable = true;
                controller.flags = fakeFlags;
                controller.flights = {
                    'MADBIO20210615074000': {
                        'departureCity': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrivalCity': {
                            'code': 'BIO',
                            'name': 'AIRPORT',
                            'terminal': null,
                            'city': {
                                'code': 'BIO',
                                'description': 'Bilbao',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'departureCountry': 'ES',
                        'arrivalCountry': 'ES',
                        'segments': [
                            {
                                'departureCity': {
                                    'code': 'MAD',
                                    'name': 'BARAJAS',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrivalCity': {
                                    'code': 'BIO',
                                    'name': 'AIRPORT',
                                    'terminal': null,
                                    'city': {
                                        'code': 'BIO',
                                        'description': 'Bilbao',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'departureDateParsed': {
                                    'dateTime': '07:40',
                                    'weekDay': 'WEEKDAY_TUESDAY',
                                    'day': 15,
                                    'monthNumber': 6,
                                    'month': 'MONTH_JUNE',
                                    'year': 2021,
                                    'originalDate': '2021-06-15T07:40:00+02:00',
                                    'formatedDate': '15/06/2021'
                                },
                                'arrivalDateParsed': {
                                    'dateTime': '08:40',
                                    'weekDay': 'WEEKDAY_TUESDAY',
                                    'day': 15,
                                    'monthNumber': 6,
                                    'month': 'MONTH_JUNE',
                                    'year': 2021,
                                    'originalDate': '2021-06-15T08:40:00+02:00',
                                    'formatedDate': '15/06/2021'
                                },
                                'companyURL': '/aerolineas/logo_pos_IB.svg',
                                'overnight': false,
                                'departureDateTimeParsed': '07:40',
                                'arrivalDateTimeParsed': '08:40',
                                'departure': {
                                    'code': 'MAD',
                                    'name': 'BARAJAS',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'BIO',
                                    'name': 'AIRPORT',
                                    'terminal': null,
                                    'city': {
                                        'code': 'BIO',
                                        'description': 'Bilbao',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'flight': {
                                    'marketingCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'operationalCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'marketingFlightNumber': '0448',
                                    'operationalFlightNumber': '',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': {
                                        'code': '320',
                                        'description': 'Airbus A320'
                                    }
                                },
                                'durationParsed': '01h ',
                                'fareFamilyConditions': [
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'title': '1 bulto en cabina  (56x40x25cm)',
                                        'message': '1 bulto (56x40x25cm)',
                                        'units': 1,
                                        '$$hashKey': 'object:127'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'title': '2 equipajes en bodega ',
                                        'message': '2 piezas máx 23kg/pieza y 158 cm.  ',
                                        'units': 2,
                                        '$$hashKey': 'object:128'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'ASIENTO',
                                        'name': 'Selección de asiento',
                                        'title': 'Con selección de asiento',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:129'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'title': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                                        'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ',
                                        'units': 50,
                                        '$$hashKey': 'object:130'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'title': 'Reembolso permitido',
                                        'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                                        'units': 75,
                                        '$$hashKey': 'object:131'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQPPRIOR',
                                        'name': 'Entrega prioritaria equipaje',
                                        'title': '',
                                        'message': 'Si',
                                        'units': null,
                                        '$$hashKey': 'object:132'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'FASTTRACK',
                                        'name': 'Fast Track',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:133'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CHECKINDESK',
                                        'name': 'Mostrador check-in exclusivo',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:134'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'TARJEMBANTIC',
                                        'name': 'Tarjeta de embarque anticipada',
                                        'title': 'Con tarjeta de embarque anticipada',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:135'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'SALAVIP',
                                        'name': 'Acceso a salas VIP',
                                        'title': '',
                                        'message': 'Si',
                                        'units': null,
                                        '$$hashKey': 'object:136'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EMBARQUE',
                                        'name': 'Prioridad de Embarque',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:137'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL',
                                        'title': 'Con selección de asiento',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:138'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'title': '',
                                        'message': 'Business',
                                        'units': null,
                                        '$$hashKey': 'object:139'
                                    }
                                ],
                                'segmentId': 'IB044820210615',
                                'sliceId': 'MADBIO20210615074000',
                                'status': {
                                    'code': 'HK',
                                    'description': 'Confirmado'
                                },
                                'cabin': {
                                    'rbd': 'D',
                                    'description': 'Business',
                                    'remainingSeats': null,
                                    'fareFamily': 'BFLESES',
                                    'code': 'B',
                                    'type': 'BUSINESS',
                                    'bookingClass': 'BUSINESS'
                                },
                                'flown': false,
                                'warnings': {},
                                'stop': null
                            }
                        ],
                        'departureDateParsed': {
                            'dateTime': '07:40',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-15T07:40:00+02:00',
                            'formatedDate': '15/06/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '08:40',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-15T08:40:00+02:00',
                            'formatedDate': '15/06/2021'
                        },
                        'durationParsed': '01h ',
                        'stopsNumber': 0,
                        'daysToGo': 14,
                        'checked': true,
                        'parseNewDateSelected': {
                            'year' : 2033,
                            'month' : 10,
                            'day': 1
                        }
                    },
                    'MADBIO20210615074001': {
                        'departureCity': {
                            'code': 'MAD',
                            'name': 'BARAJAS',
                            'terminal': '4',
                            'city': {
                                'code': 'MAD',
                                'description': 'Madrid',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'arrivalCity': {
                            'code': 'BIO',
                            'name': 'AIRPORT',
                            'terminal': null,
                            'city': {
                                'code': 'BIO',
                                'description': 'Bilbao',
                                'countryCode': 'ES',
                                'country': {
                                    'code': 'ES',
                                    'description': 'España'
                                }
                            }
                        },
                        'departureCountry': 'ES',
                        'arrivalCountry': 'ES',
                        'segments': [
                            {
                                'departureCity': {
                                    'code': 'MAD',
                                    'name': 'BARAJAS',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrivalCity': {
                                    'code': 'BIO',
                                    'name': 'AIRPORT',
                                    'terminal': null,
                                    'city': {
                                        'code': 'BIO',
                                        'description': 'Bilbao',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'departureDateParsed': {
                                    'dateTime': '07:40',
                                    'weekDay': 'WEEKDAY_TUESDAY',
                                    'day': 15,
                                    'monthNumber': 6,
                                    'month': 'MONTH_JUNE',
                                    'year': 2021,
                                    'originalDate': '2021-06-15T07:40:00+02:00',
                                    'formatedDate': '15/06/2021'
                                },
                                'arrivalDateParsed': {
                                    'dateTime': '08:40',
                                    'weekDay': 'WEEKDAY_TUESDAY',
                                    'day': 15,
                                    'monthNumber': 6,
                                    'month': 'MONTH_JUNE',
                                    'year': 2021,
                                    'originalDate': '2021-06-15T08:40:00+02:00',
                                    'formatedDate': '15/06/2021'
                                },
                                'companyURL': '/aerolineas/logo_pos_IB.svg',
                                'overnight': false,
                                'departureDateTimeParsed': '07:40',
                                'arrivalDateTimeParsed': '08:40',
                                'departure': {
                                    'code': 'MAD',
                                    'name': 'BARAJAS',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'BIO',
                                    'name': 'AIRPORT',
                                    'terminal': null,
                                    'city': {
                                        'code': 'BIO',
                                        'description': 'Bilbao',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'flight': {
                                    'marketingCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'operationalCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'marketingFlightNumber': '0448',
                                    'operationalFlightNumber': '',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': {
                                        'code': '320',
                                        'description': 'Airbus A320'
                                    }
                                },
                                'durationParsed': '01h ',
                                'fareFamilyConditions': [
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQMANO',
                                        'name': 'Equipaje de mano',
                                        'title': '1 bulto en cabina  (56x40x25cm)',
                                        'message': '1 bulto (56x40x25cm)',
                                        'units': 1,
                                        '$$hashKey': 'object:127'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQBODEGA',
                                        'name': 'Equipaje en bodega',
                                        'title': '2 equipajes en bodega ',
                                        'message': '2 piezas máx 23kg/pieza y 158 cm.  ',
                                        'units': 2,
                                        '$$hashKey': 'object:128'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'ASIENTO',
                                        'name': 'Selección de asiento',
                                        'title': 'Con selección de asiento',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:129'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CAMBIO',
                                        'name': 'Cambios',
                                        'title': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                                        'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ',
                                        'units': 50,
                                        '$$hashKey': 'object:130'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'REEMBOLSO',
                                        'name': 'Reembolso (por sentido)',
                                        'title': 'Reembolso permitido',
                                        'message': 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                                        'units': 75,
                                        '$$hashKey': 'object:131'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EQPPRIOR',
                                        'name': 'Entrega prioritaria equipaje',
                                        'title': '',
                                        'message': 'Si',
                                        'units': null,
                                        '$$hashKey': 'object:132'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'FASTTRACK',
                                        'name': 'Fast Track',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:133'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CHECKINDESK',
                                        'name': 'Mostrador check-in exclusivo',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:134'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'TARJEMBANTIC',
                                        'name': 'Tarjeta de embarque anticipada',
                                        'title': 'Con tarjeta de embarque anticipada',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:135'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'SALAVIP',
                                        'name': 'Acceso a salas VIP',
                                        'title': '',
                                        'message': 'Si',
                                        'units': null,
                                        '$$hashKey': 'object:136'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'EMBARQUE',
                                        'name': 'Prioridad de Embarque',
                                        'title': '',
                                        'message': 'Sí',
                                        'units': null,
                                        '$$hashKey': 'object:137'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'ASIENTOXL',
                                        'name': 'Selección de asiento XL',
                                        'title': 'Con selección de asiento',
                                        'message': 'Incluido',
                                        'units': null,
                                        '$$hashKey': 'object:138'
                                    },
                                    {
                                        'cabin': 'Business Flexible',
                                        'cabinType': 'B',
                                        'code': 'CABINA',
                                        'name': 'Cabina',
                                        'title': '',
                                        'message': 'Business',
                                        'units': null,
                                        '$$hashKey': 'object:139'
                                    }
                                ],
                                'segmentId': 'IB044820210615',
                                'sliceId': 'MADBIO20210615074000',
                                'status': {
                                    'code': 'HK',
                                    'description': 'Confirmado'
                                },
                                'cabin': {
                                    'rbd': 'D',
                                    'description': 'Business',
                                    'remainingSeats': null,
                                    'fareFamily': 'BFLESES',
                                    'code': 'B',
                                    'type': 'BUSINESS',
                                    'bookingClass': 'BUSINESS'
                                },
                                'flown': false,
                                'warnings': {},
                                'stop': null
                            }
                        ],
                        'departureDateParsed': {
                            'dateTime': '07:40',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-15T07:40:00+02:00',
                            'formatedDate': '15/06/2021'
                        },
                        'arrivalDateParsed': {
                            'dateTime': '08:40',
                            'weekDay': 'WEEKDAY_TUESDAY',
                            'day': 15,
                            'monthNumber': 6,
                            'month': 'MONTH_JUNE',
                            'year': 2021,
                            'originalDate': '2021-06-15T08:40:00+02:00',
                            'formatedDate': '15/06/2021'
                        },
                        'durationParsed': '01h ',
                        'stopsNumber': 0,
                        'daysToGo': 14,
                        'checked': true,
                        'parseNewDateSelected': {
                            'year' : 2033,
                            'month' : 10,
                            'day': 1
                        }
                    }
                };
                controller.showSisterCitiesMenu = true;
            }));
            describe('and showVoluntaryChangeFlightSection is true', () =>  {
                it('IbFlexibilizationSearchController should be defined', (done) =>  {
                    controller.flags = {
                        showFlexibilizationChangeSection: true,
                        dateLimit : {
                            verifyDate:true,
                            channel :'IBCOM'
                        }
                    }
                    controller.searchChangesFlights();
                    fakeVoluntaryChangesService.getAvailability().then((data) => {
                        // expect(responseData).toEqual(error);
                    }, angular.noop);
                    $rootScope.$digest();
                    done();
                });
            });
        });
    });
});
