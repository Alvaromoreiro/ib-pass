import * as angular from 'angular';
import dayjs from 'dayjs';
import {CallAncillariesPageService} from '../services/ib-call-ancillaries-service';
import {MmBAncillariesService} from '../services/ib-MmB-ancillaries-service';
import {CallBundleService} from '../services/ib-call-bundle-service';
import {MmBDatalayerUtilsService} from '../services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service';
import {DatalayerUtils} from '../services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils';
import {MMBDatalayerConstants} from '../services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import {AncillariesConfigurationService} from '../services/ib-MmB-ancillaries-configuration-service';
import { MonetateUtilsService } from '@src/components/ib-reusable-components/ib-monetate/services/ib-monetate-utils';
import {MonetateConstantsType} from '@src/components/ib-reusable-components/ib-monetate/ib-monetate-constants';
import {AncillariesMMBConstants} from './constants/ib-MmB-ancillaries-constants';
import { MmBAncillariesUtilsService } from '../services/Utils/ib-ancillaries/ib-MmB-ancillaries-utils-service';
import { AncillariesModel } from 'ib-web-ancillaries/dist/app/core/models/ancillaries-model';

 const controllerInfo = {
    module: 'ib-MmB-ancillaries-page-module',
    inject: ['$scope', '$rootScope', '$window', 'MmBAncillariesService', 'MmBAncillariesUtilsService', 'localStorageService',
    'ModalServiceAncillaries', 'CallAncillariesPageService', 'AncillariesMMBConstants', '$timeout', 'DatalayerUtilsService',
    'NewMainHeaderFacade', 'CurrencyService', '$location', 'CommonsUtilService', 'CommonsModalService', 'AncillariesConfigurationService',
     'CallBundleService','MonetateUtilsService', 'MonetateConstants', 'DatalayerUtils'],
    required: []
};
export class AncillariesController implements ng.IController {
    public quadrigamStatus = false;
    public typeQuadrigam;
    public baggagesTrips;
    public speqsTrips;
    public seatConfirmationInfo;
    public dirtyResult;
    public result;
    public headerModel;
    public model: AncillariesModel.Model;
    public showOnHoldNotice: boolean;
    public userLogged: boolean;
    public flightAviosInfo: boolean;
    public bundelingView: boolean = false;

    constructor (
        private $scope: angular.IScope,
        private $rootScope: CommonsRootScope,
        private $window: ng.IWindowService,
        private MmBAncillariesService: MmBAncillariesService,
        private MmBAncillariesUtilsService: MmBAncillariesUtilsService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private ModalServiceAncillaries: any,
        private CallAncillariesPageService: CallAncillariesPageService,
        private AncillariesMMBConstants: AncillariesMMBConstants,
        private $timeout: ng.ITimeoutService,
        private DatalayerUtilsService: MmBDatalayerUtilsService,
        private NewMainHeaderFacade: any,
        private CurrencyService: CurrencyService,
        private $location: ng.ILocationService,
        private CommonsUtilService: CommonsUtilService,
        private CommonsModalService: CommonsModalService,
        private AncillariesConfigurationService: AncillariesConfigurationService,
        private CallBundleService: CallBundleService,
        private MonetateUtilsService: MonetateUtilsService,
        private MonetateConstants: MonetateConstantsType,
        private DatalayerUtils: DatalayerUtils) {

        this.$scope.$on('openInsuranceModal', this.openInsuranceModal);
        this.$scope.$on('selectInsurance', this.selectInsurance);
        this.$scope.$on('updateInsurance', this.updateInsurance);
        this.$scope.$on('openChangeResidenceCountry', this.openChangeResidenceCountry);
        this.$scope.$on('cancelChangesInsurance', this.cancelChangesInsurance);
        this.$scope.$on('changeInsuranceCountry', this.changeInsuranceCountry);
        this.$scope.$on('goToPaymentsMMB', this.goToPayments);
        this.$scope.$on('openInsuranceInfoModal', this.openInsuranceInfoModal);
        this.$rootScope.$on('totalBasket', this.updateTotalBasket);
        this.userLogged = this.logged();
        this.flightAviosInfo = this.MmBAncillariesUtilsService.validatedFlightAviosInfo();
    }

