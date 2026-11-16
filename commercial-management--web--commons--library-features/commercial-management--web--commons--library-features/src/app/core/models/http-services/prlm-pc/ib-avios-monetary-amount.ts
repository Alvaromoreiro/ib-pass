namespace AviosMonetaryAmounts {
  export type monetaryAmount = {
    totalMonetaryAmount: TotalMonetaryAmount[];
  };

  export interface TotalMonetaryAmount {
    type: string;
    amount: string;
    breakDownType: string;
    currency: Currency;
  }

  export interface Currency {
    currencyCode: string;
  }
}
