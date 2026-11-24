
// src/app/services/ib-pmt-breakdown-utils-pets.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { IbPmtBreakdownUtilsPetsService, PetcBreakdownContext, PetcSegment } from 'src/components/ib-payments/cmpnts/utils/ib-pmt-petc/ib-pmt-breakdown-utils-petc-service';
import { AJSCurrencyService } from 'ib-web-commons/utils';


export class CurrencyServiceMock {
    getCurrencyObject = jasmine.createSpy('getCurrencyObject');
    formatPrice = jasmine.createSpy( 'formatPrice' ).and.callFake( () => '' );
}


describe('IbPmtBreakdownUtilsPetsService (Angular 15 + Jasmine)', () => {
    let service: IbPmtBreakdownUtilsPetsService;
    let mockCurrency: CurrencyServiceMock;

    let context: PetcBreakdownContext;

    beforeEach(() => {
        mockCurrency = new CurrencyServiceMock();

        TestBed.configureTestingModule({
            providers: [
                IbPmtBreakdownUtilsPetsService,
                { provide: AJSCurrencyService, useValue: mockCurrency }
            ]
        });

        service = TestBed.inject(IbPmtBreakdownUtilsPetsService);

        // Contexto base
        context = {
            basket: {
                currency: 'EUR',
                petc: {
                    hasPetc: false,
                    segments: [],
                    total: { totalFormatted: '' }
                }
            },
            pendingSlices: [],
            segmentsInfo: [],
            getTotalFormatted: (segments: PetcSegment[]) =>
                `EUR ${segments.reduce((acc, s) => acc + (s.total ?? 0), 0).toFixed(2)}`,
            getOriginAndDestinationSegment: (_petSlices: PetcSegment[], _segmentsInfo: any) => {}
        };

    });

    // ======================================================
    // RUTA: createNewPetcSegments (no hay segmentos previos)
    // ======================================================
    describe('cuando NO existen segmentos PETC previos (createNewPetcSegments)', () => {
        it('crea segmentos por cada slice con mascotas, setea hasPetc=true y calcula totales', () => {
            context.pendingSlices = [
                {
                    id: 'SL1',
                    passengers: [
                        {
                            id: 'PAX1',
                            pets: [
                                { amount: 10, breeds: ['A'], type: 'DOG', units: 1 },
                                { amount: 20, breeds: ['B'], type: 'CAT', units: 1 }
                            ]
                        }
                    ]
                },
                {
                    id: 'SL2',
                    passengers: [{ id: 'PAX2', pets: [] }] // sin mascotas → filtrado
                }
            ];
            const spyGetOriginAndDestinationSegment = spyOn(context, 'getOriginAndDestinationSegment').and.callThrough();

            const result = service.generatePetcInfo(context);

            expect(result.length).toBe(1);
            const seg = result[0];
            expect(seg.sliceId).toBe('SL1');
            expect(seg.pets.length).toBe(2);
            expect(seg.total).toBe(30);
            expect(seg.totalFormatted).toBe('EUR 30.00');

            expect(context.basket.petc.hasPetc).toBeTrue();

            expect(spyGetOriginAndDestinationSegment).toHaveBeenCalledTimes(1);
            expect(spyGetOriginAndDestinationSegment).toHaveBeenCalledWith(result, context.segmentsInfo);

            expect(mockCurrency.formatPrice).toHaveBeenCalledTimes(2);
            expect(mockCurrency.formatPrice).toHaveBeenCalledWith('EUR', 10, true);
            expect(mockCurrency.formatPrice).toHaveBeenCalledWith('EUR', 20, true);
        });

        it('si ningún slice tiene mascotas, devuelve [] y mantiene coherencia de totales', () => {
            context.pendingSlices = [
                { id: 'S1', passengers: [{ id: 'PX1', pets: [] }] },
                { id: 'S2', passengers: [{ id: 'PX2', pets: [] }] }
            ];
            const spyGetOriginAndDestinationSegment = spyOn(context, 'getOriginAndDestinationSegment').and.callThrough();

            const result = service.generatePetcInfo(context);

            expect(result).toEqual([]);
            expect(spyGetOriginAndDestinationSegment).toHaveBeenCalledTimes(1);
            expect(spyGetOriginAndDestinationSegment).toHaveBeenCalledWith([], context.segmentsInfo);

            // total global: se calcula sobre basket.petc.segments (vacío) → EUR 0.00
            expect(context.basket.petc.total.totalFormatted).toBe('EUR 0.00');
            expect(context.basket.petc.hasPetc).toBeTrue();
            expect(mockCurrency.formatPrice).not.toHaveBeenCalled();
        });

        it('cada BasketPet contiene descripción de tipo prefijada y pasajero asociado', () => {
            context.pendingSlices = [
                {
                    id: 'SLX',
                    passengers: [
                        {
                            id: 'PAX9',
                            pets: [{ amount: 15, breeds: ['XX'], type: 'BIRD', units: 2 }]
                        }
                    ]
                }
            ];

            const [segment] = service.generatePetcInfo(context);

            expect(segment.pets.length).toBe(1);
            const pet = segment.pets[0];
            expect(pet.type).toEqual({ id: 'BIRD', description: 'PETC_PET_TYPE_BIRD' });
            expect(pet.passengers).toEqual(['PAX9']);
            expect(pet.amount).toBe(15);
        });
    });

    // ======================================================
    // RUTA: updateExistingPetcSegments (ya hay segmentos)
    // ======================================================
    describe('cuando YA existen segmentos PETC previos (updateExistingPetcSegments)', () => {
        beforeEach(() => {
            context.basket.petc.segments = [
                {
                    sliceId: 'SL1',
                    pets: [
                        {
                            amount: 5,
                            amountFormatted: 'EUR 5.00',
                            breeds: ['PREV'],
                            passengers: ['PAX0'],
                            type: { id: 'DOG', description: 'PETC_PET_TYPE_DOG' },
                            units: 1
                        }
                    ],
                    origin: null,
                    destination: null,
                    total: 5,
                    totalFormatted: 'EUR 5.00'
                }
            ];
        });

        it('agrega mascotas desde pendingSlices a los segmentos existentes con ids coincidentes', () => {
            context.pendingSlices = [
                {
                    id: 'SL1',
                    passengers: [
                        {
                            id: 'PAX1',
                            pets: [
                                { amount: 10, breeds: ['A'], type: 'DOG', units: 1 },
                                { amount: 7, breeds: ['B'], type: 'CAT', units: 1 }
                            ]
                        }
                    ]
                },
                {
                    id: 'SL2', // no existe segmento SL2 en el basket → ignorado
                    passengers: [{ id: 'PAX2', pets: [{ amount: 9, breeds: ['Z'], type: 'CAT', units: 1 }] }]
                }
            ];
            const spyGetOriginAndDestinationSegment = spyOn(context, 'getOriginAndDestinationSegment').and.callThrough();


            const result = service.generatePetcInfo(context);

            expect(result.length).toBe(1);
            const seg = result[0];

            expect(seg.pets.length).toBe(3);
            expect(seg.total).toBe(22);
            expect(seg.totalFormatted).toBe('EUR 22.00');

            // No se llama en la rama updateExisting
            expect(spyGetOriginAndDestinationSegment).not.toHaveBeenCalled();

            // total global actualizado sobre basket.petc.segments
            expect(context.basket.petc.total.totalFormatted).toBe('EUR 22.00');

            const foundSL2 = result.find(s => s.sliceId === 'SL2');
            expect(foundSL2).toBeUndefined();

            expect(mockCurrency.formatPrice).toHaveBeenCalledTimes(2);
            expect(mockCurrency.formatPrice).toHaveBeenCalledWith('EUR', 10, true);
            expect(mockCurrency.formatPrice).toHaveBeenCalledWith('EUR', 7, true);
        });

        it('si no hay match de sliceId en pendingSlices, no cambia el segmento', () => {
            context.pendingSlices = [
                { id: 'OTHER', passengers: [{ id: 'PX', pets: [{ amount: 50, breeds: [], type: 'DOG', units: 1 }] }] }
            ];

            const result = service.generatePetcInfo(context);

            expect(result.length).toBe(1);
            expect(result[0].pets.length).toBe(1);
            expect(result[0].total).toBe(5);
            expect(result[0].totalFormatted).toBe('EUR 5.00');

            expect(context.basket.petc.total.totalFormatted).toBe('EUR 5.00');
        });

        it('maneja múltiples pasajeros y suma correctamente todas las mascotas', () => {
            context.pendingSlices = [
                {
                    id: 'SL1',
                    passengers: [
                        { id: 'PAX1', pets: [{ amount: 3, breeds: ['a'], type: 'DOG', units: 1 }] },
                        { id: 'PAX2', pets: [{ amount: 4, breeds: ['b'], type: 'CAT', units: 2 }] }
                    ]
                }
            ];

            const result = service.generatePetcInfo(context);
            const seg = result[0];

            expect(seg.pets.length).toBe(3); // 1 previa + 2 nuevas
            expect(seg.total).toBe(12);
            expect(seg.totalFormatted).toBe('EUR 12.00');

            const paxIds = seg.pets.slice(1).flatMap(p => p.passengers);
            expect(paxIds).toContain('PAX1');
            expect(paxIds).toContain('PAX2');
        });
    });

    // ======================================================
    // Verificación indirecta de auxiliares (privados)
    // ======================================================
    describe('métodos auxiliares (indirectamente a través de generatePetcInfo)', () => {
        it('findPendingSliceById devuelve undefined si no existe; addPetsToSegment suma y formatea', () => {
            // Caso sin match → no cambia nada
            context.basket.petc.segments = [
                {
                    sliceId: 'S_EXIST',
                    pets: [],
                    origin: null,
                    destination: null,
                    total: 0,
                    totalFormatted: 'EUR 0.00'
                }
            ];
            context.pendingSlices = [
                { id: 'S_OTHER', passengers: [{ id: 'PX', pets: [{ amount: 10, breeds: [], type: 'DOG', units: 1 }] }] }
            ];

            let result = service.generatePetcInfo(context);
            expect(result[0].total).toBe(0);
            expect(result[0].totalFormatted).toBe('EUR 0.00');

            // Caso con match → se agregan pets y se recalcula totalFormatted del segmento
            context.pendingSlices = [
                {
                    id: 'S_EXIST',
                    passengers: [
                        { id: 'PX1', pets: [{ amount: 2, breeds: [], type: 'DOG', units: 1 }] },
                        { id: 'PX2', pets: [{ amount: 8, breeds: [], type: 'CAT', units: 1 }] }
                    ]
                }
            ];

            result = service.generatePetcInfo(context);
            expect(result[0].pets.length).toBe(2);
            expect(result[0].total).toBe(10);
            expect(result[0].totalFormatted).toBe('EUR 10.00');
            expect(mockCurrency.formatPrice).toHaveBeenCalledTimes(2);
        });
    });
});
