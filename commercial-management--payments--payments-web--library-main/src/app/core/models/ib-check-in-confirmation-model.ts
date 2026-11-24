namespace CheckinConfirmationModel {

    export type ConfirmationInfo = {
        boardingCards: BoardingCards[],
        locator: string,
        printed: [{
            documents: [{
                advertisementImages: number,
                base64Bytes: string,
                fileName: string
            }],
            format: string
        }],
        sideLocator: string
    };

    export type BoardingCards = {
        arrival :{
            airport: {
                code: string,
                country: string,
                description: string
            },
            date: Date,
            terminal: null | string
        },
        boarding: {
            date: Date,
            gate: null | string,
            limitDate: Date
        },
        cabinClass?: string,
        cabinClassCode?: string,
        companyType: string,
        companyURL?: string,
        departure:{
            airport: {
                code: string,
                country: string,
                description: string
            }
            date: Date
            terminal: null | string
        },
        estimatedFlightTime: string,
        flightNumber: {
            company: {
                code: string,
                description: string
            },
            marketing: null | any,
            number: string,
            operatedBy: string
        },
        franchiseBaggage?: number,
        handBaggage?: number,
        iconURL?: string,
        id: string,
        maxWeightBaggage: {
            amount: number,
            measurementType: string
        },
        passengers: TBoardingCardsPassengers[],
        seatList?: string,
        transformedArrivalDate?: {
            month: string,
            monthDay: number,
            monthNumber: number,
            weekDay: string,
            year: number
        },
        transformedDepartureDate: {
            month: string,
            monthDay: number,
            monthNumber: number,
            weekDay: string,
            year: number
        }
        typeOfTransport: string,
        weatherForecast: null | any
    };

    export type Companies = [{
        airlineName: string,
        iataCompanyCode: string
        url: string
    }];

    export type ConfirmationViewObject = {
        confirmInfo?: ConfirmationInfo,
        rightPanelInfo: {
            pasList: string[],
            segmentLimitHour: any[],
            fastTrackSegments: string[],
            vipSegments: any[]
        },
        lang: string,
        insurance: null | any,
        warnings: null | any,
        rentCarInfo: {
            cars: any[],
            pickUpCity: null | string
        }
    };

    export type Passenger = {
        biometricBoardingStatus: string,
        email: string,
        id: string,
        name: string,
        phone: string,
        surname: string,
        type: string,
        iconClass?: string,
        statusClass?: string,
        statusIconClass?: string,
        statusText?: string
    };

    export type Channel = {
        class: string,
        description: string,
        isSelected: boolean,
        priority: number,
        type: string
    };

    export type Status = {
        id: string,
        segment: string,
        status: string,
        type: string
    };

    export type BiometricStatus = {
        channelList: Channel[],
        downloadFormatSelected: any[],
        formatsList: Channel[],
        indexPassengerSelected: number,
        passengersList: Passenger[],
        passengersStatusBySegment: Status[],
        prefixList: DefaultPhonePrefix[],
        segmentsList: number[],
        selectedTab: number,
        showBiometric: boolean,
        showEmail: boolean,
        showPhone: boolean
    };

    export enum PaymentViewType {
        NEW = 'NEW',
        OLD = 'OLD',
        CHECK = 'CHECK'
    }

    export type TBoardingCardsPassengers = {
        bagTags: null | any,
        barcode: string,
        barcodeContent: string,
        boardingBaggage: {
            franchise: number
        },
        boardingNumber: string,
        cabinClass: {
            code: string,
            description: string,
            type: string
        },
        contentType: string,
        extraSeat: null | any,
        fastTrack: boolean,
        frequentlyFlyer: null | any,
        group: string,
        id: string,
        name: string,
        observations: [],
        seat: {
            column: string,
            row: string
        },
        standby: boolean,
        surname: string,
        ticketNumber: string,
        type: string,
        vip: boolean,
        isDownloaded?: boolean,
        gender?: string,
        inhibitBoardingCard?: {
            status: boolean,
            reason: string[],
            documentRequired: boolean
        }
    };

    export interface TFooterProps {
        checkCompany:  boolean;
        cabinClassTypeLabel: string;
        segment: BoardingCards;
        showInhibitPassengers: boolean;
        isCC: boolean;
        inhibitStorage: boolean;
        showBiometricActive: boolean;
        isBpSubscriptionMode: boolean;
    }

    export interface IFooterValues {
        mail: string;
        passengerName: string;
        passengerSeat: string;
    }
}
