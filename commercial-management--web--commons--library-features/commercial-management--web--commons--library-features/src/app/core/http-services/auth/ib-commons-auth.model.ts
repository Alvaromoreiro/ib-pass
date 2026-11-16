/* eslint-disable @typescript-eslint/naming-convention */

export type IntrospectResponse = {
  active: boolean;
  client_id: string;
  exp: number;
  iat: number;
  nbf: number;
  scope: string;
  sub: string;
  token_type: string;
  username: string;
};

export type SalesforceTokenResponse = {
  access_token: string;
  id: string;
  instance_url: string;
  issued_at: string;
  scope: string;
  sfdc_community_url: string;
  sfdc_community_id: string;
  signature: string;
  token_type: string;
};

export type IbisTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  id_token: string;
  not_before_policy: number;
  refresh_expires_in: number;
  session_state: string;
  token_type: string;
};
