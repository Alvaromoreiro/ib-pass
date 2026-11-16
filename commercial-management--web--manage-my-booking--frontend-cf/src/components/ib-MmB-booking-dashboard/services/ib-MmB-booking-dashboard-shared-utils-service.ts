import angular from "angular";
import { ConfirmationTypes } from "ib-web-ancillaries/dist/app/core/models/ib-confirmation-info-model";

@Service(
    'ib-MmB-booking-dashboard-module',
    [
        '$rootScope',
        'ModalServiceAncillaries',
        'localStorageService',
        '$ocLazyLoad',
        'CommonsUserUtilsService',
        'MmBDatalayerUtilsService',
        'IbCPermanentUserService',
    ],
    []
)
export class BookingDashboardSharedUtilsService {
    constructor(
        private $rootScope,
        private ModalServiceAncillaries,
        private localStorageService,
        private $ocLazyLoad,
        private CommonsUserUtilsService,
        private MmBDatalayerUtilsService,
        private IbCPermanentUserService
    ) {

    }

    model;

    closeCollapseHeader = () => {
        this.$rootScope.$broadcast('closeCollapseHeader');
    };

    /**
     * Check if user is Logged and open flow modal or continue with flow
     */
    handleUpgradeFlow = (): void => {
        this.closeCollapseHeader();

        const confirmationDigitalInfo: ConfirmationTypes.ConfirmationDigitalInfo = this.localStorageService.get('confirmationDigitalInfo');
        const isUserLogged = !!confirmationDigitalInfo?.UserLevel;
        const hasBidsAvailable = this.model.ancillariesInfo.bidsUpgradingInfo.bidsAvailable

        const aviosUpgradingInfo = this.model.ancillariesInfo.aviosUpgradingInfo || {};
        const hasAviosorWalipAvailable = !!aviosUpgradingInfo.aviosBidAvailable || !!aviosUpgradingInfo.waitingListAvailable;
        const upgradeFlow = this.localStorageService.get('flowUpgradeMMB');
    
        if (this.shouldShowUpgradeModal(isUserLogged, hasBidsAvailable, hasAviosorWalipAvailable)) {
            const flowInfo = { 
                hasActiveBids: this.model.ancillariesInfo.bidsUpgradingInfo.bidsOpen,
                isOnWaitingList: this.model.ancillariesInfo.aviosUpgradingInfo.isOnWaitingList
            };
            return this.ModalServiceAncillaries.showUpgradeModalFlow(flowInfo).result
                .then((upgradeFlow) => {
                    return this.openUpgradeModal(upgradeFlow)
                })
                .catch(() => {})
        }
    
        return this.openUpgradeModal(upgradeFlow);
    };

    private shouldShowUpgradeModal = (isUserLogged: boolean, hasBidsAvailable: boolean, hasAviosorWalipAvailable: boolean): boolean => {
        return isUserLogged && hasBidsAvailable && hasAviosorWalipAvailable;
    };
    
    openUpgradeModal = (upgradeFlow) => {
        const checkFlow = upgradeFlow;

        const isPermanentUser = this.CommonsUserUtilsService.isSoftUser();

        if (!this.model.ancillariesInfo.aviosUpgradingInfo) {
            this.model.ancillariesInfo.aviosUpgradingInfo = {};
        }
        const upgradeModel = {
            aviosUpgradingInfo: angular.copy(this.model.ancillariesInfo.aviosUpgradingInfo),
            bidsUpgradingInfo: angular.copy(this.model.ancillariesInfo.bidsUpgradingInfo),
            upgradeFlow:  upgradeFlow
        };

        this.closeCollapseHeader();
    
        import('@src/lazy-loading/ib-web-payments').then(() => {
            this.$ocLazyLoad.load(angular.module('ib-web-payments-templates'));
            this.$ocLazyLoad.load(angular.module('ib-pmt-app'));
            this.$ocLazyLoad.load(angular.module('ib-pmt-order-confirmation-module'));
            this.$ocLazyLoad.load(angular.module('ib-pmt-communication-lost-module'));
            this.$ocLazyLoad.load(angular.module('ib-pmt-mmb-confirmation-module'));
            this.$ocLazyLoad.load(angular.module('ib-pmt-injectable-module'));
        });

        switch (checkFlow) {
            case 'aviosFlow':
                this.executeFlowAndOpenModal('upgradingAvios', upgradeModel);
                break;
            case 'aviosBidFlow':
                this.executeFlowAndOpenModal('upgradingBidsAvios', upgradeModel);
                break;
            case 'bidFlow':
                this.upgTypeForDigitalData(upgradeModel.bidsUpgradingInfo);
                this.executeFlowAndOpenModal('upgradingBids', upgradeModel);
                break;
            case 'waitingList':
                this.executeFlowAndOpenModal('upgradingAvios', upgradeModel);
                break;
            default:
        }
        if (isPermanentUser) {
            upgradeModel.aviosUpgradingInfo.aviosBidAvailable = false;
        }
    };

    /**
     * Open bids upgrading modal for do upgrading bids for passenger
     */
    private upgTypeForDigitalData = (upgInfo) => {
        let text = '';
        upgInfo.ancillariesTrips.forEach((trip) => {
            text += `${trip.currentCabin}=>`;
            const bidsSegmentFilteredByIdTrip = upgInfo.bidsSegments.filter((bid)=> bid.id === trip.id);
            bidsSegmentFilteredByIdTrip.map((bidFilteredByTrip)=> bidFilteredByTrip.availableCabins.map((availableCabin)=> text += `${availableCabin.cabinType} `));
        });
        this.MmBDatalayerUtilsService.addDigitalDataInfo({upgType: text.trim()})
    };

    private executeFlowAndOpenModal = (flowType: string, upgradeModel: any) => {
        this.IbCPermanentUserService.checkPermanentUserFlow(flowType)
            .then(() => {
                this.ModalServiceAncillaries.openBidsModal(upgradeModel).result.then(() => { }, angular.noop);
            })
            .catch(() => { });
    };
};
