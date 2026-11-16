import * as angular from 'angular';
import type { AncillariesService } from './ib-booking-ancillaries-service';
import { DatalayerConstantsType } from 'ib-web-commons/dist/app/core/ib-datalayer/ib-datalayer-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/dist/utils';
import { DatalayerUtils } from './services/ib-datalayer-utils';
import { AncillariesConfigurationService } from './services/ib-web-ancillaries-configuration-service';
import { AncillariesSearchHandlerService } from './services/ib-web-ancillaries-search-handler.service';
import { CallAncillariesService } from '@shared/http-services/ass-fass/ib-call-ancillaries.service';
import { AncillariesTransformer } from './transformer/ib-web-ancillaries-transformer';
import { type CallBundleService, NewSeatsMapService } from 'ib-web-ancillaries';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingCheckVoucherCodeService } from '@src/app/shared/http-services/sse-orm/ib-booking-check-voucher-code.service';
import { IbCheckPartnersDiscountsService } from '@src/app/shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { LoyaltyProgramEarnModel } from '@src/app/core/models/generic-models/generic-models';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { AncillariesStatusResponseModel } from '../../core/models/ancillaries/ancillaries-status-response-model';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import type { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
@Component('ib-booking-ancillaries-module', 'ibBookingAncillaries', {
    controllerAs: 'ancillariesCtrl',
    templateUrl: ['BookingAppConstants', ( bkiConstants: BookingAppConstants ): string => bkiConstants.templatesRoute + 'ib-booking-ancillaries-view.html']
}, [
    '$scope', '$rootScope', '$window', 'BookingAncillariesService', 'AncillariesTemporalUtilsService',
    'localStorageService', 'ModalServiceAncillaries', 'CallAncillariesService', 'BookingAncillariesConstant',
    '$timeout', 'DatalayerUtilsService', 'DatalayerConstants', 'MonetateUtilsService', 'MonetateConstants',
    'NewMainHeaderFacade', 'BookingAncillariesTransformer', 'CommonsAncillariesService', '$document', '$location',
    'CommonsUtilService', 'CommonsModalService', 'AncillariesConfigurationService', 'DatalayerUtils', 'CommonsConstants', 'CommonsSessionStorageService',
    'CallBundleService', '$filter', 'NewSeatsMapService', 'BookingUtilService', 'IbBookingCheckVoucherCodeService', 'IbCheckPartnersDiscountsService', 'CommonsUserUtilsService', 'BookingAvailabilityTransformer',
    'DigitalDataUtilsService', 'AncillariesSearchHandlerService'], ['ib-booking-anc-simplified-total-price-module'])
export class AncillariesController implements ng.IController {
    public quadrigamStatus = false;
    public typeQuadrigam;
    public baggagesTrips;
    public speqsTrips;
    public seatConfirmationInfo;
    public dirtyResult;
    public result;
    public headerModel;
    public model: BookingAncillariesModel.Model;
    public showOnHoldNotice: boolean;
    public userLogged: boolean;
    public flightAviosInfo: boolean;
    public baggagesTemp: any;
    private speqsTemp: any;
    private modelLightBox: any;
    public bundelingView: boolean = false;
    public continueText = null;
    public isMobile: boolean;
    public adaptativeMobileFlow: boolean;
    private createOrderVoucherID: string;
    private partnerDiscount: string;
    public loyaltyEarnInfo: LoyaltyProgramEarnModel;
    public LOGIN_ONB: string;
    private flowApp: string = 'BKI';
    constructor (
        private $scope: angular.IScope,
        private $rootScope: CommonsRootScope,
        private $window: ng.IWindowService,
        private AncillariesService: AncillariesService,
        private AncillariesTemporalUtilsService: any,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private ModalServiceAncillaries: any,
        private CallAncillariesService: CallAncillariesService,
        private BookingAncillariesConstant: BookingAncillariesConstant,
        private $timeout: ng.ITimeoutService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private DatalayerConstants: DatalayerConstantsType,
        private MonetateUtilsService: MonetateUtilsService,
        private MonetateConstants: any,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private AncillariesTransformer: AncillariesTransformer,
        private CommonsAncillariesService: CommonsAncillariesService,
        private $document: any,
        private $location: ng.ILocationService,
        private CommonsUtilService: CommonsUtilService,
        private CommonsModalService: CommonsModalService,
        private AncillariesConfigurationService: AncillariesConfigurationService,
        private DatalayerUtils: DatalayerUtils,
        private CommonsConstants: CommonsConstantsType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CallBundleService: CallBundleService,
        private $filter: angular.IFilterService,
        private NewSeatsMapService: NewSeatsMapService,
        private BookingUtilService: any,
        private IbBookingCheckVoucherCodeService: IbBookingCheckVoucherCodeService,
        private IbCheckPartnersDiscountsService: IbCheckPartnersDiscountsService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private BookingAvailabilityTransformer,
        private DigitalDataUtilsService: DigitalDataUtilsService,
        private AncillariesSearchHandlerService: AncillariesSearchHandlerService
    ) {


        this.$scope.$on('openSeatMap', this.openSeatMap);
        this.$scope.$on('openInsuranceModal', this.openInsuranceModal);
        this.$scope.$on('openBaggages', this.openBaggages);
        this.$scope.$on('openBobModal', this.openBobModal);
        this.$scope.$on('openSpeqs', this.openSpeqs);
        this.$scope.$on('selectInsurance', this.selectInsurance);
        this.$scope.$on('updateInsurance', this.updateInsurance);
        this.$scope.$on('openChangeResidenceCountry', this.openChangeResidenceCountry);
        this.$scope.$on('cancelChangesInsurance', this.cancelChangesInsurance);
        this.$scope.$on('changeInsuranceCountry', this.changeInsuranceCountry);
        this.$scope.$on('modifySeatMap', this.modifySeatMap);
        this.$scope.$on('goToPayments', this.goToPayments);
        this.$scope.$on('modifyPendingSeat', this.modifyPendingSeat);
        this.$scope.$on('openCarbonFootprintModal', this.openCarbonFootprintModal);
        this.$scope.$on('openInsuranceInfoCubaModal', this.openInsuranceInfoCubaModal);
        this.$scope.$on('checkPrioAndFlex', this.checkPrioAndFlex);
        this.$scope.$on('openTransfersModal', this.openTransfersModal);
        this.$scope.$on('openTransfersModifyModal', this.openTransfersModifyModal);
        this.$scope.$on('deleteGlobickTransfers', this.deleteGlobickTransfers);
        this.$scope.$on('checkBaggages', this.checkBaggages);
        this.$scope.$on('checkSpeqs', this.checkSpeqs);
        this.$scope.$on('maxSpeqsAlert', this.maxSpeqsAlert);
        this.$scope.$on('maxBaggsAlert', this.maxBaggsAlert);
        this.$scope.$on('goPaymentTransfers', this.goPaymentTransfers);
        this.$scope.$on('checkSeatsQuantity', this.checkQuantitySeat);
        this.$scope.$on('updateAvios', this.updateLoyaltyEarnInfo);
        this.$scope.$on('setPetcModifyButton', this.setPetcModifyButton);
        this.$scope.$on('setAssistCardModifyButton', this.setAssistCardModifyButton);


        //Pendiente de probar si funciona correctamente asi
        this.$rootScope.$on('totalBasket', this.updateTotalBasket);
        this.$rootScope.$on('deleteBaggages', this.deleteBaggages);
        this.$rootScope.$on('deleteSpeqs', this.deleteSpeqs);
        this.$rootScope.$on('deleteSeats', this.deleteSeats);
        this.$rootScope.$on('deleteCarbonFootprintAncillary', this.deleteCarbonFootprintAncillary);
        this.$rootScope.$on('cleanCarbonFootprintAncillary', this.cleanCarbonFootprintAncillary);
        this.$rootScope.$on('cleanFlexibilization', this.cleanFlexibilization);
        this.$scope.$on('openInsuranceInfoModal', this.openInsuranceInfoModal);
        this.$scope.$on(this.BookingAncillariesConstant.FLEX_CONFIGURATION.NAME, this.openFlexibilization);
        this.$rootScope.$on('cleanPriorityBoarding', this.cleanPriorityBoarding);
        this.$scope.$on(this.BookingAncillariesConstant.PRIORITY_BOARDING.NAME, this.openPriorityBoarding);
        this.$document.on('mouseleave', this.openOnholdLightBox);
        this.$rootScope.$on('closeOnholdLightBox', this.closeOnholdLightBox);
        this.userLogged = this.localStorageService.get('userLogged');
        this.flightAviosInfo = this.AncillariesTemporalUtilsService.validatedFlightAviosInfo();
        this.adaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
        this.$window.addEventListener('nextStepFlowLegacy', this.goToPaymentEventListener);
        this.$window.addEventListener('resize', this.onResize);
        this.$rootScope.$on('refreshAncillaries', this.refreshAncillaries);
    }

