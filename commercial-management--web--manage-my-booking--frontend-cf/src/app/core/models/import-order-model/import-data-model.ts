namespace ImportOrderData {
    export interface completeOrder{
        flowId:string;
        order: Order;
        passengers:Passenger[] | null;
        tickets:Ticket[] | null;
        paymentItems:PaymentItem[] | null;
        contextMetadata:ContextMetadata | null;
        fareFamilyConditions:FareData.FareFamily [] | null;
        channel:string;
        onHoldInformation:OnHoldInformation;
        relatedContent:RelatedContent[];
        qualifiers:[];
        reportingWeb:reportingWeb;
        obProgram:ObProgram;
        flexibilizationCapabilitiesInformation: Capabilities;
        genericDisruptionCapabilitiesInformation: Capabilities;
        upgInformation:UpgInfo;
        orderFlags:Flag[];
    }

    export interface Flag {
        type:string;
        enabled:boolean;
    }

    export interface UpgInfo {
        url:string;
        flightsInformation:string;
        bidable:boolean;
    }

    export interface Capabilities {
        id:string;
        code:string;
        description:string;
        issueRange:Range;
        flightRange:Range;
    }

    export interface Range {
        since:string | null;
        limit:string | null;
    }

    export interface ObProgram {
        type: string;
        number: string;
    }

    export interface reportingWeb {
        device: string;
        idColective: string;
        officeIata: string;
        iata: string;
        product: string;
    }

    export interface RelatedContent {
        key:string;
        value:string;
    }

    export interface Price {
        fare: number;
        tax: number;
        total: number;
        currency: string;
        ticketingFee: number;
    }
    export interface ContactInfo {
        phone: string;
        email: string;
        phoneType: string;
        confirmationMailOption?: null;
    }

    export interface PaymentItem {
        type:string;
        tokenizedCardNumber: string;
        maskedCardNumber: string;
        authorization: string;
        subtotal: number;
        totalFee: number;
        total: number;
        unityFee: number;
        currency: string;
    }

    export interface ContextMetadata {
        language:string;
        country:string;
        currencies:Currency[];

    }

    export interface Currency {
        code:string;
        description:string;
        symbol:string;
        alignment:string;
        groupingSeparator: string;
        decimalSeparator: string;
        decimals: number;
        recommendedDisplay: string
    }

    export interface OnHoldInformation {
        timeLimits:         Date;
        referenceTimeLimit: Date;
        referenceCity:      ReferenceCity;
        paidDeposit:        PaidDeposit;
        remainingTime:      number;
    }

    export interface PaidDeposit {
        fare:     number;
        currency: string;
    }

    export interface ReferenceCity {
        code:        string;
        description: string;
        countryCode: string;
    }
}
