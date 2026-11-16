import { Component, HostListener, Inject, Input } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingHeaderGreyBarTransformerService } from '../../services/transformers/ib-booking-header-grey-bar-transformer.service';
import { HeaderDataType } from '@src/app/core/models/ib-booking-availability/header-model';

@Component({
    selector: 'ib-booking-header-login-mobile',
    templateUrl: './ib-booking-header-login-mobile.component.html',
    styleUrls: ['./ib-booking-header-login-mobile.component.scss']
})
export class IbBookingHeaderLoginMobileComponent {
    @Input() public model;
    @Input() public isMobile;
    @Input() public headerMobile;
    public innerWidth: number;
    constructor (
        @Inject( WINDOW_TOKEN ) private window: ng.IWindowService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private ibGreyBarTransformer: BookingHeaderGreyBarTransformerService
    ) {}
    public open: boolean = false;
    public showIframe: boolean = false;

    public toggle () {
        this.open = !this.open;
        this.showIframe = true;
        this.innerWidth = this.window.innerWidth;
    }
    public afterLogin = ( data ) => {
        const headerModel: HeaderDataType = this.CommonsSessionStorageService.get( 'headerModel' );
        this.model.loggedData = this.ibGreyBarTransformer.updateLoggedData( data );
        this.model.isLogged = true;
        headerModel.greyBarModel = this.model;
        this.CommonsSessionStorageService.set( 'headerModel', headerModel );
        if ( typeof this.model.login?.afterLogin === 'function' ) {
            this.model.login.afterLogin( data );
        } else {
            this.window.location.reload();
        }
    };
    @HostListener('window:resize', ['$event'])
    public onResize = () => {
            if ( this.open && ( this.innerWidth !== this.window.innerWidth )  ) {
                this.toggle();
            }
        };
}
