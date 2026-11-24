(function () {
    'use strict';
    angular.module('ib-pmt-datalayer-module').service('PmtDataLayerService', PmtDataLayerService);

    PmtDataLayerService.$inject = ['$window'];
    function PmtDataLayerService($window) {

        var datalayer_general;
        var datalayer_ecommerce;

        var self = this;
        self.initDatalayer = initDatalayer;
        self.addDataLayerGeneralInfo = addDataLayerGeneralInfo;
        self.removeDatalayerGeneralInfo = removeDatalayerGeneralInfo;
        self.removeAllDatalayerInfo = removeAllDatalayerInfo;
        self.callUpdateTagManager = callUpdateTagManager;
        self.getDatalayerGeneral = getDatalayerGeneral;
        self.getEcommerceDatalayer = getEcommerceDatalayer;

        /**
         * Initializes the datalayer_general and datalayer_ecommerce objects associating it to page window object.
         * @param {Object} initialGeneralObject the initial object of datalayer_general. if no object received, datalayer_general will be initialized with empty object
         * @param {Object} initialEcommerceObject the initial object of datalayer_ecommerce. if no object received, datalayer_ecommerce will be initialized with empty object
         */
        function initDatalayer(initialGeneralObject, initialEcommerceObject) {
            initialGeneralObject = initialGeneralObject || {};
            initialEcommerceObject = initialEcommerceObject || {};
            datalayer_general = $window.datalayer_general = $window.datalayer_general || {};
            datalayer_ecommerce = $window.datalayer_ecommerce = $window.datalayer_ecommerce || {};
            angular.extend(datalayer_general, initialGeneralObject);
            angular.extend(datalayer_ecommerce, initialEcommerceObject);
        }
        /**
         * Extends the current datalayer general information with the extendObj object. If an attribute exists in the current 
         * datalayer_general object, changes its value.
         * @param {Object} extendObj the object to extend the current datalayer_general object
         */
        function addDataLayerGeneralInfo(extendObj) {
            extendObj = extendObj || {};
            angular.extend(datalayer_general, extendObj);
        };

        /**
         * removes a set of attributes from datalayer_general object. If the input parameter is not an array, no modification will be done
         * @param {Array<String>} attributesArray an array with the String name of the attributes to be removed from datalager_general
         */
        function removeDatalayerGeneralInfo(attributesArray) {
            var i;
            if (angular.isArray(attributesArray)) {
                for (i = 0; i < attributesArray.length; i++) {
                    if (angular.isString(attributesArray[i]) && datalayer_general[attributesArray[i]]) {
                        delete datalayer_general[attributesArray[i]];
                    }
                }
            }
        }

        /**
         * Removes all datalayer objects info by initializing it to empty object
         */
        function removeAllDatalayerInfo() {
            datalayer_general = $window.datalayer_general = {};
            datalayer_ecommerce = $window.datalayer_ecommerce = {};
        }

        /**
         * Sends to Google Tag Manager an event with the current datalayer_general and datalayer_ecommerce info
         * @param {String} type the event type for Google Tag Manager (Ej: 'view', 'link')
         */
        function callUpdateTagManager(type) {
            if ($window.DigitalChange) {
                $window.DigitalChange(type, datalayer_general, datalayer_ecommerce);
            }
        }

        /**
         * returns the current datalayer general
         */
        function getDatalayerGeneral() {
            return datalayer_general;
        }

        /**
         * returns the current ecommerce datalayer
         */
        function getEcommerceDatalayer() {
            return datalayer_ecommerce;
        }

    };
})();