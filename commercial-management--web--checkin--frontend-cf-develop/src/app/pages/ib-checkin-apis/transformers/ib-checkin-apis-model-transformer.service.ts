/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { ApisDocuments, ApisRequiredFields } from '@src/app/core/constants/ib-checkin-apis-constants';
import { ApisPassenger, BookingInfoApis } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { CountryCode } from '@src/app/core/models/ib-checkin-apis/services/additional-info-model';
import {
    Address,
    InfantPassengerSecurityInfo,
    MandatoryDocument,
    SecurityDocument,
    Type,
    Document
} from '@src/app/core/models/ib-checkin-apis/services/security-model';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import {
    ModelApisForm,
    ModelApisInfant,
    DocumentObject,
    ItemList,
    TypesOCR,
    ModelPersonalData,
    ModelContactData,
    ModelAdditionalInfo,
    ModelEmergencyInfo,
    ModelPassengerAddress
} from 'commercial-management--digital--web-components-design--library';

@Injectable({ providedIn: 'root' })
export class IbCheckinApisModelTransformerService {
    constructor (
        private IbUtilsService: IbUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    setApisFormModel = (passenger: ApisPassenger): ModelApisForm => {
        const { airlineName, isRequiredContactData, isRequiredEmergencyInfo, isPrivacyStatement } = this.getDataBookingInfo(
            passenger.id as string
        );
        const visaOption = passenger.optionalDocuments.find((document) => document.type.code === ApisDocuments.VISA);
        const infant = passenger.infantPassengerSecurityInformation;
        const gdpr: any = this.CommonsSessionStorageService.get('gdprInfoIBPRIVAC');
        const model: ModelApisForm = {
            typePassenger: this.IbUtilsService.getPassengerType(passenger.id as string),
            personalData: this.fillPersonalData(passenger),
            passengerAddress: this.fillPassengerAddress(passenger),
            documentationRequired: this.fillDocumentationRequired(passenger),
            contactData: this.fillContactData(isRequiredContactData, isRequiredEmergencyInfo, passenger),
            infant: this.fillInfant(infant),
            id: Number(passenger.id),
            isPrivacyStatement: isPrivacyStatement,
            gdpr: {
                text: gdpr?.text ?? '',
                url: ''
            },
            bookingInfoPassenger: passenger.passengerBookingInfo,
            airlineName: airlineName
        };
        this.fillVisaOption(model, visaOption);
        return model;
    };

    private fillContactData = (
        isRequiredContactData: boolean,
        isRequiredEmergencyInfo: boolean,
        passenger: ApisPassenger
    ): ModelContactData => {
        return {
            additionalInfo: this.fillAdditionalInfo(isRequiredContactData, passenger),
            emergencyInfo: this.fillEmergencyInfo(isRequiredEmergencyInfo, passenger)
        };
    };

    private fillEmergencyInfo = (
        isRequiredEmergencyInfo: boolean,
        { emergencyContact }: ApisPassenger
    ): ModelEmergencyInfo => {
        const { phone, name } = emergencyContact ?? {};
        return {
            phone: {
                value: (phone?.countryCode as CountryCode)?.code ?? '',
                required: isRequiredEmergencyInfo
            },
            number: {
                value: phone?.number ?? '',
                required: isRequiredEmergencyInfo
            },
            name: {
                value: name ?? '',
                required: isRequiredEmergencyInfo
            },
            checkEmergencyAll: false
        };
    };

    private fillAdditionalInfo = (
        isRequiredContactData: boolean,
        { additionalInfo }: ApisPassenger
    ): ModelAdditionalInfo => {
        const { disruptionContact } = additionalInfo ?? {};
        return {
            email: {
                value: disruptionContact?.email ?? '',
                required: isRequiredContactData
            },
            phone: {
                value: (disruptionContact?.phone?.countryCode as CountryCode)?.code ?? '',
                required: isRequiredContactData
            },
            number: {
                value: disruptionContact?.phone?.number ?? '',
                required: isRequiredContactData
            },
            checkInfoAll: false
        };
    };

    private fillInfant = (infant: InfantPassengerSecurityInfo): ModelApisInfant => {
        if (!infant) return undefined;
        return {
            typePassenger: 'INFANT',
            personalData: this.fillPersonalData(infant),
            documentationRequired: this.fillDocumentationRequired(infant)
        };
    };

    private fillVisaOption = (model, visaOption) => {
        if (visaOption && Array.isArray(model.documentationRequired.other)) {
            model.documentationRequired.other.forEach((doc) => {
                if (doc.type.code === visaOption.type.code) {
                    doc.country = visaOption.issuerCountry
                        ? {
                            value: visaOption.issuerCountry,
                            label: ''
                        }
                        : undefined;
                    doc.expiryDate = visaOption.expiryDate ?? undefined;
                    doc.number = visaOption.number ?? undefined;
                    doc.requiredFields = visaOption.requiredFields;
                    doc.requiredFieldsOptions = visaOption.requiredFieldsOptions;
                }
            });
        }
    };

    private getNationalityString = (nationality: string | CountryCode | null): string => {
        if (typeof nationality === 'string') {
            return nationality;
        } else if (nationality?.code) {
            return nationality.code;
        }
    };

    private createField = (value: any, field: string, requiredFields: string[], defaultValue: any = '') => {
        return {
            value: value ?? defaultValue,
            required: this.isRequiredField(requiredFields, field)
        };
    };

    private fillPersonalData = ({
        requiredFields,
        name,
        surname,
        birthDate,
        nationality,
        homeAddress,
        gender
    }: ApisPassenger | InfantPassengerSecurityInfo): ModelPersonalData => {
        const { NAME, SURNAME, BIRTH_DATE, NATIONALITY, HOME_COUNTRY, GENDER } = ApisRequiredFields;

        const nationalityString = this.getNationalityString(nationality);

        return {
            name: this.createField(name, NAME, requiredFields),
            surname: this.createField(surname, SURNAME, requiredFields),
            birthDate: this.createField(birthDate, BIRTH_DATE, requiredFields),
            nationality: this.createField(nationalityString, NATIONALITY, requiredFields),
            country: this.createField((homeAddress?.country as CountryCode)?.code, HOME_COUNTRY, requiredFields),
            gender: this.createField(gender, GENDER, requiredFields)
        };
    };

    private transformDestinationAddress = (
        requiredFields: string[],
        destinationAddress: Address
    ): ModelPassengerAddress => {
        const { address = '', zipCode = '', city = '', state = '' } = destinationAddress ?? {};
        const { DESTINATION_ADDRESS, DESTINATION_ZIP, DESTINATION_CITY, DESTINATION_STATE } = ApisRequiredFields;
        return {
            address: {
                value: address,
                required: this.isRequiredField(requiredFields, DESTINATION_ADDRESS)
            },
            zipCode: {
                value: zipCode,
                required: this.isRequiredField(requiredFields, DESTINATION_ZIP)
            },
            city: {
                value: city,
                required: this.isRequiredField(requiredFields, DESTINATION_CITY)
            },
            state: {
                value: state,
                required: this.isRequiredField(requiredFields, DESTINATION_STATE)
            }
        };
    };

    private fillPassengerAddress = ({ requiredFields, destinationAddress }: ApisPassenger): ModelPassengerAddress => {
        const isRequiredDestinationAddress = this.isRequiredField(requiredFields, ApisRequiredFields.DESTINATION_ADDRESS);
        return isRequiredDestinationAddress
            ? this.transformDestinationAddress(requiredFields, destinationAddress)
            : undefined;
    };

    private fillDocumentationRequired = (passenger: ApisPassenger | InfantPassengerSecurityInfo) => {
        const getFilledDocument = (documents: Document[]): Document | undefined => {
            const docTypes = ['PSPT', 'DNI'];
            return documents.find((doc: Document) => {
                return docTypes.includes((doc.type as Type).code);
            });
        };
        const document = getFilledDocument(passenger.documents);
        return {
            mandatory: passenger.mandatoryDocuments ? this.getDocumentsMandatory(passenger.mandatoryDocuments, document) : [],
            other: passenger.optionalDocuments ? this.getDocuments(passenger.optionalDocuments) : []
        };
    };

    private getCompanyDescription = (segments: CkiBookingInfo.Segment[]): string => {
        return segments.length > 0 && segments[0].operatingFlightNumber?.company?.description
            ? segments[0].operatingFlightNumber.company.description
            : '';
    };

    private getAirlineName = (bookingInfo: CkiBookingInfo.BookingInfo): string => {
        const { outwardSegments, returnSegments } = bookingInfo;

        return this.getCompanyDescription(outwardSegments) || this.getCompanyDescription(returnSegments);
    };

    private getDataBookingInfo = (passengerId: string) => {
        const { CONTACT_DATA, EMERGENCY_DATA, PRIVACY_STATEMENT } = ApisRequiredFields;
        const bookingInfo: CkiBookingInfo.BookingInfo | null = this.CommonsSessionStorageService.get(
            CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO
        );
        const result: BookingInfoApis = {
            airlineName: '',
            isRequiredContactData: false,
            isRequiredEmergencyInfo: false,
            isPrivacyStatement: false
        };

        if (bookingInfo) {
            const passenger = bookingInfo.passengers.find((passenger) => passenger.id.toString() === passengerId);
            if (Array.isArray(passenger?.requiredInformation)) {
                result.isRequiredContactData = passenger?.requiredInformation.includes(CONTACT_DATA);
                result.isRequiredEmergencyInfo = passenger?.requiredInformation.includes(EMERGENCY_DATA);
                result.isPrivacyStatement = passenger?.requiredInformation.includes(PRIVACY_STATEMENT);
            }
            result.airlineName = this.getAirlineName(bookingInfo);
        }

        return result;
    };

    private getDocumentsMandatory = (data: MandatoryDocument[], document?: Document): DocumentObject[] => {
        let mandatoryDocuments: DocumentObject[] = [];
        data?.forEach((item: MandatoryDocument) => {
            mandatoryDocuments.push(...this.getDocuments(item.documents, document));
        });

        return mandatoryDocuments;
    };

    private getDocuments = (documents: SecurityDocument[], document?: Document): DocumentObject[] =>
        documents?.map(({ type, issuerCountry, number, expiryDate, requiredFields, requiredFieldsOptions, ocr }) => {
            const doc: DocumentObject = {
                type: {
                    code: type?.code,
                    description: type?.description
                },
                country: issuerCountry
                    ? {
                        value: issuerCountry,
                        label: ''
                    }
                    : undefined,
                requiredFields,
                requiredFieldsOptions
            };
            if (document && (document.type as Type).code === (doc.type as ItemList).code) {
                doc.number = document.number ?? number;
                doc.expiryDate = document.expiryDate ?? expiryDate;
                if (document.issuerCountry) {
                    doc.country = {
                        value: (document.issuerCountry as Type).code ?? '',
                        label: (document.issuerCountry as Type).description ?? ''
                    };
                }
            }
            doc.ocr = ocr ?? ('DISABLED' as TypesOCR);
            return doc;
        });

    private isRequiredField = (arrFields: string[] | undefined, field: string): boolean =>
        arrFields?.includes(field) ?? false;
}
