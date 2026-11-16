describe('disruptionRefundController Test', function() {
  let rootScope,  MmBAppConstants, $controller
    let $q,localStorageService,controller
  let fakeLocation = {
        'path': jasmine.createSpy()
    };
  let fakeModalService = {
        'showGenericModal': jasmine.createSpy()
    };
  let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy(),
    };
    beforeEach(function(){
       angular.mock.module('LocalStorageModule', 'ib-disruption-refund-module', function ($provide) {
            $provide.value('$location', fakeLocation);
            $provide.value('MmbModalService', fakeModalService);
            $provide.value('MmBAppConstants', {
                'PAGES_URL': { 'DISRUPTION_DASHBOARD': '/disrptn'}
            });
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
        })
        inject(function ($rootScope, _MmBAppConstants_, _$controller_, _localStorageService_, _$q_)
        {
            $controller = _$controller_
            rootScope = $rootScope;
            MmBAppConstants = _MmBAppConstants_;
            localStorageService = _localStorageService_;
            $q = _$q_;

            fakeLocation.path = jasmine.createSpy('path').and.callFake(function () {
                return 'replace';
            });
            fakeModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                return {
                    result: $q.when({})
                };
            });
            controller = $controller('DisruptionRefundController', {
                $location: fakeLocation,
                MmBModalService: fakeModalService
            })
            $rootScope.$digest();
        })
    })
    describe('When you go Back', function() {
        it('should return to the disruption page', function() {            
            controller.goBack()
            expect(MmBAppConstants.PAGES_URL.DISRUPTION_DASHBOARD).toBe('/disrptn')
        });
    });

});
