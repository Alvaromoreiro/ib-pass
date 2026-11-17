import { Inject, Injectable } from '@angular/core';
import { DigitaDataValues, DigitalDataConstants, DigitalDataInfo, DigitalDataQuadrigam } from '@src/app/core/constants/ib-digital-data-constants';
import { EventType, HandleEventsTravelDocuemnts } from '@src/app/core/models/generic-models/ib-digital-data.models';
import { CkiDatalayerConstants } from '@src/app/shared/services/ib-datalayer/ib-cki-datalayer-constants';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { AJSDigitalDataService, AJSDigitalDataServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-cki-digital-data-service-bridge.service';

@Injectable({providedIn: 'root'})
export class IbCheckinApisDigitalDataService {
    constructor (
        @Inject(AJSDigitalDataService) private DigitalDataService: AJSDigitalDataServiceType,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType
    ) { }

    addDigitalDataInfo = ( digital_data ): void => {
        this.DigitalDataService.addDigitalDataInfo( digital_data );
    };

    setApisProcessAndStep = (quadrigam = DigitalDataQuadrigam.APIS): void => {
        this.DatalayerUtilsService.setTrackingCode(quadrigam);
    };

    updateApisDigitalData = (): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedObject = {};
        extendedObject[CkiDatalayerConstants.DATALAYER_INFO.APIS_FULFILLED] = DigitaDataValues.YES;
        this.DatalayerUtilsService.addDataLayerInfo(extendedObject);
        /* FIN DELETE GA4 MIGRATION*/
        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[DigitalDataInfo.APIS_COMPLETED] = DigitaDataValues.YES;
        this.DatalayerUtilsService.addDigitalDataInfo(extendedDigitalDataInfo);
        const event: EventType = CkiDatalayerConstants.APIS.COMPLETED;
        this.DatalayerUtilsService.updateDatalayerEvent(event.eventCategory, event.eventAction, event.eventLabel, event.eventName);
    };

    getDigitalDataProcess = (): string => {
        const digital_data = this.DigitalDataService.getDigitalData();
        if ( digital_data == null ) return;
        return digital_data[ DigitalDataConstants.PROCESS ];
    };

    /**
     * Handle events send data to flow Travel Documents
     * @param {object} HandleEventsTravelDocuemnts 
     */
    handleEventsTravelDocuemnts = ({docs = [], notUseSavedDocuments = false, validTypesDocs = []}: HandleEventsTravelDocuemnts) => {
        const {ONLY_CLICK_BTN_CONTINUE, SELECTED_NOT_USE_DOCUMENTS, SELECTED_SOME_DOCUMENTS, USE_SAVED_DOCUMENTS} = CkiDatalayerConstants.TRAVEL_DOCUMENTS;
        const selectedDocs = docs.length > 0;
        const existValidTypesDocs = validTypesDocs.length > 0;
        let event: EventType = ONLY_CLICK_BTN_CONTINUE;

        if (selectedDocs) {
            event = SELECTED_SOME_DOCUMENTS;
        } else if (existValidTypesDocs) {
            event = USE_SAVED_DOCUMENTS;
        } else if (notUseSavedDocuments) {
            event = SELECTED_NOT_USE_DOCUMENTS;
        }

        this.DatalayerUtilsService.updateDatalayerEvent(event.eventCategory, event.eventAction, event.eventLabel, event.eventName);
    };

    initApisDatalayer = () => {
        this.setApisProcessAndStep();
        this.DigitalDataService.emitViewEvent();
    };
}
