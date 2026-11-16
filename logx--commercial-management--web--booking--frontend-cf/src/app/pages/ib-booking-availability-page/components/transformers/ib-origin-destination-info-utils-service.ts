import { cloneDeep, merge } from 'lodash-es';
import { IbBookingAvailabilityUtilsService } from '../../../../shared/services/ib-booking-availability/ib-booking-availability-utils-service';


@Service('ib-booking-availability-module',
    [
        'BookingAvailabilityConstants',
        'CurrencyService',
        '$filter',
        'IbBookingAvailabilityUtilsService',
        'localStorageService',
        'BookingAppConstants'
    ])
export class IbOriginDestinationInfoUtilsService {
    constructor (
        private BookingAvailabilityConstants: any,
        private CurrencyService: CurrencyService,
        private $filter: ng.FilterFactory,
        private  IbBookingAvailabilityUtilsService: IbBookingAvailabilityUtilsService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private BookingAppConstants: BookingAppConstants
    ) {
    }



    getFarePricesAndOffers = (
        originDestinationId: string,
        sliceId: number,
        sliceOffers: AvailabilityTransformerModel.Offer[],
        fareFamily: AvailabilityTransformerModel.FareFamilyCondition
    ): AvailabilityTransformerModel.FareDetailedInfo => {
        const fareInfo: AvailabilityTransformerModel.FareDetailedInfo = {
            offers: [],
            bestFarePrice: 0,
            farePrice: 0,
            fareDiscountPrice: 0,
            currency: null,
            remainingSeats: null,
            fareFound: false,
            oBdiscount: false,
            includedPriceDiscount: false

        };

        fareInfo.offers = fareInfo.offers.sort((ofA, ofB) => (ofA.price.total - ofB.price.total));

        const foundedOffer = sliceOffers.filter(offer => offer.originDestinations.some((current) => {
            return originDestinationId === current.originDestinationId && current.applicableSlices.some(apSlice => (sliceId === apSlice.sliceId && fareFamily.commercialCode === apSlice.segments[0].fareFamily));
        })).sort((ofA, ofB) => (ofA.price.total - ofB.price.total));
        if (foundedOffer.length > 0) {
            fareInfo.offers.push(...foundedOffer);
            fareInfo.fareFound = true;
            const bestOffer = foundedOffer[0];
            fareInfo.bestFarePrice = bestOffer.price.total;
            const originDestination = bestOffer.originDestinations.find((od) => od.originDestinationId === originDestinationId);
            const currentSlice = originDestination.applicableSlices.find((slc) => slc.sliceId === sliceId);
            if (originDestination?.adultPriceDiscountData?.totalOriginal &&
                Math.ceil(originDestination.adultPriceDiscountData.totalOriginal ?? 0) !== Math.ceil(originDestination?.adultPrice?.total ?? 0)
            ) {
                fareInfo.fareDiscountPrice = originDestination.adultPriceDiscountData.totalOriginal;
            } else {

                fareInfo.fareDiscountPrice = null;
                fareInfo.includedPriceDiscount = bestOffer.specialDiscountsApplied.some((specialDiscount) => (originDestination?.priceDiscountApplied && specialDiscount?.type === this.BookingAvailabilityConstants.CORPORATE));
            }
            fareInfo.farePrice = originDestination.adultPrice.total;
            fareInfo.currency = bestOffer.price.currency;
            fareInfo.remainingSeats = currentSlice.remainingSeats;
            bestOffer.specialDiscountsApplied.forEach((specialDiscount) => {
                fareInfo.oBdiscount = Boolean(
                    specialDiscount.type === this.BookingAvailabilityConstants.CORPORATE &&
                                    specialDiscount.discountType === this.BookingAvailabilityConstants.ON_BUSINESS &&
                                    originDestination.priceDiscountApplied);
            });
            fareInfo.fareOutTax = originDestination.adultPrice.fare;
        }





        return fareInfo;
    };

