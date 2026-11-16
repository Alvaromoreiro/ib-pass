describe('ibMmbDashItemController Test', function() {
    var $controller, $rootScope, $scope, localStorageService, $filter, $timeout, $q, controller;

    var fakeMmBModalService = {
        'showGenericModal' : jasmine.createSpy('showGenericModal')
    };

    var fakeEvent = 'priority';

    var fakeSliceItem = {
        'arrival' : {
            'code' : 'MAD'
        },
        'departure' : {
            'code' : 'MRU'
        }
    };

    var fakePriorityInfo = {
        'PriorityInfo' : [{
            'segments' : [{
                'arrivalCity' : {
                    'city' : {
                        'code' : 'MAD'
                    }
                },
                'departureCity' : {
                    'city' : {
                        'code' : 'MRU'
                    }
                }
            }]
        }]
    };

    var fakeSpeqsInfo = {
        'SpeqsInfo' : [{
            'arrivalCity' : {
                'code' : 'MAD'
            },
            'departureCity' : {
                'code' : 'MRU'
            },
            'segments' : [{
                'sliceSpeqs' : {
                    'passBaggages' : [{
                        'Speqs': [{
                            'subtype': 'SPEQS_',
                            'amount': 100
                        }]
                    }]
                }
            }]
        }]
    };

    var fakeAncillariesInfo = {
        ancillariesAvailable: [
            'PRIORITY_BOARDING'
        ],
        isAncillariesInTime: {
            isIntime:true
        }
    };

    var fakeSpeqsAvailableSegments = [
        "MADLHR20231130065000"
    ];

    var fakeBundleSpeqsPerFlight = {
        quantity: 100,
        subtype: 'SPEQS_'
    };

    beforeEach(function(){
        angular.mock.module('ib-mmb-dash-item', 'LocalStorageModule', function($provide){
            $provide.value('MmBModalService', fakeMmBModalService);
        });
        inject(function(_$controller_, _$injector_,_localStorageService_, _$rootScope_,_$filter_,_$timeout_,_$q_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            localStorageService.set('speqsAvailableSegments', fakeSpeqsAvailableSegments);
            $filter = _$filter_;
            $timeout = _$timeout_;
            $q = _$q_;
            controller = $controller('ibMmbDashItemController', {$scope:$scope, $rootScope:$rootScope});
        });
        $rootScope.$digest();
    });

    describe('when function action is called', function(){
        beforeEach(inject(function (_localStorageService_, _$q_) {
            $q = _$q_;
            localStorageService.set('PriorityInfo', fakePriorityInfo);
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                return {
                    result: $q.when({})
                };
            })
            controller.ancillariesInfo = fakeAncillariesInfo;
            fakeEvent = 'priority';
        }));
        it('and event is priority', function(done){
            controller.action(fakeEvent, fakeSliceItem);
            expect(controller).toBeDefined();
            expect(controller.activeLink).toBe(true);
            done();
        });
    });

    describe('when function action is called with event speqs', function(){
        beforeEach(inject(function (_localStorageService_, _$q_) {
            $q = _$q_;
            localStorageService.set('SpeqsInfo', fakeSpeqsInfo);
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                return {
                    result: $q.when({})
                };
            })
            controller.ancillariesInfo = fakeAncillariesInfo;
            fakeEvent = 'Speqs';
        }));
        it('and event is not priority', function(done){
            controller.action(fakeEvent, fakeSliceItem);
            expect(controller).toBeDefined();
            done();
        });
    });

    describe('when function flightMenuToggle is called', function(){
        beforeEach(inject(function (_localStorageService_, _$q_) {
            $q = _$q_;
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                return {
                    result: $q.when({})
                };
            })
            controller.flightMenuOpen = false;
            controller.flightMenuBtnText = 'HEADER_ADVANCED_SEARCH_PASSENGERS_OPENED';
            controller.flightMenuAriaText = 'Menú abierto';
            controller.flightMenuFocusValue = 0;
            controller.ancillariesInfo = fakeAncillariesInfo;
            fakeEvent = 'Speqs';
        }));
        it('and flightMenuOpen is false', function(done){
            controller.flightMenuToggle(fakeEvent, fakeSliceItem);
            expect(controller).toBeDefined();
            done();
        });
    });

    describe('when function flightMenuToggle is called', function(){
        beforeEach(inject(function (_localStorageService_, _$q_) {
            $q = _$q_;
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                return {
                    result: $q.when({})
                };
            })
            controller.flightMenuOpen = true;
            controller.flightMenuBtnText = 'HEADER_ADVANCED_SEARCH_PASSENGERS_OPENED';
            controller.flightMenuAriaText = 'Menú abierto';
            controller.flightMenuFocusValue = 0;
            controller.ancillariesInfo = fakeAncillariesInfo;
            fakeEvent = 'Speqs';
        }));
        it('and flightMenuOpen is false', function(done){
            controller.flightMenuToggle(fakeEvent, fakeSliceItem);
            expect(controller).toBeDefined();
            done();
        });
    });

    describe('when function action is called with bundleSpeqsPerFlight', function(){
        beforeEach(inject(function (_localStorageService_, _$q_) {
            $q = _$q_;
            localStorageService.set('SpeqsInfo', fakeSpeqsInfo);
            localStorageService.set('bundleSpeqsPerFlight', fakeBundleSpeqsPerFlight);
            fakeEvent = 'Speqs';
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                return {
                    result: $q.when({})
                };
            })
        }));
        it('and showSpeqs is true', function(done){
            controller.action(fakeEvent, fakeSliceItem);
            expect(controller).toBeDefined();
            done();
        });
    });
});
