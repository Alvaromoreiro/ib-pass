export interface FareComparisonModel{
    slices: Slice[];
}

export interface Slice {
    sliceId: string;
    origin: string;
    destination: string;
    previousFareFamily: FareFamily;
    newFareFamily: FareFamily;
}

export interface FareFamily {
    cabinType: string;
    cabinDescription: string;
    commercialCode: string;
    commercialName: string;
    commercialNameES: string;
    priority: number;
    conditions: Condition[];
    conditionsPriority: string[];
    observations?: Observation[]; 
}

export interface Condition {
    code: string;
    name: string;
    text: string;
    units: number | null;
    extendedInfo: ExtendedInfo;
}

export interface ExtendedInfo {
    title: string;
    message: string;
    code: string;
    conditionStatus: boolean;
    observationCode?: string | number | null;
    mobileMessage?: string;
}

export interface Observation {
    observationCode: number;
    observationText: string;
}