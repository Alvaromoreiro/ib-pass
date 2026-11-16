@Service('ib-http-services-module', ['$http', '$q'])

class BookingNameProxy {
    constructor(private $http: ng.IHttpService, private $q: ng.IQService) { }

    /**
     * @function
     * @name getBookingInformation
     * @desc REST service call to get the booking information requested by the user using HTTP GET method
     */
    getBooking = (url: string, name: string, surname: string): angular.IPromise<CommonsServiceTypes.CommonsProxyResponse | CommonsServiceTypes.CommonsErrorProxyResponse> => {
        const defer = this.$q.defer();
        const config = {
            'name': name,
            'surname': surname
        };
        const getComplete = (response: CommonsServiceTypes.CommonsProxyResponse): void => {
            return defer.resolve({ data: response.data, code: response.status });
        };
        const getFailed = (response: CommonsServiceTypes.CommonsProxyResponse): void => {
            return defer.reject({ data: response.data, errorCode: response.status });
        };
        this.$http.post(url, config)
            .then(getComplete).catch(getFailed);
        return defer.promise;
    };
}
