(function () {
    'use strict';

    angular
        .module('ib-partner-box-module')
        .controller('PartnerBoxModuleController', PartnerBoxModuleController);

    PartnerBoxModuleController.$inject = ['$rootScope','$filter', '$window'];

    function PartnerBoxModuleController($rootScope, $filter, $window) {
        var vm = this;
        const tagsDescription = {
            bold: {
                tag: 'span',
                class:'ib-text ib-text--bold ib-text--inline'
            }
        };
        vm.$onInit = activate;
        vm.redirect = redirect;

        function activate() {
            vm.model = {};
            vm.model.description = $filter('literalFormatter')($filter('translate')('MMB_STOPOVER_GENERAL_TEXT'), tagsDescription);
        }

        function redirect() {
            let stopoverUrl;
            let market = $rootScope.appMarket.toLowerCase();;
            let language = $rootScope.appLang.toLowerCase();
            let urlEnvironment = $window.env.urlEnvironment;
            stopoverUrl = `${urlEnvironment}${market}/${language}/stopover-in-madrid`;
            $window.open(stopoverUrl, '_blank');
        }
    }
})();
