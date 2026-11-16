import * as angular from 'angular';
import { MonetateService } from './ib-monetate-service';
import { MonetateConstantsType } from '../ib-monetate-constants';
import { MonetateTransformer } from '../transformers/ib-monetate-transformer';

@Service('ib-monetate-bki-module',
    ['$window', 'MonetateService', '$rootScope', 'MonetateConstants', 'MonetateTransformer'])
export class MonetateUtilsService {
    public monetateQ: [];

    constructor (private $window: ng.IWindowService,
        private MonetateService: MonetateService,
        private $rootScope: CommonsRootScope,
        private MonetateConstants: MonetateConstantsType,
        private MonetateTransformer: MonetateTransformer
    ) {
        this.$rootScope.$on('sendUpdateToMonetate', this.sendUpdateToMonetate);
        this.$rootScope.$on('updateDigitalData', this.updateDigitalDataMonetate);
        this.$rootScope.$on('updatePageType', this.updatePageType);
    }

    /**
    * Initialize the monetate object
    */
    initializeMonetate = () => {
        this.MonetateService.initMonetate();
    };

    /**
     * Extends the current datalayer information with the received info
     * @param {Object} monetateInfo the information to extend current datalayer info
     */
    addMonetateInfo = (monetateInfo: (string | number | object)[]): void => {
        if (angular.isArray(monetateInfo)) {
            this.MonetateService.addMonetateGeneralInfo(monetateInfo);
        }
    };

    /**
     * Extends monetateQ object with the quadrigam info and the extended info given
     * @param pageType
     * @param {String} quadrigam the String with the quadrigam to be set
     * @param {Object} extendedObject the extended object to be added to monetateQ
     */
    updateMonetateWithQuadrigam = (pageType: string, quadrigam: string, extendedObject: object): void => {
        const extendMonetate: string[] = [];
        if (angular.isString(pageType)) {
            extendMonetate.push(pageType);
        }
        if (angular.isString(quadrigam)) {
            extendMonetate.push(quadrigam);
        }

        if (angular.isObject(extendedObject)) {
            angular.extend(extendMonetate, extendedObject);
        }
        this.addMonetateInfo(extendMonetate);
    };

    getMonetateDatalayerFormat = (varName: string, arrKeys: string[], originalObject: object): CommonsMonetateModels.DatalayerObject[] => {
        let resArray: CommonsMonetateModels.DatalayerObject[] = [];
        angular.forEach(arrKeys, (item) => {
            let obj: CommonsMonetateModels.DatalayerObject | CommonsMonetateModels.DatalayerObject[] = {};
            if (originalObject[item] && typeof (originalObject[item]) === 'object') {
                obj = this.getMonetateDatalayerFormat(`${varName}${item}_`, Object.keys(originalObject[item]), originalObject[item]);
            } else {
                obj.name = varName + item;
                obj.value = originalObject[item];
            }
            resArray = resArray.concat(obj);
        });
        return resArray;
    };

    /**
     * Extends monetateQ object with page type info and the extended info given
     * @param {String} pageType the page type to be added to monetateQ
     * @param pageName
     * @param {Object} monetateInfo the information to extend current datalayer info
     */
    updateMonetateWithPageType = (pageType: string, pageName: string, monetateInfo: (string | number | object)[]): void => {
        const pageTypeObject = [];
        if (angular.isString(pageType)) {
            pageTypeObject.push(pageType);
        }
        if (angular.isString(pageName)) {
            pageTypeObject.push(pageName);
        }
        this.MonetateService.addMonetatePageType(pageTypeObject);
        this.addMonetateInfo(monetateInfo);
    };

    addCustomVarsDigitalData = (arrCustomVars: object[]): void => {
        const extendVarsMonetate = [];
        arrCustomVars = arrCustomVars || [];
        extendVarsMonetate.push(this.MonetateConstants.MONETATE_INFO.CUSTOMVARS);
        extendVarsMonetate.push(arrCustomVars);
        this.updateMonetateWithPageType(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, this.$window.digital_data.Quadrigam, extendVarsMonetate);
    };

    updateDigitalDataMonetate = () => {
        let extendMonetate: object[] = [];
        let digitalDataArray = [];
        let digitalDataEcommerceArray = [];
        let digitalDataKeys = [];
        digitalDataKeys = Object.keys(this.$window.digital_data);
        if (digitalDataKeys.length) {
            digitalDataArray = this.getMonetateDatalayerFormat(this.MonetateConstants.PREFIX.DIGITAL_DATA, digitalDataKeys, this.$window.digital_data);
        }
        extendMonetate = digitalDataEcommerceArray.concat(digitalDataArray);
        this.addCustomVarsDigitalData(extendMonetate);
    };



