import * as angular from 'angular';
import {
    CommonsRootScope,
    CommonsSessionStorageService
} from 'ib-web-commons/utils';

import { IbCheckinRedirectionUtilsService } from './ib-checkin-redirection-utils.service';

interface LocationMethods {
    path: (url?: string) => unknown;
    search: (params?: Record<string, string>) => unknown;
    hash: (url?: string) => unknown;
}

interface RouteMethods {
    reload: () => void;
}

describe('IbCheckinRedirectionUtilsService', () => {
    let service: IbCheckinRedirectionUtilsService;
    let locationService: jasmine.SpyObj<LocationMethods>;
    let routeService: jasmine.SpyObj<RouteMethods>;
    let rootScope: CommonsRootScope;
    let sessionStorageService: CommonsSessionStorageService;

    const expectLocationUpdate = (
        updateLocation: () => angular.ILocationService,
        locationMethod: jasmine.Spy,
        expectedValue: string
    ): void => {
        locationMethod.and.returnValue(locationService);

        const result = updateLocation();

        expect(locationMethod).toHaveBeenCalledWith(expectedValue);
        expect(result).toBe(
            locationService as unknown as angular.ILocationService
        );
    };

    beforeEach(() => {
        locationService = jasmine.createSpyObj<LocationMethods>(
            'LocationService',
            ['path', 'search', 'hash']
        );
        routeService = jasmine.createSpyObj<RouteMethods>(
            'RouteService',
            ['reload']
        );
        rootScope = {} as CommonsRootScope;
        sessionStorageService = {} as CommonsSessionStorageService;

        service = new IbCheckinRedirectionUtilsService(
            locationService as unknown as angular.ILocationService,
            routeService as unknown as angular.route.IRouteService,
            rootScope,
            sessionStorageService
        );
    });

    describe('path', () => {
        it('should return the current AngularJS path', () => {
            locationService.path.and.returnValue('/check-in/passengers');

            const result = service.path();

            expect(locationService.path).toHaveBeenCalledWith();
            expect(result).toBe('/check-in/passengers');
        });

        it('should update the AngularJS path', () => {
            expectLocationUpdate(
                () => service.path('/check-in/summary'),
                locationService.path,
                '/check-in/summary'
            );
        });
    });

    describe('search', () => {
        it('should return the current AngularJS search parameters', () => {
            const searchParams = {
                bookingCode: 'ABC123',
                surname: 'DOE'
            };

            locationService.search.and.returnValue(searchParams);

            const result = service.search();

            expect(locationService.search).toHaveBeenCalledWith(undefined);
            expect(result).toEqual(searchParams);
        });

        it('should update the AngularJS search parameters', () => {
            const searchParams = {
                bookingCode: 'ABC123'
            };

            locationService.search.and.returnValue(locationService);

            const result = service.search(searchParams);

            expect(locationService.search).toHaveBeenCalledWith(searchParams);
            expect(result).toBe(
                locationService as unknown as angular.ILocationService
            );
        });
    });

    describe('hash', () => {
        it('should return the current AngularJS hash', () => {
            locationService.hash.and.returnValue('payment');

            const result = service.hash();

            expect(locationService.hash).toHaveBeenCalledWith();
            expect(result).toBe('payment');
        });

        it('should update the AngularJS hash', () => {
            expectLocationUpdate(
                () => service.hash('confirmation'),
                locationService.hash,
                'confirmation'
            );
        });
    });

    describe('reload', () => {
        it('should reload the current AngularJS route', () => {
            service.reload();

            expect(routeService.reload).toHaveBeenCalledTimes(1);
        });
    });
});
