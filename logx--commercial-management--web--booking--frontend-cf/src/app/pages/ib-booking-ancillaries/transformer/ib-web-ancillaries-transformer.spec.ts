import * as angular from 'angular';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import {
    mockDataAviosAvailable,
    mockDataBidAvailable
} from '@test-mocks/unit/app/pages/ib-booking-ancillaries/transformer/angularjs-mocks-upg-utilities';
import { mock } from '@test-mocks/unit/app/pages/ib-booking-ancillaries/transformer/ib-web-ancillaries-transformer-mock';

describe('ancillariesTransfomer test', () => {
    let scope, localStorageService, rootScope, ancillariesTransfomer;

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

    const fakeSummaryInfo = {
        pendingPaymentItems: [
            {
                'type': 'PET',
                'currency': 'EUR',
                'total': 30.00,
                'slices': [
                    {
                        'id': 'IB20250801MADBIO',
                        'segments': [
                            'IB4409847324'
                        ]
                    }
                ],
                'passengers': [
                    {
                        'id': 'ADULT_01',
                        'pets': [
                            {
                                'type': 'DOG',
                                'breeds': ['BICHON MALTES'],
                                'weight': '05KG',
                                'measurement': '25x25x25',
                                'amount': 30.00,
                                'units': 2
                            }
                        ]
                    }
                ]
            }
        ]
    };

    beforeEach(() => {
        angular.mock.module('ib-booking-ancillaries-module', ($provide) => {
            localStorageService = new StorageServiceMock();
            $provide.value('AncillariesTemporalUtilsService', mock.dep.AncillariesTemporalUtilsService);
            $provide.value('$filter', () => ((text) => text));
            $provide.value('CommonsSessionStorageService', localStorageService);
            $provide.value('AncillariesUpgradingTransformer', {});
            $provide.value('CurrencyService', mock.dep.CurrencyService);
            $provide.value('AncillariesUtilsService', fakeAncillariesUtilsService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
        });
        angular.mock.inject(($rootScope, _BookingAncillariesTransformer_) => {
            ancillariesTransfomer = _BookingAncillariesTransformer_;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            $rootScope.$apply();
        });
    });
    it('ancillariesTransfomer should create', () => {
        expect(ancillariesTransfomer).toBeTruthy();
    });

    describe('genStructureForAncillaries', () => {
        it('genStructureForAncillaries ', () => {
            expect(ancillariesTransfomer.genStructureForAncillaries([{id: 0, trips:[]}])).toBeTruthy();
        });
    });
   
    describe('genReqAviosAncillariesBaggages  ', () => {
        it('genReqAviosAncillariesBaggages ', () => {
            expect(ancillariesTransfomer.genReqAviosAncillariesBaggages([])).toBeTruthy();
        });
    });
    describe('genAviosPriorityReq ', () => {
        it('genAviosPriorityReq ', () => {
            expect(ancillariesTransfomer.genAviosPriorityReq([])).toBeTruthy();
        });
    });
    describe('genAviosSpeqReq', () => {
        it('genAviosSpeqReq', () => {
            expect(ancillariesTransfomer.genAviosSpeqReq([])).toBeTruthy();
        });
    });

    describe('genAviosFlexOnDemandReq', () => {
        it('genAviosFlexOnDemandReq', () => {
            spyOn(localStorageService, 'get').and.returnValue([{ id: 1, segmentIds: [''] }]);
            expect(ancillariesTransfomer.genAviosFlexOnDemandReq({ passengerPrices: [{}] })).toBeTruthy();
        });
    });

    describe('genAviosAncillariesReq', () => {
        it(' success', () => {
            spyOn(localStorageService, 'get').and.returnValue({ passengers: [{ id: 1 }] });
            let passengers = [{ id: 1 }];
            expect(ancillariesTransfomer.genAviosAncillariesReq(passengers)).toBeTruthy();
        });
        it(' other passenger', () => {
            spyOn(localStorageService, 'get').and.returnValue({ passengers: [{ id: 2 }] });
            let passengers = [{ id: 1 }];
            expect(ancillariesTransfomer.genAviosAncillariesReq(passengers)).toBeTruthy();
        });
        it(' error', () => {
            spyOn(localStorageService, 'get').and.returnValue(null);
            let passengers = [{ id: 1 }];
            expect(ancillariesTransfomer.genAviosAncillariesReq(passengers)).toBeTruthy();
        });
    });

    describe('genAviosAncillariesSummaryReq ', () => {
        it('genAviosAncillariesSummaryReq out ancillaries', () => {
            spyOn(localStorageService, 'get').and.returnValue(mock.req.flightAviosInfo);
            ancillariesTransfomer.genAviosAncillariesSummaryReq(mock.req.ancillariesPassengers, 'BAGGAGE');
            expect(localStorageService.get('flightAviosInfo')).toBeTruthy();
        });
        it('genAviosAncillariesSummaryReq with ancillaries', () => {
            spyOn(localStorageService, 'get').and.returnValue(mock.req.flightAviosInfo2);
            ancillariesTransfomer.genAviosAncillariesSummaryReq(mock.req.ancillariesPassengers, 'BAGGAGE');
            expect(localStorageService.get('flightAviosInfo')).toBeTruthy();
        });
        it('genAviosAncillariesSummaryReq with error', () => {
            spyOn(localStorageService, 'get').and.returnValue(mock.req.flightAviosInfo3);
            expect(
                ancillariesTransfomer.genAviosAncillariesSummaryReq(mock.req.ancillariesPassengers, 'BAGGAGE')
            ).toEqual({});
        });
    });

    describe('TransCalcPointsData ', () => {
        it('TransCalcPointsData', () => {
            expect(
                ancillariesTransfomer.TransCalcPointsData({ passengers: [{ ancillaries: [{ code: '1' }] }] })
            ).toBeTruthy();
        });
    });

    describe('transformAncillariesView', () => {
        it('should transform and return carbon footprint data', () => {
            const result = ancillariesTransfomer.transformAncillariesView({}, mock.req.carbonFootprint, mock.req.cachedData1);
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
                if (key === 'summaryInfo') {
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

            const result = ancillariesTransfomer.transformAncillariesView({}, mock.req.carbonFootprint, mock.req.cachedData1);
            expect(result.ancillariesAvailable).toEqual([]);
        });
    });
    describe('When upgradeBidsAviosUpdate() is called', () => {
        let returnedValue;
        beforeEach(() => {
            localStorageService.set('ancillariesSlices', [
                {
                    id: 'MADMEX20221219130500',
                    segmentIds: ['IB640320221219']
                },
                {
                    id: 'MEXMAD20221223000500',
                    segmentIds: ['IB640620221223']
                }
            ]);
        });
        it('should return data if aviosBidAvailable is TRUE', (done) => {
           
            returnedValue = ancillariesTransfomer.upgradeBidsAviosUpdate(mockDataAviosAvailable, fakePassengersData);
            expect(returnedValue[0].type).toEqual('UPGRADING_AVIOS');
            done();
        });
        it('should return data if bidsAvailable is TRUE', (done) => {
            localStorageService.set('ancillariesSlices', [
                {
                    id: 'MADMEX20221219130500',
                    segmentIds: ['IB640320221219']
                },
                {
                    id: 'MEXMAD20221223000500',
                    segmentIds: ['IB640620221223']
                }
            ]);
            returnedValue = ancillariesTransfomer.upgradeBidsAviosUpdate(mockDataBidAvailable, fakePassengersData);
            expect(returnedValue[0].type).toEqual('UPGRADING_BID');
            done();
        });
    });

    describe('when generateInfoCommon() is called ', () => {
        it('with pet ancillary modifyButton false when petcSummary is empty', () => {
            spyOn(localStorageService, 'get').and.callFake((key) => {
                if (key === 'currency') {
                    return {
                        'suffixSymbol': true,
                        'decimalSeparator': ',',
                        'numberDecimals': 2,
                        'groupingSeparator': '.',
                        'currencySymbol': '€',
                        'description': 'Euro',
                        'code': 'EUR'
                    };
                }
                if (key === 'petcSummary') {
                    return [];
                }
                return null;
            });

            const result = ancillariesTransfomer.generateInfoCommon(mock.req.ancillariesInfo, mock.req.cachedData2);
            expect(result.pet).toEqual(jasmine.objectContaining(mock.resp.petAncillary));
        });

        it('with pet ancillary modifyButton true when petcSummary has items', () => {
            spyOn(localStorageService, 'get').and.callFake((key) => {
                if (key === 'currency') {
                    return {
                        'suffixSymbol': true,
                        'decimalSeparator': ',',
                        'numberDecimals': 2,
                        'groupingSeparator': '.',
                        'currencySymbol': '€',
                        'description': 'Euro',
                        'code': 'EUR'
                    };
                }
                if (key === 'petcSummary') {
                    return [{ type: 'DOG' }];
                }
                return null;
            });

            const result = ancillariesTransfomer.generateInfoCommon(mock.req.ancillariesInfo, mock.req.cachedData2);
            expect(result.pet).toEqual(jasmine.objectContaining(mock.resp.petAncillaryPendingPayment));
        });
    });

    describe('addSegmentSeatAvailable (via transformAncillariesView)', () => {
        const cachedData = { passengers: [] };
        const baseSeatAncillary = (segments: any[], statusCode = 'AVAILABLE') => ({
            currencies: [],
            slices: [],
            ancillaries: [
                {
                    type: 'SEAT',
                    status: { code: statusCode },
                    segments
                }
            ]
        });
        const makeSegment = (id: string, statusCode: string) => ({
            id,
            status: { code: statusCode },
            passengers: []
        });

        beforeEach(() => {
            spyOn(localStorageService, 'get').and.returnValue(null);
        });

        it('should store all segment ids when all segments are AVAILABLE', () => {
            spyOn(localStorageService, 'set');
            const segments = [
                makeSegment('seg-1', 'AVAILABLE'),
                makeSegment('seg-2', 'AVAILABLE')
            ];
            ancillariesTransfomer.transformAncillariesView({}, baseSeatAncillary(segments), cachedData);
            expect(localStorageService.set).toHaveBeenCalledWith('seatsAvailableSegments', ['seg-1', 'seg-2']);
        });

        it('should store all segment ids when all segments are AVAILABLE_WITH_WARNING', () => {
            spyOn(localStorageService, 'set');
            const segments = [
                makeSegment('seg-1', 'AVAILABLE_WITH_WARNING'),
                makeSegment('seg-2', 'AVAILABLE_WITH_WARNING')
            ];
            ancillariesTransfomer.transformAncillariesView({}, baseSeatAncillary(segments, 'AVAILABLE_WITH_WARNING'), cachedData);
            expect(localStorageService.set).toHaveBeenCalledWith('seatsAvailableSegments', ['seg-1', 'seg-2']);
        });

        it('should store only AVAILABLE and AVAILABLE_WITH_WARNING ids when segments have mixed statuses', () => {
            spyOn(localStorageService, 'set');
            const segments = [
                makeSegment('seg-1', 'AVAILABLE'),
                makeSegment('seg-2', 'NOT_AVAILABLE'),
                makeSegment('seg-3', 'AVAILABLE_WITH_WARNING'),
                makeSegment('seg-4', 'NOT_AVAILABLE_WITH_WARNING')
            ];
            ancillariesTransfomer.transformAncillariesView({}, baseSeatAncillary(segments), cachedData);
            expect(localStorageService.set).toHaveBeenCalledWith('seatsAvailableSegments', ['seg-1', 'seg-3']);
        });

        it('should not call addSegmentSeatAvailable when seat status is NOT_AVAILABLE', () => {
            spyOn(localStorageService, 'set');
            const segments = [makeSegment('seg-1', 'AVAILABLE')];
            ancillariesTransfomer.transformAncillariesView({}, baseSeatAncillary(segments, 'NOT_AVAILABLE'), cachedData);
            const calls = (localStorageService.set as jasmine.Spy).calls.allArgs();
            const seatCall = calls.find(([key]) => key === 'seatsAvailableSegments');
            expect(seatCall).toBeUndefined();
        });
    });

    describe('generateAssistCardInfo', () => {
        it('should return a valid Assist Card info object', () => {
            spyOn(localStorageService, 'get').and.returnValue(fakeSummaryInfo);
            const ancillaryInfo = {
                type: 'ASSIST_CARD'
            };
            const result = ancillariesTransfomer.generateAssistCardInfo(ancillaryInfo);
            expect(result).toEqual({
                type: 'ASSIST_CARD',
                modal: 'ASSIST_CARD',
                textModels: {
                    title: 'ANCILLARIES_ASSIST_CARD_BOX_TITLE',
                    subtitle: '',
                    bulletPoints: [
                        'ANCILLARIES_ASSIST_CARD_BOX_TEXT_1',
                        'ANCILLARIES_ASSIST_CARD_BOX_TEXT_2'
                    ],
                    imgPath: '/assist_card/assist_card_box.svg'
                },
                avoidPrice: true,
                modifyButton: false,
                status: undefined
            });
        });
        
        it('should return correct bullet points for different types', () => {
            spyOn(localStorageService, 'get').and.returnValue(fakeSummaryInfo);
            const ancillaryInfo = {
                type: 'ASSIST_CARD'
            };
            const result = ancillariesTransfomer.generateAssistCardInfo(ancillaryInfo);
            expect(result.textModels.bulletPoints).toEqual([
                'ANCILLARIES_ASSIST_CARD_BOX_TEXT_1',
                'ANCILLARIES_ASSIST_CARD_BOX_TEXT_2'
            ]);
        });
    });
});
