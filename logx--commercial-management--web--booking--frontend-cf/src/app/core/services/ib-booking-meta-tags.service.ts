import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BookingMetaTags } from '../constants/ib-booking-meta-tags.constants';

@Injectable({providedIn: 'root'})
export class IbBookingMetaTagsService {

    constructor (
        private Metas: Meta,
        private TranslateService: TranslateService
    ) { }

    public initMetaTags = () => {
        for ( let { name, value } of BookingMetaTags ) {
            const property = this.TranslateService.instant( value );
            this.Metas.addTag( { name, property });
        }
    };
}
