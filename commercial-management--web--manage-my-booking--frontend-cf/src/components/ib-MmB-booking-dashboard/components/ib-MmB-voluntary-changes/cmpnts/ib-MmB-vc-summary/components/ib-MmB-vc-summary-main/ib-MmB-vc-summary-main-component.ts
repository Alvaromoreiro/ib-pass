import angular from "angular";
import { IbVcSummaryTransformer } from "../../services/ib-vc-summary-transformer";
import { IbCConditionsService } from "ib-web-commons/dist/app/core/http-services/pmt-ppm/ib-pmt-conditions-service";
import { MmBModalService } from "@src/components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service";
import { IbCPermanentUserService } from "ib-web-commons/dist/app/core/utils/ib-commons-permanent-user-service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { MmBUtilsSharedService } from "@src/components/services/Utils/ib-MmB-utils-shared-service";
import { MmBChangeFlightOrderService } from "@src/components/services/ib-mmb-change-flight-order-service";
import { MmBDeinvoicingUtils } from "@src/components/services/Utils/ib-MmB-deinvoicing-utils";

@Component(
    'ib-MmB-vc-summary-module',
    'ibMmbVcSummaryMain',
    {
        controllerAs: 'ibMmbVcSummaryMainCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-vc-summary-main-view.html';
        }],
        bindings: {
            inputs: '<'
        }
    },
    ['localStorageService', 'IbVcSummaryTransformer', '$rootScope', '$translate', 'IbCConditionsService', 'MmBModalService' , 'CommonsUtilService', 'IbCPermanentUserService', 'MmBAppConstants', 'MmBUtilsSharedService' , 'DisruptionDashboardConstants', '$filter', 'CommonsSessionStorageService', 'MmBChangeFlightOrderService', '$ocLazyLoad', 'MmBDeinvoicingUtils'],
[])
export class ibMmbVcSummaryMain {

    inputs;
    quadrigam;
    summaryModel;
    modeFlight;
    showRememberLabel;
    showLabelFlightsIncludeInOutbound;
    paymentsForm;
    fareData;
    bookingInfo;

    private get warningCheckOut(): boolean {
        return this.MmBDeinvoicingUtils.checkWarningCheckOut();
    }

    private pmtModelInfo = {
        quadrigams: {
            payments: this.MmBAppConstants.QUADRIGAM.NEW_PAYMENT_PAGE_MMBVC,
            confirmation: this.MmBAppConstants.QUADRIGAM.NEW_PAYMENT_CONFIRMATION_MMBVC
        }
    };
    constructor(
        private localStorageService,
        private IbVcSummaryTransformer: IbVcSummaryTransformer,
        private $rootScope,
        private $translate,
        private IbCConditionsService: IbCConditionsService,
        private MmBModalService: MmBModalService,
        private CommonsUtilService: CommonsUtilService,
        private IbCPermanentUserService: IbCPermanentUserService,
        private MmBAppConstants: MmBAppConstants,
        private MmBUtilsSharedService: MmBUtilsSharedService,
        private DisruptionDashboardConstants,
        private $filter,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private MmBChangeFlightOrderService: MmBChangeFlightOrderService, // Legacy AngularJS - deprecated
        private $ocLazyLoad: any,
        private MmBDeinvoicingUtils: MmBDeinvoicingUtils
    ) {}

    $onInit = (): void => {
        this.bookingInfo = this.localStorageService.get('bookingInfo');
        this.MmBModalService.showWaitingModal(null, null, null, null);
        this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_CV_SUMMARY_NEW_FLIGHTS');
        if (this.$rootScope.isDisruptionFlow) {
            const typeFlowDisruption = this.localStorageService.get('typeDisruptionFlow') || null;
            if (typeFlowDisruption) {
                switch (typeFlowDisruption) {
                    /* With flexibilization */
                    case this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION:
                        this.quadrigam = this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SUMMARY;
                        break;
                    case this.DisruptionDashboardConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION:
                            this.quadrigam = this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SUMMARY;
                        break;
                    /* END With flexibilization */
                    default: this.quadrigam = this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SUMMARY;
            }
            } else {
                this.quadrigam = this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SUMMARY;
            }

        } else {
            this.quadrigam = this.MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SUMMARY;
        }
        const process = this.MmBUtilsSharedService.getProcessByStatus(this.quadrigam, this.bookingInfo?.order?.status);
        this.MmBUtilsSharedService.updateQuadrigam(this.quadrigam, process);
        this.$translate.onReady().then(() => {
            this.fareData = this.localStorageService.get('fareData');
            this.modeFlight = this.localStorageService.get('modeFlight');
            this.IbCConditionsService.getPaymentConditions(this.bookingInfo.flowId).then((conditionsData) => {
                this.summaryModel = this.IbVcSummaryTransformer.generateSummaryModel(this.fareData, this.modeFlight, this.bookingInfo, conditionsData);
                this.generatedShowLabels();
                this.MmBModalService.finishWaiting();
                this.showDeinvoicingWarningModal();
            }, () => {
                this.summaryModel = this.IbVcSummaryTransformer.generateSummaryModel(this.fareData, this.modeFlight, this.bookingInfo, null);
                this.generatedShowLabels();
                this.MmBModalService.finishWaiting();
                this.showDeinvoicingWarningModal();
            });
        }, () => {
            this.MmBModalService.finishWaiting();
        });
        angular.element('.modal-content').scrollTop;
    }

