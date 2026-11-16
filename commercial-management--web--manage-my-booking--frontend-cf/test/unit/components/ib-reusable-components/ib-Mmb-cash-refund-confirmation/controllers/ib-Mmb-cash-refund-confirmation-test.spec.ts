describe('CashRefundConfirmationController test', function() {

    var controller, $scope, $rootScope, $controller;

    var fakeMmBAppConstants = {
        QUADRIGAM: {
            DISRUPTION_CASH_REFUND_CONFIRMATION_PAGE: 'RCDCFP',
            FLEXIBILIZATION_CASH_REFUND_CONFIRMATION_PAGE: 'RCFCFP'
        }
    };

    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };

    let fakeMmBUtilsSharedService = {
        updateQuadrigam: jasmine.createSpy()
    };

    var fakeMMBDatalayerConstants = {
        DIGITAL_DATA_PROCESS: {
            RCDCFP: 'reembolso disrupcion',
            RCFCFP: 'reembolso flexibilizacion cash'
        },
        DIGITAL_DATA_STEP: {
            RCDCFP: 'confirmacion cash',
            RCFCFP: 'confirmacion cash'
        }
    };

    beforeEach(function() {
        angular.mock.module('ib-reusable-components-module', function($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('MMBDatalayerConstants', fakeMMBDatalayerConstants);
        });

        inject(function(_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('CashRefundConfirmationController', {
                $rootScope: $rootScope
            });
        });
    });

    describe('when activate is called', function() {
        it('update datalayer if is disruption', function(done) {
            controller.isDisruption = true;
            controller.$onInit();
            done();
        });

        it('update datalayer if is not disruption', function(done) {
            controller.isDisruption = false;
            controller.$onInit();
            done();
        });
    });
});
