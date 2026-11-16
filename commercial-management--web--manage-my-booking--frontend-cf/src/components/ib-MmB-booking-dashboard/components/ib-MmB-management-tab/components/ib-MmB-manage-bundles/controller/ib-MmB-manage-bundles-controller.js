(function () {
    'use strict';

    angular
        .module('ib-MmB-manage-bundles-module')
        .controller('MmbManageBundlesController', MmbManageBundlesController);

    MmbManageBundlesController.$inject = ['MmBAppConstants', '$filter', 'CommonsSessionStorageService'];
    function MmbManageBundlesController (MmBAppConstants, $filter, CommonsSessionStorageService) {
        const vm = this;
        vm.$onInit = activate;


        function activate () {
            let i, j, textBundleAncillaries = '';
            let passengers = CommonsSessionStorageService.get('bookingInfo').passengers.length;
            for (i = 0; i < vm.model.length; i++) {
                for (j = 0; j < vm.model[i].items.length; j++) {
                    //textBundleAncillaries += vm.model[i].items[j].quantity + ' ';
                    textBundleAncillaries += '1 ';
                    switch (vm.model[i].items[j].type) {
                        case MmBAppConstants.ANCILLARIES_TYPES.FLEXIBILITY:
                            switch (vm.model[i].items[j].subtype) {
                                case 'FLIGHT_CHANGE':
                                    textBundleAncillaries += $filter('translate')('ANCILLARIES_FLEXIBILITY_FLIGHT_CHANGE_TITLE');
                                    break;
                                case 'VOUCHER_REFUND':
                                    textBundleAncillaries += $filter('translate')('ANCILLARIES_VOUCHER_REFUND_MODAL_TITLE');
                                    break;
                                case 'FLEXIBILITY_PACK':
                                    textBundleAncillaries += $filter('translate')('ANCILLARIES_FLEXIBILITY_PACK_FLEXIBILITY');
                                    break;
                            }
                            break;
                        case  MmBAppConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING:
                            textBundleAncillaries += $filter('translate')('PRIORITY_BOARDING_TITLE');
                            break;
                        case MmBAppConstants.ANCILLARIES_TYPES.BAGGAGE:
                            switch (vm.model[i].items[j].subtype) {
                                case MmBAppConstants.BAGG_TYPE.BAGGAGE_15:
                                    textBundleAncillaries += $filter('titleCaseFilter')($filter('translate')('BAGGAGE_SINGULAR_TEXT')) + ' 15Kg';
                                    break;
                                case MmBAppConstants.BAGG_TYPE.BAGGAGE_23:
                                    textBundleAncillaries += $filter('titleCaseFilter')($filter('translate')('BAGGAGE_SINGULAR_TEXT')) + ' 23Kg';
                                    break;
                                case MmBAppConstants.BAGG_TYPE.BAGGAGE_32:
                                    textBundleAncillaries += $filter('titleCaseFilter')($filter('translate')('BAGGAGE_SINGULAR_TEXT')) + ' 32Kg';
                                    break;
                                default:
                                    textBundleAncillaries += $filter('titleCaseFilter')($filter('translate')('BAGGAGE_SINGULAR_TEXT'));
                                    break;
                            }
                            break;
                        case MmBAppConstants.ANCILLARIES_TYPES.SPEQS:
                            switch (vm.model[i].items[j].subtype) {
                                case MmBAppConstants.SPEQ_TYPE.SKI_SNOW: textBundleAncillaries += $filter('translate')('SPEQS_SKI_SNOW'); break;
                                case MmBAppConstants.SPEQ_TYPE.GOLF_EQUIPMENT: textBundleAncillaries += $filter('translate')('SPEQS_GOLF_EQUIPMENT'); break;
                                case MmBAppConstants.SPEQ_TYPE.FISHING_EQUIPMENT: textBundleAncillaries +=  $filter('translate')('SPEQS_FISHING_TITLE'); break;
                                case MmBAppConstants.SPEQ_TYPE.SCUBA_DIVING: textBundleAncillaries += $filter('translate')('SPEQS_SCUBA_TITLE'); break;
                                case MmBAppConstants.SPEQ_TYPE.SURFBOARD: textBundleAncillaries +=textBundleAncillaries +=  $filter('translate')('SPEQS_SURFBOARD_TITLE'); break;
                                case MmBAppConstants.SPEQ_TYPE.BICYCLE: textBundleAncillaries += $filter('translate')('SPEQS_BICYCLE'); break;
                                case MmBAppConstants.SPEQ_TYPE.SPORTING_FIREARMS: textBundleAncillaries += 'Armas deportivas'; break;
                                default: $filter('translate')('ANCILLARIES_SPEQS_TITLE_TEXT'); break;
                            }
                            break;
                        }
                    if (j < vm.model[i].items.length-1) {
                        textBundleAncillaries += ', ';
                    }
                }
            }
            vm.model.bundleText = textBundleAncillaries;
        }
    }
})();
