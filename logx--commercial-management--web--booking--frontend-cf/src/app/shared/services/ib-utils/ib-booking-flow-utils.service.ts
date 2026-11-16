import { Inject, Injectable } from '@angular/core';
import { AdaptativeMobileFlows } from '@src/app/core/constants/ib-booking-maps';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';

@Injectable({
    providedIn: 'root'
})
export class IbBookingFlowUtilsService {
    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    public checkAdaptativeMobileView = ( ): boolean => {
        const isMobile: boolean = this.rootScope.isMobile.general || false;
        const bookingHeaderMobileForced = this.CommonsSessionStorageService.get( 'bookingHeaderMobileForced' );
        const adaptativeMobileFlowConfig = this.CommonsSessionStorageService.get( 'adaptativeMobileFlow' );
        const onb: boolean = this.rootScope.isPointsOBFlow || false;
        const getAdaptativeFlag = (adaptativeMobileFlowConfig && !onb && isMobile && bookingHeaderMobileForced);
        return getAdaptativeFlag && this.getAdaptativeFlowEnable();
    };

    private getAdaptativeFlowEnable = () => {
        const flow: string = this.CommonsSessionStorageService.get('searchFlightType') || '';
        const step: string = this.CommonsSessionStorageService.get('actualStepFlow') || '';
        return AdaptativeMobileFlows[flow][step] ?? false;
    };
}
