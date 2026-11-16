import angular from 'angular';
import { MmBAncillariesUtilsService } from '../../../services/Utils/ib-ancillaries/ib-MmB-ancillaries-utils-service';

const componentOptions = {
    bindings: {
        totalPrice: '='
    },
    controllerAs: 'brkdownAnciCtrl',
    templateUrl: ['$rootScope', function ($rootScope) {
        return $rootScope.routes.templates + 'ib-MmB-breakdown-ancillaries-view.html';
    }]
};


const componentInfo = {
    module: 'ib-MmB-ancillaries-page-module',
    selector: 'ibMmbBreakdownAncillaries',
    inject: ['$scope', '$rootScope', 'localStorageService', '$sce', 'MmBAncillariesUtilsService'],
    required: []
};

export class ibBreakdownAncillaries implements ng.IController {
    public relatedContent;
    public aviosToEarn;
    public elitePointsToEarn;
    public flightAviosInfo: boolean;
    public isCubaInsuranceModalShown: boolean;
    constructor (
        private $scope: angular.IScope,
        private $rootScope: CommonsRootScope,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $sce: any,
        private MmBAncillariesUtilsService: MmBAncillariesUtilsService
    ) {
        const getAviosAndElitePointsEvent = this.$scope.$on('updateAvios', this.getAviosAndElitePoints);
        this.$scope.$on('$destroy', getAviosAndElitePointsEvent);
        this.flightAviosInfo = this.MmBAncillariesUtilsService.validatedFlightAviosInfo();
    }

    $onInit (): void {
        this.getRelatedContent();
        if (this.$rootScope.flowName === 'BKI' && this.$rootScope.appMarket === 'ES') {
            const country:any = this.localStorageService.get('headerModel');
            this.isCubaInsuranceModalShown = country.headerModel.trips[0].destinyCode !== 'HAV' && country.headerModel.trips[0].originCode !== 'HAV';
        } else {
            this.isCubaInsuranceModalShown = true;
        }
    }

    goPayment = (): void => {
        const headerModel:any = this.localStorageService.get('headerModel');
        if(headerModel.shoppingBasket) {
            if (!this.isCubaInsuranceModalShown && !headerModel.shoppingBasket.insurance.hasInsurance) {
                this.$scope.$emit('openInsuranceInfoCubaModal');
                this.isCubaInsuranceModalShown = true;
            }else if(!this.isCubaInsuranceModalShown && headerModel.shoppingBasket.insurance.hasInsurance) {
                if (!headerModel.shoppingBasket.insurance.info.offer.includes('COM025')) {
                    this.$scope.$emit('openInsuranceInfoCubaModal');
                    this.isCubaInsuranceModalShown = true;
                }else {
                    this.$scope.$emit('goToPaymentsMMB');
                }
            }else {
                this.$scope.$emit('goToPaymentsMMB');
            }
        } else if(!this.isCubaInsuranceModalShown && !headerModel.shoppingBasket) {
            this.$scope.$emit('openInsuranceInfoCubaModal');
            this.isCubaInsuranceModalShown = true;
        } else {
            this.$scope.$emit('goToPaymentsMMB');
        }
    };

    /**
     * Get relatedContent from localStorageService to show in BBKI flow
     */
    getRelatedContent = (): void => {
        const bookingInfo: ImportOrderData.completeOrder = this.localStorageService.get('bookingInfo');
        if (bookingInfo.relatedContent) {
            angular.forEach(bookingInfo.relatedContent, (content) => {
                if (content.key === 'CONFIRM_ONHOLD_CONDITIONS') {
                    this.relatedContent = this.createObjRelatedContent(content);
                    this.getAviosAndElitePoints();
                }
            });
        }
    };

    /**
     * Get Avios and Elite Points from localStorageService to show in BBKI flow
     */
    getAviosAndElitePoints = (): void => {
        const pointsData: any = this.localStorageService.get('CalculatedPoints');
        this.aviosToEarn = pointsData ? pointsData.Avios : 0;
        this.elitePointsToEarn = pointsData ? pointsData.Elite : 0;
        this.flightAviosInfo = this.MmBAncillariesUtilsService.validatedFlightAviosInfo();
    };

    /**
   * Return Object with all information about related content return in order service
   * @param {*} relatedContent
   */
    createObjRelatedContent =(relatedContent):any=> {
        let returnedRelatedContent:any = {};
        if (relatedContent.key === 'CONFIRM_ONHOLD_CONDITIONS') {
            returnedRelatedContent = { original: { totalPriceText: relatedContent.value ? relatedContent.value : null }, transformed: {} };
            if (relatedContent.value) {
                returnedRelatedContent.transformed.TOTAL_PRICE = this.$sce.trustAsHtml(relatedContent.value);
            }
        }
        return returnedRelatedContent;
    };
}



try {
    const mod = angular.module(componentInfo.module);
    ibBreakdownAncillaries.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: ibBreakdownAncillaries })
    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    ibBreakdownAncillaries.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: ibBreakdownAncillaries })
    );
}
