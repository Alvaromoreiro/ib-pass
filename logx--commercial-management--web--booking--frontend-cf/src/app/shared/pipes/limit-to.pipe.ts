import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'limitTo'
})
export class LimitToPipe implements PipeTransform {
    transform (value: any[], init:number, limit: number): any[] {
        return value.slice(init, limit);
    }
}
