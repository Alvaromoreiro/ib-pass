import { Pipe, PipeTransform } from '@angular/core';
enum Case {
    UPPER = 'UPPER',
    LOWER = 'LOWER'
}


@Pipe({
    name: 'toCase'
})
export class ToCasePipe implements PipeTransform {
    constructor () {}
    
    transform ( value: string, casing: string  ): string {
        const action = {
            UPPER: value.toUpperCase.bind(value),
            LOWER: value.toLowerCase.bind(value)
        };

        return action[casing]() ?? value;
    }
}
