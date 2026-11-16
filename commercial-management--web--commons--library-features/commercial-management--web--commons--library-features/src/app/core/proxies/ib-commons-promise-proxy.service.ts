/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { lastValueFrom } from "rxjs";
import {
  ProxyResponse,
  ProxyErrorResponse,
  BaseServiceConfigJson,
  IbCPromiseRestService,
  BaseServiceConfigArrayBuffer,
  BaseServiceConfigString,
  BaseServiceConfigBlob,
  IbHttpResponse,
  BaseServiceConfig,
} from "./models/ib-commons-proxy.models";
import { HttpErrorResponse } from "@angular/common/http";
import { IbCBaseRestService } from "./ib-commons-base-rest.service";

/**
 * @classdesc Iberia Class that converts iberia observables base services to promises. This class can be extended passing any other observable service to convert it to promises.
 */
export abstract class IbCPromiseProxyService implements IbCPromiseRestService {
  constructor(protected genericProxyService: IbCBaseRestService) {}

  /**
   * @see https://angular.io/api/common/http/HttpClient#get
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a GET call to the given url using json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, the response
   * body of type `T`, unknown by default but the developer should include the type with typescript generics.
   * @example
   * this.http.get<MyType>('my/path');
   * this.http.get<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true) }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  async get<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#get
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a GET call to the given url using arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.get('my/path', { responseType: 'arraybuffer' });
   * this.http.get<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'arraybuffer' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  async get(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#get
   * @description Iberia generic base service for all service calls. This method does a GET call to the given url using
   * string as the response type. In case of support for json, blob or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type 'string'
   * @example
   * this.http.get('my/path', { responseType: 'string' });
   * this.http.get<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'string' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  async get(
    url: string,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#get
   * @description Iberia generic base service for all service calls. This method does a GET call to the given url using
   * blob as the response type. In case of support for json, string or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads. Additional headers, skip interceptors with context, params in url, etc.
   * @return An `Promise` of `ProxyResponse` type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.get('my/path', { responseType: 'blob' });
   * this.http.get<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'blob' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  async get(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  /**
   * Generic method that returns a Promise of ProxyResponse type doing `GET` request to execute on the server.
   * See the individual overloads for  details on the return type.
   */
  async get(
    url: string,
    config: BaseServiceConfig = {},
  ): Promise<ProxyResponse> {
    return new Promise<ProxyResponse>((resolve, reject) => {
      lastValueFrom(this.genericProxyService.get(url, config as any))
        .then((res) => {
          resolve(this.responseTransformation(res));
        })
        .catch((err: HttpErrorResponse) => {
          reject(this.responseErrorTransformation(err));
        });
    });
  }

