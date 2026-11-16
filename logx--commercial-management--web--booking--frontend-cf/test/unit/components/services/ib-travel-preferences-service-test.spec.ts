describe('TravelPreferencesService Test',  () => {

    let TravelPreferencesService, rootScope;
    let fakeBookingAppConstants = {
        SALESFORCE_ENDPOINTS: {
            fareShuttleRedemptionServiceURI: '${SERVICE_URI}/cust-cust/rs/v1/travel_preferences',
        }
    };
    let fakeBookingPromiseSalesforceProxy = {
        put: jasmine.createSpy(),
        get: jasmine.createSpy(),
    };
    let fakeCommonsNewHttpUtilsErrorService = {
        controlError:jasmine.createSpy('controlError').and.callFake((error,reject)=> {
            reject();
        })
    };

    beforeEach( () =>{
        angular.mock.module('ib-booking-services-module', 'LocalStorageModule',  ($provide) =>{
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseSalesforceProxy', fakeBookingPromiseSalesforceProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);

        });
        inject( ($rootScope, _TravelPreferencesService_) =>{
            TravelPreferencesService = _TravelPreferencesService_;
            rootScope = $rootScope;
        });
    });

    describe('when getTravelPreferences is called',  () =>{
        beforeEach(()=>{
        })
        it('and service reject with default error',  (done) =>{
            inject( () =>{
                fakeBookingPromiseSalesforceProxy.get = jasmine.createSpy('get').and.callFake( () =>{
                    return Promise.reject();
                });
            })
            const result = TravelPreferencesService.getTravelPreferences()
                .then(()=> {
                    done.fail();
                })
                .catch((errorData)=> {
                     {
                        expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalled();
                        done();
                    }
                });
        });
        it('and service return 200',  (done) =>{
            inject( () =>{
                fakeBookingPromiseSalesforceProxy.get = jasmine.createSpy('get').and.callFake( () =>{
                    return Promise.resolve({data:'prueba'});
                });
            });
            rootScope.timeSession = {
                startTime: 0
            }
            const result = TravelPreferencesService.getTravelPreferences()
                .then((data)=> {
                    expect(data).toEqual('prueba');
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });
    })
    describe('when updateTravelPreferences is called',  () =>{
        beforeEach(()=>{
        })
        it('and service reject with default error',  (done) =>{
            inject( () =>{
                fakeBookingPromiseSalesforceProxy.put = jasmine.createSpy('put').and.callFake( () =>{
                    return Promise.reject();
                });
            })
            const result = TravelPreferencesService.updateTravelPreferences()
                .then(()=> {
                    done.fail();
                })
                .catch((errorData)=> {
                     {
                        expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalled();
                        done();
                    }
                });
        });
        it('and service return 200',  (done) =>{
            inject( () =>{
                fakeBookingPromiseSalesforceProxy.put = jasmine.createSpy('put').and.callFake( () =>{
                    return Promise.resolve({data:'prueba'});
                });
            });
            rootScope.timeSession = {
                startTime: 0
            }
            const result = TravelPreferencesService.updateTravelPreferences()
                .then((data)=> {
                    expect(data).toEqual('prueba');
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });
    })
});
