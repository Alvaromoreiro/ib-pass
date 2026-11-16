
describe('FlightsInfoController test', () =>  {

    let $controller, $rootScope, $scope, controller;

    let fakeMmBAppConstants = {
        templatesRoute: 'web-manage-my-booking/templates/',
    };

    beforeEach(() =>  {
        angular.mock.module('ib-Mmb-flights-info-module', ($provide) =>  {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_$componentController_, _$rootScope_) => {
            $controller = _$componentController_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = _$componentController_('ibMmbFlightsInfo', {
                $scope: $scope
            });
        });

    });

    describe('when activate() is called', () =>  {
        it('Should be called' , () =>  {
            controller.$onInit();
            expect(controller.$onInit).toBeDefined();
        });
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-Mmb-flights-info-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            const element = $compile('<ib-MmB-flights-info></ib-MmB-flights-info>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });
});

