import * as angular from 'angular';

const envCopy: any = {};
(<any>Object).assign(envCopy, (<any>window).env);
const GLOBAL_AUTH_TOKEN = envCopy.globalAuthorizationToken;
const AUTH_URI = envCopy.auth;
const SERVICE_URI = envCopy.services;
const CkiDatalayerConstants =  {
    DIGITAL_DATA_PROCESS:{
        MOAPIS: 'servicing',
        MOEMER: 'servicing',
        MOCONT: 'servicing',
        MOFFLY: 'servicing',
        MOPMR: 'servicing',
        MOCAPI: 'servicing',
        MOCEME: 'servicing',
        MOINFO: 'servicing',
        MOCFFL: 'servicing',
        MOCPMR: 'servicing',
        MODSEA: 'servicing',
        MODBAG: 'servicing',
        MODPAX: 'servicing',
        MODDOC: 'servicing',
        IBMTFL: 'servicing',
        IBENIT: 'servicing',
        IBCENIT: 'servicing',
        OHMTDT: 'confirmacion onhold',
        OHINFO: 'confirmacion onhold',
        RTBKCF: 'confirmacion onhold',
        ATCFCNA: 'cambios voluntarios',
        ATCFOW: 'cambios voluntarios',
        ATCFRT: 'cambios voluntarios',
        ATCERD: 'cambios voluntarios',
        ATCPOW: 'cambios voluntarios',
        ATCPRT: 'cambios voluntarios',
        ATCERR: 'cambios voluntarios',
        ATCERT: 'cambios voluntarios',
        ATCSUM: 'cambios voluntarios',
        ATCPURC: 'cambios voluntarios',
        ATCBKCF: 'cambios voluntarios',
        ATCBKER: 'cambios voluntarios',
        ATCPSG: 'cambios voluntarios',
        MOANCI: 'ancillaries',
        MOSEAT: 'ancillaries',
        MOPRIO: 'ancillaries',
        MOBAGG: 'ancillaries',
        MOLUGG: 'ancillaries',
        MOMEAL: 'ancillaries',
        MOPURC: 'ancillaries',
        MOBKCF: 'ancillaries',
        IBMCYT: 'ancillaries',
        MODBOB: 'ancillaries',
        MOFLEX: 'ancillaries',
        MODINS: 'ancillaries',
        MOUPG: 'ancillaries',
        RVFDBT: 'reembolso flexibilizacion bono',
        RVFDBD: 'reembolso flexibilizacion bono',
        RVFCEB: 'reembolso flexibilizacion bono',
        RVFCFP: 'reembolso flexibilizacion bono',
        RVFCFM: 'reembolso flexibilizacion bono',
        RVDDBT: 'reembolso disrupcion',
        RVDDBD: 'reembolso disrupcion',
        RVDCEB: 'reembolso disrupcion',
        RCDDBD: 'reembolso disrupcion',
        RCDCEB: 'reembolso disrupcion',
        RCFCEB: 'reembolso disrupcion',
        RVDCFP: 'reembolso disrupcion',
        RVDCFM: 'reembolso disrupcion',
        RCDCFP: 'reembolso disrupcion'
    },
    DIGITAL_DATA_STEP:{
        MOAPIS: 'apis',
        MOEMER: 'emergencias',
        MOCONT: 'contacto',
        MOFFLY: 'frequent flyer',
        MOPMR: 'asistencia',
        MOCAPI: 'confirmacion apis',
        MOCEME: 'confirmacion emergencias',
        MOINFO: 'info',
        MOCFFL: 'confirmacion frequent flyer',
        MOCPMR: 'confirmacion asistencia',
        MODPAX: 'info pasajeros',
        IBMTFL: 'tus vuelos',
        MODDOC: 'documentacion',
        IBENIT: 'envio intinerario',
        IBCENIT: 'confirmacion envio intinerario',
        OHMTDT: 'Recuperacion',
        OHINFO: 'Info. PAGO',
        RTBKCF: 'Confirmar RESERVA ON-HOLD',
        CNCLIT: 'cancelacion',
        ATCFCNA: 'no disponible',
        ATCFOW: 'inicio',
        ATCFRT: 'inicio',
        ATCERD: 'error busqueda',
        ATCPOW: 'disponibilidad',
        ATCPRT: 'disponibilidad',
        ATCERR: 'error ribbon',
        ATCERT: 'error selección',
        ATCSUM: 'resumen',
        ATCPURC: 'pago',
        ATCBKCF: 'confirmacion',
        ATCBKER: 'comunicación cortada',
        ATCPSG: 'sesion expirada',
        MOANCI: 'inicio',
        MODSEA: 'modal asientos',
        MODBAG: 'modal equipaje',
        MOSEAT: 'asientos',
        MOPRIO: 'prioridad embarque',
        MOBAGG: 'equipaje',
        MOLUGG: 'equipaje especial',
        MOMEAL: 'comida',
        MOPURC: 'pago',
        MOBKCF: 'confirmacion',
        IBMCYT: 'hoteles coches',
        MODBOB: 'recogida equipaje',
        MOFLEX: 'billete flexible',
        MODINS: 'modal seguro',
        MOUPG: 'upg',
        RVFDBT: 'inicio',
        RVFDBD: 'desglose',
        RVFCEB: 'aceptación',
        RVDCEB: 'aceptación bono',
        RVFCFP: 'confirmacion',
        RVFCFM: 'confirmacion',
        RVDDBT: 'inicio',
        RVDDBD: 'desglose bono',
        RCDDBD: 'desglose cash',
        RCDCEB: 'aceptación cash',
        RCFCEB: 'aceptación cash',
        RVDCFP: 'confirmacion bono',
        RVDCFM: 'confirmacion bono',
        RCDCFP: 'confirmacion cash',
        IBPURC: 'pago',
        MODDIM: 'digital menu',
        MODGCA: 'modal propuesta gastronómica',
        MOSEATJBR: 'asientos',
        CKIDOC: 'documentacion'
    },
    DATALAYER_USER_STATES: {
        LOGGED: 'logado',
        ANONYMOUS: 'no_logado',
        LOGGED_ONB: 'logado_pyme',
        LOGGED_MAIL: 'logado_mail',
        LOGGED_FF: 'logado_ff',
        LOGGED_IB: 'logado_ib',
        LOGGED_FF_HARD: 'logado_ff_hard',
        LOGGED_FF_SOFT: 'logado_ff_soft',
        LOGGED_IB_HARD: 'logado_ib_hard',
        LOGGED_IB_SOFT: 'logado_ib_soft'
    },
    DATALAYER_USER_LEVELS: {
        KIDS: 2,
        CLASICA: 2,
        PLATA: 4,
        ORO: 1,
        INFINITA: 3,
        INFINITAPRIME: 3,
        PLATINO: 3,
        COLECTIVOS: 'Colectivos',
        COLECTIVO: 'Colectivo',
        PSEUDOAGENCIA: 'PseudoAgencia',
        SERVIWEB: 'Serviweb'
    },
    DATALAYER_PASSENGER_TYPES: {
        INFANT: 'INF',
        CHILD: 'CHD',
        YOUTH: 'YTH',
        MINOR: 'MNR',
        STUDENT: 'STD',
        YOUNG_ADULT: 'YCD',
        ADULT: 'ADT',
        SENIOR: 'SNR'
    },
    DATALAYER_MODAL_ID: {
        BACK_MODAL: 'BACK_MODAL',
        BACK_MAIN_HEADER_MODAL: 'BACK_MAIN_HEADER_MODAL',
        SHOW_ONHOLD_MODAL: 'SHOW_ONHOLD_MODAL',
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
        GIFT_CARDS_BACK: 'GIFT_CARDS_BACK',
        NOT_ACCEPTED_SEGMENT_ERROR: 'NOT_ACCEPTED_SEGMENT_ERROR',
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
        QUADRIGAM_ON_BUSINESS: 'CIP',
        CODE: 'codigoSeguimiento',
        CODE_TRACKING: 'usuarioColectivo',
        WEB_VERSION: 'versionWeb',
        WEB_MODE: 'modeWeb',
        USER_LEVEL: 'NivelUsuario',
        USER_ID: 'userID',
        USER_SEGMENT: 'segmento',
        IS_AIR_SHUTTLE: 'puenteAereo',
        ROUND_TRIP: 'idavuelta',
        ORIGIN_DESTINATIONS: 'trayectoAeropuerto',
        PASSENGER_TYPES: 'tipoPax',
        TOTAL_PASSENGERS: 'numeroPax',
        SEGMENT_OPERATORS: 'operadoraVuelo',
        SEGMENT_DATES: 'fecha',
        DEPARTURE_AIRPORT: 'aeropuertoOrigen',
        ARRIVAL_AIRPORT: 'aeropuertoDestino',
        TOTAL_AVAILABILITY: 'resultadosBusqueda',
        DEPARTURE_TIME: 'horarioSalida',
        ERROR_CODE: 'codigoError',
        INTERNAL_ERROR_CODE: 'subCodigoError',
        ERROR_DESCRIPTION: 'descripcionError',
        MODAL_ID: 'modal',
        INIT_TYPE: 'detalleInicio',
        ANCILLARIES_BOUGHT: 'ancillariesComprados',
        ANCILLARIES_ACTION: 'ancillariesAction',
        ANCILLARIES_SEATS: 'ancillariesAsientos',
        SPEQSINFO : {
            SPEQSTOTALPRICE: 'SpeqsTotalPrice',
            SPEQSTOTAL: 'SpeqsTotal',
            SPEQSBYTYPE: {
                BICYCLE: {
                    SPEQSBICYCLETOTAL: 'SpeqsBicycleTotal',
                    SPEQSBICYCLEPRICE: 'SpeqsBicycleTotalPrice'
                },
                SURFBOARD: {
                    SPEQSSURFBOARDTOTAL: 'SpeqsSurfTotal',
                    SPEQSSURFBOARDPRICE: 'SpeqsSurfTotalPrice'
                },
                SKI_SNOW: {
                    SPEQSSKISNOWTOTAL: 'SpeqsSkiTotal',
                    SPEQSSKISNOWPRICE: 'SpeqsSkiTotalPrice'
                },
                GOLF_EQUIPMENT: {
                    SPEQSGOLFEQUIPMENTTOTAL: 'SpeqsGolfTotal',
                    SPEQSGOLFEQUIPMENTPRICE: 'SpeqsGolfTotalPrice'
                },
                FISHING_EQUIPMENT: {
                    SPEQSFISHINGEQUIPMENTTOTAL: 'SpeqsFishingTotal',
                    SPEQSFISHINGEQUIPMENTPRICE: 'SpeqsFishingTotalPrice'
                },
                SCUBA_DIVING: {
                    SPEQSSCUBADIVINGTOTAL: 'SpeqsScubaTotal',
                    SPEQSSCUBADIVINGPRICE: 'SpeqsScubaTotalPrice'
                }
            },
            SPEQS_HEADER_FORMAT: {
                BICYCLE: 'BICYCLE',
                SURFBOARD: 'SURFBOARD',
                SKISNOW: 'SKI_SNOW',
                GOLFEQUIPMENT: 'GOLF_EQUIPMENT',
                FISHINGEQUIPMENT: 'FISHING_EQUIPMENT',
                SCUBADIVING: 'SCUBA_DIVING'
            }
        },
        BAGGAGESINFO : {
            BAGGAGESTOTALPRICE: 'BaggagesTotalPrice',
            BAGGAGESTOTAL: 'BaggagesTotal',
            BAGGAGESBYTYPE: {
                BAGGAGE15: {
                    BAGGAGES15TOTAL: 'Baggages15Total',
                    BAGGAGES15PRICE: 'Baggages15TotalPrice'
                },
                BAGGAGE23: {
                    BAGGAGES23TOTAL: 'Baggages23Total',
                    BAGGAGES23PRICE: 'Baggages23TotalPrice'
                },
                BAGGAGE32: {
                    BAGGAGES32TOTAL: 'Baggages32Total',
                    BAGGAGES32PRICE: 'Baggages32TotalPrice'
                }
            },
            BAGGAGES_HEADER_FORMAT: {
                BAGGAGE_15: 'BAGGAGE_15',
                BAGGAGE_23: 'BAGGAGE_23',
                BAGGAGE_32: 'BAGGAGE_32'
            }
        },
        SEATSINFO: {
            SEATSTOTALPRICE: 'SeatsTotalPrice',
            SEATSTOTAL: 'SeatsTotal',
            SEATSBYTYPE: {
                STANDARD: {
                    SEATSSTANDARDTOTAL: 'SeatsStandardTotal',
                    SEATSSTANDARDTOTALPRICE: 'SeatsStandardTotalPrice'
                },
                XL: {
                    SEATSXLTOTAL: 'SeatsXLTotal',
                    SEATSXLPRICE: 'SeatsXLTotalPrice'
                },
                PROMO: {
                    SEATSPROMOTOTAL: 'SeatsPromoTotal',
                    SEATSPROMOPRICE: 'SeatsPromoTotalPrice'
                },
                EMERGENCY: {
                    SEATSEMERGENCYTOTAL: 'SeatsEmergencyTotal',
                    SEATSEMERGENCYPRICE: 'SeatsEmergencyTotalPrice'
                },
                UPFRONT: {
                    SEATSEUPFRONTTOTAL: 'SeatsUpfrontTotal',
                    SEATSEUPFRONTPRICE: 'SeatsUpfrontTotalPrice'
                },
                PASSENGER_WITH_INFANT: {
                    SEATSEINFANTTOTAL: 'SeatsInfantTotal',
                    SEATSEINFANTPRICE: 'SeatsInfantPrice'
                },
                RESTRICTED_MOBILITY: {
                    SEATSRESTRICTEDMOBILITYTOTAL: 'SeatsRestrictedMobilityTotal',
                    SEATSRESTRICTEDMOBILITYPRICE: 'SeatsRestrictedMobilityPrice'
                }
            },
            SEATS_HEADER_FORMAT: {
                STANDARD: '',
                UPFRONT: 'UPFRONT',
                EXTRA_SIZE: 'EXTRA_SIZE',
                EMERGENCY: 'EMERGENCY_EXIT',
                PROMO: 'PROMO',
                INFANT: 'PASSENGER_WITH_INFANT',
                RESTRICTED_MOBILITY: 'RESTRICTED_MOBILITY'
            }
        },
        FLEXIBILITY_INFO: {
            FLEXIBILITY_TOTAL_PRICE : 'FlexibilityTotalPrice',
            FLEXIBILTY_TYPE : 'FlexibilityType'
        },
        ANCILLARIES_BAGGAGES: 'ancillariesMaletas',
        ANCILLARIES_SPEQS: 'ancillariesEquipajesEspeciales',
        ANCILLARIES_INSURANCES: 'ancillariesSeguros',
        INSURANCE_POLICY: 'Policy',
        INSURANCE_TYPE: 'InsuranceType',
        INSURANCE_TOTAL_PRICE: 'InsuranceTotalPrice',
        INSURANCE_PROVIDER: 'InsuranceProvider',
        GLOBICK_ACTIVITIES:'GlobickActivities',
        GLOBICK_ACTIVITIES_TOTAL_PRICE: 'GlobickActivitiesTotalPrice',
        GLOBICK_TRANSFER:'GlobickTransfer',
        GLOBICK_TRANSFER_TOTAL_PRICE: 'GlobickTransferTotalPrice',
        BOOKING_CLASS: 'claseReserva',
        UPGRADE_SHOWN: 'upgradingMostrado',
        UPGRADE_SENT: 'upgradingEnviado',
        UPGRADE_TOTAL: 'upgradingImporteMoneda',
        APIS_FULFILLED: 'APIScumplimentados',
        HPBT: 'HPBT',
        DOWNLOAD_FORMAT: 'formatoDescarga',
        VIP_ROOM: 'salaVIP',
        ORDER_KEY: 'claveOrdenacion',
        AVIOS_COINS: 'avios',
        ONE_WAY: 'ida',
        EVENT: 'event',
        EVENT_CATEGORY: 'eventCategory',
        EVENT_ACTION: 'eventAction',
        EVENT_LABEL: 'eventLabel',
        EVENT_FARE_OPTIONS: {
            SEARCH_GENERAL_FARES_ALL_TEXT: 'todas tarifas',
            FARES_FILTER_ECONOMY: 'tarifa mas economica',
            FARES_FILTER_PREMIUM: 'turista premium',
            FARES_FILTER_BUSINESS: 'business class'
        },
        EVENT_INTERESTS_OPTIONS: {
            INTERESTS_FILTER_ALL: 'todos intereses',
            INTERESTS_FILTER_BEACH: 'playa',
            INTERESTS_FILTER_WITHCHILDS: 'familiares',
            INTERESTS_FILTER_CULTURAL: 'cultural',
            INTERESTS_FILTER_ROMANTIC: 'romantica',
            INTERESTS_FILTER_ADVENTURE: 'aventura'
        },
        OUTBOUND_RESULTS: 'resultadosIda',
        INBOUND_RESULTS: 'resultadosVuelta',
        MULTIPLE_TRIP_RESULTS: 'resultadosMultiple',
        TRIP_TYPE: 'tipoVuelo',
        SEARCHED_TRIP: 'trayectoBuscado',
        COUNTRY_TRIP: 'trayectoPais',
        ADVANCE_PURCHASE: 'antelacionCompra',
        DESTINATION_STAY: 'estanciaDestino',
        SEGMENT_HOUR: 'horarioVuelo',
        FARE_NAMES: 'nombreTarifas',
        IB_PLUS_HOLDER: 'titularIberiaPlus',
        CREDITCARD_TYPE: 'tipoTarjeta',
        CURRENCY: 'moneda',
        CHEAPER_FARE: 'tarifaBarata',
        PASSENGER_PRICE: 'precioPax',
        AVIOS_DISCOUNT: 'AVIOSredimidos',
        SEARCH_CITY: 'SearchCity',
        SEARCH_ORIGIN: 'SearchOrigin',
        SEARCH_ORIGIN_NAME: 'SearchOriginName',
        SEARCH_DEST_NAME: 'SearchDestName',
        SEARCH_DEST: 'SearchDest',
        SEARCH_COUNTRY: 'SearchCountry',
        ENTRY_POINT: 'origenBusqueda',
        QUANTITY_ORDER_ITEMS: 'Quantity',
        TOTAL_PRICE: 'precioTotal',
        TOTAL_PRICE_WITHOUT_FEE: 'precioTotalSinTasas',
        TOTAL_PRICE_TAXES: 'precioTasas',
        TOTAL_PRICE_AVIOS: 'aviosUsados',
        TOTAL_PRICE_AVIOS_MONEY: 'precioAviosMoney',
        LARGE_FAMILY: 'familianumerosa',
        RESIDENT: 'residentCode',
        USER_AVIOS: 'userAvios',
        STOPS_NUMBER: 'escalas',
        CABINS: 'cabinas',
        FLIGHTS_NUMBER: 'Identifier',
        VOUCHER: 'voucher',
        PAYMENT_METHOD: 'paymentMethod',
        REDUCED_MOBILITY: 'paxMovilidadReducida',
        NUM_ADDULTS: 'numeroAdultos',
        NUM_CHILDS: 'numeroNinios',
        NUM_INFANTS: 'numeroBebes',
        NUM_SENIOR: 'numeroSeniors',
        NUM_YOUNG: 'numeroJovenes',
        NUM_TENNEAGER: 'numeroAdolescentes',
        HASH_EMAIL: 'hashEID',
        PASSENGER_EMAIL: 'hashEBKI',
        ANCILLARIES_FLEXIBILITY: 'ancillariesFlexibility',
        ANCILLARIES_TOTAL_SEATS: 'totalNumAsientos',
        ANCILLARIES_TOTAL_BAGGAGE: 'totalNumEquipajes',
        ANCILLARIES_TOTAL_SPEQS: 'totalNumEquipajesEspeciales',
        ANCILLARIES_TOTAL_PRICE_SEAT: 'totalCosteAsientos',
        ANCILLARIES_TOTAL_PRICE_BAGGAGE: 'totalCosteEquipaje',
        ANCILLARIES_TOTAL_PRICE_SPEQS: 'totalCosteEquipajeEspeciales',
        ANCILLARIES_INSURANCE_TYPE: 'tipoSeguro',
        ORIGINAL_FLIGHT_DATE: 'fechaOriginal',
        ORIGINAL_DATE_ADVANCE: 'antelaciónCompraOriginal',
        ORIGINAL_DESTINATION_STAY: 'estanciaDestinoOriginal',
        NEW_DATES_RANGE: 'fecha',
        NEW_DESTINATION_STAY: 'estanciaDestino',
        DIFFERENCE_BETWEEN_ORIGINAL_AND_NEW_DATES: 'antelacionCompra',
        SPECIAL_NEEDS: 'paxMovilidadReducida',
        PNR_TYPE: 'tipoPNR',
        FLIGHTS_STATUS: 'estadoVuelos',
        CHANGE_TYPE: 'tipoCambio',
        ISSUE_DATE: 'fechaCompra',
        VOUCHER_DISCOUNT_AMOUNT: 'descuentoBono',
        SPECIAL_MEALS: 'comidaEspecial',
        AVIOS_DISCOUNT_AMOUNT: 'descuentoAvios',
        TOTALTAX: 'precioTotal',
        NOTAX: 'precioTotalSinTasas',
        AIRCRAFT: 'aircraft',
        PROCESS: 'proceso',
        OFFERDEST: 'OfferDest',
        OFFERDESTNAME: 'OfferDestName',
        ORIGINAL_TOTAL_PRICE: 'precioTotalOriginal',
        PERCENT_DISCOUNT: 'porcentajeDescuentos',
        TOTAL_DISCOUNT: 'totalDescuentos',
        DYNAMIC_PRICING: 'DynamicPricing',
        FLASHOFFER: 'flashoffers',
        RESERVE_OFER: 'reservar',
        FLIGHT_RATIO: 'flightRatio',
        DYNAMIC_PRICING_SEAT: 'dynamic_pricing_seat',
        ORDER_ID: 'OrderID',
        OUTBOUND_ROUTE: 'rutaIda',
        RETURN_ROUTE: 'rutaVuelta',
        TYPE_SEARCH: 'tipoBusqueda',
        STEP: 'paso',
        FF_OUTBOUND: 'ffida',
        FF_RETURN: 'ffvuelta',
        OFFERED_CASH_AVIOS: 'cashAviosOfrecido',
        OFFERED_VOUCHER: 'bonoOfrecido',
        USED_CASH_AVIOS: 'cashAviosUsado',
        USED_VOUCHER: 'bonoUsado',
        FLIGHT_HAUL: 'flightHaul'
    },
    PNR_INFO: {
        PROVIDER: 'provider',
        REFERENCE: 'reference'
    },
    DATALAYER_EVENT_TYPES: {
        VIEW: 'view',
        LINK: 'link',
        CLICK: 'click'
    },
    DATALAYER_VALUES: {
        YES: 'SI',
        NO: 'NO',
        WEB_VERSION: 'angularjs',
        WEB_VERSION_CLASSIC: 'clasica',
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
        SEGMENT_OPEN: 'OPEN',
        EXCLUSIVE_PROMOS_EVENT_CATEGORY: 'Promociones exclusivas',
        AVIOS_EVENT_CATEGORY: 'fly with avios',
        PARTNERS_AND_PLANS_EVENT_CATEGORY: 'Partners y Planes',
        LET_ME_KNOW_PAGE: 'pagina aviso',
        NOT_AVAIBILITY_ALERT: 'alerta no disponibilidad vuelos',
        PRINTS: 'impresiones',
        CLICK_ON_MAIL: 'click avisar al email',
        ALERT_EMAIL_OK: 'aviso email confirmado',
        ALERT_EMAIL_ERROR: 'aviso email error',
        ORDER_KEYS: {
            TIME_ASC: 'Horario Ascendente',
            TIME_DESC: 'Horario Descendente',
            DURATION_ASC: 'Duración Ascendente',
            DURATION_DESC: 'Duración Descendente',
            CABINS_AND_PRICE_ASC: 'Cabinas y precios Ascendente',
            CABINS_AND_PRICE_DESC: 'Cabinas y precios Descendente'
        },
        ORDER_EVENT_OUTBOUND: 'ordenarIdaPor',
        ORDER_EVENT_INBOUND: 'ordenarVueltaPor',
        ANCILLARIES_EVENT: 'addAncillaries',
        ONE_WAY_TRIP: 'OW',
        RETURN_TRIP: 'RT',
        MULTIPLE_TRIP: 'MT',
        FARE_FAMILY_STANDARD: 'STANDARD',
        CABIN_FAMILY_STANDARD: 'STANDARD',
        INBOUND: 'vuelta',
        OUTBOUND: 'ida',
        DEPARTURE: 'IDA',
        RETURN: 'VUELTA',
        PASSENGERS_TYPES: {
            ADULT: 'ADT',
            CHILD: 'CHD',
            INFANT: 'INF',
            SENIOR: 'YCD',
            YOUTH: 'YTH',
            YOUNG_ADULT: 'BNN'
        },
        FLEXIBLE: 'flexibilizado',
        NON_FLEXIBLE: 'no_flexibilizado',
        DISRUPTED: 'disruptado',
        PAYMENT_METHODS: {
            VOUCHER: 'fullVoucher',
            CASH_AVIOS: 'cash&Avios',
            CASH_VOUCHER: 'cash&Voucher',
            CASH: 'cash'
        },
        PURCHASE_CATEGORY: {
            DIRECT: 'Compra directa',
            ON_HOLD: 'Reserva On-Hold',
            ON_HOLD_CONFIRMATION: 'Confirmación On-Hold'
        },
        FLIGHT_RATIO_TYPES: {
            LONG: 'Largo Radio',
            MEDIUM: 'Medio Radio',
            SHORT: 'Corto Radio'
        },
        CALENDAR: 'Calendario'
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
        R: 4,
        T: 5
    },
    DATALAYER_ELEMENT_CLICKED: {
        LINK: 'click link',
        BUTTON: 'click button'
    },
    DATALAYER_ECOMMERCE: {
        CURRENCY: 'currency',
        TRANSACTION: 'transaction',
        PRODUCTS: 'products',
        REVENUE: 'revenue',
        SHIPPING: 'shipping',
        TYPE_FLIGHT: 'flight'
    },
    DATALAYER_PREFIX: {
        AGENTS: 'agencias_'
    },
    DATALAYER_LABEL: {
        CONTINUAR: 'continuar'
    },
    DATALAYER_ANCILLARIES: {
        ANCILLARIES: 'ancillaries'
    },
    DATALAYER_FLASH_OFFERS: {
        PROCESS: 'flashOffers'
    },
    FLIGHT_CODE_TYPE: {
        ONE_WAY: 'OW',
        ROUND_TRIP: 'RT',
        MULTI_TRAJECT: 'MT'
    },
    DATALAYER_VOLUNTARYCHANGES: {
        PRICE_PASSANGER: 'precioPax',
        STOPOVER_FLIGHT: 'escalas',
        BOOKING_CLASS: 'claseReserva',
        FLIGHT_TIME: 'horarioVuelo',
        FARE_NAMES: 'nombreTarifas',
        SEGMENT_OPERATORS: 'operadoraVuelo',
        TOTAL_PRICE: 'precioTotal',
        TOTAL_PRICE_WITHOUT_TAX: 'precioTotalSinTasas',
        CHEAP_FARE: 'tarifaBarata',
        IDENTIFIER: 'Identifier',
        CABINES: 'cabinas',
        COIN: 'moneda',
        IBERIAPLUS_HOLDER: 'titularIberiaPlus',
        ORIGIN_DESTINATIONS: 'trayectoAeropuerto',
        SEARCHED_PATH: 'trayectoBuscado',
        COUNTRY_PATH: 'trayectoPais'
    },
    QUADRIGAMS: {
        LANDING_FLASH: 'FLASHO',
        DETAILS_FLASH: 'FLASHD',
        SHUTTLE_HOME: 'PAHOME',
        SHUTTLE_PASSENGERS: 'PAHMPA',
        SHUTTLE_PASSENGERS_CODE: 'PAAIRP',
        SHUTTLE_REDEMPTION_PASSENGERS: 'RPAAIRP',
        SHUTTLE_PAYMENTS: 'PAPURC',
        SHUTTLE_REDEMPTION_PAYMENTS: 'RPAPURC',
        SHUTTLE_CONFIRMATION: 'PABKCF',
        SHUTTLE_REDEMPTION_CONFIRMATION: 'RPABKCF',
        CKI_SESSION_EXPIRED: 'CKIEXP',
        CKI_PAYMENT: 'IBPURC',
        CKIANC: 'CKIANC'
    },
    LANG: 'es',
    MARKET: 'ES',
    DISCOUNT_TYPES: {
        DYNAMIC_PRICING: 'DYNAMIC_PRICING'
    },
    SURE_MODAL: {
        EVENT_CATEGORY: 'Guardado datos',
        EVENT_ACTION: 'clic',
        EVENT_LABEL_SAVE: 'Guardar',
        EVENT_LABEL_DONT_SAVE: 'No guardar'
    },
    SAVE_ACCEPT_LITERALS: {
        EVENT_ACTION: 'confirmacion',
        EVENT_LABEL_OK: 'OK',
        EVENT_LABEL_KO: 'KO'
    },
    FLOWS: {
        SHUTTLE: 'ibshuttle',
        PASSENGERS: 'ibairp',
        ANCILLARIES: 'ibcmtv',
        PAYMENTS: 'ibpurc',
        CONFIRMATION: 'confirmation'
    },
    FLIGHT_RATIO_TYPES: {
        LONG: 'Largo Radio',
        MEDIUM: 'Medio Radio',
        SHORT: 'Corto Radio'
    },
    SHUTTLE_OPEN: 'IBOPEN',
    DATALAYER_FLOW_CKI: {
        PROCESS: 'checkin',
        PROCESS_DUPLICATE: 'checkin duplicados',
        PROCESS_DESINVOICING: 'desfacturacion',
        IBCOSE: 'landing',
        IBCOSEII: 'landing',
        IBCOAC: 'recuperacion',
        IBCOACPA: 'recuperacion PA',
        CKDANG: 'articulos peligrosos',
        CKIANC: 'ancillaries',
        IBCOACII: 'apis',
        IBFNPA: 'vuelo puente aereo',
        IBFNCOPA: 'adelanta o retrasa tu vuelo',
        CKIANCUPP: 'upg',
        IBCKIPURC: 'pago',
        IBCKIPURD: 'pago',
        PAYINF: 'pago',
        CKIBIO: 'biometria',
        IBCOBP: 'tarjeta de embarque',
        IBCOBPD: 'tarjeta de embarque',
        IBCKICF: 'confirmacion',
        IBCKICD: 'confirmacion',
        IBECCF: 'confirmacion',
        IBECCD: 'confirmacion',
        IBCOED: 'recuperacion',
        UNCOAC: 'recuperacion',
        UNCOSE: 'inicio',
        UNCONF: 'confirmacion',
        CKIEXP: 'sesion expirada',
        CKIDOC: 'documentacion',
        CKIACPT: 'resumen'
    },
    DATALAYER_VIEWS: {
        DISPO: 'disponibilidad',
        DISPO_CALENDAR: 'calendarioDisponibilidad',
        FARE: 'tarifa',
        PASSENGERS: 'pasajeros',
        ANCILLARIES: 'ancillaries',
        PAYMENTS: 'pago',
        CONFIRMATION: 'confirmación',
        ONHOLD_PAYMENT: 'pago onhold',
        ONHOLD_CONFIRMATION: 'confirmacion onhold',
        ALP: 'coche_hotel'
    },
    EVENTS_ECOMMERCE: {
        VIEW_ITEM_LIST: 'view_item_list',
        SELECT_ITEM: 'select_item',
        ADD_TO_CART: 'add_to_cart',
        BEGIN_CHECKOUT: 'begin_checkout',
        ADD_SHIPPING_INFO: 'add_shipping_info',
        REMOVE_FROM_CART: 'remove_from_cart'
    },
    DIGITAL_DATA_INFO:  {
        LANGUAGE: 'Language',
        MARKET: 'Market',
        USER_STATE: 'UserStatus',
        USER_LEVEL: 'UserLevel',
        USER_ID: 'UserID',
        ClientID: 'ClientID',
        USER_SEGMENT: 'UserSegment',
        CODE_TRACKING: 'UserCUG',
        AVIOS_COINS: 'Avios',
        USER_AVIOS: 'UserAvios',
        TOTAL_PRICE_AVIOS: 'AviosUsed',
        HASH_EMAIL: 'HashEID',
        PASSENGER_EMAIL: 'HashEBKI',
        DEEPLINK: 'Deeplink',
        PROCESS: 'Process',
        STEP: 'Step',
        QUADRIGAM: 'Quadrigam',
        CODE: 'TrackingCode',
        CURRENCY: 'Currency',
        WEB_VERSION: 'VersionWeb',
        WEB_MODE: 'ModeWeb',
        REFERENCE: 'Reference',
        VOUCHER_AMOUNT: 'VoucherAmount',
        PRODUCT: 'Product',
        ORDER_ID: 'OrderID',
        PAYMENT_METHOD: 'PaymentMethod',
        VOUCHER_CODE: 'VoucherCode',
        ORIGIN_DESTINATIONS: 'AirportSeg',
        UPG_TYPE: 'UpgType',
        BOOKING_CLASS: 'BookingClass',
        EVENT_CATEGORY: 'eventCategory',
        EVENT_ACTION: 'eventAction',
        EVENT_LABEL: 'eventLabel',
        EVENT_NAME: 'eventName',
        EVENT_NAME_INTERACTION: 'interaction',
        CASH_AVIOS_USED: 'CashAviosUsed',
        VOUCHER_USED: 'VoucherUsed',
        VOUCHER_SHOWN: 'VoucherShown',
        INSURANCE_TYPE: 'InsuranceType',
        QUANTITY: 'Quantity',
        ROL_CIP: 'RolCIP',
        DOWNLOAD_FORMAT: 'DownloadFormat',
        BP_TYPE: 'BPType',
        CHECKIN_BY: 'CheckinBy',
        APIS_COMPLETED: 'ApisCompleted',
        FLIGHT_HAUL: 'FlightHaul'
    },
    ALLIANZ_FUSION_CODES: {
        ASISTANCE_INSURANCE: 'IBAESASSST',
        CANCEL_INSURANCE: 'IBAESCAN',
        TOTAL_INSURANCE: 'IBAESCOMPST'
    },
    APIS: {
        TM_VISA_REQUIRED: {
            eventCategory: 'formulario de apis',
            eventAction: 'falta visado',
            eventLabel: 'timatic',
            eventName: 'interaccion'
        },
        TM_RETURN_TICKET_REQUIRED: {
            eventCategory: 'formulario de apis',
            eventAction: 'falta billete de vuelta',
            eventLabel: 'timatic',
            eventName: 'interaccion'
        },
        COMPLETED: {
            eventCategory: 'formulario de apis',
            eventAction: 'formulario completado',
            eventLabel: 'acceso a ocr',
            eventName: 'interaccion'
        }
    },
    TRAVEL_DOCUMENTS: {
        ONLY_CLICK_BTN_CONTINUE: {
            eventLabel: 'continuar',
            eventCategory: 'documentacion apis',
            eventAction: 'clic',
            eventName: 'interaccion'
        },
        SELECTED_NOT_USE_DOCUMENTS: {
            eventLabel: 'no usar doc guardado',
            eventCategory: 'documentacion apis',
            eventAction: 'clic',
            eventName: 'interaccion'
        },
        SELECTED_SOME_DOCUMENTS: {
            eventLabel: 'doc guardado',
            eventCategory: 'documentacion apis',
            eventAction: 'clic',
            eventName: 'interaccion'
        },
        USE_SAVED_DOCUMENTS: {
            eventLabel: 'utilizar docs guardados',
            eventCategory: 'documentacion apis',
            eventAction: 'clic',
            eventName: 'interaccion'
        }
    },
    SEAT_SUMMARY: {
        AUDIENCE_STATE: {
            eventAction: 'T1380-Pagina de resumen asientos CKI',
            eventCategory: 'MNTTGF2GA4',
            eventLabel: 'Audiencia KO',
            eventName: 'MNTTGF2GA4'
        },
        CHANGE_SEATS: {
            eventAction: 'clic',
            eventCategory: 'resumen checkin',
            eventName: 'interaccion',
            eventLabel: 'modificar asientos'
        },
        ADD_EXTRAS: {
            eventAction: 'clic',
            eventCategory: 'resumen checkin',
            eventName: 'interaccion',
            eventLabel: 'añadir mas extras'
        }
    }
    

};
export interface SeatTypeMapEntry {
    format: string;
    totalKey: string;
    priceKey: string;
    matchEmpty?: boolean;
}

