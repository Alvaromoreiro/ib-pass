import {
  HttpContext,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { GeneralResponseError } from "ib-web-commons/models";

export type ProxyResponse<T = unknown> = {
  data: T;
  code?: number;
};

export type ProxyErrorResponse<T = GeneralResponseError> = {
  data?: T;
  errorCode: number;
};

/**
 * @description Base service config for JSON responses. One of the main features is the possibility
 * to changes contexts to interact with the interceptors.
 * <ul>
 *     <li>SKIP_HEADER_INTERCEPTOR - Skip the normal headers of all Iberia Requests</li>
 *     <li>SKIP_AUTH_INTERCEPTOR - Skip to call token services if the authorization fails</li>
 *     <li>SKIP_RETRY_INTERCEPTOR - Skip retry the request 3 times in case of timeout or server errors</li>
 *     <li>SERVICE_IN_RESTRICTED_AREA - The service is inside an only authorized page, if the auth fails need special attention</li>
 * </ul>
 * @property {'json' | 'arraybuffer' | 'blob' | 'text'} responseType - Response type, changes between overloads. Defaults to 'json'.
 * @property {HttpHeaders | Record<string, string> | URLSearchParams} headers - The headers to add additionally, the authorization and iberia tokens are sent by default, this overrides another configuration.
 * @property {HttpParams | Record<string, string> | URLSearchParams} params - The query params to add to the url, use this instead of adding &a=b&c=d in url.
 * @property {boolean} reportProgress - Report progress special cases.
 * @property {boolean} withCredentials - With credentials option, enabled by default, send additional info in api calls.
 * @property {HttpContext} context - Contexts to interact with interceptors.
 * @see https://angular.io/api/common/http/HttpContext
 */
export type BaseServiceConfig = {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?:
    | HttpParams
    | Record<
        string,
        string | number | boolean | readonly (string | number | boolean)[]
      >
    | URLSearchParams;
  reportProgress?: boolean;
  withCredentials?: boolean;
  context?: HttpContext;
  responseType?: "json" | "arraybuffer" | "blob" | "text";
};

/**
 * @description Base service config for JSON responses. One of the main features is the possibility
 * to changes contexts to interact with the interceptors.
 * <ul>
 *     <li>SKIP_HEADER_INTERCEPTOR - Skip the normal headers of all Iberia Requests</li>
 *     <li>SKIP_AUTH_INTERCEPTOR - Skip to call token services if the authorization fails</li>
 *     <li>SKIP_RETRY_INTERCEPTOR - Skip retry the request 3 times in case of timeout or server errors</li>
 *     <li>SERVICE_IN_RESTRICTED_AREA - The service is inside an only authorized page, if the auth fails need special attention</li>
 * </ul>
 * @property {'arraybuffer'} responseType - Response type, changes between overloads. Options: 'json' | 'arraybuffer' | 'blob' | 'text'
 * @property {HttpHeaders | Record<string, string>} headers - The headers to add additionally, the authorization and iberia tokens are sent by default, this overrides another configuration.
 * @property {HttpParams | Record<string, string> | URLSearchParams} params - The query params to add to the url, use this instead of adding &a=b&c=d in url.
 * @property {boolean} reportProgress - Report progress special cases.
 * @property {boolean} withCredentials - With credentials option, enabled by default, send additional info in api calls.
 * @property {HttpContext} context - Contexts to interact with interceptors.
 * @see https://angular.io/api/common/http/HttpContext
 */
export type BaseServiceConfigArrayBuffer = BaseServiceConfig & {
  responseType?: "arraybuffer";
};

/**
 * @description Base service config for JSON responses. One of the main features is the possibility
 * to changes contexts to interact with the interceptors.
 * <ul>
 *     <li>SKIP_HEADER_INTERCEPTOR - Skip the normal headers of all Iberia Requests</li>
 *     <li>SKIP_AUTH_INTERCEPTOR - Skip to call token services if the authorization fails</li>
 *     <li>SKIP_RETRY_INTERCEPTOR - Skip retry the request 3 times in case of timeout or server errors</li>
 *     <li>SERVICE_IN_RESTRICTED_AREA - The service is inside an only authorized page, if the auth fails need special attention</li>
 * </ul>
 * @property {'json'} responseType - Response type, changes between overloads. Options: 'json' | 'arraybuffer' | 'blob' | 'text'
 * @property {HttpHeaders | Record<string, string>} headers - The headers to add additionally, the authorization and iberia tokens are sent by default, this overrides another configuration.
 * @property {HttpParams | Record<string, string> | URLSearchParams} params - The query params to add to the url, use this instead of adding &a=b&c=d in url.
 * @property {boolean} reportProgress - Report progress special cases.
 * @property {boolean} withCredentials - With credentials option, enabled by default, send additional info in api calls.
 * @property {HttpContext} context - Contexts to interact with interceptors.
 * @see https://angular.io/api/common/http/HttpContext
 */
export type BaseServiceConfigJson = BaseServiceConfig & {
  responseType?: "json";
};

/**
 * @description Base service config for JSON responses. One of the main features is the possibility
 * to changes contexts to interact with the interceptors.
 * <ul>
 *     <li>SKIP_HEADER_INTERCEPTOR - Skip the normal headers of all Iberia Requests</li>
 *     <li>SKIP_AUTH_INTERCEPTOR - Skip to call token services if the authorization fails</li>
 *     <li>SKIP_RETRY_INTERCEPTOR - Skip retry the request 3 times in case of timeout or server errors</li>
 *     <li>SERVICE_IN_RESTRICTED_AREA - The service is inside an only authorized page, if the auth fails need special attention</li>
 * </ul>
 * @property {'blob'} responseType - Response type, changes between overloads. Options: 'json' | 'arraybuffer' | 'blob' | 'text'
 * @property {HttpHeaders | Record<string, string>} headers - The headers to add additionally, the authorization and iberia tokens are sent by default, this overrides another configuration.
 * @property {HttpParams | Record<string, string> | URLSearchParams} params - The query params to add to the url, use this instead of adding &a=b&c=d in url.
 * @property {boolean} reportProgress - Report progress special cases.
 * @property {boolean} withCredentials - With credentials option, enabled by default, send additional info in api calls.
 * @property {HttpContext} context - Contexts to interact with interceptors.
 * @see https://angular.io/api/common/http/HttpContext
 */
export type BaseServiceConfigBlob = BaseServiceConfig & {
  responseType?: "blob";
};

/**
 * @description Base service config for JSON responses. One of the main features is the possibility
 * to changes contexts to interact with the interceptors.
 * <ul>
 *     <li>SKIP_HEADER_INTERCEPTOR - Skip the normal headers of all Iberia Requests</li>
 *     <li>SKIP_AUTH_INTERCEPTOR - Skip to call token services if the authorization fails</li>
 *     <li>SKIP_RETRY_INTERCEPTOR - Skip retry the request 3 times in case of timeout or server errors</li>
 *     <li>SERVICE_IN_RESTRICTED_AREA - The service is inside an only authorized page, if the auth fails need special attention</li>
 * </ul>
 * @property {'text'} responseType - Response type, changes between overloads. Options: 'json' | 'arraybuffer' | 'blob' | 'text'
 * @property {HttpHeaders | Record<string, string>} headers - The headers to add additionally, the authorization and iberia tokens are sent by default, this overrides another configuration.
 * @property {HttpParams | Record<string, string> | URLSearchParams} params - The query params to add to the url, use this instead of adding &a=b&c=d in url.
 * @property {boolean} reportProgress - Report progress special cases.
 * @property {boolean} withCredentials - With credentials option, enabled by default, send additional info in api calls.
 * @property {HttpContext} context - Contexts to interact with interceptors.
 * @see https://angular.io/api/common/http/HttpContext
 */
export type BaseServiceConfigString = BaseServiceConfig & {
  responseType?: "text";
};

export interface IbCRestService {
  get<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  get(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  get(
    url: string,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  get(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  get(url: string, config?: BaseServiceConfig): Observable<IbHttpResponse>;

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfig,
  ): Observable<IbHttpResponse>;

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfig,
  ): Observable<IbHttpResponse>;

  delete<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  delete(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  delete(
    url: string,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  delete(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  delete(url: string, config?: BaseServiceConfig): Observable<IbHttpResponse>;

  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfig,
  ): Observable<IbHttpResponse>;
}

export interface IbCPromiseRestService {
  get<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  get(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  get(
    url: string,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  get(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  get(url: string, config?: BaseServiceConfig): Promise<ProxyResponse>;

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfig,
  ): Promise<ProxyResponse>;

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfig,
  ): Promise<ProxyResponse>;

  delete<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  delete(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  delete(
    url: string,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  delete(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  delete(url: string, config?: BaseServiceConfig): Promise<ProxyResponse>;

  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfig,
  ): Promise<ProxyResponse>;
}

export interface IbHttpResponse<T = unknown> extends HttpResponse<T> {
  readonly body: T;
}
