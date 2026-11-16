/**
 *  Model description
 */
(function(){
    'use strict';
    angular.module('ib-disruption-flight-node-module')
        .service('DisruptionFlightNodeModel', DisruptionFlightNodeModel);

    /**
     * Model of a Flight Node
     */
    function DisruptionFlightNodeModel(){
        var vm = this;

        vm.warningAirport = '';
        vm.warningTerminal = '';
        vm.warningFlightStop = '';
        vm.warningMissConection = '';
        vm.warningOvernight = '';
        vm.warningTerminalMsg = '';
        vm.warningAirportMsg = '';
        vm.warningDowngradeSameFlightAndTime = '';
        vm.warningDowngradeDiffFlightOrTime = '';
        vm.technicalStop = '';

        vm.departureTime = '';
        vm.arrivalTime = '';
        vm.flightDuration = '';
        vm.departureCity = '';
        vm.departureAPort = '';
        vm.arrivalCity = '';
        vm.arrivalAPort = '';
        vm.flightNumber = '';
        vm.flightPlane = '';
        vm.flightOperator = '';
        vm.icon = '';
        
        vm.LABEL_OPERATED_BY = '';
    }
})();