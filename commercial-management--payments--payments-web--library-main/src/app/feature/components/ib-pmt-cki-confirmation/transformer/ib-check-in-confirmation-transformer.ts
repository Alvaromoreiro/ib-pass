import * as angular from 'angular';

import { CurrencyService } from 'ib-web-commons/app/core/utils/ib-commons-currency-service';
export class CheckinConfirmationTransformer {

    constructor (
        private $filter: ng.FilterFactory,
        private PmtConstants: PmtConstants,
        private CurrencyService: CurrencyService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private confirmInfo : CheckinConfirmationModel.ConfirmationInfo ) {}

    ////////////////
    transformConfirmationInfo = (confirmationInfo, companies) => {

        let confirmationViewObject = {
            confirmInfo: [],
            rightPanelInfo: { 'pasList': [], 'segmentLimitHour': [], 'fastTrackSegments': [], 'vipSegments': [] },
            lang: this.PmtConstants.lang,
            insurance: null,
            warnings: null,
            rentCarInfo: { 'cars': [], 'pickUpCity': null },
            co2Info: null,
            carbonFootprint: { hasCarbonFootprint: false }
        };
        let segmentLength, pasLength, pasCompleteName, i, j;


        /**
          * @name getCompanyImgUrl
          * @desc loop over companies looking for and returning its logo url or empty string if it is not founded
          */
        const getCompanyImgUrl = (companyCode) => {
            let i = 0, length = companies.length, found = false, companyUrl = '';
            //loop over airlines, setting the url image for it
            while (!found && i < length) {
                if (companies[i].iataCompanyCode === companyCode) {
                    found = true;
                    companyUrl = this.PmtConstants.ROUTES.aerolinesLogoUrl + companies[i].url;
                }
                i++;
            }
            return companyUrl;
        };

        /**
          * @name getTypeOfTransportImgUrl
          * @desc return the icon url for a type of transport or empty string if it is not found
          */
        const getTypeOfTransportImgUrl = (typeOfTransport) => {
            return this.PmtConstants.ROUTES.TypeofTransport +
                (typeOfTransport === 'FLIGHT' ? 'ticket-icon-airplane.png' :
                    typeOfTransport === 'TRAIN' ? 'ticket-icon-train.png' :
                        typeOfTransport === 'BUS' ? 'ticket-icon-bus.png' : '');
        };

        /**
         * Get insurance info of localstorage for show in confirmation view
         */
        const getInsuranceInfo = () => {
            let insuranceInfo: any = this.localStorageService.get('issueOrderInfo'), textInsurance = null, i = 0;
            if (insuranceInfo) {
                if (insuranceInfo.data) {
                    insuranceInfo = insuranceInfo.data;
                }
                if (insuranceInfo && insuranceInfo.issuedItems.length > 0) {
                    for (i = 0; i < insuranceInfo.issuedItems.length; i++) {
                        if (insuranceInfo.issuedItems[i].type === this.PmtConstants.ISSUED_TYPES.INSURANCE) {
                            textInsurance = insuranceInfo.issuedItems[i];
                        }
                    }
                }
            }
            return textInsurance;
        };

        /**
         * Get warnings information of service of payment for show in view of confirmation
         */
        const getWarningsInfo = () => {
            let warnings: any = this.localStorageService.get('issueOrderInfo'), textWarnings = null, i = 0;
            if (warnings) {
                if (warnings.data) {
                    warnings = warnings.data;
                }
                if (warnings && warnings.warnings.length > 0) {
                    textWarnings = '';
                    for (i = 0; i < warnings.warnings.length; i++) {
                        textWarnings = textWarnings.concat(warnings.warnings[i].description);
                    }
                }
            }
            return textWarnings;
        };


        /**
         * Return information of car rental returned for service.
         * @return {Array} List of offers for show in confirmation view
         */
        const getCarInfo = () => {
            let ancillariesInfo: any = this.localStorageService.get('ancillariesInfo'), listOffers = [], currency;
            const currencies = ancillariesInfo?.currencies;
            if (ancillariesInfo) {
                angular.forEach(ancillariesInfo.ancillaries, (ancillarie) => {
                    if (ancillarie.type === this.PmtConstants.ANCILLARIES_TYPES.VEHICLE_RENTAL && ancillarie.status.code === this.PmtConstants.GENERAL_STATUS.AVAILABLE) {
                        if (!confirmationViewObject.rentCarInfo.pickUpCity) {
                            confirmationViewObject.rentCarInfo.pickUpCity = ancillarie.pickUp.location.description;
                        }
                        currency = this.CurrencyService.getCurrencyObject(currencies[0]);
                        angular.forEach(ancillarie.providers, (provider) => {
                            angular.forEach(provider.availability, (offer) => {
                                listOffers.push({ 'provider': provider.provider, 'description': offer.model.description, 'redirectUrl': offer.model.reservationUrl, 'pictureURI': offer.model.pictureURI, 'priceDay': this.CurrencyService.formatPrice(currency, offer.taxedRate.rate.daily, true, null), 'priceValue': offer.taxedRate.rate.daily });
                            });
                        });
                    }
                });
            }
            return listOffers;
        };

        const getCO2Info = () => {
            let co2Info: any = null;
            const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
            const currencies = ancillariesInfo?.currencies;
            if (ancillariesInfo) {
                angular.forEach(ancillariesInfo.ancillaries, (ancillary) => {
                    if (ancillary.type === this.PmtConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT && ancillary.status.code === this.PmtConstants.GENERAL_STATUS.AVAILABLE) {
                        const currency = this.CurrencyService.getCurrencyObject(currencies[0]);
                        co2Info = {
                            price: ancillary.price,
                            priceFormatted: this.CurrencyService.formatPrice(currency, ancillary.price, true, null),
                            kilosCo2Equivalent: ancillary.kilosCo2Equivalent,
                            kilosCo2EquivalentFormatted: ancillary.kilosCo2Equivalent.toString().replace('.', ',')
                        };
                    }
                });
            }
            return co2Info;
        };

        const getCarbonFootprint = () => {
            let carbonFootprint: any = { hasCarbonFootprint: false };
            let issueOrderInfo: any = this.localStorageService.get('issueOrderInfo');
            if (issueOrderInfo && issueOrderInfo.issuedItems.length > 0) {
                for (i = 0; i < issueOrderInfo.issuedItems.length; i++) {
                    if (issueOrderInfo.issuedItems[i].type === this.PmtConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT) {
                        const currency = this.CurrencyService.getCurrencyObject(issueOrderInfo.currencies[0]);

                        carbonFootprint = {
                            total: issueOrderInfo.issuedItems[i].total,
                            totalFormatted: this.CurrencyService.formatPrice(currency, issueOrderInfo.issuedItems[i].total, true, null),
                            kilosCo2Equivalent: issueOrderInfo.issuedItems[i].kilosCo2Equivalent,
                            kilosCo2EquivalentFormatted: issueOrderInfo.issuedItems[i].kilosCo2Equivalent.toString().replace('.', ','),
                            hasCarbonFootprint: true
                        };
                    }
                }
            }
            return carbonFootprint;
        };

        //loop over each segment passenger building the SEAT list and the total baggages info
        for (i = 0, segmentLength = confirmationInfo?.boardingCards?.length; i < segmentLength; i++) {
            confirmationInfo.boardingCards[i]['seatList'] = '';
            confirmationInfo.boardingCards[i]['franchiseBaggage'] = 0;
            confirmationInfo.boardingCards[i]['handBaggage'] = 0;
            for (j = 0, pasLength = confirmationInfo.boardingCards[i].passengers.length; j < pasLength; j++) {
                //Check the passenger information only if contentType is PLAIN
                if (confirmationInfo.boardingCards[i].passengers[j].contentType === 'PLAIN') {
                    if (confirmationInfo.boardingCards[i].passengers[j].seat) {
                        //If the passenger has the object seat, add the seat to the list
                        confirmationInfo.boardingCards[i]['seatList'] += (confirmationInfo.boardingCards[i]['seatList'].length > 0 ? ', ' : '')
                        + `${confirmationInfo.boardingCards[i].passengers[j].seat.row}${confirmationInfo.boardingCards[i].passengers[j].seat.column}`;
                        if (confirmationInfo.boardingCards[i].passengers[j].extraSeat) {
                            //If the passenger has the object seat, add the seat to the list
                            confirmationInfo.boardingCards[i]['seatList'] += `-${confirmationInfo.boardingCards[i].passengers[j].extraSeat.row}${confirmationInfo.boardingCards[i].passengers[j].extraSeat.column}`;
                        }
                    }
                    //add cabin baggage to total
                    confirmationInfo.boardingCards[i]['franchiseBaggage'] += confirmationInfo.boardingCards[i].passengers[j].boardingBaggage ?
                        confirmationInfo.boardingCards[i].passengers[j].boardingBaggage.franchise : 0;
                    //add hand baggage
                    if (confirmationInfo.boardingCards[i].passengers[j].type !== 'INFANT') {
                        confirmationInfo.boardingCards[i]['handBaggage'] += confirmationInfo.boardingCards[i].passengers[j].cabinClass?.type === 'BUSINESS_PLUS' ? 2 : 1;
                    }
                    //set segment cabin class type and code
                    confirmationInfo.boardingCards[i]['cabinClass'] = confirmationInfo.boardingCards[i].passengers[j].cabinClass?.type;
                    confirmationInfo.boardingCards[i]['cabinClassCode'] = confirmationInfo.boardingCards[i].passengers[j].cabinClass?.code;

                    if (confirmationInfo.boardingCards[i].passengers[j].fastTrack &&
                        confirmationViewObject.rightPanelInfo.fastTrackSegments.indexOf(confirmationInfo.boardingCards[i].departure.airport.description) === -1) {
                        //There is a passenger that has fastrack, add it to the fastrackSegments object
                        confirmationViewObject.rightPanelInfo.fastTrackSegments.push(confirmationInfo.boardingCards[i].departure.airport.description);
                    }
                    if (confirmationInfo.boardingCards[i].passengers[j].vip &&
                        confirmationViewObject.rightPanelInfo.vipSegments.indexOf(confirmationInfo.boardingCards[i].departure.airport.description) === -1) {
                        //There is a passenger that has vip, add it to the vipSegments object
                        confirmationViewObject.rightPanelInfo.vipSegments.push(confirmationInfo.boardingCards[i].departure.airport.description);
                    }
                }
                //set the passengerList if it not exist on the list
                if (i === 0) {
                    pasCompleteName = confirmationInfo.boardingCards[i].passengers[j].name + ' ' + confirmationInfo.boardingCards[i].passengers[j].surname;
                    confirmationViewObject.rightPanelInfo.pasList.push(pasCompleteName);
                }
            }
            //Set the segments boarding limit hour
            if (confirmationInfo.boardingCards[i].boarding && confirmationInfo.boardingCards[i].boarding.limitDate) {
                confirmationViewObject.rightPanelInfo.segmentLimitHour.push(confirmationInfo.boardingCards[i].boarding.limitDate);
            }
            //Choose the transport icon depending on segment type of transport
            confirmationInfo.boardingCards[i]['iconURL'] = getTypeOfTransportImgUrl(confirmationInfo.boardingCards[i].typeOfTransport);
            //Set the company logo url for actual segment
            confirmationInfo.boardingCards[i]['companyURL'] = getCompanyImgUrl(confirmationInfo.boardingCards[i].flightNumber.company.code);
            confirmationInfo.boardingCards[i]['transformedDepartureDate'] = this.$filter('DateFormatFilter')(confirmationInfo.boardingCards[i].departure.date);
            confirmationInfo.boardingCards[i]['transformedArrivalDate'] = this.$filter('DateFormatFilter')(confirmationInfo.boardingCards[i].arrival.date);

        }
        confirmationViewObject.confirmInfo = confirmationInfo;
        confirmationViewObject.insurance = getInsuranceInfo();
        confirmationViewObject.warnings = getWarningsInfo();
        confirmationViewObject.rentCarInfo.cars = getCarInfo();
        confirmationViewObject.co2Info = getCO2Info();
        confirmationViewObject.carbonFootprint = getCarbonFootprint();

        return confirmationViewObject;
    };
}
CheckinConfirmationTransformer.$inject =
    [   '$filter',
        'PmtConstants',
        'CurrencyService',
        'localStorageService'
    ];
try{
    const mod = angular.module('ib-check-in-confirmation-module');
    mod.service(
        'CheckinConfirmationTransformer',
        CheckinConfirmationTransformer
    );
} catch (error) {
    const mod = angular.module('ib-check-in-confirmation-module', []);
    mod.service(
        'CheckinConfirmationTransformer',
        CheckinConfirmationTransformer
    );
}
