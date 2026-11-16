import { AJSBookingSearchService } from './../services/upgraded/ib-booking-search-service-bridge.service';
import { Component, Inject, OnInit,OnDestroy, Renderer2 } from "@angular/core";
import { AJSRootScope, downgradeToAJSComponent, IbCUserUtilsService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { NewManageMyBookingService } from '../services/ib-MmB-new-manage-my-booking.service';
import { BookingSearchService } from '../services/ib-booking-search-service';
import { ReactBridgeService, ReactEventPayload } from '../services/ib-react-bridge.service';
import { Router } from '@angular/router';
import { takeUntil, Subject, tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MmBSearchService } from '../ib-MmB-search/services/ib-MmB-search-service';
import { AJSMmBSearchService } from '../ib-MmB-search/services/upgraded/ib-MmB-search-service-bridge.service';
import { AJSCommonsCheckLoginWCSService } from '../services/upgraded/ib-commons-check-login-wcs-bridge.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';

@Component({
    selector: 'ib-mmb-search-new',
    templateUrl: 'ib-Mmb-search-new.component.html'
})

export class IbMmbSearchNewComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    showNewMmb:boolean = false;
    formData: ReactEventPayload;
    loginParameters:any;

    constructor (
        private NewManageMyBookingService: NewManageMyBookingService,
        private router: Router,
        @Inject(AJSBookingSearchService) private BookingSearchService: BookingSearchService,
        @Inject(AJSCommonsCheckLoginWCSService) private CommonsCheckLoginWCSService: CommonsCheckLoginWCSService,
        @Inject(AJSMmBSearchService) private MmBSearchService: MmBSearchService,
        @Inject(AJSRootScope) public $rootScope: CommonsRootScope,
        @Inject(DOCUMENT) private document: Document,
        private ReactBridgeService: ReactBridgeService,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private renderer: Renderer2
    ) {}

    ngOnInit () {
        this.$rootScope.showMainHeader = true;
        this.addLoginParameters();
        const cookiesInfo = this.CommonsCheckLoginWCSService.generateSSOInfo(true);
        this.MmBSearchService.initializeFlow();
        if (this.isUserLogged(cookiesInfo)) {
            this.router.navigate(['mytrpsnew']);
        } else {
            this.NewManageMyBookingService.importNewManageMyBookingComponent().then(() => this.onSuccess()).catch(() => this.onError());  
        }
    };
    
    handleBookingSearch = (data) => {
        this.BookingSearchService.searchFlightsPassengersEvent(null, data)
    };

    onSuccess = () => {
        this.removeMarginFooter();
        this.showNewMmb = true;
        this.$rootScope.showMainHeader = true;
        this.$rootScope.showHeaders = true;

        this.ReactBridgeService.event$.pipe(
            tap(data => {
                this.formData = data.payload;
                this.handleBookingSearch(this.formData);
            }),
            takeUntil(this.destroy$)
        )
        .subscribe();
    };

    onError = () => {
        this.showNewMmb = false;
        this.CommonsSessionStorageService.set('digitalWebError', true);
        window.location.href = window.location.origin + window.location.pathname + window.location.search;
    };

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
           
    };

    private addLoginParameters = () => {
        this.loginParameters = {
            language: MmBAppConstants.lang,
            market: MmBAppConstants.market,
            returnURL: window.location.origin + window.location.pathname + window.location.search + '#!/mytrpsnew'
        };
    }

    private isUserLogged = (cookiesInfo) => {
        return (cookiesInfo.isLogged && !this.CommonsSessionStorageService.get('deepLinkParams') && !this.CommonsUserUtilsService.isSoftUser());
    };

    private removeMarginFooter = () => {
        const elementFooter = this.document.querySelector('ib-main-footer .ib-footer');
        
        if (elementFooter) {
            this.renderer.setStyle(elementFooter, 'margin-top', '0');
        }
    };
}

downgradeToAJSComponent('ibMmbSearchNew', {
  component: IbMmbSearchNewComponent,
  inputs: []
}, 'ib-mmb-search-new-module');
