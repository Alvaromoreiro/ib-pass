import { Inject, Injectable } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCheckinApisHttpTransformerService } from '../transformers/ib-checkin-apis-http-transformer.service';
import { AJSPassengerAdditionalInfoService, AJSPassengerAdditionalInfoServiceType } from '@src/app/shared/services/ib-apis/ib-passenger-additional-info-service-bridge.service';
import { AJSCallApisFormService, AJSCallApisFormServiceType } from '@src/app/shared/services/ib-apis/ib-call-apis-form-service-bridge.service';
import { AJSModalService, AJSModalServiceType } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { SecurityResponse } from '@src/app/core/models/ib-checkin-apis/services/security-model';
import { AdditonalInfoBody, PassengerAdditionalInfo } from '@src/app/core/models/ib-checkin-apis/services/additional-info-model';
import { ApisPassengerState, ApisStatesCountries, errorApisTypesESTA, errorApisTypes, ApisAllErrorType, ApisRequiredFields } from '@src/app/core/constants/ib-checkin-apis-constants';
import { ApisFormDataModel, ApisFormModel, ApisPassenger, BookingInfoPassengerExt, ErrorEstaConstraints, FormDataChecksAllPassengers, IApisFormErrorsGeneral, IApisFormErrorsGeneralErrors, IFilterTypesDocsSecurity, InitialCheckModel, ShowTravelDocumentsLinkType, UpdateApisInfoModel } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import { AJSGetCountriesListService, AJSGetCountriesListServiceType } from '@src/app/shared/services/ib-apis/ib-get-countries-list-service-bridge.service';
import { AJSGetPhoneCodesService, AJSGetPhoneCodesServiceType } from '@src/app/shared/services/ib-apis/ib-get-phone-codes-service-bridge.service';
import { AJSGetStatesListService, AJSGetStatesListServiceType } from '@src/app/shared/services/ib-apis/ib-get-states-list-service-bridge.service';
import { AJSGetCKICachedInformationServiceToken, AJSGetCKICachedInformationServiceType } from '@src/app/shared/http-services/pac-prm/bridges/ib-get-cached-information-bridge.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import dayjs from 'dayjs';
import { CkiDatalayerConstants } from '@src/app/shared/services/ib-datalayer/ib-cki-datalayer-constants';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { sortObject } from '@src/app/shared/utils/sort-object';
import { TravelDocumentType } from '@src/app/core/models/travel-documents/travel-documents-model';
import { Document, DocumentModel, filterDocumentsByType, mapDocuments, partitionByIssues } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';
import { AJSTravelInfoService, AJSTravelInfoServiceType } from '@src/app/shared/services/ib-apis/ib-travel-info-service-bridge.service';
import { FormDataApis, FormRefType, TravelDocumentModalProps } from 'commercial-management--digital--web-components-design--library';

@Injectable({ providedIn: 'root' })
export class IbCheckinApisService {
    private checksAllPassengersSubject: BehaviorSubject<FormDataChecksAllPassengers>;
    private formDataApisModelSubject: BehaviorSubject<ApisFormDataModel[]>;
    public readonly checkAllPassengers$: Observable<FormDataChecksAllPassengers>;
    public readonly formDataApisModel$: Observable<ApisFormDataModel[]>;

    private apisFormErrorsSubject: BehaviorSubject<Map<string, any>>;
    private blockFormSubject: BehaviorSubject<Map<string, boolean>>;

