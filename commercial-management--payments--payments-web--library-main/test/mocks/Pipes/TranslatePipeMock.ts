import { Pipe } from '@angular/core';

@Pipe({
    name: 'translate'
})
export class TranslateMockPipe implements PipeTransform {
    public name: string = 'translate';

    public transform  =  jasmine.createSpy('transform').and.callFake((query: string, ...args: any[]): any => {
        if (args && args.length > 0) {
            return query + JSON.stringify(args[0]);
        }
        return query;
    });
}