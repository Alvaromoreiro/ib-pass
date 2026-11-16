type ConfigurationNemuru = {
  currency: string;
  decimalSeparator: string;
  thousandSeparator: string;
  locale: string;
};

type InitArguments = {
  clientId: string;
  configuration: ConfigurationNemuru;
};

type AvailableConditionsArguments = {
  amount: number;
};

export type AvailableConditionsResponse = {
  product: string;
  terms: number[];
};

type CalculateConditionsArguments = {
  conditions: {
    amount: number;
    product: string;
  };
};

type AnnualInterest = {
  value: number;
  string: string;
};

type Apr = {
  value: number;
  string: string;
};

type SetupFeeAmount = {
  value: number;
  string: string;
};

type PrincipalAmount = {
  value: number;
  string: string;
};

type InstalmentAmount = {
  value: number;
  string: string;
};

type InstalmentFeeAmount = {
  value: number;
  string: string;
};

type InstalmentTotalAmount = {
  value: number;
  string: string;
};

type DownpaymentAmount = {
  value: number;
  string: string;
};

type DownpaymentFeeAmount = {
  value: number;
  string: string;
};

type DownpaymentTotalAmount = {
  value: number;
  string: string;
};

type LastInstalmentAmount = {
  value: number;
  string: string;
};

type LastInstalmentFeeAmount = {
  value: number;
  string: string;
};

type LastInstalmentTotalAmount = {
  value: number;
  string: string;
};

type TotalAmount = {
  value: number;
  string: string;
};

type TotalInterestAmount = {
  value: number;
  string: string;
};

type TotalInstalmentFeeAmount = {
  value: number;
  string: string;
};

export type CalculateConditionsResponse = {
  term: number;
  product?: string;
  program?: string;
  annualInterest?: AnnualInterest;
  apr?: Apr;
  setupFeeType?: string;
  setupFeeAmount?: SetupFeeAmount;
  principalAmount?: PrincipalAmount;
  instalmentAmount?: InstalmentAmount;
  instalmentFeeAmount?: InstalmentFeeAmount;
  instalmentTotalAmount: InstalmentTotalAmount;
  downpaymentAmount?: DownpaymentAmount;
  downpaymentFeeAmount?: DownpaymentFeeAmount;
  downpaymentTotalAmount?: DownpaymentTotalAmount;
  lastInstalmentAmount?: LastInstalmentAmount;
  lastInstalmentFeeAmount?: LastInstalmentFeeAmount;
  lastInstalmentTotalAmount?: LastInstalmentTotalAmount;
  totalAmount?: TotalAmount;
  totalInterestAmount?: TotalInterestAmount;
  totalInstalmentFeeAmount?: TotalInstalmentFeeAmount;
};

type ObjetWindowNemuru = {
  init: ({ clientId, configuration }: InitArguments) => Promise<unknown>;
  availableConditions: ({
    amount,
  }: AvailableConditionsArguments) => AvailableConditionsResponse[];
  calculateConditions: ({
    conditions,
  }: CalculateConditionsArguments) => CalculateConditionsResponse[];
};

export interface CustomWindowNemuru extends Window {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Nemuru?: ObjetWindowNemuru;
}

export interface Currency {
  code: string;
  description: string;
  symbol: string;
  alignment: string;
  groupingSeparator: string;
  decimalSeparator: string;
  decimals: number;
  recommendedDisplay: string;
}
