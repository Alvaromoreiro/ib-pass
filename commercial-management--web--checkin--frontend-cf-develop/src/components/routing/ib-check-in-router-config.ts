import * as angular from 'angular';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

interface IRouteDefinition {
    path: string
    config: ng.route.IRoute
}

@Config('ib-check-in-app')
class ibRouterConfig {
    constructor (
        private CheckinAppConstants: CheckinAppConstants,
        private CheckinRouterConstants: CheckinRouterConstants,
        private $routeProvider: ng.route.IRouteProvider,
        private $translateProvider: ng.translate.ITranslateProvider,
        private localStorageServiceProvider: ng.local.storage.ILocalStorageServiceProvider,
        private $httpProvider: ng.IHttpProvider,
        private $compileProvider: ng.ICompileProvider,
        private $qProvider: ng.IQProvider
    ) { }

    private route = (path: string, config: ng.route.IRoute) => {
        this.$routeProvider.when(path, { reloadOnSearch: false, ...config });
    };

    // Lazy load helper
    private importAndLoad (importFn: () => Promise<unknown>, modules: string[]) {
        return [
            '$ocLazyLoad',
            ($ocLazyLoad: any) =>
                importFn().then(() => {
                    modules.forEach(m => $ocLazyLoad.load(angular.module(m)));
                })
        ];
    }

    private lazyLoadSequence (
        ...steps: Array<{
            importFn: () => Promise<unknown>;
            modules: string[];
        }>
    ) {
        return [
            '$ocLazyLoad',
            async ($ocLazyLoad: any) => {
                for (const step of steps) {
                    await step.importFn();

                    step.modules.forEach(module =>
                        $ocLazyLoad.load(angular.module(module))
                    );
                }
            }
        ];
    }

    private readonly PAYMENT_MODULES = [
        'ib-web-payments-templates',
        'ib-pmt-app',
        'ib-pmt-order-confirmation-module',
        'ib-check-in-confirmation-module',
        'ib-breakdown-module'
    ];

    private readonly ANCILLARY_MODULES = [
        'ib-web-ancillaries-templates',
        'ib-web-ancillaries-module',
        'ib-checkin-ancillaries-module'
    ];

    private registerRoutes (routes: IRouteDefinition[]): void {
        routes.forEach(route => {
            this.route(route.path, route.config);
        });
    }

    private getSearchConfig (): ng.route.IRoute {
        const { templatesRoute, viewIbcoseRoute } = this.CheckinRouterConstants;

        return {
            templateUrl: templatesRoute + viewIbcoseRoute,
            controller: 'CheckInSearchController',
            controllerAs: 'searchCtrl',
            resolve: {
                load: this.importAndLoad(() => import('@src/lazy-loading/ib-web-ancillaries'), [
                    'ib-web-ancillaries-templates',
                    'ib-web-ancillaries-module'
                ])
            }
        };
    }

    active = (): void => {
        this.setRoutes();
        //
        //Initialize the translation filter provider
        this.$translateProvider.useStaticFilesLoader({
            files: [
                { prefix: this.CheckinAppConstants.generalI18nRoute, suffix: '.json' },
                { prefix: this.CheckinAppConstants.i18nRoute, suffix: '.json' }
            ]
        });
        this.$translateProvider.useSanitizeValueStrategy('escaped');

        this.$httpProvider.interceptors.push('CkiIbHttpInterceptor');
        this.$httpProvider.defaults.withCredentials = true;
        //Initialize the local storage provider
        this.localStorageServiceProvider.setPrefix('ib-check-in-app');
        this.localStorageServiceProvider.setStorageType('sessionStorage');
        this.$qProvider.errorOnUnhandledRejections(false);
        this.$compileProvider.debugInfoEnabled(false);
    };

