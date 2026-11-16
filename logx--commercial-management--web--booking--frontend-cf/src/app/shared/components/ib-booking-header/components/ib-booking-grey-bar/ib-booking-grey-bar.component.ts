import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingHeaderGreyBarTransformerService } from '../../services/transformers/ib-booking-header-grey-bar-transformer.service';
import { HeaderDataType } from '@src/app/core/models/ib-booking-availability/header-model';

@Component({
    selector: 'ib-booking-grey-bar',
    templateUrl: './ib-booking-grey-bar.component.html',
    styleUrls: ['./ib-booking-grey-bar.component.scss']
})
export class IbBookingGreyBarComponent implements OnInit {

    public innerWidth = this.$window.innerWidth;
    public isMobile: boolean = false;
    @Input() public model: any;
    constructor (
        @Inject( WINDOW_TOKEN ) private $window: ng.IWindowService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private ibGreyBarTransformer: BookingHeaderGreyBarTransformerService
    ) {

    }

    ngOnInit (): void {
        this.responsive();
    }
    @HostListener('window:resize', ['$event'])
    public responsive () {
        this.innerWidth = this.$window.innerWidth;
        if (this.innerWidth < 768) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
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
            this.$window.location.reload();
        }
    };

    public hideLogin () {
        this.model.show = false;
    }

}
