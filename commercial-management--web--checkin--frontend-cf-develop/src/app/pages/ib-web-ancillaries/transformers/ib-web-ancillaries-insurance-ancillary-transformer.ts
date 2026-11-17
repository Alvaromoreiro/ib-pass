import * as angular from 'angular';
import { InsuranceHandlerContext, TransformedAncillariesInfo } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer.model';

/**
 * INSURANCE/INSURANCE_ALLIANZ-ancillary handling extracted from AncillariesTransformer's
 * transformAncillariesView dispatch table (plus the post-loop insurance enrichment it calls
 * directly)
 */
export class InsuranceAncillaryTransformer {
    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private CurrencyService: CurrencyService
    ) {}

    handleInsuranceAncillarie = (ancillarie: any, transformedInfo: TransformedAncillariesInfo, insuranceContext: InsuranceHandlerContext): void => {
        insuranceContext.ancillariesInsuranceInfo = ancillarie;
        transformedInfo.insuranceAvailable = ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE;
        if (transformedInfo.insuranceAvailable) {
            transformedInfo.ancillariesAvailable.push(ancillarie.type);
            transformedInfo.insuranceInfo.countriesList = ancillarie.countriesAllowed;
            transformedInfo.insuranceInfo.priceZero = this.CurrencyService.formatPrice(transformedInfo.currency, 0, true, false);
            transformedInfo.insuranceInfo.conditionsUri = ancillarie.offers[0].termsAndConditionsDocumentURI;
            transformedInfo.insuranceInfo.id = ancillarie.offers[0].code;
            insuranceContext.countryInsurance = ancillarie.issueCountry;
            transformedInfo.insuranceInfo.issueCountry = ancillarie.issueCountry;
            transformedInfo.insuranceInfo.consent = ancillarie.offers[0].consent;
            if (ancillarie.offers[0].compliance !== null) {
                this.createComplianceModel(ancillarie);
            }
        }
    };

    handleInsuranceAllianzAncillarie = (ancillarie: any, transformedInfo: TransformedAncillariesInfo, insuranceContext: InsuranceHandlerContext): void => {
        insuranceContext.ancillariesInsuranceInfo = ancillarie;
        transformedInfo.insuranceAllianzFusionAvailable = ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE;
        if (transformedInfo.insuranceAllianzFusionAvailable) {
            transformedInfo.ancillariesAvailable.push(ancillarie.type);
            transformedInfo.insuranceInfo = ancillarie.locations[0];
            transformedInfo.insuranceInfo.countriesList = [];
            transformedInfo.insuranceInfo.priceZero = null;
            transformedInfo.insuranceInfo.conditionsUri = '';
            transformedInfo.insuranceInfo.id = null;
            insuranceContext.countryInsurance = '';
            transformedInfo.insuranceInfo.issueCountry = '';
            transformedInfo.insuranceInfo.consent = '';
        }
    };

    private createComplianceModel = (ancillarie: any): void => {
        const isCompliance = ancillarie.offers && ancillarie.offers[0] && ancillarie.offers[0].compliance;
        if (isCompliance) {
            const infoModal = ancillarie.offers[0].compliance.informativeMessage.split('<br />');
            infoModal[2] = infoModal[2].replace('</p>', '');
            infoModal[0] = infoModal[0].replace('<p><strong>', '');
            infoModal[0] = infoModal[0].replace('</strong>', '');
            ancillarie.offers[0].compliance.informativeMessage = infoModal;
            const insuranceTax = ancillarie.offers[0].compliance.premiumSplitProvision.split('<br />');
            insuranceTax[0] = insuranceTax[0].replace('<p>', '');
            insuranceTax[1] = insuranceTax[1].replace('-', '');
            insuranceTax[2] = insuranceTax[2].replace('-', '');
            insuranceTax[2] = insuranceTax[2].replace('&nbsp;</p>', '');
            ancillarie.offers[0].compliance.premiumSplitProvision = insuranceTax;
        }
    };

    enrichInsuranceOffers = (transformedInfo: TransformedAncillariesInfo, insuranceContext: InsuranceHandlerContext, cachedData: any): void => {
        if (transformedInfo.insuranceAvailable) {
            const ancillariesInsuranceInfo = insuranceContext.ancillariesInsuranceInfo;
            for (let i = 0; i < ancillariesInsuranceInfo.offers.length; i++) {
                const numOfPassenger = this.getNumPassengerByInsurance(cachedData.passengers);
                const pricePerPerson = ancillariesInsuranceInfo.offers[i].premium / numOfPassenger;
                transformedInfo.ancillariesInsurance.push({
                    provider: ancillariesInsuranceInfo.provider,
                    offer: ancillariesInsuranceInfo.offerId,
                    id: ancillariesInsuranceInfo.offers[i].code,
                    name: ancillariesInsuranceInfo.offers[i].name,
                    originalPrice: ancillariesInsuranceInfo.offers[i].premium,
                    price: this.CurrencyService.formatPrice(transformedInfo.currency, ancillariesInsuranceInfo.offers[i].premium, true, false),
                    originalPricePerPerson: pricePerPerson,
                    pricePerPerson: this.CurrencyService.formatPrice(transformedInfo.currency, pricePerPerson, true, false),
                    passengerInfo: cachedData.passengers,
                    termsAndConditionsDocumentURI: ancillariesInsuranceInfo.offers[i].termsAndConditionsDocumentURI,
                    descriptionCoverages: this.getInsuranceDescription(ancillariesInsuranceInfo.offers[i].coverages),
                    addOns: ancillariesInsuranceInfo.offers[i].addOns,
                    consent: ancillariesInsuranceInfo.offers[i].consent,
                    compliance: ancillariesInsuranceInfo.offers[i].compliance,
                    issueCountry: ancillariesInsuranceInfo.issueCountry
                });
            }
        }

        if (transformedInfo.ancillariesInsurance.length > 0) {
            transformedInfo.insuranceInfo.price = transformedInfo.ancillariesInsurance[0].price;
            transformedInfo.insuranceInfo.originalPrice = transformedInfo.ancillariesInsurance[0].originalPrice;
        }
    };

    private getInsuranceDescription = (coverages: any): any => {
        let coveragesIndex;
        const descriptionCoverages = [];
        for (coveragesIndex = 0; coveragesIndex < coverages.length; coveragesIndex++) {
            descriptionCoverages.push({ title: coverages[coveragesIndex].title, description: coverages[coveragesIndex].description });
        }
        return descriptionCoverages;
    };

    private getNumPassengerByInsurance = (passengers: any): any => {
        const totalNumPassengerByInsurance = passengers.filter((passenger) => passenger.type !== 'INF').length;
        if (totalNumPassengerByInsurance === 0) {
            return 1; //Avoid division by zero
        }
        return totalNumPassengerByInsurance;
    };

    applyInsuranceCountryDefaults = (transformedInfo: TransformedAncillariesInfo, countryInsurance: string): void => {
        if (transformedInfo.insuranceInfo.countriesList.length > 1) {
            transformedInfo.insuranceInfo.countriesList.forEach((country) => {
                this.selectMatchingInsuranceCountry(transformedInfo, country, countryInsurance);
                this.collectInsurancePatterns(transformedInfo, country);
            });
        }
        this.applyFallbackInsuranceCountry(transformedInfo);
    };

    private selectMatchingInsuranceCountry = (transformedInfo: TransformedAncillariesInfo, country: any, countryInsurance: string): void => {
        if (country.country.code !== countryInsurance) {
            return;
        }
        transformedInfo.insuranceInfo.insuranceCountry = country;
        transformedInfo.insuranceInfo.oldInsuranceCountry = country;
        transformedInfo.insuranceInfo.countryInsurance = country.country.description;
    };

    private collectInsurancePatterns = (transformedInfo: TransformedAncillariesInfo, country: any): void => {
        if (country.passengerRequiredFields.length === 0) {
            return;
        }
        country.passengerRequiredFields.forEach((field) => {
            const documentIdPattern = this.findDocumentIdPattern(field.requiredFieldsGroups);
            if (documentIdPattern !== undefined) {
                transformedInfo.insuranceInfo.insurancePatterns[country.country.code] = documentIdPattern;
            }
        });
    };

    private findDocumentIdPattern = (requiredFieldsGroups: any): string | undefined => {
        let documentIdPattern: string | undefined;
        requiredFieldsGroups.forEach((reqFieldGroup) => {
            reqFieldGroup.requiredFields.forEach((reqField) => {
                if (reqField.requiredField === this.CheckinAncillariesConstants.PASSENGERFIELDS.DOCUMENT_ID) {
                    documentIdPattern = reqField.pattern;
                }
            });
        });
        return documentIdPattern;
    };

    private applyFallbackInsuranceCountry = (transformedInfo: TransformedAncillariesInfo): void => {
        if (transformedInfo.insuranceInfo.insuranceCountry !== null || transformedInfo.insuranceInfo.countriesList.length === 0) {
            return;
        }
        const [firstCountry] = transformedInfo.insuranceInfo.countriesList;
        transformedInfo.insuranceInfo.insuranceCountry = firstCountry;
        transformedInfo.insuranceInfo.oldInsuranceCountry = firstCountry;
        transformedInfo.insuranceInfo.countryInsurance = firstCountry.country.description;
    };
}

InsuranceAncillaryTransformer.$inject = ['CheckinAncillariesConstants', 'CurrencyService'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('InsuranceAncillaryTransformer', InsuranceAncillaryTransformer);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('InsuranceAncillaryTransformer', InsuranceAncillaryTransformer);
}
