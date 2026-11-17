@Service('ib-http-services-module',
    [
        '$q',
        'HttpServicesConstants',
        'CommonsGenericProxy',
        'CommonsHttpUtilsErrorService'
    ])
export class NewslettersService {
    public counterAttemps: number;
    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService
    ) {
        this.counterAttemps = 0;
    }
    /**
     * Send to service travel info the documents saved for user in form of APIS
     * @param {Object} newslettersInfo newslettersInfo information with documents
     */
    putNewsletters = (newslettersInfo: any, deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.putNewslettersURI;

        const putNewslettersError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, putNewslettersCallback, defer);
        };
        const putNewslettersCallback = () => {
            this.counterAttemps++;
            this.putNewsletters(newslettersInfo, defer);
        };
        const putNewslettersSuccess = (data) => {
            defer.resolve(data);
            defer = null;
        };
        this.CommonsGenericProxy.putGeneric(endpoint, newslettersInfo)
            .then(putNewslettersSuccess, putNewslettersError).catch(putNewslettersError);

        return defer.promise;
    };
}
