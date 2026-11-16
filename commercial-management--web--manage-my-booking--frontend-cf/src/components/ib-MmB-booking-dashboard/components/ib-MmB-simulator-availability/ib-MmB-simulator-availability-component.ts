import { MmBModalService } from '@src/components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service';
import angular from 'angular';
import { SimulatorAvailabilityTransformer } from './transformers/ib-MmB-simulator-availability-transformer';
import { BookingSearchService } from '@src/components/services/ib-booking-search-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component(
    'ib-MmB-simulator-availability-module',
    'ibMmbSimulatorAvailabilityComponent',
    {
        controllerAs: 'simulatorAvailabilityCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-simulator-availability-view.html';
        }],
        bindings: {
            resolve: '<'
        }
    },
    ['$scope', 'MmBModalService', 'SimulatorAvailabilityTransformer', 'MmBAppConstants', 'localStorageService', '$rootScope', 'BookingDashboardConstants', '$timeout', '$filter', 'CommonsUtilService', '$window', 'BookingSearchService', '$translate', '$ocLazyLoad'],
    [])
export class ibMmbSimulatorAvailabilityComponent {

    confirmationMMBVCEvent = null;
    dataAvailability = {};
    dataAvailabilityTransformer = {};
    showPmtView = false;
    steps = [];
    totalSteps = 2;
    model;
    originalDateFlights;
    actualStep;
    stepPoint;
    resolve;

    constructor(
        private $scope,
        private MmBModalService: MmBModalService,
        private SimulatorAvailabilityTransformer: SimulatorAvailabilityTransformer,
        private MmBAppConstants: MmBAppConstants,
        private localStorageService,
        private $rootScope,
        private BookingDashboardConstants,
        private $timeout,
        private $filter,
        private CommonsUtilService: CommonsUtilService,
        private $window,
        private BookingSearchService: BookingSearchService,
        private $translate,
        private $ocLazyLoad) {
        this.$scope.$on('toSummaryView', this.toSummaryView);
        this.$scope.$on('changeDataAvailability', this.changeDataAvailability);
        this.$scope.$on('$destroy', this.destroyStyleHome);
    }

    destroyStyleHome = () => {
        angular.element('body').css('overflow-y', 'auto');
    }

    /**
     * It generates the model with the objects received from its parent
     * component and transforms it to be used in its child components.
     */
    $onInit = () => {

        var dataFlights, modelRibbon, selectedSlice, penalty, dataFlightsTransformed;
        var cvFlowInitialized = this.localStorageService.get('cvFlowInitialized');
        this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_VC_SELECT_NEW_FLIGHTS');
        if (cvFlowInitialized === null) {
            cvFlowInitialized = true;
            this.localStorageService.set('cvFlowInitialized', true);
        }
        this.$window.onpopstate = function () {
            history.pushState(null, null, location.href);
            this.$timeout(() => {
                if (angular.isDefined(cvFlowInitialized) && cvFlowInitialized && this.localStorageService.get('cvFlowInitialized')) {
                    this.showModalByModal();
                }
            });
        };
        this.$translate.onReady().then(() => {
            this.steps = [{
                name: this.$filter('translate')('MMB_VC_1_SELECTION_OF_FLIGHTS'),
                isActive: true,
                stepId: this.MmBAppConstants.STEPS_SIMULATOR_CHANGE_VOLUNTARY.SELECT_FLIGHT
            }, {
                name: this.$filter('translate')('MMB_VC_2_SUMMARY'),
                isActive: false,
                stepId: this.MmBAppConstants.STEPS_SIMULATOR_CHANGE_VOLUNTARY.SUMMARY
            }];

            dataFlights = this.resolve.dataModalChangesFlights.availability;
            modelRibbon = this.resolve.dataModalChangesFlights.modelRibbon;
            selectedSlice = this.resolve.dataModalChangesFlights.selectedSlide;
            penalty = this.resolve.dataModalChangesFlights.penalty;
            if (!dataFlights.empty) {
                dataFlightsTransformed = this.SimulatorAvailabilityTransformer.getDataAvailabilityTransformed(dataFlights, dataFlights.modeFlight, penalty);
                this.model = dataFlightsTransformed;
            } else {
                this.model = { modelempty: true, originDestinations: dataFlights.originDestinations };
            }
            this.model.modeFlight = dataFlights.modeFlight;
            this.model.modelRibbon = modelRibbon;
            this.model.selectedSlice = selectedSlice;
            this.model.penalty = penalty;
            this.model.responseId = dataFlights.responseId;
            this.model.filterRangeParsed = this.resolve.dataModalChangesFlights.filterRangeParsed;
            this.originalDateFlights = this.resolve.dataModalChangesFlights.originalDateFlights;
            this.actualStep = this.MmBAppConstants.STEPS_SIMULATOR_CHANGE_VOLUNTARY.SELECT_FLIGHT;
            //this.actualStep = MmBAppConstants.STEPS_SIMULATOR_CHANGE_VOLUNTARY.SUMMARY;
            this.stepPoint = 1;
            this.$timeout(() => {
                angular.element('.modal-dialog').css('overflow-y', 'scroll');
            });

        });
    }

