import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { SpecialNeed } from '@core/models/ib-booking-on-hold-confirmation/ib-special-needs-modal-model';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CashAviosPossibility as GeneralCashAvios, Currency, GeneralInfo, Passenger, PassengerPrices, PassengerInfo, BreakdownTax, FlightInfo, FareFamilyCondition as GeneralFareFamilyCondition, Warnings, OrderPrice, VoucherDiscount as GeneralVoucherDiscount, PassengerDetails, SpecialNeed as GeneralSpecialNeed } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { SafeHtmlPipe } from '@src/app/shared/pipes/safe-html.pipe';
import { DurationFormatPipe } from '@shared/pipes/duration-format.pipe';
import type { BookingReference, OHImportResponse, Order, OrderItem, Warning, FareFamilyCondition, Slice, CashAviosPossibility, PassengerPrice, CurrencyAndOrderItems, VoucherDiscount } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { IbOnHoldConfirmationUtilsService } from './ib-booking-on-hold-confirmation-utils.service';

@Injectable({
    providedIn: 'root'
})
export class IbBookingOnHoldConfirmationTransformerService {

    constructor (
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        @Inject(AJSBookingUtilsService) private BookingUtilService,
        private IbOnHoldConfirmationUtilsService: IbOnHoldConfirmationUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private TranslateService: TranslateService,
        private sanitizer: DomSanitizer
    ) { }

    transformOnHoldConfirmationInfo = (onHoldInfo:OHImportResponse, selectedPNR:string) => {
        let codeCurrency = this.getCodeCurrency(onHoldInfo);
        let currencyInfo = this.getCurrencyInfo(onHoldInfo, codeCurrency);
        let transformedInfo = {
            generalInfo: this.getGeneralInfo(cloneDeep(onHoldInfo), cloneDeep(currencyInfo), selectedPNR),
            passengers: this.getPassengerInfo(cloneDeep(onHoldInfo.passengers)),
            warnings:  onHoldInfo.warnings
        };
        this.CommonsSessionStorageService.set('generalInfo', transformedInfo.generalInfo);
        return transformedInfo;
    };

    private getDestination = (onHoldInfo:OHImportResponse) => {
        const slices = onHoldInfo.order.slices;
        const slicesLength = slices.length;
        const origin = slices[0].segments[0].departure;
        const roundtrip = slices[0].segments[slices[0].segments.length - 1].arrival;
        const asymentricDest = slices[slicesLength - 1].segments[slices[slicesLength - 1].segments.length - 1].arrival;
        const isMultiSlice = slicesLength > 2;
        const isAsymmetricRoundTrip = slicesLength === 2 && origin.code !== asymentricDest.code;
        if (isMultiSlice || isAsymmetricRoundTrip) {
            return asymentricDest;
        }
        return roundtrip;
    };

