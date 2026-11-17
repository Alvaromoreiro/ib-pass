describe('BookingNameModalController', function () {
    'use strict';

    var $controller;
    var $q;
    var $rootScope;
    var vm;
    var deferred;
    var bookingNameModel;
    var modalInstance;
    var localStorageService;
    var getBookingNameService;
    var searchFlightsPassengersService;
    var ckiDatalayerUtilsService;
    var modalService;
    var modalObject;

    beforeEach(angular.mock.module('ib-booking-name'));

    beforeEach(inject(function (_$controller_, _$q_, _$rootScope_) {
        $controller = _$controller_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    function createController(options) {
        options = options || {};

        deferred = $q.defer();

        bookingNameModel = {
            name: options.name || 'John'
        };

        modalObject = options.object || {
            surname: 'Smith',
            flowId: 'FLOW-123'
        };

        modalInstance = jasmine.createSpyObj('$uibModalInstance', ['dismiss']);

        localStorageService = jasmine.createSpyObj('localStorageService', ['set', 'get']);
        localStorageService.get.and.returnValue('PNR-001');

        getBookingNameService = jasmine.createSpyObj('GetBookingNameService', ['getBooking']);
        getBookingNameService.getBooking.and.returnValue(deferred.promise);

        searchFlightsPassengersService = jasmine.createSpyObj(
            'SearchFlightsPassengersService',
            ['deepLinkChecked']
        );

        ckiDatalayerUtilsService = jasmine.createSpyObj(
            'CkiDatalayerUtilsService',
            ['updatePnr']
        );

        modalService = jasmine.createSpyObj('ModalService', [
            'isWaiting',
            'isCloseWaiting'
        ]);

        vm = $controller('BookingNameModalController', {
            $uibModalInstance: modalInstance,
            localStorageService: localStorageService,
            GetBookingNameService: getBookingNameService,
            BookingNameModel: bookingNameModel,
            SearchFlightsPassengersService: searchFlightsPassengersService,
            object: modalObject,
            CkiDatalayerUtilsService: ckiDatalayerUtilsService,
            ModalService: modalService
        });

        vm.form = options.form || {
            $valid: true,
            $submitted: false
        };
    }

    function expectBookingNotRequested() {
        expect(vm.form.$submitted).toBe(true);
        expect(modalService.isWaiting).not.toHaveBeenCalled();
        expect(getBookingNameService.getBooking).not.toHaveBeenCalled();
    }

    describe('accept', function () {
        it('should submit the form and request the booking when the form is valid', function () {
            createController();

            vm.accept();

            expect(vm.form.$submitted).toBe(true);
            expect(modalService.isWaiting).toHaveBeenCalled();
            expect(getBookingNameService.getBooking).toHaveBeenCalledWith(
                'John',
                'Smith',
                'FLOW-123'
            );
        });

        [
            {
                description: 'the form is invalid',
                options: {
                    form: {
                        $valid: false,
                        $submitted: false
                    }
                }
            },
            {
                description: 'flowId is missing',
                options: {
                    object: {
                        surname: 'Smith',
                        flowId: ''
                    }
                }
            }
        ].forEach(function (scenario) {
            it('should not request the booking when ' + scenario.description, function () {
                createController(scenario.options);

                vm.accept();

                expectBookingNotRequested();
            });
        });

        it('should handle a successful booking request', function () {
            var bookingData = {
                checkinId: 'CHECKIN-123',
                bookingReference: 'ABC123'
            };

            createController();

            vm.accept();

            deferred.resolve(bookingData);
            $rootScope.$digest();

            expect(localStorageService.set).toHaveBeenCalledWith('bookingInfo', bookingData);
            expect(localStorageService.set).toHaveBeenCalledWith('flowId', 'CHECKIN-123');
            // expect(ckiDatalayerUtilsService.updatePnr).toHaveBeenCalledWith({
            //     provider: '',
            //     reference: 'PNR-001'
            // });
            expect(searchFlightsPassengersService.deepLinkChecked).toHaveBeenCalledWith(bookingData);
            expect(bookingNameModel.name).toBe('');
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
            expect(modalService.isCloseWaiting).toHaveBeenCalled();
        });

        it('should show the error message when the booking request fails', function () {
            createController();

            vm.accept();

            deferred.reject({
                message: 'Booking was not found'
            });
            $rootScope.$digest();

            expect(vm.errorMessage).toBe('Booking was not found');
            expect(modalInstance.dismiss).not.toHaveBeenCalled();
            expect(modalService.isCloseWaiting).toHaveBeenCalled();
        });
    });

    describe('close', function () {
        it('should clear the booking name and dismiss the modal', function () {
            createController({
                name: 'Jane'
            });

            vm.close();

            expect(bookingNameModel.name).toBe('');
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
    });
});
