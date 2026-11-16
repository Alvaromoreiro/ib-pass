
export interface ReturnedDocuments {
    mandatoryDocuments: MandatoryDocuments;
    optionalDocuments: OptionalDocuments;
    visaDocument: visaDocument | null
};

export interface MandatoryDocuments {
    nationality: string;
    isMandatory: boolean;
    documents: Array<{}> | null;
    selectedDoc: Object | null;
};

export interface OptionalDocuments {
    nationality: string;
    isMandatory: boolean;
    documents: Array<{}> | null;
    optDocuments: Array<{}> | null;
    selectedDoc: Object | null;
};

export interface visaDocument {
    isMandatory: boolean;
}
