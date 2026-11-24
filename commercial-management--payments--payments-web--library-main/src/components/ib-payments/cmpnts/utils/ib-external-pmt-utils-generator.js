(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .factory('ExternalPaymentsUtilsGenerator', ExternalPaymentsUtilsGenerator);

    ExternalPaymentsUtilsGenerator.$inject = ['$rootScope', '$sce', '$document', '$compile', '$window', '$timeout', 'PaymentModalService'];
    function ExternalPaymentsUtilsGenerator($rootScope, $sce, $document, $compile, $window, $timeout, PaymentModalService) {
        var service = {
            generate3DSForm: generate3DSForm,
            generate3DSExternalForm: generate3DSExternalForm,
            generateOnlineBankingForm: generateOnlineBankingForm,
            generateOnlineBankingIdealForm: generateOnlineBankingIdealForm,
            generateJcbForm: generateJcbForm
        };
        return service;

        ////////////////

        /**
         * Generate 3DS(fraud control) hidden payment form to redirect to external bank platform
         * @param {*} formData 
         */

        function generate3DSForm(formData) {
            var form = '<form id="iframeForm" action="' + $sce.trustAsResourceUrl(formData.redirectURL) + '" method="post" target="iframeExternalPayment">';
            angular.forEach(formData.redirectData, function (inputInfo, inputName) {
                form += '<input type="hidden" name="' + inputName + '" value="' + inputInfo + '" />';
            });
            form += '<input type="submit" id="submit_hidden_form" class="u-hide" /></form>';
            $rootScope.$broadcast('endPaymentEventCard');
            PaymentModalService.finishWaiting();
            $timeout(function () {
                PaymentModalService.showGenericModal(false, 'external-payment-modal.html', { 'title': 'IBPURC_EXTERNAL_PAYMENT_IFRAME_BANKING_SELECT_BANK_TITLE', 'subtitle': 'IBPURC_EXTERNAL_PAYMENT_IFRAME_BANKING_SELECT_BANK_SUBTITLE', 'accept': 'PAYMENT_BUTTON_MODAL_EXTERNAL' }).result.then(angular.noop, angular.noop);
            });
            $timeout(function () {
                angular.element($document).find('#externalPaymentModal').append($compile(form)($rootScope));
                angular.element($document).find('#iframeForm').submit();
            });
        }


        /**
         * Generate 3DS(fraud control) payment form with external bank form inside a modal
         * @param {*} formData 
         */

        function generate3DSExternalForm(formData) {
            var url = $window.location, form = '<form action="' + $sce.trustAsResourceUrl(formData.redirectURL) + '" method="post">';
            angular.forEach(formData.redirectData, function (inputInfo, inputName) {
                if (inputName === 'urlOk') {
                    inputInfo = url.origin + url.pathname + '#!/ohinfo'
                }
                form += '<input type="hidden" name="' + inputName + '" value="' + inputInfo + '" />';
            });
            form += '<input type="submit" id="submit_hidden_form" class="u-hide" /></form>';
            angular.element($document).find('body').append($compile(form)($rootScope));
            $timeout(function () {
                angular.element(angular.element($document).find('#submit_hidden_form')).trigger('click');
            });
        }

        /**
         * Generate general Online Banking payment form
         * @param {*} formData 
         */

        function generateOnlineBankingForm(formData) {
            var form = '<form action="' + $sce.trustAsResourceUrl(formData.paymentFormURL) + '" class="paymentWidgets u-hide" data-brands="' + formData.paymentFormDataAttributes['data-brands'] + '" </form>';
            var script = '<script src="' + formData.resourceJavaScriptURL + '"></script>';
            angular.element($document).find('body').append($compile(form)($rootScope));
            $window.wpwlOptions = {
                locale: $rootScope.appLang,
                onReady: function () {
                    angular.element($document).find('.spinner').css('display', 'none');
                    angular.element($document).find('.wpwl-container').css('display', 'none');
                    angular.element($document).find('.wpwl-control-country').find('option').remove().end();
                    angular.element($document).find('select[name="bankAccount.country"]').append('<option selected=\"selected\" value="' + $rootScope.appMarket + '"></option>');
                    angular.element($document).find('.wpwl-form').submit();
                }
            }
            $timeout(function () {
                angular.element($document).find('body').append($compile(script)($rootScope));
            });
        }

        /**
         * Generate Online Banking payment form for IDEAL provider
         * @param {*} formData 
         */

        function generateOnlineBankingIdealForm(formData, paymentType, provider) {
            var script, form, selectBanks, banksSelectOptionsIndex, banksSelectOptions = [];
            $window.wpwlOptions = {
                locale: $rootScope.appLang,
                onReady: function () {
                    $rootScope.$broadcast('endPaymentEventCard');
                    PaymentModalService.finishWaiting();
                    $timeout(function () {
                        angular.element($document).find('.spinner').css('display', 'none');
                        angular.element($document).find('.wpwl-container').css('display', 'none');
                        selectBanks = angular.element($document).find('select[name="bankAccount.bankName"]')[0];
                        for (banksSelectOptionsIndex = 0; banksSelectOptionsIndex < selectBanks.length; banksSelectOptionsIndex++) {
                            banksSelectOptions.push(
                                {
                                    'id': banksSelectOptionsIndex,
                                    'bankName': selectBanks[banksSelectOptionsIndex].text,
                                    'bankValue': selectBanks[banksSelectOptionsIndex].value
                                }
                            );
                        }
                        $rootScope.$broadcast('loadingDataEvent', false);
                        PaymentModalService.showGenericModal(false, 'online-banking-select-modal.html', { 'title': 'IBPURC_PAYMENTS_ONLINE_BANKING_SELECT_BANK_TITLE', 'subtitle': 'IBPURC_PAYMENTS_ONLINE_BANKING_SELECT_BANK_SUBTITLE', 'accept': 'PAYMENT_BUTTON_MODAL_EXTERNAL', 'banksSelectOptions': banksSelectOptions }).result.then(function (selectedBankOption) {
                            if (paymentType === PmtConstants.PAYMENT_TYPES.BUTTON && provider === PmtConstants.PAYMENTS_PROVIDER.IDEAL && selectedBankOption) {
                                angular.element($document).find('.wpwl-control-bankName').find('option').remove().end();
                                angular.element($document).find('select[name="bankAccount.bankName"]').append('<option selected=\"selected\" value="' + selectedBankOption.bankValue + '"></option>');
                                angular.element($document).find('.wpwl-form').submit();
                                PaymentModalService.showWaitingModal('ib-modal-pmt-cards', 'ib-modals ib-modals--transparent', true);
                            }
                        }, angular.noop);
                    });
                }
            };
            form = '<form action="' + $sce.trustAsResourceUrl(formData.paymentFormURL) + '" class="paymentWidgets" data-brands="' + formData.paymentFormDataAttributes['data-brands'] + '" </form>';
            $timeout(function () {
                angular.element($document).find('#onlineBankingForm').append($compile(form)($rootScope));
                $rootScope.$broadcast('loadingDataEvent', true);
            });
            script = '<script src="' + formData.resourceJavaScriptURL + '"></script>';
            $timeout(function () {
                angular.element($document).find('#onlineBankingForm').append($compile(script)($rootScope));
            });
        }


        /**
         * Generate JCB payment form
         * @param {*} formData 
         */

        function generateJcbForm(formData) {
            var script, form, banksSelectOptions = [];
            $window.wpwlOptions = {
                locale: $rootScope.appLang,
                onReady: function () {
                    $rootScope.$broadcast('endPaymentEventCard');
                    PaymentModalService.finishWaiting();
                    $timeout(function () {
                        angular.element($document).find('.spinner').css('display', 'none');
                        angular.element($document).find('.wpwl-container').css('display', 'none');
                        angular.extend(vm.model.paymentMethods[vm.model.paymentInfo.selectedTab], { 'banksSelectOptions': banksSelectOptions });
                        $rootScope.$broadcast('loadingDataEvent', false);
                        PaymentModalService.showGenericModal(false, 'external-payment-modal.html', { 'title': 'IBPURC_EXTERNAL_PAYMENT_IFRAME_BANKING_SELECT_BANK_TITLE', 'subtitle': 'IBPURC_EXTERNAL_PAYMENT_IFRAME_BANKING_SELECT_BANK_SUBTITLE', 'accept': 'PAYMENT_BUTTON_MODAL_EXTERNAL' }).result.then(function (selectedankOption) {
                            angular.element($document).find('.wpwl-form').submit();
                            event.preventDefault();
                        }, angular.noop);
                        $timeout(function () {
                            angular.element($document).find('#externalPayment').removeClass('u-hide');
                            angular.element($document).find('.wpwl-form').removeClass('wpwl-form-card');
                            angular.element($document).find('.wpwl-group-brand').css({ 'display': 'none', });
                            angular.element($document).find('.wpwl-label').css({ 'font-weight': 'bold' });
                            angular.element($document).find('.wpwl-group').css({ 'width': '100%', 'padding-right': '0px', 'font-family': 'iberiaheadline' });
                            angular.element($document).find('.wpwl-button.wpwl-button-pay').addClass('ib-button ib-button--w-medium');
                            angular.element($document).find('.wpwl-button.wpwl-button-pay').removeClass('wpwl-button wpwl-button-pay');
                            angular.element($document).find('#externalPaymentModal').append(angular.element($document).find('#externalPayment'));
                        });
                    });
                }
            };
            form = '<form action="' + $sce.trustAsResourceUrl(formData.paymentFormURL) + '" class="paymentWidgets" data-brands="' + formData.paymentFormDataAttributes['data-brands'] + '" </form>';
            $timeout(function () {
                angular.element($document).find('#externalPayment').append($compile(form)($rootScope));
            });
            script = '<script src="' + formData.resourceJavaScriptURL + '"></script>';
            $timeout(function () {
                angular.element($document).find('#externalPayment').append($compile(script)($rootScope));
                angular.element($document).find('.spinner').css('display', 'none');
            });
        }





    }
})();