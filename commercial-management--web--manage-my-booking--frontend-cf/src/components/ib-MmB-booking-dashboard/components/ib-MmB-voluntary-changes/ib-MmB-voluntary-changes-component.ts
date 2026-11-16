import { MmBModalService } from '@src/components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service';
import angular from 'angular';
import { VoluntaryChangesTransformer } from './transformers/ib-MmB-voluntary-changes-transformer';
import { BookingSearchService } from '@src/components/services/ib-booking-search-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component(
    'ib-MmB-voluntary-changes-module',
    'ibMmbVoluntaryChangesComponent',
    {
        controllerAs: 'voluntaryChangesCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-voluntary-changes-view.html';
        }],
        bindings: {
            resolve: '<'
        }
    },
    ['$scope', 'MmBModalService', 'VoluntaryChangesTransformer', 'MmBAppConstants', 'localStorageService', '$rootScope', 'BookingDashboardConstants', '$timeout', '$filter' , 'CommonsUtilService', '$window', 'BookingSearchService', '$translate', '$ocLazyLoad'],
[])
export class ibMmbVoluntaryChangesComponent {

    confirmationMMBVCEvent = null;
    dataAvailability = {};
    dataAvailabilityTransformer = {};
    showPmtView = false;
    steps = [];
    totalSteps = 4;
    model;
    originalDateFlights;
    actualStep;
    stepPoint;
    resolve;

    constructor(
        private $scope,
        private MmBModalService: MmBModalService,
        private VoluntaryChangesTransformer: VoluntaryChangesTransformer,
        private MmBAppConstants: MmBAppConstants,
        private localStorageService,
        private $rootScope,
        private BookingDashboardConstants,
        private $timeout,
        private $filter ,
        private CommonsUtilService: CommonsUtilService,
        private $window,
        private BookingSearchService: BookingSearchService,
        private $translate,
        private $ocLazyLoad) {
            this.confirmationMMBVCEvent = this.$rootScope.$on('confirmationMMBVCEvent', this.confirmationMMBVC);
            this.$scope.$on('$destroy', this.confirmationMMBVCEvent);
            this.$scope.$on('comunicationLostEvent', this.toComunicationLostView);
            this.$scope.$on('toPmtView', this.toPmtview);
            this.$scope.$on('toSummaryView', this.toSummaryView);
            this.$scope.$on('changeDataAvailability', this.changeDataAvailability);
            this.$scope.$on('$destroy', this.destroyStyleHome);
            this.$scope.$on('cvConfimationBackButtonPressed', this.cvConfimationBackButtonPressed);
        }
    
    destroyStyleHome = () => {
        angular.element('body').css('overflow-y', 'auto');
    }

    /**
     * It generates the model with the objects received from its parent
     * component and transforms it to be used in its child components.
     */
    $onInit = () => {
        var dataFlights, modelRibbon, selectedSlice, dataFlightsTransformed, paymentRedirection = this.localStorageService.get('paymentRedirection') || null;
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
                stepId: this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.SELECT_FLIGHT
            }, {
                name: this.$filter('translate')('MMB_VC_2_SUMMARY'),
                isActive: false,
                stepId: this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.SUMMARY
            }, {
                name: this.$filter('translate')('MMB_VC_3_PAYMENT'),
                isActive: false,
                stepId: this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.PAYMENTS
            }, {
                name: this.$filter('translate')('MMB_VC_4_CONFIRMATION'),
                isActive: false,
                stepId: this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.CONFIRMATION
            }];
            if (paymentRedirection) {
                this.model = {};
                this.toPmtview();
            } else {
                dataFlights = this.resolve.dataModalChangesFlights.availability;
                modelRibbon = this.resolve.dataModalChangesFlights.modelRibbon;
                selectedSlice = this.resolve.dataModalChangesFlights.selectedSlide;
                if (!dataFlights.empty) {
                    dataFlightsTransformed = this.VoluntaryChangesTransformer.getDataAvailabilityTransformed(dataFlights, dataFlights.modeFlight);
                    this.model = dataFlightsTransformed;
                } else {
                    this.model = {modelempty: true, originDestinations: dataFlights.originDestinations};
                }
                this.model.modeFlight = dataFlights.modeFlight;
                this.model.modelRibbon = modelRibbon;
                this.model.selectedSlice = selectedSlice;
                this.model.responseId = dataFlights.responseId;
                this.originalDateFlights = this.resolve.dataModalChangesFlights.originalDateFlights;
                this.actualStep = this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.SELECT_FLIGHT;
                //this.actualStep = MmBAppConstants.STEPS_CHANGE_VOLUNTARY.SUMMARY;
                this.stepPoint = 1;
                this.$timeout(() => {
                    angular.element('.modal-dialog').css('overflow-y', 'scroll');
                });
            }
        });
    }

    /**
     * Open a generic modal indicated by template name.
     */
    showModalByModal = () => {
        const template = 'generic-close-change-flight.html';
        this.model.idModal = 'modalQuitVoluntaryChanges';
        switch (this.actualStep) {
                case this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.COMUNICATION_LOST:
                    this.localStorageService.remove('summaryCVBounds');
                    this.localStorageService.remove('paySucces');
                    this.closeAndUpdateImportOrder();
                    break;
                case this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.CONFIRMATION:
                    this.closeAndUpdateImportOrder();
                    break;
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
            if(this.localStorageService.get('flowApp') === 'MMBUNIF') {
                const data = {pnr: this.localStorageService.get('PNR'),
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

    cvConfimationBackButtonPressed = (event) => {
        this.showModalByModal();
    }

    /**
     * Update the model with info received.
     * @param {Object} event Information event emited for another component.
     * @param {Object} Info Paremeters necesary to change model.
     */
    changeDataAvailability = (event, info) => {
        let dataFlightsTransformed;
        this.model.responseId = info.data.responseId;
        info.data.flightsLength = this.VoluntaryChangesTransformer.getFlightsLength();
        dataFlightsTransformed = this.VoluntaryChangesTransformer.getDataAvailabilityTransformed(info.data, info.modeFlight);
        this.$scope.$broadcast('updateAvailability', dataFlightsTransformed);
    }


    private loadPaymentModules(): Promise<void> {
        return import('@src/lazy-loading/ib-web-payments').then(() => {
            const paymentModules = [
                'ib-web-payments-templates',
                'ib-pmt-app',
                'ib-pmt-order-confirmation-module',
                'ib-pmt-communication-lost-module',
                'ib-pmt-mmb-confirmation-module',
                'ib-pmt-injectable-module'
            ];

            paymentModules.forEach(moduleName => {
                this.$ocLazyLoad.load(angular.module(moduleName));
            });
        });
    }

    toPmtview = () => {
        this.actualStep = this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.PAYMENTS;
        this.updateActiveSteps();
        this.stepPoint = 3;
        this.loadPaymentModules().then(() => {
            this.showPmtView = true;
        });
    }

    toSummaryView = () => {
        this.actualStep = this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.SUMMARY;
        this.updateActiveSteps();
        this.stepPoint = 2;
        this.showPmtView = false;
    }

    confirmationMMBVC = () => {
        this.$rootScope.blockedKeepAliveModal = true;
        this.actualStep = this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.CONFIRMATION;
        this.updateActiveSteps();
        this.stepPoint = 4;
        this.showPmtView = false;
    }

    toComunicationLostView = () => {
        this.$rootScope.blockedKeepAliveModal = true;
        this.actualStep = this.MmBAppConstants.STEPS_CHANGE_VOLUNTARY.COMUNICATION_LOST;
        this.updateActiveSteps();
        this.stepPoint = 4;
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