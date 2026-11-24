(function () {
    'use strict';
    angular
        .module('ib-pmt-wine-club-module')
        .controller('IbPmtWineClubController', IbPmtWineClubController);

    IbPmtWineClubController.$inject = ['PmtWineClubConstants', '$rootScope', '$window', 'DatalayerUtilsService'];
    function IbPmtWineClubController (PmtWineClubConstants, $rootScope, $window, DatalayerUtilsService) {        
        const vm = this;
        vm.onRedirect = onRedirect;
        vm.setBackgroundImage = setBackgroundImage;

        activate();

        function activate () { }

        function onRedirect () {
            if(vm.model.externalUrl) {
                DatalayerUtilsService.updateDatalayerEvent('','click','wineClub','interaccion');
                $window.open(vm.model.externalUrl, '_blank');
            }
        }

        function setBackgroundImage () {
            const image = PmtWineClubConstants.IMAGES.WINECLUB_IMG[$rootScope.appLang] || PmtWineClubConstants.IMAGES.WINECLUB_IMG.default;
            return  {backgroundImage: 'url('+ image + ')'};
        }
    }
})();