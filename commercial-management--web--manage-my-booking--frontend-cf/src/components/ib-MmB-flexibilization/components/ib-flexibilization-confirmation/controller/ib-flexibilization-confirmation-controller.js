(function () {
    'use strict';

    angular
        .module('ib-flexibilization-confirmation-module')
        .controller('IbFlexibilizationConfirmationController', IbFlexibilizationConfirmationController);

    IbFlexibilizationConfirmationController.$inject = ['$scope', '$rootScope', 'localStorageService', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'MmBUtilsSharedService', 'CommonsUtilService', 'DisruptionUtilService'];
    function IbFlexibilizationConfirmationController($scope, $rootScope, localStorageService, MmBDatalayerUtilsService, MmBAppConstants, MmBUtilsSharedService, CommonsUtilService, DisruptionUtilService) {
        var vm = this;
        vm.$onInit = activate;
        vm.prevStep = prevStep;

        function activate() {
            var typeFlowDisruption = localStorageService.get('typeDisruptionFlow') || null, optional = localStorageService.get('optionalFlight') || false;
            var orderChangeRelatedKey = localStorageService.get('orderChangeRelatedKey'), index;
            var quadrigam = '';
            vm.model.infoBoxMsg = 'MMB_FLEXIBILIZATION_CONFIRMATION_INFO_DESCRIPTION_NEW_ORDER';
            $rootScope.blockedKeepAliveModal = true;

            if ($rootScope.isDisruptionFlow) {
                if (typeFlowDisruption) {
                    quadrigam = DisruptionUtilService.quadrigamByTypeFlow(typeFlowDisruption, optional);
                } else {
                    quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_CONFIRMATION;
                }
            } else {
                CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_VC_FLEXIBILIZATION_SUMMARY');
                quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_CONFIRMATION;
            }
            MmBUtilsSharedService.updateQuadrigam(quadrigam);
            MmBDatalayerUtilsService.addDataLayerEcommerceInfo(prepareEcommerceInfo());
            if (orderChangeRelatedKey && orderChangeRelatedKey.length) {
                for(index=0;index<orderChangeRelatedKey.length;index++){
                    if(orderChangeRelatedKey[0].key === 'FLIGHTS_NOT_OPERATED_BY_GROUP_IBERIA'){
                        vm.model.infoBoxMsg = orderChangeRelatedKey[0].value;
                    }
                }
            }
            localStorageService.remove('optionalFlight');
        };

        function prevStep() {
            $scope.$emit('prevStep');
        }

        function prepareEcommerceInfo() {
            var commercialInfo = localStorageService.get('commercialInfo');
            var segmentsInfo = '';
            var ecommerceInfo = {
                'currency': commercialInfo.currency.code,
                'transaction': {
                    'affiliation': commercialInfo.market.code,
                    'id': vm.model.confirmationCode,
                    'revenue': '',
                    'tax': '',
                    'shipping': ''
                },
                'products': []
            };

            angular.forEach(vm.model.slices, function (slice) {
                segmentsInfo = slice.segments[0].departureCode;
                angular.forEach(slice.segments, function (segment) {
                    segmentsInfo = segmentsInfo + '-' + segment.arrivalCode;
                });
                ecommerceInfo.products.push({
                    'name': 'Flight',
                    'category': 'Gestión de reservas',
                    'id': segmentsInfo,
                    'quantity': 1,
                    'price': ''
                });
            });
            return ecommerceInfo;
        }
        function setTitle(){
            var flowTitlesApp = localStorageService.get('flowTitlesApp');
            switch (flowTitlesApp){
                case MmBAppConstants.TITLES_APP.MANAGEMYBOOKING_DISRUPTION:
                    CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_VC_FLEXIBILIZATION_SUMMARY');
                    break;
                default:
                    CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_FC_DISRUPTION_SUMMARY');
                    break;
            }
        }
    }
})();
