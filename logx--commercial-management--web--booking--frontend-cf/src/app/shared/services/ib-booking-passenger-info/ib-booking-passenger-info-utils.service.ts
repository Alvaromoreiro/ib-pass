import { Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { CommonsBrowserStorageService, downgradeToAJSService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import type { MandatoryDocs, OrderData, SimpleSlice, Slice, TemporalPNR, TravelDocumentsResponse, PassengerCount } from '@core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { DigitalDataService } from '../ib-datalayer/services/ib-digital-data.service';
import { FormGroup } from '@angular/forms';
import { IbBookingFlowDetectionService } from '@core/services/ib-booking-flow-detection.service';


@Injectable({
    providedIn: 'root'
})
export class IbBookingPassengerInfoUtilsService {
    
    constructor (
        private CommonsBrowserStorageService: CommonsBrowserStorageService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DigitalDataService: DigitalDataService, 
        private IbBookingFlowDetectionService: IbBookingFlowDetectionService
    ) { }

    public createTemporalPNRKey (orderData:OrderData){
        const {isRedemption} = this.IbBookingFlowDetectionService.detectFlow();
        if (isRedemption) {                   
            return;
        }
        const commercialData = this.CommonsSessionStorageService.get<CommonsCommercialData>(BkiStorageConstants.COMMERCIAL_DATA);
        let passengers: PassengerCount[] = [];
        const passengerTypesCount: { [key: string]: number } = {};
        orderData.passengers.forEach(passenger => {
            let index =  (passengerTypesCount[passenger.passengerType] );
            if(index === undefined){
                passengerTypesCount[passenger.passengerType] = 0;
                passengerTypesCount[passenger.passengerType] = Object.keys(passengerTypesCount).length -1;

                index = passengerTypesCount[passenger.passengerType];
            }            
            passengers[index]={
                type: passenger.passengerType,
                number: passengers[index]?.number +1 || 1
            };
           
        });
        
        const temporalPNR: TemporalPNR = {
            flightId: orderData.locSurEncrypt,
            price: orderData.order.price,
            passengers: passengers,
            retrieveBkiURL: this.createRetrieveURL(orderData.locSurEncrypt),
            slices: this.createSimpleSlices(orderData.order.slices),
            timeLimitUTC: orderData.order.timeLimit,
            currency: orderData.contextMetadata.currencies[0],
            languages: commercialData.languages.filter(language=>language.code === BookingAppConstants.lang),
            market: commercialData.market
        };
        
        this.addTemporalPNR(temporalPNR);
    }
    
    private createSimpleSlices (slices: Slice[]): SimpleSlice[]{
        const newSlices: SimpleSlice[] = [];
        slices.forEach((slice)=>{
            let newSlice: SimpleSlice = {
                arrivalDateTime: slice.arrivalDateTime,
                departureDateTime: slice.departureDateTime,
                segments:[]
            };
            slice.segments.forEach((segment)=>{
                newSlice.segments.push({
                    arrival: segment.arrival,
                    departure: segment.departure
                });
            });
            newSlices.push(newSlice);
        });
        return newSlices;
    }

    private createRetrieveURL (flightId: string): string{
        let id = 'MANAGE_MY_BOOKING_LOGGED_LINK';
        const generalLinksList = this.CommonsSessionStorageService.get('generalLinksList') || {};
        const link = generalLinksList[id];
        let originPathURL = `${window.location.origin}/${BookingAppConstants.market.toLowerCase()}${link.uri}`;
        return `${originPathURL}#!/chktrp?flightId=${encodeURIComponent(flightId)}`;
    }

    //TODO: Move to IbBookingHeaderNotificationsService
    public addTemporalPNR (data: TemporalPNR) {
        this.CommonsBrowserStorageService.set(BkiStorageConstants.TEMPORAL_PNR, data);
        this.DigitalDataService.emitEvent('create_temporalPNR');
    }
    //TODO: Move to IbBookingHeaderNotificationsService
    public deleteTemporalPNR () {
        this.CommonsBrowserStorageService.remove(BkiStorageConstants.TEMPORAL_PNR);
        this.DigitalDataService.emitEvent('remove_temporalPNR');
    }

    public addTravelDocs (mandatoryDocs: MandatoryDocs[], travelDocuments: TravelDocumentsResponse) {
        const travelDocsMap = BookingAppConstants.TRAVEL_DOCUMENTS_MAP;

        mandatoryDocs.forEach((mandatoryDoc)=>{
            const matchingCodes = travelDocsMap[mandatoryDoc.code] || [];
            const matchingObject = travelDocuments?.documents.find(item =>
                matchingCodes.includes(item.document_type)
            );
            mandatoryDoc.number = matchingObject?.document_number || '';
        });
    }
    public resetStoragedMandatoryDocs (mandatoryDocs: MandatoryDocs[]) {
        mandatoryDocs.forEach((mandatoryDoc)=>{
            mandatoryDoc.number = '';
        });
    }

    public setOptionalDocumentsData (passForm: FormGroup, index: number): any | null {
        const optionalGroup = passForm.get(`optionalDocuments_${index}`);
        const selectedDoc = optionalGroup?.get('selectedDoc')?.value;
        const number = optionalGroup?.get('number')?.value;

        if (selectedDoc?.code && number) {
            return {
                ...selectedDoc,
                number: number
            };
        }
        return null;
    }

    public setOptionalDocumentsStorage (existOptionalDoc: boolean, oldDataPassenger: any, newDataPassenger: any): void {
        const savedOptionalDoc = oldDataPassenger.data.optionalDoc;

        if (!existOptionalDoc || !savedOptionalDoc?.code) {
            return;
        }

        const availableDocs = Object.values(newDataPassenger.optionalDocs || {});
        const isStillAvailable = availableDocs.some((doc: any) => doc.code === savedOptionalDoc.code);

        if (isStillAvailable) {
            newDataPassenger.data.optionalDoc = savedOptionalDoc;
        }
    }

    public setMandatoryDocData (passForm:FormGroup, index:number) {
        return (passForm.get(`mandatoryDoc_${index}`).get('code')?.value !== '' && passForm.get(`mandatoryDoc_${index}`).get('description')?.value !== '') ? 
            passForm.get(`mandatoryDoc_${index}`).value : null;
    }

    public setLargeFamilyDiscountData (passForm: FormGroup, index: number): any | null {
        const communityCode = passForm.get(`communityCode_${index}`)?.value;
        const certificateNumber = passForm.get(`largeFamilyNumber_${index}.code`)?.value;

        if (communityCode?.code && certificateNumber) {
            return {
                communityCode: communityCode,
                largeFamilyCertificateNumber: certificateNumber,
                communityCodePattern: passForm.get(`largeFamilyNumber_${index}.communityCodePattern`)?.value
            };
        }
        return null;
    }

    public setFrequentFlyerData (passForm: FormGroup, index: number): any | null {
        const company = passForm.get(`company_${index}`)?.value;
        const number = passForm.get(`number_card_${index}`)?.value;
        
        if (company?.iataCompanyCode && number) {
            return { company, number };
        }
        return null;
    }
}
downgradeToAJSService('IbBookingPassengerInfoUtilsService', IbBookingPassengerInfoUtilsService, 'ib-booking-services-module');
