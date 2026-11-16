import * as angular from 'angular';
import { CommonsConstantsType } from '../../constants/ib-commons-constants';
import { DatalayerConstantsType } from '../../ib-datalayer/ib-datalayer-constants';
import { CommonsUserUtilsService } from 'src/app/core/utils/ib-commons-user-utils.service';

@Controller('ib-commons-modal-service-module',
    ['$rootScope', '$uibModalInstance', 'object', 'DatalayerUtilsService', 'RedirectionService', '$filter', 'localStorageService', 'DatalayerConstants', 'CommonsConstants', 'CommonsUserUtilsService'])
class GenericModalController implements angular.IController {
    public model: any = {};
    public flowApp: string;
    public isDestinationCity: boolean;
    public destinationCity: string;
    public isPlaneMessage: boolean = false;
    public isLogguedUser: boolean = false;
    constructor (private $rootScope: CommonsRootScope,
        private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
        private object: object,
        private DatalayerUtilsService: any,
        private RedirectionService: any,
        private $filter: ng.IFilterFunction,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private DatalayerConstants: DatalayerConstantsType,
        private CommonsConstants: CommonsConstantsType,
        private CommonsUserUtilsService: CommonsUserUtilsService) {
        this.model = this.object;
        this.$rootScope.$on('customerDataModalWaiting', this.showInfoWaitingModal);
        this.$rootScope.$on('getCustomerDataBonusCheck', this.showInfoWaitingModal);
        this.flowApp = this.localStorageService.get('flowApp');
    }


  ////////////////
  $onInit() {
    const idModal: object =
      this.model && this.model.idModal ? this.model.idModal : this.model;
    this.DatalayerUtilsService.sendDatalayerModalEvent(idModal);
    this.$uibModalInstance.result.then(
      this.DatalayerUtilsService.removeDatalayerModalAttrs,
      this.DatalayerUtilsService.removeDatalayerModalAttrs,
    );
    this.isDestinationCity = false;
    this.destinationCity = "";

    this.showInfoWaitingModal();
  }

  /**
   * Closes the modal dismissing its instance
   */
  close = (): void => {
    this.$uibModalInstance.dismiss();
  };

  /**
   * Closes the modal calling close method of its instance
   */
  accept = (type: object) => {
    this.$uibModalInstance.close(type);
  };

  /**
   * Closes the modal calling close method of its instance and redirect to link BUY-AVIOS
   */
  acceptBuyAvios = (): void => {
    const newUrl: string = this.$filter("LinksFilter")("BUY_AVIOS");
    this.close();
    this.RedirectionService.externalRedirect(newUrl);
  };

  /**
   * Closes de modal and sets a falg in rootscope to let keepalive service that should  refresh all flow
   * after execute ignore order.
   */
  keepAliveCloseReloadFlow = (): void => {
    this.$rootScope.keepAliveRefreshFlow = true;
    this.close();
  };