    private getGeneralInfo = (onHoldInfo:OHImportResponse, currency: Currency, selectedPNR:string):GeneralInfo => {
        const isMultiCity = this.IbOnHoldConfirmationUtilsService.isMultiCityTrip(onHoldInfo.order.slices);
        const slices = onHoldInfo.order.slices;
        let generalInfo:GeneralInfo = {
            notConfirmable: onHoldInfo.order.status !== BookingAppConstants.ON_HOLD_STATUS.ON_HOLD_CONFIRMABLE,
            pnr: this.getPnrs(onHoldInfo.order.bookingReferences, selectedPNR),
            origin: slices[0].segments[0].departure,
            destination: this.getDestination(onHoldInfo),
            departureTime: {
                date: slices[0].departureDateTime.split(' ')[0],
                time: slices[0].departureDateTime.split(' ')[1]
            },
            returnFlight: slices.length > 1 ? {
                date: slices[slices.length - 1].departureDateTime.split(' ')[0],
                time: slices[slices.length - 1].departureDateTime.split(' ')[1]
            } : null,
            tripType: isMultiCity ? 3: slices.length,
            flightRatio: onHoldInfo.order.flightRatio,
            passengersNumber: onHoldInfo.passengers.length,
            currency: currency,
            relatedContent: this.BookingUtilService.getRelatedContent(onHoldInfo.relatedContent),
            backgroundImageUrl: this.BookingUtilService.getBackGroundURL(slices[0].segments[slices[0].segments.length - 1].arrival.city.code),
            primaryContactInfo: {
                email: onHoldInfo.order.primaryContactInfo.email,
                phone: onHoldInfo.order.primaryContactInfo.phone
            },
            passengerPrices: this.getPassengersByPrices(onHoldInfo.order.orderItems, onHoldInfo.passengers, currency),
            cashAviosPossibilities: this.getCashAviosPossibilities(onHoldInfo.order.cashAviosPossibilities, currency),
            passengerInfo: this.getPassengersInfo(onHoldInfo.order, onHoldInfo.passengers),
            flightInfo: this.getFlightInfo(slices, onHoldInfo.fareFamilyConditions),
            orderItemsId: this.getOrderItemsId(),
            orderPrice: this.getOrderPrice(onHoldInfo.order),
            voucherDiscount: onHoldInfo.order.voucherDiscount ? this.getVoucherInfoDiscount(onHoldInfo.order.voucherDiscount, currency) : null,
            flightType: isMultiCity? BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP : BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY
        };
        onHoldInfo.order?.specialDiscounts.length > 0 && ( generalInfo['specialDiscounts'] = onHoldInfo.order.specialDiscounts );
        this.setGeneralInfoProperties(onHoldInfo, generalInfo, currency);
        this.CommonsSessionStorageService.set('flowId', onHoldInfo.flowId);
        this.CommonsSessionStorageService.set('orderId', onHoldInfo.order.orderId);
        this.CommonsSessionStorageService.set('fareFamilyConditionsInfo', onHoldInfo.fareFamilyConditions);

        return generalInfo;
    };

    private setGeneralInfoProperties (onHoldInfo: OHImportResponse, generalInfo: GeneralInfo, currency: Currency) {
        this.setRemainingTime(onHoldInfo, generalInfo);
        this.setPriceInfo(onHoldInfo, generalInfo, currency);
        this.setWarnings(onHoldInfo, generalInfo);
        this.setArrivalTime(onHoldInfo, generalInfo);
    }

    private setRemainingTime (onHoldInfo: OHImportResponse, generalInfo: GeneralInfo) {
        if (onHoldInfo?.onHoldInformation?.remainingTime && onHoldInfo?.onHoldInformation?.paidDeposit) {
            generalInfo.remainingTime = dayjs().add(onHoldInfo.onHoldInformation.remainingTime, 'minute').format();
        }
    }

    private setPriceInfo (onHoldInfo: OHImportResponse, generalInfo: GeneralInfo, currency: Currency) {
        let priceToShow = 0;
        if (onHoldInfo.order.price && onHoldInfo?.onHoldInformation?.paidDeposit) {
            priceToShow = generalInfo.voucherDiscount && generalInfo.voucherDiscount.priceWithDiscount ? generalInfo.voucherDiscount.priceWithDiscount : onHoldInfo.order.price.total;
            generalInfo.price = {
                original: priceToShow,
                formatted: this.CurrencyService.formatPrice(currency, priceToShow, true),
                perPassenger: this.CurrencyService.formatPrice(currency, ((priceToShow - onHoldInfo.onHoldInformation.paidDeposit.fare) / onHoldInfo.passengers.length), true)
            };
            generalInfo.paidDeposit = {
                priceFormat: this.CurrencyService.formatPrice(currency, onHoldInfo.onHoldInformation.paidDeposit.fare, true),
                price: onHoldInfo.onHoldInformation.paidDeposit.fare
            };
            generalInfo.paidDeposit.priceFormat = generalInfo.paidDeposit.price === 0 ? generalInfo.paidDeposit.priceFormat : '-' + generalInfo.paidDeposit.priceFormat;
            generalInfo.originalPrice = this.CurrencyService.formatPrice(currency, (priceToShow - onHoldInfo.onHoldInformation.paidDeposit.fare), true);
        }
    }

