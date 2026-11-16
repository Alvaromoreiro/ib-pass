describe('MmbRefundContinueModalController test', () => {
    var fake$uibModalInstance, fakeObject, fakeDatalayerUtilsService, fakeMmBModalService, $controller, $rootScope, $scope, controller;
    fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
    }
    fakeObject = {};
    fakeDatalayerUtilsService = {};
    fakeMmBModalService = {};

    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('object', fakeObject);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBModalService', fakeMmBModalService);
        });
        inject((_$controller_, _$rootScope_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('MmbRefundContinueModalController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $uibModalInstance: fake$uibModalInstance
            });
            $scope.$apply();
        });
    });
    describe('when modal is initialized', () => {
        it('object is set as model', (done) => {
            expect(controller.model).toBeDefined();
            done();
        });
        it('and closeModal is called', (done) => {
            controller.closeModal();
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalledWith();
            done();
        });
        it('and sendContinueFlowEvent is called', (done) => {
            spyOn($rootScope, '$broadcast');
            controller.sendContinueFlowEvent();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('proceedToVoucherNextStep');
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalledWith();
            done();
        });
    });
});