    logged = (): boolean => {
        return this.localStorageService.get('userLogged');
    };

    active = (): any => {
        this.model = this.AncillariesConfigurationService.initializeModel();
        // if(this.localStorageService.get('previousStepFlow')=== MMBDatalayerConstants.FLOWS.ANCILLARIES && this.localStorageService.get('actualStepFlow')=== MMBDatalayerConstants.FLOWS.PAYMENTS){
        //     this.$location.path('/ohmtdt');
        // }

        if (!this.MmBAncillariesService.redirectAfterLoginSoftUser()) {
            let insuranceSave, selectedFlex: any = {}, createOrderData: any = {}, selectedPriorityBoardingInfo,
                generalInfo:any = this.localStorageService.get('generalInfo');
            const flowApp = this.localStorageService.get('flowApp');
            this.localStorageService.remove('birthDate');
            this.localStorageService.set('showHideWaitingModal', true);
            this.showOnHoldNotice = false;
            this.localStorageService.set('previousStepFlow', this.localStorageService.get('actualStepFlow'));
            this.localStorageService.set('actualStepFlow', this.AncillariesMMBConstants.QUADRIGAM.ANCILLARIES_BKI.toLowerCase());
            this.$rootScope.$broadcast('updateHeaderInsurance', null);
            this.localStorageService.set('ancillariesAction', 'impression');
            this.headerModel = this.localStorageService.get('headerModel');

            this.$timeout(() => {
                this.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_CUSTOMIZE_YOU_FLIGHT');
            }, 1600);
            this.model.totalPayment = this.CurrencyService.formatPrice(this.model.currency, 0, true, false, false);
            this.seatConfirmationInfo = this.MmBAncillariesUtilsService.getSeatInfoConfirmation();

            this.$timeout(() => {
                this.$rootScope.showMainHeader = false;
                this.$rootScope.showHeaders = true;
            }, 1000);

            this.$timeout(() => {
                this.updateDatalayer(true);
            });

            this.MmBAncillariesService.searchAncillariesInfo().then((response) => {
                this.model.ancillariesTrips = response.ancillariesTrips;
                this.model.ancillariesAvailable = orderAncillaries(response.ancillariesAvailable);
                this.model.seatsAvailable = response.seatsAvailable;
                this.model.baggageAvailable = response.baggageAvailable;
                this.model.seatsQuanty = response.seatsQuanty;
                this.model.ancillariesInsurance = response.ancillariesInsurance;
                this.model.insuranceAvailable = response.insuranceAvailable;
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

                this.$rootScope.$broadcast('updateHeaderCurrency', this.model.currency);
                this.model.totalPayment = this.CurrencyService.formatPrice(this.model.currency, 0, true, false, false);
                let {offerSelected, model} = this.tranformMenusInfo(generalInfo, this.localStorageService.get('bookingInfo'));
                this.NewMainHeaderFacade.updateTripsBasketFromDispo(offerSelected, model);
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
                if (createOrderData && createOrderData.order && createOrderData.order.discountsApplied
                    && createOrderData.order.discountsApplied.discounts && createOrderData.order.discountsApplied.discounts.length > 0) {
                    this.localStorageService.set('hasDiscountsApplied', true);
                    angular.forEach(createOrderData.order.discountsApplied.discounts, (discount) => {
                        this.NewMainHeaderFacade.updateBasketDiscountsNew(discount, createOrderData.order.discountsApplied.originalPrice, createOrderData.order.discountsApplied.totalDiscount, (!this.CommonsUtilService.isDiscountTypePartnerEquivalent(discount.type) && (discount.type !== this.AncillariesMMBConstants.DISCOUNT_TYPES.PARTNER)) ? createOrderData.order.price.total : createOrderData.order.price.total - discount.totalDiscount);
                    });
                } else {
                    this.localStorageService.set('hasDiscountsApplied', false);
                }
                this.DatalayerUtilsService.updateDiscountData(createOrderData?.order?.specialDiscounts??[]);
                this.headerModel = this.localStorageService.get('headerModel');
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
            }, (error) => {
                this.MmBAncillariesService.generateRequestAncillaries(null,null,null);
            });

            const checkAncillariesInfo = () => {
                let headerModel: any = this.localStorageService.get('headerModel');
                let index;
                this.baggagesTrips = this.localStorageService.get('passengerBaggagesTrips') ? this.localStorageService.get('passengerBaggagesTrips') : this.model.passengerBaggagesTrips;
                this.speqsTrips = this.localStorageService.get('passengerSpeqsTrips') ? this.localStorageService.get('passengerSpeqsTrips') : this.model.passengerSpeqsTrips;
                const shoppingBasket = headerModel.shoppingBasket ? headerModel.shoppingBasket : headerModel.headerModel.shoppingBasket;
                const headerModelCarbonFootprint = shoppingBasket.carbonFootprint;
                headerModel = shoppingBasket.seats;
                if (headerModel.hasSeats) {
                    let count = 0;
                    for (index = 0; index < headerModel.segments.length; index++) {
                        count += headerModel.segments[index].quanty;
                    }
                    this.model.seatsQuanty = this.MmBAncillariesService.countSeatsTotal(count);
                }

                if (headerModelCarbonFootprint.hasCarbonFootprint) {
                    this.model.ancillariesCarbonFootprint.confirmed = true;
                }

                if (this.model.baggageAvailable && this.baggagesTrips) {
                    this.model.passengerBaggagesTrips = this.baggagesTrips;
                    this.model.baggagesQuanty = this.MmBAncillariesService.countBaggageTotal(this.model.passengerBaggagesTrips);
                }

                if (this.speqsTrips) {
                    this.model.passengerSpeqsTrips = this.speqsTrips;
                    this.model.speqsQuanty = this.MmBAncillariesService.countSpeqsTotal(this.model.passengerSpeqsTrips);
                }
            };
            //array of ancillaries types
            const orderAncillaries = (data) => {
                const ancillariesOrder:any = this.localStorageService.get('orderAncillariesModules');
                const result = [];
                if(ancillariesOrder) {
                    for(let i = 0; i < ancillariesOrder.length; i++) {
                        for(let j = 0; j < data.length; j++) {
                            if(ancillariesOrder[i] === data[j]) {
                                result.push(ancillariesOrder[i]);
                            }
                        }
                    }
                    for(let i = 0; i < data.length; i++) {
                        let ancillarieInList = false;
                        for(let j = 0; j < ancillariesOrder.length; j++) {
                            if(ancillariesOrder[j] === data[i]) {
                                ancillarieInList = true;
                            }
                        }
                        if(!ancillarieInList) {
                            result.push(data[i]);
                        }
                    }
                } else {
                    for(let i = 0; i < data.length; i++) {
                        result.push(data[i]);
                    }
                }
                return result;
            };
        }
        this.localStorageService.remove('genAviosAncillariesSeat');
        this.localStorageService.remove('bundleItems');

        this.getBundlesAvailability();
    };

