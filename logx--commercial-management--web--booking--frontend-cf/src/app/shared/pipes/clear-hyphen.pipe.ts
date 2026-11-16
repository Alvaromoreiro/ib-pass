import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'clearHyphen'
})
export class ClearHyphenPipe implements PipeTransform {
    transform ( value: string ): string {
        return value.replace( /-/g, ' ' );
    }
    
    returnTransform (){
        return this.transform;
    }
}

