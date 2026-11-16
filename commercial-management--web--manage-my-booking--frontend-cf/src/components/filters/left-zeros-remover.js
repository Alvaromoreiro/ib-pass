(function () {
    'use strict';

    angular
        .module('ib-MmB-filters-module')
        .filter('LeftZerosRemover', LeftZerosRemover);

    function LeftZerosRemover() {

        return removeLeftZeros;

        function removeLeftZeros(strInput) {
            var strOutput = strInput;
            var i = 0, founded = false;
            if (strInput) {
                while (!founded) {
                    if (strInput[i] !== '0') {
                        founded = true;
                        strOutput = strInput.substring(i, strInput.lenth);
                    }
                    i++;
                }
            }
            return strOutput;
        }
    }
})();
