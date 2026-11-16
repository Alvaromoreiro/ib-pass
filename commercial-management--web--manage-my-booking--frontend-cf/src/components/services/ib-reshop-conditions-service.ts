import * as angular from 'angular';

export class ReshopConditionsService {
    completeURI: string;
    flowID: string;
    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: MmBAppConstants,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getReshopConditions = (flowID: any) => {

        return new Promise((resolve, reject) => {
            const generateRequestURI = (reshopConditionsURI: any, flowID: any) => {
                const replacedURI = reshopConditionsURI.replace('{flowId}', flowID);
                return replacedURI;
            };
            this.completeURI = generateRequestURI(this.MmBAppConstants.DEFAULT_ENDPOINTS.reshopConditionsServiceURIV2, flowID);
            this.CommonsGenericProxy.getGeneric(this.completeURI).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
ReshopConditionsService.$inject = ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-MmB-services-module');
    mod.service(
        'ReshopConditionsService',
        ReshopConditionsService
    );
} catch (error) {
    const mod = angular.module('ib-MmB-services-module', []);
    mod.service(
        'ReshopConditionsService',
        ReshopConditionsService
    );
}
