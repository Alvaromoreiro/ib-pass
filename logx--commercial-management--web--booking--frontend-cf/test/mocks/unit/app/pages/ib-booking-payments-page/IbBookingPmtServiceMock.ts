import { SummaryDefaultMock } from './SummaryComponentPropsMock';
export class IbBookingPmtServiceMock {
    checkOnHoldForTitle = jasmine.createSpy( 'checkOnHoldForTitle' ).and.callFake( () => 'PAYMENTS_PAGE_TITLE' );
    getSummaryInfo = jasmine.createSpy( 'getSummaryInfo' ).and.callFake( () => SummaryDefaultMock );
    getPriceFormatted = jasmine.createSpy( 'getPriceFormatted' ).and.callFake( () => '10€' );
    showTaxesModal = jasmine.createSpy( 'showTaxesModal' );
    setSummaryOthers = jasmine.createSpy( 'setSummaryOthers' );
    setTimeOnHoldProps = jasmine.createSpy( 'setTimeOnHoldProps' );
    getMultipleOnHoldOptions = jasmine.createSpy( 'getMultipleOnHoldOptions' );
    redirectedPaymentTypeAction = jasmine.createSpy( 'redirectedPaymentTypeAction' );
    deleteUnpaidItemsFromBasket = jasmine.createSpy( 'deleteUnpaidItemsFromBasket' );
    setLoadingBasketState = jasmine.createSpy( 'setLoadingBasketState' );
    setIssueOrderInfo = jasmine.createSpy( 'setIssueOrderInfo' );
    checkAndUpdateOrderTotalPrice = jasmine.createSpy( 'checkAndUpdateOrderTotalPrice' );
    setSummaryDCCInfo = jasmine.createSpy( 'setSummaryDCCInfo' );
    updateStepsStorage = jasmine.createSpy( 'updateStepsStorage' );
    getConfirmationPageQuadrigam = jasmine.createSpy( 'getConfirmationPageQuadrigam' ).and.callFake( () => 'BKI_CONFIRMATION_NEW' );
}