  /**
   * @see https://angular.io/api/common/http/HttpClient#post
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a POST call to the given url using json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, the response
   * body of type `T`, unknown by default but the developer should include the type with typescript generics.
   * @example
   * this.http.post<MyType>('my/path');
   * this.http.post<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true) }); //skips iberia headers
   * this.http.post<MyType>('my/path', new HttpParams().set('name', 'test')); // sends the data as urlencoded
   * this.http.post<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#post
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a POST call to the given url using arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.post<MyType>('my/path', { name: 'test'}, { responseType: 'arraybuffer' });
   * this.http.post<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'arraybuffer' }); //skips iberia headers
   * this.http.post<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * this.http.post<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#post
   * @description Iberia generic base service for all service calls. This method does a POST call to the given url using
   * string as the response type. In case of support for json, blob or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type 'string'
   * @example
   * this.http.post<MyType>('my/path', { name: 'test'}, { responseType: 'string' });
   * this.http.post<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'string' }); //skips iberia headers
   * this.http.post<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'string' }); // sends the data as urlencoded
   * this.http.post<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'string' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#post
   * @description Iberia generic base service for all service calls. This method does a POST call to the given url using
   * blob as the response type. In case of support for json, string or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads. Additional headers, skip interceptors with context, params in url, etc.
   * @return An `Promise` of `ProxyResponse` type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.post<MyType>('my/path', { name: 'test'}, { responseType: 'blob' });
   * this.http.post<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'blob' }); //skips iberia headers
   * this.http.post<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'blob' }); // sends the data as urlencoded
   * this.http.post<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'blob' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  /**
   * Generic method that returns a Promise of ProxyResponse type doing `POST` request to execute on the server.
   * See the individual overloads for  details on the return type.
   */
  async post(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Promise<ProxyResponse> {
    return new Promise<ProxyResponse>((resolve, reject) => {
      lastValueFrom(this.genericProxyService.post(url, data, config as any))
        .then((res) => {
          resolve(this.responseTransformation(res));
        })
        .catch((err: HttpErrorResponse) => {
          reject(this.responseErrorTransformation(err));
        });
    });
  }

  /**
   * @see https://angular.io/api/common/http/HttpClient#put
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a PUT call to the given url using json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, the response
   * body of type `T`, unknown by default but the developer should include the type with typescript generics.
   * @example
   * this.http.put<MyType>('my/path');
   * this.http.put<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true) }); //skips iberia headers
   * this.http.put<MyType>('my/path', new HttpParams().set('name', 'test')); // sends the data as urlencoded
   * this.http.put<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#put
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a PUT call to the given url using arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.put<MyType>('my/path', { name: 'test'}, { responseType: 'arraybuffer' });
   * this.http.put<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'arraybuffer' }); //skips iberia headers
   * this.http.put<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * this.http.put<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#put
   * @description Iberia generic base service for all service calls. This method does a PUT call to the given url using
   * string as the response type. In case of support for json, blob or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type 'string'
   * @example
   * this.http.put<MyType>('my/path', { name: 'test'}, { responseType: 'string' });
   * this.http.put<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'string' }); //skips iberia headers
   * this.http.put<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'string' }); // sends the data as urlencoded
   * this.http.put<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'string' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#put
   * @description Iberia generic base service for all service calls. This method does a PUT call to the given url using
   * blob as the response type. In case of support for json, string or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads. Additional headers, skip interceptors with context, params in url, etc.
   * @return An `Promise` of `ProxyResponse` type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.put<MyType>('my/path', { name: 'test'}, { responseType: 'blob' });
   * this.http.put<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'blob' }); //skips iberia headers
   * this.http.put<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'blob' }); // sends the data as urlencoded
   * this.http.put<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'blob' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  /**
   * Generic method that returns a Promise of ProxyResponse type doing `PUT` request to execute on the server.
   * See the individual overloads for  details on the return type.
   */
  async put(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Promise<ProxyResponse> {
    return new Promise<ProxyResponse>((resolve, reject) => {
      lastValueFrom(this.genericProxyService.put(url, data, config as any))
        .then((res) => {
          resolve(this.responseTransformation(res));
        })
        .catch((err: HttpErrorResponse) => {
          reject(this.responseErrorTransformation(err));
        });
    });
  }

  /**
   * @see https://angular.io/api/common/http/HttpClient#delete
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a DELETE call to the given url using json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, the response
   * body of type `T`, unknown by default but the developer should include the type with typescript generics.
   * @example
   * this.http.delete<MyType>('my/path');
   * this.http.delete<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true) }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  async delete<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#delete
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a DELETE call to the given url using arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.delete('my/path', { responseType: 'arraybuffer' });
   * this.http.delete<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'arraybuffer' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  async delete(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#delete
   * @description Iberia generic base service for all service calls. This method does a DELETE call to the given url using
   * string as the response type. In case of support for json, blob or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type 'string'
   * @example
   * this.http.delete('my/path', { responseType: 'string' });
   * this.http.delete<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'string' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  async delete(
    url: string,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#delete
   * @description Iberia generic base service for all service calls. This method does a DELETE call to the given url using
   * blob as the response type. In case of support for json, string or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads. Additional headers, skip interceptors with context, params in url, etc.
   * @return An `Promise` of `ProxyResponse` type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.delete('my/path', { responseType: 'blob' });
   * this.http.delete<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'blob' }); //skips iberia headers
   * @author Iván Peña Huguet
   */
  async delete(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  /**
   * Generic method that returns a Promise of ProxyResponse type doing `DELETE` request to execute on the server.
   * See the individual overloads for  details on the return type.
   */
  async delete(
    url: string,
    config: BaseServiceConfig = {},
  ): Promise<ProxyResponse> {
    return new Promise<ProxyResponse>((resolve, reject) => {
      lastValueFrom(this.genericProxyService.delete(url, config as any))
        .then((res) => {
          resolve(this.responseTransformation(res));
        })
        .catch((err: HttpErrorResponse) => {
          reject(this.responseErrorTransformation(err));
        });
    });
  }

  /**
   * @see https://angular.io/api/common/http/HttpClient#patch
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a PATCH call to the given url using json as the response type. In case of support for arraybuffer, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, the response
   * body of type `T`, unknown by default but the developer should include the type with typescript generics.
   * @example
   * this.http.patch<MyType>('my/path');
   * this.http.patch<MyType>('my/path', { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true) }); //skips iberia headers
   * this.http.patch<MyType>('my/path', new HttpParams().set('name', 'test')); // sends the data as urlencoded
   * this.http.patch<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Promise<ProxyResponse<T>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#patch
   * @description Iberia generic base service for all service calls, but with a promise approach instead of observables.
   * This method does a PATCH call to the given url using arraybuffer as the response type. In case of support for json, blob or string, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type [ArrayBuffer]{@link https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}.
   * @example
   * this.http.patch<MyType>('my/path', { name: 'test'}, { responseType: 'arraybuffer' });
   * this.http.patch<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'arraybuffer' }); //skips iberia headers
   * this.http.patch<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * this.http.patch<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'arraybuffer' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Promise<ProxyResponse<ArrayBuffer>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#patch
   * @description Iberia generic base service for all service calls. This method does a PATCH call to the given url using
   * string as the response type. In case of support for json, blob or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads.
   * @return An `Promise` of 'ProxyResponse' type, an object with the response data and the response code, with the
   * response body of type 'string'
   * @example
   * this.http.patch<MyType>('my/path', { name: 'test'}, { responseType: 'string' });
   * this.http.patch<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'string' }); //skips iberia headers
   * this.http.patch<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'string' }); // sends the data as urlencoded
   * this.http.patch<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'string' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Promise<ProxyResponse<string>>;
  /**
   * @see https://angular.io/api/common/http/HttpClient#patch
   * @description Iberia generic base service for all service calls. This method does a PATCH call to the given url using
   * blob as the response type. In case of support for json, string or arraybuffer, see the respective methods.
   * @param {string} url The endpoint url to be call.
   * @param {unknown} data The body data to be sent in the call.
   * @param {BaseServiceConfigJson} config The configuration object. Changes between overloads. Additional headers, skip interceptors with context, params in url, etc.
   * @return An `Promise` of `ProxyResponse` type,
   * with the response body of type [Blob]{@link https://developer.mozilla.org/es/docs/Web/API/Blob}.
   * @example
   * this.http.patch<MyType>('my/path', { name: 'test'}, { responseType: 'blob' });
   * this.http.patch<MyType>('my/path', { name: 'test'}, { context: new HttpContext().set('SKIP_HEADER_INTERCEPTOR', true), responseType: 'blob' }); //skips iberia headers
   * this.http.patch<MyType>('my/path', new HttpParams().set('name', 'test'), { responseType: 'blob' }); // sends the data as urlencoded
   * this.http.patch<MyType>('my/path', new HttpParams({fromObject: { name: 'test' }}), { responseType: 'blob' }); // sends the data as urlencoded
   * @author Iván Peña Huguet
   */
  async patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Promise<ProxyResponse<Blob>>;
  /**
   * Generic method that returns a Promise of ProxyResponse type doing `PATCH` request to execute on the server.
   * See the individual overloads for  details on the return type.
   */
  async patch(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Promise<ProxyResponse> {
    return new Promise<ProxyResponse>((resolve, reject) => {
      lastValueFrom(this.genericProxyService.patch(url, data, config as any))
        .then((res) => {
          resolve(this.responseTransformation(res));
        })
        .catch((err: HttpErrorResponse) => {
          reject(this.responseErrorTransformation(err));
        });
    });
  }

  protected responseTransformation<T>(
    res: IbHttpResponse<T>,
  ): ProxyResponse<T> {
    return {
      data: res.body,
      code: res.status,
    };
  }

  protected responseErrorTransformation(
    err: HttpErrorResponse,
  ): ProxyErrorResponse<unknown> {
    return {
      data: err.error as unknown,
      errorCode: err.status,
    };
  }
}