    upgradeFarePrice = (
        originDestinationId: string,
        fareDetailedInfo: AvailabilityTransformerModel.FareDetailedInfo,
        selectedOffers: AvailabilityTransformerModel.Offer[]
    ) => {
        const data = {
            price: fareDetailedInfo.farePrice,
            discount: null,
            includedPriceDiscount: false
        };
        const multiCitySearch = this.localStorageService.get( 'multiCitySearch' ) ?? null;
        selectedOffers.forEach((offer)=> {
            fareDetailedInfo.offers.forEach( ( fareOffer ) => {
                if ( multiCitySearch ) {
                    fareOffer.originDestinations.forEach( ( oD ) => {
                        if ( oD.priceDiscountApplied && !oD.adultPriceDiscountData ) {
                            data.includedPriceDiscount = offer.specialDiscountsApplied.some(
                                ( specialDiscount ) => ( oD?.priceDiscountApplied && specialDiscount?.type === this.BookingAvailabilityConstants.CORPORATE ) );
                        }
                    });
                }
                if(offer.offerId === fareOffer.offerId) {
                    fareOffer.originDestinations.forEach( (origin) => {
                        if(origin.originDestinationId === originDestinationId) {
                            data.price = origin.adultPrice.total;
                            if(origin?.adultPriceDiscountData?.totalOriginal) {
                                data.discount = origin.adultPriceDiscountData.totalOriginal;
                            }
                            if (origin.priceDiscountApplied && !origin.adultPriceDiscountData) {
                                data.includedPriceDiscount = offer.specialDiscountsApplied.some(
                                    (specialDiscount) => (origin?.priceDiscountApplied && specialDiscount?.type === this.BookingAvailabilityConstants.CORPORATE ));
                            }
                        }
                    });
                }
            });
        });
        return data;
    };

    getSelectedCabinsMobile = (
        selectedFares: AvailabilityTransformerModel.FareFamilyOptions,
        cabins:AvailabilityTransformerModel.CabinsByFareFamilies
    ):AvailabilityTransformerModel.SliceOffersByFareFamiliesSelectedCabins[] => {
        const cabinsMobile: any = {};
        let cabinsMobileReturned:AvailabilityTransformerModel.SliceOffersByFareFamiliesSelectedCabins[] = [];
        Object.keys(selectedFares).forEach((key) =>{
            const indexKey = selectedFares[key].cabinType;
            cabinsMobile[indexKey] = {...cabins[indexKey]} || cloneDeep(this.BookingAvailabilityConstants.SLICE_OFFERS_BY_FAREFAMILIES_SELECTED_CABINS);
            cabinsMobile[indexKey].type = indexKey;
            cabinsMobile[indexKey].cabinMobileStyleClass = this.getCabinStyle(indexKey);
            cabinsMobile[indexKey].collapsed = true;

            cabinsMobileReturned = Object.keys(cabinsMobile).map(cabin => cabinsMobile[cabin]);
        });
        return cabinsMobileReturned;
    };

