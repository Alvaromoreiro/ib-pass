(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .filter('textFormatter', textFormatter);
        
    function textFormatter() {

        return formatText;

        function formatText(input) {
            var str, reg, i;
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