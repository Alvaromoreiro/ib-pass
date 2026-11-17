import * as angular from 'angular';
import { mockDataAviosAvailable, mockDataBidAvailable } from 'test/mocks/transformers/angularjs-mocks-upg-utilities';
import { mock } from 'test/mocks/transformers/ib-web-ancillaries-transformer-mock';

describe('AncillariesTransformer', () => {
    let scope, localStorageService, rootScope, controller, AncillariesTransformer, $filter;
    const fakeDatalayerUtilsService = {
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerWithQuadrigam: jasmine.createSpy()
    };
    const fakeAncillariesUtilsService = {
        getBookingSegmentInformation: jasmine.createSpy(),
        isCheckinFlow: jasmine.createSpy(),
        getMmBbookingSegmentInformation: jasmine.createSpy(),
        isCurrencyLong: jasmine.createSpy(),
        checkEarlySegments: jasmine.createSpy(),
        getUpgradingInfo: jasmine.createSpy(),
        getCreditCardIcon: jasmine.createSpy()
    };
    const fakeAncillariesConstant = {
        TYPE_ANCILLARIE: {
            BAGGAGE: 'BAGGAGE',
            INSURANCE: 'INSURANCE',
            SEAT: 'SEAT',
            VEHICLE_RENTAL: 'VEHICLE_RENTAL',
            INTEGRATED_BOB: 'INTEGRATED_BOB',
            SPEQS: 'SPECIAL_EQUIPMENT',
            UPGRADING: 'UPGRADING',
            SPECIAL_MEALS: 'SPECIAL_MEALS',
            UPGRADING_BID: 'UPGRADING_BID',
            UPGRADING_AVIOS: 'UPGRADING_AVIOS',
            FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
            PREORDER: 'PREORDER',
            PRIORITY_BOARDING: 'PRIORITY_BOARDING',
            THIRD_PARTY_COMPANIES: 'THIRD_PARTY_COMPANIES',
            CO2_FOOTPRINT: 'CO2_FOOTPRINT'
        }
    };
    const fakePassengersData = [
        {
            contactInfo: {
                phone: '1234',
                email: 'test@tes.es'
            },
            personalInfo: {
                name: 'Test',
                surname: 'Test'
            }
        }
    ];

    beforeEach(() => {
        angular.mock.module('ib-web-ancillaries-module', 'LocalStorageModule', ($provide) => {
            $provide.value('CurrencyService', mock.dep.CurrencyService);
            $provide.value('CheckinAncillariesConstant', fakeAncillariesConstant);
            $provide.value('AncillariesUtilsService', fakeAncillariesUtilsService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CommonsSessionStorageService', {
                get: () => ({}),
                set: () => null,
                getItem: () => null,
                removeItem: () => null
            });
        });
        // Mock para IbPetcInfoTransformer — workaround error upgrade en tests híbridos
        angular.mock.module(function ($provide) {
            $provide.factory('IbPetcInfoTransformer', function () {
                return {
                    transform: () => ({})
                    // Si los tests requieren más métodos, añádelos aquí
                };
            });
        });
        angular.mock.inject(($rootScope, _localStorageService_, _AncillariesTransformer_, _$filter_) => {
            AncillariesTransformer = _AncillariesTransformer_;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            $filter = _$filter_;
            $rootScope.$apply();
        });
    });

    it('AncillariesTransformer should create', () => {
        expect(AncillariesTransformer).toBeTruthy();
    });

    describe('genStructureForAncillaries', () => {
        it('genStructureForAncillaries ', () => {
            expect(AncillariesTransformer.genStructureForAncillaries([{id: 0, trips:[]}])).toBeTruthy();
        });
    });
    describe('genStructureForCKIAncillaries', () => {
        it('genStructureForCKIAncillaries ', () => {
            spyOn(localStorageService,'get').and.returnValue({passengers:[{id:0, type:'adult'},{id:1, type:'adult'}]});
            expect(AncillariesTransformer.genStructureForCKIAncillaries('CKI', [{id: 0, type: 'adult'}])).toBeTruthy();
        });
    });
    describe('genReqAviosAncillariesBaggages  ', () => {
        it('genReqAviosAncillariesBaggages ', () => {
            expect(AncillariesTransformer.genReqAviosAncillariesBaggages([])).toBeTruthy();
        });
    });
    describe('genAviosPriorityReq ', () => {
        it('genAviosPriorityReq ', () => {
            expect(AncillariesTransformer.genAviosPriorityReq([])).toBeTruthy();
        });
    });
    describe('genAviosSpeqReq', () => {
        it('genAviosSpeqReq', () => {
            expect(AncillariesTransformer.genAviosSpeqReq([])).toBeTruthy();
        });
    });

    describe('genAviosFlexOnDemandReq', () => {
        it('genAviosFlexOnDemandReq', () => {
            spyOn(localStorageService, 'get').and.returnValue([{ id: 1, segmentIds: [''] }]);
            expect(AncillariesTransformer.genAviosFlexOnDemandReq({ passengerPrices: [{}] })).toBeTruthy();
        });
    });

    describe('genAviosAncillariesReq', () => {
        it(' success', () => {
            spyOn(localStorageService, 'get').and.returnValue({ passengers: [{ id: 1 }] });
            let passengers = [{ id: 1 }];
            expect(AncillariesTransformer.genAviosAncillariesReq(passengers)).toBeTruthy();
        });
        it(' other passenger', () => {
            spyOn(localStorageService, 'get').and.returnValue({ passengers: [{ id: 2 }] });
            let passengers = [{ id: 1 }];
            expect(AncillariesTransformer.genAviosAncillariesReq(passengers)).toBeTruthy();
        });
        it('returns an empty object when flight information is unavailable', () => {
            spyOn(localStorageService, 'get').and.returnValue(undefined);
            let passengers = [{ id: 1 }];
            expect(AncillariesTransformer.genAviosAncillariesReq(passengers)).toEqual({});
        });
    });

    describe('genAviosAncillariesSummaryReq ', () => {
        it('genAviosAncillariesSummaryReq out ancillaries', () => {
            spyOn(localStorageService, 'get').and.returnValue(mock.req.flightAviosInfo);
            AncillariesTransformer.genAviosAncillariesSummaryReq(mock.req.ancillariesPassengers, 'BAGGAGE');
            expect(localStorageService.get('flightAviosInfo')).toBeTruthy();
        });
        it('genAviosAncillariesSummaryReq with ancillaries', () => {
            spyOn(localStorageService, 'get').and.returnValue(mock.req.flightAviosInfo2);
            AncillariesTransformer.genAviosAncillariesSummaryReq(mock.req.ancillariesPassengers, 'BAGGAGE');
            expect(localStorageService.get('flightAviosInfo')).toBeTruthy();
        });
        it('genAviosAncillariesSummaryReq with error', () => {
            spyOn(localStorageService, 'get').and.returnValue(mock.req.flightAviosInfo3);
            expect(
                AncillariesTransformer.genAviosAncillariesSummaryReq(mock.req.ancillariesPassengers, 'BAGGAGE')
            ).toEqual({});
        });
    });

    describe('TransCalcPointsData ', () => {
        it('TransCalcPointsData', () => {
            expect(
                AncillariesTransformer.TransCalcPointsData({ passengers: [{ ancillaries: [{ code: '1' }] }] })
            ).toBeTruthy();
        });
    });

    describe('transformAncillariesView', () => {
        it('should transform and return carbon footprint data', () => {
            spyOn(localStorageService, 'get').and.callFake((key) => {
                if (key === 'summaryInfo') {
                    return { issuedItems: [] };
                }
                if (key === 'currency') {
                    return { code: 'EUR', symbol: '€' };
                }
                return null;
            });
            const mockAncillariesInfo = {
                ancillaries: [{
                    type: 'CO2_FOOTPRINT',
                    status: { code: 'AVAILABLE' },
                    price: 0.99,
                    kilosCo2Equivalent: 41.3 
                }],
                slices: []
            };
            const mockTransformerFlow = { ancillariesAvailable: [], ancillariesTrips: [] };
            const mockCachedData = { passengers: [] };
            const result = AncillariesTransformer.transformAncillariesView(
                mockTransformerFlow, 
                mockAncillariesInfo, 
                mockCachedData
            );
            expect(result.ancillariesAvailable).toEqual(['CO2_FOOTPRINT']);
            expect(result.ancillariesCarbonFootprint).toEqual({
                price: 0.99,
                kilosCo2Equivalent: 41.3,
                priceFrom: '0.99€',
                priceFormatted: '0.99€',
                kilosCo2EquivalentFormatted: '41,3',
                confirmed: false
            });
        });

        it('should not return carbon footprint if already issued', () => {
            spyOn(localStorageService, 'get').and.callFake((key) => {
                if (key === "summaryInfo") {
                    return {
                        issuedItems: [
                            {
                                type: 'CO2_FOOTPRINT',
                                currency: 'EUR',
                                total: 0.99,
                                kilosCo2Equivalent: 41.3,
                                orderId: 'orderId'
                            }
                        ]
                    };
                }
                return null;
            });

            const result = AncillariesTransformer.transformAncillariesView({ segments: [] }, mock.req.carbonFootprint, mock.req.cachedData);
            expect(result.ancillariesAvailable).toEqual([]);
        });
    });
});
