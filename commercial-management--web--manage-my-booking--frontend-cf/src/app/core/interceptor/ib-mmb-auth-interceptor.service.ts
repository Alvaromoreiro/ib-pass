/* eslint-disable @typescript-eslint/naming-convention */
import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, race, Subject, throwError, timeout, retry, tap, switchMap, filter, take } from 'rxjs';
import {
    SKIP_AUTH_INTERCEPTOR,
    SKIP_HEADER_INTERCEPTOR,
    SERVICE_IN_RESTRICTED_AREA,
    LOGGED_FLOW_BLOCKING,
    SOFT_RELOAD
} from 'ib-web-commons/proxies';
import { IbCTokenUtilsService, RedirectionService, CommonsRootScope, AJSRootScope } from 'ib-web-commons/utils';
import { IbCChangeStatusUserModalComponent, IbCModalService } from 'ib-web-commons/ib-modal';
import { IbCAuthService } from 'ib-web-commons/http-services';
import { IbCUserStoreRepositoryService } from 'ib-web-commons/services';

@Injectable({
    providedIn: 'root'
})
export class IbMMBAuthInterceptorService implements HttpInterceptor {

    private readonly TOKEN_REFRESH_TIMEOUT = 30000;
    private readonly TOKEN_REFRESH_MAX_RETRY = 1;
    private readonly AUTH_CONTROLLED_ERROR_STATUS = new Set([401, 403]);
    private readonly AVOID_403_RETRY_WHEN_INTERNAL_ERROR_CODES = new Set(['SSE_ORM_6969', 'SSE_ORM_6970']);

    private readonly DELAY_BETWEEN_TOKEN_RETRIES = 1000;
    private refreshTokenInProgress = false;
    private tokenRefreshedSource = new Subject();
    private tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

    constructor (
        private userStoreService: IbCUserStoreRepositoryService,
        private tokenUtilsService: IbCTokenUtilsService,
        private authService: IbCAuthService,
        private redirectionService: RedirectionService,
        private modalService: IbCModalService,
        @Inject(AJSRootScope) private rootScope: CommonsRootScope
    ) {}


    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        if (this.shouldSkipInterceptor.call(this, req)) {
            return next.handle(req);
        }

