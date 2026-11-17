import { Inject, Injectable } from '@angular/core';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import {
    ApisFormProps,
    ModelApisForm,
    FormDataApis,
    FormEmergencyInfo,
    ModelEmergencyInfo,
    FormAdditionalInfo,
    ModelAdditionalInfo,
    FormPassengerAddress,
    ModelPassengerAddress
} from 'commercial-management--digital--web-components-design--library';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCheckinApisModelTransformerService } from '../../../transformers/ib-checkin-apis-model-transformer.service';
import {
    FormDataChecksAllPassengers,
    GetApisFormProps
} from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import {
    AJSDatalayerUtilsService,
    AJSDatalayerUtilsServiceType
} from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { IbTravelDocumentsTransformerService } from '@shared/services/ib-apis/transformers/ib-travel-documents-transformers.service';
import { DocumentModel } from '@src/app/core/models/travel-documents/travel-documents-cust-cust.model';

@Injectable({ providedIn: 'root' })
export class IbCheckinApisFormService {
    constructor (
        @Inject(AJSRootScope) private $rootScope,
        private ApisModelTransformerService: IbCheckinApisModelTransformerService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSDatalayerUtilsService) private CkiDatalayerUtilsService: AJSDatalayerUtilsServiceType,
        private IbTravelDocumentsTransformerService: IbTravelDocumentsTransformerService
    ) {}

    getApisFormProps ({
        passenger,
        onSubmitApisForm,
        isMultiPassengers,
        onFormReady,
        onSubmitError,
        openTravelDocumentsModal
    }: GetApisFormProps): ApisFormProps {
        const envCopy: any = { ...(window as any).env };
        const apisInfo: any = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.APIS_INFO);
        const { countries = [], prefixList = [], states = [] } = apisInfo || {};

        return {
            id: passenger.id.toString(),
            listNationalities: countries,
            listCountries: countries,
            countryCodes: prefixList,
            listStates: states,
            market: this.$rootScope.appMarket,
            model: this.ApisModelTransformerService.setApisFormModel(passenger),
            onSubmit: onSubmitApisForm,
            isMultiPassengers,
            ocrLicense: envCopy.licenseDevSDKRegula ?? undefined,
            toggleOcrEnable: CheckinAppConstants.TOGGLE.ocrEnable,
            updateDatalayerEvent: this.CkiDatalayerUtilsService.updateDatalayerEvent,
            onFormReady,
            onSubmitError,
            openTravelDocumentsModal
        };
    }

    transformerCheckAllPassengers (formData: FormDataChecksAllPassengers, props: ApisFormProps) {
        const model = props?.model;

        if (!model) return props;

        this.updateContactData(model.contactData, formData);
        this.updatePassengerAddress(model, formData.passengerAddress);

        return props;
    }

    private updateContactData (contactData, formData) {
        contactData.additionalInfo = this.getUpdatedInfo(
            formData?.additionalInfo,
            contactData.additionalInfo,
            this.getAdditionalInfo
        );
        contactData.emergencyInfo = this.getUpdatedInfo(
            formData?.emergencyInfo,
            contactData.emergencyInfo,
            this.getEmergencyInfo
        );
    }

    private updatePassengerAddress (model, passengerAddress) {
        model.passengerAddress = passengerAddress
            ? this.getPassengerAddress(passengerAddress, model.passengerAddress)
            : model.passengerAddress;
    }

    private getUpdatedInfo (formValue, existingValue, updateFunction) {
        return formValue ? updateFunction(formValue, existingValue) : existingValue;
    }

    private getAdditionalInfo (
        additionalInfo: FormAdditionalInfo,
        modelAdditionalInfo: ModelAdditionalInfo
    ): ModelAdditionalInfo {
        const { email, phone, number } = additionalInfo;
        modelAdditionalInfo.checkInfoAll = true;
        modelAdditionalInfo.email.value = email;
        modelAdditionalInfo.number.value = number;
        modelAdditionalInfo.phone.value = phone.value;
        return modelAdditionalInfo;
    }

    private getEmergencyInfo (
        emergencyInfo: FormEmergencyInfo,
        modelEmergencyInfo: ModelEmergencyInfo
    ): ModelEmergencyInfo {
        const { name, phone, number } = emergencyInfo;
        modelEmergencyInfo.checkEmergencyAll = true;
        modelEmergencyInfo.name.value = name;
        modelEmergencyInfo.number.value = number;
        modelEmergencyInfo.phone.value = phone.value;
        return modelEmergencyInfo;
    }

    private getPassengerAddress (
        passengerAddress: FormPassengerAddress,
        modelPassengerAddress: ModelPassengerAddress
    ): ModelPassengerAddress {
        const { address, zipCode, city, state } = passengerAddress;
        modelPassengerAddress.checkAddressForAll = true;
        modelPassengerAddress.address.value = address;
        modelPassengerAddress.zipCode.value = zipCode;
        modelPassengerAddress.city.value = city;
        modelPassengerAddress.state.value = state.value;
        return modelPassengerAddress;
    }

    updateTravelDocument (
        model: ModelApisForm,
        documents: DocumentModel[],
        isInfant: boolean,
        currentFormModel: FormDataApis
    ): ModelApisForm | null {
        const updatModel = this.IbTravelDocumentsTransformerService.updateTravelDocumentTransform(
            model,
            documents,
            isInfant,
            currentFormModel
        );
        return updatModel;
    }
}
