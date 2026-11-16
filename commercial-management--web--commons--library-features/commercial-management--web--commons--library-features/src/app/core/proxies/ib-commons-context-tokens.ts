import { HttpContextToken } from "@angular/common/http";

export const SKIP_HEADER_INTERCEPTOR = new HttpContextToken(() => false);

export const SKIP_AUTH_INTERCEPTOR = new HttpContextToken(() => false);

export const SKIP_RETRY_INTERCEPTOR = new HttpContextToken(() => false);

export const SERVICE_IN_RESTRICTED_AREA = new HttpContextToken(() => false);

export const LOGGED_FLOW_BLOCKING = new HttpContextToken(() => false);

export const SOFT_RELOAD = new HttpContextToken(() => true);

export const RETRY_COUNT = new HttpContextToken(() => 0);
