import { IRequestShortcutConfig, IRequestConfig, IHttpRequestConfigHeaders, IHttpService, IQService, IDeferred, IPromise, toJson } from 'angular';

/**
 * Configuration parameters for applying request settings
 */
interface ApplyConfigurationParams {
    configObj: IRequestShortcutConfig | IRequestConfig;
    newConfig?: CommonsGenerateUrlModel.headerConfig;
    data?: any;
    method?: string;
    type?: 'dict';
}
interface IExecuteRequest {
    method: HttpMethodTpes;
    url: string;
    data?: any;
    newConfig?: CommonsGenerateUrlModel.headerConfig;
    maxTimeout?: number;
    type?: 'dict';
}
type HttpMethodTpes = 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'GET';
type IPromiseGenericProxy = IPromise<
| CommonsServiceTypes.CommonsProxyResponse
| CommonsServiceTypes.CommonsErrorProxyResponse
>;
enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

@Service('ib-commons-proxies-module', ['$http', '$q', '$rootScope'])
export class CommonsGenericProxy {
    DIC_Headers: IHttpRequestConfigHeaders;

    constructor (
        private $http: IHttpService,
        private $q: IQService,
        private $rootScope: CommonsRootScope
    ) {
        this.DIC_Headers = {
            'Accept-Language': this.$rootScope.appLang
        };
    }

    /**
     * Creates standardized success handler for HTTP requests
     */
    private createSuccessHandler (
        defer: IDeferred<any>
    ): (response: CommonsServiceTypes.CommonsProxyResponse) => void {
        return (response: CommonsServiceTypes.CommonsProxyResponse): void => {
            this.$http.defaults.withCredentials = true;
            defer.resolve({ data: response.data, code: response.status });
        };
    }

    /**
     * Creates standardized error handler for HTTP requests
     */
    private createErrorHandler (
        defer: IDeferred<any>
    ): (response: CommonsServiceTypes.CommonsErrorProxyResponse) => void {
        return (response: CommonsServiceTypes.CommonsErrorProxyResponse): void => {
            this.$http.defaults.withCredentials = true;
            defer.reject({
                data: response.data,
                errorCode: response.status,
                requestURL: response.config && response.config.url ? response.config.url : ''
            });
        };
    }

    /**
     * Configures request headers and credentials
     */
    private applyConfiguration (params: ApplyConfigurationParams): void {
        const { configObj, newConfig, data, method, type } = params;

        if (newConfig) {
            configObj.headers = {
                ...configObj.headers,
                ...newConfig.headers
            };
            
            if (newConfig.withCredentials !== undefined) {
                configObj.withCredentials = newConfig.withCredentials;
            } else {
                this.$http.defaults.withCredentials = false;
            }
        }

        const sourceName = data?.person?.sourceName;
        if (method === HttpMethod.POST && sourceName) {
            configObj.headers['transaction-channel'] = sourceName;
        }

        if (type === 'dict') {
            Object.assign(configObj.headers, this.DIC_Headers);
        }
    }

    /**
     * Executes generic HTTP requests (POST, PUT, DELETE, PATCH)
     */
    private executeRequest ({
        method,
        url,
        data,
        newConfig,
        maxTimeout,
        type
    }: IExecuteRequest): IPromiseGenericProxy {
        const defer = this.$q.defer();
        const configObj: IRequestShortcutConfig = { timeout: maxTimeout };

        this.applyConfiguration({
            configObj,
            newConfig,
            data,
            method,
            type
        });

        const httpMethod = method.toLowerCase();
        const request =
            data !== undefined
                ? this.$http[httpMethod](url, toJson(data), configObj)
                : this.$http[httpMethod](url, configObj);

        request
            .then(this.createSuccessHandler(defer))
            .catch(this.createErrorHandler(defer));

        return defer.promise;
    }

    /**
     * Calls HTTP GET method
     */
    getGeneric (
        url: string,
        type?: 'dict',
        maxTimeout?: number,
        newConfig?: CommonsGenerateUrlModel.headerConfig
    ): IPromiseGenericProxy {
        return this.executeRequest({
            method: HttpMethod.GET,
            url,
            newConfig,
            maxTimeout,
            type
        });
    }

    /**
     * Calls HTTP POST method
     */
    postGeneric (
        url: string,
        data: object,
        newConfig?: CommonsGenerateUrlModel.headerConfig,
        maxTimeout?: number
    ): IPromiseGenericProxy {
        return this.executeRequest({
            method: HttpMethod.POST,
            url,
            data,
            newConfig,
            maxTimeout
        });
    }

    /**
     * Calls HTTP PUT method
     */
    putGeneric (
        url: string,
        data: object,
        newConfig?: CommonsGenerateUrlModel.headerConfig,
        maxTimeout?: number
    ): IPromiseGenericProxy {
        return this.executeRequest({
            method: HttpMethod.PUT,
            url,
            data,
            newConfig,
            maxTimeout
        });
    }

    /**
     * Calls HTTP DELETE method
     */
    deleteGeneric (
        url: string,
        newConfig?: CommonsGenerateUrlModel.headerConfig,
        maxTimeout?: number
    ): IPromiseGenericProxy {
        return this.executeRequest({
            method: HttpMethod.DELETE,
            url,
            newConfig,
            maxTimeout
        });
    }

    /**
     * Calls HTTP PATCH method
     */
    patchGeneric (
        url: string,
        data: any,
        maxTimeout?: number,
        newConfig?: CommonsGenerateUrlModel.headerConfig
    ): IPromiseGenericProxy {
        return this.executeRequest({
            method: HttpMethod.PATCH,
            url,
            data,
            newConfig,
            maxTimeout
        });
    }
}
