import { Pipe, PipeTransform } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import dayjs from 'dayjs';

@Pipe({
    name: 'shortDateFormat',
    pure: true
})
export class ShortDateFormatPipe implements PipeTransform {
    constructor (
        private commonsSessionStorageService: CommonsSessionStorageService
    ) {}

    transform (date: string): string {
        const commercialData = this.commonsSessionStorageService.get<AvailabilityTransformerModel.AvailabilityCommercialData>('commercialData');
        const languageCode = BookingAppConstants.lang;
        const language = commercialData?.languages?.find(lang => lang.code === languageCode);

        const formatParts = language.dateFormat.short.split(/[/.-]/);

        const parsedDate = dayjs(date, 'DD/MM/YYYY');

        const dateSegments = {
            d: parsedDate.format('DD'),
            m: parsedDate.format('MM'),
            y: parsedDate.format('YYYY')
        };

        const finalDate = formatParts.map(part => dateSegments[part.charAt(0).toLowerCase()]).join('/');
        return finalDate;
    }
}