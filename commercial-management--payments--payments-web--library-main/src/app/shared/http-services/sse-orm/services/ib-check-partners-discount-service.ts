import angular from 'angular';
import { PmtHttpErrorFilter } from 'src/app/core/http-error-managment/ib-pmt-http-error-filter';
export class PMTCheckPartnerDiscountsService {
    private addEndpoint : string;
    private endpoint : string;
    private numberAttemps: number;
    private defer: angular.IDeferred<any>;
    constructor (
        private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private PmtConstants: PmtConstants,
        private PmtHttpErrorFilter: PmtHttpErrorFilter ) {
        this.endpoint = this.PmtConstants.ENDPOINTS.DEFAULT.checkPertnerDiscount;
        this.numberAttemps = 0; 
    }

    addPartnerDiscount = (serviceURI:string, partnerCode: string, flowId: string ) : ng.IPromise <any> => {
        this.defer = this.defer || this.$q.defer();
        const addPartnerCodeCallback: any = () => {
            this.numberAttemps++;
            this.addPartnerDiscount( serviceURI, partnerCode, flowId );
        };
        this.CommonsGenericProxy.postGeneric( serviceURI + this.endpoint + '/' + flowId + '/discount/partner/' + partnerCode, {} )
            .then( this.bookingPartnerDiscountCheckSuccess, ( error )  => {
                this.partnerCheckError( error, addPartnerCodeCallback, this.endpoint + '/' + flowId + '/discount/partner/' + partnerCode );
            } );
        return this.defer.promise;
    };

    deletePartnerDiscount = (serviceURI:string, partnerCode: string, flowId: string) : ng.IPromise <any> => {
        this.defer = this.defer || this.$q.defer();
        const deleteVoucherCodeCallback: any = () => {
            this.numberAttemps++;
            this.deletePartnerDiscount(serviceURI, partnerCode, flowId);
        };
        this.CommonsGenericProxy.deleteGeneric(serviceURI+ this.endpoint + '/' + flowId + '/discount/partner/' + partnerCode)
            .then(this.bookingPartnerDiscountCheckSuccess, (error) => {
                this.partnerCheckError(error, deleteVoucherCodeCallback, this.endpoint + '/' + flowId + '/discount/partner/' + partnerCode);
            });

        return this.defer.promise;        
    };

    partnerCheckError = (error: CommonsErrorsModel.ErrorDataGeneral, callback: () => void, endpoint: string) => {
        const errorObject = {
            'actualAttemps': this.numberAttemps,
            'paymentMethodCallback': callback,
            'response': error,
            url: endpoint
        };
        const returnProcessedError =  (responseError: boolean) => {
            if (responseError) {
                this.defer.reject(responseError);
                this.defer = null;
                this.numberAttemps = 0;
            }
        };
        returnProcessedError(this.PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));

        /**
         * If there is a response error object as input, the function rejects the service promise and initialize service attributes
         * @param {Object} responseError - the processed http response error. It could be undefined or null
         */
        
    };
    bookingPartnerDiscountCheckSuccess = (data: any) =>  {
        this.defer.resolve(data?.data);
        this.defer = null;
        this.numberAttemps = 0;
    };

}
PMTCheckPartnerDiscountsService.$inject = [
    '$q',
    'CommonsGenericProxy',
    'PmtConstants',
    'PmtHttpErrorFilter'
];




try {
    const mod = angular.module('ib-pmt-services-http-module');
    mod.service(
        'PMTCheckPartnerDiscountsService',
        PMTCheckPartnerDiscountsService
    );
} catch (error) {
    const mod = angular.module('ib-pmt-services-http-module', []);
    mod.service(
        'PMTCheckPartnerDiscountsService',
        PMTCheckPartnerDiscountsService
    );
}