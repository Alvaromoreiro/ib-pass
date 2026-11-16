import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { IbAkamaiHttpAngularInterceptor } from './ib-akamai-http-interceptor';
import { BookingErrorPageStore, ErrorType } from '../store/ib-booking-error-page.store';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { getRedirectionPath, RouterPathsConstants } from '../constants/ib-booking-router-paths-constants';

class BookingErrorPageStoreMock {
    public setError = jasmine.createSpy('setError');
}

class BookingRedirectionServiceMock {
    public path = jasmine.createSpy('path');
}

describe('IbAkamaiHttpAngularInterceptor', () => {
    let interceptor: IbAkamaiHttpAngularInterceptor;
    let bookingErrorPageStore: BookingErrorPageStoreMock;
    let bookingRedirectionService: BookingRedirectionServiceMock;
    let mockRequest: HttpRequest<unknown>;
    let mockHandler: jasmine.SpyObj<HttpHandler>;
    let dispatchEventSpy: jasmine.Spy;

    beforeEach(() => {
        bookingErrorPageStore = new BookingErrorPageStoreMock();
        bookingRedirectionService = new BookingRedirectionServiceMock();
        dispatchEventSpy = spyOn(window, 'dispatchEvent').and.callThrough();

        TestBed.configureTestingModule({
            providers: [
                IbAkamaiHttpAngularInterceptor,
                { provide: BookingErrorPageStore, useValue: bookingErrorPageStore },
                { provide: BookingRedirectionService, useValue: bookingRedirectionService }
            ]
        });

        interceptor = TestBed.inject(IbAkamaiHttpAngularInterceptor);
        mockRequest = new HttpRequest('GET', '/test-url');
        mockHandler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    describe('when the request succeeds', () => {
        it('should pass the response through without modification', (done) => {
            const mockResponse = { data: 'ok' };
            mockHandler.handle.and.returnValue(of(mockResponse as any));

            interceptor.intercept(mockRequest, mockHandler).subscribe({
                next: (response) => {
                    expect(response).toEqual(mockResponse as any);
                    expect(bookingErrorPageStore.setError).not.toHaveBeenCalled();
                    expect(bookingRedirectionService.path).not.toHaveBeenCalled();
                    expect(dispatchEventSpy).not.toHaveBeenCalled();
                    done();
                }
            });
        });
    });

    describe('when a 429 error occurs', () => {
        let error429: HttpErrorResponse;

        beforeEach(() => {
            error429 = new HttpErrorResponse({ status: 429, url: '/test-url' });
            mockHandler.handle.and.returnValue(throwError(() => error429));
        });

        it('should dispatch the Akamai custom event', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
                    const dispatched = dispatchEventSpy.calls.mostRecent().args[0] as CustomEvent;
                    expect(dispatched.type).toBe('ak_cpr_chlg_init');
                    expect(dispatched.detail.url).toBe(mockRequest.url);
                    done();
                }
            });
        });

        it('should NOT call bookingErrorPageStore.setError', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(bookingErrorPageStore.setError).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should NOT redirect', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(bookingRedirectionService.path).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should rethrow the error', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: (err) => {
                    expect(err).toBe(error429);
                    done();
                }
            });
        });
    });

    describe('when a 403 error occurs', () => {
        let error403: HttpErrorResponse;

        beforeEach(() => {
            error403 = new HttpErrorResponse({ status: 403, url: '/test-url' });
            mockHandler.handle.and.returnValue(throwError(() => error403));
        });

        it('should call bookingErrorPageStore.setError with SECURITY_AKAMAI type', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(bookingErrorPageStore.setError).toHaveBeenCalledWith(
                        ErrorType.SECURITY_AKAMAI,
                        {
                            message: 'Access denied by Akamai security restrictions.',
                            errorCode: 403,
                            requestURL: mockRequest.url
                        }
                    );
                    done();
                }
            });
        });

        it('should redirect to ibbkerror path', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(bookingRedirectionService.path).toHaveBeenCalledWith(
                        getRedirectionPath(RouterPathsConstants.ibbkerror)
                    );
                    done();
                }
            });
        });

        it('should NOT dispatch the Akamai custom event', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(dispatchEventSpy).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should rethrow the error', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: (err) => {
                    expect(err).toBe(error403);
                    done();
                }
            });
        });
    });

    describe('when a non-429/403 HTTP error occurs', () => {
        let error500: HttpErrorResponse;

        beforeEach(() => {
            error500 = new HttpErrorResponse({ status: 500, url: '/test-url' });
            mockHandler.handle.and.returnValue(throwError(() => error500));
        });

        it('should NOT call bookingErrorPageStore.setError', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(bookingErrorPageStore.setError).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should NOT redirect', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(bookingRedirectionService.path).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should NOT dispatch the Akamai custom event', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(dispatchEventSpy).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should rethrow the error', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: (err) => {
                    expect(err).toBe(error500);
                    done();
                }
            });
        });
    });

    describe('when a non-HTTP error occurs', () => {
        let nonHttpError: Error;

        beforeEach(() => {
            nonHttpError = new Error('Network failure');
            mockHandler.handle.and.returnValue(throwError(() => nonHttpError));
        });

        it('should NOT call bookingErrorPageStore.setError', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(bookingErrorPageStore.setError).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should NOT redirect', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(bookingRedirectionService.path).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should NOT dispatch the Akamai custom event', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: () => {
                    expect(dispatchEventSpy).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should rethrow the error', (done) => {
            interceptor.intercept(mockRequest, mockHandler).subscribe({
                error: (err) => {
                    expect(err).toBe(nonHttpError);
                    done();
                }
            });
        });
    });
});
