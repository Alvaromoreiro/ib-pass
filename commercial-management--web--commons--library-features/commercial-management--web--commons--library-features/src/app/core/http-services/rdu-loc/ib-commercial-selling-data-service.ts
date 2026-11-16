import {CommonsHttpUtilsErrorService} from '../../utils/http-utils-services/ib-commons-http-utils-error-service';
import {CommonsConstantsType} from '../../constants/ib-commons-constants';
import {CommonsHttpServicesConstantsType} from '../../constants/ib-commons-http-service-constants';
import {CommonsCommercialSellingDataUtils} from '../../utils/ib-commons-commercial-selling-data-utils';
import {CommonsGenericProxy} from '../../proxies/ib-commons-generic-proxy';
import {CurrencyService} from '../../utils/ib-commons-currency-service';

@Service('ib-commons-http-service-module',
    ['$q', 'CommonsGenericProxy', 'CommonsHttpUtilsErrorService', 'CommonsHttpServicesConstants', 'localStorageService', '$rootScope', 'CommonsCommercialSellingDataUtils', 'CommonsConstants', 'CurrencyService'])
export class CommonsCommercialSellingDataService {

    private numberAttemps: number = 0;

    constructor (private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private $rootScope: CommonsRootScope,
        private CommonsCommercialSellingDataUtils: CommonsCommercialSellingDataUtils,
        private CommonsConstants: CommonsConstantsType,
        private CurrencyService: CurrencyService) {
    }

    getCommercialInfo = (promise?: ng.IDeferred<any>) :ng.IPromise<any> => {
        let defer = promise || this.$q.defer();
        const endpoint = this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.commercialSellingDataURI;

        const getCommercialInfoSuccess = (commercialData): void => {
            let commercialDataStoraged: any = {};
            const customerData: any = this.localStorageService.get('isLogged') === this.CommonsConstants.LOGIN_ONB ? this.localStorageService.get('membershipData') : this.localStorageService.get('customerData');
            this.localStorageService.set('commercialData', this.CommonsCommercialSellingDataUtils.getCommercialsellingDataByMarket(commercialData.data));
            if (customerData) {
                commercialDataStoraged = this.localStorageService.get('commercialData');
                customerData.generalInfo.aviosTransformed = commercialDataStoraged && commercialDataStoraged.currency && commercialDataStoraged.currency.groupingSeparator ? this.CurrencyService.formatAvios(commercialDataStoraged.currency.groupingSeparator, customerData.generalInfo.avios) : customerData.generalInfo.avios;
                if (this.localStorageService.get('isLogged') === this.CommonsConstants.LOGIN_ONB) {
                    this.$rootScope.membershipData = customerData;
                    this.localStorageService.set('membershipData', customerData);
                } else {
                    this.$rootScope.customerData = customerData;
                    this.localStorageService.set('customerData', customerData);
                    if (customerData !== null) {
                        this.$rootScope.$emit('customerDataModalWaiting', customerData);
                    }
                }
            }
            defer.resolve(commercialData.data);
            defer = null;
            this.numberAttemps = 0;
        };

        const getCommercialInfoError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.numberAttemps, getCommercialInfoCallback, defer, true);
        };

        const getCommercialInfoCallback = (): void => {
            this.numberAttemps++;
            this.getCommercialInfo(defer);
        };

        const config: any = {
            headers: {
                'Cache-Control': 'private, max-age=600'
            }
        };

        this.CommonsGenericProxy.getGeneric(endpoint, null, null, config)
            .then(getCommercialInfoSuccess, getCommercialInfoError);
        return defer.promise;
    };
}