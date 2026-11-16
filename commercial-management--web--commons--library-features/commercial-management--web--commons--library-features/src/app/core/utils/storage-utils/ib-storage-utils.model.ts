/**
 * Iberia api for all storage utilities, to keep consistency and avoid errors.
 */
export interface IbStorageUtility {
  set(key: string, value: NonNullable<unknown>): void;
  get<T = unknown>(key: string): T | null;
  remove(key: string): void;
}

export type SessionConfig = {
  withPrefix: boolean;
};

export type CookiesConfig = {
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSiteOptions;
};

/**
 * @property expires Expiration time of the cookie to expire, the number is DAYS.
 */
export type SetCookiesConfig = CookiesConfig & {
  expires?: number | Date;
};

export type RemoveCookiesConfig = CookiesConfig;

export type SameSiteOptions = "Strict" | "Lax" | "None";

export type GetEventValues<T> = {
  newValue: T | null;
  oldValue: T | null;
};
export interface JwtPayload {
    [key: string]: unknown;
    exp?: number;
}
