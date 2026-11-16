describe('ibMmBManageTransferWidgetInfoService test', function () {
    var ibMmBManageTransferWidgetInfoService, $scope, $rootScope, localStorageService, q;

    var fakeAppConstants = { 'market' : 'ES'};

    var mockResponse = 'ok';

    var fakeCommonsGenericProxy = {
        'postGeneric': jasmine.createSpy('postGeneric').and.callFake(function () {
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
            tokenTransfersPRO: 'test',
            tokenTransfersPREE: 'test'
        }
    }

    var fakeWidgetProMonetate = {
        test: true
    }

    beforeEach(function () {
        angular.mock.module('ib-MmB-manage-transfer-widget-info-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBAppConstants', fakeAppConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });

        inject(function (_ibMmBManageTransferWidgetInfoService_,_$rootScope_, _localStorageService_, $q) {
            ibMmBManageTransferWidgetInfoService = _ibMmBManageTransferWidgetInfoService_;
            $rootScope = _$rootScope_;
            $scope = $rootScope;
            localStorageService = _localStorageService_;
            q = $q;
            localStorageService.set('widgetProMonetate', fakeWidgetProMonetate);
        });
    });

    describe('openModalConditions', function () {
        it('openModalConditions its ok' , function(done) {
            ibMmBManageTransferWidgetInfoService.getTokenWidget();
            // controller.openModalConditions(null, null);
            // expect(fakeMmBModalService.showTransferWidgetModal).toHaveBeenCalled();
            done();
        });
    });

    describe('Reject error', () => {
        it('tal', (done) => {
            localStorageService.set('widgetProMonetate', '');
            var mockError = {}
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });

            ibMmBManageTransferWidgetInfoService.getTokenWidget();
            done();
        })
    });
});
