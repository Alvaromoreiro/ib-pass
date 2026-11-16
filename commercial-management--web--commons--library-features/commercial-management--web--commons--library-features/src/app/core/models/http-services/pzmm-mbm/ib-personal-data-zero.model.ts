import { IbGender } from "../../general/ib-commons-app.models";

export type PersonalDataZeroResponse = {
  name: string;
  lastName?: string | null;
  birthdate: string;
  gender: IbGender;
  childs: string[];
};
