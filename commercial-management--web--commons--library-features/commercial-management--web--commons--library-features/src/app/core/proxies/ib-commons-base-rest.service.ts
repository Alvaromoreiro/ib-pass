/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/** INCORRECTLY DETECTED AS UNSAFE ASSIGNMENT **/
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { downgradeToAJSService } from "ib-web-commons/utils";
import { Observable } from "rxjs";
import {
  BaseServiceConfig,
  BaseServiceConfigArrayBuffer,
  BaseServiceConfigBlob,
  BaseServiceConfigJson,
  BaseServiceConfigString,
  IbCRestService,
  IbHttpResponse,
} from "./models/ib-commons-proxy.models";

@Injectable({
  providedIn: "root",
})
export class IbCBaseRestService implements IbCRestService {
  constructor(protected httpClient: HttpClient) {}

  /**
   * @see https://angular.io/api/common/http/HttpClient#get
   * @description Iberia generic base service for all service calls. This method does a GET call to the given url using
   * json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type `T`, unknown by default but the developer should include the type with .get<MyType>()
   * thanks to typescript generics.
   * @example
   * this.http.get<MyType>('my/path');
   * this.http.get<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true) }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  get<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#get
   * @description Iberia generic base service for all service calls. This method does a GET call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.get('my/path', { responseType: 'arraybuffer' });
   * this.http.get<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'arraybuffer' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  get(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#get
   * @description Iberia generic base service for all service calls. This method does a GET call to the given url using
   * string as the response type. In case of support for json, blob or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type `string`.
   * @example
   * this.http.get('my/path', { responseType: 'string' });
   * this.http.get<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'string' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  get(
    url: string,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#get
   * @description Iberia generic base service for all service calls. This method does a GET call to the given url using
   * blob as the response type. In case of support for json, string or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads. Additional headers, skip interceptors with context, params in url, etc.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.get('my/path', { responseType: 'blob' });
   * this.http.get<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'blob' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  get(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  /**
   * Constructs an observable that, when subscribed, causes the configured
   * `GET` request to execute on the server. See the individual overloads for
   * details on the return type.
   */
  get(url: string, config: BaseServiceConfig = {}): Observable<IbHttpResponse> {
    return this.httpClient.get(url, {
      observe: "response",
      responseType: config?.responseType ?? ("json" as any),
      headers: config?.headers,
      context: config?.context,
      withCredentials: config?.withCredentials ?? true,
      reportProgress: config?.reportProgress,
      params: this.getParams(config?.params),
    });
  }

  /**
   * @see https://angular.io/api/common/http/HttpClient#post
   * @description Iberia generic base service for all service calls. This method does a POST call to the given url using
   * json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type `T`, unknown by default but the developer should include the type with .post<MyType>()
   * thanks to typescript generics.
   * @example
   * this.http.post<MyType>('my/path', { name: 'test'});
   * this.http.post<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true) }); //skips iberia headers
   * this.http.post<MyType>('my/path', new HttpParams().set('name', 'test')); // sends the data as urlencoded
   * this.http.post<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#post
   * @description Iberia generic base service for all service calls. This method does a POST call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.post<MyType>('my/path', { name: 'test'}, { responseType: 'arraybuffer' });
   * this.http.post<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'arraybuffer' }); //skips iberia headers
   * this.http.post<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * this.http.post<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#post
   * @description Iberia generic base service for all service calls. This method does a POST call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type 'string'.
   * @example
   * this.http.post<MyType>('my/path', { name: 'test'}, { responseType: 'string' });
   * this.http.post<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'string' }); //skips iberia headers
   * this.http.post<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'string' }); // sends the data as urlencoded
   * this.http.post<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'string' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#post
   * @description Iberia generic base service for all service calls. This method does a POST call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.post<MyType>('my/path', { name: 'test'}, { responseType: 'blob' });
   * this.http.post<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'blob' }); //skips iberia headers
   * this.http.post<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'blob' }); // sends the data as urlencoded
   * this.http.post<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'blob' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  /**
   * Constructs an observable that, when subscribed, causes the configured
   * `POST` request to execute on the server. See the individual overloads for
   * details on the return type.
   */
  post(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return this.httpClient.post(url, data, {
      observe: "response",
      responseType: config?.responseType ?? ("json" as any),
      headers: config?.headers,
      context: config?.context,
      withCredentials: config?.withCredentials ?? true,
      reportProgress: config?.reportProgress,
      params: this.getParams(config?.params),
    });
  }

