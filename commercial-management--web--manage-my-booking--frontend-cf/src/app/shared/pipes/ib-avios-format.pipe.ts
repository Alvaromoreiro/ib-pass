import { Pipe, PipeTransform } from '@angular/core';
import { IbIntlNumberFormatPipe } from './ib-intl-number-format.pipe';

/**
 * Transforms the avios of the user to the standarize format of Iberia Plus avios.
 */
@Pipe({
    name: 'aviosFormat',
    pure: false
})
export class IbAviosFormatPipe implements PipeTransform {

    constructor (private intlNumberFormatPipe: IbIntlNumberFormatPipe) {}

    /**
     * Transforms the input value to the avios standarized format.
     * @param value {number | string} Value to transform
     */
    transform (value: number | string | undefined | null): string {
        if (value === undefined || value === null) return '';
        const stringedValue = typeof value === 'number' ? value : parseInt(value);
        if (isNaN(stringedValue)) return value.toString();
        return this.intlNumberFormatPipe.transform(stringedValue, { maximumFractionDigits: 0, useGrouping: true });
    }

}
