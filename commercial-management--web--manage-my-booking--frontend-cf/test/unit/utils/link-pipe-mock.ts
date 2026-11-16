import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'linkPipe'
})
export class IbCLinkPipeMock implements PipeTransform {
    public name = 'linkPipe';

    public transform (query: string, ...args: any[]): unknown {
        return query;
    }
}
