(function () {
    'use strict';
    /**
    * @Controller
    * @name IbcoseModalDeepController
    * @desc Controller for the modal Deep instantiated in IBCOSE view
    */
    angular
        .module('ib-check-in-search')
        .controller('IbcoseModalDeepController', IbcoseModalDeepController);

    IbcoseModalDeepController.$inject = ['$uibModalInstance', 'IbUtilsService', '$sce', '$window', 'object', 'ModalService', 'CkiDatalayerConstants', 'CkiDataLayerService'];
    function IbcoseModalDeepController ($uibModalInstance, IbUtilsService, $sce, $window, object, ModalService, CkiDatalayerConstants, CkiDataLayerService) {

        const vm = this;
        vm.close = close;
        vm.url = (IbUtilsService.getDeviceType() === 'mobile') ? object.externalMobileUrl : object.externalUrl;
        vm.goDescription = object.externalCompany.description;
        vm.message = $sce.trustAsHtml(object.message);
        vm.openurl = openurl;
        vm.model = object;
        vm.deeplinkDigitalData = deeplinkDigitalData;
        vm.$onInit = activate;

        function activate () {
            vm.deeplinkDigitalData();
            ModalService.isNotWaiting();
        }

        function deeplinkDigitalData () {
            const source = vm.model.externalCompany.code;
            if (angular.isString(source) && source.length >= 2) {
                const digital_data = {};
                digital_data[CkiDatalayerConstants.DIGITAL_DATA_INFO.DEEPLINK] = source;
                CkiDataLayerService.addDigitalDataInfo(digital_data);
            }
        }

        //Close the modal
        function close () {
            //ModalService.isWaiting();
            $uibModalInstance.dismiss('cancel');
        }

        function openurl () {
            $window.location.href = vm.url;
        }
    }
})();
