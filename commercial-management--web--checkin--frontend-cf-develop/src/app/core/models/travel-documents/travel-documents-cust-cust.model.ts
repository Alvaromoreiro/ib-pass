/** ---------------------------
 *  Types & reference tables
 *  --------------------------- */

import { TravelDocumentType } from './travel-documents-model';

export interface Document {
    id: string;
    typeCode: string;          // may come as "05", "PSPT", "passport", etc.
    countryCode?: string;
    number: string;
    expiryDate?: string;       // ISO yyyy-MM-dd, optional
}

export interface TypeCodeRef {
    code: string;              // "02", "05", ...
    description: string;       // "DNI", "PASSPORT", ...
}

export interface DocumentModel {
    id: string;
    typeCode: TypeCodeCanonicalValid;
    typeDescription: string;
    countryCode: string;
    number: string;
    expiryDate?: string;
    isExpired: boolean;
    issues: string[];
    iconFlag: string;
}

/** Canonical codes (without "unknown"s) */
export type TypeCodeCanonical = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '10' | '12' | '13';
export type TypeCodeCanonicalValid = '02' | '05' | '99';

/** Reference table */
export const TYPE_CODE_REF: TypeCodeRef[] = [
    { code: '02', description: 'DNI' },
    { code: '05', description: 'PASSPORT' },
    { code: '01', description: 'CIF' },
    { code: '03', description: 'C. conducir Noruega' },
    { code: '04', description: 'NIF' },
    { code: '06', description: 'Tarjeta residente' },
    { code: '07', description: 'Carnet diplomatico' },
    { code: '12', description: 'CI' },
    { code: '13', description: 'DNI AR' },
    { code: '09', description: 'Desconocido' },
    { code: '99', description: '99Desconocido' },
    { code: '10', description: 'DNI (12 Digitos)' }
];

/** ---------------------------
 *  Normalization & utilities
 *  --------------------------- */

/** Synonyms → canonical code */
//const TYPE_SYNONYMS_TO_CANON: Record<string, TypeCodeCanonical | '09' | '99'> = {
const TYPE_SYNONYMS_TO_CANON: Record<string, TypeCodeCanonicalValid> = {
    // Passport
    '05': '05',
    '5': '05',
    'pspt': '05',
    'passport': '05',
    'pasaporte': '05',

    // DNI
    'dni': '02',
    '02': '02',


    // Others (common variants)
    /*'nif': '04',
    'cif': '01',
    'ci': '12',
    'dni ar': '13',
    'conducir noruega': '03',
    'tarjeta residente': '06',
    'carnet diplomático': '07',
    'carnet diplomatico': '07',
    'dni 12 digitos': '10',
    'dni (12 digitos)': '10',*/

    // Unknowns
    //'09': '09',
    '99': '99'
};

const VALID_CODES = new Set(TYPE_CODE_REF.map(x => x.code));
const ISO2_REGEX = /^[A-Z]{2}$/;

/** Small helpers (keep cyclomatic complexity low) */

const toUpper = (s?: string | null) => (s ?? '').trim().toUpperCase();
export const toLower = (s?: string | null) => (s ?? '').trim().toLowerCase();

export function normalizeTypeCode (raw: string | undefined | null): TypeCodeCanonical | '09' | '99' {
    if (!raw) return '09';
    const keyLower = toLower(raw);
    if (keyLower in TYPE_SYNONYMS_TO_CANON) return TYPE_SYNONYMS_TO_CANON[keyLower];

    const keyUpper = toUpper(raw);
    if (VALID_CODES.has(keyUpper)) return keyUpper as TypeCodeCanonical | '09' | '99';

    return '09';
}
export function normalizeValidTypeCode (raw: string | undefined | null): TypeCodeCanonicalValid {
    if (!raw) return '99';
    const keyLower = toLower(raw);
    if (keyLower in TYPE_SYNONYMS_TO_CANON) return TYPE_SYNONYMS_TO_CANON[keyLower];
    return '99';
}

export function resolveTypeDescription (code: string, ref = TYPE_CODE_REF): string {
    return ref.find(x => x.code === code)?.description ?? 'Desconocido';
}

function parseIsoDateOrUndefined (raw?: string): Date | undefined {
    if (!raw) return undefined;
    const d = new Date(raw);
    return Number.isFinite(d.getTime()) ? d : undefined;
}

