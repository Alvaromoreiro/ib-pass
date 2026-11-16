describe('IbBookingAvailabilityUtilsService Test', function() {
    var IbBookingAvailabilityUtilsService, localStorageService, rootScope;
    var mockFareFamily = [
        {
            cabinType: 'E',
            cabinDescription: 'Turista',
            commercialCode: 'TBAESES',
            commercialName: 'Básica',
            commercialNameES: 'Básica',
            priority: 900,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Turista',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Turista',
                        code: 'CA_Cabina_Turista',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: 'No incluido.',
                    units: null,
                    extendedInfo: {
                        title: 'Sin equipaje en bodega',
                        message: 'No incluido. ',
                        code: 'CA_1_PIEZAS_PAGO',
                        conditionStatus: false,
                        observationCode: '1'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'De pago.',
                    units: null,
                    extendedInfo: {
                        title: 'Seleccionable con coste',
                        message: 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                        code: 'CA_Asiento_Pago',
                        conditionStatus: false,
                        observationCode: '3'
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'De pago',
                    units: null,
                    extendedInfo: {
                        title: 'Seleccionable con coste',
                        message: 'De pago',
                        code: 'CA_Asiento_XL_Pago',
                        conditionStatus: false,
                        observationCode: '3'
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                    units: 65,
                    extendedInfo: {
                        title: 'Cambio permitido con coste',
                        message: 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        code: 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'No permitido',
                    units: null,
                    extendedInfo: {
                        title: 'Reembolso no permitido',
                        message: 'No permitido.',
                        code: 'CA_REEMBOLSO NO PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Chek-in_desk_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Acceso a salas VIP No permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Fast Track NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'CA_Embarque_NO_Prioritario',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'No incluido',
                    units: null,
                    extendedInfo: {
                        title: 'No incluido',
                        message: 'No incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                        conditionStatus: false,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: '<a target="_blank" href="https://www.iberia.com/web/obsmenu.do?quadrigam=EQUFRA&menuId=EQUIDE">Consulte equipaje adicional</a>'
                },
                {
                    observationCode: 2,
                    observationText: '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías oneworld. En el resto debes consultar con la compañía operadora'
                },
                {
                    observationCode: 3,
                    observationText: '<a target="_blank" href="https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE">Más detalle sobre la reserva anticipada de asiento</a>'
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'E',
            cabinDescription: 'Turista',
            commercialCode: 'TCLESES',
            commercialName: 'Óptima',
            commercialNameES: 'Óptima',
            priority: 700,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Turista',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Turista',
                        code: 'CA_Cabina_Turista',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '1'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: '1 pieza',
                    units: 1,
                    extendedInfo: {
                        title: '1 equipaje en bodega',
                        message: 'Incluido: 1 pieza',
                        code: 'CA_1_PIEZAS',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'Gratuita desde 24 horas antes del vuelo. ',
                    units: 24,
                    extendedInfo: {
                        title: 'Gratuita desde 24 horas antes del vuelo. ',
                        message: 'Gratuita desde 24 horas antes del vuelo. ',
                        code: 'CA_Asiento_Gratis_24_horas',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'De pago',
                    units: null,
                    extendedInfo: {
                        title: 'Seleccionable con coste',
                        message: 'De pago',
                        code: 'CA_Asiento_XL_Pago',
                        conditionStatus: false,
                        observationCode: '3'
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                    units: 45,
                    extendedInfo: {
                        title: 'Cambio permitido con coste 45€. No Show no permite cambio',
                        message: 'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        code: 'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'No permitido',
                    units: null,
                    extendedInfo: {
                        title: 'Reembolso no permitido',
                        message: 'No permitido.',
                        code: 'CA_REEMBOLSO NO PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Chek-in_desk_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Acceso a salas VIP No permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Fast Track NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'CA_Embarque_NO_Prioritario',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'No incluido',
                    units: null,
                    extendedInfo: {
                        title: 'No incluido',
                        message: 'No incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                        conditionStatus: false,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías oneworld. En el resto debes consultar con la compañía operadora'
                },
                {
                    observationCode: 2,
                    observationText: 'Una pieza: Max:23 kg / 158 cm'
                },
                {
                    observationCode: 3,
                    observationText: '<a target="_blank" href="https://www.iberia.com/web/obsmenu.do?quadrigam=PRSEAT&menuId=EQUIDE">Más detalle sobre la reserva anticipada de asiento</a>'
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'E',
            cabinDescription: 'Turista',
            commercialCode: 'COTCLESES',
            commercialName: 'Confort',
            commercialNameES: 'Confort',
            priority: 600,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Turista',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Turista',
                        code: 'CA_Cabina_Turista',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '1'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: '1 pieza',
                    units: 1,
                    extendedInfo: {
                        title: '1 equipaje en bodega',
                        message: 'Incluido: 1 pieza',
                        code: 'CA_1_PIEZAS',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_Gratuito_No_Destacado',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_XL_Incluido',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Primer cambio: Permitido sin penalización hasta 15 días antes de la salida. Siguientes cambios: permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (no-show), que no permite cambio',
                    units: 45,
                    extendedInfo: {
                        title: 'Primer cambio permitido hasta 15 días. Siguientes cambios con coste 45€. No Show no permite cambio',
                        message: 'Primer cambio: Permitido sin penalización hasta 15 días antes de la salida. Siguientes cambios: permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (no-show), que no permite cambio',
                        code: 'CA_1 PERM 15D SIG CON PENALTY_45€_NO_SHOW_NO_PERMITID',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'Permitido el reembolso del 80% de la tarifa en bono hasta 15 días antes de la salida',
                    units: 80,
                    extendedInfo: {
                        title: 'Permitido el reembolso del 80% de la tarifa en bono hasta 15 días antes de la salida',
                        message: 'Permitido el reembolso del 80% de la tarifa en bono hasta 15 días antes de la salida',
                        code: 'CA_REEMBOLSO 80pp_BONO_15DIAS',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Chek-in_desk_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Acceso a salas VIP No permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Fast Track NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'Sí, grupo 2',
                    units: 2,
                    extendedInfo: {
                        title: '',
                        message: 'Sí, grupo 2',
                        code: 'CA_Embarque_Prioritario_grupo_2',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con tarjeta de embarque anticipada',
                        message: 'Incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_incluido',
                        conditionStatus: true,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías oneworld. En el resto debes consultar con la compañía operadora'
                },
                {
                    observationCode: 2,
                    observationText: 'Una pieza: Max:23 kg / 158 cm'
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'B',
            cabinDescription: 'Business Class',
            commercialCode: 'BREESES',
            commercialName: 'Business Promocional',
            commercialNameES: 'Business Promocional',
            priority: 200,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Business',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Business',
                        code: 'CA_Cabina_Busines',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '1'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: '2 piezas',
                    units: 2,
                    extendedInfo: {
                        title: '2 equipajes en bodega ',
                        message: '2 piezas máx 23kg/pieza y 158 cm.  ',
                        code: 'CA_2_PIEZAS',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_Gratuito',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_XL_Incluido_OFF',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                    units: 60,
                    extendedInfo: {
                        title: 'Cambio permitido con coste',
                        message: 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        code: 'CA_CAMBIO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'Permitidos en cualquier momento con una penalización de 90€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                    units: 90,
                    extendedInfo: {
                        title: 'Reembolso permitido con coste 90€. No Show no permitido',
                        message: 'Permitidos en cualquier momento con una penalización de 90€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                        code: 'CA_REEMBOLSO CON PENALTY_90EUR_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'Sí',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'Chek-in_desk_ SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'Si',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Si',
                        code: 'Acceso a salas VIP permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'Sí',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'Fast Track SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'Si',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Si',
                        code: 'Entrega_prioritaria_equipaje_ SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'Sí, grupo 1',
                    units: 1,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'CA_Embarque_Prioritario',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con tarjeta de embarque anticipada',
                        message: 'Incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_incluido',
                        conditionStatus: true,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías oneworld. En el resto debes consultar con la compañía operadora'
                },
                {
                    observationCode: 2,
                    observationText: 'Una pieza: Max:23 kg / 158 cm'
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'B',
            cabinDescription: 'Business Class',
            commercialCode: 'BFLESES',
            commercialName: 'Business Flexible',
            commercialNameES: 'Business Flexible',
            priority: 100,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Business',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Business',
                        code: 'CA_Cabina_Busines',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '1'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: '2 piezas',
                    units: 2,
                    extendedInfo: {
                        title: '2 equipajes en bodega ',
                        message: '2 piezas máx 23kg/pieza y 158 cm.  ',
                        code: 'CA_2_PIEZAS',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_Gratuito',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_XL_Incluido_OFF',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                    units: 50,
                    extendedInfo: {
                        title: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                        message: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ',
                        code: 'CA_CAMBIOS PERMITIDOS_NO_SHOW_50€',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                    units: 75,
                    extendedInfo: {
                        title: 'Reembolso permitido',
                        message: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                        code: 'CA_REEMBOLSO SIEMPRE_NO_SHOW_75€',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'Sí',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'Chek-in_desk_ SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'Si',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Si',
                        code: 'Acceso a salas VIP permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'Sí',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'Fast Track SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'Si',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Si',
                        code: 'Entrega_prioritaria_equipaje_ SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'Sí, grupo 1',
                    units: 1,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'CA_Embarque_Prioritario',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con tarjeta de embarque anticipada',
                        message: 'Incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_incluido',
                        conditionStatus: true,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: '1 bulto (56x40x25cm/ 14kgs Business / 10kgs Turista)+ 1 accesorio personal. Válido en vuelos operados por compañías oneworld. En el resto debes consultar con la compañía operadora'
                },
                {
                    observationCode: 2,
                    observationText: 'Una pieza: Max:23 kg / 158 cm'
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        }
    ];
    var responseFareFamily = [
        {
            cabinType: 'E',
            cabinDescription: 'Turista',
            commercialCode: 'TBAESES',
            commercialName: 'Básica',
            commercialNameES: 'Básica',
            priority: 900,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Turista',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Turista',
                        code: 'CA_Cabina_Turista',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: 'No incluido.',
                    units: null,
                    extendedInfo: {
                        title: 'Sin equipaje en bodega',
                        message: 'No incluido. ',
                        code: 'CA_1_PIEZAS_PAGO',
                        conditionStatus: false,
                        observationCode: '1'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'De pago.',
                    units: null,
                    extendedInfo: {
                        title: 'Seleccionable con coste',
                        message: 'De pago. <a target="_blank" href="http://prea.iberia.es/web/product.do?popup=true&AAA=true&cntCat=Productos/PRSEAT&cntId=reserva_de_asiento&market=ES&language=es">Política de reserva anticipada de asientos</a>',
                        code: 'CA_Asiento_Pago',
                        conditionStatus: false,
                        observationCode: '3'
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'De pago',
                    units: null,
                    extendedInfo: {
                        title: 'Seleccionable con coste',
                        message: 'De pago',
                        code: 'CA_Asiento_XL_Pago',
                        conditionStatus: false,
                        observationCode: '3'
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                    units: 65,
                    extendedInfo: {
                        title: 'Cambio permitido con coste',
                        message: 'Permitidos en cualquier momento con una penalización de 65€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        code: 'CA_CAMBIO CON PENALTY_65€_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'No permitido',
                    units: null,
                    extendedInfo: {
                        title: 'Reembolso no permitido',
                        message: 'No permitido.',
                        code: 'CA_REEMBOLSO NO PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Chek-in_desk_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Acceso a salas VIP No permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Fast Track NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'CA_Embarque_NO_Prioritario',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'No incluido',
                    units: null,
                    extendedInfo: {
                        title: 'No incluido',
                        message: 'No incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                        conditionStatus: false,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: {}
                },
                {
                    observationCode: 2,
                    observationText: {}
                },
                {
                    observationCode: 3,
                    observationText: {}
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'E',
            cabinDescription: 'Turista',
            commercialCode: 'TCLESES',
            commercialName: 'Óptima',
            commercialNameES: 'Óptima',
            priority: 700,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Turista',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Turista',
                        code: 'CA_Cabina_Turista',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '1'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: '1 pieza',
                    units: 1,
                    extendedInfo: {
                        title: '1 equipaje en bodega',
                        message: 'Incluido: 1 pieza',
                        code: 'CA_1_PIEZAS',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'Gratuita desde 24 horas antes del vuelo. ',
                    units: 24,
                    extendedInfo: {
                        title: 'Gratuita desde 24 horas antes del vuelo. ',
                        message: 'Gratuita desde 24 horas antes del vuelo. ',
                        code: 'CA_Asiento_Gratis_24_horas',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'De pago',
                    units: null,
                    extendedInfo: {
                        title: 'Seleccionable con coste',
                        message: 'De pago',
                        code: 'CA_Asiento_XL_Pago',
                        conditionStatus: false,
                        observationCode: '3'
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                    units: 45,
                    extendedInfo: {
                        title: 'Cambio permitido con coste 45€. No Show no permite cambio',
                        message: 'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        code: 'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'No permitido',
                    units: null,
                    extendedInfo: {
                        title: 'Reembolso no permitido',
                        message: 'No permitido.',
                        code: 'CA_REEMBOLSO NO PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Chek-in_desk_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Acceso a salas VIP No permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Fast Track NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'CA_Embarque_NO_Prioritario',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'No incluido',
                    units: null,
                    extendedInfo: {
                        title: 'No incluido',
                        message: 'No incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_no_incluido',
                        conditionStatus: false,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: {}
                },
                {
                    observationCode: 2,
                    observationText: {}
                },
                {
                    observationCode: 3,
                    observationText: {}
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'E',
            cabinDescription: 'Turista',
            commercialCode: 'COTCLESES',
            commercialName: 'Confort',
            commercialNameES: 'Confort',
            priority: 600,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Turista',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Turista',
                        code: 'CA_Cabina_Turista',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '1'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: '1 pieza',
                    units: 1,
                    extendedInfo: {
                        title: '1 equipaje en bodega',
                        message: 'Incluido: 1 pieza',
                        code: 'CA_1_PIEZAS',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_Gratuito_No_Destacado',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_XL_Incluido',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Primer cambio: Permitido sin penalización hasta 15 días antes de la salida. Siguientes cambios: permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (no-show), que no permite cambio',
                    units: 45,
                    extendedInfo: {
                        title: 'Primer cambio permitido hasta 15 días. Siguientes cambios con coste 45€. No Show no permite cambio',
                        message: 'Primer cambio: Permitido sin penalización hasta 15 días antes de la salida. Siguientes cambios: permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (no-show), que no permite cambio',
                        code: 'CA_1 PERM 15D SIG CON PENALTY_45€_NO_SHOW_NO_PERMITID',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'Permitido el reembolso del 80% de la tarifa en bono hasta 15 días antes de la salida',
                    units: 80,
                    extendedInfo: {
                        title: 'Permitido el reembolso del 80% de la tarifa en bono hasta 15 días antes de la salida',
                        message: 'Permitido el reembolso del 80% de la tarifa en bono hasta 15 días antes de la salida',
                        code: 'CA_REEMBOLSO 80pp_BONO_15DIAS',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Chek-in_desk_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Acceso a salas VIP No permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Fast Track NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'No',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'No',
                        code: 'Entrega_prioritaria_equipaje_ NO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'Sí, grupo 2',
                    units: 2,
                    extendedInfo: {
                        title: '',
                        message: 'Sí, grupo 2',
                        code: 'CA_Embarque_Prioritario_grupo_2',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con tarjeta de embarque anticipada',
                        message: 'Incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_incluido',
                        conditionStatus: true,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: {}
                },
                {
                    observationCode: 2,
                    observationText: {}
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'B',
            cabinDescription: 'Business Class',
            commercialCode: 'BREESES',
            commercialName: 'Business Promocional',
            commercialNameES: 'Business Promocional',
            priority: 200,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Business',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Business',
                        code: 'CA_Cabina_Busines',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '1'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: '2 piezas',
                    units: 2,
                    extendedInfo: {
                        title: '2 equipajes en bodega ',
                        message: '2 piezas máx 23kg/pieza y 158 cm.  ',
                        code: 'CA_2_PIEZAS',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_Gratuito',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_XL_Incluido_OFF',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                    units: 60,
                    extendedInfo: {
                        title: 'Cambio permitido con coste',
                        message: 'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        code: 'CA_CAMBIO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'Permitidos en cualquier momento con una penalización de 90€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                    units: 90,
                    extendedInfo: {
                        title: 'Reembolso permitido con coste 90€. No Show no permitido',
                        message: 'Permitidos en cualquier momento con una penalización de 90€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                        code: 'CA_REEMBOLSO CON PENALTY_90EUR_NO_SHOW_NO_PERMITIDO',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'Sí',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'Chek-in_desk_ SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'Si',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Si',
                        code: 'Acceso a salas VIP permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'Sí',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'Fast Track SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'Si',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Si',
                        code: 'Entrega_prioritaria_equipaje_ SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'Sí, grupo 1',
                    units: 1,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'CA_Embarque_Prioritario',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con tarjeta de embarque anticipada',
                        message: 'Incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_incluido',
                        conditionStatus: true,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: {}
                },
                {
                    observationCode: 2,
                    observationText: {}
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        },
        {
            cabinType: 'B',
            cabinDescription: 'Business Class',
            commercialCode: 'BFLESES',
            commercialName: 'Business Flexible',
            commercialNameES: 'Business Flexible',
            priority: 100,
            conditions: [
                {
                    code: 'CABINA',
                    name: 'Cabina',
                    text: 'Business',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Business',
                        code: 'CA_Cabina_Busines',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQMANO',
                    name: 'Equipaje de mano',
                    text: '1 bulto (56x40x25cm)',
                    units: 1,
                    extendedInfo: {
                        title: '1 bulto en cabina  (56x40x25cm)',
                        message: '1 bulto (56x40x25cm)',
                        code: 'CA_EQP_MANO_10KG',
                        conditionStatus: true,
                        observationCode: '1'
                    }
                },
                {
                    code: 'EQBODEGA',
                    name: 'Equipaje en bodega',
                    text: '2 piezas',
                    units: 2,
                    extendedInfo: {
                        title: '2 equipajes en bodega ',
                        message: '2 piezas máx 23kg/pieza y 158 cm.  ',
                        code: 'CA_2_PIEZAS',
                        conditionStatus: true,
                        observationCode: '2'
                    }
                },
                {
                    code: 'ASIENTO',
                    name: 'Selección de asiento',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_Gratuito',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'ASIENTOXL',
                    name: 'Selección de asiento XL',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con selección de asiento',
                        message: 'Incluido',
                        code: 'CA_Asiento_XL_Incluido_OFF',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'CAMBIO',
                    name: 'Cambios',
                    text: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                    units: 50,
                    extendedInfo: {
                        title: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrá una penalización de 50€',
                        message: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (no show), que tendrán una penalización de 50€.   ',
                        code: 'CA_CAMBIOS PERMITIDOS_NO_SHOW_50€',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'REEMBOLSO',
                    name: 'Reembolso (por sentido)',
                    text: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                    units: 75,
                    extendedInfo: {
                        title: 'Reembolso permitido',
                        message: 'Permitidos sin penalización, excepto en caso de no presentarse al vuelo (No-Show), que tendrá una penalización de 75€',
                        code: 'CA_REEMBOLSO SIEMPRE_NO_SHOW_75€',
                        conditionStatus: true,
                        observationCode: null
                    }
                },
                {
                    code: 'CHECKINDESK',
                    name: 'Mostrador check-in exclusivo',
                    text: 'Sí',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'Chek-in_desk_ SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'SALAVIP',
                    name: 'Acceso a salas VIP',
                    text: 'Si',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Si',
                        code: 'Acceso a salas VIP permitido',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'FASTTRACK',
                    name: 'Fast Track',
                    text: 'Sí',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'Fast Track SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EQPPRIOR',
                    name: 'Entrega prioritaria equipaje',
                    text: 'Si',
                    units: null,
                    extendedInfo: {
                        title: '',
                        message: 'Si',
                        code: 'Entrega_prioritaria_equipaje_ SI',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'EMBARQUE',
                    name: 'Prioridad de Embarque',
                    text: 'Sí, grupo 1',
                    units: 1,
                    extendedInfo: {
                        title: '',
                        message: 'Sí',
                        code: 'CA_Embarque_Prioritario',
                        conditionStatus: false,
                        observationCode: null
                    }
                },
                {
                    code: 'TARJEMBANTIC',
                    name: 'Tarjeta de embarque anticipada',
                    text: 'Incluido',
                    units: null,
                    extendedInfo: {
                        title: 'Con tarjeta de embarque anticipada',
                        message: 'Incluido',
                        code: 'CA_Tarjeta_embarque_anticipada_incluido',
                        conditionStatus: true,
                        observationCode: null
                    }
                }
            ],
            observations: [
                {
                    observationCode: 1,
                    observationText: {}
                },
                {
                    observationCode: 2,
                    observationText: {}
                }
            ],
            conditionsPriority: [
                'EQMANO',
                'EQBODEGA',
                'COMIDA',
                'ASIENTO',
                'ASIENTOXL',
                'EMBARQUE',
                'TARJEMBANTIC',
                'CAMBIO',
                'REEMBOLSO'
            ]
        }
    ];
    var mockCommercialInfo = {
        currency: {
            code: 'EUR',
            description: 'Euro',
            symbol: '€',
            alignment: 'R',
            groupingSeparator: '.',
            decimalSeparator: ',',
            decimals: 2,
            recommendedDisplay: 'symbol'
        },
        languages: [
            {
                dateFormat: {
                    long: 'd\' / \'MMMM\' / \'yyyy',
                    medium: 'dd/MM/yyyy',
                    short: 'dd/MM/yyyy'
                },
                code: 'ca',
                description: 'Català'
            },
            {
                dateFormat: {
                    long: 'MMMM d, yyyy',
                    medium: 'MMM d, yyyy',
                    short: 'dd/MM/yyyy'
                },
                code: 'en',
                description: 'English'
            },
            {
                dateFormat: {
                    long: 'd\' de \'MMMM\' de \'yyyy',
                    medium: 'dd-MMM-yyyy',
                    short: 'dd/MM/yyyy'
                },
                code: 'es',
                description: 'Español'
            }
        ],
        market: {
            code: 'ES',
            description: 'España'
        },
        marketFlags: {
            allowedNameCorrection: true,
            allowedAncillaries: true,
            allowedFlightChange: true,
            allowedRefund: true,
            allowedCashAndAviosWithVoucher: true
        },
        sessionTimeLifeInMinutes: 15,
        maxSearchTime: 360,
        minSearchTime: 0,
        passengerTypes: [
            {
                passengerType: 'ADULT',
                description: 'Adulto'
            },
            {
                passengerType: 'INFANT',
                description: 'Bebé'
            },
            {
                passengerType: 'YOUTH',
                description: 'Joven'
            },
            {
                passengerType: 'CHILD',
                description: 'Niño'
            },
            {
                passengerType: 'SENIOR',
                description: 'Tercera edad'
            }
        ],
        discounts: [
            {
                code: 'GENERAL',
                description: 'General',
                countries: [
                    'ES'
                ],
                cities: [],
                relatedField: 'GENERAL',
                type: 'LGF'
            },
            {
                code: 'SPECIAL',
                description: 'Especial',
                countries: [
                    'ES'
                ],
                cities: [],
                relatedField: 'SPECIAL',
                type: 'LGF'
            },
            {
                code: 'CEUTA',
                description: 'Soy residente en Ceuta',
                countries: [
                    'ES'
                ],
                cities: [
                    {
                        code: 'AGP',
                        description: 'Málaga',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Europe/Madrid',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 1,
                        latitude: 36.666666,
                        longitude: -4.5
                    },
                    {
                        code: 'SVQ',
                        description: 'Sevilla',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Europe/Madrid',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 1,
                        latitude: 37.433333,
                        longitude: -5.9
                    },
                    {
                        code: 'XRY',
                        description: 'Jerez de la Frontera',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Europe/Madrid',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 1,
                        latitude: 36.75,
                        longitude: -6.066666
                    }
                ],
                relatedField: 'ceutaResident',
                type: 'RES'
            },
            {
                code: 'BALEARES',
                description: 'Soy residente en las Islas Baleares',
                countries: [
                    'ES'
                ],
                cities: [
                    {
                        code: 'IBZ',
                        description: 'Ibiza',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Europe/Madrid',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 5,
                        latitude: 38.866666,
                        longitude: 1.366666
                    },
                    {
                        code: 'MAH',
                        description: 'Menorca',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Europe/Madrid',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 5,
                        latitude: 39.866666,
                        longitude: 4.216666
                    },
                    {
                        code: 'PMI',
                        description: 'Palma de Mallorca',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Europe/Madrid',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 6,
                        latitude: 39.55,
                        longitude: 2.733333
                    }
                ],
                relatedField: 'balearicIslandsResident',
                type: 'RES'
            },
            {
                code: 'CANARIAS',
                description: 'Soy residente en las Islas Canarias',
                countries: [
                    'ES'
                ],
                cities: [
                    {
                        code: 'ACE',
                        description: 'Lanzarote',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Atlantic/Canary',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 10,
                        latitude: 28.95,
                        longitude: -13.6
                    },
                    {
                        code: 'FUE',
                        description: 'Fuerteventura',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Atlantic/Canary',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 10,
                        latitude: 28.45,
                        longitude: -13.866666
                    },
                    {
                        code: 'GMZ',
                        description: 'San Sebastián de la Gomera',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Atlantic/Canary',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 12,
                        latitude: 28.0937998,
                        longitude: -17.1098582
                    },
                    {
                        code: 'LPA',
                        description: 'Gran Canaria Las Palmas',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Atlantic/Canary',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 12,
                        latitude: 27.933333,
                        longitude: -15.383333
                    },
                    {
                        code: 'SPC',
                        description: 'Santa Cruz de La Palma',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Europe/Madrid',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 10,
                        latitude: 28.683333,
                        longitude: -17.75
                    },
                    {
                        code: 'TCI',
                        description: 'Tenerife',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Atlantic/Canary',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 11,
                        latitude: 28.316666,
                        longitude: -16.566666
                    },
                    {
                        code: 'VDE',
                        description: 'Valverde',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Atlantic/Canary',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 12,
                        latitude: 27.793241,
                        longitude: -17.9413323
                    }
                ],
                relatedField: 'canaryIslandsResident',
                type: 'RES'
            },
            {
                code: 'MELILLA',
                description: 'Soy residente en Melilla',
                countries: [
                    'ES'
                ],
                cities: [
                    {
                        code: 'MLN',
                        description: 'Melilla',
                        countryCode: 'ES',
                        countryDescription: null,
                        timezone: 'Europe/Madrid',
                        gaCode: 6,
                        arCode: 1,
                        saCode: 2,
                        latitude: 35.283333,
                        longitude: -2.95
                    }
                ],
                relatedField: 'melillaResident',
                type: 'RES'
            }
        ],
        defaultValues: {
            defaultPaxType: 'ADULT',
            defaultPaxTypeNumbers: [
                {
                    passengerType: 'ADULT',
                    number: 1
                },
                {
                    passengerType: 'CHILD',
                    number: 0
                },
                {
                    passengerType: 'INFANT',
                    number: 0
                },
                {
                    passengerType: 'SENIOR',
                    number: 0
                },
                {
                    passengerType: 'YOUTH',
                    number: 0
                }
            ],
            maxPaxNumber: 9,
            defaultPhonePrefix: {
                code: '34',
                description: 'España / +34',
                countryCode: 'ES'
            }
        },
        roundingPolicy: 'HALF_ROUND_DOWN',
        availabilityPriceShowPolicy: 'ADULT_PRICE_WITH_TAXES_AND_EMISSION',
        mainCities: {
            normal: {
                code: 'MAD',
                description: 'Madrid',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: null
                }
            },
            redemption: {
                code: 'MAD',
                description: 'Madrid',
                timezone: 'Europe/Madrid',
                country: {
                    code: 'ES',
                    description: null
                }
            }
        }
    };
    var mockAvailabilityRequestData = {
        slices: [
            {
                origin: 'MAD',
                destination: 'BIO',
                date: '2021-10-05'
            }
        ],
        passengers: [
            {
                passengerType: 'ADULT',
                count: 1
            }
        ],
        marketCode: 'ES',
        preferredCabin: 'ECONOMY'
    };
    var responseLimitDate = {
        minDate: '2021-08-19T00:00:00.000Z',
        maxDate: '2022-08-14T00:00:00.000Z'
    };
    var mockSegmentInfo = {
        segmentId: 'IB044820211005',
        departureDateTime: '2021-10-05 07:35',
        arrivalDateTime: '2021-10-05 08:40',
        departure: {
            code: 'MAD',
            name: 'BARAJAS',
            terminal: '4',
            city: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        arrival: {
            code: 'BIO',
            name: 'AIRPORT',
            terminal: '',
            city: {
                code: 'BIO',
                description: 'Bilbao',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        flight: {
            marketingCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            operationalCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            marketingFlightNumber: '0448',
            operationalFlightNumber: '0448',
            operationalDisclosure: 'IB',
            aircraft: {
                code: '32A',
                description: 'Airbus A320'
            }
        },
        overnight: false,
        waitingTime: 0,
        duration: 65,
        delayInformation: null,
        stop: null,
        durationParsed: '1h 5min.',
        isMoreThan2h: false,
        waitingTimeParsed: '',
        departureDateTimeParsed: '07:35',
        departureDateParsed: {
            dateTime: '07:35',
            weekDay: 'WEEKDAY_TUESDAY',
            hour: 2,
            minutes: 0,
            day: 5,
            monthNumber: 10,
            month: 'MONTH_OCTOBER',
            year: 2021,
            formatedDate: '2021-10-05 07:35'
        },
        arrivalDateTimeParsed: '08:40',
        companyURL: '/aerolineas/logo_pos_IB.svg',
    };
    var mockSegmentInfoOverNight = {
        segmentId: 'IB044820211005',
        departureDateTime: '2021-10-05 07:35',
        arrivalDateTime: '2021-10-05 08:40',
        departure: {
            code: 'MAD',
            name: 'BARAJAS',
            terminal: '4',
            city: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        arrival: {
            code: 'BIO',
            name: 'AIRPORT',
            terminal: '',
            city: {
                code: 'BIO',
                description: 'Bilbao',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        flight: {
            marketingCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            operationalCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            marketingFlightNumber: '0448',
            operationalFlightNumber: '0448',
            operationalDisclosure: 'IB',
            aircraft: {
                code: '32A',
                description: 'Airbus A320'
            }
        },
        overnight: false,
        waitingTime: 0,
        duration: 65,
        delayInformation: null,
        stop: null,
        durationParsed: '1h 5min.',
        isMoreThan2h: false,
        waitingTimeParsed: '',
        departureDateTimeParsed: '07:35',
        departureDateParsed: {
            dateTime: '07:35',
            weekDay: 'WEEKDAY_TUESDAY',
            hour: 2,
            minutes: 0,
            day: 5,
            monthNumber: 10,
            month: 'MONTH_OCTOBER',
            year: 2021,
            formatedDate: '2021-10-05 07:35'
        },
        arrivalDateTimeParsed: '08:40',
        companyURL: '/aerolineas/logo_pos_IB.svg',
        warnings: [{
            code: 'SSE_AVM_20003',
            message: '',
            isOverNight: false
        }]
    };
    var mockSegmentInfoTerminalChange = {
        segmentId: 'IB044820211005',
        departureDateTime: '2021-10-05 07:35',
        arrivalDateTime: '2021-10-05 08:40',
        departure: {
            code: 'MAD',
            name: 'BARAJAS',
            terminal: '4',
            city: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        arrival: {
            code: 'BIO',
            name: 'AIRPORT',
            terminal: '',
            city: {
                code: 'BIO',
                description: 'Bilbao',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        flight: {
            marketingCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            operationalCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            marketingFlightNumber: '0448',
            operationalFlightNumber: '0448',
            operationalDisclosure: 'IB',
            aircraft: {
                code: '32A',
                description: 'Airbus A320'
            }
        },
        overnight: false,
        waitingTime: 0,
        duration: 65,
        delayInformation: null,
        stop: null,
        durationParsed: '1h 5min.',
        isMoreThan2h: false,
        waitingTimeParsed: '',
        departureDateTimeParsed: '07:35',
        departureDateParsed: {
            dateTime: '07:35',
            weekDay: 'WEEKDAY_TUESDAY',
            hour: 2,
            minutes: 0,
            day: 5,
            monthNumber: 10,
            month: 'MONTH_OCTOBER',
            year: 2021,
            formatedDate: '2021-10-05 07:35'
        },
        arrivalDateTimeParsed: '08:40',
        companyURL: '/aerolineas/logo_pos_IB.svg',
        warnings: [{
            code: 'SSE_AVM_20002',
            message: '',
            isOverNight: false
        }]
    };
    var mockSegmentInfoLongTime = {
        segmentId: 'IB044820211005',
        departureDateTime: '2021-10-05 07:35',
        arrivalDateTime: '2021-10-05 08:40',
        departure: {
            code: 'MAD',
            name: 'BARAJAS',
            terminal: '4',
            city: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        arrival: {
            code: 'BIO',
            name: 'AIRPORT',
            terminal: '',
            city: {
                code: 'BIO',
                description: 'Bilbao',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        flight: {
            marketingCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            operationalCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            marketingFlightNumber: '0448',
            operationalFlightNumber: '0448',
            operationalDisclosure: 'IB',
            aircraft: {
                code: '32A',
                description: 'Airbus A320'
            }
        },
        overnight: false,
        waitingTime: 0,
        duration: 65,
        delayInformation: null,
        stop: null,
        durationParsed: '1h 5min.',
        isMoreThan2h: false,
        waitingTimeParsed: '',
        departureDateTimeParsed: '07:35',
        departureDateParsed: {
            dateTime: '07:35',
            weekDay: 'WEEKDAY_TUESDAY',
            hour: 2,
            minutes: 0,
            day: 5,
            monthNumber: 10,
            month: 'MONTH_OCTOBER',
            year: 2021,
            formatedDate: '2021-10-05 07:35'
        },
        arrivalDateTimeParsed: '08:40',
        companyURL: '/aerolineas/logo_pos_IB.svg',
        warnings: [{
            code: 'SSE_AVM_20004',
            message: '',
            isOverNight: false
        }]
    };
    var mockSegmentInfoAirportChange = {
        segmentId: 'IB044820211005',
        departureDateTime: '2021-10-05 07:35',
        arrivalDateTime: '2021-10-05 08:40',
        departure: {
            code: 'MAD',
            name: 'BARAJAS',
            terminal: '4',
            city: {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        arrival: {
            code: 'BIO',
            name: 'AIRPORT',
            terminal: '',
            city: {
                code: 'BIO',
                description: 'Bilbao',
                countryCode: 'ES',
                country: {
                    code: 'ES',
                    description: 'España'
                }
            }
        },
        flight: {
            marketingCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            operationalCarrier: {
                code: 'IB',
                name: 'Iberia'
            },
            marketingFlightNumber: '0448',
            operationalFlightNumber: '0448',
            operationalDisclosure: 'IB',
            aircraft: {
                code: '32A',
                description: 'Airbus A320'
            }
        },
        overnight: false,
        waitingTime: 0,
        duration: 65,
        delayInformation: null,
        stop: null,
        durationParsed: '1h 5min.',
        isMoreThan2h: false,
        waitingTimeParsed: '',
        departureDateTimeParsed: '07:35',
        departureDateParsed: {
            dateTime: '07:35',
            weekDay: 'WEEKDAY_TUESDAY',
            hour: 2,
            minutes: 0,
            day: 5,
            monthNumber: 10,
            month: 'MONTH_OCTOBER',
            year: 2021,
            formatedDate: '2021-10-05 07:35'
        },
        arrivalDateTimeParsed: '08:40',
        companyURL: '/aerolineas/logo_pos_IB.svg',
        warnings: [{
            code: 'SSE_AVM_20001',
            message: '',
            isOverNight: false
        }]
    };
    var responseReturnedWarnings = {
        terminalChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        airportChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        scaleWaitingTime: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        nightFlight: {
            code: '',
            message: '',
            isOverNight: false
        }
    };
    var responseReturnedWarningsOverNight = {
        terminalChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        airportChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        scaleWaitingTime: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        nightFlight: {
            code: 'SSE_AVM_20003',
            message: '',
            isOverNight: false
        }
    };
    var responseReturnedWarningsTerminal = {
        terminalChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        airportChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        scaleWaitingTime: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        nightFlight: {
            code: 'SSE_AVM_20002',
            message: '',
            isOverNight: false
        }
    };
    var responseReturnedWarningsAirport = {
        terminalChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        airportChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        scaleWaitingTime: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        nightFlight: {
            code: 'SSE_AVM_20001',
            message: '',
            isOverNight: false
        }
    };
    var responseReturnedWarningsLongTime = {
        terminalChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        airportChange: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        scaleWaitingTime: {
            isImportant: false,
            code: '',
            message: '',
            show: false
        },
        nightFlight: {
            code: 'SSE_AVM_20004',
            message: '',
            isOverNight: false
        }
    };
    var mockCells = [
        {
            adultPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            perPassengerPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            totalPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            fareFamily: 'TBAESES',
            bestPrice: true,
            available: true,
            boundDate: '2021-10-02',
            selectedDate: false
        },
        {
            adultPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            perPassengerPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            totalPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            fareFamily: 'TBAESES',
            bestPrice: true,
            available: true,
            boundDate: '2021-10-03',
            selectedDate: false
        },
        {
            adultPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            perPassengerPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            totalPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            fareFamily: 'TBAESES',
            bestPrice: true,
            available: true,
            boundDate: '2021-10-04',
            selectedDate: false
        },
        {
            adultPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            perPassengerPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            totalPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            fareFamily: 'TBAESES',
            bestPrice: true,
            available: true,
            boundDate: '2021-10-05',
            selectedDate: true
        },
        {
            adultPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            perPassengerPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            totalPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            fareFamily: 'TBAESES',
            bestPrice: true,
            available: true,
            boundDate: '2021-10-06',
            selectedDate: false
        },
        {
            adultPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            perPassengerPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            totalPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            fareFamily: 'TBAESES',
            bestPrice: true,
            available: true,
            boundDate: '2021-10-07',
            selectedDate: false
        },
        {
            adultPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            perPassengerPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            totalPrice: {
                fare: 33,
                tax: 20.85,
                total: 53.85,
                currency: 'EUR',
                ticketingFee: 0
            },
            fareFamily: 'TBAESES',
            bestPrice: true,
            available: true,
            boundDate: '2021-10-08',
            selectedDate: false
        }
    ];
    var responseSlidesInfo = [
        {
            date: {
                dateTime: '',
                weekDay: 'WEEKDAY_SATURDAY',
                hour: 2,
                minutes: 0,
                day: 2,
                monthNumber: 10,
                month: 'MONTH_OCTOBER',
                year: 2021,
                formatedDate: '02/10/2021'
            },
            serviceDate: '2021-10-02',
            price: 53.85,
            state: 'AVAILABLE'
        },
        {
            date: {
                dateTime: '',
                weekDay: 'WEEKDAY_SUNDAY',
                hour: 2,
                minutes: 0,
                day: 3,
                monthNumber: 10,
                month: 'MONTH_OCTOBER',
                year: 2021,
                formatedDate: '03/10/2021'
            },
            serviceDate: '2021-10-03',
            price: 53.85,
            state: 'AVAILABLE'
        },
        {
            date: {
                dateTime: '',
                weekDay: 'WEEKDAY_MONDAY',
                hour: 2,
                minutes: 0,
                day: 4,
                monthNumber: 10,
                month: 'MONTH_OCTOBER',
                year: 2021,
                formatedDate: '04/10/2021'
            },
            serviceDate: '2021-10-04',
            price: 53.85,
            state: 'AVAILABLE'
        },
        {
            date: {
                dateTime: '',
                weekDay: 'WEEKDAY_TUESDAY',
                hour: 2,
                minutes: 0,
                day: 5,
                monthNumber: 10,
                month: 'MONTH_OCTOBER',
                year: 2021,
                formatedDate: '05/10/2021'
            },
            serviceDate: '2021-10-05',
            price: 53.85,
            state: 'AVAILABLE'
        },
        {
            date: {
                dateTime: '',
                weekDay: 'WEEKDAY_WEDNESDAY',
                hour: 2,
                minutes: 0,
                day: 6,
                monthNumber: 10,
                month: 'MONTH_OCTOBER',
                year: 2021,
                formatedDate: '06/10/2021'
            },
            serviceDate: '2021-10-06',
            price: 53.85,
            state: 'AVAILABLE'
        },
        {
            date: {
                dateTime: '',
                weekDay: 'WEEKDAY_THURSDAY',
                hour: 2,
                minutes: 0,
                day: 7,
                monthNumber: 10,
                month: 'MONTH_OCTOBER',
                year: 2021,
                formatedDate: '07/10/2021'
            },
            serviceDate: '2021-10-07',
            price: 53.85,
            state: 'AVAILABLE'
        },
        {
            date: {
                dateTime: '',
                weekDay: 'WEEKDAY_FRYDAY',
                hour: 2,
                minutes: 0,
                day: 8,
                monthNumber: 10,
                month: 'MONTH_OCTOBER',
                year: 2021,
                formatedDate: '08/10/2021'
            },
            serviceDate: '2021-10-08',
            price: 53.85,
            state: 'AVAILABLE'
        }
    ];
    let mockfareFamilyOffers = [
        {
            "offerId": "IBbbceef980c7f46eda8445d338c89f36eOP",
            "offerItems": [
                {
                    "offerItemId": "IBbbceef980c7f46eda8445d338c89f36eOP_01",
                    "price": {
                        "fare": 222,
                        "tax": 25.27,
                        "total": 247.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNB2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "4SrlRw44b28OFtmsiJAXiA004",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 222,
                "tax": 25.27,
                "total": 247.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB9cc5c3501b6347f89315d40d70931c2fOP",
            "offerItems": [
                {
                    "offerItemId": "IB9cc5c3501b6347f89315d40d70931c2fOP_01",
                    "price": {
                        "fare": 467,
                        "tax": 25.27,
                        "total": 492.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 336,
                        "tax": 18.38,
                        "total": 354.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 336,
                        "tax": 18.38,
                        "total": 354.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 336,
                        "tax": 18.38,
                        "total": 354.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 3,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "BFLROES",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "I",
                                    "remainingSeats": 3,
                                    "fareBasis": "",
                                    "extendedFareCode": "IDNNY2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNB2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "4SrlRw44b28OFtmsiJAXiA00L",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 467,
                "tax": 25.27,
                "total": 492.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB2e9c727fcc07433b991c3c6962ec0e1eOP",
            "offerItems": [
                {
                    "offerItemId": "IB2e9c727fcc07433b991c3c6962ec0e1eOP_01",
                    "price": {
                        "fare": 387,
                        "tax": 25.27,
                        "total": 412.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 256,
                        "tax": 18.38,
                        "total": 274.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 256,
                        "tax": 18.38,
                        "total": 274.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 256,
                        "tax": 18.38,
                        "total": 274.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 3,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "BUSCOMMH",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "I",
                                    "remainingSeats": 3,
                                    "fareBasis": "",
                                    "extendedFareCode": "IDNNU2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNB2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "4SrlRw44b28OFtmsiJAXiA00F",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 387,
                "tax": 25.27,
                "total": 412.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB9b7ea616377f4fd18930c55464b86333OP",
            "offerItems": [
                {
                    "offerItemId": "IB9b7ea616377f4fd18930c55464b86333OP_01",
                    "price": {
                        "fare": 382,
                        "tax": 25.27,
                        "total": 407.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 251,
                        "tax": 18.38,
                        "total": 269.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 251,
                        "tax": 18.38,
                        "total": 269.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 251,
                        "tax": 18.38,
                        "total": 269.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TFLESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNY3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNB2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "4SrlRw44b28OFtmsiJAXiA00J",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 382,
                "tax": 25.27,
                "total": 407.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IBa4fcc1f60d2b403ebad6c2bd378fa308OP",
            "offerItems": [
                {
                    "offerItemId": "IBa4fcc1f60d2b403ebad6c2bd378fa308OP_01",
                    "price": {
                        "fare": 253,
                        "tax": 25.27,
                        "total": 278.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 122,
                        "tax": 18.38,
                        "total": 140.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 122,
                        "tax": 18.38,
                        "total": 140.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 122,
                        "tax": 18.38,
                        "total": 140.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TCLESES",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNM3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNB2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "4SrlRw44b28OFtmsiJAXiA007",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 253,
                "tax": 25.27,
                "total": 278.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB9efc1429cfa94471bda1f40d93b20ec9OP",
            "offerItems": [
                {
                    "offerItemId": "IB9efc1429cfa94471bda1f40d93b20ec9OP_01",
                    "price": {
                        "fare": 332,
                        "tax": 25.27,
                        "total": 357.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 201,
                        "tax": 18.38,
                        "total": 219.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 201,
                        "tax": 18.38,
                        "total": 219.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 201,
                        "tax": 18.38,
                        "total": 219.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 3,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "BUSOPTMH",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "I",
                                    "remainingSeats": 3,
                                    "fareBasis": "",
                                    "extendedFareCode": "IDNNM2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNB2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "4SrlRw44b28OFtmsiJAXiA00D",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 332,
                "tax": 25.27,
                "total": 357.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        }
    ];
    let mockSelectedOffers = [
        {
            "offerId": "IBbbceef980c7f46eda8445d338c89f36eOP",
            "offerItems": [
                {
                    "offerItemId": "IBbbceef980c7f46eda8445d338c89f36eOP_01",
                    "price": {
                        "fare": 222,
                        "tax": 25.27,
                        "total": 247.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 131,
                        "tax": 6.89,
                        "total": 137.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNB2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "4SrlRw44b28OFtmsiJAXiA004",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 222,
                "tax": 25.27,
                "total": 247.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB7dcd29adec984c89bedada4740ddf127OP",
            "offerItems": [
                {
                    "offerItemId": "IB7dcd29adec984c89bedada4740ddf127OP_01",
                    "price": {
                        "fare": 612,
                        "tax": 25.27,
                        "total": 637.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 521,
                        "tax": 6.89,
                        "total": 527.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 521,
                        "tax": 6.89,
                        "total": 527.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 521,
                        "tax": 6.89,
                        "total": 527.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 2,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "BFLROES",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "C",
                                    "remainingSeats": 2,
                                    "fareBasis": "",
                                    "extendedFareCode": "CDNNY2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "XAqEBF66bjTLhjSMWW1grV003",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 612,
                "tax": 25.27,
                "total": 637.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IBb67b5eaa40e94517a38a0f27b01325d8OP",
            "offerItems": [
                {
                    "offerItemId": "IBb67b5eaa40e94517a38a0f27b01325d8OP_01",
                    "price": {
                        "fare": 427,
                        "tax": 25.27,
                        "total": 452.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 336,
                        "tax": 6.89,
                        "total": 342.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 336,
                        "tax": 6.89,
                        "total": 342.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 336,
                        "tax": 6.89,
                        "total": 342.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "1",
                            "remainingSeats": 2,
                            "segments": [
                                {
                                    "segmentId": "IB384120221027",
                                    "fareFamily": "BFLROES",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "I",
                                    "remainingSeats": 2,
                                    "fareBasis": "",
                                    "extendedFareCode": "IDNNY2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "XAqEBF66bjTLhjSMWW1grV001",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 427,
                "tax": 25.27,
                "total": 452.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB5d1430f9547e457888fbdefa1f65a957OP",
            "offerItems": [
                {
                    "offerItemId": "IB5d1430f9547e457888fbdefa1f65a957OP_01",
                    "price": {
                        "fare": 582,
                        "tax": 25.27,
                        "total": 607.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 491,
                        "tax": 6.89,
                        "total": 497.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 491,
                        "tax": 6.89,
                        "total": 497.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 491,
                        "tax": 6.89,
                        "total": 497.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 2,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "BUSCOMMH",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "C",
                                    "remainingSeats": 2,
                                    "fareBasis": "",
                                    "extendedFareCode": "CDNNU2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "QodAB3JHBE8T5aNkwxuUy9003",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 582,
                "tax": 25.27,
                "total": 607.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB6ba3b1bfabe845079e639ad9318f7900OP",
            "offerItems": [
                {
                    "offerItemId": "IB6ba3b1bfabe845079e639ad9318f7900OP_01",
                    "price": {
                        "fare": 283,
                        "tax": 25.27,
                        "total": 308.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 192,
                        "tax": 6.89,
                        "total": 198.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 192,
                        "tax": 6.89,
                        "total": 198.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 192,
                        "tax": 6.89,
                        "total": 198.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "1",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384120221027",
                                    "fareFamily": "TFLESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "A",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "AONNY3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "NOBk0NTDV79S6qlJs0GClE001",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 283,
                "tax": 25.27,
                "total": 308.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IBa904a7495b644c1e8ecb1525e4955569OP",
            "offerItems": [
                {
                    "offerItemId": "IBa904a7495b644c1e8ecb1525e4955569OP_01",
                    "price": {
                        "fare": 562,
                        "tax": 25.27,
                        "total": 587.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 471,
                        "tax": 6.89,
                        "total": 477.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 471,
                        "tax": 6.89,
                        "total": 477.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 471,
                        "tax": 6.89,
                        "total": 477.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 2,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "BUSOPTMH",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "C",
                                    "remainingSeats": 2,
                                    "fareBasis": "",
                                    "extendedFareCode": "CDNNM2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "0t6gFZVfGH8SLGFozpb3ON003",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 562,
                "tax": 25.27,
                "total": 587.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB090c48a3d8a64bf2a598722433f05830OP",
            "offerItems": [
                {
                    "offerItemId": "IB090c48a3d8a64bf2a598722433f05830OP_01",
                    "price": {
                        "fare": 380,
                        "tax": 25.27,
                        "total": 405.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 289,
                        "tax": 6.89,
                        "total": 295.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 289,
                        "tax": 6.89,
                        "total": 295.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 289,
                        "tax": 6.89,
                        "total": 295.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TFLESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNY2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "NOBk0NTDV79S6qlJs0GClE003",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 380,
                "tax": 25.27,
                "total": 405.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB9ea893669d454c76a1a81365b4ebfba0OP",
            "offerItems": [
                {
                    "offerItemId": "IB9ea893669d454c76a1a81365b4ebfba0OP_01",
                    "price": {
                        "fare": 144,
                        "tax": 25.27,
                        "total": 169.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 53,
                        "tax": 6.89,
                        "total": 59.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 53,
                        "tax": 6.89,
                        "total": 59.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 53,
                        "tax": 6.89,
                        "total": 59.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "1",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384120221027",
                                    "fareFamily": "TCLESES",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "A",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "AONNM3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "SyOtVqjvEO3UzKUkdGbpQ7001",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 144,
                "tax": 25.27,
                "total": 169.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB43f752c6d6964fda9e565b2773823e63OP",
            "offerItems": [
                {
                    "offerItemId": "IB43f752c6d6964fda9e565b2773823e63OP_01",
                    "price": {
                        "fare": 347,
                        "tax": 25.27,
                        "total": 372.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 256,
                        "tax": 6.89,
                        "total": 262.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 256,
                        "tax": 6.89,
                        "total": 262.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 256,
                        "tax": 6.89,
                        "total": 262.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "1",
                            "remainingSeats": 2,
                            "segments": [
                                {
                                    "segmentId": "IB384120221027",
                                    "fareFamily": "BUSCOMMH",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "I",
                                    "remainingSeats": 2,
                                    "fareBasis": "",
                                    "extendedFareCode": "IDNNU2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "QodAB3JHBE8T5aNkwxuUy9001",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 347,
                "tax": 25.27,
                "total": 372.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB9b1075dcd28c40b0923789857842dc1aOP",
            "offerItems": [
                {
                    "offerItemId": "IB9b1075dcd28c40b0923789857842dc1aOP_01",
                    "price": {
                        "fare": 292,
                        "tax": 25.27,
                        "total": 317.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 201,
                        "tax": 6.89,
                        "total": 207.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 201,
                        "tax": 6.89,
                        "total": 207.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 201,
                        "tax": 6.89,
                        "total": 207.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "1",
                            "remainingSeats": 2,
                            "segments": [
                                {
                                    "segmentId": "IB384120221027",
                                    "fareFamily": "BUSOPTMH",
                                    "bookingCode": null,
                                    "bookingClass": "BUSINESS",
                                    "rbd": "I",
                                    "remainingSeats": 2,
                                    "fareBasis": "",
                                    "extendedFareCode": "IDNNM2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "0t6gFZVfGH8SLGFozpb3ON001",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 292,
                "tax": 25.27,
                "total": 317.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IB800f08d6654b4ac1910420debae5ac61OP",
            "offerItems": [
                {
                    "offerItemId": "IB800f08d6654b4ac1910420debae5ac61OP_01",
                    "price": {
                        "fare": 254,
                        "tax": 25.27,
                        "total": 279.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 163,
                        "tax": 6.89,
                        "total": 169.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 163,
                        "tax": 6.89,
                        "total": 169.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 163,
                        "tax": 6.89,
                        "total": 169.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 6,
                            "segments": [
                                {
                                    "segmentId": "IB384320221027",
                                    "fareFamily": "TCLESES",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "S",
                                    "remainingSeats": 6,
                                    "fareBasis": "",
                                    "extendedFareCode": "SWNNM2",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "SyOtVqjvEO3UzKUkdGbpQ7003",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 254,
                "tax": 25.27,
                "total": 279.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        },
        {
            "offerId": "IBf897ecddaf234345a853ea47342961e7OP",
            "offerItems": [
                {
                    "offerItemId": "IBf897ecddaf234345a853ea47342961e7OP_01",
                    "price": {
                        "fare": 114,
                        "tax": 25.27,
                        "total": 139.27,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "passengerIds": [
                        "ADULT_01"
                    ],
                    "privateFareInformation": null,
                    "reshopDifferential": null,
                    "surcharges": null
                }
            ],
            "originDestinations": [
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 91,
                        "tax": 18.38,
                        "total": 109.38,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD1",
                    "applicableSlices": [
                        {
                            "sliceId": "2",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384220221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "N",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "NWNNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "priceDiscountApplied": false,
                    "totalPrice": {
                        "fare": 23,
                        "tax": 6.89,
                        "total": 29.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "adultPrice": {
                        "fare": 23,
                        "tax": 6.89,
                        "total": 29.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "perPassengerPrice": {
                        "fare": 23,
                        "tax": 6.89,
                        "total": 29.89,
                        "currency": "EUR",
                        "ticketingFee": 0
                    },
                    "originDestinationId": "OD2",
                    "applicableSlices": [
                        {
                            "sliceId": "1",
                            "remainingSeats": 9,
                            "segments": [
                                {
                                    "segmentId": "IB384120221027",
                                    "fareFamily": "TBAESEU",
                                    "bookingCode": null,
                                    "bookingClass": "ECONOMY",
                                    "rbd": "A",
                                    "remainingSeats": 9,
                                    "fareBasis": "",
                                    "extendedFareCode": "AONNB3",
                                    "brandCode": null,
                                    "checkedBaggageAllowanceKeys": [],
                                    "carryOnBaggageAllowanceKeys": [],
                                    "ticketDesignator": null,
                                    "seatDisplays": null,
                                    "cabinDescription": ""
                                }
                            ]
                        }
                    ]
                }
            ],
            "timeLimits": "2022-10-27T08:04:05.802",
            "paymentTimeLimit": null,
            "specialDiscountsApplied": [],
            "providerOfferId": "4SrlRw44b28OFtmsiJAXiA001",
            "privateFare": false,
            "offerType": "",
            "flightModificationOnDemand": false,
            "discountsApplied": null,
            "excludePenalties": false,
            "price": {
                "fare": 114,
                "tax": 25.27,
                "total": 139.27,
                "currency": "EUR",
                "ticketingFee": 0
            }
        }
    ];
    var fakeSce = {
        trustAsHtml: jasmine.createSpy('trustAsHtml').and.returnValue()
    };
    var fakeBookingAvailabilityConstants = {
        SLICK_STATUS: {
            LOADING: 'LOADING',
            NOT_AVAILABLE: 'NOT_AVAILABLE',
            AVAILABLE: 'AVAILABLE',
            DISABLED: 'DISABLED'
        }
    };
    var fakeBookingConstants = {
        SEARCH_FLIGHT_TYPE: {
            REDEMPTION: 'redemptionFlight',
            REDEMPTIONOB: 'redemptionOBFlight'
        }
    };
    var fakeBookingUtilService = {
        'getFormatedDate': jasmine.createSpy().and.callFake(function () {
            return { 'formatedDate': '10/10/2020', 'dateFormatByLanguage': '10/10/2020' }
        })
    };
    var fakeLodash = {
        cloneDeep: jasmine.createSpy().and.callFake(function (copy) {
            return copy;
        }),
        merge: jasmine.createSpy().and.callFake(function (copy) {
            return copy;
        })
    };
    beforeEach(function() {
        angular.mock.module('ib-booking-availability-module', 'LocalStorageModule','ib-commons-utils-module','ib-booking-filters-module', function($provide){
            $provide.value('$sce', fakeSce);
            $provide.value('BookingAvailabilityConstants', fakeBookingAvailabilityConstants);
            $provide.value('BookingAppConstants', fakeBookingConstants);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('lodash', fakeLodash);
        });
        inject(function (_IbBookingAvailabilityUtilsService_, $rootScope, _localStorageService_, $filter)  {
            IbBookingAvailabilityUtilsService = _IbBookingAvailabilityUtilsService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
        });
    });

    describe('When IbBookingAvailabilityUtilsService', function() {
        describe('and returnObservationsWithhtml  is called', function() {
            beforeEach(inject(function() {
            }));
            it(' transform return correctly info cabin', function(done)  {
                var response = IbBookingAvailabilityUtilsService.returnObservationsWithhtml(
                    mockFareFamily
                );
                expect(response.length).toEqual(responseFareFamily.length);
                done();
            });
        });
        describe('and getOriginDestinationLimitDates  is called', function() {
            beforeEach(inject(function() {
            }));
            it(' transform return correctly info cabin', function(done)  {
                localStorageService.set('commercialData', mockCommercialInfo);
                localStorageService.set('availabilityRequestData', mockAvailabilityRequestData);
                var response = IbBookingAvailabilityUtilsService.getOriginDestinationLimitDates(
                    0
                );
                expect(response.minDate).toBeDefined();
                done();
            });
        });
        describe('and moreThan2Hours  is called', function() {
            beforeEach(inject(function() {
            }));
            it(' transform return correctly info cabin', function(done)  {
                var response = IbBookingAvailabilityUtilsService.moreThan2Hours(
                    1000
                );
                expect(response).toEqual(true);
                done();
            });
        });
        describe('and generateSegmentWarningMessage  is called', function() {
            beforeEach(inject(function() {
            }));
            it(' transform return correctly info cabin', function(done)  {
                var response = IbBookingAvailabilityUtilsService.generateSegmentWarningMessage(
                    mockSegmentInfo,
                    null
                );
                expect(response.airportChange.isImportant).toEqual(responseReturnedWarnings.airportChange.isImportant);
                done();
            });
            it(' and there is overnight warning', function(done)  {
                var response = IbBookingAvailabilityUtilsService.generateSegmentWarningMessage(
                    mockSegmentInfoOverNight,
                    null
                );
                expect(response.airportChange.isImportant).toEqual(responseReturnedWarningsOverNight.airportChange.isImportant);
                done();
            });
            it(' and there is terminal change warning', function(done)  {
                var response = IbBookingAvailabilityUtilsService.generateSegmentWarningMessage(
                    mockSegmentInfoTerminalChange,
                    null
                );
                expect(response.airportChange.isImportant).toEqual(responseReturnedWarningsTerminal.airportChange.isImportant);
                done();
            });
            it(' and there is airport change warning', function(done)  {
                var response = IbBookingAvailabilityUtilsService.generateSegmentWarningMessage(
                    mockSegmentInfoAirportChange,
                    null
                );
                expect(response.airportChange.isImportant).toEqual(responseReturnedWarningsAirport.airportChange.isImportant);
                done();
            });
            it(' and there is long waiting change warning', function(done)  {
                var response = IbBookingAvailabilityUtilsService.generateSegmentWarningMessage(
                    mockSegmentInfoLongTime,
                    null
                );
                expect(response.airportChange.isImportant).toEqual(responseReturnedWarningsLongTime.airportChange.isImportant);
                done();
            });
        });
        describe('and slidesInfo  is called', function() {
            beforeEach(inject(function() {
            }));
            it(' transform return correctly info cabin', function(done)  {
                localStorageService.set('searchFlightType', 'availabilityFlight');
                var response = IbBookingAvailabilityUtilsService.slidesInfo(
                    mockCells
                );
                expect(response.length).toEqual(responseSlidesInfo.length);
                done();
            });
        });
        describe('and generateSlidesInfo  is called', function() {
            beforeEach(inject(function() {
            }));
            it(' transform return correctly info cabin', function(done)  {
                var response = IbBookingAvailabilityUtilsService.generateSlidesInfo(
                    '2021-08-19T00:00:00.000Z',
                    'LOADING',
                    0
                );
                expect(response.price).toEqual(0);
                done();
            });
        });
        describe('and isFareCompatible  is called', function() {
            beforeEach(inject(function() {
            }));
            it(' and return fare is compatible', function(done)  {
                var response = IbBookingAvailabilityUtilsService.isFareCompatible(
                    mockfareFamilyOffers,
                    mockSelectedOffers,
                );
                expect(response).toEqual(true);
                done();
            });
        });
    });
});