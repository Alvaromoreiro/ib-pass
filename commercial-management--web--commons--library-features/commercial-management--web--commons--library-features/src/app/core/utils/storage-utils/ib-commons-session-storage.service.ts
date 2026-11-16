
import { Injectable, OnDestroy } from '@angular/core';
import { downgradeToAJSService, getAJSModule } from '../ib-commons-angularjs-utils';
import { IbStorageUtility, SessionConfig } from './ib-storage-utils.model';

@Injectable({
    providedIn: 'root'
    })
export class CommonsSessionStorageService implements IbStorageUtility, OnDestroy {
    private prefix = '';
    private cache =  new Map<string, string>();
    private pendingWrites = new Map<string, string>();
    private updateTaskId: number = -1; 
    private readonly flushDelay = 25; // Delay in milliseconds to batch updates
    private maxCacheSize = 150; // Maximum number of entries kept in memory cache (LRU)
    private lastUsedSet = new Set<string>();


    constructor () {
        document.addEventListener('visibilitychange', this.flushPendingStoreUpdates);
        window.addEventListener('pagehide', this.flushPendingActions);
        window.addEventListener('beforeunload', this.flushPendingActions);
    }
    ngOnDestroy (): void {
        document.removeEventListener('visibilitychange', this.flushPendingStoreUpdates);
        window.removeEventListener('pagehide', this.flushPendingActions);
        window.removeEventListener('beforeunload', this.flushPendingActions);
    }

    private buildStorageKey (
        key: string,
        config: SessionConfig = { withPrefix: true }
    ): string {
        return config.withPrefix && this.prefix !== '' ? `${this.prefix}.${key}` : key;
    }

    setPrefix (prefix: string): void {
        this.prefix = prefix;
    }

    /**
     * @description Sets the maximum number of entries that the in-memory cache can hold.
     * When the limit is exceeded, the least recently used (LRU) entry is evicted from the cache.
     * 
     * Note: This limit only affects the in-memory cache and does not impact the native `sessionStorage` capacity. 
     * It is recommended to change this value before using the service to avoid evicting entries that are still needed in memory.
     * @param {number} size The maximum number of entries to keep in memory cache.
     */
    setMaxCacheSizeLimit (size: number): void {
        this.maxCacheSize = size;
        while (this.cache.size > this.maxCacheSize) {
            const leastUsedKey = this.lastUsedSet.values().next().value;
            if (leastUsedKey) {
                this.cache.delete(leastUsedKey);
                this.lastUsedSet.delete(leastUsedKey);
            }
        }
    }

    isSupported (): boolean {
        return typeof window.sessionStorage !== 'undefined';
    }

    /**
     * Synchronizes pending writes to native `sessionStorage`.
     * Values are taken from `pendingWrites` to avoid losing updates
     * when entries are evicted from in-memory cache before flush.
     */
    private updateNativeStore = () => {
        for (const [key, value] of this.pendingWrites) {
            window.sessionStorage.setItem(key, value);
        }
        this.pendingWrites.clear();  
    };

    /**
     * Flushes pending updates immediately and cancels any scheduled task.
     */
    private flushPendingActions = () => {
        if (this.pendingWrites.size === 0) {
            return;
        }

        if (this.updateTaskId !== -1) {
            window.clearTimeout(this.updateTaskId);
            this.updateTaskId = -1;
        }

        this.updateNativeStore();
    };

    /**
     * Flushes pending updates when the document becomes hidden.
     */
    private flushPendingStoreUpdates = () => {
        if (document.visibilityState !== 'hidden') {
            return;
        }

        this.flushPendingActions();
    };

    /**
     * Schedules a debounced synchronization to native `sessionStorage`.
     */
    private programNativeStoreUpdate = ()=> {
        if (this.updateTaskId !== -1){
            window.clearTimeout(this.updateTaskId);
            this.updateTaskId = -1;
        }

        this.updateTaskId = window.setTimeout(()=> {
            this.updateNativeStore();
            this.updateTaskId = -1;
        }, this.flushDelay);
    };


    /**
     * Updates LRU tracking by moving the key to the most recently used position.
     */
    private updateLastUsedSet (key: string): void {
        this.lastUsedSet.delete(key);
        this.lastUsedSet.add(key);
    }

    /**
     * Stores a key/value pair in memory cache applying LRU eviction.
     * This size limit affects only in-memory cache, not native persistence.
     */
    private setToCache (key: string, value: string): void {
        this.updateLastUsedSet(key);
        if (!this.cache.has(key) && this.cache.size >= this.maxCacheSize) {
            const leastUsedKey = this.lastUsedSet.values().next().value;
            if (leastUsedKey) {
                this.cache.delete(leastUsedKey);
                this.lastUsedSet.delete(leastUsedKey);
            }
        }
        this.cache.set(key, value);
    }

    /**
   * @description Iberia utility to set an object to [<b>session storage</b>]{@link https://developer.mozilla.org/es/docs/Web/API/Window/sessionStorage}.
    * This method updates an in-memory cache and schedules a deferred synchronization to native storage
    * to reduce blocking calls to the main thread.
    * Do not pass undefined or null values. If an undefined value is passed,
    * it will be converted to null to avoid errors when recovering the value and make it more consistent.
   * @param {string} key The key to set the value to. It will be prefixed by default if the config is set in the application
   * @param {unknown} value Any value to store, non-null or undefined. It will be serialized.
   * @param {SessionConfig} config  Optional config object to override if it has to use the prefix, true by default.
   * @example
   * storageService.set('key', value);
   * @author Iván Peña Huguet
   */
    set (
        key: string,
        value: NonNullable<unknown>,
        config: SessionConfig = { withPrefix: true }
    ): void {
        const valueToSave = JSON.stringify(
            typeof value === 'undefined' ? null : value
        );
        const keyToSave = this.buildStorageKey(key, config);

        this.setToCache(keyToSave, valueToSave);
        this.pendingWrites.set(keyToSave, valueToSave);
        this.programNativeStoreUpdate();

    }