    getBundlesAvailability (): void {
        this.CallBundleService.getBundle().then((bunldesAvailability: any) => {
            this.model.bundles = bunldesAvailability;
            if(this.model.bundles.bundles.length >= 1) {
                this.bundelingView = true;
                const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
                ancillariesInfo.bundles = bunldesAvailability.bundles;
                this.localStorageService.set('ancillariesInfo', ancillariesInfo);
                // this.$scope.$digest();
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
                    this.DatalayerUtils.setInsuranceEcommerce(this.model.selectedInsurance, MMBDatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
                    this.DatalayerUtilsService.setAncillariesDatalayer();
                    this.MmBAncillariesService.generateRequestAncillaries(this.model.passengerBaggagesTrips, this.model.passengerSpeqsTrips, this.model.selectedInsurance);
                } else {
                    const errorScroll = angular.element('[name="' + this.model.insuranceForm.$name + '"]').find('.ng-invalid:visible:first').offset().top - angular.element('.ib-header-common--full-container').innerHeight();
                    angular.element('html,body').animate({ scrollTop: errorScroll }, 'slow');
                }
            }
        } else {
            // this.DatalayerUtilsService.setAncillariesDatalayer();
            this.MmBAncillariesService.generateRequestAncillaries(this.model.passengerBaggagesTrips, this.model.passengerSpeqsTrips, null);
        }
    };

    /**
     * Open modal of Cuba conditions
     */
    openInsuranceInfoCubaModal = (evt, infoModal: any): void => {
        this.ModalServiceAncillaries.openInsuranceInfoCubaModal(infoModal);
    };

    searchPasenger = (nameKey: any, myArray: any): void => {
        for (let i = 0; i < myArray.length; i++) {
            if (myArray[i].id === nameKey) {
                myArray[i].currentSeat.column = '';
                myArray[i].currentSeat.row = '';
                myArray[i].initialSeat.column = '';
                myArray[i].initialSeat.row = '';
            }
        }
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
        this.ModalServiceAncillaries.openInsuranceModal({ insurance: this.model.insuranceInfo, insuranceInfo: insurance, ancillariesInsurance: this.model.ancillariesInsurance }, 'ib-insurance-change-country-modal-view.html').result.then(angular.noop, angular.noop);
    };

    /**
    * Open insurance modal for select the insurance
    */
    openInsuranceModal = (): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        const insuranceModel = {... this.model};
        this.closeCollapseHeader();
        this.ModalServiceAncillaries.openInsuranceModal({ insuranceInfo: insuranceModel, isCurrencyLong: this.model.isCurrencyLong }, 'ib-modal-insurance.html').result.then(() => {
            this.updateDatalayer();
        }, () => {
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
        let price, i, ancillariesInsuranceInfo: any = {};
        this.closeCollapseHeader();
        this.model.insuranceInfo.isModalLoading = true;
        this.CallAncillariesPageService.getInsurance(country.code).then((response: any) => {
            if (response.ancillaries[0].offers && response.ancillaries[0].offers.length > 0 && response.ancillaries[0].status.code === this.AncillariesMMBConstants.GENERAL_STATUS.AVAILABLE) {
                this.model.newSelectedIndurancePerCountry = response.ancillaries[0];
                this.model.ancillariesInsurance = [];
                for (i = 0; i < response.ancillaries[0].offers.length; i++) {
                    ancillariesInsuranceInfo = {};
                    price = this.MmBAncillariesService.getPriceOfferInsurance(this.model.currency, response.ancillaries[0].offers[i]);
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
                this.ModalServiceAncillaries.showGenericModal({ message: 'CKIANC_INSURANCE_WARNING_MODAL_INSURANCE_TEXT', needsTranslate: true, idModal: this.AncillariesMMBConstants.DATALAYER_MODAL_ID.INSURANCE_NOT_AVAILABLE }, true, null);
            }
        }, (error) => {
            this.model.insuranceInfo.isModalLoading = false;
            this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
        });

        const clearSelectedInsuranceValues = () => {
            angular.forEach(this.model.insuranceInfo.passengers, (pas) => {
                delete pas.document;
                delete pas.birthDate;
            });
            //this.model.selectedInsurance = this.model.ancillariesInsurance[0];
        }

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
            if (ancillarie.type === this.AncillariesMMBConstants.TYPE_ANCILLARIE.INSURANCE) {
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

    openInsuranceInfoModal = (evt, infoModal: any): void => {
        this.localStorageService.set('close', this.typeQuadrigam);
        this.ModalServiceAncillaries.openInsuranceInfoModal(infoModal);
    };

    closeOnholdLightBox = (event: any, show: any): void => {
        this.showOnHoldNotice = show;
    };

    updateDatalayer = (isActivate?:boolean): void => {
        const confirmationDigitalInfo:any = this.localStorageService.get('confirmationDigitalInfo') || {};
        const confirmationDatalayerInfo: any = this.localStorageService.get('confirmationDatalayerInfo') || {};
        this.quadrigamStatus = this.MmBAncillariesUtilsService.checkEarlyFlights(this.localStorageService.get('bookingInfo'), this.localStorageService.get('ancillariesAvailableSegments'));
        this.quadrigamStatus ? this.typeQuadrigam = this.AncillariesMMBConstants.QUADRIGAM.EARLY_ANCILLARIES : this.typeQuadrigam = this.AncillariesMMBConstants.QUADRIGAM.ANCILLARIES;
        this.typeQuadrigam = this.AncillariesMMBConstants.QUADRIGAM.ANCILLARIES_BKI;

        if (isActivate) {
            /* INIT DELETE GA4 MIGRATION*/
            this.DatalayerUtilsService.updateDatalayerWithQuadrigam(this.typeQuadrigam, confirmationDatalayerInfo, this.MmBAncillariesUtilsService.isUserLogged());
            /* FINISH DELETE GA4 MIGRATION*/
            this.DatalayerUtilsService.updateDigitalDataWithQuadrigam(this.typeQuadrigam, confirmationDigitalInfo, this.MmBAncillariesUtilsService.isUserLogged());
            this.DatalayerUtilsService.setProcessAndStep(confirmationDigitalInfo.Process,MMBDatalayerConstants.DATALAYER_VIEWS.ANCILLARIES,this.typeQuadrigam);
            /* INIT DELETE GA4 MIGRATION*/
            this.DatalayerUtilsService.sendDatalayerEvent(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
            /* FINISH DELETE GA4 MIGRATION*/
            this.DatalayerUtilsService.updateDatalayerViewEvent();
            this.MonetateUtilsService.updateMonetateWithQuadrigam(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, this.typeQuadrigam, null);
            this.$timeout(() => {
                this.$rootScope.$broadcast('sendUpdateToMonetate');
            });
            this.$rootScope.$broadcast('updateDatalayer');
            this.$rootScope.$broadcast('updateDigitalData');
        }
    };

    tranformMenusInfo = (generalInfo, bookingInfo) => {
        let model = {
            availabilityData:{
                originDestinations:[]
            },
            selectedSlices:[]
        };
        let offerSelected = {...generalInfo};
        offerSelected.price.ticketingFee = bookingInfo.order.price.ticketingFee;
        offerSelected.price.total = bookingInfo.order.price.total - generalInfo.paidDeposit.price;
        // offerSelected.price = bookingInfo.order.price;
        bookingInfo.order.slices.forEach((slice)=>{
            slice.segments.forEach((segment)=>{
                model.availabilityData.originDestinations.push({
                    originCity: segment.departureCity,
                    destinationCity: segment.arrivalCity
                });
                model.selectedSlices.push({
                    origin:segment.departureCity.code,
                    destination: segment.arrivalCity.code,
                    info:{
                        departureDateTime: segment.departureDateTime
                    }
                });
            });

        });
        return {offerSelected, model};
    }
}

try {
    AncillariesController.$inject = controllerInfo.inject;
    angular.module(controllerInfo.module).controller(AncillariesController.name, AncillariesController);

} catch (error) {
    const mod = angular.module(controllerInfo.module, controllerInfo.required);
    AncillariesController.$inject = controllerInfo.inject;
    mod.controller(AncillariesController.name, AncillariesController);
}