  /**
   * @see https://angular.io/api/common/http/HttpClient#put
   * @description Iberia generic base service for all service calls. This method does a PUT call to the given url using
   * json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type `T`, unknown by default but the developer should include the type with .put<MyType>()
   * thanks to typescript generics.
   * @example
   * this.http.put<MyType>('my/path', { name: 'test'});
   * this.http.put<MyType>('my/path', new HttpParams().set('name', 'test')); // sends the data as urlencoded
   * this.http.put<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#put
   * @description Iberia generic base service for all service calls. This method does a PUT call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.put<MyType>('my/path', { name: 'test'}, { responseType: 'arraybuffer' });
   * this.http.put<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * this.http.put<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#put
   * @description Iberia generic base service for all service calls. This method does a PUT call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type 'string'.
   * @example
   * this.http.put<MyType>('my/path', { name: 'test'}, { responseType: 'string' });
   * this.http.put<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'string' }); // sends the data as urlencoded
   * this.http.put<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'string' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#put
   * @description Iberia generic base service for all service calls. This method does a PUT call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.put<MyType>('my/path', { name: 'test'}, { responseType: 'blob' });
   * this.http.put<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'blob' }); // sends the data as urlencoded
   * this.http.put<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'blob' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  /**
   * Constructs an observable that, when subscribed, causes the configured
   * `PUT` request to execute on the server. See the individual overloads for
   * details on the return type.
   */
  put(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return this.httpClient.put(url, data, {
      observe: "response",
      responseType: config?.responseType ?? ("json" as any),
      headers: config?.headers,
      context: config?.context,
      withCredentials: config?.withCredentials ?? true,
      reportProgress: config?.reportProgress,
      params: this.getParams(config?.params),
    });
  }

  /**
   * @see https://angular.io/api/common/http/HttpClient#delete
   * @description Iberia generic base service for all service calls. This method does a DELETE call to the given url using
   * json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type `T`, unknown by default but the developer should include the type with .delete<MyType>()
   * thanks to typescript generics.
   * @example
   * this.http.delete<MyType>('my/path');
   * @author Iván Peña Huguet
   */
  delete<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#delete
   * @description Iberia generic base service for all service calls. This method does a DELETE call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.delete<MyType>('my/path', { responseType: 'arraybuffer' });
   * @author Iván Peña Huguet
   */
  delete(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#delete
   * @description Iberia generic base service for all service calls. This method does a DELETE call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type 'string'.
   * @example
   * this.http.delete<MyType>('my/path', { responseType: 'string' });
   * @author Iván Peña Huguet
   */
  delete(
    url: string,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#delete
   * @description Iberia generic base service for all service calls. This method does a DELETE call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.delete<MyType>('my/path', { responseType: 'blob' });
   * @author Iván Peña Huguet
   */
  delete(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  /**
   * Constructs an observable that, when subscribed, causes the configured
   * `DELETE` request to execute on the server. See the individual overloads for
   * details on the return type.
   */
  delete(
    url: string,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return this.httpClient.delete(url, {
      observe: "response",
      responseType: config?.responseType ?? ("json" as any),
      headers: config?.headers,
      context: config?.context,
      withCredentials: config?.withCredentials ?? true,
      reportProgress: config?.reportProgress,
      params: this.getParams(config?.params),
    });
  }

  /**
   * @see https://angular.io/api/common/http/HttpClient#patch
   * @description Iberia generic base service for all service calls. This method does a PATCH call to the given url using
   * json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type `T`, unknown by default but the developer should include the type with .patch<MyType>()
   * thanks to typescript generics.
   * @example
   * this.http.patch<MyType>('my/path', { name: 'test'});
   * this.http.patch<MyType>('my/path', new HttpParams().set('name', 'test')); // sends the data as urlencoded
   * this.http.patch<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#patch
   * @description Iberia generic base service for all service calls. This method does a PATCH call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.patch<MyType>('my/path', { name: 'test'}, { responseType: 'arraybuffer' });
   * this.http.patch<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * this.http.patch<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#patch
   * @description Iberia generic base service for all service calls. This method does a PATCH call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type 'string'.
   * @example
   * this.http.patch<MyType>('my/path', { name: 'test'}, { responseType: 'string' });
   * this.http.patch<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'string' }); // sends the data as urlencoded
   * this.http.patch<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'string' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#patch
   * @description Iberia generic base service for all service calls. This method does a PATCH call to the given url using
   * arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Observable` of [`HttpResponse`]{@link https://angular.io/api/common/http/HttpResponse} type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.patch<MyType>('my/path', { name: 'test'}, { responseType: 'blob' });
   * this.http.patch<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'blob' }); // sends the data as urlencoded
   * this.http.patch<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'blob' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  /**
   * Constructs an observable that, when subscribed, causes the configured
   * `PATCH` request to execute on the server. See the individual overloads for
   * details on the return type.
   */
  patch(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return this.httpClient.patch(url, data, {
      observe: "response",
      responseType: config?.responseType ?? ("json" as any),
      headers: config?.headers,
      context: config?.context,
      withCredentials: config?.withCredentials ?? true,
      reportProgress: config?.reportProgress,
      params: this.getParams(config?.params),
    });
  }

  protected getParams = (
    params?:
      | HttpParams
      | Record<
          string,
          string | number | boolean | readonly (string | number | boolean)[]
        >
      | URLSearchParams,
  ):
    | HttpParams
    | Record<
        string,
        string | number | boolean | readonly (string | number | boolean)[]
      >
    | undefined => {
    if (params instanceof URLSearchParams) {
      return Object.fromEntries(params);
    }
    return params;
  };
}

downgradeToAJSService(
  "IbCBaseRestService",
  IbCBaseRestService,
  "ib-commons-proxies-module",
);
