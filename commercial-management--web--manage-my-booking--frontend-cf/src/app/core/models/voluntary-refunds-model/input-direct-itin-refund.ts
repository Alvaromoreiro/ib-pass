export interface InputDirectItinRefund {
    participants?: null;
    sender?: null;
    actions?: (ActionsEntity)[] | null;
}

export interface ActionsEntity {
    actionType: string;
    orderId?: null;
    owner: string;
    passengers?: (null)[] | null;
}
