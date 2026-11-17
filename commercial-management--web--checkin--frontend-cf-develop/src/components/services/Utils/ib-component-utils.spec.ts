import * as angular from 'angular';

interface ComponentUtilsInstance {
    initAddOn(): void;
    get_parents(element: { 0: Node }, predicate: (node: Node) => boolean): Node | undefined;
}

describe('ComponentUtils', () => {
    let componentUtils: ComponentUtilsInstance;
    let windowMock: { innerWidth: number };
    let addOnService: { displayAddOn: jasmine.Spy };

    beforeEach(() => {
        windowMock = { innerWidth: 0 };
        addOnService = { displayAddOn: jasmine.createSpy('displayAddOn') };

        angular.mock.module('ib-checkin-services-module', ($provide: ng.auto.IProvideService) => {
            $provide.value('$window', windowMock);
            $provide.value('AddOnService', addOnService);
        });

        angular.mock.inject((
            _$rootScope_: ng.IRootScopeService,
            _ComponentUtils_: ComponentUtilsInstance
        ) => {
            (_$rootScope_ as ng.IRootScopeService & { BANNER_IDS: Record<string, string> }).BANNER_IDS = {
                TYPE_0: 'banner-0',
                TYPE_1: 'banner-1',
                TYPE_2: 'banner-2',
                TYPE_3: 'banner-3'
            };
            componentUtils = _ComponentUtils_;
        });
    });

    it('selects the banner for each viewport width', () => {
        const viewportCases = [
            { width: 767, banner: 'banner-1' },
            { width: 768, banner: 'banner-0' },
            { width: 1023, banner: 'banner-0' },
            { width: 1024, banner: 'banner-3' },
            { width: 1279, banner: 'banner-3' },
            { width: 1280, banner: 'banner-2' }
        ];

        viewportCases.forEach(({ width, banner }) => {
            windowMock.innerWidth = width;
            componentUtils.initAddOn();
            expect(addOnService.displayAddOn).toHaveBeenCalledWith(banner);
        });

        expect(addOnService.displayAddOn).toHaveBeenCalledTimes(viewportCases.length);
    });

    it('finds the first ancestor matching the predicate', () => {
        const parent = document.createElement('div');
        const child = document.createElement('span');
        parent.appendChild(child);

        const result = componentUtils.get_parents(
            { 0: child },
            (node) => node === parent
        );

        expect(result).toBe(parent);
    });
});