    /**
     * Call Monetate Service with transformed flight review data
     *
     * @param {*} data booking Url parameters data
     * @param {*} passengers data about passengers and total passengers
     * @param selectedSlices
     * @param offerData
     * @param fareFamily
     */
    addFlightReviewMonetate = (data, passengers, selectedSlices, offerData, fareFamily) => {
        const newMonetateInfo: (string | number | object)[] = this.MonetateTransformer.createFlightReviewMonetate(data, passengers, selectedSlices, offerData, fareFamily);
        this.trackSelectedSegments(selectedSlices, offerData);
        this.updateMonetateWithPageType(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, this.$window.digital_data.Quadrigam, newMonetateInfo);
    };

    /**
     * Call Monetate Service with transformed flight search data
     *
     * @param {*} data booking Url parameters data
     * @param {*} passengers data about passengers and total passengers
     * @param {*} availability data about selected slices and fare families conditions
     */
    addFlightSearchMonetate = (data, passengers, availability) => {
        const monetateInfo = this.MonetateTransformer.createFlightSearchMonetate(data, passengers, availability);
        this.updateMonetateWithPageType(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, this.$window.digital_data.Quadrigam, monetateInfo);
    };
    addTrackProductDetail = (data: CommonsMonetateModels.OriginDestinationInfo[])=> {
        this.trackRouteProductDetails(data); 
    };


    /**
     * Call Monetate Service with transformed flight booking data
     *
     * @param {*} data booking Url parameters data
     * @param {*} passengers data about passengers and total passengers
     * @param {*} confirmation data about selected slices and booking
     * @param {*} fareFamilies list of fareFamilyConditions available
     */
    addFlightBookingMonetate = (data, passengers, confirmation, fareFamilies) => {
        const monetateBookingInfo = this.MonetateTransformer.createFlightBookingMonetate(data, passengers, confirmation, fareFamilies);
        this.updateMonetateWithPageType(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, this.$window.digital_data.Quadrigam, monetateBookingInfo);
    };

    /**
     * Send monetate info
     */
    updatePageType = (): void => {

        this.MonetateService.sendMonetatePageType();
    };


    sendUpdateToMonetate = () => {
        this.MonetateService.sendUpdateToMonetate();
    };

    trackAncillariesProductsAdded = (productCollection: CommonsSummaryInfoModels.AncillariesSummaryInfoModel, placeAdded: string): void => {
        this.MonetateService.trackAncillariesProductsAdded(this.MonetateTransformer.transformAncillariesInMonetateProductModel(productCollection), placeAdded);
    };

    trackFlightPassengers = (flightPassengersInfo: CommonsMonetateModels.FlightPassengersInfo): void => {
        this.MonetateService.trackAncillariesProductsAdded(this.MonetateTransformer.transformPassengersInMonetateProductModel(flightPassengersInfo), this.MonetateConstants.TRACK_PLACE.CART);
    };

    trackFlightCabin = (selectedTripInfo: CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo[], preferredCabin: string): void => {
        this.MonetateService.trackAncillariesProductsAdded(this.MonetateTransformer.transformCabinInMonetateProductModel(selectedTripInfo, preferredCabin), this.MonetateConstants.TRACK_PLACE.CART);
    };

    trackFareTypeSelected = (fareFamilyInfo: CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo[]): void => {
        this.MonetateService.trackAncillariesProductsAdded(this.MonetateTransformer.transformFareDataInProductModel(fareFamilyInfo), this.MonetateConstants.TRACK_PLACE.CART);
    };

    trackFlightDestination = (destinationAreasCitiesList: CommonsDestinationAreaCitiesModel.DestinationAreaCitiesListModel[], destinationCountry: CommonsMonetateModels.OriginDestinationInfo[]): void => {
        this.MonetateService.trackAncillariesProductsAdded(this.MonetateTransformer.transformDestinationAreasCitiesListInProductModel(destinationAreasCitiesList, destinationCountry), this.MonetateConstants.TRACK_PLACE.CART);
    };

    trackPurchasedProducts = (confirmationInfo: CommonsConfirmationInfoModel.ConfirmationInfo) => {
        this.MonetateService.trackAncillariesProductsAdded(this.MonetateTransformer.transformPurchasedInfoInProductModel(confirmationInfo), this.MonetateConstants.TRACK_PLACE.PURCHASE);
    };

    trackTripType = (originDestinationInfo: CommonsMonetateModels.OriginDestinationInfo[]) => {
        this.MonetateService.trackAncillariesProductsAdded(this.MonetateTransformer.transformOriginDestinationInfoIntoTripType(originDestinationInfo), this.MonetateConstants.TRACK_PLACE.CART);
    };
    trackRouteProductDetails = (originDestination: CommonsMonetateModels.OriginDestinationInfo[]) => {
        this.MonetateService.addProductDetails(this.MonetateTransformer.transformFlightRouteProductDetail(originDestination));
    };
    trackSelectedSegments = (selectedSlices, offerData) => {
        this.MonetateService.trackAncillariesProductsAdded(this.MonetateTransformer.transformSelectedOfferInProductModel(selectedSlices, offerData), this.MonetateConstants.TRACK_PLACE.CART);
    };

    updateMonetateInfo = () => {
        this.updateDigitalDataMonetate();
        this.sendUpdateToMonetate();
    };
    


}
