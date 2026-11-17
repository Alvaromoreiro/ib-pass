namespace HttpServicesConstantsNamespace {
    const envCopy: any = {};
    (<any>Object).assign(envCopy, (<any>window).env);
    const servicesURI: string = envCopy.services;
    const HttpServicesConstants = {
        TIME_WAIT: 2000,
        TIME_DATALAYER_WAIT: 3000,
        NUM_ATTEMPS: 3,
        URI: {
            getLoggedBookingURI: 'user/bookings',
            putNewslettersURI: 'newsletter',
            travelInfoServiceURI: 'customer/travel_info',
            travelDocumentServiceURI: 'travel_document',
            getFrequentFlyerCompaniesURI: 'data/frequent-flyer/companies',
            getBookingInformationURI: 'booking/',
            getBookingInformationNameURI: 'booking/checkinId/',
            cachedInformationURI: 'booking/checkinId/',
            getSummaryTripURI: 'booking/checkinId/',
            passengerAdditionalInfoURI: 'info/',
            apisPassengerInfoURI: 'info/',
            availabilityFlightNowURI: 'availability/shuttle/flynow',
            changeOrderSliceURI: 'order',
            getBiometricalData: 'biometric-data',
            getFlightInfoPassenger: 'flight-info',
            getBiometricalAllowedDocuments: 'allowed',
            getBiometricCardPassengerAssociation: 'boarding-pass',
            DEFAULT_ENDPOINTS: {
                getLoggedBookingURI: servicesURI + '/pac-prm/rs/checkin/v2/user/bookings',
                putNewslettersURI: servicesURI + '/cust-cust/rs/v1/newsletter',
                travelInfoServiceURI: servicesURI + '/cust-cust/rs/v1/customer/travel_info',
                travelDocumentServiceURI: servicesURI + '/cust-cust/rs/v1/travel_document',
                getFrequentFlyerCompaniesURI: servicesURI + '/framework-services/rs/commons/v1/data/frequent-flyer/companies',
                boardingCardsURI: servicesURI + '/pac-bpm/rs/bpm/v3/',
                getBookingInformationURI: servicesURI + '/pac-prm/rs/checkin/v3/booking/',
                getBookingInformationNameURI: servicesURI + '/pac-prm/rs/checkin/v3/booking/checkinId/',
                cachedInformationURI: servicesURI + '/pac-prm/rs/checkin/v3/booking/checkinId/',
                getBookingInformationDeepLinkURI: servicesURI + '/pac-prm/rs/checkin/v2/booking/deeplink',
                getSummaryTripURI: servicesURI + '/pac-prm/rs/checkin/v2/booking/checkinId/',
                objectPolicyAcceptURI: servicesURI + '/pac-pacc/rs/pacc/v2/',
                passengerAdditionalInfoURI: servicesURI + '/pac-pacc/rs/pacc/v2/info/',
                updateUpgradeURI: servicesURI + '/pac-pacc/rs/pacc/v2/',
                seatsMapURI: servicesURI + '/sea-cism/rs/cism/v3/',
                apisPassengerInfoURI: servicesURI + '/trm-apim/rs/v3/info/',
                availabilityFlightNowURI: servicesURI + '/sse-avm/rs/v2/availability/shuttle/flynow',
                changeOrderSliceURI: servicesURI + '/sse-orm/rs/v2/order',
                deletePassengerURI: servicesURI + '/pac-pacc/rs/pacc/v1/',
                getBoardingDocument: servicesURI + '/pac-bpm/rs/bpm/v3/',
                getBiometricalData: servicesURI + '/cust-bio/rs/v2/passenger/biometric-data',
                getFlightInfoPassenger: servicesURI + '/cust-bio/rs/v1/passenger/flight-info',
                getBiometricalAllowedDocuments: servicesURI + '/cust-bio/rs/v3/documents/allowed',
                getBiometricCardPassengerAssociation: servicesURI + '/cust-bio/rs/v4/passenger/boarding-pass',
                digitalBoardingAvailability: servicesURI + '/trm-apim/rs/v3/digital-boarding',
                associateBoardingCardsOrchestrator: servicesURI + '/cust-bio/rs/v6/passenger/validate-associate-boarding-pass'
            },
            WCS: {
                PHONES: '/cs/Satellite?pagename=IB_SE_Services&service=getContact',
                JSESSIONCLEAN: '/cs/Satellite?pagename=IB_SE/CacheControl0s/Integration/logOut'
            }
        }
    };
    angular.module('ib-http-services-module', []).constant('HttpServicesConstants', HttpServicesConstants);
    export type HttpServicesConstants = typeof HttpServicesConstants;
}
