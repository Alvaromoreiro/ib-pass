import { Component, Input, OnInit, Inject } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-header-simple',
    templateUrl: './ib-booking-header-simple.component.html',
    styleUrls: ['./ib-booking-header-simple.component.scss']
})
export class IbBookingHeaderSimpleComponent implements OnInit{
    @Input() model: any;
    @Input() loginInfo: any;
    @Input() flightType?: any;
    public show: boolean;
    public logoUri: string;
    public iconsPath: string = BookingAppConstants.iconsRoute;

    constructor (
        @Inject( WINDOW_TOKEN ) private $window: ng.IWindowService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    ngOnInit (): void {
        this.logoUri = this.calculateLogoURL();
        this.checkModel();
    }

    private calculateLogoURL = (): string  =>{
        let result: string = this.$window.location.origin;
        const bkiURLparams: any = this.CommonsSessionStorageService.get('bookingUrlParams');
        
        if( bkiURLparams?.fromMarket?.length > 0) {
            result +=`/${bkiURLparams.fromMarket.toLowerCase()}/`;
            if ((typeof bkiURLparams.fromLanguage === 'string') && bkiURLparams.fromLanguage.length > 0) {
                result += `${bkiURLparams.fromLanguage.toLowerCase()}/`;
            }
        }
        
        return result;
    };


    private checkModel = () => {
        !this.model ? this.show = false : this.show = true;
    };
}
