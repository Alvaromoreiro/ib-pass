(function () {
    'use strict';
    angular.module('ib-pmt-disscount-multiple-module').controller('IbPmtDisscountMultipleController', IbPmtDisscountMultipleController);
    IbPmtDisscountMultipleController.$inject = [
        '$scope',
        'PmtConstants',
        'PmtModalService',
        'localStorageService',
        'IbCheckVoucherCodeService',
        '$rootScope',
        'CurrencyService',
        '$window',
        '$filter',
        'DatalayerUtilsService',
        'PmtDatalayerConstants',
        'PmtAssFassAncillariesService',
        'NewMainHeaderFacade',
        '$timeout',
        'PmtComponentUtils',
        'CommonsUtilService',
        'PMTCheckPartnerDiscountsService',
        'DigitalDataService',
        'DccService',
        'IbUiAviosSummaryService',
        'IbCoupletPmtVoucherOtpModalService',
        'IbAssfassVoucherService'
    ];
    function IbPmtDisscountMultipleController (
        $scope,
        PmtConstants,
        PmtModalService,
        localStorageService,
        IbCheckVoucherCodeService,
        $rootScope,
        CurrencyService,
        $window,
        $filter,
        DatalayerUtilsService,
        PmtDatalayerConstants,
        PmtAssFassAncillariesService,
        NewMainHeaderFacade,
        $timeout,
        PmtComponentUtils,
        CommonsUtilService,
        PMTCheckPartnerDiscountsService,
        DigitalDataService,
        DccService,
        IbUiAviosSummaryService,
        IbCoupletPmtVoucherOtpModalService,
        IbAssfassVoucherService
    ) {
        const vm = this;
        vm.checkVoucher = checkVoucher;
        vm.cleanVoucherError = cleanVoucherError;
        vm.selectAviosDisscount = selectAviosDisscount;
        vm.openModalLinks = openModalLinks;
        vm.equalHeightTab = equalHeightTab;
        vm.updatePaymentsInfo = updatePaymentsInfo;
        vm.goToTermsAndConditionPage = goToTermsAndConditionPage;
        vm.responsive = responsive;
        vm.collapse = collapse;
        vm.dismountComponent = dismountComponent;
        activate();
        const errorVoucher = $rootScope.$on('errorOnVoucherService', errorOnVoucherService);
        $scope.$on('$destroy', errorVoucher);
        vm.binSlectAnotherPayment = $rootScope.$on('binSlectAnotherPayment', checkVoucherCodeForBin);
        $scope.$on('selectInitialAviosIndex', selectInitialAviosIndex);
        const errorAvios = $rootScope.$on('errorFullAvios', errorFullAviosDisable);
        $scope.$on('$destroy', errorAvios);
        $scope.$on('$destroy', vm.dismountComponent);
        $rootScope.$$listeners.checkVoucherCode = [];
        $rootScope.$on('checkVoucherCode', checkVoucherCode);
        $scope.$on('updateTotalPrice', updateTotalDisscounts);
        $scope.$on('updateTotalPriceToCero', updateTotalPriceToCero);

        function activate () {
            let headerModelData = {},
                discountsAppliedBasket = false;
            const discountModel = {},
                paymentInfo = localStorageService.get('paymentsInfo');
            const datalayerPartner = localStorageService.get('confirmationDatalayerInfo') ?? {};
            const orderDiscounts = localStorageService.get('orderDiscounts');
            const createOrderDataStoraged = localStorageService.get('createOrderData') || localStorageService.get('bookingInfo');
            vm.selectedData = localStorageService.get('selectedPaymentData')
                ? localStorageService.get('selectedPaymentData')
                : vm.selectedData
                    ? vm.selectedData
                    : {};
            vm.customerData = localStorageService.get('customerData');
            vm.createOrderData = createOrderDataStoraged;
            vm.paymentInfo = localStorageService.get('paymentsInfo');
            vm.formatedTotalDiscount = CurrencyService.formatPrice(vm.paymentInfo.currency, 0, true);
            vm.expandedMobile = false;
            vm.expanded = vm.expandedMobile;
            if (
                vm.createOrderData &&
                vm.createOrderData.order &&
                vm.createOrderData.order.discountsApplied &&
                vm.createOrderData.order.discountsApplied.discounts &&
                vm.createOrderData.order.discountsApplied.discounts.length > 0
            ) {
                discountsAppliedBasket = true;
            }
            headerModelData = localStorageService.get('headerModel');
            vm.partnerId = null;
            vm.isPartnerBin = paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.voucherType === PmtConstants.DISCOUNT_TYPES.PARTNER;
            if (vm.isPartnerBin) {
                vm.partnerId = paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].partnerId;
                vm.selectedDisscountTab = 1;
                discountModel.id =
                    paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].id ||
                    paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].partnerId;
                discountModel.discount = CurrencyService.formatPrice(
                    headerModelData.headerModel.shoppingBasket.currency,
                    paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].originalDiscount,
                    true
                );
                discountModel.originalDiscount = paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].originalDiscount;
                discountModel.totalDiscount = paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].originalDiscount;
                discountModel.description =
                    paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].description ?? $filter('translate')('BONUS_CARD_GIFT_TEXT');
                discountModel.type = PmtConstants.DISCOUNT_TYPES.VOUCHER;
                if (
                    paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].voucherType &&
                    (CommonsUtilService.isDiscountTypePartnerEquivalent(paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].voucherType) ||
                        paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].voucherType === PmtConstants.DISCOUNT_TYPES.PARTNER)
                ) {
                    datalayerPartner.codigoBono = discountModel.id;
                    datalayerPartner.importeBono = discountModel.discount;
                    if (createOrderDataStoraged) {
                        if (createOrderDataStoraged.order.bookingReferences.length > 1) {
                            angular.forEach(createOrderDataStoraged.order.bookingReferences, (item) => {
                                if (item.provider === 'IB') {
                                    datalayerPartner.localizadorBono = item.reference;
                                }
                            });
                        } else {
                            datalayerPartner.localizadorBono = createOrderDataStoraged.order.bookingReferences[0].reference;
                        }
                    }
                    datalayerPartner.precioPagado = paymentInfo.price.formattedTotalPrice;
                    DatalayerUtilsService.addDataLayerInfo(datalayerPartner);
                    /* INIT DELETE GA4 MIGRATION */
                    DatalayerUtilsService.sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                    /* FINISH DELETE GA4 MIGRATION */
                    if (
                        discountsAppliedBasket &&
                        (headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER] ||
                            headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.PARTNER])
                    ) {
                        const discountType = headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.PARTNER]
                            ? PmtConstants.DISCOUNT_TYPES.PARTNER
                            : PmtConstants.DISCOUNT_TYPES.VOUCHER;
                        headerModelData.headerModel.shoppingBasket.discountsModel.total =
                            headerModelData.headerModel.shoppingBasket.discountsModel.total -
                            (headerModelData.headerModel.shoppingBasket.discountsModel.discounts[discountType].totalDiscount ||
                                headerModelData.headerModel.shoppingBasket.discountsModel.discounts[discountType].originalDiscount ||
                                headerModelData.headerModel.shoppingBasket.discountsModel.discounts[discountType].discount ||
                                0);
                        delete headerModelData.headerModel.shoppingBasket.discountsModel.discounts[discountType];
                        NewMainHeaderFacade.updateHeaderModel(headerModelData);
                        NewMainHeaderFacade.addDiscountToBasket(discountModel);
                    } else if (
                        !discountsAppliedBasket &&
                        headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER]
                    ) {
                        NewMainHeaderFacade.updateBasketDiscounts(PmtConstants.DISCOUNT_TYPES.VOUCHER, discountModel);
                    }
                } else {
                    discountModel.type = PmtConstants.DISCOUNT_TYPES.VOUCHER;
                    if (discountsAppliedBasket && headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER]) {
                        headerModelData.headerModel.shoppingBasket.discountsModel.total =
                            headerModelData.headerModel.shoppingBasket.discountsModel.total - discountModel.originalDiscount || 0;
                        discountModel.description =
                            headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER].description;
                        delete headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER];
                        NewMainHeaderFacade.updateHeaderModel(headerModelData);
                        NewMainHeaderFacade.addDiscountToBasket(discountModel);
                    } else if (
                        !discountsAppliedBasket &&
                        headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER]
                    ) {
                        NewMainHeaderFacade.updateBasketDiscounts(PmtConstants.DISCOUNT_TYPES.VOUCHER, discountModel);
                    }
                }
                const voucherDeleteInfo = {
                    voucherCode:
                        paymentInfo?.appliedDiscounts?.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].id ||
                        paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.partnerId,
                    deleteVoucher: true,
                    isPartner: vm.isPartnerBin
                };
                localStorageService.set('voucherDeleteInfo', voucherDeleteInfo);
            }
            if (discountsAppliedBasket) {
                headerModelData.headerModel.shoppingBasket.total.totalPrice = paymentInfo.price.totalPrice;
                headerModelData.headerModel.shoppingBasket.total.formatted = paymentInfo.price.formattedTotalPrice;
                NewMainHeaderFacade.updateHeaderModel(headerModelData);
            }
            if (vm.selectedData && vm.selectedData.selectedAviosIndex) {
                vm.selectedAviosIndex = vm.selectedData.selectedAviosIndex;
            } else {
                vm.selectedAviosIndex = 0;
                if (orderDiscounts === 'descendingOrder' && vm.paymentInfo?.availableDiscounts?.AVIOS) {
                    const lastPosition = vm.paymentInfo.availableDiscounts.AVIOS.disscounts.length - 1;
                    vm.selectedAviosIndex = lastPosition;
                }
            }
            PmtComponentUtils.equalHeight(angular.element('#pmtDisMultiAvios'), true);
            vm.requiredValidation = false;
        }
        /**
         * Obtain voucher code then call checkVoucherCode
         * @param {boolean} deleteVoucher determinate if wants delete an existing applied voucher or add a new one
         */
        function checkVoucher (deleteVoucher, value) {
            let voucherCode,
                modalObject,
                voucherDeleteInfo = {};
            vm.isPartnerBin =
                vm.paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.voucherType === PmtConstants.DISCOUNT_TYPES.PARTNER;
            if (angular.isUndefined(value)) {
                vm.requiredValidation = true;
            } else {
                voucherCode = vm.voucherCode
                    ? vm.voucherCode
                    : vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].id ||
                      vm?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.partnerId;
                voucherDeleteInfo = {
                    voucherCode: voucherCode,
                    deleteVoucher: true,
                    isPartner: vm.isPartnerBin
                };
                const partnerTitle = vm.paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.description || '';
                localStorageService.set('voucherDeleteInfo', voucherDeleteInfo);
                vm.requiredValidation = true;
                if (vm.isPartnerBin && deleteVoucher) {
                    modalObject = {
                        title: 'PAYMENTS_DISCOUNTS_VOUCHER_MODAL_TITLE',
                        subtitle: '',
                        message: $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BODY_PARTNER', { partnerPlan: partnerTitle }),
                        showbuttons: {
                            accept: {
                                status: true,
                                text: 'PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_1',
                                accessibleText: 'PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_1'
                            },
                            cancel: {
                                status: true,
                                text:
                                    $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_1') +
                                    $filter('translate')(partnerTitle) +
                                    $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_2'),
                                accessibleText:
                                    $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_1') +
                                    $filter('translate')(partnerTitle) +
                                    $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_2')
                            }
                        }
                    };
                    PmtModalService.showGenericError(modalObject, true, PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
                        (type) => {
                            checkVoucherCode(voucherCode, voucherDeleteInfo);
                        },
                        () => {
                            angular.noop();
                        }
                    );
                } else {
                    checkVoucherCode(voucherCode, deleteVoucher);
                }
                vm.requiredValidation = false;
            }
        }

        function dismountComponent () {
            vm.binSlectAnotherPayment();
        }
        /**
         * when event recived call this function, change formSubmitted to false and call checkVoucherCode function with correct params
         * @param {*} event
         * @param {*} voucherCode
         * @param {*} deleteOption
         */
        function checkVoucherCodeForBin (event, voucher, deleteOption) {
            if (vm.template === 'voucher') {
                vm.formSubmitted = false;
                vm.voucherCode = null;

                checkVoucherCode(voucher.voucherCode, deleteOption, voucher.isPartner);
            }
        }

        function cleanVoucherError (value) {
            if (value === '') {
                delete vm.appliedDiscounts.error;
            }
            if (vm.disscounts && vm.disscounts[PmtConstants.DISCOUNT_TYPES.VOUCHER]) {
                delete vm.disscounts[PmtConstants.DISCOUNT_TYPES.VOUCHER].error;
            }
        }

        function openModalLinks (modalTemplate) {
            $scope.$emit('showConditionsDiscountsModal', modalTemplate);
        }

        function equalHeightTab (element, reload) {
            $timeout(() => {
                reload ? PmtComponentUtils.equalHeight(angular.element(element), reload) : PmtComponentUtils.equalHeight(angular.element(element), false);
            });
        }

        function getGenericErrorModel  () {
            const modalObject = {
                title: 'MODAL_ERROR_TITLE_VOUCHER',
                subtitle: '',
                showAlertIcon: true,
                showCloseLink: true,
                showCloseIcon: true,
                message: $filter('translate')('VOUCHER_CONTROLED_ERROR'),
                showbuttons: {
                    accept: {
                        status: true,
                        text: 'MODAL_ACCEPT_VOUCHER',
                        accessibleText: 'MODAL_ACCEPT'
                    }
                }
            };
            return modalObject;
        }
        function showValidationErrorModal (error) {
            const conditionForDisplayingModal = error.internalErrorCode !== 'VCH_VCH_11001' &&
                                                error.internalErrorCode !== 'ASS_FASS_9042' &&
                                                error.state !== 'CLOSED';
            if(conditionForDisplayingModal) {
                const model = getGenericErrorModel();
                PmtModalService.showGenericError(model, true, PmtConstants.MODALS.VOUCHER_ERROR_MODAL_PAYMENT);
            }
        }

        /**
         *
         * Check voucher code (calling service and updating payment info)
         * @param {String} voucherCode Code introduce in form in text format
         * @param {boolean} deleteVoucher
         */
        // #region checkVoucherCode
        function checkVoucherCode (voucherCode, deleteVoucher, isPartner) {
            const flowId = localStorageService.get('pmtModelInfo').ident;
            $rootScope.$broadcast('loadingVoucherBasket', true);
            const flowApp = localStorageService.get('flowApp');
            let voucherDeleteInfo;
            let checkisPartner = isPartner || false;
            if (deleteVoucher.voucherCode) {
                voucherDeleteInfo = localStorageService.get('voucherDeleteInfo');
                voucherCode = voucherDeleteInfo.voucherCode;
                deleteVoucher = voucherDeleteInfo.deleteVoucher;
                isPartner = voucherDeleteInfo.isPartner;
                checkisPartner = isPartner;
            }
            vm.showOptions.showLoadingData = true;
            vm.loadingIframe = true;
            /**
             *
             * @param {*} voucher
             * update voucher discount in localstorage flightaviosinfo
             */
            function updateVoucherFlightAvios (voucher) {
                const flightAviosInfo = localStorageService.get('flightAviosInfo');
                if(flightAviosInfo) {
                    // add voucher
                    if(voucher !== undefined) {

                        const myVoucher = {
                            type: voucher.voucherFopType,
                            percentDiscount: null,
                            totalDiscount: voucher.amount
                        };
                        flightAviosInfo.flight.discounts.push(myVoucher);
                        localStorageService.set('voucherOld', myVoucher);
                        localStorageService.set('flightAviosInfo', flightAviosInfo);

                    }else{
                    // delete voucher
                        const voucherOld = localStorageService.get('voucherOld');
                        flightAviosInfo.flight.discounts.splice(
                            flightAviosInfo.flight.discounts.findIndex(
                                d => d.type === voucherOld.type),
                            1);
                        localStorageService.remove('voucherOld');
                        localStorageService.set('flightAviosInfo', flightAviosInfo);

                    }
                    // call summary
                    IbUiAviosSummaryService.getCalculateAviosSummary(flightAviosInfo).then(
                        (response) => {
                        // reload avios
                            $rootScope.$broadcast('voucherFlightAviosInfo');
                        },
                        (error) => {
                        // error
                            $rootScope.$broadcast('voucherFlightAviosInfoError');
                        }
                    );
                }

            }
            if (!deleteVoucher) {
                localStorageService.set('availableDiscounts', vm.paymentInfo.availableDiscounts);
                if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES || flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                    IbAssfassVoucherService.getVoucherValidation(voucherCode, flowId).then((response) => {
                        if(response.code === 202) {
                            const { otpSessionId, otpSessionExpired, otpSessionRequested, otpEmail} = response.data;
                            const viewModel = {
                                voucherCode,
                                flowId:flowId,
                                sessionId: otpSessionId,
                                sessionExpiration: otpSessionExpired,
                                sessionRequested: otpSessionRequested,
                                email: otpEmail
                            };
                            IbCoupletPmtVoucherOtpModalService.showAssFassOtpModal(viewModel).then((state) => {
                                return IbAssfassVoucherService.validateVoucherCodeOtp(flowId, voucherCode, state.sessionId).then((response)=> {
                                    updateVoucherFlightAvios(response.data.voucherDiscount);
                                    updatePaymentsInfo(response.data);
                                    vm.showOptions.showLoadingData = false;
                                    vm.paymentInfo.iberiaPayLoadingIframe = false;
                                });
                            }).catch((error) => {
                                showValidationErrorModal(error);
                                errorOnVoucherService(null, error.message);
                                vm.showOptions.showLoadingData = false;
                                vm.paymentInfo.iberiaPayLoadingIframe = false;
                            });
                        }else {
                            localStorageService.set('voucherInfo', response.data.voucherDiscount);
                            updateVoucherFlightAvios(response.data.voucherDiscount);
                            updatePaymentsInfo();
                        }
                    }, (error)=> {
                        showValidationErrorModal(error);
                        errorOnVoucherService(null, error.message);
                    });
                } else if (checkisPartner) {
                    //NUEVA LLAMADA AL SERVICIO DE AÑADIR PARTNER
                    PMTCheckPartnerDiscountsService.addPartnerDiscount($rootScope.serviceURI, voucherCode, flowId).then(
                        updatePaymentsInfo,
                        angular.noop
                    );
                } else {
                    const promise = IbCheckVoucherCodeService.checkVoucherCode($rootScope.serviceURI, voucherCode, flowId);
                    promise.then((response) => {
                        if (response.code === 202) {
                            const { otpSessionId, otpSessionExpired, otpSessionRequested, otpEmail} = response.data.otpValidation;
                            const viewModel = {
                                voucherCode,
                                flowId:flowId,
                                sessionId: otpSessionId,
                                sessionExpiration: otpSessionExpired,
                                sessionRequested: otpSessionRequested,
                                email: otpEmail
                            };
                            IbCoupletPmtVoucherOtpModalService.showOrmOTPModal(viewModel).then((state) => {
                                return IbCheckVoucherCodeService.validateVoucherCodeOtp($rootScope.serviceURI, flowId, voucherCode, state.sessionId).then((response)=> {
                                    updateVoucherFlightAvios(response.data.order.voucherDiscount);
                                    updatePaymentsInfo(response.data);
                                });
                            }).catch((error) => {
                                showValidationErrorModal(error);
                                error?.message && (vm.appliedDiscounts.error = error.message);
                                updatePaymentsInfo();

                            });
                        } else {
                            updateVoucherFlightAvios(response.data.order.voucherDiscount);
                            updatePaymentsInfo(response.data);
                        }
                    }, (error)=> {
                        showValidationErrorModal(error);
                        error?.message && (vm.appliedDiscounts.error = error.message);
                        updatePaymentsInfo();
                    });
                }
            } else {
                if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES || flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                    PmtAssFassAncillariesService.deleteVoucher(voucherCode).then(() => {
                        localStorageService.remove('voucherInfo');
                        updatePaymentsInfo();
                    }, angular.noop);
                } else if (checkisPartner) {
                    PMTCheckPartnerDiscountsService.deletePartnerDiscount(
                        $rootScope.serviceURI,
                        voucherCode,
                        localStorageService.get('pmtModelInfo').ident
                    ).then(deleteVoucherSuccess, angular.noop);
                } else {
                    IbCheckVoucherCodeService.deleteVoucherCode($rootScope.serviceURI, voucherCode, localStorageService.get('pmtModelInfo').ident).then(
                        (response)=>deleteVoucherSuccess(response.data),
                        angular.noop
                    );
                }
            }
        }
        //#endregion
        function deleteVoucherSuccess (data) {
            const datalayerInfoAttrsPartner = ['codigoBono', 'importeBono', 'localizadorBono', 'precioPagado'];
            DatalayerUtilsService.removeDatalayerObjects(datalayerInfoAttrsPartner);
            /* INIT DELETE GA4 MIGRATION */
            DatalayerUtilsService.sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
            /* FINISH DELETE GA4 MIGRATION */
            DigitalDataService.emitViewEvent();
            updatePaymentsInfo(data);
        }

        /**
         *
         */
        function updatePaymentsInfo (data) {
            const selectAviosDisscount = localStorageService.get('selectedAviosDisccount');
            vm.isPartnerBin =
                vm.paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.voucherType === PmtConstants.DISCOUNT_TYPES.PARTNER;
            if (vm.isPartnerBin) {
                vm.partnerId = vm.paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.partnerId;
                /* INIT DELETE GA4 MIGRATION*/
                DatalayerUtilsService.addDataLayerInfo({ elegibleBono: 'SI' });
                /* FINISH DELETE GA4 MIGRATION*/
                DatalayerUtilsService.addDigitalDataInfo({ EligibleVoucher: 'SI' });
                /* INIT DELETE GA4 MIGRATION */
                DatalayerUtilsService.sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FINISH DELETE GA4 MIGRATION */
                DigitalDataService.emitViewEvent();
            } else {
                vm.partnerId = null;
                /* INIT DELETE GA4 MIGRATION*/
                DatalayerUtilsService.addDataLayerInfo({ elegibleBono: 'NO' });
                /* FINISH DELETE GA4 MIGRATION*/
                DatalayerUtilsService.addDigitalDataInfo({ EligibleVoucher: 'NO' });
                /* INIT DELETE GA4 MIGRATION */
                DatalayerUtilsService.sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FINISH DELETE GA4 MIGRATION */
                DigitalDataService.emitViewEvent();
            }
            if (selectAviosDisscount && vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER]) {
                localStorageService.set('paymentsInfo', vm.paymentInfo);
                localStorageService.set('availableDiscounts', vm.paymentInfo.availableDiscounts);
            }
            if (data) {
                if(localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) {
                    const createOrderData = localStorageService.get('createOrderData');
                    createOrderData.order = data.order;
                    data = createOrderData;
                }
                localStorageService.set('createOrderData', data);
            }
            $scope.$emit('updatePaymenthMethodsInfo');
        }
        /**
         * emit selectAviosDisscount event to parent controller for update data model with avios selected
         * @param {*} selectedAvios Avios data from list of available
         * @param {*} holdOldAvios
         */
        function selectAviosDisscount (index, selectedAvios) {
            let i,
                j,
                otherFees = localStorageService.get('otherFees') || null,
                foundedAviosInfo = false,
                foundedAviosInfoIndex,
                updatePaymentMethods = selectedAvios ? selectedAvios.paymentMethodsWithDiscount : vm.paymentInfo.paymentMethods,
                donationInfo = localStorageService.get('donation');

            DccService.setDccData();
            vm.appliedDiscounts = vm.appliedDiscounts || {};
            localStorageService.set('selectedAviosDisccount', selectedAvios);
            vm.showOptions.showLoadingData = true;
            localStorageService.set('deleteVoucher', false);
            vm.selectedData.selectedAviosIndex = vm.selectedAviosIndex;
            if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.CHECKIN) {
                vm.selectedData.selectedAviosIndex = vm.selectedAviosIndex = index;
            }
            localStorageService.set('selectedPaymentData', vm.selectedData);
            if (selectedAvios) {
                updatePmtMethodsFee(selectedAvios, updatePaymentMethods);
                updateSummaryAndPrice(vm.paymentInfo.currency, selectedAvios, updatePaymentMethods, vm.paymentInfo.originalPaymentMethods);
                vm.appliedDiscounts.status = true;
                setDigitalDataAviosDiscount(selectedAvios);
            } else {
                delete vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS];
                localStorageService.remove('selectedAviosDisccount');
                updatePmtMethodsFee(selectedAvios, updatePaymentMethods, localStorageService.get('paymentMethodsWithoutDiscount'));
                updateSummaryAndPrice(vm.paymentInfo.currency, selectedAvios, updatePaymentMethods, vm.paymentInfo.originalPaymentMethods);
                vm.appliedDiscounts.status = Object.keys(vm.appliedDiscounts?.types)?.length > 0;
                deleteDigitalDataAviosDiscountParam();
            }
            vm.showOptions.showLoadingData = false;
            if ($rootScope.appMarket === 'BR' || $rootScope.appMarket === 'AR') {
                $scope.$emit('disscountAviosSelected', vm.appliedDiscounts.status);
            }
            if (vm.summaryInfo.orderFees && vm.summaryInfo.orderFees.length > 0) {
                if (
                    vm.paymentInfo.selectedPaymentInfo &&
                    vm.paymentInfo.selectedPaymentInfo.selectedCard &&
                    vm.paymentInfo.selectedPaymentInfo.selectedCard.totalFee > 0
                ) {
                    vm.paymentInfo.price.totalPrice = vm.paymentInfo.price.totalPrice + vm.paymentInfo.selectedPaymentInfo.selectedCard.totalFee;
                    vm.paymentInfo.price.formattedTotalPrice = CurrencyService.formatPrice(vm.paymentInfo.currency, vm.paymentInfo.price.totalPrice, true);
                }
                if (donationInfo && donationInfo.option.option) {
                    vm.paymentInfo.price.totalPrice = vm.paymentInfo.price.totalPrice + donationInfo.option.option;
                    vm.paymentInfo.price.formattedTotalPrice = CurrencyService.formatPrice(vm.paymentInfo.currency, vm.paymentInfo.price.totalPrice, true);
                    vm.paymentInfo.price.formattedOldPriceInfo = vm.paymentInfo.price.formattedOldPriceInfo
                        ? CurrencyService.formatPrice(
                            vm.paymentInfo.currency,
                            vm.paymentInfo.originalPaymentMethods[vm.selectedData.selectedTab].total + donationInfo.option.option,
                            true
                        )
                        : null;
                }
            }
            if (vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER]) {
                vm.paymentInfo.price.formattedOldPriceInfo = vm.paymentMethods[vm.selectedData.selectedTab].oldPriceInfo
                    ? vm.paymentMethods[vm.selectedData.selectedTab].oldPriceInfo
                    : vm.paymentInfo.price.formattedOldPriceInfo;
            }
            // vm.summaryInfo.appliedDiscounts = vm.summaryInfo.appliedDiscounts || {};
            // vm.summaryInfo.appliedDiscounts = vm.appliedDiscounts;
            localStorageService.set('paymentsInfo', vm.paymentInfo);
            localStorageService.set('availableDiscounts', vm.paymentInfo.availableDiscounts);
            $scope.$emit('updateDisccountsTotal', vm.appliedDiscounts.types);
        }
        function updatePmtMethodsFee (selectedAvios, paymentMethod, originalPaymentMethods) {
            let i,
                j,
                isExternalCard = false,
                customerCreditCards = vm.paymentInfo.customerCreditCards ? vm.paymentInfo.customerCreditCards : null;
            if (selectedAvios) {
                for (i = 0; i < vm.paymentInfo.paymentMethods.length; i++) {
                    if (vm.paymentInfo.paymentMethods[i].types) {
                        isExternalCard = !!(
                            vm.paymentInfo.paymentMethods[i].types[0] &&
                            vm.paymentInfo.paymentMethods[i].types[0].requiredAdditionalFields &&
                            vm.paymentInfo.paymentMethods[i].types[0].external
                        );
                        vm.paymentInfo.paymentMethods[i].types = paymentMethod[i].types;
                        vm.paymentInfo.paymentMethods[i].creditCardTypes = paymentMethod[i].creditCardTypes;
                        if (isExternalCard) {
                            for (j = 0; j < vm.paymentInfo.paymentMethods[i].types.length; j++) {
                                vm.paymentInfo.paymentMethods[i].types[j].external = true;
                                vm.paymentInfo.paymentMethods[i].types[j].requiredAdditionalFields = true;
                            }
                        }
                    }
                }
                if (customerCreditCards !== null) {
                    updateCustomerCreditCardsFee(customerCreditCards);
                }
            } else {
                for (i = 0; i < vm.paymentInfo.paymentMethods.length; i++) {
                    if (vm.paymentInfo.paymentMethods[i].types) {
                        vm.paymentInfo.paymentMethods[i].types = originalPaymentMethods[i].types;
                    }
                    if (vm.paymentInfo.paymentMethods[i].creditCardTypes) {
                        vm.paymentInfo.paymentMethods[i].creditCardTypes = originalPaymentMethods[i].creditCardTypes;
                    }
                }
                if (customerCreditCards !== null) {
                    updateCustomerCreditCardsFee(customerCreditCards);
                }
            }
        }

        function updateCustomerCreditCardsFee (customerCreditCards) {
            let i, j;
            if (customerCreditCards[PmtConstants.PAYMENT_TYPES.CREDIT_CARD] || customerCreditCards[PmtConstants.PAYMENT_TYPES.IBERIA_PAY]) {
                if (customerCreditCards[PmtConstants.PAYMENT_TYPES.CREDIT_CARD]) {
                    for (i = 0; i < customerCreditCards[PmtConstants.PAYMENT_TYPES.CREDIT_CARD].length; i++) {
                        updateFee(customerCreditCards[PmtConstants.PAYMENT_TYPES.CREDIT_CARD][i], PmtConstants.PAYMENT_TYPES.CREDIT_CARD);
                    }
                } else {
                    for (j = 0; j < customerCreditCards[PmtConstants.PAYMENT_TYPES.IBERIA_PAY].length; j++) {
                        updateFee(customerCreditCards[PmtConstants.PAYMENT_TYPES.IBERIA_PAY][j], PmtConstants.PAYMENT_TYPES.IBERIA_PAY);
                    }
                }
            }
        }

        function updateFee (customerCreditCardsInfo, creditCardProviderType) {
            let i, j;
            for (i = 0; i < vm.paymentInfo.paymentMethods.length; i++) {
                if (vm.paymentInfo.paymentMethods[i].type === creditCardProviderType && vm.paymentInfo.paymentMethods[i].types.length > 0) {
                    for (j = 0; j < vm.paymentInfo.paymentMethods[i].types.length; j++) {
                        if (customerCreditCardsInfo.cardTypeCode === vm.paymentInfo.paymentMethods[i].types[j].cardTypeCode) {
                            customerCreditCardsInfo.totalFee = vm.paymentInfo.paymentMethods[i].types[j].totalFee;
                            customerCreditCardsInfo.unityFee = vm.paymentInfo.paymentMethods[i].types[j].unityFee;
                            customerCreditCardsInfo.parsedFee = vm.paymentInfo.paymentMethods[i].types[j].parsedFee;
                            customerCreditCardsInfo.totalToPay = vm.paymentInfo.paymentMethods[i].types[j].totalToPay;
                            customerCreditCardsInfo.extendedDescription = vm.paymentInfo.paymentMethods[i].types[j].extendedDescription;
                        }
                    }
                } else {
                    if (
                        customerCreditCardsInfo.cardTypeCode &&
                        vm.paymentInfo.selectedPaymentInfo?.selectedCard?.cardTypeId === customerCreditCardsInfo.cardTypeCode
                    ) {
                        customerCreditCardsInfo.totalFee = vm.paymentInfo.selectedPaymentInfo.selectedCard.totalFee;
                        customerCreditCardsInfo.unityFee = vm.paymentInfo.selectedPaymentInfo.selectedCard.fee;
                        customerCreditCardsInfo.parsedFee = vm.paymentInfo.selectedPaymentInfo.selectedCard.parsedFee;
                        customerCreditCardsInfo.totalToPay = vm.paymentInfo.selectedPaymentInfo.selectedCard.totalToPay;
                    }
                }
            }
        }

        function updateSummaryAndPrice (currency, selectedAvios, paymentMethod, originalPaymentMethods) {
            let i,
                feeTypeIndex,
                feeTypeFinded = false;
            if (selectedAvios) {
                vm.paymentInfo.price = {
                    totalPrice: paymentMethod[vm.selectedData.selectedTab].total,
                    formattedTotalPrice: CurrencyService.formatPrice(vm.paymentInfo.currency, paymentMethod[vm.selectedData.selectedTab].total, true),
                    textTotalPrice: $filter('translate')('SUMMARY_TOTAL'),
                    showTotalPrice: true
                };
                vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] = {
                    formatedAvios: CurrencyService.formatAvios(currency.groupingSeparator, selectedAvios.aviosRequired).trim(),
                    type: PmtConstants.DISCOUNT_TYPES.AVIOS,
                    id: selectedAvios.aviosRequired,
                    discount: CurrencyService.formatPrice(currency, selectedAvios.totalDiscount.fare, true),
                    originalDiscount: selectedAvios.totalDiscount.fare,
                    fullAvios: selectedAvios.fullAvios
                };
                NewMainHeaderFacade.updateBasketDiscounts(PmtConstants.DISCOUNT_TYPES.AVIOS, vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS]);
                $scope.$emit('updateDisccountsTotal', vm.appliedDiscounts.types);
                feeTypeIndex = 0;
                while (
                    vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types &&
                    !feeTypeFinded &&
                    feeTypeIndex < vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types.length
                ) {
                    if (
                        vm.paymentInfo.selectedPaymentInfo.selectedCard &&
                        vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].cardTypeId ===
                            vm.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId
                    ) {
                        feeTypeFinded = true;
                    } else {
                        feeTypeIndex++;
                    }
                }
                if (feeTypeFinded) {
                    vm.paymentInfo.selectedPaymentInfo.selectedCard = vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex];
                    for (i = 0; i < vm.summaryInfo.orderFees.length; i++) {
                        if (
                            vm.summaryInfo.orderFees[i].code === 'creditCardFee' &&
                            vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].cardTypeId ===
                                vm.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId
                        ) {
                            vm.summaryInfo.orderFees[i].totalFee = vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].totalFee;
                            vm.summaryInfo.orderFees[i].fee = CurrencyService.formatPrice(vm.paymentInfo.currency, vm.summaryInfo.orderFees[i].totalFee, true);
                            NewMainHeaderFacade.updateBasketOthers('CARD', vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex]);

                            localStorageService.set('creditCardFee', vm.summaryInfo.orderFees[i]);
                        }
                    }
                }
                if (selectedAvios.fullAvios && vm.summaryInfo.orderFees) {
                    for (i = 0; i < vm.summaryInfo.orderFees.length; i++) {
                        if (vm.summaryInfo.orderFees[i]?.code === 'creditCardFee') {
                            let total = vm.summaryInfo.orderFees.total;
                            total -= vm.summaryInfo.orderFees[i].totalFee;
                            vm.summaryInfo.orderFees.splice(i, 1);
                            vm.summaryInfo.orderFees.total = total;
                            vm.summaryInfo.orderFees.totalFormatted = CurrencyService.formatPrice(
                                vm.paymentInfo.currency,
                                vm.summaryInfo.orderFees.total,
                                true
                            ).trim();
                            NewMainHeaderFacade.updateBasketOthers('CARD', 0);
                        }
                    }
                }
                vm.paymentInfo.price.formattedOldPriceInfo = CurrencyService.formatPrice(
                    vm.paymentInfo.currency,
                    originalPaymentMethods[vm.selectedData.selectedTab].total,
                    true
                );
            } else {
                NewMainHeaderFacade.updateBasketDiscounts(PmtConstants.DISCOUNT_TYPES.AVIOS);
                vm.paymentInfo.price = {
                    totalPrice: originalPaymentMethods[vm.selectedData.selectedTab].total,
                    formattedTotalPrice: CurrencyService.formatPrice(vm.paymentInfo.currency, originalPaymentMethods[vm.selectedData.selectedTab].total, true),
                    textTotalPrice: $filter('translate')('SUMMARY_TOTAL'),
                    showTotalPrice: true
                };
                feeTypeIndex = 0;
                while (
                    vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types &&
                    !feeTypeFinded &&
                    feeTypeIndex < vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types.length
                ) {
                    if (
                        vm.paymentInfo.selectedPaymentInfo.selectedCard &&
                        vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].cardTypeId ===
                            vm.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId
                    ) {
                        feeTypeFinded = true;
                    } else {
                        feeTypeIndex++;
                    }
                }
                if (feeTypeFinded) {
                    vm.paymentInfo.selectedPaymentInfo.selectedCard = vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex];
                    for (i = 0; i < vm.summaryInfo.orderFees.length; i++) {
                        if (
                            vm.summaryInfo.orderFees[i].code === 'creditCardFee' &&
                            vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].cardTypeId ===
                                vm.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId
                        ) {
                            vm.summaryInfo.orderFees[i].totalFee = vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].totalFee;
                            vm.summaryInfo.orderFees[i].fee = CurrencyService.formatPrice(vm.paymentInfo.currency, vm.summaryInfo.orderFees[i].totalFee, true);
                            localStorageService.set('creditCardFee', vm.summaryInfo.orderFees[i]);
                        }
                    }
                }
            }
        }
        function goToTermsAndConditionPage () {
            $window.open($filter('LinksFilter')('TERMS_CONDITIONS_LINK'), '_blank');
        }
        function collapse (e) {
            let expanded = angular.element(e.target.parentNode).attr('aria-expanded');
            if (expanded === 'true') {
                expanded = true;
            } else {
                expanded = false;
            }
            $timeout(() => {
                vm.expanded = !expanded;
                equalHeightTab('#pmtDisMultiAvios', true);
            });
        }
        function responsive () {
            $timeout(() => {
                const windowWidth = $window.innerWidth;
                if (windowWidth <= 768) {
                    vm.isMobile = true;
                    equalHeightTab('#pmtDisMultiAvios', true);
                } else {
                    vm.isMobile = false;
                    vm.expanded = !vm.expandedMobile;
                    angular.element('#aviosCollapse').height('auto');
                    equalHeightTab('#pmtDisMultiAvios', true);
                }
            });
        }
        responsive();
        angular.element($window).bind('resize', () => {
            responsive();
        });
        function errorOnVoucherService (event, message) {
            vm.showOptions.showLoadingData = false;
            vm.paymentInfo.iberiaPayLoadingIframe = false;
            if (message) vm.appliedDiscounts.error = message;
        }
        function selectInitialAviosIndex (event, selectInitial) {
            vm.selectedAviosIndex = selectInitial
                ? 0
                : localStorageService.get('selectedPaymentData')
                    ? localStorageService.get('selectedPaymentData').selectedAviosIndex
                    : vm.selectedData.selectedAviosIndex;
            if (!!vm.paymentInfo.availableDiscounts.AVIOS && !!vm.paymentInfo.availableDiscounts.AVIOS.disscounts) {
                const paymentInfo = localStorageService.get('paymentsInfo');
                vm.selectedAviosIndex = paymentInfo.availableDiscounts.AVIOS.disscounts.length - 1;
            }
            equalHeightTab('#pmtDisMultiAvios', true);
        }
        function errorFullAviosDisable () {
            localStorageService.remove('selectedAviosDisccount');
            localStorageService.remove('selectedPaymentData');
            vm.errorFullAviosDisable = true;
            vm.selectedData.selectedAviosIndex = 0;
            vm.selectedAviosIndex = 0;
            vm.appliedDiscounts.status = false;
            vm.appliedDiscounts.types = {};
            selectAviosDisscount(null);
        }

        function updateTotalDisscounts (evt, value) {
            let i = 0;
            if (value === 0) {
                selectAviosDisscount(null);
                vm.formatedTotalDiscount = CurrencyService.formatPrice(vm.paymentInfo.currency, 0, true);
            } else {
                for (i = 0; i < vm.paymentInfo.availableDiscounts.AVIOS.disscounts.length; i++) {
                    if (value === vm.paymentInfo.availableDiscounts.AVIOS.disscounts[i].aviosRequired) {
                        vm.formatedTotalDiscount = vm.paymentInfo.availableDiscounts.AVIOS.disscounts[i].formatedTotalDiscount;
                        selectAviosDisscount(i + 1, vm.paymentInfo.availableDiscounts.AVIOS.disscounts[i]);
                    }
                }
            }
            $rootScope.$broadcast('updateBreakdownTotalPrice', vm.paymentInfo);
        }

        function updateTotalPriceToCero (evt, value) {
            vm.formatedTotalDiscount = CurrencyService.formatPrice(vm.paymentInfo.currency, value, true);
        }

        function setDigitalDataAviosDiscount (selectedAvios) {
            DatalayerUtilsService.addDigitalDataInfo({ [PmtConstants.DISCOUNT_TYPES.AVIOS_DISCOUNT] : selectedAvios.totalDiscount.fare });

        }
        function deleteDigitalDataAviosDiscountParam () {
            DatalayerUtilsService.removeDigitalDataObjects([PmtConstants.DISCOUNT_TYPES.AVIOS_DISCOUNT]);
        }
    }
})();
