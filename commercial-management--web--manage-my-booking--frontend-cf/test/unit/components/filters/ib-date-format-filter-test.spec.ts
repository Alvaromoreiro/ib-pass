import angular from 'angular';
import dayjs from 'dayjs';
describe('DateFormatFilter test', function () {
    'use strict';

    let format = [
        {
            'code': 'es',
            'dateFormat': {
                'fullDate': 'EEEE, D de MMMM de Y',
                'longDate': 'D de MMMM de Y',
                'medium': 'D MMM Y H:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'H:mm:ss',
                'short': 'D/M/YY H:mm',
                'shortDate': 'D/M/YY',
                'shortTime': 'H:mm'
            }
        }
    ]

    let filter, result, rootScope, dateTest;

    let expectedResult = {}

    let formatDate = [
        {
            'code': 'es',
            'dateFormat': {
                'fullDate': 'EEEE, D "de" MMMM "de" Y',
                'longDate': 'D "de" MMMM "de" Y',
                'medium': 'D MMM Y H:mm:ss',
                'mediumDate': 'D MMM Y',
                'mediumTime': 'H:mm:ss',
                'short': 'D/M/YY H:mm',
                'shortDate': 'D/M/YY',
                'shortTime': 'H:mm'
            }
        }
    ];

    let fakeMmBAppConstants = {
        'iconsRoute': 'iconRoute',
        'airlinesLogoBaseRoute': 'airLogoRoute',
        'defaultAirlineLogo': 'defaulturl',
        'FORMAT_DATE': formatDate,
        'COOKIES': {
            'DYNAMIC_PRICING': true
        },
        'PASSENGER_TYPE': {
            'SENIOR': 'SENIOR',
            'ADULT': 'ADULT',
            'YOUTH': 'YOUTH',
            'TEENAGER': 'YOUNG',
            'YOUNG_ADULT': 'YOUNG_ADULT',
            'CHILD': 'CHILD',
            'INFANT': 'INFANT'
        },
        'ANCILLARIES_IMPORT_ORDER_TYPE': {
            'BAGGAGE' : 'BGA'
        },
        'ANCILLARIES_TYPES': {
            'BAGGAGE': 'BAGGAGE',
            'SEAT': 'SEAT',
            'INSURANCE': 'INSURANCE',
            'VEHICLE_RENTAL': 'VEHICLE_RENTAL',
            'UPGRADING': 'UPGRADING',
            'SPEQS': 'SPECIAL_EQUIPMENT',
            'SPECIAL_MEALS': 'SPECIAL_MEALS',
            'UPGRADING_BID': 'UPGRADING_BID'
        },
        'SEAT_FEATURE': {
            'EMERGENCY_EXIT': 'EMERGENCY_EXIT',
            'EXTRA_SIZE': 'EXTRA_SIZE',
            'EMERGENCY_WINDOW': 'WINDOW',
            'WING': 'WING',
            'SCREEN': 'ENTERTAINMENT_SCREEN',
            'NON_RECLINING': 'NON_RECLINING',
            'INFANT': 'PASSENGER_WITH_INFANT',
            'MOBILITY': 'RESTRICTED_MOBILITY',
            'WC': 'WC',
            'GALLEY': 'GALLEY',
            'PROMO': 'PROMO',
            'UPFRONT': 'UPFRONT',
            'AISLE': 'AISLE'
        },
        'ACCOUNT_TYPES': {
            'REWARD': 'R',
            'LOAN': 'L'
        },
        'DESTINATION_IMAGE_SIZE': {
            'desktop': '1024',
            'tablet': '768',
            'mobile': '320'
        },
        'ORDER_STATUS_VALUES': {
            'CANCELATION_FLAG': 'UNCONFIRMED_CHANGES',
            'CANCELATION_REACOM_FLAG': 'ACCEPT_CHANGES_PENDING'
        },
        'QUADRIGAM': {
            'SEARCH': 'CHKTRP',
            'LOGGED_SEARCH': 'MYTRPS',
        },
        'OH_FLIGHT_TYPES' : {
            'MULTITRIP': 'multiCityFlight'
        },
        'PAYMENT_TYPES': {
            CREDIT_CARD: 'CREDIT_CARD',
            AVIOS: 'AVIOS',
            VOUCHER: 'VOUCHER'
        },
        'UN_UNTK_QUADRIGAMS': ['test']
    };

    beforeEach(function () {
        const moments = (dayjs as unknown) as { suppressDeprecationWarnings: boolean; };
        moments.suppressDeprecationWarnings = true;

        angular.mock.module('ib-MmB-filters-module', function ($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });

        inject(function ($filter, $rootScope) {
            filter = $filter('DateFormatFilter');
            rootScope = $rootScope;
        });
    });


    it('should be able to format date 2019', function (done) {

        var today = dayjs('2019-12-31');
        jasmine.clock().mockDate(new Date('2019-12-31'));
        expectedResult = {
            'dateTime': '',
            'weekDay': 'WEEKDAY_TUESDAY',
            'day': 31,
            'monthNumber': 12,
            'month': 'MONTH_DECEMBER',
            'year': 2019,
            'originalDate': today.format(),
            'formatedDate': '12/31/2019'
        }

        dateTest = '2019-12-31';
        result = filter(dateTest);
        expect(result).toEqual(expectedResult);
        done();
    });

    it('should be able to format date', function (done) {
        dateTest = '';
        result = filter(dateTest);
        expect(result).toBeUndefined();
        done();
    });

    it('should be able to format date', function (done) {
        const expectedResult = {
            'dateTime': '',
            'weekDay': 'WEEKDAY_SATURDAY',
            'day': 31,
            'monthNumber': 12,
            'month': 'MONTH_DECEMBER',
            'year': 2016,
            'originalDate': '2016-12-31T00:00:00+01:00',
            'formatedDate': '12/31/2019'
        }


        dateTest = '2016-12-31';
        result = filter(dateTest, format[0]);
        expect(result.day).toEqual(expectedResult.day);
        expect(result.monthNumber).toEqual(expectedResult.monthNumber);
        expect(result.year).toEqual(expectedResult.year);
        done();
    });




});
