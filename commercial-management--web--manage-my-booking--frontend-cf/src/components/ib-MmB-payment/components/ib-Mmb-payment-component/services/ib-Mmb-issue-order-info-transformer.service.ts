import { Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { OnSuccessEvent } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-model';
import {
    PAYMENT_SESSION_KEYS,
    DEFAULT_CONTEXT_METADATA,
    DEFAULT_PHONE_TYPE
} from '@src/components/ib-MmB-payment/constants/ib-Mmb-payment-session.constants';

@Injectable({
    providedIn: 'root'
})
export class IssueOrderInfoTransformerService {

    constructor(
        private sessionStorage: CommonsSessionStorageService
    ) { }

    public transformForVoluntaryChangeConfirmation(paymentEvent: OnSuccessEvent): any {
        const sessionData = this.getSessionData();
        this.validateRequiredSessionData(sessionData);

        return this.buildVoluntaryChangePayload(paymentEvent, sessionData);
    }


    private getSessionData(): { fareData: any; bookingInfo: any; voucherInfo: any } {
        return {
            fareData: this.sessionStorage.get<any>(PAYMENT_SESSION_KEYS.FARE_DATA),
            bookingInfo: this.sessionStorage.get<any>(PAYMENT_SESSION_KEYS.BOOKING_INFO),
            voucherInfo: this.sessionStorage.get<any>(PAYMENT_SESSION_KEYS.VOUCHER_INFO)
        };
    }

    private validateRequiredSessionData(sessionData: { fareData: any; bookingInfo: any }): void {
        const missingData: string[] = [];

        if (!sessionData.fareData) {
            missingData.push(PAYMENT_SESSION_KEYS.FARE_DATA);
        }
        if (!sessionData.bookingInfo) {
            missingData.push(PAYMENT_SESSION_KEYS.BOOKING_INFO);
        }

        if (missingData.length > 0) {
            throw new Error(
                `IssueOrderInfoTransformerService: Missing required data in sessionStorage: ${missingData.join(', ')}`
            );
        }
    }

    private buildVoluntaryChangePayload(
        paymentEvent: OnSuccessEvent,
        sessionData: { fareData: any; bookingInfo: any; voucherInfo: any }
    ): any {
        const { fareData, bookingInfo, voucherInfo } = sessionData;
        const firstOffer = this.getFirstOffer(fareData);

        return {
            contextMetadata: this.buildContextMetadata(fareData),
            total: this.calculateTotal(fareData, voucherInfo),
            order: this.buildOrderSection(fareData, bookingInfo, firstOffer),
            passengers: bookingInfo.passengers,
            tickets: bookingInfo.tickets || [],
            warnings: firstOffer?.warnings || [],
            paymentMethod: this.buildPaymentMethod(paymentEvent, bookingInfo)
        };
    }

    private getFirstOffer(fareData: any): any {
        return fareData?.offers?.[0];
    }

    private buildOrderSection(fareData: any, bookingInfo: any, firstOffer: any): any {
        const order = bookingInfo.order || {};

        return {
            orderId: order.orderId,
            bookingReferences: order.bookingReferences,
            price: this.buildOrderPrice(fareData),
            orderItems: order.orderItems,
            slices: this.transformSlices(firstOffer?.slices || []),
            primaryContactInfo: order.primaryContactInfo
        };
    }

    private buildContextMetadata(fareData: any): any {
        const metadata = this.getFareContextMetadata(fareData);

        return {
            currencies: metadata?.currencies || [],
            language: metadata?.language || DEFAULT_CONTEXT_METADATA.LANGUAGE,
            country: metadata?.country || DEFAULT_CONTEXT_METADATA.COUNTRY
        };
    }

    private getFareContextMetadata(fareData: any): any {
        return fareData?.contextMetadata;
    }

    private calculateTotal(fareData: any, voucherInfo: any): number {
        const baseTotal = this.getBaseTotal(fareData);
        return this.applyVoucherDiscount(baseTotal, voucherInfo);
    }

    private getBaseTotal(fareData: any): number {
        const compensationTotal = this.getCompensationTotal(fareData);

        if (this.isValidNumber(compensationTotal)) {
            return compensationTotal;
        }

        return this.getOfferTotal(fareData);
    }


    private getCompensationTotal(fareData: any): number | undefined {
        return fareData?.compensationInfo?.totalCost;
    }

    private getOfferTotal(fareData: any): number {
        const firstOffer = this.getFirstOffer(fareData);
        const total = firstOffer?.price?.total;

        if (!this.isValidNumber(total)) {
            throw new Error(
                'IssueOrderInfoTransformerService: Cannot confirm payment without valid offer total'
            );
        }

        return total;
    }

    private isValidNumber(value: any): value is number {
        return value !== null && value !== undefined && typeof value === 'number';
    }

    private applyVoucherDiscount(total: number, voucherInfo: any): number {
        if (!voucherInfo?.amount) {
            return total;
        }

        if (typeof voucherInfo.amount === 'number') {
            return total - voucherInfo.amount;
        }

        return total;
    }

    private buildOrderPrice(fareData: any): any {
        const price = this.getOfferPrice(fareData);

        if (!price) {
            return undefined;
        }

        return this.buildPriceObject(price);
    }

    private getOfferPrice(fareData: any): any {
        const firstOffer = this.getFirstOffer(fareData);
        return firstOffer?.price;
    }

    private buildPriceObject(price: any): any {
        const fare = price.fare;
        const tax = price.tax;
        const total = price.total;

        if (!this.isValidPrice(fare, tax, total)) {
            throw new Error(
                'IssueOrderInfoTransformerService: Price must contain valid numeric values for fare, tax and total'
            );
        }

        return {
            fare,
            tax,
            total,
            currency: price.currency || DEFAULT_CONTEXT_METADATA.CURRENCY,
            ticketingFee: 0
        };
    }

    private isValidPrice(fare: any, tax: any, total: any): boolean {
        return this.isValidNumber(fare) && this.isValidNumber(tax) && this.isValidNumber(total);
    }

    private transformSlices(fareSlices: any[]): any[] {
        return fareSlices.map(slice => ({
            sliceId: slice.sliceId,
            departureDateTime: slice.departureDateTime,
            arrivalDateTime: slice.arrivalDateTime,
            duration: slice.duration,
            stopsNumber: slice.stopsNumber,
            price: slice.price,
            detailedPrices: slice.detailedPrices,
            segments: slice.segments.map(seg => ({
                id: seg.id,
                departure: {
                    code: seg.departure.code,
                    name: seg.departure.name,
                    terminal: seg.departure.terminal,
                    city: {
                        code: seg.departure.city.code,
                        description: seg.departure.city.description,
                        countryCode: seg.departure.city.countryCode,
                        country: seg.departure.city.country
                    }
                },
                arrival: {
                    code: seg.arrival.code,
                    name: seg.arrival.name,
                    terminal: seg.arrival.terminal,
                    city: {
                        code: seg.arrival.city.code,
                        description: seg.arrival.city.description,
                        countryCode: seg.arrival.city.countryCode,
                        country: seg.arrival.city.country
                    }
                },
                flight: {
                    marketingCarrier: seg.flight.marketingCarrier,
                    operationalCarrier: seg.flight.operationalCarrier,
                    marketingFlightNumber: seg.flight.marketingFlightNumber,
                    operationalFlightNumber: seg.flight.operationalFlightNumber,
                    operationalDisclosure: seg.flight.operationalDisclosure,
                    aircraft: seg.flight.aircraft
                },
                cabin: {
                    rbd: seg.cabin.rbd,
                    bookingCode: seg.cabin.bookingCode,
                    bookingClass: seg.cabin.bookingClass,
                    cabinDescription: seg.cabin.cabinDescription || seg.cabin.bookingClass,
                    fareFamily: seg.cabin.fareFamily
                },
                departureDateTime: seg.departureDateTime,
                arrivalDateTime: seg.arrivalDateTime,
                duration: seg.duration,
                overnight: seg.overnight,
                waitingTime: seg.waitingTime
            }))
        }));
    }

    private buildPaymentMethod(paymentEvent: OnSuccessEvent, bookingInfo: any): any {
        const firstPassenger = bookingInfo.passengers?.[0];

        return {
            type: paymentEvent.methodType,
            cardTypeId: this.getCardTypeId(paymentEvent),
            profileCardId: null,
            maskedCreditCard: null,
            payer: this.buildPayerInfo(firstPassenger, bookingInfo),
            associatedDiscount: null,
            offerSelection: false
        };
    }

    private getCardTypeId(paymentEvent: OnSuccessEvent): string | null {
        if (paymentEvent.methodType === 'CREDIT_CARD') {
            return paymentEvent.details?.creditCardType || null;
        }
        return null;
    }


    private buildPayerInfo(firstPassenger: any, bookingInfo: any): any {
        return {
            personalInfo: this.buildPayerPersonalInfo(firstPassenger),
            contactInfo: this.buildPayerContactInfo(bookingInfo),
            idInfo: null,
            address: null
        };
    }

    private buildPayerPersonalInfo(firstPassenger: any): any {
        return {
            name: this.getNamePersonalInfo(firstPassenger),
            surname: this.getSurnamePersonalInfo(firstPassenger)
        };
    }

    private getNamePersonalInfo(firstPassenger: any): string {
        return firstPassenger?.personalInfo?.name ||
            firstPassenger?.externalPersonalInfo?.name || '';
    }

    private getSurnamePersonalInfo(firstPassenger: any): string {
        return firstPassenger?.personalInfo?.surname ||
            firstPassenger?.externalPersonalInfo?.firstSurname || '';
    }

    private buildPayerContactInfo(bookingInfo: any): any {
        const primaryContact = bookingInfo.order?.primaryContactInfo;

        if (primaryContact) {
            return primaryContact;
        }

        return {
            phone: '',
            email: '',
            phoneType: DEFAULT_PHONE_TYPE
        };
    }
}
