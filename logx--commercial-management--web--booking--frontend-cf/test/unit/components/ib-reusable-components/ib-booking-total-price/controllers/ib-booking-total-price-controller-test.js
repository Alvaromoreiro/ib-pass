describe('BookingTotalPriceController test', function () {

    var controller, localStorageService;
    var fakeModalTemplate = 'test.html';
    var fakeBookingModalService = {
        showGenericModal: jasmine.createSpy()
    };
    var bindings = {
        containerForm: {
            $submitted: 'test',
            $valid: true
        }
    };
    let fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function (label) {
            return label;
        };
        switch (filter) {
                case 'aviosFormaterFilter':
                    filterFunc = function (label) {
                        return label;
                    };
                    break;
                default:
                    break;
        }

        return filterFunc;
    });
    var controllerDependencies = {
        '$scope': {},
        'BookingModalService': fakeBookingModalService
    };
    var fakeBookingAppConstants = { 'LOGIN_ONB': 'ONB' };
    beforeEach(function () {
        angular.mock.module('ib-booking-total-price-module', 'LocalStorageModule', function ($provide) {
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('$filter', fakeFilter);
        });
        inject(function ($componentController, $rootScope, _localStorageService_, _$filter_) {
            localStorageService = _localStorageService_;
            controllerDependencies.$scope = $rootScope.$new();
            controller = $componentController('ibBookingTotalPrice', controllerDependencies, bindings);
            controllerDependencies.$scope.$apply();
            spyOn(controllerDependencies.$scope, '$emit');
        });
    });


    xdescribe('when openModalLinks is called', function () {
        it('should emit an event', function (done) {
            controller.openModalLinks(fakeModalTemplate);
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalled();
            done();
        });
    });

    describe('when sendPayEvent is called', function () {
        it('should submit and call $emit', function (done) {
            controller.sendPayEvent();
            expect(controller.containerForm.$submitted).toEqual(true);
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith('paymentSubmitted', controller.containerForm.$valid);
            done();
        });
    });

});
