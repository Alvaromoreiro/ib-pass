import { Inject, Injectable } from '@angular/core';
import { Document, DocumentModel, mapDocuments, partitionByIssues, filterDocumentsByType } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { IUpdateTravelDocumentsBulk, TravelDocumentType } from '@src/app/core/models/travel-documents/travel-documents-model';
import { AJSTravelInfoService, AJSTravelInfoServiceType } from '@src/app/shared/services/ib-apis/ib-travel-info-service-bridge.service';

@Injectable({ providedIn: 'root' })
export class IbTravelDocumentService {
    constructor (
        @Inject(AJSTravelInfoService) private TravelInfoService: AJSTravelInfoServiceType
    ) { }


    async getTravelDocuments (validTypesDocsSecurity: string[]): Promise<{ documents: DocumentModel[], documentsTypesValid: TravelDocumentType[] }> {
        const result = { documents: [], documentsTypesValid: [] };

        try {
            const response = await this.TravelInfoService.getTravelInfo() as Document[];

            if (response.length === 0) {
                return result;
            }

            const documents = mapDocuments(response);
            const { valid } = partitionByIssues(documents);
            const { filtered, typesValid } = filterDocumentsByType(valid, validTypesDocsSecurity);

            return { documents: filtered, documentsTypesValid: typesValid };
        } catch (error) {
            //console.error('getTravelDocuments error', { error, locale });
            return result;
        }
    }

    private buildResponse (status: boolean, result?: any, error?: any, editDocument?: boolean): IUpdateTravelDocumentsBulk {
        return { editDocument, status, result, error };
    }
    async buildPromises (documentsUpdate: DocumentModel[]) {
        const promises = documentsUpdate.map(async (document) => {
            const isEdit = !document.id.toLowerCase().includes('post');
            const {isExpired, issues, iconFlag, ...doc} = document;
            if (isEdit) {
                await this.TravelInfoService.putTravelDocument(doc);
                // return a uniform response per item (adapt to your buildResponse signature)
                return this.buildResponse(true, undefined, undefined, true);
            } else {
                const  {id, ...newDoc} = doc;
                const result = await this.TravelInfoService.postTravelDocument(newDoc);
                return this.buildResponse(true, result, undefined, false);
            }
        });

        return await Promise.all(promises);
    }

    async updateTravelDocumentsBulk (documentsUpdate: DocumentModel[]): Promise<IUpdateTravelDocumentsBulk | IUpdateTravelDocumentsBulk[]> {
        try {
            // Wait for all to complete; rejects if any promise rejects
            const results = await this.buildPromises(documentsUpdate);
            // Return array of per-item responses (or wrap as you need)
            return results;
        } catch (error: any) {
            // If any of the requests failed, get a message and throw (or return)
            const errorMsg = error?.error?.meta?.error ?? error;
            //window.console.error(this.buildResponse(false, undefined, errorMsg, true));
            return this.buildResponse(false, undefined, errorMsg, true);
        }
    }

}