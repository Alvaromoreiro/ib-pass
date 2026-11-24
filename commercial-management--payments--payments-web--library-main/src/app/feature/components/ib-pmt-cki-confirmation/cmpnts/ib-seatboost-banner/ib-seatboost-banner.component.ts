import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PmtConstants } from '../../../../../core/ib-pmt-constants';
import { DatalayerUtilsServiceType, DatalayerUtilsServiceInjection } from 'ib-web-commons/ib-datalayer';

@Component({
    selector: 'ib-seatboost-banner',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './ib-seatboost-banner.component.html',
    styleUrls: ['./ib-seatboost-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IbSeatboostBannerComponent { 

    @Input() redirectionUrl:string = '';
    constructor (
        @Inject(DatalayerUtilsServiceInjection) private datalayerUtilsService: DatalayerUtilsServiceType
    ) {}

    private readonly baseImgUrl:string = PmtConstants.ROUTES.images;
    private readonly baseIconUrl:string = PmtConstants.ROUTES.icons;
  
    get bannerImage (): string {
        return `${this.baseImgUrl}/seatboost/seatboost.png`;
    }

    get iberiaIcon (): string {
        return `${this.baseIconUrl}/iberia/ib-logo-desktop-default-white.svg`;
    }

    get seatbootsIcon (): string {
        return `${this.baseIconUrl}/seatboost/seatboost.png`;
    }

    handleClick (): void {
        if (!this.redirectionUrl) return;
        this.sendAnalyticsEvent();
        window.open(this.redirectionUrl, '_blank');
    }

    public sendAnalyticsEvent = () => {
        this.datalayerUtilsService.updateDatalayerEvent('', 'clic', 'seatboost', 'interaccion');
    };
}
