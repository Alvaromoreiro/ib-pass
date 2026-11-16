export class CurrencyServiceMock {
    formatPrice = jasmine.createSpy('formatPrice').and.callFake((currencyObj, price): string => {
        return `${price}€`;
    });
    get currencyObjExample() {
        return JSON.parse(JSON.stringify({
            description: "Euro",
            currencySymbol: "€",
            alignment: "R",
            groupingSeparator: ".",
            decimalSeparator: ",",
            suffixSymbol: false,
            numberDecimals: 2
        }));
    }
    getCurrencyObject = jasmine.createSpy('getCurrencyObject').and.returnValue(this.currencyObjExample);
}
