
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { catchError, Observable, throwError } from 'rxjs';
import { getRedirectionPath, RouterPathsConstants } from '../constants/ib-booking-router-paths-constants';
import { BookingErrorPageStore, ErrorType } from '../store/ib-booking-error-page.store';
import { launchAkamaiMessage } from './ib-launch-akamai-message';

@Injectable({
    providedIn: 'root'
})
export class IbAkamaiHttpAngularInterceptor implements HttpInterceptor {
    constructor (private bookingErrorPageStore: BookingErrorPageStore,
        private bookingRedirectionService: BookingRedirectionService
    ) { }
    intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return next.handle(request).pipe(
            catchError((error: unknown): Observable<HttpEvent<unknown>> => {
                if (error instanceof HttpErrorResponse && error.status === 429) {
                    launchAkamaiMessage(request);
                }
                if (error instanceof HttpErrorResponse && error.status === 403) {
                    this.bookingErrorPageStore.setError(
                        ErrorType.SECURITY_AKAMAI,
                        {
                            message: 'Access denied by Akamai security restrictions.',
                            errorCode: error.status,
                            requestURL: request.url
                        }
                    );
                    this.bookingRedirectionService.path(getRedirectionPath(RouterPathsConstants.ibbkerror));
                }
                return throwError(() => error);
            })
        );
    }
}
