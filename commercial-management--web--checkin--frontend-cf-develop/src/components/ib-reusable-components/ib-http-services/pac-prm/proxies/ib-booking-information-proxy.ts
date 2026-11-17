@Service('ib-http-services-module', ['$http', '$q'])

class BookingInformationProxy {
    constructor (private $http: ng.IHttpService, private $q: ng.IQService) { }

    /**
     * @function
     * @name getBookingInformation
     * @desc REST service call to get the booking information requested by the user using HTTP GET method
     */
    getBookingInformationByLocatorAndSurname = (url: string, surname: string): angular.IPromise<CommonsServiceTypes.CommonsProxyResponse | CommonsServiceTypes.CommonsErrorProxyResponse> => {
        const defer = this.$q.defer();
        const config = {
            headers: {
                'Request-Surname': surname
            }
        };
        const getComplete = (response: CommonsServiceTypes.CommonsProxyResponse): void => {
            return defer.resolve({ data: response.data, code: response.status });
        };
        const getFailed = (response: CommonsServiceTypes.CommonsProxyResponse): void => {
            return defer.reject({ data: response.data, errorCode: response.status });
        };
        this.$http.get(url, config)
            .then(getComplete).catch(getFailed);
        return defer.promise;
    };

    /**
    * @function
    * @name getBookingInformation
    * @desc REST service call to get the booking information requested by the user using HTTP GET method
    */
    getBookingInformationByDeepLink = (url: string, code: string): angular.IPromise<CommonsServiceTypes.CommonsProxyResponse | CommonsServiceTypes.CommonsErrorProxyResponse> => {
        const defer = this.$q.defer();
        const decodeUntilDecoded = (codeText) => {
            let i: number = 0, decoded: boolean = false;
            const MAX_ATTEMPS: number = 10;
            while (!decoded && i < MAX_ATTEMPS) {
                const oldCodeText: string = codeText;
                codeText = decodeURIComponent(codeText);
                decoded = oldCodeText === codeText;
                i++;
            }
            return codeText;
        };
        const config = {
            headers: {
                'Request-Deeplink': decodeUntilDecoded(code)
            }
        };
        const getComplete = (response: CommonsServiceTypes.CommonsProxyResponse): void => {
            return defer.resolve({ data: response.data, code: response.status });
        };
        const getFailed = (response: CommonsServiceTypes.CommonsProxyResponse): void => {
            return defer.reject({ data: response.data, errorCode: response.status });
        };
        this.$http.get(url, config)
            .then(getComplete).catch(getFailed);
        return defer.promise;
    };

}