/* global angular, describe, beforeEach, inject, it, expect, jasmine */

describe('UpgradeTransformer', function () {
    'use strict';

    var UpgradeTransformer;
    var currencyService;
    var dateFormatFilter;
    var checkinAppConstants;
    var upgradeConstants;

    function createSegment(id, departureAirport, arrivalAirport) {
        return {
            id: id,
            departure: {
                airport: { code: departureAirport },
                date: '2025-06-10T10:00:00'
            },
            arrival: {
                airport: { code: arrivalAirport },
                date: '2025-06-10T12:00:00'
            },
            cabinClass: {
                type: 'Economy',
                description: 'Economy class'
            },
            passengers: [
                {
                    id: 'PAX-1',
                    seat: {
                        row: '10',
                        column: 'A'
                    }
                }
            ]
        };
    }

    function createSingleSegmentOffer(id, segmentId, cabinLayout) {
        return {
            id: id,
            totalAmount: 50,
            amountPerPassenger: 25,
            cabinLayout: cabinLayout,
            offerSegmentClasses: [
                {
                    segment: segmentId,
                    cabinClass: {
                        code: 'PREM'
                    }
                }
            ]
        };
    }

    function expectAcceptedSegmentUpdated(testCase) {
        var cachedInfo = {
            outwardSegments: [],
            returnSegments: []
        };
        var acceptedSegment = {
            id: testCase.segmentId,
            passengers: [{ id: 'PAX-1', seat: testCase.seat }]
        };
        cachedInfo[testCase.direction].push(createSegment(
            testCase.segmentId,
            testCase.departure,
            testCase.arrival
        ));

        var result = UpgradeTransformer.modifiedCachedInfo({
            acceptedSegments: [acceptedSegment]
        }, [{ segment: testCase.segmentId, cabinClass: testCase.cabinClass }], cachedInfo);

        expect(result[testCase.direction][0].passengers[0].seat).toEqual(testCase.seat);
        expect(result[testCase.direction][0].cabinClass).toEqual(testCase.cabinClass);
    }

    beforeEach(function () {
        currencyService = {
            getCurrencyObject: jasmine.createSpy('getCurrencyObject').and.returnValue({
                code: 'EUR',
                symbol: '€'
            }),
            formatPrice: jasmine.createSpy('formatPrice').and.callFake(function (currency, amount) {
                return amount + ' ' + currency.symbol;
            })
        };

        dateFormatFilter = jasmine.createSpy('DateFormatFilter').and.callFake(function (date) {
            return 'formatted-' + date;
        });

        checkinAppConstants = {
            imagesRoute: '/assets/images'
        };

        upgradeConstants = {
            UPGRADE_TYPES: [
                {
                    type: 'PREMIUM_ECONOMY',
                    onLand: ['Priority check-in'],
                    onBoard: ['Extra legroom']
                },
                {
                    type: 'BUSINESS_CLASS',
                    onLand: ['Fast track'],
                    onBoard: ['Business meal']
                }
            ]
        };

        angular.mock.module('ib-check-in-upgrade-module', function ($provide) {
            $provide.value('CurrencyService', currencyService);
            $provide.value('$filter', function (filterName) {
                return filterName === 'DateFormatFilter' ? dateFormatFilter : angular.noop;
            });
            $provide.value('CheckinAppConstants', checkinAppConstants);
            $provide.value('UpgradeConstants', upgradeConstants);
        });

        inject(function (_UpgradeTransformer_) {
            UpgradeTransformer = _UpgradeTransformer_;
        });
    });

    describe('generateUpgradeModel', function () {
        it('should build the view model for a single segment upgrade offer', function () {
            var segment = createSegment('SEG-1', 'MAD', 'LHR');
            var offer = createSingleSegmentOffer('OFFER-1', 'SEG-1', 'PREMIUM_ECONOMY');

            var result = UpgradeTransformer.generateUpgradeModel({
                currency: 'EUR',
                offers: [offer],
                conditionsByCabinClass: [
                    { code: 'PREM' }
                ]
            }, {
                outwardSegments: [segment],
                returnSegments: []
            });

            expect(currencyService.getCurrencyObject).toHaveBeenCalledWith('EUR');
            expect(currencyService.formatPrice).toHaveBeenCalledWith(
                { code: 'EUR', symbol: '€' },
                50,
                false
            );

            expect(result.totalPriceCombined).toBe(50);
            expect(result.posOfferPrice).toBe(0);
            expect(result.haveCombinedOffers).toBe(false);
            expect(result.selectedOffer).toEqual([
                {
                    type: 'Economy',
                    description: 'Economy class'
                }
            ]);

            expect(result.segments.length).toBe(1);
            expect(result.segments[0].id).toBe('SEG-1');
            expect(result.segments[0].date).toBe('formatted-2025-06-10T10:00:00');
            expect(result.segments[0].offerSelected).toBe(false);

            expect(result.segments[0].offers[0].isSelected).toBe(false);
            expect(result.segments[0].offers[0].conditions).toEqual({
                onLand: [
                    'UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_1',
                    'UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_2'
                ],
                onBoard: [
                    'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_1',
                    'UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_2'
                ]
            });
            expect(result.segments[0].offers[0].images).toEqual([
                '/assets/images/upgrade/info_turista-premium/Carrusel_01.png',
                '/assets/images/upgrade/info_turista-premium/Carrusel_02.png',
                '/assets/images/upgrade/info_turista-premium/Carrusel_03.png'
            ]);

            expect(result.slices).toEqual([
                jasmine.objectContaining({
                    departure: segment.departure,
                    arrival: segment.arrival,
                    quantyScales: 0
                })
            ]);
        });

        it('should include combined offers and format their total price', function () {
            var outwardSegment = createSegment('SEG-1', 'MAD', 'LHR');
            var returnSegment = createSegment('SEG-2', 'LHR', 'MAD');
            var singleOffer = createSingleSegmentOffer('OFFER-1', 'SEG-1', 'BUSINESS_CLASS');
            var combinedOffer = {
                id: 'OFFER-COMBINED',
                totalAmount: 150,
                amountPerPassenger: 75,
                cabinLayout: 'BUSINESS_CLASS',
                offerSegmentClasses: [
                    {
                        segment: 'SEG-1',
                        cabinClass: { code: 'BUS' }
                    },
                    {
                        segment: 'SEG-2',
                        cabinClass: { code: 'BUS' }
                    }
                ]
            };

            var result = UpgradeTransformer.generateUpgradeModel({
                currency: 'EUR',
                offers: [singleOffer, combinedOffer],
                conditionsByCabinClass: [
                    { code: 'BUS' }
                ]
            }, {
                outwardSegments: [outwardSegment],
                returnSegments: [returnSegment]
            });

            expect(result.totalPriceCombined).toBe(50);
            expect(result.posOfferPrice).toBe(150);
            expect(result.posOfferPriceFormatted).toBe('150 €');
            expect(result.haveCombinedOffers).toBe(true);
            expect(result.combinedOffersSegments).toEqual([
                {
                    id: 'OFFER-COMBINED',
                    segments: [
                        {
                            segmentId: 'SEG-1',
                            cabinClassCode: 'BUS'
                        },
                        {
                            segmentId: 'SEG-2',
                            cabinClassCode: 'BUS'
                        }
                    ]
                }
            ]);
        });

        it('should group connected segments into one slice with a scale', function () {
            var firstSegment = createSegment('SEG-1', 'MAD', 'LHR');
            var secondSegment = createSegment('SEG-2', 'LHR', 'CDG');
            var firstOffer = createSingleSegmentOffer('OFFER-1', 'SEG-1', 'PREMIUM_ECONOMY');
            var secondOffer = createSingleSegmentOffer('OFFER-2', 'SEG-2', 'PREMIUM_ECONOMY');

            var result = UpgradeTransformer.generateUpgradeModel({
                currency: 'EUR',
                offers: [firstOffer, secondOffer],
                conditionsByCabinClass: [
                    { code: 'PREM' }
                ]
            }, {
                outwardSegments: [firstSegment, secondSegment],
                returnSegments: []
            });

            expect(result.slices.length).toBe(1);
            expect(result.slices[0].segments.length).toBe(2);
            expect(result.slices[0].quantyScales).toBe(1);
            expect(result.slices[0].departure).toEqual(firstSegment.departure);
            expect(result.slices[0].arrival).toEqual(secondSegment.arrival);
        });

        it('should use Business Plus images for Business Plus offers', function () {
            var segment = createSegment('SEG-1', 'MAD', 'LHR');
            var offer = createSingleSegmentOffer('OFFER-1', 'SEG-1', 'BUSINESS_PLUS');

            var result = UpgradeTransformer.generateUpgradeModel({
                currency: 'EUR',
                offers: [offer],
                conditionsByCabinClass: [
                    { code: 'PREM' }
                ]
            }, {
                outwardSegments: [segment],
                returnSegments: []
            });

            expect(result.segments[0].offers[0].images).toEqual([
                '/assets/images/upgrade/info_business-plus/Carrusel_01.png',
                '/assets/images/upgrade/info_business-plus/Carrusel_02.png',
                '/assets/images/upgrade/info_business-plus/Carrusel_03.png'
            ]);
        });

        it('should return an empty image list for an unsupported cabin layout', function () {
            var segment = createSegment('SEG-1', 'MAD', 'LHR');
            var offer = createSingleSegmentOffer('OFFER-1', 'SEG-1', 'UNKNOWN_CABIN');

            var result = UpgradeTransformer.generateUpgradeModel({
                currency: 'EUR',
                offers: [offer],
                conditionsByCabinClass: [
                    { code: 'PREM' }
                ]
            }, {
                outwardSegments: [segment],
                returnSegments: []
            });

            expect(result.segments[0].offers[0].images).toEqual([]);
        });
    });

    describe('modifiedCachedInfo', function () {
        it('should update accepted seats and cabin classes in both segment collections', function () {
            [
                {
                    direction: 'outwardSegments',
                    segmentId: 'SEG-1',
                    departure: 'MAD',
                    arrival: 'LHR',
                    seat: { row: '2', column: 'C' },
                    cabinClass: { type: 'Business', description: 'Business class' }
                },
                {
                    direction: 'returnSegments',
                    segmentId: 'SEG-2',
                    departure: 'LHR',
                    arrival: 'MAD',
                    seat: { row: '5', column: 'D' },
                    cabinClass: { type: 'Premium Economy', description: 'Premium Economy class' }
                }
            ].forEach(expectAcceptedSegmentUpdated);
        });

        it('should return null when cached information is not available', function () {
            var result = UpgradeTransformer.modifiedCachedInfo({
                acceptedSegments: []
            }, [], null);

            expect(result).toBeNull();
        });

        it('should initialize missing segment collections', function () {
            var cachedInfo = {};
            var result = UpgradeTransformer.modifiedCachedInfo({}, [], cachedInfo);

            expect(result.outwardSegments).toEqual([]);
            expect(result.returnSegments).toEqual([]);
        });

        it('should keep passenger information when no accepted passenger matches', function () {
            var cachedInfo = {
                outwardSegments: [
                    createSegment('SEG-1', 'MAD', 'LHR')
                ],
                returnSegments: []
            };

            var result = UpgradeTransformer.modifiedCachedInfo({
                acceptedSegments: [
                    {
                        id: 'SEG-1',
                        passengers: [
                            {
                                id: 'PAX-2',
                                seat: {
                                    row: '1',
                                    column: 'B'
                                }
                            }
                        ]
                    }
                ]
            }, [], cachedInfo);

            expect(result.outwardSegments[0].passengers[0].seat).toEqual({
                row: '10',
                column: 'A'
            });
        });
    });
});
