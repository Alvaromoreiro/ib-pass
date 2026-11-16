import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import dayjs from 'dayjs';

(function () {
    'use strict';

    angular
        .module('ib-keep-alive-module')
        .controller('IbKeepAliveController', IbKeepAliveController);

    IbKeepAliveController.$inject = ['$scope', 'localStorageService', '$rootScope', '$window', 'MmBDatalayerUtilsService','$interval', 'MmBAppConstants', 'CommonsUtilService', 'MmBUtilsSharedService'];
    function IbKeepAliveController ($scope, localStorageService, $rootScope, $window, MmBDatalayerUtilsService, $interval, MmBAppConstants, CommonsUtilService, MmBUtilsSharedService) {
        const vm = this;
        vm.timerStopped = timerStopped;
        vm.setDigitalData = setDigitalData;
        vm.timer = {
            days: '0',
            hours: '0',
            minutes: '0',
            seconds: '59'
        };
        vm.$onInit = activate;
        $scope.$on('$destroy', cancelCoundownInterval);

        function activate () {
            const commercialInfo = localStorageService.get('commercialInfo');
            vm.timerActivate = dayjs().diff($rootScope.timeSession.startTime) <= (commercialInfo?.sessionTimeLifeInMinutes ? commercialInfo.sessionTimeLifeInMinutes : 15) * 60000;
            vm.timerTime = dayjs().add(1, 'minute');
            vm.home = $window.location.origin;
            countDownKeepAlive(vm.timerTime);
            updateQuadrigamFinishSesion();
        }

        function timerStopped () {
            vm.timerActivate = false;
            updateQuadrigamFinishSesion();
        }

        function updateQuadrigamFinishSesion () {
            if (!vm.timerActivate) {
                const bookingInfo = localStorageService.get('bookingInfo');
                var process = MmBUtilsSharedService.getProcessByStatus(MMBDatalayerConstants.QUADRIGAMS.MMB_SESSION_EXPIRED, bookingInfo?.order?.status);
                var step = process ? MMBDatalayerConstants.DIGITAL_DATA_STEP.MMBEXP : null;

                MmBUtilsSharedService.updateQuadrigam(MMBDatalayerConstants.QUADRIGAMS.MMB_SESSION_EXPIRED, process, step);
            }
        }

        function setDigitalData(quadrigam) {
            CommonsUtilService.setTitlePage('MMB_TITLE_SESSION_EXPIRED');
            MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam], quadrigam);
            $rootScope.$broadcast('sendUpdateToMonetate');
        }

        function cancelCoundownInterval() {
            if (vm.coundownInterval) {
                $interval.cancel(vm.coundownInterval);
            }
        }

        function countDownKeepAlive(endTime) {
            let maxTimeUnit = vm?.maxTimeUnit || 'minute';
            let duration = endTime;
            let now = dayjs();

            const second = 1000,
                minute = second * 60,
                hour   = minute * 60,
                day    = hour * 24;

            if (!isNaN(duration) && Math.floor((duration - now) / second > 0)) {
                vm.coundownInterval = $interval(() => {

                    now = dayjs();
                    let difference = duration - now;

                    if (maxTimeUnit === 'day') {
                        Math.floor(difference / day) < 10 ? vm.timer.days = '0' + Math.floor(difference / day).toString() : vm.timer.days = Math.floor(difference / day).toString();
                        Math.floor((difference % day) / hour) < 10 ? vm.timer.hours = '0' + Math.floor((difference % day) / hour).toString() : vm.timer.hours = Math.floor((difference % day) / hour).toString();
                        Math.floor((difference % hour) / minute) < 10 ? vm.timer.minutes = '0' + Math.floor((difference % hour) / minute).toString() : vm.timer.minutes = Math.floor((difference % hour) / minute).toString();
                        Math.floor((difference % minute) / second) < 10 ? vm.timer.seconds = '0' + Math.floor((difference % minute) / second).toString() : vm.timer.seconds = Math.floor((difference % minute) / second).toString();
                    }

                    if (maxTimeUnit === 'hour') {
                        Math.floor(difference/ hour) < 10 ? vm.timer.hours = '0' + Math.floor(difference / hour).toString() : vm.timer.hours = Math.floor(difference / hour).toString();
                        Math.floor((difference % hour) / minute) < 10 ? vm.timer.minutes = '0' + Math.floor((difference % hour) / minute).toString() : vm.timer.minutes = Math.floor((difference % hour) / minute).toString();
                        Math.floor((difference % minute) / second) < 10 ? vm.timer.seconds = '0' + Math.floor((difference % minute) / second).toString() : vm.timer.seconds = Math.floor((difference % minute) / second).toString();
                    }

                    if (maxTimeUnit === 'minute') {
                        vm.timer.minutes = Math.floor(difference / minute).toString();
                        Math.floor((difference % minute) / second) < 10 ? vm.timer.seconds = '0' + Math.floor((difference % minute) / second).toString() : vm.timer.seconds = Math.floor((difference % minute) / second).toString();
                    }

                    if (maxTimeUnit === 'second') {
                        Math.floor(difference / second) < 10 ? vm.timer.seconds = '0' + Math.floor(difference / second).toString() : vm.timer.seconds = Math.floor(difference / second).toString();
                    }

                    if (Math.floor(difference / second) <= 0) {
                        cancelCoundownInterval();
                        timerStopped();
                    }
                }, second);
            }
        }
    }
})();