    private setWarnings (onHoldInfo: OHImportResponse, generalInfo: GeneralInfo) {
        if (onHoldInfo.warnings) {
            generalInfo.warnings = this.setInfoWarnings(onHoldInfo.warnings);
        }
    }

    private setArrivalTime (onHoldInfo: OHImportResponse, generalInfo: GeneralInfo) {
        if (onHoldInfo.order.slices.length > 1) {
            generalInfo.arrivalTime = {
                date: onHoldInfo.order.slices[onHoldInfo.order.slices.length - 1].departureDateTime.split(' ')[0],
                time: onHoldInfo.order.slices[onHoldInfo.order.slices.length - 1].departureDateTime.split(' ')[1]
            };
        }
    }
    private getPnrs = (pnrs: BookingReference[], selectedPNR:string):string => {
        let pnr = pnrs?.[0]?.reference ?? '', pnrFound = false, pnrIndex = 0;
        while (!pnrFound && pnrIndex < pnrs.length) {
            if (pnrs[pnrIndex].reference === selectedPNR) {
                pnr = pnrs[pnrIndex].reference;
                pnrFound = true;
            }
            pnrIndex++;
        }
        this.CommonsSessionStorageService.set(BkiStorageConstants.PNR, pnr);
        return pnr;
    };

    private getPassengersByPrices = (orderItems: OrderItem[], passengers: Passenger[], currency: Currency): PassengerPrices => {
        const passengersPriceInfo: PassengerPrices = {};
        const orderItemsIds: string[] = [];
        const currencyAndOrderItems: CurrencyAndOrderItems = {
            currency,
            orderItemsIds
        };
        for (const passenger of passengers) {
            this.processPassenger(passenger, orderItems, passengersPriceInfo, currencyAndOrderItems);
        }

        this.CommonsSessionStorageService.set('orderItemsId', orderItemsIds);
        return passengersPriceInfo;
    };

    private processPassenger (passenger: Passenger, orderItems: OrderItem[], passengersPriceInfo: PassengerPrices, { currency, orderItemsIds }: CurrencyAndOrderItems) {
        passengersPriceInfo[passenger.passengerType] = passengersPriceInfo[passenger.passengerType] || {
            fare: 0,
            formattedFare: '',
            formattedInTax: '',
            breakdownTaxes: [],
            tax: 0,
            numberOfPassengers: 0,
            totalTax: 0,
            formattedTotalTax: ''
        };
        for (const orderItem of orderItems) {
            orderItemsIds.push(orderItem.orderItemId);
            if (orderItem.type === 'flight' && orderItem.passengerPrices) {
                const passengerPrice = this.findPassengerPrice(passenger, orderItem.passengerPrices);
                if (passengerPrice) {
                    this.updatePassengerPriceInfo(passenger, passengerPrice, passengersPriceInfo, currency);
                }
            }
        }
    }

    private findPassengerPrice (passenger: Passenger, passengerPrices: PassengerPrice[]): PassengerPrice | undefined {
        for (const passengerPrice of passengerPrices) {
            if (passengerPrice.passengerId === passenger.passengerId) {
                return passengerPrice;
            }
        }
        return undefined;
    }

