/* eslint-disable @typescript-eslint/naming-convention */
/* NAMING NOT DECLARED FROM FRONT */
import { Inject, Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import {
  AJSRootScope,
  CommonsSessionStorageService,
  CommonsRootScope,
  IbCTokenUtilsService,
} from "ib-web-commons/utils";
import { DeviceDetectorService } from "ngx-device-detector";
import { SKIP_HEADER_INTERCEPTOR } from "ib-web-commons/proxies";
import { IbCommonServiceHeader } from "./ib-commons-interceptor.model";

@Injectable({
  providedIn: "root",
})
export class IbCHeadersInterceptorService implements HttpInterceptor {
  constructor(
    @Inject(AJSRootScope) private rootScope: CommonsRootScope,
    private deviceDetector: DeviceDetectorService,
    private sessionStorageService: CommonsSessionStorageService,
    private tokenUtilsService: IbCTokenUtilsService,
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (req.context.get<boolean>(SKIP_HEADER_INTERCEPTOR))
      return next.handle(req);

    const isIberiaWebContent = req.url.includes("/iberia-web-content/");
    if (isIberiaWebContent) {
      return next.handle(req.clone({ withCredentials: false }));
    }

    const headers: IbCommonServiceHeader = {
      "Accept-Language":
        req.headers.get("Accept-Language") ??
        `${this.rootScope.appLang}-${this.rootScope.appMarket}`,
      Authorization:
        req.headers.get("Authorization") ??
        `Bearer ${this.tokenUtilsService.getAuthToken() ?? "not found"}`,
      "Cache-Control": req.headers.get("Cache-Control") ?? "no-cache",
      Pragma: req.headers.get("Pragma") ?? "no-cache",
      "X-Request-AppVersion":
        req.headers.get("X-Request-AppVersion") ??
        this.getMetaTagValueByName("version"),
      "X-Request-OsVersion":
        req.headers.get("X-Request-OsVersion") ??
        `${this.deviceDetector.os?.toLowerCase()}|${this.deviceDetector.os_version?.toLowerCase()}`,
      "X-Request-Device":
        req.headers.get("X-Request-Device") ??
        `${this.deviceDetector.device?.toLowerCase()}|${this.deviceDetector.browser?.toLowerCase()}|${
          this.deviceDetector.browser_version
        }`,
    };
    const previousStepFlow =
      this.sessionStorageService.get<string>("previousStepFlow");
    const actualStepFlow =
      this.sessionStorageService.get<string>("actualStepFlow");
    if (previousStepFlow)
      headers["X-Observations-Origin-Page"] = previousStepFlow;
    if (actualStepFlow) headers["X-Observations-Current-Page"] = actualStepFlow;

    return next.handle(
      req.clone({
        setHeaders: headers,
        withCredentials: req.withCredentials,
      }),
    );
  }

  private getMetaTagValueByName(metaTagName: string): string {
    if (
      typeof metaTagName === "string" &&
      window.document.getElementsByName(metaTagName)?.length > 0
    ) {
      return (
        window.document.getElementsByName(metaTagName)[0] as HTMLMetaElement
      )?.content;
    }
    return "";
  }
}
