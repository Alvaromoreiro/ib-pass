export interface SpecialNeeds {
    departureCity: DepartureCity
    arrivalCity: ArrivalCity
    specialNeeds: SpecialNeed[]
    showSpecialNeed: boolean
}

export type DepartureCity = {
    code: string
    name: string
    terminal: string
    city: City
};

export type City = {
    code: string
    description: string
    countryCode: string
    country?: Country
};

export type Country = {
    code: string
    description: string
};

export type ArrivalCity = {
    code: string
    name: string
    terminal: string
    city: City2
};

export type City2 = {
    code: string
    description: string
    countryCode: string
    country?: Country2
};

export type Country2 = {
    code: string
    description: string
};

export type SpecialNeed = {
    serviceCode: string
    text: string
    status: Status,
    description?: string
};

export type Status = {
    code: string
    description: string
};
