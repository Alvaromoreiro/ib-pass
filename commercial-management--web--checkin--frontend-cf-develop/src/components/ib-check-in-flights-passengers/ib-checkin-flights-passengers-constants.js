(function () {
    'use strict';

    angular.module('ib-checkin-flights-passengers-module').constant('FlightsPassengersConstants', {
        DEFAULT_COMPANY_CODE: 'CKI_COMBO_BLANK',
        WHAT_TO_DO_OPTIONS: {
            PRINT: {
                id: 'print',
                title: 'IBCOAC_WHAT_TO_DO_BOARDING_CARDS_TITLE',
                icon: 'icon-imprimir',
                'type:': 'REGULAR',
                isSelected: false
            },
            MANAGE_CKI: {
                id: 'manageCki',
                title: 'IBCOAC_PASS_DUPLICADO',
                icon: 'icon-e_equipaje',
                'type:': 'REGULAR',
                isSelected: false
            }
        }
    });
})();
