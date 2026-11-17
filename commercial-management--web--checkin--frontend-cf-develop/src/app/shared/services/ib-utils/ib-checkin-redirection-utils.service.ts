import { downgradeToAJSService, RedirectionService, AJSRootScope, CommonsRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import * as angular from 'angular';


export const angularjsLocation = new InjectionToken('$location');

function angularjsLocationFactory (i: { get: (a: string) => unknown }) {
    return i.get('$location');
}

export const AJSLocationProvider = {
    provide: angularjsLocation,
    useFactory: angularjsLocationFactory,
    deps: ['$injector']
};

export const angularjsRoute = new InjectionToken('$route');

function angularjsRouteFactory (i: { get: (a: string) => unknown }) {
    return i.get('$route');
}

export const AJSRouteProvider = {
    provide: angularjsRoute,
    useFactory: angularjsRouteFactory,
    deps: ['$injector']
};

@Injectable({
    providedIn: 'root'
})
export class IbCheckinRedirectionUtilsService extends RedirectionService {


    constructor (
        @Inject( angularjsLocation ) private angularjsLocation: angular.ILocationService,
        @Inject( angularjsRoute ) private angularjsRoute: angular.route.IRouteService,
        @Inject( AJSRootScope ) rootScope: CommonsRootScope,
        sessionStorageService: CommonsSessionStorageService
    ) {
        super(rootScope, sessionStorageService);
    }

    /**
     * Returns current path of angularJS location
     */
    path (): string;
    /**
     * Changes the path of angularJS location
     */
    path (url: string): angular.ILocationService;
    path (url?: string): string | angular.ILocationService {
        return typeof url === 'undefined' ? this.angularjsLocation.path() : this.angularjsLocation.path(url);
    }

    /**
     * Returns current search params of angularJS location
     */
    search (): Record<string, string>;
    /**
     * Changes the search params of angularJS location
     */
    search (searchParams: Record<string, string>): angular.ILocationService;
    search (searchParams?: Record<string, string>): Record<string, string> | angular.ILocationService {
        return this.angularjsLocation.search(searchParams);
    }

    /**
     * Returns current hash of angularJS location
     */
    hash (): string;
    /**
     * Changes the hash of angularJS location
     */
    hash (url: string): angular.ILocationService;
    hash (url?: string): string | angular.ILocationService {
        return typeof url === 'undefined' ? this.angularjsLocation.hash() : this.angularjsLocation.hash(url);
    }
    /*
        Causes $route service to reload the current route even if $location hasn't changed.
        As a result of that, ngView creates new scope and reinstantiates the controller.
     */
    reload (): void {
        this.angularjsRoute.reload();
    }
}

downgradeToAJSService('IbCheckinRedirectionUtilsService', IbCheckinRedirectionUtilsService, 'ib-checkin-services-module');
