import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { IMarketingPermissions } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-contact-form/models/ib-booking-contact-form-models';
import  { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { BookingSalesforceRxProxy } from '../../http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { IbBookingErrorHandlerService } from '../../http-services/error';

@Injectable({
    providedIn: 'root'
})
export class ibSubscriptionPermissionService {

    constructor (
        private BookingSalesforceRxProxy: BookingSalesforceRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    getMarketingPermissions = ():Promise<any> => {
        const url = HttpServicesConstants.SALESFORCE_ENDPOINTS.MARKETING_PERMISSIONS;
        return lastValueFrom( this.BookingSalesforceRxProxy.get( url )
            .pipe( map( ( response: CommonsServiceTypes.CommonsProxyResponse ) => {
                return response;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };

    setMarketingPermission = (marketingPermissions, isIbZero): IMarketingPermissions => {
        const marketingPermissionsUpdated = marketingPermissions.map((product) => {
            if(isIbZero ? product.permissionType === 'MAGAZINE' : product.permissionType === 'COMMERCIAL_CAMPAIGN'
            ){
                product.permissionGranted = true;
            }

            return {...product};
        });
        return marketingPermissionsUpdated;
    };
    
    reqMarketingPermission = (marketingPermissions, isIbZero):Promise<any> => {
        const url = HttpServicesConstants.SALESFORCE_ENDPOINTS.MARKETING_PERMISSIONS;
        const marketingPermissionsUpdated = this.setMarketingPermission(marketingPermissions, isIbZero);
        return lastValueFrom( this.BookingSalesforceRxProxy.put( url, marketingPermissionsUpdated )
            .pipe( map( ( response: CommonsServiceTypes.CommonsProxyResponse ) => {
                return response;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };
}
downgradeToAJSService('ibSubscriptionPermissionService', ibSubscriptionPermissionService, 'ib-booking-services-module');
