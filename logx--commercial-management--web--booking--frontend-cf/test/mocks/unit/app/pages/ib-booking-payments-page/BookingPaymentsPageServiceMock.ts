import { PaymentViewType } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';

export class BookingPaymentsPageServiceMock {
    checkPaymentsViewType = jasmine.createSpy( 'checkPaymentsViewType' ).and.callFake(()=> Promise.resolve(PaymentViewType.EMPTY));
    callPaymentsViewTypeService = jasmine.createSpy( 'callPaymentsViewTypeService' );
}
