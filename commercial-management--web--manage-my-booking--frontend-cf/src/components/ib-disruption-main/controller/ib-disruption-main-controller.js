(function () {
    'use strict';
    angular.module('ib-disruption-main-module')
        .controller('DisruptionDashboardController', DisruptionDashboardController);

    DisruptionDashboardController.$inject = ['MmBModalService', 'localStorageService', 'DisruptionModel', 'MmBAppConstants', 'DisruptionDashboardTransformer', 'DisruptionUtilService', '$location', 'DisruptionDashboardConstants', 'MmBUtilService', 'CommonsGetWcsPhonesService', 'MmbInvoluntaryChangeService', 'BookingSearchService', '$rootScope', 'MmBDatalayerUtilsService', 'RedirectionService', '$filter', 'IbFlagsTransformer', '$scope', 'NewMainHeaderFacade', '$timeout', '$window', 'EvaluatorConst', 'CommonsUtilService', '$translate','LoadingSpinnerService', 'MmBUtilsSharedService'];

    function DisruptionDashboardController (MmBModalService, localStorageService, DisruptionModel, MmBAppConstants, DisruptionDashboardTransformer, DisruptionUtilService, $location, DisruptionDashboardConstants, MmBUtilService, CommonsGetWcsPhonesService, MmbInvoluntaryChangeService, BookingSearchService, $rootScope, MmBDatalayerUtilsService, RedirectionService, $filter, IbFlagsTransformer, $scope, NewMainHeaderFacade, $timeout, $window, EvaluatorConst, CommonsUtilService, $translate, LoadingSpinnerService, MmBUtilsSharedService) {
        var vm = this;
        var disableChange;
        vm.unsuscribeReshop = null;
        vm.showPassengerRights = showPassengerRights;
        vm.goToRefund = goToRefund;
        vm.redirectToExternalVoucherForm = redirectToExternalVoucherForm;
        vm.goHome = goHome;
        vm.acceptChanges = acceptChanges;
        vm.logoUri = $window.location.origin;
        vm.checkPets = checkPets;
        vm.checkWarning = checkWarning;
        vm.getChangeConditions = getChangeConditions;
        vm.setPhonesList = setPhonesList;
        vm.endActivate = endActivate;
        activate();

        disableChange = $rootScope.$on('childRebookUpdate', disableChangeDate);
        $scope.$on('destroy', disableChange);
        vm.$onDestroy = () => { vm.unsuscribeReshop.unsubscribe();};

        /**
         * Initialize all contents
         */
        function activate () {
            LoadingSpinnerService.hide();
            let localBookingInfo, orderSlices, slicesWithSelector, voucherFromEmail, channel, downgradeSlice;
            vm.model = DisruptionModel;
            vm.model.initializeModel();
            vm.model.acceptChanges = acceptChanges;
            vm.flowId = null;
            $rootScope.showMainHeader = false;
            localStorageService.set('downgradeCodes', []);
            localBookingInfo = localStorageService.get('bookingInfo');
            voucherFromEmail = localStorageService.get('voucherFromEmail');
            channel = localStorageService.get('pnrChannel');
            vm.model.operationalTime = localBookingInfo.genericDisruptionCapabilitiesInformation && (localBookingInfo.genericDisruptionCapabilitiesInformation.disruptionTime === DisruptionDashboardConstants.DISRUPTION_TIME.OPERATIONAL);
            vm.model.sisterCitiesData.hasSisterCitiesPossibility = localStorageService.get('showSisterCitiesPossibility');
            vm.model.partialRefund = localStorageService.get('partialRefund');
            vm.flowId = localBookingInfo.flowId;
            vm.model.selectorFlights.flowId = vm.flowId;
            vm.model.flagChannelOthers = localBookingInfo.fareFamilyConditions.length === 0;
            vm.model.flagRebookDisable = localStorageService.get('rebookDisable');
            vm.model.isGenericDisruption = localBookingInfo.genericDisruptionCapabilitiesInformation;
            localStorageService.set('isUnifiedFlow', vm.model.isGenericDisruption ? true : false);
            localBookingInfo.order.phonesList = localStorageService.get('phonesList');
            vm.model.notIberiaTicket = localStorageService.get('notIberiaTicket');
            vm.model.hasTickets = localStorageService.get('hasTickets');
            vm.model.disruptionPeriodsData = localStorageService.get('disruptionPeriodsInfo');
            vm.model.showUpdateTime = localBookingInfo.order.status === DisruptionDashboardConstants.ORDER_STATUS_VALUES.SCHEDULE_CHANGE && vm.model.operationalTime;
            vm.model.status = localBookingInfo.order.status;
            vm.model.operationalTimeMessage = false;
            downgradeSlice = DisruptionUtilService.searchSlices(localBookingInfo.order, DisruptionUtilService.criteriaCabinDowngrade);
            localStorageService.set('downgradeSlice', downgradeSlice);

            checkPets(localBookingInfo);
            checkWarning(localBookingInfo);

            vm.model.changeConditions = getChangeConditions(localBookingInfo.order.slices, vm.model.isGenericDisruption ? true : false);
            vm.disruptionType = DisruptionUtilService.getDisruptionType(localBookingInfo.order.status, localBookingInfo.flexibilizationCapabilitiesInformation, vm.model.hasTickets, localBookingInfo.genericDisruptionCapabilitiesInformation?.disruptionTime);
  
            setPhonesList(localBookingInfo);

            if (localBookingInfo.channel === 'OTHER' || localBookingInfo.channel === 'NDC_INDIRECT') {
                vm.model.isExternalChannel = true;
            }

            /*ChangleFlightsService.getDisruptionPeriods().then(function (response) {
                vm.model.blackOutPeriodsData = response;
                vm.model.textBlackoutPeriods = MmBUtilService.formatDisruptionAndFlexibilizationDates(response.blackOutPeriods, 'BLACKOUT');
                vm.model.textAllowedPeriods = MmBUtilService.formatDisruptionAndFlexibilizationDates(response.allowedPeriods, 'ALLOWED_PERIODS');
                if (response.allowedPeriods && response.allowedPeriods.dateTo) {
                    vm.model.maxDateAllowed = response.allowedPeriods.dateTo;
                }
                endActivate();
            }, endActivate);*/

            vm.model.showRefundBoxEvaluator = DisruptionUtilService.evaluateRule(localBookingInfo.orderFlags, EvaluatorConst.REFUND_FLAG_EVALUATOR.REFUND_AREA_EVAL);
            vm.unsuscribeReshop = BookingSearchService.reshopConditionsResponseObser.subscribe(response =>{
                if(response?.involuntaryChanges){
                    vm.model.reshopConditions = response;
                }
                else {
                    vm.model.reshopConditions = localStorageService.get('reshopConditions');
                }
            });
            orderSlices = {};
            orderSlices = DisruptionUtilService.initializeSlicesList(localBookingInfo.order);
            slicesWithSelector = DisruptionUtilService.searchSlices(localBookingInfo.order, DisruptionUtilService.criteriaFlightSearchEnabled);
            vm.model.unifiedNotIberiaOP = DisruptionUtilService.searchSlices(localBookingInfo.order, DisruptionUtilService.criteriaSegmentOperatedNotIberia);
            localStorageService.set('unifiedNotIberiaOP', vm.model.unifiedNotIberiaOP ? true : false);
            DisruptionDashboardTransformer.transformDisruptionData(orderSlices, vm.disruptionType, vm.model, localBookingInfo.fareFamilyConditions);
            vm.model.warningDowngradeSameFlightAndTime = localStorageService.get('warningDowngradeSameFlightAndTime');
            vm.model.warningDowngradeDiffFlightOrTime = localStorageService.get('warningDowngradeDiffFlightOrTime');
            DisruptionDashboardTransformer.transformDateSelectorData(slicesWithSelector, orderSlices.searchList, orderSlices.confirmedList.list, localBookingInfo.order.slices, vm.model, vm.model.isGenericDisruption);
            DisruptionDashboardTransformer.transformOrderData(localBookingInfo, localBookingInfo.order, vm.model, vm.disruptionType);
            DisruptionDashboardTransformer.transformCustomChangeByFlows(localBookingInfo.order, vm.model, vm.disruptionType);

            vm.model.specialOrderStatus = localStorageService.get('specialOrderStatus');
            localStorageService.remove('specialOrderStatus');

            $translate.onReady().then(() => {
                const phoneList = localStorageService.get('phonesList');
                let contactPhone = '';
                if (phoneList && phoneList.RESERVAS) {
                    contactPhone = (phoneList.RESERVAS.prefix || '') + (phoneList.RESERVAS.telephone || '');
                }
                if (MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_DIRECT.includes(channel)) {
                    vm.model.channelDowngradeMessage = $filter('translate')('MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_DIRECT', { phoneNumber: contactPhone });
                } else if (MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_INDIRECT.includes(channel)) {
                    vm.model.channelDowngradeMessage = $filter('translate')('MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_INDIRECT');
                }
                if(vm.model.isGenericDisruption.disruptionTime === MmBAppConstants.DISRUPTION_TIME.OPERATIONAL_TIME) {
                    vm.model.operationalTimeMessage = true;
                    vm.model.channelDowngradeMessage = $filter('translate')('MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_OPERATIONAL_TIME');
                }
                // if (vm.model.operationalTime) {
                //     vm.model.channelDowngradeMessage = $filter('translate')('MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_DIRECT', { phoneNumber: contactPhone });
                // }
            });

            if (vm.model.sisterCitiesData.hasSisterCitiesPossibility) {
                vm.model.sisterCitiesData.newSisterCitiesModel = MmBUtilsSharedService.newTransformSisterCitiesModel(localStorageService.get('sisterCitiesRawModel'), false, vm.model.rawSlicesInfo, vm.model.selectorFlights.flights);
            }

            var paymentStatus = MmBUtilService.getURLFirstParameterByName('paymentStatus');
            var componentType = MmBUtilService.getURLFirstParameterByName('componentType');
            const isRelevantStatus = paymentStatus === 'OK' || paymentStatus === 'KO';
            const shouldCheckComponent = isRelevantStatus || componentType;
            const isModalNotManuallyClosed = !localStorageService.get('manualCloseVCModal');

            if (shouldCheckComponent && isModalNotManuallyClosed) {
                localStorageService.set('paymentRedirection', true);
                MmBModalService.showVoluntaryChangeModal(false, 'ib-MmB-voluntary-changes-view.html');
            }

            $timeout(() => {
                NewMainHeaderFacade.initHeader(
                    {
                        originDestination: null,
                        redemption: '',
                        flightType: null,
                        currency: localStorageService.get('currency'),
                        showBasket: true,
                        showModalBackHome: true
                    },
                    { hasSteps: false, steps: 'DEFAULT_STEPS', position: 0 },
                    {
                        onLogin: function () {
                            MmBModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
                        }, onError: function (error) {
                            MmBModalService.finishWaiting();
                        }, afterLogin: activate,
                        userLogged: localStorageService.get('userLogged'),
                        loggedData: localStorageService.get('customerData') || localStorageService.get('membershipData') || undefined
                    }
                );
            });
            $timeout(() => {
                NewMainHeaderFacade.showLogin();
            });
            localStorageService.set('flowTitlesApp', MmBAppConstants.TITLES_APP.MANAGEMYBOOKING_DISRUPTION);
            $timeout(() => {
                CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_FC_DISRUPTION_FIND_NEW_FLIGHTS');
            }, 800);
            if (vm.model.disruptionPeriodsData) {
                vm.model.blackOutPeriodsData = localStorageService.get('blackOutPeriodsData');
                vm.model.textBlackoutPeriods = localStorageService.get('textBlackoutPeriods');
                vm.model.textAllowedPeriods = localStorageService.get('textAllowedPeriods');
                vm.allowedPeriods = localStorageService.get('allowedPeriods');
                if (vm.allowedPeriods && vm.allowedPeriods.dateTo) {
                    vm.model.maxDateAllowed = vm.allowedPeriods.dateTo;
                }
                endActivate(localBookingInfo, voucherFromEmail, orderSlices);
            } else {
                endActivate(localBookingInfo, voucherFromEmail, orderSlices);
            }

            /*ChangleFlightsService.getDisruptionPeriods().then(function (response) {
                vm.model.blackOutPeriodsData = response;
                vm.model.textBlackoutPeriods = MmBUtilService.formatDisruptionAndFlexibilizationDates(response.blackOutPeriods, 'BLACKOUT');
                vm.model.textAllowedPeriods = MmBUtilService.formatDisruptionAndFlexibilizationDates(response.allowedPeriods, 'ALLOWED_PERIODS');
                endActivate();
            }, endActivate);*/
            MmBUtilsSharedService.generateFlexAndDisruptedFlightsDatalayerInfo(true, vm.model);
            //endActivate();
        }

        function endActivate (localBookingInfo, voucherFromEmail, orderSlices) {
            vm.model.voucherPriceInfo = localStorageService.get('voucherPriceInfo');
            vm.model.cashPriceInfo = localStorageService.get('cashPriceInfo');
            vm.model.cashOrderItems = localStorageService.get('cashOrderItems');
            vm.model.voucherOrderItems = localStorageService.get('voucherOrderItems');
            vm.model.selectorFlights.verifyDate = DisruptionUtilService.orderItemContained(vm.model.orderItems, DisruptionDashboardConstants.ORDER_ITEMS_TYPE_TO_AVOID);
            vm.model.selectorFlights.callCenterMsg = vm.model.common.labelContact;
            vm.model.selectorFlights.contactPhone = vm.model.common.contactPhone;
            loadRefundFlags(localBookingInfo.orderFlags);
            vm.refundsInformation = {};
            if (voucherFromEmail) openVoucherRefundFlow();
            //Initialize quadrigam
            DisruptionUtilService.initializeQuadrigam(vm.model, localBookingInfo.order.status, orderSlices);
            $rootScope.isDisruptionFlow = true;
            MmBModalService.finishWaiting();
            if(vm.model.isGenericDisruption){
                vm.model.isGenericDisruption.isMajorDisruption = false;
                if(vm.model.isGenericDisruption?.disruptionTime === MmBAppConstants.DISRUPTION_TIME.MAJOR_DISRUPTION_TIME){
                    vm.model.isGenericDisruption.isMajorDisruption = true;
                }
            }
        }

        function setPhonesList(localBookingInfo) {
            if (!localBookingInfo.order.phonesList) {
                CommonsGetWcsPhonesService.getPhoneByCode(MmBAppConstants.WCS.PHONE_TYPES.SALES).then(() => {
                    localBookingInfo.order.phonesList = localStorageService.get('phonesList');
                    DisruptionDashboardTransformer.transformPhoneCallCenter(localBookingInfo.order, vm.model);
                });
            }
            vm.model.flagRefund = DisruptionUtilService.isFlightRefundEnabled(localBookingInfo.orderFlags, localBookingInfo.flexibilizationCapabilitiesInformation);
            vm.model.flags = IbFlagsTransformer.generateFlagsMenu(localBookingInfo);
            if (DisruptionDashboardConstants.COMMON_LABELS.CHANNEL[localBookingInfo.channel]) {
                vm.model.common.labelContact = DisruptionDashboardConstants.COMMON_LABELS.CHANNEL[localBookingInfo.channel].VALUE;
                vm.model.common.contactPhone = DisruptionDashboardConstants.COMMON_LABELS.CHANNEL[localBookingInfo.channel].PHONE;
            } else {
                vm.model.common.labelContact = DisruptionDashboardConstants.COMMON_LABELS.CHANNEL['DEFAULT'].VALUE;
                vm.model.common.contactPhone = DisruptionDashboardConstants.COMMON_LABELS.CHANNEL['DEFAULT'].PHONE;
            }
        }

        /**
         * This function is used to check if booking has pets
         */
        function checkPets (localBookingInfo) {
            vm.model.hasPets = localBookingInfo?.order?.orderItems?.some(item => item.type === 'pet' || item.type === 'petc') ?? false;
        }

        /**
         * This function is used to check if booking has free tickets 
         */
        function checkWarning (localBookingInfo) {
            vm.model.hasFreeTickets = Boolean(localBookingInfo?.warnings?.find(e => e.code === 'SSE_MMB_1018'));
        };

        /**
         * Calculate change flight conditions to show, based on operational carrier on flight
         */
        function getChangeConditions (slicesList, isGenericDisruption) {
            const condition = {}, container = {};
            let iberiaOper = true;
            condition.keepConditions = [];
            condition.notKeepConditions = [];
            container.slices = slicesList;
            angular.forEach(DisruptionUtilService.searchSlices(container, DisruptionUtilService.criteriaNone), (slice) => {
                angular.forEach(slice.segments, (segment) =>{
                    if (DisruptionDashboardConstants.OPERATIONAL_GROUP_IBERIA.indexOf(segment.flight.operationalCarrier.code) === -1) {
                        iberiaOper = false;
                    }
                });
            });

            checkIberOper(iberiaOper, condition, isGenericDisruption);
            
            return condition;
        }

        function checkIberOper(iberiaOper, condition, isGenericDisruption) {
            if(iberiaOper && isGenericDisruption) {
                condition.keepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.IBERIA_OPER.keepConditions;
                condition.notKeepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.IBERIA_OPER.notKeepConditions;
            } else if (iberiaOper) {
                condition.keepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.IBERIA_OPER.keepConditionsSpecific;
                condition.notKeepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.IBERIA_OPER.notKeepConditionsSpecific;
            } else {
                condition.keepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.NOT_IBERIA_OPER.keepConditions;
                condition.notKeepConditions = DisruptionDashboardConstants.DISRUPTED_CHANGE_CONDITIONS.NOT_IBERIA_OPER.notKeepConditions;
            }
        }

        /**
         * This function is launched when user accept the option the alternative flights.
         * This call to service and confirm the new flights options.
         */
        function acceptChanges () {
            let isCaseFive = vm.model.isGenericDisruption?.disruptionTime === MmBAppConstants.DISRUPTION_TIME.OPERATIONAL_TIME && vm.model.status ==='ACCEPT_CHANGES_PENDING_TK' ? true : false;
            var typeFlowDisruption = localStorageService.get('typeDisruptionFlow') || null, quadrigam = '', optional = localStorageService.get('optionalFlight') || false;
            var modalBody = {
                title: isCaseFive ? 'MMB_DISRUPTION_MODAL_ACCEPT_CHANGES_TITLE_CASE_FIVE' : 'MMB_DISRUPTION_MODAL_ACCEPT_CHANGES_TITLE_V2',
                body: isCaseFive ? 'MMB_DISRUPTION_MODAL_ACCEPT_CHANGES_BODY_CASE_FIVE' : 'MMB_DISRUPTION_MODAL_ACCEPT_CHANGES_BODY_V2',
                accept: 'MMB_VOUCHER_REFUND_BREAKDOWN_MODAL_BUTTON_TEXT',
                cancel: 'MMB_SISTER_CITIES_CANCEL_MODAL',
                needsTranslate: true
            };
            quadrigam = DisruptionUtilService.quadrigamByTypeFlow(typeFlowDisruption, optional);
            MmBUtilsSharedService.updateQuadrigam(quadrigam);

            MmBModalService.showGenericModal(true, 'generic-complete-modal.html', modalBody).result.then(() => {
                MmBModalService.showWaitingModal();
                MmbInvoluntaryChangeService.submitChangesAccepted(vm.flowId).then(submitChangesAcceptedCorrect, submitChangesAcceptedFailed);
            }, () => {
                MmBUtilsSharedService.updateQuadrigam(vm.model.selectorFlights.quadrigam);
            });

            function submitChangesAcceptedCorrect (bookingData) {
                var bookingDataComplete = BookingSearchService.checkOrderInfo(bookingData);
                BookingSearchService.retrieveOrderComplete(bookingDataComplete, null);
            }

            function submitChangesAcceptedFailed (error) {
                error = {
                    message: error.message,
                    title: { message: 'ERROR_CODE_TITLE_500', needsTranslate: true },
                    needsTranslate: error.needsTranslate
                };
                MmBModalService.finishWaiting();
                MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            }

        }

        /**
         * This functions open in a new tab with a WCS page where user can view all information
         * about passenger rights.
         */
        function showPassengerRights () {
            RedirectionService.externalRedirect($filter('LinksFilter')('PASSENGER_RIGHTS_LINK'), true);
        }

        /**
         * This function init refund flow.
         * If the flagRefund is available, redirect to refund disruption page. But is not available
         * and the showRefundLink is available, generate a link that redirect to Sale Force Form.
         */
        function goToRefund () {
            var bookingInfo = localStorageService.get('bookingInfo') || null;
            MmBModalService.showWaitingModal();
            let modalName = 'ib-Mmb-disruption-refunds-modal-view.html';
            let totalStep = 3;

            if (vm.model.flagRefund && (!vm.model.enableExternalRefundLink || vm.model.refundFlags.mixedOption) || (vm.model.showRefundLink || vm.model.enableExternalRefundLink || !vm.model.flags.voucherPriceInfo)) {
                let quadrigam = MmBAppConstants.QUADRIGAM.DISRUPTION_VOUCHER_REFUND_BEGGINING;
                MmBUtilsSharedService.updateQuadrigam(quadrigam);
                vm.refundsInformation['voucherPriceInfo'] = vm.model.voucherPriceInfo;
                vm.refundsInformation['totalSteps'] = totalStep;
                vm.refundsInformation['isDisruption'] = true;
                vm.refundsInformation['cashData'] = vm.model.cashPriceInfo;
                vm.refundsInformation['cashInformation'] = vm.model.cashPriceInfo;
                vm.refundsInformation['contactData'] = bookingInfo.order.primaryContactInfo ? bookingInfo.order.primaryContactInfo : {};
                vm.refundsInformation['summaryModel'] = MmBUtilService.generateSummaryModel(vm.model.voucherOrderItems, bookingInfo.order.slices, true, localStorageService.get('voucherPartialRefund'));
                if (vm.model.refundFlags.mixedOption)
                    vm.refundsInformation['summaryModel'] = MmBUtilService.generateSummaryModel(vm.model.cashOrderItems, bookingInfo.order.slices, false, vm.model.flags.cashPartialRefund);
                vm.refundsInformation['cashSummaryModel'] = MmBUtilService.generateSummaryModel(vm.model.cashOrderItems, bookingInfo.order.slices, false, vm.model.flags.cashPartialRefund);
                vm.refundsInformation['cashAvailable'] = IbFlagsTransformer.generateFlagsMenu(bookingInfo);
                vm.refundsInformation['refundFlags'] = vm.model.refundFlags;
                if (bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email) {
                    vm.refundsInformation.contactData.lowerCaseEmail = bookingInfo.order.primaryContactInfo.email.toLowerCase();
                } else {
                    vm.refundsInformation.contactData.lowerCaseEmail = '';
                }

                if (vm.model.voucherPriceInfo === null || angular.isUndefined(vm.model.voucherPriceInfo)) vm.refundsInformation.cashAvailable.showRefundVoucherSectionFunctional = false;

                MmBModalService.showFullModal(false, modalName, vm.refundsInformation).result.then(angular.noop, angular.noop);
                MmBModalService.finishWaiting();
            } /*else if (vm.model.showRefundLink || vm.model.enableExternalRefundLink || !vm.model.flags.voucherPriceInfo) {
                redirectToExternalVoucherForm();
            };*/
        }

        /**
         * Open modal voucher refund when user coming for email's link.
         *  */
        function openVoucherRefundFlow () {
            if (vm.model.voucherPriceInfo && vm.model.flags.showRefundVoucherSectionFunctional) {
                localStorageService.set('openVoucherRefundModal', true);
                goToRefund();
            } else {
                redirectToExternalVoucherForm();
            }
        }

        /**
         * This function redirect to external form (Sales force) to user can refund voucher.
         *
        */
        function redirectToExternalVoucherForm () {
            var bookingInfo = localStorageService.get('bookingInfo') || null, email = null;
            email = bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : '';
            RedirectionService.externalRedirect($filter('LinksFilter')('DISRUPTION_REFUND_EXTERNAL_LINK') + '?pnr=' + localStorageService.get('PNR') + '&lastname=' + localStorageService.get('checkinSurname')
                + '&email=' + email + '&fc=C');
        }

        function disableChangeDate () {
            localStorageService.set('rebookDisable', true);
            localStorageService.get('phonesList');
            vm.model.flagRebookDisable = true;
            vm.model.flagSelectorDate = false;
        }

        function loadRefundFlags (flags) {
            vm.model.refundFlags = {};
            vm.model.refundLabel = {};
            vm.model.refundFlags.flagShowRefundArea = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.REFUND_AREA_EVAL);
            vm.model.refundFlags.callCenterSimple = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.SIMPLE_CALLCENTER_EVAL);
            vm.model.refundFlags.refundSimple = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.SIMPLE_LINK_EVAL);
            vm.model.refundFlags.mixedOption = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.MIXED_OPTION_EVAL);
            vm.model.refundFlags.availableCashRefund = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.AVAILABLE_CASH_REFUND);
            vm.model.refundLabel.showOnlyVoucherText = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.ONLY_VOUCHER_EVAL);
            vm.model.refundLabel.showOnlyCashText = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.ONLY_CASH_EVAL);
            vm.model.refundLabel.showMixedText = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.BOTH_REFUND_EVAL);
            vm.model.showChangeFlightSection = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.ANY_INVOLUNTARY_CHANGE_FLIGHT_EVAL);

            validateServiceFlagsCoherence();
            loadLiterals();

            function loadLiterals () {
                var result;
                result = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.ALLOWED_CASH_REFUND_EVAL);
                vm.model.refundLabel.callCenterMsg = $filter('translate')(vm.model.isExternalChannel ? 'MMB_DISRUPTION_AGENCY_CONTACT_MSG' : 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG');
                if (vm.model.isExternalChannel) {
                    vm.model.contactPhone = '';
                    vm.model.showRefundCash = DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.CASH_REFUND_ENABLED_EVAL);
                }
                if (vm.model.refundFlags.callCenterSimple || vm.model.refundFlags.refundSimple) {
                    vm.model.refundLabel.title = $filter('translate')(result ? 'MMB_DISRUPTION_REFUND_AREA_TITLE' : 'MMB_DISRUPTION_REFUND_AREA_TITLE_ONLY_VOUCHER');
                }
                if (vm.model.refundFlags.mixedOption) {
                    vm.model.refundLabel.title = $filter('translate')('MMB_DISRUPTION_REFUND_AREA_TITLE');
                }
                //Refund Literals
                vm.model.refundLabel.refundAreaText_1 = $filter('translate')('MMB_REFUNDS_NEW_AREA_TEXT_1');
                vm.model.refundLabel.refundAreaText_1_bold = vm.model.refundLabel.refundAreaText_1.indexOf('<b>') !== -1;
                vm.model.refundLabel.refundAreaText_1 = vm.model.refundLabel.refundAreaText_1.replace('<b>', '');
            }

            function validateServiceFlagsCoherence () {
                if (DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.SIMPLE_VOUCHER_LINK_EVAL) &&
                    (angular.isUndefined(vm.model.voucherPriceInfo) || vm.model.voucherPriceInfo === null)) {
                    vm.model.refundFlags.callCenterSimple = true;
                    vm.model.refundFlags.refundSimple = false;
                    vm.model.refundFlags.mixedOption = false;
                    vm.model.refundFlags.availableCashRefund = false;
                }
                if (DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.SIMPLE_CASH_LINK_EVAL) &&
                    (angular.isUndefined(vm.model.cashPriceInfo) || vm.model.cashPriceInfo === null)) {
                    vm.model.refundFlags.callCenterSimple = true;
                    vm.model.refundFlags.refundSimple = false;
                    vm.model.refundFlags.mixedOption = false;
                    vm.model.refundFlags.availableCashRefund = false;
                }
                if (DisruptionUtilService.evaluateRule(flags, EvaluatorConst.REFUND_FLAG_EVALUATOR.MIXED_VOUCHER_LINK_EVAL)) {
                    if ((angular.isUndefined(vm.model.voucherPriceInfo) || vm.model.voucherPriceInfo === null) && vm.model.cashPriceInfo) {
                        vm.model.refundFlags.callCenterSimple = false;
                        vm.model.refundFlags.refundSimple = false;
                        vm.model.refundFlags.mixedOption = true;
                        vm.model.refundFlags.availableCashRefund = false;
                    }
                    if ((angular.isUndefined(vm.model.cashPriceInfo) || vm.model.cashPriceInfo === null) && vm.model.voucherPriceInfo) {
                        vm.model.refundFlags.callCenterSimple = false;
                        vm.model.refundFlags.refundSimple = true;
                        vm.model.refundFlags.mixedOption = false;
                        vm.model.refundFlags.availableCashRefund = false;
                    }
                    if ((angular.isUndefined(vm.model.cashPriceInfo) || vm.model.cashPriceInfo === null) &&
                        (angular.isUndefined(vm.model.voucherPriceInfo) || vm.model.voucherPriceInfo === null)) {
                        vm.model.refundFlags.callCenterSimple = true;
                        vm.model.refundFlags.refundSimple = false;
                        vm.model.refundFlags.mixedOption = false;
                        vm.model.refundFlags.availableCashRefund = false;
                    }
                }
            }

        }

        function goHome () {
            $location.path($window.location.origin);
        }
    }
})();
