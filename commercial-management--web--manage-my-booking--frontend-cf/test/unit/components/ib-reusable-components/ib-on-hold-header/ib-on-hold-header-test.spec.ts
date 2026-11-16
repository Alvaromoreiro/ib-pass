describe('IbOnHoldHeaderController test', function () {
    var controller, $scope, $rootScope, localStorageService;

    var fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal'),
        showLoginModal: jasmine.createSpy('showLoginModal')
    }

    beforeEach(function () {
        angular.mock.module('ib-on-hold-header-module', 'LocalStorageModule', function ($provide) {
            $provide.value('BookingDashboardConstants', {});
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBModalServiceProvider', {});
        });
        inject(function (_$rootScope_, $controller, _localStorageService_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            controller = $controller('IbOnHoldHeaderController', {
                $scope: $scope
            });
        });
    });

    describe('init component', function () {
        it('its create correctly', function () {
            expect(controller.$onInit).toBeDefined();
        });
    });

    describe('Activate test', function(){
        it('Should initialize model', function(done) {
            localStorageService.set('generalInfo','TEST');
            controller.$onInit();
            expect(controller.bookingInfo ).toEqual('TEST');
            done();
        })
    });

    describe('ShowWaitingModal', function(){
        beforeEach(function() {
            fakeMmBModalService.showWaitingModal = jasmine.createSpy('showWaitingModal');
        });
        it('Should call service', function(done) {
            $rootScope.$broadcast('showWaitingModal');
            expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
            done();
        })
    });

    describe('ShowWaitingModal', function(){
        beforeEach(function() {
            fakeMmBModalService.showWaitingModal = jasmine.createSpy('showWaitingModal');
        });
        it('Should call service', function(done) {
            $rootScope.$broadcast('showWaitingModal');
            expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
            done();
        })
    });

    describe('Show Login modal', function(){
        beforeEach(function() {
            fakeMmBModalService.showLoginModal = jasmine.createSpy('showLoginModal');
        });
        it('Should call service', function(done) {
            controller.openModal(null, null, {preventDefault:function(){}})
            expect(fakeMmBModalService.showLoginModal).toHaveBeenCalled();
            done();
        })
    });

    describe('Call back to main', function(){

        it('Call function', function(done) {
            controller.backToMain()
            done();
        })
    });
});
