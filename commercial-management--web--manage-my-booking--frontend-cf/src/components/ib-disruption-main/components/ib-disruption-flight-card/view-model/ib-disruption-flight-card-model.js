(function(){
    'use strict';
    angular.module('ib-disruption-flight-card-module')
        .service('DisruptionFlightCardModel', DisruptionFlightCardModel);

    /**
     * Model of a Flight Card
     */
    function DisruptionFlightCardModel(){
        var vm = this;
        vm.activationFlags = {
            'previousDate' : '',
            'moreDetailsArea' : '',
            'nodeDetails' : '',
            'fareDetails' : '',
            'informationDetail' : '',
            'missconnectionWarning': ''
        };
        vm.labels = {
            'FLIGHT_INFO_MESSAGE' : '',
            'FLIGHT_DETAIL_COLLAPSE' : '',
            'FLIGHT_DETAILS' : '',
        };
        vm.flightData = {
            'icon' : '',
            'departureChangeDate' : '',
            'departureChangeTime' : '',
            'arrivalChangeDate' : '',
            'arrivalChangeTime' : '',
            'departureDate' : '',
            'departureTime' : '',
            'arrivalDate' : '',
            'arrivalTime' : '',
            'departureAPort' : '',
            'departureCity' : '',
            'arrivalAPort' : '',
            'arrivalCity' : '',
            'flightScalesNumber' : '',
            'flightScales' : '',
            'flightDuration' : '',
            'technicalStops': ''
        };
        vm.fareData = {
            'cabinName' : '',
            'handBag' : '',
            'checkBag' : '',
            'seatSelection' : ''
        };
        vm.flightNodes = [{
            
        }];
    }
})();