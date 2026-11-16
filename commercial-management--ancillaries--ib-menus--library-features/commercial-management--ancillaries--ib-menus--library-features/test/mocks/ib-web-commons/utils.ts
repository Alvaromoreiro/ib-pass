import { InjectionToken } from '@angular/core';
import angular from 'angular';

export interface SessionConfig {
    withPrefix?: boolean;
}

export interface IbStorageUtility {
    set(key: string, value: NonNullable<unknown>, config?: SessionConfig): void;
    remove(key: string, config?: SessionConfig): void;
    get<T = unknown>(key: string, config?: SessionConfig): T | null;
    clear(pattern?: string | RegExp, config?: SessionConfig): void;
}

export class CommonsSessionStorageService implements IbStorageUtility {
    public get<T = unknown>(_key: string, _config?: SessionConfig): T | null {
        throw new Error('CommonsSessionStorageService mock must be configured by the test');
    }

    public set (_key: string, _value: NonNullable<unknown>, _config?: SessionConfig): void {
        throw new Error('CommonsSessionStorageService mock must be configured by the test');
    }

    public remove (_key: string, _config?: SessionConfig): void {
        throw new Error('CommonsSessionStorageService mock must be configured by the test');
    }

    public clear (_pattern?: string | RegExp, _config?: SessionConfig): void {
        throw new Error('CommonsSessionStorageService mock must be configured by the test');
    }
}

export class AJSRootScope {
    public $broadcast (_event: string, ..._args: unknown[]): void {
        throw new Error('AJSRootScope mock must be configured by the test');
    }

    public $emit (_event: string, ..._args: unknown[]): void {
        throw new Error('AJSRootScope mock must be configured by the test');
    }

    public $on (_event: string, _listener: (...args: unknown[]) => void): void {
        throw new Error('AJSRootScope mock must be configured by the test');
    }
}

export interface CommonsRootScope {
    [key: string]: unknown;
    appMarket?: string;
    flowName?: string;
    routes?: {
        templates?: string;
    };
    $broadcast?: (event: string, ...args: unknown[]) => void;
    $emit?: (event: string, ...args: unknown[]) => void;
    $on?: (event: string, listener: (...args: unknown[]) => void) => void;
}

export class AJSCurrencyService {}

export const rootScopeProvider = {
    provide: AJSRootScope,
    useValue: {}
};

export const AJSCurrencyServiceProvider = {
    provide: AJSCurrencyService,
    useClass: AJSCurrencyService
};

function ensureAngularJsModule (moduleName: string): angular.IModule {
    try {
        return angular.module(moduleName);
    } catch {
        return angular.module(moduleName, []);
    }
}

export function downgradeToAJSComponent (
    _name: string,
    _options: unknown,
    _module: string
): void {
    ensureAngularJsModule(_module);
}

export function downgradeToAJSService (
    _name: string,
    _service: new (...args: never[]) => unknown,
    _module: string
): void {
    ensureAngularJsModule(_module).service(_name, _service);
}

export const CommonsRootScopeToken = new InjectionToken<CommonsRootScope>('CommonsRootScope');
