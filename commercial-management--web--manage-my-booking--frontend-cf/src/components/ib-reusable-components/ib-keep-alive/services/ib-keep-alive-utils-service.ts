import * as angular from 'angular';
import { MmBUtilService } from '@src/components/services/Utils/ib-MmB-utils';
import dayjs from 'dayjs';

@Service(
    'ib-keep-alive-module',
    ['$window', '$rootScope', '$interval', 'localStorageService', 'MmBModalService', 'CommonsKeepAliveService', 'MmBUtilService'],
    []
)
export class KeepAliveUtilService {
    constructor (
        private $window: angular.IWindowService,
        private $rootScope: any,
        private $interval,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBModalService,
        private CommonsKeepAliveService: CommonsKeepAliveService,
        private MmBUtilService: MmBUtilService) { }

    /**
     * starts Keeps alive session checkers
     */

    keepAliveInitMessage () {
        this.$rootScope.keepAlive = this.$interval(() => {
            const commercialInfo: any = this.localStorageService.get('commercialInfo');
            if (commercialInfo) {
                const timeExpiration = commercialInfo.sessionTimeLifeInMinutes ? commercialInfo.sessionTimeLifeInMinutes : 15;
                const timeToShowModal = (timeExpiration - 1) * 60000;
                const secondsForShowModal = timeToShowModal - dayjs().diff(new Date(this.$rootScope.timeSession.startTime));
                if ((!this.$rootScope.timeSession.openedModal && !this.$rootScope.blockedKeepAliveModal &&
                    this.$rootScope.timeSession && this.$rootScope.timeSession.startTime &&
                    this.localStorageService.get('flowId') &&
                    secondsForShowModal <= 0)) {
                    this.localStorageService.set('retrieveReservation', false);
                    this.showSessionModal();
                }
            }
        }, 3000);
    }

    private showSessionModal = () => {
        if (!this.$rootScope.timeSession.openedModal) {
            this.MmBModalService.showGenericModal(true, 'ib-modal-session-mmb.html', {}, 'ib-modals ib-modals--max-prio').result.then(this.keepSessionAlive, this.cancelSession);
        }
        this.$rootScope.timeSession.openedModal = true;
    };

    private keepSessionAlive = () => {
        if (this.localStorageService.get('flowId') && !this.localStorageService.get('retrieveReservation')) {
            this.CommonsKeepAliveService.keepAlive(this.localStorageService.get('flowId')).then(this.refreshTimeSession, this.refreshTimeSessionError);
        }
    };

    private refreshTimeSession = () => {
        this.$rootScope.timeSession.startTime = dayjs();
        this.$rootScope.timeSession.openedModal = false;
        this.$rootScope.timeSession.failedKeepAliveService = false;
        this.MmBModalService.finishWaiting();
        this.$rootScope.$broadcast('endLoadingPlaneEvent');
    };

    private refreshTimeSessionError () {
        this.$rootScope.timeSession.openedModal = false;
        this.$rootScope.timeSession.failedKeepAliveService = true;
        this.MmBModalService.finishWaiting();
        this.$rootScope.$broadcast('endLoadingPlaneEvent');
    }

    private cancelSession () {
        if (angular.isDefined(this.$rootScope.keepAlive)) {
            this.$interval.cancel(this.$rootScope.keepAlive);
            this.$rootScope.keepAlive = undefined;
        }
        this.MmBModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent', true);
        this.MmBUtilService.initStorage();
        this.$window.location.href = this.$window.location.origin;
    }

}
