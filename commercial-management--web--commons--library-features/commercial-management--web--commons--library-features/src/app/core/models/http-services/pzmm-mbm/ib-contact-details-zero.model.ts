export type ContactDetailsZeroResponse = {
  additionalInfo: string | null;
  address: {
    street: string;
    streetNumber: number;
    apartment: string;
  } | null;
  city: string | null;
  countryCode: string | null;
  email: string;
  phone: {
    prefix: string | null;
    number: string | null;
  };
  postalCode: string | null;
  province: string | null;
};

export type ContactDetailsZeroRequest = ContactDetailsZeroResponse;
