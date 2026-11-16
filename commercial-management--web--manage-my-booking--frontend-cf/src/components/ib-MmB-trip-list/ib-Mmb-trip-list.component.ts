import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AJSRootScope, downgradeToAJSComponent, IbCUserUtilsService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { NewManageMyBookingService } from '../services/ib-MmB-new-manage-my-booking.service';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from '../../app/shared/components/loading-spinner/loading-spinner.service';
import { ReactBridgeService } from '../services/ib-react-bridge.service';
import { BookingSearchService } from '../services/ib-booking-search-service';
import { AJSBookingSearchService } from '../services/upgraded/ib-booking-search-service-bridge.service';
import { EMPTY, exhaustMap, Subject, takeUntil } from 'rxjs';
import { AJSCommonsCheckLoginWCSService } from '../services/upgraded/ib-commons-check-login-wcs-bridge.service';
import { DOCUMENT } from '@angular/common';
@Component({
    selector: 'ib-mmb-trip-list',
    templateUrl: 'ib-Mmb-trip-list.component.html'
})
export class IbMmbTripListComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    formData: any;

    constructor (
        private NewManageMyBookingService: NewManageMyBookingService,
        private LoadingSpinnerService: LoadingSpinnerService,
        private router: Router,
        @Inject(AJSBookingSearchService) private BookingSearchService: BookingSearchService,
        @Inject(AJSRootScope) public $rootScope: CommonsRootScope,
        @Inject(AJSCommonsCheckLoginWCSService) private CommonsCheckLoginWCSService: CommonsCheckLoginWCSService,
        @Inject(DOCUMENT) private document: Document,
        private ReactBridgeService: ReactBridgeService,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
         private renderer: Renderer2
    ){
       
    }


    ngOnInit () {
        const cookiesInfo = this.CommonsCheckLoginWCSService.generateSSOInfo(true);

        if (!this.isUserLogged(cookiesInfo)) {
            this.router.navigate(['chktrpnew']);
            return false;
        };

        this.NewManageMyBookingService.importNewManageMyBookingComponent().then(() => this.onSuccess()).catch(() => this.onError());
        this.ReactBridgeService.event$.pipe(
        exhaustMap(data => {
            this.formData = data.payload;
            this.handleBookingSearch(this.formData);
            return EMPTY;
        }), takeUntil(this.destroy$)).subscribe();
        
    };

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    };

    private isUserLogged = (cookiesInfo) => {
        return (cookiesInfo.isLogged && !this.CommonsSessionStorageService.get('deepLinkParams') && !this.CommonsUserUtilsService.isSoftUser());
    };

    handleBookingSearch = (data) => {
        this.BookingSearchService.searchFlightsPassengersEvent(null, data)
    }

    onSuccess = () => {
        this.removeMarginFooter();
        this.$rootScope.showMainHeader = true;
        this.$rootScope.showHeaders = true;
        this.LoadingSpinnerService.hide();
    };

    onError = () => {
        // eslint-disable-next-line no-console
        console.log('Redireccionando a la página antigua de bookingList')
        this.router.navigate(['/mytrps']);
    };

       private removeMarginFooter = () => {
        const elementFooter = this.document.querySelector('ib-main-footer .ib-footer');
        
        if (elementFooter) {
            this.renderer.setStyle(elementFooter, 'margin-top', '0');
        }
    };
}

downgradeToAJSComponent(
    'ibMmbTripList',
    {
        component: IbMmbTripListComponent,
        inputs: [],
        outputs: []
    },
    'ib-mmb-trip-list-module',
    []
);