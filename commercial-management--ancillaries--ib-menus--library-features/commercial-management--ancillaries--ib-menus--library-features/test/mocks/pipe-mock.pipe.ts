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
    public transform (query: string, ...args: any[]): unknown {
        return query;
    }
}


@Pipe({
    name: 'aviosFormat'
})
export class AviosPipeMock implements PipeTransform {
    public transform (query: string | number, ...args: any[]): unknown {
        return query.toString();
    }
}

@Pipe({
    name: 'intlDate'
})
export class IntlDatePipeMock implements PipeTransform {
    public transform (query: string | number, ...args: any[]): unknown {
        return query.toString();
    }
}
