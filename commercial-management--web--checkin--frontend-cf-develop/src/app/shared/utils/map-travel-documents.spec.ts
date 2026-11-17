import { toAccepted, toTravel } from "./map-travel-documents";
import { TravelDocumentType, TypesDocumentsAccepted } from '@src/app/core/models/travel-documents/travel-documents-model';

describe('travel-documents-mapper', () => {
    describe('toAccepted', () => {
        it('maps a single TravelDocumentType to TypesDocumentsAccepted', () => {
            expect(toAccepted('DNI')).toBe('DNI');
            expect(toAccepted('PASSPORT')).toBe('PSPT');
            expect(toAccepted('VISA')).toBe('VISA');
        });

        it('maps an array of TravelDocumentType to TypesDocumentsAccepted[] preserving order', () => {
            const input: TravelDocumentType[] = ['DNI', 'PASSPORT', 'VISA'];
            const expected: TypesDocumentsAccepted[] = ['DNI', 'PSPT', 'VISA'];
            expect(toAccepted(input)).toEqual(expected);
        });

        it('throws when given an unmapped TravelDocumentType', () => {
            expect(() => toAccepted('UNKNOWN' as unknown as TravelDocumentType)).toThrowError(/toAccepted: no mapping/);
        });
    });

    describe('toTravel', () => {
        it('maps a single TypesDocumentsAccepted to TravelDocumentType', () => {
            // PSPT -> PASSPORT
            expect(toTravel('PSPT')).toBe('PASSPORT');
            expect(toTravel('DNI')).toBe('DNI');
            expect(toTravel('VISA')).toBe('VISA');
        });

        it('maps an array of TypesDocumentsAccepted to TravelDocumentType[] preserving order', () => {
            const input: TypesDocumentsAccepted[] = ['DNI', 'PSPT', 'VISA'];
            const expected: TravelDocumentType[] = ['DNI', 'PASSPORT', 'VISA'];
            expect(toTravel(input)).toEqual(expected);
        });

        it('throws when given an unmapped TypesDocumentsAccepted', () => {
            expect(() => toTravel('UNKNOWN' as unknown as TypesDocumentsAccepted)).toThrowError(/toTravel: no mapping/);
        });
    });

    describe('round-trip mapping', () => {
        it('toAccepted then toTravel returns original TravelDocumentType values', () => {
            const original: TravelDocumentType[] = ['DNI', 'PASSPORT'];
            const accepted = toAccepted(original);
            const back = toTravel(accepted);
            expect(back).toEqual(original);
        });

        it('toTravel then toAccepted returns original TypesDocumentsAccepted values', () => {
            const original: TypesDocumentsAccepted[] = ['DNI', 'PSPT', 'VISA'];
            const travel = toTravel(original);
            const back = toAccepted(travel);
            expect(back).toEqual(original);
        });
    });
});
