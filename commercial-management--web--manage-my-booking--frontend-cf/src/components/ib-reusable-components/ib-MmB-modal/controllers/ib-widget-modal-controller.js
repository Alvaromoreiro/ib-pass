(function () {
    'use strict';

    angular
        .module('ib-MmB-modal-module')
        .controller('MmBWidgetModalController', MmBWidgetModalController);

    MmBWidgetModalController.$inject = ['$scope', '$uibModalInstance', 'object','$window', 'ibMmBManageWidgetInfoService', 'localStorageService', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy', '$compile', '$sce', '$document', '$timeout', 'CommonsUtilService'];

    function MmBWidgetModalController ($scope, $uibModalInstance, object, $window, ibMmBManageWidgetInfoService, localStorageService, CommonsNewHttpUtilsErrorService, CommonsGenericProxy, $compile, $sce, $document, $timeout, CommonsUtilService) {
        const vm = this;
        vm.model = object;
        vm.close = closeModal;
        vm.tokenWidget = null;
        vm.reactWitgetModel = null;

        /**
         * Initialize modal controller
         */
        $scope.$watch('$viewContentLoaded', () => {
            loadWidgetsScripts();
            $timeout(() => {
                initRecommendAppWidget();
            }, 1000);
        });
        function getEnvUrlToGetWidgetCode () {
            let env = '';
            const envCopy = {};
            (Object).assign(envCopy, (window).env);
            return envCopy.urlEnvironment;

        };
        function loadWidgetsScripts () {

            let scriptActivitiesVendor, scriptActivitiesMain, scriptActivitiesRunTime, cssActivitiesVendor, cssActivitiesMain, urlActivities, baseUrl, widgetVersion;

            widgetVersion = '2.0.3';
            baseUrl = getEnvUrlToGetWidgetCode();
            urlActivities = baseUrl + 'iberia-web-content/build-recoglobick-activities-mmb/' + widgetVersion;


            scriptActivitiesVendor = '<script type="text/javascript" src="' + $sce.trustAsResourceUrl(urlActivities + '/static/js/2.vendor.chunk.js') + '"</script>';
            scriptActivitiesMain = '<script type="text/javascript" src="' + $sce.trustAsResourceUrl(urlActivities + '/static/js/main.chunk.js') + '"</script>';
            scriptActivitiesRunTime = '<script type="text/javascript" src="' + $sce.trustAsResourceUrl(urlActivities + '/static/js/runtime-main.js') + '"</script>';
            cssActivitiesVendor = '<link rel="stylesheet" href="' + $sce.trustAsResourceUrl(urlActivities + '/static/css/2.vendor.chunk.css') + '">';
            cssActivitiesMain = '<link rel="stylesheet" href="' + $sce.trustAsResourceUrl(urlActivities + '/static/css/main.chunk.css') + '">';
            angular.element($document).find('body').prepend($compile(scriptActivitiesVendor)($scope));
            angular.element($document).find('body').prepend($compile(scriptActivitiesMain)($scope));
            angular.element($document).find('body').prepend($compile(scriptActivitiesRunTime)($scope));

            angular.element($document).find('body').prepend($compile(cssActivitiesVendor)($scope));
            angular.element($document).find('body').prepend($compile(cssActivitiesMain)($scope));

        }

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
        function generateReactWidgetModel () {
            const widgetModel = {
                env: checkIsPro(),
                token: vm.tokenWidget,
                bookingId: vm.model.experience.clientId,
                language: generateLanguageAndMarket(),
                currency: vm.model.infoBooking.contextMetadata.currencies[0].code,
                currencyExchange: null,
                gaTrackingCode: 'test',
                getOrdersCallback: getOrdersCallback,
                cancelOrderCallback: cancelOrderCallback
            };
            return widgetModel;
        }
        function initRecommendAppWidget () {
            ibMmBManageWidgetInfoService.getTokenWidget().then((response) => {
                vm.tokenWidget = response.data.access_token;
                generateBookingID().then(() => {
                    const reactWitgetModel = generateReactWidgetModel();
                    $window.RecoglobickActivitiesMmbWidget.unmount();
                    $window.RecoglobickActivitiesMmbWidget.mount(reactWitgetModel);
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
