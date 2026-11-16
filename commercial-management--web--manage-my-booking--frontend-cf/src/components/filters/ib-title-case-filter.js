(function () {
    'use strict';

    angular
        .module('ib-MmB-filters-module')
        .filter('titleCaseFilter', TitleCaseFilter);

    function TitleCaseFilter() {

        return convertToTitleCase;

        ////////////////

        function convertToTitleCase(input) {
            if (!input) {
                return '';
            }
            return input.replace(/\w\S*/g, function(txt){ 
                return txt[0].toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    }
})();