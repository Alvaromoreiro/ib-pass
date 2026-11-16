
import { InactivityWorkerComponent } from '@core/workers/keep-alive-worker/components/ib-booking-user-inactivity-worker-component';
import { KeepAliveConstants } from '@core/constants/ib-keep-alive-constants';
import { CountdownTimer } from '@src/app/core/utils/CountdownTimer';

// @ts-ignore
interface WorkerComponent extends InactivityWorkerComponent {
    inactivityTime: number;
    timer: CountdownTimer;
    _postMessage: jasmine.Spy;
}



describe('ib-booking-user-inactivity-worker-component', () => {
    let component : WorkerComponent;
    const INACTIVITY_TIME = 50; //ms
    let postMessageSpy: jasmine.Spy;
    beforeEach(() => {
        component = new InactivityWorkerComponent(INACTIVITY_TIME) as unknown as WorkerComponent;
        postMessageSpy = jasmine.createSpy('postMessage');
        component.postMessage = postMessageSpy;
    });

    describe('Test initTimer method', () => {
        it('should initialize the timer with default session time', () => {
            const newComponent = new InactivityWorkerComponent() as unknown as WorkerComponent;
            expect(newComponent.inactivityTime).toBe(KeepAliveConstants.DEFAULT_INACTIVITY_TIME);
        });
    });

    describe('Test manageOperations method', () => {
        it('should start the timer with test defined inactivity tyme', (done) => {
            component.postMessage = (message) => {
                component.timer.pause();
                expect(message).toEqual({ type: 'inactivityPeriodEnded' });
                done();
            };
            component.manageOperations({ type: 'inactive' });
        });

        it('test inactivity paused by active message', (done) => {
            component.manageOperations({ type: 'inactive' });
            setTimeout(() => {
                component.manageOperations({ type: 'active' });
                expect(component._postMessage).not.toHaveBeenCalled();
                done();
            }, INACTIVITY_TIME /3);
        });

    });
});