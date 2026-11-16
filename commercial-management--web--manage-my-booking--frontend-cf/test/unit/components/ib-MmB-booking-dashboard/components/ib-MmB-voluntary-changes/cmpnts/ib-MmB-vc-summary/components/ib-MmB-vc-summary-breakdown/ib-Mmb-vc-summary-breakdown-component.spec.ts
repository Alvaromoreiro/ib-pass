describe('IbMmBVcSummaryBreakdownController test', () =>  {
    let controller,$scope,$rootScope;

    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
    };

    beforeEach(() =>  {
        angular.mock.module('ib-MmB-vc-summary-module', ($provide: ng.auto.IProvideService) =>  {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_$componentController_, _$rootScope_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = _$componentController_('ibMmbVcSummaryBreakdown', {
                $scope: $scope
            });
        });
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-MmB-vc-summary-breakdown-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            const element = $compile('<ib-MmB-vc-summary-breakdown></ib-MmB-vc-summary-breakdown>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('init component', () =>  {
        it('its create correctly', () =>  {
            expect(controller).toBeDefined();
        });
    });

    describe('when activate() function is called', () =>  {
        it('should do nothing )', () =>  {
            spyOn(controller, '$onInit');
            controller.$onInit();
            expect(controller.$onInit).toHaveBeenCalledWith();
        });
    });
});