    generatedShowLabels = (): void => {
        if (angular.isUndefined(this.summaryModel.fligthsModel.returnFlight) || this.modeFlight === 'twice') {
            this.showRememberLabel = false;
            this.showLabelFlightsIncludeInOutbound = false;
        } else if (this.modeFlight === 'outbound') {
            this.showRememberLabel = true;
            this.showLabelFlightsIncludeInOutbound = false;
        } else if (this.modeFlight === 'return') {
            this.showRememberLabel = false;
            this.showLabelFlightsIncludeInOutbound = true;
        }
    }

    goToPay = (): void => {
        this.paymentsForm.$submitted = true;

        if (this.paymentsForm.$valid) {
            if (this.summaryModel.totalPriceModel.price <= 0) {
                let newQuadrigam = this.MmBAppConstants.QUADRIGAM.CONFIRMATION_CHANGE_WITH_ALTERNATIVE_FLEXIB_TOTAL;
                
                if (this.$rootScope.isDisruptionFlow) {
                    newQuadrigam = this.MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_CONFIRMATION;
                    this.$rootScope.$broadcast('toPmtView', true);
                }
                else{
                    this.processNothingToPayFlow();
                }
                
                const process = this.MmBUtilsSharedService.getProcessByStatus(newQuadrigam, this.bookingInfo?.order?.status);
                this.MmBUtilsSharedService.updateQuadrigam(newQuadrigam, process);
            } else {
                this.IbCPermanentUserService.checkPermanentUserFlow()
                    .then(() => { this.$rootScope.$broadcast('toPmtView', true); })
                    .catch(() => { });
            }
        }
    }

    processNothingToPayFlow = (): void => {
        this.MmBModalService.showWaitingModal(null, null, null, null);
        this.localStorageService.set('noPaymentVCFlow', true);

        this.MmBChangeFlightOrderService.changeFlightOrderNothingToPay()
            .then(this.handleOrderChangeSuccess, this.handleOrderChangeError)
    };

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
    };

    handleOrderChangeSuccess = (response: any): void => {
        this.loadPaymentModules().then(() => {
            const confirmationDatalayerInfo = this.CommonsSessionStorageService.get('confirmationDatalayerInfo') || {};
            this.CommonsSessionStorageService.set('confirmationDatalayerCallBack', confirmationDatalayerInfo);
            this.CommonsSessionStorageService.set('pmtModelInfo', this.pmtModelInfo);
            this.localStorageService.set('RechargeBookingInfo', true);
            this.$rootScope.$broadcast('confirmationMMBVCEvent');
            this.MmBModalService.finishWaiting();
        });
    };

    handleOrderChangeError = (error: any): void => {
        this.MmBModalService.finishWaiting();
        if (error && error.code === 417) {
            this.$rootScope.$broadcast('comunicationLostEvent');
        }
    };

    private showDeinvoicingWarningModal = (): void => {
        if (this.MmBAppConstants.TOGGLE.isActiveDeinvoicing && this.warningCheckOut) {
            this.MmBModalService.showGenericModal(
                true,
                'ib-modal-deinvoicing-warning.html',
                {
                    title: 'MMB_VOLUNTARY_CHANGE_DEINVOICING_WARNING_MODAL_TITLE',
                    body: 'MMB_VOLUNTARY_CHANGE_DEINVOICING_WARNING_MODAL_BODY',
                    hideClose: true,
                    accept: 'MMB_VOLUNTARY_CHANGE_DEINVOICING_WARNING_MODAL_BUTTON'
                },
                'ib-modals ib-modals--md ib-modals--deinvoicing-warning'
            ).result.then(angular.noop, angular.noop);
        }
    };
}
