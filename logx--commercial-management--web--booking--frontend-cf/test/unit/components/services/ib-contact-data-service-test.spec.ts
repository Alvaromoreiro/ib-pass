describe('ibPlusContactDataService Test',  () => {

    var ibPlusContactDataService, rootScope;
    var fakeBookingAppConstants = {
        SALESFORCE_ENDPOINTS: {
            CONTACT_DETAILS_IBPLUS: '${SERVICE_URI}/prlm-mbm/rs/v2/members/contact_details',
        },
    };
    var fakeBookingSalesforceProxy = {
        get: jasmine.createSpy(),
        put: jasmine.createSpy(),
    };
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError:jasmine.createSpy('controlError').and.callFake((error,reject)=> {
            reject();
        })
    };

    beforeEach( () =>{
        angular.mock.module('ib-booking-services-module', 'LocalStorageModule',  ($provide) =>{
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseSalesforceProxy', fakeBookingSalesforceProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);

        });
        inject( ($rootScope, _ibPlusContactDataService_) =>{
            ibPlusContactDataService = _ibPlusContactDataService_;
            rootScope = $rootScope;
        });
    });

    describe('when getContactData is called',  () =>{
        it('and service reject',  (done) =>{
            inject( () =>{
                fakeBookingSalesforceProxy.get = jasmine.createSpy('get').and.callFake( () =>{
                    return Promise.reject();
                });
            })
            const result = ibPlusContactDataService.getContactData({})
                .then(()=> {
                    done.fail();
                })
                .catch((responseData)=> {
                     {
                        expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalled();
                        done();
                    }
                });
        });
        it('and service return 200',  (done) =>{
            inject( () =>{
                fakeBookingSalesforceProxy.get = jasmine.createSpy('get').and.callFake( () =>{
                    return Promise.resolve('prueba');
                });
            });
            const result = ibPlusContactDataService.getContactData({})
                .then((data)=> {
                    expect(data).toEqual('prueba');
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });
    })

    describe('when updateContactData is called',  () =>{
        it('and service reject',  (done) =>{
            inject( () =>{
                fakeBookingSalesforceProxy.put = jasmine.createSpy('put').and.callFake( () =>{
                    return Promise.reject();
                });
            })
            const result = ibPlusContactDataService.updateContactData({})
                .then(()=> {
                    done.fail();
                })
                .catch((responseData)=> {
                     {
                        expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalled();
                        done();
                    }
                });
        });
        it('and service return 200',  (done) =>{
            inject( () =>{
                fakeBookingSalesforceProxy.put = jasmine.createSpy('put').and.callFake( () =>{
                    return Promise.resolve('prueba');
                });
            });
            const result = ibPlusContactDataService.updateContactData({})
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
