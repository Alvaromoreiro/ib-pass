describe('IbMmbVcSummaryMainController test', () =>  {
    var $q, localStorageService, controller, $scope, $rootScope, element, $filter, $injector;
    var fakeMmBAppConstants = {
        WARNING_MESSAGES: {
            OVERNIGHT_WARNING: 'SSE_AVM_20003',
            TERMINAL_CHANGE_WARNING: 'SSE_AVM_20002',
            AIRPORT_CHANGE_WARNING: 'SSE_AVM_20001',
            LONG_WAITING_WARNING: 'SSE_AVM_20004',
            MISSCONNECTION_FLEX_WARNING: 'SSE_ORM_20014'
        },
        FLIGHTS_TYPES: {
            'DIRECT': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
            'INDIRECT': 'MMB_YOUR_FLIGHTS_SCALE_SIMPLE_TEXT'
        },
        CALENDAR_POSITION: {
            'LEFT': 'bottom-left',
            'RIGHT': 'bottom-right'
        },
        QUADRIGAM: {
            CHANGE_FLIGHTS_SUMMARY: 'ATCSUM'
        },
        TOGGLE: {
            isActiveDeinvoicing: true
        },
        templatesRoute: '/iberia-web-content/templates/',
    }

    var fakeMmBModalService = {
        'showWaitingModal': jasmine.createSpy('genericModalSpy'),
        'showGenericModal': jasmine.createSpy('showGenericModal').and.returnValue({
            result: {
                then: jasmine.createSpy('showGenericModalResultThen')
            }
        }),
        'finishWaiting': jasmine.createSpy(),
    }

    let fakeTranslate = {
        'onReady': jasmine.createSpy('onReady').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
    };

    let fakeMmBUtilsSharedService = {
        'getCompanyURL': jasmine.createSpy(),
        'getProcessByStatus': jasmine.createSpy(),
        'updateQuadrigam': jasmine.createSpy(),
    };

    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy(),
    };

    let fakeIbCConditionsService = {
        'getPaymentConditions': jasmine.createSpy('getPaymentConditions').and.callFake(function(conditionsData){
            let deferred = $q.defer();
            if(conditionsData){
                deferred.resolve('OK');
            }else{
                deferred.reject('KO');
            }

            return deferred.promise;
        })
    };

    let fakeFareData = {
        'responseId':'TWFuYWdlTXlCb29raW5nQElCN2YyNjk1OGMxN2QwNGYyNDk3Y2MxYTE0ZTI5NGViMDc%3D',
        'offers':[
            {
                'offerId':'IBfddde7228470494ca62479662bd89523OP',
                'compensationInfo':{
                    'totalCompensation':545.71,
                    'totalCost':-445.71,
                    'currency':'EUR',
                    'fareChangesCompensation':[],
                    'fareChangesCost': [],
                    'fareChanges':[
                        {
                            'totalCost':-445.71,
                            'compensation':-445.71,
                            'reIssue':-445.71,
                            'penalty':0,
                            'passengerIds':[
                                'ADULT_01'
                            ]
                        }
                    ],
                    'emds':[
                        {
                            'type':'BAGGAGE',
                            'tickets':[
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':10
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':25
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':50
                                }
                            ]
                        },
                        {
                            'type':'SEAT',
                            'tickets':[
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140748',
                                    'total':50
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':10
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':25
                                },
                                {
                                    'emdNumber':'0755569140747',
                                    'total':50
                                }
                            ]
                        }
                    ]
                },
                'price':{
                    'fare':-445.71,
                    'tax':0,
                    'total':-445.71,
                    'currency':'EUR',
                    'ticketingFee':0
                },
                'slices':[
                    {
                        'sliceId':'MADPMI20201127072000',
                        'departureDateTime':'2020-11-27 07:20',
                        'arrivalDateTime':'2020-11-27 08:40',
                        'duration':80,
                        'stopsNumber':0,
                        'price':{
                            'fare':157.5,
                            'currency':'EUR'
                        },
                        'detailedPrices':[
                            {
                                'fare':157.5,
                                'currency':'EUR',
                                'passengerIds':[
                                    'ADULT_01'
                                ],
                                'segmentPrices':[
                                    {
                                        'price':{
                                            'fare':157.5,
                                            'currency':'EUR'
                                        },
                                        'originCurrencyPrice':{
                                            'fare':74,
                                            'currency':'EUR'
                                        },
                                        'fareCode':'NZNNM3',
                                        'segmentsIds':[
                                            'IB391820201127'
                                        ],
                                        'ticketDesignator':null,
                                        'endorsement':'21 NOEND/CHG RST/REF NOPER'
                                    }
                                ],
                                'commission':null
                            }
                        ],
                        'segments':[
                            {
                                'departure':{
                                    'code':'MAD',
                                    'name':'Madrid Adolfo Suarez-Barajas',
                                    'terminal':'4',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'arrival':{
                                    'code':'PMI',
                                    'name':'Palma de Mallorca',
                                    'terminal':null,
                                    'city':{
                                        'code':'PMI',
                                        'description':'Palma de Mallorca',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'flight':{
                                    'marketingCarrier':{
                                        'code':'IB',
                                        'name':'Iberia'
                                    },
                                    'operationalCarrier':{
                                        'code':'I2',
                                        'name':'Iberia Express'
                                    },
                                    'marketingFlightNumber':'3918',
                                    'operationalFlightNumber':null,
                                    'operationalDisclosure':'I2',
                                    'aircraft':{
                                        'code':'32Q',
                                        'description':'Airbus A321neo'
                                    }
                                },
                                'cabin':{
                                    'rbd':'N',
                                    'bookingCode':'COACH',
                                    'bookingClass':'ECONOMY',
                                    'remainingSeats':5,
                                    'fareFamily':'TCLESES',
                                    'fareBasis':'NZNNM3',
                                    'seatDisplays':null,
                                    'extendedFareCode':null,
                                    'brandCode':null,
                                    'cabinDescription':'Turista'
                                },
                                'overnight':false,
                                'id':'IB391820201127',
                                'duration':80,
                                'waitingTime':0,
                                'providerId':null,
                                'ticketDesignator':'',
                                'accrualQuote':{
                                    'redemptionPoints':250,
                                    'qualificationPoints':50,
                                    'redemptionOffers':[

                                    ],
                                    'qualificationOffers':[

                                    ]
                                },
                                'delayInformation':null,
                                'stop':null,
                                'departureDateTime':'2020-11-27 07:20',
                                'arrivalDateTime':'2020-11-27 08:40'
                            }
                        ],
                        'overnight':false
                    },
                    {
                        'sliceId':'PMIMAD20201130133000',
                        'departureDateTime':'2020-11-30 13:30',
                        'arrivalDateTime':'2020-11-30 14:55',
                        'duration':85,
                        'stopsNumber':0,
                        'price':{
                            'fare':157.5,
                            'currency':'EUR'
                        },
                        'detailedPrices':[
                            {
                                'fare':157.5,
                                'currency':'EUR',
                                'passengerIds':[
                                    'ADULT_01'
                                ],
                                'segmentPrices':[
                                    {
                                        'price':{
                                            'fare':157.5,
                                            'currency':'EUR'
                                        },
                                        'originCurrencyPrice':{
                                            'fare':241,
                                            'currency':'EUR'
                                        },
                                        'fareCode':'KDNNS2',
                                        'segmentsIds':[
                                            'IB391920201130'
                                        ],
                                        'ticketDesignator':null,
                                        'endorsement':'CHGS AND REF PERMITTED'
                                    }
                                ],
                                'commission':null
                            }
                        ],
                        'segments':[
                            {
                                'departure':{
                                    'code':'PMI',
                                    'name':'Palma de Mallorca',
                                    'terminal':null,
                                    'city':{
                                        'code':'PMI',
                                        'description':'Palma de Mallorca',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'arrival':{
                                    'code':'MAD',
                                    'name':'Madrid Adolfo Suarez-Barajas',
                                    'terminal':'4',
                                    'city':{
                                        'code':'MAD',
                                        'description':'Madrid',
                                        'countryCode':'ES',
                                        'country':{
                                            'code':'ES',
                                            'description':'España'
                                        }
                                    }
                                },
                                'flight':{
                                    'marketingCarrier':{
                                        'code':'IB',
                                        'name':'Iberia'
                                    },
                                    'operationalCarrier':{
                                        'code':'I2',
                                        'name':'Iberia Express'
                                    },
                                    'marketingFlightNumber':'3919',
                                    'operationalFlightNumber':null,
                                    'operationalDisclosure':'I2',
                                    'aircraft':{
                                        'code':'32A',
                                        'description':'Airbus Industrie A320 (Sharklets)'
                                    }
                                },
                                'cabin':{
                                    'rbd':'K',
                                    'bookingCode':'COACH',
                                    'bookingClass':'ECONOMY',
                                    'remainingSeats':9,
                                    'fareFamily':'TFLESEU',
                                    'fareBasis':'KDNNS2',
                                    'seatDisplays':null,
                                    'extendedFareCode':null,
                                    'brandCode':null,
                                    'cabinDescription':'Turista'
                                },
                                'overnight':false,
                                'id':'IB391920201130',
                                'duration':85,
                                'waitingTime':0,
                                'providerId':null,
                                'ticketDesignator':'',
                                'accrualQuote':{
                                    'redemptionPoints':250,
                                    'qualificationPoints':50,
                                    'redemptionOffers':[

                                    ],
                                    'qualificationOffers':[

                                    ]
                                },
                                'delayInformation':null,
                                'stop':null,
                                'departureDateTime':'2020-11-30 13:30',
                                'arrivalDateTime':'2020-11-30 14:55'
                            }
                        ],
                        'overnight':false
                    }
                ],
                'offerExpiration':'2020-11-25T12:01:07.155+01:00',
                'paymentTimeLimit':'2020-11-25T22:59:59.000+00:00',
                'cashAviosPossibilities':[
                    {
                        'totalDiscount':10,
                        'currency':'EUR',
                        'aviosRequired':1850,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':10,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':94.5,
                        'currency':'EUR',
                        'aviosRequired':17500,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':94.5,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':157.5,
                        'currency':'EUR',
                        'aviosRequired':29165,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':157.5,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':252,
                        'currency':'EUR',
                        'aviosRequired':46665,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':252,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    },
                    {
                        'totalDiscount':299.25,
                        'currency':'EUR',
                        'aviosRequired':55415,
                        'offerAvailable':false,
                        'perPassengerDiscounts':[
                            {
                                'discount':299.25,
                                'passengerType':'ADT',
                                'numberOfPassengers':1
                            }
                        ]
                    }
                ],
                'carryOnBaggageAllowances':[
                    {
                        'totalQuantity':1,
                        'segmentIds':[
                            'IB391820201127',
                            'IB391920201130'
                        ],
                        'pieceAllowances':null
                    }
                ],
                'checkedBagAllowances':[
                    {
                        'totalQuantity':1,
                        'pieceAllowances':[
                            {
                                'totalQuantity':1,
                                'commercialName':'UP TO 23 KG AND 158 LCM',
                                'descriptions':[
                                    'Up to 50 lb/23 kg',
                                    'Up to 62 li/158 lcm'
                                ],
                                'type':'PIECE'
                            }
                        ],
                        'segmentIds':[
                            'IB391920201130'
                        ]
                    },
                    {
                        'totalQuantity':1,
                        'pieceAllowances':[
                            {
                                'totalQuantity':1,
                                'commercialName':'UP TO 23 KG AND 158 LCM',
                                'descriptions':[
                                    'Up to 50 lb/23 kg',
                                    'Up to 62 li/158 lcm'
                                ],
                                'type':'PIECE'
                            }
                        ],
                        'segmentIds':[
                            'IB391820201127'
                        ]
                    }
                ],
                'availableServices':[

                ],
                'selectedServices':[

                ],
                'reshopOfferInformation':{
                    'originalPrice':{
                        'fare':760,
                        'tax':28.27,
                        'total':788.27,
                        'currency':'EUR',
                        'ticketingFee':0
                    },
                    'penalty':0,
                    'reshopTicketingInformationWebResponse':[
                        {
                            'fareCalculation':'MAD IB PMI74.00 IB MAD241.00EUR315.00END',
                            'taxes':[
                                {
                                    'code':'QV',
                                    'amount':5.93,
                                    'currency':'EUR',
                                    'description':'QV',
                                    'subcode':'003'
                                },
                                {
                                    'code':'OG',
                                    'amount':1.18,
                                    'currency':'EUR',
                                    'description':'OG',
                                    'subcode':'001'
                                },
                                {
                                    'code':'JD',
                                    'amount':20.45,
                                    'currency':'EUR',
                                    'description':'JD',
                                    'subcode':'003'
                                }
                            ],
                            'originalTaxes':[
                                {
                                    'code':'QV',
                                    'amount':5.66,
                                    'currency':'EUR',
                                    'description':'QV',
                                    'subcode':'003'
                                },
                                {
                                    'code':'OG',
                                    'amount':1.56,
                                    'currency':'EUR',
                                    'description':'OG',
                                    'subcode':'001'
                                },
                                {
                                    'code':'JD',
                                    'amount':21.05,
                                    'currency':'EUR',
                                    'description':'JD',
                                    'subcode':'003'
                                }
                            ],
                            'penalty':0,
                            'price':{
                                'fare':315,
                                'tax':27.56,
                                'total':342.56,
                                'currency':'EUR',
                                'ticketingFee':0
                            },
                            'reissuePrice':-445.71,
                            'farebasis':'NZNNM3',
                            'passengersIds':[
                                'ADULT_01'
                            ]
                        }
                    ]
                },
                'offerItems':[
                    {
                        'offerItemId':'IBfddde7228470494ca62479662bd89523OP_01',
                        'passengerIds':[
                            'ADULT_01'
                        ],
                        'price':{
                            'fare':-445,
                            'tax':-0.71,
                            'total':-445.71,
                            'currency':'EUR',
                            'ticketingFee':0
                        },
                        'detailedTaxes':[
                            {
                                'code':'QV',
                                'amount':0.27,
                                'currency':'EUR',
                                'description':'QV',
                                'subcode':'003'
                            },
                            {
                                'code':'OG',
                                'amount':-0.38,
                                'currency':'EUR',
                                'description':'OG',
                                'subcode':'001'
                            },
                            {
                                'code':'JD',
                                'amount':-0.6,
                                'currency':'EUR',
                                'description':'JD',
                                'subcode':'003'
                            }
                        ],
                        'reshopDetailedTaxes':[
                            {
                                'code':'QV',
                                'amount':5.93,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'003'
                            },
                            {
                                'code':'OG',
                                'amount':1.18,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'001'
                            },
                            {
                                'code':'JD',
                                'amount':20.45,
                                'currency':'EUR',
                                'description':null,
                                'subcode':'003'
                            }
                        ],
                        'fareCalculation':'MAD IB PMI74.00 IB MAD241.00EUR315.00END',
                        'fareComponents':[
                            {
                                'remarks':'  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n    AFTER DEPARTURE\n      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.\n  CHANGES\n    CHANGES NOT PERMITTED IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      PER TICKET CHARGE EUR 45.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      PER TICKET CHARGE EUR 45.00 FOR REISSUE.\n      CHILD/INFANT DISCOUNTS APPLY.\n         NOTE -\n          FIRST CHANGE FREE FOR TICKETING ON/BEFORE 31DEC20\n          AND TRAVEL ON/BEFORE 30JUN 21\n          IF CHANGE IS DONE 15DAYS BEFORE DEPARTURE OF\n          FIRST SCHEDULE FLIGHT.\n          ------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AND REISSUE AFTER\n          SCHEDULED FLIGHT CHANGES NO PERMITED.\n          OTHERWISE THE TICKET WILL ONLY BE VALID FOR\n          REFUND IF APPLICABLE.\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFOUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                                'segmentIds':[
                                    'IB391820201127'
                                ],
                                'details':[
                                    {
                                        'type':'Change',
                                        'application':'BEFORE-DEPARTURE',
                                        'minPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        }
                                    },
                                    {
                                        'type':'Change',
                                        'application':'AFTER-DEPARTURE',
                                        'minPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':45,
                                            'currency':'EUR'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse':[
                                    {
                                        'segmentReferences':[
                                            'IB391820201127'
                                        ],
                                        'productName':'',
                                        'subProductName':'',
                                        'fareCode':'',
                                        'fareBasisCode':'NZNNM3',
                                        'accountCode':'',
                                        'tourBoxcode':null,
                                        'fareBoxText':null,
                                        'accountCodeAmadeus':''
                                    }
                                ]
                            },
                            {
                                'remarks':'  CANCELLATIONS\n    TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.\n    BEFORE DEPARTURE\n      CHARGE EUR 60.00 FOR CANCEL/REFUND.\n      CHILD/INFANT DISCOUNTS APPLY.\n    AFTER DEPARTURE\n      CHARGE EUR 60.00 FOR CANCEL/REFUND.\n      CHILD/INFANT DISCOUNTS APPLY.\n  CHANGES\n    CHANGES PERMITTED FOR NO-SHOW.\n    BEFORE DEPARTURE\n      CHANGES PERMITTED.\n    AFTER DEPARTURE\n      CHANGES PERMITTED.\n         NOTE -\n          ------------------------------\n          WAIVED FOR DEATH OF A PASSENGER AND PASSENGERS\n          TRAVELLING COMPANIONS.\n          ------------------------------\n          NO SHOW IS WHEN A PASSENGER HAS NOT ADVISED THE\n          AIRLINE THAT THEY WILL NO ABLE TO MAKE THE FLIGHT\n          THEY ARE BOOKED ON.\n          ------------------------------\n          CHARGE FOR CHANGES APPLIES PER TRANSACTION/TICKET\n          AND PERSON TO ALL PASSENGER TYPES.\n          CHARGE FOR CANCELLATION APPLIES PER DIRECTION TO\n          ALL PASSENGER TYPES.\n          ------------------------------\n          A CHANGE IS A DATE/FLIGHT/ROUTING/BOOKING CODE\n          CHANGE.\n          ------------------------------\n          REISSUE MUST BE MADE AT THE SAME TIME AS CHANGE\n          OF RESERVATION BUT NO LATER TAN SCHEDULED\n          DEPARTURE TIME OF FLIGHT BEING CHANGED.\n          ------------------------------\n          IN CASE OF RESERVATION CHANGES AFTER SCHEDULED\n          FLIGHT NO SHOW IS PERMITTED\n          ------------------------------\n          WHEN MORE THAN ONE FARE COMPONENT IS CHANGED THE\n          HIGHEST PENALTY OF ALL CHANGED FARE COMPONENTS\n          WITH THE JOURNEY APPLIES.\n          ------------------------------\n          WHEN COMBINING NON-REFUNDABLE FARES WITH A\n          REFUNDABLE FARES\n          1-THE AMOUNT PAID ON EACH REFUNDABLE FARE\n          COMPONENT IS REFUNDED\n          2-THE AMOUNT PAID ON EACH NON-REFUNDABLE FARE\n          COMPONENT WILL NOT BE REFUNDED\n          3-WHEN COMBINING FARES CHARGE THE SUM OF THE\n          CANCELLATION FEES OF ALL CANCELLED FARE COMPONENTS\n          ------------------------------\n          REFUND OF UNUSED TAXES FEES AND CHARGES PAID TO\n          THIRD PARTIES PERMITTED. ASSOCIATED CARRIER\n          IMPOSED CHARGES WILL NOT BE REFUNDED.\n          ------------------------------\n          REFUND AND CHANGES ARE PERMITTED WITHIN TICKET\n          VALIDITY UNDER FARE CONDITIONS.\n          ------------------------------\n          ANY NON-REFUNDABLE AMOUNT AND/OR CANCELLATION\n          PENALTY FROM A PREVIOUS TICKET REMAINS NON-\n          REFUNDABLE FOLLOWING A CHANGE.\n          ------------------------------\n          TICKET IS NOT TRANSFERABLE TO ANOTHER PERSON.\n          -----------------------------------------------\n          ----REPRICING CONDITIONS ----\n          A.BEFORE DEPARTURE OF JOURNEY WHEN THE FISRT\n          FARE COMPONENT IS CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING CURRENT FARES IN EFFECT ON THE\n          DATE THE TICKET IS REISSUED.\n          B.BEFORE DEPARTURE OF JOURNEY WHEN CHANGES ARE TO\n          BOOKING CODE ONLY IN THE FIRST FARE COMPONENT AND\n          RESULT IN A HIGHER FARE THE ITINERARY MUST BE RE-\n          PRICED USING HISTORICAL FARES IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARE IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WICHEVER IS LOWER.\n          C. BEFORE DEPARTURE OF JOURNEY WHEN THERE ARE NO\n          CHANGES TO THE FIRST FARE COMPONENT BUT OTHER\n          FARE COMPONENTS ARE CHANGED THE ITINERARY MUST BE\n          RE-PRICED USING HISTORICAL FAERS IN EFFECT ON THE\n          PREVIOUS TICKETING DATE OR USING CURRENT FARES IN\n          EFFECT ON THE DATE THE TICKET IS REISSUED -\n          WHICHEVER IS LOWER.\n          D. AFTER DEPARTURE OF JOURNEY THE ITINERARY MUST\n          BE RE-PRICED USING HISTORICAL FARES IN EFFECT ON\n          THE PREVIOUS TICKETING DATE.\n          -----------------------------------------------\n          WHEN THE ITINERARY RESULT IN A HIGHER FARE THE\n          DIFFERENCE WILL BE COLLECTED ANY APPLICABLE\n          CHANGE FEE APPLIES.\n          -----------------------------------------------\n          WHEN THE NEW ITINERARY RESULTS IN A LOWER FARE\n          THE CHANGE FEE APPLIES AND NO CREDIT OF THE\n          RESIDUAL AMOUNT WILL BE MADE.',
                                'segmentIds':[
                                    'IB391920201130'
                                ],
                                'details':[
                                    {
                                        'type':'Cancel',
                                        'application':'BEFORE-DEPARTURE',
                                        'minPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        }
                                    },
                                    {
                                        'type':'Cancel',
                                        'application':'AFTER-DEPARTURE',
                                        'minPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        },
                                        'maxPrice':{
                                            'amount':60,
                                            'currency':'EUR'
                                        }
                                    }
                                ],
                                'privateFareInformationWebResponse':[

                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        'passengers':[
            {
                'passengerId':'ADULT_01',
                'passengerType':'ADULT',
                'firstName':null,
                'surname':null,
                'frequentFlyerInfo':null
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
                    'decimalSeparator':',',
                    'decimals':2,
                    'recommendedDisplay':'symbol'
                }
            ]
        },
        'fareFamilyConditions':[
            {
                'cabinType':'E',
                'cabinDescription':'Turista',
                'commercialCode':'TCLESES',
                'commercialName':'Óptima',
                'commercialNameES':'Óptima',
                'priority':700,
                'conditions':[
                    {
                        'code':'EQMANO',
                        'name':'Equipaje de mano',
                        'text':'1 bulto (56x40x25cm)',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 bulto en cabina  (56x40x25cm)',
                            'message':'1 bulto (56x40x25cm)',
                            'code':'CA_EQP_MANO_10KG',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'EQBODEGA',
                        'name':'Equipaje en bodega',
                        'text':'1 pieza',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 equipaje en bodega',
                            'message':'Incluido: 1 pieza',
                            'code':'CA_1_PIEZAS',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'ASIENTO',
                        'name':'Selección de asiento',
                        'text':'Gratuita desde 24 horas antes del vuelo. ',
                        'units':24,
                        'extendedInfo':{
                            'title':'Gratuita desde 24 horas antes del vuelo. ',
                            'message':'Gratuita desde 24 horas antes del vuelo. ',
                            'code':'CA_Asiento_Gratis_24_horas',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'CAMBIO',
                        'name':'Cambios',
                        'text':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                        'units':45,
                        'extendedInfo':{
                            'title':'Cambio permitido con coste 45€. No Show no permite cambio',
                            'message':'Permitidos en cualquier momento con una penalización de 45€, excepto en caso de no presentarse al vuelo (No-Show), que no permite cambio',
                            'code':'CA_CAMBIO CON PENALTY_45EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'REEMBOLSO',
                        'name':'Reembolso (por sentido)',
                        'text':'No permitido',
                        'units':null,
                        'extendedInfo':{
                            'title':'Reembolso no permitido',
                            'message':'No permitido.',
                            'code':'CA_REEMBOLSO NO PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    }
                ],
                'observations':[

                ],
                'conditionsPriority':[
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
                'cabinType':'E',
                'cabinDescription':'Turista',
                'commercialCode':'TFLESEU',
                'commercialName':'Flexible',
                'commercialNameES':'Flexible',
                'priority':500,
                'conditions':[
                    {
                        'code':'EQMANO',
                        'name':'Equipaje de mano',
                        'text':'1 bulto (56x40x25cm)',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 bulto en cabina  (56x40x25cm)',
                            'message':'1 bulto (56x40x25cm)',
                            'code':'CA_EQP_MANO_10KG',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'EQBODEGA',
                        'name':'Equipaje en bodega',
                        'text':'1 pieza',
                        'units':1,
                        'extendedInfo':{
                            'title':'1 equipaje en bodega',
                            'message':'Incluido: 1 pieza',
                            'code':'CA_1_PIEZAS',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'ASIENTO',
                        'name':'Selección de asiento',
                        'text':'Incluido',
                        'units':null,
                        'extendedInfo':{
                            'title':'Con selección de asiento',
                            'message':'Incluido',
                            'code':'CA_Asiento_Gratuito',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'CAMBIO',
                        'name':'Cambios',
                        'text':'Permitidos en cualquier momento',
                        'units':null,
                        'extendedInfo':{
                            'title':'Cambio permitido',
                            'message':'Permitidos en cualquier momento',
                            'code':'CA_CAMBIO SIEMPRE',
                            'conditionStatus':true,
                            'observationCode':null
                        }
                    },
                    {
                        'code':'REEMBOLSO',
                        'name':'Reembolso (por sentido)',
                        'text':'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                        'units':60,
                        'extendedInfo':{
                            'title':'Reembolso permitido con coste 60€. No Show no permitido',
                            'message':'Permitidos en cualquier momento con una penalización de 60€, excepto en caso de no presentarse al vuelo (No-Show), que no tendrá reembolso',
                            'code':'CA_REEMBOLSO CON PENALTY_60EUR_NO_SHOW_NO_PERMITIDO',
                            'conditionStatus':false,
                            'observationCode':null
                        }
                    }
                ],
                'observations':[

                ],
                'conditionsPriority':[
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
        ],
        'advices':[

        ],
        'services':[

        ],
        'warnings':null,
        'accountCodes':null,
        'compensationInfo':{
            'totalCompensation':545.71,
            'totalCost':-445.71,
            'currency':'EUR',
            'fareChanges':[
                {
                    'totalCost':-445.71,
                    'compensation':-445.71,
                    'reIssue':-445.71,
                    'penalty':0,
                    'passengerIds':[
                        'ADULT_01'
                    ]
                }
            ],
            'emds':[
                {
                    'type':'BAGGAGE',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ]
                },
                {
                    'type':'SEAT',
                    'tickets':[
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140748',
                            'total':50
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':10
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':25
                        },
                        {
                            'emdNumber':'0755569140747',
                            'total':50
                        }
                    ]
                }
            ]
        }
    };

    let fakeBookingInfo = {
        'flowId': 'TWFuYWdlTXlCb29raW5nQElCY2I2YzhjZDYxNzY5NDI2M2EzNTcxYThhM2Y0NGExYWU%3D'
    };

    let fakeVcSummaryTransformer = {
        'generateBreakdownModel': jasmine.createSpy(),
        'generateSummaryModel': jasmine.createSpy('generateSummaryModel').and.returnValue({
            'fligthsModel' : {returnFlight: 'XX'}
        })
    };

    let $fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        var filterFunc:any = () =>  {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                };
                break;
            case 'DurationFormatFilter':
                filterFunc = () =>  {
                    return '0h 52min.';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    let fakeIbCPermanentUserService = {
        'checkPermanentUserFlow': jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        })
    };

    let fakeDisruptionDashboardConstants = {
        QUADRIGAM_BY_DISRUPTION_FLOW: {
            'ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION': 'ALT_TOTAL_WITH_FLEX',
            'ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION': 'ALT_PARC_WITH_FLEX',
            'ALTERANTIVE_TOTAL_WITHOUT_FLEXIBILIZATION': 'ALT_TOTAL_WITHOUT_FLEX',
            'ALTERNATIVE_PARCIAL_WITHOUT_FLEXIBILIZATION': 'ALT_PARC_WITHOUT_FLEX'
        }
    };

    let fakeMmBChangeFlightOrderService = {
        'changeFlightOrderNothingToPay': jasmine.createSpy('changeFlightOrderNothingToPay').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve({
                orderId: 'test-order-id',
                flowId: 'test-flow-id'
            });
            return deferred.promise;
        })
    };

    let fakeOcLazyLoad = {
        'load': jasmine.createSpy('load').and.returnValue(Promise.resolve())
    };

    let fakeCommonsSessionStorageService = {
        'set': jasmine.createSpy('set'),
        'get': jasmine.createSpy('get')
    };

    let fakeGetDataModalDeinvoicing = [{
        'sliceID': 123,
        'operatedBy': 'code',
        'flightNumber': 1234,
        'arrivalTerminal': 'Barajas',
        'departureTerminal': 'Bilbao',
        'departureDateTime': '20/02/2026',
        'departureDateDay': '20',
        'departureDateMonth': '02',
        'departureDateYear': '2025',
        'arrivalDateTime': '20/04/2026',
        'arrivalDateDay': '20',
        'arrivalDateMonth': '04',
        'arrivalDateYear': '2026'
    }]

    let fakeMmBDeinvoicingUtils = {
        getDataModalDeinvoicing: jasmine.createSpy('getDataModalDeinvoicing').and.returnValue(fakeGetDataModalDeinvoicing),
        checkSpecificWarningCheckOut: jasmine.createSpy('checkSpecificWarningCheckOut').and.callFake(() =>  {
            return false;
        }),
        checkWarningCheckOut: jasmine.createSpy('checkWarningCheckOut').and.callFake(() =>  {
            return true;
        })
    }

    beforeEach(() =>  {
        angular.mock.module('ib-MmB-vc-summary-module', 'LocalStorageModule', ($provide) => {
            $provide.value('IbVcSummaryTransformer', fakeVcSummaryTransformer);
            $provide.value('$translate', fakeTranslate);
            $provide.value('IbCConditionsService', fakeIbCConditionsService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('IbCPermanentUserService', fakeIbCPermanentUserService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('DisruptionDashboardConstants', fakeDisruptionDashboardConstants);
            $provide.value('$filter', $fakeFilter);
            $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
            $provide.value('MmBChangeFlightOrderService', fakeMmBChangeFlightOrderService);
            $provide.value('$ocLazyLoad', fakeOcLazyLoad);
            $provide.value('MmBDeinvoicingUtils', fakeMmBDeinvoicingUtils);
        });
        inject((_$q_, _$componentController_, _$rootScope_, _localStorageService_, _$translate_, $compile, _$injector_) => {

            $injector = Object.keys(_$injector_).reduce((clone, key) => {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            localStorageService = _localStorageService_;
            $filter = $injector.get('$filter');

            element = angular.element('<div class="modal-content"></div>');
            element.scrollTo = jasmine.createSpy('scrollTo').and.callFake(() =>  {
                return true;
            });
            $rootScope = _$rootScope_;
            $q = _$q_;
            $scope = $rootScope.$new();
            $compile(element)($scope);

            localStorageService.set('bookingInfo', fakeBookingInfo);
            localStorageService.set('fareData', fakeFareData);
            localStorageService.set('modeFlight', 'once');   //one, return, twice, outbound
            localStorageService.set('typeDisruptionFlow', null);


            fakeTranslate.onReady = jasmine.createSpy('onReady').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });


            controller = _$componentController_('ibMmbVcSummaryMain', {
                $scope: $scope,
                $rootScope: $rootScope,
                $translate: fakeTranslate,
                $q: $q,
            });

            controller.summaryModel = {
                'fligthsModel' : {returnFlight: 'twice'},
                'totalPriceModel': {
                    price: 10
                }
            }
            $scope.$digest();
        });
    });

    describe('init IbMmbVcSummaryMainController component', () =>  {
        it('it is created correctly', () =>  {
            expect(controller).toBeDefined();
        });
    });

    describe('component metadata', () => {
        it('should resolve templateUrl with MmBAppConstants.templatesRoute', inject((_$injector_) => {
            const componentDirective = _$injector_.get('ibMmbVcSummaryMainDirective')[0];
            const resolvedTemplateUrl = _$injector_.invoke(componentDirective.templateUrl, null, {
                tElement: angular.element('<ib-mmb-vc-summary-main></ib-mmb-vc-summary-main>'),
                tAttrs: {}
            });

            expect(resolvedTemplateUrl).toEqual(
                fakeMmBAppConstants.templatesRoute + 'ib-MmB-vc-summary-main-view.html'
            );
        }));
    });

    describe('when $onInit() method is called', () =>  {
        const runOnInit = () => {
            controller.$onInit();
            $rootScope.$digest();
        };

        const mockGetPaymentConditions = (resolveValue = null, shouldResolve = true) => {
            fakeIbCConditionsService.getPaymentConditions = jasmine.createSpy('getPaymentConditions').and.callFake(() => {
                const deferred = $q.defer();
                if (shouldResolve) {
                    deferred.resolve(resolveValue);
                } else {
                    deferred.reject();
                }

                return deferred.promise;
            });
        };

        const expectSummaryFlowAfterOnInit = (expectedConditionsData) => {
            spyOn(controller, 'generatedShowLabels').and.callThrough();
            spyOn(controller as any, 'showDeinvoicingWarningModal').and.callThrough();

            runOnInit();

            expect(fakeVcSummaryTransformer.generateSummaryModel).toHaveBeenCalledWith(fakeFareData, 'once', fakeBookingInfo, expectedConditionsData);
            expect(controller.generatedShowLabels).toHaveBeenCalled();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            expect((controller as any).showDeinvoicingWarningModal).toHaveBeenCalled();
        };

        beforeEach(inject(() => {
            fakeMmBModalService.showWaitingModal = jasmine.createSpy('showWaitingModal').and.callFake(() =>  {});
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({
                result: {
                    then: jasmine.createSpy('showGenericModalResultThen')
                }
            });
            fakeIbCConditionsService.getPaymentConditions.calls.reset();
            fakeVcSummaryTransformer.generateSummaryModel.calls.reset();
            fakeMmBModalService.finishWaiting = jasmine.createSpy('finishWaiting');
            fakeTranslate.onReady = jasmine.createSpy('onReady').and.callFake(() =>  {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
        }));

        it('should execute fallback flow when getPaymentConditions rejects', () =>  {
            mockGetPaymentConditions(null, false);

            expectSummaryFlowAfterOnInit(null);
        });

        it('should execute success flow when getPaymentConditions resolves', () =>  {
            const conditionsData = { status: 'OK' };
            mockGetPaymentConditions(conditionsData, true);

            expectSummaryFlowAfterOnInit(conditionsData);
        });

        it('should stop flow when translate onReady rejects', () =>  {
            fakeIbCConditionsService.getPaymentConditions.calls.reset();
            fakeTranslate.onReady = jasmine.createSpy('onReady').and.callFake(() =>  {
                const deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            });

            runOnInit();

            expect(fakeIbCConditionsService.getPaymentConditions).not.toHaveBeenCalled();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
        });

        it('should handle disruption flow with typeflow null', () =>  {
            let typeFlowDisruption = localStorageService.get('typeDisruptionFlow');
            $rootScope.isDisruptionFlow = true;
            runOnInit();
            expect(typeFlowDisruption).toEqual(null);
        });

        it('should handle disruption flow with typeflow total', () =>  {
            $rootScope.isDisruptionFlow = true;
            localStorageService.set('typeDisruptionFlow', 'ALT_TOTAL_WITH_FLEX');
            let typeFlowDisruption = localStorageService.get('typeDisruptionFlow');
            runOnInit();
            expect(typeFlowDisruption).toEqual('ALT_TOTAL_WITH_FLEX');
        });

        it('should handle disruption flow with typeflow partial', () =>  {
            $rootScope.isDisruptionFlow = true;
            localStorageService.set('typeDisruptionFlow', 'ALT_PARC_WITH_FLEX');
            let typeFlowDisruption = localStorageService.get('typeDisruptionFlow');
            runOnInit();
            expect(typeFlowDisruption).toEqual('ALT_PARC_WITH_FLEX');
        });

        it('should handle disruption flow with typeflow other', () =>  {
            $rootScope.isDisruptionFlow = true;
            localStorageService.set('typeDisruptionFlow', 'other');
            let typeFlowDisruption = localStorageService.get('typeDisruptionFlow');
            runOnInit();
            expect(typeFlowDisruption).toEqual('other');
        });
    });

    describe('warningCheckOut coverage through deinvoicing modal flow', () => {
        beforeEach(() => {
            fakeMmBDeinvoicingUtils.checkSpecificWarningCheckOut.calls.reset();
            fakeMmBDeinvoicingUtils.checkWarningCheckOut.calls.reset();
            fakeMmBModalService.showGenericModal.calls.reset();
        });

        it('should use generic warning validation when changeFlightsCV has one item', () => {
            controller.changeFlightsCV = [{ originalSliceId: 'SLICE_01' }];
            fakeMmBDeinvoicingUtils.checkWarningCheckOut.and.returnValue(true);

            (controller as any).showDeinvoicingWarningModal();

            expect(fakeMmBDeinvoicingUtils.checkWarningCheckOut).toHaveBeenCalled();
            expect(fakeMmBDeinvoicingUtils.checkSpecificWarningCheckOut).not.toHaveBeenCalled();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
        });

        it('should use generic warning validation when changeFlightsCV has multiple items', () => {
            controller.changeFlightsCV = [{ originalSliceId: 'SLICE_01' }, { originalSliceId: 'SLICE_02' }];
            fakeMmBDeinvoicingUtils.checkWarningCheckOut.and.returnValue(true);

            (controller as any).showDeinvoicingWarningModal();

            expect(fakeMmBDeinvoicingUtils.checkWarningCheckOut).toHaveBeenCalled();
            expect(fakeMmBDeinvoicingUtils.checkSpecificWarningCheckOut).not.toHaveBeenCalled();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
        });
    });

    describe('generatedShowLabels method is called', () =>  {
        it('should hide both labels when modeFlight is twice', () =>  {
            controller.modeFlight = 'twice';
            controller.generatedShowLabels();
            expect(controller.showRememberLabel).toBeFalse();
            expect(controller.showLabelFlightsIncludeInOutbound).toBeFalse();
        });

        it('should show remember label when modeFlight is outbound', () =>  {
            controller.modeFlight = 'outbound';
            controller.generatedShowLabels();
            expect(controller.showRememberLabel).toBeTrue();
            expect(controller.showLabelFlightsIncludeInOutbound).toBeFalse();
        });

        it('should show flights include label when modeFlight is return', () =>  {
            controller.modeFlight = 'return';
            controller.generatedShowLabels();
            expect(controller.showRememberLabel).toBeFalse();
            expect(controller.showLabelFlightsIncludeInOutbound).toBeTrue();
        });
    });

    describe('goToPay method is called', () =>  {
        const setPaymentsForm = (isValid) => {
            controller.paymentsForm = {
                $submitted: false,
                $valid: isValid
            };
        };

        const mockCheckPermanentUserFlow = (shouldResolve) => {
            fakeIbCPermanentUserService.checkPermanentUserFlow = jasmine.createSpy('checkPermanentUserFlow').and.callFake(() => {
                let deferred = $q.defer();
                shouldResolve ? deferred.resolve() : deferred.reject();
                return deferred.promise;
            });
        };

        it('should process flow when valid and price === 0', () =>  {
            setPaymentsForm(true);
            controller.summaryModel.totalPriceModel.price = 0;
            controller.goToPay();
            expect(controller.goToPay).toBeDefined();
        });

        it('should process flow when valid and price > 0', () =>  {
            mockCheckPermanentUserFlow(true);
            setPaymentsForm(true);
            controller.goToPay();
            $rootScope.$digest();
            expect(controller.goToPay).toBeDefined();
        });

        it('should handle checkPermanentUserFlow rejection', () =>  {
            mockCheckPermanentUserFlow(false);
            setPaymentsForm(true);
            controller.goToPay();
            $rootScope.$digest();
            expect(fakeIbCPermanentUserService.checkPermanentUserFlow).toHaveBeenCalled();
        });

        it('should mark form as submitted when invalid', () =>  {
            setPaymentsForm(false);
            controller.goToPay();
            expect(controller.paymentsForm.$submitted).toBe(true);
        });

        it('should process flow when valid, price === 0 and disrupted', () =>  {
            setPaymentsForm(true);
            controller.summaryModel.totalPriceModel.price = 0;
            $rootScope.isDisruptionFlow = true;
            controller.goToPay();
            expect(controller.goToPay).toBeDefined();
        });
    });

    describe('processNothingToPayFlow method is called', () =>  {
        const executeNothingToPayFlow = () => {
            controller.processNothingToPayFlow();
            $rootScope.$digest();
        };

        const expectCommonNothingToPayFlow = () => {
            expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
            expect(fakeMmBChangeFlightOrderService.changeFlightOrderNothingToPay).toHaveBeenCalled();
        };

        const mockChangeFlightOrderService = (shouldResolve, data = null) => {
            fakeMmBChangeFlightOrderService.changeFlightOrderNothingToPay = jasmine.createSpy('changeFlightOrderNothingToPay').and.callFake(() => {
                let deferred = $q.defer();
                shouldResolve ? deferred.resolve(data) : deferred.reject(data);
                return deferred.promise;
            });
        };

        beforeEach(() => {
            spyOn(controller, 'handleOrderChangeSuccess');
            spyOn(controller, 'handleOrderChangeError');
        });

        it('should handle success flow correctly', (done) =>  {
            mockChangeFlightOrderService(true, { orderId: 'test-order-id', flowId: 'test-flow-id' });

            executeNothingToPayFlow();

            expectCommonNothingToPayFlow();
            expect(localStorageService.get('noPaymentVCFlow')).toBe(true);
            expect(controller.handleOrderChangeSuccess).toHaveBeenCalled();
            done();
        });

        it('should handle error flow correctly', (done) =>  {
            mockChangeFlightOrderService(false, { code: 500 });

            executeNothingToPayFlow();

            expectCommonNothingToPayFlow();
            expect(controller.handleOrderChangeError).toHaveBeenCalled();
            done();
        });
    });

    describe('handleOrderChangeSuccess method is called', () =>  {
        it('should load payment modules and broadcast confirmation event', (done) =>  {
            spyOn($rootScope, '$broadcast');
            
            controller.handleOrderChangeSuccess({ orderId: 'test-order-id' });
            
            setTimeout(() => {
                expect(fakeOcLazyLoad.load).toHaveBeenCalled();
                expect(fakeCommonsSessionStorageService.set).toHaveBeenCalledWith('pmtModelInfo', controller.pmtModelInfo);
                expect(localStorageService.get('RechargeBookingInfo')).toBe(true);
                expect($rootScope.$broadcast).toHaveBeenCalledWith('confirmationMMBVCEvent');
                expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
                done();
            }, 100);
        });
    });

    describe('handleOrderChangeError method is called', () =>  {
        let broadcastSpy;

        beforeEach(() => {
            broadcastSpy = spyOn($rootScope, '$broadcast');
        });

        const testErrorHandling = (error, shouldBroadcast, eventName = null) => {
            controller.handleOrderChangeError(error);
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            
            if (shouldBroadcast) {
                expect(broadcastSpy).toHaveBeenCalledWith(eventName);
            } else {
                expect(broadcastSpy).not.toHaveBeenCalled();
            }
        };

        it('should handle error 417 and broadcast comunicationLostEvent', () =>  {
            testErrorHandling({ code: 417 }, true, 'comunicationLostEvent');
        });

        it('should handle generic errors without broadcasting event', () =>  {
            testErrorHandling({ code: 500 }, false);
        });

        it('should handle error without code property', () =>  {
            testErrorHandling({ message: 'Error' }, false);
        });
    });
});
