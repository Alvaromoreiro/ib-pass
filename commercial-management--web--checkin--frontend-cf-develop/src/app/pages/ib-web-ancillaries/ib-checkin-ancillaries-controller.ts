import * as angular from 'angular';
import dayjs from 'dayjs';
import { DatalayerConstantsType } from 'ib-web-commons/dist/app/core/ib-datalayer/ib-datalayer-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerUtils } from '@pages/ib-web-ancillaries/services/ib-datalayer-utils';
import { AncillariesConfigurationService } from '@pages/ib-web-ancillaries/services/ib-web-ancillaries-configuration-service';
import { AncillariesTransformer } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer';
import { CallBundleService } from '@shared/http-services/anc-app/ib-call-bundle-service';
import { MonetateUtilsService } from '@shared/services/ib-monetate/services/ib-monetate-utils';
import { CkiDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { CkiDatalayerConstantsType } from '@src/app/shared/services/ib-datalayer/ib-cki-datalayer-constants';
import { NewSeatsMapService } from 'ib-web-ancillaries/app/features/components/ib-new-seat-map/service/ib-new-seat-map-service';
import { CkiAncillariesUtilsService } from '@pages/ib-web-ancillaries/services/ib-ckeckin-ancillaries-utils';
import { MonetateConstantsType } from '@src/app/shared/services/ib-monetate/ib-monetate-constants';
import { AncillariesModel } from 'ib-web-ancillaries/dist/app/core/models/ancillaries-model';
import { CheckinFlowService } from '@src/app/shared/services/checkin-flow.service';

const controllerInfo = {
    module: 'ib-checkin-ancillaries-module',
    inject: [
        '$scope',
        '$rootScope',
        '$window',
        'AncillariesService',
        'CkiAncillariesUtilsService',
        'localStorageService',
        'ModalServiceAncillaries',
        'CallAncillariesService',
        'CheckinAncillariesConstants',
        '$timeout',
        'CkiDatalayerUtilsService',
        'DatalayerConstants',
        'MonetateUtilsService',
        'MonetateConstants',
        'NewMainHeaderFacade',
        'CurrencyService',
        'AncillariesTransformer',
        'CommonsAncillariesService',
        '$document',
        '$location',
        'CommonsUtilService',
        'CommonsModalService',
        'AncillariesConfigurationService',
        'CkiDatalayerConstants',
        'DatalayerUtils',
        'CommonsConstants',
        'CommonsSessionStorageService',
        'CallBundleService',
        '$filter',
        'NewSeatsMapService',
        'CheckinAppConstants',
        'CheckinFlowService'
    ],
    required: ['ib-checkin-ancillaries-module']
};

export class AncillariesController implements ng.IController {
    public typeQuadrigam: string;
    public baggagesTrips;
    public speqsTrips;
    public seatConfirmationInfo;
    public dirtyResult;
    public result;
    public headerModel;
    public model: AncillariesModel.Model;
    public showOnHoldNotice: boolean;
    public userLogged: boolean;
    public isOnbUserLogged: boolean;
    public flightAviosInfo: boolean;
    public ancillariesInfo: any;
    private baggagesTemp: any;
    private speqsTemp: any;
    private modelLightBox: any;
    private newSeatsMap: any = null;
    private bundelingView: any = false;

    constructor (
        private $scope: angular.IScope,
        private $rootScope: CommonsRootScope,
        private $window: ng.IWindowService,
        private AncillariesService: any,
        private CkiAncillariesUtilsService: CkiAncillariesUtilsService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private ModalServiceAncillaries: any,
        private CallAncillariesService: CallAncillariesService,
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private $timeout: ng.ITimeoutService,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private DatalayerConstants: DatalayerConstantsType,
        private MonetateUtilsService: MonetateUtilsService,
        private MonetateConstants: MonetateConstantsType,
        private NewMainHeaderFacade: any,
        private CurrencyService: CurrencyService,
        private AncillariesTransformer: AncillariesTransformer,
        private CommonsAncillariesService: CommonsAncillariesService,
        private $document: any,
        private $location: ng.ILocationService,
        private CommonsUtilService: CommonsUtilService,
        private CommonsModalService: CommonsModalService,
        private AncillariesConfigurationService: AncillariesConfigurationService,
        private CkiDatalayerConstants: CkiDatalayerConstantsType,
        private DatalayerUtils: DatalayerUtils,
        private CommonsConstants: CommonsConstantsType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CallBundleService: CallBundleService,
        private $filter: angular.IFilterService,
        private NewSeatsMapService: NewSeatsMapService,
        private CheckinAppConstants: CheckinAppConstants,
        private CheckinFlowService: CheckinFlowService
    ) {
        this.registerScopeListeners();
        this.registerRootScopeListeners();
        this.registerDocumentListeners();
        this.initializeUserState();
        this.loadAncillariesInfo();
    }

    private loadAncillariesInfo = (): void => {
        this.ancillariesInfo = this.localStorageService.get('ancillariesInfo') || {};
    };

    private registerScopeListeners = (): void => {
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
        this.$scope.$on('openInsuranceInfoModal', this.openInsuranceInfoModal);
        this.$scope.$on(this.CheckinAncillariesConstants.FLEX_CONFIGURATION.NAME, this.openFlexibilization);
        this.$scope.$on(this.CheckinAncillariesConstants.PRIORITY_BOARDING.NAME, this.openPriorityBoarding);
    };

    private registerRootScopeListeners = (): void => {
        this.$rootScope.$on('totalBasket', this.updateTotalBasket);
        this.$rootScope.$on('deleteBaggages', this.deleteBaggages);
        this.$rootScope.$on('deleteSpeqs', this.deleteSpeqs);
        this.$rootScope.$on('deleteSeats', this.deleteSeats);
        this.$rootScope.$on('deleteCarbonFootprintAncillary', this.deleteCarbonFootprintAncillary);
        this.$rootScope.$on('cleanCarbonFootprintAncillary', this.cleanCarbonFootprintAncillary);
        this.$rootScope.$on('cleanFlexibilization', this.cleanFlexibilization);
        this.$rootScope.$on('cleanPriorityBoarding', this.cleanPriorityBoarding);
        this.$rootScope.$on('checkEarlyCheckinModal', this.checkEarlyCheckinModal);
        this.$rootScope.$on('closeOnholdLightBox', this.closeOnholdLightBox);
    };

    private registerDocumentListeners = (): void => {
        this.$document.on('mouseleave', this.openOnholdLightBox);
    };

    private initializeUserState = (): void => {
        this.userLogged = this.logged();
        this.isOnbUserLogged = this.localStorageService.get('userLogged') === this.CheckinAppConstants.LOGIN_ONB;
        this.flightAviosInfo = this.CkiAncillariesUtilsService.validatedFlightAviosInfo();
    };

    private checkEarlyCheckinModal = (): void => {
        if (this.model.pendingSeats && this.localStorageService.get('isFirstEarlyMap')) {
            this.redirectToSeatMap(this.CkiAncillariesUtilsService.getSegmentSeatsPending());
        }
    };

    logged = (): boolean => {
        return this.localStorageService.get('userLogged');
    };
    private initHeaderModel = (): void => {
        this.localStorageService.set('showBasket', true);
        this.NewMainHeaderFacade.initHeaderModel({
            originDestination: this.localStorageService.get('headerInfo'),
            redemption: '',
            flightType: this.CheckinAncillariesConstants.FLOW_TYPE.MULTICITY,
            currency: this.model.currency,
            showBasket: true,
            showModalBackHome: true
        });
        this.model.totalPayment = this.CurrencyService.formatPrice(this.model.currency, 0, true, false, false);
        this.$rootScope.timeSession.startTime = dayjs();
    };

    private returnLanguageToShowTransfers = () => {
        return this.CheckinAppConstants.lang;
    };

    private showOnHoldOrder = (isOnHoldOrder: any): void => {
        this.CommonsModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true, null);
        this.CommonsModalService.showGenericModal(
            true,
            'flow-step-modal.html',
            {
                idModal: 'ib-modal-not-allowed-flow',
                alert: isOnHoldOrder ? '' : 'AVAILABILITY_ON_BUSINESS_OPTION_TITLE',
                title: 'GENERAL_ADVICE_TITLE',
                body: isOnHoldOrder ? 'NOT_ALLOWED_FLOW_STEP_TEXT' : 'NOTICE_DELETED_VOUCHER',
                accept: 'MODAL_GENERAL_BUTTON_CANCEL',
                cancel: 'MODAL_GENERAL_BUTTON_ACCEPT'
            },
            null
        ).result.then(this.onSuccess, this.onCancel);
    };

    active = (): any => {
        this.initAncillariesData();
        if (!this.AncillariesService.redirectAfterLoginSoftUser()) {
            let insuranceSave,
                selectedFlex: any = {},
                createOrderData: any = {},
                selectedPriorityBoardingInfo;
            const isOnHoldOrder = this.localStorageService.get('isOnHoldOrder');
            if (isOnHoldOrder) {
                this.showOnHoldOrder(isOnHoldOrder);
            } else {
                this.localStorageService.remove('birthDate');
                this.localStorageService.set('showHideWaitingModal', true);
                this.showOnHoldNotice = false;
                this.localStorageService.set('actualStepFlow', this.CheckinAncillariesConstants.QUADRIGAM.ANCILLARIES.toLowerCase());
                this.localStorageService.set('ancillariesAction', 'impression');
                this.headerModel = this.localStorageService.get('headerModel');
                this.$timeout(() => {
                    this.CommonsUtilService.setTitlePage('CKI_TITLE_PAGE_CKIANC');
                }, 1600);
                this.initHeaderModel();

                this.seatConfirmationInfo = this.CkiAncillariesUtilsService.getSeatInfoConfirmation();
                this.$timeout(() => {
                    this.$rootScope.showMainHeader = false;
                    this.$rootScope.showHeaders = true;
                }, 1000);
                // setter
                this.AncillariesService.searchAncillariesInfo().then(
                    (response) => {
                        this.updateDatalayer(true);
                        const summaryInfo: any = this.localStorageService.get('summaryInfo');
                        const summaryInfoMarket: any = summaryInfo?.context?.issueCountry;
                        const confirmationDigitalInfo: any = this.localStorageService.get('confirmationDigitalInfo');
                        const confirmationDigitalInfoMarket: any = confirmationDigitalInfo?.Market;
                        this.model.ancillariesTrips = response.ancillariesTrips;
                        this.model.ancillariesAvailable = orderAncillaries(response.ancillariesAvailable);

                        // TRANSFERS GLB
                        const languageTransfers = this.returnLanguageToShowTransfers();
                        if ((languageTransfers === 'es' || languageTransfers === 'en')) {
                            this.model.ancillariesTransfersGlobick = response.ancillariesTransfersGlobick;
                        }

                        this.model.seatsAvailable = response.seatsAvailable;
                        this.model.baggageAvailable = response.baggageAvailable;
                        this.model.seatsQuanty = response.seatsQuanty;
                        this.model.ancillariesInsurance = response.ancillariesInsurance;
                        this.model.insuranceAvailable = response.insuranceAvailable;
                        // Allianz Fusion Response
                        if (summaryInfoMarket === confirmationDigitalInfoMarket) {
                            this.model.ancillariesInsuranceAllianzFusion = response.insuranceInfo;
                            this.model.insuranceAllianzFusionAvailable = response.insuranceAllianzFusionAvailable;
                        }
                        this.model.ancillariesFlexibilization = response.flexibilizationInfo;
                        this.model.insuranceInfo = response.insuranceInfo;
                        this.model.pendingSeats = response.pendingSeats;
                        this.model.passengerBaggagesTrips = response.passengerBaggagesTrips;
                        this.model.currency = response.currency;
                        this.model.isCurrencyLong = response.isCurrencyLong;
                        this.model.baggageAvailablePrice = response.baggageAvailablePrice.priceFrom;
                        this.model.bobAvailable = response.bobAvailable;
                        this.model.bobInfo = response.bobInfo;
                        this.model.upgrading = response.upgradingInfo;
                        this.model.speqsAvailablePrice = response.speqsAvailablePrice.priceFrom;
                        this.model.passengerSpeqsTrips = response.ancillariesSpeqs;
                        this.model.showBannerConfort = response.showBannerConfort;
                        this.model.ancillariesPreorder = response.preorderAncillarieInfo;
                        this.model.ancillariesPriorityBoarding = response.priorityBoardingInfo;
                        this.model.ancillariesCarbonFootprint = response.ancillariesCarbonFootprint;
                        this.model.flags = response.flags;
                        this.model.bundles;
                        checkAncillariesInfo();
                        this.initHeaderModel();
                        
                        this.NewMainHeaderFacade.updateSteps(this.localStorageService.get('actualStepFlow'));
                        this.NewMainHeaderFacade.showLogin();
                        this.NewMainHeaderFacade.updateBasketDiscounts('AVIOS');
                        this.NewMainHeaderFacade.updateBasketOthers('CARD');
                        //Reset stored discounts
                        const headerDiscounts = this.headerModel?.headerModel?.shoppingBasket?.discountsModel?.discounts;
                        if (headerDiscounts) {
                            for (const discountType in headerDiscounts) {
                                this.NewMainHeaderFacade.updateBasketDiscounts(discountType, null);
                            }
                        }
                        if (createOrderData?.order?.discountsApplied?.discounts?.length > 0) {
                            this.localStorageService.set('hasDiscountsApplied', true);
                            angular.forEach(createOrderData.order.discountsApplied.discounts, (discount) => {
                                this.NewMainHeaderFacade.updateBasketDiscountsNew(
                                    discount,
                                    createOrderData.order.discountsApplied.originalPrice,
                                    createOrderData.order.discountsApplied.totalDiscount,
                                    !this.CommonsUtilService.isDiscountTypePartnerEquivalent(discount.type) &&
                                        discount.type !== this.CheckinAncillariesConstants.DISCOUNT_TYPES.PARTNER
                                        ? createOrderData.order.price.total
                                        : createOrderData.order.price.total - discount.totalDiscount
                                );
                            });
                        } else {
                            this.localStorageService.set('hasDiscountsApplied', false);
                        }
                        this.CkiDatalayerUtilsService.updateDiscountData(createOrderData?.order?.specialDiscounts ?? []);
                        this.headerModel = this.localStorageService.get('headerModel');
                        this.$timeout(() => {
                            this.$rootScope.$broadcast('updateHeaderCurrency', this.model.currency);
                        });
                        this.handleRedirectionToSeatMap(response);

                        insuranceSave = this.localStorageService.get('insuranceSelected');
                        if (insuranceSave) {
                            angular.forEach(this.model.ancillariesInsurance, (insurance, index) => {
                                if (insuranceSave.id === insurance.id) {
                                    this.model.selectedInsurance = this.model.ancillariesInsurance[index];
                                    this.$rootScope.$broadcast('setSelectedInsurance', this.model.selectedInsurance);
                                    this.localStorageService.set('selectInsurance', true);
                                }
                            });
                        }
                        selectedFlex = this.localStorageService.get('selectedFlex');
                        if (selectedFlex) {
                            angular.forEach(this.model.ancillariesFlexibilization.info, (info, index) => {
                                if (info.subtype === selectedFlex.subtype) {
                                    this.model.ancillariesFlexibilization.selectedFlex = this.model.ancillariesFlexibilization.info[index];
                                    this.model.ancillariesFlexibilization.confirmed = true;
                                }
                                const update = [
                                    {
                                        type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.FLEXIBILITY,
                                        subtype: selectedFlex.subtype
                                    }
                                ];
                                this.CommonsAncillariesService.updateAncillaries(update).then(
                                    (data) => {
                                        this.model.ancillariesFlexibilization.confirmed = true;
                                    },
                                    (error) => {
                                        this.model.ancillariesFlexibilization.confirmed = false;
                                        this.model.ancillariesFlexibilization.selectedFlex = null;
                                        this.ModalServiceAncillaries.isNotWaiting();
                                        this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
                                    }
                                );
                            });
                        }
                        selectedPriorityBoardingInfo = this.localStorageService.get('selectedPriorityBoarding');
                        if (selectedPriorityBoardingInfo) {
                            this.model.ancillariesPriorityBoarding.confirmed = true;
                        }
                        if (this.model.upgrading) {
                            this.NewMainHeaderFacade.updateBasketUpgrading(this.model.upgrading);
                        }
                        this.$timeout(() => {
                            angular.element(this.$window).trigger('resize');
                        });

                        this.$rootScope.$digest();
                    },
                    (error) => {
                        this.updateDatalayer();
                        this.AncillariesService.generateRequestAncillaries(null);
                    }
                ).finally(() => {
                    this.sendViewEvent();
                });
            }

            const checkAncillariesInfo = () => {
                let headerModel: any = this.localStorageService.get('headerModel');
                let index;
                this.baggagesTrips = this.localStorageService.get('passengerBaggagesTrips')
                    ? this.localStorageService.get('passengerBaggagesTrips')
                    : this.model.passengerBaggagesTrips;
                this.speqsTrips = this.localStorageService.get('passengerSpeqsTrips') ? this.localStorageService.get('passengerSpeqsTrips') : this.model.passengerSpeqsTrips;
                const shoppingBasket = headerModel.shoppingBasket ? headerModel.shoppingBasket : headerModel.headerModel.shoppingBasket;
                const headerModelCarbonFootprint = shoppingBasket.carbonFootprint;
                const headerModelTransfersGlobick = shoppingBasket.globickTransfers;
                headerModel = shoppingBasket.seats;
                if (headerModel.hasSeats) {
                    let count = 0;
                    for (index = 0; index < headerModel.segments.length; index++) {
                        count += headerModel.segments[index].quanty;
                    }
                    this.model.seatsQuanty = this.AncillariesService.countSeatsTotal(count);
                }

                if (headerModelCarbonFootprint.hasCarbonFootprint) {
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
            //array of ancillaries types
            const orderAncillaries = (data) => {
                const ancillariesOrder: any = this.localStorageService.get('orderAncillariesModules');
                const result = [];
                if (ancillariesOrder) {
                    for (let i = 0; i < ancillariesOrder.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (ancillariesOrder[i] === data[j]) {
                                result.push(ancillariesOrder[i]);
                            }
                        }
                    }
                    for (let i = 0; i < data.length; i++) {
                        let ancillarieInList = false;
                        for (let j = 0; j < ancillariesOrder.length; j++) {
                            if (ancillariesOrder[j] === data[i]) {
                                ancillarieInList = true;
                            }
                        }
                        if (!ancillarieInList) {
                            result.push(data[i]);
                        }
                    }
                } else {
                    for (let i = 0; i < data.length; i++) {
                        result.push(data[i]);
                    }
                }
                return result;
            };
        }
        this.localStorageService.remove('genAviosAncillariesSeat');
        this.localStorageService.remove('bundleItems');
    };

    sendViewEvent (): void {
        /* INIT DELETE GA4 MIGRATION*/
        this.CkiDatalayerUtilsService.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        /* FINISH DELETE GA4 MIGRATION*/
        this.CkiDatalayerUtilsService.updateDatalayerViewEvent();
    }

    getBundlesAvailability (): void {
        this.CallBundleService.getBundle().then((bunldesAvailability: any) => {
            this.model.bundles = bunldesAvailability;
            if (this.model.bundles.bundles.length >= 1) {
                this.bundelingView = true;
                const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
                ancillariesInfo.bundles = bunldesAvailability.bundles;
                this.localStorageService.set('ancillariesInfo', ancillariesInfo);
            }
        });
    }

    $onInit = this.active();

    /**
     * Go to payments page
     */
    goToPayments = (): void => {
        if (this.model.selectedInsurance) {
            if (this.model.insuranceForm) {
                this.model.insuranceForm.$submitted = true;
                if (this.model.insuranceForm.$valid) {
                    if (this.model.insuranceInfo.policyHolder) {
                        this.model.selectedInsurance.passengerInfo = this.model.insuranceInfo.passengers;
                    } else if (this.model.insuranceInfo.insuranceCountry.country.code === 'IT') {
                        const passengerInfo: any = this.localStorageService.get('selectedInsurance');
                        this.model.selectedInsurance.passengerInfo = passengerInfo.passengerInfo;
                    }
                    this.DatalayerUtils.setInsuranceEcommerce(this.model.selectedInsurance, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
                    this.CkiDatalayerUtilsService.setAncillariesDatalayer();
                    this.AncillariesService.generateRequestAncillaries(this.model.passengerBaggagesTrips, this.model.passengerSpeqsTrips, this.model.selectedInsurance);
                } else {
                    const errorScroll =
                        angular
                            .element('[name="' + this.model.insuranceForm.$name + '"]')
                            .find('.ng-invalid:visible:first')
                            .offset().top - angular.element('.ib-header-common--full-container').innerHeight();
                    angular.element('html,body').animate({ scrollTop: errorScroll }, 'slow');
                }
            }
        } else {
            // this.CkiDatalayerUtilsService.setAncillariesDatalayer();
            this.AncillariesService.generateRequestAncillaries(this.model.passengerBaggagesTrips, this.model.passengerSpeqsTrips, null);
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
        let passengerTemp,
            model,
            deleteInfo = null;
        const passengerBaggagesTrips = Array.isArray(this.model.passengerBaggagesTrips) ? this.model.passengerBaggagesTrips : [];
        passengerBaggagesTrips.forEach((passenger) => {
            const trips = Array.isArray(passenger.trips) ? passenger.trips : [];
            passengerTemp = passenger;
            trips.forEach((trip) => {
                if (trip.id === segmentId) {
                    angular.forEach(trip.pieces, (piece) => {
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
        this.CkiAncillariesUtilsService.calculatePiecesBaggageTrip(this.model.passengerBaggagesTrips);
        deleteInfo = this.AncillariesTransformer.buildDeleteOneAncillariesBaggageRequest(
            model,
            'BAGGAGE',
            baggageTypeSelected,
            segmentId,
            this.localStorageService.get('passengerBaggagesTrips')
        );
        this.AncillariesService.deleteAviosAncillaries(segmentId, this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE, baggageTypeSelected);
        if (deleteInfo.length > 0 && deleteInfo[0].slices[0].passengers[0].id && this.localStorageService.get('actualStepFlow') !== 'ibpurc') {
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then(
                (data) => {
                    this.ModalServiceAncillaries.isNotWaiting();
                },
                (error) => {
                    this.ModalServiceAncillaries.isNotWaiting();
                    this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
                }
            );
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
        this.CkiAncillariesUtilsService.updateSeatsCachedInfo(updateSeatsInfo);
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
        let passengerTemp,
            model,
            deleteInfo = null;
        const passengerSpeqsTrips = Array.isArray(this.model.passengerSpeqsTrips) ? this.model.passengerSpeqsTrips : [];
        passengerSpeqsTrips.forEach((passenger) => {
            const trips = Array.isArray(passenger.trips) ? passenger.trips : [];
            passengerTemp = passenger;
            trips.forEach((trip) => {
                if (trip.id === segmentId && Array.isArray(trip?.pieces)) {
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
        this.CkiAncillariesUtilsService.calculatePiecesSpeqsTrip(this.model.passengerSpeqsTrips);
        deleteInfo = this.AncillariesTransformer.buildDeleteOneAncillariesBaggageRequest(
            model,
            'SPECIAL_EQUIPMENT',
            speqTypeSelected,
            segmentId,
            this.localStorageService.get('passengerSpeqsTrips')
        );
        this.AncillariesService.deleteAviosAncillaries(segmentId, this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS, speqTypeSelected);
        if (deleteInfo.length > 0 && deleteInfo[0].slices[0].passengers[0].id && this.localStorageService.get('actualStepFlow') !== 'ibpurc') {
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then(
                (data) => {
                    this.ModalServiceAncillaries.isNotWaiting();
                },
                (error) => {
                    this.ModalServiceAncillaries.isNotWaiting();
                    this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
                }
            );
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

    getDlProcess = (): string => {
        const confirmationDatalayerInfo: any = this.localStorageService.get('confirmationDatalayerInfo') || {};
        return  confirmationDatalayerInfo.proceso && confirmationDatalayerInfo.proceso === this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.PROCESS_DUPLICATE
            ? this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.PROCESS_DUPLICATE
            : this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.PROCESS;

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
        const confirmationDatalayerInfo: any = this.localStorageService.get('confirmationDatalayerInfo') || {};
        const dlProcess = this.getDlProcess();

        this.CkiDatalayerUtilsService.setProcessAndStep(dlProcess, this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.CKIANC, this.CheckinAncillariesConstants.QUADRIGAM.MODAL_SELECT_SEAT);
        this.closeCollapseHeader();
        this.localStorageService.set('ancillariesAction', 'click');
        this.CkiAncillariesUtilsService.setSegmentInfo({
            segmentId: segmentId ? segmentId : segment,
            pasId: this.localStorageService.get('passengersSelected')[0]
        });
        this.ModalServiceAncillaries.openSeatNewMapModal({
            seatMapInfo: this.model,
            currency: this.ancillariesInfo?.currencies?.[0]
        }).result.then(
            () => {
                this.model.seatsQuanty =  this.checkQuantitySeat();
                this.localStorageService.set('seatsQuanty', this.model.seatsQuanty);
                this.updateDatalayer();
                this.CkiDatalayerUtilsService.setAncillariesDatalayer();
            },
            () => {
                // CkiAncillariesUtilsService.removeSeatInfoConfirmation();
                this.updateDatalayer();
                this.CkiDatalayerUtilsService.setAncillariesDatalayer();
            }
        );
    };

    checkQuantitySeat = (): any => {
        let index,
            total = 0;
        const headerModel: any = this.localStorageService.get('headerModel');
        const seatModel: any = headerModel.shoppingBasket ? headerModel.shoppingBasket.seats : headerModel.headerModel.shoppingBasket.seats;
        if (seatModel.hasSeats) {
            total = 0;
            for (index = 0; index < seatModel.segments.length; index++) {
                total += seatModel.segments[index].quanty;
            }
        }
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
        this.ModalServiceAncillaries.openBaggagesModal({
            passengers: copyPassengerBaggagesTrips,
            isCurrencyLong: this.model.isCurrencyLong,
            currency: this.ancillariesInfo?.currencies?.[0]
        }).result.then(
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
            this.CkiDatalayerUtilsService.setAncillariesDatalayer();
        }
    };

    handleBaggagesModalError = (): void => {
        this.updateDatalayer();
        this.CkiDatalayerUtilsService.setAncillariesDatalayer();
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
        this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
    };

    /**
     * Open flexibilization modal
     */
    openFlexibilization = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        this.closeCollapseHeader();
        this.DatalayerUtils.getAncillariesDigitalDataEcommerce('flexibilization', this.DatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST);
        this.localStorageService.set('ancillariesAction', 'click');
        /* INIT DELETE GA4 MIGRATION */
        this.CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(this.CommonsConstants.QUADRIGAM.MODAL_SELECT_FLEX, null, this.localStorageService.get('userLogged'));
        this.CkiDatalayerUtilsService.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        /* FINISH DELETE GA4 MIGRATION*/
        this.CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(this.CommonsConstants.QUADRIGAM.MODAL_SELECT_FLEX, null, this.localStorageService.get('userLogged'));
        this.CkiDatalayerUtilsService.updateDatalayerViewEvent();
        this.$rootScope.$broadcast('updateDatalayer');
        this.$rootScope.$broadcast('updateDigitalData');
        this.$rootScope.$broadcast('sendUpdateToMonetate');
        this.ModalServiceAncillaries.openFlexibilizationModal({ model: this.model.ancillariesFlexibilization }).result.then(
            () => {
                this.localStorageService.set('ancillariesAction', 'addtocart');
                this.updateDatalayer();
            },
            () => {
                this.updateDatalayer();
            }
        );
    };

    cleanFlexibilization = (): void => {
        if (this.model.ancillariesFlexibilization.selectedFlex) {
            this.AncillariesService.deleteAviosAncillaries(
                null,
                this.CheckinAncillariesConstants.TYPE_ANCILLARIE.FLEXIBILITY,
                this.model.ancillariesFlexibilization.selectedFlex.subtype
            );
            this.model.ancillariesFlexibilization.selectedFlex = null;
            this.localStorageService.set('selectedFlex', this.model.ancillariesFlexibilization.selectedFlex);
            this.model.ancillariesFlexibilization.confirmed = false;
        }
    };

    openPriorityBoarding = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const dlProcess = this.getDlProcess();
        this.CkiDatalayerUtilsService.setProcessAndStep(dlProcess, this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.CKIANC, this.CheckinAncillariesConstants.QUADRIGAM.MODAL_SELECT_PRIO);
        this.closeCollapseHeader();
        this.localStorageService.set('ancillariesAction', 'click');
        const priorityModal = this.model.ancillariesPriorityBoarding;
        priorityModal.currency = this.ancillariesInfo?.currencies?.[0];
        this.ModalServiceAncillaries.openPriorityBoardingModal({ model: priorityModal }).result.then(
            () => {
                this.localStorageService.set('ancillariesAction', 'addtocart');
                this.updateDatalayer();
            },
            () => {
                this.updateDatalayer();
            }
        );
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
    modifySeatMap = (evt: any, segmentId: any): void => {
        this.closeCollapseHeader();
        this.CkiAncillariesUtilsService.setSegmentInfo({ segmentId: segmentId, pasId: this.localStorageService.get('passengersSelected')[0] });
        this.openSeatMap(null, segmentId);
    };

    /**
     * Open seat map modal of segement received of modal confirmation
     */
    modifyPendingSeat = (evt, infoSeatMap): void => {
        this.model.pendingSeats = false;
    };

    /**
     * Redirect user to seatmap when have one ore more segment with passenger  withoyt seats assigned
     * @param {*} segment
     */
    redirectToSeatMap = (segment: any): void => {
        this.closeCollapseHeader();
        this.CkiAncillariesUtilsService.setSegmentInfo({ segmentId: segment.segmentId, pasId: segment.pasId });

        this.ModalServiceAncillaries.openSeatNewMapModal({ seatMapInfo: this.model }).result.then(
            () => {
                this.model.seatsQuanty =  this.checkQuantitySeat();
                this.localStorageService.set('seatsQuanty', this.model.seatsQuanty);
            },
            () => {
                this.updateDatalayer();
            }
        );
    };

    /**
     * Open modal for select new country for insurance
     * @desc Open insurane modal for select new country and complete information
     */
    openChangeResidenceCountry = (): void => {
        this.closeCollapseHeader();
        let insurance;
        if (this.localStorageService.get('insuranceSelected')) {
            insurance = this.localStorageService.get('insuranceSelected');
        } else {
            insurance = this.model.insuranceInfo;
        }
        this.ModalServiceAncillaries.openInsuranceModal(
            { insurance: this.model.insuranceInfo, insuranceInfo: insurance, ancillariesInsurance: this.model.ancillariesInsurance },
            'ib-insurance-change-country-modal-view.html'
        ).result.then(angular.noop, angular.noop);
    };

    /**
     * Open insurance modal for select the insurance
     */
    openInsuranceModal = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const insuranceModel = { ...this.model };
        this.closeCollapseHeader();
        this.ModalServiceAncillaries.openInsuranceModal({ insuranceInfo: insuranceModel, isCurrencyLong: this.model.isCurrencyLong }, 'ib-modal-insurance.html').result.then(
            () => {
                this.updateDatalayer();
            },
            () => {
                this.updateDatalayer();
            }
        );
    };

    /**
     * Open insurance modal for select the insurance
     */
    openBobModal = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const bobModal = { ...this.model };
        this.closeCollapseHeader();
        this.ModalServiceAncillaries.openBobModal(bobModal, 'ib-bob-modal-view.html').result.then(
            () => {
                this.updateDatalayer();
            },
            () => {
                this.updateDatalayer();
            }
        );
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
                angular.forEach(this.model.insuranceInfo.passengers, (pas) => {
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
        let price,
            i,
            ancillariesInsuranceInfo: any = {};
        this.closeCollapseHeader();
        this.model.insuranceInfo.isModalLoading = true;

        const clearSelectedInsuranceValues = () => {
            angular.forEach(this.model.insuranceInfo.passengers, (pas) => {
                delete pas.document;
                delete pas.birthDate;
            });
        };

        this.CallAncillariesService.getInsurance(country.code).then(
            (response: any) => {
                if (response?.ancillaries[0]?.offers?.length > 0 && response?.ancillaries[0]?.status?.code === this.CheckinAncillariesConstants.GENERAL_STATUS.AVAILABLE) {
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
                    this.ModalServiceAncillaries.showGenericModal(
                        {
                            message: 'CKIANC_INSURANCE_WARNING_MODAL_INSURANCE_TEXT',
                            needsTranslate: true,
                            idModal: this.CheckinAncillariesConstants.DATALAYER_MODAL_ID.INSURANCE_NOT_AVAILABLE
                        },
                        true,
                        null
                    );
                }
            },
            (error) => {
                this.model.insuranceInfo.isModalLoading = false;
                this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
            }
        );

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
        angular.forEach(this.model.insuranceInfo.passengers, (pas) => {
            pas.isComplete = true;
        });

        this.changeAncillariesInfoInsurance();
    };

    changeAncillariesInfoInsurance = (): void => {
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');

        angular.forEach(ancillariesInfo.ancillaries, (ancillarie, index) => {
            if (ancillarie.type === this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INSURANCE) {
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
        const dlProcess = this.getDlProcess();
        this.CkiDatalayerUtilsService.setProcessAndStep(dlProcess, this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.CKIANC, this.CheckinAncillariesConstants.QUADRIGAM.MODAL_SELECT_SPEQ);
        this.closeCollapseHeader();

        this.ModalServiceAncillaries.openSpeqsModal({
            passengers: copyPassengersSpeqsTrips,
            quantySelected: this.model.speqsQuanty,
            isCurrencyLong: this.model.isCurrencyLong,
            currency: this.ancillariesInfo?.currencies?.[0]
        }).result.then(
            () => this.handleSpeqsModalSuccess(copyPassengersSpeqsTrips),
            this.handleSpeqsModalError
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
            this.CkiDatalayerUtilsService.setAncillariesDatalayer();
            this.updateDatalayer();
        }
    };

    handleSpeqsModalError = (): void => {
        this.updateDatalayer();
    };

    updateSpeqs = async (): Promise<boolean> => {
        let updateOk = false;

        const speqs: any = this.localStorageService.get('passengerSpeqsTrips');
        const haveSpeq = this.checkIfSpeqsAreChosen(speqs);

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
     * Verifica si hay algún "speq" seleccionado en los viajes.
     * @param speqs - Lista de "speqs" obtenidos del almacenamiento local.
     * @returns {boolean} - Verdadero si hay al menos un "speq" seleccionado.
     */
    checkIfSpeqsAreChosen (speqs: any[]): boolean {
        return speqs.some(speq => speq.trips.some(trip => trip.speqsChoosed > 0));
    }

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
                this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
            }
        );

        return updateOk;
    }


    getEnvUrlToGetWidgetCode (): string {
        const env = '';
        const envCopy: any = {};
        (<any>Object).assign(envCopy, (<any>window).env);
        return envCopy.urlEnvironment;

    }

    goPaymentTransfers = (evt): void => {
        const widgetVersion = '2.3.5';
        const baseUrl = this.getEnvUrlToGetWidgetCode();
        const urlTransfers = baseUrl + 'iberia-web-content/build-recoglobick-transfers/' + widgetVersion;

        const scriptTransferVendor = urlTransfers + '/static/js/2.vendor.chunk.js';
        const scriptTransferMain = urlTransfers + '/static/js/main.chunk.js';
        const scriptTransferRunTime = urlTransfers + '/static/js/runtime-main.js';
        const cssTransfersMain = urlTransfers + '/static/css/main.chunk.css';

        if (angular.element('script[src="' + scriptTransferVendor + '"]') !== null) {
            angular.element('script[src="' + scriptTransferVendor + '"]').remove();
            angular.element('script[src="' + scriptTransferMain + '"]').remove();
            angular.element('script[src="' + scriptTransferRunTime + '"]').remove();
            angular.element('link[href="' + cssTransfersMain + '"]').remove();
        }

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

    updateDatalayer = (isActivate?: boolean): void => {
        const quadrigamStatus: boolean = this.CkiAncillariesUtilsService.checkEarlyFlights(
            this.localStorageService.get('bookingInfo'),
            this.localStorageService.get('ancillariesAvailableSegments')
        );

        this.typeQuadrigam = quadrigamStatus
            ? this.CheckinAncillariesConstants.QUADRIGAM.EARLY_ANCILLARIES
            : this.CheckinAncillariesConstants.QUADRIGAM.ANCILLARIES;
        const dlProcess = this.getDlProcess();
        
        isActivate
            ? this.initAncillariesDatalayer(dlProcess)
            : this.CkiDatalayerUtilsService.setProcessAndStep(dlProcess, this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.CKIANC, this.typeQuadrigam);
    };

    private initAncillariesDatalayer = (dlProcess: string): void => {
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');

        /* INIT DELETE GA4 MIGRATION*/
        this.CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(this.typeQuadrigam, null, this.CkiAncillariesUtilsService.isUserLogged());
        /* FINISH DELETE GA4 MIGRATION*/
        this.CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(this.typeQuadrigam, {Currency: ancillariesInfo?.currencies[0]?.code}, this.CkiAncillariesUtilsService.isUserLogged());
        this.CkiDatalayerUtilsService.setProcessAndStep(dlProcess, this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.CKIANC, this.typeQuadrigam);

        this.MonetateUtilsService.updateMonetateWithQuadrigam(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, this.typeQuadrigam);
        this.$timeout(() => {
            this.$rootScope.$broadcast('sendUpdateToMonetate');
        });
        
        this.$rootScope.$broadcast('updateDatalayer');
        this.$rootScope.$broadcast('updateDigitalData');
    };

    checkPrioAndFlex = (evt, infoModal: any): void => {
        const headerModel: any = this.localStorageService.get('headerModel');
        const deleteFlexInfo = [
            {
                type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.FLEXIBILITY
            }
        ];
        if (headerModel.headerModel && headerModel.headerModel.shoppingBasket) {
            if (headerModel.headerModel.shoppingBasket.priorityBoarding.hasPriorityBoarding) {
                const selectedPriorityBoarding = this.localStorageService.get('prioritySegmentPutRequest');
                const deletePriority = [];
                this.ModalServiceAncillaries.showWaitingModal();
                const deletePriorityInfo = createDeleteInfo(selectedPriorityBoarding);
                deletePriority.push(deletePriorityInfo);
                this.localStorageService.set('deletePriority', deletePriority);
                this.CommonsAncillariesService.deleteAncillarie(deletePriority).then(
                    () => {
                        this.$rootScope.$broadcast('updatedPriorityInfoModel', deletePriority);
                        this.localStorageService.remove('deletePriority');
                        this.cleanPriorityBoarding();
                        this.NewMainHeaderFacade.updateBasketPriority('');
                        this.$rootScope.$broadcast('basketUpdateCommonHeader');
                        this.ModalServiceAncillaries.isNotWaiting();
                    },
                    (error) => {
                        this.ModalServiceAncillaries.isNotWaiting();
                        this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
                    }
                );
            }
            if (headerModel.headerModel.shoppingBasket.flexibilization.hasFlexibilization) {
                this.ModalServiceAncillaries.showWaitingModal();
                this.CommonsAncillariesService.deleteAncillarie(deleteFlexInfo).then(
                    (data) => {
                        this.localStorageService.remove('selectedFlex');
                        this.NewMainHeaderFacade.updateBasketFlexibilization('');
                        this.$rootScope.$broadcast('basketUpdateCommonHeader');
                        this.ModalServiceAncillaries.isNotWaiting();
                    },
                    (error) => {
                        this.ModalServiceAncillaries.isNotWaiting();
                        this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
                    }
                );
            }
        }

        function createDeleteInfo (selectedPriorityBoarding) {
            let i,
                j,
                segmentsInfo = { id: '', passengerIds: [] };
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
                segmentsInfo = { id: '', passengerIds: [] };
            }
            return deleteStructure;
        }
    };

    checkBaggages = (): void => {
        let bundleSelected = false;
        let baggageItem;
        this.model.bundles.bundles.forEach((bundle) => {
            if (bundle.selected) {
                bundleSelected = true;
                bundle.items.forEach((item) => {
                    if (item.type === 'BAGGAGE') {
                        baggageItem = item;
                    }
                });
            }
        });
        this.model.passengerBaggagesTrips.forEach((passenger) => {
            passenger.trips.forEach((trip) => {
                trip.totalPrice = 0;
            });
        });
        if (bundleSelected) {
            this.model.passengerBaggagesTrips.forEach((passenger) => {
                passenger.trips.forEach((trip) => {
                    if (trip.defaultAditionalPieces - baggageItem.quantityPassAndTrips - trip.piecesChoosed >= 0) {
                        trip.pieces.forEach((piece) => {
                            if (piece.quantySelected >= 1) {
                                if (baggageItem.subtype === piece.subtype) {
                                    let numBag = 0;
                                    piece.availablePriceRanges.forEach((range) => {
                                        let bundleBaggagesLeft = baggageItem.quantityPassAndTrips;
                                        let numBagsInterval = 1;
                                        const baggageCounter = range.to - range.from + 1;
                                        while (numBagsInterval <= baggageCounter && numBag < piece.quantySelected) {
                                            if (bundleBaggagesLeft > 0) {
                                                bundleBaggagesLeft += -1;
                                            } else {
                                                trip.totalPrice += range.amount;
                                                numBag++;
                                            }
                                            numBagsInterval++;
                                        }
                                    });
                                } else {
                                    piece.availablePriceRanges.forEach((range) => {
                                        trip.totalPrice += range.amount * piece.quantySelected;
                                    });
                                }
                            }
                        });
                    }
                });
            });
        } else {
            this.model.passengerBaggagesTrips.forEach((passenger) => {
                passenger.trips.forEach((trip) => {
                    if (trip.defaultAditionalPieces - trip.piecesChoosed >= 0) {
                        trip.pieces.forEach((piece) => {
                            if (piece.quantySelected >= 1) {
                                let numBag = 0;
                                piece.availablePriceRanges.forEach((range) => {
                                    let numBagsInterval = 1;
                                    const baggageCounter = range.to - range.from + 1;
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
        this.model.passengerSpeqsTrips.forEach((passenger) => {
            passenger.trips.forEach((trip) => {
                if (trip.defaultAditionalPieces === trip.speqsChoosed) {
                    maximumReached = true;
                }
            });
        });
        if (maximumReached) {
            let speqItem;
            this.model.bundles.bundles.forEach((bundle) => {
                if (bundle.selected) {
                    bundle.items.forEach((item) => {
                        if (item.type === 'SPECIAL_EQUIPMENT') {
                            speqItem = item;
                        }
                    });
                }
            });
            this.model.passengerSpeqsTrips.forEach((passenger) => {
                passenger.trips.forEach((trip) => {
                    if (trip.defaultAditionalPieces === trip.speqsChoosed) {
                        let tripSpeqsChoosed = 0;
                        let tripTotalPrice = 0;
                        trip.pieces.forEach((piece) => {
                            if (piece.subtype === speqItem.subtype && piece.quantySelected > 0) {
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
        for (let i = 0; i < this.model.passengerBaggagesTrips.length; i++) {
            for (let j = 0; j < this.model.passengerBaggagesTrips[i].trips.length; j++) {
                if (this.model.passengerBaggagesTrips[i].trips[j].defaultAditionalPieces === this.model.passengerBaggagesTrips[i].trips[j].piecesChoosed) {
                    showModal = true;
                }
            }
        }
        if (showModal) {
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
        for (let i = 0; i < this.model.passengerSpeqsTrips.length; i++) {
            for (let j = 0; j < this.model.passengerSpeqsTrips[i].trips.length; j++) {
                if (this.model.passengerSpeqsTrips[i].trips[j].defaultAditionalPieces === this.model.passengerSpeqsTrips[i].trips[j].speqsChoosed) {
                    showModal = true;
                }
            }
        }
        if (showModal) {
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

    handleRedirectionToSeatMap = (response: any) => {
        response.pendingSeats && this.localStorageService.get('isFirstEarlyMap')
            ? this.redirectToSeatMap(this.CkiAncillariesUtilsService.getSegmentSeatsPending())
            : (this.model.isAllowed = false);
        if (response.isPaFlow || this.localStorageService.get('showSeatMap')) {
            this.redirectToSeatMap(this.CkiAncillariesUtilsService.getSegmentInfo());
        }
    };

    initAncillariesData () {
        const isFlowDuplicated = this.CommonsSessionStorageService.get('isFlowDuplicated');
        const isEarly = this.CommonsSessionStorageService.get('isEarly');
        const setNextStepAllowed = isEarly && !isFlowDuplicated;

        this.model = this.AncillariesConfigurationService.initializeModel();
        if (setNextStepAllowed) {
            this.CommonsSessionStorageService.set('nextStepAllowed', setNextStepAllowed);
        }
        this.CheckinFlowService.warnUserOnBackPressed({
            closeModals: () => this.ModalServiceAncillaries.closeAllCurrentModals()
        });
    }

    onCancel = () => {
        this.CommonsModalService.finishWaiting();
        this.$location.path(this.CheckinAncillariesConstants.PAGES_ROUTES.PAYMENTS);
    };

    onSuccess = () => {
        const isOnHoldOrder = this.localStorageService.get('isOnHoldOrder');
        const redirectPath = this.$rootScope.isShuttleFlow ? '/ibshuttle' : '/availability';

        if (isOnHoldOrder) {
            this.localStorageService.set('isOnHoldOrder', false);
            this.$location.path(redirectPath);
            return;
        }

        if (this.$rootScope.isShuttleFlow) {
            this.$location.path('/ibshuttle');
            return;
        }

        this.$rootScope.$broadcast('checkVoucherCode', this.localStorageService.get('voucherDeleteInfo'));
        this.$rootScope.$broadcast('checkVoucher', true);
        this.NewMainHeaderFacade.updateBasketDiscounts('VOUCHER');

        this.localStorageService.remove('voucherDeleteInfo');
        this.ModalServiceAncillaries.isNotWaiting();
    };
}

try {
    AncillariesController.$inject = controllerInfo.inject;
    angular.module(controllerInfo.module).controller(AncillariesController.name, AncillariesController);
} catch (error) {
    const mod = angular.module(controllerInfo.module, controllerInfo.required);
    AncillariesController.$inject = controllerInfo.inject;
    mod.controller(AncillariesController.name, AncillariesController);
}
