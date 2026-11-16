import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';

export const AJSBookingPassengerInfoTransformer = new InjectionToken<any>('BookingPassengerInfoTransformer');
export const AJSBookingPassengerInfoTransformerProvider = upgradeAJSServiceProvider('BookingPassengerInfoTransformer', AJSBookingPassengerInfoTransformer);

export interface BookingPassengerInfoTransformerType {
    transformSecurityInfoPassengerData ( securityInfoData, prefixes, gdprInfo, fareData, travelPreferences, contactData, discountsInfo, 
        travelDocuments );
    transformUpdatePassengerInfoData ( passengerformData, onHold );
    arePassengersBirthDatesValid ( passengersInfo );
    cleanErrorResidents ( passengers );
    createFlightReviewMonetate ( data, passengers, selectedSlices, currency, fareFamily );
    generateBookingInfoModel ( orderData );
    getAssociatesTransformed ( associatesCollection );
    genCalcAviosFlightReq ( fareData );
    TransCalcPointsData ( data );
    transformProfileRemindError ( error );
    transformPassengerInfoToSaveInLocalStorage ( passengerInfoModel );
    generateMetaUrl();
    transformContactData ( data );
    generateTravPrefReq ( data );
    getOnHoldOptionsInfo ( onHoldInfo, currencies, showIfLoggedModule );
    generatePersonalDataReq ( data );
    generateOfferItemsRequest ( fareData, transformedUpdatePassengerInfoData, passengerformData );
    getOfferItemsServices ( offerItems, passengers );
    generateContactInfoRequest ( passengerformData, transformedUpdatePassengerInfoData );
    generateDiscountsRequest ( passengerformData, auxPassInfo, i );
    generateFrequentFlyerRequest ( passengerformData, auxPassInfo, datalayerObject, i );
    generateBirthDateRequest ( passengerformData, auxPassInfo, i );
    generateGenderRequest ( passengerformData, auxPassInfo, i );
    generateOBAndRelatedPassRequest ( passengerformData, auxPassInfo, i );
    shouldSetTitle ( auxPassInfo, hasGender, hasRequiredFields );
    shouldSetGender ( hasGender, hasRequiredFields );
    setSpecialNeedsRequest ( passenger );
}

