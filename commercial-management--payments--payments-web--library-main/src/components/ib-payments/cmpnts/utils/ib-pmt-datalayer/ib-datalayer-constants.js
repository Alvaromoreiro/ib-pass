(function () {
    'use strict';

    angular.module('ib-pmt-datalayer-module').constant('PmtDatalayerConstants', {
        DATALAYER_USER_STATES: {
            LOGGED: 'logado',
            ANONYMOUS: 'no_logado'
        },
        DATALAYER_USER_LEVELS: {
            KIDS: 2,
            CLASICA: 2,
            PLATA: 5,
            ORO: 1,
            INFINITA: 4,
            'INFINITA PRIME': 4,
            PLATINO: 4,
            'PLATINO PRIME': 4,
            COLECTIVOS: 'Colectivos',
            COLECTIVO: 'Colectivo',
            PSEUDOAGENCIA: 'PseudoAgencia',
            SERVIWEB: 'Serviweb'
        },
        DATALAYER_PASSENGER_TYPES: {
            ADULT: 'ADT',
            INFANT: 'INF',
            YOUNG_ADULT: 'YCD',
            SENIOR: 'SNR',
            MINOR: 'MNR',
            STUDENT: 'STD',
            CHILD: 'CHD',
            YOUTH: 'YTH'
        },
        DATALAYER_MODAL_ID: {
            BACK_MODAL: 'BACK_MODAL',
            POSIBLE_DELETE_SEGMENT: 'POSIBLE_DELETE_SEGMENT',
            FARE_CONDITIONS: 'FARE_CONDITIONS',
            WHERE_IS_PNR: 'WHERE_IS_PNR',
            PRIVATE_BROWSER_ERROR: 'PRIVATE_BROWSER_ERROR',
            CANCEL_SPECIAL_NEEDS_CONFIRMATION: 'CANCEL_SPECIAL_NEEDS_CONFIRMATION',
            ADVICE_PA_BOOKING: 'ADVICE_PA_BOOKING',
            INFO_CONFIDENTIALITY: 'INFO_CONFIDENTIALITY',
            CHECKIN_ONLINE_MORE_INFO: 'CHECKIN_ONLINE_MORE_INFO',
            BAGGAGE_POLICY: 'BAGGAGE_POLICY',
            BAGGAGE_WARNING: 'BAGGAGE_WARNING',
            SEGMENT_BAGGAGE_SUMMARY: 'SEGMENT_BAGGAGE_SUMMARY',
            BOARDING_CARD_AT_LEAST_ONE_SEND_TYPE_WARNING: 'BOARDING_CARD_AT_LEAST_ONE_SEND_TYPE_WARNING',
            BOARDING_CARD_AT_LEAST_ONE_FORMAT_WARNING: 'BOARDING_CARD_AT_LEAST_ONE_FORMAT_WARNING',
            BOARDING_CARD_FINISH_CHECKIN: 'BOARDING_CARD_FINISH_CHECKIN',
            BAGGAGE_RESTRICTIONS: 'BAGGAGE_RESTRICTIONS',
            ACCEPT_FORBIDDEN_ITEMS: 'ACCEPT_FORBIDDEN_ITEMS',
            AT_LEAST_ONE_PASSENGER_WARNING: 'AT_LEAST_ONE_PASSENGER_WARNING',
            EXCEDED_TOTAL_PASSENGER_WARNING: 'EXCEDED_TOTAL_PASSENGER_WARNING',
            NO_PREVIOUS_SEGMENT_WARNING: 'NO_PREVIOUS_SEGMENT_WARNING',
            SEGMENT_IN_GROUP_WARNING: 'SEGMENT_IN_GROUP_WARNING',
            PAYMENTS_TERMS_AND_CONTRACT_CONDITIONS: 'PAYMENTS_TERMS_AND_CONTRACT_CONDITIONS',
            PAYMENTS_CVV: 'PAYMENTS_CVV',
            BOOKING_SPLIT: 'BOOKING_SPLIT',
            PENDING_PEYMENTS: 'PENDING_PEYMENTS',
            STATE: {
                BLANKSPACE: ' '
            },
            PAYMENT_ERRORS: {
                BOOKING: {
                    CREDITCARD_DENIED: 'IBCCDN',
                    CREDITCARD_REJECT: 'IBREJC',
                    CREDITCARD_PCC: 'IBPCC',
                    BIN_VALIDATION_ERROR: 'IBPURM'
                },
                MANAGEMYBOOKING_ANCILLARIES: {
                    CREDITCARD_DENIED: 'MOCCDN',
                    CREDITCARD_REJECT: 'MOREJC'
                },
                MANAGEMYBOOKING_VOLUNTARY_CHANGES: {
                    CREDITCARD_DENIED: 'ATCCCDN',
                    CREDITCARD_REJECT: 'ATCREJC',
                    CREDITCARD_PCC: 'ATCPCC'
                }
            }

        },
        DATALAYER_INFO: {
            LANGUAGE: 'idioma',
            MARKET: 'mercado',
            USER_STATE: 'EstadoUsuario',
            QUADRIGAM: 'quadrigam',
            CODE: 'codigoSeguimiento',
            WEB_VERSION: 'versionWeb',
            WEB_MODE: 'modeWeb',
            USER_LEVEL: 'NivelUsuario',
            USER_ID: 'userID',
            USER_SEGMENT: 'segmento',
            IS_AIR_SHUTTLE: 'puenteAereo',
            ORIGIN_DESTINATIONS: 'trayectoAeropuerto',
            PASSENGER_TYPES: 'tipoPax',
            TOTAL_PASSENGERS: 'numeroPax',
            SEGMENT_OPERATORS: 'operadoraVuelo',
            SEGMENT_DATES: 'fecha',
            DEPARTURE_AIRPORT: 'aeropuertoOrigen',
            ARRIVAL_AIRPORT: 'aeropuertoDestino',
            TOTAL_AVAILABILITY: 'resultadosBusqueda',
            DEPARTURE_TIME: 'horarioSalida',
            ERROR_CODE: 'errorSeverityCode',
            ERROR_DESCRIPTION: 'tipoError',
            MODAL_ID: 'modal',
            INIT_TYPE: 'detalleInicio',
            ANCILLARIES_BOUGHT: 'ancillariesComprados',
            BOOKING_CLASS: 'claseReserva',
            UPGRADE_SHOWN: 'upgradingMostrado',
            UPGRADE_SENT: 'upgradingEnviado',
            UPGRADE_TOTAL: 'upgradingImporteMoneda',
            APIS_FULFILLED: 'APIScumplimentados',
            HPBT: 'HPBT',
            DOWNLOAD_FORMAT: 'formatoDescarga',
            VIP_ROOM: 'salaVIP',
            CREDITCARD_TYPE: 'tipoTarjeta',
            PAYMENT_METHOD: 'PaymentMethod',
            VOUCHER_DISCOUNT_AMOUNT: 'descuentoBono',
            GIFT_CARD: 'tarjetaRegalo'
        },
        DATALAYER_EVENT_TYPES: {
            VIEW: 'view',
            LINK: 'link'
        },
        DATALAYER_VALUES: {
            YES: 'SI',
            NO: 'NO',
            WEB_VERSION: 'angularjs',
            INIT_LOCATOR: 'por localizador',
            INIT_IB_PLUS: 'por IB plus',
            FREE: 'gratuito',
            PAYMENT: 'pago',
            BAGGAGES: 'Maletas',
            SEATS: 'Asientos',
            ASSURANCES: 'Seguros',
            PDF_FORMAT: 'PDF',
            QR_FORMAT: 'QR',
            PASSBOOK_FORMAT: 'Passbook',
            OFFERED: 'Ofertados',
            EMITED: 'Emitidos',
            FLEXIBLE: 'flexibilizado',
            NON_FLEXIBLE: 'no_flexibilizado',
            DISRUPTED: 'disruptado',
            SEGMENT_OPEN: 'OPEN'
        },
        SEGMENT_TYPES: {
            OPEN: 'OPEN',
            CONFIRMED: 'CONFIRMED'
        },
        PASSENGERS_TYPES: {
            ADULT: 'ADULT',
            CHILD: 'CHILD',
            INFANT: 'INFANT'
        },
        SEGMENT_CABIN_PRIORITY: {
            F: 1,
            B: 2,
            E: 3,
            R: 4
        },
        DATALAYER_GIFTCARD: {
            BENEFICIARY_USUARIO: 'usuario',
            BENEFICIARY_OTRO: 'otro',
            TYPE_OWN: 'OWN'
        }
    });
})();
