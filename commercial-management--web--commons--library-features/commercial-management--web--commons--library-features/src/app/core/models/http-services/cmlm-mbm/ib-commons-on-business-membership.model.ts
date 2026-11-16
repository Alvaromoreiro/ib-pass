export type IbOnBusinessMembershipResponse = {
  clid: string;
  parentClpNumber?: unknown | null;
  companyInfo: IbOnBusinessMembershipCompanyInfo;
  infoDetailMember: IbOnBusinessInfoDetailMember;
  tierStatus: IbOnBusinessTierStatus;
  memberBalance: number;
  programBaseCurrency: string;
  termsAndConditionAcceptanceDate: string; // Date
  affiliatedSchemaOperator: string;
  enrollmentInfo: IbOnBusinessEnrollmentInfo;
  estimatedTotalAnnualAirSpend: {
    amount: number;
    currency?: unknown;
  };
  numberOfTravelers: string;
  mainTravelDestinations?: unknown | null;
  travelPolicy: string;
  bookingBehaviour: string;
  amountOfTravel: string;
  iberiaCard: IbOnBusinessMembershipIberiaCard;
  userInfo: IbOnBusinessMembershipMemberDetails;
};

export type IbOnBusinessMembershipMemberDetails = {
  login: string;
  firstName: string;
  lastName: string;
  secondLastName: string;
  role: {
    code: string;
    description: string;
  };
  email: string;
  phones: IbOnBusinessMembershipPhone[];
  status: string;
  preferredLanguage: string;
  jobTitle: string;
  title: string;
  joinDate: string;
  travelAgentSpecificData?: unknown | null;
  permissionToDiscount: boolean;
  thirdPartyPrivilege: boolean;
  redemptionPermission: boolean;
  userSpecific: IbOnBusinessMembershipUserSpecific;
};

export type IbOnBusinessMembershipUserSpecific = {
  marketingPermission: IbOnBusinessMembershipMarketingPermission;
  otherLoyalty: {
    partnerCode: string;
    otherLoyaltyNumber: string;
  }[];
  socialNetwork?: string | null;
  identificationDocumentType?: string | null;
  identificationDocumentId?: string | null;
  businessUnitId: number;
};

export type IbOnBusinessMembershipMarketingPermission = {
  schemeOperator: boolean;
  thirdParty: boolean;
  channel: {
    sms: boolean;
    phone: boolean;
    email: boolean;
    postal: boolean;
  };
};

export type IbOnBusinessMembershipPhone = {
  type: string;
  internationDiallingCode: string;
  number: string;
  extentionNumber?: unknown;
};

export type IbOnBusinessMembershipCompanyInfo = {
  companyName: string;
  companyIdType: string;
  companyId: string;
  industrySector: string;
  marketSegment?: unknown;
  address: IbOnBusinessMembershipAddress;
  contactInfo: IbOnBusinessMembershipCompanyContactInfo;
};

export type IbOnBusinessMembershipAddress = {
  addressLine1: string;
  addressLine2?: unknown;
  addressLine3?: unknown;
  country: string;
  state: string;
  zipCode: string;
  city: string;
};

export type IbOnBusinessMembershipCompanyContactInfo = {
  email: string;
  secondaryEmail?: unknown;
  internationalDiallingCode: string;
  phoneNumber: string;
};

export type IbOnBusinessInfoDetailMember = {
  memberStatus: string;
  blackListedInformation: boolean;
  corporateDealInformation: boolean;
  incompleteData: boolean;
  underAudit: boolean;
  companyIdValidatedFlag: boolean;
  additionalDocumentApproved: boolean;
  additionalDocumentationNeeded: boolean;
  manualValidationCompleted: boolean;
  duplicateAccount: boolean;
  travelAgent: boolean;
};

export type IbOnBusinessTierStatus = {
  status: string;
  expirationDate: string;
};

export type IbOnBusinessEnrollmentInfo = {
  source?: unknown;
  channel: string;
  date: string;
  salesmanCode?: unknown;
  refferedByClpNumber?: unknown;
};

export type IbOnBusinessMembershipIberiaCard = {
  cardFlag: boolean;
  cardStartDate?: unknown;
  cardEndDate?: unknown;
};
