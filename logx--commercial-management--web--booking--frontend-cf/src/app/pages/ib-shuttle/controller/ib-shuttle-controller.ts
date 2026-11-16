import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import * as angular from 'angular';

export class IbShuttleController {

    constructor (
        private $scope,
        private $rootScope,
        private localStorageService,
        private IbShuttleService,
        private BookingModalService,
        private $location,
        private DatalayerUtilsService,
        private DigitalDataUtilsService,
        private BookingAppConstants,
        private BookingUtilService,
        private NewMainHeaderFacade : IbBookingHeaderFacadeService,
        private $filter,
        private CurrencyService,
        private BookingPageUtilsService,
        private DatalayerBKIService,
        private BookingUserActivityService,
        private IbBookingPriceDetailModalService
    ) {
        this.$scope.$on('changeToObtention', this.changeToObtention);
        this.$scope.$on('changeToObtentionONB', this.changeToObtentionONB);
        this.$scope.$on('selectOffer', this.updateBasket);
        this.$scope.$on('setShuttleCoupon', this.setCoupon);
    }

    LOGIN_ONB = this.BookingAppConstants.LOGIN_ONB;
    model: any = {};
    flowApp = 'PAOB';
    withAvios = false;
    dataAux: any;
    infoAvios: any;
    coupon: any;


    $onInit ():void {
        this.activate();
    }

    ////////////////

    activate = () => {
        this.$rootScope.showHeaders = true;
        this.withAvios = !(this.flowApp === null || this.flowApp === 'PAREONB');
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent', true);
        this.IbShuttleService.getInitialParameters();
        this.localStorageService.set( 'searchFlightType', this.BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN );

        
        this.IbShuttleService.initShuttleFlow().then((data) => {
            this.IbBookingPriceDetailModalService.initPriceModalData();
            this.BookingUserActivityService.initKeepAliveTimer();
            this.BookingPageUtilsService.setPageTitle('PA_TITLE_PAGE_SUMMARY');
            this.flowApp = this.localStorageService.get('flowApp');
            this.initHeader(data);
            this.localStorageService.set('oBDiscountType', true);
            this.withAvios = this.localStorageService.get('flowApp') !== 'PAREONB';
            this.model.fareShuttleModel = data;
            this.model.fareData = this.IbShuttleService.getFareData();
            this.BookingModalService.finishWaiting();
            this.sendDatalayer();
        }, (error) => {
            this.BookingModalService.finishWaiting();
            this.localStorageService.set('availabilityErrror', error);
            this.$location.path('/ibbkerror');
        });
       
    };


    sendDatalayer = () => {
        let quadrigams = '';
       

        if (this.flowApp === 'PAOB') {
            quadrigams = this.BookingAppConstants.QUADRIGAMS.PA_SHUTTLE_FARE;
        } else if (this.flowApp === 'PARE') {
            quadrigams = this.BookingAppConstants.QUADRIGAMS.PA_SHUTTLE_REDENTION_FARE;
        } else if (this.flowApp === 'PAOBONB') {
            quadrigams = this.BookingAppConstants.QUADRIGAMS.PA_SHUTTLE_ONB_FARE;
        } else if (this.flowApp === 'PAREONB') {
            quadrigams = this.BookingAppConstants.QUADRIGAMS.PA_SHUTTLE_ONB_REDENTION_FARE;
        }
    
        this.DatalayerUtilsService.addShuttleDigitalData(this.localStorageService.get('actualStepFlow'), this.model);
        this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam(quadrigams, {});
        this.DatalayerUtilsService.updateDatalayerViewEvent();
        this.DatalayerBKIService.getDigitalDataEcommerce(this.localStorageService.get('selectedTripInfo'), 'view_item_list');

    };

    changeToObtention = () => {
        this.$rootScope.redirectFromRedention = true;
        this.$rootScope.isRedemptionFlow = false;
        this.localStorageService.set('flowApp', 'PAOB');
        this.activate();
    };

    changeToObtentionONB = () => {
        this.$rootScope.redirectFromRedention = true;
        this.$rootScope.isRedemptionFlow = false;
        this.localStorageService.set('flowApp', 'PAOBONB');
        this.activate();
    };

