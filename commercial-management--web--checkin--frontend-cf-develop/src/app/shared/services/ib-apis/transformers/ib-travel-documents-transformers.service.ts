import { Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { TravelDocumentType } from '@src/app/core/models/travel-documents/travel-documents-model';
import {
    DocumentModel,
    codeToTravelType
} from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import {
    ModelApisForm,
    ItemList,
    DocumentObject,
    SelectOptions,
    ModelApisInfant,
    TypesOCR,
    FormDataApis,
    ModelPersonalData,
    FormPersonalData,
    FormDataApisInfant,
    ControlData,
    FormContactData,
    ModelContactData,
    DocumentForm,
    FormDocumentationRequired,
    ModelDocumentationRequired,
    FormPassengerAddress,
    ModelPassengerAddress
} from 'commercial-management--digital--web-components-design--library';

export type CountryItem = { code: string; description: string; isoCode: string };

@Injectable({ providedIn: 'root' })
export class IbTravelDocumentsTransformerService {
    constructor (private CommonsSessionStorageService: CommonsSessionStorageService) {}

    updateTravelDocumentTransform (
        model: ModelApisForm,
        documents: DocumentModel[],
        isInfant: boolean,
        currentFormModel: FormDataApis,
        options: { mutate?: boolean } = {}
    ): ModelApisForm | null {
        if (!documents?.length) return null;

        const out: ModelApisForm = options.mutate ? model : this.deepClone(model);
        this.updateModel(out, currentFormModel);
        let data = isInfant && out.infant ? out.infant : out;

        this.updateDataDocuments(data, documents);

        this.updateOcrMandatoryToOptional(data);

        return out;
    }

    private updateModel (model: ModelApisForm, currentFormModel: FormDataApis) {
        const cloneModel = structuredClone(model);

        cloneModel.personalData = this.updatePersonalData(cloneModel.personalData, currentFormModel.personalData);
        cloneModel.contactData = this.updateContactData(cloneModel.contactData, currentFormModel.contactData);
        cloneModel.documentationRequired = this.updateDocumentationRequired(
            cloneModel.documentationRequired,
            currentFormModel.documentationRequired
        );
        cloneModel.passengerAddress = this.updatePassengerAddress(
            cloneModel.passengerAddress,
            currentFormModel.passengerAddress
        );

        if (cloneModel.infant && currentFormModel.infant) {
            cloneModel.infant = this.updateInfantModel(cloneModel.infant, currentFormModel.infant);
        }

        Object.assign(model, cloneModel);
    }

    private updateModelField (prevValue: ControlData, newValue: string | undefined): ControlData {
        return {
            ...prevValue,
            value: newValue ?? ''
        };
    }

    private updatePersonalData (model: ModelPersonalData, formModel: FormPersonalData): ModelPersonalData {
        const { birthDate, gender, name, surname, country, nationality } = formModel;

        const personalDataClone = structuredClone(model);

        return {
            ...personalDataClone,
            birthDate: this.updateModelField(personalDataClone.birthDate, birthDate),
            name: this.updateModelField(personalDataClone.name, name),
            surname: this.updateModelField(personalDataClone.surname, surname),
            nationality: this.updateModelField(personalDataClone.nationality, nationality?.value),
            country: this.updateModelField(personalDataClone.country, country?.value),
            gender: this.updateModelField(personalDataClone.gender, gender)
        };
    }

    private updateContactData (model: ModelContactData, formModel: FormContactData): ModelContactData {
        const clone = structuredClone(model);

        const { additionalInfo, emergencyInfo } = formModel;

        return {
            ...clone,
            additionalInfo: {
                ...clone.additionalInfo,
                email: this.updateModelField(clone.additionalInfo.email, additionalInfo.email),
                phone: this.updateModelField(clone.additionalInfo.phone, additionalInfo.phone?.value),
                number: this.updateModelField(clone.additionalInfo.number, additionalInfo.number),
                checkInfoAll: additionalInfo.checkInfoAll
            },
            emergencyInfo: {
                ...clone.emergencyInfo,
                name: this.updateModelField(clone.emergencyInfo.name, emergencyInfo.name),
                phone: this.updateModelField(clone.emergencyInfo.phone, emergencyInfo.phone?.value),
                number: this.updateModelField(clone.emergencyInfo.number, emergencyInfo.number),
                checkEmergencyAll: emergencyInfo.checkEmergencyAll
            }
        };
    }

    private updateDocumentationRequired (
        model: ModelDocumentationRequired,
        formModel: FormDocumentationRequired
    ): ModelDocumentationRequired {
        const currentMandatoryDocs = structuredClone(model.mandatory);
        const currentOtherDocs = structuredClone(model.other);

        const updatedMandatoryDocs = this.updateMandatoryDocs(currentMandatoryDocs, formModel.mandatory);
        const updatedOtherDocs = this.updateOthersDocuments(currentOtherDocs, formModel.other, formModel.visa);

        return {
            mandatory: updatedMandatoryDocs,
            other: updatedOtherDocs
        };
    }

    private updateMandatoryDocs (model: DocumentObject[], mandatory: DocumentForm): DocumentObject[] {
        return model.map((doc) => {
            if ((doc.type as ItemList).code === (mandatory.type as SelectOptions).value)
                return this.updateDocumentModel(doc, mandatory);

            return doc;
        });
    }

    private updateOthersDocuments (model: DocumentObject[], other: DocumentForm, visa: DocumentForm): DocumentObject[] {
        return model.map((doc) => {
            if ((doc.type as ItemList).code === (visa.type as SelectOptions).value)
                return this.updateDocumentModel(doc, visa);

            return this.updateDocumentModel(doc, other);
        });
    }

    private updateDocumentModel (model: DocumentObject, formModel: DocumentForm): DocumentObject {
        const existsIssuerCountry =
      (formModel.issuerCountry as SelectOptions)?.value && (formModel.issuerCountry as SelectOptions)?.label;
        const updatedCountry = existsIssuerCountry
            ? {
                value: (formModel.issuerCountry as SelectOptions).value,
                label: (formModel.issuerCountry as SelectOptions).label
            }
            : model.country;

        return {
            ...model,
            type: model.type,
            country: updatedCountry,
            number: formModel.number ?? model.number,
            expiryDate: formModel.expiryDate ?? model.expiryDate
        };
    }

    private updatePassengerAddress (model: ModelPassengerAddress, formModel: FormPassengerAddress): ModelPassengerAddress {
        if (!model || !formModel) return;

        return {
            ...model,
            address: this.updateModelField(model.address, formModel.address),
            city: this.updateModelField(model.city, formModel.city),
            state: this.updateModelField(model.state, formModel.state?.value),
            zipCode: this.updateModelField(model.zipCode, formModel.zipCode),
            checkAddressForAll: formModel.checkAddressForAll ?? false
        };
    }

    private updateInfantModel (model: ModelApisInfant, formModel: FormDataApisInfant): ModelApisInfant {
        const clone = structuredClone(model);

        clone.documentationRequired = this.updateDocumentationRequired(
            clone.documentationRequired,
            formModel.documentationRequired
        );
        clone.personalData = this.updatePersonalData(clone.personalData, formModel.personalData);

        return clone;
    }

    private updateDataDocuments (out: ModelApisForm | ModelApisInfant, documents: DocumentModel[]) {
        const docReq = out.documentationRequired ?? { mandatory: [], other: [] };
        const mandatory = docReq.mandatory ?? [];
        const other = docReq.other ?? [];

        const { mandatoryByCode, otherByCode } = this.buildDocReqIndexes(mandatory, other);

        for (const doc of documents) {
            this.applyDocument(out, doc, mandatoryByCode, otherByCode);
        }
    }

    private applyDocument (
        out: ModelApisForm | ModelApisInfant,
        doc: DocumentModel,
        mandatoryByCode: Map<string, DocumentObject>,
        otherByCode: Map<string, DocumentObject[]>
    ): void {
        const type = codeToTravelType[doc.typeCode];
        const code = this.toMandatoryCode(type);

        const mandatoryTarget = mandatoryByCode.get(code);
        if (mandatoryTarget) {
            this.unselectAllTheMandatoryDocs(mandatoryByCode);
            this.copyDocIntoTarget(mandatoryTarget, doc);
            //this.copyPersonalData(out.personalData, doc);
            return;
        }

        if (doc.typeCode === '99') {
            for (const target of otherByCode.get('VISA') ?? []) {
                this.copyDocIntoTarget(target, doc);
            }
        }
    }

    private buildDocReqIndexes (
        mandatory: readonly DocumentObject[],
        other: readonly DocumentObject[]
    ): {
            mandatoryByCode: Map<string, DocumentObject>;
            otherByCode: Map<string, DocumentObject[]>;
        } {
        const mandatoryByCode = new Map<string, DocumentObject>();
        for (const m of mandatory) {
            const code = (m?.type as ItemList)?.code;
            if (code) mandatoryByCode.set(code, m);
        }

        const otherByCode = new Map<string, DocumentObject[]>();
        for (const o of other) {
            const code = (o?.type as ItemList)?.code;
            if (!code) continue;
            const list = otherByCode.get(code);
            if (list) list.push(o);
            else otherByCode.set(code, [o]);
        }

        return { mandatoryByCode, otherByCode };
    }

    private toMandatoryCode (t: TravelDocumentType): string {
        return t === 'PASSPORT' ? 'PSPT' : String(t);
    }

    private copyDocIntoTarget (target: DocumentObject, d: DocumentModel): void {
        target.expiryDate = d.expiryDate;
        target.number = d.number;
        target.country = this.getDataCountry(d.countryCode);
        target.ocrVerified = false;
        target.isSelected = true;
    }

    // private copyPersonalData (
    //     pd: ModelApisForm['personalData'],
    //     d: DocumentModel
    // ): void {
    //     pd.country.value = d.countryCode;
    // }

    private deepClone<T>(obj: T): T {
        if (typeof (globalThis as any).structuredClone === 'function') {
            return (globalThis as any).structuredClone(obj);
        }
        return JSON.parse(JSON.stringify(obj));
    }

    private getDataCountry (country: string): SelectOptions {
        const EMPTY: SelectOptions = { value: '', label: '' };
        if (!country) return EMPTY;

        const countries = (this.CommonsSessionStorageService.get('countriesList') as CountryItem[] | null) ?? [];

        const found = countries.find((c) => c?.code === country);
        return found ? { value: found.code, label: found.description } : EMPTY;
    }

    private updateOcrMandatoryToOptional (model: ModelApisForm | ModelApisInfant) {
        const mandatoryDocument = model.documentationRequired.mandatory.find(
            (doc) => doc.ocr === ('MANDATORY' as TypesOCR)
        );

        if (mandatoryDocument?.ocr) mandatoryDocument.ocr = 'OPTIONAL' as TypesOCR;
    }

    private unselectAllTheMandatoryDocs (mandatoryByCode: Map<string, DocumentObject>) {
        mandatoryByCode.forEach((doc) => (doc.isSelected = false));
    }
}
