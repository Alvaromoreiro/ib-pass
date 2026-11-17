declare namespace CkiSegmentsSelected {
    export interface Segment {
        generalType: string
        isSelected: boolean
        segmentStatus: TSegmentStatus
        segmentStatusReason: string
        segmentStatusReasonCode: string
        passengersStatus: PassengersStatus[]
        airCheck: AirCheck
        checkInStatusTime: any
        id: number
        departure: Airport
        arrival: Airport
        cabinClass: CabinClass
        type: string
        flown: boolean
        airlineName: string
        airlineLogo: string
        flightCode: string
        flightNumber: string
        operatedBy?: string
        detailedType?: string
        deepLinkInformation?: IDeepLink
    }

    export interface PassengersStatus {
        id: number
        status: string
        reasonCode: string
        isSelected: boolean
        name: string
        surname: string
        airCheckDocumentationRequired: boolean
        items: any[]
        inhibitBoardingCard: InhibitBoardingCard
        flyNow: boolean
    }

    export interface InhibitBoardingCard {
        reason: any[]
    }

    export interface AirCheck {
        status: boolean
        url: string
    }

    export interface Airport {
        cityDescription: string
        cityCode: string
        airportDescription: string
        airportCode: string
        terminal: string
        originalDate: string
        date: Date
        hour: string
    }

    export interface Date {
        weekDay: string
        monthDay: number
        monthNumber: number
        month: string
        year: number
        dateTime: string
    }

    export interface CabinClass {
        code: string
        type: string
        description: string
        fareFamily?: any
        mainClass: string
    }

    export type TSegmentStatus = 'AVAILABLE' | 'SELECTABLE' | 'NOT_AVAILABLE' | 'CHECKED';

    export interface IDeepLink {
        externalCompany?: IExternalCompany
        externalMobileUrl?: string
        externalUrl?: string
        message?: string
        locator?: string
    }

    export interface IExternalCompany {
        code: string
        description: string
    }
}
