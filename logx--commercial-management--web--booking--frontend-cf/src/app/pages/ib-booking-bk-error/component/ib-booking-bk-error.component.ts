import { Component, OnInit } from '@angular/core';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { RootStore } from '@src/app/core/store/ib-booking-root.store';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { IbBookingBkErrorAnalyticsService } from '../services/ib-booking-bk-error-analytic.service';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { BookingBkErrorPageManagerService, BookingErrorPageConfiguration } from '../services/ib-booking-bk-error-manager.service';

interface BookingUrlParams {
    backToUrl?: string;
}

interface FooterPhoneInfo {
    prefix: string;
    phoneNumber: string;
    text: string;
}

interface FooterModel {
    phoneInfo: FooterPhoneInfo;
}

@Component({
    selector: 'ib-booking-bki-error-upgraded',
    templateUrl: './ib-booking-bk-error.component.html'
})
export class IbBookingBkiErrorUpgradedComponent implements OnInit {
    public errorConfig: BookingErrorPageConfiguration | null = null;
    public stopoverDispoError: boolean = false;
    public stopoverNoFeeError: boolean = false;
    public availError: boolean = false;
    public isStopOver: boolean = false;
    public isRedemptionFlow: boolean = false;
    public footerModel: FooterModel | null = null;
    public imageUrl: string = '';
    public buttonLabel: string = '';
    constructor (
        private localStorageService: CommonsSessionStorageService,
        private bookingRedirectionService: BookingRedirectionService,
        private bookingPageUtilsService: BookingPageUtilsService,
        private ibBookingBkErrorAnalyticsService: IbBookingBkErrorAnalyticsService,
        private bookingBkErrorPageManagerService: BookingBkErrorPageManagerService,
        public rootStore: RootStore,
        private ibCLinkPipe: IbCLinkPipe
    ) {}
    
    /**
     * Initializes the component when Angular creates it.
     * Sets up the background image, hides headers, initializes component state,
     * and configures the footer model.
     */
    ngOnInit (): void {
        this.imageUrl = this.rootStore.get('routes')?.images + this.rootStore.get('backGroundImage');
        this.rootStore.set('showHeaders', false);

        this.initializeComponent();
        this.setupFooterModel();
    }

    /**
     * Initializes component properties and state based on session storage data.
     * Handles different error scenarios (stopover, availability errors) and sends analytics.
     */
    private initializeComponent (): void {
        this.isStopOver = this.localStorageService.get('isHMAD') ?? false;
        this.bookingPageUtilsService.setPageTitle(this.getPageTitle());

        const errorPageModel = this.bookingBkErrorPageManagerService.getError();
        this.errorConfig = errorPageModel ? Object.values(errorPageModel)[0] : null;
        if(this.errorConfig?.background) {
            this.imageUrl =  this.rootStore.get('routes').images + this.errorConfig.background;
        }
        
        if (this.isStopOver) {
            this.stopoverNoFeeError = this.errorConfig?.internalErrorCode === 'SSE_AVM_12001';
            this.stopoverDispoError = this.errorConfig?.internalErrorCode !== 'SSE_AVM_12001';
        } else {
            this.availError = !!(this.errorConfig?.message);
        }
       
        this.buttonLabel = this.getButtonLabel();
        this.ibBookingBkErrorAnalyticsService.sendAnalyticsFromStorage();
    }

    /**
     * Sets up the footer model with phone information for reservations.
     * Retrieves phone data from root store and formats it for footer display.
     */
    private setupFooterModel (): void {
        if(this.rootStore.get('phonesList')?.['RESERVAS'])
            this.footerModel = {
                'phoneInfo': {
                    'prefix': this.rootStore.get('phonesList')['RESERVAS'].prefix,
                    'phoneNumber': this.rootStore.get('phonesList')['RESERVAS'].telephone,
                    'text': this.rootStore.get('phonesList')['RESERVAS'].text
                }
            };
    }

    /**
     * Handles navigation back to the home page based on current flow context.
     * Redirects to shuttle search, original URL, home page, or redemption flow accordingly.
     */
    returnHomePage (): void {
        if (this.rootStore.get('isShuttleFlow')) {
            const shuttleLink = this.ibCLinkPipe.transform('SHUTTLE_CHANGE_SEARCH_LINK');
            this.bookingRedirectionService.externalRedirect(shuttleLink);
        } else if (!this.rootStore.get('isRedemptionFlow')) {
            const bookingUrlParams: BookingUrlParams = this.localStorageService.get('bookingUrlParams');
            if (bookingUrlParams && bookingUrlParams.backToUrl) {
                this.bookingRedirectionService.externalRedirect(window.location.origin + bookingUrlParams.backToUrl);
            } else {
                this.bookingRedirectionService.externalRedirect(window.location.origin);
            }
        } else {
            this.goRedemptionSearchEnginePage();
        }
    }

    /**
     * Returns the translation key for the button label.
     * Uses errorConfig.button if available, otherwise falls back to the default based on flow.
     */
    getButtonLabel (): string {
        if (this.errorConfig?.button) {
            return this.errorConfig.button;
        }
        return !this.isRedemptionFlow ? 'IBBKERROR_TEXT_BUTTON' : 'IBBKERROR_RETURN_SEARCH_ENGINE';
    }

    /**
     * Redirects user to WCS redemption search engine page.
     */
    private goRedemptionSearchEnginePage (): void {
        const redemptionLink =this.ibCLinkPipe.transform( 'IBERIA_NEW_REDEMPTION_SEARCH_ENGINE' );
        this.bookingRedirectionService.externalRedirect(redemptionLink);
    }

    /**
     * Gets the appropriate page title based on the current search context.
     * @returns The translation key for the page title
     */
    private getPageTitle (): string {
        const isMultiCitySearch = this.localStorageService.get('multiCitySearch');
        
        if (this.isStopOver) {
            return 'BKI_HM_ERROR_TITLE';
        }
        if (isMultiCitySearch) {
            return 'BKI_MT_ERROR_TITLE';
        }
        return 'BKI_ERROR_TITLE';
    }
    
}
