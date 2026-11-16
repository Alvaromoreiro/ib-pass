describe('ibModalAssistanceVoucherEmailController test', () => {
    let controller, $rootScope, $scope, localStorageService, $controller, timeout;

    let fake$uibModalInstance = {
        dismiss: jasmine.createSpy(),
        close: jasmine.createSpy(),
        result: { 'then': () => { } }
    }

    let fakeModalService = {
        dismiss: jasmine.createSpy(),
        finishWaiting: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy(),
    };

    var fakeInitModel = {
        showError: false,
        submitted: false,
        showOk: false,
        data: {
          email: null,
        },
    };
    let fakeObject = {};

    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', 'LocalStorageModule',  ($provide) => {
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('object', fakeObject);
            $provide.value('MmBModalService', fakeModalService);
        });
        inject((_$rootScope_, _localStorageService_, _$controller_, $timeout) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            timeout = $timeout;
            localStorageService = _localStorageService_;
            $controller = _$controller_;
            controller = $controller('ibModalAssistanceVoucherEmailController', {
                $scope: $scope,
                $rootScope: $rootScope,
                localStorageService: localStorageService,
                object: fakeInitModel,
                $timeout: timeout
            });

            controller.model = fakeInitModel;
            controller.voucherEmailForm = {
                $submitted : true,
                $valid: true
            }
            $rootScope.$digest();
        });
    });
    describe('when activate is called ', () => {
        it('$onInit() is Called', (done) => {
            controller.$onInit();
            expect(controller).toBeDefined();
            done();
        });
    });

    describe('when sendAssitanceVoucher is called ', () => {
        it('sendAssitanceVoucher() is Called', (done) => {

            controller.sendAssitanceVoucher();
            timeout.flush();
            timeout.flush();
            $rootScope.$digest();
            expect(controller.model.showOk).toBe(true);
            expect(controller.model.submitted).toBe(false);
            done();
        });
    });

    describe('when close is called ', () => {
        it('close() is Called', (done) => {
            controller.close();
            expect(controller.model.showError).toBe(false);
            expect(controller.model.submitted).toBe(false);
            done();
        });
    });

});
