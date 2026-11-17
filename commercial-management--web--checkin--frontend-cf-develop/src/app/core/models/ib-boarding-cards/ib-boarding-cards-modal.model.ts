declare namespace CkiBoardingCardModal {
    export interface BoardingCardsModalModel {
        segments: ModalSegmentInfo[]
    }

    export interface ModalSegmentInfo {
        id: string
        formats: Formats[]
        departure: FlyInfo
        arrival: FlyInfo
        operatingFlightNumber: OperatingFlightNumber
        marketingFlightNumber: any
        passengers: Passenger[]
    }

    type Formats = 'PASSBOOK' | 'GOOGLE_WALLET' | 'PDF' | 'QR' | 'NATIVE';

    interface FlyInfo {
        date: string
        terminal: string | null
        airport: Airport
    }

    interface Airport {
        code: string
        description: string
        country: string
    }

    interface OperatingFlightNumber {
        company: Company
        number: string
    }

    interface Company {
        code: string
        description: string
    }

    export interface Passenger {
        id: string
        type: string
        name: string
        surname: string
        biometricBoardingStatus: string
        email?: string
        phone?: string
    }

    export interface BoardingCardsModalMap {
        id: string
        departure: FlyInfoMap
        arrival: FlyInfoMap
        passengers: PassengerMap[]
    }

    export type PassengerMap = Pick<Passenger, 'id' | 'name' | 'surname'> & {
        gender: string;
    };

    interface FlyInfoMap {
        airport: Airport
        date?: string
    }

    export interface DownloadGWEvent {
        passengerId: string
    }

    export interface PrintResultModel {
        passengerId: string
        segmentId: string
    }
}