    initHeader = (data) => {
        let showBasket = false;
        this.dataAux = angular.copy(data);
        if (this.flowApp === 'PAOB' || this.flowApp === 'PAOBONB') {
            showBasket = true;
        }
        if ((this.flowApp === 'PARE' || this.flowApp === 'PAREONB') && data.offers && data.offers.fareRate && data.offers.fareRate.length > 0) {
            angular.forEach(data.offers.fareRate, (offer) => {
                if (offer.selected) {
                    this.dataAux.offers = [offer];
                    showBasket = true;
                }
            });
            if (showBasket) {
                this.infoAvios = {
                    totalPrice: {
                        [this.dataAux.priceInfo.fareAviosPerPassenger ? 'fareAviosPerPassenger' : 'farePointsPerPassenger']: this.dataAux.priceInfo.fareAviosPerPassenger ? this.dataAux.priceInfo.fareAviosPerPassenger : this.dataAux.priceInfo.farePointsPerPassenger,
                        fareCashPerPassenger: this.dataAux.priceInfo.fareCashPerPassenger,
                        price: {
                            redemptionOptionId: this.dataAux.priceInfo.redemptionOptionId,
                            [this.dataAux.priceInfo.totalAvios ? 'totalAvios' : 'totalPoints']: this.dataAux.priceInfo.totalAvios ? this.dataAux.priceInfo.totalAvios : this.dataAux.priceInfo.totalPoints,
                            totalCash: this.dataAux.priceInfo.totalCash
                        }
                    },
                    summaryInfo: { passengers: { generalData: {} } }
                };
                angular.forEach(data.passengerInfo, (passenger, key: any) => {
                    if (passenger) {
                        this.infoAvios.summaryInfo.passengers.generalData[this.$filter('uppercase')(key.slice(0, -1))] = [{
                            number: passenger,
                            fare: this.dataAux.offers[0].fareCashPerPassenger,
                            totalTax: this.dataAux.offers[0].offerItems[0].price.tax * passenger,
                            aviosFare: this.dataAux.offers[0].fareAviosPerPassenger ? this.dataAux.offers[0].fareAviosPerPassenger : this.dataAux.offers[0].farePointsPerPassenger
                        }];
                    }
                });
            }
        }
        this.NewMainHeaderFacade.initHeader(
            {
                originDestination: this.localStorageService.get('originDestination'),
                flightType: 'shuttleFlow',
                currency: this.CurrencyService.getCurrencyObject(data.currencies[0]) || 'REDEMPTION',  // 'currency': data.currencies[0] || 'REDEMPTION',
                showBasket: showBasket,
                showModalBackHome: true
            },
            { hasSteps: true, steps: 'SHUTTLE_STEPS', position: this.localStorageService.get('actualStepFlow') },
            {
                onLogin: this.onLogin,
                onError: this.onError,
                afterLogin: this.activate,
                loggedData: this.localStorageService.get('customerData') || this.localStorageService.get('membershipData') || undefined
            }
        );
        if (showBasket) {
            this.NewMainHeaderFacade.updateTrips(this.dataAux, this.infoAvios ? this.infoAvios : null);
        }

    };

    showAviosAndMoney = () => {
        return this.withAvios && this.$rootScope.isRedemptionFlow && this.model.fareShuttleModel && this.model.fareShuttleModel.offers;
    };

    showTotalPrice = () => {
        return this.model.fareShuttleModel && (!this.$rootScope.isRedemptionFlow || !this.model.fareShuttleModel.offers || !this.model.fareData.withoutAviosMoney);
    };

    showWithoutPoints = () => {
        return this.$rootScope.isRedemptionFlow && !this.withAvios && this.model.fareShuttleModel && this.model.fareShuttleModel.offers && this.model.fareData.withoutAviosMoney;
    };