    private updatePassengerPriceInfo (passenger: Passenger, passengerPrice: PassengerPrice, passengersPriceInfo: PassengerPrices, currency: Currency) {
        if (!passengersPriceInfo[passenger.passengerType].numberOfPassengers) {
            if (passengerPrice.price) {
                passengersPriceInfo[passenger.passengerType] = {
                    fare: passengerPrice.price.fare,
                    formattedFare: this.CurrencyService.formatPrice(currency, passengerPrice.price.fare, true),
                    formattedInTax: this.CurrencyService.formatPrice(currency, passengerPrice.price.tax, true),
                    breakdownTaxes: this.getFormatedTaxes(passengerPrice.taxes, currency),
                    tax: passengerPrice.price.tax,
                    numberOfPassengers: 1,
                    totalTax: passengerPrice.price.tax,
                    formattedTotalTax: this.CurrencyService.formatPrice(currency, passengerPrice.price.tax, true)
                };
            }
        } else {
            passengersPriceInfo[passenger.passengerType].numberOfPassengers++;
        }
    }
    private getCashAviosPossibilities = (cashAviosPossibilities:CashAviosPossibility[], currency: Currency):GeneralCashAvios[] => {
        var transformedCashAviosPossibilities = [], cashAviosPossibilitiesIndex;
        for (cashAviosPossibilitiesIndex = 0; cashAviosPossibilitiesIndex < cashAviosPossibilities.length; cashAviosPossibilitiesIndex++) {
            transformedCashAviosPossibilities.push(Object.assign(cashAviosPossibilities[cashAviosPossibilitiesIndex], {
                currencySymbol: currency.currencySymbol,
                formatedTotalDiscount: this.CurrencyService.formatPrice(currency, cashAviosPossibilities[cashAviosPossibilitiesIndex].totalDiscount, true, true),
                formatedAviosRequired: this.CurrencyService.formatAvios(currency.groupingSeparator, cashAviosPossibilities[cashAviosPossibilitiesIndex].aviosRequired)
            }));
        }
        return transformedCashAviosPossibilities;
    };
    private getPassengersInfo = (order: Order, passengers: Passenger[]): PassengerInfo => {
        const passengersInfo = {};
        passengers.forEach(passenger => {
            this.setContactDataIfNeeded(order, passenger);
            passengersInfo[passenger.passengerId] = this.createPassengerInfo(order, passenger);
        });
        return passengersInfo;
    };

    private setContactDataIfNeeded = (order: Order, passenger: Passenger): void => {
        if (!this.CommonsSessionStorageService.get('contactData') && passenger.passengerType === BookingAppConstants.PASSENGER_TYPES.ADULT) {
            this.CommonsSessionStorageService.set('contactData', {
                email: order.primaryContactInfo.email,
                phone: order.primaryContactInfo.phone,
                name: passenger.personalInfo.name,
                surname: passenger.personalInfo.surname
            });
        }
    };

    private createPassengerInfo = (order: Order, passenger: Passenger): PassengerDetails => {
        const specialNeeds = this.getPassengerSpecialNeeds(order, passenger);
        const specialNeedFound = specialNeeds.some(need => need.showSpecialNeed);
        const passengerInfo = {
            type: passenger.passengerType,
            name: passenger.externalPersonalInfo ? passenger.externalPersonalInfo.name : passenger.personalInfo.name,
            surname: passenger.externalPersonalInfo ? passenger.externalPersonalInfo.firstSurname : passenger.personalInfo.surname,
            loyaltyCard: passenger.frequentFlyerInfo ? `${passenger.frequentFlyerInfo.company} ${passenger.frequentFlyerInfo.number}` : 'PASSENGER_INFO_NO_LOYALTY_CARD',
            specialNeedFound,
            specialNeeds
        };

        return passengerInfo;
    };

    private getPassengerSpecialNeeds = (order: Order, passenger: Passenger): GeneralSpecialNeed[] => {
        return order.slices.map(slice => {
            const specialNeeds = this.getSpecialNeedsForSlice(order, passenger, slice);
            return {
                departureCity: slice.segments[0].departure,
                arrivalCity: slice.segments[slice.segments.length - 1].arrival,
                specialNeeds,
                showSpecialNeed: specialNeeds.length > 0
            };
        });
    };

    private getSpecialNeedsForSlice = (order: Order, passenger: Passenger, slice: Slice): SpecialNeed[] =>{
        return order.orderItems
            .filter(item => item.type === 'specialNeed' && item.passengerId === passenger.passengerId && item.sliceId === slice.sliceId)
            .map(item => ({
                serviceCode: item.serviceCode,
                text: item.text,
                status: item.status
            }));
    };

