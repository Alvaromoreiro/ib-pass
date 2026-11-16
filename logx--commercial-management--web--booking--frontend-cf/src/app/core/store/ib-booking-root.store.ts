import { Injectable, Inject } from '@angular/core';
import { AJSRootScope, downgradeToAJSService, CommonsRootScope } from 'ib-web-commons/utils';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface AppEvent {
    type: string;
    data?: any;
    scope?: any;
}

@Injectable({
    providedIn: 'root'
})
export class RootStore {
    private applicationData: Record<string, any> = {};
    private originalRootScope: CommonsRootScope;
    private eventBus = new Subject<AppEvent>();

    private readonly rootScopeMethods = new Set([
        '$new', '$destroy', '$evalAsync', '$apply',
        '$applyAsync', '$watch', '$watchGroup', '$watchCollection', '$digest',
        '$eval', '$id', '$parent', '$root', '$$phase', '$$destroyed',
        '$$listeners', '$$asyncQueue', '$$postDigestQueue', '$$childHead',
        '$$childTail', '$$nextSibling', '$$prevSibling', '$$watchers',
        '$on', '$emit', '$broadcast'
    ]);

    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ) {
        this.originalRootScope = this.$rootScope;
    }

    private syncToApplicationData (key: string, value: any): void {
        if (!this.rootScopeMethods.has(key)) {
            this.applicationData[key] = value;
        }
    }
    get (key: string): any { 
        return this.applicationData[key] ?? this.originalRootScope[key];
    }

    set (key: string, value: any): void {
        this.syncToApplicationData(key, value);
        this.originalRootScope[key] = value;
    }

    onRx<T = any>(eventType: string): Observable<T> {
        return this.eventBus.asObservable().pipe(
            filter(event => event.type === eventType),
            map(event => event.data)
        );
    }

    emitRx (type: string, ...data: any[]): void {
        this.eventBus.next({ type, data });
    }

    getOriginalRootScope (): CommonsRootScope {
        return this.originalRootScope;
    }


} 


downgradeToAJSService('RootStore', RootStore, 'ib-booking-root-module', []);



