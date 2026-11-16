@Service(
    'ib-MmB-services-module',
    ['localStorageService'],
    []
)
export class IbFlagsTransformer {
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService
        ) {
        }
        private marketAvailable: any;
        private getBookingInfo: any;

        private returnInfo = {
            'showRefundLink': false,
            'showChangeFlightLink': false,
            'showChangeFlightDeepLink': false,
            'showFlexibilizationChangeSection': false,
            'showVoluntaryChangeFlightSection': false,
            'showRefundCashSection': false,
            'showCashRefundOnline': false,
            'showRefundVoucherSection': false,
            'showRefundVoucherSectionFunctional': false,
            'refundVoucherSection80': false,
            'showModalRefound48hs': false,
            'showLinkToRubiQ': false,
            'showFlexibilizationExceptionalMsg': false,
            'hideCashRefundSection': true,
            'allowedRefundVoucher': false,
            'enableExternalRefundLink': false,
            'showContactCenterText': false,
            'showOnlyVoucherRefundText': false,
            'cashPartialRefund': false,
            'importOrderFromDeepLink': false,
            'slicesWithFlexibilization': {},
            'slicesWithChangeFlight': {},
            'sisterCitiesData': {
                'hasSistercitiesPossibility': false,
                'allowedSlices': []
            },
            'showMonetateAlertCFPhone': false,
            'allowedInvoluntaryFlightChange': false,
            'hideChangeFlightMenuOption': false,
            'showVoluntaryFlexibleFlightChange': false,
            'flightModificationActive': false,
            'flexibleFlight': false,
            'displayCCPhone': false,
            'showSimulation': false
        };

        private checkIfEveryFlagFrom(flags, flagsOrdered) {
            flags = [].concat(flags)
            return flags.every((flag) => {
                    return flagsOrdered[flag]
                });
        }


        private setOrderFlags() {
            if (!this.getBookingInfo.orderFlags)  return {};
                let flagsOrdered = {};
                this.getBookingInfo.orderFlags.forEach((flag)=>{
                    flagsOrdered[flag.type] = flag.enabled;
                });
                let checkIfEveryFlag = (flag) => this.checkIfEveryFlagFrom(flag, flagsOrdered);

            let orderFlagsReturnInfo = {
                    'showRefundLink': checkIfEveryFlag('CASH_REFUND') || checkIfEveryFlag('CASH_PARTIAL_REFUND') || checkIfEveryFlag('VOUCHER_REFUND'),
                    'showRefundCashSection':  checkIfEveryFlag('ALLOWED_REFUND_CASH') || checkIfEveryFlag('CASH_PARTIAL_REFUND'),
                    'showCashRefundOnline':  checkIfEveryFlag(['CASH_REFUND', 'ALLOWED_REFUND_CASH']) || checkIfEveryFlag('CASH_PARTIAL_REFUND'),
                    'showRefundVoucherSection': checkIfEveryFlag(['VOUCHER_REFUND', 'ALLOWED_REFUND_VOUCHER']) ||  (checkIfEveryFlag('VOUCHER_REFUND_ON_DEMAND') && this.getBookingInfo.flexibilizationCapabilitiesInformation == null),
                    'showRefundVoucherSectionFunctional': checkIfEveryFlag(['VOUCHER_REFUND', 'ALLOWED_REFUND_VOUCHER']) ||  (checkIfEveryFlag('VOUCHER_REFUND_ON_DEMAND') && this.getBookingInfo.flexibilizationCapabilitiesInformation == null),
                    'refundVoucherSection80': checkIfEveryFlag('VOUCHER_REFUND_ON_DEMAND') && this.getBookingInfo.flexibilizationCapabilitiesInformation == null,
                    'showModalRefound48hs': checkIfEveryFlag(['VOUCHER_REFUND_ON_DEMAND', 'VOUCHER_REFUND_RESTRICTION']),
                    'hideCashRefundSection': !checkIfEveryFlag('ALLOWED_REFUND_CASH'),
                    'cashPartialRefund': checkIfEveryFlag('CASH_PARTIAL_REFUND'),
                    'importOrderFromDeepLink': checkIfEveryFlag('IMPORT_ORDER_FROM_DEEPLINK'),
                    'allowedInvoluntaryFlightChange': checkIfEveryFlag('ALLOWED_INVOLUNTARY_FLIGHT_CHANGE'),
                    'voucherRefund': checkIfEveryFlag('VOUCHER_REFUND') || checkIfEveryFlag('VOUCHER_REFUND_ON_DEMAND'),
                    'cashRefund': checkIfEveryFlag('CASH_REFUND') || checkIfEveryFlag('CASH_PARTIAL_REFUND'),
                    'allowedRefundCash': checkIfEveryFlag('ALLOWED_REFUND_CASH') || checkIfEveryFlag('CASH_PARTIAL_REFUND'),
                    'allowedRefundVoucher':  checkIfEveryFlag('ALLOWED_REFUND_VOUCHER') || checkIfEveryFlag('VOUCHER_REFUND_ON_DEMAND'),
                    'allowedVoluntaryRefundCash': checkIfEveryFlag('ALLOWED_VOLUNTARY_REFUND_CASH'),
                    'allowedVoluntaryPartialRefundCash': checkIfEveryFlag('ALLOWED_VOLUNTARY_PARTIAL_REFUND_CASH'),
                    'showVoucherCashRefund': checkIfEveryFlag('CASH_REFUND') || checkIfEveryFlag('VOUCHER_REFUND') || checkIfEveryFlag('VOUCHER_REFUND_ON_DEMAND') || checkIfEveryFlag('CASH_PARTIAL_REFUND'),
                    'showSimulation': checkIfEveryFlag('FLIGHT_MODIFICATION_SIMULATION')
                };
            this.returnInfo = {...this.returnInfo, ...orderFlagsReturnInfo};

        };


        generateFlagsMenu(getBookingInfo){
            this.getBookingInfo = getBookingInfo;
            this.marketAvailable = this.isOrderMarketAvailable(this.getBookingInfo.contextMetadata);
            this.setOrderFlags();
             // Flexibilization
             if (this.getBookingInfo.order.slices) {
                this.getBookingInfo.order.slices.forEach((slice) => {
                    if (slice.passengerFlags) {
                        slice.passengerFlags.forEach( (passenger) => {
                            if (passenger.flags) {
                                passenger.flags.forEach( (flag) => {
                                    //Involuntary change flexibilization
                                    if (flag.type === 'FLIGHT_MODIFICATION_FLEXIBLE' && flag.enabled) {
                                        this.returnInfo.showChangeFlightLink = true;
                                        this.returnInfo.showFlexibilizationChangeSection = true;
                                        this.returnInfo.showMonetateAlertCFPhone = true;
                                        this.returnInfo.slicesWithFlexibilization[slice.sliceId] = true;
                                        this.returnInfo.sisterCitiesData.hasSistercitiesPossibility = true;
                                        this.returnInfo.sisterCitiesData.allowedSlices.push(slice);
                                        if (!this.returnInfo.allowedRefundVoucher) {
                                            this.returnInfo.showRefundVoucherSection = false;
                                            this.returnInfo.showRefundVoucherSectionFunctional = false;
                                        }
                                        if (!this.returnInfo.allowedInvoluntaryFlightChange) {
                                            this.returnInfo.hideChangeFlightMenuOption = true;
                                        }
                                    }
                                    //Voluntary Change
                                    if (flag.type === 'FLIGHT_MODIFICATION' || flag.type === 'FLIGHT_MODIFICATION_ON_DEMAND') {
                                        if (flag.enabled && this.marketAvailable) {
                                            this.returnInfo.showChangeFlightLink = true;
                                            this.returnInfo.showVoluntaryChangeFlightSection = true;
                                            this.returnInfo.slicesWithChangeFlight[slice.sliceId] = true;
                                        } else if (!flag.enabled && this.marketAvailable) {
                                            this.returnInfo.showChangeFlightLink = true;
                                        }
                                        //In case of flexibilization active and voluntary change also active, must maintain vountary change active (fare diff)
                                        if (flag.type === 'FLIGHT_MODIFICATION' && flag.enabled) { //active
                                            this.returnInfo.flightModificationActive = true;
                                        }
                                        //Control for show message of call center when voluntary change is not available and booking only has pnr resiber (temporal fix)
                                        if (this.onlyResiberPNR(this.getBookingInfo.order.bookingReferences)) {
                                            this.returnInfo.showChangeFlightDeepLink = false;
                                            this.returnInfo.showChangeFlightLink = true;
                                        }
                                    }
                                    //Sister Cities
                                    if ((flag.type === 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE') && flag.enabled) {
                                        this.returnInfo.sisterCitiesData.hasSistercitiesPossibility = true;
                                        this.returnInfo.sisterCitiesData.allowedSlices.push(slice);
                                    }
                                    //Generic Disruptions
                                    if (flag.type === 'FLIGHT_DISRUPTION_SEARCH' && flag.enabled) {
                                        this.returnInfo.showChangeFlightLink = true;
                                        this.returnInfo.showFlexibilizationChangeSection = true;
                                        this.returnInfo.slicesWithFlexibilization[slice.sliceId] = true;
                                        this.returnInfo.sisterCitiesData.hasSistercitiesPossibility = true;
                                        this.returnInfo.sisterCitiesData.allowedSlices.push(slice);
                                    }
                                    //SCVV
                                    if (flag.type === 'FLIGHT_MODIFICATION_SIMULATION' && flag.enabled) {
                                        this.returnInfo.showSimulation = true;
                                    }
                                });
                            }
                        });
                    }
                });
            }

             //Modify change flight value (voluntary/involuntary) depending on the flags values
            /*if (returnInfo.flightModificationActive && returnInfo.showFlexibilizationChangeSection) {
                returnInfo.showFlexibilizationChangeSection = false;
                returnInfo.showVoluntaryChangeFlightSection = true;
                returnInfo.showVoluntaryFlexibleFlightChange = true; //Third case, used for the message displayed
                returnInfo.sisterCitiesData.hasSistercitiesPossibility = false;
            }*/

            //Management link to rubiQ
            this.evaluateLinkFlexibilizationBanner(getBookingInfo);

            //Re-evaluate rules
            //this.returnInfo = evaluateFareDifference(this.returnInfo);

            //Only 1 link must be active. If we don't have the deeplink to the old MMB app and the flight is not flexib. an error message must be shown
            if (!this.returnInfo.showChangeFlightLink && !this.returnInfo.showChangeFlightDeepLink && (this.returnInfo.showLinkToRubiQ || this.returnInfo.showFlexibilizationExceptionalMsg)) {
                this.returnInfo.showChangeFlightLink = true;
                this.returnInfo.showFlexibilizationChangeSection = false;
                this.returnInfo.showVoluntaryChangeFlightSection = false;
            } else if (!this.returnInfo.showChangeFlightLink && !this.returnInfo.showChangeFlightDeepLink && (!this.returnInfo.showLinkToRubiQ || !this.returnInfo.showFlexibilizationExceptionalMsg)) {
                this.returnInfo.showChangeFlightDeepLink = true;
            }

            // External voucher redirection based on flags values (special cases).
            if ((this.returnInfo.allowedRefundVoucher && this.returnInfo.hideCashRefundSection && !this.returnInfo.showRefundVoucherSection) || (this.returnInfo.allowedRefundVoucher && !this.returnInfo.hideCashRefundSection && !this.returnInfo.showRefundVoucherSection)) {
                this.returnInfo.enableExternalRefundLink = true;
            }

            //In certain cases, travel agencies text must be shown (instead of our Call Center), these are those cases.
            if ((!this.returnInfo.allowedRefundVoucher && !this.returnInfo.showRefundVoucherSection && !this.returnInfo.hideCashRefundSection) || (this.returnInfo.allowedRefundVoucher && !this.returnInfo.hideCashRefundSection && !this.returnInfo.showRefundVoucherSection) || (!this.returnInfo.allowedRefundVoucher && !this.returnInfo.hideCashRefundSection && this.returnInfo.showRefundVoucherSection)) {
                this.returnInfo.showContactCenterText = true;
            }

            //In those cases, only refund via voucher text must be displayed instead "booking refund" general text in the main disruption screen.
            if ((this.returnInfo.allowedRefundVoucher && !this.returnInfo.showRefundVoucherSection && this.returnInfo.hideCashRefundSection) || (this.returnInfo.allowedRefundVoucher && this.returnInfo.hideCashRefundSection && this.returnInfo.showRefundVoucherSection) || (this.returnInfo.allowedRefundVoucher && !this.returnInfo.hideCashRefundSection && !this.returnInfo.showRefundVoucherSection)) {
                this.returnInfo.showOnlyVoucherRefundText = true;
            }

            return this.returnInfo;
        };

        /**
         * This functions evaluate if booking exists flexibilization capabilities to show banner.
         * @param getBookingInfo {Object} object with info about the booking.
         *  */
        private evaluateLinkFlexibilizationBanner(getBookingInfo){
            if (getBookingInfo && getBookingInfo.flexibilizationCapabilitiesInformation) {
                if (getBookingInfo.flexibilizationCapabilitiesInformation.code === 'COVID19') {
                    this.returnInfo.showLinkToRubiQ = true;
                } else {
                    this.returnInfo.showFlexibilizationExceptionalMsg = true;
                }
            }
            else {
                this.returnInfo.showLinkToRubiQ = false;
                this.returnInfo.showFlexibilizationExceptionalMsg = false;
            }
        }

        /**
         * This functions valid if booking only has PNR resiber and the flow CV is not available.
         * Should show message of "Call Center"
         * @param bookingReferences {Array} array with all info about pnrs.
         * @returns onlyResiberPNR {Boolean} indicate if onlyResiberPNR.
         *  */
        private onlyResiberPNR(bookingReferences){
            var onlyResiberPNR = false;
            if (bookingReferences.length === 1) {
                onlyResiberPNR = bookingReferences[0].provider === 'IB' ? true : false;
            };
            return onlyResiberPNR;
        };

        /**
         * This functin return true or false if the market of order is available to show voluntary change flow.
         * @param {Object} orderMarket this is all data about order market.
         * @returns {Boolean} allowedFligthChange.
         *  */
        private isOrderMarketAvailable(orderMarket){
            let i = 0, allowedFlightChange = false, commercialSellingData:any = [];
            commercialSellingData.push({
                market: {
                    code : orderMarket?.country
                },
                marketFlags : {
                    allowedFlightChange : true
                }
            });
            while (i < commercialSellingData.length && !allowedFlightChange) {
                if (commercialSellingData[i].market.code === orderMarket?.country && commercialSellingData[i].marketFlags.allowedFlightChange) {
                    allowedFlightChange = true;
                }
                i++;
            }
            return allowedFlightChange;
        };

}
