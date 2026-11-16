import * as angular from 'angular';

export class IbFareShuttleTransformer {

    constructor (
        private $rootScope,
        private BookingAppConstants,
        private CurrencyService,
        private localStorageService,
        private BookingUtilService
    ) {}

    fareShuttleTransformed: any;

    ////////////////
    /** Transform the response of fare Shuttle to prepare information to the view */
    transform = (fareShuttleResponse) => {
        this.fareShuttleTransformed = {
            passengerInfo: {
                adults: 0,
                childs: 0,
                infants: 0
            },
            slices: [],
            priceInfo: {
                totalFormatter: '',
                text: ''
            },
            fareFamilyConditions: [],
            marketCode: ''
        };

        if (angular.isUndefined(fareShuttleResponse) || !fareShuttleResponse || Object.keys(fareShuttleResponse).length === 0) {
            return this.fareShuttleTransformed;
        }

        this.fareShuttleTransformed.passengerInfo = this.processPassengers(fareShuttleResponse.passengers);
        this.fareShuttleTransformed.slices = this.processSlices(fareShuttleResponse.offers, fareShuttleResponse.fareFamilyConditions);
        if (fareShuttleResponse.offers[0].promotion || fareShuttleResponse.offers[0].limitedUseCoupon) {
            if (!this.$rootScope.isPointsOBFlow) {
                this.fareShuttleTransformed.offers = this.transformRedemptionOffers(fareShuttleResponse);
            } else {
                this.fareShuttleTransformed.offers = this.transformRedemptionONBOffers(fareShuttleResponse);
            }
            this.fareShuttleTransformed.priceInfo = this.fareShuttleTransformed.offers.totalPrice;
        } else {
            this.fareShuttleTransformed.priceInfo = this.processPrices(fareShuttleResponse);
            this.fareShuttleTransformed.offers = fareShuttleResponse.offers;
        }
        if (fareShuttleResponse.fareFamilyConditions) {
            this.fareShuttleTransformed.fareFamilyConditions = fareShuttleResponse.fareFamilyConditions;
        }
        return this.fareShuttleTransformed;
    };

    /**
     * Transform the information for the booking header
     * @param {*} data
     */
    processHeaderData = (data) => {

        const auxParams = this.localStorageService.get('bookingUrlParams');

        const outboundFlight = (auxParams.beginYear && auxParams.beginMonth && auxParams.beginDay) ? auxParams.beginYear + '-' + auxParams.beginMonth + '-' + auxParams.beginDay : null;
        const formatedOutboundFlight = (auxParams.beginYear && auxParams.beginMonth && auxParams.beginDay) ? auxParams.beginYear + '-' + auxParams.beginYear + '-' + auxParams.beginMonth + '-' + auxParams.beginDay + 'T00:00:00.000' : null;
        const returnFlight = (auxParams.endYear && auxParams.endMonth && auxParams.endDay) ? auxParams.endYear + '-' + auxParams.endMonth + '-' + auxParams.endDay : null;
        const formatedReturnFlight = (auxParams.endYear && auxParams.endMonth && auxParams.endDay) ? auxParams.endYear + '-' + auxParams.endMonth + '-' + auxParams.endDay + 'T00:00:00.000' : null;

        this.localStorageService.set('originDestination', {
            originCity:
            {
                code: data.slices[0].originCityCode,
                description: data.slices[0].originCity
            },
            destinationCity: {
                code: data.slices[0].destinationCityCode,
                description: data.slices[0].destinationCity
            },
            dates: {
                outboundFlight: outboundFlight,
                formatedOutboundFlight: formatedOutboundFlight,
                returnFlight: returnFlight,
                formatedReturnFlight: formatedReturnFlight
            },
            passengers: data.passengerInfo.adults + data.passengerInfo.childs + data.passengerInfo.infants,
            numAdults: data.passengerInfo.adults,
            numChilds: data.passengerInfo.childs,
            numInfant: data.passengerInfo.infants,
            numSeniors: 0,
            numTeenager: 0,
            numYoung: 0,
            tripType: auxParams.tripType
        });
    };