    getSelectedCabins = (
        selectedFares: AvailabilityTransformerModel.FareFamilyOptions,
        currency: string,
        currencies: AvailabilityTransformerModel.CurrenciesObject
    ): AvailabilityTransformerModel.CabinsByFareFamilies=> {
        const cabinsReturned: AvailabilityTransformerModel.CabinsByFareFamilies = {};
        Object.keys(selectedFares).forEach((key) => {
            const indexKey = selectedFares[key].cabinType;
            cabinsReturned[indexKey] = {...cabinsReturned[indexKey]} || cloneDeep(this.BookingAvailabilityConstants.SLICE_OFFERS_BY_FAREFAMILIES_SELECTED_CABINS);
            if (cabinsReturned[indexKey].bestPrice > 0) {
                cabinsReturned[indexKey].bestPrice = Math.min(cabinsReturned[indexKey].bestPrice, selectedFares[key].farePriceToCalculate);
                cabinsReturned[indexKey].expensivePrice = Math.max(cabinsReturned[indexKey].expensivePrice, selectedFares[key].farePriceToCalculate);
                cabinsReturned[indexKey].bestPriceDiscount = cabinsReturned[indexKey].bestPrice === selectedFares[key].farePriceToCalculate
                    ? selectedFares[key].fareDiscountPriceToCalculate
                    : cabinsReturned[indexKey].bestPriceDiscount;
                cabinsReturned[indexKey].expensivePriceDiscount = cabinsReturned[indexKey].expensivePrice === selectedFares[key].farePriceToCalculate
                    ? selectedFares[key].fareDiscountPriceToCalculate
                    : cabinsReturned[indexKey].expensivePriceDiscount;
            } else {
                cabinsReturned[indexKey].bestPrice = selectedFares[key].farePriceToCalculate;
                cabinsReturned[indexKey].bestPriceDiscount = selectedFares[key].fareDiscountPriceToCalculate
                    ? selectedFares[key].fareDiscountPriceToCalculate
                    : null;
                cabinsReturned[indexKey].expensivePrice = selectedFares[key].farePriceToCalculate;
                cabinsReturned[indexKey].expensivePriceDiscount = selectedFares[key].fareDiscountPriceToCalculate
                    ? selectedFares[key].fareDiscountPriceToCalculate
                    : null;
            }
            cabinsReturned[indexKey].expensivePriceDiscountShown = cabinsReturned[indexKey].expensivePriceDiscount
                ? this.CurrencyService.formatPrice(
                    currencies[currency],
                    cabinsReturned[indexKey].expensivePriceDiscount,
                    false,
                    true)
                : null;
            cabinsReturned[indexKey].bestPriceDiscountShown = cabinsReturned[indexKey].bestPriceDiscount
                ? this.CurrencyService.formatPrice(
                    currencies[currency],
                    cabinsReturned[indexKey].bestPriceDiscount,
                    false,
                    true)
                : null;
            cabinsReturned[indexKey].bestPriceShown = this.CurrencyService.formatPrice(
                currencies[currency], cabinsReturned[indexKey].bestPrice,
                false,
                true
            );
            cabinsReturned[indexKey].expensivePriceShown = this.CurrencyService.formatPrice(
                currencies[currency], cabinsReturned[indexKey].expensivePrice,
                false,
                true
            );
            cabinsReturned[indexKey].cabinDescription = selectedFares[key].cabinDescription;
            cabinsReturned[indexKey].cabinAvailable = true;
            if(typeof cabinsReturned[indexKey].isCabinCompatible === 'undefined' && !cabinsReturned[indexKey].isCabinCompatible) {
                cabinsReturned[indexKey].isCabinCompatible =  selectedFares[key].isCompatibleFare;
            }

            cabinsReturned[indexKey].fareFamilies = cabinsReturned[indexKey].fareFamilies || [];
            cabinsReturned[indexKey].fareFamilies.push(this.getFareFamilyInfo(selectedFares[key]));

        });

        return cabinsReturned;
    };

    private getCabinStyle = (cabinType: string): string => {
        let cabinStyle = 'cabin-button';
        switch (cabinType) {
                case this.BookingAppConstants.FARE_CABIN_TYPE.BUSINESS_CLASS:
                    cabinStyle += '--business';
                    break;
                case this.BookingAppConstants.FARE_CABIN_TYPE.TURIST_PREMIUM:
                case this.BookingAppConstants.FARE_CABIN_TYPE.TURIST_PREMIUM_T:
                    cabinStyle += '--premium';
                    break;
                default: cabinStyle = ''; break;


        }
        return cabinStyle;

    };

    private getFareFamilyInfo = (info : AvailabilityTransformerModel.FareFamilyCondition): AvailabilityTransformerModel.FareFamilyCondition => {
        const fareFamilyInfo = {...info};
        let conditionsCont = 0;
        if (fareFamilyInfo.conditions && fareFamilyInfo.conditionsPriority) {
            fareFamilyInfo.conditions.forEach((condition) => {
                condition.key = fareFamilyInfo.conditionsPriority.indexOf(condition.code) !== -1
                    ? fareFamilyInfo.conditionsPriority.indexOf(condition.code)
                    : fareFamilyInfo.conditionsPriority.length + conditionsCont;
                condition.previewStatus = fareFamilyInfo.conditionsPriority.indexOf(condition.code) !== -1;
                conditionsCont++;
            });
        }
        fareFamilyInfo.conditions.sort((a, b) => {
            return a.key - b.key;
        });
        return fareFamilyInfo;
    };

    getDelayInformation = (
        delayInformation: AvailabilityTransformerModel.DelayInformation
    ): AvailabilityTransformerModel.DelayInformation => {
        return {
            code: delayInformation.companyCode + delayInformation.flightNumber,
            timeInformation: delayInformation.lastLoad,
            delayed30: delayInformation.percent30,
            delayed60: delayInformation.percent60,
            percentCancelled: delayInformation.percentCancelled
        };
    };

