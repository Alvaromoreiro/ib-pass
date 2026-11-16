import angular from 'angular';
import { IMarketingPermissions } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-contact-form/models/ib-booking-contact-form-models';
import { HeaderDataType } from '@src/app/core/models/ib-booking-availability/header-model';
import { IbNewModalAncillariesService } from 'ib-web-ancillaries';
import { type AncillariesStatusResponseModel } from '@src/app/core/models/ancillaries/ancillaries-status-response-model';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';
import { BookingTotalPriceRedemptionService, RedemptionTotalPriceModel } from '@src/app/pages/ib-booking-ancillaries/components/ib-booking-anc-simplified-total-price/services/ib-booking-total-price-redemption.service';

@Component( 'ib-booking-anc-simplified-total-price-module', 'ibBookingAncSimplifiedTotalPrice',
    {
        bindings: {
            totalPrice: '<',
            conditionsText: '<',
            conditionsTextOffers: '<',
            explanationText: '<',
            changePassengers: '<',
            redemption: '<',
            withoutAviosMoney: '<',
            fareRate: '<',
            isChecked: '<',
            obPoints: '<',
            showObpoints: '<',
            obDiscount: '<',
            showDiscount: '<',
            noDiscountObPrice: '<',
            totalPointsNeeded: '<',
            aviosToEarn: '<',
            elitePointsToEarn: '<',
            selectedResidentDiscount: '<?',
            selectedLargefamDiscount: '<?',
            continueText: '<?'
        },
        controllerAs: 'simpTotalPriceCtrl',
        templateUrl: ['BookingAppConstants', ( bkiConstants: BookingAppConstants ): string => bkiConstants.templatesRoute + 'ib-booking-anc-simpified-total-price-view.html' ]
    }, ['$scope', 'BookingModalService', 'BookingAppConstants', 'localStorageService', '$filter', 'CommonsUserUtilsService', '$rootScope', 'IbBookingPriceDetailModalService', 'BookingUtilService', 'IbNewModalAncillariesService', 'BookingTotalPriceRedemptionService'], [] )
export class ibBookingSimplifiedTotalPrice implements ng.IController {
    public LOGIN_ONB: string;
    public getMarketOBPoints: any;
    public pointsChecked: any;
    public localdiscountWarningTextModel: [{type: string; text: string}];
    public selectedResidentDiscount: string;
    public selectedLargefamDiscount: string;
    public isShuttleFlow: any;
    public totalPrice;
    public isIbPlus: boolean;
    public isSelectedFare: boolean;
    public isMarketingAccepted: boolean;
    public marketingPermissions: IMarketingPermissions;
    public stepsMap: any = this.BookingAppConstants.TOTALPRICE_STEPS_MAP;
    public moduleId: string;
    public continueText: string;
    public isIbZero: boolean;
    public conditionsText: any;
    public shouldShowPriceDetailCTA: boolean = false;
    public redemption: boolean = false;
    public redemptionPriceModel: RedemptionTotalPriceModel;

    constructor (
        private $scope: ng.IScope,
        private BookingModalService: any,
        private BookingAppConstants: BookingAppConstants,
        private localStorageService:angular.local.storage.ILocalStorageService,
        private $filter: angular.IFilterService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private $rootScope: CommonsRootScope,
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService,
        private BookingUtilService : any,
        private IbNewModalAncillariesService: IbNewModalAncillariesService,
        private BookingTotalPriceRedemptionService: BookingTotalPriceRedemptionService
    ) {
        this.LOGIN_ONB = this.BookingAppConstants.LOGIN_ONB;
        this.getMarketOBPoints = this.localStorageService.get('getMarketOBPoints') || null;
        this.pointsChecked = this.localStorageService.get('pointsChecked');
        this.localdiscountWarningTextModel = [{ type: 'normal', text: '' }];
        this.selectedResidentDiscount = '';
        this.selectedLargefamDiscount = '';
        this.isShuttleFlow = this.localStorageService.get('isShuttleFlow');
        this.isIbPlus = this.CommonsUserUtilsService.isIbPlus() && !this.CommonsUserUtilsService.isSoftUser();
        this.isSelectedFare = false;
        this.isMarketingAccepted = false;
        this.marketingPermissions = [];
        this.isIbZero = this.CommonsUserUtilsService.isIbZero();

        this.$scope.$on('isFareSelectedAncOffers', this.updateSelectedFare);
        this.$scope.$on('updatePrice', this.updateTotalPrice);
        this.$rootScope.$on('showMarketingPerm', (evt, showMarketingPerm, markPermissions) => this.acceptMarketingPerm(showMarketingPerm, markPermissions));
    }

