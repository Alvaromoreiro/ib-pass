describe('AcceptSplitModalController Test', function () {

    var $controller, $rootScope, $scope, controller;

    var fake$uibModal = {
        dismiss: jasmine.createSpy()
    };

    var fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json');

    var fakeDatalayerUtilsService = {
        sendDatalayerModalEvent: jasmine.createSpy()
    };

    var fake$uibModalInstance = {
        result: { 'then': function () { } },
        close: jasmine.createSpy(),
        dismiss: jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ib-cki-modal-module', function ($provide) {
            $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('newPnr', {});
            $provide.value('$uibModal', fake$uibModal);
            $provide.value('$uibModalInstance', fake$uibModalInstance);
            $provide.value('$uibModalStack', {});
            $provide.value('CheckinRouterConstants', {});
        });
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();

            controller = $controller('AcceptSplitModalController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    describe('when activate() is called', function () {
        it('send Datalayer modal event', function () {
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalledWith({
                idModal: fakeCkiDatalayerConstants.DATALAYER_MODAL_ID.BOOKING_SPLIT
            });
        });
    });

    describe('when close() is called', function () {
        it('close modal', function () {
            controller.close();
            expect(fake$uibModalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
    });

});
