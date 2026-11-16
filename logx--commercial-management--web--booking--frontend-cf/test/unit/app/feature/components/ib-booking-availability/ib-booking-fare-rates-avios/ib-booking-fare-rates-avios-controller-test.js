describe('BookingFareRatesAviosController Test', function () {
    var scope, controller, q, fake;

    var mocks = function () {
        this.BookingModalService = {
            showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function () {
                var promise = q.defer();
                promise.resolve();
                return { result: promise.promise };
            })
        };
        this.CurrencyService = {
            formatPrice: jasmine.createSpy('formatPrice').and.returnValue('125.05'),
            getCurrencyObject: jasmine.createSpy('getCurrencyObject'),
            formatAvios: jasmine.createSpy('formatAvios').and.returnValue('5,000'),
        };
    }

    beforeEach(function () {
        fake = new mocks();
        angular.mock.module('ib-booking-fare-rates-avios-module', 'LocalStorageModule', function ($provide) {
            $provide.value('BookingModalService', fake.BookingModalService);
            $provide.value('CurrencyService', fake.CurrencyService);
        });

        inject(function ($controller, $rootScope, $q) {
            scope = $rootScope.$new();
            q = $q;

            controller = $controller('BookingFareRatesAviosController', {
                '$scope': scope
            });

            scope.$digest();
        });

    });

    describe('When selectAviosMoneyOption is called', function () {
        it(' When selectAviosMoneyOption is called', function (done) {
            var aviosMoneySelected;

            inject(function (localStorageService) {
                localStorageService.set('commercialData', {
                    currency: {}
                });
            });

            aviosMoneySelected = {
                fareCashPerPassenger: '25',
                fareAviosPerPassenger: '250',
                cash: {
                    fare: null
                },
                avios: {},
                redemptionOptionId: 2584
            };
            controller.totalPrice = {
                tax: null,
                price: {}
            };

            controller.selectAviosMoneyOption(aviosMoneySelected);
            expect(controller.totalPrice.fareCashPerPassenger).toEqual('25');
            expect(controller.totalPrice.fareAviosPerPassenger).toEqual('250');
            done();
        });
    });

    describe('When newAvailability is called', function () {
        it(' When newAvailability is called', function (done) {

            spyOn(scope, '$emit');

            controller.newAvailability();

            expect(scope.$emit).toHaveBeenCalledWith('recalculatePrice');
            done();
        });
    });

    describe('When openModalLinks is called', function () {
        it(' When openModalLinks is called', function (done) {

            controller.openModalLinks();

            expect(fake.BookingModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });

});