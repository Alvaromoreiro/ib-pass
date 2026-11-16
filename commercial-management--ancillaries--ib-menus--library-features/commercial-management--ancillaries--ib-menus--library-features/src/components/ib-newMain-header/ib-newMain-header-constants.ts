namespace ibPlusConstantNamespace {

    const NewMainHeaderConstants = {
        TRIPS_NUMBER: {
            SMALL: 1,
            MEDIUM: 3,
            LARGE: 4
        },
        POSITION: {
            DEFAULT: 1
        },
        BKI_FLOW: {
            ONB: 'ONB'
        },
        LOGIN_TYPES: {
            ONB: 'ONB'
        },
        HEADER_TYPE:{
            AVAILABILITY: 'availabilityFlight',
            METASEARCH: 'metasearchFlight',
            MULTITRIP: 'multiCityFlight'
        },
        PASSENGER_TYPE: {
            SENIOR: 'SENIOR',
            ADULT: 'ADULT',
            YOUTH: 'YOUTH',
            TEENAGER: 'YOUNG',
            YOUNG_ADULT: 'YOUNG_ADULT',
            CHILD: 'CHILD',
            INFANT: 'INFANT'
        },
        DISCOUNT_TYPES:{
            AVIOS: 'AVIOS',
            VOUCHER: 'VOUCHER',
            PARTNER: 'PARTNER',
            DUMBO: 'DUMBO',
            PLUTO:'PLUTO',
            CORPORATE:'CORPORATE'
        },
        FLEXIBILIZATION_CONFIG: {
            type: 'ancillarie',
            title: 'ANCILLARIES_FLEXIBILITY_TITLE',
            category: 'flexibility',
            currency: '',
            amount: {
                title: 'ANCILLARIES_FLEXIBILITY_BASKET_AMOUNT',
                price: 0,
                priceFormatted:''
            },
            items: [],
            delete: [{ type: 'FLEXIBILITY_ON_DEMAND' }]
        },
        PRIORITY_BOARDING_CONFIG: {
            type: 'ancillarie',
            title: 'Prioridad de embarque',
            category: 'priority',
            currency: '',
            amount: {
                title: 'ANCILLARIES_PRIORITY_BASKET_AMOUNT',
                price: 0,
                priceFormatted:''
            },
            items: [],
            delete: [{ type: 'PRIORITY_BOARDING' }]
        },
        IB_ROLES: {
            ROLE_IBERIA_PLUS: 'ROLE_IBERIA_PLUS',
            ROLE_MEMBER_ZERO: 'ROLE_MEMBER_ZERO'
        }
    };

    try {
        const mod = angular.module('ib-newMain-header-module');

        mod.constant(
            'NewMainHeaderConstants', NewMainHeaderConstants
        );
    } catch (error) {
        const mod = angular.module('ib-newMain-header-module', []);
        mod.constant(
            'NewMainHeaderConstants', NewMainHeaderConstants
        );
    }

    export type NewMainHeaderConstants = typeof NewMainHeaderConstants;
}