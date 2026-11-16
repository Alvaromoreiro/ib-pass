import * as angular from 'angular';
import { AncillariesModel } from 'ib-web-ancillaries/dist/app/core/models/ancillaries-model';
export class AncillariesConfigurationService {
    constructor () { }

    initializeModel = (): AncillariesModel.Model => {
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
            insuranceAvailable: null,
            ancillariesFlexibilization: null,
            ancillariesCarbonFootprint: null,
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
            ancillariesTransfersGlobick:null,
            ancillariesAllianzFusionInsurance:null,
            insuranceAllianzFusionAvailable:null
        };
    };

}

AncillariesConfigurationService.$inject = [];
try {
    const mod = angular.module('ib-MmB-services-module');
    mod.service(
        'AncillariesConfigurationService',
        AncillariesConfigurationService
    );
} catch (error) {
    const mod = angular.module('ib-MmB-services-module', []);
    mod.service(
        'AncillariesConfigurationService',
        AncillariesConfigurationService
    );
}
