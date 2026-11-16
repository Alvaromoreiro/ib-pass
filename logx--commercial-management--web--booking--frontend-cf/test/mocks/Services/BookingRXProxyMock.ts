import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';

export class BookingRXProxyMock {
    public getResponse = {};
    public get = jasmine.createSpy( 'get' ).and.callFake( () => of( cloneDeep( this.getResponse ) ) );
    public post = jasmine.createSpy( 'post' );
    public put = jasmine.createSpy( 'put' );
    public delete = jasmine.createSpy( 'delete' ).and.callFake( () => of( cloneDeep( this.getResponse ) ) );
    public patch = jasmine.createSpy( 'patch' );
}