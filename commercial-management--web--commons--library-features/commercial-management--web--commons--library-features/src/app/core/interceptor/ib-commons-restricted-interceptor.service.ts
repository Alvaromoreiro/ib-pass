/* eslint-disable @typescript-eslint/naming-convention */
/* NAMING NOT DECLARED FROM FRONT */
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpContext,
} from "@angular/common/http";
import { Observable } from "rxjs";
import {
  SKIP_AUTH_INTERCEPTOR,
  SKIP_HEADER_INTERCEPTOR,
  SERVICE_IN_RESTRICTED_AREA,
} from "ib-web-commons/proxies";

@Injectable({
  providedIn: "root",
})
export class IbCRestrictedInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const isIberiaWebContent = req.url.includes("/iberia-web-content/");
    if (
      req.context.get<boolean>(SKIP_HEADER_INTERCEPTOR) ||
      req.context.get<boolean>(SKIP_AUTH_INTERCEPTOR) ||
      isIberiaWebContent
    ) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        context:
          req.context?.set(SERVICE_IN_RESTRICTED_AREA, true) ??
          new HttpContext().set(SERVICE_IN_RESTRICTED_AREA, true),
      }),
    );
  }
}
