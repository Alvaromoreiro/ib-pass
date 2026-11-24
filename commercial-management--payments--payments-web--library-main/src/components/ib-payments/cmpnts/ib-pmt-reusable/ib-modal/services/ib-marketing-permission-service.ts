import angular from 'angular';
import { CommonsNewHttpUtilsErrorService } from 'ib-web-commons/app/core/utils/http-utils-services/ib-commons-new-http-utils-error-service';
import { CommonsGenericSFProxy } from 'ib-web-commons/app/core/proxies/ib-commons-SF-generic-proxy';

export class ibMarketingPermissionService {
    private MPData;
    constructor (
        private PmtConstants: PmtConstants,
        private CommonsGenericSFProxy: CommonsGenericSFProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) { }

    getMarketingPermissions = ():Promise<any> => {

        return new Promise((resolve, reject)=>{

            const endpoint = this.PmtConstants.ENDPOINTS.DEFAULT.MARKETING_PERMISSIONS;
            this.CommonsGenericSFProxy.getGeneric(endpoint).then(
                (marketingPermissionsData: CommonsServiceTypes.CommonsProxyResponse) =>{
                    this.MPData = marketingPermissionsData.data;
                    resolve(marketingPermissionsData);
                },
                (error)=>{
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                }
            );
        });
    };

    setMarketingPermission = (marketingPermissions) => {
        const marketingPermissionsUpdated = marketingPermissions.map((product) => {
            if(product.permissionType === 'COMMERCIAL_CAMPAIGN'){
                product.permissionGranted = true;
            }
            return {...product};
        });
        return marketingPermissionsUpdated;
    };

    reqMarketingPermission = ():Promise<any> => {
        return new Promise((resolve, reject)=>{
            const endpoint = this.PmtConstants.ENDPOINTS.DEFAULT.MARKETING_PERMISSIONS;
            const marketingPermissionsUpdated = this.setMarketingPermission(this.MPData);
            this.CommonsGenericSFProxy.putGeneric(endpoint, marketingPermissionsUpdated ).then(
                (marketingPermissionsData: CommonsServiceTypes.CommonsProxyResponse)=>{
                    resolve(marketingPermissionsData);
                },
                (error)=>{
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}

ibMarketingPermissionService.$inject=['PmtConstants', 'CommonsGenericSFProxy', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-modal-module');
    mod.service(
        'ibMarketingPermissionService',
        ibMarketingPermissionService
    );
} catch (error) {
    const mod = angular.module('ib-modal-module', ['ib-pmt-styles-host-module']);
    mod.service(
        'ibMarketingPermissionService',
        ibMarketingPermissionService
    );
}
