import { TestBed } from "@angular/core/testing";
import { BookingDashboardTransformer } from "@src/components/ib-MmB-booking-dashboard/transformer/ib-MmB-booking-dashboard-transformer";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';

describe('BookingDashboardTransformer Test', () => {
    let fakeLocalStorageService: StorageServiceMock = new StorageServiceMock();

    const case1GetBookingInfo = require('./mocks/get-booking-info.json');
    const case1AncillariesInfo = require('./mocks/ancillaries-info.json');
    const case1BreakDownInfo = require('./mocks/break-down-info.json');
    const itemsByType = require('./mocks/items-by-type.json');
    const generateFlagsMenu = require('./mocks/generate-flags-menu.json');
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
        IAG_MARKETING_CODE_CARRIER: ['IB', 'YW', 'I2', 'I0', '0I'],
        QUALIFIERS: {
            HOLA_MADRID: 'HOLAMADRID',
            IBERIA_HOLIDAYS: 'IBDPHOLIDAYS',
            GROUP_PNR: 'GROUP_PNR'
        }
    };
    const fakeMmBUtilService:any = {
        getElementsByProperty: jasmine.createSpy().and.callFake(() => {
            return itemsByType;
        }),
        formatDisruptionAndFlexibilizationDates: jasmine.createSpy(),
        generateSummaryModel: jasmine.createSpy(),
        getBackGroundURL: jasmine.createSpy(),
        getCompanyURL: jasmine.createSpy(),
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
        APIS_STATUS: {
            APIS_DOCUMENT_INFO: 'APIS_DOCUMENT_INFO',
            APIS_STATUS_INFO: 'APIS_STATUS_INFO'
        },
        QUALIFIERS: 'IBDPHOLIDAYS',
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
        OPERATIONAL_IBERIA_GROUP: ['YW','IB','I2','LV','I0','0I','EB','E9','LL','P6','3L']
    };
    const fakeCurrencyService = {
        getCurrenciesAsMap: jasmine.createSpy(),
        getCurrencyObject: jasmine.createSpy(),
        formatPrice: jasmine.createSpy()
    };
    const fakeContentPreprocessorService = {};
    const fake$translate = {};
    const fakeCommonsGetWcsPhonesService = {
        getPhoneByCode: jasmine.createSpy()
    };
    const fakeIbFlagsTransformer = {
        generateFlagsMenu: jasmine.createSpy().and.callFake(() => generateFlagsMenu)
    };
    let transformer;

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

    let fakeMmBUtilsSharedService:any = {
        getPrefixFromMarket: jasmine.createSpy().and.callFake(() => {
            return { code: 34, countryCode: 'España' };
        }),
        generateSegmentsInfo: jasmine.createSpy(),

    };

    const fakeAncillariesDashboardTransformer = {
        generateManagementMeals: jasmine.createSpy(),
        generateCardInfo: jasmine.createSpy(),
        createInfoManagementBaggagesModel: jasmine.createSpy(),
        checkAncillariesInTime: jasmine.createSpy(),
        isSpecialMealsAvailable: jasmine.createSpy(),
        removeAncillariesIfAlreadyPurchased: jasmine.createSpy(),
        createInfoManagementSpeqsModel: jasmine.createSpy(),
        manageAncillariesPriorityBoarding: jasmine.createSpy(), 
        manageAncillariesSeatByBaggageModel: jasmine.createSpy(),
        manageAncillariesThirdPartyCompanies: jasmine.createSpy(),
        manageAncillariesSeatBySpeqsModel: jasmine.createSpy(),
        setPackagedProduct: jasmine.createSpy(),
        manageHotelInfo: jasmine.createSpy(),
        manageVehicleInfo: jasmine.createSpy(),
        setManagementInsurances: jasmine.createSpy(),
        handleTransformedInfoAncillariesInfo: jasmine.createSpy(),
    };

    const needsByPassenger = [
        {
            serviceCode: 'BLND',
            text: '',
            description: 'SPECIAL_NEED_STATUS_HK',
            status: ''
        },
        {
            serviceCode: 'DPNA',
            text: '',
            description: 'SPECIAL_NEED_STATUS_HK',
            status: ''
        },
        {
            serviceCode: 'DEAF',
            text: '',
            description: 'SPECIAL_NEED_STATUS_HK',
            status: ''
        },
        {
            serviceCode: 'SVAN',
            text: '',
            description: 'SPECIAL_NEED_STATUS_HK',
            status: {
                code: 'HK'
            }
        },
        {
            serviceCode: 'WCHR',
            text: '',
            description: 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS',
            status: ''
        }
    ];
    const fakeStructureSpecialNeeds = {
        specialVision: true,
        specialIntellectual: true,
        specialHearing: true,
        specialGuideDog: true,
        specialWheelchair: true,
        specialGuideDogStatus: 'HK',
        specialWheelchairValue: 'WCHR',
        values: [
            {
                serviceCode: 'BLND',
                text: '',
                description: 'SPECIAL_NEED_STATUS_HK',
                status: ''
            },
            {
                serviceCode: 'DPNA',
                text: '',
                description: 'SPECIAL_NEED_STATUS_HK',
                status: ''
            },
            {
                serviceCode: 'DEAF',
                text: '',
                description: 'SPECIAL_NEED_STATUS_HK',
                status: ''
            },
            {
                serviceCode: 'SVAN',
                text: '',
                description: 'SPECIAL_NEED_STATUS_HK',
                status: { code: 'HK', description: 'SPECIAL_NEED_STATUS_HK' }
            },
            {
                serviceCode: 'WCHR',
                text: '',
                description: 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS',
                status: ''
            }
        ]
    };

    let fakeAncillariesTransformerService = {
        generateAncillariesManageMyBooking: jasmine.createSpy().and.returnValue({
            isCurrencyLong: {},
            ancillariesAvailable: {} 
        })
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [BookingDashboardTransformer],
        });
        transformer = new BookingDashboardTransformer(
            fakeLocalStorageService,
            filterFake,
            fakeBookingDashboardConstants,
            fakeMmBUtilService,
            fakeMmBUtilsSharedService,
            fakeMmBAppConstants,
            fakeCurrencyService,
            fakeContentPreprocessorService,
            fake$translate,
            fakeCommonsGetWcsPhonesService,
            fakeIbFlagsTransformer,
            fakeAncillariesDashboardTransformer,
            fakeAncillariesTransformerService);
        fakeLocalStorageService.set('phonesListIBV', fakePhonesListIBV);
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('and transformBookingDashBoardInfo', () => {
        it(' with reshopConditions callCenter true', (done) => {
            fakeLocalStorageService.set('reshopConditions', {callcenterInfo: {enabled: true}, involuntaryChanges: {enabled: false}, voluntaryChanges: {enabled: false}});
            transformer.transformBookingDashBoardInfo(case1GetBookingInfo, case1AncillariesInfo, case1BreakDownInfo);
            expect(transformer.transformedInfo.flags.displayCCPhone).toEqual(true); 
            expect(transformer.transformedInfo.flags.hideChangeFlightMenuOption).toEqual(true);
            done();
        });
        it(' with reshopConditions involuntaryChanges true', (done) => {
            fakeLocalStorageService.set('reshopConditions', {callcenterInfo: {enabled: false}, involuntaryChanges: {enabled: true}, voluntaryChanges: {enabled: false}});
            transformer.transformBookingDashBoardInfo(case1GetBookingInfo, case1AncillariesInfo, case1BreakDownInfo);
            expect(transformer.transformedInfo.flags.showFlexibilizationChangeSection).toEqual(true);
            expect(transformer.transformedInfo.flags.showVoluntaryChangeFlightSection).toEqual(false);
            done();
        });
        it(' with reshopConditions voluntaryChanges true', (done) => {
            fakeLocalStorageService.set('reshopConditions', {callcenterInfo: {enabled: false}, involuntaryChanges: {enabled: false}, voluntaryChanges: {enabled: true}});
            transformer.transformBookingDashBoardInfo(case1GetBookingInfo, case1AncillariesInfo, case1BreakDownInfo);
            expect(transformer.transformedInfo.flags.showFlexibilizationChangeSection).toEqual(false);
            expect(transformer.transformedInfo.flags.showVoluntaryChangeFlightSection).toEqual(true);
            done();
        });
        it(' without reshopConditions', (done) => {
            fakeLocalStorageService.set('reshopConditions', null);
            fakeLocalStorageService.set('voucherPriceInfo', false);
            transformer.transformBookingDashBoardInfo(case1GetBookingInfo, case1AncillariesInfo, case1BreakDownInfo);
            expect(transformer.transformedInfo.flags.displayCCPhone).toEqual(true);
            expect(transformer.transformedInfo.flags.hideChangeFlightMenuOption ).toEqual(true);
            done();
        });
        it(' with AncillariesInfo', (done) => {
            spyOn(fakeAncillariesDashboardTransformer, 'removeAncillariesIfAlreadyPurchased');
            let fakeBookingInfo = {...case1GetBookingInfo};
            fakeBookingInfo.relatedContent = [{test:'test'}];
            fakeBookingInfo.qualifiers = [{name: 'IBDPHOLIDAYS'}];
            fakeLocalStorageService.set('voucherPriceInfo', true);
            transformer.transformedInfo.ancillariesInfo = {ancillariesAvailable: true};
            transformer.transformBookingDashBoardInfo(fakeBookingInfo, case1AncillariesInfo, case1BreakDownInfo);
            expect(fakeAncillariesDashboardTransformer.removeAncillariesIfAlreadyPurchased).toHaveBeenCalled();
            done();
        });
        
    });

    describe('and transformMarket', () => {
        it(' have been called', (done) => {
            const getBookingInfo = { warnings: []}
            const result = transformer.transformMarket(getBookingInfo);
            expect(result).toBeDefined();
            done();
        });

        it(' with warnings', (done) => {
            const getBookingInfo = { warnings: [{code: 'SSE_MMB_0005'}], contextMetadata: { country: 'country'}}
            const result = transformer.transformMarket(getBookingInfo);
            expect(result).toBeTrue();
            done();
        });
    });

    describe('and generateFormatSpecialNeeds', () => {
        it(' have been called', (done) => {
            const result = transformer.generateFormatSpecialNeeds([]);
            expect(result).toBeDefined();
            done();
        });

        it(' all special needs', (done) => {
            const result = transformer.generateFormatSpecialNeeds(needsByPassenger);
            expect(result).toEqual(fakeStructureSpecialNeeds);
            done();
        });
    });

    describe('and checkTimeToRedirectCKI', () => {
        it(' have been called', (done) => {
            const result = transformer.checkTimeToRedirectCKI(null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and checkQualifiers', () => {
        it(' have been called', (done) => {
            const result = transformer.checkQualifiers([]);
            expect(result).toBeDefined();
            done();
        });

        it(' is IBDPHOLIDAYS', (done) => {
            const result = transformer.checkQualifiers([{name: 'IBDPHOLIDAYS'}]);
            expect(result).toBeFalse();
            done();
        });
    });

    //generateBookingGeneralInfo

    //generateSummaryInfo

    describe('and generateTimeLineInfo', () => {
        it(' have been called', (done) => {
            const summaryInfo = { departureInfo: { originalDate: '2023-11-03T06:45:00+01:00' }};
            const result = transformer.generateTimeLineInfo([], summaryInfo, null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generateFlightsInfo', () => {
        it(' have been called', (done) => {
            const result = transformer.generateFlightsInfo([], null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and getFareFamilyConditions', () => {
        it(' have been called', (done) => {
            const result = transformer.getFareFamilyConditions(null, []);
            expect(result).toBeDefined();
            done();
        });
    });
    
    // describe('When getFareFamilyConditions() is called', () => {
    //     it('Should return value', (done) => {
    //         let response = transformer.getFareFamilyConditions('es', [{commercialCode: 'es', commercialName: 'testa', cabinType:'testtype', conditions: [{code:'testcode', name: 'testname', extendedInfo: {title: 'testtitle', message: 'testmessage'}, units: '€'}]}]);
    //         //expect(response).toEqual({cabin: 'testa', cabinType: 'testtype', code: 'testcode', name: 'testname', title: 'testtitle', message: 'testmessage', units: '€'});
    //         done();
    //     });
    // });

    describe('and noIberiaFlagControl', () => {
        it(' have been called', (done) => {
            const flight = { operationalCarrier: { code: 'XX' }};
            const result = transformer.noIberiaFlagControl(flight);
            expect(result).toBeDefined();
            done();
        });
        it('should return false for allowed airline code "E9"', () => {
            const flight = { operationalCarrier: { code: 'E9' } };
            const result = transformer.noIberiaFlagControl(flight);
            expect(result).toBe(false);
        });
        it('should return false for allowed airline code "EB"', () => {
            const flight = { operationalCarrier: { code: 'EB' } };
            const result = transformer.noIberiaFlagControl(flight);
            expect(result).toBe(false);
        });
        it('should return false for allowed airline code "LL"', () => {
            const flight = { operationalCarrier: { code: 'LL' } };
            const result = transformer.noIberiaFlagControl(flight);
            expect(result).toBe(false);
        });
        it('should return false for allowed airline code "3L"', () => {
            const flight = { operationalCarrier: { code: '3L' } };
            const result = transformer.noIberiaFlagControl(flight);
            expect(result).toBe(false);
        });
    });

    describe('and generatePassengersInfo', () => {
        it(' have been called', (done) => {
            const order = { slices: [{ passengerFlags: [] }]};
            let paramsPassengerInfo = {flowId:null, passengers: [], primaryContactInfo:{}, order, obProgram:null, relatedContentByKey:null, ticketsByPassenger:null, itemsByType:null, specialNeedsByPassenger:null};
            const result = transformer.generatePassengersInfo(paramsPassengerInfo);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and getPassengerNameById', () => {
        it(' have been called', (done) => {
            const result = transformer.getPassengerNameById(null, []);
            expect(result).toBeDefined();
            done();
        });

        it(' with external personal info', (done) => {
            const passenger = [
                {
                    passengerId: 'passengerId',
                    externalPersonalInfo: {
                        name: 'name',
                        firstSurname: 'firstSurname',
                        lastSurname: 'lastSurname'
                    }
                }
            ];
            const result = transformer.getPassengerNameById('passengerId', passenger);
            expect(result).toEqual('name firstSurname lastSurname');
            done();
        });

        it(' with personal info', (done) => {
            const passenger = [
                {
                    passengerId: 'passengerId',
                    personalInfo: {
                        name: 'name',
                        surname: 'surname'
                    }
                }
            ];
            const result = transformer.getPassengerNameById('passengerId', passenger);
            expect(result).toEqual('name surname');
            done();
        });
    });

    describe('and generateEmergencyContactInfoModel', () => {
        it(' have been called', (done) => {
            const result = transformer.generateEmergencyContactInfoModel([]);
            expect(result).toBeDefined();
            done();
        });

        it(' with passenger emergency contact info', (done) => {
            fakeLocalStorageService.set('phoneCodeList', [{code: 'countryCode'}]);
            const passenger = [
                {
                    emergencyContactInfo: {
                        name: 'name',
                        surname: 'surname',
                        phoneDetails: {
                            number: 'number',
                            countryCode: 'countryCode'
                        }
                    }
                }
            ];
            const fakeEmergencyContactInfo = {
                name: 'name surname',
                phone: 'number',
                countryCode: 'countryCode',
                code: 'countryCode',
                phoneDetails: {
                    number: 'number',
                    countryCode: 'countryCode'
                }
            };
            const result = transformer.generateEmergencyContactInfoModel(passenger);
            expect(result).toEqual(fakeEmergencyContactInfo);
            done();
        });

        it(' with passenger emergency contact info without name', (done) => {
            fakeLocalStorageService.set('phoneCodeList', [{code: 'countryCode'}]);
            const passenger = [
                {
                    emergencyContactInfo: {
                        surname: 'surname',
                        phoneDetails: {
                            number: 'number',
                            countryCode: 'countryCode'
                        }
                    }
                }
            ];
            const fakeEmergencyContactInfo = {
                name: 'surname',
                phone: 'number',
                countryCode: 'countryCode',
                code: 'countryCode',
                phoneDetails: {
                    number: 'number',
                    countryCode: 'countryCode'
                }
            };
            const result = transformer.generateEmergencyContactInfoModel(passenger);
            expect(result).toEqual(fakeEmergencyContactInfo);
            done();
        });
    });

    describe('and setCompanyFrequentFlyer', () => {
        it(' have been called', (done) => {
            const passenger = { passengerId: '1234' }
            const result = transformer.setCompanyFrequentFlyer(passenger);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and setAdditionalFFInfo', () => {
        it(' have been called', (done) => {
            const result = transformer.setAdditionalFFInfo([], null);
            expect(result).toBeDefined();
            done();
        });

        it(' add airline name', (done) => {
            const additionalFFInfo = [
                {
                    company: 'iataCompanyCode',
                }
            ];
            const dataLocal = [
                {
                    iataCompanyCode: 'iataCompanyCode',
                    airlineName: 'airlineName'
                }
            ];
            const fakeAdditionalFFInfo = [
                {
                    company: 'iataCompanyCode',
                    airlineName: 'airlineName'
                }
            ];
            const result = transformer.setAdditionalFFInfo(additionalFFInfo, dataLocal);
            expect(result).toEqual(fakeAdditionalFFInfo);
            done();
        });
    });

    describe('and setFrequentFlyerInfo', () => {
        it(' have been called', (done) => {
            const result = transformer.setFrequentFlyerInfo(null, []);
            expect(result).toBeDefined();
            done();
        });

        it(' have been called', (done) => {
            const frequentFlyerInfo = {
                company: 'iataCompanyCode',
                number: 'number'
            };
            const dataLocal = [
                {
                    iataCompanyCode: 'iataCompanyCode',
                    airlineName: 'airlineName'
                }
            ];
            const fakeObjectFrequentFlyer = {
                airlineName: 'airlineName',
                company: 'iataCompanyCode',
                number: 'number'
            }
            const result = transformer.setFrequentFlyerInfo(frequentFlyerInfo, dataLocal);
            expect(result).toEqual(fakeObjectFrequentFlyer);
            done();
        });
    });

    describe('and checkQualifierIBV', () => {
        it(' have been called', (done) => {
            const getBookingInfo = { qualifiers: []}
            const result = transformer.checkQualifierIBV(getBookingInfo);
            expect(result).toBeDefined();
            done();
        });

        it(' is ibpholdays', (done) => {
            const getBookingInfo = { qualifiers: [{name: 'IBDPHOLIDAYS'}]}
            const result = transformer.checkQualifierIBV(getBookingInfo);
            expect(result).toBeTrue();
            done();
        });
    });

    describe('and generateManagementInfo', () => {
        it(' have been called', (done) => {
            const getBookingInfo = {
                passengers: [],
                order: {
                    slices: []
                }
            };
            const ancillariesInfo = {
                ancillaries: []
            }
            const result = transformer.generateManagementInfo({itemsByType:null, getBookingInfo, ancillariesInfo, phonesListIBHolidays:null, infCheckDay:null, breakDownInfo:null});
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and manageNoInfantPass', () => {
        it(' have been called', (done) => {
            const InfoManagement = {managePassengers: []};
            const result = transformer.manageNoInfantPass(InfoManagement);
            expect(result).toBeDefined();
            done();
        });

        it(' fill no infants', (done) => {
            const InfoManagement = {
                managePassengers: [
                    {
                        passengerId: 'ADULT'
                    },
                    {
                        passengerId: 'INFANT',
                        personalInfo: {
                            name: 'name',
                            surname: 'surname'
                        },
                        relatedPassengerId: 'ADULT'
                    }
                ]
            };
            const result = transformer.manageNoInfantPass(InfoManagement);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and countInfants', () => {
        it(' have been called', (done) => {
            const result = transformer.countInfants(3, 2);
            expect(result).toEqual(1);
            done();
        });
    });

    describe('and manageFlightsSlices', () => {
        it(' have been called', (done) => {
            const getBookingInfo = {order:{slices:[]}};
            const result = transformer.manageFlightsSlices(getBookingInfo, null);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and formatInfoManagementPackages', () => {
        it(' have been called', (done) => {
            transformer.formatInfoManagementPackages(null, null, null);
            done();
        });

        it(' fill info', (done) => {
            fakeLocalStorageService.set('commercialInfo', {currency: {symbol: "€"}});
            const InfoManagement = {
                packages: [
                    {
                        payment: {
                            pending: {
                                amount: 10,
                                dueDate: null
                            }
                        }
                    }
                ]
            };
            const getBookingInfo = {contextMetadata: {currencies: [{symbol: "€"}]}}
            transformer.formatInfoManagementPackages(InfoManagement, null, getBookingInfo);
            done();
        });
    });

    describe('and getApisStatus', () => {
        it(' have been called', (done) => {
            const result = transformer.getApisStatus([]);
            expect(result).toBeDefined();
            done();
        });

        it(' have external personal info and security information', (done) => {
            const passengerCollection = [
                {
                    personalInfo: {
                        name: 'name',
                        surname: 'surname'
                    },
                    externalPersonalInfo: {
                        name: 'externalPersonalInfo-name',
                        firstSurname: 'externalPersonalInfo-firstSurname',
                        lastSurname: 'externalPersonalInfo-lastSurname'
                    },
                    securityInformation: {
                        relatedContent: [
                            {
                                key: 'APIS_STATUS_INFO',
                                value: 'apisStatus'
                            }
                        ],
                        apisStatus: 'apisStatus'
                    }
                }
            ];
            const fakeResult = [
                {
                    personalInfo: {
                        name: 'externalPersonalInfo-name',
                        surname: 'externalPersonalInfo-firstSurname externalPersonalInfo-lastSurname'
                    },
                    externalPersonalInfo: {
                        name: 'externalPersonalInfo-name',
                        firstSurname: 'externalPersonalInfo-firstSurname',
                        lastSurname: 'externalPersonalInfo-lastSurname'
                    },
                    securityInformation: {
                        relatedContent: [
                            {
                                key: 'APIS_STATUS_INFO',
                                value: 'apisStatus'
                            }
                        ],
                        apisStatus: 'apisStatus'
                    }
                }
            ];
            const result = transformer.getApisStatus(passengerCollection);
            expect(result).toEqual(fakeResult);
            done();
        });
    });

    // describe('and createInfoManagementPriorityModel', () => {
    //     it(' have been called', (done) => {
    //         transformer.createInfoManagementPriorityModel(null, null);
    //         done();
    //     });

    //     it(' complete info', (done) => {
    //         const actualFlight = {
    //             "slicePriority": {
    //                 "passBaggages": [
    //                     {
    //                         "passengerType": "ADULT",
    //                         "personalInfo": {
    //                             "name": "test",
    //                             "surname": "test ",
    //                             "birthDate": null
    //                         },
    //                         "passengerId": "ADULT_01"
    //                     }
    //                 ],
    //                 "hold": {
    //                     "passengerId": "ADULT_01",
    //                     "segmentId": "IB044820231124",
    //                     "totalUnits": 1
    //                 }
    //             },
    //             "segmentId": "IB044820231124"
    //         };
    //         const infoManagement = {
    //             "orderItems": {
    //                 "priorityBoarding": [
    //                     {
    //                         "type": "priorityBoarding",
    //                         "orderItemId": "IB0a29288bc9e34f7eb78a1c721804aaafOP_06",
    //                         "price": {
    //                             "fare": 6,
    //                             "tax": 0,
    //                             "total": 6,
    //                             "currency": "EUR",
    //                             "ticketingFee": 0
    //                         },
    //                         "passengerId": "ADULT_01",
    //                         "segmentId": "IB044820231124",
    //                         "emd": "0755578292084",
    //                         "orderItemPaymentInfos": [],
    //                         "name": "test",
    //                         "surname": "test ",
    //                         "departureCity": "Madrid",
    //                         "departureCityCode": "MAD",
    //                         "arrivalCity": "Bilbao",
    //                         "arrivalCityCode": "BIO"
    //                     }
    //                 ]
    //             },
    //             "managePassengers": [
    //                 {
    //                     "personalInfo": {
    //                         "name": "test",
    //                         "surname": "test ",
    //                         "birthDate": null
    //                     },
    //                     "passengerId": "ADULT_01"
    //                 }
    //             ]
    //         }
    //         transformer.createInfoManagementPriorityModel(actualFlight, infoManagement);
    //         done();
    //     });
    // });

    describe('and generateCompleteYourTripInfoStopOver', () => {
        it(' have been called', (done) => {
            const result = transformer.generateCompleteYourTripInfoStopOver([]);
            expect(result).toBeDefined();
            done();
        });

        it(' is stop over', (done) => {
            const qualifiers = [{name: 'HOLAMADRID'}];
            const result = transformer.generateCompleteYourTripInfoStopOver(qualifiers);
            expect(result).toBeTrue();
            done();
        });
    });

    describe('and generateSeatBid', () => {
        let getBookingInfoSeatBid:any = {
                upgInformation: {
                    bidable: true
                }
            };
        it(' have been called', (done) => {
            const result = transformer.generateSeatBid();
            expect(result).toEqual({});
            done();
        });

        it(' fill seatBid', (done) => {
            let fakeBookingInfo = {...getBookingInfoSeatBid};
                fakeBookingInfo.upgInformation.url = 'url';
            const result = transformer.generateSeatBid(fakeBookingInfo);
            expect(result.url).toEqual('url');
            expect(result.bidable).toEqual('url');
            done();
        });

        it(' fill seatBid without URL', (done) => {
            let fakeBookingInfo = {...getBookingInfoSeatBid};
                fakeBookingInfo.upgInformation.url = null;
            const result = transformer.generateSeatBid(fakeBookingInfo);
            expect(result.url).toEqual(null);
            expect(result.bidable).toBeFalse();
            done();
        });
    });

    describe('and generateBidableInfo', () => {
        it(' have been called', (done) => {
            const result = transformer.generateBidableInfo();
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generateContactInfo', () => {
        it(' have been called', (done) => {
            const result = transformer.generateContactInfo();
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and generatePrimaryContactInfo', () => {
        it(' have been called', (done) => {
            const primaryContactInfo = { countryCode: null}
            const result = transformer.generatePrimaryContactInfo(primaryContactInfo);
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and statusSVAN', () => {
        it(' have been called', (done) => {
            const formatValue = {status: { code: 'HK', description: 'SPECIAL_NEED_STATUS_HK' }};
            const result = transformer.statusSVAN(formatValue);
            expect(result).toBeDefined();
            done();
        });

        it(' check HK', (done) => {
            const formatValue = {status: { code: 'HK', description: 'SPECIAL_NEED_STATUS_HK' }};
            const result = transformer.statusSVAN(formatValue);
            expect(result.description).toEqual('SPECIAL_NEED_STATUS_HK');
            done();
        });

        it(' check UC', (done) => {
            const formatValue = {status: { code: 'UC', description: 'SPECIAL_NEED_STATUS_XX' }};
            const result = transformer.statusSVAN(formatValue);
            expect(result.description).toEqual('SPECIAL_NEED_STATUS_XX');
            done();
        });

        it(' check DEFAULT', (done) => {
            const formatValue = {status: { code: '', description: 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS' }};
            const result = transformer.statusSVAN(formatValue);
            expect(result.description).toEqual('MMB_PASSENGERS_SPECIAL_NEEDS_STATUS');
            done();
        });
    });


});
