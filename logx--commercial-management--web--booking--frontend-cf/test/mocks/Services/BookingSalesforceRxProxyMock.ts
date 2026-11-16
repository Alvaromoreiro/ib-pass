import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';

export class BookingSalesforceRxProxyMock {
    public getResponse = {};
    public get = jasmine.createSpy( 'get' ).and.callFake( () => of( cloneDeep( this.getResponse ) ) );
    public post = jasmine.createSpy( 'post' ).and.callFake( () => of( cloneDeep( this.getResponse ) ) );
    public put = jasmine.createSpy( 'put' );
    public delete = jasmine.createSpy( 'delete' ).and.callFake( () => of( cloneDeep( this.getResponse ) ) );
    public patch = jasmine.createSpy( 'patch' );
}