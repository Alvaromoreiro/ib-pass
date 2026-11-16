export namespace NotAvaibilityModel {

    export interface LetMeKnowRequest {
        salesforceContactId: string;
        frequentFlier: string;
        email: string;
        name: string;
        surname: string;
        departureAirport: string;
        arrivalAirport: string;
        departure: string;
        arrival: string;
        journey: string;
        departureDate: string; //Momentjs
        returnDate: string; //Momentjs
        nbrAdultSeats: number;
        nbrChildSeats: number;
        fare: any[];
        registrationDate: string;
        language: string;
    }
}
