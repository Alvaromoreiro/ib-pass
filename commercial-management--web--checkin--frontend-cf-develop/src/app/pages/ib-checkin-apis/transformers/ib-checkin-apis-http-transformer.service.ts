/* eslint-disable no-console */
import { Inject, Injectable } from '@angular/core';
import { ApisConstants, ApisRequiredFields } from '@src/app/core/constants/ib-checkin-apis-constants';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Address, Document, EmergencyContact, InfantPassengerSecurityInfo, MandatoryDocument, SecurityDocument, SecurityRequest } from '@src/app/core/models/ib-checkin-apis/services/security-model';
import { AdditonalInfoBody } from '@src/app/core/models/ib-checkin-apis/services/additional-info-model';
import { ApisPassenger, IGetUniqueDocumentTypes, UpdateApisInfoModel } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { UpdateTravelDocumentRequest, UpdateTravelDocument, TravelDocumentType, TravelDocument } from '@src/app/core/models/travel-documents/travel-documents-model';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { DocumentModel, TypeCodeCanonical } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import {
    FormDataApis,
    FormDataApisInfant,
    SelectOptions, 
    DocumentForm, 
    FormEmergencyInfo, 
    FormPassengerAddress 
} from 'commercial-management--digital--web-components-design--library';

type AnyObject = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class IbCheckinApisHttpTransformerService {
    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    generateAdditionalInfoRequest (initialModel: UpdateApisInfoModel[]): AdditonalInfoBody {
        const confirmationDigitalInfo: any = this.CommonsSessionStorageService.get('confirmationDigitalInfo');

        return initialModel.map(passenger => {
            const { formData, id } = passenger;
            const { email, phone } = formData.contactData.additionalInfo;

            return {
                id,
                disruptionContact: {
                    language: confirmationDigitalInfo.Language,
                    email,
                    phone: {
                        countryCode: phone.value,
                        number: formData.contactData.additionalInfo.number
                    }
                }
            };
        });
    }

    generateSecurityRequest (initialModel: UpdateApisInfoModel[], requiredFields: ApisRequiredFields[]): SecurityRequest {
        const requiredHomeAddress = requiredFields.includes(ApisRequiredFields.HOME_COUNTRY);
        return initialModel.map(passenger => {
            const { formData, id } = passenger;
            const { contactData, passengerAddress, personalData, infant } = formData;
            const { name, surname, gender, birthDate, nationality, country } = personalData;

            const emergencyContact = this.createEmergencyContact(contactData.emergencyInfo);
            const destinationAddress = this.createDataAddress(passengerAddress);
            const homeAddress = requiredHomeAddress ? { country: country?.value } as Address : undefined;
            const documents = this.getSecurityRequestDocuments(formData);
            const infantPassengerSecurityInformation = this.createInfantSecurityInfo(infant);

            return {
                id,
                name,
                surname,
                gender,
                birthDate,
                nationality: nationality.value,
                homeAddress,
                documents,
                inTransit: false,
                destinationAddress,
                emergencyContact,
                infantPassengerSecurityInformation
            };
        });
    }

    private createEmergencyContact ({ name, number, phone }: FormEmergencyInfo): EmergencyContact | undefined {
        const checkedData = name && number && phone;

        if (!checkedData) return undefined;
        return {
            refused: false,
            name: name,
            phone: {
                countryCode: phone.value,
                number: number
            }
        };
    }

    private createDataAddress (address?: FormPassengerAddress): Address | undefined {
        if (!address) return undefined;
        return {
            state: address.state.value,
            country: ApisConstants.USA_NATIONALITY,
            zipCode: address.zipCode,
            city: address.city,
            address: address.address
        };
    }

    private createInfantSecurityInfo (infant?: FormDataApisInfant): InfantPassengerSecurityInfo | undefined {
        if (!infant) return undefined;
        const { personalData } = infant;
        return {
            id: null,
            requiredFields: [],
            name: personalData.name,
            surname: personalData.surname,
            gender: personalData.gender,
            birthDate: personalData.birthDate,
            nationality: personalData.nationality.value,
            cityOfBirth: null,
            countryOfResidence: null,
            documents: this.getSecurityRequestDocuments(infant)
        };
    }

    private getSecurityRequestDocuments (formData: FormDataApis | FormDataApisInfant): Document[] {
        const documents: Document[] = [];
        const { mandatory, other, visa } = formData.documentationRequired;

        documents.push(this.setDocumentFormToRequest(mandatory));
        if (other?.number) documents.push(this.setDocumentFormToRequest(other));
        if (visa?.number) documents.push(this.setDocumentFormToRequest(visa));

        return documents;
    }

    private setDocumentFormToRequest (document: DocumentForm): Document {
        return {
            ...document,
            type: this.getSelectOptionValue(document.type as SelectOptions),
            issuerCountry: this.getSelectOptionValue(document.issuerCountry as SelectOptions),
            mrzText: this.isMrzTextValid(document) ? document.mrzText : undefined,
            ocrVerified: this.getOcrVerifiedStatus(document)
        };
    }

    private getSelectOptionValue (selectOption?: SelectOptions): string {
        return selectOption?.value || '';
    }

    private isMrzTextValid (document: DocumentForm): boolean {
        return document?.ocrVerified ?? false;
    }

    private getOcrVerifiedStatus (document: DocumentForm): boolean {
        return document?.ocrVerified || false;
    }

    generateNewsLetterInfo (initialModel: UpdateApisInfoModel[]) {
        const bookingInfo: CkiBookingInfo.BookingInfo | null = this.CommonsSessionStorageService.get(
            CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO
        );
        const cachedInfo =
            bookingInfo?.outwardSegments?.length > 0 ? bookingInfo.outwardSegments : bookingInfo.returnSegments;

        return initialModel.map(({ formData }) => ({
            email: formData.contactData.additionalInfo.email ?? '',
            name: formData.personalData.name ?? '',
            departureCity: cachedInfo[0].departure.airport.code ?? '',
            destinationCity: cachedInfo[0].arrival.airport.code ?? '',
            language: this.$rootScope.appLang ?? '',
            country: formData.personalData.country.value ?? '',
            birthDate: formData.personalData.birthDate ?? '',
            unsubscribe: formData.checkbox.notSendNewsletter ?? false
        }));
    }

    private normalizeNameflags (code?: string): string {
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

    private getCountryDescription (code: string | null | undefined): string {
        if (!code) return '';

        const normalized = code.trim().toUpperCase();
        if (normalized.length !== 2) return '';

        const apisInfo: any = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.APIS_INFO);

        return apisInfo?.countries?.find(c => c.code?.toUpperCase() === normalized)?.description ?? '';
    }

    private getAllowedType = (typeCode: TypeCodeCanonical | '09' | '99'): TravelDocumentType => {
        if (typeCode === '02') return 'DNI';
        if (typeCode === '05') return 'PASSPORT';
        return 'VISA';
            
    };

    transformTravelDocumentsToInfo (
        docs: DocumentModel[] = [],
        validTypes?: TravelDocumentType[]
    ): DocumentModel[] {
        if (docs.length === 0) return [];

        const allowed = validTypes?.length ? new Set(validTypes) : undefined;

        return docs
            .filter(doc =>
                !allowed || allowed.has(this.getAllowedType(doc.typeCode))
            )
            .map(({ countryCode = '', ...doc }: DocumentModel) => ({
                ...doc,
                countryCode,
                iconFlag: this.iconsCandidates(countryCode),
                descriptionCountry: this.getCountryDescription(countryCode)
            }));
    }

    getUniqueDocumentTypes ({ mandatoryDocuments, optionalDocuments }: ApisPassenger): IGetUniqueDocumentTypes {
        const typeDocsMandatory = this.getMandatoryDocumentsTypes(mandatoryDocuments);
        const typeDocsOptional = this.getOptionalDocumentsTypes(optionalDocuments);
        const validTypesDocs = Array.from(new Set([...typeDocsMandatory, ...typeDocsOptional]));

        return {
            validTypesDocs: validTypesDocs,
            showTravelDocumentsLink: {
                showBasicInfo: typeDocsMandatory?.length > 0,
                showVisa: typeDocsOptional?.length > 0
            }
        };
    }

    private getMandatoryDocumentsTypes (mandatoryDocuments: MandatoryDocument[]): TravelDocumentType[] {
        if (!Array.isArray(mandatoryDocuments)) return [];
        const validTypes: TravelDocumentType[] = ['DNI', 'PASSPORT'];

        return mandatoryDocuments
            .flatMap(doc => doc.documents ?? [])
            .map(d => {
                const code = d.type?.code;
                return code === 'PSPT' ? 'PASSPORT' : code;
            })
            .filter((code): code is TravelDocumentType => !!code && validTypes.includes(code as TravelDocumentType))
            .map(code => code as TravelDocumentType);
    }

    private getOptionalDocumentsTypes (optionalDocuments: SecurityDocument[]): TravelDocumentType[] {
        if (!Array.isArray(optionalDocuments)) return [];
        const validTypes: TravelDocumentType[] = ['VISA'];

        return optionalDocuments
            .map(doc => doc.type?.code)
            .filter((code): code is TravelDocumentType => !!code && validTypes.includes(code as TravelDocumentType))
            .map(code => code as TravelDocumentType);
    }


    getDocumentsValid (responseDocuments: any | TravelDocument[], validTypesDocsSecurity: string[]): {
        documents: TravelDocument[], documentsTypesValid: TravelDocumentType[]
    } {
        const result: TravelDocument[] = this.keysToCamelFlat(responseDocuments);
        const documentsTypesValid: TravelDocumentType[] = [];
        const documents = result.filter(({ documentType }) => {
            if (!documentsTypesValid.includes(documentType)) documentsTypesValid.push(documentType);
            return validTypesDocsSecurity.includes(documentType);
        });


        return { documents: documents ?? [], documentsTypesValid };
    }

    transformTravelDocumentsUpdate (data: UpdateTravelDocument): UpdateTravelDocumentRequest {
        const { id, ...travelDocRequest } = data;

        return {
            dataTransformed: travelDocRequest,
            documentId: id !== undefined && id !== null && id !== '' ? id : undefined
        };
    }

    private toCamel (str: string): string {
        const prefixMatch = str.match(/^_+/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        const core = str.slice(prefix.length);

        const camel = core.replace(/_([a-zA-Z0-9])/g, (_, ch) => ch.toUpperCase());
        return prefix + camel;
    }

    private isPlainObject (value: any): value is AnyObject {
        return Object.prototype.toString.call(value) === '[object Object]';
    }


    private camelToSnakeKey (key: string): string {
        const prefixMatch = key.match(/^_+/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        const core = key.slice(prefix.length);

        const snake = core
            .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
            .toLowerCase();

        return prefix + snake;
    }


    keysToCamelFlat<T = any>(input: T): T {
        if (Array.isArray(input)) {
            return input.map(item => this.keysToCamelFlat(item)) as unknown as T;
        }

        if (this.isPlainObject(input)) {
            const result: AnyObject = {};
            for (const key of Object.keys(input)) {
                const newKey = this.toCamel(key);
                const value = input[key];

                if (Array.isArray(value) || this.isPlainObject(value)) {
                    result[newKey] = this.keysToCamelFlat(value);
                } else {
                    result[newKey] = value;
                }
            }
            return result as T;
        }

        return input;
    }

    keysToSnakeFlat<T extends Record<string, any>>(obj: T): Record<string, any> {
        if (!obj || typeof obj !== 'object') {
            return obj as unknown as Record<string, any>;
        }

        const result: Record<string, any> = {};
        for (const key of Object.keys(obj)) {
            const newKey = this.camelToSnakeKey(key);
            result[newKey] = obj[key];
        }
        return result;
    }

}
