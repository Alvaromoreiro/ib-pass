import type { IbBookingHeaderFacadeService } from '../../components/ib-booking-header/services/ib-booking-header-facade.service';

@Service('ib-set-header-service-module', [
    'NewMainHeaderFacade', '$rootScope',
    'localStorageService', 'BookingUtilService'
])
export class IbSetHeaderService {

    constructor (
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private $rootScope: CommonsRootScope,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private BookingUtilService
    ) {}

    setHeader = (
        originDestination,
        currency,
        onLogin,
        onError,
        activate
    ) => {
        this.NewMainHeaderFacade.initHeader(
            {
                originDestination: originDestination,
                redemption: false,
                flightType: 'availabilityFlight',
                currency: currency,
                showModalBackHome: true,
                showAdvancedSearch: false
            },
            {
                hasSteps: true,
                steps: this.getSteps(),
                position: this.localStorageService.get('actualStepFlow') },
            {
                onLogin: onLogin,
                onError: onError,
                afterLogin: activate,
                userLogged: this.localStorageService.get('userLogged'),
                loggedData: this.localStorageService.get('customerData') || this.localStorageService.get('membershipData') || undefined
            });
    };

    private getSteps = () => {
        const flashOffer = this.BookingUtilService.getURLFirstParameterByName('flashOffer');
        const flashOfferId = this.BookingUtilService.getURLFirstParameterByName('flashOfferId');
        let steps = 'DEFAULT_STEPS';
        const isFlashOffer = flashOffer && flashOfferId;

        if (this.$rootScope.isRedemptionFlow) {
            steps = 'REDEMPTION_STEPS';
        } else if (this.$rootScope.isShuttleFlow) {
            steps = 'SHUTTLE_STEPS';
        } else if (isFlashOffer) {
            steps = 'FLASH_OFFER_STEPS';
        } else if (this.$rootScope.isPointsOBFlow ) { 
            steps = 'REDEMPTION_OB_STEPS';
        }
        return steps;

    };

    setDataOnBasket = (data, model) => {
        this.NewMainHeaderFacade.deleteTripsBasketFromDispo();
        this.NewMainHeaderFacade.updateTripsBasketFromDispo(data, model);
    };
}
