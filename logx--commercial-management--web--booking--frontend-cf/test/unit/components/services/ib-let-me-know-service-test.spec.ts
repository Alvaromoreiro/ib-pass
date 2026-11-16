import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
import angular from "angular";

describe('LetMeKnowService Test',  () => {

    let LetMeKnowService, rootScope, fakeRoute, fakeLocation;
    let fakeBookingAppConstants = {
        DEFAULT_ENDPOINTS: {
            SALEFORCE_CONTACT_ID: '${SERVICE_URI}/cmlm-lpm/rs/v1/availability/alert',
        },
    };
    let fakeBookingPromiseProxy = {
        post: jasmine.createSpy(),
    };
    let fakeBookingModalService = {
        showGenericDynamicModal: jasmine.createSpy(),
    };
    let fakeCommonsNewHttpUtilsErrorService = {
        controlError:jasmine.createSpy('controlError').and.callFake((error,reject)=> {
            reject();
        })
    };
    fakeRoute = {
        reload: ()=> {}
    }
    fakeLocation = {
        path: ()=> {}
    }

    beforeEach( () =>{
        angular.mock.module('ib-booking-services-module', 'LocalStorageModule',  ($provide) =>{
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('$route', fakeRoute);
            $provide.value('$location', fakeLocation);
            $provide.value('HttpServicesConstants', HttpServicesConstants);

        });
        inject( ($rootScope, _LetMeKnowService_) =>{
            LetMeKnowService = _LetMeKnowService_;
            rootScope = $rootScope;
        });
    });

    describe('when sendAlert is called',  () =>{
        beforeEach( () =>{
            fakeBookingModalService.showGenericDynamicModal = jasmine.createSpy('showGenericDynamicModal').and.returnValue({
                result : Promise.resolve()
            });
        });
        xit('and service reject with 412 error',  (done) =>{
            inject( () =>{
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake( () =>{
                    return Promise.reject({errorCode:412});
                });
            })
            const result = LetMeKnowService.sendAlert({})
                .then(()=> {
                    done.fail();
                })
                .catch((errorData)=> {
                     {
                        expect(fakeBookingModalService.showGenericDynamicModal).toHaveBeenCalled();
                        done();
                    }
                });
        });
        xit('and service reject with default error',  (done) =>{
            inject( () =>{
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake( () =>{
                    return Promise.reject({errorCode:400});
                });
            })
            const result = LetMeKnowService.sendAlert({})
                .then(()=> {
                    done.fail();
                })
                .catch((errorData)=> {
                     {
                        expect(fakeBookingModalService.showGenericDynamicModal).toHaveBeenCalled();
                        done();
                    }
                });
        });
        it('and service return 200',  (done) =>{
            inject( () =>{
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake( () =>{
                    return Promise.resolve('prueba');
                });
            });
            const result = LetMeKnowService.sendAlert({})
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
