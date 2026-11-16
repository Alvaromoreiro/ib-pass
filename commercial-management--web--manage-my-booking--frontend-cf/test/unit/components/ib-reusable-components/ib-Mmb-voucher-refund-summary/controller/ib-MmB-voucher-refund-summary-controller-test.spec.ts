describe('VoucherRefundSummaryController test', function () {

    var controller, $scope, $rootScope, localStorage;

    var fakeMmBAppConstants = {
        QUADRIGAM: {
            DISRUPTION_VOUCHER_REFUND_SUMMARY: 'RVFDBT',
            FLEXIBILIZATION_VOUCHER_REFUND_SUMMARY: 'RVFDBT',
            DISRUPTION_CASH_REFUND_SUMMARY: 'RCDDBD',
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_MODAL: 'RVFDBT',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_MODAL: 'RVFDBT',
            DISRUPTION_CASH_REFUND_CONFIRMATION_MODAL: 'RVFDBT',
            FLEXIBILIZATION_CASH_REFUND_CONFIRMATION_MODAL: 'RVFDBT',
        },
        EMAIL_NOTIFICATION:{
            CASH:'cash'
        }
    };
    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy(),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDatalayerStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy(),
    };
    var fakeDatalayerConstants = {
        'DATALAYER_EVENT_TYPES': {
            'VIEW': 'VIEW'
        },
        'DIGITAL_DATA_PROCESS' :{
            'RCDDBD': 'reembolso disrupcion',
            'RVFDBD': 'reembolso flexibilizacion bono',
            'RVDDBD': 'reembolso disrupcion',
            'RVFCEB': 'reembolso flexibilizacion bono',
            'RCDCEB': 'reembolso disrupcion',
            'RCFCEB': 'reembolso disrupcion',
            'RVDCEB': 'reembolso disrupcion'
        },
        'DIGITAL_DATA_STEP': {
            'RCDDBD': 'desglose cash',
            'RVFDBD': 'desglose',
            'RVDDBD': 'desglose bono',
            'RVFCEB': 'aceptacion',
            'RCDCEB': 'aceptacion cash',
            'RCFCEB': 'aceptacion cash',
            'RVDCEB': 'aceptacion bono'
        }
    };
    let fakeMmBUtilsSharedService = {
        updateQuadrigam: jasmine.createSpy()
    };
    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc: any = function () {
            return [];
        };
        switch (filter) {
            case 'LinksFilter':
                filterFunc = function () {
                    return 'Linked Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });
    var fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy()
    };

    var fakePhoneList = {
        RESERVAS: { 'prefix': '(+34)', 'telephone': '901 111 500', 'text': 'Reservas y Venta:', 'prefixAlt': '', 'telephoneAlt': '', 'textAlt': '', 'timeText': '24h' }
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy(),
    };
    var fakeModalService = {
        dismiss: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy(),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function () {
            return {
                result: {
                    then: angular.noop
                }
            };
        }),
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-voucher-refund-summary-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('$filter', $filterFake);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('MmBModalService', fakeModalService);
        });

        inject(function (_$rootScope_, _$controller_, _localStorageService_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            localStorage = _localStorageService_;
            localStorage.set('voucherEmailNotification', true);
            localStorage.set('cashEmailNotification', fakePhoneList);
            localStorage.set('voucherEmailNotificationFlow', true)
            localStorage.set('cashEmailNotificationFlow', 'test')
            localStorage.set('refundPercentage', { refundPercent: 45 })
            controller = _$controller_('VoucherRefundSummaryController', {
                $scope: $scope,
                $rootScope: $rootScope,
            });
        });
    });


    describe('when activate is called', function () {

        it('and dont have contactInfo', function (done) {
            controller.$onInit();
            done();
        });
        it('and have contactInfo and isDisruption === true', function (done) {
            controller.contactInfo = true;
            controller.isDisruption = true;
            controller.$onInit();
            done();
        });
        it('and have contactInfo and isDisruption === false', function (done) {
            controller.contactInfo = true;
            controller.isDisruption = false;
            controller.$onInit();
            done();
        });
    });

    describe('when checkUSRoute is called', function () {
        beforeEach(function() {
            controller.bookingInfo = {
                order: {
                    slices: []
                },
                orderFlags: [
                    {
                        type: 'ALLOWED_REFUND_CASH', 
                        enabled: true
                    }
                ]
            }
        });

        it('should return false when ALLOWED_REFUND_CASH is false', function () {
            controller.bookingInfo.orderFlags = [
                {
                    type: 'ALLOWED_REFUND_CASH', 
                    enabled: false
                }
            ];
            expect(controller.checkUSRoute()).toBe(false);
        });

        it('should return false when slices is undefined', function () {
            controller.bookingInfo.order.slices = undefined;
            expect(controller.checkUSRoute()).toBe(false);
        });

        it('should return false when no segments have US as arrival or departure', function () {
            controller.bookingInfo.order.slices = [
                {
                    segments: [
                        { arrivalCity: { countryCode: 'CA' }, departureCity: { countryCode: 'MX' } }
                    ]
                }
            ];
            expect(controller.checkUSRoute()).toBe(false);
        });

        it('should return true when a segment has arrivalCity countryCode US', function () {
            controller.bookingInfo.order.slices = [
                {
                    segments: [
                        { arrivalCity: { countryCode: 'US' }, departureCity: { countryCode: 'MX' } }
                    ]
                }
            ];
            expect(controller.checkUSRoute()).toBe(true);
        });

        it('should return true when a segment has departureCity countryCode US', function () {
            controller.bookingInfo.order.slices = [
                {
                    segments: [
                        { arrivalCity: { countryCode: 'CA' }, departureCity: { countryCode: 'US' } }
                    ]
                }
            ];
            expect(controller.checkUSRoute()).toBe(true);
        });
    });

    describe('When openContinueModal is called', function () {
        it('and dont have any value', function () {
            controller.openContinueModal()
        });
        it('dont have any value and isDisruption true', function () {
            controller.isDisruption = true;
            controller.openContinueModal()
        });
        it('dont have any value and contactInfo === true and isDisruption true', function () {
            controller.contactInfo = true;
            controller.isDisruption = true;
            controller.openContinueModal()
        });
        it('dont have any value and contactInfo === true and isDisruption false', function () {
            controller.contactInfo = true;
            controller.isDisruption = false;
            controller.openContinueModal()
        });
        it('vm.voucherFlow && !vm.voucherEmailNotification  and contactInfo === true and isDisruption false', function () {
            controller.voucherFlow = true;
            controller.voucherEmailNotification = false;
            controller.contactInfo = true;
            controller.isDisruption = true;
            controller.openContinueModal()
        });
        it('vm.voucherFlow && !vm.voucherEmailNotification  and contactInfo === true and isDisruption false', function () {
            controller.voucherFlow = true;
            controller.voucherEmailNotification = false;
            controller.contactInfo = true;
            controller.isDisruption = false;
            controller.openContinueModal()
        });
    });

    describe('When closeFullModal is called', function () {
        it('execute function', function () {
            controller.closeFullModal()
        })
    });

});
