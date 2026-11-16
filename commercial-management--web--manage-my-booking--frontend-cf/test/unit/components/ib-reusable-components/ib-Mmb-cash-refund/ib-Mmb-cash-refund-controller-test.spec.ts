describe('CashRefundController test', function () {
    var controller, $scope, $rootScope, $controller, localStorageService, $q;

    var fakeMmBModalService = {
        'showFullModal' : jasmine.createSpy('showFullModal') //generan el then en el it
    }

    var fakeDisruptionDashboardConstants = {
        COMMON_LABELS: {
            CHANNEL: {
                IBCOM: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_DIRECT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_INDIRECT: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                CALL_CENTER: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                OTHER: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                DEFAULT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                }
            }
        }
    }

    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc: any = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                };
                break;
            case 'DurationFormatFilter':
                filterFunc = function () {
                    return '0h 52min.';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    beforeEach(function(){
        angular.mock.module('ib-MmB-cash-refund-module', 'LocalStorageModule', function($provide){
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('DisruptionDashboardConstants', fakeDisruptionDashboardConstants);
            $provide.value('$filter', $fakeFilter);
        });
        inject(function(_$controller_, _$injector_,_localStorageService_, _$rootScope_,_$filter_){
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            controller = $controller('CashRefundController', {$scope:$scope, $rootScope:$rootScope});
        });
        $rootScope.$digest();
    });

    describe('When init function is called', function() {
        beforeEach(inject(function () {
            var object1 = {
                RESERVAS: {
                    prefix: '(+34)',
                    telephone: '913894357',
                    text: '',
                    prefixAlt: '',
                    telephoneAlt: '',
                    textAlt: '',
                    timeText: ''
                }
            }
            localStorageService.set('phonesList', object1);
            localStorageService.set('pnrChannel', 'NDC_DIRECT');
            controller.isDisruption = true;
        }));
        it('and CashRefundController be defined', function(done) {
            controller.$onInit();
            expect(controller).toBeDefined();
            done();
        });
    });

    describe('when openSummary function is called', function(){
        describe('when isDisruption is true', function(){
            beforeEach(function () {
                inject(function (_$rootScope_,_localStorageService_, _$q_) {
                    $rootScope = _$rootScope_;
                    $q = _$q_;
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(function () {
                        return {
                            result: $q.when({})
                        };
                    });
                    controller.isDisruption = true;
                })
                $rootScope.$digest();
            });
            it('openSummary to have been defined', function(done){
                controller.openSummary();
                done();
            });
        });

        describe('when isDisruption is false', function(){
            beforeEach(function () {
                inject(function (_$rootScope_,_localStorageService_, _$q_) {
                    $rootScope = _$rootScope_;
                    $q = _$q_;
                    fakeMmBModalService.showFullModal = jasmine.createSpy('showFullModal').and.callFake(function () {
                        return {
                            result: $q.when({})
                        };
                    });
                    controller.isDisruption = false;
                })
                $rootScope.$digest();
            });
            it('openSummary to have been defined', function(done){
                controller.openSummary();
                done();
            });
        });
    });
});