    private getFormatedTaxes = (taxes:AvailabilityTransformerModel.Tax[], currency: Currency): BreakdownTax[] => {
        var formatedTaxes = [], taxesIndex;
        for (taxesIndex = 0; taxesIndex < taxes.length; taxesIndex++) {
            formatedTaxes[taxesIndex] = cloneDeep(taxes[taxesIndex]);
            formatedTaxes[taxesIndex].amount = this.CurrencyService.formatPrice(currency, formatedTaxes[taxesIndex].amount, true);
        }
        return formatedTaxes;
    };

    private getFlightInfo = (slices:Slice[], fareFamilyConditions:FareFamilyCondition[]): FlightInfo => {
        var sliceIndex = 0, segmentIndex = 0, segments = [], segmentInfo = {}, flightsInfo = {};
        for (sliceIndex = 0; sliceIndex < slices.length; sliceIndex++) {
            segments = [];
            for (segmentIndex = 0; segmentIndex < slices[sliceIndex].segments.length; segmentIndex++) {
                segmentInfo = {
                    departureCity: slices[sliceIndex].segments[segmentIndex].departure,
                    arrivalCity: slices[sliceIndex].segments[segmentIndex].arrival,
                    departureDateParsed: this.dateFormatPipe(slices[sliceIndex].segments[segmentIndex].departureDateTime),
                    companyURL: this.BookingUtilService.getCompanyURL(slices[sliceIndex].segments[segmentIndex].flight.operationalCarrier.code),
                    overnight: slices[sliceIndex].segments[segmentIndex].overnight,
                    departureDateTimeParsed: slices[sliceIndex].segments[segmentIndex].departureDateTime.split(' ')[1],
                    arrivalDateTimeParsed: slices[sliceIndex].segments[segmentIndex].arrivalDateTime.split(' ')[1],
                    departure: slices[sliceIndex].segments[segmentIndex].departure,
                    arrival: slices[sliceIndex].segments[segmentIndex].arrival,
                    flight: slices[sliceIndex].segments[segmentIndex].flight,
                    durationParsed: this.durationFormatPipe(slices[sliceIndex].segments[segmentIndex].duration),
                    arrive:sliceIndex % 2 === 0,
                    cabin: slices[sliceIndex].segments[segmentIndex].cabin,
                    fareFamilyConditions: this.getFareFamilyConditions(slices[sliceIndex].segments[segmentIndex].cabin.fareFamily, fareFamilyConditions)
                };
                segments.push(segmentInfo);
            }
            flightsInfo[slices[sliceIndex].sliceId] = {
                departureCity: slices[sliceIndex].segments[0].departure,
                arrivalCity: slices[sliceIndex].segments[slices[sliceIndex].segments.length - 1].arrival,
                segments: segments,
                departureDateParsed: this.dateFormatPipe(slices[sliceIndex].segments[0].departureDateTime),
                arrive: (slices.length < 2) ? (sliceIndex % 2 === 0) : true
            };
        }
        return flightsInfo;
    };

    private getFareFamilyConditions = (fareFamily:string, fareConditions: FareFamilyCondition[]): GeneralFareFamilyCondition[] => {
        let fareDataConditions = [], fareIndex, conditionsIndex, cabin, fareCondArray;

        for (fareIndex = 0; fareIndex < fareConditions.length; fareIndex++) {
            if (fareFamily === fareConditions[fareIndex].commercialCode) {
                cabin = this.TranslateService.currentLang !== 'es' || !fareConditions[fareIndex].commercialNameES ? fareConditions[fareIndex].commercialName : fareConditions[fareIndex].commercialNameES;

                fareCondArray = fareConditions[fareIndex].conditions.filter(Boolean);
                fareConditions[fareIndex].conditions = cloneDeep(fareCondArray);

                for (conditionsIndex = 0; conditionsIndex < fareConditions[fareIndex].conditions.length; conditionsIndex++) {
                    fareDataConditions.push({
                        cabin: cabin,
                        cabinType: fareConditions[fareIndex].cabinType,
                        code: fareConditions[fareIndex].conditions[conditionsIndex].code,
                        name: fareConditions[fareIndex].conditions[conditionsIndex].name,
                        title: fareConditions[fareIndex].conditions[conditionsIndex].extendedInfo.title,
                        message: fareConditions[fareIndex].conditions[conditionsIndex].extendedInfo.message,
                        units: fareConditions[fareIndex].conditions[conditionsIndex].units
                    });
                }
            }
        }
        return fareDataConditions;
    };

