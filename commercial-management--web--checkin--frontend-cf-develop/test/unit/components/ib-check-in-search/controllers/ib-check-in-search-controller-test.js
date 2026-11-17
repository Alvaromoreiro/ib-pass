describe('CheckInSearchController test', () => {
    let $controller, $compile, $document;
    const fake = {
        DatalayerUtilsService: {
            updateDatalayerWithQuadrigam: jasmine.createSpy().and.callFake(angular.noop),
            sendDatalayerEvent: jasmine.createSpy().and.callFake(angular.noop),
            addDataLayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerViewEvent: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            resetDatalayer: jasmine.createSpy().and.callFake(angular.noop),
        },
        ModalService: {
            openGenericModal: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            }),
            finishWaiting: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            }),
            isWaiting: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            }),
            afterLogin: jasmine.createSpy().and.callFake(() => {
                return { result: { then: angular.noop } };
            })
        },
        CommonsUtilService: { setTitlePage: jasmine.createSpy() },
        CkiDatalayerConstants: require('test/constants/datalayer-cki-constants.json'),
        CheckInSearchModel : jasmine.createSpy('CheckInSearchModel').and.callFake(() => {
            return {
                loginParameters: '',
                containsAd: '',
            };
        }),
        CheckinSearchService: {
            initCheckin: jasmine.createSpy().and.callFake(angular.noop),
            getDinamicPricingCookieParameter: jasmine.createSpy('getDinamicPricingCookieParameter').and.callFake(angular.noop),
        },
        CheckinAppConstants: require('test/constants/ib-check-in-constants.json'),
        SearchFlightsPassengersService: {
            searchFlighsPassengersByLocatorAndSurname: jasmine
                .createSpy('fakeSearchFlightsPassengersService')
                .and.callFake(angular.noop),
        },
        ComponentUtils: {
            equalHeight: jasmine
                .createSpy()
                .and.callFake(angular.noop),
        },
        MonetateUtilsService: {
            updateMonetateWithQuadrigam: jasmine
                .createSpy()
                .and.callFake(angular.noop),
        },
        MonetateConstants: {
            MONETATE_INFO: {
                SETPAGETYPE: 'testPageType'
            }
        },
        RedirectionService: {
            newNavigation: jasmine.createSpy()
        },
        CkiDataLayerService: {
            setProcessAndStep: jasmine.createSpy().and.callFake(angular.noop)
        },
        localStorageService: {
            get: jasmine.createSpy('get'),
            set: jasmine.createSpy('set'),
        },
        IbSessionConfigService: {
            initStorage: jasmine.createSpy().and.callFake(angular.noop),
            isUserLogged: jasmine.createSpy('isUserLogged').and.returnValue(true),
            setPNR: jasmine.createSpy('setPNR')
        },
        IbUtilsService: {
            getTravelAgencies: jasmine.createSpy().and.callFake(angular.noop),
            getParameterByName: jasmine.createSpy().and.callFake(angular.noop),
            cleanSpaces: jasmine.createSpy().and.callFake(angular.noop),
            setTitlePage: jasmine.createSpy().and.callFake(angular.noop)
        },
        CheckinFlowService: {
            warnUserOnBackPressed: jasmine.createSpy('warnUserOnBackPressed')
        },
        LinksFilterFilter: {},
        Filter: jasmine.createSpy().and.callFake(function (filter){
            var filterFunc = function () {
                return [];
            };
            switch (filter) {
                case 'translate':
                    filterFunc = function (label) {
                        return label;
                    };
                    break;
                case 'literalFormatter':
                    filterFunc = function (label) {
                        return label;
                    };
                    break;
                default:
                    break;
            }
            return filterFunc;
        })
    };

    const controllerDependencies = {
        $scope: {},
        $rootScope: {},
        $timeout: {},
        $window: {},
        $filter: {},
        $location: {}
    };

    beforeEach(() => {
        angular.mock.module('ib-check-in-search', function ($provide) {
            $provide.value('ModalService', fake.ModalService);
            $provide.value('CkiDatalayerUtilsService',fake.DatalayerUtilsService);
            $provide.value('CkiDatalayerConstants', fake.CkiDatalayerConstants);
            //$provide.value('$timeout', fake.$timeout);
            $provide.value('CheckInSearchModel', fake.CheckInSearchModel);
            $provide.value('CheckinSearchService', fake.CheckinSearchService);
            $provide.value('CheckinAppConstants', fake.CheckinAppConstants);
            $provide.value('localStorageService', fake.localStorageService);
            $provide.value('SearchFlightsPassengersService',fake.SearchFlightsPassengersService);
            $provide.value('ComponentUtils', fake.ComponentUtils);
            $provide.value('MonetateUtilsService', fake.MonetateUtilsService);
            $provide.value('MonetateConstants', fake.MonetateConstants);
            $provide.value('RedirectionService', fake.RedirectionService);
            $provide.value('$filter', fake.Filter);
            $provide.value('CommonsUtilService', fake.CommonsUtilService);
            $provide.value('CkiDataLayerService', fake.CkiDataLayerService);
            $provide.value('LinksFilterFilter', fake.LinksFilterFilter);
            $provide.value('IbSessionConfigService', fake.IbSessionConfigService);
            $provide.value('IbUtilsService', fake.IbUtilsService);
            $provide.value('CheckinFlowService', fake.CheckinFlowService);
        });

        inject((_$controller_, _$rootScope_, _$window_, _$filter_, _$location_, _$timeout_, _$compile_, _$document_) => {
            controllerDependencies.$rootScope = _$rootScope_;
            controllerDependencies.$scope = controllerDependencies.$rootScope.$new();
            controllerDependencies.$filter = _$filter_;
            controllerDependencies.$window = _$window_;
            controllerDependencies.$location = _$location_;
            controllerDependencies.$timeout = _$timeout_;
            $controller = _$controller_('CheckInSearchController', controllerDependencies);
            controllerDependencies.$timeout.flush();


            /*$compile = _$compile_;
            $document = _$document_;
            const element = angular.element('<div ng-controller='CheckInSearchController'>' +
                                            '<a id='cki-search-more-cki-info-link' href='javascript:void(0)' data-ng-click='searchCtrl.moreInfoRedirection()'' +
                                            '</div>');
            $compile(element)(controllerDependencies.$scope);
            $document.find('body').append(element);*/
        });
    });

    describe('when activate', () => {
        it('CkiDatalayerUtilsService sendDatalayerEvent should be called', () => {
            expect(fake.DatalayerUtilsService.sendDatalayerEvent).toHaveBeenCalled();
        });
    });

    describe('when openGenericModal is called', () => {
        it('ModalService openGenericModal is called', () => {
            $controller.openGenericModal();
            expect(fake.ModalService.openGenericModal).toHaveBeenCalled();
        });
    });

    describe('when onError is called', () => {
        it('ModalService onError is called', () => {
            $controller.onError();
            expect(fake.ModalService.finishWaiting).toHaveBeenCalled();
        });
    });

    describe('when showWaitingModal is called', () => {
        it('ModalService showWaitingModal is called', () => {
            $controller.showWaitingModal();
            expect(fake.ModalService.isWaiting).toHaveBeenCalled();
        });
    });

    describe('when afterLogin is called', () => {
        it('ModalService afterLogin is called', () => {
            $controller.afterLogin();
            expect(fake.CheckinSearchService.initCheckin).toHaveBeenCalled();
        });
    });

    describe('when recived events is called', () => {
        it('event anonymousSubmit call initBooking function', () => {
            controllerDependencies.$scope.$emit('anonymousSubmit', { pnr: '', surname: '' });
            expect(fake.CheckinSearchService.initCheckin).toHaveBeenCalled();
        });
        it('event openGenericModal call anonymous function', () => {
            controllerDependencies.$scope.$emit('openGenericModal', { size: '', tpl: '', anim: '' });
            //expect(fake.CheckinSearchService.initCheckin).toHaveBeenCalled();
        });
        it('event bannerRenderedEvent call anonymous function', () => {
            controllerDependencies.$scope.$emit('bannerRenderedEvent', { containsAd: true });
            expect($controller.model.containsAd).toBeTruthy();
            expect($controller.model.showAds).toBeTruthy();
        });
        it('event initializeIsAddOnEvent call anonymous function', () => {
            controllerDependencies.$scope.$emit('initializeIsAddOnEvent');
            expect($controller.model.containsAd).toBe(false);
            expect($controller.model.showAds).toBe(false);
        });
        it('event loginContinueEvent call anonymous function', () => {
            controllerDependencies.$scope.$emit('loginContinueEvent');
            expect(fake.CheckinSearchService.initCheckin).toHaveBeenCalled();
        });
    });

    describe('when event click is called', () => {
        it('moreInfoRedirection is called', () => {
            /*spyOn($controller, 'moreInfoRedirection');
            const link = $document.find('a');
            link.triggerHandler('click');
            expect($controller.moreInfoRedirection).toHaveBeenCalled();*/
            $controller.moreInfoRedirection();
            expect(fake.RedirectionService.newNavigation).toHaveBeenCalled();
        });
        it('isValidateForm is called', () => {
            const event = { preventDefault: () => { } };
            $controller.formIberiaPlus = {
                $valid: false,
                $submitted: false
            };
            $controller.isValidateForm(event);
            //expect(event.preventDefault).toHaveBeenCalled();
        });
        it('submitForm is called', () => {
            $controller.formIberiaPlus = {
                $valid: true,
                $submitted: true
            };
            $controller.submitForm();
            expect(fake.ModalService.isWaiting).toHaveBeenCalled();
        });
    });
});
