import angular from 'angular';
import { ibSubscriptionPermissionService } from '@shared/services/ib-utils/ib-subscriptions-permission.service';
import { IMarketingPermissions } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-contact-form/models/ib-booking-contact-form-models';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';

@Component( 'ib-booking-simplified-total-price-module', 'ibBookingSimplifiedTotalPrice',
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
            showLocaldiscountWarn: '<?',
            selectedResidentDiscount: '<?',
            selectedLargefamDiscount: '<?',
            continueText: '<?'
        },
        controllerAs: 'simpTotalPriceCtrl',
        templateUrl: ['BookingAppConstants', ( bkiConstants: BookingAppConstants ): string => bkiConstants.templatesRoute + 'ib-booking-simpified-total-price-view.html']
    }, ['$scope', 'BookingModalService', 'BookingAppConstants', 'localStorageService', '$filter', 'CommonsUserUtilsService', '$element', '$rootScope', 'ibSubscriptionPermissionService', 'IbBookingPriceDetailModalService'], [] )
export class ibBookingSimplifiedTotalPrice implements ng.IController {
    public LOGIN_ONB: string;
    public getMarketOBPoints: any;
    public pointsChecked: any;
    public localdiscountWarningTextModel: [{type: string; text: string}];
    public selectedResidentDiscount: string;
    public selectedLargefamDiscount: string;
    public isShuttleFlow: any;
    public showLocaldiscountWarn: boolean;
    public totalPrice;
    public isIbPlus: boolean;
    public isSelectedFare: boolean;
    public isMarketingAccepted: boolean;
    public marketingPermissions: IMarketingPermissions;
    public stepsMap: any = this.BookingAppConstants.TOTALPRICE_STEPS_MAP;
    public moduleId: string;
    public continueText: string;
    public isIbZero: boolean;
    public isAncillaries: boolean;
    public conditionsText: any;
    public shouldShowPriceDetailCTA: boolean = false;

    constructor (
        private $scope: ng.IScope,
        private BookingModalService: any,
        private BookingAppConstants: BookingAppConstants,
        private localStorageService:angular.local.storage.ILocalStorageService,
        private $filter: angular.IFilterService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private $element: ng.IAugmentedJQuery,
        private $rootScope: CommonsRootScope,
        private ibSubscriptionPermissionService: ibSubscriptionPermissionService,
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService
    ) {
        this.LOGIN_ONB = this.BookingAppConstants.LOGIN_ONB;
        this.getMarketOBPoints = this.localStorageService.get('getMarketOBPoints') || null;
        this.pointsChecked = this.localStorageService.get('pointsChecked');
        this.localdiscountWarningTextModel = [{ type: 'normal', text: '' }];
        this.showLocaldiscountWarn = false;
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
        this.$scope.$on('discountChange', (ev, discounts: any) => {
            this.selectedLargefamDiscount = discounts?.largeFamilyType;
            this.selectedResidentDiscount = discounts?.resident;
            this.showLocaldiscountWarn && this.setLocalDiscountWarnText();
        });
        this.$rootScope.$on('showMarketingPerm', (evt, showMarketingPerm, markPermissions) => this.acceptMarketingPerm(showMarketingPerm, markPermissions));
    }

    $onInit () {
        if (this.showLocaldiscountWarn === true) {
            this.setLocalDiscountWarnText();
        }
        if (!this.continueText){
            this.checkStepMap();
        }
        this.shouldShowPriceDetailCTA = this.IbBookingPriceDetailModalService.checkShouldShowCTA();
        /*if(!this.conditionsText && this.$rootScope.isRedemptionFlow) {
            this.checkSubtextInRedemption();
        }*/
    }

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

    public continueEvent = (): void => {
        const continueFlow = new CustomEvent( 'continueEventFlow', {
            bubbles: true,
            composed: true,
            cancelable: false
        } );
        if(this.isMarketingAccepted) {
            this.ibSubscriptionPermissionService.reqMarketingPermission(this.marketingPermissions, this.isIbZero);
        }
        this.$scope.$emit( 'continueEvent' );
        this.$element[0].dispatchEvent( continueFlow );
    };


    public newAvailability = (): void => {
        this.$scope.$emit('recalculatePrice');
    };


    public openModalLinks = (): any => {
        this.BookingModalService.showGenericModal(true, 'ib-modal-avios-buy-v2.html', { idModal: 'ib-modal-avios-buy-v2.html' }).result.finally(()=>{});
    };
    


    public openPriceDetailModal = ($event: Event): any => {
        this.IbBookingPriceDetailModalService.openPriceDetailModal($event);
    };



    private setLocalDiscountWarnText = (): void => {
        if (typeof this.selectedLargefamDiscount !== 'string' || typeof this.selectedResidentDiscount !== 'string') {
            this.showLocaldiscountWarn = false;
            return;
        }

        const key = this.determineLocalDiscountWarnKey(this.selectedResidentDiscount, this.selectedLargefamDiscount);
        if (!key) {
            this.showLocaldiscountWarn = false;
            return;
        }

        this.localdiscountWarningTextModel[0].text = this.$filter('translate')(key);
    };

    private determineLocalDiscountWarnKey = (resident: string, largefam: string): string | null => {
        const isResidentEmpty = resident === '';
        const isLargefamEmpty = largefam === '';

        if (isResidentEmpty && isLargefamEmpty) {
            return 'LOCALDISCOUNT_PRICEMODULE_WARN_NOSELECTED';
        }
        if (!isResidentEmpty && !isLargefamEmpty) {
            return 'LOCALDISCOUNT_PRICEMODULE_WARN_BOTHSELECTED';
        }
        if (!isResidentEmpty) {
            return 'LOCALDISCOUNT_PRICEMODULE_WARN_RESIDENTSELECTED';
        }
        if (!isLargefamEmpty) {
            return 'LOCALDISCOUNT_PRICEMODULE_WARN_LARGEFAMSELECTED';
        }
        return null;
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