import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
interface SetFormValuesFromStorageParams {passengerInfo: any, passengerIndex: number,  formControl:FormGroup<any>, selectPassenger: (selectedPassenger, index)=> void}

// Param objects to reduce primitive obsession
interface PassengerIndexParams { formControl: FormGroup<any>; index: number }
interface DataWithIndexParams extends PassengerIndexParams { data: any }
interface PassengerSelectorParams extends PassengerIndexParams { passengerInfo: any; selectPassengerCallback: (selectedPassenger: any, index: number) => void }
interface ResidentDiscountParams extends PassengerIndexParams { passengerInfo: any; data: any }


@Injectable({providedIn: 'root'})
export class ManageStoredPassengerFormDataService {
    constructor () {}

    private getPreselectedFieldValue = (passengerInfo, fieldKey: string, code: string) => {
        const allValues = passengerInfo?.requiredFields[fieldKey]?.values || [];
        return allValues.find(item => item.code === code);
    };


    private setPassengerSelector = ({ passengerInfo, formControl, index, selectPassengerCallback }: PassengerSelectorParams) => {
   
        const frequentlyPassengers = passengerInfo.frequentlyPassengers ?? [];

        if (!passengerInfo.selectedFrequentlyPassenger || frequentlyPassengers.length === 0) {
            return;
        }
        const control = formControl.get('selectedFrequentlyPassenger');
        const selectedPassenger = frequentlyPassengers.find(
            (freqPassenger) => {
                return freqPassenger.name === passengerInfo.selectedFrequentlyPassenger.name 
                && freqPassenger.surname1 === passengerInfo.selectedFrequentlyPassenger.surname1 
                && freqPassenger.surname2 === passengerInfo.selectedFrequentlyPassenger.surname2;
            });
        if (selectedPassenger) {
            selectedPassenger.isSelected = true;
            selectedPassenger.displayName = passengerInfo.selectedFrequentlyPassenger.displayName;
            control.setValue(selectedPassenger);
            selectPassengerCallback(selectedPassenger, index);
        }
    

    };
    private setPersonalInfoFromStorage = ({ data, formControl, index }: DataWithIndexParams) => {
        data.name && formControl.get([`name_${index}`]).setValue(data.name);
        data.surname && formControl.get([`first_surname_${index}`]).setValue(data.surname);
        data.lastSurname && formControl.get([`last_surname_${index}`]).setValue(data.lastSurname);
        data.gender && formControl.get([`gender_${index}`]).setValue(data.gender);
    };
    private setFrequentyFlyerFromStorage = ({ data, formControl, index }: DataWithIndexParams) =>{
        if(data.freqFlyerInfo){
            formControl.get([`company_${index}`]).setValue(data.freqFlyerInfo.company);
            formControl.get([`number_card_${index}`]).setValue(data.freqFlyerInfo.number);
        } 
        data.freqFlyerSelected && formControl.get([`check_ff_${index}`]).setValue(data.freqFlyerSelected);
    };
    private setOptionalDocumentsFromStorage ({ data, formControl, index }: DataWithIndexParams): void {
        if (!data.optionalDoc) {
            return;
        }
        formControl.get(`check_optional_docs_${index}`)?.setValue(true);
        formControl.get(`optionalDocuments_${index}`)?.patchValue({
            selectedDoc: data.optionalDoc,
            number: data.optionalDoc.number
        });
        
    }
    private setResidentDiscountFromStorage ({ passengerInfo, data, formControl, index }: ResidentDiscountParams): void {
        if (!data.residentDiscountInfo) {
            return;
        }   
        const selectedMunicipality = this.getPreselectedFieldValue(passengerInfo, 'MUNICIPALITY_CODE', data.residentDiscountInfo?.municipalityCode);
        formControl.get([`municipalityCode_${index}`]).setValue(selectedMunicipality);
    }

    private largeFamilyDiscountFromStorage ({ data, formControl, index }: DataWithIndexParams): void {
        if (!data.largeFamilyDiscountInfo) {
            return;
        }
        formControl.get([`communityCode_${index}`]).setValue(data.largeFamilyDiscountInfo.communityCode);
        formControl.get(`largeFamilyNumber_${index}`).get('code').setValue(data.largeFamilyDiscountInfo.largeFamilyCertificateNumber);
        formControl.get(`largeFamilyNumber_${index}`).get('communityCodePattern').setValue(data.largeFamilyDiscountInfo.communityCodePattern);
    }
    private OBNumberFromStorage ({ data, formControl, index }: DataWithIndexParams): void {
        if (!data.OBNumberInfo) {
            return;
        }
        formControl.get([`businessCodeType_${index}`]).setValue(data.OBNumberInfo.businessCodeType);
        formControl.get([`ob_number_card_${index}`]).setValue(data.OBNumberInfo.number);
    }

    private mandatoryDocFromStorage ({ data, formControl, index }: DataWithIndexParams): void {
        if (!data.mandatoryDoc) {
            return;
        }
        formControl.get([`mandatoryDoc_${index}`]).setValue(data.mandatoryDoc);
    }
    private OBNumberSelectedFromStorage ({ data, formControl, index }: DataWithIndexParams): void {
        if (!data.OBNumberSelected) {
            return;
        }
        formControl.get([`check_obn_${index}`]).setValue(data.OBNumberSelected);
    }
    private personInChargeFromStorage ({ data, formControl, index }: DataWithIndexParams): void {
        if (!data.personInCharge) {
            return;
        }
        formControl.get([`personInCharge_${index}`]).setValue(data.personInCharge);
    }




    

    public setFormValuesFromStorage =  ({passengerInfo, passengerIndex, formControl, selectPassenger }: SetFormValuesFromStorageParams) => { 
        const passenger = passengerInfo;
        const data = passenger.data;

        this.setPassengerSelector({ passengerInfo: passenger, formControl, index: passengerIndex, selectPassengerCallback: selectPassenger });
        this.setPersonalInfoFromStorage({ data, formControl, index: passengerIndex });
        this.setFrequentyFlyerFromStorage({ data, formControl, index: passengerIndex });
        this.setOptionalDocumentsFromStorage({ data, formControl, index: passengerIndex });
        this.setResidentDiscountFromStorage({ passengerInfo, data, formControl, index: passengerIndex });
        this.largeFamilyDiscountFromStorage({ data, formControl, index: passengerIndex });
        this.OBNumberFromStorage({ data, formControl, index: passengerIndex });
        this.mandatoryDocFromStorage({ data, formControl, index: passengerIndex });
        this.OBNumberSelectedFromStorage({ data, formControl, index: passengerIndex });
        this.personInChargeFromStorage({ data, formControl, index: passengerIndex });
    };


}