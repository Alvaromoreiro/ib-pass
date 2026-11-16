import angular from "angular";
import dayjs from 'dayjs';
import { ConsolidatedPetItem } from "../components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/models/petc-info.model";

@Service(
    'ib-MmB-booking-dashboard-module',
    ['MmBCurrencyService', 'localStorageService', '$filter', 'MmBAppConstants'],
    [])
export class InvoiceDashboardTransformer {

    constructor(
        private MmBCurrencyService,
        private localStorageService,
        private $filter,
        private MmBAppConstants
    ) { }

    getInvoiceDataInfo = (getBookingInfo, InfoManagement, countInfants, flightsSlices, breakDownInfo) => {
        let totalPriceFinal, totalDiscount, type, originalBaggages, originalSeats, originalPriority, priorityPricesByType, seatsPricesByType, originalSpecialEquipment, specialEquipmentPricesByType,
            passPricesByType, baggagesPricesByType, sliceCities: any = {}, paidSeat = false, paidPriority = false, paidBaggage = false, paidSpecialEquipment = false,
            elemSliceId, elemSegmentId, j, userType, farePrice, currency, baggage, tempFlight, specialEquipment;

        if (getBookingInfo.contextMetadata.currencies && getBookingInfo.contextMetadata.currencies[0]) {
            currency = getBookingInfo.contextMetadata.currencies[0];
        }

        if (InfoManagement?.orderItems?.flight[0]?.price) {
            InfoManagement.orderItems.flight[0].price.pendingPrices = 0;
            InfoManagement.orderItems.flight[0].price.preFormatedTotal = getBookingInfo.order.price.total;
            InfoManagement.orderItems.flight[0].price.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.total, true);
            InfoManagement.orderItems.flight[0].price.fare = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.fare, true);
            InfoManagement.orderItems.flight[0].price.tax = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.tax, true);
        } else {
            InfoManagement.orderItems.flight[0].price = {};
        }
        InfoManagement.orderItems.flight[0].price.totalDiscount = 0;
        if (InfoManagement.orderItems.insurance) InfoManagement.orderItems.flight[0].price.insurancePrices = angular.copy(InfoManagement.orderItems.insurance);
        if (InfoManagement.orderItems.insurance && InfoManagement.orderItems.flight[0].price.insurancePrices[0].price) {
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].units = InfoManagement.orderItems.flight[0].passengerPrices.length - countInfants;
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.preFormatedFare = InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.fare / (InfoManagement.orderItems.flight[0].price.insurancePrices[0].units);
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.preFormatedTotal = InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.total;
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.fare = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.preFormatedFare, true);
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.preFormatedTotal, true);
        }
        InfoManagement.orderItems.allianzFusion ? InfoManagement.orderItems.flight[0].price.insurancePrices = angular.copy(InfoManagement.orderItems.allianzFusion) : null;
        if (InfoManagement.orderItems.allianzFusion && InfoManagement.orderItems.flight[0].price.insurancePrices[0].price) {
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].units = InfoManagement.orderItems.flight[0].passengerPrices.length - countInfants;
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.preFormatedFare = InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.fare / (InfoManagement.orderItems.flight[0].price.insurancePrices[0].units);
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.preFormatedTotal = InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.total;
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.fare = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.preFormatedFare, true);
            InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.insurancePrices[0].price.preFormatedTotal, true);
        }
        if (InfoManagement.orderItems.flexibilityOnDemand) {
            InfoManagement.orderItems.flight[0].price.flexibilityOnDemand = angular.copy(InfoManagement.orderItems.flexibilityOnDemand);
            if (InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price) {
                InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].units = InfoManagement.orderItems.flight[0].passengerPrices.length - countInfants;
                InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price.preFormatedFare = InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price.fare;
                InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price.preFormatedTotal = InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price.total * InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].units;
                InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price.fare = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price.preFormatedFare, true);
                InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0].price.preFormatedTotal, true);
                this.localStorageService.set('flexibilityConditions', InfoManagement.orderItems.flight[0].price.flexibilityOnDemand[0]);
            }
        } 
        if (getBookingInfo.paymentItems) {
            j = 0;

            InfoManagement.orderItems.flight[0].price.otherPricesByType = [];

            while (j < getBookingInfo.paymentItems.length) {
                if (getBookingInfo.paymentItems[j].type === 'CREDITCARD' || getBookingInfo.paymentItems[j].type === 'EXTERNAL_CREDITCARD' || getBookingInfo.paymentItems[j].type === 'IBERIA_PAY') {
                    getBookingInfo.paymentItems[j].description = this.$filter('translate')('MMB_CREDITCARD_PAYMENT_FEE_TEXT');
                    getBookingInfo.paymentItems[j].totalFee = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.paymentItems[j].totalFee, true);
                    InfoManagement.orderItems.flight[0].price.otherPricesByType.push(getBookingInfo.paymentItems[j]);
                    InfoManagement.orderItems.flight[0].price.finalPrices = getBookingInfo.order.price;
                    InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.finalPrices.total, true);

                    getBookingInfo.paymentItems[j].hide = false;

                    if (angular.isDefined(getBookingInfo.order) && angular.isDefined(getBookingInfo.order.orderItems)) {
                        getBookingInfo.paymentItems[j].totalFee = 0;
                        getBookingInfo.order.orderItems.forEach((element) => {
                            if (element.type === 'creditCardFee') {
                                getBookingInfo.paymentItems[j].hide = true;
                                getBookingInfo.paymentItems[j].totalFee += element.price.total;
                            }
                        });
                        getBookingInfo.paymentItems[j].totalFee = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.paymentItems[j].totalFee, true);
                    }

                } else if (getBookingInfo.paymentItems[j].type === 'PAYPAL' || getBookingInfo.paymentItems[j].type === 'IBERIA_PAY_AFOP') {
                    if (getBookingInfo.paymentItems[j].total !== null && angular.isDefined(getBookingInfo.paymentItems[j].total)) {
                        getBookingInfo.paymentItems[j].description = this.$filter('translate')('MMB_PAYPAL_PAYMENT_FEE_TEXT');
                        getBookingInfo.paymentItems[j].totalFee = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.paymentItems[j].totalFee, true);
                        InfoManagement.orderItems.flight[0].price.otherPricesByType.push(angular.copy(getBookingInfo.paymentItems[j]));
                        InfoManagement.orderItems.flight[0].price.finalPrices = getBookingInfo.order.price;
                        InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.finalPrices.total, true);
                    } else {
                        getBookingInfo.paymentItems[j].description = this.$filter('translate')('MMB_PAYPAL_PAYMENT_FEE_TEXT');
                        getBookingInfo.paymentItems[j].totalFee = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.order.price.total, true);
                        InfoManagement.orderItems.flight[0].price.otherPricesByType.push(angular.copy(getBookingInfo.paymentItems[j]));
                        InfoManagement.orderItems.flight[0].price.finalPrices = getBookingInfo.order.price;
                        getBookingInfo.paymentItems[j].total = getBookingInfo.order.price.total;
                        getBookingInfo.paymentItems[j].total = getBookingInfo.order.price.subtotal;
                        getBookingInfo.paymentItems[j].totalFee = getBookingInfo.order.price.subtotal;
                        InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.order.price.total, true);
                    }
                } else if ((getBookingInfo.paymentItems[j].type === 'VOUCHER') || (getBookingInfo.paymentItems[j].type === 'AVIOS') || (getBookingInfo.paymentItems[j].type === 'AVIOS_REDEMPTION')) {
                    type = getBookingInfo.paymentItems[j].type.indexOf('VOUCHER') > -1 ? this.$filter('translate')('MMB_VOUCHER_PAYMENT_FEE_TEXT') : this.$filter('translate')('MMB_AVIOS_PAYMENT_FEE_TEXT');
                    getBookingInfo.paymentItems[j].description = type;
                    getBookingInfo.paymentItems[j].totalFee = angular.isUndefined(getBookingInfo.paymentItems[j].total) ? this.$filter('aviosFormatter')(InfoManagement.orderItems.flight[0].aviosRedeemed) : '-' + this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.paymentItems[j].total, true);
                    totalDiscount = angular.isUndefined(getBookingInfo.paymentItems[j].total) ? 0 : getBookingInfo.paymentItems[j].total;
                    InfoManagement.orderItems.flight[0].price.totalDiscount = InfoManagement.orderItems.flight[0].price.totalDiscount ? InfoManagement.orderItems.flight[0].price.totalDiscount + totalDiscount : totalDiscount;
                    InfoManagement.orderItems.flight[0].price.otherPricesByType.push(angular.copy(getBookingInfo.paymentItems[j]));
                    totalPriceFinal = (getBookingInfo.order.price.fare + getBookingInfo.order.price.tax);
                    totalPriceFinal = (totalPriceFinal - totalDiscount);
                    InfoManagement.orderItems.flight[0].price.finalPrices = getBookingInfo.order.price;
                    InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), totalPriceFinal, true);
                    InfoManagement.orderItems.flight[0].price.total = totalPriceFinal;
                    if (getBookingInfo.paymentItems[j].type === 'AVIOS') {
                        InfoManagement.aviosRedeemed = true;
                        InfoManagement.aviosRedeemedAmount = getBookingInfo.paymentItems[j].total;
                    }

                } else if (getBookingInfo.paymentItems[j].type === 'TOKENIZED_CARD') {
                    getBookingInfo.paymentItems[j].description = this.$filter('translate')('MMB_CREDITCARD_PAYMENT_FEE_TEXT');
                    getBookingInfo.paymentItems[j].totalFee = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.paymentItems[j].totalFee, true);
                    InfoManagement.orderItems.flight[0].price.otherPricesByType.push(angular.copy(getBookingInfo.paymentItems[j]));
                    InfoManagement.orderItems.flight[0].price.finalPrices = getBookingInfo.order.price;
                    InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.finalPrices.total, true);
                } else if (getBookingInfo.paymentItems[j].type === 'DONATION') {
                    getBookingInfo.paymentItems[j].description = getBookingInfo.paymentItems[j].partner ? getBookingInfo.paymentItems[j].partner : this.$filter('translate')('MMB_OTHER_PAYMENTS_TEXT');
                    getBookingInfo.paymentItems[j].totalFee = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.paymentItems[j].quantity, true);
                    InfoManagement.orderItems.flight[0].price.otherPricesByType.push(angular.copy(getBookingInfo.paymentItems[j]));
                    InfoManagement.orderItems.flight[0].price.finalPrices = getBookingInfo.order.price;
                    InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.finalPrices.total, true);
                } else if (getBookingInfo.paymentItems[j].type === 'OTHERS' || getBookingInfo.paymentItems[j].type === 'BUTTON') {
                    getBookingInfo.paymentItems[j].description = this.$filter('translate')('MMB_OTHER_PAYMENTS_TEXT');
                    getBookingInfo.paymentItems[j].totalFee = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), getBookingInfo.paymentItems[j].totalFee, true);
                    InfoManagement.orderItems.flight[0].price.otherPricesByType.push(angular.copy(getBookingInfo.paymentItems[j]));
                    InfoManagement.orderItems.flight[0].price.finalPrices = getBookingInfo.order.price;
                    InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.finalPrices.total, true);
                }
                j++;
            }

            InfoManagement.orderItems.flight[0].price.otherPricesByType.push({
                totalFee: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.ticketingFee, true),
                description: this.$filter('translate')('MMB_ADMINISTRATION_FEE_TEXT')
            });
        } else if (getBookingInfo.order.price) {
            InfoManagement.orderItems.flight[0].price.finalPrices = getBookingInfo.order.price;
            InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].price.finalPrices.total, true);
        }

        if (InfoManagement.orderItems.flight[0].passengerPrices && InfoManagement.orderItems.flight[0].passengerPrices[0].price) {
            InfoManagement.orderItems.flight[0].price.passPricesByType = {};
            passPricesByType = InfoManagement.orderItems.flight[0].price.passPricesByType;
            for (let tIndex = 0; tIndex < InfoManagement.orderItems.flight[0].passengerPrices.length; tIndex++) {
                if (InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price) {
                    userType = InfoManagement.orderItems.flight[0].passengerPrices[tIndex].passengerId.replace(this.MmBAppConstants.MmBPatterns.ONLY_LETTERS, '');
                    if (InfoManagement.orderItems.flight[0].price && !passPricesByType[userType]) {

                        passPricesByType[userType] = {
                            type: userType,
                            description: this.$filter('translate')(userType),
                            currency: InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price.currency,
                            fare: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price.fare, true),
                            tax: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price.tax, true),
                            ticketingFee: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price.ticketingFee, true),
                            total: InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price.total,
                            preFormatedTotal: InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price.total,
                            baseTotal: InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price.total,
                            points: InfoManagement.orderItems.flight[0].passengerPrices[0].points || InfoManagement.orderItems.flight[0].passengerPrices[tIndex].aviosRedeemed,
                            units: 1,
                            symbol: getBookingInfo.contextMetadata.currencies[0] ? getBookingInfo.contextMetadata.currencies[0].symbol : ''
                        };
                        if (InfoManagement.orderItems.flight[0].price.finalPrices) {
                            InfoManagement.orderItems.flight[0].price.finalPrices.totalAvios = InfoManagement.orderItems.flight[0].totalPoints || InfoManagement.orderItems.flight[0].aviosRedeemed;
                        }
                        if (InfoManagement.orderItems.flight[0].passengerPrices[0].points) {
                            InfoManagement.orderItems.flight[0].price.typeDiscount = 'points';
                        } else if (InfoManagement.orderItems.flight[0].passengerPrices[0].aviosRedeemed) {
                            InfoManagement.orderItems.flight[0].price.typeDiscount = 'avios';
                        }
                        InfoManagement.orderItems.flight[0].price.showAvios = angular.isDefined(passPricesByType[userType].points);
                    } else {
                        passPricesByType[userType].units = (passPricesByType[userType].units || 0) + 1;
                        passPricesByType[userType].preFormatedTotal = passPricesByType[userType].preFormatedTotal + InfoManagement.orderItems.flight[0].passengerPrices[tIndex].price.total;
                        passPricesByType[userType].total = passPricesByType[userType].preFormatedTotal;
                    }
                    passPricesByType[userType].total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), passPricesByType[userType].total, true);
                }
            }
        }
        //////
        if (InfoManagement.orderItems.priorityBoarding) {
            InfoManagement.orderItems.flight[0].price.priorityPricesByType = {};

            originalPriority = angular.copy(InfoManagement.orderItems.priorityBoarding);
            InfoManagement.orderItems.priorityBoarding = [];

            for (let sIndex = 0; sIndex < InfoManagement.flights.length; sIndex++) {
                for (let tIndex = 0; tIndex < originalPriority.length; tIndex++) {
                    if (InfoManagement.flights[sIndex].sliceId === originalPriority[tIndex].sliceId || InfoManagement.flights[sIndex].segmentId === originalPriority[tIndex].segmentId) {
                        InfoManagement.orderItems.priorityBoarding.push(originalPriority[tIndex]);
                    }
                }
            }

            for (let tIndex = 0; tIndex < InfoManagement.orderItems.priorityBoarding.length; tIndex++) {
                if (InfoManagement.orderItems.priorityBoarding[tIndex].segmentId) {
                    if (InfoManagement.orderItems.priorityBoarding[tIndex].price) {
                        if (InfoManagement.orderItems.priorityBoarding[tIndex].emd !== 'PENDING_PAYMENT') {
                            paidPriority = true;
                            elemSegmentId = InfoManagement.orderItems.priorityBoarding[tIndex].segmentId;
                            if (!InfoManagement.orderItems.flight[0].price.priorityPricesByType[elemSegmentId]) {
                                priorityPricesByType = InfoManagement.orderItems.flight[0].price.priorityPricesByType[elemSegmentId] = {};
                            } else {
                                priorityPricesByType = InfoManagement.orderItems.flight[0].price.priorityPricesByType[elemSegmentId];
                            }
                            farePrice = InfoManagement.orderItems.priorityBoarding[tIndex].price.fare;
                            if (InfoManagement.orderItems.flight[0].price && !priorityPricesByType[farePrice]) {
                                priorityPricesByType[farePrice] = {
                                    emd: InfoManagement.orderItems.priorityBoarding[tIndex].emd,
                                    type: InfoManagement.orderItems.priorityBoarding[tIndex].type,
                                    currency: InfoManagement.orderItems.priorityBoarding[tIndex].price.currency,
                                    fare: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.priorityBoarding[tIndex].price.fare, true),
                                    tax: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.priorityBoarding[tIndex].price.tax, true),
                                    ticketingFee: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.priorityBoarding[tIndex].price.ticketingFee, true),
                                    total: InfoManagement.orderItems.priorityBoarding[tIndex].price.total,
                                    preFormatedTotal: InfoManagement.orderItems.priorityBoarding[tIndex].price.total,
                                    baseTotal: InfoManagement.orderItems.priorityBoarding[tIndex].price.total,
                                    departureCity: InfoManagement.orderItems.priorityBoarding[tIndex].departureCity,
                                    departureCityCode: InfoManagement.orderItems.priorityBoarding[tIndex].departureCityCode,
                                    arrivalCity: InfoManagement.orderItems.priorityBoarding[tIndex].arrivalCity,
                                    arrivalCityCode: InfoManagement.orderItems.priorityBoarding[tIndex].arrivalCityCode,
                                    units: 1,
                                    symbol: getBookingInfo.contextMetadata.currencies[0] ? getBookingInfo.contextMetadata.currencies[0].symbol : ''
                                };
                            } else {
                                priorityPricesByType[farePrice].units = (priorityPricesByType[farePrice].units || 0) + 1;
                                priorityPricesByType[farePrice].preFormatedTotal = priorityPricesByType[farePrice].preFormatedTotal + InfoManagement.orderItems.priorityBoarding[tIndex].price.total;
                                priorityPricesByType[farePrice].total = priorityPricesByType[farePrice].preFormatedTotal;
                            }
                            priorityPricesByType[farePrice].total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), priorityPricesByType[farePrice].total, true);
                        } else {
                            InfoManagement.orderItems.flight[0].price.pendingPrices += InfoManagement.orderItems.priorityBoarding[tIndex].price.total;
                        }

                    }
                }
            }
            InfoManagement.orderItems.flight[0].price.paidPriority = paidPriority;
        }
        /////
        if (InfoManagement.orderItems.seat) {
            InfoManagement.orderItems.flight[0].price.seatsPricesByType = {};

            originalSeats = angular.copy(InfoManagement.orderItems.seat);
            InfoManagement.orderItems.seat = [];

            for (let sIndex = 0; sIndex < InfoManagement.flights.length; sIndex++) {
                for (let tIndex = 0; tIndex < originalSeats.length; tIndex++) {
                    if (InfoManagement.flights[sIndex].sliceId === originalSeats[tIndex].sliceId || InfoManagement.flights[sIndex].segmentId === originalSeats[tIndex].segmentId) {
                        InfoManagement.orderItems.seat.push(originalSeats[tIndex]);
                    }
                }
            }

            for (let tIndex = 0; tIndex < InfoManagement.orderItems.seat.length; tIndex++) {
                if (InfoManagement.orderItems.seat[tIndex].segmentId) {
                    if (InfoManagement.orderItems.seat[tIndex].price) {
                        if (InfoManagement.orderItems.seat[tIndex].emd !== 'PENDING_PAYMENT') {
                            paidSeat = true;
                            elemSegmentId = InfoManagement.orderItems.seat[tIndex].segmentId;
                            if (!InfoManagement.orderItems.flight[0].price.seatsPricesByType[elemSegmentId]) {
                                seatsPricesByType = InfoManagement.orderItems.flight[0].price.seatsPricesByType[elemSegmentId] = {};
                            } else {
                                seatsPricesByType = InfoManagement.orderItems.flight[0].price.seatsPricesByType[elemSegmentId];
                            }
                            farePrice = InfoManagement.orderItems.seat[tIndex].price.fare;
                            if (InfoManagement.orderItems.flight[0].price && !seatsPricesByType[farePrice]) {
                                seatsPricesByType[farePrice] = {
                                    emd: InfoManagement.orderItems.seat[tIndex].emd,
                                    type: InfoManagement.orderItems.seat[tIndex].type,
                                    currency: InfoManagement.orderItems.seat[tIndex].price.currency,
                                    fare: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.seat[tIndex].price.fare, true),
                                    tax: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.seat[tIndex].price.tax, true),
                                    ticketingFee: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), InfoManagement.orderItems.seat[tIndex].price.ticketingFee, true),
                                    total: InfoManagement.orderItems.seat[tIndex].price.total,
                                    preFormatedTotal: InfoManagement.orderItems.seat[tIndex].price.total,
                                    baseTotal: InfoManagement.orderItems.seat[tIndex].price.total,
                                    units: 1,
                                    departureCity: InfoManagement.orderItems.seat[tIndex].departureCity,
                                    departureCityCode: InfoManagement.orderItems.seat[tIndex].departureCityCode,
                                    arrivalCity: InfoManagement.orderItems.seat[tIndex].arrivalCity,
                                    arrivalCityCode: InfoManagement.orderItems.seat[tIndex].arrivalCityCode,
                                    symbol: getBookingInfo.contextMetadata.currencies[0] ? getBookingInfo.contextMetadata.currencies[0].symbol : ''
                                };
                            } else {
                                seatsPricesByType[farePrice].units = (seatsPricesByType[farePrice].units || 0) + 1;
                                seatsPricesByType[farePrice].preFormatedTotal = seatsPricesByType[farePrice].preFormatedTotal + InfoManagement.orderItems.seat[tIndex].price.total;
                                seatsPricesByType[farePrice].total = seatsPricesByType[farePrice].preFormatedTotal;
                            }
                            seatsPricesByType[farePrice].total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), seatsPricesByType[farePrice].total, true);
                        } else {
                            InfoManagement.orderItems.flight[0].price.pendingPrices += InfoManagement.orderItems.seat[tIndex].price.total;
                        }

                    }
                }
            }
            InfoManagement.orderItems.flight[0].price.paidSeat = paidSeat;
        }

        if (InfoManagement.orderItems.upgradingBid) {
            InfoManagement.orderItems.flight[0].price.upgradingBid = [];
            InfoManagement.orderItems.upgradingBid.forEach((segment) => {
                const info = { ...segment };
                info.price.fare = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), info.price.fare, true);
                info.price.tax = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), info.price.tax, true);
                info.price.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), info.price.total, true);
                InfoManagement.orderItems.flight[0].price.upgradingBid.push(info);
            });
        }
        if (InfoManagement.orderItems.petc) {
            InfoManagement.orderItems.flight[0].price.petc = [];
            const consolidated = new Map<string, ConsolidatedPetItem>();

            InfoManagement.orderItems.petc.forEach((item) => {
                item.price.fareFormatted = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), item.price.fare, true);
                const groupKey = `${item.sliceId}-${item.price.fare}`;

                if (consolidated.has(groupKey)) {
                    const existingItem = consolidated.get(groupKey)!;
                    existingItem.quantity += 1;
                    existingItem.totalSum += item.price.total;
                    existingItem.totalSumFormatted = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), existingItem.totalSum, true);
                } else {
                    const slice = flightsSlices.find(slice => slice.segments.find(segment => segment.sliceId === item.sliceId));
                    consolidated.set(groupKey, {
                        ...item,
                        quantity: 1,
                        totalSum: item.price.total,
                        totalSumFormatted: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), item.price.total, true),
                        departureCity: slice.departureCity,
                        arrivalCity: slice.arrivalCity
                    });
                }
            });
            InfoManagement.orderItems.flight[0].price.petc = Array.from(consolidated.values());
        }

        if (InfoManagement.orderItems.specialEquipment) {
            InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType = {};

            originalSpecialEquipment = angular.copy(InfoManagement.orderItems.specialEquipment);
            InfoManagement.orderItems.specialEquipment = [];
            tempFlight = '';
            for (let sIndex = 0; sIndex < InfoManagement.flights.length; sIndex++) {
                if (tempFlight !== InfoManagement.flights[sIndex].sliceId) {
                    for (let tIndex = 0; tIndex < originalSpecialEquipment.length; tIndex++) {
                        if (InfoManagement.flights[sIndex].sliceId === originalSpecialEquipment[tIndex].sliceId || InfoManagement.flights[sIndex].segmentId === originalSpecialEquipment[tIndex].segmentId) {
                            InfoManagement.orderItems.specialEquipment.push(originalSpecialEquipment[tIndex]);
                        }
                    }
                }
                tempFlight = angular.copy(InfoManagement.flights[sIndex].sliceId);
            }

            for (let tIndex = 0; tIndex < InfoManagement.orderItems.specialEquipment.length; tIndex++) {
                if (InfoManagement.orderItems.specialEquipment[tIndex].sliceId) {
                    if (InfoManagement.orderItems.specialEquipment[tIndex].price) {
                        for (let sIndex = 0; sIndex < flightsSlices.length; sIndex++) {
                            if (InfoManagement.orderItems.flight[0].sliceIds[sIndex] === InfoManagement.orderItems.specialEquipment[tIndex].sliceId) {
                                sliceCities.departureCity = flightsSlices[sIndex].departureCity.city.description;
                                sliceCities.departureCityCode = flightsSlices[sIndex].departureCity.code;
                                sliceCities.arrivalCity = flightsSlices[sIndex].arrivalCity.city.description;
                                sliceCities.arrivalCityCode = flightsSlices[sIndex].arrivalCity.code;
                                elemSliceId = InfoManagement.orderItems.flight[0].sliceIds[sIndex];
                                if (!InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType[elemSliceId]) {
                                    specialEquipmentPricesByType = InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType[elemSliceId] = {};

                                } else {
                                    specialEquipmentPricesByType = InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType[elemSliceId];
                                }
                            }
                        }

                        farePrice = InfoManagement.orderItems.specialEquipment[tIndex].price.fare / InfoManagement.orderItems.specialEquipment[tIndex].amount;
                        specialEquipment = InfoManagement.orderItems.specialEquipment[tIndex];

                        if (specialEquipment.emd !== 'PENDING_PAYMENT') {
                            paidSpecialEquipment = true;
                            if (InfoManagement.orderItems.flight[0].price && !specialEquipmentPricesByType[farePrice]) {
                                specialEquipmentPricesByType[farePrice] = {
                                    emd: specialEquipment.emd,
                                    type: specialEquipment.type,
                                    currency: specialEquipment.price.currency,
                                    fare: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), specialEquipment.price.fare / specialEquipment.amount, true),
                                    tax: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), specialEquipment.price.tax, true),
                                    ticketingFee: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), specialEquipment.price.ticketingFee, true),
                                    total: specialEquipment.price.total,
                                    preFormatedTotal: specialEquipment.price.total,
                                    baseTotal: specialEquipment.price.total,
                                    units: specialEquipment.amount,
                                    departureCity: sliceCities.departureCity,
                                    departureCityCode: sliceCities.departureCityCode,
                                    arrivalCity: sliceCities.arrivalCity,
                                    arrivalCityCode: sliceCities.arrivalCityCode,
                                    symbol: getBookingInfo.contextMetadata.currencies[0] ? getBookingInfo.contextMetadata.currencies[0].symbol : '',
                                    passengerId: specialEquipment.passengerId,
                                    subtype: specialEquipment.subtype
                                };
                            } else {
                                specialEquipmentPricesByType[farePrice].units = (specialEquipmentPricesByType[farePrice].units || 0) + specialEquipment.amount;
                                specialEquipmentPricesByType[farePrice].preFormatedTotal = specialEquipmentPricesByType[farePrice].preFormatedTotal + specialEquipment.price.total;
                                specialEquipmentPricesByType[farePrice].total = specialEquipmentPricesByType[farePrice].preFormatedTotal;
                            }
                        } else {
                            InfoManagement.orderItems.flight[0].price.pendingPrices += specialEquipment.price.total;
                        }

                        specialEquipmentPricesByType[farePrice].total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), specialEquipmentPricesByType[farePrice].total, true);
                    }
                }
            }
            this.checkBundleSpeqs(breakDownInfo, InfoManagement, currency);
            InfoManagement.orderItems.flight[0].price.paidSpecialEquipment = paidSpecialEquipment;
        }

        if (InfoManagement.orderItems.globickV2) {
            const globickExperience = [];
            const globickTransfers = [];
            const newGlobickInfo: any = {};

            InfoManagement.orderItems.globickV2.forEach((info) => {
                info.items.forEach((item) => {
                    if (item.product === 'EXP') {
                        globickExperience.push(item);
                    } else if (item.product === 'TRANS') {
                        globickTransfers.push(item);
                    }
                });
            });
            this.formatDate(globickTransfers);
            InfoManagement.orderItems.flight[0].price.globickExperience = globickExperience;
            InfoManagement.orderItems.flight[0].price.globickTransfers = globickTransfers;

            InfoManagement.orderItems.flight[0].price.globickExperience.forEach((experience) => {
                if (experience.price) {
                    experience.price = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), experience.price, true);
                }
            });

            InfoManagement.orderItems.flight[0].price.globickTransfers.forEach((transfers) => {
                if (transfers.price) {
                    transfers.price = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), transfers.price, true);
                }
            });

            newGlobickInfo.globickExperience = globickExperience;
            newGlobickInfo.globickTransfers = globickTransfers;
            InfoManagement.orderItems.globickV2 = newGlobickInfo;
        }

        if (InfoManagement.orderItems.globick) {
            const globickExperience = [];
            const globickTransfers = [];
            const newGlobickInfo: any = {};

            InfoManagement.orderItems.globick.forEach((info) => {
                if (info.product === 'EXP') {
                    globickExperience.push(info);
                } else if (info.product === 'TRANS') {
                    globickTransfers.push(info);
                }
            });
            this.formatDate(globickTransfers);
            InfoManagement.orderItems.flight[0].price.globickExperience = globickExperience;
            InfoManagement.orderItems.flight[0].price.globickTransfers = globickTransfers;

            InfoManagement.orderItems.flight[0].price.globickExperience.forEach((experience) => {
                if (experience.price && experience.price.total) {
                    experience.price.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), experience.price.total, true);
                }
            });

            InfoManagement.orderItems.flight[0].price.globickTransfers.forEach((transfers) => {
                if (transfers.price && transfers.price.total) {
                    transfers.price.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), transfers.price.total, true);
                }
            });

            newGlobickInfo.globickExperience = globickExperience;
            newGlobickInfo.globickTransfers = globickTransfers;
            InfoManagement.orderItems.globick = newGlobickInfo;
            // InfoManagement.orderItems.globickExperience = globickExperience;
            // InfoManagement.orderItems.globickTransfers = globickTransfers;
        }

        if (InfoManagement.orderItems.baggage) {
            InfoManagement.orderItems.flight[0].price.baggagesPricesByType = {};

            originalBaggages = angular.copy(InfoManagement.orderItems.baggage);
            InfoManagement.orderItems.baggage = [];
            tempFlight = '';
            for (let sIndex = 0; sIndex < InfoManagement.flights.length; sIndex++) {
                if (tempFlight !== InfoManagement.flights[sIndex].sliceId) {
                    for (let tIndex = 0; tIndex < originalBaggages.length; tIndex++) {
                        if (InfoManagement.flights[sIndex].sliceId === originalBaggages[tIndex].sliceId || InfoManagement.flights[sIndex].segmentId === originalBaggages[tIndex].segmentId) {
                            InfoManagement.orderItems.baggage.push(originalBaggages[tIndex]);
                        }
                    }
                }
                tempFlight = angular.copy(InfoManagement.flights[sIndex].sliceId);
            }

            for (let tIndex = 0; tIndex < InfoManagement.orderItems.baggage.length; tIndex++) {
                if (InfoManagement.orderItems.baggage[tIndex].sliceId) {
                    if (InfoManagement.orderItems.baggage[tIndex].price) {
                        for (let sIndex = 0; sIndex < flightsSlices.length; sIndex++) {
                            if (InfoManagement.orderItems.flight[0].sliceIds[sIndex] === InfoManagement.orderItems.baggage[tIndex].sliceId) {
                                sliceCities.departureCity = flightsSlices[sIndex].departureCity.city.description;
                                sliceCities.departureCityCode = flightsSlices[sIndex].departureCity.code;
                                sliceCities.arrivalCity = flightsSlices[sIndex].arrivalCity.city.description;
                                sliceCities.arrivalCityCode = flightsSlices[sIndex].arrivalCity.code;
                                elemSliceId = InfoManagement.orderItems.flight[0].sliceIds[sIndex];
                                if (!InfoManagement.orderItems.flight[0].price.baggagesPricesByType[elemSliceId]) {
                                    baggagesPricesByType = InfoManagement.orderItems.flight[0].price.baggagesPricesByType[elemSliceId] = {};

                                } else {
                                    baggagesPricesByType = InfoManagement.orderItems.flight[0].price.baggagesPricesByType[elemSliceId];
                                }
                            }
                        }
                        farePrice = InfoManagement.orderItems.baggage[tIndex].price.fare / InfoManagement.orderItems.baggage[tIndex].amount;
                        baggage = InfoManagement.orderItems.baggage[tIndex];
                        if (baggage.emd !== 'PENDING_PAYMENT') {
                            paidBaggage = true;
                            if (InfoManagement.orderItems.flight[0].price && !baggagesPricesByType[farePrice]) {
                                baggagesPricesByType[farePrice] = {
                                    emd: baggage.emd,
                                    type: baggage.type,
                                    currency: baggage.price.currency,
                                    fare: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), baggage.price.fare / baggage.amount, true),
                                    tax: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), baggage.price.tax, true),
                                    ticketingFee: this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), baggage.price.ticketingFee, true),
                                    total: baggage.price.total,
                                    preFormatedTotal: baggage.price.total,
                                    baseTotal: baggage.price.total,
                                    units: baggage.amount,
                                    departureCity: sliceCities.departureCity,
                                    departureCityCode: sliceCities.departureCityCode,
                                    arrivalCity: sliceCities.arrivalCity,
                                    arrivalCityCode: sliceCities.arrivalCityCode,
                                    symbol: getBookingInfo.contextMetadata.currencies[0] ? getBookingInfo.contextMetadata.currencies[0].symbol : ''
                                };
                            } else {
                                baggagesPricesByType[farePrice].units = (baggagesPricesByType[farePrice].units || 0) + baggage.amount;
                                baggagesPricesByType[farePrice].preFormatedTotal = baggagesPricesByType[farePrice].preFormatedTotal + baggage.price.total;
                                baggagesPricesByType[farePrice].total = baggagesPricesByType[farePrice].preFormatedTotal;
                            }
                        } else {
                            InfoManagement.orderItems.flight[0].price.pendingPrices += baggage.price.total;
                        }

                        baggagesPricesByType[farePrice].total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), baggagesPricesByType[farePrice].total, true);
                    }
                }
            }
            InfoManagement.orderItems.flight[0].price.paidBaggage = paidBaggage;
        }

        if (InfoManagement.orderItems.co2Footprint) {
            const orderItemsCarbonFootprint = InfoManagement.orderItems.co2Footprint[0];
            InfoManagement.orderItems.co2Footprint[0].kilosCo2EquivalentFormatted = orderItemsCarbonFootprint.kilosCo2Equivalent ? orderItemsCarbonFootprint.kilosCo2Equivalent.toString().replace('.', ',') : '';
            InfoManagement.orderItems.co2Footprint[0].price.totalFormatted = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), orderItemsCarbonFootprint.price.total, true).replace(' ', '');
            InfoManagement.orderItems.flight[0].price.paidCarbonFootprint = true;
            InfoManagement.co2Footprint = InfoManagement.orderItems.co2Footprint[0];
        } else {
            InfoManagement.co2FootprintInfo = { showCarbonFootprintInfo: true };
        }

        if (InfoManagement.orderItems.flight[0].price && InfoManagement.orderItems.flight[0].price.finalPrices) {
            let pricesByType = InfoManagement.orderItems.flight[0].price.otherPricesByType;
            let totalPaid = 0;

            if (Array.isArray(pricesByType)) {
                pricesByType.forEach(type => {
                    if (type.quantity != null && type.quantity > 0) {
                        totalPaid += type.quantity;
                    }
                })
            };
            InfoManagement.orderItems.flight[0].price.finalPrices.totalPaid = totalPaid;
            let calculatedTotal = InfoManagement.orderItems.flight[0].price.preFormatedTotal - InfoManagement.orderItems.flight[0].price.pendingPrices;
            InfoManagement.orderItems.flight[0].price.finalPrices.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), (calculatedTotal - InfoManagement.orderItems.flight[0].price.totalDiscount + totalPaid), true);
        }

        this.checkBundleBaggages(breakDownInfo, InfoManagement, currency);
        return InfoManagement.orderItems.flight[0].price;
    }

    private formatDate = (array): void => {
        array.forEach(element => {
            if (element.startDate) {
                element.startDate = element.startDate.split(' ')[0].replaceAll('-', '/');
            }
        });
    }

    private checkBundleSpeqs = (breakDownInfo, InfoManagement, currency) => {
        if (breakDownInfo?.bundles?.length > 0 && breakDownInfo.bundles[0].items) {
            for (let i = 0; i < breakDownInfo.bundles[0].items.length; i++) {
                if (breakDownInfo.bundles[0].items[i].type === "SPECIAL_EQUIPMENT") {
                    let bundleQuantity = breakDownInfo.bundles[0].items[i].quantity;
                    const speqsFlight = InfoManagement.orderItems.flight[0];
                    let quantityPerFlight = bundleQuantity / speqsFlight.sliceIds.length;
                    this.localStorageService.set('bundleSpeqsPerFlight', { quantity: quantityPerFlight, subtype: breakDownInfo.bundles[0].items[i].subtype });
                    for (let j = 0; j < InfoManagement.orderItems.flight[0].sliceIds.length; j++) {
                        let specialEquipmentObject = InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType[InfoManagement.orderItems.flight[0].sliceIds[j]]?.[breakDownInfo.bundles[0].items[i].priceItem];
                        if (specialEquipmentObject) {
                            if (specialEquipmentObject.units === quantityPerFlight) {
                                delete InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType[InfoManagement.orderItems.flight[0].sliceIds[j]][breakDownInfo.bundles[0].items[i].priceItem];
                            }
                            else {
                                specialEquipmentObject.units = specialEquipmentObject.units - quantityPerFlight;
                                let speqTotalPrice = specialEquipmentObject.units * specialEquipmentObject.baseTotal;
                                specialEquipmentObject.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), speqTotalPrice, true);
                            }
                        }
                    };
                }
            }
            this.deleteEmptySpecialEquipmentPricesByType(InfoManagement)
        }
    }

    private deleteEmptySpecialEquipmentPricesByType = (InfoManagement) => {
        if (InfoManagement?.orderItems?.flight[0]?.price?.specialEquipmentPricesByType) {
            for (let i = 0; i < InfoManagement.orderItems.flight[0].sliceIds.length; i++) {
                let slice = InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType[InfoManagement.orderItems.flight[0].sliceIds[i]];
                if (slice && Object.keys(slice)?.length === 0) {
                    delete InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType[InfoManagement.orderItems.flight[0].sliceIds[i]];
                }
            }
            if (Object.keys(InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType).length === 0) {
                delete InfoManagement.orderItems.flight[0].price.specialEquipmentPricesByType;
            }
        }
    }

    private checkBundleBaggages = (breakDownInfo, InfoManagement, currency) => {
        if (breakDownInfo?.bundles?.length > 0 && breakDownInfo.bundles[0].items) {
            for (let i = 0; i < breakDownInfo.bundles[0].items.length; i++) {
                if (breakDownInfo.bundles[0].items[i].type === "BAGGAGE") {
                    let bundleQuantity = breakDownInfo.bundles[0].items[i].quantity;
                    const baggageFlight = InfoManagement.orderItems.flight[0];
                    let quantityPerFlight = bundleQuantity / baggageFlight.sliceIds.length;
                    this.localStorageService.set('bundleBaggsPerFlight', { quantity: quantityPerFlight, subtype: breakDownInfo.bundles[0].items[i].subtype, deleted: false });
                    for (let j = 0; j < InfoManagement.orderItems.flight[0].sliceIds.length; j++) {
                        let baggageObject = InfoManagement.orderItems.flight[0].price.baggagesPricesByType[InfoManagement.orderItems.flight[0].sliceIds[j]]?.[breakDownInfo.bundles[0].items[i].priceItem];
                        if (baggageObject) {
                            if (baggageObject.units === quantityPerFlight) {
                                delete InfoManagement.orderItems.flight[0].price.baggagesPricesByType[InfoManagement.orderItems.flight[0].sliceIds[j]][breakDownInfo.bundles[0].items[i].priceItem];
                            }
                            else {
                                baggageObject.units = baggageObject.units - quantityPerFlight;
                                let baggageTotalPrice = baggageObject.units * baggageObject.baseTotal;
                                baggageObject.total = this.MmBCurrencyService.formatPrice(this.MmBCurrencyService.getCurrencyObject(currency), baggageTotalPrice, true);
                            }
                        }
                    };
                }
            }
            this.deleteEmptyBaggagesPricesByType(InfoManagement);
        }
    }

    private deleteEmptyBaggagesPricesByType = (InfoManagement) => {
        if (InfoManagement?.orderItems?.flight[0]?.price?.baggagesPricesByType) {
            for (let i = 0; i < InfoManagement.orderItems.flight[0].sliceIds.length; i++) {
                let slice = InfoManagement.orderItems.flight[0].price.baggagesPricesByType[InfoManagement.orderItems.flight[0].sliceIds[i]];
                if (slice && Object.keys(slice)?.length === 0) {
                    delete InfoManagement.orderItems.flight[0].price.baggagesPricesByType[InfoManagement.orderItems.flight[0].sliceIds[i]];
                }
            }
            if (Object.keys(InfoManagement.orderItems.flight[0].price.baggagesPricesByType).length === 0) {
                delete InfoManagement.orderItems.flight[0].price.baggagesPricesByType;
            }
        }
    }
}
