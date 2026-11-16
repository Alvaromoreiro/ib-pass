import * as angular from 'angular';

export class DigitalBoardingService {
    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: MmBAppConstants,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getDigitalBoardingAvailability = (requestData: any) => {
        return new Promise((resolve, reject) => {
            let request = {}, segment = {}, j = 0, i = 0;
            const generateRequest = (requestData: any) => {
                for (i = 0; i < requestData.order.slices.length; i++) {
                    for (j = 0; j < requestData.order.slices[i].segments.length; j++) {
                        segment = {
                            segmentId: requestData.order.slices[i].segments[j].id
                        };
                    }
                    segments.push(segment);
                }
                return request = {
                    flowId: requestData.flowId,
                    segments: segments
                };
            };
            const segments = [];

            this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.DEFAULT_ENDPOINTS.digitalBoardingAvailabilityV4, generateRequest(requestData)).then(
                (response: any) => {
                    if (response.code === 200) {
                        response.hasData = true;
                    }
                    resolve(response);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
DigitalBoardingService.$inject = ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-MmB-services-module');
    mod.service(
        'DigitalBoardingService',
        DigitalBoardingService
    );
} catch (error) {
    const mod = angular.module('ib-MmB-services-module', []);
    mod.service(
        'DigitalBoardingService',
        DigitalBoardingService
    );
}
