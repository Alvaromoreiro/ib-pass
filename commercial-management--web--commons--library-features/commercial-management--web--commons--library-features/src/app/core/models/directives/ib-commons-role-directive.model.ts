import {
  IberiaUserTypes,
  IbPlusTierLevels,
} from "../auth/ib-commons-user.models";

export type IfRoleDirectiveTierLevels = IbPlusTierLevels;

export type IfRoleDirectiveRoles =
  | "LOGGED"
  | "FULL_LOGGED"
  | "SOFT_LOGGED"
  | "IB_PLUS_FULL"
  | "IB_PLUS_SOFT"
  | "IB_ZERO_FULL"
  | "IB_ZERO_SOFT"
  | "ANONYMOUS"
  | IfRoleDirectiveTierLevels
  | IberiaUserTypes;
