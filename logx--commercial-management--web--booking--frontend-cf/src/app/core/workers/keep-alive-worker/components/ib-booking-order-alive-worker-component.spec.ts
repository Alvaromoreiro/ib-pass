
import { OrderAliveWorkerComponent } from '@core/workers/keep-alive-worker/components/ib-booking-order-alive-worker-component';
import { CountdownTimer } from '@src/app/core/utils/CountdownTimer';

// @ts-ignore
interface WorkerComponent extends OrderAliveWorkerComponent {
    timer: CountdownTimer;
    _postMessage: jasmine.Spy;
}



describe('OrderAliveWorkerComponent', () => {
    let component : WorkerComponent;
    const SESSION_TIME = 50; //ms
    let postMessageSpy: jasmine.Spy;
    beforeEach(() => {
        component = new OrderAliveWorkerComponent() as unknown as WorkerComponent;
        postMessageSpy = jasmine.createSpy('postMessage');
        component.postMessage = postMessageSpy;
    });

 

    describe('Test manageOperations method', () => {
        it('should not start the timer if orderDuration is not provided', (done) => {
            setTimeout(() => {
                component.manageOperations({ type: 'start' });
                expect(component.timer).toBeUndefined();
                done();
            }, SESSION_TIME);
        });
        it('should start the timer with custom order duration', (done) => {
            component.postMessage = (message) => {
                component.timer.pause();
                expect(message).toEqual({ type: 'orderExpired' });
                done();
            };
            component.manageOperations({ type: 'start', orderDuration: SESSION_TIME });
            expect(component.timer).toBeDefined();
            
        });
        it('should stop the timer', (done) => {
            component.manageOperations({ type: 'start', orderDuration: SESSION_TIME });
            setTimeout(() => {
                component.manageOperations({ type: 'stop' });
            }, SESSION_TIME /3);

            setTimeout(() => {
                expect(component._postMessage).not.toHaveBeenCalled();
                done();
            }, SESSION_TIME * 2);
        });
    });
});