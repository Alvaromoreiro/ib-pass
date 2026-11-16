import { Component, Inject, OnInit } from '@angular/core';
import { AJSRootScope} from 'ib-web-commons/utils';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { DigitalDataProcess, DigitalDataSteps } from '@src/app/core/constants/ib-digital-data-constants';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';


@Component({
    selector: 'on-hold-anulation',
    templateUrl: './ib-booking-on-hold-anulation.component.html',
    styleUrls: ['./ib-booking-on-hold-anulation.component.scss']
})
export class IbBookingOnHoldAnulationComponent implements OnInit{
    public twitterLink: string;
    public footerModel;

    constructor (
        @Inject( WINDOW_TOKEN ) private $window: ng.IWindowService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private BookingPageUtilsService: BookingPageUtilsService,
        private BookingRedirectionService: BookingRedirectionService,
        private DigitalDataUtilsService: DigitalDataUtilsService
    ) {}

    ngOnInit (): void {
        this.initFooter();
        this.initPage();
    }

    initPage (): void {
        this.BookingPageUtilsService.setPageTitle('BKI_TITLE_PAGE_CONF_ONHOLD_CANCEL');
        this.DigitalDataUtilsService.setProcessAndStep(DigitalDataProcess.ONHOLD_CONFIRMATION, DigitalDataSteps.ONHOLD_CONF_CANCEL, BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION);
        this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam(BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION, null);
        this.DigitalDataUtilsService.emitViewEvent();
        this.$rootScope.$broadcast('updateDatalayer');
        this.$rootScope.$broadcast('sendUpdateToMonetate');
    }

    private initFooter = ():void => {
        this.footerModel = this.BookingPageUtilsService.getFooterModel();
    };


    backToHome (): void {
        this.BookingRedirectionService.externalRedirect(this.$window.location.origin);
    }
}
