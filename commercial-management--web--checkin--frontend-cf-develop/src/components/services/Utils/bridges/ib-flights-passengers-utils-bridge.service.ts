import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSFlightsPassengersUtilsServiceToken = new InjectionToken<any> ('FlightsPassengersUtils');
export const AJSFlightsPassengersUtilsServiceTokenProvider = upgradeAJSServiceProvider( 'FlightsPassengersUtils', AJSFlightsPassengersUtilsServiceToken );

export interface CkeckApisUsTracingType {
    show: boolean;
    CHECK_US_PRIVACY_ACT_STATEMENT: string;
    checkPrivacyText: string;
}

export interface FlightsPassengersUtilsServiceType {
    getGeneralSegmentInfo: (generalPassengersInfo, segmentInfo, type) => any;
    getDetailedSegmentInfo: (segmentInfo, segmentStatus) => any;
    getPassengerInfo: ( passenger, areAllSegmentChecked, additionalInfo ) => any;
    getPassengerAdditionalInfo: (bookingData) => any;
    getPassengerEmergencyInfo: (bookingData) => any;
    checkInfo: (passenger, key) => any;
    generateWhatToDoShuttleBlocks: (whatToDoStatus, segmentInfo, status) => any;
    getPassengersUpdateInformation: (passengersInfo, useForAllInfo) => any;
    getSegmentsUpdateInformation: (segmentsInfo, selectedSegment) => any;
    getAcceptUpdateInformation: (selectedSegments, passengers) => any;
    updateSelectedSegments: ( segments, uncheckAbleSegments ) => any;
    updateSelectedPassengers: ( selectedPassengers, responsePassengers ) => any;
    initModelApisUsTracing: () => CkeckApisUsTracingType;
    checkExistAPIsUsTracing: ( modelApisUsTracing, isRequiredEmergencyData ) => any;
    openUsPrivacyActStatementModal: () => void;
}
