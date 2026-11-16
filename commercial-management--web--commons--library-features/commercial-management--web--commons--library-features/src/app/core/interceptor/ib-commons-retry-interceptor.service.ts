import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, Observable, switchMap, throwError, timer } from "rxjs";
import { SKIP_RETRY_INTERCEPTOR } from "ib-web-commons/proxies";
import { retry } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class IbCRetryInterceptorService implements HttpInterceptor {
  private readonly DELAY_TIME = 1000;
  private readonly MAX_RETRY = 3;
  private readonly RETRY_CONTROLLED_ERROR_STATUS = [408, 504, 503];

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (req.context.get<boolean>(SKIP_RETRY_INTERCEPTOR)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error: unknown): Observable<HttpEvent<unknown>> => {
        if (error instanceof HttpErrorResponse) {
          return this.handleErrorResponse(error, req, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handleErrorResponse(
    error: HttpErrorResponse,
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (this.RETRY_CONTROLLED_ERROR_STATUS.includes(error.status)) {
      return timer(this.DELAY_TIME).pipe(
        switchMap(() => {
          return next
            .handle(request.clone())
            .pipe(retry({ count: this.MAX_RETRY - 1, delay: this.DELAY_TIME }));
        }),
      );
    }
    return throwError(() => error);
  }
}
