interface HeaderStep {
    index: number;
    page: string;
    text: string;
}

interface AmountConfig {
    title: string;
    price: number;
    priceFormatted: string;
}

interface AncillarieConfig {
    type: string;
    title: string;
    category: string;
    currency: string;
    amount: AmountConfig;
    items: any[];
    delete: Array<{ type: string }>;
}

export type BookingStep = {
    DEFAULT_STEPS: HeaderStep[];
    FLASH_OFFER_STEPS: HeaderStep[];
    SHUTTLE_STEPS: HeaderStep[];
    REDEMPTION_OB_STEPS: HeaderStep[];
    ON_HOLD_RECOVERY_STEPS: HeaderStep[];
    BOOK_ONHOLD_STEPS: HeaderStep[];
    TRIPS_NUMBER: {
        SMALL: number;
        MEDIUM: number;
        LARGE: number;
    };
    POSITION: {
        DEFAULT: number;
    };
    BKI_FLOW: {
        ONB: string;
    };
    LOGIN_TYPES: {
        ONB: string;
    };
    HEADER_TYPE: {
        AVAILABILITY: string;
        METASEARCH: string;
        MULTITRIP: string;
    };
    PASSENGER_TYPE: {
        SENIOR: string;
        ADULT: string;
        YOUTH: string;
        TEENAGER: string;
        YOUNG_ADULT: string;
        CHILD: string;
        INFANT: string;
    };
    DISCOUNT_TYPES: {
        AVIOS: string;
        DYNAMIC_PRICING: string;
        VOUCHER: string;
        PARTNER: string;
        DUMBO: string;
        PLUTO: string;
        CORPORATE: string;
    };
    FLEXIBILIZATION_CONFIG: AncillarieConfig;
    PRIORITY_BOARDING_CONFIG: AncillarieConfig;
    IB_ROLES: {
        ROLE_IBERIA_PLUS: string;
        ROLE_MEMBER_ZERO: string;
    };
    CONDITION_TYPES: {
        HAND_BAGGAGE: string;
        CHECKED_BAGGAGE: string;
        SEAT: string;
        CHANGE: string;
        REFUND: string;
        FOOD: string;
    };
    ORDER_ITEMS_TYPES: {
        FLIGHT: string;
    };
    PAYMENT_ORDER_ITEMS_TYPES: {
        CREDIT_CARD: string;
        AVIOS: string;
        VOUCHER: string;
    };
    ANCILLARIES_PAGES_HASH: {
        BOOKING: string;
    };
    ANCILLARIES_TYPE: {
        BAGGAGE: string;
    };
};

export const BookingHeaderConstants :BookingStep = {
    DEFAULT_STEPS : [
        {
            index: 1,
            page: 'availability',
            text: 'HEADER_STEPS_FLIGHT_SELECT'
        },
        {
            index: 2,
            page: 'ibairp',
            text: 'HEADER_STEPS_PASSENGER_DATA'
        },
        {
            index: 3,
            page: 'ibcmtv',
            text: 'HEADER_STEPS_CUSTOM_COMPLETE'
        },
        {
            index: 4,
            page: 'ibpurc',
            text: 'HEADER_STEPS_PAYMENT'
        },
        {
            index: 5,
            page: 'confirmation',
            text: 'HEADER_STEPS_CONFIRMATION'
        }
    ],
    FLASH_OFFER_STEPS: [
        {
            index: 1,
            page: 'ibairp',
            text: 'HEADER_STEPS_PASSENGER_DATA'
        },
        {
            index: 2,
            page: 'ibpurc',
            text: 'HEADER_STEPS_PAYMENT'
        },
        {
            index: 3,
            page: 'confirmation',
            text: 'HEADER_STEPS_CONFIRMATION'
        }
    ],
    BOOK_ONHOLD_STEPS: [
        {
            index: 1,
            page: 'availability',
            text: 'HEADER_STEPS_FLIGHT_SELECT'
        },
        {
            index: 2,
            page: 'ibairp',
            text: 'HEADER_STEPS_PASSENGER_DATA'
        },
        {
            index: 3,
            page: 'ibpurc',
            text: 'HEADER_STEPS_PAYMENT'
        },
        {
            index: 4,
            page: 'confirmation',
            text: 'HEADER_STEPS_CONFIRMATION'
        }
    ],

    SHUTTLE_STEPS: [
        {
            index: 1,
            page: 'ibshuttle',
            text: 'SHUTTLE_BUY_RESUME'
        },
        {
            index: 2,
            page: 'ibairp',
            text: 'HEADER_STEPS_PASSENGER_DATA'
        },
        {
            index: 3,
            page: 'ibpurc',
            text: 'HEADER_STEPS_PAYMENT'
        },
        {
            index: 4,
            page: 'confirmation',
            text: 'HEADER_STEPS_CONFIRMATION'
        }
    ],
    REDEMPTION_OB_STEPS: [
        {
            index: 1,
            page: 'availability',
            text: 'HEADER_STEPS_FLIGHT_SELECT'
        },
        {
            index: 2,
            page: 'ibairp',
            text: 'HEADER_STEPS_PASSENGER_DATA'
        },
        {
            index: 3,
            page: 'ibpurc',
            text: 'HEADER_STEPS_PAYMENT'
        },
        {
            index: 4,
            page: 'confirmation',
            text: 'HEADER_STEPS_CONFIRMATION'
        }
    ],

    ON_HOLD_RECOVERY_STEPS: [
        {
            index: 1,
            page: 'ohmtdt',
            text: 'ON_HOLD_SUMMARY_TITLE'
        },
        {
            index: 2,
            page: 'ibcmtv',
            text: 'HEADER_STEPS_CUSTOM_COMPLETE'
        },
        {
            index: 3,
            page: 'ibpurc',
            text: 'HEADER_STEPS_PAYMENT'
        },
        {
            index: 4,
            page: 'confirmation',
            text: 'HEADER_STEPS_CONFIRMATION'
        }
    ],
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
        DYNAMIC_PRICING: 'DYNAMIC_PRICING',
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
    },
    CONDITION_TYPES: {
        HAND_BAGGAGE: 'EQMANO',
        CHECKED_BAGGAGE: 'EQBODEGA',
        SEAT: 'ASIENTO',
        CHANGE: 'CAMBIO',
        REFUND: 'REEMBOLSO',
        FOOD: 'COMIDA'
    },
    ORDER_ITEMS_TYPES: {
        FLIGHT: 'flight'
    },
    PAYMENT_ORDER_ITEMS_TYPES: {
        CREDIT_CARD: 'CREDITCARD',
        AVIOS: 'AVIOS',
        VOUCHER: 'VOUCHER'
    },
    ANCILLARIES_PAGES_HASH: {
        BOOKING: '/ibcmtv'
    },
    ANCILLARIES_TYPE: {
        BAGGAGE: 'BAGGAGES'
    }
};
