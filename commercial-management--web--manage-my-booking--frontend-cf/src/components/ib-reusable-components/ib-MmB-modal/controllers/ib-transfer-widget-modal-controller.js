(function () {
    'use strict';

    angular
        .module('ib-MmB-modal-module')
        .controller('MmBTransferWidgetModalController', MmBTransferWidgetModalController);

    MmBTransferWidgetModalController.$inject = ['$rootScope','$scope', '$uibModalInstance', 'object','$window', 'ibMmBManageTransferWidgetInfoService', 'MmBAppConstants', 'localStorageService', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy', '$compile', '$sce', '$document', '$timeout', 'CommonsUtilService'];

    function MmBTransferWidgetModalController ($rootScope, $scope, $uibModalInstance, object, $window, ibMmBManageTransferWidgetInfoService, MmBAppConstants, localStorageService, CommonsNewHttpUtilsErrorService, CommonsGenericProxy, $compile, $sce, $document, $timeout, CommonsUtilService ) {
        const vm = this;
        vm.model = object;
        vm.close = closeModal;
        vm.tokenWidget = null;
        vm.reactWitgetModel = null;
        vm.bookingID = null;

        /**
         * Initialize modal controller
         */
        $scope.$watch('$viewContentLoaded', () => {
            loadWidgetsScripts();
            $timeout(() => {
                initTransferWidget();
            }, 1000);
        });

        function getEnvUrlToGetWidgetCode () {
            let env = '';
            const envCopy = {};
            (Object).assign(envCopy, (window).env);
            return envCopy.urlEnvironment;

        };
        function loadWidgetsScripts () {
            let scriptTransferVendor, scriptTransferMain, scriptTransferRunTime, cssTransfersMain, urlTransfers, baseUrl, widgetVersion;

            widgetVersion = '2.0.3';
            baseUrl = getEnvUrlToGetWidgetCode();
            urlTransfers = baseUrl + 'iberia-web-content/build-recoglobick-transfers-mmb/' + widgetVersion;

            scriptTransferVendor = '<script type="text/javascript" src="' + $sce.trustAsResourceUrl(urlTransfers + '/static/js/2.vendor.chunk.js') + '"</script>';
            scriptTransferMain = '<script type="text/javascript" src="' + $sce.trustAsResourceUrl(urlTransfers + '/static/js/main.chunk.js') + '"</script>';
            scriptTransferRunTime = '<script type="text/javascript" src="' + $sce.trustAsResourceUrl(urlTransfers + '/static/js/runtime-main.js') + '"</script>';
            cssTransfersMain = '<link rel="stylesheet" href="' + $sce.trustAsResourceUrl(urlTransfers + '/static/css/main.chunk.css') + '">';
            angular.element($document).find('body').prepend($compile(scriptTransferVendor)($scope));
            angular.element($document).find('body').prepend($compile(scriptTransferMain)($scope));
            angular.element($document).find('body').prepend($compile(scriptTransferRunTime)($scope));

            angular.element($document).find('body').prepend($compile(cssTransfersMain)($scope));
        };
        function getOrdersCallback () {}
        function cancelOrderCallback (bookingReference, bookingId, bookingInfo, totalPrice, state, stateName) {
            if(stateName === 'CONFIRMED') {
                const endpoint = PmtConstants.ENDPOINTS.reactWidgetCallbackURI.replaceAll('{flow-id}', localStorageService.get('flowId') );
                let confirmOrderCallback = generateConfirmOrderCallback();
                confirmOrderCallback = completeConfirmOrderCallback(bookingReference, bookingId, bookingInfo, totalPrice, state, confirmOrderCallback);
                CommonsGenericProxy.postGeneric(endpoint, confirmOrderCallback).then((data) => {
                    resolve(data);
                }, (error) => {
                    CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
            }
        }

        function generateLanguageAndMarket () {
            const confirmationDatalayerInfo = localStorageService.get('confirmationDatalayerInfo');
            let languageAndMarket;


            if(confirmationDatalayerInfo.idioma === 'es' ) {
                languageAndMarket = confirmationDatalayerInfo.idioma + '-' + 'ES';
            }else if(confirmationDatalayerInfo.idioma === 'en' ) {
                languageAndMarket = confirmationDatalayerInfo.idioma + '-' + 'US';
            }else if(confirmationDatalayerInfo.idioma === 'zh' ) {
                languageAndMarket = confirmationDatalayerInfo.idioma + '-' + 'CN';
            }

            return languageAndMarket;
        }

        function generateMountLocation() {
            let flowName = $rootScope.flowName;
            let flowNameReturned;
            if(flowName === 'BKI' || flowName === 'CKI' || flowName === 'MMB') {
                flowNameReturned = flowName;
            }else {
                flowNameReturned = '';
            }
            return flowNameReturned;
        }

        function generateBookingID() {
            const bookingDate = localStorageService.get('breakdownInfo');
            let hash;

            if(bookingDate?.context) {
                hash = bookingDate.context.locator + '-' + bookingDate.context.bookingDate.split(' ')[0].replaceAll('-', '');
                const generate = () => {
                    return CommonsUtilService.sha256(hash).then((hashEID) => {
                        return hashEID;
                    });
                };

                return generate().then((hash) => {
                    vm.bookingID = hash;
                    return vm.bookingID;
                });
            }
        }

        function checkIsPro () {
            let isPro = false;
            const widgetProMonetate = localStorageService.get('widgetProMonetate');
            const envCopy = {};
            (Object).assign(envCopy, (window).env);
            if(envCopy.production || widgetProMonetate) {
                isPro = 'prod';
            }else {
                isPro = 'test';
            }
            return isPro;
        }
        function generateTransferReactWidgetModel () {

            const widgetModel = {
                env: checkIsPro(),
                token: vm.tokenWidget,
                bookingId: vm.bookingID,
                language: generateLanguageAndMarket(),
                currency: vm.model.infoBooking.contextMetadata.currencies[0].code,
                currencyExchange: null,
                gaTrackingCode: 'test',
                getOrdersCallback: getOrdersCallback,
                cancelOrderCallback: cancelOrderCallback,
                mountLocation: generateMountLocation()
            };
            return widgetModel;
        }

        function initTransferWidget () {
            ibMmBManageTransferWidgetInfoService.getTokenWidget().then((response) => {
                vm.tokenWidget = response.data.access_token;
                generateBookingID().then(() => {
                    const reactWitgetModel = generateTransferReactWidgetModel();
                    $window.RecoglobickTransfersMmbWidget.unmount();
                    $window.RecoglobickTransfersMmbWidget.mount(reactWitgetModel);
                });
            });
        }

        /**
         * Closes the modal dismissing its instance
         */
        function closeModal () {
            if (angular.isDefined(vm.showError) && angular.isDefined(vm.submitted)) {
                vm.showError = false;
                vm.submitted = false;
            }

            $uibModalInstance.close();
        }

    }
})();
