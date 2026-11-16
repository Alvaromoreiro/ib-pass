import { IbMmBUmnrDataModalComponent } from "@src/components/ib-MmB-umnr-passengers/components/ib-MmB-umnr-data-modal/ib-MmB-umnr-data-modal.component";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { Skeleton } from "commercial-management--digital--web-components-design--library";
import { IbCModalService } from "ib-web-commons/ib-modal";
import { IbMmbUmnrUtilsService } from '../../../../../ib-MmB-umnr-passengers/services/ib-Mmb-umnr-utils.service';

@Component(
    'ib-MmB-manage-passengers-info-module',
    'ibMmbManagePassengersInfo',
    {
        controllerAs: 'managePassengersInfoCtrl',
        templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
            return MmBAppConstants.templatesRoute + 'ib-MmB-manage-passengers-info-view.html';
        }],
        bindings: {
            model: '=',
            apis: '<',
            flags: '=',
            passengers: '=',
            related: '=',
        },
    },
    ['$scope', 'BookingDashboardConstants', '$rootScope', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'IbCModalService', 'IbMmbUmnrUtilsService'],
[])
export class ibMmbManagePassengersInfoComponent {
    model;
    apis;
    flags;
    passengers;
    related;

    index;
    apisFormFilled = {};
    skeletonComponent = Skeleton;
    skeletonProps = {
        className: 'mmb-skeleton-dashboard mmb-skeleton-dashboard__passengers'
    };
    skeletonIconProps = {
        className:'mmb-skeleton-dashboard mmb-skeleton-dashboard__skeleton-icon'
    };

    isActiveUmnr:boolean = false;
    isDataUmnrCompleted:boolean = false;

    constructor(
        private $scope,
        private BookingDashboardConstants,
        private $rootScope,
        private MmBDatalayerUtilsService,
        private MmBAppConstants,
        private IbCModalService: IbCModalService,
        private IbMmbUmnrUtilsService: IbMmbUmnrUtilsService
    ) {
        this.isActiveUmnr = this.IbMmbUmnrUtilsService.isActiveUMNR();
        this.isDataUmnrCompleted = this.IbMmbUmnrUtilsService.isDataUmnrCompleted();
    }

    $onInit = () => {
        this.$scope.$on('apisFormSaved', (event, data) => {
            if (data && data.passengerId) {
                this.apisFormFilled[data.passengerId] = true;
            }
        });
    }

    changePassData = (passIndex, passType) => {
        let passenger;
        if (this.model[passIndex].passengerType === this.MmBAppConstants.PASSENGER_TYPES.infant) {
            for (passenger in this.model) {
                if (this.model[passenger].passengerId === this.model[passIndex].relatedPassengerId) {
                    passIndex = passenger;
                }
            }
        }
        this.$scope.$emit('fillApisData', { index: passIndex, info: this.passengers, type: passType});
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOAPIS,MMBDatalayerConstants.DIGITAL_DATA_STEP.MOAPIS, this.MmBAppConstants.QUADRIGAM.ADD_APIS);
    };

    /**
     * Emits an event passing passengers tab constant to change active tab to passengers.
     */
    goToPassengersTab = (index) => {
        this.$rootScope.$emit('changeTabEvent', this.BookingDashboardConstants.TABS.passengers, index);
    }

    statusApisInfoComplete = (passengerId, flagsPassengerId, apisStatus) => {
        let isTranslated = false;
        for (let i = 0; i < this.BookingDashboardConstants.APIS_STATUS_COMPLETE.length; i++) {
            const completeTranslation = this.BookingDashboardConstants.APIS_STATUS_COMPLETE[i];
            if (completeTranslation === apisStatus) {
                isTranslated = true;
            }
        }
        return passengerId === flagsPassengerId && isTranslated;
    };

    openDataModal = (viewModel) => {
        const options = {
            windowClass: 'ib-modals ib-modals--right mmb-modals mmb-modals--right ib-modals--full-mobile',
            modalBlocked: false
        };
        const modalRef = this.IbCModalService.showGenericComponentModal(IbMmBUmnrDataModalComponent, {...options});
        // modalRef.componentInstance.currentStep = viewModel.currentStep ?? {};

        return modalRef;
    };
};
