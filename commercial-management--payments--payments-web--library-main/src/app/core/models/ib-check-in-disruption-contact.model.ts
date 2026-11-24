export interface IIBCheckInDisruptionContactApis {
    id: number;
    disruptionContact: IIBCheckInDisruptionContact;
}

export interface IIBCheckInDisruptionContact {
    language: string;
    email: string;
    phone: {
        countryCode: {
            code: string;
            description: string;
        };
        number: string;
    };
}
