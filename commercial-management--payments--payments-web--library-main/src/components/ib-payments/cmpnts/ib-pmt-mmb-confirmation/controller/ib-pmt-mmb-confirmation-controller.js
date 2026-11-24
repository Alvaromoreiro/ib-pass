import { injectIbPmtStylesHost } from '../../../../../styles/ib-pmt-styles-host';

(function () {
    'use strict';

    angular
        .module('ib-pmt-mmb-confirmation-module')
        .controller('ConfirmationMMbController', ConfirmationMMbController);
    ConfirmationMMbController.$inject = ['$rootScope', '$scope', '$window', 'DatalayerUtilsService', 'DatalayerEcommerceUtilsService', 'PmtDatalayerConstants', 'PmtUtilsService', 'PmtConstants', 'localStorageService', 'CurrencyService', 'PmtDatalayerUtilsService', 'PmtMmbConfirmationTransformer', '$timeout', 'CommonsUtilService', 'DigitalDataService', 'DatalayerGeneralConstants', 'DatalayerMMBConstants', 'PmtModalService', 'ibMarketingPermissionService', 'CommonsUserUtilsService', 'CommonsCookiesService', 'CommonsSessionStorageService'];
    function ConfirmationMMbController ($rootScope, $scope, $window, DatalayerUtilsService, DatalayerEcommerceUtilsService, PmtDatalayerConstants, PmtUtilsService, PmtConstants, localStorageService, CurrencyService, PmtDatalayerUtilsService, PmtMmbConfirmationTransformer, $timeout, CommonsUtilService, DigitalDataService, DatalayerGeneralConstants, DatalayerMMBConstants, PmtModalService, ibMarketingPermissionService, CommonsUserUtilsService, CommonsCookiesService, CommonsSessionStorageService) {
        const vm = this;
        $rootScope.showMainHeader = true;
        vm.printSummary = printSummary;
        vm.formatPrice = formatPrice;
        vm.summaryPayment = {};
        vm.model = {
            seats: PmtMmbConfirmationTransformer.transformInfoConfirmation(),
            co2Info: PmtMmbConfirmationTransformer.transformCO2InfoConfirmation()
        };
        vm.isUserLogged = CommonsUserUtilsService.isUserLogged();
        vm.isIbZero = CommonsUserUtilsService.isIbZero();
        vm.isOnb = CommonsUserUtilsService.isUserLoggedONB();

        const pointsData = localStorageService.get('CalculatedPoints');
        this.aviosToEarn = pointsData && pointsData.Avios !== 0 ? pointsData.Avios : undefined;
        this.elitePointsToEarn = pointsData && pointsData.Elite !== 0 ? pointsData.Elite : undefined;
        vm.flowApp = localStorageService.get('flowApp');

        $scope.$on('$destroy', () => {
            if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                PmtDatalayerUtilsService.resetDatalayer();
            }
        });
        activate();

        function activate () {
            injectIbPmtStylesHost();
            checkMarketingPermission();
            let i, currency, type, voucherInfo;
            const bookingInfo = localStorageService.get('bookingInfo'), paymentInfo = localStorageService.get('paymentsInfo'), selectedAviosDisccount = localStorageService.get('selectedAviosDisccount');
            vm.ibPayTrace = localStorageService.get('ibPayTrace');
            $timeout(() => {
                const quadrigam = localStorageService.get('pmtModelInfo')?.quadrigams.confirmation;
                if (quadrigam == PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_DEEPLINK_CONFIRMATION) {
                    CommonsUtilService.setTitlePage('MMB_TITLE_DEEPLINK_SEAT_CONFIRMATION');
                } else {
                    CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_CONFIRMATION_ANC');
                }
            },1600);
            if (localStorageService.get('deepLinkData')) {
                vm.deepLinkData = localStorageService.get('deepLinkData');
            }
            $rootScope.$broadcast('clearBasket', {});
            clearBreakdownInfo();
            vm.issueOrderInfo = localStorageService.get('issueOrderInfo');
            if (vm.issueOrderInfo.data) {
                vm.issueOrderInfo = vm.issueOrderInfo.data;
            }
            vm.summaryPayment = localStorageService.get('mmbAncillariesPaymentSummaryModel');
            vm.summaryPayment.shoppingBasket = localStorageService.get('headerModel').headerModel.shoppingBasket;
            vm.summaryPayment.discount = null;
            currency = CurrencyService.getCurrencyObject(vm.issueOrderInfo.currencies[0]);
            vm.total = CurrencyService.formatPrice(currency, vm.issueOrderInfo.total, true);
            if (vm.issueOrderInfo && vm.issueOrderInfo.failedToPay && vm.issueOrderInfo.failedToPay.length > 0) {
                angular.forEach(vm.issueOrderInfo.failedToPay, (item) => {
                    if (item.type === PmtConstants.ANCILLARIES_TYPES.INSURANCE) {
                        vm.summaryPayment.shoppingBasket.insurance.hasInsurance = false;
                    } else if (item.type === PmtConstants.ANCILLARIES_TYPES.SEAT) {
                        vm.summaryPayment.shoppingBasket.seats.hasSeats = false;
                    } else if (item.type === PmtConstants.ANCILLARIES_TYPES.BAGGAGE) {
                        vm.summaryPayment.shoppingBasket.baggages.hasBaggage = false;
                    } else if (item.type === PmtConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT) {
                        vm.summaryPayment.shoppingBasket.carbonFootprint.hasCarbonFootprint = false;
                    } else if (item.type === PmtConstants.ANCILLARIES_TYPES.GLOBICK) {
                        vm.summaryPayment.shoppingBasket.globickActivities.hasActivitiesGlobick = false;
                        vm.summaryPayment.shoppingBasket.globickTransfers.hasTransfersGlobick = false;
                    } else if (item.type === PmtConstants.ANCILLARIES_TYPES.UPGRADING_BID) {
                        const totalUpgBids = localStorageService.get('totalAmountBids');
                        if (totalUpgBids && totalUpgBids > 0) {
                            vm.total = CurrencyService.formatPrice(currency, (vm.issueOrderInfo.total - totalUpgBids), true);
                        }
                    }
                });
                localStorageService.set('mmbAncillariesPaymentSummaryModel', vm.summaryPayment);
            }
            if (paymentInfo.appliedDiscounts.status && paymentInfo.appliedDiscounts.types.VOUCHER) {
                voucherInfo = localStorageService.get('voucherInfo');
                vm.summaryPayment.discount = { id: voucherInfo.voucherId, amount: CurrencyService.formatPrice(currency, voucherInfo.amount, true) };
                vm.total = CurrencyService.formatPrice(currency, vm.issueOrderInfo.total - voucherInfo.amount, true);
            } else if (paymentInfo.appliedDiscounts.status && paymentInfo.appliedDiscounts.types.AVIOS) {
                const aviosDiscountInfo = paymentInfo.appliedDiscounts.types.AVIOS;
                vm.summaryPayment.discount = { id: aviosDiscountInfo.formatedAvios + ' Avios', amount: aviosDiscountInfo.discount };
                vm.total = CurrencyService.formatPrice(currency, vm.issueOrderInfo.total - aviosDiscountInfo.originalDiscount, true);
            } else if (paymentInfo.appliedDiscounts.status && selectedAviosDisccount && selectedAviosDisccount.fullAvios) {
                vm.summaryPayment.discount = { id: selectedAviosDisccount.formatedAvios + ' Avios', amount: selectedAviosDisccount.formatedTotalDiscount };
                vm.total = CurrencyService.formatPrice(currency, 0, true);
            }
            if (bookingInfo.order && bookingInfo.order.primaryContactInfo) {
                vm.email = bookingInfo.order.primaryContactInfo.email;
            } else {
                vm.email = '';
            }
            if (bookingInfo?.passengers) {
                const firstPassenger = bookingInfo.passengers[0];
                if (firstPassenger?.externalPersonalInfo) {
                    vm.firstPassengerName = firstPassenger.externalPersonalInfo.name;
                } else if (firstPassenger?.personalInfo) {
                    vm.firstPassengerName = firstPassenger.personalInfo.name;
                }
            }
            displayCarbonFootprintBanner(bookingInfo);
            if (vm.issueOrderInfo && vm.issueOrderInfo.failedToPay && vm.issueOrderInfo.failedToPay.length > 0) {
                type = vm.issueOrderInfo.failedToPay.length > 1 ? 'ANCILLARIES' : vm.issueOrderInfo.failedToPay[0].type;
                setQuadrigrmas(type);
            } else {
                const quadrigam = localStorageService.get('pmtModelInfo')?.quadrigams.payments;
                if (quadrigam) {
                    CommonsUtilService.setTitlePage('MMB_TITLE_DEEPLINK_SEAT_CONFIRMATION');
                }
                const pnrType = getPNRType();
                const pnr = getPNR();

                if(pnr) DatalayerUtilsService.addDigitalDataInfo({Reference: pnr});
                DatalayerUtilsService.addDigitalDataInfo({PNRType: pnrType});
                /* INIT DELETE GA4 MIGRATION */
                DatalayerUtilsService.updateDatalayerWithQuadrigam(localStorageService.get('pmtModelInfo').quadrigams.confirmation, null, PmtUtilsService.isUserLogged());
                DatalayerUtilsService.sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FINISH DELETE GA4 MIGRATION */
                DatalayerUtilsService.updateDigitalDataWithQuadrigam(localStorageService.get('pmtModelInfo').quadrigams.confirmation, null, PmtUtilsService.isUserLogged());
                DatalayerUtilsService.setProcessAndStep(DatalayerMMBConstants.DIGITAL_DATA_PROCESS.MOBKCF, DatalayerMMBConstants.DIGITAL_DATA_STEP.MOBKCF, PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CONFIRMATION);
                DigitalDataService.emitViewEvent();
                //DatalayerUtilsService.updateDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW, '', '', '');
                updateDatalayerInformation(vm.issueOrderInfo);
            }
            setOrderInfoDatalayer(bookingInfo);
            setPaymentMethod();
            getOrderId(bookingInfo.order);
            DatalayerUtilsService.setProcessAndStep(DatalayerMMBConstants.DIGITAL_DATA_PROCESS.MOBKCF, DatalayerMMBConstants.DIGITAL_DATA_STEP.MOBKCF, PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CONFIRMATION);
            $timeout(() => {
                $rootScope.$broadcast('updateDatalayer');
                $rootScope.$broadcast('sendUpdateToMonetate');
            });
            setDigitalDataInfo();
            localStorageService.remove('activitiesData');
            localStorageService.remove('bookingReferencesActivities');
        }

        function clearBreakdownInfo () {
            const breakdownInfo = localStorageService.get('breakdownInfo');
            if(breakdownInfo.pendingPaymentItems) breakdownInfo.pendingPaymentItems = [];
            localStorageService.set('breakdownInfo', breakdownInfo);
            localStorageService.set('RechargeBookingInfo', true);
        }

        function setQuadrigrmas (type) {
            let quadrigamType = '';
            switch (type) {
                    case PmtConstants.ANCILLARIES_TYPES.SEAT:
                        quadrigamType = PmtConstants.QUADRIGAMS.COMUNICATION_SEAT;
                        break;
                    case PmtConstants.ANCILLARIES_TYPES.BAGGAGE:
                        quadrigamType = PmtConstants.QUADRIGAMS.COMUNICATION_BAGGAGE;
                        break;
                    case PmtConstants.ANCILLARIES_TYPES.INSURANCE:
                        quadrigamType = PmtConstants.QUADRIGAMS.COMUNICATION_INSURANCE;
                        break;
                    case PmtConstants.ANCILLARIES_TYPES.INSURANCE:
                        quadrigamType = PmtConstants.QUADRIGAMS.COMUNICATION_CARBON_FOOTPRINT;
                        break;
                    case PmtConstants.FLOW.ANCILLARIES:
                        quadrigamType = PmtConstants.QUADRIGAMS.COMUNICATION_ANCILLARIES;
                        break;
            }
            /* INIT DELETE GA4 MIGRATION */
            DatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigamType, null, PmtUtilsService.isUserLogged());
            DatalayerUtilsService.sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
            /* FINISH DELETE GA4 MIGRATION */
            DatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigamType, null, PmtUtilsService.isUserLogged());
            DigitalDataService.emitViewEvent();
            //DatalayerUtilsService.updateDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW, '', '', '');
        }

        /**
         * Open window to print confirmation document  info
         */
        function printSummary () {
            $window.print();
        }

        function formatPrice (price, decimals) {
            return CurrencyService.formatPrice(currency, price, decimals);
        }

        /**
         * Update datalayer ecommerce information
         */
        function updateDatalayerInformation (issueOrderInfo) {
            const confirmationDatalayerInfo = DatalayerEcommerceUtilsService.updateDatalayerInfoPayments(issueOrderInfo), selectedCardType = localStorageService.get('typeCardIberiaPay');
            DatalayerEcommerceUtilsService.addDataLayerEcommerceInfo(confirmationDatalayerInfo.ecommerce);
            if (selectedCardType) {
                confirmationDatalayerInfo.generalInfo[PmtDatalayerConstants.DATALAYER_INFO.CREDITCARD_TYPE] = selectedCardType;
            }
            DatalayerUtilsService.addDataLayerInfo(confirmationDatalayerInfo.generalInfo);
            DatalayerEcommerceUtilsService.setAddPurchase();
        }

        function setOrderInfoDatalayer (bookingInfo) {
            const flowApp = localStorageService.get('flowApp');
            const orderInfo = { OrderId: bookingInfo.order.orderId };
            if (orderInfo && orderInfo.OrderId && flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
                DatalayerUtilsService.addDataLayerInfo(orderInfo);
            }
        }

        function createSegmentInfo () {
            const ancillariesInfo = localStorageService.get('summaryAncillaries');
            return ancillariesInfo.priority;
        }

        function setPaymentMethod () {
            const cardSelectedLogged= localStorageService.get('selectedLoggedCard');
            const cardTypeSelected = localStorageService.get('typeCardIberiaPay');
            const digitalDataObject = {};
            cardSelectedLogged ?
                digitalDataObject[DatalayerGeneralConstants.PAYMENT_METHOD] = cardSelectedLogged.cardTypeCode:
                cardTypeSelected ? digitalDataObject[DatalayerGeneralConstants.PAYMENT_METHOD] = cardTypeSelected : angular.noop;
            DatalayerUtilsService.addDigitalDataInfo( digitalDataObject );
        }

        function getOrderId (order) {
            const digitalDataObject = {};
            order.orderId ? digitalDataObject[DatalayerGeneralConstants.ORDER_ID] = order.orderId : angular.noop;
            DatalayerUtilsService.addDigitalDataInfo( digitalDataObject );
        }

        function displayCarbonFootprintBanner (bookingInfo) {
            vm.co2InfoBannerModel = {
                name: vm.firstPassengerName,
                kilosCo2eFormatted: vm.model.co2Info?.kilosCo2EquivalentFormatted,
                priceFormatted: vm.model.co2Info?.priceFormatted,
                flight: {
                    numPax: bookingInfo?.passengers?.length || 0,
                    segments: bookingInfo?.order?.slices?.flatMap(slice => slice.segments.map(segment => {
                        return {from: segment.departure.code, to: segment.arrival.code, cabin: segment.cabin.type};
                    }))
                }
            };
            vm.showCarbonFootprintBanner = Boolean(vm.model.co2Info &&
                !vm.summaryPayment.shoppingBasket.carbonFootprint?.hasCarbonFootprint &&
                !bookingInfo?.order?.orderItems?.some(item => item.type === PmtConstants.ORDER_ITEMS_TYPES.CO2_FOOTPRINT && item.orderId));
        }

        function checkMarketingPermission () {
            if(CommonsUserUtilsService.isIbPlus() && !CommonsCookiesService.getCookie(PmtConstants.COOKIES.NO_MARKETING_PERMISSION)) {
                CommonsCookiesService.setCookieTime(PmtConstants.COOKIES.NO_MARKETING_PERMISSION, true, selectCookieTime());
                ibMarketingPermissionService.getMarketingPermissions().then((response) => {
                    const commercialCamp =  response.data.find((element) => element.permissionType === 'COMMERCIAL_CAMPAIGN')?.permissionGranted;
                    if (!commercialCamp) {
                        PmtModalService.showGenericModal(true, 'ib-modal-marketing-permission.html').result.finally(()=>{});
                    }
                });
            }
        }

        function selectCookieTime () {
            return CommonsSessionStorageService.get('showMarketingPermission') ? PmtConstants.COOKIES.MARKETING_PERMISSION_TEST_EXPIRY_TIME :
                PmtConstants.COOKIES.MARKETING_PERMISSION_EXPIRY_TIME;
        }

        function setDigitalDataInfo() {
            const points = localStorageService.get('CalculatedPoints') || { Avios: '0', Elite: '0' };
            const dataLayer = {
                AviosEarned: parseInt(points.Avios)
            };
            DatalayerUtilsService.addDigitalDataInfo(dataLayer);
        }

        function getPNRType () {
            const bookingInfo = localStorageService.get('bookingInfo');
            if (!bookingInfo) return;
            const hasDisruption =
            !!bookingInfo.genericDisruptionCapabilitiesInformation;
            const hasFlexibility = !!bookingInfo.flexibilizationCapabilitiesInformation;
            const isIssued = bookingInfo.order.status === 'ISSUED';
            const isDisruptedCase = hasDisruption || (hasFlexibility && !isIssued);
            const isFlexibleCase = hasFlexibility && isIssued;
            const pnrType = determinePNRType(isDisruptedCase, isFlexibleCase);
            return pnrType;
        }
        function determinePNRType (isDisrupted, isFlexible) {
            if (isDisrupted) {
                return PmtDatalayerConstants.DATALAYER_VALUES.DISRUPTED;
            }
            if (isFlexible) {
                return PmtDatalayerConstants.DATALAYER_VALUES.FLEXIBLE;
            }
            return PmtDatalayerConstants.DATALAYER_VALUES.NON_FLEXIBLE;
        }

        function getPNR () {
            const bookingInfo = localStorageService.get('bookingInfo');
            const pnrFromLocalStorage = localStorageService.get('PNR');

            return (pnrFromLocalStorage ? pnrFromLocalStorage : bookingInfo?.order?.clientLocator) ?? '';
        }
    }
})();
