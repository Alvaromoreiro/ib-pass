import * as angular from 'angular';

@Service(
    'ib-MmB-services-module',
    [
        'MmBAppConstants',
        'CommonsGenericProxy',
        'localStorageService',
        'CommonsNewHttpUtilsErrorService',
        'MmBModalService'
    ],
    []
)
export class MmBChangeFlightOrderService {

    constructor(
        private MmBAppConstants: any,
        private CommonsGenericProxy: CommonsGenericProxy,
        private localStorageService: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private MmBModalService: any
    ) { }

    /**
     * Execute order change for voluntary change flights when nothing to pay (price <= 0)
     * This method directly calls the orderChange endpoint without loading PMT library
     * 
     * @returns Promise with order change confirmation data
     */
    changeFlightOrderNothingToPay = (): Promise<any> => {
        const requestData = this.buildOrderChangeRequest();

        if (!requestData) {
            return Promise.reject({ error: 'INVALID_REQUEST_DATA' });
        }

        return this.executeOrderChange(requestData);
    };

    /**
     * Executes the HTTP POST request to change order with proper error handling
     * @param requestData - The order change request payload
     * @returns Promise with order change result
     */
    private executeOrderChange(requestData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const endpoint = this.getOrderChangeEndpoint();
            const configObject = this.buildAuthConfig();

            const handleSuccess = (data: any) => {
                this.localStorageService.set('issueOrderInfo', data);
                this.localStorageService.remove('noPaymentVCFlow');
                resolve(data);
            };

            const handleError = (error: any) => {
                if (error && error.errorCode === 417) {
                    this.localStorageService.set('issueOrderInfo', error.data);
                    reject({
                        code: error.errorCode,
                    });
                } else {
                    this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                }
            };
            this.CommonsGenericProxy.postGeneric(endpoint, requestData, this.localStorageService.get('userLogged') === true ? configObject : null)
                .then((success) => { handleSuccess(success); }, (error) => { handleError(error); }
                );
        });
    }


    private getOrderChangeEndpoint(): string {
        return `${this.MmBAppConstants.DEFAULT_ENDPOINTS.orderChangeURI}`;
    }


    private buildAuthConfig(): any {
        const sfToken = this.localStorageService.get('loginSF');
        const token = sfToken || this.localStorageService.get('SF_LOGGED_TOKEN');
        return {
            headers: {
                'X-Salesforce-Token': token
            }
        };
    }


    private buildOrderChangeRequest = (): any => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const fareData = this.localStorageService.get('fareData');

        if (!this.validateStorageData(bookingInfo, fareData)) {
            return null;
        }

        const orderData = this.extractOrderData(bookingInfo, fareData);

        if (!this.validateOrderData(orderData)) {
            return null;
        }

        return this.createRequestStructure(orderData);
    };

    private validateStorageData = (bookingInfo: any, fareData: any): boolean => {
        return !!bookingInfo && !!fareData;
    };

    private extractOrderData = (bookingInfo: any, fareData: any): any => {
        return {
            orderId: bookingInfo.order?.orderId,
            flowId: bookingInfo.flowId,
            oldOrderItemId: bookingInfo.order?.orderItems?.[0]?.orderItemId,
            newOrderItemId: fareData.offers?.[0]?.offerId,
        };
    };

    private validateOrderData = (orderData: any): boolean => {
        return !!(orderData.orderId && orderData.flowId &&
            orderData.oldOrderItemId && orderData.newOrderItemId);
    };

    private createRequestStructure = (orderData: any): any => {
        return {
            orderId: orderData.orderId,
            flowId: orderData.flowId,
            oldOrderItem: {
                id: orderData.oldOrderItemId,
                actionType: 'Delete'
            },
            newOrderItem: {
                id: orderData.newOrderItemId,
                actionType: 'Create'
            }
        };
    };
}
