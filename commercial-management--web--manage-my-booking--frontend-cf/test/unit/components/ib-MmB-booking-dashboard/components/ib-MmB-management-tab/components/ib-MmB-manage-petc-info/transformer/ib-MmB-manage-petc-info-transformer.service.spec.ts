import { TestBed } from "@angular/core/testing";
import { IbMmbManagePetcInfoTransformerService } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/transformer/ib-MmB-manage-petc-info-transformer.service";
import { PetcOrderItem, PetcFlight, PetcPassenger, PetcFlightInfo } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/models/petc-info.model";
import { TranslateService } from '@ngx-translate/core';
describe('IbMmbManagePetcInfoTransformerService', () => {
    let service: IbMmbManagePetcInfoTransformerService;
    let translateServiceMock: jasmine.SpyObj<TranslateService>;

    const mockPetcItem: PetcOrderItem = {
        type: 'PET',
        orderItemId: 'ORDER-001',
        price: { total: 50, currency: 'EUR' },
        sliceId: 'SLICE-001',
        passengerId: 'PAX-001',
        amount: 1,
        emd: 'PENDING_PAYMENT',
        subtype: 'DOG',
        segmentIds: ['SEG-001']
    };

    const mockPetcItemPaid: PetcOrderItem = {
        type: 'PET',
        orderItemId: 'ORDER-002',
        price: { total: 60, currency: 'EUR' },
        sliceId: 'SLICE-001',
        passengerId: 'PAX-002',
        amount: 1,
        emd: 'PAID',
        subtype: 'CAT',
        segmentIds: ['SEG-001']
    };

    const mockPetcItemByRoute: PetcOrderItem = {
        type: 'PET',
        orderItemId: 'ORDER-003',
        price: { total: 70, currency: 'EUR' },
        sliceId: 'MADBCN-FLIGHT',
        passengerId: 'PAX-001',
        amount: 1,
        emd: 'PAID',
        subtype: 'BIRD',
        segmentIds: []
    };

    const mockFlight: PetcFlight = {
        segments: [
            {
                sliceId: 'SLICE-001',
                segmentId: 'SEG-001',
                departure: {
                    code: 'MAD',
                    name: 'Madrid',
                    city: { description: 'Madrid' }
                },
                arrival: {
                    code: 'BCN',
                    name: 'Barcelona',
                    city: { description: 'Barcelona' }
                },
                flight: { marketingFlightNumber: 'IB1234' },
                departureDateParsed: { formatedDate: '2024-01-15', dateTime: '10:00' }
            }
        ]
    } as any;

    const mockFlightNoSegments: PetcFlight = {
        segments: []
    }

    const mockFlightUndefinedSegments: PetcFlight = {
        segments: undefined
    } as any;

    const mockPassenger: PetcPassenger = {
        passengerId: 'PAX-001',
        personalInfo: {
            name: 'Juan',
            surname: 'García'
        }
    };

    const mockPassengerNoInfo: PetcPassenger = {
        passengerId: 'PAX-002',
        personalInfo: undefined
    } as any;


    const createPetcItem = (overrides: Partial<PetcOrderItem> = {}): PetcOrderItem => ({
        ...mockPetcItem,
        ...overrides
    });

    beforeEach(() => {
        translateServiceMock = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);

        TestBed.configureTestingModule({
            providers: [
                IbMmbManagePetcInfoTransformerService,
                { provide: TranslateService, useValue: translateServiceMock }
            ]
        });
        service = TestBed.inject(IbMmbManagePetcInfoTransformerService);
    });

    describe('service creation', () => {
        it('should be created', () => {
            expect(service).toBeTruthy()
        })
    })

    describe('transformPetcData - input validation', () => {
        it('should return empty array when petcItems is null', () => {
            const result = service.transformPetcData(null as any, [mockFlight], [mockPassenger]);
            expect(result).toEqual([]);
        });

        it('should return empty array when petcItems is undefined', () => {
            const result = service.transformPetcData(undefined as any, [mockFlight], [mockPassenger]);
            expect(result).toEqual([]);
        });

        it('should return empty array when petcItems is empty', () => {
            const result = service.transformPetcData([], [mockFlight], [mockPassenger]);
            expect(result).toEqual([]);
        });

        it('should return empty array when flights is null', () => {
            const result = service.transformPetcData([mockPetcItem], null as any, [mockPassenger]);
            expect(result).toEqual([]);
        });

        it('should return empty array when flights is undefined', () => {
            const result = service.transformPetcData([mockPetcItem], undefined as any, [mockPassenger]);
            expect(result).toEqual([]);
        });

        it('should return empty array when flights is empty', () => {
            const result = service.transformPetcData([mockPetcItem], [], [mockPassenger]);
            expect(result).toEqual([]);
        });
    });

    describe('transformPetcData - segment handling', () => {
        it('should skip flights with empty segments array', () => {
            const result = service.transformPetcData([mockPetcItem], [mockFlightNoSegments], [mockPassenger]);
            expect(result).toEqual([]);
        });

        it('should skip flights with undefined segments', () => {
            const result = service.transformPetcData([mockPetcItem], [mockFlightUndefinedSegments], [mockPassenger]);
            expect(result).toEqual([]);
        });

        it('should skip segments without matching pets', () => {
            const nonMatchingPet: PetcOrderItem = {
                ...mockPetcItem,
                sliceId: 'DIFFERENT-SLICE',
                segmentIds: ['DIFFERENT-SEG']
            };
            const result = service.transformPetcData([nonMatchingPet], [mockFlight], [mockPassenger]);
            expect(result).toEqual([]);
        });
    });

    describe('transformPetcData - pet-segment matching', () => {

        it('should match pet to segment by sliceId', () => {
            const petWithSliceId = createPetcItem({ sliceId: 'SLICE-001', segmentIds: [] });
            const result = service.transformPetcData([petWithSliceId], [mockFlight], [mockPassenger]);

            expect(result.length).toBe(1);
            expect(result[0].sliceId).toBe('SLICE-001');
        });

        it('should match pet to segment by segmentId', () => {
            const petWithSegmentId = createPetcItem({ sliceId: 'DIFFERENT-SLICE', segmentIds: ['SEG-001'] });
            const result = service.transformPetcData([petWithSegmentId], [mockFlight], [mockPassenger]);

            expect(result.length).toBe(1);
            expect(result[0].pets.length).toBe(1);
        });

        it('should match pet to segment by route key (origin+destination)', () => {
            const result = service.transformPetcData([mockPetcItemByRoute], [mockFlight], [mockPassenger]);

            expect(result.length).toBe(1);
            expect(result[0].departure.code).toBe('MAD');
            expect(result[0].arrival.code).toBe('BCN');
        });

        it('should match multiple pets to same segment', () => {
            const result = service.transformPetcData(
                [mockPetcItem, mockPetcItemPaid],
                [mockFlight],
                [mockPassenger, mockPassengerNoInfo]
            );

            expect(result.length).toBe(1);
            expect(result[0].pets.length).toBe(2);
        });
    });

    describe('transformPetcData - multi-segment flights', () => {
        const mockMultiSegmentFlight: PetcFlight = {
            segments: [
                {
                    sliceId: 'SLICE-001',
                    segmentId: 'SEG-001',
                    departure: {
                        code: 'MAD',
                        name: 'Madrid',
                        city: { description: 'Madrid' }
                    },
                    arrival: {
                        code: 'LHR',
                        name: 'London Heathrow',
                        city: { description: 'London' }
                    },
                    flight: { marketingFlightNumber: 'IB3162' },
                    departureDateParsed: { formatedDate: '2024-01-15', dateTime: '08:00' }
                },
                {
                    sliceId: 'SLICE-002',
                    segmentId: 'SEG-002',
                    departure: {
                        code: 'LHR',
                        name: 'London Heathrow',
                        city: { description: 'London' }
                    },
                    arrival: {
                        code: 'JFK',
                        name: 'New York JFK',
                        city: { description: 'New York' }
                    },
                    flight: { marketingFlightNumber: 'BA117' },
                    departureDateParsed: { formatedDate: '2024-01-15', dateTime: '12:00' }
                }
            ]
        } as any;

        it('should return one PetcFlightInfo per flight even with multiple segments', () => {
            const petSeg1 = createPetcItem({ orderItemId: 'ORDER-010', sliceId: 'SLICE-001', segmentIds: ['SEG-001'] });
            const petSeg2 = createPetcItem({ orderItemId: 'ORDER-011', sliceId: 'SLICE-002', segmentIds: ['SEG-002'] });

            const result = service.transformPetcData([petSeg1, petSeg2], [mockMultiSegmentFlight], [mockPassenger]);

            expect(result.length).toBe(1);
        });

        it('should use first segment departure and last segment arrival', () => {
            const petSeg1 = createPetcItem({ orderItemId: 'ORDER-010', sliceId: 'SLICE-001', segmentIds: ['SEG-001'] });

            const result = service.transformPetcData([petSeg1], [mockMultiSegmentFlight], [mockPassenger]);

            expect(result[0].departure.code).toBe('MAD');
            expect(result[0].arrival.code).toBe('JFK');
        });

        it('should merge pets from all segments into a single pets array', () => {
            const petSeg1 = createPetcItem({ orderItemId: 'ORDER-010', sliceId: 'SLICE-001', segmentIds: ['SEG-001'] });
            const petSeg2 = createPetcItem({ orderItemId: 'ORDER-011', sliceId: 'SLICE-002', segmentIds: ['SEG-002'] });

            const result = service.transformPetcData([petSeg1, petSeg2], [mockMultiSegmentFlight], [mockPassenger]);

            expect(result[0].pets.length).toBe(2);
        });

        it('should deduplicate pets that match multiple segments', () => {
            const petMatchingBoth = createPetcItem({
                orderItemId: 'ORDER-010',
                sliceId: 'SLICE-001',
                segmentIds: ['SEG-001', 'SEG-002']
            });

            const result = service.transformPetcData([petMatchingBoth], [mockMultiSegmentFlight], [mockPassenger]);

            expect(result[0].pets.length).toBe(1);
        });

        it('should return one entry per flight when multiple flights exist', () => {
            const petFlight1 = createPetcItem({ orderItemId: 'ORDER-010', sliceId: 'SLICE-001', segmentIds: ['SEG-001'] });
            const petFlight2 = createPetcItem({ orderItemId: 'ORDER-020', sliceId: 'SLICE-003', segmentIds: ['SEG-003'] });

            const mockFlight2: PetcFlight = {
                segments: [
                    {
                        sliceId: 'SLICE-003',
                        segmentId: 'SEG-003',
                        departure: { code: 'BCN', name: 'Barcelona', city: { description: 'Barcelona' } },
                        arrival: { code: 'CDG', name: 'Paris CDG', city: { description: 'Paris' } },
                        flight: { marketingFlightNumber: 'VY8328' },
                        departureDateParsed: { formatedDate: '2024-01-16', dateTime: '09:00' }
                    }
                ]
            } as any;

            const result = service.transformPetcData(
                [petFlight1, petFlight2],
                [mockMultiSegmentFlight, mockFlight2],
                [mockPassenger]
            );

            expect(result.length).toBe(2);
        });
    });
});
