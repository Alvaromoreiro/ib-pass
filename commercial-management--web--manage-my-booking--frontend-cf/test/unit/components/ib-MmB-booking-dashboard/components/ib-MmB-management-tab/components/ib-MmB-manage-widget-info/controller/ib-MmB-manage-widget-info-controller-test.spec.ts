describe('MmbManageWidgetInfoController test', () => {
    let controller, $scope, $rootScope;

    let fakeMmBModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return { result: { then: angular.noop } };
        }),
        showWidgetModal : jasmine.createSpy('showWidgetModal').and.callFake(() => {
            return { result: { then: (angular.noop, angular.noop) } };
        })
    };
    beforeEach(() => {
        angular.mock.module('ib-MmB-manage-widget-info-module', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
        });

        inject((_$rootScope_, $controller) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope;
            controller = $controller('MmbManageWidgetInfoController', { $scope: $scope, $rootScope: $rootScope });
        });
    });

    describe('init component', () => {
        it('its create correctly', (done) => {
            controller.order = [{
                startDate: '10-01-2023  ',
                name: 'test',
                orderName: null
            }];
            controller.$onInit();
            expect(controller.order[0].startDate.split(' ')[0].replaceAll('-','/')).toEqual('10/01/2023');
            expect(controller.order[0].name).toEqual('test');
            done();
        });
        it('its create correctly with orderName', (done) => {
            controller.order = [{
                startDate: '10-01-2023  ',
                name: 'test',
                orderName: 'orderTest'
            }];
            controller.$onInit();
            expect(controller.order[0].startDate.split(' ')[0].replaceAll('-','/')).toEqual('10/01/2023');
            expect(controller.order[0].name).toEqual('orderTest');
            done();
        });
    });

    describe('openModalConditions', () => {
        it('openModalConditions its ok' , (done) => {
            controller.openModalConditions(null, null);
            expect(fakeMmBModalService.showWidgetModal).toHaveBeenCalled();
            done();
        });
    });
});
