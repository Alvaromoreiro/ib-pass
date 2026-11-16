import * as angular from 'angular';
import dayjs from 'dayjs';
import { CommonsConstantsType } from '../constants/ib-commons-constants';
import { DatalayerConstantsType } from '../ib-datalayer/ib-datalayer-constants';
import { DatalayerUtilsService } from '../ib-datalayer/services/ib-datalayer-utils-service';
import { MonetateConstantsType } from '../ib-monetate/ib-monetate-constants';
import { MonetateUtilsService } from '../ib-monetate/services/ib-monetate-utils';

@Controller('ib-commons-keep-alive-module', ['$rootScope', 'CommonsConstants', 'CommonsKeepAliveUtilsService', 'localStorageService', '$uibModalInstance', 'DatalayerUtilsService', 'DatalayerConstants', '$interval', '$scope', 'MonetateUtilsService', 'MonetateConstants', '$window'], [])
export class ibKeepAliveController implements ng.IController {
    public timerTime: any;
    public timerActivate: any;
    public isGiftCard: boolean;
    public isSubscriptionModels: boolean;
    public isfinishSesion: boolean;
    public isFlowCKI: boolean;
    public timer;
    public timerInterval;

    constructor (
        private $rootScope: CommonsRootScope,
        private CommonsConstants: CommonsConstantsType,
        private CommonsKeepAliveUtilsService: any,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private DatalayerConstants: DatalayerConstantsType,
        private $interval: any,
        private $scope: ng.IScope,
        private MonetateUtilsService: MonetateUtilsService,
        private MonetateConstants: MonetateConstantsType,
        private $window: angular.IWindowService
    ) { }
    $onInit = () => {
        const flowApp = this.localStorageService.get('flowApp');
        this.isGiftCard = (flowApp && flowApp === this.CommonsConstants.APP.GIFTCARD.NAME);
        this.isFlowCKI = (flowApp && flowApp === this.CommonsConstants.APP.CKI.NAME);
        this.isSubscriptionModels = (flowApp && flowApp === this.CommonsConstants.APP.SUBSCRIPTIONMODELS.NAME);
        this.setTimer();
        this.countDownKeepAlive(this.timerTime);

        if(this.localStorageService.get('isFinishSesion')) {
            this.isfinishSesion = true;
        }else{
            this.isfinishSesion = false;
        }
    };

    setTimer = (): void => {
        let timeToAdd;
        if (this.isGiftCard) {
            timeToAdd = this.CommonsConstants.APP.GIFTCARD.WAITING_TIME;
        } else if (this.isSubscriptionModels) {
            timeToAdd = this.CommonsConstants.APP.SUBSCRIPTIONMODELS.WAITING_TIME;
        } else if (this.isFlowCKI) {
            timeToAdd = this.CommonsConstants.APP.CKI.WAITING_TIME;
        }
        this.timerTime = dayjs().add(timeToAdd, 'minute');
        this.timerActivate = this.getTimerActivate();
        this.timer = {
            days: '0',
            hours: '0',
            minutes: timeToAdd - 1,
            seconds: '59'
        };
    };

    close = (isTimerActivate?: boolean, isReturnButton?: boolean): void => {
        const isTrue: boolean = angular.isUndefined(isTimerActivate) ? false : isTimerActivate;
        this.$uibModalInstance.dismiss();
        this.setTimerActivate(isTrue);
        if ((this.localStorageService.get('flowApp') === this.CommonsConstants.APP.GIFTCARD.NAME) && isReturnButton) {
            this.$rootScope.$broadcast('backToMainRoot', true);
        }
    };

    timerStopped = (event?: ng.IAngularEvent, data?: any): any => {
        this.setTimerActivate(false);
        if (this.isFlowCKI) {
            this.updateDatalayer();
        }
    };

    updateDatalayer = (): void => {
        let quadrigam, process, step;
        if (this.isFlowCKI) { //else if for gift cards and sm
            quadrigam = this.DatalayerConstants.QUADRIGAMS.CKI_SESSION_EXPIRED;
            process = this.DatalayerConstants.DATALAYER_FLOW_CKI.PROCESS;
            step = this.DatalayerConstants.DATALAYER_FLOW_CKI[quadrigam];
        }
        this.DatalayerUtilsService.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        this.DatalayerUtilsService.setProcessAndStep(process, step, quadrigam);

        this.MonetateUtilsService.updateMonetateWithQuadrigam(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, quadrigam, {});
        this.$rootScope.$broadcast('updateDatalayer');
        this.$rootScope.$broadcast('sendUpdateToMonetate');
        
    };

