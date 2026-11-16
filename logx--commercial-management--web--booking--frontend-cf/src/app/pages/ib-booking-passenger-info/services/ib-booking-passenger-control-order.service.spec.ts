import { fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { PassengerControlOrderService } from '@src/app/pages/ib-booking-passenger-info/services/ib-booking-passenger-control-order.service';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { CreateOrderServiceMock } from '@test-mocks/Services/CreateOrderServiceMock';
import { IgnoreOrderServiceMock } from '@test-mocks/Services/IgnoreOrderServiceMock';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { AJSBookingAvailabilityTransformer } from '@src/app/shared/services/ib-booking-availability/transformers/ajs-upgrade/ib-booking-availability-transformer-bridge.service';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils/';
import { CreateOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-create-order.service';
import { IgnoreOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-ignore-order.service';
import { CreateOrderRequestData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { IbBookingPassengerOrderWarningsService } from '@src/app/pages/ib-booking-passenger-info/ib-booking-passenger-order-warnings.service';

class BookingUtilsServiceMock {
    getNumberTypePas = jasmine.createSpy( 'getNumberTypePas' ).and.returnValue( '12345' );
}
class IbBookingPassengerInfoUtilsServiceMock {
    deleteTemporalPNR = jasmine.createSpy( 'deleteTemporalPNR' );
}
class BookingAvailabilityTransformerMock {
    updateFlightAviosInfoWithFF = jasmine.createSpy( 'updateFlightAviosInfoWithFF' ).and.returnValue( { passengers: [ 'ADULT_01' ] } );
}
const createError = {
    errorCode: 410,
    internalErrorCode: 'SSE_ORM_9122',
    message: 'There has been a system error. Please try again and, if the issue persists, please contact us.',
    needsTranslate: false,
    requestURL: 'https://int-ibisservices.iberia.com/api/sse-orm/rs/v2/order'
};
// @ts-ignore
interface ServiceTest extends PassengerControlOrderService { 
    CommonsSessionStorageService: StorageServiceMock;
    CreateOrderService: CreateOrderServiceMock;
    IgnoreOrderService: IgnoreOrderServiceMock;
    IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsServiceMock;
    BookingAvailabilityTransformer: BookingAvailabilityTransformerMock;
    BookingUtilService: BookingUtilsServiceMock;
}

describe('PassengerControlOrderService Test', () => {
    let service: ServiceTest;
    let fakeCommonsSessionStorageService;
    let fakeCreateOrderService;
    let fakeIgnoreOrderService;
    let fakeIbBookingPassengerInfoUtilsService;
    let fakeBookingAvailabilityTransformer;
    let fakeBookingUtilsService;
    beforeEach(async () => {
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeCreateOrderService = new CreateOrderServiceMock();
        fakeIgnoreOrderService = new IgnoreOrderServiceMock();
        fakeIbBookingPassengerInfoUtilsService = new IbBookingPassengerInfoUtilsServiceMock();
        fakeBookingAvailabilityTransformer = new BookingAvailabilityTransformerMock();
        fakeBookingUtilsService = new BookingUtilsServiceMock();
        TestBed.configureTestingModule({
            providers: [
                PassengerControlOrderService,
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: CreateOrderService, useValue: fakeCreateOrderService },
                { provide: IgnoreOrderService, useValue: fakeIgnoreOrderService },
                { provide: IbBookingPassengerInfoUtilsService, useValue: fakeIbBookingPassengerInfoUtilsService },
                { provide: AJSBookingAvailabilityTransformer, useValue: fakeBookingAvailabilityTransformer },
                { provide: AJSBookingUtilsService, useValue: fakeBookingUtilsService },
                { provide: IbBookingPassengerOrderWarningsService, useValue: { manageWarnings: jasmine.createSpy( 'manageWarnings' ) } }
            ]
        });
        service = TestBed.inject(PassengerControlOrderService) as unknown as any;
    } );
    describe( 'When controlOrder is called', () => {
        beforeEach( () => {
            service.CommonsSessionStorageService.clear();
        } );
        it( 'It should create order with no ignore order', fakeAsync( () => {
            const result = service.controlOrder( {} as CreateOrderRequestData, false );
            flushMicrotasks();
            result.then( ( data ) => {
                expect( data.order.orderId ).toEqual( 'ABCDEFG' );
            } );
        } ) );
        it( 'It should go throw error on create order', fakeAsync( () => {
            service.CreateOrderService.createOrderCall = jasmine.createSpy( 'createOrderCall' ).and.callFake( () => Promise.reject( createError ) );
            spyOn( service, 'createOrder' ).and.callFake( () => Promise.reject( createError ) );
            let error;
            service.controlOrder( {} as CreateOrderRequestData, false )
                .then( () => {} )
                .catch( ( err ) => error = err );
            tick();
            flushMicrotasks();
            expect( error ).toEqual( createError);
        } ) );
        it( 'It should create order with ignore order reject', fakeAsync( () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, { order: { orderId: '123456' } } );
            service.IgnoreOrderService.ignoreOrder = jasmine.createSpy( 'ignoreOrder' ).and.callFake( () => Promise.reject() );
            const result = service.controlOrder( {} as CreateOrderRequestData, false );
            flushMicrotasks();
            result.then( ( data ) => {
                expect( data.order.orderId ).toEqual( 'ABCDEFG' );
                expect( service.IgnoreOrderService.ignoreOrder ).toHaveBeenCalled();
            } );
        } ) );
        it( 'It should go throw ignore order and avios storage', fakeAsync( () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, { order: { orderId: '123456' } } );
            service.CommonsSessionStorageService.set( BkiStorageConstants.FLIGHT_AVIOS_INFO, { passengers: [] } );
            const result = service.controlOrder( {} as CreateOrderRequestData, true );
            flushMicrotasks();
            result.then( ( data ) => {
                const onHold = service.CommonsSessionStorageService.get( BkiStorageConstants.ONHOLD_ORDER );
                expect( data.order.orderId ).toEqual( 'ABCDEFG' );
                expect( onHold ).toEqual( true );
                expect( service.IgnoreOrderService.ignoreOrder ).toHaveBeenCalled();
                expect( service.IbBookingPassengerInfoUtilsService.deleteTemporalPNR ).toHaveBeenCalled();
                expect( service.BookingAvailabilityTransformer.updateFlightAviosInfoWithFF ).toHaveBeenCalled();
            } );
        } ) );
    } );
    
});