    $onInit () {
        if (this.redemption) {
            this.$rootScope.$on('totalBasket', this.totalPriceUpdate);

        }
        if (!this.continueText){
            this.checkStepMap();
        }
        this.shouldShowPriceDetailCTA = this.IbBookingPriceDetailModalService.checkShouldShowCTA();
        /*if(!this.conditionsText && this.$rootScope.isRedemptionFlow) {
            this.checkSubtextInRedemption();
        }*/
    }

    totalPriceUpdate = (event, updatedPrice): void => {
        setTimeout( () => {
            if (this.redemption) {
                this.totalPrice = {};
                this.totalPrice.price = this.BookingTotalPriceRedemptionService.getRedemptionTotalPriceModel(updatedPrice);
            }        
        });      
    };

    public checkSubtextInRedemption (): void {
        this.conditionsText = this.$filter('translate')('AVAILABILITY_SUMMARY_TOTAL_PRICE', { option: ''});
    }

    public acceptMarketingPerm (showMarketingPerm: boolean, markPermissions:IMarketingPermissions): void {
        if(!showMarketingPerm){
            this.marketingPermissions = markPermissions;
            this.isMarketingAccepted = true;
        } else {
            this.isMarketingAccepted = false;
        }
    }

    public updateSelectedFare = (event, isSelectedFare): void => {
        this.isSelectedFare = isSelectedFare;
    };

    private openInsuranceModal = () => {
        this.$scope.$emit('openInsuranceInfoCubaModal');
    };

    
    private openPetcFlowModal = (header: HeaderDataType['headerModel']) => {
        const modalRef = this.IbNewModalAncillariesService.openPetcFlowWarningModal();
        
        modalRef.result.then(
            (result) => {
                if (result.type === 'ADD_PET') {
                    this.IbNewModalAncillariesService.openAncillariesModal(result.ancillaryType);
                }
                if (result.type === 'CONTINUE_TO_PAYMENT') {
                    this.processPaymentValidationChain(header);
                }
            },
            () => {}
        );
        return; 
    };

    private _isPetFlightFilterSelected (headerBasket:  HeaderDataType['headerModel']) : boolean {
        const isPetFlightFilter = this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT);
        const ancillariesInfo = this.localStorageService.get<AncillariesStatusResponseModel>('ancillariesInfo').ancillaries;
        const isPetAvailable: boolean = (ancillariesInfo || []).some(
            (ancillary) => ancillary.type === 'PET' && ancillary.status.code === 'AVAILABLE'
        );

        return !headerBasket.shoppingBasket.petc.hasPetc && isPetFlightFilter && isPetAvailable;
    }

    public continueToPayment (): void {
        const header = this.localStorageService.get<HeaderDataType>('headerModel').headerModel;

        if(this._isPetFlightFilterSelected(header)) {
            this.openPetcFlowModal(header);
            return;
        }

        this.processPaymentValidationChain(header);
    }

    private processPaymentValidationChain (header: HeaderDataType['headerModel']): void {
        let shouldShowCubaInsuranceModal = (header.trips[0].destinyCode === 'HAV' || header.trips[0].originCode === 'HAV') && this.BookingAppConstants.market === 'ES';

        if (!shouldShowCubaInsuranceModal) {
            this.$scope.$emit('goToPayments');
            return;
        }

        if(!header.shoppingBasket) {
            this.openInsuranceModal();
            return;
        }

        if(!header.shoppingBasket.insurance.hasInsurance) {
            this.openInsuranceModal();
            return;
        }

        if(!header.shoppingBasket.insurance.info.offer.includes('COM025')){
            this.openInsuranceModal();
            return;
        }

        this.$scope.$emit('goToPayments');
    }

    public newAvailability = (): void => {
        this.$scope.$emit('recalculatePrice');
    };


    public openModalLinks = (): any => {
        this.BookingModalService.showGenericModal(true, 'ib-modal-avios-buy-v2.html', { idModal: 'ib-modal-avios-buy-v2.html' }).result.then(
            angular.noop,
            angular.noop
        );
    };
    


    public openPriceDetailModal = ($event: Event): any => {
        this.IbBookingPriceDetailModalService.openPriceDetailModal($event);
    };


    public updateTotalPrice = (event, updatedPrice): void => {
        this.totalPrice = updatedPrice;
    };

    public checkStepMap = (): void => {
        const defaultStep: string = 'default';
        const actualStep: string = this.localStorageService.get( 'actualStepFlow' ) ?? defaultStep;
        this.continueText = this.stepsMap[ actualStep ]?.text || this.stepsMap[ defaultStep ].text;
        this.moduleId = this.stepsMap[ actualStep ]?.id || this.stepsMap[ defaultStep ].id;
    };

}
