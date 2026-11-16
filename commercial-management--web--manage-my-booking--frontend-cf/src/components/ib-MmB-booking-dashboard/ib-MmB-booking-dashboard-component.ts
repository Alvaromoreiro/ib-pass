import angular from "angular";
import { MMBDatalayerConstants } from "../services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { IbNewModalAncillariesService } from '../services/ib-new-modal-ancillaries-wrapper.service';
import { LoadingSpinnerService } from '../../app/shared/components/loading-spinner/loading-spinner.service';
import { Skeleton } from "commercial-management--digital--web-components-design--library";
import { BookingDashboardAncillariesService } from './services/ib-MmB-booking-dashboard-ancillaries-service';
import { BookingDashboardUtilsService } from './services/ib-MmB-booking-dashboard-utils-service';
import { BookingDashboardSharedUtilsService } from "./services/ib-MmB-booking-dashboard-shared-utils-service";
import { MmBAncillariesUtilsService } from "../services/Utils/ib-ancillaries/ib-MmB-ancillaries-utils-service";
import { MmBUtilsSharedService } from "../services/Utils/ib-MmB-utils-shared-service";
import { MmBUtilService } from "../services/Utils/ib-MmB-utils";


@Component(
    'ib-MmB-booking-dashboard-module',
    'ibMmbBookingDashboardComponent',
    {
        controllerAs: 'bookingDashCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-booking-dashboard-view.html';
        }]
    },
    ['$scope', 'BookingDashboardService', 'BookingDashboardModel', 'MmBModalService', 'localStorageService', 'BookingDashboardConstants', '$rootScope',
    'RedirectionService', '$filter', '$translate', '$location', 'MmBDatalayerUtilsService', 'MmBAppConstants', 'MmBUtilService', 'MmBUtilsSharedService',
    'AncillariesService', 'ModalServiceAncillaries', 'VipLoungesService','AncillariesConstants', 'CurrencyService', '$window',
    'CallAncillariesPageService', 'NewMainHeaderFacade', '$timeout', '$route', 'CommonsUtilService', 'CommonsModalService', 'IbCPermanentUserService',
    'CommonsUserUtilsService','CommonsGetLoginInfoService', 'VoluntaryChangesLogService', 'VoluntaryRefundLogService', 'CommonsLoginUtilsService','$cookies',
    'IbNewModalAncillariesService', 'LoadingSpinnerService', 'BookingDashboardAncillariesService', 'BookingDashboardUtilsService',
    'BookingDashboardSharedUtilsService', 'MmBAncillariesUtilsService'],
[])
export class ibMmbBookingDashboardComponent {

    constructor(
        private $scope,
        private BookingDashboardService,
        private BookingDashboardModel,
        private MmBModalService,
        private localStorageService,
        private BookingDashboardConstants,
        private $rootScope,
        private RedirectionService,
        private $filter,
        private $translate,
        private $location,
        private MmBDatalayerUtilsService,
        private MmBAppConstants,
        private MmBUtilService: MmBUtilService,
        private MmBUtilsSharedService: MmBUtilsSharedService,
        private AncillariesService,
        private ModalServiceAncillaries,
        private VipLoungesService,
        private AncillariesConstants,
        private CurrencyService,
        private $window,
        private CallAncillariesPageService,
        private NewMainHeaderFacade,
        private $timeout,
        private $route,
        private CommonsUtilService,
        private CommonsModalService,
        private IbCPermanentUserService,
        private CommonsUserUtilsService,
        private CommonsGetLoginInfoService,
        private VoluntaryChangesLogService,
        private VoluntaryRefundLogService,
        private CommonsLoginUtilsService,
        private $cookies: angular.cookies.ICookiesService,
        private IbNewModalAncillariesService: IbNewModalAncillariesService,
        private LoadingSpinnerService: LoadingSpinnerService,
        private BookingDashboardAncillariesService: BookingDashboardAncillariesService,
        private BookingDashboardUtilsService: BookingDashboardUtilsService,
        private BookingDashboardSharedUtilsService: BookingDashboardSharedUtilsService,
        private MmBAncillariesUtilsService: MmBAncillariesUtilsService
        ) {
            this.boxLinkClickEvent = this.$rootScope.boxLinkClickEvent = this.$rootScope.$on('boxLinkClickEvent', this.BookingDashboardUtilsService.boxLinkRedirection);
            this.checkSpecialNeedsEvent = this.$rootScope.$on('checkSpecialNeedsEvent', this.BookingDashboardUtilsService.checkSpecialNeeds);
            this.updatePassengerDataEvent = this.$rootScope.$on('updatePassengerDataEvent', this.BookingDashboardUtilsService.updatePassengerInfo);
            this.fillApisEvent = this.$rootScope.$on('fillApisData', this.BookingDashboardUtilsService.getApisData);
            this.cancelModalEvent = this.$rootScope.$on('cancelModalEvent', this.BookingDashboardUtilsService.returnOriginalData);
            this.changeTabEvent = this.$rootScope.$on('changeTabEvent', this.changeActiveTab);
            this.reloadImportOrderEvent = this.$rootScope.$on('reloadImportOrder', this.BookingDashboardUtilsService.reloadImportOrder);
            this.openSpecialMealsFromGastronomicEvent = this.$rootScope.$on('openSpecialMealModalFromGastronomic', this.BookingDashboardAncillariesService.openSpecialMealModal);
            this.updateModelFf = this.$rootScope.$on('updateModelFf', this.BookingDashboardUtilsService.updateModelFf);
            this.openNewTabByEvent = this.$rootScope.$on('changeActiveTabMenuEvt', this.openNewTabByEvent);
            this.updateDataInsurance = this.$rootScope.$on('updateDataInsurance', this.BookingDashboardAncillariesService.updateDataInsurance);

            this.initScopeListeners();

            this.localStorageService.remove('isEmptyBasket');
            this.localStorageService.remove('paySucces');
            this.userLoggeded = this.BookingDashboardUtilsService.logged();
    }

