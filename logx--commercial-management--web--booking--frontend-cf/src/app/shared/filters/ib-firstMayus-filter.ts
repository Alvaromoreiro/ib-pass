
angular
    .module('ib-booking-filters-module')
    .filter('FirstMayustFilter', FirstMayustFilter);

function FirstMayustFilter () {

    return mayusculasFilter;

    function mayusculasFilter (valor) {
        if (angular.isString(valor)) {
            return valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
        }
    }

}