    active = (): any => {
        this.flowApp = this.localStorageService.get<string>(BkiStorageConstants.FLOW_APP);
        this.model = this.AncillariesConfigurationService.initializeModel();
        this.continueText = BookingAppConstants.TOTALPRICE_STEPS_MAP[ 'ibcmtv' ].text;
        const createOrderData = this.CommonsSessionStorageService.get<any>('createOrderData');
        this.createOrderVoucherID = createOrderData?.order?.voucherDiscount?.voucherId ?? null;
        this.partnerDiscount = this.IbCheckPartnersDiscountsService.getSelectedPartner()?.partnerIdentifier ?? null;
        this.LOGIN_ONB = BookingAppConstants.LOGIN_ONB;
        const appliedPartner = this.partnerDiscount != null;
        const appliedVoucher = this.createOrderVoucherID != null;
        const hasPartnerOrVoucher = appliedPartner || appliedVoucher;
        
        let modalTitle = 'GENERAL_ADVICE_TITLE', modalBody, modalAlert;
        const isOnHoldOrder = !!this.localStorageService.get('isOnHoldOrder');
        const isHoldOrPartner = appliedPartner || isOnHoldOrder;
        const prevStep =  this.CommonsSessionStorageService.get('previousStepFlow');
        const shouldShowModal = (prevStep === 'ibpurc') && (isOnHoldOrder || hasPartnerOrVoucher);
        if (shouldShowModal) {
            this.CommonsModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true, null);
            if (isHoldOrPartner) {
                modalBody = 'NOT_ALLOWED_FLOW_STEP_TEXT';
                modalAlert = '';
            } else {
                modalBody = 'NOTICE_DELETED_VOUCHER';
                modalAlert = 'AVAILABILITY_ON_BUSINESS_OPTION_TITLE';
            }
            this.CommonsModalService.showGenericModal(true, 'flow-step-modal.html', { idModal: 'ib-modal-not-allowed-flow', alert: modalAlert, title: modalTitle, body: modalBody, accept: 'MODAL_GENERAL_BUTTON_CANCEL', cancel: 'MODAL_GENERAL_BUTTON_ACCEPT' }, null).result.then(() => {
                if (this.$rootScope.isShuttleFlow) {
                    this.$location.path('/ibshuttle');
                }
                if (isHoldOrPartner) {
                    this.$location.path('/availability');
                    this.localStorageService.set('isOnHoldOrder', false);
                } else {
                    this.removeVoucher()
                        .then(()=> {
                            this.NewMainHeaderFacade.deleteDiscountFromBasket('VOUCHER');
                            this.active();
                            this.ModalServiceAncillaries.isNotWaiting();
                        })
                        .catch((error)=> {
                            this.CommonsModalService.showGenericError(error).result.finally(()=> {this.$location.path('/availability');});
                        }); 
                }
            }, () => {
                this.CommonsModalService.finishWaiting();
                this.$location.path(this.BookingAncillariesConstant.PAGES_ROUTES.PAYMENTS);
            });
        } else {
            this.localStorageService.remove('birthDate');
            this.localStorageService.set('showHideWaitingModal', true);
            this.showOnHoldNotice = false;
            this.localStorageService.set('ancillariesAction', 'impression');
            this.headerModel = this.localStorageService.get('headerModel');
            this.CommonsUtilService.setTitlePage('BKI_TITLE_ANCILLARIES_PAGE');
            this.NewMainHeaderFacade.updateSteps(this.localStorageService.get('actualStepFlow'));
            this.model.totalPayment = this.headerModel ? this.headerModel.headerModel.shoppingBasket.total.formatted : 0;

            this.seatConfirmationInfo = this.AncillariesTemporalUtilsService.getSeatInfoConfirmation();
            this.$rootScope.showHeaders = true;

            this.searchAncillaries(createOrderData);
        }            
        
        this.localStorageService.remove('genAviosAncillariesSeat');
        this.localStorageService.remove('bundleItems');

        this.getBundlesAvailability();
        this.openPetModalifIsPetFlight();
        this.updateDatalayer(true);