    processPassengers = (passengers) => {
        const passengersInfo = {
            adults: 0,
            childs: 0,
            infants: 0
        };
        angular.forEach(passengers, (p) => {
            if (this.BookingAppConstants.passengerTypes.adult === p.passengerType) {
                passengersInfo.adults += 1;
            } else if (this.BookingAppConstants.passengerTypes.child === p.passengerType) {
                passengersInfo.childs += 1;
            } else if (this.BookingAppConstants.passengerTypes.infant === p.passengerType) {
                passengersInfo.infants += 1;
            }
        });
        return passengersInfo;
    };

    processSlices = (offers, fareFamilyConditions= []) => {
        let slicesInfo = [], sliceItem;
        if (offers && offers.length > 0) {
            angular.forEach(offers[0].slices, (slice) => {
                if (slice.segments && slice.segments.length > 0) {
                    sliceItem = {
                        originCity: slice.segments[0].departure.city.description,
                        originCityCode: slice.segments[0].departure.city.code,
                        destinationCityCode: slice.segments[0].arrival.city.code,
                        destinationCity: slice.segments[0].arrival.city.description,
                        cabin: slice.segments[0].cabin.cabinDescription,
                        cabinFullName: fareFamilyConditions.find(condition => condition.commercialCode === slice.segments[0].cabin.fareFamily)?.commercialNameES ?? slice.segments[0].cabin.cabinDescription,
                        cabinType:  fareFamilyConditions.find(condition => condition.commercialCode === slice.segments[0].cabin.fareFamily)?.cabinType ?? slice.segments[0].cabin.cabinDescription,
                        flights: slice.segments[0].flight,
                        segmentsTotal: slice.segments.length,
                        segments: slice.segments,
                        price: slice.price,
                        type: offers[0].type
                    };
                    slicesInfo.push(sliceItem);
                }
            });
        }
        this.generatedSliceSelected(slicesInfo);
        return slicesInfo;
    };

