describe('ibHeaderController', () => {
    let controller, $rootScope, $scope, localStorageService, $componentController;
    const fakeibHeaderComponentServiceModel = {
        getSubscriptionToHeaderComponentModel: jasmine.createSpy('getSubscriptionToHeaderComponentModel').and.callFake(() => {
            return true;
        })
    };

    beforeEach(() => {
        angular.mock.module('ib-web-menus-module','LocalStorageModule', ($provide) => {
            $provide.value('ibHeaderComponentServiceModel', fakeibHeaderComponentServiceModel);
        });
        inject((_$rootScope_, _localStorageService_, _$controller_, _$componentController_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            $componentController = _$componentController_;
            controller = $componentController('ibHeaderComponent');
            $rootScope.$digest();
        });
    });

    describe('when functions is called ', () => {

        it('activate() is Called', (done) => {
            controller.$onInit();
            expect(controller).toBeDefined();
            done();
        });
    });

});
