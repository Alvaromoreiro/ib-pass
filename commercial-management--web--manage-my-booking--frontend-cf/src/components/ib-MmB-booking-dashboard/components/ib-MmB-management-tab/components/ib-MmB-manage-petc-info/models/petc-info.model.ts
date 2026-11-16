export interface PetcOrderItem {
    type: string;
    orderItemId: string;
    price: {
        total: number;
        currency: string;
    };
    sliceId: string;
    passengerId: string;
    amount: number;
    emd: string;
    subtype: string;
    segmentIds?: string[];
}

export interface PetcPassenger {
    passengerId: string;
    personalInfo: {
        name: string;
        surname: string;
    };
}

export interface PetcFlightSegment {
    sliceId: string;
    segmentId: string;
    departure: { code: string; name: string };
    arrival: { code: string; name: string };
    flight: { marketingFlightNumber: string };
    departureDateParsed: { formatedDate: string; dateTime: string };
}

export interface PetcFlight {
    segments: PetcFlightSegment[];
}

export interface PetcPet {
    passengerName: string;
    passengerId: string;
    animalType: string;
    subtype: string;
    emd: string;
    isPendingPayment: boolean;
    orderItemId: string;
}

export interface PetcFlightInfo {
    sliceId: string;
    departure: {
        code: string;
        name: string;
    };
    arrival: {
        code: string;
        name: string;
    };
    pets: PetcPet[];
}

export interface PetcModel {
    petcInfo?: PetcFlightInfo[];
    messagePets: string
}

export interface ConsolidatedPetItem extends PetcOrderItem {
  quantity: number;
  totalSum: number;
  totalSumFormatted: string;
  departureCity: {code: string; city: City};
  arrivalCity: {code: string; city: City};
}

interface City {
    description: string;
}
