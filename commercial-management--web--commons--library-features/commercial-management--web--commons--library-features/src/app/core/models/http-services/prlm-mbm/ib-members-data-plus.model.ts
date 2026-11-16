import { IbGender } from "../../general/ib-commons-app.models";

export type MemberPlusResponse = {
  memberPersonalDetails: PersonalDetailsMemberPlusResponse;
  accounts: AccountMemberPlusResponse[];
  partners: PartnerMemberPlusResponse[];
};

export type PersonalDetailsMemberPlusResponse = {
  enrolmentDate: string;
  termsAndConditions: {
    version: string;
    acceptedDate: string;
  };
  identifier: string;
  person: PersonMemberPlusResponse;
  enrolmentChannel: string;
  status: {
    code: string;
  };
  lastModified: string;
  languagePreference: string;
  otherStatuses: {
    isLoanEnabled: boolean;
    isEligibleForRewardFlightSaver: boolean;
    isEmailValidated: boolean;
    isThirdPartyRedemptionsEnabled: boolean;
    isEligibleForAviosTransfer: boolean;
    isRedemptionEnabled: boolean;
    isEligibleForAviosPurchase: boolean;
    isEligibleForAviosGift: boolean;
    isEligibleForCMA: boolean;
  };
  schemes: SchemeMemberPlusResponse[];
};

export type PersonMemberPlusResponse = {
  personName: {
    firstName: string;
    familyName?: string;
    secondFamilyName?: string;
  };
  emailAddress: {
    email: string;
  };
  profileStatus: string;
  dateOfBirth: string;
  gender: IbGender;
  countryOfResidence: string;
  locale?: string;
  ageCategory: string;
  registeredIdentifiers: IdentifiersMemberPlusResponse[];
  postalAddresses: PostalAddressMemberPlusResponse[];
};

export type AccountMemberPlusResponse = {
  type: "LOAN" | "REWARD" | "TOTAL_REWARD";
  status?: "Active";
  expiryDate?: string;
  lastActivityDate?: string;
  balance: {
    amount: number;
    currency: "AVIOS";
  };
  outstandingLoan?: {
    amount: number;
    currency: "AVIOS";
  };
};

export type PartnerMemberPlusResponse = {
  partnerIdentifier: string;
  partnerName: string;
  type: string;
  campaignIdentifier?: string;
  partnerProduct: PartnerProductMembersPlusResponse;
};

/**
 * @property identifier It is a code from PARTNERS dictionary
 * @property partnerName It is a value from PARTNERS dictionary
 */
export type PartnerProductMembersPlusResponse = {
  identifier: string;
  productName: string;
  productDescription: string;
  productTier: string;
  percentDiscount: number;
  startDate: string;
  endDate?: string;
  priority: number;
  benefitReference?: string;
};

export type IdentifiersMemberPlusResponse = {
  type: string;
  token: string;
  countryOfIssue?: {
    type: string;
    identifier: string;
  };
};

export type PostalAddressMemberPlusResponse = {
  preferenceIndicator: boolean;
  type: string;
  addressLines: (string | null)[];
  postCode?: string;
  country: string;
  county?: string;
  city?: string;
  state?: string;
  shouldValidate: boolean;
  isMemberAvailable: boolean;
};

export type SchemeMemberPlusResponse = {
  schemeIdentifier: string;
  recognitionLevel: {
    recognitionLevelIdentifier: ServerLevelIdentifier;
    expiryDate?: string;
    cardExpiryDate?: string;
    priority?: number;
    joinDate: string;
  };
};

export type ServerLevelIdentifier =
  | "KIDS"
  | "CLASICA"
  | "PLATA"
  | "ORO"
  | "PLATINO"
  | "INFINITA"
  | "IBERIA SINGULAR"
  | "INFINITA PRIME";
