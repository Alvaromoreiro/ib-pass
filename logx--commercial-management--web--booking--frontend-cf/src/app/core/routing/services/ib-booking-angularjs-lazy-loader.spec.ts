import { IbBookingLazyLoaderAJSsingleton } from '@core/routing/services/ib-booking-angularjs-lazy-loader';
import angular from 'angular';

describe('IbBookingLazyLoaderAJS', () => {
    let mockLoader: any;

    beforeEach(() => {
        mockLoader = {
            load: jasmine.createSpy('load')
        };
        IbBookingLazyLoaderAJSsingleton.$ocLazyLoad = mockLoader;
        mockLoader.load.calls.reset();
    });

    it('should set the loader using $ocLazyLoad', () => {
        expect(IbBookingLazyLoaderAJSsingleton['loader']).toBe(mockLoader);
    });

    it('should call loader.load with the correct modules', () => {
        const moduleNames = ['module1', 'module2'];
        spyOn(angular, 'module').and.callFake((name: string) => name as any);

        IbBookingLazyLoaderAJSsingleton.load(moduleNames);

        expect(mockLoader.load).toHaveBeenCalledWith(['module1', 'module2']);
    });


    it('should not throw an error if loader is not set', () => {
        IbBookingLazyLoaderAJSsingleton.$ocLazyLoad = null;

        expect(() => IbBookingLazyLoaderAJSsingleton.load(['module1'])).not.toThrow();
    });
});