    getSearchRoutes = (): IRouteDefinition[] => {
        const { QUADRIGAM, templatesRoute, viewIbcoseRoute, viewIbcose2Route } = this.CheckinRouterConstants;
        const { SEARCH, LOGGED_SEARCH } = QUADRIGAM;

        return [
            {
                path: SEARCH,
                config: this.getSearchConfig()
            },
            {
                path: LOGGED_SEARCH,
                config: {
                    templateUrl: templatesRoute + viewIbcose2Route,
                    controller: 'CheckInIbPlusController',
                    controllerAs: 'checkIbPlusCtrl'
                }
            }
        ];
    };

    getPassengerRoutes = (): IRouteDefinition[] => {
        const { QUADRIGAM, templatesRoute, viewIbcoacRoute } = this.CheckinRouterConstants;
        const { FLIGHTS_PASSENGERS, APIS_PASSENGERS, SEAT_SUMMARY } = QUADRIGAM;

        return [
            {
                path: FLIGHTS_PASSENGERS,
                config: {
                    templateUrl: templatesRoute + viewIbcoacRoute,
                    controller: 'FlightsPassengersController',
                    controllerAs: 'flightsPasCtrl',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-web-ancillaries'), [...this.ANCILLARY_MODULES])
                    }
                }
            },
            {
                path: APIS_PASSENGERS,
                config: {
                    template: '<ib-checkin-apis></ib-checkin-apis>',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-checkin-apis'), ['ib-check-in-apis-module'])
                    }
                }
            },
            {
                path: SEAT_SUMMARY,
                config: {
                    template: '<ib-checkin-seat-summary />',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-checkin-seat-summary'), ['ib-checkin-seat-summary-page-module'])
                    }
                }
            }
        ];
    };

    getAncillariesRoutes = (): IRouteDefinition[] => {
        const { QUADRIGAM, templatesRoute, viewCkiancRoute, viewCkiancupp } = this.CheckinRouterConstants;
        const { ANCILLARIES, UPGRADE } = QUADRIGAM;

        return [
            {
                path: ANCILLARIES,
                config: {
                    templateUrl: templatesRoute + viewCkiancRoute,
                    controller: 'AncillariesController',
                    controllerAs: 'ancillariesCtrl',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-web-libraries'), [
                            ...this.ANCILLARY_MODULES,
                            'ib-monetate-checkin-module',
                            ...this.PAYMENT_MODULES
                        ])
                    }
                }
            },
            {
                path: UPGRADE,
                config: {
                    templateUrl: templatesRoute + viewCkiancupp,
                    controller: 'UpgradeController',
                    controllerAs: 'upgradeCtrl',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-checkin-upgrade'), ['ib-check-in-upgrade-module'])
                    }
                }
            }
        ];
    };

    getPaymentsRoutes = (): IRouteDefinition[] => {
        const { QUADRIGAM } = this.CheckinRouterConstants;
        const { PAYMENTS, CKI_CONFIRMATION } = QUADRIGAM;

        return [
            {
                path: PAYMENTS,
                config: {
                    template: '<ib-checkin-payments />',
                    resolve: {
                        translateReady: ['$translate', function ($translate: ng.translate.ITranslateService) {
                            return $translate.onReady();
                        }],
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-web-payments'), [
                            'ib-checkin-payments-page-module',
                            ...this.PAYMENT_MODULES
                        ])
                    }
                }
            },
            {
                path: CKI_CONFIRMATION,
                config: {
                    template: '<ib-check-in-confirmation></ib-check-in-confirmation>',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-web-payments'), [
                            ...this.PAYMENT_MODULES
                        ])
                    }
                }
            }
        ];
    };

    getBoardingCardsRoutes = (): IRouteDefinition[] => {
        const { QUADRIGAM, templatesRoute, viewIbecbp, viewIbbioboaRoute } = this.CheckinRouterConstants;
        const { BOARDING_CARDS, BIOMETRIC } = QUADRIGAM;

        return [
            {
                path: BOARDING_CARDS,
                config: {
                    templateUrl: templatesRoute + viewIbecbp,
                    controller: 'BoardingCardsController',
                    controllerAs: 'boardingCardsCtrl',
                    resolve: {
                        guard: ['$location', 'IbUtilsService', function ($location: ng.ILocationService, IbUtilsService: IbUtilsService) {
                            if (IbUtilsService.getBpSubscriptionMode()) {
                                $location.path('/ibcocf-and-ibeccf');
                                return;
                            }

                            return true;
                        }],
                        load: this.lazyLoadSequence(
                            { importFn: () => import('@src/lazy-loading/ib-web-payments'), modules: ['ib-pmt-app', 'ib-pmt-utils-module'] },
                            { importFn: () => import('@src/lazy-loading/ib-checkin-boarding-cards'), modules: ['ib-boarding-cards-module', 'ib-checkin-biometric-boarding-module'] }
                        )
                    }
                }
            },
            {
                path: BIOMETRIC,
                config: {
                    templateUrl: templatesRoute + viewIbbioboaRoute,
                    controller: 'CheckinBiometricBoardingController',
                    controllerAs: 'bioBoardingCtrl',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-checkin-biometric'), ['ib-checkin-biometric-boarding-module'])
                    }
                }
            }
        ];
    };

    getFlyNowRoutes = (): IRouteDefinition[] => {
        const { QUADRIGAM, templatesRoute, viewIbfnpaRoute, viewIbfncopaRoute } = this.CheckinRouterConstants;
        const { FLY_NOW, FLIGHT_CONFIRMATION } = QUADRIGAM;

        return [
            {
                path: FLY_NOW,
                config: {
                    templateUrl: templatesRoute + viewIbfnpaRoute,
                    controller: 'FlightNowController',
                    controllerAs: 'fnPaCtrl',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-checkin-confirmation-pa'), ['ib-fly-now-confirmation-module'])
                    }
                }
            },
            {
                path: FLIGHT_CONFIRMATION,
                config: {
                    templateUrl: templatesRoute + viewIbfncopaRoute,
                    controller: 'FlyNowConfirmationPAController',
                    controllerAs: 'fnCoPaCtrl',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-checkin-confirmation-pa'), ['ib-fly-now-confirmation-module'])
                    }
                }
            }
        ];
    };

    getDeInvoiceRoutes = (): IRouteDefinition[] => {
        const { QUADRIGAM, templatesRoute, viewIbcoseRoute, viewIbdesRoute } = this.CheckinRouterConstants;
        const { UN_SEARCH, UN_RECOVERY } = QUADRIGAM;

        return [
            {
                path: UN_SEARCH,
                config: this.getSearchConfig()
            },
            {
                path: UN_RECOVERY,
                config: {
                    templateUrl: templatesRoute + viewIbdesRoute,
                    controller: 'FlightsPassengerDesController',
                    controllerAs: 'flightsPasDesCtrl',
                    resolve: {
                        load: this.importAndLoad(() => import('@src/lazy-loading/ib-checkin-des-invoice'), ['ib-checkin-flights-des-invoice-module'])
                    }
                }
            }
        ];
    };

    getUtilityRoutes = (): IRouteDefinition[] => {
        const { LOADING } = this.CheckinRouterConstants.QUADRIGAM;

        return [
            {
                path: LOADING,
                config: {
                    template: '<ib-loading-redirection></ib-loading-redirection>'
                }
            }
        ];
    };

    setRoutes = () => {
        const { SEARCH } = this.CheckinRouterConstants.QUADRIGAM;

        const routes = [
            ...this.getSearchRoutes(),
            ...this.getPassengerRoutes(),
            ...this.getAncillariesRoutes(),
            ...this.getPaymentsRoutes(),
            ...this.getFlyNowRoutes(),
            ...this.getDeInvoiceRoutes(),
            ...this.getUtilityRoutes(),
            ...this.getBoardingCardsRoutes()
        ];

        this.registerRoutes(routes);

        this.$routeProvider.otherwise({ redirectTo: SEARCH });
    };

    $onInit = this.active();
}
ibRouterConfig.$inject = [
    'CheckinAppConstants',
    'CheckinRouterConstants',
    '$routeProvider',
    '$translateProvider',
    'localStorageServiceProvider',
    '$httpProvider',
    '$compileProvider',
    '$qProvider'
];
