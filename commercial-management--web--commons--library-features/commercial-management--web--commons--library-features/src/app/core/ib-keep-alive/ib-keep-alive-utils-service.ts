import * as angular from 'angular';
import dayjs from 'dayjs';
import {CommonsModalService} from '../ib-modal/services/ib-modal-service';
import {CommonsConstantsType} from '../constants/ib-commons-constants';
import {DataLayerService} from '../ib-datalayer/services/ib-datalayer-service';

@Service('ib-commons-keep-alive-module', ['$location', '$rootScope', '$interval', 'localStorageService', 'CommonsModalService', 'CommonsConstants', 'CommonsKeepAliveService', 'DataLayerService'], [])
export class CommonsKeepAliveUtilsService {
    private flowApp: string;
    private flowId: string;

    constructor (
        private $location: ng.ILocationService,
        private $rootScope: CommonsRootScope,
        private $interval: any,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsModalService: CommonsModalService,
        private CommonsConstants: CommonsConstantsType,
        private CommonsKeepAliveService: any,
        private DataLayerService: DataLayerService) {

    }

    initKeepAlive = (): void => {
        this.flowApp = this.localStorageService.get('flowApp');

        this.$rootScope.timeSession = {
            startTime: dayjs(),
            openedModal: false,
            failedKeepAliveService: false,
            timerActivate: true
        };

        switch (this.flowApp) {
                case this.CommonsConstants.APP.CKI.NAME:
                    this.flowAppCKI();
                    break;
                case this.CommonsConstants.APP.GIFTCARD.NAME:
                    this.flowAppGiftCard();
                    break;
                case this.CommonsConstants.APP.SUBSCRIPTIONMODELS.NAME:
                    this.flowAppSubscriptionModels();
                    break;
                default:
                    break;
        }
    };

    flowAppCKI = (): void => {
        let actualStepFlow: string = null;
        let validStepFlow: boolean = false;
        let showWaitingTime: boolean = false;
        const showSessionModal = (timerActivate: boolean): any => {
            this.$rootScope.timeSession.timerActivate = timerActivate;
            this.CommonsModalService.openBuildGenericModal(null, 'ib-modal-session', 'ib-modals--md ib-modals--max-prio', 'ibKeepAliveController', true);
            this.$rootScope.timeSession.openedModal = timerActivate;
        };

        this.$rootScope.keepAlive = this.$interval(() => {
            if (this.$location.path() === this.CommonsConstants.APP.CKI.QUADRIGAM.IBCKIPURC && actualStepFlow !== this.CommonsConstants.APP.CKI.QUADRIGAM.IBCKIPURC){
                this.$rootScope.timeSession.startTime = dayjs();
            }
            actualStepFlow = this.$location.path();
            validStepFlow = actualStepFlow !== this.CommonsConstants.APP.CKI.QUADRIGAM.IBCOSE && actualStepFlow !== this.CommonsConstants.APP.CKI.QUADRIGAM.IBCOSE2 && actualStepFlow !== this.CommonsConstants.APP.CKI.QUADRIGAM.IBCOCF_IBECCF;
            const timeSinceStart = dayjs().diff(this.$rootScope.timeSession.startTime);
            const timeUntilExpiration = this.CommonsConstants.APP.CKI.WAITING_TIME_SESSION * 60000;
            showWaitingTime = timeSinceStart > timeUntilExpiration;
            if (!showWaitingTime) {
                this.$rootScope.timeSession.openedModal = false;
            }
            if (showWaitingTime && validStepFlow && !this.$rootScope.timeSession.openedModal) {
                showSessionModal(true);
            }
        }, 100);
    };

