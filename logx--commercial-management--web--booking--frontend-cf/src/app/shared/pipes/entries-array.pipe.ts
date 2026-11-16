import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'entriesArray'
})
export class EntriesArrayPipe implements PipeTransform {

    transform ( value: any ): any[] {
        let entriesArray: any[] = [];
        Object.entries( value ).forEach( ( key ) => {
            entriesArray.push( key[ 1 ] );
        } );
        return Array.from( entriesArray );
    }

}
