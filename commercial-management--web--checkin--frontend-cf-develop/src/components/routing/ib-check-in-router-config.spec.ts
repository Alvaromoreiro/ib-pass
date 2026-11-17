import * as angular from 'angular';

interface RouteProviderMock {
    when: jasmine.Spy;
    otherwise: jasmine.Spy;
}

interface TranslateProviderMock {
    useStaticFilesLoader: jasmine.Spy;
    useSanitizeValueStrategy: jasmine.Spy;
}

interface LocalStorageProviderMock {
    setPrefix: jasmine.Spy;
    setStorageType: jasmine.Spy;
}

interface HttpProviderMock {
    interceptors: string[];
    defaults: { withCredentials?: boolean };
}

type RouterConfigConstructor = new (...args: unknown[]) => unknown;

type ConfigFunction = { $inject?: string[] };

type ConfigBlockFixture = [unknown, unknown, [ConfigFunction, ...unknown[]]];

type RegisteredRoute = [string, ng.route.IRoute];

describe('ibRouterConfig', () => {
    let routeProvider: RouteProviderMock;
    let translateProvider: TranslateProviderMock;
    let localStorageServiceProvider: LocalStorageProviderMock;
    let httpProvider: HttpProviderMock;
    let compileProvider: { debugInfoEnabled: jasmine.Spy };
    let qProvider: { errorOnUnhandledRejections: jasmine.Spy };

    const routerConstants = {
        templatesRoute: '/templates/',
        viewIbcoseRoute: 'search.html',
        viewIbcose2Route: 'logged-search.html',
        viewIbcoacRoute: 'passengers.html',
        viewCkiancRoute: 'ancillaries.html',
        viewCkiancupp: 'upgrade.html',
        viewIbfnpaRoute: 'fly-now.html',
        viewIbfncopaRoute: 'confirmation.html',
        viewIbdesRoute: 'de-invoice.html',
        viewIbecbp: 'boarding-cards.html',
        viewIbbioboaRoute: 'biometric.html',
        QUADRIGAM: {
            SEARCH: '/ibcose',
            LOGGED_SEARCH: '/ibcose2',
            FLIGHTS_PASSENGERS: '/ibcoac',
            APIS_PASSENGERS: '/ibcoac2',
            SEAT_SUMMARY: '/ckiacpt',
            ANCILLARIES: '/ckianc',
            UPGRADE: '/ckiancupp',
            PAYMENTS: '/ibpurc',
            CKI_CONFIRMATION: '/ibcocf-and-ibeccf',
            FLY_NOW: '/ibfnpa',
            FLIGHT_CONFIRMATION: '/ibfncopa',
            UN_SEARCH: '/uncose',
            UN_RECOVERY: '/uncoac',
            LOADING: '/loading',
            BOARDING_CARDS: '/ibecbp',
            BIOMETRIC: '/ckbio'
        }
    };

    const getRouterConfigConstructor = (): RouterConfigConstructor => {
        const configBlocks = (angular.module('ib-check-in-app') as angular.IModule & { _configBlocks: ConfigBlockFixture[] })._configBlocks;
        const configBlock = configBlocks.find(([, , args]) => args[0]?.$inject?.includes('$routeProvider'));
        if (!configBlock) throw new Error('Router config block was not registered');
        return configBlock[2][0] as unknown as RouterConfigConstructor;
    };

    beforeEach(() => {
        routeProvider = {
            when: jasmine.createSpy('when'),
            otherwise: jasmine.createSpy('otherwise')
        };
        translateProvider = {
            useStaticFilesLoader: jasmine.createSpy('useStaticFilesLoader'),
            useSanitizeValueStrategy: jasmine.createSpy('useSanitizeValueStrategy')
        };
        localStorageServiceProvider = {
            setPrefix: jasmine.createSpy('setPrefix'),
            setStorageType: jasmine.createSpy('setStorageType')
        };
        httpProvider = { interceptors: [], defaults: {} };
        compileProvider = { debugInfoEnabled: jasmine.createSpy('debugInfoEnabled') };
        qProvider = { errorOnUnhandledRejections: jasmine.createSpy('errorOnUnhandledRejections') };

        const RouterConfig = getRouterConfigConstructor();
        new RouterConfig(
            { generalI18nRoute: '/i18n/general/', i18nRoute: '/i18n/app/' },
            routerConstants,
            routeProvider,
            translateProvider,
            localStorageServiceProvider,
            httpProvider,
            compileProvider,
            qProvider
        );
    });

    it('registers all routes with reloadOnSearch disabled and the search fallback', () => {
        const registeredRoutes = routeProvider.when.calls.allArgs() as unknown as RegisteredRoute[];
        expect(registeredRoutes.map(([path]) => path)).toEqual([
            '/ibcose', '/ibcose2', '/ibcoac', '/ibcoac2', '/ckiacpt',
            '/ckianc', '/ckiancupp', '/ibpurc', '/ibcocf-and-ibeccf',
            '/ibfnpa', '/ibfncopa', '/uncose', '/uncoac', '/loading',
            '/ibecbp', '/ckbio'
        ]);
        expect(registeredRoutes.every(([, config]) => config.reloadOnSearch === false)).toBe(true);
        expect(routeProvider.otherwise).toHaveBeenCalledWith({ redirectTo: '/ibcose' });
    });

    it('configures translation, storage, HTTP, and compiler providers', () => {
        expect(translateProvider.useStaticFilesLoader).toHaveBeenCalledWith({
            files: [
                { prefix: '/i18n/general/', suffix: '.json' },
                { prefix: '/i18n/app/', suffix: '.json' }
            ]
        });
        expect(translateProvider.useSanitizeValueStrategy).toHaveBeenCalledWith('escaped');
        expect(localStorageServiceProvider.setPrefix).toHaveBeenCalledWith('ib-check-in-app');
        expect(localStorageServiceProvider.setStorageType).toHaveBeenCalledWith('sessionStorage');
        expect(httpProvider.interceptors).toContain('CkiIbHttpInterceptor');
        expect(httpProvider.defaults.withCredentials).toBe(true);
        expect(qProvider.errorOnUnhandledRejections).toHaveBeenCalledWith(false);
        expect(compileProvider.debugInfoEnabled).toHaveBeenCalledWith(false);
    });

    it('redirects from boarding cards when the subscription mode is enabled', () => {
        const registeredRoutes = routeProvider.when.calls.allArgs() as unknown as RegisteredRoute[];
        const routeConfig = registeredRoutes.find(([path]) => path === '/ibecbp')?.[1] as unknown as {
            resolve: { guard: [string, string, (location: { path(path: string): unknown }, utils: { getBpSubscriptionMode(): boolean }) => boolean | undefined] };
        };
        const guard = routeConfig.resolve.guard;
        const location = { path: jasmine.createSpy('path') };

        expect(guard[2](location, { getBpSubscriptionMode: () => true })).toBeUndefined();
        expect(location.path).toHaveBeenCalledWith('/ibcocf-and-ibeccf');
        expect(guard[2]({ path: jasmine.createSpy('path') }, { getBpSubscriptionMode: () => false })).toBe(true);
    });
});