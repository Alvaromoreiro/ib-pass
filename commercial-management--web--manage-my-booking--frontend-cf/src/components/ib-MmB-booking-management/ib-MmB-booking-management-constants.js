(function () {
    'use strict';

    angular.module('ib-MmB-booking-management-module').constant('BookingManagementConstants', {
        'SEGMENT_OPTION': {
            'SEAT': 'SEAT',
            'BOARDING': 'BOARDING',
            'CHECKIN': 'CHECKIN',
            'MODIFY': 'MODIFY'
        },
        'SEGMENT_OPTION_STEP': {
            'SEAT': 'DO_SEAT_MAP',
            'BOARDING': 'DO_BOARDING',
            'FLY_NOW_CKI': 'DO_FLY_NOW_CKI',
            'FLY_NOW_MMB': 'DO_FLY_NOW_MMB',
            'FLIGHT_PASSENGER_CKI': 'FLIGHT_PASSENGER_CKI'
        },
        'SPECIAL_NEEDS_STATUS': ['CHECKED'],
        'ORDER_ITEMS': {
            'SEAT': 'seat'
        },
        'OPTIONAL_INFORMATION': {
            'CONTACT_DATA': 'CONTACT_DATA',
            'EMERGENCY': 'EMERGENCY',
            'FF': 'FF',
            'PMRS': 'PMRS'
        },
        'DATA_CONTACT': {
            'CONTACT': 'CONTACT'
        }
    });
})();