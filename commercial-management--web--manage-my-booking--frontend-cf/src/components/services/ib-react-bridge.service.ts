// react-bridge.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { downgradeToAJSService } from "ib-web-commons/utils";

export type ReactEventType = 'RETRIEVE_BOOKING' | 'OTHER';
export type ReactEventPayload = {
	pnr: string;
	surname: string;
}
export interface ReactEvent {
  type: ReactEventType;
  payload: ReactEventPayload;
};

@Injectable({
  providedIn: 'root'
})
export class ReactBridgeService implements OnDestroy {

  private eventSubject = new Subject<ReactEvent>();
  event$ = this.eventSubject.asObservable();
   private listenerRegistered = false;

  constructor() {
      this.listener();
  }

  private listener = () => {
    if (!this.listenerRegistered) {
      window.addEventListener('react-event', (event: Event) => {
        const customEvent = event as CustomEvent<ReactEvent>;
          this.eventSubject.next(customEvent.detail);
      });
      this.listenerRegistered = true;
    };
  };

  ngOnDestroy() {
    window.removeEventListener('react-event', this.listener);
    this.eventSubject.complete();
  }
}

downgradeToAJSService('ReactBridgeService', ReactBridgeService, 'ib-MmB-services-module');