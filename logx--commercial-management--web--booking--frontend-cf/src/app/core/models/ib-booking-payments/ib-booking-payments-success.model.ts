export interface PaymentSuccessDTO {
    status:       string;
    incidentList?: IncidentItem[];
}

export interface IncidentItem {
    code:    string;
    details: string;
}
