import {
    Condition,
    ExtendedInfo,
    FareFamily,
    Slice
} from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-changes/cmpnts/ib-MmB-vc-summary/components/ib-MmB-vc-fare-comparison-banner/model/ib-MmB-vc-fare-comparison-banner.model';

export const createExtendedInfoMock = (overrides: Partial<ExtendedInfo> = {}): ExtendedInfo => ({
    title: 'Cambios',
    message: 'Con coste.',
    code: 'CHANGE',
    conditionStatus: true,
    ...overrides
});

export const createConditionMock = (overrides: Partial<Condition> = {}): Condition => ({
    code: 'CHANGE',
    name: 'Cambios',
    text: 'Con coste.',
    units: null,
    extendedInfo: createExtendedInfoMock(),
    ...overrides
});

export const createFareFamilyMock = (overrides: Partial<FareFamily> = {}): FareFamily => ({
    cabinType: 'ECONOMY',
    cabinDescription: 'Turista',
    commercialCode: 'BASIC',
    commercialName: 'Turista Básica',
    commercialNameES: 'Turista Básica',
    priority: 1,
    conditions: [createConditionMock()],
    conditionsPriority: ['CHANGE'],
    ...overrides
});

export const createSliceMock = (overrides: Partial<Slice> = {}): Slice => ({
    sliceId: 'MAD-BCN',
    origin: 'MAD',
    destination: 'BCN',
    previousFareFamily: createFareFamilyMock(),
    newFareFamily: createFareFamilyMock({
        commercialCode: 'OPTIMA',
        commercialName: 'Turista Óptima',
        commercialNameES: 'Turista Óptima'
    }),
    ...overrides
});
