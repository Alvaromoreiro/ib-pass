(function () {
    'use strict';
    angular.module('ib-disruption-main-module').constant('DisruptionDashboardConstants', {
        ORDER_STATUS_VALUES: {
            'INVOLUNTARY_FLAG': 'ACCEPT_CHANGES_PENDING',
            'CANCELATION_FLAG': 'UNCONFIRMED_CHANGES',
            'CANCELATION_REACOM_FLAG': 'ACCEPT_CHANGES_PENDING',
            'SCHEDULE_CHANGE': 'ACCEPT_CHANGES_PENDING_TK',
            'CANCELATION_MIXED_CHANGE': 'UNCONFIRMED_CHANGES_MIXED',
            'CANCELATION_REACOM_MIXED_CHANGE': 'ACCEPT_CHANGES_PENDING_MIXED',
            'CANCELATION_CHANGES': 'CANCELATION_CHANGES',
            'WAITLIST_CONFIRMED_CHANGES': 'WAITLIST_CONFIRMED_CHANGES',
            'DISRUPTION_CHANGES_MIXED': 'DISRUPTION_CHANGES_MIXED'
        },
        SEGMENT_STATUS_VALUES: {
            'PENDING': 'TK',
            'UNABLE': 'UN',
            'CONFIRMED': 'HK',
            'SHEDULE': 'TKT',
            'WAITLIST_CANCELED': 'UC',
            'CANCELED_HX': 'HX',
            'WAITLIST_CONFIRMED': 'KL',
            'RECONFIRMED': 'RR',
            'FORCED_CONFIRMED': 'KK',
            'WAITLIST': 'HL',
            'WAITLIST_BEFORE_SC': 'TL',
            'PETITON': 'HN',
            'SPACE_ATTACHED': 'SA',
            'CANCELED_NO': 'NO',
            'DOWNGRADE': 'DOWN',
        },
        QUADRIGAMS: {
            'UC_SELECTOR_SINGLE_FLIGHT': {
                'value': 'FLEXIBILIZATION_INVOLUNTARY_SEARCH_ONE_WAY',
                'updateOnInitialize': true
            },
            'UC_SELECTOR_MULTIPLE_FLIGHT': {
                'value': 'FLEXIBILIZATION_INVOLUNTARY_SEARCH_WITH_RETURN',
                'updateOnInitialize': true
            },
            'UC_WITHOUT_SELECTOR': {
                'value': 'CANCEL_FLIGHT_INV',
                'updateOnInitialize': true
            },
        },
        FLIGHTS_TYPES: {
            'DIRECT': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
            'INDIRECT': 'MMB_YOUR_FLIGHTS_SCALE_SIMPLE_TEXT'
        },
        FARE_CONDITION_CODES: [
            { 'code': 'EQMANO', 'class': 'icon-e_equipaje' },
            { 'code': 'EQBODEGA', 'class': 'icon-e_equipaje_facturado' },
            { 'code': 'ASIENTO', 'class': 'icon-asiento' },
            { 'code': 'ASIENTOXL', 'class': 'icon-asiento-plus' },
            { 'code': 'CAMBIO', 'class': 'icon-cambios_y_reembolsos' },
            { 'code': 'REEMBOLSO', 'class': 'icon-reembolsos' },
            { 'code': 'CHECKINDESK', 'class': 'icon-check_in' },
            { 'code': 'SALAVIP', 'class': 'icon-sala_vip' },
            { 'code': 'FASTTRACK', 'class': 'icon-fast_track' },
            { 'code': 'TARJEMBANTIC', 'class': 'icon-tarjeta_de_embarque' },
            { 'code': 'EMBARQUE', 'class': 'icon-priority-boarding' },
            { 'code': 'EQPPRIOR', 'class': 'icon-e_facturacion_prioritaria' },
            { 'code': 'COMIDA', 'class': 'icon-c_comidas_nuevas' },
            { 'code': 'WIFI', 'class': 'icon-wifi' },
            { 'code': 'CABINA', 'class': 'icon-navegador_avion' },
            { 'code': 'AVIO', 'class': 'icon-avios' },
            { 'code': 'AEROPUERTO', 'class': 'icon-canary-plus' },
            { 'code': 'AVIOSPLUS', 'class': 'icon-avios' },
            { 'code': 'PUNTUALIDAD', 'class': 'icon-utilizacion_avios' },
            { 'code': 'FASTLANE', 'class': 'icon-fast_track' }
        ],
        FLIGHT_LIST_MODEL: [
            { 'name': 'reacomList' },
            { 'name': 'canceledList' },
            { 'name': 'confirmedList' },
            { 'name': 'sheduleList' },
            { 'name': 'downgradeList'}
        ],
        FLIGHTS_WARNINGS: {
            'AIRPORT_CHANGE': 'SSE_ORM_20001',
            'TERMINAL_CHANGE': 'SSE_ORM_20002',
            'FLIGHT_STOP': 'SSE_ORM_20004',
            'CONECTION_LOST': 'SSE_ORM_20013',
            'OVERNIGHT_FLIGHT': 'SSE_ORM_20003'
        },
        SEGMENT_WARNINGS: {
            'SAME_FLIGHT_SAME_TIME': 'SSE_ORM_9429',
            'DIFF_FLIGHT_OR_TIME': 'SSE_ORM_9430',
            'SAME_FLIGHT_SAME_TIME_UNTK': 'SSE_ORM_9433'
        },
        DISRUPTION_TYPES: {
            'TYPE_SCHEDULE': 'SCHEDULE_CHANGE',
            'TYPE_SCHEDULE_TIME': 'SCHEDULE_TIME_CHANGE',
            'TYPE_CHANGE': 'FLIGHT_CHANGE',
            'TYPE_CANCEL': 'CANCELATION_CHANGE_NO_REACOM',
            'TYPE_CANCEL_REACOM': 'CANCELATION_CHANGE',
            'TYPE_SCHEDULE_MIXED': 'SCHEDULE_TIME_AND_CANCELATION',
            'TYPE_CANCEL_MIXED': 'CANCELATION_CHANGE_MIXTED',
            'TYPE_CANCEL_MISSCONECTION': 'MISSCONECTION',
            'TYPE_CANCEL_GENERAL': 'GENERAL_CANCELATION_CHANGE_NO_REACOM',
            'TYPE_CANCEL_REACOM_GENERAL': 'GENERAL_CANCELATION_CHANGE_REACOM',
            'TYPE_SCHEDULE_GENERAL': 'GENERAL_SCHEDULE_CHANGE',
            'TYPE_CANCEL_MIXED_GENERAL': 'GENERAL_CANCELATION_CHANGE_MIXTED',
            'TYPE_SCHEDULE_MIXED_GENERAL': 'GENERAL_SCHEDULE_TIME_AND_CANCELATION',
            'TYPE_SCHEDULE_TIME_GENERAL': 'GENERAL_SCHEDULE_TIME_CHANGE',
            'TYPE_GENERIC': 'GENERIC',
            'CANCELATION_CHANGE_NO_REACOM_MISSCONECTION': 'CANCELATION_CHANGE_NO_REACOM_MISSCONECTION',
            'CANCELATION_CHANGE_MISSCONECTION': 'CANCELATION_CHANGE_MISSCONECTION',
            'SCHEDULE_TIME_CHANGE_MISSCONECTION': 'SCHEDULE_TIME_CHANGE_MISSCONECTION',
            'CANCELATION_CHANGE_MIXTED_MISSCONECTION': 'CANCELATION_CHANGE_MIXTED_MISSCONECTION',
            'SCHEDULE_TIME_AND_CANCELATION_MISSCONECTION': 'SCHEDULE_TIME_AND_CANCELATION_MISSCONECTION',
            'GENERIC_MISSCONECTION': 'GENERIC_MISSCONECTION',
            'SCHEDULE_CHANGE_MISSCONECTION': 'SCHEDULE_CHANGE_MISSCONECTION',
            'DOWNGRADE_SAME_FLIGHT': 'GENERAL_SCHEDULE_TIME_CHANGE_DOWNGRADE',
            'DOWNGRADE_DIFF_FLIGHT': 'GENERAL_CANCELATION_CHANGE_REACOM_DOWNGRADE'
        },
        DISRUPTION_TIME: {
            COMMERCIAL: 'COMMERCIAL_TIME',
            OPERATIONAL: 'OPERATIONAL_TIME'
        },
        FLOW_FLAGS: {
            'DISRUPTION_SEARCH': 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
            'GENERIC_DISRUPTION_SEARCH': 'FLIGHT_DISRUPTION_SEARCH',
            'VOULNTARY_SEARCH': 'FLIGHT_MODIFICATION_FLEXIBLE'
        },
        FLEX_INFO: {
            'COVID': 'COVID19'
        },
        REFUND_FLAGS: [
            { 'flag': 'VOUCHER_REFUND' },
            { 'flag': 'CASH_REFUND' }
        ],
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

        SLICE_INFO: {
            'TYPE_SCHEDULE': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_SCHEDULE_TIME': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': true,
                        'NUMBER_ENABLED': false,
                        'CALLCENTER': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': true,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'CALLCENTER': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': true,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_CANCELATION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--prev',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--white',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': true
                },
            },
            'TYPE_CANCELATION_WITH_ALTERNATIVE': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_PREV_CANCEL',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL_OUTBOUND_V2',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL_RETURN_V2',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--prev',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--white',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': true
                },
            },
            'TYPE_CONFIRMED': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': 'MMB_DISRUPTION_LABEL_REMEMBER',
                        'CARD_DESCRIPTION': 'MMB_DISRUPTION_LABEL_OTHER_SLICE_OK_V2',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': true,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },
            },
            'TYPE_CONFIRMED_TIME': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': 'MMB_DISRUPTION_LABEL_REMEMBER',
                        'CARD_DESCRIPTION': 'MMB_DISRUPTION_LABEL_OTHER_SLICE_OK_V2',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': true,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--grey',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'

                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },
            },
            'TYPE_CONFIRMED_TIME_MIXED': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': 'MMB_DISRUPTION_LABEL_REMEMBER',
                        'CARD_DESCRIPTION': 'MMB_DISRUPTION_LABEL_OTHER_SLICE_OK_V2',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': true,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--grey',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'

                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },
            },
            'TYPE_REACOM': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': 'MMB_DISRUPTION_ALTERNATIVE_TITLE',
                        'CARD_DESCRIPTION': 'MMB_DISRUPTION_ALTERNATIVE_DESCRIPTION',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': true,
                        'ACCEPT_BUTTON_ENABLED': true,
                        'NUMBER_ENABLED': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--prev',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--white',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },
            },
            'TYPE_MISSCONECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'CALLCENTER': true,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': true,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_MISSCONECTION_BLACK': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'CALLCENTER': true,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--prev',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': true,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_GENERIC': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'CALLCENTER': true,
                        'WARNING_MISSCONNECTION': false
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': '',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': '',
                    'FLIGHT_INFO_MESSAGE_RETURN': '',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': true,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_SCHEDULE_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': true,
                        'WARNING_MISSCONNECTION': true
            }
        },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_SCHEDULE_TIME_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'CALLCENTER': true,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': true,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'CALLCENTER': true,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_NEW_SCHEDULE_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': true,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            },
            'TYPE_CANCELATION_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL_OUTBOUND_V2',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL_RETURN_V2',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--prev',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--white',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': true
                },
            },
            'TYPE_CANCELATION_WITH_ALTERNATIVE_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_PREV_CANCEL',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL_OUTBOUND_V2',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CANCEL_RETURN_V2',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--prev',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--white',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': true
                },
            },
            'TYPE_CONFIRMED_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': 'MMB_DISRUPTION_LABEL_REMEMBER',
                        'CARD_DESCRIPTION': 'MMB_DISRUPTION_LABEL_OTHER_SLICE_OK_V2',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': true,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },
            },
            'TYPE_CONFIRMED_TIME_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': 'MMB_DISRUPTION_LABEL_REMEMBER',
                        'CARD_DESCRIPTION': 'MMB_DISRUPTION_LABEL_OTHER_SLICE_OK_V2',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': true,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--grey',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'

                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },
            },
            'TYPE_CONFIRMED_TIME_MIXED_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': 'MMB_DISRUPTION_LABEL_REMEMBER',
                        'CARD_DESCRIPTION': 'MMB_DISRUPTION_LABEL_OTHER_SLICE_OK_V2',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': true,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_TYPE_FLIGHT_CHANGE_CONFIRMED_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--grey',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'

                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },
            },
            'TYPE_REACOM_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': true,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_OUTBOUND',
                    'FLIGHT_INFO_MESSAGE_RETURN': 'MMB_DISRUPTION_REACCOM_NEW_FLIGHT_RETURN',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--prev',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': 'ib-ticket-block__date ib-ticket-block__date--white',
                    'FLIGHT_XS_AREA_DATES_DATE': 'ib-ticket-block__date  ib-ticket-block__date--grey'
                },
                FLAG: {
                    'PREV_DATE': false,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },
            },
            'TYPE_GENERIC_MISSCONNECTION': {
                COMMON_CARD_VALUES: {
                    LITERAL: {
                        'CARD_TITLE': '',
                        'CARD_DESCRIPTION': '',
                    },
                    FLAG: {
                        'CARD_TITLE_ENABLED': false,
                        'ACCEPT_BUTTON_ENABLED': false,
                        'NUMBER_ENABLED': false,
                        'CALLCENTER': true,
                        'WARNING_MISSCONNECTION': true
                    }
                },
                LABEL: {
                    'FLIGHT_INFO_MESSAGE': '',
                    'FLIGHT_INFO_MESSAGE_OUTBOUND': '',
                    'FLIGHT_INFO_MESSAGE_RETURN': '',
                    'FLIGHT_DETAIL_COLLAPSE': 'MMB_DISRUPTION_LABEL_DETAILS_FLIGHT_AND_RATE',
                    'FLIGHT_DETAILS': 'MMB_DISRUPTION_LABEL_FLIGHT_DETAILS'
                },
                CSS_CLASS: {
                    'FLIGHT_NORMAL_AREA_DATES_CONTAINER': 'ib-ticket-block__flight-info--new',
                    'FLIGHT_NORMAL_AREA_CABIN_CONTAINER': 'ib-ticket-block__flight-info--cabin',
                    'FLIGHT_NORMAL_AREA_DATES_DATE': '',
                    'FLIGHT_XS_AREA_DATES_DATE': ''
                },
                FLAG: {
                    'PREV_DATE': true,
                    'CURR_DATE': true,
                    'SLICE_DETAIL_AREA': true,
                    'NODE_DETAIL': true,
                    'FARE_DETAIL': true,
                    'WARNING_ICON': false
                },

            }
        },
        CONFIGURATION_TYPE: {
            'SCHEDULE_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE'
            },
            'SCHEDULE_CHANGE_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'SCHEDULE_TIME_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE',
                    'SUBTITLE': 'MMB_DISRUPTION_ALTERNATIVE_HEADER_SUB_TITLE',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'SCHEDULE_TIME_CHANGE_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE_MIXTED': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_COVID',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'CANCELATION_CHANGE_MIXTED_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE_NO_REACOM': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_COVID',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_OFFER_CHANGES'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE_NO_REACOM_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }]
                    }
                ],
            },
            'CANCELATION_CHANGE_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_REACOM_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'SCHEDULE_TIME_AND_CANCELATION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    }
                ],
            },
            'SCHEDULE_TIME_AND_CANCELATION_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_REACOM_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_MISSCONNECTION',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_MISSCONECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_MISSCONECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'MISSCONECTION_BLACK': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                //CREAR UN NUEVO TIPO DE MISSCONNECTION IGUAL PERO CON 'type': 'TYPE_MISSCONECTION', TENIENDO EL TYPE_MISSCONECTION EL COLOR DE TARJETA GRIS (CSS)
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_MISSCONECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_MISSCONECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'GENERAL_CANCELATION_CHANGE_NO_REACOM': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_NO_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_OFFER_CHANGES'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
            },
            'GENERAL_CANCELATION_CHANGE_REACOM': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_WITH_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }]
                    }
                ],
            },
            'GENERAL_CANCELATION_CHANGE_REACOM_DOWNGRADE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_WITH_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'DOWN' }],
                        'invalidSegmentStatus': [{'code': 'TK'}]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }],
                        'invalidSegmentStatus': [{'code': 'UN'}]
                    }
                ],
            },
            'GENERAL_SCHEDULE_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_SCHEDULE_CHANGE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE'
            },
            'GENERAL_CANCELATION_CHANGE_MIXTED': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_NO_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    }
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'GENERAL_SCHEDULE_TIME_AND_CANCELATION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_WITH_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_CANCELATION_WITH_ALTERNATIVE',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'UN' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME_INCANCELED_BLOCK',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                    {
                        'type': 'TYPE_REACOM',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TK' }]
                    },
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'bottomCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    }
                ],
            },
            'GENERAL_SCHEDULE_TIME_CHANGE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'TKT' }]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'GENERAL_SCHEDULE_TIME_CHANGE_DOWNGRADE': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_HAS_CHANGE_DOWNGRADE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_DOWNGRADE',
                    'TITLE_DESC': 'MMB_DISRUPTION_SHOW_NEW_FLIGHT_DETAILS_TICKET',
                    'GENERAL_TITLE_DESCRIPTION': 'MMB_DISRUPTION_GENERAL_ALTERNATIVE_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_SCHEDULE_TIME',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'DOWN' } ],
                        'invalidSegmentStatus': [{'code': 'UN'}]
                    },
                    {
                        'type': 'TYPE_CONFIRMED_TIME',
                        'model_name': 'middleCard',
                        'validStatus': [{ 'code': 'HK' }]
                    },
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'GENERIC': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_GENERAL_CANCELATION_WITH_ALTERNATIVE_TITLE',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_GENERIC',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'HK'}, { 'code': 'TK'}, { 'code': 'RR'}, {'code': 'KK' },
                        { 'code': 'HL' }, { 'code': 'TL' }, { 'code': 'KL' }, { 'code': 'HN' }, { 'code': 'SA' },
                        { 'code': 'HX' }, { 'code': 'NO' }, { 'code': 'UN' }, { 'code': 'UC' }, { 'code': 'TKT' }]
                    }
                ],
                'SLICE_TYPE': 'TYPE_SCHEDULE_TIME'
            },
            'GENERIC_MISSCONECTION': {
                'FLAG': {
                    'CALLCENTER': false,
                },
                'LABEL': {
                    'TITLE': 'MMB_DISRUPTION_FLIGHT_CANCELATION_MISSCONECTION',
                    'SUBTITLE': 'MMB_DISRUPTION_REACCOM_HEADER_SUB_TITLE_V2',
                    'TITLE_DESC': 'MMB_DISRUPTION_REACCOM_HEADER_TITLE_DESC'
                },
                'ORDERED_SLICES': [
                    {
                        'type': 'TYPE_GENERIC_MISSCONNECTION',
                        'model_name': 'headerCard',
                        'validStatus': [{ 'code': 'HK' }, { 'code': 'TK' }, { 'code': 'RR' }, { 'code': 'KK' },
                        { 'code': 'HL' }, { 'code': 'TL' }, { 'code': 'KL' }, { 'code': 'HN' }, { 'code': 'SA' },
                        { 'code': 'HX' }, { 'code': 'NO' }, { 'code': 'UN' }, { 'code': 'UC' }, { 'code': 'TKT' }]
            }
                ],
            }
        },
        QUADRIGAM_BY_DISRUPTION_FLOW: {
            'ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION': 'ALT_TOTAL_WITH_FLEX',
            'ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION': 'ALT_PARC_WITH_FLEX',
            'ALTERANTIVE_TOTAL_WITHOUT_FLEXIBILIZATION': 'ALT_TOTAL_WITHOUT_FLEX',
            'ALTERNATIVE_PARCIAL_WITHOUT_FLEXIBILIZATION': 'ALT_PARC_WITHOUT_FLEX'
        },
        DISRUPTED_CHANGE_CONDITIONS: {
            IBERIA_OPER :{
                'keepConditions':[
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_1'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_2'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_3'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_4'
                    }
                ],
                'keepConditionsSpecific':[
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_1'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_2'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_3'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_4'
                    }
                ],
                'notKeepConditions':[
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_1'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_2'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_3'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_4'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_5'
                    }
                ],
                'notKeepConditionsSpecific':[
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_1'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_2'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_3'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_4'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_NEW_5'
                    }
                ]
            },
            NOT_IBERIA_OPER:{
                'keepConditions':[
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_1'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_6'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_7'
                    }
                ],
                'notKeepConditions':[
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_2'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_3'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_6'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_7'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_NOT_KEEP_CONDITION_8'
                    }
                ]
            },
        },
        OPERATIONAL_GROUP_IBERIA: ['IB', 'I2', 'YW', 'LV', 'I0', '0I', 'LL'],
        ORDER_ITEMS_TYPE_TO_AVOID: ['baggage', 'specialEquipment', 'flexibilityOnDemand', 'priorityBoarding'],
        DEFAULT_MAX_MODIFICATION_DAYS : 360,
        MENU_OPTION: {
            'DIGITAL_MENU': 'DIGITAL_MENU',
            'GASTROBAR': 'GASTROBAR',
            'NONE': 'NONE'
        }
    });
})();
