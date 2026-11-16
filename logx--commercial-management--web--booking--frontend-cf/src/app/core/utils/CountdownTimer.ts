
export class CountdownTimer {
    public remainingTime: number;
    private intervalId: number | null = null;
    private _endTimerCallback: () => void;
    private _pauseTimerCallback: () => void;
    private _stepTimerCallback: (remainingTime: number) => void;
    private _startTimerCallback: () => void;
    private timerEnd: number = 0;
    
    constructor (
        private step: number, // Timer step in milliseconds
        private duration: number = 0  // Timer duration in milliseconds
    ) {}
    

    private setIterval = ()=> {
        this.intervalId = setInterval(() => {
            const now = Date.now();
            this.remainingTime = Math.max(0, this.timerEnd - now); // Compare to date now to improve precission
            this._stepTimerCallback?.call(this, this.remainingTime);
            if (this.duration > 0 && this.remainingTime === 0) {
                this.clearInterval();
                this._endTimerCallback?.call(this);
            }
        }, this.step) as unknown as number;
    };

    private clearInterval = () => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    };
    public start = () => {
        this.timerEnd = Date.now() + this.duration;
        this._startTimerCallback?.call(this);
        this.clearInterval();
        this.setIterval();
    };

    public pause = () => {
        this.clearInterval();
        this._pauseTimerCallback?.call(this);
    };

    public resume = () => {
        this.setIterval();
    };



    set onTimerStart (callback: () => void) {
        this._startTimerCallback = callback;
    }
    set onTimerEnd (callback: () => void) {
        this._endTimerCallback = callback;
    }
    set onTimerPause (callback: () => void) {
        this._pauseTimerCallback = callback;
    }
    set onTimerStep (callback: (remainingTime: number) => void) {
        this._stepTimerCallback = callback;
    }

}
