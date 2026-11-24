(function () {
    'use strict';
    angular.module('ib-datalayer-ecommerce-module').service('DataLayerEcommerceService', DataLayerEcommerceService);

    DataLayerEcommerceService.$inject = ['$window'];
    function DataLayerEcommerceService($window) {

        var datalayer_ecommerce;

        var self = this;
        self.addDataLayerEcommerceInfo = addDataLayerEcommerceInfo;

        /**
         * Extends the current datalayer ecommerce information with the extendObj object. If an attribute exists in the current 
         * datalayer_ecommerce object, changes its value.
         * @param {Object} extendObj the object to extend the current datalayer_ecommerce object
         */
        function addDataLayerEcommerceInfo(extendObj) {
            extendObj = extendObj || {};
            datalayer_ecommerce = $window.datalayer_ecommerce = $window.datalayer_ecommerce || {};
            angular.extend(datalayer_ecommerce, extendObj);
        };

    };
})();