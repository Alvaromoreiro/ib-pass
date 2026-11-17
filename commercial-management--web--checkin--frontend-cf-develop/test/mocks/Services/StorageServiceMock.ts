import { IbStorageUtility, SessionConfig, downgradeToAJSComponent } from 'ib-web-commons/utils';
export class StorageServiceMock implements IbStorageUtility {
    private storage = new Map <string, string>();
    private prefix = '';
    constructor (){}
    public set = (key: string, value: NonNullable<unknown>, config: SessionConfig = { withPrefix: true } ) => {
        const keyToSave = config.withPrefix && this.prefix !== '' ? `${this.prefix}.${key}` : key;
        this.storage.set(keyToSave, JSON.stringify(value));
    };
    public remove = (key: string, config: SessionConfig = { withPrefix: true } ) => {
        const keyToRemove = config.withPrefix && this.prefix !== '' ? `${this.prefix}.${key}` : key;
        this.storage.delete(keyToRemove);
    };
    public get = <T= unknown> (key: string, config: SessionConfig = { withPrefix: true } ) : T | null => {
        const keyToget = config.withPrefix && this.prefix !== '' ? `${this.prefix}.${key}` : key;
        try {
            return JSON.parse(this.storage.get(keyToget)) ?? null;
        } catch (Exception) {
            return null;
        }
    };
    public clear(pattern: string | RegExp = /(?:)/, config: SessionConfig = { withPrefix: true }): void {
        if (pattern) {
            const prefixPattern = (config.withPrefix && this.prefix) ? new RegExp(`^${this.prefix}`) : new RegExp(/(?:)/);
            const patternAux = pattern ? new RegExp(pattern) : new RegExp(/(?:)/);
            for (const pair of this.storage) {
                if (prefixPattern.test(pair[0]) && patternAux.test(pair[0])) {
                    this.storage.delete(pair[0]);
                }
            }
        } else {
            this.storage.clear();
        }
    }
    /**
     * @deprecated
     */
    public clearAll = this.clear;
    /**
     * @deprecated
     */
    public getObject = this.get;
    /**
     * @deprecated
     */
    public setObject = this.set;
    public isSupported = () => true;
    public setPrefix = (prefix: string) => { this.prefix = prefix; };
    public getPrefix = () => this.prefix;

}

export class FakeStorage {
    _storage = {};
    set = (k,v) => { this._storage[k]=v;};
    remove = (k) => {delete this._storage[k];};
    get = (k) => {return this._storage[k];};
    clearAll = ()=> { this._storage = {};};
}
