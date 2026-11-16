/* eslint-disable @typescript-eslint/naming-convention */
import {
  MemberPlusResponse,
  PartnerMemberPlusResponse,
  ServerLevelIdentifier,
} from "../../../http-services/prlm-mbm/ib-members-data-plus.model";
import { DeepPartial, IbGender } from "../../../general/ib-commons-app.models";
import { IbPlusTierLevels } from "../../../auth/ib-commons-user.models";
import { PersonalDataZeroResponse } from "../../../http-services/pzmm-mbm/ib-personal-data-zero.model";
import { ContactDetailsZeroResponse } from "../../../http-services/pzmm-mbm/ib-contact-details-zero.model";

export type CustomerDataInfoStorage = {
  generalInfo: {
    hashEID?: string | null;
    category?: ServerLevelIdentifier;
    avios?: number | null;
    aviosTransformed?: string | null;
  };
  personalInfo: {
    name: string;
    surname1: string;
    surname2?: string;
    gender: IbGender;
    contactEmail: string;
    telecomAddresses: Partial<TelecomAddressCustomerDataInfoStorage>;
    alarms: unknown;
    ibPlusNumber?: string;
    dumboInfo?: {
      percentDiscount: string;
      voucherId: string;
    };
  };
  beneficiaries?: {
    ibPlusNumber: string;
  };
  partners?: PartnerMemberPlusResponse[];
  largeFamilyInfo: {
    category: null;
    docNumber: null;
    zipCode: null;
  };
  residentInfo: {
    area: -1;
  };
  acceptedTermsAndConditions: false;
  otherStatuses?: {
    isRedemptionEnabled: boolean;
  };
};

export type CustomerDataONBStorage = {
  segmento: number;
  rolCIP: string;
  userID: string;
  name: string;
  surname: string;
  surnames: string;
  email: string;
  preferredLanguage: string;
  puntos: number;
  publicis: string;
  CIF: string;
  EstadoUsuario: string;
  NivelUsuario: string;
  dataLanguage: string;
};

export type TelecomAddressCustomerDataInfoStorage = {
  deviceType: "MOBILE" | "PHONE";
  type: "PERSONAL";
  preferenceIndicator: boolean;
  number: string | null;
  countryDiallingCode: string | null;
};

export type IberiaWebUser =
  | IberiaPlusUser
  | IbAnonymousUser
  | IberiaZeroUser
  | IberiaONBUser;

export type PartialIberiaWebUser = DeepPartial<IberiaWebUser>;

export type IbAnonymousUser = {
  appUserInfo: {
    logged: false;
    userType: "ANONYMOUS";
  };
};

export type IberiaZeroUser = {
  appUserInfo: {
    logged: true;
    userType: "IB_ZERO";
    permanentUser: boolean;
  };
  personalInfo: IberiaPersonalInfo;
  serviceResponse: [PersonalDataZeroResponse, ContactDetailsZeroResponse];
};

export type IberiaPlusUser = {
  appUserInfo: {
    logged: true;
    userType: "IB_PLUS";
    permanentUser: boolean;
    frequentFlyer: string;
    avios: number;
    tierLevel: IbPlusTierLevels;
  };
  personalInfo: IberiaPersonalInfo;
  serviceResponse: MemberPlusResponse;
};

export type IberiaONBUser = {
  appUserInfo: {
    logged: true;
    userType: "ONB";
    points: number;
  };
  personalInfo?: IberiaPersonalInfo;
};

export type IberiaPersonalInfo = {
  name: string;
  surname: string;
  secondSurname?: string;
  gender: IbGender;
  email: string;
  phone?: {
    number: string;
    prefix: string;
  };
};
