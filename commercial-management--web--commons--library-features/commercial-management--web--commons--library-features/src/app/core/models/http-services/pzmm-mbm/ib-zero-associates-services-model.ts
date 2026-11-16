namespace CommonsHttpModels {
  export type ResponseGetCompanionsData = {
    totalRecords: number;
    associates: GetCompanionsData[];
  };

  export type GetCompanionsData = {
    memberIdentifier?: string;
    associateType?: string;
    relation: string;
    programmeIdentifier: string;
    person: Person;
    associateIdentifier?: string;
    associateMemberIdentifier?: number;
  };

  export type Person = {
    personName: PersonName;
    dateOfBirth: string;
    registeredIdentifier?: RegisteredIdentifier;
    relation?: string;
    nationality?: string;
    email?: string;
    documentIdentifier?: DocumentIdentifier;
    phone?: number;
  };

  export type PersonName = {
    title: string;
    firstName: string;
    familyName: string;
    secondFamilyName?: string;
  };

  export type RegisteredIdentifier = {
    type: string;
    token: string;
  };

  export type DocumentIdentifier = {
    documentType: string;
    documentNumber: string;
    expiryDate?: string;
    placeOfIssue?: string;
  };
}
