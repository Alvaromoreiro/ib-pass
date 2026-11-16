import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
    public name = 'translate';

    public transform (query: string, ...args: any[]): unknown {
        return query;
    }
}


@Pipe({
    name: 'link'
})
export class LinkPipeMock implements PipeTransform {
    public name = 'translate';

    public transform (query: string, ...args: any[]): unknown {
        return query;
    }
}
