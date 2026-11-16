import { TestBed } from '@angular/core/testing';
import { CalculatePointsTransformer } from '@src/app/pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-calculate-points-transformer.service';
import { onHoldInfoMock, fakeAncillariesSlices, mockData, fakePassengersData, fakeAncillaries, fakePaymentItems, fakeSpecialDiscounts, fakeVoucherItems } from '@test/mocks/unit/app/pages/ib-booking-on-hold-confirmation/services/calculate-points-transformer-mock';

describe('CalculatePointsTransformer', () => {
    let service: CalculatePointsTransformer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CalculatePointsTransformer]
        });
        service = TestBed.inject(CalculatePointsTransformer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('genCalAviosSummary', () => {
        const genCalAviosSummaryTestCases = [
            {
                description: 'when not onHold',
                ancillariesSlices: fakeAncillariesSlices,
                ancillaries: fakeAncillaries,
                isOnHold: false,
                expectedYQ: 0
            },
            {
                description: 'when onHold, no ancillaries',
                ancillariesSlices: null,
                ancillaries: null,
                isOnHold: true,
                expectedYQ: 400
            },
            {
                description: 'when onHold',
                ancillariesSlices: fakeAncillariesSlices,
                ancillaries: fakeAncillaries,
                isOnHold: true,
                expectedYQ: 400
            }
        ];

        genCalAviosSummaryTestCases.forEach(({ description, ancillariesSlices, ancillaries, isOnHold, expectedYQ }) => {
            it(`should generate request flightaviosinfo ${description}`, () => {
                const result = service.genCalAviosSummary(onHoldInfoMock, ancillariesSlices, ancillaries, isOnHold);

                expect(result).toBeTruthy();
                expect(result.currency.code).toBe('EUR');
                expect(result.flight.yq).toBe(expectedYQ);
                expect(result.passengers[0].id).toBe('ADULT_01');
            });
        });
    });

    describe('TransCalcPointsData', () => {
        it('should generate total points', () => {
            const result = service.transCalcPointsData(mockData);
            expect(result).toEqual({ Avios: 10, Elite: 10 });
        });

    });

    describe('TransCalcPointsForPassenger', () => {
        it('should generate info amount for passenger', () => {
            const result = service.transCalcPointsForPassenger(fakePassengersData);
            expect(result).toEqual([
                { id: '1', memberIdentifier: 'member1', avios: 10, elite: 20 }
            ]);
        });
    });

    describe('extractCurrency', () => {
        it('should extract currency code correctly', () => {
            const result = service['extractCurrency'](onHoldInfoMock);
            expect(result).toEqual({ code: 'EUR' });
        });
    });

    describe('addDiscounts', () => {
        it('should combine all available discounts', () => {
            const result = service['addDiscounts'](
                fakeSpecialDiscounts,
                fakePaymentItems,
                fakeVoucherItems
            );

            const expectedResultArray = [
                {
                    type: 'VOUCHER',
                    percentDiscount: 20,
                    totalDiscount: 20,
                    description: 'Special voucher discount',
                    discountFormatted: '20 €',
                    totalFormatted: '20 €'
                },
                {
                    type: 'LGF',
                    percentDiscount: 10,
                    totalDiscount: 20,
                    description: 'LGF payment discount',
                    discountFormatted: '20 €',
                    totalFormatted: '20 €'
                },
                {
                    type: 'PARTNER',
                    totalDiscount: 12,
                    percentDiscount: null,
                    description: 'Partner voucher discount',
                    discountFormatted: '12 €'
                }
            ];


            expect(result.length).toBe(3);
            expect(result).toEqual(expectedResultArray);
        });

        it('should handle no specialDiscounts', () => {
            const result = service['addDiscounts'](null, null, null);
            expect(result.length).toBe(0);
        });

    });

    describe('calculate YQ', () => {
        it('should handle YQ tariff', () => {

            const result = service['calculateYQ'](onHoldInfoMock, true);
            expect(result).toEqual(400);
        });
    });

    describe('Ancilliaries', () => {
        const genAncillariesTestCases = [
            {
                description: 'when anc has sliceId',
                fakeAncs: [
                    {
                        type: 'Some',
                        segmentId: '12',
                        subtype: 'bbb',
                        amount: 2,
                        price: { fare: 12 },
                        sliceId: '1234',
                        passengerId: 'ADULT_01'
                    }
                ],
                fakeSlices: [{ id: '1234', segmentIds: ['4', '34'] }],
                expectedAmountsFare: 12,
                expectedSliceId: null
            },
            {
                description: 'when anc does not have sliceId',
                fakeAncs: [
                    {
                        type: 'Some',
                        segmentId: '12',
                        subtype: 'bbb',
                        amount: 2,
                        price: { fare: 12 },
                        sliceId: null,
                        passengerId: 'ADULT_01'
                    }
                ],
                fakeSlices: [{ id: '1234', segmentIds: ['12', '3'] }],
                expectedAmountsFare: null,
                expectedSliceId: '1234'
            }
        ];

        genAncillariesTestCases.forEach(({ description, fakeAncs, fakeSlices, expectedAmountsFare, expectedSliceId }) => {
            it(`Should create ancillary object correctly ${description}`, () => {
                const result = service['genAncillariesForPassenger'](fakeSlices, fakeAncs, 'ADULT_01');

                expect(result).toBeTruthy();
                expect(result.length).toBe(1);
                expect(result[0].type).toBe('Some');
                if (expectedAmountsFare !== null) {
                    expect(result[0].amounts[0].fare).toBe(expectedAmountsFare);
                }
                if (expectedSliceId !== null) {
                    expect(result[0].slices[0].id).toBe(expectedSliceId);
                }
            });
        });
    });


    describe('Tickets', () => {
        const mockTickets = [{
            ticketNumbers: ['123456789'],
            issueDateTime: '01-01-1970'
        }];

        const expectedTicketsData = [{
            ticketingCarrier: {
                code: '123'
            },
            number: '456789',
            issuanceDate: null
        }];

        it('tickets', () => {
            const modifiedMock = {
                ...onHoldInfoMock,
                tickets: mockTickets
            };


            const result = service['genBookingSummary'](modifiedMock);
            expect(result.tickets).toEqual(expectedTicketsData);
        });

        it('should handle tickets', () => {
            const result = service['extractTicketsData'](mockTickets);
            expect(result).toEqual(expectedTicketsData);
        });
    });


});


