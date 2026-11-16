import { Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { OHImportResponse, Slice, Segment, DetailedPrice, VoucherDiscount } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import {
    Ticket, TicketResponse,
    PointsCalculationRequest, Ancillaries,
    AncillariesSlices, PaymentItem,
    SliceResponse, CalcPointsResponse,
    GenBookingSummaryResponse,
    PassengerDetails, FlightSliceDetails,
    FlightDetails, GenFlightResponse,
    CalcPointsForPassengerResponse,
    GenCalAviosSummaryResponse,
    FlightSegmentDetails,
    CreateAncillaryObjectRes,
    FlightSegmentSchedule,
    getAncillaryInfoRes
} from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-calculate-points-transformer-model';
import { Passenger } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';
import { DiscountItem } from '@src/app/shared/components/ib-booking-price-detail-modal/price-detail-modal-models';

@Injectable({
    providedIn: 'root'
})
export class CalculatePointsTransformer {
    constructor () {}

    public genCalAviosSummary (
        fareData: OHImportResponse,
        ancillariesSlices: AncillariesSlices[] = null,
        ancillaries: Ancillaries[] = null,
        onHold = false
    ): GenCalAviosSummaryResponse {
        return {
            currency: this.extractCurrency(fareData),
            flight: this.extractFlightData(fareData, onHold),
            passengers: this.extractPassengersData(
                fareData,
                ancillariesSlices,
                ancillaries,
                onHold
            )
        };

    }

    private extractCurrency (fareData: OHImportResponse) {
        return { code: fareData.order.price.currency };
    }

    private extractFlightData (fareData: OHImportResponse, onHold: boolean): FlightDetails {
        return {
            discounts: this.addDiscounts(
                fareData.order.specialDiscounts,
                fareData.paymentItems,
                fareData.order.voucherDiscount
            ),
            yq: this.calculateYQ(fareData, onHold),
            slices: this.extractSlicesData(fareData)
        };
    }

    private calculateYQ (fareData: OHImportResponse, onHold: boolean): number {
        if (!onHold) return 0;
        const taxes =
            fareData.order.orderItems[0]?.passengerPrices[0]?.taxes || [];
        return taxes
            .filter((tax) => tax.code === 'YQ')
            .reduce((sum, tax) => sum + tax.amount, 0);
    }

    private extractSlicesData (fareData: OHImportResponse): FlightSliceDetails[] {
        return fareData.order.slices.map((slice, index) => ({
            id: slice.sliceId,
            segments: this.extractSegmentsData(slice, fareData, index)
        }));
    }

    private extractSegmentsData (slice: Slice, fareData: OHImportResponse, index: number): FlightSegmentDetails[] {
        return slice.segments.map((seg) =>
            this.createSegmentObject(seg, fareData, index)
        );
    }

    private createSegmentObject (seg: Segment, fareData: OHImportResponse, index: number): FlightSegmentDetails {
        return {
            commercialCode: this.getCommercialCode(seg),
            id: seg.id,
            operatingCarrier: { code: seg.flight.operationalCarrier.code },
            marketingCarrier: { code: seg.flight.marketingCarrier.code },
            schedule: this.createScheduleObject(seg),
            bookingClass: { code: seg.cabin.rbd },
            bookingCabin: { code: seg.cabin?.code },
            fareProduct:
                fareData.fareFamilyConditions[index]?.commercialNameES ||
                fareData.fareFamilyConditions[0]?.commercialNameES
        };
    }

    private getCommercialCode (seg: Segment): string | null {
        return BookingAppConstants.AVAILABLE_COMMERCIAL_CODES.includes(
            seg.cabin?.fareFamily
        )
            ? seg.cabin?.fareFamily
            : null;
    }

    private createScheduleObject (seg: Segment): FlightSegmentSchedule {
        return {
            departureAirportCode: seg.departure.code,
            arrivalAirportCode: seg.arrival.code,
            departureDate: seg.departureDateTime.split(' ')[0]
        };
    }

    private extractPassengersData (
        fareData: OHImportResponse,
        ancillariesSlices: AncillariesSlices[],
        ancillaries: Ancillaries[],
        onHold: boolean
    ): PassengerDetails[]{
        return fareData.passengers.map((passenger) => ({
            id: passenger.passengerId,
            memberIdentifier: passenger.frequentFlyerInfo?.number,
            bookingSummary: this.genBookingSummary(fareData),
            ancillaries: onHold
                ? this.genAncillariesForPassenger(
                    ancillariesSlices,
                    ancillaries,
                    passenger.passengerId
                )
                : [],
            flight: this.genFlight(onHold, fareData, passenger)
        }));
    }

    public transCalcPointsData (data: PointsCalculationRequest): CalcPointsResponse {
        const getAmount = (code: string) =>
            data.totalMonetaryAmount?.filter(
                (el) => el.currency.code === code
            )[0]?.amount || 0;

        return {
            Avios: getAmount(BookingAppConstants.AMOUNT_TYPES.AVIOS),
            Elite: getAmount(BookingAppConstants.AMOUNT_TYPES.ELITE)
        };
    }

    private genFlight (onHold: boolean, fareData: OHImportResponse, passenger: Passenger): GenFlightResponse {
        return {
            slices: fareData.order.slices.map((slice) =>
                this.createSliceObject(slice, passenger, onHold)
            )
        };
    }

    private createSliceObject (slice: Slice, passenger: Passenger, onHold: boolean): SliceResponse {
        if (!onHold) {
            return this.createEmptySliceObject(slice);
        }

        const passengerPrice = this.findPassengerPrice(slice, passenger);

        return this.createSliceObjectFromPassengerPrice(slice, passengerPrice);
    }

    private createEmptySliceObject (slice: Slice): SliceResponse {
        return {
            id: slice.sliceId,
            fare: 0,
            totalFare: 0 };
    }

    private findPassengerPrice (slice: Slice, passenger: Passenger): DetailedPrice {
        return slice.detailedPrices?.find((element) =>
            element.passengerIds.includes(passenger.passengerId)
        );
    }

    private createSliceObjectFromPassengerPrice (slice: Slice, passengerPrice: DetailedPrice): SliceResponse {
        return {
            id: slice.sliceId,
            fare: passengerPrice?.segmentPrices[0]?.price?.fare || null,
            totalFare: passengerPrice?.fare || null
        };
    }

    private genAncillariesForPassenger (
        ancillariesSlices: AncillariesSlices[],
        ancillaries: Ancillaries[],
        passengerId: string
    ): CreateAncillaryObjectRes[] {
        if (!ancillariesSlices || !ancillaries) return [];

        return ancillaries
            .filter(
                (anc) =>
                    anc.type !== 'flight' && anc.passengerId === passengerId
            )
            .map((anc) => this.createAncillaryObject(anc, ancillariesSlices));
    }

    private createAncillaryObject (ancillary: Ancillaries, ancillariesSlices: AncillariesSlices[]): CreateAncillaryObjectRes {
        const sliceInfo = ancillary.sliceId
            ? this.getSliceInfo(ancillary.sliceId, ancillariesSlices)
            : this.getSegmentInfo(ancillary.segmentId, ancillariesSlices);

        return {
            type: this.mapAncillaryType(ancillary.type),
            subtype: ancillary.subtype || null,
            amounts: [
                {
                    fare: ancillary.price.fare,
                    quantity: ancillary.sliceId ? ancillary.amount : 1
                }
            ],
            slices: [
                {
                    id: sliceInfo.sliceId,
                    segments: [{ id: sliceInfo.segmentId }]
                }
            ]
        };
    }

    private mapAncillaryType (type: string): string {
        const possibleAncillaryTypes = {
            baggage: BookingAppConstants.ANCILLARIES_TYPES.BAGGAGE,
            priorityBoarding:
                BookingAppConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING,
            seat: BookingAppConstants.ANCILLARIES_TYPES.SEAT
        };
        return possibleAncillaryTypes[type] || type;
    }

    private getSliceInfo (sliceId: string, ancillariesSlices: AncillariesSlices[]): getAncillaryInfoRes {
        const slice = ancillariesSlices.find((slice) => slice.id === sliceId);
        return { sliceId: slice.id, segmentId: slice.segmentIds[0] };
    }

    private getSegmentInfo (segmentId: string, ancillariesSlices: AncillariesSlices[]): getAncillaryInfoRes {
        const slice = ancillariesSlices.find(
            (segment) => segment.segmentIds[0] === segmentId
        );
        return { sliceId: slice.id, segmentId };
    }

    private genBookingSummary (fareData: OHImportResponse): GenBookingSummaryResponse {
        if (!fareData.tickets) return null;

        return {
            bookingDate: fareData.order.bookingCreationDates[0].creationDate,
            tickets: this.extractTicketsData(fareData.tickets)
        };
    }

    private extractTicketsData (tickets: Ticket[]): TicketResponse[] {
        return tickets?.map((ticket) => ({
            ticketingCarrier: {
                code: this.extractTicketCarrierCode(ticket)
            },
            number: this.extractTicketNumber(ticket),
            issuanceDate: this.extractIssuanceDate(ticket)
        })) || [];
    }

    private extractTicketCarrierCode (ticket: Ticket): string {
        return ticket.ticketNumbers[0].slice(0, 3);
    }

    private extractTicketNumber (ticket: Ticket): string {
        return ticket.ticketNumbers[0].slice(3);
    }

    private extractIssuanceDate (ticket: Ticket): string | null {
        return ticket.issuanceDate ? ticket.issueDateTime.split(' ')[0] : null;
    }

    public transCalcPointsForPassenger (data: PointsCalculationRequest): CalcPointsForPassengerResponse [] {
        return data.passengers.map((passenger) => ({
            id: passenger.id,
            memberIdentifier: passenger.memberIdentifier || null,
            avios: this.extractMonetaryAmount(passenger, 0),
            elite: this.extractMonetaryAmount(passenger, 1)
        }));
    }

    private extractMonetaryAmount (passenger: PassengerDetails, index: number): number {
        return passenger.flight.monetaryAmount[index]?.amount || 0;
    }

    private addDiscounts (
        specialDiscounts: DiscountItem[],
        paymentItems: PaymentItem[],
        voucherDiscount: VoucherDiscount
    ): Array<DiscountItem> {
        const discounts: DiscountItem[] = [
            ...this.processSpecialDiscounts(specialDiscounts),
            ...this.processPaymentItems(paymentItems),
            ...this.processVoucherDiscount(voucherDiscount)
        ];

        return discounts;
    }

    private processSpecialDiscounts (specialDiscounts: DiscountItem[]): DiscountItem[] {
        if (!specialDiscounts) return [];

        return specialDiscounts
            .filter(this.isAvailableDiscount)
            .map((discount) => ({
                type: discount.type,
                percentDiscount: discount.percentDiscount || null,
                totalDiscount: discount.totalDiscount,
                description: discount.description,
                totalFormatted: discount.discountFormatted,
                discountFormatted: discount.discountFormatted
            }));
    }

    private processPaymentItems (paymentItems: PaymentItem[]): DiscountItem[] {
        if (!paymentItems) return [];

        return paymentItems
            .filter(this.isAvailableDiscount)
            .map((discount) => ({
                type: discount.type,
                percentDiscount: discount.percentDiscount || null,
                totalDiscount: discount.total,
                description: discount.description,
                totalFormatted: discount.discountFormatted,
                discountFormatted: discount.discountFormatted
            }));
    }

    private processVoucherDiscount (voucherDiscount: VoucherDiscount): DiscountItem[] | [] {
        if (!this.isAvailableDiscount(voucherDiscount)) return [];

        return [{
            type: voucherDiscount.type,
            percentDiscount: voucherDiscount.percentDiscount || null,
            totalDiscount: voucherDiscount.amount,
            description: voucherDiscount.description,
            discountFormatted: voucherDiscount.formattedAmount
        }];
    }

    private isAvailableDiscount (discount: DiscountItem): boolean {
        let isAvailable = discount &&
        BookingAppConstants.AVAILABLE_AVIOS_DISCOUNTS.includes(discount.type);
        return isAvailable;
    }
}
