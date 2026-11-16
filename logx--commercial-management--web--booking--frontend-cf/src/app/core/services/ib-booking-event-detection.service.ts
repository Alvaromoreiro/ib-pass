import { Injectable, Inject } from '@angular/core';
import { RootStore } from '../store/ib-booking-root.store';
import { AJSRootScope } from 'ib-web-commons/utils';

/**
 * Service that intercepts AngularJS RootScope methods ($emit, $broadcast, $on)
 * to provide logging and monitoring capabilities for event detection.
 * 
 * This service monkey-patches the original RootScope methods while preserving
 * their functionality and properties.
 */
@Injectable({
    providedIn: 'root'
})
export class EventDetectionService {
    private originalMethods: Map<string, (...args: any[]) => any> = new Map();
    private rootScope: any;

    /**
     * Initializes the service and sets up method interception
     * @param rootScope - AngularJS RootScope instance
     * @param rootStore - RootStore service for RxJS event propagation
     */
    constructor (@Inject(AJSRootScope) rootScope: any, private rootStore: RootStore) {
        this.rootScope = rootScope;
    }

    /**
     * Sets up method interception for RootScope methods
     * @public
     */
    public setupInterception (): void {
        try {
            this.backupOriginalMethods();
            this.interceptMethods();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('❌ Failed to intercept AngularJS RootScope:', error);
        }
    }


    /**
     * Backs up original RootScope methods before interception
     * @private
     */
    private backupOriginalMethods (): void {
        this.originalMethods.set('$emit', this.rootScope.$emit);
        this.originalMethods.set('$broadcast', this.rootScope.$broadcast);
        this.originalMethods.set('$on', this.rootScope.$on);
    }

    /**
     * Intercepts RootScope methods and replaces them with logging versions
     * @private
     */
    private interceptMethods (): void {
        this.rootScope.$emit = this.createInterceptedMethod('$emit');
        this.rootScope.$broadcast = this.createInterceptedMethod('$broadcast');
        this.rootScope.$on = this.createInterceptedOn();
    }

    /**
     * Creates an intercepted version of a rootScope method with RxJS propagation
     * @private
     */
    private createInterceptedMethod (methodName: string) {
        const originalMethod = this.originalMethods.get(methodName)!;
        const rootStore = this.rootStore;
        
        const newMethod = function (this: any, name: string, ...args: any[]) {
            // Emit to RxJS system first
            rootStore.emitRx(name, ...args);
            
            // Then emit to AngularJS system
            return originalMethod.apply(this, [name, ...args]);
        };
        
        this.copyMethodProperties(newMethod, originalMethod);
        return newMethod;
    }

    /**
     * Creates an intercepted version of $on with logging
     * @private
     */
    private createInterceptedOn () {
        const originalOn = this.originalMethods.get('$on')!;
        const newOn = function (this: any, name: string, listener: (...args: any[]) => any) {
            return originalOn.apply(this, [name, listener]);
        };
        
        this.copyMethodProperties(newOn, originalOn);
        return newOn;
    }

    /**
     * Copies all properties from original method to new method while preserving functionality
     * @private
     * @param newMethod - The new method to copy properties to
     * @param originalMethod - The original method to copy properties from
     */
    private copyMethodProperties (newMethod, originalMethod): void {
        Object.setPrototypeOf(newMethod, originalMethod);
        
        const excludedProps = ['length', 'name', 'prototype'];
        Object.getOwnPropertyNames(originalMethod).forEach(prop => {
            if (!excludedProps.includes(prop)) {
                try {
                    (newMethod as any)[prop] = (originalMethod as any)[prop];
                } catch (e) {
                    // Ignore non-configurable properties
                    // eslint-disable-next-line no-console
                    console.error(`❌ Failed to copy property '${prop}' from original method:`, e);
                }
            }
        });
    }

}