    reloadFlow = (): void => {
        const flowApp = this.localStorageService.get('flowApp');
        this.CommonsKeepAliveUtilsService.keepSessionAlive();
        this.close(true);
        if (flowApp === this.CommonsConstants.APP.GIFTCARD.NAME) {
            this.CommonsKeepAliveUtilsService.initKeepAlive();
        }
        this.$interval.cancel(this.timerInterval);
    };

    goToEntryPoint = (origin: boolean = false): void => {
        this.$interval.cancel(this.timerInterval);
        this.CommonsKeepAliveUtilsService.closeSession(origin);
        if (this.$window['webpackJsonprecoglobick-transfers']) {
            this.$window.RecoglobickTransfersWidget.unmount();
        }
    };

    getTimerActivate = (): boolean => {
        return this.$rootScope.timeSession.timerActivate;
    };

    setTimerActivate = (timerActivate: boolean): void => {
        this.$rootScope.timeSession.timerActivate = timerActivate;
        this.timerActivate = timerActivate;
    };

    countDownKeepAlive = (endTime): void => {
        let maxTimeUnit = 'minute';
        let duration = endTime;
        let now:any = dayjs();

        const second = 1000,
            minute = second * 60,
            hour   = minute * 60,
            day    = hour * 24;

        if (!isNaN(duration) && Math.floor((duration - now) / second)>0) {
            this.timerInterval = this.$interval(() => {

                const now:any = dayjs();
                let difference = duration - now;

                if (maxTimeUnit === 'day') {
                    Math.floor(difference / day) < 10 ? this.timer.days = '0' + Math.floor(difference / day).toString() : this.timer.days = Math.floor(difference / day).toString();
                    Math.floor((difference % day) / hour) < 10 ? this.timer.hours = '0' + Math.floor((difference % day) / hour).toString() : this.timer.hours = Math.floor((difference % day) / hour).toString();
                    Math.floor((difference % hour) / minute) < 10 ? this.timer.minutes = '0' + Math.floor((difference % hour) / minute).toString() : this.timer.minutes = Math.floor((difference % hour) / minute).toString();
                    Math.floor((difference % minute) / second) < 10 ? this.timer.seconds = '0' + Math.floor((difference % minute) / second).toString() : this.timer.seconds = Math.floor((difference % minute) / second).toString();
                }

                if (maxTimeUnit === 'hour') {
                    Math.floor(difference/ hour) < 10 ? this.timer.hours = '0' + Math.floor(difference / hour).toString() : this.timer.hours = Math.floor(difference / hour).toString();
                    Math.floor((difference % hour) / minute) < 10 ? this.timer.minutes = '0' + Math.floor((difference % hour) / minute).toString() : this.timer.minutes = Math.floor((difference % hour) / minute).toString();
                    Math.floor((difference % minute) / second) < 10 ? this.timer.seconds = '0' + Math.floor((difference % minute) / second).toString() : this.timer.seconds = Math.floor((difference % minute) / second).toString();
                }

                if (maxTimeUnit === 'minute') {
                    this.timer.minutes = Math.floor(difference / minute).toString();
                    Math.floor((difference % minute) / second) < 10 ? this.timer.seconds = '0' + Math.floor((difference % minute) / second).toString() : this.timer.seconds = Math.floor((difference % minute) / second).toString();
                }

                if (maxTimeUnit === 'second') {
                    Math.floor(difference / second) < 10 ? this.timer.seconds = '0' + Math.floor(difference / second).toString() : this.timer.seconds = Math.floor(difference / second).toString();
                }

                if (Math.floor(difference / second) <= 0) {
                    this.$interval.cancel(this.timerInterval);
                    this.timerStopped();
                }

                this.$scope.$apply();
            }, second);
        }
    };

    buttonClose = () => {
        if (!this.timerActivate) {
            this.goToEntryPoint(true);
            return;
        }

        if (this.isFlowCKI) {
            this.reloadFlow();
            return;
        }

        this.close();
    };
}