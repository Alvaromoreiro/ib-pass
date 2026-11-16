import { TestBed } from "@angular/core/testing";
import { AncillariesDashboardTransformer } from "@src/components/ib-MmB-booking-dashboard/transformer/ib-MmB-ancillaries-dashboard-transformer";
import dayjs from "dayjs";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';

describe('AncillariesDashboardTransformer Test', () => {
    let transformer;
    let fakeLocalStorageService: StorageServiceMock = new StorageServiceMock();

    const fakeBookingInfo = require('./mocks/booking-info-apis.json');
    const fakeAncillariesInfo = require('./mocks/fake-ancillaries-input-mock.json');

    fakeAncillariesInfo.ancillaries[1].status.code = 'AVAILABLE';
    fakeAncillariesInfo.ancillaries[1].status.reason = null;
    fakeAncillariesInfo.ancillaries[1].segments[0].status.code = 'AVAILABLE';
    fakeAncillariesInfo.ancillaries[1].segments[1].status.code = 'AVAILABLE';
    fakeAncillariesInfo.ancillaries[1].segments[0].id = 'IB625320231124';
    fakeAncillariesInfo.ancillaries[1].segments[1].id = 'IB625020231130';

    const fakeBookingDashboardConstants = {
        BOX_LINKS_TYPES: {
            CHECK_IN: 'checkIn',
            EMERGENCY_CONTACT: 'emergencyContact',
            SEATS_AUCTION: 'seatsAuction',
            FLIGHT_REMINDER: 'flightReminder',
            BIDABLE: 'BIDABLE'
        },
        BOX_COL_SIZES: {
            EXTRALARGE: 'col-xs-12',
            LARGE: 'ib-flex--basis-100',
            MEDIUM: 'ib-mmb-dashboard__column'
        },
        BOX_LINK_SIZES: {
            FULL: 'ib-box-menu__section--full',
            LEFT: 'ib-box-menu__section--left',
            RIGHT: 'ib-box-menu__section--right'
        },
        BOX_LINK_ICONS: {
            CHECK_IN: 'icon-checking_online',
            MESSAGES: 'icon-mensajes',
            AUCTION: 'icon-subasta',
            DOWNLOAD: 'icon-descargar',
            UPLOAD_FILE: 'icon-subir_archivos',
            UPGRADE: 'icon-upgrade'
        },
        ANCILLARIES_BAGGAGES_TYPES: {
            BAGGAGE_15: 'BAGGAGE_15',
            BAGGAGE_23: 'BAGGAGE_23',
            BAGGAGE_32: 'BAGGAGE_32'
        },
        ANCILLARIES_BAGGAGES_TYPES_DESCRIPTION: {
            BAGGAGE_15: '15Kg',
            BAGGAGE_23: '23Kg',
            BAGGAGE_32: '32Kg'
        },
        STEPS_STATUS: {
            ACTIVE: 'ACTIVE',
            PAST: 'PAST',
            FUTURE: 'FUTURE'
        },
        IAG_MARKETING_CODE_CARRIER: ['IB', 'YW', 'I2', 'I0', '0I']
    };

    const fakeMmBAppConstants = {
        SPECIAL_NEEDS: {
            SVAN_STATUS: {
                HK: { code: 'HK', description: 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
                KK: { code: 'KK', description: 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
                UC: { code: 'UC', description: 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
                UN: { code: 'UN', description: 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
                DEFAULT: { code: '', description: 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS' } //Pendiente
            },
            CODE: {
                BLND: 'BLND',
                DEAF: 'DEAF',
                SVAN: 'SVAN',
                DPNA: 'DPNA',
                WHEEL_CHAIR: ['WCHR', 'WCHS', 'WCHC']
            },
            TEXT: {
                GUIDE_DOG: 'GUIDE DOG',
                NOT_GUIDE_DOG: 'NOT GUIDE DOG'
            }
        },
        ANCILLARIES_TYPES: {
            BAGGAGE: 'BAGGAGE',
            SEAT: 'SEAT',
            INSURANCE: 'INSURANCE',
            VEHICLE_RENTAL: 'VEHICLE_RENTAL',
            UPGRADING: 'UPGRADING',
            SPEQS: 'SPECIAL_EQUIPMENT',
            SPECIAL_MEALS: 'SPECIAL_MEALS',
            UPGRADING_BID: 'UPGRADING_BID',
            UPGRADING_AVIOS: 'UPGRADING_AVIOS',
            UPGRADING_AVIOS_BID: 'UPGRADING_AVIOS_BID',
            FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
            PREORDER: 'PREORDER',
            PRIORITY_BOARDING: 'PRIORITY_BOARDING',
            INTEGRATED_BOB: 'INTEGRATED_BOB',
            BOB: 'BOB',
            CO2_FOOTPRINT: 'CO2_FOOTPRINT'
        },
        WCS: {
            PHONE_TYPES: {
                SALES: 'RESERVAS',
                IBHOLIDAYS: 'ATTBAH'
            }
        },
        PASSENGER_TYPES: {
            adult: 'ADULT',
            child: 'CHILD',
            infant: 'INFANT'
        },
        MmBPatterns: {
            ONLY_LETTERS: /[^a-zA-Z+]/g
        },
        FARE_CODES: {
            EQMANO: 'EQMANO',
            EQBODEGA: 'EQBODEGA '
        },
        IBERIA_HOLIDAYS: {
            MMB_IB_VACIONES_TYPE_PACKAGE: 'flight+hotel',
            MMB_IB_VACIONES_TYPE_PACKAGE_HOTEL: 'hotel',
            MMB_IB_VACIONES_TYPE_PACKAGE_VEHICLE: 'vehicle',
            MMB_IB_VACIONES_TYPE_PACKAGE_FLIGHT_ITINERARY: 'flightItinerary',
            MMB_IB_VACIONES_TYPE_PACKAGE_EXPERIENCE: 'experience',
            MMB_IB_VACIONES_TYPE_PACKAGE_TRANSFER: 'transfer',
            MMB_IB_VACIONES_TYPE_LINK_AVIS: '../../iberia-web-content/iconos/IB_Vacaciones/AVIS_RED@2x.svg',
            MMB_IB_VACIONES_TYPE_LINK_BUDGET: '../../iberia-web-content/iconos/IB_Vacaciones/Budget_logo.svg',
            MMB_IB_VACIONES_TYPE_COMPANY_CAR_AVIS: 'ZI',
            MMB_IB_VACIONES_TYPE_COMPANY_CAR_BUDGET: 'ZD',
            MMB_IB_VACIONES_TYPE_NEGATIVE: ' - ',
            MMB_IB_VACIONES_TYPE_SPACE: ' '
        },
    };
    const fakeCurrencyService = {
        getCurrenciesAsMap: jasmine.createSpy(),
        getCurrencyObject: jasmine.createSpy(),
        formatPrice: jasmine.createSpy()
    };

    const fakePhonesListIBV = {
        "ATTBAH": {
            "prefix": "+34",
            "telephone": "911776310",
            "text": "",
            "prefixAlt": "",
            "telephoneAlt": "",
            "textAlt": "",
            "timeText": ""
        },
        "packagedProduct": false
    };


    let fakeInvoiceDashboardTransformer = {
        getInvoiceDataInfo: jasmine.createSpy()
    };

    let dataCardInfo = {
        PriorityInfo: {
            PriorityInfo: [{
                segments: [{
                    slicePriority: {
                        hold: {
                            totalUnits: 2
                        }
                    },
                    departureCity: {
                        city: {
                            description: 'MADRID',
                            code: 'MAD'
                        }
                    },
                    arrivalCity: {
                        city: {
                            description: 'BILBAO',
                            code: 'BIO'
                        }
                    }
                }]
            }]
        },
        invoice: {
            specialEquipmentPricesByType: [
                {
                    departureCity: 'MADRID',
                    departureCityCode : 'MAD',
                    arrivalCity: 'BILBAO',
                    arrivalCityCode: 'BIO',
                    units: 2
                }
            ],
            flexibilityOnDemand: {}
        },
        flights: [{
            segmentId: 'IB625320231124',
            upgradingBids: {}
        }],
        orderItems: {
            upgradingBid: [{
                segmentId: 'IB625320231124'
            }],
            bundles: [{

            }],
            flexibilityOnDemand: {}
        }
    };
    let breakDownInfoBundles = {
        bundles: [{
            items: [
                {
                    type: 'FLEXIBILITY_ON_DEMAND',
                    priceItemAll: ''
                },
                {type: 'PRIORITY_BOARDING'},
                {type: 'BAGGAGE'},
                {type: 'SEAT'},
                {type: 'INSURANCE'},
                {type: 'SPECIAL_EQUIPMENT'},
            ]
        }],
        context: {
            passengers: [{
                test: 'test'
            }]
        }
    };
    const transformerInfoManagementModel = {
        managementModel: {
            CardPriority : [{}],
            PriorityInfo: {
                PriorityInfo: [{
                    CardPriority : {}
                }]
            },
            SpeqsInfo: {
                SpeqsInfo: {
                    CardSpeqs: {}
                }
            },
            CardSpeqs: {},
            orderItems: {
                upgradingBid: [{
                    segmentId: 'IB625320231124'
                }],
                bundles: [{

                }],
                flexibilityOnDemand: {},
                priorityBoarding: [{}]
            },
            invoice: {
                bundle:{
                    amount: 2,
                    passengersQuantity: 1,
                    passengerAmount: 1,
                    passengerPrice: 200,
                    formatPrice: 'EUR'
                },
                flexibilityOnDemand: {},
                priorityPricesByType: [{}],
                paidPriority: false
            }
        }
    };

    let transformedInfoPassengerBaggagesTrips = { ancillariesInfo: {
        ancillariesAvailable: ['SPECIAL_MEALS'],
        passengerBaggagesTrips: [{
            totalBaggages: 1,
            totalExtraBaggages23: 1,
            trips: [{
                id: 'MADJFK20231124161000',
                pieces: [{
                    subtype: 'BAGGAGE_23',
                    quantySelected: 1,
                    extraPieces: 0
                }],
                piecesChoosed: 1
            }]
        }]
    }};
    let actualFlightSliceBaggage = {
        sliceId: 'MADJFK20231124161000',
        fareFamilyConditions: [
            {
                code: "EQMANO",
                message: "1 item max. 10 kg (56x40x25cm) and 1 personal accessory included",
                title: "Hand luggage: 1 item",
                extendedInfo: {
                    code: "CA_EQP_MANO_10KG",
                    conditionStatus: true,
                    message: "1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator.",
                    title: "Hand luggage: 1 item"
                },
                name: "Hand baggage",
                text: "1 item max. 10 kg (56x40x25cm) included.",
                units: 1
            },
            {
                code: "EQBODEGA",
                message: "With a fee.",
                title: "Checked baggage not included",
                extendedInfo: {
                    code: "CA_0_PIEZAS",
                    conditionStatus: false,
                    message: "With a fee.",
                    title: "Checked baggage not included"
                },
                name: "Baggage in hold",
                text: "With a fee.",
                units: 1
            }
        ],
        sliceBaggage: {
            hold: {},
            passBaggages: [{
                baggageData : {},
                passengerId: 'ADULT_01',
                extraHold : '',
                totalHold : 2
            }]
        }
    };
    let infoManagementManagePassengers = {
        managePassengers: [{
            passengerId: 'ADULT_01',
            personalInfo: {
                name: 'testname',
                surname: 'test',
                birthDate: ''
            },
            modifiedPersonalInfo: false
        }],
        orderItems: {
            baggage: [{
                sliceId: 'MADJFK20231124161000',
                amount: 50,
                passengerId: 'ADULT_01'
            }]
        }
    };

    const actualFlightSliceSpeqs = {
        sliceId: 'MADJFK20231124161000',
        fareFamilyConditions: [
            {
                code: "EQMANO",
                message: "1 item max. 10 kg (56x40x25cm) and 1 personal accessory included",
                title: "Hand luggage: 1 item",
                extendedInfo: {
                    code: "CA_EQP_MANO_10KG",
                    conditionStatus: true,
                    message: "1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator.",
                    title: "Hand luggage: 1 item"
                },
                name: "Hand baggage",
                text: "1 item max. 10 kg (56x40x25cm) included.",
                units: 1
            },
            {
                code: "EQBODEGA",
                message: "With a fee.",
                title: "Checked baggage not included",
                extendedInfo: {
                    code: "CA_0_PIEZAS",
                    conditionStatus: false,
                    message: "With a fee.",
                    title: "Checked baggage not included"
                },
                name: "Baggage in hold",
                text: "With a fee.",
                units: 1
            }
        ],
        sliceSpeqs: {
            passBaggages: [{
                hold: {},
                baggageData : {},
                passengerId: 'ADULT_01',
                extraHold : '',
                totalHold : '',
                Speqs: [
                    {subtype: 'BICYCLE'},
                    {subtype: 'GOLF_EQUIPMENT'},
                    {subtype: 'SKI_SNOW'},
                    {subtype: 'SCUBA_DIVING'},
                    {subtype: 'FISHING_EQUIPMENT'},
                    {subtype: 'SURFBOARD'},
                ]
            }]
        }
    };
    const infoManagementSpecialEquipment = {
        managePassengers: [{
            passengerId: 'ADULT_01',
            personalInfo: {
                name: 'testname',
                surname: 'test',
                birthDate: ''
            },
            modifiedPersonalInfo: false
        }],
        orderItems: {
            specialEquipment: [{
                sliceId: 'MADJFK20231124161000',
                amount: 50,
                passengerId: 'ADULT_01',
                subtype: 'BICYCLE',
            },
            {
                sliceId: 'MADJFK20231124161000',
                amount: 50,
                passengerId: 'ADULT_01',
                subtype: 'GOLF_EQUIPMENT'
            },
            {
                sliceId: 'MADJFK20231124161000',
                amount: 50,
                passengerId: 'ADULT_01',
                subtype: 'SKI_SNOW'
            },
            {
                sliceId: 'MADJFK20231124161000',
                amount: 50,
                passengerId: 'ADULT_01',
                subtype: 'SCUBA_DIVING'
            },
            {
                sliceId: 'MADJFK20231124161000',
                amount: 50,
                passengerId: 'ADULT_01',
                subtype: 'FISHING_EQUIPMENT'
            },
            {
                sliceId: 'MADJFK20231124161000',
                amount: 50,
                passengerId: 'ADULT_01',
                subtype: 'SURFBOARD'
            }]
        }
    };

    const transformedInfoBaggageModel = { ancillariesInfo: {
        ancillariesAvailable: ['SPECIAL_MEALS'],
        passengerBaggagesTrips: [{
            totalBaggages: 1,
            totalExtraBaggages23: 1,
            trips: [{
                id: 'MADJFK20231124161000',
                pieces: [{
                    subtype: 'BAGGAGE_23',
                    quantySelected: 1,
                    extraPieces: 0
                }],
                piecesChoosed: 1
            }]
        }]
    }};
    const actualFlightBaggageModel = {
        sliceId: 'MADJFK20231124161000',
        fareFamilyConditions: [
            {
                code: "EQMANO",
                message: "1 item max. 10 kg (56x40x25cm) and 1 personal accessory included",
                title: "Hand luggage: 1 item",
                extendedInfo: {
                    code: "CA_EQP_MANO_10KG",
                    conditionStatus: true,
                    message: "1 item max. 10 kg (56x40x25cm) and 1 personal accessory included, on flights operated by oneworld airlines. For all other airlines, check with the flight operator.",
                    title: "Hand luggage: 1 item"
                },
                name: "Hand baggage",
                text: "1 item max. 10 kg (56x40x25cm) included.",
                units: 1
            },
            {
                code: "EQBODEGA",
                message: "With a fee.",
                title: "Checked baggage not included",
                extendedInfo: {
                    code: "CA_0_PIEZAS",
                    conditionStatus: false,
                    message: "With a fee.",
                    title: "Checked baggage not included"
                },
                name: "Baggage in hold",
                text: "With a fee.",
                units: 1
            }
        ],
        sliceBaggage: {
            hold: {},
            passBaggages: [{
                baggageData : {},
                passengerId: 'ADULT_01',
                extraHold : '',
                totalHold : 2
            }]
        }
    };
    const InfoManagementBaggageModel = {
        managePassengers: [{
            passengerId: 'ADULT_01',
            personalInfo: {
                name: 'testname',
                surname: 'test',
                birthDate: ''
            },
            modifiedPersonalInfo: false
        }],
        flights: [
            actualFlightBaggageModel
        ],
        orderItems: {
            seat: [
                {
                    segmentId: 'ADULT',
                    passengerId: 'ADULT',
                    emd: ''
                }
            ],
            baggage: [{
                sliceId: 'MADJFK20231124161000',
                amount: 50,
                passengerId: 'ADULT_01'
            }]
        }
    };
    const noInfantPass = [
        {
            passengerId: 'ADULT',
            personalInfo: {
                name: 'name',
                surname: 'surname',
                infant: 'infant'
            }
        }
    ];
    const flightsSlicesBaggageModel = [
        {
            segments: [
                {
                    segmentId: 'ADULT',
                    arrivalCity: {
                        city: {
                            description: 'description'
                        },
                        code: 'code'
                    }
                }
            ]
        }
    ];

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [AncillariesDashboardTransformer],
        });
        transformer = new AncillariesDashboardTransformer(
            fakeBookingDashboardConstants,
            fakeMmBAppConstants,
            fakeLocalStorageService,
            filterFake,
            fakeCurrencyService,
            fakeInvoiceDashboardTransformer);
        fakeLocalStorageService.set('phonesListIBV', fakePhonesListIBV);
        fakeLocalStorageService.set('bookingInfo', fakeBookingInfo);
        fakeLocalStorageService.set('ancillariesInfo', fakeAncillariesInfo);
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('and checkAncillariesInTime', () => {
         let actualDate = dayjs(new Date());
        const transformedInfo = {
            yourFlightsModel: {
                allSegments: [{
                    flight: {operationalCarrier: {code: 'IB'}},
                    departureDateParsed: {originalDate: dayjs(actualDate).add(1,'hour')}
                }]
            }
        };
        it(' have been called', (done) => {
            const result = transformer.checkAncillariesInTime('', null);
            expect(result).toBeDefined();
            done();
        });

        it('Should Ancillaries Available SPECIAL_MEALS', (done) => {
            const ancillariesAvailable = ['SPECIAL_MEALS'];
            const result = transformer.checkAncillariesInTime(ancillariesAvailable, transformedInfo, false);
            expect(result).toBeDefined();
            done();
        });
        it('Should Ancillaries OTHER', (done) => {
            const ancillariesAvailable = ['OTHER'];
            const result = transformer.checkAncillariesInTime(ancillariesAvailable, transformedInfo, false);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and isSpecialMealsAvailable', () => {
        it('Should defined and NOT ancillariesAvailable', (done) => {
            const transformedInfo = { ancillariesInfo: { ancillariesAvailable: []}};
            const result = transformer.isSpecialMealsAvailable(transformedInfo);
            expect(result).toBeDefined();
            expect(result).toEqual(false);
            done();
        });
        it('Should ancillariesAvailable', (done) => {
            const transformedInfo = { ancillariesInfo: { ancillariesAvailable: ['SPECIAL_MEALS']}};
            const result = transformer.isSpecialMealsAvailable(transformedInfo);
            expect(result).toEqual(true);
            done();
        });
    });

    describe('and removeAncillariesIfAlreadyPurchased', () => {
        it('Should Empty breakdownInfo', (done) => {
            const result = transformer.removeAncillariesIfAlreadyPurchased({}, {});
            expect(result).toBeUndefined();
            done();
        });
        it('Should any options', (done) => {
            const transformedInfo = { ancillariesInfo: { ancillariesAvailable: ['SPECIAL_MEALS']}};
            const breakDownInfo = {issuedItems: [{
                type: 'CO2_FOOTPRINT'
            }]};
            const result = transformer.removeAncillariesIfAlreadyPurchased(transformedInfo, breakDownInfo);
            expect(result).toBeDefined();
            done();

        });
    });

    describe('and generateManagementMeals', () => {
        it('Should generateManagementMeals defined', (done) => {
            const result = transformer.generateManagementMeals(fakeBookingInfo);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and createInfoManagementBaggagesModel', () => {
        it('Should createInfoManagementBaggagesModel defined', (done) => {
            transformer.createInfoManagementBaggagesModel(transformedInfoPassengerBaggagesTrips, actualFlightSliceBaggage, infoManagementManagePassengers);
            expect(actualFlightSliceBaggage.sliceBaggage.hold).toEqual({
                name: 'Translated Text',
                totalUnits: 50,
                totalglobal: 50
            });
            done();
        });
    });

    describe('and createInfoManagementSpeqsModel', () => {
        it('Should createInfoManagementSpeqsModel defined', (done) => {
            const result = transformer.createInfoManagementSpeqsModel(null, null);
            expect(result).toBeUndefined();
            done();
        });

        it('Should createInfoManagementSpeqsModel any results', (done) => {
            const transformedInfo = {
                ancillariesInfo: {
                    ancillariesAvailable: ['SPECIAL_MEALS'],
                    speqsQuanty: 1
                }
            };
            

            transformer.createInfoManagementSpeqsModel(transformedInfo, actualFlightSliceSpeqs, infoManagementSpecialEquipment);
            expect(actualFlightSliceSpeqs.sliceSpeqs.passBaggages[0].Speqs[0].subtype).toEqual('SPEQS_BICYCLE');
            expect(actualFlightSliceSpeqs.sliceSpeqs.passBaggages[0].Speqs[1].subtype).toEqual('SPEQS_GOLF_EQUIPMENT');
            expect(actualFlightSliceSpeqs.sliceSpeqs.passBaggages[0].Speqs[2].subtype).toEqual('SPEQS_SKI_SNOW');
            expect(actualFlightSliceSpeqs.sliceSpeqs.passBaggages[0].Speqs[3].subtype).toEqual('SPEQS_SCUBA_TITLE');
            expect(actualFlightSliceSpeqs.sliceSpeqs.passBaggages[0].Speqs[4].subtype).toEqual('SPEQS_FISHING_TITLE');
            expect(actualFlightSliceSpeqs.sliceSpeqs.passBaggages[0].Speqs[5].subtype).toEqual('SPEQS_SURFBOARD_TITLE');
            done();
        });
    });

    describe('and generateCardInfo', () => {
        it('Should generateCardInfo defined', (done) => {
            
            transformer.generateCardInfo(dataCardInfo, transformerInfoManagementModel, breakDownInfoBundles);
            expect(dataCardInfo.flights[0].upgradingBids).toEqual(dataCardInfo.orderItems.upgradingBid[0]);
            done();
        });
    });

    describe('and specialMealInitialize', () => {
        it(' have been called', (done) => {
            const meal = { segments: []}
            const result = transformer.specialMealInitialize(meal);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and getSegmentAvailableInAncillaries', () => {
        it(' have been called', (done) => {
            const result = transformer.getSegmentAvailableInAncillaries(null, []);
            expect(result).toBeUndefined();
            done();
        });
    });

    describe('and generateMealsPreSelected', () => {
        it(' have been called', (done) => {
            const result = transformer.generateMealsPreSelected(null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and setTotalQuantitySlice', () => {
        it(' have been called', (done) => {
            const result = transformer.setTotalQuantitySlice(null, []);
            expect(result).toBeUndefined();
            done();
        });
    });

    describe('and addInfoBaggage', () => {
        it('Should addInfoBaggage defined', (done) => {
            let actualData = [{
                subtype: 'BAGGAGE_23',
                purchasedPieces: {}
            }];

            let baggageTrip = {
                subtype: 'BAGGAGE_23'
            };

            let totalQuantitySlicePerPassenger = [{
                passengerId: 'ADULT_01',
                totalExtraBaggages23: 1
            }];

            const result = transformer.addInfoBaggage(actualData, baggageTrip, 'ADULT_01', totalQuantitySlicePerPassenger);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and getDescription', () => {
        it('Should BAGGAGE_15', (done) => {
            const result = transformer.getDescription('BAGGAGE_15');
            expect(result).toBeDefined();
            expect(result).toEqual(fakeBookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES_DESCRIPTION.BAGGAGE_15);
            done();
        });
        it('Should BAGGAGE_23', (done) => {
            const result = transformer.getDescription('BAGGAGE_23');
            expect(result).toEqual(fakeBookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES_DESCRIPTION.BAGGAGE_23);
            done();
        });
        it('Should BAGGAGE_32', (done) => {
            const result = transformer.getDescription('BAGGAGE_32');
            expect(result).toEqual(fakeBookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES_DESCRIPTION.BAGGAGE_32);
            done();
        });
    });

    describe('and fillInfoManagementWithPackageProducts', () => {
        it(' have been called', (done) => {
            const InfoManagement = {
                orderItems: {
                    packagedProduct: []
                }
            }
            const result = transformer.fillInfoManagementWithPackageProducts(null, InfoManagement);
            expect(result).toBeDefined();
            done();
        });

        it(' fill print urls', (done) => {
            const InfoManagement = {
                orderItems: {
                    packagedProduct: [
                        {
                            products: [
                                {type: 'hotel'},
                                {type: 'vehicle'},
                                {type: 'flightItinerary'},
                                {type: 'experience'},
                                {type: 'transfer'},
                            ],
                            printVoucherUrl: 'printVoucherUrl'
                        }
                    ]
                }
            };
            const fakePrint = {
                printVoucherUrlHotel: 'printVoucherUrl',
                printVoucherUrlVehicle: 'printVoucherUrl',
                printVoucherUrlItinerary: 'printVoucherUrl',
                printVoucherUrlExperience: 'printVoucherUrl',
                printVoucherUrlTransfer: 'printVoucherUrl'
            }
            const result = transformer.fillInfoManagementWithPackageProducts(null, InfoManagement);
            expect(result).toEqual(fakePrint);
            done();
        });
    });

    describe('and manageAncillariesSeatByBaggageModel', () => {
        it(' have been called', (done) => {
            const transformedInfo = { ancillariesInfo: {
                ancillariesAvailable: ['SPECIAL_MEALS'],
                passengerBaggagesTrips: [{
                    totalBaggages: 1,
                    totalExtraBaggages23: 1,
                    trips: [{
                        id: 'MADJFK20231124161000',
                        pieces: [{
                            subtype: 'BAGGAGE_23',
                            quantySelected: 1,
                            extraPieces: 0
                        }],
                        piecesChoosed: 1
                    }]
                }]
            }};
            const InfoManagement = {flights:[]};
            transformer.manageAncillariesSeatByBaggageModel(InfoManagement, null, null, transformedInfo);
            done();
        });

        it(' fill seats', (done) => {
            
            transformer.manageAncillariesSeatByBaggageModel(InfoManagementBaggageModel, noInfantPass, flightsSlicesBaggageModel, transformedInfoBaggageModel);
            done();
        });
    });

    describe('and manageVehicleInfo', () => {
        it(' have been called', (done) => {
            transformer.manageVehicleInfo(null, null);
            done();
        });

        it(' fill info', (done) => {
            const InfoManagement = {
                orderItems: {
                    vehicle: [
                        {
                            pickupDateTime: null,
                            returnDateTime: null,
                            provider: {
                                code: null
                            }
                        }
                    ]
                }
            }
            transformer.manageVehicleInfo(InfoManagement, 'url');
            done();
        });
    });

    describe('and manageHotelInfo', () => {
        it(' have been called', (done) => {
            transformer.manageHotelInfo(null, null);
            done();
        });

        it(' fill info', (done) => {
            const InfoManagement = {
                orderItems: {
                    hotel: [
                        {
                            checkInDateTime: null,
                            checkOutDateTime: null
                        }
                    ]
                }
            }
            transformer.manageHotelInfo(InfoManagement, 'url');
            done();
        });
    });

    describe('and manageAncillariesThirdPartyCompanies', () => {
        it(' have been called', (done) => {
            transformer.manageAncillariesThirdPartyCompanies(null, null);
            done();
        });

        it(' fill thirdPartyCompanies', (done) => {
            const ancillariesInfo = {
                ancillaries: [
                    {
                        thirdPartyCompanies: [
                            {
                                segmentIds: ['ADULT']
                            }
                        ]
                    }
                ]
            };
            const InfoManagement = {
                flights: [
                    {
                        segmentId: 'ADULT'
                    }
                ]
            };
            transformer.manageAncillariesThirdPartyCompanies(ancillariesInfo, InfoManagement);
            done();
        });
    });

    describe('and manageAncillariesPriorityBoarding', () => {
        it(' have been called', (done) => {
            transformer.manageAncillariesPriorityBoarding(null, null);
            done();
        });

        it(' fill priority boarding', (done) => {
            const InfoManagement = {
                flights: [
                    {
                        seats: [],
                        departureCity: {
                            city: {
                                description: 'description'
                            },
                            code: 'code'
                        },
                        segmentId: 'ADULT',
                    }
                ],
                orderItems: {
                    priorityBoarding: [
                        {
                            segmentId: 'ADULT',
                            passengerId: 'ADULT',
                            emd: ''
                        }
                    ]
                },
                managePassengers: [
                    {
                        personalInfo: {
                            name: "test",
                            surname: "test ",
                            birthDate: null
                        },
                        passengerId: "ADULT"
                    }
                ]
            };
            const flightsSlicesPriority = [
                {
                    segments: [
                        {
                            segmentId: 'ADULT',

                        }
                    ],
                    arrivalCity: {
                        city: {
                            description: 'description'
                        },
                        code: 'code'
                    },
                    departureCity: {
                        city: {
                            description: 'description'
                        },
                        code: 'code'
                    }
                }
            ];
            transformer.manageAncillariesPriorityBoarding(InfoManagement, flightsSlicesPriority);
            done();
        });
    });

    describe('and manageAncillariesSeatBySpeqsModel', () => {
        it(' have been called', (done) => {
            const InfoManagement = {flights:[]};
            transformer.manageAncillariesSeatBySpeqsModel(InfoManagement, null);
            done();
        });

        it(' fill seats', (done) => {
            const InfoManagement = {
                flights: [
                    {
                        seats: [],
                        departureCity: {
                            city: {
                                description: 'description'
                            },
                            code: 'code'
                        },
                        segmentId: 'ADULT',
                    }
                ],
                orderItems: {
                    seat: [
                        {
                            segmentId: 'ADULT',
                            passengerId: 'ADULT',
                            emd: ''
                        }
                    ]
                }
            };
            const flightsSlices = [
                {
                    segments: [
                        {
                            segmentId: 'ADULT',
                            arrivalCity: {
                                city: {
                                    description: 'description'
                                },
                                code: 'code'
                            }
                        }
                    ]
                }
            ];
            transformer.manageAncillariesSeatBySpeqsModel(InfoManagement, flightsSlices);
            done();
        });
    });
});
