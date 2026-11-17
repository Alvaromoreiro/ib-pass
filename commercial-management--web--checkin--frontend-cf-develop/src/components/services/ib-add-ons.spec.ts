import * as angular from 'angular';

interface AddOnServiceInstance {
    initAddOn(): void;
    displayAddOn(id: string): void;
    clearAddOns(): void;
}

describe('AddOnService', () => {
    let service: AddOnServiceInstance;
    let rootScope: ng.IRootScopeService;
    let googleTag: {
        cmd: Array<() => void>;
        defineSlot: jasmine.Spy;
        pubads: jasmine.Spy;
        enableServices: jasmine.Spy;
        display: jasmine.Spy;
    };
    let pubads: {
        setTargeting: jasmine.Spy;
        enableSingleRequest: jasmine.Spy;
        collapseEmptyDivs: jasmine.Spy;
        addEventListener: jasmine.Spy;
        refresh: jasmine.Spy;
        clear: jasmine.Spy;
    };

    beforeEach(() => {
        const addService = jasmine.createSpy('addService');
        pubads = {
            setTargeting: jasmine.createSpy('setTargeting'),
            enableSingleRequest: jasmine.createSpy('enableSingleRequest'),
            collapseEmptyDivs: jasmine.createSpy('collapseEmptyDivs'),
            addEventListener: jasmine.createSpy('addEventListener'),
            refresh: jasmine.createSpy('refresh'),
            clear: jasmine.createSpy('clear')
        };
        googleTag = {
            cmd: [],
            defineSlot: jasmine.createSpy('defineSlot').and.returnValue({ addService }),
            pubads: jasmine.createSpy('pubads').and.returnValue(pubads),
            enableServices: jasmine.createSpy('enableServices'),
            display: jasmine.createSpy('display')
        };

        angular.mock.module('ib-checkin-services-module', ($provide: ng.auto.IProvideService) => {
            $provide.value('CheckinAppConstants', { lang: 'es' });
            $provide.value('localStorageService', {});
            $provide.value('$window', { googletag: googleTag });
        });

        angular.mock.inject((_$rootScope_: ng.IRootScopeService, _AddOnService_: AddOnServiceInstance) => {
            rootScope = _$rootScope_;
            service = _AddOnService_;
            (rootScope as ng.IRootScopeService & {
                GOOGLE_ADS_URIS: Record<string, string>;
                BANNER_IDS: Record<string, string>;
            }).GOOGLE_ADS_URIS = {
                TYPE_0: '/type-0',
                TYPE_1: '/type-1',
                TYPE_2: '/type-2',
                TYPE_3: '/type-3'
            };
            (rootScope as ng.IRootScopeService & {
                BANNER_IDS: Record<string, string>;
            }).BANNER_IDS = {
                TYPE_0: 'banner-0',
                TYPE_1: 'banner-1',
                TYPE_2: 'banner-2',
                TYPE_3: 'banner-3'
            };
            spyOn(rootScope, '$broadcast');
        });
    });

    it('configures ad slots and broadcasts when the active banner is rendered', () => {
        service.initAddOn();
        googleTag.cmd[0]();

        expect(googleTag.defineSlot).toHaveBeenCalledWith('/type-0', [[728, 90]], 'banner-0');
        expect(googleTag.defineSlot).toHaveBeenCalledWith('/type-1', [[300, 250]], 'banner-1');
        expect(googleTag.defineSlot).toHaveBeenCalledWith('/type-2', [[300, 600]], 'banner-2');
        expect(googleTag.defineSlot).toHaveBeenCalledWith('/type-3', [[160, 600]], 'banner-3');
        expect(pubads.setTargeting).toHaveBeenCalledWith('ib-lang', '"es"');
        expect(pubads.enableSingleRequest).toHaveBeenCalled();
        expect(pubads.collapseEmptyDivs).toHaveBeenCalled();
        expect(googleTag.enableServices).toHaveBeenCalled();

        service.displayAddOn('banner-1');
        googleTag.cmd[1]();
        expect(pubads.refresh).toHaveBeenCalled();
        expect(googleTag.display).toHaveBeenCalledWith('banner-1');

        const onSlotRenderEnded = pubads.addEventListener.calls.mostRecent().args[1];
        onSlotRenderEnded({
            slot: { getSlotElementId: () => 'banner-1' },
            isEmpty: false
        });
        expect(rootScope.$broadcast).toHaveBeenCalledWith('bannerRenderedEvent', true);
    });

    it('clears ad slots', () => {
        service.clearAddOns();

        expect(pubads.clear).toHaveBeenCalled();
    });
});