        this.DatalayerUtilsService.updateDatalayerViewEvent();
    };

    //array of ancillaries types
    private orderAncillaries = (ancillaryList: string[]) => {
        const ancillariesOrder = this.BookingAncillariesConstant.ANCILLARIES_DISPLAY_ORDER;
        const result = [];
        ancillaryList = this.positionPetIfIsPetFlight(result, ancillaryList);
        for(let i = 0; i < ancillariesOrder.length; i++) {
            for(let j = 0; j < ancillaryList.length; j++) {
                if(ancillariesOrder[i] === ancillaryList[j]) {
                    result.push(ancillariesOrder[i]);
                }
            }
        }
        for(let i = 0; i < ancillaryList.length; i++) {
            let ancillarieInList = false;
            for(let j = 0; j < ancillariesOrder.length; j++) {
                if(ancillariesOrder[j] === ancillaryList[i]) {
                    ancillarieInList = true;
                }
            }
            if(!ancillarieInList) {
                result.push(ancillaryList[i]);
            }
        }
        return result;
    };

    private checkAncillariesInfo = () => {
        const headerModel: any = this.localStorageService.get('headerModel');
        this.baggagesTrips = this.localStorageService.get('passengerBaggagesTrips') ?? this.model.passengerBaggagesTrips;
        this.speqsTrips = this.localStorageService.get('passengerSpeqsTrips') ?? this.model.passengerSpeqsTrips;
        const shoppingBasket = this.AncillariesSearchHandlerService.getShoppingBasket(headerModel);
        this.AncillariesSearchHandlerService.updateSeatsQuantyFromBasket(this.model, shoppingBasket.seats);
        if (shoppingBasket.carbonFootprint?.hasCarbonFootprint) {
            this.model.ancillariesCarbonFootprint.confirmed = true;
        }
        if (this.model.baggageAvailable && this.baggagesTrips) {
            this.model.passengerBaggagesTrips = this.baggagesTrips;
            this.model.baggagesQuanty = this.AncillariesService.countBaggageTotal(this.model.passengerBaggagesTrips);
        }
        if (this.speqsTrips) {
            this.model.passengerSpeqsTrips = this.speqsTrips;
            this.model.speqsQuanty = this.AncillariesService.countSpeqsTotal(this.model.passengerSpeqsTrips);
        }
    };

    private goToPaymentEventListener: EventListener = (event: Event) => {
        event.stopImmediatePropagation();
        this.goToPayments();
    };

    private refreshAncillaries = (evt, createOrderData: any) => {
        this.searchAncillaries(createOrderData, true);
    };
    
    private searchAncillaries = (createOrderData: any, _isIncompatibilityReload?: boolean) => {
        this.AncillariesService.searchAncillariesInfo(_isIncompatibilityReload).then((response) => {
            this.AncillariesSearchHandlerService.mapResponseToModel(this.model, response);
            this.model.ancillariesAvailable = this.orderAncillaries(response.ancillariesAvailable);
            this.AncillariesSearchHandlerService.applyTransfersIfAvailable(this.model, response);
            this.checkAncillariesInfo();
            this.AncillariesSearchHandlerService.applyTotalPaymentIfMissing(this.model);
            this.model.relatedContent = this.BookingUtilService.getRelatedContent(this.localStorageService.get('availabilityRelatedContent'));
            this.NewMainHeaderFacade.updateTripsFromOrder(createOrderData);
            this.NewMainHeaderFacade.showLogin();
            this.NewMainHeaderFacade.deleteDiscountFromBasket('AVIOS');
            this.NewMainHeaderFacade.deleteDiscountFromBasket('VOUCHER');
            this.NewMainHeaderFacade.updateBasketOthers('CARD');
            this.AncillariesSearchHandlerService.applyDiscountsToBasket(createOrderData);
            this.DatalayerUtilsService.updateDiscountData(createOrderData?.order?.specialDiscounts ?? []);
            this.headerModel = this.localStorageService.get('headerModel');
            this.$timeout(() => { this.$rootScope.$broadcast('updateHeaderCurrency', this.model.currency); });
            this.AncillariesSearchHandlerService.restoreSelectedInsurance(this.model);
            this.AncillariesSearchHandlerService.restoreSelectedFlex(this.model);
            if (this.localStorageService.get('selectedPriorityBoarding')) {
                this.model.ancillariesPriorityBoarding.confirmed = true;
            }
            if (this.model.upgrading) {
                this.NewMainHeaderFacade.updateBasketUpgrading(this.model.upgrading);
            }
            this.$timeout(() => { angular.element(this.$window).trigger('resize'); });
            this.setAviosAncillaries();
            this.$rootScope.$digest();
        }, () => {
            this.AncillariesService.generateRequestAncillaries(null);
        });
    };

    private positionPetIfIsPetFlight (result: string[], ancillaryList: string[]): string [] {
        const isPetFlightFilter = this.BookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT);
        if (isPetFlightFilter && ancillaryList.includes(BookingAppConstants.ANCILLARIES_TYPES.PET)) {
            result.push(BookingAppConstants.ANCILLARIES_TYPES.PET);
            ancillaryList = ancillaryList.filter((ancillary: string) => ancillary !== BookingAppConstants.ANCILLARIES_TYPES.PET);
        }
        return ancillaryList;
    }

    private openPetModalifIsPetFlight () : void {
        const isPetFlightFilter = this.BookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT);
        const ancillariesInfo = this.localStorageService.get<AncillariesStatusResponseModel>('ancillariesInfo')?.ancillaries;
        const isPetAvailable: boolean = (ancillariesInfo || []).some(
            (ancillary) => ancillary.type === BookingAppConstants.ANCILLARIES_TYPES.PET
                && ancillary.status.code === BookingAppConstants.GENERAL_STATUS.AVAILABLE
        );
        if (isPetFlightFilter && isPetAvailable) {
            setTimeout(() => {
                const el = document.getElementById('ib-ancillary-box-' + BookingAppConstants.ANCILLARIES_TYPES.PET) as HTMLElement;
                el?.click();
            }, 1000);
        }
    }
    
    getBundlesAvailability (): void {
        if(this.shouldCallBundle()) {
            this.CallBundleService.getBundle().then((bunldesAvailability: any) => {
                this.model.bundles = bunldesAvailability;
                if(this.model.bundles.bundles.length >= 1) {
                    this.bundelingView = true;
                    const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
                    ancillariesInfo.bundles = bunldesAvailability.bundles;
                    this.localStorageService.set('ancillariesInfo', ancillariesInfo);
                }
            });
        }
    }

    private shouldCallBundle () {
        const rules : (() => boolean)[] = [ () => {return this.$rootScope.isRedemptionFlow;}, ()=> this.localStorageService.get('flowApp') === 'MMBOH' ];
        return !rules.some((rule) => rule() === true);
    }

    /**
    * Go to payments page
    */
    goToPayments = (): void => {
        if (this.model.selectedInsurance && this.model.insuranceForm) {
            this.model.insuranceForm.$submitted = true;
            if (this.model.insuranceForm.$valid) {
                if (this.model.insuranceInfo.policyHolder) {
                    this.model.selectedInsurance.passengerInfo = this.model.insuranceInfo.passengers;
                } else if (this.model.insuranceInfo.insuranceCountry.country.code === 'IT') {
                    const passengerInfo: any = this.localStorageService.get('selectedInsurance');
                    this.model.selectedInsurance.passengerInfo = passengerInfo.passengerInfo;
                }
                this.DatalayerUtils.setInsuranceEcommerce(this.model.selectedInsurance, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
                this.DatalayerUtilsService.setAncillariesDatalayer();
                this.AncillariesService.generateRequestAncillaries(this.model.selectedInsurance);
            } else {
                const errorScroll = angular.element('[name="' + this.model.insuranceForm.$name + '"]').find('.ng-invalid:visible:first').offset().top - angular.element('.ib-header-common--full-container').innerHeight();
                angular.element('html,body').animate({ scrollTop: errorScroll }, 'slow');
            }
        } else {
            this.AncillariesService.generateRequestAncillaries(null);
        }
    };

    /**
     * Open modal of Cuba conditions
     */
    openInsuranceInfoCubaModal = (evt, infoModal: any): void => {
        this.ModalServiceAncillaries.openInsuranceInfoCubaModal(infoModal);
    };

    /**
    * Delete baggages of segment selected on basket and update quanty on model
    * @param {*} evt
    * @param {*} segmentId
    * @param {*} baggageTypeSelected
    */
    deleteBaggages = (evt: any, segmentId: any, baggageTypeSelected: any): void => {
        let passengerTemp, model, deleteInfo = null;
        this.model.passengerBaggagesTrips.forEach((passenger) => {
            passengerTemp = passenger;
            passenger.trips.forEach((trip) => {
                if (trip.id === segmentId) {
                    trip.pieces.forEach((piece) => {
                        if (piece.subtype === baggageTypeSelected) {
                            this.model.baggagesQuanty -= piece.quantySelected;
                            trip.piecesChoosed -= piece.quantySelected;
                            piece.quantySelected = 0;
                            model = passengerTemp;
                        }
                    });
                }
            });
        });
        this.model.baggagesQuanty = this.AncillariesService.countBaggageTotal(this.model.passengerBaggagesTrips);
        this.AncillariesTemporalUtilsService.calculatePiecesBaggageTrip(this.model.passengerBaggagesTrips);
        deleteInfo = this.AncillariesTransformer.buildDeleteOneAncillariesBaggageRequest(model, 'BAGGAGE', baggageTypeSelected, segmentId, this.localStorageService.get('passengerBaggagesTrips'));
        this.AncillariesService.deleteAviosAncillaries(segmentId, this.BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE, baggageTypeSelected);
        if (deleteInfo?.[0].slices[0].passengers[0].id && this.localStorageService.get('actualStepFlow') !== 'ibpurc') {
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
                this.ModalServiceAncillaries.isNotWaiting();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error).result.finally(() => {{}});
            });
        }
        this.saveBaggagesTrips();
    };

    /**
    * Save baggages trips info on local storage
    */
    saveBaggagesTrips = (): void => {
        this.localStorageService.set('passengerBaggagesTrips', this.model.passengerBaggagesTrips);
    };

    /**
    * Save speqs trips info on local storage
    */
    saveSpeqsTrips = (): void => {
        this.localStorageService.set('passengerSpeqsTrips', this.model.passengerSpeqsTrips);
    };

    /**
    * Delete seats of segment selected on basket and update quanty on model
    * @param {*} evt
    * @param {*} dataSeat Amount of seats deleted
    */
    deleteSeats = (evt: any, dataSeat: any): void => {
        let updateSeatsInfo = [];
        this.model.seatsQuanty -= dataSeat.amount;
        const idDeleteSegment = dataSeat?.seats[0]?.segments[0].id || null;
        updateSeatsInfo = this.AncillariesService.getUpdateSeatInfo(dataSeat);
        this.AncillariesService.updateSeatInformation(this.model.ancillariesTrips, updateSeatsInfo);
        this.AncillariesTemporalUtilsService.updateSeatsCachedInfo(updateSeatsInfo);
        if (this.model.seatsQuanty === 0) {
            const summaryInfo: any = this.localStorageService.get('summaryInfo');
            this.model.seatsQuanty = this.AncillariesTransformer.countSeatsTotal(summaryInfo.issuedItems);
            this.modifyPendingSeat(null, null);
        }
        this.NewSeatsMapService.updateNewSeatmapDeleteSeat(idDeleteSegment, dataSeat?.seats[0]?.segments[0].passengers);
    };

    /**
    * Delete speq of segment selected on basket and update quanty on model
    * @param {*} evt
    * @param {*} segmentId
    * @param {*} speqTypeSelected
    */
    deleteSpeqs = (evt: any, segmentId: any, speqTypeSelected: any): void => {
        let passengerTemp, model, deleteInfo = null;
        this.model.passengerSpeqsTrips.forEach((passenger) => {
            passengerTemp = passenger;
            passenger.trips.forEach((trip) => {
                if (trip.id === segmentId) {
                    trip.pieces.forEach((piece) => {
                        if (piece.subtype === speqTypeSelected) {
                            this.model.speqsQuanty -= piece.quantySelected;
                            trip.speqsChoosed -= piece.quantySelected;
                            piece.quantySelected = 0;
                            model = passengerTemp;
                        }
                    });
                }
            });
        });
        this.model.speqsQuanty = this.AncillariesService.countSpeqsTotal(this.model.passengerSpeqsTrips);
        this.AncillariesTemporalUtilsService.calculatePiecesSpeqsTrip(this.model.passengerSpeqsTrips);
        deleteInfo = this.AncillariesTransformer.buildDeleteOneAncillariesBaggageRequest(model, 'SPECIAL_EQUIPMENT', speqTypeSelected, segmentId, this.localStorageService.get('passengerSpeqsTrips'));
        this.AncillariesService.deleteAviosAncillaries(segmentId, this.BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS, speqTypeSelected);
        if (deleteInfo?.[0].slices[0].passengers[0].id && this.localStorageService.get('actualStepFlow') !== 'ibpurc') {
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
                this.ModalServiceAncillaries.isNotWaiting();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error).result.finally(() => {{}});
            });
        }
        this.saveSpeqsTrips();
    };

    deleteCarbonFootprintAncillary = (evt?: any): Promise<void> => {
        return this.AncillariesService.deleteCarbonFootprint().then(() => {
            this.cleanCarbonFootprintAncillary();
            this.AncillariesService.deleteCarbonFootprintFromBasket();
        }, angular.noop);
    };

    cleanCarbonFootprintAncillary = (evt?: any): void => {
        this.model.ancillariesCarbonFootprint.confirmed = false;
    };

    /**
    * Update total price
    * @param {Object} evt
    * @param {String} total Total price of basket formatted with currency of ancillaries
    */
    updateTotalBasket = (evt: any, total: any): void => {
        this.model.totalPayment = total;
    };


    /**
    * Open seat map modal
    * @param {*} evt
    * @param {String} segmentId Id of segment to open seat map
    */
    openSeatMap = (evt: any, segmentId: any): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const segmentSeat = this.localStorageService.get('seatsAvailableSegments');
        const segmentAncillaries = this.localStorageService.get('ancillariesAvailableSegments');
        const segment = segmentSeat ? segmentSeat[0] : segmentAncillaries[0];
        this.closeCollapseHeader();
        this.localStorageService.set('ancillariesAction', 'click');
        this.AncillariesTemporalUtilsService.setSegmentInfo({
            segmentId: segmentId ? segmentId : segment,
            pasId: this.localStorageService.get('passengersSelected')[0]
        });
        this.ModalServiceAncillaries.openSeatNewMapModal({ seatMapInfo: this.model }).result.then(() => {
            this.checkQuantitySeat();
            this.DatalayerUtilsService.setAncillariesDatalayer();
        }, () => {
            this.updateDatalayer();
        });
    };

    checkQuantitySeat = (): any => {
        let index, total = 0;
        const headerModel: any = this.localStorageService.get('headerModel');
        const seatModel: any = headerModel.shoppingBasket ? headerModel.shoppingBasket.seats : headerModel.headerModel.shoppingBasket.seats;
        if (seatModel.hasSeats) {
            total = 0;
            for (index = 0; index < seatModel.segments.length; index++) {
                total += seatModel.segments[index].quanty;
            }
        }

        this.model.seatsQuanty = total;
        this.localStorageService.set('seatsQuanty', this.model.seatsQuanty);
        // this.AncillariesTemporalUtilsService.removeSeatInfoConfirmation();
        return total;
    };

    /**
    * Open baggages modal
    */
    openBaggages = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const copyPassengerBaggagesTrips = angular.copy(this.model.passengerBaggagesTrips);
        this.closeCollapseHeader();
        this.localStorageService.set('ancillariesAction', 'click');
        this.ModalServiceAncillaries.openBaggagesModal({ passengers: copyPassengerBaggagesTrips, isCurrencyLong: this.model.isCurrencyLong }).result.then(
            () => this.handleBaggagesModalSuccess(copyPassengerBaggagesTrips),
            this.handleBaggagesModalError
        );
    };

    handleBaggagesModalSuccess = async (copyPassengerBaggagesTrips): Promise<void> => {
        this.model.passengerBaggagesTrips = copyPassengerBaggagesTrips;
        this.baggagesTemp = this.localStorageService.get('passengerBaggagesTrips');
        this.saveBaggagesTrips();
        const updateOk = await this.updateBaggages();
        if (updateOk) {
            this.model.baggagesQuanty = this.AncillariesService.calculateTotalBaggages(this.model.passengerBaggagesTrips);
            this.$rootScope.$broadcast('updateHeaderBaggages', this.model.passengerBaggagesTrips);
            this.localStorageService.set('ancillariesAction', 'addtocart');
            this.updateDatalayer();
            this.DatalayerUtilsService.setAncillariesDatalayer();
        }
    };

    handleBaggagesModalError = (): void => {
        this.updateDatalayer();
        this.DatalayerUtilsService.setAncillariesDatalayer();
    };

    updateBaggages = async (): Promise<boolean> => {
        let haveBaggage = false;
        const baggages = this.localStorageService.get('passengerBaggagesTrips');
        const deleteInfoArray = [];
        const infoBaggages = this.AncillariesTransformer.buildAncillariesRequest(baggages, null, null);

        angular.forEach(baggages, (baggage) => {
            angular.forEach(baggage.trips, (trip) => {
                if (trip.piecesChoosed > 0) {
                    haveBaggage = true;
                }
            });
        });

        if (haveBaggage) {
            return await this.handleBaggageUpdate(infoBaggages);
        } else {
            return await this.handleBaggageDeletion(deleteInfoArray);
        }
    };

    handleBaggageUpdate = async (infoBaggages): Promise<boolean> => {
        let updateOk = false;
        this.ModalServiceAncillaries.showWaitingModal();
        try {
            await this.CommonsAncillariesService.updateAncillaries(infoBaggages);
            updateOk = true;
            this.updateDatalayer();
            this.ModalServiceAncillaries.isNotWaiting();
        } catch (error) {
            this.handleError(error);
        }
        return updateOk;
    };

    handleBaggageDeletion = async (deleteInfoArray): Promise<boolean> => {
        let deleteInfo, updateOk = false;
        angular.forEach(this.baggagesTemp, (data) => {
            deleteInfo = this.AncillariesTransformer.buildDeleteAllAncillariesBaggageRequest(data, 'BAGGAGE', this.baggagesTemp);
            if (deleteInfo.length > 0) {
                deleteInfoArray.push(deleteInfo);
            }
        });

        deleteInfo = deleteInfoArray.length > 1
            ? this.AncillariesTransformer.mergePassengerItemsForDelete(deleteInfoArray)
            : deleteInfoArray[0];

        if (deleteInfo && deleteInfo.length > 0) {
            this.ModalServiceAncillaries.showWaitingModal();
            try {
                await this.CommonsAncillariesService.deleteAncillarie(deleteInfo);
                updateOk = true;
                this.ModalServiceAncillaries.isNotWaiting();
            } catch (error) {
                this.handleError(error);
            }
        }
        return updateOk;
    };

    handleError = (error): void => {
        this.updateDatalayer();
        this.ModalServiceAncillaries.isNotWaiting();
        this.ModalServiceAncillaries.showGenericError(error).result.finally(() => {});
    };

    /**
    * Open flexibilization modal
    */
    openFlexibilization = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        this.closeCollapseHeader();
        this.ModalServiceAncillaries.openFlexibilizationModal({ model: this.model.ancillariesFlexibilization }).result.then(() => {
            this.localStorageService.set('ancillariesAction', 'addtocart');
            this.DatalayerUtilsService.setAncillariesDatalayer();
        }, () =>{
            this.DatalayerUtilsService.setAncillariesDatalayer();
        });
    };

    cleanFlexibilization = (): void => {
        if (this.model.ancillariesFlexibilization.selectedFlex) {
            this.AncillariesService.deleteAviosAncillaries(
                null,
                this.BookingAncillariesConstant.TYPE_ANCILLARIE.FLEXIBILITY,
                this.model.ancillariesFlexibilization.selectedFlex.subtype
            );
            this.model.ancillariesFlexibilization.selectedFlex = null;
            this.localStorageService.set('selectedFlex', this.model.ancillariesFlexibilization.selectedFlex);
            this.model.ancillariesFlexibilization.confirmed = false;
        }
    };

    openPriorityBoarding = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        this.closeCollapseHeader();
        this.localStorageService.set('ancillariesAction', 'click');
        this.$rootScope.$broadcast( 'updateDigitalData' );
        if ( this.AncillariesTemporalUtilsService.isBookingFlow() ) {
            this.DatalayerUtilsService.setProcessAndStep(
                this.DigitalDataUtilsService.getProcess(), 
                null, 
                this.CommonsConstants.QUADRIGAM.MODAL_SELECT_PRIO
            );
        }
        this.ModalServiceAncillaries.openPriorityBoardingModal({ model: this.model.ancillariesPriorityBoarding }).result.then(() => {
            this.localStorageService.set('ancillariesAction', 'addtocart');
            this.updateDatalayer();
        }, () => {
            this.updateDatalayer();
        });
    };

    cleanPriorityBoarding = (): void => {
        this.localStorageService.set('selectedPriorityBoarding', null);
        this.localStorageService.set('totalPricePriorityBoarding', 0);
        this.model.ancillariesPriorityBoarding.confirmed = false;
    };

    /**
     * Open seat map modal of segement received of modal confirmation
     * @param {Object} evt
     * @param {Integer} segmentId Id of segment
     */
    modifySeatMap = (evt: any, segmentId: any, skipSummaryMobile: boolean): void => {
        this.closeCollapseHeader();
        this.AncillariesTemporalUtilsService.setSegmentInfo({ segmentId: segmentId, pasId: this.localStorageService.get('passengersSelected')[0] });
        this.openSeatMap(null, segmentId);
    };

    /**
     * Open seat map modal of segement received of modal confirmation
     */
    modifyPendingSeat = (evt, infoSeatMap): void => {
        this.model.pendingSeats = false;
    };

    /**
    * Open modal for select new country for insurance
    * @desc Open insurane modal for select new country and complete information
    */
    openChangeResidenceCountry = (): void => {
        this.closeCollapseHeader();
        let insurance = this.localStorageService.get('insuranceSelected') || this.model.insuranceInfo;        
        this.ModalServiceAncillaries.openInsuranceModal({ insurance: this.model.insuranceInfo, insuranceInfo: insurance, ancillariesInsurance: this.model.ancillariesInsurance }, 'ib-insurance-change-country-modal-view.html').result.finally(() => {});
    };

    /**
    * Open insurance modal for select the insurance
    */
    openInsuranceModal = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const insuranceModel = {... this.model};
        this.closeCollapseHeader();
        this.ModalServiceAncillaries.openInsuranceModal({ insuranceInfo: insuranceModel, isCurrencyLong: this.model.isCurrencyLong }, 'ib-modal-insurance.html').result.finally(() => {
            this.updateDatalayer();
        });
    };

    /**
    * Open insurance modal for select the insurance
    */
    openBobModal = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const bobModal = {... this.model};
        this.closeCollapseHeader();
        this.ModalServiceAncillaries.openBobModal(bobModal, 'ib-bob-modal-view.html').result.finally(() => {
            this.updateDatalayer();
        });
    };

    /**
    * Update model of insurance with new insurance selected and check if form is completed. If not is completed all required fields then
    * open modal for complete.
    * @param {Object} Insurance Model of insurance selected
    */
    selectInsurance = (evt, insurance: any): void => {
        this.model.selectedInsurance = insurance;
        if (this.model.selectedInsurance) {
            if (this.model.insuranceInfo.insuranceCountry.passengerRequiredFields.length > 0 && !this.checkStatusInsurancePassengers()) {
                this.openChangeResidenceCountry();
                this.model.insuranceInfo.passengers.forEach((pas) => {
                    pas.isComplete = false;
                });
            }
            this.changeStatusPassToFalse();
            this.$rootScope.$broadcast('displayCheckConditions', this.model.selectedInsurance);
        } else {
            this.$rootScope.$broadcast('displayCheckConditions', this.model.selectedInsurance);
        }
        this.$rootScope.$broadcast('updateHeaderInsurance', this.model.selectedInsurance);
    };

    /**
    * Change the model of insurance for first insurance
    * @desc Revert changes on insurance
    */
    cancelChangesInsurance = (): void => {
        const status = this.localStorageService.get('selectInsurance');
        if (status) {
            // this.model.selectedInsurance = this.model.ancillariesInsurance[0];
            this.localStorageService.set('saveSelectedInsurance', false);
        }
        this.model.insuranceInfo.insuranceCountry = this.model.insuranceInfo.oldInsuranceCountry;
        this.$rootScope.$broadcast('changeInsuranceCountry', this.model.insuranceInfo.oldInsuranceCountry.country);
        if (this.model.insuranceInfo.policyHolder) {
            this.model.insuranceInfo.policyHolder = null;
            this.model.insuranceInfo.birthDateDay = null;
            this.model.insuranceInfo.birthDateMonth = null;
            this.model.insuranceInfo.birthDateYear = null;
            this.model.insuranceInfo.passengerDocument = null;
            this.localStorageService.remove('birthDate');
        }
        this.$scope.$broadcast('deleteInsurance');
        this.$rootScope.$broadcast('updateHeaderInsurance', null);
        if (!status) {
            this.$scope.$broadcast('deleteInsurance');
            this.$rootScope.$broadcast('updateHeaderInsurance', null);
        }
        this.changeStatusPassToFalse();
    };

    /**
    * Change the passager status
    *  change passenger to status inclomplete
    */
    changeStatusPassToFalse = (): void => {
        angular.forEach(this.model.insuranceInfo.passengers, (pas) => {
            pas.isComplete = false;
        });
    };

    /**
    * Check status of passenger
    * @returns {BOOL}
    * @desc Check if information of all passenger are completed
    */
    checkStatusInsurancePassengers = (): any => {
        let allCompleted = true;
        angular.forEach(this.model.insuranceInfo.passengers, (pas) => {
            if (!pas.isComplete) {
                allCompleted = false;
            }
        });
        return allCompleted;
    };

    /**
    * Event of modal-insurance. Call service of ancillaries for get new
    * info of insurance with country selected
    * @param {Object} evt
    * @param {Object} country
    * @desc Call service for get new conditions of insurance on country selected.
    */
    changeInsuranceCountry = (evt: any, country: any): void => {
        let price, i, ancillariesInsuranceInfo: any = {};
        this.closeCollapseHeader();
        this.model.insuranceInfo.isModalLoading = true;

        const clearSelectedInsuranceValues = () => {
            angular.forEach(this.model.insuranceInfo.passengers, (pas) => {
                delete pas.document;
                delete pas.birthDate;
            });
        };

        this.CallAncillariesService.getInsurance(country.code).then((response: any) => {
            if (response.ancillaries[0].offers?.length > 0 && response.ancillaries[0].status.code === this.BookingAncillariesConstant.GENERAL_STATUS.AVAILABLE) {
                this.model.newSelectedIndurancePerCountry = response.ancillaries[0];
                this.model.ancillariesInsurance = [];
                for (i = 0; i < response.ancillaries[0].offers.length; i++) {
                    ancillariesInsuranceInfo = {};
                    price = this.AncillariesService.getPriceOfferInsurance(this.model.currency, response.ancillaries[0].offers[i]);
                    ancillariesInsuranceInfo.descriptionCoverages = response.ancillaries[0].offers[i].coverages;
                    ancillariesInsuranceInfo.name = response.ancillaries[0].offers[i].name;
                    ancillariesInsuranceInfo.price = price.currencyPrice;
                    ancillariesInsuranceInfo.originalPrice = price.originalPrice;
                    ancillariesInsuranceInfo.consent = response.ancillaries[0].offers[i].consent;
                    ancillariesInsuranceInfo.code = response.ancillaries[0].offers[i].code;
                    ancillariesInsuranceInfo.id = response.ancillaries[0].offers[i].code;
                    ancillariesInsuranceInfo.provider = response.ancillaries[0].provider;
                    ancillariesInsuranceInfo.termsAndConditionsDocumentURI = response.ancillaries[0].offers[i].termsAndConditionsDocumentURI;
                    ancillariesInsuranceInfo.addOns = response.ancillaries[0].offers[i].addOns;
                    ancillariesInsuranceInfo.issueCountry = response.ancillaries[0].issueCountry;
                    if (response.ancillaries[0].offers[i].compliance !== null) {
                        ancillariesInsuranceInfo.compliance = createComplianceModel(response.ancillaries[0].offers[i].compliance);
                    }
                    this.model.ancillariesInsurance.push(ancillariesInsuranceInfo);
                    this.model.insuranceInfo.isModalLoading = false;
                }
                clearSelectedInsuranceValues();
                if (this.localStorageService.get('saveSelectedInsurance')) {
                    this.model.selectedInsurance = this.model.ancillariesInsurance[0];
                    this.$rootScope.$broadcast('setSelectedInsurance', this.model.ancillariesInsurance[0]);
                    this.localStorageService.set('selectInsurance', true);
                }
            } else {
                this.model.insuranceInfo.isModalLoading = false;
                this.model.insuranceInfo.insuranceCountry = this.model.insuranceInfo.oldInsuranceCountry;
                this.ModalServiceAncillaries.showGenericModal({ message: 'CKIANC_INSURANCE_WARNING_MODAL_INSURANCE_TEXT', needsTranslate: true, idModal: this.BookingAncillariesConstant.DATALAYER_MODAL_ID.INSURANCE_NOT_AVAILABLE }, true, null);
            }
        }, (error) => {
            this.model.insuranceInfo.isModalLoading = false;
            this.ModalServiceAncillaries.showGenericError(error).result.finally(()=>{});
        });


        function createComplianceModel (complianceInfo) {
            const infoModal = complianceInfo.informativeMessage.split('<br />');
            infoModal[2] = infoModal[2].replace('</p>', '');
            infoModal[0] = infoModal[0].replace('<p><strong>', '');
            infoModal[0] = infoModal[0].replace('</strong>', '');
            complianceInfo.informativeMessage = infoModal;
            const insuranceTax = complianceInfo.premiumSplitProvision.split('<br />');
            insuranceTax[0] = insuranceTax[0].replace('<p>', '');
            insuranceTax[1] = insuranceTax[1].replace('-', '');
            insuranceTax[2] = insuranceTax[2].replace('-', '');
            insuranceTax[2] = insuranceTax[2].replace('&nbsp;</p>', '');
            complianceInfo.premiumSplitProvision = insuranceTax;
            return complianceInfo;
        }
    };

    /**
    * Update insurance information with new selected
    * @desc Update the values of insurance with infrmation of new insurance selected for
    * update information showed to user
    */
    updateInsurance = (): void => {
        this.localStorageService.set('ancillariesAction', 'addtocart');
        this.model.insuranceInfo.countryInsurance = this.model.insuranceInfo.insuranceCountry.country.description;
        if (this.model.newSelectedIndurancePerCountry) {
            this.model.newSelectedIndurancePerCountry.issueCountry = this.model.insuranceInfo.insuranceCountry.country.code;
        }
        this.model.insuranceInfo.oldInsuranceCountry = this.model.insuranceInfo.insuranceCountry;
        this.model.insuranceInfo.passengers.forEach((pas) => {
            pas.isComplete = true;
        });

        this.changeAncillariesInfoInsurance();
    };

    changeAncillariesInfoInsurance = (): void => {
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');

        ancillariesInfo.ancillaries.forEach((ancillarie, index) => {
            if (ancillarie.type === this.BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE) {
                ancillariesInfo.ancillaries[index] = this.model.newSelectedIndurancePerCountry ? this.model.newSelectedIndurancePerCountry : ancillariesInfo.ancillaries[index];
            }
        });
        this.localStorageService.set('ancillariesInfo', ancillariesInfo);
    };

    /**
    * Emmits event for close collapse of header
    */
    closeCollapseHeader = (): void => {
        this.$rootScope.$broadcast('closeCollapseHeader');
    };

    /**
    * Open speqs modal
    */
    openSpeqs = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        this.localStorageService.set('ancillariesAction', 'click');
        const copyPassengersSpeqsTrips = angular.copy(this.model.passengerSpeqsTrips);
        this.closeCollapseHeader();

        this.ModalServiceAncillaries.openSpeqsModal({
            passengers: copyPassengersSpeqsTrips,
            quantySelected: this.model.speqsQuanty,
            isCurrencyLong: this.model.isCurrencyLong
        }).result.then(
            () => this.handleSpeqsModalSuccess(copyPassengersSpeqsTrips),
            ()=> this.updateDatalayer()
        );
    };

    handleSpeqsModalSuccess = (copyPassengersSpeqsTrips: any): void => {
        this.model.passengerSpeqsTrips = copyPassengersSpeqsTrips;
        this.speqsTemp = this.localStorageService.get('passengerSpeqsTrips');
        this.saveSpeqsTrips();

        const updateOk = this.updateSpeqs();
        if (updateOk) {
            this.model.speqsQuanty = this.AncillariesService.calculateTotalSpeqs(this.model.passengerSpeqsTrips);
            this.$rootScope.$broadcast('updateHeaderSpeqs', [...this.model.passengerSpeqsTrips]);
            this.DatalayerUtilsService.setAncillariesDatalayer();
            this.updateDatalayer();
        }
    };

    updateSpeqs = async (): Promise<boolean> => {
        let updateOk = false;

        const speqs: any = this.localStorageService.get('passengerSpeqsTrips');
        const haveSpeq = speqs.some(speq => speq.trips.some(trip => trip.speqsChoosed > 0));

        if (haveSpeq) {
            updateOk = await this.updateSpeqsInfo(speqs);
        } else {
            const deleteInfo = this.buildDeleteInfo();
            if (deleteInfo && deleteInfo.length > 0) {
                updateOk = this.deleteInfoSpeqs(deleteInfo);
            }
        }

        return updateOk;
    };



    /**
     * Actualiza la información de los "speqs".
     * @param speqs - Lista de "speqs" a actualizar.
     * @returns {boolean} - Verdadero si la actualización fue exitosa.
     */
    updateSpeqsInfo = async (speqs: any[]): Promise<boolean> => {
        let updateOk = false;
        this.ModalServiceAncillaries.showWaitingModal();
        const infoSpeqs = this.AncillariesTransformer.buildAncillariesRequest(null, speqs, null);
        try {
            await this.CommonsAncillariesService.updateAncillaries(infoSpeqs);
            updateOk = true;
            this.updateDatalayer();
            this.ModalServiceAncillaries.isNotWaiting();
        } catch (error) {
            this.handleError(error);
        }
        return updateOk;
    };

    /**
     * Construye la información necesaria para eliminar los "speqs".
     * @returns {any[]} - Información de eliminación de "speqs".
     */
    buildDeleteInfo (): any[] {
        const deleteInfoArray = [];

        angular.forEach(this.speqsTemp, (data) => {
            const deleteInfo = this.AncillariesTransformer.buildDeleteAllAncillariesBaggageRequest(data, 'SPECIAL_EQUIPMENT', this.speqsTemp);
            if (deleteInfo.length > 0) {
                deleteInfoArray.push(deleteInfo);
            }
        });

        if (deleteInfoArray.length > 1) {
            return this.AncillariesTransformer.mergePassengerItemsForDelete(deleteInfoArray);
        }

        return deleteInfoArray[0];
    }

    /**
 * Elimina los "speqs" utilizando la información proporcionada.
 * @param deleteInfo - Información necesaria para realizar la eliminación.
 * @returns {boolean} - Verdadero si la eliminación fue exitosa.
 */
    deleteInfoSpeqs (deleteInfo: any[]): boolean {
        let updateOk = false;

        this.ModalServiceAncillaries.showWaitingModal();

        this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then(
            () => {
                updateOk = true;
                this.ModalServiceAncillaries.isNotWaiting();
            },
            (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error).result.finally(()=>{});
            }
        );

        return updateOk;
    }

    goPaymentTransfers = (evt): void => {
        const widgetVersion = '2.3.6';
        const baseUrl = (window as any).env?.urlEnvironment;
        const urlTransfers = `${baseUrl}iberia-web-content/build-recoglobick-transfers/${widgetVersion}`;

        const scripts = [
            `${urlTransfers}/static/js/2.vendor.chunk.js`,
            `${urlTransfers}/static/js/main.chunk.js`,
            `${urlTransfers}/static/js/runtime-main.js`
        ];
        const cssLink = `${urlTransfers}/static/css/main.chunk.css`;

        // Eliminar recursos existentes
        [...scripts, cssLink].forEach(resource => {
            const selector = resource.includes('.js') ? `script[src="${resource}"]` : `link[href="${resource}"]`;
            const existingElement = document.querySelector(selector);
            if (existingElement) {
                existingElement.remove();
            }
        });

        delete this.$window['webpackJsonprecoglobick-transfers'];
    };

    openCarbonFootprintModal = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const carbonFootprintModal = this.model.ancillariesCarbonFootprint;
        this.closeCollapseHeader();
        this.ModalServiceAncillaries.openCarbonFootprintModal(carbonFootprintModal, 'ib-carbon-footprint-modal-view.html');
    };

    openInsuranceInfoModal = (evt, infoModal: any): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        this.ModalServiceAncillaries.openInsuranceInfoModal(infoModal);
    };

    openTransfersModal = (evt, infoModal: any): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        this.ModalServiceAncillaries.openTransfersModal(infoModal);
    };

    openTransfersModifyModal = (evt): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        this.ModalServiceAncillaries.openTransfersModifyModal();
    };

    deleteGlobickTransfers = (evt): void => {
        const info = this.AncillariesService.deleteGlobickTransfers();
        this.CommonsSessionStorageService.set('removeGlobickTransfers', info);
        this.$rootScope.$broadcast('setDisconfirmed');
    };

    openOnholdLightBox = (event: any): void => {
        this.modelLightBox = {
            title: 'ONHOLD_OPTION_TITLE',
            subtitle: this.CommonsUtilService.fiterTextOptionOnhold().modalText,
            text: 'ONHOLD_OPTION_TEXT_ANC'
        };

        if (this.CommonsUtilService.isAvailableLightBox()) {
            this.localStorageService.set('OnholdLightBoxShowed', true);
            this.showOnHoldNotice = true;
        }
    };

    closeOnholdLightBox = (event: any, show: any): void => {
        this.showOnHoldNotice = show;
    };

    updateDatalayer  (isActivate?:boolean): void  {
        const confirmationDigitalInfo = this.localStorageService.get('confirmationDigitalInfo') || {};
        this.quadrigamStatus = this.AncillariesTemporalUtilsService.checkEarlyFlights(this.localStorageService.get('bookingInfo'), this.localStorageService.get('ancillariesAvailableSegments'));
        this.quadrigamStatus ? this.typeQuadrigam = this.BookingAncillariesConstant.QUADRIGAM.EARLY_ANCILLARIES : this.typeQuadrigam = this.BookingAncillariesConstant.QUADRIGAM.ANCILLARIES;
        const isHMAD = this.localStorageService.get('isHMAD');
        const isMulti = this.localStorageService.get('multiCitySearch');
        this.typeQuadrigam = this.BookingAncillariesConstant.QUADRIGAM.ANCILLARIES_BKI;
        if(isMulti && !isHMAD) {
            this.typeQuadrigam = this.BookingAncillariesConstant.QUADRIGAM.ANCILLARIES_BKI_MULTI;
        }else if(isHMAD) {
            this.typeQuadrigam = this.BookingAncillariesConstant.QUADRIGAM.ANCILLARIES_BKI_HMAD;
        } else if(this.$rootScope.isRedemptionFlow) {
            this.typeQuadrigam = this.BookingAncillariesConstant.QUADRIGAM.ANCILLARIES_BKI_REDEMPTION;
        }
        if (isActivate) {
            this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam(this.typeQuadrigam, confirmationDigitalInfo);
            this.MonetateUtilsService.updateMonetateWithQuadrigam(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, this.typeQuadrigam);
            this.DatalayerUtilsService.addDigitalDataInfo({Step: this.DatalayerConstants.DATALAYER_ANCILLARIES.ANCILLARIES});
            this.$timeout(() => {
                this.$rootScope.$broadcast('sendUpdateToMonetate');
            });

            this.$rootScope.$broadcast('updateDatalayer');
            this.$rootScope.$broadcast('updateDigitalData');
        }
    }

    checkPrioAndFlex = (evt, infoModal: any): void => {
        const headerModel: any = this.localStorageService.get('headerModel');
        const deleteFlexInfo = [{
            type: this.BookingAncillariesConstant.TYPE_ANCILLARIE.FLEXIBILITY
        }];
        if (headerModel.headerModel && headerModel.headerModel.shoppingBasket) {
            if (headerModel.headerModel.shoppingBasket.priorityBoarding.hasPriorityBoarding) {
                const selectedPriorityBoarding = this.localStorageService.get('prioritySegmentPutRequest');
                const deletePriority = [];
                this.ModalServiceAncillaries.showWaitingModal();
                const deletePriorityInfo = createDeleteInfo(selectedPriorityBoarding);
                deletePriority.push(deletePriorityInfo);
                this.localStorageService.set('deletePriority', deletePriority);
                this.CommonsAncillariesService.deleteAncillarie(deletePriority).then(() => {
                    this.$rootScope.$broadcast('updatedPriorityInfoModel', deletePriority);
                    this.localStorageService.remove('deletePriority');
                    this.cleanPriorityBoarding();
                    this.NewMainHeaderFacade.updateBasketPriority('');
                    this.$rootScope.$broadcast('basketUpdateCommonHeader');
                    this.ModalServiceAncillaries.isNotWaiting();
                }, (error) => {
                    this.ModalServiceAncillaries.isNotWaiting();
                    this.ModalServiceAncillaries.showGenericError(error).result.finally(()=>{});
                });
            }
            if (headerModel.headerModel.shoppingBasket.flexibilization.hasFlexibilization) {
                this.ModalServiceAncillaries.showWaitingModal();
                this.CommonsAncillariesService.deleteAncillarie(deleteFlexInfo).then((data) => {
                    this.localStorageService.remove('selectedFlex');
                    this.NewMainHeaderFacade.updateBasketFlexibilization('');
                    this.$rootScope.$broadcast('basketUpdateCommonHeader');
                    this.ModalServiceAncillaries.isNotWaiting();
                }, (error) => {
                    this.ModalServiceAncillaries.isNotWaiting();
                    this.ModalServiceAncillaries.showGenericError(error).result.finally(()=>{});
                });
            }
        }

        function createDeleteInfo (selectedPriorityBoarding) {
            let i, j, segmentsInfo = {id: '', passengerIds: []};
            const deleteStructure = {
                type: 'PRIORITY_BOARDING',
                segments: []
            };
            for (i = 0; i < selectedPriorityBoarding.length; i++) {
                segmentsInfo.id = selectedPriorityBoarding[i].id;
                for (j = 0; j < selectedPriorityBoarding[i].passengerIds.length; j++) {
                    segmentsInfo.passengerIds.push(selectedPriorityBoarding[i].passengerIds[j]);
                }
                deleteStructure.segments.push(segmentsInfo);
                segmentsInfo = {id: '', passengerIds: []};
            }
            return deleteStructure;
        }
    };

    checkBaggages = (): void => {
        let bundleSelected = false;
        let baggageItem;
        this.model.bundles.bundles.forEach(bundle => {
            if(bundle.selected) {
                bundleSelected = true;
                bundle.items.forEach(item => {
                    if(item.type === 'BAGGAGE') {
                        baggageItem = item;
                    }
                });
            }
        });
        this.model.passengerBaggagesTrips.forEach(passenger => {
            passenger.trips.forEach(trip => {
                trip.totalPrice = 0;
            });
        });
        if(bundleSelected) {
            this.model.passengerBaggagesTrips.forEach(passenger => {
                passenger.trips.forEach(trip => {
                    if(trip.defaultAditionalPieces - baggageItem.quantityPassAndTrips - trip.piecesChoosed >= 0) {
                        trip.pieces.forEach(piece => {
                            if(piece.quantySelected >= 1) {
                                if(baggageItem.subtype === piece.subtype) {
                                    let numBag = 0;
                                    piece.availablePriceRanges.forEach(range => {
                                        let bundleBaggagesLeft = baggageItem.quantityPassAndTrips;
                                        let numBagsInterval = 1;
                                        const baggageCounter =
                                            (range.to - range.from) + 1;
                                        while (numBagsInterval <= baggageCounter && numBag < piece.quantySelected) {
                                            if(bundleBaggagesLeft > 0) {
                                                bundleBaggagesLeft += -1;
                                            } else {
                                                trip.totalPrice += range.amount;
                                                numBag++;
                                            }
                                            numBagsInterval++;
                                        }
                                    });
                                } else {
                                    piece.availablePriceRanges.forEach(range => {
                                        trip.totalPrice += range.amount * piece.quantySelected;
                                    });
                                }
                            }
                        });
                    }
                });
            });
        } else {
            this.model.passengerBaggagesTrips.forEach(passenger => {
                passenger.trips.forEach(trip => {
                    if(trip.defaultAditionalPieces - trip.piecesChoosed >= 0) {
                        trip.pieces.forEach(piece => {
                            if(piece.quantySelected >= 1) {
                                let numBag = 0;
                                piece.availablePriceRanges.forEach(range => {
                                    let numBagsInterval = 1;
                                    const baggageCounter =
                                        (range.to - range.from) + 1;
                                    while (numBagsInterval <= baggageCounter && numBag < piece.quantySelected) {
                                        trip.totalPrice += range.amount;
                                        numBag++;
                                        numBagsInterval++;
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    };
    checkSpeqs = (): void => {
        let maximumReached = false;
        this.model.passengerSpeqsTrips.forEach(passenger => {
            passenger.trips.forEach(trip => {
                if(trip.defaultAditionalPieces === trip.speqsChoosed) {
                    maximumReached = true;
                }
            });
        });
        if(maximumReached) {
            let speqItem;
            this.model.bundles.bundles.forEach(bundle => {
                if(bundle.selected) {
                    bundle.items.forEach(item => {
                        if(item.type === 'SPECIAL_EQUIPMENT') {
                            speqItem = item;
                        }
                    });
                }
            });
            this.model.passengerSpeqsTrips.forEach(passenger => {
                passenger.trips.forEach(trip => {
                    if(trip.defaultAditionalPieces === trip.speqsChoosed) {
                        let tripSpeqsChoosed = 0;
                        let tripTotalPrice = 0;
                        trip.pieces.forEach(piece => {
                            if(piece.subtype === speqItem.subtype && piece.quantySelected > 0) {
                                piece.quantySelected -= speqItem.quantityPassAndTrips;
                            }
                            tripSpeqsChoosed += piece.quantySelected;
                            tripTotalPrice += piece.quantySelected * piece.availablePriceRanges[0].amount;
                        });
                        trip.speqsChoosed = tripSpeqsChoosed;
                        trip.totalPrice = tripTotalPrice;
                    }
                });
            });
        }
        this.model.passengerSpeqsTrips;
    };

    maxBaggsAlert = () => {
        let showModal = false;
        for(let i = 0; i < this.model.passengerBaggagesTrips.length; i++) {
            for(let j = 0; j < this.model.passengerBaggagesTrips[i].trips.length; j++) {
                if(this.model.passengerBaggagesTrips[i].trips[j].defaultAditionalPieces === this.model.passengerBaggagesTrips[i].trips[j].piecesChoosed) {
                    showModal = true;
                }
            }
        }
        if(showModal) {
            this.CommonsModalService.showGenericModal(
                false,
                'generic-info-modal.html',
                {
                    title: this.$filter('translate')('BUNDLE_MAX_BAGGAGES_TITLE'),
                    message: this.$filter('translate')('BUNDLE_MAX_BAGGAGES_BODY')
                },
                null
            );
        }
    };

    maxSpeqsAlert = () => {
        let showModal = false;

        for(let i = 0; i < this.model.passengerSpeqsTrips.length; i++) {
            for(let j = 0; j < this.model.passengerSpeqsTrips[i].trips.length; j++) {
                if(this.model.passengerSpeqsTrips[i].trips[j].defaultAditionalPieces === this.model.passengerSpeqsTrips[i].trips[j].speqsChoosed) {
                    showModal = true;
                }
            }
        }
        if(showModal) {
            this.CommonsModalService.showGenericModal(
                false,
                'generic-info-modal.html',
                {
                    title: this.$filter('translate')('BUNDLE_MAX_SPEQS_TITLE'),
                    message: this.$filter('translate')('BUNDLE_MAX_SPEQS_BODY')
                },
                null
            );
        }
    };

    onResize = () => {
        this.adaptativeMobileFlow = this.NewMainHeaderFacade.checkAdaptativeMobileFlow();
    };

    removeVoucher = async () => {
        const createOrderData = this.CommonsSessionStorageService.get<any>('createOrderData');
        const orderId = this.flowApp === 'MMBOH' ? this.CommonsSessionStorageService.get<any>('flowId') : createOrderData?.order?.orderId;
        let orderData = null;
        if (this.createOrderVoucherID) {
            orderData = await this.IbBookingCheckVoucherCodeService.deleteVoucherCode(this.createOrderVoucherID, orderId);
            if(orderData.code === 200){
                if(this.flowApp === 'MMBOH'){
                    orderData.data = createOrderData;
                    orderData.data.order.voucherDiscount =  null;
                }
                this.CommonsSessionStorageService.set('createOrderData', orderData.data);
            }
        }
    };

    acceptBuyOnhold = () => {
        this.BookingUtilService.onholdLightBoxAccept();
    };

    private updateLoyaltyEarnInfo = () => {
        const calculatedPoints = this.CommonsSessionStorageService.get<{Avios:number, Elite: number}>(BkiStorageConstants.CALCULATED_POINTS) ?? {Avios: 0, Elite: 0};
        if ( calculatedPoints.Avios !== 0 || calculatedPoints.Elite !== 0) {
            this.loyaltyEarnInfo = {
                avios: calculatedPoints.Avios,
                elitePoints: calculatedPoints.Elite,
                programName : this.CommonsUserUtilsService.isIbZero() ? 'IBZERO' : 'IBPLUS' };
        } else {
            this.loyaltyEarnInfo = null;
        }
    };

    private setAviosAncillaries (): void {
        const flightAviosInfo:any = this.localStorageService.get('flightAviosInfo');
        if (!flightAviosInfo) {
            const fareData:any = this.localStorageService.get('fareData');
            const request = this.BookingAvailabilityTransformer.genCalcAviosFlightReq(fareData);
            this.localStorageService.set('flightAviosInfo', request);
            this.flightAviosInfo = request;
        }
    }
    
    private setPetcModifyButton = (event, showModifyButton: boolean): void => {
        this.model.petc.modifyButton = showModifyButton;
    };

    private setAssistCardModifyButton = (event, showModifyButton: boolean): void => {
        if (this.model.assistCard) {
            this.model.assistCard.modifyButton = showModifyButton;
        }
    };

    $onInit = this.active();
    
    $onDestroy (): void {
        this.$window.removeEventListener('nextStepFlowLegacy', this.goToPaymentEventListener);
        this.$window.removeEventListener('resize', this.onResize);
    }
}
