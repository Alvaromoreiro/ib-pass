'use strict';
describe('test for MonetateTransformer', function() {
    var MonetateTransformer, localStorageService;

    var fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'setPageType',
            CUSTOMVARS: 'setCustomVariables',
            TRACKDATA: 'trackData'
        },
        PREFIX:{
            DATALAYER_GENERAL: 'dt_g_',
            DATALAYER_ECOMMERCE: 'dt_e_',
            DIGITAL_DATA: 'dd_'
        },
        FUNCTIONS: {
            ADDCARTROWS: 'addCartRows',
            ADDPURCHASEROWS: 'addPurchaseRows',
            ADDPRODUCTDETAILS: 'addProductDetails'
        },
        TRACK_PLACE: {
            CART: 'cart',
            PURCHASE: 'purchase'
        },
        CATALOG_PRODUCTS_ID: {
            ANCILLARIES: {
                SEAT: {
                    DELANTERO: 'ASIENTO-DELANTERO',
                    SALIDA_EMERGENCIA: 'ASIENTO-SALIDAEMERG',
                    XL: 'ASIENTO-XL',
                    NORMAL: 'ASIENTO-NORMAL',
                    BEBE: 'ASIENTO-CONBEBE',
                    MOVILIDAD_REDUCIDA: 'ASIENTO-MOVREDUCIDA',
                    PROMO: 'ASIENTO-PROMO'
                },
                BAGGAGE: {
                    EQUIPAJE_EXTRA: 'MALETAS-EQUIPAJEEXTRA',
                    EQUIPAJE_EXTRA_15: 'MALETAS-EQUIPAJEEXTRA-15',
                    EQUIPAJE_EXTRA_23: 'MALETAS-EQUIPAJEEXTRA-23',
                    EQUIPAJE_EXTRA_32: 'MALETAS-EQUIPAJEEXTRA-32',
                    EQUIPAJE_ESPECIAL: 'MALETAS-EQUIPAJEESPECIAL',
                    EQUIPAJE_ESPECIAL_BIKE: 'MALETAS-EQUIPAJEESPECIAL-BIKE',
                    EQUIPAJE_ESPECIAL_SKIS: 'MALETAS-EQUIPAJEESPECIAL-SKIS',
                    EQUIPAJE_ESPECIAL_GOLF: 'MALETAS-EQUIPAJEESPECIAL-GOLF'
                },
                INSURANCE: {
                    SEGURO_ANULACION: 'SEGURO-ANULACION',
                    SEGURO_ASISTENCIA: 'SEGURO-ASISTENCIA'
                },
                FLEXIBILIZATION: {
                    CAMBIO: 'FLEXIBILIDAD-CAMBIO',
                    REEMBOLSO: 'FLEXIBILIDAD-REEMBOLSO',
                    PACK: 'FLEXIBILIDAD-PACK'
                },
                PRIORIDAD: 'PRIORIDAD'

            },
            FLIGHT_PASSENGERS: {
                MENOR: 'V-MENOR',
                BEBE: 'V-INFANT',
                RESIDENTE_BALEARES: 'V-RES-BALE',
                RESIDENTE_CANARIAS: 'V-RES-CANA',
                FAM_NUMEROSA_GENERAL: 'V-FAMNUM-GRAL',
                FAM_NUMEROSA_ESPECIAL: 'V-FAMNUM-ESP'
            },
            CABIN_TYPE: {
                TURISTA: 'V-CABINA-TURISTA',
                PREMIUM: 'V-CABINA-PREMIUM',
                BUSINESS: 'V-CABINA-BUSINESS'
            },
            FLIGHT_FARE: {
                GENERICAS: {
                    MAS_ECONOMICA: 'V-TARIF-ECONOMICA',
                    FLEXIBLES: 'V-TARIF-FLEXIBLES',
                    CABINAS_PREMIUM: 'V-TARIF-CABINASPREMIUM'
                },
                TURISTA: {
                    BASICA: 'V-TARIF-TURIST-BASICA',
                    BASICA_PLUS: 'V-TARIF-TURIST-BASICAPLUS',
                    OPTIMA: 'V-TARIF-TURIST-OPTIMA',
                    OPTIMA_FLEX: 'V-TARIF-TURIST-OPTIMAFLEX',
                    CONFORT: 'V-TARIF-TURIST-CONFORT',
                    FLEXIBLE: 'V-TARIF-TURIST-FLEXIBLE'

                },
                PREMIUM: {
                    FLEX: 'V-TARIF-PREMIUM-FLEX',
                    OPTIMA_FLEX: 'V-TARIF-PREMIUM-OPTIMAFLEX',
                    PROMO: 'V-TARIF-PREMIUM-PROM',
                    OPTIMA: 'V-TARIF-PREMIUM-OPTIMA',
                    PROM_FLEX: 'V-TARIF-PREMIUM-PROMFLEX'

                },
                BUSINESS: {
                    FLEX: 'V-TARIF-BUSINESS-FLEX',
                    OPTIMA_FLEX: 'V-TARIF-BUSINESS-OPTIMAFLEX',
                    PROMO: 'V-TARIF-BUSINESS-PROM',
                    PROM_FLEX: 'V-TARIF-BUSINESS-PROMFLEX',
                    OPTIMA: 'V-TARIF-BUSINESS-OPTIMA'
                }
            },
            FLIGHT_DESTINATION: {
                ESPANA: 'VD-ESPANA',
                EUROPA: 'VD-EUROPA',
                LATAM: 'VD-LATAM',
                AMERICANORTE: 'VD-AMERICANORTE',
                ASIA: 'VD-ASIA',
                AFRICA: 'VD-AFRICA'
            },
            TRIP_TYPE: {
                VACACIONES_FIN_DE_SEMANA: 'V-VAC-FINDESEMANA',
                VACACIONES_INVIERNO: 'V-VAC-INVIERNO',
                VACACIONES_VERANO: 'V-VAC-VERANO',
                VACACIONES_NEGOCIO: 'V-NEGOCIOS'
            }
        },
        CONTINENTS_AND_COUNTRIES: {
            AMERICA: 'América',
            US: 'US',
            CANADA: 'CA',
            LATAM: 'LATAM'
        },
        DEFAULT_VALUES: {
            ZERO: '0',
            ONE: '1'
        },
        CABIN_DESCRIPTION:{
            ECONOMY: 'Economy',
            PREMIUM_ECONOMY: 'Premium Economy',
            BUSINESS: 'Business'
        }
    };

    var fakeMmBAppConstants = {
        passengerTypes: {
            Default: 'DEFAULT',
            senior: 'SENIOR',
            adult: 'ADULT',
            young: 'YOUTH',
            child: 'CHILD',
            infant: 'INFANT',
            SPECIAL_NEEDS: 'specialNeed'
        },
        APP_TYPES: {
            BOOKING: 'BBKI',
            MANAGEMYBOOKING: 'MMB',
            MANAGEMYBOOKING_ONHOLD: 'MMBOH',
            MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
            MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC',
            MANAGEMYBOOKING_BIDS: 'MMBBID',
            ONHOLD: 'BBKIOH',
            CHECKIN: 'CKI',
            SHUTTLE_OPEN: 'PAOB',
            SHUTTLE_OPEN_ONB: 'PAOBONB',
            SHUTTLE_REDEMPTION: 'PARE',
            SHUTTLE_REDEMPTION_ONB: 'PAREONB',
            GIFTCARDS: 'GIFTCARDS',
            SUBSCRIPTIONMODELS: 'SUBSCRIPTIONMODELS'
        },
        DISCOUNT_SEARCH_RESIDENT: {
            type: 'HEADER_ADVANCED_SEARCH_RESIDENT',
            name: 'resident',
            subname: 'largeFamilyType',
            items: [
                {
                    description: 'HEADER_ADVANCED_SEARCH_NO_RESIDENT',
                    value: ''
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                    value: 'RC'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CANARIAS',
                    value: 'DC'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                    value: 'BP'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_BALEARES',
                    value: 'BI'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_MELILLA',
                    value: 'RM'
                },
                {
                    description: 'HEADER_ADVANCED_SEARCH_RESIDENT_CEUTA',
                    value: 'RE'
                }
            ]
        },
    };

    var $filterFake = jasmine.createSpy('$filter').and.callFake((filter) => {
        var filterFunc = () => {
            return ('');
        };
        switch (filter) {
            case 'translate':
                filterFunc = () => {
                    return 'Translated Text';
                };
                break;
            case 'LinksFilter':
                filterFunc = () => {
                    return 'Linked Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var fakeShoppingBasketAncillaries = {
        "baggages": {
          "segments": [
            {
              "segmentId": "MADLHR20231130065000",
              "baggages": [
                {
                  "type": "BAGGAGE_15",
                  "quanty": 1,
                  "description": "15Kg",
                  "passengers": [
                    "ADULT_01"
                  ],
                  "total": 23,
                  "totalFormatted": "23,00€"
                }
              ],
              "total": 23,
              "origin": {
                "code": "MAD",
                "description": "Madrid",
                "countryCode": "ES",
                "country": {
                  "code": "ES",
                  "description": "España"
                }
              },
              "destination": {
                "code": "LON",
                "description": "Londres",
                "countryCode": "GB",
                "country": {
                  "code": "GB",
                  "description": "Reino Unido"
                }
              }
            }
          ],
          "hasBaggage": true,
          "total": {
            "total": 23,
            "totalFormatted": "23,00€"
          }
        },
        "bundle": {
          "info": [],
          "hasBundle": false
        },
        "seats": {
          "segments": [{
            "segmentId": "OB34394329324",
            "seats": [{
                "type": "BACK",
                "description": "BACK",
                "quanty": 1,
                "passengers": {
                    "id": "ID1",
                    "amount": 50
                },
                "amount": 50,
                "totalFormatted": "50,00€"
            }],
            "origin": {
                "description": "MADRID",
                "code": "MAD"
            },
            "destination": {
                "description": "LONDRES",
                "code": "LON"
            },
            "total": 100,
            "totalFormatted": "100,00€",
            }],
          "hasSeats": true
        },
        "insurance": {
          "info": {
            "offer": "IBAESONA05MMBEUT",
            "passengers": 1,
            "type": "Seguro de Asistencia y Teleconsulta"
          },
          "hasInsurance": true,
          "total": {
            "total": 12.24,
            "totalFormatted": "12,24€"
          }
        },
        "upgrading": {
          "segments": [],
          "hasUpgrading": false
        },
        "speqs": {
          "segments": [
            {
              "segmentId": "MADLHR20231130065000",
              "speqs": [
                {
                  "type": "BICYCLE",
                  "quanty": 1,
                  "description": "Bicicletas",
                  "passengers": [
                    "ADULT_01"
                  ],
                  "total": 50,
                  "totalFormatted": "50,00€"
                }
              ],
              "total": 50,
              "origin": {
                "code": "MAD",
                "description": "Madrid",
                "countryCode": "ES",
                "country": {
                  "code": "ES",
                  "description": "España"
                }
              },
              "destination": {
                "code": "LON",
                "description": "Londres",
                "countryCode": "GB",
                "country": {
                  "code": "GB",
                  "description": "Reino Unido"
                }
              }
            }
          ],
          "hasSpeqs": true,
          "total": {
            "total": 50,
            "totalFormatted": "50,00€"
          }
        },
        "priority": {
            "segments": [{
                "sliceId": "OSD213123",
                "quanty": 1,
                "amount": 30,
                "totalFormatted": "30,00€",
                "origin": {
                    "code": "MAD",
                    "description": "Madrid"
                },
                "destination": {
                    "code": "LON",
                    "description": "Londres"
                }
            }],
          "hasPriorityBoarding": true
        },
        "carbonFootprint": {
          "info": null,
          "hasCarbonFootprint": false
        },
        "globickTransfers": {
          "info": null,
          "hasTransfersGlobick": false
        },
        "discountsModel": {
          "hasDiscounts": false,
          "total": 0,
          "discounts": {}
        },
        "othersModel": {
          "hasElements": false,
          "others": [],
          "total": {
            "total": 0,
            "totalFormatted": "0€"
          }
        },
        "segmentsInfo": [],
        "showBasket": true,
        "currency": {
          "suffixSymbol": true,
          "decimalSeparator": ",",
          "numberDecimals": 2,
          "groupingSeparator": ".",
          "currencySymbol": "€",
          "description": "Euro"
        },
        "total": {
          "formatted": "85,24€",
          "totalPrice": 0,
          "original": 85.24000000000001
        }
    };

    var fakeConfirmation = {
        pnr: 'ASD23',
        price: {
            totalPrice: 50
        }
    };

    var fakeAvailability = {
        fareFamilyConditions: [{
            "cabinType": "E",
            "cabinDescription": "Economy",
            "commercialCode": "TFLESEU",
            "commercialName": "Flexible",
            "commercialNameES": "Flexible",
            "priority": 0,
            "conditions": [
              {
                "code": "EQMANO",
                "name": "Hand baggage",
                "text": "1 item max. 10 kg (56x40x25cm) included.",
                "units": 1,
                "extendedInfo": {
                  "title": "Hand luggage: 1 item",
                  "message": "1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator.",
                  "code": "CA_EQP_MANO_10KG",
                  "conditionStatus": true
                }
              },
              {
                "code": "EQBODEGA",
                "name": "Baggage in hold",
                "text": "1 item max. 23 kg and 158 cm included.",
                "units": 1,
                "extendedInfo": {
                  "title": "Checked baggage: 1 item",
                  "message": "1 item max. 23 kg and 158 cm included.",
                  "code": "CA_1_PIEZAS",
                  "conditionStatus": true
                }
              },
              {
                "code": "COMIDA",
                "name": "Meal",
                "text": "With a fee.",
                "units": null,
                "extendedInfo": {
                  "title": "Meal not included",
                  "message": "With a fee.",
                  "code": "Comida_no_incluida",
                  "conditionStatus": false
                }
              },
              {
                "code": "ASIENTO",
                "name": "Seat  selection",
                "text": "Included.",
                "units": null,
                "extendedInfo": {
                  "title": "Seat selection included",
                  "message": "Included.",
                  "code": "CA_Asiento_Gratuito_No_Destacado",
                  "conditionStatus": false
                }
              },
              {
                "code": "CAMBIO",
                "name": "Change",
                "text": "Allowed at any time.",
                "units": null,
                "extendedInfo": {
                  "title": "Flight change allowed",
                  "message": "Allowed at any time.",
                  "code": "CA_CAMBIO SIEMPRE",
                  "conditionStatus": true
                }
              },
              {
                "code": "REEMBOLSO",
                "name": "Refund (in each direction)",
                "text": "Allowed without a fee. Not allowed for no-shows.",
                "units": null,
                "extendedInfo": {
                  "title": "Refund allowed without a fee, with some exceptions",
                  "message": "Allowed without a fee. Not allowed for no-shows.",
                  "code": "CA_REEMBOLSO SIEMPRE_NO_SHOW_NO PERMITIDO",
                  "conditionStatus": true
                }
              },
              {
                "code": "EMBARQUE",
                "name": "Fast Boarding.",
                "text": "Not included.",
                "units": null,
                "extendedInfo": {
                  "title": "Priority boarding not included",
                  "message": "Not included.",
                  "code": "CA_Embarque_NO_Prioritario",
                  "conditionStatus": false
                }
              },
              {
                "code": "ASIENTOXL",
                "name": "Extra legroom seat",
                "text": "With a fee.",
                "units": null,
                "extendedInfo": {
                  "title": "Extra legroom seat with a fee",
                  "message": "With a fee.",
                  "code": "CA_Asiento_XL_Pago",
                  "conditionStatus": false
                }
              },
              {
                "code": "AVIO",
                "name": "AVIOS",
                "text": "Included.",
                "units": null,
                "extendedInfo": {
                  "title": "Avios awarded with purchase",
                  "message": "Included.",
                  "code": "AVIOS incluido",
                  "conditionStatus": false
                }
              },
              {
                "code": "ASIENTODELANTERO",
                "name": "Front seat",
                "text": "Included.",
                "units": null,
                "extendedInfo": {
                  "title": "Front seat included",
                  "message": "Included. (On flights operated by the Iberia, Iberia Express and Air Nostrum).",
                  "code": "CA_Asiento_Delantero_Incluido",
                  "conditionStatus": true
                }
              },
              {
                "code": "SALAVIP",
                "name": "Access to VIP lounges",
                "text": "Access not included.",
                "units": null,
                "extendedInfo": {
                  "title": "Access to VIP Lounge not included",
                  "message": "Access not included.",
                  "code": "Acceso a salas VIP No permitido",
                  "conditionStatus": false
                }
              },
              {
                "code": "CABINA",
                "name": "Cabin",
                "text": "Economy.",
                "units": null,
                "extendedInfo": {
                  "title": "Economy Cabin",
                  "message": "Economy.",
                  "code": "CA_Cabina_Turista",
                  "conditionStatus": false
                }
              },
              {
                "code": "WIFI",
                "name": "WiFi",
                "text": "Available with a fee, depending on aircraft type.",
                "units": null,
                "extendedInfo": {
                  "title": "Wi-Fi with a fee",
                  "message": "Available with a fee, depending on aircraft type.",
                  "code": "Wifi pago",
                  "conditionStatus": false
                }
              },
              {
                "code": "CHECKINDESK",
                "name": "Exclusive check-in counter",
                "text": "Not included.",
                "units": null,
                "extendedInfo": {
                  "title": "Exclusive check-in desk not included",
                  "message": "Not included.",
                  "code": "Chek-in_desk_ NO",
                  "conditionStatus": false
                }
              },
              {
                "code": "ASIENTOPREFERENTE",
                "name": "Preferred seat",
                "text": "Not applicable.",
                "units": null,
                "extendedInfo": {
                  "title": "Preferred seat not applicable",
                  "message": "Not applicable.",
                  "code": "CA_Asiento_Preferente_NO_aplica",
                  "conditionStatus": false
                }
              },
              {
                "code": "FASTTRACK",
                "name": "Fast Track",
                "text": "Not included.",
                "units": null,
                "extendedInfo": {
                  "title": "Fast Track not included",
                  "message": "Not included.",
                  "code": "Fast Track NO",
                  "conditionStatus": false
                }
              },
              {
                "code": "EQPPRIOR",
                "name": "Priority baggage delivery",
                "text": "With a fee.",
                "units": null,
                "extendedInfo": {
                  "title": "Fast bag drop not included",
                  "message": "With a fee.",
                  "code": "Entrega_prioritaria_equipaje_ NO",
                  "conditionStatus": false
                }
              }
            ],
            "conditionsPriority": [
              "EQMANO",
              "EQBODEGA",
              "COMIDA",
              "ASIENTO",
              "CAMBIO",
              "REEMBOLSO"
            ]
        }]
    };

    var fakeFareFamilyConditions = [{
        "cabinType": "E",
        "cabinDescription": "Economy",
        "commercialCode": "TFLESEU",
        "commercialName": "Flexible",
        "commercialNameES": "Flexible",
        "priority": 0,
        "conditions": [
          {
            "code": "EQMANO",
            "name": "Hand baggage",
            "text": "1 item max. 10 kg (56x40x25cm) included.",
            "units": 1,
            "extendedInfo": {
              "title": "Hand luggage: 1 item",
              "message": "1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator.",
              "code": "CA_EQP_MANO_10KG",
              "conditionStatus": true
            }
          },
          {
            "code": "EQBODEGA",
            "name": "Baggage in hold",
            "text": "1 item max. 23 kg and 158 cm included.",
            "units": 1,
            "extendedInfo": {
              "title": "Checked baggage: 1 item",
              "message": "1 item max. 23 kg and 158 cm included.",
              "code": "CA_1_PIEZAS",
              "conditionStatus": true
            }
          },
          {
            "code": "COMIDA",
            "name": "Meal",
            "text": "With a fee.",
            "units": null,
            "extendedInfo": {
              "title": "Meal not included",
              "message": "With a fee.",
              "code": "Comida_no_incluida",
              "conditionStatus": false
            }
          },
          {
            "code": "ASIENTO",
            "name": "Seat  selection",
            "text": "Included.",
            "units": null,
            "extendedInfo": {
              "title": "Seat selection included",
              "message": "Included.",
              "code": "CA_Asiento_Gratuito_No_Destacado",
              "conditionStatus": false
            }
          },
          {
            "code": "CAMBIO",
            "name": "Change",
            "text": "Allowed at any time.",
            "units": null,
            "extendedInfo": {
              "title": "Flight change allowed",
              "message": "Allowed at any time.",
              "code": "CA_CAMBIO SIEMPRE",
              "conditionStatus": true
            }
          },
          {
            "code": "REEMBOLSO",
            "name": "Refund (in each direction)",
            "text": "Allowed without a fee. Not allowed for no-shows.",
            "units": null,
            "extendedInfo": {
              "title": "Refund allowed without a fee, with some exceptions",
              "message": "Allowed without a fee. Not allowed for no-shows.",
              "code": "CA_REEMBOLSO SIEMPRE_NO_SHOW_NO PERMITIDO",
              "conditionStatus": true
            }
          },
          {
            "code": "EMBARQUE",
            "name": "Fast Boarding.",
            "text": "Not included.",
            "units": null,
            "extendedInfo": {
              "title": "Priority boarding not included",
              "message": "Not included.",
              "code": "CA_Embarque_NO_Prioritario",
              "conditionStatus": false
            }
          },
          {
            "code": "ASIENTOXL",
            "name": "Extra legroom seat",
            "text": "With a fee.",
            "units": null,
            "extendedInfo": {
              "title": "Extra legroom seat with a fee",
              "message": "With a fee.",
              "code": "CA_Asiento_XL_Pago",
              "conditionStatus": false
            }
          },
          {
            "code": "AVIO",
            "name": "AVIOS",
            "text": "Included.",
            "units": null,
            "extendedInfo": {
              "title": "Avios awarded with purchase",
              "message": "Included.",
              "code": "AVIOS incluido",
              "conditionStatus": false
            }
          },
          {
            "code": "ASIENTODELANTERO",
            "name": "Front seat",
            "text": "Included.",
            "units": null,
            "extendedInfo": {
              "title": "Front seat included",
              "message": "Included. (On flights operated by the Iberia, Iberia Express and Air Nostrum).",
              "code": "CA_Asiento_Delantero_Incluido",
              "conditionStatus": true
            }
          },
          {
            "code": "SALAVIP",
            "name": "Access to VIP lounges",
            "text": "Access not included.",
            "units": null,
            "extendedInfo": {
              "title": "Access to VIP Lounge not included",
              "message": "Access not included.",
              "code": "Acceso a salas VIP No permitido",
              "conditionStatus": false
            }
          },
          {
            "code": "CABINA",
            "name": "Cabin",
            "text": "Economy.",
            "units": null,
            "extendedInfo": {
              "title": "Economy Cabin",
              "message": "Economy.",
              "code": "CA_Cabina_Turista",
              "conditionStatus": false
            }
          },
          {
            "code": "WIFI",
            "name": "WiFi",
            "text": "Available with a fee, depending on aircraft type.",
            "units": null,
            "extendedInfo": {
              "title": "Wi-Fi with a fee",
              "message": "Available with a fee, depending on aircraft type.",
              "code": "Wifi pago",
              "conditionStatus": false
            }
          },
          {
            "code": "CHECKINDESK",
            "name": "Exclusive check-in counter",
            "text": "Not included.",
            "units": null,
            "extendedInfo": {
              "title": "Exclusive check-in desk not included",
              "message": "Not included.",
              "code": "Chek-in_desk_ NO",
              "conditionStatus": false
            }
          },
          {
            "code": "ASIENTOPREFERENTE",
            "name": "Preferred seat",
            "text": "Not applicable.",
            "units": null,
            "extendedInfo": {
              "title": "Preferred seat not applicable",
              "message": "Not applicable.",
              "code": "CA_Asiento_Preferente_NO_aplica",
              "conditionStatus": false
            }
          },
          {
            "code": "FASTTRACK",
            "name": "Fast Track",
            "text": "Not included.",
            "units": null,
            "extendedInfo": {
              "title": "Fast Track not included",
              "message": "Not included.",
              "code": "Fast Track NO",
              "conditionStatus": false
            }
          },
          {
            "code": "EQPPRIOR",
            "name": "Priority baggage delivery",
            "text": "With a fee.",
            "units": null,
            "extendedInfo": {
              "title": "Fast bag drop not included",
              "message": "With a fee.",
              "code": "Entrega_prioritaria_equipaje_ NO",
              "conditionStatus": false
            }
          }
        ],
        "conditionsPriority": [
          "EQMANO",
          "EQBODEGA",
          "COMIDA",
          "ASIENTO",
          "CAMBIO",
          "REEMBOLSO"
        ]
    }];

    var fakeFlightPassengersInfo = {
        modeWeb: 'test',
        searchOrigin: 'MAD',
        tripType: 2,
        senior: 'SENIOR',
        adult: 1,
        young: 'YOUNG',
        teenager: 'TEENAGER',
        child: 'CHILD',
        infant: 'INFANT',
        resident: 'resident',
        largeFamilyType: null,
        flexDates: false,
        preferredCabin: null,
        payWithAvios: null,
        payWithPoints: null,
        ibGroup: null,
        referralId: null,
        displayedPrice: null,
        slices: [],
        userCurrency: 'EUR',
        priceCurrency: '100',
        numTrips: 0,
        originDestinations: [{
            origin: 'MADRID',
            destination: 'LONDON',
            date: '10-10-2023'
        }],
        bookingCode1: null,
        backToUrl: null,
        codeTracking: null,
        travelAgent: null,
        fromMarket: 'es',
        fromLanguage: 'es'
    };

    var fakeDestinationAreasCitiesList = [
        {
            code: 'MAD',
            description: 'América',
            cities: [{
                code: 'MAD',
                description: 'MADRID',
                country: {
                    code: 'ES',
                    description: 'SPAIN'
                }
            }]
        }
    ];

    var fakeDestinationCountryCollection = [
        {
            origin: 'LON',
            destination: 'MAD',
            date: '10-10-2023'
        },
        {
            origin: 'LON',
            destination: 'MAD',
            date: '10-11-2023'
        }
    ];

    var fakeDestinationCountryCollectionVerano = [
        {
            origin: 'LON',
            destination: 'MAD',
            date: '10-07-2023'
        },
        {
            origin: 'LON',
            destination: 'MAD',
            date: '10-08-2023'
        }
    ];

    var fakeDestinationCountryCollectionInvierno = [
        {
            origin: 'LON',
            destination: 'MAD',
            date: '10-01-2023'
        },
        {
            origin: 'LON',
            destination: 'MAD',
            date: '10-02-2023'
        }
    ];

    var fakeAddedCartProducts = [{
        id: 0,
        productId: 'id0',
        quantity: '50',
        unitPrice: '34',
        sku: '0',
        currency: 'EUR',
        isAncillary: true
    }];

    var fakeOriginDestinations = {
        originDestinations: [
            {
                origin: 'LON',
                destination: 'MAD',
                date: '10-01-2023'
            },
            {
                origin: 'LON',
                destination: 'MAD',
                date: '10-02-2023'
            }
        ]
    };

    var fakePassengers = {
        passengers: 6,
        numAdults: 1,
        numYoung: 2,
        numTeenager: 3,
        numChilds: 3,
        numInfant: 2,
        numSeniors: 1,
        numberPassengrsWithoutInfant: 0
    };

    var fakeSlices = [
        [
            { arrival: { code : "LHR" } , departure: { code: "MAD" } },
            { arrival: { code : "MAD" } , departure: { code: "LHR" } }
        ],
        [
            { arrival: { code : "LHR" } , departure: { code: "MAD" } },
            { arrival: { code : "MAD" } , departure: { code: "LHR" } }
        ]
    ];

    var fakeCurrency = {
        price: {
            currency: 'EUR'
        }
    };

    beforeEach(function() {
        angular.mock.module('ib-monetate-module', 'LocalStorageModule', function($provide){
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('$filter', $filterFake);
        });

        inject(function(_MonetateTransformer_, _localStorageService_) {
            MonetateTransformer = _MonetateTransformer_;
            localStorageService = _localStorageService_;
        });
    });

    describe('MonetateTransformer', function() {
        it('tranformer is defined', function(done) {
            expect(MonetateTransformer).toBeDefined();
            done();
        });
    });

    describe('dateFormatted() is called', function() {
        it('should format the date', function(done) {
            expect(MonetateTransformer.dateFormatted('21-07-1989')).toBe('21071989');
            done();
        });
    });

    describe('transformAncillariesInMonetateProductModel() is called', function() {
        it('should de defined', function(done) {
            MonetateTransformer.transformAncillariesInMonetateProductModel(fakeShoppingBasketAncillaries);
            expect(MonetateTransformer.transformAncillariesInMonetateProductModel(fakeShoppingBasketAncillaries)).toBeDefined();
            done();
        });
    });

    describe('transformPassengersInMonetateProductModel() is called', function() {
        it('should return correct returnedItemId', function(done) {
            MonetateTransformer.transformPassengersInMonetateProductModel(fakeFlightPassengersInfo);
            expect(MonetateTransformer.transformPassengersInMonetateProductModel(fakeFlightPassengersInfo)[0].productId).toBe('V-MENOR');
            done();
        });
    });

    describe('transformCabinInMonetateProductModel() is called', function() {
        it('should return correct productId', function(done) {
            MonetateTransformer.transformCabinInMonetateProductModel(fakeFareFamilyConditions);
            expect(MonetateTransformer.transformCabinInMonetateProductModel(fakeFareFamilyConditions)[0].productId).toBe('V-CABINA-TURISTA');
            done();
        });
    });

    describe('transformFareDataInProductModel() is called', function() {
        it('should return empty array', function(done) {
            MonetateTransformer.transformFareDataInProductModel(fakeFareFamilyConditions);
            expect(MonetateTransformer.transformFareDataInProductModel(fakeFareFamilyConditions)).toEqual([]);
            done();
        });
    });

    describe('transformDestinationAreasCitiesListInProductModel() is called', function() {
        it('should return empty array', function(done) {
            MonetateTransformer.transformDestinationAreasCitiesListInProductModel(fakeDestinationAreasCitiesList, fakeDestinationCountryCollection);
            expect(MonetateTransformer.transformDestinationAreasCitiesListInProductModel(fakeDestinationAreasCitiesList, fakeDestinationCountryCollection)).toEqual([]);
            done();
        });
    });

    describe('transformOriginDestinationInfoIntoTripType() is called', function() {
        it('should return correct productId', function(done) {
            MonetateTransformer.transformOriginDestinationInfoIntoTripType(fakeDestinationCountryCollection);
            expect(MonetateTransformer.transformOriginDestinationInfoIntoTripType(fakeDestinationCountryCollection)[0].productId).toBe('V-NEGOCIOS');
            done();
        });
    });

    describe('transformOriginDestinationInfoIntoTripType() is called', function() {
        it('should return correct productId', function(done) {
            MonetateTransformer.transformOriginDestinationInfoIntoTripType(fakeDestinationCountryCollectionVerano);
            expect(MonetateTransformer.transformOriginDestinationInfoIntoTripType(fakeDestinationCountryCollectionVerano)[0].productId).toBe('V-VAC-FINDESEMANA');
            done();
        });
    });

    describe('compareCartProductsWithPurchasedProducts() is called', function() {
        it('should de defined', function(done) {
            localStorageService.set('addedCartProducts', fakeAddedCartProducts);
            MonetateTransformer.compareCartProductsWithPurchasedProducts(fakeShoppingBasketAncillaries);
            expect(MonetateTransformer.compareCartProductsWithPurchasedProducts(fakeShoppingBasketAncillaries)).toBeDefined();
            done();
        });
    });

    describe('createFlightReviewMonetate() is called', function() {
        it('should return expected flightReview', function(done) {
            expect(MonetateTransformer.createFlightReviewMonetate(fakeOriginDestinations, fakePassengers, fakeSlices, fakeCurrency, fakeFareFamilyConditions)[1].origin).toEqual(['LON']);
            done();
        });
    });

    describe('createFlightSearchMonetate() is called', function() {
        it('should return expected flightReview', function(done) {
            expect(MonetateTransformer.createFlightSearchMonetate(fakeOriginDestinations, fakePassengers, fakeAvailability)[1].origin).toEqual(['LON']);
            done();
        });
    });

    describe('createFlightBookingMonetate() is called', function() {
        it('should return expected flightReview', function(done) {
            expect(MonetateTransformer.createFlightBookingMonetate(fakeOriginDestinations, fakePassengers, fakeConfirmation, fakeFareFamilyConditions)[1].origin).toEqual(['LON']);
            done();
        });
    });

    describe('transformFlightRouteProductDetail() is called', function() {
        it('should return correct string', function(done) {
            expect(MonetateTransformer.transformFlightRouteProductDetail(fakeDestinationCountryCollection)).toEqual(['LONMAD-10102023', 'LONMAD-10112023']);
            done();
        });
    });

    describe('getCabinDescriptionbyType() is called', function() {
        it('should return correct cabinDescription', function(done) {
            expect(MonetateTransformer.getCabinDescriptionbyType('E')).toBe('Economy');
            expect(MonetateTransformer.getCabinDescriptionbyType('N')).toBe('Premium Economy');
            expect(MonetateTransformer.getCabinDescriptionbyType('B')).toBe('Business');
            done();
        });
    });
});