    flowAppGiftCard = (): void => {
        let actualStepFlow: string = null;
        let showWaitingTime: boolean = false;
        const showSessionModal = (timerActivate: boolean): any => {
            this.$rootScope.timeSession.timerActivate = timerActivate;
            this.CommonsModalService.openBuildGenericModal(null, 'ib-modal-session', null, 'ibKeepAliveController', true);
            this.$rootScope.timeSession.openedModal = timerActivate;
        };

        this.$rootScope.keepAlive = this.$interval(() => {
            actualStepFlow = this.$location.path();
            showWaitingTime = dayjs().diff(this.$rootScope.timeSession.startTime) > (this.CommonsConstants.APP.GIFTCARD.WAITING_TIME_SESSION * 60000);
            if (actualStepFlow === '/ibpurc' && showWaitingTime && !this.$rootScope.timeSession.openedModal &&
                dayjs().diff(this.$rootScope.timeSession.startTime) < ((this.CommonsConstants.APP.GIFTCARD.WAITING_TIME_SESSION + this.CommonsConstants.APP.GIFTCARD.WAITING_TIME) * 60000)) {
                showSessionModal(true);
                this.localStorageService.set('isFinishSesion', false);
            } else if (actualStepFlow === '/ibpurc' && showWaitingTime && this.$rootScope.timeSession.openedModal &&
                dayjs().diff(this.$rootScope.timeSession.startTime) > ((this.CommonsConstants.APP.GIFTCARD.WAITING_TIME_SESSION + this.CommonsConstants.APP.GIFTCARD.WAITING_TIME) * 60000)) {
                showSessionModal(false);
                this.localStorageService.set('isFinishSesion', true);
            }
        }, 100);
    };

    flowAppSubscriptionModels = (): void => {
        let actualStepFlow: string = null;
        let showWaitingTime: boolean = false;
        const showSessionModal = (timerActivate: boolean): any => {
            this.$rootScope.timeSession.timerActivate = timerActivate;
            this.CommonsModalService.openBuildGenericModal(null, 'ib-modal-session', null, 'ibKeepAliveController', true);
            this.$rootScope.timeSession.openedModal = timerActivate;
        };

        this.$rootScope.keepAlive = this.$interval(() => {
            actualStepFlow = this.$location.path();
            showWaitingTime = dayjs().diff(this.$rootScope.timeSession.startTime) > (this.CommonsConstants.APP.SUBSCRIPTIONMODELS.WAITING_TIME_SESSION * 60000);
            if (actualStepFlow === '/PLPURC' && showWaitingTime && !this.$rootScope.timeSession.openedModal &&
                dayjs().diff(this.$rootScope.timeSession.startTime) < ((this.CommonsConstants.APP.SUBSCRIPTIONMODELS.WAITING_TIME_SESSION + this.CommonsConstants.APP.SUBSCRIPTIONMODELS.WAITING_TIME) * 60000)) {
                showSessionModal(true);
                this.localStorageService.set('isFinishSesion', false);
            } else if (actualStepFlow === '/PLPURC' && showWaitingTime && this.$rootScope.timeSession.openedModal &&
                dayjs().diff(this.$rootScope.timeSession.startTime) > ((this.CommonsConstants.APP.SUBSCRIPTIONMODELS.WAITING_TIME_SESSION + this.CommonsConstants.APP.SUBSCRIPTIONMODELS.WAITING_TIME) * 60000)) {
                showSessionModal(false);
                this.localStorageService.set('isFinishSesion', true);
            }
        }, 100);
    };

    keepSessionAlive = (): void => {
        const flowApp:string = this.localStorageService.get('flowApp');
        const orderInfo: any = this.localStorageService.get('createOrderData');
        this.flowId = this.localStorageService.get('flowId');
        if(flowApp !== this.CommonsConstants.APP_TYPES.CHECKIN || flowApp !== this.CommonsConstants.APP_TYPES.GIFTCARDS || flowApp !== this.CommonsConstants.APP_TYPES.SUBSCRIPTIONMODELS) {
            this.CommonsKeepAliveService.keepAlive(orderInfo && orderInfo.order && orderInfo.order.orderId ? orderInfo.order.orderId : this.flowId).then(this.refreshTimeSession(false), this.refreshTimeSessionError);
        } else if (this.flowId || (orderInfo && orderInfo.order && orderInfo.order.orderId)) {
            this.CommonsKeepAliveService.keepAlive(orderInfo && orderInfo.order && orderInfo.order.orderId ? orderInfo.order.orderId : this.flowId).then(this.refreshTimeSession(false), this.cancelSession);
        }
    };

