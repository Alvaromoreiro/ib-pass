describe('IbItinerarySendService Test', function () {

    let rootScope, ibItinerarySendService;

    const mockResponse = { data: 'promesa' };
    const fakeitinerarySendServiceProxy = { 'postGeneric': jasmine.createSpy() };
    const fakeMmBAppConstants = { itinerarySend: '/sse-orm/rs/v6/itinerary/send' };
    const fakeMmBUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeitinerarySendServiceProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeMmBUtilsErrorService);
        });

        inject(function ($rootScope, _IbItinerarySendService_) {
            ibItinerarySendService = _IbItinerarySendService_;
            rootScope = $rootScope;
        });
    });

    describe('When itinerarySendServiceInfo() is called', () => {
        it('and resolve promise , should be returned data', (done) => {
            inject(function ($q) {
                fakeitinerarySendServiceProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            ibItinerarySendService.itinerarySendServiceInfo().then((returnedInfo) => {
                expect(returnedInfo).toEqual(mockResponse.data);
                done();
            })
            rootScope.$digest();
        });
    });

    describe('When changeOrderSlice() reject promise', function () {
        it('with 400 errorCode', function () {
            let mockError = {
                "errors": [
                    {
                        "code": "FRAM_B0006",
                        "reason": "UNEXPECTED_TECHNICAL_EXCEPTION",
                        "uuid": null,
                        "timeStamp": "2023-10-16 09:05"
                    }
                ]
            }; 
            inject(function ($q) {
                fakeitinerarySendServiceProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });

            ibItinerarySendService.itinerarySendServiceInfo().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(400);
                expect(responseData.data).toEqual(mockError);
            });
            rootScope.$digest();
        });
    });
});
