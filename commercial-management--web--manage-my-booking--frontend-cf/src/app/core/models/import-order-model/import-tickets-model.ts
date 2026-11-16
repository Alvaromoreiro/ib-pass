namespace ImportOrderData {
    export interface Ticket {
        ticketNumbers: string[] | null;
        type: string;
        orderItemId: string;
        passengerId: string;
        issueDateTime: string;
        fareCalculation: string;
        taxes: TaxesEntity[] | null;
        coupons: CouponsEntity[] | null;
        iataCode: string;
        issueCity: string;
        passengerType: string;
        paymentInfo: PaymentInfo;
        emdsList: null[] | null;
        creditCardFeePrice: CreditCardFeePrice;
        conjunctionTickets: null;
        taxedPrice: Price;
    }
    export interface TaxesEntity {
        code: string;
        amount: number;
        currency: string;
        description: string;
        subcode?: null;
        country?: null;
        carrier?: null;
    }
    export interface CouponsEntity {
        arrival: string;
        departure: string;
        departureDate: string;
        status: string;
        fareBasis: string;
        carrier: string;
        flightNumber: string;
        flightStatus: string;
        operatingCarrier?: null;
        bookingCode: string;
        designator: string;
        couponNumber: string;
        remark?: null;
        baggageDetail: BaggageDetail;
    }
    export interface BaggageDetail {
        freeAllowance: number;
        quantityCode: string;
        unitQualifier?: null;
    }
    export interface PaymentInfo {
        type: string;
        amount: number;
    }
    export interface CreditCardFeePrice {
        fare: number;
        currency: string;
    }
}