    closeSession = (origin: boolean = false): void => {
        const flowApp = this.localStorageService.get('flowApp');
        this.flowId = this.localStorageService.get('flowId');
        this.CommonsModalService.showWaitingModal(null, 'ib-modals ib-modals--transparent', true, null);
        if (this.flowId && (flowApp !== 'GIFTCARDS' && flowApp !== 'SUBSCRIPTIONMODELS')) {
            this.CommonsKeepAliveService.closeSession(this.flowId).then(this.refreshTimeSession(true, origin), this.cancelSession);
        }else if(this.flowId && (flowApp === 'GIFTCARDS')) {
            const datalayer_general = this.DataLayerService.getDatalayerGeneral() as any,
                lang = datalayer_general.idioma ? datalayer_general.idioma.toUpperCase() : 'ES',
                market = datalayer_general.mercado ? datalayer_general.mercado.toLowerCase() : 'es';
            this.$rootScope.$broadcast('redirectLandingGiftCards', { lang, market });
        }else if(this.flowId && (flowApp === 'SUBSCRIPTIONMODELS')) {
            const datalayer_general = this.DataLayerService.getDatalayerGeneral() as any,
                lang = datalayer_general.idioma ? datalayer_general.idioma.toUpperCase() : 'ES',
                market = datalayer_general.mercado ? datalayer_general.mercado.toLowerCase() : 'es';
            this.$rootScope.$broadcast('redirectLandingSubscriptionModels', { lang, market });
        }
    };

    refreshTimeSession = (redirect: boolean, origin: boolean = false): void => {
        const flowApp = this.localStorageService.get('flowApp');
        this.$rootScope.timeSession.startTime = dayjs();
        this.$rootScope.timeSession.openedModal = false;
        this.$rootScope.timeSession.failedKeepAliveService = false;
        if(flowApp === this.CommonsConstants.APP_TYPES.BOOKING || flowApp === this.CommonsConstants.APP_TYPES.ONHOLD) {
            this.CommonsModalService.finishWaiting();
            this.$rootScope.$broadcast('endLoadingPlaneEvent');
        }else if (redirect) {
            if (origin) {
                const datalayer_general = this.DataLayerService.getDatalayerGeneral() as any,
                    lang = datalayer_general.idioma ? datalayer_general.idioma.toUpperCase() : 'ES',
                    market = datalayer_general.mercado ? datalayer_general.mercado.toLowerCase() : 'es';
                if(flowApp === 'GIFTCARDS') {
                    this.$rootScope.$broadcast('redirectLandingGiftCards', { lang, market });
                }else if(flowApp === 'SUBSCRIPTIONMODELS') {
                    this.$rootScope.$broadcast('redirectLandingSubscriptionModels', { lang, market });
                }
            }
            this.$location.path(this.CommonsConstants.APP.CKI.QUADRIGAM.IBCOSE);
        }
    };

    refreshTimeSessionError = () => {
        this.$rootScope.timeSession.openedModal = false;
        this.$rootScope.timeSession.failedKeepAliveService = true;
        this.CommonsModalService.finishWaiting();
        this.$rootScope.$broadcast('endLoadingPlaneEvent');
    };

    cancelSession = (): void => {
        if (this.$rootScope.keepAlive) {
            this.$interval.cancel(this.$rootScope.keepAlive);
            this.$rootScope.keepAlive = undefined;
        }
        this.CommonsModalService.finishWaiting();
        if(this.flowApp === this.CommonsConstants.APP.GIFTCARD.NAME) {
            this.$location.path(this.CommonsConstants.APP.GIFTCARD.QUADRIGAM.CONFIGURATION);
        }else {
            this.$location.path(this.CommonsConstants.APP.CKI.QUADRIGAM.IBCOSE);
        }
    };
}