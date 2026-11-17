export enum DownloadModeEnum {
    FULL = 'FULL',
    PARTIAL = 'PARTIAL'
}

export interface PrintBoardingCardsData {
    mode?: DownloadModeEnum;
    locator: string;
    sideLocator: string;
    boardingCards: BoardingCardsI[];
    printed: PrintedI[];
}

export interface BoardingCardsI {
    id: string
    companyType: string
    typeOfTransport: string
    estimatedFlightTime: string
    maxWeightBaggage: MaxWeightBaggageI
    departure: FlyInfoI
    arrival: FlyInfoI
    boarding: BoardingI
    flightNumber: FlightNumberI
    passengers: PassengerI[]
}

export interface MaxWeightBaggageI {
    amount: number
    measurementType: string
}

export interface FlyInfoI {
    date: string
    terminal: string
    airport: Airport
}

interface Airport {
    code: string
    description: string
    country: string
}

export interface BoardingI {
    gate: any
    date: string
    limitDate: string
}

export interface FlightNumberI {
    company: Company
    number: string
    operatedBy: any
    marketing: any
}

interface Company {
    code: string
    description: string
}

export interface PassengerI {
    id: string
    name: string
    surname: string
    group?: string
    ticketNumber?: string
    barcode?: string
    barcodeContent?: string
    boardingNumber?: string
    cabinClass?:  ICabinClass
    observations?: any[]
    boardingBaggage?: any
    frequentFlyer?: any
    seat?: ISeat
    extraSeat?: any
    bagTags?: any
    fastTrack?: boolean
    isTsaPreCheck?: boolean
    vip?: boolean
    standby?: boolean
    fastLane?: boolean
    type?: string
    contentType?: string
    isDownloaded?: boolean
}

export interface ICabinClass {
    code: string
    type: string
    description: string
}

export interface ISeat {
    row: string
    column: string
}

export interface PrintedI {
    format: string;
    documents: DocumentsI[]
}

export interface DocumentsI {
    fileName: string;
    base64Bytes: string;
    advertisementImages: number;
    url: string;
    passengerId: string;
    segmentId: string;
}

export interface SelectedSegmentsModel {
    segments: {
        length: number;
        passengers: {
            length: number;
        }
    }
}
