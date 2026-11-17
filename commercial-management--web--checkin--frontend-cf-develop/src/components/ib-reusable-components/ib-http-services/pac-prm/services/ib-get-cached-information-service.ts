import { BaseServiceConfigJson } from 'ib-web-commons/proxies';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';

interface ExecuteRequestParams {
    defer: angular.IDeferred<unknown>;
    endpoint: string;
    retryAction: () => void;
    config?: BaseServiceConfigJson;
}

interface RunCachedRequestParams {
    deferredRecall?: angular.IDeferred<unknown>;
    endpointSuffix: string;
    isValidRequest: boolean;
    buildRetryAction: (defer: angular.IDeferred<unknown>) => () => void;
    config?: BaseServiceConfigJson;
}

@Service('ib-http-services-module',
    [
        '$q',
        'HttpServicesConstants',
        'CommonsGenericProxy',
        'CommonsHttpUtilsErrorService',
        '$timeout',
        '$filter',
        'base64',
        'IbSessionConfigService'
    ])
export class GetCKICachedInformationService {
    public counterAttemps: number;

    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private $timeout: ng.ITimeoutService,
        private $filter: angular.IFilterService,
        private base64: any,
        private IbSessionConfigService: IbSessionConfigService
    ) {
        this.counterAttemps = 0;
    }

    private executeRequest = ({
        defer,
        endpoint,
        retryAction,
        config
    }: ExecuteRequestParams): angular.IPromise<unknown> => {
        this.CommonsGenericProxy.getGeneric(endpoint, null, null, config)
            .then(
                (response: any) => this.resolveResponse(defer, response),
                (error: any) => this.handleRequestError(error, defer, retryAction)
            )
            .catch((error: any) => this.handleRequestError(error, defer, retryAction));

        return defer.promise;
    };

    private handleRequestError (
        error: any,
        defer: angular.IDeferred<unknown>,
        retryAction: () => void
    ): void {
        this.CommonsHttpUtilsErrorService.controlError(
            error,
            this.counterAttemps,
            () => this.retryRequest(retryAction),
            defer
        );
    }

    private retryRequest (retryAction: () => void): void {
        this.counterAttemps++;
        retryAction();
    }

    private resolveResponse (defer: angular.IDeferred<unknown>, response: any): void {
        defer.resolve(response.data);
    }

    private getDeferred<T = unknown>(deferredRecall?: angular.IDeferred<T>): angular.IDeferred<T> {
        return deferredRecall || this.$q.defer<T>();
    }

    private getConfig (code: string, sessionToken: string): BaseServiceConfigJson {
        return {
            headers: {
                'session-token': this.base64.encode(sessionToken),
                code: this.base64.encode(code)
            },
            withCredentials: true
        };
    }

    private rejectSessionExpiredInto<T = unknown>(defer: angular.IDeferred<T>): void {
        this.$timeout(() => {
            defer.reject({
                errorCode: 'IB_00002',
                message: this.$filter('translate')('SESSION_EXPIRED'),
                internalErrorCode: 'IB_00002'
            } as any);
        });
    }

    private getEndpointURI (checkinId: string, endpoint: string = ''): string {
        return `${this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.cachedInformationURI}${checkinId}${endpoint}`;
    }

    private runCachedRequest = ({
        deferredRecall,
        endpointSuffix,
        isValidRequest,
        buildRetryAction,
        config
    }: RunCachedRequestParams): angular.IPromise<unknown> => {
        const defer = this.getDeferred(deferredRecall);
        const checkinId = this.IbSessionConfigService.getFlowId();

        if (!checkinId || !isValidRequest) {
            this.rejectSessionExpiredInto(defer);
            return defer.promise;
        }

        return this.executeRequest({
            defer,
            endpoint: this.getEndpointURI(checkinId, endpointSuffix),
            retryAction: buildRetryAction(defer),
            config
        });
    };

    getCachedInformation = (deferredRecall?: angular.IDeferred<unknown>): angular.IPromise<unknown> => {
        return this.runCachedRequest({
            deferredRecall,
            endpointSuffix: '/cached',
            isValidRequest: true,
            buildRetryAction: (defer) => () => this.getCachedInformation(defer)
        });
    };

    getCachedLotus = (
        code: string,
        sessionToken: string,
        deferredRecall?: angular.IDeferred<unknown>
    ): angular.IPromise<unknown> => {
        return this.runCachedRequest({
            deferredRecall,
            endpointSuffix: '/cached-lotus',
            isValidRequest: !!code && !!sessionToken,
            buildRetryAction: (defer) => () => this.getCachedLotus(code, sessionToken, defer),
            config: this.getConfig(code, sessionToken)
        });
    };
}
