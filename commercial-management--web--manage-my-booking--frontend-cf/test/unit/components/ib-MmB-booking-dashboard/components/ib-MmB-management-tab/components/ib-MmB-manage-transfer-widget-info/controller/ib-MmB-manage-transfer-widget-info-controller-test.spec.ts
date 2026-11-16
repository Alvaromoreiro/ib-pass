describe('MmbManageTransferWidgetInfoController test', () => {
    let controller, $scope, $rootScope;

    let fakeMmBModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return { result: { then: angular.noop } };
        }),
        showTransferWidgetModal : jasmine.createSpy('showTransferWidgetModal').and.callFake(() => {
            return { result: { then: (angular.noop, angular.noop) } };
        })
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-manage-transfer-widget-info-module', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
        });

        inject((_$rootScope_, $controller) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope;
            controller = $controller('MmbManageTransferWidgetInfoController', { $scope: $scope, $rootScope: $rootScope });

        });
    });

    describe('init component', () => {
        it('its create correctly', (done) => {
            controller.order = [{
                startDate: "2024-04-30T08:00:00.000",
                name: 'test',
                orderName: 'orderTest'
            }];
            controller.$onInit();
            expect(controller.order[0].name).toEqual('orderTest');
            done();
        });
        it('its create correctly with element.name', (done) => {
            controller.order = [{
                startDate: "2024-04-30T08:00:00.000",
                name: 'test',
                orderName: null
            }];
            controller.$onInit();
            expect(controller.order[0].name).toEqual('test');
            done();
        });
    });

    describe('openModalConditions', () => {
        it('openModalConditions its ok' , (done) => {
            controller.openModalConditions(null, null);
            expect(fakeMmBModalService.showTransferWidgetModal).toHaveBeenCalled();
            done();
        });
    });
});
