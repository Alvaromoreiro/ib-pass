import { Inject, Injectable } from '@angular/core';
import { IgnoreOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-ignore-order.service';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { CreateOrderService } from '../../../shared/http-services/sse-orm/ib-booking-create-order.service';
import { CreateOrderRequestData, OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { AJSBookingAvailabilityTransformer } from '@src/app/shared/services/ib-booking-availability/transformers/ajs-upgrade/ib-booking-availability-transformer-bridge.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { IbBookingPassengerOrderWarningsService } from '../ib-booking-passenger-order-warnings.service';
@Injectable({providedIn: 'root'})
export class PassengerControlOrderService {
    
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CreateOrderService: CreateOrderService,
        private IgnoreOrderService: IgnoreOrderService,
        private IbBookingPassengerOrderWarningsService: IbBookingPassengerOrderWarningsService,
        private IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsService,
        @Inject( AJSBookingAvailabilityTransformer ) private BookingAvailabilityTransformer,
        @Inject( AJSBookingUtilsService ) private BookingUtilService
    ) { }
    
    public controlOrder = ( requestData: CreateOrderRequestData, onHold ): Promise<OrderData> | Promise<unknown> => {
        return this.checkOrderToIgnore()
            .catch( () => { } )
            .then( () => {
                return this.createOrder( requestData, onHold );
            } )
            .then( ( createOrderData ) => {
                const headerModelBackup = this.CommonsSessionStorageService.get( BkiStorageConstants.HEADER_MODEL );
                this.CommonsSessionStorageService.set( BkiStorageConstants.HEADER_MODEL_BACKUP, headerModelBackup );
                return createOrderData;
            });
    };
    
    public checkOrderToIgnore = (): Promise<any> => {
        const createOrder: any = this.CommonsSessionStorageService.get( BkiStorageConstants.CREATE_ORDER_DATA );
        const orderId: string = createOrder?.order?.orderId ?? null;
        if ( orderId ) {
            return this.IgnoreOrderService.ignoreOrder( orderId )
                .finally( () => {
                    this.IbBookingPassengerInfoUtilsService.deleteTemporalPNR();
                    this.CommonsSessionStorageService.remove( BkiStorageConstants.PNR );

                });
        }
        return Promise.resolve();
    };
    
    public createOrder = ( requestData: CreateOrderRequestData, onHold ): Promise<OrderData> => {
        return this.CreateOrderService.createOrderCall( requestData ).then( async ( orderData: OrderData ) => {
            this.CommonsSessionStorageService.set( BkiStorageConstants.ONHOLD_ORDER, onHold );
            this.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, orderData );
            this.checkFlightAviosStorage();
            this.CommonsSessionStorageService.set( BkiStorageConstants.FLOW_ID, orderData.order.orderId );
            this.CommonsSessionStorageService.set( BkiStorageConstants.PASSENGERS_FLOW_STEPS_DATA, this.BookingUtilService.getNumberTypePas() );
            await this.IbBookingPassengerOrderWarningsService.manageWarnings( orderData.warnings );
            return orderData;
        } );
    };
    
    private checkFlightAviosStorage = () => {
        const flightAviosInfoStorage: any = this.CommonsSessionStorageService.get( BkiStorageConstants.FLIGHT_AVIOS_INFO );
        if ( !flightAviosInfoStorage ) return;
        const orderStorage = this.CommonsSessionStorageService.get( BkiStorageConstants.CREATE_ORDER_DATA );
        flightAviosInfoStorage.passengers = this.BookingAvailabilityTransformer.updateFlightAviosInfoWithFF( orderStorage, flightAviosInfoStorage );
        this.CommonsSessionStorageService.set( BkiStorageConstants.FLIGHT_AVIOS_INFO, flightAviosInfoStorage );
    };
    
}
downgradeToAJSService('PassengerControlOrderService', PassengerControlOrderService, 'ib-booking-passenger-info-module', []);