    private initScopeListeners() {
        this.$scope.$on('reloadMMBDashboard', this.$onInit);
        this.$scope.$on('openInsuranceModal', this.BookingDashboardAncillariesService.openInsuranceModal);
        this.$scope.$on('openSpecialMealModal', this.BookingDashboardAncillariesService.openSpecialMealModal);
        this.$scope.$on('openSeatMap', this.BookingDashboardAncillariesService.openSeatMap);
        this.$scope.$on('openBaggages', this.BookingDashboardAncillariesService.openBaggages);
        this.$scope.$on('openSpeqs', this.BookingDashboardAncillariesService.openSpeqs);
        this.$scope.$on('deleteSeats', this.BookingDashboardAncillariesService.deleteSeats);
        this.$scope.$on('goToPayment', this.goToPaymentPage);
        this.$scope.$on('deleteBaggages', this.BookingDashboardAncillariesService.deleteBaggages);
        this.$scope.$on('deleteSpeqs', this.BookingDashboardAncillariesService.deleteSpeqs);
        this.$scope.$on('modifySeatMap', this.BookingDashboardAncillariesService.modifySeatMap);
        this.$scope.$on('deleteInsurance', this.BookingDashboardAncillariesService.deleteInsurance);
        this.$scope.$on('deleteAllPendingAncillaries', this.BookingDashboardAncillariesService.deleteAllPendingAncillaries);
        this.$scope.$on('cancelModalEvent', this.BookingDashboardUtilsService.returnOriginalData);
        this.$scope.$on('changeTabEvent', this.changeActiveTab);
        this.$scope.$on('specialMealsNavigation', this.BookingDashboardAncillariesService.specialMealsNavigation);
        this.$scope.$on('openGastronomicProposal', this.openGastronomicProposal);
        this.$scope.$on('speqsNavigation', this.BookingDashboardAncillariesService.speqsNavigation);
        this.$scope.$on('ancillariesBaggageNavigation', this.BookingDashboardAncillariesService.ancillariesBaggageNavigation);
        this.$scope.$on('ancillariesSeatsNavigation', this.BookingDashboardAncillariesService.ancillariesSeatsNavigation);
        this.$scope.$on('goToCustomize', this.BookingDashboardAncillariesService.goToCustomize);
        this.$scope.$on('updateHeaderSeats', this.BookingDashboardAncillariesService.updateHeaderSeats);
        this.$scope.$on('updateSpecialMeals', this.BookingDashboardUtilsService.updateSpecialMeals);
        this.$scope.$on('updateSeatsAccept', this.BookingDashboardAncillariesService.updateSeatsAccept);
        this.$scope.$on('updateSeatsClose', this.BookingDashboardAncillariesService.updateSeatsClose);
        this.$scope.$on('changeInsuranceCountry', this.changeInsuranceCountry);
        this.$scope.$on('openUpgradeFlow', this.BookingDashboardSharedUtilsService.handleUpgradeFlow);
        this.$scope.$on('updatePassengerInfoModel', this.updatePassengerInfoModel);
        this.$scope.$on('changesInHeaderModel', this.BookingDashboardAncillariesService.changesInHeaderModel);
        this.$scope.$on('priorityBoarding', this.BookingDashboardAncillariesService.openPriorityBoarding);
        this.$scope.$on('cleanPriorityBoarding', this.BookingDashboardAncillariesService.cleanPriorityBoarding);
        this.$scope.$on('deleteCarbonFootprintAncillary', this.BookingDashboardAncillariesService.deleteCarbonFootprintAncillary);
        this.$scope.$on('cleanCarbonFootprintAncillary', this.BookingDashboardAncillariesService.cleanCarbonFootprintAncillary);
        this.$scope.$on('updateContactDetails', this.updateContactDetails);
        this.$scope.$on('specialNeedForm', this.updateSpecialNeedsContactInfo);
        this.$scope.$on('updateDocument', this.updateDocument);
        this.$scope.$on('openCarbonFootprintModal', this.BookingDashboardAncillariesService.openCarbonFootprintModal);
        this.$scope.$on('openActivitiesModifyModal', this.BookingDashboardAncillariesService.openActivitiesModifyModal);
        this.$scope.$on('openActivitiesModal', this.BookingDashboardAncillariesService.openActivitiesModal);
        this.$scope.$on('deleteGlobickActivities', this.BookingDashboardAncillariesService.deleteGlobickActivities);
        this.$scope.$on('openTransfersModal', this.BookingDashboardAncillariesService.openTransfersModal);
        this.$scope.$on('openTransfersModifyModal', this.BookingDashboardAncillariesService.openTransfersModifyModal);
        this.$scope.$on('deleteGlobickTransfers', this.BookingDashboardAncillariesService.deleteGlobickTransfers);
        this.$scope.$on('$destroy', this.boxLinkClickEvent);
        this.$scope.$on('$destroy', this.checkSpecialNeedsEvent);
        this.$scope.$on('$destroy', this.updatePassengerDataEvent);
        this.$scope.$on('$destroy', this.fillApisEvent);
        this.$scope.$on('$destroy', this.cancelModalEvent);
        this.$scope.$on('$destroy', this.changeTabEvent);
        this.$scope.$on('$destroy', this.reloadImportOrderEvent);
        this.$scope.$on('$destroy', this.openNewTabByEvent);
        this.$scope.$on('$destroy', this.updateModelFf);
        this.$scope.$on('$destroy', this.updateDataInsurance);
        this.$scope.$on('updatePersonalInfo', this.personalInfoEvent);
        this.$scope.$on('updateInvoiceInfo', this.reloadInvoiceInfo);
        this.$scope.$on('$destroy', this.openSpecialMealsFromGastronomicEvent);
        this.$scope.$on('checkSeatsQuantity', this.BookingDashboardAncillariesService.checkSeatsQuantity);
        this.$scope.$on('openInsuranceAllianzFusionModal', this.BookingDashboardAncillariesService.openInsuranceAllianzFusionModal);
        this.$scope.$on('vipLoungesDataReady', this.handleVipLoungesData);
        this.$scope.$on('$destroy', this.handleVipLoungesData);
        this.$scope.$on('openDisruptedSeatsModal', this.openDisruptionSeatsModal);
        this.$scope.$on('cancelSeatsFlag', this.disruptedSeatsResponse);
        this.$scope.$on('clearViewOnBasketUpdate', (event, data) => {
            this.showCarbonFootprintInfo(data);
        });

        this.initPropsServices();

    };

    boxLinkClickEvent;
    updatePassengerDataEvent;
    fillApisEvent;
    cancelModalEvent;
    checkSpecialNeedsEvent;
    changeTabEvent;
    updateModelFf;
    updateDataInsurance;
    reloadImportOrderEvent;
    openSpecialMealsFromGastronomicEvent;
    bookingInfo;
    headerModel;
    newHeaderModel;
    headerInfo;
    headerModelLocal;
    haveInsurance;
    insuranceSelected;
    seatsQuanty;
    baggagesTrips;
    isStopOverFromMail;
    isFlowBob;
    voucherFromEmail;
    flightChangeFromEmail;
    hasSisterCitiesPossibility;
    reshopConditions;
    flowTitlesApp;
    hide;
    userLoggeded;
    emailUpgBidsFlow = false;

    showYourDocuments = false;
    showInvoices = false;
    showInvoicesDisabled = false;
    model = this.BookingDashboardModel;
    lastSavedApis = [];
    quadrigamStatus = false;
    typeQuadrigam;
    baggagesTemp;
    speqsTemp;
    showGibeLink = false;
    gibeData = null;
    isSkeleton = true;
    skeletonComponent = Skeleton;
    skeletonHeaderProps = {
        className:'mmb-skeleton-dashboard mmb-skeleton-dashboard__header'
    };
    skeletonAsideProps = {
        className:'mmb-skeleton-dashboard mmb-skeleton-dashboard__aside-sub'
    };
    skeletonIconProps = {
        className:'mmb-skeleton-dashboard mmb-skeleton-dashboard__skeleton-icon'
    };
    skeletonHamburgerProps = {
        className:'mmb-skeleton-dashboard mmb-skeleton-dashboard__aside-hamburger'
    };
    bookingInfoLight;
    skeletonBackgroundImageUrl: string;

    $onInit = () => {
        this.LoadingSpinnerService.hide();
        this.handleInitPreselection();

        this.openDisruptionSeatsModal();
        if (this.IbCPermanentUserService.isAfterLoginPermanentUser()) {
            this.handleInitAfterLoginPermanentUser();
        } else {
            this.handleInitNonPermanentUser();
        }
        this.BookingDashboardAncillariesService.handleInitCarbonFootprintSubscription();

        const vipLoungesData = this.localStorageService.get('vipLoungesInvitations');
        if (this.shouldShowGibeLink(vipLoungesData)) {
            this.initializeVipLounges(vipLoungesData);
        }
        //COVER TO OTHERS FLOWS (OLD LOADING) REMOVE IT WHEN ALL REMOVE OLD LOADING
        this.MmBModalService.finishWaiting();
        //COVER TO OTHERS FLOWS (OLD LOADING) REMOVE IT WHEN ALL REMOVE OLD LOADING      
    };

    private initPropsServices = () => {
        this.BookingDashboardAncillariesService.model = this.model;
        this.BookingDashboardUtilsService.model = this.model;
        this.BookingDashboardSharedUtilsService.model = this.model;
        this.BookingDashboardUtilsService.lastSavedApis = this.lastSavedApis;
        this.BookingDashboardUtilsService.bookingInfo = this.bookingInfo;
        this.BookingDashboardUtilsService.isSkeleton = this.isSkeleton;
        this.BookingDashboardUtilsService.$onInit = this.$onInit;
        this.BookingDashboardAncillariesService.lastSavedApis = this.lastSavedApis;
        this.BookingDashboardAncillariesService.bookingInfo = this.bookingInfo;
        this.BookingDashboardAncillariesService.emailUpgBidsFlow = this.emailUpgBidsFlow;
        this.BookingDashboardAncillariesService.baggagesTemp = this.baggagesTemp;
        this.BookingDashboardAncillariesService.speqsTemp = this.speqsTemp;
        this.BookingDashboardAncillariesService.quadrigamStatus = this.lastSavedApis;
        this.BookingDashboardAncillariesService.typeQuadrigam = this.typeQuadrigam;
        this.BookingDashboardAncillariesService.baggagesTrips = this.baggagesTrips;
        this.BookingDashboardAncillariesService.headerModel = this.headerModel;
        this.BookingDashboardAncillariesService.headerModelLocal = this.headerModelLocal;
        this.BookingDashboardAncillariesService.newHeaderModel = this.newHeaderModel;
    };