        return this.checkTokenAndContinue(req, next);
    }

    private shouldSkipInterceptor(req: HttpRequest<unknown>): boolean {
        const isIberiaWebContent = req.url.includes('/iberia-web-content/');
        return req.context.get<boolean>(SKIP_HEADER_INTERCEPTOR) || req.context.get<boolean>(SKIP_AUTH_INTERCEPTOR) || isIberiaWebContent;
    }

    /**
     * @description Check before calling the service if the user has the token needed to avoid unnecessary 401 errors,
     * if the token exists call the service, if not it will call once the service to refresh access tokens (user dependant).
     * If the refresh service fails the flow continues calling the url wanted to keep a trace.
     * If the service wanted throws an error it is handled for 401/403.
     * @private
     */
    private checkTokenAndContinue (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.authService.needsTokenRefresh().pipe(
            switchMap((res) => {
                if (res) {
                    return this.getTokenBefore(request, next);
                }
                return next.handle(request);
            }),
            catchError( (error: unknown): Observable<HttpEvent<unknown>> => {
                if (error instanceof HttpErrorResponse) {
                    return this.handleErrorResponse(error, request, next);
                }
                return throwError(() => error);
            })
        );
    }

    private handleOTPAuthConditions (error: HttpErrorResponse): boolean {
        if(error.status !== 403) return;
        const internalErrors = error?.error?.errors?.map(err => err.code) || [];
        return internalErrors.some(code => this.AVOID_403_RETRY_WHEN_INTERNAL_ERROR_CODES.has(code))
    }


    private handleErrorAuthConditions (error: HttpErrorResponse): boolean {
        if(this.handleOTPAuthConditions(error)) {
            return false; // Process as normal error
        }
        return this.AUTH_CONTROLLED_ERROR_STATUS.has(error.status); // True for 401 and other 403 errors
    }
    /**
     * @description Controls the error with code in the AUTH_CONTROLLED_ERROR_STATUS if not in the controlled error code
     * keep throwing error.
     * @private
     */
    private handleErrorResponse (error: HttpErrorResponse, request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (this.handleErrorAuthConditions(error)) {
            return this.onError401(error, request, next);
        }
        return throwError(() => error);
    }

    /**
     * @description Function to call to get the refresh token before calling the wanted service.
     * @private
     */
    private getTokenBefore (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.refreshToken(new HttpErrorResponse({}), 0).pipe(
            timeout(this.TOKEN_REFRESH_TIMEOUT),
            catchError(() => of(null)),
            switchMap(() => {
                return this.repeatCallWithNewTokens(request, next);
            })
        );
    }

    /**
     * @description Method to control unauthorized errors, it calls the refresh token service needed, repeating the calls to
     * refresh service 3 times. Controls if the refresh token service fails to redirect to home page, change to permanent users
     * or logout the user and might redo the call as anonymous.
     * @private
     */
    private onError401(error: HttpErrorResponse, request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        return this.refreshToken(error).pipe(
            timeout(this.TOKEN_REFRESH_TIMEOUT),
            switchMap(() => {
                return this.repeatCallWithNewTokens(request, next);
            }),
            catchError((lastError: unknown) => {
                if (this.isAuthControlledError(lastError)) {
                    return this.logout().pipe(
                        tap(() => {
                            this.redirectToLoginRestricted(request.context.get<boolean>(LOGGED_FLOW_BLOCKING) || request.context.get<boolean>(SERVICE_IN_RESTRICTED_AREA));
                        }),
                        switchMap(() => {
                            if (!request.context.get<boolean>(LOGGED_FLOW_BLOCKING) && !request.context.get<boolean>(SERVICE_IN_RESTRICTED_AREA)) {
                                return this.getTokenBefore(request, next);
                            }
                            return throwError(() => error);
                        })
                    );
                }
                return throwError(() => lastError);
            })
        );
    }

    private isAuthControlledError(error: unknown): boolean {
        return (typeof error === 'string' && error === 'TOKEN_ERROR') ||
            (error instanceof HttpErrorResponse && this.AUTH_CONTROLLED_ERROR_STATUS.has(error.status));
    }

    /**
     * @description If the service is called inside a logged only page/component the context SERVICE_IN_RESTRICTED_AREA is true and
     * as the service has failed has to be redirected to home page.
     * @private
     */
    private redirectToLoginRestricted (restrictedArea: boolean) {
        if (restrictedArea || this.rootScope.isRedemptionFlow) {
            this.redirectionService.redirectToLoginPage(window.location.href);
        }
    }

    /**
     * When the service fails or has not access token, the user changes to Permanent User (sometimes known as Soft User)
     * In the case of changing to permanent user for the first time a modal is shown and the user will be redirected if inside
     * a protected flow or the page will be reload to get all information.
     * @private
     */
    private showSoftUserChangeInfo (request: HttpRequest<unknown>): Observable<unknown> {
        if (this.authService.softUserChange) {
            this.authService.softUserChange = false;
            this.userStoreService.updateToPermanentUser(true);
            if (!request.context.get<boolean>(SERVICE_IN_RESTRICTED_AREA)) {
                const modal = this.modalService.showGenericComponentModal(IbCChangeStatusUserModalComponent, { modalBlocked: true });
                return race(
                    modal.closed,
                    modal.dismissed
                ).pipe(
                    tap(() => {
                        if (this.rootScope.isRedemptionFlow) {
                            window.location.href = window.location.origin + window.location.pathname + window.location.search;
                        } else if (request.context.get<boolean>(SOFT_RELOAD)) {
                            window.location.reload();
                        }
                    })
                );
            }
            this.redirectToLoginRestricted(true);
            return of(true);
        }
        return of(false);
    }

    /**
     * @description After an error is thrown and the refresh token service is called.
     * Continues the service call wanted in the first place, but changing the tokens with the new ones.
     * @private
     */
    private repeatCallWithNewTokens (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const headers: Record<string, string> = {
            Authorization: `Bearer ${this.tokenUtilsService.getAuthToken() ?? 'not found'}`
        };
        if (request.headers.has('X-Salesforce-Token')) {
            headers['X-Salesforce-Token'] = this.tokenUtilsService.getSFAccessToken() ?? 'not found';
        }
        return this.showSoftUserChangeInfo(request).pipe(
            switchMap(() => next.handle(request.clone({
                setHeaders: headers
            })))
        );
    }

    /**
     * @description Function that calls the refresh token service. This method control parallel and sequential service calls to
     * not call refresh token services more than one time.
     * @private
     */
    private refreshToken (error: HttpErrorResponse, maxRetry?: number): Observable<HttpEvent<unknown>> {
        if (this.refreshTokenInProgress) {
            return new Observable((observer) => {
                this.tokenRefreshed$.subscribe({
                    next: () => {
                        observer.next();
                        observer.complete();
                    }
                });
            });
        }
        this.refreshTokenInProgress = true;
        return this.authService.refreshNecessaryToken().pipe(
            retry({ count: maxRetry ?? this.TOKEN_REFRESH_MAX_RETRY, delay: this.DELAY_BETWEEN_TOKEN_RETRIES }),
            tap(() => {
                this.refreshTokenInProgress = false;
                this.tokenRefreshedSource.next(true);
            }),
            catchError(() => {
                this.refreshTokenInProgress = false;
                return throwError(() => 'TOKEN_ERROR');
            })
        );
    }

    private logout () {
        this.userStoreService.logoutUser();
        return this.userStoreService.getUserState().pipe(
            filter((res) => !res.isLoading),
            take(1)
        );
    }

}
