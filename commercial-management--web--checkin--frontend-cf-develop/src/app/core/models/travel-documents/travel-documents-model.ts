export type TravelDocumentType = 'DNI' | 'PASSPORT' | 'VISA';
export type TypesDocumentsAccepted = 'PSPT' | 'DNI' | 'VISA';

/** Variación usada en travel-document/request (incluye OTHER). */
export type GenderWithOther = 'MAN' | 'WOMAN' | 'OTHER';
export enum GenderToApis {
    MAN = 'MALE',
    WOMAN = 'FEMALE',
    OTHER = ''
}

export interface ManagedErrorDetails {
    info: string;
    message: string;
}

export type ManagedErrorCode =
    | 'INVALID_RESOURCE'
    | 'INTERNAL_SERVER_ERROR'
    | 'DUPLICATE_RESOURCE'
    | 'ACCESS_FORBIDDEN'
    | 'RESOURCE_NOT_FOUND'
    | 'MISSING_HEADER'
    | 'ROUTE_NOT_FOUND'
    | 'WRONG_ASSOCIATE';

export interface ManagedError {
    code: ManagedErrorCode;
    description: string;
    details: ManagedErrorDetails[];
}

export interface Meta {
    timestamp: string;
    additional_info: string;
    error: ManagedError;
}

export interface TravelDocument {
    documentType: TravelDocumentType;
    documentNumber: string;
    expiryDate: string;
    id: string;
    country: string;
    name?: string;
    surnames?: string;
    gender?: GenderWithOther;
    birthdate?: string;
    nationality?: string;
    ocrUsed?: boolean;
}

export interface TravelDocumentInfo {
    documentType: TravelDocumentType;
    id: string;
    name: string;
    surnames: string;
    iconFlag: string;
    descriptionCountry?: string;
}

export interface DocumentsResponse {
    documents: TravelDocument[];
}

export interface TravelDocumentRequest {
    documentType: TravelDocumentType;
    documentNumber: string;
    expiryDate: string;
    country: string;
    name: string;
    surnames: string;
    gender: GenderWithOther;
    birthdate: string;
    nationality: string;
    ocrUsed?: boolean;
}

export interface CreateDocumentResponseData {
    id: string;
}

export interface TravelDocumentResponse {
    code: number;
    data?: { data?: { documents?: TravelDocument[] } };
}

export interface UpdateTravelDocument {
    documentType: TravelDocumentType;
    documentNumber: string;
    expiryDate: string;
    country: string;
    name: string;
    surnames: string;
    gender: GenderWithOther;
    birthdate: string;
    nationality: string;
    ocrUsed?: boolean;
    id?: string;
}

export interface TravelDocumentInfoUpdate {
    documentType: TravelDocumentType;
    id?: string;
    name: string;
    surnames: string;
    iconFlag: string;
}

export interface UpdateTravelDocumentRequest {
    dataTransformed: TravelDocumentRequest, 
    documentId?: string;
}

export interface IUpdateTravelDocumentsBulk {status: boolean, result?: any, error?: any, editDocument?: boolean}