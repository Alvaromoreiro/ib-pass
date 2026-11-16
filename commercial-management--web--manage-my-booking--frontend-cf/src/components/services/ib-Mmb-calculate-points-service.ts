import * as angular from 'angular';
export class CalculatePointsService {
    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    /**
     * @param requestData
     * @returns
     */
    getCalculatePoints = (requestData: any) => {
        return new Promise((resolve, reject) => {
            const endpoint = this.MmBAppConstants.calculatePoints;
            this.CommonsGenericProxy.postGeneric(endpoint, requestData).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
CalculatePointsService.$inject = ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-MmB-services-module');
    mod.service(
        'CalculatePointsService',
        CalculatePointsService
    );
} catch (error) {
    const mod = angular.module('ib-MmB-services-module', []);
    mod.service(
        'CalculatePointsService',
        CalculatePointsService
    );
}
