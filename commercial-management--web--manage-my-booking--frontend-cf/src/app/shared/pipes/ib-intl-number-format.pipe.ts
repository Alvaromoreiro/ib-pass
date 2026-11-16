
import {  Inject, Pipe, PipeTransform } from '@angular/core';
import { CommonsConstants } from 'ib-web-commons/constants';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';

/**
 * @description Performs the formatting of the input number to obtain the format corresponding to the language and market.
 */
@Pipe({
    name: 'intlNumber'
})
export class IbIntlNumberFormatPipe implements PipeTransform {
    constructor (
        @Inject(AJSRootScope) protected rootScope: CommonsRootScope
    ) {}

    transform (input: number | bigint | undefined | null, format?:  Intl.NumberFormatOptions): string {

        if (input === undefined || input === null) return '';
        if (format === null || format === undefined) { format = { maximumFractionDigits: 2, useGrouping: true }; }


        return new Intl.NumberFormat([
            `${this.rootScope.appLang}-${this.rootScope.appMarket}`,
            `${CommonsConstants.defaultLang}-${CommonsConstants.defaultMarket}`
        ], format).format(input);
    }
}
