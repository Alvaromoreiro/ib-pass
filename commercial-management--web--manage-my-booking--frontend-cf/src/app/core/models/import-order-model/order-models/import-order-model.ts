namespace ImportOrderData {
    export interface Order {
        orderId: string;
        status: string;
        slices: SliceData.Slice[] | null;
        price: Price;
        primaryContactInfo: ContactInfo;
        checkedBagAllowances: BagAllowance;
        bookingCreationDates : CreationDate[];
        bookingReferences: BookingReference[];
        orderItems: OrderItems[]
    }

    interface OrderItems {
        type: string;
        orderItemId: string;
        bookingReferences?: BookingReference[];
        price: Price;
        sliceIds?: string[];
        passengerPrices?: PassengerPrice[];
        serviceCode?: string;
        passengerId?: string;
        sliceId?: string;
        segmentId?: string;
        name?: string;
        text?: string;
        description?: string;
        status?: Status;
        amount?: number;
        emd?: string;
        orderItemPaymentInfos?: any[];
        subtype?: string;
        code?: null;
        onHoldTimeLimit?: null;
    }

    interface Status {
      code: string;
      description: string;
    }

    interface PassengerPrice {
      fareCalculation: string;
      passengerId: string;
      price: Price;
      segmentPrices: SegmentPrice[];
      taxes: Tax[];
      orderItemPaymentInfos: any[];
    }

    interface Tax {
      code: string;
      amount: number;
      currency: string;
      description: string;
      subcode: null;
      country: null;
      carrier: null;
    }

    interface SegmentPrice {
      price: null;
      fareCode: string;
      segmentsIds: string[];
      ticketDesignator: string;
      penalties: any[];
      penaltyFlags: null;
    }

    interface Price {
      fare: number;
      tax: number;
      total: number;
      currency: string;
      ticketingFee: number;
    }

    export interface BagAllowance {
        type: string;
        totalQuantity: number;
        segmentIds: string [] | null;
    }

    export interface CreationDate {
        creationDate: string;
        provider:string;
    }

    export interface BookingReference {
        reference: string;
        provider:string;
    }
}
