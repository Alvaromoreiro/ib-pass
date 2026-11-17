import { MonetateTransformer } from "./ib-monetate-transformer";
import { MonetateConstantsType } from '../ib-monetate-constants';

describe('MonetateTransformer', () => {
    const constants = {
        DEFAULT_VALUES: {
            ONE: '1',
            ZERO: '0'
        },
        CABIN_DESCRIPTION: {
            ECONOMY: 'Economy',
            PREMIUM_ECONOMY: 'Premium Economy',
            BUSINESS: 'Business'
        },
        CONTINENTS_AND_COUNTRIES: {
            AMERICA: 'america',
            CANADA: 'CA',
            LATAM: 'latam'
        },
        CATALOG_PRODUCTS_ID: {
            ANCILLARIES: {
                BAGGAGE: {
                    EQUIPAJE_EXTRA_15: 'bag-15',
                    EQUIPAJE_EXTRA_23: 'bag-23',
                    EQUIPAJE_EXTRA_32: 'bag-32',
                    EQUIPAJE_ESPECIAL_BIKE: 'speq-bike',
                    EQUIPAJE_ESPECIAL_SKIS: 'speq-ski',
                    EQUIPAJE_ESPECIAL_GOLF: 'speq-golf'
                },
                SEAT: {
                    NORMAL: 'seat-normal',
                    DELANTERO: 'seat-upfront',
                    SALIDA_EMERGENCIA: 'seat-exit',
                    XL: 'seat-xl',
                    BEBE: 'seat-infant',
                    MOVILIDAD_REDUCIDA: 'seat-reduced',
                    PROMO: 'seat-promo'
                },
                INSURANCE: {
                    SEGURO_ANULACION: 'insurance-cancellation',
                    SEGURO_ASISTENCIA: 'insurance-assistance'
                },
                FLEXIBILIZATION: {
                    CAMBIO: 'flex-change',
                    REEMBOLSO: 'flex-refund',
                    PACK: 'flex-pack'
                },
                PRIORIDAD: 'priority'
            },
            CABIN_TYPE: {
                TURISTA: 'cabin-economy',
                PREMIUM: 'cabin-premium',
                BUSINESS: 'cabin-business'
            },
            FLIGHT_FARE: {
                GENERICAS: {
                    MAS_ECONOMICA: 'fare-cheapest',
                    FLEXIBLES: 'fare-flexible',
                    CABINAS_PREMIUM: 'fare-premium'
                },
                TURISTA: {
                    BASICA: 'fare-basic',
                    OPTIMA: 'fare-optima',
                    CONFORT: 'fare-comfort',
                    FLEXIBLE: 'fare-flexible-tourist',
                    OPTIMA_FLEX: 'fare-optima-flex'
                },
                PREMIUM: {
                    PROMO: 'fare-premium-promo',
                    FLEX: 'fare-premium-flex',
                    OPTIMA_FLEX: 'fare-premium-optima-flex',
                    OPTIMA: 'fare-premium-optima',
                    PROM_FLEX: 'fare-premium-promo-flex'
                },
                BUSINESS: {
                    PROMO: 'fare-business-promo',
                    FLEX: 'fare-business-flex',
                    OPTIMA: 'fare-business-optima',
                    OPTIMA_FLEX: 'fare-business-optima-flex',
                    PROM_FLEX: 'fare-business-promo-flex'
                }
            },
            FLIGHT_DESTINATION: {
                ESPANA: 'destination-spain',
                EUROPA: 'destination-europe',
                AMERICANORTE: 'destination-north-america',
                LATAM: 'destination-latam',
                AFRICA: 'destination-africa',
                ASIA: 'destination-asia'
            },
            TRIP_TYPE: {
                VACACIONES_VERANO: 'trip-summer',
                VACACIONES_INVIERNO: 'trip-winter',
                VACACIONES_FIN_DE_SEMANA: 'trip-weekend',
                VACACIONES_NEGOCIO: 'trip-business'
            }
        }
    } as unknown as MonetateConstantsType;

    let transformer: MonetateTransformer;
    let storage: jasmine.SpyObj<ng.local.storage.ILocalStorageService>;
    let storageValues: Record<string, unknown> & {
        fareData: { contextMetadata: { currencies: Array<{ code: string }> } };
    };

    const normalize = (value: string): string => {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
    };

    const createAncillaryProduct = (
        productId: string,
        unitPrice: string,
        quantity: string,
        currency = 'EUR'
    ): CommonsMonetateModels.CartProductDetails => {
        return {
            productId,
            unitPrice,
            quantity,
            currency,
            isAncillary: true
        };
    };

    beforeEach(() => {
        storageValues = {
            fareData: {
                contextMetadata: {
                    currencies: [{ code: 'EUR' }]
                }
            }
        };

        storage = jasmine.createSpyObj('localStorageService', ['get', 'set']);
        storage.get.and.callFake(<T>(key: string): T => storageValues[key] as T);

        transformer = new MonetateTransformer(
            constants,
            storage,
            jasmine.createSpy('$filter').and.returnValue(normalize) as unknown as ng.FilterFactory
        );
    });

    describe('catalog mappings', () => {
        it('should return baggage identifiers for supported baggage types', () => {
            expect(transformer.getBaggageType('BAGGAGE_15')).toBe('bag-15');
            expect(transformer.getBaggageType('BAGGAGE_23')).toBe('bag-23');
            expect(transformer.getBaggageType('BAGGAGE_32')).toBe('bag-32');
        });

        it('should return an empty identifier for an unsupported baggage type', () => {
            expect(transformer.getBaggageType('UNKNOWN')).toBe('');
        });

        it('should return special baggage identifiers for supported types', () => {
            expect(transformer.getSpecialBaggageType('BICYCLE')).toBe('speq-bike');
            expect(transformer.getSpecialBaggageType('SKI_SNOW')).toBe('speq-ski');
            expect(transformer.getSpecialBaggageType('GOLF_EQUIPMENT')).toBe('speq-golf');
        });

        it('should return seat identifiers and use normal seat as fallback', () => {
            expect(transformer.getMonetateSeatId('UPFRONT')).toBe('seat-upfront');
            expect(transformer.getMonetateSeatId('EMERGENCY_EXIT')).toBe('seat-exit');
            expect(transformer.getMonetateSeatId('UNKNOWN')).toBe('seat-normal');
        });

        it('should return insurance identifiers only for supported offers', () => {
            expect(transformer.getMonetateInsuranceId('IBAESTPR025')).toBe('insurance-cancellation');
            expect(transformer.getMonetateInsuranceId('IBAESCOM025EUT')).toBe('insurance-assistance');
            expect(transformer.getMonetateInsuranceId('UNKNOWN')).toBe('');
        });

        it('should calculate rounded unit prices', () => {
            expect(transformer.calculateMean(10, 3)).toBe(3.33);
        });
    });

    describe('ancillary transformations', () => {
        it('should aggregate baggage by type', () => {
            transformer.currency = 'EUR';

            const result = transformer.getBaggagesFromBasket({
                segments: [
                    {
                        baggages: [
                            { type: { subtype: 'BAGGAGE_23' }, quanty: 1, total: 30 },
                            { type: { subtype: 'BAGGAGE_23' }, quanty: 2, total: 60 }
                        ]
                    }
                ]
            } as Parameters<MonetateTransformer['getBaggagesFromBasket']>[0]);

            expect(result).toEqual([
                createAncillaryProduct('bag-23', '30', '3')
            ]);
        });

        it('should aggregate seats by type and exclude zero quantities', () => {
            transformer.currency = 'EUR';

            const result = transformer.getSeatsFromBasket({
                segments: [
                    {
                        seats: [
                            { type: 'UPFRONT', quanty: 1, amount: 12 },
                            { type: 'UPFRONT', quanty: 1, amount: 12 },
                            { type: 'PROMO', quanty: 0, amount: 0 }
                        ]
                    }
                ]
            } as Parameters<MonetateTransformer['getSeatsFromBasket']>[0]);

            expect(result).toEqual([
                createAncillaryProduct('seat-upfront', '12', '2')
            ]);
        });

        it('should transform a valid insurance selection', () => {
            transformer.currency = 'EUR';

            const result = transformer.getInsurancesFromBasket({
                offer: 'IBAESTPR025',
                total: 19.99
            } as Parameters<MonetateTransformer['getInsurancesFromBasket']>[0]);

            expect(result).toEqual([
                createAncillaryProduct('insurance-cancellation', '19.99', '1')
            ]);
        });

        it('should ignore an insurance selection with an unknown offer', () => {
            transformer.currency = 'EUR';

            expect(transformer.getInsurancesFromBasket({
                offer: 'UNKNOWN',
                total: 20
            } as Parameters<MonetateTransformer['getInsurancesFromBasket']>[0])).toEqual([]);
        });

        it('should transform flexibility using the provided selection', () => {
            transformer.currency = 'EUR';

            const result = transformer.getFlexibilityFromBasket({
                subtype: 'FLIGHT_CHANGE',
                total: 30,
                passengerPrices: [{}, {}]
            } as Parameters<MonetateTransformer['getFlexibilityFromBasket']>[0]);

            expect(result).toEqual([
                createAncillaryProduct('flex-change', '15', '2')
            ]);
        });

        it('should use selected flexibility from storage when no selection is provided', () => {
            transformer.currency = 'EUR';
            storageValues.selectedFlex = {
                subtype: 'VOUCHER_REFUND',
                total: 20,
                passengerPrices: [{}]
            };

            expect(transformer.getFlexibilityFromBasket()).toEqual([
                createAncillaryProduct('flex-refund', '20', '1')
            ]);
        });

        it('should transform priority services into one product', () => {
            transformer.currency = 'EUR';

            const result = transformer.getPriorityFromBasket({
                segments: [
                    { quanty: 1, amount: 10 },
                    { quanty: 2, amount: 20 }
                ]
            } as Parameters<MonetateTransformer['getPriorityFromBasket']>[0]);

            expect(result).toEqual([
                createAncillaryProduct('priority', '10', '3')
            ]);
        });

        it('should aggregate special baggage by type', () => {
            transformer.currency = 'EUR';

            const result = transformer.getSpeqBaggageFromBasket({
                segments: [
                    {
                        speqs: [
                            { type: 'BICYCLE', quanty: 1, total: 50 },
                            { type: 'BICYCLE', quanty: 1, total: 50 }
                        ]
                    }
                ]
            } as Parameters<MonetateTransformer['getSpeqBaggageFromBasket']>[0]);

            expect(result).toEqual([
                createAncillaryProduct('speq-bike', '50', '2')
            ]);
        });

        it('should transform all ancillary collections using the stored currency', () => {
            storageValues.fareData.contextMetadata.currencies[0].code = 'USD';

            const result = transformer.transformAncillariesInMonetateProductModel({
                baggages: {
                    segments: [
                        {
                            baggages: [
                                { type: { subtype: 'BAGGAGE_15' }, quanty: 1, total: 15 }
                            ]
                        }
                    ]
                }
            } as Parameters<MonetateTransformer['transformAncillariesInMonetateProductModel']>[0]);

            expect(result).toEqual([
                createAncillaryProduct('bag-15', '15', '1', 'USD')
            ]);
        });

        it('should return undefined when ancillary information is missing', () => {
            expect(transformer.transformAncillariesInMonetateProductModel(null)).toBeUndefined();
        });
    });

    describe('fare and destination transformations', () => {
        it('should transform cabin and preferred cabin products', () => {
            const result = transformer.transformCabinInMonetateProductModel([
                { cabinType: 'E' },
                { cabinType: 'B' }
            ] as Parameters<MonetateTransformer['transformCabinInMonetateProductModel']>[0], 'N');

            expect(result).toEqual([
                { productId: 'cabin-economy', quantity: '1', unitPrice: '0', isAncillary: false },
                { productId: 'cabin-business', quantity: '1', unitPrice: '0', isAncillary: false },
                { productId: 'fare-flexible', quantity: '1', unitPrice: '0', isAncillary: false }
            ]);
        });

        it('should map fare names after removing accents', () => {
            expect(transformer.getFareId('Básica')).toBe('fare-basic');
            expect(transformer.getFareId('business-flexible')).toBe('fare-business-flex');
            expect(transformer.getFareId('unknown')).toBe('');
        });

        it('should exclude unknown fare families from transformed products', () => {
            const result = transformer.transformFareDataInProductModel([
                { commercialNameES: 'Óptima' },
                { commercialNameES: 'Unknown' }
            ] as Parameters<MonetateTransformer['transformFareDataInProductModel']>[0]);

            expect(result).toEqual([
                { productId: 'fare-optima', quantity: '1', unitPrice: '0', isAncillary: false }
            ]);
        });

        it('should classify non-US American destinations as LATAM', () => {
            const result = transformer.transformDestinationAreasCitiesListInProductModel([
                {
                    description: 'america',
                    cities: [
                        {
                            code: 'BOG',
                            country: { code: 'CO' }
                        }
                    ]
                }
            ] as Parameters<MonetateTransformer['transformDestinationAreasCitiesListInProductModel']>[0],
            [{ destination: 'BOG' }] as Parameters<MonetateTransformer['transformDestinationAreasCitiesListInProductModel']>[1]);

            expect(result).toEqual([
                { productId: 'destination-latam', quantity: '1', unitPrice: '0', isAncillary: false }
            ]);
        });

        it('should return destination identifiers after normalizing the continent name', () => {
            expect(transformer.getFlightDestinationId('África y Oriente Medio')).toBe('destination-africa');
            expect(transformer.getFlightDestinationId('Unknown')).toBe('');
        });
    });

    describe('purchase and trip transformations', () => {
        it('should merge non-ancillary cart products with purchased ancillary products', () => {
            storageValues.addedCartProducts = [
                { productId: 'flight', quantity: '1', unitPrice: '0', isAncillary: false },
                { productId: 'old-bag', quantity: '1', unitPrice: '10', isAncillary: true }
            ];

            const result = transformer.compareCartProductsWithPurchasedProducts({
                baggages: {
                    segments: [
                        {
                            baggages: [
                                { type: { subtype: 'BAGGAGE_15' }, quanty: 1, total: 15 }
                            ]
                        }
                    ]
                }
            } as Parameters<MonetateTransformer['compareCartProductsWithPurchasedProducts']>[0]);

            expect(result).toEqual([
                { productId: 'flight', quantity: '1', unitPrice: '0', isAncillary: false },
                createAncillaryProduct('bag-15', '15', '1')
            ]);
        });

        it('should create purchased products with zero unit price', () => {
            storageValues.addedCartProducts = [
                { productId: 'previous-ancillary', isAncillary: true }
            ];

            const result = transformer.transformPurchasedInfoInProductModel({
                pnr: 'ABC123',
                summaryInfo: {
                    ancillaries: {
                        insurance: {
                            offer: 'IBAESTPR025',
                            total: 20
                        }
                    }
                }
            } as Parameters<MonetateTransformer['transformPurchasedInfoInProductModel']>[0]);

            expect(result).toEqual([
                {
                    purchaseId: 'ABC123',
                    productId: 'insurance-cancellation',
                    quantity: '1',
                    unitPrice: '0',
                    currency: 'EUR'
                }
            ]);
        });

        it('should classify summer, winter, weekend and business trips', () => {
            expect(transformer.getTripTypeId([
                { date: '2024-06-01T12:00:00' },
                { date: '2024-06-08T12:00:00' }
            ] as Parameters<MonetateTransformer['getTripTypeId']>[0])).toBe('trip-summer');

            expect(transformer.getTripTypeId([
                { date: '2024-01-01T12:00:00' },
                { date: '2024-01-07T12:00:00' }
            ] as Parameters<MonetateTransformer['getTripTypeId']>[0])).toBe('trip-winter');

            expect(transformer.getTripTypeId([
                { date: '2024-03-01T12:00:00' },
                { date: '2024-03-03T12:00:00' }
            ] as Parameters<MonetateTransformer['getTripTypeId']>[0])).toBe('trip-weekend');

            expect(transformer.getTripTypeId([
                { date: '2024-03-04T12:00:00' },
                { date: '2024-03-05T12:00:00' }
            ] as Parameters<MonetateTransformer['getTripTypeId']>[0])).toBe('trip-business');
        });

        it('should transform a recognized trip type into a product', () => {
            const result = transformer.transformOriginDestinationInfoIntoTripType([
                { date: '2024-06-01T12:00:00' },
                { date: '2024-06-08T12:00:00' }
            ] as Parameters<MonetateTransformer['transformOriginDestinationInfoIntoTripType']>[0]);

            expect(result).toEqual([
                { productId: 'trip-summer', quantity: '1', unitPrice: '0', isAncillary: false }
            ]);
        });
    });

    describe('flight datalayer transformations', () => {
        const data = {
            originDestinations: [
                { origin: 'MAD', destination: 'LHR', date: '2024-06-01' },
                { origin: 'LHR', destination: 'MAD', date: '2024-06-08' }
            ]
        };

        const passengers = {
            passengers: 4,
            numAdults: 1,
            numYoung: 1,
            numTeenager: 1,
            numChilds: 1,
            numInfant: 1,
            numSeniors: 1
        };

        const fareFamilies = [
            { cabinType: 'E' },
            { cabinType: 'B' }
        ];

        it('should create flight review data and store the flight identifier', () => {
            const result = transformer.createFlightReviewMonetate(
                data,
                passengers,
                [[
                    { departure: { code: 'MAD' }, arrival: { code: 'LHR' } },
                    { departure: { code: 'LHR' }, arrival: { code: 'MAD' } }
                ]],
                { price: { total: 120, currency: 'EUR' } },
                fareFamilies
            );

            expect(result).toEqual([
                'addFlightReview',
                {
                    depDate: ['20240601'],
                    destination: ['LHR'],
                    origin: ['MAD'],
                    travelers: [4],
                    adults: [3],
                    minors: [1],
                    infants: [1],
                    seniors: [1],
                    retDate: ['20240608'],
                    serviceClass: ['Economy', 'Business']
                },
                'MADLHRLHRMAD',
                1,
                120,
                'EUR'
            ]);
            expect(storage.set).toHaveBeenCalledWith('flightIdentifier', 'MADLHRLHRMAD');
        });

        it('should create flight search data', () => {
            const result = transformer.createFlightSearchMonetate(
                data,
                passengers,
                { fareFamilyConditions: fareFamilies }
            );

            expect(result).toEqual([
                'addFlightSearch',
                {
                    depDate: ['20240601'],
                    destination: ['LHR'],
                    origin: ['MAD'],
                    travelers: [4],
                    adults: [3],
                    minors: [1],
                    infants: [1],
                    seniors: [1],
                    retDate: ['20240608'],
                    serviceClass: ['Economy', 'Business']
                }
            ]);
        });

        it('should create flight booking data using stored identifiers and currency', () => {
            storageValues.flightIdentifier = 'MADLHR';
            storageValues.avSelectedOffer = {
                price: { currency: 'EUR' }
            };

            const result = transformer.createFlightBookingMonetate(
                data,
                passengers,
                {
                    pnr: 'ABC123',
                    price: { totalPrice: 150 }
                },
                fareFamilies
            );

            expect(result).toEqual([
                'addFlightBooking',
                {
                    destination: ['LHR'],
                    origin: ['MAD'],
                    travelers: [4],
                    depDate: ['20240601'],
                    adults: [3],
                    minors: [1],
                    infants: [1],
                    seniors: [1],
                    retDate: ['20240608'],
                    serviceClass: ['Economy', 'Business']
                },
                'ABC123',
                'MADLHR',
                1,
                150,
                'EUR'
            ]);
        });
    });

    describe('selected offer transformations', () => {
        it('should transform routes into Monetate route identifiers', () => {
            const result = transformer.transformFlightRouteProductDetail([
                { origin: 'MAD', destination: 'LHR', date: '2024-06-01' },
                { origin: 'LHR', destination: 'MAD', date: '2024-06-08' }
            ] as Parameters<MonetateTransformer['transformFlightRouteProductDetail']>[0]);

            expect(result).toEqual([
                'MADLHR-20240601',
                'LHRMAD-20240608'
            ]);
        });

        it('should transform every selected segment into a product', () => {
            const result = transformer.transformSelectedOfferInProductModel(
                [
                    [{ segmentId: 'segment-1' }],
                    [{ id: 'segment-2' }]
                ] as Parameters<MonetateTransformer['transformSelectedOfferInProductModel']>[0],
                {
                    originDestinations: [
                        { totalPrice: { currency: 'USD' } }
                    ]
                }
            );

            expect(result).toEqual([
                { productId: 'segment-1', quantity: '1', unitPrice: '0', currency: 'USD' },
                { productId: 'segment-2', quantity: '1', unitPrice: '0', currency: 'USD' }
            ]);
        });

        it('should return cabin descriptions for supported cabin types', () => {
            expect(transformer.getCabinDescriptionbyType('E')).toBe('Economy');
            expect(transformer.getCabinDescriptionbyType('N')).toBe('Premium Economy');
            expect(transformer.getCabinDescriptionbyType('B')).toBe('Business');
            expect(transformer.getCabinDescriptionbyType('UNKNOWN')).toBe('');
        });
    });
});
