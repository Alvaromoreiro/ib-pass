import { KeepAliveConstants } from '@core/constants/ib-keep-alive-constants';
import { CountdownTimer } from '@core/utils/CountdownTimer';

export interface KeepAliveWorkerComponentInput {
    type: 'start' | 'stop';
    sessionTime?: number;
}
export interface KeepAliveWorkerComponentOutput {
    type: 'callKeepAlive';
}



export class KeepAliveWorkerComponent {
    private _postMessage: (message: KeepAliveWorkerComponentOutput) => void;
    private timer: CountdownTimer;
    constructor ( 
        private sessionTime: number = KeepAliveConstants.DEFAULT_SESSION_TIME
    ){
        this.setTimer();
    }

    set postMessage (callback: (message: KeepAliveWorkerComponentOutput) => void) {
        this._postMessage = callback;
    }
    private setTimer = () => {
        this.timer = new CountdownTimer(this.sessionTime);
        this.timer.onTimerStep = () =>  { 
            this._postMessage?.call(this, ( { type: 'callKeepAlive' } ));
        };
    };
    public manageOperations = (msgData: KeepAliveWorkerComponentInput) => {
        const { type, sessionTime } = msgData; 
        switch (type) {
                case 'start':
                    if (sessionTime) {
                        this.timer.pause();
                        this.sessionTime = sessionTime;
                        this.setTimer();
                    }
                    this.timer.start();
                    break;
                case 'stop':
                    this.timer.pause();
                    break;
        }
    };
}

