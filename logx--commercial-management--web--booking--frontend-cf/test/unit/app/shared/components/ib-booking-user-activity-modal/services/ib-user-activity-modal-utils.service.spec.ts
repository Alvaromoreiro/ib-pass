import { fakeAsync, TestBed } from '@angular/core/testing';
import { UserActivityModalUtilsService } from '@src/app/shared/components/ib-booking-user-activity-modal/services/ib-user-activity-modal-utils.service';
import { BookingModalServiceMock } from 'test/mocks/Services/BookingModalServiceMock';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { TranslateServiceMock } from 'test/mocks/Services/TranslateServiceAngularMock';
import { BookingRedirectionServiceMock, IbBookingRetrieveOrderServiceMock } from '../../../../../../mocks/class/KeepAliveUtilsMock';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { AJSRootScope } from 'ib-web-commons/utils';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { IbBookingRetrieveOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-retrieve-order.service';
import { WindowMock } from 'test/mocks/class/WindowMock';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { HeaderCompleteOriginDestinationModel } from '@src/app/core/models/ib-booking-availability/header-model';

class BookingUtilServiceMock {
    getURLFirstParameterByName = jasmine.createSpy( 'getURLFirstParameterByName' );
    checkExistNewAvailabilitySearch = jasmine.createSpy( 'checkExistNewAvailabilitySearch' ).and.returnValue('');
}
class IbBookingPassengerInfoUtilsServiceMock {
    deleteTemporalPNR = jasmine.createSpy('deleteTemporalPNR')
}
// @ts-ignore
interface ServiceTest extends UserActivityModalUtilsService { 
    rootScope: RootScopeMock,
    BookingModalService: BookingModalServiceMock,
    BookingUtilService: BookingUtilServiceMock,
    window: WindowMock,
    TranslateService: TranslateServiceMock,
    CommonsSessionStorageService: StorageServiceMock,
    IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsServiceMock,
    BookingRedirectionService: BookingRedirectionServiceMock,
    IbBookingRetrieveOrderService: IbBookingRetrieveOrderServiceMock
}

describe('UserActivityModalUtilsService Test', () => {
    let service: ServiceTest;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                UserActivityModalUtilsService,
                { provide: AJSRootScope, useClass: RootScopeMock },
                { provide: AJSBookingModalService, useClass: BookingModalServiceMock },
                { provide: AJSBookingUtilsService, useClass: BookingUtilServiceMock },
                { provide: WINDOW_TOKEN, useClass: WindowMock },
                { provide: TranslateService, useValue: new TranslateServiceMock() },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: IbBookingPassengerInfoUtilsService, useClass: IbBookingPassengerInfoUtilsServiceMock },
                { provide: BookingRedirectionService, useClass: BookingRedirectionServiceMock },
                { provide: IbBookingRetrieveOrderService, useClass: IbBookingRetrieveOrderServiceMock }
            ],
        });
        service = TestBed.inject( UserActivityModalUtilsService as unknown as any );
        service.CommonsSessionStorageService.clear();
    } );
    
    describe( 'When UserActivityModalUtilsService.controlFlow is called', () => {
        beforeEach( () => {
            service.CommonsSessionStorageService.remove( BkiStorageConstants.FLOW_APP );
        } );
        it( 'it should check keepAliceRefreshFlow as false and navigate', () => {
            service.controlFlow();
            expect( service.IbBookingPassengerInfoUtilsService.deleteTemporalPNR ).toHaveBeenCalled();
        } );
        it( 'it should check keepAliceRefreshFlow as true and isOnHold to call retrieveOrder', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.FLOW_APP, 'MMBOH' );
            service.CommonsSessionStorageService.set( BkiStorageConstants.PNR, 'ABCDE' );
            service.CommonsSessionStorageService.set( BkiStorageConstants.SURNAME, 'LORIAN' );
            service.rootScope.keepAliveRefreshFlow = true;
            service.controlFlow();
            expect( service.IbBookingRetrieveOrderService.retrieveOrder ).toHaveBeenCalled();
            service.IbBookingRetrieveOrderService.retrieveOrderResponse.finally( () => {
                const order = service.CommonsSessionStorageService.get( BkiStorageConstants.IMPORT_ORDER );
                expect( order ).toEqual( '' );
            } );
        } );
        it( 'it should check keepALiveRefreshFlow and call retrieve order with error case', fakeAsync(() => {
            service.rootScope.keepAliveRefreshFlow = true;
            service.CommonsSessionStorageService.set( BkiStorageConstants.FLOW_APP, 'MMBOH' );
            service.IbBookingRetrieveOrderService.retrieveOrderResponse = Promise.reject('error');
            service.controlFlow();
            service.IbBookingRetrieveOrderService.retrieveOrderResponse.finally( () => {
                expect( service.BookingModalService.finishWaiting ).toHaveBeenCalled();
                expect( service.BookingRedirectionService.path ).toHaveBeenCalledWith( '/ibbkerror' );
            } );
        }) );
        it( 'it should check keepAliceRefreshFlow as true and !isOnHold to call redirectUrl', () => {
            service.rootScope.keepAliveRefreshFlow = true;
            service.controlFlow();
            expect( service.BookingUtilService.checkExistNewAvailabilitySearch ).toHaveBeenCalled();
        } );
        it( 'it should check keepAliceRefreshFlow as true and !isOnHold to redirect shuttle', () => {
            service.rootScope.keepAliveRefreshFlow = true;
            service.rootScope.isShuttleFlow = true;
            service.controlFlow();
            expect( service.BookingUtilService.checkExistNewAvailabilitySearch ).toHaveBeenCalled();
        } );
        it( 'it should check keepAliceRefreshFlow as true and !isOnHold and reload', () => {
            service.rootScope.keepAliveRefreshFlow = true;
            service.window.location.href = 'http://localhost:9876/';
            service.window.location.origin = 'http://localhost:9876';
            service.controlFlow();
            expect( service.window.location.reload ).toHaveBeenCalled();
        } );
        it( 'it should check keepAliceRefreshFlow as true and !isOnHold to call redirectUrl as FlassOffer Flow', () => {
            service.window.location.href = `http://localhost:9876/?flashOffer=true&flashOfferId=ABC`;
            service.BookingUtilService.getURLFirstParameterByName = jasmine.createSpy( 'getURLFirstParameterByName' ).and.returnValue(true);
            service.rootScope.keepAliveRefreshFlow = true;
            service.controlFlow();
            expect( service.BookingUtilService.checkExistNewAvailabilitySearch ).not.toHaveBeenCalled();
        } );
    } );
    describe( 'When setTravelInfoPassAvail is called', () => {
        it( 'it should return the passengers list array with all passengers', () => {
            const travelInfo = { passengers: 6, numAdults: 1, numSeniors: 1, numYoung: 1, numTeenager: 1, numInfant: 1, numChilds: 1, numberPassengrsWithoutInfant: 5 } as HeaderCompleteOriginDestinationModel;
            const passengerList = service.setTravelInfoPassAvail( travelInfo );
            expect( Array.isArray( passengerList ) ).toEqual( true );
        } );
        it( 'it should return the passengers list array with only one passenger', () => {
            const travelInfo = { passengers: 1, numAdults: 1, numSeniors: 0, numYoung: 0, numTeenager: 0, numInfant: 0, numChilds: 0, numberPassengrsWithoutInfant: 1 } as HeaderCompleteOriginDestinationModel;
            const passengerList = service.setTravelInfoPassAvail( travelInfo );
            expect( Array.isArray( passengerList ) ).toEqual( true );
        } );
    });
} );