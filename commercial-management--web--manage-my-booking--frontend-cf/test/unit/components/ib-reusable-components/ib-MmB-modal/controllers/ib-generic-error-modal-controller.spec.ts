describe('MmBGenericErrorModalController test', () => {
    var fake$uibModalInstance, fakeObject, fakeDatalayerUtilsService, $controller, $rootScope, $scope, controller;
    fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
        close: jasmine.createSpy(),
        result: { 'then': () => { } }
    }
    fakeObject = {};
    fakeDatalayerUtilsService = {
        sendDatalayerErrorEvent: jasmine.createSpy(),
        removeDatalayerErrorAttrs: jasmine.createSpy().and.callFake(() => {
            return 'removeDatalayer'
        })
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('errorObject', fakeObject);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
        });
        inject((_$controller_, _$rootScope_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('MmBGenericErrorModalController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });
    describe('when modal is initialized', () => {
        it('and activate is called', (done) => {
            expect(fakeDatalayerUtilsService.sendDatalayerErrorEvent).toHaveBeenCalledWith(fakeObject);
            expect(controller).toBeDefined();
            done();
        });
        it('and close is called', (done) => {
            controller.close();
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalledWith();
            done();
        });
        it('and accept is called', (done) => {
            controller.accept();
            expect(fake$uibModalInstance.close).toHaveBeenCalledWith();
            done();
        });
    });
});
