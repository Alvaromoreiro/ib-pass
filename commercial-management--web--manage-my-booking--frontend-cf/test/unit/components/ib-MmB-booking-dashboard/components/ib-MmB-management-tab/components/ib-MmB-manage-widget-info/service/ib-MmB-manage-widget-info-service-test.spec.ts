describe('ibMmBManageWidgetInfoService test', function () {
    var ibMmBManageWidgetInfoService, $scope, $rootScope, localStorageService, q;

    var fakeAppConstants = { 'market' : 'ES'};

    var mockResponse = 'ok';

    var fakeCommonsGenericProxy = {
        'postGeneric': jasmine.createSpy('postGeneric').and.callFake(() => {
            var deferred = q.defer();
            deferred.resolve(mockResponse);
            return deferred.promise;
        })
    };
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy()
    }

    var fakeMmBAppConstants = {
        DEFAULT_ENDPOINTS: {
            tokenActivitiesPRO: 'test',
            tokenActivitiesPREE: 'test'
        }
    }

    var fakeWidgetProMonetate = {
        test: true
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-manage-widget-info-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBAppConstants', fakeAppConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });

        inject((_ibMmBManageWidgetInfoService_,_$rootScope_, _localStorageService_, $q) => {
            ibMmBManageWidgetInfoService = _ibMmBManageWidgetInfoService_;
            $rootScope = _$rootScope_;
            $scope = $rootScope;            
            localStorageService = _localStorageService_;
            q = $q;
            localStorageService.set('widgetProMonetate', fakeWidgetProMonetate);
        });
    });

    describe('openModalConditions', () => {
        
        it('openModalConditions its ok' , (done) => {
            ibMmBManageWidgetInfoService.getTokenWidget();
            // controller.openModalConditions(null, null);
            // expect(fakeMmBModalService.showTransferWidgetModal).toHaveBeenCalled();
            done();
        });
    });

    describe('Reject error', () => {
        it('tal', (done) => {
            localStorageService.set('widgetProMonetate', '');
            var mockError = {};
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            
            ibMmBManageWidgetInfoService.getTokenWidget();
            done();
        })
    });
});
