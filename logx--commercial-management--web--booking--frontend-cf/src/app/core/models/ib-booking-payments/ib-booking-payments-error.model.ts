export interface GetPaymentContextError {
    code:        string;
    description: string;
    options:     GetPaymentContextOption[];
    error?:       Error;
}

export interface Error {
    code: string;
}

export interface GetPaymentContextOption {
    code:    string;
    message: string;
}