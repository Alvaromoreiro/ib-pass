import * as angular from 'angular';
export class AncillariesConfigurationService {
    constructor () { }

    initializeModel = (): BookingAncillariesModel.Model => {
        return {
            ancillariesTrips: [],
            seatsAvailable: true,
            insuranceForm: null,
            baggageAvailable: true,
            selectedInsurance: false,
            baggagesQuanty: null,
            seatsQuanty: null,
            currency: null,
            infoHeader: null,
            isAllowed: false,
            isShowedModal: false,
            totalPayment: 0,
            baggageAvailablePrice: 0,
            showInsuranceBox: false,
            bobAvailable: false,
            bobInfo: {},
            speqsQuanty: 0,
            ancillariesAvailable: null,
            ancillariesInsurance: null,
            ancillariesInsuranceAllianzFusion: null,
            insuranceAvailable: null,
            insuranceAllianzFusionAvailable: null,
            ancillariesFlexibilization: null,
            ancillariesCarbonFootprint: null,
            ancillariesTransfersGlobick: null,
            insuranceInfo: null,
            pendingSeats: null,
            passengerBaggagesTrips: null,
            isCurrencyLong: null,
            speqsAvailablePrice: null,
            passengerSpeqsTrips: null,
            showBannerConfort: null,
            ancillariesPreorder: null,
            ancillariesPriorityBoarding: null,
            upgrading: null,
            flags: null,
            newSelectedIndurancePerCountry: null,
            pricesProvider: '',
            infoToShowNewMap: null,
            bundles: null,
            relatedContent:null,
            petc: null,
            assistCard: null
        };
    };

}

AncillariesConfigurationService.$inject = [];
try {
    const mod = angular.module('ib-booking-ancillaries-module');
    mod.service(
        'AncillariesConfigurationService',
        AncillariesConfigurationService
    );
} catch (error) {
    const mod = angular.module('ib-booking-ancillaries-module', []);
    mod.service(
        'AncillariesConfigurationService',
        AncillariesConfigurationService
    );
}
