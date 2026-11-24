(function () {
    'use strict';
    angular
        .module('ib-pmt-disscount-module')
        .controller('IbPmtDisscountController', IbPmtDisscountController);
    IbPmtDisscountController.$inject = ['$scope', 'PmtConstants', 'PmtModalService', 'localStorageService', 'IbCheckVoucherCodeService', '$rootScope', 'CurrencyService', 'PmtMethodsTransformer', '$window', '$filter', 'DatalayerUtilsService', 'PmtDatalayerConstants', 'PmtAssFassAncillariesService', 'PmtUtilsService', 'NewMainHeaderFacade', '$timeout', 'PmtComponentUtils', 'CommonsConstants','CommonsUserUtilsService', 'CommonsUtilService', 'PMTCheckPartnerDiscountsService', 'DigitalDataService', 'IbCoupletPmtVoucherOtpModalService', 'IbUiAviosSummaryService', 'IbAssfassVoucherService'];
    function IbPmtDisscountController ($scope, PmtConstants, PmtModalService, localStorageService, IbCheckVoucherCodeService, $rootScope, CurrencyService, PmtMethodsTransformer, $window, $filter, DatalayerUtilsService, PmtDatalayerConstants, PmtAssFassAncillariesService, PmtUtilsService, NewMainHeaderFacade, $timeout, PmtComponentUtils, CommonsConstants,CommonsUserUtilsService, CommonsUtilService, PMTCheckPartnerDiscountsService, DigitalDataService, IbCoupletPmtVoucherOtpModalService, IbUiAviosSummaryService, IbAssfassVoucherService) {

        const errorAvios = $rootScope.$on('errorFullAvios', errorFullAviosDisable), errorVoucher = $rootScope.$on('errorOnVoucherService', errorOnVoucherService), vm = this;
        vm.checkVoucher = checkVoucher;
        vm.cleanVoucherError = cleanVoucherError;
        vm.selectAviosDisscount = selectAviosDisscount;
        vm.goToTermsAndConditionPage = goToTermsAndConditionPage;
        vm.openModalLinks = openModalLinks;
        vm.equalHeightTab = equalHeightTab;
        vm.updatePaymentsInfo = updatePaymentsInfo;
        vm.dismountComponent = dismountComponent;
        activate();
        $scope.$on('$destroy', errorVoucher);
        vm.binSlectAnotherPayment = $rootScope.$on('binSlectAnotherPayment', checkVoucherCodeForBin);
        $scope.$on('$destroy', errorAvios);
        $scope.$on('$destroy', vm.dismountComponent);

        $rootScope.$on('checkVoucher', checkVoucher);

        function activate () {
            let headerModelData = {}, discountsAppliedBasket = false, i;
            const discountModel = {}, paymentInfo = localStorageService.get('paymentsInfo');
            vm.selectedData = localStorageService.get('selectedPaymentData') ? localStorageService.get('selectedPaymentData') : vm.selectedData;
            vm.selectedData = vm.selectedData ?? {};
            vm.customerData = localStorageService.get('customerData');
            const orderDiscounts = localStorageService.get('orderDiscounts');
            vm.createOrderData = localStorageService.get('createOrderData')|| localStorageService.get('bookingInfo');
            vm.isIbZero = CommonsUserUtilsService.isIbZero();
            vm.isSoftUser = CommonsUserUtilsService.isSoftUser();
            if (vm.createOrderData && vm.createOrderData.order && vm.createOrderData.order.discountsApplied
                && vm.createOrderData.order.discountsApplied.discounts && vm.createOrderData.order.discountsApplied.discounts.length > 0) {
                discountsAppliedBasket = true;
            }
            headerModelData = localStorageService.get('headerModel');
            if(headerModelData.headerModel.shoppingBasket.currency && headerModelData.headerModel.shoppingBasket.currency.currencySymbol) {
                vm.isLongCoinMarket = CommonsConstants.LONG_COINS_MARKETS.some(elem => elem === headerModelData.headerModel.shoppingBasket.currency.currencySymbol);
            }else{
                vm.isLongCoinMarket = false;
            }
            if(discountsAppliedBasket) {
                headerModelData.headerModel.shoppingBasket.total.totalPrice = paymentInfo.price.totalPrice;
                headerModelData.headerModel.shoppingBasket.total.original = paymentInfo.price.totalPrice;
                headerModelData.headerModel.shoppingBasket.total.formatted = paymentInfo.price.formattedTotalPrice;
                NewMainHeaderFacade.updateHeaderModel(headerModelData);
            }
            vm.partnerId = null;
            vm.isPartnerBin =  paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.voucherType === PmtConstants.DISCOUNT_TYPES.PARTNER;
            if (vm.isPartnerBin) {
                vm.selectedDisscountTab = 1;
                vm.partnerId = paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].partnerId;
                discountModel.id = paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].id|| paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].partnerId;
                discountModel.discount = CurrencyService.formatPrice(headerModelData.headerModel.shoppingBasket.currency,paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].originalDiscount,true);
                discountModel.originalDiscount = paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].originalDiscount;
                discountModel.description = paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].description?? $filter('translate')('BONUS_CARD_GIFT_TEXT');
                if ((paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].voucherType) && ((CommonsUtilService.isDiscountTypePartnerEquivalent(paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].voucherType)) || (paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].voucherType === PmtConstants.DISCOUNT_TYPES.PARTNER))) {
                    if(discountsAppliedBasket && (headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.PARTNER] || headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER] )) {
                        const discountType = headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.PARTNER]? PmtConstants.DISCOUNT_TYPES.PARTNER : PmtConstants.DISCOUNT_TYPES.VOUCHER;
                        headerModelData.headerModel.shoppingBasket.discountsModel.total = headerModelData.headerModel.shoppingBasket.discountsModel.total-(headerModelData.headerModel.shoppingBasket.discountsModel.discounts[discountType].totalDiscount || headerModelData.headerModel.shoppingBasket.discountsModel.discounts[discountType].originalDiscount || headerModelData.headerModel.shoppingBasket.discountsModel.discounts[discountType].discount || 0);
                        delete headerModelData.headerModel.shoppingBasket.discountsModel.discounts[discountType];
                        NewMainHeaderFacade.updateHeaderModel(headerModelData);
                    }
                    discountModel.type = PmtConstants.DISCOUNT_TYPES.PARTNER;
                    NewMainHeaderFacade.updateBasketDiscounts(PmtConstants.DISCOUNT_TYPES.VOUCHER, discountModel);
                } else {
                    if (discountsAppliedBasket && headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER]) {
                        headerModelData.headerModel.shoppingBasket.discountsModel.total = 0;
                        delete headerModelData.headerModel.shoppingBasket.discountsModel.discounts[PmtConstants.DISCOUNT_TYPES.VOUCHER];
                        NewMainHeaderFacade.updateHeaderModel(headerModelData);
                    }
                    discountModel.type = PmtConstants.DISCOUNT_TYPES.PARTNER;
                    NewMainHeaderFacade.updateBasketDiscounts(PmtConstants.DISCOUNT_TYPES.VOUCHER, discountModel);
                }
                const voucherDeleteInfo = {
                    voucherCode : paymentInfo?.appliedDiscounts?.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].id || paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.partnerId,
                    deleteVoucher : true,
                    isPartner: vm.isPartnerBin
                };
                localStorageService.set('voucherDeleteInfo', voucherDeleteInfo);
            }
            if (vm.selectedData && vm.selectedData.selectedAviosIndex) {
                vm.selectedAviosIndex = vm.selectedData.selectedAviosIndex;
            } else {
                vm.selectedAviosIndex = 0;
                if(orderDiscounts==='descendingOrder' && vm.paymentInfo?.availableDiscounts?.AVIOS) {
                    const lastPosition = vm.paymentInfo.availableDiscounts.AVIOS.disscounts.length -1;
                    vm.selectedAviosIndex = lastPosition;
                }
            }
            equalHeightTab('#pmtDisAvios', true);
        }

        /**
         * Obtain voucher code and determinate if user wants use voucher or other discount calling
         * showOneDiscountAdvice then call checkVoucherCode
         * @param {boolean} deleteVoucher determinate if wants delete an existing applied voucher or add a new one
         */
        function checkVoucher (deleteVoucher) {
            const voucherCode = vm.voucherCode ? vm.voucherCode : vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].id || vm?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.partnerId;
            let modalObject;
            const partnerTitle = vm.paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.description || '';
            if (!deleteVoucher && vm.appliedDiscounts && vm.appliedDiscounts.types && vm.appliedDiscounts.status) {
                showOneDiscountAdvice(PmtConstants.DISCOUNT_TYPES.VOUCHER, voucherCode, deleteVoucher);
            } else {
                const voucherDeleteInfo = {
                    voucherCode : voucherCode,
                    deleteVoucher : true,
                    isPartner: vm.isPartnerBin
                };
                const partnerTitle = vm.paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.description || '';
                localStorageService.set('voucherDeleteInfo', voucherDeleteInfo);
                if (vm.isPartnerBin && deleteVoucher) {
                    modalObject = {
                        title: 'PAYMENTS_DISCOUNTS_VOUCHER_MODAL_TITLE',
                        subtitle: '',
                        message: $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BODY_PARTNER', {partnerPlan: partnerTitle}),
                        showbuttons: {
                            accept: {
                                status: true,
                                text: 'PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_1',
                                accessibleText: 'PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_1'
                            },
                            cancel: {
                                status: true,
                                text: $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_1') + $filter('translate')(partnerTitle) + $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_2'),
                                accessibleText: $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_1') + $filter('translate')(partnerTitle) + $filter('translate')('PAYMENTS_DISCOUNTS_VOUCHER_MODAL_BUTTON_TEXT_2_PART_2')
                            }
                        }
                    };
                    PmtModalService.showGenericError(modalObject, true, PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then((type) => {
                        checkVoucherCode(voucherCode, voucherDeleteInfo);
                    }, () => {
                        angular.noop();
                    });
                } else {
                    checkVoucherCode(voucherCode, deleteVoucher);
                }
            }
        }

        function dismountComponent () {
            vm.binSlectAnotherPayment();
        }
        /**
         * When an avios is selected, this functions decide to show discount advice or go ahead
         * @param {*} index
         * @param {*} aviosDisscount data model for that avios discount with payment methods
         */
        function selectAviosDisscount (index, aviosDisscount) {
            if (vm.appliedDiscounts && vm.appliedDiscounts && vm.appliedDiscounts.types && vm.appliedDiscounts.status && !vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS]) {
                showOneDiscountAdvice(PmtConstants.DISCOUNT_TYPES.AVIOS, aviosDisscount);
            } else {
                checkAvios(aviosDisscount);
            }
            equalHeightTab('#pmtDisAvios', true);
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

        /**
         * Show modal when input voucher code and avios is selected
         * @param {Object} event Data of event
         * @param {String} type Type of disccount
         * @param {String} data Code of voucher introduced
         * @param {BOOL} deleteOption
         */
        function showOneDiscountAdvice (type, data, deleteOption) {
            const voucherCode = vm.voucherCode ? vm.voucherCode : vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].id
             || vm?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.partnerId;
            const newSelectedAviosIndex = vm.selectedAviosIndex;
            const typeModal = { code: type, idModal: PmtConstants.MODALS.PAYMENT_TAXES };
            PmtModalService.showGenericModal(false, PmtConstants.MODALS.PAYMENT_DISCOUNT_ADVICES, typeModal).result.then(() => {
                NewMainHeaderFacade.updateBasketDiscounts();
                NewMainHeaderFacade.updateBasketOthers();
                if (typeModal.code === PmtConstants.DISCOUNT_TYPES.VOUCHER) {
                    vm.selectedData.selectedAviosIndex = 0;
                    vm.selectedAviosIndex = 0;
                    localStorageService.set('selectedPaymentData', vm.selectedData);
                    checkVoucherCode(data, deleteOption);
                } else if (typeModal.code === PmtConstants.DISCOUNT_TYPES.AVIOS) {
                    vm.selectedData.selectedAviosIndex = newSelectedAviosIndex;
                    localStorageService.set('selectedPaymentData', vm.selectedData);
                    localStorageService.set('deleteVoucher', true);
                    localStorageService.set('discountSelected', data);
                    checkVoucherCode(voucherCode, true);
                } else {
                    checkVoucherCode(vm.paymentInfo.availableDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].voucherDiscount.voucherId, true, data);
                }
            }, () => {
                vm.selectedData.selectedDisscountTab === 1 ? vm.selectedData.selectedAviosIndex = 0 : null;
                localStorageService.set('selectedPaymentData', vm.selectedData);
            });
        }


        function cleanVoucherError () {
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
        function checkVoucherCode (voucherCode, deleteVoucher, isPartner) {
            const flowApp = localStorageService.get('flowApp');
            let checkisPartner = isPartner || false;
            if(deleteVoucher.voucherCode) {
                voucherDeleteInfo = localStorageService.get('voucherDeleteInfo');
                voucherCode = voucherDeleteInfo.voucherCode;
                deleteVoucher = voucherDeleteInfo.deleteVoucher;
                isPartner = voucherDeleteInfo.isPartner;
                checkisPartner = isPartner;
            }
            if (deleteVoucher === false) {
                vm.selectedData.selectedAviosIndex = 0;
            }
            if (vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] && localStorageService.get('selectedAviosDisccount')) {
                $scope.$emit('removeAviosDisscounts');
            }
            localStorageService.set('selectedPaymentData', vm.selectedData);
            vm.showOptions.showLoadingData = true;
            if (!deleteVoucher) {
                localStorageService.set('availableDiscounts', vm.paymentInfo.availableDiscounts);
            }
            vm.voucherPartner = {
                voucher: voucherCode,
                delete: !deleteVoucher
            };

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
                const flowId = localStorageService.get('flowId');
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
                }else if (checkisPartner) {
                    // NUEVO SERVICIO QUE AÑADE EL PARTNER
                    PMTCheckPartnerDiscountsService.addPartnerDiscount($rootScope.serviceURI, voucherCode, localStorageService.get('pmtModelInfo').ident)
                        .then(updatePaymentsInfo, angular.noop);



                } else {
                    IbCheckVoucherCodeService.checkVoucherCode($rootScope.serviceURI, voucherCode, localStorageService.get('pmtModelInfo').ident)
                        .then((response) => {
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
                                    updatePaymentsInfo();
                                });
                            } else {
                                updateVoucherFlightAvios(response.data.order.voucherDiscount);
                                updatePaymentsInfo(response.data);
                            }
                        }, (error)=> {
                            showValidationErrorModal(error);
                            updatePaymentsInfo();
                            errorOnVoucherService(null, error.message);
                        });
                }
            } else {
                if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES || flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                    PmtAssFassAncillariesService.deleteVoucher(voucherCode).then((data) => {
                        localStorageService.remove('voucherInfo');
                        updateVoucherFlightAvios(undefined);
                        updatePaymentsInfo(data);
                    }, angular.noop);
                } else if (checkisPartner) {
                    PMTCheckPartnerDiscountsService.deletePartnerDiscount( voucherCode, localStorageService.get('pmtModelInfo').ident)
                        .then(deleteVoucherSuccess, angular.noop);
                } else {
                    IbCheckVoucherCodeService.deleteVoucherCode($rootScope.serviceURI, voucherCode, localStorageService.get('pmtModelInfo').ident)
                        .then((response) => deleteVoucherSuccess(response.data), angular.noop);
                }

            }

        }
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
            let voucherDeleteInfo;
            vm.isPartnerBin = vm.paymentInfo?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.voucherType === PmtConstants.DISCOUNT_TYPES.PARTNER;
            const voucherCode = vm.voucherCode ? vm.voucherCode : vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER].id || vm?.appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.partnerId;
            if(vm.voucherPartner.delete) {
                const voucherDeleteInfo = {
                    deleteVoucher : vm.voucherPartner.delete,
                    voucherCode : voucherCode,
                    isPartner: vm.isPartnerBin
                };
                localStorageService.set('voucherDeleteInfo', voucherDeleteInfo);
            }else{
                localStorageService.remove('voucherDeleteInfo');
            }

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
                vm.partnerId=null;
                /* INIT DELETE GA4 MIGRATION*/
                DatalayerUtilsService.addDataLayerInfo({ elegibleBono: 'NO' });
                /* FINISH DELETE GA4 MIGRATION*/
                DatalayerUtilsService.addDigitalDataInfo({ EligibleVoucher: 'NO' });
                /* INIT DELETE GA4 MIGRATION */
                DatalayerUtilsService.sendDatalayerEvent(PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
                /* FINISH DELETE GA4 MIGRATION */
                DigitalDataService.emitViewEvent();
            }
            if (selectAviosDisscount && vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS]) {
                selectAviosDisscount.active = false;
                localStorageService.set('selectedAviosDisccount', selectAviosDisscount);
            } else {
                if (selectAviosDisscount && vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER]) {
                    vm.selectedData.selectedAviosIndex = 0;
                    localStorageService.set('selectedPaymentData', vm.selectedData);
                    selectAviosDisscount.active = false;
                    updateSummaryAndPrice(vm.paymentInfo.currency, selectAviosDisscount, selectAviosDisscount.paymentMethodsWithDiscount, vm.paymentInfo.originalPaymentMethods);
                    localStorageService.remove('selectedAviosDisccount');
                    localStorageService.set('paymentsInfo', vm.paymentInfo);
                    localStorageService.set('availableDiscounts', vm.paymentInfo.availableDiscounts);
                }
            }
            if (data) {
                localStorageService.set('createOrderData', data);
            }
            $scope.$emit('updatePaymenthMethodsInfo');
        }


        /**
         * emit checkAvios event to parent controller for update data model with avios selected
         * @param {*} selectedAvios Avios data from list of available
         * @param {*} holdOldAvios
         */
        function checkAvios (selectedAvios, holdOldAvios) {
            let i, j, foundedAviosInfoIndex,
                updatePaymentMethods = selectedAvios ? selectedAvios.paymentMethodsWithDiscount : vm.paymentInfo.paymentMethods;
            const otherFees = localStorageService.get('otherFees') || null, foundedAviosInfo = false, donationInfo = localStorageService.get('donation');

            vm.appliedDiscounts = vm.appliedDiscounts || {};
            localStorageService.set('selectedAviosDisccount', selectedAvios);
            vm.showOptions.showLoadingData = true;
            localStorageService.set('deleteVoucher', false);
            vm.selectedData.selectedAviosIndex = vm.selectedAviosIndex;
            localStorageService.set('selectedPaymentData', vm.selectedData);

            if (holdOldAvios) {
                if (!foundedAviosInfo) {
                    updatePaymentMethods = PmtMethodsTransformer.createCreditCardInfo(vm.paymentInfo.availableDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[0].paymentMethodsWithDiscount[0], vm.paymentInfo.currency, creditCards);
                }
                updatePmtMethodsFee(selectedAvios, updatePaymentMethods);
                updateSummaryAndPrice(vm.paymentInfo.currency, selectedAvios, updatePaymentMethods, vm.paymentInfo.originalPaymentMethods);
                $scope.$broadcast('initCheckboxAvios', foundedAviosInfoIndex);
                vm.appliedDiscounts.status = true;
            } else {
                if (selectedAvios) {
                    updatePmtMethodsFee(selectedAvios, updatePaymentMethods);
                    updateSummaryAndPrice(vm.paymentInfo.currency, selectedAvios, updatePaymentMethods, vm.paymentInfo.originalPaymentMethods);
                    vm.appliedDiscounts.status = true;
                } else {
                    delete vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS];
                    localStorageService.remove('selectedAviosDisccount');
                    updatePmtMethodsFee(selectedAvios, updatePaymentMethods, localStorageService.get('paymentMethodsWithoutDiscount'));
                    updateSummaryAndPrice(vm.paymentInfo.currency, selectedAvios, updatePaymentMethods, vm.paymentInfo.originalPaymentMethods);
                    vm.appliedDiscounts.status = vm.appliedDiscounts.types.length > 0;
                }
            }
            vm.showOptions.showLoadingData = false;
            if ($rootScope.appMarket === 'BR' || $rootScope.appMarket === 'AR') {
                $scope.$emit('disscountAviosSelected', vm.appliedDiscounts.status);
            }
            if (vm.summaryInfo.orderFees.length > 0) {
                if (vm.paymentInfo.selectedPaymentInfo && vm.paymentInfo.selectedPaymentInfo.selectedCard && vm.paymentInfo.selectedPaymentInfo.selectedCard.totalFee > 0) {
                    vm.paymentInfo.price.totalPrice = vm.paymentInfo.price.totalPrice + vm.paymentInfo.selectedPaymentInfo.selectedCard.totalFee;
                    vm.paymentInfo.price.formattedTotalPrice = CurrencyService.formatPrice(vm.paymentInfo.currency, vm.paymentInfo.price.totalPrice, true);
                }
                if (donationInfo && donationInfo.option.option) {
                    vm.paymentInfo.price.totalPrice = vm.paymentInfo.price.totalPrice + donationInfo.option.option;
                    vm.paymentInfo.price.formattedTotalPrice = CurrencyService.formatPrice(vm.paymentInfo.currency, vm.paymentInfo.price.totalPrice, true);
                    vm.paymentInfo.price.formattedOldPriceInfo = vm.paymentInfo.price.formattedOldPriceInfo ? CurrencyService.formatPrice(vm.paymentInfo.currency, vm.paymentInfo.originalPaymentMethods[vm.selectedData.selectedDisscountTab].total + donationInfo.option.option, true) : null;
                }
            }
            vm.summaryInfo.appliedDiscounts = vm.summaryInfo.appliedDiscounts || {};
            vm.summaryInfo.appliedDiscounts = vm.appliedDiscounts;
            localStorageService.set('paymentsInfo', vm.paymentInfo);
            localStorageService.set('availableDiscounts', vm.paymentInfo.availableDiscounts);
            $scope.$emit('updateDisccountsTotal');
        }

        function updatePmtMethodsFee (selectedAvios, paymentMethod, originalPaymentMethods) {
            let i, j, isExternalCard = false;
            const customerCreditCards = vm.paymentInfo.customerCreditCards ? vm.paymentInfo.customerCreditCards : null;
            if (selectedAvios) {
                for (i = 0; i < vm.paymentInfo.paymentMethods.length; i++) {
                    if (vm.paymentInfo.paymentMethods[i].types) {
                        isExternalCard = !!(vm.paymentInfo.paymentMethods[i].types[0] && vm.paymentInfo.paymentMethods[i].types[0].requiredAdditionalFields && vm.paymentInfo.paymentMethods[i].types[0].external);
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
                        updateResiberFee(customerCreditCards[PmtConstants.PAYMENT_TYPES.CREDIT_CARD][i]);
                    }
                } else {
                    for (j = 0; j < customerCreditCards[PmtConstants.PAYMENT_TYPES.IBERIA_PAY].length; j++) {
                        updateIBPayFee(customerCreditCards[PmtConstants.PAYMENT_TYPES.IBERIA_PAY][j]);
                    }
                }
            }
        }

        function updateResiberFee (customerCreditCardsInfo) {
            let i, j;
            for (i = 0; i < vm.paymentInfo.paymentMethods.length; i++) {
                if (vm.paymentInfo.paymentMethods[i].type === PmtConstants.PAYMENT_TYPES.CREDIT_CARD) {
                    for (j = 0; j < vm.paymentInfo.paymentMethods[i].types.length; j++) {
                        if (customerCreditCardsInfo.cardTypeCode === vm.paymentInfo.paymentMethods[i].types[j].cardTypeCode) {
                            customerCreditCardsInfo.totalFee = vm.paymentInfo.paymentMethods[i].types[j].totalFee;
                            customerCreditCardsInfo.unityFee = vm.paymentInfo.paymentMethods[i].types[j].unityFee;
                            customerCreditCardsInfo.parsedFee = vm.paymentInfo.paymentMethods[i].types[j].parsedFee;
                            customerCreditCardsInfo.totalToPay = vm.paymentInfo.paymentMethods[i].types[j].totalToPay;
                            customerCreditCardsInfo.extendedDescription = vm.paymentInfo.paymentMethods[i].types[j].extendedDescription;
                        }
                    }
                }
            }
        }

        function updateIBPayFee (customerCreditCardsInfo) {
            let i, j;
            for (i = 0; i < vm.paymentInfo.paymentMethods.length; i++) {
                if (vm.paymentInfo.paymentMethods[i].type === PmtConstants.PAYMENT_TYPES.IBERIA_PAY) {
                    for (j = 0; j < vm.paymentInfo.paymentMethods[i].types.length; j++) {
                        if (customerCreditCardsInfo.cardTypeCode === vm.paymentInfo.paymentMethods[i].types[j].cardTypeCode) {
                            customerCreditCardsInfo.totalFee = vm.paymentInfo.paymentMethods[i].types[j].totalFee;
                            customerCreditCardsInfo.unityFee = vm.paymentInfo.paymentMethods[i].types[j].unityFee;
                            customerCreditCardsInfo.parsedFee = vm.paymentInfo.paymentMethods[i].types[j].parsedFee;
                            customerCreditCardsInfo.totalToPay = vm.paymentInfo.paymentMethods[i].types[j].totalToPay;
                            customerCreditCardsInfo.extendedDescription = vm.paymentInfo.paymentMethods[i].types[j].extendedDescription;
                        }
                    }
                }
            }
        }

        function updateSummaryAndPrice (currency, selectedAvios, paymentMethod, originalPaymentMethods) {
            let i, feeTypeIndex, feeTypeFinded = false;
            if (selectedAvios) {

                vm.paymentInfo.price = {
                    totalPrice: paymentMethod[vm.selectedData.selectedDisscountTab].total,
                    formattedTotalPrice: CurrencyService.formatPrice(vm.paymentInfo.currency, paymentMethod[vm.selectedData.selectedDisscountTab].total, true),
                    textTotalPrice: $filter('translate')('SUMMARY_TOTAL'),
                    showTotalPrice: true
                };
                vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] = {
                    formatedAvios: CurrencyService.formatAvios(currency.groupingSeparator, selectedAvios.aviosRequired).trim(),
                    type: PmtConstants.DISCOUNT_TYPES.AVIOS,
                    id: selectedAvios.aviosRequired,
                    discount: CurrencyService.formatPrice(currency, selectedAvios.totalDiscount.fare, true),
                    originalDiscount: selectedAvios.totalDiscount.fare
                };
                NewMainHeaderFacade.updateBasketDiscounts(PmtConstants.DISCOUNT_TYPES.AVIOS, vm.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS]);

                feeTypeIndex = 0;
                while (vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types && !feeTypeFinded && feeTypeIndex < vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types.length) {
                    if (vm.paymentInfo.selectedPaymentInfo.selectedCard && vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].cardTypeId === vm.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId) {
                        feeTypeFinded = true;
                    } else {
                        feeTypeIndex++;
                    }
                }
                if (feeTypeFinded) {
                    vm.paymentInfo.selectedPaymentInfo.selectedCard = vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex];
                    for (i = 0; i < vm.summaryInfo.orderFees.length; i++) {
                        if (vm.summaryInfo.orderFees[i].code === 'creditCardFee' && vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].cardTypeId === vm.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId) {
                            vm.summaryInfo.orderFees[i].totalFee = vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].totalFee;
                            vm.summaryInfo.orderFees[i].fee = CurrencyService.formatPrice(vm.paymentInfo.currency, vm.summaryInfo.orderFees[i].totalFee, true);
                            NewMainHeaderFacade.updateBasketOthers('CARD', vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex]);

                            localStorageService.set('creditCardFee', vm.summaryInfo.orderFees[i]);
                        }
                    }
                }
                vm.paymentInfo.price.formattedOldPriceInfo = CurrencyService.formatPrice(vm.paymentInfo.currency, originalPaymentMethods[vm.selectedData.selectedDisscountTab].total, true);
            } else {
                NewMainHeaderFacade.updateBasketDiscounts(PmtConstants.DISCOUNT_TYPES.AVIOS);
                vm.paymentInfo.price = {
                    totalPrice: originalPaymentMethods[vm.selectedData.selectedTab].total,
                    formattedTotalPrice: CurrencyService.formatPrice(vm.paymentInfo.currency, originalPaymentMethods[vm.selectedData.selectedTab].total, true),
                    textTotalPrice: $filter('translate')('SUMMARY_TOTAL'),
                    showTotalPrice: true
                };
                feeTypeIndex = 0;
                while (vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types && !feeTypeFinded && feeTypeIndex < vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types.length) {
                    if (vm.paymentInfo.selectedPaymentInfo.selectedCard && vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].cardTypeId === vm.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId) {
                        feeTypeFinded = true;
                    } else {
                        feeTypeIndex++;
                    }
                }
                if (feeTypeFinded) {
                    vm.paymentInfo.selectedPaymentInfo.selectedCard = vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex];
                    for (i = 0; i < vm.summaryInfo.orderFees.length; i++) {
                        if (vm.summaryInfo.orderFees[i].code === 'creditCardFee' && vm.paymentInfo.paymentMethods[vm.selectedData.selectedTab].types[feeTypeIndex].cardTypeId === vm.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId) {
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

        function errorOnVoucherService (event, message) {
            vm.showOptions.showLoadingData = false;
            //vm.loadingIframe = true;
            vm.loadingIframe = !vm.loggedInfo;
            if (message)
                vm.appliedDiscounts.error = message;
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
    }
})();
