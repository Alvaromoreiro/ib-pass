export const fakeMmBAppConstants = {
    QUADRIGAM: {
        STOP_OVER: 'STOP_OVER',
        COMPLETE_TRAVEL: 'COMPLETE_TRAVEL',
        FLEXIBILIZATION_SEARCH_ONE_WAY: 'FLEXIBILIZATION_SEARCH_ONE_WAY',
        CHANGE_FLIGHTS_SARCH_ONE_WAY: 'CHANGE_FLIGHTS_SARCH_ONE_WAY',
        FLEXIBILIZATION_SEARCH_WITH_RETURN: 'FLEXIBILIZATION_SEARCH_WITH_RETURN',
        CHANGE_FLIGHTS_SEARCH_WITH_RETURN: 'CHANGE_FLIGHTS_SEARCH_WITH_RETURN',
    },
    PNR_EMITION_CHANNEL: {
        FLEX_FLIGHT_DIRECT: [
            'IBCOM',
            'CALL_CENTER',
            'NDC_DIRECT'
        ],
        FLEX_FLIGHT_INDIRECT: [
            'NDC_INDIRECT',
            'OTHER',
        ],
    },
    ORDER_ITEMS_TYPE_TO_AVOID: ['baggage', 'specialEquipment', 'flexibilityOnDemand', 'priorityBoarding'],
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
    WCS: {
        'PHONE_TYPES': {
            'SALES': 'RESERVAS',
            'IBHOLIDAYS': 'ATTBAH'
        }
    },
    SIMULATOR_MANAGEMENT_FEES_ROUTES: {
        CA: 'despeses-de-gestio/',
        DE: 'serviceentgelt/',
        ES: 'gastos-de-gestion/',
        EN: 'service-fees/',
        FR: 'frais-demission/',
        IT: 'addebiti-per-emissione/',
        NL: 'nl/service-fees/',
        PT: 'gastos-de-emissao/',
        RU: 'administrativnij-sbor/',
        ZH: 'zh/service-fees/',
        JA: 'ja/service-fees/',
        DEFAULT: 'service-fees'
    }
};
