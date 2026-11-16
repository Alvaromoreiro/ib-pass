import { Component, OnInit, Inject } from '@angular/core';
import { CommonsSessionStorageService, AJSRootScope } from 'ib-web-commons/utils';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
interface confirmationDigitalInfo {
    Language: string;
    Market: string;
    VersionWeb: string;
    ModeWeb: string;
    Quadrigam: string;
    TrackingCode: string;
    UserStatus: string;
    Process: string;
    Step: string;
}
@Component({
    selector: 'ib-onb-not-availability',
    templateUrl: './ib-onb-not-availability.component.html',
    styleUrls: ['./ib-onb-not-availability.component.scss']
})
export class IbOnbNotAvailabilityComponent implements OnInit {
    images: string;
    backGroundImage: string;
    digitalData: confirmationDigitalInfo;
 
    constructor (
        @Inject(AJSRootScope) private $rootScope: any,
        private DigitalDataUtilsService: DigitalDataUtilsService,
        private DigitalDataService: DigitalDataService,
        private BookingRedirectionService: BookingRedirectionService,
        private CommonsSessionStorageService: CommonsSessionStorageService
       
    
    ) {
        this.images = this.$rootScope.routes?.images;
        this.backGroundImage = this.$rootScope?.backGroundImage;
        this.$rootScope.showHeaders = false;
    }
    ngOnInit () {
        this.digitalData=this.CommonsSessionStorageService.get('confirmationDigitalInfo');
        this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam(BookingAppConstants.QUADRIGAMS.ONB_REDEMPTION_NOT_AVAILABILITY, null);
        this.DigitalDataUtilsService.setProcessAndStep( BookingAppConstants.DATALAYER_PROCESS.BOOKING_OB_REDEMPTION, 'error', BookingAppConstants.QUADRIGAMS.ONB_REDEMPTION_NOT_AVAILABILITY );
        this.DigitalDataService.emitViewEvent();
    }
    goRedemptionSearchEnginePage () {
        const params: confirmationDigitalInfo = this.CommonsSessionStorageService.get('confirmationDigitalInfo');
        this.BookingRedirectionService.externalRedirect(window.location.origin + '/' + params.Market.toLowerCase() + BookingAppConstants.ONB_REDEMPTION_SEARCH__PATHNAME);
    }
    goHomePage () {
        this.BookingRedirectionService.externalRedirect(window.location.origin);
    }

}