export const SEAT_TYPE_MAP: SeatTypeMapEntry[] = [
    {
        format: 'UPFRONT',
        totalKey: 'SeatsUpfrontTotal',
        priceKey: 'SeatsUpfrontTotalPrice'
    },
    {
        format: 'EXTRA_SIZE',
        totalKey: 'SeatsXLTotal',
        priceKey: 'SeatsXLTotalPrice'
    },
    {
        format: 'EMERGENCY_EXIT',
        totalKey: 'SeatsEmergencyTotal',
        priceKey: 'SeatsEmergencyTotalPrice'
    },
    {
        format: 'PROMO',
        totalKey: 'SeatsPromoTotal',
        priceKey: 'SeatsPromoTotalPrice'
    },
    {
        format: 'PASSENGER_WITH_INFANT',
        totalKey: 'SeatsInfantTotal',
        priceKey: 'SeatsInfantPrice'
    },
    {
        format: 'RESTRICTED_MOBILITY',
        totalKey: 'SeatsRestrictedMobilityTotal',
        priceKey: 'SeatsRestrictedMobilityPrice'
    },
    {
        format: '',
        totalKey: 'SeatsStandardTotal',
        priceKey: 'SeatsStandardTotalPrice',
        matchEmpty: true
    }
];

try {
    const mod = angular.module('ib-datalayer-cki-module');

    mod.constant(
        'CkiDatalayerConstants', CkiDatalayerConstants
    );
} catch (error) {
    const mod = angular.module('ib-datalayer-cki-module', []);
    mod.constant(
        'CkiDatalayerConstants', CkiDatalayerConstants
    );
}
export type CkiDatalayerConstantsType = typeof CkiDatalayerConstants;
export { CkiDatalayerConstants };
