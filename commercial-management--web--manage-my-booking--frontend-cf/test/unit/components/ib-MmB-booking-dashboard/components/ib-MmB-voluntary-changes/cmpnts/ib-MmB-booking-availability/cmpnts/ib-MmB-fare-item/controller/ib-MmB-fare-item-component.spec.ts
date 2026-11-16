describe('ibMmbFareItem test', () => {

    let $componentController, $rootScope, $scope, controller, $uibModalInstance, $localStorageService;

    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-fare-item-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_$componentController_, _$rootScope_, _$timeout_, _localStorageService_) => {
            $componentController = _$componentController_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $localStorageService = _localStorageService_;
            $uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']);
            controller = $componentController('ibMmbFareItem', {
                $scope: $scope,
                $rootScope: $rootScope,
                $uibModalInstance: $uibModalInstance,
                $localStorageService: $localStorageService,
            });
            controller.model = {index: 0};
            controller.index = 0;
            controller.onSelect = jasmine.createSpy()
        });
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-MmB-fare-item-view.html').respond(200, '<div id="test-template"></div>');
            $scope.model = { index: 0 };
            $scope.selectedFare = 0;
            const element = $compile('<ib-mmb-fare-item model="model" selected-fare="selectedFare"></ib-mmb-fare-item>')($scope);
            $scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('when $onInit() is called', () => {
        it('is defined', (done) => {
            controller.$onInit();
            expect(controller.selectedFare).toEqual(0);
            done();
        });
    });

    describe('when selectCabin() is called', () => {
        it('is defined', (done) => {
            let event = {};
            controller.selectCabin(event);
            expect(controller.selectedFare).toEqual(0);
            done();
        });
    });
});
