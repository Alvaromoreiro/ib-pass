(function () {


    angular
        .module('ib-booking-filters-module')
        .filter('textFormatter', TextFormatterFilter);

    function TextFormatterFilter () {

        return formatText;

        function formatText (input) {

            let reg, str, i;

            if (arguments.length > 1) {

                str = input;
                for (i = 1; i < arguments.length; i++) {
                    reg = new RegExp('\\{' + (i - 1) + '\\}');
                    str = str.replace(reg, arguments[i]);
                }

                return str;
            }

            return input;
        }
    }
})();