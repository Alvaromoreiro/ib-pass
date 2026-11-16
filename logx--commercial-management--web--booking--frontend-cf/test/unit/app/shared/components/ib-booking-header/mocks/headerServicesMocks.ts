import { customerDataMock } from 'test/unit/app/services/ib-booking-availability/call-commercial-mocks/call-commercial-mocks';

const headerTransformerReturn = require( './HeaderTransformer-initHeaderReturn.json' );
const greyBarTransformerReturn = require( './GreyBarTransformer-initGreyBarReturn.json' );
const StepsTransformerReturn = require( './StepsTransformer-initStepsReturn.json' );
const UpdateDiscountsReturn = require( './HeaderTransformer-UpdateDiscountsReturn.json' );
const DeleteDiscountsReturn = require( './HeaderTransformer-DeleteDiscountsReturn.json' );
export class IbBookingHeaderTransformerServiceMock {
    initHeader = jasmine.createSpy( 'initHeader' ).and.callFake( () => headerTransformerReturn );
    addSteps = jasmine.createSpy( 'addSteps' ).and.callFake( () => { } );
    updateBasketDiscountsNew = jasmine.createSpy( 'updateBasketDiscountsNew' ).and.callFake( () => UpdateDiscountsReturn );
    addDiscountToBasket = jasmine.createSpy( 'addDiscountToBasket' ).and.callFake( () => UpdateDiscountsReturn );
    deleteDiscountFromBasket = jasmine.createSpy( 'deleteDiscountFromBasket' ).and.callFake( () => DeleteDiscountsReturn );
    updateBasketDiscounts = jasmine.createSpy( 'updateBasketDiscounts' ).and.callFake( () => UpdateDiscountsReturn );
    deleteAssistCardFromBasket = jasmine.createSpy( 'deleteAssistCardFromBasket' ).and.callFake( () => DeleteDiscountsReturn );
}
export class BookingHeaderGreyBarTransformerServiceMock {
    initGreyBar = jasmine.createSpy( 'initGreyBar' ).and.callFake( () => greyBarTransformerReturn );
    updateLoggedData = jasmine.createSpy( 'updateLoggedData' ).and.callFake( () => {
        return {
            name: customerDataMock.personalInfo.name,
            surname: customerDataMock.personalInfo.surname1,
            lastname: null,
            avios: customerDataMock.generalInfo.avios,
            isLogged: true
        };
    } );
}
export class BookingHeaderStepsTransformerServiceMock {
    initSteps = jasmine.createSpy( 'initSteps' ).and.callFake( () => StepsTransformerReturn );
}
export class ShoppingBasketViewModelServiceMock {
    updateOthersFee = jasmine.createSpy( 'updateOthersFee' ).and.callFake( () => { } );
    updateFlexibilization = jasmine.createSpy( 'updateFlexibilization' ).and.callFake( () => { } );
    updateUpgrading = jasmine.createSpy( 'updateUpgrading' ).and.callFake( () => { } );
    updatePendingPaymentItems = jasmine.createSpy( 'updatePendingPaymentItems' ).and.callFake( () => { } );
    updateBasketPriority = jasmine.createSpy( 'updateBasketPriority' ).and.callFake( () => { } );
}
