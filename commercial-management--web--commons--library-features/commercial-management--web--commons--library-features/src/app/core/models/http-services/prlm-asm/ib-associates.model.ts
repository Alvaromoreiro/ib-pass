import {
  AssociateTypeEnum,
  RelationDictionary,
} from "./ib-associates-dictionaries.model";

export type AssociatesResponse = {
  totalRecords?: number;
  associates: AssociateResponse[];
};

export type AddAssociateRequest = {
  associateType: AssociateTypeEnum;
  associateMemberIdentifier?: string;
  programmeIdentifier?: string;
  relation: string;
  person: {
    personName: AglPersonNameRequest;
    dateOfBirth: string;
    nationality?: string;
    email?: string;
    phone?: string;
    documentIdentifier?: DocumentIdentifier;
  };
};

export type AddAssociateResponse = {
  associateIdentifier: string;
  error?: {
    errorCode: string;
    errorMessage: string;
  };
};

export type UpdateAssociateRequest = {
  associateIdentifier: string;
  associateType: AssociateTypeEnum;
  associateMemberIdentifier?: string;
  programmeIdentifier: string;
  relation: string;
  person: {
    personName: AglPersonNameResponse;
    dateOfBirth: string;
    nationality?: string;
    email?: string;
    phone?: string;
    documentIdentifier?: DocumentIdentifier;
  };
};

export type UpdateAssociateResponse = {
  success: boolean;
  associateIdentifier: string;
};

export type AssociateResponse = {
  associateType: AssociateTypeEnum;
  relation?: RelationDictionary;
  memberIdentifier?: string;
  programmeIdentifier?: string;
  person?: {
    personName?: AglPersonNameResponse;
    dateOfBirth?: string;
    nationality?: string;
    email?: string;
    phone?: string;
    documentIdentifier?: DocumentIdentifier;
  };
  associateIdentifier: string;
};

export type AglPersonNameResponse = {
  title?: string;
  firstName: string;
  middleName?: string;
  familyName: string;
  secondFamilyName?: string;
};

export type AglPersonNameRequest = {
  title: string;
  firstName: string;
  middleName?: string;
  familyName: string;
  secondFamilyName?: string;
};

export type DocumentIdentifier = {
  documentType: string;
  documentNumber: string;
  expiryDate?: string;
  placeOfIssue?: string;
};
