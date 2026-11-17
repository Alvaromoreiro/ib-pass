(function () {
    'use strict';

    angular
        .module('ib-segment-info-pa-module')
        .controller('SegmentInfoPAController', SegmentInfoPAController);

    SegmentInfoPAController.$inject = ['ModalService', 'CheckinAppConstants', 'IbUtilsService'];
    function SegmentInfoPAController (ModalService, CheckinAppConstants, IbUtilsService) {
        const vm = this;
        const availablePaLanguages = ['es', 'ca'];

        vm.showSegmentError = showSegmentError;
        vm.$onInit = activate;

        ////////////////

        function activate () {
            IbUtilsService.setTitlePage(CheckinAppConstants.TITLE_PAGE.FLIGHT_CONFIRMATION);
            if (vm.showPa) {
                vm.paIconUrl = CheckinAppConstants.iconsRoute + '/puente_aereo/logo_pte_aero_short_' + (availablePaLanguages.indexOf(CheckinAppConstants.lang) !== -1 ? CheckinAppConstants.lang : CheckinAppConstants.defaultLang) + '.png';
            }
        }

        function showSegmentError () {
            ModalService.setErrorMessage(vm.segmentInfoModel.status.message);
            ModalService.isError({ message: vm.segmentInfoModel.status.message, errorCode: '', internalErrorCode: 'SEGMENT_STATUS_ERROR' });
        }
    }
})();
