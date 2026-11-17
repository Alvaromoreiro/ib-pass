import * as angular from 'angular';

export class PmtUpgBidsCreditCardsService {
    NUM_ATTEMPS = 0;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) { }

    getCreditCardsImgs = (): angular.IPromise<any> => {
        const endpoint = this.CheckinAncillariesConstants.ROUTES.icons + this.CheckinAncillariesConstants.ROUTES.creditCardsJson;
        const creditCards = this.localStorageService.get('creditCardsList');
        return new Promise((resolve, reject) => {
            if (creditCards === null) {
                this.CommonsGenericProxy.getGeneric(endpoint).then(
                    (data)=> {
                        resolve(data);
                    },
                    (error) => {
                        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });
            } else {
                resolve(creditCards);
            }
        });
    };
}
PmtUpgBidsCreditCardsService.$inject = ['CommonsGenericProxy', 'CheckinAncillariesConstants', 'localStorageService', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service(
        'PmtUpgBidsCreditCardsService',
        PmtUpgBidsCreditCardsService
    );
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service(
        'PmtUpgBidsCreditCardsService',
        PmtUpgBidsCreditCardsService
    );
}
