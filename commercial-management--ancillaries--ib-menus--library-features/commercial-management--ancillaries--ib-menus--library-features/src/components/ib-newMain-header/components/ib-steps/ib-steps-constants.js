(function () {
    'use strict';

    angular.module('ib-steps-module').constant('StepsConstants', {

        DEFAULT_STEPS: [
            {
                index:1,
                position: 'availability',
                text: 'HEADER_STEPS_FLIGHT_SELECT'
            },
            {
                index:2,
                position: 'ibairp',
                text: 'HEADER_STEPS_PASSENGER_DATA'
            },
            {
                index:3,
                position: 'ibcmtv',
                text: 'HEADER_STEPS_CUSTOM_COMPLETE'
            },
            {
                index:4,
                position: 'ibpurc',
                text: 'HEADER_STEPS_PAYMENT'
            },
            {
                index:5,
                position: 'confirmation',
                text: 'HEADER_STEPS_CONFIRMATION'
            }
        ],
        SHUTTLE_STEPS:  [
            {
                index:1,
                position: 'ibshuttle',
                text: 'SHUTTLE_BUY_RESUME'
            },
            {
                index:2,
                position: 'ibairp',
                text: 'HEADER_STEPS_PASSENGER_DATA'
            },
            {
                index:3,
                position: 'ibpurc',
                text: 'HEADER_STEPS_PAYMENT'
            },
            {
                index:4,
                position: 'confirmation',
                text: 'HEADER_STEPS_CONFIRMATION'
            }
        ],
        REDEMPTION_STEPS:  [
            {
                index:1,
                position: 'availability',
                text: 'HEADER_STEPS_FLIGHT_SELECT'
            },
            {
                index:2,
                position: 'ibairp',
                text: 'HEADER_STEPS_PASSENGER_DATA'
            },
            {
                index:3,
                position: 'ibpurc',
                text: 'HEADER_STEPS_PAYMENT'
            },
            {
                index:4,
                position: 'confirmation',
                text: 'HEADER_STEPS_CONFIRMATION'
            }
        ],
        GIFTCARDS_STEPS:  [
            {
                index:1,
                position: 'home',
                text: 'HEADER_STEPS_GIFT_CARD'
            },
            {
                index:2,
                position: 'ibpurc',
                text: 'HEADER_STEPS_PAYMENT'
            },
            {
                index:3,
                position: 'confirmation',
                text: 'HEADER_STEPS_CONFIRMATION'
            }
        ],
        GIFTCARDS_CONTRIBUTION_STEPS:  [
            {
                index:1,
                position: 'home',
                text: 'HEADER_STEPS_CONTRIBUTION_GIFT_CARD'
            },
            {
                index:2,
                position: 'ibpurc',
                text: 'HEADER_STEPS_PAYMENT'
            },
            {
                index:3,
                position: 'confirmation',
                text: 'HEADER_STEPS_CONFIRMATION'
            }
        ],
        SUBSCRIPTIONMODELS_STEPS:  [
            {
                index:1,
                position: 'home',
                text: 'HEADER_STEPS_SUBSCRIPTION_MODELS'
            },
            {
                index:2,
                position: 'ibpurc',
                text: 'HEADER_STEPS_PAYMENT'
            },
            {
                index:3,
                position: 'confirmation',
                text: 'HEADER_STEPS_CONFIRMATION'
            }
        ]


    });

})();