    getStopInformation (
        segmentInfo: AvailabilityTransformerModel.SliceSegment
    ): AvailabilityTransformerModel.StopInformation {
        return {
            city: segmentInfo.stop.city,
            durationParsed: this.$filter('DurationFormatFilter')(segmentInfo.stop.duration),
            duration: segmentInfo.stop.duration
        };
    }

    getSlicePriceByCabin (
        sliceOffersByFareFamilies: AvailabilityTransformerModel.SliceOffersByFareFamilies
    ): AvailabilityTransformerModel.PricesByCabin {
        const prices = {};
        Object.keys(sliceOffersByFareFamilies.cabins).forEach((cabinType) => {
            prices[cabinType] = sliceOffersByFareFamilies.cabins[cabinType].bestPrice;
        });
        return prices;
    }

    checkBestPriceandAvailabilitySlice = (
        slices: AvailabilityTransformerModel.Slice[],
        price: number
    ): AvailabilityTransformerModel.Slice[] => {

        let cabinsTypeArray: AvailabilityTransformerModel.CabinsInfo[] = [];
        slices.forEach( (slice) => {
            slice.bestPrice = slice.slicePrice === price;
            Object.keys(slice.cabins).forEach( ( cabinType) =>{
                cabinsTypeArray.push({
                    cabinType: String(cabinType),
                    cabinDescription: slice.cabins[cabinType].cabinDescription
                });
                slice.cabins[cabinType].bestCabinsPrice = slice.cabins[cabinType].bestPrice === price;
            });
            slice.cabinsMobile.forEach( ( key, i) => {
                slice.cabinsMobile[i].bestCabinsPrice = slice.cabinsMobile[i].bestPrice === price;
            });
        });
        const hash = {};
        cabinsTypeArray = cabinsTypeArray.filter((valor) => {
            const exist = !hash[valor.cabinType];
            hash[valor.cabinType] = true;
            return exist;
        }
        );

        slices.forEach( (slice)=> {
            const availabiliTycabins: AvailabilityTransformerModel.CabinsByFareFamilies = {};
            cabinsTypeArray.forEach( (cabin) => {
                if (!slice.cabins[cabin.cabinType]) {
                    slice.cabins[cabin.cabinType] = {
                        cabinAvailable: false,
                        cabinDescription: cabin.cabinDescription
                    };
                }
            });
            if (slice.cabins.E) {
                availabiliTycabins.E = slice.cabins.E;
            }
            if (slice.cabins.N) {
                availabiliTycabins.N = slice.cabins.N;
            }
            if (slice.cabins.T) {
                availabiliTycabins.T = slice.cabins.T;
            }
            if (slice.cabins.B) {
                availabiliTycabins.B = slice.cabins.B;
            }
            slice.cabins = availabiliTycabins;
            slice.cabinsLength = Object.keys(slice.cabins).length;
        });

        return slices;
    };

