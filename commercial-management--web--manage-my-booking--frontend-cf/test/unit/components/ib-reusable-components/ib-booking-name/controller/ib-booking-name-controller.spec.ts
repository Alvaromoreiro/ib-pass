describe('BookingNameModalController', () => {

    let $uibModalInstance, GetBookingNameService, object, BookingSearchService, MmBModalService, fakeMmBModalService, $q;
    $uibModalInstance = {
        close: jasmine.createSpy('uibModalInstance.close'),
        dismiss: jasmine.createSpy('uibModalInstance.dismiss')
    };

    fakeMmBModalService={

    };
    let fakeGetBookingNameService = {
        'getBooking':jasmine.createSpy('getBooking').and.callFake(() => { })

    };
    let fakeBookingSearchService = {
        'retrieveOrderComplete': jasmine.createSpy(),
    };
    let fakeObject = {
        surname:'Doe',
        flowId: 1234
    }
    let fakeModel = {
        name:'',
        surname:'',
        flowId:''
    }
    beforeEach(() => {
        angular.mock.module('ib-booking-name', 'LocalStorageModule', ($provide) => {
            $provide.value('GetBookingNameService', fakeGetBookingNameService);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('object', fakeObject);

        });

    });

    describe('test for BookingNameModalController', () => {

        let BookingNameModalController;
        let $controller;
        let $rootScope;
        let $scope;
        let $injector;

        beforeEach(() => {
            inject((_$controller_, _$injector_, _MmBModalService_) => {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce((clone, key) => {
                    clone[key] = _$injector_[key];
                    return clone
                }, {});
                $q = $injector.get('$q');
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                GetBookingNameService = $injector.get('GetBookingNameService');
                object = $injector.get('object');
                BookingSearchService = $injector.get('BookingSearchService');
                MmBModalService = $injector.get('MmBModalService');
                BookingNameModalController = $controller('BookingNameModalController', {
                    $scope: $scope,
                    $rootScope: $rootScope, GetBookingNameService: GetBookingNameService, object: object, $uibModalInstance: $uibModalInstance,  BookingSearchService: BookingSearchService,MmBModalService:MmBModalService
                });
                BookingNameModalController.model = fakeModel;
                $scope.modalCtrl = {
                    form: {
                        '$valid': true,
                        '$submitted':true
                    }
                };
            });

        });

        describe('vm.accept', () => {
            it('should call GetBookingNameService.getBooking Success and close the modal if the form is valid', (done) => {
                // Set up test data
                let name = 'John';
                let surname = 'Doe';
                let flowId = 1234;
                let bookingInfo = {
                    flowId: 5678
                };

                // Spy on the getBooking method of the GetBookingNameService service
                spyOn(GetBookingNameService, 'getBooking').and.returnValue({
                    then: (callback) => {
                        callback(bookingInfo);
                    }
                });

                // Spy on the retrieveOrderComplete method of the BookingSearchService service
                spyOn(BookingSearchService, 'retrieveOrderComplete');

                // Set up the model
                BookingNameModalController.model.name = name;
                BookingNameModalController.model.surname = surname;
                BookingNameModalController.model.flowId = flowId;

                BookingNameModalController.accept();

                expect(GetBookingNameService.getBooking).toHaveBeenCalledWith(name, surname, flowId);

                expect(BookingSearchService.retrieveOrderComplete).toHaveBeenCalledWith(bookingInfo, BookingNameModalController.bookingName);

                expect($uibModalInstance.dismiss).toHaveBeenCalledWith('cancel');
                done();
            });
            it('should call GetBookingNameService.getBooking reject and close the modal if the form is valid', (done) => {
                inject(() => {
                    let mockError = {
                        errorCode: 408,
                        message: 'Error 408'
                    }

                    fakeGetBookingNameService.getBooking = jasmine.createSpy('getBookingjasmine').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject(mockError);
                        return deferred.promise;
                    })
                });

                BookingNameModalController.accept();
                $rootScope.$digest();
                expect(BookingNameModalController.errorMessage).toEqual('Error 408');
                done();
            });
        });
    });

})
