import { Injectable } from '@angular/core';
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { IbCPromiseBaseSFService } from 'ib-web-commons/proxies';

@Injectable()
export class MarketingPermissionService {
    private MPData;
    constructor (
        private IbCPromiseBaseSFService: IbCPromiseBaseSFService,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService
    ) { }

    getMarketingPermissions = ():Promise<any> => {

        return new Promise((resolve, reject)=>{

            const endpoint = MmBAppConstants.ENDPOINTS.DEFAULT.MARKETING_PERMISSIONS;
            this.IbCPromiseBaseSFService.get(endpoint).then(
                (marketingPermissionsData: CommonsServiceTypes.CommonsProxyResponse) =>{
                    this.MPData = marketingPermissionsData.data;
                    resolve(marketingPermissionsData);
                },
                (error)=>{
                    this.IbCHttpErrorHandlerService.handleErrorOperator()
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
            const endpoint = MmBAppConstants.ENDPOINTS.DEFAULT.MARKETING_PERMISSIONS;
            const marketingPermissionsUpdated = this.setMarketingPermission(this.MPData);
            this.IbCPromiseBaseSFService.put(endpoint, marketingPermissionsUpdated ).then(
                (marketingPermissionsData: CommonsServiceTypes.CommonsProxyResponse)=>{
                    resolve(marketingPermissionsData);
                },
                (error)=>{
                    this.IbCHttpErrorHandlerService.handleErrorOperator()
                });
        });
    };
}