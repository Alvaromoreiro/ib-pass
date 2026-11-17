import { Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { PassengerStorageKey } from '@src/app/core/constants/ib-storage-keys.constants';
import { UpdateApisInfoModel } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { DocumentModel, normalizeValidTypeCode, parseExpiryOrIssues, resolveTypeDescription, toLower, TypeCodeCanonicalValid } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { IUpdateTravelDocumentsBulk, TypesDocumentsAccepted } from '@src/app/core/models/travel-documents/travel-documents-model';
import { toTravel } from '@src/app/shared/utils/map-travel-documents';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { SelectOptions, DocumentForm } from 'commercial-management--digital--web-components-design--library';

@Injectable({
    providedIn: 'root'
})
export class IbCheckinApisUtilsService {
    constructor (private CommonsSessionStorageService: CommonsSessionStorageService) { }

    // Helpers
    private getKey = (d: DocumentModel) => `${d.typeCode}|${d.number}|${d.countryCode}`;
    private areDocumentsEquivalent (doc1: DocumentModel, doc2: DocumentModel) {
        const reduced1 = this.toComparableDocument(doc1);
        const reduced2 = this.toComparableDocument(doc2);

        const s1 = JSON.stringify(reduced1);
        const s2 = JSON.stringify(reduced2);

        return s1 === s2;
    }

    private getMapDocumentModelInfoByKey (
        documents: DocumentModel[]
    ): Map<string, DocumentModel> {
        return new Map(documents.map((d) => [this.getKey(d), d] as const));
    }

    private getMapUserDocumentsByKey (
        documents: DocumentModel[]
    ): Map<string, DocumentModel> {
        return new Map(documents.map((u) => [this.getKey(u), u] as const));
    }


    checkUpdateTravelDocuments (
        model: UpdateApisInfoModel[],
        documentsUserLogged: DocumentModel[]
    ): DocumentModel[] {
        const documentsModel: DocumentModel[] = this.getDocumentsForModel(model);
        const userByKey = this.getMapUserDocumentsByKey(documentsUserLogged);

        return documentsModel
            .map((dm, i) => {
                const userDoc = userByKey.get(dm.id);

                if (!userDoc) return { ...dm, id: `POST-${i}` }; // POST
                if (this.areDocumentsEquivalent(userDoc, dm)) return null;
                return { ...dm, id: userDoc.id }; // PUT
            })
            .filter((x): x is DocumentModel => x !== null);
    }

    saveDocumentModel (documentsModel: DocumentModel[], mandatory: DocumentForm) {
        const docType = toTravel((mandatory.type as SelectOptions).value as TypesDocumentsAccepted);
        const country = (mandatory.issuerCountry as SelectOptions).value;
        const typeCode: TypeCodeCanonicalValid = normalizeValidTypeCode(toLower(docType));
        const expiryDate = parseExpiryOrIssues(mandatory.expiryDate);

        documentsModel.push({
            id: `${typeCode}|${mandatory.number}|${country}`,
            typeCode,
            typeDescription: resolveTypeDescription(typeCode),
            countryCode: country,
            number: mandatory.number,
            expiryDate: expiryDate.date,
            isExpired: expiryDate.expired,
            issues: [],
            iconFlag: this.iconsCandidates(country)
        });
    }

    getDocumentsForModel (model: UpdateApisInfoModel[]): DocumentModel[] {
        const documentsModel: DocumentModel[] = [];
        for (let i = 0; i < model.length; i++) {
            // get data model
            const passengerUpdate = model[i];
            const { formData } = passengerUpdate;
            const { documentationRequired, infant } = formData;
            const { mandatory } = documentationRequired;

            if (infant) {
                this.saveDocumentModel(documentsModel, infant.documentationRequired.mandatory);
            }

            this.saveDocumentModel(documentsModel, mandatory);
        }

        return documentsModel.filter((d) => !d.isExpired);
    }

    toDocumentModelsData (docs: DocumentModel[], documentsSave: DocumentModel[]): DocumentModel[] {
        const docsInfoByKey = this.getMapDocumentModelInfoByKey(docs);
        return documentsSave.map((ds, i) => {
            const docSaveByKey = docsInfoByKey.get(i.toString());
            return docSaveByKey ? ds : null;
        }).filter((x): x is DocumentModel => x !== null);
    }

    normalizeNameflags (code?: string): string {
        if (!code) return '';
        const c = code.trim().toLowerCase();
        // Acepta ISO-2
        return c.length === 2 ? c : '';
    }
    iconsCandidates (countryCode?: string): string {
        const baseUrl = CheckinAppConstants.iconsFlags;
        const fallbackName = 'unknown.svg';
        const iso2 = this.normalizeNameflags(countryCode);

        if (iso2) {
            return `${baseUrl}/${iso2}.svg`;
        }
        return `${baseUrl}/${fallbackName}`;
    }

    evaluateStatus (result: IUpdateTravelDocumentsBulk | IUpdateTravelDocumentsBulk[]): boolean {
        if (Array.isArray(result)) {
            return result.some(item => item.status === true);
        } 

        return result?.status === true;
    }

    toComparableDocument (model: DocumentModel): Omit<DocumentModel, 'id' | 'typeDescription' | 'isExpired' | 'issues' | 'iconFlag'> {
        return {
            typeCode: model.typeCode, 
            countryCode: model.countryCode ?? undefined,
            number: model.number,
            expiryDate: model.expiryDate ?? undefined
        };
    }

    isErrorRelatedToConstraints (error: any): boolean {
        return error?.isEstaConstraints || error?.isEesConstraints || error?.isEtiasConstraints || error?.isSeeAgent;
    }

    updatePassengersSelected (passengersIds: number[] = []): number[] {
        const passengersNOAPIS: number[] = this.getPassegersNOAPIS();
        const newPassengersSelected = [...new Set([...passengersNOAPIS, ...passengersIds])];
        this.CommonsSessionStorageService.set(PassengerStorageKey.passengersSelected, newPassengersSelected);
        return newPassengersSelected;
    }

    getPassegersNOAPIS (): number[] {
        return this.CommonsSessionStorageService.get(PassengerStorageKey.passengersNOAPIS) || [];
    }
}