import { CountdownTimer } from '../../../utils/CountdownTimer';

export interface OrderAliveWorkerComponentInput {
    type: 'start' | 'stop';
    orderDuration?: number;
}
export interface OrderAliveWorkerComponentOutput {
    type: 'orderExpired';
}


export class OrderAliveWorkerComponent {
    private timer: CountdownTimer;
    private _postMessage: (message: OrderAliveWorkerComponentOutput) => void;
    constructor (
    ) {}
    
    set postMessage (callback: (message: OrderAliveWorkerComponentOutput) => void) {
        this._postMessage = callback;
    }



    private setTimer = (timerEnd: number) => {
        this.timer = new CountdownTimer(timerEnd);
        this.timer.onTimerStep = () =>  { 
            this._postMessage?.call(this, { type: 'orderExpired' });
            this.timer.pause();
        };
    };

    public manageOperations = (msgData: OrderAliveWorkerComponentInput) => {
        const { type, orderDuration } = msgData;
        switch (type) {
                case 'start':
                    if (orderDuration) {
                        this.setTimer(orderDuration);
                        this.timer.start();
                    }
                    break;
                case 'stop':
                    this.timer?.pause();
                    break;
        }
    };
}