import angular from 'angular';

@Config('ib-MmB-routing-module')
class ibRouterConfig {
    private routes = [
        {
            path: this.MmBRouterConstants.PAGES_URL.SEARCH,
            config: {
                template: '<ib-mmb-search-component></ib-mmb-search-component>',
                reloadOnSearch: false
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.SEARCHNEW,
            config: {
                template: this.MmBRouterConstants.mmbSearchNewTemplate,
                reloadOnSearch: false
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.TRIP_LIST,
            config: {
                template: this.MmBRouterConstants.mmbTripListTemplate,
                reloadOnSearch: false
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.BOOKING_MANAGE,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.managementViewRoute,
                controller: 'BookingManagementController',
                controllerAs: 'manageCtrl',
                reloadOnSearch: false
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.CHANGE_FLIGHT,
            config: {
                template: '<ib-change-flight-component></ib-change-flight-component>',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-change-flight').then(() => {
                            $ocLazyLoad.load(angular.module('ib-MmB-change-flight-templates'));
                            $ocLazyLoad.load(angular.module('ib-Mmb-change-flight-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.FLIGHT_CONFIRMATION,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.flightConfirmationViewRoute,
                controller: 'FlightConfirmationController',
                controllerAs: 'confirmCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-flight-confirmation').then(() => {
                            $ocLazyLoad.load(angular.module('ib-MmB-flight-confirmation-templates'));
                            $ocLazyLoad.load(angular.module('ib-MmB-flight-confirmation-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.BOOKINGS_LIST,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.bookingsListViewRoute,
                controller: 'BookingsListController',
                controllerAs: 'bookingsCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-bookings-list').then(() => {
                            $ocLazyLoad.load(angular.module('ib-MmB-bookings-list-templates'));
                            $ocLazyLoad.load(angular.module('ib-MmB-bookings-list-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.PASSENGERS_INFO,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.passengersInfoView,
                controller: 'PassengersInfoController',
                controllerAs: 'passInfoCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-passengers-info').then(() => {
                            $ocLazyLoad.load(angular.module('ib-MmB-passengers-info-templates'));
                            $ocLazyLoad.load(angular.module('ib-MmB-passengers-info-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.PAYMENTS,
            config: {
                template: this.MmBRouterConstants.mmbPaymentTemplate,
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-web-payments').then(() => {
                            $ocLazyLoad.load(angular.module('ib-web-payments-templates'));
                            $ocLazyLoad.load(angular.module('ib-pmt-app'));
                            $ocLazyLoad.load(angular.module('ib-pmt-order-confirmation-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-communication-lost-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-mmb-confirmation-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-injectable-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.MMB_PAYMENTS_CONFIRM,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.paymentsConfirmMmbRoute,
                controller: 'ConfirmationMMbController',
                controllerAs: 'paymentConfirmationCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-web-payments').then(() => {
                            $ocLazyLoad.load(angular.module('ib-web-payments-templates'));
                            $ocLazyLoad.load(angular.module('ib-pmt-app'));
                            $ocLazyLoad.load(angular.module('ib-pmt-order-confirmation-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-communication-lost-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-mmb-confirmation-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-injectable-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.NEW_MMB_PAYMENTS_CONFIRM,
            config: {
                template: this.MmBRouterConstants.mmbConfirmationTemplate,
                reloadOnSearch: false,
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.MMB_CONFIRMATION_ORDER,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.confirmationMmbOrderViewRoute,
                controller: 'PmtConfirmationController',
                controllerAs: 'pmtConfOrderCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-web-payments').then(() => {
                            $ocLazyLoad.load(angular.module('ib-web-payments-templates'));
                            $ocLazyLoad.load(angular.module('ib-pmt-app'));
                            $ocLazyLoad.load(angular.module('ib-pmt-order-confirmation-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-communication-lost-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-mmb-confirmation-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-injectable-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.MMB_COMMUNICATION_LOST,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.mmbCommunicationLostViewRoute,
                controller: 'PmtCommunicationLostController',
                controllerAs: 'pmtComLostCtr',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-web-payments').then(() => {
                            $ocLazyLoad.load(angular.module('ib-web-payments-templates'));
                            $ocLazyLoad.load(angular.module('ib-pmt-app'));
                            $ocLazyLoad.load(angular.module('ib-pmt-order-confirmation-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-communication-lost-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-mmb-confirmation-module'));
                            $ocLazyLoad.load(angular.module('ib-pmt-injectable-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.MMB_DASHBOARD,
            config: {
                template: '<ib-Mmb-booking-dashboard-component></ib-Mmb-booking-dashboard-component>',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-dashboard').then(() => {
                            $ocLazyLoad.load(angular.module('ib-web-dashboard-templates'));
                            $ocLazyLoad.load(angular.module('ib-health-form-module'));
                            $ocLazyLoad.load(angular.module('ib-web-ancillaries-module'));
                            $ocLazyLoad.load(angular.module('ib-MmB-booking-dashboard-module'));
                            $ocLazyLoad.load(angular.module('ib-disruption-main-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.MMB_INVOLUNTARY_CHANGE,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.mmbInvoluntaryChangeViewRoute,
                controller: 'MmBInvoluntaryChangeController',
                controllerAs: 'mmBInvoluntaryChangeCtrl',
                reloadOnSearch: false
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.DISRUPTION_DASHBOARD,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.disruptionDashboardRoute,
                controller: 'DisruptionDashboardController',
                controllerAs: 'disruptionCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-dashboard').then(() => {
                            $ocLazyLoad.load(angular.module('ib-web-dashboard-templates'));
                            $ocLazyLoad.load(angular.module('ib-web-ancillaries-module'));
                            $ocLazyLoad.load(angular.module('ib-MmB-booking-dashboard-module'));
                            $ocLazyLoad.load(angular.module('ib-disruption-main-module'));
                            $ocLazyLoad.load(angular.module('ib-disruption-refund-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.DISRUPTION_REFUND,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.disruptionRefundRoute,
                controller: 'DisruptionRefundController',
                controllerAs: 'disrefundCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-dashboard').then(() => {
                            $ocLazyLoad.load(angular.module('ib-web-dashboard-templates'));
                            $ocLazyLoad.load(angular.module('ib-web-ancillaries-module'));
                            $ocLazyLoad.load(angular.module('ib-MmB-booking-dashboard-module'));
                            $ocLazyLoad.load(angular.module('ib-disruption-main-module'));
                            $ocLazyLoad.load(angular.module('ib-disruption-refund-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.REBOOK_ERROR,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.rebookErrorViewRoute,
                controller: 'MmbRebookErrorController',
                controllerAs: 'mmbRebookErroryCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-rebook-error').then(() => {
                            $ocLazyLoad.load(angular.module('ib-MmB-rebook-error-module'));
                        });
                    }]
                }
            }
        },
        {
            path: this.MmBRouterConstants.PAGES_URL.ANCILLARIES,
            config: {
                templateUrl: this.MmBRouterConstants.templatesRoute + this.MmBRouterConstants.ancillariesRoute,
                controller: 'AncillariesController',
                controllerAs: 'ancillariesCtrl',
                reloadOnSearch: false,
                resolve: {
                    load: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return import('@src/lazy-loading/ib-MmB-ancillaries-page').then(() => {
                            $ocLazyLoad.load(angular.module('ib-web-ancillaries-page-templates'));
                            $ocLazyLoad.load(angular.module('ib-web-ancillaries-module'));
                            $ocLazyLoad.load(angular.module('ib-MmB-ancillaries-page-module'));
                        });
                    }]
                }
            }
        },
        {
            path: '/loading',
            config: {
                template: '<ib-loading-redirection></ib-loading-redirection>',
                reloadOnSearch: false,
            }
        },
    ];

    constructor (
        private $routeProvider,
        private MmBRouterConstants
    ) {}

    active = (): void => {
        this.routes.forEach(route => {
            this.$routeProvider.when(route.path, route.config);
        });

        this.$routeProvider.otherwise({ redirectTo: this.MmBRouterConstants.PAGES_URL.SEARCH });
    };

    $onInit = this.active();
};
ibRouterConfig.$inject = ['$routeProvider', 'MmBRouterConstants'];
