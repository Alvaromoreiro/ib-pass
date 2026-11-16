export enum OnHoldPayPaymentTypes {
    ONHOLD = 'ONHOLD',
    ONHOLD_CREDITCARD = 'ONHOLD_CREDITCARD',
    ONHOLD_IBERIA_PAY = 'ONHOLD_IBERIA_PAY',
    ONHOLD_IBERIA_PAY_AFOP = 'ONHOLD_IBERIA_PAY_AFOP'
}
export interface OnHoldPaymentMethodType {
    type: keyof typeof OnHoldPayPaymentTypes;
}
export interface OnHoldPayParams {
    orderId: string;
    orderItemsId: string[];
    paymentId: string;
    onHoldOptionId: string;
    phone?: string;
    paymentMethod: OnHoldPaymentMethodType;
}
export interface OnHoldFreeParams {
    orderId: string;
    orderItemsId: string[];
    onHoldOptionId?: string;
    phone?: string;
}
