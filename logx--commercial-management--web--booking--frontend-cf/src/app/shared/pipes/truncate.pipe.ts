import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    constructor () {}

    transform ( value: string, maxLength: number = value.length, initialIndex:number = 0 ): string {
        return value.substring(initialIndex, maxLength);
    }
}
