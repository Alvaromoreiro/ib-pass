import { PaymentViewType } from "@src/components/ib-MmB-payment/enums/ib-Mmb-payments-enum";

export class MmbPaymentsPageServiceMock {
    checkPaymentsViewType = jasmine.createSpy( 'checkPaymentsViewType' ).and.callFake(()=>PaymentViewType.EMPTY);
    callPaymentsViewTypeService = jasmine.createSpy( 'callPaymentsViewTypeService' );
}