function normalizeIso2OrIssue (country?: string): { country?: string; issue?: string } {
    if (!country) return { issue: 'countryCode missing.' };
    const upper = toUpper(country);
    if (ISO2_REGEX.test(upper)) return { country: upper };
    return { issue: `countryCode invalid: "${country}" (expected ISO-2, e.g. ES, FR).` };
}

export function parseExpiryOrIssues (expiry?: string): { date?: string; expired: boolean; issue?: string } {
    const date = parseIsoDateOrUndefined(expiry);
    if (expiry && !date) return { expired: false, issue: `expiryDate invalid: "${expiry}".` };
    return { date: expiry, expired: !!(date && date.getTime() < Date.now()) };
}

function validateNumberOrIssue (num?: string): string | undefined {
    if (!num || !num.trim()) return 'number missing or empty.';
    return undefined;
}

function accumulateIssues (...maybeIssues: Array<string | undefined>): string[] {
    return maybeIssues.filter(Boolean) as string[];
}

/** ---------------------------
 *  Main conversion
 *  --------------------------- */

export function toDocumentModel (
    document: Document,
    ref: TypeCodeRef[] = TYPE_CODE_REF
): DocumentModel {
    const typeCode = normalizeValidTypeCode(document.typeCode);
    const typeDescription = resolveTypeDescription(typeCode, ref);

    const { country, issue: countryIssue } = normalizeIso2OrIssue(document.countryCode);
    const { date: expiryDate, expired: isExpired, issue: expiryIssue } = parseExpiryOrIssues(document.expiryDate);
    const numberIssue = validateNumberOrIssue(document.number);

    const issues = accumulateIssues(countryIssue, expiryIssue, numberIssue);

    return {
        id: document.id,
        typeCode,
        typeDescription,
        countryCode: country,
        number: document.number,
        expiryDate,
        isExpired,
        issues,
        iconFlag: ''
    };
}

/** Map an array of API documents */
export function mapDocuments (documents: Document[], ref: TypeCodeRef[] = TYPE_CODE_REF): DocumentModel[] {
    return documents.map(doc => toDocumentModel(doc, ref));
}

/** Partition by issues (valid vs invalid) */
export function partitionByIssues (docs: DocumentModel[]): { valid: DocumentModel[]; invalid: DocumentModel[] } {
    return docs.reduce(
        (acc, d) => {
            (d.issues.length || d.typeCode === '99' || d.isExpired ? acc.invalid : acc.valid).push(d);
            return acc;
        },
        { valid: [] as DocumentModel[], invalid: [] as DocumentModel[] }
    );
}

/** ---------------------------
 *  Filtering helpers
 *  --------------------------- */

/** Extractor for TravelDocumentType from normalized typeCode */
export const codeToTravelType: Record<string, TravelDocumentType | undefined> = {
    '02': 'DNI',
    '05': 'PASSPORT',
    '99': 'VISA'
    // Add more mappings if needed, e.g. '06': 'VISA'
};

function filterByTypes (
    docs: DocumentModel[],
    allowedTypesUpper: string[]
): DocumentModel[] {
    const hasFilter = allowedTypesUpper.length > 0;
    if (!hasFilter) {
    // If no filter, include only documents that map to a known TravelDocumentType
        return docs.filter(d => !!codeToTravelType[d.typeCode]);
    }
    return docs.filter(d => {
        const mapped = codeToTravelType[d.typeCode];
        return mapped ? allowedTypesUpper.includes(mapped) : false;
    });
}

/**
 * Filters valid documents by a list of document types (string[]).
 * If the list is empty, returns all valid documents that map to known TravelDocumentType.
 */
export function filterDocumentsByType (
    validDocs: DocumentModel[],
    documentsTypesValid: string[]
): { filtered: DocumentModel[]; typesValid: TravelDocumentType[] } {
    const normalized = documentsTypesValid.map(t => t.toUpperCase());
    const filtered = filterByTypes(validDocs, normalized);

    const typesValid = Array.from(
        filtered.reduce((set, d) => {
            const mapped = codeToTravelType[d.typeCode];
            if (mapped) set.add(mapped);
            return set;
        }, new Set<TravelDocumentType>())
    );

    return { filtered, typesValid };
}