    getFilterOptions = (
        cabins: AvailabilityTransformerModel.CabinsByFareFamilies,
        currency: AvailabilityTransformerModel.Currencies,
        pricesCabin
    ): AvailabilityTransformerModel.FilterOptions => {

        const hourFilter: AvailabilityTransformerModel.HourFilterFilterOptions = {
            minValue: 0,
            maxValue: 1440,
            options: {
                hideLimitLabels: true,
                floor: 0,
                ceil: 1440,
                step: 30,
                translate: function (value) {
                    return (value / 60) < 10
                        ? `0${Math.floor(value / 60)}${ ( (value / 60) % 1 === 0 )
                            ? ':00'
                            : ':30'
                        }`
                        : `${Math.floor(value / 60)}${  ( (value / 60) % 1 === 0 )
                            ? ':00'
                            : ':30'
                        }`;
                }
            }
        };
        const cabisInfo = {...cabins};
        Object.keys(cabisInfo).forEach( (info) => {
            delete cabisInfo[info].fareFamilies;
        });
        const cabinsList: AvailabilityTransformerModel.CabinsByFareFamilies = {};
        cabinsList.anyCabin = {
            cabinDescription: 'AVAILABILITY_MODAL_FILTERS_ALL_CABINS',
            cabinAvailable: false,
            type: 'anyCabin'
        };
        merge(cabinsList, cabisInfo);

        const filterOptions: AvailabilityTransformerModel.FilterOptions = {
            cabinType: cabinsList,
            price: {
                minValue: 0,
                maxValue: 0,
                options: {
                    hideLimitLabels: true,
                    enforceStep: false,
                    floor: 0,
                    ceil: 0,
                    step: 0,
                    translate:  (value: string):string => {
                        return value + currency.currencySymbol;
                    }
                }
            },
            cabin: cabinsList.anyCabin,
            pricesByCabin: null,
            departureHours: {...hourFilter},
            arrivalHours: {...hourFilter},
            stopsNumber1: { enable: false },
            stopsNumber2: { enable: false },
            stopsNumber3: { enable: false },
            avios: false
        };

        let minPrice = 0;
        let maxPrice = 0;
        let valueDifference = 0;
        let step = 0;

        const pricesByCabin: AvailabilityTransformerModel.CabinPricebyFilterOption = {};
        Object.keys(pricesCabin).forEach( (cabinType) => {
            const minValueCabin = this.CurrencyService.getPriceByRoundingPolicy(this.$filter('orderBy')(pricesCabin[cabinType])[0]);
            const maxValueCabin = this.CurrencyService.getPriceByRoundingPolicy(this.$filter('orderBy')(pricesCabin[cabinType])[pricesCabin[cabinType].length - 1]);
            const differenceByCabin = maxValueCabin - minValueCabin;
            const stepByCabin = this.returnValueDifference(differenceByCabin);

            pricesByCabin[cabinType] = {
                minValue: minValueCabin,
                maxValue: maxValueCabin,
                options: {
                    hideLimitLabels: true,
                    enforceStep: false,
                    floor: minValueCabin,
                    ceil: maxValueCabin,
                    step: stepByCabin,
                    translate: (value) => {
                        return value + currency.currencySymbol;
                    }
                }
            };
            minPrice = minPrice > 0
                ? Math.min(minPrice, minValueCabin)
                : minValueCabin;
            maxPrice = maxPrice > 0
                ? Math.max(maxPrice, maxValueCabin)
                : maxValueCabin;
            valueDifference = maxPrice - minPrice;
            step = this.returnValueDifference(valueDifference);
        });

        filterOptions.pricesByCabin = pricesByCabin;
        filterOptions.price.minValue = minPrice;
        filterOptions.price.maxValue = maxPrice;
        filterOptions.price.options.floor = minPrice;
        filterOptions.price.options.ceil = maxPrice;
        filterOptions.price.options.step = step;

        return filterOptions;
    };

    private returnValueDifference = (difference: number): number =>{
        let value = 5;
        if(difference) {
            if (difference <= 500 ) {
                value = 5;
            }else if (difference <= 5000) {
                value = 10;
            }else if (difference <= 10000) {
                value = 50;
            }else if (difference <= 100000) {
                value = 100;
            }else{
                value = 1000;
            }
        }
        return value;
    };

    getSlidesData = (
        calendarData: AvailabilityTransformerModel.CalendarData,
        currencyObject: AvailabilityTransformerModel.Currency
    ): AvailabilityTransformerModel.SlidesDataResponse => {
        const searchFlightType = this.localStorageService.get('searchFlightType');
        const isRedemption = searchFlightType === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION;
        const commercialData: AvailabilityTransformerModel.AvailabilityCommercialData =
            this.localStorageService.get('commercialData');
        let groupingSeparator = '';
        if(commercialData && commercialData.currency && commercialData.currency.groupingSeparator) {
            groupingSeparator = commercialData.currency.groupingSeparator;
        }
        let selectedSlide = 0;
        let formattedPrice = '';
        const slicesArray: AvailabilityTransformerModel.GenerateSliceInfo[]= [];
        const slidesData: AvailabilityTransformerModel.SlidesDataResponse = {
            slides: slicesArray,
            currentInitialSlide: selectedSlide,
            selectedSlide: selectedSlide,
            maxDate: calendarData.maxDate,
            minDate: calendarData.minDate,
            currentSlides: []
        };

        if (calendarData && calendarData.originCalendarData) {
            const slices: AvailabilityTransformerModel.SliceInfoOFCells[] =
                this.IbBookingAvailabilityUtilsService.slidesInfo(calendarData.originCalendarData);
            const currentDate = new Date(calendarData.minDate.getTime());
            currentDate.setHours(0, 0, 0, 0);
            const maxDate = calendarData.maxDate;
            let sliceIndex = 0;
            let condition = false;
            do{
                const slideInfo: AvailabilityTransformerModel.GenerateSliceInfo = this.IbBookingAvailabilityUtilsService.generateSlidesInfo(
                    currentDate,
                    this.BookingAvailabilityConstants.SLICK_STATUS.LOADING,
                    sliceIndex);
                const checkedSlides: AvailabilityTransformerModel.IsInSlidesResponse = this.isInSlides(
                    slices,
                    slideInfo,
                    calendarData.originDestinationIndex
                );
                if (checkedSlides.isRequestSlide) {
                    selectedSlide = slicesArray.length;
                }
                if(isRedemption) {
                    formattedPrice = this.CurrencyService.formatAvios( groupingSeparator, String(checkedSlides.slide.price));
                }else{
                    formattedPrice = this.CurrencyService.formatPrice(currencyObject, checkedSlides.slide.price, false, true);
                }
                merge(checkedSlides.slide, {
                    formattedPrice: formattedPrice
                });
                slicesArray.push(checkedSlides.slide);
                currentDate.setDate(currentDate.getDate() + 1);//adds one day to currentDate
                sliceIndex++;
                condition = currentDate.getTime() > maxDate.getTime();
            }while(!condition);
            selectedSlide = this.completeSlickModel(slicesArray, selectedSlide, calendarData);
            merge(slicesArray[0], { firstItem: true });
            merge(slicesArray[slicesArray.length - 1], { lastItem: true });
        }
        slidesData.slides = slicesArray;
        slidesData.currentInitialSlide = selectedSlide;
        slidesData.selectedSlide = selectedSlide;
        slidesData.currency = currencyObject;

        return slidesData;
    };

