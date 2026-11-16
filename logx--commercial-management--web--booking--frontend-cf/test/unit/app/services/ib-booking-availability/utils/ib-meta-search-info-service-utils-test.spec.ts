import angular from "angular";
import { CurrencyServiceMock } from "test/mocks/Services/CurrencyServiceMocks";
import { sliceExample, fareFamilyConditionsExample, offersExample, recommendedOfferId, sliceCorpDisExample, fareFamilyConditionsCorpDisExample, offersCorpDisExample, offerIdCorpDis } from "./mocks/ib-metasearch-utils-service-mocks";
import { IbMetaSearchInfoServiceUtils } from "@shared/services/ib-booking-availability/ib-meta-search-info-service-utils";


describe('IbMetaSearchInfoServiceUtils Test', function () {
    let currencyService: CurrencyServiceMock;
    let service: IbMetaSearchInfoServiceUtils;
    const sliceConst: AvailabilityTransformerModel.Slice = JSON.parse(JSON.stringify(sliceExample));
    const sliceCorpDisConst: AvailabilityTransformerModel.Slice = JSON.parse(JSON.stringify(sliceCorpDisExample));
    const ffCConst: AvailabilityTransformerModel.FareFamilyCondition[] = JSON.parse(JSON.stringify(fareFamilyConditionsExample));
    const ffCorpDiscCConst: AvailabilityTransformerModel.FareFamilyCondition[] = JSON.parse(JSON.stringify(fareFamilyConditionsCorpDisExample));
    const offersConst = JSON.parse(JSON.stringify(offersExample));
    const offersCorpDisConst = JSON.parse(JSON.stringify(offersCorpDisExample));


    beforeEach(() => {
        // Init mocks
        currencyService = new CurrencyServiceMock();
        // Init module
        angular.mock.module('ib-booking-availability-module', ($provide) => {
            $provide.value('CurrencyService', currencyService);
        });
        inject((_IbMetaSearchInfoServiceUtils_) => {
            service = _IbMetaSearchInfoServiceUtils_;
        })
    })

    describe('Test generateInfoCabin', () => {
        it( 'Test with recommendedOfferID and get initial configuration', () => {
            const result = service.generateInfoCabin( recommendedOfferId, sliceConst, offersConst as AvailabilityTransformerModel.Offer[], ffCConst, currencyService.currencyObjExample, 0 );
            for ( const key in result.cabin ) {
                const cabin = result.cabin[ key ];
                for ( const ff of cabin.fareFamilies as AvailabilityTransformerModel.FareFamilyCondition[] ) {
                    if ( ff.offers.some( offer => offer.offerId === recommendedOfferId ) ) {
                        expect( ff.hasRecommendedOffer ).toBe( true );
                        expect( result.cabinTypeAssigned ).toEqual( ff.cabinType );
                    }
                    //Test not repeated fares
                    const matchFares = [ ...Object.values( result.cabin ) ].map( ( cab: any ) => cab.fareFamilies ).flat().filter( ( fareaux ) => fareaux.commercialCode == ff.commercialCode );
                    expect( matchFares.length ).toBe( 1 );
                }
            }
        } );
        it( 'Test with corporate campaign specialDiscountsApplied on response', () => {
            const result = service.generateInfoCabin( offerIdCorpDis, sliceCorpDisConst, offersCorpDisConst as AvailabilityTransformerModel.Offer[], ffCorpDiscCConst, currencyService.currencyObjExample, 0 );
            result.cabin[ result.cabinTypeAssigned ].fareFamilies.forEach( fF => {
                expect( fF.includedPriceDiscount ).toBeDefined();
                expect( typeof fF.includedPriceDiscount ).toBe('boolean');
            } );
        } );

    });
    describe('Test getCompatibleCabinsWithFare', () => {
        it('Test cabins filtered according to selected fare ', () => {
            const transformedCabins = service.generateInfoCabin(recommendedOfferId, sliceConst, offersConst as AvailabilityTransformerModel.Offer[], ffCConst, currencyService.currencyObjExample, 1);
            const selectedFare = fareFamilyConditionsExample[2];
            selectedFare.offers = offersConst.filter((offer: AvailabilityTransformerModel.Offer) => offer.slices[0].segments[0].cabin.fareFamily === selectedFare.commercialCode);
            const result = service.getCompatibleCabinsWithFare(selectedFare, transformedCabins.cabin, 1);
            let hasSelectedFareOrigin = true;
            [...Object.values(result)].map((data) => data.fareFamilies).flat().some((fare) => {
                hasSelectedFareOrigin = hasSelectedFareOrigin && fare.offers.some((offer) => {
                    return offer.slices[0].segments[0].cabin.fareFamily === selectedFare.commercialCode;
                })

            });
            expect(hasSelectedFareOrigin).toBe(true);
        } );
        it( 'Test if returns includedPriceDiscount property with corporate campaign specialDiscountsApplied', () => {
            const transformedCabins = service.generateInfoCabin( offerIdCorpDis, sliceCorpDisConst, offersCorpDisConst as AvailabilityTransformerModel.Offer[], ffCorpDiscCConst, currencyService.currencyObjExample, 0 );
            const selectedFare = fareFamilyConditionsCorpDisExample[ 2 ];
            selectedFare.offers = offersCorpDisConst.filter((offer: AvailabilityTransformerModel.Offer) => offer.slices[0].segments[0].cabin.fareFamily === selectedFare.commercialCode);
            const result = service.getCompatibleCabinsWithFare( selectedFare, transformedCabins.cabin, 0 );
            result[ selectedFare.cabinType ].fareFamilies.forEach( fF => {
                expect( fF.includedPriceDiscount ).toBeDefined();
                expect( typeof fF.includedPriceDiscount ).toBe('boolean');
            } );
        } );

    });
});
