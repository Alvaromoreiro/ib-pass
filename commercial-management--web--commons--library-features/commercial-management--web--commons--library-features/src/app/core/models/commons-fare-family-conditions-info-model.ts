namespace CommonsFareFamilyConditionsInfo {
  export interface FareFamilyConditionsInfo {
    cabinType: string;
    cabinDescription: string;
    commercialCode: string;
    commercialName: string;
    commercialNameES: string;
    priority: number;
    conditions: Condition[];
    observations: Observation[];
    conditionsPriority: string[];
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
    observationCode: null | string;
  }

  export interface Observation {
    observationCode: number;
    observationText: string;
  }
}