    private isInSlides = (
        serviceSlide: AvailabilityTransformerModel.SliceInfoOFCells[],
        slideDate: AvailabilityTransformerModel.GenerateSliceInfo,
        originDestinationIndex: number
    ): AvailabilityTransformerModel.IsInSlidesResponse => {
        const availabilityData: AvailabilityTransformerModel.AvailabilityRequestData = this.localStorageService.get('newAvailabilityRequestData') ||
            this.localStorageService.get('availabilityRequestData');
        const returnedSlide: AvailabilityTransformerModel.IsInSlidesResponse = {
            slide: slideDate,
            isRequestSlide: false
        };
        let index = 0;
        let founded = false;
        do{
            if (slideDate.serviceDate === serviceSlide[index].serviceDate) {
                merge(returnedSlide.slide, serviceSlide[index]);
                returnedSlide.isRequestSlide = availabilityData.slices[originDestinationIndex].date === serviceSlide[index].serviceDate;
                founded = true;
            }
            index++;
        }while(!founded && index < serviceSlide.length);
        return returnedSlide;
    };

    //Completes slick until 7 days
    private completeSlickModel = (
        slickInfo: AvailabilityTransformerModel.GenerateSliceInfo[],
        activeSlide: number,
        calendarData: AvailabilityTransformerModel.CalendarData
    ): number => {
        const daysOffset =   Math.floor((this.BookingAvailabilityConstants.DAYS_BEFORE + this.BookingAvailabilityConstants.DAYS_AFTER +1)/2);
        let i, generatedDate = new Date(slickInfo[0].serviceDate);
        activeSlide += daysOffset;
        for (i = 0; i < slickInfo.length; i++) {
            slickInfo[i].slidePosition += daysOffset;
        }
        generatedDate.setTime(generatedDate.getTime() - this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
        if (calendarData.originDestinationIndex === 0) {
            for (i = daysOffset - 1; i >= 0; i--) {
                const generateSliceInfo = this.IbBookingAvailabilityUtilsService.generateSlidesInfo(
                    generatedDate,
                    this.BookingAvailabilityConstants.SLICK_STATUS.DISABLED,
                    i
                );
                slickInfo.unshift(generateSliceInfo);
                generatedDate.setTime(generatedDate.getTime() - this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            }
            generatedDate = new Date(slickInfo[slickInfo.length - 1].serviceDate);
            //generatedDate.setTime(generatedDate.getTime() + this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            for (i=0; i< this.BookingAvailabilityConstants.DAYS_AFTER; i++) {
                slickInfo.push(
                    this.IbBookingAvailabilityUtilsService.generateSlidesInfo(
                        generatedDate,
                        (i=== 0) ? this.BookingAvailabilityConstants.SLICK_STATUS.UPPER_END_RIBBON_WARN : this.BookingAvailabilityConstants.SLICK_STATUS.UPPER_END_RIBBON_DISABLED,
                        slickInfo.length)
                );
                generatedDate = new Date(slickInfo[slickInfo.length - 1].serviceDate);
                generatedDate.setTime(generatedDate.getTime() + this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            }
        } else {
            const slickLength = slickInfo.length;
            generatedDate = new Date(slickInfo[slickLength - 1].serviceDate);
            generatedDate.setTime(generatedDate.getTime() + this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            for (i = slickLength; i < slickLength + daysOffset; i++) {
                const generateSliceInfo = this.IbBookingAvailabilityUtilsService.generateSlidesInfo(
                    generatedDate,
                    this.BookingAvailabilityConstants.SLICK_STATUS.DISABLED,
                    i
                );
                slickInfo.push(generateSliceInfo);
                generatedDate.setTime(generatedDate.getTime() + this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            }
            generatedDate = new Date(slickInfo[0].serviceDate);
            //generatedDate.setTime(generatedDate.getTime() - this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);
            for(i=0; i< this.BookingAvailabilityConstants.DAYS_BEFORE; i++){
                slickInfo.unshift(this.IbBookingAvailabilityUtilsService.generateSlidesInfo(
                    generatedDate,
                    (i=== 0) ? this.BookingAvailabilityConstants.SLICK_STATUS.LOWER_END_RIBBON_WARN : this.BookingAvailabilityConstants.SLICK_STATUS.LOWER_END_RIBBON_DISABLED,
                    0));
                generatedDate = new Date(slickInfo[0].serviceDate);
                generatedDate.setTime(generatedDate.getTime() - this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);

            }
        }
        return activeSlide;
    };

    initializeDefaultValues = () => {
        const slicePricesByCabin: AvailabilityTransformerModel.DynamicPrice = {};
        const slicePrices = [];
        let bestPrice = 0;
        let isAvailable = false;
        let originCurrencyCode: string = '';
        return { slicePricesByCabin, slicePrices, bestPrice, isAvailable, originCurrencyCode };
    };

    assignSliceDefaults = (slice: AvailabilityTransformerModel.Slice) => {
        slice.bestPrice = false;
        slice.showFares = false;
        slice.allOperatedBy = [];
        slice.allOperatedByCodes = [];
        slice.technicalStop = 0;
    };

    assignSlicePrices = (slice: AvailabilityTransformerModel.Slice, sliceOffersByFareFamilies: AvailabilityTransformerModel.SliceOffersByFareFamilies, currencies: AvailabilityTransformerModel.CurrenciesObject) => {
        slice.slicePrice = sliceOffersByFareFamilies.fareFamilies.slicePrice;
        slice.slicePriceShown = this.CurrencyService.formatPrice(currencies[sliceOffersByFareFamilies.fareFamilies.sliceCurrency], slice.slicePrice, false, true),
        slice.sliceDiscountPrice = sliceOffersByFareFamilies.fareFamilies.slicePriceWithoutDiscount ?? null,
        slice.sliceDiscountPriceShown = slice.sliceDiscountPrice ? this.CurrencyService.formatPrice(currencies[sliceOffersByFareFamilies.fareFamilies.sliceCurrency], slice.sliceDiscountPrice, false, true) : null,
        slice.sliceCurrency = sliceOffersByFareFamilies.fareFamilies.sliceCurrency;
    };

    assignSliceDates = (slice: AvailabilityTransformerModel.Slice) => {
        const arrivalDateSplit: string[] = slice.arrivalDateTime.split(' ');
        const departureDateSplit: string[] = slice.departureDateTime.split(' ');

        slice.durationParsed = this.$filter('DurationFormatFilter')(slice.duration);
        slice.departureDateTimeParsed = slice.departureDateTime.split(' ')[1];
        slice.departureDateParsed = this.$filter('DateFormatFilter')(slice.departureDateTime);
        slice.arrivalDateParsed = this.$filter('DateFormatFilter')(slice.arrivalDateTime);
        slice.arrivalDateTimeParsed = arrivalDateSplit[1];
        slice.daysOfTravel = Math.round(
            (new Date(arrivalDateSplit[0]).getTime() - new Date(departureDateSplit[0]).getTime()
            ) / this.BookingAvailabilityConstants.ONE_DAY_MILISECONDS);


    };

}
