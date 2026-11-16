import { Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { downgradeToAJSService, CommonsSessionStorageService } from 'ib-web-commons/utils';



type QuadrigamCode = string;

export interface DigitalDataQuadrigamData {
    NView: number;
}

@Injectable({ providedIn: 'root' })
export class DigitalDataViewCounterService {
    private NViewMap: Map<QuadrigamCode, DigitalDataQuadrigamData> = new Map();

    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {
        this.restoreFromSession();
    }

    increment (quadrigram: QuadrigamCode): number {
        const key = this.normalize(quadrigram);
        const current = this.NViewMap.get(key)?.NView ?? 0;
        const next = current + 1;
        this.NViewMap.set(key, { NView: next });
        this.persistToSession();
        return next;
    }

    get (quadrigram: QuadrigamCode): number {
        return this.NViewMap.get(this.normalize(quadrigram))?.NView ?? 0;
    }


    reset (quadrigram?: QuadrigamCode): void {
        if (quadrigram) {
            this.NViewMap.delete(this.normalize(quadrigram));
        } else {
            this.NViewMap.clear();
        }
        this.persistToSession();
    }

    restartUnderConditions (): void {
        if((window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'reload' ) 
            return;
        const navigationId = window.history.state?.navigationId; 
        if (!navigationId) {
            this.reset();
            return;
        }        
        const isOnHoldConfirmation = window.location.href.includes('/ohmtdt');
        const needsOnHoldReset = isOnHoldConfirmation && this.get(BookingAppConstants.QUADRIGAMS.ON_HOLD_CONF) === 0;
            
        if (navigationId===1 || needsOnHoldReset) {
            this.reset();
        }
    }
    
    private normalize (code: string): string {
        return (code || '').replace(/\//g, '').trim();
    }

    private restoreFromSession (): void {
        try {
            const raw:string | null = sessionStorage.getItem('ib-booking-app.NView');
            if (!raw) return;
            const obj = JSON.parse(raw) as Record<string, DigitalDataQuadrigamData>;
            this.NViewMap = new Map(Object.entries(obj));
        } catch {}
    }

    private persistToSession (): void {
        try {
            const quadrigamsMap = Object.fromEntries(this.NViewMap.entries());
            this.CommonsSessionStorageService.set(BkiStorageConstants.NView, quadrigamsMap);
        } catch {}
    }
}
downgradeToAJSService('DigitalDataViewCounterService', DigitalDataViewCounterService, 'ib-datalayer-bki-module');
