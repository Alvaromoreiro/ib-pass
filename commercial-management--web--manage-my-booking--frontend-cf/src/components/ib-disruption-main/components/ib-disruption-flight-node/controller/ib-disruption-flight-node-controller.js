(function(){
    'use strict';
    angular.module('ib-disruption-flight-node-module')
        .controller('DisruptionFlightNodeController', DisruptionFlightNodeController);

    DisruptionFlightNodeController.$inject = [];

    /**
     * General idea for this controller
     */
    function DisruptionFlightNodeController(){
        var vm = this;
        vm.$onInit = activate;

        /**
         * Initializes the controller
         */
        function activate(){
            
        }
    }
})();