    updateBasket = (event, data) => {
        if (this.dataAux && this.infoAvios) {
            this.dataAux.offers = [data];
            this.infoAvios.totalPrice.fareAviosPerPassenger = data.fareAviosPerPassenger;
            this.infoAvios.totalPrice.fareCashPerPassenger = data.fareCashPerPassenger;
            this.infoAvios.totalPrice.price.redemptionOptionId = data.redemptionOptionId;
            this.infoAvios.totalPrice.price.totalAvios = data.avios.fare;
            this.infoAvios.totalPrice.price.totalCash = data.cash.fare;
            this.dataAux.priceInfo.fareAviosPerPassenger = data.fareAviosPerPassenger;
            this.dataAux.priceInfo.fareCashPerPassenger = data.fareCashPerPassenger;
            this.dataAux.priceInfo.redemptionOptionId = data.redemptionOptionId;
            this.dataAux.priceInfo.totalAvios = data.avios.fare;
            this.dataAux.priceInfo.totalCash = data.cash.fare;
            angular.forEach(this.dataAux.passengerInfo, (passenger, key: any) => {
                if (passenger) {
                    this.infoAvios.summaryInfo.passengers.generalData[this.$filter('uppercase')(key.slice(0, -1))] = [{
                        number: passenger,
                        fare: this.dataAux.offers[0].fareCashPerPassenger,
                        totalTax: this.dataAux.offers[0].offerItems[0].price.tax * passenger,
                        aviosFare: this.dataAux.offers[0].fareAviosPerPassenger
                    }];
                }
            });
            this.NewMainHeaderFacade.updateTrips(this.dataAux, this.infoAvios ? this.infoAvios : null);
        }
    };

    setCoupon = (event, coupon) => {
        const elementSelected = 1;
        if (coupon) {
            const commercialData: any = this.localStorageService.get('commercialData');
            for (let i = 0; i < coupon.offerList.length; i++) {
                this.model.fareData.fareRate[i].avios.fare = coupon.offerList[i].discountedPrice.totalPoints.fare;
                this.model.fareData.fareRate[i].cash.fare = coupon.offerList[i].discountedPrice.totalCash.fare;
                this.model.fareData.fareRate[i].formatPrice = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), this.model.fareData.fareRate[i].cash.fare + this.model.fareData.totalPrice.tax, true);
                this.model.fareData.fareRate[i].formatAvios = this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, this.model.fareData.fareRate[i].avios.fare);
                this.model.fareData.fareRate[i].redemptionOptionId = coupon.offerList[i].optionId;
                // Price without discount
                this.model.fareData.fareRate[i].aviosWithoutDiscount.fare = coupon.offerList[i].basePrice.totalPoints.fare;
                this.model.fareData.fareRate[i].cashWithoutDiscount.fare = coupon.offerList[i].basePrice.totalCash.fare;
                this.model.fareData.fareRate[i].formatOldPrice = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(commercialData.currency), this.model.fareData.fareRate[i].cashWithoutDiscount.fare + this.model.fareData.totalPrice.tax, true);
                this.model.fareData.fareRate[i].formatOldAvios = this.CurrencyService.formatAvios(commercialData.currency.groupingSeparator, this.model.fareData.fareRate[i].aviosWithoutDiscount.fare);

            }
            this.model.fareData.totalPrice.couponApplied = true;
            this.coupon = coupon;
        } else {
            this.coupon = null;
        }

        this.$rootScope.$broadcast('selectOffer', this.model.fareData.fareRate[(this.model.fareData.totalPrice.redemptionOptionId - 1) % this.model.fareData.fareRate.length]);
    };

    onLogin = () => {
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
    };

    onError = (error) => {
        this.BookingModalService.finishWaiting();
        this.BookingModalService.showLoginErrorModal(error, true, null, error.stateUserLogged ? 'ib-modals--backdrop-off' : null);
    };
}
const inject = ['$scope', '$rootScope', 'localStorageService', 'IbShuttleService', 'BookingModalService', '$location', 'DatalayerUtilsService', 'DigitalDataUtilsService', 'BookingAppConstants', 'BookingUtilService', 'NewMainHeaderFacade', '$filter', 'CurrencyService', 'BookingPageUtilsService', 'DatalayerBKIService', 'BookingUserActivityService', 'IbBookingPriceDetailModalService'];
const selector: string = 'ibShuttle';
const options = {
    bindings: {
    },
    controllerAs: 'shuttleCtrl',
    controller: IbShuttleController,
    templateUrl: ['BookingRouterConstants', (BookingRouterConstants) => {
        return BookingRouterConstants.templatesRoute + BookingRouterConstants.shuttleCtrlViewRoute;
    }]
};

try {
    const mod = angular.module('ib-shuttle-module');
    IbShuttleController.$inject = inject;
    mod.component(
        selector,
        options);
} catch (error) {
    const mod = angular.module('ib-shuttle-module', []);
    IbShuttleController.$inject = inject;
    mod.component(
        selector,
        options);

}
