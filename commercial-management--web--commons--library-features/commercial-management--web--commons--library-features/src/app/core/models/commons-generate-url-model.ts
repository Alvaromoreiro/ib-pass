namespace CommonsGenerateUrlModel {
    export type OriginDestination = {
        origin: string;
        destination: string;
        date: string;
    };
    export type headerConfig = {
        headers: object;
        withCredentials?: boolean;
    };
    export type BookingUrlParams = {
        modeWeb?: string;
        searchOrigin: string;
        tripType: number;
        senior?: number;
        adult: number;
        young?: number;
        teenager?: number;
        child?: number;
        infant?: number;
        resident?: string;
        largeFamilyType?: string;
        flexDates: boolean;
        preferredCabin: string;
        payWithAvios?: boolean;
        payWithPoints?: boolean;
        ibGroup?: string;
        referralId?: string;
        displayedPrice?: string;
        slices: Slice[];
        userCurrency?: string;
        priceCurrency?: string;
        numTrips?: number;
        originDestinations: OriginDestination[];
        bookingCode1?: string;
        backToUrl?: string;
        codeTracking?: string;
        travelAgent?: string;
        fromMarket?: string;
        fromLanguage?: string;
        flashOffer?: boolean;
        flashOfferId?: string;
    };
    export type Slice = {
        origin: string;
        destination: string;
        date: string;
    };

    export type Passenger = {
        passengerType: string;
        count: number;
    };

    export type NewRequestData = {
        slices: Slice[];
        passengers: Passenger[];
        marketCode: string;
        preferredCabin: string;
    };
    export type CabinSelected = {
        code: string;
        description: string;
        cabinClass: string;
    };

    export type TripOptionSelected = {
        description: string;
        code: number;
    };

    export type CityOrigin = {
        code: string;
        description: string;
        country: string;
    };

    export type CityDestiny = {
        code: string;
        description: string;
        country: string;
    };

    export type PassengersSelected = {
        passengerType: string;
        minPassenger: number;
        maxPassengers: number;
        infoAge: string;
        count: number;
        isActive: boolean;
        isHidden: boolean;
        showMessage: boolean;
    };

    export type Item = {
        description: string;
        value: string;
    };

    export type DesResiConfig = {
        type: string;
        name: string;
        subname: string;
        items: Item[];
    };

    export type DiscountResident = {
        description: string;
        value: string;
    };

    export type DiscountFamily = {
        description: string;
        value: string;
    };

    export type PassengersConditions = {
        passengersCount: number;
        maxChilds: number;
        totalAdults: number;
        passengersWithInfants: number;
    };

    export type Passengers = {
        numberPassengers: number;
        numAdults: number;
        numSeniors: number;
        numYouth: number;
        numTeenager: number;
        numChilds: number;
        numInfants: number;
    };

    export type URLRequestData = {
        payWithAvios: boolean;
        payWithPoints: boolean;
        aviosChecked: boolean;
        selectedOutbondDate: any; //moment type
        selectedReturnDate: any; //moment type
        cabinSelected: CabinSelected;
        tripOptionSelected: TripOptionSelected;
        cityOrigin: CityOrigin;
        cityDestiny: CityDestiny;
        passengersSelected: PassengersSelected[];
        discountResident: DiscountResident;
        discountFamily: DiscountFamily;
        flexDates: boolean;
        passengers: Passengers;
        flashOffer: boolean;
        flashOfferId: string;
    };
}
