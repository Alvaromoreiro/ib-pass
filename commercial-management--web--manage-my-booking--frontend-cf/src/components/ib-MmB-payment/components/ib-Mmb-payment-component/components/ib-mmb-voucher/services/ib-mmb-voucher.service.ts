import { Inject, Injectable } from '@angular/core';
import { AJSCommonsGenericProxyService, AJSCommonsGenericProxyServiceType } from '@src/components/services/http/commons-proxy-bridge.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';

@Injectable({providedIn: 'root'})
export class IbMmbVoucherService {
    constructor (
        @Inject(AJSCommonsGenericProxyService) private CommonsGenericProxyService: AJSCommonsGenericProxyServiceType
    ) { }

    public checkVoucherCode = async ( voucherCode: string, flowId: string ) :Promise<any> =>  {
        const url = this.getCheckVoucherUrl( voucherCode, flowId);
        return this.CommonsGenericProxyService.postGeneric( url, {} );
    };

    public deleteVoucherCode = ( voucherCode: string, flowId: string ) :any => {
        const url = `${MmBAppConstants.DEFAULT_ENDPOINTS.checkVoucherCodeServiceURI}${MmBAppConstants.PARAMS.deleteVoucherCodeServiceParamsURI
            .replace( '{flowId}', flowId )
            .replace( '{voucherCode}', voucherCode )}`;
        return this.CommonsGenericProxyService.deleteGeneric( url );
    };

    private getCheckVoucherUrl = ( voucherCode: string, flowId:string):string => {
        const endpointUrl = MmBAppConstants.DEFAULT_ENDPOINTS.checkVoucherCodeServiceURI ;
        const modifiedParams = `${ MmBAppConstants.PARAMS.checkVoucherCodeServiceParamsURI
            .replace( '{flowId}', flowId )
            .replace( '{voucherCode}', voucherCode )}`;
        return `${endpointUrl}${modifiedParams}`;
    };
}