    appMarket = this.$rootScope.appMarket;
    appLang = this.$rootScope.appLang;

    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(AJSModalService) private ModalService: AJSModalServiceType,
        @Inject(AJSPassengerAdditionalInfoService) private PassengerAdditionalInfoService: AJSPassengerAdditionalInfoServiceType,
        @Inject(AJSCallApisFormService) private CallApisFormService: AJSCallApisFormServiceType,
        @Inject(AJSGetCountriesListService) private GetCountriesListService: AJSGetCountriesListServiceType,
        @Inject(AJSGetPhoneCodesService) private GetPhoneCodesService: AJSGetPhoneCodesServiceType,
        @Inject(AJSGetStatesListService) private GetStatesListService: AJSGetStatesListServiceType,
        @Inject(AJSGetCKICachedInformationServiceToken) private GetCKICachedInformationService: AJSGetCKICachedInformationServiceType,
        @Inject(AJSDatalayerUtilsService) private CkiDatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private ApisHttpTransformerService: IbCheckinApisHttpTransformerService,
        private IbCheckinRedirectionUtilsService: IbCheckinRedirectionUtilsService,
        @Inject(AJSTravelInfoService) private TravelInfoService: AJSTravelInfoServiceType
    ) {
        this.checksAllPassengersSubject = new BehaviorSubject<FormDataChecksAllPassengers>({});
        this.formDataApisModelSubject = new BehaviorSubject<ApisFormDataModel[]>([]);
        this.formDataApisModel$ = this.formDataApisModelSubject.asObservable();
        this.checkAllPassengers$ = this.checksAllPassengersSubject.asObservable().pipe(filter((data) => data !== null && data !== undefined && Object.keys(data).length > 0));

        this.apisFormErrorsSubject = new BehaviorSubject<Map<string, any>>(new Map());
        this.blockFormSubject = new BehaviorSubject<Map<string, boolean>>(new Map());
    }

    setCheckAllPassengersData (data: FormDataChecksAllPassengers) {
        this.checksAllPassengersSubject.next(data);
    }

    existCheckAllPassengersData () {
        const checkAllPassengerData = this.checksAllPassengersSubject.getValue();
        return Boolean(checkAllPassengerData?.additionalInfo || checkAllPassengerData?.emergencyInfo || checkAllPassengerData?.passengerAddress);
    }

    get getCheckAllPassengersData () {
        return this.checksAllPassengersSubject.asObservable().pipe(filter((data) => data !== null && data !== undefined && Object.keys(data).length > 0));
    }

    resetCheckAllPassengersData () {
        this.checksAllPassengersSubject.next(null);
    }

    async getApisInfo (): Promise<ApisPassenger[]> {
        const bookingInfo: CkiBookingInfo.BookingInfo | null = this.CommonsSessionStorageService.get(
            CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO
        );
        const ffUser: CkiBookingInfo.FrequentFlyer | string | null = this.CommonsSessionStorageService.get(
            CheckinAppConstants.STORAGE_KEYS.FF_USER
        );
        const apisPassengersIds = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.PASSENGERS_APIS);
        try {
            this.CommonsSessionStorageService.remove('countriesList');
            this.CommonsSessionStorageService.remove('phoneCodeList');
            const [countries, prefixList, states] = await Promise.all([
                this.GetCountriesListService.getCountriesList(null, null, true),
                this.GetPhoneCodesService.getPhoneCodesList(),
                this.GetStatesListService.getStatesList(ApisStatesCountries.US)
            ]);
            this.CommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.APIS_INFO, {
                countries: countries,
                prefixList: prefixList,
                states: states
            });
            const securityResponse: SecurityResponse = await this.CallApisFormService.getApisInfo(apisPassengersIds);
            const additionalInfoResponse: AdditonalInfoBody = await this.PassengerAdditionalInfoService.getAdditionalInfo(apisPassengersIds);
            const apisPassengers: ApisPassenger[] = securityResponse.passengersSecurityInformation.map((securityPassenger) => ({
                ...securityPassenger,
                additionalInfo: additionalInfoResponse.find((additionalInfoPassenger) => securityPassenger.id.toString() === additionalInfoPassenger.id.toString()),
                formStatus: ApisPassengerState.PENDING,
                passengerBookingInfo: this.getPassengerBookingInfo(securityPassenger.id.toString(), bookingInfo, ffUser)
            }));
            //this.ModalService.isNotWaiting();

            return apisPassengers;
        } catch (error) {
            this.handleUpdateApisError(error);
        }
    }

    checkCasesConstraints (cachedBookingInfo, id): {id: string, errors: ErrorEstaConstraints} | undefined {
        const passengers = cachedBookingInfo?.passengers;
        const infoPassenger = this.findPassengerConstraints(passengers, id);
        const errorEstaConstraints: ErrorEstaConstraints = this.initializeErrorConstraints();
        let existEstaConstraints = this.checkConstraints(infoPassenger, errorEstaConstraints);

        return existEstaConstraints ? { id, errors: errorEstaConstraints } : undefined;
    }

    private findPassengerConstraints (passengers, id) {
        return passengers?.find((passenger) => {
            return passenger.id == id && passenger.status?.code === CheckinAppConstants.GENERAL_PASSENGERS_STATUS.NOT_ALLOWED;
        });
    }

    private initializeErrorConstraints (): ErrorEstaConstraints {
        return {
            isEstaConstraints: false,
            isEesConstraints: false,
            isEtiasConstraints: false,
            isSeeAgent: false
        };
    }

    private checkConstraints (infoPassenger, errorEstaConstraints: ErrorEstaConstraints): boolean {
        let existEstaConstraints = false;

        if (infoPassenger?.status?.reason?.code.includes(CheckinAppConstants.GENERAL_PASSENGERS_STATUS.ESTA_CONSTRAINTS)) {
            errorEstaConstraints.isEstaConstraints = true;
            existEstaConstraints = true;
        }

        if (infoPassenger?.status?.reason?.code.includes(CheckinAppConstants.GENERAL_PASSENGERS_STATUS.EES_CONSTRAINTS)) {
            errorEstaConstraints.isEesConstraints = true;
            errorEstaConstraints.message = infoPassenger?.status?.reason?.message;
            existEstaConstraints = true;
        }

        if (infoPassenger?.status?.reason?.code.includes(CheckinAppConstants.GENERAL_PASSENGERS_STATUS.ETIAS_CONSTRAINTS)) {
            errorEstaConstraints.isEtiasConstraints = true;
            errorEstaConstraints.message = infoPassenger?.status?.reason?.message;
            existEstaConstraints = true;
        }

        return existEstaConstraints;
    }

    private throwError (error: any) {
        this.ModalService.showGenericError({ message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true }, true);
        throw error;
    }

    private hasErrors (errors: unknown): boolean {
        return Array.isArray(errors) && errors.length > 0;
    }

    private hasDataErrors (error: any): boolean {
        return (
            this.hasErrors(error?.data?.[0]?.errors) ||
            this.hasErrors(error?.data?.errors)
        );
    }

    private isErrorTimatic (dataErrors: any[]): boolean {
        const existErrorTimatic = dataErrors.length === 1 && errorApisTypes.includes(dataErrors[0]?.code);
        if (dataErrors[0]?.code === ApisAllErrorType.TM_VISA_REQUIRED) {
            const event = CkiDatalayerConstants.APIS.TM_VISA_REQUIRED;
            this.CkiDatalayerUtilsService.updateDatalayerEvent(event.eventCategory, event.eventAction, event.eventLabel, event.eventName);
        }

        return existErrorTimatic;
    }

    private isErrorEsta (dataErrors: any[]): boolean {
        const isSingleError = dataErrors.length === 1 && errorApisTypesESTA.includes(dataErrors[0]?.code);
        const isMultiErrors = dataErrors.length > 1;

        if (dataErrors.length > 0) {
            dataErrors.forEach((error) => {
                if (error.code === ApisAllErrorType.TM_RETURN_TICKET_REQUIRED) {
                    const event = CkiDatalayerConstants.APIS.TM_RETURN_TICKET_REQUIRED;
                    this.CkiDatalayerUtilsService.updateDatalayerEvent(event.eventCategory, event.eventAction, event.eventLabel, event.eventName);
                    return;
                }
            });
        }
        return isSingleError || isMultiErrors;
    }

    private controlErrors (error: any) {
        this.checkConstraintErrors(error);
        this.checkDataErrors(error);
        this.throwError(error);
    }

    private buildErrorEstaConstraints (errors: any): ErrorEstaConstraints {
        return {
            isEstaConstraints: !!errors?.isEstaConstraints,
            isEesConstraints: !!errors?.isEesConstraints,
            isEtiasConstraints: !!errors?.isEtiasConstraints,
            isSeeAgent: errors?.internalErrorCode === 'TRM_APIM_9038',
            message: errors?.message || ''
        };
    }

    private hasRelevantConstraints (constraints: ErrorEstaConstraints): boolean {
        return (
            constraints.isEstaConstraints ||
            constraints.isEesConstraints ||
            constraints.isEtiasConstraints ||
            constraints.isSeeAgent
        );
    }

    private checkConstraintErrors (error: any): void {
        if (!Array.isArray(error)) return;

        const errorConstraints = error
            .map(({ errors, id }) => {
                const constraints = this.buildErrorEstaConstraints(errors);
                if (this.hasRelevantConstraints(constraints)) {
                    return { id, errors: constraints };
                }
                return null;
            })
            .filter(Boolean);

        if (errorConstraints.length > 0) {
            throw errorConstraints;
        }
    }

    private buildDataError (id: any, errors: any): { id: any; errors: any } | undefined {
        if (this.isErrorTimatic(errors)) {
            return { id, errors };
        }

        if (this.isErrorEsta(errors)) {
            return {
                id,
                errors: {
                    isEstaConstraints: true,
                    isEesConstraints: false,
                    isEtiasConstraints: false,
                    message: '',
                    isSeeAgent: false
                }
            };
        }

        return undefined;
    }

    private checkDataErrors (error: any): void {
        if (!this.hasDataErrors(error)) return;

        if (!Array.isArray(error.data)) {
            const validCodes = ['TRM_APIM_9040'];
            const typedError = error as IApisFormErrorsGeneral;

            const isValidErrorCode = typedError.data.errors.some(err => validCodes.includes(err.code));

            if (!isValidErrorCode) return;

            const { errors } = typedError.data;

            const dataErrors = errors.map((error) => this.buildSpecialDataError(error));

            throw dataErrors;
        }

        const dataErrors = error.data
            .map(({ id, errors }) => this.buildDataError(id, errors))
            .filter(Boolean);

        if (dataErrors.length === error.data.length) {
            throw dataErrors;
        }
    }

    async updateApisInfo (formApis: UpdateApisInfoModel[], updateModel: boolean = false, requiredFields: ApisRequiredFields[]) {
        try {
            await this.updateAdditionalInfo(formApis);
            await this.updateSecurityInfo(formApis, requiredFields);
            const newBookingInfo = await this.getCachedInformation() as CkiBookingInfo.BookingInfo;

            updateModel && this.updateModelForAllPassengers(formApis[0].formData);
            this.CommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO, newBookingInfo);
            const errorsConstraints = [];
            for (const pass of formApis) {
                const errorConstraints = this.checkCasesConstraints(newBookingInfo, pass.id);
                if (errorConstraints) errorsConstraints.push(errorConstraints);
            }
            if (errorsConstraints.length > 0) throw errorsConstraints;
        } catch (error: any) {
            this.controlErrors(error);
        } finally {
            this.$rootScope.timeSession.startTime = dayjs();
        }
    }

    updateModelForAllPassengers ({ contactData, passengerAddress }: FormDataApis) {
        const dataChecksAllPassengers: FormDataChecksAllPassengers = {};
        if (contactData) {
            const { additionalInfo, emergencyInfo } = contactData;
            // update additionInfo for all passengers
            if (additionalInfo?.checkInfoAll) {
                dataChecksAllPassengers.additionalInfo = additionalInfo;
            }

            // update emergencyInfo for all passengers
            if (emergencyInfo?.checkEmergencyAll) {
                dataChecksAllPassengers.emergencyInfo = emergencyInfo;
            }
        }

        if (passengerAddress?.checkAddressForAll) {
            dataChecksAllPassengers.passengerAddress = passengerAddress;
        }
        this.setCheckAllPassengersData(dataChecksAllPassengers);
    }

    handleUpdateApisError (error) {
        this.ModalService.setErrorMessage(error.message);
        this.ModalService.setErrorCode(error.internalErrorCode);
        this.ModalService.isError(error);
    }

    async updateAdditionalInfo (model: UpdateApisInfoModel[]) {
        const isUserLogged = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.USER_LOGGED);
        const additionalInfoModel = this.ApisHttpTransformerService.generateAdditionalInfoRequest(model);
        await this.PassengerAdditionalInfoService.updateAdditionalInfo(additionalInfoModel);
        this.updateDisruptionContactApisStorage(additionalInfoModel);
        //if (!isUserLogged) this.NewslettersService.putNewsletters(this.ApisHttpTransformerService.generateNewsLetterInfo(model));
    }

    async updateSecurityInfo (model: UpdateApisInfoModel[], requiredFields: ApisRequiredFields[]) {
        await this.CallApisFormService.updateApisInfo(this.ApisHttpTransformerService.generateSecurityRequest(model, requiredFields));
    }

    async getCachedInformation () {
        return await this.GetCKICachedInformationService.getCachedInformation();
    }

    getPassengerBookingInfo (id: string, bookingInfo: CkiBookingInfo.BookingInfo | null, ffUser: CkiBookingInfo.FrequentFlyer | string | null) {
        const passengerInfo: BookingInfoPassengerExt = { id, name: '', surname: '', isPrivacyStatement: false, isUserLogged: false };
        if (Array.isArray(bookingInfo?.passengers)) {
            const passengers = bookingInfo.passengers;
            const passenger = passengers.find((pass) => pass.id.toString() === id);
            passengerInfo.name = passenger.name ?? '';
            passengerInfo.surname = passenger.surname ?? '';
            passengerInfo.isPrivacyStatement = passenger?.requiredInformation?.includes(CheckinAppConstants.PASSENGER_DATA_OPTIONS.PRIVACY_STATEMENT);
            passengerInfo.isUserLogged = this.searchPassengerFF(passenger, ffUser);
            if (passenger.infant?.name && passenger.infant?.surname) passengerInfo.infant = { name: passenger.infant.name, surname: passenger.infant.surname };
        }

        return passengerInfo;
    }

    redirectToCheckin (path: string) {
        this.IbCheckinRedirectionUtilsService.path(path);
    }

    setFormDataApisModel (data: FormDataApis, formRef: FormRefType, id: number | string) {
        const currentData = this.formDataApisModelSubject.getValue();
        this.formDataApisModelSubject.next([...currentData, { id, formRef, model: data }]);
    }

    resetFormDataApisModel () {
        this.formDataApisModelSubject.next([]);
    }

    private async waitForFormDataApisModel (count: number = 1): Promise<ApisFormDataModel[]> {
        return firstValueFrom(
            this.formDataApisModel$.pipe(
                filter(data => data.length === count)
            )
        );
    }

    async getFormDataApisModel (length = 1) {
        this.resetFormDataApisModel();
        const formDataApisModel = await this.waitForFormDataApisModel(length);
        const result = await Promise.all(formDataApisModel.map(async ({ formRef, model, id }): Promise<ApisFormModel> => {
            const hash = await this.createFormDataApisModelHash(model);
            const initialCheckModel: InitialCheckModel = { contactData: model.contactData, passengerAddress: model.passengerAddress };

            return {
                passengerId: id,
                hashInit: hash,
                initialCheckModel,
                hashEnd: hash,
                formRef,
                state: 'pending'
            };
        }));

        return result;
    }

    async createFormDataApisModelHash (model: FormDataApis): Promise<string> {
        const modelSorted = sortObject(model);
        const serialized = JSON.stringify(modelSorted);
        const encoder = new TextEncoder();
        const data = encoder.encode(serialized);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    setApisFormError (userId: string, error: any) {
        const currentErrors = this.apisFormErrorsSubject.value;
        const newErrors = new Map(currentErrors);
        newErrors.set(userId, error);
        this.apisFormErrorsSubject.next(newErrors);
    }

    getApisFormErrors (userId: string): Observable<any> {
        return this.apisFormErrorsSubject.pipe(
            map(errors => errors.get(userId)),
            distinctUntilChanged()
        );
    }

    clearApisFormError (userId: string) {
        const currentErrors = this.apisFormErrorsSubject.value;
        const newErrors = new Map(currentErrors);
        newErrors.delete(userId);
        this.apisFormErrorsSubject.next(newErrors);
    }

    setBlockForm (userId: string, state: boolean) {
        const currentBlockForm = this.blockFormSubject.value;
        const newBlockForm = new Map(currentBlockForm);
        newBlockForm.set(userId, state);
        this.blockFormSubject.next(newBlockForm);
    }

    getBlockForm (userId: string): Observable<any> {
        return this.blockFormSubject.pipe(
            map(blockForm => blockForm.get(userId)),
            distinctUntilChanged()
        );
    }

    resetBlockForm () {
        this.blockFormSubject.next(new Map());
    }

    async getTravelDocuments (validTypesDocsSecurity: string[]): Promise<{documents: DocumentModel[], documentsTypesValid: TravelDocumentType[]}> {
        const result = {documents: [], documentsTypesValid: []};

        try {
            const response = await this.TravelInfoService.getTravelInfo() as Document[];
            
            if (response.length === 0) {
                return result;
            }

            const documents = mapDocuments(response);
            const { valid } = partitionByIssues(documents);
            const { filtered, typesValid } = filterDocumentsByType(valid, validTypesDocsSecurity);

            return {documents: filtered, documentsTypesValid: typesValid};
        } catch (error) {
            //console.error('getTravelDocuments error', { error, locale });
            return result;
        }
    }

    getInfoTravelDocuments (documents: DocumentModel[], validTypes?: TravelDocumentType[]): DocumentModel[] {
        const documentsInfo = this.ApisHttpTransformerService.transformTravelDocumentsToInfo(documents, validTypes);
        return documentsInfo ?? [];
    }

    filterTypesDocsSecurity (userLogged: boolean, passengers: ApisPassenger[]): IFilterTypesDocsSecurity {
        const showTravelDocumentsLink: ShowTravelDocumentsLinkType = {
            showVisa: false,
            showBasicInfo: false
        };
        let validTypesDocs: TravelDocumentType[] = [];
        let loggedPassengerId: string | null = null;
        if (userLogged) {
            for (let i = 0; i < passengers.length; i++) {
                const passenger = passengers[i];
                const data = this.ApisHttpTransformerService.getUniqueDocumentTypes(passenger);
                if (data.showTravelDocumentsLink.showBasicInfo) showTravelDocumentsLink.showBasicInfo = true;
                if (data.showTravelDocumentsLink.showVisa) showTravelDocumentsLink.showVisa = true;
                if (passenger.passengerBookingInfo.isUserLogged) {
                    loggedPassengerId = passenger.id.toString(),
                    validTypesDocs = data.validTypesDocs;
                }
            }
        }

        return {
            loggedPassengerId,
            validTypesDocs,
            showTravelDocumentsLink
        };
    }

    getTravelDocumentsModalProps (documentsUserLogged: DocumentModel[], validTypes?: TravelDocumentType[]): Partial<TravelDocumentModalProps> {
        return {
            open: true,
            documents: this.getInfoTravelDocuments(documentsUserLogged, validTypes) ?? []
        };
    }

    private searchPassengerFF (passenger: CkiBookingInfo.Passenger, ffUser: CkiBookingInfo.FrequentFlyer | string | null): boolean {
        if (!ffUser) return false;

        const ffNumber = typeof ffUser === 'string' ? ffUser : ffUser.number;

        return Number(passenger?.frequentFlyer?.number) === Number(ffNumber);
    }

    private buildSpecialDataError (error: IApisFormErrorsGeneralErrors) {
        const { passengerId, code, reason } = error;

        return {
            id: passengerId,
            errors: [{
                code,
                description: reason
            }]
        };
    }

    private updateDisruptionContactApisStorage (additionalInfoModel: PassengerAdditionalInfo[]) {
        const originalDisruptionContactApis: PassengerAdditionalInfo[] = structuredClone(this.CommonsSessionStorageService.get('disruptionContactApis'));

        const updatesMap = new Map(additionalInfoModel.map(item => [item.id, item]));

        const updatedDisruptionContactApis = originalDisruptionContactApis.map(item => {
            const update = updatesMap.get(item.id.toString());
            return update ? update : item;
        });

        this.CommonsSessionStorageService.set('disruptionContactApis', updatedDisruptionContactApis);
    }
}
