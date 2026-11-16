describe('ibMmbSimulatorAvailabilityComponent test', () => {

    let $componentController, $rootScope, $scope, controller, $uibModalInstance, $timeout, localStorageService, $translate, $q;
    let fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy('showGenericModal').and.callFake(() => { }),
        'closeAllCurrentModals': jasmine.createSpy('closeAllCurrentModals').and.callFake(() => { }),
        'closeModal': jasmine.createSpy('closeAllCurrentModals').and.callFake(() => { }),
    };
    let fakeSimulatorAvailabilityTransformer = {
        'getDataAvailabilityTransformed': jasmine.createSpy('getDataAvailabilityTransformed').and.callFake(() => {
            return {};
        }),
        'getFlightsLength': jasmine.createSpy('getFlightsLength').and.callFake(() => {
            return {};
        })
    }

    let fake$resolve = {
        'dataModalChangesFlights': {
            'availability': { 'modeFlight': 'modeFlight', 'responseId': 'responseId', 'empty': false, 'originDestinations': 'originDestinations' },
            'modelRibbon': 'modelRibbon',
            'selectedSlide': 'selectedSlice',
            'originalDateFlights': 'originalDateFlights',
            'penalty': {outbound: true, return: false},
            'filterRangeParsed': {outbound: true, return: false}
        }
    }

    let fakeBookingDashboardConstants = {
        'TABS': {
            'management': 'test'
        }
    }

    let fakeMmBAppConstants = {
        STEPS_SIMULATOR_CHANGE_VOLUNTARY: {
            'SELECT_FLIGHT': 'SELECT_FLIGHT',
            'SUMMARY': 'SUMMARY',
        }
    }

    let $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = () => {
            return ''
        };
        switch (filter) {
            case 'translate':
                filterFunc = () => {
                    return '';
                };
                break;
            case 'DurationFormatFilter':
                filterFunc = () => {
                    return '0h 52min.';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });
    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy('setTitlePage').and.callFake(() => {
            return 'TITULO'
        }),
    };

    let fakeBookingSearchService = {
        'searchFlightsPassengersEvent': jasmine.createSpy('searchFlightsPassengersEvent').and.callFake(() => { }),
        'retrieveOrderComplete': jasmine.createSpy(),
        'checkOrderInfo': jasmine.createSpy()
    };

    let fakeTranslate = {
        'onReady': jasmine.createSpy('onReady').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }),
        'storageKey': jasmine.createSpy('storageKey').and.callFake(() => { }),
        'storage': jasmine.createSpy('storage').and.callFake(() => { }),
        'preferredLanguage': jasmine.createSpy('preferredLanguage').and.callFake(() => { }),
        'use': jasmine.createSpy('use').and.callFake(() => { })
    };

    let fakeocLazyLoad = {
        'load': jasmine.createSpy(),
    };

    let fakeWindows = {
        'onpopstate': jasmine.createSpy('onpopstate').and.callFake((event)=>{
            return {$timeout: jasmine.createSpy()}
        })
    };

    let fakeBookingInfo = {
        passengers: [
            {
                personalInfo: {
                    name: 'test',
                    surname: 'test'
                }
            }
        ]
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-simulator-availability-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('SimulatorAvailabilityTransformer', fakeSimulatorAvailabilityTransformer);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('$resolve', fake$resolve);
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('$filter', $fakeFilter);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('$translate', fakeTranslate);
            $provide.value('$ocLazyLoad', fakeocLazyLoad);
        });
        inject((_$componentController_, _$rootScope_, _$timeout_,_localStorageService_, _$translate_, _$q_) => {
            $componentController = _$componentController_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $scope.$resolve = fake$resolve;
            $timeout = _$timeout_;
            localStorageService = _localStorageService_;
            $translate = _$translate_;
            $q = _$q_;
            $uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']);
            controller = $componentController('ibMmbSimulatorAvailabilityComponent', {
                $scope: $scope,
                $rootScope: $rootScope,
                $translate: fakeTranslate,
                $uibModalInstance: $uibModalInstance,
                localStorageService: _localStorageService_,
            });
            controller.model = {};
            localStorageService.set('paymentRedirection', false);
            localStorageService.set('RechargeBookingInfo', true);
            localStorageService.set('bookingInfo', fakeBookingInfo);
        });
    });

    describe('when activate() is called', () => {
        it('The model with modelempty true', (done) => {
            fake$resolve.dataModalChangesFlights.availability.empty = true;
            controller.resolve = fake$resolve;
            controller.$onInit();
            $timeout.flush();
            expect(controller.model).toEqual({ modelempty: true, originDestinations: 'originDestinations', modeFlight: 'modeFlight', modelRibbon: 'modelRibbon', selectedSlice: 'selectedSlice', responseId: 'responseId',  penalty: { outbound: true, return: false }, filterRangeParsed: { outbound: true, return: false }});
            done();
        });
        it('The model with modelempty false', (done) => {
            fake$resolve.dataModalChangesFlights.availability.empty = false;
            controller.resolve = fake$resolve;
            controller.$onInit();
            $timeout.flush();
            expect(controller.model).toEqual({modeFlight: 'modeFlight', modelRibbon: 'modelRibbon', selectedSlice: 'selectedSlice', responseId: 'responseId', penalty: { outbound: true, return: false }, filterRangeParsed: { outbound: true, return: false }});
            done();
        });

    });

    describe('when showModalByModal() is called', () => {
        it('MmBModalService.showModalByModal when data === goHome', (done) => {
            localStorageService.set('flowApp', 'MMBUNIF');
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    'result': $q.when('goHome')
                };
            });
            controller.model = { 'idModal': '' };
            controller.actualStep = 'default';
            controller.showModalByModal();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            expect(localStorageService.get('manualCloseVCModal')).toBe(true);
            done();
        });
        it('MmBModalService.showModalByModal when data === goHome', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                return {
                    'result': $q.reject()
                };
            });
            controller.model = { 'idModal': '' };
            controller.actualStep = 'default';
            controller.showModalByModal();
            $rootScope.$digest();
            expect(fakeMmBModalService.closeModal).toHaveBeenCalled();
            done();
        });

    });

    describe('when changeDataAvailability() is called', () => {
        it('Should update model and emit event', () => {
            spyOn($scope, '$broadcast');
            controller.model = {};
            controller.model.responseId = '';
            $rootScope.$broadcast('changeDataAvailability', { 'data': { 'responseId': 1 }, 'modeFlight': 'test' });
            expect(controller.model.responseId).toEqual(1);
            expect($scope.$broadcast).toHaveBeenCalledWith('updateAvailability', {});
        });
    });
    describe('when toSummaryView() is called', () => {
        it('Variable showPmtView should change', (done) => {
            controller.steps = [{
                name: 'MMB_VC_1_SELECTION_OF_FLIGHTS',
                isActive: true,
                stepId: fakeMmBAppConstants.STEPS_SIMULATOR_CHANGE_VOLUNTARY.SELECT_FLIGHT
            }, {
                name: 'MMB_VC_2_SUMMARY',
                isActive: false,
                stepId: fakeMmBAppConstants.STEPS_SIMULATOR_CHANGE_VOLUNTARY.SUMMARY
            }];
            $rootScope.$broadcast('toSummaryView');
            expect(controller.showPmtView).toBe(false);
            done();
        })
    });

    describe('when closeGoHome() is called', () => {
        it('Should closeGoHome', (done) => {
            controller.closeGoHome();
            expect(fakeMmBModalService.closeAllCurrentModals).toHaveBeenCalled();
            done();
        })
    });

});
