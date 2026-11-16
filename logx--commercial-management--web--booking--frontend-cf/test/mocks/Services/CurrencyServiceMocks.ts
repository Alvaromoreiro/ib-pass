export class CurrencyServiceMock {
    formatPrice = jasmine.createSpy('formatPrice').and.callFake((currencyObj, price): string => {
        return `${price}€`;
    });
    formatAvios = jasmine.createSpy('formatPrice').and.callFake((grouping, avios): string => {
        return `${avios} Avios`;
    });
    get currencyObjExample() {
        return JSON.parse(JSON.stringify({
            code: "EUR",
            description: "Euro",
            symbol: "€",
            alignment: "R",
            groupingSeparator: ",",
            decimalSeparator: ".",
            decimals: 2,
            recommendedDisplay: "symbol"
        }));
    }
    getCurrencyObject = jasmine.createSpy('getCurrencyObject').and.returnValue(this.currencyObjExample);
}
