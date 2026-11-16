import { IbBookingAvailabilityPageUtilsService } from "@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-page-utils-service";
import { BookingAppConstants } from "@src/app/core/constants/ib-booking-constants"
import angular from "angular";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { DigitalDataServiceMock } from 'test/mocks/class/DigitalDataServiceMock';
import { DataLayerServiceMock } from 'test/mocks/class/DataLayerServiceMock';
const BkiAvailabilityConstants =  require('../../../../../mocks/constants/BookingAvailabilityConstants-mock.json')

class BookingAvailabilityServiceMock {
    public callInitBooking = jasmine.createSpy('callInitBooking').and.callFake(() => Promise.resolve());
}
class BookingModalServiceMock {
    public showWaitingModal = jasmine.createSpy('showWaitingModal');
    public finishWaiting = jasmine.createSpy('finishWaiting');
}
class BookingRedirectionServiceMock {
    public redirectToLoginPage = jasmine.createSpy('redirectToLoginPage');
    public path = jasmine.createSpy('path');
}
class BookingUtilServiceMock {
    public getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName')
}
class NewMainHeaderFacadeMock {
    public updateHeaderModel = jasmine.createSpy('updateHeaderModel');
}

class BookingComponentUtilsMock {
    public equalHeight = jasmine.createSpy('equalHeight').and.returnValue('true');
}



describe('Test IbBookingAvailabilityPageUtilsService', () => {
    const BKIConstants = BookingAppConstants;
    let rootscope;
    let service: IbBookingAvailabilityPageUtilsService;
    let fakeWindow = {
        location: {
            href: 'href',
            origin: 'origin'
        }
    };
    const fakeTimeout = (callback) => {
        callback();
    }
    let fakeBookingAvailabilityService: BookingAvailabilityServiceMock;
    let fakeBookingModalService: BookingModalServiceMock;
    let fakeBookingRedirectionService: BookingRedirectionServiceMock;
    let fakeSessionStorage: StorageServiceMock;
    let fakeBookingUtilService: BookingUtilServiceMock;
    let fakeNewMainHeeaderFacade: NewMainHeaderFacadeMock;
    let BookingComponentUtils: BookingComponentUtilsMock
    let fakeDigitalDataService = new DigitalDataServiceMock();
    let fakeDataLayerService = new DataLayerServiceMock();

    beforeEach(() => {
        fakeBookingAvailabilityService = new BookingAvailabilityServiceMock();
        fakeBookingModalService = new BookingModalServiceMock();
        fakeBookingRedirectionService = new BookingRedirectionServiceMock();
        fakeSessionStorage = new StorageServiceMock();
        fakeBookingUtilService = new BookingUtilServiceMock();
        fakeNewMainHeeaderFacade = new NewMainHeaderFacadeMock();
        BookingComponentUtils = new BookingComponentUtilsMock();


        angular.mock.module('ib-booking-availability-module', ($provide) => {
            $provide.value('BookingAvailabilityConstants', BkiAvailabilityConstants);
            $provide.value('BookingAvailabilityService', fakeBookingAvailabilityService);
            $provide.value('$timeout', fakeTimeout);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('$window', fakeWindow);
            $provide.value('BookingRedirectionService', fakeBookingRedirectionService);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('BookingAppConstants', BKIConstants);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeeaderFacade);
            $provide.value('BookingComponentUtils', BookingComponentUtils);
            $provide.value('DigitalDataService', fakeDigitalDataService);
            $provide.value('DataLayerService', fakeDataLayerService);
        })
        inject(($rootScope, IbBookingAvailabilityPageUtilsService) => {
            rootscope = $rootScope;
            service = IbBookingAvailabilityPageUtilsService;
        });
    });

    describe('initBookingFlow test ', () => {
        beforeEach(() => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.returnValue(null);
         });
        it('Test positive case', (done) => {

            service.initBookingFlow().then(() => {
                expect(fakeBookingModalService.showWaitingModal).toHaveBeenCalled();
                done();
            }, done.fail);
        });
        it('Test error case', (done) => {
            fakeBookingAvailabilityService.callInitBooking = jasmine.createSpy('callInitBooking').and.returnValue(Promise.reject('error'));
            service.initBookingFlow().then(() => {
                done.fail()
            }, () => {
                expect(fakeBookingModalService.finishWaiting).toHaveBeenCalled();
                expect(fakeBookingRedirectionService.path).toHaveBeenCalledWith('/ibbkerror')
                expect(fakeSessionStorage.get('availabilityErrror')).toEqual('error')
                done();
            });
        });
        it('test flash offer case', (done) => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.returnValue('test');
            fakeBookingModalService.showWaitingModal.calls.reset();
            service.initBookingFlow().then(() => {
                expect(fakeBookingModalService.showWaitingModal).not.toHaveBeenCalled()
                done();
            }, done.fail)
        })
    });
    describe('getPaymentRedirectionInfo', () => {
        it('test payment status ok', () => {
            fakeBookingUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((arg) => {
                if (arg === 'paymentStatus') {
                    return 'OK'
                }
                if (arg === 'componentType') {
                    return true
                }

                return arg
            })
            fakeSessionStorage.set('paySucces', true);
            fakeSessionStorage.set('redirectionPaymentCallback', {status: true, redirectStatus: true})
            expect(service.getPaymentRedirectionInfo()).toEqual({
                paymentStatus: 'OK',
                componentType: true,
                redirectionPaymentCallback: {status: true, redirectStatus: true},
                redirectStatus: true,
                paypalToken:'token',
                paypalPayerId: 'PayerID',
                paySucces:true
            })
        })
    });
    describe('Test checkPaymentRedirect', () => {
        beforeEach(() => {
            fakeWindow.location.href = 'href';
            fakeWindow.location.origin = 'origin'
        });
        it('Must redirect to origin', () => {
            const result = service.checkPaymentRedirect();
            // expect($location.path).toHaveBeenCalledWith('origin');
            expect(result).toBe(false);
        });
    });
    describe('Test checkLoadLegacy', () => {
        beforeEach(() => {
            fakeSessionStorage.clear();
            fakeSessionStorage.set( 'userLogged', false );
        });
        it('Test when is flashOffer the result must be true', () => {
            fakeSessionStorage.set('flashOffer', 'test');
            expect(service.checkLoadLegacy()).toBe(true);
        })
        it('Test when is not flashOffer and is not availability search the result must be true', () => {
            fakeSessionStorage.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH)
            expect(service.checkLoadLegacy()).toBe(true);
        })
        it('Test when is not flashOffer and is availability search One Way the result must be false', () => {
            fakeSessionStorage.set('bookingUrlParams', {tripType: '1'})
            fakeSessionStorage.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY)
            expect(service.checkLoadLegacy()).toBe(false);
        })
        it('Test when is not flashOffer and is availability search One Way the result must be true', () => {
            fakeSessionStorage.set('bookingUrlParams', {tripType: '2'})
            fakeSessionStorage.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY)
            expect(service.checkLoadLegacy()).toBe(false);
        })

    })



})
