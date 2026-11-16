import { KeepAliveServiceMock, BookingIgnoreOrderServiceMock } from '@test-mocks/class/KeepAliveUtilsMock';
import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { KeepAliveConstants } from '@src/app/core/constants/ib-keep-alive-constants';
import { UserActivityUtilsService } from '@src/app/core/services/ib-booking-user-activity-utils.service';
import { KeepAliveService } from '@src/app/shared/http-services/sse-avm/ib-keep-alive.service';
import { IgnoreOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-ignore-order.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCModalServiceMock } from '@test-mocks/class/IbCModalServiceMock';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';


// @ts-ignore
interface ServiceTest extends UserActivityUtilsService { 
    IgnoreOrderService: BookingIgnoreOrderServiceMock;
    CommonsSessionStorageService: StorageServiceMock;
    KeepAliveService: KeepAliveServiceMock;
    IbCModalService: IbCModalServiceMock;
}

const createOrder = { order: { orderId: 'ABCD' }, flowId: 'EFGH' };

describe('UserActivityUtilsService Test', () => {
    let service: ServiceTest;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: IgnoreOrderService, useClass: BookingIgnoreOrderServiceMock },
                { provide: KeepAliveService, useClass: KeepAliveServiceMock },
                { provide: IbCModalService, useClass: IbCModalServiceMock }
            ]
        });
        service = TestBed.inject(UserActivityUtilsService as unknown as any );
    });
    describe( 'When callKeepAliveService is called', () => {
        it( 'it should go throw avm', fakeAsync(() => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.RESPONSE_ID, 'IJKL' );
            service.callKeepAliveService();
            flushMicrotasks();
            expect( service.KeepAliveService.keepAliveAvm ).toHaveBeenCalled();
        } ) );
        it( 'it should go throw orm with orderId', fakeAsync( () => {
            const order = { order: { orderId: 'ABCD' } };
            service.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, order );
            service.CommonsSessionStorageService.set( BkiStorageConstants.RESPONSE_ID, 'IJKL' );
            service.callKeepAliveService();
            flushMicrotasks();
            expect( service.KeepAliveService.keepAliveOrm ).toHaveBeenCalled();
        } ) );
        it( 'it should go throw orm with flowId', fakeAsync(() => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, createOrder );
            service.CommonsSessionStorageService.set( BkiStorageConstants.RESPONSE_ID, 'IJKL' );
            service.callKeepAliveService();
            flushMicrotasks();
            expect( service.KeepAliveService.keepAliveOrm ).toHaveBeenCalled();
        } ) );
    } );
    describe( 'When checkOrderToIgnore is called', () => {
        it( 'should check orderId and call ignoreOrder', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, createOrder );
            service.checkOrderToIgnore();
            expect( service.IgnoreOrderService.ignoreOrder ).toHaveBeenCalled();
        } );
        it( 'should check orderId and not to call ignoreOrder', () => {
            service.checkOrderToIgnore();
            expect( service.IgnoreOrderService.ignoreOrder ).not.toHaveBeenCalled();
        } );
    } );
    describe( 'When showSessionModal is called', () => {
        it( 'should call showGenericComponent from IbCModalService', () => {
            service.showSessionModal();
            expect( service.IbCModalService.showGenericComponentModal ).toHaveBeenCalled();
        } );
    });
    describe( 'When setKeepAliveNextCall is called', () => {
        it( 'should set sessionStorage NEXT_KEEP_ALIVE_CALL', () => {
            service.setKeepAliveNextCall();
            const data = service.CommonsSessionStorageService.get( BkiStorageConstants.NEXT_KEEP_ALIVE_CALL );
            expect( data ).not.toEqual( null );
        } );
    } );
    describe( 'When getNextKeepAliveCall is called', () => {
        it( 'should check stored time as false and return DEFAULT_SESSION_TIME', () => {
            const time = service.getNextKeepAliveCall();
            expect( time ).toEqual( KeepAliveConstants.DEFAULT_SESSION_TIME );
        } );
        it( 'should check stored time as stored and return number != DEFAULT_SESSION_TIME', () => {
            const storedTime = new Date().getMilliseconds() + ( 12 * 60 * 1000 );
            service.CommonsSessionStorageService.set( BkiStorageConstants.NEXT_KEEP_ALIVE_CALL, storedTime );
            const time = service.getNextKeepAliveCall();
            expect( time ).not.toEqual( KeepAliveConstants.DEFAULT_SESSION_TIME );
        } );
    } );

    describe( 'When clearKeepAliveNextCall is called', () => {
        it( 'should remove sessionStorage NEXT_KEEP_ALIVE_CALL', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.NEXT_KEEP_ALIVE_CALL, 123456 );
            service.clearKeepAliveNextCall();
            const data = service.CommonsSessionStorageService.get( BkiStorageConstants.NEXT_KEEP_ALIVE_CALL );
            expect( data ).toEqual( null );
        });
    });
});