    private handleVipLoungesData = (event, vipLoungesData) => {
        this.showGibeLink = this.shouldShowGibeLink(vipLoungesData);
        this.gibeData = vipLoungesData;
    };

    private shouldShowGibeLink(data) {
        return data?.status?.invitations?.code === 'AVAILABLE' || data?.status?.fast?.code === 'AVAILABLE';
    }

    private initializeVipLounges (vipLoungesData) {
        this.VipLoungesService.getExclusiveServicesLauncherComponent()
        .then(
            () => {
                this.handleVipLoungesData(null, vipLoungesData);
            },
        )
    }

    private checkExclusiveServicesDeepLink = () => {
        const vipServicesParam = this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.VIP_SERVICES, null) || null;
        return !!vipServicesParam;
    }

    private handleInitPreselection() {
        const deepLinkFlow = this.localStorageService.get('deepLinkParams') || null;
        const ancillariesOrder = [
            this.MmBAppConstants.ANCILLARIES_TYPES.BAGGAGE,
            this.MmBAppConstants.ANCILLARIES_TYPES.SEAT,
            this.MmBAppConstants.ANCILLARIES_TYPES.UPGRADING_AVIOS,
            this.MmBAppConstants.ANCILLARIES_TYPES.UPGRADING_BID,
            this.MmBAppConstants.ANCILLARIES_TYPES.UPGRADING_AVIOS_BID,
            this.MmBAppConstants.ANCILLARIES_TYPES.UPGRADING,
            this.MmBAppConstants.ANCILLARIES_TYPES.FLEXIBILITY,
            this.MmBAppConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING,
            this.MmBAppConstants.ANCILLARIES_TYPES.SPEQS,
            this.MmBAppConstants.ANCILLARIES_TYPES.PETC,
            this.MmBAppConstants.ANCILLARIES_TYPES.SPECIAL_MEALS,
            this.MmBAppConstants.ANCILLARIES_TYPES.PREORDER,
            this.MmBAppConstants.ANCILLARIES_TYPES.BOB,
            this.MmBAppConstants.ANCILLARIES_TYPES.INTEGRATED_BOB,
            this.MmBAppConstants.ANCILLARIES_TYPES.VEHICLE_RENTAL,
            this.MmBAppConstants.ANCILLARIES_TYPES.INSURANCE,
            this.MmBAppConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT
        ];
        if (deepLinkFlow) this.deeplinkDigitalData();
        this.$rootScope.$broadcast('backToMainBackground', true);
        this.localStorageService.set('orderAncillariesModules', ancillariesOrder);
        this.reshopConditions = this.localStorageService.get('reshopConditions');
        this.bookingInfo = this.localStorageService.get('bookingInfo');
        this.bookingInfoLight = this.localStorageService.get('bookingInfoLight');
        this.isSkeleton = this.hasSkeleton(this.bookingInfo);
        this.skeletonBackgroundImageUrl = this.orderSkeletonBackgroundImageUrl();
        this.BookingDashboardUtilsService.initFacadeHeader();
    };

    private handleInitAfterLoginPermanentUser() {
        this.MmBModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        this.CommonsGetLoginInfoService.checkCustomerStatus(true).then(
            () => {
                this.MmBModalService.finishWaiting();
                this.CommonsModalService.closeAllCurrentModals();
                this.redirectAfterLoginSoftUser();
            },
            () => {
                this.MmBModalService.finishWaiting();
                this.CommonsModalService.closeAllCurrentModals();
                this.CommonsLoginUtilsService.updateStateToAnonymous();
                this.IbCPermanentUserService.removeParamsAfterLogin();
            }
        );
    };

    private handleInitNonPermanentUser() {
        const paymentStatus = this.MmBUtilService.getURLFirstParameterByName('paymentStatus');
        const componentType = this.MmBUtilService.getURLFirstParameterByName('componentType');
        const flowApp = this.$rootScope.flowName;
        const deleteVoucherInfo = this.localStorageService.get('voucherDeleteInfo');
        if (deleteVoucherInfo && flowApp === 'MMB') {
            this.handleInitVoucherFlow(deleteVoucherInfo);
        }
        this.handleInitTimeoutTitle();
        history.pushState(null, null, location.href);
        this.localStorageService.set('showHideWaitingModal', true);
        this.localStorageService.remove('paymentRedirection');
        this.flowTitlesApp = this.localStorageService.get('flowTitlesApp');
        this.hide = true;
        this.handleInitPaymentAndAncillaries(paymentStatus, componentType);
        this.handleInitModelAndData();
        this.handleInitReloadEvent();
    };

    private handleInitVoucherFlow(deleteVoucherInfo) {
        this.MmBModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        const modalTitle = 'GENERAL_ADVICE_TITLE';
        const modalBody = 'NOTICE_DELETED_VOUCHER';
        const modalAlert = 'AVAILABILITY_ON_BUSINESS_OPTION_TITLE';
        const prevFlowApp: string = this.localStorageService.get('prevFlowApp');
        this.MmBModalService.showGenericModal(true, 'flow-step-modal.html', { idModal: 'ib-modal-not-allowed-flow', alert: modalAlert, title: modalTitle, body: modalBody, accept: 'MODAL_GENERAL_BUTTON_CANCEL', cancel: 'MODAL_GENERAL_BUTTON_ACCEPT' }).result.then(() => {
            this.$rootScope.$broadcast('checkVoucherCode', deleteVoucherInfo);
            this.$rootScope.$broadcast('checkVoucher', true);
            this.NewMainHeaderFacade.updateBasketDiscounts('VOUCHER');
            this.localStorageService.remove('voucherDeleteInfo');
            this.MmBModalService.finishWaiting();
        }, () => {
            this.MmBModalService.finishWaiting();
            if (prevFlowApp !== this.MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
                this.$location.path('/ohinfo');
            };
        });
    };

    private handleInitTimeoutTitle() {
        this.$timeout(() => {
            const quadrigam = this.localStorageService.get('confirmationDatalayerInfo')?.quadrigam;
            if (quadrigam == this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS_DEEPLINK) {
                this.CommonsUtilService.setTitlePage('MMB_TITLE_DEEPLINK_SEAT_SELECTION');
            } else {
                this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_DASHBOARD');
            }
        }, 1600);
    };

    private handleInitPaymentAndAncillaries(paymentStatus, componentType) {
        if (this.isComponentType(paymentStatus, componentType) && this.localStorageService.get('flowApp') === 'MMBBID') {
            this.handleInitBidsModal();
        } else if (this.isComponentType(paymentStatus, componentType) && !this.localStorageService.get('manualCloseVCModal')) {
            this.handleInitVoluntaryChangeModal();
        } else if (this.localStorageService.get('upgBidPutMade')) {
            this.handleInitUpgBidPutMade();
        } else if (this.localStorageService.get('RechargeBookingInfo')) {
            this.handleInitRechargeBookingInfo();
        }
    };

    private handleInitBidsModal() {
        this.localStorageService.set('paymentRedirection', true);
        this.ModalServiceAncillaries.openBidsModal();
    };

    private handleInitVoluntaryChangeModal() {
        this.localStorageService.set('paymentRedirection', true);
        this.MmBModalService.showVoluntaryChangeModal(false, 'ib-MmB-voluntary-changes-view.html');
    };

    private handleInitUpgBidPutMade() {
        this.AncillariesService.deleteAncillaryUpgBids(this.localStorageService.get('upgBidPutMade')).then(() => {
            this.localStorageService.remove('upgBidPutMade');
            this.$onInit();
        }, () => {
            this.localStorageService.remove('upgBidPutMade');
            this.$route.reload();
        });
    };

    private isComponentType = (paymentStatus, componentType) => {
        return (paymentStatus === 'OK' || paymentStatus === 'KO' || componentType);
    };

    private handleInitRechargeBookingInfo() {
        const headerModel = this.localStorageService.get('headerModel');
        const listAncillaries:boolean[] = [
            headerModel.headerModel.shoppingBasket.baggages.hasBaggage,
            headerModel.headerModel.shoppingBasket.bundle.hasBundle,
            headerModel.headerModel.shoppingBasket.carbonFootprint.hasCarbonFootprint,
            headerModel.headerModel.shoppingBasket.flexibilization.hasFlexibilization,
            headerModel.headerModel.shoppingBasket.globickTransfers.hasTransfersGlobick,
            headerModel.headerModel.shoppingBasket.globickActivities.hasActivitiesGlobick,
            headerModel.headerModel.shoppingBasket.insurance.hasInsurance,
            headerModel.headerModel.shoppingBasket.priorityBoarding.hasPriorityBoarding,
            headerModel.headerModel.shoppingBasket.seats.hasSeats,
            headerModel.headerModel.shoppingBasket.speqs.hasSpeqs];

        if (headerModel?.headerModel?.shoppingBasket && this.largeConditionSomeTrue(listAncillaries, true)) this.BookingDashboardAncillariesService.deleteAllPendingAncillaries();
        this.BookingDashboardUtilsService.reloadImportOrder();
        const memberDetails = this.localStorageService.get('memeberDetails');
        if (memberDetails && memberDetails.length > 0) {
            const tierName = memberDetails[0].data.memberPersonalDetails.schemes[0].recognitionLevel.recognitionLevelIdentifier;
            let modalBody = {
                title: this.$filter('translate')('TIER_ANCILLARIES_INFO_MODAL_TITLE'),
                message: this.$filter('translate')('TIER_ANCILLARIES_INFO_MODAL_MESSAGE', { tier: tierName })
            };
            this.MmBModalService.showGenericInfoModal(modalBody, false, 'generic-info-modal').result.then(function () { }, angular.noop);
            this.localStorageService.set('totalPricePriorityBoarding', 0);
            this.localStorageService.remove('passengerBaggagesTrips');
            this.localStorageService.set('selectInsurance', false);
        }
    };

    private largeConditionSomeTrue = (listValue, condition):boolean => {
        return (listValue.some(value => value === condition));
    };

    private handleInitModelAndData() {
        this.headerModel = { trips: null, basket: null, loggedInfo: null };
        this.BookingDashboardAncillariesService.headerModel = this.headerModel;
        this.headerModelLocal = this.localStorageService.get('headerModel');
        this.haveInsurance = this.localStorageService.get('selectInsurance');
        this.insuranceSelected = this.localStorageService.get('insuranceSelected');
        this.$rootScope.showMainHeader = false;
        this.baggagesTrips = this.localStorageService.get('passengerBaggagesTrips');
        this.model.initializeModel();
        this.$rootScope.showPayButton = true;
        this.model.tabs = angular.copy(this.BookingDashboardConstants.TABS);
        this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.management);
        this.isStopOverFromMail = this.localStorageService.get('isStopOverFromMail');
        this.voucherFromEmail = this.localStorageService.get('voucherFromEmail');
        this.model.voucherPartialRefund = this.localStorageService.get('voucherPartialRefund');
        this.flightChangeFromEmail = this.localStorageService.get('flightChangeFromEmail');
        this.hasSisterCitiesPossibility = this.localStorageService.get('showSisterCitiesPossibility');
        this.model.seatChangeConditions = this.localStorageService.get('disruptionSeatChangeCapabilities');
        this.isStopOverFromMail ? this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.complete) : this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.management);
        this.isFlowBob = this.localStorageService.get('flowBob');
        if (this.isFlowBob) {
            this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
        }
        if(this.checkExclusiveServicesDeepLink()){
            this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.exclusiveBenefits);
        }
        this.model.showCustomizeTab = false;
        this.MmBUtilService.updateDinamicPricingDatalayer();
        this.$translate.onReady().then(() => {
            this.BookingDashboardService.initializeDashboard().then((response) => {
                this.handleInitDashboardResponse(response);
                this.formatAndUpdateHeaderBasket();
                this.$rootScope.$broadcast('importReady');
            }, (error) => {
                this.isDeepLinkFlow();
				this.LoadingSpinnerService.hide();
                this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                this.$location.path(this.MmBAppConstants.PAGES_URL.SEARCH);
            });
            this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        });
    };

    private formatAndUpdateHeaderBasket(): void {
        const headerData = this.localStorageService.get('headerModel');
        const currency = this.localStorageService.get('currency');

        if (!headerData?.headerModel?.shoppingBasket?.total || !currency) {
            return;
        }
        const updatedModel = structuredClone(headerData);
        const shoppingBasketClone = updatedModel.headerModel.shoppingBasket;
        const totalPrice = shoppingBasketClone.total.original;

        const formattedPrice = this.CurrencyService.formatPrice(currency, totalPrice, true);
        updatedModel.headerModel.currency = currency;
        shoppingBasketClone.currency = currency;
        shoppingBasketClone.total.formatted = formattedPrice;
        this.NewMainHeaderFacade.updateHeader(updatedModel);
    };

    private handleInitDashboardResponse(response) {
        angular.extend(this.model, response.model);
        this.seatsQuanty = this.localStorageService.get('seatsQuanty') === null ? [] : this.localStorageService.get('seatsQuanty');
        this.handleDashboardBreakdownInfo(response);
        this.BookingDashboardAncillariesService.handleDashboardAncillariesInfo();
        this.handleDashboardSeatsQuanty();
        this.handleDashboardFlags(response);
        this.handleDashboardEvents(response);
        if(!this.getCanceledSeatsFlag()) this.LoadingSpinnerService.hide();
        if (angular.element('ib-apis-form').length > 0) this.MmBModalService.closeAllCurrentModals();
    };

    private handleDashboardBreakdownInfo(response) {
        if (response.breakDownInfo) {
            this.headerModel.basket = this.MmBAncillariesUtilsService.generateAncillariesHeaderInfo(response.breakDownInfo, response.model.managementModel.flights);
            this.BookingDashboardAncillariesService.headerModel = this.headerModel
            this.localStorageService.set('headerModelBasket', this.headerModel);
            this.localStorageService.set('breakdownInfo', response.breakDownInfo);
            this.localStorageService.set('flightsInfo', response.model.managementModel.flights);
            const selectedPriorityBoardingInfo = this.localStorageService.get('selectedPriorityBoarding');
            if (selectedPriorityBoardingInfo) {
                this.model.ancillariesInfo.priorityBoardingInfo.confirmed = true;
            }
        }
    };

    private handleDashboardSeatsQuanty() {
        this.seatsQuanty = this.calculateSeatsQuanty();
        this.setAncillariesSeatsQuanty();
    };

    private calculateSeatsQuanty() {
        if (this.headerModelLocal?.headerModel?.shoppingBasket?.seats?.hasSeats) {
            return this.headerModelLocal.headerModel.shoppingBasket.seats.segments.reduce(
                (acc, segment) => acc + segment.quanty, 0
            );
        }
        return 0;
    };

    private setAncillariesSeatsQuanty() {
        if (this.model.ancillariesInfo) {
            this.model.ancillariesInfo.seatsQuanty = (this.seatsQuanty && this.seatsQuanty > 0) ? this.seatsQuanty : 0;
        }
    };

    private handleDashboardFlags(response) {
        this.setCarbonFootprintConfirmed();
        this.showCo2FootprintInfo();
        this.setInsuranceInfo();
        this.setMenuAndCustomizeTab();
        this.BookingDashboardAncillariesService.checkAncillariesDeppLink();
        this.setActiveTabCustomize();
        this.setHeaderInfo(response);
        this.handleVoucherAndFlags(response);
    };

    private setCarbonFootprintConfirmed() {
        if (this.headerModelLocal?.headerModel?.shoppingBasket?.carbonFootprint?.hasCarbonFootprint) {
            if (this.model.ancillariesInfo && this.model.ancillariesInfo.ancillariesCarbonFootprint) {
                this.model.ancillariesInfo.ancillariesCarbonFootprint.confirmed = true;
            }
        }
    };

    private showCo2FootprintInfo() {
        if (this.model.managementModel.co2FootprintInfo) {
            this.showCarbonFootprintInfo(false);
        }
    };

    private setInsuranceInfo() {
        if (this.haveInsurance) {
            this.model.ancillariesInfo.insurance = this.insuranceSelected;
            this.model.ancillariesInfo.selectedInsurance = this.insuranceSelected;
        }
    };

    private setMenuAndCustomizeTab() {
        this.model.showMenu = true;
        this.model.showCustomizeTab = this.showCustomizeTab();
    };

    private setActiveTabCustomize() {
        if (this.localStorageService.get('customizeFlight') === true) {
            this.model.activeTab = this.model.tabs.customize;
        }
    };

    private setHeaderInfo(response) {
        this.headerInfo = this.MmBUtilsSharedService.getInfoHeader(response.model.managementModel.flights, response.model.passengersModel.passengers);
        this.localStorageService.set('headerInfo', this.headerInfo);
    };

    private handleVoucherAndFlags(response) {
        if (this.voucherFromEmail) this.checkVoucherFlowOpen();
        if (this.flightChangeFromEmail) this.checkFlagsAndFCFlowOpen();
        if (this.hasSisterCitiesPossibility) {
            this.model.newSisterCitiesModel = this.MmBUtilsSharedService.newTransformSisterCitiesModel(
                this.localStorageService.get('sisterCitiesRawModel'),
                true,
                this.model.rawSlicesInfo,
                this.model.yourFlightsModel?.flights ?? []
            );
        }
    };

    private handleDashboardEvents(response) {
        this.openBobModal();
        this.setBlockedKeepAliveModal();
        this.initFacadeHeaderTimeout();
        this.isDeepLinkFlow();
        this.BookingDashboardAncillariesService.handleAlreadyLoadedTimeout();
        this.setOrderFlagsAndRubiQ();
        this.generateFlexAndDisruptedFlightsDatalayerInfo();
        this.showSectionWithQuadrigamUrlParam();
        this.checkInvoicesInfo();
    };

    private openBobModal() {
        const isFlowBob = this.localStorageService.get('flowBob');
        if (isFlowBob) {
            this.$rootScope.$broadcast('openBobModal');
        }
    };

    private setBlockedKeepAliveModal() {
        this.$rootScope.blockedKeepAliveModal = false;
    };

    private initFacadeHeaderTimeout() {
        this.$timeout(() => {
            this.BookingDashboardUtilsService.initFacadeHeader();
        });
    };

    private setOrderFlagsAndRubiQ() {
        this.localStorageService.set('orderFlags', this.model.flags);
        this.localStorageService.set('showLinkToRubiQ', this.model.flags.showLinkToRubiQ);
    };

    private generateFlexAndDisruptedFlightsDatalayerInfo() {
        this.MmBUtilsSharedService.generateFlexAndDisruptedFlightsDatalayerInfo(false, this.model);
    };

    private hasSkeleton = (bookingInfo) =>{
        return (bookingInfo === null || bookingInfo === undefined);
    };

	private orderSkeletonBackgroundImageUrl = (): string => {
        const code = this.getArrivalCityCodeFromLight() || this.MmBAppConstants.defaultBackgroundImageUrl;
        return this.MmBUtilService.getBackGroundURL(code);
    };

    private getArrivalCityCodeFromLight(): string | null {
        const light = this.bookingInfoLight || this.localStorageService.get('bookingInfoLight');
        const lastSegment = this.getLastSegmentOfFirstSlice(light);
        if (!lastSegment?.arrival?.city) return null;
        const city = lastSegment.arrival.city;
        return city.code || city.iataCode || city.cityCode || null;
    }

    private getLastSegmentOfFirstSlice(light: any): any | null {
        const segments = light?.order?.slices?.[0]?.segments;
        if (!Array.isArray(segments) || segments.length === 0) return null;
        return segments[segments.length - 1];
    }

    private handleInitReloadEvent() {
        if (this.localStorageService.get('sendReloadEvent')) {
            this.$route.reload();
            this.localStorageService.remove('sendReloadEvent');
        }
    };

    personalInfoEvent = (e, data, model, allModifiedPersonalInfo) => {
        this.updatePassengerPersonalInfo(data.data.passengers);
        this.resetModifiedPersonalInfoFlags();
        this.markModifiedPassengers(model, allModifiedPersonalInfo);
    };

    private updatePassengerPersonalInfo(passengers) {
        passengers.forEach(passenger => {
            this.model.managementModel.managePassengers.forEach(managePassenger => {
                if (passenger.passengerId === managePassenger.passengerId) {
                    managePassenger.personalInfo.name = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.name : passenger.personalInfo.firstName;
                    managePassenger.personalInfo.surname = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.firstSurname : passenger.personalInfo.firstSurname;
                    managePassenger.personalInfo.birthDate = passenger.externalPersonalInfo ? passenger.externalPersonalInfo.birthDate : (passenger.personalInfo.birthDate ? passenger.personalInfo.birthDate : null);
                }
            });
        });
    };

    private resetModifiedPersonalInfoFlags() {
        this.model.managementModel.managePassengers.forEach(managePassenger => {
            managePassenger.modifiedPersonalInfo = false;
        });
    };

    private markModifiedPassengers(model, allModifiedPersonalInfo) {
        this.model.managementModel.managePassengers.forEach(managePassenger => {

            allModifiedPersonalInfo.forEach(element => {
                const nameComplete = managePassenger.personalInfo.name + managePassenger.personalInfo.surname;
                if (element.modifiedPersonalInfo === true && element.name === nameComplete) {
                    managePassenger.modifiedPersonalInfo = true;
                }
            });

            if (model.personalInfo.name === managePassenger.personalInfo.name && model.personalInfo.surname === managePassenger.personalInfo.surname) {
                managePassenger.modifiedPersonalInfo = true;
            }
        });
    };

    isLoggedCookies = () => {
        return this.$cookies.get('userLogged');
    };

    //open Modal change reservation / cancel reservation
    openModalCancelReservation = () => {
        let MODAL_CANCEL_RESERVATION = 'ib-change-cancel-flight-ibv.html', data = {};
        if (this.model.IsIBV && this.localStorageService.get('phonesListIBV')) {
            data = this.localStorageService.get('phonesListIBV');
        }
        angular.extend(data, { idModal: MODAL_CANCEL_RESERVATION });
        this.MmBModalService.showGenericModal(false, MODAL_CANCEL_RESERVATION, data).result.then(angular.noop, angular.noop);
    };
    /**
     * Show Customize item in menu when:
     * - Have Third Party Companies
     * - Is in Ancillaries Time
     * - Is in Cheking Time
     */
    showCustomizeTab = () => {
        let showCustomizeTab = false;
        const ancillariesInfoLocal = this.localStorageService.get('ancillariesInfo');

        if (this.model.ancillariesInfo) {
            if (this.hasAvailableAncillaries()) {
                showCustomizeTab = true;
            }
            if (!showCustomizeTab && this.hasThirdPartyCompaniesAvailable(ancillariesInfoLocal)) {
                showCustomizeTab = true;
                this.model.isAncillariesInTime = true;
            }
            if (!this.model.isAncillariesInTime && this.model.showRedirectionCheckin) {
                showCustomizeTab = true;
            }
            if (this.model.isPnrGroup) {
                showCustomizeTab = false;
            }
        }
        this.setAvailableSegments();
        return showCustomizeTab;
    };

    private hasAvailableAncillaries(): boolean {
        return (
            this.model.ancillariesInfo.ancillariesAvailable &&
            this.model.ancillariesInfo.ancillariesAvailable.length > 0
        );
    };

    private hasThirdPartyCompaniesAvailable(ancillariesInfoLocal): boolean {
        if (!ancillariesInfoLocal?.ancillaries) return false;
        return ancillariesInfoLocal.ancillaries.some(
            (item) =>
                item.type === this.BookingDashboardConstants.ANCILLARIES_TYPE.THIRD_PARTY_COMPANIES &&
                item.status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE
        );
    };

    private setAvailableSegments(): void {
        if (!this.model.ancillariesInfo) return;
        let baggagesAvailableSegments, speqsAvailableSegments;
        for (let i = 0; i < (this.model.ancillariesInfo?.ancillariesAvailable?.length ?? 0); i++) {
            if (this.model.ancillariesInfo.ancillariesAvailable[i] === 'BAGGAGE') {
                baggagesAvailableSegments = this.model.ancillariesInfo.ancillariesTripsBaggages;
            }
            if (this.model.ancillariesInfo.ancillariesAvailable[i] === 'SPECIAL_EQUIPMENT') {
                speqsAvailableSegments = this.model.ancillariesInfo.ancillariesTripsSpeqs;
            }
        }
        this.localStorageService.set('baggagesAvailableSegments', baggagesAvailableSegments);
        this.localStorageService.set('speqsAvailableSegments', speqsAvailableSegments);
    };

    closeMenu = (scope) => {
        scope.hide = true;
    };

    removeCustomizeFlight = () => {
        this.localStorageService.remove('customizeFlight');
    };

    /**
     * Scroll Top Event
     * @param {Object} scrollTop
     */
    scrollTop = () => {
        this.$window.scrollTo(0, 0);
    };

    setTitleDashboard = () => {
        this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_DASHBOARD');
    };

    /**
     * Change active tab
     * @param {Object} changeTabEvent
     * @param {String} newActiveTab
     */
    changeActiveTab = (changeTabEvent, newActiveTab, passengerIndex?:number) => {
        this.IbCPermanentUserService.removeParamsAfterLogin();
        this.model.activeTab = angular.copy(newActiveTab);
        this.setTitleDashboard();

        this.$window.requestAnimationFrame(()=> {
            if (passengerIndex !== undefined) {
                const offsetParentOfGreyBox:any = angular.element('ib-mmb-passengers-data-component')[passengerIndex];
                const offsetOfParent:any = angular.element('ib-mmb-passengers-data-component')[passengerIndex];
                const heightBoxTitle:any = angular.element('h1.ib-background-banner__title')[0];
                let totalHeight = offsetParentOfGreyBox.offsetParent.offsetTop + offsetOfParent.offsetTop + heightBoxTitle.offsetParent.offsetHeight;
                this.$window.scrollTo({
                    top: totalHeight,
                    behavior: 'smooth'
                });
            } else {
                this.$window.scrollTo(0, 0);
            }
        });
    };

    customizeFlight = () => {
        this.BookingDashboardAncillariesService.customizeFlight();
    };

    /**
     * This function show the view that user select.
     * @param type {String} indicate the view that user select.
     * @returns void.
     *  */
    changeActiveTabFromMenu = (type) => {
        if (!type || typeof type.name !== 'string') {
            return;
        };
        const cases = {
            [this.model.tabs.management.name]: () => { this.model.activeTab = this.model.tabs.management; },
            [this.model.tabs.customize.name]: () => { this.BookingDashboardAncillariesService.customizeFlight(); this.model.activeTab = this.model.tabs.customize; },
            [this.model.tabs.complete.name]: () => { this.model.activeTab = this.model.tabs.complete; },
            [this.model.tabs.flights.name]: () => { this.model.activeTab = this.model.tabs.flights; },
            [this.model.tabs.changeFlights.name]: () => {
                if (this.model.flags && this.model.flags.showChangeFlightLink) {
                    this.model.activeTab = this.model.tabs.changeFlights;
                } else {
                    this.getChangeDeepLink();
                }
            },
            [this.model.tabs.simulatorChangeFlights.name]: () => { this.model.activeTab = this.model.tabs.simulatorChangeFlights; },
            [this.model.tabs.refunds.name]: () => { this.model.activeTab = this.model.tabs.refunds; },
            [this.model.tabs.passengers.name]: () => { this.model.activeTab = this.model.tabs.passengers; },
            [this.model.tabs.documents.name]: () => { this.model.activeTab = this.model.tabs.documents; },
            [this.model.tabs.invoices.name]: () => { this.model.activeTab = this.model.tabs.invoices; },
            [this.model.tabs.exclusiveBenefits.name]: () => {
                this.refreshVipLoungesData();
                this.model.activeTab = this.model.tabs.exclusiveBenefits
            },
            [this.model.tabs.stopOver.name]: () => { this.model.activeTab = this.model.tabs.stopOver; },
            'default': () => { angular.noop(); }
        };

        (cases[type.name] || cases['default'])();
    };

    private refreshVipLoungesData = () => {
        const updatedData = this.localStorageService.get('vipLoungesInvitations');
        if (updatedData) {
            this.gibeData = updatedData;
        }
    };

    clickExclusiveBenefitsTab = () => {
        this.model.activeTab = this.model.tabs.exclusiveBenefits;
        this.hide = true;
        this.scrollTop();
        this.MmBDatalayerUtilsService.updateDatalayerEvents(
            MMBDatalayerConstants.EXCLUSIVE_SERVICES_EVENT_CATEGORY_VALUES.EXCLUSIVE_SERVICES,
            MMBDatalayerConstants.DATALAYER_EVENT_TYPES.CLIC,
            MMBDatalayerConstants.EXCLUSIVE_SERVICES_EVENT_LABEL_VALUES.BENEFITS_SECTION,
            MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_NAME_INTERACTION
        );
        this.refreshVipLoungesData();
        this.removeCustomizeFlight();
    };

    openGastronomicProposal = () => {
        this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
    }

    getChangeDeepLink = () => {
        this.bookingInfo = this.localStorageService.get('bookingInfo');
        if (!this.bookingInfo) {
            this.$location.url(this.MmBAppConstants.PAGES_URL.SEARCH);
        }
    };

    /**
     * Open modal for change insurance country.
     * @param {object} evt Event object
     * @param {Object} country Object with country code and description
     */
    changeInsuranceCountry = (evt, country) => {
        let price, insuranceCountry = angular.copy(country), ancillariesInfoOld = angular.copy(this.model.ancillariesInfo);
        this.model.ancillariesInfoOld = ancillariesInfoOld;
        this.$rootScope.$broadcast('insuranceModalLoading', true);
        this.CallAncillariesPageService.getInsurance(country.code).then((response) => {
            if (response.ancillaries[0]?.offers.length > 0 && response.ancillaries[0].status.code === this.AncillariesConstants.GENERAL_STATUS.AVAILABLE) {
                price = this.AncillariesService.getPriceOfferInsurance(this.CurrencyService.getCurrencyObject(response.currencies[0]), response.ancillaries);
                this.BookingDashboardAncillariesService.resetInsuranceInfo();
                this.resetInsuranceCountry();
                this.model.ancillariesInfo.insuranceInfo.insuranceCountry.country = insuranceCountry;
                this.model.ancillariesInfo.insuranceInfo.price = price.currencyPrice;
                this.model.ancillariesInfo.insuranceInfo.originalPrice = price.originalPrice;
                this.model.ancillariesInfo.insuranceInfo.id = response.ancillaries[0].offers[0].code;
                this.model.ancillariesInfo.insuranceInfo.code = response.ancillaries[0].offers[0].code;
                this.model.ancillariesInfo.insuranceInfo.countryInsurance = this.model.ancillariesInfo.insuranceInfo.insuranceCountry.country.description;
                this.model.ancillariesInfo.insuranceInfo.conditionsUri = response.ancillaries[0].offers[0].termsAndConditionsDocumentURI;
                this.model.ancillariesInfo.insuranceInfo.countryInsurance = this.model.ancillariesInfo.insuranceInfo.insuranceCountry;
                this.model.ancillariesInfo.ancillariesInsurance[0].descriptionCoverages = response.ancillaries[0].offers[0].coverages;
                this.model.ancillariesInfo.ancillariesInsurance[0].name = response.ancillaries[0].offers[0].name;
                this.model.ancillariesInfo.ancillariesInsurance[0].price = price.currencyPrice;
                this.model.ancillariesInfo.ancillariesInsurance[0].originalPrice = price.originalPrice;
                this.model.ancillariesInfo.ancillariesInsurance[0].consent = response.ancillaries[0].offers[0].consent;
                this.model.ancillariesInfo.ancillariesInsurance[0].code = response.ancillaries[0].offers[0].code;
                this.model.ancillariesInfo.ancillariesInsurance[0].id = response.ancillaries[0].offers[0].code;
                this.model.ancillariesInfo.insuranceInfo.isModalLoading = false;
                this.model.ancillariesInfo.selectedInsurance = this.model.ancillariesInfo.ancillariesInsurance[0];
                this.clearSelectedInsuranceValues();
                this.localStorageService.set('insuranceSelected', this.model.ancillariesInfo.ancillariesInsurance[0]);
                this.$rootScope.$broadcast('refreshInsuranceInfo', angular.copy(this.model.ancillariesInfo));
            } else {
                this.$rootScope.$broadcast('insuranceModalLoading', false);
                this.BookingDashboardAncillariesService.resetInsuranceInfo();
                this.model.ancillariesInfo.insuranceInfo.insuranceCountry = this.model.insuranceCountryOld;

                this.ModalServiceAncillaries.showGenericModal({ message: 'CKIANC_INSURANCE_WARNING_MODAL_INSURANCE_TEXT', needsTranslate: true, idModal: this.AncillariesConstants.DATALAYER_MODAL_ID.INSURANCE_NOT_AVAILABLE }, true, null);
            }
        }, (error) => {
            this.BookingDashboardAncillariesService.resetInsuranceInfo();
            this.model.ancillariesInfo.insuranceInfo.insuranceCountry = this.model.insuranceCountryOld;
            this.$rootScope.$broadcast('insuranceModalLoading', false);
            this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
        });
    };

    private resetInsuranceCountry = () => {
        if (!this.model.ancillariesInfo.insuranceInfo.insuranceCountry) {
            this.model.ancillariesInfo.insuranceInfo.insuranceCountry = { country: {} };
        };
    };

    private clearSelectedInsuranceValues = () => {
        angular.forEach(this.model.ancillariesInfo.insuranceInfo.passengers, (pas) => {
            delete pas.document;
            delete pas.birthDate;
        });
    };

    goToPaymentPage = () => {
        let mmbAncillariesPaymentSummaryModel;
        const isAfterLoginPermanentUser = this.IbCPermanentUserService.isAfterLoginPermanentUser();
        isAfterLoginPermanentUser ? this.CommonsModalService.showWaitingModal('ib-modal-loading-plane-pmt', 'ib-modals ib-modals--transparent', true) : this.CommonsModalService.showWaitingModal(null);
        this.$rootScope.$broadcast('backToMainBackground', false);
        this.BookingDashboardService.updateAncillariesInfo([], [], this.model.ancillariesInfo.selectedInsurance ? this.model.ancillariesInfo.selectedInsurance : null).then(() => {
            this.CommonsModalService.finishWaiting();
            this.$rootScope.showPayButton = false;
            this.localStorageService.set('flowApp', 'MMBANC');
            mmbAncillariesPaymentSummaryModel = this.localStorageService.get('headerModel');
            this.localStorageService.set('mmbAncillariesPaymentSummaryModel', mmbAncillariesPaymentSummaryModel);
            this.MmBDatalayerUtilsService.setAncillariesDatalayer();
            this.IbCPermanentUserService.checkPermanentUserFlow()
                .then(() => {
                    this.$location.path(this.MmBAppConstants.PAGES_URL.PAYMENTS);
                })
                .catch(() => { });
        }, ((error) => {
            this.CommonsModalService.finishWaiting();
        }));
    };



    updatePassengerInfoModel = (event, passengersModel) => {
        if (passengersModel) {
            this.model.passengersModel = passengersModel;
        };
    };

    checkVoucherFlowOpen = () => {
        if (this.model.voucherPriceInfo && this.model.flags.showRefundVoucherSectionFunctional) {
            this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.refunds);
            this.localStorageService.set('openVoucherRefundModal', true);
        } else {
            if (this.model.passengersModel?.contactData?.primaryContactInfo?.lowerCaseEmail) {
                this.RedirectionService.externalRedirect(this.$filter('LinksFilter')('DISRUPTION_REFUND_EXTERNAL_LINK') + '?pnr=' + this.localStorageService.get('PNR') + '&lastname=' + this.localStorageService.get('checkinSurname') + '&email=' + this.model.passengersModel.contactData.primaryContactInfo.lowerCaseEmail + '&fc=' + 'F' + '&idioma=' + this.$rootScope.appLang + '&cambio=false');
            } else {
                this.RedirectionService.externalRedirect(this.$filter('LinksFilter')('DISRUPTION_REFUND_EXTERNAL_LINK') + '?pnr=' + this.localStorageService.get('PNR') + '&lastname=' + this.localStorageService.get('checkinSurname') + '&fc=' + 'F' + '&idioma=' + this.$rootScope.appLang + '&cambio=false');
            };
        };
    };

    checkFlagsAndFCFlowOpen = () => {
        if (this.model.flags.showChangeFlightLink && this.model.flags.showFlexibilizationChangeSection) {
            this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.changeFlights);
        }
    };

    openNewTabByEvent = (e, newTab) => {
        this.changeActiveTabFromMenu(newTab);
    };

    openCallCenterModal = (modalName) => {
        const modalBody = {
            title: '',
            message: 'MMB_ANCILLARIES_FLEXIBILITY_MODAL_MESSAGE',
            needsTranslate: true
        };
        if (modalName === 'changeFlights') {
            this.VoluntaryChangesLogService.getVoluntaryChangesLog();
            this.MmBModalService.finishWaiting();
            modalBody.title = 'MMB_ANCILLARIES_FLEXIBILITY_CHANGE_FLIGHT_MODAL_TITLE';
            this.MmBModalService.showGenericInfoModal(modalBody, false, 'generic-info-modal').result.then(() => {
            }, angular.noop);
        } else if (modalName === 'refunds') {
            modalBody.title = 'MMB_ANCILLARIES_FLEXIBILITY_REFUND_MODAL_TITLE';
            modalBody.message = 'MMB_ANCILLARIES_FLEXIBILITY_REFUND_MODAL_MESSAGE';
            this.MmBModalService.showGenericInfoModal(modalBody, false, 'generic-info-modal').result.then(() => {
            }, angular.noop);
        };
    };

    openRefundFlow = () => {
        this.model.activeTab = this.model.tabs.refunds;
    };

    isDeepLinkFlow = () => {
        if (this.localStorageService.get('deepLinkParams')) {
            this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
            this.model.deepLinkFlow = true;
        }
    };

    updateContactDetails = (event, contactData) => {
        this.BookingDashboardService.getContactData().then((data) => {
            if (contactData.email !== data.email) {
                this.localStorageService.set('contactDataInfo', data);
                this.showContactModal(() => {
                    this.BookingDashboardService.updateContactDetails(contactData).then(
                        () => this.showContactResultModal(true),
                        () => this.showContactResultModal(false)
                    );
                });
            }
        }, () => {
            this.showContactResultModal(false);
        });
    };

    clickStopOverTab = () => {
        this.model.activeTab = this.model.tabs.stopOver;
        this.hide = true;
        this.scrollTop();
        this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_STOPOVER_MADRID');
        this.MmBDatalayerUtilsService.updateDatalayerInfo(null, null, this.MmBAppConstants.QUADRIGAM.STOP_OVER);
        this.removeCustomizeFlight();
    };     
    private showContactModal(onAccept) {
        this.CommonsModalService.showGenericModal(true, 'generic-complete-modal.html', this.BookingDashboardConstants.SAVE_MODAL_LITERALS, null).result.then(onAccept, angular.noop);
    };

    private showContactResultModal(success) {
        const literals = success ? this.BookingDashboardConstants.SAVE_ACCEPT_LITERALS : this.BookingDashboardConstants.SAVE_ERROR_LITERALS;
        this.CommonsModalService.showGenericComponentModal(literals, true).result.then(() => { }, () => { });
    };

    updateSpecialNeedsContactInfo = (event, specialNeedData) => {
        this.BookingDashboardService.getTravelPreferences().then((data) => {
            this.CommonsModalService.showGenericModal(true, 'generic-complete-modal.html', this.BookingDashboardConstants.SAVE_MODAL_LITERALS, null).result.then(() => {
                this.BookingDashboardService.updateTravelPreferences(specialNeedData, data).then(() => {
                    this.CommonsModalService.showGenericComponentModal(this.BookingDashboardConstants.SAVE_ACCEPT_LITERALS, true).result.then(() => { }, () => { });
                }, (error) => {
                    this.CommonsModalService.showGenericComponentModal(this.BookingDashboardConstants.SAVE_ERROR_LITERALS, true).result.then(() => { }, () => { });
                });
            }, angular.noop);
        }, (error) => {
            this.CommonsModalService.showGenericComponentModal(this.BookingDashboardConstants.SAVE_ERROR_LITERALS, true).result.then(() => { }, () => { });
        });
    };

    updateDocument = (event, updateDocumentData, ff = null) => {
        if (this.chkPassLogged(ff) && !this.CommonsUserUtilsService.isSoftUser()) {
            this.BookingDashboardService.getPersonalData().then((data) => {
                if (data.gender.toUpperCase() !== updateDocumentData.basicInfo.gender.toUpperCase()) {
                    this.CommonsModalService.showGenericModal(true, 'generic-complete-modal.html', this.BookingDashboardConstants.SAVE_MODAL_LITERALS, null).result.then(() => {
                        this.BookingDashboardService.updatePersonalData(data, updateDocumentData.basicInfo.gender).then(() => {
                            this.CommonsModalService.showGenericModal(true, 'generic-info-modal.html', this.BookingDashboardConstants.SAVE_ACCEPT_LITERALS, null).result.then(() => { }, () => { });
                        }, (error) => {
                            this.CommonsModalService.showGenericModal(true, 'generic-info-modal.html', this.BookingDashboardConstants.SAVE_ERROR_LITERALS, null).result.then(() => { }, () => { });
                        });
                    }, angular.noop);
                }
            }, () => { });
        }
    };

    private chkPassLogged = (passengerFF) => {
        try {
            const custData = this.localStorageService.get('customerData');
            return passengerFF === custData.personalInfo.ibPlusNumber;
        } catch (error) {
            return false;
        };
    };

    showSectionWithQuadrigamUrlParam = () => {
        const infoDigitalBoarding = this.localStorageService.get('digitalBoardingInfo');
        const quadrigam = this.localStorageService.get('quadrigam');
        this.localStorageService.remove('quadrigam');
        this.showYourDocuments = (infoDigitalBoarding !== null && infoDigitalBoarding?.digitalBoardings?.segments?.length > 0);

        const selectedTab = this.getTabByQuadrigam(quadrigam, this.model.showCustomizeTab);
        if (selectedTab !== null) {
            this.changeActiveTabFromMenu(selectedTab);
        };
    };

    private getTabByQuadrigam(quadrigam, showCustomizeTab) {
        if (quadrigam === this.MmBAppConstants.QUADRIGAM.YOUR_DOCUMENTS) {
            return this.model.tabs.documents;
        }
        if (quadrigam === this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_YOUR_TRAVEL && showCustomizeTab) {
            return this.model.tabs.customize;
        }
        return null;
    };

    redirectAfterLoginSoftUser = () => {
        if (this.IbCPermanentUserService.isAfterLoginBidsPermanentUser()) {
            this.localStorageService.set('RechargeBookingInfo', true);
            this.$translate.onReady().then(() => {
                this.model = this.BookingDashboardService.recoverDashboardDataAfterLogin().model;
                this.BookingDashboardSharedUtilsService.handleUpgradeFlow();
                this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.MANAGE_RESERV);
            });
            this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOUPG,MMBDatalayerConstants.DIGITAL_DATA_STEP.MOUPG, this.MmBAppConstants.QUADRIGAM.MODAL_SELECT_UPGRADING);
        } else if (this.localStorageService.get('flowApp') === this.MmBAppConstants.TITLES_APP.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
            this.localStorageService.set('paymentRedirection', true);
            this.MmBModalService.showVoluntaryChangeModal(false, 'ib-MmB-voluntary-changes-view.html');
        } else {
            this.localStorageService.set('flowApp', 'MMBANC');
            this.CommonsModalService.closeAllCurrentModals();
            this.$location.path(this.MmBAppConstants.PAGES_URL.PAYMENTS);
        };
    };

    showCarbonFootprintInfo = (basketCleared) => {
        if (this.model.managementModel.co2FootprintInfo.showCarbonFootprintInfo || basketCleared) {
            if (this.iskgCo2(basketCleared)) {
                this.model.managementModel.co2FootprintInfo.kilosCo2EquivalentFormatted = this.model.ancillariesInfo.ancillariesCarbonFootprint.kilosCo2EquivalentFormatted;
                this.model.managementModel.co2FootprintInfo.priceFormatted = this.model.ancillariesInfo.ancillariesCarbonFootprint.priceFormatted;
                this.model.managementModel.co2FootprintInfo.showCarbonFootprintInfo = true;
            } else {
                this.model.managementModel.co2FootprintInfo.showCarbonFootprintInfo = false;
            }
        } else {
            this.model.managementModel.co2FootprintInfo.showCarbonFootprintInfo = false;
        };
    };

    private iskgCo2 = (basketCleared) => {
        const header = this.localStorageService.get('headerModel');
        const basketCarbonFootprint = header && header.shoppingBasket ? header.shoppingBasket.carbonFootprint.hasCarbonFootprint : null;
        return ((!basketCarbonFootprint || basketCleared) && this.model?.ancillariesInfo?.ancillariesCarbonFootprint?.kilosCo2Equivalent > 0);
    };

    reloadInvoiceInfo = () => {
        this.localStorageService.remove('invoiceList');
        this.localStorageService.remove('listInvoices');
        this.localStorageService.remove('newRequestInvoices');
        this.localStorageService.remove('newRequestInvoicesFailure');
    };

    checkInvoicesInfo = () => {
        const marketES = this.$rootScope.appMarket === 'ES';
        const language = this.$rootScope.appLang === 'es' || this.$rootScope.appLang === 'ca' || this.$rootScope.appLang === 'en';
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const filterFLagInvoices = bookingInfo ? bookingInfo.orderFlags.filter(item => item.type === 'ALLOWED_INVOICE_MANAGEMENT') : false;
        this.showInvoices = marketES && language && filterFLagInvoices && filterFLagInvoices[0].enabled;
        this.showInvoicesDisabled = true;

        if (this.showInvoices) {
            this.showInvoicesDisabled = false;
        };
    };

    deeplinkDigitalData = (): void => {
        const source = this.MmBUtilService.getURLFirstParameterByName('source');
        const digital_data = {};
        digital_data[MMBDatalayerConstants.DatalayerGeneralConstants.DEEPLINK] = source;
        this.MmBDatalayerUtilsService.addDigitalDataInfo(digital_data);
    };

    openVoluntaryRefundFlow = () => {
        this.VoluntaryRefundLogService.getVoluntaryRefundLog(this.localStorageService.get('flowId'));
        this.MmBModalService.finishWaiting();
        this.model.activeTab = this.model.tabs.voluntary_refunds;
    };

    private openDisruptionSeatsModal = (): void => {
        const canceledSeatsFlag = this.getCanceledSeatsFlag();
        if(canceledSeatsFlag) {
            this.LoadingSpinnerService.show();
            const locator: string = this.bookingInfo.order.bookingReferences.find(
                (bookingReference: ImportOrderData.BookingReference) => bookingReference.provider
                    === this.MmBAppConstants.DISRUPTION_SEATS.PROVIDER_IB)?.reference;
            const creationDate: string = this.bookingInfo.order.bookingCreationDates.find(
                (creationDate: ImportOrderData.CreationDate) => creationDate.provider
                    === this.MmBAppConstants.DISRUPTION_SEATS.PROVIDER_IB)?.creationDate;

            this.IbNewModalAncillariesService.openDisruptedSeatsModal(locator, creationDate).subscribe({
                    next: () => {
                        this.disruptedSeatsResponse(null, true);
                    },
                    error: () => {
                        this.disruptedSeatsResponse(null, false);
                    }
                });
        }
    };

    private disruptedSeatsResponse = (event, canceledSeatsFlag: boolean) : void => {
        this.$timeout(() => {
            this.model.canceledSeatsFlag = canceledSeatsFlag;
        }, 500);
        this.LoadingSpinnerService.hide();
    };

    private getCanceledSeatsFlag(): boolean {
        return this.bookingInfo?.orderFlags.find((orderFlag: any) => orderFlag.type === this.MmBAppConstants.DISRUPTION_SEATS.CANCELLED_SEATS)?.enabled;
    };

};
