function formatTotalPriceToString (
    value: number,
    currency: Pick<DccModel.DccCurrency,
    'decimalSeparator'
    | 'numberDecimals'
    | 'groupingSeparator'
    >) {
    const { decimalSeparator, numberDecimals, groupingSeparator } = currency;
    const divisor = Math.pow(10, numberDecimals);
    const integerPart = Math.floor(value / divisor).toString();
    const decimalPart = (value % divisor).toString().padStart(numberDecimals, '0');

    let formattedIntegerPart = '';
    let counter = 0;
    for (let i = integerPart.length - 1; i >= 0; i--) {
        formattedIntegerPart = integerPart[i] + formattedIntegerPart;
        counter++;
        if (counter % 3 === 0 && i !== 0) {
            formattedIntegerPart = groupingSeparator + formattedIntegerPart;
        }
    }

    return numberDecimals > 0
        ? `${formattedIntegerPart}${decimalSeparator}${decimalPart}`
        : formattedIntegerPart;
}

export { formatTotalPriceToString };
