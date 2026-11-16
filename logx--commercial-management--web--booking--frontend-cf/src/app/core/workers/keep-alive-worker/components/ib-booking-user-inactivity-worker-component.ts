import { CountdownTimer } from '../../../utils/CountdownTimer';
import { KeepAliveConstants } from '../../../constants/ib-keep-alive-constants';

export interface InactivityWorkerComponentInput {
    type: 'active' | 'inactive';
}
export interface InactivityWorkerComponentOutput {
    type: 'inactivityPeriodEnded';
}


export class InactivityWorkerComponent {
    private timer: CountdownTimer;
    private _postMessage: (message: InactivityWorkerComponentOutput) => void;
    constructor (
        private inactivityTime: number = KeepAliveConstants.DEFAULT_INACTIVITY_TIME
    ) {
        this.setTimer();
    }
    
    set postMessage (callback: (message: InactivityWorkerComponentOutput) => void) {
        this._postMessage = callback;
    }



    private setTimer = () => {
        this.timer = new CountdownTimer(this.inactivityTime);
        this.timer.onTimerStep = () =>  { 
            this._postMessage?.call(this, { type: 'inactivityPeriodEnded' });
            this.timer.pause();
        };
    };

    public manageOperations = (msgData: InactivityWorkerComponentInput) => {
        const { type } = msgData;
        switch (type) {
                case 'inactive':
                    this.timer.start();
                    break;
                case 'active':
                    this.timer.pause();
                    break;
        }
    };
}








