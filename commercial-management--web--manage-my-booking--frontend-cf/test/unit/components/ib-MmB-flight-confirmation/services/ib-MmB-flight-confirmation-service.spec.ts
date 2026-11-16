describe('FlightConfirmationService Test', () =>{

    var rootScope, flightConfirmationService, localStorageService;
    var fakeFlightConfirmationTransformer = {
        'transformConfirmationView': jasmine.createSpy(),
        'generateChangeOrderRequest': jasmine.createSpy('generateChangeOrderRequest').and.callFake(() =>{
            return 'changeOrder'
        })
    };
    var fakeChangeOrderSliceService = { 'changeOrderSlice': jasmine.createSpy() };
    var fakeCloseSessionService = { 'closeSession': jasmine.createSpy() };

    beforeEach(() =>{
        angular.mock.module('LocalStorageModule', 'ib-MmB-flight-confirmation-module', ($provide) => {
            $provide.value('FlightConfirmationTransformer', fakeFlightConfirmationTransformer);
            $provide.value('ChangeOrderSliceService', fakeChangeOrderSliceService);
            $provide.value('CommonsKeepAliveService', fakeCloseSessionService);
        });
        inject(($rootScope, _FlightConfirmationService_, _localStorageService_) => {
            flightConfirmationService = _FlightConfirmationService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
    });


    describe('When getConfirmationInfo() is called', () =>{
        it('and resolve promise , should be returned transformConfirmationView', (done) =>{
            inject(($q) => {
                fakeFlightConfirmationTransformer.transformConfirmationView = jasmine.createSpy('transformConfirmationView').and.callFake(() =>{
                    var deferred = $q.defer();
                    deferred.resolve('transformedView');
                    return deferred.promise;
                });
            });
            flightConfirmationService.getConfirmationInfo().then(function (returnedInfo) {
                expect(returnedInfo).toEqual('transformedView')
                done();
            })
            rootScope.$digest();
        });
    });

    describe('When confirmChangeFlight() is called', () =>{

        it('and have bookingInfo,flowId and selectedSegment in localStorage, should resolve the promise of changeOrderSlice and closeSession and return its data', (done) =>{
            localStorageService.set('bookingInfo', { order: { 'orderId': '1' } });
            localStorageService.set('selectedSegment', { 'sliceId': '1' });
            localStorageService.set('flowId', '1');

            inject(($q) =>{
                fakeChangeOrderSliceService.changeOrderSlice = jasmine.createSpy('changeOrderSlice').and.callFake(() =>{
                    var deferred = $q.defer();
                    deferred.resolve('resolved');
                    return deferred.promise;
                });

                fakeCloseSessionService.closeSession = jasmine.createSpy('closeSession').and.callFake(function (data) {
                    var deferred = $q.defer();
                    deferred.resolve(data);
                    return deferred.promise;
                });
            });
            flightConfirmationService.confirmChangeFlight().then(function (returnedInfo) {
                expect(returnedInfo).toEqual('resolved')
                localStorageService.clearAll();
                done();
            })
            rootScope.$digest();
        });

        it('and have bookingInfo,flowId and selectedSegment in localStorage, reject promise changeOrderSlice  ', (done) =>{
            localStorageService.set('bookingInfo', { order: { 'orderId': '1' } });
            localStorageService.set('selectedSegment', { 'sliceId': '1' });
            localStorageService.set('flowId', '1');
            inject(($q) =>{
                fakeChangeOrderSliceService.changeOrderSlice = jasmine.createSpy('changeOrderSlice').and.callFake(() =>{
                    var deferred = $q.defer();
                    deferred.reject('error');
                    return deferred.promise;
                });
            });
            flightConfirmationService.confirmChangeFlight().then(angular.noop, function (returnedInfo) {
                expect(returnedInfo).toEqual('error');
                localStorageService.clearAll();
                done();
            })
            rootScope.$digest();
        });
    });


});