describe('MmbManageInsuranceInfoController test', function () {

    var $controller, $rootScope, $scope, controller, localStorageService;

    var fakeBookingDashboardConstants = {};
    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop)
    };
    var fakeMmBAppConstants = {};
    var fakeDatalayerConstants = {};
    var fakeMmBModalService = {};
    var fakeMmBUtilService = {
        isUserLogged : function(){
            return false;
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-manage-insurance-info-module', 'LocalStorageModule', function($provide) {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBModalService', fakeMmBModalService);
        });

        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('MmbManageInsuranceInfoController', { $scope: $scope, $rootScope: $rootScope, localStorageService: localStorageService });
        });
    });

    describe('OnInit', function () {

        it('activate is called' , function() {
            controller.model = ['insurance1', 'insurance2'];
            controller.$onInit();
            controller.insurance = 'insurance1';
        });
    });

});
