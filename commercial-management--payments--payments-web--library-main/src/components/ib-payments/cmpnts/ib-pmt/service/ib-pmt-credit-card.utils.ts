export function findCreditCardTypeByCode<T extends { cardTypeCode?: string }> (
    creditCardTypes: T[] | null | undefined,
    typeCode: string | null | undefined
): T | undefined {
    if (!typeCode || !creditCardTypes?.length) {
        return undefined;
    }
    return creditCardTypes.find((cardType) => cardType.cardTypeCode === typeCode);
}
