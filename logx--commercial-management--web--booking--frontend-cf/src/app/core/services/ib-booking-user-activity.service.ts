import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, merge, map, Observable, catchError, of, timeout, filter, repeat, Subject, takeUntil } from 'rxjs';
import { UserActivityUtilsService } from './ib-booking-user-activity-utils.service';
import { KeepAliveWorkerInput, KeepAliveWorkerOutput } from '../../core/workers/keep-alive-worker/ib-booking-keep-alive.worker';
import { KeepAliveWorkerComponentInput } from '../../core/workers/keep-alive-worker/components/ib-booking-keep-alive-worker-component';
import { InactivityWorkerComponentInput } from '../../core/workers/keep-alive-worker/components/ib-booking-user-inactivity-worker-component';
import { OrderAliveWorkerComponentInput } from '../workers/keep-alive-worker/components/ib-booking-order-alive-worker-component';
import { downgradeToAJSService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '../constants/ib-booking-storage-constants';
import { OrderData } from '../models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { KeepAliveConstants } from '../constants/ib-keep-alive-constants';


@Injectable({
    providedIn: 'root'
})
export class BookingUserActivityService implements OnDestroy {
    
    private worker: Worker;
    private ACTIVITY_TIMEOUT = 5000; // 5 segundos sin eventos
    private ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'visibilitychange'];
    private $activityUnsubscribe = new Subject<void>();
    private isActivityListened = false;

    constructor (
        private ngZone: NgZone,
        private UserActivityUtilsService: UserActivityUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {
    }


    private isMMBOHFlow = (): boolean => {
        const flowApp: string = this.CommonsSessionStorageService.get( BkiStorageConstants.FLOW_APP );
        return flowApp === 'MMBOH';
    };


    public initActivityWorker = (): void => {
        if (typeof Worker !== 'undefined') {
            this.initWorker();
        }
    };



    private initWorker = (): void => {
        if( !this.worker) {
            this.worker = new Worker(new URL('../workers/keep-alive-worker/ib-booking-keep-alive.worker.ts', import.meta.url), { name: 'keep-alive-worker' });
            this.worker.onmessage = this.handleWorkerMessage;

            this.initKeepAliveTimer(false); //Recover keep alive timer from storage if exists
            this.initInactivityWorker();
        }
    };

    public terminateWorker = (): void => {
        this.sendKeepAliveEvent({ type: 'stop' });
        this.worker?.terminate();
    };

    private handleWorkerMessage = ({data}: MessageEvent<KeepAliveWorkerOutput>): void => {
        const type = data?.type;
        switch (type) {
                case 'callKeepAlive':
                    this.handleKeepAliveWorkerMessage();
                    break;
                case 'orderExpired':
                case 'inactivityPeriodEnded':
                    this.handleSessionExpired();
                    break;
        }
    };    

    private sendInactivityEvent = (message: InactivityWorkerComponentInput): void => {
        this.worker?.postMessage({ component: 'inactivity', data: message } as KeepAliveWorkerInput);
    };

    private sendKeepAliveEvent = (message: KeepAliveWorkerComponentInput): void => {
        this.worker?.postMessage({ component: 'keepAlive', data: message } as KeepAliveWorkerInput);
    };
    private sendOrderAliveEvent = (message: OrderAliveWorkerComponentInput): void => {
        this.worker?.postMessage({ component: 'orderAlive', data: message } as KeepAliveWorkerInput);
    };


    private initInactivityWorker = (): void => {
        this.sendInactivityEvent({ type: 'active' });
    };

    public initKeepAliveTimer (resetTimer = true): void {
        // Iniciar el worker de keep alive al cargar la aplicación
        if (resetTimer) {
            this.UserActivityUtilsService.setKeepAliveNextCall();
        }
        this.sendKeepAliveEvent({ type: 'start', sessionTime: this.UserActivityUtilsService.getNextKeepAliveCall() } as KeepAliveWorkerComponentInput);
    }

    public stopKeepAliveTimer = (): void => {
        this.sendKeepAliveEvent({ type: 'stop' } as KeepAliveWorkerComponentInput);
    };

    
    private handleSessionExpired = (): void => {
        this.UserActivityUtilsService.showSessionModal();
        if (!this.isMMBOHFlow()) {
            this.UserActivityUtilsService.checkOrderToIgnore();
        }
        this.UserActivityUtilsService.clearKeepAliveNextCall();
        this.stopActivityListener();
        this.terminateWorker();
    };
    
    
    private handleKeepAliveWorkerMessage = (): void => {
        this.UserActivityUtilsService.setKeepAliveNextCall();
        this.UserActivityUtilsService.callKeepAliveService().catch();
    };


    public initActivityListener = (): void => {
        if(this.isActivityListened) { return; }
        this.ngZone.runOutsideAngular(()=> {
            this.isActivityListened = true;
            const activityObservables = this.ACTIVITY_EVENTS.map((event) =>
                fromEvent(document, event)
            );
            let activityState: InactivityWorkerComponentInput['type'] = 'active';

            // Parar el contador inmediatamente al detectar actividad o visibilitychange a visible
            const activity$: Observable<InactivityWorkerComponentInput['type']>   = merge(...activityObservables).pipe(
                map(e=> this.isActiveByEvent(e)),
                timeout(this.ACTIVITY_TIMEOUT), // 5 segundos sin eventos
                catchError(() => of<InactivityWorkerComponentInput['type']>('inactive')),
                filter(activityType => activityType !== activityState),
                repeat()

            );
            activity$.pipe(takeUntil(this.$activityUnsubscribe)).subscribe((activityType) => {
                if(!this.isActivityListened) {
                    return;
                }
                activityState = activityType;
                this.sendInactivityEvent({ type: activityType });
            });
        });
            
    };

    private isActiveByEvent = (event: any): InactivityWorkerComponentInput['type'] => {
        if (event?.type === 'visibilitychange') {
            return document.visibilityState === 'visible' ? 'active' : 'inactive';
        }
        return 'active';   
    };

    public setOrderTimeoutTimer = (): void => {
        const createOrder = this.CommonsSessionStorageService.get<OrderData>(BkiStorageConstants.CREATE_ORDER_DATA);
        if(!createOrder || this.isMMBOHFlow()) {
            return;
        }
        let timeLimitStr = createOrder.order?.timeLimit;
        if(!timeLimitStr && createOrder.order) {
            createOrder.order.timeLimit = new Date(Date.now() + KeepAliveConstants.DEFAULT_ORDER_DURATION);
            this.CommonsSessionStorageService.set(BkiStorageConstants.CREATE_ORDER_DATA, createOrder);
            timeLimitStr = createOrder.order.timeLimit;
        }
        const limitDate = new Date(timeLimitStr).getTime();
        const currentDate = Date.now();
        if(!isNaN(limitDate)) {
            const timeDiff = limitDate - currentDate;
            this.sendOrderAliveEvent({ type: 'start', orderDuration: timeDiff });
            return;
        }
        this.sendOrderAliveEvent({ type: 'stop' });

    };

    public stopOrderTimeoutTimer = (): void => {
        this.sendOrderAliveEvent({ type: 'stop' });
    };

    public stopActivityListener = (): void => {
        this.isActivityListened = false;
        this.$activityUnsubscribe.next();
        this.sendInactivityEvent({ type: 'active' });
    };


    ngOnDestroy = (): void => {
        this.stopActivityListener();
        this.terminateWorker();
    };
}

downgradeToAJSService('BookingUserActivityService', BookingUserActivityService, 'ib-booking-app', []);