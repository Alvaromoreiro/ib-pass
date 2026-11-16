(function () {


    angular
        .module('ib-booking-filters-module')
        .filter('WordNumberFormatFilter', WordNumberFormatFilter);

    function WordNumberFormatFilter () {

        return wordnumberString;

        ////////////////

        function wordnumberString (type, number) {
            return number > 1 ? 'SOME_' + type : type;
        }
    }
})();