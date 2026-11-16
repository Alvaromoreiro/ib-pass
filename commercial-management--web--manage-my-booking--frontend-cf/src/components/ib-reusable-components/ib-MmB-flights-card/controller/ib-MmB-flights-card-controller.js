(function () {
    'use strict';

    angular
        .module('ib-MmB-flights-card-module')
        .controller('MmBFlightsController', MmBFlightsController);

    MmBFlightsController.$inject = ['$scope', 'MmbInvoluntaryChangeService', '$filter', 'MmBDatalayerUtilsService', 'MmBAppConstants'];
    function MmBFlightsController ($scope, MmbInvoluntaryChangeService, $filter, MmBDatalayerUtilsService, MmBAppConstants) {
        const vm = this;
        vm.firstSegmentInfo = null;
        vm.hasInvoluntaryChange = false;
        vm.isCancel = false;
        vm.isChange = false;
        vm.arrSegmentWarnings = [];
        vm.openModalConditions = openModalConditions;
        vm.getDurationScale = getDurationScale;
        vm.getLastSegmentInfo = getLastSegmentInfo;
        vm.checkTimeRemaining = checkTimeRemaining;
        vm.updateDatalayer = updateDatalayer;
        vm.iconTypePass = iconTypePass;
        vm.getFareFamilyIcon = getFareFamilyIcon;
        vm.numberOfpassenger = '1';
        vm.passengerText = vm.numberOfpassenger + ' x ' + $filter('translate')('GENERAL_PASSENGER_TEXT');
        vm.titleDocuments = null;
        vm.descriptionDocuments = null;
        vm.iconDocuments = null;
        vm.showIconFlight = null;
        vm.timeRemaining = {
            show: false,
            text: '',
            value : 0
        };

        vm.$onInit = function () {
            vm.hasInvoluntaryChange = MmbInvoluntaryChangeService.flightHasInvoluntaryChange(vm.model);
            vm.isChange = MmbInvoluntaryChangeService.flightIsChange(vm.model);
            vm.isCancel = MmbInvoluntaryChangeService.flightIsCancel(vm.model);
            vm.numberOfpassenger = vm.model.segments[0].sliceBaggage.passBaggages.length;
            vm.passengerText = vm.numberOfpassenger + ' x ' + $filter('translate')('GENERAL_PASSENGER_TEXT');
            vm.getLastSegmentInfo();
            setWarnings();
            verifyUpgradingBids();
            checkTimeRemaining();
        };

        function verifyUpgradingBids () {
            if(vm.model.segments[0].upgradingBids) {
                vm.model.segments[0].fareFamilyConditions.forEach( (fare,index)=>{
                    if(fare.code === 'ASIENTO') {
                        vm.model.segments[0].fareFamilyConditions[index].title = $filter('translate')('UPGRADING_TO_FREE_SELECTION_SEAT');
                        vm.model.segments[0].fareFamilyConditions[index].message = $filter('translate')('UPGRADING_TO_FREE_SELECTION_SEAT');
                    }
                });
            }

        }

        function openModalConditions (event, segmentSelected) {
            event.preventDefault();
            angular.forEach(segmentSelected, (condition) => {
                condition.icon = MmBAppConstants.FARE_FAMILY_ICON_PROPERTY_CODE[condition.code];
            });
            $scope.$emit('openFareModal', segmentSelected);
        }

        vm.showLabelChangeTime = function showLabelChangeTime () {
            return vm.isChange;
        };

        vm.showLabelCancel = function showLabelCancel () {
            return vm.isCancel;
        };

        vm.showLabelNumDays = function showLabelNumDays () {
            return vm.model.daysToGo > 0 && !vm.isChange && !vm.isCancel;
        };

        vm.showIconFlight = function showIconFlight () {
            return vm.isChange || vm.isCancel;
        };

        vm.flightHasChangeTime = function flightHasChangeTime () {
            vm.hasInvoluntaryChange = null;
        };

        vm.classDates = function getClassDates () {
            if (vm.hasInvoluntaryChange) {
                return 'ib-ticket-block__wrapper--two-dates';
            }
            return '';
        };

        function getDurationScale (duration) {
            let durationFormatted, hoursFormatted = '';
            let hours = 0, minutes = 0;

            if (duration > 0) {
                hours = Math.floor(duration / 60);
                minutes = duration % 60;
                hoursFormatted = hours < 10 ? ('0' + hours) : hours;
                durationFormatted = (hours > 0 ? (hoursFormatted + 'h ') : '') + (minutes > 0 ? (minutes + 'min.') : '');
            }
            return durationFormatted;
        }

        function getLastSegmentInfo () {
            if(vm.firstSegmentInfo === null && vm.model) {
                vm.firstSegmentInfo = vm.model.segments[0];
            }
        }

        function setWarnings () {
            let x, y, objAirportChanged = null, objTerminalChanged = null,  objFlightStop = null, objShortFlightStop = null;
            vm.shortScale = false, vm.longScale = true, vm.missconnection = false;

            for(x=0; x<vm.model.segments.length; x++) {
                objFlightStop = null;
                if(vm.model.segments[x].warnings) {
                    vm.model.segments[x].isWarnings = false;
                    for(y=0; y<vm.model.segments[x].warnings.length; y++) {
                        // Airport changed
                        if (vm.model.segments[x].warnings[y].code === 'SSE_ORM_20001') {
                            objAirportChanged = setStringAirportChanged(x, y);
                            vm.arrSegmentWarnings.push(objAirportChanged);
                            vm.model.segments[x].isWarnings = true;
                        }
                        // Terminal changed
                        if (vm.model.segments[x].warnings[y].code === 'SSE_ORM_20002') {
                            objTerminalChanged = setStringTerminalChanged(x, y);
                            vm.arrSegmentWarnings.push(objTerminalChanged);
                            vm.model.segments[x].isWarnings = true;
                        }
                        // Flight stop
                        if (vm.model.segments[x].warnings[y].code === 'SSE_ORM_20004') {
                            vm.longScale = true;
                            objFlightStop = setStringFlightStop(x);
                            vm.arrSegmentWarnings.push(objFlightStop);
                            vm.model.segments[x].isWarnings = true;
                        }
                        // Missconnection
                        if (vm.model.segments[x].warnings[y].code === 'SSE_ORM_20014') {
                            vm.model.segments[x].hasMissconnection = true;
                            vm.missconnection = true;
                        }
                    }
                }
                // "Short" flight stop
                if (vm.model.segments[x].waitingTimeParsed && objFlightStop === null) {
                    vm.shortScale = true;
                    objShortFlightStop = setStringFShortlightStop(x);
                    vm.arrSegmentWarnings.push(objShortFlightStop);
                }
            }
        }

        function setStringAirportChanged (x, y) {
            return {
                segmentId: vm.model.segments[x].segmentId,
                code: 'SSE_ORM_20001',
                msg: vm.model.segments[x].warnings[y].description,
                isError: true
            };
        }

        function setStringTerminalChanged (x, y) {
            return {
                segmentId: vm.model.segments[x].segmentId,
                code: 'SSE_ORM_20003',
                msg: vm.model.segments[x].warnings[y].description,
                isError: true
            };
        }

        function setStringFlightStop (x) {
            return {
                segmentId: vm.model.segments[x].segmentId,
                code: 'SSE_ORM_20004',
                msg: $filter('translate')('AVAILABILITY_SCALE_IN') + ': ' +
                    vm.model.segments[x].departureCity.city.description +
                    '(' + vm.model.segments[x].departureCity.city.code + ')' +
                    ' - ' +
                    $filter('translate')('AVAILABILITY_LONG_TIME_SCALE') + ' ' +
                    vm.model.segments[x].waitingTimeParsed,
                isError: false
            };
        }

        function setStringFShortlightStop (x) {
            return {
                segmentId: vm.model.segments[x].segmentId,
                msg: $filter('translate')('AVAILABILITY_SCALE_IN') + ': ' +
                    vm.model.segments[x].departureCity.city.description +
                    '(' + vm.model.segments[x].departureCity.city.code + ')' +
                    ' - ' + ' ' +  vm.model.segments[x].waitingTimeParsed,
                isError: false
            };
        }

        function checkTimeRemaining () {
            const literal = (vm.model.daysToGo > 1) ? 'MMB_YOUR_FLIGHTS_OUTBOUND_PLURAL_TEXT' : 'MMB_YOUR_FLIGHTS_OUTBOUND_SIMPLE_TEXT';
            const showLabel = vm.model.daysToGo > 0 && !vm.isChange && !vm.isCancel;
            if(showLabel && !vm.documents) {
                vm.timeRemaining.show = showLabel;
                vm.timeRemaining.text = literal;
                vm.timeRemaining.value = vm.model.daysToGo;
            }
        }

        function updateDatalayer (event) {
            const eventCategory = 'MMB Tus viajes';
            const eventAction = 'Tus documentos';
            const eventLabel = 'Click';
            MmBDatalayerUtilsService.updateDatalayerActionForAncillaries(eventCategory, eventAction, eventLabel);
        }

        function iconTypePass (idPassenger) {
            const icon = idPassenger.includes('CHILD') ? 'icon-iberia_ninos' : 'icon-hombre';
            return icon;
        }
        function getFareFamilyIcon (code){
            return MmBAppConstants.FARE_FAMILY_ICON_PROPERTY_CODE[code];
        }
    }
})();
