import { KeepAliveWorker } from '@core/workers/keep-alive-worker/ib-booking-keep-alive.worker';
// @ts-ignore
interface Worker extends KeepAliveWorker {
    keepAliveWorkerComponent: WorkerComponentMock;
    inactivityWorkerComponent: WorkerComponentMock;
    orderAliveWorkerComponent: WorkerComponentMock;
    setIO: () => void;
    sendMessage: (message: any) => void;
    messageHandler: (e: MessageEvent) => void;
} 
class WorkerComponentMock {
    postMessage = jasmine.createSpy('postMessage');
    manageOperations = jasmine.createSpy('manageOperations');
    
}


describe('Test KeepAlive Worker', () => {
    let worker: Worker; 
    beforeEach(() => {
        worker = new KeepAliveWorker() as unknown as Worker;
        worker.keepAliveWorkerComponent = new WorkerComponentMock();
        worker.inactivityWorkerComponent = new WorkerComponentMock();
        worker.orderAliveWorkerComponent = new WorkerComponentMock();
    });

    describe('Test messageHandler', () => {
        const actions = [
            { component: 'keepAlive', data: {}, cmpObjName : 'keepAliveWorkerComponent' },
            { component: 'inactivity', data: {}, cmpObjName : 'inactivityWorkerComponent' },
            { component: 'orderAlive', data: {}, cmpObjName : 'orderAliveWorkerComponent' }
        ];
        

        actions.forEach( (action) => {
            it(`Should redirect message to matching component -> ${action.component} `, () => {
                dispatchEvent(new MessageEvent('message', { data: { component: action.component, data: action.data } }));
                expect(worker[action.cmpObjName].manageOperations).toHaveBeenCalledWith(action.data);
            });
        });

        it('Should not redirect message if origin is not empty', () => {
            dispatchEvent(new MessageEvent('message', { data: { component: 'keepAlive', data: {} }, origin: 'http://malicious-origin.com' }));
            expect(worker.keepAliveWorkerComponent.manageOperations).not.toHaveBeenCalled();
        });

    });

    describe('Test setIO', () => {
        beforeEach(() => {
            spyOn(globalThis, 'removeEventListener').and.callThrough();
            spyOn(globalThis, 'addEventListener').and.callThrough();
            worker.setIO();
        });
        it('Should set postMessage for all components', () => {
            expect(worker.keepAliveWorkerComponent.postMessage).toBe(worker.sendMessage);
            expect(worker.inactivityWorkerComponent.postMessage).toBe(worker.sendMessage);
            expect(worker.orderAliveWorkerComponent.postMessage).toBe(worker.sendMessage);
            expect(globalThis.removeEventListener).toHaveBeenCalledWith('message', worker.messageHandler);
            expect(globalThis.addEventListener).toHaveBeenCalledWith('message', worker.messageHandler);
        });
        const workerComponentsNames = [
            'keepAliveWorkerComponent',
            'inactivityWorkerComponent',
            'orderAliveWorkerComponent'
        ];
        workerComponentsNames.forEach( (cmpName) => {
            it(`Should send message from ${cmpName}`, () => {
                spyOn(globalThis, 'postMessage').and.callThrough();
                const testMessage = { type: 'testMessage' };
                worker[cmpName].postMessage(testMessage);
                expect(globalThis.postMessage).toHaveBeenCalledWith(testMessage);
            });

        });
    });
    

});