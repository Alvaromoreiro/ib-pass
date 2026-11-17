import * as angular from 'angular';
import { mockAncillariesHeaderInfo } from '@test/unit/app/shared/services/ib-datalayer/mocks/ancillaries-header-info';

describe('test for CkiDatalayerUtilsService', () => {
    let $rootScope, CkiDatalayerUtilsService, $timeout;
    type CkiDatalayerPrivateMethods = {
        CkiDatalayerConstants: typeof fake.CkiDatalayerConstants;
        addDataLayerInfo: (datalayerInfo: object) => void;
        addDigitalDataAllianzFusion: (extendedDatalayerInfo: object, headerModel: object) => void;
        addDigitalDataGlobickActivities: (headerModel: object, extendedDatalayerInfo: object) => void;
        addDigitalDataGlobickTransfer: (headerModel: object, extendedDatalayerInfo: object) => void;
        addDigitalDataSeatsInfoByType: (
            extendedDatalayerInfo: object,
            seatsByTypes: unknown[],
            headerSeatName: string,
            seatsTotalDigitalDataName: string,
            seatsTotalPriceDigitalDataName: string
        ) => void;
        mapSeatsForDigitalData: (headerModel: object, extendedDatalayerInfo: object) => void;
    };
    const getPrivateMethods = (): CkiDatalayerPrivateMethods =>
        CkiDatalayerUtilsService as unknown as CkiDatalayerPrivateMethods;
    const mockExtendedDatalayerInfo = {};
    const mock = {
        getDatalayerGeneral: {
            "idioma": "es",
            "mercado": "ES",
            "versionWeb": "angularjs",
            "modeWeb": "desktop",
            "detalleInicio": "por localizador",
            "quadrigam": "IBCOSE",
            "codigoSeguimiento": "es/ES/IBCOSE",
            "EstadoUsuario": "no_logado",
            "proceso": "checkin",
            "paso": "landing",
            "dynamic_pricing_seat": "NO"
        },
        getDigitalData: {
            "Language": "es",
            "Market": "ES",
            "VersionWeb": "angularjs",
            "ModeWeb": "desktop",
            "CheckinBy": "por localizador",
            "Quadrigam": "IBCOSE",
            "TrackingCode": "es/ES/IBCOSE",
            "UserStatus": "no_logado",
            "Process": "checkin",
            "Step": "landing"
        }
    };
    const fake = {
        CkiDataLayerService: {
            isDatalayerInit: jasmine.createSpy('isDatalayerInit').and.callFake(() => {}),
            initDatalayer: jasmine.createSpy('initDatalayer').and.callFake(angular.noop),
            setProcessAndStep: jasmine.createSpy().and.callFake(angular.noop),
            getDatalayerGeneral: jasmine.createSpy().and.callFake(angular.noop),
            resetDatalayer: jasmine.createSpy().and.callFake(angular.noop),
            addDataLayerGeneralInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDigitalDataForAncillaries: jasmine.createSpy().and.callFake(angular.noop)
        },
        CommonsConstants: require('test/constants/datalayer-cki-constants.json'),
        CommonsUtilService: {
            sha256: jasmine.createSpy('sha256').and.callFake(() => {}),
            getTypeSearch: jasmine.createSpy('getTypeSearch').and.callFake(() => {}),
            getProcess: jasmine.createSpy('getProcess').and.callFake(() => {}),
            getUserTypeByToken: jasmine.createSpy('getUserTypeByToken').and.callFake(() => {})
        },
        CommonsUserUtilsService: {
            getUserRole: jasmine.createSpy('getUserRole').and.callFake(() => {}),
            isIbPlus: jasmine.createSpy('isIbPlus').and.callFake(() => {}),
            isSoftUser: jasmine.createSpy('isSoftUser').and.callFake(() => {}),
            getFrequentFlyer: jasmine.createSpy('getFrequentFlyer').and.callFake(() => {}),
            isUserLoggedONB: jasmine.createSpy('isUserLoggedONB').and.callFake(() => {}),
            getUserTypeByToken: jasmine.createSpy('getUserTypeByToken').and.callFake(() => {})
        },
        CkiDigitalDataService: {
            isDigitalDataInit: jasmine.createSpy('isDigitalDataInit').and.callFake(() => {}),
            initDigitalData: jasmine.createSpy('initDigitalData').and.callFake(() => {}),
            addDigitalDataInfo: jasmine.createSpy('addDigitalDataInfo').and.callFake(() => {}),
            removeDigitalDataInfo: jasmine.createSpy('removeDigitalDataInfo').and.callFake(() => {}),
            getDigitalData: jasmine.createSpy('getDigitalData').and.callFake(() => {}),
            resetDigitalData: jasmine.createSpy('resetDigitalData').and.callFake(() => {}),
            emitEvent: jasmine.createSpy('emitEvent').and.callFake(() => {}),
            emitViewEvent: jasmine.createSpy('emitViewEvent').and.callFake(() => {}),
            emitInteractionEvent: jasmine.createSpy('emitInteractionEvent').and.callFake(() => {})
        },
        CkiDatalayerConstants: require('test/constants/datalayer-cki-constants.json'),
        MonetateUtilsService: {
            updateMonetateWithQuadrigam: jasmine.createSpy('updateMonetateWithQuadrigam').and.callFake(() => {})
        },
        MonetateConstants: {
            MONETATE_INFO: {
                SETPAGETYPE: 'setPageType'
            }
        },
        localStorageService: {
            get: jasmine.createSpy('get').and.callFake((key: string) => {
                if (key === 'policyAllianz') { return 'IBAESCAN'; }
                return null;
            }),
            set: jasmine.createSpy('set').and.callFake(angular.noop)
        }
    };

    angular.module('ib-commons-filters-module', [])
        .filter('EliminateHyphenFilter', function() {
            return function(input) {
                return input.replace(/-/g, '');
            };
        })
        .filter('EliminateAccentFilter', function() {
            return function(input) {
                return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            };
        });

    beforeEach(angular.mock.module('ib-datalayer-cki-module', 'LocalStorageModule', 'ib-commons-filters-module'));
    beforeEach(() => {
        angular.mock.module(($provide) => {
            $provide.value('CkiDataLayerService', fake.CkiDataLayerService);
            $provide.value('CommonsConstants', fake.CommonsConstants);
            $provide.value('CommonsUtilService', fake.CommonsUtilService);
            $provide.value('CommonsUserUtilsService', fake.CommonsUserUtilsService);
            $provide.value('CkiDigitalDataService', fake.CkiDigitalDataService);
            $provide.value('CkiDatalayerConstants', fake.CkiDatalayerConstants);
            $provide.value('MonetateUtilsService', fake.MonetateUtilsService);
            $provide.value('MonetateConstants', fake.MonetateConstants);
            $provide.value('localStorageService', fake.localStorageService);
        });

        inject((_CkiDatalayerUtilsService_, _$rootScope_, _$timeout_) => {
            CkiDatalayerUtilsService = _CkiDatalayerUtilsService_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
        });
    });

    describe('When CkiDatalayerUtilsService is init', () => {
        it(' CkiDatalayerUtilsService should be defined', () => {
            expect(CkiDatalayerUtilsService).toBeDefined();
            $rootScope.$digest();
        });
    });

    describe('When initializeDatalayer() is called', () => {
        it('initializes both data layers when they have not been initialized', () => {
            fake.CkiDataLayerService.initDatalayer.calls.reset();
            fake.CkiDigitalDataService.initDigitalData.calls.reset();
            fake.CkiDataLayerService.isDatalayerInit.and.returnValue(false);
            fake.CkiDigitalDataService.isDigitalDataInit.and.returnValue(false);

            CkiDatalayerUtilsService.initializeDatalayer('es', 'ES', 'desktop');

            expect(fake.CkiDataLayerService.initDatalayer).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    [fake.CkiDatalayerConstants.DATALAYER_INFO.LANGUAGE]: 'es',
                    [fake.CkiDatalayerConstants.DATALAYER_INFO.MARKET]: 'ES',
                    [fake.CkiDatalayerConstants.DATALAYER_INFO.WEB_MODE]: 'desktop'
                }),
                {}
            );
            expect(fake.CkiDigitalDataService.initDigitalData).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    [fake.CkiDatalayerConstants.DIGITAL_DATA_INFO.LANGUAGE]: 'es',
                    [fake.CkiDatalayerConstants.DIGITAL_DATA_INFO.MARKET]: 'ES',
                    [fake.CkiDatalayerConstants.DIGITAL_DATA_INFO.WEB_MODE]: 'desktop'
                })
            );
        });

        it('does not reinitialize either data layer', () => {
            fake.CkiDataLayerService.initDatalayer.calls.reset();
            fake.CkiDigitalDataService.initDigitalData.calls.reset();
            fake.CkiDataLayerService.isDatalayerInit.and.returnValue(true);
            fake.CkiDigitalDataService.isDigitalDataInit.and.returnValue(true);

            CkiDatalayerUtilsService.initializeDatalayer('es', 'ES', 'desktop');

            expect(fake.CkiDataLayerService.initDatalayer).not.toHaveBeenCalled();
            expect(fake.CkiDigitalDataService.initDigitalData).not.toHaveBeenCalled();
        });
    });

    describe('When getAviosCoins() is called', () => {
        it('prefers the top-level amount and falls back to general info', () => {
            expect(CkiDatalayerUtilsService.getAviosCoins({ avios: 25, generalInfo: { avios: 10 } })).toBe(25);
            expect(CkiDatalayerUtilsService.getAviosCoins({ generalInfo: { avios: 10 } })).toBe(10);
            expect(CkiDatalayerUtilsService.getAviosCoins({})).toBe(0);
        });
    });

    describe('When resetDatalayer() is called', () => {
        it(' should be call', (done) => {
            inject(() => {
                fake.CkiDataLayerService.getDatalayerGeneral = jasmine.createSpy('getDatalayerGeneral').and.callFake(() => {
                    return mock.getDatalayerGeneral;
                });
                fake.CkiDigitalDataService.getDigitalData = jasmine.createSpy('getDatalayerGeneral').and.callFake(() => {
                    return mock.getDigitalData;
                });
            });

            CkiDatalayerUtilsService.resetDatalayer();
            $rootScope.$digest();
            done();
        });
    });

    describe('When setProcessAndStep() is called', () => {
        it(' should be call', (done) => {
            CkiDatalayerUtilsService.setProcessAndStep('checkin', 'ibcose');
            $rootScope.$digest();
            done();
        });
    });

    describe('When sendDatalayerEvent() is called', () => {
        it(' should be call', (done) => {
            CkiDatalayerUtilsService.sendDatalayerEvent('type');
            $rootScope.$digest();
            $timeout.flush();
            done();
        });
    });

    describe('When updateDigitalDataForAncillaries is called', () => {
        it('should be call', (done) => {
            CkiDatalayerUtilsService.updateDigitalDataForAncillaries(true, mockAncillariesHeaderInfo, 'ALLIANZ');
            $rootScope.$digest();
            done();
        });
    });

    describe('When updateDatalayerForAncillaries is called', () => {
        let addDataLayerInfoSpy;

        interface UpdateAncillariesParams {
            updatePrices: boolean;
            action: string;
            totalBaggage: number;
            baggagePrice: number;
            totalSeats: number;
            seatsPrice: number;
            insuranceType: string;
            insurancePrice: number;
            flexibilityPrice: number;
            totalSpeqs: number;
            speqsPrice: number;
        }

        const buildAncillaryValue = (price: number): string => {
            return price > 0
                ? `${fake.CkiDatalayerConstants.DATALAYER_VALUES.YES} – ${price}`
                : fake.CkiDatalayerConstants.DATALAYER_VALUES.NO;
        };

        const executeUpdateDatalayerForAncillaries = ({
            updatePrices,
            action,
            totalBaggage,
            baggagePrice,
            totalSeats,
            seatsPrice,
            insuranceType,
            insurancePrice,
            flexibilityPrice,
            totalSpeqs,
            speqsPrice
        }: UpdateAncillariesParams): void => {
            CkiDatalayerUtilsService.updateDatalayerForAncillaries(
                updatePrices,
                action,
                totalBaggage,
                baggagePrice,
                totalSeats,
                seatsPrice,
                insuranceType,
                insurancePrice,
                flexibilityPrice,
                totalSpeqs,
                speqsPrice
            );
        };

        const buildExpectedDatalayer = ({
            updatePrices,
            action,
            totalBaggage,
            baggagePrice,
            totalSeats,
            seatsPrice,
            insuranceType,
            insurancePrice,
            flexibilityPrice,
            totalSpeqs,
            speqsPrice
        }: UpdateAncillariesParams): Record<string, unknown> => {
            const expected = {
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_ACTION]: action
            };

            if (!updatePrices) {
                return expected;
            }

            return {
                ...expected,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY]:
                    fake.CkiDatalayerConstants.DATALAYER_ANCILLARIES.ANCILLARIES,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.EVENT_ACTION]:
                    fake.CkiDatalayerConstants.DATALAYER_EVENT_TYPES.CLICK,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.EVENT_LABEL]:
                    fake.CkiDatalayerConstants.DATALAYER_LABEL.CONTINUAR,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_SEATS]: totalSeats,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_SEATS]:
                    buildAncillaryValue(seatsPrice),
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_SEAT]: seatsPrice,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_BAGGAGE]: totalBaggage,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_BAGGAGES]:
                    buildAncillaryValue(baggagePrice),
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_BAGGAGE]: baggagePrice,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCE_TYPE]: insuranceType,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCES]:
                    buildAncillaryValue(insurancePrice),
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_FLEXIBILITY]:
                    buildAncillaryValue(flexibilityPrice),
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_SPEQS]: totalSpeqs,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_SPEQS]:
                    buildAncillaryValue(speqsPrice),
                [fake.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_SPEQS]: speqsPrice
            };
        };

        const expectDatalayerPersistence = (expected: Record<string, unknown>): void => {
            expect(addDataLayerInfoSpy).toHaveBeenCalledWith(expected);
            expect(fake.localStorageService.set).toHaveBeenCalledWith(
                'confirmationDatalayerInfo',
                expected
            );
        };

        beforeEach(() => {
            addDataLayerInfoSpy = spyOn(
                getPrivateMethods(),
                'addDataLayerInfo'
            ).and.callFake(angular.noop);

            fake.localStorageService.set.calls.reset();
        });

        const itsUpdateDatalayerForAncillaries = [
            {
                expectation: 'should save only ancillaries action when updatePrices is false',
                params: {
                    updatePrices: false,
                    action: 'CONTINUE',
                    totalBaggage: 2,
                    baggagePrice: 50,
                    totalSeats: 3,
                    seatsPrice: 60,
                    insuranceType: 'ALLIANZ',
                    insurancePrice: 70,
                    flexibilityPrice: 80,
                    totalSpeqs: 4,
                    speqsPrice: 90
                }
            },
            {
                expectation: 'should fill all datalayer fields when updatePrices is true and prices are greater than 0',
                params: {
                    updatePrices: true,
                    action: 'CONTINUE',
                    totalBaggage: 2,
                    baggagePrice: 50,
                    totalSeats: 3,
                    seatsPrice: 60,
                    insuranceType: 'ALLIANZ',
                    insurancePrice: 70,
                    flexibilityPrice: 80,
                    totalSpeqs: 4,
                    speqsPrice: 90
                }
            },
            {
                expectation: 'should use NO when prices are 0',
                params: {
                    updatePrices: true,
                    action: 'CONTINUE',
                    totalBaggage: 0,
                    baggagePrice: 0,
                    totalSeats: 0,
                    seatsPrice: 0,
                    insuranceType: '',
                    insurancePrice: 0,
                    flexibilityPrice: 0,
                    totalSpeqs: 0,
                    speqsPrice: 0
                }
            }
        ];

        itsUpdateDatalayerForAncillaries.forEach(({expectation, params}) => {
            it(expectation, () => {
                executeUpdateDatalayerForAncillaries(params);
                expectDatalayerPersistence(buildExpectedDatalayer(params));
            });
        });
    });

    describe('When addDigitalDataAllianzFusion is called', () => {
        it('should be call', (done) => {
            CkiDatalayerUtilsService.addDigitalDataAllianzFusion(mockExtendedDatalayerInfo, mockAncillariesHeaderInfo);
            $rootScope.$digest();
            done();
        });
    });

    describe('addDigitalData functions', () => {
        let headerModelStorage;
        let extendedDatalayerInfo;

        beforeEach(() => {
            headerModelStorage = {
                headerModel: {
                    shoppingBasket: {
                        insuranceAllianzFusionInfo: {
                            info: { description: 'Fusion' },
                            total: { total: 99.99 }
                        },
                        globickActivities: {
                            info: { description: ['activity1', 'activity2'] },
                            total: { total: 123.45 }
                        },
                        globickTransfers: {
                            info: { transferCar: 'Bus' },
                            total: { total: 55.55 }
                        }
                    }
                }
            };

            extendedDatalayerInfo = {};
        });

        it('should add Allianz Fusion data', () => {
            getPrivateMethods().addDigitalDataAllianzFusion(extendedDatalayerInfo, headerModelStorage);

            expect(extendedDatalayerInfo).toEqual({
                [fake.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE]: 'Fusion',
                [fake.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE]: 99.99,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY]: 'IBAESCAN'
            });
        });

        it('should add Globick Activities data', () => {
            getPrivateMethods().addDigitalDataGlobickActivities(headerModelStorage, extendedDatalayerInfo);

            expect(extendedDatalayerInfo).toEqual({
                [fake.CkiDatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES]: 2,
                [fake.CkiDatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES_TOTAL_PRICE]: 123.45
            });
        });

        it('should add Globick Transfer data', () => {
            getPrivateMethods().addDigitalDataGlobickTransfer(headerModelStorage, extendedDatalayerInfo);

            expect(extendedDatalayerInfo).toEqual({
                [fake.CkiDatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER]: 'Bus',
                [fake.CkiDatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER_TOTAL_PRICE]: 55.55
            });
        });
    });

    describe('When getTrackingCode is called', () => {
        it('should return an string with the trackingCode structure', (done) => {
            const mockResult = mock.getDigitalData.TrackingCode;

            CkiDatalayerUtilsService.LANG = mock.getDigitalData.Language;
            CkiDatalayerUtilsService.MARKET = mock.getDigitalData.Market;

            const result = CkiDatalayerUtilsService.getTrackingCode(mock.getDigitalData.Quadrigam);
            $rootScope.$digest();

            expect(result).toBe(mockResult);
            done();
        });

        it('should return an string with the trackingCode structure but the Quadrigam empty', (done) => {
            const mockResult = `${mock.getDigitalData.Language}/${mock.getDigitalData.Market}/`;

            CkiDatalayerUtilsService.LANG = mock.getDigitalData.Language;
            CkiDatalayerUtilsService.MARKET = mock.getDigitalData.Market;

            const result = CkiDatalayerUtilsService.getTrackingCode();
            $rootScope.$digest();

            expect(result).toBe(mockResult);
            done();
        });
    });

    describe('When setTrackingCode is called', () => {
        it('should return an string with the trackingCode structure', (done) => {
            const mockResult = mock.getDigitalData.TrackingCode;

            CkiDatalayerUtilsService.LANG = mock.getDigitalData.Language;
            CkiDatalayerUtilsService.MARKET = mock.getDigitalData.Market;

            CkiDatalayerUtilsService.setTrackingCode(mock.getDigitalData.Quadrigam);
            inject(() => {
                fake.CkiDataLayerService.getDatalayerGeneral = jasmine.createSpy('getDatalayerGeneral').and.callFake(() => {
                    return mock.getDatalayerGeneral;
                });
                fake.CkiDigitalDataService.getDigitalData = jasmine.createSpy('getDatalayerGeneral').and.callFake(() => {
                    return mock.getDigitalData;
                });
            });
            $rootScope.$digest();

            expect(fake.CkiDigitalDataService.getDigitalData()['TrackingCode']).toBe(mockResult);
            done();
        });
    });

    describe('When mapSeatsForDigitalData is called', () => {
        let SI;
        let addDigitalDataSeatsInfoByTypeSpy: jasmine.Spy;

        const buildHeaderModel = (seats: { type: string; quanty: number; amount: number }[]) => ({
            headerModel: { shoppingBasket: { seats: { segments: [{ seats }] } } }
        });

        beforeEach(() => {
            SI = getPrivateMethods().CkiDatalayerConstants.DATALAYER_INFO.SEATSINFO;
            addDigitalDataSeatsInfoByTypeSpy = spyOn(getPrivateMethods(), 'addDigitalDataSeatsInfoByType');
        });

        it('should set SEATSTOTAL and SEATSTOTALPRICE aggregating all seats', () => {
            const extendedDatalayerInfo = {};
            const headerModel = buildHeaderModel([
                { type: SI.SEATS_HEADER_FORMAT.UPFRONT, quanty: 2, amount: 30 },
                { type: SI.SEATS_HEADER_FORMAT.EMERGENCY, quanty: 1, amount: 15 }
            ]);

            getPrivateMethods().mapSeatsForDigitalData(headerModel, extendedDatalayerInfo);

            expect(extendedDatalayerInfo[SI.SEATSTOTAL]).toBe(3);
            expect(extendedDatalayerInfo[SI.SEATSTOTALPRICE]).toBe(45);
        });

        it('should set totals to 0 and not call addDigitalDataSeatsInfoByType when seats is empty', () => {
            const extendedDatalayerInfo = {};

            getPrivateMethods().mapSeatsForDigitalData(buildHeaderModel([]), extendedDatalayerInfo);

            expect(extendedDatalayerInfo[SI.SEATSTOTAL]).toBe(0);
            expect(extendedDatalayerInfo[SI.SEATSTOTALPRICE]).toBe(0);
            expect(addDigitalDataSeatsInfoByTypeSpy).not.toHaveBeenCalled();
        });

        it('should not throw when seats is undefined', () => {
            expect(() => {
                getPrivateMethods().mapSeatsForDigitalData(
                    { headerModel: { shoppingBasket: { seats: undefined } } },
                    {}
                );
            }).not.toThrow();
        });

        const SEAT_TYPE_CASES = [
            {
                label: 'UPFRONT',
                type: () => SI.SEATS_HEADER_FORMAT.UPFRONT,
                totalKey: () => SI.SEATSBYTYPE.UPFRONT.SEATSEUPFRONTTOTAL,
                priceKey: () => SI.SEATSBYTYPE.UPFRONT.SEATSEUPFRONTPRICE
            },
            {
                label: 'EXTRA_SIZE',
                type: () => SI.SEATS_HEADER_FORMAT.EXTRA_SIZE,
                totalKey: () => SI.SEATSBYTYPE.XL.SEATSXLTOTAL,
                priceKey: () => SI.SEATSBYTYPE.XL.SEATSXLPRICE
            },
            {
                label: 'EMERGENCY',
                type: () => SI.SEATS_HEADER_FORMAT.EMERGENCY,
                totalKey: () => SI.SEATSBYTYPE.EMERGENCY.SEATSEMERGENCYTOTAL,
                priceKey: () => SI.SEATSBYTYPE.EMERGENCY.SEATSEMERGENCYPRICE
            },
            {
                label: 'PROMO',
                type: () => SI.SEATS_HEADER_FORMAT.PROMO,
                totalKey: () => SI.SEATSBYTYPE.PROMO.SEATSPROMOTOTAL,
                priceKey: () => SI.SEATSBYTYPE.PROMO.SEATSPROMOPRICE
            },
            {
                label: 'INFANT',
                type: () => SI.SEATS_HEADER_FORMAT.INFANT,
                totalKey: () => SI.SEATSBYTYPE.PASSENGER_WITH_INFANT.SEATSEINFANTTOTAL,
                priceKey: () => SI.SEATSBYTYPE.PASSENGER_WITH_INFANT.SEATSEINFANTPRICE
            },
            {
                label: 'RESTRICTED_MOBILITY',
                type: () => SI.SEATS_HEADER_FORMAT.RESTRICTED_MOBILITY,
                totalKey: () => SI.SEATSBYTYPE.RESTRICTED_MOBILITY.SEATSRESTRICTEDMOBILITYTOTAL,
                priceKey: () => SI.SEATSBYTYPE.RESTRICTED_MOBILITY.SEATSRESTRICTEDMOBILITYPRICE
            },
            {
                label: 'STANDARD',
                type: () => '',
                totalKey: () => SI.SEATSBYTYPE.STANDARD.SEATSSTANDARDTOTAL,
                priceKey: () => SI.SEATSBYTYPE.STANDARD.SEATSSTANDARDTOTALPRICE
            }
        ];

        SEAT_TYPE_CASES.forEach(({ label, type, totalKey, priceKey }) => {
            it(`should call addDigitalDataSeatsInfoByType for type "${label}"`, () => {
                getPrivateMethods().mapSeatsForDigitalData(
                    buildHeaderModel([{ type: type(), quanty: 1, amount: 10 }]),
                    {}
                );

                expect(addDigitalDataSeatsInfoByTypeSpy)
                    .toHaveBeenCalledOnceWith(jasmine.any(Object), jasmine.any(Array), jasmine.any(String), totalKey(), priceKey());
            });
        });
    });

    describe('When updateDatalayerInitType is called', () => {
        it('should init type flow locator', (done) => {
            CkiDatalayerUtilsService.updateDatalayerInitType(fake.CkiDatalayerConstants.DATALAYER_VALUES.INIT_LOCATOR);
            $rootScope.$digest();
            done();
        });

        it('should init type flow ibplus', (done) => {
            CkiDatalayerUtilsService.updateDatalayerInitType(fake.CkiDatalayerConstants.DATALAYER_VALUES.INIT_IB_PLUS);
            $rootScope.$digest();
            done();
        });
    });
});
