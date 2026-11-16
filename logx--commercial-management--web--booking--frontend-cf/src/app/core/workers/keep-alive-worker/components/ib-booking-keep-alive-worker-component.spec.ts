
import { KeepAliveWorkerComponent } from '@core/workers/keep-alive-worker/components/ib-booking-keep-alive-worker-component';
import { KeepAliveConstants } from '@core/constants/ib-keep-alive-constants';
import { CountdownTimer } from '@core/utils/CountdownTimer';
// @ts-ignore
interface WorkerComponent extends KeepAliveWorkerComponent {
    timer: CountdownTimer
    sessionTime: number;
}



describe('ib-booking-keep-alive-worker-component', () => {
    let component : WorkerComponent;
    const DEFAULT_SESSION_TIME = 50; //ms
    let postMessageSpy: jasmine.Spy;
    beforeEach(() => {
        component = new KeepAliveWorkerComponent(DEFAULT_SESSION_TIME) as unknown as WorkerComponent;
        postMessageSpy = jasmine.createSpy('postMessage');
        component.postMessage = postMessageSpy;
    });

    describe('Test initTimer method', () => {
        it('should initialize the timer with default session time', () => {
            const newComponent = new KeepAliveWorkerComponent() as unknown as WorkerComponent;
            expect(newComponent.sessionTime).toBe(KeepAliveConstants.DEFAULT_SESSION_TIME);
        });
    });

    describe('Test manageOperations method', () => {
        it('should start the timer with test defined session time', (done) => {
            component.postMessage = (message) => {
                component.timer.pause();
                expect(message).toEqual({ type: 'callKeepAlive' });
                done();
            };
            component.manageOperations({ type: 'start' });
        });
        it('should start the timer with custom session time', (done) => {
            const customSessionTime = 20;
            component.postMessage = (message) => {
                component.timer.pause();
                expect(message).toEqual({ type: 'callKeepAlive' });
                done();
            };
            component.manageOperations({ type: 'start', sessionTime: customSessionTime });
        });

        it('should stop the timer', (done) => {
            let callCount = 0;
            component.postMessage = (message) => {
                callCount++;
                if (callCount === 2) {
                    component.manageOperations({ type: 'stop' });
                }
            };
            component.manageOperations({ type: 'start' });
            setTimeout(() => {
                expect(callCount).toBe(2);
                done();
            }, DEFAULT_SESSION_TIME * 3);
        });

    });
});