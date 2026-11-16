import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IssueOrderInfoTransformerService } from '@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/services/ib-Mmb-issue-order-info-transformer.service';
import { OnSuccessEvent } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-model';
import {
    PAYMENT_SESSION_KEYS,
    DEFAULT_CONTEXT_METADATA,
    DEFAULT_PHONE_TYPE
} from '@src/components/ib-MmB-payment/constants/ib-Mmb-payment-session.constants';

describe('IssueOrderInfoTransformerService', () => {
    let service: IssueOrderInfoTransformerService;
    let sessionStorageSpy: jasmine.SpyObj<CommonsSessionStorageService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);

        TestBed.configureTestingModule({
            providers: [
                IssueOrderInfoTransformerService,
                { provide: CommonsSessionStorageService, useValue: spy }
            ]
        });

        service = TestBed.inject(IssueOrderInfoTransformerService);
        sessionStorageSpy = TestBed.inject(CommonsSessionStorageService) as jasmine.SpyObj<CommonsSessionStorageService>;
    });

    function setupSessionStorageMock(options: {
        fareData?: any;
        bookingInfo?: any;
        voucherInfo?: any;
    }): void {
        sessionStorageSpy.get.and.callFake((key: string) => {
            if (key === PAYMENT_SESSION_KEYS.FARE_DATA) {
                return options.fareData !== undefined ? options.fareData : null;
            }
            if (key === PAYMENT_SESSION_KEYS.BOOKING_INFO) {
                return options.bookingInfo !== undefined ? options.bookingInfo : null;
            }
            if (key === PAYMENT_SESSION_KEYS.VOUCHER_INFO) {
                return options.voucherInfo !== undefined ? options.voucherInfo : null;
            }
            return null;
        });
    }

    function createFareDataWithPrice(priceOverrides?: Partial<{
        fare: number | null | undefined | string;
        tax: number | null | undefined | string;
        total: number | null | undefined | string;
        currency: string | null;
    }>): any {
        const defaultPrice = {
            fare: 100,
            tax: 20,
            total: 120,
            currency: 'EUR'
        };

        return {
            offers: [
                {
                    price: {
                        ...defaultPrice,
                        ...priceOverrides
                    }
                }
            ]
        };
    }

    function createPassengerData(options?: {
        personalInfo?: {
            name?: string | null;
            surname?: string | null;
        } | null;
        externalPersonalInfo?: {
            name?: string | null;
            firstSurname?: string | null;
        } | null;
    }): any {
        if (options === undefined) {
            return {};
        }

        return {
            personalInfo: options.personalInfo,
            externalPersonalInfo: options.externalPersonalInfo
        };
    }

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('transformForVoluntaryChangeConfirmation', () => {
        let mockPaymentEvent: OnSuccessEvent;
        let mockFareData: any;
        let mockBookingInfo: any;
        let mockVoucherInfo: any;

        beforeEach(() => {
            // Mock PaymentEvent
            mockPaymentEvent = {
                status: 'COMPLETED',
                methodType: 'CREDIT_CARD',
                details: {
                    creditCardType: 'VI'
                }
            };

            // Mock FareData
            mockFareData = {
                contextMetadata: {
                    currencies: ['EUR', 'USD'],
                    language: 'en',
                    country: 'GB'
                },
                offers: [
                    {
                        price: {
                            fare: 100,
                            tax: 20,
                            total: 120,
                            currency: 'EUR'
                        },
                        slices: [],
                        warnings: ['test warning']
                    }
                ]
            };

            // Mock BookingInfo
            mockBookingInfo = {
                order: {
                    orderId: 'ORDER123',
                    bookingReferences: ['REF123'],
                    orderItems: [],
                    primaryContactInfo: {
                        phone: '+34600000000',
                        email: 'test@test.com',
                        phoneType: 'MOBILE'
                    }
                },
                passengers: [
                    {
                        personalInfo: {
                            firstName: 'John',
                            firstSurname: 'Doe'
                        }
                    }
                ],
                tickets: ['TICKET123']
            };

            mockVoucherInfo = null;
        });

        it('should transform data successfully with all required fields', () => {
            // Arrange
            setupSessionStorageMock({
                fareData: mockFareData,
                bookingInfo: mockBookingInfo,
                voucherInfo: mockVoucherInfo
            });

            // Act
            const result = service.transformForVoluntaryChangeConfirmation(mockPaymentEvent);

            // Assert
            expect(result).toBeDefined();
            expect(result.contextMetadata).toEqual({
                currencies: ['EUR', 'USD'],
                language: 'en',
                country: 'GB'
            });
            expect(result.total).toBe(120);
            expect(result.order.orderId).toBe('ORDER123');
            expect(result.passengers).toEqual(mockBookingInfo.passengers);
            expect(result.tickets).toEqual(['TICKET123']);
            expect(result.warnings).toEqual(['test warning']);
            expect(result.paymentMethod.type).toBe('CREDIT_CARD');
        });

        it('should throw error when fareData is missing', () => {
            // Arrange
            setupSessionStorageMock({
                bookingInfo: mockBookingInfo
            });

            // Act & Assert
            expect(() => service.transformForVoluntaryChangeConfirmation(mockPaymentEvent))
                .toThrowError(/Missing required data in sessionStorage.*fareData/);
        });

        it('should throw error when bookingInfo is missing', () => {
            // Arrange
            setupSessionStorageMock({
                fareData: mockFareData
            });

            // Act & Assert
            expect(() => service.transformForVoluntaryChangeConfirmation(mockPaymentEvent))
                .toThrowError(/Missing required data in sessionStorage.*bookingInfo/);
        });

        it('should throw error when both fareData and bookingInfo are missing', () => {
            // Arrange
            sessionStorageSpy.get.and.returnValue(null);

            // Act & Assert
            expect(() => service.transformForVoluntaryChangeConfirmation(mockPaymentEvent))
                .toThrowError(/Missing required data in sessionStorage.*fareData.*bookingInfo/);
        });

        describe('data driven tests', () => {
            const testCases = [
                {
                    description: 'should apply default values for missing contextMetadata',
                    setup: () => ({
                        fareData: { ...mockFareData, contextMetadata: null },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.contextMetadata.language).toBe(DEFAULT_CONTEXT_METADATA.LANGUAGE);
                        expect(result.contextMetadata.country).toBe(DEFAULT_CONTEXT_METADATA.COUNTRY);
                        expect(result.contextMetadata.currencies).toEqual([]);
                    }
                },
                {
                    description: 'should handle missing bookingInfo.order',
                    setup: () => ({
                        fareData: mockFareData,
                        bookingInfo: { ...mockBookingInfo, order: null }
                    }),
                    assertions: (result: any) => {
                        expect(result.order.orderId).toBeUndefined();
                        expect(result.order.bookingReferences).toBeUndefined();
                    }
                },
                {
                    description: 'should calculate total with compensation info when available',
                    setup: () => ({
                        fareData: {
                            ...mockFareData,
                            compensationInfo: { totalCost: 150 }
                        },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.total).toBe(150);
                    }
                },
                {
                    description: 'should subtract voucher amount from total',
                    setup: () => ({
                        fareData: mockFareData,
                        bookingInfo: mockBookingInfo,
                        voucherInfo: { amount: 30 }
                    }),
                    assertions: (result: any) => {
                        expect(result.total).toBe(90);
                    }
                },
                {
                    description: 'should default tickets to empty array when missing',
                    setup: () => {
                        const bookingInfoWithoutTickets = { ...mockBookingInfo };
                        delete bookingInfoWithoutTickets.tickets;
                        return {
                            fareData: mockFareData,
                            bookingInfo: bookingInfoWithoutTickets
                        };
                    },
                    assertions: (result: any) => {
                        expect(result.tickets).toEqual([]);
                    }
                },
                {
                    description: 'should set maskedCreditCard to null (field managed externally)',
                    setup: () => ({
                        fareData: mockFareData,
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.paymentMethod.maskedCreditCard).toBeNull();
                    }
                }
            ];

            testCases.forEach(({ description, setup, assertions }) => {
                it(description, () => {
                    // Arrange
                    const mockData = setup();
                    setupSessionStorageMock(mockData);

                    // Act
                    const result = service.transformForVoluntaryChangeConfirmation(mockPaymentEvent);

                    // Assert
                    assertions(result);
                });
            });
        });

        it('should set cardTypeId to null for non-credit card payments', () => {
            // Arrange
            const paymentEventNonCard: OnSuccessEvent = {
                status: 'COMPLETED',
                methodType: 'PAYPAL',
                details: {}
            };
            setupSessionStorageMock({
                fareData: mockFareData,
                bookingInfo: mockBookingInfo
            });

            // Act
            const result = service.transformForVoluntaryChangeConfirmation(paymentEventNonCard);

            // Assert
            expect(result.paymentMethod.cardTypeId).toBeNull();
        });

        it('should use externalPersonalInfo when personalInfo is missing', () => {
            // Arrange
            const bookingInfoWithExternal = {
                ...mockBookingInfo,
                passengers: [
                    {
                        externalPersonalInfo: {
                            name: 'Jane',
                            firstSurname: 'Smith'
                        }
                    }
                ]
            };
            setupSessionStorageMock({
                fareData: mockFareData,
                bookingInfo: bookingInfoWithExternal
            });

            // Act
            const result = service.transformForVoluntaryChangeConfirmation(mockPaymentEvent);

            // Assert
            expect(result.paymentMethod.payer.personalInfo.name).toBe('Jane');
            expect(result.paymentMethod.payer.personalInfo.surname).toBe('Smith');
        });

        it('should use default contact info when primaryContactInfo is missing', () => {
            // Arrange
            const bookingInfoWithoutContact = {
                ...mockBookingInfo,
                order: {
                    ...mockBookingInfo.order,
                    primaryContactInfo: null
                }
            };
            setupSessionStorageMock({
                fareData: mockFareData,
                bookingInfo: bookingInfoWithoutContact
            });

            // Act
            const result = service.transformForVoluntaryChangeConfirmation(mockPaymentEvent);

            // Assert
            expect(result.paymentMethod.payer.contactInfo).toEqual({
                phone: '',
                email: '',
                phoneType: DEFAULT_PHONE_TYPE
            });
        });


        describe('metadata, compensation and order validation - data driven tests', () => {
            const additionalValidationCases = [
                {
                    description: 'should return empty warnings when first offer has no warnings',
                    setup: () => ({
                        fareData: {
                            ...mockFareData,
                            offers: [{ ...mockFareData.offers[0], warnings: undefined }]
                        },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.warnings).toEqual([]);
                    }
                },
                {
                    description: 'should build contextMetadata with partial data',
                    setup: () => ({
                        fareData: {
                            ...mockFareData,
                            contextMetadata: {
                                currencies: ['USD'],
                                language: null,
                                country: undefined
                            }
                        },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.contextMetadata.currencies).toEqual(['USD']);
                        expect(result.contextMetadata.language).toBe(DEFAULT_CONTEXT_METADATA.LANGUAGE);
                        expect(result.contextMetadata.country).toBe(DEFAULT_CONTEXT_METADATA.COUNTRY);
                    }
                },
                {
                    description: 'should handle null fareData contextMetadata',
                    setup: () => ({
                        fareData: { ...mockFareData, contextMetadata: null },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.contextMetadata.currencies).toEqual([]);
                        expect(result.contextMetadata.language).toBe(DEFAULT_CONTEXT_METADATA.LANGUAGE);
                        expect(result.contextMetadata.country).toBe(DEFAULT_CONTEXT_METADATA.COUNTRY);
                    }
                },
                {
                    description: 'should calculate total from offer when compensationInfo is null',
                    setup: () => ({
                        fareData: {
                            ...mockFareData,
                            compensationInfo: { totalCost: null }
                        },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.total).toBe(120);
                    }
                },
                {
                    description: 'should calculate total from offer when compensationInfo is undefined',
                    setup: () => ({
                        fareData: {
                            ...mockFareData,
                            compensationInfo: { totalCost: undefined }
                        },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.total).toBe(120);
                    }
                },
                {
                    description: 'should handle missing bookingInfo.order in order section gracefully',
                    setup: () => ({
                        fareData: mockFareData,
                        bookingInfo: { ...mockBookingInfo, order: undefined }
                    }),
                    assertions: (result: any) => {
                        expect(result.order.orderId).toBeUndefined();
                        expect(result.order.bookingReferences).toBeUndefined();
                        expect(result.order.orderItems).toBeUndefined();
                        expect(result.order.primaryContactInfo).toBeUndefined();
                    }
                }
            ];

            additionalValidationCases.forEach(({ description, setup, assertions }) => {
                it(description, () => {
                    // Arrange
                    const mockData = setup();
                    setupSessionStorageMock(mockData);

                    // Act
                    const result = service.transformForVoluntaryChangeConfirmation(mockPaymentEvent);

                    // Assert
                    assertions(result);
                });
            });
        });

        describe('error scenarios - data driven tests', () => {
            const errorTestCases = [
                {
                    description: 'should throw error when fareData has no offers (strict validation)',
                    fareData: { ...mockFareData, offers: null },
                    errorPattern: /Cannot confirm payment without valid offer total/
                },
                {
                    description: 'should return 0 when no offers and no compensation',
                    fareData: {
                        ...mockFareData,
                        offers: null,
                        compensationInfo: null
                    },
                    errorPattern: /Cannot confirm payment without valid offer total/
                }
            ];

            errorTestCases.forEach(({ description, fareData, errorPattern }) => {
                it(description, () => {
                    // Arrange
                    setupSessionStorageMock({
                        fareData,
                        bookingInfo: mockBookingInfo
                    });

                    // Act & Assert
                    expect(() => service.transformForVoluntaryChangeConfirmation(mockPaymentEvent))
                        .toThrowError(errorPattern);
                });
            });
        });

        it('should build order section with all fields from bookingInfo.order', () => {
            // Arrange
            setupSessionStorageMock({
                fareData: mockFareData,
                bookingInfo: mockBookingInfo
            });

            // Act
            const result = service.transformForVoluntaryChangeConfirmation(mockPaymentEvent);

            // Assert
            expect(result.order).toBeDefined();
            expect(result.order.orderId).toBe('ORDER123');
            expect(result.order.bookingReferences).toEqual(['REF123']);
            expect(result.order.orderItems).toEqual([]);
            expect(result.order.primaryContactInfo).toEqual(mockBookingInfo.order.primaryContactInfo);
            expect(result.order.price).toBeDefined();
            expect(result.order.slices).toEqual([]);
        });

        describe('voucher and slices validation - data driven tests', () => {
            const voucherAndSlicesTestCases = [
                {
                    description: 'should not apply voucher discount when amount is not a number',
                    setup: () => ({
                        fareData: mockFareData,
                        bookingInfo: mockBookingInfo,
                        voucherInfo: { amount: '30' }
                    }),
                    assertions: (result: any) => {
                        expect(result.total).toBe(120);
                    }
                },
                {
                    description: 'should not apply voucher discount when amount is null',
                    setup: () => ({
                        fareData: mockFareData,
                        bookingInfo: mockBookingInfo,
                        voucherInfo: { amount: null }
                    }),
                    assertions: (result: any) => {
                        expect(result.total).toBe(120);
                    }
                },
                {
                    description: 'should handle voucher discount of 0',
                    setup: () => ({
                        fareData: mockFareData,
                        bookingInfo: mockBookingInfo,
                        voucherInfo: { amount: 0 }
                    }),
                    assertions: (result: any) => {
                        expect(result.total).toBe(120);
                    }
                },
                {
                    description: 'should handle null slices in first offer (fallback to empty array)',
                    setup: () => ({
                        fareData: {
                            ...mockFareData,
                            offers: [{ ...mockFareData.offers[0], slices: null }]
                        },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.order.slices).toEqual([]);
                    }
                },
                {
                    description: 'should handle undefined slices in first offer (fallback to empty array)',
                    setup: () => ({
                        fareData: {
                            ...mockFareData,
                            offers: [{ price: mockFareData.offers[0].price, warnings: [] }]
                        },
                        bookingInfo: mockBookingInfo
                    }),
                    assertions: (result: any) => {
                        expect(result.order.slices).toEqual([]);
                    }
                }
            ];

            voucherAndSlicesTestCases.forEach(({ description, setup, assertions }) => {
                it(description, () => {
                    // Arrange
                    const mockData = setup();
                    setupSessionStorageMock(mockData);

                    // Act
                    const result = service.transformForVoluntaryChangeConfirmation(mockPaymentEvent);

                    // Assert
                    assertions(result);
                });
            });
        });

        describe('cardTypeId validations', () => {
            const cardTypeIdTestCases = [
                {
                    description: 'should return null cardTypeId when creditCardType is null',
                    paymentEvent: {
                        status: 'COMPLETED' as const,
                        methodType: 'CREDIT_CARD' as const,
                        details: { creditCardType: null }
                    }
                },
                {
                    description: 'should return null cardTypeId when creditCardType is undefined',
                    paymentEvent: {
                        status: 'COMPLETED' as const,
                        methodType: 'CREDIT_CARD' as const,
                        details: {}
                    }
                },
                {
                    description: 'should return null cardTypeId when details is null',
                    paymentEvent: {
                        status: 'COMPLETED' as const,
                        methodType: 'CREDIT_CARD' as const,
                        details: null as any
                    }
                }
            ];

            cardTypeIdTestCases.forEach(({ description, paymentEvent }) => {
                it(description, () => {
                    // Arrange
                    setupSessionStorageMock({
                        fareData: mockFareData,
                        bookingInfo: mockBookingInfo
                    });

                    // Act
                    const result = service.transformForVoluntaryChangeConfirmation(paymentEvent);

                    // Assert
                    expect(result.paymentMethod.cardTypeId).toBeNull();
                });
            });
        });

        describe('slices and segments transformation - data driven tests', () => {
            const createSegmentWithCabin = (cabinConfig: any) => ({
                id: 'SEG1',
                departure: {
                    code: 'MAD',
                    name: 'Madrid',
                    terminal: 'T4',
                    city: {
                        code: 'MAD',
                        description: 'Madrid',
                        countryCode: 'ES',
                        country: 'Spain'
                    }
                },
                arrival: {
                    code: 'JFK',
                    name: 'New York',
                    terminal: '1',
                    city: {
                        code: 'NYC',
                        description: 'New York',
                        countryCode: 'US',
                        country: 'United States'
                    }
                },
                flight: {
                    marketingCarrier: 'IB',
                    operationalCarrier: 'IB',
                    marketingFlightNumber: 'IB6251',
                    operationalFlightNumber: 'IB6251',
                    operationalDisclosure: 'OPERATED BY IBERIA',
                    aircraft: 'A350'
                },
                cabin: cabinConfig,
                departureDateTime: '2025-01-15T10:00:00',
                arrivalDateTime: '2025-01-15T14:00:00',
                duration: 'PT4H',
                overnight: false,
                waitingTime: 'PT0H'
            });

            const sliceTransformationCases = [
                {
                    description: 'should use bookingClass as cabinDescription fallback when cabinDescription is missing',
                    cabinConfig: {
                        rbd: 'Y',
                        bookingCode: 'Y',
                        bookingClass: 'Economy',
                        fareFamily: 'BASIC'
                    },
                    expectedCabinDescription: 'Economy'
                },
                {
                    description: 'should preserve cabinDescription when it is defined',
                    cabinConfig: {
                        rbd: 'J',
                        bookingCode: 'J',
                        bookingClass: 'Business',
                        cabinDescription: 'Business Class Premium',
                        fareFamily: 'FLEX'
                    },
                    expectedCabinDescription: 'Business Class Premium'
                },
                {
                    description: 'should use bookingClass fallback when cabinDescription is null',
                    cabinConfig: {
                        rbd: 'Y',
                        bookingCode: 'Y',
                        bookingClass: 'Economy',
                        cabinDescription: null,
                        fareFamily: 'BASIC'
                    },
                    expectedCabinDescription: 'Economy'
                }
            ];

            sliceTransformationCases.forEach(({ description, cabinConfig, expectedCabinDescription }) => {
                it(description, () => {
                    // Arrange
                    const fareDataWithSlices = {
                        ...mockFareData,
                        offers: [
                            {
                                ...mockFareData.offers[0],
                                slices: [
                                    {
                                        sliceId: 'SLICE1',
                                        departureDateTime: '2025-01-15T10:00:00',
                                        arrivalDateTime: '2025-01-15T14:00:00',
                                        duration: 'PT4H',
                                        stopsNumber: 0,
                                        price: 100,
                                        detailedPrices: {},
                                        segments: [createSegmentWithCabin(cabinConfig)]
                                    }
                                ]
                            }
                        ]
                    };
                    setupSessionStorageMock({
                        fareData: fareDataWithSlices,
                        bookingInfo: mockBookingInfo
                    });

                    // Act
                    const result = service.transformForVoluntaryChangeConfirmation(mockPaymentEvent);

                    // Assert
                    expect(result.order.slices[0].segments[0].cabin.cabinDescription).toBe(expectedCabinDescription);
                });
            });
        });
    });

    describe('buildOrderPrice', () => {
        it('should build complete price object when all price fields are present', () => {
            // Arrange
            const fareDataWithPrice = createFareDataWithPrice({ currency: 'USD' });

            // Act
            const result = (service as any).buildOrderPrice(fareDataWithPrice);

            // Assert
            expect(result).toEqual({
                fare: 100,
                tax: 20,
                total: 120,
                currency: 'USD',
                ticketingFee: 0
            });
        });

        it('should return undefined when fareData has no offers', () => {
            // Arrange
            const fareDataNoOffers = { offers: null };

            // Act
            const result = (service as any).buildOrderPrice(fareDataNoOffers);

            // Assert
            expect(result).toBeUndefined();
        });

        it('should return undefined when offers array is empty', () => {
            // Arrange
            const fareDataEmptyOffers = { offers: [] };

            // Act
            const result = (service as any).buildOrderPrice(fareDataEmptyOffers);

            // Assert
            expect(result).toBeUndefined();
        });

        it('should return undefined when first offer has no price', () => {
            // Arrange
            const fareDataNoPrice = {
                offers: [{ price: null }]
            };

            // Act
            const result = (service as any).buildOrderPrice(fareDataNoPrice);

            // Assert
            expect(result).toBeUndefined();
        });

        it('should throw error for missing numeric fields (strict validation for confirmation)', () => {
            // Arrange
            const fareDataPartialPrice = createFareDataWithPrice({
                fare: null,
                tax: undefined,
                total: 100
            });

            // Act & Assert
            expect(() => (service as any).buildOrderPrice(fareDataPartialPrice))
                .toThrowError(/Price must contain valid numeric values for fare, tax and total/);
        });

        it('should use DEFAULT_CONTEXT_METADATA.CURRENCY when currency is missing', () => {
            // Arrange
            const fareDataNoCurrency = createFareDataWithPrice({ currency: null });

            // Act
            const result = (service as any).buildOrderPrice(fareDataNoCurrency);

            // Assert
            expect(result.currency).toBe(DEFAULT_CONTEXT_METADATA.CURRENCY);
        });

        it('should always set ticketingFee to 0', () => {
            // Arrange
            const fareDataWithPrice = createFareDataWithPrice({
                fare: 50,
                tax: 10,
                total: 60,
                currency: 'GBP'
            });

            // Act
            const result = (service as any).buildOrderPrice(fareDataWithPrice);

            // Assert
            expect(result.ticketingFee).toBe(0);
        });

        it('should handle fareData being null', () => {
            // Arrange
            const fareDataNull = null;

            // Act
            const result = (service as any).buildOrderPrice(fareDataNull);

            // Assert
            expect(result).toBeUndefined();
        });

        it('should handle fareData being undefined', () => {
            // Arrange
            const fareDataUndefined = undefined;

            // Act
            const result = (service as any).buildOrderPrice(fareDataUndefined);

            // Assert
            expect(result).toBeUndefined();
        });

        it('should handle price object with all fields as 0', () => {
            // Arrange
            const fareDataZeroPrice = createFareDataWithPrice({
                fare: 0,
                tax: 0,
                total: 0
            });

            // Act
            const result = (service as any).buildOrderPrice(fareDataZeroPrice);

            // Assert
            expect(result).toEqual({
                fare: 0,
                tax: 0,
                total: 0,
                currency: 'EUR',
                ticketingFee: 0
            });
        });

        // Parametrized tests for validation errors
        describe('price validation errors', () => {
            const validationErrorTestCases = [
                {
                    description: 'should throw error when fare is missing (strict validation)',
                    priceOverrides: { fare: null }
                },
                {
                    description: 'should throw error when tax is missing (strict validation)',
                    priceOverrides: { tax: undefined }
                },
                {
                    description: 'should throw error when total is missing (strict validation)',
                    priceOverrides: { total: null }
                },
                {
                    description: 'should throw error when fare is a string (type validation)',
                    priceOverrides: { fare: '100' as any }
                }
            ];

            validationErrorTestCases.forEach(({ description, priceOverrides }) => {
                it(description, () => {
                    // Arrange
                    const fareData = createFareDataWithPrice(priceOverrides);

                    // Act & Assert
                    expect(() => (service as any).buildOrderPrice(fareData))
                        .toThrowError(/Price must contain valid numeric values for fare, tax and total/);
                });
            });
        });
    });

    describe('buildPayerPersonalInfo', () => {
        it('should build payer personal info with name and surname from personalInfo', () => {
            // Arrange
            const passenger = createPassengerData({
                personalInfo: { name: 'John', surname: 'Doe' }
            });

            // Act
            const result = (service as any).buildPayerPersonalInfo(passenger);

            // Assert
            expect(result).toEqual({
                name: 'John',
                surname: 'Doe'
            });
        });

        it('should fallback to externalPersonalInfo when personalInfo is missing', () => {
            // Arrange
            const passenger = createPassengerData({
                externalPersonalInfo: { name: 'Jane', firstSurname: 'Smith' }
            });

            // Act
            const result = (service as any).buildPayerPersonalInfo(passenger);

            // Assert
            expect(result).toEqual({
                name: 'Jane',
                surname: 'Smith'
            });
        });

        it('should return empty strings when both personalInfo and externalPersonalInfo are missing', () => {
            // Arrange
            const passenger = createPassengerData();

            // Act
            const result = (service as any).buildPayerPersonalInfo(passenger);

            // Assert
            expect(result).toEqual({
                name: '',
                surname: ''
            });
        });

        describe('null and undefined passenger handling - data driven tests', () => {
            const nullUndefinedTestCases = [
                {
                    description: 'should handle null passenger',
                    passenger: null,
                    expectedResult: { name: '', surname: '' }
                },
                {
                    description: 'should handle undefined passenger',
                    passenger: undefined,
                    expectedResult: { name: '', surname: '' }
                }
            ];

            nullUndefinedTestCases.forEach(({ description, passenger, expectedResult }) => {
                it(description, () => {
                    // Act
                    const result = (service as any).buildPayerPersonalInfo(passenger);

                    // Assert
                    expect(result).toEqual(expectedResult);
                });
            });
        });

        it('should prioritize personalInfo.name over externalPersonalInfo.name', () => {
            // Arrange
            const passenger = createPassengerData({
                personalInfo: { name: 'John', surname: 'Doe' },
                externalPersonalInfo: { name: 'Jane', firstSurname: 'Smith' }
            });

            // Act
            const result = (service as any).buildPayerPersonalInfo(passenger);

            // Assert
            expect(result.name).toBe('John');
            expect(result.surname).toBe('Doe');
        });

        describe('partial personalInfo fallback', () => {
            const partialInfoTestCases = [
                {
                    description: 'should handle partial personalInfo (only name)',
                    passengerData: {
                        personalInfo: { name: 'John' },
                        externalPersonalInfo: { firstSurname: 'Smith' }
                    },
                    expectedName: 'John',
                    expectedSurname: 'Smith'
                },
                {
                    description: 'should handle partial personalInfo (only surname)',
                    passengerData: {
                        personalInfo: { surname: 'Doe' },
                        externalPersonalInfo: { name: 'Jane' }
                    },
                    expectedName: 'Jane',
                    expectedSurname: 'Doe'
                },
                {
                    description: 'should handle null values in personalInfo',
                    passengerData: {
                        personalInfo: { name: null, surname: null },
                        externalPersonalInfo: { name: 'Jane', firstSurname: 'Smith' }
                    },
                    expectedName: 'Jane',
                    expectedSurname: 'Smith'
                },
                {
                    description: 'should handle undefined values in personalInfo',
                    passengerData: {
                        personalInfo: { name: undefined, surname: undefined },
                        externalPersonalInfo: { name: 'Jane', firstSurname: 'Smith' }
                    },
                    expectedName: 'Jane',
                    expectedSurname: 'Smith'
                },
                {
                    description: 'should handle empty string values in personalInfo (fallback behavior)',
                    passengerData: {
                        personalInfo: { name: '', surname: '' },
                        externalPersonalInfo: { name: 'Jane', firstSurname: 'Smith' }
                    },
                    expectedName: 'Jane',
                    expectedSurname: 'Smith'
                },
                {
                    description: 'should handle missing externalPersonalInfo when personalInfo is incomplete',
                    passengerData: {
                        personalInfo: { name: null }
                    },
                    expectedName: '',
                    expectedSurname: ''
                }
            ];

            partialInfoTestCases.forEach(({ description, passengerData, expectedName, expectedSurname }) => {
                it(description, () => {
                    // Arrange
                    const passenger = createPassengerData(passengerData);

                    // Act
                    const result = (service as any).buildPayerPersonalInfo(passenger);

                    // Assert
                    expect(result.name).toBe(expectedName);
                    expect(result.surname).toBe(expectedSurname);
                });
            });
        });
    });
});
