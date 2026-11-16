/* eslint-disable @typescript-eslint/naming-convention */
/* THE PROPERTY NAMES ARE NOT FRONT RELATED */

export type JWTAccessTokenInformation = {
  jti: string;
  exp: number;
  iss: string;
  iat: number;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  client_session: string;
  "allowed-origins": string[];
  realm_access: {
    roles: string[];
  };
  preferred_username: string;
  name: string;
};

export type IbCardRole =
  | "INFINITAPRIME"
  | "INFINITA"
  | "PLATINO"
  | "ORO"
  | "PLATA"
  | "CLASICA"
  | "KIDS";
