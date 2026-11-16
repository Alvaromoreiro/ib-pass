describe('BookingModalService', function () {

    var rootScope, BookingModalService, uibmodal, BookingAppConstants, uibModalStack, isModalBlocked, result, $filter;
    var fakeModal = {
        result: {
            then: function (confirmCallback, cancelCallback) {
                this.confirmCallBack = confirmCallback;
                this.cancelCallback = cancelCallback;
            }
        },
        close: function (item) {
            this.result.confirmCallBack(item);
        },
        dismiss: function (type) {
            this.result.cancelCallback(type);
        }
    };

    var fakeCommonsModalService = {
        'open': jasmine.createSpy('open').and.callFake(function () {
            return 'open';
        })
    }

    beforeEach(function () {
        angular.mock.module('ui.bootstrap', 'ib-booking-modal-module', function ($provide) {
            $provide.value('BookingAppConstants', {});
            $provide.value('CommonsModalService', fakeCommonsModalService);
        });
        inject(function (_BookingModalService_, $uibModalStack, $uibModal, $rootScope, _BookingAppConstants_,_$filter_) {
            BookingAppConstants = _BookingAppConstants_;
            rootScope = $rootScope;
            uibmodal = $uibModal;
            uibModalStack = $uibModalStack;
            $filter = _$filter_;
            BookingModalService = _BookingModalService_;
        });
    });

    xdescribe('Show showLoginModal Modal', function () {
        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('should open iubmodal', function (done) {
            var template = 'test';
            var result = null;
            isModalBlocked = true;
            result = BookingModalService.showLoginModal(isModalBlocked, template);
            expect(result).toEqual('open');
            done();
            rootScope.$digest();
        })
    })

    describe('Show showFilterModal Modal', function () {
        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('should open iubmodal', function (done) {
            var template = 'test';
            var result = null;
            isModalBlocked = true;
            result = BookingModalService.showFilterModal(isModalBlocked, template);
            expect(result).toEqual('open');
            done();
            rootScope.$digest();
        })
    })

    describe('Show showLogin Error Modal ', function () {
        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('should open iubmodal', function (done) {
            isModalBlocked = false;
            result = BookingModalService.showLoginErrorModal({}, isModalBlocked);
            expect(result).toEqual('open');
            done();
            rootScope.$digest();
        })
    });

    describe('Show openInsurance Modal ', function () {
        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('should open iubmodal', function (done) {
            isModalBlocked = false;
            result = BookingModalService.openInsuranceModal({}, isModalBlocked);
            expect(result).toEqual('open');
            done();
            rootScope.$digest();
        })
    })
    describe('Show showGenericDynamicModal Modal', function () {
        beforeEach(inject(function () {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('should open iubmodal', function (done) {
            var template = 'test';
            var result = null;
            isModalBlocked = true;
            result = BookingModalService.showGenericDynamicModal(isModalBlocked, template);
            expect(result).toEqual('open');
            done();
            rootScope.$digest();
        })
    })

    describe('Use closeAllCurrentModals Modal', function () {
        beforeEach(inject(function () {
            spyOn(uibModalStack, 'close').and.returnValue(fakeModal);
        }));

        it('should close iubmodal', function (done) {
            var result = null;
            isModalBlocked = true;
            result = BookingModalService.closeAllCurrentModals();
            expect(result).toBeTrue;
            done();
            rootScope.$digest();
        })
        it('its defined', function (done) {
            expect(BookingModalService.closeAllCurrentModals).toBeDefined();
            done();
        });
    })

});
