import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { CurrencyServiceAsMapMock, availabilityRequestMock, getAvailavilityDataMock, commercialDataStoredMock, createReturnMock, returnObservationsWithhtmlModk, relatedContentMock, originDestinationsIndex1Mock } from "./mocks/transformGetAvailabilityData-mocks";

describe('BookingAvailabilityTransformer Test', () => {
    let SlicedAvailabilityDataTransformer;
    const fakeSessionStorage = new StorageServiceMock();
    const fakeCurrencyService = {
        getCurrenciesAsMap: jasmine.createSpy().and.callFake( () => CurrencyServiceAsMapMock )
    };
    const fakeBookingUtilService = {
        getRelatedContent: jasmine.createSpy().and.callFake( () => relatedContentMock )
    };
    const fakeDatalayerUtilsService = {
        generateDatalayerAvailability: jasmine.createSpy( 'generateDatalayerAvailability' ).and.callFake( () => {} )
    };
    const fakeIbBookingAvailabilityUtilsService = {
        returnObservationsWithhtml: jasmine.createSpy( 'returnObservationsWithhtml' ).and.callFake( () => returnObservationsWithhtmlModk )
    };
    const fakeIbOriginDestinationInfoService = {
        create: jasmine.createSpy( 'create' ).and.callFake( () => createReturnMock ),
        generateOfferParams: jasmine.createSpy(),
        generateOptionParams: jasmine.createSpy(),
    };
    const fakeDatalayerBKIService = {
        generateDigitalDataAvailability: jasmine.createSpy( 'generateDigitalDataAvailability' ).and.callFake( () => {} )
    };
    beforeEach( () => {
        angular.mock.module(
            'ib-booking-availability-module', ($provide) => {
                $provide.value( 'CommonsSessionStorageService', fakeSessionStorage );
                $provide.value( 'CurrencyService', fakeCurrencyService );
                $provide.value( 'BookingUtilService', fakeBookingUtilService );
                $provide.value( 'DatalayerUtilsService', fakeDatalayerUtilsService );
                $provide.value( 'IbBookingAvailabilityUtilsService', fakeIbBookingAvailabilityUtilsService );
                $provide.value( 'IbOriginDestinationInfoService', fakeIbOriginDestinationInfoService );
                $provide.value( 'DatalayerBKIService', fakeDatalayerBKIService );
            });
        inject(( _SlicedAvailabilityDataTransformer_ ) => {
            SlicedAvailabilityDataTransformer = _SlicedAvailabilityDataTransformer_;
            fakeSessionStorage.set('commercialData', commercialDataStoredMock);
        });
    });

    describe('When transformGetAvailabilityData is called', () => {
        it('should return the object correctly and set the availabilityRelatedContent and responseId sessionStorage values', () => {
            const transformedData = SlicedAvailabilityDataTransformer.transformGetAvailabilityData( getAvailavilityDataMock, availabilityRequestMock );
            const availabilityRelatedContent = fakeSessionStorage.get( 'availabilityRelatedContent' );
            const responseId = fakeSessionStorage.get( 'responseId' );
            expect( typeof transformedData ).toEqual( 'object' );
            expect( typeof availabilityRelatedContent ).toEqual( 'object' );
            expect( typeof responseId ).toEqual( 'string' );
            expect( responseId ).toEqual( 'Qm9va2luZ0BHVy0xNjk2NDI1NTQxNzk4LVNxZUpm' );
        });
        it('should control inbound cells if transformedData.originDestinations length > 1 and  return the object correctly', () => {
            const getAvailavilityData = getAvailavilityDataMock;
            getAvailavilityData.originDestinations.push(originDestinationsIndex1Mock);
            const transformedData = SlicedAvailabilityDataTransformer.transformGetAvailabilityData(getAvailavilityData, availabilityRequestMock);
            expect( typeof transformedData ).toEqual( 'object' );
        });
    });
});
