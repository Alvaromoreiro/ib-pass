import { ApisPassengerState } from '../../constants/ib-checkin-apis-constants';
import { PassengerAdditionalInfo } from './services/additional-info-model';
import { PassengerSecurityInfo } from './services/security-model';
import { TravelDocumentType, TypesDocumentsAccepted } from '../travel-documents/travel-documents-model';
import { DocumentModel } from '../travel-documents/travel-documents-cust-cust.model';
import {
    BookingInfoPassenger,
    FormAdditionalInfo,
    FormEmergencyInfo,
    FormPassengerAddress,
    FormRefType,
    FormDataApis,
    FormContactData,
    OnFormReadyType,
    OpenTravelDocumentsModalType
} from 'commercial-management--digital--web-components-design--library';

export interface BookingInfoPassengerExt extends BookingInfoPassenger {
    isUserLogged?: boolean;
}
export interface ApisPassenger extends PassengerSecurityInfo {
    additionalInfo: PassengerAdditionalInfo;
    formStatus: ApisPassengerState;
    passengerBookingInfo: BookingInfoPassengerExt;
}
export type PassengersNOAPIS = {
    id: number;
    status: ApisPassengerState.COMPLETED;
    fullName: string;
    isNOAPI: boolean;
};

export type PassengerAdultChild = 'ADULT' | 'CHILD';
export type PassengerInfant = 'INFANT';

export type EventPassengerStatusChange = { status: ApisPassengerState; id: number; index: number };
export type FormDataChecksAllPassengers = {
    additionalInfo?: FormAdditionalInfo;
    emergencyInfo?: FormEmergencyInfo;
    passengerAddress?: FormPassengerAddress;
};

export type EmitPassengerStatus = {
    status: ApisPassengerState;
    id: number;
    index: number;
    fullName: string;
    showMessage?: boolean;
    message?: string;
};

export type ErrorEstaConstraints = {
    isEstaConstraints?: boolean;
    isEesConstraints?: boolean;
    isEtiasConstraints?: boolean;
    isSeeAgent?: boolean;
    message?: string;
};

export type ApisFormModel = {
    passengerId: number | string;
    hashInit: string;
    hashEnd: string;
    formRef: FormRefType;
    state: 'pending' | 'candidate' | 'validated' | 'validatedWithErrors';
    model?: FormDataApis;
    initialCheckModel?: InitialCheckModel;
};

export type InitialCheckModel = {
    contactData: FormContactData;
    passengerAddress?: FormPassengerAddress;
};

export type ApisFormDataModel = {
    id: string | number;
    model: FormDataApis;
    formRef: FormRefType;
};

export type GetApisFormProps = {
    passenger: ApisPassenger;
    onSubmitApisForm: any;
    isMultiPassengers: boolean;
    showTravelDocumentsLink?: ShowTravelDocumentsLinkType;
    onFormReady: OnFormReadyType;
    onSubmitError: () => void;
    openTravelDocumentsModal: OpenTravelDocumentsModalType;
};

export type UpdateApisInfoModel = {
    formData: FormDataApis;
    id: string;
};

export type BookingInfoApis = {
    airlineName: string;
    isRequiredContactData: boolean;
    isRequiredEmergencyInfo: boolean;
    isPrivacyStatement: boolean;
};

export type TravelDocumentModel = {
    documentsUserLogged: DocumentModel[];
    validTypesDocsSecurity: TravelDocumentType[];
    loggedPassengerId: string | null;
    otherPassengerId?: string;
    documentSelected: DocumentModel[];
    documentsUpdate: DocumentModel[];
    showTravelDocumentsLink?: ShowTravelDocumentsLinkType;
    isInfant: boolean;
};

export type ShowTravelDocumentsLinkType = {
    showVisa: boolean;
    showBasicInfo: boolean;
};

export type SectionToScroll = 'basic-info' | 'visa';

export type PassengerStatusChangeType = {
    status: ApisPassengerState;
    id: number;
    index: number;
};

export type ShowModalCheckinNotAvailableType = {
    passenger: EmitPassengerStatus;
    isGlobalSubmit: boolean;
};

export type CallUpdateApisInfoType = {
    model: UpdateApisInfoModel[];
    isUpdateAll?: boolean;
};

export type GetPassengerStatusType = {
    allDocs: boolean;
    someDocs: boolean;
};

export type ApisFormErrorsType = {
    id: number;
    errors: any[];
};

export interface ScrollToPassenger {
    id: string | number;
    section?: SectionToScroll;
}

export interface IFilterTypesDocsSecurity {
    loggedPassengerId: string;
    validTypesDocs: TravelDocumentType[];
    showTravelDocumentsLink: ShowTravelDocumentsLinkType;
}
export interface IHandleTravelDocumentsModal {
    passengerId: string;
    validTypesDocs: TypesDocumentsAccepted[];
    isInfant: boolean;
}

export interface IGetUniqueDocumentTypes {
    validTypesDocs: TravelDocumentType[];
    showTravelDocumentsLink: ShowTravelDocumentsLinkType;
}

export interface IApisFormErrorsGeneral {
    data: IApisFormErrorsGeneralData;
}

interface IApisFormErrorsGeneralData {
    errors: IApisFormErrorsGeneralErrors[];
}

export interface IApisFormErrorsGeneralErrors {
    code: string;
    reason: string;
    passengerId: string;
    timeStamp: string;
    uuid: string;
}