    private setInfoWarnings = (warnings: Warning[]):Warnings => {
        var setWarnings = {};
        warnings.forEach(warning => {
            if (warning.code === 'SSE_MMB_0001') {
                setWarnings[warning.code] = { description: this.safeHtmlPipe(warning.description) };
            }
        });
        return setWarnings;
    };

    private getOrderItemsId = (): string[] => {
        var i, orderItemsId = [], orderItems = this.CommonsSessionStorageService.get<OHImportResponse>('bookingInfo').order.orderItems || null;
        if (orderItems) {
            for (i = 0; i < orderItems.length; i++) {
                orderItemsId.push(orderItems[i].orderItemId);
            }
        }
        this.CommonsSessionStorageService.set('orderItemsId', orderItemsId);
        return orderItemsId;
    };

    private getOrderPrice = (order: Order): OrderPrice => {
        var returnValue;
        if (order?.orderItems?.[0].price) {
            returnValue = order.orderItems[0].price;
        } else {
            returnValue = BookingAppConstants.ONHOLD.ORDERPRICEDEFAULT;
        }
        return returnValue;
    };

    private getCurrencyInfo = (onHoldInfo: OHImportResponse, codeCurrency:string):Currency => {
        let currencyInfo = [];

        if(onHoldInfo?.contextMetadata?.currencies?.length) {
            if(onHoldInfo.contextMetadata.currencies.some(currency => currency)) {
                currencyInfo = onHoldInfo.contextMetadata.currencies;
            }
        }
        if(currencyInfo.length === 0) {
            currencyInfo.push({'code' : codeCurrency});
        }

        return this.CurrencyService.getCurrenciesAsMap(currencyInfo)[codeCurrency];
    };

    private getCodeCurrency = (onHoldInfo:OHImportResponse):string => {
        return onHoldInfo?.order?.price?.currency || this.CommonsSessionStorageService.get<any>('commercialData').currency.code;
    };

    private getVoucherInfoDiscount = (voucherData:VoucherDiscount, currency: Currency): GeneralVoucherDiscount => {
        let voucherInfo: GeneralVoucherDiscount = {
            amount: voucherData.amount,
            formattedAmount: this.CurrencyService.formatPrice(currency, voucherData.amount, true),
            priceWithDiscount: voucherData.totalBookingAmountWithDiscountApplied,
            type: voucherData.type,
            voucherId: voucherData.voucherId,
            description: voucherData.description,
            totalDiscount: voucherData.amount,
            discountFormatted: this.CurrencyService.formatPrice(currency, voucherData.amount, true)
        };
        return voucherInfo;
    };

    private getPassengerInfo = (passengers:Passenger[]):Passenger[] => {
        let i;
        for (i = 0; i < passengers.length; i++) {
            if (passengers[i].externalPersonalInfo) {
                passengers[i].personalInfo.name = passengers[i].externalPersonalInfo.name;
                passengers[i].personalInfo.surname = passengers[i].externalPersonalInfo.firstSurname;
                passengers[i].personalInfo.lastSurname = passengers[i].externalPersonalInfo.lastSurname;
            }
        }
        this.CommonsSessionStorageService.set(BkiStorageConstants.SURNAME, passengers[0].personalInfo.surname);
        return passengers;
    };

    public dateFormatPipe = ( input: string ): string => {
        const dateFormatPipe = new DateFormatPipe(this.BookingUtilService);
        return dateFormatPipe.transform( input, null );
    };

    public durationFormatPipe = ( input: number ): string => {
        const durationFormatPipe = new DurationFormatPipe();
        return durationFormatPipe.transform( input );
    };

    public safeHtmlPipe = ( input: string ): SafeHtml => {
        const safeHtmlPipe = new SafeHtmlPipe(this.sanitizer);
        return safeHtmlPipe.transform( input );
    };
}
