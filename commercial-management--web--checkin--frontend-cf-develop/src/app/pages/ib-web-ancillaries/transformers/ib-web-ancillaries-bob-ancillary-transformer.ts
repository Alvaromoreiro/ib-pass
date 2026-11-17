import * as angular from 'angular';
import { CkiDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { TransformedAncillariesInfo } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer.model';

/**
 * INTEGRATED_BOB-ancillary handling extracted from AncillariesTransformer's
 * transformAncillariesView dispatch table
 */
export class IntegratedBobAncillaryTransformer {
    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CurrencyService: CurrencyService,
        private $rootScope: CommonsRootScope,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService
    ) {}

    handleIntegratedBobAncillarie = (ancillarie: any, transformedInfo: TransformedAncillariesInfo): void => {
        transformedInfo.bobAvailable = ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE;
        if (transformedInfo.bobAvailable) {
            transformedInfo.ancillariesAvailable.push(ancillarie.type);
            transformedInfo.bobInfo.slices = this.checkTypeUser(ancillarie.slices);
            const currency = this.CurrencyService.getCurrencyObject(transformedInfo.bobInfo.slices[0].products[0].currency);
            transformedInfo.bobInfo.slices[0].products[0].currency = currency;
            transformedInfo.bobInfo.priceFrom = this.CurrencyService.formatPrice(currency, Math.floor(transformedInfo.bobInfo.slices[0].products[0].price), false, false);
            transformedInfo.bobInfo.additionalBagsPrice = this.CurrencyService.formatPrice(
                currency,
                Math.floor(transformedInfo.bobInfo.slices[0].products[0].additionalBagsPrice),
                false,
                false
            );
            this.localStorageService.set('bobInfo', transformedInfo.bobInfo);

            const trackingCode = `${this.$rootScope.appLang}/${this.$rootScope.appMarket}/${this.localStorageService.get('actualStepFlow')}`;
            this.CkiDatalayerUtilsService.updateDatalayerEvents(
                this.CheckinAncillariesConstants.DATALAYER_INFO.MODULE_BOB,
                trackingCode,
                this.CheckinAncillariesConstants.DATALAYER_INFO.IMPRESSION +
                    (Math.floor(transformedInfo.bobInfo.slices[0].products[0].price) < 1
                        ? this.CheckinAncillariesConstants.DATALAYER_INFO.FREE
                        : this.CheckinAncillariesConstants.DATALAYER_INFO.PAYMENT),
                this.CheckinAncillariesConstants.DATALAYER_INFO.INTERACCION
            );
        }
    };

    private checkTypeUser = (slices: any): any => {
        const bookingInfo: CkiBookingInfo.BookingInfo = this.localStorageService.get('bookingInfo');
        const specialUser = [];
        let specialValue;
        if (bookingInfo) {
            bookingInfo.passengers.forEach((passenger) => {
                specialValue = null;
                specialValue = this.CheckinAncillariesConstants.BOB_FREE_TYPES.filter((type) => {
                    return passenger.frequentFlyer !== null && type === passenger.frequentFlyer.topTier;
                });
                if (specialValue.length > 0) {
                    specialUser.push(passenger.frequentFlyer);
                }
            });
            if (specialUser.length > 0) {
                this.localStorageService.set('frequentFlyerBOB', specialUser[0]);
                slices.forEach((slice) => {
                    slice.products.forEach((product) => {
                        product.additionalBagsPrice = 0;
                        product.price = 0;
                    });
                });
            }
        }
        return slices;
    };
}

IntegratedBobAncillaryTransformer.$inject = ['CheckinAncillariesConstants', 'localStorageService', 'CurrencyService', '$rootScope', 'CkiDatalayerUtilsService'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('IntegratedBobAncillaryTransformer', IntegratedBobAncillaryTransformer);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('IntegratedBobAncillaryTransformer', IntegratedBobAncillaryTransformer);
}
