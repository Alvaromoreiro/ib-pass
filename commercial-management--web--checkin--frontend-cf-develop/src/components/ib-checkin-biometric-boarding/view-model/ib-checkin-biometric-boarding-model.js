(function(){
    'use strict';
    angular.module('ib-checkin-biometric-boarding-module')
    .service('BiometricBoardModel', BiometricBoardModel);

    function BiometricBoardModel(){
        var vm = this;
        vm.initializeModel = initializeModel;
        vm.segmentsPassengersInfo;
        
        function initializeModel(){
            vm.biometricData = {
                name: '',
                surname: '',
                expirationDate: '',
                boardingCard: '',
                documentEmissionCountry: '',
                documentNumber: '',
                documentType: '',
                flightCompany: '',
                flightNumber: '',
                flightOrigin: '',
                flightDestination: '',
                flightTime: '',
                email: '',
            };
            vm.segmentsPassengersInfo = [];
        }
    }
})();