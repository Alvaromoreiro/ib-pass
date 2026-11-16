/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/** INCORRECTLY DETECTED AS UNSAFE ASSIGNMENT **/
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  IbCTokenUtilsService,
  downgradeToAJSService,
} from "ib-web-commons/utils";
import { Observable } from "rxjs";
import {
  BaseServiceConfig,
  BaseServiceConfigArrayBuffer,
  BaseServiceConfigBlob,
  BaseServiceConfigJson,
  BaseServiceConfigString,
  IbHttpResponse,
} from "./models/ib-commons-proxy.models";
import { IbCBaseRestService } from "./ib-commons-base-rest.service";

@Injectable({
  providedIn: "root",
})
export class IbCBaseSFService extends IbCBaseRestService {
  constructor(
    protected override httpClient: HttpClient,
    protected tokenUtilsService: IbCTokenUtilsService,
  ) {
    super(httpClient);
  }

  override get<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  override get(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  override get(
    url: string,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  override get(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  override get(
    url: string,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return super.get(url, {
      ...config,
      headers: this.getHeaders(config),
    } as any);
  }

  override post<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  override post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  override post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  override post(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  override post(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return super.post(url, data, {
      ...config,
      headers: this.getHeaders(config),
    } as any);
  }

  override put<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  override put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  override put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  override put(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  override put(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return super.put(url, data, {
      ...config,
      headers: this.getHeaders(config),
    } as any);
  }

  override delete<T = unknown>(
    url: string,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  override delete(
    url: string,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  override delete(
    url: string,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  override delete(
    url: string,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  override delete(
    url: string,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return super.delete(url, {
      ...config,
      headers: this.getHeaders(config),
    } as any);
  }

  override patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigJson,
  ): Observable<IbHttpResponse<T>>;
  override patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigArrayBuffer,
  ): Observable<IbHttpResponse<ArrayBuffer>>;
  override patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigString,
  ): Observable<IbHttpResponse<string>>;
  override patch(
    url: string,
    data?: unknown,
    config?: BaseServiceConfigBlob,
  ): Observable<IbHttpResponse<Blob>>;
  override patch(
    url: string,
    data?: unknown,
    config: BaseServiceConfig = {},
  ): Observable<IbHttpResponse> {
    return super.patch(url, data, {
      ...config,
      headers: this.getHeaders(config),
    } as any);
  }

  private getHeaders(
    config?: BaseServiceConfig,
  ): HttpHeaders | Record<string, string | string[]> {
    let headers: HttpHeaders | Record<string, string | string[]>;
    const sfToken = this.tokenUtilsService.getSFAccessToken() ?? "not found";
    if (config?.headers instanceof HttpHeaders) {
      headers = config.headers.set("X-Salesforce-Token", sfToken);
    } else {
      headers = {
        ...config?.headers,
        // eslint-disable-next-line
        "X-Salesforce-Token": sfToken,
      };
    }
    return headers;
  }
}

downgradeToAJSService(
  "IbCBaseSFService",
  IbCBaseSFService,
  "ib-commons-proxies-module",
);
