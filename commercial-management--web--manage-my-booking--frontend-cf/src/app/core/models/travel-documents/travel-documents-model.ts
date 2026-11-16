
export interface TravelDocumentsModel {
    code: number
    data: {
        documents: Documents[];
        meta: Meta
    }
}

export interface Documents {
    document_type: string,
    document_number: string,
    expiry_date: string,
    id: string,
    country: string
}

export interface Meta {
    additional_info: string;
    timestamp: string;
}
