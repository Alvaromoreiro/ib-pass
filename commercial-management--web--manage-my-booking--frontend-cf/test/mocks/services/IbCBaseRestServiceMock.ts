import { Observable, Subscriber } from "rxjs";
export class IbCBaseRestServiceMock {
    private suscribeExample (subscriber: Subscriber<any>){
        subscriber.next({ status: 200, body: {} });
        subscriber.complete()
    };
    public get = jasmine.createSpy('get').and.callFake(
        () => new Observable(this.suscribeExample)
    );
    public post = jasmine.createSpy('post').and.callFake(
        () => new Observable(this.suscribeExample)
    );
    public put = jasmine.createSpy('put').and.callFake(
        () => new Observable(this.suscribeExample)
    );
    public delete = jasmine.createSpy('delete').and.callFake(
        () => new Observable(this.suscribeExample)
    );
    public patch = jasmine.createSpy('patch').and.callFake(
        ()=> new Observable(this.suscribeExample)
    );
 }