    /**
     * Open a generic modal indicated by template name.
     */
    showModalByModal = () => {
        const template = 'generic-close-change-flight.html';
        this.model.idModal = 'modalQuitSimulatorChangeFlight';
        switch (this.actualStep) {
            default:
                this.MmBModalService.showGenericModal(false, template, this.model, null).result.then((data) => {
                    if (data === 'goHome') {
                        this.localStorageService.remove('cvFlowInitialized');
                        this.closeAndUpdateImportOrder();
                    }
                }, (data) => {
                    this.MmBModalService.closeModal();
                });
                break;
        }
    }

    private closeAndUpdateImportOrder = () => {
        if (this.localStorageService.get('RechargeBookingInfo')) {
            this.localStorageService.set('manualCloseVCModal', true);
            if (this.localStorageService.get('flowApp') === 'MMBUNIF') {
                const data = {
                    pnr: this.localStorageService.get('PNR'),
                    surname: this.localStorageService.get('bookingInfo').passengers[0].personalInfo.surname,
                    name: this.localStorageService.get('bookingInfo').passengers[0].personalInfo.name,
                    isAirShuttle: false
                };
                this.BookingSearchService.searchFlightsPassengersEvent(null, data);
            }
            this.$rootScope.$broadcast('reloadImportOrder');
        }
        this.MmBModalService.closeAllCurrentModals();
        this.$scope.$emit('changeTabEvent', this.BookingDashboardConstants.TABS.management);
    }

    closeGoHome = () => {
        this.closeAndUpdateImportOrder();
    }

    /**
     * Update the model with info received.
     * @param {Object} event Information event emited for another component.
     * @param {Object} Info Paremeters necesary to change model.
     */
    changeDataAvailability = (event, info) => {
        let dataFlightsTransformed;
        this.model.responseId = info.data.responseId;
        info.data.flightsLength = this.SimulatorAvailabilityTransformer.getFlightsLength();
        dataFlightsTransformed = this.SimulatorAvailabilityTransformer.getDataAvailabilityTransformed(info.data, info.modeFlight, this.model.penalty);
        this.$scope.$broadcast('updateAvailability', dataFlightsTransformed);
    }

    toSummaryView = () => {
        this.actualStep = this.MmBAppConstants.STEPS_SIMULATOR_CHANGE_VOLUNTARY.SUMMARY;
        this.updateActiveSteps();
        this.stepPoint = 2;
        this.showPmtView = false;
    }

    updateActiveSteps = () => {
        angular.forEach(this.steps, (step) => {
            if (step.stepId === this.actualStep) {
                step.isActive = true;
            } else {
                step.isActive = false;
            }
        });
    }
}