    /**
     * Show info user
     */
    showInfoWaitingModal = (e?: any, eventCustomerData?: any): void => {
        const logged = this.localStorageService.get('userLogged') as boolean | null;
        const loadingNextFlow: number = this.localStorageService.get('loadingNextFlow') ?? 1;
        const destinationCity: any = this.localStorageService.get('originDestination');
        const isEffectiveLogged = logged && !this.CommonsUserUtilsService.isSoftUser();
        let customerData: any = null;
        let cashAviosPossibilities: any = null;
        let commercialData: any = null;
        let calculatedPoints: any = null;
        this.model = angular.isDefined(this.model) ? this.model : {};
        if (this.model) {
            this.model.userData = {};
            this.model.userData.isLogged =  isEffectiveLogged;
            this.model.userData.destinationCity = (destinationCity !== null && destinationCity.destinationCity !== null && typeof destinationCity.destinationCity.description === 'string') ? destinationCity.destinationCity.description : null;
            this.model.userData.isPassenger = false;
            this.model.userData.isAncillaries = false;
            this.model.userData.isPayments = false;
            switch (loadingNextFlow) {
                    case 1:
                        this.model.userData.isAvailability = true;
                        break;
                    case 2:
                        this.model.userData.isPassenger = true;
                        break;
                    case 3:
                        this.model.userData.isAncillaries = true;
                        break;
                    case 4:
                        this.model.userData.isPayments = true;
                        break;
                    default:
                        this.model.userData.isAvailability = true;
                        break;
            }
        }
        if (isEffectiveLogged && this.model) {
            cashAviosPossibilities = this.localStorageService.get('cashAviosPossibilities') !== null ? this.localStorageService.get('cashAviosPossibilities') : null;
            calculatedPoints = this.localStorageService.get('CalculatedPoints') ? this.localStorageService.get('CalculatedPoints') : this.localStorageService.get('changeFlightAvios');
            commercialData = this.localStorageService.get('commercialData') !== null ? this.localStorageService.get('commercialData') : null;

      if (eventCustomerData) {
        customerData = eventCustomerData;
      } else if (
        angular.isDefined(this.$rootScope.customerData) &&
        this.$rootScope.customerData !== null
      ) {
        customerData = this.$rootScope.customerData;
      } else if (this.localStorageService.get("customerData") !== null) {
        customerData = this.localStorageService.get("customerData");
      }

            this.model.userData.selectedParner = null;
            this.model.userData.earnAvios = calculatedPoints?.Avios ? calculatedPoints.Avios : (calculatedPoints?.avios ? calculatedPoints.avios : null);
            this.model.userData.earnElite = calculatedPoints?.Elite ? calculatedPoints.Elite : (calculatedPoints?.elite ? calculatedPoints.elite : null);
            this.model.userData.message = null;
            this.model.userData.messageSearching = null;
            this.model.userData.discountMessage = true;
            this.model.userData.earnMessage = false;
            if (customerData !== null && typeof customerData === 'object') {
                if (customerData.personalInfo !== null && typeof customerData.personalInfo === 'object') {
                    this.model.userData.name = typeof customerData.personalInfo.name === 'string' ? customerData.personalInfo.name : '';
                    if (customerData.personalInfo.partnersInfoBKI !== null && Array.isArray(customerData.personalInfo.partnersInfoBKI)) {
                        this.model.userData.selectedParner = customerData.personalInfo.partnersInfoBKI.find(element => element.isSelected) || null;
                    }
                }
                if (customerData.generalInfo !== null && typeof customerData.generalInfo === 'object') {
                    this.model.userData.avios = typeof customerData.generalInfo.aviosTransformed === 'string' ? customerData.generalInfo.aviosTransformed : '';
                    this.model.userData.category = typeof customerData.generalInfo.category === 'string' ? customerData.generalInfo.category : '';
                }
            }
            if (cashAviosPossibilities !== null && typeof cashAviosPossibilities === 'object' && cashAviosPossibilities.length > 0) {
                const numberOfPossibilities = cashAviosPossibilities.length;
                this.model.userData.cashAviosPossibilities = {};
                this.model.userData.cashAviosPossibilities.bestOfferAvailable = cashAviosPossibilities[numberOfPossibilities - 1];
                if (!this.model.userData.cashAviosPossibilities.bestOfferAvailable.offerAvailable) {
                    for (let i = numberOfPossibilities - 2; i > 0; i--) {
                        if (cashAviosPossibilities[i].offerAvailable) {
                            this.model.userData.cashAviosPossibilities.bestOfferAvailable = cashAviosPossibilities[i];
                            i = 0;
                        }
                    }
                }
                if (commercialData !== null && typeof commercialData === 'object' && commercialData.currency !== null && typeof commercialData.currency === 'object' && commercialData.currency.recommendedDisplay !== null && typeof commercialData.currency.recommendedDisplay === 'string' && this.model.userData.cashAviosPossibilities.bestOfferAvailable.offerAvailable) {
                    if (commercialData.currency.recommendedDisplay === 'symbol') {
                        this.model.userData.cashAviosPossibilities.currency = commercialData.currency.symbol;
                    } else {
                        this.model.userData.cashAviosPossibilities.currency = commercialData.currency.code;
                    }
                    this.model.userData.cashAviosPossibilities.bestTotalDiscount = this.model.userData.cashAviosPossibilities.bestOfferAvailable.totalDiscount + this.model.userData.cashAviosPossibilities.currency;
                }
            }

      if (
        this.model.userData.avios === 0 ||
        (cashAviosPossibilities !== null &&
          cashAviosPossibilities.length === 0) ||
        cashAviosPossibilities === null ||
        !this.model.userData.cashAviosPossibilities.bestOfferAvailable
          .offerAvailable ||
        this.model.userData.cashAviosPossibilities.bestOfferAvailable === null
      ) {
        this.model.userData.discountMessage = false;
        this.model.userData.earnMessage = true;
        this.localStorageService.set("loadingEarnMessage", true);
      } else {
        this.model.userData.discountMessage = true;
        this.model.userData.earnMessage = false;
        this.localStorageService.set("loadingEarnMessage", false);
      }
    }
  };

    /**
     * Show destination city using root or data model
     */
    showDestinationCity = (destinationCity: any) => {
        this.resetDestinationCity();
    
        if (this.model?.userData?.isAvailability) {
            this.updateDestinationCity(destinationCity);
            this.updatePlaneMessage();
            this.updateLoggedUser();
        }
        return this.isDestinationCity;
    };
    
    private resetDestinationCity (): void {
        this.destinationCity = '';
        this.isDestinationCity = false;
    }
    
    private updateDestinationCity (destinationCity: any): void {
        if (typeof destinationCity === 'string' && destinationCity.length > 0) {
            this.destinationCity = destinationCity;
            this.isDestinationCity = true;
        } else if (this.model?.userData?.destinationCity && this.model.userData.destinationCity.length > 0) {
            this.destinationCity = this.model.userData.destinationCity;
            this.isDestinationCity = true;
        }
    }
    
    private updatePlaneMessage (): void {
        const shouldShowPlaneMessage = 
            !this.model?.userData?.isLogged &&
            this.flowApp !== 'GIFTCARDS' &&
            this.isDestinationCity &&
            !this.model.isPassenger;
        
        if (shouldShowPlaneMessage) {
            this.isPlaneMessage = true;
        }
    }
    
    private updateLoggedUser (): void {
        if (this.model?.userData?.isLogged && this.model.userData?.name) {
            this.isLogguedUser = true;
        }
    }
}
