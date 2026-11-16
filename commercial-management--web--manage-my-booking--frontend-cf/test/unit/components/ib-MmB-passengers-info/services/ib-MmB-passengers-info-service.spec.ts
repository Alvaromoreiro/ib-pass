describe('PassengersInfoService test', () => {

    var PassengersInfoService, localStorageService, rootScope;

    var fakeChangeOrderContactInfoService = {
        changeOrderContactInfo: jasmine.createSpy()
    }

    var fakePassengersInfoTransformer = {
        transformPassengerInfoData: jasmine.createSpy(),
        updatePassengerData: jasmine.createSpy(),
        transformUpdatePassengerInfoData: jasmine.createSpy(),
        transformUpdateDataContactData: jasmine.createSpy()
    }


    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-passengers-info-module', ($provide) => {
            $provide.value('ChangeOrderContactInfoService', fakeChangeOrderContactInfoService);
            $provide.value('PassengersInfoTransformer', fakePassengersInfoTransformer);
        });
        inject(($rootScope, _localStorageService_, _PassengersInfoService_) => {
            localStorageService = _localStorageService_;
            PassengersInfoService = _PassengersInfoService_;
            rootScope = $rootScope;
        });
    });


    describe('when updateDataPassenger is called', () => {
        var qService;

        beforeEach(inject(($q) => {
            qService = $q;
            fakePassengersInfoTransformer.transformUpdatePassengerInfoData = jasmine.createSpy('transformUpdatePassengerInfoData').and.callFake((pasInfoInput) => {
                return pasInfoInput;
            });
        }));

        xit('and changeOrderContactInfo resolve promise then the promise should be resolved and the resolved data must be equals to changeOrderContactInfo resolved data', function (done) {
            var pasInfo = 'transformUpdatePassengerInfoData';
            fakeChangeOrderContactInfoService.changeOrderContactInfo = jasmine.createSpy('changeOrderContactInfo').and.callFake((pasInfoInput) => {
                var defer = qService.defer();
                defer.resolve(pasInfoInput);
                return defer.promise;
            });
            localStorageService.set('bookingInfo', { 'order': {} });
            PassengersInfoService.updateDataPassenger(pasInfo).then((resolvedData) => {
                expect(resolvedData).toEqual(pasInfo);
                localStorageService.remove('bookingInfo');
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and changeOrderContactInfo reject promise then the promise should be rejected and the rejected data must be equals to changeOrderContactInfo rejected data', function (done) {
            var errorInfo = 'error';
            fakeChangeOrderContactInfoService.changeOrderContactInfo = jasmine.createSpy('changeOrderContactInfo').and.callFake(() => {
                var defer = qService.defer();
                defer.reject(errorInfo);
                return defer.promise;
            });
            localStorageService.set('bookingInfo', { 'order': {} });
            PassengersInfoService.updateDataPassenger('').then(angular.noop, (errorData) => {
                expect(errorData).toEqual(errorInfo);
                localStorageService.remove('bookingInfo');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when updateDataContactInfo is called', () => {
        var qService;

        beforeEach(inject(($q) => {
            qService = $q;
            fakePassengersInfoTransformer.transformUpdateDataContactData = jasmine.createSpy('transformUpdateDataContactData').and.callFake((pasInfoInput) => {
                return pasInfoInput;
            });
        }));

        it('and changeOrderContactInfo resolve promise then the promise should be resolved and the resolved data must be equals to changeOrderContactInfo resolved data', function (done) {
            var pasInfo = 'transformUpdatePassengerInfoData';
            fakeChangeOrderContactInfoService.changeOrderContactInfo = jasmine.createSpy('changeOrderContactInfo').and.callFake((pasInfoInput) => {
                var defer = qService.defer();
                defer.resolve(pasInfoInput);
                return defer.promise;
            });
            localStorageService.set('bookingInfo', { 'order': {} });
            PassengersInfoService.updateDataContactInfo(pasInfo).then((resolvedData) => {
                expect(resolvedData).toEqual(pasInfo);
                localStorageService.remove('bookingInfo');
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and changeOrderContactInfo reject promise then the promise should be rejected and the rejected data must be equals to changeOrderContactInfo rejected data', function (done) {
            var errorInfo = 'error';
            fakeChangeOrderContactInfoService.changeOrderContactInfo = jasmine.createSpy('changeOrderContactInfo').and.callFake(() => {
                var defer = qService.defer();
                defer.reject(errorInfo);
                return defer.promise;
            });
            localStorageService.set('bookingInfo', { 'order': {} });
            PassengersInfoService.updateDataContactInfo('').then(angular.noop, (errorData) => {
                expect(errorData).toEqual(errorInfo);
                localStorageService.remove('bookingInfo');
                done();
            });
            rootScope.$digest();
        });
    });


    describe('when generatePassengerData is called', () => {
        it('and transformPassengerInfoData return data', (done) => {
            var mockResponse = 'hola';
            fakePassengersInfoTransformer.transformPassengerInfoData = jasmine.createSpy('transformPassengerInfoData').and.callFake(() => {
                return mockResponse;
            });
            expect(PassengersInfoService.generatePassengerData()).toEqual(mockResponse);
            done();
            rootScope.$digest();
        });
    });

    describe('when updateLocalPassengers is called', () => {
        it('and updatePassengerData is called', (done) => {
            PassengersInfoService.updateLocalPassengers({});
            fakePassengersInfoTransformer.updatePassengerData = jasmine.createSpy('updatePassengerData').and.callFake(() => {
                expect(fakePassengersInfoTransformer.updatePassengerData).toHaveBeenCalled();
            });
            done();
        });
    });
});