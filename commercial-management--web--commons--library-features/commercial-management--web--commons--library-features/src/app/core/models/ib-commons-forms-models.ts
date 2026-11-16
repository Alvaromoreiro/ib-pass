namespace CommonsFormsModelsNamespace {
  interface IDocumentType {
    description: string;
    documentType: string;
  }
  export interface IDocumentTypesFields extends Array<IDocumentType> {
    selected?: IDocumentType;
  }

  type ICountry = {
    code: string;
    description: string;
    isoCode: string;
  };

  export interface ICountries extends Array<ICountry> {
    selected?: ICountry;
  }

  // GENERAL OBJECT TO WORK

  type IDate = {
    id: number;
    name: string;
  };
  export interface IDates extends Array<IDate> {}

  type formMode = "new-document" | "edit-document";

  export interface ItripDocument {
    typeCode: string;
    number: string;
    countryCode: string;
    expiryDate: string;
    id?: string;
  }
  export interface ItripDocuments extends Array<ItripDocument> {}
  export enum FormStyleEnum {
    EDITION_MODE,
    CREATE_MODE,
  }
}
