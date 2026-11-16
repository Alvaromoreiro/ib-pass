export class WorkerMock {
    private _onmessage: ((this: Worker, ev: MessageEvent<any>) => any) | null = null;
    postMessage = jasmine.createSpy('postMessage');
    terminate = jasmine.createSpy('terminate');
    onmessageerror: ((this: Worker, ev: MessageEvent<any>) => any) | null = null;
    onerror: ((this: Worker, ev: ErrorEvent) => any) | null = null;

    addEventListener = jasmine.createSpy('addEventListener');
    removeEventListener = jasmine.createSpy('removeEventListener');
    dispatchEvent = jasmine.createSpy('dispatchEvent').and.returnValue(true);


    set onmessage (callback: (event:MessageEvent)=> unknown) {
        this._onmessage = jasmine.createSpy('onmessage').and.callFake(callback);
    }
    get onmessage() {
        return this._onmessage;
    }
}