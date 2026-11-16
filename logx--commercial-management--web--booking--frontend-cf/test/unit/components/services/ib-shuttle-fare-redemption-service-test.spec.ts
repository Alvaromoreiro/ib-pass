import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import {StorageServiceMock} from '../../../mocks/Services/StorageServiceMock';
import * as angular from 'angular';
describe('ShuttleFareRedentionService Test',  () => {

    let ShuttleFareRedentionService, rootScope;
    let fakeBookingAppConstants = {
        DEFAULT_ENDPOINTS: {
            fareShuttleRedemptionServiceURI: '${SERVICE_URI}/sse-rpa/rs/v1/fare/shuttle',
        },
        LOGIN_ONB: 'ONB'
    };
    let fakeBookingPromiseProxy = {
        post: jasmine.createSpy(),
    };
    let fakeCommonsNewHttpUtilsErrorService = {
        controlError:jasmine.createSpy('controlError').and.callFake((error,reject)=> {
            reject();
        })
    };
    let fakeSessionStorage = new StorageServiceMock();

    beforeEach( () =>{
        angular.mock.module('ib-booking-services-module', 'LocalStorageModule',  ($provide) =>{
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('localStorageService', fakeSessionStorage);
            $provide.value('HttpServicesConstants', HttpServicesConstants);


        });
        inject( ($rootScope, _ShuttleFareRedentionService_) =>{
            ShuttleFareRedentionService = _ShuttleFareRedentionService_;
            rootScope = $rootScope;
        });
    });

    describe('when getShuttleFare is called',  () =>{
        beforeEach(()=>{
            fakeSessionStorage.set('userLogged','ONB');
        })
        it('and service reject with default error',  (done) =>{
            inject( () =>{
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake( () =>{
                    return Promise.reject();
                });
            })
            ShuttleFareRedentionService.getShuttleFare({})
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
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake( () =>{
                    return Promise.resolve({data:{responseId:'prueba',offers:[{accrualQuote:10}]}});
                });
            });
            rootScope.timeSession = {
                startTime: 0
            }
            ShuttleFareRedentionService.getShuttleFare({})
                .then(()=> {
                    expect(fakeSessionStorage.get('oBPoints')).toEqual(10);
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });
    })
});
