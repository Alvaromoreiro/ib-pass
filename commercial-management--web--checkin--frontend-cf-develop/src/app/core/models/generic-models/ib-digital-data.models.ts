import { DocumentModel } from '../travel-documents/travel-documents-cust-cust.model';
import { TravelDocumentType } from '../travel-documents/travel-documents-model';

export interface HandleEventsTravelDocuemnts {
    docs?: DocumentModel[];
    notUseSavedDocuments?: boolean;
    validTypesDocs?: TravelDocumentType[];
}

export type EventType = {
    eventCategory: string;
    eventAction: string;
    eventLabel: string;
    eventName: string;
};