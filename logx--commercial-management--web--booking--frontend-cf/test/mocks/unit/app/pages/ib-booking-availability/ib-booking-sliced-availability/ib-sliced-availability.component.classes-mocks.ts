const { eqSlicesMock, phonesListMock } = require('./ib-booking-sliced-availability-component-mocks.json');
// import { getInboundAvailabilityGridMock, getOutboudAvailabilityGridMock } from './ib-sliced-availibility.component.responses-mocks';
import { of } from 'rxjs';
const outboudAvailabilityGridMock = require( './ib-booking-sliced-availability-outbound-response-mock.json' );
const inboundAvailabilityGridMock = require( './ib-booking-sliced-availability-inbound-response-mock.json' );
const ribbonAvailabilityMock = require( './ib-booking-sliced-availability-ribbon-response-mock.json' );
export class BookingModalServiceMock {
    showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {});
    finishWaiting = jasmine.createSpy('finishWaiting');
    showWaitingModal = jasmine.createSpy('showWaitingModal');
}
export class NewMainHeaderFacadeTokenMock {
    initHeader = jasmine.createSpy('initHeader').and.callFake(() => {});
    finishWaiting = jasmine.createSpy( 'finishWaiting' );
    updateTripsBasketFromDispo = jasmine.createSpy( 'updateTripsBasketFromDispo' );
    deleteDiscountFromBasket = jasmine.createSpy( 'deleteDiscountFromBasket' );
    deleteTripsBasketFromDispo = jasmine.createSpy( 'deleteTripsBasketFromDispo' );
    updateBasketDiscountsNew = jasmine.createSpy('updateBasketDiscountsNew');
    updateStepDescription = jasmine.createSpy('updateStepDescription');
    updateStepsModel = jasmine.createSpy( 'updateStepsModel' );
    checkAdaptativeMobileFlow = jasmine.createSpy( 'checkAdaptativeMobileFlow' ).and.callFake( () => false );
}
export class RootScopeMock {
    newFare = false;
    phonesList = phonesListMock;
    showHeaders = false;
    isMobile = {
        general: true
    };
    public $on = ( eventName: string, callback: () => void ) => { };
}
export class CurrencyServiceMock {
    getCurrencyObject = jasmine.createSpy('getCurrencyObject');
    formatPrice = jasmine.createSpy( 'formatPrice' ).and.callFake( () => '' );
}
export class DatalayerUtilsServiceMock {
    updateDiscountData = jasmine.createSpy( 'updateDiscountData' );
    removeDatalayerObjects = jasmine.createSpy( 'removeDatalayerObjects' );
    removeDigitalDataObjects = jasmine.createSpy( 'removeDigitalDataObjects' );
    updateDatalayerWithQuadrigam = jasmine.createSpy( 'updateDatalayerWithQuadrigam' );
    updateDigitalDataWithQuadrigam = jasmine.createSpy( 'updateDigitalDataWithQuadrigam' );
    sendDatalayerEvent = jasmine.createSpy( 'sendDatalayerEvent' );
    updateDatalayerViewEvent = jasmine.createSpy( 'updateDatalayerViewEvent' );
}
export class DatalayerBKIServiceMock {
    getDigitalDataEcommerce = jasmine.createSpy('getDigitalDataEcommerce');
}
export class MonetateUtilsServiceMock {
    updateMonetateWithQuadrigam = jasmine.createSpy('updateMonetateWithQuadrigam');
    addFlightSearchMonetate = jasmine.createSpy('addFlightSearchMonetate');
    updateMonetateInfo = jasmine.createSpy('updateMonetateInfo');
}
export class FakeWindowMock {
    public scrollTo = ( x: number, y: number ) => { };
    public resize = ( event: Event ) => { };
}
export class BookingSlicedAvailabilityServiceMock {
    equalFareHeights = jasmine.createSpy( 'equalFareHeights' );
    updateParametersWithDiscounts = jasmine.createSpy( 'updateParametersWithDiscounts' );
    getOutboudAvailabilityGrid = jasmine.createSpy( 'getOutboudAvailabilityGrid' ).and.callFake( () => of( outboudAvailabilityGridMock ) );
    setStoredReleatedContent = jasmine.createSpy( 'setStoredReleatedContent' );
    getInboundAvailabilityGrid = jasmine.createSpy( 'getInboundAvailabilityGrid' ).and.callFake(() => of( inboundAvailabilityGridMock ));
    getRibbonAvailability= jasmine.createSpy('getRibbonAvailability').and.callFake(()=> of( ribbonAvailabilityMock ));
    getEquivalentSlices = jasmine.createSpy( 'getEquivalentSlices' ).and.callFake( () => eqSlicesMock );
    nextSliceDate = jasmine.createSpy( 'nextSliceDate' );
    storeSelectedSliceData = jasmine.createSpy( 'storeSelectedSliceData' );
    checkSelectedSliceTimeLeft = jasmine.createSpy( 'checkSelectedSliceTimeLeft' ).and.callFake(() => Promise.resolve());
    openFareWindowModal = jasmine.createSpy( 'openFareWindowModal' );
    setSlicedRequestFareInfo = jasmine.createSpy( 'setSlicedRequestFareInfo' );
    updateBookingAvailabilityDates = jasmine.createSpy( 'updateBookingAvailabilityDates' );
    updateHeaderDates = jasmine.createSpy( 'updateHeaderDates' );
    isUserLogged = jasmine.createSpy('isUserLogged');
    checkPartnerDiscountSelection = jasmine.createSpy('checkPartnerDiscountSelection');
    getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.returnValue({ partnerIdentifier: 'SAN' });
    filterDatalayerSliceResults = jasmine.createSpy('filterDatalayerSliceResults').and.callFake((data) => data);
    filterDigitalDataSliceResults= jasmine.createSpy('filterDigitalDataSliceResults').and.callFake((data)=> data);
    getMobileTotalPriceLiterals = jasmine.createSpy('getMobileTotalPriceLiterals').and.returnValue({ priceTitle: 'TOTAL_PRICE_COMPONENT_TITLE', continueText: 'TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY_MOBILE' });
    getTotalDesktopContinueText = jasmine.createSpy('getTotalDesktopContinueText').and.returnValue('TOTAL_PRICE_CONTINUE_FLOW_AVAILABILITY_DESKTOP');
}

export class BookingLocalDiscountsServiceMock {
    isResidentAvailable = jasmine.createSpy( 'isResidentAvailable' );
}

export class GetDestinationsServiceMock {
    getDestinationAreasCitiesList = jasmine.createSpy( 'getDestinationAreasCitiesList' );
}

export class IbOriginDestinationInfoUtilsServiceMock {
    getSlidesData = jasmine.createSpy( 'getSlidesData' );
}

export class AJSSlicedAvailabilityDataTransformerMock {
    transformRibbonData = jasmine.createSpy( 'transformRibbonData' );
}

export class RibbonDataTransformerMock {
    transformSlicedRibbonState = jasmine.createSpy( 'transformSlicedRibbonState' ).and.returnValue({
        slidesData: { slides: [], currentInitialSlide: 0, selectedSlide: 0, currentSlides: [] },
        originCalendarInfo: []
    });
}

export class IbAvailabilityRibbonServiceMock {
    getRibbonAvailability = jasmine.createSpy('getRibbonAvailability').and.callFake(() => of({}));
}
