declare namespace CkiSeatSummary {
    export interface ISegment {
        id: number;
        departure: IFlyInformation;
        arrival: IFlyInformation;
        operatingFlightNumber: IOperatingFlightNumber;
        cabinClass: ICabinClass;
        passengers: IPassenger[]
        changeSeatAvailable: boolean;
    }

    export interface IFlyInformation {
        date: string;
        hour: string;
        airport: IAirportInformation;
        terminal: string
    }

    export interface IAirportInformation {
        code: string;
        description: string;
        country: string;
    }

    export interface IOperatingFlightNumber {
        company: ICompany;
        number: string;
        brand: IOperatingFlightBrand;
    }

    export interface IOperatingFlightBrand {
        companyDisabledURL: string;
        companyURL: string;
    }

    export interface ICompany {
        code: string;
        description: string
    }

    export interface ICabinClass {
        description: string;
    }

    export interface IPassenger {
        id: number;
        name: string;
        surname: string;
        gender?: string;
        type?: string;
        seat: ISeat;
    }

    export interface ISeat {
        row: string;
        column: string;
    }

    export type GoToPageType = 'ibecbp' | 'ckianc';
}