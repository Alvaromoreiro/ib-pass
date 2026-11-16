describe('ibMmbTransfer', () => {
    let $compile, $rootScope;
    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/'
    };

    beforeEach(() => {
        angular.mock.module("ib-MmB-transfer-card-module", ($provide: ng.auto.IProvideService) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });

        inject((_$compile_, _$rootScope_, _$httpBackend_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            // Mock del templateUrl
            _$httpBackend_.whenGET('web-manage-my-booking/templates/ib-MmB-transfer-card-view.html').respond(200, '<div></div>');
        });
    });

    it('Component compile', () => {
        const scope = $rootScope.$new();
        scope.testModel = { foo: 'bar' };
        scope.testIndex = 2;

        const element = $compile('<ib-mmb-transfer model="testModel" index="testIndex"></ib-mmb-transfer>')(scope);
        scope.$digest();

        const ctrl = element.controller('ibMmbTransfer');
        expect(ctrl).toBeUndefined();
    });
});
