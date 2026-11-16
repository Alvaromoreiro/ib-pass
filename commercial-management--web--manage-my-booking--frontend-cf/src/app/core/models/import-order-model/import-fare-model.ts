namespace FareData {
    export interface FareFamily {
        cabinType: string;
        cabinDescription: string;
        commercialCode: string;
        commercialName: string;
        commercialNameES: string;
        priority: number;
        conditions: FareCondition[];
        conditionsPriority: string[];
        observations?: Observation[];
    }

    export interface FareCondition {
        code: string;
        name: string;
        text: string;
        units: number;
        extendedInfo: FareExtendInfo;
    }
    export interface FareExtendInfo {
        title: string;
        message: string;
        code: string;
        conditionStatus: boolean;
        observationCode?: any;
    }

    export interface Observation {
        observationCode: number;
        observationText: string;
    }
}