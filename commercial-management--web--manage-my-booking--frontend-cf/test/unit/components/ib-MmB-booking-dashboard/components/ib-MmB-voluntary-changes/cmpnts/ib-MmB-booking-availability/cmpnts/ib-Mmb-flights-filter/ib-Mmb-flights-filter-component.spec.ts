describe('FlightsDetailsController test', () =>  {
    let $q, $controller, controller, compile;
    var mockResponse = { data: 'promesa' };
    var fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(angular.noop),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
        showGenericModal: jasmine.createSpy(),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(modalFake)
    };

    var fakeCurrencyService = {
        getCurrencyObject: jasmine.createSpy(),
        formatPrice: jasmine.createSpy()
    };
    var fakeListFlightFilterVC = [
        { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_TIME_TITLE', filterName: 'departureDateTime' },
        { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_DURATION_TITLE', filterName: 'duration' },
        { isOpenModal: false, configModal: {}, name: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_CABINS_PRICE', title: 'MMB_VC_AVAILABILITY_MOBILE_FILTER_CABINS_PRICE_TITLE', filterName: 'slicePrice' }
    ];
    var fakeConfigModal = {
        model: {
            idModal: 'modalFilterVoluntaryChanges',
            changes: false,
            company: false,
            fare: [],
            fareSelected: {},
            indexFormApis: '',
            rangeHoursArrival: {
                active: false
            },
            rangeHoursDeparture: {
                active: false
            },
            rangePrice: {
                active: false
            },
            scale: []
        },
        template: '',
        class: ''
    };
    var fakeCurrency = {
        "suffixSymbol": true,
        "decimalSeparator": ",",
        "numberDecimals": 2,
        "groupingSeparator": ".",
        "currencySymbol": "€",
        "description": "Euro"
    };
    var fakeFilterData = {
        changes: false,
        company: false,
        fare: [],
        fareSelected: {},
        indexFormApis: '',
        rangeHoursArrival: {
            active: false
        },
        rangeHoursDeparture: {
            active: false
        },
        rangePrice: {
            active: false
        },
        scale: []
    };
    var fakeData = {
        changes: false,
        company: false,
        fare: [{

        }],
        fareSelected: {
            name: ''
        },
        indexFormApis: '',
        rangeHoursArrival: {
            min: 1,
            max: 8,
            active: false
        },
        rangeHoursDeparture: {
            min: 1,
            max: 8,
            active: false
        },
        rangePrice: {
            min: 1,
            max: 8,
            active: false
        },
        scale: [{
            numScale: 1,
            checked: true
        }]
    };
    var fakeTypeFlight = {};
    var fakeFilterDataModal = {
        typeFlight: '',
        filter: '',
        model: ''
    };
    var fakeModalModel = {
        'fareSelected': {},
        'scale': [
            {},
            {}
        ]
    };
    var fakeEvent = {
        preventDefault: () =>  {
            return null;
        }
    }
    function modalFake() {
        return { 'result': { 'then': () =>  { } } };
    }
    let $filterFake = jasmine.createSpy('$filter').and.callFake((filter) => {
        let filterFunc:any = () =>  {
            return [];
        };
        filterFunc = () =>  {
            return '';
        };

        return filterFunc;
    })
    let fake$scope = {
        '$on': jasmine.createSpy()
    };
    let faketranslate = {
        'onReady': jasmine.createSpy()
    };
    var $scope, $rootScope, localStorageService, $timeout, FlightsDetailsController;
    beforeEach(() =>  {
        angular.mock.module('ib-Mmb-flights-filter-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$scope ', fake$scope );
            $provide.value('$filter', $filterFake );
            $provide.value('$translate', faketranslate);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('CurrencyService', fakeCurrencyService);
        });
        inject((_$componentController_, _$rootScope_, _$timeout_, _localStorageService_,_$q_, _$compile_) => {
            $timeout = _$timeout_;
            $q = _$q_;
            $controller = _$componentController_;
            $rootScope = _$rootScope_;
            compile = _$compile_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            localStorageService.set('currency', fakeCurrency);
            controller = _$componentController_('ibMmbFlightsFilter',  {
                $scope: $scope,
                $rootScope: $rootScope
            });
            fakeCurrencyService.formatPrice.and.callFake((obj) => {
                var deferred = $q.defer();
                deferred.resolve(obj);
                return deferred.promise;
            });
            fakeCurrencyService.getCurrencyObject.and.callFake((obj, quantity, res) => {
                var deferred = $q.defer();
                deferred.resolve(quantity);
                return deferred.promise;
            });
            fakeMmBModalService.showGenericModal.and.callFake(() =>  {
                return {
                    result: $q.when(fakeData, fakeData)
                };
            });
        });

    });

    describe('When activate() is called', () =>  {
        it('it should set the filter properties correctly', (done) =>  {
            controller.$onInit();
            expect(controller.currency).toBeDefined();
            expect(controller.currency).toEqual(localStorageService.get('currency'));
            expect(controller.listFlightFilterVC).toBeDefined();
            expect(controller.listFlightFilterVC).toEqual(fakeListFlightFilterVC);
            expect(controller.selectedListFlightFilterVC).toBeDefined();
            expect(controller.selectedListFlightFilterVC).toEqual({});
            expect(controller.filterReverse).toBeDefined();
            expect(controller.filterReverse).toEqual(false);
            done();
        });
    });
    describe('When cleanFilter() is called', () =>  {
        var cleanExternal = null;
        it('it should set filterData and modifier properties', (done) =>  {
            expect(controller.filterData).toBeDefined();
            expect(controller.filterData).toEqual(fakeFilterData);
            expect(controller.modifier).toBeDefined();
            expect(controller.modifier).toEqual(false);
            controller.cleanFilter(fakeEvent, cleanExternal);
            done();
        });
        it('it should emmit \'resetFilterDataModal\' if cleanExternal is not true', (done) =>  {
            controller.typeFlight = fakeTypeFlight;
            $scope.$on('resetFilterDataModal', (evt, eventData) => {
                expect(eventData).toEqual(fakeTypeFlight);
            });
            done();
        });
    });
    describe('When existFilters() is called', () =>  {
        it('it should set properties to false ', (done) =>  {
            var item = [{ childElementCount: 1 }, { childElementCount: 0 }];
            expect(controller.filterData.changes).toEqual(false);
            expect(controller.modifier).toEqual(false);
            done();
        });
    });
    describe('When deleteFilter() is called', () =>  {
        var name;
        it('it should check if numScale isNumber', (done) =>  {
            var numScale = 1, name = '';
            var numIsNumber = angular.isNumber(numScale);
            controller.$onInit();
            controller.configModal = fakeModalModel;
            controller.copyConfigModalModel = fakeModalModel;
            controller.deleteFilter(name, numScale);
            expect(numIsNumber).toBe(true);
            done();
        });
        it('it should check if numScale !isNumber', (done) =>  {
            var numScale = {};
            var numIsNumber = angular.isNumber(numScale);
            expect(numIsNumber).toBe(false);
            expect(controller.filterData.scale[name]).toBeUndefined();
            done();
        });
        it('it should check if name is \'cabin\'', (done) =>  {
            var numScale = {};
            name = 'cabin';
            controller.configModal = fakeModalModel;
            controller.copyConfigModalModel = fakeModalModel;
            numScale = null;
            controller.deleteFilter(name, numScale);
            expect(name).toEqual('cabin');
            done();
        });
        it('it should check if name is not \'cabin\'', (done) =>  {
            name = '';
            var numScale = '';
            var numIsNumber = angular.isNumber(numScale);
            controller.configModal = fakeModalModel;
            controller.copyConfigModalModel = fakeModalModel;
            controller.deleteFilter(name, numScale);
            expect(name).not.toBe('cabin');
            expect(numIsNumber).toBe(false);
            done();
        });
        it('it should emmit filterDataModal', (done) =>  {
            $scope.$on('filterDataModal', (evt, eventData) => {
                expect(eventData).toEqual(fakeFilterDataModal);
            });
            done();
        });
    });
    describe('When sendFilter() is called', () =>  {
        var index;
        it('it should form filterData object and emit filterDataModal event', (done) =>  {
            expect(controller.filterData.company).toEqual(fakeData.company);
            $scope.$on('filterDataModal', (evt, eventData) => {
                expect(eventData).toEqual(fakeFilterDataModal);
            });
            done();
        });
    });
    describe('When emitTypeFilter() is called', () =>  {
        it('it should set filter properties and emit typeFilterAvailability', (done) =>  {
            var filterType = '', isOpenModal = false;
            controller.emitTypeFilter(filterType, isOpenModal, fakeConfigModal);
            expect(controller.choosedFilter).toEqual(filterType);
            expect(controller.filterReverse).toEqual(true);
            $scope.$on('filterDataModal', (evt, eventData) => {
                expect(eventData.filterType).toEqual(controller.choosedFilter);
                expect(eventData.reverse).toEqual(controller.filterReverse);
                expect(eventData.reverse).toEqual(controller.typeFlight);
            });
            $timeout.flush();
            done();
        });
        it('it should set filter properties and call showGenericModal', (done) =>  {
            var filterType = '', isOpenModal = true;
            controller.filterTypeOld = '';
            controller.modifier = null;
            controller.emitTypeFilter(filterType, isOpenModal, fakeConfigModal);
            expect(controller.configModal).toEqual(fakeConfigModal.model);
            expect(controller.copyConfigModalModel).toEqual(fakeConfigModal.model);
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalledWith(false, fakeConfigModal.template, fakeConfigModal.model, fakeConfigModal.class);
            $timeout.flush();
            done();
        });
    });

    describe('When cleanSortedSelection() is called', () =>  {
        it('it should call', (done) =>  {
            controller.cleanSortedSelection();
            expect(controller.choosedFilter).toEqual('');
            expect(controller.filterReverse).toEqual(true);
            done();
        });
    });



});
