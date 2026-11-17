import { TravelDocumentType, TypesDocumentsAccepted } from '@src/app/core/models/travel-documents/travel-documents-model';

function createBiDirectionalMap<
    From extends string,
    To extends string
> (map: Record<From, To>) {
    const reverse = Object.fromEntries(
        Object.entries(map).map(([k, v]) => [v, k])
    ) as Record<To, From>;

    return {
        map,
        reverse
    };
}

const { map: travelToAccepted, reverse: acceptedToTravel } = createBiDirectionalMap<
TravelDocumentType,
TypesDocumentsAccepted
>({
    DNI: 'DNI',
    PASSPORT: 'PSPT',
    VISA: 'VISA'
});

export function toAccepted (doc: TravelDocumentType): TypesDocumentsAccepted;
export function toAccepted (docs: TravelDocumentType[]): TypesDocumentsAccepted[];
export function toAccepted (
    docOrDocs: TravelDocumentType | TravelDocumentType[]
): TypesDocumentsAccepted | TypesDocumentsAccepted[] {
    const mapSingle = (d: TravelDocumentType) => {
        const res = travelToAccepted[d];
        if (res === undefined) {
            throw new Error(`toAccepted: no mapping for TravelDocumentType "${d}"`);
        }
        return res;
    };

    return Array.isArray(docOrDocs)
        ? docOrDocs.map(mapSingle)
        : mapSingle(docOrDocs);
}

export function toTravel (doc: TypesDocumentsAccepted): TravelDocumentType;
export function toTravel (docs: TypesDocumentsAccepted[]): TravelDocumentType[];
export function toTravel (
    docOrDocs: TypesDocumentsAccepted | TypesDocumentsAccepted[]
): TravelDocumentType | TravelDocumentType[] {
    const mapSingle = (d: TypesDocumentsAccepted) => {
        const res = acceptedToTravel[d];
        if (res === undefined) {
            throw new Error(`toTravel: no mapping for TypesDocumentsAccepted "${d}"`);
        }
        return res;
    };

    return Array.isArray(docOrDocs)
        ? docOrDocs.map(mapSingle)
        : mapSingle(docOrDocs);
}