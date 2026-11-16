'use strict';
describe('IbFlexibilizationTransformer test', () => {
    var flowId= 'TWFuYWdlTXlCb29raW5nQElCNzVlNjIwNmU3ZTBhNGIzZTkxNDg4NWM4OWFiYWQxYTc%3D',
        slices=[
            {
                tripSliceId:'JFKMAD20210614170500',
                responseId:'Qm9va2luZ0BHVy0xNjIwNzQ0OTQ2MjA1LUdSVzVJ',
                offers:[
                    {
                        offerId:'IB51bca87bbdda493ab78c73572824ae8aOP'
                    }
                ]
            }
        ],
        allSlices=[
            {
                responseId:'Qm9va2luZ0BHVy0xNjIwNzQ0OTQ2MjA1LUdSVzVJ',
                sliceId:'JFKMAD20210614170501'
            }
        ],
        pnr = 'JEV5N',
        bookingInfo= {
            'flowId':'TWFuYWdlTXlCb29raW5nQElCNzVlNjIwNmU3ZTBhNGIzZTkxNDg4NWM4OWFiYWQxYTc%3D',
            'order':{
                'orderId':'Qm9va2luZ0BJQmI2YjZlM2JkYTM4NjRiNDhhMWY2NzExZmQwYzdhYjZkT1A%3D',
                'status':'ISSUED',
                'bookingReferences':[
                    {
                        'provider':'IB',
                        'reference':'JEV5N'
                    }
                ],
                'orderItems':[
                    {
                        'type':'flight',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_01',
                        'bookingReferences':[
                            {
                                'provider':'IB',
                                'reference':'JEV5N'
                            }
                        ],
                        'price':{
                            'fare':14,
                            'tax':214.04,
                            'total':228.04,
                            'currency':'EUR',
                            'ticketingFee':0
                        },
                        'sliceIds':['JFKMAD20210614170500'],
                        'passengerPrices':[
                            {
                                'fareCalculation':'NYC IB MAD M16.00NUC16.00END ROE1.00 XF JFK4.50',
                                'passengerId':'ADULT_01',
                                'price':{'fare':14,'tax':214.04,'total':228.04,'currency':'EUR','ticketingFee':0},
                                'segmentPrices':[
                                    {
                                        'price':null,
                                        'fareCode':'OHN0T4S5',
                                        'segmentsIds':['IB625020210614'],
                                        'ticketDesignator':'',
                                        'penalties':[]
                                    }
                                ],
                                'taxes':[
                                    {
                                        'code':'AY',
                                        'amount':4.72,
                                        'currency':'EUR',
                                        'description':'Tasa federal de seguridad de la aviación civil de pasajeros'
                                    },
                                    {
                                        'code':'YQ',
                                        'amount':189.44,
                                        'currency':'EUR',
                                        'description':'Cargos del operador'
                                    },
                                    {
                                        'code':'US',
                                        'amount':16.09,
                                        'currency':'EUR',
                                        'description':'Tasa de transporte. Llegada/Salida'
                                    },
                                    {
                                        'code':'XF',
                                        'amount':3.79,
                                        'currency':'EUR',
                                        'description':'Cargo por servicios a los pasajeros'
                                    }
                                ],
                                'orderItemPaymentInfos':[]
                            }
                        ]
                    },
                    {
                        'type':'upgradingBid',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_02',
                        'price':{'fare':700,'tax':0,'total':700,'currency':'EUR','ticketingFee':0},
                        'segmentId':'IB625020210614',
                        'cabin':{'type':'BUSINESS'}
                    },
                    {
                        'type':'seat',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_03',
                        'price':{'fare':0,'tax':0,'total':0,'currency':'EUR','ticketingFee':0},
                        'passengerId':'ADULT_01',
                        'row':'7',
                        'column':'J',
                        'segmentId':'IB625020210614',
                        'emd':'FREE',
                        'selected':true,
                        'orderItemPaymentInfos':[],
                        'features':[]
                    }
                ],
                'slices':[
                    {
                        'sliceId':'JFKMAD20210614170500',
                        'type':'REGULAR',
                        'departureDateTime':'2021-06-14 17:05',
                        'arrivalDateTime':'2021-06-15 06:30',
                        'duration':445,
                        'stopsNumber':0,
                        'detailedPrices':[{'fare':0,'currency':null,'passengerIds':['ADULT_01'],'segmentPrices':[]}],
                        'segments':[
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            },
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            }
                        ],
                        'overnight':true,
                        'passengerFlags':[
                            {
                                'passengerId':'ADULT_01',
                                'flags':[
                                    {'type':'FLIGHT_MODIFICATION','enabled':true},
                                    {'type':'FLIGHT_REFUND','enabled':false},
                                    {'type':'FREQUENT_FLYER_MODIFICATION','enabled':true},
                                    {'type':'SPECIAL_NEEDS_MODIFICATION','enabled':true},
                                    {'type':'CONTACT_DATA_MODIFICATION','enabled':true},
                                    {'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':true},
                                    {'type':'PASSENGER_NAME_CORRECTION','enabled':false},
                                    {'type':'ANCILLARIES','enabled':true},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}
                                ]
                            }
                        ]
                    },
                    {
                        'sliceId':'JFKMAD20210614170500',
                        'type':'REGULAR',
                        'departureDateTime':'2021-06-14 17:05',
                        'arrivalDateTime':'2021-06-15 06:30',
                        'duration':445,
                        'stopsNumber':0,
                        'detailedPrices':[{'fare':0,'currency':null,'passengerIds':['ADULT_01'],'segmentPrices':[]}],
                        'segments':[
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            },
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            }
                        ],
                        'overnight':true,
                        'passengerFlags':[
                            {
                                'passengerId':'ADULT_01',
                                'flags':[
                                    {'type':'FLIGHT_MODIFICATION','enabled':true},
                                    {'type':'FLIGHT_REFUND','enabled':false},
                                    {'type':'FREQUENT_FLYER_MODIFICATION','enabled':true},
                                    {'type':'SPECIAL_NEEDS_MODIFICATION','enabled':true},
                                    {'type':'CONTACT_DATA_MODIFICATION','enabled':true},
                                    {'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':true},
                                    {'type':'PASSENGER_NAME_CORRECTION','enabled':false},
                                    {'type':'ANCILLARIES','enabled':true},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}
                                ]
                            }
                        ],
                    }
                ],
                'price':{'fare':714,'tax':214.04,'total':928.04,'currency':'EUR','ticketingFee':0},
                'primaryContactInfo':{
                    'phone':'346545643433',
                    'email':'REVIEW@REVIEW.COM',
                    'phoneType':'MOBILE',
                    'confirmationMailOption':null
                },
                'optionalInformation':[],
                'cashAviosPossibilities':[],
                'specialDiscounts':[],
                'checkedBagAllowances':[{'type':'PIECE','segmentIds':['IB625020210614'],'totalQuantity':1}],
                'accrualQuote':{
                    'redemptionPoints':1792,
                    'qualificationPoints':90
                },
                'aviosRedeemed':null,
                'pointsRedeemed':null
            },
            'passengers':[
                {
                    'passengerType':'ADULT',
                    'personalInfo':{'name':'IBERIA','surname':'TESTUNOTESTDOS','birthDate':null},
                    'passengerId':'ADULT_01',
                    'contactInfo':{
                        'phone':'346545643433',
                        'email':'review@review.com',
                        'phoneType':'MOBILE',
                        'confirmationMailOption':null
                    },
                    'relatedPassengerId':'',
                    'ckiStatus':null,
                    'optionalInformation':[],
                    'residenceAccreditationStatus':null,
                    'resiberPassengerId':'1',
                    'securityInformation':{
                        'relatedContent':[
                            {
                                'key':'APIS_DOCUMENT_INFO',
                                'value':'Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online'
                            },
                            {
                                'key':'APIS_STATUS_INFO',
                                'value':'Completar'
                            }
                        ]
                    }
                }
            ],
            'tickets':[
                {
                    'ticketNumbers':['0752393628117'],
                    'type':'ET',
                    'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_01',
                    'passengerId':'ADULT_01',
                    'issueDateTime':'2021-04-09 13:57',
                    'fareCalculation':'NYC IB MAD M16.00NUC16.00END ROE1.00 XF JFK4.50',
                    'taxes':[
                        {'code':'AY','amount':4.72,'currency':'EUR','description':''},
                        {'code':'YQ','amount':189.44,'currency':'EUR','description':''},
                        {'code':'US','amount':16.09,'currency':'EUR','description':''},
                        {'code':'XF','amount':3.79,'currency':'EUR','description':''}
                    ],
                    'coupons':[
                        {
                            'arrival':'MAD',
                            'departure':'JFK',
                            'departureDate':'2021-06-14T17:05:00.000',
                            'status':'OPEN FOR USE',
                            'fareBasis':'OHN0T4S5',
                            'carrier':'IB',
                            'flightNumber':'6250',
                            'flightStatus':'OK',
                            'operatingCarrier':null,
                            'bookingCode':'U',
                            'designator':'',
                            'couponNumber':'1',
                            'remark':null,
                            'baggageDetail':{'freeAllowance':1,'quantityCode':'PC','unitQualifier':'PC'}
                        }
                    ],
                    'iataCode':'78496445',
                    'issueCity':'MAD',
                    'passengerType':'ADULT',
                    'paymentInfo':{'type':'CREDIT_CARD','amount':228.04},
                    'emdsList':[
                        {
                            'emdNumber':'0755569505005',
                            'issueDateTime':'2021-04-14T16:36:00.000',
                            'description':'IB 6250-14JUN21-JFKMAD-O-U',
                            'emdDefinition':'EMD-A (Associated)',
                            'mumberOfBooklets':'1',
                            'code':'J',
                            'tableName':'1001 (Document/ Message Name, coded)',
                            'couponsInfoEMDsWebResponse':[
                                {
                                    'couponNumberEMD':'1',
                                    'couponNumberTKT':'1',
                                    'documentNumber':'0752393628117',
                                    'serviceCode':'A0BJ',
                                    'serviceDescription':'UPGRADE TTOO',
                                    'associated':true,
                                    'status':'OPEN FOR USE',
                                    'dateOfService':'2021-06-14T17:05:00.000',
                                    'value':{'fare':700,'tax':null,'total':null,'currency':'EUR','ticketingFee':0}
                                }
                            ]
                        },
                        {
                            'emdNumber':'0755569505001',
                            'issueDateTime':'2021-04-14T11:46:00.000',
                            'description':'IB 6250-14JUN21-JFKMAD-O-U',
                            'emdDefinition':'EMD-A (Associated)',
                            'mumberOfBooklets':'1',
                            'code':'J',
                            'tableName':'1001 (Document/ Message Name, coded)',
                            'couponsInfoEMDsWebResponse':[
                                {
                                    'couponNumberEMD':'1',
                                    'couponNumberTKT':'1',
                                    'documentNumber':'0752393628117',
                                    'serviceCode':'A0BJ',
                                    'serviceDescription':'UPGRADE TTOO',
                                    'associated':false,
                                    'status':'VOID',
                                    'dateOfService':'2021-06-14T17:05:00.000',
                                    'value':{'fare':700,'tax':null,'total':null,'currency':'EUR','ticketingFee':0}
                                }
                            ]
                        }
                    ],
                    'creditCardFeePrice':null,
                    'taxedPrice':{'fare':14,'tax':214.04,'total':228.04,'currency':'EUR','ticketingFee':0}
                }
            ],
            'paymentItems':[
                {
                    'type':'IBERIA_PAY',
                    'tokenizedCardNumber':null,
                    'maskedCardNumber':null,
                    'authorization':'J05TT7',
                    'subtotal':228.04,
                    'totalFee':0,
                    'total':228.04,
                    'unityFee':0,
                    'currency':'EUR'
                }
            ],
            'contextMetadata':{
                'language':'es',
                'country':'ES',
                'currencies':[
                    {
                        'code':'EUR',
                        'description':'Euro',
                        'symbol':'€',
                        'alignment':'R',
                        'groupingSeparator':'.',
                        'decimalSeparator':'',
                        'decimals':2,
                        'recommendedDisplay':'symbol'
                    }
                ]
            },
            'fareFamilyConditions':[{'cabinType':'E','cabinDescription':'Turista','commercialCode':'AJBOPT','commercialName':'Óptima','commercialNameES':'Óptima','priority':0,'conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'1 pieza','units':1,'extendedInfo':{'title':'1 equipaje en bodega','message':'Incluido: 1 pieza','code':'CA_1_PIEZAS','conditionStatus':true}},{'code':'COMIDA','name':'Comida','text':'Incluido','units':null,'extendedInfo':{'title':'Comida incluida','message':'Incluido','code':'Comida_incluida','conditionStatus':true}},{'code':'ASIENTO','name':'Selección de asiento','text':'Gratuita desde 24 horas antes del vuelo. ','units':24,'extendedInfo':{'title':'Gratuita desde 24 horas antes del vuelo. ','message':'Gratuita desde 24 horas antes del vuelo. ','code':'CA_Asiento_Gratis_24_horas','conditionStatus':true}},{'code':'CAMBIO','name':'Cambios','text':'','units':null,'extendedInfo':{'title':null,'message':null,'code':null,'conditionStatus':true}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'No permitido','units':null,'extendedInfo':{'title':'Reembolso no permitido','message':'No permitido.','code':'CA_REEMBOLSO NO PERMITIDO','conditionStatus':false}},{'code':'TARJEMBANTIC','name':'Tarjeta de embarque anticipada','text':'No incluido','units':null,'extendedInfo':{'title':'No incluido','message':'No incluido','code':'CA_Tarjeta_embarque_anticipada_no_incluido','conditionStatus':false}},{'code':'EMBARQUE','name':'Prioridad de Embarque','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'CA_Embarque_NO_Prioritario','conditionStatus':false}},{'code':'AVIO','name':'AVIOS','text':'Si','units':null,'extendedInfo':{'title':'Avios incluido','message':'Si','code':'AVIOS incluido','conditionStatus':false}},{'code':'SALAVIP','name':'Acceso a salas VIP','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Acceso a salas VIP No permitido','conditionStatus':false}},{'code':'CABINA','name':'Cabina','text':'Turista','units':null,'extendedInfo':{'title':'','message':'Turista','code':'CA_Cabina_Turista','conditionStatus':false}},{'code':'CHECKINDESK','name':'Mostrador check-in exclusivo','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Chek-in_desk_ NO','conditionStatus':false}},{'code':'ASIENTOXL','name':'Selección de asiento XL','text':'De pago','units':null,'extendedInfo':{'title':'Seleccionable con coste','message':'De pago','code':'CA_Asiento_XL_Pago','conditionStatus':false}},{'code':'WIFI','name':'WiFi','text':'','units':null,'extendedInfo':{'title':null,'message':null,'code':null,'conditionStatus':true}},{'code':'FASTTRACK','name':'Fast Track','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Fast Track NO','conditionStatus':false}},{'code':'EQPPRIOR','name':'Entrega prioritaria equipaje','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Entrega_prioritaria_equipaje_ NO','conditionStatus':false}}],'conditionsPriority':['EQMANO','EQBODEGA','COMIDA','ASIENTO','CAMBIO','REEMBOLSO']}],'channel':'IBCOM','onHoldInformation':null,'relatedContent':[{'key':'ESTA_DOCUMENT_INFO','value':'Para los EE.UU. se requiere un sistema ESTA (Electronic System for Travel Authorization, Sistema Electrónico para la autorización de viajes) para todos los titulares de pasaportes que no sean estadounidenses que viajen en el Programa de exención de visado.Si todavía no lo has hecho, completa los detalles del ESTA para todos los pasajeros.<a href=\'https://esta.cbp.dhs.gov/?blank=true&AAA=true&market=ES&language=es\' target=\'_blank\'>Completar información del ESTA</a>'},{'key':'APIS_DOCUMENT_INFO','value':'Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online'}],
            'qualifiers':[],
            'reportingWeb':{'device':'DSRC','idColective':'','officeIata':'MADIB08AB','iata':'I','product':'1'},
            'flexibilizationCapabilitiesInformation':null,
            'genericDisruptionCapabilitiesInformation':null,
            'upgInformation':{'url':null,'flightsInformation':null,'bidable':false},
            'orderFlags':[
                {'type':'PRINT_ITINERARY','enabled':true},
                {'type':'ON_BUSINESS_MODIFICATION','enabled':true},
                {'type':'VOUCHER_REFUND','enabled':false},
                {'type':'CASH_REFUND','enabled':false},
                {'type':'ALLOWED_REFUND_CASH','enabled':false},
                {'type':'ALLOWED_REFUND_VOUCHER','enabled':false},
                {'type':'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE','enabled':false},
                {'type':'VOUCHER_REFUND_ON_DEMAND','enabled':false},
                {'type':'VOUCHER_REFUND_RESTRICTION','enabled':false},
                {'type':'ALLOWED_VOUCHER_COMPENSATION','enabled':true}
            ],
            'isAirShuttle':false,
            'isOnHold':false,
            'warnings':[
                {
                    'description':'JFKMAD20210614170500',
                    'code':'SSE_MMB_1001'
                }
            ]
        },
        bookingInfoSpecialDiscount= {
            'flowId':'TWFuYWdlTXlCb29raW5nQElCNzVlNjIwNmU3ZTBhNGIzZTkxNDg4NWM4OWFiYWQxYTc%3D',
            'order':{
                'orderId':'Qm9va2luZ0BJQmI2YjZlM2JkYTM4NjRiNDhhMWY2NzExZmQwYzdhYjZkT1A%3D',
                'status':'ISSUED',
                'bookingReferences':[
                    {
                        'provider':'IB',
                        'reference':'JEV5N'
                    }
                ],
                'orderItems':[
                    {
                        'type':'flight',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_01',
                        'bookingReferences':[
                            {
                                'provider':'IB',
                                'reference':'JEV5N'
                            }
                        ],
                        'price':{
                            'fare':14,
                            'tax':214.04,
                            'total':228.04,
                            'currency':'EUR',
                            'ticketingFee':0
                        },
                        'sliceIds':['JFKMAD20210614170500'],
                        'passengerPrices':[
                            {
                                'fareCalculation':'NYC IB MAD M16.00NUC16.00END ROE1.00 XF JFK4.50',
                                'passengerId':'ADULT_01',
                                'price':{'fare':14,'tax':214.04,'total':228.04,'currency':'EUR','ticketingFee':0},
                                'segmentPrices':[
                                    {
                                        'price':null,
                                        'fareCode':'OHN0T4S5',
                                        'segmentsIds':['IB625020210614'],
                                        'ticketDesignator':'',
                                        'penalties':[]
                                    }
                                ],
                                'taxes':[
                                    {
                                        'code':'AY',
                                        'amount':4.72,
                                        'currency':'EUR',
                                        'description':'Tasa federal de seguridad de la aviación civil de pasajeros'
                                    },
                                    {
                                        'code':'YQ',
                                        'amount':189.44,
                                        'currency':'EUR',
                                        'description':'Cargos del operador'
                                    },
                                    {
                                        'code':'US',
                                        'amount':16.09,
                                        'currency':'EUR',
                                        'description':'Tasa de transporte. Llegada/Salida'
                                    },
                                    {
                                        'code':'XF',
                                        'amount':3.79,
                                        'currency':'EUR',
                                        'description':'Cargo por servicios a los pasajeros'
                                    }
                                ],
                                'orderItemPaymentInfos':[]
                            }
                        ]
                    },
                    {
                        'type':'upgradingBid',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_02',
                        'price':{'fare':700,'tax':0,'total':700,'currency':'EUR','ticketingFee':0},
                        'segmentId':'IB625020210614',
                        'cabin':{'type':'BUSINESS'}
                    },
                    {
                        'type':'seat',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_03',
                        'price':{'fare':0,'tax':0,'total':0,'currency':'EUR','ticketingFee':0},
                        'passengerId':'ADULT_01',
                        'row':'7',
                        'column':'J',
                        'segmentId':'IB625020210614',
                        'emd':'FREE',
                        'selected':true,
                        'orderItemPaymentInfos':[],
                        'features':[]
                    }
                ],
                'slices':[
                    {
                        'sliceId':'JFKMAD20210614170500',
                        'type':'REGULAR',
                        'departureDateTime':'2021-06-14 17:05',
                        'arrivalDateTime':'2021-06-15 06:30',
                        'duration':445,
                        'stopsNumber':0,
                        'detailedPrices':[{'fare':0,'currency':null,'passengerIds':['ADULT_01'],'segmentPrices':[]}],
                        'segments':[
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            }
                        ],
                        'overnight':true,
                        'passengerFlags':[
                            {
                                'passengerId':'ADULT_01',
                                'flags':[
                                    {'type':'FLIGHT_MODIFICATION','enabled':true},
                                    {'type':'FLIGHT_REFUND','enabled':false},
                                    {'type':'FREQUENT_FLYER_MODIFICATION','enabled':true},
                                    {'type':'SPECIAL_NEEDS_MODIFICATION','enabled':true},
                                    {'type':'CONTACT_DATA_MODIFICATION','enabled':true},
                                    {'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':true},
                                    {'type':'PASSENGER_NAME_CORRECTION','enabled':false},
                                    {'type':'ANCILLARIES','enabled':true},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}
                                ]
                            }
                        ]
                    }
                ],
                'price':{'fare':714,'tax':214.04,'total':928.04,'currency':'EUR','ticketingFee':0},
                'primaryContactInfo':{
                    'phone':'346545643433',
                    'email':'REVIEW@REVIEW.COM',
                    'phoneType':'MOBILE',
                    'confirmationMailOption':null
                },
                'optionalInformation':[],
                'cashAviosPossibilities':[],
                'specialDiscounts':[
                    {
                        'type': 'RES',
                        'discountCode':'RM'
                    }
                ],
                'checkedBagAllowances':[{'type':'PIECE','segmentIds':['IB625020210614'],'totalQuantity':1}],
                'accrualQuote':{
                    'redemptionPoints':1792,
                    'qualificationPoints':90
                },
                'aviosRedeemed':null,
                'pointsRedeemed':null
            },
            'passengers':[
                {
                    'passengerType':'ADULT',
                    'personalInfo':{'name':'IBERIA','surname':'TESTUNOTESTDOS','birthDate':null},
                    'passengerId':'ADULT_01',
                    'contactInfo':{
                        'phone':'346545643433',
                        'email':'review@review.com',
                        'phoneType':'MOBILE',
                        'confirmationMailOption':null
                    },
                    'relatedPassengerId':'',
                    'ckiStatus':null,
                    'optionalInformation':[],
                    'residenceAccreditationStatus':null,
                    'resiberPassengerId':'1',
                    'securityInformation':{
                        'relatedContent':[
                            {
                                'key':'APIS_DOCUMENT_INFO',
                                'value':'Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online'
                            },
                            {
                                'key':'APIS_STATUS_INFO',
                                'value':'Completar'
                            }
                        ]
                    }
                }
            ],
            'tickets':[
                {
                    'ticketNumbers':['0752393628117'],
                    'type':'ET',
                    'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_01',
                    'passengerId':'ADULT_01',
                    'issueDateTime':'2021-04-09 13:57',
                    'fareCalculation':'NYC IB MAD M16.00NUC16.00END ROE1.00 XF JFK4.50',
                    'taxes':[
                        {'code':'AY','amount':4.72,'currency':'EUR','description':''},
                        {'code':'YQ','amount':189.44,'currency':'EUR','description':''},
                        {'code':'US','amount':16.09,'currency':'EUR','description':''},
                        {'code':'XF','amount':3.79,'currency':'EUR','description':''}
                    ],
                    'coupons':[
                        {
                            'arrival':'MAD',
                            'departure':'JFK',
                            'departureDate':'2021-06-14T17:05:00.000',
                            'status':'OPEN FOR USE',
                            'fareBasis':'OHN0T4S5',
                            'carrier':'IB',
                            'flightNumber':'6250',
                            'flightStatus':'OK',
                            'operatingCarrier':null,
                            'bookingCode':'U',
                            'designator':'',
                            'couponNumber':'1',
                            'remark':null,
                            'baggageDetail':{'freeAllowance':1,'quantityCode':'PC','unitQualifier':'PC'}
                        }
                    ],
                    'iataCode':'78496445',
                    'issueCity':'MAD',
                    'passengerType':'ADULT',
                    'paymentInfo':{'type':'CREDIT_CARD','amount':228.04},
                    'emdsList':[
                        {
                            'emdNumber':'0755569505005',
                            'issueDateTime':'2021-04-14T16:36:00.000',
                            'description':'IB 6250-14JUN21-JFKMAD-O-U',
                            'emdDefinition':'EMD-A (Associated)',
                            'mumberOfBooklets':'1',
                            'code':'J',
                            'tableName':'1001 (Document/ Message Name, coded)',
                            'couponsInfoEMDsWebResponse':[
                                {
                                    'couponNumberEMD':'1',
                                    'couponNumberTKT':'1',
                                    'documentNumber':'0752393628117',
                                    'serviceCode':'A0BJ',
                                    'serviceDescription':'UPGRADE TTOO',
                                    'associated':true,
                                    'status':'OPEN FOR USE',
                                    'dateOfService':'2021-06-14T17:05:00.000',
                                    'value':{'fare':700,'tax':null,'total':null,'currency':'EUR','ticketingFee':0}
                                }
                            ]
                        },
                        {
                            'emdNumber':'0755569505001',
                            'issueDateTime':'2021-04-14T11:46:00.000',
                            'description':'IB 6250-14JUN21-JFKMAD-O-U',
                            'emdDefinition':'EMD-A (Associated)',
                            'mumberOfBooklets':'1',
                            'code':'J',
                            'tableName':'1001 (Document/ Message Name, coded)',
                            'couponsInfoEMDsWebResponse':[
                                {
                                    'couponNumberEMD':'1',
                                    'couponNumberTKT':'1',
                                    'documentNumber':'0752393628117',
                                    'serviceCode':'A0BJ',
                                    'serviceDescription':'UPGRADE TTOO',
                                    'associated':false,
                                    'status':'VOID',
                                    'dateOfService':'2021-06-14T17:05:00.000',
                                    'value':{'fare':700,'tax':null,'total':null,'currency':'EUR','ticketingFee':0}
                                }
                            ]
                        }
                    ],
                    'creditCardFeePrice':null,
                    'taxedPrice':{'fare':14,'tax':214.04,'total':228.04,'currency':'EUR','ticketingFee':0}
                }
            ],
            'paymentItems':[
                {
                    'type':'IBERIA_PAY',
                    'tokenizedCardNumber':null,
                    'maskedCardNumber':null,
                    'authorization':'J05TT7',
                    'subtotal':228.04,
                    'totalFee':0,
                    'total':228.04,
                    'unityFee':0,
                    'currency':'EUR'
                }
            ],
            'contextMetadata':{
                'language':'es',
                'country':'ES',
                'currencies':[
                    {
                        'code':'EUR',
                        'description':'Euro',
                        'symbol':'€',
                        'alignment':'R',
                        'groupingSeparator':'.',
                        'decimalSeparator':'',
                        'decimals':2,
                        'recommendedDisplay':'symbol'
                    }
                ]
            },
            'fareFamilyConditions':[{'cabinType':'E','cabinDescription':'Turista','commercialCode':'AJBOPT','commercialName':'Óptima','commercialNameES':'Óptima','priority':0,'conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'1 pieza','units':1,'extendedInfo':{'title':'1 equipaje en bodega','message':'Incluido: 1 pieza','code':'CA_1_PIEZAS','conditionStatus':true}},{'code':'COMIDA','name':'Comida','text':'Incluido','units':null,'extendedInfo':{'title':'Comida incluida','message':'Incluido','code':'Comida_incluida','conditionStatus':true}},{'code':'ASIENTO','name':'Selección de asiento','text':'Gratuita desde 24 horas antes del vuelo. ','units':24,'extendedInfo':{'title':'Gratuita desde 24 horas antes del vuelo. ','message':'Gratuita desde 24 horas antes del vuelo. ','code':'CA_Asiento_Gratis_24_horas','conditionStatus':true}},{'code':'CAMBIO','name':'Cambios','text':'','units':null,'extendedInfo':{'title':null,'message':null,'code':null,'conditionStatus':true}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'No permitido','units':null,'extendedInfo':{'title':'Reembolso no permitido','message':'No permitido.','code':'CA_REEMBOLSO NO PERMITIDO','conditionStatus':false}},{'code':'TARJEMBANTIC','name':'Tarjeta de embarque anticipada','text':'No incluido','units':null,'extendedInfo':{'title':'No incluido','message':'No incluido','code':'CA_Tarjeta_embarque_anticipada_no_incluido','conditionStatus':false}},{'code':'EMBARQUE','name':'Prioridad de Embarque','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'CA_Embarque_NO_Prioritario','conditionStatus':false}},{'code':'AVIO','name':'AVIOS','text':'Si','units':null,'extendedInfo':{'title':'Avios incluido','message':'Si','code':'AVIOS incluido','conditionStatus':false}},{'code':'SALAVIP','name':'Acceso a salas VIP','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Acceso a salas VIP No permitido','conditionStatus':false}},{'code':'CABINA','name':'Cabina','text':'Turista','units':null,'extendedInfo':{'title':'','message':'Turista','code':'CA_Cabina_Turista','conditionStatus':false}},{'code':'CHECKINDESK','name':'Mostrador check-in exclusivo','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Chek-in_desk_ NO','conditionStatus':false}},{'code':'ASIENTOXL','name':'Selección de asiento XL','text':'De pago','units':null,'extendedInfo':{'title':'Seleccionable con coste','message':'De pago','code':'CA_Asiento_XL_Pago','conditionStatus':false}},{'code':'WIFI','name':'WiFi','text':'','units':null,'extendedInfo':{'title':null,'message':null,'code':null,'conditionStatus':true}},{'code':'FASTTRACK','name':'Fast Track','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Fast Track NO','conditionStatus':false}},{'code':'EQPPRIOR','name':'Entrega prioritaria equipaje','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Entrega_prioritaria_equipaje_ NO','conditionStatus':false}}],'conditionsPriority':['EQMANO','EQBODEGA','COMIDA','ASIENTO','CAMBIO','REEMBOLSO']}],'channel':'IBCOM','onHoldInformation':null,'relatedContent':[{'key':'ESTA_DOCUMENT_INFO','value':'Para los EE.UU. se requiere un sistema ESTA (Electronic System for Travel Authorization, Sistema Electrónico para la autorización de viajes) para todos los titulares de pasaportes que no sean estadounidenses que viajen en el Programa de exención de visado.Si todavía no lo has hecho, completa los detalles del ESTA para todos los pasajeros.<a href=\'https://esta.cbp.dhs.gov/?blank=true&AAA=true&market=ES&language=es\' target=\'_blank\'>Completar información del ESTA</a>'},{'key':'APIS_DOCUMENT_INFO','value':'Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online'}],
            'qualifiers':[],
            'reportingWeb':{'device':'DSRC','idColective':'','officeIata':'MADIB08AB','iata':'I','product':'1'},
            'flexibilizationCapabilitiesInformation':null,
            'genericDisruptionCapabilitiesInformation':null,
            'upgInformation':{'url':null,'flightsInformation':null,'bidable':false},
            'orderFlags':[
                {'type':'PRINT_ITINERARY','enabled':true},
                {'type':'ON_BUSINESS_MODIFICATION','enabled':true},
                {'type':'VOUCHER_REFUND','enabled':false},
                {'type':'CASH_REFUND','enabled':false},
                {'type':'ALLOWED_REFUND_CASH','enabled':false},
                {'type':'ALLOWED_REFUND_VOUCHER','enabled':false},
                {'type':'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE','enabled':false},
                {'type':'VOUCHER_REFUND_ON_DEMAND','enabled':false},
                {'type':'VOUCHER_REFUND_RESTRICTION','enabled':false},
                {'type':'ALLOWED_VOUCHER_COMPENSATION','enabled':true}
            ],
            'isAirShuttle':false,
            'isOnHold':false,
        },
        bookingInfoMultipleSlices= {
            'flowId':'TWFuYWdlTXlCb29raW5nQElCNzVlNjIwNmU3ZTBhNGIzZTkxNDg4NWM4OWFiYWQxYTc%3D',
            'order':{
                'orderId':'Qm9va2luZ0BJQmI2YjZlM2JkYTM4NjRiNDhhMWY2NzExZmQwYzdhYjZkT1A%3D',
                'status':'ISSUED',
                'bookingReferences':[
                    {
                        'provider':'IB',
                        'reference':'JEV5N'
                    }
                ],
                'orderItems':[
                    {
                        'type':'flight',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_01',
                        'bookingReferences':[
                            {
                                'provider':'IB',
                                'reference':'JEV5N'
                            }
                        ],
                        'price':{
                            'fare':14,
                            'tax':214.04,
                            'total':228.04,
                            'currency':'EUR',
                            'ticketingFee':0
                        },
                        'sliceIds':['JFKMAD20210614170500'],
                        'passengerPrices':[
                            {
                                'fareCalculation':'NYC IB MAD M16.00NUC16.00END ROE1.00 XF JFK4.50',
                                'passengerId':'ADULT_01',
                                'price':{'fare':14,'tax':214.04,'total':228.04,'currency':'EUR','ticketingFee':0},
                                'segmentPrices':[
                                    {
                                        'price':null,
                                        'fareCode':'OHN0T4S5',
                                        'segmentsIds':['IB625020210614'],
                                        'ticketDesignator':'',
                                        'penalties':[]
                                    }
                                ],
                                'taxes':[
                                    {
                                        'code':'AY',
                                        'amount':4.72,
                                        'currency':'EUR',
                                        'description':'Tasa federal de seguridad de la aviación civil de pasajeros'
                                    },
                                    {
                                        'code':'YQ',
                                        'amount':189.44,
                                        'currency':'EUR',
                                        'description':'Cargos del operador'
                                    },
                                    {
                                        'code':'US',
                                        'amount':16.09,
                                        'currency':'EUR',
                                        'description':'Tasa de transporte. Llegada/Salida'
                                    },
                                    {
                                        'code':'XF',
                                        'amount':3.79,
                                        'currency':'EUR',
                                        'description':'Cargo por servicios a los pasajeros'
                                    }
                                ],
                                'orderItemPaymentInfos':[]
                            }
                        ]
                    },
                    {
                        'type':'upgradingBid',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_02',
                        'price':{'fare':700,'tax':0,'total':700,'currency':'EUR','ticketingFee':0},
                        'segmentId':'IB625020210614',
                        'cabin':{'type':'BUSINESS'}
                    },
                    {
                        'type':'seat',
                        'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_03',
                        'price':{'fare':0,'tax':0,'total':0,'currency':'EUR','ticketingFee':0},
                        'passengerId':'ADULT_01',
                        'row':'7',
                        'column':'J',
                        'segmentId':'IB625020210614',
                        'emd':'FREE',
                        'selected':true,
                        'orderItemPaymentInfos':[],
                        'features':[]
                    }
                ],
                'slices':[
                    {
                        'sliceId':'JFKMAD20210614170500',
                        'type':'REGULAR',
                        'departureDateTime':'2021-06-14 17:05',
                        'arrivalDateTime':'2021-06-15 06:30',
                        'duration':445,
                        'stopsNumber':0,
                        'detailedPrices':[{'fare':0,'currency':null,'passengerIds':['ADULT_01'],'segmentPrices':[]}],
                        'segments':[
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            },
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            }
                        ],
                        'overnight':true,
                        'passengerFlags':[
                            {
                                'passengerId':'ADULT_01',
                                'flags':[
                                    {'type':'FLIGHT_MODIFICATION','enabled':true},
                                    {'type':'FLIGHT_REFUND','enabled':false},
                                    {'type':'FREQUENT_FLYER_MODIFICATION','enabled':true},
                                    {'type':'SPECIAL_NEEDS_MODIFICATION','enabled':true},
                                    {'type':'CONTACT_DATA_MODIFICATION','enabled':true},
                                    {'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':true},
                                    {'type':'PASSENGER_NAME_CORRECTION','enabled':false},
                                    {'type':'ANCILLARIES','enabled':true},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}
                                ]
                            }
                        ]
                    },
                    {
                        'sliceId':'JFKMAD20210614170500',
                        'type':'REGULAR',
                        'departureDateTime':'2021-06-14 17:05',
                        'arrivalDateTime':'2021-06-15 06:30',
                        'duration':445,
                        'stopsNumber':0,
                        'detailedPrices':[{'fare':0,'currency':null,'passengerIds':['ADULT_01'],'segmentPrices':[]}],
                        'segments':[
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            },
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            }
                        ],
                        'overnight':true,
                        'passengerFlags':[
                            {
                                'passengerId':'ADULT_01',
                                'flags':[
                                    {'type':'FLIGHT_MODIFICATION','enabled':true},
                                    {'type':'FLIGHT_REFUND','enabled':false},
                                    {'type':'FREQUENT_FLYER_MODIFICATION','enabled':true},
                                    {'type':'SPECIAL_NEEDS_MODIFICATION','enabled':true},
                                    {'type':'CONTACT_DATA_MODIFICATION','enabled':true},
                                    {'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':true},
                                    {'type':'PASSENGER_NAME_CORRECTION','enabled':false},
                                    {'type':'ANCILLARIES','enabled':true},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}
                                ]
                            }
                        ]
                    },
                    {
                        'sliceId':'JFKMAD20210614170501',
                        'type':'REGULAR',
                        'departureDateTime':'2021-06-14 17:05',
                        'arrivalDateTime':'2021-06-15 06:30',
                        'duration':445,
                        'stopsNumber':0,
                        'detailedPrices':[{'fare':0,'currency':null,'passengerIds':['ADULT_01'],'segmentPrices':[]}],
                        'segments':[
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            },
                            {
                                'type':'CONFIRMED',
                                'mmbAllowed':true,
                                'ckiStatus':{'code':'CHECKABLE','message':null},
                                'noShow':false,
                                'flyNow':false,
                                'flown':false,
                                'departure':{
                                    'code':'JFK',
                                    'name':'JOHN F KENNEDY INTL',
                                    'terminal':'7',
                                    'city':{
                                        'code':'NYC',
                                        'description':'Nueva York',
                                        'countryCode':'US',
                                        'country':{'code':'US','description':'USA'}
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'BARAJAS',
                                    'terminal':'4S',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{'code':'ES','description':'España'}
                                    }
                                },
                                'departureCity':{'code':'NYC','description':'Nueva York','countryCode':'US','timeZone':'US/Eastern'},
                                'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},
                                'flight':{
                                    'marketingCarrier':{'code':'IB','name':'Iberia'},
                                    'operationalCarrier':{'code':'IB','name':'Iberia'},
                                    'marketingFlightNumber':'6250',
                                    'operationalFlightNumber':'6250',
                                    'operationalDisclosure':'IB',
                                    'aircraft':{'code':'330','description':'Airbus A330'}
                                },
                                'cabin':{
                                    'rbd':'U',
                                    'description':'',
                                    'remainingSeats':0,
                                    'fareFamily':'AJBOPT',
                                    'code':'B',
                                    'type':'BUSINESS',
                                    'bookingClass':'BUSINESS'
                                },
                                'overnight':true,
                                'id':'IB625020210614',
                                'duration':445,
                                'waitingTime':0,
                                'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],
                                'operatorLocator':null,
                                'stop':null,
                                'departureDateTime':'2021-06-14 17:05',
                                'departureUtcDateTime':'2021-06-14T21:05:00.000',
                                'arrivalDateTime':'2021-06-15 06:30',
                                'arrivalUtcDateTime':'2021-06-15T04:30:00.000',
                                'status':{'code':'HK','description':'Confirmado'}
                            }
                        ],
                        'overnight':true,
                        'passengerFlags':[
                            {
                                'passengerId':'ADULT_01',
                                'flags':[
                                    {'type':'FLIGHT_MODIFICATION','enabled':true},
                                    {'type':'FLIGHT_REFUND','enabled':false},
                                    {'type':'FREQUENT_FLYER_MODIFICATION','enabled':true},
                                    {'type':'SPECIAL_NEEDS_MODIFICATION','enabled':true},
                                    {'type':'CONTACT_DATA_MODIFICATION','enabled':true},
                                    {'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':true},
                                    {'type':'PASSENGER_NAME_CORRECTION','enabled':false},
                                    {'type':'ANCILLARIES','enabled':true},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},
                                    {'type':'FLIGHT_DISRUPTION_SEARCH','enabled':false},
                                    {'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}
                                ]
                            }
                        ]
                    }
                ],
                'price':{'fare':714,'tax':214.04,'total':928.04,'currency':'EUR','ticketingFee':0},
                'primaryContactInfo':{
                    'phone':'346545643433',
                    'email':'REVIEW@REVIEW.COM',
                    'phoneType':'MOBILE',
                    'confirmationMailOption':null
                },
                'optionalInformation':[],
                'cashAviosPossibilities':[],
                'specialDiscounts':[],
                'checkedBagAllowances':[{'type':'PIECE','segmentIds':['IB625020210614'],'totalQuantity':1}],
                'accrualQuote':{
                    'redemptionPoints':1792,
                    'qualificationPoints':90
                },
                'aviosRedeemed':null,
                'pointsRedeemed':null
            },
            'passengers':[
                {
                    'passengerType':'ADULT',
                    'personalInfo':{'name':'IBERIA','surname':'TESTUNOTESTDOS','birthDate':null},
                    'passengerId':'ADULT_01',
                    'contactInfo':{
                        'phone':'346545643433',
                        'email':'review@review.com',
                        'phoneType':'MOBILE',
                        'confirmationMailOption':null
                    },
                    'relatedPassengerId':'',
                    'ckiStatus':null,
                    'optionalInformation':[],
                    'residenceAccreditationStatus':null,
                    'resiberPassengerId':'1',
                    'securityInformation':{
                        'relatedContent':[
                            {
                                'key':'APIS_DOCUMENT_INFO',
                                'value':'Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online'
                            },
                            {
                                'key':'APIS_STATUS_INFO',
                                'value':'Completar'
                            }
                        ]
                    }
                }
            ],
            'tickets':[
                {
                    'ticketNumbers':['0752393628117'],
                    'type':'ET',
                    'orderItemId':'IBb6b6e3bda3864b48a1f6711fd0c7ab6dOP_01',
                    'passengerId':'ADULT_01',
                    'issueDateTime':'2021-04-09 13:57',
                    'fareCalculation':'NYC IB MAD M16.00NUC16.00END ROE1.00 XF JFK4.50',
                    'taxes':[
                        {'code':'AY','amount':4.72,'currency':'EUR','description':''},
                        {'code':'YQ','amount':189.44,'currency':'EUR','description':''},
                        {'code':'US','amount':16.09,'currency':'EUR','description':''},
                        {'code':'XF','amount':3.79,'currency':'EUR','description':''}
                    ],
                    'coupons':[
                        {
                            'arrival':'MAD',
                            'departure':'JFK',
                            'departureDate':'2021-06-14T17:05:00.000',
                            'status':'OPEN FOR USE',
                            'fareBasis':'OHN0T4S5',
                            'carrier':'IB',
                            'flightNumber':'6250',
                            'flightStatus':'OK',
                            'operatingCarrier':null,
                            'bookingCode':'U',
                            'designator':'',
                            'couponNumber':'1',
                            'remark':null,
                            'baggageDetail':{'freeAllowance':1,'quantityCode':'PC','unitQualifier':'PC'}
                        }
                    ],
                    'iataCode':'78496445',
                    'issueCity':'MAD',
                    'passengerType':'ADULT',
                    'paymentInfo':{'type':'CREDIT_CARD','amount':228.04},
                    'emdsList':[
                        {
                            'emdNumber':'0755569505005',
                            'issueDateTime':'2021-04-14T16:36:00.000',
                            'description':'IB 6250-14JUN21-JFKMAD-O-U',
                            'emdDefinition':'EMD-A (Associated)',
                            'mumberOfBooklets':'1',
                            'code':'J',
                            'tableName':'1001 (Document/ Message Name, coded)',
                            'couponsInfoEMDsWebResponse':[
                                {
                                    'couponNumberEMD':'1',
                                    'couponNumberTKT':'1',
                                    'documentNumber':'0752393628117',
                                    'serviceCode':'A0BJ',
                                    'serviceDescription':'UPGRADE TTOO',
                                    'associated':true,
                                    'status':'OPEN FOR USE',
                                    'dateOfService':'2021-06-14T17:05:00.000',
                                    'value':{'fare':700,'tax':null,'total':null,'currency':'EUR','ticketingFee':0}
                                }
                            ]
                        },
                        {
                            'emdNumber':'0755569505001',
                            'issueDateTime':'2021-04-14T11:46:00.000',
                            'description':'IB 6250-14JUN21-JFKMAD-O-U',
                            'emdDefinition':'EMD-A (Associated)',
                            'mumberOfBooklets':'1',
                            'code':'J',
                            'tableName':'1001 (Document/ Message Name, coded)',
                            'couponsInfoEMDsWebResponse':[
                                {
                                    'couponNumberEMD':'1',
                                    'couponNumberTKT':'1',
                                    'documentNumber':'0752393628117',
                                    'serviceCode':'A0BJ',
                                    'serviceDescription':'UPGRADE TTOO',
                                    'associated':false,
                                    'status':'VOID',
                                    'dateOfService':'2021-06-14T17:05:00.000',
                                    'value':{'fare':700,'tax':null,'total':null,'currency':'EUR','ticketingFee':0}
                                }
                            ]
                        }
                    ],
                    'creditCardFeePrice':null,
                    'taxedPrice':{'fare':14,'tax':214.04,'total':228.04,'currency':'EUR','ticketingFee':0}
                }
            ],
            'paymentItems':[
                {
                    'type':'IBERIA_PAY',
                    'tokenizedCardNumber':null,
                    'maskedCardNumber':null,
                    'authorization':'J05TT7',
                    'subtotal':228.04,
                    'totalFee':0,
                    'total':228.04,
                    'unityFee':0,
                    'currency':'EUR'
                }
            ],
            'contextMetadata':{
                'language':'es',
                'country':'ES',
                'currencies':[
                    {
                        'code':'EUR',
                        'description':'Euro',
                        'symbol':'€',
                        'alignment':'R',
                        'groupingSeparator':'.',
                        'decimalSeparator':'',
                        'decimals':2,
                        'recommendedDisplay':'symbol'
                    }
                ]
            },
            'fareFamilyConditions':[{'cabinType':'E','cabinDescription':'Turista','commercialCode':'AJBOPT','commercialName':'Óptima','commercialNameES':'Óptima','priority':0,'conditions':[{'code':'EQMANO','name':'Equipaje de mano','text':'1 bulto (56x40x25cm)','units':1,'extendedInfo':{'title':'1 bulto en cabina  (56x40x25cm)','message':'1 bulto (56x40x25cm)','code':'CA_EQP_MANO_10KG','conditionStatus':true}},{'code':'EQBODEGA','name':'Equipaje en bodega','text':'1 pieza','units':1,'extendedInfo':{'title':'1 equipaje en bodega','message':'Incluido: 1 pieza','code':'CA_1_PIEZAS','conditionStatus':true}},{'code':'COMIDA','name':'Comida','text':'Incluido','units':null,'extendedInfo':{'title':'Comida incluida','message':'Incluido','code':'Comida_incluida','conditionStatus':true}},{'code':'ASIENTO','name':'Selección de asiento','text':'Gratuita desde 24 horas antes del vuelo. ','units':24,'extendedInfo':{'title':'Gratuita desde 24 horas antes del vuelo. ','message':'Gratuita desde 24 horas antes del vuelo. ','code':'CA_Asiento_Gratis_24_horas','conditionStatus':true}},{'code':'CAMBIO','name':'Cambios','text':'','units':null,'extendedInfo':{'title':null,'message':null,'code':null,'conditionStatus':true}},{'code':'REEMBOLSO','name':'Reembolso (por sentido)','text':'No permitido','units':null,'extendedInfo':{'title':'Reembolso no permitido','message':'No permitido.','code':'CA_REEMBOLSO NO PERMITIDO','conditionStatus':false}},{'code':'TARJEMBANTIC','name':'Tarjeta de embarque anticipada','text':'No incluido','units':null,'extendedInfo':{'title':'No incluido','message':'No incluido','code':'CA_Tarjeta_embarque_anticipada_no_incluido','conditionStatus':false}},{'code':'EMBARQUE','name':'Prioridad de Embarque','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'CA_Embarque_NO_Prioritario','conditionStatus':false}},{'code':'AVIO','name':'AVIOS','text':'Si','units':null,'extendedInfo':{'title':'Avios incluido','message':'Si','code':'AVIOS incluido','conditionStatus':false}},{'code':'SALAVIP','name':'Acceso a salas VIP','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Acceso a salas VIP No permitido','conditionStatus':false}},{'code':'CABINA','name':'Cabina','text':'Turista','units':null,'extendedInfo':{'title':'','message':'Turista','code':'CA_Cabina_Turista','conditionStatus':false}},{'code':'CHECKINDESK','name':'Mostrador check-in exclusivo','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Chek-in_desk_ NO','conditionStatus':false}},{'code':'ASIENTOXL','name':'Selección de asiento XL','text':'De pago','units':null,'extendedInfo':{'title':'Seleccionable con coste','message':'De pago','code':'CA_Asiento_XL_Pago','conditionStatus':false}},{'code':'WIFI','name':'WiFi','text':'','units':null,'extendedInfo':{'title':null,'message':null,'code':null,'conditionStatus':true}},{'code':'FASTTRACK','name':'Fast Track','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Fast Track NO','conditionStatus':false}},{'code':'EQPPRIOR','name':'Entrega prioritaria equipaje','text':'No','units':null,'extendedInfo':{'title':'','message':'No','code':'Entrega_prioritaria_equipaje_ NO','conditionStatus':false}}],'conditionsPriority':['EQMANO','EQBODEGA','COMIDA','ASIENTO','CAMBIO','REEMBOLSO']}],'channel':'IBCOM','onHoldInformation':null,'relatedContent':[{'key':'ESTA_DOCUMENT_INFO','value':'Para los EE.UU. se requiere un sistema ESTA (Electronic System for Travel Authorization, Sistema Electrónico para la autorización de viajes) para todos los titulares de pasaportes que no sean estadounidenses que viajen en el Programa de exención de visado.Si todavía no lo has hecho, completa los detalles del ESTA para todos los pasajeros.<a href=\'https://esta.cbp.dhs.gov/?blank=true&AAA=true&market=ES&language=es\' target=\'_blank\'>Completar información del ESTA</a>'},{'key':'APIS_DOCUMENT_INFO','value':'Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online'}],
            'qualifiers':[],
            'reportingWeb':{'device':'DSRC','idColective':'','officeIata':'MADIB08AB','iata':'I','product':'1'},
            'flexibilizationCapabilitiesInformation':null,
            'genericDisruptionCapabilitiesInformation':null,
            'upgInformation':{'url':null,'flightsInformation':null,'bidable':false},
            'orderFlags':[
                {'type':'PRINT_ITINERARY','enabled':true},
                {'type':'ON_BUSINESS_MODIFICATION','enabled':true},
                {'type':'VOUCHER_REFUND','enabled':false},
                {'type':'CASH_REFUND','enabled':false},
                {'type':'ALLOWED_REFUND_CASH','enabled':false},
                {'type':'ALLOWED_REFUND_VOUCHER','enabled':false},
                {'type':'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE','enabled':false},
                {'type':'VOUCHER_REFUND_ON_DEMAND','enabled':false},
                {'type':'VOUCHER_REFUND_RESTRICTION','enabled':false},
                {'type':'ALLOWED_VOUCHER_COMPENSATION','enabled':true}
            ],
            'isAirShuttle':false,
            'isOnHold':false,
        };

    var fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        var filterFunc = () => {
            return '';
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
    var fakeMmBUtilService = {
        'getCompanyURL': jasmine.createSpy('isUserLogged').and.callFake(() => {
            return '';
        })
    };
    var fakeMmBAppConstants = {
        RESIDENT: {
            'STATUS': {
                'VERIFIED': 'VERIFIED',
                'NOT_VERIFIED': 'NOT_VERIFIED'
            },
            'CITY': {
                'RM': 'IBBKCF_RESIDENT_CITY_MELILLA_NAME',
                'RC': 'IBBKCF_RESIDENT_CITY_CANARIAS_NAME',
                'BP': 'IBBKCF_RESIDENT_CITY_BALEARES_NAME'
            }
        },
    }
    var fakeLocalStorageService = {
        'get' : jasmine.createSpy('get').and.callFake(function(name){
            switch (name){
                case 'pnr':
                    return pnr;
                default:
                    return '';
            };
        }),
        'set' : jasmine.createSpy('get').and.callFake(function(name){
            switch (name){
                case 'pnr':
                    return pnr;
                default:
                    return '';
            };
        }),
    };
    var IbFlexibilizationTransformer, rootScope,localStorageService, response;
    beforeEach(() => {
        angular.mock.module('ib-flexibilization-module', ($provide) => {
            $provide.value('$filter', fakeFilter);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_IbFlexibilizationTransformer_, _localStorageService_,_$rootScope_) => {
            IbFlexibilizationTransformer = _IbFlexibilizationTransformer_;
            localStorageService = _localStorageService_;
            rootScope = _$rootScope_;
            localStorageService.set('pnr',pnr);
        });
    });

    describe('test for IbFlexibilizationTransformer', () => {

        it('IbFlexibilizationTransformer should be defined', (done) => {

            expect(IbFlexibilizationTransformer).toBeDefined();
            done();
            rootScope.$digest();
        });

        it('transformRebookResponse is called', (done) => {

            response= IbFlexibilizationTransformer.transformRebookResponse(bookingInfo,slices,allSlices);
            done();
            rootScope.$digest();
        });

        it('transformRebookResponse is called and have specialDiscounts', (done) => {

            response= IbFlexibilizationTransformer.transformRebookResponse(bookingInfoSpecialDiscount,slices,allSlices);
            done();
            rootScope.$digest();
        });
        it('transformRebookResponse is called and have 3 slices', (done) => {

            response= IbFlexibilizationTransformer.transformRebookResponse(bookingInfoMultipleSlices,slices,allSlices);
            done();
            rootScope.$digest();
        });

        it('prepareRequestRebook is called', (done) => {

            response= IbFlexibilizationTransformer.prepareRequestRebook(flowId,slices);
            done();
            rootScope.$digest();
        });

    });
});
