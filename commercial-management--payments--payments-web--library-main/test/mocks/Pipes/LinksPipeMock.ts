import { Pipe } from '@angular/core';

@Pipe({
    name: 'link'
})
export class IbCLinkMockPipe implements PipeTransform {
    public transform =  jasmine.createSpy('transform').and.callFake((link: string): any => {
        return link;
    });
}