    processPrices = (fareShuttleResponse) => {
        let priceInfo: any = {
            totalFormatter: '',
            text: ''
        };
        if (fareShuttleResponse.offers && fareShuttleResponse.offers.length > 0) {
            priceInfo = fareShuttleResponse.offers[0].price;
            priceInfo.totalFare = fareShuttleResponse.offers[0].price.fare;
            priceInfo.totalCurrency = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(fareShuttleResponse.contextMetadata.currencies[0]), priceInfo.total, true);
            priceInfo.totalFormatter = priceInfo.total;
            priceInfo.currency = fareShuttleResponse.offers[0].totalPoints ? fareShuttleResponse.offers[0].totalPoints.currency : 'Avios';
            priceInfo.offerItems = fareShuttleResponse.offers[0].offerItems;
            if (fareShuttleResponse.offers[0].accrualQuote) {
                priceInfo.aviosToEarn = fareShuttleResponse.offers[0].accrualQuote.redemptionPoints;
                priceInfo.elitePointsToEarn = fareShuttleResponse.offers[0].accrualQuote.qualificationPoints;
            }

            angular.forEach(fareShuttleResponse.relatedContent, (content) => {
                if (content.key === 'TOTAL_PRICE') {
                    priceInfo.text = content.value;
                }
            });
        }
        return priceInfo;
    };

    transformRedemptionOffers = (fareData) => {
        var fareRate = [], i = 0, bookingUrlParams = this.localStorageService.get('bookingUrlParams'), commercialData = this.localStorageService.get('commercialData'), showAviosMoney = false, firstElegible = false, count = 0;
        var totalPrice: any = {}, totalPassengers = 0;
        const coupons = fareData.offers[0].limitedUseCoupon ? this.buildCoupons(fareData.offers[0].limitedUseCoupon) : null;

        if (bookingUrlParams.adult) totalPassengers += parseInt(bookingUrlParams.adult);
        if (bookingUrlParams.child) totalPassengers += parseInt(bookingUrlParams.child);
        if (bookingUrlParams.infant) totalPassengers += parseInt(bookingUrlParams.infant);
        if (fareData.offers[0].redemptionOptions) {
            for (i = 0; i < fareData.offers[0].redemptionOptions.length; i++) {
                if (fareData.offers[0].redemptionOptions[i].eligible) {
                    showAviosMoney = true;
                    if (!firstElegible && count === 0) {
                        firstElegible = true;
                    }
                }
                fareRate.push({
                    avios: fareData.offers[0].redemptionOptions[i].totalPoints,
                    cash: fareData.offers[0].redemptionOptions[i].totalCash,
                    tax: fareData.offers[0].redemptionOptions[i].taxes.price.tax,
                    taxPerPassenger: fareData.offers[0].redemptionOptions[i].taxes.price.tax / totalPassengers,
                    aviosWithoutDiscount: fareData.offers[0].redemptionOptions[i].totalPoints,
                    cashWithoutDiscount: fareData.offers[0].redemptionOptions[i].totalCash,
                    fareCashPerPassenger: fareData.offers[0].redemptionOptions[i].totalCash.fare / totalPassengers,
                    fareAviosPerPassenger: fareData.offers[0].redemptionOptions[i].totalPoints.fare / totalPassengers,
                    formatPrice: this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), fareData.offers[0].redemptionOptions[i].totalCash.fare + fareData.offers[0].price.tax, true),
                    formatAvios: this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareData.offers[0].redemptionOptions[i].totalPoints.fare),
                    formatOldPrice: '',
                    formatOldAvios: '',
                    eligible: fareData.offers[0].redemptionOptions[i].eligible,
                    selected: firstElegible,
                    redemptionOptionId: fareData.offers[0].redemptionOptions[i].optionId,
                    offerItems: fareData.offers[0].offerItems
                });
                if (firstElegible || (fareData.offers[0].redemptionOptions.length === 1)) {
                    totalPrice.fareCashPerPassenger = fareRate[fareRate.length - 1].fareCashPerPassenger;
                    totalPrice.fareAviosPerPassenger = fareRate[fareRate.length - 1].fareAviosPerPassenger;
                    totalPrice.tax = fareData.offers[0].price.tax;
                    totalPrice.taxPerPassenger = fareRate[fareRate.length - 1].taxPerPassenger;
                    totalPrice.redemptionOptionId = fareRate[fareRate.length - 1].redemptionOptionId;
                    totalPrice.price = {};
                    totalPrice.price.totalCash = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), fareRate[fareRate.length - 1].cash.fare + fareData.offers[0].price.tax, true);
                    totalPrice.price.totalAvios = this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareRate[fareRate.length - 1].avios.fare);
                    totalPrice.oldPriceWithoutDiscount = {};
                    totalPrice.oldPriceWithoutDiscount.totalCash = null;
                    totalPrice.oldPriceWithoutDiscount.totalAvios = null;
                    totalPrice.promotionApplied = false;
                    totalPrice.couponApplied = false;
                    firstElegible = false;
                    count++;
                }
            }
        } else if (fareData.offers[0].promotion && fareData.offers[0].promotion.discountedRedemptionOptions) {
            for (i = 0; i < fareData.offers[0].promotion.discountedRedemptionOptions.length; i++) {
                if (fareData.offers[0].promotion.discountedRedemptionOptions[i].eligible) {
                    showAviosMoney = true;
                    if (!firstElegible && count === 0) {
                        firstElegible = true;
                    }
                }
                fareRate.push({
                    avios: fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalPoints,
                    cash: fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalCash,
                    tax: fareData.offers[0].price.tax,
                    taxPerPassenger: fareData.offers[0].price.tax / totalPassengers,
                    aviosWithoutDiscount: fareData.offers[0].promotion.discountedRedemptionOptions[i].basePrice.totalPoints,
                    cashWithoutDiscount: fareData.offers[0].promotion.discountedRedemptionOptions[i].basePrice.totalCash,
                    fareCashPerPassenger: fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalCash.fare / totalPassengers,
                    fareAviosPerPassenger: fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalPoints.fare / totalPassengers,
                    formatPrice: this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalCash.fare + fareData.offers[0].price.tax, true),
                    formatAvios: this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareData.offers[0].promotion.discountedRedemptionOptions[i].discountedPrice.totalPoints.fare),
                    formatOldPrice: this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), fareData.offers[0].promotion.discountedRedemptionOptions[i].basePrice.totalCash.fare + fareData.offers[0].price.tax, true),
                    formatOldAvios: this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareData.offers[0].promotion.discountedRedemptionOptions[i].basePrice.totalPoints.fare),
                    eligible: fareData.offers[0].promotion.discountedRedemptionOptions[i].eligible,
                    selected: firstElegible,
                    redemptionOptionId: fareData.offers[0].promotion.discountedRedemptionOptions[i].optionId,
                    offerItems: fareData.offers[0].offerItems
                });
                if (firstElegible || (fareData.offers[0].promotion.length === 1)) {
                    totalPrice.fareCashPerPassenger = fareRate[fareRate.length - 1].fareCashPerPassenger;
                    totalPrice.fareAviosPerPassenger = fareRate[fareRate.length - 1].fareAviosPerPassenger;
                    totalPrice.tax = fareData.offers[0].price.tax;
                    totalPrice.taxPerPassenger = fareRate[fareRate.length - 1].taxPerPassenger;
                    totalPrice.redemptionOptionId = fareRate[fareRate.length - 1].redemptionOptionId;
                    totalPrice.price = {};
                    totalPrice.price.totalCash = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), fareRate[fareRate.length - 1].cash.fare + fareData.offers[0].price.tax, true);
                    totalPrice.price.totalAvios = this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareRate[fareRate.length - 1].avios.fare);
                    totalPrice.oldPriceWithoutDiscount = {};
                    totalPrice.oldPriceWithoutDiscount.totalCash = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), fareRate[fareRate.length - 1].cashWithoutDiscount.fare + fareData.offers[0].price.tax, true);
                    totalPrice.oldPriceWithoutDiscount.totalAvios = this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareRate[fareRate.length - 1].aviosWithoutDiscount.fare);
                    totalPrice.promotionApplied = true;
                    totalPrice.couponApplied = false;
                    firstElegible = false;
                    count++;
                }
            }
        }

        return { fareRate: fareRate, totalPrice: totalPrice, withoutAviosMoney: (!showAviosMoney), coupons: coupons };
    };

    transformRedemptionONBOffers = (fareData) => {
        var fareRate = [], i = 0, bookingUrlParams = this.localStorageService.get('bookingUrlParams'), commercialData = this.localStorageService.get('commercialData'), showAviosMoney = false, firstElegible = false, count = 0;
        var totalPrice: any = {}, totalPassengers = 0;
        const coupons = fareData.offers[0].limitedUseCoupon ? this.buildCoupons(fareData.offers[0].limitedUseCoupon) : null;
        if (bookingUrlParams.adult) totalPassengers += parseInt(bookingUrlParams.adult);
        if (bookingUrlParams.child) totalPassengers += parseInt(bookingUrlParams.child);
        if (fareData.offers[0].redemptionOptions) {
            for (i = 0; i < fareData.offers[0].redemptionOptions.length; i++) {
                if (fareData.offers[0].redemptionOptions[i].eligible) {
                    showAviosMoney = true;
                    if (!firstElegible && count === 0) {
                        firstElegible = true;
                    }
                }
                fareRate.push({
                    points: fareData.offers[0].redemptionOptions[i].totalPoints,
                    cash: fareData.offers[0].redemptionOptions[i].totalCash,
                    tax: fareData.offers[0].redemptionOptions[i].taxes.price.tax,
                    taxPerPassenger: fareData.offers[0].redemptionOptions[i].taxes.price.tax / totalPassengers,
                    fareCashPerPassenger: fareData.offers[0].redemptionOptions[i].totalCash.fare / totalPassengers,
                    farePointsPerPassenger: fareData.offers[0].redemptionOptions[i].totalPoints.fare / totalPassengers,
                    formatPrice: this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), fareData.offers[0].redemptionOptions[i].totalCash.fare, true),
                    formatAvios: this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareData.offers[0].redemptionOptions[i].totalPoints.fare),
                    eligible: fareData.offers[0].redemptionOptions[i].eligible,
                    selected: firstElegible,
                    redemptionOptionId: fareData.offers[0].redemptionOptions[i].optionId
                });
                if (firstElegible || (fareData.offers[0].redemptionOptions.length === 1)) {
                    totalPrice.fareCashPerPassenger = fareRate[fareRate.length - 1].fareCashPerPassenger;
                    totalPrice.farePointsPerPassenger = fareRate[fareRate.length - 1].farePointsPerPassenger;
                    totalPrice.tax = fareData.offers[0].price.tax;
                    totalPrice.taxPerPassenger = fareRate[fareRate.length - 1].taxPerPassenger;
                    totalPrice.redemptionOptionId = fareRate[fareRate.length - 1].redemptionOptionId;
                    totalPrice.price = {};
                    totalPrice.price.totalCash = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), fareRate[fareRate.length - 1].cash.fare + fareData.offers[0].price.tax, true);
                    totalPrice.price.totalPoints = this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, fareRate[fareRate.length - 1].points.fare);
                    totalPrice.totalPoints = fareRate[fareRate.length - 1].points.fare;
                    firstElegible = false;
                    count++;
                }
                this.localStorageService.set('totalPrice', totalPrice);
            }
        }
        return { fareRate: fareRate, totalPrice: totalPrice, withoutAviosMoney: (!showAviosMoney), coupons: coupons };
    };
    buildCoupons = (coupons) => {
        const transCoupons = [];
        const calcDiscount = (discountOption) => {
            let discount;
            discount = (discountOption.basePrice.totalPoints.fare - discountOption.discountedPrice.totalPoints.fare) / discountOption.basePrice.totalPoints.fare * 100;
            return Math.ceil(discount);
        };

        coupons.forEach((coupon) => {
            if (coupon.couponDetails.length > 1) {
                coupon.couponDetails.forEach((element) => {
                    element.discount = calcDiscount(coupon.discountedRedemptionOptions[0]);
                    element.offerList = coupon.discountedRedemptionOptions;
                    transCoupons.push(element);
                });
            } else {
                coupon.couponDetails[0].discount = calcDiscount(coupon.discountedRedemptionOptions[0]);
                coupon.couponDetails[0].offerList = coupon.discountedRedemptionOptions;
                transCoupons.push(coupon.couponDetails[0]);
            }
        });
        return transCoupons;
    };

    generatedSliceSelected = (slicesInfo) => {
        const selectedSlicesData = [];
        angular.forEach(slicesInfo, (slice) => {
            selectedSlicesData.push({
                articleOffset: 0,
                available: true,
                cabin: slice.cabin,
                destination: slice.destinationCityCode,
                destinationCountry: 'ES',
                heightHeadingFlight: 0,
                info: slice,
                origin: slice.originCityCode,
                originCountry: 'ES',
                originDestinationId: '',
                selectedSliceIndex: 0,
                selectedSlicesLength: 0,
                transformOffset: 0
            });
        });
        this.BookingUtilService.setSelectedTripInfoinStorage(selectedSlicesData);
    };
}
IbFareShuttleTransformer.$inject = ['$rootScope', 'BookingAppConstants', 'CurrencyService', 'localStorageService', 'BookingUtilService'];
try {
    const mod = angular.module('ib-shuttle-module');
    mod.service(
        'IbFareShuttleTransformer',
        IbFareShuttleTransformer
    );
} catch (error) {
    const mod = angular.module('ib-shuttle-module', []);
    mod.service(
        'IbFareShuttleTransformer',
        IbFareShuttleTransformer
    );
}
