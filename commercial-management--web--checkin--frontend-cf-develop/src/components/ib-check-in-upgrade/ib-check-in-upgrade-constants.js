(function () {
    'use strict';

    angular.module('ib-check-in-upgrade-module').constant('UpgradeConstants', {
        'UPGRADE_TYPES': [
            {
                'type': 'PREMIUM_ECONOMY',
                'onLand': ['UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_1','UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_2'],
                'onBoard': ['UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_1', 'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_2']
            },
            {
                'type': 'BUSINESS_PLUS',
                'onLand': ['UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_2', 'UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_3'],
                'onBoard': ['UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_2']
            },
            {
                'type': 'BUSINESS_CLUB',
                'onLand': ['UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_2'],
                'onBoard': ['UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_2']
            },
            {
                'type': 'BUSINESS',
                'onLand': ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2'],
                'onBoard': ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2']
            },
            {
                'type': 'BUSINESS_CLASS',
                'onLand': ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2',
                            'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_3'],
                'onBoard': ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2',
                            'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_3']
            },
            {
                'type': 'BUSINESS_AIR_NOSTRUM',
                'onLand': ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2'],
                'onBoard': ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2']
            },
            {
                'type': 'BUSINESS_IBERIA_EXPRESS',
                'onLand': ['UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_LAND_TEXT_2'],
                'onBoard': ['UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_1', 'UPGRADING_BUSINESS_CLASS_ON_BOARD_TEXT_2']
            }
        ]
    });
})();
