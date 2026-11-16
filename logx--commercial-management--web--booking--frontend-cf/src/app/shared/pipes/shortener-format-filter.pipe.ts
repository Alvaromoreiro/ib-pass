import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ShortenerFormatFilter',
    pure: true
})
export class ShortenerFormatFilterPipe implements PipeTransform {

    transform (
        stringInput: unknown,
        maxlength?: number,
        capitalized?: boolean,
        toLowerCase?: boolean
    ): string {
        const input = (stringInput ?? '') as any;
        const str = typeof input === 'string' ? input : String(input ?? '');

        const stringFormatted =
      capitalized ? this.capitalizeString(str) :
          toLowerCase ? this.toLowerCaseString(str) :
              str;

        const stringLength = maxlength ?? 3;

        return stringFormatted.length > stringLength
            ? stringFormatted.substring(0, stringLength)
            : stringFormatted;
    }

    private capitalizeString (inputString: string): string {
        return inputString && inputString.length > 1
            ? inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
            : '';
    }

    private toLowerCaseString (inputString: string): string {
        return inputString && inputString.length > 1
            ? inputString.toLowerCase()
            : '';
    }
}