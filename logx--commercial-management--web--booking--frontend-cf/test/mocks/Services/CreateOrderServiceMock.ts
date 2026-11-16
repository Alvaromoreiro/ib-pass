import { OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';

export class CreateOrderServiceMock {
    public getResponse = { order: { orderId: 'ABCDEFG' } } as OrderData;
    createOrderCall = jasmine.createSpy('createOrderCall').and.callFake( () => Promise.resolve( this.getResponse as OrderData ) );
}