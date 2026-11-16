import { Component, OnInit, Inject } from '@angular/core';
import { CommonsSessionStorageService, AJSRootScope } from 'ib-web-commons/utils';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSMonetateUtilsService } from '@shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { BookingError, BookingErrorPageStore, ErrorType } from '@src/app/core/store/ib-booking-error-page.store';
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
    selector: 'ib-pets-not-available',
    templateUrl: './ib-pets-not-available.component.html',
    styleUrls: ['./ib-pets-not-available.component.scss']
})
export class IbPetsNotAvailableComponent implements OnInit {
    images: string;
    backGroundImage: string;
    digitalData: confirmationDigitalInfo;
    
    public availabilityError:  BookingError;
    public petErrorPageTitle: string;
    public petErrorPageBody: string[] = [];
 
    constructor (
        @Inject(AJSRootScope) private $rootScope: any,
        @Inject(AJSMonetateUtilsService) private MonetateUtilsService,
        private DigitalDataService: DigitalDataService,
        private BookingRedirectionService: BookingRedirectionService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DigitalDataUtilsService: DigitalDataUtilsService,
        private BookingErrorPageStore: BookingErrorPageStore 
    ) {
        this.images = this.$rootScope.routes?.images;
        this.backGroundImage = '/background/generico/pet_error_page_default.jpg';
        this.$rootScope.showHeaders = false;
    }
    
    ngOnInit (): void {
        this.loadErrorContent();

        let process = this.DigitalDataService.getDigitalDataProcess();
        this.digitalData=this.CommonsSessionStorageService.get('confirmationDigitalInfo');
        this.DigitalDataUtilsService.updateDigitalDataWithQuadrigam(BookingAppConstants.QUADRIGAMS.BKI_ERROR_PET_NOT_AVAILABLE, null);
        this.DigitalDataUtilsService.setProcessAndStep( process, 'error', BookingAppConstants.QUADRIGAMS.BKI_ERROR_PET_NOT_AVAILABLE );
        this.DigitalDataService.emitViewEvent();

        this.MonetateUtilsService.updateMonetateInfo();
    }

    public loadErrorContent (): void {

        this.availabilityError = this.BookingErrorPageStore.getErrorByType(ErrorType.AVAILABILITY);

        if (this.availabilityError?.details) {
            this.petErrorPageTitle = this.availabilityError.details.title;
            this.petErrorPageBody  = this.availabilityError.details.body;
            return;
        }

        this.petErrorPageTitle = 'PET_ERROR_PAGE_TITLE';
        this.petErrorPageBody  = ['PET_ERROR_PAGE_BODY'];

    }

    public goHomePage = () => {
        this.BookingRedirectionService.externalRedirect(window.location.origin);
    };
}

