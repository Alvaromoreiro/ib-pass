import { off } from 'process';

@Service('ib-booking-availability-module',
    [
        'CurrencyService',
        'BookingAvailabilityConstants'
    ] )
export class IbMetaSearchInfoServiceUtils {
    constructor (
        private CurrencyService: CurrencyService,
        private BookingAvailabilityConstants: any
    ) {
    }

    generateInfoCabin = (
        offerId: string,
        slice: AvailabilityTransformerModel.Slice,
        offers: AvailabilityTransformerModel.Offer[],
        fareFamily: AvailabilityTransformerModel.FareFamilyCondition[],
        currency: AvailabilityTransformerModel.Currency,
        sliceIndex: number
    ): AvailabilityTransformerModel.GenerateInfoCabinResponse => {
        let cabins: AvailabilityTransformerModel.CabinsByFareFamilies = {};
        const selectFare: AvailabilityTransformerModel.FareFamilyCondition[] = [...this.getFaresFamilyInfo(offerId, offers, fareFamily, sliceIndex)];
        const currencyObject = this.CurrencyService.getCurrencyObject(currency);
        const remainingSeats = slice?.segments[0]?.cabin?.remainingSeats;
        let cabinSelected = selectFare[0].cabinType;
        selectFare.forEach((fare, index) => {
            const fareOffers = offers.filter((offer: AvailabilityTransformerModel.Offer) => offer.slices[sliceIndex].segments[0].cabin.fareFamily === fare.commercialCode).sort((offerA, offerB) => offerA.price.total - offerB.price.total);
            const sliceFarePrice = fareOffers[0].slices[sliceIndex].price;
            fare.fareCurrency = currency.code;
            fare.fareDiscountPriceShown = null;
            fare.fareDiscountPriceToCalculate = null;
            fare.farePrice = fareOffers[0].price.total;
            fare.farePriceShown = this.CurrencyService.formatPrice(currencyObject, sliceFarePrice.total, false, true);
            fare.farePriceToCalculate = sliceFarePrice.total;
            fare.isCompatibleFare = false;
            fare.remainingSeats = remainingSeats;
            fare.offers = fareOffers;
            const cabinAux = cabins[fare.cabinType] ?? {};
            if (cabinAux && cabinAux.fareFamilies) {
                cabinAux.fareFamilies.push(fare);
            } else {
                cabinAux.bestCabinsPrice = true;
                cabinAux.bestPrice = fare.farePriceToCalculate;
                cabinAux.bestPriceShown= this.CurrencyService.formatPrice(currencyObject, fare.farePriceToCalculate, false, true);
                cabinAux.cabinAvailable = true;
                cabinAux.cabinDescription = fare.cabinDescription;
                cabinAux.isCabinCompatible = true;
                cabinAux.fareFamilies = [fare];
            }
            cabins[fare.cabinType] = cabinAux;
        });
        return {
            cabin: cabins,
            cabinTypeAssigned: cabinSelected
        };
    };

    private getFaresFamilyInfo = (
        recommendedOfferId: string,
        offers: AvailabilityTransformerModel.Offer[],
        fareFamiliesCond: AvailabilityTransformerModel.FareFamilyCondition[],
        sliceIndex: number
    ): AvailabilityTransformerModel.FareFamilyCondition[] => {
        const faresMap = new Map<string, AvailabilityTransformerModel.FareFamilyCondition>();
        offers.forEach((offer) => {
            // cual es la más barata?
            const fareFamily = offer.slices[sliceIndex].segments[0].cabin.fareFamily;
            const fareFamilyInfo = faresMap.get(fareFamily) ?? { ...fareFamiliesCond.find((fare) => fare.commercialCode === fareFamily) };
            if (Array.isArray(fareFamilyInfo.offers) && offer.slices[sliceIndex].segments[0].cabin.fareFamily === fareFamily) {
                if (offer.offerId === recommendedOfferId && !fareFamilyInfo.hasRecommendedOffer) {
                    // a editar
                    fareFamilyInfo.hasRecommendedOffer = true;
                }
                fareFamilyInfo.offers.push(offer);
            } else if (offer.slices[sliceIndex].segments[0].cabin.fareFamily === fareFamily) {
                if (offer.offerId === recommendedOfferId && !fareFamilyInfo.hasRecommendedOffer) {
                    // a editar
                    fareFamilyInfo.hasRecommendedOffer = true;
                }
                fareFamilyInfo.offers = [offer];
            }
            fareFamilyInfo.includedPriceDiscount = offer?.specialDiscountsApplied?.some(
                ( specialDiscount ) => ( specialDiscount?.type === this.BookingAvailabilityConstants.CORPORATE ) );

            !(faresMap.has(fareFamily)) && faresMap.set(fareFamily, fareFamilyInfo);
        });
        const faresArray = Array.from(faresMap.values());
        faresMap.forEach((fareFamilyInfo) => {
            fareFamilyInfo.conditions.forEach((condition) => {
                condition.previewStatus = fareFamilyInfo.conditionsPriority.some((cond)=> cond === condition.code);
            });
        });

        return faresArray;
    };
    getCompatibleCabinsWithFare = (matchingFare: AvailabilityTransformerModel.FareFamilyCondition, cabinsData: AvailabilityTransformerModel.CabinsByFareFamilies, sliceIndex) => {
        const compatibleCabins = new Map<string, AvailabilityTransformerModel.SliceOffersByFareFamiliesSelectedCabins>();
        for (const cabin in cabinsData) {
            const cabData: AvailabilityTransformerModel.SliceOffersByFareFamiliesSelectedCabins = { ...cabinsData[cabin] };
            cabData.fareFamilies.forEach((fareFamily) => {
                if (fareFamily.offers.some((offer) => matchingFare.offers.includes(offer))) {
                    if (compatibleCabins.has(cabin)) {
                        compatibleCabins.get(cabin).fareFamilies.push(fareFamily);
                    } else {
                        cabData.fareFamilies = [fareFamily];
                        compatibleCabins.set(cabin, cabData);
                    }
                }
            });
        }
        for (let cabin of compatibleCabins.values()) {
            cabin.fareFamilies = cabin.fareFamilies.map(
                (fareFamily) => {
                    const offer = fareFamily.offers.find((offer) => matchingFare.offers.includes(offer));
                    const remainingSeats = offer.slices[sliceIndex]?.segments[0]?.cabin?.remainingSeats;
                    const slicePrice = offer.slices[sliceIndex].price;
                    const currency = fareFamily.fareCurrency;
                    fareFamily.farePrice = offer.price.total;
                    fareFamily.farePriceShown = this.CurrencyService.formatPrice(currency, slicePrice.total, false, true);
                    fareFamily.farePriceToCalculate = slicePrice.total;
                    fareFamily.remainingSeats = remainingSeats;
                    fareFamily.includedPriceDiscount = offer?.specialDiscountsApplied?.some(
                        ( specialDiscount ) => ( specialDiscount?.type === this.BookingAvailabilityConstants.CORPORATE ) );
                    return fareFamily;
                }
            );
            const fare = cabin.fareFamilies[0];
            const currency = fare.fareCurrency;
            cabin.bestCabinsPrice = true;
            cabin.bestPrice = fare.farePriceToCalculate;
            cabin.bestPriceShown = this.CurrencyService.formatPrice(currency, fare.farePriceToCalculate, false, true);
        }

        return Object.fromEntries(compatibleCabins);
    };

}