    /**
   * @description Iberia utility to get an object from [<b>session storage</b>]{@link https://developer.mozilla.org/es/docs/Web/API/Window/sessionStorage}.
    * It uses generic type to set the typing, see examples for more info.
    * It first tries the in-memory cache and only falls back to native storage if needed.
    * If no value is found, it returns null consistently.
   * @param {string} key The key to get the value from. It will be prefixed by default if the config is set in the application
   * @param {SessionConfig} config  Optional config object to override if it has to use the prefix, true by default.
   * @returns The value found or null if not found.
   * @example
   * storageService.get<MyType>('key'); // returns 'value' as MyType
   * storageService.get<string>('key'); // returns 'value' as string
   * storageService.get<string>('key', { withPrefix: false }); // returns 'value' as string and ignores the prefix
   * @author Iván Peña Huguet
   */
    get<T = unknown>(
        key: string,
        config: SessionConfig = { withPrefix: true }
    ): T | null {
        const keyToGet = this.buildStorageKey(key, config);
        const cachedValue = this.cache.get(keyToGet);
        const value =
            cachedValue !== undefined
                ? cachedValue
                : window.sessionStorage.getItem(keyToGet);

        if (value === null || value === '') {
            return null;
        }

        if (cachedValue === undefined) {
            this.setToCache(keyToGet, value);
        }
        this.updateLastUsedSet(keyToGet);
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    /**
   * @description Iberia utility to remove a value from [<b>session storage</b>]{@link https://developer.mozilla.org/es/docs/Web/API/Window/sessionStorage}.
    * The value is removed from cache and `sessionStorage` immediately to avoid recovery if `get` is called right after.
   * @param {string} key The key to remove of the storage. It will be prefixed by default if the config is set in the application
   * @param {SessionConfig} config  Optional config object to override if it has to use the prefix, true by default.
   * @example
   * storageService.remove('key');
   * storageService.remove('key', { withPrefix: false });
   * @author Iván Peña Huguet
   */
    remove (key: string, config: SessionConfig = { withPrefix: true }): void {
        const keyToRemove = this.buildStorageKey(key, config);
        this.cache.delete(keyToRemove);
        this.pendingWrites.delete(keyToRemove);
        this.lastUsedSet.delete(keyToRemove);
        window.sessionStorage.removeItem(keyToRemove);
    }
    /**
    * @description Iberia utility to clear all variables that match a pattern from [<b>session storage</b>]{@link https://developer.mozilla.org/es/docs/Web/API/Window/sessionStorage}.
    * Matching keys are removed from cache and `sessionStorage` immediately.
   * @param {string | RegExp} pattern Optional value that provides a pattern (RegExp) or string in order to remove pairs which key matches the pattern
   *                                   If not provided this function will delete any key that starts with the configured prefix or all keys.
   * @param {SessionConfig} config  Optional config object to override if it has to use the prefix, true by default.
   * @example
    * storageService.clearAll(); //Remove all pairs which keys starts with configured prefix unless this prefix is undefined when will remove all pairs
   * storageService.clearAll('\[a-z]', { withPrefix: false }) //Remove all pairs which keys match the pattern (provided as string) and without considering a prefix for keys matching
   * storageService.clearAll(/[a-z]/, { withPrefix: false }) //Remove all pairs which keys match the pattern (provided as RegExp) and without considering a prefix for keys matching
   * storageService.clearAll(/[a-z]/) //Remove all pairs which keys match the pattern (provided as RegExp) and taking in account that keys to be removed must start with the configured prefix
   * @author Iván Peña Huguet
   */
    clearAll (
        pattern: string | RegExp = /(?:)/,
        config: SessionConfig = { withPrefix: true }
    ): void {
        const prefixPattern =
      config.withPrefix && this.prefix
          ? new RegExp(`^${this.prefix}`)
          : new RegExp(/(?:)/);
        const patternAux = pattern ? new RegExp(pattern) : new RegExp(/(?:)/);
        for (const key in window.sessionStorage) {
            if (prefixPattern.test(key) && patternAux.test(key)) {
                this.cache.delete(key);
                window.sessionStorage.removeItem(key);
                this.pendingWrites.delete(key);
                this.lastUsedSet.delete(key);
            }
        }
    }

}

downgradeToAJSService(
    'CommonsSessionStorageService',
    CommonsSessionStorageService,
    'ib-commons-utils-module'
);

/**
 * @description AngularJS compatibility bridge.
 * It decorates the legacy `localStorageService` token so any AngularJS consumer
 * receives `CommonsSessionStorageService` and both frameworks use the same storage API.
 * Note: the underlying persistence remains `sessionStorage`.
 */
getAJSModule('ib-commons-utils-module').config([
    '$provide',
    ($provide: any) => {
        try {
            $provide.decorator('localStorageService', [
                '$injector',
                ($injector: any) => {
                    const commonsSessionStorageService = $injector.get('CommonsSessionStorageService') as CommonsSessionStorageService;
                    return commonsSessionStorageService;
                }
            ]);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : '';
            const isMissingLocalStorageProvider = message.includes('localStorageServiceProvider');

            if (!isMissingLocalStorageProvider) {
                throw error;
            }
        }
    }
]);


